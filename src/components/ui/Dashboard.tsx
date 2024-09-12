"use client";
import React from "react";
import { FaBox, FaUsers, FaChartLine } from "react-icons/fa"; // Icons
import { Line } from "react-chartjs-2"; // Line chart component
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // Data for the line chart
  const visitorData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Days of the week
    datasets: [
      {
        label: "Website Visitors",
        data: [1200, 1900, 800, 1500, 2200, 3000, 2800], // Dummy data
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Weekly Website Visitors",
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card for Total Products */}
        <div className="card shadow-lg bg-primary text-primary-content">
          <div className="card-body items-center text-center">
            <FaBox className="text-6xl mb-4" />
            <h2 className="card-title text-2xl font-bold">Total Products</h2>
            <p className="text-4xl font-semibold">150</p>
            <progress className="progress progress-accent w-full mt-2" value="70" max="100"></progress>
            <p className="text-sm text-accent mt-2">70% of product goal reached</p>
          </div>
        </div>

        {/* Card for Total Users */}
        <div className="card shadow-lg bg-secondary text-secondary-content">
          <div className="card-body items-center text-center">
            <FaUsers className="text-6xl mb-4" />
            <h2 className="card-title text-2xl font-bold">Total Users</h2>
            <p className="text-4xl font-semibold">200</p>
            <progress className="progress progress-primary w-full mt-2" value="85" max="100"></progress>
            <p className="text-sm text-primary mt-2">85% of user goal reached</p>
          </div>
        </div>

        {/* Card for Website Visitors with Line Chart */}
        <div className="card shadow-lg bg-accent text-accent-content">
          <div className="card-body items-center text-center">
            <FaChartLine className="text-6xl mb-4" />
            <h2 className="card-title text-2xl font-bold">Website Visitors</h2>
            <p className="text-4xl font-semibold">5,000</p>
            <div className="w-full bg-white rounded-lg p-2 mt-2">
              <Line data={visitorData} options={options} /> {/* Line chart component */}
            </div>
            <p className="text-sm mt-2">Tracking weekly visitors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
