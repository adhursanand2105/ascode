import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import BugCard from "@/components/BugCard";
import { Plus, Search, Filter, Bug, AlertTriangle, CheckCircle } from "lucide-react";

export default function BugTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBug, setNewBug] = useState({
    title: "",
    description: "",
    priority: "medium",
    projectId: "",
    stackTrace: "",
    reproductionSteps: "",
  });

  const { data: bugs, isLoading } = useQuery({
    queryKey: ["/api/bugs"],
    retry: false,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const createBugMutation = useMutation({
    mutationFn: async (bugData: any) => {
      await apiRequest('/api/bugs', 'POST', bugData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bugs"] });
      toast({
        title: "Success",
        description: "Bug reported successfully! AI analysis is being processed.",
      });
      setIsCreateDialogOpen(false);
      setNewBug({
        title: "",
        description: "",
        priority: "medium",
        projectId: "",
        stackTrace: "",
        reproductionSteps: "",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to report bug. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateBug = () => {
    if (!newBug.title || !newBug.description || !newBug.projectId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createBugMutation.mutate(newBug);
  };

  const filteredBugs = bugs?.filter((bug: any) => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || bug.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || bug.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const stats = {
    total: bugs?.length || 0,
    open: bugs?.filter((bug: any) => bug.status === "open").length || 0,
    inProgress: bugs?.filter((bug: any) => bug.status === "in_progress").length || 0,
    resolved: bugs?.filter((bug: any) => bug.status === "resolved").length || 0,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-500";
      case "in_progress": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Bug Tracker</h2>
          <p className="text-gray-400">Track and manage project bugs with AI-powered analysis</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Report Bug
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-charcoal-800 border-charcoal-600 text-gray-100 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gold-500">Report New Bug</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="title" className="text-gray-300">Bug Title *</Label>
                <Input
                  id="title"
                  value={newBug.title}
                  onChange={(e) => setNewBug(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="Brief description of the bug"
                />
              </div>
              <div>
                <Label htmlFor="project" className="text-gray-300">Project *</Label>
                <Select value={newBug.projectId} onValueChange={(value) => setNewBug(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-700 border-charcoal-600">
                    {projects?.map((project: any) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                <Select value={newBug.priority} onValueChange={(value) => setNewBug(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-700 border-charcoal-600">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea
                  id="description"
                  value={newBug.description}
                  onChange={(e) => setNewBug(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="Detailed description of the bug..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="reproductionSteps" className="text-gray-300">Reproduction Steps</Label>
                <Textarea
                  id="reproductionSteps"
                  value={newBug.reproductionSteps}
                  onChange={(e) => setNewBug(prev => ({ ...prev, reproductionSteps: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="stackTrace" className="text-gray-300">Stack Trace</Label>
                <Textarea
                  id="stackTrace"
                  value={newBug.stackTrace}
                  onChange={(e) => setNewBug(prev => ({ ...prev, stackTrace: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100 font-mono text-sm"
                  placeholder="Paste stack trace here..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBug}
                  disabled={createBugMutation.isPending}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
                >
                  {createBugMutation.isPending ? "Reporting..." : "Report Bug"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bugs</p>
                <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
              </div>
              <Bug className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open</p>
                <p className="text-2xl font-bold text-red-400">{stats.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search bugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-charcoal-800 border-charcoal-600 text-gray-100"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40 bg-charcoal-800 border-charcoal-600 text-gray-100">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-charcoal-700 border-charcoal-600">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-charcoal-800 border-charcoal-600 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-charcoal-700 border-charcoal-600">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bugs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="glass-card border-gold-500/20 h-24 animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-charcoal-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-charcoal-700 rounded w-3/4"></div>
                    <div className="h-3 bg-charcoal-700 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBugs?.length ? (
        <div className="space-y-4">
          {filteredBugs.map((bug: any) => (
            <BugCard key={bug.id} bug={bug} detailed />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bug className="w-24 h-24 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            {searchTerm || filterPriority !== "all" || filterStatus !== "all" ? "No bugs found" : "No bugs reported"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterPriority !== "all" || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Great job! No bugs have been reported yet."
            }
          </p>
          {!searchTerm && filterPriority === "all" && filterStatus === "all" && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Report First Bug
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
