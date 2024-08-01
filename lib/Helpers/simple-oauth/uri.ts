
/*
*  Need to have some URI utilities for parsing the URI and query string.
*  This mimics some of the functionality provided by the Ruby URI and CGI
*  modules
*/

import * as Parser from './parser';
import _ from 'underscore';

const _uri = function (parsed) {

  _.extend(this, parsed);

  this.default_port = '';
  switch (this.scheme) {

    case 'http':
      this.default_port = '80';
      break;
    case 'https':
      this.default_port = '443';
      break;

  }
}

_.extend(_uri.prototype, {

  normalize: function () {

    if (this.path && this.path == '')
      this.path = '/';

    if (this.scheme && this.scheme != this.scheme.toLowerCase())
      this.scheme = this.scheme.toLowerCase();

    if (this.host && this.host != this.host.toLowerCase())
      this.host = this.host.toLowerCase();

  },

  build: function () {
    let str = '';

    if (this.scheme) {
      str += this.scheme;
      str += ':';
    }

    if (this.opaque) {
      str += this.opaque;
    } else {

      if (this.host)
        str += '//';

      if (this.userinfo) {
        str += this.userinfo;
        str += '@';
      }

      if (this.host) {
        str += this.host;
      }

      if (this.port && this.port != this.default_port) {
        str += ':';
        str += this.port;
      }

      str += this.path;

      if (this.query) {
        str += '?';
        str += this.query;
      }
    }

    if (this.fragment) {
      str += '#';
      str += this.fragment;
    }

    return str;
  }
});


/*!
* https://github.com/medialize/URI.js
* MIT License
*/

const URI = {

  /*!
   * Adapted from OAuthSimple
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

  parseQuery: function (query) {

    const elements = (query || "").split('&');
    const result = {};
    let element;

    for (element = elements.shift(); element; element = elements.shift()) {

      const keyToken = element.split('=');
      let value = '';

      if (keyToken[1]) {
        value = decodeURIComponent(keyToken[1]);
      }

      if (result[keyToken[0]]) {

        if (!(result[keyToken[0]] instanceof Array)) {
          result[keyToken[0]] = [result[keyToken[0]], value];
        } else {
          if (_.isArray(result[keyToken[0]]))
            result[keyToken[0]].push(value);
          else
            result[keyToken[0]] = [result[keyToken[0]], value];
        }

      } else {
        result[keyToken[0]] = value;
      }
    }

    return result;

  },

  queryString: function (params) {
    return _.map(params, function (v, k) {
      return k + '=' + encodeURIComponent(v);
    }).join('&');
  },

  /*!
  * parseUri 1.2.2
  * (c) Steven Levithan <stevenlevithan.com>
  * MIT License
  */

  parseUri: function (str) {
    const uri = Parser.parse(str);

    uri['queryKey'] = {};
    uri['query'].replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
      if ($1) uri['queryKey'][$1] = $2;
    });

    return new _uri(uri);
  },

}

export {
  URI, _uri
}
