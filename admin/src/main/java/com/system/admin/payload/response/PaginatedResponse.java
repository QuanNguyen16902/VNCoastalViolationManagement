package com.system.admin.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PaginatedResponse<T> {
    private int page;
    private int per_page;
    private long total;
    private int total_pages;
    private List<T> data;

    public PaginatedResponse(int page, int per_page, long total, List<T> data) {
        this.page = page;
        this.per_page = per_page;
        this.total = total;
        this.total_pages = (int) Math.ceil((double) total / per_page);
        this.data = data;
    }

}