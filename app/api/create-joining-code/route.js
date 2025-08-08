import { connectToDatabase } from "@/utils/db";
import JoiningCode from "@/utils/models/JoiningCode";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

// Generate unique code
async function generateUniqueCode() {
  let code;
  let attempts = 0;
  const maxAttempts = 10;
  while (attempts < maxAttempts) {
    code = nanoid();
    const existing = await JoiningCode.findOne({
      code: code?.toString()?.toUpperCase(),
      expiresAt: { $gte: new Date() },
    });
    if (!existing) {
      return {
        code: code?.toString()?.toUpperCase(),
        success: true,
      };
    }
    attempts++;
  }
  return {
    code: null,
    success: false,
    message: "Failed to generate unique code",
  };
}

export async function POST(request) {
  const { userId, isAuthenticated } = await auth();

  try {
    if (!userId || !isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in", error: true },
        { status: 401 }
      );
    }

    const { timerId } = await request.json();
    await connectToDatabase();
    const joininCodeAlreadyExists = await JoiningCode.findOne({
      timerId: timerId,
      expiresAt: { $lt: new Date() },
    });
    if (joininCodeAlreadyExists) {
      return NextResponse.json(
        {
          message: "Joining code is already present",
          joiningCode: joininCodeAlreadyExists?.code,
        },
        {
          status: 200,
        }
      );
    }

    const joiningCodeResponse = await generateUniqueCode();
    if (!joiningCodeResponse?.success) {
      throw new Error(joiningCodeResponse?.message);
    }
    await JoiningCode.create({
      userID: userId,
      code: joiningCodeResponse?.code,
      timerId,
    });
    return NextResponse.json({
        message:"Joining code created successfully",
        joiningCode: joiningCodeResponse?.code,
        error: false
    },{
        status: 201
    })
  } catch (error) {
    console.log("error creating joining code");
    return NextResponse.json(
      { error: "Error creating joining code" },
      { status: 500 }
    );
  }
}
