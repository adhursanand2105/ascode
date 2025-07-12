# AndroidIDE - Premium Mobile IDE with AI Integration

## Overview

AndroidIDE is a premium mobile IDE designed for Android development with AI-powered features. The application is built as a full-stack web application using React for the frontend and Express.js for the backend, with PostgreSQL database integration and OpenAI API for AI-powered code analysis.

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
- **Bug Analysis**: OpenAI integration for automatic bug categorization
- **Priority Detection**: AI-powered severity assessment
- **Fix Suggestions**: Automated resolution recommendations
- **Stack Trace Analysis**: Intelligent error parsing and diagnosis

### Code Analysis System
- **Quality Metrics**: Code complexity, maintainability, and testability scoring
- **Issue Detection**: Automated code review with severity levels
- **Performance Optimization**: AI-powered performance suggestions
- **Best Practice Recommendations**: Code style and architecture improvements

## Data Flow

### User Authentication Flow
1. User initiates login via Replit OAuth
2. Backend validates credentials with OpenID Connect
3. Session created and stored in PostgreSQL
4. User profile data synced from OAuth provider
5. Frontend receives authentication status and user data

### Project Operations Flow
1. User creates/manages projects through React interface
2. Frontend sends API requests to Express backend
3. Backend validates permissions and processes requests
4. Data persisted to PostgreSQL via Drizzle ORM
5. Real-time updates propagated to frontend via React Query

### AI Analysis Flow
1. User submits code or bug report for analysis
2. Backend processes request and formats data for OpenAI
3. OpenAI API analyzes content and returns insights
4. Results processed and stored in database
5. Frontend displays analysis results with actionable recommendations

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: AI-powered code analysis and bug detection
- **Replit Auth**: OpenID Connect authentication provider

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon library

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript development
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Build Process
1. Frontend built with Vite to static assets
2. Backend bundled with esbuild for Node.js production
3. Database migrations applied via Drizzle Kit
4. Environment variables configured for production

### Production Architecture
- **Frontend**: Served as static assets from Express server
- **Backend**: Single Express.js application handling API and static files
- **Database**: Neon PostgreSQL with connection pooling
- **Sessions**: PostgreSQL-backed session store for scalability

### Key Features
- **Mobile-First Design**: Optimized for mobile development workflow
- **Real-time Collaboration**: Team features for shared development
- **AI-Powered Insights**: Automated code quality and bug analysis
- **Responsive UI**: Dark theme with gold/charcoal color scheme
- **Progressive Enhancement**: Works offline with cached data