package com.system.admin.repository;

import com.system.admin.model.SeizedItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeizedItemRepo extends JpaRepository<SeizedItem, Long> {
}
