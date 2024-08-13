import React from 'react';
import {Box, Typography, Paper, Chip, Divider} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ThisMonthStatistics: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1.5,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Typography variant='subtitle1' sx={{fontSize: '1rem', mb: 0.5}}>
        This Month Statistics
      </Typography>
      <Typography variant='caption' color='text.secondary' sx={{fontSize: '0.75rem', mb: 1, display: 'block'}}>
        Tue, 14 Nov, 2024, 11:30 AM
      </Typography>

      <Box sx={{mt: 1.5}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          <Typography variant='subtitle2' sx={{fontSize: '0.9rem'}}>Income</Typography>
          <Chip label='This Month' size='small' sx={{mb: 0.5, height: 20, '& .MuiChip-label': {fontSize: '0.7rem'}}} />
        </Box>

        <Divider />
        <Typography variant='h5' sx={{fontWeight: 'bold', mt: 0.5, fontSize: '1.2rem'}}>
          ETB 9460.00
        </Typography>
        <Typography
          variant='caption'
          color='error'
          sx={{display: 'flex', alignItems: 'center', fontSize: '0.75rem'}}
        >
          <ArrowDropDownIcon fontSize='small' /> 1.5%
        </Typography>
        <Typography variant='caption' color='text.secondary' sx={{fontSize: '0.75rem', display: 'block'}}>
          Compared to ETB9940 last month
        </Typography>
        <Typography variant='body2' sx={{mt: 0.5, fontSize: '0.8rem'}}>
          Last Month Income <strong>ETB 25658.00</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

export default ThisMonthStatistics;