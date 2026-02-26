import { createClient } from '@/lib/supabase/server'
import { SettingsView } from '@/components/settings-view'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user settings
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and business preferences.</p>
      </div>

      <SettingsView 
        userEmail={user?.email} 
        initialSettings={settings} 
      />
    </div>
  )
}
