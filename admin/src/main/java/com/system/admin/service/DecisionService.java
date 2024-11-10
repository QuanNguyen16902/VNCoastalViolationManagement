package com.system.admin.service;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.ViolationRecordNotFoundException;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.User;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.repository.UserRepository;
import com.system.admin.repository.violation.*;
import com.system.admin.repository.violation.PenaltyDecisionRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class DecisionService {

        private PenaltyDecisionRepo decisionRepo;
        private ViolationPersonRepo violationPersonRepo;
        private ViolationRecordRepo violationRecordRepo;
        private UserRepository userRepo;

        @Autowired
        public DecisionService(PenaltyDecisionRepo p, ViolationPersonRepo v, UserRepository e, ViolationRecordRepo r){
            this.decisionRepo = p;
            this.violationPersonRepo = v;
            this.userRepo = e;
            this.violationRecordRepo = r;
        }
        public double getMucPhat(Long id){
            PenaltyDecision decision = decisionRepo.findById(id)
                    .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy quyết định xử phạt với id là " + id));
            return decision.getMucPhat();
        }
        public String getDecisionInfo(Long id){
            PenaltyDecision decision = decisionRepo.findById(id)
                    .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy quyết định xử phạt với id là " + id));
            return decision.getSoQuyetDinh();
        }
        @Transactional
    public void updateDecisionPaidStatus(Integer id, boolean enabled) {
        decisionRepo.updateDecisionPaidStatus(id, enabled);
    }

        public List<PenaltyDecision> getAll(){
            return decisionRepo.findAll();
        }

        private String generateRandomDecisionCode() {
            return UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        }
    public PenaltyDecision create(PenaltyDecision penaltyDecision) {
        Long violationId = penaltyDecision.getBienBanViPham().getId(); // Lấy ID từ biên bản vi phạm

        // Kiểm tra nếu biên bản vi phạm đã có quyết định xử phạt
        if (decisionRepo.findByViolationId(violationId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Biên bản đã ra quyết định, không thể tạo quyết định mới.");
        }

        // Lấy thông tin người thi hành từ ID
        User executor = userRepo.findById(penaltyDecision.getNguoiThiHanh().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
        System.out.println(penaltyDecision.getNguoiThiHanh().getId());
        // Lấy thông tin biên bản vi phạm
        ViolationRecord violationRecord = violationRecordRepo.findById(violationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy biên bản vi phạm."));

        // Thiết lập người thi hành và biên bản vi phạm cho quyết định xử phạt
        penaltyDecision.setNguoiThiHanh(executor);
        penaltyDecision.setBienBanViPham(violationRecord);

        // Thiết lập các thông tin mặc định cho quyết định
        penaltyDecision.setPaid(false);

        // Lưu quyết định xử phạt vào cơ sở dữ liệu
        return decisionRepo.save(penaltyDecision);
    }


    public PenaltyDecision updateDecision(Long id, PenaltyDecision penaltyDecision) {
        // Kiểm tra xem quyết định có tồn tại không
        PenaltyDecision existDecision = decisionRepo.findById(id)
                .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy quyết định xử phạt"));

        Long violationId = penaltyDecision.getBienBanViPham().getId(); // Lấy ID từ biên bản vi phạm

// Kiểm tra trùng lặp số văn bản nếu số văn bản đã tồn tại và không giống với số quyết định hiện tại
        boolean isDuplicateSoVanBan = decisionRepo.existBySoQuyetDinh(penaltyDecision.getSoQuyetDinh());
        if (isDuplicateSoVanBan && !existDecision.getSoQuyetDinh().equals(penaltyDecision.getSoQuyetDinh())) {
            throw new IllegalArgumentException("Số quyết định đã tồn tại trong hệ thống. Vui lòng sử dụng số khác.");
        }

        // Lấy thông tin người thi hành từ ID
        User executor = userRepo.findById(penaltyDecision.getNguoiThiHanh().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        // Cập nhật các trường cơ bản của quyết định xử phạt
        existDecision.setNguoiThiHanh(executor);
        existDecision.setTenCoQuan(penaltyDecision.getTenCoQuan());
        existDecision.setSoQuyetDinh(penaltyDecision.getSoQuyetDinh());
        existDecision.setThanhPho(penaltyDecision.getThanhPho());
        existDecision.setNghiDinh(penaltyDecision.getNghiDinh());
        existDecision.setXuPhatChinh(penaltyDecision.getXuPhatChinh());
        existDecision.setXuPhatBoSung(penaltyDecision.getXuPhatBoSung());
        existDecision.setMucPhat(penaltyDecision.getMucPhat());
        existDecision.setBienPhapKhacPhuc(penaltyDecision.getBienPhapKhacPhuc());
        existDecision.setViPhamDieuKhoan(penaltyDecision.getViPhamDieuKhoan());
        existDecision.setHieuLucThiHanh(penaltyDecision.getHieuLucThiHanh());
        existDecision.setDiaChiKhoBac(penaltyDecision.getDiaChiKhoBac());
        existDecision.setThoiGianLap(penaltyDecision.getThoiGianLap());

        ViolationRecord existViolationRecord = violationRecordRepo.findById(penaltyDecision.getBienBanViPham().getId())
                .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy biên bản vi phạm"));

        // Kiểm tra và cập nhật người vi phạm
        if (penaltyDecision.getBienBanViPham().getNguoiViPham() != null) {
            ViolationPerson violationPerson = violationPersonRepo.findById(penaltyDecision.getBienBanViPham().getNguoiViPham().getId())
                    .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy người vi phạm"));

            violationPerson.setNguoiViPham(penaltyDecision.getBienBanViPham().getNguoiViPham().getNguoiViPham());
            violationPerson.setNamSinh(penaltyDecision.getBienBanViPham().getNguoiViPham().getNamSinh());
            violationPerson.setNgheNghiep(penaltyDecision.getBienBanViPham().getNguoiViPham().getNgheNghiep());
            violationPerson.setDiaChi(penaltyDecision.getBienBanViPham().getNguoiViPham().getDiaChi());
            violationPerson.setCanCuoc(penaltyDecision.getBienBanViPham().getNguoiViPham().getCanCuoc());
            violationPerson.setNoiCap(penaltyDecision.getBienBanViPham().getNguoiViPham().getNoiCap());
            violationPerson.setNgayCap(penaltyDecision.getBienBanViPham().getNguoiViPham().getNgayCap());

            existViolationRecord.setNguoiViPham(violationPerson);
        }

        existViolationRecord.setHanhVi(penaltyDecision.getBienBanViPham().getHanhVi());

        // Lưu lại quyết định xử phạt đã cập nhật
        return decisionRepo.save(existDecision);
    }



    public PenaltyDecision getById(Long id){
            if(!decisionRepo.existsById(id)){
                throw new UserNotFoundException("Không tồn tại PenaltyDecision với id là " + id);
            }
            return decisionRepo.findById(id).get();
        }

        public void deleteById(Long id){
            if(!decisionRepo.existsById(id)){
                throw new ViolationRecordNotFoundException("Không tồn tại PenaltyDecision với id là " + id);
            }
            decisionRepo.deleteById(id);
        }

    public Page<PenaltyDecision> searchDecisions(
            String maBienBan,
            String soQuyetDinh,
             String tenCoQuan,
            String nguoiViPham,
            String nguoiThiHanh,
            Double mucPhat,
            Boolean paid,
            Date startDate,
            Date endDate,
            Pageable pageable) {
        if (startDate != null && endDate != null && startDate.after(endDate)) {
            throw new IllegalArgumentException("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.");
        }

        return decisionRepo.searchDecisions(
                maBienBan,
                 soQuyetDinh,
                 tenCoQuan,
                 nguoiViPham,
                 nguoiThiHanh,
                 mucPhat,
                 paid,
                startDate,
                endDate,
                pageable);
    }


}
