//
//  SOLUSInAuthManager.m
//  Solus
//
//  Created by Dmitrii Babii on 31.08.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

#import "SOLUSInAuthManager.h"
#import <InMobileMME/InMobileMME.h>
#import <InMobileMME/MME.h>
#import "SOLUSNetworkManager.h"


@interface SOLUSInAuthManager ()

@property (nonatomic, strong, nonnull) MME *inAuth;
@property (nonatomic) InMobileNet *inMobileMngr;
@property (nonnull, nonatomic, strong) SOLUSNetworkManager *manager;
@end

@implementation SOLUSInAuthManager

- (instancetype)initWithBaseURL:(NSString*)baseURL andOrganizationKey:(NSString*)organizationKey
 {
    self = [super init];
    if (self) {
        NSString *fName = @"server_keys_message_hosted";
        NSString *path = [[NSBundle mainBundle] pathForResource:fName ofType:@"json"];
        NSString *keys = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
        NSData *jsonKeyData = [keys dataUsingEncoding:NSUTF8StringEncoding];
        self.inAuth = [[MME alloc] initWithAccountId:@"c656b715-4bf3-4554-99a3-d60e9f8921c4" applicationId: @"3d71ac40-889c-4e85-90b6-dc8e896f23b3" andJSONKeys:jsonKeyData];
        self.manager = [[SOLUSNetworkManager alloc] initWithBaseUrl:[NSURL URLWithString:baseURL] andOrganisationId:organizationKey];
    }
    return self;
}

-(void)registerDeviceWithCompletion:(nullable void(^)( NSError  * _Nullable  error, NSDictionary *_Nullable info))completionBlock
{
    
    NSError *registerError = nil;
    OpaqueObjectRef registerData = [self.inAuth generateRegistrationPayload:&registerError];
    [self.manager registerInAuthRequestWithLogs:registerData andCompletion:^(NSError * _Nullable error, id  _Nullable result) {
        if(!error){
            if(result)
            {
            NSError *internalError = nil;
            NSString *deviceResponse = result[@"deviceResponse"];
            NSData *payload = [[NSData alloc] initWithBase64EncodedString:deviceResponse options:NSDataBase64DecodingIgnoreUnknownCharacters];
            [self.inAuth handlePayload:payload onError:&internalError];
            NSDictionary *deviceInfo = result[@"deviceInfo"];
            completionBlock(nil, deviceInfo);
            }
            else
            {
                completionBlock(error, nil);
            }
        }else{
            completionBlock(error, nil);
        }
    }];
}

-(void)sendLogsForDevice:(nullable void(^)(NSError * _Nullable error, NSDictionary * _Nullable logItem))completionBlock
{
    __weak SOLUSInAuthManager *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        NSError *registerError = nil;
        OpaqueObjectRef registerData = [weakSelf.inAuth generateLogPayload:InMobileLogSetAll withError:&registerError];
        [weakSelf.manager inAuthRequestWithLogs:registerData completion:^(NSError * _Nullable error, id  _Nullable result) {
            if(!error){
                completionBlock(nil, result);
            }else{
                completionBlock(error, nil);
            }
        }];
    });
    
}

-(void)unregisterDevice:(nullable void(^)(NSError * _Nullable error))completionBlock
{
    OpaqueObjectRef unregisterPayload = [self.inAuth unRegister];
    [[InMobileNet sharedInstance] sendOpaqueObject:unregisterPayload toURL:[NSURL URLWithString:kRiskApiUnregister] onCompletion:^(OpaqueObjectRef  _Nullable opaqueObjectResponse, NSURLResponse * _Nullable urlResponse, NSError * _Nullable error) {
        if (error) {
            NSLog(@"InMobile - MME Unregister Error: %@", error.description);
            completionBlock(error);
        }
    }];
}

-(BOOL)isRegistered
{
    NSError *error = nil;
    BOOL result = [self.inAuth isRegistered:&error];
    if(error){
        NSLog(@"error %@", error);
    }
    return result;
}

@end

