'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Issue {
  _id: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  hasImage?: boolean;
}

export default function IssueHistory() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved', resolvedAt: new Date() }),
      });

      if (response.ok) {
        fetchIssues(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update issue:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue History</h1>
          <p className="text-gray-600">Track and manage your reported vehicle issues</p>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section - No Container */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Issue History</h1>
        <p className="text-gray-600 text-sm">Track and manage your reported vehicle issues</p>
      </div>

      {/* Issues List - No Container */}
      <div className="space-y-3">
        {issues.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No issues reported yet</p>
            <p className="text-gray-400 text-sm mt-1">Your reported issues will appear here</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue._id} className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              issue.status === 'resolved' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-orange-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(issue.severity)}
                    <Badge variant={issue.status === 'resolved' ? 'default' : 'secondary'} className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                      {issue.category}
                    </Badge>
                    <Badge variant={issue.severity === 'high' ? 'destructive' : 'outline'} className={`text-xs ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-green-100 text-green-800 border-green-300'
                    }`}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-gray-900 mb-2 text-sm leading-relaxed">{issue.description}</p>
                  <p className="text-xs text-gray-600">
                    Reported: {new Date(issue.createdAt).toLocaleDateString()}
                    {issue.resolvedAt && (
                      <span> • Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-3">
                  <Badge variant={issue.status === 'resolved' ? 'default' : 'destructive'} className={`text-xs ${
                    issue.status === 'resolved' 
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}>
                    {issue.status}
                  </Badge>
                  {issue.status === 'open' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsResolved(issue._id)}
                      className="bg-white border-orange-200 text-gray-700 hover:bg-orange-500 hover:border-orange-500 hover:text-white text-xs h-7 transition-all duration-200"
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}