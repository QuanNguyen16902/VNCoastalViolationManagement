package com.system.admin.vnpay_integrated;

import com.system.admin.service.DecisionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@CrossOrigin(origins = "*")
public class VnPayController {
    @Autowired
    DecisionService decisionService;

    @Autowired
    VnPayService vnPayService;

    @GetMapping("/vnpay")
    public RedirectView getPay(@RequestParam Map<String, String> allParams) throws UnsupportedEncodingException{
        String decisionId = allParams.get("vnp_TxnRef");
        decisionService.updateDecisionPaidStatus(Integer.valueOf(decisionId), true);
        decisionService.getById(Long.valueOf(decisionId)).getBienBanViPham().setResolved(true);
        return new RedirectView("http://localhost:3000/payment-success?vnp_TxnRef=" + decisionId);
    }

    @PostMapping("/vnpay")
    public String pay(@RequestBody PaymentRequest paymentRequest) throws Exception {
        Long decisionId = paymentRequest.getDecisionId();
        String orderInfo = paymentRequest.getOrderInfo();
        // Lấy MucPhat từ DecisionService dựa trên decisionId
        double mucPhat = decisionService.getMucPhat(decisionId);
        String decisionInfo = decisionService.getDecisionInfo(decisionId);
        String paymentUrl = vnPayService.createPaymentUrl(
                (long) mucPhat, decisionId, decisionInfo
        );
        return paymentUrl;
    }
}

