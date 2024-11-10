package com.system.admin.model.ViolationRecord;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "violation-ships")
public class ViolationShip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Date thoiGianViPham;
    private String diaDiem;
    private String tongDungTich;
    private String soHieuTau;
    private String congSuat;
    private String haiTrinhCapPhep;
    private long toaDoX;
    private long toaDoY;
    private String haiTrinhThucTe;
    private Integer soLanViPham;

}
