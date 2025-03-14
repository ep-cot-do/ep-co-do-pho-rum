package com.fcoder.Fcoder.model.exception;

import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class BaseException extends RuntimeException {
    protected ResponseObject<String> errors;
    public BaseException(String message) {
        super(message);
        log.info(message);
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
        log.info(message);
        log.error(message, cause);
    }
    public ResponseObject<String> getErrors() {
        return errors;
    }
}
