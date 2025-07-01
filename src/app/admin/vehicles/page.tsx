"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, Eye, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useAdminDashboard from '@/hooks/use-admin-dashboard';
import Link from 'next/link';

export default function VehicleApprovalPage() {
  const { data, loading, error } = useAdminDashboard();
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [processingVehicles, setProcessingVehicles] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Approve vehicle function
  async function approveVehicle(vehicleId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      });
      return;
    }

    setProcessingVehicles(prev => new Set(prev).add(vehicleId));

    try {
      const response = await fetch(`http://localhost:8080/admin/vehicle/${vehicleId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseData = await response.text();
      
      if (!response.ok) {
        throw new Error(responseData || 'Failed to approve vehicle');
      }

      toast({
        title: "Success",
        description: "Vehicle approved successfully",
      });

      // Refresh the page to get updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve vehicle",
        variant: "destructive",
      });
    } finally {
      setProcessingVehicles(prev => {
        const newSet = new Set(prev);
        newSet.delete(vehicleId);
        return newSet;
      });
    }
  }

  // Reject vehicle function
  async function rejectVehicle(vehicleId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      });
      return;
    }

    setProcessingVehicles(prev => new Set(prev).add(vehicleId));

    try {
      const response = await fetch(`http://localhost:8080/admin/vehicle/${vehicleId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseData = await response.text();
      
      if (!response.ok) {
        throw new Error(responseData || 'Failed to reject vehicle');
      }

      toast({
        title: "Success",
        description: "Vehicle rejected successfully",
      });

      // Refresh the page to get updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject vehicle",
        variant: "destructive",
      });
    } finally {
      setProcessingVehicles(prev => {
        const newSet = new Set(prev);
        newSet.delete(vehicleId);
        return newSet;
      });
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="default">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVehicleStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="destructive">Maintenance</Badge>;
      case 'UNAVAILABLE':
        return <Badge variant="outline">Unavailable</Badge>;
      case 'CHECKING':
        return <Badge variant="secondary">Checking</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const displayedVehicles = showAllVehicles 
    ? data?.pendingApprovals || []
    : (data?.pendingApprovals || []).slice(0, 10);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">Vehicle Management</h1>
          <p className="text-muted-foreground mt-2">Review and manage all vehicle submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard">
              ← Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="font-headline">All Vehicles</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {data.pendingApprovals?.length || 0} total
              </Badge>
            </div>
          </div>
          <CardDescription>Review and approve or reject vehicle submissions from owners.</CardDescription>
        </CardHeader>
        <CardContent>
          {(data.pendingApprovals?.length || 0) > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Vehicle Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedVehicles.map((vehicle) => {
                    const isProcessing = processingVehicles.has(vehicle.id);
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Image 
                              src={`http://localhost:8080${vehicle.imagePath}`} 
                              alt={vehicle.name} 
                              width={80} 
                              height={60} 
                              className="rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">{vehicle.name}</p>
                              <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                              <p className="text-sm text-muted-foreground">₹{vehicle.rentPerHour}/hour</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.owner.name}</p>
                            <p className="text-sm text-muted-foreground">{vehicle.owner.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(vehicle.approvalStatus)}
                        </TableCell>
                        <TableCell>
                          {getVehicleStatusBadge(vehicle.status)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="capitalize">
                              {vehicle.type.toLowerCase()}
                            </Badge>
                            <p className="text-sm text-muted-foreground">{vehicle.seatCount} seats</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Fuel:</span> {vehicle.fuelType}</p>
                            <p><span className="font-medium">Gear:</span> {vehicle.gearType}</p>
                            <p><span className="font-medium">Rating:</span> {vehicle.averageRating}/5</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" asChild disabled={isProcessing}>
                              <Link href={`/admin/vehicles/${vehicle.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {vehicle.approvalStatus === 'PENDING' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => approveVehicle(vehicle.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {isProcessing ? 'Processing' : 'Approve'}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => rejectVehicle(vehicle.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {isProcessing ? 'Processing' : 'Reject'}
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {(data.pendingApprovals?.length || 0) > 10 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllVehicles(!showAllVehicles)}
                    className="flex items-center gap-2"
                  >
                    {showAllVehicles ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show More ({(data.pendingApprovals?.length || 0) - 10} more)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vehicles found</p>
              <p className="text-sm text-muted-foreground mt-1">No vehicle submissions to review</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
