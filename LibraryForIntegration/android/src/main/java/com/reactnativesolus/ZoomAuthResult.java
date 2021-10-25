package com.reactnativesolus;

import com.solus.integrationlibrary.enums.WorkflowType;

import org.json.JSONException;
import org.json.JSONObject;

public class ZoomAuthResult extends AuthResult {

  private String mZoomUserSecret;
  private String mLivenessLevel;
  private float mLivenessScore;

  public ZoomAuthResult(WorkflowType workflowType, String processorKey, String zoomUserSecret, String livenessLevel, float livenessScore) {
    super(workflowType, processorKey);
    mZoomUserSecret = zoomUserSecret;
    mLivenessLevel = livenessLevel;
    mLivenessScore = livenessScore;
  }

  public String createRawJson() {
    JSONObject zoomJson = new JSONObject();
    JSONObject zoomSecretJson = new JSONObject();
    try {
      zoomSecretJson.put("Secret", mZoomUserSecret);
      zoomSecretJson.put("Description", mLivenessLevel);
      zoomSecretJson.put("Liveness", mLivenessScore);
      zoomJson.put("ZOOM", zoomSecretJson);
    } catch (JSONException e) {
      //    CrashLogging.LogCrashException(e,"ZoomAuthResult exception");
      e.printStackTrace();
    }

    return zoomJson.toString();
  }

  @Override
  public String toString() {
    return createRawJson();
  }
}

