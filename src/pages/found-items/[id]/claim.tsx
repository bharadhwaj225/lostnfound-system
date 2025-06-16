import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ClaimItem() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", reason: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/found-items/${id}`)
        .then(res => res.json())
        .then(data => setItem(data))
        .catch(() => setStatus("Failed to load item details"));
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/admin/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: id,
        itemType: "found",
        name: form.name,
        email: form.email,
        proofMessage: form.reason,
        proofFileUrl: null,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("Claim submitted successfully!");
      setForm({ name: "", email: "", reason: "" });
    } else {
      setStatus(data.message || "Something went wrong");
    }
  }

  if (!item) return <p>Loading item...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Claim Item: <span className="text-gray-500">{item.itemName}</span>
        </h1>

        {status && (
          <div className="mb-6 text-sm font-medium text-green-700 bg-green-100 px-4 py-2 rounded-md border border-green-200">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Claim
            </label>
            <textarea
              name="reason"
              id="reason"
              rows={4}
              required
              placeholder="Explain why you believe this item belongs to you..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}
