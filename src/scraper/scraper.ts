import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { load } = require('cheerio');
import slugify from 'slugify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Brand } from '../modules/brands/entities/brand.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Product } from '../modules/products/entities/product.entity';
import { ProductImage } from '../modules/products/entities/product-image.entity';
import { ProductSpec } from '../modules/products/entities/product-spec.entity';
import { ProductDocument } from '../modules/products/entities/product-document.entity';
import { ProductReview } from '../modules/products/entities/product-review.entity';
import { StockStatus } from '../common/enums/stock-status.enum';

const BASE_URL = 'https://www.janakpositioning.com';

const CATEGORY_PAGES: { name: string; url: string }[] = [
  { name: 'GNSS Receiver', url: '/gnss-receiver.html' },
  { name: 'DGPS Receiver', url: '/dgps-receiver.html' },
  { name: 'Total Station', url: '/total-station.html' },
  { name: 'Survey Grade GNSS Receiver', url: '/survey-grade-gnss-receiver.html' },
  { name: 'DGPS System', url: '/dgps-system.html' },
  { name: 'Differential GPS', url: '/differential-gps.html' },
  { name: 'Electronic Total Station', url: '/electronic-total-station.html' },
  { name: 'RTK Receiver', url: '/rtk-reciever.html' },
  { name: 'Digital Level', url: '/digital-level.html' },
  { name: 'Micro Optic Theodolite', url: '/micro-optic-theodolite.html' },
];

function makeSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

function parsePrice(text: string): number {
  const match = text.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

async function fetchPage(url: string): Promise<any> {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; JanakCrawler/1.0)',
    },
    timeout: 15000,
  });
  return load(response.data);
}

interface ScrapedProduct {
  name: string;
  description: string;
  price: number;
  modelNumber: string;
  brand: string;
  images: string[];
  specs: { key: string; value: string }[];
}

async function scrapeCategory(categoryUrl: string): Promise<ScrapedProduct[]> {
  const url = `${BASE_URL}${categoryUrl}`;
  console.log(`  Fetching: ${url}`);
  const $ = await fetchPage(url);
  const products: ScrapedProduct[] = [];

  // Each product is in a div with class pc or product card container
  $('div.prd-dv, div.prod-det, div[class*="product"]').each((_: any, el: any) => {
    const $el = $(el);

    const name = $el.find('h2, h3, .prd-name, .prod-name').first().text().trim();
    if (!name) return;

    const priceText = $el.find('.price, .prc, [class*="price"]').first().text().trim();
    const price = parsePrice(priceText);

    const description = $el.find('p, .description, .desc').first().text().trim();

    const images: string[] = [];
    $el.find('img').each((_: any, img: any) => {
      const src = $(img).attr('src') || $(img).attr('data-src') || '';
      if (src && (src.includes('imimg.com') || src.includes('janakpositioning'))) {
        const fullUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
        images.push(fullUrl);
      }
    });

    const specs: { key: string; value: string }[] = [];
    $el.find('table tr, .spec-row').each((_: any, row: any) => {
      const cells = $(row).find('td, th');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (key && value) specs.push({ key, value });
      }
    });

    // Try to extract model number from name or specs
    const modelSpec = specs.find((s) => /model/i.test(s.key));
    const modelNumber = modelSpec?.value ?? '';

    // Try to extract brand from name or dedicated element
    const brandEl = $el.find('.brand, [class*="brand"]').first().text().trim();
    const brand = brandEl || extractBrandFromName(name);

    products.push({ name, description, price, modelNumber, brand, images, specs });
  });

  // Fallback: try JSON data embedded in page (dataref1 pattern)
  if (products.length === 0) {
    const html = $.html();
    const jsonMatch = html.match(/dataref1\s*=\s*(\[[\s\S]*?\]);/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        for (const item of data) {
          const name = item.name || item.pname || '';
          if (!name) continue;
          products.push({
            name,
            description: item.desc || item.description || '',
            price: parsePrice(String(item.price || item.minprice || '0')),
            modelNumber: item.model || '',
            brand: item.brand || extractBrandFromName(name),
            images: item.imgurl ? [`https:${item.imgurl}`] : [],
            specs: [],
          });
        }
      } catch {
        // JSON parse failed, continue
      }
    }
  }

  return products;
}

function extractBrandFromName(name: string): string {
  const brands = ['FOIF', 'Javad', 'JANAK', 'Alpha Geo', 'Leica', 'Trimble', 'Topcon'];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  return 'JANAK';
}

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME ?? 'janak_db',
    entities: [Product, ProductImage, ProductSpec, ProductDocument, ProductReview, Category, Brand],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Connected to database');

  const categoryRepo = dataSource.getRepository(Category);
  const brandRepo = dataSource.getRepository(Brand);
  const productRepo = dataSource.getRepository(Product);
  const imageRepo = dataSource.getRepository(ProductImage);
  const specRepo = dataSource.getRepository(ProductSpec);

  for (const { name: categoryName, url: categoryUrl } of CATEGORY_PAGES) {
    console.log(`\nScraping category: ${categoryName}`);

    // Get or create category
    const categorySlug = makeSlug(categoryName);
    let category = await categoryRepo.findOne({ where: { slug: categorySlug } });
    if (!category) {
      category = categoryRepo.create({ name: categoryName, slug: categorySlug });
      await categoryRepo.save(category);
      console.log(`  Created category: ${categoryName}`);
    }

    let scraped: ScrapedProduct[] = [];
    try {
      scraped = await scrapeCategory(categoryUrl);
    } catch (err) {
      console.error(`  Failed to scrape ${categoryUrl}:`, (err as Error).message);
      continue;
    }

    console.log(`  Found ${scraped.length} products`);

    for (const item of scraped) {
      // Skip if product already exists
      const slug = makeSlug(item.name);
      const existing = await productRepo.findOne({ where: { slug } });
      if (existing) {
        console.log(`  Skipping (exists): ${item.name}`);
        continue;
      }

      // Get or create brand
      const brandName = item.brand || 'JANAK';
      const brandSlug = makeSlug(brandName);
      let brand = await brandRepo.findOne({ where: { slug: brandSlug } });
      if (!brand) {
        brand = brandRepo.create({ name: brandName, slug: brandSlug });
        await brandRepo.save(brand);
      }

      // Create product
      const product = new Product();
      product.name = item.name;
      product.slug = slug;
      product.description = item.description || '';
      product.price = item.price || 0;
      product.modelNumber = item.modelNumber || '';
      product.stockStatus = StockStatus.IN_STOCK;
      product.category = category;
      product.brand = brand;
      await productRepo.save(product);

      // Save images
      for (let i = 0; i < item.images.length; i++) {
        const image = imageRepo.create({
          url: item.images[i],
          isPrimary: i === 0,
          sortOrder: i,
          product,
        });
        await imageRepo.save(image);
      }

      // Save specs
      for (let i = 0; i < item.specs.length; i++) {
        const spec = specRepo.create({
          key: item.specs[i].key,
          value: item.specs[i].value,
          sortOrder: i,
          product,
        });
        await specRepo.save(spec);
      }

      console.log(`  Saved: ${item.name} (₹${item.price})`);
    }
  }

  await dataSource.destroy();
  console.log('\nScraping complete!');
}

seed().catch((err) => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
