import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Box, Typography, Paper, Chip} from '@mui/material';

const AvailableBooksPieChart = () => {
  const data = [
    {value: 54, name: 'Fiction'},
    {value: 20, name: 'Self Help'},
    {value: 26, name: 'Business'},
  ];

  const colors = ['#3366cc', '#33cc33', '#cc3333'];

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: 'Available Books',
          type: 'pie',
          radius: ['45%', '65%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
          color: colors,
        },
      ],
    };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1.5,
        boxShadow: '0 4px 8px rgba(92, 92, 92, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          width: '100%',
        }}
      >
        <Typography variant='subtitle1' sx={{fontSize: '1rem'}}>
          Available Books
        </Typography>
        <Chip
          label='Today'
          size='small'
          sx={{mb: 0.5, '& .MuiChip-label': {fontSize: '0.7rem'}}}
        />
      </Box>
      <Box
        sx={{position: 'relative', width: '65%', maxWidth: 220, margin: 'auto'}}
      >
        <ReactECharts option={getOption()} style={{height: 220}} />
      </Box>
      <Box sx={{mt: 1.5}}>
        {data.map((item, index) => (
          <Box
            key={item.name}
            sx={{display: 'flex', alignItems: 'center', mb: 0.5}}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: colors[index],
                mr: 1,
              }}
            />
            <Typography variant='body2' sx={{fontSize: '0.8rem'}}>
              {item.name}: {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default AvailableBooksPieChart;
