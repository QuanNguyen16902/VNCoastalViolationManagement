package com.system.admin.service;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.User;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.repository.violation.ViolationPersonRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ViolationPersonService {
    @Autowired
    private ViolationPersonRepo violationPersonRepo;
    public List<ViolationPerson> searchViolations(String keyword) {
        return violationPersonRepo.searchViolations(keyword);
    }
    public List<ViolationPerson> listAll(){
        return violationPersonRepo.findAll();
    }

    public ViolationPerson createNew(ViolationPerson violationPerson){
        return violationPersonRepo.save(violationPerson);
    }
    public ViolationPerson getViolationPerson(Long id){
        return violationPersonRepo.findById(id).orElseThrow(()->new UserNotFoundException("Không tìm thấy người vi phạm id là " + id));
    }
    public ViolationPerson updateViolationPerson(Long id, ViolationPerson violationPerson) {
        // Fetch the existing person
        ViolationPerson existViolationPerson = getViolationPerson(id);
        // Check nếu số căn cước đã tồn tại
        Optional<ViolationPerson> existingPersonWithSameCanCuoc =
                violationPersonRepo.findByCanCuocAndIdNot(violationPerson.getCanCuoc(), id);

        if (existingPersonWithSameCanCuoc.isPresent()) {
            throw new IllegalArgumentException("Số CCCD/ĐKKD đã tồn tại.");
        }

        // Update details if unique constraint is satisfied
        existViolationPerson.setNguoiViPham(violationPerson.getNguoiViPham());
        existViolationPerson.setNgheNghiep(violationPerson.getNgheNghiep());
        existViolationPerson.setNamSinh(violationPerson.getNamSinh());
        existViolationPerson.setDiaChi(violationPerson.getDiaChi());
        existViolationPerson.setCanCuoc(violationPerson.getCanCuoc());
        existViolationPerson.setNoiCap(violationPerson.getNoiCap());
        existViolationPerson.setNgayCap(violationPerson.getNgayCap());
        existViolationPerson.setQuocTich(violationPerson.getQuocTich());
        existViolationPerson.setEmail(violationPerson.getEmail());
        existViolationPerson.setSoLanViPham(violationPerson.getSoLanViPham());

        // Save the updated record
        violationPersonRepo.save(existViolationPerson);
        return existViolationPerson;
    }

    public Date convertToDateViaSqlDate(LocalDate dateToConvert) {
        return java.sql.Date.valueOf(dateToConvert);
    }
}
