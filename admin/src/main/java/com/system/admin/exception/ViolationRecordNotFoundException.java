package com.system.admin.exception;

public class ViolationRecordNotFoundException extends RuntimeException{
    public ViolationRecordNotFoundException(String message){
        super(message);
    }
}
