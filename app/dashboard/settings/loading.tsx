import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"

export default function SettingsLoading() {
  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

      <div className="space-y-6">
        {/* Profile Section Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-3 w-48" />
            </div>
          </CardContent>
        </Card>

        {/* Company Section Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-xl" />
                {i === 2 && <Skeleton className="h-3 w-48" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Billing Section Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full flex items-center justify-between px-6 py-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="w-4 h-4 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button Skeleton */}
        <div className="flex items-center justify-end gap-4">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
