
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  id: string;
  month: string;
  year: number;
  avg_score: number | null;
  pass_rate: number | null;
  ai_detection_rate: number | null;
  total_interviews: number | null;
}

interface TrendsChartProps {
  analyticsData: AnalyticsData[];
}

export const TrendsChart = ({ analyticsData }: TrendsChartProps) => {
  // Prepare data for charts (reverse to show chronological order)
  const chartData = analyticsData
    .slice()
    .reverse()
    .map(data => ({
      period: `${data.month.slice(0, 3)} ${data.year}`,
      avgScore: data.avg_score || 0,
      passRate: data.pass_rate || 0,
      aiDetectionRate: data.ai_detection_rate || 0,
      totalInterviews: data.total_interviews || 0
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Average scores and pass rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Average Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="passRate" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Pass Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interview Volume</CardTitle>
            <CardDescription>Number of interviews conducted each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Interviews']}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Bar dataKey="totalInterviews" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Detection Trend</CardTitle>
            <CardDescription>AI detection rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="aiDetectionRate" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    name="AI Detection Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
