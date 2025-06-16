import Navbar from "@/components/Navbar";
import ItemReportForm from "../components/ItemReportForm";
import Footer from "@/components/Footer";
import Head from "next/head";

export default function ReportFoundPage() {
  return (
    <>
      <Head>
        <title>Report Found Item | Lost & Found</title>
        <meta name="description" content="Found an item? Help return it to its owner by submitting a report with location and description." />
      </Head>
      <Navbar />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mt-14">Report Found Item</h1>
        <p className="text-gray-600">
          Thank you for finding this item! Please provide details to help us return it to its owner.
        </p>
      </div>
      <ItemReportForm type="found" apiEndpoint="/api/found-items/create" />
      <Footer />
    </>
  );
}
