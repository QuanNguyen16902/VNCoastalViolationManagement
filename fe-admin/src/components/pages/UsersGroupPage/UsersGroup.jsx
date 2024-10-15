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
import userGroupService from "../../../service/user-group.service";
import "../datatable.css";
import SearchField from "../SearchField";
import AddUserGroupModal from "./AddUserGroupModal";
import EditUserGroupDialog from "./EditUserGroupModal";
import "./userGroup.css";

function UsersGroup() {
  const roles = useUserRoles();
  const canView = roles.includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserGroupId, setEditUserGroupId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch usersGroup with optional search keyword
  const fetchUsersGroup = async (keyword = "") => {
    setLoading(true);
    let isMounted = true;

    try {
      let response;
      if (keyword) {
        response = await userGroupService.searchGroup(keyword);
        setSearchResults(response.data);
      } else {
        response = await userGroupService.getUsersGroup();
        setData(response.data);
        setSearchResults([]);
      }
    } catch (error) {
      if (isMounted) {
        console.error("Lỗi truy xuất nhóm người dùng", error);
        // toast.error("Không thể tải dữ liệu nhóm người dùng");
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
    fetchUsersGroup();
  }, []);

  // Handle delete dialog
  const handleDelete = async () => {
    try {
      await userGroupService.deleteGroup(deleteId);
      await fetchUsersGroup(); // Refetch after delete
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
  const handleEditUserGroup = (userGroupId) => {
    setEditUserGroupId(userGroupId);
    setOpenEdit(true);
  };

  // Handle search
  const handleSearch = (keyword) => {
    fetchUsersGroup(keyword);
  };

  const handleAddUserToGroup = (userGroupId) => {
    // Implement the add user to group logic
  };

  // Prepare data for DataGrid
  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    })
  );

  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    { field: "name", headerName: "Name", width: 140 },
    { field: "description", headerName: "Description", width: 330 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <div
            className="addUserButton"
            title="Thêm người dùng"
            onClick={() => handleAddUserToGroup(params.row.id)} // Pass the user group ID
          >
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <button
            title="Chỉnh sửa nhóm"
            style={{
              textDecoration: "none",
              border: "none",
              background: "none",
            }}
            onClick={() => handleEditUserGroup(params.row.id)}
          >
            <div className="viewButton">
              <i className="bi bi-pencil-square"></i>
            </div>
          </button>
          <div
            title="Xóa nhóm"
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
          <h4 className="mt-3">Bạn không có quyền xem danh sách người dùng</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Danh sách Nhóm người dùng
        <SearchField
          label={"Tra cứu nhóm người dùng"}
          onSearch={handleSearch}
        />
        <button className="link" onClick={() => setOpenAdd(true)}>
          <i className="bi bi-person-add hover"></i>&nbsp;<span>Thêm</span>
        </button>
        <AddUserGroupModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAddUserGroup={() => fetchUsersGroup()} // Refetch usersGroup after adding
        />
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
      />
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa nhóm người dùng có <b>ID {deleteId}</b>?
            Hành động này không thể hoàn tác.
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
        <EditUserGroupDialog
          open={openEdit}
          onClose={handleClose}
          userGroupId={editUserGroupId}
          onEditUserGroup={() => fetchUsersGroup()} // Refetch usersGroup after editing
        />
      )}
    </div>
  );
}

export default UsersGroup;
