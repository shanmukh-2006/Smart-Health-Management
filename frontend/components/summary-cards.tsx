"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, Clock, CheckCircle } from "lucide-react"

interface SummaryCardsProps {
  totalDocuments: number
  pendingRequests: number
  approvedRequests: number
}

export function SummaryCards({
  totalDocuments,
  pendingRequests,
  approvedRequests,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Documents",
      value: totalDocuments,
      icon: FileText,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Approved Requests",
      value: approvedRequests,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}
            >
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
