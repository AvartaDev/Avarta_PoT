//
//  SOLUSStorageModel.m
//  Solus
//
//  Created by Dmitrii Babii on 12.09.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

#import "SOLUSStorageModel.h"

#define USER_SECRET_PREFIX @"perUserSecret"

@implementation SOLUSStorageModel


-(void)storeUserWithUserName:(NSString*)userName
{
    [[A0SimpleKeychain keychain] setString:@"enrolled" forKey:userName];
}

-(BOOL)checkUserIsEnrolled:(NSString*)userName
{
    NSString *key = [[A0SimpleKeychain keychain] stringForKey:userName];
    if(!key){
        return NO;
    }
    if([key isEqualToString:@"enrolled"]){
        return YES;
    }
    return NO;
}

-(void)deleteUserWithUsername:(NSString*)userName
{
    [[A0SimpleKeychain keychain] deleteEntryForKey:userName];
}

-(void)storePermId:(NSString*)permId forUserName:(NSString*)userName
{
    
    [[A0SimpleKeychain keychain] setString:permId forKey:[NSString stringWithFormat:@"permId:%@", userName]];
}

-(nullable NSString*)getPermIdForUserName:(nonnull NSString*)userName
{
    NSString *permId = [[A0SimpleKeychain keychain] stringForKey:[NSString stringWithFormat:@"permId:%@", userName]];
    return permId;
}

-(void)deletePermIdForUserName:(NSString*)userName
{
    [[A0SimpleKeychain keychain] deleteEntryForKey:[NSString stringWithFormat:@"permId:%@", userName]];
}

-(void)storePerUserSecret:(nonnull NSString*)secret forUsername:(nonnull NSString*)userName
{
    [[A0SimpleKeychain keychain] setString:secret forKey:[NSString stringWithFormat:@"%@:%@", USER_SECRET_PREFIX, userName]];
}

-(nullable NSString*)perUserSecretForUsername:(nonnull NSString*)userName
{
    NSString *secret = [[A0SimpleKeychain keychain] stringForKey:[NSString stringWithFormat:@"%@:%@", USER_SECRET_PREFIX, userName]];
    return secret;
}

-(void)deletePerUserSecretForUserName:(nonnull NSString*)userName
{
    [[A0SimpleKeychain keychain] deleteEntryForKey:[NSString stringWithFormat:@"%@:%@", USER_SECRET_PREFIX, userName]];
}

@end
