import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import ProjectCard from "@/components/ProjectCard";
import BugCard from "@/components/BugCard";
import AIAnalysis from "@/components/AIAnalysis";
import TeamActivity from "@/components/TeamActivity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  FolderOpen, 
  Bug, 
  Clock, 
  Users, 
  Plus,
  ArrowUp,
  Bell
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState(3);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: bugs, isLoading: bugsLoading } = useQuery({
    queryKey: ["/api/bugs"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
          <p className="text-gray-400">
            Welcome back, {user?.firstName || 'Developer'}! Ready to code?
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400 hover:text-gold-500 cursor-pointer" />
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </div>
          <Button className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Projects"
          value={stats?.projectCount || 0}
          icon={FolderOpen}
          gradient="from-blue-500 to-blue-600"
          change="+2 this week"
          loading={statsLoading}
        />
        <StatsCard
          title="Bugs Fixed"
          value={stats?.resolvedBugs || 0}
          icon={Bug}
          gradient="from-red-500 to-red-600"
          change="+8 today"
          loading={statsLoading}
        />
        <StatsCard
          title="Hours Coded"
          value={156}
          icon={Clock}
          gradient="from-green-500 to-green-600"
          change="+12 this week"
          loading={false}
        />
        <StatsCard
          title="Team Members"
          value={stats?.teamMemberCount || 0}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          change="+1 this month"
          loading={statsLoading}
        />
      </div>

      {/* Recent Projects & Bug Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Projects */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-100">Recent Projects</CardTitle>
              <Button variant="ghost" className="text-gold-500 hover:text-gold-400 text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-charcoal-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : projects?.length ? (
                projects.slice(0, 3).map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No projects yet. Create your first project to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bug Tracker */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-100">Bug Tracker</CardTitle>
              <Button variant="ghost" className="text-gold-500 hover:text-gold-400 text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bugsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-charcoal-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : bugs?.length ? (
                bugs.slice(0, 3).map((bug: any) => (
                  <BugCard key={bug.id} bug={bug} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Bug className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No bugs reported yet. Great job!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      <AIAnalysis />

      {/* Team Activity */}
      <TeamActivity activities={activities} loading={activitiesLoading} />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
