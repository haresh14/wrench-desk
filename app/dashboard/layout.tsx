import { DashboardNav } from '@/components/dashboard-nav'
import { MobileSidebar } from '@/components/mobile-sidebar'
import Link from 'next/link'
import { 
  LogOut,
  Wrench,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-50 border-r border-zinc-200/60 sticky top-0 h-screen">
        <Link href="/dashboard" className="p-6 flex items-center gap-2 border-b border-zinc-200/60 hover:bg-zinc-100/50 transition-colors group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900">WrenchDesk</span>
        </Link>
        
        <DashboardNav />

        <div className="p-4 border-t border-zinc-200/60 bg-zinc-50">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm border border-indigo-200/50">
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{user.email}</p>
              <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        <MobileSidebar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
