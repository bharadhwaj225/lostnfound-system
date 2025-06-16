import { getDb } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { id } = req.query;

  try {
    const db = await getDb();
    const deletedItemsCollection = db.collection("deletedItems");

    const deletedItem = await deletedItemsCollection.findOne({ _id: new ObjectId(id) });

    if (!deletedItem) {
      return res.status(404).json({ error: "Deleted item not found" });
    }

    const rawCollection = deletedItem.OriginalCollection || deletedItem.originalCollection;

    if (!rawCollection) {
      return res.status(400).json({ error: "Original collection not specified" });
    }

    const normalized = rawCollection.toLowerCase();

    const collectionMap = {
      lostitems: "lostItems",
      founditems: "foundItems"
    };

    const targetCollectionName = collectionMap[normalized];

    if (!targetCollectionName) {
      return res.status(400).json({ error: "Invalid OriginalCollection value" });
    }

    const targetCollection = db.collection(targetCollectionName);

    const { _id, ...itemData } = deletedItem;
    delete itemData.OriginalCollection;
    delete itemData.originalCollection;

    await targetCollection.insertOne(itemData);

    await deletedItemsCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Item restored successfully" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ error: "Failed to restore item" });
  }
}
