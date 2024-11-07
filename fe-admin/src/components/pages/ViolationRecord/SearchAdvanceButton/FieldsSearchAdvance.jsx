import React, { useState } from "react";
const SearchAdvanceFields = ({ selectedFields, onSearch }) => {
  const [formData, setFormData] = useState({
    maBienBan: "",
    soVanBan: "",
    tenCoQuan: "",

    nguoiViPham: "",
    nguoiLap: "",
    nguoiThietHai: "",
    nguoiChungKien: "",
    linhVuc: "",
    resolved: "",
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
              {selectedFields.includes("soVanBan") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Số văn bản</label>
                  <input
                    type="text"
                    name="soVanBan"
                    value={formData.soVanBan}
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
              {selectedFields.includes("nguoiLap") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Người lập biên bản</label>
                  <input
                    type="text"
                    name="nguoiLap"
                    value={formData.nguoiLap}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("nguoiThietHai") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Người thiệt hại</label>
                  <input
                    type="text"
                    name="nguoiThietHai"
                    value={formData.nguoiThietHai}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("nguoiChungKien") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label>Người chứng kiến</label>
                  <input
                    type="text"
                    name="nguoiChungKien"
                    value={formData.nguoiChungKien}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
            </div>
            <div className="row">
              {selectedFields.includes("linhVuc") && (
                <div className="col-12 col-sm-6 mb-2">
                  <label>Lĩnh vực</label>
                  <input
                    type="text"
                    name="linhVuc"
                    value={formData.linhVuc}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              )}
              {selectedFields.includes("resolved") && (
                <div className="col-12 col-sm-3 mb-2">
                  <label htmlFor="resolvedSelect">Tình trạng</label>
                  <select
                    id="resolvedSelect"
                    name="resolved" // Thêm name để handleChange nhận biết
                    value={formData.resolved || ""} // Đảm bảo có giá trị mặc định
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Tất cả</option>
                    <option value="true">Đã giải quyết</option>
                    <option value="false">Chưa giải quyết</option>
                  </select>
                </div>
              )}
            </div>
            <div className="row">
              {selectedFields.includes("thoiGianLap") && (
                <div className="col-12 col-sm-6 mb-2">
                  <label>Thời gian lập</label>
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
