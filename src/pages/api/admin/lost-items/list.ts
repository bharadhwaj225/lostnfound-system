import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await getDb();

    const lostItems = await db
      .collection("lostItems")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(lostItems);
  } catch (error) {
    console.error("Error fetching lost items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
