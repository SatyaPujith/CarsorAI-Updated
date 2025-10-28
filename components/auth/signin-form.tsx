'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, ArrowLeft, Sparkles } from 'lucide-react';

export default function SigninForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        alert('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,138,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,138,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-orange-200/50 shadow-lg rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your Carsor AI account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 font-medium text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-12 rounded-lg text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800 font-medium text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-12 rounded-lg text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white border-2 border-orange-300 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white h-12 rounded-lg font-semibold shadow-sm transition-all duration-200 text-sm" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <span className="text-gray-600 text-sm">Don't have an account? </span>
              <Button 
                variant="link" 
                onClick={() => router.push('/auth/signup')} 
                className="p-0 text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                Sign Up
              </Button>
            </div>

            <div className="pt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')} 
                className="text-gray-600 hover:text-gray-900 hover:bg-orange-50 rounded-lg text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}