import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";

export default function Statistics() {
  const [statsData, setStatsData] = useState({
    lost: 0,
    found: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [lostRes, foundRes, claimsRes] = await Promise.all([
          fetch("/api/lost-items"),
          fetch("/api/found-items"),
          fetch("/api/admin/claims"),
        ]);

        const lostData = await lostRes.json();
        const foundData = await foundRes.json();
        const claimsData = await claimsRes.json();

        const resolvedCount = claimsData.filter(
          (claim: any) => claim.status === "approved"
        ).length;

        setStatsData({
          lost: lostData.length,
          found: foundData.length,
          resolved: resolvedCount,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading)
    return <p className="text-center py-10">Loading statistics...</p>;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6 text-center sm:text-3xl">
          Current Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Items Lost"
            value={statsData.lost}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            className="bg-yellow-100 border-l-4 border-yellow-500"
          />

          <StatCard
            title="Items Found"
            value={statsData.found}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            className="bg-green-100 border-l-4 border-green-500"
          />

          <StatCard
            title="Items Resolved"
            value={statsData.resolved}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
            className="bg-blue-100 border-l-4 border-blue-500"
          />
        </div>
      </div>
    </section>
  );
}