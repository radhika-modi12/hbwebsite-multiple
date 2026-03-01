"use client";
import Link from "next/link";
export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>My Dashboard</h2>
      <ul>       
        <li>
          <Link href="/admin/hotel">Hotels</Link>
        </li>
        <li>
          <Link href="/admin/room">Rooms</Link>
        </li>
        <li>
          <Link href="/admin/facility">Facilities</Link>
        </li>
        <li>
          <Link href="/admin/feature">Features</Link>
        </li>
        <li>
          <Link href="/reports">Reports</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
}