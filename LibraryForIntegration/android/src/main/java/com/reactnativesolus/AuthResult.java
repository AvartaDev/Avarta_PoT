package com.reactnativesolus;

import com.solus.integrationlibrary.enums.WorkflowType;

public abstract class AuthResult {

  private WorkflowType mWorkflowType;
  private String mProcessorKey;

  public AuthResult(WorkflowType workflowType, String processorKey) {
    mWorkflowType = workflowType;
    mProcessorKey = processorKey;
  }

  public WorkflowType getWorkflowType() {
    return mWorkflowType;
  }

  public String getProcessorKey() {
    return mProcessorKey;
  }
}
