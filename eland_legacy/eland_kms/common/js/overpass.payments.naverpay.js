;(function ($) {
    var naverpay_van_cd = "80";
    var naverpay_product_count = 0;
    var _pay = null;
    var ord_pay = null;
    var oPay;
    ORDER.payments.naverpay = {
        call: function(pay) {
            console.log('ORDER.payments.naverpay.call pay data :::: ', pay);

            _pay = pay;

            $.ajax({
                url: location.protocol +"//" + location.host + "/overpass-payments/naver/naverPayPayments.action",
                type: "POST",
                dataType: "json",
                data: {},
                success: function(data) {
                    console.log('ORDER.payments.naverpay.call ajax result data :::: ', data);

                    ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
                    ord_pay.pay_no = data.pay_no;

                    // 네이버페이는 100원보다 작다면 결제가 되지말아야한다
                    if(_pay.pay_amt < 100) {
                        ORDER.payments.throwError('네이버페이 결제는 결제금액 100원 이상부터 가능합니다');
                        return;
                    }

                    // openType 설정
                    console.log('ORDER.payments.naverpay.call elandmall.global.app_cd :::: ', elandmall.global.app_cd);
                    var openType = 'popup';
                    if(pay.cardcomp.mobile) {
                        openType = 'page';
                    }

                    oPay = Naver.Pay.create({
                        "mode" : data.mode, // development or production
                        "payType" : "normal", // normal or recurrent, 간편 or 정기 선택인데 간편으로 고정
                        "openType" : openType, // PC는 팝업, 모바일은 page가 되도록
                        "clientId": data.clientId,
                        "onAuthorize" : function(oData) {
                            /*
                            팝업 타입을 설정하고, onAuthorize callback function 을 설정하여 결과를 callback function 으로 전달 받을 수 있도록 지원합니다.
                            onAuthorize callback function 을 설정하지 않은 경우는 returnUrl 로 참조 정보와 함께 redirect 됩니다.
                            oData 객체에는 결제 인증 결과와 전달한 returnUrl 정보가 함께 전달되며,
                            이 정보는 이후 승인 요청 처리를 위한 정보 (resultCode, resultMessage, returnUrl, paymentId, reserveId 등) 입니다.
                            전달되는 값은 https://developer.pay.naver.com/docs/v2/api#payments-payments_window 의 성공 & 실패 응답 값을 참조해주세요.
                            */
                            if(oData.resultCode === "Success") {
                                // 네이버페이 결제 승인 요청 처리
                                ord_pay["_payments_"] = {
                                    appr_van_cd		: naverpay_van_cd,
                                    orderer_nm   	: _pay.orderer_nm,
                                    email			: _pay.email,
                                    disp_goods_nm	: _pay.disp_goods_nm,
                                    paymentId 		: oData.paymentId,
                                    order_no		: _pay.orderNo
                                };

                                ORDER.payments.payNext(_pay.next);
                            } else {
                                var msg = '';
                                if(oData.resultMessage === "userCancel"){
                                    msg = "결제를 취소하셨습니다. 주문 내용 확인 후 다시 결제해주세요.";
                                } else if(oData.resultMessage === "OwnerAuthFail"){
                                    msg = "타인 명의 카드는 결제가 불가능합니다. 회원 본인 명의의 카드로 결제해주세요.";
                                } else if(oData.resultMessage === "paymentTimeExpire"){
                                    msg = "결제 가능한 시간이 지났습니다. 주문 내용 확인 후 다시 결제해주세요.";
                                }

                                // 필요 시 oData.resultMessage 에 따라 적절한 사용자 안내 처리
                                var returnMsg = msg === '' ? '결제가 취소되었습니다.': msg;
                                ORDER.payments.throwError(returnMsg);
                            }
                        }
                    });

                    /**
                        상품 단품 데이터
                        categoryType String  10바이트  필수  결제 상품 유형
                        categoryId   String  16바이트  필수  결제 상품 유형
                        uid          String  100바이트 필수  결제 상품 유형
                        name         String  128자    필수  상품명
                        payReferrer  String  20바이트  선택  결제 상품 유형.
                        startDate    String           선택  시작일(yyyyMMdd). 예: 20160701 결제 상품이 공연, 영화, 보험, 여행, 항공, 숙박인 경우 입력을 권장합니다. ( 숫자 허용 )
                        endDate      String           선택  종료일(yyyyMMdd). 예: 20160701 결제 상품이 공연, 영화, 보험, 여행, 항공, 숙박인 경우 입력을 권장합니다. ( 숫자 허용 )
                        sellerId     String  30바이트  선택  가맹점에서 하위 판매자를 식별하기 위해 사용하는 식별키를 전달 합니다. ( 영대소문자 및 숫자 허용 )
                        count        Number           필수    결제 상품 개수. 기본값은 1입니다. ( 최대 999999 )
                    **/
                    var productItems = [];
                    naverpay_product_count = 0;
                    $.each(pay.ord_goods, function() {
                        naverpay_product_count += this.ord_qty;

                        var categoryId = '';
                        if(this.goods_type_cd === '21') { // 디지털 컨텐츠
                            categoryId = 'DIGITAL_CONTENT';
                        } else { // 일반
                            categoryId = 'GENERAL';
                        }

                        var tempVo = {
                            "categoryType": "PRODUCT",
                            "categoryId" : categoryId,
                            "uid" : this.goods_no,
                            "name" : this.disp_goods_nm,
                            "count" : this.ord_qty
                        }

                        productItems.push(tempVo);
                    });

                    // open에서 사용할 파라미터 세팅
                    var returnUrl = location.protocol + "//" + location.host;
                    if(pay.cardcomp.mobile) {
                        returnUrl += "/order/registOrder.action";
                    } else {
                        returnUrl += "/order/ReturnNaverPay.action";
                    }

                    $.extend(_pay, {
                        pay_no: data.pay_no,
                        returnUrl: returnUrl,
                        productItems: productItems
                    });

                    if(openType === 'popup') {
                        ORDER.payments.naverpay.open();
                    } else {
                        $.extend(ORDER.pay.ord_pays[pay.pay_seq], {
                            _payments_: {
                                naverpay: true,
                                mobile: true,
                                appr_van_cd: naverpay_van_cd
                            }
                        });
                        ORDER.payments.payNext(pay.next);
                    }
                },
                error: function(message) {
                    ORDER.payments.throwError("네이버페이 결제 생성이 실패하였습니다.");
                }
            });
        },
        open: function() {
            /**
             * 네이버페이 팝업창 open
             * */
            oPay.open({ // Pay Reserve Parameters를 참고 바랍니다.
                "merchantPayKey": _pay.pay_no,
                "productName": _pay.naverpay_disp_goods_nm,
                "productCount": naverpay_product_count,
                "totalPayAmount": _pay.pay_amt,
                "taxScopeAmount": _pay.pay_amt,
                "taxExScopeAmount": 0,
                "productItems": _pay.productItems,
                "returnUrl": _pay.returnUrl
            });
        },
        returnCallback : function(data){
            $.extend(_pay, data);

            if (data.resultCode == "Success") {
                ord_pay["_payments_"] = {
                    appr_van_cd		: naverpay_van_cd,
                    orderer_nm   	: _pay.orderer_nm,
                    email			: _pay.email,
                    disp_goods_nm	: _pay.disp_goods_nm,
                    paymentId 		: _pay.paymentId,
                    order_no		: _pay.orderNo
                };

                ORDER.payments.payNext(_pay.next);
            } else{
                var returnMsg = data.returnMsg === '' ? '결제가 취소되었습니다.': data.returnMsg;
                ORDER.payments.throwError(returnMsg);
            }

            oPay.close();
        }
    };
})(jQuery);