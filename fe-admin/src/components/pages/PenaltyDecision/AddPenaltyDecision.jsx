// src/AddPenaltyDecision.js

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import diaphuongData from "../../../data/diaphuong.json";
import { Vipham } from "../../../data/dieukhoan";
import decisionService from "../../../service/decision.service";
import "./PenaltyDecision.css";
const generateOptions = (data) => {
  return data.map((item) => ({
    label: `${item.noi_dung}`, // Đặt label cho điều
    value: `${item.noi_dung}`, // Giá trị cho điều
    options: item.Khoan.flatMap((khoan) => {
      // Nếu có điểm, tạo mục riêng cho từng điểm
      if (khoan.diem && khoan.diem.length > 0) {
        // Mục cho Khoản
        // const khoanOption = {
        //   label: `Khoản ${khoan.noi_dung}`, // Đặt label cho khoản
        //   value: `${item.noi_dung}, Khoản ${khoan.noi_dung}`, // Giá trị cho khoản, bao gồm điều
        // };

        // Các mục cho từng Điểm
        const diemOptions = khoan.diem.map((diem) => ({
          label: `Khoản ${khoan.noi_dung} Điểm ${diem.noi_dung}`, // Đặt label cho điểm
          value: `${item.noi_dung}, Khoản ${khoan.noi_dung}, Điểm ${diem.noi_dung}`, // Giá trị cho điểm, bao gồm điều
        }));

        // Gộp mục Khoản và các mục Điểm lại
        return [...diemOptions];
      }
      // Nếu không có điểm, chỉ trả về mục Khoản
      return {
        label: `Khoản ${khoan.noi_dung}`, // Đặt label cho khoản
        value: `${item.noi_dung}, Khoản ${khoan.noi_dung}`, // Giá trị cho khoản, bao gồm điều
      };
    }),
  }));
};

const options = generateOptions(Vipham);

const years = [];
for (let year = 1920; year <= 2024; year++) {
  years.push(year);
}
const AddPenaltyDecision = () => {
  const [currentUser, setCurrentUser] = useState("");
  const handleSelectChange = (e) => {
    setMainData({
      ...mainData,
      viPhamDieuKhoan: e.target.value, // Cập nhật giá trị viPhamDieuKhoan
    });
  };
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(currentUser);
    console.log(currentUser.email);
  }, []);

  // State cho các trường chính
  const [mainData, setMainData] = useState({
    tenCoQuan: "",
    soVanBan: "",
    thanhPho: "",
    nghiDinh: "",
    xuPhatChinh: "",
    mucPhat: "",
    xuPhatBoSung: "",
    bienPhapKhacPhuc: "",
    viPhamDieuKhoan: "",
    hieuLucThiHanh: "",
    diaChiKhoBac: "",
  });

  // State cho nguoiViPham
  const [violationPerson, setViolationPerson] = useState({
    nguoiViPham: "",
    namSinh: "",
    ngheNghiep: "",
    diaChi: "",
    canCuoc: "",
    noiCap: "",
    ngayCap: "",
    hanhVi: "",
  });

  // State cho nguoiThihanh
  const [executor, setExecutor] = useState({
    ten: "",
    capBac: "",
    chucVu: "",
    donVi: "",
  });
  const validateFields = () => {
    const errors = {};
    if (!mainData.tenCoQuan || mainData.tenCoQuan.trim() === "") {
      errors.tenCoQuan = "Tên cơ quan không được để trống.";
    }

    if (!mainData.soVanBan || mainData.soVanBan.trim() === "") {
      errors.soVanBan = "Số văn bản không được để trống.";
    }

    if (!mainData.thanhPho || mainData.thanhPho.trim() === "") {
      errors.thanhPho = "Thành phố không được để trống.";
    }

    if (!mainData.nghiDinh || mainData.nghiDinh.trim() === "") {
      errors.nghiDinh = "Nghị định không được để trống.";
    }

    if (!mainData.xuPhatChinh || mainData.xuPhatChinh.trim() === "") {
      errors.xuPhatChinh = "Hình thức xử phạt chính không được để trống.";
    }

    if (!mainData.mucPhat || mainData.mucPhat.trim() === "") {
      errors.mucPhat = "Mức phạt không được để trống.";
    }
    if (mainData.mucPhat && isNaN(Number(mainData.mucPhat))) {
      errors.mucPhat = "Mức phạt phải là số.";
    }

    if (!mainData.xuPhatBoSung || mainData.xuPhatBoSung.trim() === "") {
      errors.xuPhatBoSung = "Hình thức xử phạt bổ sung không được để trống.";
    }

    if (!mainData.bienPhapKhacPhuc || mainData.bienPhapKhacPhuc.trim() === "") {
      errors.bienPhapKhacPhuc = "Biện pháp khắc phục không được để trống.";
    }

    if (!mainData.viPhamDieuKhoan || mainData.viPhamDieuKhoan.trim() === "") {
      errors.viPhamDieuKhoan = "Vi phạm điều khoản không được để trống.";
    }

    if (!mainData.hieuLucThiHanh) {
      errors.hieuLucThiHanh = "Hiệu lực thi hành không được để trống.";
    }
    if (mainData.hieuLucThiHanh) {
      const date = new Date(mainData.hieuLucThiHanh);
      if (isNaN(date.getTime())) {
        errors.hieuLucThiHanh = "Hiệu lực thi hành không hợp lệ.";
      }
    }

    if (!mainData.diaChiKhoBac || mainData.diaChiKhoBac.trim() === "") {
      errors.diaChiKhoBac = "Địa chỉ kho bạc không được để trống.";
    }

    // Validate violation person fields
    if (
      !violationPerson.nguoiViPham ||
      violationPerson.nguoiViPham.trim() === ""
    ) {
      errors.nguoiViPham = "Người vi phạm không được để trống.";
    }

    if (!violationPerson.namSinh) {
      errors.namSinh = "Năm sinh không được để trống.";
    } else if (
      isNaN(violationPerson.namSinh) ||
      violationPerson.namSinh < 1900 ||
      violationPerson.namSinh > new Date().getFullYear()
    ) {
      errors.namSinh = "Năm sinh phải là số hợp lệ.";
    }

    if (
      !violationPerson.ngheNghiep ||
      violationPerson.ngheNghiep.trim() === ""
    ) {
      errors.ngheNghiep = "Nghề nghiệp không được để trống.";
    }

    if (!violationPerson.diaChi || violationPerson.diaChi.trim() === "") {
      errors.diaChi = "Địa chỉ không được để trống.";
    }

    if (!violationPerson.canCuoc || violationPerson.canCuoc.trim() === "") {
      errors.canCuoc = "Căn cước không được để trống.";
    }

    // Validate executor fields
    if (!executor.ten || executor.ten.trim() === "") {
      errors.ten = "Tên người thi hành không được để trống.";
    }

    if (!executor.donVi || executor.donVi.trim() === "") {
      errors.donVi = "Đơn vị không được để trống.";
    }

    return errors;
  };

  // Xử lý thay đổi cho các trường chính
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMainData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý thay đổi cho nguoiViPham
  const handleViolationPersonChange = (e) => {
    const { name, value } = e.target;
    setViolationPerson({
      ...violationPerson,
      [name]: value,
    });
  };

  // Xử lý thay đổi cho nguoiThihanh
  const handleExecutorChange = (e) => {
    const { name, value } = e.target;
    setExecutor({
      ...executor,
      [name]: value,
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return; // Stop the function if there are errors
    }
    // Xây dựng payload theo cấu trúc yêu cầu
    const payload = {
      ...mainData,
      hieuLucThiHanh: new Date(mainData.hieuLucThiHanh).toISOString(), // Chuyển đổi sang định dạng ISO
      nguoiViPham: {
        ...violationPerson,
        namSinh: Number(violationPerson.namSinh), // Chuyển đổi năm sinh thành số
      },
      nguoiThiHanh: {
        ...executor,
      },
    };

    try {
      const response = await decisionService.addDecision(payload);
      console.log(response);
      toast.success("Tạo quyết định xử phạt thành công!");

      setMainData({
        tenCoQuan: "",
        soVanBan: "",
        thanhPho: "",
        nghiDinh: "",
        xuPhatChinh: "",
        mucPhat: "",
        xuPhatBoSung: "",
        bienPhapKhacPhuc: "",
        viPhamDieuKhoan: "",
        hieuLucThiHanh: "",
        diaChiKhoBac: "",
      });
      setViolationPerson({
        nguoiViPham: "",
        namSinh: "",
        ngheNghiep: "",
        diaChi: "",
        canCuoc: "",
        noiCap: "",
        ngayCap: "",
        hanhVi: "",
      });
      setExecutor({
        ten: "",
        capBac: "",
        donVi: "",
        chucVu: "",
      });
    } catch (error) {
      console.error("Lỗi khi tạo quyết định:", error);
      toast.error("Lỗi tạo quyết định xử phạt, hãy thử lại.");
    }
  };

  return (
    <div id="box" className="container-xl bg-white ps-5 pe-lg-5 pt-4">
      <h1 className="text-center fw-700 mb-3">Quyết Định Xử Phạt</h1>
      <form onSubmit={handleSubmit}>
        {/* Các trường chính */}
        {/* Thông Tin Văn Bản */}
        <fieldset style={{ marginBottom: "20px" }}>
          <div className="mb-3 row">
            <h4>
              <b>
                <i>Thông tin văn bản</i>
              </b>
            </h4>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="tenCoQuan" className="form-label">
                  Tên cơ quan hành chính:
                </label>
                <input
                  type="text"
                  id="tenCoQuan"
                  name="tenCoQuan"
                  className="form-control"
                  value={mainData.tenCoQuan}
                  onChange={handleMainChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="soVanBan" className="form-label">
                  Số văn bản:
                </label>
                <input
                  type="text"
                  id="soVanBan"
                  name="soVanBan"
                  className="form-control"
                  value={mainData.soVanBan}
                  onChange={handleMainChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="thanhPho" className="form-label">
                  Thành phố:
                </label>
                <select
                  id="thanhPho"
                  name="thanhPho"
                  className="form-select"
                  value={mainData.thanhPho}
                  onChange={handleMainChange}
                  required
                >
                  <option value="">Chọn thành phố</option>
                  {diaphuongData.map((item) => (
                    <option key={item.stt} value={item.dia_phuong}>
                      {item.viet_tat} - {item.dia_phuong}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="nghiDinh" className="form-label">
                  Căn cứ vào Nghị Định:
                </label>
                <input
                  type="text"
                  id="nghiDinh"
                  name="nghiDinh"
                  className="form-control"
                  value={mainData.nghiDinh}
                  onChange={handleMainChange}
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Thông Tin Người Thi Hành */}
        <fieldset style={{ marginBottom: "20px" }}>
          <div className="mb-3 row">
            <h4>
              <b>
                <i>Thông tin người thi hành</i>
              </b>
            </h4>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="ten" className="form-label">
                  Tên:
                </label>
                <input
                  type="text"
                  id="ten"
                  name="ten"
                  className="form-control"
                  value={executor.ten}
                  onChange={handleExecutorChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="capBac" className="form-label">
                  Cấp bậc:
                </label>
                <input
                  type="text"
                  id="capBac"
                  name="capBac"
                  className="form-control"
                  value={executor.capBac}
                  onChange={handleExecutorChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="chucVu" className="form-label">
                  Chức vụ:
                </label>
                <input
                  type="text"
                  id="chucVu"
                  name="chucVu"
                  className="form-control"
                  value={executor.chucVu}
                  onChange={handleExecutorChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="donVi" className="form-label">
                  Đơn vị:
                </label>
                <input
                  type="text"
                  id="donVi"
                  name="donVi"
                  className="form-control"
                  value={executor.donVi}
                  onChange={handleExecutorChange}
                  required
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Thông Tin Người Vi Phạm */}
        <fieldset style={{ marginBottom: "20px" }}>
          <h4 className="title p-2">
            <b>
              <i>Thông tin người vi phạm / Tổ chức vi phạm</i>
            </b>
          </h4>

          <div className="row">
            {/* Cột 1 */}
            <div className="col-md-6">
              {/* Người vi phạm */}
              <div className="mb-3 row">
                <label
                  htmlFor="nguoiViPham"
                  className="col-sm-4 col-form-label"
                >
                  Người vi phạm
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="nguoiViPham"
                    name="nguoiViPham"
                    className="form-control"
                    value={violationPerson.nguoiViPham}
                    onChange={handleViolationPersonChange}
                    required
                  />
                </div>
              </div>

              {/* Năm sinh */}
              <div className="mb-3 row">
                <label htmlFor="namSinh" className="col-sm-4 col-form-label">
                  Năm sinh:
                </label>
                <div className="col-sm-8">
                  <select
                    id="namSinh"
                    name="namSinh"
                    className="form-select"
                    value={violationPerson.namSinh}
                    onChange={handleViolationPersonChange}
                    required
                  >
                    <option value="">Chọn năm sinh</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nghề nghiệp/Lĩnh vực hoạt động */}
              <div className="mb-3 row">
                <label htmlFor="ngheNghiep" className="col-sm-4 col-form-label">
                  Nghề nghiệp/Lĩnh vực hoạt động
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="ngheNghiep"
                    name="ngheNghiep"
                    className="form-control"
                    value={violationPerson.ngheNghiep}
                    onChange={handleViolationPersonChange}
                    required
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="mb-3 row">
                <label htmlFor="diaChi" className="col-sm-4 col-form-label">
                  Địa chỉ:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="diaChi"
                    name="diaChi"
                    className="form-control"
                    value={violationPerson.diaChi}
                    onChange={handleViolationPersonChange}
                    required
                  />
                </div>
              </div>

              {/* CCCD hoặc Mã số thuế */}
              <div className="mb-3 row">
                <label htmlFor="canCuoc" className="col-sm-4 col-form-label">
                  CCCD hoặc Mã số thuế:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="canCuoc"
                    name="canCuoc"
                    className="form-control"
                    value={violationPerson.canCuoc}
                    onChange={handleViolationPersonChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="col-md-6">
              {/* Nơi cấp */}
              <div className="mb-3 row">
                <label htmlFor="noiCap" className="col-sm-4 col-form-label">
                  Nơi cấp:
                </label>
                <div className="col-sm-8">
                  <select
                    id="noiCap"
                    name="noiCap"
                    className="form-select"
                    value={violationPerson.noiCap}
                    onChange={handleViolationPersonChange}
                    required
                  >
                    <option value="">Chọn nơi cấp</option>
                    {diaphuongData.map((item) => (
                      <option key={item.stt} value={item.dia_phuong}>
                        {item.viet_tat} - {item.dia_phuong}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ngày cấp */}
              <div className="mb-3 row">
                <label htmlFor="ngayCap" className="col-sm-4 col-form-label">
                  Ngày cấp:
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    id="ngayCap"
                    name="ngayCap"
                    className="form-control"
                    value={violationPerson.ngayCap}
                    onChange={handleViolationPersonChange}
                    required
                  />
                </div>
              </div>

              {/* Hành vi vi phạm */}
              <div className="mb-3 row">
                <label htmlFor="hanhVi" className="col-sm-4 col-form-label">
                  Hành vi vi phạm:
                </label>
                <div className="col-sm-8">
                  <textarea
                    rows="3"
                    id="hanhVi"
                    name="hanhVi"
                    className="form-control"
                    value={violationPerson.hanhVi}
                    onChange={handleViolationPersonChange}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Các trường ý kiến */}
        <fieldset style={{ marginBottom: "20px" }}>
          <legend>
            <h4>
              <b>
                <i>Hình thức xử phạt</i>
              </b>
            </h4>
          </legend>
          <div className="mb-3 row">
            <label htmlFor="xuPhatChinh" className="col-sm-3 col-form-label">
              Hình thức xử phạt chính:
            </label>
            <div className="col-sm-9">
              <textarea
                id="xuPhatChinh"
                name="xuPhatChinh"
                className="form-control"
                value={mainData.xuPhatChinh}
                onChange={handleMainChange}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="xuPhatBoSung" className="col-sm-3 col-form-label">
              Hình thức xử phạt bổ sung:
            </label>
            <div className="col-sm-9">
              <textarea
                id="xuPhatBoSung"
                name="xuPhatBoSung"
                className="form-control"
                value={mainData.xuPhatBoSung}
                onChange={handleMainChange}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="mucPhat" className="col-sm-3 col-form-label">
              Mức phạt:
            </label>
            <div className="col-sm-9">
              <input
                id="mucPhat"
                name="mucPhat"
                className="form-control"
                value={mainData.mucPhat}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label
              htmlFor="bienPhapKhacPhuc"
              className="col-sm-3 col-form-label"
            >
              Biện pháp khắc phục hậu quả:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="bienPhapKhacPhuc"
                name="bienPhapKhacPhuc"
                className="form-control"
                value={mainData.bienPhapKhacPhuc}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="hanhVi" className="col-sm-3 col-form-label">
              Hành vi vi phạm hành chính:
            </label>
            <div className="col-sm-9">
              <textarea
                type="text"
                id="hanhVi"
                name="hanhVi"
                className="form-control"
                value={violationPerson.hanhVi}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="tamGiu" className="col-sm-3 col-form-label">
              Quy định tại:
            </label>
            <div className="col-sm-9">
              <select
                id="viPhamDieuKhoan"
                name="viPhamDieuKhoan"
                className="form-select"
                value={mainData.viPhamDieuKhoan}
                onChange={handleSelectChange} // Giữ nguyên hàm xử lý thay đổi
              >
                <option value="">Chọn điều, khoản, điểm</option>
                {options.map((option) => (
                  <optgroup
                    title={option.value}
                    label={option.label}
                    key={option.value}
                  >
                    {option.options.map((subOption) => (
                      <option
                        title={subOption.value}
                        value={subOption.value}
                        key={subOption.value}
                      >
                        {subOption.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="hieuLucThiHanh" className="col-sm-3 col-form-label">
              Có hiệu lực từ ngày:
            </label>
            <div className="col-sm-9">
              <input
                type="datetime-local"
                id="hieuLucThiHanh"
                name="hieuLucThiHanh"
                className="form-control"
                value={mainData.hieuLucThiHanh}
                onChange={handleMainChange}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="diaChiKhoBac" className="col-sm-3 col-form-label">
              Địa chỉ Kho bạc Nhà nước:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="diaChiKhoBac"
                name="diaChiKhoBac"
                className="form-control"
                value={mainData.diaChiKhoBac}
                onChange={handleMainChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Nút Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Tạo quyết định
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPenaltyDecision;
