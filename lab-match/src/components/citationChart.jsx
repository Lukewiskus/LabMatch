import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements and plugins with Chart.js
ChartJS.register(LineElement, PointElement, Title, Tooltip, Legend);

const CitationChart = ({ data }) => {
  // Extract keys (years) and values (counts) from the data object
  const years = Object.keys(data);
  const counts = Object.values(data);

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
      <h2>Publications per Year (Line Chart)</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              position: 'top',
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

              suggestedMin: 0, // Ensure y-axis starts from zero
            },
          },
        }}
      />
    </div>
  );
};

export default CitationChart;
