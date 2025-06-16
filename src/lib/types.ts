import { ObjectId } from "mongodb";
export type Category = 'Electronics' | 'Stationery' | 'Clothing' | 'Accessories' | 'Documents' | 'Other';

export interface Item {
  _id?: string;
  description: any;
  id?: string;
  title: string;
  category: Category;
  status: 'lost' | 'found' | 'resolved';
  createdAt: string;
  location: string;
  imageUrl: string;
}
