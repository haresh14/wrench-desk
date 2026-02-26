'use client'

import { useState, useMemo } from 'react'
import { Plus, Download, FileText, Filter, MoreHorizontal, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoiceDialog } from './invoice-dialog'
import { deleteInvoice } from '@/app/dashboard/invoices/actions'
import { motion, AnimatePresence } from 'motion/react'

interface Customer {
  id: string
  name: string
}

interface Invoice {
  id: string
  customer_id: string
  amount: number
  status: string
  due_date: string | null
  invoice_number: string
  customers: Customer | null
}

interface InvoicesViewProps {
  initialInvoices: Invoice[]
  customers: Customer[]
}

export function InvoicesView({ initialInvoices, customers }: InvoicesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const filteredInvoices = useMemo(() => {
    if (statusFilter === 'All') return initialInvoices
    return initialInvoices.filter(inv => inv.status === statusFilter)
  }, [initialInvoices, statusFilter])

  const stats = useMemo(() => {
    const outstanding = initialInvoices
      .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + Number(inv.amount), 0)
    
    const paidThisMonth = initialInvoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + Number(inv.amount), 0)

    const overdueCount = initialInvoices.filter(inv => inv.status === 'Overdue').length
    const pendingCount = initialInvoices.filter(inv => inv.status === 'Pending').length

    return { outstanding, paidThisMonth, overdueCount, pendingCount }
  }, [initialInvoices])

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDialogOpen(true)
    setActiveMenu(null)
  }

  const handleDelete = async () => {
    if (!invoiceToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteInvoice(invoiceToDelete)
      if (result?.error) {
        alert(`Error: ${result.error}`)
      } else {
        setInvoiceToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('An unexpected error occurred.')
    } finally {
      setIsDeleting(false)
      setActiveMenu(null)
    }
  }

  const handleExport = () => {
    if (filteredInvoices.length === 0) {
      alert('No invoices to export.')
      return
    }

    const headers = ['Invoice Number', 'Customer', 'Due Date', 'Amount', 'Status']
    const rows = filteredInvoices.map(inv => [
      inv.invoice_number,
      inv.customers?.name || 'Unknown',
      inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'N/A',
      inv.amount.toString(),
      inv.status
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Create and manage billing for your service jobs.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setSelectedInvoice(null)
              setIsDialogOpen(true)
            }}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Total Outstanding</div>
            <div className="text-2xl font-bold text-slate-900">${stats.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-amber-600 mt-1">{stats.pendingCount} invoices pending</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Paid (Total)</div>
            <div className="text-2xl font-bold text-slate-900">${stats.paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-emerald-600 mt-1">All time paid invoices</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-slate-900">${initialInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + Number(inv.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-red-600 mt-1">{stats.overdueCount} invoices overdue</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      statusFilter === status 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
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
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900">{invoice.invoice_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {invoice.customers?.name || 'Unknown Customer'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'No date'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        ${Number(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                          invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === invoice.id ? null : invoice.id)}
                          className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenu === invoice.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-6 top-12 z-20 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              <button 
                                onClick={() => handleEdit(invoice)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-slate-400" />
                                Edit
                              </button>
                              <button 
                                onClick={() => {
                                  setInvoiceToDelete(invoice.id)
                                  setActiveMenu(null)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 text-left transition-colors border-t border-slate-50"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <InvoiceDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        invoice={selectedInvoice}
        customers={customers}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {invoiceToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Delete Invoice?</h3>
                <p className="text-slate-500 mt-2">
                  This action cannot be undone. This invoice will be permanently removed.
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setInvoiceToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Invoice'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
