import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await getDb();

    const { itemName, category, dateLost, location, description, email, imageUrl } = req.body;

    if (!itemName || !category || !dateLost || !location || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lostItem = {
      itemName,
      category,
      dateLost,
      location,
      description: description || "",
      email,
      imageUrl: imageUrl || "",
      status: "active",
      createdAt: new Date(),
    };

    const result = await db.collection("lostItems").insertOne(lostItem);

    res.status(201).json({ message: "Lost item reported successfully", itemId: result.insertedId });
  } catch (error) {
    console.error("Error inserting lost item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
