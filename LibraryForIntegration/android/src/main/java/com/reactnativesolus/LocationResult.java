package com.reactnativesolus;

import com.solus.integrationlibrary.enums.WorkflowType;
import com.solus.integrationlibrary.utils.Logger;

public class LocationResult extends AuthResult {

  private double mLatitude;
  private double mLongitude;

  public LocationResult(WorkflowType workflowType, String processorKey, double latitude, double longitude) {
    super(workflowType, processorKey);

    mLatitude = latitude;
    mLongitude = longitude;
  }

  @Override
  public String toString() {
    String s = "LAT" + mLatitude + ":LON" + mLongitude;
    Logger.e(this, s);
    return s;
  }
}
