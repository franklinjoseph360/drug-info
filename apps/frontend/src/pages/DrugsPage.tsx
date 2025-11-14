import { useEffect, useMemo, useState } from 'react';
import { useDrugStore } from '../store/drugStore';
import type { DrugRow, TableColumn } from '@drug-info/shared-types';
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { MenuItem, Select, FormControl, Button, Box } from '@mui/material';
import { format } from 'date-fns';

export function DrugsPage() {
    const fetchTableConfig = useDrugStore((s) => s.fetchTableConfig);
    const fetchDrugs = useDrugStore((s) => s.fetchDrugs);
    const drugs = useDrugStore((s) => s.drugs);
    const loading = useDrugStore((s) => s.loading);
    const tableConfig = useDrugStore((s) => s.tableConfig);
    const clearFiltersStore = useDrugStore((s) => s.clearFilters);

    const [companyFilter, setCompanyFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fetch table config and drugs on mount
    useEffect(() => {
        fetchTableConfig();
        fetchDrugs();
    }, []);

    // Unique companies for filter dropdown
    const companyOptions = useMemo(() => {
    if (!Array.isArray(drugs)) return [];

    return Array.from(
        new Set(
        (drugs ?? []).map((d) => d.company).filter(Boolean)
        )
    ) as string[];
    }, [drugs]);


    // Columns
    const columns: GridColDef<DrugRow>[] = useMemo(() => {  
        if (!tableConfig?.columns || !Array.isArray(tableConfig.columns)) return [];

        return tableConfig.columns.map((col: TableColumn) => {
            if (col.key === 'company') {
                // Company column with dropdown in header
                return {
                    field: col.key,
                    headerName: col.label,
                    width: 500,
                    renderHeader: (_params: GridColumnHeaderParams<DrugRow>) => (
                        <Box display="flex" flexDirection="row" gap={0.5} alignItems="center">
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Companies&nbsp;</span>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={companyFilter}
                                    onChange={(e) => setCompanyFilter(e.target.value)}
                                    displayEmpty
                                    renderValue={(val) => val || 'All'}
                                    inputProps={{ 'aria-label': 'Company filter' }}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {companyOptions.map((company) => (
                                        <MenuItem key={company} value={company}>
                                            {company}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    ),
                } as GridColDef<DrugRow>;
            }

            // Other columns
            return {
                field: col.key,
                headerName: col.label,
                width: 150,
                renderCell: (params) => {
                    if (col.key === 'launchDate') {
                        const dateStr = params.row.launchDate;
                        return dateStr ? format(new Date(dateStr), 'dd MMM yyyy') : '';
                    }
                    const value = params.row[col.key as keyof DrugRow];
                    return value ?? '';
                },
            } as GridColDef<DrugRow>;
        });
    }, [tableConfig, companyFilter, companyOptions]);

    // Filtered & sorted rows
    const filteredRows = useMemo(() => {
        if (!Array.isArray(drugs)) return [];

        let rows = drugs ?? [];

        // Company filter
        if (companyFilter) {
            rows = rows.filter((d) => d.company === companyFilter);
        }

        // Search filter
        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            rows = rows.filter(
                (d) =>
                    d.name.toLowerCase().includes(s) ||
                    d.code.toLowerCase().includes(s)
            );
        }

        // Sort by descending launch date
        return [...rows].sort((a, b) => {
            const aTime = a.launchDate ? new Date(a.launchDate).getTime() : 0;
            const bTime = b.launchDate ? new Date(b.launchDate).getTime() : 0;
            return bTime - aTime;
        });
    }, [drugs, companyFilter, searchTerm]);

    // Reset filters
    const handleReset = () => {
        setCompanyFilter('');
        setSearchTerm('');
        clearFiltersStore();
        fetchDrugs();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ height: 600, width: '100%', padding: '1rem' }}>
            <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                <h1>Drugs</h1>
            </Box>

            <Box marginBottom={2} display="flex" flexDirection="row" gap={2} alignItems="center" maxWidth={300}>
                <input
                    placeholder="Search by name or code"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                    aria-label="Search input"
                />
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
            </Box>

            <DataGrid<DrugRow>
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row.id}
                showToolbar
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                slotProps={{
                    pagination: { pageSizeOptions: [10, 25, 50] },
                }}
                onCellClick={(params) => {
                    if (params.field === 'company' && typeof params.value === 'string') {
                        setCompanyFilter(params.value);
                    }
                }}
            />
        </div>
    );
}
