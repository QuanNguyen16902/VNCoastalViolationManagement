package com.system.admin.model.ViolationRecord;

public enum ViolationStatus {
    CAN_GIAI_QUYET("Cần giải quyết"),
    DA_GIAI_QUYET("Đã giải quyết");

    private final String displayName;

    ViolationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
