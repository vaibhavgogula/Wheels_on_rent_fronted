"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import useOwnerVehicles from '@/hooks/use-owner-vehicles';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyVehiclesPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  const { vehicles, loading, error } = useOwnerVehicles(token);
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'INACTIVE':
        return 'secondary';
      case 'MAINTENANCE':
        return 'destructive';
      case 'UNAVAILABLE':
        return 'outline';
      case 'CHECKING':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-800';
      case 'UNAVAILABLE':
        return 'bg-orange-100 text-orange-800';
      case 'CHECKING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return '';
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : error ? (
    <div className="container mx-auto px-4 py-12">
      <p className="text-red-500">{error}</p>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Vehicles</CardTitle>
          <CardDescription>Manage your listed vehicles and see their approval status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead>Vehicle Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-4">
                      <Image src={`http://localhost:8080${vehicle.imagePath}`} alt={vehicle.name} width={40} height={40} className="rounded-md" data-ai-hint="car" />
                      <Link href={`/owner/vehicles/${vehicle.id}`}>{vehicle.name}</Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      vehicle.approvalStatus === 'APPROVED' ? 'default' :
                      vehicle.approvalStatus === 'PENDING' ? 'secondary' :
                      'destructive'
                    } className={vehicle.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}>
                      {vehicle.approvalStatus.charAt(0).toUpperCase() + vehicle.approvalStatus.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(vehicle.status)}
                      className={getStatusBadgeColor(vehicle.status)}
                    >
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
