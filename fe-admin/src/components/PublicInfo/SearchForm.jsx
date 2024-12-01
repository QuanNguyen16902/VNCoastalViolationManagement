import React, { useState } from "react";

function SearchForm({ onSearch }) {
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [loaiViPham, setLoaiViPham] = useState("");
  const [tinhTrang, setTinhTrang] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ soQuyetDinh, loaiViPham, tinhTrang });
  };

  return (
    <div className="mb-3">
      <section id="search-section">
        <h2>Nhập thông tin để tra cứu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Số quyết định:
            <input
              className="form-control"
              type="text"
              value={soQuyetDinh}
              onChange={(e) => setSoQuyetDinh(e.target.value)}
              placeholder="Nhập số quyết định"
            />
          </label>
          <label>
            Loại vi phạm:
            <input
              className="form-control"
              type="text"
              value={loaiViPham}
              onChange={(e) => setLoaiViPham(e.target.value)}
              placeholder="Nhập loại vi phạm"
            />
          </label>
          <label>
            Tình trạng:
            <input
              className="form-control"
              type="text"
              value={tinhTrang}
              onChange={(e) => setTinhTrang(e.target.value)}
              placeholder="Nhập tình trạng"
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Tìm kiếm
          </button>
        </form>
      </section>
    </div>
  );
}

export default SearchForm;
