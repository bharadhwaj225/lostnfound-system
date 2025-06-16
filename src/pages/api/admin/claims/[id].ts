import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const db = await getDb();

    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid claim ID" });
    }

    const claim = await db
      .collection("claims")
      .findOne({ _id: new ObjectId(id as string) });

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    return res.status(200).json(claim);
  } catch (error) {
    console.error("Error fetching claim:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
