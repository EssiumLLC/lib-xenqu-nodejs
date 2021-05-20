
# NodeJS Library for the Xenqu API  
### NodeJS Implementation of the Xenqu API (with types)  
Based off of [these API Docs](https://apidocs.xenqu.com/)  
### Getting Started:  
Install:  
```shell  
npm install @essium-llc/lib-xenqu-nodejs  
```  

### Using
There are 3 ways to initilize your API instance:

1. Create an API Instance using a Private Key:  
```typescript  
import XenquAPI from "lib-xenqu-nodejs";  
  
const API = new XenquAPI("client_id", "client_secret", "private_key", "subscriber", 'https://xenqu.com/api');
await API.init(); // Connects to API using OAuth 2.0 to get OAuth 1.0 credentials  
```  
### OR
2. Create an API Instance using a Username/Password Authentication 
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
await API.finishWebAuth(oauth_verifier)
```  
### OR
3. Create an API Instance using old OAuth1.0 credentials.  
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
API.account // Account Routes  
API.contact // Contact Routes  
API.tracking // Tracking Routes  
API.forms // Form RoutesAPI.reports // Report Routes  
API.files // File RoutesAPI.search // Search Routes
```  
  
## Other Implementations  
  
### Ruby
- https://github.com/EssiumLLC/lib-xenqu-ruby  
  
### .NET
Our .NET implementation can access reports.  We've used this in RPA projects using Automation Anywhere.  It should also be possible to get it to work with UiPath, or can used stand-alone to build utility apps.  
 - https://github.com/EssiumLLC/lib-xenqu-dotnet

### Python 
 - https://github.com/EssiumLLC/lib-xenqu-python
