'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart elements and plugins with Chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type CitationChartProps = {
  data: Record<string, number>;
};

const CitationChart: React.FC<CitationChartProps> = ({ data }) => {
  // Extract keys (years) and values (counts) from the data object
  const years = Object.keys(data).sort(); // Ensure the years are sorted
  const counts = years.map((year) => data[year]);

  // Prepare chart data in the format required by Chart.js
  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Citations Per Year',
        data: counts,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Publications Per Year (Line Chart)</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Citations',
              },
              beginAtZero: true, // Ensure y-axis starts from zero
            },
          },
        }}
      />
    </div>
  );
};

export default CitationChart;
