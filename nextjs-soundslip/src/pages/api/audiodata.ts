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
                const { userId, title, description, downvotes, upvotes, tag, visibility } = body;
                const valuesArray = [userId, title, description, downvotes, upvotes, tag, visibility]
                const sql = format(`INSERT INTO audiodata (%I, %I, %I, %I, %I, %I, %I) VALUES (%L);`, "creator", "title", "description", "downvotes", "upvotes", "tag", "visibility", valuesArray)
                client.connect()
                const response = await client.query(sql);
                res.status(200).send(response?.rows);
            }catch(error: any){
                return res.status(400).json({response: error.message});
            }
            break;
        case "GET":
            try {
                const { searchWith, searchValue } = body;
                let sql: string;
                if(searchWith !== "creator"){
                    sql = format(`SELECT * FROM audiodata WHERE %I LIKE %L`, searchWith, "%" + searchValue + "%")
                    client.connect()
                    const response = await client.query(sql);
                    res.status(200).send(response?.rows);
                }else{
                    sql = format(`SELECT * FROM audiodata WHERE %I = %L`, searchWith, searchValue)
                    client.connect()
                    const response = await client.query(sql);
                    res.status(200).send(response?.rows);
                }
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        case "PATCH":
            try {
                const { updateWhat, audioId, updateValue } : { updateWhat: string; audioId: number; updateValue: any } = body;
                let sql: string = format(`UPDATE audiodata SET %I = %L WHERE %I = %L;`, updateWhat, updateValue, "id", audioId);
                client.connect();
                const response = await client.query(sql);
                res.status(200).send(response);
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        case "DELETE":
            try{
                const { audioId } : { audioId: number } = body;
                let sql: string = format(`DELETE FROM audiodata where %I = %L`, "id", audioId);
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