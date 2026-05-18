"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Globe,
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Activity,
  Store,
  DollarSign,
  Search,
  Plus,
  LogOut,
} from "lucide-react"

const operationsNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Shipments", href: "/dashboard/shipments", icon: Package },
  { label: "Quote Requests", href: "/dashboard/quotes", icon: FileText },
  { label: "Quote Templates", href: "/dashboard/quote-templates", icon: FileText },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Activity Log", href: "/dashboard/activity", icon: Activity },
]

const ratesNav = [
  { label: "Vendors", href: "/dashboard/vendors", icon: Store },
  { label: "Vendor Rates", href: "/dashboard/vendor-rates", icon: DollarSign },
  { label: "Cost Rate Lookup", href: "/dashboard/rate-lookup", icon: Search },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen shrink-0 bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">MCGlobe</p>
          <p className="text-slate-400 text-[10px] font-semibold tracking-widest uppercase leading-tight">
            Logistics Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Operations */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
            Operations
          </p>
          <ul className="space-y-0.5">
            {operationsNav.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      active
                        ? "border-l-2 border-blue-400 bg-white/10 text-white pl-[6px]"
                        : "border-l-2 border-transparent text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Rates & Vendors */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
            Rates &amp; Vendors
          </p>
          <ul className="space-y-0.5">
            {ratesNav.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      active
                        ? "border-l-2 border-blue-400 bg-white/10 text-white pl-[6px]"
                        : "border-l-2 border-transparent text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* New Shipment Button */}
      <div className="px-3 pb-3">
        <Link
          href="/dashboard/shipments/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Shipment
        </Link>
      </div>

      {/* User Footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Admin User</p>
            <p className="text-slate-400 text-xs truncate">admin@mcglobe.com</p>
          </div>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
            ADMIN
          </span>
        </div>
        <button className="flex items-center gap-2 mt-1 px-2 py-1.5 w-full rounded-md text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 text-sm transition-all duration-150">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
