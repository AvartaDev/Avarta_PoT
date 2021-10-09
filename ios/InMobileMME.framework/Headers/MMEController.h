/*
 * Copyright © 2018 InAuth, Inc. All rights reserved.
 * The InAuth logo, and other trademarks, service marks, and designs are registered or unregistered
 * trademarks of InAuth, Inc. and its subsidiaries in the United States and in other countries.
 * All other trademarks are property of their respective owners.
 */

#import "MME.h"

NS_ASSUME_NONNULL_BEGIN
/**
 Handles completion of methods that return nothing or an error.
 */
typedef void (^onCompletion)(NSError * _Nullable error);

/**
 Handles completion of list updating.
 */
typedef void (^listCompletion)(NSDictionary *_Nullable userInfo, NSError *_Nullable error);

/**
 Handles completion of enrollment.
 */
typedef void (^onSendComplete)(NSDictionary * _Nullable userInfo, NSError * _Nullable error);

/**
 Handles completion of message receipt.
 */
typedef void (^onMessagesReceived)(NSArray<InAuthenticateMessage *> * _Nullable messages, NSError * _Nullable error);

/**
 MMEController is a Swift-friendly class that provides functionality of the MME class as well as several methods designed as a more concise interface for typical use cases.
 
 MMEController methods that make use of networking do so asynchronously.
 */
@interface MMEController : MME

/**
 Registers the device using the specified URL. Though the full registration sequence only happens on the first invocation of this method, it is recommended to call `initiate` each time the app launches. The full registration sequence happens internally as follows: generate registration payload -> send registration payload to server -> handle server's response payload.

 @param url The URL to send the registration payload to (e.g. an app server endpoint).
 @param complete A completion handler indicating when `initiate` has finished, and whether or not an error occurred. The complete parameter may be `nil`.
 */
- (void)initiateOnURL:(NSURL *)url onCompletion:(onCompletion)complete;

/**
 Registers the device using the specified URL. Though the full registration sequence only happens on the first invocation of this method, it is recommended to call `initiate` each time the app launches. The full registration sequence happens internally as follows: generate registration payload -> send registration payload to server -> handle server's response payload.
 
 @param url The URL to send the registration payload to (e.g. an app server endpoint).
 @param complete A completion handler indicating when `initiate` has finished, and whether or not an error occurred. The complete parameter may be `nil`.
 */
- (void)initiateOnURL:(NSURL *)url
            customLog:(NSDictionary * _Nullable)customLog
         onCompletion:(onCompletion)complete;

/**
 Generates and sends the selected logs, an optional custom log, and an optional transaction ID to the specified URL.
 @note When utilizing UBA for enhanced risk assessment, log upload will be automatically preceded by the upload of any pending UBA events.

 @param logChoices An `InMobileLogSet` type of any or all of the available log choices.
 @param customLog An `NSDictionary` containing custom data to log. The customLog parameter may be `nil`.
 @param transId Provides a mechanism to group multiple log transmissions into a customer-defined transaction. Can be set to any string of length 0 to 255. The transId parameter may be `nil`.
 @param url The URL to send the log payload to.
 @param complete A completion handler indicating when `sendLogs` has finished, and whether or not an error occurred. The complete parameter may be `nil`.
 */
- (void)sendLogs:(InMobileLogSet)logChoices
       customLog:(NSDictionary * _Nullable)customLog
   transactionId:(NSString * _Nullable)transId
           toUrl:(NSURL *)url
    onCompletion:(onCompletion)complete;

/**
 Generates and sends a custom log and an optional transaction ID to the specified URL.
 @note When utilizing UBA for enhanced risk assessment, log upload will be automatically preceded by the upload of any pending UBA events.

 @param customLog An `NSDictionary` containing custom data to log.
 @param transId Provides a mechanism to group multiple log transmissions into a customer-defined transaction. Can be set to any string of length 0 to 255. The transId parameter may be `nil`.
 @param url The URL to send the log payload to.
 @param complete A completion handler indicating when `sendLogs` has finished, and whether or not an error occurred. The complete parameter may be `nil`.
 */
- (void)sendCustomLogs:(NSDictionary*)customLog
         transactionId:(NSString * _Nullable)transId
                 toUrl:(NSURL *)url
          onCompletion:(onCompletion)complete;

/**
 Downloads and installs a set of signature files to the device. The user info dictionary returned upon a successful list update contains, if requested, the root and malware version, and log config `MMELogSet` value.
 
 @param selection An `InMobileListSet` type of any or all of the available log choices..
 @param url The URL to request the signature files from.
 @param complete A completion handler indicating when `updateList` has finished, whether or not an error occurred, and a dictionary containing user info pertaining to the updated signature file(s). The complete parameter may be `nil`.
 */
- (void)updateList:(InMobileListSet)selection
           fromUrl:(NSURL *)url
      onCompletion:(listCompletion)complete;

/**
  To make use of the InAuthenticate features, you will need an InAuthenticate license.
 */

/**
 Registers the device using the specified registrationURL and enrolls in InAuthenticate. Though the full registration sequence only happens on the first invocation of this method, it is recommended to call `initiateOnServer` each time the app launches. The full registration sequence happens internally as follows: generate registration payload -> send registration payload to server -> handle server's response payload.
 
 @param registrationUrl The URL to send the registration payload to. This URL is also used for `acknowledgeServerMessages`, `getCacheMessages`, `requestListUpdate`, and `sendLogs`.
 @param deviceToken A string representing the deviceToken consumed by Firebase or other APNS system to send messages to the system.
 @param complete A completion handler indicating when initiateOnServer has finished, and whether or not an error occurred.  The completion handler may be nil.
 */
- (void)initiateOnURL:(NSURL *)registrationUrl
          deviceToken:(nullable NSString *)deviceToken
         onCompletion:(onCompletion)complete;

/**
 Registers the device using the specified registrationURL and enrolls in InAuthenticate. Though the full registration sequence only happens on the first invocation of this method, it is recommended to call `initiateOnServer` each time the app launches. The full registration sequence happens internally as follows: generate registration payload -> send registration payload to server -> handle server's response payload.
 
 @param registrationUrl The URL to send the registration payload to. This URL is also used for `acknowledgeServerMessages`, `getCacheMessages`, `requestListUpdate`, and `sendLogs`.
 @param deviceToken A string representing the deviceToken consumed by Firebase or other APNS system to send messages to the system.
 @param customMap A map that can be used to pass custom data to the enrollment server.
 @param complete A completion handler indicating when initiateOnServer has finished, and whether or not an error occurred.  The completion handler may be nil.
 */
- (void)initiateOnURL:(NSURL *)registrationUrl
          deviceToken:(nullable NSString *)deviceToken
            customMap:(nullable NSDictionary *)customMap
         onCompletion:(onCompletion)complete;


/**
 Fetches any messages stored on the Risk Server that have been queued up by the app server. This should be invoked each time a push notification is received.
 
 @param url The url for the message server.  This URL usually has the same host as the registration server, although the path may be different.
 @param complete A completion block that returns an array of InAuthenticateMessage objects that can be parsed (see InAuthenticateMessage.h) and displayed to the user to respond to.
 */
- (void)getPendingMessagesFromURL:(NSURL *)url
                     onCompletion:(onMessagesReceived)complete;

/**
 Sends a user response to the server. This also allows queued up messages to be destroyed.
 
 @param response The response given by the customer, often used to accept or deny a message.
 @param message The message that is being responded to.
 @param url The url of the server that receives acknowledgements.  This URL usually has the same host as the registration server, although the path may be different.
 @param complete A completion block that returns a userInfo dictionary containing whether or not the server was able to acknowledge the messages and an error if one occurred.
 */
- (void)sendCustomerResponse:(NSString *)response
                  forMessage:(InAuthenticateMessage *)message
                       toURL:(NSURL *)url
                onCompletion:(onSendComplete)complete;

/**
 Sends a user response to the server. This also allows queued up messages to be destroyed. Also includes eventId & priority fields
 
 @param response The response given by the customer, often used to accept or deny a message.
 @param message The message that is being responded to.
 @param eventId The eventId for the message, taken from the confirmation_identifier
 @param priority (optional) the priority for the message(s), null if there is none
 @param url The url of the server that receives acknowledgements.  This URL usually has the same host as the registration server, although the path may be different.
 @param complete A completion block that returns a userInfo dictionary containing whether or not the server was able to acknowledge the messages and an error if one occurred.
 */
- (void)sendCustomerResponse:(NSString *)response
                  forMessage:(InAuthenticateMessage *)message
                     eventId:(nullable NSString *)eventId
                    priority:(nullable NSString *)priority
                       toURL:(NSURL *)url
                onCompletion:(onSendComplete)complete;


@end

NS_ASSUME_NONNULL_END
