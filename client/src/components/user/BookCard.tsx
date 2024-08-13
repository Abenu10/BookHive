import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  styled,
  CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';


interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  availableQuantity: number,
}

const StyledCard = styled(Card)(({theme}) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  paddingTop: '70%',
  overflow: 'hidden',
});

const BlurredBackground = styled(Box)<{imageUrl: string}>(({imageUrl}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(10px)',
  transform: 'scale(1.1)',
}));

const CenteredImage = styled('img')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '100%',
  maxWidth: '90%',
  objectFit: 'contain',
});

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  price,
  rating,
  reviewCount,
  image,
  availableQuantity
}) => {
  return (
      <Link to={`/book/${id}`} style={{ textDecoration: 'none' }}>

      
    <StyledCard>
      <ImageContainer>
        <BlurredBackground image={image} />
        <CenteredImage src={image} alt={title} />
      </ImageContainer>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          py: 1,
        }}
      >
        <Box>
          <Typography
            gutterBottom
            variant='subtitle1'
            component='div'
            noWrap
            sx={{fontSize: '0.9rem', fontWeight: 'bold'}}
          >
            {title}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            noWrap
            sx={{fontSize: '0.8rem'}}
          >
            {author}
          </Typography>
        </Box>
        <Box>
          {/* <Typography
            variant='subtitle1'
            color='text.primary'
            sx={{mt: 0.5, fontSize: '0.9rem', fontWeight: 'bold'}}
          >
            ${price.toFixed(2)}
          </Typography> */}
          <Typography variant='h6' color='text.secondary'>
            {price !== null && price !== undefined
              ? `$${price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : 'Price not available'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
  {availableQuantity > 0
    ? `${availableQuantity} available`
    : 'Out of stock'}
</Typography>
          <Box sx={{display: 'flex', alignItems: 'center', mt: 0.5}}>
            <Rating value={rating} readOnly size='small' precision={0.1} />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ml: 0.5, fontSize: '0.7rem'}}
            >
              {reviewCount !== null && reviewCount !== undefined
                ? `(${reviewCount.toLocaleString()})`
                : '(No reviews)'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
    </Link>
  );
};

export default BookCard;
