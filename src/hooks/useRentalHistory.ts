import { useEffect, useState } from 'react';
import { RentalHistory } from '@/types'; // Adjust path if types are in a separate file

export function useRentalHistory(token: string) {
  const [history, setHistory] = useState<RentalHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/rentals/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((data: RentalHistory[]) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch rental history:', err);
        setLoading(false);
      });
  }, [token]);

  return { history, loading };
}