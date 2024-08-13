import React, {useState} from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {Box, Typography, Paper, Select, MenuItem} from '@mui/material';
import moment from 'moment';

const EarningSummaryChart = () => {
  const [timeRange, setTimeRange] = useState('last6months');

  const getOption = () => {
    const currentDate = moment();
    let labels, data1, data2;

    if (timeRange === 'last6months') {
      labels = Array.from({length: 6}, (_, i) =>
        currentDate
          .clone()
          .subtract(5 - i, 'months')
          .format('MMM')
      );
      data1 = [150, 250, 180, 220, 250, 230];
      data2 = [120, 200, 150, 180, 200, 190];
    } else if (timeRange === 'lastYear') {
      labels = Array.from({length: 12}, (_, i) =>
        currentDate
          .clone()
          .subtract(11 - i, 'months')
          .format('MMM')
      );
      data1 = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320];
      data2 = [90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310];
    } else {
      labels = Array.from({length: 24}, (_, i) =>
        currentDate
          .clone()
          .subtract(23 - i, 'months')
          .format('MMM YY')
      );
      data1 = Array.from(
        {length: 24},
        () => Math.floor(Math.random() * 200) + 100
      );
      data2 = Array.from(
        {length: 24},
        () => Math.floor(Math.random() * 200) + 100
      );
    }

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return params
            .map((param) => `${param.seriesName}: ${param.value}k Birr`)
            .join('<br>');
        },
      },
      legend: {
        data: ['This Year', 'Last Year'],
        top: 0,
        textStyle: {
          fontSize: 12,
          color: '#666',
        },
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLabel: {
          fontSize: 10,
          interval: timeRange === 'last2Years' ? 'auto' : 0,
          rotate: timeRange === 'last2Years' ? 45 : 0,
          color: '#666',
        },
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}k',
          fontSize: 10,
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#ddd',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: 'This Year',
          type: 'line',
          data: data1,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(64, 158, 255, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(64, 158, 255, 0)',
              },
            ]),
          },
          lineStyle: {
            color: '#409EFF',
            width: 2,
          },
          itemStyle: {
            color: '#409EFF',
            borderWidth: 2,
          },
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          name: 'Last Year',
          type: 'line',
          data: data2,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(238, 99, 99, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(238, 99, 99, 0)',
              },
            ]),
          },
          lineStyle: {
            color: '#EE6363',
            width: 2,
          },
          itemStyle: {
            color: '#EE6363',
            borderWidth: 2,
          },
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
    };
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant='h6'
          sx={{fontSize: '1.1rem', fontWeight: 600, color: '#333'}}
        >
          Earning Summary
        </Typography>
        <Select
          size='small'
          value={timeRange}
          onChange={handleTimeRangeChange}
          sx={{
            minWidth: 130,
            height: 36,
            fontSize: '0.9rem',
            '& .MuiSelect-select': {
              padding: '8px 14px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ddd',
            },
          }}
        >
          <MenuItem value='last6months' sx={{fontSize: '0.9rem'}}>
            Last 6 Months
          </MenuItem>
          <MenuItem value='lastYear' sx={{fontSize: '0.9rem'}}>
            Last Year
          </MenuItem>
          <MenuItem value='last2Years' sx={{fontSize: '0.9rem'}}>
            Last 2 Years
          </MenuItem>
        </Select>
      </Box>
      <ReactECharts option={getOption()} style={{height: 300}} />
    </Paper>
  );
};

export default EarningSummaryChart;
