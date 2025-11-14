# Shared Types Library

This library contains shared TypeScript types and Zod schemas that are used across both the frontend and backend applications. This ensures type safety and runtime validation across the API boundary.

## Purpose

- **Single Source of Truth**: API contract types and schemas are defined once and used everywhere
- **Type Safety**: Ensures frontend and backend stay in sync at compile time
- **Runtime Validation**: Zod schemas provide runtime validation to catch API contract mismatches
- **Better DX**: Autocomplete and type checking across the monorepo

## Usage

### Import Types

```typescript
import type { DrugRow, DrugsResponse, GetDrugsParams } from '@drug-info/shared-types';
```

### Import Schemas for Validation

```typescript
import { DrugsResponseSchema, TableConfigSchema } from '@drug-info/shared-types';

// Validate API response
const response = await fetch('/api/drugs');
const json = await response.json();
const validated = DrugsResponseSchema.parse(json); // Throws if invalid
```

## Available Types

- `DrugRow` - Represents a single drug in the table
- `TableColumn` - Column configuration for the table
- `TableConfig` - Complete table configuration
- `Pagination` - Pagination metadata
- `GetDrugsParams` - Query parameters for fetching drugs
- `DrugsResponse` - Response from the drugs API endpoint

## Available Schemas

- `DrugRowSchema` - Zod schema for DrugRow
- `TableColumnSchema` - Zod schema for TableColumn
- `TableConfigSchema` - Zod schema for TableConfig
- `PaginationSchema` - Zod schema for Pagination
- `GetDrugsParamsSchema` - Zod schema for GetDrugsParams
- `DrugsResponseSchema` - Zod schema for DrugsResponse

## How It Works

Types are inferred from Zod schemas using `z.infer<>`, ensuring that:
1. The schema is the single source of truth
2. TypeScript types automatically match the runtime validation
3. Changes to schemas automatically update types

## Adding New Types

When adding new shared types:

1. Add the Zod schema to `src/lib/drugs.schemas.ts`
2. Export the schema from `src/lib/drugs.schemas.ts`
3. Infer the type in `src/lib/drugs.types.ts` using `z.infer<typeof YourSchema>`
4. Export both from `src/index.ts`
5. Update this README with the new type and schema

