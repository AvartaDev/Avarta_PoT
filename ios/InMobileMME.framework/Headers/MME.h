/*
 * Copyright © 2018 Accertify, Inc. All rights reserved.
 * The Accertify logo, and other trademarks, service marks, and designs are registered or unregistered
 * trademarks of Accertify, Inc. and its subsidiaries in the United States and in other countries.
 * All other trademarks are property of their respective owners.
 */

#import <Foundation/Foundation.h>
#import "InMobileTypes.h"
#import "InAuthenticateMessage.h"

NS_ASSUME_NONNULL_BEGIN

/**
  The version of the SDK as a NSString.
  The format is iOS-MME-<Build Flavor-><Bitcode Enabled-><Version Number>.
  Build Flavor can be FULL, STL (Stripped with Location) or ST (Stripped).
  If the build doesn’t have bitcode enabled it will not have “BITCODE” as part of the version.
 */
FOUNDATION_EXPORT NSString *const MME_SDK_VERSION;


/**
 The MME class is the core of the iOS SDK. It provides methods for assessing the security status of a device and preparing various logs that can be reported to a server. It also handles server responses.
 
 The MME API is designed to function synchronously.
 */
@interface MME : NSObject

- (instancetype) init __attribute__((unavailable("init not available")));

/**
 Initializes the `MME, MMEController, or InAuthenticate` object.
 
 Assumes the server_keys_message_*.json file containing keys created on the customer’s server and signed by Accertify are in the Copy Bundle Resources of the Xcode Build Phases.

 @param accountId The account GUID issued by Accertify to a customer.
 @param appId An application ID to differentiate between multiple client applications under the same account GUID. This is used as a secure seed.
 
 @return An `MME, MMEController, or InAuthenticate` object on success, or `nil` on failure.
 */
- (instancetype)initWithAccountId:(NSString *)accountId
                    applicationId:(NSString * _Nullable)appId;

/**
 Initializes the `MME, MMEController, or InAuthenticate` object.

 Assumes the server_keys_message_*.json file containing keys created on the customer’s server and signed by Accertify are in the Copy Bundle Resources of the Xcode Build Phases.

 @param accountId The account GUID issued by Accertify to a customer.
 @param appId An application ID to differentiate between multiple client applications under the same account GUID. This is used as a secure seed.
 @param adId An advertising ID generated using `ASIdentifierManager`.
 
 @return An `MME, MMEController, or InAuthenticate` object on success, or `nil` on failure.
 */
- (instancetype)initWithAccountId:(NSString *)accountId
                    applicationId:(NSString * _Nullable)appId
                    advertisingId:(NSString *)adId;

/**
 Initializes the `MME, MMEController, or InAuthenticate` object.

 @param accountId The account GUID issued by Accertify to a customer.
 @param appId An application ID to differentiate between multiple client applications under the same account GUID. This is used as a secure seed.
 @param jsonKeys A string representation of the JSON containing keys created on the customer’s server and then signed by Accertify.
 
 @return An `MME, MMEController, or InAuthenticate` object on success, or `nil` on failure.
 */
- (instancetype)initWithAccountId:(NSString *)accountId
                    applicationId:(NSString * _Nullable)appId
                      andJSONKeys:(NSData *)jsonKeys;

/**
 Initializes the `MME, MMEController, or InAuthenticate` object.

 @param accountId The account GUID issued by Accertify to a customer.
 @param appId An application ID to differentiate between multiple client applications under the same account GUID. This is used as a secure seed.
 @param adId An advertising ID generated using `ASIdentifierManager`.
 @param jsonKeys A string representation of the JSON containing keys created on the customer’s server and then signed by Accertify.
 
 @return An `MME, MMEController, or InAuthenticate` object on success, or `nil` on failure.
 */
- (instancetype)initWithAccountId:(NSString *)accountId
                    applicationId:(NSString * _Nullable)appId
                    advertisingId:(NSString * _Nullable)adId
                      andJSONKeys:(NSData * _Nullable)jsonKeys;

/**
 Determines whether or not the device is currently registered with the InMobile server.
 
 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
 @return `YES` if the device is registered with the InMobile server, or `NO` otherwise.
*/
- (BOOL)isRegistered:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Generates a registration `OpaqueObjectRef` payload to be sent to the server prior to any logs or requests. The server will respond with a registration response `OpaqueObjectRef` which should be passed to the `handlePayload` method to complete the registration process.

    @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
    @return A registration `OpaqueObjectRef` hex byte array to be sent to the server.
*/
- (OpaqueObjectRef)generateRegistrationPayload:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Generates a registration `OpaqueObjectRef` payload that can contain a user-defined custom log to be sent to the server prior to any logs or requests. The server will respond with a registration response `OpaqueObjectRef` which should be passed to the `handlePayload` method to complete the registration process.

    @param customLog An objective-c `NSDictionary` or swift dictionary containing custom data to log. The `customLog` parameter may be `nil`.
    @param outError The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
    @return A registration `OpaqueObjectRef` hex byte array to be sent to the server.
*/
- (OpaqueObjectRef)generateRegistrationPayloadWithCustomLog:(nullable NSDictionary *)customLog
                                                     onError:(NSError **)outError __attribute__((swift_error(nonnull_error)));

/**
    Generates an unregister `OpaqueObjectRef` payload to be sent to the server. The `unRegister` method also uninstalls the SDK from the filesystem. Further use of the SDK requires a new call to the `initWithAccountId` method.
    
    @return OpaqueObjectRef An unregister `OpaqueObjectRef` hex byte array to be sent to the server.
*/
- (OpaqueObjectRef)unRegister;

/**
    Generates a list request `OpaqueObjectRef` payload containing any combination of the values of `InMobileListSet`. The generated request object will request the latest specified lists from the Accertify server which, when received, must be passed to the `handlePayload` method. For example, if the request is for a LogConfig list, then the LogConfig list object received from the Accertify server must be passed to the `handlePayload` method in order for the SDK to utilize the new LogConfig. Currently, `generateListRequestPayload` may be used to request updates to the LogConfig, Malware, and Root signature lists.
  
    @param type An `InMobileListSet` value or any combination of `InMobileListSet` values.
    @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
    @return An `OpqaqueObjectRef` hex byte array with the signature request to be sent to the server.
*/
- (OpaqueObjectRef)generateListRequestPayload:(InMobileListSet)type
                                     withError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Generates a list request `OpaqueObjectRef` payload containing a specified version of either `InMobileListSeRoot`, `InMobileListSetMalware`, or `InMobileListSetLogConfig`. The generated request object will request the specified version of the list from the Accertify server which, when received, must be passed to the `handlePayload` method to complete the list update process. For example, if the request is for a LogConfig list of version "1.2", then the LogConfig list object received from the Accertify server must be passed to the `handlePayload` method in order for the SDK to utilize the new LogConfig. If no version is specified, then this method will retrieve the latest list.

    @param type A single `InMobileListSet` type.
    @param version The version of the signature file being requested. The version parameter may be `nil`, in which case, the latest version will be requested.
    @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
    @return An `OpqaqueObjectRef` hex byte array with the signature request to be sent to the server.
*/
- (OpaqueObjectRef)generateListRequestPayload:(InMobileListSet)type
                                       version:(NSString * _Nullable)version
                                     withError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Returns a string representation of the LogConfig, Malware, or Root signature list version. 

    @note Attempt to retrieve remote signature list version after registration, but prior to completion of first list update or log request will result in error.
 
    @param type A single `InMobileListSet` type.
    @param error Error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return A string representation of the specified list type's version.
*/
- (NSString *)listVersion:(InMobileListSet)type withError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Generates an `OpaqueObjectRef` payload containing all collectable logs specified in the logChoices parameter and, if provided, a custom log and transaction ID.
    
    > Note: A log will only be collected if it is both specified in the logChoices parameter and present in the current MME LogConfig list retrieved from the server. If no InMobileListSetLogConfig list update has been previously made, then all specified logs will be collected.
 
    > Note: An InMobile LogConfig list is set and retrieved from the server.
 
    @param logChoices An `InMobileLogSet` type of any or all of the available log choices.
    @param customLog An `NSDictionary` containing custom data to log. The customLog parameter may be `nil`.
    @param transId Provides a mechanism to group multiple log transmissions into a customer-defined transaction. Can be set to any string of length 0 to 255. The transId parameter may be `nil`.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
    
    @return An `OpaqueObjectRef` hex byte array containing a set of logs and/or a custom log to be sent to the server.
*/
- (OpaqueObjectRef)generateLogPayload:(InMobileLogSet)logChoices
                        withCustomLog:(NSDictionary * _Nullable)customLog
                        transactionId:(NSString * _Nullable)transId
                            withError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Generates an `OpaqueObjectRef` payload containing all collectable logs specified in the `logChoices` parameter.
    
    > Note: A log will only be collected if it is both specified in the `logChoices` parameter and present in the current MME LogConfig list retrieved from the server. If no `InMobileListSetLogConfig` list update has been previously made, then all specified logs will be collected.
 
    > Note: An InMobile LogConfig list is set and retrieved from the server.
 
    @param logChoices An `InMobileLogSet` type of any or all of the available log choices.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return An `OpaqueObjectRef` hex byte array containing a set of logs to be sent to the server.
*/
- (OpaqueObjectRef)generateLogPayload:(InMobileLogSet)logChoices
                            withError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Generates an `OpaqueObjectRef` payload containing a user-defined custom log.
 
    @param customLog An `NSDictionary` containing custom data to log.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return An `OpaqueObjectRef` hex byte array containing the user defined custom log to be sent to the server.
*/
- (OpaqueObjectRef)generateCustomLogPayload:(NSDictionary *)customLog
                                    onError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Handles the `OpaqueObjectRef` responses from the server. The `handlePayload` method will return an `NSDictionary` that varies in content depending on the type of `OpaqueObjectRef` it handles.
 
    The following list gives an example of contents that can be returned by the `handlePayload` method:
 
    - <b>registration request:</b> 
    ```
    {@"malware" : @"<malware version number>", @"root" : @"<root version number>"}
    ```
 
    - <b>list request:</b> 
    ```
    {@"log_config" : @"8380415", @"malware" : @"<malware version number>", @"root" : @"<root version number>"}
    ``` 
    
    - <b>send logs request:</b> 
    ```
    {}
    ```
 
    > Note: The `NSDictionary` returned from handling a list request will only contain values based off of the `InMobileListSet` initially passed in to the `generateListRequest` method.
 
    > Note: The `log_config` value found in the contents of a handled list request is an `InMobileLogSet` value that can be passed in to the `generateLogPayload` method.
    
    > Note: There is no requirement that the response object received from sending logs should be passed into the `handlePayload` method.

    @param data The input `OpaqueObjectRef` to parse.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return A userInfo `NSDictionary` with any user data from the `OpaqueObjectRef` to return to the caller.
*/
- (NSDictionary *)handlePayload:(OpaqueObjectRef)data onError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Securely stores any data in encrypted, sandboxed storage.
 
    @param item The data bytes to securely store.
    @param name The name of the item to securely store. Errors will occur if an item with the same name already exists.
    @param error The error object used to pass error messages back to caller. Errors will occur if an item with same name already exists. The error parameter may be `nil`.
 
    @return A boolean value stating whether data is stored or not.
*/
- (BOOL)whiteBoxCreate:(NSData *)item withName:(NSString *)name onError:(NSError **)error;

/**
    Securely stores any data in encrypted, sandboxed storage only if the specified policy set is satisfied.
 
    @param item The data bytes to securely store.
    @param name The name of the item to securely store. Errors will occur if an item with the same name already exists.
    @param policySet The set of policies to use when creating the item within WhiteBox. Valid options are any combination of the values of the bitmask `InMobileWhiteBoxPolicy`.
    @param error The error object used to pass error messages back to caller. Errors will occur if an item with same name already exists. The error parameter may be `nil`.
 
    @return A boolean value stating whether data is stored or not.
*/
- (BOOL)whiteBoxCreate:(NSData *)item withName:(NSString *)name andPolicy:(InMobileWhiteBoxPolicySet)policySet onError:(NSError **)error;

/**
    Reads and returns data that has been securely stored with the `whiteBoxCreateItem` method.
    
    @param name The name of the item of bytes to read.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return The bytes of securely stored data if an item with the passed-in name exists, `nil` if it doesn't exist.
*/
- (NSData *)whiteBoxRead:(NSString *)name onError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Reads and returns data that has been securely stored with the `whiteBoxCreateItem` method only if the specified policy set is satisfied and the item was previously created with the same policy set.
 
    @param name The name of the item of bytes to read.
    @param policySet The set of policies to use when reading the item from WhiteBox. Must be the same policy set used to create the item. Valid options are any combination of the values of the bitmask `InMobileWhiteBoxPolicy`.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return The bytes of securely stored data if an item with the passed-in name exists, `nil` if it doesn't exist.
*/
- (NSData *)whiteBoxRead:(NSString *)name andPolicy:(InMobileWhiteBoxPolicySet) policySet onError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Securely updates any data in encrypted, sandboxed storage. 
 
    @param item The data bytes to update and securely store.
    @param name The name of the item to update and securely store.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return A boolean value stating whether data is updated or not.
*/
- (BOOL)whiteBoxUpdate:(NSData *)item withName:(NSString *)name onError:(NSError **)error;

/**
    Securely updates any data in encrypted, sandboxed storage only if the specified policy set is satisfied and the item was previously created with the same policy set.
    
    @param item The data bytes to update and securely store.
    @param name The name of the item to update and securely store.
    @param policySet The set of policies to use when updating the item from WhiteBox. Must be the same policy set used to create the item. Valid options are any combination of the values of the bitmask `InMobileWhiteBoxPolicy`.
    @param error Error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return A boolean value stating whether data is updated or not.
*/
- (BOOL)whiteBoxUpdate:(NSData *) item withName:(NSString *)name andPolicy:(InMobileWhiteBoxPolicySet)policySet onError:(NSError **)error;

/**
    Securely destroys data that has been stored with the `whiteBoxCreateItem` method.
 
    @param name The name of the item of bytes to securely store.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return A boolean value stating whether data is destroyed or not.
*/
- (BOOL)whiteBoxDestroy:(NSString *)name onError:(NSError **)error;

/**
    Securely destroys data that has been stored with the `whiteBoxCreateItem` method only if the specified policy set is satisfied and the item was previously created with the same policy set.
 
    @param name The name of the item of bytes to securely store.
    @param policySet The set of policies to use when destroying the item from WhiteBox. Must be the same policy set used to create the item. Valid options are any combination of the values of the bitmask `InMobileWhiteBoxPolicy`.
    @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.
 
    @return A boolean value stating whether data is destroyed or not.
*/
- (BOOL)whiteBoxDestroy:(NSString *)name andPolicy:(InMobileWhiteBoxPolicySet)policySet onError:(NSError **)error;

/**
    Provides the current root status of the device.

    @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
    @return The root status of the device which may be any of the `InMobileRootState` values.
*/
- (InMobileRootState)rootDetectionStateWithError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
    Provides the current malware status of the device.
 
    @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
    @return The malware status of the device which may be any of the `InMobileMalwareState` values.
*/
- (InMobileMalwareState)malwareDetectionStateWithError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
 Provides a Dictionary of malware when malware has been detected on the device.
 @param error The error object used to pass error messages back to caller. The error parameter may be `nil`.

 @return a Dictionary of malware including the catagories and subcatagories that the malware belong too of malicious applications detected on the device.
*/
- (NSDictionary *)detectedMalwareListWithError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**
 Verifies if the device is in a current state or not.
 
 @param deviceState accepts any of InMobileDeviceState enum values to verify.
 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 @return A boolean value stating whether InMobileDeviceState is verified or not.
 */
- (BOOL)deviceStateVerification:(InMobileDeviceState) deviceState withError:(NSError **)error __attribute__((swift_error(nonnull_error)));

/**

 This method provides a way to check if biometrics are enrolled on the device. It will return true if the user has enrolled, whether it is fingerprint or facial recognition.

 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 @return A boolean value stating whether biometrics is enrolled or not.
 */
- (BOOL)isBiometricsEnrolled:(NSError **)error __attribute__((swift_error(nonnull_error)));


/**
    Initiates an authentication sequence using biometrics on eligible devices (iOS 8.0+, TouchID sensor). The authentication dialog is modally displayed when the authenticate method is invoked. The dialog will block all other UI input until the user authenticates, cancels, or presses the home button.
 
    @param type The type of authentication that is to be used. The type can be any of the `InMobileAuthType` values.
    @param complete A required completion handler that, on user reply, returns a `BOOL` indicating whether or not the authentication sequence was successful, and an optional `NSError` object if an error occurred during authentication.
 */
- (void)authenticate:(InMobileAuthType)type onCompletion:(AuthenticateCallback)complete;



/**
 To make use of the InAuthenticate features, you will need an InAuthenticate license.  The methods in the InAuthenicateManager class dot provide any network services.
 */

/**
 Generates a registration `OpaqueObjectRef` payload that can contain a user-defined custom log to be sent to the server prior to any logs or requests. The server will respond with a registration response `OpaqueObjectRef` which should be passed to the `handlePayload` method to complete the registration process.
 
 @param deviceToken A string representing the deviceToken consumed by Firebase or other APNS system to send messages to the system.
 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
 @return A registration `OpaqueObjectRef` hex byte array to be sent to the server.
 */
- (nullable OpaqueObjectRef)generateRegistrationPayloadWithDeviceToken:(nullable NSString *)deviceToken
                                                               onError:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));


/**
 Generates a registration `OpaqueObjectRef` payload that can contain a user-defined custom log to be sent to the server prior to any logs or requests. The server will respond with a registration response `OpaqueObjectRef` which should be passed to the `handlePayload` method to complete the registration process.
 
 @param deviceToken A string representing the deviceToken consumed by Firebase or other APNS system to send messages to the system.
 @param customLog An objective-c `NSDictionary` or swift dictionary containing custom data to log. The `customLog` parameter may be `nil`.
 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
 @return A registration `OpaqueObjectRef` hex byte array to be sent to the server.
 */
- (nullable OpaqueObjectRef)generateRegistrationPayloadWithDeviceToken:(nullable NSString *) deviceToken
                                                             customLog:(nullable NSDictionary *)customLog
                                                               onError:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));

/**
 Determines whether or not the deviceToken sent as a parameter is the same as what has been submitted previously with the current registration.
 
 @param deviceToken A string representing the deviceToken consumed by Firebase or other APNS system to send messages to the system.
 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
 @return `YES` if the device token is updated, or `NO` otherwise.
 */
- (BOOL)isDeviceTokenUpdated:(nullable NSString *)deviceToken
                     onError:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));

/**
 Generates a payload to update the device token. This will be used when the device token is to be changed.
 
 @param deviceToken A string representing the deviceToken consumed by Firebase or other APNS system to send messages to the system.
 @param error The error object used to pass error messages back to the caller.
 */
- (nullable OpaqueObjectRef)generateUpdateDeviceTokenPayloadWithDeviceToken:(nullable NSString *)deviceToken
                                                                    onError:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));

/**
 Generates a `OpaqueObjectRef` payload that sends a request to the server for any pending messages. The server will respond with a registration response `OpaqueObjectRef` which should be passed to the `handlePayload` method to get the list of messages..
 
 @param error The error object used to pass error messages back to the caller. The error parameter may be `nil`.
 
 @return An `OpaqueObjectRef` hex byte array to be sent to the server.
 */
- (nullable OpaqueObjectRef)generatePendingMessagesRequest:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));

/**
 Generates an opaque object that is sent to the server to acknowledge messages.
 
 The function generateAcknowledgePayload is called by
 acknowledgeServerMessagesOnServer
 
 @param message The message that is being responded to.
 @param response The response given by the customer, often used to accept or deny a message.
 @param error  The error object used to pass error messages back to the caller.
 */
- (nullable OpaqueObjectRef)generateCustomerResponsePayloadFor:(InAuthenticateMessage *)message
                                                      response:(NSString *)response
                                                       onError:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));

/**
 Generates an opaque object that is sent to the server to acknowledge messages.
 
 The function generateAcknowledgePayload is called by
 acknowledgeServerMessagesOnServer
 
 @param message The message that is being responded to.
 @param eventId The confirmation identifier for the message list.
 @param priority The priority for the message list.  This value is optional, and may be nil.
 @param response The response given by the customer, often used to accept or deny a message.
 @param error  The error object used to pass error messages back to the caller.
 */
- (nullable OpaqueObjectRef)generateCustomerResponsePayloadFor:(InAuthenticateMessage *)message
                                                       eventId:(nullable NSString *)eventId
                                                      priority:(nullable NSString *)priority
                                                      response:(NSString *)response
                                                       onError:(NSError *__autoreleasing _Nullable * _Nullable)error __attribute__((swift_error(nonnull_error)));

@end

NS_ASSUME_NONNULL_END
