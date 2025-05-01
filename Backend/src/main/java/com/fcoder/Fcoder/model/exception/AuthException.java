package com.fcoder.Fcoder.model.exception;

import com.fcoder.Fcoder.model.dto.response.ResponseObject;

public class AuthException extends BaseException {
    public AuthException(String message) {
        super(message);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("AUTH_FAILED")
                .build();
    }

    public AuthException(String message, Throwable cause) {
        super(message, cause);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("AUTH_FAILED")
                .build();
    }
}
