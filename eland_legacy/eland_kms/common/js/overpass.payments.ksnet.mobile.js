;(function ($) {
	var ksnet_van_cd = "10";
	var PAY_MEAN_CD_CARD = "11";
	var PAY_MEAN_CD_RBANK = "12";
	var PAY_MEAN_CD_VBANK = "13";
	var KSNET_PAYMETHOD = { "11": "1000000000", "12": "0010000000" };
	var KSNET = {	//KSNET 제공 함수
		getLocalUrl: function(mypage) {
			var myloc = location.href; 
			return myloc.substring(0, myloc.lastIndexOf('/')) + '/' + mypage;
		}
	};
	ORDER.payments.ksnet = {
		call: function(pay) {
			var pay_seq = pay.pay_seq;
			if (pay.pay_mean_cd == PAY_MEAN_CD_CARD || pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {
				ORDER.payments.getMers({
					pay_mean_cd: pay.pay_mean_cd,
					van_cd: ksnet_van_cd,
					ticket: pay.ticket, 
					isbn_use_yn : pay.isbn_use_yn,
					callback: function(mers) {
						pay.mers = mers;
						ORDER.payments.ksnet.paySmart(pay);
					}
				});
			} else if (pay.pay_mean_cd == PAY_MEAN_CD_VBANK) {	//가상계좌(모듈 없음)
				var bank = pay.bank;
				$.extend(ORDER.pay.ord_pays[pay.pay_seq], {
					_payments_: {
						orderer_nm: pay.orderer_nm,
						email: pay.email,
						disp_goods_nm: pay.disp_goods_nm,
						cell_no1: pay.cell_no1,
						cell_no2: pay.cell_no2,
						cell_no3: pay.cell_no3,
						bank_cd: bank.bank_cd,
						expiry_date: bank.expiry_date,
						expiry_dtime: bank.expiry_dtime,
						morc_nm: bank.morc_nm,
						isbn_use_yn : pay.isbn_use_yn
					}
				});	
				ORDER.payments.payNext(pay.next);
			};
		},
		paySmart: function(pay) {
			var mers = pay.mers;
			var cardcomp = pay.cardcomp;
			var sndShowcard = "";	//카드정보
			var sndInstallmenttype = pay.pay_mean_cd == "11" ? cardcomp.noint_mon : "" ;	//할부정보
			var sndInteresttype = "";	//무이자정보
			var sndMpiAuthType = pay.card_pay_kind_cd == "01" ? "3" : "" ; //결제타입
			if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
				sndShowcard = (cardcomp.isp_yn == "Y" ? "I" : "M") + "(" + (cardcomp.cardcomp_cd == "14" ? "01" : cardcomp.cardcomp_cd) + ")";	//우리(14)는 BC로 넘김
			};
	        
			// [< > " ' ~ , `] 특수문자 공백처리
			var replaceStr = ["&lt;", "&gt;", "&#34;", "&#39;", "&#126;", "&#44;", "&#96;"];
			var disp_goods_nm = pay.disp_goods_nm;
			for ( var idx=0; idx<replaceStr.length; idx++){
				if ( disp_goods_nm.indexOf(replaceStr[idx]) > -1 ){
					disp_goods_nm = disp_goods_nm.replaceAll(replaceStr[idx], "");
				}
			}
			
			var form_data = {
				sndPaymethod: KSNET_PAYMETHOD[pay.pay_mean_cd],
				sndStoreid: mers.mers_no,
				sndCurrencytype: "WON",
				sndOrdernumber: mers.pay_no,
				sndAllregid: "",		//주민번호(선택)
				sndShowcard: sndShowcard,
				sndInstallmenttype: sndInstallmenttype,
				sndInteresttype: sndInteresttype,
				sndGoodname: disp_goods_nm,
				sndAmount: pay.pay_amt,
		
				sndOrdername: pay.orderer_nm,
				sndEmail: pay.email,
				sndMobile: pay.cell_no,
				sndReply: ORDER.payments.ksnet.sndReply ? ORDER.payments.ksnet.sndReply+"?real_pay_mean_cd="+pay.pay_mean_cd : KSNET.getLocalUrl("registOrder.action?real_pay_mean_cd="+pay.pay_mean_cd),
				sndEscrow: "0",
				sndVirExpDt: "",
				sndVirExpTm: "",
				sndStoreName: "이랜드몰",
				sndStoreNameEng: "elandmall",
				sndStoreDomain: "www.elandmall.com",
				sndGoodType: "1",
				sndUseBonusPoint: "",
				sndMpiAuthType : sndMpiAuthType,
				sndRtApp: (function() {
					var app = "";
					if (elandmall.global.app_cd == "iOS") {
						app = elandmall.global.app_mall + "://";
					} else if (elandmall.global.app_cd == "Android") {
						app = "Android";						
					};
					return app;
				})(),
				kspay_url: mers.kspay_url
			};
			$.extend(ORDER.pay.ord_pays[pay.pay_seq], {
				pay_no: mers.pay_no, 
				_payments_: { form_data: form_data, mers_no: mers.mers_no, noint_mon: sndInstallmenttype }
			});	
			ORDER.payments.payNext(pay.next);
		}
	};
})(jQuery);