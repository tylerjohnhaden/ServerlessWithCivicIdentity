'use strict';

const civicSip = require('civic-sip-api');
const jwt = require('jsonwebtoken');

const CivicIntegrationError = require('./util');

/*
    Custom Civic Authorizer abstracts away Civic's SDK from any resource using their tokens.

    It is intended to be used as a lambda authorizer fronting other resources which need a
    user's unique identification. The use of Civic's integration for Color Identification
    only requires "anonymous identity" so we will only be passing back the user id as context.

    Civic's server side SDK can be found here, https://docs.civic.com/#Server
    The general flow is:
        client -> Civic -> client -> API Gateway -> authorizer -> Civic -> authorizer -> resource -> client
*/

// initialize new Civic client, can be shared between different calls to this same lambda
const civicClient = civicSip.newClient({
    appId: process.env.CIVIC_APP_ID,
    appSecret: process.env.CIVIC_APP_SECRET,
    prvKey: process.env.CIVIC_PRIVATE_SIGNING_KEY,
});

// the function that will become the lambda authorizer
// when called as an authorizer, the token passed in the Authorization header will be available
exports.customCivicAuthorizer = async event => {
    console.debug(`Attempting custom Civic authorization for event: ${JSON.stringify(event)}`);

    /*
        according to AWS's documentation:
        https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html

        event = {
            "type":"TOKEN",
            "authorizationToken":"<caller-supplied-token>",
            "methodArn":"arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>"
        }
    */
    const { methodArn, authorizationToken } = event;

    console.info(`Received Civic jwt token from client: ${authorizationToken}`);
    console.info(`Decoded token: ${JSON.stringify(jwt.decode(authorizationToken, {complete: true}), null, 4)}`);

    let identityData = null;

    try {
        // send token directly to Civic and let them verify if this is a valid identity
        identityData = await civicClient.exchangeCode(authorizationToken);

    } catch(error) {
        throw new CivicIntegrationError('civicClient.exchangeCode threw on await');
//        // will return 500 Server Error
//        throw new Error('Server Error');
    }

    /*
        according to Civic's documentation: https://docs.civic.com/#ANONYMOUS_LOGIN

        identityData = {
            "data": [
                {
                    "label": "verifications.levels.CIVIC:IAL1",
                    "value": "CIVIC:IAL1",
                    "isValid": true,
                    "isOwner": true,
                },
            ],
            "userId": "c6d5795f8a059ez5ad29a33a60f8b402a172c3e0bbe50fd230ae8e0303609b42",
        }
    */
    console.info(`Received identity data from Civic: ${JSON.stringify(identityData, null, 4)}`);

    // in case civicClient.exchange code succeeded but returned invalid results, check isValid flag
    if (
        identityData &&
        identityData.data &&
        identityData.data.length &&  // <-- todo: investigate data specifications
        identityData.data[0].isValid
    ) {

        // a valid lambda authorizer output, if successful, must follow a specific schema
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
        return {
            principalId: identityData.userId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: methodArn,
                    }
                ],
            },
            context: {
                "anonymousUserId": identityData.userId  // duplicates principalId, but can be whatever
            },
        };

    } else {
        // will return 401 Unauthorized
        throw new Error('Unauthorized');
    }
};