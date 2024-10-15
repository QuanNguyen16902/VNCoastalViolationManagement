package com.system.admin.model.ViolationRecord;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "violation-person")
public class ViolationPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nguoiViPham;
    private Integer namSinh;
    private String ngheNghiep;
    private String diaChi;
    private String canCuoc;
    private String noiCap;
    private String ngayCap;
    private String hanhVi;
    private String quocTich;
}
