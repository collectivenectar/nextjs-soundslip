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
            // add new Soundslip entry. This can only be called during creating a new entry if the
            // file has already been uploaded to IPFS and there is either a CID entry or a URL for the host bucket.
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
            // Search for all soundslips with the matching attribute. Any attribute can be passed as a parameter.
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
            // Update data in an entry - two paths, one for votes and one for the other data types
            try {
                const { updateWhat, audioId, updateValue } : { updateWhat: string; audioId: number; updateValue: any } = body;
                if(updateWhat === "upvotes" || updateWhat === "downvotes"){
                    // After frontend is more completed, I'll add the long term solution for votes that 
                    // prevent abuse and allow a user to retract a vote.
                    let sql: string = format(`UPDATE audiodata SET %1$I = %1$I + 1 WHERE %I = %L;`, updateWhat, "id", audioId);
                    client.connect();
                    const response = await client.query(sql)
                    res.status(200).send(response)
                }else{
                    let sql: string = format(`UPDATE audiodata SET %I = %L WHERE %I = %L;`, updateWhat, updateValue, "id", audioId);
                    client.connect();
                    const response = await client.query(sql);
                    res.status(200).send(response);
                }
            }catch(error: any){
                return res.status(400).json({response: error.message})
            }
            break;
        case "DELETE":
            // Remove a soundslip - Verify authorship before deleting.
            try{
                const { audioId, creator } : { audioId: number, creator: number } = body;
                let sql: string = format(`DELETE FROM audiodata where %I = %L AND %I === $L`, "id", audioId, "creator", creator);
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