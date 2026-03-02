'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Wrench } from 'lucide-react'
import { DashboardNav } from './dashboard-nav'
import { AnimatePresence, motion } from 'motion/react'

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="md:hidden bg-white border-b border-zinc-200/60 p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">WrenchDesk</span>
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div 
              key="sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-50 shadow-2xl flex flex-col z-50 md:hidden border-r border-zinc-200/60"
            >
              <div className="p-4 flex items-center justify-between border-b border-zinc-200/60 bg-white">
                <Link href="/dashboard" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                  <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-zinc-900">WrenchDesk</span>
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto" onClick={() => setIsOpen(false)}>
                <DashboardNav />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
