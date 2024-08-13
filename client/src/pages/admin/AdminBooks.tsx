import React, {useEffect, useMemo} from 'react';
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
  Button,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  fetchBooksStart,
  deleteBookStart,
  toggleBookStatusStart,
} from '../../redux/admin/adminSlice';
import {RootState} from '../../redux/store';

const AdminBookList: React.FC = () => {
  const dispatch = useDispatch();
  const {books, loading} = useSelector((state: RootState) => state.admin);

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
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        Cell: ({row}) => {
          const isApproved = row.original.status === 'APPROVED';
          return (
            <Box
              sx={{
                display: 'flex',
                // alignItems: 'flex-start',
                justifyContent: 'flex-start',
                ml: '10px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  // alignItems: 'center',
                  justifyContent: 'flex-start',
                  backgroundColor: isApproved
                    ? 'rgba(0, 200, 83, 0.1)'
                    : 'rgba(255, 0, 0, 0.1)',
                  borderRadius: '16px',
                  padding: '4px 12px',
                }}
              >
                {isApproved ? (
                  <CheckIcon sx={{color: '#008000', mr: 1, fontSize: '1rem'}} />
                ) : (
                  <CloseIcon sx={{color: '#c50808', mr: 1, fontSize: '1rem'}} />
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
            </Box>
          );
        },
      },
      {
        header: 'Action',
        size: 80,
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
        enableGlobalFilter
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
        state={{isLoading: loading}}
        renderTopToolbarCustomActions={() => (
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
        )}
      />
    </Paper>
  );
};

export default AdminBookList;
