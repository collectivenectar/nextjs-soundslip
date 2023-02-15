import { match } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
const { client } = require('../../modules/postgres/db');
const format = require('pg-format');

const rowNames = ["user_name", "first_name", "last_name", "password_hash", "member_since", "bio", "profile_url", "DEFAULT"]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { method, body } = req;
    console.log(method)
    switch (method) {
        case "POST":
            try{
                const { user_name, first_name, last_name, password_hash, bio, profile_url } = body;
                const queryString = `INSERT INTO users (user_name, first_name, last_name, password_hash, bio, profile_url) VALUES ($1, $2, $3, $4, $5, $6);`
                client.connect()
                const response = await client.query(queryString, [user_name, first_name, last_name, password_hash, bio, profile_url]);
                console.log(response)
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message});
            }
            break;
        case "GET":
            try {
                const { user_name } = body;
                const queryString = `SELECT * FROM users WHERE user_name = $1`
                client.connect()
                const response = await client.query(queryString, [user_name]);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        case "PATCH":
            try {
                const { updateWhat, userId, updateValue } : { updateWhat: string; userId: number; updateValue: any } = body;
                const patches : Object = {
                    first_name: `UPDATE users SET first_name = $1 WHERE id = 10`,
                    last_name: `UPDATE users SET last_name = $1 WHERE id = $2;`,
                    password_hash: `UPDATE users SET password_hash = $1 WHERE id = $2;`,
                    bio: `UPDATE users SET bio = $1 WHERE id = $2;`,
                    profile_url: `UPDATE users SET profile_url = $1 WHERE id = $2;`,
                }
                const queryString : string = patches[updateWhat as keyof object];
                client.connect()
                const response = await client.query(queryString, [updateValue]);
                res.status(200).send(response);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        default:
            return res.status(400).json({ response: "Method not recognized, please try again" });
    }
  }