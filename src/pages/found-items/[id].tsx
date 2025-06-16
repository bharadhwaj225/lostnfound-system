import { GetServerSideProps } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../lib/mongodb";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

type FoundItem = {
  _id: string;
  itemName: string;
  category: string;
  dateFound: string | null;
  location: string;
  description?: string;
  email: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
};

type Props = {
  item: FoundItem | null;
};

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-300",
  resolved: "bg-gray-100 text-gray-600 border-gray-300",
  inactive: "bg-red-100 text-red-800 border-red-300",
};

const statusText = {
  active: "Found",
  resolved: "Resolved",
  inactive: "Lost",
};

export default function FoundItemDetails({ item }: Props) {
  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-12 bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="text-gray-600 mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/found-items"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Listings
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    if (username.length <= 2) return email;
    return `${username.charAt(0)}${"*".repeat(username.length - 2)}${username.charAt(
      username.length - 1
    )}@${domain}`;
  };

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Listings
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 relative">
              <div className="absolute top-9 right-8 z-10">
                <span
                  className={`inline-block px-3 py-0.5 rounded border-none bg-green-100 text-green-500 text-sm font-semibold ${statusStyles[item.status as keyof typeof statusStyles] ?? statusStyles.active
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
                    <h3 className="text-sm font-medium text-gray-500">Date Found</h3>
                    <p className="mt-1 text-gray-900">
                      {item.dateFound
                        ? format(new Date(item.dateFound), "MMMM d, yyyy")
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-gray-900">{item.location}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                    <p className="mt-1 text-gray-900">{maskEmail(item.email)}</p>
                  </div>

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

                {item.status === "active" && (
                  <div className="mt-6">
                    <Link
                      href={`/found-items/${item._id}/claim`}
                      className="block w-full text-center bg-black hover:bg-black-shadow text-white px-4 py-2 rounded font-semibold"
                    >
                      Claim This Item
                    </Link>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  if (!id || typeof id !== "string") {
    return { props: { item: null } };
  }

  if (!ObjectId.isValid(id)) {
    return { props: { item: null } };
  }

  const db = await getDb();
  const foundItem = await db
    .collection("foundItems")
    .findOne({ _id: new ObjectId(id), status: "active" });

  if (!foundItem) {
    return { props: { item: null } };
  }

  const item = {
    ...foundItem,
    _id: foundItem._id.toString(),
    createdAt: foundItem.createdAt.toISOString(),
    dateFound: foundItem.dateFound ? new Date(foundItem.dateFound).toISOString() : null,
    deletedAt: foundItem.deletedAt ? new Date(foundItem.deletedAt).toISOString() : null,
  };

  return { props: { item } };
};