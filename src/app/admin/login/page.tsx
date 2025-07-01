'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

interface JwtPayload {
  sub: string;
  role: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: AdminLoginFormValues) {
    setIsLoading(true);
    setError(null);

    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        role: 'ADMIN',
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Login failed');
        }
        
        const data = await res.json();
        const token = data.token;
        localStorage.setItem('token', token);

        // decode token to get role
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded.role.replace('ROLE_', '');

        // only allow admin access
        if (role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          throw new Error('Access denied. Admin privileges required.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Login failed. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="font-headline text-3xl text-gray-900">Admin Access</CardTitle>
          <CardDescription className="text-gray-600">
            Secure login for system administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Admin Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="admin@wheelsonrent.com" 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field} 
                      />
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
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Need help? Contact{' '}
                <Link href="mailto:support@wheelsonrent.com" className="font-medium text-blue-600 hover:underline">
                  system administrator
                </Link>
              </p>
            </div>
            <div className="mt-4">
              <Link 
                href="/login" 
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ← Back to regular login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 