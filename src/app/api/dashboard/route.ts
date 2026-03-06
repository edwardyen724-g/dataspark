import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb'; // Assuming there's a MongoDB connection utility
import { checkAuth } from '@/lib/auth'; // Assuming there's an Auth0 authentication utility

interface DashboardData {
  similarityResults: any[];
  totalUpdates: number;
  recentSearches: string[];
}

const getDashboardData = async (userId: string): Promise<DashboardData> => {
  try {
    await connectToDatabase();

    // Here you would typically fetch data from your database related to the userId
    // This is a placeholder for your MongoDB queries (replace with actual logic)
    const similarityResults = await mongoose.model('Similarity').find({ userId }).exec();
    const totalUpdates = await mongoose.model('Updates').countDocuments({ userId }).exec();
    const recentSearches = await mongoose.model('Searches').find({ userId }).sort('-createdAt').limit(5).exec();

    return {
      similarityResults,
      totalUpdates,
      recentSearches: recentSearches.map(search => search.query),
    };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

export async function GET(req: Request) {
  const user = await checkAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dashboardData = await getDashboardData(user.id);
    return NextResponse.json(dashboardData);
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}