import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Head from "next/head";
import { useEffect, useState } from "react";

type Item = {
  _id: string;
  itemName: string;
  status: "lost" | "found";
};

export default function DeletedItemsPage() {
  const { status } = useAdminAuth();
  const [deletedItems, setDeletedItems] = useState<Item[]>([]);

  const fetchDeleted = async () => {
    const res = await fetch("/api/admin/deleted-items");
    if (res.ok) setDeletedItems(await res.json());
  };

  const handleRestore = async (id: string) => {
    await fetch(`/api/admin/deleted-items/${id}/restore`, { method: "POST" });
    fetchDeleted();
  };

  useEffect(() => {
    if (status === "authenticated") fetchDeleted();
  }, [status]);

  return (
    <div>
      <Head>
        <title>Deleted Items | Admin Dashboard</title>
        <meta name="description" content="View and manage items that have been deleted from the system. Restore or permanently remove entries." />
      </Head>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Deleted Items</h1>

        {deletedItems.length === 0 ? (
          <p>No deleted items.</p>
        ) : (
          deletedItems.map(item => (
            <div key={item._id} className="border p-3 rounded mb-2 flex justify-between">
              <span>{item.itemName} — <em>{item.status}</em></span>
              <button onClick={() => handleRestore(item._id)} className="bg-green-600 text-white px-3 py-1 rounded">
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
