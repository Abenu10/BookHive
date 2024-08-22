import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchBooksByCategoryStart } from '../../redux/user/userSlice';
import { Typography, Grid } from '@mui/material';
import BookCard from '../../components/user/BookCard';
import MainLayout from '../../components/Layout/MainLayout';
import BookList from './BookList';

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
      <BookList books={availableBooks} loading={loading} />
  
    </MainLayout>
  );
};

export default BooksByCategory;