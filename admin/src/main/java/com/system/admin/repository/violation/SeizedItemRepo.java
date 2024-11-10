package com.system.admin.repository.violation;

import com.system.admin.model.SeizedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeizedItemRepo extends JpaRepository<SeizedItem, Long> {
    @Query("SELECT s FROM SeizedItem s WHERE " +
            "s.itemName LIKE %:keyword% " +
            "OR s.quantity = :keyword " +
            "OR s.status  LIKE %:keyword% " +
            "OR s.description LIKE %:keyword%")
    List<SeizedItem> searchSeizedItems(@Param("keyword") String keyword);

}
