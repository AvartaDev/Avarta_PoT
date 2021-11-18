package com.reactnativesolus;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facetec.sdk.FaceTecCustomization;
import com.facetec.sdk.FaceTecFaceScanProcessor;
import com.facetec.sdk.FaceTecFaceScanResultCallback;
import com.facetec.sdk.FaceTecSDK;
import com.facetec.sdk.FaceTecSessionActivity;
import com.facetec.sdk.FaceTecSessionResult;
import com.facetec.sdk.FaceTecSessionStatus;
import com.reactnativesolus.db.DbUserController;
import com.solus.dlock.manager.DlockConfig;
import com.solus.dlock.manager.DlockManager;
import com.solus.dlock.manager.DlockOperation;
import com.solus.dlock.manager.DlockProcessListener;
import com.solus.dlock.manager.DlockTheming;
import com.solus.integrationlibrary.enums.WorkflowType;
import com.solus.integrationlibrary.interfaces.PendingActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.RequestBody;

public class PendingActivityProcessor extends BaseZoomProcessor implements AuthProcessor, FaceTecFaceScanProcessor {

  private WorkflowType mWorkflowType;
  private String mActivityKey;
  private Promise promised;
  private AuthResultCallback callback;
  private Context mContext;
  private UserData mUserData;
  //    private ZoomManagedSession zoomManagedSession;
  private final String DLOCK_FAKE_RESULT = "111";
  private final int MAX_ATTEMPT = 3;
  private final int PIN_LENGTH = 4;

  PendingActivityProcessor(Context context, UserData userData, WorkflowType workflowType, String activityKey, AuthResultCallback mcallback, Promise promise) {
    super(context, workflowType, activityKey);
    mContext = context;
    mWorkflowType = workflowType;
    mActivityKey = activityKey;
    mUserData = userData;
    callback = mcallback;
    promised=promise;
  }

  @Override
  public void doAuthOperation() {
    Log.e("doAuthOperation *** ", mActivityKey);
    callback.processingMessage("Process start : " + mActivityKey);
    switch (mActivityKey) {
      case PendingActivity.CODE_ENROLL_ZOOM_SECRET:
//                deleteZoomUser();
        doZoomOperation(mContext, () -> {
          getSessionToken(sessionToken -> {
            if (sessionToken != null && sessionToken.length() > 0)
              FaceTecSessionActivity.createAndLaunchSession(mContext, PendingActivityProcessor.this, sessionToken);
          });
                  /*  zoomManagedSession = new ZoomManagedSession(managedSessionCallback, mContext,
                            SolusConstants.get(SolusConstants.ZOOM_DEV_KEY), baseURLNew,
                            ZoomManagedSession.ZoomManagedSessionMode.ENROLL,
                            mUserData.getUsername().replace("   .", "_"));*/
        });
        break;
      case PendingActivity.CODE_VALIDATE_ZOOM_SECRET:
        doZoomOperation(mContext, () -> getSessionToken(sessionToken -> {
          if (sessionToken != null && sessionToken.length() > 0)
            FaceTecSessionActivity.createAndLaunchSession(mContext, PendingActivityProcessor.this, sessionToken);
        }));
        break;
      case PendingActivity.CODE_DELETEEVUSER:
        deleteZoomUser();
        break;
      case PendingActivity.CODE_DYNAMICPIN:
        if(mWorkflowType == WorkflowType.ENROL){
          DlockManager.getInstance(mContext).setDlockListener(createDlockCallback());
          DlockManager.getInstance(mContext)
                  .registerUser(mContext, mUserData.getUsername(), createDlockConfig(mContext, true));
        }else{
          DlockManager.getInstance(mContext)
                  .setDlockListener(createDlockCallback());
          DlockManager.getInstance(mContext)
                  .verifyUser(mContext, mUserData.getUsername(), createDlockConfig(mContext, false));
        }

        break;
      case PendingActivity.CODE_PASSWORD:
        callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey,mUserData.getPassword()));
        break;
      case PendingActivity.CODE_DEVICE_CAP:

        JSONObject bodyObj = new JSONObject();
        JSONObject deviceCapJsonObj = new JSONObject();
        JSONObject capabilitiesJsonObj = new JSONObject();

        try {
          capabilitiesJsonObj.put("EV", false);
          capabilitiesJsonObj.put("Zoom", true);

          deviceCapJsonObj.put("Model", Build.MODEL);
          deviceCapJsonObj.put("Manufacturer", Build.BRAND);
          deviceCapJsonObj.put("Capabilities", capabilitiesJsonObj);

          bodyObj.put("DEVICECAP", deviceCapJsonObj);
        } catch (JSONException e) {
          e.printStackTrace();
        }

        callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, bodyObj.toString()));
        break;

      case PendingActivity.CODE_APPVERSION:

        String version;
        try {
          PackageInfo pInfo = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
          version = "BankDemo".toUpperCase() + ":" + pInfo.versionName;
        } catch (Exception e) {
          version = "";
        }
        callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, version));
        break;
      case PendingActivity.CODE_DEVICE:
        String deviceID;

        try {
          deviceID = Settings.Secure.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID);
        } catch (Exception e) {
          e.printStackTrace();
          deviceID = "";
        }

        callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, deviceID != null ? deviceID : ""));
        break;
      case PendingActivity.CODE_NOTIFICATIONPUSHID:

//               String oneSignalUserID = "test-nouserid";
        //SolusPrefManager.getInstance(mContext).getCurrentOneSignalUserID();
        String oneSignalUserID = SolusPrefManager.getInstance(mContext).getCurrentOneSignalUserID();
        if (TextUtils.isEmpty(oneSignalUserID)) {
          callback.onAuthError(mContext.getString(R.string.error_gcm), new Exception(mContext.getString(R.string.error_gcm)));
        } else {
          callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, "ANDROID" + ":" + oneSignalUserID));
        }
        break;
      case PendingActivity.CODE_LOCATION:
        callback.onAuthSuccess(new LocationResult(mWorkflowType,
          mActivityKey,
          (SolusPrefManager.getInstance(mContext).getLatitude()),
          (SolusPrefManager.getInstance(mContext).getLongitude())));
        break;
      case PendingActivity.CODE_VALIDATEENROLCODE:
        break;

      default:
        throw new IllegalStateException("Unexpected value: " + mActivityKey);
    }
  }


  public void deleteZoomUser() {
    SolusPrefManager.getInstance(mContext.getApplicationContext()).saveUserIdForZoom("");
    SolusPrefManager.getInstance(mContext.getApplicationContext()).saveUserUUIDForZoom("");
    deleteDlockUser();
    deleteLocalSavedUser();
        /*ZoomManagedSession.deleteExistingUser(mContext, SolusConstants.get(SolusConstants.ZOOM_DEV_KEY),
                BaseZoomProcessor.baseURLNew, mUserData.getUsername().replace(".", "_"), new ZoomManagedSession.DeleteUserCallback() {
                    @Override
                    public void onResult(boolean isDeleted) {
                        if (isDeleted) {
                            callback.processingMessage("User deleted from facetec");
                            deleteDlockUser();
                            deleteLocalSavedUser();
                        } else {
                            callback.processingMessage("Failed to delete user from facetec");
                        }
                    }
                });*/
  }

  private void deleteLocalSavedUser() {
    DbUserController.deleteUser(mUserData.getUsername());
    // delete locally saved user from your side here  like usernmae+timestamp for facetec
    callback.processingMessage("User Removed Successfully");
    callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, "complete"));
  }

  private void deleteDlockUser() {
    DlockManager.getInstance(mContext)
      .setDlockListener(new DlockProcessListener() {
        @Override
        public void onDlockProcessFailed(DlockOperation dlockOperation, Throwable throwable) {
          callback.processingMessage("Solus Dlock operation failed");

        }

        @Override
        public void onDlockProcessSucess(DlockOperation dlockOperation, String s) {
          callback.processingMessage("From Solus Dlock: User deleted from dlock success");
        }

        @Override
        public void onDlockProcessCanceled(DlockOperation dlockOperation) {
          callback.processingMessage("Solus Dlock operation canceled by user");

        }
      });
    DlockManager.getInstance(mContext).removeUser(mContext, mUserData.getUsername());
  }


  /**
   * Dlock verification process start
   *
   * @return
   */

  DlockProcessListener createDlockCallback() {
    return new DlockProcessListener() {
      @Override
      public void onDlockProcessFailed(DlockOperation dlockOperation, Throwable throwable) {
        if (dlockOperation != DlockOperation.REMOVE) {
          callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, DLOCK_FAKE_RESULT));
        }
      }

      @Override
      public void onDlockProcessSucess(DlockOperation dlockOperation, String pinHash) {
        if (dlockOperation != DlockOperation.REMOVE) {
          callback.onAuthSuccess(new TextResult(mWorkflowType, mActivityKey, pinHash));
        }
      }

      @Override
      public void onDlockProcessCanceled(DlockOperation dlockOperation) {
        callback.onAuthError("Dlock operation cancelled", new Exception("DlockOperationCancelledException"));
      }
    };
  }


  DlockConfig createDlockConfig(Context context, boolean isRegistration) {
    return DlockConfig.newBuilder()
      .setPinLength(PIN_LENGTH)
      .setMaxAttemptCount(MAX_ATTEMPT)
      .setDlockTheming(createDlockTheming(context, isRegistration))
      .build();
  }

  private DlockTheming createDlockTheming(Context context, boolean isRegistration) {
    return DlockTheming.newBuilder()
      .setActionbarLogo(R.drawable.ic_main_logo)
      .setColorActionbarBg(ContextCompat.getColor(context, R.color.colorMainBlue))
      .setColorPinDoneBtnBg(ContextCompat.getColor(context, R.color.colorMainBlue))
      .setColorPinDoneBtnBgPressed(ContextCompat.getColor(context, R.color.colorMainBlueSel))
      .setColorPinDigitText(ContextCompat.getColor(context, R.color.colorMainBlue))
      .setColorPinDigitTextPressed(ContextCompat.getColor(context, R.color.white))
      .setColorPinDigitBgPressed(ContextCompat.getColor(context, R.color.colorMainBlueSel))
      .setColorPinProgressLine(ContextCompat.getColor(context, R.color.colorMainBlue))
      .setActionbarTitle(mContext.getString(isRegistration ? R.string.actionbar_registration : R.string.actionbar_authorization))
      .build();
  }

  /* dlock verification process end*/


  /***
   * Zoom verification process start
   */

//    ZoomManagedSession.ZoomManagedSessionCallback managedSessionCallback = new ZoomManagedSession.ZoomManagedSessionCallback() {
//        @Override
//        public void onZoomManagedSessionComplete(final ZoomManagedSession.ZoomManagedSessionStatus status) {
//            Log.e("managed session", "managed session callback");
//            //   onZoomResult(status);
//        }
//    };

/*
    private void onZoomResult(ZoomManagedSession.ZoomManagedSessionStatus zoomManagedSessionStatus) {
        if (zoomManagedSession.getLatestZoomSessionResult().getFaceMetrics() == null) {
            callback.onAuthError("Zoom faceMetrics is null", new Exception("Zoom faceMetrics is null => " + mWorkflowType));
            return;
        }

        if (zoomManagedSessionStatus == ZoomManagedSession.ZoomManagedSessionStatus.UNSUCCESS_CHECK_SUBCODE) {
            if (zoomManagedSession.getLatestZoomSessionResult() != null && zoomManagedSession.getLatestZoomSessionResult().getStatus() != ZoomSessionStatus.SESSION_COMPLETED_SUCCESSFULLY) {
                Log.e("UNSUCCESS_CHECK_SUBCODE", zoomManagedSession.getLatestZoomSessionResult().getStatus().toString());
                callback.onAuthError("ZOOM : " + zoomManagedSession.getLatestZoomSessionResult().getStatus().toString(), new Exception(zoomManagedSession.getLatestZoomSessionResult().getStatus().toString() + " => " + mWorkflowType));
            } else {
                Log.e("UNSUCCESS_SUBCODE-else", zoomManagedSession.latestFaceTecAPIResponseString!=null?zoomManagedSession.latestFaceTecAPIResponseString:zoomManagedSession.getLatestZoomManagedSessionStatusSubCode().toString());
                callback.onAuthError("ZOOM : " + zoomManagedSession.latestFaceTecAPIResponseString!=null?zoomManagedSession.latestFaceTecAPIResponseString:zoomManagedSession.getLatestZoomManagedSessionStatusSubCode().toString(), new Exception(zoomManagedSession.latestFaceTecAPIResponseString + " => " + mWorkflowType));
            }
        } else {
            Log.e("SUCCESS ", zoomManagedSessionStatus.toString());

            callback.onAuthSuccess(new ZoomAuthResult(
                    mWorkflowType,
                    mActivityKey,
                    UUID.randomUUID().toString(),
                    "Partial Liveness Success",
                    1.1f));
        }
    }
*/

  /* zoom verification process end*/
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    Log.e("Onactivity result", "onactivity result called");
    if (mActivityKey.equalsIgnoreCase(PendingActivity.CODE_ENROLL_ZOOM_SECRET)) {
      //     zoomManagedSession.processZoomManagedSessionResult(requestCode, resultCode, data);
    }
  }

  @Override
  public void processSessionWhileFaceTecSDKWaits(FaceTecSessionResult faceTecSessionResult, FaceTecFaceScanResultCallback faceTecFaceScanResultCallback) {
    okhttp3.Request request;
    if (mWorkflowType == WorkflowType.ENROL) {
      SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy-hh-mm-ss", Locale.ENGLISH);
      String username = mUserData.getUsername() + "-" + dateFormat.format(new Date());
      SolusPrefManager.getInstance(mContext).saveUserIdForZoom(username);
      if (faceTecSessionResult.getStatus() != FaceTecSessionStatus.SESSION_COMPLETED_SUCCESSFULLY) {
        NetworkingHelpers.cancelPendingRequests();
        faceTecFaceScanResultCallback.cancel();
        promised.reject(null,"Facetec Session unsuccessful");
        return;
      }
      JSONObject parameters = new JSONObject();
      try {
        parameters.put("faceScan", faceTecSessionResult.getFaceScanBase64());
        parameters.put("auditTrailImage", faceTecSessionResult.getAuditTrailCompressedBase64()[0]);
        parameters.put("lowQualityAuditTrailImage", faceTecSessionResult.getLowQualityAuditTrailCompressedBase64()[0]);
        parameters.put("externalDatabaseRefID", username);
      } catch (JSONException e) {
        e.printStackTrace();
        Log.d("FaceTecSDKSampleApp", "Exception raised while attempting to create JSON payload for upload.");
      }
      request = new okhttp3.Request.Builder()
        .url(baseURLNew + "/enrollment-3d")
        .header("Content-Type", "application/json")
        .header("X-Device-Key", SolusConstants.ZOOM_DEV_KEY)
        .header("User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(faceTecSessionResult.getSessionId()))
        .post(new ProgressRequestBody(RequestBody.create(parameters.toString(), MediaType.parse("application/json; charset=utf-8")),
          new ProgressRequestBody.Listener() {
            @Override
            public void onUploadProgressChanged(long bytesWritten, long totalBytes) {
              final float uploadProgressPercent = ((float) bytesWritten) / ((float) totalBytes);
              faceTecFaceScanResultCallback.uploadProgress(uploadProgressPercent);
            }
          }))
        .build();
      NetworkingHelpers.getApiClient().newCall(request).enqueue(new Callback() {
        @Override
        public void onResponse(@NonNull Call call, @NonNull okhttp3.Response response) throws IOException {

          //
          // Part 6:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
          // and handle all other responses by cancelling out.
          // You may have different paradigms in your own API and are free to customize based on these.
          //

          String responseString = response.body().string();
          response.body().close();
          try {
            JSONObject responseJSON = new JSONObject(responseString);
            Log.e("Response from zoom : ", responseJSON.toString());
            boolean wasProcessed = responseJSON.getBoolean("wasProcessed");
            String scanResultBlob = responseJSON.getString("scanResultBlob");

            // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
            // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
            if (wasProcessed) {

              // Demonstrates dynamically setting the Success Screen Message.
              FaceTecCustomization.overrideResultScreenSuccessMessage = "Enrollment\nConfirmed";

              // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
              // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
              boolean success = faceTecFaceScanResultCallback.proceedToNextStep(scanResultBlob);
              String uid = UUID.randomUUID().toString();
              SolusPrefManager.getInstance(mContext).saveUserUUIDForZoom(uid);
              callback.onAuthSuccess(new ZoomAuthResult(
                      mWorkflowType,
                      mActivityKey,
                      uid,
                      "Partial Liveness Success",
                      1.1f));
            } else {
              // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.

              faceTecFaceScanResultCallback.cancel();
              callback.onAuthError("ZOOM : " + "Error message here", new Exception("WasProcessed false from zoom enroll" + " => " + mWorkflowType));
              promised.reject(null,"Facetec Session failed during process");

            }
          } catch (JSONException e) {
            // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
            e.printStackTrace();
            Log.d("FaceTecSDKSampleApp", "Exception raised while attempting to parse JSON result.");
            faceTecFaceScanResultCallback.cancel();
            promised.reject(null,"Exception raised while attempting to parse JSON result");
          }
        }

        @Override
        public void onFailure(@NonNull Call call, @Nullable IOException e) {
          // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
          Log.d("FaceTecSDKSampleApp", "Exception raised while attempting HTTPS call.");
          faceTecFaceScanResultCallback.cancel();
          promised.reject(null,"Exception raised while attempting HTTPS call");
        }
      });
    } else {
      if (faceTecSessionResult.getStatus() != FaceTecSessionStatus.SESSION_COMPLETED_SUCCESSFULLY) {
        NetworkingHelpers.cancelPendingRequests();
        faceTecFaceScanResultCallback.cancel();
        promised.reject(null,"FaceTec session unsuccessful");
        return;
      }
      //
      // Part 4:  Get essential data off the FaceTecSessionResult
      //
      JSONObject parameters = new JSONObject();
      try {
        parameters.put("faceScan", faceTecSessionResult.getFaceScanBase64());
        parameters.put("auditTrailImage", faceTecSessionResult.getAuditTrailCompressedBase64()[0]);
        parameters.put("lowQualityAuditTrailImage", faceTecSessionResult.getLowQualityAuditTrailCompressedBase64()[0]);
        parameters.put("externalDatabaseRefID", SolusPrefManager.getInstance(mContext).getUserIdForZoom());
      } catch (JSONException e) {
        e.printStackTrace();
        Log.d("FaceTecSDKSampleApp", "Exception raised while attempting to create JSON payload for upload.");
      }

      //
      // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
      //
      request = new okhttp3.Request.Builder()
        .url(baseURLNew + "/match-3d-3d")
        .header("Content-Type", "application/json")
        .header("X-Device-Key", SolusConstants.ZOOM_DEV_KEY)
        .header("User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(faceTecSessionResult.getSessionId()))

        //
        // Part 7:  Demonstrates updating the Progress Bar based on the progress event.
        //
        .post(new ProgressRequestBody(RequestBody.create(parameters.toString(),MediaType.parse("application/json; charset=utf-8")),
          new ProgressRequestBody.Listener() {
            @Override
            public void onUploadProgressChanged(long bytesWritten, long totalBytes) {
              final float uploadProgressPercent = ((float) bytesWritten) / ((float) totalBytes);
              faceTecFaceScanResultCallback.uploadProgress(uploadProgressPercent);
            }
          }))
        .build();
      NetworkingHelpers.getApiClient().newCall(request).enqueue(new Callback() {
        @Override
        public void onResponse(@NonNull Call call, @NonNull okhttp3.Response response) throws IOException {

          //
          // Part 6:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
          // and handle all other responses by cancelling out.
          // You may have different paradigms in your own API and are free to customize based on these.
          //

          String responseString = response.body().string();
          response.body().close();
          try {
            JSONObject responseJSON = new JSONObject(responseString);
            Log.e("Response from zoom : ", responseJSON.toString());
            boolean wasProcessed = responseJSON.getBoolean("wasProcessed");
            String scanResultBlob = responseJSON.getString("scanResultBlob");
            boolean isMatched = responseJSON.getBoolean("success");
            // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
            // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
            if (wasProcessed && isMatched) {

              // Demonstrates dynamically setting the Success Screen Message.
              FaceTecCustomization.overrideResultScreenSuccessMessage = "Authenticated";

              // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
              // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
              boolean success = faceTecFaceScanResultCallback.proceedToNextStep(scanResultBlob);
              String uid =   SolusPrefManager.getInstance(mContext).getUserUUIDForZoom();
              callback.onAuthSuccess(new ZoomAuthResult(
                      mWorkflowType,
                      mActivityKey,
                      uid,
                      "Partial Liveness Success",
                      1.1f));
            } else {
              // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.

              new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                  callback.onAuthError("ZOOM : " + "Error message here", new Exception("WasProcessed false from zoom enroll" + " => " + mWorkflowType));
                  promised.reject(null,"Facetec session failed while Processing");
                }
              },100);
              faceTecFaceScanResultCallback.cancel();


            }
          } catch (JSONException e) {
            // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
            e.printStackTrace();
            Log.d("FaceTecSDKSampleApp", "Exception raised while attempting to parse JSON result.");
            faceTecFaceScanResultCallback.cancel();
            promised.reject(null,"Exception raised while attempting to parse JSON result");
          }
        }

        @Override
        public void onFailure(@NonNull Call call, @Nullable IOException e) {
          // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
          Log.d("FaceTecSDKSampleApp", "Exception raised while attempting HTTPS call.");
          faceTecFaceScanResultCallback.cancel();
          promised.reject(null,"Exception raised while attempting HTTPS call");
        }
      });
    }


        /*callback.onAuthSuccess(new ZoomAuthResult(
                mWorkflowType,
                mActivityKey,
                UUID.randomUUID().toString(),
                "Partial Liveness Success",
                1.1f));*/
  }
}
