/**
 * Image seeder — maps product slugs to image files in public/uploads/products/
 *
 * Run locally (set env vars first):
 *   node src/seeds/seed-images.js
 *
 * Or inside Docker after copying images:
 *   docker exec janak_app node /app/seed-images.js
 */

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'janak_db',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const BASE_URL = process.env.APP_URL || 'http://localhost:3001';

// Maps product slug → image filename (same file exists in all 3 size folders)
const PRODUCT_IMAGES = [
  { slug: 'j-50-gnss',           file: 'J-50 GNSS.png' },
  { slug: 'sigma-series',         file: 'Sigma Series.png' },
  { slug: 'spacexx',              file: 'Space X-GNSS_MII.png' },
  { slug: 'spacexx-lite',         file: 'Space X -Lite-GNSS-4.png' },
  { slug: 't-1m-plus',            file: 'TRIUMPH-1M Plus.png' },
  { slug: 't3-nr',                file: 'T3-NR_MII.png' },
  { slug: 'triumph-1m',           file: 'TRIUMPH-1M.png' },
  { slug: 'triumph-2',            file: 'TRIUMPH-2.png' },
  { slug: 'triumph-3',            file: 'TRIUMPH-3.png' },
  { slug: 'triumph-ls-plus',      file: 'TRIUMPH-LS Plus.png' },
  { slug: 'agant-3s',             file: 'AgAnt-3S-430x311.png' },
  { slug: 'airant',               file: 'AirAnt-1-430x311.png' },
  { slug: 'grant-series',         file: 'GrAnt-Series-1-430x311.png' },
  { slug: 'ringant-s',            file: 'RingAnt-S-1-430x311.png' },
  { slug: 'ringant-series',       file: 'RingAnt-Series-4-430x311.png' },
  { slug: 'janak-fieldpad',       file: 'Janak-FieldPad-Q-1-430x311.png' },
  { slug: 'js-10-pro',            file: 'JS-10-Pro-700x506.png' },
  { slug: 'js-10-rugged-tablet',  file: 'JS-10-RUGGED-TABLET.png' },
  { slug: 'js-10a',               file: 'JS-10A_MII-1.png' },
  { slug: 'js-11',                file: 'JS-11.png' },
  { slug: 'js-60',                file: 'JS-60.png' },
];

async function seed() {
  await client.connect();
  console.log('Connected to database');

  let inserted = 0;
  let skipped = 0;

  for (const { slug, file } of PRODUCT_IMAGES) {
    // Look up the product
    const { rows } = await client.query(
      'SELECT id FROM products WHERE slug = $1',
      [slug],
    );

    if (rows.length === 0) {
      console.warn(`  [SKIP] Product not found: ${slug}`);
      skipped++;
      continue;
    }

    const productId = rows[0].id;

    // Clear existing images for this product
    await client.query(
      'DELETE FROM product_images WHERE "productId" = $1',
      [productId],
    );

    const encodedFile = encodeURIComponent(file);

    // Insert 3 variants — product page image is primary
    const variants = [
      { folder: 'product-page', isPrimary: true,  sortOrder: 0 },
      { folder: 'home',         isPrimary: false, sortOrder: 1 },
      { folder: 'explore',      isPrimary: false, sortOrder: 2 },
    ];

    for (const v of variants) {
      const url = `${BASE_URL}/uploads/products/${v.folder}/${encodedFile}`;
      await client.query(
        `INSERT INTO product_images (url, "isPrimary", "sortOrder", "productId")
         VALUES ($1, $2, $3, $4)`,
        [url, v.isPrimary, v.sortOrder, productId],
      );
    }

    console.log(`  [OK] ${slug} — 3 images inserted`);
    inserted++;
  }

  console.log(`\nDone. ${inserted} products updated, ${skipped} skipped.`);
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
