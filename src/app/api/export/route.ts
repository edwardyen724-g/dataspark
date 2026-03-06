import { NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { UserData } from '@/models/UserData';
import { createWriteStream } from 'fs';
import { format } from 'date-fns';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string; // Add custom property for user ID
}

const exportData = async (req: ExtendedNextApiRequest) => {
  try {
    await connectToDatabase();
    
    // Assume userId is passed in request headers from Auth0 session
    const userId = req.headers['authorization']?.split(' ')[1] || req.userId; 
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const results = await UserData.find({ userId }).lean();

    if (results.length === 0) {
      return NextResponse.json({ error: 'No data found for this user' }, { status: 404 });
    }

    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const fileName = `exported_data_${timestamp}.json`;
    const filePath = `/tmp/${fileName}`; // Temporary file storage path

    const writeStream = createWriteStream(filePath);
    writeStream.write(JSON.stringify(results, null, 2));
    writeStream.end();

    return NextResponse.json({ message: 'Data export successful', fileName }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
};

export async function POST(req: ExtendedNextApiRequest) {
  return exportData(req);
}