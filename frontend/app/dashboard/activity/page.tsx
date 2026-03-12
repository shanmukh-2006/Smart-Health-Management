"use client"

import { useEffect, useState } from "react"
import { ActivityLog } from "@/components/activity-log"
import { activityService } from "@/lib/services"
import { type ActivityLogEntry } from "@/lib/types"

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await activityService.getAll()
        setEntries(data)
      } catch (error) {
        console.error("Failed to fetch activity:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivity()
  }, [])

  if (isLoading) return <div className="p-8 text-center">Loading activity...</div>

  return <ActivityLog entries={entries} />
}
