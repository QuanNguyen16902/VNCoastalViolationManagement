// src/AddViolationRecord.js

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import diaphuongData from "../../../data/diaphuong.json";
import { Vipham } from "../../../data/dieukhoan";
import violationService from "../../../service/violation.service";
import "./bienban.css";
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
const AddViolationRecord = () => {
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
    soVanBan: "",
    thoiGianLap: "",
    nguoiLap: currentUser.username,
    nguoiChungKien: "",
    viPhamDieuKhoan: "",
    nguoiThietHai: "",
    bienPhapNganChan: "",
    tamGiu: "",
    yeuCau: "",
    ykienNguoiDaiDien: "",
    ykienNguoiChungKien: "",
    ykienNguoiThietHai: "",
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

  // State cho tauViPham
  const [violationShip, setViolationShip] = useState({
    thoiGianViPham: "",
    diaDiem: "",
    tongDungTich: "",
    soHieuTau: "",
    congSuat: "",
    haiTrinhCapPhep: "",
    toaDoX: "",
    toaDoY: "",
    haiTrinhThucTe: "",
  });
  const validateFields = () => {
    const errors = {};

    // Validate main data fields
    if (!mainData.soVanBan) errors.soVanBan = "Số văn bản không được để trống.";
    if (!mainData.thoiGianLap)
      errors.thoiGianLap = "Thời gian lập không được để trống.";
    if (!mainData.viPhamDieuKhoan)
      errors.viPhamDieuKhoan = "Vi phạm điều khoản không được để trống.";
    if (!mainData.nguoiThietHai)
      errors.nguoiThietHai = "Người thiệt hại không được để trống.";

    // Validate violation person fields
    if (!violationPerson.nguoiViPham)
      errors.nguoiViPham = "Người vi phạm không được để trống.";
    if (!violationPerson.namSinh)
      errors.namSinh = "Năm sinh không được để trống.";
    if (!violationPerson.ngheNghiep)
      errors.ngheNghiep = "Nghề nghiệp không được để trống.";
    if (!violationPerson.diaChi) errors.diaChi = "Địa chỉ không được để trống.";
    if (!violationPerson.canCuoc)
      errors.canCuoc = "Căn cước không được để trống.";

    // Validate violation ship fields
    if (!violationShip.soHieuTau)
      errors.soHieuTau = "Số hiệu tàu không được để trống.";
    if (!violationShip.diaDiem)
      errors.diaDiem = "Địa điểm không được để trống.";

    return errors;
  };

  // Xử lý thay đổi cho các trường chính
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMainData((prevData) => ({
      ...prevData,
      [name]: value,
      nguoiLap: currentUser?.username || prevData.nguoiLap,
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

  // Xử lý thay đổi cho tauViPham
  const handleViolationShipChange = (e) => {
    const { name, value } = e.target;
    setViolationShip({
      ...violationShip,
      [name]: value,
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error); // Display error message
      });
      return; // Stop the function if there are errors
    }
    // Xây dựng payload theo cấu trúc yêu cầu
    const payload = {
      ...mainData,
      nguoiViPham: {
        ...violationPerson,
        namSinh: Number(violationPerson.namSinh),
        toaDoX: Number(violationShip.toaDoX),
        toaDoY: Number(violationShip.toaDoY),
      },
      tauViPham: {
        ...violationShip,
        tongDungTich: Number(violationShip.tongDungTich),
      },
      file: null,
    };

    try {
      const response = await violationService.addViolation(payload);
      console.log(response);
      toast.success("Tạo biên bản vi phạm thành công!");

      setMainData({
        soVanBan: "",
        thoiGianLap: "",
        nguoiLap: "",
        nguoiChungKien: "",
        viPhamDieuKhoan: "",
        nguoiThietHai: "",
        bienPhapNganChan: "",
        tamGiu: "",
        yeuCau: "",
        ykienNguoiDaiDien: "",
        ykienNguoiChungKien: "",
        ykienNguoiThietHai: "",
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
      setViolationShip({
        thoiGianViPham: "",
        diaDiem: "",
        tongDungTich: "",
        soHieuTau: "",
        congSuat: "",
        haiTrinhCapPhep: "",
        toaDoX: "",
        toaDoY: "",
        haiTrinhThucTe: "",
      });
    } catch (error) {
      console.error("Lỗi khi tạo biên bản:", error);
      toast.error("Lỗi tạo biên bản vi phạm, hãy thử lại.");
    }
  };

  return (
    <div id="box" className="container-xl bg-white ps-5 pe-lg-5 pt-4">
      <h1 className="text-center fw-700 mb-3">Biên bản vi phạm</h1>
      <form onSubmit={handleSubmit}>
        {/* Các trường chính */}
        <fieldset style={{ marginBottom: "20px" }}>
          <div className="mb-3 row">
            <h4>
              <b>
                <i>Thông tin văn bản</i>
              </b>
            </h4>
            <label htmlFor="soVanBan" className="col-sm-3 col-form-label">
              Số văn bản:
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="thoiGianLap" className="col-sm-3 col-form-label">
              Thời gian lập:
            </label>
            <div className="col-sm-9">
              <input
                type="datetime-local"
                id="thoiGianLap"
                name="thoiGianLap"
                className="form-control"
                value={mainData.thoiGianLap}
                onChange={handleMainChange}
                required
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="nguoiLap" className="col-sm-3 col-form-label">
              Người lập:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="nguoiLap"
                name="nguoiLap"
                className="form-control"
                value={currentUser.username}
                onChange={handleMainChange}
                readOnly
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="nguoiChungKien" className="col-sm-3 col-form-label">
              Người chứng kiến:
            </label>
            <div className="col-sm-9 ">
              <input
                type="text"
                id="nguoiChungKien"
                name="nguoiChungKien"
                className="form-control"
                value={mainData.nguoiChungKien}
                onChange={handleMainChange}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Thông Tin Người Vi Phạm */}
        <fieldset style={{ marginBottom: "20px" }}>
          <div class="mb-3 row">
            <h4 className="title p-2">
              <b>
                <i>Thông tin người vi phạm / Tổ chức vi phạm</i>
              </b>
            </h4>

            {/* Người vi phạm */}
            <label htmlFor="nguoiViPham" className="col-sm-3 col-form-label">
              Người vi phạm (Họ và tên/Đơn vị):
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="namSinh" className="col-sm-3 col-form-label">
              Năm sinh:
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="ngheNghiep" className="col-sm-3 col-form-label">
              Nghề nghiệp/Lĩnh vực hoạt động
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="diaChi" className="col-sm-3 col-form-label">
              Địa chỉ:
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="canCuoc" className="col-sm-3 col-form-label">
              CCCD hoặc Mã số thuế:
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="noiCap" className="col-sm-3 col-form-label">
              Nơi cấp:
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="ngayCap" className="col-sm-3 col-form-label">
              Ngày cấp:
            </label>
            <div className="col-sm-9">
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

          <div className="mb-3 row">
            <label htmlFor="hanhVi" className="col-sm-3 col-form-label">
              Hành vi vi phạm:
            </label>
            <div className="col-sm-9">
              <textarea
                rows="3"
                type="text"
                id="hanhVi"
                name="hanhVi"
                className="form-control"
                value={violationPerson.hanhVi}
                onChange={handleViolationPersonChange}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Thông Tin Tàu Vi Phạm */}
        <fieldset style={{ marginBottom: "20px" }}>
          <div class="mb-3 row">
            <h4>
              <b>
                <i>Thông tin vi phạm</i>
              </b>
            </h4>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="thoiGianViPham" className="form-label">
                  Thời gian vi phạm:
                </label>
                <input
                  type="datetime-local"
                  id="thoiGianViPham"
                  name="thoiGianViPham"
                  className="form-control"
                  value={violationShip.thoiGianViPham}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="diaDiem" className="form-label">
                  Địa điểm:
                </label>
                <select
                  id="diaDiem"
                  name="diaDiem"
                  className="form-select"
                  value={violationShip.diaDiem}
                  onChange={handleViolationShipChange}
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

              <div className="mb-3">
                <label htmlFor="tongDungTich" className="form-label">
                  Tổng dung tích (tấn):
                </label>
                <input
                  type="number"
                  id="tongDungTich"
                  name="tongDungTich"
                  className="form-control"
                  value={violationShip.tongDungTich}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="soHieuTau" className="form-label">
                  Số hiệu tàu:
                </label>
                <input
                  type="text"
                  id="soHieuTau"
                  name="soHieuTau"
                  className="form-control"
                  value={violationShip.soHieuTau}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="congSuat" className="form-label">
                  Công suất (mã lực):
                </label>
                <input
                  type="text"
                  id="congSuat"
                  name="congSuat"
                  className="form-control"
                  value={violationShip.congSuat}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="haiTrinhCapPhep" className="form-label">
                  Hải trình cấp phép:
                </label>
                <input
                  type="text"
                  id="haiTrinhCapPhep"
                  name="haiTrinhCapPhep"
                  className="form-control"
                  value={violationShip.haiTrinhCapPhep}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="toaDoX" className="form-label">
                  Tọa độ X:
                </label>
                <input
                  type="number"
                  id="toaDoX"
                  name="toaDoX"
                  className="form-control"
                  value={violationShip.toaDoX}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="toaDoY" className="form-label">
                  Tọa độ Y:
                </label>
                <input
                  type="number"
                  id="toaDoY"
                  name="toaDoY"
                  className="form-control"
                  value={violationShip.toaDoY}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="haiTrinhThucTe" className="form-label">
                  Hải trình thực tế:
                </label>
                <input
                  type="text"
                  id="haiTrinhThucTe"
                  name="haiTrinhThucTe"
                  className="form-control"
                  value={violationShip.haiTrinhThucTe}
                  onChange={handleViolationShipChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label
                htmlFor="viPhamDieuKhoan"
                className="col-sm-3 col-form-label"
              >
                Vi phạm điều khoản:
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
          </div>
        </fieldset>

        {/* Các trường ý kiến */}
        <fieldset style={{ marginBottom: "20px" }}>
          <legend>
            <h4>
              <b>
                <i>Ý Kiến</i>
              </b>
            </h4>
          </legend>
          <div className="mb-3 row">
            <label
              htmlFor="ykienNguoiDaiDien"
              className="col-sm-3 col-form-label"
            >
              Ý kiến người/đại diện tổ chức vi phạm:
            </label>
            <div className="col-sm-9">
              <textarea
                id="ykienNguoiDaiDien"
                name="ykienNguoiDaiDien"
                className="form-control"
                value={mainData.ykienNguoiDaiDien}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="ykienNguoiChungKien"
              className="col-sm-3 col-form-label"
            >
              Ý kiến người chứng kiến:
            </label>
            <div className="col-sm-9">
              <textarea
                id="ykienNguoiChungKien"
                name="ykienNguoiChungKien"
                className="form-control"
                value={mainData.ykienNguoiChungKien}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="ykienNguoiThietHai"
              className="col-sm-3 col-form-label"
            >
              Ý kiến người thiệt hại:
            </label>
            <div className="col-sm-9">
              <textarea
                id="ykienNguoiThietHai"
                name="ykienNguoiThietHai"
                className="form-control"
                value={mainData.ykienNguoiThietHai}
                onChange={handleMainChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="nguoiThietHai" className="col-sm-3 col-form-label">
              Người thiệt hại (Tên, CCCD):
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="nguoiThietHai"
                name="nguoiThietHai"
                className="form-control"
                value={mainData.nguoiThietHai}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="bienPhapNganChan"
              className="col-sm-3 col-form-label"
            >
              Biện pháp ngăn chặn:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="bienPhapNganChan"
                name="bienPhapNganChan"
                className="form-control"
                value={mainData.bienPhapNganChan}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="tamGiu" className="col-sm-3 col-form-label">
              Tang vật, phương tiện, giấy tờ bị tạm giữ:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="tamGiu"
                name="tamGiu"
                className="form-control"
                value={mainData.tamGiu}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="yeuCau" className="col-sm-3 col-form-label">
              Yêu cầu có mặt giải quyết:
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                id="yeuCau"
                name="yeuCau"
                className="form-control"
                value={mainData.yeuCau}
                onChange={handleMainChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Nút Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Tạo biên bản
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddViolationRecord;
