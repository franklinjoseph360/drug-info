# Shared Types Library

This library contains shared TypeScript types that are used across both the frontend and backend applications. This ensures type safety and consistency across the API boundary.

## Purpose

- **Single Source of Truth**: API contract types are defined once and used everywhere
- **Type Safety**: Ensures frontend and backend stay in sync
- **Better DX**: Autocomplete and type checking across the monorepo

## Usage

Import types from `@drug-info/shared-types`:

```typescript
import type { DrugRow, DrugsResponse, GetDrugsParams } from '@drug-info/shared-types';
```

## Available Types

- `DrugRow` - Represents a single drug in the table
- `TableColumn` - Column configuration for the table
- `TableConfig` - Complete table configuration
- `Pagination` - Pagination metadata
- `GetDrugsParams` - Query parameters for fetching drugs
- `DrugsResponse` - Response from the drugs API endpoint

## Adding New Types

When adding new shared types:

1. Add the type definition to `src/lib/drugs.types.ts` (or create a new file if it's a different domain)
2. Export it from `src/index.ts`
3. Update this README with the new type

