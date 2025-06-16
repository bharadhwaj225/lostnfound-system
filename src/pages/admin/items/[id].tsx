import AdminNavbar from "@/components/admin/AdminNavbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Head from "next/head";

type AdminItem = {
  _id: string;
  itemName: string;
  category: string;
  status: "lost" | "found";
  dateLost?: string;
  dateFound?: string;
  location: string;
  description?: string;
  imageUrl?: string;
  email?: string;
  createdAt: string;
};

export default function AdminItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<AdminItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        setLoading(true);

        // Try fetching from found-items
        let res = await fetch(`/api/admin/found-items/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem({ ...data, status: "found" });
          return;
        }

        // Else, try lost-items
        res = await fetch(`/api/admin/lost-items/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem({ ...data, status: "lost" });
          return;
        }

        throw new Error("Item not found");
      } catch (err) {
        console.error(err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading item details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/admin/items"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    {item && (
  <Head>
    <title>{`${item.status === "lost" ? "Lost" : "Found"} Item ${item.itemName} | Admin Panel`}</title>
    <meta
      name="description"
      content={`Admin view of ${item.status} item: ${item.itemName}, reported near ${item.location}.`}
    />
    </Head>
)}
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/admin/items"
            className="flex items-center text-sm text-gray-600 hover:underline mb-6"
          >
            ← Back to Items
          </Link>

          <div className="bg-white rounded shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="absolute top-8 right-8 lg:top-6 lg:right-6">
              <span
                className={`px-3 py-1 text-sm rounded font-medium 
                ${item.status === "lost" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
              >
                {item.status === "lost" ? "Lost" : "Found"}
              </span>
            </div>

            {/* Image */}
            <div className="rounded overflow-hidden bg-gray-100 flex items-center justify-center aspect-square">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.itemName} className="object-contain w-full h-full" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.itemName}</h1>
              <p className="text-gray-600 mb-4">{item.category}</p>

              <hr className="my-4" />

              <div className="space-y-4 text-gray-800">
                <div>
                  <p className="text-sm text-gray-500">Reported At</p>
                  <p>{format(new Date(item.createdAt), "PPP")}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{item.location}</p>
                </div>

                {item.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{item.email}</p>
                  </div>
                )}

                {(item.dateLost || item.dateFound) && (
                  <div>
                    <p className="text-sm text-gray-500">
                      {item.status === "lost" ? "Date Lost" : "Date Found"}
                    </p>
                    <p>
                      {format(new Date(item.dateLost || item.dateFound || ""), "PPP")}
                    </p>
                  </div>
                )}

                {item.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="whitespace-pre-line">{item.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
