import { Package, Plus, Upload } from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import ShipmentsFilters from "./ShipmentsFilters"

type Shipment = {
  id: string
  shipment_id: string
  service_type: string | null
  status: string
  origin: string | null
  destination: string | null
  transport_mode: string | null
  etd: string | null
  eta: string | null
  created_at: string
  customers: { company_name: string }[] | null
}

const STATUS_STYLES: Record<string, string> = {
  booked:            "bg-slate-100 text-slate-700",
  picked_up:         "bg-blue-100 text-blue-700",
  in_transit:        "bg-amber-100 text-amber-800",
  customs:           "bg-orange-100 text-orange-700",
  out_for_delivery:  "bg-indigo-100 text-indigo-700",
  delivered:         "bg-green-100 text-green-700",
  on_hold:           "bg-red-100 text-red-700",
}

const STATUS_LABELS: Record<string, string> = {
  booked:            "Booked",
  picked_up:         "Picked Up",
  in_transit:        "In Transit",
  customs:           "Customs",
  out_for_delivery:  "Out for Delivery",
  delivered:         "Delivered",
  on_hold:           "On Hold",
}

const SERVICE_LABELS: Record<string, string> = {
  ior:     "IOR",
  eor:     "EOR",
  freight: "Freight",
  itad:    "ITAD",
}

function fmt(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; mode?: string }>
}) {
  const { q, status, mode } = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from("shipments")
    .select("id, shipment_id, service_type, status, origin, destination, transport_mode, etd, eta, created_at, customers(company_name)")
    .order("created_at", { ascending: false })
    .limit(100)

  if (status) query = query.eq("status", status)
  if (mode)   query = query.eq("transport_mode", mode)
  if (q)      query = query.or(`shipment_id.ilike.%${q}%,origin.ilike.%${q}%,destination.ilike.%${q}%`)

  const { data: shipments } = await query
  const rows = (shipments ?? []) as Shipment[]

  return (
    <div className="px-8 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Shipments</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {rows.length === 0
              ? "No shipments yet"
              : `${rows.length} shipment${rows.length !== 1 ? "s" : ""} total`}
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

      <ShipmentsFilters />

      {rows.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-12 max-w-sm w-full mx-auto flex flex-col items-center text-center border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700">No shipments yet</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Track and manage all your IOR/EOR shipments in one place. Create your first shipment to get started.
            </p>
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
      ) : (
        /* Shipments table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Shipment ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ETD / ETA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-semibold text-slate-800 text-xs tracking-wide">
                        {s.shipment_id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {s.customers?.[0]?.company_name ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {s.service_type ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                          {SERVICE_LABELS[s.service_type] ?? s.service_type.toUpperCase()}
                        </span>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {s.origin || s.destination ? (
                        <span className="flex items-center gap-1.5">
                          <span>{s.origin ?? "—"}</span>
                          <span className="text-slate-300">→</span>
                          <span>{s.destination ?? "—"}</span>
                        </span>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[s.status] ?? "bg-slate-100 text-slate-700"}`}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-700">{fmt(s.etd)}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{fmt(s.eta)}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">{fmt(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
