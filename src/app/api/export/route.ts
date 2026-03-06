import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb'; // Adjust the path based on your project structure
import { exportData } from '@/lib/export'; // Import your logic to handle exporting
import { verifyAuth } from '@/lib/middleware'; // Import your Auth0 middleware

interface AuthedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function POST(req: AuthedRequest) {
  try {
    await connectToDatabase();

    // Verify authentication
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { format, query } = body;

    if (!format || !query) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    // Perform data export based on the query
    const result = await exportData(query, format, user.id);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}