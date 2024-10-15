package com.system.admin.service;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.ViolationRecordNotFoundException;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.repository.violation.*;
import com.system.admin.repository.violation.PenaltyDecisionRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DecisionService {

        private PenaltyDecisionRepo decisionRepo;
        private ViolationPersonRepo violationPersonRepo;
        private ExecutorRepo executorRepo;

        @Autowired
        public DecisionService(PenaltyDecisionRepo p, ViolationPersonRepo v, ExecutorRepo e){
            this.decisionRepo = p;
            this.violationPersonRepo = v;
            this.executorRepo = e;
        }
        public double getMucPhat(Long id){
            PenaltyDecision decision = decisionRepo.findById(id)
                    .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy quyết định xử phạt với id là " + id));
            return decision.getMucPhat();
        }
        public String getDecisionInfo(Long id){
            PenaltyDecision decision = decisionRepo.findById(id)
                    .orElseThrow(() -> new ViolationRecordNotFoundException("Không tìm thấy quyết định xử phạt với id là " + id));
            return decision.getSoVanBan();
        }
        @Transactional
    public void updateDecisionPaidStatus(Integer id, boolean enabled) {
        decisionRepo.updateDecisionPaidStatus(id, enabled);
    }

        public List<PenaltyDecision> getAll(){
            return decisionRepo.findAll();
        }
        public PenaltyDecision create(PenaltyDecision penaltyDecision){
            return decisionRepo.save(penaltyDecision);
        }

        public PenaltyDecision updateDecision(Long id, PenaltyDecision penaltyDecision){
            PenaltyDecision existDecision = decisionRepo.findById(id)
                    .orElseThrow(() ->  new ViolationRecordNotFoundException( "Không tìm thấy quyết định xử phạt"));
            existDecision.setTenCoQuan(penaltyDecision.getTenCoQuan());
            existDecision.setSoVanBan(penaltyDecision.getSoVanBan());
            existDecision.setThanhPho(penaltyDecision.getThanhPho());
            existDecision.setNghiDinh(penaltyDecision.getNghiDinh());
            existDecision.setNguoiViPham(penaltyDecision.getNguoiViPham());
            existDecision.setNguoiThiHanh(penaltyDecision.getNguoiThiHanh());

            existDecision.setXuPhatChinh(penaltyDecision.getXuPhatChinh());
            existDecision.setXuPhatBoSung(penaltyDecision.getXuPhatBoSung());
            existDecision.setMucPhat(penaltyDecision.getMucPhat());
            existDecision.setBienPhapKhacPhuc(penaltyDecision.getBienPhapKhacPhuc());
            existDecision.setViPhamDieuKhoan(penaltyDecision.getViPhamDieuKhoan());
            existDecision.setHieuLucThiHanh(penaltyDecision.getHieuLucThiHanh());
            existDecision.setDiaChiKhoBac(penaltyDecision.getDiaChiKhoBac());

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



//    public List<FinesData> getFinesDataForPeriod(String period) {
//        LocalDateTime endTime = LocalDateTime.now();
//        LocalDateTime startTime;
//        String format;
//
//        switch (period) {
//            case "last_day":
//                startTime = endTime.minusDays(1); // Last 24 hours
//                format = "%Y-%m-%d %H:00"; // Hourly
//                break;
//            case "last_week":
//                startTime = endTime.minusWeeks(1); // Last 7 days
//                format = "%Y-%m-%d"; // Daily
//                break;
//            case "last_month":
//                startTime = endTime.minusMonths(1); // Last 30 days
//                format = "%Y-%m-%d"; // Daily
//                break;
//            case "last_year":
//                startTime = endTime.minusYears(1); // Last 12 months
//                format = "%Y-%m"; // Monthly
//                break;
//            default:
//                throw new IllegalArgumentException("Invalid period type: " + period);
//        }
//
//        return decisionRepo.getFinesDataBetween(startTime, endTime, format);
//    }
    }
