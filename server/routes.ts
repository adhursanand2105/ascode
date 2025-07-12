import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeBug, analyzeCode, generateCodeSuggestions } from "./ai";
import { insertProjectSchema, insertBugSchema, insertCodeAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      
      const project = await storage.createProject(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId: project.id,
        action: 'project_created',
        description: `Created project "${project.name}"`,
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      const project = await storage.updateProject(req.params.id, validatedData);
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId: project.id,
        action: 'project_updated',
        description: `Updated project "${project.name}"`,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteProject(req.params.id);
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId: req.params.id,
        action: 'project_deleted',
        description: `Deleted project`,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Bug routes
  app.get('/api/bugs', isAuthenticated, async (req: any, res) => {
    try {
      const { projectId } = req.query;
      const bugs = await storage.getBugs(projectId);
      res.json(bugs);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      res.status(500).json({ message: "Failed to fetch bugs" });
    }
  });

  app.get('/api/bugs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const bug = await storage.getBug(req.params.id);
      if (!bug) {
        return res.status(404).json({ message: "Bug not found" });
      }
      res.json(bug);
    } catch (error) {
      console.error("Error fetching bug:", error);
      res.status(500).json({ message: "Failed to fetch bug" });
    }
  });

  app.post('/api/bugs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBugSchema.parse({
        ...req.body,
        reporterId: userId,
      });
      
      const bug = await storage.createBug(validatedData);
      
      // AI analysis
      try {
        const aiAnalysis = await analyzeBug(bug.title, bug.description || '', bug.stackTrace || '');
        await storage.updateBug(bug.id, { aiAnalysis });
      } catch (aiError) {
        console.error("Error analyzing bug with AI:", aiError);
        // Continue without AI analysis
      }
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId: bug.projectId,
        action: 'bug_reported',
        description: `Reported bug "${bug.title}"`,
      });
      
      res.status(201).json(bug);
    } catch (error) {
      console.error("Error creating bug:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bug data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bug" });
    }
  });

  app.put('/api/bugs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBugSchema.partial().parse(req.body);
      
      const bug = await storage.updateBug(req.params.id, validatedData);
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId: bug.projectId,
        action: 'bug_updated',
        description: `Updated bug "${bug.title}"`,
      });
      
      res.json(bug);
    } catch (error) {
      console.error("Error updating bug:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bug data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update bug" });
    }
  });

  app.delete('/api/bugs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bug = await storage.getBug(req.params.id);
      await storage.deleteBug(req.params.id);
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId: bug?.projectId,
        action: 'bug_deleted',
        description: `Deleted bug "${bug?.title}"`,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting bug:", error);
      res.status(500).json({ message: "Failed to delete bug" });
    }
  });

  // Code analysis routes
  app.get('/api/code-analysis/:projectId', isAuthenticated, async (req: any, res) => {
    try {
      const analysis = await storage.getCodeAnalysis(req.params.projectId);
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching code analysis:", error);
      res.status(500).json({ message: "Failed to fetch code analysis" });
    }
  });

  app.post('/api/code-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { projectId, filePath, code, language } = req.body;
      
      if (!projectId || !filePath || !code || !language) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // AI analysis
      const aiAnalysis = await analyzeCode(code, language, filePath);
      
      const analysisData = {
        projectId,
        filePath,
        qualityScore: aiAnalysis.qualityScore,
        suggestions: aiAnalysis.suggestions,
        metrics: aiAnalysis.metrics,
        aiInsights: aiAnalysis.issues,
      };
      
      const analysis = await storage.createCodeAnalysis(analysisData);
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId,
        action: 'code_analyzed',
        description: `Analyzed code in ${filePath}`,
      });
      
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating code analysis:", error);
      res.status(500).json({ message: "Failed to analyze code" });
    }
  });

  // Team routes
  app.get('/api/teams/:projectId', isAuthenticated, async (req: any, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.projectId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { projectId, userId: memberId, role } = req.body;
      
      if (!projectId || !memberId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const member = await storage.addTeamMember({
        projectId,
        userId: memberId,
        role: role || 'developer',
      });
      
      // Log activity
      await storage.createActivity({
        userId,
        projectId,
        action: 'team_member_added',
        description: `Added team member`,
      });
      
      res.status(201).json(member);
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Failed to add team member" });
    }
  });

  // Activity routes
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const { projectId, userId } = req.query;
      const activities = await storage.getActivities(projectId, userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // AI routes
  app.post('/api/ai/suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const { context, language, requirements } = req.body;
      
      if (!context || !language || !requirements) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const suggestions = await generateCodeSuggestions(context, language, requirements);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      res.status(500).json({ message: "Failed to generate AI suggestions" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          case 'subscribe':
            // Handle subscription to project updates
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
