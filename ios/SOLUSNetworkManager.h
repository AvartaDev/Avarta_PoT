//
//  SOLUSNetworkManager.h
//  Rnsolus
//
//  Created by plusinfosys on 25/08/21.
//  Copyright © 2021 Facebook. All rights reserved.
//
//
//  SOLUSNetworkManager.h
//  Solus
//
//  Created by Dmitrii Babii on 31.08.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

#import <Foundation/Foundation.h>
#define kDefaultUserName @"solus_api_user"
#define kDefaultPassword @"solus_api_password"
#define kInAuthRegister @"/api/v1/inauth/register"
#define kInAuthLog @"/api/v1/inauth/log"
#define kRiskApiUnregister @"https://riskapi-staging-api-uk.inauth.com/v2/mobile/register"
//#define kBaseUrl @"https://solus-connect-platform-test.azurewebsites.net" //test
#define kBaseUrl @"https://platform.solusconnect.com" //prod
//#define kBaseUrl @"https://davivienda.solusps.com" //davivivenda



#define kLatestAppVersion @"/api/applicationversion/latest/"
#define kUpdatePlatformValue @"10"

//#define kUpdateBaseURL @"https://solus-app-server-development.azurewebsites.net/" //dev
#define kUpdateBaseURL @"https://apps.solusps.com/" //prod

//#define kAppUpdateGUID @"745C0B89-ACC9-4965-93ED-17A837A810D4" //test

//#define kAppUpdateGUID @"BC4449F2-D7F2-44B7-B37E-42C5CF701BEB"  // davivien
 // let zoomServerBaseURL = "https://api.zoomauth.com/api/v2/biometrics"

#define kZoomBaseURL @"https://api.facetec.com/api/v3.1/biometrics"
#define kZoomEnrollment @"/enrollment-3d"
#define kZoomAuth @"/match-3d-3d"
#define KZoomGetSessionToken @"/session-token"
#define KZoomAppToken @"dgGMr6RaKsKCKHAVon21znE3v1wMgPO2"

@interface SOLUSNetworkManager : NSObject

typedef void (^NetworkCompletion)(NSError * _Nullable error, id _Nullable result);


- (nullable instancetype)initWithBaseUrl:(nonnull NSURL*)baseUrl andOrganisationId:(nonnull NSString*)organisationId;
- (void)registerInAuthRequestWithLogs:(nonnull NSData*)logs andCompletion:(nullable NetworkCompletion)completionBlock;
- (void)inAuthRequestWithLogs:(nonnull NSData*)logs completion:(nullable NetworkCompletion)completionBlock;

@end
