import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();

  if (req.method === "GET") {
    try {
      const claims = await db.collection("claims").find({}).toArray();
      res.status(200).json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims", error });
    }
  }

  else if (req.method === "POST") {
    const { itemId, itemType, name, email, proofMessage, proofFileUrl } = req.body;

    if (!itemId || !itemType || !name || !email || !proofMessage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["lost", "found"].includes(itemType)) {
      return res.status(400).json({ message: "Invalid itemType" });
    }

    try {
      const claimDoc = {
        itemId: new ObjectId(itemId),
        itemType,
        name,
        email,
        proofMessage,
        proofFileUrl: proofFileUrl || null,
        status: "pending",
        createdAt: new Date(),
      };

      await db.collection("claims").insertOne(claimDoc);
      res.status(200).json({ message: "Claim submitted successfully" });
    } catch (error) {
      console.error("Error creating claim:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
