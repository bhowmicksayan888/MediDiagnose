# Overview

This is a medical diagnosis application built with a modern full-stack architecture. The application allows users to input symptoms and receive AI-powered differential diagnosis suggestions with probability rankings and detailed explanations. It's designed to assist healthcare professionals and students in analyzing patient presentations and understanding potential conditions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom medical theme colors and design system
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging
- **Data Validation**: Zod schemas for input validation and type safety
- **Storage**: In-memory storage implementation with interface for future database integration

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Two main entities:
  - Users: Basic user management with username/password
  - Diagnosis Requests: Stores patient symptoms, demographics, and AI analysis results
- **Migration Strategy**: Drizzle Kit for schema migrations with version control

## AI Integration
- **Provider**: OpenAI GPT-4o for medical analysis
- **Prompt Engineering**: Structured prompts for differential diagnosis generation
- **Output Format**: JSON-structured responses with probability rankings, explanations, and recommendations
- **Safety**: Medical disclaimer handling and appropriate urgency classification

## Development Tools
- **Build System**: Vite with React plugin for fast development and optimized builds
- **Type Safety**: Comprehensive TypeScript configuration with strict mode
- **Code Quality**: ESLint and Prettier integration through Vite ecosystem
- **Development Experience**: Hot module replacement and runtime error overlay

## Security Considerations
- **Input Validation**: Comprehensive Zod schemas for all user inputs
- **Error Handling**: Structured error responses without sensitive information exposure
- **Environment Variables**: Secure API key management for OpenAI integration

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web application framework
- **react**: Core React library for UI components
- **typescript**: Type safety and development experience

## Database and ORM
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **drizzle-kit**: Database schema management and migrations

## AI and External Services
- **openai**: Official OpenAI API client for GPT-4o integration

## UI and Styling
- **@radix-ui/***: Comprehensive accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **lucide-react**: Modern icon library

## Form Handling and Validation
- **react-hook-form**: Performant form handling with minimal re-renders
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries
- **zod**: Runtime type validation and schema definition

## Development and Build Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds