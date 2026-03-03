import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Timer from "@/utils/models/Timer";
import { connectToDatabase } from "@/utils/db";
import { FREE_CONNECTIONS_ALLOWED, FREE_TIMERS_ALLOWED } from "@/app/constants";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");

  if (!ownerId) {
    return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
  }

  try {
    const { userId } = await auth();

    if (userId) {
      if (ownerId !== userId) {
        return NextResponse.json({ error: "Forbidden: ownerId must match authenticated user" }, { status: 403 });
      }
    }

    await connectToDatabase();
    const timers = await Timer.find({ ownerId, isDeleted: false })
      .sort({ createdAt: 1 })
      .lean();

    const list = timers.map((t) => ({
      id: t.id,
      ownerId: t.ownerId,
      name: t.name,
      duration: t.duration,
      originalDuration: t.originalDuration,
      maxConnectionsAllowed: t.maxConnectionsAllowed,
      maxTimersAllowed: t.maxTimersAllowed,
      message: t.message || "",
      joiningCode: t.joiningCode || "",
      styling: {
        backgroundColor: t.backgroundColor,
        textColor: t.textColor,
        fontSize: t.fontSize,
        timerView: t.timerView || "normal",
      },
    }));

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching timers:", error);
    return NextResponse.json({ error: "Failed to fetch timers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const {
      id,
      ownerId,
      name,
      duration,
      maxConnectionsAllowed,
      maxTimersAllowed,
      styling,
      joiningCode,
      message,
    } = body;

    if (!id || !ownerId || duration == null) {
      return NextResponse.json(
        { error: "id, ownerId, and duration are required" },
        { status: 400 }
      );
    }

    if (userId && ownerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: ownerId must match authenticated user" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const existing = await Timer.findOne({ id });
    if (existing) {
      return NextResponse.json({ error: "Timer with this id already exists" }, { status: 409 });
    }

    const originalDuration = body.originalDuration ?? duration;
    const doc = {
      id,
      ownerId,
      name: name ?? "",
      duration,
      originalDuration,
      maxConnectionsAllowed: maxConnectionsAllowed ?? FREE_CONNECTIONS_ALLOWED,
      maxTimersAllowed: maxTimersAllowed ?? FREE_TIMERS_ALLOWED,
      message: message ?? "",
      joiningCode: joiningCode ?? "",
      backgroundColor: styling?.backgroundColor ?? "#1f2937",
      textColor: styling?.textColor ?? "#ffffff",
      fontSize: styling?.fontSize ?? "text-6xl",
      timerView: styling?.timerView ?? "normal",
    };

    await Timer.create(doc);

    return NextResponse.json({
      id: doc.id,
      ownerId: doc.ownerId,
      name: doc.name,
      duration: doc.duration,
      originalDuration: doc.originalDuration,
      maxConnectionsAllowed: doc.maxConnectionsAllowed,
      maxTimersAllowed: doc.maxTimersAllowed,
      message: doc.message,
      joiningCode: doc.joiningCode,
      styling: {
        backgroundColor: doc.backgroundColor,
        textColor: doc.textColor,
        fontSize: doc.fontSize,
        timerView: doc.timerView,
      },
    });
  } catch (error) {
    console.error("Error creating timer:", error);
    return NextResponse.json({ error: "Failed to create timer" }, { status: 500 });
  }
}
