
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsData {
  id: string;
  month: string;
  year: number;
  ai_detection_rate: number | null;
  total_interviews: number | null;
}

interface InterviewResult {
  id: string;
  ai_detected: boolean | null;
  completed_at: string;
  overall_score: number | null;
  candidate_id: string | null;
}

interface AIDetectionStatsProps {
  analyticsData: AnalyticsData[];
  recentResults: InterviewResult[];
}

export const AIDetectionStats = ({ analyticsData, recentResults }: AIDetectionStatsProps) => {
  // Calculate AI detection metrics
  const totalInterviews = recentResults.length;
  const aiDetectedCount = recentResults.filter(result => result.ai_detected).length;
  const aiDetectionRate = totalInterviews > 0 ? (aiDetectedCount / totalInterviews) * 100 : 0;
  
  // Calculate trend from analytics data
  const latestMonth = analyticsData[0];
  const previousMonth = analyticsData[1];
  
  const detectionTrend = latestMonth && previousMonth
    ? (latestMonth.ai_detection_rate || 0) - (previousMonth.ai_detection_rate || 0)
    : 0;

  // Get recent AI detections with details
  const recentAIDetections = recentResults
    .filter(result => result.ai_detected)
    .slice(0, 10)
    .map(result => ({
      ...result,
      date: new Date(result.completed_at).toLocaleDateString()
    }));

  // Calculate impact on scores
  const aiDetectedResults = recentResults.filter(result => result.ai_detected);
  const cleanResults = recentResults.filter(result => !result.ai_detected);
  
  const avgScoreAI = aiDetectedResults.length > 0
    ? aiDetectedResults.reduce((sum, result) => sum + (result.overall_score || 0), 0) / aiDetectedResults.length
    : 0;
    
  const avgScoreClean = cleanResults.length > 0
    ? cleanResults.reduce((sum, result) => sum + (result.overall_score || 0), 0) / cleanResults.length
    : 0;

  return (
    <div className="space-y-4">
      {aiDetectionRate > 15 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High AI detection rate detected ({aiDetectionRate.toFixed(1)}%). 
            Consider reviewing your assessment security measures.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Detection Rate</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiDetectionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {detectionTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-red-600" />
              ) : detectionTrend < 0 ? (
                <TrendingDown className="h-3 w-3 text-green-600" />
              ) : null}
              <span>
                {detectionTrend > 0 ? '+' : ''}{detectionTrend.toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiDetectedCount}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalInterviews} interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean Interviews</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews - aiDetectedCount}</div>
            <p className="text-xs text-muted-foreground">
              No AI assistance detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Impact</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(avgScoreClean - avgScoreAI).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Higher score without AI
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detection Trend</CardTitle>
            <CardDescription>AI detection rate over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsData.slice(0, 6).map((data) => (
              <div key={data.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{data.month} {data.year}</span>
                  <span>{data.ai_detection_rate?.toFixed(1) || '0.0'}%</span>
                </div>
                <Progress value={data.ai_detection_rate || 0} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent AI Detections</CardTitle>
            <CardDescription>Latest flagged interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAIDetections.length > 0 ? (
                recentAIDetections.map((detection, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{detection.date}</span>
                    <div className="flex items-center gap-2">
                      <span>{detection.overall_score?.toFixed(1) || '0'}%</span>
                      <Badge variant="destructive" className="text-xs">
                        AI Detected
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent AI detections</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Comparison</CardTitle>
          <CardDescription>Performance comparison between clean and AI-detected interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clean Interviews Average</span>
                <span className="font-medium">{avgScoreClean.toFixed(1)}%</span>
              </div>
              <Progress value={avgScoreClean} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {cleanResults.length} interviews without AI detection
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI-Detected Average</span>
                <span className="font-medium">{avgScoreAI.toFixed(1)}%</span>
              </div>
              <Progress value={avgScoreAI} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {aiDetectedResults.length} interviews with AI detection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
