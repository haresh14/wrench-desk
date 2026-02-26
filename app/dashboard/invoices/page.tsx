import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Download, FileText, Filter, MoreHorizontal } from 'lucide-react'

export default async function InvoicesPage() {
  const supabase = await createClient()

  const mockInvoices = [
    { id: 'INV-001', customer: 'John Smith', date: 'Feb 24, 2026', amount: '$450.00', status: 'Paid' },
    { id: 'INV-002', customer: 'Sarah Johnson', date: 'Feb 25, 2026', amount: '$1,200.00', status: 'Pending' },
    { id: 'INV-003', customer: 'Robert Brown', date: 'Feb 22, 2026', amount: '$325.00', status: 'Overdue' },
    { id: 'INV-004', customer: 'Emily Davis', date: 'Feb 20, 2026', amount: '$890.00', status: 'Paid' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Create and manage billing for your service jobs.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Total Outstanding</div>
            <div className="text-2xl font-bold text-slate-900">$2,865.00</div>
            <div className="text-xs text-amber-600 mt-1">12 invoices pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Paid (This Month)</div>
            <div className="text-2xl font-bold text-slate-900">$14,250.00</div>
            <div className="text-xs text-emerald-600 mt-1">+18% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-slate-900">$325.00</div>
            <div className="text-xs text-red-600 mt-1">2 invoices overdue</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-900">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                        invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
