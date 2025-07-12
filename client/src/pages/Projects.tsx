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
import ProjectCard from "@/components/ProjectCard";
import { Plus, Search, Filter, FolderOpen } from "lucide-react";

export default function Projects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    language: "",
    repository: "",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      await apiRequest('/api/projects', 'POST', projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      setIsCreateDialogOpen(false);
      setNewProject({ name: "", description: "", language: "", repository: "" });
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
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.language) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate(newProject);
  };

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Projects</h2>
          <p className="text-gray-400">Manage your development projects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-charcoal-800 border-charcoal-600 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gold-500">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Project Name *</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="My Awesome App"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="Brief description of your project..."
                />
              </div>
              <div>
                <Label htmlFor="language" className="text-gray-300">Primary Language *</Label>
                <Select value={newProject.language} onValueChange={(value) => setNewProject(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-700 border-charcoal-600">
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="dart">Dart</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="repository" className="text-gray-300">Repository URL</Label>
                <Input
                  id="repository"
                  value={newProject.repository}
                  onChange={(e) => setNewProject(prev => ({ ...prev, repository: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="https://github.com/username/repo"
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
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-charcoal-800 border-charcoal-600 text-gray-100"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-charcoal-800 border-charcoal-600 text-gray-100">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-charcoal-700 border-charcoal-600">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass-card border-gold-500/20 h-48 animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-charcoal-700 rounded w-3/4"></div>
                  <div className="h-3 bg-charcoal-700 rounded w-1/2"></div>
                  <div className="h-20 bg-charcoal-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} detailed />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FolderOpen className="w-24 h-24 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            {searchTerm || filterStatus !== "all" ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first project to get started with AndroidIDE"
            }
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
