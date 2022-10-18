/* SimpleOAuth - Simply builds OAuth 1.0 headers
*
* Copyright (c) 2013, Ben Olson (github.com/bseth99/simple-oauth-js)
*
* Adapted from Ruby Gem simple_oauth:
*   https://github.com/laserlemon/simple_oauth
*
* and OAuthSimple:
*   http://unitedHeroes.net/OAuthSimple
*
* Usage is essentially the same and should match the Ruby versions output
* for server-side processing.
*
*
* This basic usage will yield a string suitable for setting on the
* Authorization header in an AJAX request.  It is not library specific
* nor does it assume which header you will use it with:
*
*   var options = {
*      consumer_key: 'R1Y3QW1L15uw8X0t5ddJbQ',
*      consumer_secret: '7xKJvmTCKm97WBQQllji9Oz8DRQHJoN1svhiY8vo'
*   };
*
*   var header = new SimpleOAuth.Header('get', 'http://example.org/resource', null, options);
*   var authorization = header.build();
*
* See github.com/bseth99/simple-oauth for more usage examples and notes
* Also check the test cases and samples for jQuery/Backbone integration cases
*
* Only support HMAC-SHA1 signing
*
* Other sources noted throughout.
*
* Dependancies:
*     underscore.js >= 1.4.3 (http://underscorejs.org)
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of the unitedHeroes.net nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY UNITEDHEROES.NET ''AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL UNITEDHEROES.NET BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



import {Header} from "./simple-oauth/header";

export {
  Header
};
