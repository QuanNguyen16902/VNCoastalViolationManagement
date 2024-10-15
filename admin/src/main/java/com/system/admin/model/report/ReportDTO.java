package com.system.admin.model.report;

// src/main/java/com/example/crm/dto/ReportDTO.java

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
public class ReportDTO {
    private String identified;
    private Long totalShips;
    private Integer totalViolations;
    private Long violationsToResolve;
    private Long violationsResolved;

    public int getDecisionCount() {
        return decisionCount;
    }

    public void setDecisionCount(int decisionCount) {
        this.decisionCount = decisionCount;
    }

    private int decisionCount;
    private int violationCount;

    public Integer getTotalDecision() {
        return totalDecision;
    }

    public void setTotalDecision(Integer totalDecision) {
        this.totalDecision = totalDecision;
    }

    private Integer totalDecision;
    private Long decisionPaid;
    private Long decisionUnPaid;
    private Double totalFines;

    public Double getTotalFines() {
        return totalFines;
    }

    public void setTotalFines(Double totalFines) {
        this.totalFines = totalFines;
    }



    public ReportDTO() {
    }

    public ReportDTO(Long totalShips, Integer totalViolations,
                     Long violationsToResolve, Long violationsResolved,
                     Integer totalDecision, Double totalFines,
                     Long decisionPaid, Long decisionUnPaid) {
        this.totalShips = totalShips;
        this.totalViolations = totalViolations;
        this.violationsToResolve = violationsToResolve;
        this.violationsResolved = violationsResolved;

        this.totalDecision = totalDecision;
        this.totalFines = totalFines;
        this.decisionPaid = decisionPaid;
        this.decisionUnPaid = decisionUnPaid;
    }
    @Override
    public int hashCode() {
        return Objects.hash(identified);
    }
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        ReportDTO other = (ReportDTO) obj;
        return Objects.equals(identified, other.identified);
    }
    public ReportDTO(String identified) {
        this.identified = identified;
        this.totalFines = 0.0; // Khởi tạo với giá trị 0.0
        this.decisionCount = 0;
    }

    public void addTotalFines(double amount) {
        if (this.totalFines == null) {
            this.totalFines = 0.0; // Nếu null, khởi tạo lại
        }
        this.totalFines += amount;
    }
    public void increaseDecisionCount() {
        this.decisionCount++;
    }
    public void increaseViolationCount() {
        this.violationCount++;
    }
    public void increaseProductCount(int count) {
        this.totalDecision += count;
    }


}

