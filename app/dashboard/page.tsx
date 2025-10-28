'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MobileSidebar from '@/components/ui/mobile-sidebar';
import IssueForm from '@/components/dashboard/vehicle-owner/issue-form';
import IssueHistory from '@/components/dashboard/vehicle-owner/issue-history';
import ModernAnalyticsDashboard from '@/components/dashboard/service-provider/modern-analytics-dashboard';
import EditProfile from '@/components/dashboard/vehicle-owner/edit-profile';
import FloatingAIAssistant from '@/components/floating-ai-assistant';
import { 
  Car, 
  User, 
  LogOut, 
  Settings, 
  FileText, 
  History, 
  Bell,
  Home,
  TrendingUp,
  Activity,
  Shield,
  Globe
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      fetchUserProfile();
    }
  }, [session, status, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isVehicleOwner) {
      setActiveTab('overview');
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleProfileSave = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setIsEditingProfile(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-900">Loading Dashboard...</p>
          <p className="text-gray-600 mt-2">Initializing AI systems...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isVehicleOwner = (session.user as any)?.userType === 'vehicle_owner';
  const isAdmin = (session.user as any)?.userType === 'admin';

  // Redirect admin to admin dashboard
  if (isAdmin) {
    router.push('/admin/dashboard');
    return null;
  }

  const vehicleOwnerTabs = [
    { id: 'report', label: 'Report Issue', icon: <FileText className="w-5 h-5" />, component: IssueForm },
    { id: 'history', label: 'Issue History', icon: <History className="w-5 h-5" />, component: IssueHistory },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, component: null },
  ];

  const serviceProviderTabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'vehicle-models', label: 'Vehicle Models', icon: <Car className="w-5 h-5" /> },
    { id: 'manufacturing', label: 'Manufacturing', icon: <Activity className="w-5 h-5" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'quality', label: 'Quality', icon: <Shield className="w-5 h-5" /> },
    { id: 'geographic', label: 'Geographic', icon: <Globe className="w-5 h-5" /> },
  ];

  const tabs = isVehicleOwner ? vehicleOwnerTabs : serviceProviderTabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-400/12 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,138,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,138,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        userType={isVehicleOwner ? 'vehicle_owner' : 'service_provider'}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={session.user?.name ?? undefined}
      />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-orange-200/50 z-30 shadow-lg">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-orange-200/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 border-2 border-orange-500 rounded-2xl flex items-center justify-center">
                  <Car className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    Carsor AI
                  </h1>
                  <p className="text-xs text-gray-600">Professional Platform</p>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-orange-500">
                <Avatar className="w-12 h-12 border-2 border-orange-300">
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-semibold truncate">{session.user?.name}</p>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-orange-500 text-orange-700 bg-white mt-1"
                  >
                    {isVehicleOwner ? 'Vehicle Owner' : 'Service Provider'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-2 px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500/15 to-orange-600/20 text-gray-900 border border-orange-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-orange-50'
                    }`}
                  >
                    <div className={`transition-colors ${
                      activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'
                    }`}>
                      {tab.icon}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-orange-200/30">
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-2xl py-3"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${!isMobile ? 'ml-80' : ''} ${isMobile ? 'pt-20' : ''} relative z-10`}>
        {/* Top Header for Desktop */}
        {!isMobile && (
          <div className="bg-white/95 backdrop-blur-xl border-b border-orange-200/50 sticky top-0 z-20 shadow-sm">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-black">
                    {isVehicleOwner ? 'Vehicle Dashboard' : 'Analytics Dashboard'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isVehicleOwner ? 'Manage your vehicle issues and maintenance' : 'Professional insights and data analytics'}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-orange-50 relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  </Button>
                  
                  {userProfile && isVehicleOwner && (
                    <Card className="bg-white border-2 border-orange-500 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 border-2 border-orange-500 rounded-2xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{userProfile.vehicleModel}</h3>
                            <p className="text-sm text-gray-600">{userProfile.vehicleRegistration}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-8">
          {isVehicleOwner ? (
            <div className="space-y-8">
              {activeTab === 'report' && (
                <IssueForm 
                  vehicleModel={userProfile?.vehicleModel || 'Unknown'} 
                  onSubmit={(issue) => {
                    console.log('Issue submitted:', issue);
                  }}
                />
              )}

              {activeTab === 'history' && <IssueHistory />}

              {activeTab === 'profile' && (
                <>
                  {isEditingProfile ? (
                    <EditProfile 
                      userProfile={userProfile}
                      onSave={handleProfileSave}
                      onCancel={() => setIsEditingProfile(false)}
                    />
                  ) : (
                    <div className="space-y-6">
                      {/* Header Section - No Container */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 border-2 border-orange-500 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-bold text-gray-900">Profile Information</h1>
                            <p className="text-gray-600 mt-1">Manage your account details</p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Content - No Container */}
                      {userProfile ? (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-500">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-orange-600" />
                                Full Name
                              </label>
                              <p className="text-xl font-semibold text-gray-900">{userProfile.name}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-500">
                              <label className="text-sm font-semibold text-gray-700 mb-3 block">Email Address</label>
                              <p className="text-xl font-semibold text-gray-900">{userProfile.email}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-500">
                              <label className="text-sm font-semibold text-gray-700 mb-3 block">Phone Number</label>
                              <p className="text-xl font-semibold text-gray-900">{userProfile.phone}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-500">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                <Car className="w-4 h-4 text-orange-600" />
                                Vehicle Model
                              </label>
                              <p className="text-xl font-semibold text-gray-900">{userProfile.vehicleModel}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-500">
                              <label className="text-sm font-semibold text-gray-700 mb-3 block">Manufacturing Year</label>
                              <p className="text-xl font-semibold text-gray-900">{userProfile.vehicleYear}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-500 lg:col-span-2">
                              <label className="text-sm font-semibold text-gray-700 mb-3 block">Registration Number</label>
                              <p className="text-xl font-semibold text-gray-900">{userProfile.vehicleRegistration}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => setIsEditingProfile(true)}
                            className="bg-white border border-orange-200 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white rounded-lg px-6 py-2 text-base font-semibold shadow-sm transition-all duration-200"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading profile...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <ModernAnalyticsDashboard activeTab={activeTab} />
          )}
        </div>
      </div>
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}
