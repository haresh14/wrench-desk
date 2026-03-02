import Link from 'next/link';
import { Wrench, Calendar, Users, CreditCard, ArrowRight, CheckCircle2, Zap, Shield, Smartphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    // Supabase not configured yet, ignore
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-950 selection:bg-indigo-500/30">
      {/* Navigation */}
      <header className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">WrenchDesk</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#solutions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Solutions</Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="text-sm font-medium bg-white text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>WrenchDesk 2.0 is now live</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
              The operating system for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">modern field service</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Dispatch, scheduling, invoicing, and customer management all in one place. Built for HVAC, plumbing, electrical, and more.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-0.5">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white border border-zinc-800 px-8 py-4 rounded-xl font-medium text-lg hover:bg-zinc-800 transition-all hover:-translate-y-0.5">
                Book a Demo
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500 font-medium flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Image (Simulated) */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-32 z-20">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-950 aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
              <div className="text-center space-y-4">
                <Wrench className="w-16 h-16 text-indigo-500/50 mx-auto" />
                <p className="text-zinc-500 font-medium">Interactive Dashboard Preview</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-zinc-50 text-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold tracking-tight">Everything you need to run your business</h2>
              <p className="mt-4 text-xl text-zinc-600">Stop juggling multiple apps. WrenchDesk brings your entire operation into one unified platform.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Calendar, title: "Smart Scheduling", desc: "Drag-and-drop dispatching, real-time technician tracking, and automated customer notifications.", color: "bg-blue-100 text-blue-600" },
                { icon: CreditCard, title: "Invoicing & Payments", desc: "Generate professional estimates, send invoices instantly, and get paid faster with integrated card processing.", color: "bg-emerald-100 text-emerald-600" },
                { icon: Users, title: "Customer Management", desc: "Complete service history, equipment tracking, and communication logs for every customer.", color: "bg-purple-100 text-purple-600" },
                { icon: Smartphone, title: "Mobile App for Techs", desc: "Technicians get everything they need in the field: job details, directions, and signature capture.", color: "bg-orange-100 text-orange-600" },
                { icon: Shield, title: "Service Agreements", desc: "Manage recurring maintenance contracts, track profitability, and automate renewal reminders.", color: "bg-indigo-100 text-indigo-600" },
                { icon: Zap, title: "Automated Workflows", desc: "Save hours of manual work with custom triggers for follow-ups, review requests, and more.", color: "bg-rose-100 text-rose-600" }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 mb-6 inline-flex group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">WrenchDesk</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              The modern operating system for field service businesses. Built for speed, reliability, and growth.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} WrenchDesk. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
