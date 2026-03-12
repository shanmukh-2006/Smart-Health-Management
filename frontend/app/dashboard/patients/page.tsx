"use client"
import { useState, useEffect } from "react"
import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users } from "lucide-react"
import { requestService } from "@/lib/services"
import { Spinner } from "@/components/ui/spinner"

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await requestService.getAll()
        setPatients(data)
      } catch (error) {
        console.error("Failed to fetch patients:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatients()
  }, [])

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center text-muted-foreground font-medium animate-pulse">
      <Spinner className="mr-2" /> Loading patient data...
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          My Patients
        </CardTitle>
        <CardDescription>
          All patients you have requested access to
        </CardDescription>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No patient requests yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id || patient._id}>
                  <TableCell className="font-medium">
                    {patient.patientName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {patient.patientEmail}
                  </TableCell>
                  <TableCell>{patient.requestDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={patient.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
