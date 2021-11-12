/*
 * Copyright © 2019 InAuth, Inc. All rights reserved.
 * The InAuth logo, and other trademarks, service marks, and designs are registered or unregistered
 * trademarks of InAuth, Inc. and its subsidiaries in the United States and in other countries.
 * All other trademarks are property of their respective owners.
 */

#import <Foundation/Foundation.h>
#import "InMobileTypes.h"

NS_ASSUME_NONNULL_BEGIN

/**
 InMobileNet handles communication between the app and the server.
 This is one possible implementation, custom code may be written to facilitate communication between the iOS SDK and the server.
 */
@interface InMobileNet : NSObject

/// Shared instance of InMobileNet object.
+ (instancetype)sharedInstance;

/**
 Sends an OpaqueObject to a specified URL.
 
 @note Method runs asynchronously. Completion handler will be called on the background queue when the network call completes.
 
 @param opaqueObject The opaque object to be sent.
 @param url The URL that the opaque object is sent to.
 @param completion A completion handler.
 */
- (void)sendOpaqueObject:(OpaqueObjectRef)opaqueObject
                   toURL:(NSURL *)url
            onCompletion:(void (^_Nullable)(OpaqueObjectRef _Nullable opaqueObjectResponse,
                                            NSURLResponse * _Nullable urlResponse,
                                            NSError * _Nullable error))completion;

@end

NS_ASSUME_NONNULL_END
