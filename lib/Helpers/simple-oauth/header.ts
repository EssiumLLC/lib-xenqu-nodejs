import { URI, _uri } from "./uri";
import b64_hmac_sha1 from "./sign";
import _ from "underscore"

const ATTRIBUTE_KEYS = ['callback', 'consumer_key', 'nonce', 'signature_method', 'timestamp', 'token', 'verifier', 'version'];
const NONCE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/* getNonce adapted from OAuthSimple
  * A simpler version of OAuth
  *
  * author:     jr conlin
  * mail:       src@anticipatr.com
  * copyright:  unitedHeroes.net
  * version:    1.2
  * url:        http://unitedHeroes.net/OAuthSimple
  *
  * Copyright (c) 2011, unitedHeroes.net
  *
 */

function getNonce(length = 16) {
  const len = NONCE_CHARS.length;
  let result = '',
    i = 0,
    rnum;

  for (; i < length; i++) {
    rnum = Math.floor(Math.random() * len);
    result += NONCE_CHARS.substring(rnum, rnum + 1);
  }

  return result;

}

function getTimestamp() {
  const d = new Date();

  return '' + Math.floor(d.getTime() / 1000);
}

const Header = function (method, url, params, oauth = {}) {

  this.method = method.toUpperCase();

  this.uri = URI.parseUri(url);
  this.uri.fragment = '';
  this.uri.normalize();

  this.params = params;
  this.options = _.extend(Header.default_options(), oauth);

}

Header.default_options = function () {
  return ({
    nonce: getNonce(),
    signature_method: 'HMAC-SHA1',
    timestamp: getTimestamp(),
    version: '1.0'
  });
}

/*
*
*  5.1.  Parameter Encoding
*
*  All parameter names and values are escaped using the [RFC3986] percent-encoding (%xx) mechanism.
*  Characters not in the unreserved character set ([RFC3986] section 2.3) MUST be encoded. Characters
*  in the unreserved character set MUST NOT be encoded. Hexadecimal characters in encodings MUST be upper
*  case. Text names and values MUST be encoded as UTF-8 octets before percent-encoding them per [RFC3629].
*
*            unreserved = ALPHA, DIGIT, '-', '.', '_', '~'
*/

Header.escape = function (value) {
  return encodeURIComponent(value)
    .replace(/\!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

Header.unescape = function (value) {
  return decodeURIComponent(value);
}

_.extend(Header.prototype, {


  /*
  *  Section 9.1.2 Construct Request URL
  *
  *  The Signature Base String includes the request absolute URL, tying the signature to a specific endpoint.
  *  The URL used in the Signature Base String MUST include the scheme, authority, and path, and MUST exclude the
  *  query and fragment as defined by [RFC3986] section 3.
  *
  *  If the absolute request URL is not available to the Service Provider (it is always available to the Consumer),
  *  it can be constructed by combining the scheme being used, the HTTP Host header, and the relative HTTP request URL.
  *  If the Host header is not available, the Service Provider SHOULD use the host name communicated to the Consumer
  *  in the documentation or other means.
  *
  *  The Service Provider SHOULD document the form of URL used in the Signature Base String to avoid ambiguity due to
  *  URL normalization. Unless specified, URL scheme and authority MUST be lowercase and include the port number; http
  *  default port 80 and https default port 443 MUST be excluded.
  *
  *  For example, the request:
  *
  *                  HTTP://Example.com:80/resource?id=123
  *
  *  Is included in the Signature Base String as:
  *
  *                  http://example.com/resource
  *
  *
  */

  url: function () {

    const uri = new _uri(_.clone(this.uri));
    uri.query = null;
    return uri.build();

  },


  /*
  *  Section 7. Accessing Protected Resources
  *
  *  After successfully receiving the Access Token and Token Secret, the Consumer is able to access the
  *  Protected Resources on behalf of the User. The request MUST be signed per Signing Requests, and
  *  contains the following parameters:
  *
  *      oauth_consumer_key:
  *          The Consumer Key.
  *      oauth_token:
  *          The Access Token.
  *      oauth_signature_method:
  *          The signature method the Consumer used to sign the request.
  *      oauth_signature:
  *          The signature as defined in Signing Requests.
  *      oauth_timestamp:
  *          As defined in Nonce and Timestamp.
  *      oauth_nonce:
  *          As defined in Nonce and Timestamp.
  *      oauth_version:
  *          OPTIONAL. If present, value MUST be 1.0. Service Providers MUST assume the protocol version to be 1.0 if this parameter is not present. Service Providers’ response to non-1.0 value is left undefined.
  *      Additional parameters:
  *          Any additional parameters, as defined by the Service Provider.
  *
  *
  */

  build: function (output = 'header') {
    let s;

    if (output == 'header')
      s = 'OAuth ' + this.normalized_header_attributes();
    else if (output == 'query')
      s = this.normalized_query_attributes();

    return s;
  },

  signed_attributes: function () {
    const attr = _.clone(this.attributes());
    attr['oauth_signature'] = this.signature();
    return attr;
  },

  // private

  normalized_header_attributes: function () {

    return (
      _.map(
        _.sortBy(_.pairs(this.signed_attributes()), function (v) { return v[0]; }),
        function (v) {
          return v[0] + '="' + Header.escape(v[1]) + '"';
        }).join(', ')
    );
  },

  normalized_query_attributes: function () {

    return (
      _.map(
        _.sortBy(_.pairs(this.signed_attributes()), function (v) { return v[0]; }),
        function (v) {
          return v[0] + '=' + Header.escape(v[1]);
        }).join('&')
    );
  },

  attributes: function () {
    const attr = {},
      opt = this.options;

    _.each(ATTRIBUTE_KEYS, function (k) {
      if (opt[k]) attr['oauth_' + k] = opt[k];
    });

    return attr;
  },

  /*
  *  9.  Signing Requests
  *
  *  All Token requests and Protected Resources requests MUST be signed by the Consumer and verified by the
  *  Service Provider. The purpose of signing requests is to prevent unauthorized parties from using the
  *  Consumer Key and Tokens when making Token requests or Protected Resources requests. The signature process
  *  encodes the Consumer Secret and Token Secret into a verifiable value which is included with the request.
  *
  *  OAuth does not mandate a particular signature method, as each implementation can have its own unique
  *  requirements. The protocol defines three signature methods: HMAC-SHA1, RSA-SHA1, and PLAINTEXT, but
  *  Service Providers are free to implement and document their own methods. Recommending any particular
  *  method is beyond the scope of this specification.
  *
  *  The Consumer declares a signature method in the oauth_signature_method parameter, generates a signature,
  *  and stores it in the oauth_signature parameter. The Service Provider verifies the signature as specified
  *  in each method. When verifying a Consumer signature, the Service Provider SHOULD check the request nonce
  *  to ensure it has not been used in a previous Consumer request.
  *
  *  The signature process MUST NOT change the request parameter names or values, with the exception of the
  *  oauth_signature parameter.
  */

  signature: function () {
    return this.hmac_sha1_signature();
  },

  hmac_sha1_signature: function () {
    return b64_hmac_sha1(this.secret(), this.signature_base());
  },

  /*
  *  9.2.  HMAC-SHA1
  *
  *  The HMAC-SHA1 signature method uses the HMAC-SHA1 signature algorithm as defined in [RFC2104] where the
  *  Signature Base String is the text and the key is the concatenated values (each first encoded per Parameter Encoding)
  *  of the Consumer Secret and Token Secret, separated by an ‘&’ character (ASCII code 38) even if empty.
  */

  secret: function () {
    const opt = _.pick(this.options, 'consumer_secret', 'token_secret');

    opt['consumer_secret'] = opt['consumer_secret'] || '';
    opt['token_secret'] = opt['token_secret'] || '';

    return _.map(opt, function (v) { return Header.escape(v); }).join('&');
  },


  /*
  *   9.1.3.  Concatenate Request Elements
  *
  *  The following items MUST be concatenated in order into a single string. Each item is encoded and separated
  *  by an ‘&’ character (ASCII code 38), even if empty.
  *
  *      The HTTP request method used to send the request. Value MUST be uppercase, for example: HEAD, GET , POST, etc.
  *      The request URL from Section 9.1.2.
  *      The normalized request parameters string from Section 9.1.1.
  *
  *  See Signature Base String example in Appendix A.5.1.
  */

  signature_base: function () {
    return _.map([this.method, this.url(), this.normalized_params()], function (v) { return Header.escape(v); }).join('&');
  },


  /*
  *  9.1.1.  Normalize Request Parameters
  *
  *  The request parameters are collected, sorted and concatenated into a normalized string:
  *
  *      Parameters in the OAuth HTTP Authorization header excluding the realm parameter.
  *      Parameters in the HTTP POST request body (with a content-type of application/x-www-form-urlencoded).
  *      HTTP GET parameters added to the URLs in the query part (as defined by [RFC3986] section 3).
  *
  *  The oauth_signature parameter MUST be excluded.
  *
  *  The parameters are normalized into a single string as follows:
  *
  *      Parameters are sorted by name, using lexicographical byte value ordering. If two or more parameters
  *      share the same name, they are sorted by their value. For example:
  *
  *                          a=1, c=hi%20there, f=25, f=50, f=a, z=p, z=t
  *
  *      Parameters are concatenated in their sorted order into a single string. For each parameter, the name is
  *      separated from the corresponding value by an ‘=’ character (ASCII code 61), even if the value is empty.
  *      Each name-value pair is separated by an ‘&’ character (ASCII code 38). For example:
  *
  *                          a=1&c=hi%20there&f=25&f=50&f=a&z=p&z=t
  *
  */

  normalized_params: function () {
    return (
      _.map(
        _.map(this.signature_params(), function (p) {
          return _.map(p, function (v) {
            return Header.escape(v);
          })
        }).sort(), function (p) { return p.join('='); }).join('&')
    );
  },

  signature_params: function () {
    return _.pairs(this.attributes()).concat(_.pairs(this.params), this.url_params());
  },

  url_params: function () {
    const params = [];

    _.each(URI.parseQuery(this.uri.query || ''), function (vs, k) {
      params.push(_(_.flatten([vs]).sort()).chain().map(function (v) { return [k, v]; }).value());
    });

    // @ts-expect-error because this is legacy code and legacy code sucks.
    return (params.flatten ? params.flatten(true) : _.flatten(params, true));
  }

});


export {
  Header
}
