package com.reactnativesolus;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.facetec.sdk.FaceTecCancelButtonCustomization;
import com.facetec.sdk.FaceTecCustomization;
import com.facetec.sdk.FaceTecSDK;
import com.solus.integrationlibrary.enums.WorkflowType;
import com.solus.integrationlibrary.interfaces.PendingActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import io.reactivex.Observable;
import io.reactivex.ObservableSource;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Action;
import io.reactivex.functions.Function;
import io.reactivex.schedulers.Schedulers;
import okhttp3.Call;
import okhttp3.Callback;

public abstract class BaseZoomProcessor {
  SolusModule solusModule;
  static final String FAKE_UUID = "00000000-0000-0000-0000-000000000000";
  private final int ZOOM_INITIALIZE_ATTEMPTS = 3;
  private final int ZOOM_REINIT_DELAY_MS = 3000;
  private int mZoomInitAttempts = ZOOM_INITIALIZE_ATTEMPTS;
  //    public static String baseURLNew = "https://api.zoomauth.com/api/v2/biometrics";
  public static String baseURLNew = "https://api.facetec.com/api/v3.1/biometrics";


  public BaseZoomProcessor(Context context, WorkflowType workflowType, String processorKey) {
    if (processorKey.equalsIgnoreCase(PendingActivity.CODE_ENROLL_ZOOM_SECRET) || processorKey.equalsIgnoreCase(PendingActivity.CODE_VALIDATE_ZOOM_SECRET))
      customizeZoom(context);
  }

  public void customizeZoom(Context context) {
    FaceTecCustomization currentLowLightCustomization = getLowLightCustomizationForTheme(context);
    FaceTecCustomization currentDynamicDimmingCustomization = getLowLightCustomizationForTheme(context);

    FaceTecSDK.setCustomization(getCustomizationForTheme(context));
    FaceTecSDK.setLowLightCustomization(currentLowLightCustomization);
    FaceTecSDK.setDynamicDimmingCustomization(currentDynamicDimmingCustomization);
  }


  public static
  FaceTecCustomization getCustomizationForTheme(Context context) {
    FaceTecCustomization currentCustomization = new FaceTecCustomization();

    int[] retryScreenSlideshowImages = new int[]{R.drawable.zoom_ideal, R.drawable.zoom_ideal_1, R.drawable.zoom_ideal_2, R.drawable.zoom_ideal_3, R.drawable.zoom_ideal_4, R.drawable.zoom_ideal_5};

    int primaryColor = Color.parseColor("#FFFFFF"); // black
    int secondaryColor = ContextCompat.getColor(context, R.color.colorZoomSpin2);//Color.parseColor("#3BC371"); // green
    int backgroundColor = Color.parseColor("#EEF6F8"); // white
    int buttonBackgroundDisabledColor = Color.parseColor("#adadad");

    Typeface boldTypeface = Typeface.create("sans-serif", Typeface.BOLD);
    Typeface normalTypeface = Typeface.create("sans-serif", Typeface.NORMAL);

    // Overlay Customization
    currentCustomization.getOverlayCustomization().backgroundColor = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentCustomization.getOverlayCustomization().showBrandingImage = false;
    currentCustomization.getOverlayCustomization().brandingImage = 0;
    // Guidance Customization
    currentCustomization.getGuidanceCustomization().backgroundColors = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentCustomization.getGuidanceCustomization().foregroundColor = primaryColor;
    currentCustomization.getGuidanceCustomization().headerFont = boldTypeface;
    currentCustomization.getGuidanceCustomization().subtextFont = normalTypeface;
    currentCustomization.getGuidanceCustomization().buttonFont = boldTypeface;

    currentCustomization.getGuidanceCustomization().buttonTextNormalColor = ContextCompat.getColor(context, R.color.colorZoomSpin2);  // text color of i am ready button when user ready
    currentCustomization.getGuidanceCustomization().buttonBackgroundNormalColor = primaryColor;
    currentCustomization.getGuidanceCustomization().buttonTextHighlightColor = backgroundColor;
    currentCustomization.getGuidanceCustomization().buttonBackgroundHighlightColor = Color.parseColor("#565656");
    currentCustomization.getGuidanceCustomization().buttonTextDisabledColor = Color.WHITE;//backgroundColor;  // set I am ready text color
    currentCustomization.getGuidanceCustomization().buttonBackgroundDisabledColor = Color.TRANSPARENT;
    currentCustomization.getGuidanceCustomization().buttonBorderColor = Color.WHITE;
    currentCustomization.getGuidanceCustomization().buttonBorderWidth = 1;
    currentCustomization.getGuidanceCustomization().buttonCornerRadius = 5;

    currentCustomization.getGuidanceCustomization().readyScreenOvalFillColor = Color.TRANSPARENT;
    currentCustomization.getGuidanceCustomization().readyScreenTextBackgroundColor = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentCustomization.getGuidanceCustomization().readyScreenTextBackgroundCornerRadius = 5;
    currentCustomization.getGuidanceCustomization().retryScreenImageBorderColor = primaryColor;
    currentCustomization.getGuidanceCustomization().retryScreenImageBorderWidth = 2;
    currentCustomization.getGuidanceCustomization().retryScreenImageCornerRadius = 10;
    currentCustomization.getGuidanceCustomization().retryScreenOvalStrokeColor = backgroundColor;
    currentCustomization.getGuidanceCustomization().retryScreenSlideshowImages = retryScreenSlideshowImages;
    currentCustomization.getGuidanceCustomization().retryScreenSlideshowInterval = 2000;
    currentCustomization.getGuidanceCustomization().enableRetryScreenSlideshowShuffle = true;
    currentCustomization.getGuidanceCustomization().retryScreenSubtextFont = normalTypeface;
    currentCustomization.getGuidanceCustomization().retryScreenSubtextTextColor = Color.WHITE; // text color for Your selfie and Ideal Pose
//         currentCustomization.getGuidanceCustomization().cameraPermissionsScreenImage = R.drawable.camera_shutter_offblack;
    // ID Scan Customization

    // Result Screen Customization
    currentCustomization.getResultScreenCustomization().backgroundColors = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentCustomization.getResultScreenCustomization().foregroundColor = primaryColor;
    currentCustomization.getResultScreenCustomization().messageFont = boldTypeface;
    currentCustomization.getResultScreenCustomization().activityIndicatorColor = primaryColor;
    currentCustomization.getResultScreenCustomization().customActivityIndicatorImage = 0;
    currentCustomization.getResultScreenCustomization().customActivityIndicatorRotationInterval = 800;
//         currentCustomization.getResultScreenCustomization().customActivityIndicatorAnimation = R.drawable.pseudo_fullscreen_animated_activity_indicator;
    currentCustomization.getResultScreenCustomization().resultAnimationBackgroundColor = secondaryColor;
    currentCustomization.getResultScreenCustomization().resultAnimationForegroundColor = backgroundColor;
    currentCustomization.getResultScreenCustomization().resultAnimationSuccessBackgroundImage = 0;
    currentCustomization.getResultScreenCustomization().resultAnimationUnsuccessBackgroundImage = 0;
    currentCustomization.getResultScreenCustomization().showUploadProgressBar = true;
    currentCustomization.getResultScreenCustomization().uploadProgressTrackColor = Color.parseColor("#33FFFFFF");
    currentCustomization.getResultScreenCustomization().uploadProgressFillColor = secondaryColor;
    currentCustomization.getResultScreenCustomization().animationRelativeScale = 1.0f;
    // Feedback Customization
    currentCustomization.getFeedbackCustomization().backgroundColors = secondaryColor;
    currentCustomization.getFeedbackCustomization().textColor = backgroundColor;
    currentCustomization.getFeedbackCustomization().textFont = boldTypeface;
    currentCustomization.getFeedbackCustomization().cornerRadius = 5;
    currentCustomization.getFeedbackCustomization().elevation = 10;
    // Frame Customization
    currentCustomization.getFrameCustomization().backgroundColor = ContextCompat.getColor(context, R.color.colorZoomSpin1);
    currentCustomization.getFrameCustomization().borderColor = primaryColor;
    currentCustomization.getFrameCustomization().borderWidth = 0;
    currentCustomization.getFrameCustomization().cornerRadius = 0;
    currentCustomization.getFrameCustomization().elevation = 0;
    // Oval Customization
    currentCustomization.getOvalCustomization().strokeColor = primaryColor;
    currentCustomization.getOvalCustomization().progressColor1 = ContextCompat.getColor(context, R.color.colorZoomSpin1);//Color.parseColor("#BF3BC371");
    currentCustomization.getOvalCustomization().progressColor2 = ContextCompat.getColor(context, R.color.colorZoomSpin1);//Color.parseColor("#BF3BC371");
    // Cancel Button Customization
    currentCustomization.getCancelButtonCustomization().customImage = R.drawable.zoom_cancel;
    currentCustomization.getCancelButtonCustomization().setLocation(FaceTecCancelButtonCustomization.ButtonLocation.CUSTOM);
    currentCustomization.getCancelButtonCustomization().setCustomLocation(new Rect(20, 20, 25, 25));

    // Guidance Customization -- Text Style Overrides
    // Ready Screen Header
    currentCustomization.getGuidanceCustomization().readyScreenHeaderFont = boldTypeface;
    currentCustomization.getGuidanceCustomization().readyScreenHeaderTextColor = primaryColor;
    // Ready Screen Subtext
    currentCustomization.getGuidanceCustomization().readyScreenSubtextFont = normalTypeface;
    currentCustomization.getGuidanceCustomization().readyScreenSubtextTextColor = Color.parseColor("#FFFFFF");
    // Ready Screen Header
    currentCustomization.getGuidanceCustomization().retryScreenHeaderFont = boldTypeface;
    currentCustomization.getGuidanceCustomization().retryScreenHeaderTextColor = primaryColor;
    // Retry Screen Subtext
    currentCustomization.getGuidanceCustomization().retryScreenSubtextFont = normalTypeface;
    currentCustomization.getGuidanceCustomization().retryScreenSubtextTextColor = Color.parseColor("#565656");


    return currentCustomization;
  }

  static FaceTecCustomization getLowLightCustomizationForTheme(Context context) {
    // FaceTecCustomization currentLowLightCustomization = new FaceTecCustomization();//getCustomizationForTheme(context);
    FaceTecCustomization currentLowLightCustomization = new FaceTecCustomization();

    int[] retryScreenSlideshowImages = new int[]{R.drawable.zoom_ideal, R.drawable.zoom_ideal_1, R.drawable.zoom_ideal_2, R.drawable.zoom_ideal_3, R.drawable.zoom_ideal_4, R.drawable.zoom_ideal_5};

    int primaryColor = Color.BLACK;//Color.parseColor("#FFFFFF"); // black
    int secondaryColor = ContextCompat.getColor(context, R.color.colorZoomSpin2);//Color.parseColor("#3BC371"); // green
    int backgroundColor = Color.parseColor("#EEF6F8"); // white
    int buttonBackgroundDisabledColor = Color.parseColor("#adadad");

    Typeface boldTypeface = Typeface.create("sans-serif", Typeface.BOLD);
    Typeface normalTypeface = Typeface.create("sans-serif", Typeface.NORMAL);

    // Overlay Customization
    currentLowLightCustomization.getOverlayCustomization().backgroundColor = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentLowLightCustomization.getOverlayCustomization().showBrandingImage = false;
    currentLowLightCustomization.getOverlayCustomization().brandingImage = 0;
    // Guidance Customization
    currentLowLightCustomization.getGuidanceCustomization().backgroundColors = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentLowLightCustomization.getGuidanceCustomization().foregroundColor = primaryColor;
    currentLowLightCustomization.getGuidanceCustomization().headerFont = boldTypeface;
    currentLowLightCustomization.getGuidanceCustomization().subtextFont = normalTypeface;
    currentLowLightCustomization.getGuidanceCustomization().buttonFont = boldTypeface;

    currentLowLightCustomization.getGuidanceCustomization().buttonTextNormalColor = ContextCompat.getColor(context, R.color.white);  // text color of i am ready button when user ready
    currentLowLightCustomization.getGuidanceCustomization().buttonBackgroundNormalColor = primaryColor;
    currentLowLightCustomization.getGuidanceCustomization().buttonTextHighlightColor = backgroundColor;
    currentLowLightCustomization.getGuidanceCustomization().buttonBackgroundHighlightColor = Color.parseColor("#565656");
    currentLowLightCustomization.getGuidanceCustomization().buttonTextDisabledColor = Color.BLACK;//backgroundColor;  // set I am ready text color
    currentLowLightCustomization.getGuidanceCustomization().buttonBackgroundDisabledColor = Color.TRANSPARENT;
    currentLowLightCustomization.getGuidanceCustomization().buttonBorderColor = Color.BLACK;
    currentLowLightCustomization.getGuidanceCustomization().buttonBorderWidth = 1;
    currentLowLightCustomization.getGuidanceCustomization().buttonCornerRadius = 5;

    currentLowLightCustomization.getGuidanceCustomization().readyScreenOvalFillColor = Color.TRANSPARENT;
    currentLowLightCustomization.getGuidanceCustomization().readyScreenTextBackgroundColor = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentLowLightCustomization.getGuidanceCustomization().readyScreenTextBackgroundCornerRadius = 5;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenImageBorderColor = primaryColor;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenImageBorderWidth = 2;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenImageCornerRadius = 10;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenOvalStrokeColor = backgroundColor;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenSlideshowImages = retryScreenSlideshowImages;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenSlideshowInterval = 2000;
    currentLowLightCustomization.getGuidanceCustomization().enableRetryScreenSlideshowShuffle = true;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenSubtextFont = normalTypeface;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenSubtextTextColor = primaryColor; // text color for Your selfie and Ideal Pose
//         currentCustomization.getGuidanceCustomization().cameraPermissionsScreenImage = R.drawable.camera_shutter_offblack;
    // ID Scan Customization

    // Result Screen Customization
    currentLowLightCustomization.getResultScreenCustomization().backgroundColors = ContextCompat.getColor(context, R.color.colorZoomSpin1);//backgroundColor;
    currentLowLightCustomization.getResultScreenCustomization().foregroundColor = primaryColor;
    currentLowLightCustomization.getResultScreenCustomization().messageFont = boldTypeface;
    currentLowLightCustomization.getResultScreenCustomization().activityIndicatorColor = primaryColor;
    currentLowLightCustomization.getResultScreenCustomization().customActivityIndicatorImage = 0;
    currentLowLightCustomization.getResultScreenCustomization().customActivityIndicatorRotationInterval = 800;
//         currentCustomization.getResultScreenCustomization().customActivityIndicatorAnimation = R.drawable.pseudo_fullscreen_animated_activity_indicator;
    currentLowLightCustomization.getResultScreenCustomization().resultAnimationBackgroundColor = secondaryColor;
    currentLowLightCustomization.getResultScreenCustomization().resultAnimationForegroundColor = backgroundColor;
    currentLowLightCustomization.getResultScreenCustomization().resultAnimationSuccessBackgroundImage = 0;
    currentLowLightCustomization.getResultScreenCustomization().resultAnimationUnsuccessBackgroundImage = 0;
    currentLowLightCustomization.getResultScreenCustomization().showUploadProgressBar = true;
    currentLowLightCustomization.getResultScreenCustomization().uploadProgressTrackColor = Color.LTGRAY;//Color.parseColor("#33FFFFFF");
    currentLowLightCustomization.getResultScreenCustomization().uploadProgressFillColor = secondaryColor;
    currentLowLightCustomization.getResultScreenCustomization().animationRelativeScale = 1.0f;
    // Feedback Customization
    currentLowLightCustomization.getFeedbackCustomization().backgroundColors = secondaryColor;
    currentLowLightCustomization.getFeedbackCustomization().textColor = backgroundColor;
    currentLowLightCustomization.getFeedbackCustomization().textFont = boldTypeface;
    currentLowLightCustomization.getFeedbackCustomization().cornerRadius = 5;
    currentLowLightCustomization.getFeedbackCustomization().elevation = 10;
    // Frame Customization
    currentLowLightCustomization.getFrameCustomization().backgroundColor = ContextCompat.getColor(context, R.color.colorZoomSpin1);
    currentLowLightCustomization.getFrameCustomization().borderColor = primaryColor;
    currentLowLightCustomization.getFrameCustomization().borderWidth = 0;
    currentLowLightCustomization.getFrameCustomization().cornerRadius = 0;
    currentLowLightCustomization.getFrameCustomization().elevation = 0;
    // Oval Customization
    currentLowLightCustomization.getOvalCustomization().strokeColor = primaryColor;
    currentLowLightCustomization.getOvalCustomization().progressColor1 = ContextCompat.getColor(context, R.color.colorZoomSpin1);//Color.parseColor("#BF3BC371");
    currentLowLightCustomization.getOvalCustomization().progressColor2 = ContextCompat.getColor(context, R.color.colorZoomSpin1);//Color.parseColor("#BF3BC371");
    // Cancel Button Customization
    currentLowLightCustomization.getCancelButtonCustomization().customImage = R.drawable.cancel_black;
    currentLowLightCustomization.getCancelButtonCustomization().setLocation(FaceTecCancelButtonCustomization.ButtonLocation.CUSTOM);
    currentLowLightCustomization.getCancelButtonCustomization().setCustomLocation(new Rect(20, 20, 25, 25));

    // Guidance Customization -- Text Style Overrides
    // Ready Screen Header
    currentLowLightCustomization.getGuidanceCustomization().readyScreenHeaderFont = boldTypeface;
    currentLowLightCustomization.getGuidanceCustomization().readyScreenHeaderTextColor = primaryColor;
    // Ready Screen Subtext
    currentLowLightCustomization.getGuidanceCustomization().readyScreenSubtextFont = normalTypeface;
    currentLowLightCustomization.getGuidanceCustomization().readyScreenSubtextTextColor = primaryColor;
    // Ready Screen Header
    currentLowLightCustomization.getGuidanceCustomization().retryScreenHeaderFont = boldTypeface;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenHeaderTextColor = primaryColor;
    // Retry Screen Subtext
    currentLowLightCustomization.getGuidanceCustomization().retryScreenSubtextFont = normalTypeface;
    currentLowLightCustomization.getGuidanceCustomization().retryScreenSubtextTextColor = Color.parseColor("#565656");


    return currentLowLightCustomization;
  }

  static FaceTecCustomization getDynamicDimmingCustomizationForTheme(Context context) {
    FaceTecCustomization currentDynamicDimmingCustomization = getCustomizationForTheme(context);
    return currentDynamicDimmingCustomization;
  }


  private Observable<Boolean> createInitializationObservable(final Context context) {
    return Observable.create(emitter -> {
      try {

        FaceTecSDK.initializeInDevelopmentMode(context,SolusConstants.ZOOM_DEV_KEY,
                //SolusConstants.get(SolusConstants.ZOOM_DEV_KEY),
                SolusConstants.PUBLIC_KEY, new FaceTecSDK.InitializeCallback() {
          @Override
          public void onCompletion(boolean b) {
            Log.e("", "onCreate: ORGANISATIONKEY-constants"+SolusConstants.ZOOM_DEV_KEY);
            Log.e("Zoom ", "initialization => " + b);
            if (!b) {
              emitter.onError(new Exception());
            } else {
              emitter.onNext(true);
              emitter.onComplete();
            }
          }
        });
      } catch (Exception e) {
        emitter.onError(e);
      }
    });
  }

  @SuppressLint("CheckResult")
  public void doZoomOperation(final Context context, final Action onNext) {
    createInitializationObservable(context)
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .retryWhen(throwableObservable -> throwableObservable.flatMap((Function<Throwable, ObservableSource<?>>) throwable -> {
        if (throwable instanceof Exception && mZoomInitAttempts > 0) {
          mZoomInitAttempts--;
          return createInitializationObservable(context).delay(ZOOM_REINIT_DELAY_MS, TimeUnit.MILLISECONDS);
        }

        throw new Exception();
      }))
      .subscribe(aBoolean -> onNext.run(), throwable -> {
      });
  }

  public void getSessionToken(final SessionTokenCallback sessionTokenCallback) {
    // Do the network call and handle result
    okhttp3.Request request = new okhttp3.Request.Builder()
      .header("X-Device-Key", SolusConstants.ZOOM_DEV_KEY)
      .header("User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(""))
      .url(baseURLNew + "/session-token")
      .get()
      .build();

    NetworkingHelpers.getApiClient().newCall(request).enqueue(new Callback() {
      @Override
      public void onFailure(Call call, IOException e) {
        e.printStackTrace();
        Log.d("FaceTecSDKSampleApp", "Exception raised while attempting HTTPS call.");
        if (!e.getMessage().equals(NetworkingHelpers.OK_HTTP_RESPONSE_CANCELED)) {
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
          }
        } catch (JSONException e) {
          e.printStackTrace();
          Log.d("FaceTecSDKSampleApp", "Exception raised while attempting to parse JSON result.");
        }
      }
    });
  }


}

