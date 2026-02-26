import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Building, Bell, Shield, CreditCard, ChevronRight } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const sections = [
    {
      title: 'Profile',
      description: 'Manage your personal information and account security.',
      icon: User,
      items: [
        { label: 'Personal Information', value: user?.email },
        { label: 'Password', value: '••••••••' },
        { label: 'Two-Factor Authentication', value: 'Off' },
      ]
    },
    {
      title: 'Company',
      description: 'Configure your business details and service settings.',
      icon: Building,
      items: [
        { label: 'Company Name', value: 'Acme Plumbing' },
        { label: 'Business Address', value: '123 Maple St, Springfield' },
        { label: 'Service Areas', value: 'Springfield, Riverside' },
      ]
    },
    {
      title: 'Billing',
      description: 'Manage your subscription and payment methods.',
      icon: CreditCard,
      items: [
        { label: 'Current Plan', value: 'Pro Plan' },
        { label: 'Next Invoice', value: 'March 1, 2026' },
        { label: 'Payment Method', value: 'Visa ending in 4242' },
      ]
    }
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and business preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <section.icon className="w-5 h-5" />
                </div>
                <CardTitle>{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {section.items.map((item) => (
                  <button 
                    key={item.label}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{item.value}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
