import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../modules/postgres/interfaces/User';
import conn from '../../modules/postgres/db';
import pg from 'pg';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { method, body } = req;

    switch (method) {
        case "POST":
            try{
                const query = `INSERT INTO users (id, user_name, first_name, last_name, password_hash, member_since, bio, profile_url) VALUES (DEFAULT,'testuser','jon','harvey','3Fv2hkaAs6674s2hzBQ0oP4TuQfKnzA7',NOW(),'likes long walks on the beach','https://jonathanharvey.netlify.app');`
                const response = await conn?.query(query);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message});
            }
        case "GET":
            try {
                // parse search params to retrieve users with matching username, first_name, last_name
                const { username } = body;
                const query = `SELECT * FROM users WHERE username = ${username}`
                const response = await conn?.query(query);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
        case "UPDATE":
            try {
                const { updateWhat, username, first_name, last_name, password_hash, bio, previousValue } = body;
                const updateString = body[`${updateWhat}`];
                const query = `UPDATE users SET ${updateWhat} = ${updateString} WHERE ${updateWhat} = ${previousValue};`;
                const response = await conn?.query(query);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
        default:
            return res.status(400).json({ mssg: "Method not recognized, please try again" })
    }
  }