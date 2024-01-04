﻿/*
 HTML5 Shiv v3.7.0 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
(function(l, f) {
 function m() {
  var a = e.elements;
  return "string" == typeof a ? a.split(" ") : a
 }

 function i(a) {
  var b = n[a[o]];
  b || (b = {}, h++, a[o] = h, n[h] = b);
  return b
 }

 function p(a, b, c) {
  b || (b = f);
  if (g) return b.createElement(a);
  c || (c = i(b));
  b = c.cache[a] ? c.cache[a].cloneNode() : r.test(a) ? (c.cache[a] = c.createElem(a)).cloneNode() : c.createElem(a);
  return b.canHaveChildren && !s.test(a) ? c.frag.appendChild(b) : b
 }

 function t(a, b) {
  if (!b.cache) b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag();
  a.createElement = function(c) {
   return !e.shivMethods ? b.createElem(c) : p(c, a, b)
  };
  a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function(a) {
   b.createElem(a);
   b.frag.createElement(a);
   return 'c("' + a + '")'
  }) + ");return n}")(e, b.frag)
 }

 function q(a) {
  a || (a = f);
  var b = i(a);
  if (e.shivCSS && !j && !b.hasCSS) {
   var c, d = a;
   c = d.createElement("p");
   d = d.getElementsByTagName("head")[0] || d.documentElement;
   c.innerHTML = "x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>";
   c = d.insertBefore(c.lastChild, d.firstChild);
   b.hasCSS = !!c
  }
  g || t(a, b);
  return a
 }
 var k = l.html5 || {},
  s = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
  r = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
  j, o = "_html5shiv",
  h = 0,
  n = {},
  g;
 (function() {
  try {
   var a = f.createElement("a");
   a.innerHTML = "<xyz></xyz>";
   j = "hidden" in a;
   var b;
   if (!(b = 1 == a.childNodes.length)) {
    f.createElement("a");
    var c = f.createDocumentFragment();
    b = "undefined" == typeof c.cloneNode ||
     "undefined" == typeof c.createDocumentFragment || "undefined" == typeof c.createElement
   }
   g = b
  } catch (d) {
   g = j = !0
  }
 })();
 var e = {
  elements: k.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
  version: "3.7.0",
  shivCSS: !1 !== k.shivCSS,
  supportsUnknownElements: g,
  shivMethods: !1 !== k.shivMethods,
  type: "default",
  shivDocument: q,
  createElement: p,
  createDocumentFragment: function(a, b) {
   a || (a = f);
   if (g) return a.createDocumentFragment();
   for (var b = b || i(a), c = b.frag.cloneNode(), d = 0, e = m(), h = e.length; d < h; d++) c.createElement(e[d]);
   return c
  }
 };
 l.html5 = e;
 q(f)
})(this, document);

/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute === void 0 && (jQuery.migrateMute = !0),
 function(e, t, n) {
  function r(n) {
   var r = t.console;
   i[n] || (i[n] = !0, e.migrateWarnings.push(n), r && r.warn && !e.migrateMute && (r.warn("JQMIGRATE: " + n), e.migrateTrace && r.trace && r.trace()))
  }

  function a(t, a, i, o) {
   if (Object.defineProperty) try {
    return Object.defineProperty(t, a, {
     configurable: !0,
     enumerable: !0,
     get: function() {
      return r(o), i
     },
     set: function(e) {
      r(o), i = e
     }
    }), n
   } catch (s) {}
   e._definePropertyBroken = !0, t[a] = i
  }
  var i = {};
  e.migrateWarnings = [], !e.migrateMute && t.console && t.console.log && t.console.log("JQMIGRATE: Logging is active"), e.migrateTrace === n && (e.migrateTrace = !0), e.migrateReset = function() {
   i = {}, e.migrateWarnings.length = 0
  }, "BackCompat" === document.compatMode && r("jQuery is not compatible with Quirks Mode");
  var o = e("<input/>", {
    size: 1
   }).attr("size") && e.attrFn,
   s = e.attr,
   u = e.attrHooks.value && e.attrHooks.value.get || function() {
    return null
   },
   c = e.attrHooks.value && e.attrHooks.value.set || function() {
    return n
   },
   l = /^(?:input|button)$/i,
   d = /^[238]$/,
   p = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
   f = /^(?:checked|selected)$/i;
  a(e, "attrFn", o || {}, "jQuery.attrFn is deprecated"), e.attr = function(t, a, i, u) {
   var c = a.toLowerCase(),
    g = t && t.nodeType;
   return u && (4 > s.length && r("jQuery.fn.attr( props, pass ) is deprecated"), t && !d.test(g) && (o ? a in o : e.isFunction(e.fn[a]))) ? e(t)[a](i) : ("type" === a && i !== n && l.test(t.nodeName) && t.parentNode && r("Can't change the 'type' of an input or button in IE 6/7/8"), !e.attrHooks[c] && p.test(c) && (e.attrHooks[c] = {
    get: function(t, r) {
     var a, i = e.prop(t, r);
     return i === !0 || "boolean" != typeof i && (a = t.getAttributeNode(r)) && a.nodeValue !== !1 ? r.toLowerCase() : n
    },
    set: function(t, n, r) {
     var a;
     return n === !1 ? e.removeAttr(t, r) : (a = e.propFix[r] || r, a in t && (t[a] = !0), t.setAttribute(r, r.toLowerCase())), r
    }
   }, f.test(c) && r("jQuery.fn.attr('" + c + "') may use property instead of attribute")), s.call(e, t, a, i))
  }, e.attrHooks.value = {
   get: function(e, t) {
    var n = (e.nodeName || "").toLowerCase();
    return "button" === n ? u.apply(this, arguments) : ("input" !== n && "option" !== n && r("jQuery.fn.attr('value') no longer gets properties"), t in e ? e.value : null)
   },
   set: function(e, t) {
    var a = (e.nodeName || "").toLowerCase();
    return "button" === a ? c.apply(this, arguments) : ("input" !== a && "option" !== a && r("jQuery.fn.attr('value', val) no longer sets properties"), e.value = t, n)
   }
  };
  var g, h, v = e.fn.init,
   m = e.parseJSON,
   y = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
  e.fn.init = function(t, n, a) {
   var i;
   return t && "string" == typeof t && !e.isPlainObject(n) && (i = y.exec(e.trim(t))) && i[0] && ("<" !== t.charAt(0) && r("$(html) HTML strings must start with '<' character"), i[3] && r("$(html) HTML text after last tag is ignored"), "#" === i[0].charAt(0) && (r("HTML string cannot start with a '#' character"), e.error("JQMIGRATE: Invalid selector string (XSS)")), n && n.context && (n = n.context), e.parseHTML) ? v.call(this, e.parseHTML(i[2], n, !0), n, a) : v.apply(this, arguments)
  }, e.fn.init.prototype = e.fn, e.parseJSON = function(e) {
   return e || null === e ? m.apply(this, arguments) : (r("jQuery.parseJSON requires a valid JSON string"), null)
  }, e.uaMatch = function(e) {
   e = e.toLowerCase();
   var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
   return {
    browser: t[1] || "",
    version: t[2] || "0"
   }
  }, e.browser || (g = e.uaMatch(navigator.userAgent), h = {}, g.browser && (h[g.browser] = !0, h.version = g.version), h.chrome ? h.webkit = !0 : h.webkit && (h.safari = !0), e.browser = h), a(e, "browser", e.browser, "jQuery.browser is deprecated"), e.sub = function() {
   function t(e, n) {
    return new t.fn.init(e, n)
   }
   e.extend(!0, t, this), t.superclass = this, t.fn = t.prototype = this(), t.fn.constructor = t, t.sub = this.sub, t.fn.init = function(r, a) {
    return a && a instanceof e && !(a instanceof t) && (a = t(a)), e.fn.init.call(this, r, a, n)
   }, t.fn.init.prototype = t.fn;
   var n = t(document);
   return r("jQuery.sub() is deprecated"), t
  }, e.ajaxSetup({
   converters: {
    "text json": e.parseJSON
   }
  });
  var b = e.fn.data;
  e.fn.data = function(t) {
   var a, i, o = this[0];
   return !o || "events" !== t || 1 !== arguments.length || (a = e.data(o, t), i = e._data(o, t), a !== n && a !== i || i === n) ? b.apply(this, arguments) : (r("Use of jQuery.fn.data('events') is deprecated"), i)
  };
  var j = /\/(java|ecma)script/i,
   w = e.fn.andSelf || e.fn.addBack;
  e.fn.andSelf = function() {
   return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), w.apply(this, arguments)
  }, e.clean || (e.clean = function(t, a, i, o) {
   a = a || document, a = !a.nodeType && a[0] || a, a = a.ownerDocument || a, r("jQuery.clean() is deprecated");
   var s, u, c, l, d = [];
   if (e.merge(d, e.buildFragment(t, a).childNodes), i)
    for (c = function(e) {
      return !e.type || j.test(e.type) ? o ? o.push(e.parentNode ? e.parentNode.removeChild(e) : e) : i.appendChild(e) : n
     }, s = 0; null != (u = d[s]); s++) e.nodeName(u, "script") && c(u) || (i.appendChild(u), u.getElementsByTagName !== n && (l = e.grep(e.merge([], u.getElementsByTagName("script")), c), d.splice.apply(d, [s + 1, 0].concat(l)), s += l.length));
   return d
  });
  var Q = e.event.add,
   x = e.event.remove,
   k = e.event.trigger,
   N = e.fn.toggle,
   T = e.fn.live,
   M = e.fn.die,
   S = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
   C = RegExp("\\b(?:" + S + ")\\b"),
   H = /(?:^|\s)hover(\.\S+|)\b/,
   A = function(t) {
    return "string" != typeof t || e.event.special.hover ? t : (H.test(t) && r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), t && t.replace(H, "mouseenter$1 mouseleave$1"))
   };
  e.event.props && "attrChange" !== e.event.props[0] && e.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"), e.event.dispatch && a(e.event, "handle", e.event.dispatch, "jQuery.event.handle is undocumented and deprecated"), e.event.add = function(e, t, n, a, i) {
   e !== document && C.test(t) && r("AJAX events should be attached to document: " + t), Q.call(this, e, A(t || ""), n, a, i)
  }, e.event.remove = function(e, t, n, r, a) {
   x.call(this, e, A(t) || "", n, r, a)
  }, e.fn.error = function() {
   var e = Array.prototype.slice.call(arguments, 0);
   return r("jQuery.fn.error() is deprecated"), e.splice(0, 0, "error"), arguments.length ? this.bind.apply(this, e) : (this.triggerHandler.apply(this, e), this)
  }, e.fn.toggle = function(t, n) {
   if (!e.isFunction(t) || !e.isFunction(n)) return N.apply(this, arguments);
   r("jQuery.fn.toggle(handler, handler...) is deprecated");
   var a = arguments,
    i = t.guid || e.guid++,
    o = 0,
    s = function(n) {
     var r = (e._data(this, "lastToggle" + t.guid) || 0) % o;
     return e._data(this, "lastToggle" + t.guid, r + 1), n.preventDefault(), a[r].apply(this, arguments) || !1
    };
   for (s.guid = i; a.length > o;) a[o++].guid = i;
   return this.click(s)
  }, e.fn.live = function(t, n, a) {
   return r("jQuery.fn.live() is deprecated"), T ? T.apply(this, arguments) : (e(this.context).on(t, this.selector, n, a), this)
  }, e.fn.die = function(t, n) {
   return r("jQuery.fn.die() is deprecated"), M ? M.apply(this, arguments) : (e(this.context).off(t, this.selector || "**", n), this)
  }, e.event.trigger = function(e, t, n, a) {
   return n || C.test(e) || r("Global events are undocumented and deprecated"), k.call(this, e, t, n || document, a)
  }, e.each(S.split("|"), function(t, n) {
   e.event.special[n] = {
    setup: function() {
     var t = this;
     return t !== document && (e.event.add(document, n + "." + e.guid, function() {
      e.event.trigger(n, null, t, !0)
     }), e._data(this, n, e.guid++)), !1
    },
    teardown: function() {
     return this !== document && e.event.remove(document, n + "." + e._data(this, n)), !1
    }
   }
  })
 }(jQuery, window);

/* == jquery mousewheel plugin == Version: 3.1.11, License: MIT License (MIT) */
! function(a) {
 "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function(a) {
 function b(b) {
  var g = b || window.event,
   h = i.call(arguments, 1),
   j = 0,
   l = 0,
   m = 0,
   n = 0,
   o = 0,
   p = 0;
  if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) {
   if (1 === g.deltaMode) {
    var q = a.data(this, "mousewheel-line-height");
    j *= q, m *= q, l *= q
   } else if (2 === g.deltaMode) {
    var r = a.data(this, "mousewheel-page-height");
    j *= r, m *= r, l *= r
   }
   if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) {
    var s = this.getBoundingClientRect();
    o = b.clientX - s.left, p = b.clientY - s.top
   }
   return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h)
  }
 }

 function c() {
  f = null
 }

 function d(a, b) {
  return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0
 }
 var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
  h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
  i = Array.prototype.slice;
 if (a.event.fixHooks)
  for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks;
 var k = a.event.special.mousewheel = {
  version: "3.1.11",
  setup: function() {
   if (this.addEventListener)
    for (var c = h.length; c;) this.addEventListener(h[--c], b, !1);
   else this.onmousewheel = b;
   a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this))
  },
  teardown: function() {
   if (this.removeEventListener)
    for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1);
   else this.onmousewheel = null;
   a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height")
  },
  getLineHeight: function(b) {
   var c = a(b)["offsetParent" in a.fn ? "offsetParent" : "parent"]();
   return c.length || (c = a("body")), parseInt(c.css("fontSize"), 10)
  },
  getPageHeight: function(b) {
   return a(b).height()
  },
  settings: {
   adjustOldDeltas: !0,
   normalizeOffset: !0
  }
 };
 a.fn.extend({
  mousewheel: function(a) {
   return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
  },
  unmousewheel: function(a) {
   return this.unbind("mousewheel", a)
  }
 })
});

/* == malihu jquery custom scrollbar plugin == Version: 3.0.3, License: MIT License (MIT) */
(function(b, a, c) {
 (function(d) {
  if (typeof define === "function" && define.amd) {
   define(["jquery", "jquery-mousewheel"], d)
  } else {
   d(jQuery)
  }
 }(function(j) {
  var g = "mCustomScrollbar",
   d = "mCS",
   m = ".mCustomScrollbar",
   h = {
    setWidth: false,
    setHeight: false,
    setTop: 0,
    setLeft: 0,
    axis: "y",
    scrollbarPosition: "inside",
    scrollInertia: 950,
    autoDraggerLength: true,
    autoHideScrollbar: false,
    autoExpandScrollbar: false,
    alwaysShowScrollbar: 0,
    snapAmount: null,
    snapOffset: 0,
    mouseWheel: {
     enable: true,
     scrollAmount: "auto",
     axis: "y",
     preventDefault: "auto",
     deltaFactor: "auto",
     normalizeDelta: false,
     invert: false,
     disableOver: ["select", "option", "keygen", "datalist", "textarea"]
    },
    scrollButtons: {
     enable: false,
     scrollType: "stepless",
     scrollAmount: "auto"
    },
    keyboard: {
     enable: true,
     scrollType: "stepless",
     scrollAmount: "auto"
    },
    contentTouchScroll: 25,
    advanced: {
     autoExpandHorizontalScroll: false,
     autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
     updateOnContentResize: true,
     updateOnImageLoad: true,
     updateOnSelectorChange: false
    },
    theme: "light",
    callbacks: {
     onScrollStart: false,
     onScroll: false,
     onTotalScroll: false,
     onTotalScrollBack: false,
     whileScrolling: false,
     onTotalScrollOffset: 0,
     onTotalScrollBackOffset: 0,
     alwaysTriggerOffsets: true
    },
    live: false,
    liveSelector: null
   },
   l = 0,
   o = {},
   f = function(p) {
    if (o[p]) {
     clearTimeout(o[p]);
     i._delete.call(null, o[p])
    }
   },
   k = (b.attachEvent && !b.addEventListener) ? 1 : 0,
   n = false,
   e = {
    init: function(q) {
     var q = j.extend(true, {}, h, q),
      p = i._selector.call(this);
     if (q.live) {
      var s = q.liveSelector || this.selector || m,
       r = j(s);
      if (q.live === "off") {
       f(s);
       return
      }
      o[s] = setTimeout(function() {
       r.mCustomScrollbar(q);
       if (q.live === "once" && r.length) {
        f(s)
       }
      }, 500)
     } else {
      f(s)
     }
     q.setWidth = (q.set_width) ? q.set_width : q.setWidth;
     q.setHeight = (q.set_height) ? q.set_height : q.setHeight;
     q.axis = (q.horizontalScroll) ? "x" : i._findAxis.call(null, q.axis);
     q.scrollInertia = q.scrollInertia < 17 ? 17 : q.scrollInertia;
     if (typeof q.mouseWheel !== "object" && q.mouseWheel == true) {
      q.mouseWheel = {
       enable: true,
       scrollAmount: "auto",
       axis: "y",
       preventDefault: false,
       deltaFactor: "auto",
       normalizeDelta: false,
       invert: false
      }
     }
     q.mouseWheel.scrollAmount = !q.mouseWheelPixels ? q.mouseWheel.scrollAmount : q.mouseWheelPixels;
     q.mouseWheel.normalizeDelta = !q.advanced.normalizeMouseWheelDelta ? q.mouseWheel.normalizeDelta : q.advanced.normalizeMouseWheelDelta;
     q.scrollButtons.scrollType = i._findScrollButtonsType.call(null, q.scrollButtons.scrollType);
     i._theme.call(null, q);
     return j(p).each(function() {
      var u = j(this);
      if (!u.data(d)) {
       u.data(d, {
        idx: ++l,
        opt: q,
        scrollRatio: {
         y: null,
         x: null
        },
        overflowed: null,
        bindEvents: false,
        tweenRunning: false,
        sequential: {},
        langDir: u.css("direction"),
        cbOffsets: null,
        trigger: null
       });
       var w = u.data(d).opt,
        v = u.data("mcs-axis"),
        t = u.data("mcs-scrollbar-position"),
        x = u.data("mcs-theme");
       if (v) {
        w.axis = v
       }
       if (t) {
        w.scrollbarPosition = t
       }
       if (x) {
        w.theme = x;
        i._theme.call(null, w)
       }
       i._pluginMarkup.call(this);
       e.update.call(null, u)
      }
     })
    },
    update: function(q) {
     var p = q || i._selector.call(this);
     return j(p).each(function() {
      var t = j(this);
      if (t.data(d)) {
       var v = t.data(d),
        u = v.opt,
        r = j("#mCSB_" + v.idx + "_container"),
        s = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")];
       if (!r.length) {
        return
       }
       if (v.tweenRunning) {
        i._stop.call(null, t)
       }
       if (t.hasClass("mCS_disabled")) {
        t.removeClass("mCS_disabled")
       }
       if (t.hasClass("mCS_destroyed")) {
        t.removeClass("mCS_destroyed")
       }
       i._maxHeight.call(this);
       i._expandContentHorizontally.call(this);
       if (u.axis !== "y" && !u.advanced.autoExpandHorizontalScroll) {
        r.css("width", i._contentWidth(r.children()))
       }
       v.overflowed = i._overflowed.call(this);
       i._scrollbarVisibility.call(this);
       if (u.autoDraggerLength) {
        i._setDraggerLength.call(this)
       }
       i._scrollRatio.call(this);
       i._bindEvents.call(this);
       var w = [Math.abs(r[0].offsetTop), Math.abs(r[0].offsetLeft)];
       if (u.axis !== "x") {
        if (!v.overflowed[0]) {
         i._resetContentPosition.call(this);
         if (u.axis === "y") {
          i._unbindEvents.call(this)
         } else {
          if (u.axis === "yx" && v.overflowed[1]) {
           i._scrollTo.call(this, t, w[1].toString(), {
            dir: "x",
            dur: 0,
            overwrite: "none"
           })
          }
         }
        } else {
         if (s[0].height() > s[0].parent().height()) {
          i._resetContentPosition.call(this)
         } else {
          i._scrollTo.call(this, t, w[0].toString(), {
           dir: "y",
           dur: 0,
           overwrite: "none"
          })
         }
        }
       }
       if (u.axis !== "y") {
        if (!v.overflowed[1]) {
         i._resetContentPosition.call(this);
         if (u.axis === "x") {
          i._unbindEvents.call(this)
         } else {
          if (u.axis === "yx" && v.overflowed[0]) {
           i._scrollTo.call(this, t, w[0].toString(), {
            dir: "y",
            dur: 0,
            overwrite: "none"
           })
          }
         }
        } else {
         if (s[1].width() > s[1].parent().width()) {
          i._resetContentPosition.call(this)
         } else {
          i._scrollTo.call(this, t, w[1].toString(), {
           dir: "x",
           dur: 0,
           overwrite: "none"
          })
         }
        }
       }
       i._autoUpdate.call(this)
      }
     })
    },
    scrollTo: function(r, q) {
     if (typeof r == "undefined" || r == null) {
      return
     }
     var p = i._selector.call(this);
     return j(p).each(function() {
      var u = j(this);
      if (u.data(d)) {
       var x = u.data(d),
        w = x.opt,
        v = {
         trigger: "external",
         scrollInertia: w.scrollInertia,
         scrollEasing: "mcsEaseInOut",
         moveDragger: false,
         callbacks: true,
         onStart: true,
         onUpdate: true,
         onComplete: true
        },
        s = j.extend(true, {}, v, q),
        y = i._arr.call(this, r),
        t = s.scrollInertia < 17 ? 17 : s.scrollInertia;
       y[0] = i._to.call(this, y[0], "y");
       y[1] = i._to.call(this, y[1], "x");
       if (s.moveDragger) {
        y[0] *= x.scrollRatio.y;
        y[1] *= x.scrollRatio.x
       }
       s.dur = t;
       setTimeout(function() {
        if (y[0] !== null && typeof y[0] !== "undefined" && w.axis !== "x" && x.overflowed[0]) {
         s.dir = "y";
         s.overwrite = "all";
         i._scrollTo.call(this, u, y[0].toString(), s)
        }
        if (y[1] !== null && typeof y[1] !== "undefined" && w.axis !== "y" && x.overflowed[1]) {
         s.dir = "x";
         s.overwrite = "none";
         i._scrollTo.call(this, u, y[1].toString(), s)
        }
       }, 60)
      }
     })
    },
    stop: function() {
     var p = i._selector.call(this);
     return j(p).each(function() {
      var q = j(this);
      if (q.data(d)) {
       i._stop.call(null, q)
      }
     })
    },
    disable: function(q) {
     var p = i._selector.call(this);
     return j(p).each(function() {
      var r = j(this);
      if (r.data(d)) {
       var t = r.data(d),
        s = t.opt;
       i._autoUpdate.call(this, "remove");
       i._unbindEvents.call(this);
       if (q) {
        i._resetContentPosition.call(this)
       }
       i._scrollbarVisibility.call(this, true);
       r.addClass("mCS_disabled")
      }
     })
    },
    destroy: function() {
     var p = i._selector.call(this);
     return j(p).each(function() {
      var s = j(this);
      if (s.data(d)) {
       var u = s.data(d),
        t = u.opt,
        q = j("#mCSB_" + u.idx),
        r = j("#mCSB_" + u.idx + "_container"),
        v = j(".mCSB_" + u.idx + "_scrollbar");
       if (t.live) {
        f(p)
       }
       i._autoUpdate.call(this, "remove");
       i._unbindEvents.call(this);
       i._resetContentPosition.call(this);
       s.removeData(d);
       i._delete.call(null, this.mcs);
       v.remove();
       q.replaceWith(r.contents());
       s.removeClass(g + " _" + d + "_" + u.idx + " mCS-autoHide mCS-dir-rtl mCS_no_scrollbar mCS_disabled").addClass("mCS_destroyed")
      }
     })
    }
   },
   i = {
    _selector: function() {
     return (typeof j(this) !== "object" || j(this).length < 1) ? m : this
    },
    _theme: function(s) {
     var r = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"],
      q = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"],
      p = ["minimal", "minimal-dark"],
      u = ["minimal", "minimal-dark"],
      t = ["minimal", "minimal-dark"];
     s.autoDraggerLength = j.inArray(s.theme, r) > -1 ? false : s.autoDraggerLength;
     s.autoExpandScrollbar = j.inArray(s.theme, q) > -1 ? false : s.autoExpandScrollbar;
     s.scrollButtons.enable = j.inArray(s.theme, p) > -1 ? false : s.scrollButtons.enable;
     s.autoHideScrollbar = j.inArray(s.theme, u) > -1 ? true : s.autoHideScrollbar;
     s.scrollbarPosition = j.inArray(s.theme, t) > -1 ? "outside" : s.scrollbarPosition
    },
    _findAxis: function(p) {
     return (p === "yx" || p === "xy" || p === "auto") ? "yx" : (p === "x" || p === "horizontal") ? "x" : "y"
    },
    _findScrollButtonsType: function(p) {
     return (p === "stepped" || p === "pixels" || p === "step" || p === "click") ? "stepped" : "stepless"
    },
    _pluginMarkup: function() {
     var y = j(this),
      x = y.data(d),
      r = x.opt,
      t = r.autoExpandScrollbar ? " mCSB_scrollTools_onDrag_expand" : "",
      B = ["<div id='mCSB_" + x.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + x.idx + "_scrollbar mCS-" + r.theme + " mCSB_scrollTools_vertical" + t + "'><div class='mCSB_draggerContainer'><div id='mCSB_" + x.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + x.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + x.idx + "_scrollbar mCS-" + r.theme + " mCSB_scrollTools_horizontal" + t + "'><div class='mCSB_draggerContainer'><div id='mCSB_" + x.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
      u = r.axis === "yx" ? "mCSB_vertical_horizontal" : r.axis === "x" ? "mCSB_horizontal" : "mCSB_vertical",
      w = r.axis === "yx" ? B[0] + B[1] : r.axis === "x" ? B[1] : B[0],
      v = r.axis === "yx" ? "<div id='mCSB_" + x.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "",
      s = r.autoHideScrollbar ? " mCS-autoHide" : "",
      p = (r.axis !== "x" && x.langDir === "rtl") ? " mCS-dir-rtl" : "";
     if (r.setWidth) {
      y.css("width", r.setWidth)
     }
     if (r.setHeight) {
      y.css("height", r.setHeight)
     }
     r.setLeft = (r.axis !== "y" && x.langDir === "rtl") ? "989999px" : r.setLeft;
     y.addClass(g + " _" + d + "_" + x.idx + s + p).wrapInner("<div id='mCSB_" + x.idx + "' class='mCustomScrollBox mCS-" + r.theme + " " + u + "'><div id='mCSB_" + x.idx + "_container' class='mCSB_container' style='position:relative; top:" + r.setTop + "; left:" + r.setLeft + ";' dir=" + x.langDir + " /></div>");
     var q = j("#mCSB_" + x.idx),
      z = j("#mCSB_" + x.idx + "_container");
     if (r.axis !== "y" && !r.advanced.autoExpandHorizontalScroll) {
      z.css("width", i._contentWidth(z.children()))
     }
     if (r.scrollbarPosition === "outside") {
      if (y.css("position") === "static") {
       y.css("position", "relative")
      }
      y.css("overflow", "visible");
      q.addClass("mCSB_outside").after(w)
     } else {
      q.addClass("mCSB_inside").append(w);
      z.wrap(v)
     }
     i._scrollButtons.call(this);
     var A = [j("#mCSB_" + x.idx + "_dragger_vertical"), j("#mCSB_" + x.idx + "_dragger_horizontal")];
     A[0].css("min-height", A[0].height());
     A[1].css("min-width", A[1].width())
    },
    _contentWidth: function(p) {
     return Math.max.apply(Math, p.map(function() {
      return j(this).outerWidth(true)
     }).get())
    },
    _expandContentHorizontally: function() {
     var q = j(this),
      s = q.data(d),
      r = s.opt,
      p = j("#mCSB_" + s.idx + "_container");
     if (r.advanced.autoExpandHorizontalScroll && r.axis !== "y") {
      p.css({
       position: "absolute",
       width: "auto"
      }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
       width: (Math.ceil(p[0].getBoundingClientRect().right + 0.4) - Math.floor(p[0].getBoundingClientRect().left)),
       position: "relative"
      }).unwrap()
     }
    },
    _scrollButtons: function() {
     var s = j(this),
      u = s.data(d),
      t = u.opt,
      q = j(".mCSB_" + u.idx + "_scrollbar:first"),
      r = ["<a href='#' class='mCSB_buttonUp' oncontextmenu='return false;' />", "<a href='#' class='mCSB_buttonDown' oncontextmenu='return false;' />", "<a href='#' class='mCSB_buttonLeft' oncontextmenu='return false;' />", "<a href='#' class='mCSB_buttonRight' oncontextmenu='return false;' />"],
      p = [(t.axis === "x" ? r[2] : r[0]), (t.axis === "x" ? r[3] : r[1]), r[2], r[3]];
     if (t.scrollButtons.enable) {
      q.prepend(p[0]).append(p[1]).next(".mCSB_scrollTools").prepend(p[2]).append(p[3])
     }
    },
    _maxHeight: function() {
     var t = j(this),
      w = t.data(d),
      v = w.opt,
      r = j("#mCSB_" + w.idx),
      q = t.css("max-height"),
      s = q.indexOf("%") !== -1,
      p = t.css("box-sizing");
     if (q !== "none") {
      var u = s ? t.parent().height() * parseInt(q) / 100 : parseInt(q);
      if (p === "border-box") {
       u -= ((t.innerHeight() - t.height()) + (t.outerHeight() - t.innerHeight()))
      }
      r.css("max-height", Math.round(u))
     }
    },
    _setDraggerLength: function() {
     var u = j(this),
      s = u.data(d),
      p = j("#mCSB_" + s.idx),
      v = j("#mCSB_" + s.idx + "_container"),
      y = [j("#mCSB_" + s.idx + "_dragger_vertical"), j("#mCSB_" + s.idx + "_dragger_horizontal")],
      t = [p.height() / v.outerHeight(false), p.width() / v.outerWidth(false)],
      q = [parseInt(y[0].css("min-height")), Math.round(t[0] * y[0].parent().height()), parseInt(y[1].css("min-width")), Math.round(t[1] * y[1].parent().width())],
      r = k && (q[1] < q[0]) ? q[0] : q[1],
      x = k && (q[3] < q[2]) ? q[2] : q[3];
     y[0].css({
      height: r,
      "max-height": (y[0].parent().height() - 10)
     }).find(".mCSB_dragger_bar").css({
      "line-height": q[0] + "px"
     });
     y[1].css({
      width: x,
      "max-width": (y[1].parent().width() - 10)
     })
    },
    _scrollRatio: function() {
     var t = j(this),
      v = t.data(d),
      q = j("#mCSB_" + v.idx),
      r = j("#mCSB_" + v.idx + "_container"),
      s = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")],
      u = [r.outerHeight(false) - q.height(), r.outerWidth(false) - q.width()],
      p = [u[0] / (s[0].parent().height() - s[0].height()), u[1] / (s[1].parent().width() - s[1].width())];
     v.scrollRatio = {
      y: p[0],
      x: p[1]
     }
    },
    _onDragClasses: function(r, t, q) {
     var s = q ? "mCSB_dragger_onDrag_expanded" : "",
      p = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag"],
      u = r.closest(".mCSB_scrollTools");
     if (t === "active") {
      r.toggleClass(p[0] + " " + s);
      u.toggleClass(p[1]);
      r[0]._draggable = r[0]._draggable ? 0 : 1
     } else {
      if (!r[0]._draggable) {
       if (t === "hide") {
        r.removeClass(p[0]);
        u.removeClass(p[1])
       } else {
        r.addClass(p[0]);
        u.addClass(p[1])
       }
      }
     }
    },
    _overflowed: function() {
     var t = j(this),
      u = t.data(d),
      q = j("#mCSB_" + u.idx),
      s = j("#mCSB_" + u.idx + "_container"),
      r = u.overflowed == null ? s.height() : s.outerHeight(false),
      p = u.overflowed == null ? s.width() : s.outerWidth(false);
     return [r > q.height(), p > q.width()]
    },
    _resetContentPosition: function() {
     var t = j(this),
      v = t.data(d),
      u = v.opt,
      q = j("#mCSB_" + v.idx),
      r = j("#mCSB_" + v.idx + "_container"),
      s = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")];
     i._stop(t);
     if ((u.axis !== "x" && !v.overflowed[0]) || (u.axis === "y" && v.overflowed[0])) {
      s[0].add(r).css("top", 0)
     }
     if ((u.axis !== "y" && !v.overflowed[1]) || (u.axis === "x" && v.overflowed[1])) {
      var p = dx = 0;
      if (v.langDir === "rtl") {
       p = q.width() - r.outerWidth(false);
       dx = Math.abs(p / v.scrollRatio.x)
      }
      r.css("left", p);
      s[1].css("left", dx)
     }
    },
    _bindEvents: function() {
     var r = j(this),
      t = r.data(d),
      s = t.opt;
     if (!t.bindEvents) {
      i._draggable.call(this);
      if (s.contentTouchScroll) {
       i._contentDraggable.call(this)
      }
      if (s.mouseWheel.enable) {
       function q() {
        p = setTimeout(function() {
         if (!j.event.special.mousewheel) {
          q()
         } else {
          clearTimeout(p);
          i._mousewheel.call(r[0])
         }
        }, 1000)
       }
       var p;
       q()
      }
      i._draggerRail.call(this);
      i._wrapperScroll.call(this);
      if (s.advanced.autoScrollOnFocus) {
       i._focus.call(this)
      }
      if (s.scrollButtons.enable) {
       i._buttons.call(this)
      }
      if (s.keyboard.enable) {
       i._keyboard.call(this)
      }
      t.bindEvents = true
     }
    },
    _unbindEvents: function() {
     var s = j(this),
      t = s.data(d),
      p = d + "_" + t.idx,
      u = ".mCSB_" + t.idx + "_scrollbar",
      r = j("#mCSB_" + t.idx + ",#mCSB_" + t.idx + "_container,#mCSB_" + t.idx + "_container_wrapper," + u + " .mCSB_draggerContainer,#mCSB_" + t.idx + "_dragger_vertical,#mCSB_" + t.idx + "_dragger_horizontal," + u + ">a"),
      q = j("#mCSB_" + t.idx + "_container");
     if (t.bindEvents) {
      j(a).unbind("." + p);
      r.each(function() {
       j(this).unbind("." + p)
      });
      clearTimeout(s[0]._focusTimeout);
      i._delete.call(null, s[0]._focusTimeout);
      clearTimeout(t.sequential.step);
      i._delete.call(null, t.sequential.step);
      clearTimeout(q[0].onCompleteTimeout);
      i._delete.call(null, q[0].onCompleteTimeout);
      t.bindEvents = false
     }
    },
    _scrollbarVisibility: function(q) {
     var t = j(this),
      v = t.data(d),
      u = v.opt,
      p = j("#mCSB_" + v.idx + "_container_wrapper"),
      r = p.length ? p : j("#mCSB_" + v.idx + "_container"),
      w = [j("#mCSB_" + v.idx + "_scrollbar_vertical"), j("#mCSB_" + v.idx + "_scrollbar_horizontal")],
      s = [w[0].find(".mCSB_dragger"), w[1].find(".mCSB_dragger")];
     if (u.axis !== "x") {
      if (v.overflowed[0] && !q) {
       w[0].add(s[0]).add(w[0].children("a")).css("display", "block");
       r.removeClass("mCS_no_scrollbar_y mCS_y_hidden")
      } else {
       if (u.alwaysShowScrollbar) {
        if (u.alwaysShowScrollbar !== 2) {
         s[0].add(w[0].children("a")).css("display", "none")
        }
        r.removeClass("mCS_y_hidden")
       } else {
        w[0].css("display", "none");
        r.addClass("mCS_y_hidden")
       }
       r.addClass("mCS_no_scrollbar_y")
      }
     }
     if (u.axis !== "y") {
      if (v.overflowed[1] && !q) {
       w[1].add(s[1]).add(w[1].children("a")).css("display", "block");
       r.removeClass("mCS_no_scrollbar_x mCS_x_hidden")
      } else {
       if (u.alwaysShowScrollbar) {
        if (u.alwaysShowScrollbar !== 2) {
         s[1].add(w[1].children("a")).css("display", "none")
        }
        r.removeClass("mCS_x_hidden")
       } else {
        w[1].css("display", "none");
        r.addClass("mCS_x_hidden")
       }
       r.addClass("mCS_no_scrollbar_x")
      }
     }
     if (!v.overflowed[0] && !v.overflowed[1]) {
      t.addClass("mCS_no_scrollbar")
     } else {
      t.removeClass("mCS_no_scrollbar")
     }
    },
    _coordinates: function(q) {
     var p = q.type;
     switch (p) {
      case "pointerdown":
      case "MSPointerDown":
      case "pointermove":
      case "MSPointerMove":
      case "pointerup":
      case "MSPointerUp":
       return [q.originalEvent.pageY, q.originalEvent.pageX];
       break;
      case "touchstart":
      case "touchmove":
      case "touchend":
       var r = q.originalEvent.touches[0] || q.originalEvent.changedTouches[0];
       return [r.pageY, r.pageX];
       break;
      default:
       return [q.pageY, q.pageX]
     }
    },
    _draggable: function() {
     var u = j(this),
      s = u.data(d),
      p = s.opt,
      r = d + "_" + s.idx,
      t = ["mCSB_" + s.idx + "_dragger_vertical", "mCSB_" + s.idx + "_dragger_horizontal"],
      v = j("#mCSB_" + s.idx + "_container"),
      w = j("#" + t[0] + ",#" + t[1]),
      A, y, z;
     w.bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r, function(E) {
      E.stopImmediatePropagation();
      E.preventDefault();
      if (!i._mouseBtnLeft(E)) {
       return
      }
      n = true;
      if (k) {
       a.onselectstart = function() {
        return false
       }
      }
      x(false);
      i._stop(u);
      A = j(this);
      var F = A.offset(),
       G = i._coordinates(E)[0] - F.top,
       B = i._coordinates(E)[1] - F.left,
       D = A.height() + F.top,
       C = A.width() + F.left;
      if (G < D && G > 0 && B < C && B > 0) {
       y = G;
       z = B
      }
      i._onDragClasses(A, "active", p.autoExpandScrollbar)
     }).bind("touchmove." + r, function(C) {
      C.stopImmediatePropagation();
      C.preventDefault();
      var D = A.offset(),
       E = i._coordinates(C)[0] - D.top,
       B = i._coordinates(C)[1] - D.left;
      q(y, z, E, B)
     });
     j(a).bind("mousemove." + r + " pointermove." + r + " MSPointerMove." + r, function(C) {
      if (A) {
       var D = A.offset(),
        E = i._coordinates(C)[0] - D.top,
        B = i._coordinates(C)[1] - D.left;
       if (y === E) {
        return
       }
       q(y, z, E, B)
      }
     }).add(w).bind("mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r, function(B) {
      if (A) {
       i._onDragClasses(A, "active", p.autoExpandScrollbar);
       A = null
      }
      n = false;
      if (k) {
       a.onselectstart = null
      }
      x(true)
     });

     function x(B) {
      var C = v.find("iframe");
      if (!C.length) {
       return
      }
      var D = !B ? "none" : "auto";
      C.css("pointer-events", D)
     }

     function q(D, E, G, B) {
      v[0].idleTimer = p.scrollInertia < 233 ? 250 : 0;
      if (A.attr("id") === t[1]) {
       var C = "x",
        F = ((A[0].offsetLeft - E) + B) * s.scrollRatio.x
      } else {
       var C = "y",
        F = ((A[0].offsetTop - D) + G) * s.scrollRatio.y
      }
      i._scrollTo(u, F.toString(), {
       dir: C,
       drag: true
      })
     }
    },
    _contentDraggable: function() {
     var y = j(this),
      K = y.data(d),
      I = K.opt,
      F = d + "_" + K.idx,
      v = j("#mCSB_" + K.idx),
      z = j("#mCSB_" + K.idx + "_container"),
      w = [j("#mCSB_" + K.idx + "_dragger_vertical"), j("#mCSB_" + K.idx + "_dragger_horizontal")],
      E, G, L, M, C = [],
      D = [],
      H, A, u, t, J, x, r = 0,
      q, s = I.axis === "yx" ? "none" : "all";
     z.bind("touchstart." + F + " pointerdown." + F + " MSPointerDown." + F, function(N) {
      if (!i._pointerTouch(N) || n) {
       return
      }
      var O = z.offset();
      E = i._coordinates(N)[0] - O.top;
      G = i._coordinates(N)[1] - O.left
     }).bind("touchmove." + F + " pointermove." + F + " MSPointerMove." + F, function(Q) {
      if (!i._pointerTouch(Q) || n) {
       return
      }
      Q.stopImmediatePropagation();
      A = i._getTime();
      var P = v.offset(),
       S = i._coordinates(Q)[0] - P.top,
       U = i._coordinates(Q)[1] - P.left,
       R = "mcsLinearOut";
      C.push(S);
      D.push(U);
      if (K.overflowed[0]) {
       var O = w[0].parent().height() - w[0].height(),
        T = ((E - S) > 0 && (S - E) > -(O * K.scrollRatio.y))
      }
      if (K.overflowed[1]) {
       var N = w[1].parent().width() - w[1].width(),
        V = ((G - U) > 0 && (U - G) > -(N * K.scrollRatio.x))
      }
      if (T || V) {
       Q.preventDefault()
      }
      x = I.axis === "yx" ? [(E - S), (G - U)] : I.axis === "x" ? [null, (G - U)] : [(E - S), null];
      z[0].idleTimer = 250;
      if (K.overflowed[0]) {
       B(x[0], r, R, "y", "all", true)
      }
      if (K.overflowed[1]) {
       B(x[1], r, R, "x", s, true)
      }
     });
     v.bind("touchstart." + F + " pointerdown." + F + " MSPointerDown." + F, function(N) {
      if (!i._pointerTouch(N) || n) {
       return
      }
      N.stopImmediatePropagation();
      i._stop(y);
      H = i._getTime();
      var O = v.offset();
      L = i._coordinates(N)[0] - O.top;
      M = i._coordinates(N)[1] - O.left;
      C = [];
      D = []
     }).bind("touchend." + F + " pointerup." + F + " MSPointerUp." + F, function(P) {
      if (!i._pointerTouch(P) || n) {
       return
      }
      P.stopImmediatePropagation();
      u = i._getTime();
      var N = v.offset(),
       T = i._coordinates(P)[0] - N.top,
       V = i._coordinates(P)[1] - N.left;
      if ((u - A) > 30) {
       return
      }
      J = 1000 / (u - H);
      var Q = "mcsEaseOut",
       R = J < 2.5,
       W = R ? [C[C.length - 2], D[D.length - 2]] : [0, 0];
      t = R ? [(T - W[0]), (V - W[1])] : [T - L, V - M];
      var O = [Math.abs(t[0]), Math.abs(t[1])];
      J = R ? [Math.abs(t[0] / 4), Math.abs(t[1] / 4)] : [J, J];
      var U = [Math.abs(z[0].offsetTop) - (t[0] * p((O[0] / J[0]), J[0])), Math.abs(z[0].offsetLeft) - (t[1] * p((O[1] / J[1]), J[1]))];
      x = I.axis === "yx" ? [U[0], U[1]] : I.axis === "x" ? [null, U[1]] : [U[0], null];
      q = [(O[0] * 4) + I.scrollInertia, (O[1] * 4) + I.scrollInertia];
      var S = parseInt(I.contentTouchScroll) || 0;
      x[0] = O[0] > S ? x[0] : 0;
      x[1] = O[1] > S ? x[1] : 0;
      if (K.overflowed[0]) {
       B(x[0], q[0], Q, "y", s, false)
      }
      if (K.overflowed[1]) {
       B(x[1], q[1], Q, "x", s, false)
      }
     });

     function p(P, N) {
      var O = [N * 1.5, N * 2, N / 1.5, N / 2];
      if (P > 90) {
       return N > 4 ? O[0] : O[3]
      } else {
       if (P > 60) {
        return N > 3 ? O[3] : O[2]
       } else {
        if (P > 30) {
         return N > 8 ? O[1] : N > 6 ? O[0] : N > 4 ? N : O[2]
        } else {
         return N > 8 ? N : O[3]
        }
       }
      }
     }

     function B(P, R, S, O, N, Q) {
      if (!P) {
       return
      }
      i._scrollTo(y, P.toString(), {
       dur: R,
       scrollEasing: S,
       dir: O,
       overwrite: N,
       drag: Q
      })
     }
    },
    _mousewheel: function() {
     var s = j(this),
      u = s.data(d);
     if (u) {
      var t = u.opt,
       q = d + "_" + u.idx,
       p = j("#mCSB_" + u.idx),
       r = [j("#mCSB_" + u.idx + "_dragger_vertical"), j("#mCSB_" + u.idx + "_dragger_horizontal")];
      p.bind("mousewheel." + q, function(z, D) {
       i._stop(s);
       if (i._disableMousewheel(s, z.target)) {
        return
       }
       var B = t.mouseWheel.deltaFactor !== "auto" ? parseInt(t.mouseWheel.deltaFactor) : (k && z.deltaFactor < 100) ? 100 : z.deltaFactor < 40 ? 40 : z.deltaFactor || 100;
       if (t.axis === "x" || t.mouseWheel.axis === "x") {
        var w = "x",
         C = [Math.round(B * u.scrollRatio.x), parseInt(t.mouseWheel.scrollAmount)],
         y = t.mouseWheel.scrollAmount !== "auto" ? C[1] : C[0] >= p.width() ? p.width() * 0.9 : C[0],
         E = Math.abs(j("#mCSB_" + u.idx + "_container")[0].offsetLeft),
         A = r[1][0].offsetLeft,
         x = r[1].parent().width() - r[1].width(),
         v = z.deltaX || z.deltaY || D
       } else {
        var w = "y",
         C = [Math.round(B * u.scrollRatio.y), parseInt(t.mouseWheel.scrollAmount)],
         y = t.mouseWheel.scrollAmount !== "auto" ? C[1] : C[0] >= p.height() ? p.height() * 0.9 : C[0],
         E = Math.abs(j("#mCSB_" + u.idx + "_container")[0].offsetTop),
         A = r[0][0].offsetTop,
         x = r[0].parent().height() - r[0].height(),
         v = z.deltaY || D
       }
       if ((w === "y" && !u.overflowed[0]) || (w === "x" && !u.overflowed[1])) {
        return
       }
       if (t.mouseWheel.invert) {
        v = -v
       }
       if (t.mouseWheel.normalizeDelta) {
        v = v < 0 ? -1 : 1
       }
       if ((v > 0 && A !== 0) || (v < 0 && A !== x) || t.mouseWheel.preventDefault) {
        z.stopImmediatePropagation();
        z.preventDefault()
       }
       i._scrollTo(s, (E - (v * y)).toString(), {
        dir: w
       })
      })
     }
    },
    _disableMousewheel: function(r, t) {
     var p = t.nodeName.toLowerCase(),
      q = r.data(d).opt.mouseWheel.disableOver,
      s = ["select", "textarea"];
     return j.inArray(p, q) > -1 && !(j.inArray(p, s) > -1 && !j(t).is(":focus"))
    },
    _draggerRail: function() {
     var s = j(this),
      t = s.data(d),
      q = d + "_" + t.idx,
      r = j("#mCSB_" + t.idx + "_container"),
      u = r.parent(),
      p = j(".mCSB_" + t.idx + "_scrollbar .mCSB_draggerContainer");
     p.bind("touchstart." + q + " pointerdown." + q + " MSPointerDown." + q, function(v) {
      n = true
     }).bind("touchend." + q + " pointerup." + q + " MSPointerUp." + q, function(v) {
      n = false
     }).bind("click." + q, function(z) {
      if (j(z.target).hasClass("mCSB_draggerContainer") || j(z.target).hasClass("mCSB_draggerRail")) {
       i._stop(s);
       var w = j(this),
        y = w.find(".mCSB_dragger");
       if (w.parent(".mCSB_scrollTools_horizontal").length > 0) {
        if (!t.overflowed[1]) {
         return
        }
        var v = "x",
         x = z.pageX > y.offset().left ? -1 : 1,
         A = Math.abs(r[0].offsetLeft) - (x * (u.width() * 0.9))
       } else {
        if (!t.overflowed[0]) {
         return
        }
        var v = "y",
         x = z.pageY > y.offset().top ? -1 : 1,
         A = Math.abs(r[0].offsetTop) - (x * (u.height() * 0.9))
       }
       i._scrollTo(s, A.toString(), {
        dir: v,
        scrollEasing: "mcsEaseInOut"
       })
      }
     })
    },
    _focus: function() {
     var r = j(this),
      t = r.data(d),
      s = t.opt,
      p = d + "_" + t.idx,
      q = j("#mCSB_" + t.idx + "_container"),
      u = q.parent();
     q.bind("focusin." + p, function(x) {
      var w = j(a.activeElement),
       y = q.find(".mCustomScrollBox").length,
       v = 0;
      if (!w.is(s.advanced.autoScrollOnFocus)) {
       return
      }
      i._stop(r);
      clearTimeout(r[0]._focusTimeout);
      r[0]._focusTimer = y ? (v + 17) * y : 0;
      r[0]._focusTimeout = setTimeout(function() {
       var C = [w.offset().top - q.offset().top, w.offset().left - q.offset().left],
        B = [q[0].offsetTop, q[0].offsetLeft],
        z = [(B[0] + C[0] >= 0 && B[0] + C[0] < u.height() - w.outerHeight(false)), (B[1] + C[1] >= 0 && B[0] + C[1] < u.width() - w.outerWidth(false))],
        A = (s.axis === "yx" && !z[0] && !z[1]) ? "none" : "all";
       if (s.axis !== "x" && !z[0]) {
        i._scrollTo(r, C[0].toString(), {
         dir: "y",
         scrollEasing: "mcsEaseInOut",
         overwrite: A,
         dur: v
        })
       }
       if (s.axis !== "y" && !z[1]) {
        i._scrollTo(r, C[1].toString(), {
         dir: "x",
         scrollEasing: "mcsEaseInOut",
         overwrite: A,
         dur: v
        })
       }
      }, r[0]._focusTimer)
     })
    },
    _wrapperScroll: function() {
     var q = j(this),
      r = q.data(d),
      p = d + "_" + r.idx,
      s = j("#mCSB_" + r.idx + "_container").parent();
     s.bind("scroll." + p, function(t) {
      s.scrollTop(0).scrollLeft(0)
     })
    },
    _buttons: function() {
     var u = j(this),
      w = u.data(d),
      v = w.opt,
      p = w.sequential,
      r = d + "_" + w.idx,
      t = j("#mCSB_" + w.idx + "_container"),
      s = ".mCSB_" + w.idx + "_scrollbar",
      q = j(s + ">a");
     q.bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r + " mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r + " mouseout." + r + " pointerout." + r + " MSPointerOut." + r + " click." + r, function(z) {
      z.preventDefault();
      if (!i._mouseBtnLeft(z)) {
       return
      }
      var y = j(this).attr("class");
      p.type = v.scrollButtons.scrollType;
      switch (z.type) {
       case "mousedown":
       case "touchstart":
       case "pointerdown":
       case "MSPointerDown":
        if (p.type === "stepped") {
         return
        }
        n = true;
        w.tweenRunning = false;
        x("on", y);
        break;
       case "mouseup":
       case "touchend":
       case "pointerup":
       case "MSPointerUp":
       case "mouseout":
       case "pointerout":
       case "MSPointerOut":
        if (p.type === "stepped") {
         return
        }
        n = false;
        if (p.dir) {
         x("off", y)
        }
        break;
       case "click":
        if (p.type !== "stepped" || w.tweenRunning) {
         return
        }
        x("on", y);
        break
      }

      function x(A, B) {
       p.scrollAmount = v.snapAmount || v.scrollButtons.scrollAmount;
       i._sequentialScroll.call(this, u, A, B)
      }
     })
    },
    _keyboard: function() {
     var u = j(this),
      t = u.data(d),
      q = t.opt,
      x = t.sequential,
      s = d + "_" + t.idx,
      r = j("#mCSB_" + t.idx),
      w = j("#mCSB_" + t.idx + "_container"),
      p = w.parent(),
      v = "input,textarea,select,datalist,keygen,[contenteditable='true']";
     r.attr("tabindex", "0").bind("blur." + s + " keydown." + s + " keyup." + s, function(D) {
      switch (D.type) {
       case "blur":
        if (t.tweenRunning && x.dir) {
         y("off", null)
        }
        break;
       case "keydown":
       case "keyup":
        var A = D.keyCode ? D.keyCode : D.which,
         B = "on";
        if ((q.axis !== "x" && (A === 38 || A === 40)) || (q.axis !== "y" && (A === 37 || A === 39))) {
         if (((A === 38 || A === 40) && !t.overflowed[0]) || ((A === 37 || A === 39) && !t.overflowed[1])) {
          return
         }
         if (D.type === "keyup") {
          B = "off"
         }
         if (!j(a.activeElement).is(v)) {
          D.preventDefault();
          D.stopImmediatePropagation();
          y(B, A)
         }
        } else {
         if (A === 33 || A === 34) {
          if (t.overflowed[0] || t.overflowed[1]) {
           D.preventDefault();
           D.stopImmediatePropagation()
          }
          if (D.type === "keyup") {
           i._stop(u);
           var C = A === 34 ? -1 : 1;
           if (q.axis === "x" || (q.axis === "yx" && t.overflowed[1] && !t.overflowed[0])) {
            var z = "x",
             E = Math.abs(w[0].offsetLeft) - (C * (p.width() * 0.9))
           } else {
            var z = "y",
             E = Math.abs(w[0].offsetTop) - (C * (p.height() * 0.9))
           }
           i._scrollTo(u, E.toString(), {
            dir: z,
            scrollEasing: "mcsEaseInOut"
           })
          }
         } else {
          if (A === 35 || A === 36) {
           if (!j(a.activeElement).is(v)) {
            if (t.overflowed[0] || t.overflowed[1]) {
             D.preventDefault();
             D.stopImmediatePropagation()
            }
            if (D.type === "keyup") {
             if (q.axis === "x" || (q.axis === "yx" && t.overflowed[1] && !t.overflowed[0])) {
              var z = "x",
               E = A === 35 ? Math.abs(p.width() - w.outerWidth(false)) : 0
             } else {
              var z = "y",
               E = A === 35 ? Math.abs(p.height() - w.outerHeight(false)) : 0
             }
             i._scrollTo(u, E.toString(), {
              dir: z,
              scrollEasing: "mcsEaseInOut"
             })
            }
           }
          }
         }
        }
        break
      }

      function y(F, G) {
       x.type = q.keyboard.scrollType;
       x.scrollAmount = q.snapAmount || q.keyboard.scrollAmount;
       if (x.type === "stepped" && t.tweenRunning) {
        return
       }
       i._sequentialScroll.call(this, u, F, G)
      }
     })
    },
    _sequentialScroll: function(r, u, s) {
     var w = r.data(d),
      q = w.opt,
      y = w.sequential,
      x = j("#mCSB_" + w.idx + "_container"),
      p = y.type === "stepped" ? true : false;
     switch (u) {
      case "on":
       y.dir = [(s === "mCSB_buttonRight" || s === "mCSB_buttonLeft" || s === 39 || s === 37 ? "x" : "y"), (s === "mCSB_buttonUp" || s === "mCSB_buttonLeft" || s === 38 || s === 37 ? -1 : 1)];
       i._stop(r);
       if (i._isNumeric(s) && y.type === "stepped") {
        return
       }
       t(p);
       break;
      case "off":
       v();
       if (p || (w.tweenRunning && y.dir)) {
        t(true)
       }
       break
     }

     function t(z) {
      var F = y.type !== "stepped",
       J = !z ? 1000 / 60 : F ? q.scrollInertia / 1.5 : q.scrollInertia,
       B = !z ? 2.5 : F ? 7.5 : 40,
       I = [Math.abs(x[0].offsetTop), Math.abs(x[0].offsetLeft)],
       E = [w.scrollRatio.y > 10 ? 10 : w.scrollRatio.y, w.scrollRatio.x > 10 ? 10 : w.scrollRatio.x],
       C = y.dir[0] === "x" ? I[1] + (y.dir[1] * (E[1] * B)) : I[0] + (y.dir[1] * (E[0] * B)),
       H = y.dir[0] === "x" ? I[1] + (y.dir[1] * parseInt(y.scrollAmount)) : I[0] + (y.dir[1] * parseInt(y.scrollAmount)),
       G = y.scrollAmount !== "auto" ? H : C,
       D = !z ? "mcsLinear" : F ? "mcsLinearOut" : "mcsEaseInOut",
       A = !z ? false : true;
      if (z && J < 17) {
       G = y.dir[0] === "x" ? I[1] : I[0]
      }
      i._scrollTo(r, G.toString(), {
       dir: y.dir[0],
       scrollEasing: D,
       dur: J,
       onComplete: A
      });
      if (z) {
       y.dir = false;
       return
      }
      clearTimeout(y.step);
      y.step = setTimeout(function() {
       t()
      }, J)
     }

     function v() {
      clearTimeout(y.step);
      i._stop(r)
     }
    },
    _arr: function(r) {
     var q = j(this).data(d).opt,
      p = [];
     if (typeof r === "function") {
      r = r()
     }
     if (!(r instanceof Array)) {
      p[0] = r.y ? r.y : r.x || q.axis === "x" ? null : r;
      p[1] = r.x ? r.x : r.y || q.axis === "y" ? null : r
     } else {
      p = r.length > 1 ? [r[0], r[1]] : q.axis === "x" ? [null, r[0]] : [r[0], null]
     }
     if (typeof p[0] === "function") {
      p[0] = p[0]()
     }
     if (typeof p[1] === "function") {
      p[1] = p[1]()
     }
     return p
    },
    _to: function(v, w) {
     if (v == null || typeof v == "undefined") {
      return
     }
     var C = j(this),
      B = C.data(d),
      u = B.opt,
      D = j("#mCSB_" + B.idx + "_container"),
      r = D.parent(),
      F = typeof v;
     if (!w) {
      w = u.axis === "x" ? "x" : "y"
     }
     var q = w === "x" ? D.outerWidth(false) : D.outerHeight(false),
      x = w === "x" ? D.offset().left : D.offset().top,
      E = w === "x" ? D[0].offsetLeft : D[0].offsetTop,
      z = w === "x" ? "left" : "top";
     switch (F) {
      case "function":
       return v();
       break;
      case "object":
       if (v.nodeType) {
        var A = w === "x" ? j(v).offset().left : j(v).offset().top
       } else {
        if (v.jquery) {
         if (!v.length) {
          return
         }
         var A = w === "x" ? v.offset().left : v.offset().top
        }
       }
       return A - x;
       break;
      case "string":
      case "number":
       if (i._isNumeric.call(null, v)) {
        return Math.abs(v)
       } else {
        if (v.indexOf("%") !== -1) {
         return Math.abs(q * parseInt(v) / 100)
        } else {
         if (v.indexOf("-=") !== -1) {
          return Math.abs(E - parseInt(v.split("-=")[1]))
         } else {
          if (v.indexOf("+=") !== -1) {
           var s = (E + parseInt(v.split("+=")[1]));
           return s >= 0 ? 0 : Math.abs(s)
          } else {
           if (v.indexOf("px") !== -1 && i._isNumeric.call(null, v.split("px")[0])) {
            return Math.abs(v.split("px")[0])
           } else {
            if (v === "top" || v === "left") {
             return 0
            } else {
             if (v === "bottom") {
              return Math.abs(r.height() - D.outerHeight(false))
             } else {
              if (v === "right") {
               return Math.abs(r.width() - D.outerWidth(false))
              } else {
               if (v === "first" || v === "last") {
                var y = D.find(":" + v),
                 A = w === "x" ? j(y).offset().left : j(y).offset().top;
                return A - x
               } else {
                if (j(v).length) {
                 var A = w === "x" ? j(v).offset().left : j(v).offset().top;
                 return A - x
                } else {
                 D.css(z, v);
                 e.update.call(null, C[0]);
                 return
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
       break
     }
    },
    _autoUpdate: function(q) {
     var t = j(this),
      F = t.data(d),
      z = F.opt,
      v = j("#mCSB_" + F.idx + "_container");
     if (q) {
      clearTimeout(v[0].autoUpdate);
      i._delete.call(null, v[0].autoUpdate);
      return
     }
     var s = v.parent(),
      p = [j("#mCSB_" + F.idx + "_scrollbar_vertical"), j("#mCSB_" + F.idx + "_scrollbar_horizontal")],
      D = function() {
       return [p[0].is(":visible") ? p[0].outerHeight(true) : 0, p[1].is(":visible") ? p[1].outerWidth(true) : 0]
      },
      E = y(),
      x, u = [v.outerHeight(false), v.outerWidth(false), s.height(), s.width(), D()[0], D()[1]],
      H, B = G(),
      w;
     C();

     function C() {
      clearTimeout(v[0].autoUpdate);
      v[0].autoUpdate = setTimeout(function() {
       if (z.advanced.updateOnSelectorChange) {
        x = y();
        if (x !== E) {
         r();
         E = x;
         return
        }
       }
       if (z.advanced.updateOnContentResize) {
        H = [v.outerHeight(false), v.outerWidth(false), s.height(), s.width(), D()[0], D()[1]];
        if (H[0] !== u[0] || H[1] !== u[1] || H[2] !== u[2] || H[3] !== u[3] || H[4] !== u[4] || H[5] !== u[5]) {
         r();
         u = H
        }
       }
       if (z.advanced.updateOnImageLoad) {
        w = G();
        if (w !== B) {
         v.find("img").each(function() {
          A(this.src)
         });
         B = w
        }
       }
       if (z.advanced.updateOnSelectorChange || z.advanced.updateOnContentResize || z.advanced.updateOnImageLoad) {
        C()
       }
      }, 60)
     }

     function G() {
      var I = 0;
      if (z.advanced.updateOnImageLoad) {
       I = v.find("img").length
      }
      return I
     }

     function A(L) {
      var I = new Image();

      function K(M, N) {
       return function() {
        return N.apply(M, arguments)
       }
      }

      function J() {
       this.onload = null;
       r()
      }
      I.onload = K(I, J);
      I.src = L
     }

     function y() {
      if (z.advanced.updateOnSelectorChange === true) {
       z.advanced.updateOnSelectorChange = "*"
      }
      var I = 0,
       J = v.find(z.advanced.updateOnSelectorChange);
      if (z.advanced.updateOnSelectorChange && J.length > 0) {
       J.each(function() {
        I += j(this).height() + j(this).width()
       })
      }
      return I
     }

     function r() {
      clearTimeout(v[0].autoUpdate);
      e.update.call(null, t[0])
     }
    },
    _snapAmount: function(r, p, q) {
     return (Math.round(r / p) * p - q)
    },
    _stop: function(p) {
     var r = p.data(d),
      q = j("#mCSB_" + r.idx + "_container,#mCSB_" + r.idx + "_container_wrapper,#mCSB_" + r.idx + "_dragger_vertical,#mCSB_" + r.idx + "_dragger_horizontal");
     q.each(function() {
      i._stopTween.call(this)
     })
    },
    _scrollTo: function(q, s, u) {
     var I = q.data(d),
      E = I.opt,
      D = {
       trigger: "internal",
       dir: "y",
       scrollEasing: "mcsEaseOut",
       drag: false,
       dur: E.scrollInertia,
       overwrite: "all",
       callbacks: true,
       onStart: true,
       onUpdate: true,
       onComplete: true
      },
      u = j.extend(D, u),
      G = [u.dur, (u.drag ? 0 : u.dur)],
      v = j("#mCSB_" + I.idx),
      B = j("#mCSB_" + I.idx + "_container"),
      K = E.callbacks.onTotalScrollOffset ? i._arr.call(q, E.callbacks.onTotalScrollOffset) : [0, 0],
      p = E.callbacks.onTotalScrollBackOffset ? i._arr.call(q, E.callbacks.onTotalScrollBackOffset) : [0, 0];
     I.trigger = u.trigger;
     if (E.snapAmount) {
      s = i._snapAmount(s, E.snapAmount, E.snapOffset)
     }
     switch (u.dir) {
      case "x":
       var x = j("#mCSB_" + I.idx + "_dragger_horizontal"),
        z = "left",
        C = B[0].offsetLeft,
        H = [v.width() - B.outerWidth(false), x.parent().width() - x.width()],
        r = [s, (s / I.scrollRatio.x)],
        L = K[1],
        J = p[1],
        A = L > 0 ? L / I.scrollRatio.x : 0,
        w = J > 0 ? J / I.scrollRatio.x : 0;
       break;
      case "y":
       var x = j("#mCSB_" + I.idx + "_dragger_vertical"),
        z = "top",
        C = B[0].offsetTop,
        H = [v.height() - B.outerHeight(false), x.parent().height() - x.height()],
        r = [s, (s / I.scrollRatio.y)],
        L = K[0],
        J = p[0],
        A = L > 0 ? L / I.scrollRatio.y : 0,
        w = J > 0 ? J / I.scrollRatio.y : 0;
       break
     }
     if (r[1] < 0) {
      r = [0, 0]
     } else {
      if (r[1] >= H[1]) {
       r = [H[0], H[1]]
      } else {
       r[0] = -r[0]
      }
     }
     clearTimeout(B[0].onCompleteTimeout);
     if (!I.tweenRunning && ((C === 0 && r[0] >= 0) || (C === H[0] && r[0] <= H[0]))) {
      return
     }
     i._tweenTo.call(null, x[0], z, Math.round(r[1]), G[1], u.scrollEasing);
     i._tweenTo.call(null, B[0], z, Math.round(r[0]), G[0], u.scrollEasing, u.overwrite, {
      onStart: function() {
       if (u.callbacks && u.onStart && !I.tweenRunning) {
        if (t("onScrollStart")) {
         F();
         E.callbacks.onScrollStart.call(q[0])
        }
        I.tweenRunning = true;
        i._onDragClasses(x);
        I.cbOffsets = y()
       }
      },
      onUpdate: function() {
       if (u.callbacks && u.onUpdate) {
        if (t("whileScrolling")) {
         F();
         E.callbacks.whileScrolling.call(q[0])
        }
       }
      },
      onComplete: function() {
       if (u.callbacks && u.onComplete) {
        if (E.axis === "yx") {
         clearTimeout(B[0].onCompleteTimeout)
        }
        var M = B[0].idleTimer || 0;
        B[0].onCompleteTimeout = setTimeout(function() {
         if (t("onScroll")) {
          F();
          E.callbacks.onScroll.call(q[0])
         }
         if (t("onTotalScroll") && r[1] >= H[1] - A && I.cbOffsets[0]) {
          F();
          E.callbacks.onTotalScroll.call(q[0])
         }
         if (t("onTotalScrollBack") && r[1] <= w && I.cbOffsets[1]) {
          F();
          E.callbacks.onTotalScrollBack.call(q[0])
         }
         I.tweenRunning = false;
         B[0].idleTimer = 0;
         i._onDragClasses(x, "hide")
        }, M)
       }
      }
     });

     function t(M) {
      return I && E.callbacks[M] && typeof E.callbacks[M] === "function"
     }

     function y() {
      return [E.callbacks.alwaysTriggerOffsets || C >= H[0] + L, E.callbacks.alwaysTriggerOffsets || C <= -J]
     }

     function F() {
      var O = [B[0].offsetTop, B[0].offsetLeft],
       P = [x[0].offsetTop, x[0].offsetLeft],
       M = [B.outerHeight(false), B.outerWidth(false)],
       N = [v.height(), v.width()];
      q[0].mcs = {
       content: B,
       top: O[0],
       left: O[1],
       draggerTop: P[0],
       draggerLeft: P[1],
       topPct: Math.round((100 * Math.abs(O[0])) / (Math.abs(M[0]) - N[0])),
       leftPct: Math.round((100 * Math.abs(O[1])) / (Math.abs(M[1]) - N[1])),
       direction: u.dir
      }
     }
    },
    _tweenTo: function(r, u, s, q, A, t, J) {
     var J = J || {},
      G = J.onStart || function() {},
      B = J.onUpdate || function() {},
      H = J.onComplete || function() {},
      z = i._getTime(),
      x, v = 0,
      D = r.offsetTop,
      E = r.style;
     if (u === "left") {
      D = r.offsetLeft
     }
     var y = s - D;
     r._mcsstop = 0;
     if (t !== "none") {
      C()
     }
     p();

     function I() {
      if (r._mcsstop) {
       return
      }
      if (!v) {
       G.call()
      }
      v = i._getTime() - z;
      F();
      if (v >= r._mcstime) {
       r._mcstime = (v > r._mcstime) ? v + x - (v - r._mcstime) : v + x - 1;
       if (r._mcstime < v + 1) {
        r._mcstime = v + 1
       }
      }
      if (r._mcstime < q) {
       r._mcsid = _request(I)
      } else {
       H.call()
      }
     }

     function F() {
      if (q > 0) {
       r._mcscurrVal = w(r._mcstime, D, y, q, A);
       E[u] = Math.round(r._mcscurrVal) + "px"
      } else {
       E[u] = s + "px"
      }
      B.call()
     }

     function p() {
      x = 1000 / 60;
      r._mcstime = v + x;
      _request = (!b.requestAnimationFrame) ? function(K) {
       F();
       return setTimeout(K, 0.01)
      } : b.requestAnimationFrame;
      r._mcsid = _request(I)
     }

     function C() {
      if (r._mcsid == null) {
       return
      }
      if (!b.requestAnimationFrame) {
       clearTimeout(r._mcsid)
      } else {
       b.cancelAnimationFrame(r._mcsid)
      }
      r._mcsid = null
     }

     function w(M, L, Q, P, N) {
      switch (N) {
       case "linear":
       case "mcsLinear":
        return Q * M / P + L;
        break;
       case "mcsLinearOut":
        M /= P;
        M--;
        return Q * Math.sqrt(1 - M * M) + L;
        break;
       case "easeInOutSmooth":
        M /= P / 2;
        if (M < 1) {
         return Q / 2 * M * M + L
        }
        M--;
        return -Q / 2 * (M * (M - 2) - 1) + L;
        break;
       case "easeInOutStrong":
        M /= P / 2;
        if (M < 1) {
         return Q / 2 * Math.pow(2, 10 * (M - 1)) + L
        }
        M--;
        return Q / 2 * (-Math.pow(2, -10 * M) + 2) + L;
        break;
       case "easeInOut":
       case "mcsEaseInOut":
        M /= P / 2;
        if (M < 1) {
         return Q / 2 * M * M * M + L
        }
        M -= 2;
        return Q / 2 * (M * M * M + 2) + L;
        break;
       case "easeOutSmooth":
        M /= P;
        M--;
        return -Q * (M * M * M * M - 1) + L;
        break;
       case "easeOutStrong":
        return Q * (-Math.pow(2, -10 * M / P) + 1) + L;
        break;
       case "easeOut":
       case "mcsEaseOut":
       default:
        var O = (M /= P) * M,
         K = O * M;
        return L + Q * (0.499999999999997 * K * O + -2.5 * O * O + 5.5 * K + -6.5 * O + 4 * M)
      }
     }
    },
    _getTime: function() {
     if (b.performance && b.performance.now) {
      return b.performance.now()
     } else {
      if (b.performance && b.performance.webkitNow) {
       return b.performance.webkitNow()
      } else {
       if (Date.now) {
        return Date.now()
       } else {
        return new Date().getTime()
       }
      }
     }
    },
    _stopTween: function() {
     var p = this;
     if (p._mcsid == null) {
      return
     }
     if (!b.requestAnimationFrame) {
      clearTimeout(p._mcsid)
     } else {
      b.cancelAnimationFrame(p._mcsid)
     }
     p._mcsid = null;
     p._mcsstop = 1
    },
    _delete: function(r) {
     delete r
    },
    _mouseBtnLeft: function(p) {
     return !(p.which && p.which !== 1)
    },
    _pointerTouch: function(q) {
     var p = q.originalEvent.pointerType;
     return !(p && p !== "touch" && p !== 2)
    },
    _isNumeric: function(p) {
     return !isNaN(parseFloat(p)) && isFinite(p)
    }
   };
  j.fn[g] = function(p) {
   if (e[p]) {
    return e[p].apply(this, Array.prototype.slice.call(arguments, 1))
   } else {
    if (typeof p === "object" || !p) {
     return e.init.apply(this, arguments)
    } else {
     j.error("Method " + p + " does not exist")
    }
   }
  };
  j[g] = function(p) {
   if (e[p]) {
    return e[p].apply(this, Array.prototype.slice.call(arguments, 1))
   } else {
    if (typeof p === "object" || !p) {
     return e.init.apply(this, arguments)
    } else {
     j.error("Method " + p + " does not exist")
    }
   }
  };
  j[g].defaults = h;
  b[g] = true;
  j(b).load(function() {
   j(m)[g]()
  })
 }))
}(window, document));

/* == Swiper 2.6.1 == Licensed under GPL & MIT */
var Swiper = function(a, b) {
 "use strict";

 function c(a, b) {
  return document.querySelectorAll ? (b || document).querySelectorAll(a) : jQuery(a, b)
 }

 function d(a) {
  return "[object Array]" === Object.prototype.toString.apply(a) ? !0 : !1
 }

 function e() {
  var a = G - J;
  return b.freeMode && (a = G - J), b.slidesPerView > D.slides.length && !b.centeredSlides && (a = 0), 0 > a && (a = 0), a
 }

 function f() {
  function a(a) {
   var c, d, e = function() {
    "undefined" != typeof D && null !== D && (void 0 !== D.imagesLoaded && D.imagesLoaded++, D.imagesLoaded === D.imagesToLoad.length && (D.reInit(), b.onImagesReady && D.fireCallback(b.onImagesReady, D)))
   };
   a.complete ? e() : (d = a.currentSrc || a.getAttribute("src"), d ? (c = new Image, c.onload = e, c.onerror = e, c.src = d) : e())
  }
  var d = D.h.addEventListener,
   e = "wrapper" === b.eventTarget ? D.wrapper : D.container;
  if (D.browser.ie10 || D.browser.ie11 ? (d(e, D.touchEvents.touchStart, p), d(document, D.touchEvents.touchMove, q), d(document, D.touchEvents.touchEnd, r)) : (D.support.touch && (d(e, "touchstart", p), d(e, "touchmove", q), d(e, "touchend", r)), b.simulateTouch && (d(e, "mousedown", p), d(document, "mousemove", q), d(document, "mouseup", r))), b.autoResize && d(window, "resize", D.resizeFix), g(), D._wheelEvent = !1, b.mousewheelControl) {
   if (void 0 !== document.onmousewheel && (D._wheelEvent = "mousewheel"), !D._wheelEvent) try {
    new WheelEvent("wheel"), D._wheelEvent = "wheel"
   } catch (f) {}
   D._wheelEvent || (D._wheelEvent = "DOMMouseScroll"), D._wheelEvent && d(D.container, D._wheelEvent, j)
  }
  if (b.keyboardControl && d(document, "keydown", i), b.updateOnImagesReady) {
   D.imagesToLoad = c("img", D.container);
   for (var h = 0; h < D.imagesToLoad.length; h++) a(D.imagesToLoad[h])
  }
 }

 function g() {
  var a, d = D.h.addEventListener;
  if (b.preventLinks) {
   var e = c("a", D.container);
   for (a = 0; a < e.length; a++) d(e[a], "click", n)
  }
  if (b.releaseFormElements) {
   var f = c("input, textarea, select", D.container);
   for (a = 0; a < f.length; a++) d(f[a], D.touchEvents.touchStart, o, !0), D.support.touch && b.simulateTouch && d(f[a], "mousedown", o, !0)
  }
  if (b.onSlideClick)
   for (a = 0; a < D.slides.length; a++) d(D.slides[a], "click", k);
  if (b.onSlideTouch)
   for (a = 0; a < D.slides.length; a++) d(D.slides[a], D.touchEvents.touchStart, l)
 }

 function h() {
  var a, d = D.h.removeEventListener;
  if (b.onSlideClick)
   for (a = 0; a < D.slides.length; a++) d(D.slides[a], "click", k);
  if (b.onSlideTouch)
   for (a = 0; a < D.slides.length; a++) d(D.slides[a], D.touchEvents.touchStart, l);
  if (b.releaseFormElements) {
   var e = c("input, textarea, select", D.container);
   for (a = 0; a < e.length; a++) d(e[a], D.touchEvents.touchStart, o, !0), D.support.touch && b.simulateTouch && d(e[a], "mousedown", o, !0)
  }
  if (b.preventLinks) {
   var f = c("a", D.container);
   for (a = 0; a < f.length; a++) d(f[a], "click", n)
  }
 }

 function i(a) {
  var b = a.keyCode || a.charCode;
  if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey)) {
   if (37 === b || 39 === b || 38 === b || 40 === b) {
    for (var c = !1, d = D.h.getOffset(D.container), e = D.h.windowScroll().left, f = D.h.windowScroll().top, g = D.h.windowWidth(), h = D.h.windowHeight(), i = [
      [d.left, d.top],
      [d.left + D.width, d.top],
      [d.left, d.top + D.height],
      [d.left + D.width, d.top + D.height]
     ], j = 0; j < i.length; j++) {
     var k = i[j];
     k[0] >= e && k[0] <= e + g && k[1] >= f && k[1] <= f + h && (c = !0)
    }
    if (!c) return
   }
   N ? ((37 === b || 39 === b) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1), 39 === b && D.swipeNext(), 37 === b && D.swipePrev()) : ((38 === b || 40 === b) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1), 40 === b && D.swipeNext(), 38 === b && D.swipePrev())
  }
 }

 function j(a) {
  var c = D._wheelEvent,
   d = 0;
  if (a.detail) d = -a.detail;
  else if ("mousewheel" === c)
   if (b.mousewheelControlForceToAxis)
    if (N) {
     if (!(Math.abs(a.wheelDeltaX) > Math.abs(a.wheelDeltaY))) return;
     d = a.wheelDeltaX
    } else {
     if (!(Math.abs(a.wheelDeltaY) > Math.abs(a.wheelDeltaX))) return;
     d = a.wheelDeltaY
    }
  else d = a.wheelDelta;
  else if ("DOMMouseScroll" === c) d = -a.detail;
  else if ("wheel" === c)
   if (b.mousewheelControlForceToAxis)
    if (N) {
     if (!(Math.abs(a.deltaX) > Math.abs(a.deltaY))) return;
     d = -a.deltaX
    } else {
     if (!(Math.abs(a.deltaY) > Math.abs(a.deltaX))) return;
     d = -a.deltaY
    }
  else d = Math.abs(a.deltaX) > Math.abs(a.deltaY) ? -a.deltaX : -a.deltaY;
  if (b.freeMode) {
   var f = D.getWrapperTranslate() + d;
   if (f > 0 && (f = 0), f < -e() && (f = -e()), D.setWrapperTransition(0), D.setWrapperTranslate(f), D.updateActiveSlide(f), 0 === f || f === -e()) return
  } else(new Date).getTime() - V > 60 && (0 > d ? D.swipeNext() : D.swipePrev()), V = (new Date).getTime();
  return b.autoplay && D.stopAutoplay(!0), a.preventDefault ? a.preventDefault() : a.returnValue = !1, !1
 }

 function k(a) {
  D.allowSlideClick && (m(a), D.fireCallback(b.onSlideClick, D, a))
 }

 function l(a) {
  m(a), D.fireCallback(b.onSlideTouch, D, a)
 }

 function m(a) {
  if (a.currentTarget) D.clickedSlide = a.currentTarget;
  else {
   var c = a.srcElement;
   do {
    if (c.className.indexOf(b.slideClass) > -1) break;
    c = c.parentNode
   } while (c);
   D.clickedSlide = c
  }
  D.clickedSlideIndex = D.slides.indexOf(D.clickedSlide), D.clickedSlideLoopIndex = D.clickedSlideIndex - (D.loopedSlides || 0)
 }

 function n(a) {
  return D.allowLinks ? void 0 : (a.preventDefault ? a.preventDefault() : a.returnValue = !1, b.preventLinksPropagation && "stopPropagation" in a && a.stopPropagation(), !1)
 }

 function o(a) {
  return a.stopPropagation ? a.stopPropagation() : a.returnValue = !1, !1
 }

 function p(a) {
  if (b.preventLinks && (D.allowLinks = !0), D.isTouched || b.onlyExternal) return !1;
  var c = a.target || a.srcElement;
  document.activeElement && document.activeElement !== document.body && document.activeElement !== c && document.activeElement.blur();
  var d = "input select textarea".split(" ");
  if (b.noSwiping && c && t(c)) return !1;
  if (_ = !1, D.isTouched = !0, $ = "touchstart" === a.type, !$ && "which" in a && 3 === a.which) return D.isTouched = !1, !1;
  if (!$ || 1 === a.targetTouches.length) {
   D.callPlugins("onTouchStartBegin"), !$ && !D.isAndroid && d.indexOf(c.tagName.toLowerCase()) < 0 && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
   var e = $ ? a.targetTouches[0].pageX : a.pageX || a.clientX,
    f = $ ? a.targetTouches[0].pageY : a.pageY || a.clientY;
   D.touches.startX = D.touches.currentX = e, D.touches.startY = D.touches.currentY = f, D.touches.start = D.touches.current = N ? e : f, D.setWrapperTransition(0), D.positions.start = D.positions.current = D.getWrapperTranslate(), D.setWrapperTranslate(D.positions.start), D.times.start = (new Date).getTime(), I = void 0, b.moveStartThreshold > 0 && (X = !1), b.onTouchStart && D.fireCallback(b.onTouchStart, D, a), D.callPlugins("onTouchStartEnd")
  }
 }

 function q(a) {
  if (D.isTouched && !b.onlyExternal && (!$ || "mousemove" !== a.type)) {
   var c = $ ? a.targetTouches[0].pageX : a.pageX || a.clientX,
    d = $ ? a.targetTouches[0].pageY : a.pageY || a.clientY;
   if ("undefined" == typeof I && N && (I = !!(I || Math.abs(d - D.touches.startY) > Math.abs(c - D.touches.startX))), "undefined" != typeof I || N || (I = !!(I || Math.abs(d - D.touches.startY) < Math.abs(c - D.touches.startX))), I) return void(D.isTouched = !1);
   if (N) {
    if (!b.swipeToNext && c < D.touches.startX || !b.swipeToPrev && c > D.touches.startX) return
   } else if (!b.swipeToNext && d < D.touches.startY || !b.swipeToPrev && d > D.touches.startY) return;
   if (a.assignedToSwiper) return void(D.isTouched = !1);
   if (a.assignedToSwiper = !0, b.preventLinks && (D.allowLinks = !1), b.onSlideClick && (D.allowSlideClick = !1), b.autoplay && D.stopAutoplay(!0), !$ || 1 === a.touches.length) {
    if (D.isMoved || (D.callPlugins("onTouchMoveStart"), b.loop && (D.fixLoop(), D.positions.start = D.getWrapperTranslate()), b.onTouchMoveStart && D.fireCallback(b.onTouchMoveStart, D)), D.isMoved = !0, a.preventDefault ? a.preventDefault() : a.returnValue = !1, D.touches.current = N ? c : d, D.positions.current = (D.touches.current - D.touches.start) * b.touchRatio + D.positions.start, D.positions.current > 0 && b.onResistanceBefore && D.fireCallback(b.onResistanceBefore, D, D.positions.current), D.positions.current < -e() && b.onResistanceAfter && D.fireCallback(b.onResistanceAfter, D, Math.abs(D.positions.current + e())), b.resistance && "100%" !== b.resistance) {
     var f;
     if (D.positions.current > 0 && (f = 1 - D.positions.current / J / 2, D.positions.current = .5 > f ? J / 2 : D.positions.current * f), D.positions.current < -e()) {
      var g = (D.touches.current - D.touches.start) * b.touchRatio + (e() + D.positions.start);
      f = (J + g) / J;
      var h = D.positions.current - g * (1 - f) / 2,
       i = -e() - J / 2;
      D.positions.current = i > h || 0 >= f ? i : h
     }
    }
    if (b.resistance && "100%" === b.resistance && (D.positions.current > 0 && (!b.freeMode || b.freeModeFluid) && (D.positions.current = 0), D.positions.current < -e() && (!b.freeMode || b.freeModeFluid) && (D.positions.current = -e())), !b.followFinger) return;
    if (b.moveStartThreshold)
     if (Math.abs(D.touches.current - D.touches.start) > b.moveStartThreshold || X) {
      if (!X) return X = !0, void(D.touches.start = D.touches.current);
      D.setWrapperTranslate(D.positions.current)
     } else D.positions.current = D.positions.start;
    else D.setWrapperTranslate(D.positions.current);
    return (b.freeMode || b.watchActiveIndex) && D.updateActiveSlide(D.positions.current), b.grabCursor && (D.container.style.cursor = "move", D.container.style.cursor = "grabbing", D.container.style.cursor = "-moz-grabbin", D.container.style.cursor = "-webkit-grabbing"), Y || (Y = D.touches.current), Z || (Z = (new Date).getTime()), D.velocity = (D.touches.current - Y) / ((new Date).getTime() - Z) / 2, Math.abs(D.touches.current - Y) < 2 && (D.velocity = 0), Y = D.touches.current, Z = (new Date).getTime(), D.callPlugins("onTouchMoveEnd"), b.onTouchMove && D.fireCallback(b.onTouchMove, D, a), !1
   }
  }
 }

 function r(a) {
  if (I && D.swipeReset(), !b.onlyExternal && D.isTouched) {
   D.isTouched = !1, b.grabCursor && (D.container.style.cursor = "move", D.container.style.cursor = "grab", D.container.style.cursor = "-moz-grab", D.container.style.cursor = "-webkit-grab"), D.positions.current || 0 === D.positions.current || (D.positions.current = D.positions.start), b.followFinger && D.setWrapperTranslate(D.positions.current), D.times.end = (new Date).getTime(), D.touches.diff = D.touches.current - D.touches.start, D.touches.abs = Math.abs(D.touches.diff), D.positions.diff = D.positions.current - D.positions.start, D.positions.abs = Math.abs(D.positions.diff);
   var c = D.positions.diff,
    d = D.positions.abs,
    f = D.times.end - D.times.start;
   5 > d && 300 > f && D.allowLinks === !1 && (b.freeMode || 0 === d || D.swipeReset(), b.preventLinks && (D.allowLinks = !0), b.onSlideClick && (D.allowSlideClick = !0)), setTimeout(function() {
    "undefined" != typeof D && null !== D && (b.preventLinks && (D.allowLinks = !0), b.onSlideClick && (D.allowSlideClick = !0))
   }, 100);
   var g = e();
   if (!D.isMoved && b.freeMode) return D.isMoved = !1, b.onTouchEnd && D.fireCallback(b.onTouchEnd, D, a), void D.callPlugins("onTouchEnd");
   if (!D.isMoved || D.positions.current > 0 || D.positions.current < -g) return D.swipeReset(), b.onTouchEnd && D.fireCallback(b.onTouchEnd, D, a), void D.callPlugins("onTouchEnd");
   if (D.isMoved = !1, b.freeMode) {
    if (b.freeModeFluid) {
     var h, i = 1e3 * b.momentumRatio,
      j = D.velocity * i,
      k = D.positions.current + j,
      l = !1,
      m = 20 * Math.abs(D.velocity) * b.momentumBounceRatio; - g > k && (b.momentumBounce && D.support.transitions ? (-m > k + g && (k = -g - m), h = -g, l = !0, _ = !0) : k = -g), k > 0 && (b.momentumBounce && D.support.transitions ? (k > m && (k = m), h = 0, l = !0, _ = !0) : k = 0), 0 !== D.velocity && (i = Math.abs((k - D.positions.current) / D.velocity)), D.setWrapperTranslate(k), D.setWrapperTransition(i), b.momentumBounce && l && D.wrapperTransitionEnd(function() {
      _ && (b.onMomentumBounce && D.fireCallback(b.onMomentumBounce, D), D.callPlugins("onMomentumBounce"), D.setWrapperTranslate(h), D.setWrapperTransition(300))
     }), D.updateActiveSlide(k)
    }
    return (!b.freeModeFluid || f >= 300) && D.updateActiveSlide(D.positions.current), b.onTouchEnd && D.fireCallback(b.onTouchEnd, D, a), void D.callPlugins("onTouchEnd")
   }
   H = 0 > c ? "toNext" : "toPrev", "toNext" === H && 300 >= f && (30 > d || !b.shortSwipes ? D.swipeReset() : D.swipeNext(!0, !0)), "toPrev" === H && 300 >= f && (30 > d || !b.shortSwipes ? D.swipeReset() : D.swipePrev(!0, !0));
   var n = 0;
   if ("auto" === b.slidesPerView) {
    for (var o, p = Math.abs(D.getWrapperTranslate()), q = 0, r = 0; r < D.slides.length; r++)
     if (o = N ? D.slides[r].getWidth(!0, b.roundLengths) : D.slides[r].getHeight(!0, b.roundLengths), q += o, q > p) {
      n = o;
      break
     } n > J && (n = J)
   } else n = F * b.slidesPerView;
   "toNext" === H && f > 300 && (d >= n * b.longSwipesRatio ? D.swipeNext(!0, !0) : D.swipeReset()), "toPrev" === H && f > 300 && (d >= n * b.longSwipesRatio ? D.swipePrev(!0, !0) : D.swipeReset()), b.onTouchEnd && D.fireCallback(b.onTouchEnd, D, a), D.callPlugins("onTouchEnd")
  }
 }

 function s(a, b) {
  return a && a.getAttribute("class") && a.getAttribute("class").indexOf(b) > -1
 }

 function t(a) {
  var c = !1;
  do s(a, b.noSwipingClass) && (c = !0), a = a.parentElement; while (!c && a.parentElement && !s(a, b.wrapperClass));
  return !c && s(a, b.wrapperClass) && s(a, b.noSwipingClass) && (c = !0), c
 }

 function u(a, b) {
  var c, d = document.createElement("div");
  return d.innerHTML = b, c = d.firstChild, c.className += " " + a, c.outerHTML
 }

 function v(a, c, d) {
  function e() {
   var f = +new Date,
    l = f - g;
   h += i * l / (1e3 / 60), k = "toNext" === j ? h > a : a > h, k ? (D.setWrapperTranslate(Math.ceil(h)), D._DOMAnimating = !0, window.setTimeout(function() {
    e()
   }, 1e3 / 60)) : (b.onSlideChangeEnd && ("to" === c ? d.runCallbacks === !0 && D.fireCallback(b.onSlideChangeEnd, D, j) : D.fireCallback(b.onSlideChangeEnd, D, j)), D.setWrapperTranslate(a), D._DOMAnimating = !1)
  }
  var f = "to" === c && d.speed >= 0 ? d.speed : b.speed,
   g = +new Date;
  if (D.support.transitions || !b.DOMAnimation) D.setWrapperTranslate(a), D.setWrapperTransition(f);
  else {
   var h = D.getWrapperTranslate(),
    i = Math.ceil((a - h) / f * (1e3 / 60)),
    j = h > a ? "toNext" : "toPrev",
    k = "toNext" === j ? h > a : a > h;
   if (D._DOMAnimating) return;
   e()
  }
  D.updateActiveSlide(a), b.onSlideNext && "next" === c && d.runCallbacks === !0 && D.fireCallback(b.onSlideNext, D, a), b.onSlidePrev && "prev" === c && d.runCallbacks === !0 && D.fireCallback(b.onSlidePrev, D, a), b.onSlideReset && "reset" === c && d.runCallbacks === !0 && D.fireCallback(b.onSlideReset, D, a), "next" !== c && "prev" !== c && "to" !== c || d.runCallbacks !== !0 || w(c)
 }

 function w(a) {
  if (D.callPlugins("onSlideChangeStart"), b.onSlideChangeStart)
   if (b.queueStartCallbacks && D.support.transitions) {
    if (D._queueStartCallbacks) return;
    D._queueStartCallbacks = !0, D.fireCallback(b.onSlideChangeStart, D, a), D.wrapperTransitionEnd(function() {
     D._queueStartCallbacks = !1
    })
   } else D.fireCallback(b.onSlideChangeStart, D, a);
  if (b.onSlideChangeEnd)
   if (D.support.transitions)
    if (b.queueEndCallbacks) {
     if (D._queueEndCallbacks) return;
     D._queueEndCallbacks = !0, D.wrapperTransitionEnd(function(c) {
      D.fireCallback(b.onSlideChangeEnd, c, a)
     })
    } else D.wrapperTransitionEnd(function(c) {
     D.fireCallback(b.onSlideChangeEnd, c, a)
    });
  else b.DOMAnimation || setTimeout(function() {
   D.fireCallback(b.onSlideChangeEnd, D, a)
  }, 10)
 }

 function x() {
  var a = D.paginationButtons;
  if (a)
   for (var b = 0; b < a.length; b++) D.h.removeEventListener(a[b], "click", z)
 }

 function y() {
  var a = D.paginationButtons;
  if (a)
   for (var b = 0; b < a.length; b++) D.h.addEventListener(a[b], "click", z)
 }

 function z(a) {
  for (var c, d = a.target || a.srcElement, e = D.paginationButtons, f = 0; f < e.length; f++) d === e[f] && (c = f);
  b.autoplay && D.stopAutoplay(!0), D.swipeTo(c)
 }

 function A() {
  ab = setTimeout(function() {
   b.loop ? (D.fixLoop(), D.swipeNext(!0, !0)) : D.swipeNext(!0, !0) || (b.autoplayStopOnLast ? (clearTimeout(ab), ab = void 0) : D.swipeTo(0)), D.wrapperTransitionEnd(function() {
    "undefined" != typeof ab && A()
   })
  }, b.autoplay)
 }

 function B() {
  D.calcSlides(), b.loader.slides.length > 0 && 0 === D.slides.length && D.loadSlides(), b.loop && D.createLoop(), D.init(), f(), b.pagination && D.createPagination(!0), b.loop || b.initialSlide > 0 ? D.swipeTo(b.initialSlide, 0, !1) : D.updateActiveSlide(0), b.autoplay && D.startAutoplay(), D.centerIndex = D.activeIndex, b.onSwiperCreated && D.fireCallback(b.onSwiperCreated, D), D.callPlugins("onSwiperCreated")
 }
 if (!document.body.outerHTML && document.body.__defineGetter__ && HTMLElement) {
  var C = HTMLElement.prototype;
  C.__defineGetter__ && C.__defineGetter__("outerHTML", function() {
   return (new XMLSerializer).serializeToString(this)
  })
 }
 if (window.getComputedStyle || (window.getComputedStyle = function(a) {
   return this.el = a, this.getPropertyValue = function(b) {
    var c = /(\-([a-z]){1})/g;
    return "float" === b && (b = "styleFloat"), c.test(b) && (b = b.replace(c, function() {
     return arguments[2].toUpperCase()
    })), a.currentStyle[b] ? a.currentStyle[b] : null
   }, this
  }), Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
   for (var c = b || 0, d = this.length; d > c; c++)
    if (this[c] === a) return c;
   return -1
  }), (document.querySelectorAll || window.jQuery) && "undefined" != typeof a && (a.nodeType || 0 !== c(a).length)) {
  var D = this;
  D.touches = {
   start: 0,
   startX: 0,
   startY: 0,
   current: 0,
   currentX: 0,
   currentY: 0,
   diff: 0,
   abs: 0
  }, D.positions = {
   start: 0,
   abs: 0,
   diff: 0,
   current: 0
  }, D.times = {
   start: 0,
   end: 0
  }, D.id = (new Date).getTime(), D.container = a.nodeType ? a : c(a)[0], D.isTouched = !1, D.isMoved = !1, D.activeIndex = 0, D.centerIndex = 0, D.activeLoaderIndex = 0, D.activeLoopIndex = 0, D.previousIndex = null, D.velocity = 0, D.snapGrid = [], D.slidesGrid = [], D.imagesToLoad = [], D.imagesLoaded = 0, D.wrapperLeft = 0, D.wrapperRight = 0, D.wrapperTop = 0, D.wrapperBottom = 0, D.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") >= 0;
  var E, F, G, H, I, J, K = {
   eventTarget: "wrapper",
   mode: "horizontal",
   touchRatio: 1,
   speed: 300,
   freeMode: !1,
   freeModeFluid: !1,
   momentumRatio: 1,
   momentumBounce: !0,
   momentumBounceRatio: 1,
   slidesPerView: 1,
   slidesPerGroup: 1,
   slidesPerViewFit: !0,
   simulateTouch: !0,
   followFinger: !0,
   shortSwipes: !0,
   longSwipesRatio: .5,
   moveStartThreshold: !1,
   onlyExternal: !1,
   createPagination: !0,
   pagination: !1,
   paginationElement: "span",
   paginationClickable: !1,
   paginationAsRange: !0,
   resistance: !0,
   scrollContainer: !1,
   preventLinks: !0,
   preventLinksPropagation: !1,
   noSwiping: !1,
   noSwipingClass: "swiper-no-swiping",
   initialSlide: 0,
   keyboardControl: !1,
   mousewheelControl: !1,
   mousewheelControlForceToAxis: !1,
   useCSS3Transforms: !0,
   autoplay: !1,
   autoplayDisableOnInteraction: !0,
   autoplayStopOnLast: !1,
   loop: !1,
   loopAdditionalSlides: 0,
   roundLengths: !1,
   calculateHeight: !1,
   cssWidthAndHeight: !1,
   updateOnImagesReady: !0,
   releaseFormElements: !0,
   watchActiveIndex: !1,
   visibilityFullFit: !1,
   offsetPxBefore: 0,
   offsetPxAfter: 0,
   offsetSlidesBefore: 0,
   offsetSlidesAfter: 0,
   centeredSlides: !1,
   queueStartCallbacks: !1,
   queueEndCallbacks: !1,
   autoResize: !0,
   resizeReInit: !1,
   DOMAnimation: !0,
   loader: {
    slides: [],
    slidesHTMLType: "inner",
    surroundGroups: 1,
    logic: "reload",
    loadAllSlides: !1
   },
   swipeToPrev: !0,
   swipeToNext: !0,
   slideElement: "div",
   slideClass: "swiper-slide",
   slideActiveClass: "swiper-slide-active",
   slideVisibleClass: "swiper-slide-visible",
   slideDuplicateClass: "swiper-slide-duplicate",
   wrapperClass: "swiper-wrapper",
   paginationElementClass: "swiper-pagination-switch",
   paginationActiveClass: "swiper-active-switch",
   paginationVisibleClass: "swiper-visible-switch"
  };
  b = b || {};
  for (var L in K)
   if (L in b && "object" == typeof b[L])
    for (var M in K[L]) M in b[L] || (b[L][M] = K[L][M]);
   else L in b || (b[L] = K[L]);
  D.params = b, b.scrollContainer && (b.freeMode = !0, b.freeModeFluid = !0), b.loop && (b.resistance = "100%");
  var N = "horizontal" === b.mode,
   O = ["mousedown", "mousemove", "mouseup"];
  D.browser.ie10 && (O = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]), D.browser.ie11 && (O = ["pointerdown", "pointermove", "pointerup"]), D.touchEvents = {
   touchStart: D.support.touch || !b.simulateTouch ? "touchstart" : O[0],
   touchMove: D.support.touch || !b.simulateTouch ? "touchmove" : O[1],
   touchEnd: D.support.touch || !b.simulateTouch ? "touchend" : O[2]
  };
  for (var P = D.container.childNodes.length - 1; P >= 0; P--)
   if (D.container.childNodes[P].className)
    for (var Q = D.container.childNodes[P].className.split(/\s+/), R = 0; R < Q.length; R++) Q[R] === b.wrapperClass && (E = D.container.childNodes[P]);
  D.wrapper = E, D._extendSwiperSlide = function(a) {
   return a.append = function() {
    return b.loop ? a.insertAfter(D.slides.length - D.loopedSlides) : (D.wrapper.appendChild(a), D.reInit()), a
   }, a.prepend = function() {
    return b.loop ? (D.wrapper.insertBefore(a, D.slides[D.loopedSlides]), D.removeLoopedSlides(), D.calcSlides(), D.createLoop()) : D.wrapper.insertBefore(a, D.wrapper.firstChild), D.reInit(), a
   }, a.insertAfter = function(c) {
    if ("undefined" == typeof c) return !1;
    var d;
    return b.loop ? (d = D.slides[c + 1 + D.loopedSlides], d ? D.wrapper.insertBefore(a, d) : D.wrapper.appendChild(a), D.removeLoopedSlides(), D.calcSlides(), D.createLoop()) : (d = D.slides[c + 1], D.wrapper.insertBefore(a, d)), D.reInit(), a
   }, a.clone = function() {
    return D._extendSwiperSlide(a.cloneNode(!0))
   }, a.remove = function() {
    D.wrapper.removeChild(a), D.reInit()
   }, a.html = function(b) {
    return "undefined" == typeof b ? a.innerHTML : (a.innerHTML = b, a)
   }, a.index = function() {
    for (var b, c = D.slides.length - 1; c >= 0; c--) a === D.slides[c] && (b = c);
    return b
   }, a.isActive = function() {
    return a.index() === D.activeIndex ? !0 : !1
   }, a.swiperSlideDataStorage || (a.swiperSlideDataStorage = {}), a.getData = function(b) {
    return a.swiperSlideDataStorage[b]
   }, a.setData = function(b, c) {
    return a.swiperSlideDataStorage[b] = c, a
   }, a.data = function(b, c) {
    return "undefined" == typeof c ? a.getAttribute("data-" + b) : (a.setAttribute("data-" + b, c), a)
   }, a.getWidth = function(b, c) {
    return D.h.getWidth(a, b, c)
   }, a.getHeight = function(b, c) {
    return D.h.getHeight(a, b, c)
   }, a.getOffset = function() {
    return D.h.getOffset(a)
   }, a
  }, D.calcSlides = function(a) {
   var c = D.slides ? D.slides.length : !1;
   D.slides = [], D.displaySlides = [];
   for (var d = 0; d < D.wrapper.childNodes.length; d++)
    if (D.wrapper.childNodes[d].className)
     for (var e = D.wrapper.childNodes[d].className, f = e.split(/\s+/), i = 0; i < f.length; i++) f[i] === b.slideClass && D.slides.push(D.wrapper.childNodes[d]);
   for (d = D.slides.length - 1; d >= 0; d--) D._extendSwiperSlide(D.slides[d]);
   c !== !1 && (c !== D.slides.length || a) && (h(), g(), D.updateActiveSlide(), D.params.pagination && D.createPagination(), D.callPlugins("numberOfSlidesChanged"))
  }, D.createSlide = function(a, c, d) {
   c = c || D.params.slideClass, d = d || b.slideElement;
   var e = document.createElement(d);
   return e.innerHTML = a || "", e.className = c, D._extendSwiperSlide(e)
  }, D.appendSlide = function(a, b, c) {
   return a ? a.nodeType ? D._extendSwiperSlide(a).append() : D.createSlide(a, b, c).append() : void 0
  }, D.prependSlide = function(a, b, c) {
   return a ? a.nodeType ? D._extendSwiperSlide(a).prepend() : D.createSlide(a, b, c).prepend() : void 0
  }, D.insertSlideAfter = function(a, b, c, d) {
   return "undefined" == typeof a ? !1 : b.nodeType ? D._extendSwiperSlide(b).insertAfter(a) : D.createSlide(b, c, d).insertAfter(a)
  }, D.removeSlide = function(a) {
   if (D.slides[a]) {
    if (b.loop) {
     if (!D.slides[a + D.loopedSlides]) return !1;
     D.slides[a + D.loopedSlides].remove(), D.removeLoopedSlides(), D.calcSlides(), D.createLoop()
    } else D.slides[a].remove();
    return !0
   }
   return !1
  }, D.removeLastSlide = function() {
   return D.slides.length > 0 ? (b.loop ? (D.slides[D.slides.length - 1 - D.loopedSlides].remove(), D.removeLoopedSlides(), D.calcSlides(), D.createLoop()) : D.slides[D.slides.length - 1].remove(), !0) : !1
  }, D.removeAllSlides = function() {
   for (var a = D.slides.length, b = D.slides.length - 1; b >= 0; b--) D.slides[b].remove(), b === a - 1 && D.setWrapperTranslate(0)
  }, D.getSlide = function(a) {
   return D.slides[a]
  }, D.getLastSlide = function() {
   return D.slides[D.slides.length - 1]
  }, D.getFirstSlide = function() {
   return D.slides[0]
  }, D.activeSlide = function() {
   return D.slides[D.activeIndex]
  }, D.fireCallback = function() {
   var a = arguments[0];
   if ("[object Array]" === Object.prototype.toString.call(a))
    for (var c = 0; c < a.length; c++) "function" == typeof a[c] && a[c](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
   else "[object String]" === Object.prototype.toString.call(a) ? b["on" + a] && D.fireCallback(b["on" + a], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]) : a(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
  }, D.addCallback = function(a, b) {
   var c, e = this;
   return e.params["on" + a] ? d(this.params["on" + a]) ? this.params["on" + a].push(b) : "function" == typeof this.params["on" + a] ? (c = this.params["on" + a], this.params["on" + a] = [], this.params["on" + a].push(c), this.params["on" + a].push(b)) : void 0 : (this.params["on" + a] = [], this.params["on" + a].push(b))
  }, D.removeCallbacks = function(a) {
   D.params["on" + a] && (D.params["on" + a] = null)
  };
  var S = [];
  for (var T in D.plugins)
   if (b[T]) {
    var U = D.plugins[T](D, b[T]);
    U && S.push(U)
   } D.callPlugins = function(a, b) {
   b || (b = {});
   for (var c = 0; c < S.length; c++) a in S[c] && S[c][a](b)
  }, !D.browser.ie10 && !D.browser.ie11 || b.onlyExternal || D.wrapper.classList.add("swiper-wp8-" + (N ? "horizontal" : "vertical")), b.freeMode && (D.container.className += " swiper-free-mode"), D.initialized = !1, D.init = function(a, c) {
   var d = D.h.getWidth(D.container, !1, b.roundLengths),
    e = D.h.getHeight(D.container, !1, b.roundLengths);
   if (d !== D.width || e !== D.height || a) {
    D.width = d, D.height = e;
    var f, g, h, i, j, k, l;
    J = N ? d : e;
    var m = D.wrapper;
    if (a && D.calcSlides(c), "auto" === b.slidesPerView) {
     var n = 0,
      o = 0;
     b.slidesOffset > 0 && (m.style.paddingLeft = "", m.style.paddingRight = "", m.style.paddingTop = "", m.style.paddingBottom = ""), m.style.width = "", m.style.height = "", b.offsetPxBefore > 0 && (N ? D.wrapperLeft = b.offsetPxBefore : D.wrapperTop = b.offsetPxBefore), b.offsetPxAfter > 0 && (N ? D.wrapperRight = b.offsetPxAfter : D.wrapperBottom = b.offsetPxAfter), b.centeredSlides && (N ? (D.wrapperLeft = (J - this.slides[0].getWidth(!0, b.roundLengths)) / 2, D.wrapperRight = (J - D.slides[D.slides.length - 1].getWidth(!0, b.roundLengths)) / 2) : (D.wrapperTop = (J - D.slides[0].getHeight(!0, b.roundLengths)) / 2, D.wrapperBottom = (J - D.slides[D.slides.length - 1].getHeight(!0, b.roundLengths)) / 2)), N ? (D.wrapperLeft >= 0 && (m.style.paddingLeft = D.wrapperLeft + "px"), D.wrapperRight >= 0 && (m.style.paddingRight = D.wrapperRight + "px")) : (D.wrapperTop >= 0 && (m.style.paddingTop = D.wrapperTop + "px"), D.wrapperBottom >= 0 && (m.style.paddingBottom = D.wrapperBottom + "px")), k = 0;
     var p = 0;
     for (D.snapGrid = [], D.slidesGrid = [], h = 0, l = 0; l < D.slides.length; l++) {
      f = D.slides[l].getWidth(!0, b.roundLengths), g = D.slides[l].getHeight(!0, b.roundLengths), b.calculateHeight && (h = Math.max(h, g));
      var q = N ? f : g;
      if (b.centeredSlides) {
       var r = l === D.slides.length - 1 ? 0 : D.slides[l + 1].getWidth(!0, b.roundLengths),
        s = l === D.slides.length - 1 ? 0 : D.slides[l + 1].getHeight(!0, b.roundLengths),
        t = N ? r : s;
       if (q > J) {
        if (b.slidesPerViewFit) D.snapGrid.push(k + D.wrapperLeft), D.snapGrid.push(k + q - J + D.wrapperLeft);
        else
         for (var u = 0; u <= Math.floor(q / (J + D.wrapperLeft)); u++) D.snapGrid.push(0 === u ? k + D.wrapperLeft : k + D.wrapperLeft + J * u);
        D.slidesGrid.push(k + D.wrapperLeft)
       } else D.snapGrid.push(p), D.slidesGrid.push(p);
       p += q / 2 + t / 2
      } else {
       if (q > J)
        if (b.slidesPerViewFit) D.snapGrid.push(k), D.snapGrid.push(k + q - J);
        else if (0 !== J)
        for (var v = 0; v <= Math.floor(q / J); v++) D.snapGrid.push(k + J * v);
       else D.snapGrid.push(k);
       else D.snapGrid.push(k);
       D.slidesGrid.push(k)
      }
      k += q, n += f, o += g
     }
     b.calculateHeight && (D.height = h), N ? (G = n + D.wrapperRight + D.wrapperLeft, b.cssWidthAndHeight && "height" !== b.cssWidthAndHeight || (m.style.width = n + "px"), b.cssWidthAndHeight && "width" !== b.cssWidthAndHeight || (m.style.height = D.height + "px")) : (b.cssWidthAndHeight && "height" !== b.cssWidthAndHeight || (m.style.width = D.width + "px"), b.cssWidthAndHeight && "width" !== b.cssWidthAndHeight || (m.style.height = o + "px"), G = o + D.wrapperTop + D.wrapperBottom)
    } else if (b.scrollContainer) m.style.width = "", m.style.height = "", i = D.slides[0].getWidth(!0, b.roundLengths), j = D.slides[0].getHeight(!0, b.roundLengths), G = N ? i : j, m.style.width = i + "px", m.style.height = j + "px", F = N ? i : j;
    else {
     if (b.calculateHeight) {
      for (h = 0, j = 0, N || (D.container.style.height = ""), m.style.height = "", l = 0; l < D.slides.length; l++) D.slides[l].style.height = "", h = Math.max(D.slides[l].getHeight(!0), h), N || (j += D.slides[l].getHeight(!0));
      g = h, D.height = g, N ? j = g : (J = g, D.container.style.height = J + "px")
     } else g = N ? D.height : D.height / b.slidesPerView, b.roundLengths && (g = Math.ceil(g)), j = N ? D.height : D.slides.length * g;
     for (f = N ? D.width / b.slidesPerView : D.width, b.roundLengths && (f = Math.ceil(f)), i = N ? D.slides.length * f : D.width, F = N ? f : g, b.offsetSlidesBefore > 0 && (N ? D.wrapperLeft = F * b.offsetSlidesBefore : D.wrapperTop = F * b.offsetSlidesBefore), b.offsetSlidesAfter > 0 && (N ? D.wrapperRight = F * b.offsetSlidesAfter : D.wrapperBottom = F * b.offsetSlidesAfter), b.offsetPxBefore > 0 && (N ? D.wrapperLeft = b.offsetPxBefore : D.wrapperTop = b.offsetPxBefore), b.offsetPxAfter > 0 && (N ? D.wrapperRight = b.offsetPxAfter : D.wrapperBottom = b.offsetPxAfter), b.centeredSlides && (N ? (D.wrapperLeft = (J - F) / 2, D.wrapperRight = (J - F) / 2) : (D.wrapperTop = (J - F) / 2, D.wrapperBottom = (J - F) / 2)), N ? (D.wrapperLeft > 0 && (m.style.paddingLeft = D.wrapperLeft + "px"), D.wrapperRight > 0 && (m.style.paddingRight = D.wrapperRight + "px")) : (D.wrapperTop > 0 && (m.style.paddingTop = D.wrapperTop + "px"), D.wrapperBottom > 0 && (m.style.paddingBottom = D.wrapperBottom + "px")), G = N ? i + D.wrapperRight + D.wrapperLeft : j + D.wrapperTop + D.wrapperBottom, parseFloat(i) > 0 && (!b.cssWidthAndHeight || "height" === b.cssWidthAndHeight) && (m.style.width = i + "px"), parseFloat(j) > 0 && (!b.cssWidthAndHeight || "width" === b.cssWidthAndHeight) && (m.style.height = j + "px"), k = 0, D.snapGrid = [], D.slidesGrid = [], l = 0; l < D.slides.length; l++) D.snapGrid.push(k), D.slidesGrid.push(k), k += F, parseFloat(f) > 0 && (!b.cssWidthAndHeight || "height" === b.cssWidthAndHeight) && (D.slides[l].style.width = f + "px"), parseFloat(g) > 0 && (!b.cssWidthAndHeight || "width" === b.cssWidthAndHeight) && (D.slides[l].style.height = g + "px")
    }
    D.initialized ? (D.callPlugins("onInit"), b.onInit && D.fireCallback(b.onInit, D)) : (D.callPlugins("onFirstInit"), b.onFirstInit && D.fireCallback(b.onFirstInit, D)), D.initialized = !0
   }
  }, D.reInit = function(a) {
   D.init(!0, a)
  }, D.resizeFix = function(a) {
   D.callPlugins("beforeResizeFix"), D.init(b.resizeReInit || a), b.freeMode ? D.getWrapperTranslate() < -e() && (D.setWrapperTransition(0), D.setWrapperTranslate(-e())) : (D.swipeTo(b.loop ? D.activeLoopIndex : D.activeIndex, 0, !1), b.autoplay && (D.support.transitions && "undefined" != typeof ab ? "undefined" != typeof ab && (clearTimeout(ab), ab = void 0, D.startAutoplay()) : "undefined" != typeof bb && (clearInterval(bb), bb = void 0, D.startAutoplay()))), D.callPlugins("afterResizeFix")
  }, D.destroy = function(a) {
   var c = D.h.removeEventListener,
    d = "wrapper" === b.eventTarget ? D.wrapper : D.container;
   if (D.browser.ie10 || D.browser.ie11 ? (c(d, D.touchEvents.touchStart, p), c(document, D.touchEvents.touchMove, q), c(document, D.touchEvents.touchEnd, r)) : (D.support.touch && (c(d, "touchstart", p), c(d, "touchmove", q), c(d, "touchend", r)), b.simulateTouch && (c(d, "mousedown", p), c(document, "mousemove", q), c(document, "mouseup", r))), b.autoResize && c(window, "resize", D.resizeFix), h(), b.paginationClickable && x(), b.mousewheelControl && D._wheelEvent && c(D.container, D._wheelEvent, j), b.keyboardControl && c(document, "keydown", i), b.autoplay && D.stopAutoplay(), a) {
    D.wrapper.removeAttribute("style");
    for (var e = 0; e < D.slides.length; e++) D.slides[e].removeAttribute("style")
   }
   D.callPlugins("onDestroy"), window.jQuery && window.jQuery(D.container).data("swiper") && window.jQuery(D.container).removeData("swiper"), window.Zepto && window.Zepto(D.container).data("swiper") && window.Zepto(D.container).removeData("swiper"), D = null
  }, D.disableKeyboardControl = function() {
   b.keyboardControl = !1, D.h.removeEventListener(document, "keydown", i)
  }, D.enableKeyboardControl = function() {
   b.keyboardControl = !0, D.h.addEventListener(document, "keydown", i)
  };
  var V = (new Date).getTime();
  if (D.disableMousewheelControl = function() {
    return D._wheelEvent ? (b.mousewheelControl = !1, D.h.removeEventListener(D.container, D._wheelEvent, j), !0) : !1
   }, D.enableMousewheelControl = function() {
    return D._wheelEvent ? (b.mousewheelControl = !0, D.h.addEventListener(D.container, D._wheelEvent, j), !0) : !1
   }, b.grabCursor) {
   var W = D.container.style;
   W.cursor = "move", W.cursor = "grab", W.cursor = "-moz-grab", W.cursor = "-webkit-grab"
  }
  D.allowSlideClick = !0, D.allowLinks = !0;
  var X, Y, Z, $ = !1,
   _ = !0;
  D.swipeNext = function(a, c) {
   "undefined" == typeof a && (a = !0), !c && b.loop && D.fixLoop(), !c && b.autoplay && D.stopAutoplay(!0), D.callPlugins("onSwipeNext");
   var d = D.getWrapperTranslate().toFixed(2),
    f = d;
   if ("auto" === b.slidesPerView) {
    for (var g = 0; g < D.snapGrid.length; g++)
     if (-d >= D.snapGrid[g].toFixed(2) && -d < D.snapGrid[g + 1].toFixed(2)) {
      f = -D.snapGrid[g + 1];
      break
     }
   } else {
    var h = F * b.slidesPerGroup;
    f = -(Math.floor(Math.abs(d) / Math.floor(h)) * h + h)
   }
   return f < -e() && (f = -e()), f === d ? !1 : (v(f, "next", {
    runCallbacks: a
   }), !0)
  }, D.swipePrev = function(a, c) {
   "undefined" == typeof a && (a = !0), !c && b.loop && D.fixLoop(), !c && b.autoplay && D.stopAutoplay(!0), D.callPlugins("onSwipePrev");
   var d, e = Math.ceil(D.getWrapperTranslate());
   if ("auto" === b.slidesPerView) {
    d = 0;
    for (var f = 1; f < D.snapGrid.length; f++) {
     if (-e === D.snapGrid[f]) {
      d = -D.snapGrid[f - 1];
      break
     }
     if (-e > D.snapGrid[f] && -e < D.snapGrid[f + 1]) {
      d = -D.snapGrid[f];
      break
     }
    }
   } else {
    var g = F * b.slidesPerGroup;
    d = -(Math.ceil(-e / g) - 1) * g
   }
   return d > 0 && (d = 0), d === e ? !1 : (v(d, "prev", {
    runCallbacks: a
   }), !0)
  }, D.swipeReset = function(a) {
   "undefined" == typeof a && (a = !0), D.callPlugins("onSwipeReset"); {
    var c, d = D.getWrapperTranslate(),
     f = F * b.slidesPerGroup; - e()
   }
   if ("auto" === b.slidesPerView) {
    c = 0;
    for (var g = 0; g < D.snapGrid.length; g++) {
     if (-d === D.snapGrid[g]) return;
     if (-d >= D.snapGrid[g] && -d < D.snapGrid[g + 1]) {
      c = D.positions.diff > 0 ? -D.snapGrid[g + 1] : -D.snapGrid[g];
      break
     }
    } - d >= D.snapGrid[D.snapGrid.length - 1] && (c = -D.snapGrid[D.snapGrid.length - 1]), d <= -e() && (c = -e())
   } else c = 0 > d ? Math.round(d / f) * f : 0, d <= -e() && (c = -e());
   return b.scrollContainer && (c = 0 > d ? d : 0), c < -e() && (c = -e()), b.scrollContainer && J > F && (c = 0), c === d ? !1 : (v(c, "reset", {
    runCallbacks: a
   }), !0)
  }, D.swipeTo = function(a, c, d) {
   a = parseInt(a, 10), D.callPlugins("onSwipeTo", {
    index: a,
    speed: c
   }), b.loop && (a += D.loopedSlides);
   var f = D.getWrapperTranslate();
   if (!(!isFinite(a) || a > D.slides.length - 1 || 0 > a)) {
    var g;
    return g = "auto" === b.slidesPerView ? -D.slidesGrid[a] : -a * F, g < -e() && (g = -e()), g === f ? !1 : ("undefined" == typeof d && (d = !0), v(g, "to", {
     index: a,
     speed: c,
     runCallbacks: d
    }), !0)
   }
  }, D._queueStartCallbacks = !1, D._queueEndCallbacks = !1, D.updateActiveSlide = function(a) {
   if (D.initialized && 0 !== D.slides.length) {
    D.previousIndex = D.activeIndex, "undefined" == typeof a && (a = D.getWrapperTranslate()), a > 0 && (a = 0);
    var c;
    if ("auto" === b.slidesPerView) {
     if (D.activeIndex = D.slidesGrid.indexOf(-a), D.activeIndex < 0) {
      for (c = 0; c < D.slidesGrid.length - 1 && !(-a > D.slidesGrid[c] && -a < D.slidesGrid[c + 1]); c++);
      var d = Math.abs(D.slidesGrid[c] + a),
       e = Math.abs(D.slidesGrid[c + 1] + a);
      D.activeIndex = e >= d ? c : c + 1
     }
    } else D.activeIndex = Math[b.visibilityFullFit ? "ceil" : "round"](-a / F);
    if (D.activeIndex === D.slides.length && (D.activeIndex = D.slides.length - 1), D.activeIndex < 0 && (D.activeIndex = 0), D.slides[D.activeIndex]) {
     if (D.calcVisibleSlides(a), D.support.classList) {
      var f;
      for (c = 0; c < D.slides.length; c++) f = D.slides[c], f.classList.remove(b.slideActiveClass), D.visibleSlides.indexOf(f) >= 0 ? f.classList.add(b.slideVisibleClass) : f.classList.remove(b.slideVisibleClass);
      D.slides[D.activeIndex].classList.add(b.slideActiveClass)
     } else {
      var g = new RegExp("\\s*" + b.slideActiveClass),
       h = new RegExp("\\s*" + b.slideVisibleClass);
      for (c = 0; c < D.slides.length; c++) D.slides[c].className = D.slides[c].className.replace(g, "").replace(h, ""), D.visibleSlides.indexOf(D.slides[c]) >= 0 && (D.slides[c].className += " " + b.slideVisibleClass);
      D.slides[D.activeIndex].className += " " + b.slideActiveClass
     }
     if (b.loop) {
      var i = D.loopedSlides;
      D.activeLoopIndex = D.activeIndex - i, D.activeLoopIndex >= D.slides.length - 2 * i && (D.activeLoopIndex = D.slides.length - 2 * i - D.activeLoopIndex), D.activeLoopIndex < 0 && (D.activeLoopIndex = D.slides.length - 2 * i + D.activeLoopIndex), D.activeLoopIndex < 0 && (D.activeLoopIndex = 0)
     } else D.activeLoopIndex = D.activeIndex;
     b.pagination && D.updatePagination(a)
    }
   }
  }, D.createPagination = function(a) {
   if (b.paginationClickable && D.paginationButtons && x(), D.paginationContainer = b.pagination.nodeType ? b.pagination : c(b.pagination)[0], b.createPagination) {
    var d = "",
     e = D.slides.length,
     f = e;
    b.loop && (f -= 2 * D.loopedSlides);
    for (var g = 0; f > g; g++) d += "<" + b.paginationElement + ' class="' + b.paginationElementClass + '"></' + b.paginationElement + ">";
    D.paginationContainer.innerHTML = d
   }
   D.paginationButtons = c("." + b.paginationElementClass, D.paginationContainer), a || D.updatePagination(), D.callPlugins("onCreatePagination"), b.paginationClickable && y()
  }, D.updatePagination = function(a) {
   if (b.pagination && !(D.slides.length < 1)) {
    var d = c("." + b.paginationActiveClass, D.paginationContainer);
    if (d) {
     var e = D.paginationButtons;
     if (0 !== e.length) {
      for (var f = 0; f < e.length; f++) e[f].className = b.paginationElementClass;
      var g = b.loop ? D.loopedSlides : 0;
      if (b.paginationAsRange) {
       D.visibleSlides || D.calcVisibleSlides(a);
       var h, i = [];
       for (h = 0; h < D.visibleSlides.length; h++) {
        var j = D.slides.indexOf(D.visibleSlides[h]) - g;
        b.loop && 0 > j && (j = D.slides.length - 2 * D.loopedSlides + j), b.loop && j >= D.slides.length - 2 * D.loopedSlides && (j = D.slides.length - 2 * D.loopedSlides - j, j = Math.abs(j)), i.push(j)
       }
       for (h = 0; h < i.length; h++) e[i[h]] && (e[i[h]].className += " " + b.paginationVisibleClass);
       b.loop ? void 0 !== e[D.activeLoopIndex] && (e[D.activeLoopIndex].className += " " + b.paginationActiveClass) : e[D.activeIndex] && (e[D.activeIndex].className += " " + b.paginationActiveClass)
      } else b.loop ? e[D.activeLoopIndex] && (e[D.activeLoopIndex].className += " " + b.paginationActiveClass + " " + b.paginationVisibleClass) : e[D.activeIndex] && (e[D.activeIndex].className += " " + b.paginationActiveClass + " " + b.paginationVisibleClass)
     }
    }
   }
  }, D.calcVisibleSlides = function(a) {
   var c = [],
    d = 0,
    e = 0,
    f = 0;
   N && D.wrapperLeft > 0 && (a += D.wrapperLeft), !N && D.wrapperTop > 0 && (a += D.wrapperTop);
   for (var g = 0; g < D.slides.length; g++) {
    d += e, e = "auto" === b.slidesPerView ? N ? D.h.getWidth(D.slides[g], !0, b.roundLengths) : D.h.getHeight(D.slides[g], !0, b.roundLengths) : F, f = d + e;
    var h = !1;
    b.visibilityFullFit ? (d >= -a && -a + J >= f && (h = !0), -a >= d && f >= -a + J && (h = !0)) : (f > -a && -a + J >= f && (h = !0), d >= -a && -a + J > d && (h = !0), -a > d && f > -a + J && (h = !0)), h && c.push(D.slides[g])
   }
   0 === c.length && (c = [D.slides[D.activeIndex]]), D.visibleSlides = c
  };
  var ab, bb;
  D.startAutoplay = function() {
   if (D.support.transitions) {
    if ("undefined" != typeof ab) return !1;
    if (!b.autoplay) return;
    D.callPlugins("onAutoplayStart"), b.onAutoplayStart && D.fireCallback(b.onAutoplayStart, D), A()
   } else {
    if ("undefined" != typeof bb) return !1;
    if (!b.autoplay) return;
    D.callPlugins("onAutoplayStart"), b.onAutoplayStart && D.fireCallback(b.onAutoplayStart, D), bb = setInterval(function() {
     b.loop ? (D.fixLoop(), D.swipeNext(!0, !0)) : D.swipeNext(!0, !0) || (b.autoplayStopOnLast ? (clearInterval(bb), bb = void 0) : D.swipeTo(0))
    }, b.autoplay)
   }
  }, D.stopAutoplay = function(a) {
   if (D.support.transitions) {
    if (!ab) return;
    ab && clearTimeout(ab), ab = void 0, a && !b.autoplayDisableOnInteraction && D.wrapperTransitionEnd(function() {
     A()
    }), D.callPlugins("onAutoplayStop"), b.onAutoplayStop && D.fireCallback(b.onAutoplayStop, D)
   } else bb && clearInterval(bb), bb = void 0, D.callPlugins("onAutoplayStop"), b.onAutoplayStop && D.fireCallback(b.onAutoplayStop, D)
  }, D.loopCreated = !1, D.removeLoopedSlides = function() {
   if (D.loopCreated)
    for (var a = 0; a < D.slides.length; a++) D.slides[a].getData("looped") === !0 && D.wrapper.removeChild(D.slides[a])
  }, D.createLoop = function() {
   if (0 !== D.slides.length) {
    D.loopedSlides = "auto" === b.slidesPerView ? b.loopedSlides || 1 : Math.floor(b.slidesPerView) + b.loopAdditionalSlides, D.loopedSlides > D.slides.length && (D.loopedSlides = D.slides.length);
    var a, c = "",
     d = "",
     e = "",
     f = D.slides.length,
     g = Math.floor(D.loopedSlides / f),
     h = D.loopedSlides % f;
    for (a = 0; g * f > a; a++) {
     var i = a;
     if (a >= f) {
      var j = Math.floor(a / f);
      i = a - f * j
     }
     e += D.slides[i].outerHTML
    }
    for (a = 0; h > a; a++) d += u(b.slideDuplicateClass, D.slides[a].outerHTML);
    for (a = f - h; f > a; a++) c += u(b.slideDuplicateClass, D.slides[a].outerHTML);
    var k = c + e + E.innerHTML + e + d;
    for (E.innerHTML = k, D.loopCreated = !0, D.calcSlides(), a = 0; a < D.slides.length; a++)(a < D.loopedSlides || a >= D.slides.length - D.loopedSlides) && D.slides[a].setData("looped", !0);
    D.callPlugins("onCreateLoop")
   }
  }, D.fixLoop = function() {
   var a;
   D.activeIndex < D.loopedSlides ? (a = D.slides.length - 3 * D.loopedSlides + D.activeIndex, D.swipeTo(a, 0, !1)) : ("auto" === b.slidesPerView && D.activeIndex >= 2 * D.loopedSlides || D.activeIndex > D.slides.length - 2 * b.slidesPerView) && (a = -D.slides.length + D.activeIndex + D.loopedSlides, D.swipeTo(a, 0, !1))
  }, D.loadSlides = function() {
   var a = "";
   D.activeLoaderIndex = 0;
   for (var c = b.loader.slides, d = b.loader.loadAllSlides ? c.length : b.slidesPerView * (1 + b.loader.surroundGroups), e = 0; d > e; e++) a += "outer" === b.loader.slidesHTMLType ? c[e] : "<" + b.slideElement + ' class="' + b.slideClass + '" data-swiperindex="' + e + '">' + c[e] + "</" + b.slideElement + ">";
   D.wrapper.innerHTML = a, D.calcSlides(!0), b.loader.loadAllSlides || D.wrapperTransitionEnd(D.reloadSlides, !0)
  }, D.reloadSlides = function() {
   var a = b.loader.slides,
    c = parseInt(D.activeSlide().data("swiperindex"), 10);
   if (!(0 > c || c > a.length - 1)) {
    D.activeLoaderIndex = c;
    var d = Math.max(0, c - b.slidesPerView * b.loader.surroundGroups),
     e = Math.min(c + b.slidesPerView * (1 + b.loader.surroundGroups) - 1, a.length - 1);
    if (c > 0) {
     var f = -F * (c - d);
     D.setWrapperTranslate(f), D.setWrapperTransition(0)
    }
    var g;
    if ("reload" === b.loader.logic) {
     D.wrapper.innerHTML = "";
     var h = "";
     for (g = d; e >= g; g++) h += "outer" === b.loader.slidesHTMLType ? a[g] : "<" + b.slideElement + ' class="' + b.slideClass + '" data-swiperindex="' + g + '">' + a[g] + "</" + b.slideElement + ">";
     D.wrapper.innerHTML = h
    } else {
     var i = 1e3,
      j = 0;
     for (g = 0; g < D.slides.length; g++) {
      var k = D.slides[g].data("swiperindex");
      d > k || k > e ? D.wrapper.removeChild(D.slides[g]) : (i = Math.min(k, i), j = Math.max(k, j))
     }
     for (g = d; e >= g; g++) {
      var l;
      i > g && (l = document.createElement(b.slideElement), l.className = b.slideClass, l.setAttribute("data-swiperindex", g), l.innerHTML = a[g], D.wrapper.insertBefore(l, D.wrapper.firstChild)), g > j && (l = document.createElement(b.slideElement), l.className = b.slideClass, l.setAttribute("data-swiperindex", g), l.innerHTML = a[g], D.wrapper.appendChild(l))
     }
    }
    D.reInit(!0)
   }
  }, B()
 }
};
Swiper.prototype = {
 plugins: {},
 wrapperTransitionEnd: function(a, b) {
  "use strict";

  function c(h) {
   if (h.target === f && (a(e), e.params.queueEndCallbacks && (e._queueEndCallbacks = !1), !b))
    for (d = 0; d < g.length; d++) e.h.removeEventListener(f, g[d], c)
  }
  var d, e = this,
   f = e.wrapper,
   g = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"];
  if (a)
   for (d = 0; d < g.length; d++) e.h.addEventListener(f, g[d], c)
 },
 getWrapperTranslate: function(a) {
  "use strict";
  var b, c, d, e, f = this.wrapper;
  return "undefined" == typeof a && (a = "horizontal" === this.params.mode ? "x" : "y"), this.support.transforms && this.params.useCSS3Transforms ? (d = window.getComputedStyle(f, null), window.WebKitCSSMatrix ? e = new WebKitCSSMatrix("none" === d.webkitTransform ? "" : d.webkitTransform) : (e = d.MozTransform || d.OTransform || d.MsTransform || d.msTransform || d.transform || d.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), b = e.toString().split(",")), "x" === a && (c = window.WebKitCSSMatrix ? e.m41 : parseFloat(16 === b.length ? b[12] : b[4])), "y" === a && (c = window.WebKitCSSMatrix ? e.m42 : parseFloat(16 === b.length ? b[13] : b[5]))) : ("x" === a && (c = parseFloat(f.style.left, 10) || 0), "y" === a && (c = parseFloat(f.style.top, 10) || 0)), c || 0
 },
 setWrapperTranslate: function(a, b, c) {
  "use strict";
  var d, e = this.wrapper.style,
   f = {
    x: 0,
    y: 0,
    z: 0
   };
  3 === arguments.length ? (f.x = a, f.y = b, f.z = c) : ("undefined" == typeof b && (b = "horizontal" === this.params.mode ? "x" : "y"), f[b] = a), this.support.transforms && this.params.useCSS3Transforms ? (d = this.support.transforms3d ? "translate3d(" + f.x + "px, " + f.y + "px, " + f.z + "px)" : "translate(" + f.x + "px, " + f.y + "px)", e.webkitTransform = e.MsTransform = e.msTransform = e.MozTransform = e.OTransform = e.transform = d) : (e.left = f.x + "px", e.top = f.y + "px"), this.callPlugins("onSetWrapperTransform", f), this.params.onSetWrapperTransform && this.fireCallback(this.params.onSetWrapperTransform, this, f)
 },
 setWrapperTransition: function(a) {
  "use strict";
  var b = this.wrapper.style;
  b.webkitTransitionDuration = b.MsTransitionDuration = b.msTransitionDuration = b.MozTransitionDuration = b.OTransitionDuration = b.transitionDuration = a / 1e3 + "s", this.callPlugins("onSetWrapperTransition", {
   duration: a
  }), this.params.onSetWrapperTransition && this.fireCallback(this.params.onSetWrapperTransition, this, a)
 },
 h: {
  getWidth: function(a, b, c) {
   "use strict";
   var d = window.getComputedStyle(a, null).getPropertyValue("width"),
    e = parseFloat(d);
   return (isNaN(e) || d.indexOf("%") > 0 || 0 > e) && (e = a.offsetWidth - parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-left")) - parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-right"))), b && (e += parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-left")) + parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-right"))), c ? Math.ceil(e) : e
  },
  getHeight: function(a, b, c) {
   "use strict";
   if (b) return a.offsetHeight;
   var d = window.getComputedStyle(a, null).getPropertyValue("height"),
    e = parseFloat(d);
   return (isNaN(e) || d.indexOf("%") > 0 || 0 > e) && (e = a.offsetHeight - parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-top")) - parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-bottom"))), b && (e += parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-top")) + parseFloat(window.getComputedStyle(a, null).getPropertyValue("padding-bottom"))), c ? Math.ceil(e) : e
  },
  getOffset: function(a) {
   "use strict";
   var b = a.getBoundingClientRect(),
    c = document.body,
    d = a.clientTop || c.clientTop || 0,
    e = a.clientLeft || c.clientLeft || 0,
    f = window.pageYOffset || a.scrollTop,
    g = window.pageXOffset || a.scrollLeft;
   return document.documentElement && !window.pageYOffset && (f = document.documentElement.scrollTop, g = document.documentElement.scrollLeft), {
    top: b.top + f - d,
    left: b.left + g - e
   }
  },
  windowWidth: function() {
   "use strict";
   return window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : void 0
  },
  windowHeight: function() {
   "use strict";
   return window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : void 0
  },
  windowScroll: function() {
   "use strict";
   return "undefined" != typeof pageYOffset ? {
    left: window.pageXOffset,
    top: window.pageYOffset
   } : document.documentElement ? {
    left: document.documentElement.scrollLeft,
    top: document.documentElement.scrollTop
   } : void 0
  },
  addEventListener: function(a, b, c, d) {
   "use strict";
   "undefined" == typeof d && (d = !1), a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
  },
  removeEventListener: function(a, b, c, d) {
   "use strict";
   "undefined" == typeof d && (d = !1), a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
  }
 },
 setTransform: function(a, b) {
  "use strict";
  var c = a.style;
  c.webkitTransform = c.MsTransform = c.msTransform = c.MozTransform = c.OTransform = c.transform = b
 },
 setTranslate: function(a, b) {
  "use strict";
  var c = a.style,
   d = {
    x: b.x || 0,
    y: b.y || 0,
    z: b.z || 0
   },
   e = this.support.transforms3d ? "translate3d(" + d.x + "px," + d.y + "px," + d.z + "px)" : "translate(" + d.x + "px," + d.y + "px)";
  c.webkitTransform = c.MsTransform = c.msTransform = c.MozTransform = c.OTransform = c.transform = e, this.support.transforms || (c.left = d.x + "px", c.top = d.y + "px")
 },
 setTransition: function(a, b) {
  "use strict";
  var c = a.style;
  c.webkitTransitionDuration = c.MsTransitionDuration = c.msTransitionDuration = c.MozTransitionDuration = c.OTransitionDuration = c.transitionDuration = b + "ms"
 },
 support: {
  touch: window.Modernizr && Modernizr.touch === !0 || function() {
   "use strict";
   return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
  }(),
  transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function() {
   "use strict";
   var a = document.createElement("div").style;
   return "webkitPerspective" in a || "MozPerspective" in a || "OPerspective" in a || "MsPerspective" in a || "perspective" in a
  }(),
  transforms: window.Modernizr && Modernizr.csstransforms === !0 || function() {
   "use strict";
   var a = document.createElement("div").style;
   return "transform" in a || "WebkitTransform" in a || "MozTransform" in a || "msTransform" in a || "MsTransform" in a || "OTransform" in a
  }(),
  transitions: window.Modernizr && Modernizr.csstransitions === !0 || function() {
   "use strict";
   var a = document.createElement("div").style;
   return "transition" in a || "WebkitTransition" in a || "MozTransition" in a || "msTransition" in a || "MsTransition" in a || "OTransition" in a
  }(),
  classList: function() {
   "use strict";
   var a = document.createElement("div");
   return "classList" in a
  }()
 },
 browser: {
  ie8: function() {
   "use strict";
   var a = -1;
   if ("Microsoft Internet Explorer" === navigator.appName) {
    var b = navigator.userAgent,
     c = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
    null !== c.exec(b) && (a = parseFloat(RegExp.$1))
   }
   return -1 !== a && 9 > a
  }(),
  ie10: window.navigator.msPointerEnabled,
  ie11: window.navigator.pointerEnabled
 }
}, (window.jQuery || window.Zepto) && ! function(a) {
 "use strict";
 a.fn.swiper = function(b) {
  var c;
  return this.each(function(d) {
   var e = a(this),
    f = new Swiper(e[0], b);
   d || (c = f), e.data("swiper", f)
  }), c
 }
}(window.jQuery || window.Zepto), "undefined" != typeof module ? module.exports = Swiper : "function" == typeof define && define.amd && define([], function() {
 "use strict";
 return Swiper
});

/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
! function(t, i, s) {
 function e(t, e) {
  this.wrapper = "string" == typeof t ? i.querySelector(t) : t, this.scroller = this.wrapper.children[0], this.scrollerStyle = this.scroller.style, this.options = {
   zoomMin: 1,
   zoomMax: 4,
   startZoom: 1,
   resizeScrollbars: !0,
   mouseWheelSpeed: 20,
   snapThreshold: .334,
   startX: 0,
   startY: 0,
   scrollY: !0,
   directionLockThreshold: 5,
   momentum: !0,
   bounce: !0,
   bounceTime: 600,
   bounceEasing: "",
   preventDefault: !0,
   preventDefaultException: {
    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
   },
   HWCompositing: !0,
   useTransition: !0,
   useTransform: !0
  };
  for (var o in e) this.options[o] = e[o];
  this.translateZ = this.options.HWCompositing && h.hasPerspective ? " translateZ(0)" : "", this.options.useTransition = h.hasTransition && this.options.useTransition, this.options.useTransform = h.hasTransform && this.options.useTransform, this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? h.ease[this.options.bounceEasing] || h.ease.circular : this.options.bounceEasing, this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, this.options.tap === !0 && (this.options.tap = "tap"), "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1), this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1, this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, this.scale = s.min(s.max(this.options.startZoom, this.options.zoomMin), this.options.zoomMax), this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), this.enable()
 }

 function o(t, s, e) {
  var o = i.createElement("div"),
   n = i.createElement("div");
  return e === !0 && (o.style.cssText = "position:absolute;z-index:9999", n.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"), n.className = "iScrollIndicator", "h" == t ? (e === !0 && (o.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", n.style.height = "100%"), o.className = "iScrollHorizontalScrollbar") : (e === !0 && (o.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", n.style.width = "100%"), o.className = "iScrollVerticalScrollbar"), o.style.cssText += ";overflow:hidden", s || (o.style.pointerEvents = "none"), o.appendChild(n), o
 }

 function n(s, e) {
  this.wrapper = "string" == typeof e.el ? i.querySelector(e.el) : e.el, this.wrapperStyle = this.wrapper.style, this.indicator = this.wrapper.children[0], this.indicatorStyle = this.indicator.style, this.scroller = s, this.options = {
   listenX: !0,
   listenY: !0,
   interactive: !1,
   resize: !0,
   defaultScrollbars: !1,
   shrink: !1,
   fade: !1,
   speedRatioX: 0,
   speedRatioY: 0
  };
  for (var o in e) this.options[o] = e[o];
  this.sizeRatioX = 1, this.sizeRatioY = 1, this.maxPosX = 0, this.maxPosY = 0, this.options.interactive && (this.options.disableTouch || (h.addEvent(this.indicator, "touchstart", this), h.addEvent(t, "touchend", this)), this.options.disablePointer || (h.addEvent(this.indicator, h.prefixPointerEvent("pointerdown"), this), h.addEvent(t, h.prefixPointerEvent("pointerup"), this)), this.options.disableMouse || (h.addEvent(this.indicator, "mousedown", this), h.addEvent(t, "mouseup", this))), this.options.fade && (this.wrapperStyle[h.style.transform] = this.scroller.translateZ, this.wrapperStyle[h.style.transitionDuration] = h.isBadAndroid ? "0.001s" : "0ms", this.wrapperStyle.opacity = "0")
 }
 var r = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame || function(i) {
   t.setTimeout(i, 1e3 / 60)
  },
  h = function() {
   function e(t) {
    return r === !1 ? !1 : "" === r ? t : r + t.charAt(0).toUpperCase() + t.substr(1)
   }
   var o = {},
    n = i.createElement("div").style,
    r = function() {
     for (var t, i = ["t", "webkitT", "MozT", "msT", "OT"], s = 0, e = i.length; e > s; s++)
      if (t = i[s] + "ransform", t in n) return i[s].substr(0, i[s].length - 1);
     return !1
    }();
   o.getTime = Date.now || function() {
    return (new Date).getTime()
   }, o.extend = function(t, i) {
    for (var s in i) t[s] = i[s]
   }, o.addEvent = function(t, i, s, e) {
    t.addEventListener(i, s, !!e)
   }, o.removeEvent = function(t, i, s, e) {
    t.removeEventListener(i, s, !!e)
   }, o.prefixPointerEvent = function(i) {
    return t.MSPointerEvent ? "MSPointer" + i.charAt(9).toUpperCase() + i.substr(10) : i
   }, o.momentum = function(t, i, e, o, n, r) {
    var h, a, l = t - i,
     c = s.abs(l) / e;
    return r = void 0 === r ? 6e-4 : r, h = t + c * c / (2 * r) * (0 > l ? -1 : 1), a = c / r, o > h ? (h = n ? o - n / 2.5 * (c / 8) : o, l = s.abs(h - t), a = l / c) : h > 0 && (h = n ? n / 2.5 * (c / 8) : 0, l = s.abs(t) + h, a = l / c), {
     destination: s.round(h),
     duration: a
    }
   };
   var h = e("transform");
   return o.extend(o, {
    hasTransform: h !== !1,
    hasPerspective: e("perspective") in n,
    hasTouch: "ontouchstart" in t,
    hasPointer: t.PointerEvent || t.MSPointerEvent,
    hasTransition: e("transition") in n
   }), o.isBadAndroid = /Android /.test(t.navigator.appVersion) && !/Chrome\/\d/.test(t.navigator.appVersion), o.extend(o.style = {}, {
    transform: h,
    transitionTimingFunction: e("transitionTimingFunction"),
    transitionDuration: e("transitionDuration"),
    transitionDelay: e("transitionDelay"),
    transformOrigin: e("transformOrigin")
   }), o.hasClass = function(t, i) {
    var s = new RegExp("(^|\\s)" + i + "(\\s|$)");
    return s.test(t.className)
   }, o.addClass = function(t, i) {
    if (!o.hasClass(t, i)) {
     var s = t.className.split(" ");
     s.push(i), t.className = s.join(" ")
    }
   }, o.removeClass = function(t, i) {
    if (o.hasClass(t, i)) {
     var s = new RegExp("(^|\\s)" + i + "(\\s|$)", "g");
     t.className = t.className.replace(s, " ")
    }
   }, o.offset = function(t) {
    for (var i = -t.offsetLeft, s = -t.offsetTop; t = t.offsetParent;) i -= t.offsetLeft, s -= t.offsetTop;
    return {
     left: i,
     top: s
    }
   }, o.preventDefaultException = function(t, i) {
    for (var s in i)
     if (i[s].test(t[s])) return !0;
    return !1
   }, o.extend(o.eventType = {}, {
    touchstart: 1,
    touchmove: 1,
    touchend: 1,
    mousedown: 2,
    mousemove: 2,
    mouseup: 2,
    pointerdown: 3,
    pointermove: 3,
    pointerup: 3,
    MSPointerDown: 3,
    MSPointerMove: 3,
    MSPointerUp: 3
   }), o.extend(o.ease = {}, {
    quadratic: {
     style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
     fn: function(t) {
      return t * (2 - t)
     }
    },
    circular: {
     style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
     fn: function(t) {
      return s.sqrt(1 - --t * t)
     }
    },
    back: {
     style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
     fn: function(t) {
      var i = 4;
      return (t -= 1) * t * ((i + 1) * t + i) + 1
     }
    },
    bounce: {
     style: "",
     fn: function(t) {
      return (t /= 1) < 1 / 2.75 ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
     }
    },
    elastic: {
     style: "",
     fn: function(t) {
      var i = .22,
       e = .4;
      return 0 === t ? 0 : 1 == t ? 1 : e * s.pow(2, -10 * t) * s.sin(2 * (t - i / 4) * s.PI / i) + 1
     }
    }
   }), o.tap = function(t, s) {
    var e = i.createEvent("Event");
    e.initEvent(s, !0, !0), e.pageX = t.pageX, e.pageY = t.pageY, t.target.dispatchEvent(e)
   }, o.click = function(t) {
    var s, e = t.target;
    /(SELECT|INPUT|TEXTAREA|BUTTON)/i.test(e.tagName) || (s = i.createEvent("MouseEvents"), s.initMouseEvent("click", !0, !0, t.view, 1, e.screenX, e.screenY, e.clientX, e.clientY, t.ctrlKey, t.altKey, t.shiftKey, t.metaKey, 0, null), s._constructed = !0, e.dispatchEvent(s))
   }, o
  }();
 e.prototype = {
  version: "5.1.3",
  _init: function() {
   this._initEvents(), this.options.zoom && this._initZoom(), (this.options.scrollbars || this.options.indicators) && this._initIndicators(), this.options.mouseWheel && this._initWheel(), this.options.snap && this._initSnap(), this.options.keyBindings && this._initKeys()
  },
  destroy: function() {
   this._initEvents(!0), this._execEvent("destroy")
  },
  _transitionEnd: function(t) {
   t.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
  },
  _start: function(t) {
   if (!(1 != h.eventType[t.type] && 0 !== t.button || !this.enabled || this.initiated && h.eventType[t.type] !== this.initiated)) {
    !this.options.preventDefault || h.isBadAndroid || h.preventDefaultException(t.target, this.options.preventDefaultException) || t.preventDefault();
    var i, e = t.touches ? t.touches[0] : t;
    this.initiated = h.eventType[t.type], this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this._transitionTime(), this.startTime = h.getTime(), this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, i = this.getComputedPosition(), this._translate(s.round(i.x), s.round(i.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = e.pageX, this.pointY = e.pageY, this._execEvent("beforeScrollStart")
   }
  },
  _move: function(t) {
   if (this.enabled && h.eventType[t.type] === this.initiated) {
    this.options.preventDefault && t.preventDefault();
    var i, e, o, n, r = t.touches ? t.touches[0] : t,
     a = r.pageX - this.pointX,
     l = r.pageY - this.pointY,
     c = h.getTime();
    if (this.pointX = r.pageX, this.pointY = r.pageY, this.distX += a, this.distY += l, o = s.abs(this.distX), n = s.abs(this.distY), !(c - this.endTime > 300 && 10 > o && 10 > n)) {
     if (this.directionLocked || this.options.freeScroll || (o > n + this.options.directionLockThreshold ? this.directionLocked = "h" : n >= o + this.options.directionLockThreshold ? this.directionLocked = "v" : this.directionLocked = "n"), "h" == this.directionLocked) {
      if ("vertical" == this.options.eventPassthrough) t.preventDefault();
      else if ("horizontal" == this.options.eventPassthrough) return void(this.initiated = !1);
      l = 0
     } else if ("v" == this.directionLocked) {
      if ("horizontal" == this.options.eventPassthrough) t.preventDefault();
      else if ("vertical" == this.options.eventPassthrough) return void(this.initiated = !1);
      a = 0
     }
     a = this.hasHorizontalScroll ? a : 0, l = this.hasVerticalScroll ? l : 0, i = this.x + a, e = this.y + l, (i > 0 || i < this.maxScrollX) && (i = this.options.bounce ? this.x + a / 3 : i > 0 ? 0 : this.maxScrollX), (e > 0 || e < this.maxScrollY) && (e = this.options.bounce ? this.y + l / 3 : e > 0 ? 0 : this.maxScrollY), this.directionX = a > 0 ? -1 : 0 > a ? 1 : 0, this.directionY = l > 0 ? -1 : 0 > l ? 1 : 0, this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(i, e), c - this.startTime > 300 && (this.startTime = c, this.startX = this.x, this.startY = this.y)
    }
   }
  },
  _end: function(t) {
   if (this.enabled && h.eventType[t.type] === this.initiated) {
    this.options.preventDefault && !h.preventDefaultException(t.target, this.options.preventDefaultException) && t.preventDefault();
    var i, e, o = (t.changedTouches ? t.changedTouches[0] : t, h.getTime() - this.startTime),
     n = s.round(this.x),
     r = s.round(this.y),
     a = s.abs(n - this.startX),
     l = s.abs(r - this.startY),
     c = 0,
     p = "";
    if (this.isInTransition = 0, this.initiated = 0, this.endTime = h.getTime(), !this.resetPosition(this.options.bounceTime)) {
     if (this.scrollTo(n, r), !this.moved) return this.options.tap && h.tap(t, this.options.tap), this.options.click && h.click(t), void this._execEvent("scrollCancel");
     if (this._events.flick && 200 > o && 100 > a && 100 > l) return void this._execEvent("flick");
     if (this.options.momentum && 300 > o && (i = this.hasHorizontalScroll ? h.momentum(this.x, this.startX, o, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
       destination: n,
       duration: 0
      }, e = this.hasVerticalScroll ? h.momentum(this.y, this.startY, o, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
       destination: r,
       duration: 0
      }, n = i.destination, r = e.destination, c = s.max(i.duration, e.duration), this.isInTransition = 1), this.options.snap) {
      var d = this._nearestSnap(n, r);
      this.currentPage = d, c = this.options.snapSpeed || s.max(s.max(s.min(s.abs(n - d.x), 1e3), s.min(s.abs(r - d.y), 1e3)), 300), n = d.x, r = d.y, this.directionX = 0, this.directionY = 0, p = this.options.bounceEasing
     }
     return n != this.x || r != this.y ? ((n > 0 || n < this.maxScrollX || r > 0 || r < this.maxScrollY) && (p = h.ease.quadratic), void this.scrollTo(n, r, c, p)) : void this._execEvent("scrollEnd")
    }
   }
  },
  _resize: function() {
   var t = this;
   clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
    t.refresh()
   }, this.options.resizePolling)
  },
  resetPosition: function(t) {
   var i = this.x,
    s = this.y;
   return t = t || 0, !this.hasHorizontalScroll || this.x > 0 ? i = 0 : this.x < this.maxScrollX && (i = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? s = 0 : this.y < this.maxScrollY && (s = this.maxScrollY), i == this.x && s == this.y ? !1 : (this.scrollTo(i, s, t, this.options.bounceEasing), !0)
  },
  disable: function() {
   this.enabled = !1
  },
  enable: function() {
   this.enabled = !0
  },
  refresh: function() {
   this.wrapper.offsetHeight;
   this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = s.round(this.scroller.offsetWidth * this.scale), this.scrollerHeight = s.round(this.scroller.offsetHeight * this.scale), this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = h.offset(this.wrapper), this._execEvent("refresh"), this.resetPosition()
  },
  on: function(t, i) {
   this._events[t] || (this._events[t] = []), this._events[t].push(i)
  },
  off: function(t, i) {
   if (this._events[t]) {
    var s = this._events[t].indexOf(i);
    s > -1 && this._events[t].splice(s, 1)
   }
  },
  _execEvent: function(t) {
   if (this._events[t]) {
    var i = 0,
     s = this._events[t].length;
    if (s)
     for (; s > i; i++) this._events[t][i].apply(this, [].slice.call(arguments, 1))
   }
  },
  scrollBy: function(t, i, s, e) {
   t = this.x + t, i = this.y + i, s = s || 0, this.scrollTo(t, i, s, e)
  },
  scrollTo: function(t, i, s, e) {
   e = e || h.ease.circular, this.isInTransition = this.options.useTransition && s > 0, !s || this.options.useTransition && e.style ? (this._transitionTimingFunction(e.style), this._transitionTime(s), this._translate(t, i)) : this._animate(t, i, s, e.fn)
  },
  scrollToElement: function(t, i, e, o, n) {
   if (t = t.nodeType ? t : this.scroller.querySelector(t)) {
    var r = h.offset(t);
    r.left -= this.wrapperOffset.left, r.top -= this.wrapperOffset.top, e === !0 && (e = s.round(t.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), o === !0 && (o = s.round(t.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), r.left -= e || 0, r.top -= o || 0, r.left = r.left > 0 ? 0 : r.left < this.maxScrollX ? this.maxScrollX : r.left, r.top = r.top > 0 ? 0 : r.top < this.maxScrollY ? this.maxScrollY : r.top, i = void 0 === i || null === i || "auto" === i ? s.max(s.abs(this.x - r.left), s.abs(this.y - r.top)) : i, this.scrollTo(r.left, r.top, i, n)
   }
  },
  _transitionTime: function(t) {
   if (t = t || 0, this.scrollerStyle[h.style.transitionDuration] = t + "ms", !t && h.isBadAndroid && (this.scrollerStyle[h.style.transitionDuration] = "0.001s"), this.indicators)
    for (var i = this.indicators.length; i--;) this.indicators[i].transitionTime(t)
  },
  _transitionTimingFunction: function(t) {
   if (this.scrollerStyle[h.style.transitionTimingFunction] = t, this.indicators)
    for (var i = this.indicators.length; i--;) this.indicators[i].transitionTimingFunction(t)
  },
  _translate: function(t, i) {
   if (this.options.useTransform ? this.scrollerStyle[h.style.transform] = "translate(" + t + "px," + i + "px) scale(" + this.scale + ") " + this.translateZ : (t = s.round(t), i = s.round(i), this.scrollerStyle.left = t + "px", this.scrollerStyle.top = i + "px"), this.x = t, this.y = i, this.indicators)
    for (var e = this.indicators.length; e--;) this.indicators[e].updatePosition()
  },
  _initEvents: function(i) {
   var s = i ? h.removeEvent : h.addEvent,
    e = this.options.bindToWrapper ? this.wrapper : t;
   s(t, "orientationchange", this), s(t, "resize", this), this.options.click && s(this.wrapper, "click", this, !0), this.options.disableMouse || (s(this.wrapper, "mousedown", this), s(e, "mousemove", this), s(e, "mousecancel", this), s(e, "mouseup", this)), h.hasPointer && !this.options.disablePointer && (s(this.wrapper, h.prefixPointerEvent("pointerdown"), this), s(e, h.prefixPointerEvent("pointermove"), this), s(e, h.prefixPointerEvent("pointercancel"), this), s(e, h.prefixPointerEvent("pointerup"), this)), h.hasTouch && !this.options.disableTouch && (s(this.wrapper, "touchstart", this), s(e, "touchmove", this), s(e, "touchcancel", this), s(e, "touchend", this)), s(this.scroller, "transitionend", this), s(this.scroller, "webkitTransitionEnd", this), s(this.scroller, "oTransitionEnd", this), s(this.scroller, "MSTransitionEnd", this)
  },
  getComputedPosition: function() {
   var i, s, e = t.getComputedStyle(this.scroller, null);
   return this.options.useTransform ? (e = e[h.style.transform].split(")")[0].split(", "), i = +(e[12] || e[4]), s = +(e[13] || e[5])) : (i = +e.left.replace(/[^-\d.]/g, ""), s = +e.top.replace(/[^-\d.]/g, "")), {
    x: i,
    y: s
   }
  },
  _initIndicators: function() {
   function t(t) {
    for (var i = h.indicators.length; i--;) t.call(h.indicators[i])
   }
   var i, s = this.options.interactiveScrollbars,
    e = "string" != typeof this.options.scrollbars,
    r = [],
    h = this;
   this.indicators = [], this.options.scrollbars && (this.options.scrollY && (i = {
    el: o("v", s, this.options.scrollbars),
    interactive: s,
    defaultScrollbars: !0,
    customStyle: e,
    resize: this.options.resizeScrollbars,
    shrink: this.options.shrinkScrollbars,
    fade: this.options.fadeScrollbars,
    listenX: !1
   }, this.wrapper.appendChild(i.el), r.push(i)), this.options.scrollX && (i = {
    el: o("h", s, this.options.scrollbars),
    interactive: s,
    defaultScrollbars: !0,
    customStyle: e,
    resize: this.options.resizeScrollbars,
    shrink: this.options.shrinkScrollbars,
    fade: this.options.fadeScrollbars,
    listenY: !1
   }, this.wrapper.appendChild(i.el), r.push(i))), this.options.indicators && (r = r.concat(this.options.indicators));
   for (var a = r.length; a--;) this.indicators.push(new n(this, r[a]));
   this.options.fadeScrollbars && (this.on("scrollEnd", function() {
    t(function() {
     this.fade()
    })
   }), this.on("scrollCancel", function() {
    t(function() {
     this.fade()
    })
   }), this.on("scrollStart", function() {
    t(function() {
     this.fade(1)
    })
   }), this.on("beforeScrollStart", function() {
    t(function() {
     this.fade(1, !0)
    })
   })), this.on("refresh", function() {
    t(function() {
     this.refresh()
    })
   }), this.on("destroy", function() {
    t(function() {
     this.destroy()
    }), delete this.indicators
   })
  },
  _initZoom: function() {
   this.scrollerStyle[h.style.transformOrigin] = "0 0"
  },
  _zoomStart: function(t) {
   var i = s.abs(t.touches[0].pageX - t.touches[1].pageX),
    e = s.abs(t.touches[0].pageY - t.touches[1].pageY);
   this.touchesDistanceStart = s.sqrt(i * i + e * e), this.startScale = this.scale, this.originX = s.abs(t.touches[0].pageX + t.touches[1].pageX) / 2 + this.wrapperOffset.left - this.x, this.originY = s.abs(t.touches[0].pageY + t.touches[1].pageY) / 2 + this.wrapperOffset.top - this.y, this._execEvent("zoomStart")
  },
  _zoom: function(t) {
   if (this.enabled && h.eventType[t.type] === this.initiated) {
    this.options.preventDefault && t.preventDefault();
    var i, e, o, n = s.abs(t.touches[0].pageX - t.touches[1].pageX),
     r = s.abs(t.touches[0].pageY - t.touches[1].pageY),
     a = s.sqrt(n * n + r * r),
     l = 1 / this.touchesDistanceStart * a * this.startScale;
    this.scaled = !0, l < this.options.zoomMin ? l = .5 * this.options.zoomMin * s.pow(2, l / this.options.zoomMin) : l > this.options.zoomMax && (l = 2 * this.options.zoomMax * s.pow(.5, this.options.zoomMax / l)), i = l / this.startScale, e = this.originX - this.originX * i + this.startX, o = this.originY - this.originY * i + this.startY, this.scale = l, this.scrollTo(e, o, 0)
   }
  },
  _zoomEnd: function(t) {
   if (this.enabled && h.eventType[t.type] === this.initiated) {
    this.options.preventDefault && t.preventDefault();
    var i, s, e;
    this.isInTransition = 0, this.initiated = 0, this.scale > this.options.zoomMax ? this.scale = this.options.zoomMax : this.scale < this.options.zoomMin && (this.scale = this.options.zoomMin), this.refresh(), e = this.scale / this.startScale, i = this.originX - this.originX * e + this.startX, s = this.originY - this.originY * e + this.startY, i > 0 ? i = 0 : i < this.maxScrollX && (i = this.maxScrollX), s > 0 ? s = 0 : s < this.maxScrollY && (s = this.maxScrollY), (this.x != i || this.y != s) && this.scrollTo(i, s, this.options.bounceTime), this.scaled = !1, this._execEvent("zoomEnd")
   }
  },
  zoom: function(t, i, s, e) {
   if (t < this.options.zoomMin ? t = this.options.zoomMin : t > this.options.zoomMax && (t = this.options.zoomMax), t != this.scale) {
    var o = t / this.scale;
    i = void 0 === i ? this.wrapperWidth / 2 : i, s = void 0 === s ? this.wrapperHeight / 2 : s, e = void 0 === e ? 300 : e, i = i + this.wrapperOffset.left - this.x, s = s + this.wrapperOffset.top - this.y, i = i - i * o + this.x, s = s - s * o + this.y, this.scale = t, this.refresh(), i > 0 ? i = 0 : i < this.maxScrollX && (i = this.maxScrollX), s > 0 ? s = 0 : s < this.maxScrollY && (s = this.maxScrollY), this.scrollTo(i, s, e)
   }
  },
  _wheelZoom: function(t) {
   var i, e, o = this;
   if (clearTimeout(this.wheelTimeout), this.wheelTimeout = setTimeout(function() {
     o._execEvent("zoomEnd")
    }, 400), "deltaX" in t) i = -t.deltaY / s.abs(t.deltaY);
   else if ("wheelDeltaX" in t) i = t.wheelDeltaY / s.abs(t.wheelDeltaY);
   else if ("wheelDelta" in t) i = t.wheelDelta / s.abs(t.wheelDelta);
   else {
    if (!("detail" in t)) return;
    i = -t.detail / s.abs(t.wheelDelta)
   }
   e = this.scale + i / 5, this.zoom(e, t.pageX, t.pageY, 0)
  },
  _initWheel: function() {
   h.addEvent(this.wrapper, "wheel", this), h.addEvent(this.wrapper, "mousewheel", this), h.addEvent(this.wrapper, "DOMMouseScroll", this), this.on("destroy", function() {
    h.removeEvent(this.wrapper, "wheel", this), h.removeEvent(this.wrapper, "mousewheel", this), h.removeEvent(this.wrapper, "DOMMouseScroll", this)
   })
  },
  _wheel: function(t) {
   if (this.enabled) {
    t.preventDefault(), t.stopPropagation();
    var i, e, o, n, r = this;
    if (void 0 === this.wheelTimeout && r._execEvent("scrollStart"), clearTimeout(this.wheelTimeout), this.wheelTimeout = setTimeout(function() {
      r._execEvent("scrollEnd"), r.wheelTimeout = void 0
     }, 400), "deltaX" in t) 1 === t.deltaMode ? (i = -t.deltaX * this.options.mouseWheelSpeed, e = -t.deltaY * this.options.mouseWheelSpeed) : (i = -t.deltaX, e = -t.deltaY);
    else if ("wheelDeltaX" in t) i = t.wheelDeltaX / 120 * this.options.mouseWheelSpeed, e = t.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
    else if ("wheelDelta" in t) i = e = t.wheelDelta / 120 * this.options.mouseWheelSpeed;
    else {
     if (!("detail" in t)) return;
     i = e = -t.detail / 3 * this.options.mouseWheelSpeed
    }
    if (i *= this.options.invertWheelDirection, e *= this.options.invertWheelDirection, this.hasVerticalScroll || (i = e, e = 0), this.options.snap) return o = this.currentPage.pageX, n = this.currentPage.pageY, i > 0 ? o-- : 0 > i && o++, e > 0 ? n-- : 0 > e && n++, void this.goToPage(o, n);
    o = this.x + s.round(this.hasHorizontalScroll ? i : 0), n = this.y + s.round(this.hasVerticalScroll ? e : 0), o > 0 ? o = 0 : o < this.maxScrollX && (o = this.maxScrollX), n > 0 ? n = 0 : n < this.maxScrollY && (n = this.maxScrollY), this.scrollTo(o, n, 0)
   }
  },
  _initSnap: function() {
   this.currentPage = {}, "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)), this.on("refresh", function() {
    var t, i, e, o, n, r, h = 0,
     a = 0,
     l = 0,
     c = this.options.snapStepX || this.wrapperWidth,
     p = this.options.snapStepY || this.wrapperHeight;
    if (this.pages = [], this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
     if (this.options.snap === !0)
      for (e = s.round(c / 2), o = s.round(p / 2); l > -this.scrollerWidth;) {
       for (this.pages[h] = [], t = 0, n = 0; n > -this.scrollerHeight;) this.pages[h][t] = {
        x: s.max(l, this.maxScrollX),
        y: s.max(n, this.maxScrollY),
        width: c,
        height: p,
        cx: l - e,
        cy: n - o
       }, n -= p, t++;
       l -= c, h++
      } else
       for (r = this.options.snap, t = r.length, i = -1; t > h; h++)(0 === h || r[h].offsetLeft <= r[h - 1].offsetLeft) && (a = 0, i++), this.pages[a] || (this.pages[a] = []), l = s.max(-r[h].offsetLeft, this.maxScrollX), n = s.max(-r[h].offsetTop, this.maxScrollY), e = l - s.round(r[h].offsetWidth / 2), o = n - s.round(r[h].offsetHeight / 2), this.pages[a][i] = {
        x: l,
        y: n,
        width: r[h].offsetWidth,
        height: r[h].offsetHeight,
        cx: e,
        cy: o
       }, l > this.maxScrollX && a++;
     this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0), this.options.snapThreshold % 1 === 0 ? (this.snapThresholdX = this.options.snapThreshold, this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), this.snapThresholdY = s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
    }
   }), this.on("flick", function() {
    var t = this.options.snapSpeed || s.max(s.max(s.min(s.abs(this.x - this.startX), 1e3), s.min(s.abs(this.y - this.startY), 1e3)), 300);
    this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, t)
   })
  },
  _nearestSnap: function(t, i) {
   if (!this.pages.length) return {
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0
   };
   var e = 0,
    o = this.pages.length,
    n = 0;
   if (s.abs(t - this.absStartX) < this.snapThresholdX && s.abs(i - this.absStartY) < this.snapThresholdY) return this.currentPage;
   for (t > 0 ? t = 0 : t < this.maxScrollX && (t = this.maxScrollX), i > 0 ? i = 0 : i < this.maxScrollY && (i = this.maxScrollY); o > e; e++)
    if (t >= this.pages[e][0].cx) {
     t = this.pages[e][0].x;
     break
    } for (o = this.pages[e].length; o > n; n++)
    if (i >= this.pages[0][n].cy) {
     i = this.pages[0][n].y;
     break
    } return e == this.currentPage.pageX && (e += this.directionX, 0 > e ? e = 0 : e >= this.pages.length && (e = this.pages.length - 1), t = this.pages[e][0].x), n == this.currentPage.pageY && (n += this.directionY, 0 > n ? n = 0 : n >= this.pages[0].length && (n = this.pages[0].length - 1), i = this.pages[0][n].y), {
    x: t,
    y: i,
    pageX: e,
    pageY: n
   }
  },
  goToPage: function(t, i, e, o) {
   o = o || this.options.bounceEasing, t >= this.pages.length ? t = this.pages.length - 1 : 0 > t && (t = 0), i >= this.pages[t].length ? i = this.pages[t].length - 1 : 0 > i && (i = 0);
   var n = this.pages[t][i].x,
    r = this.pages[t][i].y;
   e = void 0 === e ? this.options.snapSpeed || s.max(s.max(s.min(s.abs(n - this.x), 1e3), s.min(s.abs(r - this.y), 1e3)), 300) : e, this.currentPage = {
    x: n,
    y: r,
    pageX: t,
    pageY: i
   }, this.scrollTo(n, r, e, o)
  },
  next: function(t, i) {
   var s = this.currentPage.pageX,
    e = this.currentPage.pageY;
   s++, s >= this.pages.length && this.hasVerticalScroll && (s = 0, e++), this.goToPage(s, e, t, i)
  },
  prev: function(t, i) {
   var s = this.currentPage.pageX,
    e = this.currentPage.pageY;
   s--, 0 > s && this.hasVerticalScroll && (s = 0, e--), this.goToPage(s, e, t, i)
  },
  _initKeys: function(i) {
   var s, e = {
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40
   };
   if ("object" == typeof this.options.keyBindings)
    for (s in this.options.keyBindings) "string" == typeof this.options.keyBindings[s] && (this.options.keyBindings[s] = this.options.keyBindings[s].toUpperCase().charCodeAt(0));
   else this.options.keyBindings = {};
   for (s in e) this.options.keyBindings[s] = this.options.keyBindings[s] || e[s];
   h.addEvent(t, "keydown", this), this.on("destroy", function() {
    h.removeEvent(t, "keydown", this)
   })
  },
  _key: function(t) {
   if (this.enabled) {
    var i, e = this.options.snap,
     o = e ? this.currentPage.pageX : this.x,
     n = e ? this.currentPage.pageY : this.y,
     r = h.getTime(),
     a = this.keyTime || 0,
     l = .25;
    switch (this.options.useTransition && this.isInTransition && (i = this.getComputedPosition(), this._translate(s.round(i.x), s.round(i.y)), this.isInTransition = !1), this.keyAcceleration = 200 > r - a ? s.min(this.keyAcceleration + l, 50) : 0, t.keyCode) {
     case this.options.keyBindings.pageUp:
      this.hasHorizontalScroll && !this.hasVerticalScroll ? o += e ? 1 : this.wrapperWidth : n += e ? 1 : this.wrapperHeight;
      break;
     case this.options.keyBindings.pageDown:
      this.hasHorizontalScroll && !this.hasVerticalScroll ? o -= e ? 1 : this.wrapperWidth : n -= e ? 1 : this.wrapperHeight;
      break;
     case this.options.keyBindings.end:
      o = e ? this.pages.length - 1 : this.maxScrollX, n = e ? this.pages[0].length - 1 : this.maxScrollY;
      break;
     case this.options.keyBindings.home:
      o = 0, n = 0;
      break;
     case this.options.keyBindings.left:
      o += e ? -1 : 5 + this.keyAcceleration >> 0;
      break;
     case this.options.keyBindings.up:
      n += e ? 1 : 5 + this.keyAcceleration >> 0;
      break;
     case this.options.keyBindings.right:
      o -= e ? -1 : 5 + this.keyAcceleration >> 0;
      break;
     case this.options.keyBindings.down:
      n -= e ? 1 : 5 + this.keyAcceleration >> 0;
      break;
     default:
      return
    }
    if (e) return void this.goToPage(o, n);
    o > 0 ? (o = 0, this.keyAcceleration = 0) : o < this.maxScrollX && (o = this.maxScrollX, this.keyAcceleration = 0), n > 0 ? (n = 0, this.keyAcceleration = 0) : n < this.maxScrollY && (n = this.maxScrollY, this.keyAcceleration = 0), this.scrollTo(o, n, 0), this.keyTime = r
   }
  },
  _animate: function(t, i, s, e) {
   function o() {
    var d, u, m, f = h.getTime();
    return f >= p ? (n.isAnimating = !1, n._translate(t, i), void(n.resetPosition(n.options.bounceTime) || n._execEvent("scrollEnd"))) : (f = (f - c) / s, m = e(f), d = (t - a) * m + a, u = (i - l) * m + l, n._translate(d, u), void(n.isAnimating && r(o)))
   }
   var n = this,
    a = this.x,
    l = this.y,
    c = h.getTime(),
    p = c + s;
   this.isAnimating = !0, o()
  },
  handleEvent: function(t) {
   switch (t.type) {
    case "touchstart":
    case "pointerdown":
    case "MSPointerDown":
    case "mousedown":
     this._start(t), this.options.zoom && t.touches && t.touches.length > 1 && this._zoomStart(t);
     break;
    case "touchmove":
    case "pointermove":
    case "MSPointerMove":
    case "mousemove":
     if (this.options.zoom && t.touches && t.touches[1]) return void this._zoom(t);
     this._move(t);
     break;
    case "touchend":
    case "pointerup":
    case "MSPointerUp":
    case "mouseup":
    case "touchcancel":
    case "pointercancel":
    case "MSPointerCancel":
    case "mousecancel":
     if (this.scaled) return void this._zoomEnd(t);
     this._end(t);
     break;
    case "orientationchange":
    case "resize":
     this._resize();
     break;
    case "transitionend":
    case "webkitTransitionEnd":
    case "oTransitionEnd":
    case "MSTransitionEnd":
     this._transitionEnd(t);
     break;
    case "wheel":
    case "DOMMouseScroll":
    case "mousewheel":
     if ("zoom" == this.options.wheelAction) return void this._wheelZoom(t);
     this._wheel(t);
     break;
    case "keydown":
     this._key(t)
   }
  }
 }, n.prototype = {
  handleEvent: function(t) {
   switch (t.type) {
    case "touchstart":
    case "pointerdown":
    case "MSPointerDown":
    case "mousedown":
     this._start(t);
     break;
    case "touchmove":
    case "pointermove":
    case "MSPointerMove":
    case "mousemove":
     this._move(t);
     break;
    case "touchend":
    case "pointerup":
    case "MSPointerUp":
    case "mouseup":
    case "touchcancel":
    case "pointercancel":
    case "MSPointerCancel":
    case "mousecancel":
     this._end(t)
   }
  },
  destroy: function() {
   this.options.interactive && (h.removeEvent(this.indicator, "touchstart", this), h.removeEvent(this.indicator, h.prefixPointerEvent("pointerdown"), this), h.removeEvent(this.indicator, "mousedown", this), h.removeEvent(t, "touchmove", this), h.removeEvent(t, h.prefixPointerEvent("pointermove"), this), h.removeEvent(t, "mousemove", this), h.removeEvent(t, "touchend", this), h.removeEvent(t, h.prefixPointerEvent("pointerup"), this), h.removeEvent(t, "mouseup", this)), this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper)
  },
  _start: function(i) {
   var s = i.touches ? i.touches[0] : i;
   i.preventDefault(), i.stopPropagation(), this.transitionTime(), this.initiated = !0, this.moved = !1, this.lastPointX = s.pageX, this.lastPointY = s.pageY, this.startTime = h.getTime(), this.options.disableTouch || h.addEvent(t, "touchmove", this), this.options.disablePointer || h.addEvent(t, h.prefixPointerEvent("pointermove"), this), this.options.disableMouse || h.addEvent(t, "mousemove", this), this.scroller._execEvent("beforeScrollStart")
  },
  _move: function(t) {
   {
    var i, s, e, o, n = t.touches ? t.touches[0] : t;
    h.getTime()
   }
   this.moved || this.scroller._execEvent("scrollStart"), this.moved = !0, i = n.pageX - this.lastPointX, this.lastPointX = n.pageX, s = n.pageY - this.lastPointY, this.lastPointY = n.pageY, e = this.x + i, o = this.y + s, this._pos(e, o), t.preventDefault(), t.stopPropagation()
  },
  _end: function(i) {
   if (this.initiated) {
    if (this.initiated = !1, i.preventDefault(), i.stopPropagation(), h.removeEvent(t, "touchmove", this), h.removeEvent(t, h.prefixPointerEvent("pointermove"), this), h.removeEvent(t, "mousemove", this), this.scroller.options.snap) {
     var e = this.scroller._nearestSnap(this.scroller.x, this.scroller.y),
      o = this.options.snapSpeed || s.max(s.max(s.min(s.abs(this.scroller.x - e.x), 1e3), s.min(s.abs(this.scroller.y - e.y), 1e3)), 300);
     (this.scroller.x != e.x || this.scroller.y != e.y) && (this.scroller.directionX = 0, this.scroller.directionY = 0, this.scroller.currentPage = e, this.scroller.scrollTo(e.x, e.y, o, this.scroller.options.bounceEasing))
    }
    this.moved && this.scroller._execEvent("scrollEnd")
   }
  },
  transitionTime: function(t) {
   t = t || 0, this.indicatorStyle[h.style.transitionDuration] = t + "ms", !t && h.isBadAndroid && (this.indicatorStyle[h.style.transitionDuration] = "0.001s")
  },
  transitionTimingFunction: function(t) {
   this.indicatorStyle[h.style.transitionTimingFunction] = t
  },
  refresh: function() {
   this.transitionTime(), this.options.listenX && !this.options.listenY ? this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.indicatorStyle.display = this.scroller.hasVerticalScroll ? "block" : "none" : this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none", this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (h.addClass(this.wrapper, "iScrollBothScrollbars"), h.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (h.removeClass(this.wrapper, "iScrollBothScrollbars"), h.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px"));
   this.wrapper.offsetHeight;
   this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = s.max(s.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8), this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth, this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0,
    this.maxBoundaryX = this.maxPosX), this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX), this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ? (this.indicatorHeight = s.max(s.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), this.maxPosY = this.wrapperHeight - this.indicatorHeight, this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY), this.updatePosition()
  },
  updatePosition: function() {
   var t = this.options.listenX && s.round(this.sizeRatioX * this.scroller.x) || 0,
    i = this.options.listenY && s.round(this.sizeRatioY * this.scroller.y) || 0;
   this.options.ignoreBoundaries || (t < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = s.max(this.indicatorWidth + t, 8), this.indicatorStyle.width = this.width + "px"), t = this.minBoundaryX) : t > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = s.max(this.indicatorWidth - (t - this.maxPosX), 8), this.indicatorStyle.width = this.width + "px", t = this.maxPosX + this.indicatorWidth - this.width) : t = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, this.indicatorStyle.width = this.width + "px"), i < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = s.max(this.indicatorHeight + 3 * i, 8), this.indicatorStyle.height = this.height + "px"), i = this.minBoundaryY) : i > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = s.max(this.indicatorHeight - 3 * (i - this.maxPosY), 8), this.indicatorStyle.height = this.height + "px", i = this.maxPosY + this.indicatorHeight - this.height) : i = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, this.indicatorStyle.height = this.height + "px")), this.x = t, this.y = i, this.scroller.options.useTransform ? this.indicatorStyle[h.style.transform] = "translate(" + t + "px," + i + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = t + "px", this.indicatorStyle.top = i + "px")
  },
  _pos: function(t, i) {
   0 > t ? t = 0 : t > this.maxPosX && (t = this.maxPosX), 0 > i ? i = 0 : i > this.maxPosY && (i = this.maxPosY), t = this.options.listenX ? s.round(t / this.sizeRatioX) : this.scroller.x, i = this.options.listenY ? s.round(i / this.sizeRatioY) : this.scroller.y, this.scroller.scrollTo(t, i)
  },
  fade: function(t, i) {
   if (!i || this.visible) {
    clearTimeout(this.fadeTimeout), this.fadeTimeout = null;
    var s = t ? 250 : 500,
     e = t ? 0 : 300;
    t = t ? "1" : "0", this.wrapperStyle[h.style.transitionDuration] = s + "ms", this.fadeTimeout = setTimeout(function(t) {
     this.wrapperStyle.opacity = t, this.visible = +t
    }.bind(this, t), e)
   }
  }
 }, e.utils = h, "undefined" != typeof module && module.exports ? module.exports = e : t.IScroll = e
}(window, document, Math);

/* jQuery blockUI plugin | Dual licensed under the MIT and GPL licenses: */
;
(function() {
 function a(j) {
  j.fn._fadeIn = j.fn.fadeIn;
  var d = j.noop || function() {};
  var n = /MSIE/.test(navigator.userAgent);
  var f = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
  var k = document.documentMode || 0;
  var g = j.isFunction(document.createElement("div").style.setExpression);
  j.blockUI = function(r) {
   e(window, r)
  };
  j.unblockUI = function(r) {
   i(window, r)
  };
  j.growlUI = function(x, u, v, s) {
   var t = j('<div class="growlUI"></div>');
   if (x) {
    t.append("<h1>" + x + "</h1>")
   }
   if (u) {
    t.append("<h2>" + u + "</h2>")
   }
   if (v === undefined) {
    v = 3000
   }
   var r = function(y) {
    y = y || {};
    j.blockUI({
     message: t,
     fadeIn: typeof y.fadeIn !== "undefined" ? y.fadeIn : 700,
     fadeOut: typeof y.fadeOut !== "undefined" ? y.fadeOut : 1000,
     timeout: typeof y.timeout !== "undefined" ? y.timeout : v,
     centerY: false,
     showOverlay: false,
     onUnblock: s,
     css: j.blockUI.defaults.growlCSS
    })
   };
   r();
   var w = t.css("opacity");
   t.mouseover(function() {
    r({
     fadeIn: 0,
     timeout: 30000
    });
    var y = j(".blockMsg");
    y.stop();
    y.fadeTo(300, 1)
   }).mouseout(function() {
    j(".blockMsg").fadeOut(1000)
   })
  };
  j.fn.block = function(s) {
   if (this[0] === window) {
    j.blockUI(s);
    return this
   }
   var r = j.extend({}, j.blockUI.defaults, s || {});
   this.each(function() {
    var t = j(this);
    if (r.ignoreIfBlocked && t.data("blockUI.isBlocked")) {
     return
    }
    t.unblock({
     fadeOut: 0
    })
   });
   return this.each(function() {
    if (j.css(this, "position") == "static") {
     this.style.position = "relative";
     j(this).data("blockUI.static", true)
    }
    this.style.zoom = 1;
    e(this, s)
   })
  };
  j.fn.unblock = function(r) {
   if (this[0] === window) {
    j.unblockUI(r);
    return this
   }
   return this.each(function() {
    i(this, r)
   })
  };
  j.blockUI.version = 2.66;
  j.blockUI.defaults = {
   message: "",
   title: null,
   draggable: true,
   theme: false,
   css: {
    padding: 0,
    margin: 0,
    width: "30%",
    top: "40%",
    left: "35%",
    textAlign: "center",
    color: "#000",
    border: "3px solid #aaa",
    backgroundColor: "#fff",
    cursor: "wait"
   },
   themedCSS: {
    width: "30%",
    top: "40%",
    left: "35%"
   },
   overlayCSS: {
    backgroundColor: "#000",
    opacity: 0.6,
    cursor: "default"
   },
   cursorReset: "default",
   growlCSS: {
    width: "350px",
    top: "10px",
    left: "",
    right: "10px",
    border: "none",
    padding: "5px",
    opacity: 0.6,
    cursor: "default",
    color: "#fff",
    backgroundColor: "#000",
    "-webkit-border-radius": "10px",
    "-moz-border-radius": "10px",
    "border-radius": "10px"
   },
   iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
   forceIframe: false,
   baseZ: 900,
   centerX: true,
   centerY: true,
   allowBodyStretch: true,
   bindEvents: false,
   constrainTabKey: true,
   fadeIn: 200,
   fadeOut: 400,
   timeout: 0,
   showOverlay: true,
   focusInput: true,
   focusableElements: ":input:enabled:visible",
   onBlock: null,
   onUnblock: null,
   onOverlayClick: null,
   quirksmodeOffsetHack: 4,
   blockMsgClass: "blockMsg",
   ignoreIfBlocked: false
  };
  var c = null;
  var h = [];

  function e(v, H) {
   var E, P;
   var C = (v == window);
   var y = (H && H.message !== undefined ? H.message : undefined);
   H = j.extend({}, j.blockUI.defaults, H || {});
   if (H.ignoreIfBlocked && j(v).data("blockUI.isBlocked")) {
    return
   }
   H.overlayCSS = j.extend({}, j.blockUI.defaults.overlayCSS, H.overlayCSS || {});
   E = j.extend({}, j.blockUI.defaults.css, H.css || {});
   if (H.onOverlayClick) {
    H.overlayCSS.cursor = "pointer"
   }
   P = j.extend({}, j.blockUI.defaults.themedCSS, H.themedCSS || {});
   y = y === undefined ? H.message : y;
   if (C && c) {
    i(window, {
     fadeOut: 0
    })
   }
   if (y && typeof y != "string" && (y.parentNode || y.jquery)) {
    var K = y.jquery ? y[0] : y;
    var R = {};
    j(v).data("blockUI.history", R);
    R.el = K;
    R.parent = K.parentNode;
    R.display = K.style.display;
    R.position = K.style.position;
    if (R.parent) {
     R.parent.removeChild(K)
    }
   }
   j(v).data("blockUI.onUnblock", H.onUnblock);
   var D = H.baseZ;
   var O, N, M, I;
   if (n || H.forceIframe) {
    O = j('<iframe class="blockUI" style="z-index:' + (D++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + H.iframeSrc + '"></iframe>')
   } else {
    O = j('<div class="blockUI" style="display:none"></div>')
   }
   if (H.theme) {
    N = j('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (D++) + ';display:none"></div>')
   } else {
    N = j('<div class="blockUI blockOverlay" style="z-index:' + (D++) + ';display:block;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>')
   }
   if (H.theme && C) {
    I = '<div class="blockUI ' + H.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (D + 10) + ';display:none;position:fixed">';
    if (H.title) {
     I += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (H.title || "&nbsp;") + "</div>"
    }
    I += '<div class="ui-widget-content ui-dialog-content"></div>';
    I += "</div>"
   } else {
    if (H.theme) {
     I = '<div class="blockUI ' + H.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (D + 10) + ';display:none;position:absolute">';
     if (H.title) {
      I += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (H.title || "&nbsp;") + "</div>"
     }
     I += '<div class="ui-widget-content ui-dialog-content"></div>';
     I += "</div>"
    } else {
     if (C) {
      I = '<div class="blockUI ' + H.blockMsgClass + ' blockPage" style="z-index:' + (D + 10) + ';display:none;position:fixed"></div>'
     } else {
      I = '<div class="blockUI ' + H.blockMsgClass + ' blockElement" style="z-index:' + (D + 10) + ';display:none;position:absolute"></div>'
     }
    }
   }
   M = j(I);
   if (y) {
    if (H.theme) {
     M.css(P);
     M.addClass("ui-widget-content")
    } else {
     M.css(E)
    }
   }
   if (!H.theme) {
    N.css(H.overlayCSS)
   }
   N.css("position", C ? "fixed" : "absolute");
   if (n || H.forceIframe) {
    O.css("opacity", 0)
   }
   var B = [O, N, M],
    Q = C ? j("body") : j(v);
   j.each(B, function() {
    this.appendTo(Q)
   });
   if (H.theme && H.draggable && j.fn.draggable) {
    M.draggable({
     handle: ".ui-dialog-titlebar",
     cancel: "li"
    })
   }
   var x = g && (!j.support.boxModel || j("object,embed", C ? null : v).length > 0);
   if (f || x) {
    if (C && H.allowBodyStretch && j.support.boxModel) {
     j("html,body").css("height", "100%")
    }
    if ((f || !j.support.boxModel) && !C) {
     var G = o(v, "borderTopWidth"),
      L = o(v, "borderLeftWidth");
     var A = G ? "(0 - " + G + ")" : 0;
     var F = L ? "(0 - " + L + ")" : 0
    }
    j.each(B, function(t, U) {
     var z = U[0].style;
     z.position = "absolute";
     if (t < 2) {
      if (C) {
       z.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:" + H.quirksmodeOffsetHack + ') + "px"')
      } else {
       z.setExpression("height", 'this.parentNode.offsetHeight + "px"')
      }
      if (C) {
       z.setExpression("width", 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
      } else {
       z.setExpression("width", 'this.parentNode.offsetWidth + "px"')
      }
      if (F) {
       z.setExpression("left", F)
      }
      if (A) {
       z.setExpression("top", A)
      }
     } else {
      if (H.centerY) {
       if (C) {
        z.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"')
       }
       z.marginTop = 0
      } else {
       if (!H.centerY && C) {
        var S = (H.css && H.css.top) ? parseInt(H.css.top, 10) : 0;
        var T = "((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " + S + ') + "px"';
        z.setExpression("top", T)
       }
      }
     }
    })
   }
   if (y) {
    if (H.theme) {
     M.find(".ui-widget-content").append(y)
    } else {
     M.append(y)
    }
    if (y.jquery || y.nodeType) {
     j(y).show()
    }
   }
   if ((n || H.forceIframe) && H.showOverlay) {
    O.show()
   }
   if (H.fadeIn) {
    var J = H.onBlock ? H.onBlock : d;
    var u = (H.showOverlay && !y) ? J : d;
    var r = y ? J : d;
    if (H.showOverlay) {
     N._fadeIn(H.fadeIn, u)
    }
    if (y) {
     M._fadeIn(H.fadeIn, r)
    }
   } else {
    if (H.showOverlay) {
     N.show()
    }
    if (y) {
     M.show()
    }
    if (H.onBlock) {
     H.onBlock()
    }
   }
   m(1, v, H);
   if (C) {
    c = M[0];
    h = j(H.focusableElements, c);
    if (H.focusInput) {
     setTimeout(q, 20)
    }
   } else {
    b(M[0], H.centerX, H.centerY)
   }
   if (H.timeout) {
    var w = setTimeout(function() {
     if (C) {
      j.unblockUI(H)
     } else {
      j(v).unblock(H)
     }
    }, H.timeout);
    j(v).data("blockUI.timeout", w)
   }
  }

  function i(u, w) {
   var v;
   var t = (u == window);
   var s = j(u);
   var x = s.data("blockUI.history");
   var y = s.data("blockUI.timeout");
   if (y) {
    clearTimeout(y);
    s.removeData("blockUI.timeout")
   }
   w = j.extend({}, j.blockUI.defaults, w || {});
   m(0, u, w);
   if (w.onUnblock === null) {
    w.onUnblock = s.data("blockUI.onUnblock");
    s.removeData("blockUI.onUnblock")
   }
   var r;
   if (t) {
    r = j("body").children().filter(".blockUI").add("body > .blockUI")
   } else {
    r = s.find(">.blockUI")
   }
   if (w.cursorReset) {
    if (r.length > 1) {
     r[1].style.cursor = w.cursorReset
    }
    if (r.length > 2) {
     r[2].style.cursor = w.cursorReset
    }
   }
   if (t) {
    c = h = null
   }
   if (w.fadeOut) {
    v = r.length;
    r.stop().fadeOut(w.fadeOut, function() {
     if (--v === 0) {
      l(r, x, w, u)
     }
    })
   } else {
    l(r, x, w, u)
   }
  }

  function l(v, z, y, x) {
   var u = j(x);
   if (u.data("blockUI.isBlocked")) {
    return
   }
   v.each(function(w, A) {
    if (this.parentNode) {
     this.parentNode.removeChild(this)
    }
   });
   if (z && z.el) {
    z.el.style.display = z.display;
    z.el.style.position = z.position;
    if (z.parent) {
     z.parent.appendChild(z.el)
    }
    u.removeData("blockUI.history")
   }
   if (u.data("blockUI.static")) {
    u.css("position", "static")
   }
   if (typeof y.onUnblock == "function") {
    y.onUnblock(x, y)
   }
   var r = j(document.body),
    t = r.width(),
    s = r[0].style.width;
   r.width(t - 1).width(t);
   r[0].style.width = s
  }

  function m(r, v, w) {
   var u = v == window,
    t = j(v);
   if (!r && (u && !c || !u && !t.data("blockUI.isBlocked"))) {
    return
   }
   t.data("blockUI.isBlocked", r);
   if (!u || !w.bindEvents || (r && !w.showOverlay)) {
    return
   }
   var s = "mousedown mouseup keydown keypress keyup touchstart touchend touchmove";
   if (r) {
    j(document).bind(s, w, p)
   } else {
    j(document).unbind(s, p)
   }
  }

  function p(w) {
   if (w.type === "keydown" && w.keyCode && w.keyCode == 9) {
    if (c && w.data.constrainTabKey) {
     var t = h;
     var s = !w.shiftKey && w.target === t[t.length - 1];
     var r = w.shiftKey && w.target === t[0];
     if (s || r) {
      setTimeout(function() {
       q(r)
      }, 10);
      return false
     }
    }
   }
   var u = w.data;
   var v = j(w.target);
   if (v.hasClass("blockOverlay") && u.onOverlayClick) {
    u.onOverlayClick(w)
   }
   if (v.parents("div." + u.blockMsgClass).length > 0) {
    return true
   }
   return v.parents().children().filter("div.blockUI").length === 0
  }

  function q(r) {
   if (!h) {
    return
   }
   var s = h[r === true ? h.length - 1 : 0];
   if (s) {
    s.focus()
   }
  }

  function b(z, r, B) {
   var A = z.parentNode,
    w = z.style;
   var u = ((A.offsetWidth - z.offsetWidth) / 2) - o(A, "borderLeftWidth");
   var v = ((A.offsetHeight - z.offsetHeight) / 2) - o(A, "borderTopWidth");
   if (r) {
    w.left = u > 0 ? (u + "px") : "0"
   }
   if (B) {
    w.top = v > 0 ? (v + "px") : "0"
   }
  }

  function o(r, s) {
   return parseInt(j.css(r, s), 10) || 0
  }
 }
 if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery"], a)
 } else {
  a(jQuery)
 }
})();

/* The Final Countdown for jQuery v2.0.4 (http://hilios.github.io/jQuery.countdown/) Copyright (c) 2014 Edson Hilios */
! function(a) {
 "use strict";
 "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function(a) {
 "use strict";

 function b(a) {
  if (a instanceof Date) return a;
  if (String(a).match(h)) return String(a).match(/^[0-9]*$/) && (a = Number(a)), String(a).match(/\-/) && (a = String(a).replace(/\-/g, "/")), new Date(a);
  throw new Error("Couldn't cast `" + a + "` to a date object.")
 }

 function c(a) {
  var b = a.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  return new RegExp(b)
 }

 function d(a) {
  return function(b) {
   var d = b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
   if (d)
    for (var f = 0, g = d.length; g > f; ++f) {
     var h = d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),
      j = c(h[0]),
      k = h[1] || "",
      l = h[3] || "",
      m = null;
     h = h[2], i.hasOwnProperty(h) && (m = i[h], m = Number(a[m])), null !== m && ("!" === k && (m = e(l, m)), "" === k && 10 > m && (m = "0" + m.toString()), b = b.replace(j, m.toString()))
    }
   return b = b.replace(/%%/, "%")
  }
 }

 function e(a, b) {
  var c = "s",
   d = "";
  return a && (a = a.replace(/(:|;|\s)/gi, "").split(/\,/), 1 === a.length ? c = a[0] : (d = a[0], c = a[1])), 1 === Math.abs(b) ? d : c
 }
 var f = 100,
  g = [],
  h = [];
 h.push(/^[0-9]*$/.source), h.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), h.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), h = new RegExp(h.join("|"));
 var i = {
   Y: "years",
   m: "months",
   w: "weeks",
   d: "days",
   D: "totalDays",
   H: "hours",
   M: "minutes",
   S: "seconds"
  },
  j = function(b, c, d) {
   this.el = b, this.$el = a(b), this.interval = null, this.offset = {}, this.instanceNumber = g.length, g.push(this), this.$el.data("countdown-instance", this.instanceNumber), d && (this.$el.on("update.countdown", d), this.$el.on("stoped.countdown", d), this.$el.on("finish.countdown", d)), this.setFinalDate(c), this.start()
  };
 a.extend(j.prototype, {
  start: function() {
   null !== this.interval && clearInterval(this.interval);
   var a = this;
   this.update(), this.interval = setInterval(function() {
    a.update.call(a)
   }, f)
  },
  stop: function() {
   clearInterval(this.interval), this.interval = null, this.dispatchEvent("stoped")
  },
  toggle: function() {
   this.interval ? this.stop() : this.start()
  },
  pause: function() {
   this.stop()
  },
  resume: function() {
   this.start()
  },
  remove: function() {
   this.stop.call(this), g[this.instanceNumber] = null, delete this.$el.data().countdownInstance
  },
  setFinalDate: function(a) {
   this.finalDate = b(a)
  },
  update: function() {
   return 0 === this.$el.closest("html").length ? void this.remove() : (this.totalSecsLeft = this.finalDate.getTime() - (new Date).getTime(), this.totalSecsLeft = Math.ceil(this.totalSecsLeft / 1e3), this.totalSecsLeft = this.totalSecsLeft < 0 ? 0 : this.totalSecsLeft, this.offset = {
    seconds: this.totalSecsLeft % 60,
    minutes: Math.floor(this.totalSecsLeft / 60) % 60,
    hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
    days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
    totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
    weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
    months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30),
    years: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 365)
   }, void(0 === this.totalSecsLeft ? (this.stop(), this.dispatchEvent("finish")) : this.dispatchEvent("update")))
  },
  dispatchEvent: function(b) {
   var c = a.Event(b + ".countdown");
   c.finalDate = this.finalDate, c.offset = a.extend({}, this.offset), c.strftime = d(this.offset), this.$el.trigger(c)
  }
 }), a.fn.countdown = function() {
  var b = Array.prototype.slice.call(arguments, 0);
  return this.each(function() {
   var c = a(this).data("countdown-instance");
   if (void 0 !== c) {
    var d = g[c],
     e = b[0];
    j.prototype.hasOwnProperty(e) ? d[e].apply(d, b.slice(1)) : null === String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i) ? (d.setFinalDate.call(d, e), d.start()) : a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, e))
   } else new j(this, b[0], b[1])
  })
 }
});

/* ScrollToFixed https://github.com/bigspotteddog/ScrollToFixed Copyright (c) 2011 Joseph Cava-Lynch  MIT license */
(function(a) {
 a.isScrollToFixed = function(b) {
  return !!a(b).data("ScrollToFixed")
 };
 a.ScrollToFixed = function(d, i) {
  var l = this;
  l.$el = a(d);
  l.el = d;
  l.$el.data("ScrollToFixed", l);
  var c = false;
  var G = l.$el;
  var H;
  var E;
  var e;
  var y;
  var D = 0;
  var q = 0;
  var j = -1;
  var f = -1;
  var t = null;
  var z;
  var g;

  function u() {
   G.trigger("preUnfixed.ScrollToFixed");
   k();
   G.trigger("unfixed.ScrollToFixed");
   f = -1;
   D = G.offset().top;
   q = G.offset().left;
   if (l.options.offsets) {
    q += (G.offset().left - G.position().left)
   }
   if (j == -1) {
    j = q
   }
   H = G.css("position");
   c = true;
   if (l.options.bottom != -1) {
    G.trigger("preFixed.ScrollToFixed");
    w();
    G.trigger("fixed.ScrollToFixed")
   }
  }

  function n() {
   var I = l.options.limit;
   if (!I) {
    return 0
   }
   if (typeof(I) === "function") {
    return I.apply(G)
   }
   return I
  }

  function p() {
   return H === "fixed"
  }

  function x() {
   return H === "absolute"
  }

  function h() {
   return !(p() || x())
  }

  function w() {
   if (!p()) {
    t.css({
     display: G.css("display"),
     width: G.outerWidth(true),
     height: G.outerHeight(true),
     "float": G.css("float")
    });
    cssOptions = {
     "z-index": l.options.zIndex,
     position: "fixed",
     top: l.options.bottom == -1 ? s() : "",
     bottom: l.options.bottom == -1 ? "" : l.options.bottom,
     "margin-left": "0px"
    };
    if (!l.options.dontSetWidth) {
     cssOptions.width = G.css("width")
    }
    G.css(cssOptions);
    G.addClass(l.options.baseClassName);
    if (l.options.className) {
     G.addClass(l.options.className)
    }
    H = "fixed"
   }
  }

  function b() {
   var J = n();
   var I = q;
   if (l.options.removeOffsets) {
    I = "";
    J = J - D
   }
   cssOptions = {
    position: "absolute",
    top: J,
    left: I,
    "margin-left": "0px",
    bottom: ""
   };
   if (!l.options.dontSetWidth) {
    cssOptions.width = G.css("width")
   }
   G.css(cssOptions);
   H = "absolute"
  }

  function k() {
   if (!h()) {
    f = -1;
    t.css("display", "none");
    G.css({
     "z-index": y,
     width: "",
     position: E,
     left: "",
     top: e,
     "margin-left": ""
    });
    G.removeClass("scroll-to-fixed-fixed");
    if (l.options.className) {
     G.removeClass(l.options.className)
    }
    H = null
   }
  }

  function v(I) {
   if (I != f) {
    G.css("left", q - I);
    f = I
   }
  }

  function s() {
   var I = l.options.marginTop;
   if (!I) {
    return 0
   }
   if (typeof(I) === "function") {
    return I.apply(G)
   }
   return I
  }

  function A() {
   if (!a.isScrollToFixed(G)) {
    return
   }
   var K = c;
   if (!c) {
    u()
   } else {
    if (h()) {
     D = G.offset().top;
     q = G.offset().left
    }
   }
   var I = a(window).scrollLeft();
   var L = a(window).scrollTop();
   var J = n();
   if (l.options.minWidth && a(window).width() < l.options.minWidth) {
    if (!h() || !K) {
     o();
     G.trigger("preUnfixed.ScrollToFixed");
     k();
     G.trigger("unfixed.ScrollToFixed")
    }
   } else {
    if (l.options.maxWidth && a(window).width() > l.options.maxWidth) {
     if (!h() || !K) {
      o();
      G.trigger("preUnfixed.ScrollToFixed");
      k();
      G.trigger("unfixed.ScrollToFixed")
     }
    } else {
     if (l.options.bottom == -1) {
      if (J > 0 && L >= J - s()) {
       if (!x() || !K) {
        o();
        G.trigger("preAbsolute.ScrollToFixed");
        b();
        G.trigger("unfixed.ScrollToFixed")
       }
      } else {
       if (L >= D - s()) {
        if (!p() || !K) {
         o();
         G.trigger("preFixed.ScrollToFixed");
         w();
         f = -1;
         G.trigger("fixed.ScrollToFixed")
        }
        v(I)
       } else {
        if (!h() || !K) {
         o();
         G.trigger("preUnfixed.ScrollToFixed");
         k();
         G.trigger("unfixed.ScrollToFixed")
        }
       }
      }
     } else {
      if (J > 0) {
       if (L + a(window).height() - G.outerHeight(true) >= J - (s() || -m())) {
        if (p()) {
         o();
         G.trigger("preUnfixed.ScrollToFixed");
         if (E === "absolute") {
          b()
         } else {
          k()
         }
         G.trigger("unfixed.ScrollToFixed")
        }
       } else {
        if (!p()) {
         o();
         G.trigger("preFixed.ScrollToFixed");
         w()
        }
        v(I);
        G.trigger("fixed.ScrollToFixed")
       }
      } else {
       v(I)
      }
     }
    }
   }
  }

  function m() {
   if (!l.options.bottom) {
    return 0
   }
   return l.options.bottom
  }

  function o() {
   var I = G.css("position");
   if (I == "absolute") {
    G.trigger("postAbsolute.ScrollToFixed")
   } else {
    if (I == "fixed") {
     G.trigger("postFixed.ScrollToFixed")
    } else {
     G.trigger("postUnfixed.ScrollToFixed")
    }
   }
  }
  var C = function(I) {
   if (G.is(":visible")) {
    c = false;
    A()
   }
  };
  var F = function(I) {
   (!!window.requestAnimationFrame) ? requestAnimationFrame(A): A()
  };
  var B = function() {
   var J = document.body;
   if (document.createElement && J && J.appendChild && J.removeChild) {
    var L = document.createElement("div");
    if (!L.getBoundingClientRect) {
     return null
    }
    L.innerHTML = "x";
    L.style.cssText = "position:fixed;top:100px;";
    J.appendChild(L);
    var M = J.style.height,
     N = J.scrollTop;
    J.style.height = "3000px";
    J.scrollTop = 500;
    var I = L.getBoundingClientRect().top;
    J.style.height = M;
    var K = (I === 100);
    J.removeChild(L);
    J.scrollTop = N;
    return K
   }
   return null
  };
  var r = function(I) {
   I = I || window.event;
   if (I.preventDefault) {
    I.preventDefault()
   }
   I.returnValue = false
  };
  l.init = function() {
   l.options = a.extend({}, a.ScrollToFixed.defaultOptions, i);
   y = G.css("z-index");
   l.$el.css("z-index", l.options.zIndex);
   t = a("<div />");
   H = G.css("position");
   E = G.css("position");
   e = G.css("top");
   if (h()) {
    l.$el.after(t)
   }
   a(window).bind("resize.ScrollToFixed", C);
   a(window).bind("scroll.ScrollToFixed", F);
   if ("ontouchmove" in window) {
    a(window).bind("touchmove.ScrollToFixed", A)
   }
   if (l.options.preFixed) {
    G.bind("preFixed.ScrollToFixed", l.options.preFixed)
   }
   if (l.options.postFixed) {
    G.bind("postFixed.ScrollToFixed", l.options.postFixed)
   }
   if (l.options.preUnfixed) {
    G.bind("preUnfixed.ScrollToFixed", l.options.preUnfixed)
   }
   if (l.options.postUnfixed) {
    G.bind("postUnfixed.ScrollToFixed", l.options.postUnfixed)
   }
   if (l.options.preAbsolute) {
    G.bind("preAbsolute.ScrollToFixed", l.options.preAbsolute)
   }
   if (l.options.postAbsolute) {
    G.bind("postAbsolute.ScrollToFixed", l.options.postAbsolute)
   }
   if (l.options.fixed) {
    G.bind("fixed.ScrollToFixed", l.options.fixed)
   }
   if (l.options.unfixed) {
    G.bind("unfixed.ScrollToFixed", l.options.unfixed)
   }
   if (l.options.spacerClass) {
    t.addClass(l.options.spacerClass)
   }
   G.bind("resize.ScrollToFixed", function() {
    t.height(G.height())
   });
   G.bind("scroll.ScrollToFixed", function() {
    G.trigger("preUnfixed.ScrollToFixed");
    k();
    G.trigger("unfixed.ScrollToFixed");
    A()
   });
   G.bind("detach.ScrollToFixed", function(I) {
    r(I);
    G.trigger("preUnfixed.ScrollToFixed");
    k();
    G.trigger("unfixed.ScrollToFixed");
    a(window).unbind("resize.ScrollToFixed", C);
    a(window).unbind("scroll.ScrollToFixed", F);
    G.unbind(".ScrollToFixed");
    t.remove();
    l.$el.removeData("ScrollToFixed")
   });
   C()
  };
  l.init()
 };
 a.ScrollToFixed.defaultOptions = {
  marginTop: 0,
  limit: 0,
  bottom: -1,
  zIndex: 10,
  baseClassName: "scroll-to-fixed-fixed"
 };
 a.fn.scrollToFixed = function(b) {
  return this.each(function() {
   (new a.ScrollToFixed(this, b))
  })
 }
})(jQuery);

/* Placeholder plugin for jQuery Copyright 2010, Daniel Stocks (http://webcloud.se) Released under the MIT, BSD, and GPL Licenses. */
(function($) {
 function Placeholder(input) {
  this.input = input;
  this.placeholder = this.input.attr('placeholder').replace(/\\n/g, "\n");
  if (input.attr('type') == 'password') {
   this.handlePassword();
  }
  $(input[0].form).submit(function() {
   if (input.hasClass('placeholder') && input[0].value == input.attr('placeholder')) {
    input[0].value = '';
   }
  });
 }
 Placeholder.prototype = {
  show: function(loading) {
   if (this.input[0].value === '' || (loading && this.valueIsPlaceholder())) {
    if (this.isPassword) {
     try {
      this.input[0].setAttribute('type', 'text');
     } catch (e) {
      this.input.before(this.fakePassword.show()).hide();
     }
    }
    this.input.addClass('placeholder');
    this.input[0].value = this.placeholder;
    this.input.attr('placeholder', '');
   }
  },
  hide: function() {
   if (this.valueIsPlaceholder() && this.input.hasClass('placeholder')) {
    this.input.removeClass('placeholder');
    this.input[0].value = '';
    if (this.isPassword) {
     try {
      this.input[0].setAttribute('type', 'password');
     } catch (e) {}
     this.input.show();
     this.input[0].focus();
    }
   }
  },
  valueIsPlaceholder: function() {
   return this.input[0].value == this.placeholder;
  },
  handlePassword: function() {
   var input = this.input;
   input.attr('realType', 'password');
   this.isPassword = true;
   if ((navigator.appName == 'Microsoft Internet Explorer') && input[0].outerHTML) {
    var fakeHTML = $(input[0].outerHTML.replace(/type=(['"])?password\1/gi, 'type=$1text$1'));
    this.fakePassword = fakeHTML.val(input.attr('placeholder')).addClass('placeholder').focus(function() {
     input.trigger('focus');
     $(this).hide();
    });
    $(input[0].form).submit(function() {
     fakeHTML.remove();
     input.show()
    });
   }
  }
 };
 $.fn.placeholder = function() {
  return this.each(function() {
   var input = $(this);
   var placeholder = new Placeholder(input);
   placeholder.show(true);
   input.focus(function() {
    placeholder.hide();
   });
   input.blur(function() {
    placeholder.show(false);
   });
   input.closest('form').submit(function() {
    if (input.hasClass('placeholder')) {
     input.removeClass('placeholder');
     input.val('');
    }
   });
   if (navigator.appName == 'Microsoft Internet Explorer') {
    $(window).load(function() {
     if (input.val()) {
      input.removeClass("placeholder");
     }
     placeholder.show(true);
    });
    input.focus(function() {
     if (this.value == "") {
      var range = this.createTextRange();
      range.collapse(true);
      range.moveStart('character', 0);
      range.select();
     }
    });
   }
  });
 }
})(jQuery);

/* Image Map Resizer (imageMapResizer.min.js ) - v0.5.3  Copyright: (c) 2015 David J. Bradshaw  License: MIT */
! function() {
 "use strict";

 function a() {
  function a() {
   function a(a) {
    function c(a) {
     return a * b[1 === (d = 1 - d) ? "width" : "height"]
    }
    var d = 0;
    return a.split(",").map(Number).map(c).map(Math.floor).join(",")
   }
   for (var b = {
     width: i.width / j.width,
     height: i.height / j.height
    }, c = 0; g > c; c++) f[c].coords = a(h[c])
  }

  function b() {
   j.onload = function() {
    (i.width !== j.width || i.height !== j.height) && a()
   }, j.src = i.src
  }

  function c() {
   function b() {
    clearTimeout(k), k = setTimeout(a, 250)
   }
   window.addEventListener ? window.addEventListener("resize", b, !1) : window.attachEvent && window.attachEvent("onresize", b)
  }

  function d(a) {
   return a.coords.replace(/ *, */g, ",").replace(/ +/g, ",")
  }
  var e = this,
   f = e.getElementsByTagName("area"),
   g = f.length,
   h = Array.prototype.map.call(f, d),
   i = document.querySelector('img[usemap="#' + e.name + '"]'),
   j = new Image,
   k = null;
  b(), c()
 }

 function b() {
  function b(b) {
   if (!b.tagName) throw new TypeError("Object is not a valid DOM element");
   if ("MAP" !== b.tagName.toUpperCase()) throw new TypeError("Expected <MAP> tag, found <" + b.tagName + ">.");
   a.call(b)
  }
  return function(a) {
   switch (typeof a) {
    case "undefined":
    case "string":
     Array.prototype.forEach.call(document.querySelectorAll(a || "map"), b);
     break;
    case "object":
     b(a);
     break;
    default:
     throw new TypeError("Unexpected data type (" + typeof a + ").")
   }
  }
 }
 "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? module.exports = b() : window.imageMapResize = b(), "jQuery" in window && (jQuery.fn.imageMapResize = function() {
  return this.filter("map").each(a).end()
 })
}();