import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react'

export default async function SchedulePage() {
  const supabase = await createClient()

  const mockJobs = [
    { id: 1, customer: 'John Smith', type: 'HVAC Repair', time: '09:00 AM', duration: '2h', address: '123 Maple St', tech: 'Mike D.', status: 'In Progress' },
    { id: 2, customer: 'Sarah Johnson', type: 'Plumbing Install', time: '11:30 AM', duration: '3h', address: '456 Oak Ave', tech: 'Steve R.', status: 'Scheduled' },
    { id: 3, customer: 'Robert Brown', type: 'Electrical Inspection', time: '02:00 PM', duration: '1.5h', address: '789 Pine Rd', tech: 'Mike D.', status: 'Scheduled' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-600 mt-1">Dispatch and manage your field service appointments.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar (Simplified) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">February 2026</span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: 28 }).map((_, i) => (
                  <button 
                    key={i} 
                    className={`h-8 w-8 flex items-center justify-center rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                      i + 1 === 25 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 border-b border-slate-100">
              <CardTitle className="text-sm">Technicians</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {['Mike D.', 'Steve R.', 'Alex P.'].map((tech) => (
                <div key={tech} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">{tech}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-900">Today, Feb 25</h2>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-900 rounded-md shadow-sm">Day</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">Week</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">Month</button>
            </div>
          </div>

          <div className="space-y-3">
            {mockJobs.map((job) => (
              <Card key={job.id} className="hover:border-indigo-200 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 min-w-[80px]">
                        <span className="text-xs font-bold text-indigo-600">{job.time}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{job.duration}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{job.customer}</h3>
                        <p className="text-sm text-slate-600">{job.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.address}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {job.tech}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
