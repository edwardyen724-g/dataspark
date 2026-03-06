import { NextApiRequest, NextApiResponse } from 'next';
import { setLoginSession } from '@/lib/auth'; // Assuming there's a function to set login session
import { auth } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import type { AuthedRequest } from '@/types/auth'; // Assuming there's a defined auth types

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

export const POST = async (req: AuthedRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await auth().getUserByEmail(email);
    const idToken = await auth().createCustomToken(user.uid);

    await setLoginSession(res, { idToken, email });

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};