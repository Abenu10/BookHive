import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {
  fetchBookDetailStart,
  createRentalStart,
  fetchUserRentalsStart,
  setIsBookRented,
  toggleRentalStatusStart,
} from '../../redux/user/userSlice';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import MuiAlert, {AlertProps} from '@mui/material/Alert';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LanguageIcon from '@mui/icons-material/Language';
import BookCard from './BookCard';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
const BookDetailPage: React.FC = () => {
  const {bookId} = useParams<{bookId: string}>();
  const dispatch = useDispatch();
  const {selectedBook, loading, successMessage, error, isBookRented} =
    useSelector((state: RootState) => state.user);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookDetailStart(parseInt(bookId)));
      dispatch(fetchUserRentalsStart());
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    if (successMessage || error) {
      setOpenSnackbar(true);
    }
  }, [successMessage, error]);

  // const handleRent = () => {
  //   if (bookId) {
  //     dispatch(createRentalStart({bookId: parseInt(bookId)}));
  //   }
  // };
  // const handleReturn = () => {
  //   if (bookId) {
  //     //  return functionality
  //     // dispatch(returnRentalStart({ bookId: parseInt(bookId) }));
  //   }
  const toggleRentalStatus = () => {
    if (bookId) {
      dispatch(toggleRentalStatusStart({bookId: parseInt(bookId)}));
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

  if (loading || !selectedBook) {
    return <Typography>Loading...</Typography>;
  }

  const book = selectedBook;

  const ImageContainer = styled(Box)(({theme}) => ({
    width: '100%',
    height: '400px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: theme.spacing(4),
  }));

  const BlurredBackground = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${book.coverImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    transform: 'scale(1.1)',
  });

  const CenteredImage = styled('img')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '100%',
    maxWidth: '300px',
    objectFit: 'contain',
  });

  return (
    <>
      <Box sx={{width: '100%', bgcolor: 'background.default'}}>
        <Container maxWidth={false} sx={{py: 4}}>
          <Typography variant='body2' sx={{mb: 2}}>
            Homepage &gt; Rent &gt; {book.title}
          </Typography>

          <Grid container spacing={4}>
            {/* Left */}
            <Grid item xs={12} md={5} lg={7}>
              <Box
                sx={{
                  width: '100%',
                  height: '500px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${book.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                  }}
                />
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>

            {/* Right*/}
            <Grid item xs={12} md={7} lg={5}>
              <Typography variant='h4' component='h1' gutterBottom>
                {book.title}
              </Typography>
              <Typography variant='h6' color='text.secondary' gutterBottom>
                by {book.author}
              </Typography>

              <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <Rating value={book.rating} readOnly precision={0.5} />
                <Typography variant='body2' sx={{ml: 1}}>
                  ({book.reviewCount} reviews)
                </Typography>
              </Box>

              <Typography variant='h5' color='primary' gutterBottom>
                Rental Price: ${book.price}/week
              </Typography>

              <Button
                variant='contained'
                color={isBookRented ? 'secondary' : 'primary'}
                onClick={toggleRentalStatus}
                disabled={
                  loading ||
                  (selectedBook && selectedBook.availableQuantity <= 0)
                }
                size='large'
                fullWidth
                sx={{mt: 2, mb: 4}}
              >
                {loading
                  ? 'Processing...'
                  : isBookRented
                  ? 'Return Book'
                  : selectedBook && selectedBook.availableQuantity > 0
                  ? 'Rent Now'
                  : 'Out of Stock'}
              </Button>

              <Typography variant='h6' gutterBottom>
                About this book
              </Typography>
              <Typography variant='body2' paragraph>
                {book.description}
              </Typography>

              <Typography variant='h6' gutterBottom sx={{mt: 4}}>
                Book Details
              </Typography>
              <List>
             
                <ListItem disablePadding>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Author: ${book.author}`} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Owner: ${book.ownerName}`} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Owner's Location: ${book.ownerLocation}`}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Category: ${book.category}`} />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {/* Related Books Section */}
          <Typography variant='h5' gutterBottom sx={{mt: 6, mb: 3}}>
            Related Books
          </Typography>
          {/* <Grid container spacing={3}>
          Add your related books components here
          {dummyBooks.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <BookCard
                {...book}
                image='https://res.cloudinary.com/dnizoc474/image/upload/v1722864146/BookHive/atomic_habit_nz1dcj.jpg'
              />
            </Grid>
          ))}
        </Grid> */}
        </Container>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? 'error' : 'success'}
            sx={{width: '100%'}}
          >
            {error || successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default BookDetailPage;
