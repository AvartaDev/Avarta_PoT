package com.reactnativesolus;

public interface AuthResultCallback {

  void onAuthSuccess(AuthResult authResult);

  void onAuthError(String message, Throwable throwable);

  void processingMessage(String message);
}
