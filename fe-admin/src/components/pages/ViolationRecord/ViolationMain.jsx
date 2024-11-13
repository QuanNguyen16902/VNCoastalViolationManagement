import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Import thư viện toast
import { useUserRoles } from "../../../hooks/useUserRoles";
import violationService from "../../../service/violation.service";
import AccessDenied from "../../layout/Error/AccessDenied";
import DeleteConfirmationDialog from "./DeleteConfirmDialog ";
import EditViolationDialog from "./EditViolationModal";
import ViolationRecords from "./ListViolation/ListViolation";
import SearchAdvanceModal from "./SearchAdvanceButton/ModalSearchAdvance";
import ViewViolationModal from "./ViewViolationModal";
import "./ViolationMain.css";

export default function ViolationMain() {
  const { userRoles, groupRoles } = useUserRoles();
  // Kiểm tra nếu "ROLE_ADMIN" có trong cả userRoles và groupRoles
  const canView = [...userRoles, ...groupRoles].includes("ROLE_ADMIN");

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
  const [editViolationId, setEditViolationId] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [viewViolationId, setViewViolationId] = useState(null);
  // Pagination
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // Trang hiện tại
  const [size, setSize] = useState(5); // Số bản ghi trên mỗi trang
  const [searchFormData, setSearchFormData] = useState({});
  const [totalElements, setTotalElements] = useState(0); // Tổng số bản ghi
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    fetchViolation({ page, size, ...searchFormData });
  }, [page, size, searchFormData]);

  // Hàm lấy dữ liệu từ backend
  const fetchViolation = async (queryParams) => {
    setLoading(false);
    try {
      const response = await violationService.searchViolation(queryParams);
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

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await violationService.deleteViolation(deleteId);
      toast.success(`Xóa biên bản có ID ${deleteId} thành công!`);
      fetchViolation({ page, size, ...searchFormData });
    } catch (error) {
      toast.error(error.data?.message || "Xóa không thành công");
    } finally {
      setOpenDelete(false);
    }
  };

  const handleDeleteViolation = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenDelete(false);
    setOpenEdit(false);
    setOpenView(false);
    setOpenSearch(false);
  };

  const handleEditViolation = (violationId) => {
    setEditViolationId(violationId);
    setOpenEdit(true);
  };
  const handleViewViolation = (violationId) => {
    setViewViolationId(violationId);
    setOpenView(true);
  };
  const handleExportViolation = async (selectedId) => {
    setIsExporting(true);
    try {
      const response = await violationService.exportViolation(selectedId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bien-ban-vi-pham-${selectedId}.pdf`);
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
  const handleChangeResolve = async (id, resolved) => {
    console.log(id, resolved);
    try {
      const response = await violationService.changeResolved(id, resolved);
      console.log(response);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, resolved } : item))
      );
      toast.success(response.data);
    } catch (error) {
      console.error("Lỗi khi update tình trạng:", error);
      toast.error(error.response.data);
    } finally {
      setIsExporting(false); // Hoàn tất xuất file, thiết lập lại trạng thái
    }
  };
  // Handle actions for selected rows
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

    switch (action) {
      case "view":
        handleViewViolation(selectedId);
        break;
      case "edit":
        handleEditViolation(selectedId);
        break;
      case "delete":
        handleDeleteViolation(selectedId);
        break;
      case "export":
        handleExportViolation(selectedId);
        break;
      default:
        break;
    }
  };
  const updateSelectedRows = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Render when the user doesn't have view permissions
  if (!canView) {
    return <AccessDenied />;
  }

  return (
    <div>
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
            <ViolationRecords
              onRowSelect={updateSelectedRows}
              selectedRows={selectedRows}
              size={size}
              page={page}
              data={data}
              totalElements={totalElements}
              totalPages={totalPages}
              handleChangeResolve={handleChangeResolve}
              handleSizeChange={handleSizeChange}
              handlePageChange={handlePageChange}
              setSize={setSize}
              setTotalElements={setTotalElements}
              setTotalPages={setTotalPages}
              setPage={setPage}
              selectedFields={selectedFields} // Gửi các trường đã chọn đến ViolationRecords
              setSearchFormData={setSearchFormData}
              fetchViolation={fetchViolation}
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
            type={"violation"}
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
          {isExporting && (
            <>
              <div class="spinner-border" role="status"></div>
              <span class="sr-only">Đang xuất file...</span>
            </>
          )}{" "}
          {/* Spinner hoặc thông báo */}
        </div>
      </div>
      <DeleteConfirmationDialog
        open={openDelete}
        handleClose={handleCloseDialogs}
        handleDelete={handleDelete}
        deleteId={deleteId}
        label={"biên bản"}
      />
      {openEdit && (
        <EditViolationDialog
          open={openEdit}
          onClose={handleCloseDialogs}
          violationId={editViolationId}
          onEditViolation={() =>
            fetchViolation({ page, size, ...searchFormData })
          }
        />
      )}
      {openView && (
        <ViewViolationModal
          open={openView}
          onClose={handleCloseDialogs}
          violationId={viewViolationId}
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
