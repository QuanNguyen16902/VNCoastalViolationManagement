package com.system.admin.repository.violation;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.model.report.ReportDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface ViolationRecordRepo extends JpaRepository<ViolationRecord, Long> {
//
//    // Số lượng tàu vi phạm (số lượng tàu duy nhất)
    @Query("SELECT COUNT(DISTINCT v.tauViPham) FROM ViolationRecord v WHERE v.thoiGianLap BETWEEN :startDate AND :endDate")
    Long countDistinctShipsByViolationDateBetween(LocalDateTime startDate, LocalDateTime endDate);


    // Số vi phạm cần giải quyết
    @Query("SELECT COUNT(v) FROM ViolationRecord v WHERE v.resolved = false AND v.thoiGianLap BETWEEN :startDate AND :endDate")
    Long countViolationsToResolve(LocalDateTime startDate, LocalDateTime endDate);

    // Số vi phạm đã giải quyết
    @Query("SELECT COUNT(v) FROM ViolationRecord v WHERE v.resolved = true AND v.thoiGianLap BETWEEN :startDate AND :endDate")
    Long countViolationsResolved(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(v) FROM ViolationRecord v WHERE v.thoiGianLap BETWEEN :startDate AND :endDate")
    Integer countAllByViolationDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT NEW com.system.admin.model.ViolationRecord.ViolationRecord(v.id, v.resolved, v.thoiGianLap)"
            + " FROM ViolationRecord v WHERE v.thoiGianLap  BETWEEN ?1 AND ?2 ORDER BY v.thoiGianLap ASC")
    public List<ViolationRecord> findViolationTimeBetween(Date startTime, Date endTime);

    @Query("UPDATE ViolationRecord p SET p.resolved = ?2 WHERE p.id = ?1")
    @Modifying
    public void updateViolationResolvedStatus(long id, boolean resolved);
}

