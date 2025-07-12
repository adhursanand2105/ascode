# AndroidIDE - Premium Mobile IDE with AI Integration

## Overview

AndroidIDE is a premium mobile IDE designed for Android development with AI-powered features. The application is built as a full-stack web application using React for the frontend and Express.js for the backend, with PostgreSQL as the database. The system includes comprehensive project management, advanced bug tracking, AI-powered code analysis, and team collaboration features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system using charcoal and gold color palette
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: OpenID Connect with Replit Auth integration
- **Session Management**: Express session with PostgreSQL store
- **AI Integration**: OpenAI API for code analysis and bug detection

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Migrations**: Automated with Drizzle Kit

## Key Components

### Authentication System
- **Provider**: Replit OpenID Connect authentication
- **Session Storage**: PostgreSQL-backed session store
- **User Management**: Comprehensive user profiles with roles
- **Authorization**: Route-level protection with middleware

### Project Management
- **Features**: Create, update, and manage Android projects
- **Metadata**: Language support, repository links, build status
- **Team Collaboration**: Multi-user project access and permissions

### AI-Powered Bug Tracking
- **Bug Analysis**: OpenAI integration for intelligent bug categorization
- **Severity Detection**: Automatic priority assignment based on bug characteristics
- **Solution Suggestions**: AI-generated fix recommendations
- **Stack Trace Analysis**: Intelligent parsing and analysis of error logs

### Code Analysis Engine
- **Quality Metrics**: Automated code quality scoring
- **Issue Detection**: Real-time code analysis and suggestions
- **Performance Optimization**: AI-driven performance recommendations
- **Best Practices**: Code style and architecture suggestions

### Team Collaboration
- **Member Management**: Invite and manage team members
- **Activity Tracking**: Real-time activity logs and notifications
- **Role-Based Access**: Different permission levels for team members
- **Communication**: Integrated messaging and notification system

## Data Flow

### Authentication Flow
1. User initiates login through Replit OpenID Connect
2. Server validates credentials and creates session
3. User data stored in PostgreSQL with session management
4. Frontend receives authentication state through API

### Project Workflow
1. User creates project with metadata
2. Project data stored in PostgreSQL
3. AI analysis triggered for initial code quality assessment
4. Real-time updates through WebSocket connections
5. Team members receive notifications

### Bug Tracking Process
1. Bug report submitted with title, description, and optional stack trace
2. AI analysis performed using OpenAI API
3. Bug categorized and prioritized automatically
4. Suggestions generated and stored
5. Team notifications sent
6. Progress tracked through status updates

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for production data storage
- **AI Services**: OpenAI API for code analysis and bug detection
- **Authentication**: Replit OpenID Connect for user management
- **Frontend Libraries**: Radix UI, React Query, Tailwind CSS
- **Backend Libraries**: Express.js, Drizzle ORM, WebSocket support

### Development Tools
- **Build System**: Vite for frontend bundling
- **TypeScript**: Full type safety across the stack
- **Database Tools**: Drizzle Kit for schema management
- **Code Quality**: ESLint, Prettier for code formatting

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild creates production server bundle
- **Database**: Automatic schema migrations with Drizzle
- **Environment**: Production environment variables for API keys

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **API Proxy**: Development server proxies API requests
- **Database**: Local or cloud PostgreSQL instance
- **Real-time Features**: WebSocket development server

### Configuration Management
- **Environment Variables**: Separate configs for development and production
- **API Keys**: Secure storage of OpenAI and database credentials
- **Session Security**: Configurable session timeouts and security settings
- **Database URLs**: Flexible database connection configuration

The application follows modern web development practices with a focus on type safety, developer experience, and scalable architecture. The AI integration provides intelligent features that enhance the development workflow, while the team collaboration features support modern development practices.
