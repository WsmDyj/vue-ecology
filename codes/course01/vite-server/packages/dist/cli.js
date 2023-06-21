"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js
var require_ms = __commonJS({
  "../node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js"(exports, module2) {
    "use strict";
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
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
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name;
      }
      return Math.ceil(ms / n) + " " + name + "s";
    }
  }
});

// ../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js"(exports, module2) {
    "use strict";
    exports = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require_ms();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug() {
        if (!debug.enabled)
          return;
        var self = debug;
        var curr = +/* @__PURE__ */ new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%")
            return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self, args);
        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug);
      }
      return debug;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i])
          continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
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
    function coerce(val) {
      if (val instanceof Error)
        return val.stack || val.message;
      return val;
    }
  }
});

// ../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js"(exports, module2) {
    "use strict";
    exports = module2.exports = require_debug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2)
        return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match)
          return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  }
});

// ../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js
var require_node = __commonJS({
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js"(exports, module2) {
    "use strict";
    var tty = require("tty");
    var util = require("util");
    exports = module2.exports = require_debug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val))
        val = true;
      else if (/^(no|off|false|disabled)$/i.test(val))
        val = false;
      else if (val === "null")
        val = null;
      else
        val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require("fs");
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require("net");
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load());
  }
});

// ../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js
var require_src = __commonJS({
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js"(exports, module2) {
    "use strict";
    if (typeof process !== "undefined" && process.type === "renderer") {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// ../node_modules/.pnpm/encodeurl@1.0.2/node_modules/encodeurl/index.js
var require_encodeurl = __commonJS({
  "../node_modules/.pnpm/encodeurl@1.0.2/node_modules/encodeurl/index.js"(exports, module2) {
    "use strict";
    module2.exports = encodeUrl;
    var ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;
    var UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;
    var UNMATCHED_SURROGATE_PAIR_REPLACE = "$1\uFFFD$2";
    function encodeUrl(url) {
      return String(url).replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE).replace(ENCODE_CHARS_REGEXP, encodeURI);
    }
  }
});

// ../node_modules/.pnpm/escape-html@1.0.3/node_modules/escape-html/index.js
var require_escape_html = __commonJS({
  "../node_modules/.pnpm/escape-html@1.0.3/node_modules/escape-html/index.js"(exports, module2) {
    "use strict";
    var matchHtmlRegExp = /["'&<>]/;
    module2.exports = escapeHtml;
    function escapeHtml(string) {
      var str = "" + string;
      var match = matchHtmlRegExp.exec(str);
      if (!match) {
        return str;
      }
      var escape;
      var html = "";
      var index = 0;
      var lastIndex = 0;
      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            escape = "&quot;";
            break;
          case 38:
            escape = "&amp;";
            break;
          case 39:
            escape = "&#39;";
            break;
          case 60:
            escape = "&lt;";
            break;
          case 62:
            escape = "&gt;";
            break;
          default:
            continue;
        }
        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escape;
      }
      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
  }
});

// ../node_modules/.pnpm/ee-first@1.1.1/node_modules/ee-first/index.js
var require_ee_first = __commonJS({
  "../node_modules/.pnpm/ee-first@1.1.1/node_modules/ee-first/index.js"(exports, module2) {
    "use strict";
    module2.exports = first;
    function first(stuff, done) {
      if (!Array.isArray(stuff))
        throw new TypeError("arg must be an array of [ee, events...] arrays");
      var cleanups = [];
      for (var i = 0; i < stuff.length; i++) {
        var arr = stuff[i];
        if (!Array.isArray(arr) || arr.length < 2)
          throw new TypeError("each array member must be [ee, events...]");
        var ee = arr[0];
        for (var j = 1; j < arr.length; j++) {
          var event = arr[j];
          var fn = listener(event, callback);
          ee.on(event, fn);
          cleanups.push({
            ee,
            event,
            fn
          });
        }
      }
      function callback() {
        cleanup();
        done.apply(null, arguments);
      }
      function cleanup() {
        var x;
        for (var i2 = 0; i2 < cleanups.length; i2++) {
          x = cleanups[i2];
          x.ee.removeListener(x.event, x.fn);
        }
      }
      function thunk(fn2) {
        done = fn2;
      }
      thunk.cancel = cleanup;
      return thunk;
    }
    function listener(event, done) {
      return function onevent(arg1) {
        var args = new Array(arguments.length);
        var ee = this;
        var err = event === "error" ? arg1 : null;
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        done(err, ee, event, args);
      };
    }
  }
});

// ../node_modules/.pnpm/on-finished@2.3.0/node_modules/on-finished/index.js
var require_on_finished = __commonJS({
  "../node_modules/.pnpm/on-finished@2.3.0/node_modules/on-finished/index.js"(exports, module2) {
    "use strict";
    module2.exports = onFinished;
    module2.exports.isFinished = isFinished;
    var first = require_ee_first();
    var defer = typeof setImmediate === "function" ? setImmediate : function(fn) {
      process.nextTick(fn.bind.apply(fn, arguments));
    };
    function onFinished(msg, listener) {
      if (isFinished(msg) !== false) {
        defer(listener, null, msg);
        return msg;
      }
      attachListener(msg, listener);
      return msg;
    }
    function isFinished(msg) {
      var socket = msg.socket;
      if (typeof msg.finished === "boolean") {
        return Boolean(msg.finished || socket && !socket.writable);
      }
      if (typeof msg.complete === "boolean") {
        return Boolean(msg.upgrade || !socket || !socket.readable || msg.complete && !msg.readable);
      }
      return void 0;
    }
    function attachFinishedListener(msg, callback) {
      var eeMsg;
      var eeSocket;
      var finished = false;
      function onFinish(error) {
        eeMsg.cancel();
        eeSocket.cancel();
        finished = true;
        callback(error);
      }
      eeMsg = eeSocket = first([[msg, "end", "finish"]], onFinish);
      function onSocket(socket) {
        msg.removeListener("socket", onSocket);
        if (finished)
          return;
        if (eeMsg !== eeSocket)
          return;
        eeSocket = first([[socket, "error", "close"]], onFinish);
      }
      if (msg.socket) {
        onSocket(msg.socket);
        return;
      }
      msg.on("socket", onSocket);
      if (msg.socket === void 0) {
        patchAssignSocket(msg, onSocket);
      }
    }
    function attachListener(msg, listener) {
      var attached = msg.__onFinished;
      if (!attached || !attached.queue) {
        attached = msg.__onFinished = createListener(msg);
        attachFinishedListener(msg, attached);
      }
      attached.queue.push(listener);
    }
    function createListener(msg) {
      function listener(err) {
        if (msg.__onFinished === listener)
          msg.__onFinished = null;
        if (!listener.queue)
          return;
        var queue = listener.queue;
        listener.queue = null;
        for (var i = 0; i < queue.length; i++) {
          queue[i](err, msg);
        }
      }
      listener.queue = [];
      return listener;
    }
    function patchAssignSocket(res, callback) {
      var assignSocket = res.assignSocket;
      if (typeof assignSocket !== "function")
        return;
      res.assignSocket = function _assignSocket(socket) {
        assignSocket.call(this, socket);
        callback(socket);
      };
    }
  }
});

// ../node_modules/.pnpm/parseurl@1.3.3/node_modules/parseurl/index.js
var require_parseurl = __commonJS({
  "../node_modules/.pnpm/parseurl@1.3.3/node_modules/parseurl/index.js"(exports, module2) {
    "use strict";
    var url = require("url");
    var parse = url.parse;
    var Url = url.Url;
    module2.exports = parseurl;
    module2.exports.original = originalurl;
    function parseurl(req) {
      var url2 = req.url;
      if (url2 === void 0) {
        return void 0;
      }
      var parsed = req._parsedUrl;
      if (fresh(url2, parsed)) {
        return parsed;
      }
      parsed = fastparse(url2);
      parsed._raw = url2;
      return req._parsedUrl = parsed;
    }
    function originalurl(req) {
      var url2 = req.originalUrl;
      if (typeof url2 !== "string") {
        return parseurl(req);
      }
      var parsed = req._parsedOriginalUrl;
      if (fresh(url2, parsed)) {
        return parsed;
      }
      parsed = fastparse(url2);
      parsed._raw = url2;
      return req._parsedOriginalUrl = parsed;
    }
    function fastparse(str) {
      if (typeof str !== "string" || str.charCodeAt(0) !== 47) {
        return parse(str);
      }
      var pathname = str;
      var query = null;
      var search = null;
      for (var i = 1; i < str.length; i++) {
        switch (str.charCodeAt(i)) {
          case 63:
            if (search === null) {
              pathname = str.substring(0, i);
              query = str.substring(i + 1);
              search = str.substring(i);
            }
            break;
          case 9:
          case 10:
          case 12:
          case 13:
          case 32:
          case 35:
          case 160:
          case 65279:
            return parse(str);
        }
      }
      var url2 = Url !== void 0 ? new Url() : {};
      url2.path = str;
      url2.href = str;
      url2.pathname = pathname;
      if (search !== null) {
        url2.query = query;
        url2.search = search;
      }
      return url2;
    }
    function fresh(url2, parsedUrl) {
      return typeof parsedUrl === "object" && parsedUrl !== null && (Url === void 0 || parsedUrl instanceof Url) && parsedUrl._raw === url2;
    }
  }
});

// ../node_modules/.pnpm/statuses@1.5.0/node_modules/statuses/codes.json
var require_codes = __commonJS({
  "../node_modules/.pnpm/statuses@1.5.0/node_modules/statuses/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// ../node_modules/.pnpm/statuses@1.5.0/node_modules/statuses/index.js
var require_statuses = __commonJS({
  "../node_modules/.pnpm/statuses@1.5.0/node_modules/statuses/index.js"(exports, module2) {
    "use strict";
    var codes = require_codes();
    module2.exports = status;
    status.STATUS_CODES = codes;
    status.codes = populateStatusesMap(status, codes);
    status.redirect = {
      300: true,
      301: true,
      302: true,
      303: true,
      305: true,
      307: true,
      308: true
    };
    status.empty = {
      204: true,
      205: true,
      304: true
    };
    status.retry = {
      502: true,
      503: true,
      504: true
    };
    function populateStatusesMap(statuses, codes2) {
      var arr = [];
      Object.keys(codes2).forEach(function forEachCode(code) {
        var message = codes2[code];
        var status2 = Number(code);
        statuses[status2] = message;
        statuses[message] = status2;
        statuses[message.toLowerCase()] = status2;
        arr.push(status2);
      });
      return arr;
    }
    function status(code) {
      if (typeof code === "number") {
        if (!status[code])
          throw new Error("invalid status code: " + code);
        return code;
      }
      if (typeof code !== "string") {
        throw new TypeError("code must be a number or string");
      }
      var n = parseInt(code, 10);
      if (!isNaN(n)) {
        if (!status[n])
          throw new Error("invalid status code: " + n);
        return n;
      }
      n = status[code.toLowerCase()];
      if (!n)
        throw new Error('invalid status message: "' + code + '"');
      return n;
    }
  }
});

// ../node_modules/.pnpm/unpipe@1.0.0/node_modules/unpipe/index.js
var require_unpipe = __commonJS({
  "../node_modules/.pnpm/unpipe@1.0.0/node_modules/unpipe/index.js"(exports, module2) {
    "use strict";
    module2.exports = unpipe;
    function hasPipeDataListeners(stream) {
      var listeners = stream.listeners("data");
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].name === "ondata") {
          return true;
        }
      }
      return false;
    }
    function unpipe(stream) {
      if (!stream) {
        throw new TypeError("argument stream is required");
      }
      if (typeof stream.unpipe === "function") {
        stream.unpipe();
        return;
      }
      if (!hasPipeDataListeners(stream)) {
        return;
      }
      var listener;
      var listeners = stream.listeners("close");
      for (var i = 0; i < listeners.length; i++) {
        listener = listeners[i];
        if (listener.name !== "cleanup" && listener.name !== "onclose") {
          continue;
        }
        listener.call(stream);
      }
    }
  }
});

// ../node_modules/.pnpm/finalhandler@1.1.2/node_modules/finalhandler/index.js
var require_finalhandler = __commonJS({
  "../node_modules/.pnpm/finalhandler@1.1.2/node_modules/finalhandler/index.js"(exports, module2) {
    "use strict";
    var debug = require_src()("finalhandler");
    var encodeUrl = require_encodeurl();
    var escapeHtml = require_escape_html();
    var onFinished = require_on_finished();
    var parseUrl = require_parseurl();
    var statuses = require_statuses();
    var unpipe = require_unpipe();
    var DOUBLE_SPACE_REGEXP = /\x20{2}/g;
    var NEWLINE_REGEXP = /\n/g;
    var defer = typeof setImmediate === "function" ? setImmediate : function(fn) {
      process.nextTick(fn.bind.apply(fn, arguments));
    };
    var isFinished = onFinished.isFinished;
    function createHtmlDocument(message) {
      var body = escapeHtml(message).replace(NEWLINE_REGEXP, "<br>").replace(DOUBLE_SPACE_REGEXP, " &nbsp;");
      return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>' + body + "</pre>\n</body>\n</html>\n";
    }
    module2.exports = finalhandler;
    function finalhandler(req, res, options) {
      var opts = options || {};
      var env = opts.env || process.env.NODE_ENV || "development";
      var onerror = opts.onerror;
      return function(err) {
        var headers;
        var msg;
        var status;
        if (!err && headersSent(res)) {
          debug("cannot 404 after headers sent");
          return;
        }
        if (err) {
          status = getErrorStatusCode(err);
          if (status === void 0) {
            status = getResponseStatusCode(res);
          } else {
            headers = getErrorHeaders(err);
          }
          msg = getErrorMessage(err, status, env);
        } else {
          status = 404;
          msg = "Cannot " + req.method + " " + encodeUrl(getResourceName(req));
        }
        debug("default %s", status);
        if (err && onerror) {
          defer(onerror, err, req, res);
        }
        if (headersSent(res)) {
          debug("cannot %d after headers sent", status);
          req.socket.destroy();
          return;
        }
        send(req, res, status, headers, msg);
      };
    }
    function getErrorHeaders(err) {
      if (!err.headers || typeof err.headers !== "object") {
        return void 0;
      }
      var headers = /* @__PURE__ */ Object.create(null);
      var keys = Object.keys(err.headers);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        headers[key] = err.headers[key];
      }
      return headers;
    }
    function getErrorMessage(err, status, env) {
      var msg;
      if (env !== "production") {
        msg = err.stack;
        if (!msg && typeof err.toString === "function") {
          msg = err.toString();
        }
      }
      return msg || statuses[status];
    }
    function getErrorStatusCode(err) {
      if (typeof err.status === "number" && err.status >= 400 && err.status < 600) {
        return err.status;
      }
      if (typeof err.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600) {
        return err.statusCode;
      }
      return void 0;
    }
    function getResourceName(req) {
      try {
        return parseUrl.original(req).pathname;
      } catch (e) {
        return "resource";
      }
    }
    function getResponseStatusCode(res) {
      var status = res.statusCode;
      if (typeof status !== "number" || status < 400 || status > 599) {
        status = 500;
      }
      return status;
    }
    function headersSent(res) {
      return typeof res.headersSent !== "boolean" ? Boolean(res._header) : res.headersSent;
    }
    function send(req, res, status, headers, message) {
      function write() {
        var body = createHtmlDocument(message);
        res.statusCode = status;
        res.statusMessage = statuses[status];
        setHeaders(res, headers);
        res.setHeader("Content-Security-Policy", "default-src 'none'");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Length", Buffer.byteLength(body, "utf8"));
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        res.end(body, "utf8");
      }
      if (isFinished(req)) {
        write();
        return;
      }
      unpipe(req);
      onFinished(req, write);
      req.resume();
    }
    function setHeaders(res, headers) {
      if (!headers) {
        return;
      }
      var keys = Object.keys(headers);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        res.setHeader(key, headers[key]);
      }
    }
  }
});

// ../node_modules/.pnpm/utils-merge@1.0.1/node_modules/utils-merge/index.js
var require_utils_merge = __commonJS({
  "../node_modules/.pnpm/utils-merge@1.0.1/node_modules/utils-merge/index.js"(exports, module2) {
    "use strict";
    exports = module2.exports = function(a, b) {
      if (a && b) {
        for (var key in b) {
          a[key] = b[key];
        }
      }
      return a;
    };
  }
});

// ../node_modules/.pnpm/connect@3.7.0/node_modules/connect/index.js
var require_connect = __commonJS({
  "../node_modules/.pnpm/connect@3.7.0/node_modules/connect/index.js"(exports, module2) {
    "use strict";
    var debug = require_src()("connect:dispatcher");
    var EventEmitter2 = require("events").EventEmitter;
    var finalhandler = require_finalhandler();
    var http = require("http");
    var merge = require_utils_merge();
    var parseUrl = require_parseurl();
    module2.exports = createServer2;
    var env = process.env.NODE_ENV || "development";
    var proto = {};
    var defer = typeof setImmediate === "function" ? setImmediate : function(fn) {
      process.nextTick(fn.bind.apply(fn, arguments));
    };
    function createServer2() {
      function app(req, res, next) {
        app.handle(req, res, next);
      }
      merge(app, proto);
      merge(app, EventEmitter2.prototype);
      app.route = "/";
      app.stack = [];
      return app;
    }
    proto.use = function use(route, fn) {
      var handle = fn;
      var path2 = route;
      if (typeof route !== "string") {
        handle = route;
        path2 = "/";
      }
      if (typeof handle.handle === "function") {
        var server = handle;
        server.route = path2;
        handle = function(req, res, next) {
          server.handle(req, res, next);
        };
      }
      if (handle instanceof http.Server) {
        handle = handle.listeners("request")[0];
      }
      if (path2[path2.length - 1] === "/") {
        path2 = path2.slice(0, -1);
      }
      debug("use %s %s", path2 || "/", handle.name || "anonymous");
      this.stack.push({ route: path2, handle });
      return this;
    };
    proto.handle = function handle(req, res, out) {
      var index = 0;
      var protohost = getProtohost(req.url) || "";
      var removed = "";
      var slashAdded = false;
      var stack = this.stack;
      var done = out || finalhandler(req, res, {
        env,
        onerror: logerror
      });
      req.originalUrl = req.originalUrl || req.url;
      function next(err) {
        if (slashAdded) {
          req.url = req.url.substr(1);
          slashAdded = false;
        }
        if (removed.length !== 0) {
          req.url = protohost + removed + req.url.substr(protohost.length);
          removed = "";
        }
        var layer = stack[index++];
        if (!layer) {
          defer(done, err);
          return;
        }
        var path2 = parseUrl(req).pathname || "/";
        var route = layer.route;
        if (path2.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
          return next(err);
        }
        var c = path2.length > route.length && path2[route.length];
        if (c && c !== "/" && c !== ".") {
          return next(err);
        }
        if (route.length !== 0 && route !== "/") {
          removed = route;
          req.url = protohost + req.url.substr(protohost.length + removed.length);
          if (!protohost && req.url[0] !== "/") {
            req.url = "/" + req.url;
            slashAdded = true;
          }
        }
        call(layer.handle, route, err, req, res, next);
      }
      next();
    };
    proto.listen = function listen() {
      var server = http.createServer(this);
      return server.listen.apply(server, arguments);
    };
    function call(handle, route, err, req, res, next) {
      var arity = handle.length;
      var error = err;
      var hasError = Boolean(err);
      debug("%s %s : %s", handle.name || "<anonymous>", route, req.originalUrl);
      try {
        if (hasError && arity === 4) {
          handle(err, req, res, next);
          return;
        } else if (!hasError && arity < 4) {
          handle(req, res, next);
          return;
        }
      } catch (e) {
        error = e;
      }
      next(error);
    }
    function logerror(err) {
      if (env !== "test")
        console.error(err.stack || err.toString());
    }
    function getProtohost(url) {
      if (url.length === 0 || url[0] === "/") {
        return void 0;
      }
      var fqdnIndex = url.indexOf("://");
      return fqdnIndex !== -1 && url.lastIndexOf("?", fqdnIndex) === -1 ? url.substr(0, url.indexOf("/", 3 + fqdnIndex)) : void 0;
    }
  }
});

// src/node/server/middleware/indexHtml.ts
function indexHtmlMiddleware(server) {
  return async (req, res, next) => {
    const url = req.url;
    if (url === "/") {
      const htmlPath = import_path.default.resolve(server.config.root, "index.html");
      let html = await (0, import_promises.readFile)(htmlPath, "utf-8");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(html);
    }
    next();
  };
}
var import_promises, import_path;
var init_indexHtml = __esm({
  "src/node/server/middleware/indexHtml.ts"() {
    "use strict";
    import_promises = require("fs/promises");
    import_path = __toESM(require("path"));
  }
});

// src/node/server/index.ts
var server_exports = {};
__export(server_exports, {
  createServer: () => createServer
});
async function createServer() {
  const app = (0, import_connect.default)();
  const config = {
    root: process.cwd()
    // 定义一个全局root
  };
  const server = {
    config,
    async listen() {
      app.listen(3e3, async () => {
        console.log(`> \u672C\u5730\u8BBF\u95EE\u8DEF\u5F84: "http://localhost:3000"`);
      });
    }
  };
  app.use(indexHtmlMiddleware(server));
  return server;
}
var import_connect;
var init_server = __esm({
  "src/node/server/index.ts"() {
    "use strict";
    import_connect = __toESM(require_connect());
    init_indexHtml();
  }
});

// ../node_modules/.pnpm/cac@6.7.14/node_modules/cac/dist/index.mjs
var import_events = require("events");
function toArr(any) {
  return any == null ? [] : Array.isArray(any) ? any : [any];
}
function toVal(out, key, val, opts) {
  var x, old = out[key], nxt = !!~opts.string.indexOf(key) ? val == null || val === true ? "" : String(val) : typeof val === "boolean" ? val : !!~opts.boolean.indexOf(key) ? val === "false" ? false : val === "true" || (out._.push((x = +val, x * 0 === 0) ? x : val), !!val) : (x = +val, x * 0 === 0) ? x : val;
  out[key] = old == null ? nxt : Array.isArray(old) ? old.concat(nxt) : [old, nxt];
}
function mri2(args, opts) {
  args = args || [];
  opts = opts || {};
  var k, arr, arg, name, val, out = { _: [] };
  var i = 0, j = 0, idx = 0, len = args.length;
  const alibi = opts.alias !== void 0;
  const strict = opts.unknown !== void 0;
  const defaults = opts.default !== void 0;
  opts.alias = opts.alias || {};
  opts.string = toArr(opts.string);
  opts.boolean = toArr(opts.boolean);
  if (alibi) {
    for (k in opts.alias) {
      arr = opts.alias[k] = toArr(opts.alias[k]);
      for (i = 0; i < arr.length; i++) {
        (opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
      }
    }
  }
  for (i = opts.boolean.length; i-- > 0; ) {
    arr = opts.alias[opts.boolean[i]] || [];
    for (j = arr.length; j-- > 0; )
      opts.boolean.push(arr[j]);
  }
  for (i = opts.string.length; i-- > 0; ) {
    arr = opts.alias[opts.string[i]] || [];
    for (j = arr.length; j-- > 0; )
      opts.string.push(arr[j]);
  }
  if (defaults) {
    for (k in opts.default) {
      name = typeof opts.default[k];
      arr = opts.alias[k] = opts.alias[k] || [];
      if (opts[name] !== void 0) {
        opts[name].push(k);
        for (i = 0; i < arr.length; i++) {
          opts[name].push(arr[i]);
        }
      }
    }
  }
  const keys = strict ? Object.keys(opts.alias) : [];
  for (i = 0; i < len; i++) {
    arg = args[i];
    if (arg === "--") {
      out._ = out._.concat(args.slice(++i));
      break;
    }
    for (j = 0; j < arg.length; j++) {
      if (arg.charCodeAt(j) !== 45)
        break;
    }
    if (j === 0) {
      out._.push(arg);
    } else if (arg.substring(j, j + 3) === "no-") {
      name = arg.substring(j + 3);
      if (strict && !~keys.indexOf(name)) {
        return opts.unknown(arg);
      }
      out[name] = false;
    } else {
      for (idx = j + 1; idx < arg.length; idx++) {
        if (arg.charCodeAt(idx) === 61)
          break;
      }
      name = arg.substring(j, idx);
      val = arg.substring(++idx) || (i + 1 === len || ("" + args[i + 1]).charCodeAt(0) === 45 || args[++i]);
      arr = j === 2 ? [name] : name;
      for (idx = 0; idx < arr.length; idx++) {
        name = arr[idx];
        if (strict && !~keys.indexOf(name))
          return opts.unknown("-".repeat(j) + name);
        toVal(out, name, idx + 1 < arr.length || val, opts);
      }
    }
  }
  if (defaults) {
    for (k in opts.default) {
      if (out[k] === void 0) {
        out[k] = opts.default[k];
      }
    }
  }
  if (alibi) {
    for (k in out) {
      arr = opts.alias[k] || [];
      while (arr.length > 0) {
        out[arr.shift()] = out[k];
      }
    }
  }
  return out;
}
var removeBrackets = (v) => v.replace(/[<[].+/, "").trim();
var findAllBrackets = (v) => {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g;
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)\]/g;
  const res = [];
  const parse = (match) => {
    let variadic = false;
    let value = match[1];
    if (value.startsWith("...")) {
      value = value.slice(3);
      variadic = true;
    }
    return {
      required: match[0].startsWith("<"),
      value,
      variadic
    };
  };
  let angledMatch;
  while (angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v)) {
    res.push(parse(angledMatch));
  }
  let squareMatch;
  while (squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v)) {
    res.push(parse(squareMatch));
  }
  return res;
};
var getMriOptions = (options) => {
  const result = { alias: {}, boolean: [] };
  for (const [index, option] of options.entries()) {
    if (option.names.length > 1) {
      result.alias[option.names[0]] = option.names.slice(1);
    }
    if (option.isBoolean) {
      if (option.negated) {
        const hasStringTypeOption = options.some((o, i) => {
          return i !== index && o.names.some((name) => option.names.includes(name)) && typeof o.required === "boolean";
        });
        if (!hasStringTypeOption) {
          result.boolean.push(option.names[0]);
        }
      } else {
        result.boolean.push(option.names[0]);
      }
    }
  }
  return result;
};
var findLongest = (arr) => {
  return arr.sort((a, b) => {
    return a.length > b.length ? -1 : 1;
  })[0];
};
var padRight = (str, length) => {
  return str.length >= length ? str : `${str}${" ".repeat(length - str.length)}`;
};
var camelcase = (input) => {
  return input.replace(/([a-z])-([a-z])/g, (_, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
};
var setDotProp = (obj, keys, val) => {
  let i = 0;
  let length = keys.length;
  let t = obj;
  let x;
  for (; i < length; ++i) {
    x = t[keys[i]];
    t = t[keys[i]] = i === length - 1 ? val : x != null ? x : !!~keys[i + 1].indexOf(".") || !(+keys[i + 1] > -1) ? {} : [];
  }
};
var setByType = (obj, transforms) => {
  for (const key of Object.keys(transforms)) {
    const transform = transforms[key];
    if (transform.shouldTransform) {
      obj[key] = Array.prototype.concat.call([], obj[key]);
      if (typeof transform.transformFunction === "function") {
        obj[key] = obj[key].map(transform.transformFunction);
      }
    }
  }
};
var getFileName = (input) => {
  const m = /([^\\\/]+)$/.exec(input);
  return m ? m[1] : "";
};
var camelcaseOptionName = (name) => {
  return name.split(".").map((v, i) => {
    return i === 0 ? camelcase(v) : v;
  }).join(".");
};
var CACError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
};
var Option = class {
  constructor(rawName, description, config) {
    this.rawName = rawName;
    this.description = description;
    this.config = Object.assign({}, config);
    rawName = rawName.replace(/\.\*/g, "");
    this.negated = false;
    this.names = removeBrackets(rawName).split(",").map((v) => {
      let name = v.trim().replace(/^-{1,2}/, "");
      if (name.startsWith("no-")) {
        this.negated = true;
        name = name.replace(/^no-/, "");
      }
      return camelcaseOptionName(name);
    }).sort((a, b) => a.length > b.length ? 1 : -1);
    this.name = this.names[this.names.length - 1];
    if (this.negated && this.config.default == null) {
      this.config.default = true;
    }
    if (rawName.includes("<")) {
      this.required = true;
    } else if (rawName.includes("[")) {
      this.required = false;
    } else {
      this.isBoolean = true;
    }
  }
};
var processArgs = process.argv;
var platformInfo = `${process.platform}-${process.arch} node-${process.version}`;
var Command = class {
  constructor(rawName, description, config = {}, cli2) {
    this.rawName = rawName;
    this.description = description;
    this.config = config;
    this.cli = cli2;
    this.options = [];
    this.aliasNames = [];
    this.name = removeBrackets(rawName);
    this.args = findAllBrackets(rawName);
    this.examples = [];
  }
  usage(text) {
    this.usageText = text;
    return this;
  }
  allowUnknownOptions() {
    this.config.allowUnknownOptions = true;
    return this;
  }
  ignoreOptionDefaultValue() {
    this.config.ignoreOptionDefaultValue = true;
    return this;
  }
  version(version, customFlags = "-v, --version") {
    this.versionNumber = version;
    this.option(customFlags, "Display version number");
    return this;
  }
  example(example) {
    this.examples.push(example);
    return this;
  }
  option(rawName, description, config) {
    const option = new Option(rawName, description, config);
    this.options.push(option);
    return this;
  }
  alias(name) {
    this.aliasNames.push(name);
    return this;
  }
  action(callback) {
    this.commandAction = callback;
    return this;
  }
  isMatched(name) {
    return this.name === name || this.aliasNames.includes(name);
  }
  get isDefaultCommand() {
    return this.name === "" || this.aliasNames.includes("!");
  }
  get isGlobalCommand() {
    return this instanceof GlobalCommand;
  }
  hasOption(name) {
    name = name.split(".")[0];
    return this.options.find((option) => {
      return option.names.includes(name);
    });
  }
  outputHelp() {
    const { name, commands } = this.cli;
    const {
      versionNumber,
      options: globalOptions,
      helpCallback
    } = this.cli.globalCommand;
    let sections = [
      {
        body: `${name}${versionNumber ? `/${versionNumber}` : ""}`
      }
    ];
    sections.push({
      title: "Usage",
      body: `  $ ${name} ${this.usageText || this.rawName}`
    });
    const showCommands = (this.isGlobalCommand || this.isDefaultCommand) && commands.length > 0;
    if (showCommands) {
      const longestCommandName = findLongest(commands.map((command) => command.rawName));
      sections.push({
        title: "Commands",
        body: commands.map((command) => {
          return `  ${padRight(command.rawName, longestCommandName.length)}  ${command.description}`;
        }).join("\n")
      });
      sections.push({
        title: `For more info, run any command with the \`--help\` flag`,
        body: commands.map((command) => `  $ ${name}${command.name === "" ? "" : ` ${command.name}`} --help`).join("\n")
      });
    }
    let options = this.isGlobalCommand ? globalOptions : [...this.options, ...globalOptions || []];
    if (!this.isGlobalCommand && !this.isDefaultCommand) {
      options = options.filter((option) => option.name !== "version");
    }
    if (options.length > 0) {
      const longestOptionName = findLongest(options.map((option) => option.rawName));
      sections.push({
        title: "Options",
        body: options.map((option) => {
          return `  ${padRight(option.rawName, longestOptionName.length)}  ${option.description} ${option.config.default === void 0 ? "" : `(default: ${option.config.default})`}`;
        }).join("\n")
      });
    }
    if (this.examples.length > 0) {
      sections.push({
        title: "Examples",
        body: this.examples.map((example) => {
          if (typeof example === "function") {
            return example(name);
          }
          return example;
        }).join("\n")
      });
    }
    if (helpCallback) {
      sections = helpCallback(sections) || sections;
    }
    console.log(sections.map((section) => {
      return section.title ? `${section.title}:
${section.body}` : section.body;
    }).join("\n\n"));
  }
  outputVersion() {
    const { name } = this.cli;
    const { versionNumber } = this.cli.globalCommand;
    if (versionNumber) {
      console.log(`${name}/${versionNumber} ${platformInfo}`);
    }
  }
  checkRequiredArgs() {
    const minimalArgsCount = this.args.filter((arg) => arg.required).length;
    if (this.cli.args.length < minimalArgsCount) {
      throw new CACError(`missing required args for command \`${this.rawName}\``);
    }
  }
  checkUnknownOptions() {
    const { options, globalCommand } = this.cli;
    if (!this.config.allowUnknownOptions) {
      for (const name of Object.keys(options)) {
        if (name !== "--" && !this.hasOption(name) && !globalCommand.hasOption(name)) {
          throw new CACError(`Unknown option \`${name.length > 1 ? `--${name}` : `-${name}`}\``);
        }
      }
    }
  }
  checkOptionValue() {
    const { options: parsedOptions, globalCommand } = this.cli;
    const options = [...globalCommand.options, ...this.options];
    for (const option of options) {
      const value = parsedOptions[option.name.split(".")[0]];
      if (option.required) {
        const hasNegated = options.some((o) => o.negated && o.names.includes(option.name));
        if (value === true || value === false && !hasNegated) {
          throw new CACError(`option \`${option.rawName}\` value is missing`);
        }
      }
    }
  }
};
var GlobalCommand = class extends Command {
  constructor(cli2) {
    super("@@global@@", "", {}, cli2);
  }
};
var __assign = Object.assign;
var CAC = class extends import_events.EventEmitter {
  constructor(name = "") {
    super();
    this.name = name;
    this.commands = [];
    this.rawArgs = [];
    this.args = [];
    this.options = {};
    this.globalCommand = new GlobalCommand(this);
    this.globalCommand.usage("<command> [options]");
  }
  usage(text) {
    this.globalCommand.usage(text);
    return this;
  }
  command(rawName, description, config) {
    const command = new Command(rawName, description || "", config, this);
    command.globalCommand = this.globalCommand;
    this.commands.push(command);
    return command;
  }
  option(rawName, description, config) {
    this.globalCommand.option(rawName, description, config);
    return this;
  }
  help(callback) {
    this.globalCommand.option("-h, --help", "Display this message");
    this.globalCommand.helpCallback = callback;
    this.showHelpOnExit = true;
    return this;
  }
  version(version, customFlags = "-v, --version") {
    this.globalCommand.version(version, customFlags);
    this.showVersionOnExit = true;
    return this;
  }
  example(example) {
    this.globalCommand.example(example);
    return this;
  }
  outputHelp() {
    if (this.matchedCommand) {
      this.matchedCommand.outputHelp();
    } else {
      this.globalCommand.outputHelp();
    }
  }
  outputVersion() {
    this.globalCommand.outputVersion();
  }
  setParsedInfo({ args, options }, matchedCommand, matchedCommandName) {
    this.args = args;
    this.options = options;
    if (matchedCommand) {
      this.matchedCommand = matchedCommand;
    }
    if (matchedCommandName) {
      this.matchedCommandName = matchedCommandName;
    }
    return this;
  }
  unsetMatchedCommand() {
    this.matchedCommand = void 0;
    this.matchedCommandName = void 0;
  }
  parse(argv = processArgs, {
    run = true
  } = {}) {
    this.rawArgs = argv;
    if (!this.name) {
      this.name = argv[1] ? getFileName(argv[1]) : "cli";
    }
    let shouldParse = true;
    for (const command of this.commands) {
      const parsed = this.mri(argv.slice(2), command);
      const commandName = parsed.args[0];
      if (command.isMatched(commandName)) {
        shouldParse = false;
        const parsedInfo = __assign(__assign({}, parsed), {
          args: parsed.args.slice(1)
        });
        this.setParsedInfo(parsedInfo, command, commandName);
        this.emit(`command:${commandName}`, command);
      }
    }
    if (shouldParse) {
      for (const command of this.commands) {
        if (command.name === "") {
          shouldParse = false;
          const parsed = this.mri(argv.slice(2), command);
          this.setParsedInfo(parsed, command);
          this.emit(`command:!`, command);
        }
      }
    }
    if (shouldParse) {
      const parsed = this.mri(argv.slice(2));
      this.setParsedInfo(parsed);
    }
    if (this.options.help && this.showHelpOnExit) {
      this.outputHelp();
      run = false;
      this.unsetMatchedCommand();
    }
    if (this.options.version && this.showVersionOnExit && this.matchedCommandName == null) {
      this.outputVersion();
      run = false;
      this.unsetMatchedCommand();
    }
    const parsedArgv = { args: this.args, options: this.options };
    if (run) {
      this.runMatchedCommand();
    }
    if (!this.matchedCommand && this.args[0]) {
      this.emit("command:*");
    }
    return parsedArgv;
  }
  mri(argv, command) {
    const cliOptions = [
      ...this.globalCommand.options,
      ...command ? command.options : []
    ];
    const mriOptions = getMriOptions(cliOptions);
    let argsAfterDoubleDashes = [];
    const doubleDashesIndex = argv.indexOf("--");
    if (doubleDashesIndex > -1) {
      argsAfterDoubleDashes = argv.slice(doubleDashesIndex + 1);
      argv = argv.slice(0, doubleDashesIndex);
    }
    let parsed = mri2(argv, mriOptions);
    parsed = Object.keys(parsed).reduce((res, name) => {
      return __assign(__assign({}, res), {
        [camelcaseOptionName(name)]: parsed[name]
      });
    }, { _: [] });
    const args = parsed._;
    const options = {
      "--": argsAfterDoubleDashes
    };
    const ignoreDefault = command && command.config.ignoreOptionDefaultValue ? command.config.ignoreOptionDefaultValue : this.globalCommand.config.ignoreOptionDefaultValue;
    let transforms = /* @__PURE__ */ Object.create(null);
    for (const cliOption of cliOptions) {
      if (!ignoreDefault && cliOption.config.default !== void 0) {
        for (const name of cliOption.names) {
          options[name] = cliOption.config.default;
        }
      }
      if (Array.isArray(cliOption.config.type)) {
        if (transforms[cliOption.name] === void 0) {
          transforms[cliOption.name] = /* @__PURE__ */ Object.create(null);
          transforms[cliOption.name]["shouldTransform"] = true;
          transforms[cliOption.name]["transformFunction"] = cliOption.config.type[0];
        }
      }
    }
    for (const key of Object.keys(parsed)) {
      if (key !== "_") {
        const keys = key.split(".");
        setDotProp(options, keys, parsed[key]);
        setByType(options, transforms);
      }
    }
    return {
      args,
      options
    };
  }
  runMatchedCommand() {
    const { args, options, matchedCommand: command } = this;
    if (!command || !command.commandAction)
      return;
    command.checkUnknownOptions();
    command.checkOptionValue();
    command.checkRequiredArgs();
    const actionArgs = [];
    command.args.forEach((arg, index) => {
      if (arg.variadic) {
        actionArgs.push(args.slice(index));
      } else {
        actionArgs.push(args[index]);
      }
    });
    actionArgs.push(options);
    return command.commandAction.apply(this, actionArgs);
  }
};
var cac = (name = "") => new CAC(name);
var dist_default = cac;

// src/node/cli.ts
var cli = dist_default("vite");
cli.command("[root]", "start dev server").alias("serve").alias("dev").action(async () => {
  const { createServer: createServer2 } = await Promise.resolve().then(() => (init_server(), server_exports));
  const server = await createServer2();
  await server.listen();
});
cli.help();
cli.parse();
/*! Bundled license information:

encodeurl/index.js:
  (*!
   * encodeurl
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

escape-html/index.js:
  (*!
   * escape-html
   * Copyright(c) 2012-2013 TJ Holowaychuk
   * Copyright(c) 2015 Andreas Lubbe
   * Copyright(c) 2015 Tiancheng "Timothy" Gu
   * MIT Licensed
   *)

ee-first/index.js:
  (*!
   * ee-first
   * Copyright(c) 2014 Jonathan Ong
   * MIT Licensed
   *)

on-finished/index.js:
  (*!
   * on-finished
   * Copyright(c) 2013 Jonathan Ong
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)

parseurl/index.js:
  (*!
   * parseurl
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

unpipe/index.js:
  (*!
   * unpipe
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

finalhandler/index.js:
  (*!
   * finalhandler
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

connect/index.js:
  (*!
   * connect
   * Copyright(c) 2010 Sencha Inc.
   * Copyright(c) 2011 TJ Holowaychuk
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
