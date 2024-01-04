/* **********************************************************************************
 *  File Name      : kakaopayDlpServerTmsV2.min.js
 *  Description    : KaKaoPay DLP 창 Server TMS LayerPopup(PC) Ver 2.0
 *  Author         : 정명환 bkmatrix0@lgcns.com
 *  Date Created   : 2016.05.18
 ***********************************************************************************/
$(function() {
    easyXDM.DomHelper.requiresJSON(contextPath + kakaopayDlpServer.JSON_LIB_PATH);
    var c = new easyXDM.Rpc({
        local: contextPath + "/html/dlp/name.html"
    }, {
        local: {
            initDlp: function(f) {
                kakaopayDlpServer.kdebug("[Transport(Remote) : initDlp() Call]  : [param] : " + JSON.stringify(f));
                kakaopayDlpServer.initDlpCommon(f);
                var e = f.MOBILE_NUM;
                if (e !== undefined) {
                    var d = /^01[0,1,6,7,8,9]{1}[0-9]{3,4}[0-9]{4}$/;
                    e = kutil.replaceAll(e, "-", "");
                    if (d.test(e)) {
                        var g = $("#requestorTelNum");
                        g.val(e)
                    }
                }
            }
        },
        remote: {
            setKakaopayFormParam: {},
            closeDlp: {}
        }
    });
    kakaopayDlpServer.setTransport(c);
    $("#requestorTelNum, #requestorBirth").on("focusin", function(d) {
        $(this).parent().addClass("data_focus")
    });
    var b = false;
    var a = false;
    $("#requestorBirth, #requestorTelNum").on("keydown", function(d) {
        if (d.keyCode == 13) {
            $("#requestTmsPushBtn").trigger("click")
        }
    });
    $("#requestorTelNum").on("focusout", function() {
        var d = /^01[0,1,6,7,8,9]{1}[0-9]{3,4}[0-9]{4}$/;
        var e = $("#requestorTelNum");
        if (!d.test(e.val())) {
            kakaopayDlpServer.validateTelnumAlert(function() {});
            b = false;
            return
        }
        b = true;
        $(this).parent().removeClass("data_focus");
        if (a == false) {
            $("#requestorBirth").focus()
        }
    });
    $("#requestorBirth").on("focusout", function() {
        var e = /^[0-9]{2}[0,1]{1}[0-9]{1}[0-3]{1}[0-9]{1}$/;
        var d = $("#requestorBirth");
        if (!e.test(d.val())) {
            kakaopayDlpServer.validateBirthAlert(function() {});
            a = false;
            return
        }
        if (kutil.validateLeapYear(d.val())) {
            kakaopayDlpServer.validateBirthAlert(function() {});
            a = false;
            return
        }
        a = true;
        $(this).parent().removeClass("data_focus");
        if (b == false) {
            $("#requestorTelNum").focus()
        }
    });
    $("#requestTmsPushBtn").on("click", function() {
        var f = /^01[0,1,6,7,8,9]{1}[0-9]{3,4}[0-9]{4}$/;
        var e = /^[0-9]{2}[0,1]{1}[0-9]{1}[0-3]{1}[0-9]{1}$/;
        var g = $("#requestorTelNum");
        var d = $("#requestorBirth");
        if (!f.test(g.val())) {
            kakaopayDlpServer.validateTelnumAlert(function() {
                g.focus()
            });
            return
        }
        if (!e.test(d.val())) {
            kakaopayDlpServer.validateBirthAlert(function() {
                d.focus()
            });
            return
        }
        if (kutil.validateLeapYear(d.val())) {
            kakaopayDlpServer.validateBirthAlert(function() {
                d.focus()
            });
            return
        }
        $("#requestTmsPushBtn").attr("disabled", "disabled");
        $.blockUI({
            message: "<img src='" + contextPath + "/common/kakaopay/images/prgs.gif' alt='Loading'/>"
        });
        $("#MOBILE_NUM").val(g.val());
        $("#BIRTH").val(d.val());
        $.ajax({
            url: "/sample/kakaopaySamplePush.action",
            type: "POST",
            data: $("#dlpForm").serialize(),
            dataType: "json",
            async: true,
            success: function(k, l) {
                if (k.RESULT_CODE !== "00") {
                    $.unblockUI();
                    kakaopayDlpServer.kdebug("[Failure] /sample/kakaopaySamplePush.action : [PARAM] : " + JSON.stringify(k));
                    $("#requestTmsPushBtn").removeAttr("disabled");
                    kakaopayDlpServer.sendMessage(k.RESULT_CODE, k.RESULT_MSG)
                } else {
                    $.unblockUI();
                    kakaopayDlpServer.kdebug("[Success] /sample/kakaopaySamplePush.action : [PARAM] : " + JSON.stringify(k));
                    $(".formPage").addClass("hidden");
                    $(".resultPage").removeClass("hidden");
                    var i = kakaopayDlpServer.MAX_TIME.WPM.TMS;
                    var h = new Date();
                    var j = setInterval(function() {
                        var m = new Date();
                        var t = i - Math.round((m - h) / 1000);
                        var n = Math.floor(t / 60);
                        var s = Math.floor(n / 10);
                        var r = n - (s * 10);
                        var p = Math.round((t / 60 - n) * 60);
                        var q = Math.floor(p / 10);
                        var o = p - (q * 10);
                        t--;
                        if (t > 0) {
                            $("#validTime").text(" " + s + r + " : " + q + o + " ")
                        } else {
                            $("#validTime").text(" 00 : 00 ")
                        }
                        if (t < 0) {
                            clearInterval(j);
                            kakaopayDlpServer.closeDlp("KKP_SER_004")
                        }
                    }, kakaopayDlpServer.TIME_INTERVAL)
                }
            },
            error: function(i, j, h) {
                kakaopayDlpServer.kdebug("[Error] /sample/kakaopaySamplePush.action : [PARAM] : " + JSON.stringify(data));
                kakaopayDlpServer.alertAjaxCommonErr(i, j, h);
                $("#requestOrderBtn").removeAttr("disabled")
            }
        })
    });
    $("#requestOrderBtn").on("click", function() {
        $("#requestOrderBtn").attr("disabled", "disabled");
        $.ajax({
            url: "/sample/kakaopaySampleApprove.action",
            type: "POST",
            data: $("#dlpForm").serialize(),
            dataType: "json",
            async: false,
            success: function(e, f) {
                try {
                    if (e.RESULT_CODE !== "00") {
                        kakaopayDlpServer.kdebug("[Failure] /sample/kakaopaySampleApprove.action : [PARAM] : " + JSON.stringify(e));
                        $("#requestOrderBtn").removeAttr("disabled");
                        kakaopayDlpServer.sendMessage(e.RESULT_CODE, e.RESULT_MSG)
                    } else {
                        kakaopayDlpServer.kdebug("[Success] /sample/kakaopaySampleApprove.action : [PARAM] : " + JSON.stringify(e));
                        kakaopayDlpServer.sendToMerchantForSuccess($("#formName").val(), e)
                    }
                } catch (d) {} finally {}
            },
            error: function(e, f, d) {
                kakaopayDlpServer.kdebug("[Error] /sample/kakaopaySampleApprove.action : [PARAM] : " + JSON.stringify(e));
                kakaopayDlpServer.alertAjaxCommonErr(e, f, d);
                $("#requestOrderBtn").removeAttr("disabled")
            }
        })
    });
    $("#closeFirstBtn, #closeSecondBtn").on("click", function() {
        kakaopayDlpServer.closeDlpConfirm("KKP_SER_002")
    });
    $("#informHelpFirstBtn, #informHelpSecondBtn").on("click", function() {
        kakaopayDlpServer.informHelpAlert()
    })
});