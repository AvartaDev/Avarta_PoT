//
//  InMobileTypes.h
//  InMobileMME
//
//  Created on 10/24/19.
//  Copyright © 2019 Accertify, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Data meeting MME specifications.
*/

typedef NSData* OpaqueObjectRef NS_SWIFT_BRIDGED_TYPEDEF;

/**
A set of logs to be gathered by the SDK.
 */
typedef NS_OPTIONS(UInt64, InMobileLogSet) {
    InMobileLogSetEmpty           = 0ull,
    InMobileLogSetAccelerometer   = (1ull << 0),
    InMobileLogSetAnomalies       = (1ull << 25),
    InMobileLogSetApplicationInfo = (1ull << 13),
    InMobileLogSetBattery         = (1ull << 1),
    InMobileLogSetBluetooth       = (1ull << 26),
    InMobileLogSetCamera          = (1ull << 32),
    InMobileLogSetContact         = (1ull << 2),
    InMobileLogSetDataUsage       = (1ull << 3),
    InMobileLogSetDevice          = (1ull << 4),
    InMobileLogSetDeviceAccess    = (1ull << 24),
    InMobileLogSetGPS             = (1ull << 5),
    InMobileLogSetHardware        = (1ull << 6),
    InMobileLogSetLocale          = (1ull << 30),
    InMobileLogSetMalware         = (1ull << 7),
    InMobileLogSetMedia           = (1ull << 8),
    InMobileLogSetPermissions     = (1ull << 27),
    InMobileLogSetRoot            = (1ull << 10),
    InMobileLogSetScreen          = (1ull << 29),
    InMobileLogSetTelephone       = (1ull << 11),
    InMobileLogSetWifi            = (1ull << 12),
    InMobileLogSetWhitebox        = (1ull << 23),
    InMobileLogSetIpaDigest       = (1ull << 31),
    InMobileLogSetFont            = (1ull << 33),
    InMobileLogSetAppStore        = (1ull << 34),
    InMobileLogSetPollingGPS      = (1ull << 35),
    InMobileLogSetServerLog       = 0xFFFFFFFFFFFFFFFF,
    InMobileLogSetAll             = InMobileLogSetAccelerometer | InMobileLogSetAnomalies | InMobileLogSetApplicationInfo | InMobileLogSetBattery | InMobileLogSetBluetooth | InMobileLogSetCamera | InMobileLogSetContact | InMobileLogSetDataUsage | InMobileLogSetDevice | InMobileLogSetDeviceAccess | InMobileLogSetGPS | InMobileLogSetHardware | InMobileLogSetLocale | InMobileLogSetMalware | InMobileLogSetMedia | InMobileLogSetPermissions | InMobileLogSetRoot | InMobileLogSetScreen | InMobileLogSetTelephone | InMobileLogSetWifi | InMobileLogSetWhitebox | InMobileLogSetFont | InMobileLogSetAppStore | InMobileLogSetPollingGPS
};

/**
 A set of logs to be gathered by the SDK. Mirrors MMELogSet.
 */
typedef NS_OPTIONS(UInt64, InAuthenticateLogSet) {
    InAuthenticateLogSetEmpty      = InMobileLogSetEmpty,
    InAuthenticateLogSetDevice     = InMobileLogSetDevice,
    InAuthenticateLogSetGPS        = InMobileLogSetGPS,
    InAuthenticateLogSetRoot       = InMobileLogSetRoot,
    InAuthenticateLogSetMalware    = InMobileLogSetMalware,
    InAuthenticateLogSetPollingGPS = InMobileLogSetPollingGPS,
    InAuthenticateLogSetAll        = InAuthenticateLogSetDevice | InAuthenticateLogSetGPS | InAuthenticateLogSetRoot | InAuthenticateLogSetMalware | InAuthenticateLogSetPollingGPS
} DEPRECATED_MSG_ATTRIBUTE("Deprecated as of 9.3. Use InMobileLogSet instead");

/**
 Specifies which types of lists should be updated.
 */
typedef NS_OPTIONS(UInt16, InMobileListSet) {
    InMobileListSetEmpty           = 0,
    InMobileListSetRoot            = (1u << 1),
    InMobileListSetMalware         = (1u << 2),
    InMobileListSetLogConfig       = (1u << 3),
    InMobileListSetRemoteRoot      = (1u << 4),
    InMobileListSetRemoteMalware   = (1u << 5),
    InMobileListSetRemoteLogConfig = (1u << 6),
    InMobileListSetAll             = InMobileListSetRoot | InMobileListSetMalware | InMobileListSetLogConfig | InMobileListSetRemoteRoot | InMobileListSetRemoteMalware | InMobileListSetRemoteLogConfig
};

/**
 Specifies which types of lists should be updated. Mirrors MMEListSet.
 */
typedef NS_OPTIONS(UInt16, InAuthenticateListSet) {
    InAuthenticateListSetEmpty   = InMobileListSetEmpty,
    InAuthenticateListSetRoot    = InMobileListSetRoot,
    InAuthenticateListSetMalware = InMobileListSetMalware,
    InAuthenticateListSetTotal   = InAuthenticateListSetRoot | InAuthenticateListSetMalware
} DEPRECATED_MSG_ATTRIBUTE("Deprecated as of 9.3. Use InMobileListSet instead");

/**
 Denotes a type of policy to be used in whitebox storage.
 */
typedef NS_OPTIONS(UInt16, InMobileWhiteBoxPolicySet) {
    InMobileWhiteBoxPolicyRoot      = (1u << 0),
    InMobileWhiteBoxPolicyMalware   = (1u << 1),
    InMobileWhiteBoxPolicyLocation  = (1u << 2),
    InMobileWhiteBoxPolicyWifi      = (1u << 3),
    InMobileWhiteBoxPolicyRootCloak = (1u << 4)
};

typedef NS_ENUM(SInt16, InMobileDeviceState){
    InMobileDeviceStateRooted                     = (1u << 2), /**< 4 */
    InMobileDeviceStateNotRooted                  = ~(InMobileDeviceStateRooted), /**< -5 */
    InMobileDeviceStateMalwareDetected            = (1u << 3), /**< 8 */
    InMobileDeviceStateNoMalwareDetected          = ~(InMobileDeviceStateMalwareDetected), /**< -9 */
    InMobileDeviceStateRootedAndCloaked           = (1u << 5), /**< 32 */
    InMobileDeviceStateNotCloaked                 = ~(InMobileDeviceStateRootedAndCloaked),
    InMobileDeviceStateNotRootedNoMalwareDetected = (1u << 6), /**< 64 */
};

typedef NS_ENUM(SInt16, InMobileRootState) {
    InMobileRootStateRooted      = (1u << 2),
    InMobileRootStateCompromised = (1u << 4),
    InMobileRootStateNotRooted   = ~(InMobileRootStateRooted),
    InMobileRootStateError       = (1u << 1)
};

typedef NS_ENUM(SInt16, InMobileMalwareState) {
    InMobileMalwareStateError             = (1u << 1),
    InMobileMalwareStateMalwareDetected   = (1u << 3),
    InMobileMalwareStateCompromised       = (1u << 4),
    InMobileMalwareStateNoMalwareDetected = ~(InMobileMalwareStateMalwareDetected)
};

/**
 Denotes a type of user authentication.
 */
typedef NS_ENUM(UInt16, InMobileAuthType) {
    InMobileAuthTypeBiometrics         = 1,
    InMobileAuthTypeBiometricsPasscode = 2
};

typedef NS_ENUM(NSInteger, InMobileAuthError) {
    InMobileAuthErrorFailed               = 0,
    InMobileAuthErrorUnsupported          = (1u << 0),
    InMobileAuthErrorUnrecognizedType     = (1u << 1),
    InMobileAuthErrorUnsupportedOsVersion = (1u << 2),
    InMobileAuthErrorUnsupportedOsFeature = (1u << 3),
    InMobileAuthErrorFallback             = (1u << 4),
    InMobileAuthErrorCanceled             = (1u << 5),
    InMobileAuthErrorPasscodeNotSet       = (1u << 6),
    InMobileAuthErrorNotEnrolled          = (1u << 7),
    InMobileAuthErrorUnknown              = (1u << 8),
    InMobileAuthErrorInvalid              = (1u << 9),
};

/**
 Denotes a licensing issue.
 */
typedef NS_ENUM(UInt64, InMobileSDKLicense) {
    InMobileSDKLicenseNotFound                      = 20006,
    InMobileSDKLicenseExpired                       = 20007,
    InMobileSDKLicenseBiometricsNotProvisioned      = 20008,
    InMobileSDKLicenseInMobileNotProvisioned        = 20009,
    InMobileSDKLicenseInAuthenticateNotProvisioned  = 20010,
    InMobileSDKLicenseUbaNotProvisioned             = 20011
};

/**
 Handles the completion of the SDK's authentication method.
 */
typedef void (^AuthenticateCallback)(BOOL authenticated, NSError * _Nullable error);

/**
The InMobileTypes class defines functions to convert from state code or error code to string
*/
@interface InMobileTypes : NSObject
/**
 Converts an InMobileMalwareState to its NSString representation
 @param state An InMobileMalwareState value.
 @return NSString of the requested state value.
 */
+ (NSString *)malwareStateToString:(InMobileMalwareState)state;

/**
 Converts an InMobileRootState to its NSString representation
 @param state An InMobileRootState value.
 @return NSString of the requested state value.
 */
+ (NSString *)rootStateToString:(InMobileRootState)state;

/**
 Converts an InMobileDeviceState to its NSString representation
 @param state An InMobileDeviceState value.
 @return NSString of the requested state value.
 */
+ (NSString *)deviceStateToString:(InMobileDeviceState)state;

/**
 Converts an AuthState to its NSString representation
 @param state An AuthState value.
 @return NSString of the requested state value.
 */
+ (NSString *)authStateToString:(InMobileAuthError)state;

/**
 Converts an MMELogSet to its NSString representation
 @param logChoiceSet An MMELogSet value.
 @return NSString of the requested logset value.
 */
+ (NSString *)logTypeToString:(InMobileLogSet)logChoiceSet;

/**
Converts an InMobileSDKLicense to its NSString representation
@param value  Reason value.
@return NSString of the license error reason.
*/
+ (NSString *)licenseErrorReason:(InMobileSDKLicense)value;

@end

NS_ASSUME_NONNULL_END
