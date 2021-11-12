/*
 * Copyright © 2018 InAuth, Inc. All rights reserved.
 * The InAuth logo, and other trademarks, service marks, and designs are registered or unregistered
 * trademarks of InAuth, Inc. and its subsidiaries in the United States and in other countries.
 * All other trademarks are property of their respective owners.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
/**
 If handling a server response from a get messages request, InAuthenticate's handlePayload method will return an NSDictionary containing an NSArray of InAuthenticateMessage objects (see InAuthenticateMessage.h's section on handlePayload for more info).
 */
@interface InAuthenticateMessage : NSObject

/**
 Constructs a message from a dictionary.
 
 @param item A dictionary whose key-value pairs correspond to the properties of the returned object.
 */
- (nullable instancetype)initWithDictionary:(NSDictionary *)item;

/**
 Returns a date object noting when the message was sent.
 */
- (NSDate *)getDate;

/**
 The body of the message.
 */
@property (nonatomic, readonly, strong) NSString *body;

/**
 The message's confirmation id.
 */
@property (nonatomic, readonly, strong) NSString *confirmationID;

/**
 The contentType of the message (ie. "application/json").
 */
@property (nonatomic, readonly, strong) NSString *contentType;

/**
 The timestamp (epoch) of when the message was created on the InAuth server.
 */
@property (nonatomic, readonly) long long timeStamp;

@end
NS_ASSUME_NONNULL_END
