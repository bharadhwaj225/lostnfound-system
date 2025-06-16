import Link from "next/link";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import Head from "next/head";

type Claim = {
  _id: string;
  itemId: string;
  itemType: string;
  name: string;
  email: string;
  proofMessage: string;
  status: string;
};

export default function AdminClaims() {
  const { status } = useAdminAuth();
  const [claims, setClaims] = useState<Claim[]>([]);

  const fetchClaims = async () => {
    const res = await fetch("/api/admin/claims");
    if (res.ok) setClaims(await res.json());
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchClaims();
    }
  }, [status]);

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/claims/${id}/approve`, { method: "POST" });
    fetchClaims();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/admin/claims/${id}/reject`, { method: "POST" });
    fetchClaims();
  };

  return (
    <div>
      <Head>
        <title>Manage Claims | Admin Dashboard</title>
        <meta name="description" content="Review and approve claims on reported items to ensure rightful returns." />
      </Head>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Claims</h1>

        {claims.length === 0 ? (
          <p>No claims found.</p>
        ) : (
          claims.map(claim => (
            <Link
              key={claim._id}
              href={`/admin/claims/${claim._id}`}
              className="block p-4 rounded shadow-md mb-3 hover:bg-gray-50 transition"
            >
              <div>
                <p>
                  <strong>{claim.name}</strong> ({claim.email}) -{" "}
                  {claim.itemType} item #{claim.itemId}
                </p>
                <p className="text-sm text-gray-700 mt-1">{claim.proofMessage}</p>
                <p className="text-sm text-gray-500 mt-1">Status: {claim.status}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
