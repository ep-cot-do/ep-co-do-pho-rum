package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private String paymentMethod;
    private String url;
    private String bankCode;
    private BigDecimal amount;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
