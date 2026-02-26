'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentDialog } from './appointment-dialog'
import { deleteAppointment } from '@/app/dashboard/schedule/actions'

interface Customer {
  id: string
  name: string
  address: string | null
}

interface Appointment {
  id: string
  customer_id: string
  scheduled_time: string
  duration: string
  job_type: string
  technician_name: string
  status: string
  customers: Customer | null
}

interface ScheduleViewProps {
  initialAppointments: Appointment[]
  customers: Customer[]
}

export function ScheduleView({ initialAppointments, customers }: ScheduleViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
    setActiveMenu(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id)
      } catch (error) {
        console.error('Error deleting appointment:', error)
        alert('Failed to delete appointment.')
      }
    }
    setActiveMenu(null)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-600 mt-1">Dispatch and manage your field service appointments.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedAppointment(null)
            setIsDialogOpen(true)
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar */}
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
              {Array.from(new Set(initialAppointments.map(a => a.technician_name))).map((tech) => (
                <div key={tech} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">{tech}</span>
                </div>
              ))}
              {initialAppointments.length === 0 && (
                <p className="text-xs text-slate-400 italic">No active technicians</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-900">Upcoming Appointments</h2>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-900 rounded-md shadow-sm">Day</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">Week</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">Month</button>
            </div>
          </div>

          <div className="space-y-3">
            {initialAppointments.length > 0 ? (
              initialAppointments.map((job) => (
                <Card key={job.id} className="hover:border-indigo-200 transition-colors group relative">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 min-w-[100px]">
                          <span className="text-xs font-bold text-indigo-600">{formatTime(job.scheduled_time)}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{job.duration}</span>
                          <span className="text-[10px] text-slate-400 mt-1">{formatDate(job.scheduled_time)}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{job.customers?.name || 'Unknown Customer'}</h3>
                          <p className="text-sm text-slate-600">{job.job_type}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="max-w-[150px] truncate">{job.customers?.address || 'No address'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {job.technician_name}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          job.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {job.status}
                        </span>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenu === job.id && (
                            <div className="absolute right-0 top-8 z-10 w-32 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              <button 
                                onClick={() => handleEdit(job)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(job.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500">
                No appointments scheduled.
              </div>
            )}
          </div>
        </div>
      </div>

      <AppointmentDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        appointment={selectedAppointment}
        customers={customers}
      />
    </>
  )
}
