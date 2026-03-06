import { NextResponse } from "next/server";
import type { NextApiRequest } from "next";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect"; // Assuming you have a dbConnect utility
import YourModel from "@/models/YourModel"; // Replace with your actual Mongoose model
import { Auth0Request } from "@/lib/auth"; // Assuming you have an Auth0 utility for request

interface AuthedRequest extends NextApiRequest {
  user?: { id: string; email: string }; // Extend with user properties as needed
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { updates } = body; // Expecting updates array of objects

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ message: "No updates provided." }, { status: 400 });
    }

    // Assuming user information is added to the request by an Auth0 middleware
    const user: AuthedRequest["user"] = Auth0Request(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatePromises = updates.map(async (updateData) => {
      // Assuming updateData contains an identifier to find the record and the fields to update
      const { id, ...updateFields } = updateData;
      return await YourModel.findByIdAndUpdate(id, updateFields, { new: true });
    });

    const results = await Promise.all(updatePromises);

    return NextResponse.json({ message: "Updates successful", results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}