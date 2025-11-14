import { useEffect, useMemo, useState } from 'react';
import { useDrugStore, DrugRow, TableColumn } from '../store/drugStore';
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

    // Fetch table config and drugs on mount
    useEffect(() => {
        fetchTableConfig();
        fetchDrugs();
    }, []);

    // Unique companies for filter dropdown
    const companyOptions = useMemo(() => {
        return Array.from(new Set(drugs.map((d) => d.company).filter(Boolean))) as string[];
    }, [drugs]);

    // Columns
    const columns: GridColDef<DrugRow>[] = useMemo(() => {
        if (!tableConfig) return [];

        return tableConfig.columns.map((col: TableColumn) => {
            // Company column with dropdown in header
            if (col.key === 'company') {
                return {
                    field: col.key,
                    headerName: col.label,
                    width: 200,
                    renderHeader: (_params: GridColumnHeaderParams<DrugRow>) => (
                        <>
                            <span>{col.label} &nbsp;</span>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={companyFilter}
                                    onChange={(e) => setCompanyFilter(e.target.value)}
                                    displayEmpty
                                    renderValue={(val) => val || 'All'}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {companyOptions.map((company) => (
                                        <MenuItem key={company} value={company}>
                                            {company}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
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
                    // For all other columns, just display the value
                    const value = params.row[col.key as keyof DrugRow];
                    return value ?? '';
                },
            } as GridColDef<DrugRow>;
        });
    }, [tableConfig, companyFilter, companyOptions]);

    // Filtered & sorted rows
    const filteredRows = useMemo(() => {
        let rows = drugs;
        if (companyFilter) {
            rows = rows.filter((d) => d.company === companyFilter);
        }
        return [...rows].sort((a, b) => {
            const aTime = a.launchDate ? new Date(a.launchDate).getTime() : 0;
            const bTime = b.launchDate ? new Date(b.launchDate).getTime() : 0;
            return bTime - aTime;
        });
    }, [drugs, companyFilter]);

    // Reset filters
    const handleReset = () => {
        setCompanyFilter('');
        clearFiltersStore();
        fetchDrugs();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ height: 600, width: '100%', padding: '1rem' }}>
            <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                <h1>Drugs</h1>
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
            </Box>

            <DataGrid<DrugRow>
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row.id}
                showToolbar={true}
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
