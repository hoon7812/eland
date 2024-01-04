;(function ($) {
	var kakao_van_cd = "20";
	ORDER.payments.kakao = {
		call: function(pay) {
			$.ajax({
				url: location.protocol +"//" + location.host + "/overpass-payments/kakao/kakaoTx.action",
				type: "POST",
				dataType: "json",
				data: {
					site_no: ORDER.mst.ord_mst.site_no,
					client_no: ORDER.mst.ord_mst.client_no,
					van_cd: kakao_van_cd,
					pay_mean_cd: pay.pay_mean_cd,
					onoff_divi_cd: "10",
					mers_divi_cd: "10", 
					prType: pay.cardcomp.prType,	//결제요청타입(MPM : 모바일결제, WPM : PC결제)
					channelType: pay.cardcomp.channelType, 	//채널타입(2: 모바일결제, 4: PC결제)
					certifiedFlag: "CN",	//인증구분(WEB결제로 신청할시에 필수)	
					Amt: pay.pay_amt,
					GoodsName: pay.disp_goods_nm
				},
				success: function(data) {
					var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
					ord_pay.pay_no = data.MERCHANT_TXN_NUM;
					if (data.RESULT_CODE != "00") {
						ORDER.payments.throwError("카카오 인증정보를 조회할 수 없습니다.");
					} else {
						var form = ORDER.payments.createForm({
							id: "_KAKAO_PAY_FORM_"
						});
						if ($("#kakaopay_layer").length == 0) {
							$("<div id='kakaopay_layer'></div>").hide().appendTo("body");
						};
						kakaopayDlp.setTxnId(data.TXN_ID);
						kakaopayDlp.setChannelType('WPM', 'TMS'); // PC결제
						kakaopayDlp.callDlp('kakaopay_layer', form.form, function(data) {
							if (data.RESULT_CODE == "00") {
								ord_pay["_payments_"] = {
									appr_van_cd: kakao_van_cd,
									orderer_nm: pay.orderer_nm,
									email: pay.email,
									disp_goods_nm: pay.disp_goods_nm,
									spu: data.SPU,
									spu_sign_token: data.SPU_SIGN_TOKEN,
									mpay_pub: data.MPAY_PUB,
									non_rep_token: data.NON_REP_TOKEN
								};
								ORDER.payments.payNext(pay.next);
							} else {
								ORDER.payments.throwError(data.RESULT_MSG);
							};
						});
					};					
				},
				error: function(message) {
					ORDER.payments.throwError("카카오 인증정보를 조회할 수 없습니다.");
				}
			});
		}
	};
})(jQuery);