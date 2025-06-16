import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDistanceToNow } from "date-fns";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  dateLost?: string;
  dateFound?: string;
  location: string;
  description: string;
  imageUrl?: string;
  status: "Lost" | "Found";
};

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Stationery",
  "Accessories",
  "Documents",
];

const ITEMS_PER_PAGE = 9;

export default function Listings() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [tab, setTab] = useState<"All" | "Lost" | "Found">("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchItems() {
      try {
        const [lostRes, foundRes] = await Promise.all([
          fetch("/api/lost-items"),
          fetch("/api/found-items"),
        ]);

        if (!lostRes.ok || !foundRes.ok) throw new Error("Failed to fetch items");

        const lost = await lostRes.json();
        const found = await foundRes.json();

        const combined = [
          ...lost.map((item: Item) => ({ ...item, status: "Lost" })),
          ...found.map((item: Item) => ({ ...item, status: "Found" })),
        ];

        setAllItems(combined);
        setFilteredItems(combined);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  useEffect(() => {
    let result = allItems;

    if (tab !== "All") {
      result = result.filter((item) => item.status === tab);
    }

    if (selectedCategory !== "All Categories") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);

    setCurrentPage(1);
  }, [tab, selectedCategory, searchQuery, allItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 mt-3">Item Listings</h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-4 mb-6 items-center"
        >
          <input
            type="text"
            placeholder="Search for lost or found items..."
            className="flex-1 border-none bg-gray-50 px-4 py-2 rounded-md w-full md:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border-none bg-gray-50 px-3 py-2 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-black text-white px-5 py-2 rounded-md">
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            className={`px-4 py-2 rounded-md font-medium ${tab === "All"
              ? "bg-black text-white"
              : "border-none border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            onClick={() => setTab("All")}
          >
            All Items
          </button>

          <button
            className={`px-4 py-2 rounded-md font-medium ${tab === "Lost"
              ? "bg-yellow-500 text-white hover:bg-yellow-400"
              : "bg-gray-50 border-yellow-600 text-black-600 hover:bg-yellow-500 hover:text-white"
              }`}
            onClick={() => setTab("Lost")}
          >
            Lost Items
          </button>

          <button
            className={`px-4 py-2 rounded-md font-medium ${tab === "Found"
              ? "bg-green-400 text-white hover:bg-green-500"
              : "bg-gray-50 border-green-500 text-black hover:bg-green-500 hover:text-white"
              }`}
            onClick={() => setTab("Found")}
          >
            Found Items
          </button>
        </div>




        {loading && <p>Loading items...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && filteredItems.length === 0 && <p>No items found.</p>}

        {/* Items grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="relative flex flex-col h-full rounded-lg shadow-md overflow-hidden bg-white"
            >
              {/* Status Badge */}
              <span
                className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-sm z-10 ${item.status === "Lost"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
                  }`}
              >
                {item.status}
              </span>

              {/* Image */}
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.itemName}
                className="w-full h-60 object-contain bg-gray-50"
              />

              {/* Content */}
              <div className="flex flex-col justify-between p-4 flex-grow">
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span className="capitalize">{item.category}</span>
                    <span>
                      {item.status === "Lost" && item.dateLost
                        ? formatDistanceToNow(new Date(item.dateLost), { addSuffix: true })
                        : item.status === "Found" && item.dateFound
                          ? formatDistanceToNow(new Date(item.dateFound), { addSuffix: true })
                          : ""}
                    </span>
                  </div>


                  <h2 className="text-lg font-semibold mb-1">{item.itemName}</h2>
                  <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/${item.status === "Lost" ? "lost-items" : "found-items"}/${item._id}`}
                    className="mt-2 text-sm font-medium text-black bg-gray-200 px-2 py-1  rounded-xl sm:rounded-3xl hover:bg-gray-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 border-none rounded-md ${currentPage === pageNum
                  ? "bg-black text-white"
                  : "bg-white text-black"
                  }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              className="px-3 py-1 border-none bg-gray-100 rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
