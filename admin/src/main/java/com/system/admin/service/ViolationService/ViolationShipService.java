package com.system.admin.service.ViolationService;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationShip;
import com.system.admin.model.ViolationRecord.ViolationShip;
import com.system.admin.repository.violation.ViolationShipRepo;
import com.system.admin.repository.violation.ViolationShipRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ViolationShipService {
    @Autowired
    private ViolationShipRepo violationShipRepo;
    public List<ViolationShip> searchViolations(String keyword) {
        return violationShipRepo.searchViolationShip(keyword);
    }
    public List<ViolationShip> listAll(){
        return violationShipRepo.findAll();
    }
    public ViolationShip getViolationShip(Long id){
        return violationShipRepo.findById(id).orElseThrow(()->new UserNotFoundException("Không tìm thấy người vi phạm id là " + id));
    }
    public ViolationShip updateViolationShip(Long id, ViolationShip violationShip) {
        // Fetch the existing person
        ViolationShip existViolationShip = getViolationShip(id);
        // Check nếu số căn cước đã tồn tại
        Optional<ViolationShip> existingPersonWithSameSoHieuTau =
                violationShipRepo.findBySoHieuTauAndIdNot(violationShip.getSoHieuTau(), id);
 
        // Update details if unique constraint is satisfied
        existViolationShip.setCongSuat(violationShip.getCongSuat());
        existViolationShip.setDiaDiem(violationShip.getDiaDiem());
        existViolationShip.setHaiTrinhCapPhep(violationShip.getHaiTrinhCapPhep());
        existViolationShip.setHaiTrinhThucTe(violationShip.getHaiTrinhThucTe());
        existViolationShip.setToaDoX(violationShip.getToaDoX());
        existViolationShip.setToaDoY(violationShip.getToaDoY());
        existViolationShip.setTongDungTich(violationShip.getTongDungTich());
        existViolationShip.setThoiGianViPham(violationShip.getThoiGianViPham());
//        existViolationShip.setSoLanViPham(violationShip.getSoLanViPham());

        // Save the updated record
        violationShipRepo.save(existViolationShip);
        return existViolationShip;
    }
}
