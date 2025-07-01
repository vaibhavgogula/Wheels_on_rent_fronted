// hooks/useVehicle.ts
import { useEffect, useState } from 'react';

export interface Review {
  username: string;
  comment: string;
  date: string;
}

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  description: string;
  fuelType: string;
  seatCount: number;
  gearType: string;
  rentPerHour: number;
  available: boolean;
  averageRating: number;
  totalReviews: number;
  imagePath: string;
  type: string;
  reviews: Review[];
}

export function useVehicle(id: number | string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:8080/vehicles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch vehicle');
        const data = await response.json();
        setVehicle(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  return { vehicle, loading, error };
}
