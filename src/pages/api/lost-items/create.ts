import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      itemName,
      category,
      dateLost,
      location,
      description,
      email,
      imageUrl,
    } = req.body;

    if (!itemName || !category || !dateLost || !location || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await getDb();

    const newLostItem = {
      itemName,
      category,
      dateLost: new Date(dateLost),
      location,
      description: description || "",
      email,
      imageUrl: imageUrl || "",
      status: "active",
      createdAt: new Date(),
    };

    const result = await db.collection("lostItems").insertOne(newLostItem);

    return res.status(201).json({ message: "Lost item reported successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error creating lost item:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
