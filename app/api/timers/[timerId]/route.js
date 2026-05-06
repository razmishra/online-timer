import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Timer from "@/utils/models/Timer";
import JoiningCode from "@/utils/models/JoiningCode";
import { connectToDatabase } from "@/utils/db";

export async function PATCH(req, { params }) {
  const timerId = params?.timerId;
  if (!timerId) {
    return NextResponse.json({ error: "timerId is required" }, { status: 400 });
  }
  try {
    const { userId } = await auth();
    await connectToDatabase();
    const timer = await Timer.findOne({ id: timerId });
    if (!timer) return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    const url = new URL(req.url);
    const ownerIdFromQuery = url.searchParams.get("ownerId");
    if (userId) {
      if (timer.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } else {
      if (!ownerIdFromQuery || timer.ownerId !== ownerIdFromQuery) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const updates = {};
    if (body.joiningCode != null) updates.joiningCode = String(body.joiningCode);
    if (Object.keys(updates).length === 0) return NextResponse.json({ ok: true });
    await Timer.updateOne({ id: timerId }, updates);
    await JoiningCode.insertOne({
      userId: userId || "anonymous",
      timerId,
      code: String(body.joiningCode),
      isDeleted: false,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating timer:", error);
    return NextResponse.json({ error: "Failed to update timer" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const timerId = params?.timerId;
  if (!timerId) {
    return NextResponse.json({ error: "timerId is required" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const ownerIdFromQuery = searchParams.get("ownerId");

  try {
    const { userId } = await auth();
    await connectToDatabase();

    const timer = await Timer.findOne({ id: timerId });
    if (!timer) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    if (userId) {
      if (timer.ownerId !== userId) {
        return NextResponse.json({ error: "Forbidden: not the owner of this timer" }, { status: 403 });
      }
    } else {
      if (!ownerIdFromQuery || timer.ownerId !== ownerIdFromQuery) {
        return NextResponse.json({ error: "Forbidden: ownerId must match for anonymous user" }, { status: 403 });
      }
    }

    await Timer.updateOne({ id: timerId }, { isDeleted: true });
    await JoiningCode.updateMany({ timerId }, { isDeleted: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting timer:", error);
    return NextResponse.json({ error: "Failed to delete timer" }, { status: 500 });
  }
}
