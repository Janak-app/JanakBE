const axios = require('axios');
const { load } = require('cheerio');
const slugify = require('slugify');
const { DataSource } = require('typeorm');

const BASE_URL = 'https://www.janakpositioning.com';

const CATEGORY_PAGES = [
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

function makeSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

function parsePrice(text) {
  if (!text) return 0;
  const match = text.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function extractBrandFromName(name) {
  const brands = ['FOIF', 'Javad', 'JANAK', 'Alpha Geo', 'Leica', 'Trimble', 'Topcon'];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  return 'JANAK';
}

async function fetchPage(url) {
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JanakCrawler/1.0)' },
    timeout: 15000,
  });
  return load(response.data);
}

async function scrapeCategory(categoryUrl) {
  const url = `${BASE_URL}${categoryUrl}`;
  console.log(`  Fetching: ${url}`);
  const $ = await fetchPage(url);
  const products = [];

  // Try JSON data embedded in page (IndiaMART pattern)
  const html = $.html();
  const jsonMatch = html.match(/dataref1\s*=\s*eval\((\[[\s\S]+?\])\s*\)/) ||
                    html.match(/dataref1\s*=\s*(\[[\s\S]+?\]);/);
  if (jsonMatch) {
    try {
      const cleaned = jsonMatch[1].replace(/,\s*([}\]])/g, '$1');
      const data = JSON.parse(cleaned);
      for (const item of data) {
        const name = item.prd_name || item.name || '';
        if (!name) continue;

        const specs = [];
        if (Array.isArray(item.isq_det_form)) {
          for (const spec of item.isq_det_form) {
            const key = spec.FK_IM_SPEC_MASTER_DESC || '';
            const value = spec.SUPPLIER_RESPONSE_DETAIL || '';
            if (key && value) specs.push({ key, value });
          }
        }

        const brandSpec = specs.find((s) => s.key.toLowerCase() === 'brand');
        const brand = brandSpec?.value || extractBrandFromName(name);

        const images = [];
        if (item.img_path) images.push(item.img_path.startsWith('http') ? item.img_path : `https:${item.img_path}`);
        if (item.img_path1) images.push(item.img_path1.startsWith('http') ? item.img_path1 : `https:${item.img_path1}`);

        products.push({
          name,
          description: '',
          price: parsePrice(item.prd_price || '0'),
          modelNumber: item.prd_code || '',
          brand,
          images,
          specs,
        });
      }
      return products;
    } catch (e) {
      console.log('  JSON parse failed, trying HTML parsing');
    }
  }

  // Fallback: HTML parsing
  $('div.prd-dv, li.lst-unt, .producttitle, .product-listing').each((_, el) => {
    const $el = $(el);
    const name = $el.find('h2, h3, .prd-name, .prodname').first().text().trim();
    if (!name) return;

    const priceText = $el.find('.price, .prc, .price-unit').first().text().trim();
    const price = parsePrice(priceText);
    const description = $el.find('p, .description').first().text().trim();

    const images = [];
    $el.find('img').each((_, img) => {
      const src = $(img).attr('src') || $(img).attr('data-src') || '';
      if (src && src.includes('imimg.com')) {
        images.push(src.startsWith('http') ? src : `https:${src}`);
      }
    });

    const specs = [];
    $el.find('table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (key && value) specs.push({ key, value });
      }
    });

    products.push({
      name,
      description,
      price,
      modelNumber: '',
      brand: extractBrandFromName(name),
      images,
      specs,
    });
  });

  return products;
}

async function seed() {
  const { Brand } = require('/app/dist/modules/brands/entities/brand.entity');
  const { Category } = require('/app/dist/modules/categories/entities/category.entity');
  const { Product } = require('/app/dist/modules/products/entities/product.entity');
  const { ProductImage } = require('/app/dist/modules/products/entities/product-image.entity');
  const { ProductSpec } = require('/app/dist/modules/products/entities/product-spec.entity');
  const { ProductDocument } = require('/app/dist/modules/products/entities/product-document.entity');
  const { ProductReview } = require('/app/dist/modules/products/entities/product-review.entity');
  const { User } = require('/app/dist/modules/users/entities/user.entity');
  const { Cart } = require('/app/dist/modules/cart/entities/cart.entity');
  const { CartItem } = require('/app/dist/modules/cart/entities/cart-item.entity');
  const { SavedItem } = require('/app/dist/modules/cart/entities/saved-item.entity');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'janak_db',
    entities: [Product, ProductImage, ProductSpec, ProductDocument, ProductReview, Category, Brand, User, Cart, CartItem, SavedItem],
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

    const categorySlug = makeSlug(categoryName);
    let category = await categoryRepo.findOne({ where: { slug: categorySlug } });
    if (!category) {
      category = categoryRepo.create({ name: categoryName, slug: categorySlug });
      await categoryRepo.save(category);
      console.log(`  Created category: ${categoryName}`);
    }

    let scraped = [];
    try {
      scraped = await scrapeCategory(categoryUrl);
    } catch (err) {
      console.error(`  Failed to scrape ${categoryUrl}:`, err.message);
      continue;
    }

    console.log(`  Found ${scraped.length} products`);

    for (const item of scraped) {
      const slug = makeSlug(item.name);
      const existing = await productRepo.findOne({ where: { slug } });
      if (existing) {
        console.log(`  Skipping (exists): ${item.name}`);
        continue;
      }

      const brandName = item.brand || 'JANAK';
      const brandSlug = makeSlug(brandName);
      let brand = await brandRepo.findOne({ where: { slug: brandSlug } });
      if (!brand) {
        brand = brandRepo.create({ name: brandName, slug: brandSlug });
        await brandRepo.save(brand);
      }

      const product = new Product();
      product.name = item.name;
      product.slug = slug;
      product.description = item.description || '';
      product.price = item.price || 0;
      product.modelNumber = item.modelNumber || '';
      product.stockStatus = 'in_stock';
      product.category = category;
      product.brand = brand;
      await productRepo.save(product);

      for (let i = 0; i < item.images.length; i++) {
        const image = imageRepo.create({ url: item.images[i], isPrimary: i === 0, sortOrder: i, product });
        await imageRepo.save(image);
      }

      for (let i = 0; i < item.specs.length; i++) {
        const spec = specRepo.create({ key: item.specs[i].key, value: item.specs[i].value, sortOrder: i, product });
        await specRepo.save(spec);
      }

      console.log(`  Saved: ${item.name} (₹${item.price})`);
    }
  }

  await dataSource.destroy();
  console.log('\nScraping complete!');
}

seed().catch((err) => {
  console.error('Scraper failed:', err.message);
  process.exit(1);
});
