import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface ItemReportFormProps {
  type: "lost" | "found";
  apiEndpoint: string;
}

export default function ItemReportForm({ type, apiEndpoint }: ItemReportFormProps) {
  const [form, setForm] = useState({
    itemName: "",
    category: "",
    date: "",
    location: "",
    description: "",
    email: "",
    imageUrl: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      form.itemName.trim() &&
      form.category.trim() &&
      form.date.trim() &&
      form.location.trim() &&
      form.email.trim();
    setIsFormValid(Boolean(isValid));
  }, [form]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const payload = {
      ...form,
      ...(type === "lost" ? { dateLost: form.date } : { dateFound: form.date }),
    };
    delete payload.date;

    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("✅ Report submitted successfully!");
      setForm({
        itemName: "",
        category: "",
        date: "",
        location: "",
        description: "",
        email: "",
        imageUrl: "",
      });
    } else {
      setStatus(`❌ Error: ${data.message || "Something went wrong"}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl text-center font-bold">
        Report {type === "lost" ? "Lost" : "Found"} Item
      </h2>
      <p className="mb-8 text-center sm:text-center">Fill out the form below to report an item you have {type === "lost" ? "lost" : "found"}.</p>
      {status && <div className="text-sm text-center mb-4">{status}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="title">Item Name</Label>
        <input
          name="itemName"
          type="text"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none"
        />
        <Label htmlFor="category">Category</Label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 bg-white focus:outline-none"
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Documents">Documents</option>
          <option value="Accessories">Accessories</option>
          <option value="Others">Others</option>
        </select>
        <Label>Date {type === "lost" ? "Lost" : "Found"}</Label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none"
        />
        <Label htmlFor="location">Location</Label>
        <input
          name="location"
          type="text"
          placeholder={`Location ${type === "lost" ? "Lost" : "Found"}`}
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none"
        />
        <Label htmlFor="description">Description</Label>
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2 focus:outline-none"
        />
        <Label htmlFor="contactEmail">Contact Email</Label>
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none"
        />
        <Label htmlFor="image">Upload Image (Optional)</Label>
        <input
          name="imageUrl"
          type="url"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 rounded text-white font-semibold transition ${isFormValid
              ? type === "lost"
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
