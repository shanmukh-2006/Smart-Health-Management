import { User, Document, AccessRequest, ActivityLogEntry } from "./types"

export const mockPatientUser: User = {
  id: "p1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  role: "patient",
}

export const mockProviderUser: User = {
  id: "pr1",
  name: "Dr. Michael Chen",
  email: "dr.chen@hospital.com",
  role: "provider",
}

export const mockDocuments: Document[] = []
export const mockAccessRequests: AccessRequest[] = []
export const mockActivityLog: ActivityLogEntry[] = []
export const mockProviderPatients: any[] = []
export const mockApprovedDocuments: Document[] = []
