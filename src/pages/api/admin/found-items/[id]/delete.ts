import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const db = await getDb();

    const item = await db.collection("foundItems").findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await db.collection("deletedItems").insertOne({
      ...item,
      deletedAt: new Date(),
      originalCollection: "foundItems",
    });

    await db.collection("foundItems").deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Found item moved to DeletedItems" });
  } catch (error) {
    console.error("Error deleting found item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
