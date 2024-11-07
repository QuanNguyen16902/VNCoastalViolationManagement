package com.system.admin.model.ViolationRecord;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.SeizedItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "violation-records")
public class ViolationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String maBienBan;
    private String linhVuc;

    private String tenCoQuan;
    private String soVanBan;

    private Date thoiGianLap;
    private String nguoiLap;
    private String nguoiChungKien;


    @ManyToOne
    @JoinColumn(name = "nguoi_vi_pham_id", referencedColumnName = "id")
    private ViolationPerson nguoiViPham;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tau_vi_pham_id", referencedColumnName = "id")
    private ViolationShip tauViPham;


    @OneToMany(mappedBy = "violationRecord", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SeizedItem> seizedItems;


    private String hanhVi;

    private String viPhamDieuKhoan;
    private String nguoiThietHai;
    private String yKienNguoiDaiDien;
    private String yKienNguoiChungKien;
    private String yKienNguoiThietHai;
    private String bienPhapNganChan;
    private String tamGiu;

    private String yeuCau;
    private Date thoiGianGiaiQuyet;
    private Integer soBan;

    private String file;

    // Trạng thái giải quyết
    private Boolean resolved;

    @OneToOne(mappedBy = "bienBanViPham")
    @JsonIgnore
    private PenaltyDecision penaltyDecision;


    public ViolationRecord(Long id, Boolean resolved, Date thoiGianLap) {
        this.id = id;
        this.resolved = resolved;
        this.thoiGianLap = thoiGianLap;
    }

}
