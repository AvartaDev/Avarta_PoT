//
//  SOLUSInAuthManager.h
//  Solus
//
//  Created by Dmitrii Babii on 31.08.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

#import <Foundation/Foundation.h>


@class SOLUSInAuthManager;

@interface SOLUSInAuthManager : NSObject

- (nullable instancetype)initWithBaseURL:(nonnull NSString*)baseURL andOrganizationKey:(nonnull NSString*)organizationKey;
-(void)registerDeviceWithCompletion:(nullable void(^)( NSError  * _Nullable  error, NSDictionary *_Nullable info))completionBlock;
-(void)sendLogsForDevice:(nullable void(^)(NSError * _Nullable error, NSDictionary * _Nullable logItem))completionBlock;
-(void)unregisterDevice:(nullable void(^)(NSError * _Nullable error))completionBlock;

@property (nonatomic, assign) BOOL isRegistered;
@property (nonatomic, strong, nonnull) NSString *baseUrl;
@property (nonnull, strong, nonatomic) NSString *organizationId;

@end
