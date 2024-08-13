import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchBooksByCategoryStart } from '../../redux/user/userSlice';
import { Typography, Grid } from '@mui/material';
import BookCard from '../../components/user/BookCard';
import MainLayout from '../../components/Layout/MainLayout';

const BooksByCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch();
  const { availableBooks, categories, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchBooksByCategoryStart(parseInt(categoryId)));
    }
  }, [dispatch, categoryId]);

  const categoryName = categories.find(c => c.id === parseInt(categoryId || ''))?.name || 'Category';

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Books in {categoryName}
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={4}>
          {availableBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <BookCard
                title={book.title}
                author={book.author}
                price={book.price}
                rating={book.rating}
                reviewCount={book.reviewCount}
                imageUrl={book.coverImage}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </MainLayout>
  );
};

export default BooksByCategory;