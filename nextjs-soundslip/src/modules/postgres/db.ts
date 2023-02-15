import { Client, Pool } from 'pg';

const connectionString: string | undefined = process.env.NEON_URL

const pool = new Pool({connectionString});

module.exports = {
  query: (text: string, params: any[], callback: Function) => {
    const start = Date.now()
    return pool?.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  },
  getClient: (callback: Function) => {
    pool?.connect((err, client, done) => {
      callback(err, client, done)
    })
  },
}