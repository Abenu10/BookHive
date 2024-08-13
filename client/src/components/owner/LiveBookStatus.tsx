import React, {useState, useMemo} from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type BookStatus = 'Rented' | 'Free';

interface Book {
  no: string;
  bookNo: string;
  bookName: string;
  status: BookStatus;
  price: number;
}

const initialData: Book[] = [
  {
    no: '01',
    bookNo: '6465',
    bookName: 'Derto Gada',
    status: 'Rented',
    price: 40,
  },
  {
    no: '01',
    bookNo: '6466',
    bookName: 'Fikr Eske Mekabr',
    status: 'Rented',
    price: 40,
  },
  {
    no: '01',
    bookNo: '6467',
    bookName: 'The Power of Now',
    status: 'Rented',
    price: 40,
  },
  {no: '02', bookNo: '5665', bookName: 'Derto Gada', status: 'Free', price: 0},
  {no: '02', bookNo: '5666', bookName: 'Derto Gada', status: 'Free', price: 0},
  {no: '03', bookNo: '1755', bookName: 'Derto Gada', status: 'Free', price: 0},
];

const LiveBookStatus: React.FC = () => {
  const [data, setData] = useState<Book[]>(initialData);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (row: MRT_Row<Book>) => {
    setEditingBook({...row.original});
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (row: MRT_Row<Book>) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setData((prevData) =>
        prevData.filter((book) => book.bookNo !== row.original.bookNo)
      );
    }
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingBook(null);
  };

  const handleEditDialogSave = () => {
    if (editingBook) {
      setData((prevData) =>
        prevData.map((book) =>
          book.bookNo === editingBook.bookNo ? editingBook : book
        )
      );
      setIsEditDialogOpen(false);
      setEditingBook(null);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'No.',
        size: 50,
      },
      {
        accessorKey: 'bookNo',
        header: 'Book no.',
        size: 80,
      },
      {
        accessorKey: 'bookName',
        header: 'Book Name',
        size: 180,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({cell}) => (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box
              sx={{
                width: 19,
                height: 19,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  cell.getValue<BookStatus>() === 'Rented'
                    ? 'secondary.main'
                    : '#FF0000',
                mr: 1,
              }}
            >
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    backgroundColor:
                      cell.getValue<BookStatus>() === 'Rented'
                        ? 'secondary.main'
                        : '#FF0000',
                  }}
                />
              </Box>
            </Box>
            <Typography variant='body2'>{cell.getValue<string>()}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 80,
        Cell: ({cell}) => (
          <Typography variant='body2'>{`${cell.getValue<number>()} Birr`}</Typography>
        ),
      },
      {
        header: 'Action',
        size: 80,
        Cell: ({row}) => (
          <Box sx={{display: 'flex', gap: 0.5}}>
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => handleEditClick(row)}>
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={() => handleDeleteClick(row)}
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
        maxWidth: 900,
        margin: 'auto',
        boxShadow: '0 4px 8px rgba(92, 92, 92, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <Typography
        variant='subtitle1'
        component='div'
        sx={{
          flexGrow: 1,
          p: 1.5,
          fontSize: '1rem',
          backgroundColor: '#ffffff',
        }}
      >
        Live Book Status
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination
        enableBottomToolbar={false}
        enableTopToolbar={false}
        enableGlobalFilter={false}
        muiTablePaperProps={{
          elevation: 1,
          sx: {
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#ffffff',
          },
        }}
        muiTableProps={{
          sx: {
            tableLayout: 'fixed',
            '& .MuiTableCell-root': {
              padding: '8px',
            },
            backgroundColor: '#ffffff',
          },
        }}
        muiTableBodyProps={{
          sx: {
            backgroundColor: '#ffffff',
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontSize: '0.8rem',
            backgroundColor: '#ffffff',
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontSize: '0.85rem',
            fontWeight: 'bold',
            backgroundColor: '#ffffff',
          },
        }}
        initialState={{
          pagination: {pageSize: 5, pageIndex: 0},
        }}
      />

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle sx={{fontSize: '1.1rem'}}>Edit Book</DialogTitle>
        <DialogContent>
          {editingBook && (
            <>
              <TextField
                label='No.'
                value={editingBook.no}
                onChange={(e) =>
                  setEditingBook({...editingBook, no: e.target.value})
                }
                fullWidth
                margin='normal'
                sx={{'& .MuiInputBase-input': {fontSize: '0.9rem'}}}
              />
              <TextField
                label='Book no.'
                value={editingBook.bookNo}
                onChange={(e) =>
                  setEditingBook({...editingBook, bookNo: e.target.value})
                }
                fullWidth
                margin='normal'
                sx={{'& .MuiInputBase-input': {fontSize: '0.9rem'}}}
              />
              <TextField
                label='Book Name'
                value={editingBook.bookName}
                onChange={(e) =>
                  setEditingBook({...editingBook, bookName: e.target.value})
                }
                fullWidth
                margin='normal'
                sx={{'& .MuiInputBase-input': {fontSize: '0.9rem'}}}
              />
              <TextField
                select
                label='Status'
                value={editingBook.status}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    status: e.target.value as BookStatus,
                  })
                }
                fullWidth
                margin='normal'
                sx={{'& .MuiInputBase-input': {fontSize: '0.9rem'}}}
              >
                <MenuItem value='Rented'>Rented</MenuItem>
                <MenuItem value='Free'>Free</MenuItem>
              </TextField>
              <TextField
                label='Price'
                type='number'
                value={editingBook.price}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    price: Number(e.target.value),
                  })
                }
                fullWidth
                margin='normal'
                sx={{'& .MuiInputBase-input': {fontSize: '0.9rem'}}}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} size='small'>
            Cancel
          </Button>
          <Button
            onClick={handleEditDialogSave}
            variant='contained'
            color='primary'
            size='small'
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LiveBookStatus;
