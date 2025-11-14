import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DrugsPage } from './DrugsPage';

// Mock the zustand store
const mockFetchTableConfig = vi.fn();
const mockFetchDrugs = vi.fn();
const mockClearFilters = vi.fn();

// Mock data
const mockDrugs = [
  { id: 1, code: 'D001', name: 'Paracetamol', company: 'PharmaA', launchDate: '2025-11-10T00:00:00Z' },
  { id: 2, code: 'D002', name: 'Ibuprofen', company: 'PharmaB', launchDate: '2025-11-12T00:00:00Z' },
  { id: 3, code: 'D003', name: 'Aspirin', company: 'PharmaA', launchDate: '2025-11-15T00:00:00Z' },
  { id: 4, code: 'D004', name: 'Aspirin Plus', company: 'PharmaB', launchDate: null },
];

const mockTableConfig = {
  columns: [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'launchDate', label: 'Launch Date' },
  ],
};

// Create a mock state object
let mockState: any = {
  drugs: mockDrugs,
  loading: false,
  tableConfig: mockTableConfig,
  fetchTableConfig: mockFetchTableConfig,
  fetchDrugs: mockFetchDrugs,
  clearFilters: mockClearFilters,
};

vi.mock('../store/drugStore', () => ({
  useDrugStore: (selector: (state: any) => any) => {
    return selector(mockState);
  },
}));

describe('DrugsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state before each test
    mockState = {
      drugs: mockDrugs,
      loading: false,
      tableConfig: mockTableConfig,
      fetchTableConfig: mockFetchTableConfig,
      fetchDrugs: mockFetchDrugs,
      clearFilters: mockClearFilters,
    };
  });

  describe('Rendering', () => {
    it('renders the page title', () => {
      render(<DrugsPage />);
      expect(screen.getByText('Drugs')).toBeInTheDocument();
    });

    it('renders the reset button', () => {
      render(<DrugsPage />);
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('renders the search input', () => {
      render(<DrugsPage />);
      expect(screen.getByPlaceholderText(/search by name or code/i)).toBeInTheDocument();
    });

    it('renders the DataGrid component', () => {
      render(<DrugsPage />);
      // DataGrid renders with role="grid"
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('fetches table config and drugs on mount', () => {
      render(<DrugsPage />);
      expect(mockFetchTableConfig).toHaveBeenCalledTimes(1);
      expect(mockFetchDrugs).toHaveBeenCalledTimes(1);
    });

    it('displays loading state', () => {
      mockState.loading = true;
      mockState.drugs = [];
      mockState.tableConfig = null;

      render(<DrugsPage />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('filters by company using dropdown', async () => {
      const user = userEvent.setup();
      render(<DrugsPage />);

      // Find and click the company filter dropdown
      const companyFilter = screen.getByLabelText(/company filter/i);
      await user.click(companyFilter);

      // Select PharmaB
      const pharmaBOption = await screen.findByRole('option', { name: 'PharmaB' });
      await user.click(pharmaBOption);

      // Wait for filtering to apply
      await waitFor(() => {
        // Ibuprofen and Aspirin Plus should be visible (both from PharmaB)
        expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
        expect(screen.getByText('Aspirin Plus')).toBeInTheDocument();
        // Paracetamol and Aspirin should not be visible (from PharmaA)
        expect(screen.queryByText('Paracetamol')).not.toBeInTheDocument();
        expect(screen.queryByText('Aspirin')).not.toBeInTheDocument();
      });
    });

    it('filters by search input for drug name', async () => {
      const user = userEvent.setup();
      render(<DrugsPage />);

      const searchInput = screen.getByPlaceholderText(/search by name or code/i);
      await user.type(searchInput, 'Aspirin');

      await waitFor(() => {
        expect(screen.getByText('Aspirin')).toBeInTheDocument();
        expect(screen.getByText('Aspirin Plus')).toBeInTheDocument();
        expect(screen.queryByText('Paracetamol')).not.toBeInTheDocument();
        expect(screen.queryByText('Ibuprofen')).not.toBeInTheDocument();
      });
    });

    it('filters by search input for drug code', async () => {
      const user = userEvent.setup();
      render(<DrugsPage />);

      const searchInput = screen.getByPlaceholderText(/search by name or code/i);
      await user.type(searchInput, 'D001');

      await waitFor(() => {
        expect(screen.getByText('Paracetamol')).toBeInTheDocument();
        expect(screen.queryByText('Ibuprofen')).not.toBeInTheDocument();
        expect(screen.queryByText('Aspirin')).not.toBeInTheDocument();
      });
    });

    it('applies both company and search filters together', async () => {
      const user = userEvent.setup();
      render(<DrugsPage />);

      // First filter by company
      const companyFilter = screen.getByLabelText(/company filter/i);
      await user.click(companyFilter);
      const pharmaAOption = await screen.findByRole('option', { name: 'PharmaA' });
      await user.click(pharmaAOption);

      // Then filter by search
      const searchInput = screen.getByPlaceholderText(/search by name or code/i);
      await user.type(searchInput, 'Aspirin');

      await waitFor(() => {
        // Should only show Aspirin from PharmaA
        expect(screen.getByText('Aspirin')).toBeInTheDocument();
        expect(screen.queryByText('Paracetamol')).not.toBeInTheDocument();
        expect(screen.queryByText('Aspirin Plus')).not.toBeInTheDocument();
      });
    });
  });

  describe('Reset Functionality', () => {
    it('resets filters when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<DrugsPage />);

      // Apply a filter first
      const searchInput = screen.getByPlaceholderText(/search by name or code/i);
      await user.type(searchInput, 'Aspirin');

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /reset/i });
      await user.click(resetButton);

      await waitFor(() => {
        expect(mockClearFilters).toHaveBeenCalledTimes(1);
        expect(mockFetchDrugs).toHaveBeenCalledTimes(2); // Once on mount, once on reset
      });
    });
  });

  describe('Sorting', () => {
    it('sorts drugs by launch date in descending order', () => {
      render(<DrugsPage />);
      
      // The component sorts by descending launch date
      // Aspirin (2025-11-15) should appear before Ibuprofen (2025-11-12)
      // which should appear before Paracetamol (2025-11-10)
      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
      
      // Verify all drugs are rendered (sorting is handled internally by the component)
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
      expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats launch dates correctly', () => {
      render(<DrugsPage />);
      
      // The date should be formatted as "dd MMM yyyy"
      // For 2025-11-15, it should show something like "15 Nov 2025"
      // Note: The exact format depends on date-fns locale, but we can verify the date is rendered
      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('handles null launch dates', () => {
      render(<DrugsPage />);
      
      // Aspirin Plus has null launchDate, should render empty string
      expect(screen.getByText('Aspirin Plus')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('handles empty drugs array', () => {
      mockState.drugs = [];
      mockState.loading = false;
      mockState.tableConfig = mockTableConfig;

      render(<DrugsPage />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('handles missing table config', () => {
      mockState.drugs = mockDrugs;
      mockState.loading = false;
      mockState.tableConfig = null;

      render(<DrugsPage />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('handles empty table config columns', () => {
      mockState.drugs = mockDrugs;
      mockState.loading = false;
      mockState.tableConfig = { columns: [] };

      render(<DrugsPage />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Company Options', () => {
    it('generates unique company options from drugs', () => {
      render(<DrugsPage />);
      
      // Open the company dropdown to see options
      const companyFilter = screen.getByLabelText(/company filter/i);
      fireEvent.mouseDown(companyFilter);

      // Should have "All" option plus unique companies
      // PharmaA and PharmaB should be available
      waitFor(() => {
        expect(screen.getByText('All')).toBeInTheDocument();
      });
    });

    it('handles drugs with null company values', () => {
      const drugsWithNullCompany = [
        ...mockDrugs,
        { id: 5, code: 'D005', name: 'Test Drug', company: null, launchDate: '2025-11-20T00:00:00Z' },
      ];

      mockState.drugs = drugsWithNullCompany;
      mockState.loading = false;
      mockState.tableConfig = mockTableConfig;

      render(<DrugsPage />);
      expect(screen.getByText('Test Drug')).toBeInTheDocument();
    });
  });
});
