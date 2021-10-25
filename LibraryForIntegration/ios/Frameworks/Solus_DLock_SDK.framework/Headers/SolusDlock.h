//
//  SolusDlock.h
//  Solus DLock SDK
//
//  Created by Dmitrii Babii on 26.12.17.
//  Copyright © 2017 Dmitrii Babii. All rights reserved.
//

#import <UIKit/UIKit.h>

@class SolusDlock;

typedef NS_ENUM(NSUInteger, SolusDlockErrorCodes) {
    DlockRegistrationError,
    DlockVerificationError,
    DlockCanceled,
    DlockDeleteUserError
};

@protocol SolusDlockDelegate <NSObject>

- (void)solusDlock:(nonnull SolusDlock*)sender registerCompletedWithHash:(nonnull NSString*)pinHash;
- (void)solusDlock:(nonnull SolusDlock*)sender verificationCompletedWithHash:(nonnull NSString*)pinHash;
- (void)solusDlock:(nonnull SolusDlock*)sender didFailWithError:(nonnull NSError*)error;
- (void)solusDlock:(nonnull SolusDlock*)sender userRemovedSuccessFully:(nonnull NSString*)userName;
@end

@interface SolusDlock : NSObject

@property (nonatomic, nullable, weak) id<SolusDlockDelegate> delegate;

-(void)registerUserWithUsername:(nonnull NSString*)userName pinLength:(NSInteger)pinLength viewController:(nonnull UIViewController*)viewController;
-(void)verifyUserWithUsername:(nonnull NSString*)userName viewController:(nonnull UIViewController*)viewController;
-(void)removeUserWithUsername:(nonnull NSString*)userName;

-(BOOL)isUserEnrolled:(nonnull NSString*)userName;

@end
