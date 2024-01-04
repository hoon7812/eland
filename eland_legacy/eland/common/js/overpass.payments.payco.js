;(function ($) {
	var payco_van_cd = "30";
	ORDER.payments.payco = {
		call: function(pay) {
			var ord_qty_sum = 0;
			var certEnd = false;
			var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
			$.each(ORDER.goods.ord_goods, function(i, goods) {
				ord_qty_sum += goods.ord_qty;
			});
			this.popupCallback = function(data) {
				if (data.paymentCertifyToken != "null" && data.reserveOrderNo != "null" && data.sellerOrderReferenceKey != "null") {
					certEnd = true;
					ord_pay["_payments_"] = {
						appr_van_cd: payco_van_cd,
						paymentCertifyToken: data.paymentCertifyToken,
						reserveOrderNo: data.reserveOrderNo
					};
					ORDER.payments.payNext(pay.next);
				};
			};

			$.ajax({
				url: "/overpass-payments/payco/paycoReserve.action",
				type: "POST",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType:"json",
				data: {
					site_no: ORDER.mst.ord_mst.site_no,
					client_no: ORDER.mst.ord_mst.client_no,
					pay_amt: pay.pay_amt,
					disp_goods_nm: pay.disp_goods_nm,
					ord_qty_sum: ord_qty_sum,
					returnUrl: pay.cardcomp.mobile === true ? "https://" + location.host + "/order/registOrder.action" : location.protocol +"//" + location.host + "/overpass-payments/payco/paycoCertPopup.action",
					inAppYn: elandmall.global.app_cd != "" && elandmall.global.app_cd != undefined ? "Y" : "N",	//MobileWEB: N, AOS: Y, IOS: Y
					orderChannel: pay.cardcomp.mobile === true ? "MOBILE" : "PC" ,	//PC/MOBILE
					cancelMobileUrl: pay.cardcomp.mobile === true ? "https://" + location.host + "/order/cancelPayco.action" : "",
					appUrl: elandmall.global.app_cd == "iOS" ? elandmall.global.app_mall + "://" : ""
				},
				success: function(data) {
					if (data.code == "0") {
						ord_pay.pay_no = data.pay_no;
						if (pay.cardcomp.mobile !== true) {		//PCWEB - 팝업호출
							(function() {
								var closeCheck = function() {
									if (certEnd === false && paycoPopup) {
										if (paycoPopup.closed == true) {							
											ORDER.payments.throwError("페이코 인증을 취소하셨습니다.");	
										} else {
											setTimeout(closeCheck, 1000 * 1);						
										};						
									};
								};
								var paycoPopup = window.open(data.result.orderSheetUrl, "popupPayco", "top=100, left=300, width=727px, height=512px, resizble=no, scrollbars=yes");
								closeCheck();							
							})();		
						} else {	//모바일은 페이지 이동
							$.extend(ORDER.pay.ord_pays[pay.pay_seq], {								
								_payments_: { 
									orderSheetUrl: data.result.orderSheetUrl, 
									payco: true,
									mobile: true,
									appr_van_cd: payco_van_cd,
								}
							});
							ORDER.payments.payNext(pay.next);
						};
					} else {
						ORDER.payments.throwError("페이코 결제정보를 조회 할 수 없습니다.");
					};
				},
				error: function() {
					ORDER.payments.throwError("페이코 결제정보를 조회 할 수 없습니다.");
				}
			});
		}
	};
})(jQuery);