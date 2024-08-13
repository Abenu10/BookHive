import React from 'react';
import {Box, Typography, Grid, Paper, Button, Container} from '@mui/material';

interface Category {
  id: number;
  name: string;
  image?: string;
}

interface BrowseCategoriesProps {
  categories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

const placeholderImage =
  'https://res.cloudinary.com/dnizoc474/image/upload/v1723475923/book-covers/31j9ybCS4pL._SY445_SX342__p4kyqb.jpg';

const BrowseCategories: React.FC<BrowseCategoriesProps> = ({
  categories,
  onCategorySelect,
}) => {
  return (
    <Box sx={{py: 4, bgcolor: 'background.default', margin: 'auto'}}>
      <Container maxWidth='lg'>
        <Typography
          variant='h6'
          component='h2'
          color='text.secondary'
          sx={{mb: 3, fontWeight: 'bold', textAlign: 'center'}}
        >
          Browse Categories
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Grid container spacing={2} sx={{maxWidth: 'md', justifyContent: 'center'}}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={category.id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {boxShadow: 3},
                    transition: 'box-shadow 0.3s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onClick={() => onCategorySelect(category.id)}
                >
                  <Box
                    sx={{
                      height: 0,
                      paddingTop: '100%',
                      position: 'relative',
                      backgroundImage: `url(${
                        category.image || placeholderImage
                      })`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box sx={{p: 1, textAlign: 'center'}}>
                    <Typography variant='body2' component='h3'>
                      {category.name}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
          <Button
            variant='outlined'
            sx={{
              borderRadius: 20,
              textTransform: 'none',
              px: 3,
              py: 1,
              bgcolor: 'background.paper',
            }}
          >
            Show more ({categories.length})
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BrowseCategories;
export {placeholderImage};