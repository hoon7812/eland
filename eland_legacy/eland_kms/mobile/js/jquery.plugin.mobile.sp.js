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

/**
 * Swiper 6.0.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * http://swiperjs.com
 *
 * Copyright 2014-2020 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: July 9, 2020
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Swiper=t()}(this,(function(){"use strict";function e(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function t(){return(t=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(e[s]=i[s])}return e}).apply(this,arguments)}function i(e){return null!==e&&"object"==typeof e&&"constructor"in e&&e.constructor===Object}function s(e,t){void 0===e&&(e={}),void 0===t&&(t={}),Object.keys(t).forEach((function(a){void 0===e[a]?e[a]=t[a]:i(t[a])&&i(e[a])&&Object.keys(t[a]).length>0&&s(e[a],t[a])}))}var a={body:{},addEventListener:function(){},removeEventListener:function(){},activeElement:{blur:function(){},nodeName:""},querySelector:function(){return null},querySelectorAll:function(){return[]},getElementById:function(){return null},createEvent:function(){return{initEvent:function(){}}},createElement:function(){return{children:[],childNodes:[],style:{},setAttribute:function(){},getElementsByTagName:function(){return[]}}},createElementNS:function(){return{}},importNode:function(){return null},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function r(){var e="undefined"!=typeof document?document:{};return s(e,a),e}var n={document:a,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState:function(){},pushState:function(){},go:function(){},back:function(){}},CustomEvent:function(){return this},addEventListener:function(){},removeEventListener:function(){},getComputedStyle:function(){return{getPropertyValue:function(){return""}}},Image:function(){},Date:function(){},screen:{},setTimeout:function(){},clearTimeout:function(){},matchMedia:function(){return{}},requestAnimationFrame:function(e){return"undefined"==typeof setTimeout?(e(),null):setTimeout(e,0)},cancelAnimationFrame:function(e){"undefined"!=typeof setTimeout&&clearTimeout(e)}};function l(){var e="undefined"!=typeof window?window:{};return s(e,n),e}function o(e){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function p(e,t,i){return(p=h()?Reflect.construct:function(e,t,i){var s=[null];s.push.apply(s,t);var a=new(Function.bind.apply(e,s));return i&&d(a,i.prototype),a}).apply(null,arguments)}function u(e){var t="function"==typeof Map?new Map:void 0;return(u=function(e){if(null===e||(i=e,-1===Function.toString.call(i).indexOf("[native code]")))return e;var i;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,s)}function s(){return p(e,arguments,o(this).constructor)}return s.prototype=Object.create(e.prototype,{constructor:{value:s,enumerable:!1,writable:!0,configurable:!0}}),d(s,e)})(e)}var c=function(e){var t,i;function s(t){return e.call.apply(e,[this].concat(t))||this}return i=e,(t=s).prototype=Object.create(i.prototype),t.prototype.constructor=t,t.__proto__=i,s}(u(Array));function v(e){void 0===e&&(e=[]);var t=[];return e.forEach((function(e){Array.isArray(e)?t.push.apply(t,v(e)):t.push(e)})),t}function f(e,t){return Array.prototype.filter.call(e,t)}function m(e,t){var i=l(),s=r(),a=[];if(!t&&e instanceof c)return e;if(!e)return new c(a);if("string"==typeof e){var n=e.trim();if(n.indexOf("<")>=0&&n.indexOf(">")>=0){var o="div";0===n.indexOf("<li")&&(o="ul"),0===n.indexOf("<tr")&&(o="tbody"),0!==n.indexOf("<td")&&0!==n.indexOf("<th")||(o="tr"),0===n.indexOf("<tbody")&&(o="table"),0===n.indexOf("<option")&&(o="select");var d=s.createElement(o);d.innerHTML=n;for(var h=0;h<d.childNodes.length;h+=1)a.push(d.childNodes[h])}else a=function(e,t){if("string"!=typeof e)return[e];for(var i=[],s=t.querySelectorAll(e),a=0;a<s.length;a+=1)i.push(s[a]);return i}(e.trim(),t||s)}else if(e.nodeType||e===i||e===s)a.push(e);else if(Array.isArray(e)){if(e instanceof c)return e;a=e}return new c(function(e){for(var t=[],i=0;i<e.length;i+=1)-1===t.indexOf(e[i])&&t.push(e[i]);return t}(a))}m.fn=c.prototype;var g,w,b,y={addClass:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=v(t.map((function(e){return e.split(" ")})));return this.forEach((function(e){var t;(t=e.classList).add.apply(t,s)})),this},removeClass:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=v(t.map((function(e){return e.split(" ")})));return this.forEach((function(e){var t;(t=e.classList).remove.apply(t,s)})),this},hasClass:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=v(t.map((function(e){return e.split(" ")})));return f(this,(function(e){return s.filter((function(t){return e.classList.contains(t)})).length>0})).length>0},toggleClass:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=v(t.map((function(e){return e.split(" ")})));this.forEach((function(e){s.forEach((function(t){e.classList.toggle(t)}))}))},attr:function(e,t){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var i=0;i<this.length;i+=1)if(2===arguments.length)this[i].setAttribute(e,t);else for(var s in e)this[i][s]=e[s],this[i].setAttribute(s,e[s]);return this},removeAttr:function(e){for(var t=0;t<this.length;t+=1)this[t].removeAttribute(e);return this},transform:function(e){for(var t=0;t<this.length;t+=1)this[t].style.transform=e;return this},transition:function(e){for(var t=0;t<this.length;t+=1)this[t].style.transition="string"!=typeof e?e+"ms":e;return this},on:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=t[0],a=t[1],r=t[2],n=t[3];function l(e){var t=e.target;if(t){var i=e.target.dom7EventData||[];if(i.indexOf(e)<0&&i.unshift(e),m(t).is(a))r.apply(t,i);else for(var s=m(t).parents(),n=0;n<s.length;n+=1)m(s[n]).is(a)&&r.apply(s[n],i)}}function o(e){var t=e&&e.target&&e.target.dom7EventData||[];t.indexOf(e)<0&&t.unshift(e),r.apply(this,t)}"function"==typeof t[1]&&(s=t[0],r=t[1],n=t[2],a=void 0),n||(n=!1);for(var d,h=s.split(" "),p=0;p<this.length;p+=1){var u=this[p];if(a)for(d=0;d<h.length;d+=1){var c=h[d];u.dom7LiveListeners||(u.dom7LiveListeners={}),u.dom7LiveListeners[c]||(u.dom7LiveListeners[c]=[]),u.dom7LiveListeners[c].push({listener:r,proxyListener:l}),u.addEventListener(c,l,n)}else for(d=0;d<h.length;d+=1){var v=h[d];u.dom7Listeners||(u.dom7Listeners={}),u.dom7Listeners[v]||(u.dom7Listeners[v]=[]),u.dom7Listeners[v].push({listener:r,proxyListener:o}),u.addEventListener(v,o,n)}}return this},off:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=t[0],a=t[1],r=t[2],n=t[3];"function"==typeof t[1]&&(s=t[0],r=t[1],n=t[2],a=void 0),n||(n=!1);for(var l=s.split(" "),o=0;o<l.length;o+=1)for(var d=l[o],h=0;h<this.length;h+=1){var p=this[h],u=void 0;if(!a&&p.dom7Listeners?u=p.dom7Listeners[d]:a&&p.dom7LiveListeners&&(u=p.dom7LiveListeners[d]),u&&u.length)for(var c=u.length-1;c>=0;c-=1){var v=u[c];r&&v.listener===r||r&&v.listener&&v.listener.dom7proxy&&v.listener.dom7proxy===r?(p.removeEventListener(d,v.proxyListener,n),u.splice(c,1)):r||(p.removeEventListener(d,v.proxyListener,n),u.splice(c,1))}}return this},trigger:function(){for(var e=l(),t=arguments.length,i=new Array(t),s=0;s<t;s++)i[s]=arguments[s];for(var a=i[0].split(" "),r=i[1],n=0;n<a.length;n+=1)for(var o=a[n],d=0;d<this.length;d+=1){var h=this[d];if(e.CustomEvent){var p=new e.CustomEvent(o,{detail:r,bubbles:!0,cancelable:!0});h.dom7EventData=i.filter((function(e,t){return t>0})),h.dispatchEvent(p),h.dom7EventData=[],delete h.dom7EventData}}return this},transitionEnd:function(e){var t=this;return e&&t.on("transitionend",(function i(s){s.target===this&&(e.call(this,s),t.off("transitionend",i))})),this},outerWidth:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetWidth+parseFloat(t.getPropertyValue("margin-right"))+parseFloat(t.getPropertyValue("margin-left"))}return this[0].offsetWidth}return null},outerHeight:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetHeight+parseFloat(t.getPropertyValue("margin-top"))+parseFloat(t.getPropertyValue("margin-bottom"))}return this[0].offsetHeight}return null},styles:function(){var e=l();return this[0]?e.getComputedStyle(this[0],null):{}},offset:function(){if(this.length>0){var e=l(),t=r(),i=this[0],s=i.getBoundingClientRect(),a=t.body,n=i.clientTop||a.clientTop||0,o=i.clientLeft||a.clientLeft||0,d=i===e?e.scrollY:i.scrollTop,h=i===e?e.scrollX:i.scrollLeft;return{top:s.top+d-n,left:s.left+h-o}}return null},css:function(e,t){var i,s=l();if(1===arguments.length){if("string"!=typeof e){for(i=0;i<this.length;i+=1)for(var a in e)this[i].style[a]=e[a];return this}if(this[0])return s.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(i=0;i<this.length;i+=1)this[i].style[e]=t;return this}return this},each:function(e){return e?(this.forEach((function(t,i){e.apply(t,[t,i])})),this):this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:null;for(var t=0;t<this.length;t+=1)this[t].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(var t=0;t<this.length;t+=1)this[t].textContent=e;return this},is:function(e){var t,i,s=l(),a=r(),n=this[0];if(!n||void 0===e)return!1;if("string"==typeof e){if(n.matches)return n.matches(e);if(n.webkitMatchesSelector)return n.webkitMatchesSelector(e);if(n.msMatchesSelector)return n.msMatchesSelector(e);for(t=m(e),i=0;i<t.length;i+=1)if(t[i]===n)return!0;return!1}if(e===a)return n===a;if(e===s)return n===s;if(e.nodeType||e instanceof c){for(t=e.nodeType?[e]:e,i=0;i<t.length;i+=1)if(t[i]===n)return!0;return!1}return!1},index:function(){var e,t=this[0];if(t){for(e=0;null!==(t=t.previousSibling);)1===t.nodeType&&(e+=1);return e}},eq:function(e){if(void 0===e)return this;var t=this.length;if(e>t-1)return m([]);if(e<0){var i=t+e;return m(i<0?[]:[this[i]])}return m([this[e]])},append:function(){for(var e,t=r(),i=0;i<arguments.length;i+=1){e=i<0||arguments.length<=i?void 0:arguments[i];for(var s=0;s<this.length;s+=1)if("string"==typeof e){var a=t.createElement("div");for(a.innerHTML=e;a.firstChild;)this[s].appendChild(a.firstChild)}else if(e instanceof c)for(var n=0;n<e.length;n+=1)this[s].appendChild(e[n]);else this[s].appendChild(e)}return this},prepend:function(e){var t,i,s=r();for(t=0;t<this.length;t+=1)if("string"==typeof e){var a=s.createElement("div");for(a.innerHTML=e,i=a.childNodes.length-1;i>=0;i-=1)this[t].insertBefore(a.childNodes[i],this[t].childNodes[0])}else if(e instanceof c)for(i=0;i<e.length;i+=1)this[t].insertBefore(e[i],this[t].childNodes[0]);else this[t].insertBefore(e,this[t].childNodes[0]);return this},next:function(e){return this.length>0?e?this[0].nextElementSibling&&m(this[0].nextElementSibling).is(e)?m([this[0].nextElementSibling]):m([]):this[0].nextElementSibling?m([this[0].nextElementSibling]):m([]):m([])},nextAll:function(e){var t=[],i=this[0];if(!i)return m([]);for(;i.nextElementSibling;){var s=i.nextElementSibling;e?m(s).is(e)&&t.push(s):t.push(s),i=s}return m(t)},prev:function(e){if(this.length>0){var t=this[0];return e?t.previousElementSibling&&m(t.previousElementSibling).is(e)?m([t.previousElementSibling]):m([]):t.previousElementSibling?m([t.previousElementSibling]):m([])}return m([])},prevAll:function(e){var t=[],i=this[0];if(!i)return m([]);for(;i.previousElementSibling;){var s=i.previousElementSibling;e?m(s).is(e)&&t.push(s):t.push(s),i=s}return m(t)},parent:function(e){for(var t=[],i=0;i<this.length;i+=1)null!==this[i].parentNode&&(e?m(this[i].parentNode).is(e)&&t.push(this[i].parentNode):t.push(this[i].parentNode));return m(t)},parents:function(e){for(var t=[],i=0;i<this.length;i+=1)for(var s=this[i].parentNode;s;)e?m(s).is(e)&&t.push(s):t.push(s),s=s.parentNode;return m(t)},closest:function(e){var t=this;return void 0===e?m([]):(t.is(e)||(t=t.parents(e).eq(0)),t)},find:function(e){for(var t=[],i=0;i<this.length;i+=1)for(var s=this[i].querySelectorAll(e),a=0;a<s.length;a+=1)t.push(s[a]);return m(t)},children:function(e){for(var t=[],i=0;i<this.length;i+=1)for(var s=this[i].children,a=0;a<s.length;a+=1)e&&!m(s[a]).is(e)||t.push(s[a]);return m(t)},filter:function(e){return m(f(this,e))},remove:function(){for(var e=0;e<this.length;e+=1)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this}};function E(e,t){return void 0===t&&(t=0),setTimeout(e,t)}function x(){return Date.now()}function T(e,t){void 0===t&&(t="x");var i,s,a,r=l(),n=r.getComputedStyle(e,null);return r.WebKitCSSMatrix?((s=n.transform||n.webkitTransform).split(",").length>6&&(s=s.split(", ").map((function(e){return e.replace(",",".")})).join(", ")),a=new r.WebKitCSSMatrix("none"===s?"":s)):i=(a=n.MozTransform||n.OTransform||n.MsTransform||n.msTransform||n.transform||n.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,")).toString().split(","),"x"===t&&(s=r.WebKitCSSMatrix?a.m41:16===i.length?parseFloat(i[12]):parseFloat(i[4])),"y"===t&&(s=r.WebKitCSSMatrix?a.m42:16===i.length?parseFloat(i[13]):parseFloat(i[5])),s||0}function C(e){return"object"==typeof e&&null!==e&&e.constructor&&e.constructor===Object}function S(){for(var e=Object(arguments.length<=0?void 0:arguments[0]),t=1;t<arguments.length;t+=1){var i=t<0||arguments.length<=t?void 0:arguments[t];if(null!=i)for(var s=Object.keys(Object(i)),a=0,r=s.length;a<r;a+=1){var n=s[a],l=Object.getOwnPropertyDescriptor(i,n);void 0!==l&&l.enumerable&&(C(e[n])&&C(i[n])?S(e[n],i[n]):!C(e[n])&&C(i[n])?(e[n]={},S(e[n],i[n])):e[n]=i[n])}}return e}function M(e,t){Object.keys(t).forEach((function(i){C(t[i])&&Object.keys(t[i]).forEach((function(s){"function"==typeof t[i][s]&&(t[i][s]=t[i][s].bind(e))})),e[i]=t[i]}))}function z(){return g||(g=function(){var e=l(),t=r();return{touch:!!("ontouchstart"in e||e.DocumentTouch&&t instanceof e.DocumentTouch),pointerEvents:!!e.PointerEvent&&"maxTouchPoints"in e.navigator&&e.navigator.maxTouchPoints>=0,observer:"MutationObserver"in e||"WebkitMutationObserver"in e,passiveListener:function(){var t=!1;try{var i=Object.defineProperty({},"passive",{get:function(){t=!0}});e.addEventListener("testPassiveListener",null,i)}catch(e){}return t}(),gestures:"ongesturestart"in e}}()),g}function P(e){return void 0===e&&(e={}),w||(w=function(e){var t=(void 0===e?{}:e).userAgent,i=z(),s=l(),a=s.navigator.platform,r=t||s.navigator.userAgent,n={ios:!1,android:!1},o=s.screen.width,d=s.screen.height,h=r.match(/(Android);?[\s\/]+([\d.]+)?/),p=r.match(/(iPad).*OS\s([\d_]+)/),u=r.match(/(iPod)(.*OS\s([\d_]+))?/),c=!p&&r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),v="Win32"===a,f="MacIntel"===a;return!p&&f&&i.touch&&["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768"].indexOf(o+"x"+d)>=0&&((p=r.match(/(Version)\/([\d.]+)/))||(p=[0,1,"13_0_0"]),f=!1),h&&!v&&(n.os="android",n.android=!0),(p||c||u)&&(n.os="ios",n.ios=!0),n}(e)),w}function k(){return b||(b=function(){var e,t=l();return{isEdge:!!t.navigator.userAgent.match(/Edge/g),isSafari:(e=t.navigator.userAgent.toLowerCase(),e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0),isWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent)}}()),b}function $(e){var t=r(),i=l(),s=this.touchEventsData,a=this.params,n=this.touches;if(!this.animating||!a.preventInteractionOnTransition){var o=e;o.originalEvent&&(o=o.originalEvent);var d=m(o.target);if(("wrapper"!==a.touchEventsTarget||d.closest(this.wrapperEl).length)&&(s.isTouchEvent="touchstart"===o.type,(s.isTouchEvent||!("which"in o)||3!==o.which)&&!(!s.isTouchEvent&&"button"in o&&o.button>0||s.isTouched&&s.isMoved)))if(a.noSwiping&&d.closest(a.noSwipingSelector?a.noSwipingSelector:"."+a.noSwipingClass)[0])this.allowClick=!0;else if(!a.swipeHandler||d.closest(a.swipeHandler)[0]){n.currentX="touchstart"===o.type?o.targetTouches[0].pageX:o.pageX,n.currentY="touchstart"===o.type?o.targetTouches[0].pageY:o.pageY;var h=n.currentX,p=n.currentY,u=a.edgeSwipeDetection||a.iOSEdgeSwipeDetection,c=a.edgeSwipeThreshold||a.iOSEdgeSwipeThreshold;if(!u||!(h<=c||h>=i.screen.width-c)){if(S(s,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),n.startX=h,n.startY=p,s.touchStartTime=x(),this.allowClick=!0,this.updateSize(),this.swipeDirection=void 0,a.threshold>0&&(s.allowThresholdMove=!1),"touchstart"!==o.type){var v=!0;d.is(s.formElements)&&(v=!1),t.activeElement&&m(t.activeElement).is(s.formElements)&&t.activeElement!==d[0]&&t.activeElement.blur();var f=v&&this.allowTouchMove&&a.touchStartPreventDefault;(a.touchStartForcePreventDefault||f)&&o.preventDefault()}this.emit("touchStart",o)}}}}function L(e){var t=r(),i=this.touchEventsData,s=this.params,a=this.touches,n=this.rtlTranslate,l=e;if(l.originalEvent&&(l=l.originalEvent),i.isTouched){if(!i.isTouchEvent||"touchmove"===l.type){var o="touchmove"===l.type&&l.targetTouches&&(l.targetTouches[0]||l.changedTouches[0]),d="touchmove"===l.type?o.pageX:l.pageX,h="touchmove"===l.type?o.pageY:l.pageY;if(l.preventedByNestedSwiper)return a.startX=d,void(a.startY=h);if(!this.allowTouchMove)return this.allowClick=!1,void(i.isTouched&&(S(a,{startX:d,startY:h,currentX:d,currentY:h}),i.touchStartTime=x()));if(i.isTouchEvent&&s.touchReleaseOnEdges&&!s.loop)if(this.isVertical()){if(h<a.startY&&this.translate<=this.maxTranslate()||h>a.startY&&this.translate>=this.minTranslate())return i.isTouched=!1,void(i.isMoved=!1)}else if(d<a.startX&&this.translate<=this.maxTranslate()||d>a.startX&&this.translate>=this.minTranslate())return;if(i.isTouchEvent&&t.activeElement&&l.target===t.activeElement&&m(l.target).is(i.formElements))return i.isMoved=!0,void(this.allowClick=!1);if(i.allowTouchCallbacks&&this.emit("touchMove",l),!(l.targetTouches&&l.targetTouches.length>1)){a.currentX=d,a.currentY=h;var p=a.currentX-a.startX,u=a.currentY-a.startY;if(!(this.params.threshold&&Math.sqrt(Math.pow(p,2)+Math.pow(u,2))<this.params.threshold)){var c;if(void 0===i.isScrolling)this.isHorizontal()&&a.currentY===a.startY||this.isVertical()&&a.currentX===a.startX?i.isScrolling=!1:p*p+u*u>=25&&(c=180*Math.atan2(Math.abs(u),Math.abs(p))/Math.PI,i.isScrolling=this.isHorizontal()?c>s.touchAngle:90-c>s.touchAngle);if(i.isScrolling&&this.emit("touchMoveOpposite",l),void 0===i.startMoving&&(a.currentX===a.startX&&a.currentY===a.startY||(i.startMoving=!0)),i.isScrolling)i.isTouched=!1;else if(i.startMoving){this.allowClick=!1,!s.cssMode&&l.cancelable&&l.preventDefault(),s.touchMoveStopPropagation&&!s.nested&&l.stopPropagation(),i.isMoved||(s.loop&&this.loopFix(),i.startTranslate=this.getTranslate(),this.setTransition(0),this.animating&&this.$wrapperEl.trigger("webkitTransitionEnd transitionend"),i.allowMomentumBounce=!1,!s.grabCursor||!0!==this.allowSlideNext&&!0!==this.allowSlidePrev||this.setGrabCursor(!0),this.emit("sliderFirstMove",l)),this.emit("sliderMove",l),i.isMoved=!0;var v=this.isHorizontal()?p:u;a.diff=v,v*=s.touchRatio,n&&(v=-v),this.swipeDirection=v>0?"prev":"next",i.currentTranslate=v+i.startTranslate;var f=!0,g=s.resistanceRatio;if(s.touchReleaseOnEdges&&(g=0),v>0&&i.currentTranslate>this.minTranslate()?(f=!1,s.resistance&&(i.currentTranslate=this.minTranslate()-1+Math.pow(-this.minTranslate()+i.startTranslate+v,g))):v<0&&i.currentTranslate<this.maxTranslate()&&(f=!1,s.resistance&&(i.currentTranslate=this.maxTranslate()+1-Math.pow(this.maxTranslate()-i.startTranslate-v,g))),f&&(l.preventedByNestedSwiper=!0),!this.allowSlideNext&&"next"===this.swipeDirection&&i.currentTranslate<i.startTranslate&&(i.currentTranslate=i.startTranslate),!this.allowSlidePrev&&"prev"===this.swipeDirection&&i.currentTranslate>i.startTranslate&&(i.currentTranslate=i.startTranslate),s.threshold>0){if(!(Math.abs(v)>s.threshold||i.allowThresholdMove))return void(i.currentTranslate=i.startTranslate);if(!i.allowThresholdMove)return i.allowThresholdMove=!0,a.startX=a.currentX,a.startY=a.currentY,i.currentTranslate=i.startTranslate,void(a.diff=this.isHorizontal()?a.currentX-a.startX:a.currentY-a.startY)}s.followFinger&&!s.cssMode&&((s.freeMode||s.watchSlidesProgress||s.watchSlidesVisibility)&&(this.updateActiveIndex(),this.updateSlidesClasses()),s.freeMode&&(0===i.velocities.length&&i.velocities.push({position:a[this.isHorizontal()?"startX":"startY"],time:i.touchStartTime}),i.velocities.push({position:a[this.isHorizontal()?"currentX":"currentY"],time:x()})),this.updateProgress(i.currentTranslate),this.setTranslate(i.currentTranslate))}}}}}else i.startMoving&&i.isScrolling&&this.emit("touchMoveOpposite",l)}function I(e){var t=this,i=t.touchEventsData,s=t.params,a=t.touches,r=t.rtlTranslate,n=t.$wrapperEl,l=t.slidesGrid,o=t.snapGrid,d=e;if(d.originalEvent&&(d=d.originalEvent),i.allowTouchCallbacks&&t.emit("touchEnd",d),i.allowTouchCallbacks=!1,!i.isTouched)return i.isMoved&&s.grabCursor&&t.setGrabCursor(!1),i.isMoved=!1,void(i.startMoving=!1);s.grabCursor&&i.isMoved&&i.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);var h,p=x(),u=p-i.touchStartTime;if(t.allowClick&&(t.updateClickedSlide(d),t.emit("tap click",d),u<300&&p-i.lastClickTime<300&&t.emit("doubleTap doubleClick",d)),i.lastClickTime=x(),E((function(){t.destroyed||(t.allowClick=!0)})),!i.isTouched||!i.isMoved||!t.swipeDirection||0===a.diff||i.currentTranslate===i.startTranslate)return i.isTouched=!1,i.isMoved=!1,void(i.startMoving=!1);if(i.isTouched=!1,i.isMoved=!1,i.startMoving=!1,h=s.followFinger?r?t.translate:-t.translate:-i.currentTranslate,!s.cssMode)if(s.freeMode){if(h<-t.minTranslate())return void t.slideTo(t.activeIndex);if(h>-t.maxTranslate())return void(t.slides.length<o.length?t.slideTo(o.length-1):t.slideTo(t.slides.length-1));if(s.freeModeMomentum){if(i.velocities.length>1){var c=i.velocities.pop(),v=i.velocities.pop(),f=c.position-v.position,m=c.time-v.time;t.velocity=f/m,t.velocity/=2,Math.abs(t.velocity)<s.freeModeMinimumVelocity&&(t.velocity=0),(m>150||x()-c.time>300)&&(t.velocity=0)}else t.velocity=0;t.velocity*=s.freeModeMomentumVelocityRatio,i.velocities.length=0;var g=1e3*s.freeModeMomentumRatio,w=t.velocity*g,b=t.translate+w;r&&(b=-b);var y,T,C=!1,S=20*Math.abs(t.velocity)*s.freeModeMomentumBounceRatio;if(b<t.maxTranslate())s.freeModeMomentumBounce?(b+t.maxTranslate()<-S&&(b=t.maxTranslate()-S),y=t.maxTranslate(),C=!0,i.allowMomentumBounce=!0):b=t.maxTranslate(),s.loop&&s.centeredSlides&&(T=!0);else if(b>t.minTranslate())s.freeModeMomentumBounce?(b-t.minTranslate()>S&&(b=t.minTranslate()+S),y=t.minTranslate(),C=!0,i.allowMomentumBounce=!0):b=t.minTranslate(),s.loop&&s.centeredSlides&&(T=!0);else if(s.freeModeSticky){for(var M,z=0;z<o.length;z+=1)if(o[z]>-b){M=z;break}b=-(b=Math.abs(o[M]-b)<Math.abs(o[M-1]-b)||"next"===t.swipeDirection?o[M]:o[M-1])}if(T&&t.once("transitionEnd",(function(){t.loopFix()})),0!==t.velocity){if(g=r?Math.abs((-b-t.translate)/t.velocity):Math.abs((b-t.translate)/t.velocity),s.freeModeSticky){var P=Math.abs((r?-b:b)-t.translate),k=t.slidesSizesGrid[t.activeIndex];g=P<k?s.speed:P<2*k?1.5*s.speed:2.5*s.speed}}else if(s.freeModeSticky)return void t.slideToClosest();s.freeModeMomentumBounce&&C?(t.updateProgress(y),t.setTransition(g),t.setTranslate(b),t.transitionStart(!0,t.swipeDirection),t.animating=!0,n.transitionEnd((function(){t&&!t.destroyed&&i.allowMomentumBounce&&(t.emit("momentumBounce"),t.setTransition(s.speed),setTimeout((function(){t.setTranslate(y),n.transitionEnd((function(){t&&!t.destroyed&&t.transitionEnd()}))}),0))}))):t.velocity?(t.updateProgress(b),t.setTransition(g),t.setTranslate(b),t.transitionStart(!0,t.swipeDirection),t.animating||(t.animating=!0,n.transitionEnd((function(){t&&!t.destroyed&&t.transitionEnd()})))):t.updateProgress(b),t.updateActiveIndex(),t.updateSlidesClasses()}else if(s.freeModeSticky)return void t.slideToClosest();(!s.freeModeMomentum||u>=s.longSwipesMs)&&(t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses())}else{for(var $=0,L=t.slidesSizesGrid[0],I=0;I<l.length;I+=I<s.slidesPerGroupSkip?1:s.slidesPerGroup){var O=I<s.slidesPerGroupSkip-1?1:s.slidesPerGroup;void 0!==l[I+O]?h>=l[I]&&h<l[I+O]&&($=I,L=l[I+O]-l[I]):h>=l[I]&&($=I,L=l[l.length-1]-l[l.length-2])}var A=(h-l[$])/L,D=$<s.slidesPerGroupSkip-1?1:s.slidesPerGroup;if(u>s.longSwipesMs){if(!s.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(A>=s.longSwipesRatio?t.slideTo($+D):t.slideTo($)),"prev"===t.swipeDirection&&(A>1-s.longSwipesRatio?t.slideTo($+D):t.slideTo($))}else{if(!s.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(d.target===t.navigation.nextEl||d.target===t.navigation.prevEl)?d.target===t.navigation.nextEl?t.slideTo($+D):t.slideTo($):("next"===t.swipeDirection&&t.slideTo($+D),"prev"===t.swipeDirection&&t.slideTo($))}}}function O(){var e=this.params,t=this.el;if(!t||0!==t.offsetWidth){e.breakpoints&&this.setBreakpoint();var i=this.allowSlideNext,s=this.allowSlidePrev,a=this.snapGrid;this.allowSlideNext=!0,this.allowSlidePrev=!0,this.updateSize(),this.updateSlides(),this.updateSlidesClasses(),("auto"===e.slidesPerView||e.slidesPerView>1)&&this.isEnd&&!this.isBeginning&&!this.params.centeredSlides?this.slideTo(this.slides.length-1,0,!1,!0):this.slideTo(this.activeIndex,0,!1,!0),this.autoplay&&this.autoplay.running&&this.autoplay.paused&&this.autoplay.run(),this.allowSlidePrev=s,this.allowSlideNext=i,this.params.watchOverflow&&a!==this.snapGrid&&this.checkOverflow()}}function A(e){this.allowClick||(this.params.preventClicks&&e.preventDefault(),this.params.preventClicksPropagation&&this.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))}function D(){var e=this.wrapperEl,t=this.rtlTranslate;this.previousTranslate=this.translate,this.isHorizontal()?this.translate=t?e.scrollWidth-e.offsetWidth-e.scrollLeft:-e.scrollLeft:this.translate=-e.scrollTop,-0===this.translate&&(this.translate=0),this.updateActiveIndex(),this.updateSlidesClasses();var i=this.maxTranslate()-this.minTranslate();(0===i?0:(this.translate-this.minTranslate())/i)!==this.progress&&this.updateProgress(t?-this.translate:this.translate),this.emit("setTranslate",this.translate,!1)}Object.keys(y).forEach((function(e){m.fn[e]=y[e]}));var G=!1;function N(){}var B={init:!0,direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeMomentumVelocityRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,slidesPerGroupSkip:0,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!1,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:0,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,loopFillGroupWithBlank:!1,loopPreventsSlide:!0,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,containerModifierClass:"swiper-container-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-invisible-blank",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",runCallbacksOnInit:!0,_emitClasses:!1},H={modular:{useParams:function(e){var t=this;t.modules&&Object.keys(t.modules).forEach((function(i){var s=t.modules[i];s.params&&S(e,s.params)}))},useModules:function(e){void 0===e&&(e={});var t=this;t.modules&&Object.keys(t.modules).forEach((function(i){var s=t.modules[i],a=e[i]||{};s.on&&t.on&&Object.keys(s.on).forEach((function(e){t.on(e,s.on[e])})),s.create&&s.create.bind(t)(a)}))}},eventsEmitter:{on:function(e,t,i){var s=this;if("function"!=typeof t)return s;var a=i?"unshift":"push";return e.split(" ").forEach((function(e){s.eventsListeners[e]||(s.eventsListeners[e]=[]),s.eventsListeners[e][a](t)})),s},once:function(e,t,i){var s=this;if("function"!=typeof t)return s;function a(){s.off(e,a),a.__emitterProxy&&delete a.__emitterProxy;for(var i=arguments.length,r=new Array(i),n=0;n<i;n++)r[n]=arguments[n];t.apply(s,r)}return a.__emitterProxy=t,s.on(e,a,i)},onAny:function(e,t){if("function"!=typeof e)return this;var i=t?"unshift":"push";return this.eventsAnyListeners.indexOf(e)<0&&this.eventsAnyListeners[i](e),this},offAny:function(e){if(!this.eventsAnyListeners)return this;var t=this.eventsAnyListeners.indexOf(e);return t>=0&&this.eventsAnyListeners.splice(t,1),this},off:function(e,t){var i=this;return i.eventsListeners?(e.split(" ").forEach((function(e){void 0===t?i.eventsListeners[e]=[]:i.eventsListeners[e]&&i.eventsListeners[e].forEach((function(s,a){(s===t||s.__emitterProxy&&s.__emitterProxy===t)&&i.eventsListeners[e].splice(a,1)}))})),i):i},emit:function(){var e,t,i,s=this;if(!s.eventsListeners)return s;for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];"string"==typeof r[0]||Array.isArray(r[0])?(e=r[0],t=r.slice(1,r.length),i=s):(e=r[0].events,t=r[0].data,i=r[0].context||s),t.unshift(i);var l=Array.isArray(e)?e:e.split(" ");return l.forEach((function(e){if(s.eventsListeners&&s.eventsListeners[e]){var a=[];s.eventsListeners[e].forEach((function(e){a.push(e)})),a.forEach((function(e){e.apply(i,t)}))}})),s}},update:{updateSize:function(){var e,t,i=this.$el;e=void 0!==this.params.width&&null!==this.params.width?this.params.width:i[0].clientWidth,t=void 0!==this.params.height&&null!==this.params.width?this.params.height:i[0].clientHeight,0===e&&this.isHorizontal()||0===t&&this.isVertical()||(e=e-parseInt(i.css("padding-left")||0,10)-parseInt(i.css("padding-right")||0,10),t=t-parseInt(i.css("padding-top")||0,10)-parseInt(i.css("padding-bottom")||0,10),Number.isNaN(e)&&(e=0),Number.isNaN(t)&&(t=0),S(this,{width:e,height:t,size:this.isHorizontal()?e:t}))},updateSlides:function(){var e=l(),t=this.params,i=this.$wrapperEl,s=this.size,a=this.rtlTranslate,r=this.wrongRTL,n=this.virtual&&t.virtual.enabled,o=n?this.virtual.slides.length:this.slides.length,d=i.children("."+this.params.slideClass),h=n?this.virtual.slides.length:d.length,p=[],u=[],c=[];function v(e,i){return!t.cssMode||i!==d.length-1}var f=t.slidesOffsetBefore;"function"==typeof f&&(f=t.slidesOffsetBefore.call(this));var m=t.slidesOffsetAfter;"function"==typeof m&&(m=t.slidesOffsetAfter.call(this));var g=this.snapGrid.length,w=this.snapGrid.length,b=t.spaceBetween,y=-f,E=0,x=0;if(void 0!==s){var T,C;"string"==typeof b&&b.indexOf("%")>=0&&(b=parseFloat(b.replace("%",""))/100*s),this.virtualSize=-b,a?d.css({marginLeft:"",marginTop:""}):d.css({marginRight:"",marginBottom:""}),t.slidesPerColumn>1&&(T=Math.floor(h/t.slidesPerColumn)===h/this.params.slidesPerColumn?h:Math.ceil(h/t.slidesPerColumn)*t.slidesPerColumn,"auto"!==t.slidesPerView&&"row"===t.slidesPerColumnFill&&(T=Math.max(T,t.slidesPerView*t.slidesPerColumn)));for(var M,z=t.slidesPerColumn,P=T/z,k=Math.floor(h/t.slidesPerColumn),$=0;$<h;$+=1){C=0;var L=d.eq($);if(t.slidesPerColumn>1){var I=void 0,O=void 0,A=void 0;if("row"===t.slidesPerColumnFill&&t.slidesPerGroup>1){var D=Math.floor($/(t.slidesPerGroup*t.slidesPerColumn)),G=$-t.slidesPerColumn*t.slidesPerGroup*D,N=0===D?t.slidesPerGroup:Math.min(Math.ceil((h-D*z*t.slidesPerGroup)/z),t.slidesPerGroup);I=(O=G-(A=Math.floor(G/N))*N+D*t.slidesPerGroup)+A*T/z,L.css({"-webkit-box-ordinal-group":I,"-moz-box-ordinal-group":I,"-ms-flex-order":I,"-webkit-order":I,order:I})}else"column"===t.slidesPerColumnFill?(A=$-(O=Math.floor($/z))*z,(O>k||O===k&&A===z-1)&&(A+=1)>=z&&(A=0,O+=1)):O=$-(A=Math.floor($/P))*P;L.css("margin-"+(this.isHorizontal()?"top":"left"),0!==A&&t.spaceBetween&&t.spaceBetween+"px")}if("none"!==L.css("display")){if("auto"===t.slidesPerView){var B=e.getComputedStyle(L[0],null),H=L[0].style.transform,X=L[0].style.webkitTransform;if(H&&(L[0].style.transform="none"),X&&(L[0].style.webkitTransform="none"),t.roundLengths)C=this.isHorizontal()?L.outerWidth(!0):L.outerHeight(!0);else if(this.isHorizontal()){var Y=parseFloat(B.getPropertyValue("width")||0),V=parseFloat(B.getPropertyValue("padding-left")||0),F=parseFloat(B.getPropertyValue("padding-right")||0),W=parseFloat(B.getPropertyValue("margin-left")||0),R=parseFloat(B.getPropertyValue("margin-right")||0),q=B.getPropertyValue("box-sizing");C=q&&"border-box"===q?Y+W+R:Y+V+F+W+R}else{var j=parseFloat(B.getPropertyValue("height")||0),_=parseFloat(B.getPropertyValue("padding-top")||0),U=parseFloat(B.getPropertyValue("padding-bottom")||0),K=parseFloat(B.getPropertyValue("margin-top")||0),Z=parseFloat(B.getPropertyValue("margin-bottom")||0),J=B.getPropertyValue("box-sizing");C=J&&"border-box"===J?j+K+Z:j+_+U+K+Z}H&&(L[0].style.transform=H),X&&(L[0].style.webkitTransform=X),t.roundLengths&&(C=Math.floor(C))}else C=(s-(t.slidesPerView-1)*b)/t.slidesPerView,t.roundLengths&&(C=Math.floor(C)),d[$]&&(this.isHorizontal()?d[$].style.width=C+"px":d[$].style.height=C+"px");d[$]&&(d[$].swiperSlideSize=C),c.push(C),t.centeredSlides?(y=y+C/2+E/2+b,0===E&&0!==$&&(y=y-s/2-b),0===$&&(y=y-s/2-b),Math.abs(y)<.001&&(y=0),t.roundLengths&&(y=Math.floor(y)),x%t.slidesPerGroup==0&&p.push(y),u.push(y)):(t.roundLengths&&(y=Math.floor(y)),(x-Math.min(this.params.slidesPerGroupSkip,x))%this.params.slidesPerGroup==0&&p.push(y),u.push(y),y=y+C+b),this.virtualSize+=C+b,E=C,x+=1}}if(this.virtualSize=Math.max(this.virtualSize,s)+m,a&&r&&("slide"===t.effect||"coverflow"===t.effect)&&i.css({width:this.virtualSize+t.spaceBetween+"px"}),t.setWrapperSize&&(this.isHorizontal()?i.css({width:this.virtualSize+t.spaceBetween+"px"}):i.css({height:this.virtualSize+t.spaceBetween+"px"})),t.slidesPerColumn>1&&(this.virtualSize=(C+t.spaceBetween)*T,this.virtualSize=Math.ceil(this.virtualSize/t.slidesPerColumn)-t.spaceBetween,this.isHorizontal()?i.css({width:this.virtualSize+t.spaceBetween+"px"}):i.css({height:this.virtualSize+t.spaceBetween+"px"}),t.centeredSlides)){M=[];for(var Q=0;Q<p.length;Q+=1){var ee=p[Q];t.roundLengths&&(ee=Math.floor(ee)),p[Q]<this.virtualSize+p[0]&&M.push(ee)}p=M}if(!t.centeredSlides){M=[];for(var te=0;te<p.length;te+=1){var ie=p[te];t.roundLengths&&(ie=Math.floor(ie)),p[te]<=this.virtualSize-s&&M.push(ie)}p=M,Math.floor(this.virtualSize-s)-Math.floor(p[p.length-1])>1&&p.push(this.virtualSize-s)}if(0===p.length&&(p=[0]),0!==t.spaceBetween&&(this.isHorizontal()?a?d.filter(v).css({marginLeft:b+"px"}):d.filter(v).css({marginRight:b+"px"}):d.filter(v).css({marginBottom:b+"px"})),t.centeredSlides&&t.centeredSlidesBounds){var se=0;c.forEach((function(e){se+=e+(t.spaceBetween?t.spaceBetween:0)}));var ae=(se-=t.spaceBetween)-s;p=p.map((function(e){return e<0?-f:e>ae?ae+m:e}))}if(t.centerInsufficientSlides){var re=0;if(c.forEach((function(e){re+=e+(t.spaceBetween?t.spaceBetween:0)})),(re-=t.spaceBetween)<s){var ne=(s-re)/2;p.forEach((function(e,t){p[t]=e-ne})),u.forEach((function(e,t){u[t]=e+ne}))}}S(this,{slides:d,snapGrid:p,slidesGrid:u,slidesSizesGrid:c}),h!==o&&this.emit("slidesLengthChange"),p.length!==g&&(this.params.watchOverflow&&this.checkOverflow(),this.emit("snapGridLengthChange")),u.length!==w&&this.emit("slidesGridLengthChange"),(t.watchSlidesProgress||t.watchSlidesVisibility)&&this.updateSlidesOffset()}},updateAutoHeight:function(e){var t,i=[],s=0;if("number"==typeof e?this.setTransition(e):!0===e&&this.setTransition(this.params.speed),"auto"!==this.params.slidesPerView&&this.params.slidesPerView>1)if(this.params.centeredSlides)this.visibleSlides.each((function(e){i.push(e)}));else for(t=0;t<Math.ceil(this.params.slidesPerView);t+=1){var a=this.activeIndex+t;if(a>this.slides.length)break;i.push(this.slides.eq(a)[0])}else i.push(this.slides.eq(this.activeIndex)[0]);for(t=0;t<i.length;t+=1)if(void 0!==i[t]){var r=i[t].offsetHeight;s=r>s?r:s}s&&this.$wrapperEl.css("height",s+"px")},updateSlidesOffset:function(){for(var e=this.slides,t=0;t<e.length;t+=1)e[t].swiperSlideOffset=this.isHorizontal()?e[t].offsetLeft:e[t].offsetTop},updateSlidesProgress:function(e){void 0===e&&(e=this&&this.translate||0);var t=this.params,i=this.slides,s=this.rtlTranslate;if(0!==i.length){void 0===i[0].swiperSlideOffset&&this.updateSlidesOffset();var a=-e;s&&(a=e),i.removeClass(t.slideVisibleClass),this.visibleSlidesIndexes=[],this.visibleSlides=[];for(var r=0;r<i.length;r+=1){var n=i[r],l=(a+(t.centeredSlides?this.minTranslate():0)-n.swiperSlideOffset)/(n.swiperSlideSize+t.spaceBetween);if(t.watchSlidesVisibility||t.centeredSlides&&t.autoHeight){var o=-(a-n.swiperSlideOffset),d=o+this.slidesSizesGrid[r];(o>=0&&o<this.size-1||d>1&&d<=this.size||o<=0&&d>=this.size)&&(this.visibleSlides.push(n),this.visibleSlidesIndexes.push(r),i.eq(r).addClass(t.slideVisibleClass))}n.progress=s?-l:l}this.visibleSlides=m(this.visibleSlides)}},updateProgress:function(e){if(void 0===e){var t=this.rtlTranslate?-1:1;e=this&&this.translate&&this.translate*t||0}var i=this.params,s=this.maxTranslate()-this.minTranslate(),a=this.progress,r=this.isBeginning,n=this.isEnd,l=r,o=n;0===s?(a=0,r=!0,n=!0):(r=(a=(e-this.minTranslate())/s)<=0,n=a>=1),S(this,{progress:a,isBeginning:r,isEnd:n}),(i.watchSlidesProgress||i.watchSlidesVisibility||i.centeredSlides&&i.autoHeight)&&this.updateSlidesProgress(e),r&&!l&&this.emit("reachBeginning toEdge"),n&&!o&&this.emit("reachEnd toEdge"),(l&&!r||o&&!n)&&this.emit("fromEdge"),this.emit("progress",a)},updateSlidesClasses:function(){var e,t=this.slides,i=this.params,s=this.$wrapperEl,a=this.activeIndex,r=this.realIndex,n=this.virtual&&i.virtual.enabled;t.removeClass(i.slideActiveClass+" "+i.slideNextClass+" "+i.slidePrevClass+" "+i.slideDuplicateActiveClass+" "+i.slideDuplicateNextClass+" "+i.slideDuplicatePrevClass),(e=n?this.$wrapperEl.find("."+i.slideClass+'[data-swiper-slide-index="'+a+'"]'):t.eq(a)).addClass(i.slideActiveClass),i.loop&&(e.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+r+'"]').addClass(i.slideDuplicateActiveClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+r+'"]').addClass(i.slideDuplicateActiveClass));var l=e.nextAll("."+i.slideClass).eq(0).addClass(i.slideNextClass);i.loop&&0===l.length&&(l=t.eq(0)).addClass(i.slideNextClass);var o=e.prevAll("."+i.slideClass).eq(0).addClass(i.slidePrevClass);i.loop&&0===o.length&&(o=t.eq(-1)).addClass(i.slidePrevClass),i.loop&&(l.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass),o.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass)),this.emitSlidesClasses()},updateActiveIndex:function(e){var t,i=this.rtlTranslate?this.translate:-this.translate,s=this.slidesGrid,a=this.snapGrid,r=this.params,n=this.activeIndex,l=this.realIndex,o=this.snapIndex,d=e;if(void 0===d){for(var h=0;h<s.length;h+=1)void 0!==s[h+1]?i>=s[h]&&i<s[h+1]-(s[h+1]-s[h])/2?d=h:i>=s[h]&&i<s[h+1]&&(d=h+1):i>=s[h]&&(d=h);r.normalizeSlideIndex&&(d<0||void 0===d)&&(d=0)}if(a.indexOf(i)>=0)t=a.indexOf(i);else{var p=Math.min(r.slidesPerGroupSkip,d);t=p+Math.floor((d-p)/r.slidesPerGroup)}if(t>=a.length&&(t=a.length-1),d!==n){var u=parseInt(this.slides.eq(d).attr("data-swiper-slide-index")||d,10);S(this,{snapIndex:t,realIndex:u,previousIndex:n,activeIndex:d}),this.emit("activeIndexChange"),this.emit("snapIndexChange"),l!==u&&this.emit("realIndexChange"),(this.initialized||this.params.runCallbacksOnInit)&&this.emit("slideChange")}else t!==o&&(this.snapIndex=t,this.emit("snapIndexChange"))},updateClickedSlide:function(e){var t=this.params,i=m(e.target).closest("."+t.slideClass)[0],s=!1;if(i)for(var a=0;a<this.slides.length;a+=1)this.slides[a]===i&&(s=!0);if(!i||!s)return this.clickedSlide=void 0,void(this.clickedIndex=void 0);this.clickedSlide=i,this.virtual&&this.params.virtual.enabled?this.clickedIndex=parseInt(m(i).attr("data-swiper-slide-index"),10):this.clickedIndex=m(i).index(),t.slideToClickedSlide&&void 0!==this.clickedIndex&&this.clickedIndex!==this.activeIndex&&this.slideToClickedSlide()}},translate:{getTranslate:function(e){void 0===e&&(e=this.isHorizontal()?"x":"y");var t=this.params,i=this.rtlTranslate,s=this.translate,a=this.$wrapperEl;if(t.virtualTranslate)return i?-s:s;if(t.cssMode)return s;var r=T(a[0],e);return i&&(r=-r),r||0},setTranslate:function(e,t){var i=this.rtlTranslate,s=this.params,a=this.$wrapperEl,r=this.wrapperEl,n=this.progress,l=0,o=0;this.isHorizontal()?l=i?-e:e:o=e,s.roundLengths&&(l=Math.floor(l),o=Math.floor(o)),s.cssMode?r[this.isHorizontal()?"scrollLeft":"scrollTop"]=this.isHorizontal()?-l:-o:s.virtualTranslate||a.transform("translate3d("+l+"px, "+o+"px, 0px)"),this.previousTranslate=this.translate,this.translate=this.isHorizontal()?l:o;var d=this.maxTranslate()-this.minTranslate();(0===d?0:(e-this.minTranslate())/d)!==n&&this.updateProgress(e),this.emit("setTranslate",this.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e,t,i,s,a){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0),void 0===s&&(s=!0);var r=this,n=r.params,l=r.wrapperEl;if(r.animating&&n.preventInteractionOnTransition)return!1;var o,d=r.minTranslate(),h=r.maxTranslate();if(o=s&&e>d?d:s&&e<h?h:e,r.updateProgress(o),n.cssMode){var p,u=r.isHorizontal();if(0===t)l[u?"scrollLeft":"scrollTop"]=-o;else if(l.scrollTo)l.scrollTo(((p={})[u?"left":"top"]=-o,p.behavior="smooth",p));else l[u?"scrollLeft":"scrollTop"]=-o;return!0}return 0===t?(r.setTransition(0),r.setTranslate(o),i&&(r.emit("beforeTransitionStart",t,a),r.emit("transitionEnd"))):(r.setTransition(t),r.setTranslate(o),i&&(r.emit("beforeTransitionStart",t,a),r.emit("transitionStart")),r.animating||(r.animating=!0,r.onTranslateToWrapperTransitionEnd||(r.onTranslateToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.$wrapperEl[0].removeEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.$wrapperEl[0].removeEventListener("webkitTransitionEnd",r.onTranslateToWrapperTransitionEnd),r.onTranslateToWrapperTransitionEnd=null,delete r.onTranslateToWrapperTransitionEnd,i&&r.emit("transitionEnd"))}),r.$wrapperEl[0].addEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.$wrapperEl[0].addEventListener("webkitTransitionEnd",r.onTranslateToWrapperTransitionEnd))),!0}},transition:{setTransition:function(e,t){this.params.cssMode||this.$wrapperEl.transition(e),this.emit("setTransition",e,t)},transitionStart:function(e,t){void 0===e&&(e=!0);var i=this.activeIndex,s=this.params,a=this.previousIndex;if(!s.cssMode){s.autoHeight&&this.updateAutoHeight();var r=t;if(r||(r=i>a?"next":i<a?"prev":"reset"),this.emit("transitionStart"),e&&i!==a){if("reset"===r)return void this.emit("slideResetTransitionStart");this.emit("slideChangeTransitionStart"),"next"===r?this.emit("slideNextTransitionStart"):this.emit("slidePrevTransitionStart")}}},transitionEnd:function(e,t){void 0===e&&(e=!0);var i=this.activeIndex,s=this.previousIndex,a=this.params;if(this.animating=!1,!a.cssMode){this.setTransition(0);var r=t;if(r||(r=i>s?"next":i<s?"prev":"reset"),this.emit("transitionEnd"),e&&i!==s){if("reset"===r)return void this.emit("slideResetTransitionEnd");this.emit("slideChangeTransitionEnd"),"next"===r?this.emit("slideNextTransitionEnd"):this.emit("slidePrevTransitionEnd")}}}},slide:{slideTo:function(e,t,i,s){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0);var a=this,r=e;r<0&&(r=0);var n=a.params,l=a.snapGrid,o=a.slidesGrid,d=a.previousIndex,h=a.activeIndex,p=a.rtlTranslate,u=a.wrapperEl;if(a.animating&&n.preventInteractionOnTransition)return!1;var c=Math.min(a.params.slidesPerGroupSkip,r),v=c+Math.floor((r-c)/a.params.slidesPerGroup);v>=l.length&&(v=l.length-1),(h||n.initialSlide||0)===(d||0)&&i&&a.emit("beforeSlideChangeStart");var f,m=-l[v];if(a.updateProgress(m),n.normalizeSlideIndex)for(var g=0;g<o.length;g+=1)-Math.floor(100*m)>=Math.floor(100*o[g])&&(r=g);if(a.initialized&&r!==h){if(!a.allowSlideNext&&m<a.translate&&m<a.minTranslate())return!1;if(!a.allowSlidePrev&&m>a.translate&&m>a.maxTranslate()&&(h||0)!==r)return!1}if(f=r>h?"next":r<h?"prev":"reset",p&&-m===a.translate||!p&&m===a.translate)return a.updateActiveIndex(r),n.autoHeight&&a.updateAutoHeight(),a.updateSlidesClasses(),"slide"!==n.effect&&a.setTranslate(m),"reset"!==f&&(a.transitionStart(i,f),a.transitionEnd(i,f)),!1;if(n.cssMode){var w,b=a.isHorizontal(),y=-m;if(p&&(y=u.scrollWidth-u.offsetWidth-y),0===t)u[b?"scrollLeft":"scrollTop"]=y;else if(u.scrollTo)u.scrollTo(((w={})[b?"left":"top"]=y,w.behavior="smooth",w));else u[b?"scrollLeft":"scrollTop"]=y;return!0}return 0===t?(a.setTransition(0),a.setTranslate(m),a.updateActiveIndex(r),a.updateSlidesClasses(),a.emit("beforeTransitionStart",t,s),a.transitionStart(i,f),a.transitionEnd(i,f)):(a.setTransition(t),a.setTranslate(m),a.updateActiveIndex(r),a.updateSlidesClasses(),a.emit("beforeTransitionStart",t,s),a.transitionStart(i,f),a.animating||(a.animating=!0,a.onSlideToWrapperTransitionEnd||(a.onSlideToWrapperTransitionEnd=function(e){a&&!a.destroyed&&e.target===this&&(a.$wrapperEl[0].removeEventListener("transitionend",a.onSlideToWrapperTransitionEnd),a.$wrapperEl[0].removeEventListener("webkitTransitionEnd",a.onSlideToWrapperTransitionEnd),a.onSlideToWrapperTransitionEnd=null,delete a.onSlideToWrapperTransitionEnd,a.transitionEnd(i,f))}),a.$wrapperEl[0].addEventListener("transitionend",a.onSlideToWrapperTransitionEnd),a.$wrapperEl[0].addEventListener("webkitTransitionEnd",a.onSlideToWrapperTransitionEnd))),!0},slideToLoop:function(e,t,i,s){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0);var a=e;return this.params.loop&&(a+=this.loopedSlides),this.slideTo(a,t,i,s)},slideNext:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var s=this.params,a=this.animating,r=this.activeIndex<s.slidesPerGroupSkip?1:s.slidesPerGroup;if(s.loop){if(a&&s.loopPreventsSlide)return!1;this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft}return this.slideTo(this.activeIndex+r,e,t,i)},slidePrev:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var s=this.params,a=this.animating,r=this.snapGrid,n=this.slidesGrid,l=this.rtlTranslate;if(s.loop){if(a&&s.loopPreventsSlide)return!1;this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft}function o(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}var d,h=o(l?this.translate:-this.translate),p=r.map((function(e){return o(e)})),u=(r[p.indexOf(h)],r[p.indexOf(h)-1]);return void 0===u&&s.cssMode&&r.forEach((function(e){!u&&h>=e&&(u=e)})),void 0!==u&&(d=n.indexOf(u))<0&&(d=this.activeIndex-1),this.slideTo(d,e,t,i)},slideReset:function(e,t,i){return void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),this.slideTo(this.activeIndex,e,t,i)},slideToClosest:function(e,t,i,s){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),void 0===s&&(s=.5);var a=this.activeIndex,r=Math.min(this.params.slidesPerGroupSkip,a),n=r+Math.floor((a-r)/this.params.slidesPerGroup),l=this.rtlTranslate?this.translate:-this.translate;if(l>=this.snapGrid[n]){var o=this.snapGrid[n];l-o>(this.snapGrid[n+1]-o)*s&&(a+=this.params.slidesPerGroup)}else{var d=this.snapGrid[n-1];l-d<=(this.snapGrid[n]-d)*s&&(a-=this.params.slidesPerGroup)}return a=Math.max(a,0),a=Math.min(a,this.slidesGrid.length-1),this.slideTo(a,e,t,i)},slideToClickedSlide:function(){var e,t=this,i=t.params,s=t.$wrapperEl,a="auto"===i.slidesPerView?t.slidesPerViewDynamic():i.slidesPerView,r=t.clickedIndex;if(i.loop){if(t.animating)return;e=parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"),10),i.centeredSlides?r<t.loopedSlides-a/2||r>t.slides.length-t.loopedSlides+a/2?(t.loopFix(),r=s.children("."+i.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+i.slideDuplicateClass+")").eq(0).index(),E((function(){t.slideTo(r)}))):t.slideTo(r):r>t.slides.length-a?(t.loopFix(),r=s.children("."+i.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+i.slideDuplicateClass+")").eq(0).index(),E((function(){t.slideTo(r)}))):t.slideTo(r)}else t.slideTo(r)}},loop:{loopCreate:function(){var e=this,t=r(),i=e.params,s=e.$wrapperEl;s.children("."+i.slideClass+"."+i.slideDuplicateClass).remove();var a=s.children("."+i.slideClass);if(i.loopFillGroupWithBlank){var n=i.slidesPerGroup-a.length%i.slidesPerGroup;if(n!==i.slidesPerGroup){for(var l=0;l<n;l+=1){var o=m(t.createElement("div")).addClass(i.slideClass+" "+i.slideBlankClass);s.append(o)}a=s.children("."+i.slideClass)}}"auto"!==i.slidesPerView||i.loopedSlides||(i.loopedSlides=a.length),e.loopedSlides=Math.ceil(parseFloat(i.loopedSlides||i.slidesPerView,10)),e.loopedSlides+=i.loopAdditionalSlides,e.loopedSlides>a.length&&(e.loopedSlides=a.length);var d=[],h=[];a.each((function(t,i){var s=m(t);i<e.loopedSlides&&h.push(t),i<a.length&&i>=a.length-e.loopedSlides&&d.push(t),s.attr("data-swiper-slide-index",i)}));for(var p=0;p<h.length;p+=1)s.append(m(h[p].cloneNode(!0)).addClass(i.slideDuplicateClass));for(var u=d.length-1;u>=0;u-=1)s.prepend(m(d[u].cloneNode(!0)).addClass(i.slideDuplicateClass))},loopFix:function(){this.emit("beforeLoopFix");var e,t=this.activeIndex,i=this.slides,s=this.loopedSlides,a=this.allowSlidePrev,r=this.allowSlideNext,n=this.snapGrid,l=this.rtlTranslate;this.allowSlidePrev=!0,this.allowSlideNext=!0;var o=-n[t]-this.getTranslate();if(t<s)e=i.length-3*s+t,e+=s,this.slideTo(e,0,!1,!0)&&0!==o&&this.setTranslate((l?-this.translate:this.translate)-o);else if(t>=i.length-s){e=-i.length+t+s,e+=s,this.slideTo(e,0,!1,!0)&&0!==o&&this.setTranslate((l?-this.translate:this.translate)-o)}this.allowSlidePrev=a,this.allowSlideNext=r,this.emit("loopFix")},loopDestroy:function(){var e=this.$wrapperEl,t=this.params,i=this.slides;e.children("."+t.slideClass+"."+t.slideDuplicateClass+",."+t.slideClass+"."+t.slideBlankClass).remove(),i.removeAttr("data-swiper-slide-index")}},grabCursor:{setGrabCursor:function(e){if(!(this.support.touch||!this.params.simulateTouch||this.params.watchOverflow&&this.isLocked||this.params.cssMode)){var t=this.el;t.style.cursor="move",t.style.cursor=e?"-webkit-grabbing":"-webkit-grab",t.style.cursor=e?"-moz-grabbin":"-moz-grab",t.style.cursor=e?"grabbing":"grab"}},unsetGrabCursor:function(){this.support.touch||this.params.watchOverflow&&this.isLocked||this.params.cssMode||(this.el.style.cursor="")}},manipulation:{appendSlide:function(e){var t=this.$wrapperEl,i=this.params;if(i.loop&&this.loopDestroy(),"object"==typeof e&&"length"in e)for(var s=0;s<e.length;s+=1)e[s]&&t.append(e[s]);else t.append(e);i.loop&&this.loopCreate(),i.observer&&this.support.observer||this.update()},prependSlide:function(e){var t=this.params,i=this.$wrapperEl,s=this.activeIndex;t.loop&&this.loopDestroy();var a=s+1;if("object"==typeof e&&"length"in e){for(var r=0;r<e.length;r+=1)e[r]&&i.prepend(e[r]);a=s+e.length}else i.prepend(e);t.loop&&this.loopCreate(),t.observer&&this.support.observer||this.update(),this.slideTo(a,0,!1)},addSlide:function(e,t){var i=this.$wrapperEl,s=this.params,a=this.activeIndex;s.loop&&(a-=this.loopedSlides,this.loopDestroy(),this.slides=i.children("."+s.slideClass));var r=this.slides.length;if(e<=0)this.prependSlide(t);else if(e>=r)this.appendSlide(t);else{for(var n=a>e?a+1:a,l=[],o=r-1;o>=e;o-=1){var d=this.slides.eq(o);d.remove(),l.unshift(d)}if("object"==typeof t&&"length"in t){for(var h=0;h<t.length;h+=1)t[h]&&i.append(t[h]);n=a>e?a+t.length:a}else i.append(t);for(var p=0;p<l.length;p+=1)i.append(l[p]);s.loop&&this.loopCreate(),s.observer&&this.support.observer||this.update(),s.loop?this.slideTo(n+this.loopedSlides,0,!1):this.slideTo(n,0,!1)}},removeSlide:function(e){var t=this.params,i=this.$wrapperEl,s=this.activeIndex;t.loop&&(s-=this.loopedSlides,this.loopDestroy(),this.slides=i.children("."+t.slideClass));var a,r=s;if("object"==typeof e&&"length"in e){for(var n=0;n<e.length;n+=1)a=e[n],this.slides[a]&&this.slides.eq(a).remove(),a<r&&(r-=1);r=Math.max(r,0)}else a=e,this.slides[a]&&this.slides.eq(a).remove(),a<r&&(r-=1),r=Math.max(r,0);t.loop&&this.loopCreate(),t.observer&&this.support.observer||this.update(),t.loop?this.slideTo(r+this.loopedSlides,0,!1):this.slideTo(r,0,!1)},removeAllSlides:function(){for(var e=[],t=0;t<this.slides.length;t+=1)e.push(t);this.removeSlide(e)}},events:{attachEvents:function(){var e=r(),t=this.params,i=this.touchEvents,s=this.el,a=this.wrapperEl,n=this.device,l=this.support;this.onTouchStart=$.bind(this),this.onTouchMove=L.bind(this),this.onTouchEnd=I.bind(this),t.cssMode&&(this.onScroll=D.bind(this)),this.onClick=A.bind(this);var o=!!t.nested;if(!l.touch&&l.pointerEvents)s.addEventListener(i.start,this.onTouchStart,!1),e.addEventListener(i.move,this.onTouchMove,o),e.addEventListener(i.end,this.onTouchEnd,!1);else{if(l.touch){var d=!("touchstart"!==i.start||!l.passiveListener||!t.passiveListeners)&&{passive:!0,capture:!1};s.addEventListener(i.start,this.onTouchStart,d),s.addEventListener(i.move,this.onTouchMove,l.passiveListener?{passive:!1,capture:o}:o),s.addEventListener(i.end,this.onTouchEnd,d),i.cancel&&s.addEventListener(i.cancel,this.onTouchEnd,d),G||(e.addEventListener("touchstart",N),G=!0)}(t.simulateTouch&&!n.ios&&!n.android||t.simulateTouch&&!l.touch&&n.ios)&&(s.addEventListener("mousedown",this.onTouchStart,!1),e.addEventListener("mousemove",this.onTouchMove,o),e.addEventListener("mouseup",this.onTouchEnd,!1))}(t.preventClicks||t.preventClicksPropagation)&&s.addEventListener("click",this.onClick,!0),t.cssMode&&a.addEventListener("scroll",this.onScroll),t.updateOnWindowResize?this.on(n.ios||n.android?"resize orientationchange observerUpdate":"resize observerUpdate",O,!0):this.on("observerUpdate",O,!0)},detachEvents:function(){var e=r(),t=this.params,i=this.touchEvents,s=this.el,a=this.wrapperEl,n=this.device,l=this.support,o=!!t.nested;if(!l.touch&&l.pointerEvents)s.removeEventListener(i.start,this.onTouchStart,!1),e.removeEventListener(i.move,this.onTouchMove,o),e.removeEventListener(i.end,this.onTouchEnd,!1);else{if(l.touch){var d=!("onTouchStart"!==i.start||!l.passiveListener||!t.passiveListeners)&&{passive:!0,capture:!1};s.removeEventListener(i.start,this.onTouchStart,d),s.removeEventListener(i.move,this.onTouchMove,o),s.removeEventListener(i.end,this.onTouchEnd,d),i.cancel&&s.removeEventListener(i.cancel,this.onTouchEnd,d)}(t.simulateTouch&&!n.ios&&!n.android||t.simulateTouch&&!l.touch&&n.ios)&&(s.removeEventListener("mousedown",this.onTouchStart,!1),e.removeEventListener("mousemove",this.onTouchMove,o),e.removeEventListener("mouseup",this.onTouchEnd,!1))}(t.preventClicks||t.preventClicksPropagation)&&s.removeEventListener("click",this.onClick,!0),t.cssMode&&a.removeEventListener("scroll",this.onScroll),this.off(n.ios||n.android?"resize orientationchange observerUpdate":"resize observerUpdate",O)}},breakpoints:{setBreakpoint:function(){var e=this.activeIndex,t=this.initialized,i=this.loopedSlides,s=void 0===i?0:i,a=this.params,r=this.$el,n=a.breakpoints;if(n&&(!n||0!==Object.keys(n).length)){var l=this.getBreakpoint(n);if(l&&this.currentBreakpoint!==l){var o=l in n?n[l]:void 0;o&&["slidesPerView","spaceBetween","slidesPerGroup","slidesPerGroupSkip","slidesPerColumn"].forEach((function(e){var t=o[e];void 0!==t&&(o[e]="slidesPerView"!==e||"AUTO"!==t&&"auto"!==t?"slidesPerView"===e?parseFloat(t):parseInt(t,10):"auto")}));var d=o||this.originalParams,h=a.slidesPerColumn>1,p=d.slidesPerColumn>1;h&&!p?(r.removeClass(a.containerModifierClass+"multirow "+a.containerModifierClass+"multirow-column"),this.emitContainerClasses()):!h&&p&&(r.addClass(a.containerModifierClass+"multirow"),"column"===d.slidesPerColumnFill&&r.addClass(a.containerModifierClass+"multirow-column"),this.emitContainerClasses());var u=d.direction&&d.direction!==a.direction,c=a.loop&&(d.slidesPerView!==a.slidesPerView||u);u&&t&&this.changeDirection(),S(this.params,d),S(this,{allowTouchMove:this.params.allowTouchMove,allowSlideNext:this.params.allowSlideNext,allowSlidePrev:this.params.allowSlidePrev}),this.currentBreakpoint=l,c&&t&&(this.loopDestroy(),this.loopCreate(),this.updateSlides(),this.slideTo(e-s+this.loopedSlides,0,!1)),this.emit("breakpoint",d)}}},getBreakpoint:function(e){var t=l();if(e){var i=!1,s=Object.keys(e).map((function(e){if("string"==typeof e&&0===e.indexOf("@")){var i=parseFloat(e.substr(1));return{value:t.innerHeight*i,point:e}}return{value:e,point:e}}));s.sort((function(e,t){return parseInt(e.value,10)-parseInt(t.value,10)}));for(var a=0;a<s.length;a+=1){var r=s[a],n=r.point;r.value<=t.innerWidth&&(i=n)}return i||"max"}}},checkOverflow:{checkOverflow:function(){var e=this.params,t=this.isLocked,i=this.slides.length>0&&e.slidesOffsetBefore+e.spaceBetween*(this.slides.length-1)+this.slides[0].offsetWidth*this.slides.length;e.slidesOffsetBefore&&e.slidesOffsetAfter&&i?this.isLocked=i<=this.size:this.isLocked=1===this.snapGrid.length,this.allowSlideNext=!this.isLocked,this.allowSlidePrev=!this.isLocked,t!==this.isLocked&&this.emit(this.isLocked?"lock":"unlock"),t&&t!==this.isLocked&&(this.isEnd=!1,this.navigation&&this.navigation.update())}},classes:{addClasses:function(){var e=this.classNames,t=this.params,i=this.rtl,s=this.$el,a=this.device,r=[];r.push("initialized"),r.push(t.direction),t.freeMode&&r.push("free-mode"),t.autoHeight&&r.push("autoheight"),i&&r.push("rtl"),t.slidesPerColumn>1&&(r.push("multirow"),"column"===t.slidesPerColumnFill&&r.push("multirow-column")),a.android&&r.push("android"),a.ios&&r.push("ios"),t.cssMode&&r.push("css-mode"),r.forEach((function(i){e.push(t.containerModifierClass+i)})),s.addClass(e.join(" ")),this.emitContainerClasses()},removeClasses:function(){var e=this.$el,t=this.classNames;e.removeClass(t.join(" ")),this.emitContainerClasses()}},images:{loadImage:function(e,t,i,s,a,r){var n,o=l();function d(){r&&r()}m(e).parent("picture")[0]||e.complete&&a?d():t?((n=new o.Image).onload=d,n.onerror=d,s&&(n.sizes=s),i&&(n.srcset=i),t&&(n.src=t)):d()},preloadImages:function(){var e=this;function t(){null!=e&&e&&!e.destroyed&&(void 0!==e.imagesLoaded&&(e.imagesLoaded+=1),e.imagesLoaded===e.imagesToLoad.length&&(e.params.updateOnImagesReady&&e.update(),e.emit("imagesReady")))}e.imagesToLoad=e.$el.find("img");for(var i=0;i<e.imagesToLoad.length;i+=1){var s=e.imagesToLoad[i];e.loadImage(s,s.currentSrc||s.getAttribute("src"),s.srcset||s.getAttribute("srcset"),s.sizes||s.getAttribute("sizes"),!0,t)}}}},X={},Y=function(){function t(){for(var e,i,s=arguments.length,a=new Array(s),r=0;r<s;r++)a[r]=arguments[r];1===a.length&&a[0].constructor&&a[0].constructor===Object?i=a[0]:(e=a[0],i=a[1]),i||(i={}),i=S({},i),e&&!i.el&&(i.el=e);var n=this;n.support=z(),n.device=P({userAgent:i.userAgent}),n.browser=k(),n.eventsListeners={},n.eventsAnyListeners=[],Object.keys(H).forEach((function(e){Object.keys(H[e]).forEach((function(i){t.prototype[i]||(t.prototype[i]=H[e][i])}))})),void 0===n.modules&&(n.modules={}),Object.keys(n.modules).forEach((function(e){var t=n.modules[e];if(t.params){var s=Object.keys(t.params)[0],a=t.params[s];if("object"!=typeof a||null===a)return;if(!(s in i)||!("enabled"in a))return;!0===i[s]&&(i[s]={enabled:!0}),"object"!=typeof i[s]||"enabled"in i[s]||(i[s].enabled=!0),i[s]||(i[s]={enabled:!1})}}));var l=S({},B);n.useParams(l),n.params=S({},l,X,i),n.originalParams=S({},n.params),n.passedParams=S({},i),n.params&&n.params.on&&Object.keys(n.params.on).forEach((function(e){n.on(e,n.params.on[e])})),n.$=m;var o=m(n.params.el);if(e=o[0]){if(o.length>1){var d=[];return o.each((function(e){var s=S({},i,{el:e});d.push(new t(s))})),d}var h,p,u;return e.swiper=n,e&&e.shadowRoot&&e.shadowRoot.querySelector?(h=m(e.shadowRoot.querySelector("."+n.params.wrapperClass))).children=function(e){return o.children(e)}:h=o.children("."+n.params.wrapperClass),S(n,{$el:o,el:e,$wrapperEl:h,wrapperEl:h[0],classNames:[],slides:m(),slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:function(){return"horizontal"===n.params.direction},isVertical:function(){return"vertical"===n.params.direction},rtl:"rtl"===e.dir.toLowerCase()||"rtl"===o.css("direction"),rtlTranslate:"horizontal"===n.params.direction&&("rtl"===e.dir.toLowerCase()||"rtl"===o.css("direction")),wrongRTL:"-webkit-box"===h.css("display"),activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,allowSlideNext:n.params.allowSlideNext,allowSlidePrev:n.params.allowSlidePrev,touchEvents:(p=["touchstart","touchmove","touchend","touchcancel"],u=["mousedown","mousemove","mouseup"],n.support.pointerEvents&&(u=["pointerdown","pointermove","pointerup"]),n.touchEventsTouch={start:p[0],move:p[1],end:p[2],cancel:p[3]},n.touchEventsDesktop={start:u[0],move:u[1],end:u[2]},n.support.touch||!n.params.simulateTouch?n.touchEventsTouch:n.touchEventsDesktop),touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,formElements:"input, select, option, textarea, button, video, label",lastClickTime:x(),clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,isTouchEvent:void 0,startMoving:void 0},allowClick:!0,allowTouchMove:n.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),n.useModules(),n.emit("_swiper"),n.params.init&&n.init(),n}}var i,s,a,r=t.prototype;return r.emitContainerClasses=function(){var e=this;if(e.params._emitClasses&&e.el){var t=e.el.className.split(" ").filter((function(t){return 0===t.indexOf("swiper-container")||0===t.indexOf(e.params.containerModifierClass)}));e.emit("_containerClasses",t.join(" "))}},r.emitSlidesClasses=function(){var e=this;e.params._emitClasses&&e.el&&e.slides.each((function(t){var i=t.className.split(" ").filter((function(t){return 0===t.indexOf("swiper-slide")||0===t.indexOf(e.params.slideClass)}));e.emit("_slideClass",t,i.join(" "))}))},r.slidesPerViewDynamic=function(){var e=this.params,t=this.slides,i=this.slidesGrid,s=this.size,a=this.activeIndex,r=1;if(e.centeredSlides){for(var n,l=t[a].swiperSlideSize,o=a+1;o<t.length;o+=1)t[o]&&!n&&(r+=1,(l+=t[o].swiperSlideSize)>s&&(n=!0));for(var d=a-1;d>=0;d-=1)t[d]&&!n&&(r+=1,(l+=t[d].swiperSlideSize)>s&&(n=!0))}else for(var h=a+1;h<t.length;h+=1)i[h]-i[a]<s&&(r+=1);return r},r.update=function(){var e=this;if(e&&!e.destroyed){var t=e.snapGrid,i=e.params;i.breakpoints&&e.setBreakpoint(),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),e.params.freeMode?(s(),e.params.autoHeight&&e.updateAutoHeight()):(("auto"===e.params.slidesPerView||e.params.slidesPerView>1)&&e.isEnd&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0))||s(),i.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}function s(){var t=e.rtlTranslate?-1*e.translate:e.translate,i=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(i),e.updateActiveIndex(),e.updateSlidesClasses()}},r.changeDirection=function(e,t){void 0===t&&(t=!0);var i=this.params.direction;return e||(e="horizontal"===i?"vertical":"horizontal"),e===i||"horizontal"!==e&&"vertical"!==e||(this.$el.removeClass(""+this.params.containerModifierClass+i).addClass(""+this.params.containerModifierClass+e),this.emitContainerClasses(),this.params.direction=e,this.slides.each((function(t){"vertical"===e?t.style.width="":t.style.height=""})),this.emit("changeDirection"),t&&this.update()),this},r.init=function(){this.initialized||(this.emit("beforeInit"),this.params.breakpoints&&this.setBreakpoint(),this.addClasses(),this.params.loop&&this.loopCreate(),this.updateSize(),this.updateSlides(),this.params.watchOverflow&&this.checkOverflow(),this.params.grabCursor&&this.setGrabCursor(),this.params.preloadImages&&this.preloadImages(),this.params.loop?this.slideTo(this.params.initialSlide+this.loopedSlides,0,this.params.runCallbacksOnInit):this.slideTo(this.params.initialSlide,0,this.params.runCallbacksOnInit),this.attachEvents(),this.initialized=!0,this.emit("init"))},r.destroy=function(e,t){void 0===e&&(e=!0),void 0===t&&(t=!0);var i,s=this,a=s.params,r=s.$el,n=s.$wrapperEl,l=s.slides;return void 0===s.params||s.destroyed||(s.emit("beforeDestroy"),s.initialized=!1,s.detachEvents(),a.loop&&s.loopDestroy(),t&&(s.removeClasses(),r.removeAttr("style"),n.removeAttr("style"),l&&l.length&&l.removeClass([a.slideVisibleClass,a.slideActiveClass,a.slideNextClass,a.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),s.emit("destroy"),Object.keys(s.eventsListeners).forEach((function(e){s.off(e)})),!1!==e&&(s.$el[0].swiper=null,i=s,Object.keys(i).forEach((function(e){try{i[e]=null}catch(e){}try{delete i[e]}catch(e){}}))),s.destroyed=!0),null},t.extendDefaults=function(e){S(X,e)},t.installModule=function(e){t.prototype.modules||(t.prototype.modules={});var i=e.name||Object.keys(t.prototype.modules).length+"_"+x();t.prototype.modules[i]=e},t.use=function(e){return Array.isArray(e)?(e.forEach((function(e){return t.installModule(e)})),t):(t.installModule(e),t)},i=t,a=[{key:"extendedDefaults",get:function(){return X}},{key:"defaults",get:function(){return B}}],(s=null)&&e(i.prototype,s),a&&e(i,a),t}(),V={name:"resize",create:function(){var e=this;S(e,{resize:{resizeHandler:function(){e&&!e.destroyed&&e.initialized&&(e.emit("beforeResize"),e.emit("resize"))},orientationChangeHandler:function(){e&&!e.destroyed&&e.initialized&&e.emit("orientationchange")}}})},on:{init:function(e){var t=l();t.addEventListener("resize",e.resize.resizeHandler),t.addEventListener("orientationchange",e.resize.orientationChangeHandler)},destroy:function(e){var t=l();t.removeEventListener("resize",e.resize.resizeHandler),t.removeEventListener("orientationchange",e.resize.orientationChangeHandler)}}},F={attach:function(e,t){void 0===t&&(t={});var i=l(),s=this,a=new(i.MutationObserver||i.WebkitMutationObserver)((function(e){if(1!==e.length){var t=function(){s.emit("observerUpdate",e[0])};i.requestAnimationFrame?i.requestAnimationFrame(t):i.setTimeout(t,0)}else s.emit("observerUpdate",e[0])}));a.observe(e,{attributes:void 0===t.attributes||t.attributes,childList:void 0===t.childList||t.childList,characterData:void 0===t.characterData||t.characterData}),s.observer.observers.push(a)},init:function(){if(this.support.observer&&this.params.observer){if(this.params.observeParents)for(var e=this.$el.parents(),t=0;t<e.length;t+=1)this.observer.attach(e[t]);this.observer.attach(this.$el[0],{childList:this.params.observeSlideChildren}),this.observer.attach(this.$wrapperEl[0],{attributes:!1})}},destroy:function(){this.observer.observers.forEach((function(e){e.disconnect()})),this.observer.observers=[]}},W={name:"observer",params:{observer:!1,observeParents:!1,observeSlideChildren:!1},create:function(){M(this,{observer:t(t({},F),{},{observers:[]})})},on:{init:function(e){e.observer.init()},destroy:function(e){e.observer.destroy()}}},R={update:function(e){var t=this,i=t.params,s=i.slidesPerView,a=i.slidesPerGroup,r=i.centeredSlides,n=t.params.virtual,l=n.addSlidesBefore,o=n.addSlidesAfter,d=t.virtual,h=d.from,p=d.to,u=d.slides,c=d.slidesGrid,v=d.renderSlide,f=d.offset;t.updateActiveIndex();var m,g,w,b=t.activeIndex||0;m=t.rtlTranslate?"right":t.isHorizontal()?"left":"top",r?(g=Math.floor(s/2)+a+o,w=Math.floor(s/2)+a+l):(g=s+(a-1)+o,w=a+l);var y=Math.max((b||0)-w,0),E=Math.min((b||0)+g,u.length-1),x=(t.slidesGrid[y]||0)-(t.slidesGrid[0]||0);function T(){t.updateSlides(),t.updateProgress(),t.updateSlidesClasses(),t.lazy&&t.params.lazy.enabled&&t.lazy.load()}if(S(t.virtual,{from:y,to:E,offset:x,slidesGrid:t.slidesGrid}),h===y&&p===E&&!e)return t.slidesGrid!==c&&x!==f&&t.slides.css(m,x+"px"),void t.updateProgress();if(t.params.virtual.renderExternal)return t.params.virtual.renderExternal.call(t,{offset:x,from:y,to:E,slides:function(){for(var e=[],t=y;t<=E;t+=1)e.push(u[t]);return e}()}),void(t.params.virtual.renderExternalUpdate&&T());var C=[],M=[];if(e)t.$wrapperEl.find("."+t.params.slideClass).remove();else for(var z=h;z<=p;z+=1)(z<y||z>E)&&t.$wrapperEl.find("."+t.params.slideClass+'[data-swiper-slide-index="'+z+'"]').remove();for(var P=0;P<u.length;P+=1)P>=y&&P<=E&&(void 0===p||e?M.push(P):(P>p&&M.push(P),P<h&&C.push(P)));M.forEach((function(e){t.$wrapperEl.append(v(u[e],e))})),C.sort((function(e,t){return t-e})).forEach((function(e){t.$wrapperEl.prepend(v(u[e],e))})),t.$wrapperEl.children(".swiper-slide").css(m,x+"px"),T()},renderSlide:function(e,t){var i=this.params.virtual;if(i.cache&&this.virtual.cache[t])return this.virtual.cache[t];var s=i.renderSlide?m(i.renderSlide.call(this,e,t)):m('<div class="'+this.params.slideClass+'" data-swiper-slide-index="'+t+'">'+e+"</div>");return s.attr("data-swiper-slide-index")||s.attr("data-swiper-slide-index",t),i.cache&&(this.virtual.cache[t]=s),s},appendSlide:function(e){if("object"==typeof e&&"length"in e)for(var t=0;t<e.length;t+=1)e[t]&&this.virtual.slides.push(e[t]);else this.virtual.slides.push(e);this.virtual.update(!0)},prependSlide:function(e){var t=this.activeIndex,i=t+1,s=1;if(Array.isArray(e)){for(var a=0;a<e.length;a+=1)e[a]&&this.virtual.slides.unshift(e[a]);i=t+e.length,s=e.length}else this.virtual.slides.unshift(e);if(this.params.virtual.cache){var r=this.virtual.cache,n={};Object.keys(r).forEach((function(e){var t=r[e],i=t.attr("data-swiper-slide-index");i&&t.attr("data-swiper-slide-index",parseInt(i,10)+1),n[parseInt(e,10)+s]=t})),this.virtual.cache=n}this.virtual.update(!0),this.slideTo(i,0)},removeSlide:function(e){if(null!=e){var t=this.activeIndex;if(Array.isArray(e))for(var i=e.length-1;i>=0;i-=1)this.virtual.slides.splice(e[i],1),this.params.virtual.cache&&delete this.virtual.cache[e[i]],e[i]<t&&(t-=1),t=Math.max(t,0);else this.virtual.slides.splice(e,1),this.params.virtual.cache&&delete this.virtual.cache[e],e<t&&(t-=1),t=Math.max(t,0);this.virtual.update(!0),this.slideTo(t,0)}},removeAllSlides:function(){this.virtual.slides=[],this.params.virtual.cache&&(this.virtual.cache={}),this.virtual.update(!0),this.slideTo(0,0)}},q={name:"virtual",params:{virtual:{enabled:!1,slides:[],cache:!0,renderSlide:null,renderExternal:null,renderExternalUpdate:!0,addSlidesBefore:0,addSlidesAfter:0}},create:function(){M(this,{virtual:t(t({},R),{},{slides:this.params.virtual.slides,cache:{}})})},on:{beforeInit:function(e){if(e.params.virtual.enabled){e.classNames.push(e.params.containerModifierClass+"virtual");var t={watchSlidesProgress:!0};S(e.params,t),S(e.originalParams,t),e.params.initialSlide||e.virtual.update()}},setTranslate:function(e){e.params.virtual.enabled&&e.virtual.update()}}},j={handle:function(e){var t=l(),i=r(),s=this.rtlTranslate,a=e;a.originalEvent&&(a=a.originalEvent);var n=a.keyCode||a.charCode,o=this.params.keyboard.pageUpDown,d=o&&33===n,h=o&&34===n,p=37===n,u=39===n,c=38===n,v=40===n;if(!this.allowSlideNext&&(this.isHorizontal()&&u||this.isVertical()&&v||h))return!1;if(!this.allowSlidePrev&&(this.isHorizontal()&&p||this.isVertical()&&c||d))return!1;if(!(a.shiftKey||a.altKey||a.ctrlKey||a.metaKey||i.activeElement&&i.activeElement.nodeName&&("input"===i.activeElement.nodeName.toLowerCase()||"textarea"===i.activeElement.nodeName.toLowerCase()))){if(this.params.keyboard.onlyInViewport&&(d||h||p||u||c||v)){var f=!1;if(this.$el.parents("."+this.params.slideClass).length>0&&0===this.$el.parents("."+this.params.slideActiveClass).length)return;var m=t.innerWidth,g=t.innerHeight,w=this.$el.offset();s&&(w.left-=this.$el[0].scrollLeft);for(var b=[[w.left,w.top],[w.left+this.width,w.top],[w.left,w.top+this.height],[w.left+this.width,w.top+this.height]],y=0;y<b.length;y+=1){var E=b[y];E[0]>=0&&E[0]<=m&&E[1]>=0&&E[1]<=g&&(f=!0)}if(!f)return}this.isHorizontal()?((d||h||p||u)&&(a.preventDefault?a.preventDefault():a.returnValue=!1),((h||u)&&!s||(d||p)&&s)&&this.slideNext(),((d||p)&&!s||(h||u)&&s)&&this.slidePrev()):((d||h||c||v)&&(a.preventDefault?a.preventDefault():a.returnValue=!1),(h||v)&&this.slideNext(),(d||c)&&this.slidePrev()),this.emit("keyPress",n)}},enable:function(){var e=r();this.keyboard.enabled||(m(e).on("keydown",this.keyboard.handle),this.keyboard.enabled=!0)},disable:function(){var e=r();this.keyboard.enabled&&(m(e).off("keydown",this.keyboard.handle),this.keyboard.enabled=!1)}},_={name:"keyboard",params:{keyboard:{enabled:!1,onlyInViewport:!0,pageUpDown:!0}},create:function(){M(this,{keyboard:t({enabled:!1},j)})},on:{init:function(e){e.params.keyboard.enabled&&e.keyboard.enable()},destroy:function(e){e.keyboard.enabled&&e.keyboard.disable()}}};var U={lastScrollTime:x(),lastEventBeforeSnap:void 0,recentWheelEvents:[],event:function(){return l().navigator.userAgent.indexOf("firefox")>-1?"DOMMouseScroll":function(){var e=r(),t="onwheel"in e;if(!t){var i=e.createElement("div");i.setAttribute("onwheel","return;"),t="function"==typeof i.onwheel}return!t&&e.implementation&&e.implementation.hasFeature&&!0!==e.implementation.hasFeature("","")&&(t=e.implementation.hasFeature("Events.wheel","3.0")),t}()?"wheel":"mousewheel"},normalize:function(e){var t=0,i=0,s=0,a=0;return"detail"in e&&(i=e.detail),"wheelDelta"in e&&(i=-e.wheelDelta/120),"wheelDeltaY"in e&&(i=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=i,i=0),s=10*t,a=10*i,"deltaY"in e&&(a=e.deltaY),"deltaX"in e&&(s=e.deltaX),e.shiftKey&&!s&&(s=a,a=0),(s||a)&&e.deltaMode&&(1===e.deltaMode?(s*=40,a*=40):(s*=800,a*=800)),s&&!t&&(t=s<1?-1:1),a&&!i&&(i=a<1?-1:1),{spinX:t,spinY:i,pixelX:s,pixelY:a}},handleMouseEnter:function(){this.mouseEntered=!0},handleMouseLeave:function(){this.mouseEntered=!1},handle:function(e){var t=e,i=this,s=i.params.mousewheel;i.params.cssMode&&t.preventDefault();var a=i.$el;if("container"!==i.params.mousewheel.eventsTarget&&(a=m(i.params.mousewheel.eventsTarget)),!i.mouseEntered&&!a[0].contains(t.target)&&!s.releaseOnEdges)return!0;t.originalEvent&&(t=t.originalEvent);var r=0,n=i.rtlTranslate?-1:1,l=U.normalize(t);if(s.forceToAxis)if(i.isHorizontal()){if(!(Math.abs(l.pixelX)>Math.abs(l.pixelY)))return!0;r=-l.pixelX*n}else{if(!(Math.abs(l.pixelY)>Math.abs(l.pixelX)))return!0;r=-l.pixelY}else r=Math.abs(l.pixelX)>Math.abs(l.pixelY)?-l.pixelX*n:-l.pixelY;if(0===r)return!0;if(s.invert&&(r=-r),i.params.freeMode){var o={time:x(),delta:Math.abs(r),direction:Math.sign(r)},d=i.mousewheel.lastEventBeforeSnap,h=d&&o.time<d.time+500&&o.delta<=d.delta&&o.direction===d.direction;if(!h){i.mousewheel.lastEventBeforeSnap=void 0,i.params.loop&&i.loopFix();var p=i.getTranslate()+r*s.sensitivity,u=i.isBeginning,c=i.isEnd;if(p>=i.minTranslate()&&(p=i.minTranslate()),p<=i.maxTranslate()&&(p=i.maxTranslate()),i.setTransition(0),i.setTranslate(p),i.updateProgress(),i.updateActiveIndex(),i.updateSlidesClasses(),(!u&&i.isBeginning||!c&&i.isEnd)&&i.updateSlidesClasses(),i.params.freeModeSticky){clearTimeout(i.mousewheel.timeout),i.mousewheel.timeout=void 0;var v=i.mousewheel.recentWheelEvents;v.length>=15&&v.shift();var f=v.length?v[v.length-1]:void 0,g=v[0];if(v.push(o),f&&(o.delta>f.delta||o.direction!==f.direction))v.splice(0);else if(v.length>=15&&o.time-g.time<500&&g.delta-o.delta>=1&&o.delta<=6){var w=r>0?.8:.2;i.mousewheel.lastEventBeforeSnap=o,v.splice(0),i.mousewheel.timeout=E((function(){i.slideToClosest(i.params.speed,!0,void 0,w)}),0)}i.mousewheel.timeout||(i.mousewheel.timeout=E((function(){i.mousewheel.lastEventBeforeSnap=o,v.splice(0),i.slideToClosest(i.params.speed,!0,void 0,.5)}),500))}if(h||i.emit("scroll",t),i.params.autoplay&&i.params.autoplayDisableOnInteraction&&i.autoplay.stop(),p===i.minTranslate()||p===i.maxTranslate())return!0}}else{var b={time:x(),delta:Math.abs(r),direction:Math.sign(r),raw:e},y=i.mousewheel.recentWheelEvents;y.length>=2&&y.shift();var T=y.length?y[y.length-1]:void 0;if(y.push(b),T?(b.direction!==T.direction||b.delta>T.delta||b.time>T.time+150)&&i.mousewheel.animateSlider(b):i.mousewheel.animateSlider(b),i.mousewheel.releaseScroll(b))return!0}return t.preventDefault?t.preventDefault():t.returnValue=!1,!1},animateSlider:function(e){var t=l();return e.delta>=6&&x()-this.mousewheel.lastScrollTime<60||(e.direction<0?this.isEnd&&!this.params.loop||this.animating||(this.slideNext(),this.emit("scroll",e.raw)):this.isBeginning&&!this.params.loop||this.animating||(this.slidePrev(),this.emit("scroll",e.raw)),this.mousewheel.lastScrollTime=(new t.Date).getTime(),!1)},releaseScroll:function(e){var t=this.params.mousewheel;if(e.direction<0){if(this.isEnd&&!this.params.loop&&t.releaseOnEdges)return!0}else if(this.isBeginning&&!this.params.loop&&t.releaseOnEdges)return!0;return!1},enable:function(){var e=U.event();if(this.params.cssMode)return this.wrapperEl.removeEventListener(e,this.mousewheel.handle),!0;if(!e)return!1;if(this.mousewheel.enabled)return!1;var t=this.$el;return"container"!==this.params.mousewheel.eventsTarget&&(t=m(this.params.mousewheel.eventsTarget)),t.on("mouseenter",this.mousewheel.handleMouseEnter),t.on("mouseleave",this.mousewheel.handleMouseLeave),t.on(e,this.mousewheel.handle),this.mousewheel.enabled=!0,!0},disable:function(){var e=U.event();if(this.params.cssMode)return this.wrapperEl.addEventListener(e,this.mousewheel.handle),!0;if(!e)return!1;if(!this.mousewheel.enabled)return!1;var t=this.$el;return"container"!==this.params.mousewheel.eventsTarget&&(t=m(this.params.mousewheel.eventsTarget)),t.off(e,this.mousewheel.handle),this.mousewheel.enabled=!1,!0}},K={update:function(){var e=this.params.navigation;if(!this.params.loop){var t=this.navigation,i=t.$nextEl,s=t.$prevEl;s&&s.length>0&&(this.isBeginning?s.addClass(e.disabledClass):s.removeClass(e.disabledClass),s[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](e.lockClass)),i&&i.length>0&&(this.isEnd?i.addClass(e.disabledClass):i.removeClass(e.disabledClass),i[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](e.lockClass))}},onPrevClick:function(e){e.preventDefault(),this.isBeginning&&!this.params.loop||this.slidePrev()},onNextClick:function(e){e.preventDefault(),this.isEnd&&!this.params.loop||this.slideNext()},init:function(){var e,t,i=this.params.navigation;(i.nextEl||i.prevEl)&&(i.nextEl&&(e=m(i.nextEl),this.params.uniqueNavElements&&"string"==typeof i.nextEl&&e.length>1&&1===this.$el.find(i.nextEl).length&&(e=this.$el.find(i.nextEl))),i.prevEl&&(t=m(i.prevEl),this.params.uniqueNavElements&&"string"==typeof i.prevEl&&t.length>1&&1===this.$el.find(i.prevEl).length&&(t=this.$el.find(i.prevEl))),e&&e.length>0&&e.on("click",this.navigation.onNextClick),t&&t.length>0&&t.on("click",this.navigation.onPrevClick),S(this.navigation,{$nextEl:e,nextEl:e&&e[0],$prevEl:t,prevEl:t&&t[0]}))},destroy:function(){var e=this.navigation,t=e.$nextEl,i=e.$prevEl;t&&t.length&&(t.off("click",this.navigation.onNextClick),t.removeClass(this.params.navigation.disabledClass)),i&&i.length&&(i.off("click",this.navigation.onPrevClick),i.removeClass(this.params.navigation.disabledClass))}},Z={update:function(){var e=this.rtl,t=this.params.pagination;if(t.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var i,s=this.virtual&&this.params.virtual.enabled?this.virtual.slides.length:this.slides.length,a=this.pagination.$el,r=this.params.loop?Math.ceil((s-2*this.loopedSlides)/this.params.slidesPerGroup):this.snapGrid.length;if(this.params.loop?((i=Math.ceil((this.activeIndex-this.loopedSlides)/this.params.slidesPerGroup))>s-1-2*this.loopedSlides&&(i-=s-2*this.loopedSlides),i>r-1&&(i-=r),i<0&&"bullets"!==this.params.paginationType&&(i=r+i)):i=void 0!==this.snapIndex?this.snapIndex:this.activeIndex||0,"bullets"===t.type&&this.pagination.bullets&&this.pagination.bullets.length>0){var n,l,o,d=this.pagination.bullets;if(t.dynamicBullets&&(this.pagination.bulletSize=d.eq(0)[this.isHorizontal()?"outerWidth":"outerHeight"](!0),a.css(this.isHorizontal()?"width":"height",this.pagination.bulletSize*(t.dynamicMainBullets+4)+"px"),t.dynamicMainBullets>1&&void 0!==this.previousIndex&&(this.pagination.dynamicBulletIndex+=i-this.previousIndex,this.pagination.dynamicBulletIndex>t.dynamicMainBullets-1?this.pagination.dynamicBulletIndex=t.dynamicMainBullets-1:this.pagination.dynamicBulletIndex<0&&(this.pagination.dynamicBulletIndex=0)),n=i-this.pagination.dynamicBulletIndex,o=((l=n+(Math.min(d.length,t.dynamicMainBullets)-1))+n)/2),d.removeClass(t.bulletActiveClass+" "+t.bulletActiveClass+"-next "+t.bulletActiveClass+"-next-next "+t.bulletActiveClass+"-prev "+t.bulletActiveClass+"-prev-prev "+t.bulletActiveClass+"-main"),a.length>1)d.each((function(e){var s=m(e),a=s.index();a===i&&s.addClass(t.bulletActiveClass),t.dynamicBullets&&(a>=n&&a<=l&&s.addClass(t.bulletActiveClass+"-main"),a===n&&s.prev().addClass(t.bulletActiveClass+"-prev").prev().addClass(t.bulletActiveClass+"-prev-prev"),a===l&&s.next().addClass(t.bulletActiveClass+"-next").next().addClass(t.bulletActiveClass+"-next-next"))}));else{var h=d.eq(i),p=h.index();if(h.addClass(t.bulletActiveClass),t.dynamicBullets){for(var u=d.eq(n),c=d.eq(l),v=n;v<=l;v+=1)d.eq(v).addClass(t.bulletActiveClass+"-main");if(this.params.loop)if(p>=d.length-t.dynamicMainBullets){for(var f=t.dynamicMainBullets;f>=0;f-=1)d.eq(d.length-f).addClass(t.bulletActiveClass+"-main");d.eq(d.length-t.dynamicMainBullets-1).addClass(t.bulletActiveClass+"-prev")}else u.prev().addClass(t.bulletActiveClass+"-prev").prev().addClass(t.bulletActiveClass+"-prev-prev"),c.next().addClass(t.bulletActiveClass+"-next").next().addClass(t.bulletActiveClass+"-next-next");else u.prev().addClass(t.bulletActiveClass+"-prev").prev().addClass(t.bulletActiveClass+"-prev-prev"),c.next().addClass(t.bulletActiveClass+"-next").next().addClass(t.bulletActiveClass+"-next-next")}}if(t.dynamicBullets){var g=Math.min(d.length,t.dynamicMainBullets+4),w=(this.pagination.bulletSize*g-this.pagination.bulletSize)/2-o*this.pagination.bulletSize,b=e?"right":"left";d.css(this.isHorizontal()?b:"top",w+"px")}}if("fraction"===t.type&&(a.find("."+t.currentClass).text(t.formatFractionCurrent(i+1)),a.find("."+t.totalClass).text(t.formatFractionTotal(r))),"progressbar"===t.type){var y;y=t.progressbarOpposite?this.isHorizontal()?"vertical":"horizontal":this.isHorizontal()?"horizontal":"vertical";var E=(i+1)/r,x=1,T=1;"horizontal"===y?x=E:T=E,a.find("."+t.progressbarFillClass).transform("translate3d(0,0,0) scaleX("+x+") scaleY("+T+")").transition(this.params.speed)}"custom"===t.type&&t.renderCustom?(a.html(t.renderCustom(this,i+1,r)),this.emit("paginationRender",a[0])):this.emit("paginationUpdate",a[0]),a[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](t.lockClass)}},render:function(){var e=this.params.pagination;if(e.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var t=this.virtual&&this.params.virtual.enabled?this.virtual.slides.length:this.slides.length,i=this.pagination.$el,s="";if("bullets"===e.type){for(var a=this.params.loop?Math.ceil((t-2*this.loopedSlides)/this.params.slidesPerGroup):this.snapGrid.length,r=0;r<a;r+=1)e.renderBullet?s+=e.renderBullet.call(this,r,e.bulletClass):s+="<"+e.bulletElement+' class="'+e.bulletClass+'"></'+e.bulletElement+">";i.html(s),this.pagination.bullets=i.find("."+e.bulletClass)}"fraction"===e.type&&(s=e.renderFraction?e.renderFraction.call(this,e.currentClass,e.totalClass):'<span class="'+e.currentClass+'"></span> / <span class="'+e.totalClass+'"></span>',i.html(s)),"progressbar"===e.type&&(s=e.renderProgressbar?e.renderProgressbar.call(this,e.progressbarFillClass):'<span class="'+e.progressbarFillClass+'"></span>',i.html(s)),"custom"!==e.type&&this.emit("paginationRender",this.pagination.$el[0])}},init:function(){var e=this,t=e.params.pagination;if(t.el){var i=m(t.el);0!==i.length&&(e.params.uniqueNavElements&&"string"==typeof t.el&&i.length>1&&(i=e.$el.find(t.el)),"bullets"===t.type&&t.clickable&&i.addClass(t.clickableClass),i.addClass(t.modifierClass+t.type),"bullets"===t.type&&t.dynamicBullets&&(i.addClass(""+t.modifierClass+t.type+"-dynamic"),e.pagination.dynamicBulletIndex=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),"progressbar"===t.type&&t.progressbarOpposite&&i.addClass(t.progressbarOppositeClass),t.clickable&&i.on("click","."+t.bulletClass,(function(t){t.preventDefault();var i=m(this).index()*e.params.slidesPerGroup;e.params.loop&&(i+=e.loopedSlides),e.slideTo(i)})),S(e.pagination,{$el:i,el:i[0]}))}},destroy:function(){var e=this.params.pagination;if(e.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var t=this.pagination.$el;t.removeClass(e.hiddenClass),t.removeClass(e.modifierClass+e.type),this.pagination.bullets&&this.pagination.bullets.removeClass(e.bulletActiveClass),e.clickable&&t.off("click","."+e.bulletClass)}}},J={setTranslate:function(){if(this.params.scrollbar.el&&this.scrollbar.el){var e=this.scrollbar,t=this.rtlTranslate,i=this.progress,s=e.dragSize,a=e.trackSize,r=e.$dragEl,n=e.$el,l=this.params.scrollbar,o=s,d=(a-s)*i;t?(d=-d)>0?(o=s-d,d=0):-d+s>a&&(o=a+d):d<0?(o=s+d,d=0):d+s>a&&(o=a-d),this.isHorizontal()?(r.transform("translate3d("+d+"px, 0, 0)"),r[0].style.width=o+"px"):(r.transform("translate3d(0px, "+d+"px, 0)"),r[0].style.height=o+"px"),l.hide&&(clearTimeout(this.scrollbar.timeout),n[0].style.opacity=1,this.scrollbar.timeout=setTimeout((function(){n[0].style.opacity=0,n.transition(400)}),1e3))}},setTransition:function(e){this.params.scrollbar.el&&this.scrollbar.el&&this.scrollbar.$dragEl.transition(e)},updateSize:function(){if(this.params.scrollbar.el&&this.scrollbar.el){var e=this.scrollbar,t=e.$dragEl,i=e.$el;t[0].style.width="",t[0].style.height="";var s,a=this.isHorizontal()?i[0].offsetWidth:i[0].offsetHeight,r=this.size/this.virtualSize,n=r*(a/this.size);s="auto"===this.params.scrollbar.dragSize?a*r:parseInt(this.params.scrollbar.dragSize,10),this.isHorizontal()?t[0].style.width=s+"px":t[0].style.height=s+"px",i[0].style.display=r>=1?"none":"",this.params.scrollbar.hide&&(i[0].style.opacity=0),S(e,{trackSize:a,divider:r,moveDivider:n,dragSize:s}),e.$el[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](this.params.scrollbar.lockClass)}},getPointerPosition:function(e){return this.isHorizontal()?"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].clientX:e.clientX:"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].clientY:e.clientY},setDragPosition:function(e){var t,i=this.scrollbar,s=this.rtlTranslate,a=i.$el,r=i.dragSize,n=i.trackSize,l=i.dragStartPos;t=(i.getPointerPosition(e)-a.offset()[this.isHorizontal()?"left":"top"]-(null!==l?l:r/2))/(n-r),t=Math.max(Math.min(t,1),0),s&&(t=1-t);var o=this.minTranslate()+(this.maxTranslate()-this.minTranslate())*t;this.updateProgress(o),this.setTranslate(o),this.updateActiveIndex(),this.updateSlidesClasses()},onDragStart:function(e){var t=this.params.scrollbar,i=this.scrollbar,s=this.$wrapperEl,a=i.$el,r=i.$dragEl;this.scrollbar.isTouched=!0,this.scrollbar.dragStartPos=e.target===r[0]||e.target===r?i.getPointerPosition(e)-e.target.getBoundingClientRect()[this.isHorizontal()?"left":"top"]:null,e.preventDefault(),e.stopPropagation(),s.transition(100),r.transition(100),i.setDragPosition(e),clearTimeout(this.scrollbar.dragTimeout),a.transition(0),t.hide&&a.css("opacity",1),this.params.cssMode&&this.$wrapperEl.css("scroll-snap-type","none"),this.emit("scrollbarDragStart",e)},onDragMove:function(e){var t=this.scrollbar,i=this.$wrapperEl,s=t.$el,a=t.$dragEl;this.scrollbar.isTouched&&(e.preventDefault?e.preventDefault():e.returnValue=!1,t.setDragPosition(e),i.transition(0),s.transition(0),a.transition(0),this.emit("scrollbarDragMove",e))},onDragEnd:function(e){var t=this.params.scrollbar,i=this.scrollbar,s=this.$wrapperEl,a=i.$el;this.scrollbar.isTouched&&(this.scrollbar.isTouched=!1,this.params.cssMode&&(this.$wrapperEl.css("scroll-snap-type",""),s.transition("")),t.hide&&(clearTimeout(this.scrollbar.dragTimeout),this.scrollbar.dragTimeout=E((function(){a.css("opacity",0),a.transition(400)}),1e3)),this.emit("scrollbarDragEnd",e),t.snapOnRelease&&this.slideToClosest())},enableDraggable:function(){if(this.params.scrollbar.el){var e=r(),t=this.scrollbar,i=this.touchEventsTouch,s=this.touchEventsDesktop,a=this.params,n=this.support,l=t.$el[0],o=!(!n.passiveListener||!a.passiveListeners)&&{passive:!1,capture:!1},d=!(!n.passiveListener||!a.passiveListeners)&&{passive:!0,capture:!1};n.touch?(l.addEventListener(i.start,this.scrollbar.onDragStart,o),l.addEventListener(i.move,this.scrollbar.onDragMove,o),l.addEventListener(i.end,this.scrollbar.onDragEnd,d)):(l.addEventListener(s.start,this.scrollbar.onDragStart,o),e.addEventListener(s.move,this.scrollbar.onDragMove,o),e.addEventListener(s.end,this.scrollbar.onDragEnd,d))}},disableDraggable:function(){if(this.params.scrollbar.el){var e=r(),t=this.scrollbar,i=this.touchEventsTouch,s=this.touchEventsDesktop,a=this.params,n=this.support,l=t.$el[0],o=!(!n.passiveListener||!a.passiveListeners)&&{passive:!1,capture:!1},d=!(!n.passiveListener||!a.passiveListeners)&&{passive:!0,capture:!1};n.touch?(l.removeEventListener(i.start,this.scrollbar.onDragStart,o),l.removeEventListener(i.move,this.scrollbar.onDragMove,o),l.removeEventListener(i.end,this.scrollbar.onDragEnd,d)):(l.removeEventListener(s.start,this.scrollbar.onDragStart,o),e.removeEventListener(s.move,this.scrollbar.onDragMove,o),e.removeEventListener(s.end,this.scrollbar.onDragEnd,d))}},init:function(){if(this.params.scrollbar.el){var e=this.scrollbar,t=this.$el,i=this.params.scrollbar,s=m(i.el);this.params.uniqueNavElements&&"string"==typeof i.el&&s.length>1&&1===t.find(i.el).length&&(s=t.find(i.el));var a=s.find("."+this.params.scrollbar.dragClass);0===a.length&&(a=m('<div class="'+this.params.scrollbar.dragClass+'"></div>'),s.append(a)),S(e,{$el:s,el:s[0],$dragEl:a,dragEl:a[0]}),i.draggable&&e.enableDraggable()}},destroy:function(){this.scrollbar.disableDraggable()}},Q={setTransform:function(e,t){var i=this.rtl,s=m(e),a=i?-1:1,r=s.attr("data-swiper-parallax")||"0",n=s.attr("data-swiper-parallax-x"),l=s.attr("data-swiper-parallax-y"),o=s.attr("data-swiper-parallax-scale"),d=s.attr("data-swiper-parallax-opacity");if(n||l?(n=n||"0",l=l||"0"):this.isHorizontal()?(n=r,l="0"):(l=r,n="0"),n=n.indexOf("%")>=0?parseInt(n,10)*t*a+"%":n*t*a+"px",l=l.indexOf("%")>=0?parseInt(l,10)*t+"%":l*t+"px",null!=d){var h=d-(d-1)*(1-Math.abs(t));s[0].style.opacity=h}if(null==o)s.transform("translate3d("+n+", "+l+", 0px)");else{var p=o-(o-1)*(1-Math.abs(t));s.transform("translate3d("+n+", "+l+", 0px) scale("+p+")")}},setTranslate:function(){var e=this,t=e.$el,i=e.slides,s=e.progress,a=e.snapGrid;t.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t){e.parallax.setTransform(t,s)})),i.each((function(t,i){var r=t.progress;e.params.slidesPerGroup>1&&"auto"!==e.params.slidesPerView&&(r+=Math.ceil(i/2)-s*(a.length-1)),r=Math.min(Math.max(r,-1),1),m(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t){e.parallax.setTransform(t,r)}))}))},setTransition:function(e){void 0===e&&(e=this.params.speed);this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t){var i=m(t),s=parseInt(i.attr("data-swiper-parallax-duration"),10)||e;0===e&&(s=0),i.transition(s)}))}},ee={getDistanceBetweenTouches:function(e){if(e.targetTouches.length<2)return 1;var t=e.targetTouches[0].pageX,i=e.targetTouches[0].pageY,s=e.targetTouches[1].pageX,a=e.targetTouches[1].pageY;return Math.sqrt(Math.pow(s-t,2)+Math.pow(a-i,2))},onGestureStart:function(e){var t=this.support,i=this.params.zoom,s=this.zoom,a=s.gesture;if(s.fakeGestureTouched=!1,s.fakeGestureMoved=!1,!t.gestures){if("touchstart"!==e.type||"touchstart"===e.type&&e.targetTouches.length<2)return;s.fakeGestureTouched=!0,a.scaleStart=ee.getDistanceBetweenTouches(e)}a.$slideEl&&a.$slideEl.length||(a.$slideEl=m(e.target).closest("."+this.params.slideClass),0===a.$slideEl.length&&(a.$slideEl=this.slides.eq(this.activeIndex)),a.$imageEl=a.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),a.$imageWrapEl=a.$imageEl.parent("."+i.containerClass),a.maxRatio=a.$imageWrapEl.attr("data-swiper-zoom")||i.maxRatio,0!==a.$imageWrapEl.length)?(a.$imageEl&&a.$imageEl.transition(0),this.zoom.isScaling=!0):a.$imageEl=void 0},onGestureChange:function(e){var t=this.support,i=this.params.zoom,s=this.zoom,a=s.gesture;if(!t.gestures){if("touchmove"!==e.type||"touchmove"===e.type&&e.targetTouches.length<2)return;s.fakeGestureMoved=!0,a.scaleMove=ee.getDistanceBetweenTouches(e)}a.$imageEl&&0!==a.$imageEl.length?(t.gestures?s.scale=e.scale*s.currentScale:s.scale=a.scaleMove/a.scaleStart*s.currentScale,s.scale>a.maxRatio&&(s.scale=a.maxRatio-1+Math.pow(s.scale-a.maxRatio+1,.5)),s.scale<i.minRatio&&(s.scale=i.minRatio+1-Math.pow(i.minRatio-s.scale+1,.5)),a.$imageEl.transform("translate3d(0,0,0) scale("+s.scale+")")):"gesturechange"===e.type&&s.onGestureStart(e)},onGestureEnd:function(e){var t=this.device,i=this.support,s=this.params.zoom,a=this.zoom,r=a.gesture;if(!i.gestures){if(!a.fakeGestureTouched||!a.fakeGestureMoved)return;if("touchend"!==e.type||"touchend"===e.type&&e.changedTouches.length<2&&!t.android)return;a.fakeGestureTouched=!1,a.fakeGestureMoved=!1}r.$imageEl&&0!==r.$imageEl.length&&(a.scale=Math.max(Math.min(a.scale,r.maxRatio),s.minRatio),r.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale("+a.scale+")"),a.currentScale=a.scale,a.isScaling=!1,1===a.scale&&(r.$slideEl=void 0))},onTouchStart:function(e){var t=this.device,i=this.zoom,s=i.gesture,a=i.image;s.$imageEl&&0!==s.$imageEl.length&&(a.isTouched||(t.android&&e.cancelable&&e.preventDefault(),a.isTouched=!0,a.touchesStart.x="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,a.touchesStart.y="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY))},onTouchMove:function(e){var t=this.zoom,i=t.gesture,s=t.image,a=t.velocity;if(i.$imageEl&&0!==i.$imageEl.length&&(this.allowClick=!1,s.isTouched&&i.$slideEl)){s.isMoved||(s.width=i.$imageEl[0].offsetWidth,s.height=i.$imageEl[0].offsetHeight,s.startX=T(i.$imageWrapEl[0],"x")||0,s.startY=T(i.$imageWrapEl[0],"y")||0,i.slideWidth=i.$slideEl[0].offsetWidth,i.slideHeight=i.$slideEl[0].offsetHeight,i.$imageWrapEl.transition(0),this.rtl&&(s.startX=-s.startX,s.startY=-s.startY));var r=s.width*t.scale,n=s.height*t.scale;if(!(r<i.slideWidth&&n<i.slideHeight)){if(s.minX=Math.min(i.slideWidth/2-r/2,0),s.maxX=-s.minX,s.minY=Math.min(i.slideHeight/2-n/2,0),s.maxY=-s.minY,s.touchesCurrent.x="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,s.touchesCurrent.y="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,!s.isMoved&&!t.isScaling){if(this.isHorizontal()&&(Math.floor(s.minX)===Math.floor(s.startX)&&s.touchesCurrent.x<s.touchesStart.x||Math.floor(s.maxX)===Math.floor(s.startX)&&s.touchesCurrent.x>s.touchesStart.x))return void(s.isTouched=!1);if(!this.isHorizontal()&&(Math.floor(s.minY)===Math.floor(s.startY)&&s.touchesCurrent.y<s.touchesStart.y||Math.floor(s.maxY)===Math.floor(s.startY)&&s.touchesCurrent.y>s.touchesStart.y))return void(s.isTouched=!1)}e.cancelable&&e.preventDefault(),e.stopPropagation(),s.isMoved=!0,s.currentX=s.touchesCurrent.x-s.touchesStart.x+s.startX,s.currentY=s.touchesCurrent.y-s.touchesStart.y+s.startY,s.currentX<s.minX&&(s.currentX=s.minX+1-Math.pow(s.minX-s.currentX+1,.8)),s.currentX>s.maxX&&(s.currentX=s.maxX-1+Math.pow(s.currentX-s.maxX+1,.8)),s.currentY<s.minY&&(s.currentY=s.minY+1-Math.pow(s.minY-s.currentY+1,.8)),s.currentY>s.maxY&&(s.currentY=s.maxY-1+Math.pow(s.currentY-s.maxY+1,.8)),a.prevPositionX||(a.prevPositionX=s.touchesCurrent.x),a.prevPositionY||(a.prevPositionY=s.touchesCurrent.y),a.prevTime||(a.prevTime=Date.now()),a.x=(s.touchesCurrent.x-a.prevPositionX)/(Date.now()-a.prevTime)/2,a.y=(s.touchesCurrent.y-a.prevPositionY)/(Date.now()-a.prevTime)/2,Math.abs(s.touchesCurrent.x-a.prevPositionX)<2&&(a.x=0),Math.abs(s.touchesCurrent.y-a.prevPositionY)<2&&(a.y=0),a.prevPositionX=s.touchesCurrent.x,a.prevPositionY=s.touchesCurrent.y,a.prevTime=Date.now(),i.$imageWrapEl.transform("translate3d("+s.currentX+"px, "+s.currentY+"px,0)")}}},onTouchEnd:function(){var e=this.zoom,t=e.gesture,i=e.image,s=e.velocity;if(t.$imageEl&&0!==t.$imageEl.length){if(!i.isTouched||!i.isMoved)return i.isTouched=!1,void(i.isMoved=!1);i.isTouched=!1,i.isMoved=!1;var a=300,r=300,n=s.x*a,l=i.currentX+n,o=s.y*r,d=i.currentY+o;0!==s.x&&(a=Math.abs((l-i.currentX)/s.x)),0!==s.y&&(r=Math.abs((d-i.currentY)/s.y));var h=Math.max(a,r);i.currentX=l,i.currentY=d;var p=i.width*e.scale,u=i.height*e.scale;i.minX=Math.min(t.slideWidth/2-p/2,0),i.maxX=-i.minX,i.minY=Math.min(t.slideHeight/2-u/2,0),i.maxY=-i.minY,i.currentX=Math.max(Math.min(i.currentX,i.maxX),i.minX),i.currentY=Math.max(Math.min(i.currentY,i.maxY),i.minY),t.$imageWrapEl.transition(h).transform("translate3d("+i.currentX+"px, "+i.currentY+"px,0)")}},onTransitionEnd:function(){var e=this.zoom,t=e.gesture;t.$slideEl&&this.previousIndex!==this.activeIndex&&(t.$imageEl&&t.$imageEl.transform("translate3d(0,0,0) scale(1)"),t.$imageWrapEl&&t.$imageWrapEl.transform("translate3d(0,0,0)"),e.scale=1,e.currentScale=1,t.$slideEl=void 0,t.$imageEl=void 0,t.$imageWrapEl=void 0)},toggle:function(e){var t=this.zoom;t.scale&&1!==t.scale?t.out():t.in(e)},in:function(e){var t,i,s,a,r,n,l,o,d,h,p,u,c,v,f,m,g=this.zoom,w=this.params.zoom,b=g.gesture,y=g.image;(b.$slideEl||(this.params.virtual&&this.params.virtual.enabled&&this.virtual?b.$slideEl=this.$wrapperEl.children("."+this.params.slideActiveClass):b.$slideEl=this.slides.eq(this.activeIndex),b.$imageEl=b.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),b.$imageWrapEl=b.$imageEl.parent("."+w.containerClass)),b.$imageEl&&0!==b.$imageEl.length)&&(b.$slideEl.addClass(""+w.zoomedSlideClass),void 0===y.touchesStart.x&&e?(t="touchend"===e.type?e.changedTouches[0].pageX:e.pageX,i="touchend"===e.type?e.changedTouches[0].pageY:e.pageY):(t=y.touchesStart.x,i=y.touchesStart.y),g.scale=b.$imageWrapEl.attr("data-swiper-zoom")||w.maxRatio,g.currentScale=b.$imageWrapEl.attr("data-swiper-zoom")||w.maxRatio,e?(f=b.$slideEl[0].offsetWidth,m=b.$slideEl[0].offsetHeight,s=b.$slideEl.offset().left+f/2-t,a=b.$slideEl.offset().top+m/2-i,l=b.$imageEl[0].offsetWidth,o=b.$imageEl[0].offsetHeight,d=l*g.scale,h=o*g.scale,c=-(p=Math.min(f/2-d/2,0)),v=-(u=Math.min(m/2-h/2,0)),(r=s*g.scale)<p&&(r=p),r>c&&(r=c),(n=a*g.scale)<u&&(n=u),n>v&&(n=v)):(r=0,n=0),b.$imageWrapEl.transition(300).transform("translate3d("+r+"px, "+n+"px,0)"),b.$imageEl.transition(300).transform("translate3d(0,0,0) scale("+g.scale+")"))},out:function(){var e=this.zoom,t=this.params.zoom,i=e.gesture;i.$slideEl||(this.params.virtual&&this.params.virtual.enabled&&this.virtual?i.$slideEl=this.$wrapperEl.children("."+this.params.slideActiveClass):i.$slideEl=this.slides.eq(this.activeIndex),i.$imageEl=i.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),i.$imageWrapEl=i.$imageEl.parent("."+t.containerClass)),i.$imageEl&&0!==i.$imageEl.length&&(e.scale=1,e.currentScale=1,i.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),i.$slideEl.removeClass(""+t.zoomedSlideClass),i.$slideEl=void 0)},toggleGestures:function(e){var t=this.zoom,i=t.slideSelector,s=t.passiveListener;this.$wrapperEl[e]("gesturestart",i,t.onGestureStart,s),this.$wrapperEl[e]("gesturechange",i,t.onGestureChange,s),this.$wrapperEl[e]("gestureend",i,t.onGestureEnd,s)},enableGestures:function(){this.zoom.gesturesEnabled||(this.zoom.gesturesEnabled=!0,this.zoom.toggleGestures("on"))},disableGestures:function(){this.zoom.gesturesEnabled&&(this.zoom.gesturesEnabled=!1,this.zoom.toggleGestures("off"))},enable:function(){var e=this.support,t=this.zoom;if(!t.enabled){t.enabled=!0;var i=!("touchstart"!==this.touchEvents.start||!e.passiveListener||!this.params.passiveListeners)&&{passive:!0,capture:!1},s=!e.passiveListener||{passive:!1,capture:!0},a="."+this.params.slideClass;this.zoom.passiveListener=i,this.zoom.slideSelector=a,e.gestures?(this.$wrapperEl.on(this.touchEvents.start,this.zoom.enableGestures,i),this.$wrapperEl.on(this.touchEvents.end,this.zoom.disableGestures,i)):"touchstart"===this.touchEvents.start&&(this.$wrapperEl.on(this.touchEvents.start,a,t.onGestureStart,i),this.$wrapperEl.on(this.touchEvents.move,a,t.onGestureChange,s),this.$wrapperEl.on(this.touchEvents.end,a,t.onGestureEnd,i),this.touchEvents.cancel&&this.$wrapperEl.on(this.touchEvents.cancel,a,t.onGestureEnd,i)),this.$wrapperEl.on(this.touchEvents.move,"."+this.params.zoom.containerClass,t.onTouchMove,s)}},disable:function(){var e=this.zoom;if(e.enabled){var t=this.support;this.zoom.enabled=!1;var i=!("touchstart"!==this.touchEvents.start||!t.passiveListener||!this.params.passiveListeners)&&{passive:!0,capture:!1},s=!t.passiveListener||{passive:!1,capture:!0},a="."+this.params.slideClass;t.gestures?(this.$wrapperEl.off(this.touchEvents.start,this.zoom.enableGestures,i),this.$wrapperEl.off(this.touchEvents.end,this.zoom.disableGestures,i)):"touchstart"===this.touchEvents.start&&(this.$wrapperEl.off(this.touchEvents.start,a,e.onGestureStart,i),this.$wrapperEl.off(this.touchEvents.move,a,e.onGestureChange,s),this.$wrapperEl.off(this.touchEvents.end,a,e.onGestureEnd,i),this.touchEvents.cancel&&this.$wrapperEl.off(this.touchEvents.cancel,a,e.onGestureEnd,i)),this.$wrapperEl.off(this.touchEvents.move,"."+this.params.zoom.containerClass,e.onTouchMove,s)}}},te={loadInSlide:function(e,t){void 0===t&&(t=!0);var i=this,s=i.params.lazy;if(void 0!==e&&0!==i.slides.length){var a=i.virtual&&i.params.virtual.enabled?i.$wrapperEl.children("."+i.params.slideClass+'[data-swiper-slide-index="'+e+'"]'):i.slides.eq(e),r=a.find("."+s.elementClass+":not(."+s.loadedClass+"):not(."+s.loadingClass+")");!a.hasClass(s.elementClass)||a.hasClass(s.loadedClass)||a.hasClass(s.loadingClass)||r.push(a[0]),0!==r.length&&r.each((function(e){var r=m(e);r.addClass(s.loadingClass);var n=r.attr("data-background"),l=r.attr("data-src"),o=r.attr("data-srcset"),d=r.attr("data-sizes"),h=r.parent("picture");i.loadImage(r[0],l||n,o,d,!1,(function(){if(null!=i&&i&&(!i||i.params)&&!i.destroyed){if(n?(r.css("background-image",'url("'+n+'")'),r.removeAttr("data-background")):(o&&(r.attr("srcset",o),r.removeAttr("data-srcset")),d&&(r.attr("sizes",d),r.removeAttr("data-sizes")),h.length&&h.children("source").each((function(e){var t=m(e);t.attr("data-srcset")&&(t.attr("srcset",t.attr("data-srcset")),t.removeAttr("data-srcset"))})),l&&(r.attr("src",l),r.removeAttr("data-src"))),r.addClass(s.loadedClass).removeClass(s.loadingClass),a.find("."+s.preloaderClass).remove(),i.params.loop&&t){var e=a.attr("data-swiper-slide-index");if(a.hasClass(i.params.slideDuplicateClass)){var p=i.$wrapperEl.children('[data-swiper-slide-index="'+e+'"]:not(.'+i.params.slideDuplicateClass+")");i.lazy.loadInSlide(p.index(),!1)}else{var u=i.$wrapperEl.children("."+i.params.slideDuplicateClass+'[data-swiper-slide-index="'+e+'"]');i.lazy.loadInSlide(u.index(),!1)}}i.emit("lazyImageReady",a[0],r[0]),i.params.autoHeight&&i.updateAutoHeight()}})),i.emit("lazyImageLoad",a[0],r[0])}))}},load:function(){var e=this,t=e.$wrapperEl,i=e.params,s=e.slides,a=e.activeIndex,r=e.virtual&&i.virtual.enabled,n=i.lazy,l=i.slidesPerView;function o(e){if(r){if(t.children("."+i.slideClass+'[data-swiper-slide-index="'+e+'"]').length)return!0}else if(s[e])return!0;return!1}function d(e){return r?m(e).attr("data-swiper-slide-index"):m(e).index()}if("auto"===l&&(l=0),e.lazy.initialImageLoaded||(e.lazy.initialImageLoaded=!0),e.params.watchSlidesVisibility)t.children("."+i.slideVisibleClass).each((function(t){var i=r?m(t).attr("data-swiper-slide-index"):m(t).index();e.lazy.loadInSlide(i)}));else if(l>1)for(var h=a;h<a+l;h+=1)o(h)&&e.lazy.loadInSlide(h);else e.lazy.loadInSlide(a);if(n.loadPrevNext)if(l>1||n.loadPrevNextAmount&&n.loadPrevNextAmount>1){for(var p=n.loadPrevNextAmount,u=l,c=Math.min(a+u+Math.max(p,u),s.length),v=Math.max(a-Math.max(u,p),0),f=a+l;f<c;f+=1)o(f)&&e.lazy.loadInSlide(f);for(var g=v;g<a;g+=1)o(g)&&e.lazy.loadInSlide(g)}else{var w=t.children("."+i.slideNextClass);w.length>0&&e.lazy.loadInSlide(d(w));var b=t.children("."+i.slidePrevClass);b.length>0&&e.lazy.loadInSlide(d(b))}}},ie={LinearSpline:function(e,t){var i,s,a,r,n,l=function(e,t){for(s=-1,i=e.length;i-s>1;)e[a=i+s>>1]<=t?s=a:i=a;return i};return this.x=e,this.y=t,this.lastIndex=e.length-1,this.interpolate=function(e){return e?(n=l(this.x,e),r=n-1,(e-this.x[r])*(this.y[n]-this.y[r])/(this.x[n]-this.x[r])+this.y[r]):0},this},getInterpolateFunction:function(e){this.controller.spline||(this.controller.spline=this.params.loop?new ie.LinearSpline(this.slidesGrid,e.slidesGrid):new ie.LinearSpline(this.snapGrid,e.snapGrid))},setTranslate:function(e,t){var i,s,a=this,r=a.controller.control,n=a.constructor;function l(e){var t=a.rtlTranslate?-a.translate:a.translate;"slide"===a.params.controller.by&&(a.controller.getInterpolateFunction(e),s=-a.controller.spline.interpolate(-t)),s&&"container"!==a.params.controller.by||(i=(e.maxTranslate()-e.minTranslate())/(a.maxTranslate()-a.minTranslate()),s=(t-a.minTranslate())*i+e.minTranslate()),a.params.controller.inverse&&(s=e.maxTranslate()-s),e.updateProgress(s),e.setTranslate(s,a),e.updateActiveIndex(),e.updateSlidesClasses()}if(Array.isArray(r))for(var o=0;o<r.length;o+=1)r[o]!==t&&r[o]instanceof n&&l(r[o]);else r instanceof n&&t!==r&&l(r)},setTransition:function(e,t){var i,s=this,a=s.constructor,r=s.controller.control;function n(t){t.setTransition(e,s),0!==e&&(t.transitionStart(),t.params.autoHeight&&E((function(){t.updateAutoHeight()})),t.$wrapperEl.transitionEnd((function(){r&&(t.params.loop&&"slide"===s.params.controller.by&&t.loopFix(),t.transitionEnd())})))}if(Array.isArray(r))for(i=0;i<r.length;i+=1)r[i]!==t&&r[i]instanceof a&&n(r[i]);else r instanceof a&&t!==r&&n(r)}},se={makeElFocusable:function(e){return e.attr("tabIndex","0"),e},makeElNotFocusable:function(e){return e.attr("tabIndex","-1"),e},addElRole:function(e,t){return e.attr("role",t),e},addElLabel:function(e,t){return e.attr("aria-label",t),e},disableEl:function(e){return e.attr("aria-disabled",!0),e},enableEl:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){var t=this.params.a11y;if(13===e.keyCode){var i=m(e.target);this.navigation&&this.navigation.$nextEl&&i.is(this.navigation.$nextEl)&&(this.isEnd&&!this.params.loop||this.slideNext(),this.isEnd?this.a11y.notify(t.lastSlideMessage):this.a11y.notify(t.nextSlideMessage)),this.navigation&&this.navigation.$prevEl&&i.is(this.navigation.$prevEl)&&(this.isBeginning&&!this.params.loop||this.slidePrev(),this.isBeginning?this.a11y.notify(t.firstSlideMessage):this.a11y.notify(t.prevSlideMessage)),this.pagination&&i.is("."+this.params.pagination.bulletClass)&&i[0].click()}},notify:function(e){var t=this.a11y.liveRegion;0!==t.length&&(t.html(""),t.html(e))},updateNavigation:function(){if(!this.params.loop&&this.navigation){var e=this.navigation,t=e.$nextEl,i=e.$prevEl;i&&i.length>0&&(this.isBeginning?(this.a11y.disableEl(i),this.a11y.makeElNotFocusable(i)):(this.a11y.enableEl(i),this.a11y.makeElFocusable(i))),t&&t.length>0&&(this.isEnd?(this.a11y.disableEl(t),this.a11y.makeElNotFocusable(t)):(this.a11y.enableEl(t),this.a11y.makeElFocusable(t)))}},updatePagination:function(){var e=this,t=e.params.a11y;e.pagination&&e.params.pagination.clickable&&e.pagination.bullets&&e.pagination.bullets.length&&e.pagination.bullets.each((function(i){var s=m(i);e.a11y.makeElFocusable(s),e.a11y.addElRole(s,"button"),e.a11y.addElLabel(s,t.paginationBulletMessage.replace(/\{\{index\}\}/,s.index()+1))}))},init:function(){this.$el.append(this.a11y.liveRegion);var e,t,i=this.params.a11y;this.navigation&&this.navigation.$nextEl&&(e=this.navigation.$nextEl),this.navigation&&this.navigation.$prevEl&&(t=this.navigation.$prevEl),e&&(this.a11y.makeElFocusable(e),this.a11y.addElRole(e,"button"),this.a11y.addElLabel(e,i.nextSlideMessage),e.on("keydown",this.a11y.onEnterKey)),t&&(this.a11y.makeElFocusable(t),this.a11y.addElRole(t,"button"),this.a11y.addElLabel(t,i.prevSlideMessage),t.on("keydown",this.a11y.onEnterKey)),this.pagination&&this.params.pagination.clickable&&this.pagination.bullets&&this.pagination.bullets.length&&this.pagination.$el.on("keydown","."+this.params.pagination.bulletClass,this.a11y.onEnterKey)},destroy:function(){var e,t;this.a11y.liveRegion&&this.a11y.liveRegion.length>0&&this.a11y.liveRegion.remove(),this.navigation&&this.navigation.$nextEl&&(e=this.navigation.$nextEl),this.navigation&&this.navigation.$prevEl&&(t=this.navigation.$prevEl),e&&e.off("keydown",this.a11y.onEnterKey),t&&t.off("keydown",this.a11y.onEnterKey),this.pagination&&this.params.pagination.clickable&&this.pagination.bullets&&this.pagination.bullets.length&&this.pagination.$el.off("keydown","."+this.params.pagination.bulletClass,this.a11y.onEnterKey)}},ae={init:function(){var e=l();if(this.params.history){if(!e.history||!e.history.pushState)return this.params.history.enabled=!1,void(this.params.hashNavigation.enabled=!0);var t=this.history;t.initialized=!0,t.paths=ae.getPathValues(this.params.url),(t.paths.key||t.paths.value)&&(t.scrollToSlide(0,t.paths.value,this.params.runCallbacksOnInit),this.params.history.replaceState||e.addEventListener("popstate",this.history.setHistoryPopState))}},destroy:function(){var e=l();this.params.history.replaceState||e.removeEventListener("popstate",this.history.setHistoryPopState)},setHistoryPopState:function(){this.history.paths=ae.getPathValues(this.params.url),this.history.scrollToSlide(this.params.speed,this.history.paths.value,!1)},getPathValues:function(e){var t=l(),i=(e?new URL(e):t.location).pathname.slice(1).split("/").filter((function(e){return""!==e})),s=i.length;return{key:i[s-2],value:i[s-1]}},setHistory:function(e,t){var i=l();if(this.history.initialized&&this.params.history.enabled){var s;s=this.params.url?new URL(this.params.url):i.location;var a=this.slides.eq(t),r=ae.slugify(a.attr("data-history"));s.pathname.includes(e)||(r=e+"/"+r);var n=i.history.state;n&&n.value===r||(this.params.history.replaceState?i.history.replaceState({value:r},null,r):i.history.pushState({value:r},null,r))}},slugify:function(e){return e.toString().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},scrollToSlide:function(e,t,i){if(t)for(var s=0,a=this.slides.length;s<a;s+=1){var r=this.slides.eq(s);if(ae.slugify(r.attr("data-history"))===t&&!r.hasClass(this.params.slideDuplicateClass)){var n=r.index();this.slideTo(n,e,i)}}else this.slideTo(0,e,i)}},re={onHashCange:function(){var e=r();this.emit("hashChange");var t=e.location.hash.replace("#","");if(t!==this.slides.eq(this.activeIndex).attr("data-hash")){var i=this.$wrapperEl.children("."+this.params.slideClass+'[data-hash="'+t+'"]').index();if(void 0===i)return;this.slideTo(i)}},setHash:function(){var e=l(),t=r();if(this.hashNavigation.initialized&&this.params.hashNavigation.enabled)if(this.params.hashNavigation.replaceState&&e.history&&e.history.replaceState)e.history.replaceState(null,null,"#"+this.slides.eq(this.activeIndex).attr("data-hash")||""),this.emit("hashSet");else{var i=this.slides.eq(this.activeIndex),s=i.attr("data-hash")||i.attr("data-history");t.location.hash=s||"",this.emit("hashSet")}},init:function(){var e=r(),t=l();if(!(!this.params.hashNavigation.enabled||this.params.history&&this.params.history.enabled)){this.hashNavigation.initialized=!0;var i=e.location.hash.replace("#","");if(i)for(var s=0,a=this.slides.length;s<a;s+=1){var n=this.slides.eq(s);if((n.attr("data-hash")||n.attr("data-history"))===i&&!n.hasClass(this.params.slideDuplicateClass)){var o=n.index();this.slideTo(o,0,this.params.runCallbacksOnInit,!0)}}this.params.hashNavigation.watchState&&m(t).on("hashchange",this.hashNavigation.onHashCange)}},destroy:function(){var e=l();this.params.hashNavigation.watchState&&m(e).off("hashchange",this.hashNavigation.onHashCange)}},ne={run:function(){var e=this,t=e.slides.eq(e.activeIndex),i=e.params.autoplay.delay;t.attr("data-swiper-autoplay")&&(i=t.attr("data-swiper-autoplay")||e.params.autoplay.delay),clearTimeout(e.autoplay.timeout),e.autoplay.timeout=E((function(){e.params.autoplay.reverseDirection?e.params.loop?(e.loopFix(),e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.isBeginning?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(e.slideTo(e.slides.length-1,e.params.speed,!0,!0),e.emit("autoplay")):(e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.params.loop?(e.loopFix(),e.slideNext(e.params.speed,!0,!0),e.emit("autoplay")):e.isEnd?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(e.slideTo(0,e.params.speed,!0,!0),e.emit("autoplay")):(e.slideNext(e.params.speed,!0,!0),e.emit("autoplay")),e.params.cssMode&&e.autoplay.running&&e.autoplay.run()}),i)},start:function(){return void 0===this.autoplay.timeout&&(!this.autoplay.running&&(this.autoplay.running=!0,this.emit("autoplayStart"),this.autoplay.run(),!0))},stop:function(){return!!this.autoplay.running&&(void 0!==this.autoplay.timeout&&(this.autoplay.timeout&&(clearTimeout(this.autoplay.timeout),this.autoplay.timeout=void 0),this.autoplay.running=!1,this.emit("autoplayStop"),!0))},pause:function(e){this.autoplay.running&&(this.autoplay.paused||(this.autoplay.timeout&&clearTimeout(this.autoplay.timeout),this.autoplay.paused=!0,0!==e&&this.params.autoplay.waitForTransition?(this.$wrapperEl[0].addEventListener("transitionend",this.autoplay.onTransitionEnd),this.$wrapperEl[0].addEventListener("webkitTransitionEnd",this.autoplay.onTransitionEnd)):(this.autoplay.paused=!1,this.autoplay.run())))},onVisibilityChange:function(){var e=r();"hidden"===e.visibilityState&&this.autoplay.running&&this.autoplay.pause(),"visible"===e.visibilityState&&this.autoplay.paused&&(this.autoplay.run(),this.autoplay.paused=!1)},onTransitionEnd:function(e){this&&!this.destroyed&&this.$wrapperEl&&e.target===this.$wrapperEl[0]&&(this.$wrapperEl[0].removeEventListener("transitionend",this.autoplay.onTransitionEnd),this.$wrapperEl[0].removeEventListener("webkitTransitionEnd",this.autoplay.onTransitionEnd),this.autoplay.paused=!1,this.autoplay.running?this.autoplay.run():this.autoplay.stop())}},le={setTranslate:function(){for(var e=this.slides,t=0;t<e.length;t+=1){var i=this.slides.eq(t),s=-i[0].swiperSlideOffset;this.params.virtualTranslate||(s-=this.translate);var a=0;this.isHorizontal()||(a=s,s=0);var r=this.params.fadeEffect.crossFade?Math.max(1-Math.abs(i[0].progress),0):1+Math.min(Math.max(i[0].progress,-1),0);i.css({opacity:r}).transform("translate3d("+s+"px, "+a+"px, 0px)")}},setTransition:function(e){var t=this,i=t.slides,s=t.$wrapperEl;if(i.transition(e),t.params.virtualTranslate&&0!==e){var a=!1;i.transitionEnd((function(){if(!a&&t&&!t.destroyed){a=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],i=0;i<e.length;i+=1)s.trigger(e[i])}}))}}},oe={setTranslate:function(){var e,t=this.$el,i=this.$wrapperEl,s=this.slides,a=this.width,r=this.height,n=this.rtlTranslate,l=this.size,o=this.browser,d=this.params.cubeEffect,h=this.isHorizontal(),p=this.virtual&&this.params.virtual.enabled,u=0;d.shadow&&(h?(0===(e=i.find(".swiper-cube-shadow")).length&&(e=m('<div class="swiper-cube-shadow"></div>'),i.append(e)),e.css({height:a+"px"})):0===(e=t.find(".swiper-cube-shadow")).length&&(e=m('<div class="swiper-cube-shadow"></div>'),t.append(e)));for(var c=0;c<s.length;c+=1){var v=s.eq(c),f=c;p&&(f=parseInt(v.attr("data-swiper-slide-index"),10));var g=90*f,w=Math.floor(g/360);n&&(g=-g,w=Math.floor(-g/360));var b=Math.max(Math.min(v[0].progress,1),-1),y=0,E=0,x=0;f%4==0?(y=4*-w*l,x=0):(f-1)%4==0?(y=0,x=4*-w*l):(f-2)%4==0?(y=l+4*w*l,x=l):(f-3)%4==0&&(y=-l,x=3*l+4*l*w),n&&(y=-y),h||(E=y,y=0);var T="rotateX("+(h?0:-g)+"deg) rotateY("+(h?g:0)+"deg) translate3d("+y+"px, "+E+"px, "+x+"px)";if(b<=1&&b>-1&&(u=90*f+90*b,n&&(u=90*-f-90*b)),v.transform(T),d.slideShadows){var C=h?v.find(".swiper-slide-shadow-left"):v.find(".swiper-slide-shadow-top"),S=h?v.find(".swiper-slide-shadow-right"):v.find(".swiper-slide-shadow-bottom");0===C.length&&(C=m('<div class="swiper-slide-shadow-'+(h?"left":"top")+'"></div>'),v.append(C)),0===S.length&&(S=m('<div class="swiper-slide-shadow-'+(h?"right":"bottom")+'"></div>'),v.append(S)),C.length&&(C[0].style.opacity=Math.max(-b,0)),S.length&&(S[0].style.opacity=Math.max(b,0))}}if(i.css({"-webkit-transform-origin":"50% 50% -"+l/2+"px","-moz-transform-origin":"50% 50% -"+l/2+"px","-ms-transform-origin":"50% 50% -"+l/2+"px","transform-origin":"50% 50% -"+l/2+"px"}),d.shadow)if(h)e.transform("translate3d(0px, "+(a/2+d.shadowOffset)+"px, "+-a/2+"px) rotateX(90deg) rotateZ(0deg) scale("+d.shadowScale+")");else{var M=Math.abs(u)-90*Math.floor(Math.abs(u)/90),z=1.5-(Math.sin(2*M*Math.PI/360)/2+Math.cos(2*M*Math.PI/360)/2),P=d.shadowScale,k=d.shadowScale/z,$=d.shadowOffset;e.transform("scale3d("+P+", 1, "+k+") translate3d(0px, "+(r/2+$)+"px, "+-r/2/k+"px) rotateX(-90deg)")}var L=o.isSafari||o.isWebView?-l/2:0;i.transform("translate3d(0px,0,"+L+"px) rotateX("+(this.isHorizontal()?0:u)+"deg) rotateY("+(this.isHorizontal()?-u:0)+"deg)")},setTransition:function(e){var t=this.$el;this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),this.params.cubeEffect.shadow&&!this.isHorizontal()&&t.find(".swiper-cube-shadow").transition(e)}},de={setTranslate:function(){for(var e=this.slides,t=this.rtlTranslate,i=0;i<e.length;i+=1){var s=e.eq(i),a=s[0].progress;this.params.flipEffect.limitRotation&&(a=Math.max(Math.min(s[0].progress,1),-1));var r=-180*a,n=0,l=-s[0].swiperSlideOffset,o=0;if(this.isHorizontal()?t&&(r=-r):(o=l,l=0,n=-r,r=0),s[0].style.zIndex=-Math.abs(Math.round(a))+e.length,this.params.flipEffect.slideShadows){var d=this.isHorizontal()?s.find(".swiper-slide-shadow-left"):s.find(".swiper-slide-shadow-top"),h=this.isHorizontal()?s.find(".swiper-slide-shadow-right"):s.find(".swiper-slide-shadow-bottom");0===d.length&&(d=m('<div class="swiper-slide-shadow-'+(this.isHorizontal()?"left":"top")+'"></div>'),s.append(d)),0===h.length&&(h=m('<div class="swiper-slide-shadow-'+(this.isHorizontal()?"right":"bottom")+'"></div>'),s.append(h)),d.length&&(d[0].style.opacity=Math.max(-a,0)),h.length&&(h[0].style.opacity=Math.max(a,0))}s.transform("translate3d("+l+"px, "+o+"px, 0px) rotateX("+n+"deg) rotateY("+r+"deg)")}},setTransition:function(e){var t=this,i=t.slides,s=t.activeIndex,a=t.$wrapperEl;if(i.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),t.params.virtualTranslate&&0!==e){var r=!1;i.eq(s).transitionEnd((function(){if(!r&&t&&!t.destroyed){r=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],i=0;i<e.length;i+=1)a.trigger(e[i])}}))}}},he={setTranslate:function(){for(var e=this.width,t=this.height,i=this.slides,s=this.slidesSizesGrid,a=this.params.coverflowEffect,r=this.isHorizontal(),n=this.translate,l=r?e/2-n:t/2-n,o=r?a.rotate:-a.rotate,d=a.depth,h=0,p=i.length;h<p;h+=1){var u=i.eq(h),c=s[h],v=(l-u[0].swiperSlideOffset-c/2)/c*a.modifier,f=r?o*v:0,g=r?0:o*v,w=-d*Math.abs(v),b=a.stretch;"string"==typeof b&&-1!==b.indexOf("%")&&(b=parseFloat(a.stretch)/100*c);var y=r?0:b*v,E=r?b*v:0,x=1-(1-a.scale)*Math.abs(v);Math.abs(E)<.001&&(E=0),Math.abs(y)<.001&&(y=0),Math.abs(w)<.001&&(w=0),Math.abs(f)<.001&&(f=0),Math.abs(g)<.001&&(g=0),Math.abs(x)<.001&&(x=0);var T="translate3d("+E+"px,"+y+"px,"+w+"px)  rotateX("+g+"deg) rotateY("+f+"deg) scale("+x+")";if(u.transform(T),u[0].style.zIndex=1-Math.abs(Math.round(v)),a.slideShadows){var C=r?u.find(".swiper-slide-shadow-left"):u.find(".swiper-slide-shadow-top"),S=r?u.find(".swiper-slide-shadow-right"):u.find(".swiper-slide-shadow-bottom");0===C.length&&(C=m('<div class="swiper-slide-shadow-'+(r?"left":"top")+'"></div>'),u.append(C)),0===S.length&&(S=m('<div class="swiper-slide-shadow-'+(r?"right":"bottom")+'"></div>'),u.append(S)),C.length&&(C[0].style.opacity=v>0?v:0),S.length&&(S[0].style.opacity=-v>0?-v:0)}}},setTransition:function(e){this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}},pe={init:function(){var e=this.params.thumbs;if(this.thumbs.initialized)return!1;this.thumbs.initialized=!0;var t=this.constructor;return e.swiper instanceof t?(this.thumbs.swiper=e.swiper,S(this.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),S(this.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1})):C(e.swiper)&&(this.thumbs.swiper=new t(S({},e.swiper,{watchSlidesVisibility:!0,watchSlidesProgress:!0,slideToClickedSlide:!1})),this.thumbs.swiperCreated=!0),this.thumbs.swiper.$el.addClass(this.params.thumbs.thumbsContainerClass),this.thumbs.swiper.on("tap",this.thumbs.onThumbClick),!0},onThumbClick:function(){var e=this.thumbs.swiper;if(e){var t=e.clickedIndex,i=e.clickedSlide;if(!(i&&m(i).hasClass(this.params.thumbs.slideThumbActiveClass)||null==t)){var s;if(s=e.params.loop?parseInt(m(e.clickedSlide).attr("data-swiper-slide-index"),10):t,this.params.loop){var a=this.activeIndex;this.slides.eq(a).hasClass(this.params.slideDuplicateClass)&&(this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft,a=this.activeIndex);var r=this.slides.eq(a).prevAll('[data-swiper-slide-index="'+s+'"]').eq(0).index(),n=this.slides.eq(a).nextAll('[data-swiper-slide-index="'+s+'"]').eq(0).index();s=void 0===r?n:void 0===n?r:n-a<a-r?n:r}this.slideTo(s)}}},update:function(e){var t=this.thumbs.swiper;if(t){var i="auto"===t.params.slidesPerView?t.slidesPerViewDynamic():t.params.slidesPerView,s=this.params.thumbs.autoScrollOffset,a=s&&!t.params.loop;if(this.realIndex!==t.realIndex||a){var r,n,l=t.activeIndex;if(t.params.loop){t.slides.eq(l).hasClass(t.params.slideDuplicateClass)&&(t.loopFix(),t._clientLeft=t.$wrapperEl[0].clientLeft,l=t.activeIndex);var o=t.slides.eq(l).prevAll('[data-swiper-slide-index="'+this.realIndex+'"]').eq(0).index(),d=t.slides.eq(l).nextAll('[data-swiper-slide-index="'+this.realIndex+'"]').eq(0).index();r=void 0===o?d:void 0===d?o:d-l==l-o?l:d-l<l-o?d:o,n=this.activeIndex>this.previousIndex?"next":"prev"}else n=(r=this.realIndex)>this.previousIndex?"next":"prev";a&&(r+="next"===n?s:-1*s),t.visibleSlidesIndexes&&t.visibleSlidesIndexes.indexOf(r)<0&&(t.params.centeredSlides?r=r>l?r-Math.floor(i/2)+1:r+Math.floor(i/2)-1:r>l&&(r=r-i+1),t.slideTo(r,e?0:void 0))}var h=1,p=this.params.thumbs.slideThumbActiveClass;if(this.params.slidesPerView>1&&!this.params.centeredSlides&&(h=this.params.slidesPerView),this.params.thumbs.multipleActiveThumbs||(h=1),h=Math.floor(h),t.slides.removeClass(p),t.params.loop||t.params.virtual&&t.params.virtual.enabled)for(var u=0;u<h;u+=1)t.$wrapperEl.children('[data-swiper-slide-index="'+(this.realIndex+u)+'"]').addClass(p);else for(var c=0;c<h;c+=1)t.slides.eq(this.realIndex+c).addClass(p)}}},ue=[V,W,q,_,{name:"mousewheel",params:{mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container"}},create:function(){M(this,{mousewheel:{enabled:!1,lastScrollTime:x(),lastEventBeforeSnap:void 0,recentWheelEvents:[],enable:U.enable,disable:U.disable,handle:U.handle,handleMouseEnter:U.handleMouseEnter,handleMouseLeave:U.handleMouseLeave,animateSlider:U.animateSlider,releaseScroll:U.releaseScroll}})},on:{init:function(e){!e.params.mousewheel.enabled&&e.params.cssMode&&e.mousewheel.disable(),e.params.mousewheel.enabled&&e.mousewheel.enable()},destroy:function(e){e.params.cssMode&&e.mousewheel.enable(),e.mousewheel.enabled&&e.mousewheel.disable()}}},{name:"navigation",params:{navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock"}},create:function(){M(this,{navigation:t({},K)})},on:{init:function(e){e.navigation.init(),e.navigation.update()},toEdge:function(e){e.navigation.update()},fromEdge:function(e){e.navigation.update()},destroy:function(e){e.navigation.destroy()},click:function(e,t){var i,s=e.navigation,a=s.$nextEl,r=s.$prevEl;!e.params.navigation.hideOnClick||m(t.target).is(r)||m(t.target).is(a)||(a?i=a.hasClass(e.params.navigation.hiddenClass):r&&(i=r.hasClass(e.params.navigation.hiddenClass)),!0===i?e.emit("navigationShow"):e.emit("navigationHide"),a&&a.toggleClass(e.params.navigation.hiddenClass),r&&r.toggleClass(e.params.navigation.hiddenClass))}}},{name:"pagination",params:{pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:function(e){return e},formatFractionTotal:function(e){return e},bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",modifierClass:"swiper-pagination-",currentClass:"swiper-pagination-current",totalClass:"swiper-pagination-total",hiddenClass:"swiper-pagination-hidden",progressbarFillClass:"swiper-pagination-progressbar-fill",progressbarOppositeClass:"swiper-pagination-progressbar-opposite",clickableClass:"swiper-pagination-clickable",lockClass:"swiper-pagination-lock"}},create:function(){M(this,{pagination:t({dynamicBulletIndex:0},Z)})},on:{init:function(e){e.pagination.init(),e.pagination.render(),e.pagination.update()},activeIndexChange:function(e){(e.params.loop||void 0===e.snapIndex)&&e.pagination.update()},snapIndexChange:function(e){e.params.loop||e.pagination.update()},slidesLengthChange:function(e){e.params.loop&&(e.pagination.render(),e.pagination.update())},snapGridLengthChange:function(e){e.params.loop||(e.pagination.render(),e.pagination.update())},destroy:function(e){e.pagination.destroy()},click:function(e,t){e.params.pagination.el&&e.params.pagination.hideOnClick&&e.pagination.$el.length>0&&!m(t.target).hasClass(e.params.pagination.bulletClass)&&(!0===e.pagination.$el.hasClass(e.params.pagination.hiddenClass)?e.emit("paginationShow"):e.emit("paginationHide"),e.pagination.$el.toggleClass(e.params.pagination.hiddenClass))}}},{name:"scrollbar",params:{scrollbar:{el:null,dragSize:"auto",hide:!1,draggable:!1,snapOnRelease:!0,lockClass:"swiper-scrollbar-lock",dragClass:"swiper-scrollbar-drag"}},create:function(){M(this,{scrollbar:t({isTouched:!1,timeout:null,dragTimeout:null},J)})},on:{init:function(e){e.scrollbar.init(),e.scrollbar.updateSize(),e.scrollbar.setTranslate()},update:function(e){e.scrollbar.updateSize()},resize:function(e){e.scrollbar.updateSize()},observerUpdate:function(e){e.scrollbar.updateSize()},setTranslate:function(e){e.scrollbar.setTranslate()},setTransition:function(e,t){e.scrollbar.setTransition(t)},destroy:function(e){e.scrollbar.destroy()}}},{name:"parallax",params:{parallax:{enabled:!1}},create:function(){M(this,{parallax:t({},Q)})},on:{beforeInit:function(e){e.params.parallax.enabled&&(e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)},init:function(e){e.params.parallax.enabled&&e.parallax.setTranslate()},setTranslate:function(e){e.params.parallax.enabled&&e.parallax.setTranslate()},setTransition:function(e,t){e.params.parallax.enabled&&e.parallax.setTransition(t)}}},{name:"zoom",params:{zoom:{enabled:!1,maxRatio:3,minRatio:1,toggle:!0,containerClass:"swiper-zoom-container",zoomedSlideClass:"swiper-slide-zoomed"}},create:function(){var e=this;M(e,{zoom:t({enabled:!1,scale:1,currentScale:1,isScaling:!1,gesture:{$slideEl:void 0,slideWidth:void 0,slideHeight:void 0,$imageEl:void 0,$imageWrapEl:void 0,maxRatio:3},image:{isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},velocity:{x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0}},ee)});var i=1;Object.defineProperty(e.zoom,"scale",{get:function(){return i},set:function(t){if(i!==t){var s=e.zoom.gesture.$imageEl?e.zoom.gesture.$imageEl[0]:void 0,a=e.zoom.gesture.$slideEl?e.zoom.gesture.$slideEl[0]:void 0;e.emit("zoomChange",t,s,a)}i=t}})},on:{init:function(e){e.params.zoom.enabled&&e.zoom.enable()},destroy:function(e){e.zoom.disable()},touchStart:function(e,t){e.zoom.enabled&&e.zoom.onTouchStart(t)},touchEnd:function(e,t){e.zoom.enabled&&e.zoom.onTouchEnd(t)},doubleTap:function(e,t){e.params.zoom.enabled&&e.zoom.enabled&&e.params.zoom.toggle&&e.zoom.toggle(t)},transitionEnd:function(e){e.zoom.enabled&&e.params.zoom.enabled&&e.zoom.onTransitionEnd()},slideChange:function(e){e.zoom.enabled&&e.params.zoom.enabled&&e.params.cssMode&&e.zoom.onTransitionEnd()}}},{name:"lazy",params:{lazy:{enabled:!1,loadPrevNext:!1,loadPrevNextAmount:1,loadOnTransitionStart:!1,elementClass:"swiper-lazy",loadingClass:"swiper-lazy-loading",loadedClass:"swiper-lazy-loaded",preloaderClass:"swiper-lazy-preloader"}},create:function(){M(this,{lazy:t({initialImageLoaded:!1},te)})},on:{beforeInit:function(e){e.params.lazy.enabled&&e.params.preloadImages&&(e.params.preloadImages=!1)},init:function(e){e.params.lazy.enabled&&!e.params.loop&&0===e.params.initialSlide&&e.lazy.load()},scroll:function(e){e.params.freeMode&&!e.params.freeModeSticky&&e.lazy.load()},resize:function(e){e.params.lazy.enabled&&e.lazy.load()},scrollbarDragMove:function(e){e.params.lazy.enabled&&e.lazy.load()},transitionStart:function(e){e.params.lazy.enabled&&(e.params.lazy.loadOnTransitionStart||!e.params.lazy.loadOnTransitionStart&&!e.lazy.initialImageLoaded)&&e.lazy.load()},transitionEnd:function(e){e.params.lazy.enabled&&!e.params.lazy.loadOnTransitionStart&&e.lazy.load()},slideChange:function(e){e.params.lazy.enabled&&e.params.cssMode&&e.lazy.load()}}},{name:"controller",params:{controller:{control:void 0,inverse:!1,by:"slide"}},create:function(){M(this,{controller:t({control:this.params.controller.control},ie)})},on:{update:function(e){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)},resize:function(e){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)},observerUpdate:function(e){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)},setTranslate:function(e,t,i){e.controller.control&&e.controller.setTranslate(t,i)},setTransition:function(e,t,i){e.controller.control&&e.controller.setTransition(t,i)}}},{name:"a11y",params:{a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}"}},create:function(){M(this,{a11y:t(t({},se),{},{liveRegion:m('<span class="'+this.params.a11y.notificationClass+'" aria-live="assertive" aria-atomic="true"></span>')})})},on:{init:function(e){e.params.a11y.enabled&&(e.a11y.init(),e.a11y.updateNavigation())},toEdge:function(e){e.params.a11y.enabled&&e.a11y.updateNavigation()},fromEdge:function(e){e.params.a11y.enabled&&e.a11y.updateNavigation()},paginationUpdate:function(e){e.params.a11y.enabled&&e.a11y.updatePagination()},destroy:function(e){e.params.a11y.enabled&&e.a11y.destroy()}}},{name:"history",params:{history:{enabled:!1,replaceState:!1,key:"slides"}},create:function(){M(this,{history:t({},ae)})},on:{init:function(e){e.params.history.enabled&&e.history.init()},destroy:function(e){e.params.history.enabled&&e.history.destroy()},transitionEnd:function(e){e.history.initialized&&e.history.setHistory(e.params.history.key,e.activeIndex)},slideChange:function(e){e.history.initialized&&e.params.cssMode&&e.history.setHistory(e.params.history.key,e.activeIndex)}}},{name:"hash-navigation",params:{hashNavigation:{enabled:!1,replaceState:!1,watchState:!1}},create:function(){M(this,{hashNavigation:t({initialized:!1},re)})},on:{init:function(e){e.params.hashNavigation.enabled&&e.hashNavigation.init()},destroy:function(e){e.params.hashNavigation.enabled&&e.hashNavigation.destroy()},transitionEnd:function(e){e.hashNavigation.initialized&&e.hashNavigation.setHash()},slideChange:function(e){e.hashNavigation.initialized&&e.params.cssMode&&e.hashNavigation.setHash()}}},{name:"autoplay",params:{autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!0,stopOnLastSlide:!1,reverseDirection:!1}},create:function(){M(this,{autoplay:t(t({},ne),{},{running:!1,paused:!1})})},on:{init:function(e){e.params.autoplay.enabled&&(e.autoplay.start(),r().addEventListener("visibilitychange",e.autoplay.onVisibilityChange))},beforeTransitionStart:function(e,t,i){e.autoplay.running&&(i||!e.params.autoplay.disableOnInteraction?e.autoplay.pause(t):e.autoplay.stop())},sliderFirstMove:function(e){e.autoplay.running&&(e.params.autoplay.disableOnInteraction?e.autoplay.stop():e.autoplay.pause())},touchEnd:function(e){e.params.cssMode&&e.autoplay.paused&&!e.params.autoplay.disableOnInteraction&&e.autoplay.run()},destroy:function(e){e.autoplay.running&&e.autoplay.stop(),r().removeEventListener("visibilitychange",e.autoplay.onVisibilityChange)}}},{name:"effect-fade",params:{fadeEffect:{crossFade:!1}},create:function(){M(this,{fadeEffect:t({},le)})},on:{beforeInit:function(e){if("fade"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"fade");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};S(e.params,t),S(e.originalParams,t)}},setTranslate:function(e){"fade"===e.params.effect&&e.fadeEffect.setTranslate()},setTransition:function(e,t){"fade"===e.params.effect&&e.fadeEffect.setTransition(t)}}},{name:"effect-cube",params:{cubeEffect:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94}},create:function(){M(this,{cubeEffect:t({},oe)})},on:{beforeInit:function(e){if("cube"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"cube"),e.classNames.push(e.params.containerModifierClass+"3d");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,resistanceRatio:0,spaceBetween:0,centeredSlides:!1,virtualTranslate:!0};S(e.params,t),S(e.originalParams,t)}},setTranslate:function(e){"cube"===e.params.effect&&e.cubeEffect.setTranslate()},setTransition:function(e,t){"cube"===e.params.effect&&e.cubeEffect.setTransition(t)}}},{name:"effect-flip",params:{flipEffect:{slideShadows:!0,limitRotation:!0}},create:function(){M(this,{flipEffect:t({},de)})},on:{beforeInit:function(e){if("flip"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"flip"),e.classNames.push(e.params.containerModifierClass+"3d");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};S(e.params,t),S(e.originalParams,t)}},setTranslate:function(e){"flip"===e.params.effect&&e.flipEffect.setTranslate()},setTransition:function(e,t){"flip"===e.params.effect&&e.flipEffect.setTransition(t)}}},{name:"effect-coverflow",params:{coverflowEffect:{rotate:50,stretch:0,depth:100,scale:1,modifier:1,slideShadows:!0}},create:function(){M(this,{coverflowEffect:t({},he)})},on:{beforeInit:function(e){"coverflow"===e.params.effect&&(e.classNames.push(e.params.containerModifierClass+"coverflow"),e.classNames.push(e.params.containerModifierClass+"3d"),e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)},setTranslate:function(e){"coverflow"===e.params.effect&&e.coverflowEffect.setTranslate()},setTransition:function(e,t){"coverflow"===e.params.effect&&e.coverflowEffect.setTransition(t)}}},{name:"thumbs",params:{thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-container-thumbs"}},create:function(){M(this,{thumbs:t({swiper:null,initialized:!1},pe)})},on:{beforeInit:function(e){var t=e.params.thumbs;t&&t.swiper&&(e.thumbs.init(),e.thumbs.update(!0))},slideChange:function(e){e.thumbs.swiper&&e.thumbs.update()},update:function(e){e.thumbs.swiper&&e.thumbs.update()},resize:function(e){e.thumbs.swiper&&e.thumbs.update()},observerUpdate:function(e){e.thumbs.swiper&&e.thumbs.update()},setTransition:function(e,t){var i=e.thumbs.swiper;i&&i.setTransition(t)},beforeDestroy:function(e){var t=e.thumbs.swiper;t&&e.thumbs.swiperCreated&&t&&t.destroy()}}}];return Y.use(ue),Y}));
//# sourceMappingURL=swiper-bundle.min.js.map

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
// (function() {
//  function a(j) {
//   j.fn._fadeIn = j.fn.fadeIn;
//   var d = j.noop || function() {};
//   var n = /MSIE/.test(navigator.userAgent);
//   var f = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
//   var k = document.documentMode || 0;
//   var g = j.isFunction(document.createElement("div").style.setExpression);
//   j.blockUI = function(r) {
//    e(window, r)
//   };
//   j.unblockUI = function(r) {
//    i(window, r)
//   };
//   j.growlUI = function(x, u, v, s) {
//    var t = j('<div class="growlUI"></div>');
//    if (x) {
//     t.append("<h1>" + x + "</h1>")
//    }
//    if (u) {
//     t.append("<h2>" + u + "</h2>")
//    }
//    if (v === undefined) {
//     v = 3000
//    }
//    var r = function(y) {
//     y = y || {};
//     j.blockUI({
//      message: t,
//      fadeIn: typeof y.fadeIn !== "undefined" ? y.fadeIn : 700,
//      fadeOut: typeof y.fadeOut !== "undefined" ? y.fadeOut : 1000,
//      timeout: typeof y.timeout !== "undefined" ? y.timeout : v,
//      centerY: false,
//      showOverlay: false,
//      onUnblock: s,
//      css: j.blockUI.defaults.growlCSS
//     })
//    };
//    r();
//    var w = t.css("opacity");
//    t.mouseover(function() {
//     r({
//      fadeIn: 0,
//      timeout: 30000
//     });
//     var y = j(".blockMsg");
//     y.stop();
//     y.fadeTo(300, 1)
//    }).mouseout(function() {
//     j(".blockMsg").fadeOut(1000)
//    })
//   };
//   j.fn.block = function(s) {
//    if (this[0] === window) {
//     j.blockUI(s);
//     return this
//    }
//    var r = j.extend({}, j.blockUI.defaults, s || {});
//    this.each(function() {
//     var t = j(this);
//     if (r.ignoreIfBlocked && t.data("blockUI.isBlocked")) {
//      return
//     }
//     t.unblock({
//      fadeOut: 0
//     })
//    });
//    return this.each(function() {
//     if (j.css(this, "position") == "static") {
//      this.style.position = "relative";
//      j(this).data("blockUI.static", true)
//     }
//     this.style.zoom = 1;
//     e(this, s)
//    })
//   };
//   j.fn.unblock = function(r) {
//    if (this[0] === window) {
//     j.unblockUI(r);
//     return this
//    }
//    return this.each(function() {
//     i(this, r)
//    })
//   };
//   j.blockUI.version = 2.66;
//   j.blockUI.defaults = {
//    message: "",
//    title: null,
//    draggable: true,
//    theme: false,
//    css: {
//     padding: 0,
//     margin: 0,
//     width: "30%",
//     top: "40%",
//     left: "35%",
//     textAlign: "center",
//     color: "#000",
//     border: "3px solid #aaa",
//     backgroundColor: "#fff",
//     cursor: "wait"
//    },
//    themedCSS: {
//     width: "30%",
//     top: "40%",
//     left: "35%"
//    },
//    overlayCSS: {
//     backgroundColor: "#000",
//     opacity: 0.6,
//     cursor: "default"
//    },
//    cursorReset: "default",
//    growlCSS: {
//     width: "350px",
//     top: "10px",
//     left: "",
//     right: "10px",
//     border: "none",
//     padding: "5px",
//     opacity: 0.6,
//     cursor: "default",
//     color: "#fff",
//     backgroundColor: "#000",
//     "-webkit-border-radius": "10px",
//     "-moz-border-radius": "10px",
//     "border-radius": "10px"
//    },
//    iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
//    forceIframe: false,
//    baseZ: 900,
//    centerX: true,
//    centerY: true,
//    allowBodyStretch: true,
//    bindEvents: false,
//    constrainTabKey: true,
//    fadeIn: 200,
//    fadeOut: 400,
//    timeout: 0,
//    showOverlay: true,
//    focusInput: true,
//    focusableElements: ":input:enabled:visible",
//    onBlock: null,
//    onUnblock: null,
//    onOverlayClick: null,
//    quirksmodeOffsetHack: 4,
//    blockMsgClass: "blockMsg",
//    ignoreIfBlocked: false
//   };
//   var c = null;
//   var h = [];

//   function e(v, H) {
//    var E, P;
//    var C = (v == window);
//    var y = (H && H.message !== undefined ? H.message : undefined);
//    H = j.extend({}, j.blockUI.defaults, H || {});
//    if (H.ignoreIfBlocked && j(v).data("blockUI.isBlocked")) {
//     return
//    }
//    H.overlayCSS = j.extend({}, j.blockUI.defaults.overlayCSS, H.overlayCSS || {});
//    E = j.extend({}, j.blockUI.defaults.css, H.css || {});
//    if (H.onOverlayClick) {
//     H.overlayCSS.cursor = "pointer"
//    }
//    P = j.extend({}, j.blockUI.defaults.themedCSS, H.themedCSS || {});
//    y = y === undefined ? H.message : y;
//    if (C && c) {
//     i(window, {
//      fadeOut: 0
//     })
//    }
//    if (y && typeof y != "string" && (y.parentNode || y.jquery)) {
//     var K = y.jquery ? y[0] : y;
//     var R = {};
//     j(v).data("blockUI.history", R);
//     R.el = K;
//     R.parent = K.parentNode;
//     R.display = K.style.display;
//     R.position = K.style.position;
//     if (R.parent) {
//      R.parent.removeChild(K)
//     }
//    }
//    j(v).data("blockUI.onUnblock", H.onUnblock);
//    var D = H.baseZ;
//    var O, N, M, I;
//    if (n || H.forceIframe) {
//     O = j('<iframe class="blockUI" style="z-index:' + (D++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + H.iframeSrc + '"></iframe>')
//    } else {
//     O = j('<div class="blockUI" style="display:none"></div>')
//    }
//    if (H.theme) {
//     N = j('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (D++) + ';display:none"></div>')
//    } else {
//     N = j('<div class="blockUI blockOverlay" style="z-index:' + (D++) + ';display:block;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>')
//    }
//    if (H.theme && C) {
//     I = '<div class="blockUI ' + H.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (D + 10) + ';display:none;position:fixed">';
//     if (H.title) {
//      I += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (H.title || "&nbsp;") + "</div>"
//     }
//     I += '<div class="ui-widget-content ui-dialog-content"></div>';
//     I += "</div>"
//    } else {
//     if (H.theme) {
//      I = '<div class="blockUI ' + H.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (D + 10) + ';display:none;position:absolute">';
//      if (H.title) {
//       I += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (H.title || "&nbsp;") + "</div>"
//      }
//      I += '<div class="ui-widget-content ui-dialog-content"></div>';
//      I += "</div>"
//     } else {
//      if (C) {
//       I = '<div class="blockUI ' + H.blockMsgClass + ' blockPage" style="z-index:' + (D + 10) + ';display:none;position:fixed"></div>'
//      } else {
//       I = '<div class="blockUI ' + H.blockMsgClass + ' blockElement" style="z-index:' + (D + 10) + ';display:none;position:absolute"></div>'
//      }
//     }
//    }
//    M = j(I);
//    if (y) {
//     if (H.theme) {
//      M.css(P);
//      M.addClass("ui-widget-content")
//     } else {
//      M.css(E)
//     }
//    }
//    if (!H.theme) {
//     N.css(H.overlayCSS)
//    }
//    N.css("position", C ? "fixed" : "absolute");
//    if (n || H.forceIframe) {
//     O.css("opacity", 0)
//    }
//    var B = [O, N, M],
//     Q = C ? j("body") : j(v);
//    j.each(B, function() {
//     this.appendTo(Q)
//    });
//    if (H.theme && H.draggable && j.fn.draggable) {
//     M.draggable({
//      handle: ".ui-dialog-titlebar",
//      cancel: "li"
//     })
//    }
//    var x = g && (!j.support.boxModel || j("object,embed", C ? null : v).length > 0);
//    if (f || x) {
//     if (C && H.allowBodyStretch && j.support.boxModel) {
//      j("html,body").css("height", "100%")
//     }
//     if ((f || !j.support.boxModel) && !C) {
//      var G = o(v, "borderTopWidth"),
//       L = o(v, "borderLeftWidth");
//      var A = G ? "(0 - " + G + ")" : 0;
//      var F = L ? "(0 - " + L + ")" : 0
//     }
//     j.each(B, function(t, U) {
//      var z = U[0].style;
//      z.position = "absolute";
//      if (t < 2) {
//       if (C) {
//        z.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:" + H.quirksmodeOffsetHack + ') + "px"')
//       } else {
//        z.setExpression("height", 'this.parentNode.offsetHeight + "px"')
//       }
//       if (C) {
//        z.setExpression("width", 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
//       } else {
//        z.setExpression("width", 'this.parentNode.offsetWidth + "px"')
//       }
//       if (F) {
//        z.setExpression("left", F)
//       }
//       if (A) {
//        z.setExpression("top", A)
//       }
//      } else {
//       if (H.centerY) {
//        if (C) {
//         z.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"')
//        }
//        z.marginTop = 0
//       } else {
//        if (!H.centerY && C) {
//         var S = (H.css && H.css.top) ? parseInt(H.css.top, 10) : 0;
//         var T = "((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " + S + ') + "px"';
//         z.setExpression("top", T)
//        }
//       }
//      }
//     })
//    }
//    if (y) {
//     if (H.theme) {
//      M.find(".ui-widget-content").append(y)
//     } else {
//      M.append(y)
//     }
//     if (y.jquery || y.nodeType) {
//      j(y).show()
//     }
//    }
//    if ((n || H.forceIframe) && H.showOverlay) {
//     O.show()
//    }
//    if (H.fadeIn) {
//     var J = H.onBlock ? H.onBlock : d;
//     var u = (H.showOverlay && !y) ? J : d;
//     var r = y ? J : d;
//     if (H.showOverlay) {
//      N._fadeIn(H.fadeIn, u)
//     }
//     if (y) {
//      M._fadeIn(H.fadeIn, r)
//     }
//    } else {
//     if (H.showOverlay) {
//      N.show()
//     }
//     if (y) {
//      M.show()
//     }
//     if (H.onBlock) {
//      H.onBlock()
//     }
//    }
//    m(1, v, H);
//    if (C) {
//     c = M[0];
//     h = j(H.focusableElements, c);
//     if (H.focusInput) {
//      setTimeout(q, 20)
//     }
//    } else {
//     b(M[0], H.centerX, H.centerY)
//    }
//    if (H.timeout) {
//     var w = setTimeout(function() {
//      if (C) {
//       j.unblockUI(H)
//      } else {
//       j(v).unblock(H)
//      }
//     }, H.timeout);
//     j(v).data("blockUI.timeout", w)
//    }
//   }

//   function i(u, w) {
//    var v;
//    var t = (u == window);
//    var s = j(u);
//    var x = s.data("blockUI.history");
//    var y = s.data("blockUI.timeout");
//    if (y) {
//     clearTimeout(y);
//     s.removeData("blockUI.timeout")
//    }
//    w = j.extend({}, j.blockUI.defaults, w || {});
//    m(0, u, w);
//    if (w.onUnblock === null) {
//     w.onUnblock = s.data("blockUI.onUnblock");
//     s.removeData("blockUI.onUnblock")
//    }
//    var r;
//    if (t) {
//     r = j("body").children().filter(".blockUI").add("body > .blockUI")
//    } else {
//     r = s.find(">.blockUI")
//    }
//    if (w.cursorReset) {
//     if (r.length > 1) {
//      r[1].style.cursor = w.cursorReset
//     }
//     if (r.length > 2) {
//      r[2].style.cursor = w.cursorReset
//     }
//    }
//    if (t) {
//     c = h = null
//    }
//    if (w.fadeOut) {
//     v = r.length;
//     r.stop().fadeOut(w.fadeOut, function() {
//      if (--v === 0) {
//       l(r, x, w, u)
//      }
//     })
//    } else {
//     l(r, x, w, u)
//    }
//   }

//   function l(v, z, y, x) {
//    var u = j(x);
//    if (u.data("blockUI.isBlocked")) {
//     return
//    }
//    v.each(function(w, A) {
//     if (this.parentNode) {
//      this.parentNode.removeChild(this)
//     }
//    });
//    if (z && z.el) {
//     z.el.style.display = z.display;
//     z.el.style.position = z.position;
//     if (z.parent) {
//      z.parent.appendChild(z.el)
//     }
//     u.removeData("blockUI.history")
//    }
//    if (u.data("blockUI.static")) {
//     u.css("position", "static")
//    }
//    if (typeof y.onUnblock == "function") {
//     y.onUnblock(x, y)
//    }
//    var r = j(document.body),
//     t = r.width(),
//     s = r[0].style.width;
//    r.width(t - 1).width(t);
//    r[0].style.width = s
//   }

//   function m(r, v, w) {
//    var u = v == window,
//     t = j(v);
//    if (!r && (u && !c || !u && !t.data("blockUI.isBlocked"))) {
//     return
//    }
//    t.data("blockUI.isBlocked", r);
//    if (!u || !w.bindEvents || (r && !w.showOverlay)) {
//     return
//    }
//    var s = "mousedown mouseup keydown keypress keyup touchstart touchend touchmove";
//    if (r) {
//     j(document).bind(s, w, p)
//    } else {
//     j(document).unbind(s, p)
//    }
//   }

//   function p(w) {
//    if (w.type === "keydown" && w.keyCode && w.keyCode == 9) {
//     if (c && w.data.constrainTabKey) {
//      var t = h;
//      var s = !w.shiftKey && w.target === t[t.length - 1];
//      var r = w.shiftKey && w.target === t[0];
//      if (s || r) {
//       setTimeout(function() {
//        q(r)
//       }, 10);
//       return false
//      }
//     }
//    }
//    var u = w.data;
//    var v = j(w.target);
//    if (v.hasClass("blockOverlay") && u.onOverlayClick) {
//     u.onOverlayClick(w)
//    }
//    if (v.parents("div." + u.blockMsgClass).length > 0) {
//     return true
//    }
//    return v.parents().children().filter("div.blockUI").length === 0
//   }

//   function q(r) {
//    if (!h) {
//     return
//    }
//    var s = h[r === true ? h.length - 1 : 0];
//    if (s) {
//     s.focus()
//    }
//   }

//   function b(z, r, B) {
//    var A = z.parentNode,
//     w = z.style;
//    var u = ((A.offsetWidth - z.offsetWidth) / 2) - o(A, "borderLeftWidth");
//    var v = ((A.offsetHeight - z.offsetHeight) / 2) - o(A, "borderTopWidth");
//    if (r) {
//     w.left = u > 0 ? (u + "px") : "0"
//    }
//    if (B) {
//     w.top = v > 0 ? (v + "px") : "0"
//    }
//   }

//   function o(r, s) {
//    return parseInt(j.css(r, s), 10) || 0
//   }
//  }
//  if (typeof define === "function" && define.amd && define.amd.jQuery) {
//   define(["jquery"], a)
//  } else {
//   a(jQuery)
//  }
// })();

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