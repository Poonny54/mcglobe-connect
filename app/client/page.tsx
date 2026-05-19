import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Package,
  CheckCircle2,
  FileText,
  Upload,
  MessageSquare,
  ArrowRight,
  Globe,
  Activity,
  Clock,
  AlertCircle,
  Truck,
  MapPin,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Shipment = {
  id: string
  shipment_id: string
  service_type: string | null
  status: string
  origin: string | null
  destination: string | null
  etd: string | null
  eta: string | null
  created_at: string
  customers: { company_name: string }[] | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGES = [
  { key: "booked",            label: "Booked" },
  { key: "picked_up",         label: "Picked Up" },
  { key: "in_transit",        label: "In Transit" },
  { key: "customs",           label: "Customs" },
  { key: "out_for_delivery",  label: "Out for Delivery" },
  { key: "delivered",         label: "Delivered" },
]

const STATUS_CONFIG: Record<string, { label: string; badge: string; glow: string }> = {
  booked:           { label: "Booked",           badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",     glow: "0 0 10px rgba(148,163,184,0.25)" },
  picked_up:        { label: "Picked Up",        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",        glow: "0 0 12px rgba(6,182,212,0.5)" },
  in_transit:       { label: "In Transit",       badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",        glow: "0 0 12px rgba(59,130,246,0.5)" },
  customs:          { label: "Customs",          badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",     glow: "0 0 12px rgba(245,158,11,0.5)" },
  out_for_delivery: { label: "Out for Delivery", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",  glow: "0 0 12px rgba(99,102,241,0.45)" },
  delivered:        { label: "Delivered",        badge: "bg-green-500/20 text-green-300 border-green-500/30",     glow: "0 0 12px rgba(34,197,94,0.5)" },
  on_hold:          { label: "On Hold",          badge: "bg-red-500/20 text-red-300 border-red-500/30",           glow: "0 0 12px rgba(239,68,68,0.5)" },
}

const SERVICE_LABELS: Record<string, string> = {
  ior: "IOR", eor: "EOR", freight: "Freight", itad: "ITAD",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function getStageIndex(status: string) {
  return STAGES.findIndex((s) => s.key === status)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlassCard({ children, className = "", style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <GlassCard className="px-5 py-4 text-center min-w-[110px]">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</p>
    </GlassCard>
  )
}

function ShipmentProgress({ status }: { status: string }) {
  const currentIdx = getStageIndex(status)
  const isOnHold = status === "on_hold"

  return (
    <div className="mt-4">
      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const done    = !isOnHold && i <  currentIdx
          const active  = !isOnHold && i === currentIdx
          const isLast  = i === STAGES.length - 1

          return (
            <div key={stage.key} className="flex items-center" style={{ flex: isLast ? "0 0 auto" : 1 }}>
              {/* Node */}
              <div
                className="relative shrink-0 flex items-center justify-center"
                style={{ width: active ? 20 : 12, height: active ? 20 : 12 }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width:  active ? 16 : done ? 8 : 8,
                    height: active ? 16 : done ? 8 : 8,
                    background: done
                      ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                      : active
                      ? "linear-gradient(135deg,#60a5fa,#818cf8)"
                      : "rgba(255,255,255,0.15)",
                    boxShadow: active
                      ? "0 0 12px rgba(96,165,250,0.9), 0 0 24px rgba(96,165,250,0.4)"
                      : undefined,
                    transition: "all 0.2s ease",
                  }}
                />
                {active && (
                  <div
                    className="absolute rounded-full animate-ping"
                    style={{ width: 16, height: 16, background: "rgba(96,165,250,0.35)" }}
                  />
                )}
              </div>
              {/* Connector */}
              {!isLast && (
                <div
                  className="h-px flex-1"
                  style={{
                    background: done
                      ? "linear-gradient(90deg,#3b82f6,#6366f1)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Stage labels */}
      <div className="flex mt-1.5">
        {STAGES.map((stage, i) => {
          const active  = !isOnHold && i === currentIdx
          const isLast  = i === STAGES.length - 1
          return (
            <div
              key={stage.key}
              className="text-center"
              style={{
                flex: isLast ? "0 0 auto" : 1,
                fontSize: 9,
                color: active ? "#93c5fd" : "rgba(255,255,255,0.3)",
                fontWeight: active ? 600 : 400,
                minWidth: isLast ? 0 : undefined,
              }}
            >
              {stage.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.booked
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}
      style={{ boxShadow: cfg.glow }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: "currentColor",
          boxShadow: `0 0 4px currentColor`,
        }}
      />
      {cfg.label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClientPortalPage() {
  const supabase = await createServerClient()

  const [{ data: rawShipments }, { count: pendingQuotes }, { data: activityLog }] =
    await Promise.all([
      supabase
        .from("shipments")
        .select("id, shipment_id, service_type, status, origin, destination, etd, eta, created_at, customers(company_name)")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .in("status", ["submitted", "under_review"]),
      supabase
        .from("activity_log")
        .select("id, action, entity_type, description, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ])

  const shipments = (rawShipments ?? []) as Shipment[]
  const activeShipments  = shipments.filter((s) => s.status !== "delivered" && s.status !== "on_hold")
  const deliveredCount   = shipments.filter((s) => s.status === "delivered").length
  const companyName = shipments[0]?.customers?.[0]?.company_name ?? "Your Company"

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div
        className="animate-gradient relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0c1220, #0f172a, #1e1b4b, #150d2e, #0f172a)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Blue glow — top-left */}
        <div
          className="absolute -top-16 -left-16 pointer-events-none blur-3xl"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Purple glow — bottom-right */}
        <div
          className="absolute -bottom-20 -right-10 pointer-events-none blur-3xl"
          style={{
            width: 380,
            height: 380,
            background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)",
          }}
        />
        {/* Indigo glow — center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none blur-3xl"
          style={{
            width: 500,
            height: 260,
            background: "radial-gradient(ellipse, rgba(99,102,241,0.13) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Welcome */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#6366f1,#8b5cf6)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.5)",
                }}
              >
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                MCGlobe Client Portal
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Welcome back,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {companyName}
              </span>
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Your shipments are being managed by MCGlobe
            </p>
          </div>

          {/* Stat cards */}
          <div className="flex items-center gap-3 shrink-0">
            <StatCard value={activeShipments.length} label="Active Shipments" />
            <StatCard value={pendingQuotes ?? 0}      label="Pending Quotes" />
            <StatCard value={deliveredCount}           label="Delivered" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="px-8 py-8 max-w-7xl mx-auto space-y-10">

        {/* ── ACTIVE SHIPMENTS ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <span
              className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"
              style={{ boxShadow: "0 0 8px rgba(96,165,250,0.8)" }}
            />
            <h2 className="text-lg font-semibold text-white">Active Shipments</h2>
            <span
              className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(59,130,246,0.15)",
                color: "#93c5fd",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              {activeShipments.length}
            </span>
          </div>

          {activeShipments.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
              <Truck className="w-10 h-10 mb-4" style={{ color: "rgba(255,255,255,0.2)" }} />
              <p className="text-white font-medium">No active shipments</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                Your shipments will appear here once created.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeShipments.map((s) => (
                <GlassCard
                  key={s.id}
                  className="p-5"
                  style={{
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono font-bold text-sm tracking-wider"
                          style={{ color: "#93c5fd" }}
                        >
                          {s.shipment_id}
                        </span>
                        {s.service_type && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(99,102,241,0.2)",
                              color: "#a5b4fc",
                              border: "1px solid rgba(99,102,241,0.3)",
                            }}
                          >
                            {SERVICE_LABELS[s.service_type] ?? s.service_type.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {/* Route */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <MapPin className="w-3 h-3 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                          {s.origin ?? "—"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.25)" }} />
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                          {s.destination ?? "—"}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>

                  {/* Progress bar */}
                  <ShipmentProgress status={s.status} />

                  {/* Dates */}
                  <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>ETD</p>
                      <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{fmt(s.etd)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>ETA</p>
                      <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{fmt(s.eta)}</p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Created</p>
                      <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{fmt(s.created_at)}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* ── QUICK ACTIONS ────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-5">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">

            {/* Request a Quote */}
            <GlassCard
              className="glass-hover p-6 flex flex-col gap-4"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
                }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#60a5fa" }} />
              </div>
              <div>
                <p className="text-white font-semibold">Request a Quote</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Get a shipping quote for your next shipment
                </p>
              </div>
              <Link
                href="/client/quotes/new"
                className="btn-quote inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white active:scale-95"
                style={{ boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}
              >
                Get Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>

            {/* Upload Documents */}
            <GlassCard className="glass-hover p-6 flex flex-col gap-4" style={{ position: "relative", overflow: "hidden" }}>
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
              >
                <Upload className="w-5 h-5" style={{ color: "#a5b4fc" }} />
              </div>
              <div>
                <p className="text-white font-semibold">Upload Documents</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Submit invoices, packing lists, and permits
                </p>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                }}
              >
                Upload Files
                <Upload className="w-4 h-4" />
              </button>
            </GlassCard>

            {/* Contact Support */}
            <GlassCard className="glass-hover p-6 flex flex-col gap-4" style={{ position: "relative", overflow: "hidden" }}>
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
              >
                <MessageSquare className="w-5 h-5" style={{ color: "#c4b5fd" }} />
              </div>
              <div>
                <p className="text-white font-semibold">Contact Support</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Reach your dedicated MCGlobe coordinator
                </p>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#c4b5fd",
                }}
              >
                Send Message
                <MessageSquare className="w-4 h-4" />
              </button>
            </GlassCard>
          </div>
        </section>

        {/* ── RECENT ACTIVITY ──────────────────────────────────────── */}
        <section className="pb-10">
          <h2 className="text-lg font-semibold text-white mb-5">Recent Activity</h2>
          <GlassCard className="divide-y" style={{ "--tw-divide-opacity": 1, borderColor: "rgba(255,255,255,0.06)" } as React.CSSProperties}>
            {activityLog && activityLog.length > 0 ? (
              activityLog.map((item, i) => (
                <div key={item.id} className="flex items-start gap-4 px-6 py-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                  >
                    <Activity className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{item.description}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {item.entity_type} · {fmt(item.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              /* Fallback: show recent shipments as timeline items */
              shipments.length > 0 ? (
                shipments.slice(0, 5).map((s) => {
                  const cfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.booked
                  return (
                    <div key={s.id} className="flex items-start gap-4 px-6 py-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
                      >
                        <Package className="w-3.5 h-3.5" style={{ color: "#a5b4fc" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium font-mono">{s.shipment_id}</span>
                          <StatusBadge status={s.status} />
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {s.origin ?? "—"} → {s.destination ?? "—"} · Created {fmt(s.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-8 h-8 mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No activity yet</p>
                </div>
              )
            )}
          </GlassCard>
        </section>
      </div>
    </>
  )
}
