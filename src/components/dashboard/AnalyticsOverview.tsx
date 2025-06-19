
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AnalyticsData {
  id: string;
  month: string;
  year: number;
  avg_score: number | null;
  pass_rate: number | null;
  ai_detection_rate: number | null;
  total_interviews: number | null;
}

interface InterviewResult {
  id: string;
  overall_score: number | null;
  ai_detected: boolean | null;
  completed_at: string;
  overall_level: string | null;
}

interface AnalyticsOverviewProps {
  analyticsData: AnalyticsData[];
  recentResults: InterviewResult[];
}

export const AnalyticsOverview = ({ analyticsData, recentResults }: AnalyticsOverviewProps) => {
  // Calculate current metrics from recent data
  const totalInterviews = recentResults.length;
  const avgScore = recentResults.length > 0 
    ? recentResults.reduce((sum, result) => sum + (result.overall_score || 0), 0) / recentResults.length
    : 0;
  const passRate = recentResults.length > 0
    ? (recentResults.filter(result => (result.overall_score || 0) >= 70).length / recentResults.length) * 100
    : 0;
  const aiDetectionRate = recentResults.length > 0
    ? (recentResults.filter(result => result.ai_detected).length / recentResults.length) * 100
    : 0;

  // Get trend indicators from analytics data
  const getTrendIndicator = (current: number, previous: number) => {
    if (current > previous) return { icon: TrendingUp, color: 'text-green-600', direction: 'up' };
    if (current < previous) return { icon: TrendingDown, color: 'text-red-600', direction: 'down' };
    return { icon: TrendingUp, color: 'text-gray-600', direction: 'stable' };
  };

  const latestMonth = analyticsData[0];
  const previousMonth = analyticsData[1];

  const scoreTrend = latestMonth && previousMonth 
    ? getTrendIndicator(latestMonth.avg_score || 0, previousMonth.avg_score || 0)
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInterviews}</div>
          <p className="text-xs text-muted-foreground">
            Recent activity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          {scoreTrend && (
            <scoreTrend.icon className={`h-4 w-4 ${scoreTrend.color}`} />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgScore.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Across all recent interviews
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Score ≥ 70%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Detection Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiDetectionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Flagged responses
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Interview Summary</CardTitle>
          <CardDescription>Performance breakdown by level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Level 1', 'Level 2', 'Level 3'].map(level => {
              const count = recentResults.filter(result => result.overall_level === level).length;
              const percentage = totalInterviews > 0 ? (count / totalInterviews) * 100 : 0;
              
              return (
                <Badge key={level} variant="outline" className="text-sm">
                  {level}: {count} ({percentage.toFixed(1)}%)
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
