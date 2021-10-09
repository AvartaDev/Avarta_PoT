//
//  SOLUSLibrarySettings.h
//  Solus
//
//  Created by Dmitrii Babii on 07.08.17.
//  Copyright © 2017 Solus Password Solutions. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SOLUSLibrarySettings : NSObject

/*!
@property pinLength
@discussion length of pin of current workflow for Solus SDK pin register/verification
*/

@property (nonatomic, strong, nullable) NSNumber *pinLength;

/*!

 @property version
 @discussion last version of Solus connect
 */

@property (nonatomic, strong, nullable) NSString *version;

/*!
 
 @property appUpdateLocation
 @discussion link for app updates for autoupdate
 */

@property (nonatomic, strong, nullable) NSString *appUpdateLocation;

/*!
 @property operatingSystem
 @discussion current compatible operating system
 */

@property (nonatomic, strong, nullable) NSString *operatingSystem;

@property (nonatomic, strong, nullable) NSString *licenseKey;

@end
