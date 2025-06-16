import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = {
  _id: string;
  itemName: string;
  status: "lost" | "found";
};

export default function AdminItems() {
  const { status } = useAdminAuth();
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const lostRes = await fetch("/api/admin/lost-items");
    const foundRes = await fetch("/api/admin/found-items");

    if (lostRes.ok) {
      const data = await lostRes.json();
      setLostItems(data.map((item: any) => ({ ...item, status: "lost" })));
    }
    if (foundRes.ok) {
      const data = await foundRes.json();
      setFoundItems(data.map((item: any) => ({ ...item, status: "found" })));
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchItems();
    }
  }, [status]);

  const handleDeleteItem = async (itemId: string, itemType: "lost" | "found") => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    const endpoint = `/api/admin/${itemType}-items/${itemId}/delete`;
    const res = await fetch(endpoint, { method: "DELETE" });

    if (res.ok) {
      if (itemType === "lost") {
        setLostItems(prev => prev.filter(item => item._id !== itemId));
      } else {
        setFoundItems(prev => prev.filter(item => item._id !== itemId));
      }
    } else {
      alert("Failed to delete item.");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Items</h1>

        <section>
          <h2 className="text-xl font-semibold mb-2">Lost Items</h2>
          {lostItems.length === 0 ? (
            <p>No lost items.</p>
          ) : (
            lostItems.map(item => (
              <div
                key={item._id}
                className="flex items-center justify-between shadow-md p-3 rounded mb-2 hover:bg-gray-100 transition"
              >
                <Link
                  href={{
                    pathname: `/admin/items/${item._id}`,
                    query: { status: item.status },
                  }}
                  className="flex-1"
                >
                  {item.itemName}
                </Link>
                <button
                  onClick={() => handleDeleteItem(item._id, item.status)}
                  className="ml-4 text-sm bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Found Items</h2>
          {foundItems.length === 0 ? (
            <p>No found items.</p>
          ) : (
            foundItems.map(item => (
              <div
                key={item._id}
                className="flex items-center justify-between shadow-md p-3 rounded mb-2 hover:bg-gray-100 transition"
              >
                <Link
                  href={{
                    pathname: `/admin/items/${item._id}`,
                    query: { status: item.status },
                  }}
                  className="flex-1"
                >
                  {item.itemName}
                </Link>
                <button
                  onClick={() => handleDeleteItem(item._id, item.status)}
                  className="ml-4 text-sm bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
