package com.facetecrn;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

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


  @ReactMethod
  public void enroll() {
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = new Intent(context, SampleAppActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(intent);
    Log.d("FacetecRnModule.java", "ENROLL");
  }

  @ReactMethod
  public void authenticate(String id) {
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = new Intent(context,SampleAppActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.putExtra("id",id );
    context.startActivity(intent);
  }
}
