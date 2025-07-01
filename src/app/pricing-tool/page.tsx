'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suggestRentalPriceAction } from './actions';
import type { SuggestRentalPriceOutput } from '@/ai/flows/suggest-rental-price';

const formSchema = z.object({
  vehicleType: z.string().min(1, 'Vehicle type is required.'),
  location: z.string().min(1, 'Location is required.'),
  demand: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

export default function PricingToolPage() {
  const [result, setResult] = useState<SuggestRentalPriceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: '',
      location: '',
      demand: 'medium',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const response = await suggestRentalPriceAction(values);

    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-fit bg-primary/10 p-4 rounded-full">
                <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl mt-4">AI-Powered Price Suggestions</CardTitle>
            <CardDescription className="text-lg">
              Let our AI suggest the optimal rental price for your vehicle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SUV, Convertible, Truck" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Market Demand</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select demand level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Suggest Price'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mt-8 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">An Error Occurred</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="mt-8 animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Suggested Daily Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8 bg-primary/10 rounded-lg">
                <DollarSign className="h-10 w-10 text-primary mr-4" />
                <span className="text-6xl font-bold text-primary">{result.suggestedPrice}</span>
                <span className="text-xl text-muted-foreground self-end mb-2 ml-2">/day</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2 mt-4 font-headline">Reasoning:</h4>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                This is an AI-generated suggestion. Please use your own judgment when setting the final price.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
