import { Package, Plus, Search, ChevronDown, Upload } from "lucide-react"
import Link from "next/link"

const totalShipments = 0

export default function ShipmentsPage() {
  return (
    <div className="px-8 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Shipments</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {totalShipments === 0
              ? "No shipments yet"
              : `${totalShipments} shipment${totalShipments !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link
          href="/dashboard/shipments/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Shipment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, customer, origin, destination..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer">
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

        {/* Mode filter */}
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer">
            <option value="">All Modes</option>
            <option value="air">Air</option>
            <option value="sea">Sea</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-12 max-w-sm w-full mx-auto flex flex-col items-center text-center border border-slate-100">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
            <Package className="w-8 h-8 text-blue-500" />
          </div>

          {/* Copy */}
          <h3 className="text-xl font-semibold text-slate-700">No shipments yet</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Track and manage all your IOR/EOR shipments in one place. Create your first shipment to get started.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-7">
            <Link
              href="/dashboard/shipments/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              New Shipment
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 text-sm font-semibold transition-all duration-150">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
