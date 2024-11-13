import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useUserRoles } from "../../../../hooks/useUserRoles";
import violationPersonService from "../../../../service/violation-info.service";
import AccessDenied from "../../../layout/Error/AccessDenied";
import SearchField from "../../SearchField";
import "../../datatable.css";
import EditViolationShipDialog from "./EditViolationShipModal";
function ViolationShip() {
  const { userRoles, groupRoles } = useUserRoles();
  // Kiểm tra nếu "ROLE_ADMIN" có trong cả userRoles và groupRoles
  const canView = [...userRoles, ...groupRoles].includes("ROLE_ADMIN");

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editShipId, setEditUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const handleClose = () => {
    setOpenEdit(false);
  };

  // Fetch users with optional search keyword
  const fetchViolationShip = async (keyword = "") => {
    setLoading(true); // Bắt đầu trạng thái loading
    try {
      let response;
      if (keyword) {
        response = await violationPersonService.searchViolationShip(keyword);
        setSearchResults(response.data);
      } else {
        response = await violationPersonService.listViolationShip();
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
    fetchViolationShip();
  }, []);

  // Handle edit user
  const handleEditUser = (userId) => {
    setEditUserId(userId);
    setOpenEdit(true);
  };

  // Handle search
  const handleSearch = (keyword) => {
    fetchViolationShip(keyword);
  };

  // Prepare data for DataGrid
  const rows = (searchResults.length > 0 ? searchResults : data).map(
    (item) => ({
      id: item.id,
      soHieuTau: item.soHieuTau || "",
      diaDiem: item.diaDiem || "",
      tongDungTich: item.tongDungTich || "",
      congSuat: item.congSuat || "",
      haiTrinhCapPhep: item.haiTrinhCapPhep || "",
      toaDo: `(${item.toaDoX || ""}, ${item.toaDoY || ""})`,
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
      field: "soHieuTau",
      headerName: "Số hiệu tàu",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tongDungTich",
      headerName: "Tổng dung tích",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <span className="rolesName">{params.value}</span>;
      },
    },
    {
      field: "congSuat",
      headerName: "Công suất",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <span className="rolesName">{params.value}</span>;
      },
    },
    {
      field: "toaDo",
      headerName: "Tọa độ vi phạm",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <span className="badgeName">{params.value}</span>;
      },
    },
    {
      field: "haiTrinhCapPhep",
      headerName: "Hải trình cấp phép",
      width: 250,
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
        Danh sách Tàu vi phạm
        <SearchField
          label={"Tra cứu tàu vi phạm"}
          onSearch={handleSearch}
          name={"username"}
        />
      </div>
      <DataGrid
        className="datagrid"
        rows={rows}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
      />
      {openEdit && (
        <EditViolationShipDialog
          open={openEdit}
          onClose={handleClose}
          shipId={editShipId}
          onEditShip={() => fetchViolationShip()} // Refetch users after editing
        />
      )}
    </div>
  );
}

export default ViolationShip;
