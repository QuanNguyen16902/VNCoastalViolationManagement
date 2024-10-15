package com.system.admin.repository.violation;

import com.system.admin.model.PenaltyDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface PenaltyDecisionRepo extends JpaRepository<PenaltyDecision, Long> {
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

    @Query("SELECT SUM(p.mucPhat) " +
            "FROM PenaltyDecision p " +
            "WHERE p.hieuLucThiHanh BETWEEN :start AND :end")
    Double getTotalFinesBetween(@Param("start") LocalDateTime start,
                                @Param("end") LocalDateTime end);




}
