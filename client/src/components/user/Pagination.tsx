
import React from 'react';
import {Pagination as MuiPagination, Box} from '@mui/material';

const Pagination: React.FC = () => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
      <MuiPagination count={10} color='primary' />
    </Box>
  );
};

export default Pagination;
