import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Link from "next/link";

type Claim = {
  _id: string;
  itemId: string;
  itemType: string;
  name: string;
  email: string;
  proofMessage: string;
  proofFileUrl?: string | null;
  status: string;
  createdAt: string;
};

export default function AdminClaimDetail() {
  const { status } = useAdminAuth();
  const router = useRouter();
  const { id } = router.query;
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || status !== "authenticated") return;

    const fetchClaim = async () => {
      try {
        const res = await fetch(`/api/admin/claims/${id}`);
        if (!res.ok) throw new Error("Failed to fetch claim");
        const data = await res.json();
        setClaim(data);
      } catch (error) {
        console.error("Error fetching claim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id, status]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!id) return;
    await fetch(`/api/admin/claims/${id}/${action}`, {
      method: "POST",
    });
    router.reload();
  };

  if (status === "loading" || loading) {
    return <div className="p-6 text-gray-600">Loading claim details...</div>;
  }

  if (!claim) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Claim not found</h1>
        <Link href="/admin/claims" className="text-blue-600 hover:underline">
          ← Back to Claims
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="max-w-3xl mx-auto p-6">
        <Link href="/admin/claims" className="text-sm text-gray-600 hover:underline mb-4 block">
          ← Back to Claims
        </Link>

        <div className="bg-white shadow rounded p-6 space-y-4">
          <h1 className="text-2xl font-bold">Claim by {claim.name}</h1>
          <p><strong>Email:</strong> {claim.email}</p>
          <p><strong>Item Type:</strong> {claim.itemType}</p>
          <p><strong>Item ID:</strong> {claim.itemId}</p>
          <p><strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-white text-sm ${claim.status === "approved"
                  ? "bg-green-600"
                  : claim.status === "rejected"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
            >
              {claim.status}
            </span>
          </p>

          <div>
            <p className="font-medium">Proof Message:</p>
            <p className="text-gray-700 whitespace-pre-line">{claim.proofMessage}</p>
          </div>

          {claim.proofFileUrl && (
            <div>
              <p className="font-medium">Proof File:</p>
              <a
                href={claim.proofFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Uploaded File
              </a>
            </div>
          )}

          {claim.status === "pending" && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleAction("approve")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
