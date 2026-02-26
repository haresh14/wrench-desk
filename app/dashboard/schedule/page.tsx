import { createClient } from '@/lib/supabase/server'
import { ScheduleView } from '@/components/schedule-view'

export default async function SchedulePage() {
  const supabase = await createClient()
  
  // Parallelize data fetching
  const [
    { data: appointments, error: appointmentsError },
    { data: customers, error: customersError }
  ] = await Promise.all([
    supabase
      .from('appointments')
      .select(`
        *,
        customers (
          id,
          name,
          address
        )
      `)
      .order('scheduled_time', { ascending: true }),
    supabase
      .from('customers')
      .select('id, name, address')
      .order('name', { ascending: true })
  ])

  if (appointmentsError) console.error('Error fetching appointments:', appointmentsError)
  if (customersError) console.error('Error fetching customers:', customersError)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <ScheduleView 
        initialAppointments={appointments || []} 
        customers={customers || []} 
      />
    </div>
  )
}
