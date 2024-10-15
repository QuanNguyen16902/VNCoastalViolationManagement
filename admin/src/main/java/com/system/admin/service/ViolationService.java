package com.system.admin.service;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.ViolationRecordNotFoundException;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.repository.violation.ViolationPersonRepo;
import com.system.admin.repository.violation.ViolationRecordRepo;
import com.system.admin.repository.violation.ViolationShipRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ViolationService {

    private ViolationRecordRepo violationRecordRepo;
    private ViolationPersonRepo violationPersonRepo;
    private ViolationShipRepo violationShipRepo;

    @Autowired
    public ViolationService(ViolationRecordRepo v1, ViolationPersonRepo v2, ViolationShipRepo v3){
        this.violationRecordRepo = v1;
        this.violationPersonRepo = v2;
        this.violationShipRepo = v3;
    }

    public List<ViolationRecord> getAll(){
        return violationRecordRepo.findAll();
    }
    public ViolationRecord create(ViolationRecord violationRecord){
        violationRecord.setResolved(false);
        return violationRecordRepo.save(violationRecord);
    }

    public ViolationRecord updateViolation(Long id, ViolationRecord violationRecord){
        ViolationRecord existViolation = violationRecordRepo.findById(id)
                .orElseThrow(() ->  new ViolationRecordNotFoundException( "Không tìm thấy biên bản vi phạm"));
            existViolation.setNguoiLap(violationRecord.getNguoiLap());
            existViolation.setThoiGianLap(violationRecord.getThoiGianLap());
            existViolation.setSoVanBan(violationRecord.getSoVanBan());
            existViolation.setNguoiChungKien(violationRecord.getNguoiChungKien());
            existViolation.setNguoiViPham(violationRecord.getNguoiViPham());
            existViolation.setTauViPham(violationRecord.getTauViPham());

            existViolation.setViPhamDieuKhoan(violationRecord.getViPhamDieuKhoan());
            existViolation.setTamGiu(violationRecord.getTamGiu());
            existViolation.setYeuCau(violationRecord.getYeuCau());
            existViolation.setNguoiThietHai(violationRecord.getNguoiThietHai());
            existViolation.setYKienNguoiDaiDien(violationRecord.getYKienNguoiDaiDien());
            existViolation.setYKienNguoiThietHai(violationRecord.getYKienNguoiThietHai());
            existViolation.setYKienNguoiChungKien(violationRecord.getYKienNguoiChungKien());
            existViolation.setBienPhapNganChan(violationRecord.getBienPhapNganChan());
            existViolation.setFile(violationRecord.getFile());


        return violationRecordRepo.save(existViolation);
    }

    public ViolationRecord getById(Long id){
        if(!violationRecordRepo.existsById(id)){
            throw new UserNotFoundException("Không tồn tại ViolationRecord với id là " + id);
        }
        return violationRecordRepo.findById(id).get();
    }

    public void deleteById(Long id){
        if(!violationRecordRepo.existsById(id)){
            throw new ViolationRecordNotFoundException("Không tồn tại ViolationRecord với id là " + id);
        }
        violationRecordRepo.deleteById(id);
    }

    @Transactional
    public void updateViolationResolvedStatus(long id, boolean resolved){
        violationRecordRepo.updateViolationResolvedStatus(id, resolved);
    }
}
