import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserRoles } from "../../../hooks/useUserRoles";
import decisionService from "../../../service/decision.service";
import "../datatable.css";
import SearchField from "../SearchField";
import EditDecisionDialog from "./EditDecisionModal";
import PaymentModal from "./Payment/PaymentModal";
import ExportPdfButton from "./PdfDecision";
function PenaltyDecision() {
  const roles = useUserRoles();
  const canView = roles.includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editDecisionId, setEditDecisionId] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch PenaltyDecision with optional search keyword
  const fetchDecision = async () => {
    setLoading(true);
    try {
      const response = await decisionService.getDecisionList();
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi truy xuất biên bản", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecision();
  }, []);

  const handleDelete = async () => {
    try {
      await decisionService.deleteDecision(deleteId);
      await fetchDecision();
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
  const handleOpenPaymentDialog = (id) => {
    setPaymentId(id);
    setOpenPayment(true);
  };
  const handleClosePaymentDialog = () => {
    setOpenPayment(false);
    setPaymentId(null);
  };
  const handleClose = () => {
    setOpenDelete(false);
    setOpenEdit(false);
  };

  // Handle edit user
  const handleEditDecision = (violationId) => {
    setEditDecisionId(violationId);
    setOpenEdit(true);
  };

  // Handle search
  const handleSearch = (keyword) => {
    fetchDecision(keyword);
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
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  // Prepare data for DataGrid
  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      soVanBan: item.soVanBan,
      tenCoQuan: item.tenCoQuan,
      nguoiThiHanh: item.nguoiThiHanh?.ten || "",
      nguoiViPham: item.nguoiViPham ? item.nguoiViPham.nguoiViPham : "",
      xuPhatChinh: item.xuPhatChinh,
      mucPhat: formatCurrency(item.mucPhat),
      paid: item.paid,
      hieuLucThiHanh: formatDate(item.hieuLucThiHanh),
    })
  );

  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    { field: "soVanBan", headerName: "Số văn bản", width: 100 },
    { field: "tenCoQuan", headerName: "Tên cơ quan", width: 240 },
    { field: "nguoiViPham", headerName: "Người vi phạm", width: 180 },
    { field: "xuPhatChinh", headerName: "Hình thức xử phạt", width: 180 },
    { field: "mucPhat", headerName: "Mức phạt", width: 180 },
    {
      field: "paid",
      headerName: "Tình trạng",
      width: 180,
      renderCell: (params) => (
        <div className="badge badge">
          <div
            className={`cellWithStatus ${
              params.row.paid === true ? "active" : "inactive"
            }`}
          >
            {params.row.paid === true ? "Đã nộp" : "Chưa nộp"}
          </div>
        </div>
      ),
    },
    { field: "hieuLucThiHanh", headerName: "Hiệu lực từ", width: 180 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <button
            title="Chỉnh sửa"
            style={{
              textDecoration: "none",
              border: "none",
              background: "none",
            }}
            onClick={() => handleEditDecision(params.row.id)}
          >
            <div className="viewButton">
              <i className="bi bi-pencil-square"></i>
            </div>
          </button>
          <div
            title="Nộp phạt"
            className="payButton"
            onClick={() => handleOpenPaymentDialog(params.row.id)}
            style={{ cursor: "pointer" }}
          >
            <i class="bi bi-receipt-cutoff"></i>
          </div>
          <div
            title="Xóa"
            className="deleteButton"
            onClick={() => handleOpenDeleteDialog(params.row.id)}
          >
            <i className="bi bi-trash"></i>
          </div>
        </div>
      ),
    },
  ];

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
          <h4 className="mt-3">Bạn không có quyền xem danh sách quyết định</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Danh sách Biên bản vi phạm
        <SearchField label={"Tra cứu quyết định"} onSearch={handleSearch} />
        <ExportPdfButton />
      </div>
      <DataGrid
        className="datagrid"
        rows={rows}
        columns={columns.concat(actionColumn)}
        checkboxSelection
        onSelectionModelChange={(ids) => setSelectedRows(ids)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10]}
        autoHeight
      />
      <PaymentModal
        show={openPayment}
        handleClose={handleClosePaymentDialog}
        decisionId={paymentId}
      />
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa quyêt định có <b>ID {deleteId}</b>? Hành
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
        <EditDecisionDialog
          open={openEdit}
          onClose={handleClose}
          decisionId={editDecisionId}
          onEditDecision={() => fetchDecision()} // Refetch PenaltyDecision after editing
        />
      )}
    </div>
  );
}

export default PenaltyDecision;
