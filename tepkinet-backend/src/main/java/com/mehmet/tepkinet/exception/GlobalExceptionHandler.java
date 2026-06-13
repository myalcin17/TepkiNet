package com.mehmet.tepkinet.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            ResourceNotFoundException.class)

    public ResponseEntity<String>
    handleResourceNotFoundException(

            ResourceNotFoundException ex) {

        return new ResponseEntity<>(

                ex.getMessage(),

                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(
            BadRequestException.class)
    public ResponseEntity<String> handleBadRequestException(
            BadRequestException ex) {
        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Geçersiz giriş verisi.");

        return new ResponseEntity<>(Map.of("message", message), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Map<String, String>> handleBindException(BindException ex) {
        String message = ex.getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Geçersiz giriş verisi.");

        return new ResponseEntity<>(Map.of("message", message), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(Map.of("message", ex.getMessage() != null ? ex.getMessage() : "Geçersiz istek."), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>(Map.of("message", "Bu işlem için yetkiniz yok."), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(Map.of("message", "Bu işlem için giriş yapmalısınız."), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, String>> handleNullPointerException(NullPointerException ex) {
        return new ResponseEntity<>(Map.of("message", "Sunucu hatası. Lütfen tekrar deneyin."), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(Map.of("message", ex.getMessage() != null ? ex.getMessage() : "Sunucu hatası."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
