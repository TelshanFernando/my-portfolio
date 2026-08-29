import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader />

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}