'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createAppointment, updateAppointment } from '@/app/dashboard/schedule/actions'

interface Customer {
  id: string
  name: string
}

interface Appointment {
  id: string
  customer_id: string
  scheduled_time: string
  duration: string
  job_type: string
  technician_name: string
  status: string
}

interface AppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  appointment?: Appointment | null
  customers: Customer[]
}

export function AppointmentDialog({ isOpen, onClose, appointment, customers }: AppointmentDialogProps) {
  const [isPending, setIsPending] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      let result
      if (appointment) {
        result = await updateAppointment(appointment.id, formData)
      } else {
        result = await createAppointment(formData)
      }

      if (result?.error) {
        alert(`Error: ${result.error}`)
      } else {
        onClose()
      }
    } catch (error: any) {
      console.error('Error saving appointment:', error)
      alert(`Failed to save appointment: ${error.message || 'Unknown error'}`)
    } finally {
      setIsPending(false)
    }
  }

  // Format date for input[type="datetime-local"]
  const defaultDateTime = appointment 
    ? new Date(appointment.scheduled_time).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="customer_id" className="block text-sm font-medium text-slate-700 mb-1">
              Customer
            </label>
            <select
              id="customer_id"
              name="customer_id"
              required
              defaultValue={appointment?.customer_id}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scheduled_time" className="block text-sm font-medium text-slate-700 mb-1">
              Scheduled Time
            </label>
            <input
              id="scheduled_time"
              name="scheduled_time"
              type="datetime-local"
              required
              defaultValue={defaultDateTime}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                required
                defaultValue={appointment?.duration ?? '1 hour'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="e.g. 2 hours"
              />
            </div>
            <div>
              <label htmlFor="job_type" className="block text-sm font-medium text-slate-700 mb-1">
                Job Type
              </label>
              <input
                id="job_type"
                name="job_type"
                type="text"
                required
                defaultValue={appointment?.job_type}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="e.g. HVAC Repair"
              />
            </div>
          </div>

          <div>
            <label htmlFor="technician_name" className="block text-sm font-medium text-slate-700 mb-1">
              Technician
            </label>
            <input
              id="technician_name"
              name="technician_name"
              type="text"
              required
              defaultValue={appointment?.technician_name}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="e.g. Mike D."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={appointment?.status ?? 'Scheduled'}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving...' : appointment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
