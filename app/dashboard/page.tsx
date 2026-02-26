import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, FileText, DollarSign, Clock, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // Parallelize data fetching
  const [
    { data: todayJobs },
    { count: customerCount },
    { data: unpaidInvoices },
    { data: monthlyRevenueData },
    { data: upcomingJobs },
    { data: recentInvoices }
  ] = await Promise.all([
    supabase
      .from('appointments')
      .select('*')
      .gte('scheduled_time', today.toISOString())
      .lt('scheduled_time', tomorrow.toISOString())
      .eq('user_id', user.id),
    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('invoices')
      .select('*')
      .in('status', ['Pending', 'Overdue'])
      .eq('user_id', user.id),
    supabase
      .from('invoices')
      .select('amount')
      .eq('status', 'Paid')
      .gte('created_at', firstDayOfMonth.toISOString())
      .eq('user_id', user.id),
    supabase
      .from('appointments')
      .select(`
        *,
        customers (
          name,
          address
        )
      `)
      .gte('scheduled_time', new Date().toISOString())
      .eq('user_id', user.id)
      .order('scheduled_time', { ascending: true })
      .limit(5),
    supabase
      .from('invoices')
      .select(`
        *,
        customers (name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3)
  ])

  const completedToday = todayJobs?.filter(j => j.status === 'Completed').length || 0
  const remainingToday = (todayJobs?.length || 0) - completedToday
  const overdueCount = unpaidInvoices?.filter(i => i.status === 'Overdue').length || 0
  const monthlyRevenue = monthlyRevenueData?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-600 mt-1">Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
          {new Date().toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Jobs</CardTitle>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{todayJobs?.length || 0}</div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">{completedToday}</span> completed, {remainingToday} remaining
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Customers</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{customerCount || 0}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              Growing business
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Unpaid Invoices</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{unpaidInvoices?.length || 0}</div>
            <p className="text-xs font-medium text-amber-600 mt-1">
              <span className="font-bold">{overdueCount}</span> overdue payments
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue (MTD)</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">${monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              On track for growth
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900">Upcoming Schedule</CardTitle>
              <Link href="/dashboard/schedule" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                View Full Calendar
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingJobs && upcomingJobs.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {upcomingJobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 min-w-[80px]">
                        <span className="text-xs font-black text-indigo-600">
                          {new Date(job.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {new Date(job.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.customers?.name || 'Unknown Customer'}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {job.duration}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            <span className="max-w-[150px] truncate">{job.customers?.address || 'No address'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      job.status === 'In Progress' ? 'bg-blue-500 text-white' : 
                      job.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900">No upcoming jobs</h3>
                <p className="text-slate-500 text-sm mt-1">Your schedule is clear for now.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentInvoices && recentInvoices.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="p-4 flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Invoice <span className="font-bold">{inv.invoice_number}</span> {inv.status === 'Paid' ? 'paid' : 'issued'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {inv.customers?.name} • ${Number(inv.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900">No recent activity</h3>
                <p className="text-slate-500 text-sm mt-1">Activity will appear here as you work.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
