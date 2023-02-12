// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import postgres from "postgres";

const sql = postgres(`${process.env.NEON_URL}`, {
  ssl: 'require'
});

type Data = {
  response: Object
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const insertUser = await sql`
    INSERT INTO users
    (id, user_name, first_name, last_name, password_hash, member_since, bio, profile_url) 
    VALUES 
    (DEFAULT,'testuser','jon','harvey','3Fv2hkaAs6674s2hzBQ0oP4TuQfKnzA7',NOW(),'likes long walks on the beach','https://jonathanharvey.netlify.app');`
    res.send({response: insertUser})
}

// Add user:

// UPDATE soundslips SET column = new_value
// WHERE column = matching_value;

// DELECT FROM soundsliips
// WHERE column IS matching_value;