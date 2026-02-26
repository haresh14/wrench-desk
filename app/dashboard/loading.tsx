import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-bold text-slate-900">Loading your dashboard...</h3>
          <p className="text-sm text-slate-500 max-w-[200px]">We&apos;re fetching your latest business data.</p>
        </div>
      </div>
    </div>
  )
}
