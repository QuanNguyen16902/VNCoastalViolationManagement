package com.system.admin.repository.violation;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.model.report.ReportDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ViolationRecordRepo extends JpaRepository<ViolationRecord, Long> {
//
    Optional<ViolationRecord> findByMaBienBan(String maBienBan);
    ViolationRecord findBySoVanBan(String soVanBan);



    @Query("SELECT COUNT(v) > 0 FROM ViolationRecord v WHERE v.soVanBan = :soVanBan")
    boolean existBySoVanBan(String soVanBan);
    // Báo cáo
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

    // Status
    @Query("UPDATE ViolationRecord p SET p.resolved = ?2 WHERE p.id = ?1")
    @Modifying
    public void updateViolationResolvedStatus(long id, boolean resolved);

    // Phân trang
    Page<ViolationRecord> findAll(Pageable pageable);

    // Tìm kếm
    @Query("SELECT v FROM ViolationRecord v WHERE " +
            "(:maBienBan IS NULL OR :maBienBan = '' OR v.maBienBan LIKE %:maBienBan%) AND " +
            "(:soVanBan IS NULL OR :soVanBan = '' OR v.soVanBan LIKE %:soVanBan%) AND " +
            "(:tenCoQuan IS NULL OR :tenCoQuan = '' OR v.tenCoQuan LIKE %:tenCoQuan%) AND " +
            "(:nguoiViPham IS NULL OR :nguoiViPham = '' OR v.nguoiViPham.nguoiViPham LIKE %:nguoiViPham%) AND " +
            "(:nguoiLap IS NULL OR :nguoiLap = '' OR v.nguoiLap LIKE %:nguoiLap%) AND " +
            "(:nguoiThietHai IS NULL OR :nguoiThietHai = '' OR v.nguoiThietHai LIKE %:nguoiThietHai%) AND " +
            "(:nguoiChungKien IS NULL OR :nguoiChungKien = '' OR v.nguoiChungKien LIKE %:nguoiChungKien%) AND " +
            "(:resolved IS NULL OR v.resolved = :resolved) AND " +
            "(:linhVuc IS NULL OR :linhVuc = '' OR v.linhVuc LIKE %:linhVuc%) AND " +
            "(:startDate IS NULL OR :endDate IS NULL OR v.thoiGianLap BETWEEN :startDate AND :endDate)")
    Page<ViolationRecord> searchViolations(
            @Param("maBienBan") String maBienBan,
            @Param("soVanBan") String soVanBan,
            @Param("tenCoQuan") String tenCoQuan,
            @Param("nguoiViPham") String nguoiViPham,
            @Param("nguoiLap") String nguoiLap,
            @Param("nguoiThietHai") String nguoiThietHai,
            @Param("nguoiChungKien") String nguoiChungKien,
            @Param("resolved") Boolean resolved,
            @Param("linhVuc") String linhVuc,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            Pageable pageable);


}

