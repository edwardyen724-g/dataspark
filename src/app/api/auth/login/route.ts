import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { setCache } from '@/utils/cache';
import { createRateLimit } from '@/utils/rateLimit';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT as string);

initializeApp({
  credential: cert(serviceAccount),
});

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string; email: string; };
}

const rateLimitMap = new Map<string, number>();
const loginRateLimit = createRateLimit(rateLimitMap);

export async function POST(req: AuthedRequest, res: NextApiResponse) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const isRateLimited = loginRateLimit(req);
    if (isRateLimited) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const userCredential = await auth().getUserByEmail(email);
    const token = await getAuth().createCustomToken(userCredential.uid);

    setCache(email, token); // Optionally cache token for further use

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}