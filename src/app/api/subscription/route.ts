import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { createSubscription, getSubscription, updateSubscription } from '@/lib/stripe';
import { auth } from '@/lib/auth';

interface AuthedRequest extends NextApiRequest {
  user?: { id: string; email: string };
}

const rateLimit = new Map<string, number>();

const rateLimiter = (req: AuthedRequest) => {
  const ip = req.ip || '127.0.0.1';
  const currentTime = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const requestCount = rateLimit.get(ip) || 0;

  if (requestCount >= 5) {
    throw new Error('Too many requests. Please try again later.');
  }

  rateLimit.set(ip, requestCount + 1);
  
  setTimeout(() => {
    rateLimit.set(ip, Math.max(0, requestCount - 1));
  }, limitWindow);
};

export async function POST(req: AuthedRequest, res: NextApiResponse) {
  try {
    rateLimiter(req);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verify(token, process.env.AUTH0_SECRET as string);
    req.user = { id: decoded.sub, email: decoded.email };

    const body = await req.json();
    const { action, subscriptionId } = body;

    await connectToDatabase();

    switch (action) {
      case 'create':
        const subscription = await createSubscription(req.user.email);
        return res.status(201).json(subscription);
      case 'retrieve':
        const retrievedSubscription = await getSubscription(subscriptionId);
        return res.status(200).json(retrievedSubscription);
      case 'update':
        const updatedSubscription = await updateSubscription(subscriptionId);
        return res.status(200).json(updatedSubscription);
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}