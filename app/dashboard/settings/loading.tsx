import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="md:col-span-2 space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-50">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ))}
                <Skeleton className="h-10 w-32 rounded-lg ml-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
