'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Car, 
  TrendingUp, 
  AlertTriangle, 
  Wrench, 
  Users, 
  Clock,
  Download,
  Calendar,
  MapPin,
  Factory,
  Target,
  Globe,
  Activity,
  Shield,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface Issue {
  _id: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  vehicleModel: string;
  createdAt: string;
  resolvedAt?: string;
  userId: string;
}

interface AnalyticsData {
  overview: {
    totalIssues: number;
    resolvedIssues: number;
    activeIssues: number;
    criticalIssues: number;
    totalUsers: number;
    avgResolutionTime: number;
  };
  issuesByModel: Array<{
    model: string;
    issues: number;
    resolved: number;
    resolutionRate: number;
  }>;
  issuesByCategory: Array<{
    category: string;
    count: number;
    color: string;
  }>;
  monthlyTrends: Array<{
    month: string;
    issues: number;
    resolved: number;
  }>;
  commonFlaws: Array<{
    issue: string;
    frequency: number;
    severity: string;
    affectedModels: string[];
  }>;
  severityDistribution: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
}

interface ModernAnalyticsDashboardProps {
  activeTab?: string;
}

export default function ModernAnalyticsDashboard({ activeTab = 'overview' }: ModernAnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const issuesData = await response.json();
        setIssues(issuesData);
        processAnalyticsData(issuesData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (issuesData: Issue[]) => {
    if (!issuesData || issuesData.length === 0) {
      setData({
        overview: {
          totalIssues: 0,
          resolvedIssues: 0,
          activeIssues: 0,
          criticalIssues: 0,
          totalUsers: 0,
          avgResolutionTime: 0,
        },
        issuesByModel: [],
        issuesByCategory: [],
        monthlyTrends: [],
        commonFlaws: [],
        severityDistribution: [],
      });
      return;
    }

    // Overview calculations
    const totalIssues = issuesData.length;
    const resolvedIssues = issuesData.filter(issue => issue.status === 'resolved').length;
    const activeIssues = totalIssues - resolvedIssues;
    const criticalIssues = issuesData.filter(issue => issue.severity === 'high').length;
    const uniqueUsers = new Set(issuesData.map(issue => issue.userId)).size;

    // Calculate average resolution time
    const resolvedWithTime = issuesData.filter(issue => issue.status === 'resolved' && issue.resolvedAt);
    const avgResolutionTime = resolvedWithTime.length > 0 
      ? resolvedWithTime.reduce((acc, issue) => {
          const created = new Date(issue.createdAt);
          const resolved = new Date(issue.resolvedAt!);
          return acc + (resolved.getTime() - created.getTime());
        }, 0) / resolvedWithTime.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Issues by model
    const modelCounts = issuesData.reduce((acc, issue) => {
      const model = issue.vehicleModel || 'Unknown';
      if (!acc[model]) {
        acc[model] = { total: 0, resolved: 0 };
      }
      acc[model].total++;
      if (issue.status === 'resolved') {
        acc[model].resolved++;
      }
      return acc;
    }, {} as Record<string, { total: number; resolved: number }>);

    const issuesByModel = Object.entries(modelCounts).map(([model, counts]) => ({
      model,
      issues: counts.total,
      resolved: counts.resolved,
      resolutionRate: counts.total > 0 ? Math.round((counts.resolved / counts.total) * 100) : 0,
    })).sort((a, b) => b.issues - a.issues);

    // Issues by category
    const categoryCounts = issuesData.reduce((acc, issue) => {
      const category = issue.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e', '#8b5cf6', '#6b7280'];
    const issuesByCategory = Object.entries(categoryCounts).map(([category, count], index) => ({
      category,
      count,
      color: colors[index % colors.length],
    })).sort((a, b) => b.count - a.count);

    // Monthly trends (last 6 months)
    const monthlyData = {} as Record<string, { issues: number; resolved: number }>;
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = { issues: 0, resolved: 0 };
    }

    issuesData.forEach(issue => {
      const issueDate = new Date(issue.createdAt);
      const monthKey = issueDate.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].issues++;
        if (issue.status === 'resolved') {
          monthlyData[monthKey].resolved++;
        }
      }
    });

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      issues: data.issues,
      resolved: data.resolved,
    }));

    // Common flaws analysis
    const flawPatterns = {} as Record<string, {
      frequency: number;
      severity: Record<string, number>;
      models: Set<string>;
      descriptions: string[];
    }>;

    issuesData.forEach(issue => {
      const category = issue.category || 'Other';
      
      if (!flawPatterns[category]) {
        flawPatterns[category] = {
          frequency: 0,
          severity: { low: 0, medium: 0, high: 0 },
          models: new Set(),
          descriptions: [],
        };
      }
      
      flawPatterns[category].frequency++;
      flawPatterns[category].severity[issue.severity]++;
      flawPatterns[category].models.add(issue.vehicleModel);
      flawPatterns[category].descriptions.push(issue.description);
    });

    const commonFlaws = Object.entries(flawPatterns)
      .map(([pattern, data]) => {
        const mostCommonSeverity = Object.entries(data.severity)
          .sort(([,a], [,b]) => b - a)[0][0];
        
        return {
          issue: `${pattern} related issues`,
          frequency: data.frequency,
          severity: mostCommonSeverity,
          affectedModels: Array.from(data.models),
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Severity distribution
    const severityCounts = issuesData.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityDistribution = Object.entries(severityCounts).map(([severity, count]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count,
      percentage: Math.round((count / totalIssues) * 100),
    }));

    setData({
      overview: {
        totalIssues,
        resolvedIssues,
        activeIssues,
        criticalIssues,
        totalUsers: uniqueUsers,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      },
      issuesByModel,
      issuesByCategory,
      monthlyTrends,
      commonFlaws,
      severityDistribution,
    });
  };

  const exportData = async () => {
    try {
      if (!data) {
        alert('No data available to export');
        return;
      }

      const exportData = {
        generatedAt: new Date().toISOString(),
        overview: data.overview,
        issuesByModel: data.issuesByModel,
        issuesByCategory: data.issuesByCategory,
        monthlyTrends: data.monthlyTrends,
        commonFlaws: data.commonFlaws,
        severityDistribution: data.severityDistribution,
        rawIssues: issues
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Also create CSV export for easier analysis
      const csvData = [
        ['Issue ID', 'Description', 'Category', 'Severity', 'Status', 'Vehicle Model', 'Created Date', 'Resolved Date'],
        ...issues.map(issue => [
          issue._id,
          issue.description.replace(/,/g, ';'), // Replace commas to avoid CSV issues
          issue.category,
          issue.severity,
          issue.status,
          issue.vehicleModel,
          new Date(issue.createdAt).toLocaleDateString(),
          issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'Not resolved'
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const csvLink = document.createElement('a');
      csvLink.href = csvUrl;
      csvLink.download = `analytics-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(csvLink);
      csvLink.click();
      document.body.removeChild(csvLink);
      URL.revokeObjectURL(csvUrl);

      alert('Data exported successfully! Check your downloads folder for JSON and CSV files.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const renderOverviewContent = () => (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{data?.overview.totalIssues || 0}</p>
                <p className="text-xs text-gray-600">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{data?.overview.resolvedIssues || 0}</p>
                <p className="text-xs text-gray-600">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{data?.overview.activeIssues || 0}</p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{data?.overview.criticalIssues || 0}</p>
                <p className="text-xs text-gray-600">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{data?.overview.totalUsers || 0}</p>
                <p className="text-xs text-gray-600">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{data?.overview.avgResolutionTime || 0}d</p>
                <p className="text-xs text-gray-600">Avg Resolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={exportData}
          className="bg-white border border-green-200 hover:bg-green-500 hover:border-green-500 text-gray-700 hover:text-white rounded-lg text-sm transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button className="bg-white border border-purple-200 hover:bg-purple-500 hover:border-purple-500 text-gray-700 hover:text-white rounded-lg text-sm transition-all duration-200">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Category Chart */}
        <Card className="bg-white border border-orange-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <PieChart className="w-5 h-5 text-orange-600" />
              Issues by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.issuesByCategory && data.issuesByCategory.length > 0 ? (
              <div className="space-y-3">
                {data.issuesByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-900 font-medium text-sm">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-900 font-bold text-sm">{category.count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: category.color,
                            width: `${(category.count / (data?.overview.totalIssues || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">No category data available</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card className="bg-white border border-orange-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <LineChart className="w-5 h-5 text-orange-600" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.monthlyTrends && data.monthlyTrends.some(month => month.issues > 0) ? (
              <div className="space-y-3">
                {data.monthlyTrends.map((trend, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-medium">{trend.month}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-red-600">Issues: {trend.issues}</span>
                        <span className="text-green-600">Resolved: {trend.resolved}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${trend.issues > 0 ? (trend.issues / Math.max(...data.monthlyTrends.map(t => t.issues))) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${trend.resolved > 0 ? (trend.resolved / Math.max(...data.monthlyTrends.map(t => t.resolved))) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">No trend data available</p>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Models Performance */}
        <Card className="bg-white border border-orange-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Vehicle Models Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.issuesByModel && data.issuesByModel.length > 0 ? (
              <div className="space-y-3">
                {data.issuesByModel.slice(0, 5).map((model, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium text-sm">{model.model}</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                        {model.resolutionRate}% resolved
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-gray-600">Total: {model.issues}</span>
                      <span className="text-green-600">Resolved: {model.resolved}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${model.resolutionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">No model data available</p>
            )}
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="bg-white border border-orange-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <Target className="w-5 h-5 text-orange-600" />
              Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.severityDistribution && data.severityDistribution.length > 0 ? (
              <div className="space-y-3">
                {data.severityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.severity === 'High' ? 'bg-red-500' : 
                        item.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-gray-900 font-medium text-sm">{item.severity} Severity</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-900 font-bold text-sm">{item.count}</span>
                      <span className="text-gray-600 text-xs ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">No severity data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVehicleModelsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Vehicle Models Analysis</h3>
        <Select>
          <SelectTrigger className="w-48 bg-white border-orange-200 text-gray-900">
            <SelectValue placeholder="Filter by model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="nexon">Nexon</SelectItem>
            <SelectItem value="harrier">Harrier</SelectItem>
            <SelectItem value="safari">Safari</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.issuesByModel.map((model, index) => (
          <Card key={index} className="bg-white border border-orange-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">{model.model}</h4>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                  {model.resolutionRate}% resolved
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Issues</span>
                  <span className="text-gray-900 font-medium">{model.issues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resolved</span>
                  <span className="text-green-600 font-medium">{model.resolved}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${model.resolutionRate}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderManufacturingContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 border-2 border-orange-500 rounded-xl flex items-center justify-center">
          <Factory className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Manufacturing Insights</h3>
          <p className="text-gray-600">Quality control and production analysis</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.commonFlaws.map((flaw, index) => (
          <Card key={index} className="bg-white border border-orange-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-900">{flaw.issue}</h4>
                <Badge 
                  className={`text-xs ${
                    flaw.severity === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                    flaw.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                    'bg-green-100 text-green-800 border-green-300'
                  }`}
                >
                  {flaw.severity} priority
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency</span>
                  <span className="text-gray-900 font-medium">{flaw.frequency} reports</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Affected Models:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {flaw.affectedModels.map((model, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTrendsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 border-2 border-green-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Trend Analysis</h3>
          <p className="text-gray-600">Monthly patterns and forecasting</p>
        </div>
      </div>
      
      <Card className="bg-white border border-orange-200 shadow-sm">
        <CardContent className="p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Issue Trends</h4>
          <div className="space-y-3">
            {data?.monthlyTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium text-sm">{trend.month}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-red-600">Issues: {trend.issues}</span>
                  <span className="text-green-600">Resolved: {trend.resolved}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQualityContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 border-2 border-purple-500 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Quality Metrics</h3>
          <p className="text-gray-600">Performance and reliability indicators</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data?.severityDistribution.map((item, index) => (
          <Card key={index} className="bg-white border border-orange-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                item.severity === 'High' ? 'bg-red-100' :
                item.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Target className={`w-6 h-6 ${
                  item.severity === 'High' ? 'text-red-600' :
                  item.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">{item.severity} Severity</h4>
              <p className="text-2xl font-bold text-gray-900 mb-1">{item.count}</p>
              <p className="text-sm text-gray-600">{item.percentage}% of total</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderGeographicContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 border-2 border-cyan-500 rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Geographic Distribution</h3>
          <p className="text-gray-600">Regional analysis and service coverage</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white border border-orange-200 shadow-sm">
          <CardContent className="p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-3">Service Centers</h4>
            <div className="space-y-2">
              {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'].map((city, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-900 text-sm">{city}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-orange-200 shadow-sm">
          <CardContent className="p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-3">Regional Performance</h4>
            <div className="space-y-2">
              {[
                { region: 'North India', performance: 92 },
                { region: 'South India', performance: 88 },
                { region: 'West India', performance: 95 },
                { region: 'East India', performance: 85 }
              ].map((region, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">{region.region}</span>
                    <span className="text-orange-600 font-medium">{region.performance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${region.performance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  if (data.overview.totalIssues === 0) {
    return (
      <div className="text-center py-12">
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">No vehicle issues have been reported yet. Analytics will appear once users start submitting issues.</p>
      </div>
    );
  }

  // Render content based on active tab
  switch (activeTab) {
    case 'overview':
      return renderOverviewContent();
    case 'vehicle-models':
      return renderVehicleModelsContent();
    case 'manufacturing':
      return renderManufacturingContent();
    case 'trends':
      return renderTrendsContent();
    case 'quality':
      return renderQualityContent();
    case 'geographic':
      return renderGeographicContent();
    default:
      return renderOverviewContent();
  }
}