package com.system.admin.exception;

public class PermissionNotFoundException extends RuntimeException{
    public PermissionNotFoundException(String message){
        super(message);
    }
}
