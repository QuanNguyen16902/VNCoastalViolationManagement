import {
  Button,
  Divider,
  FormControl,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import reportService from "../../../service/report.service";
import DashboardBox from "./DashboardBox";
import "./report.css";
import ReportTable from "./ReportTable";
import TotalFinesChart from "./TotalFinesChart";

function CardBox() {
  const [showByLast, setShowByLast] = useState("");

  const [reportData, setReportData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [option, setOption] = useState("");
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  const optionSearch = ["Last Day", "Last Week", "Last Month", "Last Year"];
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const fetchDataLast = async (payload) => {
    try {
      const response = await reportService.getReport(payload); // API endpoint of your service
      const data = await response.data;
      setReportData(data); // Store data in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOptionClick = (option) => {
    const type = option.toLowerCase().replace(" ", "_"); // Convert "Last Day" to "last_day"
    console.log(type);
    const payload = {
      type: type,
      date: new Date().toISOString().slice(0, 10), // Set the current date and time, or customize as needed
    };
    console.log(payload);
    setOption(option);
    fetchDataLast(payload); // Pass the payload to fetchDataLast
    setShowByLast(option);
  };
  useEffect(() => {
    // Fetch default data for "Last Day" when the page loads
    const defaultPayload = {
      type: "last_day",
      date: new Date().toISOString().slice(0, 10),
    };
    fetchDataLast(defaultPayload);
  }, []);

  return (
    <>
      <div className="right-content w-100">
        <div className="row m-2 d-flex align-items-center justify-content-between">
          <h2 className="hd mt-2 w-25">
            <b>Tổng Quan</b>
          </h2>

          <FormControl size="small" className="w-25">
            <Select
              value={showByLast}
              onChange={(e) => setShowByLast(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              className="bg-white"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {optionSearch.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={"bx bxs-check-circle"}
                grow={true}
                label="Tổng số vi phạm"
                value={reportData ? reportData.totalViolations : 0}
                option={option}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={"bx bxs-info-circle"}
                grow={false}
                label="Tổng số quyết định"
                value={reportData ? reportData.totalDecision : 0}
                option={option}
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={"bx bxs-dollar-circle"}
                grow={true}
                label="Vi phạm cần giải quyết"
                value={reportData ? reportData.violationsToResolve : 0}
                option={option}
              />
              <DashboardBox
                color={["#e1950e", "#f3cd29"]}
                icon={"bx bxs-report"}
                grow={true}
                label="Vi phạm đã giải quyết"
                value={reportData ? reportData.violationsResolved : 0}
                option={option}
              />
            </div>
          </div>

          <div className="col-md-4 pl-0">
            <div className="box graphBox">
              <div className="d-flex align-items-center w-100 bottomEle">
                <h6 className="text-white mb-0 mt-0">Tổng tiền phạt thu về</h6>
                <div className="ms-auto">
                  <Button className="ms-auto toggleIcon" onClick={handleClick}>
                    <i class="bx bx-dots-vertical-rounded"></i>
                  </Button>
                </div>

                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    },
                  }}
                >
                  {optionSearch.map((option) => (
                    <MenuItem
                      key={option}
                      selected={option === "Pyxis"}
                      onClick={handleClose}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>

              <h3 className="text-white font-weight-bold">
                {formatCurrency(reportData?.totalFines)}
              </h3>
              <p>3,457,432 VNĐ vào tháng trước</p>

              <TotalFinesChart
                reportData={reportData}
                showByLast={showByLast}
                option={option}
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h1 className="hd mt-2">Báo Cáo Doanh Số Theo Ngày</h1>

          <div className="row cardFilters mt-3">
            <div className="col-md-3"></div>
            <Divider />
          </div>

          <ReportTable />
        </div>
      </div>
    </>
  );
}

export default CardBox;
