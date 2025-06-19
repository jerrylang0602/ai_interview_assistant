
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
  technical_accuracy: number | null;
  problem_solving: number | null;
  communication: number | null;
  documentation: number | null;
  ai_detected: boolean | null;
  completed_at: string;
  overall_level: string | null;
}

interface InterviewMetricsProps {
  analyticsData: AnalyticsData[];
  recentResults: InterviewResult[];
}

export const InterviewMetrics = ({ analyticsData, recentResults }: InterviewMetricsProps) => {
  // Calculate detailed metrics from recent results
  const calculateAverage = (field: keyof InterviewResult) => {
    const validResults = recentResults.filter(result => 
      typeof result[field] === 'number' && result[field] !== null
    );
    
    if (validResults.length === 0) return 0;
    
    return validResults.reduce((sum, result) => 
      sum + (result[field] as number), 0) / validResults.length;
  };

  const avgTechnicalAccuracy = calculateAverage('technical_accuracy');
  const avgProblemSolving = calculateAverage('problem_solving');
  const avgCommunication = calculateAverage('communication');
  const avgDocumentation = calculateAverage('documentation');

  // Score distribution
  const scoreRanges = [
    { label: '90-100%', min: 90, max: 100, color: 'bg-green-500' },
    { label: '80-89%', min: 80, max: 89, color: 'bg-blue-500' },
    { label: '70-79%', min: 70, max: 79, color: 'bg-yellow-500' },
    { label: '60-69%', min: 60, max: 69, color: 'bg-orange-500' },
    { label: 'Below 60%', min: 0, max: 59, color: 'bg-red-500' }
  ];

  const getScoreDistribution = () => {
    return scoreRanges.map(range => {
      const count = recentResults.filter(result => {
        const score = result.overall_score || 0;
        return score >= range.min && score <= range.max;
      }).length;
      
      const percentage = recentResults.length > 0 ? (count / recentResults.length) * 100 : 0;
      
      return {
        ...range,
        count,
        percentage
      };
    });
  };

  const distribution = getScoreDistribution();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Performance Metrics Breakdown</CardTitle>
          <CardDescription>Average scores across all evaluation criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Technical Accuracy</span>
                <span>{avgTechnicalAccuracy.toFixed(1)}%</span>
              </div>
              <Progress value={avgTechnicalAccuracy} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Problem Solving</span>
                <span>{avgProblemSolving.toFixed(1)}%</span>
              </div>
              <Progress value={avgProblemSolving} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Communication</span>
                <span>{avgCommunication.toFixed(1)}%</span>
              </div>
              <Progress value={avgCommunication} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Documentation</span>
                <span>{avgDocumentation.toFixed(1)}%</span>
              </div>
              <Progress value={avgDocumentation} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Breakdown of candidate performance ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {distribution.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${range.color}`}></div>
                  <span className="text-sm font-medium">{range.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {range.count} candidates
                  </span>
                  <Badge variant="outline">
                    {range.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Analytics</CardTitle>
          <CardDescription>Historical performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.slice(0, 6).map((data, index) => (
              <div key={data.id} className="flex justify-between items-center text-sm">
                <span>{data.month} {data.year}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {data.avg_score?.toFixed(1) || '0.0'}%
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {data.total_interviews || 0} interviews
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
