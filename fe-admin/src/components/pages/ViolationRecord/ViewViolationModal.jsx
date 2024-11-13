// Thư viện Material-UI làm ví dụ, bạn có thể thay bằng thư viện khác nếu cần.
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import violationService from "../../../service/violation.service";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0"); // Ngày
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (cần +1 vì getMonth() trả về từ 0-11)
  const year = date.getFullYear(); // Năm
  const hours = date.getHours().toString().padStart(2, "0"); // Giờ
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Phút

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
function ViewViolationModal({ open, onClose, onViewViolation, violationId }) {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [violation, setViolation] = useState(null);
  const [nguoiViPham, setNguoiViPham] = useState(null);
  const [seizedItems, setSeizedItems] = useState([]);

  useEffect(() => {
    let isMounted = true; // Khai báo biến cờ
    const fetchUser = async () => {
      if (violationId) {
        try {
          const response = await violationService.getViolation(violationId);
          if (isMounted) {
            setViolation(response.data);
            setNguoiViPham(response.data.nguoiViPham);
            setSeizedItems(response.data.seizedItems);
            console.log(response.data);
            console.log(response.data.seizedItems);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết vi phạm</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Thông tin chung" value="1" />
              <Tab label="Người vi phạm" value="2" />
              <Tab label="Tang vật" value="3" />
            </TabList>
          </Box>

          {/* General Settings */}
          <TabPanel value="1">
            <div>
              <strong>Mã biên bản:</strong> {violation?.maBienBan}
            </div>
            <div>
              <strong>Số biên bản:</strong> {violation?.soVanBan}
            </div>
            <div>
              <strong>Tên cơ quan:</strong> {violation?.tenCoQuan}
            </div>
            <div>
              <strong>Thời gian lập:</strong>{" "}
              {formatDate(violation?.thoiGianLap)}
            </div>
            <div>
              <strong>Người chứng kiến:</strong> {violation?.nguoiChungKien}
            </div>

            <div>
              <strong>Người thiệt hại:</strong> {violation?.nguoiThietHai}
            </div>
            <div>
              <strong>Tình trạng:</strong>{" "}
              {violation?.resolved ? "Đã giải quyết" : "Chưa giải quyết"}
            </div>
          </TabPanel>

          {/* Security Settings */}
          <TabPanel value="2">
            <h4>Thông tin người vi phạm</h4>
            <div>
              <strong>Người vi phạm:</strong> {nguoiViPham?.nguoiViPham}
            </div>
            <div>
              <strong>Năm sinh:</strong> {nguoiViPham?.namSinh}
            </div>
            <div>
              <strong>Nghề nghiệp:</strong> {nguoiViPham?.ngheNghiep}
            </div>
            <div>
              <strong>Địa chỉ:</strong> {nguoiViPham?.diaChi}
            </div>
            <div>
              <strong>CCCD:</strong> {nguoiViPham?.canCuoc}
            </div>
            <div>
              <strong>Ngày cấp:</strong> {formatDate(nguoiViPham?.ngayCap)}
            </div>
            <div>
              <strong>Nơi cấp:</strong> {nguoiViPham?.noiCap}
            </div>
            <div>
              <strong>Quốc tịch:</strong> {nguoiViPham?.quocTich}
            </div>
            <div>
              <strong>Hành vi vi phạm:</strong> {nguoiViPham?.hanhVi}
            </div>
          </TabPanel>

          {/* UI Settings */}
          <TabPanel value="3">
            <table className="table table-bordered table-hover table-responsive">
              <thead className="table-light text-center">
                <tr>
                  <th>Tên tang vật</th>
                  <th>Mô tả</th>
                  <th>Số lượng</th>
                  <th>Ngày thu giữ</th>
                  <th>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {seizedItems.map((row) => (
                  <tr key={row.id}>
                    <td>{row.itemName}</td>
                    <td>{row.description}</td>
                    <td>{row.quantity}</td>
                    <td>{formatDate(row.seizureDate)}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewViolationModal;
