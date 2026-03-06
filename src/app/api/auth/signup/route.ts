import { NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { Auth0Error } from 'auth0';
import { NextApiRequest } from 'next';

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

export async function POST(req: AuthedRequest) {
  const { email, password } = await req.json();

  try {
    const user = await auth().createUser({
      email,
      password,
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    );
  }
}