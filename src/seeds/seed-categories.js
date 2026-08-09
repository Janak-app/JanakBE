/**
 * Category seeder
 *
 * Uses fixed UUIDs that match the categoryId foreign keys on the products table.
 * Run inside Docker after the app has started:
 *
 *   docker cp src/seeds/seed-categories.js janak_app:/app/seed-categories.js
 *   docker exec janak_app node /app/seed-categories.js
 */

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'janak_db',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const categories = [
  { id: 'c420b07b-915b-4974-a369-8f41f4d7bc87', name: 'GNSS Receiver',              slug: 'gnss-receiver',              sortOrder: 1 },
  { id: 'c1ff9aa7-c888-4721-9738-42c7a7532e67', name: 'Survey Grade GNSS Receiver', slug: 'survey-grade-gnss-receiver', sortOrder: 2 },
  { id: 'be284820-6e9c-4f95-9c45-428c857270e7', name: 'DGPS Receiver',              slug: 'dgps-receiver',              sortOrder: 3 },
  { id: '77642f45-7d97-4fca-b132-412de9a8e01a', name: 'DGPS System',                slug: 'dgps-system',                sortOrder: 4 },
  { id: '326e7a35-6911-4bf8-840b-b71ccf177dc4', name: 'Differential GPS',           slug: 'differential-gps',           sortOrder: 5 },
  { id: '4e205b5d-fcae-4a43-818f-acf880786479', name: 'RTK Receiver',               slug: 'rtk-receiver',               sortOrder: 6 },
  { id: 'd29b10bf-b291-479f-9aae-41ea967a50be', name: 'Electronic Total Station',   slug: 'electronic-total-station',   sortOrder: 7 },
  { id: '60f2214b-12e0-4940-b2ca-115939d3497c', name: 'Total Station',              slug: 'total-station',              sortOrder: 8 },
  { id: 'fcdd888a-b497-4ade-96af-9c28917cd1b9', name: 'Digital Level',              slug: 'digital-level',              sortOrder: 9 },
  { id: '967ecfc9-5005-4b00-bc60-2714a6724698', name: 'Micro Optic Theodolite',     slug: 'micro-optic-theodolite',     sortOrder: 10 },
];

async function seed() {
  await client.connect();
  console.log('Connected to database');

  let inserted = 0;
  let skipped = 0;

  for (const cat of categories) {
    const { rows } = await client.query(
      'SELECT id FROM categories WHERE id = $1',
      [cat.id],
    );

    if (rows.length > 0) {
      console.log(`  SKIP  ${cat.name}`);
      skipped++;
      continue;
    }

    await client.query(
      `INSERT INTO categories (id, name, slug, icon, "isActive", "sortOrder", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NULL, true, $4, NOW(), NOW())`,
      [cat.id, cat.name, cat.slug, cat.sortOrder],
    );
    console.log(`  INSERT ${cat.name}`);
    inserted++;
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped`);
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
