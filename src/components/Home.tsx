import Link from "next/link";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
          <div className="text-center mt-12 sm:mt-18">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Lost Something?</span>
              <span className="block text-primary">We Can Help You Find It</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A simple, efficient campus lost and found system to help you recover your belongings
              or return found items to their rightful owners.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/report-lost" className="w-full sm:w-auto shadow-md border-none inline-block text-center bg-yellow-500 hover:text-yellow-100 text-white font-semibold px-6 py-3 rounded-md">
                I Lost Something
              </Link>
              <Link href="/report-found" className="w-full sm:w-auto shadow-md border-none inline-block text-center bg-green-400 hover:text-green-100 text-white font-semibold px-6 py-3 rounded-md">
                I Found Something
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
