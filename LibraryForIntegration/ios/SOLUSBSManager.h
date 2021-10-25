//
//  SOLUSBSManager.h
//  Rnsolus
//
//  Created by plusinfosys on 25/08/21.
//  Copyright © 2021 Facebook. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <SolusIntegrationLibrary/SOLUSIntegrationLibrary.h>

@class SOLUSNetworkRequestManager;

@interface SOLUSBSManager : NSObject

-(nonnull NSString*)getSummaryAndClearRegistration;
-(void)registerPasswordField:(nullable UITextField*)textField;
-(void)stopMotionDetect;
-(void)updateWithBeaviosecModel:(nonnull SOLUSBehavioSecModel*)model;
-(void)startMotionDetect;

@property (nonatomic, nullable, strong, readonly) NSString *behaviorPolicy;
@property (nonatomic, nullable, strong, readonly) NSString *behaviorScore;
@property (nonatomic, nullable, strong, readonly) NSString *behaviorConfidence;
@property (nonatomic, readonly) BOOL isRegistered;

@end
