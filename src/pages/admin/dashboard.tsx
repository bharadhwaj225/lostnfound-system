import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminStatistics from "./AdminStatistics";
import Head from "next/head";

type Item = {
  _id: string;
  itemName: string;
  status: "lost" | "found";
  email: string;
};

type Claim = {
  _id: string;
  itemId: string;
  itemType: string;
  name: string;
  email: string;
  proofMessage: string;
  status: string;
};

export default function AdminDashboard() {
  const { session, status } = useAdminAuth();
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchClaims = async () => {
      const res = await fetch("/api/admin/claims");
      if (res.ok) setClaims(await res.json());
    };

    fetchClaims();
  }, [status]);

  if (status === "loading") return <p>Loading session...</p>;
  if (status !== "authenticated") return <p>Redirecting to login...</p>;

  return (
    <>
      <Head>
        <title>Admin Dashboard | Lost & Found</title>
        <meta name="description" content="Admin panel overview for managing reports, users, and platform settings." />
      </Head>
      <div>
        <AdminNavbar />
        <div className="flex min-h-screen">
          <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white px-6 py-8 space-y-4">
            <Link href="/admin/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            <Link href="/admin/items" className="hover:text-yellow-400">Items</Link>
            <Link href="/admin/claims" className="hover:text-yellow-400">Claims</Link>
            <Link href="/admin/deleted-items" className="hover:text-yellow-400">Deleted Items</Link>
            <Link href="/" className="mt-auto text-sm text-gray-400 hover:text-white">View Site</Link>
          </aside>
          <div className="flex-1">
            <main className="p-6">
              <h1 className="text-3xl font-bold"></h1>
              <AdminStatistics />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
