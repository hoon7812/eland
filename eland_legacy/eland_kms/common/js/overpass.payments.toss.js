;(function ($) {
    var toss_van_cd = "60";
    var _pay = null;
    var ord_pay = null;
    ORDER.payments.toss = {
        call: function(pay) {
            _pay = pay;

            var data = {
                pay_amt: pay.pay_amt, //금액
                disp_goods_nm: pay.disp_goods_nm, //상품명
                app_cd: elandmall.global.app_cd, // retAppScheme scheme값을 위한 현재 기종판별 값
                app_mall: elandmall.global.app_mall // retAppScheme scheme값을 위한 현재 전시몰별 값
            };

            $.ajax({
                url: location.protocol +"//" + location.host + "/overpass-payments/toss/tossPayments.action",
                type: "POST",
                dataType: "json",
                data: data,
                success: function(data) {
                    console.log('ORDER.payments.toss.call result data :::: ', data);

                    ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
                    ord_pay.pay_no = data.pay_no;

                    if (data.code != "0") {
                        ORDER.payments.throwError("토스 결제 생성이 실패하였습니다.[에러코드: " + data.code + "]");
                    } else {
                        $.extend(_pay,{tid: data.payToken});

                        // window.open(data.checkoutPage, "popup_window", "width=500, height=500, scrollbars=yes, autoresize=no");

                        var iframe = document.createElement("iframe");
                        iframe.src= data.checkoutPage;
                        iframe.style.width="100%";
                        iframe.style.height="100%";
                        iframe.style.border="0px";
                        if(pay.cardcomp.prType == "WPM") {
                            $("#tossOverlay").show();
                        }


                        $("#tossLayer").empty().append(iframe);
                        $("#tossLayer").show();
                        $("#tossLayer").css({"z-index":"999999999"});
                    };

                },
                error: function(message) {
                    ORDER.payments.throwError("토스 결제 생성이 실패하였습니다.");
                }
            });

        },
        returnCallback : function(data){
            $.extend(_pay, data);

            if($("#tossOverlay").length > 0) {
                $("#tossOverlay").hide();
            }

            if($("#tossLayer").length > 0) {
                $("#tossLayer").hide();
                $("#tossLayer").css({"z-index":"-999999999"});
            }

            if (data.status == "PAY_APPROVED") {
                ord_pay["_payments_"] = {
                    appr_van_cd		: toss_van_cd,
                    orderer_nm   	: _pay.orderer_nm,
                    email			: _pay.email,
                    disp_goods_nm	: _pay.disp_goods_nm,
                    tid 			: _pay.tid,
                    order_no		: _pay.orderNo
                };
                ORDER.payments.payNext(_pay.next);
            } else{
                var returnMsg = data.returnMsg === '' ? '결제가 취소되었습니다.': data.returnMsg;
                ORDER.payments.throwError(returnMsg);
            }

        }
    };
})(jQuery);