import Navbar from "../components/Navbar";
import ItemReportForm from "../components/ItemReportForm";
import Footer from "@/components/Footer";
import Head from "next/head";

export default function ReportLostPage() {
  return (
    <>
      <Head>
        <title>Report Lost Item | Lost & Found</title>
        <meta name="description" content="Lost something? Submit a detailed lost item report to increase your chances of recovery." />
      </Head>
      <Navbar />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mt-14">Report Lost Item</h1>
        <p className="text-gray-600">
          Fill out the form below with as much detail as possible to help us find your item.
        </p>
      </div>
      <ItemReportForm type="lost" apiEndpoint="/api/lost-items/create" />
      <Footer />
    </>
  );
}
