"use client"

import { type RequestStatus } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  denied: {
    label: "Denied",
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status]
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", config.className)}
    >
      {config.label}
    </Badge>
  )
}
