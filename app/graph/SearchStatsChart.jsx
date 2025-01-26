import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './SearchStatsChart.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SearchStatsChart = ({ searchedLowerValue, foundLowerValue, searchedGreaterValue, foundGreaterValue }) => {
  
  const data = {
    labels: ['Lower', 'Greater'],
    datasets: [
      {
        label: 'Searched',
        data: [searchedLowerValue, searchedGreaterValue],
        backgroundColor: 'rgba(87, 123, 193, 1)',
      },
      {
        label: 'Found',
        data: [foundLowerValue, foundGreaterValue],
        backgroundColor: 'rgba(101, 146, 135, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Number of CDPs',
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SearchStatsChart;
