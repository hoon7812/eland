;(function ($) {
	var PAY_MEAN_CD_CARD = "11";
	var PAY_MEAN_CD_RBANK = "12";
	var PAY_MEAN_CD_VBANK = "13";
	var PAY_MEAN_CD_MOBILE = "14";
	var ksnet_pays = {
		"11": PAY_MEAN_CD_CARD,
		"12": PAY_MEAN_CD_RBANK,
		"13": PAY_MEAN_CD_VBANK,
		"14": PAY_MEAN_CD_MOBILE
	};
	var lguplus_pays = {
		"11": PAY_MEAN_CD_CARD,
		"12": PAY_MEAN_CD_RBANK,
		"13": PAY_MEAN_CD_VBANK,
		"14": PAY_MEAN_CD_MOBILE
	};
	ORDER.payments = {
		callback: null,
		throwError: null,
		getMers: function(p) {
			try {
				var result = {};
				var p_mers_divi_cd = "10";
				
				if(typeof(p.ticket) != "undefined" && p.ticket == "Y") p_mers_divi_cd = "40";  //상품권일때 가맹점 변경
				if(typeof(p.isbn_use_yn) != "undefined" && p.isbn_use_yn == "Y") p_mers_divi_cd = "50";  //ISBN상품여부
				$.ajax({
					url: location.protocol +"//" + location.host + "/overpass-payments/getMers.action",
					type: "POST",
					dataType: "json",
					data: {
						site_no: ORDER.mst.ord_mst.site_no,
						client_no: ORDER.mst.ord_mst.client_no,
						van_cd: p.van_cd,
						pay_mean_cd: p.pay_mean_cd,
						pay_amt: p.pay_amt || 0,
						onoff_divi_cd: "10",
						mers_divi_cd: p_mers_divi_cd,		
						disp_mall_no: p.disp_mall_no
					},
					success: function(data) {
						if (data.code == "0000") {
							p.callback({
								code: data.code,
								msg: data.msg,
								mers_no: data.mers_no,
								site_url: data.site_url,
								biz_no: data.biz_no,
								companyname: data.companyname,
								hd_approve_no: data.ksnet_hd_approve_no,
								pg_id: data.ksnet_pg_id,
								receipt_acnt: data.ksnet_receipt_acnt,
								pay_no: data.pay_no,
								kspay_url: data.kspay_url,
								settlebank_url: data.settlebank_url,
								settlebank_next_url: data.settlebank_next_url,
								settlebank_mo_next_url : data.settlebank_mo_next_url,
								settlebank_mo_cancel_return_url : data.settlebank_mo_cancel_return_url,
								LGD_HASHDATA: data.LGD_HASHDATA,
								LGD_PLATFORM: data.LGD_PLATFORM,
								LGD_TIMESTAMP: data.LGD_TIMESTAMP
							});						
						} else {
							ORDER.payments.throwError("가맹점 정보를 찾을 수 없습니다");							
						}
					},
					error: function() {
						ORDER.payments.throwError("가맹점 정보를 찾을 수 없습니다");
					}
				});
			} catch (e) {
				ORDER.payments.throwError("가맹점 정보를 찾을 수 없습니다");
			}
		},		
		callPlugin: function(p) {
			var ord_pays = [];	//실결제 수단 정보
			var ord_mst = ORDER.mst.ord_mst;
			var orderer_nm = $.type(ord_mst.orderer_nm) == "string" ? ord_mst.orderer_nm : "" ;
			var email = $.type(ord_mst.email) == "string" ? ord_mst.email : "" ;
			var cell_no = ($.type(ord_mst.cell_no1) == "string" && $.type(ord_mst.cell_no2) == "string" && $.type(ord_mst.cell_no3) == "string") ? ord_mst.cell_no1 + ord_mst.cell_no2 + ord_mst.cell_no3 : "" ;
			var cell_no1 = ($.type(ord_mst.cell_no1) == "string") ? ord_mst.cell_no1 : "";
			var cell_no2 = ($.type(ord_mst.cell_no2) == "string") ? ord_mst.cell_no2 : "";
			var cell_no3 = ($.type(ord_mst.cell_no3) == "string") ? ord_mst.cell_no3 : "";
			var disp_goods_nm = "";
			var naverpay_disp_goods_nm = "";
			var disp_goods_count = 0;
			var isbn_use_yn_count = 0;
			var idx = 0;
			$.each(ORDER.goods.ord_goods, function() {
				if (disp_goods_nm == "") {
					disp_goods_nm = this.disp_goods_nm;
				};
				disp_goods_count++;
				if(this.isbn_use_yn == "Y"){
					isbn_use_yn_count ++;
				}

				// 네이버페이 상품명
				if(idx === 0) {
					naverpay_disp_goods_nm = this.disp_goods_nm;
				}

				idx++;
			});
			
			if(isbn_use_yn_count > 0) {
				ord_mst.isbn_use_yn = "Y";
			};
			
			
			if (disp_goods_count > 1) {
				disp_goods_nm += " 외" + (disp_goods_count - 1) + "건";
			};
			
			if ($.type(p.callback) != "function") {
				throw "callback이 존재하지 않습니다!";
			};
			if ($.type(p.throwError) != "function") {
				throw "callback이 존재하지 않습니다[THROW]!";
			};
			this.callback = function() {
				p.callback({
					order_data: ORDER.createOrderData()
				});
			};
			this.throwError = p.throwError;
			
			ORDER.pay.ord_pays = {};	//결제 정보 초기화
			$.each(ORDER.pay.pays, function(pay_seq) {
				var pay = this;
				if (pay.getPayYn()) {
					var ord_pay = { 
						pay_seq: pay_seq,
						pay_mean_cd: pay.pay_mean_cd,
						pay_amt: pay.pay_amt,
						orderer_nm: orderer_nm,
						email: email,
						cell_no: cell_no,
						cell_no1: cell_no1,
						cell_no2: cell_no2,
						cell_no3: cell_no3,
						disp_goods_nm: disp_goods_nm,
						naverpay_disp_goods_nm: naverpay_disp_goods_nm,
						naverpay_total_product_count: disp_goods_count,
						isbn_use_yn : "N",
						card_pay_kind_cd : pay.card_pay_kind_cd,
						ord_goods: ORDER.goods.ord_goods
					};
					if(isbn_use_yn_count > 0) {
						ord_pay.isbn_use_yn = "Y";
					}
					
					if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
						var cardcomp;					
						if ($.type(pay.getCardcomp) != "function") {
							throw "신용카드 정보를 조회할 수 없습니다[CARDCOMP].";
						};
						cardcomp = $.extend({}, pay.getCardcomp());
						if (cardcomp.kakao !==  true && cardcomp.kakaopay !==  true && cardcomp.payco !== true && cardcomp.toss !== true && cardcomp.naverpay !== true) {
							if (cardcomp.isp_yn != "Y" && cardcomp.isp_yn != "N") {
								throw "신용카드 정보가 올바르지 않습니다[ISP여부]";
							};
							if (cardcomp.isp_yn != "Y" && $.type(cardcomp.card_code) != "string" && cardcomp.card_code == "") {
								throw "신용카드 정보가 올바르지 않습니다[카드구분]";
							};
							if ($.type(cardcomp.noint_mon) != "string") {
								throw "신용카드 정보가 올바르지 않습니다[할부구분]";
							};
							if ((+pay.pay_amt) < 50000 && cardcomp.noint_mon != "") {
								throw "5만원 이상 결제시 할부 가능 합니다.";	
							};
							if (cardcomp.noint_mon != "") {
								cardcomp.noint_mon = (+cardcomp.noint_mon);
							} else {
								cardcomp.noint_mon = 0;
							};							
						};
						ord_pay.cardcomp = cardcomp;
						
						ord_pay.ticket = pay.ticket;  //상품권카드결제여부
						
					} else if (pay.pay_mean_cd == PAY_MEAN_CD_VBANK) {
						var bank;
						if ($.type(pay.getBank) != "function") {
							throw "입금은행 정보를 조회할 수 없습니다[BANK].";
						};
						bank = $.extend({}, pay.getBank());
						if ($.type(bank.bank_cd) != "string" || bank.bank_cd == "") {
							throw "입금은행 정보가 올바르지 않습니다";
						};
						if ($.type(bank.morc_nm) != "string" || bank.morc_nm == "") {
							throw "입금자 정보가 올바르지 않습니다";
						};
						if ($.type(bank.expiry_date) != "string" || bank.expiry_date == "") {
							throw "입금일자 정보가 올바르지 않습니다";
						};
						ord_pay.bank = bank;
					};
					ORDER.pay.ord_pays[pay_seq] = {};
					ord_pays.push(ord_pay);
				};
			});
			$.each(ord_pays, function(i) {
				this["next"] = ord_pays[i + 1];
			});
			console.log(this);
			if (ord_pays.length > 0) {
				this.payNext(ord_pays[0]);
			} else {
				this.callback();
			};	
		},
		payNext: function(pay) {
			if ($.type(pay) == "object") {
				var cardvan = ORDER.cardvan;

				if (pay.pay_mean_cd == PAY_MEAN_CD_CARD && pay.cardcomp.kakao === true) {
					ORDER.payments.kakao.call(pay);
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_CARD && pay.cardcomp.kakaopay === true) {
					ORDER.payments.kakaopay.call(pay);
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_CARD && pay.cardcomp.payco === true) {
					ORDER.payments.payco.call(pay);
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_CARD && pay.cardcomp.toss === true) {
					ORDER.payments.toss.call(pay);
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_CARD && pay.cardcomp.naverpay === true) {
					ORDER.payments.naverpay.call(pay);
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_MOBILE) {
					ORDER.payments.settlebank.call(pay);
				} else if (ksnet_pays[pay.pay_mean_cd] && cardvan.ksnet_yn == 'Y') {
				 	ORDER.payments.ksnet.call(pay);
				} else if (pay.pay_mean_cd == PAY_MEAN_CD_CARD && cardvan.lguplus_yn == 'Y') {
					ORDER.payments.lguplus.call(pay);
				} else if (pay.pay_mean_cd != PAY_MEAN_CD_CARD && cardvan.lguplus_yn == 'Y') { // LGUPLUS PG사용중인데 카드결제가 아니라면 ksnet으로 결제(가상계좌, 실시간계좌이체는 2차 개발)
					if(ksnet_pays[pay.pay_mean_cd]) {
						ORDER.payments.ksnet.call(pay);
					} else {
						this.payNext(pay.next);
					}
				}
				else {
					this.payNext(pay.next);
				};
			} else {
				this.callback();
			};
		},
		createForm: function(p) {
			var form = $("<form/>").attr({
				id: p.id,
				name: p.name,
				method: p.method
			});
			if (p.target) {
				form.attr({ target: p.target });
			};
			if (p.action) {
				form.attr({ action: p.action });
			};
			if (p.accept_charset) {
				form.attr({ "accept-charset": p.accept_charset });
			};
			return { 
				form: form[0],
				addInput: function(p) {
					form.append($("<input type='hidden'>").attr(p));
				},
				appendBody: function() {
					form.appendTo("body");
				}
			};
		},
		certingAccount: false,
		certAccaountCache: {},
		certAccount: function(p) {
			var hashcode = "";
			var certCallback = function(data) {
				if (data.result === true) {
					if ($.type(p.callback) == "function") {
						p.callback();
					}
				} else {
					alert("올바른 계좌가 아닙니다.");
				};
			};
			if (this.certingAccount === true) {
				return false;
			};
			this.certingAccount = true;
			hashcode = p.morc_nm + "|" + p.account_no + "|" + p.bank_cd;
			if (this.certAccaountCache[hashcode]) {		//기 조회된 정보가 있음.
				certCallback(this.certAccaountCache[hashcode]);
				ORDER.payments.certingAccount = false;
			} else {
				$.ajax({
					url: location.protocol +"//" + location.host + "/order/certAccount.action",
					type: "POST",
					dataType: "json",
					data: { bank_cd: p.bank_cd, morc_nm: p.morc_nm, account_no: p.account_no },
					success: function(data) {
						ORDER.payments.certAccaountCache[hashcode] = data;
						certCallback(data);
					},
					error: function() {
						alert("계좌인증에 실패하였습니다.");
					},
					complete: function() {
						ORDER.payments.certingAccount = false;
					}
				});
			};
		}
	};
})(jQuery);