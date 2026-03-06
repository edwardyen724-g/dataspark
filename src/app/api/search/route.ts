import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { searchDocuments } from '@/lib/searchService'; // hypothetical search service 
import { ValidationError } from '@/lib/errors'; // hypothetical error handling

// Define types for request and response
interface SearchRequest {
  query: string;
  limit?: number;
}

export async function POST(req: Request) {
  try {
    const { query, limit } = await req.json() as SearchRequest;

    if (!query) {
      throw new ValidationError('Query parameter is required.');
    }

    await connectToDatabase();

    const results = await searchDocuments(query, limit);
    
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}