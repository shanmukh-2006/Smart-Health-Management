"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clock, Upload, ShieldCheck, ShieldX, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ActivityLogEntry } from "@/lib/types"

const typeConfig: Record<
  string,
  { icon: any; color: string; bg: string }
> = {
  upload: { icon: Upload, color: "text-primary", bg: "bg-primary/10" },
  access: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  request: { icon: Send, color: "text-amber-600", bg: "bg-amber-50" },
  approval: {
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  denial: { icon: ShieldX, color: "text-red-600", bg: "bg-red-50" },
}

export function ActivityLog({ entries = [] }: { entries?: ActivityLogEntry[] }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No recent activity
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

            <div className="flex flex-col gap-6">
              {entries.map((entry) => {
                const config = typeConfig[entry.type] || typeConfig.upload
                const IconComp = config.icon
                return (
                  <div key={entry.id || entry._id} className="relative flex gap-4 pl-0">
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        config.bg
                      )}
                    >
                      <IconComp className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {entry.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.details}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {entry.timestamp}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
