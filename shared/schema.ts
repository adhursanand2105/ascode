import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("developer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description"),
  language: varchar("language").notNull(),
  status: varchar("status").notNull().default("active"),
  ownerId: varchar("owner_id").references(() => users.id),
  repository: varchar("repository"),
  lastBuild: timestamp("last_build"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bug priority enum
export const bugPriorityEnum = pgEnum("bug_priority", ["low", "medium", "high", "critical"]);

// Bug status enum
export const bugStatusEnum = pgEnum("bug_status", ["open", "in_progress", "resolved", "closed"]);

// Bugs table
export const bugs = pgTable("bugs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  description: text("description"),
  priority: bugPriorityEnum("priority").notNull().default("medium"),
  status: bugStatusEnum("status").notNull().default("open"),
  projectId: uuid("project_id").references(() => projects.id),
  reporterId: varchar("reporter_id").references(() => users.id),
  assigneeId: varchar("assignee_id").references(() => users.id),
  aiAnalysis: jsonb("ai_analysis"),
  stackTrace: text("stack_trace"),
  reproductionSteps: text("reproduction_steps"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Code analysis table
export const codeAnalysis = pgTable("code_analysis", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  filePath: varchar("file_path").notNull(),
  qualityScore: integer("quality_score"),
  suggestions: jsonb("suggestions"),
  metrics: jsonb("metrics"),
  aiInsights: jsonb("ai_insights"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  userId: varchar("user_id").references(() => users.id),
  role: varchar("role").notNull().default("developer"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Activity log table
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id),
  action: varchar("action").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message"),
  type: varchar("type").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  reportedBugs: many(bugs, { relationName: "reportedBy" }),
  assignedBugs: many(bugs, { relationName: "assignedTo" }),
  teamMemberships: many(teamMembers),
  activities: many(activityLogs),
  notifications: many(notifications),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  bugs: many(bugs),
  codeAnalysis: many(codeAnalysis),
  teamMembers: many(teamMembers),
  activities: many(activityLogs),
}));

export const bugsRelations = relations(bugs, ({ one }) => ({
  project: one(projects, { fields: [bugs.projectId], references: [projects.id] }),
  reporter: one(users, { fields: [bugs.reporterId], references: [users.id], relationName: "reportedBy" }),
  assignee: one(users, { fields: [bugs.assigneeId], references: [users.id], relationName: "assignedTo" }),
}));

export const codeAnalysisRelations = relations(codeAnalysis, ({ one }) => ({
  project: one(projects, { fields: [codeAnalysis.projectId], references: [projects.id] }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  project: one(projects, { fields: [teamMembers.projectId], references: [projects.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
  project: one(projects, { fields: [activityLogs.projectId], references: [projects.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertBug = typeof bugs.$inferInsert;
export type Bug = typeof bugs.$inferSelect;

export type InsertCodeAnalysis = typeof codeAnalysis.$inferInsert;
export type CodeAnalysis = typeof codeAnalysis.$inferSelect;

export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertActivityLog = typeof activityLogs.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;

// Zod schemas
export const insertProjectSchema = createInsertSchema(projects);
export const insertBugSchema = createInsertSchema(bugs);
export const insertCodeAnalysisSchema = createInsertSchema(codeAnalysis);
export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export const insertActivityLogSchema = createInsertSchema(activityLogs);
export const insertNotificationSchema = createInsertSchema(notifications);
