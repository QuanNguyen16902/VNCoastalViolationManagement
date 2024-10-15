package com.system.admin.model.report;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeRange {
    private String type; // "day", "week", "month", "year", "range"
    private String date; // Đối với type "day", "week", "month", "year"
    private String startDate; // Đối với type "range"
    private String endDate;   // Đối với type "range"

    // Constructors, Getters and Setters

    public TimeRange() {
    }

    public TimeRange(String type, String date, String startDate, String endDate) {
        this.type = type;
        this.date = date;
        this.startDate = startDate;
        this.endDate = endDate;
    }

}
