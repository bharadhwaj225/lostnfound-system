import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = await getDb();
      const items = await db.collection("foundItems").find({}).toArray();
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching lost items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
