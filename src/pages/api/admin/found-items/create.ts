import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await getDb();

    const { itemName, category, dateFound, location, description, email, imageUrl } = req.body;

    if (!itemName || !category || !dateFound || !location || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const foundItem = {
      itemName,
      category,
      dateFound,
      location,
      description: description || '',
      email,
      imageUrl: imageUrl || '',
      status: 'unclaimed',
      createdAt: new Date(),
    };

    const result = await db.collection('foundItems').insertOne(foundItem);

    res.status(201).json({ message: 'Found item reported successfully', itemId: result.insertedId });
  } catch (error) {
    console.error('Error inserting found item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
