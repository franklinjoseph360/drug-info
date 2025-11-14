/**
 * Shared types for drug-related API contracts between frontend and backend
 * 
 * Types are inferred from Zod schemas, providing both compile-time and runtime safety.
 * Note: Some types are derived from Prisma schema. When Prisma types are available,
 * they can be used to ensure type safety between database and API.
 */
import { z } from 'zod';
import {
  DrugRowSchema,
  TableColumnSchema,
  TableConfigSchema,
  PaginationSchema,
  GetDrugsParamsSchema,
  DrugsResponseSchema,
} from './drugs.schemas';

/**
 * Represents a single drug row in the table
 * This matches the shape returned by the API after transformation from Prisma
 */
export type DrugRow = z.infer<typeof DrugRowSchema>;

/**
 * Table column configuration
 */
export type TableColumn = z.infer<typeof TableColumnSchema>;

/**
 * Table configuration response
 */
export type TableConfig = z.infer<typeof TableConfigSchema>;

/**
 * Pagination information
 */
export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Query parameters for fetching drugs
 */
export type GetDrugsParams = z.infer<typeof GetDrugsParamsSchema>;

/**
 * Response from the drugs API endpoint
 */
export type DrugsResponse = z.infer<typeof DrugsResponseSchema>;

/**
 * Prisma-derived types (for backend use)
 * These can be used in the backend to ensure type safety with Prisma queries
 */
export type DrugSelectPayload = {
  id: number;
  code: string;
  genericName: string;
  brandName: string;
  launchDate: Date | null;
  company: {
    name: string;
  } | null;
};
