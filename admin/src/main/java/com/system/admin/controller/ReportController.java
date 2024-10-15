package com.system.admin.controller;

import com.system.admin.model.report.*;
import com.system.admin.service.DecisionService;
import com.system.admin.service.ReportService;
import com.system.admin.service.report.MasterReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class ReportController {
    @Autowired
    private ReportService reportService;
    @Autowired
    private DecisionService penaltyDecisionService;
    @Autowired private MasterReportService masterReportService;
    @PostMapping("/reports")
    public ResponseEntity<ReportDTO> getViolationsSummaryReport(@RequestBody TimeRange timeRange) {
        ReportDTO report = reportService.generateReport(timeRange);
        return ResponseEntity.ok(report);
    }


    @GetMapping("/reports/by_date/{period}")
    public List<ReportDTO> getReportDataByDatePeriod(@PathVariable("period") String period){
        System.out.println("Report period: " + period);
        switch(period) {
            case "last_day":
                return masterReportService.getReportDataLast1Day(ReportType.DAY);
            case "last_7_days":
                return masterReportService.getReportDataLast7Days(ReportType.DAY);
            case "last_30_days":
                return masterReportService.getReportDataLast30Days(ReportType.DAY);
            case "last_6_months":
                return masterReportService.getReportDataLast6Months(ReportType.MONTH);
            case "last_year":
                return masterReportService.getReportDataLastYear(ReportType.MONTH);
            default:
                return masterReportService.getReportDataLast1Day(ReportType.DAY);
        }
    }

    // Lấy dữ liệu báo cáo theo phạm vi ngày
    @GetMapping("/reports/by_date_range")
    public ResponseEntity<List<ReportDTO>> getReportByDateRange(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate ) {

        List<ReportDTO> reportData = masterReportService.getReportDataByDateRange(startDate, endDate, ReportType.DAY);
        return ResponseEntity.ok(reportData); // Trả về dữ liệu với mã trạng thái HTTP 200
    }


}
