/**
 * Zod schemas for runtime validation of API contracts
 * These schemas provide runtime validation and type inference
 */
import { z } from 'zod';

/**
 * Schema for a single drug row in the table
 */
export const DrugRowSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  company: z.string().nullable(),
  launchDate: z.string().nullable(), // ISO string
});

/**
 * Schema for table column configuration
 */
export const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  visible: z.boolean().optional(),
  description: z.string().optional(),
});

/**
 * Schema for table configuration response
 */
export const TableConfigSchema = z.object({
  columns: z.array(TableColumnSchema),
});

/**
 * Schema for pagination information
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

/**
 * Schema for query parameters when fetching drugs
 */
export const GetDrugsParamsSchema = z.object({
  search: z.string().optional(),
  company: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

/**
 * Schema for the drugs API response
 */
export const DrugsResponseSchema = z.object({
  data: z.array(DrugRowSchema),
  companies: z.array(z.string()),
  pagination: PaginationSchema,
});
