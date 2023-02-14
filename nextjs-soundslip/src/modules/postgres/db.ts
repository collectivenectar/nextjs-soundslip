import { Pool } from 'pg';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const connectionString = process.env.NEON_URL

let conn: Pool | undefined;

if (!conn){
  conn = new Pool({connectionString});
}

export default conn;
