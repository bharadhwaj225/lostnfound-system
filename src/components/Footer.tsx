import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-none mt-8">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="space-y-4 mb-6 md:mb-0">
            <div>
              <span className="text-xl font-bold text-black">
                Lost<span className="text-gray-400">&</span>Found
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Your campus lost and found solution. Reuniting people with their belongings since 2025.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-gray-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/listings" className="text-sm text-gray-600">
                    Listings
                  </Link>
                </li>
                <li>
                  <Link href="/report-lost" className="text-sm text-gray-600 hover:text-yellow-500">
                    Report Lost
                  </Link>
                </li>
                <li>
                  <Link href="/report-found" className="text-sm text-gray-600 hover:text-green-500">
                    Report Found
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Admin</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/login" className="text-sm text-gray-600">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-sm text-gray-600">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/profile/reports" className="text-sm text-gray-600">
                    My Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-sm text-gray-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Lost&Found. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
