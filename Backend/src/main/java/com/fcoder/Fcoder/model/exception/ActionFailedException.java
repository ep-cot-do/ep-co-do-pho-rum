package com.fcoder.Fcoder.model.exception;

import com.fcoder.Fcoder.model.dto.response.ResponseObject;

public class ActionFailedException extends BaseException{
    public ActionFailedException(String message) {
        super(message);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("ACTION_FAILED")
                .build();
    }

    public ActionFailedException(String message, Throwable cause) {
        super(message, cause);
        errors = new ResponseObject.Builder<String>()
                .success(false)
                .message(message)
                .code("ACTION_FAILED")
                .build();
    }
}
