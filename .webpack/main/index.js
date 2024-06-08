/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/electron-squirrel-startup/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/index.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var path = __webpack_require__(/*! path */ "path");
var spawn = (__webpack_require__(/*! child_process */ "child_process").spawn);
var debug = __webpack_require__(/*! debug */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/index.js")('electron-squirrel-startup');
var app = (__webpack_require__(/*! electron */ "electron").app);

var run = function(args, done) {
  var updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  debug('Spawning `%s` with args `%s`', updateExe, args);
  spawn(updateExe, args, {
    detached: true
  }).on('close', done);
};

var check = function() {
  if (process.platform === 'win32') {
    var cmd = process.argv[1];
    debug('processing squirrel command `%s`', cmd);
    var target = path.basename(process.execPath);

    if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
      run(['--createShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-uninstall') {
      run(['--removeShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-obsolete') {
      app.quit();
      return true;
    }
  }
  return false;
};

module.exports = check();


/***/ }),

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/browser.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/browser.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js":
/*!********************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js ***!
  \********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "./node_modules/electron-squirrel-startup/node_modules/ms/index.js");

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/index.js ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/browser.js");
} else {
  module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/node.js");
}


/***/ }),

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/node.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/node.js ***!
  \*******************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(/*! tty */ "tty");
var util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js");
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(/*! fs */ "fs");
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(/*! net */ "net");
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),

/***/ "./node_modules/electron-squirrel-startup/node_modules/ms/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/ms/index.js ***!
  \*************************************************************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "./node_modules/node-hid/binding-options.js":
/*!**************************************************!*\
  !*** ./node_modules/node-hid/binding-options.js ***!
  \**************************************************/
/***/ ((module) => {

module.exports = {
    name: 'HID',
    napi_versions: [3],
}

/***/ }),

/***/ "./node_modules/node-hid/nodehid.js":
/*!******************************************!*\
  !*** ./node_modules/node-hid/nodehid.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


const EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter);
const util = __webpack_require__(/*! util */ "util");

let driverType = null;
function setDriverType(type) {
    driverType = type;
}

// lazy load the C++ binding
let binding = null;
function loadBinding() {
    if (!binding) {
        const options = __webpack_require__(/*! ./binding-options */ "./node_modules/node-hid/binding-options.js");
        if (process.platform === "linux" && (!driverType || driverType === "hidraw")) {
            options.name = 'HID_hidraw';
        }
        binding = __webpack_require__(/*! pkg-prebuilds/bindings */ "./node_modules/pkg-prebuilds/bindings.js")(__dirname, options);
    }
}

//This class is a wrapper for `binding.HID` class
function HID() {

    // see issue #150 (enhancement, solves issue #149)
    // throw an error for those who forget to instantiate, i.e. by "*new* HID.HID()"
    // and who would otherwise be left trying to figure out why "self.on is not a function"
    if (!new.target) {
        throw new Error('HID() must be called with \'new\' operator');
    }

    //Inherit from EventEmitter
    EventEmitter.call(this);

    loadBinding();

    /* We also want to inherit from `binding.HID`, but unfortunately,
        it's not so easy for native Objects. For example, the
        following won't work since `new` keyword isn't used:
        `binding.HID.apply(this, arguments);`
        So... we do this craziness instead...
    */
    var thisPlusArgs = new Array(arguments.length + 1);
    thisPlusArgs[0] = null;
    for(var i = 0; i < arguments.length; i++)
        thisPlusArgs[i + 1] = arguments[i];
    this._raw = new (Function.prototype.bind.apply(binding.HID,
        thisPlusArgs) )();

    /* Now we have `this._raw` Object from which we need to
        inherit.  So, one solution is to simply copy all
        prototype methods over to `this` and binding them to
        `this._raw`
    */
    for(var i in binding.HID.prototype)
        this[i] = binding.HID.prototype[i].bind(this._raw);

    /* We are now done inheriting from `binding.HID` and EventEmitter.
        Now upon adding a new listener for "data" events, we start
        polling the HID device using `read(...)`
        See `resume()` for more details. */
    this._paused = true;
    var self = this;
    self.on("newListener", function(eventName, listener) {
        if(eventName == "data")
            process.nextTick(self.resume.bind(self) );
    });
}
//Inherit prototype methods
util.inherits(HID, EventEmitter);
//Don't inherit from `binding.HID`; that's done above already!

HID.prototype.close = function close() {
    this._closing = true;
    this.removeAllListeners();
    this._raw.close();
    this._closed = true;
};
//Pauses the reader, which stops "data" events from being emitted
HID.prototype.pause = function pause() {
    this._paused = true;
};

HID.prototype.read = function read(callback) {
    if (this._closed) {
    throw new Error('Unable to read from a closed HID device');
  } else {
    return this._raw.read(callback);
  }
};

HID.prototype.resume = function resume() {
    var self = this;
    if(self._paused && self.listeners("data").length > 0)
    {
        //Start polling & reading loop
        self._paused = false;
        self.read(function readFunc(err, data) {
            try {
                if(err)
                {
                    //Emit error and pause reading
                    self._paused = true;
                    if(!self._closing)
                        self.emit("error", err);
                    //else ignore any errors if I'm closing the device
                }
                else
                {
                    //If there are no "data" listeners, we pause
                    if(self.listeners("data").length <= 0)
                        self._paused = true;
                    //Keep reading if we aren't paused
                    if(!self._paused)
                        self.read(readFunc);
                    //Now emit the event
                    self.emit("data", data);
                }
            } catch (e) {
                // Emit an error on the device instead of propagating to a c++ exception
                setImmediate(() => {
                    this.emit("error", e);
                });
            }
        });
    }
};

class HIDAsync extends EventEmitter {
    constructor(raw) {
        super()

        if (!(raw instanceof binding.HIDAsync)) {
            throw new Error(`HIDAsync cannot be constructed directly. Use HIDAsync.open() instead`)
        }

        this._raw = raw

        /* Now we have `this._raw` Object from which we need to
            inherit.  So, one solution is to simply copy all
            prototype methods over to `this` and binding them to
            `this._raw`.
            We explicitly wrap them in an async method, to ensure 
            that any thrown errors are promise rejections
        */
        for (let i in this._raw) {
            this[i] = async (...args) => this._raw[i](...args);
        }

        /* Now upon adding a new listener for "data" events, we start
            the read thread executing. See `resume()` for more details.
        */
        this.on("newListener", (eventName, listener) =>{
            if(eventName == "data")
                process.nextTick(this.resume.bind(this) );
        });
        this.on("removeListener", (eventName, listener) => {
            if(eventName == "data" && this.listenerCount("data") == 0)
                process.nextTick(this.pause.bind(this) );
        })
    }

    static async open(...args) {
        loadBinding();
        const native = await binding.openAsyncHIDDevice(...args);
        return new HIDAsync(native)
    }

    async close() {
        this._closing = true;
        this.removeAllListeners();
        await this._raw.close();
        this._closed = true;
    }
    
    //Pauses the reader, which stops "data" events from being emitted
    pause() {
        this._raw.readStop();
    }

    resume() {
        if(this.listenerCount("data") > 0)
        {
            //Start polling & reading loop
            this._raw.readStart((err, data) => {
                try {
                    if (err) {
                        if(!this._closing)
                            this.emit("error", err);
                        //else ignore any errors if I'm closing the device
                    } else {
                        this.emit("data", data);
                    }
                } catch (e) {
                    // Emit an error on the device instead of propagating to a c++ exception
                    setImmediate(() => {
                        this.emit("error", e);
                    });
                }
            })
        }
    }
}

function showdevices() {
    loadBinding();
    return binding.devices.apply(HID,arguments);
}

function showdevicesAsync(...args) {
    loadBinding();
    return binding.devicesAsync(...args);
}


//Expose API
exports.HID = HID;
exports.HIDAsync = HIDAsync;
exports.devices = showdevices;
exports.devicesAsync = showdevicesAsync;
exports.setDriverType = setDriverType;


/***/ }),

/***/ "./node_modules/pkg-prebuilds/bindings.js":
/*!************************************************!*\
  !*** ./node_modules/pkg-prebuilds/bindings.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(/*! path */ "path")
const os = __webpack_require__(/*! os */ "os")
const { getPrebuildName, isNwjs, isElectron, isAlpine } = __webpack_require__(/*! ./lib/prebuild */ "./node_modules/pkg-prebuilds/lib/prebuild.js")

// Jest can allow users to mock 'fs', but we need the real fs
const fs = typeof jest !== 'undefined' ? jest.requireActual('fs') : __webpack_require__(/*! fs */ "fs")

// Workaround to fix webpack's build warnings: 'the request of a dependency is an expression'
const runtimeRequire =  true ? eval("require") : 0 // eslint-disable-line

/**
 * Find the best path to the binding file
 * @param {string} basePath - Base path of the module, where binaries will be located
 * @param {object} options - Describe how the prebuilt binary is named
 * @param {boolean} verifyPrebuild - True if we are verifying that a prebuild exists
 * @param {boolean} throwOnMissing - True if an error should be thrown when the binary is missing
 * @returns
 */
function resolvePath(basePath, options, verifyPrebuild, throwOnMissing) {
	if (typeof basePath !== 'string' || !basePath) throw new Error(`Invalid basePath to pkg-prebuilds`)

	if (typeof options !== 'object' || !options) throw new Error(`Invalid options to pkg-prebuilds`)
	if (typeof options.name !== 'string' || !options.name) throw new Error(`Invalid name to pkg-prebuilds`)

	let isNodeApi = false
	if (options.napi_versions && Array.isArray(options.napi_versions)) {
		isNodeApi = true
	}

	const arch = (verifyPrebuild && process.env.npm_config_arch) || os.arch()
	const platform = (verifyPrebuild && process.env.npm_config_platform) || os.platform()

	let runtime = 'node'
	// If node-api, then everything can share the same binary
	if (!isNodeApi) {
		if (verifyPrebuild && process.env.npm_config_runtime) {
			runtime = process.env.npm_config_runtime
		} else if (isElectron()) {
			runtime = 'electron'
		} else if (isNwjs()) {
			runtime = 'node-webkit'
		}
	}

	const candidates = []

	if (!verifyPrebuild) {
		// Try for a locally built binding
		candidates.push(
			path.join(basePath, 'build', 'Debug', `${options.name}.node`),
			path.join(basePath, 'build', 'Release', `${options.name}.node`)
		)
	}

	let libc = undefined
	if (isAlpine(platform)) libc = 'musl'

	// Look for prebuilds
	if (isNodeApi) {
		// Look for node-api versioned builds
		for (const ver of options.napi_versions) {
			const prebuildName = getPrebuildName({
				name: options.name,
				platform,
				arch,
				libc,
				napi_version: ver,
				runtime,
				// armv: options.armv ? (arch === 'arm64' ? '8' : vars.arm_version) : null,
			})
			candidates.push(path.join(basePath, 'prebuilds', prebuildName))
		}
	} else {
		throw new Error('Not implemented for NAN!')
	}

	let foundPath = null

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) {
			const stat = fs.statSync(candidate)
			if (stat.isFile()) {
				foundPath = candidate
				break
			}
		}
	}

	if (!foundPath && throwOnMissing) {
		const candidatesStr = candidates.map((cand) => ` - ${cand}`).join('\n')
		throw new Error(`Failed to find binding for ${options.name}\nTried paths:\n${candidatesStr}`)
	}

	return foundPath
}

function loadBinding(basePath, options) {
	const foundPath = resolvePath(basePath, options, false, true)

	// Note: this error should not be hit, as resolvePath will throw if the binding is missing
	if (!foundPath) throw new Error(`Failed to find binding for ${options.name}`)

	return runtimeRequire(foundPath)
}
loadBinding.resolve = resolvePath

module.exports = loadBinding


/***/ }),

/***/ "./node_modules/pkg-prebuilds/lib/prebuild.js":
/*!****************************************************!*\
  !*** ./node_modules/pkg-prebuilds/lib/prebuild.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(/*! fs */ "fs")

/**
 * Generate the filename of the prebuild file.
 * The format of the name is possible to calculate based on some options
 * @param {object} options
 * @returns
 */
function getPrebuildName(options) {
	if (!options.napi_version) throw new Error('NAN not implemented') // TODO

	const tokens = [
		options.name,
		options.platform,
		options.arch,
		// options.armv ? (options.arch === 'arm64' ? '8' : vars.arm_version) : null,
		options.libc && options.platform === 'linux' ? options.libc : null,
	]
	return `${tokens.filter((t) => !!t).join('-')}/${options.runtime}-napi-v${options.napi_version}.node`
}

function isNwjs() {
	return !!(process.versions && process.versions.nw)
}

function isElectron() {
	if (process.versions && process.versions.electron) return true
	if (process.env.ELECTRON_RUN_AS_NODE) return true
	return typeof window !== 'undefined' && window.process && window.process.type === 'renderer'
}

function isAlpine(platform) {
	return platform === 'linux' && fs.existsSync('/etc/alpine-release')
}

module.exports = {
	getPrebuildName,
	isNwjs,
	isElectron,
	isAlpine,
}


/***/ }),

/***/ "./src/pkhid.ts":
/*!**********************!*\
  !*** ./src/pkhid.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendTime = exports.listHidDevices = exports.listPkDevices = void 0;
// /path/to/hidModule.ts
const HID = __importStar(__webpack_require__(/*! node-hid */ "./node_modules/node-hid/nodehid.js"));
const BUF_SIZE_BYTES = 32;
const RAW_USAGE_PAGE = 0xFF60;
const RAW_USAGE_ID = 0x61;
let pkdevice;
const listPkDevices = () => {
    const devices = HID.devices();
    const pkDeviceInfo = devices.filter(d => d.vendorId === 0xFEED && d.productId === 0x4594 && d.manufacturer === "phelix");
    const pkrawHIDInterface = pkDeviceInfo.find(d => d.usage === RAW_USAGE_ID && d.usagePage === RAW_USAGE_PAGE);
    const path = pkrawHIDInterface === null || pkrawHIDInterface === void 0 ? void 0 : pkrawHIDInterface.path;
    if (path) {
        pkdevice = new HID.HID(path);
    }
    return pkDeviceInfo;
};
exports.listPkDevices = listPkDevices;
const listHidDevices = () => {
    return HID.devices();
};
exports.listHidDevices = listHidDevices;
const sendTime = () => {
    if (pkdevice) {
        let time = getCurrentTime();
        let buffer = createEmptyBuffer();
        for (let i = 0; i < time.length; i++) {
            if (i > BUF_SIZE_BYTES) {
                break;
            }
            buffer[i + 2] = time.charCodeAt(i);
        }
        try {
            console.log('Sending buffer... \n--->Buffer:', buffer);
            pkdevice.write(buffer);
            console.log('Buffer sent.');
        }
        catch (error) {
            console.error('Error sending buffer:', error);
        }
        setTimeout(() => {
            console.log("closing connection");
            if (pkdevice)
                pkdevice.close();
        }, 60000);
    }
};
exports.sendTime = sendTime;
const createEmptyBuffer = () => {
    let buf = [];
    for (let i = 0; i < BUF_SIZE_BYTES; i++) {
        buf.push(0);
    }
    return buf;
};
const getCurrentTime = () => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${hours}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)} ${ampm}`;
};


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __webpack_require__ !== 'undefined') __webpack_require__.ab = __dirname + "/native_modules/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const pkhid_1 = __webpack_require__(/*! ./pkhid */ "./src/pkhid.ts");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (__webpack_require__(/*! electron-squirrel-startup */ "./node_modules/electron-squirrel-startup/index.js")) {
    electron_1.app.quit();
}
const createWindow = () => {
    // Create the browser window.
    const mainWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: '/Users/travis/projects/phelix-keyboards-hub/.webpack/renderer/main_window/preload.js',
        },
    });
    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000/main_window');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
electron_1.ipcMain.on('list-pk-devices', (event) => {
    const pkDeviceInfo = (0, pkhid_1.listPkDevices)();
    event.reply('hid-pk-devices', pkDeviceInfo);
});
electron_1.ipcMain.on('list-hid-devices', (event) => {
    const devices = (0, pkhid_1.listHidDevices)();
    event.reply('hid-devices', devices);
});
electron_1.ipcMain.on('send-time', (event) => {
    console.log("sending");
    (0, pkhid_1.sendTime)();
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map