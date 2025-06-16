import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      query: { id },
    } = req;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const db = await getDb();

    const item = await db
      .collection("lostItems")
      .findOne({ _id: new ObjectId(id) });

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("[GET LOST ITEM BY ID]", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

