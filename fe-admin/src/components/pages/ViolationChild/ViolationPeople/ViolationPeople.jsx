import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useUserRoles } from "../../../../hooks/useUserRoles";
import violationPersonService from "../../../../service/violation-info.service";
import AccessDenied from "../../../layout/Error/AccessDenied";
import SearchField from "../../SearchField";
import "../../datatable.css";
import EditViolationPersonDialog from "./EditViolationPersonModal";

function ViolationPerson() {
  const { userRoles, groupRoles } = useUserRoles();
  // Kiểm tra nếu "ROLE_ADMIN" có trong cả userRoles và groupRoles
  const canView = [...userRoles, ...groupRoles].includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const handleClose = () => {
    setOpenEdit(false);
  };

  // Fetch users with optional search keyword
  const fetchViolationPerson = async (keyword = "") => {
    setLoading(true); // Bắt đầu trạng thái loading
    try {
      let response;
      if (keyword) {
        response = await violationPersonService.searchViolationPerson(keyword);
        setSearchResults(response.data);
      } else {
        response = await violationPersonService.listViolationPerson();
        setData(response.data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Lỗi truy xuất người dùng", error);
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  useEffect(() => {
    fetchViolationPerson();
  }, []);

  // Handle delete dialog

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  // Handle edit user
  const handleEditUser = (userId) => {
    setEditUserId(userId);
    setOpenEdit(true);
  };

  // Handle search
  const handleSearch = (keyword) => {
    fetchViolationPerson(keyword);
  };

  // Prepare data for DataGrid
  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      nguoiViPham: item.nguoiViPham || "",
      email: item.email || "",
      quocTich: item.quocTich || "",
      soLanViPham: item.soLanViPham || "",
      namSinh: item.namSinh || "",
      cccd: item.canCuoc || "",
    })
  );
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiViPham",
      headerName: "Tên",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 230,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quocTich",
      headerName: "Quốc tịch",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cccd",
      headerName: "CCCD",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "soLanViPham",
      headerName: "Số lần vi phạm",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
  ];

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
            onClick={() => handleEditUser(params.row.id)}
          >
            <div className="viewButton">
              <i className="bi bi-pencil-square"></i>
            </div>
          </button>
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
        Danh sách Người vi phạm
        <SearchField
          label={"Tra cứu người vi phạm"}
          onSearch={handleSearch}
          name={"username"}
        />
      </div>
      <DataGrid
        className="datagrid"
        rows={rows}
        columns={columns.concat(actionColumn)}
        checkboxSelection
        onSelectionModelChange={(ids) => {
          setSelectedRows(ids);
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
      />
      {openEdit && (
        <EditViolationPersonDialog
          open={openEdit}
          onClose={handleClose}
          userId={editUserId}
          onEditUser={() => fetchViolationPerson()} // Refetch users after editing
        />
      )}
    </div>
  );
}

export default ViolationPerson;
