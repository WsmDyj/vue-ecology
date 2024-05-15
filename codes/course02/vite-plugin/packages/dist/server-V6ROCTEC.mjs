import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-QHOBBTS4.mjs";

// ../node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js
var require_ms = __commonJS({
  "../node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js"(exports, module) {
    "use strict";
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse4(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse4(str) {
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
      var n2 = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n2 * y;
        case "days":
        case "day":
        case "d":
          return n2 * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n2 * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n2 * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n2 * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n2;
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
    function plural(ms, n2, name) {
      if (ms < n2) {
        return;
      }
      if (ms < n2 * 1.5) {
        return Math.floor(ms / n2) + " " + name;
      }
      return Math.ceil(ms / n2) + " " + name + "s";
    }
  }
});

// ../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js"(exports, module) {
    "use strict";
    exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
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
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js"(exports, module) {
    "use strict";
    exports = module.exports = require_debug();
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
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js"(exports, module) {
    "use strict";
    var tty = __require("tty");
    var util = __require("util");
    exports = module.exports = require_debug();
    exports.init = init2;
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
          var fs2 = __require("fs");
          stream2 = new fs2.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = __require("net");
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
    function init2(debug) {
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
  "../node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js"(exports, module) {
    "use strict";
    if (typeof process !== "undefined" && process.type === "renderer") {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// ../node_modules/.pnpm/encodeurl@1.0.2/node_modules/encodeurl/index.js
var require_encodeurl = __commonJS({
  "../node_modules/.pnpm/encodeurl@1.0.2/node_modules/encodeurl/index.js"(exports, module) {
    "use strict";
    module.exports = encodeUrl;
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
  "../node_modules/.pnpm/escape-html@1.0.3/node_modules/escape-html/index.js"(exports, module) {
    "use strict";
    var matchHtmlRegExp = /["'&<>]/;
    module.exports = escapeHtml;
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
  "../node_modules/.pnpm/ee-first@1.1.1/node_modules/ee-first/index.js"(exports, module) {
    "use strict";
    module.exports = first;
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
  "../node_modules/.pnpm/on-finished@2.3.0/node_modules/on-finished/index.js"(exports, module) {
    "use strict";
    module.exports = onFinished;
    module.exports.isFinished = isFinished;
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
  "../node_modules/.pnpm/parseurl@1.3.3/node_modules/parseurl/index.js"(exports, module) {
    "use strict";
    var url = __require("url");
    var parse4 = url.parse;
    var Url = url.Url;
    module.exports = parseurl;
    module.exports.original = originalurl;
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
        return parse4(str);
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
            return parse4(str);
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
  "../node_modules/.pnpm/statuses@1.5.0/node_modules/statuses/codes.json"(exports, module) {
    module.exports = {
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
  "../node_modules/.pnpm/statuses@1.5.0/node_modules/statuses/index.js"(exports, module) {
    "use strict";
    var codes = require_codes();
    module.exports = status;
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
      var n2 = parseInt(code, 10);
      if (!isNaN(n2)) {
        if (!status[n2])
          throw new Error("invalid status code: " + n2);
        return n2;
      }
      n2 = status[code.toLowerCase()];
      if (!n2)
        throw new Error('invalid status message: "' + code + '"');
      return n2;
    }
  }
});

// ../node_modules/.pnpm/unpipe@1.0.0/node_modules/unpipe/index.js
var require_unpipe = __commonJS({
  "../node_modules/.pnpm/unpipe@1.0.0/node_modules/unpipe/index.js"(exports, module) {
    "use strict";
    module.exports = unpipe;
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
  "../node_modules/.pnpm/finalhandler@1.1.2/node_modules/finalhandler/index.js"(exports, module) {
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
    module.exports = finalhandler;
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
        send2(req, res, status, headers, msg);
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
    function send2(req, res, status, headers, message) {
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
  "../node_modules/.pnpm/utils-merge@1.0.1/node_modules/utils-merge/index.js"(exports, module) {
    "use strict";
    exports = module.exports = function(a, b) {
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
  "../node_modules/.pnpm/connect@3.7.0/node_modules/connect/index.js"(exports, module) {
    "use strict";
    var debug = require_src()("connect:dispatcher");
    var EventEmitter = __require("events").EventEmitter;
    var finalhandler = require_finalhandler();
    var http = __require("http");
    var merge = require_utils_merge();
    var parseUrl = require_parseurl();
    module.exports = createServer2;
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
      merge(app, EventEmitter.prototype);
      app.route = "/";
      app.stack = [];
      return app;
    }
    proto.use = function use(route, fn) {
      var handle = fn;
      var path5 = route;
      if (typeof route !== "string") {
        handle = route;
        path5 = "/";
      }
      if (typeof handle.handle === "function") {
        var server = handle;
        server.route = path5;
        handle = function(req, res, next) {
          server.handle(req, res, next);
        };
      }
      if (handle instanceof http.Server) {
        handle = handle.listeners("request")[0];
      }
      if (path5[path5.length - 1] === "/") {
        path5 = path5.slice(0, -1);
      }
      debug("use %s %s", path5 || "/", handle.name || "anonymous");
      this.stack.push({ route: path5, handle });
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
        var path5 = parseUrl(req).pathname || "/";
        var route = layer.route;
        if (path5.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
          return next(err);
        }
        var c = path5.length > route.length && path5[route.length];
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

// ../node_modules/.pnpm/connect-history-api-fallback@2.0.0/node_modules/connect-history-api-fallback/lib/index.js
var require_lib = __commonJS({
  "../node_modules/.pnpm/connect-history-api-fallback@2.0.0/node_modules/connect-history-api-fallback/lib/index.js"(exports, module) {
    "use strict";
    var url = __require("url");
    exports = module.exports = function historyApiFallback(options) {
      options = options || {};
      var logger = getLogger(options);
      return function(req, res, next) {
        var headers = req.headers;
        if (req.method !== "GET" && req.method !== "HEAD") {
          logger(
            "Not rewriting",
            req.method,
            req.url,
            "because the method is not GET or HEAD."
          );
          return next();
        } else if (!headers || typeof headers.accept !== "string") {
          logger(
            "Not rewriting",
            req.method,
            req.url,
            "because the client did not send an HTTP accept header."
          );
          return next();
        } else if (headers.accept.indexOf("application/json") === 0) {
          logger(
            "Not rewriting",
            req.method,
            req.url,
            "because the client prefers JSON."
          );
          return next();
        } else if (!acceptsHtml(headers.accept, options)) {
          logger(
            "Not rewriting",
            req.method,
            req.url,
            "because the client does not accept HTML."
          );
          return next();
        }
        var parsedUrl = url.parse(req.url);
        var rewriteTarget;
        options.rewrites = options.rewrites || [];
        for (var i = 0; i < options.rewrites.length; i++) {
          var rewrite = options.rewrites[i];
          var match = parsedUrl.pathname.match(rewrite.from);
          if (match !== null) {
            rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to, req);
            if (rewriteTarget.charAt(0) !== "/") {
              logger(
                "We recommend using an absolute path for the rewrite target.",
                "Received a non-absolute rewrite target",
                rewriteTarget,
                "for URL",
                req.url
              );
            }
            logger("Rewriting", req.method, req.url, "to", rewriteTarget);
            req.url = rewriteTarget;
            return next();
          }
        }
        var pathname = parsedUrl.pathname;
        if (pathname.lastIndexOf(".") > pathname.lastIndexOf("/") && options.disableDotRule !== true) {
          logger(
            "Not rewriting",
            req.method,
            req.url,
            "because the path includes a dot (.) character."
          );
          return next();
        }
        rewriteTarget = options.index || "/index.html";
        logger("Rewriting", req.method, req.url, "to", rewriteTarget);
        req.url = rewriteTarget;
        next();
      };
    };
    function evaluateRewriteRule(parsedUrl, match, rule, req) {
      if (typeof rule === "string") {
        return rule;
      } else if (typeof rule !== "function") {
        throw new Error("Rewrite rule can only be of type string or function.");
      }
      return rule({
        parsedUrl,
        match,
        request: req
      });
    }
    function acceptsHtml(header, options) {
      options.htmlAcceptHeaders = options.htmlAcceptHeaders || ["text/html", "*/*"];
      for (var i = 0; i < options.htmlAcceptHeaders.length; i++) {
        if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
          return true;
        }
      }
      return false;
    }
    function getLogger(options) {
      if (options && options.logger) {
        return options.logger;
      } else if (options && options.verbose) {
        return console.log.bind(console);
      }
      return function() {
      };
    }
  }
});

// src/node/server/index.ts
var import_connect = __toESM(require_connect());

// src/node/server/middleware/indexHtml.ts
import path from "path";
import { readFile } from "fs/promises";
function indexHtmlMiddleware(server) {
  return async (req, res, next) => {
    const url = req.url;
    if (url?.endsWith(".html")) {
      const htmlPath = path.resolve(server.config.root, "index.html");
      let html = await readFile(htmlPath, "utf-8");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(html);
    }
    next();
  };
}

// src/node/server/middleware/htmlFallback.ts
var import_connect_history_api_fallback = __toESM(require_lib());
function htmlFallbackMiddleware(server) {
  return async (req, res, next) => {
    const historyHtmlFallbackMiddleware = (0, import_connect_history_api_fallback.default)({
      rewrites: [
        {
          from: /\/$/,
          to({ parsedUrl }) {
            const rewritten = decodeURIComponent(parsedUrl.pathname) + "index.html";
            return rewritten;
          }
        }
      ]
    });
    return historyHtmlFallbackMiddleware(req, res, next);
  };
}

// ../node_modules/.pnpm/sirv@2.0.3/node_modules/sirv/build.mjs
import * as fs from "fs";
import { join as join2, normalize, resolve as resolve2 } from "path";

// ../node_modules/.pnpm/totalist@3.0.1/node_modules/totalist/sync/index.mjs
import { join, resolve } from "path";
import { readdirSync, statSync } from "fs";
function totalist(dir, callback, pre = "") {
  dir = resolve(".", dir);
  let arr = readdirSync(dir);
  let i = 0, abs, stats;
  for (; i < arr.length; i++) {
    abs = join(dir, arr[i]);
    stats = statSync(abs);
    stats.isDirectory() ? totalist(abs, callback, join(pre, arr[i])) : callback(join(pre, arr[i]), abs, stats);
  }
}

// ../node_modules/.pnpm/@polka+url@1.0.0-next.21/node_modules/@polka/url/build.mjs
import * as qs from "querystring";
function parse2(req) {
  let raw = req.url;
  if (raw == null)
    return;
  let prev = req._parsedUrl;
  if (prev && prev.raw === raw)
    return prev;
  let pathname = raw, search = "", query;
  if (raw.length > 1) {
    let idx = raw.indexOf("?", 1);
    if (idx !== -1) {
      search = raw.substring(idx);
      pathname = raw.substring(0, idx);
      if (search.length > 1) {
        query = qs.parse(search.substring(1));
      }
    }
  }
  return req._parsedUrl = { pathname, search, query, raw };
}

// ../node_modules/.pnpm/mrmime@1.0.1/node_modules/mrmime/index.mjs
var mimes = {
  "ez": "application/andrew-inset",
  "aw": "application/applixware",
  "atom": "application/atom+xml",
  "atomcat": "application/atomcat+xml",
  "atomdeleted": "application/atomdeleted+xml",
  "atomsvc": "application/atomsvc+xml",
  "dwd": "application/atsc-dwd+xml",
  "held": "application/atsc-held+xml",
  "rsat": "application/atsc-rsat+xml",
  "bdoc": "application/bdoc",
  "xcs": "application/calendar+xml",
  "ccxml": "application/ccxml+xml",
  "cdfx": "application/cdfx+xml",
  "cdmia": "application/cdmi-capability",
  "cdmic": "application/cdmi-container",
  "cdmid": "application/cdmi-domain",
  "cdmio": "application/cdmi-object",
  "cdmiq": "application/cdmi-queue",
  "cu": "application/cu-seeme",
  "mpd": "application/dash+xml",
  "davmount": "application/davmount+xml",
  "dbk": "application/docbook+xml",
  "dssc": "application/dssc+der",
  "xdssc": "application/dssc+xml",
  "es": "application/ecmascript",
  "ecma": "application/ecmascript",
  "emma": "application/emma+xml",
  "emotionml": "application/emotionml+xml",
  "epub": "application/epub+zip",
  "exi": "application/exi",
  "fdt": "application/fdt+xml",
  "pfr": "application/font-tdpfr",
  "geojson": "application/geo+json",
  "gml": "application/gml+xml",
  "gpx": "application/gpx+xml",
  "gxf": "application/gxf",
  "gz": "application/gzip",
  "hjson": "application/hjson",
  "stk": "application/hyperstudio",
  "ink": "application/inkml+xml",
  "inkml": "application/inkml+xml",
  "ipfix": "application/ipfix",
  "its": "application/its+xml",
  "jar": "application/java-archive",
  "war": "application/java-archive",
  "ear": "application/java-archive",
  "ser": "application/java-serialized-object",
  "class": "application/java-vm",
  "js": "application/javascript",
  "mjs": "application/javascript",
  "json": "application/json",
  "map": "application/json",
  "json5": "application/json5",
  "jsonml": "application/jsonml+json",
  "jsonld": "application/ld+json",
  "lgr": "application/lgr+xml",
  "lostxml": "application/lost+xml",
  "hqx": "application/mac-binhex40",
  "cpt": "application/mac-compactpro",
  "mads": "application/mads+xml",
  "webmanifest": "application/manifest+json",
  "mrc": "application/marc",
  "mrcx": "application/marcxml+xml",
  "ma": "application/mathematica",
  "nb": "application/mathematica",
  "mb": "application/mathematica",
  "mathml": "application/mathml+xml",
  "mbox": "application/mbox",
  "mscml": "application/mediaservercontrol+xml",
  "metalink": "application/metalink+xml",
  "meta4": "application/metalink4+xml",
  "mets": "application/mets+xml",
  "maei": "application/mmt-aei+xml",
  "musd": "application/mmt-usd+xml",
  "mods": "application/mods+xml",
  "m21": "application/mp21",
  "mp21": "application/mp21",
  "mp4s": "application/mp4",
  "m4p": "application/mp4",
  "doc": "application/msword",
  "dot": "application/msword",
  "mxf": "application/mxf",
  "nq": "application/n-quads",
  "nt": "application/n-triples",
  "cjs": "application/node",
  "bin": "application/octet-stream",
  "dms": "application/octet-stream",
  "lrf": "application/octet-stream",
  "mar": "application/octet-stream",
  "so": "application/octet-stream",
  "dist": "application/octet-stream",
  "distz": "application/octet-stream",
  "pkg": "application/octet-stream",
  "bpk": "application/octet-stream",
  "dump": "application/octet-stream",
  "elc": "application/octet-stream",
  "deploy": "application/octet-stream",
  "exe": "application/octet-stream",
  "dll": "application/octet-stream",
  "deb": "application/octet-stream",
  "dmg": "application/octet-stream",
  "iso": "application/octet-stream",
  "img": "application/octet-stream",
  "msi": "application/octet-stream",
  "msp": "application/octet-stream",
  "msm": "application/octet-stream",
  "buffer": "application/octet-stream",
  "oda": "application/oda",
  "opf": "application/oebps-package+xml",
  "ogx": "application/ogg",
  "omdoc": "application/omdoc+xml",
  "onetoc": "application/onenote",
  "onetoc2": "application/onenote",
  "onetmp": "application/onenote",
  "onepkg": "application/onenote",
  "oxps": "application/oxps",
  "relo": "application/p2p-overlay+xml",
  "xer": "application/patch-ops-error+xml",
  "pdf": "application/pdf",
  "pgp": "application/pgp-encrypted",
  "asc": "application/pgp-signature",
  "sig": "application/pgp-signature",
  "prf": "application/pics-rules",
  "p10": "application/pkcs10",
  "p7m": "application/pkcs7-mime",
  "p7c": "application/pkcs7-mime",
  "p7s": "application/pkcs7-signature",
  "p8": "application/pkcs8",
  "ac": "application/pkix-attr-cert",
  "cer": "application/pkix-cert",
  "crl": "application/pkix-crl",
  "pkipath": "application/pkix-pkipath",
  "pki": "application/pkixcmp",
  "pls": "application/pls+xml",
  "ai": "application/postscript",
  "eps": "application/postscript",
  "ps": "application/postscript",
  "provx": "application/provenance+xml",
  "cww": "application/prs.cww",
  "pskcxml": "application/pskc+xml",
  "raml": "application/raml+yaml",
  "rdf": "application/rdf+xml",
  "owl": "application/rdf+xml",
  "rif": "application/reginfo+xml",
  "rnc": "application/relax-ng-compact-syntax",
  "rl": "application/resource-lists+xml",
  "rld": "application/resource-lists-diff+xml",
  "rs": "application/rls-services+xml",
  "rapd": "application/route-apd+xml",
  "sls": "application/route-s-tsid+xml",
  "rusd": "application/route-usd+xml",
  "gbr": "application/rpki-ghostbusters",
  "mft": "application/rpki-manifest",
  "roa": "application/rpki-roa",
  "rsd": "application/rsd+xml",
  "rss": "application/rss+xml",
  "rtf": "application/rtf",
  "sbml": "application/sbml+xml",
  "scq": "application/scvp-cv-request",
  "scs": "application/scvp-cv-response",
  "spq": "application/scvp-vp-request",
  "spp": "application/scvp-vp-response",
  "sdp": "application/sdp",
  "senmlx": "application/senml+xml",
  "sensmlx": "application/sensml+xml",
  "setpay": "application/set-payment-initiation",
  "setreg": "application/set-registration-initiation",
  "shf": "application/shf+xml",
  "siv": "application/sieve",
  "sieve": "application/sieve",
  "smi": "application/smil+xml",
  "smil": "application/smil+xml",
  "rq": "application/sparql-query",
  "srx": "application/sparql-results+xml",
  "gram": "application/srgs",
  "grxml": "application/srgs+xml",
  "sru": "application/sru+xml",
  "ssdl": "application/ssdl+xml",
  "ssml": "application/ssml+xml",
  "swidtag": "application/swid+xml",
  "tei": "application/tei+xml",
  "teicorpus": "application/tei+xml",
  "tfi": "application/thraud+xml",
  "tsd": "application/timestamped-data",
  "toml": "application/toml",
  "trig": "application/trig",
  "ttml": "application/ttml+xml",
  "ubj": "application/ubjson",
  "rsheet": "application/urc-ressheet+xml",
  "td": "application/urc-targetdesc+xml",
  "vxml": "application/voicexml+xml",
  "wasm": "application/wasm",
  "wgt": "application/widget",
  "hlp": "application/winhlp",
  "wsdl": "application/wsdl+xml",
  "wspolicy": "application/wspolicy+xml",
  "xaml": "application/xaml+xml",
  "xav": "application/xcap-att+xml",
  "xca": "application/xcap-caps+xml",
  "xdf": "application/xcap-diff+xml",
  "xel": "application/xcap-el+xml",
  "xns": "application/xcap-ns+xml",
  "xenc": "application/xenc+xml",
  "xhtml": "application/xhtml+xml",
  "xht": "application/xhtml+xml",
  "xlf": "application/xliff+xml",
  "xml": "application/xml",
  "xsl": "application/xml",
  "xsd": "application/xml",
  "rng": "application/xml",
  "dtd": "application/xml-dtd",
  "xop": "application/xop+xml",
  "xpl": "application/xproc+xml",
  "xslt": "application/xml",
  "xspf": "application/xspf+xml",
  "mxml": "application/xv+xml",
  "xhvml": "application/xv+xml",
  "xvml": "application/xv+xml",
  "xvm": "application/xv+xml",
  "yang": "application/yang",
  "yin": "application/yin+xml",
  "zip": "application/zip",
  "3gpp": "video/3gpp",
  "adp": "audio/adpcm",
  "amr": "audio/amr",
  "au": "audio/basic",
  "snd": "audio/basic",
  "mid": "audio/midi",
  "midi": "audio/midi",
  "kar": "audio/midi",
  "rmi": "audio/midi",
  "mxmf": "audio/mobile-xmf",
  "mp3": "audio/mpeg",
  "m4a": "audio/mp4",
  "mp4a": "audio/mp4",
  "mpga": "audio/mpeg",
  "mp2": "audio/mpeg",
  "mp2a": "audio/mpeg",
  "m2a": "audio/mpeg",
  "m3a": "audio/mpeg",
  "oga": "audio/ogg",
  "ogg": "audio/ogg",
  "spx": "audio/ogg",
  "opus": "audio/ogg",
  "s3m": "audio/s3m",
  "sil": "audio/silk",
  "wav": "audio/wav",
  "weba": "audio/webm",
  "xm": "audio/xm",
  "ttc": "font/collection",
  "otf": "font/otf",
  "ttf": "font/ttf",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "exr": "image/aces",
  "apng": "image/apng",
  "avif": "image/avif",
  "bmp": "image/bmp",
  "cgm": "image/cgm",
  "drle": "image/dicom-rle",
  "emf": "image/emf",
  "fits": "image/fits",
  "g3": "image/g3fax",
  "gif": "image/gif",
  "heic": "image/heic",
  "heics": "image/heic-sequence",
  "heif": "image/heif",
  "heifs": "image/heif-sequence",
  "hej2": "image/hej2k",
  "hsj2": "image/hsj2",
  "ief": "image/ief",
  "jls": "image/jls",
  "jp2": "image/jp2",
  "jpg2": "image/jp2",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "jpe": "image/jpeg",
  "jph": "image/jph",
  "jhc": "image/jphc",
  "jpm": "image/jpm",
  "jpx": "image/jpx",
  "jpf": "image/jpx",
  "jxr": "image/jxr",
  "jxra": "image/jxra",
  "jxrs": "image/jxrs",
  "jxs": "image/jxs",
  "jxsc": "image/jxsc",
  "jxsi": "image/jxsi",
  "jxss": "image/jxss",
  "ktx": "image/ktx",
  "ktx2": "image/ktx2",
  "png": "image/png",
  "btif": "image/prs.btif",
  "pti": "image/prs.pti",
  "sgi": "image/sgi",
  "svg": "image/svg+xml",
  "svgz": "image/svg+xml",
  "t38": "image/t38",
  "tif": "image/tiff",
  "tiff": "image/tiff",
  "tfx": "image/tiff-fx",
  "webp": "image/webp",
  "wmf": "image/wmf",
  "disposition-notification": "message/disposition-notification",
  "u8msg": "message/global",
  "u8dsn": "message/global-delivery-status",
  "u8mdn": "message/global-disposition-notification",
  "u8hdr": "message/global-headers",
  "eml": "message/rfc822",
  "mime": "message/rfc822",
  "3mf": "model/3mf",
  "gltf": "model/gltf+json",
  "glb": "model/gltf-binary",
  "igs": "model/iges",
  "iges": "model/iges",
  "msh": "model/mesh",
  "mesh": "model/mesh",
  "silo": "model/mesh",
  "mtl": "model/mtl",
  "obj": "model/obj",
  "stpz": "model/step+zip",
  "stpxz": "model/step-xml+zip",
  "stl": "model/stl",
  "wrl": "model/vrml",
  "vrml": "model/vrml",
  "x3db": "model/x3d+fastinfoset",
  "x3dbz": "model/x3d+binary",
  "x3dv": "model/x3d-vrml",
  "x3dvz": "model/x3d+vrml",
  "x3d": "model/x3d+xml",
  "x3dz": "model/x3d+xml",
  "appcache": "text/cache-manifest",
  "manifest": "text/cache-manifest",
  "ics": "text/calendar",
  "ifb": "text/calendar",
  "coffee": "text/coffeescript",
  "litcoffee": "text/coffeescript",
  "css": "text/css",
  "csv": "text/csv",
  "html": "text/html",
  "htm": "text/html",
  "shtml": "text/html",
  "jade": "text/jade",
  "jsx": "text/jsx",
  "less": "text/less",
  "markdown": "text/markdown",
  "md": "text/markdown",
  "mml": "text/mathml",
  "mdx": "text/mdx",
  "n3": "text/n3",
  "txt": "text/plain",
  "text": "text/plain",
  "conf": "text/plain",
  "def": "text/plain",
  "list": "text/plain",
  "log": "text/plain",
  "in": "text/plain",
  "ini": "text/plain",
  "dsc": "text/prs.lines.tag",
  "rtx": "text/richtext",
  "sgml": "text/sgml",
  "sgm": "text/sgml",
  "shex": "text/shex",
  "slim": "text/slim",
  "slm": "text/slim",
  "spdx": "text/spdx",
  "stylus": "text/stylus",
  "styl": "text/stylus",
  "tsv": "text/tab-separated-values",
  "t": "text/troff",
  "tr": "text/troff",
  "roff": "text/troff",
  "man": "text/troff",
  "me": "text/troff",
  "ms": "text/troff",
  "ttl": "text/turtle",
  "uri": "text/uri-list",
  "uris": "text/uri-list",
  "urls": "text/uri-list",
  "vcard": "text/vcard",
  "vtt": "text/vtt",
  "yaml": "text/yaml",
  "yml": "text/yaml",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  "h261": "video/h261",
  "h263": "video/h263",
  "h264": "video/h264",
  "m4s": "video/iso.segment",
  "jpgv": "video/jpeg",
  "jpgm": "image/jpm",
  "mj2": "video/mj2",
  "mjp2": "video/mj2",
  "ts": "video/mp2t",
  "mp4": "video/mp4",
  "mp4v": "video/mp4",
  "mpg4": "video/mp4",
  "mpeg": "video/mpeg",
  "mpg": "video/mpeg",
  "mpe": "video/mpeg",
  "m1v": "video/mpeg",
  "m2v": "video/mpeg",
  "ogv": "video/ogg",
  "qt": "video/quicktime",
  "mov": "video/quicktime",
  "webm": "video/webm"
};
function lookup(extn) {
  let tmp = ("" + extn).trim().toLowerCase();
  let idx = tmp.lastIndexOf(".");
  return mimes[!~idx ? tmp : tmp.substring(++idx)];
}

// ../node_modules/.pnpm/sirv@2.0.3/node_modules/sirv/build.mjs
var noop = () => {
};
function isMatch(uri, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].test(uri))
      return true;
  }
}
function toAssume(uri, extns) {
  let i = 0, x, len = uri.length - 1;
  if (uri.charCodeAt(len) === 47) {
    uri = uri.substring(0, len);
  }
  let arr = [], tmp = `${uri}/index`;
  for (; i < extns.length; i++) {
    x = extns[i] ? `.${extns[i]}` : "";
    if (uri)
      arr.push(uri + x);
    arr.push(tmp + x);
  }
  return arr;
}
function viaCache(cache, uri, extns) {
  let i = 0, data, arr = toAssume(uri, extns);
  for (; i < arr.length; i++) {
    if (data = cache[arr[i]])
      return data;
  }
}
function viaLocal(dir, isEtag, uri, extns) {
  let i = 0, arr = toAssume(uri, extns);
  let abs, stats, name, headers;
  for (; i < arr.length; i++) {
    abs = normalize(join2(dir, name = arr[i]));
    if (abs.startsWith(dir) && fs.existsSync(abs)) {
      stats = fs.statSync(abs);
      if (stats.isDirectory())
        continue;
      headers = toHeaders(name, stats, isEtag);
      headers["Cache-Control"] = isEtag ? "no-cache" : "no-store";
      return { abs, stats, headers };
    }
  }
}
function is404(req, res) {
  return res.statusCode = 404, res.end();
}
function send(req, res, file, stats, headers) {
  let code = 200, tmp, opts = {};
  headers = { ...headers };
  for (let key in headers) {
    tmp = res.getHeader(key);
    if (tmp)
      headers[key] = tmp;
  }
  if (tmp = res.getHeader("content-type")) {
    headers["Content-Type"] = tmp;
  }
  if (req.headers.range) {
    code = 206;
    let [x, y] = req.headers.range.replace("bytes=", "").split("-");
    let end = opts.end = parseInt(y, 10) || stats.size - 1;
    let start = opts.start = parseInt(x, 10) || 0;
    if (end >= stats.size) {
      end = stats.size - 1;
    }
    if (start >= stats.size) {
      res.setHeader("Content-Range", `bytes */${stats.size}`);
      res.statusCode = 416;
      return res.end();
    }
    headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
    headers["Content-Length"] = end - start + 1;
    headers["Accept-Ranges"] = "bytes";
  }
  res.writeHead(code, headers);
  fs.createReadStream(file, opts).pipe(res);
}
var ENCODING = {
  ".br": "br",
  ".gz": "gzip"
};
function toHeaders(name, stats, isEtag) {
  let enc = ENCODING[name.slice(-3)];
  let ctype = lookup(name.slice(0, enc && -3)) || "";
  if (ctype === "text/html")
    ctype += ";charset=utf-8";
  let headers = {
    "Content-Length": stats.size,
    "Content-Type": ctype,
    "Last-Modified": stats.mtime.toUTCString()
  };
  if (enc)
    headers["Content-Encoding"] = enc;
  if (isEtag)
    headers["ETag"] = `W/"${stats.size}-${stats.mtime.getTime()}"`;
  return headers;
}
function build_default(dir, opts = {}) {
  dir = resolve2(dir || ".");
  let isNotFound = opts.onNoMatch || is404;
  let setHeaders = opts.setHeaders || noop;
  let extensions = opts.extensions || ["html", "htm"];
  let gzips = opts.gzip && extensions.map((x) => `${x}.gz`).concat("gz");
  let brots = opts.brotli && extensions.map((x) => `${x}.br`).concat("br");
  const FILES = {};
  let fallback = "/";
  let isEtag = !!opts.etag;
  let isSPA = !!opts.single;
  if (typeof opts.single === "string") {
    let idx = opts.single.lastIndexOf(".");
    fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
  }
  let ignores = [];
  if (opts.ignores !== false) {
    ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/);
    if (opts.dotfiles)
      ignores.push(/\/\.\w/);
    else
      ignores.push(/\/\.well-known/);
    [].concat(opts.ignores || []).forEach((x) => {
      ignores.push(new RegExp(x, "i"));
    });
  }
  let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
  if (cc && opts.immutable)
    cc += ",immutable";
  else if (cc && opts.maxAge === 0)
    cc += ",must-revalidate";
  if (!opts.dev) {
    totalist(dir, (name, abs, stats) => {
      if (/\.well-known[\\+\/]/.test(name)) {
      } else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name))
        return;
      let headers = toHeaders(name, stats, isEtag);
      if (cc)
        headers["Cache-Control"] = cc;
      FILES["/" + name.normalize().replace(/\\+/g, "/")] = { abs, stats, headers };
    });
  }
  let lookup2 = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);
  return function(req, res, next) {
    let extns = [""];
    let pathname = parse2(req).pathname;
    let val = req.headers["accept-encoding"] || "";
    if (gzips && val.includes("gzip"))
      extns.unshift(...gzips);
    if (brots && /(br|brotli)/i.test(val))
      extns.unshift(...brots);
    extns.push(...extensions);
    if (pathname.indexOf("%") !== -1) {
      try {
        pathname = decodeURI(pathname);
      } catch (err) {
      }
    }
    let data = lookup2(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup2(fallback, extns);
    if (!data)
      return next ? next() : isNotFound(req, res);
    if (isEtag && req.headers["if-none-match"] === data.headers["ETag"]) {
      res.writeHead(304);
      return res.end();
    }
    if (gzips || brots) {
      res.setHeader("Vary", "Accept-Encoding");
    }
    setHeaders(res, pathname, data.stats);
    send(req, res, data.abs, data.stats, data.headers);
  };
}

// src/node/server/middleware/static.ts
var sirvOptions = {
  // sirv的一些配置
  dev: true,
  etag: true,
  extensions: []
};
function serveStaticMiddleware(server) {
  return function viteServeStaticMiddleware(req, res, next) {
    const serve = build_default(
      server.config.root,
      // 项目根路径
      sirvOptions
    );
    serve(req, res, next);
  };
}

// src/node/server/middleware/transform.ts
import path3 from "node:path";

// src/node/utils.ts
import path2 from "node:path";
import os from "node:os";
function cleanUrl(url) {
  return url.replace(/[?#].*$/s, "");
}
var CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
var knownJsSrcRE = /\.(?:[jt]sx?|m[jt]s|vue|marko|svelte|astro|imba)(?:$|\?)/;
var importQueryRE = /(\?|&)import=?(?:&|$)/;
var isImportRequest = (url) => importQueryRE.test(url);
var isJSRequest = (url) => {
  url = cleanUrl(url);
  if (knownJsSrcRE.test(url)) {
    return true;
  }
  if (!path2.extname(url) && url[url.length - 1] !== "/") {
    return true;
  }
  return false;
};
var isCSSRequest = (request) => CSS_LANGS_RE.test(request);
var isWindows = os.platform() === "win32";
function slash(p) {
  return p.replace(/\\/g, "/");
}
function normalizePath(id) {
  return path2.posix.normalize(isWindows ? slash(id) : id);
}

// src/node/server/middleware/transform.ts
import { readFile as readFile2 } from "fs/promises";

// src/node/server/transformRequest.ts
function transformRequest(url, server) {
  const request = doTransform(url, server);
  return request;
}
async function doTransform(url, server) {
  const { pluginContainer } = server;
  const id = (await pluginContainer.resolveId(url))?.id ?? url;
  const result = loadAndTransform(id, url, server);
  return result;
}
async function loadAndTransform(id, url, server) {
  let code = null;
  const { pluginContainer } = server;
  const loadResult = await pluginContainer.load(id);
  if (loadResult && typeof loadResult === "object") {
    code = loadResult?.code;
  } else {
    code = loadResult ?? "";
  }
  const transformResult = await pluginContainer.transform(code, id);
  code = transformResult.code;
  return {
    code
  };
}

// src/node/server/middleware/transform.ts
function transformMiddleware(server) {
  return async (req, res, next) => {
    let url = cleanUrl(req.url);
    if (isCSSRequest(url)) {
      const cssPath = normalizePath(path3.join(server.config.root, url));
      const cssContent = await readFile2(cssPath, "utf-8");
      const code = [
        `const id = "${url}"`,
        `const __vite__css = ${JSON.stringify(cssContent)}`,
        `updateStyle(id, __vite__css)`,
        `export default __vite__css`
      ].join("\n");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/javascript");
      return res.end(code);
    }
    if (isJSRequest(url) || isImportRequest(url) || isCSSRequest(url)) {
      try {
        const result = await transformRequest(url, server);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript");
        return res.end(result.code);
      } catch (e) {
        console.log(e);
      }
    }
    next();
  };
}

// src/node/plugin/rosolve.ts
import path4 from "path";
var bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/;
function resolvePlugin(resolveOptions) {
  return {
    name: "vite:resolve",
    async resolveId(id, importer) {
      const { root } = resolveOptions;
      if (id[0] === "/" && !id.startsWith(root)) {
        const fsPath = path4.resolve(root, id.slice(1));
        return { id: fsPath };
      }
      if (id.startsWith(".")) {
        const basedir = importer ? path4.dirname(importer) : process.cwd();
        const fsPath = path4.join(basedir, id);
        return { id: fsPath };
      }
      if (path4.isAbsolute(id)) {
        return { id };
      }
      if (bareImportRE.test(id)) {
        let prefix = path4.resolve(root, "node_modules", id);
        const module = __require(prefix + "/package.json").module;
        const fsPath = path4.join(prefix, module);
        return { id: fsPath };
      }
      return null;
    }
  };
}

// ../../../../node_modules/.pnpm/es-module-lexer@1.2.1/node_modules/es-module-lexer/dist/lexer.js
var A = 1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
function parse3(E2, g = "@") {
  if (!C)
    return init.then(() => parse3(E2));
  const I = E2.length + 1, o = (C.__heap_base.value || C.__heap_base) + 4 * I - C.memory.buffer.byteLength;
  o > 0 && C.memory.grow(Math.ceil(o / 65536));
  const D = C.sa(I - 1);
  if ((A ? B : Q)(E2, new Uint16Array(C.memory.buffer, D, I)), !C.parse())
    throw Object.assign(new Error(`Parse error ${g}:${E2.slice(0, C.e()).split("\n").length}:${C.e() - E2.lastIndexOf("\n", C.e() - 1)}`), { idx: C.e() });
  const K = [], k = [];
  for (; C.ri(); ) {
    const A2 = C.is(), Q2 = C.ie(), B2 = C.ai(), g2 = C.id(), I2 = C.ss(), o2 = C.se();
    let D2;
    C.ip() && (D2 = J(E2.slice(-1 === g2 ? A2 - 1 : A2, -1 === g2 ? Q2 + 1 : Q2))), K.push({ n: D2, s: A2, e: Q2, ss: I2, se: o2, d: g2, a: B2 });
  }
  for (; C.re(); ) {
    const A2 = C.es(), Q2 = C.ee(), B2 = C.els(), g2 = C.ele(), I2 = E2.slice(A2, Q2), o2 = I2[0], D2 = B2 < 0 ? void 0 : E2.slice(B2, g2), K2 = D2 ? D2[0] : "";
    k.push({ s: A2, e: Q2, ls: B2, le: g2, n: '"' === o2 || "'" === o2 ? J(I2) : I2, ln: '"' === K2 || "'" === K2 ? J(D2) : D2 });
  }
  function J(A2) {
    try {
      return (0, eval)(A2);
    } catch (A3) {
    }
  }
  return [K, k, !!C.f()];
}
function Q(A2, Q2) {
  const B2 = A2.length;
  let C2 = 0;
  for (; C2 < B2; ) {
    const B3 = A2.charCodeAt(C2);
    Q2[C2++] = (255 & B3) << 8 | B3 >>> 8;
  }
}
function B(A2, Q2) {
  const B2 = A2.length;
  let C2 = 0;
  for (; C2 < B2; )
    Q2[C2] = A2.charCodeAt(C2++);
}
var C;
var init = WebAssembly.compile((E = "AGFzbQEAAAABKghgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gAn9/AAMvLgABAQICAgICAgICAgICAgICAgIAAwMDBAQAAAADAAAAAAMDAAUGAAAABwAGAgUEBQFwAQEBBQMBAAEGDwJ/AUGw8gALfwBBsPIACwdwEwZtZW1vcnkCAAJzYQAAAWUAAwJpcwAEAmllAAUCc3MABgJzZQAHAmFpAAgCaWQACQJpcAAKAmVzAAsCZWUADANlbHMADQNlbGUADgJyaQAPAnJlABABZgARBXBhcnNlABILX19oZWFwX2Jhc2UDAQqHPC5oAQF/QQAgADYC9AlBACgC0AkiASAAQQF0aiIAQQA7AQBBACAAQQJqIgA2AvgJQQAgADYC/AlBAEEANgLUCUEAQQA2AuQJQQBBADYC3AlBAEEANgLYCUEAQQA2AuwJQQBBADYC4AkgAQufAQEDf0EAKALkCSEEQQBBACgC/AkiBTYC5AlBACAENgLoCUEAIAVBIGo2AvwJIARBHGpB1AkgBBsgBTYCAEEAKALICSEEQQAoAsQJIQYgBSABNgIAIAUgADYCCCAFIAIgAkECakEAIAYgA0YbIAQgA0YbNgIMIAUgAzYCFCAFQQA2AhAgBSACNgIEIAVBADYCHCAFQQAoAsQJIANGOgAYC1YBAX9BACgC7AkiBEEQakHYCSAEG0EAKAL8CSIENgIAQQAgBDYC7AlBACAEQRRqNgL8CSAEQQA2AhAgBCADNgIMIAQgAjYCCCAEIAE2AgQgBCAANgIACwgAQQAoAoAKCxUAQQAoAtwJKAIAQQAoAtAJa0EBdQseAQF/QQAoAtwJKAIEIgBBACgC0AlrQQF1QX8gABsLFQBBACgC3AkoAghBACgC0AlrQQF1Cx4BAX9BACgC3AkoAgwiAEEAKALQCWtBAXVBfyAAGwseAQF/QQAoAtwJKAIQIgBBACgC0AlrQQF1QX8gABsLOwEBfwJAQQAoAtwJKAIUIgBBACgCxAlHDQBBfw8LAkAgAEEAKALICUcNAEF+DwsgAEEAKALQCWtBAXULCwBBACgC3AktABgLFQBBACgC4AkoAgBBACgC0AlrQQF1CxUAQQAoAuAJKAIEQQAoAtAJa0EBdQseAQF/QQAoAuAJKAIIIgBBACgC0AlrQQF1QX8gABsLHgEBf0EAKALgCSgCDCIAQQAoAtAJa0EBdUF/IAAbCyUBAX9BAEEAKALcCSIAQRxqQdQJIAAbKAIAIgA2AtwJIABBAEcLJQEBf0EAQQAoAuAJIgBBEGpB2AkgABsoAgAiADYC4AkgAEEARwsIAEEALQCECgvmDAEGfyMAQYDQAGsiACQAQQBBAToAhApBAEEAKALMCTYCjApBAEEAKALQCUF+aiIBNgKgCkEAIAFBACgC9AlBAXRqIgI2AqQKQQBBADsBhgpBAEEAOwGICkEAQQA6AJAKQQBBADYCgApBAEEAOgDwCUEAIABBgBBqNgKUCkEAIAA2ApgKQQBBADoAnAoCQAJAAkACQANAQQAgAUECaiIDNgKgCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BiAoNASADEBNFDQEgAUEEakGCCEEKEC0NARAUQQAtAIQKDQFBAEEAKAKgCiIBNgKMCgwHCyADEBNFDQAgAUEEakGMCEEKEC0NABAVC0EAQQAoAqAKNgKMCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAWDAELQQEQFwtBACgCpAohAkEAKAKgCiEBDAALC0EAIQIgAyEBQQAtAPAJDQIMAQtBACABNgKgCkEAQQA6AIQKCwNAQQAgAUECaiIDNgKgCgJAAkACQAJAAkACQAJAAkACQCABQQAoAqQKTw0AIAMvAQAiAkF3akEFSQ0IAkACQAJAAkACQAJAAkACQAJAAkAgAkFgag4KEhEGEREREQUBAgALAkACQAJAAkAgAkGgf2oOCgsUFAMUARQUFAIACyACQYV/ag4DBRMGCQtBAC8BiAoNEiADEBNFDRIgAUEEakGCCEEKEC0NEhAUDBILIAMQE0UNESABQQRqQYwIQQoQLQ0REBUMEQsgAxATRQ0QIAEpAARC7ICEg7COwDlSDRAgAS8BDCIDQXdqIgFBF0sNDkEBIAF0QZ+AgARxRQ0ODA8LQQBBAC8BiAoiAUEBajsBiApBACgClAogAUEDdGoiAUEBNgIAIAFBACgCjAo2AgQMDwtBAC8BiAoiAkUNC0EAIAJBf2oiBDsBiApBAC8BhgoiAkUNDiACQQJ0QQAoApgKakF8aigCACIFKAIUQQAoApQKIARB//8DcUEDdGooAgRHDQ4CQCAFKAIEDQAgBSADNgIEC0EAIAJBf2o7AYYKIAUgAUEEajYCDAwOCwJAQQAoAowKIgEvAQBBKUcNAEEAKALkCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAugJIgM2AuQJAkAgA0UNACADQQA2AhwMAQtBAEEANgLUCQtBAEEALwGICiIDQQFqOwGICkEAKAKUCiADQQN0aiIDQQZBAkEALQCcChs2AgAgAyABNgIEQQBBADoAnAoMDQtBAC8BiAoiAUUNCUEAIAFBf2oiATsBiApBACgClAogAUH//wNxQQN0aigCAEEERg0EDAwLQScQGAwLC0EiEBgMCgsgAkEvRw0JAkACQCABLwEEIgFBKkYNACABQS9HDQEQFgwMC0EBEBcMCwsCQAJAQQAoAowKIgEvAQAiAxAZRQ0AAkACQCADQVVqDgQACAEDCAsgAUF+ai8BAEErRg0GDAcLIAFBfmovAQBBLUYNBQwGCwJAIANB/QBGDQAgA0EpRw0FQQAoApQKQQAvAYgKQQN0aigCBBAaRQ0FDAYLQQAoApQKQQAvAYgKQQN0aiICKAIEEBsNBSACKAIAQQZGDQUMBAsgAUF+ai8BAEFQakH//wNxQQpJDQMMBAtBACgClApBAC8BiAoiAUEDdCIDakEAKAKMCjYCBEEAIAFBAWo7AYgKQQAoApQKIANqQQM2AgALEBwMBwtBAC0A8AlBAC8BhgpBAC8BiApyckUhAgwJCyABEB0NACADRQ0AIANBL0ZBAC0AkApBAEdxDQAgAUF+aiEBQQAoAtAJIQICQANAIAFBAmoiBCACTQ0BQQAgATYCjAogAS8BACEDIAFBfmoiBCEBIAMQHkUNAAsgBEECaiEEC0EBIQUgA0H//wNxEB9FDQEgBEF+aiEBAkADQCABQQJqIgMgAk0NAUEAIAE2AowKIAEvAQAhAyABQX5qIgQhASADEB8NAAsgBEECaiEDCyADECBFDQEQIUEAQQA6AJAKDAULECFBACEFC0EAIAU6AJAKDAMLECJBACECDAULIANBoAFHDQELQQBBAToAnAoLQQBBACgCoAo2AowKC0EAKAKgCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC0AkgAEcNAEEBDwsgAEF+ahAjC80JAQV/QQBBACgCoAoiAEEMaiIBNgKgCkEAKALsCSECQQEQJyEDAkACQAJAAkACQAJAAkACQAJAAkBBACgCoAoiBCABRw0AIAMQJkUNAQsCQAJAAkACQCADQSpGDQAgA0H7AEcNAUEAIARBAmo2AqAKQQEQJyEEQQAoAqAKIQEDQAJAAkAgBEH//wNxIgNBIkYNACADQSdGDQAgAxAqGkEAKAKgCiEDDAELIAMQGEEAQQAoAqAKQQJqIgM2AqAKC0EBECcaAkAgASADECsiBEEsRw0AQQBBACgCoApBAmo2AqAKQQEQJyEEC0EAKAKgCiEDIARB/QBGDQMgAyABRg0NIAMhASADQQAoAqQKTQ0ADA0LC0EAIARBAmo2AqAKQQEQJxpBACgCoAoiAyADECsaDAILQQBBADoAhAoCQAJAAkACQAJAAkAgA0Gff2oODAIIBAEIAwgICAgIBQALIANB9gBGDQQMBwtBACAEQQ5qIgM2AqAKAkACQAJAQQEQJ0Gff2oOBgAQAhAQARALQQAoAqAKIgEpAAJC84Dkg+CNwDFSDQ8gAS8BChAfRQ0PQQAgAUEKajYCoApBABAnGgtBACgCoAoiAUECakGiCEEOEC0NDiABLwEQIgBBd2oiAkEXSw0LQQEgAnRBn4CABHFFDQsMDAtBACgCoAoiASkAAkLsgISDsI7AOVINDSABLwEKIgBBd2oiAkEXTQ0HDAgLQQAgBEEKajYCoApBABAnGkEAKAKgCiEEC0EAIARBEGo2AqAKAkBBARAnIgRBKkcNAEEAQQAoAqAKQQJqNgKgCkEBECchBAtBACgCoAohAyAEECoaIANBACgCoAoiBCADIAQQAkEAQQAoAqAKQX5qNgKgCg8LAkAgBCkAAkLsgISDsI7AOVINACAELwEKEB5FDQBBACAEQQpqNgKgCkEBECchBEEAKAKgCiEDIAQQKhogA0EAKAKgCiIEIAMgBBACQQBBACgCoApBfmo2AqAKDwtBACAEQQRqIgQ2AqAKC0EAIARBBGoiAzYCoApBAEEAOgCECgJAA0BBACADQQJqNgKgCkEBECchBEEAKAKgCiEDIAQQKkEgckH7AEYNAUEAKAKgCiIEIANGDQQgAyAEIAMgBBACQQEQJ0EsRw0BQQAoAqAKIQMMAAsLQQBBACgCoApBfmo2AqAKDwtBACADQQJqNgKgCgtBARAnIQRBACgCoAohAwJAIARB5gBHDQAgA0ECakGcCEEGEC0NAEEAIANBCGo2AqAKIABBARAnECkgAkEQakHYCSACGyEDA0AgAygCACIDRQ0CIANCADcCCCADQRBqIQMMAAsLQQAgA0F+ajYCoAoLDwtBASACdEGfgIAEcQ0BCyAAQaABRg0AIABB+wBHDQQLQQAgAUEKajYCoApBARAnIgFB+wBGDQMMAgsCQCAAQVhqDgMBAwEACyAAQaABRw0CC0EAIAFBEGo2AqAKAkBBARAnIgFBKkcNAEEAQQAoAqAKQQJqNgKgCkEBECchAQsgAUEoRg0BC0EAKAKgCiECIAEQKhpBACgCoAoiASACTQ0AIAQgAyACIAEQAkEAQQAoAqAKQX5qNgKgCg8LIAQgA0EAQQAQAkEAIARBDGo2AqAKDwsQIgvUBgEEf0EAQQAoAqAKIgBBDGoiATYCoAoCQAJAAkACQAJAAkACQAJAAkACQEEBECciAkFZag4IBAIBBAEBAQMACyACQSJGDQMgAkH7AEYNBAtBACgCoAogAUcNAkEAIABBCmo2AqAKDwtBACgClApBAC8BiAoiAkEDdGoiAUEAKAKgCjYCBEEAIAJBAWo7AYgKIAFBBTYCAEEAKAKMCi8BAEEuRg0DQQBBACgCoAoiAUECajYCoApBARAnIQIgAEEAKAKgCkEAIAEQAUEAQQAvAYYKIgFBAWo7AYYKQQAoApgKIAFBAnRqQQAoAuQJNgIAAkAgAkEiRg0AIAJBJ0YNAEEAQQAoAqAKQX5qNgKgCg8LIAIQGEEAQQAoAqAKQQJqIgI2AqAKAkACQAJAQQEQJ0FXag4EAQICAAILQQBBACgCoApBAmo2AqAKQQEQJxpBACgC5AkiASACNgIEIAFBAToAGCABQQAoAqAKIgI2AhBBACACQX5qNgKgCg8LQQAoAuQJIgEgAjYCBCABQQE6ABhBAEEALwGICkF/ajsBiAogAUEAKAKgCkECajYCDEEAQQAvAYYKQX9qOwGGCg8LQQBBACgCoApBfmo2AqAKDwtBAEEAKAKgCkECajYCoApBARAnQe0ARw0CQQAoAqAKIgJBAmpBlghBBhAtDQICQEEAKAKMCiIBECgNACABLwEAQS5GDQMLIAAgACACQQhqQQAoAsgJEAEPC0EALwGICg0CQQAoAqAKIQJBACgCpAohAwNAIAIgA08NBQJAAkAgAi8BACIBQSdGDQAgAUEiRw0BCyAAIAEQKQ8LQQAgAkECaiICNgKgCgwACwtBACgCoAohAkEALwGICg0CAkADQAJAAkACQCACQQAoAqQKTw0AQQEQJyICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKgCkECajYCoAoLQQEQJyEBQQAoAqAKIQICQCABQeYARw0AIAJBAmpBnAhBBhAtDQgLQQAgAkEIajYCoApBARAnIgJBIkYNAyACQSdGDQMMBwsgAhAYC0EAQQAoAqAKQQJqIgI2AqAKDAALCyAAIAIQKQsPC0EAQQAoAqAKQX5qNgKgCg8LQQAgAkF+ajYCoAoPCxAiC0cBA39BACgCoApBAmohAEEAKAKkCiEBAkADQCAAIgJBfmogAU8NASACQQJqIQAgAi8BAEF2ag4EAQAAAQALC0EAIAI2AqAKC5gBAQN/QQBBACgCoAoiAUECajYCoAogAUEGaiEBQQAoAqQKIQIDQAJAAkACQCABQXxqIAJPDQAgAUF+ai8BACEDAkACQCAADQAgA0EqRg0BIANBdmoOBAIEBAIECyADQSpHDQMLIAEvAQBBL0cNAkEAIAFBfmo2AqAKDAELIAFBfmohAQtBACABNgKgCg8LIAFBAmohAQwACwuIAQEEf0EAKAKgCiEBQQAoAqQKIQICQAJAA0AgASIDQQJqIQEgAyACTw0BIAEvAQAiBCAARg0CAkAgBEHcAEYNACAEQXZqDgQCAQECAQsgA0EEaiEBIAMvAQRBDUcNACADQQZqIAEgAy8BBkEKRhshAQwACwtBACABNgKgChAiDwtBACABNgKgCgtsAQF/AkACQCAAQV9qIgFBBUsNAEEBIAF0QTFxDQELIABBRmpB//8DcUEGSQ0AIABBKUcgAEFYakH//wNxQQdJcQ0AAkAgAEGlf2oOBAEAAAEACyAAQf0ARyAAQYV/akH//wNxQQRJcQ8LQQELLgEBf0EBIQECQCAAQZYJQQUQJA0AIABBoAlBAxAkDQAgAEGmCUECECQhAQsgAQuDAQECf0EBIQECQAJAAkACQAJAAkAgAC8BACICQUVqDgQFBAQBAAsCQCACQZt/ag4EAwQEAgALIAJBKUYNBCACQfkARw0DIABBfmpBsglBBhAkDwsgAEF+ai8BAEE9Rg8LIABBfmpBqglBBBAkDwsgAEF+akG+CUEDECQPC0EAIQELIAEL3gEBBH9BACgCoAohAEEAKAKkCiEBAkACQAJAA0AgACICQQJqIQAgAiABTw0BAkACQAJAIAAvAQAiA0Gkf2oOBQIDAwMBAAsgA0EkRw0CIAIvAQRB+wBHDQJBACACQQRqIgA2AqAKQQBBAC8BiAoiAkEBajsBiApBACgClAogAkEDdGoiAkEENgIAIAIgADYCBA8LQQAgADYCoApBAEEALwGICkF/aiIAOwGICkEAKAKUCiAAQf//A3FBA3RqKAIAQQNHDQMMBAsgAkEEaiEADAALC0EAIAA2AqAKCxAiCwu0AwECf0EAIQECQAJAAkACQAJAAkACQAJAAkACQCAALwEAQZx/ag4UAAECCQkJCQMJCQQFCQkGCQcJCQgJCwJAAkAgAEF+ai8BAEGXf2oOBAAKCgEKCyAAQXxqQboIQQIQJA8LIABBfGpBvghBAxAkDwsCQAJAAkAgAEF+ai8BAEGNf2oOAwABAgoLAkAgAEF8ai8BACICQeEARg0AIAJB7ABHDQogAEF6akHlABAlDwsgAEF6akHjABAlDwsgAEF8akHECEEEECQPCyAAQXxqQcwIQQYQJA8LIABBfmovAQBB7wBHDQYgAEF8ai8BAEHlAEcNBgJAIABBemovAQAiAkHwAEYNACACQeMARw0HIABBeGpB2AhBBhAkDwsgAEF4akHkCEECECQPCyAAQX5qQegIQQQQJA8LQQEhASAAQX5qIgBB6QAQJQ0EIABB8AhBBRAkDwsgAEF+akHkABAlDwsgAEF+akH6CEEHECQPCyAAQX5qQYgJQQQQJA8LAkAgAEF+ai8BACICQe8ARg0AIAJB5QBHDQEgAEF8akHuABAlDwsgAEF8akGQCUEDECQhAQsgAQs0AQF/QQEhAQJAIABBd2pB//8DcUEFSQ0AIABBgAFyQaABRg0AIABBLkcgABAmcSEBCyABCzABAX8CQAJAIABBd2oiAUEXSw0AQQEgAXRBjYCABHENAQsgAEGgAUYNAEEADwtBAQtOAQJ/QQAhAQJAAkAgAC8BACICQeUARg0AIAJB6wBHDQEgAEF+akHoCEEEECQPCyAAQX5qLwEAQfUARw0AIABBfGpBzAhBBhAkIQELIAELcAECfwJAAkADQEEAQQAoAqAKIgBBAmoiATYCoAogAEEAKAKkCk8NAQJAAkACQCABLwEAIgFBpX9qDgIBAgALAkAgAUF2ag4EBAMDBAALIAFBL0cNAgwECxAsGgwBC0EAIABBBGo2AqAKDAALCxAiCws1AQF/QQBBAToA8AlBACgCoAohAEEAQQAoAqQKQQJqNgKgCkEAIABBACgC0AlrQQF1NgKACgtDAQJ/QQEhAQJAIAAvAQAiAkF3akH//wNxQQVJDQAgAkGAAXJBoAFGDQBBACEBIAIQJkUNACACQS5HIAAQKHIPCyABC0YBA39BACEDAkAgACACQQF0IgJrIgRBAmoiAEEAKALQCSIFSQ0AIAAgASACEC0NAAJAIAAgBUcNAEEBDwsgBBAjIQMLIAMLPQECf0EAIQICQEEAKALQCSIDIABLDQAgAC8BACABRw0AAkAgAyAARw0AQQEPCyAAQX5qLwEAEB4hAgsgAgtoAQJ/QQEhAQJAAkAgAEFfaiICQQVLDQBBASACdEExcQ0BCyAAQfj/A3FBKEYNACAAQUZqQf//A3FBBkkNAAJAIABBpX9qIgJBA0sNACACQQFHDQELIABBhX9qQf//A3FBBEkhAQsgAQucAQEDf0EAKAKgCiEBAkADQAJAAkAgAS8BACICQS9HDQACQCABLwECIgFBKkYNACABQS9HDQQQFgwCCyAAEBcMAQsCQAJAIABFDQAgAkF3aiIBQRdLDQFBASABdEGfgIAEcUUNAQwCCyACEB9FDQMMAQsgAkGgAUcNAgtBAEEAKAKgCiIDQQJqIgE2AqAKIANBACgCpApJDQALCyACCzEBAX9BACEBAkAgAC8BAEEuRw0AIABBfmovAQBBLkcNACAAQXxqLwEAQS5GIQELIAELiQQBAX8CQCABQSJGDQAgAUEnRg0AECIPC0EAKAKgCiECIAEQGCAAIAJBAmpBACgCoApBACgCxAkQAUEAQQAoAqAKQQJqNgKgCgJAAkACQAJAQQAQJyIBQeEARg0AIAFB9wBGDQFBACgCoAohAQwCC0EAKAKgCiIBQQJqQbAIQQoQLQ0BQQYhAAwCC0EAKAKgCiIBLwECQekARw0AIAEvAQRB9ABHDQBBBCEAIAEvAQZB6ABGDQELQQAgAUF+ajYCoAoPC0EAIAEgAEEBdGo2AqAKAkBBARAnQfsARg0AQQAgATYCoAoPC0EAKAKgCiICIQADQEEAIABBAmo2AqAKAkACQAJAQQEQJyIAQSJGDQAgAEEnRw0BQScQGEEAQQAoAqAKQQJqNgKgCkEBECchAAwCC0EiEBhBAEEAKAKgCkECajYCoApBARAnIQAMAQsgABAqIQALAkAgAEE6Rg0AQQAgATYCoAoPC0EAQQAoAqAKQQJqNgKgCgJAQQEQJyIAQSJGDQAgAEEnRg0AQQAgATYCoAoPCyAAEBhBAEEAKAKgCkECajYCoAoCQAJAQQEQJyIAQSxGDQAgAEH9AEYNAUEAIAE2AqAKDwtBAEEAKAKgCkECajYCoApBARAnQf0ARg0AQQAoAqAKIQAMAQsLQQAoAuQJIgEgAjYCECABQQAoAqAKQQJqNgIMC20BAn8CQAJAA0ACQCAAQf//A3EiAUF3aiICQRdLDQBBASACdEGfgIAEcQ0CCyABQaABRg0BIAAhAiABECYNAkEAIQJBAEEAKAKgCiIAQQJqNgKgCiAALwECIgANAAwCCwsgACECCyACQf//A3ELqwEBBH8CQAJAQQAoAqAKIgIvAQAiA0HhAEYNACABIQQgACEFDAELQQAgAkEEajYCoApBARAnIQJBACgCoAohBQJAAkAgAkEiRg0AIAJBJ0YNACACECoaQQAoAqAKIQQMAQsgAhAYQQBBACgCoApBAmoiBDYCoAoLQQEQJyEDQQAoAqAKIQILAkAgAiAFRg0AIAUgBEEAIAAgACABRiICG0EAIAEgAhsQAgsgAwtyAQR/QQAoAqAKIQBBACgCpAohAQJAAkADQCAAQQJqIQIgACABTw0BAkACQCACLwEAIgNBpH9qDgIBBAALIAIhACADQXZqDgQCAQECAQsgAEEEaiEADAALC0EAIAI2AqAKECJBAA8LQQAgAjYCoApB3QALSQEDf0EAIQMCQCACRQ0AAkADQCAALQAAIgQgAS0AACIFRw0BIAFBAWohASAAQQFqIQAgAkF/aiICDQAMAgsLIAQgBWshAwsgAwsL4gECAEGACAvEAQAAeABwAG8AcgB0AG0AcABvAHIAdABlAHQAYQByAG8AbQB1AG4AYwB0AGkAbwBuAHMAcwBlAHIAdAB2AG8AeQBpAGUAZABlAGwAZQBjAG8AbgB0AGkAbgBpAG4AcwB0AGEAbgB0AHkAYgByAGUAYQByAGUAdAB1AHIAZABlAGIAdQBnAGcAZQBhAHcAYQBpAHQAaAByAHcAaABpAGwAZQBmAG8AcgBpAGYAYwBhAHQAYwBmAGkAbgBhAGwAbABlAGwAcwAAQcQJCxABAAAAAgAAAAAEAAAwOQAA", "undefined" != typeof Buffer ? Buffer.from(E, "base64") : Uint8Array.from(atob(E), (A2) => A2.charCodeAt(0)))).then(WebAssembly.instantiate).then(({ exports: A2 }) => {
  C = A2;
});
var E;

// ../node_modules/.pnpm/@jridgewell+sourcemap-codec@1.4.15/node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? {
  decode(buf) {
    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
    return out.toString();
  }
} : {
  decode(buf) {
    let out = "";
    for (let i = 0; i < buf.length; i++) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }
};
function encode(decoded) {
  const state = new Int32Array(5);
  const bufLength = 1024 * 16;
  const subLength = bufLength - 36;
  const buf = new Uint8Array(bufLength);
  const sub = buf.subarray(0, subLength);
  let pos = 0;
  let out = "";
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0) {
      if (pos === bufLength) {
        out += td.decode(buf);
        pos = 0;
      }
      buf[pos++] = semicolon;
    }
    if (line.length === 0)
      continue;
    state[0] = 0;
    for (let j = 0; j < line.length; j++) {
      const segment = line[j];
      if (pos > subLength) {
        out += td.decode(sub);
        buf.copyWithin(0, subLength, pos);
        pos -= subLength;
      }
      if (j > 0)
        buf[pos++] = comma;
      pos = encodeInteger(buf, pos, state, segment, 0);
      if (segment.length === 1)
        continue;
      pos = encodeInteger(buf, pos, state, segment, 1);
      pos = encodeInteger(buf, pos, state, segment, 2);
      pos = encodeInteger(buf, pos, state, segment, 3);
      if (segment.length === 4)
        continue;
      pos = encodeInteger(buf, pos, state, segment, 4);
    }
  }
  return out + td.decode(buf.subarray(0, pos));
}
function encodeInteger(buf, pos, state, segment, j) {
  const next = segment[j];
  let num = next - state[j];
  state[j] = next;
  num = num < 0 ? -num << 1 | 1 : num << 1;
  do {
    let clamped = num & 31;
    num >>>= 5;
    if (num > 0)
      clamped |= 32;
    buf[pos++] = intToChar[clamped];
  } while (num > 0);
  return pos;
}

// ../node_modules/.pnpm/magic-string@0.30.0/node_modules/magic-string/dist/magic-string.es.mjs
var BitSet = class _BitSet {
  constructor(arg) {
    this.bits = arg instanceof _BitSet ? arg.bits.slice() : [];
  }
  add(n2) {
    this.bits[n2 >> 5] |= 1 << (n2 & 31);
  }
  has(n2) {
    return !!(this.bits[n2 >> 5] & 1 << (n2 & 31));
  }
};
var Chunk = class _Chunk {
  constructor(start, end, content) {
    this.start = start;
    this.end = end;
    this.original = content;
    this.intro = "";
    this.outro = "";
    this.content = content;
    this.storeName = false;
    this.edited = false;
    {
      this.previous = null;
      this.next = null;
    }
  }
  appendLeft(content) {
    this.outro += content;
  }
  appendRight(content) {
    this.intro = this.intro + content;
  }
  clone() {
    const chunk = new _Chunk(this.start, this.end, this.original);
    chunk.intro = this.intro;
    chunk.outro = this.outro;
    chunk.content = this.content;
    chunk.storeName = this.storeName;
    chunk.edited = this.edited;
    return chunk;
  }
  contains(index) {
    return this.start < index && index < this.end;
  }
  eachNext(fn) {
    let chunk = this;
    while (chunk) {
      fn(chunk);
      chunk = chunk.next;
    }
  }
  eachPrevious(fn) {
    let chunk = this;
    while (chunk) {
      fn(chunk);
      chunk = chunk.previous;
    }
  }
  edit(content, storeName, contentOnly) {
    this.content = content;
    if (!contentOnly) {
      this.intro = "";
      this.outro = "";
    }
    this.storeName = storeName;
    this.edited = true;
    return this;
  }
  prependLeft(content) {
    this.outro = content + this.outro;
  }
  prependRight(content) {
    this.intro = content + this.intro;
  }
  split(index) {
    const sliceIndex = index - this.start;
    const originalBefore = this.original.slice(0, sliceIndex);
    const originalAfter = this.original.slice(sliceIndex);
    this.original = originalBefore;
    const newChunk = new _Chunk(index, this.end, originalAfter);
    newChunk.outro = this.outro;
    this.outro = "";
    this.end = index;
    if (this.edited) {
      newChunk.edit("", false);
      this.content = "";
    } else {
      this.content = originalBefore;
    }
    newChunk.next = this.next;
    if (newChunk.next)
      newChunk.next.previous = newChunk;
    newChunk.previous = this;
    this.next = newChunk;
    return newChunk;
  }
  toString() {
    return this.intro + this.content + this.outro;
  }
  trimEnd(rx) {
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length)
      return true;
    const trimmed = this.content.replace(rx, "");
    if (trimmed.length) {
      if (trimmed !== this.content) {
        this.split(this.start + trimmed.length).edit("", void 0, true);
      }
      return true;
    } else {
      this.edit("", void 0, true);
      this.intro = this.intro.replace(rx, "");
      if (this.intro.length)
        return true;
    }
  }
  trimStart(rx) {
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length)
      return true;
    const trimmed = this.content.replace(rx, "");
    if (trimmed.length) {
      if (trimmed !== this.content) {
        this.split(this.end - trimmed.length);
        this.edit("", void 0, true);
      }
      return true;
    } else {
      this.edit("", void 0, true);
      this.outro = this.outro.replace(rx, "");
      if (this.outro.length)
        return true;
    }
  }
};
function getBtoa() {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return (str) => window.btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer === "function") {
    return (str) => Buffer.from(str, "utf-8").toString("base64");
  } else {
    return () => {
      throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
    };
  }
}
var btoa = /* @__PURE__ */ getBtoa();
var SourceMap = class {
  constructor(properties) {
    this.version = 3;
    this.file = properties.file;
    this.sources = properties.sources;
    this.sourcesContent = properties.sourcesContent;
    this.names = properties.names;
    this.mappings = encode(properties.mappings);
    if (typeof properties.x_google_ignoreList !== "undefined") {
      this.x_google_ignoreList = properties.x_google_ignoreList;
    }
  }
  toString() {
    return JSON.stringify(this);
  }
  toUrl() {
    return "data:application/json;charset=utf-8;base64," + btoa(this.toString());
  }
};
function guessIndent(code) {
  const lines = code.split("\n");
  const tabbed = lines.filter((line) => /^\t+/.test(line));
  const spaced = lines.filter((line) => /^ {2,}/.test(line));
  if (tabbed.length === 0 && spaced.length === 0) {
    return null;
  }
  if (tabbed.length >= spaced.length) {
    return "	";
  }
  const min = spaced.reduce((previous, current) => {
    const numSpaces = /^ +/.exec(current)[0].length;
    return Math.min(numSpaces, previous);
  }, Infinity);
  return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
  const fromParts = from.split(/[/\\]/);
  const toParts = to.split(/[/\\]/);
  fromParts.pop();
  while (fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  if (fromParts.length) {
    let i = fromParts.length;
    while (i--)
      fromParts[i] = "..";
  }
  return fromParts.concat(toParts).join("/");
}
var toString = Object.prototype.toString;
function isObject(thing) {
  return toString.call(thing) === "[object Object]";
}
function getLocator(source) {
  const originalLines = source.split("\n");
  const lineOffsets = [];
  for (let i = 0, pos = 0; i < originalLines.length; i++) {
    lineOffsets.push(pos);
    pos += originalLines[i].length + 1;
  }
  return function locate(index) {
    let i = 0;
    let j = lineOffsets.length;
    while (i < j) {
      const m = i + j >> 1;
      if (index < lineOffsets[m]) {
        j = m;
      } else {
        i = m + 1;
      }
    }
    const line = i - 1;
    const column = index - lineOffsets[line];
    return { line, column };
  };
}
var Mappings = class {
  constructor(hires) {
    this.hires = hires;
    this.generatedCodeLine = 0;
    this.generatedCodeColumn = 0;
    this.raw = [];
    this.rawSegments = this.raw[this.generatedCodeLine] = [];
    this.pending = null;
  }
  addEdit(sourceIndex, content, loc, nameIndex) {
    if (content.length) {
      const segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
      if (nameIndex >= 0) {
        segment.push(nameIndex);
      }
      this.rawSegments.push(segment);
    } else if (this.pending) {
      this.rawSegments.push(this.pending);
    }
    this.advance(content);
    this.pending = null;
  }
  addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
    let originalCharIndex = chunk.start;
    let first = true;
    while (originalCharIndex < chunk.end) {
      if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
        this.rawSegments.push([this.generatedCodeColumn, sourceIndex, loc.line, loc.column]);
      }
      if (original[originalCharIndex] === "\n") {
        loc.line += 1;
        loc.column = 0;
        this.generatedCodeLine += 1;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
        this.generatedCodeColumn = 0;
        first = true;
      } else {
        loc.column += 1;
        this.generatedCodeColumn += 1;
        first = false;
      }
      originalCharIndex += 1;
    }
    this.pending = null;
  }
  advance(str) {
    if (!str)
      return;
    const lines = str.split("\n");
    if (lines.length > 1) {
      for (let i = 0; i < lines.length - 1; i++) {
        this.generatedCodeLine++;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
      }
      this.generatedCodeColumn = 0;
    }
    this.generatedCodeColumn += lines[lines.length - 1].length;
  }
};
var n = "\n";
var warned = {
  insertLeft: false,
  insertRight: false,
  storeName: false
};
var MagicString = class _MagicString {
  constructor(string, options = {}) {
    const chunk = new Chunk(0, string.length, string);
    Object.defineProperties(this, {
      original: { writable: true, value: string },
      outro: { writable: true, value: "" },
      intro: { writable: true, value: "" },
      firstChunk: { writable: true, value: chunk },
      lastChunk: { writable: true, value: chunk },
      lastSearchedChunk: { writable: true, value: chunk },
      byStart: { writable: true, value: {} },
      byEnd: { writable: true, value: {} },
      filename: { writable: true, value: options.filename },
      indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
      sourcemapLocations: { writable: true, value: new BitSet() },
      storedNames: { writable: true, value: {} },
      indentStr: { writable: true, value: void 0 },
      ignoreList: { writable: true, value: options.ignoreList }
    });
    this.byStart[0] = chunk;
    this.byEnd[string.length] = chunk;
  }
  addSourcemapLocation(char) {
    this.sourcemapLocations.add(char);
  }
  append(content) {
    if (typeof content !== "string")
      throw new TypeError("outro content must be a string");
    this.outro += content;
    return this;
  }
  appendLeft(index, content) {
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byEnd[index];
    if (chunk) {
      chunk.appendLeft(content);
    } else {
      this.intro += content;
    }
    return this;
  }
  appendRight(index, content) {
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byStart[index];
    if (chunk) {
      chunk.appendRight(content);
    } else {
      this.outro += content;
    }
    return this;
  }
  clone() {
    const cloned = new _MagicString(this.original, { filename: this.filename });
    let originalChunk = this.firstChunk;
    let clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
    while (originalChunk) {
      cloned.byStart[clonedChunk.start] = clonedChunk;
      cloned.byEnd[clonedChunk.end] = clonedChunk;
      const nextOriginalChunk = originalChunk.next;
      const nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
      if (nextClonedChunk) {
        clonedChunk.next = nextClonedChunk;
        nextClonedChunk.previous = clonedChunk;
        clonedChunk = nextClonedChunk;
      }
      originalChunk = nextOriginalChunk;
    }
    cloned.lastChunk = clonedChunk;
    if (this.indentExclusionRanges) {
      cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
    }
    cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
    cloned.intro = this.intro;
    cloned.outro = this.outro;
    return cloned;
  }
  generateDecodedMap(options) {
    options = options || {};
    const sourceIndex = 0;
    const names = Object.keys(this.storedNames);
    const mappings = new Mappings(options.hires);
    const locate = getLocator(this.original);
    if (this.intro) {
      mappings.advance(this.intro);
    }
    this.firstChunk.eachNext((chunk) => {
      const loc = locate(chunk.start);
      if (chunk.intro.length)
        mappings.advance(chunk.intro);
      if (chunk.edited) {
        mappings.addEdit(
          sourceIndex,
          chunk.content,
          loc,
          chunk.storeName ? names.indexOf(chunk.original) : -1
        );
      } else {
        mappings.addUneditedChunk(sourceIndex, chunk, this.original, loc, this.sourcemapLocations);
      }
      if (chunk.outro.length)
        mappings.advance(chunk.outro);
    });
    return {
      file: options.file ? options.file.split(/[/\\]/).pop() : void 0,
      sources: [options.source ? getRelativePath(options.file || "", options.source) : options.file || ""],
      sourcesContent: options.includeContent ? [this.original] : void 0,
      names,
      mappings: mappings.raw,
      x_google_ignoreList: this.ignoreList ? [sourceIndex] : void 0
    };
  }
  generateMap(options) {
    return new SourceMap(this.generateDecodedMap(options));
  }
  _ensureindentStr() {
    if (this.indentStr === void 0) {
      this.indentStr = guessIndent(this.original);
    }
  }
  _getRawIndentString() {
    this._ensureindentStr();
    return this.indentStr;
  }
  getIndentString() {
    this._ensureindentStr();
    return this.indentStr === null ? "	" : this.indentStr;
  }
  indent(indentStr, options) {
    const pattern = /^[^\r\n]/gm;
    if (isObject(indentStr)) {
      options = indentStr;
      indentStr = void 0;
    }
    if (indentStr === void 0) {
      this._ensureindentStr();
      indentStr = this.indentStr || "	";
    }
    if (indentStr === "")
      return this;
    options = options || {};
    const isExcluded = {};
    if (options.exclude) {
      const exclusions = typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude;
      exclusions.forEach((exclusion) => {
        for (let i = exclusion[0]; i < exclusion[1]; i += 1) {
          isExcluded[i] = true;
        }
      });
    }
    let shouldIndentNextCharacter = options.indentStart !== false;
    const replacer = (match) => {
      if (shouldIndentNextCharacter)
        return `${indentStr}${match}`;
      shouldIndentNextCharacter = true;
      return match;
    };
    this.intro = this.intro.replace(pattern, replacer);
    let charIndex = 0;
    let chunk = this.firstChunk;
    while (chunk) {
      const end = chunk.end;
      if (chunk.edited) {
        if (!isExcluded[charIndex]) {
          chunk.content = chunk.content.replace(pattern, replacer);
          if (chunk.content.length) {
            shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === "\n";
          }
        }
      } else {
        charIndex = chunk.start;
        while (charIndex < end) {
          if (!isExcluded[charIndex]) {
            const char = this.original[charIndex];
            if (char === "\n") {
              shouldIndentNextCharacter = true;
            } else if (char !== "\r" && shouldIndentNextCharacter) {
              shouldIndentNextCharacter = false;
              if (charIndex === chunk.start) {
                chunk.prependRight(indentStr);
              } else {
                this._splitChunk(chunk, charIndex);
                chunk = chunk.next;
                chunk.prependRight(indentStr);
              }
            }
          }
          charIndex += 1;
        }
      }
      charIndex = chunk.end;
      chunk = chunk.next;
    }
    this.outro = this.outro.replace(pattern, replacer);
    return this;
  }
  insert() {
    throw new Error(
      "magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)"
    );
  }
  insertLeft(index, content) {
    if (!warned.insertLeft) {
      console.warn(
        "magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"
      );
      warned.insertLeft = true;
    }
    return this.appendLeft(index, content);
  }
  insertRight(index, content) {
    if (!warned.insertRight) {
      console.warn(
        "magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"
      );
      warned.insertRight = true;
    }
    return this.prependRight(index, content);
  }
  move(start, end, index) {
    if (index >= start && index <= end)
      throw new Error("Cannot move a selection inside itself");
    this._split(start);
    this._split(end);
    this._split(index);
    const first = this.byStart[start];
    const last = this.byEnd[end];
    const oldLeft = first.previous;
    const oldRight = last.next;
    const newRight = this.byStart[index];
    if (!newRight && last === this.lastChunk)
      return this;
    const newLeft = newRight ? newRight.previous : this.lastChunk;
    if (oldLeft)
      oldLeft.next = oldRight;
    if (oldRight)
      oldRight.previous = oldLeft;
    if (newLeft)
      newLeft.next = first;
    if (newRight)
      newRight.previous = last;
    if (!first.previous)
      this.firstChunk = last.next;
    if (!last.next) {
      this.lastChunk = first.previous;
      this.lastChunk.next = null;
    }
    first.previous = newLeft;
    last.next = newRight || null;
    if (!newLeft)
      this.firstChunk = first;
    if (!newRight)
      this.lastChunk = last;
    return this;
  }
  overwrite(start, end, content, options) {
    options = options || {};
    return this.update(start, end, content, { ...options, overwrite: !options.contentOnly });
  }
  update(start, end, content, options) {
    if (typeof content !== "string")
      throw new TypeError("replacement content must be a string");
    while (start < 0)
      start += this.original.length;
    while (end < 0)
      end += this.original.length;
    if (end > this.original.length)
      throw new Error("end is out of bounds");
    if (start === end)
      throw new Error(
        "Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead"
      );
    this._split(start);
    this._split(end);
    if (options === true) {
      if (!warned.storeName) {
        console.warn(
          "The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"
        );
        warned.storeName = true;
      }
      options = { storeName: true };
    }
    const storeName = options !== void 0 ? options.storeName : false;
    const overwrite = options !== void 0 ? options.overwrite : false;
    if (storeName) {
      const original = this.original.slice(start, end);
      Object.defineProperty(this.storedNames, original, {
        writable: true,
        value: true,
        enumerable: true
      });
    }
    const first = this.byStart[start];
    const last = this.byEnd[end];
    if (first) {
      let chunk = first;
      while (chunk !== last) {
        if (chunk.next !== this.byStart[chunk.end]) {
          throw new Error("Cannot overwrite across a split point");
        }
        chunk = chunk.next;
        chunk.edit("", false);
      }
      first.edit(content, storeName, !overwrite);
    } else {
      const newChunk = new Chunk(start, end, "").edit(content, storeName);
      last.next = newChunk;
      newChunk.previous = last;
    }
    return this;
  }
  prepend(content) {
    if (typeof content !== "string")
      throw new TypeError("outro content must be a string");
    this.intro = content + this.intro;
    return this;
  }
  prependLeft(index, content) {
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byEnd[index];
    if (chunk) {
      chunk.prependLeft(content);
    } else {
      this.intro = content + this.intro;
    }
    return this;
  }
  prependRight(index, content) {
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byStart[index];
    if (chunk) {
      chunk.prependRight(content);
    } else {
      this.outro = content + this.outro;
    }
    return this;
  }
  remove(start, end) {
    while (start < 0)
      start += this.original.length;
    while (end < 0)
      end += this.original.length;
    if (start === end)
      return this;
    if (start < 0 || end > this.original.length)
      throw new Error("Character is out of bounds");
    if (start > end)
      throw new Error("end must be greater than start");
    this._split(start);
    this._split(end);
    let chunk = this.byStart[start];
    while (chunk) {
      chunk.intro = "";
      chunk.outro = "";
      chunk.edit("");
      chunk = end > chunk.end ? this.byStart[chunk.end] : null;
    }
    return this;
  }
  lastChar() {
    if (this.outro.length)
      return this.outro[this.outro.length - 1];
    let chunk = this.lastChunk;
    do {
      if (chunk.outro.length)
        return chunk.outro[chunk.outro.length - 1];
      if (chunk.content.length)
        return chunk.content[chunk.content.length - 1];
      if (chunk.intro.length)
        return chunk.intro[chunk.intro.length - 1];
    } while (chunk = chunk.previous);
    if (this.intro.length)
      return this.intro[this.intro.length - 1];
    return "";
  }
  lastLine() {
    let lineIndex = this.outro.lastIndexOf(n);
    if (lineIndex !== -1)
      return this.outro.substr(lineIndex + 1);
    let lineStr = this.outro;
    let chunk = this.lastChunk;
    do {
      if (chunk.outro.length > 0) {
        lineIndex = chunk.outro.lastIndexOf(n);
        if (lineIndex !== -1)
          return chunk.outro.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.outro + lineStr;
      }
      if (chunk.content.length > 0) {
        lineIndex = chunk.content.lastIndexOf(n);
        if (lineIndex !== -1)
          return chunk.content.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.content + lineStr;
      }
      if (chunk.intro.length > 0) {
        lineIndex = chunk.intro.lastIndexOf(n);
        if (lineIndex !== -1)
          return chunk.intro.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.intro + lineStr;
      }
    } while (chunk = chunk.previous);
    lineIndex = this.intro.lastIndexOf(n);
    if (lineIndex !== -1)
      return this.intro.substr(lineIndex + 1) + lineStr;
    return this.intro + lineStr;
  }
  slice(start = 0, end = this.original.length) {
    while (start < 0)
      start += this.original.length;
    while (end < 0)
      end += this.original.length;
    let result = "";
    let chunk = this.firstChunk;
    while (chunk && (chunk.start > start || chunk.end <= start)) {
      if (chunk.start < end && chunk.end >= end) {
        return result;
      }
      chunk = chunk.next;
    }
    if (chunk && chunk.edited && chunk.start !== start)
      throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);
    const startChunk = chunk;
    while (chunk) {
      if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
        result += chunk.intro;
      }
      const containsEnd = chunk.start < end && chunk.end >= end;
      if (containsEnd && chunk.edited && chunk.end !== end)
        throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);
      const sliceStart = startChunk === chunk ? start - chunk.start : 0;
      const sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
      result += chunk.content.slice(sliceStart, sliceEnd);
      if (chunk.outro && (!containsEnd || chunk.end === end)) {
        result += chunk.outro;
      }
      if (containsEnd) {
        break;
      }
      chunk = chunk.next;
    }
    return result;
  }
  // TODO deprecate this? not really very useful
  snip(start, end) {
    const clone = this.clone();
    clone.remove(0, start);
    clone.remove(end, clone.original.length);
    return clone;
  }
  _split(index) {
    if (this.byStart[index] || this.byEnd[index])
      return;
    let chunk = this.lastSearchedChunk;
    const searchForward = index > chunk.end;
    while (chunk) {
      if (chunk.contains(index))
        return this._splitChunk(chunk, index);
      chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
    }
  }
  _splitChunk(chunk, index) {
    if (chunk.edited && chunk.content.length) {
      const loc = getLocator(this.original)(index);
      throw new Error(
        `Cannot split a chunk that has already been edited (${loc.line}:${loc.column} \u2013 "${chunk.original}")`
      );
    }
    const newChunk = chunk.split(index);
    this.byEnd[index] = chunk;
    this.byStart[index] = newChunk;
    this.byEnd[newChunk.end] = newChunk;
    if (chunk === this.lastChunk)
      this.lastChunk = newChunk;
    this.lastSearchedChunk = chunk;
    return true;
  }
  toString() {
    let str = this.intro;
    let chunk = this.firstChunk;
    while (chunk) {
      str += chunk.toString();
      chunk = chunk.next;
    }
    return str + this.outro;
  }
  isEmpty() {
    let chunk = this.firstChunk;
    do {
      if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim())
        return false;
    } while (chunk = chunk.next);
    return true;
  }
  length() {
    let chunk = this.firstChunk;
    let length = 0;
    do {
      length += chunk.intro.length + chunk.content.length + chunk.outro.length;
    } while (chunk = chunk.next);
    return length;
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(charType) {
    return this.trimStart(charType).trimEnd(charType);
  }
  trimEndAborted(charType) {
    const rx = new RegExp((charType || "\\s") + "+$");
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length)
      return true;
    let chunk = this.lastChunk;
    do {
      const end = chunk.end;
      const aborted = chunk.trimEnd(rx);
      if (chunk.end !== end) {
        if (this.lastChunk === chunk) {
          this.lastChunk = chunk.next;
        }
        this.byEnd[chunk.end] = chunk;
        this.byStart[chunk.next.start] = chunk.next;
        this.byEnd[chunk.next.end] = chunk.next;
      }
      if (aborted)
        return true;
      chunk = chunk.previous;
    } while (chunk);
    return false;
  }
  trimEnd(charType) {
    this.trimEndAborted(charType);
    return this;
  }
  trimStartAborted(charType) {
    const rx = new RegExp("^" + (charType || "\\s") + "+");
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length)
      return true;
    let chunk = this.firstChunk;
    do {
      const end = chunk.end;
      const aborted = chunk.trimStart(rx);
      if (chunk.end !== end) {
        if (chunk === this.lastChunk)
          this.lastChunk = chunk.next;
        this.byEnd[chunk.end] = chunk;
        this.byStart[chunk.next.start] = chunk.next;
        this.byEnd[chunk.next.end] = chunk.next;
      }
      if (aborted)
        return true;
      chunk = chunk.next;
    } while (chunk);
    return false;
  }
  trimStart(charType) {
    this.trimStartAborted(charType);
    return this;
  }
  hasChanged() {
    return this.original !== this.toString();
  }
  _replaceRegexp(searchValue, replacement) {
    function getReplacement(match, str) {
      if (typeof replacement === "string") {
        return replacement.replace(/\$(\$|&|\d+)/g, (_, i) => {
          if (i === "$")
            return "$";
          if (i === "&")
            return match[0];
          const num = +i;
          if (num < match.length)
            return match[+i];
          return `$${i}`;
        });
      } else {
        return replacement(...match, match.index, str, match.groups);
      }
    }
    function matchAll(re, str) {
      let match;
      const matches = [];
      while (match = re.exec(str)) {
        matches.push(match);
      }
      return matches;
    }
    if (searchValue.global) {
      const matches = matchAll(searchValue, this.original);
      matches.forEach((match) => {
        if (match.index != null)
          this.overwrite(
            match.index,
            match.index + match[0].length,
            getReplacement(match, this.original)
          );
      });
    } else {
      const match = this.original.match(searchValue);
      if (match && match.index != null)
        this.overwrite(
          match.index,
          match.index + match[0].length,
          getReplacement(match, this.original)
        );
    }
    return this;
  }
  _replaceString(string, replacement) {
    const { original } = this;
    const index = original.indexOf(string);
    if (index !== -1) {
      this.overwrite(index, index + string.length, replacement);
    }
    return this;
  }
  replace(searchValue, replacement) {
    if (typeof searchValue === "string") {
      return this._replaceString(searchValue, replacement);
    }
    return this._replaceRegexp(searchValue, replacement);
  }
  _replaceAllString(string, replacement) {
    const { original } = this;
    const stringLength = string.length;
    for (let index = original.indexOf(string); index !== -1; index = original.indexOf(string, index + stringLength)) {
      this.overwrite(index, index + stringLength, replacement);
    }
    return this;
  }
  replaceAll(searchValue, replacement) {
    if (typeof searchValue === "string") {
      return this._replaceAllString(searchValue, replacement);
    }
    if (!searchValue.global) {
      throw new TypeError(
        "MagicString.prototype.replaceAll called with a non-global RegExp argument"
      );
    }
    return this._replaceRegexp(searchValue, replacement);
  }
};

// src/node/plugin/importAnalysis.ts
function importAnalysisPlugin(config) {
  const { root } = config;
  return {
    name: "vite:import-analysis",
    async transform(source, importer) {
      let s = new MagicString(source);
      await init;
      const [imports, exports] = parse3(source);
      const normalizeUrl = async (url, pos) => {
        const resolved = await this.resolve(url, importer);
        if (resolved.id.startsWith(root + "/")) {
          url = resolved.id.slice(root.length);
        }
        return [url, resolved.id];
      };
      await Promise.all(imports.map(async (importSpecifier, index) => {
        const {
          n: specifier,
          s: start,
          e: end
        } = importSpecifier;
        if (specifier) {
          const [url, resolvedId] = await normalizeUrl(specifier, start);
          s.overwrite(start, end, url);
        }
      }));
      return { code: s.toString() };
    }
  };
}

// src/node/plugin/build.ts
import { readFile as readFile3 } from "fs/promises";
function buildPlugin() {
  return {
    name: "vite:esbuild",
    async load(id) {
      try {
        const code = await readFile3(id, "utf-8");
        return code;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  };
}

// src/node/plugin/index.ts
async function resolvePlugins(config) {
  return [
    resolvePlugin(config),
    importAnalysisPlugin(config),
    buildPlugin()
  ];
}

// src/node/server/pluginContainer.ts
import { join as join3 } from "path";
async function createPluginContainer(config) {
  const plugins = await resolvePlugins(config);
  class Context {
    async resolve(id, importer) {
      let out = await container.resolveId(id, importer);
      if (typeof out === "string") {
        out = { id: out };
      }
      return out;
    }
  }
  const container = {
    async resolveId(rawId, importer = join3(config.root, "index.html")) {
      const ctx = new Context();
      let id = null;
      const partial = {};
      for (const plugin of plugins) {
        if (!plugin.resolveId)
          continue;
        const result = await plugin.resolveId.call(ctx, rawId, importer);
        if (!result)
          continue;
        if (typeof result === "string") {
          id = result;
        } else {
          id = result.id;
          Object.assign(partial, result);
        }
      }
      if (id) {
        partial.id = id;
      }
      return partial;
    },
    async load(id) {
      const ctx = new Context();
      for (const plugin of plugins) {
        if (!plugin.load)
          continue;
        const result = await plugin.load.call(ctx, id);
        if (result !== null) {
          return result;
        }
      }
      return null;
    },
    async transform(code, id) {
      const ctx = new Context();
      for (const plugin of plugins) {
        if (!plugin.transform)
          continue;
        const result = await plugin.transform.call(ctx, code, id);
        if (!result)
          continue;
        if (typeof result === "string") {
          code = result;
        } else if (result.code) {
          code = result.code;
        }
      }
      return { code };
    }
  };
  return container;
}

// src/node/server/index.ts
async function createServer() {
  const app = (0, import_connect.default)();
  const config = {
    root: process.cwd()
    // 定义一个全局root
  };
  const container = await createPluginContainer(config);
  const server = {
    config,
    pluginContainer: container,
    async listen() {
      app.listen(3e3, async () => {
        console.log(`> \u672C\u5730\u8BBF\u95EE\u8DEF\u5F84: "http://localhost:3000"`);
      });
    }
  };
  app.use(transformMiddleware(server));
  app.use(serveStaticMiddleware(server));
  app.use(htmlFallbackMiddleware(server));
  app.use(indexHtmlMiddleware(server));
  return server;
}
export {
  createServer
};
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
