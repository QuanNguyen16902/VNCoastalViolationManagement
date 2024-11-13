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
import AccessDenied from "../../layout/Error/AccessDenied";
import "../datatable.css";
import SearchField from "../SearchField";
import AddUserGroupModal from "./AddUserGroupModal";
import EditUserGroupDialog from "./EditUserGroupModal";
import "./userGroup.css";
import UsersOfGroupModal from "./UsersOfGroup";

function UsersGroup() {
  const { userRoles, groupRoles } = useUserRoles();
  // Kiểm tra nếu "ROLE_ADMIN" có trong cả userRoles và groupRoles
  const canView = [...userRoles, ...groupRoles].includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserGroupId, setEditUserGroupId] = useState(null);
  const [openUserOfGroup, setOpenUserOfGroup] = useState(false);
  const [userOfGroupId, setUserOfGroupId] = useState(null);

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
    setOpenUserOfGroup(false);
  };

  // Handle edit user
  const handleEditUserGroup = (userGroupId) => {
    setEditUserGroupId(userGroupId);
    setOpenEdit(true);
  };
  // Handle view users of group
  const handleUsersOfGroup = (userGroupId) => {
    setUserOfGroupId(userGroupId);
    setOpenUserOfGroup(true);
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
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Tên nhóm", width: 180 },
    { field: "description", headerName: "Mô tả", width: 380 },
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
            onClick={() => handleUsersOfGroup(params.row.id)} // Pass the user group ID
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
    return <AccessDenied />;
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
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        disableRowSelectionOnClick
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
      {openUserOfGroup && (
        <UsersOfGroupModal
          open={openUserOfGroup}
          onClose={handleClose}
          userGroupId={userOfGroupId}
          // onEditUserGroup={() => fetchUsersGroup()} // Refetch usersGroup after editing
        />
      )}
    </div>
  );
}

export default UsersGroup;
