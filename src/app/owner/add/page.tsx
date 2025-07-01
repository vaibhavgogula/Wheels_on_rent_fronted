'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const vehicleSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  type: z.enum(['CAR', 'BIKE']),
  fuelType: z.enum(['Electric', 'Gasoline', 'Diesel', 'Hybrid']),
  transmission: z.enum(['Automatic', 'Manual']),
  seats: z.coerce.number().min(1),
  pricePerHour: z.coerce.number().min(1),
  description: z.string().min(10),
  image: z.any().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function AddVehiclePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: '', brand: '', model: '', seats: 2, pricePerHour: 10, description: '',
    },
  });

  async function onSubmit(values: VehicleFormValues) {
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('brand', values.brand);
      formData.append('model', values.model);
      formData.append('fuelType', values.fuelType);
      formData.append('gearType', values.transmission);
      formData.append('seatCount', values.seats.toString());
      formData.append('rentPerHour', values.pricePerHour.toString());
      formData.append('description', values.description);
      formData.append('type', values.type);

      if (values.image?.[0]) {
        formData.append('image', values.image[0]);
      }

      const res = await fetch(`http://localhost:8080/owner/add-vehicle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.text();
      if (res.ok) {
        setMessage('✅ Vehicle submitted for approval!');
        form.reset();
      } else {
        setMessage(`❌ Error: ${data}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to submit vehicle.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Add a New Vehicle</CardTitle>
          <CardDescription>Fill out the details below to list your vehicle.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['name', 'brand', 'model'].map(field => (
                  <FormField key={field} name={field as keyof VehicleFormValues} control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name}</FormLabel>
                      <FormControl><Input {...field} placeholder={`Enter ${field.name}`} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
                <FormField name="type" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="CAR">Car</SelectItem>
                        <SelectItem value="BIKE">Bike</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="fuelType" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['Gasoline', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="transmission" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="seats" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seat Count</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="pricePerHour" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent per Hour</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="image" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <Input type="file" className='cursor-pointer' accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </Button>
              {message && <p className="text-center text-sm text-muted-foreground mt-2">{message}</p>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
