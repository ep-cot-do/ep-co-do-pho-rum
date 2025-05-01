package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.PaymentRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.PaymentResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;

import java.util.List;

public interface PaymentService {
    PaginationWrapper<List<PaymentResponse>> getAllPaymentPagination(QueryWrapper queryWrapper);
    PaymentResponse getPaymentById(Long id);
    PaymentResponse createPayment(PaymentRequest paymentRequest);
    void deletePaymentById(Long id);
}
