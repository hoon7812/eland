
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

  /**
 * Swiper 3.4.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2017, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: March 10, 2017
 */
!function(){"use strict";var e,a=function(s,i){function r(e){return Math.floor(e)}function n(){var e=T.params.autoplay,a=T.slides.eq(T.activeIndex);a.attr("data-swiper-autoplay")&&(e=a.attr("data-swiper-autoplay")||T.params.autoplay),T.autoplayTimeoutId=setTimeout(function(){T.params.loop?(T.fixLoop(),T._slideNext(),T.emit("onAutoplay",T)):T.isEnd?i.autoplayStopOnLast?T.stopAutoplay():(T._slideTo(0),T.emit("onAutoplay",T)):(T._slideNext(),T.emit("onAutoplay",T))},e)}function o(a,t){var s=e(a.target);if(!s.is(t))if("string"==typeof t)s=s.parents(t);else if(t.nodeType){var i;return s.parents().each(function(e,a){a===t&&(i=t)}),i?t:void 0}if(0!==s.length)return s[0]}function l(e,a){a=a||{};var t=window.MutationObserver||window.WebkitMutationObserver,s=new t(function(e){e.forEach(function(e){T.onResize(!0),T.emit("onObserverUpdate",T,e)})});s.observe(e,{attributes:void 0===a.attributes||a.attributes,childList:void 0===a.childList||a.childList,characterData:void 0===a.characterData||a.characterData}),T.observers.push(s)}function p(e){e.originalEvent&&(e=e.originalEvent);var a=e.keyCode||e.charCode;if(!T.params.allowSwipeToNext&&(T.isHorizontal()&&39===a||!T.isHorizontal()&&40===a))return!1;if(!T.params.allowSwipeToPrev&&(T.isHorizontal()&&37===a||!T.isHorizontal()&&38===a))return!1;if(!(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||document.activeElement&&document.activeElement.nodeName&&("input"===document.activeElement.nodeName.toLowerCase()||"textarea"===document.activeElement.nodeName.toLowerCase()))){if(37===a||39===a||38===a||40===a){var t=!1;if(T.container.parents("."+T.params.slideClass).length>0&&0===T.container.parents("."+T.params.slideActiveClass).length)return;var s={left:window.pageXOffset,top:window.pageYOffset},i=window.innerWidth,r=window.innerHeight,n=T.container.offset();T.rtl&&(n.left=n.left-T.container[0].scrollLeft);for(var o=[[n.left,n.top],[n.left+T.width,n.top],[n.left,n.top+T.height],[n.left+T.width,n.top+T.height]],l=0;l<o.length;l++){var p=o[l];p[0]>=s.left&&p[0]<=s.left+i&&p[1]>=s.top&&p[1]<=s.top+r&&(t=!0)}if(!t)return}T.isHorizontal()?(37!==a&&39!==a||(e.preventDefault?e.preventDefault():e.returnValue=!1),(39===a&&!T.rtl||37===a&&T.rtl)&&T.slideNext(),(37===a&&!T.rtl||39===a&&T.rtl)&&T.slidePrev()):(38!==a&&40!==a||(e.preventDefault?e.preventDefault():e.returnValue=!1),40===a&&T.slideNext(),38===a&&T.slidePrev()),T.emit("onKeyPress",T,a)}}function d(e){var a=0,t=0,s=0,i=0;return"detail"in e&&(t=e.detail),"wheelDelta"in e&&(t=-e.wheelDelta/120),"wheelDeltaY"in e&&(t=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(a=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(a=t,t=0),s=10*a,i=10*t,"deltaY"in e&&(i=e.deltaY),"deltaX"in e&&(s=e.deltaX),(s||i)&&e.deltaMode&&(1===e.deltaMode?(s*=40,i*=40):(s*=800,i*=800)),s&&!a&&(a=s<1?-1:1),i&&!t&&(t=i<1?-1:1),{spinX:a,spinY:t,pixelX:s,pixelY:i}}function u(e){e.originalEvent&&(e=e.originalEvent);var a=0,t=T.rtl?-1:1,s=d(e);if(T.params.mousewheelForceToAxis)if(T.isHorizontal()){if(!(Math.abs(s.pixelX)>Math.abs(s.pixelY)))return;a=s.pixelX*t}else{if(!(Math.abs(s.pixelY)>Math.abs(s.pixelX)))return;a=s.pixelY}else a=Math.abs(s.pixelX)>Math.abs(s.pixelY)?-s.pixelX*t:-s.pixelY;if(0!==a){if(T.params.mousewheelInvert&&(a=-a),T.params.freeMode){var i=T.getWrapperTranslate()+a*T.params.mousewheelSensitivity,r=T.isBeginning,n=T.isEnd;if(i>=T.minTranslate()&&(i=T.minTranslate()),i<=T.maxTranslate()&&(i=T.maxTranslate()),T.setWrapperTransition(0),T.setWrapperTranslate(i),T.updateProgress(),T.updateActiveIndex(),(!r&&T.isBeginning||!n&&T.isEnd)&&T.updateClasses(),T.params.freeModeSticky?(clearTimeout(T.mousewheel.timeout),T.mousewheel.timeout=setTimeout(function(){T.slideReset()},300)):T.params.lazyLoading&&T.lazy&&T.lazy.load(),T.emit("onScroll",T,e),T.params.autoplay&&T.params.autoplayDisableOnInteraction&&T.stopAutoplay(),0===i||i===T.maxTranslate())return}else{if((new window.Date).getTime()-T.mousewheel.lastScrollTime>60)if(a<0)if(T.isEnd&&!T.params.loop||T.animating){if(T.params.mousewheelReleaseOnEdges)return!0}else T.slideNext(),T.emit("onScroll",T,e);else if(T.isBeginning&&!T.params.loop||T.animating){if(T.params.mousewheelReleaseOnEdges)return!0}else T.slidePrev(),T.emit("onScroll",T,e);T.mousewheel.lastScrollTime=(new window.Date).getTime()}return e.preventDefault?e.preventDefault():e.returnValue=!1,!1}}function c(a,t){a=e(a);var s,i,r,n=T.rtl?-1:1;s=a.attr("data-swiper-parallax")||"0",i=a.attr("data-swiper-parallax-x"),r=a.attr("data-swiper-parallax-y"),i||r?(i=i||"0",r=r||"0"):T.isHorizontal()?(i=s,r="0"):(r=s,i="0"),i=i.indexOf("%")>=0?parseInt(i,10)*t*n+"%":i*t*n+"px",r=r.indexOf("%")>=0?parseInt(r,10)*t+"%":r*t+"px",a.transform("translate3d("+i+", "+r+",0px)")}function m(e){return 0!==e.indexOf("on")&&(e=e[0]!==e[0].toUpperCase()?"on"+e[0].toUpperCase()+e.substring(1):"on"+e),e}if(!(this instanceof a))return new a(s,i);var h={direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,autoplay:!1,autoplayDisableOnInteraction:!0,autoplayStopOnLast:!1,iOSEdgeSwipeDetection:!1,iOSEdgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeMomentumVelocityRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},flip:{slideShadows:!0,limitRotation:!0},cube:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94},fade:{crossFade:!1},parallax:!1,zoom:!1,zoomMax:3,zoomMin:1,zoomToggle:!0,scrollbar:null,scrollbarHide:!0,scrollbarDraggable:!1,scrollbarSnapOnRelease:!1,keyboardControl:!1,mousewheelControl:!1,mousewheelReleaseOnEdges:!1,mousewheelInvert:!1,mousewheelForceToAxis:!1,mousewheelSensitivity:1,mousewheelEventsTarged:"container",hashnav:!1,hashnavWatchState:!1,history:!1,replaceState:!1,breakpoints:void 0,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,onlyExternal:!1,threshold:0,touchMoveStopPropagation:!0,touchReleaseOnEdges:!1,uniqueNavElements:!0,pagination:null,paginationElement:"span",paginationClickable:!1,paginationHide:!1,paginationBulletRender:null,paginationProgressRender:null,paginationFractionRender:null,paginationCustomRender:null,paginationType:"bullets",resistance:!0,resistanceRatio:.85,nextButton:null,prevButton:null,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,lazyLoading:!1,lazyLoadingInPrevNext:!1,lazyLoadingInPrevNextAmount:1,lazyLoadingOnTransitionStart:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,control:void 0,controlInverse:!1,controlBy:"slide",normalizeSlideIndex:!0,allowSwipeToPrev:!0,allowSwipeToNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",passiveListeners:!0,containerModifierClass:"swiper-container-",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",buttonDisabledClass:"swiper-button-disabled",paginationCurrentClass:"swiper-pagination-current",paginationTotalClass:"swiper-pagination-total",paginationHiddenClass:"swiper-pagination-hidden",paginationProgressbarClass:"swiper-pagination-progressbar",paginationClickableClass:"swiper-pagination-clickable",paginationModifierClass:"swiper-pagination-",lazyLoadingClass:"swiper-lazy",lazyStatusLoadingClass:"swiper-lazy-loading",lazyStatusLoadedClass:"swiper-lazy-loaded",lazyPreloaderClass:"swiper-lazy-preloader",notificationClass:"swiper-notification",preloaderClass:"preloader",zoomContainerClass:"swiper-zoom-container",observer:!1,observeParents:!1,a11y:!1,prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",runCallbacksOnInit:!0},g=i&&i.virtualTranslate;i=i||{};var f={};for(var v in i)if("object"!=typeof i[v]||null===i[v]||(i[v].nodeType||i[v]===window||i[v]===document||void 0!==t&&i[v]instanceof t||"undefined"!=typeof jQuery&&i[v]instanceof jQuery))f[v]=i[v];else{f[v]={};for(var w in i[v])f[v][w]=i[v][w]}for(var y in h)if(void 0===i[y])i[y]=h[y];else if("object"==typeof i[y])for(var x in h[y])void 0===i[y][x]&&(i[y][x]=h[y][x]);var T=this;if(T.params=i,T.originalParams=f,T.classNames=[],void 0!==e&&void 0!==t&&(e=t),(void 0!==e||(e=void 0===t?window.Dom7||window.Zepto||window.jQuery:t))&&(T.$=e,T.currentBreakpoint=void 0,T.getActiveBreakpoint=function(){if(!T.params.breakpoints)return!1;var e,a=!1,t=[];for(e in T.params.breakpoints)T.params.breakpoints.hasOwnProperty(e)&&t.push(e);t.sort(function(e,a){return parseInt(e,10)>parseInt(a,10)});for(var s=0;s<t.length;s++)(e=t[s])>=window.innerWidth&&!a&&(a=e);return a||"max"},T.setBreakpoint=function(){var e=T.getActiveBreakpoint();if(e&&T.currentBreakpoint!==e){var a=e in T.params.breakpoints?T.params.breakpoints[e]:T.originalParams,t=T.params.loop&&a.slidesPerView!==T.params.slidesPerView;for(var s in a)T.params[s]=a[s];T.currentBreakpoint=e,t&&T.destroyLoop&&T.reLoop(!0)}},T.params.breakpoints&&T.setBreakpoint(),T.container=e(s),0!==T.container.length)){if(T.container.length>1){var b=[];return T.container.each(function(){b.push(new a(this,i))}),b}T.container[0].swiper=T,T.container.data("swiper",T),T.classNames.push(T.params.containerModifierClass+T.params.direction),T.params.freeMode&&T.classNames.push(T.params.containerModifierClass+"free-mode"),T.support.flexbox||(T.classNames.push(T.params.containerModifierClass+"no-flexbox"),T.params.slidesPerColumn=1),T.params.autoHeight&&T.classNames.push(T.params.containerModifierClass+"autoheight"),(T.params.parallax||T.params.watchSlidesVisibility)&&(T.params.watchSlidesProgress=!0),T.params.touchReleaseOnEdges&&(T.params.resistanceRatio=0),["cube","coverflow","flip"].indexOf(T.params.effect)>=0&&(T.support.transforms3d?(T.params.watchSlidesProgress=!0,T.classNames.push(T.params.containerModifierClass+"3d")):T.params.effect="slide"),"slide"!==T.params.effect&&T.classNames.push(T.params.containerModifierClass+T.params.effect),"cube"===T.params.effect&&(T.params.resistanceRatio=0,T.params.slidesPerView=1,T.params.slidesPerColumn=1,T.params.slidesPerGroup=1,T.params.centeredSlides=!1,T.params.spaceBetween=0,T.params.virtualTranslate=!0),"fade"!==T.params.effect&&"flip"!==T.params.effect||(T.params.slidesPerView=1,T.params.slidesPerColumn=1,T.params.slidesPerGroup=1,T.params.watchSlidesProgress=!0,T.params.spaceBetween=0,void 0===g&&(T.params.virtualTranslate=!0)),T.params.grabCursor&&T.support.touch&&(T.params.grabCursor=!1),T.wrapper=T.container.children("."+T.params.wrapperClass),T.params.pagination&&(T.paginationContainer=e(T.params.pagination),T.params.uniqueNavElements&&"string"==typeof T.params.pagination&&T.paginationContainer.length>1&&1===T.container.find(T.params.pagination).length&&(T.paginationContainer=T.container.find(T.params.pagination)),"bullets"===T.params.paginationType&&T.params.paginationClickable?T.paginationContainer.addClass(T.params.paginationModifierClass+"clickable"):T.params.paginationClickable=!1,T.paginationContainer.addClass(T.params.paginationModifierClass+T.params.paginationType)),(T.params.nextButton||T.params.prevButton)&&(T.params.nextButton&&(T.nextButton=e(T.params.nextButton),T.params.uniqueNavElements&&"string"==typeof T.params.nextButton&&T.nextButton.length>1&&1===T.container.find(T.params.nextButton).length&&(T.nextButton=T.container.find(T.params.nextButton))),T.params.prevButton&&(T.prevButton=e(T.params.prevButton),T.params.uniqueNavElements&&"string"==typeof T.params.prevButton&&T.prevButton.length>1&&1===T.container.find(T.params.prevButton).length&&(T.prevButton=T.container.find(T.params.prevButton)))),T.isHorizontal=function(){return"horizontal"===T.params.direction},T.rtl=T.isHorizontal()&&("rtl"===T.container[0].dir.toLowerCase()||"rtl"===T.container.css("direction")),T.rtl&&T.classNames.push(T.params.containerModifierClass+"rtl"),T.rtl&&(T.wrongRTL="-webkit-box"===T.wrapper.css("display")),T.params.slidesPerColumn>1&&T.classNames.push(T.params.containerModifierClass+"multirow"),T.device.android&&T.classNames.push(T.params.containerModifierClass+"android"),T.container.addClass(T.classNames.join(" ")),T.translate=0,T.progress=0,T.velocity=0,T.lockSwipeToNext=function(){T.params.allowSwipeToNext=!1,T.params.allowSwipeToPrev===!1&&T.params.grabCursor&&T.unsetGrabCursor()},T.lockSwipeToPrev=function(){T.params.allowSwipeToPrev=!1,T.params.allowSwipeToNext===!1&&T.params.grabCursor&&T.unsetGrabCursor()},T.lockSwipes=function(){T.params.allowSwipeToNext=T.params.allowSwipeToPrev=!1,T.params.grabCursor&&T.unsetGrabCursor()},T.unlockSwipeToNext=function(){T.params.allowSwipeToNext=!0,T.params.allowSwipeToPrev===!0&&T.params.grabCursor&&T.setGrabCursor()},T.unlockSwipeToPrev=function(){T.params.allowSwipeToPrev=!0,T.params.allowSwipeToNext===!0&&T.params.grabCursor&&T.setGrabCursor()},T.unlockSwipes=function(){T.params.allowSwipeToNext=T.params.allowSwipeToPrev=!0,T.params.grabCursor&&T.setGrabCursor()},T.setGrabCursor=function(e){T.container[0].style.cursor="move",T.container[0].style.cursor=e?"-webkit-grabbing":"-webkit-grab",T.container[0].style.cursor=e?"-moz-grabbin":"-moz-grab",T.container[0].style.cursor=e?"grabbing":"grab"},T.unsetGrabCursor=function(){T.container[0].style.cursor=""},T.params.grabCursor&&T.setGrabCursor(),T.imagesToLoad=[],T.imagesLoaded=0,T.loadImage=function(e,a,t,s,i,r){function n(){r&&r()}var o;e.complete&&i?n():a?(o=new window.Image,o.onload=n,o.onerror=n,s&&(o.sizes=s),t&&(o.srcset=t),a&&(o.src=a)):n()},T.preloadImages=function(){function e(){void 0!==T&&null!==T&&T&&(void 0!==T.imagesLoaded&&T.imagesLoaded++,T.imagesLoaded===T.imagesToLoad.length&&(T.params.updateOnImagesReady&&T.update(),T.emit("onImagesReady",T)))}T.imagesToLoad=T.container.find("img");for(var a=0;a<T.imagesToLoad.length;a++)T.loadImage(T.imagesToLoad[a],T.imagesToLoad[a].currentSrc||T.imagesToLoad[a].getAttribute("src"),T.imagesToLoad[a].srcset||T.imagesToLoad[a].getAttribute("srcset"),T.imagesToLoad[a].sizes||T.imagesToLoad[a].getAttribute("sizes"),!0,e)},T.autoplayTimeoutId=void 0,T.autoplaying=!1,T.autoplayPaused=!1,T.startAutoplay=function(){return void 0===T.autoplayTimeoutId&&(!!T.params.autoplay&&(!T.autoplaying&&(T.autoplaying=!0,T.emit("onAutoplayStart",T),void n())))},T.stopAutoplay=function(e){T.autoplayTimeoutId&&(T.autoplayTimeoutId&&clearTimeout(T.autoplayTimeoutId),T.autoplaying=!1,T.autoplayTimeoutId=void 0,T.emit("onAutoplayStop",T))},T.pauseAutoplay=function(e){T.autoplayPaused||(T.autoplayTimeoutId&&clearTimeout(T.autoplayTimeoutId),T.autoplayPaused=!0,0===e?(T.autoplayPaused=!1,n()):T.wrapper.transitionEnd(function(){T&&(T.autoplayPaused=!1,T.autoplaying?n():T.stopAutoplay())}))},T.minTranslate=function(){return-T.snapGrid[0]},T.maxTranslate=function(){return-T.snapGrid[T.snapGrid.length-1]},T.updateAutoHeight=function(){var e,a=[],t=0;if("auto"!==T.params.slidesPerView&&T.params.slidesPerView>1)for(e=0;e<Math.ceil(T.params.slidesPerView);e++){var s=T.activeIndex+e;if(s>T.slides.length)break;a.push(T.slides.eq(s)[0])}else a.push(T.slides.eq(T.activeIndex)[0]);for(e=0;e<a.length;e++)if(void 0!==a[e]){var i=a[e].offsetHeight;t=i>t?i:t}t&&T.wrapper.css("height",t+"px")},T.updateContainerSize=function(){var e,a;e=void 0!==T.params.width?T.params.width:T.container[0].clientWidth,a=void 0!==T.params.height?T.params.height:T.container[0].clientHeight,0===e&&T.isHorizontal()||0===a&&!T.isHorizontal()||(e=e-parseInt(T.container.css("padding-left"),10)-parseInt(T.container.css("padding-right"),10),a=a-parseInt(T.container.css("padding-top"),10)-parseInt(T.container.css("padding-bottom"),10),T.width=e,T.height=a,T.size=T.isHorizontal()?T.width:T.height)},T.updateSlidesSize=function(){T.slides=T.wrapper.children("."+T.params.slideClass),T.snapGrid=[],T.slidesGrid=[],T.slidesSizesGrid=[];var e,a=T.params.spaceBetween,t=-T.params.slidesOffsetBefore,s=0,i=0;if(void 0!==T.size){"string"==typeof a&&a.indexOf("%")>=0&&(a=parseFloat(a.replace("%",""))/100*T.size),T.virtualSize=-a,T.rtl?T.slides.css({marginLeft:"",marginTop:""}):T.slides.css({marginRight:"",marginBottom:""});var n;T.params.slidesPerColumn>1&&(n=Math.floor(T.slides.length/T.params.slidesPerColumn)===T.slides.length/T.params.slidesPerColumn?T.slides.length:Math.ceil(T.slides.length/T.params.slidesPerColumn)*T.params.slidesPerColumn,"auto"!==T.params.slidesPerView&&"row"===T.params.slidesPerColumnFill&&(n=Math.max(n,T.params.slidesPerView*T.params.slidesPerColumn)));var o,l=T.params.slidesPerColumn,p=n/l,d=p-(T.params.slidesPerColumn*p-T.slides.length);for(e=0;e<T.slides.length;e++){o=0;var u=T.slides.eq(e);if(T.params.slidesPerColumn>1){var c,m,h;"column"===T.params.slidesPerColumnFill?(m=Math.floor(e/l),h=e-m*l,(m>d||m===d&&h===l-1)&&++h>=l&&(h=0,m++),c=m+h*n/l,u.css({"-webkit-box-ordinal-group":c,"-moz-box-ordinal-group":c,"-ms-flex-order":c,"-webkit-order":c,order:c})):(h=Math.floor(e/p),m=e-h*p),u.css("margin-"+(T.isHorizontal()?"top":"left"),0!==h&&T.params.spaceBetween&&T.params.spaceBetween+"px").attr("data-swiper-column",m).attr("data-swiper-row",h)}"none"!==u.css("display")&&("auto"===T.params.slidesPerView?(o=T.isHorizontal()?u.outerWidth(!0):u.outerHeight(!0),T.params.roundLengths&&(o=r(o))):(o=(T.size-(T.params.slidesPerView-1)*a)/T.params.slidesPerView,T.params.roundLengths&&(o=r(o)),T.isHorizontal()?T.slides[e].style.width=o+"px":T.slides[e].style.height=o+"px"),T.slides[e].swiperSlideSize=o,T.slidesSizesGrid.push(o),T.params.centeredSlides?(t=t+o/2+s/2+a,0===s&&0!==e&&(t=t-T.size/2-a),0===e&&(t=t-T.size/2-a),Math.abs(t)<.001&&(t=0),i%T.params.slidesPerGroup==0&&T.snapGrid.push(t),T.slidesGrid.push(t)):(i%T.params.slidesPerGroup==0&&T.snapGrid.push(t),T.slidesGrid.push(t),t=t+o+a),T.virtualSize+=o+a,s=o,i++)}T.virtualSize=Math.max(T.virtualSize,T.size)+T.params.slidesOffsetAfter;var g;if(T.rtl&&T.wrongRTL&&("slide"===T.params.effect||"coverflow"===T.params.effect)&&T.wrapper.css({width:T.virtualSize+T.params.spaceBetween+"px"}),T.support.flexbox&&!T.params.setWrapperSize||(T.isHorizontal()?T.wrapper.css({width:T.virtualSize+T.params.spaceBetween+"px"}):T.wrapper.css({height:T.virtualSize+T.params.spaceBetween+"px"})),T.params.slidesPerColumn>1&&(T.virtualSize=(o+T.params.spaceBetween)*n,T.virtualSize=Math.ceil(T.virtualSize/T.params.slidesPerColumn)-T.params.spaceBetween,T.isHorizontal()?T.wrapper.css({width:T.virtualSize+T.params.spaceBetween+"px"}):T.wrapper.css({height:T.virtualSize+T.params.spaceBetween+"px"}),T.params.centeredSlides)){for(g=[],e=0;e<T.snapGrid.length;e++)T.snapGrid[e]<T.virtualSize+T.snapGrid[0]&&g.push(T.snapGrid[e]);T.snapGrid=g}if(!T.params.centeredSlides){for(g=[],e=0;e<T.snapGrid.length;e++)T.snapGrid[e]<=T.virtualSize-T.size&&g.push(T.snapGrid[e]);T.snapGrid=g,Math.floor(T.virtualSize-T.size)-Math.floor(T.snapGrid[T.snapGrid.length-1])>1&&T.snapGrid.push(T.virtualSize-T.size)}0===T.snapGrid.length&&(T.snapGrid=[0]),0!==T.params.spaceBetween&&(T.isHorizontal()?T.rtl?T.slides.css({marginLeft:a+"px"}):T.slides.css({marginRight:a+"px"}):T.slides.css({marginBottom:a+"px"})),T.params.watchSlidesProgress&&T.updateSlidesOffset()}},T.updateSlidesOffset=function(){for(var e=0;e<T.slides.length;e++)T.slides[e].swiperSlideOffset=T.isHorizontal()?T.slides[e].offsetLeft:T.slides[e].offsetTop},T.currentSlidesPerView=function(){var e,a,t=1;if(T.params.centeredSlides){var s,i=T.slides[T.activeIndex].swiperSlideSize;for(e=T.activeIndex+1;e<T.slides.length;e++)T.slides[e]&&!s&&(i+=T.slides[e].swiperSlideSize,t++,i>T.size&&(s=!0));for(a=T.activeIndex-1;a>=0;a--)T.slides[a]&&!s&&(i+=T.slides[a].swiperSlideSize,t++,i>T.size&&(s=!0))}else for(e=T.activeIndex+1;e<T.slides.length;e++)T.slidesGrid[e]-T.slidesGrid[T.activeIndex]<T.size&&t++;return t},T.updateSlidesProgress=function(e){if(void 0===e&&(e=T.translate||0),0!==T.slides.length){void 0===T.slides[0].swiperSlideOffset&&T.updateSlidesOffset();var a=-e;T.rtl&&(a=e),T.slides.removeClass(T.params.slideVisibleClass);for(var t=0;t<T.slides.length;t++){var s=T.slides[t],i=(a+(T.params.centeredSlides?T.minTranslate():0)-s.swiperSlideOffset)/(s.swiperSlideSize+T.params.spaceBetween);if(T.params.watchSlidesVisibility){var r=-(a-s.swiperSlideOffset),n=r+T.slidesSizesGrid[t];(r>=0&&r<T.size||n>0&&n<=T.size||r<=0&&n>=T.size)&&T.slides.eq(t).addClass(T.params.slideVisibleClass)}s.progress=T.rtl?-i:i}}},T.updateProgress=function(e){void 0===e&&(e=T.translate||0);var a=T.maxTranslate()-T.minTranslate(),t=T.isBeginning,s=T.isEnd;0===a?(T.progress=0,T.isBeginning=T.isEnd=!0):(T.progress=(e-T.minTranslate())/a,T.isBeginning=T.progress<=0,T.isEnd=T.progress>=1),T.isBeginning&&!t&&T.emit("onReachBeginning",T),T.isEnd&&!s&&T.emit("onReachEnd",T),T.params.watchSlidesProgress&&T.updateSlidesProgress(e),T.emit("onProgress",T,T.progress)},T.updateActiveIndex=function(){var e,a,t,s=T.rtl?T.translate:-T.translate;for(a=0;a<T.slidesGrid.length;a++)void 0!==T.slidesGrid[a+1]?s>=T.slidesGrid[a]&&s<T.slidesGrid[a+1]-(T.slidesGrid[a+1]-T.slidesGrid[a])/2?e=a:s>=T.slidesGrid[a]&&s<T.slidesGrid[a+1]&&(e=a+1):s>=T.slidesGrid[a]&&(e=a);T.params.normalizeSlideIndex&&(e<0||void 0===e)&&(e=0),t=Math.floor(e/T.params.slidesPerGroup),t>=T.snapGrid.length&&(t=T.snapGrid.length-1),e!==T.activeIndex&&(T.snapIndex=t,T.previousIndex=T.activeIndex,T.activeIndex=e,T.updateClasses(),T.updateRealIndex())},T.updateRealIndex=function(){T.realIndex=parseInt(T.slides.eq(T.activeIndex).attr("data-swiper-slide-index")||T.activeIndex,10)},T.updateClasses=function(){T.slides.removeClass(T.params.slideActiveClass+" "+T.params.slideNextClass+" "+T.params.slidePrevClass+" "+T.params.slideDuplicateActiveClass+" "+T.params.slideDuplicateNextClass+" "+T.params.slideDuplicatePrevClass);var a=T.slides.eq(T.activeIndex);a.addClass(T.params.slideActiveClass),i.loop&&(a.hasClass(T.params.slideDuplicateClass)?T.wrapper.children("."+T.params.slideClass+":not(."+T.params.slideDuplicateClass+')[data-swiper-slide-index="'+T.realIndex+'"]').addClass(T.params.slideDuplicateActiveClass):T.wrapper.children("."+T.params.slideClass+"."+T.params.slideDuplicateClass+'[data-swiper-slide-index="'+T.realIndex+'"]').addClass(T.params.slideDuplicateActiveClass));var t=a.next("."+T.params.slideClass).addClass(T.params.slideNextClass);T.params.loop&&0===t.length&&(t=T.slides.eq(0),t.addClass(T.params.slideNextClass));var s=a.prev("."+T.params.slideClass).addClass(T.params.slidePrevClass);if(T.params.loop&&0===s.length&&(s=T.slides.eq(-1),s.addClass(T.params.slidePrevClass)),i.loop&&(t.hasClass(T.params.slideDuplicateClass)?T.wrapper.children("."+T.params.slideClass+":not(."+T.params.slideDuplicateClass+')[data-swiper-slide-index="'+t.attr("data-swiper-slide-index")+'"]').addClass(T.params.slideDuplicateNextClass):T.wrapper.children("."+T.params.slideClass+"."+T.params.slideDuplicateClass+'[data-swiper-slide-index="'+t.attr("data-swiper-slide-index")+'"]').addClass(T.params.slideDuplicateNextClass),s.hasClass(T.params.slideDuplicateClass)?T.wrapper.children("."+T.params.slideClass+":not(."+T.params.slideDuplicateClass+')[data-swiper-slide-index="'+s.attr("data-swiper-slide-index")+'"]').addClass(T.params.slideDuplicatePrevClass):T.wrapper.children("."+T.params.slideClass+"."+T.params.slideDuplicateClass+'[data-swiper-slide-index="'+s.attr("data-swiper-slide-index")+'"]').addClass(T.params.slideDuplicatePrevClass)),T.paginationContainer&&T.paginationContainer.length>0){var r,n=T.params.loop?Math.ceil((T.slides.length-2*T.loopedSlides)/T.params.slidesPerGroup):T.snapGrid.length;if(T.params.loop?(r=Math.ceil((T.activeIndex-T.loopedSlides)/T.params.slidesPerGroup),r>T.slides.length-1-2*T.loopedSlides&&(r-=T.slides.length-2*T.loopedSlides),r>n-1&&(r-=n),r<0&&"bullets"!==T.params.paginationType&&(r=n+r)):r=void 0!==T.snapIndex?T.snapIndex:T.activeIndex||0,"bullets"===T.params.paginationType&&T.bullets&&T.bullets.length>0&&(T.bullets.removeClass(T.params.bulletActiveClass),T.paginationContainer.length>1?T.bullets.each(function(){e(this).index()===r&&e(this).addClass(T.params.bulletActiveClass)}):T.bullets.eq(r).addClass(T.params.bulletActiveClass)),"fraction"===T.params.paginationType&&(T.paginationContainer.find("."+T.params.paginationCurrentClass).text(r+1),T.paginationContainer.find("."+T.params.paginationTotalClass).text(n)),"progress"===T.params.paginationType){var o=(r+1)/n,l=o,p=1;T.isHorizontal()||(p=o,l=1),T.paginationContainer.find("."+T.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX("+l+") scaleY("+p+")").transition(T.params.speed)}"custom"===T.params.paginationType&&T.params.paginationCustomRender&&(T.paginationContainer.html(T.params.paginationCustomRender(T,r+1,n)),T.emit("onPaginationRendered",T,T.paginationContainer[0]))}T.params.loop||(T.params.prevButton&&T.prevButton&&T.prevButton.length>0&&(T.isBeginning?(T.prevButton.addClass(T.params.buttonDisabledClass),T.params.a11y&&T.a11y&&T.a11y.disable(T.prevButton)):(T.prevButton.removeClass(T.params.buttonDisabledClass),T.params.a11y&&T.a11y&&T.a11y.enable(T.prevButton))),T.params.nextButton&&T.nextButton&&T.nextButton.length>0&&(T.isEnd?(T.nextButton.addClass(T.params.buttonDisabledClass),T.params.a11y&&T.a11y&&T.a11y.disable(T.nextButton)):(T.nextButton.removeClass(T.params.buttonDisabledClass),T.params.a11y&&T.a11y&&T.a11y.enable(T.nextButton))))},T.updatePagination=function(){if(T.params.pagination&&T.paginationContainer&&T.paginationContainer.length>0){var e="";if("bullets"===T.params.paginationType){for(var a=T.params.loop?Math.ceil((T.slides.length-2*T.loopedSlides)/T.params.slidesPerGroup):T.snapGrid.length,t=0;t<a;t++)e+=T.params.paginationBulletRender?T.params.paginationBulletRender(T,t,T.params.bulletClass):"<"+T.params.paginationElement+' class="'+T.params.bulletClass+'"></'+T.params.paginationElement+">";T.paginationContainer.html(e),T.bullets=T.paginationContainer.find("."+T.params.bulletClass),T.params.paginationClickable&&T.params.a11y&&T.a11y&&T.a11y.initPagination()}"fraction"===T.params.paginationType&&(e=T.params.paginationFractionRender?T.params.paginationFractionRender(T,T.params.paginationCurrentClass,T.params.paginationTotalClass):'<span class="'+T.params.paginationCurrentClass+'"></span> / <span class="'+T.params.paginationTotalClass+'"></span>',T.paginationContainer.html(e)),"progress"===T.params.paginationType&&(e=T.params.paginationProgressRender?T.params.paginationProgressRender(T,T.params.paginationProgressbarClass):'<span class="'+T.params.paginationProgressbarClass+'"></span>',T.paginationContainer.html(e)),"custom"!==T.params.paginationType&&T.emit("onPaginationRendered",T,T.paginationContainer[0])}},T.update=function(e){function a(){T.rtl,T.translate;t=Math.min(Math.max(T.translate,T.maxTranslate()),T.minTranslate()),T.setWrapperTranslate(t),T.updateActiveIndex(),T.updateClasses()}if(T){T.updateContainerSize(),T.updateSlidesSize(),T.updateProgress(),T.updatePagination(),T.updateClasses(),T.params.scrollbar&&T.scrollbar&&T.scrollbar.set();var t;if(e){T.controller&&T.controller.spline&&(T.controller.spline=void 0),T.params.freeMode?(a(),T.params.autoHeight&&T.updateAutoHeight()):(("auto"===T.params.slidesPerView||T.params.slidesPerView>1)&&T.isEnd&&!T.params.centeredSlides?T.slideTo(T.slides.length-1,0,!1,!0):T.slideTo(T.activeIndex,0,!1,!0))||a()}else T.params.autoHeight&&T.updateAutoHeight()}},T.onResize=function(e){T.params.onBeforeResize&&T.params.onBeforeResize(T),T.params.breakpoints&&T.setBreakpoint();var a=T.params.allowSwipeToPrev,t=T.params.allowSwipeToNext;T.params.allowSwipeToPrev=T.params.allowSwipeToNext=!0,T.updateContainerSize(),T.updateSlidesSize(),("auto"===T.params.slidesPerView||T.params.freeMode||e)&&T.updatePagination(),T.params.scrollbar&&T.scrollbar&&T.scrollbar.set(),T.controller&&T.controller.spline&&(T.controller.spline=void 0);var s=!1;if(T.params.freeMode){var i=Math.min(Math.max(T.translate,T.maxTranslate()),T.minTranslate());T.setWrapperTranslate(i),T.updateActiveIndex(),T.updateClasses(),T.params.autoHeight&&T.updateAutoHeight()}else T.updateClasses(),s=("auto"===T.params.slidesPerView||T.params.slidesPerView>1)&&T.isEnd&&!T.params.centeredSlides?T.slideTo(T.slides.length-1,0,!1,!0):T.slideTo(T.activeIndex,0,!1,!0);T.params.lazyLoading&&!s&&T.lazy&&T.lazy.load(),T.params.allowSwipeToPrev=a,T.params.allowSwipeToNext=t,T.params.onAfterResize&&T.params.onAfterResize(T)},T.touchEventsDesktop={start:"mousedown",move:"mousemove",end:"mouseup"},window.navigator.pointerEnabled?T.touchEventsDesktop={start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled&&(T.touchEventsDesktop={start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}),T.touchEvents={start:T.support.touch||!T.params.simulateTouch?"touchstart":T.touchEventsDesktop.start,move:T.support.touch||!T.params.simulateTouch?"touchmove":T.touchEventsDesktop.move,end:T.support.touch||!T.params.simulateTouch?"touchend":T.touchEventsDesktop.end},(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&("container"===T.params.touchEventsTarget?T.container:T.wrapper).addClass("swiper-wp8-"+T.params.direction),T.initEvents=function(e){var a=e?"off":"on",t=e?"removeEventListener":"addEventListener",s="container"===T.params.touchEventsTarget?T.container[0]:T.wrapper[0],r=T.support.touch?s:document,n=!!T.params.nested;if(T.browser.ie)s[t](T.touchEvents.start,T.onTouchStart,!1),r[t](T.touchEvents.move,T.onTouchMove,n),r[t](T.touchEvents.end,T.onTouchEnd,!1);else{if(T.support.touch){var o=!("touchstart"!==T.touchEvents.start||!T.support.passiveListener||!T.params.passiveListeners)&&{passive:!0,capture:!1};s[t](T.touchEvents.start,T.onTouchStart,o),s[t](T.touchEvents.move,T.onTouchMove,n),s[t](T.touchEvents.end,T.onTouchEnd,o)}(i.simulateTouch&&!T.device.ios&&!T.device.android||i.simulateTouch&&!T.support.touch&&T.device.ios)&&(s[t]("mousedown",T.onTouchStart,!1),document[t]("mousemove",T.onTouchMove,n),document[t]("mouseup",T.onTouchEnd,!1))}window[t]("resize",T.onResize),T.params.nextButton&&T.nextButton&&T.nextButton.length>0&&(T.nextButton[a]("click",T.onClickNext),T.params.a11y&&T.a11y&&T.nextButton[a]("keydown",T.a11y.onEnterKey)),T.params.prevButton&&T.prevButton&&T.prevButton.length>0&&(T.prevButton[a]("click",T.onClickPrev),T.params.a11y&&T.a11y&&T.prevButton[a]("keydown",T.a11y.onEnterKey)),T.params.pagination&&T.params.paginationClickable&&(T.paginationContainer[a]("click","."+T.params.bulletClass,T.onClickIndex),T.params.a11y&&T.a11y&&T.paginationContainer[a]("keydown","."+T.params.bulletClass,T.a11y.onEnterKey)),(T.params.preventClicks||T.params.preventClicksPropagation)&&s[t]("click",T.preventClicks,!0)},T.attachEvents=function(){T.initEvents()},T.detachEvents=function(){T.initEvents(!0)},T.allowClick=!0,T.preventClicks=function(e){T.allowClick||(T.params.preventClicks&&e.preventDefault(),T.params.preventClicksPropagation&&T.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))},T.onClickNext=function(e){e.preventDefault(),T.isEnd&&!T.params.loop||T.slideNext()},T.onClickPrev=function(e){e.preventDefault(),T.isBeginning&&!T.params.loop||T.slidePrev()},T.onClickIndex=function(a){a.preventDefault();var t=e(this).index()*T.params.slidesPerGroup;T.params.loop&&(t+=T.loopedSlides),T.slideTo(t)},
T.updateClickedSlide=function(a){var t=o(a,"."+T.params.slideClass),s=!1;if(t)for(var i=0;i<T.slides.length;i++)T.slides[i]===t&&(s=!0);if(!t||!s)return T.clickedSlide=void 0,void(T.clickedIndex=void 0);if(T.clickedSlide=t,T.clickedIndex=e(t).index(),T.params.slideToClickedSlide&&void 0!==T.clickedIndex&&T.clickedIndex!==T.activeIndex){var r,n=T.clickedIndex,l="auto"===T.params.slidesPerView?T.currentSlidesPerView():T.params.slidesPerView;if(T.params.loop){if(T.animating)return;r=parseInt(e(T.clickedSlide).attr("data-swiper-slide-index"),10),T.params.centeredSlides?n<T.loopedSlides-l/2||n>T.slides.length-T.loopedSlides+l/2?(T.fixLoop(),n=T.wrapper.children("."+T.params.slideClass+'[data-swiper-slide-index="'+r+'"]:not(.'+T.params.slideDuplicateClass+")").eq(0).index(),setTimeout(function(){T.slideTo(n)},0)):T.slideTo(n):n>T.slides.length-l?(T.fixLoop(),n=T.wrapper.children("."+T.params.slideClass+'[data-swiper-slide-index="'+r+'"]:not(.'+T.params.slideDuplicateClass+")").eq(0).index(),setTimeout(function(){T.slideTo(n)},0)):T.slideTo(n)}else T.slideTo(n)}};var S,C,z,M,E,P,I,k,L,D,B="input, select, textarea, button, video",H=Date.now(),G=[];T.animating=!1,T.touches={startX:0,startY:0,currentX:0,currentY:0,diff:0};var X,A;T.onTouchStart=function(a){if(a.originalEvent&&(a=a.originalEvent),(X="touchstart"===a.type)||!("which"in a)||3!==a.which){if(T.params.noSwiping&&o(a,"."+T.params.noSwipingClass))return void(T.allowClick=!0);if(!T.params.swipeHandler||o(a,T.params.swipeHandler)){var t=T.touches.currentX="touchstart"===a.type?a.targetTouches[0].pageX:a.pageX,s=T.touches.currentY="touchstart"===a.type?a.targetTouches[0].pageY:a.pageY;if(!(T.device.ios&&T.params.iOSEdgeSwipeDetection&&t<=T.params.iOSEdgeSwipeThreshold)){if(S=!0,C=!1,z=!0,E=void 0,A=void 0,T.touches.startX=t,T.touches.startY=s,M=Date.now(),T.allowClick=!0,T.updateContainerSize(),T.swipeDirection=void 0,T.params.threshold>0&&(k=!1),"touchstart"!==a.type){var i=!0;e(a.target).is(B)&&(i=!1),document.activeElement&&e(document.activeElement).is(B)&&document.activeElement.blur(),i&&a.preventDefault()}T.emit("onTouchStart",T,a)}}}},T.onTouchMove=function(a){if(a.originalEvent&&(a=a.originalEvent),!X||"mousemove"!==a.type){if(a.preventedByNestedSwiper)return T.touches.startX="touchmove"===a.type?a.targetTouches[0].pageX:a.pageX,void(T.touches.startY="touchmove"===a.type?a.targetTouches[0].pageY:a.pageY);if(T.params.onlyExternal)return T.allowClick=!1,void(S&&(T.touches.startX=T.touches.currentX="touchmove"===a.type?a.targetTouches[0].pageX:a.pageX,T.touches.startY=T.touches.currentY="touchmove"===a.type?a.targetTouches[0].pageY:a.pageY,M=Date.now()));if(X&&T.params.touchReleaseOnEdges&&!T.params.loop)if(T.isHorizontal()){if(T.touches.currentX<T.touches.startX&&T.translate<=T.maxTranslate()||T.touches.currentX>T.touches.startX&&T.translate>=T.minTranslate())return}else if(T.touches.currentY<T.touches.startY&&T.translate<=T.maxTranslate()||T.touches.currentY>T.touches.startY&&T.translate>=T.minTranslate())return;if(X&&document.activeElement&&a.target===document.activeElement&&e(a.target).is(B))return C=!0,void(T.allowClick=!1);if(z&&T.emit("onTouchMove",T,a),!(a.targetTouches&&a.targetTouches.length>1)){if(T.touches.currentX="touchmove"===a.type?a.targetTouches[0].pageX:a.pageX,T.touches.currentY="touchmove"===a.type?a.targetTouches[0].pageY:a.pageY,void 0===E){var t;T.isHorizontal()&&T.touches.currentY===T.touches.startY||!T.isHorizontal()&&T.touches.currentX===T.touches.startX?E=!1:(t=180*Math.atan2(Math.abs(T.touches.currentY-T.touches.startY),Math.abs(T.touches.currentX-T.touches.startX))/Math.PI,E=T.isHorizontal()?t>T.params.touchAngle:90-t>T.params.touchAngle)}if(E&&T.emit("onTouchMoveOpposite",T,a),void 0===A&&(T.touches.currentX===T.touches.startX&&T.touches.currentY===T.touches.startY||(A=!0)),S){if(E)return void(S=!1);if(A){T.allowClick=!1,T.emit("onSliderMove",T,a),a.preventDefault(),T.params.touchMoveStopPropagation&&!T.params.nested&&a.stopPropagation(),C||(i.loop&&T.fixLoop(),I=T.getWrapperTranslate(),T.setWrapperTransition(0),T.animating&&T.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),T.params.autoplay&&T.autoplaying&&(T.params.autoplayDisableOnInteraction?T.stopAutoplay():T.pauseAutoplay()),D=!1,!T.params.grabCursor||T.params.allowSwipeToNext!==!0&&T.params.allowSwipeToPrev!==!0||T.setGrabCursor(!0)),C=!0;var s=T.touches.diff=T.isHorizontal()?T.touches.currentX-T.touches.startX:T.touches.currentY-T.touches.startY;s*=T.params.touchRatio,T.rtl&&(s=-s),T.swipeDirection=s>0?"prev":"next",P=s+I;var r=!0;if(s>0&&P>T.minTranslate()?(r=!1,T.params.resistance&&(P=T.minTranslate()-1+Math.pow(-T.minTranslate()+I+s,T.params.resistanceRatio))):s<0&&P<T.maxTranslate()&&(r=!1,T.params.resistance&&(P=T.maxTranslate()+1-Math.pow(T.maxTranslate()-I-s,T.params.resistanceRatio))),r&&(a.preventedByNestedSwiper=!0),!T.params.allowSwipeToNext&&"next"===T.swipeDirection&&P<I&&(P=I),!T.params.allowSwipeToPrev&&"prev"===T.swipeDirection&&P>I&&(P=I),T.params.threshold>0){if(!(Math.abs(s)>T.params.threshold||k))return void(P=I);if(!k)return k=!0,T.touches.startX=T.touches.currentX,T.touches.startY=T.touches.currentY,P=I,void(T.touches.diff=T.isHorizontal()?T.touches.currentX-T.touches.startX:T.touches.currentY-T.touches.startY)}T.params.followFinger&&((T.params.freeMode||T.params.watchSlidesProgress)&&T.updateActiveIndex(),T.params.freeMode&&(0===G.length&&G.push({position:T.touches[T.isHorizontal()?"startX":"startY"],time:M}),G.push({position:T.touches[T.isHorizontal()?"currentX":"currentY"],time:(new window.Date).getTime()})),T.updateProgress(P),T.setWrapperTranslate(P))}}}}},T.onTouchEnd=function(a){if(a.originalEvent&&(a=a.originalEvent),z&&T.emit("onTouchEnd",T,a),z=!1,S){T.params.grabCursor&&C&&S&&(T.params.allowSwipeToNext===!0||T.params.allowSwipeToPrev===!0)&&T.setGrabCursor(!1);var t=Date.now(),s=t-M;if(T.allowClick&&(T.updateClickedSlide(a),T.emit("onTap",T,a),s<300&&t-H>300&&(L&&clearTimeout(L),L=setTimeout(function(){T&&(T.params.paginationHide&&T.paginationContainer.length>0&&!e(a.target).hasClass(T.params.bulletClass)&&T.paginationContainer.toggleClass(T.params.paginationHiddenClass),T.emit("onClick",T,a))},300)),s<300&&t-H<300&&(L&&clearTimeout(L),T.emit("onDoubleTap",T,a))),H=Date.now(),setTimeout(function(){T&&(T.allowClick=!0)},0),!S||!C||!T.swipeDirection||0===T.touches.diff||P===I)return void(S=C=!1);S=C=!1;var i;if(i=T.params.followFinger?T.rtl?T.translate:-T.translate:-P,T.params.freeMode){if(i<-T.minTranslate())return void T.slideTo(T.activeIndex);if(i>-T.maxTranslate())return void(T.slides.length<T.snapGrid.length?T.slideTo(T.snapGrid.length-1):T.slideTo(T.slides.length-1));if(T.params.freeModeMomentum){if(G.length>1){var r=G.pop(),n=G.pop(),o=r.position-n.position,l=r.time-n.time;T.velocity=o/l,T.velocity=T.velocity/2,Math.abs(T.velocity)<T.params.freeModeMinimumVelocity&&(T.velocity=0),(l>150||(new window.Date).getTime()-r.time>300)&&(T.velocity=0)}else T.velocity=0;T.velocity=T.velocity*T.params.freeModeMomentumVelocityRatio,G.length=0;var p=1e3*T.params.freeModeMomentumRatio,d=T.velocity*p,u=T.translate+d;T.rtl&&(u=-u);var c,m=!1,h=20*Math.abs(T.velocity)*T.params.freeModeMomentumBounceRatio;if(u<T.maxTranslate())T.params.freeModeMomentumBounce?(u+T.maxTranslate()<-h&&(u=T.maxTranslate()-h),c=T.maxTranslate(),m=!0,D=!0):u=T.maxTranslate();else if(u>T.minTranslate())T.params.freeModeMomentumBounce?(u-T.minTranslate()>h&&(u=T.minTranslate()+h),c=T.minTranslate(),m=!0,D=!0):u=T.minTranslate();else if(T.params.freeModeSticky){var g,f=0;for(f=0;f<T.snapGrid.length;f+=1)if(T.snapGrid[f]>-u){g=f;break}u=Math.abs(T.snapGrid[g]-u)<Math.abs(T.snapGrid[g-1]-u)||"next"===T.swipeDirection?T.snapGrid[g]:T.snapGrid[g-1],T.rtl||(u=-u)}if(0!==T.velocity)p=T.rtl?Math.abs((-u-T.translate)/T.velocity):Math.abs((u-T.translate)/T.velocity);else if(T.params.freeModeSticky)return void T.slideReset();T.params.freeModeMomentumBounce&&m?(T.updateProgress(c),T.setWrapperTransition(p),T.setWrapperTranslate(u),T.onTransitionStart(),T.animating=!0,T.wrapper.transitionEnd(function(){T&&D&&(T.emit("onMomentumBounce",T),T.setWrapperTransition(T.params.speed),T.setWrapperTranslate(c),T.wrapper.transitionEnd(function(){T&&T.onTransitionEnd()}))})):T.velocity?(T.updateProgress(u),T.setWrapperTransition(p),T.setWrapperTranslate(u),T.onTransitionStart(),T.animating||(T.animating=!0,T.wrapper.transitionEnd(function(){T&&T.onTransitionEnd()}))):T.updateProgress(u),T.updateActiveIndex()}return void((!T.params.freeModeMomentum||s>=T.params.longSwipesMs)&&(T.updateProgress(),T.updateActiveIndex()))}var v,w=0,y=T.slidesSizesGrid[0];for(v=0;v<T.slidesGrid.length;v+=T.params.slidesPerGroup)void 0!==T.slidesGrid[v+T.params.slidesPerGroup]?i>=T.slidesGrid[v]&&i<T.slidesGrid[v+T.params.slidesPerGroup]&&(w=v,y=T.slidesGrid[v+T.params.slidesPerGroup]-T.slidesGrid[v]):i>=T.slidesGrid[v]&&(w=v,y=T.slidesGrid[T.slidesGrid.length-1]-T.slidesGrid[T.slidesGrid.length-2]);var x=(i-T.slidesGrid[w])/y;if(s>T.params.longSwipesMs){if(!T.params.longSwipes)return void T.slideTo(T.activeIndex);"next"===T.swipeDirection&&(x>=T.params.longSwipesRatio?T.slideTo(w+T.params.slidesPerGroup):T.slideTo(w)),"prev"===T.swipeDirection&&(x>1-T.params.longSwipesRatio?T.slideTo(w+T.params.slidesPerGroup):T.slideTo(w))}else{if(!T.params.shortSwipes)return void T.slideTo(T.activeIndex);"next"===T.swipeDirection&&T.slideTo(w+T.params.slidesPerGroup),"prev"===T.swipeDirection&&T.slideTo(w)}}},T._slideTo=function(e,a){return T.slideTo(e,a,!0,!0)},T.slideTo=function(e,a,t,s){void 0===t&&(t=!0),void 0===e&&(e=0),e<0&&(e=0),T.snapIndex=Math.floor(e/T.params.slidesPerGroup),T.snapIndex>=T.snapGrid.length&&(T.snapIndex=T.snapGrid.length-1);var i=-T.snapGrid[T.snapIndex];if(T.params.autoplay&&T.autoplaying&&(s||!T.params.autoplayDisableOnInteraction?T.pauseAutoplay(a):T.stopAutoplay()),T.updateProgress(i),T.params.normalizeSlideIndex)for(var r=0;r<T.slidesGrid.length;r++)-Math.floor(100*i)>=Math.floor(100*T.slidesGrid[r])&&(e=r);return!(!T.params.allowSwipeToNext&&i<T.translate&&i<T.minTranslate())&&(!(!T.params.allowSwipeToPrev&&i>T.translate&&i>T.maxTranslate()&&(T.activeIndex||0)!==e)&&(void 0===a&&(a=T.params.speed),T.previousIndex=T.activeIndex||0,T.activeIndex=e,T.updateRealIndex(),T.rtl&&-i===T.translate||!T.rtl&&i===T.translate?(T.params.autoHeight&&T.updateAutoHeight(),T.updateClasses(),"slide"!==T.params.effect&&T.setWrapperTranslate(i),!1):(T.updateClasses(),T.onTransitionStart(t),0===a||T.browser.lteIE9?(T.setWrapperTranslate(i),T.setWrapperTransition(0),T.onTransitionEnd(t)):(T.setWrapperTranslate(i),T.setWrapperTransition(a),T.animating||(T.animating=!0,T.wrapper.transitionEnd(function(){T&&T.onTransitionEnd(t)}))),!0)))},T.onTransitionStart=function(e){void 0===e&&(e=!0),T.params.autoHeight&&T.updateAutoHeight(),T.lazy&&T.lazy.onTransitionStart(),e&&(T.emit("onTransitionStart",T),T.activeIndex!==T.previousIndex&&(T.emit("onSlideChangeStart",T),T.activeIndex>T.previousIndex?T.emit("onSlideNextStart",T):T.emit("onSlidePrevStart",T)))},T.onTransitionEnd=function(e){T.animating=!1,T.setWrapperTransition(0),void 0===e&&(e=!0),T.lazy&&T.lazy.onTransitionEnd(),e&&(T.emit("onTransitionEnd",T),T.activeIndex!==T.previousIndex&&(T.emit("onSlideChangeEnd",T),T.activeIndex>T.previousIndex?T.emit("onSlideNextEnd",T):T.emit("onSlidePrevEnd",T))),T.params.history&&T.history&&T.history.setHistory(T.params.history,T.activeIndex),T.params.hashnav&&T.hashnav&&T.hashnav.setHash()},T.slideNext=function(e,a,t){if(T.params.loop){if(T.animating)return!1;T.fixLoop();T.container[0].clientLeft;return T.slideTo(T.activeIndex+T.params.slidesPerGroup,a,e,t)}return T.slideTo(T.activeIndex+T.params.slidesPerGroup,a,e,t)},T._slideNext=function(e){return T.slideNext(!0,e,!0)},T.slidePrev=function(e,a,t){if(T.params.loop){if(T.animating)return!1;T.fixLoop();T.container[0].clientLeft;return T.slideTo(T.activeIndex-1,a,e,t)}return T.slideTo(T.activeIndex-1,a,e,t)},T._slidePrev=function(e){return T.slidePrev(!0,e,!0)},T.slideReset=function(e,a,t){return T.slideTo(T.activeIndex,a,e)},T.disableTouchControl=function(){return T.params.onlyExternal=!0,!0},T.enableTouchControl=function(){return T.params.onlyExternal=!1,!0},T.setWrapperTransition=function(e,a){T.wrapper.transition(e),"slide"!==T.params.effect&&T.effects[T.params.effect]&&T.effects[T.params.effect].setTransition(e),T.params.parallax&&T.parallax&&T.parallax.setTransition(e),T.params.scrollbar&&T.scrollbar&&T.scrollbar.setTransition(e),T.params.control&&T.controller&&T.controller.setTransition(e,a),T.emit("onSetTransition",T,e)},T.setWrapperTranslate=function(e,a,t){var s=0,i=0;T.isHorizontal()?s=T.rtl?-e:e:i=e,T.params.roundLengths&&(s=r(s),i=r(i)),T.params.virtualTranslate||(T.support.transforms3d?T.wrapper.transform("translate3d("+s+"px, "+i+"px, 0px)"):T.wrapper.transform("translate("+s+"px, "+i+"px)")),T.translate=T.isHorizontal()?s:i;var n,o=T.maxTranslate()-T.minTranslate();n=0===o?0:(e-T.minTranslate())/o,n!==T.progress&&T.updateProgress(e),a&&T.updateActiveIndex(),"slide"!==T.params.effect&&T.effects[T.params.effect]&&T.effects[T.params.effect].setTranslate(T.translate),T.params.parallax&&T.parallax&&T.parallax.setTranslate(T.translate),T.params.scrollbar&&T.scrollbar&&T.scrollbar.setTranslate(T.translate),T.params.control&&T.controller&&T.controller.setTranslate(T.translate,t),T.emit("onSetTranslate",T,T.translate)},T.getTranslate=function(e,a){var t,s,i,r;return void 0===a&&(a="x"),T.params.virtualTranslate?T.rtl?-T.translate:T.translate:(i=window.getComputedStyle(e,null),window.WebKitCSSMatrix?(s=i.transform||i.webkitTransform,s.split(",").length>6&&(s=s.split(", ").map(function(e){return e.replace(",",".")}).join(", ")),r=new window.WebKitCSSMatrix("none"===s?"":s)):(r=i.MozTransform||i.OTransform||i.MsTransform||i.msTransform||i.transform||i.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=r.toString().split(",")),"x"===a&&(s=window.WebKitCSSMatrix?r.m41:16===t.length?parseFloat(t[12]):parseFloat(t[4])),"y"===a&&(s=window.WebKitCSSMatrix?r.m42:16===t.length?parseFloat(t[13]):parseFloat(t[5])),T.rtl&&s&&(s=-s),s||0)},T.getWrapperTranslate=function(e){return void 0===e&&(e=T.isHorizontal()?"x":"y"),T.getTranslate(T.wrapper[0],e)},T.observers=[],T.initObservers=function(){if(T.params.observeParents)for(var e=T.container.parents(),a=0;a<e.length;a++)l(e[a]);l(T.container[0],{childList:!1}),l(T.wrapper[0],{attributes:!1})},T.disconnectObservers=function(){for(var e=0;e<T.observers.length;e++)T.observers[e].disconnect();T.observers=[]},T.createLoop=function(){T.wrapper.children("."+T.params.slideClass+"."+T.params.slideDuplicateClass).remove();var a=T.wrapper.children("."+T.params.slideClass);"auto"!==T.params.slidesPerView||T.params.loopedSlides||(T.params.loopedSlides=a.length),T.loopedSlides=parseInt(T.params.loopedSlides||T.params.slidesPerView,10),T.loopedSlides=T.loopedSlides+T.params.loopAdditionalSlides,T.loopedSlides>a.length&&(T.loopedSlides=a.length);var t,s=[],i=[];for(a.each(function(t,r){var n=e(this);t<T.loopedSlides&&i.push(r),t<a.length&&t>=a.length-T.loopedSlides&&s.push(r),n.attr("data-swiper-slide-index",t)}),t=0;t<i.length;t++)T.wrapper.append(e(i[t].cloneNode(!0)).addClass(T.params.slideDuplicateClass));for(t=s.length-1;t>=0;t--)T.wrapper.prepend(e(s[t].cloneNode(!0)).addClass(T.params.slideDuplicateClass))},T.destroyLoop=function(){T.wrapper.children("."+T.params.slideClass+"."+T.params.slideDuplicateClass).remove(),T.slides.removeAttr("data-swiper-slide-index")},T.reLoop=function(e){var a=T.activeIndex-T.loopedSlides;T.destroyLoop(),T.createLoop(),T.updateSlidesSize(),e&&T.slideTo(a+T.loopedSlides,0,!1)},T.fixLoop=function(){var e;T.activeIndex<T.loopedSlides?(e=T.slides.length-3*T.loopedSlides+T.activeIndex,e+=T.loopedSlides,T.slideTo(e,0,!1,!0)):("auto"===T.params.slidesPerView&&T.activeIndex>=2*T.loopedSlides||T.activeIndex>T.slides.length-2*T.params.slidesPerView)&&(e=-T.slides.length+T.activeIndex+T.loopedSlides,e+=T.loopedSlides,T.slideTo(e,0,!1,!0))},T.appendSlide=function(e){if(T.params.loop&&T.destroyLoop(),"object"==typeof e&&e.length)for(var a=0;a<e.length;a++)e[a]&&T.wrapper.append(e[a]);else T.wrapper.append(e);T.params.loop&&T.createLoop(),T.params.observer&&T.support.observer||T.update(!0)},T.prependSlide=function(e){T.params.loop&&T.destroyLoop();var a=T.activeIndex+1;if("object"==typeof e&&e.length){for(var t=0;t<e.length;t++)e[t]&&T.wrapper.prepend(e[t]);a=T.activeIndex+e.length}else T.wrapper.prepend(e);T.params.loop&&T.createLoop(),T.params.observer&&T.support.observer||T.update(!0),T.slideTo(a,0,!1)},T.removeSlide=function(e){T.params.loop&&(T.destroyLoop(),T.slides=T.wrapper.children("."+T.params.slideClass));var a,t=T.activeIndex;if("object"==typeof e&&e.length){for(var s=0;s<e.length;s++)a=e[s],T.slides[a]&&T.slides.eq(a).remove(),a<t&&t--;t=Math.max(t,0)}else a=e,T.slides[a]&&T.slides.eq(a).remove(),a<t&&t--,t=Math.max(t,0);T.params.loop&&T.createLoop(),T.params.observer&&T.support.observer||T.update(!0),T.params.loop?T.slideTo(t+T.loopedSlides,0,!1):T.slideTo(t,0,!1)},T.removeAllSlides=function(){for(var e=[],a=0;a<T.slides.length;a++)e.push(a);T.removeSlide(e)},T.effects={fade:{setTranslate:function(){for(var e=0;e<T.slides.length;e++){var a=T.slides.eq(e),t=a[0].swiperSlideOffset,s=-t;T.params.virtualTranslate||(s-=T.translate);var i=0;T.isHorizontal()||(i=s,s=0);var r=T.params.fade.crossFade?Math.max(1-Math.abs(a[0].progress),0):1+Math.min(Math.max(a[0].progress,-1),0);a.css({opacity:r}).transform("translate3d("+s+"px, "+i+"px, 0px)")}},setTransition:function(e){if(T.slides.transition(e),T.params.virtualTranslate&&0!==e){var a=!1;T.slides.transitionEnd(function(){if(!a&&T){a=!0,T.animating=!1;for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],t=0;t<e.length;t++)T.wrapper.trigger(e[t])}})}}},flip:{setTranslate:function(){for(var a=0;a<T.slides.length;a++){var t=T.slides.eq(a),s=t[0].progress;T.params.flip.limitRotation&&(s=Math.max(Math.min(t[0].progress,1),-1));var i=t[0].swiperSlideOffset,r=-180*s,n=r,o=0,l=-i,p=0;if(T.isHorizontal()?T.rtl&&(n=-n):(p=l,l=0,o=-n,n=0),t[0].style.zIndex=-Math.abs(Math.round(s))+T.slides.length,T.params.flip.slideShadows){var d=T.isHorizontal()?t.find(".swiper-slide-shadow-left"):t.find(".swiper-slide-shadow-top"),u=T.isHorizontal()?t.find(".swiper-slide-shadow-right"):t.find(".swiper-slide-shadow-bottom");0===d.length&&(d=e('<div class="swiper-slide-shadow-'+(T.isHorizontal()?"left":"top")+'"></div>'),t.append(d)),0===u.length&&(u=e('<div class="swiper-slide-shadow-'+(T.isHorizontal()?"right":"bottom")+'"></div>'),t.append(u)),d.length&&(d[0].style.opacity=Math.max(-s,0)),u.length&&(u[0].style.opacity=Math.max(s,0))}t.transform("translate3d("+l+"px, "+p+"px, 0px) rotateX("+o+"deg) rotateY("+n+"deg)")}},setTransition:function(a){if(T.slides.transition(a).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(a),T.params.virtualTranslate&&0!==a){var t=!1;T.slides.eq(T.activeIndex).transitionEnd(function(){if(!t&&T&&e(this).hasClass(T.params.slideActiveClass)){t=!0,T.animating=!1;for(var a=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],s=0;s<a.length;s++)T.wrapper.trigger(a[s])}})}}},cube:{setTranslate:function(){var a,t=0;T.params.cube.shadow&&(T.isHorizontal()?(a=T.wrapper.find(".swiper-cube-shadow"),0===a.length&&(a=e('<div class="swiper-cube-shadow"></div>'),T.wrapper.append(a)),a.css({height:T.width+"px"})):(a=T.container.find(".swiper-cube-shadow"),0===a.length&&(a=e('<div class="swiper-cube-shadow"></div>'),T.container.append(a))));var firstTolast=false;for(var s=0;s<T.slides.length;s++){var i=T.slides.eq(s),r=90*s,n=Math.floor(r/360);T.rtl&&(r=-r,n=Math.floor(-r/360));var o=Math.max(Math.min(i[0].progress,1),-1);if(o<1&&s==0)firstTolast=true;if(firstTolast&&s==T.slides.length-1){r=(Math.floor(T.slides.length/4)*4+1)*90;n=(s-1)/4;}var l=0,p=0,d=0;s%4==0?(l=4*-n*T.size,d=0):(s-1)%4==0?(l=0,d=4*-n*T.size):(s-2)%4==0?(l=T.size+4*n*T.size,d=T.size):(s-3)%4==0&&(l=-T.size,d=3*T.size+4*T.size*n),T.rtl&&(l=-l),T.isHorizontal()||(p=l,l=0);var u="rotateX("+(T.isHorizontal()?0:-r)+"deg) rotateY("+(T.isHorizontal()?r:0)+"deg) translate3d("+l+"px, "+p+"px, "+d+"px)";if(o<=1&&o>-1&&(t=90*s+90*o,T.rtl&&(t=90*-s-90*o)),i.transform(u),T.params.cube.slideShadows){var c=T.isHorizontal()?i.find(".swiper-slide-shadow-left"):i.find(".swiper-slide-shadow-top"),m=T.isHorizontal()?i.find(".swiper-slide-shadow-right"):i.find(".swiper-slide-shadow-bottom");0===c.length&&(c=e('<div class="swiper-slide-shadow-'+(T.isHorizontal()?"left":"top")+'"></div>'),i.append(c)),0===m.length&&(m=e('<div class="swiper-slide-shadow-'+(T.isHorizontal()?"right":"bottom")+'"></div>'),i.append(m)),c.length&&(c[0].style.opacity=Math.max(-o,0)),m.length&&(m[0].style.opacity=Math.max(o,0))}}if(T.wrapper.css({"-webkit-transform-origin":"50% 50% -"+T.size/2+"px","-moz-transform-origin":"50% 50% -"+T.size/2+"px","-ms-transform-origin":"50% 50% -"+T.size/2+"px","transform-origin":"50% 50% -"+T.size/2+"px"}),T.params.cube.shadow)if(T.isHorizontal())a.transform("translate3d(0px, "+(T.width/2+T.params.cube.shadowOffset)+"px, "+-T.width/2+"px) rotateX(90deg) rotateZ(0deg) scale("+T.params.cube.shadowScale+")");else{var h=Math.abs(t)-90*Math.floor(Math.abs(t)/90),g=1.5-(Math.sin(2*h*Math.PI/360)/2+Math.cos(2*h*Math.PI/360)/2),f=T.params.cube.shadowScale,v=T.params.cube.shadowScale/g,w=T.params.cube.shadowOffset;a.transform("scale3d("+f+", 1, "+v+") translate3d(0px, "+(T.height/2+w)+"px, "+-T.height/2/v+"px) rotateX(-90deg)")}var y=T.isSafari||T.isUiWebView?-T.size/2:0;T.wrapper.transform("translate3d(0px,0,"+y+"px) rotateX("+(T.isHorizontal()?0:t)+"deg) rotateY("+(T.isHorizontal()?-t:0)+"deg)")},setTransition:function(e){T.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),T.params.cube.shadow&&!T.isHorizontal()&&T.container.find(".swiper-cube-shadow").transition(e)}},coverflow:{setTranslate:function(){for(var a=T.translate,t=T.isHorizontal()?-a+T.width/2:-a+T.height/2,s=T.isHorizontal()?T.params.coverflow.rotate:-T.params.coverflow.rotate,i=T.params.coverflow.depth,r=0,n=T.slides.length;r<n;r++){var o=T.slides.eq(r),l=T.slidesSizesGrid[r],p=o[0].swiperSlideOffset,d=(t-p-l/2)/l*T.params.coverflow.modifier,u=T.isHorizontal()?s*d:0,c=T.isHorizontal()?0:s*d,m=-i*Math.abs(d),h=T.isHorizontal()?0:T.params.coverflow.stretch*d,g=T.isHorizontal()?T.params.coverflow.stretch*d:0;Math.abs(g)<.001&&(g=0),Math.abs(h)<.001&&(h=0),Math.abs(m)<.001&&(m=0),Math.abs(u)<.001&&(u=0),Math.abs(c)<.001&&(c=0);var f="translate3d("+g+"px,"+h+"px,"+m+"px)  rotateX("+c+"deg) rotateY("+u+"deg)";if(o.transform(f),o[0].style.zIndex=1-Math.abs(Math.round(d)),T.params.coverflow.slideShadows){var v=T.isHorizontal()?o.find(".swiper-slide-shadow-left"):o.find(".swiper-slide-shadow-top"),w=T.isHorizontal()?o.find(".swiper-slide-shadow-right"):o.find(".swiper-slide-shadow-bottom");0===v.length&&(v=e('<div class="swiper-slide-shadow-'+(T.isHorizontal()?"left":"top")+'"></div>'),o.append(v)),0===w.length&&(w=e('<div class="swiper-slide-shadow-'+(T.isHorizontal()?"right":"bottom")+'"></div>'),o.append(w)),v.length&&(v[0].style.opacity=d>0?d:0),w.length&&(w[0].style.opacity=-d>0?-d:0)}}if(T.browser.ie){T.wrapper[0].style.perspectiveOrigin=t+"px 50%"}},setTransition:function(e){T.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}}},T.lazy={initialImageLoaded:!1,loadImageInSlide:function(a,t){if(void 0!==a&&(void 0===t&&(t=!0),0!==T.slides.length)){var s=T.slides.eq(a),i=s.find("."+T.params.lazyLoadingClass+":not(."+T.params.lazyStatusLoadedClass+"):not(."+T.params.lazyStatusLoadingClass+")");!s.hasClass(T.params.lazyLoadingClass)||s.hasClass(T.params.lazyStatusLoadedClass)||s.hasClass(T.params.lazyStatusLoadingClass)||(i=i.add(s[0])),0!==i.length&&i.each(function(){var a=e(this);a.addClass(T.params.lazyStatusLoadingClass);var i=a.attr("data-background"),r=a.attr("data-src"),n=a.attr("data-srcset"),o=a.attr("data-sizes");T.loadImage(a[0],r||i,n,o,!1,function(){if(void 0!==T&&null!==T&&T){if(i?(a.css("background-image",'url("'+i+'")'),a.removeAttr("data-background")):(n&&(a.attr("srcset",n),a.removeAttr("data-srcset")),o&&(a.attr("sizes",o),a.removeAttr("data-sizes")),r&&(a.attr("src",r),a.removeAttr("data-src"))),a.addClass(T.params.lazyStatusLoadedClass).removeClass(T.params.lazyStatusLoadingClass),s.find("."+T.params.lazyPreloaderClass+", ."+T.params.preloaderClass).remove(),T.params.loop&&t){var e=s.attr("data-swiper-slide-index");if(s.hasClass(T.params.slideDuplicateClass)){var l=T.wrapper.children('[data-swiper-slide-index="'+e+'"]:not(.'+T.params.slideDuplicateClass+")");T.lazy.loadImageInSlide(l.index(),!1)}else{var p=T.wrapper.children("."+T.params.slideDuplicateClass+'[data-swiper-slide-index="'+e+'"]');T.lazy.loadImageInSlide(p.index(),!1)}}T.emit("onLazyImageReady",T,s[0],a[0])}}),T.emit("onLazyImageLoad",T,s[0],a[0])})}},load:function(){var a,t=T.params.slidesPerView;if("auto"===t&&(t=0),T.lazy.initialImageLoaded||(T.lazy.initialImageLoaded=!0),T.params.watchSlidesVisibility)T.wrapper.children("."+T.params.slideVisibleClass).each(function(){T.lazy.loadImageInSlide(e(this).index())});else if(t>1)for(a=T.activeIndex;a<T.activeIndex+t;a++)T.slides[a]&&T.lazy.loadImageInSlide(a);else T.lazy.loadImageInSlide(T.activeIndex);if(T.params.lazyLoadingInPrevNext)if(t>1||T.params.lazyLoadingInPrevNextAmount&&T.params.lazyLoadingInPrevNextAmount>1){var s=T.params.lazyLoadingInPrevNextAmount,i=t,r=Math.min(T.activeIndex+i+Math.max(s,i),T.slides.length),n=Math.max(T.activeIndex-Math.max(i,s),0);for(a=T.activeIndex+t;a<r;a++)T.slides[a]&&T.lazy.loadImageInSlide(a);for(a=n;a<T.activeIndex;a++)T.slides[a]&&T.lazy.loadImageInSlide(a)}else{var o=T.wrapper.children("."+T.params.slideNextClass);o.length>0&&T.lazy.loadImageInSlide(o.index());var l=T.wrapper.children("."+T.params.slidePrevClass);l.length>0&&T.lazy.loadImageInSlide(l.index())}},onTransitionStart:function(){T.params.lazyLoading&&(T.params.lazyLoadingOnTransitionStart||!T.params.lazyLoadingOnTransitionStart&&!T.lazy.initialImageLoaded)&&T.lazy.load()},onTransitionEnd:function(){T.params.lazyLoading&&!T.params.lazyLoadingOnTransitionStart&&T.lazy.load()}},T.scrollbar={isTouched:!1,setDragPosition:function(e){var a=T.scrollbar,t=T.isHorizontal()?"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageX:e.pageX||e.clientX:"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageY:e.pageY||e.clientY,s=t-a.track.offset()[T.isHorizontal()?"left":"top"]-a.dragSize/2,i=-T.minTranslate()*a.moveDivider,r=-T.maxTranslate()*a.moveDivider;s<i?s=i:s>r&&(s=r),s=-s/a.moveDivider,T.updateProgress(s),T.setWrapperTranslate(s,!0)},dragStart:function(e){var a=T.scrollbar;a.isTouched=!0,e.preventDefault(),e.stopPropagation(),a.setDragPosition(e),clearTimeout(a.dragTimeout),a.track.transition(0),T.params.scrollbarHide&&a.track.css("opacity",1),T.wrapper.transition(100),a.drag.transition(100),T.emit("onScrollbarDragStart",T)},dragMove:function(e){var a=T.scrollbar;a.isTouched&&(e.preventDefault?e.preventDefault():e.returnValue=!1,a.setDragPosition(e),T.wrapper.transition(0),a.track.transition(0),a.drag.transition(0),T.emit("onScrollbarDragMove",T))},dragEnd:function(e){var a=T.scrollbar;a.isTouched&&(a.isTouched=!1,T.params.scrollbarHide&&(clearTimeout(a.dragTimeout),a.dragTimeout=setTimeout(function(){a.track.css("opacity",0),a.track.transition(400)},1e3)),T.emit("onScrollbarDragEnd",T),T.params.scrollbarSnapOnRelease&&T.slideReset())},draggableEvents:function(){return T.params.simulateTouch!==!1||T.support.touch?T.touchEvents:T.touchEventsDesktop}(),enableDraggable:function(){var a=T.scrollbar,t=T.support.touch?a.track:document;e(a.track).on(a.draggableEvents.start,a.dragStart),e(t).on(a.draggableEvents.move,a.dragMove),e(t).on(a.draggableEvents.end,a.dragEnd)},disableDraggable:function(){var a=T.scrollbar,t=T.support.touch?a.track:document;e(a.track).off(a.draggableEvents.start,a.dragStart),e(t).off(a.draggableEvents.move,a.dragMove),e(t).off(a.draggableEvents.end,a.dragEnd)},set:function(){if(T.params.scrollbar){var a=T.scrollbar;a.track=e(T.params.scrollbar),T.params.uniqueNavElements&&"string"==typeof T.params.scrollbar&&a.track.length>1&&1===T.container.find(T.params.scrollbar).length&&(a.track=T.container.find(T.params.scrollbar)),a.drag=a.track.find(".swiper-scrollbar-drag"),0===a.drag.length&&(a.drag=e('<div class="swiper-scrollbar-drag"></div>'),a.track.append(a.drag)),a.drag[0].style.width="",a.drag[0].style.height="",a.trackSize=T.isHorizontal()?a.track[0].offsetWidth:a.track[0].offsetHeight,a.divider=T.size/T.virtualSize,a.moveDivider=a.divider*(a.trackSize/T.size),a.dragSize=a.trackSize*a.divider,T.isHorizontal()?a.drag[0].style.width=a.dragSize+"px":a.drag[0].style.height=a.dragSize+"px",a.divider>=1?a.track[0].style.display="none":a.track[0].style.display="",T.params.scrollbarHide&&(a.track[0].style.opacity=0)}},setTranslate:function(){if(T.params.scrollbar){var e,a=T.scrollbar,t=(T.translate,a.dragSize);e=(a.trackSize-a.dragSize)*T.progress,T.rtl&&T.isHorizontal()?(e=-e,e>0?(t=a.dragSize-e,e=0):-e+a.dragSize>a.trackSize&&(t=a.trackSize+e)):e<0?(t=a.dragSize+e,e=0):e+a.dragSize>a.trackSize&&(t=a.trackSize-e),T.isHorizontal()?(T.support.transforms3d?a.drag.transform("translate3d("+e+"px, 0, 0)"):a.drag.transform("translateX("+e+"px)"),a.drag[0].style.width=t+"px"):(T.support.transforms3d?a.drag.transform("translate3d(0px, "+e+"px, 0)"):a.drag.transform("translateY("+e+"px)"),a.drag[0].style.height=t+"px"),T.params.scrollbarHide&&(clearTimeout(a.timeout),a.track[0].style.opacity=1,a.timeout=setTimeout(function(){a.track[0].style.opacity=0,a.track.transition(400)},1e3))}},setTransition:function(e){T.params.scrollbar&&T.scrollbar.drag.transition(e)}},T.controller={LinearSpline:function(e,a){var t=function(){var e,a,t;return function(s,i){for(a=-1,e=s.length;e-a>1;)s[t=e+a>>1]<=i?a=t:e=t;return e}}();this.x=e,this.y=a,this.lastIndex=e.length-1;var s,i;this.x.length;this.interpolate=function(e){return e?(i=t(this.x,e),s=i-1,(e-this.x[s])*(this.y[i]-this.y[s])/(this.x[i]-this.x[s])+this.y[s]):0}},getInterpolateFunction:function(e){T.controller.spline||(T.controller.spline=T.params.loop?new T.controller.LinearSpline(T.slidesGrid,e.slidesGrid):new T.controller.LinearSpline(T.snapGrid,e.snapGrid))},setTranslate:function(e,t){function s(a){e=a.rtl&&"horizontal"===a.params.direction?-T.translate:T.translate,"slide"===T.params.controlBy&&(T.controller.getInterpolateFunction(a),r=-T.controller.spline.interpolate(-e)),r&&"container"!==T.params.controlBy||(i=(a.maxTranslate()-a.minTranslate())/(T.maxTranslate()-T.minTranslate()),r=(e-T.minTranslate())*i+a.minTranslate()),T.params.controlInverse&&(r=a.maxTranslate()-r),a.updateProgress(r),a.setWrapperTranslate(r,!1,T),a.updateActiveIndex()}var i,r,n=T.params.control;if(Array.isArray(n))for(var o=0;o<n.length;o++)n[o]!==t&&n[o]instanceof a&&s(n[o]);else n instanceof a&&t!==n&&s(n)},setTransition:function(e,t){function s(a){a.setWrapperTransition(e,T),0!==e&&(a.onTransitionStart(),a.wrapper.transitionEnd(function(){r&&(a.params.loop&&"slide"===T.params.controlBy&&a.fixLoop(),a.onTransitionEnd())}))}var i,r=T.params.control;if(Array.isArray(r))for(i=0;i<r.length;i++)r[i]!==t&&r[i]instanceof a&&s(r[i]);else r instanceof a&&t!==r&&s(r)}},T.hashnav={onHashCange:function(e,a){var t=document.location.hash.replace("#","");t!==T.slides.eq(T.activeIndex).attr("data-hash")&&T.slideTo(T.wrapper.children("."+T.params.slideClass+'[data-hash="'+t+'"]').index())},attachEvents:function(a){var t=a?"off":"on";e(window)[t]("hashchange",T.hashnav.onHashCange)},setHash:function(){
if(T.hashnav.initialized&&T.params.hashnav)if(T.params.replaceState&&window.history&&window.history.replaceState)window.history.replaceState(null,null,"#"+T.slides.eq(T.activeIndex).attr("data-hash")||"");else{var e=T.slides.eq(T.activeIndex),a=e.attr("data-hash")||e.attr("data-history");document.location.hash=a||""}},init:function(){if(T.params.hashnav&&!T.params.history){T.hashnav.initialized=!0;var e=document.location.hash.replace("#","");if(e)for(var a=0,t=T.slides.length;a<t;a++){var s=T.slides.eq(a),i=s.attr("data-hash")||s.attr("data-history");if(i===e&&!s.hasClass(T.params.slideDuplicateClass)){var r=s.index();T.slideTo(r,0,T.params.runCallbacksOnInit,!0)}}T.params.hashnavWatchState&&T.hashnav.attachEvents()}},destroy:function(){T.params.hashnavWatchState&&T.hashnav.attachEvents(!0)}},T.history={init:function(){if(T.params.history){if(!window.history||!window.history.pushState)return T.params.history=!1,void(T.params.hashnav=!0);T.history.initialized=!0,this.paths=this.getPathValues(),(this.paths.key||this.paths.value)&&(this.scrollToSlide(0,this.paths.value,T.params.runCallbacksOnInit),T.params.replaceState||window.addEventListener("popstate",this.setHistoryPopState))}},setHistoryPopState:function(){T.history.paths=T.history.getPathValues(),T.history.scrollToSlide(T.params.speed,T.history.paths.value,!1)},getPathValues:function(){var e=window.location.pathname.slice(1).split("/"),a=e.length;return{key:e[a-2],value:e[a-1]}},setHistory:function(e,a){if(T.history.initialized&&T.params.history){var t=T.slides.eq(a),s=this.slugify(t.attr("data-history"));window.location.pathname.includes(e)||(s=e+"/"+s),T.params.replaceState?window.history.replaceState(null,null,s):window.history.pushState(null,null,s)}},slugify:function(e){return e.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},scrollToSlide:function(e,a,t){if(a)for(var s=0,i=T.slides.length;s<i;s++){var r=T.slides.eq(s),n=this.slugify(r.attr("data-history"));if(n===a&&!r.hasClass(T.params.slideDuplicateClass)){var o=r.index();T.slideTo(o,e,t)}}else T.slideTo(0,e,t)}},T.disableKeyboardControl=function(){T.params.keyboardControl=!1,e(document).off("keydown",p)},T.enableKeyboardControl=function(){T.params.keyboardControl=!0,e(document).on("keydown",p)},T.mousewheel={event:!1,lastScrollTime:(new window.Date).getTime()},T.params.mousewheelControl&&(T.mousewheel.event=navigator.userAgent.indexOf("firefox")>-1?"DOMMouseScroll":function(){var e="onwheel"in document;if(!e){var a=document.createElement("div");a.setAttribute("onwheel","return;"),e="function"==typeof a.onwheel}return!e&&document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0&&(e=document.implementation.hasFeature("Events.wheel","3.0")),e}()?"wheel":"mousewheel"),T.disableMousewheelControl=function(){if(!T.mousewheel.event)return!1;var a=T.container;return"container"!==T.params.mousewheelEventsTarged&&(a=e(T.params.mousewheelEventsTarged)),a.off(T.mousewheel.event,u),T.params.mousewheelControl=!1,!0},T.enableMousewheelControl=function(){if(!T.mousewheel.event)return!1;var a=T.container;return"container"!==T.params.mousewheelEventsTarged&&(a=e(T.params.mousewheelEventsTarged)),a.on(T.mousewheel.event,u),T.params.mousewheelControl=!0,!0},T.parallax={setTranslate:function(){T.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){c(this,T.progress)}),T.slides.each(function(){var a=e(this);a.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){c(this,Math.min(Math.max(a[0].progress,-1),1))})})},setTransition:function(a){void 0===a&&(a=T.params.speed),T.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var t=e(this),s=parseInt(t.attr("data-swiper-parallax-duration"),10)||a;0===a&&(s=0),t.transition(s)})}},T.zoom={scale:1,currentScale:1,isScaling:!1,gesture:{slide:void 0,slideWidth:void 0,slideHeight:void 0,image:void 0,imageWrap:void 0,zoomMax:T.params.zoomMax},image:{isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},velocity:{x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0},getDistanceBetweenTouches:function(e){if(e.targetTouches.length<2)return 1;var a=e.targetTouches[0].pageX,t=e.targetTouches[0].pageY,s=e.targetTouches[1].pageX,i=e.targetTouches[1].pageY;return Math.sqrt(Math.pow(s-a,2)+Math.pow(i-t,2))},onGestureStart:function(a){var t=T.zoom;if(!T.support.gestures){if("touchstart"!==a.type||"touchstart"===a.type&&a.targetTouches.length<2)return;t.gesture.scaleStart=t.getDistanceBetweenTouches(a)}if(!(t.gesture.slide&&t.gesture.slide.length||(t.gesture.slide=e(this),0===t.gesture.slide.length&&(t.gesture.slide=T.slides.eq(T.activeIndex)),t.gesture.image=t.gesture.slide.find("img, svg, canvas"),t.gesture.imageWrap=t.gesture.image.parent("."+T.params.zoomContainerClass),t.gesture.zoomMax=t.gesture.imageWrap.attr("data-swiper-zoom")||T.params.zoomMax,0!==t.gesture.imageWrap.length)))return void(t.gesture.image=void 0);t.gesture.image.transition(0),t.isScaling=!0},onGestureChange:function(e){var a=T.zoom;if(!T.support.gestures){if("touchmove"!==e.type||"touchmove"===e.type&&e.targetTouches.length<2)return;a.gesture.scaleMove=a.getDistanceBetweenTouches(e)}a.gesture.image&&0!==a.gesture.image.length&&(T.support.gestures?a.scale=e.scale*a.currentScale:a.scale=a.gesture.scaleMove/a.gesture.scaleStart*a.currentScale,a.scale>a.gesture.zoomMax&&(a.scale=a.gesture.zoomMax-1+Math.pow(a.scale-a.gesture.zoomMax+1,.5)),a.scale<T.params.zoomMin&&(a.scale=T.params.zoomMin+1-Math.pow(T.params.zoomMin-a.scale+1,.5)),a.gesture.image.transform("translate3d(0,0,0) scale("+a.scale+")"))},onGestureEnd:function(e){var a=T.zoom;!T.support.gestures&&("touchend"!==e.type||"touchend"===e.type&&e.changedTouches.length<2)||a.gesture.image&&0!==a.gesture.image.length&&(a.scale=Math.max(Math.min(a.scale,a.gesture.zoomMax),T.params.zoomMin),a.gesture.image.transition(T.params.speed).transform("translate3d(0,0,0) scale("+a.scale+")"),a.currentScale=a.scale,a.isScaling=!1,1===a.scale&&(a.gesture.slide=void 0))},onTouchStart:function(e,a){var t=e.zoom;t.gesture.image&&0!==t.gesture.image.length&&(t.image.isTouched||("android"===e.device.os&&a.preventDefault(),t.image.isTouched=!0,t.image.touchesStart.x="touchstart"===a.type?a.targetTouches[0].pageX:a.pageX,t.image.touchesStart.y="touchstart"===a.type?a.targetTouches[0].pageY:a.pageY))},onTouchMove:function(e){var a=T.zoom;if(a.gesture.image&&0!==a.gesture.image.length&&(T.allowClick=!1,a.image.isTouched&&a.gesture.slide)){a.image.isMoved||(a.image.width=a.gesture.image[0].offsetWidth,a.image.height=a.gesture.image[0].offsetHeight,a.image.startX=T.getTranslate(a.gesture.imageWrap[0],"x")||0,a.image.startY=T.getTranslate(a.gesture.imageWrap[0],"y")||0,a.gesture.slideWidth=a.gesture.slide[0].offsetWidth,a.gesture.slideHeight=a.gesture.slide[0].offsetHeight,a.gesture.imageWrap.transition(0),T.rtl&&(a.image.startX=-a.image.startX),T.rtl&&(a.image.startY=-a.image.startY));var t=a.image.width*a.scale,s=a.image.height*a.scale;if(!(t<a.gesture.slideWidth&&s<a.gesture.slideHeight)){if(a.image.minX=Math.min(a.gesture.slideWidth/2-t/2,0),a.image.maxX=-a.image.minX,a.image.minY=Math.min(a.gesture.slideHeight/2-s/2,0),a.image.maxY=-a.image.minY,a.image.touchesCurrent.x="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,a.image.touchesCurrent.y="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,!a.image.isMoved&&!a.isScaling){if(T.isHorizontal()&&Math.floor(a.image.minX)===Math.floor(a.image.startX)&&a.image.touchesCurrent.x<a.image.touchesStart.x||Math.floor(a.image.maxX)===Math.floor(a.image.startX)&&a.image.touchesCurrent.x>a.image.touchesStart.x)return void(a.image.isTouched=!1);if(!T.isHorizontal()&&Math.floor(a.image.minY)===Math.floor(a.image.startY)&&a.image.touchesCurrent.y<a.image.touchesStart.y||Math.floor(a.image.maxY)===Math.floor(a.image.startY)&&a.image.touchesCurrent.y>a.image.touchesStart.y)return void(a.image.isTouched=!1)}e.preventDefault(),e.stopPropagation(),a.image.isMoved=!0,a.image.currentX=a.image.touchesCurrent.x-a.image.touchesStart.x+a.image.startX,a.image.currentY=a.image.touchesCurrent.y-a.image.touchesStart.y+a.image.startY,a.image.currentX<a.image.minX&&(a.image.currentX=a.image.minX+1-Math.pow(a.image.minX-a.image.currentX+1,.8)),a.image.currentX>a.image.maxX&&(a.image.currentX=a.image.maxX-1+Math.pow(a.image.currentX-a.image.maxX+1,.8)),a.image.currentY<a.image.minY&&(a.image.currentY=a.image.minY+1-Math.pow(a.image.minY-a.image.currentY+1,.8)),a.image.currentY>a.image.maxY&&(a.image.currentY=a.image.maxY-1+Math.pow(a.image.currentY-a.image.maxY+1,.8)),a.velocity.prevPositionX||(a.velocity.prevPositionX=a.image.touchesCurrent.x),a.velocity.prevPositionY||(a.velocity.prevPositionY=a.image.touchesCurrent.y),a.velocity.prevTime||(a.velocity.prevTime=Date.now()),a.velocity.x=(a.image.touchesCurrent.x-a.velocity.prevPositionX)/(Date.now()-a.velocity.prevTime)/2,a.velocity.y=(a.image.touchesCurrent.y-a.velocity.prevPositionY)/(Date.now()-a.velocity.prevTime)/2,Math.abs(a.image.touchesCurrent.x-a.velocity.prevPositionX)<2&&(a.velocity.x=0),Math.abs(a.image.touchesCurrent.y-a.velocity.prevPositionY)<2&&(a.velocity.y=0),a.velocity.prevPositionX=a.image.touchesCurrent.x,a.velocity.prevPositionY=a.image.touchesCurrent.y,a.velocity.prevTime=Date.now(),a.gesture.imageWrap.transform("translate3d("+a.image.currentX+"px, "+a.image.currentY+"px,0)")}}},onTouchEnd:function(e,a){var t=e.zoom;if(t.gesture.image&&0!==t.gesture.image.length){if(!t.image.isTouched||!t.image.isMoved)return t.image.isTouched=!1,void(t.image.isMoved=!1);t.image.isTouched=!1,t.image.isMoved=!1;var s=300,i=300,r=t.velocity.x*s,n=t.image.currentX+r,o=t.velocity.y*i,l=t.image.currentY+o;0!==t.velocity.x&&(s=Math.abs((n-t.image.currentX)/t.velocity.x)),0!==t.velocity.y&&(i=Math.abs((l-t.image.currentY)/t.velocity.y));var p=Math.max(s,i);t.image.currentX=n,t.image.currentY=l;var d=t.image.width*t.scale,u=t.image.height*t.scale;t.image.minX=Math.min(t.gesture.slideWidth/2-d/2,0),t.image.maxX=-t.image.minX,t.image.minY=Math.min(t.gesture.slideHeight/2-u/2,0),t.image.maxY=-t.image.minY,t.image.currentX=Math.max(Math.min(t.image.currentX,t.image.maxX),t.image.minX),t.image.currentY=Math.max(Math.min(t.image.currentY,t.image.maxY),t.image.minY),t.gesture.imageWrap.transition(p).transform("translate3d("+t.image.currentX+"px, "+t.image.currentY+"px,0)")}},onTransitionEnd:function(e){var a=e.zoom;a.gesture.slide&&e.previousIndex!==e.activeIndex&&(a.gesture.image.transform("translate3d(0,0,0) scale(1)"),a.gesture.imageWrap.transform("translate3d(0,0,0)"),a.gesture.slide=a.gesture.image=a.gesture.imageWrap=void 0,a.scale=a.currentScale=1)},toggleZoom:function(a,t){var s=a.zoom;if(s.gesture.slide||(s.gesture.slide=a.clickedSlide?e(a.clickedSlide):a.slides.eq(a.activeIndex),s.gesture.image=s.gesture.slide.find("img, svg, canvas"),s.gesture.imageWrap=s.gesture.image.parent("."+a.params.zoomContainerClass)),s.gesture.image&&0!==s.gesture.image.length){var i,r,n,o,l,p,d,u,c,m,h,g,f,v,w,y,x,T;void 0===s.image.touchesStart.x&&t?(i="touchend"===t.type?t.changedTouches[0].pageX:t.pageX,r="touchend"===t.type?t.changedTouches[0].pageY:t.pageY):(i=s.image.touchesStart.x,r=s.image.touchesStart.y),s.scale&&1!==s.scale?(s.scale=s.currentScale=1,s.gesture.imageWrap.transition(300).transform("translate3d(0,0,0)"),s.gesture.image.transition(300).transform("translate3d(0,0,0) scale(1)"),s.gesture.slide=void 0):(s.scale=s.currentScale=s.gesture.imageWrap.attr("data-swiper-zoom")||a.params.zoomMax,t?(x=s.gesture.slide[0].offsetWidth,T=s.gesture.slide[0].offsetHeight,n=s.gesture.slide.offset().left,o=s.gesture.slide.offset().top,l=n+x/2-i,p=o+T/2-r,c=s.gesture.image[0].offsetWidth,m=s.gesture.image[0].offsetHeight,h=c*s.scale,g=m*s.scale,f=Math.min(x/2-h/2,0),v=Math.min(T/2-g/2,0),w=-f,y=-v,d=l*s.scale,u=p*s.scale,d<f&&(d=f),d>w&&(d=w),u<v&&(u=v),u>y&&(u=y)):(d=0,u=0),s.gesture.imageWrap.transition(300).transform("translate3d("+d+"px, "+u+"px,0)"),s.gesture.image.transition(300).transform("translate3d(0,0,0) scale("+s.scale+")"))}},attachEvents:function(a){var t=a?"off":"on";if(T.params.zoom){var s=(T.slides,!("touchstart"!==T.touchEvents.start||!T.support.passiveListener||!T.params.passiveListeners)&&{passive:!0,capture:!1});T.support.gestures?(T.slides[t]("gesturestart",T.zoom.onGestureStart,s),T.slides[t]("gesturechange",T.zoom.onGestureChange,s),T.slides[t]("gestureend",T.zoom.onGestureEnd,s)):"touchstart"===T.touchEvents.start&&(T.slides[t](T.touchEvents.start,T.zoom.onGestureStart,s),T.slides[t](T.touchEvents.move,T.zoom.onGestureChange,s),T.slides[t](T.touchEvents.end,T.zoom.onGestureEnd,s)),T[t]("touchStart",T.zoom.onTouchStart),T.slides.each(function(a,s){e(s).find("."+T.params.zoomContainerClass).length>0&&e(s)[t](T.touchEvents.move,T.zoom.onTouchMove)}),T[t]("touchEnd",T.zoom.onTouchEnd),T[t]("transitionEnd",T.zoom.onTransitionEnd),T.params.zoomToggle&&T.on("doubleTap",T.zoom.toggleZoom)}},init:function(){T.zoom.attachEvents()},destroy:function(){T.zoom.attachEvents(!0)}},T._plugins=[];for(var Y in T.plugins){var O=T.plugins[Y](T,T.params[Y]);O&&T._plugins.push(O)}return T.callPlugins=function(e){for(var a=0;a<T._plugins.length;a++)e in T._plugins[a]&&T._plugins[a][e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},T.emitterEventListeners={},T.emit=function(e){T.params[e]&&T.params[e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);var a;if(T.emitterEventListeners[e])for(a=0;a<T.emitterEventListeners[e].length;a++)T.emitterEventListeners[e][a](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);T.callPlugins&&T.callPlugins(e,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},T.on=function(e,a){return e=m(e),T.emitterEventListeners[e]||(T.emitterEventListeners[e]=[]),T.emitterEventListeners[e].push(a),T},T.off=function(e,a){var t;if(e=m(e),void 0===a)return T.emitterEventListeners[e]=[],T;if(T.emitterEventListeners[e]&&0!==T.emitterEventListeners[e].length){for(t=0;t<T.emitterEventListeners[e].length;t++)T.emitterEventListeners[e][t]===a&&T.emitterEventListeners[e].splice(t,1);return T}},T.once=function(e,a){e=m(e);var t=function(){a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]),T.off(e,t)};return T.on(e,t),T},T.a11y={makeFocusable:function(e){return e.attr("tabIndex","0"),e},addRole:function(e,a){return e.attr("role",a),e},addLabel:function(e,a){return e.attr("aria-label",a),e},disable:function(e){return e.attr("aria-disabled",!0),e},enable:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(a){13===a.keyCode&&(e(a.target).is(T.params.nextButton)?(T.onClickNext(a),T.isEnd?T.a11y.notify(T.params.lastSlideMessage):T.a11y.notify(T.params.nextSlideMessage)):e(a.target).is(T.params.prevButton)&&(T.onClickPrev(a),T.isBeginning?T.a11y.notify(T.params.firstSlideMessage):T.a11y.notify(T.params.prevSlideMessage)),e(a.target).is("."+T.params.bulletClass)&&e(a.target)[0].click())},liveRegion:e('<span class="'+T.params.notificationClass+'" aria-live="assertive" aria-atomic="true"></span>'),notify:function(e){var a=T.a11y.liveRegion;0!==a.length&&(a.html(""),a.html(e))},init:function(){T.params.nextButton&&T.nextButton&&T.nextButton.length>0&&(T.a11y.makeFocusable(T.nextButton),T.a11y.addRole(T.nextButton,"button"),T.a11y.addLabel(T.nextButton,T.params.nextSlideMessage)),T.params.prevButton&&T.prevButton&&T.prevButton.length>0&&(T.a11y.makeFocusable(T.prevButton),T.a11y.addRole(T.prevButton,"button"),T.a11y.addLabel(T.prevButton,T.params.prevSlideMessage)),e(T.container).append(T.a11y.liveRegion)},initPagination:function(){T.params.pagination&&T.params.paginationClickable&&T.bullets&&T.bullets.length&&T.bullets.each(function(){var a=e(this);T.a11y.makeFocusable(a),T.a11y.addRole(a,"button"),T.a11y.addLabel(a,T.params.paginationBulletMessage.replace(/{{index}}/,a.index()+1))})},destroy:function(){T.a11y.liveRegion&&T.a11y.liveRegion.length>0&&T.a11y.liveRegion.remove()}},T.init=function(){T.params.loop&&T.createLoop(),T.updateContainerSize(),T.updateSlidesSize(),T.updatePagination(),T.params.scrollbar&&T.scrollbar&&(T.scrollbar.set(),T.params.scrollbarDraggable&&T.scrollbar.enableDraggable()),"slide"!==T.params.effect&&T.effects[T.params.effect]&&(T.params.loop||T.updateProgress(),T.effects[T.params.effect].setTranslate()),T.params.loop?T.slideTo(T.params.initialSlide+T.loopedSlides,0,T.params.runCallbacksOnInit):(T.slideTo(T.params.initialSlide,0,T.params.runCallbacksOnInit),0===T.params.initialSlide&&(T.parallax&&T.params.parallax&&T.parallax.setTranslate(),T.lazy&&T.params.lazyLoading&&(T.lazy.load(),T.lazy.initialImageLoaded=!0))),T.attachEvents(),T.params.observer&&T.support.observer&&T.initObservers(),T.params.preloadImages&&!T.params.lazyLoading&&T.preloadImages(),T.params.zoom&&T.zoom&&T.zoom.init(),T.params.autoplay&&T.startAutoplay(),T.params.keyboardControl&&T.enableKeyboardControl&&T.enableKeyboardControl(),T.params.mousewheelControl&&T.enableMousewheelControl&&T.enableMousewheelControl(),T.params.hashnavReplaceState&&(T.params.replaceState=T.params.hashnavReplaceState),T.params.history&&T.history&&T.history.init(),T.params.hashnav&&T.hashnav&&T.hashnav.init(),T.params.a11y&&T.a11y&&T.a11y.init(),T.emit("onInit",T)},T.cleanupStyles=function(){T.container.removeClass(T.classNames.join(" ")).removeAttr("style"),T.wrapper.removeAttr("style"),T.slides&&T.slides.length&&T.slides.removeClass([T.params.slideVisibleClass,T.params.slideActiveClass,T.params.slideNextClass,T.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),T.paginationContainer&&T.paginationContainer.length&&T.paginationContainer.removeClass(T.params.paginationHiddenClass),T.bullets&&T.bullets.length&&T.bullets.removeClass(T.params.bulletActiveClass),T.params.prevButton&&e(T.params.prevButton).removeClass(T.params.buttonDisabledClass),T.params.nextButton&&e(T.params.nextButton).removeClass(T.params.buttonDisabledClass),T.params.scrollbar&&T.scrollbar&&(T.scrollbar.track&&T.scrollbar.track.length&&T.scrollbar.track.removeAttr("style"),T.scrollbar.drag&&T.scrollbar.drag.length&&T.scrollbar.drag.removeAttr("style"))},T.destroy=function(e,a){T.detachEvents(),T.stopAutoplay(),T.params.scrollbar&&T.scrollbar&&T.params.scrollbarDraggable&&T.scrollbar.disableDraggable(),T.params.loop&&T.destroyLoop(),a&&T.cleanupStyles(),T.disconnectObservers(),T.params.zoom&&T.zoom&&T.zoom.destroy(),T.params.keyboardControl&&T.disableKeyboardControl&&T.disableKeyboardControl(),T.params.mousewheelControl&&T.disableMousewheelControl&&T.disableMousewheelControl(),T.params.a11y&&T.a11y&&T.a11y.destroy(),T.params.history&&!T.params.replaceState&&window.removeEventListener("popstate",T.history.setHistoryPopState),T.params.hashnav&&T.hashnav&&T.hashnav.destroy(),T.emit("onDestroy"),e!==!1&&(T=null)},T.init(),T}};a.prototype={isSafari:function(){var e=window.navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent),isArray:function(e){return"[object Array]"===Object.prototype.toString.apply(e)},browser:{ie:window.navigator.pointerEnabled||window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>1||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>1,lteIE9:function(){var e=document.createElement("div");return e.innerHTML="<!--[if lte IE 9]><i></i><![endif]-->",1===e.getElementsByTagName("i").length}()},device:function(){var e=window.navigator.userAgent,a=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),s=e.match(/(iPod)(.*OS\s([\d_]+))?/),i=!t&&e.match(/(iPhone\sOS|iOS)\s([\d_]+)/);return{ios:t||i||s,android:a}}(),support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){var e=document.createElement("div").style;return"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e}(),flexbox:function(){for(var e=document.createElement("div").style,a="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),t=0;t<a.length;t++)if(a[t]in e)return!0}(),observer:function(){return"MutationObserver"in window||"WebkitMutationObserver"in window}(),passiveListener:function(){var e=!1;try{var a=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("testPassiveListener",null,a)}catch(e){}return e}(),gestures:function(){return"ongesturestart"in window}()},plugins:{}};for(var t=(function(){var e=function(e){var a=this,t=0;for(t=0;t<e.length;t++)a[t]=e[t];return a.length=e.length,this},a=function(a,t){var s=[],i=0;if(a&&!t&&a instanceof e)return a;if(a)if("string"==typeof a){var r,n,o=a.trim();if(o.indexOf("<")>=0&&o.indexOf(">")>=0){var l="div";for(0===o.indexOf("<li")&&(l="ul"),0===o.indexOf("<tr")&&(l="tbody"),0!==o.indexOf("<td")&&0!==o.indexOf("<th")||(l="tr"),0===o.indexOf("<tbody")&&(l="table"),0===o.indexOf("<option")&&(l="select"),n=document.createElement(l),n.innerHTML=a,i=0;i<n.childNodes.length;i++)s.push(n.childNodes[i])}else for(r=t||"#"!==a[0]||a.match(/[ .<>:~]/)?(t||document).querySelectorAll(a):[document.getElementById(a.split("#")[1])],i=0;i<r.length;i++)r[i]&&s.push(r[i])}else if(a.nodeType||a===window||a===document)s.push(a);else if(a.length>0&&a[0].nodeType)for(i=0;i<a.length;i++)s.push(a[i]);return new e(s)};return e.prototype={addClass:function(e){if(void 0===e)return this;for(var a=e.split(" "),t=0;t<a.length;t++)for(var s=0;s<this.length;s++)this[s].classList.add(a[t]);return this},removeClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var s=0;s<this.length;s++)this[s].classList.remove(a[t]);return this},hasClass:function(e){return!!this[0]&&this[0].classList.contains(e)},toggleClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var s=0;s<this.length;s++)this[s].classList.toggle(a[t]);return this},attr:function(e,a){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var t=0;t<this.length;t++)if(2===arguments.length)this[t].setAttribute(e,a);else for(var s in e)this[t][s]=e[s],this[t].setAttribute(s,e[s]);return this},removeAttr:function(e){for(var a=0;a<this.length;a++)this[a].removeAttribute(e);return this},data:function(e,a){if(void 0!==a){for(var t=0;t<this.length;t++){var s=this[t];s.dom7ElementDataStorage||(s.dom7ElementDataStorage={}),s.dom7ElementDataStorage[e]=a}return this}if(this[0]){var i=this[0].getAttribute("data-"+e);return i?i:this[0].dom7ElementDataStorage&&e in this[0].dom7ElementDataStorage?this[0].dom7ElementDataStorage[e]:void 0}},transform:function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this},on:function(e,t,s,i){function r(e){var i=e.target;if(a(i).is(t))s.call(i,e);else for(var r=a(i).parents(),n=0;n<r.length;n++)a(r[n]).is(t)&&s.call(r[n],e)}var n,o,l=e.split(" ");for(n=0;n<this.length;n++)if("function"==typeof t||t===!1)for("function"==typeof t&&(s=arguments[1],i=arguments[2]||!1),o=0;o<l.length;o++)this[n].addEventListener(l[o],s,i);else for(o=0;o<l.length;o++)this[n].dom7LiveListeners||(this[n].dom7LiveListeners=[]),this[n].dom7LiveListeners.push({listener:s,liveListener:r}),this[n].addEventListener(l[o],r,i);return this},off:function(e,a,t,s){for(var i=e.split(" "),r=0;r<i.length;r++)for(var n=0;n<this.length;n++)if("function"==typeof a||a===!1)"function"==typeof a&&(t=arguments[1],s=arguments[2]||!1),this[n].removeEventListener(i[r],t,s);else if(this[n].dom7LiveListeners)for(var o=0;o<this[n].dom7LiveListeners.length;o++)this[n].dom7LiveListeners[o].listener===t&&this[n].removeEventListener(i[r],this[n].dom7LiveListeners[o].liveListener,s);return this},once:function(e,a,t,s){function i(n){t(n),r.off(e,a,i,s)}var r=this;"function"==typeof a&&(a=!1,t=arguments[1],s=arguments[2]),r.on(e,a,i,s)},trigger:function(e,a){for(var t=0;t<this.length;t++){var s;try{s=new window.CustomEvent(e,{detail:a,bubbles:!0,cancelable:!0})}catch(t){s=document.createEvent("Event"),s.initEvent(e,!0,!0),s.detail=a}this[t].dispatchEvent(s)}return this},transitionEnd:function(e){function a(r){if(r.target===this)for(e.call(this,r),t=0;t<s.length;t++)i.off(s[t],a)}var t,s=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],i=this;if(e)for(t=0;t<s.length;t++)i.on(s[t],a);return this},width:function(){return this[0]===window?window.innerWidth:this.length>0?parseFloat(this.css("width")):null},outerWidth:function(e){return this.length>0?e?this[0].offsetWidth+parseFloat(this.css("margin-right"))+parseFloat(this.css("margin-left")):this[0].offsetWidth:null},height:function(){return this[0]===window?window.innerHeight:this.length>0?parseFloat(this.css("height")):null},outerHeight:function(e){return this.length>0?e?this[0].offsetHeight+parseFloat(this.css("margin-top"))+parseFloat(this.css("margin-bottom")):this[0].offsetHeight:null},offset:function(){if(this.length>0){var e=this[0],a=e.getBoundingClientRect(),t=document.body,s=e.clientTop||t.clientTop||0,i=e.clientLeft||t.clientLeft||0,r=window.pageYOffset||e.scrollTop,n=window.pageXOffset||e.scrollLeft;return{top:a.top+r-s,left:a.left+n-i}}return null},css:function(e,a){var t;if(1===arguments.length){if("string"!=typeof e){for(t=0;t<this.length;t++)for(var s in e)this[t].style[s]=e[s];return this}if(this[0])return window.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(t=0;t<this.length;t++)this[t].style[e]=a;return this}return this},each:function(e){for(var a=0;a<this.length;a++)e.call(this[a],a,this[a]);return this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:void 0;for(var a=0;a<this.length;a++)this[a].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(var a=0;a<this.length;a++)this[a].textContent=e;return this},is:function(t){if(!this[0])return!1;var s,i;if("string"==typeof t){var r=this[0];if(r===document)return t===document;if(r===window)return t===window;if(r.matches)return r.matches(t);if(r.webkitMatchesSelector)return r.webkitMatchesSelector(t);if(r.mozMatchesSelector)return r.mozMatchesSelector(t);if(r.msMatchesSelector)return r.msMatchesSelector(t);for(s=a(t),i=0;i<s.length;i++)if(s[i]===this[0])return!0;return!1}if(t===document)return this[0]===document;if(t===window)return this[0]===window;if(t.nodeType||t instanceof e){for(s=t.nodeType?[t]:t,i=0;i<s.length;i++)if(s[i]===this[0])return!0;return!1}return!1},index:function(){if(this[0]){for(var e=this[0],a=0;null!==(e=e.previousSibling);)1===e.nodeType&&a++;return a}},eq:function(a){if(void 0===a)return this;var t,s=this.length;return a>s-1?new e([]):a<0?(t=s+a,new e(t<0?[]:[this[t]])):new e([this[a]])},append:function(a){var t,s;for(t=0;t<this.length;t++)if("string"==typeof a){var i=document.createElement("div");for(i.innerHTML=a;i.firstChild;)this[t].appendChild(i.firstChild)}else if(a instanceof e)for(s=0;s<a.length;s++)this[t].appendChild(a[s]);else this[t].appendChild(a);return this},prepend:function(a){var t,s;for(t=0;t<this.length;t++)if("string"==typeof a){var i=document.createElement("div");for(i.innerHTML=a,s=i.childNodes.length-1;s>=0;s--)this[t].insertBefore(i.childNodes[s],this[t].childNodes[0])}else if(a instanceof e)for(s=0;s<a.length;s++)this[t].insertBefore(a[s],this[t].childNodes[0]);else this[t].insertBefore(a,this[t].childNodes[0]);return this},insertBefore:function(e){for(var t=a(e),s=0;s<this.length;s++)if(1===t.length)t[0].parentNode.insertBefore(this[s],t[0]);else if(t.length>1)for(var i=0;i<t.length;i++)t[i].parentNode.insertBefore(this[s].cloneNode(!0),t[i])},insertAfter:function(e){for(var t=a(e),s=0;s<this.length;s++)if(1===t.length)t[0].parentNode.insertBefore(this[s],t[0].nextSibling);else if(t.length>1)for(var i=0;i<t.length;i++)t[i].parentNode.insertBefore(this[s].cloneNode(!0),t[i].nextSibling)},next:function(t){return new e(this.length>0?t?this[0].nextElementSibling&&a(this[0].nextElementSibling).is(t)?[this[0].nextElementSibling]:[]:this[0].nextElementSibling?[this[0].nextElementSibling]:[]:[])},nextAll:function(t){var s=[],i=this[0];if(!i)return new e([]);for(;i.nextElementSibling;){var r=i.nextElementSibling;t?a(r).is(t)&&s.push(r):s.push(r),i=r}return new e(s)},prev:function(t){return new e(this.length>0?t?this[0].previousElementSibling&&a(this[0].previousElementSibling).is(t)?[this[0].previousElementSibling]:[]:this[0].previousElementSibling?[this[0].previousElementSibling]:[]:[])},prevAll:function(t){var s=[],i=this[0];if(!i)return new e([]);for(;i.previousElementSibling;){var r=i.previousElementSibling;t?a(r).is(t)&&s.push(r):s.push(r),i=r}return new e(s)},parent:function(e){for(var t=[],s=0;s<this.length;s++)e?a(this[s].parentNode).is(e)&&t.push(this[s].parentNode):t.push(this[s].parentNode);return a(a.unique(t))},parents:function(e){for(var t=[],s=0;s<this.length;s++)for(var i=this[s].parentNode;i;)e?a(i).is(e)&&t.push(i):t.push(i),i=i.parentNode;return a(a.unique(t))},find:function(a){for(var t=[],s=0;s<this.length;s++)for(var i=this[s].querySelectorAll(a),r=0;r<i.length;r++)t.push(i[r]);return new e(t)},children:function(t){for(var s=[],i=0;i<this.length;i++)for(var r=this[i].childNodes,n=0;n<r.length;n++)t?1===r[n].nodeType&&a(r[n]).is(t)&&s.push(r[n]):1===r[n].nodeType&&s.push(r[n]);return new e(a.unique(s))},remove:function(){for(var e=0;e<this.length;e++)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){var e,t,s=this;for(e=0;e<arguments.length;e++){var i=a(arguments[e]);for(t=0;t<i.length;t++)s[s.length]=i[t],s.length++}return s}},a.fn=e.prototype,a.unique=function(e){for(var a=[],t=0;t<e.length;t++)a.indexOf(e[t])===-1&&a.push(e[t]);return a},a}()),s=["jQuery","Zepto","Dom7"],i=0;i<s.length;i++)window[s[i]]&&function(e){e.fn.swiper=function(t){var s;return e(this).each(function(){var e=new a(this,t);s||(s=e)}),s}}(window[s[i]]);var r;r=void 0===t?window.Dom7||window.Zepto||window.jQuery:t,r&&("transitionEnd"in r.fn||(r.fn.transitionEnd=function(e){function a(r){if(r.target===this)for(e.call(this,r),t=0;t<s.length;t++)i.off(s[t],a)}var t,s=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],i=this;if(e)for(t=0;t<s.length;t++)i.on(s[t],a);return this}),"transform"in r.fn||(r.fn.transform=function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this}),"transition"in r.fn||(r.fn.transition=function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this}),"outerWidth"in r.fn||(r.fn.outerWidth=function(e){
return this.length>0?e?this[0].offsetWidth+parseFloat(this.css("margin-right"))+parseFloat(this.css("margin-left")):this[0].offsetWidth:null})),window.Swiper=a}(),"undefined"!=typeof module?module.exports=window.Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return window.Swiper});

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

