import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const db = await getDb();
      const collection = db.collection("lostItems");

      const newItem = req.body;
      await collection.insertOne({ ...newItem, status: "active" });

      res.status(201).json({ message: "Item reported successfully" });
    } catch (error) {
      console.error("Failed to report lost item:", error);
      res.status(500).json({ error: "Failed to report lost item" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
