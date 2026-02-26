'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, MoreVertical, Edit2, Trash2, Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
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
  
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('day')
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [direction, setDirection] = useState(0)

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

  // Calendar logic
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    
    const days = []
    // Padding for first day of week
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }, [currentMonth])

  const nextMonth = () => {
    setDirection(1)
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setDirection(-1)
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setDirection(today > currentMonth ? 1 : -1)
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(today)
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }

  const isSameWeek = (d1: Date, d2: Date) => {
    const startOfWeek = (date: Date) => {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      const day = d.getDay()
      const diff = d.getDate() - day
      d.setDate(diff)
      return d.getTime()
    }
    return startOfWeek(d1) === startOfWeek(d2)
  }

  const isSameMonth = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth()
  }

  const filteredAppointments = useMemo(() => {
    return initialAppointments.filter(app => {
      const appDate = new Date(app.scheduled_time)
      if (viewType === 'day') return isSameDay(appDate, selectedDate)
      if (viewType === 'week') return isSameWeek(appDate, selectedDate)
      if (viewType === 'month') return isSameMonth(appDate, selectedDate)
      return false
    })
  }, [initialAppointments, selectedDate, viewType])

  const viewHeading = useMemo(() => {
    if (viewType === 'day') {
      return selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    if (viewType === 'week') {
      const start = new Date(selectedDate)
      start.setDate(selectedDate.getDate() - selectedDate.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })
  }, [selectedDate, viewType])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0
    })
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
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={prevMonth}
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-md transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button 
                      onClick={nextMonth}
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-md transition-all"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={goToToday}
                  className="flex items-center justify-center gap-2 w-full py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                >
                  <RotateCcw className="w-3 h-3" />
                  Today
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 relative overflow-hidden min-h-[260px]">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-3">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentMonth.toISOString()}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="grid grid-cols-7 gap-1 text-center"
                >
                  {daysInMonth.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} className="h-8 w-8" />
                    
                    const isSelected = isSameDay(date, selectedDate)
                    const isToday = isSameDay(date, new Date())
                    const hasAppointments = initialAppointments.some(app => isSameDay(new Date(app.scheduled_time), date))

                    return (
                      <button 
                        key={date.toISOString()} 
                        onClick={() => setSelectedDate(date)}
                        className={`h-8 w-8 flex flex-col items-center justify-center rounded-lg text-xs transition-all relative group ${
                          isSelected 
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200' 
                            : isToday
                              ? 'bg-indigo-50 text-indigo-600 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {date.getDate()}
                        {hasAppointments && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900">Technicians</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {Array.from(new Set(initialAppointments.map(a => a.technician_name))).map((tech) => (
                <div key={tech} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-sm font-medium text-slate-700">{tech}</span>
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
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">
                {viewHeading}
              </h2>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewType('day')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewType === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Day
              </button>
              <button 
                onClick={() => setViewType('week')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewType === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setViewType('month')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewType === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((job) => (
                <Card key={job.id} className="hover:border-indigo-300 hover:shadow-md transition-all group relative border-slate-200">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 z-10 ${
                    job.status === 'In Progress' ? 'bg-blue-500' : 
                    job.status === 'Completed' ? 'bg-emerald-500' :
                    'bg-slate-300'
                  }`} />
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 min-w-[110px] shadow-inner">
                          <span className="text-sm font-black text-indigo-600">{formatTime(job.scheduled_time)}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{job.duration}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{job.customers?.name || 'Unknown Customer'}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-slate-500">{job.job_type}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{job.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto">
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex-1 sm:flex-none">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="max-w-[150px] sm:max-w-[180px] truncate font-medium">{job.customers?.address || 'No address'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex-1 sm:flex-none">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-medium truncate">{job.technician_name}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm whitespace-nowrap ${
                            job.status === 'In Progress' ? 'bg-blue-500 text-white' : 
                            job.status === 'Completed' ? 'bg-emerald-500 text-white' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {job.status}
                          </span>
                          
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMenu(activeMenu === job.id ? null : job.id)
                              }}
                              className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {activeMenu === job.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-20" 
                                  onClick={() => setActiveMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-2 z-30 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-4 ring-slate-50">
                                  <button 
                                    onClick={() => handleEdit(job)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 text-left transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4 text-slate-400" />
                                    Edit Details
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(job.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left transition-colors border-t border-slate-50"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                    Delete Job
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900">No appointments for this {viewType}</h3>
                <p className="text-slate-500 text-sm mt-1">Enjoy the quiet time or schedule a new job.</p>
                <button 
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                >
                  Schedule an appointment
                </button>
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
