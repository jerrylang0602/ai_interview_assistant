
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { InterviewMetrics } from '@/components/dashboard/InterviewMetrics';
import { AIDetectionStats } from '@/components/dashboard/AIDetectionStats';
import { TrendsChart } from '@/components/dashboard/TrendsChart';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');

  // Fetch dashboard analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }

      return data || [];
    }
  });

  // Fetch recent interview results for additional insights
  const { data: recentResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['recent-interview-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interview_results')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching recent results:', error);
        throw error;
      }

      // Transform the data to match the expected interface
      const transformedData = data?.map(result => ({
        id: result.id,
        zoho_id: result.zoho_id || '',
        candidate_id: result.zoho_id || '', // Use zoho_id as candidate_id for compatibility
        overall_score: result.overall_score || 0,
        overall_level: result.overall_level || 'Level 2',
        technical_accuracy: result.technical_accuracy || 0,
        problem_solving: result.problem_solving || 0,
        communication: result.communication || 0,
        documentation: result.documentation || 0,
        feedback: result.feedback || '',
        ai_detected: result.ai_detected || false,
        completed_at: result.completed_at,
        answers: Array.isArray(result.detailed_result) ? result.detailed_result : [], // Use detailed_result as answers for compatibility
        questions: Array.isArray(result.detailed_result) ? result.detailed_result : [], // Use detailed_result as questions for compatibility
        status: result.status || 'completed'
      })) || [];

      return transformedData;
    }
  });

  const isLoading = analyticsLoading || resultsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor interview performance, AI detection, and candidate insights
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="ai-detection">AI Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AnalyticsOverview 
            analyticsData={analyticsData || []} 
            recentResults={recentResults || []} 
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <InterviewMetrics 
            analyticsData={analyticsData || []} 
            recentResults={recentResults || []} 
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendsChart analyticsData={analyticsData || []} />
        </TabsContent>

        <TabsContent value="ai-detection" className="space-y-4">
          <AIDetectionStats 
            analyticsData={analyticsData || []} 
            recentResults={recentResults || []} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
