package com.fcoder.Fcoder.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payment")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEntity extends BaseEntity{
    @Column(name = "payment_method", nullable = false, length = 255)
    private String paymentMethod;
    @Column(name = "url", nullable = false, length = 255)
    private String url;
    @Column(name = "bank_code", nullable = false, length = 255)
    private String bankCode;
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
}
