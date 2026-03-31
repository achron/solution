import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendsChart = memo(({ trends }) => {
  const chartData = trends.map(t => ({
    date: format(new Date(t.date), 'MMM dd'),
    confidence: t.confidence || 0,
    accuracy: t.accuracy || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Health Trends</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="confidence" stroke="#8884d8" name="Confidence %" />
            <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

TrendsChart.displayName = 'TrendsChart';

export default TrendsChart;
