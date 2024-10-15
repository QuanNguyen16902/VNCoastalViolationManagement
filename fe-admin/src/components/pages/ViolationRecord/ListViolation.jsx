import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUserRoles } from "../../../hooks/useUserRoles";
import violationService from "../../../service/violation.service";
import "../datatable.css";
import SearchField from "../SearchField";
import EditViolationDialog from "./EditViolationModal";
function ViolationRecords() {
  const roles = useUserRoles();
  const canView = roles.includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserGroupId, setEditViolationId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ViolationRecords with optional search keyword
  const fetchViolation = async () => {
    setLoading(true);
    let isMounted = true;
    try {
      const response = await violationService.getViolationList();
      console.log(response);
      setData(response.data);
    } catch (error) {
      if (isMounted) {
        console.error("Lỗi truy xuất biên bản", error);
        // toast.error("Không thể tải dữ liệu Biên bản vi phạm");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchViolation();
  }, []);

  // Handle delete dialog
  const handleDelete = async () => {
    try {
      await violationService.deleteViolation(deleteId);
      await fetchViolation();
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa không thành công!");
    } finally {
      setOpenDelete(false);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleClose = () => {
    setOpenDelete(false);
    setOpenEdit(false);
  };

  // Handle edit user
  const handleEditViolation = (violationId) => {
    setEditViolationId(violationId);
    setOpenEdit(true);
  };

  // Handle search
  const handleSearch = (keyword) => {
    fetchViolation(keyword);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0"); // Ngày
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (cần +1 vì getMonth() trả về từ 0-11)
    const year = date.getFullYear(); // Năm

    const hours = date.getHours().toString().padStart(2, "0"); // Giờ
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Phút

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleChangeResolve = async (id, resolved) => {
    console.log(id, resolved);
    try {
      const response = await violationService.changeResolved(id, resolved);
      console.log(response);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, resolved } : item))
      );
    } catch (error) {
      // Handle error
      console.error("Error updating violation resolved status:", error);
      // Optionally, show an error message to the user
    }
  };
  // Prepare data for DataGrid
  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      soVanBan: item.soVanBan,
      thoiGianLap: formatDate(item.thoiGianLap),
      nguoiChungKien: item.nguoiChungKien,
      nguoiViPham: item.nguoiViPham ? item.nguoiViPham.nguoiViPham : "",
      nguoiThietHai: item.nguoiThietHai,
      resolved: item.resolved,
    })
  );
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="text-center p-4"
          style={{
            borderRadius: "10px",
            backgroundColor: "#e7f3fe",
            border: "2px solid #007bff",
            maxWidth: "500px",
          }}
        >
          <i
            className="bi bi-exclamation-octagon fw-bold text-primary"
            style={{ fontSize: "48px" }}
          ></i>
          <h4 className="mt-3">Bạn không có quyền xem danh sách người dùng</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Danh sách Biên bản vi phạm
        <SearchField label={"Tra cứu biên bản"} onSearch={handleSearch} />
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Số văn bản</th>
            <th>Thời gian lập</th>
            <th>Người chứng kiến</th>
            <th>Người vi phạm</th>
            <th>Người thiệt hại</th>
            <th>Tình trạng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowSelect(row.id)}
                />
              </td>
              <td>{row.soVanBan}</td>
              <td>{row.thoiGianLap}</td>
              <td>{row.nguoiChungKien}</td>
              <td>{row.nguoiViPham}</td>
              <td>{row.nguoiThietHai}</td>
              <td>
                <span
                  className={`badge ${
                    row.resolved ? "bg-success" : "bg-danger"
                  }`}
                >
                  <button
                    onClick={() => handleChangeResolve(row.id, !row.resolved)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {row.resolved ? "Đã giải quyết" : "Chưa giải quyết"}
                  </button>
                </span>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  onClick={() => handleEditViolation(row.id)}
                  className="me-2"
                  title="Chỉnh sửa"
                >
                  <i className="bi bi-pencil-square"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleOpenDeleteDialog(row.id)}
                  title="Xóa"
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa biên bản có <b>ID {deleteId}</b>? Hành
            động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={handleDelete} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {openEdit && (
        <EditViolationDialog
          open={openEdit}
          onClose={handleClose}
          violationId={editUserGroupId}
          onEditViolation={() => fetchViolation()} // Refetch ViolationRecords after editing
        />
      )}
    </div>
  );
}

export default ViolationRecords;
