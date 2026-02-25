import AdminSidebar from "../admin/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div >
      {/* <AdminSidebar /> */}
      <main >{children}</main>
    </div>
  );
}
