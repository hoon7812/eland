$(document).ready(function() {
	var base_dlvp_div = $("div[name='dlvp_area'][role='default']");	//기본 배송지 div
	var base_digital_dlvp_div = $("div[name='dlvp_gift_area'][role='default']");	//디지털 상품권 배송지 div
	var base_quick_dlvp_div = $("div[name='dlvp_quick_area'][role='default']");	//퀵상품 배송지 div
	var select_vbank = $("#select_vbank").change(function() {
		ORDER.fn.updatePaymentText({ pay_mean_cd: "13" });
		if (this.value != "") {
			elandmall.util.ga("MW_주문서 작성", "4.결재수단_무통장입금", $(this).find(":selected").text());			
		};
	});
	var select_credit_card = (function() {
		return $("#select_credit_card").change(function() {
			if($(this).find(":selected").val() != ''){
				elandmall.util.ga(gaCate, "신용카드", $(this).find(":selected").text());
			}
			ORDER.fn.updatePaymentText({ pay_mean_cd: "11" });
		});
	})();
	var select_credit_card_installment = $("#select_credit_card_installment");
	var payment_info_text_em = $("#payment_info_text_em");
	
	ORDER.fn.select_credit_card = select_credit_card;
	ORDER.fn.select_credit_card_installment = select_credit_card_installment;
	ORDER.fn.select_vbank = select_vbank;
	ORDER.fn.base_dlvp_div = base_dlvp_div;
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
	
	(function(){
		var ico_open = $(".order_content .ico_open");		
		ico_open.click(function(e) {
			var open = $(this);
			var role = open.attr("role");
			var ga_action = (function() {
				var action = "";
				switch (role) {
					case "delivery":
						action = "2. 배송지정보";
						break;
					case "order_items":
						action = "3. 주문하실 상품";
						break;
					case "dc_benefit":
						action = "4. 할인혜택";
						break;
					case "ordererinfo":
						action = "1. 주문자";
						break;
					default:
						break;
				};
				return action;
			})();
			e.preventDefault();
			open.toggleClass("selected");
			//open.prev().filter(".txt_order").toggleClass("on");
			open.parent().find(".txt_order").toggleClass("on");
			
			open.parent().next().slideToggle(200);
			if (open.attr("id") == "ico_open_payments") {
				if (open.hasClass("selected") === false) {
					if ($("#notice_guarantee_insurance").is(":visible")) {
						$("#notice_guarantee_insurance").hide();						
					};
				} else {
					//무통장/계좌이체일 경우만 보여주기
					ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
						if ($(this).attr("pay_mean_cd") == "12" || $(this).attr("pay_mean_cd") == "13") {
							$("#notice_guarantee_insurance").show();
						};	
					});
				};				
			};
			if (ga_action != "") {
				elandmall.util.ga(_ga_category, ga_action, open.hasClass("selected") ? "내용숨김" : "확대버튼");
			};
		}); 
		
		// 주문자 탭 닫기 
		ico_open.each(function(){
			if($(this).attr("role")=="ordererinfo" ){
				$(this).click();
			}
		})
		
	})();
	// [START] 상품별 희망 배송일
	(function() {
		var count = 0;
		var params = {
			cart_seq: [], start_date: [], end_date: [], dlvp_seq: []
		};
		var setDeliHopeDate = function(e) {
			var yyyymmdd = e.target ? this.value : e.yyyymmdd ;
			var cart_seq = e.target ? $(this).attr("cart_seq") : e.cart_seq ;
			var dlvp_no = e.target ? $(this).attr("dlvp_no") : e.dlvp_no ;
			var dlvp_seq = e.target ? $(this).attr("dlvp_seq") : e.dlvp_seq ;		
			ORDER.dlvp.ord_dlvps[dlvp_no].ord_deli[dlvp_seq].ord_goods[cart_seq].deli_hope_dtime = yyyymmdd; 
			ORDER.goods.ord_goods[cart_seq].deli_hope_dtime = yyyymmdd;
		};
		var deli_hope_select = $("select[name='deli_hope_select']").each(function() {
			var select = $(this);
			var cart_seq = select.attr("cart_seq");
			var goods = ORDER.goods.ord_goods[cart_seq];
			var dates = goods.deli_hope_date.split("|");
			var order_divi_cd = select.attr("order_divi_cd");
/*			if (order_divi_cd == "10") {	//모던가구는 배송희망일 별도 조회
				return false;
			};*/
			if (goods.deli_hope_day_yn == "Y" && dates.length == 2 && (order_divi_cd != "10" && order_divi_cd != "30")) {
				count++;
				params.cart_seq.push(cart_seq);
				params.start_date.push(dates[0]);
				params.end_date.push(dates[1]);
			};
		}).change(setDeliHopeDate).click(function() {
			var select = $(this);
			var order_divi_cd = select.attr("order_divi_cd");
			var dlvp_no = select.attr("dlvp_no");
			var dlvp = ORDER.dlvp.ord_dlvps[dlvp_no]
			var post_no = dlvp.address.addr_divi_cd == "10" ? dlvp.address.recvr_post_no : dlvp.address.recvr_road_post_no;
			console.log("post_no = %s", post_no);
			if ((order_divi_cd == "10" || order_divi_cd == "30") && select.find("option[value!='']").length == 0) {
				if (post_no != "") {
					if (select.attr("msg") != undefined) {
						alert(select.attr("msg"));
					} else {
						alert("배송이 불가능한 주소입니다. 도로명주소(신 우편번호)를 사용해주세요.");
					};
				} else {
					alert("배송지 정보를 먼저 입력해 주세요.");					
				};
				return false;
			};
		});
		if (count > 0) {
			$.ajax({
				url: "/order/searchDeliHopeDates.action",
				data: $.param(params),
				type: "POST",
				dataType: "json",
				success: function(data) {
					$.each(data, function(cart_seq) {
						var goods = ORDER.goods.ord_goods[cart_seq];
						var dates = goods.deli_hope_date.split("|");
						var start_date = new Date(dates[0].substring(0, 4), +dates[0].substring(4, 6) - 1, dates[0].substring(6)); 
						var end_date = new Date(dates[1].substring(0, 4), +dates[1].substring(4, 6) - 1, dates[1].substring(6));
						var holiday = this;
						var select = deli_hope_select.filter("[cart_seq='" + cart_seq + "']");
						var yyyymmdd = "";
						for (var i = 0 ; ; i++) {
							if (!holiday[start_date.format("yyyyMMdd")]) {
								if (yyyymmdd == "") {
									yyyymmdd = start_date.format("yyyyMMdd");
								};
								select.append("<option value='" + start_date.format("yyyyMMdd") + "'>" + start_date.format("yyyy-MM-dd(E)") + "</option>");																
							};
							start_date.setDate(start_date.getDate() + 1);
							if (start_date.format("yyyyMMdd") > end_date.format("yyyyMMdd")) {
								break;
							};
						};
					});
				},
				error: function() {
					alert("배송이 불가능한 주소입니다. 도로명주소(신 우편번호)를 사용해주세요.");			
				}
			});			
		};
	})();
	// [END] 상품별 희망 배송일
	
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
		var sTicket = element.attr("data-ticket"); //상품권 카드결제 유무
		var pay = {
			pay_seq: pay_seq,
			pay_mean_cd: pay_mean_cd,
			ticket : sTicket,
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
						prType: "MPM",
						channelType: "2"						
					};
				} else if (kakaopay == "Y") {
					return {
						kakaopay: true,
						prType: elandmall.global.apptype ? "MPM" : "WPM",
						channelType: elandmall.global.apptype ? "2" : "4"						
					};
				} else if (payco == "Y") {
					return {
						payco: true,
						mobile: elandmall.global.apptype ? true : false
					};
				} else if (toss == "Y") {
					return {
						toss: true,
						mobile: true
					};
				}  else if (naverpay == "Y") {
					return {
						naverpay: true,
						mobile: elandmall.global.apptype ? true : false
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
				var bank_cd = select_vbank.val();
				var settle = ORDER.pay.usable_settles["13"][bank_cd];
				return {
					bank_cd: bank_cd,
					morc_nm: $("#morc_nm").val(),
					expiry_date: select_vbank.attr("expiry_date"),
					expiry_dtime: $("#select_vbank").attr("expiry_dtime")
				};
			};
		} else if (pay_mean_cd == "21" || pay_mean_cd == "15" || pay_mean_cd == "62") {	//예치금, 통합포인트
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
					var button = $(this);
					var role = button.attr("role");
					if (role == "use") {
						all_in_amt = ORDER.fn.final_pay_amt + pay.pay_amt;
						if(pay_mean_cd =="15"){
							max_amt = $('[name="pay_amt_input"]').attr('max_amt');
						}
						if (all_in_amt > max_amt) {
							all_in_amt = max_amt;
						};
						if (pay_mean_cd == "15") {
							all_in_amt = parseInt(all_in_amt / 10) * 10;
						};						
					};
					setDepositAmt(all_in_amt);
					if (role == "use" && all_in_amt > 0) {
						button.attr({ role: "cancel" }).text("사용취소");
					} else if (role == "cancel") {
						button.attr({ role: "use" }).text("모두사용");
					};
					
					// ga 태그 추가	
					if ( pay_mean_cd == "15" ) {
						elandmall.util.ga(_ga_category, '할인혜택_포인트', role == "use" ? "모두사용" : "사용취소");
					}else{
						elandmall.util.ga(_ga_category, '할인혜택_예치금', role == "use" ? "모두사용" : "사용취소");
					}
				});
				pay.pay_amt = 0;
				pay.reset = function() {
					ORDER.pay.pays[pay_seq].pay_amt = 0;
					all_in_checkbox.prop("checked", false);
					element.val("0");
					$("#all_in_checkbox_" + pay_seq).attr({ role: "use" }).text("모두사용");
				};
				element.numberInput({
					focus: function(number) {
						var pay = ORDER.pay.pays[pay_seq];
						number.val(pay.pay_amt == 0 ? "" : pay.pay_amt);  
					},
					blur: function() {
						var pay_amt = ORDER.pay.pays[pay_seq].pay_amt;
						var val = $.trim(element.val());
						if ($.isNumeric(val)) {
							val = +val;
							if(pay_mean_cd=="15"){
								max_amt = $('[name="pay_amt_input"]').attr('max_amt');
							}
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
						setDepositAmt(pay_amt);
					}
				});				
			})();
		};
		ORDER.pay.add(pay);
	});
	// [END] 결제 수단
	
	// [START] 혜택 셋팅
	ORDER.fn.staffBenefit();	//직원할인 + 상품쿠폰
	$(":input[name='staff_coupon_select']").change(function() {
		var select = $(this);
		if (this.value == "") {
			$("#benefit_1000000010_" + select.attr("cart_seq") + " div.right>em").text("-0");
		}
		elandmall.util.ga(_ga_category,'주문하실 상품', this.value != "" ? select.find(":selected").text() : "");	
	});
	ORDER.fn.doubleCouponCombo();	//더블쿠폰영역
	ORDER.fn.cartCouponCombo();		//장바구니쿠폰영역
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
			//키디키디 iframe + IE에서 접근한 경우 비씨카드(01), 삼성카드(04) 결제 이슈 처리
			var agent_chk = navigator.userAgent.toLowerCase();
			if ((self != top) && ((navigator.appName == 'Netscape' && agent_chk.indexOf('trident') != -1) || (agent_chk.indexOf("msie") != -1))) {
				if(reserved_cardcomp_no == "01" || reserved_cardcomp_no == "04"){
					reserved_cardcomp_no = "";
					return false;
				}
			}
			ORDER.fn.changeCard(undefined, { cardcomp_cd: reserved_cardcomp_no });
		} else if (reserved_pay_mean_cd == "13") {
			select_vbank.val(reserved_bank_cd);
		};
		ORDER.fn.clickPayRadioButton(undefined, { pay_mean_cd: reserved_pay_mean_cd, kakao: reserved_kakao ,kakaopay: reserved_kakaopay, payco: reserved_payco, toss: reserved_toss, naverpay: reserved_naverpay });	//기본 결제 수단 선택(라디오버튼)
	})();
	
	// [START] 사용자 이벤트
	select_credit_card.change(ORDER.fn.changeCard);
	select_credit_card_installment.change(ORDER.fn.changeCardInstallment);
	
	$("#digital_gift_dlvp_select").change(function() {	//디지털 상품권 발송개수 변경
		var select = $(this);
		var role = select.attr("role");
		var dlvp_count = +select.val();
		var added_dlvp_div = $("<div></div>").attr({ name: "dlvp_increase_area", id: "dlvp_increase_area" });
		var base_dlvp = undefined;
		$("div[name='dlvp_gift_area'][role='added']").each(function() {
			delete ORDER.dlvp.ord_dlvps[$(this).attr("dlvp_no")];
		});
		$("#dlvp_increase_area").remove();	//추가된 배송지 영역 제거
		if (role == "digital") {
			base_dlvp = base_digital_dlvp_div;
			(function() {
				if (dlvp_count > 1) {	//일단 기본 배송지에 대한 UI 처리
					base_dlvp.find("div.count").show();
					base_dlvp.find("div.top_deli").show();
				} else {
					base_dlvp.find("div.count").hide();
					base_dlvp.find("div.top_deli").hide();
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
		
		if (role == "digital") {
			ORDER.fn.resetOrdDigitalQty();	//배송지별 주문수량 초기화
		};
	});
	
	$("#open_payments_button").click(function(e) {
		e.preventDefault();
		$("#ico_open_payments").click();
	});
	$(":input[type='number'][maxlength]").bind("keyup paste", function() {
		var maxlength = $(this).attr("maxlength");
		this.value = this.value.slice(0, maxlength);
	});
	(function() {	//주문자변경
		var orderer_div = $("#orderer_div");
		var orderer_info_div = orderer_div.find("div[name='orderer_info_div']");
		var new_orderer_nm= $("#new_orderer_nm");
		var new_cell_no1 = $("#new_cell_no1");
		var new_cell_no2 = $("#new_cell_no2");
		var new_cell_no3 = $("#new_cell_no3");
		var new_email = $("#new_email");
		orderer_info_div.find("a[name='orderer_info_button']").click(function() {
			var button = $(this);
			var role = button.attr("role");
			try {
				
				if (role == "modify") {
					new_orderer_nm.val(ORDER.mst.ord_mst.orderer_nm);
					new_email.val(ORDER.mst.ord_mst.email);
					new_cell_no1.val(ORDER.mst.ord_mst.cell_no1);
					new_cell_no2.val(ORDER.mst.ord_mst.cell_no2);
					new_cell_no3.val(ORDER.mst.ord_mst.cell_no3);
				} else {	//입력값 확인
					new_orderer_nm.each(function() {
						if ($.trim(this.value) == "") {
							this.focus();
							throw "이름을 입력하세요";
						};
					});
					if(ORDER.mst.ord_mst.present_yn != "Y") {
					
						new_email.each(function() {
							if ($.trim(this.value) == "") {
								this.focus();
								throw "이메일을 입력하세요";
							};
						});
						
						if (elandmall.validate.isValidEmail($.trim(new_email.val())) === false) {
							new_email.focus();
							throw "이메일 주소가 올바르지 않습니다.";
						};
					}
					
					$("#new_cell_no1, #new_cell_no2, #new_cell_no3").each(function(i) {
						if ($.trim(this.value) == "") {
							this.focus();
							throw "휴대폰 번호를 입력하세요!";
						};
						
						if ($.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)
								|| (i == 1 && $.trim(this.value).length > 4)) {
							this.focus();
							throw "휴대폰 번호는 최소 7자리 이상 8자리 이하로 입력해 주세요.";
						};
					});
					
					
					ORDER.mst.ord_mst.orderer_nm = $.trim(new_orderer_nm.val());
					ORDER.mst.ord_mst.email = $.trim(new_email.val());
					ORDER.mst.ord_mst.cell_no1 = $.trim(new_cell_no1.val());
					ORDER.mst.ord_mst.cell_no2 = $.trim(new_cell_no2.val());
					ORDER.mst.ord_mst.cell_no3 = $.trim(new_cell_no3.val());
				};
				orderer_info_div.filter(":visible").hide();
				orderer_info_div.filter("[role='" + role + "']").each(function() {
					var div = $(this)
					div.show();
					div.find("div[name='orderer_nm']").text(ORDER.mst.ord_mst.orderer_nm);
					div.find("div[name='email']").text(ORDER.mst.ord_mst.email);
					div.find("div[name='cell_no']").text(ORDER.mst.ord_mst.cell_no1 + "-" + ORDER.mst.ord_mst.cell_no2 + "-" + ORDER.mst.ord_mst.cell_no3);
					$("#orderer_info_text").text(ORDER.mst.ord_mst.orderer_nm +"("+ ORDER.mst.ord_mst.cell_no1 + "-" + ORDER.mst.ord_mst.cell_no2 + "-" + ORDER.mst.ord_mst.cell_no3 +")");
				});
			} catch (e) {
				alert(e);
			};
		});
		if (ORDER.mst.nomember === true) {
			//new_email_2.prop("readonly", false);
		};
	})();
	$("#guarantee_insurance_button").click(function(e) {	//보증보험
		var layer_id = "GUARANTEE_INSURANCE_LAYER";
		var button = $(this);
		var div = (function() {
			if ($("#" + layer_id).length > 0) {
				$("#" + layer_id).remove();
			};
			return $("<div id='" + layer_id + "' class='layer_fix'></div>").appendTo("body");
		})();
		e.preventDefault();
		
		div.load("/order/showLayer.action", {
			page: "GuaranteeInsurance"
		}, function() {
			var birth_select = div.find(":input[name='birth_select']");
			var guarantee_insurance_gend_radio = div.find(":radio[name='guarantee_insurance_gend_radio']");
			var yyyy = "";
			var mm = "";
			var dd = "";
			var date = new Date();
			var guarantee_birth_day = $("#guarantee_birth_day");
			var birty_day = guarantee_birth_day.val() != "" ? guarantee_birth_day.val() : ORDER.mst.ord_mst.birth_day ;
			var guarantee_gend_cd = $("#guarantee_gend_cd");
			var gend_cd = guarantee_gend_cd.val() != "" ? guarantee_gend_cd.val() : ORDER.mst.ord_mst.gend_cd ;
			var guarantee_insurance_yn = $("#guarantee_insurance_yn");
			var guarantee_insurance_info_div = div.find("[name='guarantee_insurance_info_div']");
			var guarantee_insurance_checkbox = div.find("#guarantee_insurance_checkbox").click(function(e) {
				if (this.checked) {
					guarantee_insurance_info_div.show();
				} else {
					guarantee_insurance_info_div.hide();
				};
			});
			var validate = function() {
				guarantee_insurance_checkbox.each(function() {
					if (this.checked !== true) {
						this.focus();
						throw "가입확인을 선택하세요";	
					};
					//생년월일
					birth_select.each(function(i) {
						if (this.value == "") {
							this.focus();
							throw "생년월일을 선택하세요";
						};
						if (i == 0) {
							yyyy = this.value;
						} else if (i == 1) {
							mm = this.value;
						} else if (i == 2) {
							dd = this.value;
						};
					});
					date.setYear(yyyy);
					date.setMonth(+mm - 1);
					date.setDate(dd);
					if (yyyy + "" + mm + "" + dd != date.format("yyyyMMdd")) {
						birth_select.filter(":eq(2)").focus();
						throw "생년월일이 올바르지 않습니다";
					};
					//성별확인
					if (guarantee_insurance_gend_radio.filter(":checked").length == 0) {
						guarantee_insurance_gend_radio.filter(":eq(0)").focus();
						throw "성별을 선택하세요";
					};
					div.find("#guarantee_insurance_checkbox_2, #guarantee_insurance_checkbox_3").each(function(i) {
						if (this.checked === false) {
							this.focus();
							throw "보증보험 개인정보 제공 및 SMS 수신에 동의 하세요";
						};
					});
					guarantee_insurance_yn.val("Y");
					guarantee_birth_day.val(yyyy + "" + mm + "" + dd);							
					guarantee_gend_cd.val(guarantee_insurance_gend_radio.filter(":checked").val());
				});
			};
			
			if (birty_day && birty_day.length == 8) {	//기본 회원정보의 생년월일 셋팅
				birth_select.each(function(i) {
					this.value = (function() {
						if (i == 0) {
							return birty_day.substring(0, 4);
						} else if (i == 1) {
							return birty_day.substring(4, 6);
						} else if (i == 2) {
							return birty_day.substring(6);
						}					
					})();
				});
			};
			if (gend_cd && (gend_cd == "M" || gend_cd == "F")) {	//기본 회원정보의 성별 셋팅
				guarantee_insurance_gend_radio.filter("[value='" + gend_cd + "']").prop("checked", true);		
			};
			
			if (guarantee_insurance_yn.val() == "N") {						
				div.find("#guarantee_insurance_apply_ul").show();
				div.find("#guarantee_insurance_modify_ul").hide();
			} else {
				div.find("#guarantee_insurance_checkbox_2, #guarantee_insurance_checkbox_3").prop("checked", true);
				guarantee_insurance_checkbox.click();
				div.find("#guarantee_insurance_apply_ul").hide();
				div.find("#guarantee_insurance_modify_ul").show();
			};
			div.find("#apply_button").click(function(e) {
				e.preventDefault();
				try {
					validate();
					if ($("#guarantee_insurance_yn").val() == "Y") {
						button.text("쇼핑몰 보증보험서 발급신청 수정하기");									
					} else {
						button.text("쇼핑몰 보증보험서 발급신청");
					};
					layer_fix_close(layer_id);
				} catch (e) {
					alert(e);	
				};
			});
			div.find("#modify_cancel_button").click(function(e) {
				e.preventDefault();
				layer_fix_close(layer_id);
			});
			div.find("#guarantee_insurance_close_button").click(function(e) {
				e.preventDefault();
				layer_fix_close(layer_id);
			});
			div.find("#modify_ok_button").click(function(e) {
				e.preventDefault();
				if (guarantee_insurance_checkbox.is(":checked") === true) {	//내용 수정
					try {
						validate();
						layer_fix_close(layer_id);
					} catch (e) {
						alert(e);
					};
				} else {	//가입취소
					guarantee_insurance_yn.val("N");
					guarantee_birth_day.val("");							
					guarantee_gend_cd.val("");
					button.text("쇼핑몰 보증보험서 발급신청");
					layer_fix_close(layer_id);
				};
			});			
			fn_layer_open(layer_id);
		});
		ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
			var radio = $(this);
			var pay_mean_cd = radio.attr("pay_mean_cd");
			var ga_action = (function() {
				if (pay_mean_cd == "12") {
					return "4.결재수단_계좌이체";
				} else if (pay_mean_cd == "13") {
					return "4.결재수단_무통장입금";
				};
			})();
			if (ga_action && ga_action != "") {
				elandmall.util.ga("MW_주문서 작성", ga_action, "쇼핑몰 보증보험서 발급신청");
			};
		});
	});
	(function() {	//현금영수증
		var cash_receipt_area_div = ORDER.fn.cash_receipt_area_div;
		var cash_receipt_sub_area_div = cash_receipt_area_div.find("div[name='cash_receipt_sub_area_div']");
		var cash_receipt_issue_div = cash_receipt_area_div.find("div[role='cash_receipt_issue_div']");
		var cash_receipt_radio = $("#cash_receipt_radio_1, #cash_receipt_radio_2");
		var cash_receipt_use_divi_radio = cash_receipt_area_div.find("[name='cash_receipt_use_divi_radio']");
		var cash_receipt_use_div = cash_receipt_area_div.find("[role='cash_receipt_use_div']");
		var cash_receipt_cell_no1 = $("#cash_receipt_cell_no1");
		cash_receipt_area_div.find(":input[role='cash_receipt_cell_no']").each(function(i) {
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
		$("#cash_receipt_checkbox").click(function() {
			if (this.checked) {
				cash_receipt_sub_area_div.show();
			} else {
				cash_receipt_sub_area_div.hide();
			};
		});
		cash_receipt_radio.click(function(e) {
			var button = $(this);
			var issue_cd = button.attr("issue_cd");
			if (button.parent().hasClass("selected")) {
				return false;
			};
			cash_receipt_radio.filter("[issue_cd!='" + issue_cd + "']").parent().removeClass("selected");
			button.parent().addClass("selected");
			cash_receipt_issue_div.filter("[issue_cd='" + issue_cd + "']").show();
			cash_receipt_issue_div.filter("[issue_cd!='" + issue_cd + "']").hide();
			
			ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
				var radio = $(this);
				var pay_mean_cd = radio.attr("pay_mean_cd");
				var ga_action = (function() {
					if (pay_mean_cd == "12") {
						return "4.결재수단_계좌이체_현금영수증발급";
					} else	if (pay_mean_cd == "13") {
						return "4.결재수단_무통장입금_현금영수증발급";
					};
				})();
				var ga_label = (function() {
					if (issue_cd == "10") {
						return "개인소득공제";
					} else if (issue_cd == "20") {
						return "지출증빙용";
					};
				})();
				if (ga_action && ga_action != "" && ga_label && ga_label != "") {
					elandmall.util.ga("MW_주문서 작성", ga_action, ga_label);
				};
			});
		});
		cash_receipt_use_divi_radio.click(function() {
			var use_divi_cd = this.value;
			cash_receipt_use_div.filter("[use_divi_cd='" + use_divi_cd + "']:not(:visible)").show();
			cash_receipt_use_div.filter("[use_divi_cd!='" + use_divi_cd + "']:visible").hide();
		});
		cash_receipt_cell_no1.change(function() {
			var ga_label = this.value;
			ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
				var radio = $(this);
				var pay_mean_cd = radio.attr("pay_mean_cd");
				var ga_action = (function() {
					if (pay_mean_cd == "12") {
						return "4.결재수단_계좌이체_현금영수증발급";
					} else	if (pay_mean_cd == "13") {
						return "4.결재수단_무통장입금_현금영수증발급";
					};
				})();
				if (ga_action && ga_action != "" && ga_label && ga_label != "") {
					elandmall.util.ga("MW_주문서 작성", ga_action, ga_label);
				};
			});
		});
	})();
	$(":checkbox[name='cash_receipt_buttonxxx'], a[name='cash_receipt_buttonxxx']").click(function(e) {	//현금영수증 발금/개인소득공제/지출 증빙용
		var button = $(this);
		var type = button.attr("type");
		var pay_mean_cd = button.attr("pay_mean_cd");
		var value = button.attr("value");
		if (type == "checkbox") {
			if (this.checked) {
				$("#cash_receipt_area_01_" + pay_mean_cd).show();				
				$("#cash_receipt_area_02_" + pay_mean_cd).show();
			} else {
				$("#cash_receipt_area_01_" + pay_mean_cd).hide();				
				$("#cash_receipt_area_02_" + pay_mean_cd).hide();
			};
		} else {
			e.preventDefault();
			if (button.parent().hasClass("selected")) {
				return false;
			};			
			button.parent().parent().each(function() {
				$(this).find(".selected").removeClass("selected");				
			});
			button.parent().addClass("selected");
			button.parent().parent().parent().next().find("div[name='cash_receipt_sub_area_div']:visible").hide();
			$("#cash_receipt_sub_area_" + value + "_" + pay_mean_cd).show();
		};
	});
	$(":input[role='cash_receipt_radio']").click(function(e) {
		var radio = $(this);
		var status = radio.attr("status");
		if (status == "Y") {
			return false;
		};
		radio.attr("status", "Y").siblings("[status='Y']").attr("status", "N");
		radio.parent().siblings().each(function() {
			var ul = $(this);
			if (ul.is(":visible")) {
				ul.hide();
			} else {
				ul.show();
			};
		});		
	});
	(function() {
		var add_refund_bank_button = $("#add_refund_bank_button");
		var clickRefundReqRadio = function(e, button) {
			var button = e ? $(this) : button ;
			var value = button.attr("value");
			if (e) {
				e.preventDefault();				
			};
			if (button.parent().hasClass("selected")) {
				return false;
			};
			button.parent().siblings().removeClass("selected");
			button.parent().addClass("selected");
			
			if (value == "10") {	//계좌 환불
				$("#refund_req_bank_div").show();
				if (add_refund_bank_button.length == 0 || add_refund_bank_button.attr("click_yn") == "Y") {
					$("#new_refund_bank_area").show();				
				} else {
					$("#my_refund_bank_area").show();				
				};
			} else if (value == "20") {	//예치금 환불
				$("#new_refund_bank_area").hide();
				$("#my_refund_bank_area").hide();
			};
			
			ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
				var radio = $(this);
				var pay_mean_cd = radio.attr("pay_mean_cd");
				var ga_action = (function() {
					if (pay_mean_cd == "13") {
						return "4.결재수단_무통장입금_환불방법선택";
					};
				})();
				var ga_label = value == "10" ? "입력계좌로환불" : "예치금으로환불" ;
				if (ga_action && ga_action != "" && ga_label && ga_label != "") {
					elandmall.util.ga("MW_주문서 작성", ga_action, ga_label);
				};
			});
		};
		$("#refund_method_agree_checkbox").click(function() {
			//refund_req_type_radio_1 : 입력계좌로 환불, refund_req_type_radio_2 : 예치금으로 환불
			var refund_req_type_radio = ORDER.mst.nomember !== true ? $("#refund_req_type_radio_2") : $("#refund_req_type_radio_1") ;	//비회원은 예치금 환불 없으므로 입력계좌가 기본임
			var refund_req_type_cd = refund_req_type_radio.attr("value");
			clickRefundReqRadio(undefined, refund_req_type_radio);
			if (this.checked === false) {
				$("#refund_req_type_div").hide();
				$("#refund_req_bank_div").hide();
			} else {				
				$("#refund_req_type_div").show();
				if (refund_req_type_cd == "10") {	//입금계좌로 환불
					$("#refund_req_bank_div").show();
				};
			};
		});
		$("a[name='refund_req_type_radio']").click(clickRefundReqRadio);	//환불방법
		$("#add_refund_bank_button").click(function(e) {
			e.preventDefault();
			$("#refund_req_bank_cd").val(ORDER.mst.account_owner_mgmt.bank_cd);
			$("#refund_req_depor_nm").val(ORDER.mst.account_owner_mgmt.morc_nm);
			$("#refund_req_account_no").val(ORDER.mst.account_owner_mgmt.account_no);
			$("#new_refund_bank_area").show();
			$("#my_refund_bank_area").hide();
			$(this).attr("click_yn", "Y");
		});	
		$("#cert_account_button").click(function(e) {
			e.preventDefault();
			ORDER.fn.certAccount(e);
		});	//계좌확인		
	})();
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
	$("#view_card_benefit_layer_button").click(function(e) {
		e.preventDefault();
		fn_layer_open("pop_card");
	});
	$("a[name='view_shop_map']").click(function(e) {	//매장정보 보기
		e.preventDefault();
		var button = $(this);
		elandmall.map.viewShopLayer({
			vend_no: button.attr("vend_no"),
			vir_vend_no: button.attr("vir_vend_no"),
			cust_prod_yn: button.attr("cust_prod_yn"),
			shopcode : button.attr("shopcode"),
			brand_nm : button.attr("brand_nm"),
			rtn_btn_id: "#" + button.attr("id")
		});
	});
	$("#regist_order_button").click(function(e) {	//구매하기 버튼 클릭
		var button = $(this);
		e.preventDefault();
		
		if (button.attr("today_receive") == "Y"){
			var addr = "";
			var post_no = "";
			
			if($("#address_select_tab").find("li").eq(0).hasClass("selected")){			//배송지
				var text = $("div[name='recvr_addr']").text(); 				//[우편번호] 주소
				addr =  text.substring(text.indexOf("]")+2, text.length);
				post_no = text.substring(text.indexOf("[")+1, text.indexOf("]"));
			} else if($("#address_select_tab").find("li").eq(1).hasClass("selected")){	//새로운 배송지
				addr =  $("#new_recvr_addr_1").val();
				post_no = $("#new_recvr_post_no").val();
			}
		}		
		
		// 상세주소 사용자로부터 입력받음
		$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
			var dlvp = this;
			var div = dlvp.div ;
			var cart_grp_cd = this.cart_grp_cd;
			var select_address_radio_value = $("#address_select_tab li.selected").attr("role_value");
			// 비회원인경우 새주소
			if (ORDER.mst.nomember === true) {
				select_address_radio_value = "new"
			}
			if (select_address_radio_value == "new") {
				dlvp.address.recvr_dtl_addr = div.find(":input[name='new_recvr_addr_2']").val();
				dlvp.address.recvr_road_dtl_addr = div.find(":input[name='new_recvr_addr_2']").val();
			}
		});

		
		if (button.attr("today_receive") == "Y" && addr != "" && post_no != ""){	//당일도착 배송 + 주소가 서울이 아닐 경우			
			$.ajax({
				url: '/order/checkTodayDeliAdd.action',
				dataType: "json",
				data: {post_no : post_no, recvr_base_addr : addr},
				success: function(data) {
					if(data.result != "0000") {
						fn_layer_open("qkDlv");
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
						ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
							var radio = $(this);
							var pay_mean_cd = radio.attr("pay_mean_cd");
							var kakao = radio.attr("kakao");
							var kakaopay = radio.attr("kakaopay");
							var ga_action = (function() {
								if (pay_mean_cd == "11") {
									return "4.결재수단_" + (kakao == "Y" || kakaopay == "Y" ? "카카오페이" : "신용카드");
								} else if (pay_mean_cd == "12") {
									return "4.결재수단_계좌이체";
								} else if (pay_mean_cd == "13") {
									return "4.결재수단_무통장입금";
								}else if (pay_mean_cd == "14") {
									return "휴대폰 결제";
								};
							})();
							var ga_label = button.find("strong").text() ;
							if (ga_action && ga_action != "" && ga_label && ga_label != "") {
								elandmall.util.ga("MW_주문서 작성", ga_action, ga_label);
							};
						});
					}
				}, error : function( e ){
					if ( e.error_message !=null && e.error_message != ""){
						alert(e.error_message);
					}else{
						alert("처리중 오류가 발생하였습니다.");
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
			ORDER.fn.ord_pay_radio.filter(".selected").each(function() {
				var radio = $(this);
				var pay_mean_cd = radio.attr("pay_mean_cd");
				var kakao = radio.attr("kakao");
				var kakaopay = radio.attr("kakaopay");
				var ga_action = (function() {
					if (pay_mean_cd == "11") {
						return "4.결재수단_" + (kakao == "Y" || kakaopay == "Y" ? "카카오페이" : "신용카드");
					} else if (pay_mean_cd == "12") {
						return "4.결재수단_계좌이체";
					} else if (pay_mean_cd == "13") {
						return "4.결재수단_무통장입금";
					}else if (pay_mean_cd == "14") {
						return "휴대폰 결제";
					};
				})();
				var ga_label = button.find("strong").text() ;
				if (ga_action && ga_action != "" && ga_label && ga_label != "") {
					elandmall.util.ga("MW_주문서 작성", ga_action, ga_label);
				};
			});
		}
		
	});
	$("#cts_tit_sub").find("button").click(function(e) {
		elandmall.util.ga(_ga_category, "상단_공통", "전단계 이동");
	});	
	
	$("#btnCert1, #btnCert2").click(function() {
		var type = "";
		
		if(this.id == "btnCert1"){
			 type = $('[name="rdo_pnt"]').filter(":checked").attr("data-value");
		} else {
			 type = $('[name="rdo_pnt2"]').filter(":checked").attr("data-value");
		}
			
		$.ajax({
			url: '/order/requestCert.action',
			dataType: "json",
			data:{
				type : type
			},
			success: function(res) {
				if(res.result == "S"){
					$("#cert_no_chk").val("F");
					clearInterval(tid);
					SetTime = 300;
					tid=setInterval('msg_time()',1000);
					$("#divCert1").hide();
					$("#divCert2").show();
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

	$("#btnCertChk").click(function() {
		if(SetTime < 1){
			alert("시간이 초과되었습니다. 재인증 해주세요.");
			return false;
		}
		$.ajax({
			url: '/order/cert.action',
			dataType: "json",
			data:{
				cert_no : $("#cert_no").val()
			},
			success: function(res) {
				if(res.result == "S"){
					$("#divCert1").hide();
					$("#divCert2").hide();					
					$("#divCert3").show();
					$("#cert_no_chk").val("S");
					clearInterval(tid);		// 타이머 해제
				}else{
					alert("인증번호가 정확하지 않습니다.다시 확인 해 주세요");
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
	
	var tid;
	var SetTime = 300;		// 최초 설정 시간(기본 : 초)

	msg_time = function() {	// 1초씩 카운트
		var m = "0"+Math.floor(SetTime / 60)+":"+((SetTime % 60)<10?"0":"")+(SetTime % 60);	 // 남은 시간 계산
		
		$("#spanCertTime").html(m);
		SetTime--;	// 1초씩 감소
		
		if (SetTime < 0) {			// 시간이 종료 되었으면..
			clearInterval(tid);		// 타이머 해제
		}
	};	
	
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
					$("#pnt_span").show();
					if(pointInfo.elandPoint < 5000){
						$('[name="pay_amt_input"]').attr("disabled","disabled");
						$('[name="pay_amt_chk"]').attr("disabled","disabled");
						
						$('[name="pay_amt_chk"]').attr("style","display:none");
						$("#tot_point_input").attr("style","display:none");
						
						$("#point_row").append("<p class='alR fc02' id='point_txt'><strong>5,000</strong>원부터 사용가능</p>");
					}else{
						if($("#searchPntBtn").attr("pnt_use_yn") !="N"){
							$('[name="pay_amt_input"]').attr("disabled",false);
							$('[name="pay_amt_chk"]').attr("disabled",false);
							
							$('[name="pay_amt_chk"]').attr("style","display:block");
							$("#tot_point_input").attr("style","display:block");
						}else{
							$('[name="pay_amt_input"]').attr("disabled","disabled");
							$('[name="pay_amt_chk"]').attr("disabled","disabled");
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
	
	// [END] 사용자 이벤트
	
});