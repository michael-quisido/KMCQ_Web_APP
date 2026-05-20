import "../globals.css";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "KMCQ Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: "30px", position: "relative" }}>
          {children}
          <div style={{ position: "fixed", bottom: 10, right: 10, fontSize: 12, color: "#999", zIndex: 9999 }}>
            Powered by: KMCQ-GmbH Agila-WHS
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
