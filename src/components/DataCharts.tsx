import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface DataChartsProps {
  data: Record<string, any>[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const DataCharts = ({ data }: DataChartsProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data to visualize. Upload a file to generate charts.
          </p>
        </CardContent>
      </Card>
    );
  }

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => 
    data.some(row => !isNaN(Number(row[col])) && row[col] !== "")
  );
  const stringColumns = columns.filter(col => 
    !numericColumns.includes(col)
  );

  // Prepare data for charts
  const chartData = data.slice(0, 20).map((row, index) => ({
    index: index + 1,
    ...row,
  }));

  // For pie chart, aggregate categorical data
  const pieData = stringColumns.length > 0 && numericColumns.length > 0 
    ? Object.entries(
        data.reduce((acc, row) => {
          const category = String(row[stringColumns[0]]);
          const value = Number(row[numericColumns[0]]) || 0;
          acc[category] = (acc[category] || 0) + value;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Data Visualization</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {numericColumns.length} numeric column{numericColumns.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary">
              {stringColumns.length} categorical column{stringColumns.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {numericColumns.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No numeric data found for visualization.
          </p>
        ) : (
          <Tabs defaultValue="bar" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="pie" disabled={pieData.length === 0}>Pie Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={stringColumns[0] || "index"} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    {numericColumns.slice(0, 3).map((column, index) => (
                      <Bar
                        key={column}
                        dataKey={column}
                        fill={COLORS[index % COLORS.length]}
                        name={column}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="line" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={stringColumns[0] || "index"} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    {numericColumns.slice(0, 3).map((column, index) => (
                      <Line
                        key={column}
                        type="monotone"
                        dataKey={column}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        name={column}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="pie" className="space-y-4">
              {pieData.length > 0 && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};