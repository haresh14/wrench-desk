'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all group",
                isActive 
                  ? "bg-white text-indigo-600 shadow-sm border border-zinc-200/60" 
                  : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110", 
                isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600"
              )} />
              {item.label}
            </Link>
          )
        })}
    </nav>
  )
}
