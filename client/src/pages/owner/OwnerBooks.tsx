import MuiAlert, {AlertProps} from '@mui/material/Alert';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  fetchBooksStart,
  updateBookStart,
  deleteBookStart,
  clearSuccessMessage,
  fetchFilteredBooksStart,
} from '../../redux/owner/ownerSlice';
import {RootState} from '../../redux/store';
import {fetchCategoriesStart} from '../../redux/category/categorySlice';
import {useTheme} from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { debounce } from 'lodash';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const OwnerBookList: React.FC = () => {
  const dispatch = useDispatch();
  const {books, loading, successMessage} = useSelector(
    (state: RootState) => state.owner
  );
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const theme = useTheme();
  const {categories} = useSelector((state: RootState) => state.category);
  const [localSuccessMessage, setLocalSuccessMessage] = useState<string | null>(
    null
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const debouncedSearch = useMemo(
    () => debounce((filters: MRT_ColumnFiltersState, search: string) => {
      const filterParams = {
        search: search || undefined,
        id: filters.find(f => f.id === 'id')?.value as string,
        title: filters.find(f => f.id === 'title')?.value as string,
        author: filters.find(f => f.id === 'author')?.value as string,
        category: filters.find(f => f.id === 'category.name')?.value as string,
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
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditingBook({...editingBook, coverImage: file});
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    dispatch(fetchBooksStart());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setOpenSnackbar(true);
      setLocalSuccessMessage(successMessage);
      setSnackbarMessage(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  const handleEditClick = (row: MRT_Row<any>) => {
    setEditingBook({
      ...row.original,
      category: row.original.category.id.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBookStart(bookId));
    }
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingBook(null);
  };

  const handleEditDialogSave = () => {
    if (editingBook) {
      const updatedBookData = {
        ...editingBook,
        category: Number(editingBook.category),
      };
      dispatch(
        updateBookStart({id: editingBook.id, bookData: updatedBookData})
      );
      setIsEditDialogOpen(false);
      setEditingBook(null);
    }
  };
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  

  const columns = useMemo<MRT_ColumnDef<any>[]>(
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
        accessorKey: 'category.name',
        header: 'Category',
        size: 100,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 80,
        Cell: ({row}) => `$${row.original.price.toFixed(2)}`,
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 80,
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
              justifyContent: 'center',
              maxWidth: '95px',
              borderRadius: '16px',
              padding: '4px 12px',
              backgroundColor:
                row.original.status === 'APPROVED'
                  ? 'rgba(0, 200, 83, 0.1)'
                  : 'rgba(255, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant='body2'
              sx={{
                color: row.original.status === 'APPROVED' ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {row.original.status}
            </Typography>
          </Box>
        ),
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
        header: 'Actions',
        size: 100,
        Cell: ({row}) => (
          <Box sx={{display: 'flex', gap: '8px'}}>
            <Tooltip title='Edit'>
              <IconButton onClick={() => handleEditClick(row)} size='medium'>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                onClick={() => handleDeleteClick(row.original.id)}
                size='medium'
              >
                <DeleteIcon color='error' />
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
      elevation={3}
      sx={{
        p: 2,
        maxWidth: 1200,
        margin: 'auto',
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
            My Books
          </Typography>
          <TextField
            placeholder="Search by title, author, or category..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            size="small"
            sx={{
              width: '350px',
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
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          {editingBook && (
            <Paper
              elevation={3}
              sx={{padding: 3, backgroundColor: theme.palette.background.paper}}
            >
              <Typography variant='h5' gutterBottom color='primary'>
                Edit Book
              </Typography>
              <TextField
                fullWidth
                margin='normal'
                label='Title'
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({...editingBook, title: e.target.value})
                }
                required
              />
              <TextField
                fullWidth
                margin='normal'
                label='Author'
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({...editingBook, author: e.target.value})
                }
                required
              />
              <FormControl fullWidth margin='normal'>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingBook?.category || ''}
                  onChange={(e) =>
                    setEditingBook({...editingBook, category: e.target.value})
                  }
                  name='category'
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin='normal'
                label='Quantity'
                type='number'
                value={editingBook.quantity}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    quantity: parseInt(e.target.value, 10),
                  })
                }
                required
              />
              <TextField
                fullWidth
                margin='normal'
                label='Price'
                type='number'
                value={editingBook.price}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: 2,
                  marginBottom: 2,
                }}
              >
                <input
                  accept='image/*'
                  style={{display: 'none'}}
                  id='cover-image-upload'
                  type='file'
                  onChange={handleFileChange}
                />
                <label htmlFor='cover-image-upload'>
                  <IconButton
                    color='primary'
                    aria-label='upload book cover'
                    component='span'
                    sx={{
                      width: 150,
                      height: 150,
                      border: '2px dashed',
                      borderColor: theme.palette.primary.main,
                      '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'},
                    }}
                  >
                    {previewUrl || editingBook.coverImage ? (
                      <img
                        src={previewUrl || editingBook.coverImage}
                        alt='Book cover preview'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <AddPhotoAlternateIcon sx={{fontSize: 50}} />
                    )}
                  </IconButton>
                </label>
                <Typography variant='caption' sx={{marginTop: 1}}>
                  {previewUrl || editingBook.coverImage
                    ? 'Click to change image'
                    : 'Click to select book cover'}
                </Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button
            onClick={handleEditDialogSave}
            variant='contained'
            color='primary'
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{
            width: '100%',
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            '& .MuiAlert-icon': {
              color: theme.palette.success.contrastText,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default OwnerBookList;
