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
                const { id, audiodata_id, soundslip_group, filehost_name, filehost_url, file_encrypted, mime_type, blockchain_network, blockchain_currency, nft_id, nft_metadata, owner_wallet_address } = body;
                const valuesArray = [id, audiodata_id, soundslip_group, filehost_name, filehost_url, file_encrypted, mime_type, blockchain_network, blockchain_currency, nft_id, nft_metadata, owner_wallet_address]
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
        case "DELETE":
            try{
                const { audiodata_id, creator } : { audiodata_id: number, creator: number } = body;
                let sql: string = format(`DELETE FROM audiodata where %I = %L AND %I === $L`, "id", audiodata_id, "creator", creator);
                client.connect();
                const response = await client.query(sql);
                res.status(200).send(response)
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
        default:
            return res.status(400).json({ response: "Method not recognized, please try again" });
    }
  }