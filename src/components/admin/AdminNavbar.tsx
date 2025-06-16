import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  LogOut,
  Eye,
  LayoutDashboard,
  PackageSearch,
  BadgeCheck,
  UserCircle,
} from "lucide-react";

export default function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const adminEmail = session?.user?.email || "admin@example.com";

  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center z-50 relative">
      <div className="text-xl font-bold">
        <Link href="/admin/dashboard" className="flex-shrink-0 flex items-center">
          <span className="text-2xl font-bold text-primary">
            Lost<span className="text-gray-400">&</span>Found
          </span>
        </Link>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200"
        >
          <Eye size={16} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-sm text-red-600 rounded hover:bg-red-200"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Mobile */}
      <div className="md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        {mobileOpen && (
          <div className="absolute top-16 right-6 w-64 bg-white border-none rounded shadow-md z-50 text-sm">
            <div className="px-4 py-3 border-b">
              <div className="text-xs text-gray-500">Logged in as</div>
              <div className="font-medium truncate">{adminEmail}</div>
            </div>

            <Link
              href="/"
              className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <Eye size={16} /> View Site
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={16} /> Admin Dashboard
            </Link>
            <Link
              href="/admin/items"
              className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <PackageSearch size={16} /> Admin Items
            </Link>
            <Link
              href="/admin/claims"
              className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <BadgeCheck size={16} /> Admin Claims
            </Link>
            <Link
              href="/admin/deleted-items"
              className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <BadgeCheck size={16} /> Deleted Items
            </Link>
            <button
              onClick={handleLogout}
              className="flex gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
