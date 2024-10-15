package com.system.admin.repository.violation;

import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.model.ViolationRecord.ViolationShip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationShipRepo extends JpaRepository<ViolationShip, Long> {

}