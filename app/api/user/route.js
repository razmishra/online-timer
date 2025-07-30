import { connectToDatabase } from "@/utils/db";
import User from "@/utils/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, isAuthenticated } = await auth();
  if (!userId || !isAuthenticated) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in",
        error: true,
      },
      { status: 404 }
    );
  }
  try {
    await connectToDatabase();
    const userDetails = await User.findOne({ userID: userId });
    if (!userDetails) {
      return NextResponse.json(
        {
          message: "User details not found",
          error: true,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ userDetails, error: false }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching user details", error: true },
      { status: 500 }
    );
  }
}