import React, {useEffect, useMemo, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from 'react-redux';
import {
  MaterialReactTable,
  MRT_ColumnFiltersState,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Switch,
  Paper,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  fetchBooksStart,
  deleteBookStart,
  toggleBookStatusStart,
  fetchFilteredBooksStart,
} from '../../redux/admin/adminSlice';
import {RootState} from '../../redux/store';
import {Can} from '../../contexts/AbilityContext';
import { debounce } from 'lodash';


const AdminBookList: React.FC = () => {
  const dispatch = useDispatch();
  const {books, loading} = useSelector((state: RootState) => state.admin);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

 
const debouncedSearch = useMemo(
  () => debounce((filters: MRT_ColumnFiltersState, search: string) => {
    const filterParams = {
      search: search || undefined,
      id: filters.find(f => f.id === 'id')?.value as string,
      title: filters.find(f => f.id === 'title')?.value as string,
      author: filters.find(f => f.id === 'author')?.value as string,
      category: filters.find(f => f.id === 'categoryName')?.value as string,
      owner: filters.find(f => f.id === 'owner.name')?.value as string,
      ownerLocation: filters.find(f => f.id === 'owner.location')?.value as string,
      status: filters.find(f => f.id === 'status')?.value as string || undefined,
    };
    dispatch(fetchFilteredBooksStart(filterParams));
  }, 300),
  [dispatch]
);

  useEffect(() => {
    debouncedSearch(columnFilters, globalFilter);
    return () => {
      debouncedSearch.cancel();
    };
  }, [globalFilter, columnFilters, debouncedSearch]);


  

  useEffect(() => {
    dispatch(fetchBooksStart());
  }, [dispatch]);

  
  const handleApproveClick = (bookId: number) => {
    dispatch(toggleBookStatusStart(bookId));
  };

  const handleDeleteClick = (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBookStart(bookId));
    }
  };

  const columns = useMemo<MRT_ColumnDef<(typeof books)[0]>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 150,
      },
      {
        accessorKey: 'author',
        header: 'Author',
        size: 120,
      },
      {
        accessorKey: 'categoryName',
        header: 'Category',
        size: 100,
      },
      {
        accessorKey: 'owner.name',
        header: 'Owner',
        size: 120,
      },
      {
        accessorKey: 'owner.location',
        header: 'Owner Location',
        size: 120,
      },
     {
  accessorKey: 'status',
  header: 'Status',
  size: 140,
  Cell: ({ row }) => {
    const isApproved = row.original.status === 'APPROVED';
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: isApproved
            ? 'rgba(0, 200, 83, 0.1)'
            : 'rgba(255, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '4px 12px',
        }}
      >
        {isApproved ? (
          <CheckIcon sx={{ color: '#008000', mr: 1, fontSize: '1rem' }} />
        ) : (
          <CloseIcon sx={{ color: '#c50808', mr: 1, fontSize: '1rem' }} />
        )}
        <Typography
          variant='body2'
          sx={{
            color: isApproved ? '#008000' : '#c50808',
            fontWeight: 'bold',
            mr: 1,
          }}
        >
          {isApproved ? 'Approved' : 'Pending'}
        </Typography>
        <Switch
          checked={isApproved}
          onChange={() => handleApproveClick(row.original.id)}
          size='small'
          sx={{
            width: 42,
            height: 24,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: '2px',
              transitionDuration: '300ms',
              '&.Mui-checked': {
                transform: 'translateX(18px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#008000',
                  opacity: 1,
                  border: 0,
                },
              },
              '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#008000',
                border: '6px solid #fff',
              },
            },
            '& .MuiSwitch-thumb': {
              boxSizing: 'border-box',
              width: 20,
              height: 20,
            },
            '& .MuiSwitch-track': {
              borderRadius: 26 / 2,
              backgroundColor: '#c50808',
              opacity: 1,
            },
          }}
        />
      </Box>
    );
  },
  Filter: ({ column }) => (
    <FormControl fullWidth size="small">
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        labelId="status-select-label"
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        label="Status"
        sx={{ height: '37px' }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="APPROVED">Approved</MenuItem>
        <MenuItem value="PENDING">Pending</MenuItem>
      </Select>
    </FormControl>
  ),
},
      {
        header: 'Action',
        size: 70,
        Cell: ({row}) => (
          <Box sx={{display: 'flex', gap: 0.5}}>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={() => handleDeleteClick(row.original.id)}
                sx={{color: '#FF0000'}}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Can I="read" a="AdminBooks">
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: 1200,
          margin: 'auto',
          boxShadow: '0 4px 8px rgba(92, 92, 92, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
 <MaterialReactTable
  columns={columns}
  data={books}
  enableColumnActions={false}
  enableColumnFilters
  enablePagination
  enableSorting
  enableBottomToolbar
  enableTopToolbar
  manualFiltering
  manualPagination
  manualSorting
  onColumnFiltersChange={setColumnFilters}
  onGlobalFilterChange={setGlobalFilter}
  muiTableProps={{
    sx: {
      tableLayout: 'fixed',
    },
  }}
  muiTopToolbarProps={{
    sx: {
      backgroundColor: '#ffff',
    },
  }}
  muiTablePaperProps={{
    elevation: 1,
    sx: {
      border: 'none',
      backgroundColor: '#ffffff',
    },
  }}

  muiTableBodyCellProps={{
    sx: {
      backgroundColor: '#ffffff',
    },
  }}
  muiTableHeadCellProps={{
    sx: {
      backgroundColor: '#ffffff',
    },
  }}
  muiBottomToolbarProps={{
    sx: {
      backgroundColor: '#ffffff',
    },
  }}
  state={{ isLoading: loading, columnFilters, globalFilter }}
  renderTopToolbarCustomActions={() => (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Typography
        variant='h6'
        component='div'
        sx={{
          flexGrow: 1,
          p: 1.5,
          fontSize: '1.2rem',
        }}
      >
        Books List
      </Typography>
      <TextField
        placeholder="Search by title, category, author, owner..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        size="small"
        sx={{
          width: '350px',
          backgroundColor: 'white',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )}
/>
      </Paper>
    </Can>
  );
};

export default AdminBookList;
