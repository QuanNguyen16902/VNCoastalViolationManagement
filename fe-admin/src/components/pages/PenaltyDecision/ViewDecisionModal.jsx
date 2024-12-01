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
import decisionService from "../../../service/decision.service";
import { formatDate } from "../../../utils/format";

function ViewDecisionModal({ open, onClose, onViewViolation, decisionId }) {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [decision, setDecision] = useState(null);
  const [nguoiThiHanh, setNguoiThiHanh] = useState(null);
  const [nguoiViPham, setNguoiViPham] = useState(null);
  const [seizedItems, setSeizedItems] = useState([]);

  useEffect(() => {
    let isMounted = true; // Khai báo biến cờ
    const fetchDecision = async () => {
      if (decisionId) {
        try {
          const response = await decisionService.getDecision(decisionId);
          if (isMounted) {
            setDecision(response.data);
            setNguoiThiHanh(response.data.nguoiThiHanh.profile);
            setNguoiViPham(response.data.bienBanViPham.nguoiViPham);
            setSeizedItems(response.data.bienBanViPham.seizedItems);
            console.log("Ng thi hanh: " + response.data.nguoiThiHanh.profile);
            // console.log(response.data);
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
    fetchDecision();
    return () => {
      isMounted = false; // Đặt cờ là false khi component unmount
    };
  }, [decisionId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết vi phạm</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Thông tin chung" value="1" />
              <Tab label="Người thi hành" value="2" />
              <Tab label="Người vi phạm" value="3" />
              <Tab label="Tang vật" value="4" />
            </TabList>
          </Box>

          {/* General Settings */}
          <TabPanel value="1">
            <div>
              <strong>Số quyết định:</strong> {decision?.soQuyetDinh}
            </div>
            <div>
              <strong>Tên cơ quan:</strong> {decision?.tenCoQuan}
            </div>
            <div>
              <strong>Thời gian lập:</strong>{" "}
              {formatDate(decision?.thoiGianLap)}
            </div>
            <div>
              <strong>Thành phố:</strong> {decision?.thanhPho}
            </div>

            <div>
              <strong>Theo nghị định:</strong> {decision?.nghiDinh}
            </div>
            <div>
              <strong>Tình trạng:</strong>{" "}
              {decision?.paid ? "Đã nộp phạt" : "Chưa nộp phạt"}
            </div>

            <div>
              <strong>Hình thức xử phạt chính:</strong> {decision?.xuPhatChinh}
            </div>
            <div>
              <strong>Hình thức xử phạt bổ sung:</strong>{" "}
              {decision?.xuPhatBoSung}
            </div>
            <div>
              <strong>Biện pháp khắc phục:</strong> {decision?.bienPhapKhacPhuc}
            </div>
            <div>
              <strong>Mức phạt:</strong> {decision?.mucPhat}
            </div>
            <div>
              <strong>Hiệu lực thi hành:</strong>{" "}
              {formatDate(decision?.hieuLucThiHanh)}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div>
              <strong>Tên người thi hành:</strong> {nguoiThiHanh?.fullName}
            </div>
            <div>
              <strong>Đơn vị:</strong> {nguoiThiHanh?.department}
            </div>
            <div>
              <strong>Chức vụ:</strong> {nguoiThiHanh?.position}
            </div>

            <div>
              <strong>Cấp bậc:</strong> {nguoiThiHanh?.rank}
            </div>
          </TabPanel>

          {/* Security Settings */}
          <TabPanel value="3">
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
          <TabPanel value="4">
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

export default ViewDecisionModal;
