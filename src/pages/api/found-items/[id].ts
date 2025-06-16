import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    const db = await getDb();
    const foundItem = await db
      .collection("foundItems")
      .findOne({ _id: new ObjectId(id as string) });

    if (!foundItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(foundItem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item", error: err });
  }
}
