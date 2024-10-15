package com.system.admin.service.report;

import com.system.admin.model.report.ReportDTO;
import com.system.admin.model.report.ReportType;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public abstract class AbstractReportService {
    protected DateFormat dateFormatter;
    public List<ReportDTO> getReportDataByDateRange(Date startTime, Date endTime
            , ReportType reportType){
        dateFormatter = new SimpleDateFormat("dd-MM-yyyy");
        return getReportDataByDateRangeInternal(startTime, endTime, reportType);
    }

    public List<ReportDTO> getReportDataLast7Days(ReportType reportType){
        System.out.println("getReportDataLast7Days...");
        return getReportDataLastXDays(7, reportType);
    }
    public List<ReportDTO> getReportDataLast1Day(ReportType reportType){
        System.out.println("getReportDataLast1Days...");
        return getReportDataLastXDays(2, reportType);
    }


    public List<ReportDTO> getReportDataLast30Days(ReportType reportType){
        System.out.println("getReportDataLast30Days...");
        return getReportDataLastXDays(30, reportType);
    }


    protected List<ReportDTO> getReportDataLastXDays(int days, ReportType reportType){
        Date endTime = new Date();
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -(days -1));
        Date startTime = cal.getTime();
        System.out.println("Start time: " + startTime);
        System.out.println("End time: " + endTime);
        dateFormatter = new SimpleDateFormat("dd-MM-yyyy");
        return getReportDataByDateRangeInternal(startTime, endTime, reportType);
    }
    public List<ReportDTO> getReportDataLast6Months(ReportType reportType){
        return getReportDataLastXMonths(6, reportType);
    }
    public List<ReportDTO> getReportDataLastYear(ReportType reportType){
        return getReportDataLastXMonths(12, reportType );
    }
    protected List<ReportDTO> getReportDataLastXMonths(int months, ReportType reportType){
        Date endTime = new Date();
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -(months -1));
        Date startTime = cal.getTime();
        System.out.println("Start time: " + startTime);
        System.out.println("End time: " + endTime);
        dateFormatter = new SimpleDateFormat("MM-yyyy");
        return getReportDataByDateRangeInternal(startTime, endTime, reportType);
    }

    protected abstract List<ReportDTO> getReportDataByDateRangeInternal
            (Date startDate, Date endDate, ReportType reportType);
}
