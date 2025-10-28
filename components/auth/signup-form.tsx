'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vehicleModels } from '@/lib/vehicle-models';
import { Car, ArrowLeft, Sparkles } from 'lucide-react';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const userType = 'vehicle_owner';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleRegistration: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType }),
      });

      if (response.ok) {
        router.push('/auth/signin?message=Account created successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Signup failed');
      }
    } catch (error) {
      alert('Network error occurred');
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
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-orange-200/50 shadow-lg rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent mb-2">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join AutoDoc AI platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Row - Name and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-800 font-medium text-sm">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-lg text-sm"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800 font-medium text-sm">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-lg text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Second Row - Password and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800 font-medium text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-lg text-sm"
                    placeholder="Create password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-800 font-medium text-sm">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-lg text-sm"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Third Row - Vehicle Model (Full Width) */}
              <div className="space-y-2">
                <Label htmlFor="vehicleModel" className="text-gray-800 font-medium text-sm">Vehicle Model</Label>
                <Select value={formData.vehicleModel} onValueChange={(value) => setFormData({ ...formData, vehicleModel: value })}>
                  <SelectTrigger className="bg-white border-orange-200 text-gray-900 focus:border-orange-400 h-10 rounded-lg text-sm">
                    <SelectValue placeholder="Select your vehicle model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-orange-200">
                    {vehicleModels.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="text-gray-900 hover:bg-orange-50">
                        {model.name} ({model.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fourth Row - Year and Registration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-gray-800 font-medium text-sm">Year</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    min="2010"
                    max="2024"
                    required
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-lg text-sm"
                    placeholder="2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleRegistration" className="text-gray-800 font-medium text-sm">Registration</Label>
                  <Input
                    id="vehicleRegistration"
                    type="text"
                    required
                    placeholder="MH01AB1234"
                    value={formData.vehicleRegistration}
                    onChange={(e) => setFormData({ ...formData, vehicleRegistration: e.target.value })}
                    className="bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 h-10 rounded-lg text-sm"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white border-2 border-orange-300 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white h-12 rounded-lg font-semibold shadow-sm transition-all duration-200 text-sm mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <Button 
                variant="link" 
                onClick={() => router.push('/auth/signin')} 
                className="p-0 text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                Sign In
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