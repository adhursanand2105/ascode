import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GitCommit, 
  Bug, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Code,
  MessageSquare,
  Calendar
} from "lucide-react";

interface TeamActivityProps {
  activities?: any[];
  loading?: boolean;
}

export default function TeamActivity({ activities, loading }: TeamActivityProps) {
  // Mock data for display when no activities are provided
  const mockActivities = [
    {
      id: "1",
      user: { firstName: "Jane", lastName: "Smith", profileImageUrl: null },
      action: "push_commits",
      description: "pushed 3 commits to e-commerce-app",
      projectName: "E-Commerce App",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      metadata: { commitCount: 3 }
    },
    {
      id: "2",
      user: { firstName: "Mike", lastName: "Johnson", profileImageUrl: null },
      action: "bug_resolved",
      description: "resolved bug #247 in game-engine",
      projectName: "Game Engine",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      metadata: { bugId: "247" }
    },
    {
      id: "3",
      user: { firstName: "Alex", lastName: "Lee", profileImageUrl: null },
      action: "pull_request",
      description: "created pull request for analytics-dashboard",
      projectName: "Analytics Dashboard",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      metadata: { prNumber: 42 }
    },
    {
      id: "4",
      user: { firstName: "Sarah", lastName: "Wilson", profileImageUrl: null },
      action: "code_review",
      description: "reviewed code changes in social-media-app",
      projectName: "Social Media App",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      metadata: { filesReviewed: 5 }
    },
    {
      id: "5",
      user: { firstName: "David", lastName: "Brown", profileImageUrl: null },
      action: "project_created",
      description: "created new project weather-app",
      projectName: "Weather App",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      metadata: {}
    },
  ];

  const displayActivities = activities || mockActivities;

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "push_commits":
      case "git_push":
        return <GitCommit className="w-4 h-4 text-blue-400" />;
      case "bug_resolved":
      case "bug_fixed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "bug_reported":
        return <Bug className="w-4 h-4 text-red-400" />;
      case "pull_request":
      case "code_review":
        return <Code className="w-4 h-4 text-purple-400" />;
      case "project_created":
        return <Plus className="w-4 h-4 text-gold-500" />;
      case "comment_added":
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case "push_commits":
      case "git_push":
        return "from-blue-500 to-blue-600";
      case "bug_resolved":
      case "bug_fixed":
        return "from-green-500 to-green-600";
      case "bug_reported":
        return "from-red-500 to-red-600";
      case "pull_request":
      case "code_review":
        return "from-purple-500 to-purple-600";
      case "project_created":
        return "from-gold-500 to-gold-400";
      case "comment_added":
        return "from-cyan-500 to-cyan-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  if (loading) {
    return (
      <Card className="glass-card border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-100">Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-charcoal-700 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-charcoal-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-charcoal-600 rounded w-3/4"></div>
                  <div className="h-3 bg-charcoal-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gold-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Team Activity</span>
          </CardTitle>
          <Button variant="ghost" className="text-gold-500 hover:text-gold-400 text-sm">
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-4 bg-charcoal-700 rounded-xl hover:bg-charcoal-600 transition-colors group"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.user?.profileImageUrl} />
                    <AvatarFallback className={`bg-gradient-to-br ${getActivityColor(activity.action)} text-white text-sm`}>
                      {getInitials(activity.user?.firstName, activity.user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${getActivityColor(activity.action)} rounded-full flex items-center justify-center border-2 border-charcoal-700`}>
                    {getActivityIcon(activity.action)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-100 group-hover:text-gold-400 transition-colors">
                    <span className="font-medium">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </span>{" "}
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {activity.projectName && (
                      <Badge className="bg-charcoal-600 text-gold-400 text-xs">
                        {activity.projectName}
                      </Badge>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimeAgo(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No team activity yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
