import { Client } from 'pg';

const pgClient = new Client({
  user: process.env.NEON_USER,
  password: process.env.NEON_PASSWORD,
  database: process.env.NEON_DB,
  port: 5432,
  host: process.env.NEON_HOST,
  ssl: true
});

module.exports = {
  client: pgClient
}