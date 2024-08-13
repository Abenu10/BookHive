import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  createBookStart,
  clearSuccessMessage,
} from '../../redux/owner/ownerSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Snackbar,
} from '@mui/material';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useTheme} from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {fetchCategoriesStart} from '../../redux/category/categorySlice';
import { RootState } from '../../redux/store';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const initialFormState = {
  title: '',
  author: '',
  category: '',
  quantity: '',
  price: '',
  availableQuantity: '',
  description: '',
  coverImage: null as File | null,
};

const UploadBook: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const {categories} = useSelector((state: RootState) => state.category);
  const {successMessage, loading} = useSelector(
    (state: RootState) => state.owner
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [localSuccessMessage, setLocalSuccessMessage] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState(initialFormState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setOpenSnackbar(true);
      setLocalSuccessMessage(successMessage);
      setFormData(initialFormState);
      setPreviewUrl(null);
    }
  }, [successMessage]);

  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
        dispatch(clearSuccessMessage());
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [openSnackbar, dispatch]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    dispatch(clearSuccessMessage());
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({...formData, coverImage: file});
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.coverImage) {
      const bookData = {
        ...formData,
        category: Number(formData.category),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      };

      dispatch(createBookStart(bookData));
    }
  };

  return (
    <Box sx={{maxWidth: 600, margin: 'auto', padding: 3}}>
      <Paper
        elevation={3}
        sx={{padding: 3, backgroundColor: theme.palette.background.paper}}
      >
        <Typography variant='h4' gutterBottom color='primary'>
          Upload New Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin='normal'
            label='Title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin='normal'
            label='Author'
            name='author'
            value={formData.author}
            onChange={handleInputChange}
            required
          />
          <FormControl fullWidth margin='normal'>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={handleInputChange}
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
            name='quantity'
            type='number'
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin='normal'
            label='Price'
            name='price'
            type='number'
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin='normal'
            label='Description'
            name='description'
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
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
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt='Book cover preview'
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                ) : (
                  <AddPhotoAlternateIcon sx={{fontSize: 50}} />
                )}
              </IconButton>
            </label>
            <Typography variant='caption' sx={{marginTop: 1}}>
              {previewUrl
                ? 'Click to change image'
                : 'Click to select book cover'}
            </Typography>
          </Box>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            disabled={loading}
            sx={{marginTop: 2, backgroundColor: theme.palette.secondary.main}}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
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
          {localSuccessMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadBook;
