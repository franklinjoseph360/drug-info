/**
 * Backend-specific types derived from Prisma
 * These ensure type safety between Prisma queries and API responses
 */
import type { Prisma } from '@prisma/client';

/**
 * Type for the Prisma select query used in findAll
 * This ensures the select matches what we actually query
 */
export const drugSelect = {
  id: true,
  code: true,
  genericName: true,
  brandName: true,
  launchDate: true,
  company: {
    select: {
      name: true,
    },
  },
} as const satisfies Prisma.DrugSelect;

/**
 * Type for the result of the Prisma query
 * Automatically inferred from the select above using Prisma's utility types
 */
export type DrugQueryResult = Prisma.DrugGetPayload<{
  select: typeof drugSelect;
}>;

