import { useEffect, useState } from "react";
import { formatDate } from "../../../../utils/format";
import "../../datatable.css";
import PaginationComponent from "../PaginatedViolation";
import SearchAdvanceFields from "../SearchAdvanceButton/FieldsSearchAdvance";
import "./ListViolation.css";

const ViolationRecords = (propsPage) => {
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

      return newSelectAll;
    });
  };
  // useEffect(() => {
  //   setSelectAll(propsPage.selectedRows.length === propsPage.data.length); // Check if all rows are selected
  // }, [propsPage.selectedRows, propsPage.data?.length]);
  useEffect(() => {
    setRows(
      propsPage.data.map((item) => ({
        id: item.id,
        maBienBan: item.maBienBan,
        soVanBan: item.soVanBan,
        thoiGianLap: formatDate(item.thoiGianLap),
        nguoiChungKien: item.nguoiChungKien,
        nguoiViPham: item.nguoiViPham ? item.nguoiViPham.nguoiViPham : "",
        nguoiThietHai: item.nguoiThietHai,
        resolved: item.resolved,
      }))
    );
  }, [propsPage.data]);
  const handleSearchSubmit = async (formData) => {
    // const queryParams = new URLSearchParams(formData).toString();
    // console.log(queryParams);
    // Gọi hàm fetchViolation từ component cha với tham số là formData
    propsPage.setSearchFormData(formData);
    await propsPage.fetchViolation({
      page: propsPage.page,
      size: propsPage.size,
      ...formData,
    });
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">Danh sách Biên bản vi phạm</div>
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
            <th>Mã biên bản</th>
            <th>Số biên bản</th>
            <th>Thời gian lập</th>
            <th>Người chứng kiến</th>
            <th>Người vi phạm</th>
            <th>Người thiệt hại</th>
            <th>Tình trạng</th>
            {/* <th>Hành động</th> */}
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
              <td>{row.maBienBan}</td>
              <td>{row.soVanBan}/BB-VPHC</td>
              <td>{row.thoiGianLap}</td>
              <td>{row.nguoiChungKien}</td>
              <td>{row.nguoiViPham}</td>
              <td>{row.nguoiThietHai}</td>
              <td>
                <span
                  className={`badge ${
                    row.resolved ? "bg-success" : "bg-danger"
                  }`}
                >
                  <button
                    onClick={() =>
                      propsPage.handleChangeResolve(row.id, !row.resolved)
                    }
                    style={{
                      border: "none",
                      background: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {row.resolved ? "Đã giải quyết" : "Chưa giải quyết"}
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

export default ViolationRecords;
