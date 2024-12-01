import React, { useState } from "react";
import ResultsTable from "./ResultsTable";
import SearchForm from "./SearchForm";

export default function PublicInfo() {
  const [results, setResults] = useState([]);

  // Giả lập dữ liệu biên bản vi phạm (cho ví dụ)
  const mockData = [
    {
      id: 1,
      soBienBan: "BB001",
      ngayViPham: "2024-10-01",
      loaiViPham: "Giao thông",
      mucPhat: "1,000,000 VND",
      tinhTrang: "Chưa nộp",
    },
    {
      id: 2,
      soBienBan: "BB002",
      ngayViPham: "2024-10-05",
      loaiViPham: "An ninh",
      mucPhat: "500,000 VND",
      tinhTrang: "Đã nộp",
    },
    {
      id: 3,
      soBienBan: "BB003",
      ngayViPham: "2024-10-12",
      loaiViPham: "Giao thông",
      mucPhat: "2,000,000 VND",
      tinhTrang: "Đang xử lý",
    },
  ];

  const handleSearch = (criteria) => {
    // Thực hiện lọc kết quả dựa trên tiêu chí tìm kiếm
    const filteredResults = mockData.filter(
      (item) =>
        item.soBienBan.includes(criteria.soBienBan) ||
        item.loaiViPham.includes(criteria.loaiViPham) ||
        item.tinhTrang.includes(criteria.tinhTrang)
    );
    setResults(filteredResults);
  };
  return (
    <div>
      <header>
        <h1>Tra cứu Quyết định xử phạt</h1>
      </header>
      <SearchForm onSearch={handleSearch} />
      <ResultsTable results={results} />
      <footer>
        <p>Hỗ trợ: 091216 | Email: hotro@quannguyen.vn</p>
      </footer>
    </div>
  );
}
