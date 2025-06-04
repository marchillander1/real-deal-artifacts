
import DashboardComponent from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardComponent />
    </div>
  );
}
