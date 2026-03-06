import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb'; // Assuming you have a MongoDB connection utility
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string; email: string }; // Adding user property for authentication
}

const updateSchema = z.object({
  entries: z.array(
    z.object({
      id: z.string(),
      data: z.object({ /* Define the structure of your update data here */ }),
    })
  ),
});

export async function POST(req: AuthedRequest, res: NextApiResponse) {
  try {
    // Validate request body
    const body = await req.json();
    const { entries } = updateSchema.parse(body);

    // Authenticate and get user info
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getAuth().verifyIdToken(token);
    req.user = { uid: user.uid, email: user.email };

    // Connect to database
    const db = await connectToDatabase();

    // Perform batch update
    const updatePromises = entries.map(entry =>
      db.collection('your_collection_name').updateOne(
        { _id: entry.id }, // Adjust based on your database schema
        { $set: entry.data }
      )
    );

    await Promise.all(updatePromises);

    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(400).json({ message: err instanceof Error ? err.message : String(err) });
  }
}