"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Car, CheckCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import useOwnerVehicles from "@/hooks/use-owner-vehicles";
import { useEffect, useState } from "react";


export default function OwnerDashboard() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  const { vehicles, loading, error } = useOwnerVehicles(token);
  console.log(vehicles);
  const stats = [
    { title: "Vehicles Listed", value: vehicles.length, icon: Car },
    { title: "Approved", value: vehicles.filter(vehicle => vehicle.approvalStatus === 'APPROVED').length, icon: CheckCircle },
    { title: "Pending Review", value: vehicles.filter(vehicle => vehicle.approvalStatus === 'PENDING').length, icon: Clock },
  ];

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
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="font-headline text-4xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Here&apos;s an overview of your vehicle listings.</p>
        </div>
        <Button asChild>
          <Link href="/owner/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Vehicle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Bookings</CardTitle>
                <CardDescription>Your 5 most recent rentals.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Rental history will be displayed here.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Quick Links</CardTitle>
                 <CardDescription>Navigate to key owner actions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                <Button variant="outline" asChild><Link href="/owner/vehicles">Manage My Vehicles</Link></Button>
                <Button variant="outline" asChild><Link href="/owner/rentals">View Rental History</Link></Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
