/*
    Color Identification gives every user a unique color.

    User's identity is determined by integrating Civic as a third party identity management
    platform. Civic gives the option to use "anonymous identity" so that users won't have to
    give their email, phone number, name, and other information Civic uses to identify them
    to the application's back end. To get your unique color identification, you will only have
    to authenticate using your phone (Civic's app) and pass an anonymous id number to our back end.

    Civic's client side SDK can be found here, https://docs.civic.com/#Browser
    The general flow is:
        client -> Civic -> client -> API Gateway -> authorizer -> Civic -> authorizer -> resource -> client
*/

const appId = "pfdsARzpj";
const apiColorIdentificationEndpoint = "https://api.color.tylerjohnhaden.com/identification";

// initialize civic client, will fail if not from an origin specified by the app's owner
const civicSip = new civic.sip({ appId });

// kickoff function, is run on document load (doesn't have to though)
function requestAnonymousIdentity() {
    // anonymous is currently in beta (2019-2-15) https://docs.civic.com/#ANONYMOUS_LOGIN
    civicSip.signup({ style: 'popup', scopeRequest: civicSip.ScopeRequests.ANONYMOUS_LOGIN });
}

// if the user chooses not to scan the QR code
civicSip.on('user-cancelled', event => { error(event) });

// if the user can't successfully be identified or Civic is not behaving
civicSip.on('civic-sip-error', event => { error(event) });

// if the user can be successfully identified
civicSip.on('auth-code-received', event => {
    // receive jwt token from Civic
    const anonymousIdentityToken = event.response;

    // todo: save token as cookie? need to investigate if anonymous civic tokens have re-usability

    console.info(`Civic anonymous identity token: ${anonymousIdentityToken}`);
    console.info(`Decoded token: ${JSON.stringify(JSON.parse(atob(anonymousIdentityToken.split('.')[1])), null, 4)}`);

    // pass the token to our backend for processing
    getColorIdentity(anonymousIdentityToken);
});

function getColorIdentity(token) {
    console.debug('Attempting to send token to API color resource');
    fetch(apiColorIdentificationEndpoint, {
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }

    // display your color
    }).then(response =>response.json()).then(identities => {
        console.info(`Received anonymous identity information from API: ${JSON.stringify(identities, null, 4)}`);
        color(identities.yourColorIdentity);

    // or log error and display random color
    }).catch(err => {
        error(err)
    });
}

function color(intValue) {
    // convert integer into hex color format
    const hexValue = '#' + intValue.toString(16).padStart(6, '0');

    // display color
    document.body.style.backgroundColor = hexValue;
    console.info(`Coloring: ${hexValue}`);
}

function error(message) {
    console.error(message);

    // random color 0x000000 ... 0xffffff
    color(Math.floor(Math.random() * 16777216));
}