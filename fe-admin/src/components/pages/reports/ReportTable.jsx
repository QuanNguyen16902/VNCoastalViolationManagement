// src/components/ReportTable.js

import { Button } from "@mui/material";
import { DatePicker } from "antd";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Alert, Col, Row, Spinner, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import authHeader from "../../../service/auth-header";
import apiConfig from "../../../utils/config";
// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportTable = () => {
  const [period, setPeriod] = useState("last_7_days");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null); // For custom date range
  const [endDate, setEndDate] = useState(null);

  // Hàm gọi API dựa trên khoảng thời gian
  const fetchReportData = async (selectedPeriod, start = null, end = null) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${apiConfig}reports/by_date/${selectedPeriod}`;
      if (selectedPeriod === "date_range" && start && end) {
        url = `${apiConfig}reports/by_date_range?startDate=${start}&endDate=${end}`;
      }
      const response = await axios.get(url, { headers: authHeader() });
      setReportData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };
  // Gọi API khi component được mount hoặc khi 'period' thay đổi
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0"); // Ngày
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (cần +1 vì getMonth() trả về từ 0-11)
    const year = date.getFullYear(); // Năm

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (period !== "date_range") {
      fetchReportData(period);
    } else if (startDate && endDate) {
      fetchReportData(
        "date_range",
        formatDate(startDate.toString()),
        formatDate(endDate.toString())
      );
    }
    // fetchReportData(period);
  }, [period, startDate, endDate]);

  // Hàm xử lý khi người dùng chọn khoảng thời gian
  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: reportData.map((item) => item.identified),
    datasets: [
      {
        label: "Tổng Phạt",
        data: reportData.map((item) => item.totalFines),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Tổng Quyết Định",
        data: reportData.map((item) => item.decisionCount),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Tổng Vi Phạm",
        data: reportData.map((item) => item.violationCount),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  // Các tùy chọn cho biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14, // Tăng kích thước font
            family: "Arial, sans-serif", // Đặt font rõ ràng
          },
          color: "#000", // Màu chữ
        },
      },
      title: {
        display: true,
        text: "Báo Cáo Doanh Số",
        font: {
          size: 18,
          family: "Arial, sans-serif",
        },
        color: "#000",
      },
      tooltip: {
        bodyFont: {
          size: 14,
          family: "Arial, sans-serif",
        },
        titleFont: {
          size: 16,
          family: "Arial, sans-serif",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
          color: "#000",
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
          color: "#000",
        },
      },
    },
    animation: {
      duration: 1000, // Thời gian animation (ms)
      easing: "easeOutQuart", // Loại easing
    },
  };

  return (
    <div className="container-lg mt-4 position-relative">
      {loading && (
        <div className="overlay">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <Row className="mb-3">
        <Col>
          <b className="me-2">SHOW BY</b>
          <Button
            variant={period === "last_7_days" ? "contained" : "outlined"}
            color="primary"
            className="me-2"
            onClick={() => handlePeriodChange("last_7_days")}
            disabled={loading}
          >
            7 Ngày Gần Nhất
          </Button>
          <Button
            variant={period === "last_30_days" ? "contained" : "outlined"}
            color="primary"
            className="me-2"
            onClick={() => handlePeriodChange("last_30_days")}
            disabled={loading}
          >
            30 Ngày Gần Nhất
          </Button>
          <Button
            variant={period === "last_6_months" ? "contained" : "outlined"}
            color="primary"
            className="me-2"
            onClick={() => handlePeriodChange("last_6_months")}
            disabled={loading}
          >
            6 Tháng Gần Nhất
          </Button>
          <Button
            variant={period === "last_year" ? "contained" : "outlined"}
            color="primary"
            className="me-2"
            onClick={() => handlePeriodChange("last_year")}
            disabled={loading}
          >
            1 Năm Gần Nhất
          </Button>
          <Button
            variant={period === "date_range" ? "contained" : "outlined"}
            color="primary"
            className="me-2"
            onClick={() => handlePeriodChange("date_range")}
            disabled={loading}
          >
            Khoảng ngày
          </Button>
          {period === "date_range" && (
            <>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="me-2"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
              />
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}
          {!error && reportData.length > 0 && (
            <>
              <div style={{ height: "400px", position: "relative" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <Table striped bordered hover className="mt-4 text-center">
                <thead style={{ backgroundColor: "#343a40", color: "#ffffff" }}>
                  <tr>
                    <th>Kỳ Báo Cáo</th>
                    <th>Tổng Phạt</th>
                    <th>Tổng Quyết Định</th>
                    <th>Tổng Vi Phạm</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.identified}</td>
                      <td>{formatCurrency(item.totalFines)}</td>
                      <td>{item.decisionCount}</td>
                      <td>{item.violationCount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <strong>Tổng</strong>
                    </td>
                    <td>
                      <strong>
                        {formatCurrency(
                          reportData.reduce(
                            (acc, item) => acc + item.totalFines,
                            0
                          )
                        )}
                      </strong>
                    </td>
                    <td>
                      <strong>
                        {reportData.reduce(
                          (acc, item) => acc + item.decisionCount,
                          0
                        )}
                      </strong>
                    </td>
                    <td>
                      <strong>
                        {reportData.reduce(
                          (acc, item) => acc + item.violationCount,
                          0
                        )}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
          {!loading && !error && reportData.length === 0 && (
            <p>Không có dữ liệu báo cáo cho khoảng thời gian này.</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReportTable;
