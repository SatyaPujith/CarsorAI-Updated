'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Mic, 
  BarChart3, 
  MessageCircle, 
  Wrench, 
  Shield, 
  Zap, 
  Brain, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play,
  Globe,
  Database,
  Activity
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms analyze vehicle issues with 98% accuracy",
      gradient: "from-purple-500 via-pink-500 to-red-500"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Recognition",
      description: "Speak your vehicle problems naturally - our AI understands and processes instantly",
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Enterprise Analytics",
      description: "Comprehensive data insights for manufacturing optimization and quality control",
      gradient: "from-green-500 via-emerald-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Certified",
      description: "Official integration with automotive ecosystem and authorized service network",
      gradient: "from-orange-500 via-red-500 to-pink-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Issues Resolved", icon: <Wrench className="w-6 h-6" /> },
    { number: "98%", label: "AI Accuracy", icon: <Zap className="w-6 h-6" /> },
    { number: "15K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "24/7", label: "AI Support", icon: <MessageCircle className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Vehicle Owner",
      content: "The AI diagnosed my engine issue in seconds. Saved me hours at the service center!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Fleet Manager",
      content: "Analytics dashboard helps us predict maintenance needs across our entire fleet.",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Service Provider",
      content: "Manufacturing insights have improved our service quality by 40%.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,138,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,138,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-orange-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-orange-500/60 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-orange-300/60 rounded-full animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-xl border-b border-orange-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-orange-500 rounded-2xl flex items-center justify-center">
                  <Car className="w-7 h-7 text-orange-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent">
                  Carsor AI
                </h1>
                <p className="text-xs text-gray-600 font-medium">Next-Gen Vehicle Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/signin')}
                className="text-gray-700 hover:text-black hover:bg-orange-50 backdrop-blur-sm font-medium border border-orange-200 text-sm sm:text-base px-2 sm:px-4 rounded-xl"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/auth/signup')}
                className="bg-white border border-orange-300 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white shadow-sm font-medium px-3 sm:px-6 text-sm sm:text-base rounded-xl transition-all duration-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-bold mb-16 leading-tight">
              <span className="text-black">
                Future of Vehicle Intelligence
              </span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-20 leading-relaxed max-w-4xl mx-auto">
              Revolutionary AI platform for automotive industry. Advanced diagnostics, predictive analytics, 
              and intelligent service management powered by next-generation machine learning.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-8 px-4">
              <Button 
                size="lg" 
                onClick={() => router.push('/auth/signup')}
                className="bg-white border-2 border-orange-300 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white px-8 py-4 text-lg shadow-sm font-medium transition-all duration-200 rounded-xl"
              >
                <Play className="w-6 h-6 mr-3" />
                Launch Platform
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => router.push('/auth/signin')}
                className="bg-white border-2 border-gray-300 hover:bg-gray-500 hover:border-gray-500 text-gray-800 hover:text-white backdrop-blur-sm px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200"
              >
                <Shield className="w-6 h-6 mr-3" />
                Enterprise Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                Enterprise AI Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge artificial intelligence and advanced analytics 
              engineered for next-generation automotive excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border border-orange-200 hover:bg-orange-50 transition-all duration-200 shadow-sm rounded-xl">
                <CardHeader className="pb-4">
                  <div className="inline-flex w-12 h-12 rounded-xl border-2 border-orange-500 items-center justify-center text-orange-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600">
              Real numbers from our growing community
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-xl border border-orange-200/50 text-center hover:bg-white/95 transition-all duration-300 shadow-lg group rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 bg-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-orange-500/10 to-orange-600/15 text-orange-700 border-orange-500/20 mb-4 rounded-full">
              <Activity className="w-4 h-4 mr-2" />
              How It Works
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
              Simple. Powerful. Intelligent.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Voice & Image Input",
                description: "Describe issues naturally or upload images. Our AI processes everything instantly with enterprise-grade accuracy.",
                icon: <Mic className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Advanced machine learning algorithms analyze patterns, predict issues, and provide comprehensive diagnostics.",
                icon: <Brain className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Actionable Insights",
                description: "Receive detailed recommendations, cost estimates, and manufacturing insights through our intelligent platform.",
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-2 border-orange-500 rounded-2xl flex items-center justify-center text-orange-600 mx-auto">
                    {item.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-white/95 to-orange-50/90 backdrop-blur-xl rounded-3xl p-16 border border-orange-200/50 shadow-lg">
            <Globe className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Ready for the Future?
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join the next generation of automotive intelligence. Experience AI-powered 
              vehicle management designed for tomorrow's challenges.
            </p>
            <Button 
              size="lg" 
              onClick={() => router.push('/auth/signup')}
              className="bg-white border-2 border-orange-300 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white px-12 py-6 text-xl shadow-sm font-medium transition-all duration-200 rounded-xl"
            >
              <Database className="w-6 h-6 mr-3" />
              Access Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-xl border-t border-orange-200/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-10 h-10 border-2 border-orange-500 rounded-2xl flex items-center justify-center">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Carsor AI
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Next-generation automotive intelligence platform for modern vehicles
          </p>
          <p className="text-sm text-gray-500">
            Enterprise AI Platform • Professional Automotive Solutions • Built for Tomorrow
          </p>
        </div>
      </footer>
    </div>
  );
}
