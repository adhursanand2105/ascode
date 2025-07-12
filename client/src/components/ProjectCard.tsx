import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  Calendar, 
  GitBranch, 
  Circle,
  MoreVertical,
  ExternalLink,
  Settings,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    language: string;
    status: string;
    repository?: string;
    lastBuild?: string;
    createdAt: string;
    updatedAt: string;
  };
  detailed?: boolean;
}

export default function ProjectCard({ project, detailed = false }: ProjectCardProps) {
  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "kotlin": return "bg-purple-500";
      case "java": return "bg-orange-500";
      case "javascript": return "bg-yellow-500";
      case "typescript": return "bg-blue-500";
      case "dart": return "bg-cyan-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-yellow-500";
      case "archived": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusIcon = (status: string) => {
    return <Circle className="w-3 h-3 animate-pulse" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="glass-card border-gold-500/20 hover:shadow-xl transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getLanguageColor(project.language)} flex items-center justify-center`}>
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 group-hover:text-gold-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">{project.language}</p>
            </div>
          </div>
          
          {detailed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-charcoal-700 border-charcoal-600">
                <DropdownMenuItem className="text-gray-300 hover:bg-charcoal-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Project
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-charcoal-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:bg-red-600 hover:text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {project.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(project.status)}
            <Badge className={`${getStatusColor(project.status)} text-white text-xs capitalize`}>
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
        </div>

        {detailed && project.repository && (
          <div className="flex items-center space-x-2 mb-4 text-xs text-gray-400">
            <GitBranch className="w-3 h-3" />
            <span className="truncate">{project.repository}</span>
          </div>
        )}

        {detailed && (
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-medium">
              Open
            </Button>
            <Button size="sm" variant="outline" className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700">
              Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
