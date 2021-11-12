#import <UIKit/UIKit.h>

/** Represents the resolution options for the returned ZoOm Audit Trail Image(s) */
typedef NS_ENUM(NSInteger, ZoomAuditTrailType) {
    /** Configures ZoOm to disable returning Audit Trail Images. */
    ZoomAuditTrailTypeDisabled = 0,
    /** Configures ZoOm to return the fullest resolution image possible. */
    ZoomAuditTrailTypeFullResolution = 1,
    /** Configures Zoom to return images of height 640. */
    ZoomAuditTrailTypeHeight640 = 2,
};

/** Represents the options for the blur effect styles for the ZoOm Frame (area outside of ZoOm Oval). */
typedef NS_ENUM(NSInteger, ZoomBlurEffectStyle) {
    /** The blur effect will be off/disabled. */
    ZoomBlurEffectOff = 0,
    /** The blur effect will be default style (ONLY AVAILABLE ON IOS 10+) */
    ZoomBlurEffectStyleRegular = 1,
    /** The blur effect will have a light/white-tint style */
    ZoomBlurEffectStyleLight = 2,
    /** The blur effect will have a extra light/white-tint style */
    ZoomBlurEffectStyleExtraLight = 3,
    /** The blur effect will have a dark/black-tint style */
    ZoomBlurEffectStyleDark = 4,
    /** The blur effect will have a prominent style (ONLY AVAILABLE ON IOS 10+) */
    ZoomBlurEffectStyleProminent = 5,
};

/** Represents the options for the location of the back button. */
typedef NS_ENUM(NSInteger, ZoomCancelButtonLocation) {
    /** The back button will be located in the top left */
    ZoomCancelButtonLocationTopLeft = 0,
    /** The back button will be located in the top right */
    ZoomCancelButtonLocationTopRight = 1,
    /** The back button will be disabled */
    ZoomCancelButtonLocationDisabled = 2,
};

/** Represents the options for the behavior of iPhone X's view when frame size ratio is set to 1. */
typedef NS_ENUM(NSInteger, ZoomFullScreenBehavior) {
    /** ZoOm will handle the look of the view */
    ZoomFullScreenBehaviorAutomatic = 0,
    /** Developer is in full control of the look of ZoOm */
    ZoomFullScreenBehaviorManual = 1,
};

/** Represents the options for the transition animation used when dismissing the ZoOm Interface. */
typedef NS_ENUM(NSInteger, ZoomExitAnimationStyle) {
    /** Default. Quick fade out. */
    ZoomExitAnimationStyleNone = 0,
    /** Frame will fade out as oval and frame expand out quickly. */
    ZoomExitAnimationStyleRippleOut = 1,
    /** Frame will slowly fade out as oval and frame slowly expand out.*/
    ZoomExitAnimationStyleRippleOutSlow = 2,
};

@protocol ZoomSDKProtocol;

__attribute__((visibility("default")))
@interface Zoom: NSObject
@property (nonatomic, class, readonly, strong) id <ZoomSDKProtocol> _Nonnull sdk;
@end

@protocol ZoomFaceBiometricMetrics;
@protocol ZoomIDScanMetrics;
@class NSDate;

/** Represents the possible state of camera permissions. */
typedef NS_ENUM(NSInteger, ZoomCameraPermissionStatus) {
    /** The user has not yet been asked for permission to use the camera */
     ZoomCameraPermissionStatusNotDetermined = 0,
    /** The user denied the app permission to use the camera or manually revoked the app’s camera permission.
     From this state, permission can only be modified by the user from System ‘Settings’ context. */
    ZoomCameraPermissionStatusDenied = 1,
    /** The camera permission on this device has been disabled due to policy.
     From this state, permission can only be modified by the user from System ‘Settings’ context or contacting the system administrator. */
    ZoomCameraPermissionStatusRestricted = 2,
    /** The user granted permission to use the camera. */
    ZoomCameraPermissionStatusAuthorized = 3,
};

@class UIColor;
@class CAGradientLayer;
@class ZoomGuidanceCustomization;
@class ZoomGuidanceImagesCustomization;
@class ZoomOvalCustomization;
@class ZoomFeedbackCustomization;
@class ZoomCancelButtonCustomization;
@class ZoomFrameCustomization;
@class ZoomResultScreenCustomization;
@class ZoomOverlayCustomization;
@class ZoomIDScanCustomization;

/**
 * Class used to customize the look & feel of ZoOm. ZoOm ships with a default ZoOm theme but has
 * a variety of variables that you can use to change how ZoOm Authentication looks and feels.
 * To customize ZoOm simply create an instance of ZoomCustomization and set some or all of the variables
 * to make ZoOm Authentication match your application more.
 */
__attribute__((visibility("default")))
@interface ZoomCustomization : NSObject
/** the avg amount of time we want to spend transitioning the user into the ZoOm interface. */
@property (nonatomic) float mainInterfaceEntryTransitionTime;
/** Customize the look and feel of ZoOm ID Scan. */
@property (nonatomic, strong) ZoomIDScanCustomization * _Nonnull idScanCustomization;
/** Customize the app overlay, separating the ZoOm Interface from the presenting view controller. */
@property (nonatomic, strong) ZoomOverlayCustomization * _Nonnull overlayCustomization;
/** Customize the Pre-Enrollment/Instruction/Retry images. */
@property (nonatomic, strong) ZoomGuidanceCustomization * _Nonnull guidanceCustomization;
/** Customize the Result screen elements. */
@property (nonatomic, strong) ZoomResultScreenCustomization * _Nonnull resultScreenCustomization;
/** Customize the ZoOm Session's oval. */
@property (nonatomic, strong) ZoomOvalCustomization * _Nonnull ovalCustomization;
/** Customize the feedback bar and its text. */
@property (nonatomic, strong) ZoomFeedbackCustomization * _Nonnull feedbackCustomization;
/** Customize the cancel button location, or disable it. The cancel button is shown during Pre-Enrollment, Retry, and ZoOm. */
@property (nonatomic, strong) ZoomCancelButtonCustomization * _Nonnull cancelButtonCustomization;
/** Customize the frame that contains all views during the ZoOm session. */
@property (nonatomic, strong) ZoomFrameCustomization * _Nonnull frameCustomization;
/** Set this variable to a ZoomExitAnimationStyle enum value to customize the transition out animation for an unsuccessful session. Default is ZoomExitAnimationStyleNone. */
@property (nonatomic) enum ZoomExitAnimationStyle exitAnimationUnsuccess;
/** Set this variable to a ZoomExitAnimationStyle enum value to customize the transition out animation for a successful session. Default is ZoomExitAnimationStyleNone. */
@property (nonatomic) enum ZoomExitAnimationStyle exitAnimationSuccess;
/** Set this variable to a ZoomExitAnimationStyle enum value to customize the transition out animation for a successful session. Default is ZoomExitAnimationStyleNone. */

/**
 * This function allows special runtime control of the success message shown when the success animation occurs. Please note that you can also customize this
 * string via the standard customization/localization methods provided by ZoOm.  Special runtime access is enabled to this text because the developer may wish
 * to change this text depending on ZoOm's mode of operation
 */
+ (NSString * _Nullable) overrideResultScreenSuccessMessage;
+ (void) setOverrideResultScreenSuccessMessage:(NSString * _Nonnull)value;

@property (nonatomic) NSDictionary* _Nullable featureFlagsMap;

- (nonnull instancetype)init;
- (nonnull instancetype)initWithFeatureFlagsMap:(NSDictionary* _Nullable)featureFlagsMap  NS_SWIFT_NAME(init(featureFlagsMap:));
+ (nonnull instancetype)new;
@end


/** Represents results of a Zoom face biometric comparison */
@protocol ZoomFaceBiometricMetrics <NSObject>
/** A sample of images capturing during the face analysis.  This parameter is nil unless Zoom.sdk.auditTrailType is set to something other than Disabled. */
@property (nonatomic, readonly, copy) NSArray<UIImage *> * _Nullable auditTrail;
/** A collection of the audit trails captured during the face analysis.  This parameter is nil unless Zoom.sdk.auditTrailType is set to something other than Disabled. */
@property (nonatomic, readonly, copy) NSArray<NSArray<UIImage *>*> * _Nullable auditTrailHistory;
/** A sample of time based images captured during the face analysis.  This parameter is nil unless enableTimeBasedSessionImages is set to true. */
@property (nonatomic, readonly, copy) NSArray * _Nullable timeBasedSessionImages;
/** ZoOm Biometric FaceMap. */
@property (nonatomic, readonly, copy) NSData * _Nullable faceMap;
/** ZoOm Biometric FaceMapBase64. */
@property (nonatomic, readonly, copy) NSString * _Nullable faceMapBase64;
/** ZoOm Biometric FaceMap. */
@property (nonatomic, readonly, copy) NSData * _Nullable zoomFacemap DEPRECATED_MSG_ATTRIBUTE("Use 'faceMap'");
@end // ZoomFaceBiometricMetrics

/** Represents results of Zoom ID Scan */
@protocol ZoomIDScanMetrics <NSObject>
/** A collection of the images captured during the ID Scan phase where users are instructed to present the front of their ID Document. */
@property (nonatomic, readonly, copy) NSArray<UIImage *> * _Nullable frontImages;
/** A collection of the images captured during the ID Scan phase where users are instructed to present the back of their ID Document.  When ID Type is passport, this object will return as any empty array. */
@property (nonatomic, readonly, copy) NSArray<UIImage *> * _Nullable backImages;
/** ZoOm ID Scan Data. */
@property (nonatomic, readonly, copy) NSData * _Nullable idScan;
/** ZoOm ID Scan Data as base64 encoded string. */
@property (nonatomic, readonly, copy) NSString * _Nullable idScanBase64;
/** A unique ID for the ZoOm ID Scan. */
@property (nonatomic, readonly, copy) NSString * _Nullable sessionId;
@end // ZoomIDScanMetrics

/**
 * Customize the look & feel of the ZoOm ID Scan screens.
 */
__attribute__((visibility("default")))
@interface ZoomIDScanCustomization : NSObject
/** color of the ID Type Selection screens' background. Default is custom color gradient. */
@property (nonatomic, copy) NSArray<UIColor *> * _Nonnull selectionScreenBackgroundColors;
/** color of the ID Review screen's background. Default is custom color gradient. */
@property (nonatomic, copy) NSArray<UIColor *> * _Nonnull reviewScreenBackgroundColors;
/** applies a UIBlurEffectStyle over the background color during ID Type Selection screen. Default is off. */
@property (nonatomic) enum ZoomBlurEffectStyle selectionScreenBlurEffectStyle;
/** applies a UIBlurEffectStyle over the background color during ID Scan Review screen. Default is off. */
@property (nonatomic) enum ZoomBlurEffectStyle reviewScreenBlurEffectStyle;
/** color of the ID Type Selection screen's foreground. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull selectionScreenForegroundColor;
/** color of the ID Scan Review screen's foreground. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull reviewScreenForegroundColor;
/** color of the ID Scan Capture screen's foreground. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull captureScreenForegroundColor;
/** color of the instruction label's background during the ID Scan Review screen. */
@property (nonatomic, strong) UIColor * _Nonnull reviewScreenTextBackgroundColor;
/** color of the instruction label's background during the ID Scan Capture screen. */
@property (nonatomic, strong) UIColor * _Nonnull captureScreenTextBackgroundColor;
/** color of the instruction label's border during the ID Scan Review screen. */
@property (nonatomic, strong) UIColor * _Nonnull reviewScreenTextBackgroundBorderColor;
/** color of the instruction label's border during the ID Scan Capture screen. */
@property (nonatomic, strong) UIColor * _Nonnull captureScreenTextBackgroundBorderColor;
/** corner radius of the text label background and border during ID Scan Review screen. **/
@property (nonatomic) int reviewScreenTextBackgroundCornerRadius;
/** corner radius of the text label background and border during ID Scan Capture screen. **/
@property (nonatomic) int captureScreenTextBackgroundCornerRadius;
/** thickness of the text label background border during ID Scan Review screen. **/
@property (nonatomic) int reviewScreenTextBackgroundBorderWidth;
/** thickness of the text label background border during ID Scan Capture screen. **/
@property (nonatomic) int captureScreenTextBackgroundBorderWidth;
/** corner radius of the ID Document Preview image displayed on the ID Scan Review screen. */
@property (nonatomic) int reviewScreenDocumentPreviewCornerRadius;
/** Controls whether to show the 'zoom_branding_logo_id_check' image (or image configured with .selectionScreenBrandingImage) on the Identity Document Type Selection Screen. Default is true (visible). */
@property (nonatomic) BOOL showSelectionScreenBrandingImage;
/** image displayed on the ID Type Selection screen. */
@property (nonatomic, strong) UIImage * _Nullable selectionScreenBrandingImage;
/** color of the action button's text during ID Scan screens. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull buttonTextNormalColor;
/** color of the action button's background during ID Scan screens. Default is clear. */
@property (nonatomic, strong) UIColor * _Nonnull buttonBackgroundNormalColor;
/** color of the action button's border during ID Scan screens. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull buttonBorderColor;
/** color of the action button's background when the button is pressed during ID Scan screens. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull buttonBackgroundHighlightColor;
/** color of the action button's text when the button is pressed during ID Scan screens. Default is a custom color. */
@property (nonatomic, strong) UIColor * _Nonnull buttonTextHighlightColor;
/** thickness of the action button's border. Default is 2.0. */
@property (nonatomic) int buttonBorderWidth;
/** corner radius of the action button's border, clipping the button's background. Default is 3.0. */
@property (nonatomic) int buttonCornerRadius;
/** font of the title during the ID Scan Selection screen. */
@property (nonatomic, strong) UIFont * _Nonnull headerFont;
/** font of the title's subtext during the ID Scan Capture and Review screens. */
@property (nonatomic, strong) UIFont * _Nonnull subtextFont;
/** font of the action button's text during the ID Scan screens. */
@property (nonatomic, strong) UIFont * _Nonnull buttonFont;
/** image displayed on the ID Scan Capture screen when the ID Document selected is an ID Card. */
@property (nonatomic, strong) UIImage * _Nullable captureScreenIDCardFrameImage;
/** image displayed on the ID Scan Capture screen when the ID Document selected is a Passport. */
@property (nonatomic, strong) UIImage * _Nullable captureScreenPassportFrameImage;
/** image displayed for the Torch button on the ID Scan Capture screen when the torch/flashlight is active/on. */
@property (nonatomic, strong) UIImage * _Nullable activeTorchButtonImage;
/** image displayed for the Torch button on the ID Scan Capture screen when the torch/flashlight is inactive/off. */
@property (nonatomic, strong) UIImage * _Nullable inactiveTorchButtonImage;

@end

/**
 * Customize the Guidance screens for Pre-Enroll and Retry.
 */
__attribute__((visibility("default")))
@interface ZoomGuidanceCustomization : NSObject
/** color of the mainscreen, Pre-Enrollment, and Retry screens' background. Default is custom color gradient. */
@property (nonatomic, copy) NSArray<UIColor *> * _Nonnull backgroundColors;
/** applies a UIBlurEffectStyle over the mainscreen, Pre-Enrollment, and Retry screens' background color during ZoOm. Default is off. */
@property (nonatomic) enum ZoomBlurEffectStyle blurEffectStyle;
/** color of the mainscreen, Pre-Enrollment, and Retry screens' foreground. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull foregroundColor;
/** color of the action button's text during Pre-Enrollment and Retry screens. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull buttonTextNormalColor;
/** color of the action button's background during Pre-Enrollment and Retry screens. Default is clear. */
@property (nonatomic, strong) UIColor * _Nonnull buttonBackgroundNormalColor;
/** color of the action button's border during Pre-Enrollment and Retry screens. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull buttonBorderColor;
/** color of the action button's background when the button is pressed during Pre-Enrollment and Retry screens. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull buttonBackgroundHighlightColor;
/** color of the action button's text when the button is pressed during Pre-Enrollment and Retry screens. Default is a custom color. */
@property (nonatomic, strong) UIColor * _Nonnull buttonTextHighlightColor;
/** thickness of the action button's border. Default is 2.0. */
@property (nonatomic) int buttonBorderWidth;
/** corner radius of the action button's border, clipping the button's background. Default is 3.0. */
@property (nonatomic) int buttonCornerRadius;
/** font of the title during the Pre-Enrollment screens. */
@property (nonatomic, strong) UIFont * _Nonnull headerFont;
/** font of the title's subtext during the Pre-Enrollment screens. */
@property (nonatomic, strong) UIFont * _Nonnull subtextFont;
/** font of the action button's text during the Pre-Enrollment and Retry screens. */
@property (nonatomic, strong) UIFont * _Nonnull buttonFont;
/* Only applicable for iPhone 4/4s. color of the text label background during Get Ready To ZoOm screen. **/
@property (nonatomic, strong) UIColor * _Nonnull readyScreenTextBackgroundColor;
/** Only applicable for iPhone 4/4s. corner radius of the text label background during Get Ready To ZoOm screen. **/
@property (nonatomic) int readyScreenTextBackgroundCornerRadius;
/** color of the Get Ready To ZoOm screen's oval fill. */
@property (nonatomic, strong) UIColor * _Nonnull readyScreenOvalFillColor;
/** Controls whether to show the 'zoom_branding_logo' image (or image configured with .imageCustomization.introScreenBrandingImage) on the first New User Guidance Screen. Default is false (hidden). */
@property (nonatomic) BOOL showIntroScreenBrandingImage;
/** Customize the Pre-Enrollment/Instruction/Retry images. */
@property (nonatomic, strong) ZoomGuidanceImagesCustomization * _Nonnull imageCustomization;
- (nonnull instancetype) init;
@end

/**
 * Customize the Results screen shown for Server-side work and response.
 */
__attribute__((visibility("default")))
@interface ZoomResultScreenCustomization : NSObject
/** color of the Result screen's background. Default is custom color gradient. */
@property (nonatomic, copy) NSArray<UIColor *> * _Nonnull backgroundColors;
/** applies a UIBlurEffectStyle over the Result screen's background color during ZoOm. Default is off. */
@property (nonatomic) enum ZoomBlurEffectStyle blurEffectStyle;
/** color of the Result screen's foreground. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull foregroundColor;
/** font of the status text during the Result screen. */
@property (nonatomic, strong) UIFont * _Nonnull messageFont;
/** color of the activity indicator during the Result screen, visible and animated while server request is in progress. Default is white. **/
@property (nonatomic, strong) UIColor * _Nonnull activityIndicatorColor;
/** color of the result animation's background color during the Result screen, visible and animated after the upload progress animation upon success. Default is white. **/
@property (nonatomic, strong) UIColor * _Nonnull resultAnimationBackgroundColor;
/** color of the result animation's foreground color during the Result screen, visible and animated after the upload progress animation upon success. Default is a custom color. **/
@property (nonatomic, strong) UIColor * _Nonnull resultAnimationForegroundColor;
/** color of the UIProgressView's progress fill during the Result screen, visible and animated while the server request is in progress. Default is white. **/
@property (nonatomic, strong) UIColor * _Nonnull uploadProgressFillColor;
/** color of the UIProgressView's track during the Result screen, visible while server request is in progress. Default is a semi-opaque black. **/
@property (nonatomic, strong) UIColor * _Nonnull uploadProgressTrackColor;
- (nonnull instancetype) init;
@end

/** Custom introduction and instruction images can be used for the Pre-Enrollment screens. */
__attribute__((visibility("default")))
@interface ZoomGuidanceImagesCustomization : NSObject
@property (nonatomic, strong) UIImage * _Nullable goodLightingImage;
@property (nonatomic, strong) UIImage * _Nullable goodAngleImage;
@property (nonatomic, strong) UIImage * _Nullable badLightingImage;
@property (nonatomic, strong) UIImage * _Nullable badAngleImage;
@property (nonatomic, strong) UIImage * _Nullable idealZoomImage;
@property (nonatomic, strong) UIImage * _Nullable cameraPermissionsScreenImage;
@property (nonatomic, strong) UIImage * _Nullable lockoutScreenLockedImage;
@property (nonatomic, strong) UIImage * _Nullable lockoutScreenUnlockedImage;
@property (nonatomic, strong) UIImage * _Nullable skipGuidanceButtonImage;
/** brand logo, which is shown on the introduction slide of the Pre-Enrollment screens. Default is the ZoOm logo. */
@property (nonatomic, strong) UIImage * _Nullable introScreenBrandingImage;
- (nonnull instancetype) init;
- (nonnull instancetype)initWithGoodLightingImage:(UIImage * _Nullable)goodLightingImage goodAngleImage:(UIImage * _Nullable)goodAngleImage badLightingImage:(UIImage * _Nullable)badLightingImage badAngleImage:(UIImage * _Nullable)badAngleImage idealZoomImage:(UIImage * _Nullable)idealZoomImage cameraPermissionsScreenImage:(UIImage * _Nullable)cameraPermissionsScreenImage lockoutScreenLockedImage:(UIImage * _Nullable)lockoutScreenLockedImage lockoutScreenUnlockedImage:(UIImage * _Nullable)lockoutScreenUnlockedImage errorScreenImage:(UIImage *_Nullable)errorScreenImage skipGuidanceButtonImage:(UIImage *_Nullable)skipGuidanceButtonImage introScreenBrandingImage:(UIImage * _Nullable)introScreenBrandingImage NS_SWIFT_NAME(init(goodLightingImage:goodAngleImage:badLightingImage:badAngleImage:idealZoomImage:cameraPermissionsScreenImage:lockoutScreenLockedImage:lockoutScreenUnlockedImage:errorScreenImage:skipGuidanceButtonImage:introScreenBrandingImage:));
@end

/**
 * Customize the look & feel of ZoOm oval.
 */
__attribute__((visibility("default")))
@interface ZoomOvalCustomization : NSObject
/** color of the outline of the oval during ZoOm. Default is black. */
@property (nonatomic, strong) UIColor * _Nonnull strokeColor;
/** thickness of the outline of the oval during ZoOm. Default is white. */
@property (nonatomic) int strokeWidth;
/** color of the animated 'progress spinner' strokes during ZoOm. Default for both is a custom blue. */
@property (nonatomic, strong) UIColor * _Nonnull progressColor1;
@property (nonatomic, strong) UIColor * _Nonnull progressColor2;
/** radial offset of the animated 'progress spinner' strokes relative to the outermost bounds of the oval outline. As this value increases, animations move closer toward the oval's center. Default is 16.0. */
@property (nonatomic) int progressRadialOffset;
/** thickness of the animated 'progress spinner' strokes during ZoOm. Default is 14.0. */
@property (nonatomic) int progressStrokeWidth;
- (nonnull instancetype) init;
@end

/**
 * Customize the look and ffeel of ZoOm feedback bar.
 * size and topMargin is not available in the default sdk because they are
 * frequently misconfigured by developers
 */
__attribute__((visibility("default")))
@interface ZoomFeedbackCustomization : NSObject
/** size of the feedback bar during ZoOm, which is relative to the current sizeRatio of the frame. Default is (355, 60). */
@property (nonatomic) CGSize size;
/** vertical spacing of the feedback bar from the top boundary of the ZoOm frame, which is relative to the current sizeRatio of the frame. */
@property (nonatomic) int topMargin;
/** corner radius of the feedback bar during ZoOm. Default is 3.0. */
@property (nonatomic) int cornerRadius;
/** spacing between characters displayed within the feedback bar during ZoOm. Default is 1.5. */
@property (nonatomic) float textSpacing;
/** color of the text displayed within the feedback bar during ZoOm. Default is white. */
@property (nonatomic, strong) UIColor * _Nonnull textColor;
/** font of the text displayed within the feedback bar during ZoOm. Default is a custom font style. */
@property (nonatomic) UIFont * _Nonnull textFont;
/** allow pulsating-text animation within the feedback bar during ZoOm. */
@property (nonatomic) BOOL enablePulsatingText;
/** color of the feedback bar's background. Default is a custom color gradient. */
@property (nonatomic, strong) CAGradientLayer * _Nonnull backgroundColor;
- (nonnull instancetype) init;
@end

/**
 * Customize the look and feel of ZoOm frame.
 * sizeRatio and topMargin is not available in the default sdk because they are
 * frequently misconfigured by developers.
 */
__attribute__((visibility("default")))
@interface ZoomFrameCustomization : NSObject
/** size ratio of the ZoOm frame's width relative to the width the the current device's display. Default is 0.88. */
@property (nonatomic) float sizeRatio;
/** vertical spacing of the ZoOm frame from the top boundary of the current device's display. Deafult is 100.0. */
@property (nonatomic) int topMargin;
/** corner radius of the ZoOm frame's border. Default is 5.0. */
@property (nonatomic) int cornerRadius;
/** thickness of the ZoOm frame's border. Default is 2.0. */
@property (nonatomic) int borderWidth;
/** color of the ZoOm frame's border. Default is white. */
@property (nonatomic) UIColor * _Nonnull borderColor;
/** color of the ZoOm frame's background. Default is a custom ZoOm color. */
@property (nonatomic) UIColor * _Nonnull backgroundColor;
/** applies a UIBlurEffectStyle over the oval background color during ZoOm. Default is off. */
@property (nonatomic) enum ZoomBlurEffectStyle blurEffectStyle;
/** behavior of the ZoOm frame when its sizeRatio is set to 1.0. Specific behavior for iPhone X models. */
@property (nonatomic) enum ZoomFullScreenBehavior fullScreenBehavior;
- (nonnull instancetype) init;
@end

__attribute__((visibility("default")))
@interface ZoomCancelButtonCustomization : NSObject
/** custom cancel button image to use instead of the default 'X'. */
@property (nonatomic, strong) UIImage * _Nullable customImage;
/** Image displayed for the ZoOm Cancel Button when Low Light Mode is activated during ZoOm. Default is configured to use imaged named 'zoom_cancel_low_light' located in application's Assets folder.  */
@property (nonatomic, strong) UIImage * _Nullable customImageLowLight;
/** location, or use, of the cancel button during ZoOm, Pre-Enrollment, and Retry screens. Default is top right. */
@property (nonatomic) enum ZoomCancelButtonLocation location;
- (nonnull instancetype) init;
@end

/**
 * Customize the app overlay, separating the ZoOm Interface from the presenting application.
 */
__attribute__((visibility("default")))
@interface ZoomOverlayCustomization : NSObject
/** color of the main interface's background while ZoOm is active. */
@property (nonatomic, copy) UIColor * _Nonnull backgroundColor;
/** applies a UIBlurEffectStyle over the main interface background color while ZoOm is active. Default is off. */
@property (nonatomic) enum ZoomBlurEffectStyle blurEffectStyle;
/** the branding image that will be centered below the ZoOm frame and above the bottom layout guide for the device's screen, visible while ZoOm is presenting. */
@property (nonatomic, strong) UIImage * _Nullable brandingImage;
- (nonnull instancetype) init;
@end

enum ZoomSDKStatus : NSInteger;
enum ZoomSessionStatus: NSInteger;
enum ZoomVerificationStatus: NSInteger;
enum ZoomIDScanStatus: NSInteger;
enum ZoomIDType: NSInteger;
enum ZoomIDScanRetryMode: NSInteger;
enum ZoomManagedSessionStatus: NSInteger;
enum ZoomManagedSessionStatusSubCode: NSInteger;
enum ZoomManagedSessionMode: NSInteger;

@class UIViewController;
@protocol ZoomSessionDelegate;
@protocol ZoomVerificationDelegate;
@protocol ZoomFaceMapProcessorDelegate;
@protocol ZoomFaceMapResultCallback;
@protocol ZoomIDScanProcessorDelegate;
@protocol ZoomIDScanResultCallback;
@protocol ZoomManagedSessionDelegate;

/**
 The ZoomSDKProtocol exposes methods the app can use to configure the behavior of ZoOm.
 */
@protocol ZoomSDKProtocol

/**
 Initialize the ZoOm SDK using your license key identifier for online validation.
 This <em>must</em> be called at least once by the application before invoking any SDK operations.
 This function may be called repeatedly without harm.

 @param licenseKeyIdentifier Identifies the client for determination of license capabilities
 @param preloadZoomSDK boolean to execute preload()
 @param completion Callback after license validation has completed
 */
- (void)initialize:(NSString * _Nonnull)licenseKeyIdentifier preloadZoomSDK:(BOOL)preloadZoomSDK completion:(void (^ _Nullable)(BOOL))completion NS_SWIFT_NAME(initialize(licenseKeyIdentifier:preloadZoomSDK:completion:));

/**
 Initialize the ZoOm SDK using your license key identifier for online validation.
 This <em>must</em> be called at least once by the application before invoking any SDK operations.
 This function may be called repeatedly without harm.
 
 @param licenseKeyIdentifier Identifies the client for determination of license capabilities
 @param completion Callback after license validation has completed
 */
- (void)initialize:(NSString * _Nonnull)licenseKeyIdentifier completion:(void (^ _Nullable)(BOOL))completion NS_SWIFT_NAME(initialize(licenseKeyIdentifier:completion:));

/**
 Initialize the ZoOm SDK using your license file for offline validation.
 This <em>must</em> be called at least once by the application before invoking any SDK operations.
 This function may be called repeatedly without harm.
 
 @param licenseText The string contents of the license file
 @param licenseKeyIdentifier Identifies the client
 @param preloadZoomSDK boolean to execute preload()
 @param completion Callback after license validation has completed
 */
- (void)initializeWithLicense:(NSString * _Nonnull)licenseText licenseKeyIdentifier:(NSString * _Nonnull)licenseKeyIdentifier preloadZoomSDK:(BOOL)preloadZoomSDK completion:(void (^ _Nullable)(BOOL))completion NS_SWIFT_NAME(initialize(licenseText:licenseKeyIdentifier:preloadZoomSDK:completion:));

/**
 Initialize the ZoOm SDK using your license file for offline validation.
 This <em>must</em> be called at least once by the application before invoking any SDK operations.
 This function may be called repeatedly without harm.
 
 @param licenseText The string contents of the license file
 @param licenseKeyIdentifier Identifies the client
 @param completion Callback after license validation has completed
 */
- (void)initializeWithLicense:(NSString * _Nonnull)licenseText licenseKeyIdentifier:(NSString * _Nonnull)licenseKeyIdentifier completion:(void (^ _Nullable)(BOOL))completion NS_SWIFT_NAME(initialize(licenseText:licenseKeyIdentifier:completion:));

/**
 Configures the look and feel of ZoOm.

 @param customization An instance of ZoomCustomization
 */
- (void)setCustomization:(ZoomCustomization * _Nonnull)customization;

/**
 Convenience method to check if the ZoOm Device License Key Identifier is valid.
 ZoOm requires that the app successfully initializes the SDK and receives confirmation of a valid Device License Key Identifier at least once before launching a ZoOm session.  After the initial validation, the SDK will allow a limited number of sessions without any further requirement for successful round-trip connection to the ZoOm server. This allows the app to use ZoOm for a limited time without network connectivity.  During this ‘grace period’, the function will return ‘true’.

 @return True, if the SDK license has been validated, false otherwise.
 */
- (BOOL)isLicenseValid;

/**
 Returns the current status of the ZoOm SDK.
 @return ZoomSDKStatusInitialized, if ready to be used.
 */
- (enum ZoomSDKStatus)getStatus;

/**
 Convenience method to get the time when a lockout will end.
 This will be null if the user is not locked out
 @return NSDate
 */
- (NSDate * _Nullable)getLockoutEndTime;

/**
 * @return True if the user is locked out of ZoOm
 */
- (BOOL)isLockedOut;

/**
 Preload ZoOm – this can be used to reduce the amount of time it takes to initialize a ZoOm view controller.  Preload is automatically called during initialize.
 You may want to call this function when transitioning to a ViewController in your application from which you intend to launch ZoOm.
 This ensures that ZoOm will launch as quickly as possible when requested.
 */
- (void)preload;

/**
 Unload resources related to ZoOm.
 */
- (void)unload;

/**
 Convenience method to check for camera permissions.
 This function is used to check the camera permission status prior to using ZoOm.  If camera permission has not been previously granted,
 ZoOm will display a UI asking the user to allow permission.  Some applications may wish to manage camera permission themselves - those applications
 should verify camera permissions prior to transitioning to ZoOm.

 @return Value representing the current camera permission status
 */
@property (nonatomic, readonly) enum ZoomCameraPermissionStatus cameraPermissionStatus;

/** Sets a prefered language to be used for all strings. */
- (void)setLanguage:(NSString * _Nonnull)language;

/**
 Configure where the ZoOm SDK looks for custom localized strings.
 @param table Optional name of the string table to look in.  By default, this is "Zoom" and string will be read from Zoom.strings.
 @param bundle Optional NSBundle instance to search for ZoOm string definitions in.  This will be searched after the main bundle and before ZoOm's default strings.
 */
- (void)configureLocalizationWithTable:(NSString * _Nullable)table bundle:(NSBundle * _Nullable)bundle;

/**
 Sets the type of audit trail images to be collected.
 If this property is not set to Disabled, then ZoOm will include a sample of some of the camera frames collected during the ZoOm session.
 */
@property (nonatomic) enum ZoomAuditTrailType auditTrailType;

/**
 Sets whether ZoOm will collect and return time based session images.
 If enabled this feature will return an array of optional UIImages whose size is dictated by the auditTrailType enum.
 */
@property (nonatomic) BOOL enableTimeBasedSessionImages;

/**
 Sets the time in seconds before a timeout occurs in the ZoOm session.
 This value has to be between 30 and 60 seconds. If it’s lower than 30 or higher than 60, it
 will be defaulted to 30 or 60 respectively.
 */
@property (nonatomic) NSInteger activeTimeoutInSeconds;

/**
 Fetches the version number of the current ZoOm SDK release
 
 @return Version number of sdk release package
 */
@property (nonatomic, readonly, copy) NSString * _Nonnull version;

/**
 Set the encryption key to be used for ZoOm Server FaceMaps
 
 @param publicKey RSA public key to be used in PEM format
 
 @return TRUE if the key was valid
 */
- (bool)setFaceMapEncryptionKeyWithPublicKey:(NSString * _Nonnull)publicKey NS_SWIFT_NAME(setFaceMapEncryptionKey(publicKey:));

/**
 * Method to create a valid string to pass as the value for the User-Agent header when calling the FaceTec Managed API.
 * @param sessionId Unique Id for a ZoOm session. This can be obtained from ZoomSessionResult.
 * @return a string that can be used as the value for the User-Agent header.
 */
- (NSString * _Nonnull)createZoomAPIUserAgentString:(NSString * _Nonnull)sessionId;

/**
 Configures and returns a new UIViewController for a ZoOm session.
 Caller should call presentViewController on returned object only once.
 
 @param delegate The delegate on which the application wishes to receive status results from the session.
 */
- (UIViewController * _Nonnull)createSessionVCWithDelegate:(id <ZoomSessionDelegate> _Nonnull)delegate NS_SWIFT_NAME(createSessionVC(delegate:));

- (UIViewController * _Nonnull)createSessionVCWithDelegate:(id <ZoomSessionDelegate> _Nonnull)delegate faceMapProcessorDelegate:(id <ZoomFaceMapProcessorDelegate> _Nullable)faceMapProcessorDelegate NS_SWIFT_NAME(createSessionVC(delegate:faceMapProcessorDelegate:));

- (UIViewController * _Nonnull)createSessionVCWithDelegate:(id <ZoomSessionDelegate> _Nonnull)delegate faceMapProcessorDelegate:(id <ZoomFaceMapProcessorDelegate> _Nullable)faceMapProcessorDelegate  zoomIDScanProcessorDelegate:(id <ZoomIDScanProcessorDelegate> _Nullable)zoomIDScanProcessorDelegate NS_SWIFT_NAME(createSessionVC(delegate:faceMapProcessorDelegate:zoomIDScanProcessorDelegate:));

/**
 Deprecated
 Configures and returns a new UIViewController that is used to launch a ZoOm Session.
 Caller should call presentViewController on returned object only once.
 
 @param delegate The delegate on which the application wishes to receive status results from the Verification
 */
- (UIViewController * _Nonnull)createVerificationVCWithDelegate:(id <ZoomVerificationDelegate> _Nonnull)delegate NS_SWIFT_NAME(createVerificationVC(delegate:)) DEPRECATED_MSG_ATTRIBUTE("Use createSessionVC...");

/** Returns a description string for a ZoomManagedSessionStatus value */
- (NSString * _Nonnull)descriptionForManagedSessionStatus:(enum ZoomManagedSessionStatus)status;

/** Returns a description string for a ZoomManagedSessionStatusSubCode value */
- (NSString * _Nonnull)descriptionForManagedSessionStatusSubCode:(enum ZoomManagedSessionStatusSubCode)statusSubcode;

/** Returns a description string for a ZoomSessionStatus value */
- (NSString * _Nonnull)descriptionForSessionStatus:(enum ZoomSessionStatus)status;

/** Returns a description string for a ZoomVerificationStatus value */
- (NSString * _Nonnull)descriptionForVerificationStatus:(enum ZoomVerificationStatus)status;

/** Returns a description string for a ZoomSDKStatus value */
- (NSString * _Nonnull)descriptionForSDKStatus:(enum ZoomSDKStatus)status;
@end

/** Represents the status of the SDK */
typedef NS_ENUM(NSInteger, ZoomSDKStatus) {
    /** Initialize was never attempted. */
    ZoomSDKStatusNeverInitialized = 0,
    /** The License provided was verified. */
    ZoomSDKStatusInitialized = 1,
    /** The Device License Key Identifier could not be verified due to connectivity issues on the user's device. */
    ZoomSDKStatusNetworkIssues = 2,
    /** The Device License Key Identifier provided was invalid. */
    ZoomSDKStatusInvalidDeviceLicenseKeyIdentifier = 3,
    /** This version of the ZoOm SDK is deprecated. */
    ZoomSDKStatusVersionDeprecated = 4,
    /** The Device License Key Identifier needs to be verified again. */
    ZoomSDKStatusOfflineSessionsExceeded = 5,
    /** An unknown error occurred. */
    ZoomSDKStatusUnknownError = 6,
    /** Device is locked out due to too many failures. */
    ZoomSDKStatusDeviceLockedOut = 7,
    /** Device is in landscape display orientation. ZoOm can only be used in portrait display orientation. */
    ZoomSDKStatusDeviceInLandscapeMode = 8,
    /** Device is in reverse portrait mode. ZoOm can only be used in portrait display orientation. */
    ZoomSDKStatusDeviceInReversePortraitMode = 9,
    /** License was expired, contained invalid text, or you are attempting to initialize in an App that is not specified in your license. */
    ZoomSDKStatusLicenseExpiredOrInvalid,
    /** The provided public encryption key is missing or invalid. */
    ZoomSDKStatusEncryptionKeyInvalid,
};

@protocol ZoomSessionResult;
@protocol ZoomVerificationResult;
@protocol ZoomIDScanResult;
enum ZoomSessionStatus : NSInteger;
enum ZoomVerificationStatus : NSInteger;

/**
 Applications should implement this delegate to receive results from a ZoomSession UIViewController.
 */
@protocol ZoomSessionDelegate <NSObject>
/**
 This method will be called exactly once after the ZoOm Session has completed and when NOT using the ZoomSession constructor with a ZoomFaceMapProcessor (i.e. Unmanaged Sessions).
 @param result A ZoomSessionResult instance.
 */
@optional
- (void)onZoomSessionCompleteWithResult:(id<ZoomSessionResult> _Nonnull)result NS_SWIFT_NAME(onZoomSessionComplete(result:));
/**
 This method will be called exactly once after the ZoOm Session has completed and when using the ZoomSession constructor with a ZoomFaceMapProcessor.
 */
@optional
- (void)onZoomSessionComplete NS_SWIFT_NAME(onZoomSessionComplete());
/**
 Optional callback function to be called when ZoOm is about to be dismissed.
 @param status The ZoomSessionStatus for the ZoOm Session.
 @return TRUE if you want to handle the dismissal of the ZoOm view controller.
 */
@optional
- (bool)onBeforeZoomDismissWithStatus:(enum ZoomSessionStatus)status NS_SWIFT_NAME(onBeforeZoomDismiss(status:)) DEPRECATED_MSG_ATTRIBUTE("Use onBeforeZoomDismissWithResult");
/**
 Optional callback function to be called when ZoOm is about to be dismissed.
 @param result The ZoomSessionResult for the ZoOm session.
 @return TRUE if you want to handle the dismissal of the ZoOm view controller.
 */
@optional
- (bool)onBeforeZoomDismissWithResult:(id<ZoomSessionResult> _Nonnull)result NS_SWIFT_NAME(onBeforeZoomDismiss(result:));
@end

/**
 ZoomFaceMapProcessorDelegate
 */
@protocol ZoomFaceMapProcessorDelegate <NSObject>
- (void)processZoomSessionResultWhileZoomWaits:(id<ZoomSessionResult> _Nonnull)zoomSessionResult zoomFaceMapResultCallback:(id<ZoomFaceMapResultCallback> _Nonnull)zoomFaceMapResultCallback NS_SWIFT_NAME(processZoomSessionResultWhileZoomWaits(zoomSessionResult:zoomFaceMapResultCallback:));
@end

/**
 ZoomIDScanProcessorDelegate
 */
@protocol ZoomIDScanProcessorDelegate <NSObject>
- (void)processZoomIDScanResultWhileZoomWaits:(id<ZoomIDScanResult> _Nonnull)zoomIDScanResult zoomIDScanResultCallback:(id<ZoomIDScanResultCallback> _Nonnull)zoomIDScanResultCallback NS_SWIFT_NAME(processZoomIDScanResultWhileZoomWaits(zoomIDScanResult:zoomIDScanResultCallback:));
@end


/**
 ZoomFaceMapResultCallback
 */
@protocol ZoomFaceMapResultCallback <NSObject>
- (void)onFaceMapUploadProgress:(float)uploadedPercent NS_SWIFT_NAME(onFaceMapUploadProgress(uploadedPercent:));
- (void)onFaceMapResultSucceed NS_SWIFT_NAME(onFaceMapResultSucceed());
- (void)onFaceMapResultRetry NS_SWIFT_NAME(onFaceMapResultRetry());
- (void)onFaceMapResultCancel NS_SWIFT_NAME(onFaceMapResultCancel());
@end

/**
 ZoomIDScanResultCallback
 */
@protocol ZoomIDScanResultCallback <NSObject>
- (void)onIDScanUploadProgress:(float)uploadedPercent NS_SWIFT_NAME(onIDScanUploadProgress(uploadedPercent:));
- (void)onIDScanResultSucceed NS_SWIFT_NAME(onIDScanResultSucceed());
- (void)onIDScanResultRetry:(enum ZoomIDScanRetryMode)retryMode NS_SWIFT_NAME(onIDScanResultRetry(retryMode:));
- (void)onIDScanResultCancel NS_SWIFT_NAME(onIDScanResultCancel());
@end

/**
 Deprecated.
 Applications should implement this delegate to receive results from a ZoomVerification UIViewController.
 */
DEPRECATED_MSG_ATTRIBUTE("Use ZoomSessionDelegate and createZoomSessionVC")
@protocol ZoomVerificationDelegate <NSObject>
/**
 This method will be called exactly once after the Zoom Session has completed.
 @param result A ZoomVerificationResult instance.
 */
- (void)onZoomVerificationResultWithResult:(id<ZoomVerificationResult> _Nonnull)result NS_SWIFT_NAME(onZoomVerificationResult(result:));
/**
 Optional callback function to be called when ZoOm is about to be dismissed.
 @param status The ZoomVerificationStatus for the ZoOm session.
 @return TRUE if you want to handle the dismissal of the ZoOm view controller.
 */
@optional
- (bool)onBeforeZoomDismissWithStatus:(enum ZoomVerificationStatus)status NS_SWIFT_NAME(onBeforeZoomDismiss(status:));
@end

@protocol ZoomManagedSessionDelegate <NSObject>
- (void)onZoomManagedSessionCompleteWithStatus:(enum ZoomManagedSessionStatus)zoomManagedSessionStatus NS_SWIFT_NAME(onZoomManagedSessionComplete(status:));
@end

/** Represents results of a Zoom Session Request */
@protocol ZoomSessionResult <NSObject>
/** Indicates whether the ZoOm Session was completed successfully or the cause of the unsuccess. */
@property (nonatomic, readonly) enum ZoomSessionStatus status;
/** Metrics collected during the ZoOm Session. */
@property (nonatomic, readonly, strong) id<ZoomFaceBiometricMetrics> _Nullable faceMetrics;
/** Number of full sessions (both retry and success) that the user performed from the time ZoOm was invoked to the time control is handed back to the application. */
@property (nonatomic, readonly) NSInteger countOfZoomSessionsPerformed;
/** Unique id for a ZoOm Session. */
@property (nonatomic, readonly, copy) NSString * _Nonnull sessionId;
@end

/** Represents results of a Zoom ID Scan */
@protocol ZoomIDScanResult <NSObject>
/** Indicates whether the ID Scan succeeded or the cause of failure. */
@property (nonatomic, readonly) enum ZoomIDScanStatus status;
/** Indicates the ID type. */
@property (nonatomic, readonly) enum ZoomIDType idType;
/** ID Scan Metrics */
@property (nonatomic, readonly, strong) id<ZoomIDScanMetrics> _Nullable idScanMetrics;
@end

/** Deprecated. Represents results of a Zoom Session Request */
DEPRECATED_ATTRIBUTE
@protocol ZoomVerificationResult <NSObject>
/** Indicates whether the ZoOm Session was completed successfully or the cause of the unsuccess. */
@property (nonatomic, readonly) enum ZoomVerificationStatus status;
/** Metrics collected during the ZoOm Session. */
@property (nonatomic, readonly, strong) id<ZoomFaceBiometricMetrics> _Nullable faceMetrics;
/** Number of ZoOm Sessions that the user performed from the time ZoOm was invoked to the time control is handed back to the application. */
@property (nonatomic, readonly) NSInteger countOfZoomSessionsPerformed;
/** Unique id for a ZoOm Session. */
@property (nonatomic, readonly, copy) NSString * _Nonnull sessionId;
@end

/** Represents the various end states of a ZoOm Session */
typedef NS_ENUM(NSInteger, ZoomSessionStatus) {
    /**
     The ZoOm Session was performed successfully and a FaceMap was generated.  Pass the FaceMap to ZoOm Server for further processing.
     */
    ZoomSessionStatusSessionCompletedSuccessfully,
    /**
     The ZoOm Session was not performed successfully and a FaceMap was not generated.  In general, other statuses will be sent to the developer for specific unsuccess reasons.
     */
    ZoomSessionStatusSessionUnsuccessful,
    /**
     The user pressed the cancel button and did not complete the ZoOm Session.
     */
    ZoomSessionStatusUserCancelled,
    /**
     This status will never be returned in a properly configured or production app.
     This status is returned if your license is invalid or network connectivity issues occur during a session when the application is not in production.
     */
    ZoomSessionStatusNonProductionModeLicenseInvalid,
    /**
     The camera access is prevented because either the user has explicitly denied permission or the user's device is configured to not allow access by a device policy.
     For more information on restricted by policy case, please see the the Apple Developer documentation on AVAuthorizationStatus.restricted.
     */
    ZoomSessionStatusCameraPermissionDenied,
    /**
     The ZoOm Session was cancelled due to the app being terminated, put to sleep, an OS notification, or the app was placed in the background.
     */
    ZoomSessionStatusContextSwitch,
    /**
     The ZoOm Session was cancelled because device is in landscape mode.
     The user experience of devices in these orientations is poor and thus portrait is required.
     */
    ZoomSessionStatusLandscapeModeNotAllowed,
    /**
     The ZoOm Session was cancelled because device is in reverse portrait mode.
     The user experience of devices in these orientations is poor and thus portrait is required.
     */
    ZoomSessionStatusReversePortraitNotAllowed,
    /**
     The ZoOm Session was cancelled because the user was unable to complete a ZoOm Session in the default allotted time or the timeout set by the developer.
     */
    ZoomSessionStatusTimeout,
    /**
     The ZoOm Session was cancelled due to memory pressure.
     */
    ZoomSessionStatusLowMemory,
    /**
     The ZoOm Session was cancelled because your App is not in production and requires a network connection.
     */
    ZoomSessionStatusNonProductionModeNetworkRequired,
    /**
     The ZoOm Session was cancelled because your License needs to be validated again.
     */
    ZoomSessionStatusGracePeriodExceeded,
    /**
     The ZoOm Session was cancelled because the developer-configured encryption key was not valid.
     */
    ZoomSessionStatusEncryptionKeyInvalid,
    /**
     The ZoOm Session was cancelled because not all guidance images were configured.
     */
     ZoomSessionStatusMissingGuidanceImages,
    /**
     The ZoOm Session was cancelled because ZoOm was unable to start the camera on this device.
     */
     ZoomSessionStatusCameraInitializationIssue,
    /**
     The ZoOm Session was cancelled because the user was in a locked out state.
     */
    ZoomSessionStatusLockedOut,
    /**
     The ZoOm Session was cancelled because of an unknown and unexpected error.  ZoOm leverages a variety of iOS APIs including camera, storage, security, networking, and more.
     This return value is a catch-all for errors experienced during normal usage of these APIs.
     */
    ZoomSessionStatusUnknownInternalError
};

/** Deprecated. Represents the various end states of a verification session */
DEPRECATED_ATTRIBUTE
typedef NS_ENUM(NSInteger, ZoomVerificationStatus) {
    /**
     The user was successfully processed. Device liveness and quality checks passed and a FaceMap was created.
     */
    ZoomVerificationStatusUserProcessedSuccessfully,
    /**
     The user was not processed successfully.
     This could be a liveness failure or a failure on the part of the user to perform a ZoOm correctly and/or with sufficiently good environmental conditions.
     A FaceMap was created if there were sufficient frames provided by the user.
     */
    ZoomVerificationStatusUserNotProcessed,
    /**
     The user cancelled out of the verification session rather than completing it.
     A FaceMap will not be created.
     */
    ZoomVerificationStatusFailedBecauseUserCancelled,
    /**
     When not using an offline license, ZoOm requires the developer to pass a valid Device License Key Identifier in order to function.
     This status will never be returned in a properly configured app, as the ZoOm APIs allow you to check Device License Key Identifier validity before invoking ZoOm UI.
     */
    ZoomVerificationStatusFailedBecauseAppTokenNotValid,
    /**
     The camera access is prevented because either the user has explicitly denied permission or
     the user's device is configured to not allow access by a device policy.
     For more information on restricted by policy case, please see the the Apple Developer documentation on AVAuthorizationStatus.restricted.
     */
    ZoomVerificationStatusFailedBecauseCameraPermissionDenied,
    /**
     Verification was terminated due to the app being terminated, put to sleep or to the background.
     A FaceMap will not be created.
     */
    ZoomVerificationStatusFailedBecauseOfOSContextSwitch,
    /**
     Verification was cancelled because device is in landscape mode.
     The user experience of devices in these orientations is poor and thus portrait is required.
     */
    ZoomVerificationStatusFailedBecauseOfLandscapeMode,
    /**
     Verification was cancelled because device is in reverse portrait mode.
     The user experience of devices in these orientations is poor and thus portrait is required.
     */
    ZoomVerificationStatusFailedBecauseOfReversePortraitMode,
    /**
     The user was unable to complete a session in the allotted time set by the developer.
     A FaceMap will not be created.
     */
    ZoomVerificationStatusFailedBecauseOfTimeout,
    /**
     Verification failed due to low memory.
     A FaceMap will not be created.
     */
    ZoomVerificationStatusFailedBecauseOfLowMemory,
    /**
     When not using an offline license, ZoOm requires network connection when being used.
     */
    ZoomVerificationStatusFailedBecauseNoConnectionInDevMode,
    /**
     When not using an offline license, ZoOm allows a number of sessions to occur without validating the Device License Key Identifier to handle scenarios where
     an end user might have lost connection to a network. Once that limit has been exceeded this failure will
     be returned.
     */
    ZoomVerificationStatusFailedBecauseOfflineSessionsExceeded,
    /**
     When configuring ZoOm to return FaceMaps, a valid ZoOm Server encryption key is required.
     Note: Liveness checks can occur without setting an encryption key.
     */
    ZoomVerificationStatusFailedBecauseEncryptionKeyInvalid,
    /**
     The ZoOm Session could not be started because not all guidance images were specified.  This indicates that ZoOm was not properly integrated/configured rather than an actual failure.
     */
    ZoomVerificationStatusFailedBecauseMissingGuidanceImages,
    /**
     The ZoOm Session was cancelled because the user was in a locked out state.
     */
    ZoomVerificationStatusLockedOut,
    /**
     Verification failed because of an unknown and unexpected error.
     ZoOm leverages a variety of iOS APIs including camera, storage, security, networking, and more.
     This return value is a catch-all for errors experienced during normal usage of these APIs.
     */
    ZoomVerificationStatusUnknownError
};

/** Represents the various end states of a ID Scan session */
typedef NS_ENUM(NSInteger, ZoomIDScanStatus) {
    /**
     The ID Scan was successful.
     */
    ZoomIDScanStatusSuccess,
    /**
     The ID Scan was not successful.
     */
    ZoomIDScanStatusUnsuccess,
    /**
     User cancelled ID Scan.
     */
    ZoomIDScanStatusUserCancelled,
    /**
     Timeout during ID Scan.
     */
    ZoomIDScanStatusTimedOut,
    /**
     User context switched away from app during ID Scan.
     */
    ZoomIDScanStatusContextSwitch,
    /**
     Camera error during ID Scan.
     */
    ZoomIDScanStatusCameraError,
    /**
     Network error during ID Scan.
     */
    ZoomIDScanStatusNetworkError
};

/** Represents the type of ID Scan */
typedef NS_ENUM(NSInteger, ZoomIDType) {
    /**
     ID card type
     */
    ZoomIDTypeIDCard,
    /**
     Passport type
     */
    ZoomIDTypePassport,
    /**
     ID type was not selected so it is unknown
     */
    ZoomIDTypeNotSelected
};

/** Represents the optionals available for retrying part or all of the ID Scan process */
typedef NS_ENUM(NSInteger, ZoomIDScanRetryMode) {
    ZoomIDScanRetryModeFront,
    ZoomIDScanRetryModeBack,
    ZoomIDScanRetryModeFrontAndBack
};

typedef NS_ENUM(NSInteger, ZoomManagedSessionStatus) {
    ZoomManagedSessionStatusSuccess = 0,
    ZoomManagedSessionStatusUnsuccessCheckSubcode = 1
};

typedef NS_ENUM(NSInteger, ZoomManagedSessionStatusSubCode) {
    ZoomManagedSessionStatusSubCodeNeverStarted = 0,
    ZoomManagedSessionStatusSubCodeInternalUnsuccess = 1,
    ZoomManagedSessionStatusSubCodeInvalidManagedSessionParameters = 2,
    ZoomManagedSessionStatusSubCodePortraitModeRequired = 3,
    ZoomManagedSessionStatusSubCodeLockedOut = 4,
    ZoomManagedSessionStatusSubCodeCameraError = 5,
    ZoomManagedSessionStatusSubCodeContextSwitch = 6,
    ZoomManagedSessionStatusSubCodeUserCancelled = 7,
    ZoomManagedSessionStatusSubCodeTimeout = 8,
    ZoomManagedSessionStatusSubCodeNetworkError = 9,
    ZoomManagedSessionStatusSubCodeMissingGuidanceImages = 10,
    ZoomManagedSessionStatusSubCodeCompletedSuccessfully = 11,
    ZoomManagedSessionStatusSubCodeCheckLatestFaceTecAPIResponseString = 12
};

typedef NS_ENUM(NSInteger, ZoomManagedSessionMode) {
    ZoomManagedSessionModeLiveness = 0,
    ZoomManagedSessionModeEnroll = 1,
    ZoomManagedSessionModeAuthenticate = 2,
    ZoomManagedSessionModeIdentityCheck = 3
};

/*
 * Defines the callback that will be called to convey the status of an enrollment.
 */
@protocol ZoomEnrollmentStatusCallback <NSObject>
- (void)onCheckEnrollmentResult:(BOOL)isEnrolled;
@end

/*
 * Defines the callback that will be called to convey the status of a deletion of an enrollment.
 */
@protocol ZoomDeleteUserCallback <NSObject>
- (void) onDeleteUsertResult:(BOOL)isDeleted;
@end

__attribute__((visibility("default")))
@interface ZoomManagedSession : NSObject <ZoomSessionDelegate>
@property (nonatomic, readonly) id<ZoomManagedSessionDelegate> _Nonnull delegate;
@property (nonatomic, readonly) id<ZoomSessionResult> _Nullable latestZoomSessionResult;
@property (nonatomic, readonly) id<ZoomIDScanResult> _Nullable latestZoomIDScanResult;
@property (nonatomic, readonly) enum ZoomManagedSessionMode mode;
@property (nonatomic, readonly) enum ZoomManagedSessionStatusSubCode latestZoomManagedSessionStatusSubCode;
@property (nonatomic, readonly) NSString * _Nonnull latestFaceTecAPIResponseString;
@property (nonatomic, readonly) NSString * _Nonnull licenseKey;
@property (nonatomic, readonly) NSString * _Nonnull zoomServerBaseURL;

- (nonnull instancetype)initWithDelegate:(id<ZoomManagedSessionDelegate>_Nonnull)delegate fromVC:(UIViewController *_Nonnull)fromVC licenseKey:(NSString * _Nonnull)licenseKey zoomServerBaseURL:(NSString * _Nonnull)zoomServerBaseURL mode:(enum ZoomManagedSessionMode)mode enrollmentIdentifier:(NSString *_Nullable)enrollmentIdentifier;
- (id _Nonnull)initWithDelegate:(id<ZoomManagedSessionDelegate>_Nonnull) delegate fromVC:(UIViewController *_Nonnull)fromVC licenseKey:(NSString * _Nonnull)licenseKey zoomServerBaseURL:(NSString * _Nonnull)zoomServerBaseURL mode:(enum ZoomManagedSessionMode)mode;
+ (void)checkEnrollmentStatus:(_Nonnull id <NSURLSessionDelegate>)delegate deviceLicenseKeyIdentifier:(NSString * _Nonnull)deviceLicenseKeyIdentifier zoomServerBaseURL:(NSString * _Nonnull)zoomServerBaseURL identifier:(NSString * _Nonnull)identifier enrollmentStatusCallback:(id<ZoomEnrollmentStatusCallback> _Nonnull)enrollmentStatusCallback;
+ (void)deleteExistingUser:(_Nonnull id <NSURLSessionDelegate>)delegate deviceLicenseKeyIdentifier:(NSString * _Nonnull)deviceLicenseKeyIdentifier zoomServerBaseURL:(NSString * _Nonnull)zoomServerBaseURL identifier:(NSString * _Nonnull)identifier deleteUserCallback:(id<ZoomDeleteUserCallback> _Nonnull)deleteUserCallback;
@end

