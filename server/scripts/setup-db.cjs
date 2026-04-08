const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function readEnv(filePath) {
  const env = {};
  const content = fs.readFileSync(filePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index === -1) continue;
    env[line.slice(0, index)] = line.slice(index + 1);
  }

  return env;
}

async function ensureDatabase() {
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'postgres',
  });

  await adminClient.connect();
  const result = await adminClient.query(
    "SELECT 1 FROM pg_database WHERE datname = 'alpha_trekkers'"
  );

  if (!result.rowCount) {
    await adminClient.query('CREATE DATABASE alpha_trekkers');
    console.log('Created database alpha_trekkers');
  } else {
    console.log('Database alpha_trekkers already exists');
  }

  await adminClient.end();
}

async function applySchema(env) {
  const client = new Client({ connectionString: env.DATABASE_URL });
  const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma-init.sql'), 'utf8');

  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('Applied schema');
}

async function main() {
  const env = readEnv(path.join(__dirname, '..', '.env'));
  await ensureDatabase();
  await applySchema(env);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
