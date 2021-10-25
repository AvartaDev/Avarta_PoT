package com.reactnativesolus;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.JobIntentService;

import com.android.volley.VolleyError;
import com.inmobile.InMobileByteArrayCallback;
import com.inmobile.InMobileException;
import com.inmobile.InMobileStringObjectMapCallback;
import com.inmobile.MME;
import com.inmobile.MMEUtilities;
import com.solus.integrationlibrary.data.api.IntegrationApiManager;
import com.solus.integrationlibrary.data.api.response.BaseResponse;
import com.solus.integrationlibrary.enums.WorkflowType;
import com.solus.integrationlibrary.interfaces.IBaseApiListener;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class InauthService extends JobIntentService {

  private final String TAG = this.getClass().getSimpleName();
  private IntegrationApiManager integrationApiManager;
   String url,orgKey;
  @Override
  protected void onHandleWork(@NonNull Intent intent) {
    if (intent == null || TextUtils.isEmpty(intent.getAction())) {
      return;
    }
    receiver = intent.getParcelableExtra("RECEIVER_CALLBACK");
    orgKey = intent.getStringExtra("organizationkey");
    url = intent.getStringExtra("url");
    switch (intent.getAction()) {
      case SolusConstants.ACTION_SEND_INAUTH_LOGS:
        String username = intent.getStringExtra("username");
        WorkflowType workflowType = (WorkflowType) intent.getSerializableExtra("workflowtype");

        switch (workflowType) {
          case ENROL:
            doInauthRegistration(username,url);
            break;

          case AUTH:
            doInauthLogs(username,url);
            break;
        }
        break;
    }
  }

  private IntegrationApiManager getApiManager() {
    if (integrationApiManager == null) {
      integrationApiManager = new IntegrationApiManager(url, orgKey, getApplicationContext());
    }

    return integrationApiManager;
  }

  public static void enqueueWork(Context context, Intent work) {
    enqueueWork(context, InauthService.class, 1000, work);
  }

  ResultReceiver receiver;

  private void doInauthRegistration(final String username, String serverUrl) {
    String existPermId = SolusPrefManager.getInstance(getApplicationContext()).getInAuthPermentntID();

    if (TextUtils.isEmpty(existPermId)) {
      try {
        //  initInAuthSdk(getApplication());
        MME.getInstance().init(getApplication(),
          SolusConstants.get(SolusConstants.INAUTH_GUID),
          MMEUtilities.readServerKeysMessage(getApplication(), SolusConstants.INAUTH_SERVER_KEYS_MESSAGE_FILE_NAME),
          SolusConstants.get(SolusConstants.INAUTH_APPLICATION_ID),
          (s, e) -> {
            Log.e("result inauth", s != null ? s : "string null");
            if (e != null) {
              e.printStackTrace();
            }
            final byte[][] registrationPayload = {null};
            MME.getInstance().generateRegistrationPayload(new InMobileByteArrayCallback() {
              @Override
              public void onComplete(@Nullable byte[] bytes, @Nullable InMobileException e) {
                registrationPayload[0] = bytes;
                if (e != null) {
                  e.printStackTrace();
                }
                String url = serverUrl.concat(SolusConstants.INAUTH_SERVER_REGISTER_URL);
                getApiManager().sendMultipartRequest(getApplication(), url, registrationPayload[0], new IBaseApiListener<byte[]>() {
                  @Override
                  public void onSuccess(byte[] data) {
                    if (data != null) {
                      try {
                        JSONObject mainObj = new JSONObject(new String(data));
                        String inauthDeviceDataBase64 = mainObj.getString("deviceResponse");
                        String decryptInauthDeviceData = new String(Base64.decode(inauthDeviceDataBase64, Base64.DEFAULT));
                        String permanentId = mainObj.getJSONObject("deviceInfo").getString("permanentId");

                        MME.getInstance().handlePayload(decryptInauthDeviceData.getBytes(), new InMobileStringObjectMapCallback() {
                          @Override
                          public void onComplete(@Nullable Map<String, Object> map, @Nullable InMobileException e) {
                            Log.e("InAuth handlePayload", map.toString());
                            if (e != null)
                              e.printStackTrace();
                          }
                        });
                        SolusPrefManager.getInstance(getApplicationContext()).saveInAuthPermenentID(permanentId);
                        registerInauthForSolusUser(permanentId, username,url);
                      } catch (Exception ignored) {
                        Log.e("failed", "Inauth registration failed");
                        sendResultToMainScreen("InAuth registration failed from inauth SDK");
                      }
                    }
                  }

                  @Override
                  public void onError(Exception e) {
                    printErrorLogs(e, TAG);
                  }
                });
              }
            });


          }
        );

      } catch (Exception e) {
        printErrorLogs(e, TAG);
      }
    } else {
      registerInauthForSolusUser(existPermId, username,url);
    }
  }

  private void registerInauthForSolusUser(String permanentId, String username, String serverurl) {
    Map<String, String> params = new HashMap<>();
    params.put("permanentId", permanentId);
    params.put("username", username);

    String url = serverurl.concat(SolusConstants.SOLUS_INAUTH_REGISTRATION_URL);
    getApiManager().sendPostRequest(getApplicationContext(), url, BaseResponse.class, params, new IBaseApiListener<BaseResponse>() {
      @Override
      public void onSuccess(BaseResponse baseResponse) {
        Log.e("success", "Inauth registration on SC onSuccess");
      }

      @Override
      public void onError(Exception e) {
        Log.e("error", "Inauth registration on SC onError");
        sendResultToMainScreen("Inauth registration on SolusConnect error");

      }
    });
  }

  private void doInauthLogs(final String username,String serverurl) {
    try {

      MME.getInstance().init(getApplication(),
        SolusConstants.get(SolusConstants.INAUTH_GUID),
        MMEUtilities.readServerKeysMessage(getApplication(), SolusConstants.INAUTH_SERVER_KEYS_MESSAGE_FILE_NAME),
        SolusConstants.get(SolusConstants.INAUTH_APPLICATION_ID),
        (s, e) -> {
          Log.e("result inauth", s != null ? s : "string null");
          if (e != null) {
            e.printStackTrace();
          }
          if (MME.getInstance().isRegistered()) {// MMEManager.getInstance().isRegistered()) {
            final byte[][] aggregateLogs = {null};
            MME.getInstance().generateLogPayload((bytes, e1) -> {
              aggregateLogs[0] = bytes;
              Log.e("InAuth", "generateLogPayload");
              if (e1 != null) {
                e1.printStackTrace();

              }
              String url = serverurl.concat(SolusConstants.INAUTH_SERVER_SEND_LOGS_URL);
              getApiManager().sendMultipartRequest(getApplication(), url, aggregateLogs[0], new IBaseApiListener<byte[]>() {
                @Override
                public void onSuccess(byte[] data) {
                  if (data != null) {
                    try {
                      JSONObject logDataResult = new JSONObject(new String(data));
                      logDataResult.put("UserName", username);
                      sendInAuthLogsIntoSolus(logDataResult.toString(),url);
                    } catch (Exception ignored) {
                      ignored.printStackTrace();
                    }
                  }
                }

                @Override
                public void onError(Exception e1) {
                  printErrorLogs(e1, TAG);
                }
              });
            });

          }
        }
      );
    } catch (Exception ignored) {
    }
  }

  private void sendInAuthLogsIntoSolus(String rawJson, String serverurl) {
    String url = serverurl.concat(SolusConstants.SOLUS_INAUTH_LOGS_URL);
    getApiManager().sendPostRequest(getApplicationContext(), url, BaseResponse.class, rawJson, new IBaseApiListener<BaseResponse>() {
      @Override
      public void onSuccess(BaseResponse baseResponse) {
        Log.e("success", "Sending inuath logs into SC succeed");
        //  sendResultToMainScreen("Sending inuath logs into SC succeed");
      }

      @Override
      public void onError(Exception e) {
        Log.e("success", "Sending inuath logs into SC failed");
        sendResultToMainScreen("Sending inuath logs into SC failed");
      }
    });
  }


  private void printErrorLogs(Exception e, final String tag) {
    if (e instanceof VolleyError) {
      final VolleyError volleyError = (VolleyError) e;
      try {
        if (volleyError.networkResponse != null && volleyError.networkResponse.data != null) {
          Log.e(TAG, tag + " <onError>:\n encrypted data: ".concat(new String(volleyError.networkResponse.data, "UTF-8")));
          MME.getInstance().handlePayload(volleyError.networkResponse.data, (map, e12) -> Log.e(TAG, tag + " <onError>:\n decrypted data: ".concat(map.toString())));
        } else {
          Log.e(TAG, tag + " <onError>:\n response is empty");
        }
      } catch (Exception e1) {
        e1.printStackTrace();
      }
    }
    e.printStackTrace();
  }

  private void sendResultToMainScreen(String message) {
    Bundle bundle = new Bundle();
    bundle.putString("message", message);
    receiver.send(Activity.RESULT_OK, bundle);
  }
}
