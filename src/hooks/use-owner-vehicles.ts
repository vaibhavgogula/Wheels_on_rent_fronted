import { useEffect, useState } from 'react';
import { Vehicle } from '@/types';

export default function useOwnerVehicles(token: string | null) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchVehicles = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:8080/owner/my-vehicles', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const data: Vehicle[] = await res.json();
            setVehicles(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
        };

        fetchVehicles();
    }, [token]);

    return { vehicles, loading, error };
}
