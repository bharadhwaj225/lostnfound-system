import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const objectId = new ObjectId(id);

    const lostItem = await db.collection("lost-items").findOne({ _id: objectId });
    const foundItem = await db.collection("found-items").findOne({ _id: objectId });

    const item = lostItem || foundItem;

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
