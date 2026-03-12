export type UserRole = "patient" | "provider"

export interface User {
  id: string
  _id?: string
  name: string
  email: string
  role: UserRole
}

export interface Document {
  id: string
  _id?: string
  fileName: string
  uploadDate: string
  size: string
  type: string
  url?: string
}

export type RequestStatus = "pending" | "approved" | "denied"

export interface AccessRequest {
  id: string
  _id?: string
  providerName: string
  providerEmail: string
  patientName: string
  patientEmail: string
  status: RequestStatus
  requestDate: string
}

export interface ActivityLogEntry {
  id: string
  _id?: string
  action: string
  details: string
  timestamp: string
  type: "upload" | "access" | "request" | "approval" | "denial"
}
