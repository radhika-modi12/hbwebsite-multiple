import React, { useState,useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  const pathname = usePathname(); // Get current path
  const router = useRouter();

   const [userData, setUserData] = useState(null);

  // ✅ Access localStorage inside useEffect
  useEffect(() => {
    const storedUser = localStorage.getItem("user_details");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

 const handleLogout = () => {
    localStorage.clear();
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Booking Orders", href: "/admin/bookingOrders" },
    { label: "Hotels", href: "/admin/hotel" },
    { label: "Carausals", href: "/admin/carausal" },
    { label: "Rooms", href: "/admin/room" },
    { label: "Facilities", href: "/admin/facility" },
    { label: "Features", href: "/admin/feature" },
    { label: "Room Images", href: "/admin/roomImages" },
    { label: "Room Types", href: "/admin/roomTypes" },
    { label: "Team Member Details", href: "/admin/teamMemberDetails" },
    { label: "User", href: "/admin/user" },
    { label: "Rating Review", href: "/admin/ratingReview" },
    { label: "User Queries", href: "/admin/userQueries" },
    { label: "Location", href: "/admin/location" },
  ];

  const filteredNavItems =
  userData?.role === "manager"
    ? navItems.filter(item => item.label === "Booking Orders")
    : navItems;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2 panel-link">
          {filteredNavItems.map((item) => (
            <>
              <Link
                key={item.href}
                href={item.href}
                className={`hover:underline px-2 py-1 rounded ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {item.label}
              </Link>
            </>
          ))}
          <a
            onClick={handleLogout}
            className="hover:underline px-2 py-1 rounded text-gray-800"
          >
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">                
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </main>
    </div>
  );
}
