import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { toast } from "react-toastify";
import diaphuongData from "../../../data/diaphuong.json";
import { dieuKhoan } from "../../../data/dieukhoan";
import violationService from "../../../service/violation.service";
import { getUserFromToken } from "../../../utils/auth";
import TangVatForm from "./SeizedItem";
const generateOptions = (data) => {
  return data.map((item) => ({
    label: `${item.noi_dung}`, // Đặt label cho điều
    value: `${item.noi_dung}`, // Giá trị cho điều
    options: item.Khoan.flatMap((khoan) => {
      // Nếu có điểm, tạo mục riêng cho từng điểm
      if (khoan.diem && khoan.diem.length > 0) {
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

const options = generateOptions(dieuKhoan);

const years = [];
for (let year = 1920; year <= 2024; year++) {
  years.push(year);
}
const formattedOptions = options.map((option) => ({
  label: option.label,
  options: option.options.map((subOption) => ({
    label: subOption.label,
    value: subOption.value,
  })),
}));
function EditViolationDialog({ open, onClose, onEditViolation, violationId }) {
  const [violation, setViolation] = useState(null);

  const [currentUser, setCurrentUser] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [violationDate, setViolationDate] = useState(null);
  const [resolveDate, setResolveDate] = useState(null);
  const [tangVats, setTangVats] = useState([]);
  const handleTangVatsChange = (updatedTangVats) => {
    setTangVats(updatedTangVats);
  };
  const handleSelectChange = (e) => {
    setMainData({
      ...mainData,
      viPhamDieuKhoan: e.target.value, // Cập nhật giá trị viPhamDieuKhoan
    });
  };

  useEffect(() => {
    let isMounted = true; // Khai báo biến cờ
    const currentUser = getUserFromToken();
    setCurrentUser(currentUser);
    const fetchUser = async () => {
      if (violationId) {
        try {
          const response = await violationService.getViolation(violationId);
          if (isMounted) {
            setViolation(response.data);
            setMainData(response.data);
            setViolationPerson(response.data.nguoiViPham);
            setViolationShip(response.data.tauViPham);
            setTangVats(response.data.seizedItems);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Lỗi khi tải người dùng", error);
            toast.error("Không thể tải dữ liệu người dùng");
          }
        }
      }
    };
    fetchUser();
    return () => {
      isMounted = false; // Đặt cờ là false khi component unmount
    };
  }, [violationId]);
  // State cho các trường chính
  const [mainData, setMainData] = useState({
    soVanBan: "",
    tenCoQuan: "",
    thoiGianLap: "",
    linhVuc: "",
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
    soBan: 0,
    thoiGianGiaiQuyet: "",
    hanhVi: "",
  });

  // State cho nguoiViPham
  const [violationPerson, setViolationPerson] = useState({
    nguoiViPham: "",
    quocTich: "",
    namSinh: "",
    ngheNghiep: "",
    diaChi: "",
    canCuoc: "",
    noiCap: "",
    ngayCap: "",
    email: "",
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
    // if (!mainData.thoiGianGiaiQuyet)
    //   errors.thoiGianGiaiQuyet = "Thời gian giải quyết không được để trống.";
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
    if (!violationPerson.quocTich)
      errors.quocTich = "Quốc tịch không được để trống.";
    if (!violationPerson.email) errors.email = "Email không được để trống.";

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
    const defaultText = "/BB-VPHC";

    setMainData((prevData) => ({
      ...prevData,
      [name]:
        name === "soVanBan"
          ? value.replace(defaultText, "") // Loại bỏ hậu tố trước khi lưu
          : value,
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
  useEffect(() => {
    if (mainData.thoiGianLap) {
      setStartDate(new Date(mainData.thoiGianLap)); // Chuyển đổi thành đối tượng Date
    }
    if (violationShip.thoiGianViPham) {
      setViolationDate(new Date(violationShip.thoiGianViPham)); // Chuyển đổi thành đối tượng Date
    }
    if (mainData.thoiGianGiaiQuyet) {
      setResolveDate(new Date(mainData.thoiGianGiaiQuyet));
    }
  }, [
    mainData.thoiGianLap,
    violationShip.thoiGianViPham,
    mainData.thoiGianGiaiQuyet,
  ]);

  const handleDateChange = (date, type) => {
    if (type === "thoiGianLap") {
      setStartDate(date); // Cập nhật trạng thái với ngày mới
      console.log("Thời gian lập:", date);
    } else if (type === "thoiGianViPham") {
      setViolationDate(date); // Cập nhật trạng thái với ngày vi phạm
      console.log("Thời gian vi phạm:", date);
    } else if (type === "thoiGianGiaiQuyet") {
      setResolveDate(date); // Cập nhật trạng thái với ngày vi phạm
      console.log("Thời gian giải quyết:", date);
    }
  };

  // Log the date to save in SQL

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error); // Display error message
      });
      return;
    }
    // Xây dựng payload theo cấu trúc yêu cầu
    const thoiGianLapMoi = startDate.toISOString();
    const thoiGianViPhamMoi = violationDate.toISOString();
    const thoiGianGiaiQuyetMoi = resolveDate.toISOString();

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
        thoiGianViPham: thoiGianViPhamMoi,
      },
      thoiGianLap: thoiGianLapMoi,
      thoiGianGiaiQuyet: thoiGianGiaiQuyetMoi,
      file: null,
    };
    try {
      const response = await violationService.editViolation(
        violationId,
        payload
      );
      console.log(response);
      toast.success("Cập nhật biên bản vi phạm thành công!");
      onEditViolation();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo biên bản:", error);
      toast.error("Lỗi: " + error.response.data);
    }
  };

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="edit-violation-dialog-title"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <DialogTitle id="custom-dialog-title">
          <Typography variant="h6">
            Chỉnh sửa Biên bản (STT: {violationId})
          </Typography>
        </DialogTitle>
        {/* Nút đóng Dialog */}
        <IconButton onClick={onClose} style={{ marginRight: 8 }}>
          <i className="bi bi-x"></i>
        </IconButton>
      </div>

      {/* Đường phân cách */}
      <Divider />
      <DialogContent>
        {violation ? (
          <div id="box" className="bg-white ps-5 pe-lg-5 pt-4">
            <h1 className="text-center fw-700 mb-3">
              Biên bản vi phạm ID({violation.maBienBan})
            </h1>
            <form onSubmit={handleSubmit}>
              {/* Các trường chính */}
              <fieldset style={{ marginBottom: "20px" }}>
                <h4 className="row mb-3">
                  <b>
                    <i>Thông tin văn bản</i>
                  </b>
                </h4>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label
                      htmlFor="soVanBan"
                      className="form-label"
                      style={{ color: "#D63B19FF" }}
                    >
                      Số Biên Bản:
                    </label>
                    <input
                      type="text"
                      id="soVanBan"
                      name="soVanBan"
                      className="form-control"
                      value={mainData.soVanBan + "/BB-VPHC"}
                      onChange={handleMainChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="tenCoQuan" className="form-label">
                      Tên cơ quan:
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
                  <div className="col-md-4">
                    <label htmlFor="linhVuc" className="form-label">
                      Lĩnh vực:
                    </label>
                    <input
                      type="text"
                      id="linhVuc"
                      name="linhVuc"
                      className="form-control"
                      value={mainData.linhVuc}
                      onChange={handleMainChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="nguoiLap" className="form-label">
                      Người lập:
                    </label>
                    <input
                      type="text"
                      id="nguoiLap"
                      name="nguoiLap"
                      className="form-control"
                      value={currentUser.username}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="nguoiChungKien" className="form-label">
                      Người chứng kiến:
                    </label>
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
                  <div className="col-md-4">
                    <label htmlFor="thoiGianLap" className="form-label">
                      Thời gian lập:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) =>
                          handleDateChange(date, "thoiGianLap")
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15} // Thay đổi khoảng thời gian theo nhu cầu
                        dateFormat="Pp" // Adjust format as needed
                        className="form-control"
                        name="thoiGioiLap"
                        placeholderText="Chọn ngày"
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset style={{ marginBottom: "20px" }}>
                <h4 className="row mb-3">
                  <b>
                    <i>Thông tin người vi phạm / Tổ chức vi phạm</i>
                  </b>
                </h4>
                <div className="row mb-3">
                  <div className="col-md-5">
                    <label htmlFor="nguoiViPham" className="form-label">
                      Người vi phạm (Họ và tên/Đơn vị):
                    </label>
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
                  <div className="col-md-3">
                    <label htmlFor="namSinh" className="form-label">
                      Năm sinh:
                    </label>
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
                  <div className="col-md-4">
                    <label htmlFor="ngheNghiep" className="form-label">
                      Nghề nghiệp/Lĩnh vực hoạt động:
                    </label>
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
                <div className="row mb-4">
                  <div className="col-md-4">
                    <label htmlFor="diaChi" className="form-label">
                      Địa chỉ:
                    </label>
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
                  <div className="col-md-4">
                    <label htmlFor="quocTich" className="form-label">
                      Quốc tịch:
                    </label>
                    <input
                      type="text"
                      id="quocTich"
                      name="quocTich"
                      className="form-control"
                      value={violationPerson.quocTich}
                      onChange={handleViolationPersonChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="form-control"
                      value={violationPerson.email}
                      onChange={handleViolationPersonChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-3">
                    <label htmlFor="canCuoc" className="form-label">
                      CCCD hoặc Mã số thuế:
                    </label>
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
                  <div className="col-md-3">
                    <label htmlFor="noiCap" className="form-label">
                      Nơi cấp:
                    </label>
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
                  <div className="col-md-3">
                    <label htmlFor="ngayCap" className="form-label">
                      Ngày cấp:
                    </label>
                    <input
                      type="date"
                      id="ngayCap"
                      name="ngayCap"
                      className="form-control"
                      value={violationPerson.ngayCap || ""}
                      onChange={handleViolationPersonChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="hanhVi" className="col-sm-3 col-form-label">
                    Hành vi vi phạm:
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      rows="3"
                      id="hanhVi"
                      name="hanhVi"
                      className="form-control"
                      value={mainData.hanhVi}
                      onChange={handleMainChange}
                      required
                      style={{ marginLeft: "-10px" }}
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
                      <DatePicker
                        selected={violationDate}
                        onChange={(date) =>
                          handleDateChange(date, "thoiGianViPham")
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="Pp"
                        className="form-control"
                        required
                        placeholderText="Chọn ngày"
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
                      <Select
                        id="viPhamDieuKhoan"
                        name="viPhamDieuKhoan"
                        value={
                          formattedOptions
                            .flatMap((group) => group.options)
                            .find(
                              (option) =>
                                option.value === mainData.viPhamDieuKhoan
                            ) || null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange({
                            target: {
                              name: "viPhamDieuKhoan",
                              value: selectedOption ? selectedOption.value : "",
                            },
                          })
                        }
                        options={formattedOptions}
                        placeholder="Chọn điều, khoản, điểm"
                        isClearable
                      />
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
                  <label
                    htmlFor="nguoiThietHai"
                    className="col-sm-3 col-form-label"
                  >
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
                <h4>
                  <b>
                    <i>Tang vật</i>
                  </b>
                </h4>
                <TangVatForm
                  tangVats={tangVats}
                  onTangVatsChange={handleTangVatsChange}
                />
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
                  <div className="col-md-6">
                    <label htmlFor="yeuCau" className="form-label">
                      Yêu cầu có mặt tại:
                    </label>
                    <div>
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

                  <div className="col-md-3">
                    <label htmlFor="thoiGianGiaiQuyet" className="form-label">
                      Thời gian giải quyết:
                    </label>
                    <div>
                      <DatePicker
                        selected={resolveDate}
                        onChange={(date) =>
                          handleDateChange(date, "thoiGianGiaiQuyet")
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="Pp"
                        className="form-control"
                        required
                        placeholderText="Chọn ngày"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="soBan" className="form-label">
                      Số bản
                    </label>
                    <div>
                      <input
                        type="number"
                        id="soBan"
                        name="soBan"
                        className="form-control"
                        value={mainData.soBan}
                        onChange={handleMainChange}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Nút Submit */}
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Cập nhật Biên bản
                </button>
              </div>
            </form>
          </div>
        ) : (
          "Đang tải dữ liệu..."
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditViolationDialog;
