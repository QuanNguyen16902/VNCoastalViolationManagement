package com.system.admin.repository.violation;

import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationPersonRepo extends JpaRepository<ViolationPerson, Long> {

}