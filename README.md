# NodeJS Library for the Xenqu API
### NodeJS Implementation of the Xenqu API (with types)
Based off of [these API Docs](https://apidocs.xenqu.com/)
### Getting Started:
Install:
```shell
npm install lib-xenqu-nodejs
```
Create an API Instance:
```typescript
import XenquAPI from "lib-xenqu-nodejs";

const API = new XenquAPI("client_id", "client_secret", "private_key", "subscriber");
await API.init(); // Connects to API using OAuth 2.0 to get OAuth 1.0 credentials
```
Access API Routes:
```typescript
API.account // Account Routes
API.contact // Contact Routes
API.tracking // Tracking Routes
API.forms // Form Routes
API.reports // Report Routes
API.files // File Routes
API.search // Search Routes
```

## Other Implementations

We've open sourced our Ruby implementation of our API which can serve as a good reference for other implementation if you don't use Ruby.

https://github.com/EssiumLLC/lib-xenqu-ruby

We also started a .NET implementation which can access reports.  We've used this in RPA projects using Automation Anywhere.  It should also be possible to get it to work with UiPath.  Or it can used stand-alone to build utility apps.

https://github.com/EssiumLLC/lib-xenqu-dotnet