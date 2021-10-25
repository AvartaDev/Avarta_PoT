#import "Rnsolus.h"
//#import "Frameworks/FaceTecSDK.framework/Headers/FaceTecSDK.h"
#import <FaceTecSDK/FaceTecSDK.h>
#import <SolusIntegrationLibrary/SOLUSIntegrationLibrary.h>
//#import "Frameworks/SolusIntegrationLibrary.framework/Headers/SOLUSIntegrationLibrary.h"
#import <SolusIntegrationLibrary/SOLUSLibrarySettings.h>
//#import "Frameworks/SolusIntegrationLibrary.framework/Headers/SOLUSLibrarySettings.h"
#import <Solus_DLock_SDK/Solus_DLock_SDK.h>
//#include "Frameworks/Solus_DLock_SDK.framework/Headers/Solus_DLock_SDK.h"
#import <Solus_DLock_SDK/SolusDlock.h>
//#import "Frameworks/Solus_DLock_SDK.framework/Headers/SolusDlock.h"
#import "SOLUSBSManager.h"
#import "SOLUSInAuthManager.h"
#import <Foundation/Foundation.h>
#import "SOLUSNetworkManager.h"
#import "SOLUSStorageModel.h"

typedef void (^Completion)(NSString* token);

@interface Solus ()<SOLUSIntegrationLibraryDelegate,FaceTecFaceScanProcessorDelegate,SolusDlockDelegate>{
  

  BOOL isAuth;
  float uploadProgress;
  
}


@property (nonatomic, strong, nonnull) SOLUSIntegrationLibrary *library;
@property (nonnull, nonatomic, strong) SOLUSInAuthManager *inAuthManager;
@property ( nonatomic) SolusWorkflowType currentWorkflowType;
@property (nonatomic, strong, nonnull) SolusDlock *solusDlock;
@property (nonatomic) SolusActivities currentActivity;
@property (nonnull, nonatomic, strong) SOLUSBSManager *behaviosecManager;


@property (nonnull, nonatomic, strong) NSString *currentUsername;
@property (nonnull, nonatomic, strong) NSString *currentPassword;
@property(nonnull,strong) NSURLSessionDataTask *latestNetworkRequest;
@property (nonatomic, nonnull, strong) SOLUSStorageModel *storage;


@end

@implementation Solus


RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(onCreate:(NSString *)DeviceKeyIdentifier FaceScanEncryptionKey:(NSString *)FaceScanEncryptionKey ServerUrl:(NSString *)ServerUrl orgID:(NSString *)orgID)
{
  {
    self.library = [[SOLUSIntegrationLibrary alloc] initWithOrganizationId:orgID andBaseUrl:[NSURL URLWithString:ServerUrl] andApplicationCode:@"BANKINGAPP"];
        
    self.inAuthManager = [[SOLUSInAuthManager alloc] initWithBaseURL:ServerUrl andOrganizationKey:orgID];

    self.library.delegate = self;
    self.solusDlock = [[SolusDlock alloc] init];
    self.solusDlock.delegate = self;
    
    self.behaviosecManager = [[SOLUSBSManager alloc] init];
    NSLog(@"key --- %@",DeviceKeyIdentifier);
    NSLog(@"%@",FaceScanEncryptionKey);
    
    [FaceTec.sdk initializeInDevelopmentMode:DeviceKeyIdentifier faceScanEncryptionKey:FaceScanEncryptionKey completion:^(BOOL result) {
      NSLog(result ? @"Yes" : @"No");
      
    }];
    
  }
}

RCT_EXPORT_METHOD(EnrollProcess:(NSString *)name pwd:(NSString *)password ){
  self.currentUsername = name;
  self.currentPassword = password;
  [self EnrollProcess];
}

RCT_EXPORT_METHOD(DeEnrollProcess:(NSString *)name pwd:(NSString *)password ){
  self.currentUsername = name;
  self.currentPassword = password;
  [self DeEnrollProcess];
}

RCT_EXPORT_METHOD(AuthenticationProcess:(NSString *)name pwd:(NSString *)password ){
  self.currentUsername = name;
  self.currentPassword = password;
  [self SignInProcess];
}


-(void)DeEnrollProcess {
  self.currentWorkflowType = SolusDeleteWorkflow;
  [self.library initialize];
  [self deleteUserWithUsername:self.currentUsername andCompletion:^(NSError * _Nullable error, BOOL deleted) {
    [self showALert:@"De Enroll User successfully"];
   }];
}


-(void)EnrollProcess{
  self.currentWorkflowType  = SolusEnrollWorkflow;
  [self.library initialize];
}

-(void)SignInProcess{
  self.currentWorkflowType  = SolusVerifyWorkflow;
  [self.library initialize];
}


#pragma mark - FaceTec Methods....

-(void)StartZoomEnrollment{
  
  isAuth = NO;
  [self getSessionToken:^(NSString *token) {
      if (![token isEqualToString:@""]) {
          dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController  *faceTecVc = [[FaceTec sdk] createSessionVCWithFaceScanProcessor:self sessionToken:token];
            UIViewController * vcObj = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
            [vcObj presentViewController:faceTecVc animated:YES completion:nil];
          });
      }
  }];
}

-(void)StartZoomVerification {
  isAuth = YES;
  [self getSessionToken:^(NSString *token) {
      if (![token isEqualToString:@""]) {
          dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController  *faceTecVc = [[FaceTec sdk] createSessionVCWithFaceScanProcessor:self sessionToken:token];
            UIViewController * vcObj = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
            [vcObj presentViewController:faceTecVc animated:YES completion:nil];
          });
      }
  }];
}

-(NSString*)getDate {
    NSDateFormatter *dateFormatter=[[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"dd-MM-YYYY-hh-mm-ss"];
    return [dateFormatter stringFromDate:[NSDate date]];
}

- (void)processSessionWhileFaceTecSDKWaits:(id<FaceTecSessionResult> _Nonnull)sessionResult faceScanResultCallback:(id<FaceTecFaceScanResultCallback> _Nonnull)faceScanResultCallback {
    if (sessionResult.status != FaceTecSessionStatusSessionCompletedSuccessfully) {
        if (self.latestNetworkRequest != nil) {
            [self.latestNetworkRequest cancel];
        }

        [faceScanResultCallback onFaceScanResultCancel];
        [self faceTecCancelWithErrorHandle:sessionResult];
        return;
    }

    self->uploadProgress = 0.0;
    NSString *externalDatabaseRefID = @"";
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];

    if (isAuth) {
        externalDatabaseRefID = [userDefaults objectForKey:@"externalDatabaseRefID"];
    } else {
        externalDatabaseRefID = [NSString stringWithFormat:@"%@-%@", self.currentUsername,[self getDate]];
        [userDefaults setObject:externalDatabaseRefID
                         forKey:@"externalDatabaseRefID"];
        [userDefaults synchronize];
    }

    NSDictionary *params = @{ @"faceScan": sessionResult.faceScanBase64, @"auditTrailImage": sessionResult.auditTrailCompressedBase64[0], @"lowQualityAuditTrailImage": sessionResult.lowQualityAuditTrailCompressedBase64[0], @"externalDatabaseRefID": externalDatabaseRefID };

    NSError *error;
    NSURL *url;

    if (isAuth) {
        url = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", kZoomBaseURL, kZoomAuth]];
    } else {
        url = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", kZoomBaseURL, kZoomEnrollment]];
    }
    

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                       timeoutInterval:60.0];

    [request setHTTPMethod:@"POST"];
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];

    NSData *postData = [NSJSONSerialization dataWithJSONObject:params options:0 error:&error];
    [request setHTTPBody:postData];

    [request addValue:@"dO0FSfPMW7eAhYqLcFWbU24lhpl1fW0R" forHTTPHeaderField:@"X-Device-Key"];
    [request addValue:[FaceTec.sdk createFaceTecAPIUserAgentString:sessionResult.sessionId]  forHTTPHeaderField:@"User-Agent"];

    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];

    self.latestNetworkRequest = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (data == nil) {
            [faceScanResultCallback onFaceScanResultCancel];
            [self faceTecCancelWithErrorHandle:sessionResult];
            return;
        }

        NSError *err = nil;
        NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&err];

        if (jsonResponse == nil) {
            [faceScanResultCallback onFaceScanResultCancel];
            [self faceTecCancelWithErrorHandle:sessionResult];
            return;
        }

        NSString *scanResultBlob = [jsonResponse objectForKey:@"scanResultBlob"];
        BOOL wasProcessed = [[jsonResponse objectForKey:@"wasProcessed"] boolValue];

        if (wasProcessed) {
            if (self->isAuth) {
                [FaceTecCustomization setOverrideResultScreenSuccessMessage:@"Authenticated"];
            } else {
                [FaceTecCustomization setOverrideResultScreenSuccessMessage:@"Enrollment\nConfirmed"];
            }

            [faceScanResultCallback onFaceScanResultProceedToNextStep:scanResultBlob];

            NSString *secret = nil;
            
            if (self->isAuth) {
                secret = [self.storage perUserSecretForUsername:self.currentUsername];
            } else {
                secret = [self generateUserId];
                [self.storage storePerUserSecret:secret forUsername:self.currentUsername];
            }
            
            double delayInSeconds = 3.0;
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
              
              UIViewController * vcObj = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
              
                [vcObj dismissViewControllerAnimated:YES completion:^{
                  [self authenticationCompleted:sessionResult.faceScan authString:secret sessionId:sessionResult.sessionId withLivenessScore:1.0 livenessResult:1.0];
                }];
            });

        } else {
            [faceScanResultCallback onFaceScanResultCancel];
            [self faceTecCancelWithErrorHandle:sessionResult];
            return;
        }
    }];

    [self.latestNetworkRequest resume];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 6 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        if (self.latestNetworkRequest.state == NSURLSessionTaskStateCompleted) {
            NSLog(@"NSURLSessionTaskStateCompleted");
            return;
        }
//        [faceScanResultCallback onFaceScanUploadMessageOverride:[[NSMutableAttributedString alloc] initWithString:@"Still Uploading..."]];
//
        [faceScanResultCallback onFaceScanUploadProgress:self->uploadProgress];
    });
}

- (void)onFaceTecSDKCompletelyDone {
  
}

-(void)onProcessingComplete:(BOOL *)isSuccess zoomSessionResult:(id)FaceTecSessionResult {
  
}

-(NSString*)generateUserId;
{
    return [NSUUID UUID].UUIDString;
}


-(void)authenticationCompleted:(nonnull NSData*)authData authString:(NSString *)authString sessionId:(NSString *)sessionId withLivenessScore:(float)zoomLivenessScore livenessResult:(float)livenessResult
{
  if(self.inAuthManager) {
    [self processZoomData:authString zoomLivenessScore:[NSNumber numberWithInteger:1] description:1];
  }else{
    [self processZoomData:authString zoomLivenessScore:[NSNumber numberWithInteger:1.0 ] description:1.0];
  }
}

-(void)processZoomData:(nullable NSString*)data zoomLivenessScore:(NSNumber*)zoomLivenessScore description:(float)description
{
    NSString *strLinenessResult = (description == 0 ? @"Undetermined" : @"Alive");
        
    if(data){
        NSDictionary *zoom = @{@"ZOOM" : @{@"Secret": data, @"Description" : strLinenessResult, @"Liveness" : zoomLivenessScore}};
        NSError *error;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:zoom options:NSJSONWritingPrettyPrinted error:&error];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        [self.library processStringData:jsonString forActivity:self.currentActivity];
                
    }else{
        [self.library processStringData:data forActivity:self.currentActivity];
    }
}




- (void)          URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
             didSendBodyData:(int64_t)bytesSent
              totalBytesSent:(int64_t)totalBytesSent
    totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend {
    
    uploadProgress = (float)totalBytesSent / (float)totalBytesExpectedToSend;
}

-(void)faceTecCancelWithErrorHandle :(id<FaceTecSessionResult> _Nonnull)sessionResult {
    
    NSString *strStatus = [FaceTec.sdk descriptionForSessionStatus:sessionResult.status];
    

    NSError *err =  [NSError errorWithDomain:@"SolusBankApp" code:1 userInfo:@{ NSURLLocalizedTypeDescriptionKey: strStatus }];
}


-(void)deleteUserWithUsername:(NSString*)username andCompletion:(nullable void (^)(NSError * _Nullable error, BOOL deleted))completionBlock {
  NSString *endpoint = [NSString stringWithFormat:@"/enrollment/%@",username];
  // Vanilla request to check enrollment
  NSDictionary *dct = [NSDictionary dictionaryWithObject:username forKey:@"enrollmentIdentifier"];
  NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@",kZoomBaseURL,endpoint]];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
  request.HTTPMethod = @"DELETE";
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dct
                      options:(NSJSONWritingOptions) 0
                      error:&error];

  [request setHTTPBody:jsonData];


  [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request addValue:@"dO0FSfPMW7eAhYqLcFWbU24lhpl1fW0R" forHTTPHeaderField:@"X-Device-License-Key"];
  NSString *sessionId = @"nil";

  [request addValue:[FaceTec.sdk createFaceTecAPIUserAgentString:sessionId]  forHTTPHeaderField:@"User-Agent"];

  NSURLSession *session = [NSURLSession sessionWithConfiguration:NSURLSessionConfiguration.defaultSessionConfiguration delegate:self delegateQueue:[NSOperationQueue mainQueue]];

  NSURLSessionDataTask *tokenNetworkRequest = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error){
                                                       if(error)
                   {
                     completionBlock(error, NO);
                   }
                                                       else{
                     NSError* error;
                     NSDictionary* json = [NSJSONSerialization JSONObjectWithData:data
                                           options:kNilOptions
                                           error:&error];

                     completionBlock(nil, [self checkMeta:json]);
                   }
                 }];
  [tokenNetworkRequest resume];

}

-(BOOL)checkMeta:(NSDictionary *)result{
    NSDictionary *meta = result[@"meta"];
    BOOL ok = [meta[@"ok"] boolValue];
    return ok;
}


-(void)getSessionToken:(Completion)block {
    
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", kZoomBaseURL,KZoomGetSessionToken]];

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                       timeoutInterval:60.0];

    [request setHTTPMethod:@"GET"];
    [request addValue:@"dO0FSfPMW7eAhYqLcFWbU24lhpl1fW0R" forHTTPHeaderField:@"X-Device-Key"];
    [request addValue:[FaceTec.sdk createFaceTecAPIUserAgentString:@""]  forHTTPHeaderField:@"User-Agent"];

    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];

    NSURLSessionDataTask *tokenNetworkRequest = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (data == nil) {
            NSLog(@"Exception raised while attempting HTTPS call.");
            if (block) block(@"");
            return;
        }

        NSError *err = nil;
        NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&err];
        
        if (block) block(jsonResponse[@"sessionToken"]);
    }];
    
    [tokenNetworkRequest resume];
}



#pragma mark - Solus integration library

-(void)solusIntegrationLibrary:(SOLUSIntegrationLibrary *)library loadedWithSettings:(SOLUSLibrarySettings *)librarySettings
{
  
  if(self.currentWorkflowType  ==  SolusEnrollWorkflow) {
    [self.library startWorkflowWithUserName:self.currentUsername checkStatus:NO andType:SolusEnrollWorkflow workflowKey:nil];
    [self startInauthProcessWithUserName:self.currentUsername];

  }else if(self.currentWorkflowType == SolusVerifyWorkflow) {
    [self.library startWorkflowWithUserName:self.currentUsername checkStatus:YES andType:SolusVerifyWorkflow workflowKey:nil];
    [self inauthSendLogs:self.currentUsername];
  }
  else {
    [self.library startWorkflowWithUserName:self.currentUsername checkStatus:NO andType:SolusDeleteWorkflow workflowKey:nil];
    [self inauthSendLogs:self.currentUsername];
  }
}

-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library requredUserDataForActivity:(SolusActivities)activity
{

    self.currentActivity = activity;
    if(activity == ActivityEnrollZoom){
      [self StartZoomEnrollment];
    }else if(activity == ActivityValidateZoom){
      [self StartZoomVerification];
    }else if(activity  == ActivityDynamicPin){

      if(self.currentWorkflowType == SolusEnrollWorkflow)
      {
        UIViewController * vcObj = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        
        [self.solusDlock registerUserWithUsername:self.currentUsername pinLength:4 viewController:vcObj];
      }
      else
      {
        UIViewController * vcObj = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        
        [self.solusDlock verifyUserWithUsername:self.currentUsername viewController:vcObj];
      }
        
   }
   else if(activity  == ActivityPassword ){

      if(self.currentWorkflowType == SolusDeleteWorkflow){
        [self.library processStringData:self.currentPassword forActivity:activity];
      }
      else {
        [self updateBehaviosecDataWithSummary:[self.behaviosecManager getSummaryAndClearRegistration]];
        [self.behaviosecManager stopMotionDetect];
      }
    }
    else if( activity == ActivityDeviceCap ){
        NSString *data = [self devicecap];
        [self.library processStringData:data forActivity:activity];
    }else{
        [self.library processStringData:[self dataForActivity:activity] forActivity:activity];
    }
}

-(void)updateBehaviosecDataWithSummary :(NSString*)summury {
  
  [self.library behaviosecRegisterWithUsername:self.currentUsername workflowType:self.currentWorkflowType summary:summury andCompletion:^(NSError * _Nullable error, SOLUSBehavioSecModel * _Nullable model) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [self.library processStringData:self.currentPassword forActivity:ActivityPassword];
    });
    
  }];
}


-(NSString*)devicecap
{
    NSDictionary *deviceCap = @{@"DEVICECAP" : @{@"Manufacturer":@"Apple", @"Model":@"iPhone", @"Capabilities":@{@"Zoom":@(true), @"EV":@(false)}}};
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:deviceCap options:NSJSONWritingPrettyPrinted error:&error];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    return jsonString;
    return @"";
}

-(NSString*)dataForActivity:(SolusActivities)activity
{
  NSString *data = @"";
  if(activity == ActivityDevice ) {
    data = @"currentDeviceIdentifier";
  }else if(activity ==  ActivityGeolocation) {
    data = @"LAT12.32:LON34.34";
  }else if(activity  == ActivityVersion) {
    data = @"BankDemo:2.3.1";
  }else if(activity  == ActivityDelete) {
    data = @"Complete";
  }else if(activity  ==ActivityPassword) {
    data = self.currentPassword;
  }else if(activity  == ActivityPush ) {
    data = @"IOS:123123123123";
  }
  return data;
}

-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library failedWithError:(nonnull NSError*)error
{
  NSLog(@"Solus Workflow failed with error :%@",error.localizedDescription);
  [self showALert:[NSString stringWithFormat:@"Solus Workflow failed with error :%@",error.localizedDescription]];
}

-(void)solusIntegrationLibrary:(SOLUSIntegrationLibrary *)library workflowCompleted:(SolusWorkflowType)workflowType deviceBased:(BOOL)deviceBased withFullName:(NSString *)fullName
{
  NSLog(@"Workflow completed successfully");
  [self showALert:@"Workflow completed successfully"];
}

-(void)solusIntegrationLibrary:(SOLUSIntegrationLibrary *)library workflowCanceled:(SolusWorkflowType)workflowType
{
  NSLog(@"Workflow cancelled");
  [self showALert:@"Workflow cancelled"];
}

#pragma mark - Dlock Methods...

- (void)solusDlock:(nonnull SolusDlock*)sender registerCompletedWithHash:(nonnull NSString*)pinHash {
  [self.library processStringData:pinHash forActivity:self.currentActivity];
  NSLog(@"Solus D Lock-- register success");
}

- (void)solusDlock:(nonnull SolusDlock*)sender verificationCompletedWithHash:(nonnull NSString*)pinHash {
  [self.library processStringData:pinHash forActivity:self.currentActivity];
  NSLog(@"Solus D Lock-- Verification success");
}

- (void)solusDlock:(nonnull SolusDlock*)sender didFailWithError:(nonnull NSError*)error {
  NSLog(@"Solus D Lock-- Failed with error:%@",error.localizedDescription);
}

- (void)solusDlock:(nonnull SolusDlock*)sender userRemovedSuccessFully:(nonnull NSString*)userName {
  NSLog(@"Solus D Lock-- user removed");
}

#pragma mark - IN auth Methods...

-(void)startInauthProcessWithUserName:(NSString*)userName
{
    NSString *permId = [[NSUserDefaults standardUserDefaults] objectForKey:@"PerID"];
    if(permId){
        [self inauthSendLogs:userName];
    }else{
        [self inauthRegisterWithUsername:userName];
    }
}

-(void)inauthRegisterWithUsername:(NSString*)userName
{
    [self.inAuthManager registerDeviceWithCompletion:^(NSError * _Nullable error, NSDictionary *_Nullable info) {
        if(!error){
            NSString *permId = info[@"permanentId"];
            [self.library registerInAuthWithUsername:userName permanentID:permId andCompletionBlock:^(NSError * _Nullable error, NSDictionary * _Nullable result) {
                if(!error){
                  [[NSUserDefaults standardUserDefaults]setValue:permId forKey:@"PerID"];
                  [[NSUserDefaults standardUserDefaults]synchronize];
                    [self inauthSendLogs:userName];
                }
            }];
        }
    }];
}

-(void)inauthSendLogs:(NSString*)username
{
  if(self.inAuthManager.isRegistered) {
    [self.inAuthManager sendLogsForDevice:^(NSError * _Nullable error, NSDictionary *_Nullable logItem) {
             if(!error) {
         if(logItem) {
           NSMutableDictionary *dctLogItems = [logItem mutableCopy];
           [dctLogItems setObject:username forKey:@"UserName"];
           [self.library sendInAuthLogs:dctLogItems withCompletionBlock:nil];
         }
         else{
           [self.library sendInAuthLogs:logItem withCompletionBlock:nil];
         }
       }
     }];
  }
}


- (void)showALert:(NSString*)msg
{
  
  
  UIAlertController * alert = [UIAlertController
                               alertControllerWithTitle:@"SolusDemo"
                               message:msg
                               preferredStyle:UIAlertControllerStyleAlert];


  UIAlertAction* noButton = [UIAlertAction
                             actionWithTitle:@"Cancel"
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction * action) {
                                     //Handle no, thanks button
           }];

  //Add your buttons to alert controller

  [alert addAction:noButton];

  UIViewController * vcObj = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

  [vcObj presentViewController:alert animated:YES completion:nil];
}




@end
