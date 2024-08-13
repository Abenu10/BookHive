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

const StyledGrid = styled(Grid)(({theme}) => ({
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

const HomePage: React.FC = () => {
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

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    dispatch(fetchBooksByCategoryStart(categoryId));
  };

  if (!user) return null;

 return (
   <MainLayout>
    <BrowseCategories
  categories={categories.map(cat => ({...cat, image: cat.image || placeholderImage}))}
  onCategorySelect={handleCategorySelect}
/>
     <Typography variant='h4' gutterBottom sx={{fontWeight: 'bold', mb: 3}}>
       {selectedCategory
         ? `Books in ${categories.find((c) => c.id === selectedCategory)?.name}`
         : 'Available Books'}
     </Typography>
     {loading ? (
       <Typography>Loading...</Typography>
     ) : (
       <Grid container spacing={4}>
         {availableBooks.map((book) => (
           <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
             <BookCard
  id={book.id}
  title={book.title}
  author={book.author}
  price={book.price}
  rating={book.rating}
  reviewCount={book.reviewCount}
  image={book.coverImage}
  availableQuantity={book.availableQuantity}
/>
           </Grid>
         ))}
       </Grid>
     )}
   </MainLayout>
 );
};

export default HomePage;
