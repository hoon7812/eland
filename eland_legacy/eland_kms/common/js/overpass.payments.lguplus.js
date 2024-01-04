;(function ($) {
    var lguplus_van_cd = "90";
    var _pay = null;
    var ord_pay = null;
    var form;
    var CST_PLATFORM = '';
    var LGD_WINDOW_TYPE = '';
    var paymeans = {
        "11": "SC0010",	//신용카드
        "12": "SC0030",	//계좌이체
        "13": "SC0040",	//무통장
        "14": "SC0060"	//휴대폰
    };

    ORDER.payments.lguplus = {
        call: function(pay) {
            _pay = pay;

            var data = {
                pay_amt: pay.pay_amt, //금액
                disp_goods_nm: pay.disp_goods_nm, //상품명
                app_cd: elandmall.global.app_cd // retAppScheme scheme값을 위한 현재 기종판별 값
            };

            ord_pay = ORDER.pay.ord_pays[pay.pay_seq];

            ORDER.payments.getMers({
                pay_mean_cd: pay.pay_mean_cd,
                van_cd: lguplus_van_cd,
                ticket : pay.ticket,
                isbn_use_yn : pay.isbn_use_yn,
                pay_amt: pay.pay_amt,
                callback: function(mers) {
                    ORDER.payments.lguplus.requestCert({
                        pay: pay,
                        mers: mers
                    });
                }
            });
        },
        requestCert: function(p) {
            var mobile = elandmall.global.chnl_cd == 30 || elandmall.global.chnl_cd == 40;
            var pay = p.pay;
            var mers = p.mers;
            var mers_no = mers.mers_no;
            var pay_amt = pay.pay_amt;
            var pay_mean_cd = pay.pay_mean_cd;
            var bank = pay.bank;
            var pay_no = mers.pay_no;
            var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
            var form_id = "_LGUPLUS_FORM_";
            var LGD_SELF_CUSTOM = pay_mean_cd == "11" ? "Y" : "N";
            LGD_WINDOW_TYPE = mobile === true ? "submit" : "iframe" ; //PCWEB은 iframe, 모바일의 경우 submit으로 페이지이동
            var LGD_OSTYPE_CHECK = mobile === true ? "M" : "P" ; //PC용 또는 모바일용 결제모듈 체크
            var LGD_CUSTOM_SWITCHINGTYPE = mobile === true ? "SUBMIT" : "IFRAME" ;
            var LGD_HASHDATA = mers.LGD_HASHDATA;
            CST_PLATFORM = mers.LGD_PLATFORM;
            var LGD_TIMESTAMP = mers.LGD_TIMESTAMP;
            var LGD_PRODUCTINFO = pay.disp_goods_nm;
            var LGD_BUYEREMAIL = pay.email;
            var LGD_BUYER = pay.orderer_nm;
            var LGD_CARDTYPE = pay.cardcomp != undefined ? pay.cardcomp.lgd_card_code : "";

            ord_pay.pay_no = pay_no;

            ORDER.payments.lguplus.submit = undefined;
            delete ORDER.payments.lguplus.submit;

            $("#" + form_id).remove();
            form = ORDER.payments.createForm({
                id: form_id,
                name: form_id,
                method: "post"
            });

            form.addInput({ name: "CST_PLATFORM", value: CST_PLATFORM });
            form.addInput({ name: "CST_MID", value: mers_no });
            form.addInput({ name: "LGD_WINDOW_TYPE", value: LGD_WINDOW_TYPE });
            form.addInput({ name: "LGD_MID", value: mers_no });
            form.addInput({ name: "LGD_OID", value: pay_no });
            form.addInput({ name: "LGD_BUYER", value: LGD_BUYER });
            form.addInput({ name: "LGD_PRODUCTINFO", value: LGD_PRODUCTINFO });
            form.addInput({ name: "LGD_AMOUNT", value: pay_amt });
            form.addInput({ name: "LGD_BUYEREMAIL", value: LGD_BUYEREMAIL });
            form.addInput({ name: "LGD_CUSTOM_SKIN", value: "red" });
            form.addInput({ name: "LGD_CUSTOM_PROCESSTYPE", value: "TWOTR" });
            form.addInput({ name: "LGD_TIMESTAMP", value: LGD_TIMESTAMP });

            var installment = $('#select_credit_card_installment').val();
            if(installment == null || installment == '') {
                installment = '0';
            }
            form.addInput({ name: "LGD_INSTALLRANGE", value: installment });
            // form.addInput({ name: "LGD_INSTALLRANGE", value: '0:1:2:3:4:5:6:7:8:9:10:11:12' });

            /** 중요 */
            form.addInput({ name: "LGD_HASHDATA", value: LGD_HASHDATA });
            /** 중요 */

            //카드사 코드 매핑
            var van_cardcomp_no = '';
            var select_credit_card = $('#select_credit_card').val() || $('#view_card_cd').val();
            $.each(ORDER.cardvan.vanCardcompList, function(key, object){
                if(object.cardcomp_no === select_credit_card) {
                    van_cardcomp_no = object.van_cardcomp_no;
                    return false;
                }
            });

            form.addInput({ name: "LGD_USABLECARD", value: van_cardcomp_no });// 신용카드 노출 제어
            form.addInput({ name: "LGD_CUSTOM_USABLEPAY", value: paymeans[pay_mean_cd] });
            form.addInput({ name: "LGD_CUSTOM_SWITCHINGTYPE", value: LGD_CUSTOM_SWITCHINGTYPE });
            form.addInput({ name: "LGD_WINDOW_VER", value: "2.5" });
            form.addInput({ name: "LGD_OSTYPE_CHECK", value: LGD_OSTYPE_CHECK });
            form.addInput({ name: "LGD_VERSION", value: "JSP_Non-ActiveX_Standard" });
            form.addInput({ name: "LGD_DOMAIN_URL", value: "xpayvvip" });
            form.addInput({ name: "LGD_PAYKEY", value: "" });
            form.addInput({ name: "LGD_RESPCODE", value: "" });
            form.addInput({ name: "LGD_RESPMSG", value: "" });
            form.addInput({ name: "LGD_ENCODING", value: "UTF-8" });
            form.addInput({ name: "LGD_ENCODING_RETURNURL", value: "UTF-8" });

            // form.addInput({ name: "LGD_SELF_CUSTOM", value: LGD_SELF_CUSTOM });
            // form.addInput({ name: "LGD_CARDTYPE", value: LGD_CARDTYPE });
            // form.addInput({ name: "LGD_NOINT", value: "0" });
            // form.addInput({ name: "LGD_POINTUSE", value: "N" });
            // form.addInput({ name: "LGD_INSTALL", value: "00" });
            // form.addInput({ name: "LGD_SP_CHAIN_CODE", value: "0" });
            // form.addInput({ name: "LGD_CURRENCY", value: "410" });
            // form.addInput({ name: "LGD_SP_ORDER_USER_ID", value: "" });

            if (pay_mean_cd == "13") {
                form.addInput({ name: "LGD_CLOSEDATE", value: bank.expiry_date + "235959", });

                // 가상계좌(무통장) 결제 연동을 하시는 경우 아래 LGD_CASNOTEURL 을 설정하여 주시기 바랍니다.
                form.addInput({ name: "LGD_CASNOTEURL", value: "http://상점URL/cas_noteurl.jsp" });
            } else {
                form.addInput({ name: "LGD_CLOSEDATE", value: "", });
            }

            if (mobile === true) {	//모바일의 경우 아래값 추가 셋팅
                // ISP 앱에서 인증/인증 취소 진행 시, 동작 방식을 설정 합니다
                // A: ISP 처리(안드로이드), N: ISP 동기 결제처리(iOS Web-to-Web)
                var lgd_kvpmispautoappyn = '';
                if(elandmall.global.app_cd == "Android" || elandmall.global.apptype == "ANDROID") {
                    lgd_kvpmispautoappyn = 'A';
                } else if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS") {
                    lgd_kvpmispautoappyn = 'N';
                }
                console.log('lguplus app cd :: ', lgd_kvpmispautoappyn);
                form.addInput({ name: "LGD_KVPMISPAUTOAPPYN", value: lgd_kvpmispautoappyn });

                // ISP 승인완료 화면처리 URL (ISP 인증 신용카드 사용시 필수)
                form.addInput({ name: "LGD_KVPMISPWAPURL", value: '' });

                // ISP 결제취소 결과화면 URL (ISP 인증 신용카드 사용시 필수)
                form.addInput({ name: "LGD_KVPMISPCANCELURL", value: '' });

                /*
                    롯데앱카드 결제 이후 고객사 앱 호출 스키마 설정
                    IOS 환경의 고객사 APP에서 결제시 필수
                    iOS의 경우 결제 이후 고객사 앱으로 자동리턴이 되지 않으므로 이 파라미터를 적용
                */

                ord_pay["_payments_"] = $.extend({}, { appr_van_cd: lguplus_van_cd, LGD_CLOSEDATE: form.form.LGD_CLOSEDATE.value, lguplus: true });
                ORDER.payments.payNext(pay.next);

                //"LGD_MTRANSFERAUTOAPPYN": app_cd == "20" ? "N" : "A",		//계좌이체 앱에서 인증/인증취소 진행 시, 동작 방식을 설정 합니다
                //"LGD_MTRANSFERWAPURL": scheme,			//계좌이체 승인 완료 후 사용자에게 보여 지는 승인 완료 URL
                //"LGD_MTRANSFERCANCELURL": scheme		//계좌이체 시 앱에서 취소 시 사용자에게 보여 지는 취소 URL
            } else {
                form.addInput({ name: "LGD_RETURNURL", value: location.protocol + "//" + location.host + "/order/ReturnLGUPlus.action" });
                form.appendBody();
                openXpay(form.form, CST_PLATFORM, LGD_WINDOW_TYPE);
            }
        },
        open: function(returnUrl) {
            if(returnUrl === '') {
                returnUrl = location.protocol + "//" + location.host + "/order/registOrder.action";
            }

            form.addInput({ name: "LGD_MPILOTTEAPPCARDWAPURL", value: returnUrl });
            form.addInput({ name: "LGD_RETURNURL", value: returnUrl });
            form.appendBody();
            open_paymentwindow(form.form, CST_PLATFORM, LGD_WINDOW_TYPE);
        },
        returnCallback : function(data){
            $.extend(_pay, data);

            if (data.resultCode == "0000") {
                ord_pay["_payments_"] = {
                    appr_van_cd		: lguplus_van_cd,
                    orderer_nm   	: _pay.orderer_nm,
                    email			: _pay.email,
                    disp_goods_nm	: _pay.disp_goods_nm,
                    lgd_paykey 		: _pay.paykey,
                    lgd_respcode 	: data.resultCode,
                    lgd_respmsg 	: data.returnMsg,
                    pay_no		    : ord_pay.pay_no
                };

                ORDER.payments.payNext(_pay.next);
            } else{
                var returnMsg = data.returnMsg === '' ? '결제가 취소되었습니다.': data.returnMsg;
                ORDER.payments.throwError(returnMsg);
            }

            closeIframe();
        }
    };
})(jQuery);