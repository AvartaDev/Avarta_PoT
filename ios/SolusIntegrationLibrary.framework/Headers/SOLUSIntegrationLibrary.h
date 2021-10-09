//
//  SOLUSIntegrationLibrary.h
//  Solus
//
//  Created by Dmitrii Babii on 28.07.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

/*!
 @header SOLUSIntegrationLibrary.h
 
 @brief header of solus integration library that contains workflow logic
 */

#import <Foundation/Foundation.h>

/*!
 @typedef solus activities
 @discussion list of activities which are received from SolusConnect API and should be performed to successful flow pass
 @constant ActivityUndefined is used for activities which don't described on current enum
 @constant ActivityEnrollZoom activity for biometric enrollment or verification using Zoom SDK
 @constant ActivityValidateZoom activity for biometric authentication or verification using Zoom SDK
 @constant ActivityDynamicPin activity for pin authorization or verification using Solus Dlock SDK
 @constant ActivityDevice activity for device identifier
 @constant ActivityPush activity for push notifications register
 @constant ActivityGeolocation activity for current geolocation
 @constant ActivityPassword activity for password
 @constant ActivityVersion activity for current SDK version
 @constant ActivityDeviceCap activity for device capabilities
 @constant ActivityDelete activity for user remove
 @constant ActivityValidateEnrolCode activity for enrollmenr code
*/

typedef NS_ENUM(NSUInteger, SolusActivities) {
    ActivityUndefined,
    ActivityEnrollZoom,
    ActivityValidateZoom,
    ActivityDynamicPin,
    ActivityDevice,
    ActivityPush,
    ActivityGeolocation,
    ActivityPassword,
    ActivityVersion,
    ActivityDeviceCap,
    ActivityDelete,
    ActivityValidateEnrolCode,
};

/*!
 @typedef solus workflow types
 @discussion types of Solus connect workflows supported by lintegration library
 @constant SolusEnrollWorkflow enrolment type workflow where user submitted data is being captured for future authentication use.
 @constant SolusVerifyWorkflow authentication type workflow where user submitted data is being compared with existing data held in the database.
 @constant SolusDeleteWorkflow remove user workflow
 @constant SolusStepUpWorkflow authentication type workflow with biometric data
 */

typedef NS_ENUM(NSUInteger, SolusWorkflowType) {
    SolusEnrollWorkflow,
    SolusVerifyWorkflow,
    SolusStepUpWorkflow,
    SolusDeleteWorkflow,
    SolusStepUpElevatedWorkflow
};

/*!
 @typedef solus error codes
 @brief error codes of integration library
 @discussion describes codes for common errors that can appear during workflow process
 @constant ERR_WRONG_PASSWORD user entered wrong password
 @constant ERR_WORKFLOW_INSTANCE_NOT_FOUND can't find started workflow for this user and organization key on server
 @constant ERR_NO_AUTHENTICATION_REQUEST can't find authentication workflow request
 @constant ERR_NO_ENROLL_REQUEST can't find enroll workflow request
 @constant ERR_USER_NOT_ENROLLED_ON_DEVICE user is not enrolled on device
 @constant ERR_USER_NOT_FOUND user record is not found on server
 @constant ERR_USER_NOT_ENROLLED_ON_SERVER user is not enrolled on server
 @constant ERR_USER_NOT_ENROLLED failed to enroll user
 @constant ERR_USER_NOT_VERIFIED failed to verify user
 */

typedef NS_ENUM(NSUInteger, SolusErrorCode) {
    ERR_WRONG_PASSWORD = 10007,
    ERR_WORKFLOW_INSTANCE_NOT_FOUND = 10008,
    ERR_NO_AUTHENTICATION_REQUEST = 10009,
    ERR_NO_ENROLL_REQUEST = 10010,
    ERR_USER_NOT_ENROLLED_ON_DEVICE = 10011,
    ERR_USER_NOT_FOUND = 10012,
    ERR_USER_NOT_ENROLLED_ON_SERVER = 10014,
    ERR_USER_NOT_ENROLLED = 10015,
    ERR_USER_NOT_VERIFIED = 10016
};


@class SOLUSIntegrationLibrary;
@class SOLUSLibrarySettings;
@class SOLUSBehavioSecModel;
@class SOLUSUserScore;
/*!
 
 @protocol SOLUSIntegrationLibraryDelegate
 @discussion used for handling events from Intergation library
 
 */
@protocol SOLUSIntegrationLibraryDelegate <NSObject>

/*!
 
 
 
 */

-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library loadedWithSettings:(nonnull SOLUSLibrarySettings*)librarySettings;

/*!

 @brief data required to perform activity
 @discussion implement this method of delegate to get notification from integration library that activity which is currently performing requires data to complete
 @param library instance of SOLUSIntegrationLibrary which called this delegate method
 @param activity activity that currently performing and required data to complete

 
 */
-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library requredUserDataForActivity:(SolusActivities)activity;
/*!
 
 @brief workflow failed with error
 @discussion implement this method of delegate to handle errors which may be occured during workflow process
 @param library instance of SOLUSIntegrationLibrary which called this delegate method
 @param error code and description of error which is occured during workflow process

 */
-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library failedWithError:(nonnull NSError*)error;
/*!
 
 @brief workflow successfully completed
 @discussion implement this method of delegate to handle successful workflow completion
 @param library instance of SOLUSIntegrationLibrary which called this delegate method
 @param type type of workflow which has been completed
 @param fullName full name of user which performed workflow process. Parameter is nil when formFactor equals FormFactorIntegration
 */

-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary *)library workflowCompleted:(SolusWorkflowType)type deviceBased:(BOOL)deviceBased withFullName:(nullable NSString*)fullName;

/*!
 @brief workflow successfully canceled
 @discussion implement this method of delegate to handle that workflow is cancelled successfully
 @param library instance of SOLUSIntegrationLibrary which called this delegate method
 @param type type of workflow which has been cancelled
 */

-(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary *)library workflowCanceled:(SolusWorkflowType)type;

@end


@interface SOLUSIntegrationLibrary : NSObject

/*!
    @property delegate
    @discussion delegate for class that confirmes SOLUSIntegrationLibraryDelegate protocol and will handles SOLUSIntegrationLibrary events
 */

@property (nonatomic, weak, nullable) id<SOLUSIntegrationLibraryDelegate> delegate;



/*!
 @property doCompressRequests
 @discussion Set this variable to TRUE for using compressed API requests
 */
@property (nonatomic)  bool doCompressRequests;



/*!
    @brief creates and setup instance of the SOLUSIntegrationLibrary
    @discussion This method accepts an organizationId  string and base Url server of to set up connection with Solus Connect API
    @param organizationId identifier of the organiation record
    @param url base url of solus connect instance
    @return SOLUSIntegrationLibrary object on success, nil on failure
 */

-(nullable instancetype)initWithOrganizationId:(nonnull NSString*)organizationId andBaseUrl:(nonnull NSURL*)url andApplicationCode:(nonnull NSString*)applicationCode;

/*!
    @brief initializes the SOLUSIntegrationLibrary object
    @discussion this method starts initialization and loaging process. On success delegate method -(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library loadedWithSettings:(nonnull SOLUSLibrarySettings*)librarySettings will be called.
 */

-(void)initialize;

/*!
    @discussion This method starts enrollment,verification or delete workflow. Workflow type is setted by parameter type
    @param userName username to register or login
    @param status used to check session status before workflow started. On device based workflows set it to NO;
    @param type type of the workflow that should be started
    @param workflowKey Custom workflow key used for specific workflows. Should be nil on default workflow.
 */

-(void)startWorkflowWithUserName:(nonnull NSString*)userName checkStatus:(BOOL)status andType:(SolusWorkflowType)type workflowKey:(nullable NSString*)workflowKey;
/*!
 @brief pass required user data to Integration library
 @discussion this method is used to pass user data for specific activity to Integration library which come in -(void)solusIntegrationLibrary:(nonnull SOLUSIntegrationLibrary*)library requredUserDataForActivity:(SolusActivities)activity withLibrarySettings:(nonnull SOLUSLibrarySettings*)librarySettings delegate method.
 @param data user data in string representation
 @param activity activity which is currently performing and requiring data
 */

-(void)processStringData:(nullable NSString*)data forActivity:(SolusActivities)activity;

/*!
 @brief cancels flow which is currenty performing
 @discussion this method is used to cancel performing of the current workflow. Cannot resume cancelled workflow only start from the beginning
 */
-(void)cancelFlow;
/*!
 @brief method to send behaviosec data to Solus Connect
 @discussion if behaviosec is supported use this for sending behaviosec summary for field and get statistic from behaviosec
 @param userName usename which is used in workflow
 @param type current workfow type 
 @param summary beaviosec summary gathered by call [behavioSec getSummary]
 @param completionBlock behaviosec register completion block
 */


-(void)behaviosecRegisterWithUsername:(nonnull NSString*)userName workflowType:(SolusWorkflowType)type summary:(nullable NSString*)summary andCompletion:(void(^ _Nullable)(NSError* _Nullable error, SOLUSBehavioSecModel* _Nullable model))completionBlock;
/*!
@brief calculate and get scores from API
@discussion send request to backend to calculate scores based on behaviosec, inauth, etc. and get calcualed scores in SOLUSUserScore instance in completion block
@param completionBlock block that called on completion and provides SOLUSUserScore model on success and NSError instance on error
*/
-(void)calculateUserScoresWithCompletion:(void(^ _Nullable)(NSError* _Nullable error, SOLUSUserScore* _Nullable model))completionBlock;
/*!
 @brief register InAuth SDK for user in Solus Connect API
 @discussion method used for register InAuth SDK with current user. Use this method after successfull InAuth registrer process.
 @param username - user name for current inauth registration
 @param permanentId - InAuth permanent id gotten after successfull InAuth register process
 @param completionBlock  - block executed on register completion
 */
-(void)registerInAuthWithUsername:(nonnull NSString*)username permanentID:(nonnull NSString*)permanentId andCompletionBlock:(nullable void (^)( NSError * _Nullable error, NSDictionary  * _Nullable  result))completionBlock;
/*!
  @brief send logs gathered by Inauth SDK to Solus Connect API
  @discussion method used for sending logs gathered by InAuth SDK to Solus Connect API. Use this method for register users after successfull InAuth send logs process
  @param logs -  response json of InAuth send logs API request.
  @param completionBlock  - block executed on send logs completion
 */
-(void)sendInAuthLogs:(nonnull NSDictionary*)logs withCompletionBlock:(nullable void (^)( NSError * _Nullable error, NSDictionary  * _Nullable  result))completionBlock;

/*!
    @brief change password wor username
    @discussion this method is used to change password for user. if doesn't start the workkflow process
    @param username username which password should be changed
    @param currentPassword current password
    @param newPassword new password
    @param completionBlock block that called on completion and provides error when something goes wrong
 */

-(void)changePasswordForUsername:(nonnull NSString*)username currentPassword:(nonnull NSString*)currentPassword newPassword:(nonnull NSString*)newPassword andCompletionBlock:(nullable void (^)(NSError * _Nullable error))completionBlock;

@end

/*!
 @class SOLUSBehavioSecModel
 @brief behaviosec data model
*/

@interface SOLUSBehavioSecModel : NSObject

/*!
 @property behaviorPolicy
 @discussion policy of registered field
 */
@property (nonatomic, nullable, strong) NSString *behaviorPolicy;
/*!
 @property behaviorScore
 @discussion score of registered field
 */
@property (nonatomic, nullable, strong) NSNumber *behaviorScore;
/*!
 @property behaviorConfidence
 @discussion confidence of registered field
 */
@property (nonatomic, nullable, strong) NSNumber *behaviorConfidence;

@end

/*!
 @class SOLUSUserScore
 @brief User score data model
 */
@interface SOLUSUserScore : NSObject

@property (nonatomic, strong, nullable) NSNumber *behaviosecScore;
@property (nonatomic, strong, nullable) NSNumber *behaviosecConfidence;
@property (nonatomic, strong, nullable) NSNumber *behaviosecAverageScore;
@property (nonatomic, strong, nullable) NSString *behaviosecProfile;
@property (nonatomic, strong, nullable) NSNumber *behaviosecScoreAge;
@property (nonatomic, strong, nullable) NSNumber *inAuthScore;
@property (nonatomic, strong, nullable) NSNumber *inAuthScoreAge;
@property (nonatomic, strong, nullable) NSNumber *workflowScore;
@property (nonatomic, strong, nullable) NSNumber *combinedScore;
@property (nonatomic, strong, nullable) NSString *dateCaptured;

@end

