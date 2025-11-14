/**
 * Shared types for drug-related API contracts between frontend and backend
 * 
 * Note: Some types are derived from Prisma schema. When Prisma types are available,
 * they can be used to ensure type safety between database and API.
 */

/**
 * Represents a single drug row in the table
 * This matches the shape returned by the API after transformation from Prisma
 */
export type DrugRow = {
  id: number;
  code: string;
  name: string; // Computed from genericName + brandName
  company: string | null;
  launchDate: string | null; // ISO string (DateTime from Prisma)
};

/**
 * Table column configuration
 */
export type TableColumn = {
  key: string;
  label: string;
  visible?: boolean;
  description?: string;
};

/**
 * Table configuration response
 */
export type TableConfig = {
  columns: TableColumn[];
};

/**
 * Pagination information
 */
export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

/**
 * Query parameters for fetching drugs
 */
export type GetDrugsParams = {
  search?: string;
  company?: string;
  page?: number;
  limit?: number;
};

/**
 * Response from the drugs API endpoint
 */
export type DrugsResponse = {
  data: DrugRow[];
  companies: string[];
  pagination: Pagination;
};

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
