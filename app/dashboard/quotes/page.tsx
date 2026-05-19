"use client"

import { useState } from "react"
import { FileText, Plus, Search, ChevronDown } from "lucide-react"
import Link from "next/link"

const tabs = [
  { key: "all",       label: "All",       count: 0 },
  { key: "pending",   label: "Pending",   count: 0 },
  { key: "responded", label: "Responded", count: 0 },
] as const

type Tab = (typeof tabs)[number]["key"]

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all")

  return (
    <div className="px-8 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quote Requests</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage client quote requests</p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Quote
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-5">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 ${
              activeTab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            {label}
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                activeTab === key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search quotes..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer">
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="quote_sent">Quote Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 p-12 max-w-sm w-full mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700">No quote requests yet</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Quote requests from clients will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
