import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./searchAdvance.css";
const violations = [
  { id: 1, value: "Mã biên bản", key: "maBienBan" },
  { id: 2, value: "Số văn bản", key: "soVanBan" },
  { id: 3, value: "Tên cơ quan", key: "tenCoQuan" },
  { id: 4, value: "Người vi phạm", key: "nguoiViPham" },
  { id: 5, value: "Người lập biên bản", key: "nguoiLap" },
  { id: 6, value: "Người thiệt hại", key: "nguoiThietHai" },
  { id: 7, value: "Người chứng kiến", key: "nguoiChungKien" },
  { id: 8, value: "Tình trạng", key: "resolved" },
  { id: 9, value: "Lĩnh vực", key: "linhVuc" },
  { id: 10, value: "Thời gian lập", key: "thoiGianLap" },
  { id: 11, value: "Người chứng kiến", key: "nguoiChungKien" },
];
const decisions = [
  { id: 1, value: "Số quyết định", key: "soQuyetDinh" },
  { id: 2, value: "Mã biên bản", key: "maBienBan" },
  { id: 3, value: "Tên cơ quan", key: "tenCoQuan" },
  { id: 4, value: "Người vi phạm", key: "nguoiViPham" },
  { id: 5, value: "Người thi hành", key: "nguoiThiHanh" },
  { id: 6, value: "Mức phạt", key: "mucPhat" },
  { id: 7, value: "Tình trạng", key: "paid" },
  { id: 8, value: "Hiệu lực thi hành", key: "hieuLucThiHanh" },
];
export default function SearchAdvanceModal({
  onSelectFields,
  handleClose,
  openSearchModal,
  type,
}) {
  const fields = type === "decision" ? decisions : violations;
  const [checkedItems, setCheckedItems] = useState({ 1: true, 2: true });
  useEffect(() => {
    handleCheck();
  }, []);
  const handleCheck = () => {
    const selectedFields = fields
      .filter((item) => checkedItems[item.id])
      .map((item) => item.key);
    onSelectFields(selectedFields);
    handleClose();
  };
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div>
      <Modal
        centered
        show={openSearchModal}
        onHide={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="responsive-dialog-title">
            Tìm kiếm nâng cao
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="rowHeader col-12 col-sm-2">Chọn</div>
            <div className="rowHeader col-12 col-sm-10">
              Điều kiện tra cứu thông tin
            </div>
          </div>
          {fields.map((item) => (
            <div
              className={`row ${
                checkedItems[item.id] ? "bg-light bg-gradient" : ""
              }`}
            >
              <div key={item.id} className="rowdk col-12 col-sm-2">
                <input
                  class="form-check-input text-center"
                  type="checkbox"
                  name={item.id}
                  value={item.key}
                  checked={checkedItems[item.id] || false}
                  onChange={handleChange}
                />
              </div>
              <div class="rowdk col-12 col-sm-10">
                <label>{item.value}</label>
                <br />
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="warning" onClick={handleCheck}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
