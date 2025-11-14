// src/store/drugStore.ts
import { create } from 'zustand';
import type {
  DrugRow,
  TableColumn,
  TableConfig,
  Pagination,
  DrugsResponse,
  GetDrugsParams,
} from '@drug-info/shared-types';

// Extend DrugRow for frontend-specific needs (e.g., index signature for dynamic properties)
export type DrugRowExtended = DrugRow & {
  [key: string]: any;
};

interface State {
  tableConfig: TableConfig | null;
  drugs: DrugRowExtended[];
  companies: string[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  search: string;
  company: string | null;

  setSearch: (s: string) => void;
  setCompany: (c: string | null) => void;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  clearFilters: () => void;

  fetchTableConfig: () => Promise<void>;
  fetchDrugs: (params?: GetDrugsParams) => Promise<void>;

  setDrugsFromResponse: (resp: DrugsResponse) => void;
}

// Defaults
const defaultPagination: Pagination = { page: 1, limit: 20, total: 0 };

// Store
export const useDrugStore = create<State>((set, get) => ({
  tableConfig: { columns: [] },
  drugs: [],
  companies: [],
  pagination: defaultPagination,
  loading: false,
  error: null,
  search: '',
  company: null,

  setSearch: (s: string) => {
    set({ search: s, pagination: { ...get().pagination, page: 1 } });
  },

  setCompany: (c: string | null) => {
    set({ company: c, pagination: { ...get().pagination, page: 1 } });
  },

  setPage: (p: number) => {
    set((state) => ({ pagination: { ...state.pagination, page: p } }));
  },

  setLimit: (l: number) => {
    set((state) => ({ pagination: { ...state.pagination, limit: l } }));
  },

  clearFilters: () => {
    set({
      search: '',
      company: null,
      pagination: { ...get().pagination, page: 1 },
    });
  },

  setDrugsFromResponse: (resp: DrugsResponse) => {
    set({
      drugs: resp.data,
      companies: resp.companies,
      pagination: resp.pagination,
      loading: false,
      error: null,
    });
  },

  fetchTableConfig: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/drugs/table-config');
      if (!res.ok)
        throw new Error(`Failed to load table config: ${res.statusText}`);
      const cfg: TableConfig = await res.json();
      set({ tableConfig: cfg, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? 'Unknown error' });
      console.error('fetchTableConfig error', err);
    }
  },

  fetchDrugs: async (params?: GetDrugsParams) => {
    set({ loading: true, error: null });
    try {
      const page = params?.page ?? get().pagination.page;
      const limit = params?.limit ?? get().pagination.limit;
      const search = params?.search ?? get().search;
      const company = params?.company ?? get().company;

      const qp = new URLSearchParams();
      qp.set('page', String(page));
      qp.set('limit', String(limit));
      if (search) qp.set('search', search);
      if (company) qp.set('company', company);

      const url = `/api/drugs?${qp.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load drugs: ${res.status} ${text}`);
      }

      const json: DrugsResponse = await res.json();

      set({
        drugs: json.data,
        companies: json.companies,
        pagination: json.pagination,
        loading: false,
        error: null,
        search,
        company: company ?? null,
      });
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? 'Unknown error' });
      console.error('fetchDrugs error', err);
    }
  },
}));
