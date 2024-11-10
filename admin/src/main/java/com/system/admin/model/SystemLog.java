package com.system.admin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "system_logs")
public class SystemLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @ManyToOne(fetch = FetchType.LAZY) // Thiết lập mối quan hệ ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @JsonProperty("user_id")
    public Long getViolationRecordId() {
        return user != null ? user.getId() : null;
    }
    public SystemLog() {
        this.timestamp = LocalDateTime.now(); // Mặc định lấy thời gian hiện tại
    }

}
