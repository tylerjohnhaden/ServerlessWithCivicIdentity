'use strict';

const crypto = require('crypto');

/*
    Color Identification is an example to demonstrate a real use of anonymous identity.

    Given some type of anonymous identity hosted by a third party, Civic for example,
    this function takes that id and hashes it along with some secret that we store
    on our backend. This resulting digest gets casted into an 24 bit integer, which
    can then be turned into a rgb value easily enough.

    We need to include our own secret into the hash because we want to force people
    to use our service. If we just casted the identity into color directly, anyone would
    be able to generate their color without hitting our api.
*/

// the function that will become a lambda
// requires that event.requestContext.authorizer.anonymousUserId is valid (returned by lambda authorizer)
exports.colorIdentification = async event => {
    console.debug(`Attempting color identification for ${JSON.stringify(event, null, 4)}`);

    // the lambda authorizer which fronts this function passes back Civic's anonymous user identity
    const { requestContext: { authorizer: { anonymousUserId } } } = event;

    // from Civic's documentation https://docs.civic.com/#ANONYMOUS_LOGIN
    // anonymousUserId will look something like this:
    //     "c6d5795f8a059ez5ad29a33a60f8b402a172c3e0bbe50fd230ae8e0303609b42"
    console.debug(`Anonymous user identity: ${anonymousUserId}`);

    try {
        // hash the user's unique id and our secret together to generate the user's unique color hash
        // ps node's crypto doesn't store intermediate state so we can't "cache" the secret part :(
        const colorIdDigest = crypto
            .createHash('sha256')
            .update(process.env.CIVIC_PRIVATE_SIGNING_KEY, 'ascii')
            .update(anonymousUserId, 'ascii')
            .digest('hex');

        // take last 24 bits of entropy and cast to integer as color identification
        const colorId = parseInt(colorIdDigest.slice(-6), 16);

        console.info(`Success! Turned userId: ${anonymousUserId} into colorId: ${colorId}`);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': 'http://ramdev0.tylerjohnhaden.s3-website-us-east-1.amazonaws.com',
            },
            body: JSON.stringify({
                yourUserIdentity: anonymousUserId,
                yourColorIdentity: colorId,
            }),
        };

    } catch (error) {
        throw new Error(`Unable to hash userId: ${anonymousUserId} into colorId because: ${JSON.stringify(error)}`);
    }
};

