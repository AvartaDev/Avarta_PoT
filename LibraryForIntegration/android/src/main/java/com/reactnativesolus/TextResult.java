package com.reactnativesolus;

import com.solus.integrationlibrary.enums.WorkflowType;

public class TextResult extends AuthResult {

  private String mMessage;

  public TextResult(WorkflowType workflowType, String processorKey, String message) {
    super(workflowType, processorKey);
    mMessage = message;
  }

  @Override
  public String toString() {
    return mMessage;
  }
}
