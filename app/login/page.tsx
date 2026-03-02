import Link from 'next/link'
import { Wrench, Ghost, ArrowRight } from 'lucide-react'
import { login, signInAnonymously } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const isAnonymousEnabled = process.env.NEXT_PUBLIC_ENABLE_ANONYMOUS_SIGNIN === 'true'
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex font-sans bg-zinc-50">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link href="/" className="flex items-center gap-2 group mb-10 inline-flex">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900">WrenchDesk</span>
          </Link>

          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Start your 14-day free trial
            </Link>
          </p>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </div>
          )}

          <div className="mt-8">
            <form action={login} className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
              >
                Sign in
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {isAnonymousEnabled && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-zinc-50 px-4 text-zinc-500">Or continue with</span>
                  </div>
                </div>

                <form action={signInAnonymously} className="mt-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm"
                  >
                    <Ghost className="w-4 h-4 text-zinc-400" />
                    Anonymous Sign In
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Image/Graphic */}
      <div className="hidden lg:block relative w-0 flex-1 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-zinc-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 lg:px-24 z-10">
          <blockquote className="space-y-6">
            <p className="text-3xl font-medium text-white leading-snug">
              &quot;WrenchDesk has completely transformed how we run our HVAC business. Dispatching is a breeze, and we get paid twice as fast.&quot;
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <span className="text-indigo-200 font-bold">JD</span>
              </div>
              <div>
                <div className="text-white font-medium">John Doe</div>
                <div className="text-indigo-300 text-sm">Owner, Acme HVAC</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
