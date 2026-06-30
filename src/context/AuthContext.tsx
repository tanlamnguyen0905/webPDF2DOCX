'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: number
  fullName: string
  email: string
  avatarUrl: string | null
  role: 'USER' | 'ADMIN' | 'SUPPORT' | 'DEVELOPER'
  coinBalance: number
  subscriptionTier: 'FREE' | 'PREMIUM' | 'VIP'
  status: 'ACTIVE' | 'LOCKED' | 'BANNED'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | null>(null)

function loadAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null, refreshToken: null, isLoggedIn: false, isLoading: true }
  }
  try {
    const tokenData = localStorage.getItem('auth')
    const userData = localStorage.getItem('user')
    if (!tokenData || !userData) {
      return { user: null, accessToken: null, refreshToken: null, isLoggedIn: false, isLoading: false }
    }
    const tokens = JSON.parse(tokenData)
    const user = JSON.parse(userData)
    return {
      user,
      accessToken: tokens.accessToken || null,
      refreshToken: tokens.refreshToken || null,
      isLoggedIn: true,
      isLoading: false,
    }
  } catch {
    return { user: null, accessToken: null, refreshToken: null, isLoggedIn: false, isLoading: false }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = React.useState<AuthState>(loadAuth)

  const setAuth = (user: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem('auth', JSON.stringify({ accessToken, refreshToken }))
    localStorage.setItem('user', JSON.stringify(user))
    setState({ user, accessToken, refreshToken, isLoggedIn: true, isLoading: false })
  }

  const clearAuth = React.useCallback(() => {
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    setState({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false, isLoading: false })
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!json.success) {
      const code = json.error?.code
      if (code === 'ACCOUNT_LOCKED') {
        throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.')
      }
      throw new Error(json.error?.message || 'Sai email hoặc mật khẩu')
    }
    const { user, accessToken, refreshToken } = json.data
    setAuth(user, accessToken, refreshToken)
  }

  const register = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, confirmPassword }),
    })
    const json = await res.json()
    if (!json.success) {
      const details = json.error?.details
      if (details && details.length > 0) {
        throw new Error(details[0].message)
      }
      throw new Error(json.error?.message || 'Đã có lỗi xảy ra')
    }
  }

  const logout = React.useCallback(() => {
    const refreshToken = state.refreshToken
    clearAuth()
    router.push('/')
    // Fire-and-forget logout API call
    if (refreshToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {})
    }
  }, [state.refreshToken, clearAuth, router])

  const refreshUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      )
      const json = await res.json()
      if (json.success && json.data) {
        localStorage.setItem('user', JSON.stringify(json.data))
        setState((prev) => ({ ...prev, user: json.data }))
      }
    } catch {
      // Silently fail
    }
  }

  // Listen for logout event from apiClient
  React.useEffect(() => {
    const handleLogout = () => clearAuth()
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [clearAuth])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useUser(): User | null {
  const ctx = React.useContext(AuthContext)
  return ctx?.user ?? null
}
