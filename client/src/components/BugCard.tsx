import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bug, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BugCardProps {
  bug: {
    id: string;
    title: string;
    description?: string;
    priority: string;
    status: string;
    projectId?: string;
    reporterId?: string;
    assigneeId?: string;
    aiAnalysis?: any;
    createdAt: string;
    updatedAt: string;
  };
  detailed?: boolean;
}

export default function BugCard({ bug, detailed = false }: BugCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "bg-red-500";
      case "in_progress": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical": return <AlertTriangle className="w-4 h-4 text-white" />;
      case "high": return <AlertTriangle className="w-4 h-4 text-white" />;
      case "medium": return <Clock className="w-4 h-4 text-white" />;
      case "low": return <CheckCircle className="w-4 h-4 text-white" />;
      default: return <Bug className="w-4 h-4 text-white" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return <AlertTriangle className="w-4 h-4 text-white" />;
      case "in_progress": return <Clock className="w-4 h-4 text-white" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-white" />;
      case "closed": return <CheckCircle className="w-4 h-4 text-white" />;
      default: return <Bug className="w-4 h-4 text-white" />;
    }
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

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="glass-card border-gold-500/20 hover:shadow-xl transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getPriorityColor(bug.priority)} flex items-center justify-center`}>
              {getPriorityIcon(bug.priority)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-100 group-hover:text-gold-400 transition-colors truncate">
                {bug.title}
              </h3>
              <p className="text-sm text-gray-400">
                {formatStatus(bug.priority)} Priority • Bug #{bug.id.slice(-6)}
              </p>
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
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-charcoal-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Bug
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:bg-red-600 hover:text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {bug.description && detailed && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {bug.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(bug.status)} text-white text-xs flex items-center space-x-1`}>
              {getStatusIcon(bug.status)}
              <span>{formatStatus(bug.status)}</span>
            </Badge>
            <Badge className={`${getPriorityColor(bug.priority)} text-white text-xs capitalize`}>
              {bug.priority}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(bug.createdAt)}</span>
          </div>
        </div>

        {detailed && bug.aiAnalysis && (
          <div className="bg-charcoal-700 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-gradient-to-br from-gold-500 to-gold-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-charcoal-900 font-bold">AI</span>
              </div>
              <span className="text-xs font-medium text-gold-400">AI Analysis</span>
            </div>
            <p className="text-xs text-gray-300">
              Category: {bug.aiAnalysis.category} • 
              Confidence: {Math.round((bug.aiAnalysis.confidence || 0) * 100)}%
            </p>
            {bug.aiAnalysis.suggestedFixes && bug.aiAnalysis.suggestedFixes.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Suggested fix: {bug.aiAnalysis.suggestedFixes[0]}
              </p>
            )}
          </div>
        )}

        {detailed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Reporter: You</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700">
                View
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-medium">
                Update
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
