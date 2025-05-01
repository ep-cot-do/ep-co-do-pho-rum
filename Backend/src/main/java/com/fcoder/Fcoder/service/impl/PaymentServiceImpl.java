package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.PaymentRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.PaymentResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.PaymentEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.PaymentRepository;
import com.fcoder.Fcoder.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    @Override
    public PaginationWrapper<List<PaymentResponse>> getAllPaymentPagination(QueryWrapper queryWrapper) {
        return paymentRepository.query(queryWrapper,
                paymentRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToPaymentResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<PaymentResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        var payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Payment not found"));
        return mapToPaymentResponse(payment);
    }

    @Transactional
    @Override
    public PaymentResponse createPayment(PaymentRequest paymentRequest) {
        // Validate payment request
        if (paymentRequest.getAmount() == null || paymentRequest.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Payment amount must be greater than zero");
        }

        var payment = PaymentEntity.builder()
                .paymentMethod(paymentRequest.getPaymentMethod())
                .url(paymentRequest.getUrl())
                .bankCode(paymentRequest.getBankCode())
                .amount(paymentRequest.getAmount())
                .build();

        return mapToPaymentResponse(paymentRepository.save(payment));
    }

    @Transactional
    @Override
    public void deletePaymentById(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new ValidationException("Payment not found");
        }
        try {
            paymentRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete payment", ex);
        }
    }

    private PaymentResponse mapToPaymentResponse(PaymentEntity payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentMethod(payment.getPaymentMethod())
                .url(payment.getUrl())
                .bankCode(payment.getBankCode())
                .amount(payment.getAmount())
                .createdDate(payment.getCreatedDate())
                .updatedDate(payment.getUpdatedDate())
                .build();
    }
}