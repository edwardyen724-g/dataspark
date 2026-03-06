import { NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import mongoose from 'mongoose';

interface DashboardData {
  totalUsers: number;
  totalQueries: number;
  recentUpdates: any[];
}

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (err) {
    throw new Error(`Database connection error: ${err instanceof Error ? err.message : String(err)}`);
  }
};

const fetchDashboardData = async (): Promise<DashboardData> => {
  // Dummy data structure for the example
  const data = {
    totalUsers: 100,
    totalQueries: 250,
    recentUpdates: [
      { id: 1, description: "Updated entry 1", timestamp: new Date() },
      { id: 2, description: "Updated entry 2", timestamp: new Date() },
    ],
  };

  return data;
};

export async function GET(req: NextApiRequest) {
  try {
    await connectToDatabase();
    const dashboardData = await fetchDashboardData();
    
    return NextResponse.json(dashboardData);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}