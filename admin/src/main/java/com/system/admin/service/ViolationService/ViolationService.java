package com.system.admin.service.ViolationService;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.ViolationRecordNotFoundException;
import com.system.admin.model.SeizedItem;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.repository.violation.SeizedItemRepo;
import com.system.admin.repository.violation.ViolationPersonRepo;
import com.system.admin.repository.violation.ViolationRecordRepo;
import com.system.admin.repository.violation.ViolationShipRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ViolationService {

    private ViolationRecordRepo violationRecordRepo;
    private ViolationPersonRepo violationPersonRepo;
    private ViolationShipRepo violationShipRepo;
    private SeizedItemRepo seizedItemRepo;
    @Autowired
    public ViolationService(ViolationRecordRepo v1, ViolationPersonRepo v2,
                            ViolationShipRepo v3, SeizedItemRepo v4){
        this.violationRecordRepo = v1;
        this.violationPersonRepo = v2;
        this.violationShipRepo = v3;
        this.seizedItemRepo = v4;
    }
    public Page<ViolationRecord> searchViolations(String maBienBan, String soVanBan,String tenCoQuan,
                                                  String nguoiViPham,
                                                  String nguoiLap,
                                                  String nguoiThietHai,
                                                  String nguoiChungKien,
                                                  Boolean resolved,
                                                  String linhVuc,
                                                  Date startDate,
                                                  Date endDate,
                                                  Pageable pageable) {
        if (startDate != null && endDate != null && startDate.after(endDate)) {
            throw new IllegalArgumentException("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.");
        }

        return violationRecordRepo.searchViolations(maBienBan, soVanBan,tenCoQuan,
                  nguoiViPham,
                nguoiLap,
                 nguoiThietHai,
                nguoiChungKien,
                resolved,
                 linhVuc,
                startDate,
                endDate,
                pageable);
    }
    public Page<ViolationRecord> getItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return violationRecordRepo.findAll(pageable);
    }

    public List<ViolationRecord> getAll(){
        return violationRecordRepo.findAll();
    }

    public ViolationRecord create(ViolationRecord violationRecord) {
        // Kiểm tra xem bản ghi với số văn bản đã tồn tại hay chưa
        if (violationRecordRepo.existBySoVanBan(violationRecord.getSoVanBan())) {
            throw new IllegalArgumentException("Số văn bản đã tồn tại. Vui lòng sử dụng số khác.");
        }

        // Tạo mã biên bản mới và đánh dấu trạng thái chưa giải quyết
        violationRecord.setMaBienBan(generateRandomViolationCode());
        violationRecord.setResolved(false);

        // Lấy đối tượng NguoiViPham từ violationRecord và kiểm tra
        ViolationPerson violator = violationRecord.getNguoiViPham();
        if (violator == null) {
            throw new IllegalArgumentException("Thông tin người vi phạm là bắt buộc.");
        }

        // Kiểm tra xem người vi phạm với CCCD đã tồn tại hay chưa
        Optional<ViolationPerson> existingViolator = violationPersonRepo.findByCanCuoc(violator.getCanCuoc());
        if (existingViolator.isPresent()) {
            // Nếu tồn tại, tăng số lần vi phạm và gán vào violationRecord
            ViolationPerson existingPerson = existingViolator.get();
            existingPerson.setSoLanViPham(existingPerson.getSoLanViPham() + 1);
            violationRecord.setNguoiViPham(existingPerson);
        } else {
            // Nếu không tồn tại, khởi tạo số lần vi phạm là 1 và lưu mới
            violator.setSoLanViPham(1);
            violationPersonRepo.save(violator);
        }
        // Kiểm tra tang vật và gán violationRecord vào từng SeizedItem
        if (violationRecord.getSeizedItems() != null && !violationRecord.getSeizedItems().isEmpty()) {
            List<SeizedItem> tangVats = violationRecord.getSeizedItems().stream()
                    .map(tangVatRequest -> new SeizedItem(
                            tangVatRequest.getItemName(),
                            tangVatRequest.getDescription(),
                            tangVatRequest.getQuantity(),
                            tangVatRequest.getStatus(),
                            tangVatRequest.getSeizureDate(),
                            violationRecord // Gán violationRecord vào tang vật
                    ))
                    .collect(Collectors.toList());
            // Lưu tất cả tang vật vào database
            seizedItemRepo.saveAll(tangVats);
            // Gán danh sách tang vật vào biên bản để trả về
            violationRecord.setSeizedItems(tangVats);
        } else {
            violationRecord.setSeizedItems(new ArrayList<>());
        }
        // Lưu biên bản vi phạm vào database
        return violationRecordRepo.save(violationRecord);
    }



    public String generateRandomViolationCode(){
        return UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
    }
    public List<SeizedItem> getSeizedItemByViolationId(Long id){
        ViolationRecord violationRecord = violationRecordRepo.findById(id)
                .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy biên bản vi phạm"));

        return violationRecord.getSeizedItems();
    }

    public ViolationRecord updateViolation(Long id, ViolationRecord violationRecord){
        // Kiểm tra nếu `soVanBan` đã tồn tại và không trùng với bản ghi hiện tại
        ViolationRecord existViolation = violationRecordRepo.findById(id)
                .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy biên bản vi phạm"));

        if (violationRecordRepo.existBySoVanBan(violationRecord.getSoVanBan())
                && !existViolation.getSoVanBan().equals(violationRecord.getSoVanBan())) {
            throw new IllegalArgumentException("Số văn bản đã tồn tại. Vui lòng sử dụng số khác.");
        }

        // Cập nhật các trường dữ liệu của ViolationRecord
        existViolation.setNguoiLap(violationRecord.getNguoiLap());
        existViolation.setThoiGianLap(violationRecord.getThoiGianLap());
        existViolation.setSoVanBan(violationRecord.getSoVanBan());
        existViolation.setNguoiChungKien(violationRecord.getNguoiChungKien());
        existViolation.setNguoiViPham(violationRecord.getNguoiViPham());
        existViolation.setTauViPham(violationRecord.getTauViPham());
        existViolation.setHanhVi(violationRecord.getHanhVi());
        existViolation.setLinhVuc(violationRecord.getLinhVuc());
        existViolation.setTenCoQuan(violationRecord.getTenCoQuan());
        existViolation.setSoBan(violationRecord.getSoBan());
        existViolation.setThoiGianGiaiQuyet(violationRecord.getThoiGianGiaiQuyet());
        existViolation.setViPhamDieuKhoan(violationRecord.getViPhamDieuKhoan());
        existViolation.setTamGiu(violationRecord.getTamGiu());
        existViolation.setYeuCau(violationRecord.getYeuCau());
        existViolation.setNguoiThietHai(violationRecord.getNguoiThietHai());
        existViolation.setYKienNguoiDaiDien(violationRecord.getYKienNguoiDaiDien());
        existViolation.setYKienNguoiThietHai(violationRecord.getYKienNguoiThietHai());
        existViolation.setYKienNguoiChungKien(violationRecord.getYKienNguoiChungKien());
        existViolation.setBienPhapNganChan(violationRecord.getBienPhapNganChan());
        existViolation.setFile(violationRecord.getFile());

        // Cập nhật tang vật liên quan
        // Giả sử ViolationRecord có một mối quan hệ với TangVat thông qua một danh sách tangVats
        existViolation.setSeizedItems(violationRecord.getSeizedItems()); // Cập nhật danh sách TangVats mới

//        List<SeizedItem> managedTangVats = new ArrayList<>();
//        for (SeizedItem tangVat : violationRecord.getSeizedItems()) {
//            managedTangVats.add(seizedItemRepo.findById(tangVat.getId()).orElseThrow(() ->
//                    new EntityNotFoundException("Seized Item not found")));
//        }
//        existViolation.setTangVats(managedTangVats);

        // Lưu lại bản ghi vi phạm sau khi cập nhật
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

    public ViolationPerson getPersonByViolationId(Long violationId) {
        ViolationRecord violationRecord = violationRecordRepo.findById(violationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biên bản vi phạm với ID: " + violationId));

        return violationRecord.getNguoiViPham();
    }

}
