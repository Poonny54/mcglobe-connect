"use client"

import { usePathname } from "next/navigation"
import { Search, Bell, ChevronRight } from "lucide-react"

const routeLabels: Record<string, { section: string; page: string }> = {
  "/dashboard":                  { section: "Operations", page: "Dashboard" },
  "/dashboard/shipments":        { section: "Operations", page: "Shipments" },
  "/dashboard/quotes":           { section: "Operations", page: "Quote Requests" },
  "/dashboard/quote-templates":  { section: "Operations", page: "Quote Templates" },
  "/dashboard/customers":        { section: "Operations", page: "Customers" },
  "/dashboard/activity":         { section: "Operations", page: "Activity Log" },
  "/dashboard/vendors":          { section: "Rates & Vendors", page: "Vendors" },
  "/dashboard/vendor-rates":     { section: "Rates & Vendors", page: "Vendor Rates" },
  "/dashboard/rate-lookup":      { section: "Rates & Vendors", page: "Cost Rate Lookup" },
}

export default function TopNav() {
  const pathname = usePathname()
  const match = routeLabels[pathname] ?? { section: "Operations", page: "Dashboard" }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-6 bg-white border-b border-slate-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-400 font-medium">{match.section}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-800 font-semibold">{match.page}</span>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all duration-75">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification bell */}
        <button className="relative flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all duration-75">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-2" />

        {/* User avatar */}
        <button className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold active:scale-95 transition-all duration-75">
          AD
        </button>
      </div>
    </header>
  )
}
