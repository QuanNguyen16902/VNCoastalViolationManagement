import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import authHeader from "../../../service/auth-header";
import apiConfig from "../../../utils/config";
// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TotalFinesChart = ({ showByLast, option }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  // API call to fetch report data based on the selected option
  const fetchReportData = async (selectedOption) => {
    setLoading(true);
    setError(null);
    let url = `${apiConfig}reports/by_date/`;

    // Construct the URL based on the selected option
    switch (selectedOption) {
      case "last_day":
        url += "last_day";
        break;
      case "last_week":
        url += "last_7_days";
        break;
      case "last_month":
        url += "last_30_days";
        break;
      case "last_year":
        url += "last_year";
        break;
      default:
        url += "last_day"; // Fallback to last day if no option matches
    }

    try {
      const response = await axios.get(url, { headers: authHeader() });
      setReportData(response.data); // Set the report data after successful API call
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải dữ liệu báo cáo."); // Set error message in case of failure
    } finally {
      setLoading(false); // Always stop loading after the API call
    }
  };

  // Call the API whenever the 'option' prop changes
  useEffect(() => {
    fetchReportData(option.toLowerCase().replace(" ", "_"));
  }, [option]);

  // Transform the reportData into chart-friendly format
  const transformReportData = (data) => {
    const labels = data.map((entry) => entry.identified); // Date labels for the X-axis
    const finesData = data.map((entry) => entry.totalFines / 1000); // Scale fines to thousands

    return {
      labels: labels,
      datasets: [
        {
          label: "Tổng tiền phạt (Nghìn)",
          data: finesData,
          color: "#FFFFFF",
          borderColor: "#ffb74d", // Line color
          backgroundColor: "rgba(255, 183, 77, 0.5)", // Fill color under the line
          fill: true, // Enable fill under the line
        },
      ],
    };
  };

  useEffect(() => {
    if (reportData) {
      const transformedData = transformReportData(reportData);
      setChartData(transformedData);
    }
  }, [reportData]);

  // Chart.js options for the line chart
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: showByLast
          ? `Tiền Phạt Theo Thời Gian - ${showByLast}`
          : "Tiền Phạt Theo Thời Gian",
        color: "#FFFFFF", // Title text color
      },
      legend: {
        position: "top",
        labels: {
          color: "#FFFFFF", // Legend text color
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
          color: "#FFFFFF", // X-axis title color
        },
        ticks: {
          color: "#FFFFFF", // X-axis labels color
        },
      },
      y: {
        title: {
          display: true,
          text: "Tổng phạt",
          color: "#FFFFFF", // Y-axis title color
        },
        beginAtZero: true,
        ticks: {
          color: "#FFFFFF", // Y-axis labels color
          font: {
            size: 14, // Increase font size for better visibility
          },
        },
      },
    },
    elements: {
      point: {
        radius: 6, // Increase the size of data points for better visibility
        backgroundColor: "#FFD700", // Bright yellow color for data points
      },
    },
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Display a loading message
  }

  if (error) {
    return <div>{error}</div>; // Display an error message if the API fails
  }

  return (
    <div>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Line height="200px" data={chartData} options={chartOptions} />
      ) : (
        <div>Không có dữ liệu để hiển thị.</div> // Show message if there's no data
      )}
    </div>
  );
};

export default TotalFinesChart;
