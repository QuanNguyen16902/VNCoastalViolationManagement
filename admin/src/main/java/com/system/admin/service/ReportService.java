package com.system.admin.service;

import com.system.admin.model.report.ReportDTO;
import com.system.admin.model.report.TimeRange;
import com.system.admin.repository.violation.PenaltyDecisionRepo;
import com.system.admin.repository.violation.ViolationRecordRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.Locale;

@Service
public class ReportService {

    @Autowired
    private ViolationRecordRepo violationRepo;
    @Autowired
    private PenaltyDecisionRepo decisionRepo;

    public ReportDTO generateReport(TimeRange timeRange){
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        switch (timeRange.getType().toLowerCase()){
            case "day":
                LocalDate day = LocalDate.parse(timeRange.getDate());
                startDateTime = day.atStartOfDay();
                endDateTime = day.plusDays(1).atStartOfDay().minusSeconds(1);
                break;
            case "week":
                LocalDate week = LocalDate.parse(timeRange.getDate());
                WeekFields weekFields = WeekFields.of(Locale.getDefault());
                int weekNumber = week.get(weekFields.weekOfWeekBasedYear());
                int year = week.getYear();
                startDateTime = LocalDate.now().withYear(year)
                        .with(weekFields.weekOfWeekBasedYear(), weekNumber)
                        .with(weekFields.dayOfWeek(), 1)
                        .atStartOfDay();
                endDateTime = startDateTime.plusWeeks(1).minusSeconds(1);
                break;
            case "month":
                LocalDate month = LocalDate.parse(timeRange.getDate());
                startDateTime = month.withDayOfMonth(1).atStartOfDay();
                endDateTime = month.plusMonths(1).withDayOfMonth(1).atStartOfDay().minusSeconds(1);
                break;
            case "year":
                LocalDate yearDate = LocalDate.parse(timeRange.getDate());
                startDateTime = yearDate.withDayOfYear(1).atStartOfDay();
                endDateTime = yearDate.plusYears(1).withDayOfYear(1).atStartOfDay().minusSeconds(1);
                break;
            case "range":
                startDateTime = LocalDate.parse(timeRange.getStartDate()).atStartOfDay();
                endDateTime = LocalDate.parse(timeRange.getEndDate()).atTime(23, 59, 59);
                break;
            case "last_day":
                startDateTime = LocalDateTime.now().minusDays(1);
                endDateTime = LocalDateTime.now();
                break;
            case "last_week":
                startDateTime = LocalDateTime.now().minusWeeks(1);
                endDateTime = LocalDateTime.now();
                break;
            case "last_month":
                startDateTime = LocalDateTime.now().minusMonths(1);
                endDateTime = LocalDateTime.now();
                break;
            case "last_year":
                startDateTime = LocalDateTime.now().minusYears(1);
                endDateTime = LocalDateTime.now();
                break;

            default:
                throw new IllegalArgumentException("Sai kiểu thời gian");
        }

        Long totalShip = violationRepo.countDistinctShipsByViolationDateBetween(startDateTime, endDateTime);
        Integer totalViolation = violationRepo.countAllByViolationDateBetween(startDateTime,endDateTime);
        Long violationToResolve = violationRepo.countViolationsToResolve(startDateTime, endDateTime);
        Long violationResolved = violationRepo.countViolationsResolved(startDateTime, endDateTime);

        Double totalFines = decisionRepo.sumFineAmountByDecisionDateBetween(startDateTime, endDateTime);
        Long decisionPaid = decisionRepo.countDecisionPaid(startDateTime, endDateTime);
        Long decisionUnPaid = decisionRepo.countDecisionUnPaid(startDateTime, endDateTime);
        Integer totalDecision = decisionRepo.countAllByDecisionDateBetween(startDateTime, endDateTime);
        if (totalFines == null) {
            totalFines = 0.0;
        }
        return new ReportDTO(totalShip,totalViolation, violationToResolve, violationResolved,
                            totalDecision, totalFines, decisionPaid, decisionUnPaid);

    }
}
