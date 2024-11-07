import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserRoles } from "../../../hooks/useUserRoles";
import decisionService from "../../../service/decision.service";
import DeleteConfirmationDialog from "../ViolationRecord/DeleteConfirmDialog ";
import SearchAdvanceModal from "../ViolationRecord/SearchAdvanceButton/ModalSearchAdvance";
import EditDecisionDialog from "./EditDecisionModal";
import PenaltyDecision from "./ListDecision";
import PaymentModal from "./Payment/PaymentModal";
import ReportGeneratorModal from "./QRCodeGenerator";

export default function DecisionMain() {
  const roles = useUserRoles();
  const canView = roles.includes("ROLE_ADMIN");
  const [openDialogSearch, setOpenSearch] = useState(false);
  const handleOpenSearchModal = () => {
    setOpenSearch(true);
  };
  const [selectedFields, setSelectedFields] = useState([]);
  const onSelectFields = (fields) => {
    setSelectedFields(fields); // Cập nhật các trường đã chọn
  };

  // State variables
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editDecisionId, setEditDecisionId] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [viewDecisionId, setViewDecisionId] = useState(null);

  const [openQRCode, setQrCode] = useState(false);
  const [qrCodeDecisionId, setQrCodeDecisionId] = useState(null);
  // Pagination
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // Trang hiện tại
  const [size, setSize] = useState(5); // Số bản ghi trên mỗi trang
  const [searchFormData, setSearchFormData] = useState({});
  const [totalElements, setTotalElements] = useState(0); // Tổng số bản ghi
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  // payment
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    fetchDecision({ page, size, ...searchFormData });
  }, [page, size, searchFormData]);

  // Hàm lấy dữ liệu từ backend
  const fetchDecision = async (queryParams) => {
    setLoading(false);
    try {
      const response = await decisionService.searchDecision(queryParams);
      console.log(response);
      setData(response.data.content);
      setTotalElements(response.data.totalElements); // Số bản ghi
      setTotalPages(response.data.totalPages); // Tổng số trang
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  // Xử lý khi người dùng chọn số bản ghi trên mỗi trang
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0); // Reset lại trang khi thay đổi số bản ghi
  };

  // Xử lý khi người dùng chuyển trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDeleteDecision = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenDelete(false);
    setOpenEdit(false);
    setOpenView(false);
    setOpenSearch(false);
    setQrCode(false);
  };

  const handleViewDecision = (decisionId) => {
    setViewDecisionId(decisionId);
    setOpenView(true);
  };

  const handleDelete = async () => {
    try {
      await decisionService.deleteDecision(deleteId);
      await fetchDecision({ page, size, ...searchFormData });
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa không thành công!");
    } finally {
      setOpenDelete(false);
    }
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
  const handleEditDecision = (decisionId) => {
    setEditDecisionId(decisionId);
    setOpenEdit(true);
  };
  const handleExportDecision = async (selectedId) => {
    setIsExporting(true);
    try {
      const response = await decisionService.exportDecision(selectedId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `quyet-dinh-xu-phat-${selectedId}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Xuất file thành công");
    } catch (error) {
      toast.error(error.response.data || "Xuất file không thành công");
    } finally {
      setIsExporting(false); // Hoàn tất xuất file, thiết lập lại trạng thái
    }
  };
  const handleQRCodeDecision = (id) => {
    setQrCodeDecisionId(id);
    setQrCode(true); // Mở modal
  };
  const handlePaymentDecision = (id) => {
    setPaymentId(id);
    setOpenPayment(true);
  };
  const handleAction = (action) => {
    if (selectedRows.length === 0) {
      toast.warning("Chưa chọn bản ghi nào!");
      return selectedRows;
    }
    if (selectedRows.length > 1) {
      toast.warning("Chỉ được chọn 1 bản ghi!");
      return selectedRows;
    }
    const selectedId = selectedRows[0];
    const selectedRecord = data.find((item) => item.id === selectedId);
    if (action === "pay") {
      if (selectedRecord && selectedRecord.paid) {
        toast.warning(`Bản ghi ${selectedId} đã nộp phạt!`);
        return;
      }
      handlePaymentDecision(selectedId);
    } else {
      switch (action) {
        case "view":
          handleViewDecision(selectedId);
          break;
        case "edit":
          handleEditDecision(selectedId);
          break;
        case "delete":
          handleDeleteDecision(selectedId);
          break;
        case "export":
          handleExportDecision(selectedId);
          break;
        case "qrcode":
          handleQRCodeDecision(selectedId);
          break;
        default:
          break;
      }
    }
  };
  const updateSelectedRows = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  return (
    <div className="row">
      <div className="col-12 col-sm-10">
        {loading ? (
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
        ) : (
          <PenaltyDecision
            onRowSelect={updateSelectedRows}
            selectedRows={selectedRows}
            size={size}
            page={page}
            data={data}
            totalElements={totalElements}
            totalPages={totalPages}
            handleSizeChange={handleSizeChange}
            handlePageChange={handlePageChange}
            setSize={setSize}
            setTotalElements={setTotalElements}
            setTotalPages={setTotalPages}
            setPage={setPage}
            selectedFields={selectedFields} // Gửi các trường đã chọn đến Decisions
            setSearchFormData={setSearchFormData}
            fetchDecision={fetchDecision}
          />
        )}
      </div>
      <div className="rightFn-KhaiThac col-12 col-sm-2">
        <button
          className="btn btn-warning mb-2"
          type="button"
          onClick={handleOpenSearchModal}
        >
          Tìm kiếm nâng cao
        </button>
        <SearchAdvanceModal
          onSelectFields={onSelectFields} // Truyền hàm xử lý trường đã chọn
          handleClose={handleCloseDialogs}
          openSearchModal={openDialogSearch}
          type={"decision"}
        />
        <ActionLink
          icon="bi-eye"
          label="Xem chi tiết"
          action="view"
          onAction={handleAction}
        />
        <ActionLink
          icon="bi-pencil"
          label="Chỉnh sửa"
          action="edit"
          onAction={handleAction}
        />
        <ActionLink
          icon="bi-trash"
          label="Xóa"
          action="delete"
          onAction={handleAction}
        />
        <ActionLink
          icon="bi-folder"
          label="Tạo bản in"
          action="export"
          onAction={handleAction}
        />
        <ActionLink
          icon="bi bi-credit-card-2-front"
          label="Nộp phạt"
          action="pay"
          onAction={handleAction}
        />
        <ActionLink
          icon="bi bi-qr-code-scan"
          label="Quét QR"
          action="qrcode"
          onAction={handleAction}
        />
        {isExporting && (
          <>
            <div class="spinner-border" role="status"></div>
            <span class="sr-only">Đang xuất file...</span>
          </>
        )}{" "}
        {/* Spinner hoặc thông báo */}
      </div>
      <PaymentModal
        show={openPayment}
        handleClose={handleClosePaymentDialog}
        decisionId={paymentId}
      />
      {openQRCode && (
        <ReportGeneratorModal
          open={openQRCode}
          onClose={handleCloseDialogs}
          id={qrCodeDecisionId} // Truyền ID vào modal nếu cần sử dụng
        />
      )}
      <DeleteConfirmationDialog
        open={openDelete}
        handleClose={handleCloseDialogs}
        handleDelete={handleDelete}
        deleteId={deleteId}
        label={"quyết định"}
      />
      {openEdit && (
        <EditDecisionDialog
          open={openEdit}
          onClose={handleClose}
          decisionId={editDecisionId}
          onEditDecision={() =>
            fetchDecision({ page, size, ...searchFormData })
          } // Refetch PenaltyDecision after editing
        />
      )}
    </div>
  );
}
// ActionLink Component for DRY code
const ActionLink = ({ icon, label, action, onAction }) => (
  <div
    className="rightLink mb-2"
    onClick={() => onAction(action)}
    style={{ cursor: "pointer" }}
  >
    <i className={`bi ${icon}`}></i>
    <a href="#" className="ms-2">
      {label}
    </a>
  </div>
);
