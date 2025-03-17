package com.fcoder.Fcoder.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.fcoder.Fcoder.service.VnPayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class VnPayController {

    private final VnPayService vnPayService;

    public VnPayController(VnPayService vnPayService) {
        this.vnPayService = vnPayService;
    }

    @GetMapping("/create")
    @Operation(summary = "Create a vnPAY payment URL",
            description = "This API generates a payment URL for the specified order ID and amount. Optionally, a bank code can be provided for direct bank selection.",
            security = { @SecurityRequirement(name = "accessCookie") })
    public ResponseEntity<String> createPayment(@RequestParam Long orderId,
                                                @RequestParam BigDecimal amount,
                                                @RequestParam(required = false) String bankCode) {
        String paymentUrl = vnPayService.createPaymentUrl(orderId, amount, bankCode);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/vnPay-return")
    @Operation(summary = "Handle vnPAY return response",
            description = "This API processes the response from vnPAY after a payment attempt. It verifies the " +
                    "payment status and returns the corresponding result",
            security = { @SecurityRequirement(name = "accessCookie") })
    public ResponseEntity<String> vnPayReturn(@RequestParam Map<String, String> responseParams) {
        boolean isValid = vnPayService.validateResponse(responseParams);
        if (isValid) {
            return ResponseEntity.ok("Payment successful!");
        }
        return ResponseEntity.badRequest().body("Invalid payment response!");
    }
}