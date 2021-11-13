package com.facetecrn;

import static java.util.UUID.randomUUID;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facetec.sdk.FaceTecSDK;
import com.facetecrn.activities.AuthenticationWrapperActivity;
import com.facetecrn.activities.EnrollmentWrapperActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import Processors.Config;
import Processors.EnrollmentProcessor;
import Processors.NetworkingHelpers;
import okhttp3.Call;
import okhttp3.Callback;

@ReactModule(name = FacetecRnModule.NAME)
public class FacetecRnModule extends ReactContextBaseJavaModule {
  public static final String NAME = "FacetecRn";

  public FacetecRnModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  public static boolean isEnrolled = false;
  public static String id = "";

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void multiply(int a, int b, Promise promise) {
    promise.resolve(a * b);
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

  public void emitEnrollSucess(String _latestExternalDatabaseRefID) {
    WritableMap map = Arguments.createMap();
    map.putString("latestExternalDatabaseRefID", _latestExternalDatabaseRefID);

    try {
      getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("ENROLL", map);

    } catch (Exception e) {
      Log.e("ReactNative", e.getMessage());
    }
  }

  @ReactMethod
  public void enroll() {
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = new Intent(context, EnrollmentWrapperActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(intent);
    Log.d("FacetecRnModule.java", "ENROLL");

  }

  @ReactMethod
  public void authenticate(String id) {
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = new Intent(context, AuthenticationWrapperActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.putExtra("id", id);
    context.startActivity(intent);
  }
}
