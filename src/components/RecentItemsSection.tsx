import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Item {
  _id: string;
  itemName: string;
  category: string;
  dateLost?: string;
  dateFound?: string;
  location?: string;
  imageUrl?: string;
  status: "Lost" | "Found";
  createdAt: string;
}

export default function RecentItemsSection() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/lost-items").then((res) => res.json()),
      fetch("/api/found-items").then((res) => res.json()),
    ])
      .then(([lostItems, foundItems]) => {

        const lost = lostItems.map((item: any) => ({ ...item, status: "Lost" }));
        const found = foundItems.map((item: any) => ({ ...item, status: "Found" }));

        const combined = [...lost, ...found].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setItems(combined.slice(0, 6));
      })
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Reported Items</h2>
        <Link
          href="/listings"
          className="inline-block text-sm text-gray px-6 py-2 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const displayDate =
            item.status === "Lost"
              ? item.dateLost || item.createdAt
              : item.dateFound || item.createdAt;

          const relativeDate = displayDate
            ? formatDistanceToNow(new Date(displayDate), { addSuffix: true })
            : "";

          return (
            <div
              key={item._id}
              className="relative flex flex-col h-full rounded-lg shadow-md overflow-hidden bg-white"
            >
              <span
                className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-sm z-10 ${item.status === "Lost"
                  ? "bg-yellow-100 text-yellow-500"
                  : "bg-green-100 text-green-500"
                  }`}
              >
                {item.status}
              </span>

              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.itemName}
                className="w-full h-48 object-contain bg-gray-50"
              />

              <div className="flex flex-col justify-between p-4 flex-grow">
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span className="capitalize font-medium">{item.category}</span>
                    <span>{relativeDate}</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{item.itemName}</h3>

                  {item.location && (
                    <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/${item.status === "Lost" ? "lost-items" : "found-items"}/${item._id}`}
                    className="mt-2 text-sm font-medium text-black bg-gray-200 px-4 py-1  rounded-xl sm:rounded-3xl hover:bg-gray-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
