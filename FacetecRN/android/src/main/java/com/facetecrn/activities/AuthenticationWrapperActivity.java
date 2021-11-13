package com.facetecrn.activities;

import static java.util.UUID.randomUUID;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facetec.sdk.FaceTecSDK;
import com.facetec.sdk.FaceTecSessionResult;
import com.facetec.sdk.FaceTecSessionStatus;
import com.facetecrn.SessionTokenCallback;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import Processors.AuthenticateProcessor;
import Processors.Config;
import Processors.NetworkingHelpers;
import okhttp3.Call;
import okhttp3.Callback;

public class AuthenticationWrapperActivity extends ReactActivity {
  private String latestExternalDatabaseRefID;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);


    // Initialize FaceTec SDK
    Config.initializeFaceTecSDKFromAutogeneratedConfig(this, new FaceTecSDK.InitializeCallback() {
      @Override
      public void onCompletion(final boolean successful) {
        if (successful) {
          Log.d("FaceTecSDKSampleApp", "Initialization Successful.");
        }
      }
    });

    Bundle extras = getIntent().getExtras();
    if(extras == null){
      emitFail("AuthenticationWrapperActivity could not obtain id in intent extras");
      finish();
    }
    latestExternalDatabaseRefID = extras.getString("id");

    getSessionToken((String sessionToken) -> {
      AuthenticateProcessor processor = new AuthenticateProcessor(sessionToken, AuthenticationWrapperActivity.this, latestExternalDatabaseRefID);
      processor.createAndLaunchSession();
    });

  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    Log.d(this.getClass().toString(), String.format("requestCode: %S, resultCode: %S", requestCode, resultCode));
    Log.d(this.getClass().toString(), "onActivityResult");
    FaceTecSessionResult res = (FaceTecSessionResult) data.getExtras().get("facetecsdk.signup.sessionResult");

    boolean isSuccess = res.getStatus() == FaceTecSessionStatus.SESSION_COMPLETED_SUCCESSFULLY;
    if (isSuccess) {
      emitSuccess(latestExternalDatabaseRefID);
    }else{
      emitFail(res.getStatus().toString());
    }
    finish();
  }

  public void getSessionToken(final SessionTokenCallback sessionTokenCallback) {
    // Do the network call and handle result
    okhttp3.Request request = new okhttp3.Request.Builder()
      .header("X-Device-Key", Config.DeviceKeyIdentifier)
      .header("User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(""))
      .url(Config.BaseURL + "/session-token")
      .get()
      .build();

    NetworkingHelpers.getApiClient().newCall(request).enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {
        e.printStackTrace();
        Log.d("FaceTecSDKSampleApp", "Exception raised while attempting HTTPS call.");

        // If this comes from HTTPS cancel call, don't set the sub code to NETWORK_ERROR.
        if (!e.getMessage().equals(NetworkingHelpers.OK_HTTP_RESPONSE_CANCELED)) {
//          utils.handleErrorGettingServerSessionToken();
          //TODO: handle error getting server session token
        }
      }

      @Override
      public void onResponse(Call call, okhttp3.Response response) throws IOException {
        String responseString = response.body().string();
        response.body().close();
        try {
          JSONObject responseJSON = new JSONObject(responseString);
          if (responseJSON.has("sessionToken")) {
            sessionTokenCallback.onSessionTokenReceived(responseJSON.getString("sessionToken"));
          } else {
            //TODO: handle error getting server session token
          }
        } catch (JSONException e) {
          e.printStackTrace();
          Log.d("FaceTecSDKSampleApp", "Exception raised while attempting to parse JSON result.");
          //TODO: handle error getting server session token
        }
      }
    });
  }

  public void emitFail(String msg) {
    WritableMap map = Arguments.createMap();
    map.putString("result", "FAIL");
    map.putString("message", msg);
    try {
      getReactInstanceManager().getCurrentReactContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("AUTHENTICATION", map);

    } catch (Exception e) {
      Log.e("ReactNative", e.getMessage());
    }
  }

  public void emitSuccess(String _latestExternalDatabaseRefID) {
    WritableMap map = Arguments.createMap();
    map.putString("latestExternalDatabaseRefID", _latestExternalDatabaseRefID);
    map.putString("result", "SUCCESS");
    try {
      getReactInstanceManager().getCurrentReactContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("ENROLL", map);

    } catch (Exception e) {
      Log.e("ReactNative", e.getMessage());
    }
  }
}
