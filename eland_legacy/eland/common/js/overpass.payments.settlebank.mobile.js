;(function ($) {
	var settlebank_van_cd = "40";
	webbrowser=navigator.appVersion;
	var isIPHONE = (navigator.userAgent.match('iPhone') != null ||
			navigator.userAgent.match('iPod') != null);
	var isIPAD = (navigator.userAgent.match('iPad') != null);
	var isANDROID = (navigator.userAgent.match('Android') != null);
	
	ORDER.payments.settlebank = {
	    call: function(pay) {
    	
	    	var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
	    	
			ORDER.payments.getMers({
				pay_mean_cd: '14',
				van_cd: '40',
				disp_mall_no: elandmall.global.disp_mall_no ,
				callback: function(mers) {
					pay.mers = mers;
					ORDER.payments.settlebank.paySmart(pay);
					
				}
			});
	    },
		paySmart: function(pay) {
			var mers = pay.mers;
			var form_data = {
				PMid: mers.mers_no,
				PAmt: pay.pay_amt,
				PPhone: "",
				PMobile: "",
				PGoods: encodeURI(pay.disp_goods_nm),
				POid: mers.pay_no,
				PMname: encodeURI("이랜드통합몰"),
				PUname: encodeURI(pay.orderer_nm),
				PEname: encodeURI("ELAND MALL"),
				PNoteUrl: "",
				PNextPUrl: mers.settlebank_mo_next_url,
				PCancPUrl: mers.settlebank_mo_cancel_return_url,
				PEmail: pay.email,
				settlebank_url : mers.settlebank_url+ "/mobile/MbMobileAction.do?_method=authProv"
			};
			$.extend(ORDER.pay.ord_pays[pay.pay_seq], {
				pay_no: mers.pay_no,
				_payments_: { form_data: form_data, mers_no: mers.mers_no }
			});	
			ORDER.payments.payNext(pay.next);
		}
	};
})(jQuery);