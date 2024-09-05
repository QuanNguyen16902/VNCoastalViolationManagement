import { Alert, Spin, Table, Tag } from "antd"; // Hoặc bất kỳ thư viện UI nào bạn sử dụng
import axios from "axios";
import React, { useEffect, useState } from "react";
import authHeader from "../../service/auth-header";

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/logs",
          { headers: authHeader() }
        );
        setLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text) => {
        let color;
        switch (text) {
            case 'CREATE':
                color = 'green';
                break;
            case 'UPDATE':
                color = 'blue';
                break;
            case 'DELETE':
                color = 'red';
                break;
            case 'GET':
                color = 'gold'; 
                break;
            default:
                color = 'gray';
        }
        return <Tag color={color}>{text}</Tag>;
    },
    },
    {
      title: "Chi tiết",
      dataIndex: "details",
      key: "details",
    },
  ];

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <div>
      <h2>Nhật ký hệ thống</h2>
      <Table
        dataSource={logs}
        caption="Nhật ký"
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default SystemLogs;
