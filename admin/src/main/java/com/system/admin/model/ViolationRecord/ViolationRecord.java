package com.system.admin.model.ViolationRecord;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "violation-records")
public class ViolationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String tenCoQuan;
    private String soVanBan;
    private Date thoiGianLap;
    private String nguoiLap;
    private String nguoiChungKien;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "nguoi_vi_pham_id", referencedColumnName = "id")
    private ViolationPerson nguoiViPham;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tau_vi_pham_id", referencedColumnName = "id")
    private ViolationShip tauViPham;

    private String viPhamDieuKhoan;
    private String nguoiThietHai;
    private String yKienNguoiDaiDien;
    private String yKienNguoiChungKien;
    private String yKienNguoiThietHai;
    private String bienPhapNganChan;
    private String tamGiu;
    private String yeuCau;
    private String file;

    // Trạng thái giải quyết
    private Boolean resolved;

    public ViolationRecord(Long id, Boolean resolved, Date thoiGianLap) {
        this.id = id;
        this.resolved = resolved;
        this.thoiGianLap = thoiGianLap;
    }

}
