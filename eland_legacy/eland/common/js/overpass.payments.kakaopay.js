;(function ($) {
	var kakaopay_van_cd = "50";
	var _pay = null;
	var ord_pay = null;
	ORDER.payments.kakaopay = {
			
		call: function(pay) {
			_pay = pay;
	
			$.ajax({
				url: location.protocol +"//" + location.host + "/overpass-payments/kakao/kakaopayTx.action",
				type: "POST",
				dataType: "json",
				data: {
					site_no: ORDER.mst.ord_mst.site_no,
					client_no: ORDER.mst.ord_mst.client_no,
					van_cd: kakaopay_van_cd,
					pay_mean_cd: pay.pay_mean_cd,
					onoff_divi_cd: "10",
					mers_divi_cd: "10", 
					prType: pay.cardcomp.prType,	//결제요청타입(MPM : 모바일결제, WPM : PC결제)
					channelType: pay.cardcomp.channelType, 	//채널타입(2: 모바일결제, 4: PC결제)
					certifiedFlag: "CN",	//인증구분(WEB결제로 신청할시에 필수)	
					/*카카오페이 파라미터 */
					pay_amt		  : pay.pay_amt,      			//금액 (*)
					disp_goods_nm : pay.disp_goods_nm,	//상품명(*)
					orderer_nm 	  : pay.orderer_nm, 		//주문자명(*)
					app_cd        : elandmall.global.app_cd // [NGCPO-4661] appCode 추가  
				},
				success: function(data) {
	
					
					ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
					ord_pay.pay_no = data.pay_no;
					if (data.RESULT_CODE != "00") {
						ORDER.payments.throwError("카카오 인증정보를 조회할 수 없습니다.");
					} else {
						$.extend(_pay,{tid:data.tid});
					
						var redirect_url = data.next_redirect_pc_url;
						
						if(pay.cardcomp.prType == "MPM") {
							redirect_url = data.next_redirect_mobile_url;
						}
						
						
						var iframe = document.createElement("iframe");
					    iframe.src= redirect_url;
					    iframe.style.width="100%";
					    iframe.style.height="100%";
					    iframe.style.border="0px";

					    if($("#kakaoPayOverlay").length > 0 ){
					    	$("#kakaoPayOverlay").show();
					    }
					    
					    $("#kakaoPayLayer").empty().append(iframe);
					    $("#kakaoPayLayer").show();
					    $("#kakaoPayLayer").css({"z-index":"999999999"});
						
					};
		
				},
				error: function(message) {
					ORDER.payments.throwError("카카오 인증정보를 조회할 수 없습니다.");
				}
			});

		},
		returnCallback : function(data){
			$.extend(_pay,data);
			if($("#kakaoPayOverlay").length > 0) {
				$("#kakaoPayOverlay").hide();
			}
			
			if($("#kakaoPayLayer").length > 0) {
				$("#kakaoPayLayer").hide();
				$("#kakaoPayLayer").css({"z-index":"-999999999"});
			}
				
			if (data.RESULT_CODE == "00") {
				ord_pay["_payments_"] = {
					appr_van_cd		: kakaopay_van_cd,
					orderer_nm   	: _pay.orderer_nm,
					email			: _pay.email,
					disp_goods_nm	: _pay.disp_goods_nm,
					tid 			: _pay.tid,
					pg_token		: _pay.pg_token
				};
				ORDER.payments.payNext(_pay.next);
			} else{
				ORDER.payments.throwError(data.RESULT_MSG);
			}

		}
	};
	
})(jQuery);