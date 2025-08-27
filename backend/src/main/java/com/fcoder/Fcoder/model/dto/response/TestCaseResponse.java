package com.fcoder.Fcoder.model.dto.response;

import lombok.Data;

@Data
public class TestCaseResponse {
    private Long id;
    private String input;
    private String expectedOutput;
    private Boolean isSample;
    private Integer testOrder;
    private Integer points;
}
