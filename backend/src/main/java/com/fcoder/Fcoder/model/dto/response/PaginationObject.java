package com.fcoder.Fcoder.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaginationObject {
    private int page;
    private int size;
    private int totalPages;
    private int totalElements;
}
