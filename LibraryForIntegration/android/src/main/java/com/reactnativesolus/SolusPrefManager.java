package com.reactnativesolus;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

public class SolusPrefManager {


  private static SolusPrefManager instance;
  private final SharedPreferences sh;
  private final SharedPreferences.Editor edit;

  private SolusPrefManager(Context mContext) {
    sh = mContext.getSharedPreferences("SolusPref", Activity.MODE_PRIVATE);
    edit = sh.edit();
  }

  public static synchronized SolusPrefManager getInstance(Context context) {
    if (instance == null) {
      instance = new SolusPrefManager(context);
    }
    return instance;
  }


  public String getCurrentOneSignalUserID() {
    return sh.getString("ONESIGNAL_ID", "");
  }

  public void setCurrentOneSignalUserID(String userId) {
    edit.putString("ONESIGNAL_ID", userId).commit();
  }


  public void saveLaitudeLongitude(float lat, float lng) {
    edit.putFloat("PREFS_LOCATION_LAT", lat).commit();
    edit.putFloat("PREFS_LOCATION_LNG", lng).commit();

  }

  public float getLatitude() {
    return sh.getFloat("PREFS_LOCATION_LAT", 0);
  }

  public float getLongitude() {
    return sh.getFloat("PREFS_LOCATION_LNG", 0);
  }


  public void saveInAuthPermenentID(String pid) {
    edit.putString("INAUTH_ID", pid).commit();
  }

  public String getInAuthPermentntID() {
    return sh.getString("INAUTH_ID", "");
  }

  public void saveUserIdForZoom(String pid) {
    edit.putString("ZOOM_USER", pid).commit();
  }

  public String getUserIdForZoom() {
    return sh.getString("ZOOM_USER", "");
  }
  public void saveUserUUIDForZoom(String pid) {
    edit.putString("ZOOM_USER_UUID", pid).commit();
  }

  public String getUserUUIDForZoom() {
    return sh.getString("ZOOM_USER_UUID", "");
  }

}

