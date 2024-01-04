(function(b) {
    var a = function(i, f) {
        var j = location.host,
            h = j.replace(/[\-.:]/g, "") + "kakaopayLibrary_LOG",
            d, g, l;
        if (/MSIE 6.0|MSIE 7.0|MSIE 8.0|MSIE 9.0/i.test(navigator.userAgent) && f) {
            try {
                d = b.open("", h, "width=1000,height=400,status=0,navigation=0,scrollbars=1")
            } catch (k) {}
            if (d) {
                l = d.document;
                g = l.getElementById("log");
                if (!g) {
                    l.write("<html><head><title>kakaopayLibrary log " + j + "</title></head>");
                    l.write('<body><div id="log"></div></body></html>');
                    l.close();
                    g = l.getElementById("log")
                }
            }
        }
        return function(p) {
            var n = new Date();
            var m = "[" + i + "] [" + location.host + "] TIME : [" + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds() + ":" + n.getMilliseconds() + "] = ";
            if (f) {
                if (/MSIE 6.0|MSIE 7.0|MSIE 8.0|MSIE 9.0/i.test(navigator.userAgent)) {
                    try {
                        g.appendChild(l.createElement("div")).appendChild(l.createTextNode(m + p));
                        g.scrollTop = g.scrollHeight
                    } catch (o) {}
                } else {
                    console[i](m + p)
                }
            }
        }
    };
    var c = function() {
        var d = b.kakaopayDlpNewConfig;
        b.kakaopayDlpNewConfig = null;
        var e = {};
        var f = {};
        d.kdebug = a.apply(a, d.debugMode);
        d.txnId = "";
        d.hashKey = "";
        d.$layer = "";
        d.$overlay = "";
        d.transport = "";
        d.requestParams = "";
        e.VERSION = "1.2";
        d.dlpCallBack = "";
        d.dummyPageInfo = {};
        d.transportDummy = "";
        d.getImageFlag = function() {
            this.kdebug("[Local Method : getImageFlag() Call]  : [param] : ");
            var g = navigator.userAgent;
            if (/MSIE 6.0|MSIE 7.0/i.test(g)) {
                return true
            } else {
                return false
            }
        };
        d.getCustomTargetLayerCssFlag = function() {
            this.kdebug("[Local Method : getCustomTargetLayerCssFlag() Call]  : [param] : ");
            return d.customTargetLayerCssFlag
        };
        d.callIOSApp = function() {
            this.kdebug("[Local Method : callIOSApp() Call]  : [param] : ");
            if (this.getChannelType() === "APP") {
                top.location = this.callAppUrl.IOSAppUrl + this.txnId + "&return_url=" + this.getReturnUrl() + "&cancel_url=" + this.getCancelUrl()
            } else {
                top.location = this.callAppUrl.IOSAppUrl + this.txnId
            }
        };
        d.callAndroidAppChrome = function() {
            this.kdebug("[Local Method : callAndroidAppChrome() Call]  : [param] : ");
            if (this.getChannelType() === "APP") {
                top.location = this.callAppUrl.AndroidIntentOne + this.txnId + "&return_url=" + this.getReturnUrl() + "&cancel_url=" + this.getCancelUrl() + this.callAppUrl.AndroidIntentTwo
            } else {
                top.location = this.callAppUrl.AndroidIntentOne + this.txnId + this.callAppUrl.AndroidIntentTwo
            }
        };
        d.callAndroidAppFireFox = function() {
            this.kdebug("[Local Method : callAndroidAppFireFox() Call]  : [param] : ");
            if (this.getChannelType() === "APP") {
                top.location = this.callAppUrl.AndroidAppUrl + this.txnId + "&return_url=" + this.getReturnUrl() + "&cancel_url=" + this.getCancelUrl()
            } else {
                top.location = this.callAppUrl.AndroidAppUrl + this.txnId
            }
            setTimeout(function() {
                top.location = d.callAppUrl.AndroidMarketUrl
            }, 1000)
        };
        d.callAndroidApp = function() {
            this.kdebug("[Local Method : callAndroidApp() Call]  : [param] : ");
            var g = document.createElement("iframe");
            g.style.border = "none";
            g.style.width = "1px";
            g.style.height = "1px";
            g.onload = function() {
                top.location = d.callAppUrl.AndroidMarketUrl
            };
            if (this.getChannelType() === "APP") {
                g.src = this.callAppUrl.AndroidAppUrl + this.txnId + "&return_url=" + this.getReturnUrl() + "&cancel_url=" + this.getCancelUrl()
            } else {
                g.src = this.callAppUrl.AndroidAppUrl + this.txnId
            }
            document.body.appendChild(g)
        };
        d.runApp = function(h) {
            this.kdebug("[Local Method : runApp() Call]  : [param] : " + h);
            var g = navigator.userAgent;
            if (h === "Android") {
                if (g.match(/Chrome/)) {
                    this.callAndroidAppChrome()
                } else {
                    if (g.match(/Firefox/)) {
                        this.callAndroidAppFireFox()
                    } else {
                        this.callAndroidApp()
                    }
                }
            } else {
                if (h === "IOS") {
                    this.callIOSApp()
                } else {
                    throw d.getMessage("KKP_CER_005")
                }
            }
        };
        d.getDeviceType = function() {
            this.kdebug("[Local Method : getDeviceType() Call]  : [param] : ");
            var g = navigator.userAgent;
            if (/iPad|iPhone|iPod/i.test(g)) {
                return "IOS"
            } else {
                if (/Android/i.test(g)) {
                    return "Android"
                }
            }
            return "Else"
        };
        d.getMessage = function(g) {
            this.kdebug("[Local Method : getMessage() Call]  : [param] : " + g);
            return this.message[g]
        };
        d.getCurrentDevicePrType = function() {
            this.kdebug("[Local Method : getCurrentDevicePrType() Call]  : [param] : ");
            var g = navigator.userAgent;
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows CE|LG|MOT|SAMSUNG|SonyEricsson/i.test(g)) {
                return "MPM"
            } else {
                return "WPM"
            }
        };
        d.checkBlackList = function() {
            this.kdebug("[Local Method : checkBlackList() Call]  : [param] : ");
            var j = navigator.userAgent;
            var i = this.blackList;
            for (var h = 0; h < i.length; h++) {
                var g = i[h];
                if (j.indexOf(g) > -1) {
                    return true
                }
            }
            return false
        };
        d.supportFixedBlacklist = function() {
            this.kdebug("[Local Method : supportFixedBlacklist() Call]  : [param] : ");
            var p = b;
            var h = navigator.userAgent;
            var j = navigator.platform;
            var o = h.match(/AppleWebKit\/([0-9]+)/);
            var n = !!o && o[1];
            var i = h.match(/Fennec\/([0-9]+)/);
            var l = !!i && i[1];
            var m = h.match(/Opera Mobi\/([0-9]+)/);
            var g = !!m && m[1];
            var k = false;
            if (((j.indexOf("iPhone") > -1 || j.indexOf("iPad") > -1 || j.indexOf("iPod") > -1) && n && n < 534) || (p.operamini && ({}).toString.call(p.operamini) === "[object OperaMini]") || (m && g < 7458) || (h.indexOf("Android") > -1 && n && n < 533) || (l && l < 6) || ("palmGetResource" in b && n && n < 534) || (h.indexOf("MeeGo") > -1 && h.indexOf("NokiaBrowser/8.5.0") > -1)) {
                k = true
            }
            return k
        };
        d.initOverlay = function() {
            this.kdebug("[Local Method : initOverlay() Call]  : [param] : ");
            var i = "";
            var l = 0;
            var k = 0;
            var j = "100%";
            var h = "100%";
            var g = $("<div>");
            g.addClass(this.overlayClassName);
            if (!this.supportFixedBlacklist()) {
                i = "fixed"
            } else {
                i = "absolute"
            }
            g.css({
                position: i,
                top: l,
                left: k,
                width: j,
                height: h,
                "z-index": this.zIndex,
                margin: 0,
                "box-sizing": "border-box"
            });
            return g
        };
        d.initLayer = function(v) {
            this.kdebug("[Local Method : initLayer() Call]  : [param] : " + v);
            var m = this.customTargetLayerCssFlag;
            var s = $("#" + v);
            var l = $(b);
            var p = $(document);
            var r = this.prType;
            var i = "";
            if (r === "WPM") {
                i = r + "_" + this.channelType[r]
            } else {
                i = r
            }
            if (!m) {
                var h = this.layerConfig[i].width;
                var u = this.layerConfig[i].height;
                var n = this.layerConfig[i].left;
                var t = this.layerConfig[i].top;
                var q = this.layerConfig[i].position;
                if (r === "WPM") {
                    var k = l.width();
                    var g = l.height();
                    var o = p.scrollLeft();
                    var j = p.scrollTop();
                    n = k / 2 - h / 2 + o;
                    t = g / 2 - u / 2 + j
                }
                s.css({
                    "z-index": this.zIndex,
                    position: q,
                    width: h,
                    height: u,
                    left: n,
                    top: t
                });
                s.attr("tabindex", 0)
            }
            s.show();
            return s
        };
        d.connectTransportWinPop = function(r) {
            this.kdebug("[Local Method : connectTransportWinPop() Call]  : [param] : " + r);
            var n = $(document);
            var h = "";
            if (this.prType === "WPM") {
                h = this.prType + "_" + this.channelType[this.prType]
            } else {
                h = this.prType
            }
            var q = this.layerConfig[h].width;
            var o = this.layerConfig[h].height;
            var i = b.screen.width;
            var g = b.screen.height;
            var k = i / 2 - q / 2;
            var p = g / 2 - o / 2;
            var j = this.transportConfig;
            var s = j[this.prType + "_IE6"];
            easyXDM.DomHelper.requiresJSON(j.JSON);
            var l = new easyXDM.Rpc({
                local: s.nameFile,
/*                remote: s.hostUrl + s.targetFile,*/
                remote: s.targetFile,
                remoteHelper: s.hostUrl + s.nameFile,
                channel: "dlp"
            }, {
                remote: {
                    open: {},
                    initDlp: {}
                },
                local: {
                    setKakaopayFormParam: function(v) {
                        d.kdebug("[Transport(Local) : setKakaopayFormParam() Call]  : [param] : " + JSON.stringify(v));
                        var t = $(document[v.formName]);
                        for (var u in v) {
                            t.find("input[name=" + u + "]").val(v[u])
                        }
                        if ($.isFunction(d.dlpCallBack)) {
                            d.dlpCallBack(v)
                        }
                    },
                    closeDlp: function() {
                        d.kdebug("[Transport(Local) : closeDlp() Call]  : [param] : ");
                        this.kakaopayDlpNew.closeDlpWin()
                    }
                }
            });
            var m = {
                formName: r,
                popupType: "winPopup",
                txnId: this.txnId,
                hashKey : this.hashKey,
                prType: this.prType,
                targetUrl: s.targetUrl,
                imageFlag: this.getImageFlag(),
                closeBtn: false,
                channelType: this.channelType[this.prType]
            };
            l.open("mainapp", m, k, p, q, o);
            this.transport = l
        };
        d.connectTransport = function(g, j) {
            this.kdebug("[Local Method : connectTransport() Call]  : [param] : " + g + " : " + j);
            try {
                var i = this.transportConfig;
                var h = i[this.prType];
                easyXDM.DomHelper.requiresJSON(i.JSON);
                var l = new easyXDM.Rpc({
                    local: h.nameFile,
 /*                   remote: h.hostUrl + h.targetFile,*/
                    remote: h.targetFile,
                    remoteHelper: h.hostUrl + h.nameFile,
                    container: g,
                    props: {
                        style: {
                            width: "0px",
                            height: "0px"
                        }
                    },
                    usePost: {
                        formName: j,
                        popupType: "layerPopup",
                        tid: this.txnId,
                        hashKey : this.hashKey,
                        PR_TYPE: this.prType,
                        imageFlag: this.getImageFlag(),
                        channelType: this.channelType[this.prType]
                    },
                    channel: "dlp",
                    onReady: function() {
                        d.kdebug("[Method : transport.onReady() Call]  : [param] :");
                        var m = "";
                        if (d.prType === "WPM") {
                            m = d.prType + "_" + d.channelType[d.prType]
                        } else {
                            m = d.prType
                        }
                        $("#easyXDM_dlp_provider").css({
                            width: d.layerConfig[m].width,
                            height: d.layerConfig[m].height
                        });
                        if (d.prType === "MPM") {
                            var n = d.getDeviceType();
                            if (n === "Else") {
                                throw d.getMessage("KKP_CER_005")
                            }
                            d.runApp(n)
                        }
                    }
                }, {
                    remote: {
                        initDlp: {},
                        getAuthInfo: {},
                        closeServerDlp: {},
                        callApp: {}
                    },
                    local: {
                        setKakaopayFormParam: function(o) {
                            d.kdebug("[Transport(Local) : setKakaopayFormParam() Call]  : [param] : " + JSON.stringify(o));
                            var m = $(document[o.formName]);
                            for (var n in o) {
                                m.find("input[name=" + n + "]").val(o[n])
                            }
                            if ($.isFunction(d.dlpCallBack)) {
                                d.dlpCallBack(o)
                            }
                        },
                        closeDlp: function() {
                            d.kdebug("[Transport(Local) : closeDlp() Call]  : [param] : ");
                            this.kakaopayDlpNew.closeDlp()
                        }
                    }
                });
                this.transport = l
            } catch (k) {
                throw this.getMessage("KKP_CER_001")
            }
        };
        d.kakaopayDlpInit = function() {
            this.kdebug("[Local Method : kakaopayDlpInit() Call]  : [param] : ");
            if (this.overlayFlag && this.$overlay !== "") {
                this.$overlay.remove()
            }
            if (this.transport !== "") {
                this.transport.destroy()
            }
            if (this.transportDummy !== "") {
                this.transportDummy.destroy()
            }
            this.transportDummy = "";
            this.$layer = "";
            this.$overlay = "";
            this.transport = "";
            this.hashKey = "";
            this.txnId = "";
        };
        d.getHashKey = function() {
            this.kdebug("[Local Method : getHashKey() Call]  : [param] : ");
            return this.hashKey
        };
        d.getTxnId = function() {
            this.kdebug("[Local Method : getTxnId() Call]  : [param] : ");
            return this.txnId
        };
        d.getPrType = function() {
            this.kdebug("[Local Method : getPrType() Call]  : [param] : ");
            return this.prType
        };
        d.getTransport = function() {
            this.kdebug("[Local Method : getTransport() Call]  : [param] : ");
            return this.transport
        };
        d.getOverlayFlag = function() {
            this.kdebug("[Local Method : getOverlayFlag() Call]  : [param] : ");
            return this.overlayFlag
        };
        d.getCloseBtn = function() {
            d.kdebug("[Local Method : getCloseBtn() Call]  : [param] : ");
            return this.closeBtn[this.prType]
        };
        d.validateParams = function(g, j, i) {
            this.kdebug("[Local Method : validateParams() Call]  : [param] : " + g + " : " + j + " : " + i);
            var h = document.getElementById(g);
            if (!h) {
                throw this.getMessage("KKP_CER_008")
            }
            if (!j) {
                throw this.getMessage("KKP_CER_009")
            }
            if (!$.isFunction(i)) {
                throw this.getMessage("KKP_CER_010")
            }
        };
        d.validation = function() {
            this.kdebug("[Local Method : validation() Call]  : [param] : ");
            if (this.checkBlackList()) {
                throw this.getMessage("KKP_CER_005")
            }
            if (/MSIE 6.0/i.test(navigator.userAgent)) {
                throw this.getMessage("KKP_CER_003")
            }
            var h = this.overlayFlag;
            if (h !== false && h !== true) {
                throw this.getMessage("KKP_CER_007")
            }
            var g = this.customTargetLayerCssFlag;
            if (g !== false && g !== true) {
                throw this.getMessage("KKP_CER_006")
            }
            var l = this.txnId;
            if (!l || "" === l) {
                throw this.getMessage("KKP_CER_004")
            }
            var j = this.prType;
            if (j !== "WPM" && j !== "MPM") {
                throw this.getMessage("KKP_CER_002")
            }
            var k = this.closeBtn[this.prType];
            if (k !== false && k !== true) {
                throw this.getMessage("KKP_CER_011")
            }
            if (this.prType === "WPM") {
                var i = this.channelType[this.prType];
                if (i !== "QR" && i !== "TMS") {
                    throw this.getMessage("KKP_CER_012")
                }
            } else {
                if (this.prType === "MPM") {
                    var i = this.channelType[this.prType];
                    if (i === "APP") {
                        if (this.returnUrl === "") {
                            throw this.getMessage("KKP_CER_016")
                        } else {
                            if (this.cancelUrl === "") {
                                this.cancelUrl = this.returnUrl
                            }
                        }
                    } else {
                        this.channelType[this.prType] = "WEB"
                    }
                }
            }
            if (this.userAgentMode !== false && this.userAgentMode !== true) {
                throw this.getMessage("KKP_CER_014")
            }
        };
        d.getChannelType = function() {
            this.kdebug("[Local Method : getChannelType() Call]  : [param] : ");
            return this.channelType[this.prType]
        };
        d.getReturnUrl = function() {
            this.kdebug("[Local Method : getReturnUrl() Call]  : [param] : ");
            return this.returnUrl
        };
        d.getCancelUrl = function() {
            this.kdebug("[Local Method : getCancelUrl()  Call] : [param] : ");
            return this.cancelUrl
        };
        d.getDummyPageFlag = function() {
            this.kdebug("[Local Method : getDummyPageFlag()  Call] : [param] : ");
            return this.dummyPageFlag
        };
        d.connectTransportDummyPage = function(g) {
            this.kdebug("[Local Method : connectTransportDummyPage()  Call] : [param] : " + g);
            try {
                var j = d.transportConfig;
                var i = j[d.prType];
                easyXDM.DomHelper.requiresJSON(j.JSON);
                var h = new easyXDM.Rpc({
                    local: i.nameFile,
                    remote: i.hostUrl + i.dummyFile,
                    remoteHelper: i.hostUrl + i.nameFile,
                    container: g,
                    props: {
                        style: {
                            width: "0px",
                            height: "0px"
                        }
                    },
                    usePost: {},
                    channel: "dummy",
                    onReady: function() {
                        d.kdebug("[Method : transportDummy.onReady() Call]  : [param] :");
                        $("#easyXDM_dummy_provider").css({
                            width: d.layerConfig[d.prType].width,
                            height: d.layerConfig[d.prType].height
                        })
                    }
                }, {
                    remote: {},
                    local: {
                        callDlp: function() {
                            d.kdebug("[Transport(Local) : callDlp() Call]  : [param] : ");
                            d.$layer.empty();
                            d.callDlp(d.dummyPageInfo.divContainer, d.dummyPageInfo.targetForm, d.dummyPageInfo.callbackDlp)
                        },
                        setKakaopayFormParam: function(n) {
                            d.kdebug("[Transport(Local) : setKakaopayFormParam() Call]  : [param] : " + JSON.stringify(n));
                            var l = $(document[n.formName]);
                            for (var m in n) {
                                l.find("input[name=" + m + "]").val(n[m])
                            }
                            if ($.isFunction(d.dummyPageInfo.callbackDlp)) {
                                d.dummyPageInfo.callbackDlp(n)
                            }
                        },
                        closeDlp: function() {
                            d.kdebug("[Transport(Local) : closeDlp() Call]  : [param] : ");
                            this.kakaopayDlpNew.closeDlp()
                        }
                    }
                });
                this.transportDummy = h
            } catch (k) {
                alert(k)
            }
        };
        d.callDlp = function(p, l, n) {
            this.kdebug("[Local Method : callDlp() Call]  : [param] : " + p + " : " + l + " : " + n);
            try {
                var k = this.getOverlayFlag();
                if ($.isEmptyObject(this.$overlay) || "" === this.$overlay) {
                    if (k) {
                        this.$overlay = this.initOverlay();
                        $("body").prepend(this.$overlay)
                    }
                }
                var g = this.getCustomTargetLayerCssFlag();
                if ($.isEmptyObject(this.$layer) || "" === this.$layer) {
                    if (!/MSIE 6.0/i.test(navigator.userAgent) || g) {
                        this.$layer = this.initLayer(p)
                    }
                }
                var o = l.name;
                this.dlpCallBack = n;
                if ($.isEmptyObject(this.transport) || "" === this.transport) {
                    var m = "";
                    if (/MSIE 6.0/i.test(navigator.userAgent) && !g) {
                        this.connectTransportWinPop(o);
                        m = false
                    } else {
                        this.connectTransport(p, o);
                        m = this.getCloseBtn()
                    }
                    var h = this.getTransport();
                    var j = {
                        tid: this.getTxnId(),
                        hashKey: this.getHashKey(),
                        closeBtn: m,
                        channelType: this.getChannelType(),
                        returnUrl: this.getReturnUrl(),
                        cancelUrl: this.getCancelUrl()
                    };
                    $.extend(true, j, $.extend(true, {}, this.requestParams, j));
                    h.initDlp(j)
                }
            } catch (i) {
                alert(i)
            }
        };
        e.setOverlayFlag = function(g) {
            d.kdebug("[Local Method : setOverlayFlag() Call]  : [param] : " + g);
            d.overlayFlag = g;
            return this
        };
        e.setCustomTargetLayerCssFlag = function(g) {
            d.kdebug("[Local Method : setCustomTargetLayerCssFlag() Call]  : [param] : " + g);
            d.customTargetLayerCssFlag = g;
            return this
        };
        e.setPrType = function(g) {
            d.kdebug("[Local Method : setPrType() Call]  : [param] : " + g);
            d.prType = g;
            return this
        };
        e.setHashKey = function(g) {
            d.kdebug("[Local Method : setHashKey() Call]  : [param] : " + g);
            d.hashKey = g;
            return this
        };
        e.setTxnId = function(g) {
            d.kdebug("[Local Method : setTxnId() Call]  : [param] : " + g);
            d.txnId = g;
            return this
        };
        f.setCloseBtn = function(g, h) {
            d.kdebug("[Local Method : setCloseBtn() Call]  : [param] : " + g + " : " + h);
            d.closeBtn[g] = h;
            return this
        };
        e.setChannelType = function(h, g) {
            d.kdebug("[Local Method : setChannelType() Call]  : [param] : " + h + " : " + g);
            d.channelType[h] = g;
            return this
        };
        e.addRequestParams = function(g) {
            d.kdebug("[Local Method : addRequestParams() Call]  : [param] : " + JSON.stringify(g));
            d.requestParams = g;
            return this
        };
        e.setUserAgentMode = function(g) {
            d.kdebug("[Local Method : setUserAgentMode() Call]  : [param] : " + g);
            d.userAgentMode = g;
            return this
        };
        e.callDlp = function(g, j, i) {
            d.kdebug("[Local Method : callDlp() Call]  : [param] : " + g + " : " + j + " : " + i);
            d.validateParams(g, j, i);
            if (d.userAgentMode) {
                this.setPrType(d.getCurrentDevicePrType())
            }
            d.validation();
            var h = d.getPrType();
            if (h === "MPM" && d.getDummyPageFlag()) {
                d.dummyPageInfo.divContainer = g;
                d.dummyPageInfo.targetForm = j;
                d.dummyPageInfo.callbackDlp = i;
                d.$layer = d.initLayer(g);
                d.connectTransportDummyPage(g)
            } else {
                if (h === "MPM" || h === "WPM") {
                    d.callDlp(g, j, i)
                }
            }
            return this
        };
        e.closeDlp = function() {
            d.kdebug("[Local Method : closeDlp() Call]  : [param] : ");
            if (d.$layer !== "") {
                if (!d.getCustomTargetLayerCssFlag()) {
                    d.$layer.removeAttr("style")
                }
                d.$layer.removeAttr("tabindex");
                d.$layer.hide()
            }
            d.kakaopayDlpInit();
            d.dlpCallBack = "";
            return this
        };
        e.closeDlpWin = function() {
            d.kdebug("[Local Method : closeDlpWin() Call]  : [param] : ");
            d.kakaopayDlpInit();
            d.dlpCallBack = "";
            return this
        };
        e.getAuthInfo = function() {
            d.kdebug("[Local Method : getAuthInfo() Call]  : [param] : ");
            if (d.getPrType() === "MPM") {
                var g = d.getTransport();
                if (g !== "") {
                    g.getAuthInfo()
                }
            }
            return this
        };
        e.setReturnUrl = function(h) {
            d.kdebug("[Local Method : setReturnUrl() Call]  : [param] : " + h);
            var g = d.getPrType();
            if (g === "MPM" && d.getChannelType(g) === "APP") {
                d.returnUrl = h
            }
            return this
        };
        e.setCancelUrl = function(h) {
            d.kdebug("[Local Method : setCancelUrl() Call]  : [param] : " + h);
            var g = d.getPrType();
            if (g === "MPM" && d.getChannelType(g) === "APP") {
                d.cancelUrl = h
            }
            return this
        };
        e.closeServerDlp = function() {
            d.kdebug("[Local Method : closeServerDlp() Call]  : [param] : ");
            if (d.getPrType() === "MPM") {
                var g = d.getTransport();
                if (g !== "") {
                    g.closeServerDlp()
                }
            }
            return this
        };
        e.callApp = function() {
            d.kdebug("[Local Method : callApp() Call]  : [param] : ");
            if (d.getPrType() === "MPM") {
                var g = d.getTransport();
                if (g !== "") {
                    g.callApp()
                }
            }
            return this
        };
        e.setDummyPageFlag = function(g) {
            d.kdebug("[Local Method : setDummyPageFlag() Call]  : [param] : " + g);
            d.dummyPageFlag = g;
            return this
        };
        return e
    };
    if (typeof b.kakaopayDlpNew === "undefined") {
        b.kakaopayDlpNew = new c()
    }
})(window);