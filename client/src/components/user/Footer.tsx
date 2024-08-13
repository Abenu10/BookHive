import React from 'react';
import {Box, Container, Grid, Typography, Link} from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{bgcolor: 'primary.main', color: 'white', py: 6, mt: 4}}>
      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant='h6' gutterBottom>
              Shop
            </Typography>
            <Link href='#' color='inherit' display='block'>
              Gift cards
            </Link>
            <Link href='#' color='inherit' display='block'>
              Sitemap
            </Link>
            <Link href='#' color='inherit' display='block'>
              BookHive blog
            </Link>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h6' gutterBottom>
              Sell
            </Typography>
            <Link href='#' color='inherit' display='block'>
              Sell on BookHive
            </Link>
            <Link href='#' color='inherit' display='block'>
              Teams
            </Link>
            <Link href='#' color='inherit' display='block'>
              Forums
            </Link>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h6' gutterBottom>
              About
            </Typography>
            <Link href='#' color='inherit' display='block'>
              BookHive, Inc.
            </Link>
            <Link href='#' color='inherit' display='block'>
              Policies
            </Link>
            <Link href='#' color='inherit' display='block'>
              Investors
            </Link>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h6' gutterBottom>
              Help
            </Typography>
            <Link href='#' color='inherit' display='block'>
              Help Center
            </Link>
            <Link href='#' color='inherit' display='block'>
              Privacy settings
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant='body2' align='center'>
            © 2024 BookHive, Inc. Terms of Use Privacy Interest-based ads
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
