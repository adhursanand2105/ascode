import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Lightbulb, 
  Code, 
  Shield, 
  TrendingUp,
  Brain,
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function AIAnalysis() {
  const codeQualityData = [
    { name: "E-Commerce App", score: 92, trend: "up" },
    { name: "Game Engine", score: 78, trend: "down" },
    { name: "Analytics Dashboard", score: 85, trend: "up" },
  ];

  const suggestions = [
    {
      id: 1,
      type: "performance",
      title: "Optimize RecyclerView performance",
      description: "E-Commerce App • MainActivity.kt",
      impact: "high",
      icon: TrendingUp,
      color: "from-gold-500 to-gold-400",
    },
    {
      id: 2,
      type: "code_quality",
      title: "Refactor duplicate code blocks",
      description: "Game Engine • GameLoop.java",
      impact: "medium",
      icon: Code,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      type: "security",
      title: "Add null safety checks",
      description: "Analytics Dashboard • DataProcessor.kt",
      impact: "high",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-3 h-3 text-green-400" />
    ) : (
      <AlertTriangle className="w-3 h-3 text-red-400" />
    );
  };

  return (
    <Card className="glass-card border-gold-500/20 mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-100 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-gold-500" />
            <span>AI Code Analysis</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">AI Active</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code Quality Scores */}
          <div>
            <h3 className="font-medium text-gray-100 mb-4 flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Code Quality Scores</span>
            </h3>
            <div className="space-y-4">
              {codeQualityData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(item.trend)}
                      <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={item.score} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Suggestions */}
          <div>
            <h3 className="font-medium text-gray-100 mb-4 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-gold-500" />
              <span>AI Suggestions</span>
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-start space-x-3 p-3 bg-charcoal-700 rounded-lg hover:bg-charcoal-600 transition-colors cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                    <suggestion.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-100 group-hover:text-gold-400 transition-colors">
                        {suggestion.title}
                      </p>
                      <Badge className={`${getImpactColor(suggestion.impact)} text-white text-xs capitalize`}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{suggestion.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-charcoal-600 text-gray-300 hover:bg-charcoal-700"
            >
              View All Suggestions
            </Button>
          </div>
        </div>

        {/* AI Insights Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gold-500/10 to-gold-400/10 border border-gold-500/20 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-400 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-charcoal-900" />
            </div>
            <div>
              <h3 className="font-semibold text-gold-400">Weekly AI Insights</h3>
              <p className="text-sm text-gray-400">Your code quality has improved by 12% this week</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-400">24</div>
              <div className="text-xs text-gray-400">Issues Fixed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400">15</div>
              <div className="text-xs text-gray-400">Optimizations</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-400">8</div>
              <div className="text-xs text-gray-400">Best Practices</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
