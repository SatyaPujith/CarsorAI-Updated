'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vehicleModels } from '@/lib/vehicle-models';
import { Save, X, User, Car, Phone, Mail } from 'lucide-react';

interface EditProfileProps {
  userProfile: any;
  onSave: (updatedProfile: any) => void;
  onCancel: () => void;
}

export default function EditProfile({ userProfile, onSave, onCancel }: EditProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleRegistration: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        vehicleModel: userProfile.vehicleModel || '',
        vehicleYear: userProfile.vehicleYear?.toString() || '',
        vehicleRegistration: userProfile.vehicleRegistration || ''
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vehicleYear: parseInt(formData.vehicleYear)
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        onSave(updatedProfile);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getModelName = (modelId: string) => {
    const model = vehicleModels.find(m => m.id === modelId);
    return model ? `${model.name} (${model.category})` : modelId;
  };

  return (
    <div className="space-y-6">
      {/* Header Section - No Container */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 border-2 border-orange-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 text-sm">Update your information</p>
          </div>
        </div>
      </div>

      {/* Form Content - No Container */}
      <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="name" className="flex items-center gap-1 text-gray-800 font-medium text-sm">
                <User className="w-3 h-3 text-orange-600" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-orange-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-lg bg-white text-sm h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="flex items-center gap-1 text-gray-800 font-medium text-sm">
                <Phone className="w-3 h-3 text-orange-600" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border border-orange-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-lg bg-white text-sm h-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-800 font-medium">
              <Mail className="w-4 h-4 text-orange-600" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={userProfile?.email || ''}
              disabled
              className="border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="border-t border-orange-200 pt-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
              <Car className="w-5 h-5 text-orange-600" />
              Vehicle Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleModel" className="text-gray-800 font-medium">
                  Vehicle Model
                </Label>
                <Select 
                  value={formData.vehicleModel} 
                  onValueChange={(value) => setFormData({ ...formData, vehicleModel: value })}
                >
                  <SelectTrigger className="border border-orange-200 focus:border-orange-400 rounded-xl bg-white">
                    <SelectValue placeholder="Select your vehicle model" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-gray-800 font-medium">
                    Manufacturing Year
                  </Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    min="2010"
                    max="2024"
                    required
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    className="border border-orange-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleRegistration" className="text-gray-800 font-medium">
                    Registration Number
                  </Label>
                  <Input
                    id="vehicleRegistration"
                    type="text"
                    required
                    placeholder="e.g., MH01AB1234"
                    value={formData.vehicleRegistration}
                    onChange={(e) => setFormData({ ...formData, vehicleRegistration: e.target.value.toUpperCase() })}
                    className="border border-orange-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-orange-200">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-white border border-orange-200 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white rounded-lg py-3 shadow-sm transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </div>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-500 hover:border-gray-500 text-gray-700 hover:text-white rounded-lg py-3 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}