import { join } from 'path';

var libs = new Map();

// our es6 versions
libs.set('process', require.resolve('process-es6'));
libs.set('buffer', require.resolve('buffer-es6'));
libs.set('util', require.resolve('./utils/node-builtins/src/es6/util'));
libs.set('sys', libs.get('util'));
libs.set('events', require.resolve('./utils/node-builtins/src/es6/events'));
libs.set('stream', require.resolve('./utils/node-builtins/src/es6/stream'));
libs.set('path', require.resolve('./utils/node-builtins/src/es6/path'));
libs.set('querystring', require.resolve('./utils/node-builtins/src/es6/qs'));
libs.set('punycode', require.resolve('./utils/node-builtins/src/es6/punycode'));
libs.set('url', require.resolve('./utils/node-builtins/src/es6/url'));
libs.set('string_decoder', require.resolve('./utils/node-builtins/src/es6/string-decoder'));
libs.set('http', require.resolve('./utils/node-builtins/src/es6/http'));
libs.set('https', require.resolve('./utils/node-builtins/src/es6/http'));
libs.set('os', require.resolve('./utils/node-builtins/src/es6/os'));
libs.set('assert', require.resolve('./utils/node-builtins/src/es6/assert'));
libs.set('constants', require.resolve('./utils/node-builtins/dist/constants'));
libs.set('_stream_duplex', require.resolve('./utils/node-builtins/src/es6/readable-stream/duplex'));
libs.set('_stream_passthrough', require.resolve('./utils/node-builtins/src/es6/readable-stream/passthrough'));
libs.set('_stream_readable', require.resolve('./utils/node-builtins/src/es6/readable-stream/readable'));
libs.set('_stream_writable', require.resolve('./utils/node-builtins/src/es6/readable-stream/writable'));
libs.set('_stream_transform', require.resolve('./utils/node-builtins/src/es6/readable-stream/transform'));
libs.set('timers', require.resolve('./utils/node-builtins/src/es6/timers'));
libs.set('console', require.resolve('./utils/node-builtins/src/es6/console'));
libs.set('vm', require.resolve('./utils/node-builtins/src/es6/vm'));
libs.set('zlib', require.resolve('./utils/node-builtins/src/es6/zlib'));
libs.set('tty', require.resolve('./utils/node-builtins/src/es6/tty'));
libs.set('domain', require.resolve('./utils/node-builtins/src/es6/domain'));

// not shimmed
//libs.set('crypto', );
var CRYPTO_PATH = require.resolve('crypto-browserify');
var EMPTY_PATH = require.resolve('./utils/node-builtins/src/es6/empty');
function index (opts) {
  opts = opts || {};
  var cryptoPath = EMPTY_PATH;
  if (opts.crypto) {
    cryptoPath = CRYPTO_PATH;
  }
  return {
    resolveId: function resolveId(importee) {
      if (importee && importee.slice(-1) === '/') {
        importee === importee.slice(0, -1);
      }
      if (libs.has(importee)) {
        return libs.get(importee);
      }
      if (importee === 'crypto') {
        return cryptoPath;
      }
    }
  };
}

export default index;