//
//  SOLUSStorageModel.h
//  Solus
//
//  Created by Dmitrii Babii on 12.09.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import <SimpleKeychain/SimpleKeychain.h>
#import "SimpleKeychain.h"

@interface SOLUSStorageModel : NSObject

-(void)storeUserWithUserName:(nonnull NSString*)userName;
-(BOOL)checkUserIsEnrolled:(nonnull NSString*)userName;
-(void)deleteUserWithUsername:(nonnull NSString*)userName;

-(void)storePermId:(nonnull NSString*)permId forUserName:(nonnull NSString*)userName;
-(nullable NSString*)getPermIdForUserName:(nonnull NSString*)userName;
-(void)deletePermIdForUserName:(nonnull NSString*)userName;

-(void)storePerUserSecret:(nonnull NSString*)secret forUsername:(nonnull NSString*)userName;
-(nullable NSString*)perUserSecretForUsername:(nonnull NSString*)userName;
-(void)deletePerUserSecretForUserName:(nonnull NSString*)userName;

@end
