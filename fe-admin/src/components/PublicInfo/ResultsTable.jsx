import React from "react";

function ResultsTable({ results }) {
  return (
    <div className="container-xl">
      <section id="result-section">
        <h2>Kết quả tra cứu</h2>
        <table className="table table-stripped">
          <thead>
            <tr>
              <th>Số biên bản</th>
              <th>Ngày vi phạm</th>
              <th>Loại vi phạm</th>
              <th>Mức phạt</th>
              <th>Tình trạng</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((result) => (
                <tr key={result.id}>
                  <td>{result.soBienBan}</td>
                  <td>{result.ngayViPham}</td>
                  <td>{result.loaiViPham}</td>
                  <td>{result.mucPhat}</td>
                  <td>{result.tinhTrang}</td>
                  <td>
                    <button>Xem chi tiết</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Không có kết quả phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ResultsTable;
