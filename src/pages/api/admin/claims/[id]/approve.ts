import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const db = await getDb();
    await db.collection("claims").updateOne(
      { _id: new ObjectId(id as string) },
      { $set: { status: "approved" } }
    );
    return res.status(200).json({ message: "Claim approved" });
  } catch (error) {
    console.error("Approve Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
