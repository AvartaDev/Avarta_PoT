

#import <React/RCTBridgeModule.h>
//#import "Frameworks/FaceTecSDK.framework/Headers/FaceTecSDK.h"
#import <FaceTecSDK/FaceTecSDK.h>
@interface Rnsolus : NSObject <RCTBridgeModule>

-(void)onProcessingComplete:(BOOL *)isSuccess zoomSessionResult: FaceTecSessionResult;


@end
