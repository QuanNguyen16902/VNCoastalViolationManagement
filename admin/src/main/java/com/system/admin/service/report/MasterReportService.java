package com.system.admin.service.report;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.model.report.ReportDTO;
import com.system.admin.model.report.ReportType;
import com.system.admin.repository.violation.PenaltyDecisionRepo;
import com.system.admin.repository.violation.ViolationRecordRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class MasterReportService extends AbstractReportService{
	@Autowired private PenaltyDecisionRepo repo;
	@Autowired private ViolationRecordRepo violationRepo;

	protected List<ReportDTO> getReportDataByDateRangeInternal(Date startTime,
															   Date endTime, ReportType reportType){
		List<PenaltyDecision> listDecision = repo.findDecisionTimeBetween(startTime, endTime);
		List<ViolationRecord> listViolation = violationRepo.findViolationTimeBetween(startTime, endTime);
		printRawData(listDecision);

		List<ReportDTO> listReportDTOs = createReportData(startTime, endTime, reportType);
		System.out.println();

		calculateDecisionForReportData(listDecision, listReportDTOs);
		calculateViolationForReportData(listViolation, listReportDTOs);

		printReportData(listReportDTOs);
		return listReportDTOs;
	}
	private void calculateViolationForReportData(List<ViolationRecord> listViolation, List<ReportDTO> listReportDTOs) {
		for(ViolationRecord violation : listViolation) {
			String decisionDateString = dateFormatter.format(violation.getThoiGianLap());

			ReportDTO reportItem = new ReportDTO(decisionDateString);
			int itemIndex = listReportDTOs.indexOf(reportItem);
			if(itemIndex >= 0) {
				reportItem = listReportDTOs.get(itemIndex);
				reportItem.increaseViolationCount();
			}
			System.out.println("phat:" + reportItem.getTotalFines());
		}
//		listReportDTOs.stream().forEach(s -> System.out.println(s.getTotalFines()));
	}

	private void calculateDecisionForReportData(List<PenaltyDecision> listDecision, List<ReportDTO> listReportDTOs) {
		for(PenaltyDecision decision : listDecision) {
			String decisionDateString = dateFormatter.format(decision.getHieuLucThiHanh());

			ReportDTO reportItem = new ReportDTO(decisionDateString);
			int itemIndex = listReportDTOs.indexOf(reportItem);
			System.out.println(itemIndex);
			if(itemIndex >= 0) {
				reportItem = listReportDTOs.get(itemIndex);
				reportItem.addTotalFines(decision.getMucPhat());
				reportItem.increaseDecisionCount();
			}
			System.out.println("phat:" + reportItem.getTotalFines());
		}
//		listReportDTOs.stream().forEach(s -> System.out.println(s.getTotalFines()));
	}
	private void printReportData(List<ReportDTO> listReportDTOs) {
		listReportDTOs.forEach(item -> {
			System.out.printf("%s, %10.2f, %d, %d \n", item.getIdentified()
					, item.getTotalFines(), item.getTotalDecision(), item.getTotalViolations());
		});
	}

	private List<ReportDTO> createReportData(Date startTime, Date endTime, ReportType reportType) {
		List<ReportDTO> listReportDTOs = new ArrayList<>();
		
		Calendar startDate = Calendar.getInstance();
		startDate.setTime(startTime);
		
		Calendar endDate = Calendar.getInstance();
		endDate.setTime(endTime);
		
		Date currentDate = startDate.getTime();
		String dateString = dateFormatter.format(currentDate);
		listReportDTOs.add(new ReportDTO(dateString));
		
		do {
			if(reportType.equals(ReportType.DAY)) {
				startDate.add(Calendar.DAY_OF_MONTH, 1);
			}else if(reportType.equals(ReportType.MONTH)) {
				startDate.add(Calendar.MONTH, 1);
			}
			
			currentDate = startDate.getTime();
			dateString = dateFormatter.format(currentDate);
			listReportDTOs.add(new ReportDTO(dateString));
		}while(startDate.before(endDate));
		
		return listReportDTOs;
	}

	private void printRawData(List<PenaltyDecision> listDecision) {
		listDecision.forEach(decision -> {
			System.out.printf("%-3d | %s | %s | %s \n",
							decision.getId(), decision.getMucPhat(), decision.getPaid(), decision.getHieuLucThiHanh());
		});
	}
	
	
}
