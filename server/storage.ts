import {
  users,
  projects,
  bugs,
  codeAnalysis,
  teamMembers,
  activityLogs,
  notifications,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Bug,
  type InsertBug,
  type CodeAnalysis,
  type InsertCodeAnalysis,
  type TeamMember,
  type InsertTeamMember,
  type ActivityLog,
  type InsertActivityLog,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Bug operations
  getBugs(projectId?: string): Promise<Bug[]>;
  getBug(id: string): Promise<Bug | undefined>;
  createBug(bug: InsertBug): Promise<Bug>;
  updateBug(id: string, bug: Partial<InsertBug>): Promise<Bug>;
  deleteBug(id: string): Promise<void>;

  // Code analysis operations
  getCodeAnalysis(projectId: string): Promise<CodeAnalysis[]>;
  createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis>;
  
  // Team operations
  getTeamMembers(projectId: string): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(projectId: string, userId: string): Promise<void>;

  // Activity operations
  getActivities(projectId?: string, userId?: string): Promise<ActivityLog[]>;
  createActivity(activity: InsertActivityLog): Promise<ActivityLog>;

  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;

  // Dashboard statistics
  getDashboardStats(userId: string): Promise<{
    projectCount: number;
    bugCount: number;
    resolvedBugs: number;
    teamMemberCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, userId))
      .orderBy(desc(projects.updatedAt));
    
    const teamProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        language: projects.language,
        status: projects.status,
        ownerId: projects.ownerId,
        repository: projects.repository,
        lastBuild: projects.lastBuild,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .innerJoin(teamMembers, eq(teamMembers.projectId, projects.id))
      .where(eq(teamMembers.userId, userId))
      .orderBy(desc(projects.updatedAt));

    // Combine and deduplicate
    const allProjects = [...userProjects, ...teamProjects];
    const uniqueProjects = allProjects.filter(
      (project, index, self) => index === self.findIndex(p => p.id === project.id)
    );
    
    return uniqueProjects;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Bug operations
  async getBugs(projectId?: string): Promise<Bug[]> {
    const query = db.select().from(bugs).orderBy(desc(bugs.createdAt));
    
    if (projectId) {
      return await query.where(eq(bugs.projectId, projectId));
    }
    
    return await query;
  }

  async getBug(id: string): Promise<Bug | undefined> {
    const [bug] = await db.select().from(bugs).where(eq(bugs.id, id));
    return bug;
  }

  async createBug(bug: InsertBug): Promise<Bug> {
    const [newBug] = await db.insert(bugs).values(bug).returning();
    return newBug;
  }

  async updateBug(id: string, bug: Partial<InsertBug>): Promise<Bug> {
    const [updatedBug] = await db
      .update(bugs)
      .set({ ...bug, updatedAt: new Date() })
      .where(eq(bugs.id, id))
      .returning();
    return updatedBug;
  }

  async deleteBug(id: string): Promise<void> {
    await db.delete(bugs).where(eq(bugs.id, id));
  }

  // Code analysis operations
  async getCodeAnalysis(projectId: string): Promise<CodeAnalysis[]> {
    return await db
      .select()
      .from(codeAnalysis)
      .where(eq(codeAnalysis.projectId, projectId))
      .orderBy(desc(codeAnalysis.createdAt));
  }

  async createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis> {
    const [newAnalysis] = await db.insert(codeAnalysis).values(analysis).returning();
    return newAnalysis;
  }

  // Team operations
  async getTeamMembers(projectId: string): Promise<TeamMember[]> {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.projectId, projectId))
      .orderBy(desc(teamMembers.joinedAt));
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }

  async removeTeamMember(projectId: string, userId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.projectId, projectId), eq(teamMembers.userId, userId)));
  }

  // Activity operations
  async getActivities(projectId?: string, userId?: string): Promise<ActivityLog[]> {
    let query = db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));

    if (projectId && userId) {
      query = query.where(and(eq(activityLogs.projectId, projectId), eq(activityLogs.userId, userId)));
    } else if (projectId) {
      query = query.where(eq(activityLogs.projectId, projectId));
    } else if (userId) {
      query = query.where(eq(activityLogs.userId, userId));
    }

    return await query;
  }

  async createActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [newActivity] = await db.insert(activityLogs).values(activity).returning();
    return newActivity;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  // Dashboard statistics
  async getDashboardStats(userId: string): Promise<{
    projectCount: number;
    bugCount: number;
    resolvedBugs: number;
    teamMemberCount: number;
  }> {
    const userProjects = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.ownerId, userId));

    const projectIds = userProjects.map(p => p.id);

    const [projectCount] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.ownerId, userId));

    const [bugCount] = await db
      .select({ count: count() })
      .from(bugs)
      .where(eq(bugs.reporterId, userId));

    const [resolvedBugs] = await db
      .select({ count: count() })
      .from(bugs)
      .where(and(eq(bugs.reporterId, userId), eq(bugs.status, 'resolved')));

    const [teamMemberCount] = await db
      .select({ count: count() })
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId));

    return {
      projectCount: projectCount.count,
      bugCount: bugCount.count,
      resolvedBugs: resolvedBugs.count,
      teamMemberCount: teamMemberCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
