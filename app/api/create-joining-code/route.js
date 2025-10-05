import { connectToDatabase } from "@/utils/db";
import JoiningCode from "@/utils/models/JoiningCode";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

// set to store active codes
let activeCodes = new Set();

// Load active codes from DB once
async function loadActiveCodes() {
  const codes = await JoiningCode.find(
    { expiresAt: { $gte: new Date() } },
    { code: 1 }
  ).lean();

  activeCodes = new Set(codes.map(c => c?.code?.toString()?.toUpperCase()));
}

// Generate unique code
async function generateUniqueCode() {
  await loadActiveCodes();
  
  let code;
  let attempts = 0;
  const maxAttempts = 10;
  while (attempts < maxAttempts) {
    code = nanoid();
    // check if code is already in memory
    if (!activeCodes.has(code)) {
      activeCodes.clear(); // clear the set to avoid memory leak
      return { code: code?.toString()?.toUpperCase(), success: true };
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
      expiresAt: { $gt: new Date() },
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
