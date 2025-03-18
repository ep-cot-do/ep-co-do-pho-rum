package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.PaymentRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.PaymentResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/payments", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get all payments", description = "This API will return all payments", security = {
            @SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<PaymentResponse>>> getAllPayments(@RequestParam(name = "q", required = false) String query,
                                                                                @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = paymentService.getAllPaymentPagination(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<PaymentResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Payments retrieved successfully")
                .build());
    }

    @Operation(summary = "Get payment by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        var payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<PaymentResponse>()
                .success(true)
                .code("SUCCESS")
                .content(payment)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new payment", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<PaymentResponse>> createPayment(@RequestBody PaymentRequest paymentRequest) {
        var payment = paymentService.createPayment(paymentRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<PaymentResponse>()
                .success(true)
                .code("SUCCESS")
                .content(payment)
                .message("Payment created successfully")
                .build());
    }

    @Operation(summary = "Delete a payment by ID", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deletePayment(@PathVariable Long id) {
        paymentService.deletePaymentById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Payment deleted successfully")
                .build());
    }
}