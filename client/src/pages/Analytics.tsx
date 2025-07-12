import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Target, Clock, Users } from "lucide-react";
import { useState } from "react";

const COLORS = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const { data: bugs } = useQuery({
    queryKey: ["/api/bugs"],
    retry: false,
  });

  // Mock data for charts - in a real app, this would come from the API
  const bugTrendData = [
    { name: 'Mon', bugs: 12, resolved: 8 },
    { name: 'Tue', bugs: 19, resolved: 15 },
    { name: 'Wed', bugs: 8, resolved: 12 },
    { name: 'Thu', bugs: 15, resolved: 10 },
    { name: 'Fri', bugs: 22, resolved: 18 },
    { name: 'Sat', bugs: 7, resolved: 5 },
    { name: 'Sun', bugs: 9, resolved: 7 },
  ];

  const projectLanguageData = [
    { name: 'Kotlin', value: 45 },
    { name: 'Java', value: 30 },
    { name: 'Dart', value: 15 },
    { name: 'JavaScript', value: 7 },
    { name: 'TypeScript', value: 3 },
  ];

  const codeQualityData = [
    { name: 'E-Commerce App', score: 92 },
    { name: 'Game Engine', score: 78 },
    { name: 'Analytics Dashboard', score: 85 },
    { name: 'Social Media App', score: 88 },
    { name: 'Weather App', score: 95 },
  ];

  const bugPriorityData = [
    { name: 'Critical', value: 5, color: '#FF6B6B' },
    { name: 'High', value: 12, color: '#FFA500' },
    { name: 'Medium', value: 28, color: '#FFD700' },
    { name: 'Low', value: 15, color: '#4ECDC4' },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Analytics</h2>
          <p className="text-gray-400">Track your development metrics and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 bg-charcoal-800 border-charcoal-600 text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-charcoal-700 border-charcoal-600">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-gray-100">{stats?.projectCount || 0}</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Code Quality</p>
                <p className="text-2xl font-bold text-gray-100">87%</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+3%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg. Resolution Time</p>
                <p className="text-2xl font-bold text-gray-100">2.3h</p>
                <div className="flex items-center text-red-400 text-sm mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  <span>-15%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Team Productivity</p>
                <p className="text-2xl font-bold text-gray-100">94%</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bug Trend Chart */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-100">Bug Resolution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bugTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C2C2C',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line type="monotone" dataKey="bugs" stroke="#FF6B6B" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#4ECDC4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Languages */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-100">Project Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectLanguageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectLanguageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C2C2C',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Code Quality Scores */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-100">Code Quality Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={codeQualityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C2C2C',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="score" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bug Priority Distribution */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-100">Bug Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bugPriorityData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-100">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-charcoal-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.value / 60) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-gray-100 font-medium w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-100">AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-100">Performance Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-charcoal-700 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-charcoal-900">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">Optimize RecyclerView performance in E-Commerce App</p>
                    <p className="text-xs text-gray-400">Potential 15% performance improvement</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-charcoal-700 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">Reduce memory usage in Game Engine</p>
                    <p className="text-xs text-gray-400">Could prevent potential OOM crashes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-charcoal-700 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">Implement caching for Analytics Dashboard</p>
                    <p className="text-xs text-gray-400">Reduce API calls by 40%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-100">Code Quality Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-charcoal-700 rounded-lg">
                  <span className="text-sm text-gray-100">Maintainability</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-charcoal-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm text-green-400">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-charcoal-700 rounded-lg">
                  <span className="text-sm text-gray-100">Testability</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-charcoal-600 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <span className="text-sm text-yellow-400">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-charcoal-700 rounded-lg">
                  <span className="text-sm text-gray-100">Documentation</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-charcoal-600 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-sm text-red-400">45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
