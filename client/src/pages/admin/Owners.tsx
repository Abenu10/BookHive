import React, {useEffect, useState, useMemo} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { fetchFilteredOwnersStart } from '../../redux/admin/adminSlice';
import { debounce } from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  MaterialReactTable,
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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  fetchOwnersStart,
  toggleOwnerStatusStart,
} from '../../redux/admin/adminSlice';
import {RootState} from '../../redux/store';

const AdminOwners: React.FC = () => {
  const dispatch = useDispatch();
  const {owners, loading} = useSelector((state: RootState) => state.admin);
  
const [globalFilter, setGlobalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');


    useEffect(() => {
    dispatch(fetchOwnersStart());
  }, [dispatch]);

  const handleStatusToggle = (ownerId: string) => {
    dispatch(toggleOwnerStatusStart(ownerId));
  };

  // useEffect(() => {
  //   dispatch(fetchOwnersStart());
  // }, [dispatch]);

   const debouncedSearch = useMemo(
  () => debounce((search: string, location: string) => {
    if (search || location) {
      dispatch(fetchFilteredOwnersStart({ search, location }));
    } else {
      dispatch(fetchOwnersStart());
    }
  }, 300),
  [dispatch]
);

  useEffect(() => {
    debouncedSearch(globalFilter, locationFilter);
    return () => {
      debouncedSearch.cancel();
    };
  }, [globalFilter, locationFilter, debouncedSearch]);

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  const handleLocationFilterChange = (value: string) => {
    setLocationFilter(value);
  };

  const columns = useMemo<MRT_ColumnDef<(typeof owners)[0]>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
        Cell: ({row}) => row.original.id.slice(0, 3),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 120,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        size: 120,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        size: 120,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        Cell: ({row}) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor:
                  row.original.status === 'ACTIVE'
                    ? 'rgba(0, 200, 83, 0.1)'
                    : 'rgba(255, 0, 0, 0.1)',
                borderRadius: '16px',
                padding: '4px 12px',
              }}
            >
              {row.original.status === 'ACTIVE' ? (
                <CheckIcon sx={{color: '#008000', mr: 1, fontSize: '1rem'}} />
              ) : (
                <CloseIcon sx={{color: '#c50808', mr: 1, fontSize: '1rem'}} />
              )}
              <Typography
                variant='body2'
                sx={{
                  color:
                    row.original.status === 'ACTIVE' ? '#008000' : '#c50808',
                  fontWeight: 'bold',
                  mr: 1,
                }}
              >
                {row.original.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </Typography>
              <Switch
                checked={row.original.status === 'ACTIVE'}
                onChange={() => handleStatusToggle(row.original.id)}
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
          </Box>
        ),
      },
      {
        header: 'Actions',
        size: 100,
        Cell: ({row}) => (
          <Box sx={{display: 'flex', justifyContent: 'flex-start', gap: '8px'}}>
            <Tooltip title='View Details'>
              <IconButton size='medium'>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title='Delete'>
            <IconButton size='medium'>
              <DeleteIcon color='error' />
            </IconButton>
          </Tooltip> */}
          </Box>
        ),
      },
    ],
    []
  );
  return (
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
  data={owners}
  enableColumnActions={false}
  enableColumnFilters
  enablePagination
  enableSorting
  enableBottomToolbar
  enableTopToolbar
  enableGlobalFilter={false} 
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
  muiTableProps={{
    sx: {
      tableLayout: 'fixed',
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
  state={{ isLoading: loading }}
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
        Owners List
      </Typography>
      <TextField
        placeholder="Search by name or email..."
        value={globalFilter ?? ''}
        onChange={(e) => handleGlobalFilterChange(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        placeholder="Filter by location"
        value={locationFilter}
        onChange={(e) => handleLocationFilterChange(e.target.value)}
        size="small"
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
  );
};

export default AdminOwners;
