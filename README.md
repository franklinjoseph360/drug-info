# Drug Info

A full-stack application for managing and viewing drug information, built with Nx monorepo, NestJS backend, and React frontend.

## 📁 Directory Structure

This project uses [Nx](https://nx.dev) monorepo architecture, which organizes code into apps and libraries:

```
drug-info/
├── apps/                    # Applications
│   ├── backend/             # NestJS API server
│   └── frontend/            # React web application
├── libs/                    # Shared libraries
│   └── shared-types/        # Shared TypeScript types and Zod schemas
├── prisma/                  # Database schema and migrations
└── package.json             # Root package configuration
```

### Nx Monorepo Benefits

- **Code Sharing**: Share types, utilities, and business logic across apps
- **Dependency Management**: Single `node_modules` for all projects
- **Build Optimization**: Nx caches builds and only rebuilds what changed
- **Type Safety**: TypeScript path mappings ensure type safety across boundaries

## 🏗️ Project Structure

### `apps/backend`

NestJS REST API server that provides drug data endpoints.

**Tech Stack:**
- NestJS - Node.js framework
- Prisma - Database ORM
- PostgreSQL - Database
- Zod - Runtime validation

**Key Features:**
- `/api/drugs` - Get paginated list of drugs with filtering
- `/api/drugs/table-config` - Get table configuration
- Type-safe API responses using shared types
- Runtime validation with Zod schemas

**Key Files:**
- `src/app/drugs/` - Drug-related controllers, services, and DTOs
- `src/app/prisma/` - Prisma service and module
- `prisma/schema.prisma` - Database schema

**Run:**
```bash
npm run start:backend
# or
nx serve backend
```

### `apps/frontend`

React web application for displaying and filtering drug information.

**Tech Stack:**
- React 19 - UI library
- Vite - Build tool
- Material-UI - Component library
- Zustand - State management
- Vitest - Testing framework

**Key Features:**
- Drug listing with pagination
- Search by name or code
- Filter by company
- Sort by launch date
- Real-time filtering and sorting

**Key Files:**
- `src/pages/DrugsPage.tsx` - Main drugs page component
- `src/store/drugStore.ts` - Zustand store for state management
- `src/pages/DrugsPage.spec.tsx` - Component tests

**Run:**
```bash
npm run start:frontend
# or
nx serve frontend
```

### `libs/shared-types`

Shared TypeScript types and Zod schemas used by both frontend and backend.

**Purpose:**
- Single source of truth for API contracts
- Type safety across frontend and backend
- Runtime validation with Zod
- Automatic type inference from schemas

**Key Files:**
- `src/lib/drugs.types.ts` - TypeScript types (inferred from schemas)
- `src/lib/drugs.schemas.ts` - Zod validation schemas

**Usage:**
```typescript
// Import types
import type { DrugRow, DrugsResponse } from '@drug-info/shared-types';

// Import schemas for validation
import { DrugsResponseSchema } from '@drug-info/shared-types';
const validated = DrugsResponseSchema.parse(apiResponse);
```

## 🚀 Setup Guide

### Prerequisites

- Node.js 20.19.4 or higher
- npm 10 or higher
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drug-info
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/drug_info"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database (IMPORTANT - To visualise the data)
   npm run prisma:seed
   ```

5. **Build shared types library**
   ```bash
   nx build @drug-info/shared-types
   ```

### Running the Application

**Start both services:**
```bash
npm run start:backend    # Terminal 1
npm run start:frontend   # Terminal 2
```

**Or use Nx to run both:**
```bash
nx run-many -t serve -p backend frontend --parallel
```

**Access the application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api

### Development Commands

```bash
# Build
nx build backend
nx build frontend

# Test
nx test frontend
nx test backend

# Lint
nx lint frontend
nx lint backend

# Type check
nx typecheck frontend
nx typecheck backend
```

## 🧪 Testing

**Frontend tests:**
```bash
nx test frontend
```

**Backend tests:**
```bash
nx test backend
```

## 📦 Building for Production

```bash
# Build all apps
nx build backend
nx build frontend

# Build outputs:
# - apps/backend/dist/
# - apps/frontend/dist/
```

## 🔧 Technology Stack

- **Monorepo**: Nx
- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: React, Vite, Material-UI, Zustand
- **Type Safety**: TypeScript, Zod
- **Testing**: Vitest, Jest

## 📝 Author

### Franklin Joseph
### Senior Software Engineer - Full Stack
### franklinjoseph360@gmail.com
### +919944383206

