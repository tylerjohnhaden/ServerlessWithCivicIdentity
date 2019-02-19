see blog


successful auth.customCivicAuthorizer logs:
```text
START RequestId: e9673199-8851-4677-a986-0b4fcead8cfe Version: $LATEST
Attempting custom Civic authorization for event:
{
    "type": "TOKEN",
    "methodArn": "arn:aws:execute-api:us-east-2:466241486356:uvn9bcumqd/dev/GET/identification",
    "authorizationToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGU0NzU0ZS05ZDk5LTQyODgtOTFlOS00YWI5MDE1NzdhNzQiLCJpYXQiOjE1NTAyNjQ2NzMuODU3LCJleHAiOjE1NTAyNjY0NzMuODU3LCJpc3MiOiJjaXZpYy1zaXAtaG9zdGVkLXNlcnZpY2UiLCJhdWQiOiJodHRwczovL2FwaS5jaXZpYy5jb20vc2lwLyIsInN1YiI6InBmZHNBUnpwaiIsImRhdGEiOnsiY29kZVRva2VuIjoiOWM4ZTU5MjUtZGExZS00ZDBmLTkzZTMtNTIzOTVkYWRkNTBiIn19.cmzigqc-kGkWXSUYYUix06AzYOiXNxhm0esLQmfwpBlnV00BmSvvVHe4YLoWzizgk7I-NdHL69TeMmWjBTsh6Q"
}

2019-02-15T21:04:35.747Z	e9673199-8851-4677-a986-0b4fcead8cfe	Received Civic jwt token from client: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZGU0NzU0ZS05ZDk5LTQyODgtOTFlOS00YWI5MDE1NzdhNzQiLCJpYXQiOjE1NTAyNjQ2NzMuODU3LCJleHAiOjE1NTAyNjY0NzMuODU3LCJpc3MiOiJjaXZpYy1zaXAtaG9zdGVkLXNlcnZpY2UiLCJhdWQiOiJodHRwczovL2FwaS5jaXZpYy5jb20vc2lwLyIsInN1YiI6InBmZHNBUnpwaiIsImRhdGEiOnsiY29kZVRva2VuIjoiOWM4ZTU5MjUtZGExZS00ZDBmLTkzZTMtNTIzOTVkYWRkNTBiIn19.cmzigqc-kGkWXSUYYUix06AzYOiXNxhm0esLQmfwpBlnV00BmSvvVHe4YLoWzizgk7I-NdHL69TeMmWjBTsh6Q
2019-02-15T21:04:35.748Z	e9673199-8851-4677-a986-0b4fcead8cfe	Decoded token:
{
    "header": {
        "alg": "ES256",
        "typ": "JWT"
    },
    "payload": {
        "jti": "cde4754e-9d99-4288-91e9-4ab901577a74",
        "iat": 1550264673.857,
        "exp": 1550266473.857,
        "iss": "civic-sip-hosted-service",
        "aud": "https://api.civic.com/sip/",
        "sub": "pfdsARzpj",
        "data": {
            "codeToken": "9c8e5925-da1e-4d0f-93e3-52395dadd50b"
        }
    },
    "signature": "cmzigqc-kGkWXSUYYUix06AzYOiXNxhm0esLQmfwpBlnV00BmSvvVHe4YLoWzizgk7I-NdHL69TeMmWjBTsh6Q"
}

2019-02-15T21:04:37.776Z	e9673199-8851-4677-a986-0b4fcead8cfe	Received identity data from Civic:
{
    "data": [
        {
            "label": "verifications.levels.CIVIC:IAL1",
            "value": "CIVIC:IAL1",
            "isValid": true,
            "isOwner": true
        }
    ],
    "userId": "08b345bd6ab0fcda7e5a0c8d6388df7c3f8d15433640699c90ce3d0e9fe67302"
}

2019-02-15T21:04:37.776Z	e9673199-8851-4677-a986-0b4fcead8cfe	Unable to complete Civic authorization:
{}

2019-02-15T21:04:37.777Z	e9673199-8851-4677-a986-0b4fcead8cfe
{
    "errorMessage": "Server Error",
    "errorType": "Error",
    "stackTrace": [
        "exports.customCivicAuthorizer (/var/task/functions/auth.js:94:15)",
        "<anonymous>",
        "process._tickDomainCallback (internal/process/next_tick.js:228:7)"
    ]
}

END RequestId: e9673199-8851-4677-a986-0b4fcead8cfe
REPORT RequestId: e9673199-8851-4677-a986-0b4fcead8cfe	Duration: 2032.63 ms	Billed Duration: 2100 ms Memory Size: 1024 MB	Max Memory Used: 108 MB	

```