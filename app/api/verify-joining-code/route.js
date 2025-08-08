import { connectToDatabase } from "@/utils/db";
import JoiningCode from "@/utils/models/JoiningCode";
import { NextResponse } from "next/server";

export async function POST(request) {

  try {
    const { joiningCode } = await request.json();
    
    await connectToDatabase();
    const joiningCodeResponse = await JoiningCode.findOne({
      code: joiningCode,
      expiresAt: { $gt: new Date() },
    });

    if (!joiningCodeResponse) {
      return NextResponse.json(
        {
          message: "Invalid joining code",
          error: true,
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        message: "Joining code verified",
        timerId: joiningCodeResponse?.timerId,
        error: false
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error verifying joining code");
    return NextResponse.json(
      {
        message: "Error verifying joining code",
        error: true,
      },
      {
        status: 500,
      }
    );
  }
}
