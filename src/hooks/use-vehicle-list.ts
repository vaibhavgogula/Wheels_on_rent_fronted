// hooks/useVehicleList.js
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8080/vehicles/list'

export const useVehicleList = (page = 0, size = 10) => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      try {
        const response = await axios.get(API_URL, {
          params: { page, size },
        })
        setVehicles(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalItems(response.data.totalElements)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [page, size])

  return {
    vehicles,
    loading,
    error,
    totalPages,
    totalItems,
  }
}
