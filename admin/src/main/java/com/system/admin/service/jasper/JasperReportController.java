package com.system.admin.service.jasper;


import java.io.IOException;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.repository.violation.PenaltyDecisionRepo;
import com.system.admin.repository.violation.ViolationRecordRepo;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/export")
public class JasperReportController {

    @Autowired
    ViolationRecordRepo violationRecordRepo;
    @Autowired
    PenaltyDecisionRepo decisionRepo;

    @Autowired
    JasperReportService jasperReportService;

    @GetMapping("/violations/{format}/{id}")
    public ResponseEntity<Resource> getViolationReport(@PathVariable String format, @PathVariable Long id)
            throws JRException, IOException {
        ViolationRecord item = violationRecordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("ViolationRecord not found with id: " + id));


        byte[] reportContent = jasperReportService.getViolationReport(item, format);

        ByteArrayResource resource = new ByteArrayResource(reportContent);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(resource.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("bien-ban-vi-pham." + format)
                                .build().toString())
                .body(resource);
    }
    @GetMapping("/decisions/{format}/{id}")
    public ResponseEntity<Resource> getDecisionReport(@PathVariable String format, @PathVariable Long id)
            throws JRException, IOException {
        PenaltyDecision item = decisionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyết định với id: " + id));


        byte[] reportContent = jasperReportService.getDecisionReport(item, format);

        ByteArrayResource resource = new ByteArrayResource(reportContent);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(resource.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("quyet-dinh-xu-phat." + format)
                                .build().toString())
                .body(resource);
    }
}