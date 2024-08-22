import React, {useEffect, useState} from 'react';
import {Container, Grid, Typography, Box, styled} from '@mui/material';
import BookCard from '../../components/user/BookCard';
import Pagination from '../../components/user/Pagination';
import Footer from '../../components/user/Footer';
import Header from '../../components/user/Header';
import BrowseCategories, { placeholderImage } from '../../components/user/BrowseCategories';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {RootState} from '../../redux/store';
import {
  fetchAvailableBooksStart,
  fetchCategoriesStart,
  fetchBooksByCategoryStart,
} from '../../redux/user/userSlice';
import MainLayout from '../../components/Layout/MainLayout';
import BookList from '../../components/user/BookList';

const StyledGrid = styled(Grid)(({theme}) => ({
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

const HomePage: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, isAuthenticated} = useSelector((state: RootState) => state.auth);
  const {availableBooks, categories, loading} = useSelector(
    (state: RootState) => state.user
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
 
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
    } else {
      dispatch(fetchAvailableBooksStart());
      dispatch(fetchCategoriesStart());
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    
  }, [availableBooks]);

  useEffect(() => {
    if (searchQuery) {
     
    }
  }, [searchQuery, dispatch]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    dispatch(fetchBooksByCategoryStart(categoryId));
  };

  if (!user) return null;

 return (
   <MainLayout>
     {searchQuery && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Search results for: "{searchQuery}"
        </Typography>
      )}
    <BrowseCategories
  categories={categories.map(cat => ({...cat, image: cat.image || placeholderImage}))}
  onCategorySelect={handleCategorySelect}
/>
     <Typography variant='h4' gutterBottom sx={{fontWeight: 'bold', mb: 3}}>
       {selectedCategory
         ? `Books in ${categories.find((c) => c.id === selectedCategory)?.name}`
         : 'Available Books'}
     </Typography>
     <BookList books={availableBooks} loading={loading} />
   </MainLayout>
 );
};

export default HomePage;
