import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../../utils/format";
import "../datatable.css";
import PaginationComponent from "../ViolationRecord/PaginatedViolation";
import SearchAdvanceFields from "./SearchFieldAdvance";
const PenaltyDecision = (propsPage) => {
  const [selectAll, setSelectAll] = useState(false);

  const [rows, setRows] = useState([]);
  // Prepare data for DataGrid
  const handleRowSelect = (id) => {
    propsPage.onRowSelect(id);
  };

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;

      if (newSelectAll) {
        // Select all rows if checked
        const allIds = propsPage.data.map((row) => row.id);
        allIds.forEach((id) => propsPage.onRowSelect(id)); // Notify parent for each selected ID
      } else {
        // Clear all selections if unchecked
        propsPage.data.forEach((row) => propsPage.onRowSelect(row.id)); // Notify parent to clear all
      }

      return newSelectAll; // Return new state
    });
  };
  // Handle search
  useEffect(() => {
    setRows(
      propsPage.data.map((item) => ({
        id: item.id,
        soQuyetDinh: item.soQuyetDinh,
        tenCoQuan: item?.tenCoQuan,
        nguoiThiHanh: item.nguoiThiHanh.profile.fullName || "",
        nguoiViPham: item.bienBanViPham.nguoiViPham
          ? item.bienBanViPham.nguoiViPham.nguoiViPham
          : "",
        // xuPhatChinh: item.xuPhatChinh,
        mucPhat: formatCurrency(item.mucPhat),
        paid: item.paid,
        hieuLucThiHanh: formatDate(item.hieuLucThiHanh),
      }))
    );
  }, [propsPage.data]);

  useEffect(() => {
    setSelectAll(propsPage.selectedRows.length === propsPage.data.length); // Check if all rows are selected
  }, [propsPage.selectedRows, propsPage.data.length]);

  const handleSearchSubmit = async (formData) => {
    // const queryParams = new URLSearchParams(formData).toString();
    // console.log(queryParams);
    // Gọi hàm fetchViolation từ component cha với tham số là formData
    propsPage.setSearchFormData(formData);
    await propsPage.fetchDecision({
      page: propsPage.page,
      size: propsPage.size,
      ...formData,
    });
  };
  return (
    <div className="datatable">
      <div className="datatableTitle">Danh sách Quyết định xử phạt</div>
      <SearchAdvanceFields
        selectedFields={propsPage.selectedFields}
        onSearch={handleSearchSubmit}
      />
      <div class="result-page-info">
        <div>
          Hiển thị 1 - {propsPage.size} trong số{" "}
          <b>{propsPage.totalElements}</b> bản ghi
        </div>
      </div>
      {/* <Table bordered hover responsive> */}
      <table className="table table-bordered table-hover table-responsive">
        <thead className="table-light text-center">
          <tr>
            <th class="selection-cell-header" data-row-selection="true">
              <input
                type="checkbox"
                className=""
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Số biên bản</th>
            <th>Tên cơ quan</th>
            <th>Hiệu lực thi hành</th>
            <th>Người thi hành</th>
            <th>Người vi phạm</th>
            <th>Mức phạt</th>
            <th>Tình trạng</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={propsPage.selectedRows.includes(row.id)}
                  onChange={() => handleRowSelect(row.id)}
                />
              </td>
              {/* <td>{row.maBienBan}</td> */}
              <td>{row.soQuyetDinh}/QĐ-XPVPHC</td>
              <td>{row.tenCoQuan}</td>
              <td>{row.hieuLucThiHanh}</td>
              <td>{row.nguoiThiHanh}</td>
              <td>{row.nguoiViPham}</td>
              <td>{row.mucPhat}</td>
              <td>
                <span
                  className={`badge ${row.paid ? "bg-success" : "bg-danger"}`}
                >
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {row.paid ? "Đã nộp phạt" : "Chưa nộp phạt"}
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationComponent
        page={propsPage.page}
        size={propsPage.size}
        totalPages={propsPage.totalPages}
        onSizeChange={propsPage.handleSizeChange}
        onPageChange={propsPage.handlePageChange}
      />
    </div>
  );
};

export default PenaltyDecision;
