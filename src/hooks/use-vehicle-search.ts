import { useEffect, useState } from 'react'
import axios from 'axios'

interface SearchFilters {
  type?: string;
  brand?: string;
  minRating?: number;
  maxPrice?: number;
}

export const useVehicleSearch = (filters: SearchFilters, page = 0, size = 10) => {
  const [data, setData] = useState({ vehicles: [], totalPages: 0, totalItems: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:8080/vehicles/search', {
          params: {
            ...filters,
            page,
            size,
          },
        })
        setData({
          vehicles: response.data.content,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalElements,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [filters, page, size])

  return { ...data, loading, error }
}
