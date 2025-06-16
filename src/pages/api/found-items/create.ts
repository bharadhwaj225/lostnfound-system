import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await getDb();
    const newItem = req.body;

    if (!newItem.itemName || !newItem.category || !newItem.dateFound || !newItem.location || !newItem.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doc = {
      ...newItem,
      status: "active",
      createdAt: new Date(),
    };

    await db.collection("foundItems").insertOne(doc);

    res.status(201).json({ message: "Item reported successfully" });
  } catch (error) {
    console.error("Error reporting found item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
