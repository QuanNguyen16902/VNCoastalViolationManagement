import React, { useState } from "react";
const SearchAdvanceFields = ({ selectedFields, onSearch }) => {
  const [formData, setFormData] = useState({
    maBienBan: "",
    soQuyetDinh: "",
    tenCoQuan: "",
    nguoiViPham: "",
    nguoiThiHanh: "",
    mucPhat: "",
    paid: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
    console.log(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="row ms-1">
          <div className="col-12 col-sm-10">
            <div className="row">
              {selectedFields.includes("maQuyetDinh") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Mã quyết định</label>
                  <input
                    type="text"
                    name="maQuyetDinh"
                    value={formData.maQuyetDinh}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("maBienBan") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Mã biên bản</label>
                  <input
                    type="text"
                    name="maBienBan"
                    value={formData.maBienBan}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("soQuyetDinh") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Số Quyết định</label>
                  <input
                    type="text"
                    name="soQuyetDinh"
                    value={formData.soQuyetDinh}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("tenCoQuan") && (
                <div className="col-12 col-sm-6 mb-2">
                  <label>Tên cơ quan</label>
                  <input
                    type="text"
                    name="tenCoQuan"
                    value={formData.tenCoQuan}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
            </div>
            <div className="row">
              {selectedFields.includes("nguoiViPham") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Người vi phạm</label>
                  <input
                    type="text"
                    name="nguoiViPham"
                    value={formData.nguoiViPham}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("nguoiThiHanh") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Người thi hành</label>
                  <input
                    type="text"
                    name="nguoiThiHanh"
                    value={formData.nguoiThiHanh}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("paid") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label htmlFor="paidSelect">Tình trạng</label>
                  <select
                    id="paidSelect"
                    name="paid" // Thêm name để handleChange nhận biết
                    value={formData.paid || ""} // Đảm bảo có giá trị mặc định
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Tất cả</option>
                    <option value="true">Đã thanh toán</option>
                    <option value="false">Chưa thanh toán</option>
                  </select>
                </div>
              )}
            </div>
            <div className="row">
              {selectedFields.includes("hieuLucThiHanh") && (
                <div className="col-12 col-sm-6 mb-2">
                  <label>Hiệu lực thi hành</label>
                  <div className="d-flex">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="form-control me-2"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-2 ">
            <button type="submit" className="btn btn-primary mt-4">
              Tìm kiếm
            </button>
          </div>
        </div>
      </form>
      {/* Thêm phần hiển thị kết quả tìm kiếm tại đây */}
    </div>
  );
};

export default SearchAdvanceFields;
