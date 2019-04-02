# Hello RamDev #

## Rudimentary instructions for running the ramdev branch (vs master which has more stuff) ##

1. You need an AWS account (should be free for this project)
    - install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
    - get [programmatic access keys](https://console.aws.amazon.com/iam) and add to aws cli
2. Make a public S3 bucket, upload `index.html`, and make it *Static Website Hosting*
3. Create a [Civic application](https://integrate.civic.com)
    - set the whitelisted domain to the one created by S3
4. Generate Civic application keys and store in [Paramter Store](https://console.aws.amazon.com/systems-manager/parameters)
    - You only need App ID, Secret, and Secret Signing Key
    - Use a path like `/myFirstCivicIntegration/APP_ID` or whatever, then update `serverless.yml` where it is referenced (4 places)
5. Update `color.js` and `serverless.yml` with the domain created by S3 (3 places)
6. `npm install` then run `sls deploy`
7. Update `index.html` with the lambda endpoint generated (1 place)
8. Test by browsing to the S3 domain, use phone to authenticate, check responses




## see blog, but this describes full tutorial ##
1. https://blog.ippon.tech/integrating-civic-into-a-static-serverless-website-part-1-of-2/
2. https://blog.ippon.tech/integrating-civic-into-a-static-serverless-website-part-2-of-2/

The differences include:
- Custom domain name
- SSL certificate for static site and api
- Just `index.html` instead of html, css, js, png files
