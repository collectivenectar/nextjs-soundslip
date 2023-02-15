import type { NextApiRequest, NextApiResponse } from 'next';
const { query } = require('../../modules/postgres/db');

const rowNames = ["user_name", "first_name", "last_name", "password_hash", "member_since", "bio", "profile_url", "DEFAULT"]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { method, body } = req;

    switch (method) {
        case "POST":
            try{
                const { user_name, first_name, last_name, password_hash, bio, profile_url } = body;
                const queryString = `INSERT INTO users (id, user_name, first_name, last_name, password_hash, member_since, bio, profile_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
                const response = await query(queryString, [rowNames[7], user_name, first_name, last_name, password_hash, 'NOW()', bio, profile_url]);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message});
            }
        case "GET":
            try {
                const { username } = body;
                const queryString = `SELECT * FROM users WHERE username = $1`
                const response = await query(queryString, [username]);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
        case "UPDATE":
            try {
                const { updateWhat, findUserBy, matchingValue } = body;
                const updateString = body[`${updateWhat}`];
                const queryString = `UPDATE users SET $1 = $2 WHERE $3 = $4;`;
                const response = await query(queryString, [updateWhat, updateString, findUserBy, matchingValue]);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
        default:
            return res.status(400).json({ response: "Method not recognized, please try again" })
    }
  }