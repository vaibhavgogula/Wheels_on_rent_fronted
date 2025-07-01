'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation'
import {jwtDecode }from 'jwt-decode'
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
  role: z.enum(['RENTER', 'OWNER']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface JwtPayload {
  sub: string;
  role: string; // e.g., "ROLE_ADMIN", "ROLE_OWNER"
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'RENTER',
    },
  });

  function onSubmit(values: LoginFormValues) {
    
    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        role: values.role,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        console.log(res);
        const data = await res.json();
  
        const token = data.token;
        localStorage.setItem('token', token);
  
        // decode token to get role
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded.role.replace('ROLE_', '');
  
        // Dispatch custom event to refresh header
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { token } }));
  
        // redirect based on role
        if (role === 'ADMIN') router.push('/admin/dashboard');
        else if (role === 'OWNER') router.push('/owner/dashboard');
        else router.push('/browse');
      })
      .catch((err) => {
        // console.log(err);
        setError(err.message);
        // alert('Login failed: ' + err.message);
      });
  }

  return (
    <div className="container mx-auto flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to continue your journey with WheelsOnRent.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login as</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RENTER">Renter</SelectItem>
                          <SelectItem value="OWNER">Vehicle Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {
                  error && (
                    <p className="text-red-500 text-center w-full">{error}</p>
                  )
                }
              <Button type="submit" className="w-full">Log In</Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <Link href="#" className="font-medium text-primary hover:underline">
              Forgot your password?
            </Link>
            <p className="text-muted-foreground mt-2">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
