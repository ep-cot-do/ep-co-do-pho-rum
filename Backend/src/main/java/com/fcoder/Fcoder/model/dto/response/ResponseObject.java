package com.fcoder.Fcoder.model.dto.response;

import lombok.Getter;

import java.util.List;

@Getter
public class ResponseObject<T> {
    private final T content;
    private final String message;
    private final String code;
    private final boolean success;
    private final PaginationObject pagination;
    private ResponseObject(Builder<T> builder) {
        this.content = builder.content;
        this.message = builder.message;
        this.code = builder.code;
        this.success = builder.success;
        this.pagination = builder.pagination;
    }
    public static class Builder<T> {
        private T content;
        private String message;
        private String code;
        private boolean success;
        private PaginationObject pagination;

        public Builder<T> content(T content) {
            this.content = content;
            return this;
        }
        public Builder<T> message(String message) {
            this.message = message;
            return this;
        }
        public Builder<T> code(String code) {
            this.code = code;
            return this;
        }
        public Builder<T> success(boolean success) {
            this.success = success;
            return this;
        }
        public Builder<T> unwrapPaginationWrapper(PaginationWrapper<? extends List<?>> wrapper) {
            if (wrapper != null && wrapper.getData() != null) {
                try {
                    @SuppressWarnings("unchecked")
                    T data = (T) wrapper.getData();
                    this.content = data;
                } catch (ClassCastException e) {
                    throw new IllegalArgumentException("Invalid type for content. Expected a type compatible with T.", e);
                }
                this.pagination = wrapper.exportPaginationInfo();
            }else {
                throw new IllegalArgumentException("Invalid type: wrapper data is not a List.");
            }
            return this;
        }
        public Builder<T> pagination(PaginationObject pagination) {
            this.pagination = pagination;
            return this;
        }
        public ResponseObject<T> build() {
            return new ResponseObject<T>(this);
        }
    }
}
