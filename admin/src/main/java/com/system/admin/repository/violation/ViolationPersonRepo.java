package com.system.admin.repository.violation;

import com.system.admin.model.User;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ViolationPersonRepo extends JpaRepository<ViolationPerson, Long> {
    @Query("SELECT v FROM ViolationPerson v WHERE " +
            "v.nguoiViPham LIKE %:keyword% " +
            "OR CAST(v.soLanViPham AS string) = :keyword " +
            "OR CAST(v.namSinh AS string) = :keyword " +
            "OR v.quocTich LIKE %:keyword% " +
            "OR v.email LIKE %:keyword%")
    List<ViolationPerson> searchViolations(@Param("keyword") String keyword);

//    @Query("SELECT nv FROM NguoiViPham nv WHERE nv.cccd = :cccd")
    Optional<ViolationPerson> findByCanCuoc(String canCuoc);
    Optional<ViolationPerson> findByCanCuocAndIdNot(String canCuoc, Long id);
}