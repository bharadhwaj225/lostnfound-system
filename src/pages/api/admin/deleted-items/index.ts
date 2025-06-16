import { getDb } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const db = await getDb();

    const deletedItems = await db.collection("deletedItems").find({}).toArray();

    res.status(200).json(deletedItems);
  } catch (error) {
    console.error("Failed to fetch deleted items:", error);
    res.status(500).json({ error: "Failed to fetch deleted items" });
  }
}
