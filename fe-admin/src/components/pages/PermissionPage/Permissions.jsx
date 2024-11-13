import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Tag } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserRoles } from "../../../hooks/useUserRoles";
import permissionService from "../../../service/permission.service";
import AccessDenied from "../../layout/Error/AccessDenied";
import "../datatable.css";
import SearchField from "../SearchField";
import AddPermissionModal from "./AddPermissionModal";
import EditPermissionModal from "./EditPermissionModal";

function Permissions() {
  const { userRoles, groupRoles } = useUserRoles();
  // Kiểm tra nếu "ROLE_ADMIN" có trong cả userRoles và groupRoles
  const canView = [...userRoles, ...groupRoles].includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editPermissionId, setEditPermissionId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch permissions with optional search keyword
  const fetchPermissions = async (keyword = "") => {
    try {
      let response;
      if (keyword) {
        response = await permissionService.searchPermission(keyword);
        setSearchResults(response.data);
      } else {
        response = await permissionService.getListPermissions();
        setData(response.data);
        setSearchResults([]); // Clear search results when no keyword
      }
    } catch (error) {
      console.error("Failed to fetch permissions", error);
      toast.error("Lỗi khi tải danh sách phân quyền");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleDelete = async () => {
    try {
      await permissionService.deletePermission(deleteId);
      setData((prevData) => prevData.filter((item) => item.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa không thành công!");
    } finally {
      setOpenDelete(false);
    }
  };

  const handleDeletePermission = (roleId) => {
    setDeleteId(roleId);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEditPermission = (roleId) => {
    setEditPermissionId(roleId);
    setOpenEdit(true);
  };

  const handleSearch = (keyword) => {
    fetchPermissions(keyword);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Tên",
      width: 150,
      renderCell: (params) => {
        let color;
        const text = params.value.toUpperCase(); // Chuyển tất cả sang chữ hoa để so sánh
        if (text.startsWith("CREATE")) {
          color = "green"; // Tất cả các hành động "create"
        } else if (text.startsWith("EDIT")) {
          color = "blue"; // Tất cả các hành động "update"
        } else if (text.startsWith("DELETE")) {
          color = "red"; // Tất cả các hành động "delete"
        } else if (text.startsWith("VIEW")) {
          color = "gold"; // Tất cả các hành động "delete"
        } else {
          color = "gray"; // Các trường hợp khác
        }

        return <Tag color={color}>{params.value}</Tag>;
      },
    },
    { field: "description", headerName: "Mô tả", width: 230 },
  ];

  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    })
  );

  const actionColumn = [
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <button
            style={{
              textDecoration: "none",
              border: "none",
              background: "none",
            }}
            onClick={() => handleEditPermission(params.row.id)}
          >
            <div className="viewButton">
              <i className="bi bi-pencil-square"></i>
            </div>
          </button>
          <div
            className="deleteButton"
            onClick={() => handleDeletePermission(params.row.id)}
          >
            <i className="bi bi-trash"></i>
          </div>
        </div>
      ),
    },
  ];
  if (!canView) {
    return <AccessDenied />;
  }
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Danh sách Phân Quyền
        <SearchField label={"Tra cứu phân Quyền"} onSearch={handleSearch} />
        <button className="link" onClick={() => setOpenAdd(true)}>
          <i className="bi bi-person-add hover"></i>&nbsp;
          <span>Thêm</span>
        </button>
        <AddPermissionModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAddPermission={fetchPermissions}
        />
      </div>
      <DataGrid
        className="datagrid"
        rows={rows}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        onSelectionModelChange={(ids) => setSelectedRows(ids)}
        disableSelectionOnClick
      />

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa quyền có <b>ID {deleteId}</b>? Hành động
            này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy bỏ</Button>
          <Button onClick={handleDelete} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {openEdit && (
        <EditPermissionModal
          open={openEdit}
          onClose={handleCloseEdit}
          permissionId={editPermissionId}
          onEditPermission={fetchPermissions}
        />
      )}
    </div>
  );
}

export default Permissions;
