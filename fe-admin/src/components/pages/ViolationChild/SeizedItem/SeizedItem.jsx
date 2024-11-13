import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useUserRoles } from "../../../../hooks/useUserRoles";
import violationPersonService from "../../../../service/violation-info.service";
import { formatDate } from "../../../../utils/format";
import AccessDenied from "../../../layout/Error/AccessDenied";
import SearchField from "../../SearchField";
import "../../datatable.css";
import EditSeizedItemDialog from "./EditSeizedItemModal";

function SeizedItem() {
  const { userRoles, groupRoles } = useUserRoles();
  // Kiểm tra nếu "ROLE_ADMIN" có trong cả userRoles và groupRoles
  const canView = [...userRoles, ...groupRoles].includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const handleClose = () => {
    setOpenEdit(false);
  };

  // Fetch users with optional search keyword
  const fetchSeizedItem = async (keyword = "") => {
    setLoading(true); // Bắt đầu trạng thái loading
    try {
      let response;
      if (keyword) {
        response = await violationPersonService.searchSeizedItem(keyword);
        setSearchResults(response.data);
      } else {
        response = await violationPersonService.listSeizedItem();
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
    fetchSeizedItem();
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
    fetchSeizedItem(keyword);
  };

  // Prepare data for DataGrid
  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      itemName: item.itemName || "",
      description: item.description || "",
      quantity: item.quantity || "",
      seizureDate: formatDate(item.seizureDate) || "",
      status: item.status || "",
      violation_record_id: item.violation_record_id || "",
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
      field: "itemName",
      headerName: "Tên",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "seizureDate",
      headerName: "Ngày thu giữ",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "violation_record_id",
      headerName: "Thuộc biên bản",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Hành động",
      width: 150,
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
        Danh sách Tang vật
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
        <EditSeizedItemDialog
          open={openEdit}
          onClose={handleClose}
          seizedItemId={editUserId}
          onEditSeizedItem={() => fetchSeizedItem()} // Refetch users after editing
        />
      )}
    </div>
  );
}

export default SeizedItem;
