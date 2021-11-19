package com.reactnativesolus;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.ResultReceiver;
import android.service.autofill.UserData;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.activeandroid.ActiveAndroid;
import com.activeandroid.Configuration;
import com.android.volley.NoConnectionError;
import com.android.volley.ServerError;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.firebase.FirebaseApp;
import com.onesignal.OSSubscriptionObserver;
import com.onesignal.OSSubscriptionStateChanges;
import com.onesignal.OneSignal;
import com.reactnativesolus.db.DbUserController;
import com.reactnativesolus.db.User;
import com.solus.dlock.manager.DlockManager;
import com.solus.dlock.manager.DlockOperation;
import com.solus.dlock.manager.DlockProcessListener;
import com.solus.integrationlibrary.data.api.IntegrationApiManager;
import com.solus.integrationlibrary.data.api.response.PendingTask;
import com.solus.integrationlibrary.data.api.response.ScoreResponse;
import com.solus.integrationlibrary.data.helpers.ApiCryptManager;
import com.solus.integrationlibrary.data.helpers.EllipticCurveKeys;
import com.solus.integrationlibrary.data.models.SolusConfig;
import com.solus.integrationlibrary.enums.WorkflowType;
import com.solus.integrationlibrary.exceptions.ApiErrorException;
import com.solus.integrationlibrary.exceptions.JsonParserException;
import com.solus.integrationlibrary.exceptions.WorkflowFailedException;
import com.solus.integrationlibrary.interfaces.ApiErrorCode;
import com.solus.integrationlibrary.interfaces.ApplicationCode;
import com.solus.integrationlibrary.interfaces.IBaseApiListener;
import com.solus.integrationlibrary.interfaces.IWorkflowProccessListener;
import com.solus.integrationlibrary.interfaces.PendingActivity;
import com.solus.integrationlibrary.utils.Logger;

import javax.net.ssl.SSLHandshakeException;

@ReactModule(name = SolusModule.NAME)
public class SolusModule extends ReactContextBaseJavaModule {
    public static final String NAME = "Solus";

    com.reactnativesolus.UserData userData;
    public IntegrationApiManager mIntegrationApiManager;
    private AuthProcessor mActiveAuthProcessor;
    SolusPrefManager prefManager;
    public String BASE_URL;
    public String ORGANISATIONKEY;
    public static String DEVICEKEYIDENTIFIER;
    public static String FACESCANENCRYPTIONKEY;
    public SolusModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    Promise promised;

  @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android

  @ReactMethod
  public void onCreate(String DeviceKeyIdentifier,String FaceScanEncryptionKey,String SERVER_BASE_URL, String ORGANISATION_KEY){
      BASE_URL=SERVER_BASE_URL;
      ORGANISATIONKEY=ORGANISATION_KEY;
      DEVICEKEYIDENTIFIER=DeviceKeyIdentifier;

      FACESCANENCRYPTIONKEY=FaceScanEncryptionKey;
    FirebaseApp.initializeApp(getReactApplicationContext());
    Logger.setEnabled(true);
    prefManager = SolusPrefManager.getInstance(getReactApplicationContext());
    ActiveAndroid.initialize(new Configuration.Builder(this.getCurrentActivity()).addModelClasses(User.class).create());
    Log.e("+++++", "[[[[]]]]" );
    OneSignal.initWithContext(this.getCurrentActivity().getApplicationContext());
    OneSignal.setAppId("dc71ce17-2a34-4ca7-8ac3-131426f59fd0");
    OneSignal.addSubscriptionObserver(new OSSubscriptionObserver() {
      @Override
      public void onOSSubscriptionChanged(OSSubscriptionStateChanges stateChanges) {
        Log.e("+++++", "+++++++++++--++" );
        if (stateChanges.getTo().getUserId() != null) {
          // get player ID
          String userId = stateChanges.getTo().getUserId();
          Log.e("+++++", "+++++++++++++++"+userId );
          prefManager.setCurrentOneSignalUserID(userId);
        }
      }
    });
    ApiCryptManager cryptManager = new ApiCryptManager();
    EllipticCurveKeys.initializeKeys();
    Log.e("KEY", "onCreate: ORGANISATIONKEY"+DEVICEKEYIDENTIFIER);
  }

  @ReactMethod
  public void EnrollProcess(String Username, String Password , Promise promise
//          , String SERVER_BASE_URL, String ORGANISATION_KEY
          ){
            try{
    promised=promise;
    initializeIntigration(Username,Password);//,SERVER_BASE_URL,ORGANISATION_KEY);

    mIntegrationApiManager.setProcessListener(workflowProccessListener);
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Solus Loaded ...",Toast.LENGTH_LONG).show();
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Enrollment Process Start.",Toast.LENGTH_LONG).show();
    mIntegrationApiManager.startWorkflow(ApplicationCode.BANKINGAPP, this.getCurrentActivity().getApplicationContext(), WorkflowType.ENROL.toString(), Username, false);

    Intent inauthService = new Intent(this.getCurrentActivity().getApplicationContext(), InauthService.class);
    inauthService.setAction(SolusConstants.ACTION_SEND_INAUTH_LOGS);
    inauthService.putExtra("workflowtype", WorkflowType.ENROL);
    inauthService.putExtra("username", userData.getUsername());
    inauthService.putExtra("url", BASE_URL);
    inauthService.putExtra("organizationkey", ORGANISATIONKEY);
    inauthService.putExtra("RECEIVER_CALLBACK", new ResultReceiver(new Handler(Looper.getMainLooper())) {
      @Override
      protected void onReceiveResult(int resultCode, Bundle resultData) {
        super.onReceiveResult(resultCode, resultData);

        if (resultCode == Activity.RESULT_OK && resultData != null) {
//                    inauthResult.setText("InAuth:  " + resultData.getString("message"));
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"InAuth."+resultData.getString("message"),Toast.LENGTH_LONG).show();
          //promised.resolve("InAuth."+resultData.getString("message"));
        } else {
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"InAuth.Error", Toast.LENGTH_LONG).show();
         // promised.reject(null,"InAuth.Error");
        }

      }
    });
    //  startService(inauthService);
    //InauthService.enqueueWork(this.getCurrentActivity().getApplicationContext(), inauthService);
    //InauthService.enqueueWork(this.getCurrentActivity().getApplicationContext(), inauthService);
    }catch(Exception e) {
              Log.d("asd", "EnrollProcess: ",e);
            }
  }

  @ReactMethod
  public void AuthenticationProcess(String Username, String Password,Promise promise
//          , String SERVER_BASE_URL, String ORGANISATION_KEY
  ){
    try {
        promised=promise;
        initializeIntigration(Username, Password);//,SERVER_BASE_URL,ORGANISATION_KEY);
        mIntegrationApiManager.setProcessListener(workflowProccessListener);
        Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(), "Solus Loaded ...", Toast.LENGTH_LONG).show();
        Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(), "Authenticate Process Start.", Toast.LENGTH_LONG).show();
        mIntegrationApiManager.startWorkflow(ApplicationCode.BANKINGAPP, this.getCurrentActivity().getApplicationContext(), WorkflowType.AUTH.toString(), userData.getUsername(), false);

        Intent inauthService = new Intent(this.getCurrentActivity().getApplicationContext(), InauthService.class);
        inauthService.setAction(SolusConstants.ACTION_SEND_INAUTH_LOGS);
        inauthService.putExtra("workflowtype", WorkflowType.AUTH);
        inauthService.putExtra("username", userData.getUsername());
        inauthService.putExtra("url", BASE_URL);
        inauthService.putExtra("organizationkey", ORGANISATIONKEY);
        inauthService.putExtra("RECEIVER_CALLBACK", new ResultReceiver(new Handler(Looper.getMainLooper())) {
          @Override
          protected void onReceiveResult(int resultCode, Bundle resultData) {
            super.onReceiveResult(resultCode, resultData);

            if (resultCode == Activity.RESULT_OK && resultData != null) {
              Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(), "InAuth." + resultData.getString("message"), Toast.LENGTH_LONG).show();
            } else {
              Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(), "InAuth.Error", Toast.LENGTH_LONG).show();
            }
          }
        });
        //InauthService.enqueueWork(this.getCurrentActivity().getApplicationContext(), inauthService);
        //InauthService.enqueueWork(this.getCurrentActivity().getApplicationContext(), inauthService);
    }catch (Exception e){
      Log.d("asd", "AuthenticationProcess: ",e);
    }
  }

  @ReactMethod
  public void DeEnrollProcess(String Username, String Password,Promise promise
//          , String SERVER_BASE_URL, String ORGANISATION_KEY
  ){
    try{
        promised=promise;
        Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"DeEnrollment Process Start.",Toast.LENGTH_LONG).show();
        userData = new com.reactnativesolus.UserData();
        initializeIntigration(Username,Password);//,SERVER_BASE_URL,ORGANISATION_KEY);
        mIntegrationApiManager.setProcessListener(workflowProccessListener);
        mIntegrationApiManager.startWorkflow(ApplicationCode.BANKINGAPP, this.getCurrentActivity().getApplicationContext(), WorkflowType.REMOVE.toString(), userData.getUsername(), false);
    }catch(Exception e){
      Log.d("asd", "DeEnrollProcess: ",e);
    }
  }



  @ReactMethod
  public void StepUpProcess(String Username, String Password,Promise promise){
    try{
      promised=promise;
    initializeIntigration(Username,Password);//,SERVER_BASE_URL,ORGANISATION_KEY);
    mIntegrationApiManager.setProcessListener(workflowProccessListener);
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Solus Loaded ...",Toast.LENGTH_LONG).show();
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Step Up Process Start.",Toast.LENGTH_LONG).show();
    mIntegrationApiManager.startWorkflow(ApplicationCode.BANKINGAPP, this.getCurrentActivity().getApplicationContext(), WorkflowType.STEPUP.toString(), Username, false);

    Intent inauthService = new Intent(this.getCurrentActivity().getApplicationContext(), InauthService.class);
    inauthService.setAction(SolusConstants.ACTION_SEND_INAUTH_LOGS);
    inauthService.putExtra("workflowtype", WorkflowType.STEPUP);
    inauthService.putExtra("username", userData.getUsername());
    inauthService.putExtra("url", BASE_URL);
    inauthService.putExtra("organizationkey", ORGANISATIONKEY);
    inauthService.putExtra("RECEIVER_CALLBACK", new ResultReceiver(new Handler(Looper.getMainLooper())) {
      @Override
      protected void onReceiveResult(int resultCode, Bundle resultData) {
        super.onReceiveResult(resultCode, resultData);

        if (resultCode == Activity.RESULT_OK && resultData != null) {
//                    inauthResult.setText("InAuth:  " + resultData.getString("message"));
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"InAuth."+resultData.getString("message"),Toast.LENGTH_LONG).show();
        } else {
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"InAuth.Error", Toast.LENGTH_LONG).show();
        }
      }
    });
    //  startService(inauthService);
    //InauthService.enqueueWork(this.getCurrentActivity().getApplicationContext(), inauthService);
  }catch (Exception e){
      Log.d("asd", "StepUpProcess: ",e);
    }
  }


  @ReactMethod
  public void StepUpElevatedProcess(String Username, String Password , Promise promise){
    try{
    promised=promise;
    initializeIntigration(Username,Password);
    mIntegrationApiManager.setProcessListener(workflowProccessListener);
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Solus Loaded ...",Toast.LENGTH_LONG).show();
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Step Up Elevated Process Start.",Toast.LENGTH_LONG).show();
    mIntegrationApiManager.startWorkflow(ApplicationCode.BANKINGAPP, this.getCurrentActivity().getApplicationContext(), WorkflowType.STEPUP_ELEVATED.toString(), Username, false);

    Intent inauthService = new Intent(this.getCurrentActivity().getApplicationContext(), InauthService.class);
    inauthService.setAction(SolusConstants.ACTION_SEND_INAUTH_LOGS);
    inauthService.putExtra("workflowtype", WorkflowType.STEPUP_ELEVATED);
    inauthService.putExtra("username", userData.getUsername());
    inauthService.putExtra("url", BASE_URL);
    inauthService.putExtra("organizationkey", ORGANISATIONKEY);
    inauthService.putExtra("RECEIVER_CALLBACK", new ResultReceiver(new Handler(Looper.getMainLooper())) {
      @Override
      protected void onReceiveResult(int resultCode, Bundle resultData) {
        super.onReceiveResult(resultCode, resultData);

        if (resultCode == Activity.RESULT_OK && resultData != null) {
//                    inauthResult.setText("InAuth:  " + resultData.getString("message"));
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"InAuth."+resultData.getString("message"),Toast.LENGTH_LONG).show();
        } else {
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"InAuth.Error", Toast.LENGTH_LONG).show();
        }
      }
    });
    //  startService(inauthService);
    //InauthService.enqueueWork(this.getCurrentActivity().getApplicationContext(), inauthService);
  }catch (Exception e) {
      Log.d("asd", "StepUpElevatedProcess: ",e);
    }
  }

  private void initializeIntigration(String username, String password) {

    userData = new com.reactnativesolus.UserData();

    userData.setUsername(username);
    userData.setPassword(password);
   // BASE_URL = SERVER_BASE_URL;
   // ORGANISATIONKEY = ORGANISATION_KEY;

    mIntegrationApiManager = new  IntegrationApiManager(BASE_URL, ORGANISATIONKEY, this.getCurrentActivity().getApplicationContext());
  }

  public String tryParseSCExceptionMessage(Throwable throwable) {
    if (throwable instanceof ApiErrorException && this.getCurrentActivity() != null) {
      ApiErrorException exception = ((ApiErrorException) throwable);
      return exception.getErrorDescription(this.getCurrentActivity(), exception.getErrorCode());
    }

    return "";
  }

  private void calculateUserScore(final boolean afterError) {
    mIntegrationApiManager.calculateUserScore(this.getCurrentActivity(), new IBaseApiListener<ScoreResponse>() {
      @Override
      public void onSuccess(ScoreResponse scoreResponse) {
        handleResponse(scoreResponse, afterError);
      }

      @Override
      public void onError(Exception e) {
        Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"User not verified message from calculateUserScore",Toast.LENGTH_LONG).show();
        promised.reject(null,"Solus workflow failed : User not verified");
      }
    });
  }

  public void handleResponse(ScoreResponse response, boolean isAfterError) {
    if (!isAfterError) {
      DbUserController.saveUser(userData.getUsername());
      Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Verification done successfully",Toast.LENGTH_LONG).show();
      promised.resolve("Verification completed");
    } else {
      Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Sorry. Not verified.",Toast.LENGTH_LONG).show();
      promised.reject(null,"Solus workflow failed : User not verified");
    }
  }

  public int tryToParseSCExceptionCode(Throwable throwable) {
    if (throwable instanceof ApiErrorException) {
      return ((ApiErrorException) throwable).getErrorCode();
    }

    return -1;
  }

  IWorkflowProccessListener workflowProccessListener = new IWorkflowProccessListener() {
    @Override
    public void onWorkflowError(Throwable throwable, String workflow, String s1 ) {
      throwable.printStackTrace();
      WorkflowType workflowType = WorkflowType.fromKey(workflow);
      final String errorMessage = tryParseSCExceptionMessage(throwable);
      if (throwable instanceof WorkflowFailedException) {
        calculateUserScore(true);
        return;
      }

      if (workflowType != null) {
        switch (workflowType) {
          case ENROL:
            String error = "";

            if (tryToParseSCExceptionCode(throwable) == ApiErrorCode.USER_ALREADY_ENROLLED) {
              error = "User is already enrolled. De-enroll first";
            } else if (TextUtils.isEmpty(error)) {
              if (throwable instanceof NoConnectionError)
                if (throwable.getCause() instanceof SSLHandshakeException)
                  error = throwable.getCause().getMessage();
                else
                  error = "No Internet Connection";
              else if (throwable instanceof ServerError)
                error = "Server Error";
              else
                error = "Sorry,Not Verified";
            }
//                            Log.e("+++++++++++++++", "Solus workflow failed with :"+error );
            Toast.makeText(SolusModule.this.getCurrentActivity(),"Solus workflow failed with : " + error,Toast.LENGTH_LONG).show();
//                            txtErrorMessage.setText("Solus workflow failed with : " + error);
            promised.reject(null,"Solus workflow failed with : "+error);
            return;

          case AUTH:
          case REMOVE:
            if (tryToParseSCExceptionCode(throwable) == ApiErrorCode.USER_NOT_ENROLLED) {
              Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Solus workflow failed with : user_not_enrolled_on_this_device " ,Toast.LENGTH_LONG).show();
//                                txtErrorMessage.setText("Solus workflow failed with : " + getString(R.string.error_user_not_enrolled_on_this_device));
              promised.reject(null,"Solus workflow failed with : user_not_enrolled_on_this_device");
              return;
            }
            break;
          case STEPUP:
            promised.reject(null,"Solus workflow failed");
            return;
          case STEPUP_ELEVATED:
            promised.reject(null,"Solus workflow failed");
            return;
        }
      }

      String message = errorMessage;
      if (TextUtils.isEmpty(message)) {
        if (throwable instanceof ServerError)
          message = "Server Error";
        else if (throwable instanceof JsonParserException)
          message = "Invalid Json";
        else if (throwable instanceof NoConnectionError)
          if (throwable.getCause() instanceof SSLHandshakeException)
            message = throwable.getCause().getMessage();
          else
            message ="No Internet Connection";
        else
          message = throwable.getMessage();
      }
//                mIntegrationApiManager.cancelAllRequests(this.getApplicationContext());
    }

    @Override
    public void onConfigLoaded(SolusConfig solusConfig) {

    }

    @Override
    public void onWorkflowAbort(String s, String s1) {

      promised.reject(null,"Process Abort");
      Log.e("workflow abort", "workflowabort");
    }

    @Override
    public void onContinueEnroll(String s, PendingTask pendingTask) {
      WorkflowType workflowType = WorkflowType.fromKey(s);
      performPendingActivity(workflowType, pendingTask);
    }

    @Override
    public void onWorkflowCompleted(String workflow, String username, boolean isDeviceBased) {
      WorkflowType workflowType = WorkflowType.fromKey(workflow);

      switch (workflowType) {
        case ENROL:
        case AUTH:
        case STEPUP:
        case STEPUP_ELEVATED:
          if (isDeviceBased) {
            calculateUserScore(false);
          } else {
            handleResponse(null, false);
          }
          break;
        case REMOVE:
            deleteZoomUser();
          break;
      }
      Toast.makeText(SolusModule.this.getCurrentActivity(),"Process Completed: "+workflowType,Toast.LENGTH_LONG).show();
      promised.resolve("Process Completed: "+workflowType);
    }
  };

  public void performPendingActivity(WorkflowType workflowType, final PendingTask task) {
    final String activity = task.getCode();

    if (TextUtils.isEmpty(activity)) {
      Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Error! No suitable pending activities on enroll",Toast.LENGTH_LONG).show();
//            txtErrorMessage.setText("Error! No suitable pending activities on enroll");
      return;
    }

    switch (activity) {
      case PendingActivity.CODE_VALIDATEENROLCODE:
      case PendingActivity.CODE_LOCATION:
      case PendingActivity.CODE_NOTIFICATIONPUSHID:
      case PendingActivity.CODE_APPVERSION:
      case PendingActivity.CODE_DEVICE:
      case PendingActivity.CODE_DEVICE_CAP:
      case PendingActivity.CODE_PASSWORD:
      case PendingActivity.CODE_DELETEEVUSER:
      case PendingActivity.CODE_DYNAMICPIN:
      case PendingActivity.CODE_ENROLL_ZOOM_SECRET:
      case PendingActivity.CODE_VALIDATE_ZOOM_SECRET:
        AuthProcessor authProcessor;

        try {
          authProcessor = new PendingActivityProcessor(this.getCurrentActivity(),userData, workflowType, task.getCode(), mAuthResultCallback,promised);
          mActiveAuthProcessor = authProcessor;
          authProcessor.doAuthOperation();
        } catch (Exception error) {
          error.printStackTrace();
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Error! No suitable pending activities on enroll",Toast.LENGTH_LONG).show();
//                    txtErrorMessage.setText("Error! No suitable pending activities on enroll");
        }
        break;

      default:
        Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Error! No suitable pending activities on enroll",Toast.LENGTH_LONG).show();
//                txtErrorMessage.setText("Error! No suitable pending activities on enroll");
        break;
    }
  }

  private final AuthResultCallback mAuthResultCallback = new AuthResultCallback() {
    @Override
    public void onAuthSuccess(/*AuthProcessor authProcessor,*/ AuthResult authResult) {
      Log.e("onauth result", "success");
      continueWorkflowProcess(authResult.getProcessorKey(), authResult.toString());
    }

    @Override
    public void onAuthError(/*AuthProcessor authProcessor,*/String message, Throwable throwable) {
      throwable.printStackTrace();
      Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),""+message,Toast.LENGTH_LONG).show();
//            txtErrorMessage.setText(message);
      if (message.contains("An enrollment already exists for this enrollmentIdentifier.")) {
      } else {
      }
      Log.e("onauth error", "auth error");

      doCancelWorkflow();
    }


    @Override
    public void processingMessage(String message) {
      Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),""+message,Toast.LENGTH_LONG).show();
    }

    private void continueWorkflowProcess(String activity, String data) {

      mIntegrationApiManager.processActivityData(SolusModule.this.getCurrentActivity(), activity, data);
    }

    private void doCancelWorkflow() {

      mIntegrationApiManager.cancelWorkflow(SolusModule.this.getCurrentActivity());
    }
  };

  private void deleteZoomUser() {
    SolusPrefManager.getInstance(getCurrentActivity().getApplicationContext()).saveUserIdForZoom("");
    SolusPrefManager.getInstance(getCurrentActivity().getApplicationContext()).saveUserUUIDForZoom("");
    deleteDlockUser();
    deleteLocalSavedUser();
/*
        ZoomManagedSession.deleteExistingUser(getApplicationContext(), SolusConstants.get(SolusConstants.ZOOM_DEV_KEY),
                BaseZoomProcessor.baseURLNew, userData.getUsername().replace(".", "_"), new ZoomManagedSession.DeleteUserCallback() {
                    @Override
                    public void onResult(boolean isDeleted) {
                        if (isDeleted) {
                            txtErrorMessage.setText("User deleted from facetec");
                            deleteDlockUser();
                            deleteLocalSavedUser();
                        } else {
                            txtErrorMessage.setText("Failed to delete user from facetec");
                        }
                    }
                });
*/
  }

  private void deleteLocalSavedUser() {
    DbUserController.deleteUser(userData.getUsername());
    Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"User Removed Successfully",Toast.LENGTH_LONG).show();

  }

  private void deleteDlockUser() {
    DlockManager.getInstance(getCurrentActivity().getApplicationContext())
      .setDlockListener(new DlockProcessListener() {
        @Override
        public void onDlockProcessFailed(DlockOperation dlockOperation, Throwable throwable) {
//          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Dlock operation failed",Toast.LENGTH_LONG).show();
        }

        @Override
        public void onDlockProcessSucess(DlockOperation dlockOperation, String s) {
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"User deleted from dlock success",Toast.LENGTH_LONG).show();
        }

        @Override
        public void onDlockProcessCanceled(DlockOperation dlockOperation) {
          Toast.makeText(com.reactnativesolus.SolusModule.this.getCurrentActivity(),"Dlock operation canceled",Toast.LENGTH_LONG).show();
        }
      });
    DlockManager.getInstance(getCurrentActivity().getApplicationContext()).removeUser(getCurrentActivity().getApplicationContext(), userData.getUsername());
  }
}
