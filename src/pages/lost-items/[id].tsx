import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

type LostItem = {
  _id: string;
  itemName: string;
  category: string;
  dateLost: string;
  location: string;
  description?: string;
  imageUrl?: string;
  status: string;
  email?: string;
  createdAt: string;
};

const statusStyles = {
  active: "bg-red-100 text-red-800 border-red-300",
  resolved: "bg-gray-100 text-gray-600 border-gray-300",
  inactive: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const statusText = {
  active: "Lost",
  resolved: "Resolved",
  inactive: "Inactive",
};

export default function LostItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<LostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchItem() {
      try {
        setLoading(true);
        const res = await fetch(`/api/lost-items/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch lost item details");
        }
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    if (username.length <= 2) return email;
    return `${username.charAt(0)}${"*".repeat(username.length - 2)}${username.charAt(username.length - 1)}@${domain}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-12 bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="text-gray-600 mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/lost-items">
              <a className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Return to Listings
              </a>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-6">
            <Link
              href="/listings"
              className="text-black hover:underline flex items-center font-small"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Listings
            </Link>
          </div>


          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 relative">
              <div className="absolute top-9 right-8 z-10">
                <span
                  className={`inline-block px-3 py-0.5 rounded border-none bg-yellow-100 text-yellow-500 text-sm font-semibold ${statusStyles[item.status as keyof typeof statusStyles] ?? statusStyles.active
                    }`}
                >
                  {statusText[item.status as keyof typeof statusText] ?? "Lost"}
                </span>
              </div>
              <div className="rounded-lg overflow-hidden aspect-square bg-gray-100 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="object-contain bg-gray-50 w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-gray-400">No Image Available</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{item.itemName}</h1>

                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600 font-medium">{item.category}</span>
                </div>

                <hr className="my-4" />

                <div className="grid grid-cols-1 gap-5 text-gray-700">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date Lost</h3>
                    <p className="mt-1 text-gray-900">
                      {item.dateLost ? format(new Date(item.dateLost), "MMMM d, yyyy") : "N/A"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-gray-900">{item.location}</p>
                  </div>

                  {item.email && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                      <p className="mt-1 text-gray-900">{maskEmail(item.email)}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                    <p className="mt-1 text-gray-900">
                      {format(new Date(item.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                {item.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-2 text-gray-900 whitespace-pre-line">{item.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
