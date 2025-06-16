import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();
    const limit = parseInt(req.query.limit as string) || 100;

    const foundItems = await db
      .collection("foundItems")
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const lostItems = await db
      .collection("lostItems")
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const allItems = [...foundItems, ...lostItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
}
