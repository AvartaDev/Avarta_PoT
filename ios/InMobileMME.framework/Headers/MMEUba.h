/*
 * Copyright © 2020 InAuth, Inc. All rights reserved.
 * The InAuth logo, and other trademarks, service marks, and designs are registered or unregistered
 * trademarks of InAuth, Inc. and its subsidiaries in the United States and in other countries.
 * All other trademarks are property of their respective owners.
 */

#import <UIKit/UIKit.h>
#import "MMEController.h"

NS_ASSUME_NONNULL_BEGIN

/// The application principal class name to be used as `UIApplicationMain()` `principalClassName` parameter to enable automated data collection.
FOUNDATION_EXPORT NSString *const MMEUbaApplicationClassName;

/// Invalid screen identifier value.
#define MMEUbaInvalidScreenID    ((NSUInteger)0)

@class MMEUbaPayload;

/// The MMEUba interface provides primary means of interacting with UBA subsystem of the InMobile SDK.
@protocol MMEUba <NSObject>

/// The custom session identifier.
@property (nonatomic, strong, nullable) NSString *sessionID;

/// The automatically generated session identifier.
@property (nonatomic, readonly, strong) NSString *ubaSessionID;

/// The current screen identifier.
@property (nonatomic, readonly) NSUInteger screenID;

/// A Boolean value that determines whether to suspend event collection and uploads.
@property (nonatomic, getter=isSuspended) BOOL suspended;

/// The UBA token.
@property (nonatomic, readonly, strong) NSString *ubaID;

/**
 Logs a ScreenStart  event with a title and automatically recorded ScreenEnd event.
 
 Existing ScreenStart event already associated with the `view` will be overriden.
 @note Method call will fail if not invoked from application main thread.
 
 @param view A view hierarchy object to associate with the event. ScreenEnd event will be automatically recorded when `view` is released.
 @param title A screen title or string identifying the screen.

 @return `YES` if ScreenStart event was created, or `NO` if an error occured.
 */
- (BOOL)screenStartWithView:(UIView *)view title:(NSString *)title;

/**
 Logs a ScreenStart event with automatically recorded ScreenEnd event.
 
 Calls `screenStartWithView:title:` with view's `accessibilityIdentifier` as screen title identifier, otherwise identifier will be automatically generated.
 @note Method call will fail if not invoked from application main thread.

 @param view A view hierarchy object to associate with the event. ScreenEnd event will be automatically recorded when `view` is released.

 @return `YES` if ScreenStart event was created, or `NO` if an error occured.
 */
- (BOOL)screenStartWithView:(UIView *)view;

/**
 Logs a ScreenEnd  event for pending ScreenStart associated with view hierachy object.

 @note Method call will fail if not invoked from application main thread.

 @param view A view hierarchy object associated with ScreenStart event.

 @return `YES` if ScreenEnd event was created, `NO` if an error occured or `view` is not associated with pending ScreenStart event.
 */
- (BOOL)screenEndWithView:(UIView *)view;

/**
 Logs a ScreenStart event with a title.
 
 Existing ScreenStart event already associated with the `title` will be overriden and new screen identifier will be returned.
 @note Method call will fail if not invoked from application main thread.

 @param title A screen title or string identifying the screen.

 @return A unique screen identifier, or `MMEUbaInvalidScreenID` if event has not been created.
 */
- (NSUInteger)screenStartWithTitle:(NSString *)title;

/**
 Logs a ScreenEnd event for given screen identifier.

 @note Method call will fail if not invoked from application main thread.

 @param screenID A screen identifier previously returned by `screenStartWithTitle:` method.

 @return `YES` if ScreenEnd event was created, `NO` if an arror occured or `screenID` is not associated with pending ScreenStart event.
 */
- (BOOL)screenEndWithID:(NSUInteger)screenID;

/**
 Logs a event with given payload.

 @note Method call will fail if not invoked from application main thread.

 @param payload A event payload object. Instance of `MMEUbaPayload` subclass.

 @return `YES` if event was created, `NO` if an arror occured.
 */
- (BOOL)logEvent:(MMEUbaPayload *)payload;

/**
 Uploads pending event log.

 Method call is optional, periodic uploads are performed automatically.

 @param completion A completion handler to call when upload is finished. An `error` object indicates upload failure, or `nil` if upload was successful.
 */
- (void)uploadWithCompletion:(void (^ _Nullable)(NSError * _Nullable error))completion;

/**
 Process responder chain event.

 When subclassing `UIApplication` host is required to override `sendEvent:` method and call `processEvent:` prior to invocation of super class call.

 @note Method call will fail if not invoked from application main thread or when host application opted into `MMEUbaApplicationClassName` as application principal class.
 
 @param event A event object parameter to `UIApplication` `sendEvent: method`.

 @return `YES` if event was processed, `NO` if an arror occured.
 */
- (BOOL)processEvent:(UIEvent *)event;

@end

@interface MMEController (MMEUba)

/**
 Returns an shared instance of UBA manager object.
 
 @param error A pointer to an error object. May be `nil` if `error` details are not important.
 
 @return A shared UBA manager object, `nil` if an error ccured. In this case `error` contains an `NSError` with failure description.
 */
- (nullable id<MMEUba>)sharedUbaWithError:(NSError * __autoreleasing _Nullable * _Nullable)error;

@end

NS_ASSUME_NONNULL_END
