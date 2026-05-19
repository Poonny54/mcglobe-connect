"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState } from "react"
import { Search, ChevronDown } from "lucide-react"

export default function ShipmentsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function pushParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v)
      else params.delete(k)
    }
    router.push(`/dashboard/shipments?${params.toString()}`)
  }

  function handleSearch(value: string) {
    setSearch(value)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => pushParams({ q: value }), 300)
  }

  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by ID, origin, destination..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      <div className="relative">
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => pushParams({ status: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="booked">Booked</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="customs">Customs</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="on_hold">On Hold</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={searchParams.get("mode") ?? ""}
          onChange={(e) => pushParams({ mode: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
        >
          <option value="">All Modes</option>
          <option value="air">Air</option>
          <option value="sea">Sea</option>
          <option value="road">Road</option>
          <option value="rail">Rail</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}
