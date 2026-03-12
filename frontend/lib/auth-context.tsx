"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import {
  type User,
  type UserRole,
} from "@/lib/mock-data"
import { API_URL } from "./api-config"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-login from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("shms_user")
    const storedToken = localStorage.getItem("shms_token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setIsLoading(false)
          return { success: false, message: data.message || "Login failed" }
        }
        
        // Ensure role matches
        if (role && data.role !== role) {
          setIsLoading(false)
          return { success: false, message: `Account not found for role: ${role}` }
        }

        const userData = { id: data.id, name: data.name, email: data.email, role: data.role }
        setUser(userData)
        setToken(data.token)
        localStorage.setItem("shms_user", JSON.stringify(userData))
        localStorage.setItem("shms_token", data.token)
        setIsLoading(false)
        return { success: true }
      } catch (error: any) {
        console.error("Login error:", error)
        setIsLoading(false)
        return { success: false, message: "Server connection failed" }
      }
    },
    []
  )

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        })

        const data = await res.json()

        if (!res.ok) {
          setIsLoading(false)
          return { success: false, message: data.message || "Registration failed" }
        }

        const userData = { id: data.id, name: data.name, email: data.email, role: data.role }
        setUser(userData)
        setToken(data.token)
        localStorage.setItem("shms_user", JSON.stringify(userData))
        localStorage.setItem("shms_token", data.token)
        setIsLoading(false)
        return { success: true }
      } catch (error) {
        console.error("Registration error:", error)
        setIsLoading(false)
        return { success: false, message: "Server connection failed" }
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("shms_user")
    localStorage.removeItem("shms_token")
  }, [])

  return (
    <AuthContext value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
