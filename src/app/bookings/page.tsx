'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FilePenLine } from 'lucide-react';
import Link from 'next/link';
import { useRentalHistory } from '@/hooks/useRentalHistory';

export default function BookingsPage() {
  const [token, setToken] = useState<string | null>(null);
  const { history, loading } = useRentalHistory(token || '');

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">My Bookings</CardTitle>
            <CardDescription>Please login to view your bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You need to be logged in to view your bookings.</p>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">My Bookings</CardTitle>
            <CardDescription>Loading your booking history...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Bookings</CardTitle>
          <CardDescription>View your upcoming, completed, and cancelled rentals.</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No bookings found.</p>
              <Button asChild>
                <Link href="/browse">Browse Vehicles</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      <Link href={`/vehicle/${booking.vehicle.id}`} className="text-primary hover:underline">
                        {booking.vehicle.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={booking.completed ? 'default' : 'secondary'}
                        className={!booking.completed ? 'bg-blue-100 text-blue-800' : ''}
                      >
                        {booking.completed ? 'Completed' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(booking.startTime)}</TableCell>
                    <TableCell>{formatDate(booking.endTime)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(booking.totalCost)}</TableCell>
                    <TableCell className="text-center">
                      {booking.completed ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/review/${booking.vehicle.id}`}>
                            <FilePenLine className="mr-2 h-4 w-4" />
                            Write Review
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
