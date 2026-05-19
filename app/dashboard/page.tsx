import { Package, Plus, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

const onboardingSteps = [
  {
    step: 1,
    title: "Add your first customer",
    desc: "Set up a customer profile to start managing their shipments and quotes.",
  },
  {
    step: 2,
    title: "Create a shipment",
    desc: "Log a new shipment to track it through every stage of delivery.",
  },
  {
    step: 3,
    title: "Set up vendor rates",
    desc: "Add vendors and configure their rates for accurate cost lookups.",
  },
]

function n(count: number | null) {
  return count ?? 0
}

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const [
    { count: total },
    { count: inTransit },
    { count: delivered },
    { count: onHold },
    { count: customers },
    { count: booked },
    { count: pickedUp },
    { count: customs },
    { count: outForDelivery },
  ] = await Promise.all([
    supabase.from("shipments").select("*", { count: "exact", head: true }),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "in_transit"),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "delivered"),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "on_hold"),
    supabase.from("customers").select("*",  { count: "exact", head: true }),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "booked"),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "picked_up"),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "customs"),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "out_for_delivery"),
  ])

  const statCards = [
    { label: "Total Shipments", value: n(total),      bar: "bg-blue-500" },
    { label: "In Transit",      value: n(inTransit),  bar: "bg-amber-500" },
    { label: "Delivered",       value: n(delivered),  bar: "bg-green-500" },
    { label: "Attention",       value: n(onHold),     bar: "bg-red-500" },
    { label: "Customers",       value: n(customers),  bar: "bg-purple-500" },
  ]

  const statusBreakdown = [
    { label: "Booked",           count: n(booked),         topBorder: "border-t-2 border-slate-400" },
    { label: "Picked Up",        count: n(pickedUp),       topBorder: "border-t-2 border-blue-400" },
    { label: "In Transit",       count: n(inTransit),      topBorder: "border-t-2 border-blue-500" },
    { label: "Customs",          count: n(customs),        topBorder: "border-t-2 border-amber-500" },
    { label: "Out for Delivery", count: n(outForDelivery), topBorder: "border-t-2 border-indigo-500" },
    { label: "Delivered",        count: n(delivered),      topBorder: "border-t-2 border-green-500" },
    { label: "On Hold",          count: n(onHold),         topBorder: "border-t-2 border-red-500" },
  ]

  return (
    <div className="px-8 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operations Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Overview of all logistics operations.</p>
        </div>
        <Link
          href="/dashboard/shipments/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Shipment
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, bar }) => (
          <div
            key={label}
            className="relative bg-white rounded-xl border border-slate-200 px-5 py-5 flex items-center justify-between shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <p className="text-4xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-1.5">{label}</p>
            </div>
            <div className={`absolute right-0 top-0 h-full w-1 rounded-l ${bar}`} />
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Status Breakdown</h2>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-7 gap-3">
          {statusBreakdown.map(({ label, count, topBorder }) => (
            <div
              key={label}
              className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${topBorder}`}
            >
              <p className="text-xl font-bold text-slate-700">{count}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-6">
        {/* Recent Quote Requests */}
        <div className="col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Quote Requests</h2>
            <Link
              href="/dashboard/quotes"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 font-medium"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No quote requests yet.</p>
            <p className="text-xs text-slate-400 mt-1">Quote requests from customers will appear here.</p>
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Welcome to MCGlobe Operations</h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">Get started with these quick setup steps.</p>
          <ol className="space-y-4">
            {onboardingSteps.map(({ step, title, desc }) => (
              <li key={step} className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
