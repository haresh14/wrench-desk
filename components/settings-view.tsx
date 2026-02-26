'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Building, CreditCard, ChevronRight, Save, Loader2 } from 'lucide-react'
import { updateSettings } from '@/app/dashboard/settings/actions'

interface Settings {
  company_name: string | null
  business_address: string | null
  service_areas: string | null
}

interface SettingsViewProps {
  userEmail: string | undefined
  initialSettings: Settings | null
}

export function SettingsView({ userEmail, initialSettings }: SettingsViewProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await updateSettings(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Settings updated successfully!' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <User className="w-5 h-5" />
              </div>
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Manage your personal information and account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={userEmail || ''} 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400">Email cannot be changed here.</p>
            </div>
          </CardContent>
        </Card>

        {/* Company Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Building className="w-5 h-5" />
              </div>
              <CardTitle>Company</CardTitle>
            </div>
            <CardDescription>Configure your business details and service settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Company Name</label>
              <input 
                type="text" 
                name="company_name"
                defaultValue={initialSettings?.company_name || ''}
                placeholder="e.g. Acme Plumbing"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Business Address</label>
              <input 
                type="text" 
                name="business_address"
                defaultValue={initialSettings?.business_address || ''}
                placeholder="e.g. 123 Maple St, Springfield"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Service Areas</label>
              <input 
                type="text" 
                name="service_areas"
                defaultValue={initialSettings?.service_areas || ''}
                placeholder="e.g. Springfield, Riverside"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <p className="text-xs text-slate-400">Separate areas with commas.</p>
            </div>
          </CardContent>
        </Card>

        {/* Billing Section (Static for now) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <CardTitle>Billing</CardTitle>
            </div>
            <CardDescription>Manage your subscription and payment methods.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {[
                { label: 'Current Plan', value: 'Pro Plan' },
                { label: 'Next Invoice', value: 'March 1, 2026' },
                { label: 'Payment Method', value: 'Visa ending in 4242' },
              ].map((item) => (
                <div 
                  key={item.label}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.value}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between gap-4">
          {message && (
            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
          <div className="flex-1" />
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
