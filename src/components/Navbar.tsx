import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">
                Lost<span className="text-gray-400">&</span>Found
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
              Home
            </Link>
            <Link href="/listings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
              Listings
            </Link>
            <Link href="/report-lost" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-500 hover:bg-yellow-100 hover:text-yellow-500 transition-colors">
              Report Lost
            </Link>
            <Link href="/report-found" className="px-3 py-2 rounded-md text-sm font-medium text-green-500 hover:bg-green-100 hover:text-green-500 transition-colors">
              Report Found
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden sm:flex sm:items-center">
            <Link href="/admin/login">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-black text-white">
                Sign In
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
            Home
          </Link>
          <Link href="/listings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
            Listings
          </Link>
          <Link href="/report-lost" className="block px-3 py-2 rounded-md text-sm font-medium text-yellow-500 hover:bg-yellow-100 hover:text-yellow-500 transition-colors">
            Report Lost
          </Link>
          <Link href="/report-found" className="block px-3 py-2 rounded-md text-sm font-medium text-green-500 hover:bg-green-100 hover:text-green-500 transition-colors">
            Report Found
          </Link>
          <Link href="/admin/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
