/*
 * Copyright © 2020 InAuth, Inc. All rights reserved.
 * The InAuth logo, and other trademarks, service marks, and designs are registered or unregistered
 * trademarks of InAuth, Inc. and its subsidiaries in the United States and in other countries.
 * All other trademarks are property of their respective owners.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Abstract MMEUbaPayload interface.
@interface MMEUbaPayload : NSObject

+ (instancetype)new UNAVAILABLE_ATTRIBUTE;
- (instancetype)init UNAVAILABLE_ATTRIBUTE;

@end

/// Available `MMEUbaBiometricAuthenticationPayload` authentication methods.
typedef NS_ENUM(NSUInteger, MMEUbaBiometricAuthenticationMethod) {
    /// Password fallback when biometric authentication is not available.
    MMEUbaBiometricAuthenticationMethodPassword,
    /// Fingerprint authentication methods such as TouchID.
    MMEUbaBiometricAuthenticationMethodTouch,
    /// Facial authentication methods such as FaceID.
    MMEUbaBiometricAuthenticationMethodFace,
    /// Iris scan authentication methods.
    MMEUbaBiometricAuthenticationMethodIris,
    /// Other authentication method such as Apple Watch.
    MMEUbaBiometricAuthenticationMethodOther
};

/// Biometric authentication event payload recorded using `logEvent:` of `MMEUba` interface.
@interface MMEUbaBiometricAuthenticationPayload : MMEUbaPayload

/// The authentication method.
@property(nonatomic, readonly) MMEUbaBiometricAuthenticationMethod method;
/// A Boolean value indicating authentication success.
@property(nonatomic, readonly) BOOL success;

/**
 Initializes a biometric authentication payload with method and success state.
 
 @param method A biometric authentication method, see `MMEUbaBiometricAuthenticationMethod`.
 @param success A authentication success.

 @return Instance of `MMEUbaBiometricAuthenticationPayload` class.
 */
- (instancetype)initWithMethod:(MMEUbaBiometricAuthenticationMethod)method success:(BOOL)success;
  
@end

NS_ASSUME_NONNULL_END
