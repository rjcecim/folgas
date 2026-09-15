import { AuthGate } from "@/components/layout/AuthGate";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export default function Home() {
  return (
    <AuthGate>
      <DashboardPage />
    </AuthGate>
  );
}
