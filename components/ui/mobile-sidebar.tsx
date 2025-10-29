'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  History, 
  User, 
  BarChart3, 
  Users, 
  Settings,
  Bell,
  Car,
  LogOut,
  Activity,
  Shield,
  TrendingUp,
  Globe
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface MobileSidebarProps {
  userType: 'vehicle_owner' | 'analytics_company';
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
}

export default function MobileSidebar({ userType, activeTab, onTabChange, userName }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const vehicleOwnerTabs = [
    { id: 'report', label: 'Report Issue', icon: <FileText className="w-5 h-5" /> },
    { id: 'history', label: 'Issue History', icon: <History className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const serviceProviderTabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'vehicle-models', label: 'Vehicle Models', icon: <Car className="w-5 h-5" /> },
    { id: 'manufacturing', label: 'Manufacturing', icon: <Activity className="w-5 h-5" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'quality', label: 'Quality', icon: <Shield className="w-5 h-5" /> },
    { id: 'geographic', label: 'Geographic', icon: <Globe className="w-5 h-5" /> },
  ];

  const tabs = userType === 'vehicle_owner' ? vehicleOwnerTabs : serviceProviderTabs;

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Carsor AI
            </span>
          </div>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Twitter/X Style Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Carsor AI
                </h2>
                <p className="text-xs text-gray-400">Professional Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12 border-2 border-cyan-400/30">
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white font-semibold truncate">{userName || 'User'}</p>
                <Badge 
                  variant="outline" 
                  className="text-xs border-cyan-400/30 text-cyan-300 bg-cyan-500/10"
                >
                  {userType === 'vehicle_owner' ? 'Vehicle Owner' : 'Analytics Company'}
                </Badge>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Active</span>
                </div>
                <p className="text-sm font-semibold text-white mt-1">Online</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">Status</span>
                </div>
                <p className="text-sm font-semibold text-white mt-1">Verified</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-2 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`transition-colors ${
                    activeTab === tab.id ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="outline"
              className="w-full border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-2xl py-3"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
