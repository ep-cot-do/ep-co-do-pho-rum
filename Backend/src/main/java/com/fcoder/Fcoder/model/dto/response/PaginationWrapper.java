package com.fcoder.Fcoder.model.dto.response;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PaginationWrapper <T extends List<?>>{
    private final T data;
    private final int page;
    private final int size;
    private final int totalPages;
    private final int totalElements;

    public PaginationWrapper(T data, int page, int size, int totalPages, int totalElements) {
        this.data = data;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    private PaginationWrapper(Builder<T> builder) {
        this(builder.data, builder.page, builder.size, builder.totalElements, builder.totalPages);
    }

    public PaginationObject exportPaginationInfo () {
        return PaginationObject.builder()
                .page(page)
                .size(size)
                .totalPages(totalPages)
                .totalElements(totalElements)
                .build();
    }

    public static class Builder<T extends List<?>> {
        private T data;
        private int page;
        private int size;
        private int totalPages;
        private int totalElements;
        public Builder<T> setData(T data) {
            this.data = data;
            return this;
        }
        public Builder<T> setPage(int page) {
            this.page = page;
            return this;
        }
        public Builder<T> setSize(int size) {
            this.size = size;
            return this;
        }
        public Builder<T> setTotalPages(int totalPages) {
            this.totalPages = totalPages;
            return this;
        }
        public Builder<T> setTotalElements(int totalElements) {
            this.totalElements = totalElements;
            return this;
        }
        public Builder<T> setPaginationInfo (Page<?> page) {
            this.page = page.getNumber();
            this.size = page.getSize();
            this.totalElements = (int) page.getTotalElements();
            this.totalPages = page.getTotalPages();
            return this;
        }
        public PaginationWrapper<T> build() {
            return new PaginationWrapper<T>(this);
        }
    }
}
