import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createUser } from 'firebase-admin/auth';
import { z } from 'zod';

initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS as string)),
});

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: AuthedRequest, res: NextApiResponse) {
  try {
    const { email, password } = signupSchema.parse(req.body);

    const userRecord = await createUser({
      email,
      password,
    });

    res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
}