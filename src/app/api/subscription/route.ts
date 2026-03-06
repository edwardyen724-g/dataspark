import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { Stripe } from 'stripe';
import { env } from 'process';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27'
});

export async function POST(req: NextRequest) {
  try {
    const { email, paymentMethodId, priceId } = await req.json();

    if (!email || !paymentMethodId || !priceId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    await client.connect();
    const db = client.db('subscriptions');
    await db.collection('users').updateOne(
      { email },
      { $set: { stripeCustomerId: customer.id, subscriptionId: subscription.id } },
      { upsert: true }
    );

    return NextResponse.json({ subscription });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  } finally {
    await client.close();
  }
}