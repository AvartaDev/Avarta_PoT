//
//  SOLUSBSManager.m
//  Rnsolus
//
//  Created by plusinfosys on 25/08/21.
//  Copyright © 2021 Facebook. All rights reserved.

#import "SOLUSBSManager.h"
#import "BehavioSecIOSSDK.h"

@interface SOLUSBSManager ()
@property (nonnull, nonatomic, strong) BehavioSecIOSSDK *behavioSec;

@property (nonatomic, nullable, strong) NSString *policy;
@property (nonatomic, nullable, strong) NSNumber *confidence;
@property (nonatomic, nullable, strong) NSNumber *score;
@property (nonnull, nonatomic, strong) NSNumberFormatter *formatter;
@end

@implementation SOLUSBSManager

- (instancetype)init
{
    self = [super init];
    if (self) {
        _behavioSec = [BehavioSecIOSSDK sharedIOSSDK];
        _formatter = [[NSNumberFormatter alloc] init];
        [_formatter setPositiveFormat:@"0.##"];
    }
    return self;
}

-(void)registerPasswordField:(UITextField*)textField {
    [_behavioSec registerKbdTargetWithID:textField andName:@"Password" isAnonymous:NO andClearWholeTarget:YES];
    [_behavioSec startMotionDetect];
    _isRegistered = YES;
}

-(void)startMotionDetect
{
    [_behavioSec startMotionDetect];
}

-(void)stopMotionDetect
{
    [_behavioSec stopMotionDetect];
}

-(NSString*)getSummaryAndClearRegistration{
    NSString *summary = [_behavioSec getSummary];
    [_behavioSec clearRegistrations];
    _isRegistered = NO;
    return summary;
}



-(void)updateWithBeaviosecModel:(SOLUSBehavioSecModel*)model
{
    self.policy = model.behaviorPolicy;
    self.confidence = model.behaviorConfidence;
    self.score = model.behaviorScore;
}

-(NSString *)behaviorScore{
    
    return [_formatter stringFromNumber:@(self.score.floatValue)];
}

-(NSString *)behaviorPolicy{
    return self.policy;
}

-(NSString *)behaviorConfidence{
    return [_formatter stringFromNumber:@(self.confidence.floatValue)];
}

@end
