import type { NextApiRequest, NextApiResponse } from 'next';
const { client } = require('../../modules/postgres/db');
const format = require('pg-format');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { method, body } = req;
    switch (method) {
        case "POST":
            try{
                const { user_name, first_name, last_name, password_hash, bio, profile_url } = body;
                const valuesArray = [user_name, first_name, last_name, password_hash, bio, profile_url]
                const sql = format(`INSERT INTO users (%I, %I, %I, %I, %I, %I) VALUES (%L);`, 'user_name', 'first_name', 'last_name', 'password_hash', 'bio', 'profile_url', valuesArray)
                client.connect()
                const response = await client.query(sql);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message});
            }
            break;
        case "GET":
            try {
                const { user_name } = body;
                const sql = format(`SELECT * FROM users WHERE %I = %L`, 'user_name', user_name)
                client.connect()
                const response = await client.query(sql);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        case "PATCH":
            try {
                const { updateWhat, userId, updateValue } : { updateWhat: string; userId: number; updateValue: any } = body;
                let sql: string = format(`UPDATE users SET %I = %L WHERE %I = %L;`, updateWhat, updateValue, "id", userId);
                client.connect()
                const response = await client.query(sql);
                res.status(200).send(response);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        default:
            return res.status(400).json({ response: "Method not recognized, please try again" });
    }
  }