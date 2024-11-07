package com.system.admin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.system.admin.model.ViolationRecord.ViolationRecord;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "seized_item")
public class SeizedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    private String quantity;

    @Column(name = "seizure_date")
    private LocalDateTime seizureDate;

    @Column(name = "status")
    private String status;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "violation_record_id")
    @JsonIgnore
    private ViolationRecord violationRecord;


    public SeizedItem(String itemName, String description, String quantity, String status, LocalDateTime seizureDate, ViolationRecord violationRecord) {
        this.itemName = itemName;
        this.description = description;
        this.quantity = quantity;
        this.status = status;
        this.seizureDate = seizureDate;
        this.violationRecord = violationRecord;
    }

    public ViolationRecord getViolationRecord() {
        return violationRecord;
    }

    public void setViolationRecord(ViolationRecord violationReport) {
        this.violationRecord = violationReport;
    }
}

