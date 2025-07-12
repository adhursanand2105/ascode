import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Search, Users, Crown, Shield, Code, Mail, Calendar } from "lucide-react";

export default function Team() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "developer",
    projectId: "",
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["/api/teams", selectedProject],
    enabled: selectedProject !== "all",
    retry: false,
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (memberData: any) => {
      await apiRequest('/api/teams', 'POST', memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Success",
        description: "Team member invited successfully!",
      });
      setIsInviteDialogOpen(false);
      setInviteData({ email: "", role: "developer", projectId: "" });
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
        description: "Failed to invite team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInviteMember = () => {
    if (!inviteData.email || !inviteData.projectId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    inviteMemberMutation.mutate(inviteData);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="w-4 h-4 text-gold-500" />;
      case "lead": return <Shield className="w-4 h-4 text-blue-400" />;
      case "developer": return <Code className="w-4 h-4 text-green-400" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-gold-500 text-charcoal-900";
      case "lead": return "bg-blue-500 text-white";
      case "developer": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Mock team data for display
  const mockTeamMembers = [
    {
      id: "1",
      user: {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        profileImageUrl: null,
      },
      role: "admin",
      joinedAt: new Date().toISOString(),
    },
    {
      id: "2",
      user: {
        id: "2",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        profileImageUrl: null,
      },
      role: "lead",
      joinedAt: new Date().toISOString(),
    },
    {
      id: "3",
      user: {
        id: "3",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@example.com",
        profileImageUrl: null,
      },
      role: "developer",
      joinedAt: new Date().toISOString(),
    },
    {
      id: "4",
      user: {
        id: "4",
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@example.com",
        profileImageUrl: null,
      },
      role: "developer",
      joinedAt: new Date().toISOString(),
    },
  ];

  const displayMembers = teamMembers || mockTeamMembers;

  const filteredMembers = displayMembers?.filter((member: any) => {
    const memberName = `${member.user?.firstName} ${member.user?.lastName}`.toLowerCase();
    const memberEmail = member.user?.email?.toLowerCase() || "";
    return memberName.includes(searchTerm.toLowerCase()) || memberEmail.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Team Management</h2>
          <p className="text-gray-400">Manage your team members and their roles</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-charcoal-800 border-charcoal-600 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gold-500">Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  placeholder="colleague@example.com"
                />
              </div>
              <div>
                <Label htmlFor="project" className="text-gray-300">Project *</Label>
                <Select value={inviteData.projectId} onValueChange={(value) => setInviteData(prev => ({ ...prev, projectId: value }))}>
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
                <Label htmlFor="role" className="text-gray-300">Role</Label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-700 border-charcoal-600">
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="lead">Team Lead</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                  className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteMember}
                  disabled={inviteMemberMutation.isPending}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
                >
                  {inviteMemberMutation.isPending ? "Inviting..." : "Send Invite"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-charcoal-800 border-charcoal-600 text-gray-100"
          />
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48 bg-charcoal-800 border-charcoal-600 text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-charcoal-700 border-charcoal-600">
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-gray-100">{displayMembers?.length || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-gray-100">
                  {displayMembers?.filter((m: any) => m.role === "admin").length || 0}
                </p>
              </div>
              <Crown className="w-8 h-8 text-gold-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Team Leads</p>
                <p className="text-2xl font-bold text-gray-100">
                  {displayMembers?.filter((m: any) => m.role === "lead").length || 0}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Developers</p>
                <p className="text-2xl font-bold text-gray-100">
                  {displayMembers?.filter((m: any) => m.role === "developer").length || 0}
                </p>
              </div>
              <Code className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-gold-500/20 h-20 animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-charcoal-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-charcoal-700 rounded w-1/3"></div>
                    <div className="h-3 bg-charcoal-700 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers?.length ? (
        <div className="space-y-4">
          {filteredMembers.map((member: any) => (
            <Card key={member.id} className="glass-card border-gold-500/20 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.user?.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-gold-500 to-gold-400 text-charcoal-900">
                        {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-100">
                          {member.user?.firstName} {member.user?.lastName}
                        </h3>
                        {getRoleIcon(member.role)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-400">{member.user?.email}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getRoleBadgeColor(member.role)} capitalize`}>
                      {member.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-100"
                    >
                      Edit Role
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-24 h-24 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            {searchTerm ? "No members found" : "No team members"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Invite your first team member to get started"
            }
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsInviteDialogOpen(true)}
              className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Invite First Member
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
