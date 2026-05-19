"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Customer = { id: string; company_name: string }

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"

const selectClass =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key)
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null
}

function num(fd: FormData, key: string): number | null {
  const v = fd.get(key)
  if (typeof v !== "string" || v.trim() === "") return null
  const n = parseFloat(v)
  return isNaN(n) ? null : n
}

function int(fd: FormData, key: string): number | null {
  const v = fd.get(key)
  if (typeof v !== "string" || v.trim() === "") return null
  const n = parseInt(v, 10)
  return isNaN(n) ? null : n
}

export default function NewShipmentForm({ customers }: { customers: Customer[] }) {
  const router = useRouter()
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fd = new FormData(e.currentTarget)

    const payload = {
      shipment_id:       str(fd, "shipment_id"),
      customer_id:       str(fd, "customer_id"),
      service_type:      str(fd, "service_type"),
      status:            str(fd, "status") ?? "booked",
      reference:         str(fd, "reference"),
      origin:            str(fd, "origin"),
      destination:       str(fd, "destination"),
      transport_mode:    str(fd, "transport_mode"),
      etd:               str(fd, "etd"),
      eta:               str(fd, "eta"),
      cargo_description: str(fd, "cargo_description"),
      cargo_value:       num(fd, "cargo_value"),
      chargeable_weight: num(fd, "chargeable_weight"),
      pieces:            int(fd, "pieces"),
      hs_code:           str(fd, "hs_code"),
      incoterms:         str(fd, "incoterms"),
      internal_notes:    str(fd, "internal_notes"),
    }

    console.log("[NewShipment] payload →", payload)

    const supabase = createClient()
    const { data, error: sbError } = await supabase
      .from("shipments")
      .insert(payload)
      .select("id, shipment_id")
      .single()

    console.log("[NewShipment] response →", { data, error: sbError })

    if (sbError) {
      setError(sbError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard/shipments")
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Back + Header */}
      <div className="mb-7">
        <Link
          href="/dashboard/shipments"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shipments
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Create Shipment</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fill in the shipment details below.</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 mb-6 px-4 py-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information */}
        <SectionCard title="Basic Information">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <Label>Shipment ID</Label>
              <input
                name="shipment_id"
                type="text"
                defaultValue="MCG-2026-001"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Auto-generated — edit if needed</p>
            </div>

            <div>
              <Label required>Customer</Label>
              <div className="relative">
                <select name="customer_id" className={selectClass} defaultValue="">
                  <option value="" disabled>Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.company_name}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div>
              <Label required>Service Type</Label>
              <div className="relative">
                <select name="service_type" className={selectClass} defaultValue="">
                  <option value="" disabled>Select service type</option>
                  <option value="ior">IOR — Importer of Record</option>
                  <option value="eor">EOR — Exporter of Record</option>
                  <option value="freight">Standard Freight</option>
                  <option value="itad">ITAD</option>
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <div className="relative">
                <select name="status" className={selectClass} defaultValue="booked">
                  <option value="booked">Booked</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="customs">Customs</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="on_hold">On Hold</option>
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div className="col-span-2">
              <Label>Reference</Label>
              <input
                name="reference"
                type="text"
                placeholder="Customer PO or reference"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* Route Details */}
        <SectionCard title="Route Details">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <Label required>Origin</Label>
              <input name="origin" type="text" placeholder="e.g. Singapore, SG" className={inputClass} />
            </div>
            <div>
              <Label required>Destination</Label>
              <input name="destination" type="text" placeholder="e.g. Jakarta, ID" className={inputClass} />
            </div>
            <div>
              <Label required>Transport Mode</Label>
              <div className="relative">
                <select name="transport_mode" className={selectClass} defaultValue="">
                  <option value="" disabled>Select mode</option>
                  <option value="air">Air</option>
                  <option value="sea">Sea</option>
                  <option value="road">Road</option>
                  <option value="rail">Rail</option>
                </select>
                <ChevronIcon />
              </div>
            </div>
            <div />
            <div>
              <Label>ETD</Label>
              <input name="etd" type="date" className={inputClass} />
            </div>
            <div>
              <Label>ETA</Label>
              <input name="eta" type="date" className={inputClass} />
            </div>
          </div>
        </SectionCard>

        {/* Cargo Details */}
        <SectionCard title="Cargo Details">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div className="col-span-2">
              <Label>Cargo Description</Label>
              <input
                name="cargo_description"
                type="text"
                placeholder="e.g. IT Hardware — Network Switches"
                className={inputClass}
              />
            </div>
            <div>
              <Label>Cargo Value (USD)</Label>
              <input name="cargo_value" type="number" min="0" step="0.01" placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <Label>Chargeable Weight (kg)</Label>
              <input name="chargeable_weight" type="number" min="0" step="0.01" placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <Label>Pieces</Label>
              <input name="pieces" type="number" min="0" step="1" placeholder="0" className={inputClass} />
            </div>
            <div>
              <Label>HS Code</Label>
              <input name="hs_code" type="text" placeholder="e.g. 8471.30 — Laptops" className={inputClass} />
            </div>
            <div className="col-span-2">
              <Label>Incoterms</Label>
              <div className="relative max-w-xs">
                <select name="incoterms" className={selectClass} defaultValue="">
                  <option value="" disabled>Select incoterm</option>
                  <option value="ddp">DDP — Delivered Duty Paid</option>
                  <option value="dap">DAP — Delivered at Place</option>
                  <option value="exw">EXW — Ex Works</option>
                  <option value="fob">FOB — Free on Board</option>
                  <option value="cif">CIF — Cost, Insurance &amp; Freight</option>
                  <option value="fca">FCA — Free Carrier</option>
                  <option value="other">Other</option>
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Documents */}
        <SectionCard title="Documents">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 px-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG — up to 10MB</p>
            </div>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
          </div>
        </SectionCard>

        {/* Internal Notes */}
        <SectionCard title="Internal Notes">
          <div>
            <textarea
              name="internal_notes"
              rows={4}
              placeholder="Add internal notes..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">Visible to admin only</p>
          </div>
        </SectionCard>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
          <Link
            href="/dashboard/shipments"
            className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 text-sm font-semibold transition-all duration-150"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Shipment"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
