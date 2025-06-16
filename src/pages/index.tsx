import RecentItemsSection from "@/components/RecentItemsSection";
import Home from "../components/Home";
import Footer from "../components/Footer";
import Statistics from "@/components/Statistics";

export default function HomePage() {
  return (
    <main>
      <Home />
      <Statistics />
      <RecentItemsSection />
      <Footer />
    </main>
  );
}
