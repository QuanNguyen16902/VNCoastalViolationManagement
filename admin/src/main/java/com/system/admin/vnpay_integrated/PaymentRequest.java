package com.system.admin.vnpay_integrated;

public class PaymentRequest {
    private Long decisionId;
    private String orderInfo;

    // Getters and Setters

    public Long getDecisionId() {
        return decisionId;
    }

    public void setDecisionId(Long decisionId) {
        this.decisionId = decisionId;
    }

    public String getOrderInfo() {
        return orderInfo;
    }

    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }
}

