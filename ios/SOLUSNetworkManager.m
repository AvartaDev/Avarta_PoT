
//  SOLUSNetworkManager.m
//  Rnsolus
//
//  Created by plusinfosys on 25/08/21.
//  Copyright © 2021 Facebook. All rights reserved.

#import "SOLUSNetworkManager.h"
#import <AFNetworking.h>

@interface SOLUSNetworkManager ()

@property (nonatomic, strong, nonnull) AFHTTPSessionManager *network;
@property (nonatomic, strong, nonnull) NSString *organisationId;
@end

@implementation SOLUSNetworkManager

- (instancetype)initWithBaseUrl:(NSURL*)baseUrl andOrganisationId:(NSString*)organisationId;
{
    self = [super init];
    if (self) {
        self.network = [[AFHTTPSessionManager alloc] initWithBaseURL:baseUrl];
        self.organisationId = organisationId;
        [self setupRequestSerializer:[AFHTTPRequestSerializer serializer]];
    }
    return self;
}

-(NSString*)getAuthCredential{
    NSString *credentials = [NSString stringWithFormat:@"%@:%@",kDefaultUserName, kDefaultPassword];
    NSData *authData = [credentials dataUsingEncoding:NSUTF8StringEncoding];
    NSString *auth = [NSString stringWithFormat:@"Basic%@",[authData base64EncodedStringWithOptions:0]];
    return auth;
}

-(void)setupRequestSerializer:(AFHTTPRequestSerializer*)serializer{
    NSString *auth = [self getAuthCredential];
    [serializer setValue:auth forHTTPHeaderField:@"Authorization"];
    NSString *organizationKey = self.organisationId;
    [serializer setValue:organizationKey forHTTPHeaderField:@"organisationKey"];
    [serializer setAuthorizationHeaderFieldWithUsername:kDefaultUserName password:kDefaultPassword];
    [serializer setCachePolicy:NSURLRequestReloadIgnoringCacheData];
    self.network.requestSerializer = serializer;
}

-(void)registerInAuthRequestWithLogs:(NSData*)logs andCompletion:(nullable NetworkCompletion)completionBlock
{
    self.network.responseSerializer = [AFJSONResponseSerializer
                                       serializerWithReadingOptions:NSJSONReadingAllowFragments];
    [self.network.responseSerializer
     setAcceptableContentTypes:[NSSet setWithObject:@"application/json"]];
    [self.network POST:kInAuthRegister parameters:nil headers:nil progress:^(NSProgress * _Nonnull uploadProgress) {

     } success:^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject) {
             completionBlock(nil, responseObject);
     } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
             completionBlock(error, nil);
     }];

}

-(void)inAuthRequestWithLogs:(NSData*)logs completion:(nullable NetworkCompletion)completionBlock
{
    self.network.responseSerializer = [AFJSONResponseSerializer
                                       serializerWithReadingOptions:NSJSONReadingAllowFragments];
    [self.network.responseSerializer
     setAcceptableContentTypes:[NSSet setWithObject:@"application/json"]];

    [self.network POST:kInAuthLog parameters:nil headers:nil progress:^(NSProgress * _Nonnull uploadProgress) {

    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        completionBlock(nil, responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        completionBlock(error, nil);
    }];
}

@end
