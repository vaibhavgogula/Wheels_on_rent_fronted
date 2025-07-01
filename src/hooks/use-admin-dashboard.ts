'use client'

import { Vehicle } from '@/types'
import { useEffect, useState } from 'react'

interface DashboardData {
  totalUsers: number
  totalOwners: number
  totalBookings: number
  totalEarnings: number
  pendingApprovals: Vehicle[]
}

export default function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No token found')
      setLoading(false)
      return
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:8080/admin/dashboard-summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`Error ${res.status}`)

        const json = await res.json()
        setData(json)
      } catch (err: unknown) {
        const error = err as Error
        setError(error.message || 'Failed to fetch dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return { data, loading, error }
}
