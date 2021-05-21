
  
# NodeJS Library for the Xenqu API 
### NodeJS Implementation of the Xenqu API (with types) Based off of [these API Docs](https://apidocs.xenqu.com/)    
### Getting Started: Install:    
```shell
npm install @essium-llc/lib-xenqu-nodejs 
```   
### Usage
There are 4 ways to initialize your API instance:  
  
1. Create an API Instance using a Private Key:    
```typescript 
import XenquAPI from "lib-xenqu-nodejs";  
  
const API = new XenquAPI("client_id", "client_secret", "private_key", "subscriber", 'https://xenqu.com/api');  
await API.init(); // Connects to API using OAuth 2.0 to get OAuth 1.0 credentials 
``` 
### OR  
2. Create an API Instance using a Username/Password Authentication, along with embedding the Xenqu login portal   
```typescript 
import XenquAPI from "lib-xenqu-nodejs";

const boot = await XenquAPIBoot('https://xenqu.com/api', 'your-app-id', 'your-site-profile')  
const API = new XenquAPI(boot._m, boot._s, null, null, 'https://stage.xenqu.com/api', true);  
const tempToken = await API.startWebAuth('your-callback-url');  
// Use the tempToken to embed `https://xenqu.com/login.html?oauth_token=${tempToken}`  
// login.html will load username and password field. Once UN/PW are accepted  
// Xenqu will automatically call your callback url with encoded form data.  
// You will need to decode the returned string and pass the oauth_verifier  
// data to the following function  
const tokensToSave = await API.finishWebAuth(oauth_verifier); // Save these tokens (securely) if you'd like to attempt reauthoriztion later!  
``` 
### OR  
3. Create an API Instance using a Username/Password Authentication   
```typescript 
import XenquAPI from "lib-xenqu-nodejs";

const boot = await XenquAPIBoot('https://xenqu.com/api', 'your-app-id', 'your-site-profile')  
const API = new XenquAPI(boot._m, boot._s, null, null, 'https://stage.xenqu.com/api', true); 
 
// Typically, the client ID and client secret are different for the middle requests in
// our oauth process. These will be provided if this is the case. Otherwise, 
// you may proceed by setting these to the same as above
const loginClient = 'your-login-client-id'; // boot._m
const loginSecret = 'your-login-client-secret'; // boot._s
// A registered callback must be used here. Although the responses from the callbacks aren't
// ever used, the oauth requests still require a registered callback url to be sent
const callback = 'your-registered-callback';
// Authenticator is the method of authentication that you want to use.
// 'default' is for Username/Password authentication
// 'openid' is used for SSO applications
const authenticator = 'default'; // 'openid'
// Additional parameters includes the parameters that are used in the authentication request.
// If your authenticator is 'default' you'll need to include 'user_name' and 'user_pass'
// If your authenticator is 'openid' you'll need to include 'provider' and any other fields
// that that SSO provider requires to be sent.
const extraParams = { user_name: 'username', user_pass: 'password' };
// These are example parameters for Microsoft SSO
const extraParams = { provider: 'microsoft', id_token: 'microsoft-id-token' }
// Attempt the full xenqu oauth authentication flow in one fell swoop
const tokensToSave await API.attemptAuthWithUNandPWorSSO(loginClient, loginSecret, callback, authenticator, extraParams); // Save these tokens (securely) if you'd like to attempt reauthoriztion later!  
``` 
If you are having issues trying to use the whole auth flow at once, you can debug each part by breaking apart the requests:
```typescript
import XenquAPI from "lib-xenqu-nodejs";

const boot = await XenquAPIBoot('https://xenqu.com/api', 'your-app-id', 'your-site-profile')  
const API = new XenquAPI(boot._m, boot._s, null, null, 'https://stage.xenqu.com/api', true); 

// See above example for explination of these variables and what they all mean
const loginClient = 'your-login-client-id'; // boot._m
const loginSecret = 'your-login-client-secret'; // boot._s
const callback = 'your-registered-callback';
const authenticator = 'default'; // 'openid'
const extraParams = { user_name: 'username', user_pass: 'password' };

await API.startWebAuth('your-callback-url'); 
await API.authenticate(loginClient , loginSecret , callback, authenticator, extraParams);  
const verifierWhole = await API.authorize(loginClient, loginSecret, callback); 
const verifierSplit = verifierWhole.split('&')[1].split('=')[1]; // Split form-data response to get verifier
const tokensToSave = await API.finishWebAuth(verifierSplit); // Save these tokens (securely) if you'd like to attempt reauthoriztion later!  
```

### OR  
4. Create an API Instance using old OAuth1.0 credentials.    
 - This is useful if you have a user logged in on the web, and they close and re-open their browsing window. If you cached the credentials, you can reload the user without having them re-enter their login information again.  
 - This isn't as useful in a private-key authenticated API instance, as you can always renew your keys by calling `API.init()`  
```typescript 
import XenquAPI from "lib-xenqu-nodejs";    

const oldCreds = new new OAuth1Credentials({    
	consumer_key: 'your-consumer-key',    
    consumer_secret: 'your-consumer-secret',    
    token: 'your-token',    
    token_secret: 'your-secret', 
})  

const API = new XenquAPI(oldCreds.consumerKey, oldCreds.consumerSecret, "private_key", "subscriber", 'https://xenqu.com/api');  
// OR, If you're using Web-Style authentication  
const API = new XenquAPI(oldCreds.consumerKey, oldCreds.consumerSecret, null, null, 'https://xenqu.com/api', true);  

// Set the second parameter to true to attempt to renew the keys  
const renewedCreds = await API.tryOldCredentials(oldCreds, false);  
``` 
Once initialized, you can call any API route available on [these API Docs.](https://apidocs.xenqu.com/)   If you find a missing route, please create an [issue.](https://github.com/EssiumLLC/lib-xenqu-nodejs)  
  
Access API Routes:    
```typescript 
API.account  // Account Routes 
API.contact  // Contact Routes 
API.tracking // Tracking Routes 
API.forms    // Form Routes
API.reports  // Report Routes 
API.files    // File Routes
API.search   // Search Routes  
```    
 ## Other Implementations    
 ### Ruby  
- https://github.com/EssiumLLC/lib-xenqu-ruby    
    
### .NET  
Our .NET implementation can access reports.  We've used this in RPA projects using Automation Anywhere.  It should also be possible to get it to work with UiPath, or can used stand-alone to build utility apps.    
 - https://github.com/EssiumLLC/lib-xenqu-dotnet  
  
### Python   
- https://github.com/EssiumLLC/lib-xenqu-python
