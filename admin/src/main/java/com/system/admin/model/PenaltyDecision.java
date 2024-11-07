package com.system.admin.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "penalty-decision")
public class PenaltyDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String soQuyetDinh;
    private String tenCoQuan;
    private String thanhPho;
    private String nghiDinh;
    private Date thoiGianLap;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"roles", "password"})
    private User nguoiThiHanh;

    private String xuPhatChinh;
    private Double mucPhat;
    private String xuPhatBoSung;

    private String bienPhapKhacPhuc;
    private String viPhamDieuKhoan;

    private Date hieuLucThiHanh;
    private String diaChiKhoBac;

    private Boolean paid;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "violationId")
    private ViolationRecord bienBanViPham;

    public PenaltyDecision(Double mucPhat, Boolean paid) {
        this.mucPhat = mucPhat;
        this.paid = paid;
    }

    public PenaltyDecision(long id, Double mucPhat, Boolean paid, Date hieuLucThiHanh) {
        this.id = id;
        this.mucPhat = mucPhat;
        this.paid = paid;
        this.hieuLucThiHanh = hieuLucThiHanh;
    }


}
