package com.system.admin.model;

import com.system.admin.model.ViolationRecord.ViolationPerson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "penalty-decision")
public class PenaltyDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String tenCoQuan;
    private String soVanBan;
    private String thanhPho;
    private String nghiDinh;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "nguoi_vi_pham_id", referencedColumnName = "id")
    private ViolationPerson nguoiViPham;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "nguoi_thi_hanh_id", referencedColumnName = "id")
    private Executor nguoiThiHanh;

    private String xuPhatChinh;
    private Double mucPhat;
    private String xuPhatBoSung;

    private String bienPhapKhacPhuc;
    private String viPhamDieuKhoan;

    private Date hieuLucThiHanh;
    private String diaChiKhoBac;

    private Boolean paid;

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
