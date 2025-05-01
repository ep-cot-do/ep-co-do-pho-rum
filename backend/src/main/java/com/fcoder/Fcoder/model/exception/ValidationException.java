package com.fcoder.Fcoder.model.exception;

import com.fcoder.Fcoder.model.dto.response.ResponseObject;

public class ValidationException extends BaseException {
    public ValidationException(String message) {
        super(message);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("VALIDATION_ERROR")
                .build();
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("VALIDATION_ERROR")
                .build();
    }
}
