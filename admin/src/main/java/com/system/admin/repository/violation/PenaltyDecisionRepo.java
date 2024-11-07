package com.system.admin.repository.violation;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationRecord;
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
public interface PenaltyDecisionRepo extends JpaRepository<PenaltyDecision, Long> {
    @Query("SELECT p FROM PenaltyDecision p WHERE p.nguoiThiHanh.id = :id")
    List<PenaltyDecision> findByUserId(Long id);

    @Query("SELECT p FROM PenaltyDecision p WHERE p.bienBanViPham.id = :id")
    Optional<PenaltyDecision> findByViolationId(Long id);

    @Query("SELECT COUNT(v) > 0 FROM PenaltyDecision v WHERE v.soQuyetDinh = :soQuyetDinh")
    boolean existBySoQuyetDinh(String soQuyetDinh);
    // Tổng mức phạt
    @Query("SELECT SUM(p.mucPhat) FROM PenaltyDecision p WHERE p.hieuLucThiHanh BETWEEN :startDate AND :endDate")
    Double sumFineAmountByDecisionDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Số quyết định đã giải quyết
    @Query("SELECT COUNT(p) FROM PenaltyDecision p WHERE p.paid = true AND p.hieuLucThiHanh BETWEEN :startDate AND :endDate")
    Long countDecisionPaid(LocalDateTime startDate, LocalDateTime endDate);
    // Số quyết định xử phạt đã có hiệu lực
    @Query("SELECT COUNT(p) FROM PenaltyDecision p WHERE p.paid = false AND p.hieuLucThiHanh BETWEEN :startDate AND :endDate")
    Long countDecisionUnPaid(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(p) FROM PenaltyDecision p WHERE p.hieuLucThiHanh BETWEEN :startDate AND :endDate")
    Integer countAllByDecisionDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("UPDATE PenaltyDecision p SET p.paid = ?2 WHERE p.id = ?1")
    @Modifying
    public void updateDecisionPaidStatus(Integer id, boolean paid);


    @Query("SELECT NEW com.system.admin.model.PenaltyDecision(p.id, p.mucPhat, p.paid, p.hieuLucThiHanh)"
            + " FROM PenaltyDecision p WHERE p.hieuLucThiHanh BETWEEN ?1 AND ?2 ORDER BY p.hieuLucThiHanh ASC")
    public List<PenaltyDecision> findDecisionTimeBetween(Date startTime, Date endTime);


    @Query("SELECT p FROM PenaltyDecision p WHERE " +
            "(:maBienBan IS NULL OR :maBienBan = '' OR p.bienBanViPham.maBienBan LIKE %:maBienBan%) AND " +
            "(:soQuyetDinh IS NULL OR :soQuyetDinh = '' OR p.soQuyetDinh LIKE %:soQuyetDinh%) AND " +
            "(:tenCoQuan IS NULL OR :tenCoQuan = '' OR p.tenCoQuan LIKE %:tenCoQuan%) AND " +
            "(:nguoiViPham IS NULL OR :nguoiViPham = '' OR p.bienBanViPham.nguoiViPham.nguoiViPham LIKE %:nguoiViPham%) AND " +
            "(:nguoiThiHanh IS NULL OR :nguoiThiHanh = '' OR p.nguoiThiHanh.profile.fullName LIKE %:nguoiThiHanh%) AND " +
            "(:mucPhat IS NULL OR p.mucPhat = :mucPhat) AND " +
            "(:paid IS NULL OR p.paid = :paid) AND " +
            "(COALESCE(:startDate, NULL) IS NULL OR COALESCE(:endDate, NULL) IS NULL OR p.hieuLucThiHanh BETWEEN :startDate AND :endDate)")
    Page<PenaltyDecision> searchDecisions(
            @Param("maBienBan") String maBienBan,
            @Param("soQuyetDinh") String soQuyetDinh,
            @Param("tenCoQuan") String tenCoQuan,
            @Param("nguoiViPham") String nguoiViPham,
            @Param("nguoiThiHanh") String nguoiThiHanh,
            @Param("mucPhat") Double mucPhat,
            @Param("paid") Boolean paid,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            Pageable pageable);


}
