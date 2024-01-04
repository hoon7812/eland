$(document).ready(function() {
	var base_dlvp_div = $("div[name='dlvp_area'][role='default']");	//기본 배송지 div
	var base_digital_dlvp_div = $("div[name='dlvp_gift_area'][role='default']");	//디지털 상품권 배송지 div
	var base_quick_dlvp_div = $("div[name='dlvp_quick_area'][role='default']");	//퀵상품 배송지 div
	var refund_bank_area = $("[name='refund_bank_area']");	//환불계좌 영역
	var select_vbank = $("#select_vbank").change(function() {
		ORDER.fn.updatePaymentText({ pay_mean_cd: "13" });
	});
	var select_credit_card = (function() {
		return $("#select_credit_card").change(function() {
			ORDER.fn.updatePaymentText({ pay_mean_cd: "11" });
		});
	})();
	if (elandmall.util.getCookie("reloaded") == "Y") {	//페이지 리로드됨
		alert("주문/배송 정보를 다시 확인하고 결제해주세요");
	} else {
		elandmall.util.setCookie({ name: "reloaded", value: "Y", domain: elandmall.global.cookie_domain, path: "/order" });
	};

	ORDER.fn.select_credit_card = select_credit_card;
	ORDER.fn.select_credit_card_installment = select_credit_card_installment;
	ORDER.fn.select_vbank = select_vbank;
	ORDER.fn.updateBlock = true;
	ORDER.fn.updateOrderSheet();	//일단 초기화를 위해서 실행...
	ORDER.fn.ord_pay_radio = (function() {
		return $("a[name='ord_pay_radio']").click(ORDER.fn.clickPayRadioButton);	//결제 수단 클릭시
	})();
	// [START] 기본 배송지 정보
	base_dlvp_div.each(function() {
		var div = $(this);
		var base = ORDER.dlvp.base_dlvp;	//기본 배송지 정보
		var fresh_count = div.attr("fresh-count");
		var normal_count = div.attr("normal-count");
		var shop_count = div.attr("shop-count");

		if(fresh_count > 0 && normal_count == 0 && shop_count == 0) {
			ORDER.fn.addDlvp({
				div: div, dlvp: base, cart_grp_cd: "80"
			});
		} else {
			ORDER.fn.addDlvp({
				div: div, dlvp: base
			});

			if (fresh_count > 0) {
				ORDER.fn.addDlvp({
					div: div, dlvp: base, cart_grp_cd: "80"
				});
			}
		}
	});
	base_quick_dlvp_div.each(function() {
		var div = $(this);
		var base = ORDER.dlvp.base_dlvp;	//기본 배송지 정보
		var quick_count = div.attr("quick-count");
		var hyper_count = div.attr("hyper-count");
		if(quick_count > 0) {
			ORDER.fn.addDlvp({
				div: div, dlvp: base, cart_grp_cd: "60"
			});
		}
		if(hyper_count > 0) {
			ORDER.fn.addDlvp({
				div: div, dlvp: base, cart_grp_cd: "70"
			});
		}
	});
	base_digital_dlvp_div.each(function() {
		var div = $(this);
		var base = ORDER.dlvp.base_dlvp;	//기본 배송지 정보
		ORDER.fn.addDigitalDlvp({ div: div, dlvp: { recvr_nm: ORDER.mst.ord_mst.orderer_nm, recvr_cell_no1: ORDER.mst.ord_mst.cell_no1, recvr_cell_no2: ORDER.mst.ord_mst.cell_no2, recvr_cell_no3: ORDER.mst.ord_mst.cell_no3 } });
	});
	// [END] 기본 배송지 정보
	
	// [START] 매장수령 상품
	$.each(ORDER.deli.shop_deli, function(vir_vend_no) {
		ORDER.dlvp.add({ cart_grp_cd: "40", vir_vend_no: vir_vend_no });		
	});
	// [END] 매장수령 상품
	
	// [START] 호텔 예약
	$.each(ORDER.deli.hotel_deli, function(vir_vend_no) {		
		ORDER.dlvp.add({ cart_grp_cd: "HO", vir_vend_no: vir_vend_no });
	});
	// [END] 호텔 예약	
	
	// [START] 결제 수단
	$("[role='ord_pay']").each(function() {
		var element = $(this);
		var pay_mean_cd = element.attr("pay_mean_cd");
		var pay_seq = element.attr("pay_seq");
		var type = element.attr("type");
		var kakao = element.attr("kakao");
		var kakaopay = element.attr("kakaopay");
		var payco = element.attr("payco");
		var toss = element.attr("toss");
		var naverpay = element.attr("naverpay");
		var ticket = element.attr("data-ticket"); //상품권 카드결제 유무
		var pay = {
			pay_seq: pay_seq,
			pay_mean_cd: pay_mean_cd,
			ticket : ticket,
			getPayYn: function() {	//결제여부 확인
				if (type == "a") {	//a 링크
					return ORDER.pay.pays[pay_seq].pay_amt > 0 && element.hasClass("selected");		//선택되었고 결제금액이 있을경우
				} else if (pay_mean_cd == "21" || pay_mean_cd == "15") {	//예치금, 통합포인트
					return ORDER.pay.pays[pay_seq].pay_amt > 0;
				} else {
					if (pay_mean_cd == "61" || pay_mean_cd == "62" || pay_mean_cd == "63") {
						return true;
					} else {
						return false;
					};
				};
			},
			disable: function(b) {		//해당 결제 수단 비활성화
				var disable_yn = element.attr("disable_yn");	//해당 결제 수단의 사용 가능 여부
				if (type != "a" || disable_yn == "Y") {
					return false;
				};

				if (b === true) {	//비활성화
					element.addClass("disable");
				} else {	//활성화
					element.removeClass("disable");
				};
			}
		};
		if (pay_mean_cd == "11") {	//신용카드
			pay.getCardcomp = function() {
				var cardcomp_cd = select_credit_card.val();
				var settle = ORDER.pay.usable_settles["11"][cardcomp_cd];
				if (kakao == "Y") {
					return {
						kakao: true,
						prType: "WPM",
						channelType: "4"						
					};
				} else if (kakaopay == "Y") {
					return {
						kakaopay: true,
						prType: "WPM",
						channelType: "4"						
					};
				} else if (payco == "Y") {
					return {
						payco: true						
					};
				} else if (toss == "Y") {
					return {
						toss: true
					};
				} else if (naverpay == "Y") {
					return {
						naverpay: true
					};
				} else {
					return {
						isp_yn: settle.grp_cd1,
						card_code: settle.grp_cd2,
						cardcomp_cd: cardcomp_cd,
						noint_mon: $("#select_credit_card_installment").val()					
					};					
				}
			};
		} else if (pay_mean_cd == "13") {	//무통장
			pay.getBank = function() {
				var bank_cd = $("#select_vbank").val();
				var settle = ORDER.pay.usable_settles["13"][bank_cd];
				return {
					bank_cd: bank_cd,
					morc_nm: $("#morc_nm").val(),
					expiry_date: $("#select_vbank").attr("expiry_date"),
					expiry_dtime: $("#select_vbank").attr("expiry_dtime")
				};
			};
		} else if (pay_mean_cd == "21" || pay_mean_cd == "15" || pay_mean_cd == "62" ) {	//예치금, 통합포인트
			(function() {
				var max_amt = +element.attr("max_amt");
				var setDepositAmt = function(pay_amt) {
					var pay = ORDER.pay.pays[pay_seq];
					if (pay.pay_amt != pay_amt) {
						pay.pay_amt = pay_amt;
						ORDER.fn.updateOrderSheet(undefined, pay_mean_cd);
					};
					element.val(elandmall.util.toCurrency(pay.pay_amt));
				};
				var all_in_checkbox = $("#all_in_checkbox_" + pay_seq).click(function() {

					$.each(ORDER.pay.pays, function(pay_seq) {	// 복지포인트 사용시에는 예치금, 통합포인트등 금액을 초기화
						if( (this.pay_mean_cd == "15" || this.pay_mean_cd == "21") && pay_mean_cd == "62"){
							this.reset();
							ORDER.fn.updateOrderSheet(undefined, pay_mean_cd);
						}
					});
					
					var pay = ORDER.pay.pays[pay_seq];
					var all_in_amt = 0;
					if (this.checked) {
						all_in_amt = ORDER.fn.final_pay_amt + pay.pay_amt;
						if(pay_mean_cd =="15"){
							max_amt = $('[name="pay_amt_input"]').attr('max_amt');
						}
						if (all_in_amt > max_amt) {
							all_in_amt = max_amt;
						};
						if (all_in_amt == 0) {
							this.checked = false;
						};
						if (pay_mean_cd == "15") {
							all_in_amt = parseInt(all_in_amt / 10) * 10;							
						};
					};					 
					setDepositAmt(all_in_amt);
				});
				pay.pay_amt = 0;
				pay.reset = function() {
					ORDER.pay.pays[pay_seq].pay_amt = 0;
					all_in_checkbox.prop("checked", false);
					element.val("0");
				};
				element.focus(function() {
					var pay = ORDER.pay.pays[pay_seq];
					this.value = (pay.pay_amt == 0) ? "" : pay.pay_amt ; 
				}).blur(function() {
					var pay_amt = ORDER.pay.pays[pay_seq].pay_amt;
					var val = $.trim(this.value);					
					if ($.isNumeric(this.value)) {
						val = +this.value;
						max_amt = $(this).attr('max_amt');
						if (val > max_amt) {
							alert(elandmall.util.toCurrency(max_amt) + "원 이상 사용할 수 없습니다.");
						} else if (val > pay_amt && ORDER.fn.final_pay_amt - val <= 0) {
							pay_amt = ORDER.fn.final_pay_amt + pay_amt;
						} else {
							pay_amt = val;
						};
					} else {
						if (val == "") {
							pay_amt = 0;
						};
					};
					if (pay_mean_cd == "15" || pay_mean_cd == "21") {
						if (pay_amt > 0) {
							if (pay_amt < 10) {
								alert("금액 입력은 10원 이상부터 가능 합니다.");
							} else if (pay_amt % 10 != 0) {
								alert("10원 단위 이상으로만 입력 가능 합니다.\n10원 단위로 재조정 하여  제공하였습니다.");
							};
							pay_amt = parseInt(pay_amt / 10) * 10;							
						};
					};
					if (pay_amt == 0) {
						all_in_checkbox.prop("checked", false);
					};
					setDepositAmt(pay_amt);
				});
			})();
		};
		ORDER.pay.add(pay);
	});
	// [END] 결제 수단
	
	// [START] 혜택 셋팅
	ORDER.fn.staffBenefit();	//직원할인 + 상품쿠폰
	ORDER.fn.doubleCouponCombo();	//더블쿠폰영역
	ORDER.fn.cartCouponCombo();		//장바구니쿠폰영역
	
	//상품별 benefit확인(상품쿠폰, 더블쿠폰, 직원할인)
	$.each(ORDER.goods.ord_goods, function(cart_seq) {
		if ($("#benefit_td_" + cart_seq + " [name='benefit_area']").filter(":visible").length == 0) {
			if (this.goods_disp_divi_cd != "20") {
				$("#benefit_td_" + cart_seq).text("-");				
			} else {
				$("#benefit_td_" + cart_seq).html("<span class=\"txt_c05\">복지몰 전용 상품</span>");
			};
		} else {
			if (this.promo_apply_yn == "N" && this.imme_coupon_apply_yn == "Y") {
				$("#goods_coupon_only_" + cart_seq).show();
			};
		};			
	});	
	// [END] 혜택 셋팅	
	ORDER.fn.updateOrderSheet(false);	//화면갱신(최초 화면 갱신)
	
	(function() {
		var reserved_pay_mean_cd = elandmall.util.getCookie("reserved_pay_mean_cd");
		var reserved_cardcomp_no = elandmall.util.getCookie("reserved_cardcomp_no");
		var reserved_kakao = elandmall.util.getCookie("reserved_kakao");
		var reserved_kakaopay = elandmall.util.getCookie("reserved_kakaopay");
		var reserved_payco = elandmall.util.getCookie("reserved_payco");
		var reserved_toss = elandmall.util.getCookie("reserved_toss");
		var reserved_naverpay = elandmall.util.getCookie("reserved_naverpay");
		var reserved_bank_cd = elandmall.util.getCookie("reserved_bank_cd");
		var pay_radios = ORDER.fn.ord_pay_radio;
		if (pay_radios.filter("[pay_mean_cd='" + reserved_pay_mean_cd + "']:not(.disable)").length == 0) {	//저장된 결제수단이 비활성일 경우 활성화된 결제수단중 첫번째것
			(function() {
				var radio = pay_radios.filter("[disabled!='disabled']:eq(0)");
				reserved_pay_mean_cd = radio.attr("pay_mean_cd");
				reserved_kakao = radio.attr("kakao") ? radio.attr("kakao") : "N" ;
				reserved_kakaopay = radio.attr("kakaopay") ? radio.attr("kakaopay") : "N" ;
				reserved_payco = radio.attr("payco") ? radio.attr("payco") : "N" ;
				reserved_toss = radio.attr("toss") ? radio.attr("toss") : "N" ;
				reserved_naverpay = radio.attr("naverpay") ? radio.attr("naverpay") : "N" ;
			})();
		};
		if (reserved_pay_mean_cd == "11" && reserved_kakao != "Y" && reserved_kakaopay != "Y" && reserved_payco != "Y" && reserved_toss != "Y" && reserved_naverpay != "Y") {
			ORDER.fn.changeCard(undefined, { cardcomp_cd: reserved_cardcomp_no });
		} else if (reserved_pay_mean_cd == "13") {
			select_vbank.val(reserved_bank_cd);
		};
		ORDER.fn.clickPayRadioButton(undefined, { pay_mean_cd: reserved_pay_mean_cd, kakao: reserved_kakao ,kakaopay: reserved_kakaopay, payco: reserved_payco, toss: reserved_toss, naverpay: reserved_naverpay });	//기본 결제 수단 선택(라디오버튼)
	})();
	
	if (ORDER.mst.account_owner_mgmt) {	//환불 계좌 정보가 있다면 cache에 저장(계좌인증 재조회 방지)
		ORDER.payments.certAccaountCache[ORDER.mst.account_owner_mgmt.morc_nm + "|" + ORDER.mst.account_owner_mgmt.account_no + "|" + ORDER.mst.account_owner_mgmt.bank_cd] = { result: true };
	};
	
	if (elandmall.global.ie_yn != "Y") {
		$("#no_ie_info_div").show().each(function() {
			var div = $(this);
			$(this).find("a.btn_close").click(function(e) {
				e.preventDefault();
				div.hide();
			});
		});
		$("#prevent_popup_div").show();		
	};
	
	// [START] 사용자 이벤트 처리
	select_credit_card.change(ORDER.fn.changeCard);
	
	$("#increase_dlvp_select, #digital_gift_dlvp_select").change(function() {		//배송지 숫자 변경
		var select = $(this);
		var role = select.attr("role");
		var dlvp_count = +select.val();
		var added_dlvp_div = $("<div></div>").attr({ name: "dlvp_increase_area", id: "dlvp_increase_area" });
		var base_dlvp = undefined;
		$("div[name='dlvp_area'][role='added'], div[name='dlvp_gift_area'][role='added']").each(function() {
			delete ORDER.dlvp.ord_dlvps[$(this).attr("dlvp_no")];
		});
		
		// 통관부호필요여부 
		var custom_clearance_yn = false;
		$.each(ORDER.goods.ord_goods, function(i) {		
			if(ORDER.goods.ord_goods[i].custom_clearance_yn =="Y"){
				custom_clearance_yn= true;
			}
		});
		
		$("#dlvp_increase_area").remove();	//추가된 배송지 영역 제거
		
		if (role == "deli") {
			base_dlvp = base_dlvp_div;
			(function() {
				var order_gift_tr = base_dlvp.find("tr[name='order_gift_tr']");
				ORDER.fn.updateBlock = true;
				ORDER.fn.deliBlock = true;
				if (dlvp_count > 1) {	//일단 기본 배송지에 대한 UI 처리
					base_dlvp.find("tr[name='dlvp_ord_goos_tr']").show();
					base_dlvp.find("tr[name='deli_hope_goods_tr']").hide();
					if (ORDER.fn.order_gift_count > 0) {
						order_gift_tr.show();
					};
					base_dlvp.find(":input[name='order_gift_checkbox']:checked").click();	//주문 사은품 수령여부 초기화
				} else {
					base_dlvp.find("tr[name='dlvp_ord_goos_tr']").hide();
					base_dlvp.find("tr[name='deli_hope_goods_tr']").show();
					order_gift_tr.hide();
					base_dlvp.find(":input[name='order_gift_checkbox']:not(:checked)").click();
					
					if(custom_clearance_yn){
						base_dlvp.find("tr[name='customsId_tr']").show();
					}
				};
				if (dlvp_count > 1) {
					base_dlvp.find("th[name='disp_dlvp_no_tr']").html("<strong>(1번)</strong> 배송지 선택");
				} else {
					base_dlvp.find("th[name='disp_dlvp_no_tr']").html("배송지 선택");
				};
			})();			
		} else if (role == "digital") {
			base_dlvp = base_digital_dlvp_div;
			(function() {
				if (dlvp_count > 1) {	//일단 기본 배송지에 대한 UI 처리
					base_dlvp.find("tr[role='goods_list_tr']").show();
					base_dlvp.find("b[name='dlvp_no']").show();
				} else {
					base_dlvp.find("tr[role='goods_list_tr']").hide();
					base_dlvp.find("b[name='dlvp_no']").hide();
				};
			})();
		};
		
		for (var i = 0 ; i < dlvp_count - 1 ; i++) {
			var div = base_dlvp.clone().attr("role", "added");
			added_dlvp_div.append(div);
			if (role == "deli") {
				ORDER.fn.addDlvp({ div: div });
			} else if (role == "digital") {
				ORDER.fn.addDigitalDlvp({ div: div });
			};
		};

		base_dlvp.after(added_dlvp_div);
		
		if (role == "deli") {
			ORDER.fn.resetOrdQty();	//배송지별 주문수량 초기화
			ORDER.fn.getDeliInfo(false);
			ORDER.fn.updateOrderSheet(false);			
		} else if (role == "digital") {
			ORDER.fn.resetOrdDigitalQty();	//배송지별 주문수량 초기화
		};
	});	
	$("#orderer_nm_checkbox_base, #orderer_nm_checkbox_new").click(function() {		//주문자 정보 새로 입력
		if (this.value == "base") {
			$("#base_order_tr").hide();
			$("#orderer_nm_checkbox_base").prop({ checked: true });
			$("#orderer_nm_checkbox_new").prop({ checked: true });
			$("#new_order_tr").show();			
		} else {
			$("#orderer_nm_checkbox_base").prop({ checked: false });
			$("#base_order_tr").show();
			$("#new_order_tr").hide();
			$("#orderer_nm_checkbox_new").prop({ checked: false });
		};
	});
	$("#new_email_select").val("01");	//직접입력
	$("#new_email_2").show();	//직접입력
	$("#new_email_select").change(function() {	//새로운 주소 이메일
		var email2 = $("#new_email_2");
		if (this.value == "01") {	//직접입력
			email2.val("");
			email2.show();
		} else {
			email2.hide();
			email2.val($(this).find("option:selected").attr("domain"));
		};
	});
	$(":checkbox[name='guarantee_insurance_checkbox']").click(function() {	//보증보험(실시간, 무통장)
		var checkbox = $(this);
		var li = $("#pay_info_li");
		var area = li.find("[name='guarantee_insurance_area']");
		if (this.checked) {
			area.show();
		} else {
			$("#guarantee_insurance_checkbox_2, #guarantee_insurance_checkbox_3").attr("checked", false);
			area.hide();
		};
	});
	(function() {
		var li = $("#pay_info_li");
		var birth_select = li.find(":input[name='birth_select']");
		var guarantee_insurance_gend_radio = li.find(":radio[name='guarantee_insurance_gend_radio']");		
		if (ORDER.mst.ord_mst.birth_day && ORDER.mst.ord_mst.birth_day.length == 8) {
			birth_select.each(function(i) {
				this.value = (function() {
					if (i == 0) {
						return ORDER.mst.ord_mst.birth_day.substring(0, 4);
					} else if (i == 1) {
						return ORDER.mst.ord_mst.birth_day.substring(4, 6);
					} else if (i == 2) {
						return ORDER.mst.ord_mst.birth_day.substring(6);
					}					
				})();
			});
		};
		if (ORDER.mst.ord_mst.gend_cd && (ORDER.mst.ord_mst.gend_cd == "M" || ORDER.mst.ord_mst.gend_cd == "F")) {
			guarantee_insurance_gend_radio.filter("[value='" + ORDER.mst.ord_mst.gend_cd + "']").prop("checked", true);		
		};
	})();
	(function() {	//현금영수증
		var div = $("#cash_receipt_div");
		div.find(":input[role='cash_receipt_cell_no']").each(function(i) {
			switch (i) {
				case 0:
					this.value = ORDER.mst.ord_mst.cell_no1;
					break;
				case 1:
					this.value = ORDER.mst.ord_mst.cell_no2;
					break;
				case 2:
					this.value = ORDER.mst.ord_mst.cell_no3;
					break;
				default:
					break;
				};
		});
		div.find(":radio[name='cash_receipt_radio']").click(function() {
			var issue_div = div.find("div[role='cash_receipt_issue_div']");
			if (this.value != "") {
				issue_div.filter("[issue_cd='" + this.value + "']:not(:visible)").show();
				issue_div.filter("[issue_cd!='" + this.value + "']:visible").hide();
			} else {
				issue_div.filter(":visible").hide();
			};
		});
		div.find(":input[name='cash_receipt_use_divi_select']").change(function() {
			var use_divi_div = div.find("div[role='cash_receipt_use_div']");
			use_divi_div.filter("[use_divi_cd='" + this.value + "']").show();
			use_divi_div.filter("[use_divi_cd!='" + this.value + "']").hide();
		});
	})();
	$("#refund_method_agree_checkbox").click(function() {
		var refund_req_type_radio = $(":input[name='refund_req_type_radio']");
		if (this.checked === false) {
			$("#refund_req_type_radio_2").click();
			refund_req_type_radio.prop("checked", false);
			refund_req_type_radio.prop("disabled", true);
		} else {
			refund_req_type_radio.prop("disabled", false);
			if ($("#refund_req_type_radio_2").is(":visible") && $("#refund_req_type_radio_2").is(":checked") === false) {
				$("#refund_req_type_radio_2").click();			
			} else {
				$("#refund_req_type_radio_1").click();
			};
		};
	});
	$(":input[name='refund_req_type_radio']").click(function() {	//환불방법
		var add_refund_bank_button = $("#add_refund_bank_button");		
		if (this.value == "10") {	//계좌 환불
			if (add_refund_bank_button.length == 0 || add_refund_bank_button.attr("click_yn") == "Y") {
				$("#new_refund_bank_area").show();				
			} else {
				$("#my_refund_bank_area").show();				
			};
		} else if (this.value == "20") {	//예치금 환불
			$("#new_refund_bank_area").hide();
			$("#my_refund_bank_area").hide();
		};
	});
	$("#add_refund_bank_button").click(function() {
		$("#refund_req_bank_cd").val(ORDER.mst.account_owner_mgmt.bank_cd);
		$("#refund_req_depor_nm").val(ORDER.mst.account_owner_mgmt.morc_nm);
		$("#refund_req_account_no").val(ORDER.mst.account_owner_mgmt.account_no);
		$("#new_refund_bank_area").show();
		$("#my_refund_bank_area").hide();
		$(this).attr("click_yn", "Y");
	});
	$("#cert_account_button").click(ORDER.fn.certAccount);	//계좌확인
	$(":input[name='shop_deli_hope_dtime_select']").change(function() {	//매장 방문 예정일
		var select = $(this);
		var cart_seq = select.attr("cart_seq");
		var option = select.find(":selected");
		if (option.attr("holi_day_yn") == "Y") {
			alert("해당일은 영업하지 않습니다.");
			select.val(select.attr("opt_value"));
			return false;
		};
		select.attr("opt_value", select.val());
		ORDER.goods.ord_goods[cart_seq].deli_hope_dtime = select.val();
	});
	$("#go_cart_button").click(function() {	//장바구니 돌아가기
		if(elandmall.global.disp_mall_no == "0000053"){	//슈펜일 경우 슈펜장바구니로 이동
			elandmall.shoopen.goShoopenCart();
		} else {
			elandmall.hdLink('CART');
		}
	});
	$("#go_regist_member_button").click(function() {	//회원가입
		elandmall.oneclick.fnMemJoin();
	});
	$("#layer_ansim_click_button, #layer_isp_button").click(function() {	//안내 레이어
		var button = $(this);
		var page = button.attr("page");
		var title = button.attr("title");
		elandmall.layer.createLayer({
			title: title,
			class_name: "layer_pop d_layer_pop on",
			createContent: function(layer) {
				layer.div_content.load("/order/showLayer.action", {
					page: page
				}, function() {
					layer.div_content.find("#close_order_layer_button").click(function() {
						layer.close();
					});
					layer.show();					
				});
			}
		});
	});
	$("#view_my_coupon_button").click(function() {
		window.open(elandmall.util.https("/mypage/initMyCouponList.action"));
	});
	$("a[name='view_shop_map_button']").click(function(e) {
		var cart_seq = $(this).attr("cart_seq");
		var brand_nm = $(this).attr("brand_nm");
		var cust_prod_yn = $(this).attr("cust_prod_yn");

		var goods = ORDER.goods.ord_goods[cart_seq];
		e.preventDefault();
		elandmall.layer.createLayer({
			title: "",
			class_name: "layer_pop d_layer_pop on",
			createContent: function(layer) {
				layer.div_content.load("/order/viewShopMap.action", {
					vend_no: goods.vend_no,
					vir_vend_no: goods.vir_vend_no,
					cust_prod_yn : cust_prod_yn,
					shopcode : goods.shopcode,
					brand_nm : brand_nm
				}, function() {
					if (layer.div_content.find("#field_shop_nm").length > 0) {
						layer.div_content.parent().find("div.lay_tit>strong").text(layer.div_content.find("#field_shop_nm").text());
						layer.show();
						fnKakaoMap({shop_loca: layer.div_content.find("#field_shop_address").text(), div_id: "field_shop_map_div", width: 454, height: 266});

					} else {
						alert("죄송합니다. 매장정보를 조회할 수 없습니다.");	
					};					
				});
			}
		});
	});
	$("#regist_order_button").click(function() {	//구매하기 버튼 클릭
		var button = $(this);
		// NGCPO-5255 [BO] 금/상품권 상품 카카오페이 결제 불가
		// 한번에 체크하는 경우 undefined 발생되는 경우가 있어 나눠서 체크 진행
		if($("a[name=ord_pay_radio][pay_mean_cd=11][payco=Y]").hasClass("disable")
				&& $("a[name=ord_pay_radio][pay_mean_cd=11][payco=Y]").hasClass("selected")
		){
			alert('페이코로 결제할수 없는 상품입니다. \n\n다른 결제 수단을 이용해주십시오.');
			return false;
		}
		if($("a[name=ord_pay_radio][pay_mean_cd=11][kakaopay=Y]").hasClass("disable")
				&& $("a[name=ord_pay_radio][pay_mean_cd=11][kakaopay=Y]").hasClass("selected")
		){
			alert('카카오페이로 결제할수 없는 상품입니다. \n\n다른 결제 수단을 이용해주십시오.');
			return false;
		}
		if($("a[name=ord_pay_radio][pay_mean_cd=11][toss=Y]").hasClass("disable")
			&& $("a[name=ord_pay_radio][pay_mean_cd=11][toss=Y]").hasClass("selected")
		){
			alert('토스로 결제할수 없는 상품입니다. \n\n다른 결제 수단을 이용해주십시오.');
			return false;
		}
		if($("a[name=ord_pay_radio][pay_mean_cd=11][naverpay=Y]").hasClass("disable")
			&& $("a[name=ord_pay_radio][pay_mean_cd=11][naverpay=Y]").hasClass("selected")
		){
			alert('네이버페이로 결제할수 없는 상품입니다. \n\n다른 결제 수단을 이용해주십시오.');
			return false;
		}
		// --NGCPO-5255 [BO] 금/상품권 상품 카카오페이 결제 불가
		
		var resultCnt = 0;
		$.each(ORDER.pay.pays, function(pay_seq) {
			if((this.pay_mean_cd == "15" && this.pay_amt >= 10) //리테일포인트 10원 이상 
					|| (this.pay_mean_cd == "21" && this.pay_amt >= 10)  //예치금 10원 이상 
					|| (this.pay_mean_cd == "62" && this.pay_amt >= 10000)){ // 복지포인트 1만원 이상
				resultCnt ++;
			};
		});
		
		if(resultCnt > 0 && $("#applyYn").val() == "N"){
			alert("포인트 인증 후 사용 가능 합니다.");
			return false;
		}
		
		if (button.attr("today_receive") == "Y"){
			var addr = "";
			var post_no = "";
			//당일배송 무조건 배송지 1개만 가능!
			if($("#select_address_radio_1_1").is(":checked") == true){	//새로운 배송지
				addr =  $("input[name='new_recvr_addr_1']").val();
				post_no = $("input[name='recvr_post_no']").val();
			} else{																//배송지 목록, 기본배송지
				var text = $("span[name='recvr_address']").text(); 				//[우편번호] 주소
				addr =  text.substring(text.indexOf("]")+2, text.length);
				post_no = text.substring(text.indexOf("[")+1, text.indexOf("]"));
			}
		}

		// 상세주소 사용자로부터 입력받음
		$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
			var dlvp = this;
			var cart_grp_cd = this.cart_grp_cd;
			var div = $("div[name='" + (cart_grp_cd == "10" ? "dlvp_area" : "dlvp_gift_area") + "'][dlvp_no='" + dlvp_no + "']");
			var select_address_radio_value = div.find(":input[role='select_address_radio']:checked").val();
			// 비회원인경우 새주소
			if(ORDER.mst.nomember === true) {
				select_address_radio_value = "new";
			}
			if (select_address_radio_value == "new") {
				dlvp.address.recvr_dtl_addr = div.find(":input[name='new_recvr_addr_2']").val();
				dlvp.address.recvr_road_dtl_addr = div.find(":input[name='new_recvr_addr_2']").val();
			}
		});
		if (button.attr("today_receive") == "Y" && addr != "" && post_no != ""){	//당일도착 배송 주소 서울/고양/과천/안양 아닐 경우 결제 진행 불가
			$.ajax({
				url: '/order/checkTodayDeliAdd.action',
				dataType: "json",
				data: {post_no : post_no, recvr_base_addr : addr},
				success: function(data) {
					if(data.result != "0000") {
						elandmall.layer.createLayer({
							class_name:"layer_pop d_layer_pop on",
							title:"서비스 안내",
							layer_id:"quickInfo1",
							createContent: function(layer){
								var div = layer.div_content;
								div.load("/order/openTodayDeliInfoLayer.action", function(e){
									layer.show();	
									DK_dim_Open('quickInfo1', this.id);
									
									div.find("[name=confirmbtn]").click(function(){
										$(".btn_lay_close").click();
									});
									$(".btn_lay_close").click(function(){
										DK_dim_Close('quickInfo1');
									});
								});
							}
						}); 
						return;
					} else {
						if (ORDER.mst.nomember === true) {	//비회원 주문일 경우 비회원 상태로 만들어 주기만 하면 됨....
							elandmall.isLogin({ 
								nomember: true, 
								nomember_proc: true,
								login: function() {
									ORDER.fn.doOrder();
								}
							});
						} else {
							ORDER.fn.loginCheck(function() {
								ORDER.fn.doOrder();
							});			
						};
					}
				}, error : function( e ){
					if ( e.error_message !=null && e.error_message != ""){
						alert(e.error_message);
						return;
					}else{
						alert("처리중 오류가 발생하였습니다.");
						return;
					}
				}
			});	
			
		} else {
			if (ORDER.mst.nomember === true) {	//비회원 주문일 경우 비회원 상태로 만들어 주기만 하면 됨....
				elandmall.isLogin({ 
					nomember: true, 
					nomember_proc: true,
					login: function() {
						ORDER.fn.doOrder();
					}
				});
			} else {
				ORDER.fn.loginCheck(function() {
					ORDER.fn.doOrder();
				});			
			};
		}
	});
	
	//통합포인트조회
	$("#searchPntBtn").click(function() {
		var pnt_seq= $(this).attr('pay_seq');
		$.ajax({
				url: '/order/searchTotPointForOrder.action',
				dataType: "json",
				success: function(result) {
					var pointInfo = result.pointInfo;
					$("#tot_point").text(pointInfo.showElandPoint);
					$('[name="pay_amt_input"]').attr("max_amt",pointInfo.elandPoint);
					$("#point_txt").remove();
					if(pointInfo.elandPoint < 5000){
						$('[name="pay_amt_input"]').attr("disabled","disabled");
						$('[name="pay_amt_chk"]').attr("disabled","disabled");
						$('[name="pay_amt_input"]').attr("not_avaiable","");
						$('[name="pay_amt_chk"]').attr("not_avaiable","");
						$("#point_row").append("<p class='txt_alert_ord01' id='point_txt'>*  <strong class='txt_en'>5,000</strong>원 이상 적립 시 사용가능</p>");
					}else{
						if($("#searchPntBtn").attr("pnt_use_yn") !="N"){
							$('[name="pay_amt_input"]').attr("disabled",false);
							$('[name="pay_amt_chk"]').attr("disabled",false);
							
							$('[name="pay_amt_input"]').removeAttr("not_avaiable");
							$('[name="pay_amt_chk"]').removeAttr("not_avaiable");
						}else{
							$('[name="pay_amt_input"]').attr("disabled","disabled");
							$('[name="pay_amt_chk"]').attr("disabled","disabled");
							$('[name="pay_amt_input"]').attr("not_avaiable","");
							$('[name="pay_amt_chk"]').attr("not_avaiable","");
						}
					}
				}, error : function( e ){
					if ( e.error_message !=null && e.error_message != ""){
						alert(e.error_message);
					}else{
						alert("처리중 오류가 발생하였습니다.");
					}
				}
			});
	});

	
	//휴대폰 인증
	$("#certNoSendBtn,#reCertNoSendBtn").click(function() {
		$.ajax({
			url: '/order/requestCert.action',
			dataType: "json",
			success: function(res) {
				if(res.result == "S"){
					$("#finishTimerYn").val("N"); 
					$("#applyBtn_1").hide();
					$("#applyBtn_2").show();
					clearInterval(tid);
					SetTime = 300;
					tid=setInterval('msg_time()',1000);
				}else{
					alert("처리중 오류가 발생하였습니다.");
				}				
			}, error : function( e ){
				if ( e.error_message !=null && e.error_message != ""){
					alert(e.error_message);
				}else{
					alert("처리중 오류가 발생하였습니다.");
				}
			}
		});
	});
	
	//인증하기
	$("#applyCertNoBtn").click(function() {
		
		if($("#finishTimerYn").val() == "Y"){
			alert("시간이 초과되었습니다. 재인증 해주세요.");
			return false;
		}
		
		$.ajax({
			url: '/order/cert.action',
			dataType: "json",
			data:{
				cert_no : $("#certNo").val()
			},
			success: function(res) {
				if(res.result == "S"){
					$("#applyBtn_1").hide();
					$("#applyBtn_2").hide();
					$("#applyBtn_3").show();
					$("#applyYn").val("Y");
					clearInterval(tid);		// 타이머 해제
				}else{
					alert("인증번호가 정확하지 않습니다.다시 확인 해 주세요");
					return false;
				}
				
			}, error : function( e ){
				if ( e.error_message !=null && e.error_message != ""){
					alert(e.error_message);
				}else{
					alert("처리중 오류가 발생하였습니다.");
				}
			}
		});
	});
	
	// 오늘직송 이벤트 클릭 이벤트
	$("[name='hyper_dlv_area']").each(function(){
		var center_no = $(this).attr("hyper_center");
		$(this).find("input:radio").click(function(){
			var hyper_dlv_radio = $(this);
			var lot_dlv_date = hyper_dlv_radio.attr("lot_dlv_date");
			var lot_dlv_seq  = hyper_dlv_radio.attr("lot_dlv_seq");
			var lot_bgn_tm   = hyper_dlv_radio.attr("lot_bgn_tm");
			var lot_end_tm   = hyper_dlv_radio.attr("lot_end_tm");
			
			if(ORDER.deli.hyper_deli[center_no] != null) {				
				$.each(ORDER.deli.hyper_deli[center_no], function(idx, hyper){
					if (hyper.lot_dlv_date == lot_dlv_date && hyper.lot_dlv_seq == lot_dlv_seq) {
						hyper.select_yn = "Y";
					} else {
						hyper.select_yn = "N";
					}
				});
			}
		});
	});
	
	$("[name='hyper_dlv_area'] > input:radio").click();
	// [END] 사용자 이벤트 처리
});


var tid;
var SetTime = 300;		// 최초 설정 시간(기본 : 초)

function msg_time() {	// 1초씩 카운트
	var m = "0"+Math.floor(SetTime / 60)+":"+((SetTime % 60)<10?"0":"")+(SetTime % 60);	 // 남은 시간 계산
	
	$("#viewTimer").html(m);
	SetTime--;	// 1초씩 감소
	
	if (SetTime < 0) {			// 시간이 종료 되었으면..
		clearInterval(tid);		// 타이머 해제
		$("#finishTimerYn").val("Y"); // 히든값으로 YN 유무 
	}
}