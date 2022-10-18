
const protocol_expression = /^[a-z][a-z0-9.+-]*$/i;

const parse = function (string) {
  var pos, parts: any = {};
  // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

  // extract fragment
  parts.source = string;
  parts.fragment = '';

  pos = string.indexOf('#');
  if (pos > -1) {
    // escaping?
    parts.fragment = string.substring(pos + 1) || '';
    string = string.substring(0, pos);
  }

  // extract query
  pos = string.indexOf('?');
  parts.query = '';
  if (pos > -1) {
    // escaping?
    parts.query = string.substring(pos + 1) || '';
    string = string.substring(0, pos);
  }

  // extract protocol
  if (string.substring(0, 2) === '//') {
    // relative-scheme
    parts.scheme = null;
    string = string.substring(2);
    // extract "user:pass@host:port"
    string = parseAuthority(string, parts);
  } else {
    pos = string.indexOf(':');
    if (pos > -1) {
      parts.scheme = string.substring(0, pos) || '';
      if (parts.scheme && !parts.scheme.match(protocol_expression)) {
        // : may be within the path
        parts.scheme = undefined;
      } else if (parts.scheme === 'file') {
        // the file scheme: does not contain an authority
        string = string.substring(pos + 3);
      } else if (string.substring(pos + 1, pos + 3) === '//') {
        string = string.substring(pos + 3);

        // extract "user:pass@host:port"
        string = parseAuthority(string, parts);
      } else {
        string = string.substring(pos + 1);
        parts.urn = true;
      }
    }
  }

  // what's left must be the path
  parts.path = string;
  if (parts.path.length > 0) {

    parts.directory = '';
    parts.file = '';
  }

  parts.relative = parts.path + (parts.query.length > 0 ? '?' + parts.query : '');

  // and we're done
  return parts;
};

const parseHost = function (string, parts) {
  // extract host:port
  var pos = string.indexOf('/');
  var bracketPos;
  var t;

  if (pos === -1) {
    pos = string.length;
  }

  if (string.charAt(0) === '[') {
    // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
    // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
    // IPv6+port in the format [2001:db8::1]:80 (for the time being)
    bracketPos = string.indexOf(']');
    parts.host = string.substring(1, bracketPos) || '';
    parts.port = string.substring(bracketPos + 2, pos) || '';
    if (parts.port === '/') {
      parts.port = '';
    }
  } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
    // IPv6 host contains multiple colons - but no port
    // this notation is actually not allowed by RFC 3986, but we're a liberal parser
    parts.host = string.substring(0, pos) || '';
    parts.port = '';
  } else {
    t = string.substring(0, pos).split(':');
    parts.host = t[0] || '';
    parts.port = t[1] || '';
  }

  if (parts.host && string.substring(pos).charAt(0) !== '/') {
    pos++;
    string = '/' + string;
  }

  parts.authority = (parts.host || '') + (parts.port ? ':' + parts.port : '')

  return string.substring(pos) || '/';
};

const parseAuthority = function (string, parts) {
  string = parseUserinfo(string, parts);
  return parseHost(string, parts);
};

const parseUserinfo = function (string, parts) {
  // extract username:password
  var firstSlash = string.indexOf('/');
  /*jshint laxbreak: true */
  var pos = firstSlash > -1
    ? string.lastIndexOf('@', firstSlash)
    : string.indexOf('@');
  /*jshint laxbreak: false */
  var t;

  // authority@ must come before /path
  if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
    t = string.substring(0, pos).split(':');
    parts.user = t[0] ? decodeURIComponent(t[0]) : '';
    t.shift();
    parts.password = t[0] ? decodeURIComponent(t.join(':')) : '';
    parts.userinfo = parts.user + '@' + parts.password;

    string = string.substring(pos + 1);
  } else {
    parts.userinfo = '';
    parts.user = '';
    parts.password = '';
  }

  return string;
};

export {
  parse
}
