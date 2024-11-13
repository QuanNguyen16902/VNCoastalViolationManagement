import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import diaphuongData from "../../../data/diaphuong.json";
import { dieuKhoan } from "../../../data/dieukhoan";
import decisionService from "../../../service/decision.service";
import userService from "../../../service/user.service";
import violationService from "../../../service/violation.service";
import { getUserFromToken } from "../../../utils/auth";
import "./PenaltyDecision.css";
const years = [];
for (let year = 1920; year <= 2024; year++) {
  years.push(year);
}
const AddPenaltyDecision = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [violationList, setViolationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectUserId, setSelectUserId] = useState(null);
  const [mucPhatPlaceholder, setMucPhatPlacehoder] = useState("");

  useEffect(() => {
    const currentUser = getUserFromToken();
    setCurrentUser(currentUser);
  }, []);
  // danh sách select biên bản
  const fetchViolation = async () => {
    try {
      const response = await violationService.getViolationList();
      setViolationList(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    fetchViolation();
    return () => {};
  }, []);
  // danh sách select người dùng
  const fetchUser = async () => {
    try {
      const response = await userService.getUsers();
      setUserList(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  // State cho các trường chính
  const [mainData, setMainData] = useState({
    tenCoQuan: "",
    soQuyetDinh: "",
    thoiGianLap: "",
    thanhPho: "",
    nghiDinh: "",
    xuPhatChinh: "",
    mucPhat: "",
    xuPhatBoSung: "",
    bienPhapKhacPhuc: "",
    viPhamDieuKhoan: "",
    hieuLucThiHanh: "",
    diaChiKhoBac: "",
    bienBanViPham: {
      id: "",
    },
    nguoiThiHanh: {
      id: "",
    },
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
    quocTich: "",
  });
  const [selectedViolationId, setSelectedViolationId] = useState("");

  // State cho nguoiThihanh
  const [executor, setExecutor] = useState({
    // id: "",
    fullName: "",
    rank: "",
    position: "",
    department: "",
  });
  const validateFields = () => {
    const errors = {};
    if (!mainData.tenCoQuan || mainData.tenCoQuan.trim() === "") {
      errors.tenCoQuan = "Tên cơ quan không được để trống.";
    }

    if (!mainData.soQuyetDinh || mainData.soQuyetDinh.trim() === "") {
      errors.soQuyetDinh = "Số quyết định không được để trống.";
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
    // if (!violationPerson.quocTich || violationPerson.quocTich.trim() === "") {
    //   errors.quocTich = "Quốc tịch không được để trống.";
    // }

    return errors;
  };

  // Xử lý thay đổi cho các trường chính
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    const defaultText = "/QĐ-XPVPHC";
    setMainData((prevData) => ({
      ...prevData,
      bienBanViPham: {
        ...prevData.bienBanViPham,
        [name]: value,
      },
      [name]: name === "soQuyetDinh" ? value.replace(defaultText, "") : value,
    }));
  };

  const handleViolationPersonChange = async (e) => {
    const { value, name } = e.target;
    try {
      // Gọi API để lấy thông tin người vi phạm
      const response = await violationService.getViolationPersonByViolationId(
        value
      );
      const response2 = await violationService.getViolation(value);
      setViolationPerson(response.data);

      // Tìm điều khoản phù hợp từ dieuKhoan.js dựa trên viPhamDieuKhoan
      const matchedDieu = dieuKhoan.find((dieu) =>
        response2.data.viPhamDieuKhoan.includes(dieu.noi_dung)
      );
      let xuPhatChinh = "Chưa có thông tin xử phạt";
      let xuPhatBoSung = "Chưa có";
      let bienPhapKhacPhuc = "Chưa có";

      if (matchedDieu) {
        const matchedKhoan = matchedDieu.Khoan.find((khoan) =>
          response2.data.viPhamDieuKhoan.includes(khoan.noi_dung)
        );

        if (matchedKhoan) {
          setMucPhatPlacehoder(matchedKhoan.muc_phat);

          const fineMatch = matchedKhoan.noi_dung.match(
            /Phạt tiền từ ([\d.]+) đồng đến ([\d.]+) đồng/
          );
          if (fineMatch) {
            xuPhatChinh = `Phạt tiền từ ${fineMatch[1]} đồng đến ${fineMatch[2]} đồng`;
          }
          xuPhatBoSung = matchedKhoan.hasHinhThucXuPhatBoSung
            ? matchedDieu.hinhThucXuPhatBoSung
            : "Chưa có";
          bienPhapKhacPhuc = matchedKhoan.hasBienPhapKhacPhuc
            ? matchedDieu.bienPhapKhacPhuc
            : "Chưa có";
        }
      }

      // Cập nhật mainData với thông tin điều khoản và vi phạm
      setMainData({
        ...mainData,
        bienBanViPham: {
          ...mainData.bienBanViPham,
          id: value,
          hanhVi: response2.data.hanhVi,
          viPhamDieuKhoan: response2.data.viPhamDieuKhoan,
        },
        xuPhatChinh,
        xuPhatBoSung,
        bienPhapKhacPhuc,
      });
    } catch (error) {
      console.error(
        "Error fetching violation person data:",
        error.response.data
      );
    }
  };

  const handleSelectExecutorChange = async (e) => {
    const selectedUserId = e.target.value; // Sử dụng selectedUserId
    console.log(selectedUserId); // Sửa lại biến

    try {
      const response = await userService.getUser(selectedUserId);
      const selectedUser = response.data.profile;
      if (selectedUser) {
        setExecutor({
          id: selectedUserId, // Sử dụng selectedUserId
          fullName: selectedUser?.fullName || "",
          rank: selectedUser?.rank || "",
          position: selectedUser?.position || "",
          department: selectedUser?.department || "",
        });
        setMainData((prevState) => ({
          ...prevState,
          nguoiThiHanh: {
            ...prevState.nguoiThiHanh,
            id: selectedUserId, // Cập nhật ID đúng
          },
        }));
      }
    } catch (error) {
      toast.error(error.response.data || "Lỗi truy xuất người dùng");
    }
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
      thoiGianLap: new Date(mainData.thoiGianLap).toISOString(), // Chuyển đổi sang định dạng ISO
      hieuLucThiHanh: new Date(mainData.hieuLucThiHanh).toISOString(),
      bienBanViPham: {
        ...mainData.bienBanViPham,
        nguoiViPham: {
          ...violationPerson,
          namSinh: Number(violationPerson.namSinh),
        },
      },
      executor: {
        id: selectUserId,
      },
    };
    console.log(payload);
    try {
      const response = await decisionService.addDecision(payload);
      console.log(response);
      toast.success("Tạo quyết định xử phạt thành công!");

      setMainData({
        tenCoQuan: "",
        soQuyetDinh: "",
        thanhPho: "",
        nghiDinh: "",
        xuPhatChinh: "",
        mucPhat: "",
        xuPhatBoSung: "",
        bienPhapKhacPhuc: "",
        viPhamDieuKhoan: "",
        hieuLucThiHanh: "",
        thoiGianlap: "",
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
        quocTich: "",
      });
      setExecutor({
        fullName: "",
        rank: "",
        position: "",
        department: "",
      });
    } catch (error) {
      console.error("Lỗi khi tạo quyết định:", error);
      toast.error(error.response.data || "Lỗi tạo QĐXP, hãy thử lại");
    }
  };
  const options = violationList.map((item) => ({
    label: item.soVanBan,
    value: item.id,
  }));
  const optionsThanhPho = diaphuongData.map((item) => ({
    label: `${item.viet_tat} - ${item.dia_phuong}`,
    value: item.dia_phuong,
  }));
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
            <div className="col-md-4">
              <label className="form-label">Căn cứ vào biên bản</label>
              <Select
                id="violationId"
                name="violationId"
                value={
                  options.find(
                    (option) => option.value === mainData.bienBanViPham?.id
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleViolationPersonChange({
                    target: {
                      name: "violationId",
                      value: selectedOption ? selectedOption.value : "",
                    },
                  })
                }
                options={options}
                placeholder="Chọn mã biên bản"
                isClearable
              />
            </div>
            <div className="col-md-4">
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
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="soQuyetDinh" className="form-label">
                  Số quyết định:
                </label>
                <input
                  type="text"
                  id="soQuyetDinh"
                  name="soQuyetDinh"
                  className="form-control"
                  value={mainData.soQuyetDinh + "/QĐ-XPVPHC"}
                  onChange={handleMainChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="thanhPho" className="form-label">
                  Thành phố:
                </label>
                <Select
                  id="thanhPho"
                  name="thanhPho"
                  value={
                    optionsThanhPho.find(
                      (option) => option.value === mainData.thanhPho
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    handleMainChange({
                      target: {
                        name: "thanhPho",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    })
                  }
                  options={optionsThanhPho}
                  placeholder="Chọn thành phố"
                  isClearable
                />
              </div>
            </div>

            <div className="col-md-4">
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
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="thoiGianLap" className="form-label">
                  Thời gian lập:
                </label>
                <input
                  type="datetime-local"
                  id="thoiGianLap"
                  name="thoiGianLap"
                  className="form-control"
                  value={mainData.thoiGianLap}
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
            <div className="col-sm-3">
              <select
                id="nguoiThihanh"
                name="nguoiThihanh"
                className="form-select"
                onChange={handleSelectExecutorChange}
                // value={mainData.nguoiThiHanh.id}
                required
              >
                <option value="">Chọn mã cán bộ</option>
                {userList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.profile?.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="fullName" className="form-label">
                Tên:
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                value={executor.fullName}
                readOnly
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="rank" className="form-label">
                Cấp bậc:
              </label>
              <input
                type="text"
                id="rank"
                name="rank"
                className="form-control"
                value={executor.rank}
                readOnly
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="position" className="form-label">
                Chức vụ:
              </label>
              <input
                type="text"
                id="position"
                name="position"
                className="form-control"
                value={executor.position}
                readOnly
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="department" className="form-label">
                Đơn vị:
              </label>
              <input
                type="text"
                id="department"
                name="department"
                className="form-control"
                value={executor.department}
                readOnly
              />
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
                  Tên người/tổ chức vi phạm
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="nguoiViPham"
                    name="nguoiViPham"
                    className="form-control"
                    value={violationPerson.nguoiViPham}
                    // onChange={handleViolationPersonChange}
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
                    // onChange={handleViolationPersonChange}
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
                    // onChange={handleViolationPersonChange}
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
                    // onChange={handleViolationPersonChange}
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
                    // onChange={handleViolationPersonChange}
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
                    // onChange={handleViolationPersonChange}
                  />
                </div>
              </div>
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
                    // onChange={handleViolationPersonChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="quocTich" className="col-sm-4 col-form-label">
                  Quốc tịch:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="quocTich"
                    name="quocTich"
                    className="form-control"
                    value={violationPerson.quocTich}
                    // onChange={handleViolationPersonChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Các trường xử phạt */}
        <fieldset style={{ marginBottom: "20px" }}>
          <legend>
            <h4>
              <b>
                <i>Hình thức xử phạt</i>
              </b>
            </h4>
          </legend>
          <div className="mb-3 row">
            <label htmlFor="hanhVi" className="col-sm-3 col-form-label">
              Hành vi vi phạm hành chính:
            </label>
            <div className="col-sm-9">
              <textarea
                id="hanhVi"
                name="hanhVi"
                className="form-control"
                value={mainData.bienBanViPham?.hanhVi}
                onChange={handleMainChange}
              ></textarea>
            </div>
          </div>
          <div className="mb-3 row">
            <label
              htmlFor="viPhamDieuKhoan"
              className="col-sm-3 col-form-label"
            >
              Quy định tại:
            </label>
            <div className="col-sm-9">
              <textarea
                id="viPhamDieuKhoan"
                name="viPhamDieuKhoan"
                className="form-control"
                value={mainData.bienBanViPham?.viPhamDieuKhoan}
                onChange={handleMainChange}
              />
            </div>
          </div>
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
              ></textarea>
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
                placeholder={mucPhatPlaceholder}
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
              <textarea
                rows="2"
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
