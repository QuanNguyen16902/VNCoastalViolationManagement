package com.system.admin.repository.violation;

import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.model.ViolationRecord.ViolationShip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ViolationShipRepo extends JpaRepository<ViolationShip, Long> {
    @Query("SELECT v FROM ViolationShip v WHERE " +
            "v.soHieuTau LIKE %:keyword% " +
            "OR v.haiTrinhCapPhep LIKE %:keyword% " +
            "OR v.diaDiem LIKE %:keyword%")
    List<ViolationShip> searchViolationShip(@Param("keyword") String keyword);

    Optional<ViolationShip> findBySoHieuTau(String soHieuTau);
    Optional<ViolationShip> findBySoHieuTauAndIdNot(String soHieuTau, Long id);

}