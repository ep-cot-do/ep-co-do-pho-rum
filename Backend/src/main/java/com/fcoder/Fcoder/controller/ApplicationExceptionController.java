package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.BaseException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.security.InvalidKeyException;

@RestControllerAdvice
public class ApplicationExceptionController {
    @ExceptionHandler(value = {
            AuthenticationException.class,
            ActionFailedException.class,
            ValidationException.class
    })
    public ResponseEntity<ResponseObject<String>> applicationException(BaseException exception) {
        return ResponseEntity.status(HttpStatus.OK).body(exception.getErrors());
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseObject<String>> accessDeniedException(AccessDeniedException exception) {
        var responseError = new ResponseObject.Builder<String>()
                .success(false)
                .message(exception.getMessage())
                .code("AUTH_FAILED")
                .content(null)
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseError);
    }
    @ExceptionHandler({
            InvalidKeyException.class,
            ExpiredJwtException.class,
            UnsupportedJwtException.class,
            SignatureException.class,
    })
    public ResponseEntity<ResponseObject<String>> tokenFailedException(JwtException exception) {
        var responseError =new ResponseObject.Builder<String>()
                .success(false)
                .message(exception.getMessage())
                .code("AUTH_FAILED")
                .content(null)
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseError);
    }
    @ExceptionHandler({
            UsernameNotFoundException.class,
            BadCredentialsException.class,
            LockedException.class,
            DisabledException.class,
            AccountStatusException.class,
            InsufficientAuthenticationException.class
    })
    public ResponseEntity<ResponseObject<String>> authenticationFailedException(AuthenticationException exception) {
        var responseError = new ResponseObject.Builder<String>()
                .success(false)
                .message(exception.getMessage())
                .code("AUTH_FAILED")
                .content(null)
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject<String>> somethingWrongException(Exception ex) {
        var responseError = new ResponseObject.Builder<String>()
                .success(false)
                .message(ex.getMessage())
                .code("SOMETHING_WRONG")
                .content(null)
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseError);
    }
}