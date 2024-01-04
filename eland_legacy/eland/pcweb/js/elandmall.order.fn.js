/**
 * 주문서 관련 함수 모음 
 */
$(document).ready(function() {
	var promo_type_no_cart = "1000000007";	//장바구니쿠폰
	var promo_type_no_double = "1000000006";	//더블쿠폰
	var promo_type_no_goods = "1000000005";	//상품쿠폰
	var promo_type_no_staff = "1000000010";	//직원할인
	var staff_dc_yn = false;  //복지몰 상품 여부
	var staff_dc_reset = false;	//복지몰 상품 셀렉트박스 초기화
	if (!ORDER.fn) {
		ORDER.fn = {};
	};
	$.extend(ORDER.fn, {
		final_pay_amt: 0,
		sub_pay_amt: 0,		
		updateBlock: false,	//화면 갱신 중복을 막기 위함
		loginCheck: function(callback) {	//회원 주문의 경우 로그인 여부를 확인하여 로그인 상태가 아니라면 일단 메인으로 보낸다.
			if (elandmall.loginCheck() === true) {
				callback();
			} else {
				alert("죄송합니다. 장시간 미사용으로 인한 로그아웃 또는 사용자 정보가 올바르지 않습니다.");
				if(elandmall.global.disp_mall_no == '0000053'){
					elandmall.hdLink("MAIN_SHOOPEN");
				}else{
				elandmall.hdLink("MAIN");
				}
			};
		},
		updateOrderSheet: function(b, pay_mean_cd) {	//주문서내 금액을 다시 계산하고 결과를 페이지에 적용한다.
			var div = $("#final_payment_div");			
			var final_coupon_dc = div.find("span[name='final_coupon_amt']");
			var final_goods_price_amt = (function() {	//최총 상품 금액(변경 없음 최초 한번만 셋팅 할 수 있도록) 
				var goods_price_amt = 0;
				$.each(ORDER.goods.ord_goods, function() {
					goods_price_amt += (this.sale_price * this.ord_qty);
				});	
				return goods_price_amt;
			})();
			var ord_pay_radio = ORDER.fn.ord_pay_radio;
			var cash_receipt_area_div = $("div[role='pay_area'][name='cash_receipt_area_div']");
			var main_pay_area_div = $("div[name='main_pay_area_div']");
			var goods_gift_span = $("span[name='goods_gift_span']");
			var final_apply_coupon_count_text = $("#apply_coupon_count_strong");
			var final_deli_price = $("#final_deli_price");
			var final_point_deposit = $("#final_point_deposit_amt");
			var total_staff_point_span1 = $("#total_staff_point_span1");			
			var final_staff_point_amt= $("#final_staff_point_amt");
			var final_pay_price = $("#final_pay_price");
			var final_save_amt_text = $("#final_save_amt_text");
			var only_staff_yn = (function() {	//복지몰 전용 상품 포함 여부(이 경우 통합포인트 사용 불가)
				var result = false;
				$.each(ORDER.goods.ord_goods, function() {
					if (this.goods_disp_divi_cd == "20") {	//복지몰 전용 상품
						result = true;
						return false;
					};
				});
				return result;
			})();
			var gift_wrapping_amt = {};
			var calc_gift_wrapping_amt = function(){
				var total_amt = 0;
				$.each(gift_wrapping_amt, function(index, amt){
					if(amt != 'Y' && amt != 'N')
						total_amt += Number(amt);
				});
				return Number(total_amt);
			};
			
			ORDER.fn.updateOrderSheet = function (b, pay_mean_cd) {
				div.find("span[name='final_goods_price']").text(elandmall.util.toCurrency(( final_goods_price_amt + calc_gift_wrapping_amt() )) + "원"); // 상품금액 변경을 위해 위치 변경
				var final_deli_price_amt = 0;
				var final_save_amt = 0;
				var final_apply_coupon_count = 0;
				var total_free_deli_pnt = 0;
				var total_gift_deli_pnt = 0;
				var total_study_deli_pnt = 0;
				var ord_gift_deli_checkbox = $(":input[name='order_gift_checkbox']");	//주문사은품 배송지
				var staff_benefit_yn = false;	//직원 할인 또는 임직원포인트 사용 여부
				
				if (b !== false && ORDER.fn.updateBlock) {	//실행하지 않음
					return false;
				};
				if (b === false) {	//강제 실행
					ORDER.fn.updateBlock = false;
				};
				
				$.each(ORDER.goods.ord_goods, function(cart_seq) {		//상품별 할인금액(상품쿠폰 + 더블쿠폰 + 직원할인)
					var goods_dc_amt = 0;
					var goods_sale_price = this.sale_price * this.ord_qty;					
					if (ORDER.benefits.cart_benefits[cart_seq]) {
						$.each(ORDER.benefits.cart_benefits[cart_seq], function(benefit_seq) {
							var save_amt = 0;
							if (this.select_yn == "Y" && this.apply_poss_yn == "Y" && (this.promo_type_no == promo_type_no_goods || this.promo_type_no == promo_type_no_double || this.promo_type_no == promo_type_no_staff)) {
								goods_dc_amt += this.dc_price;
								if (this.promo_type_no == promo_type_no_double) {	//더블쿠폰만 
									final_apply_coupon_count++;
								};
							};
							
							//복지몰 상품 혜택설정 하지 않았을 때 select_yn이 N으로 세팅되고 있음.
							if (ORDER.mst.staff_yn == "Y" && this.apply_poss_yn == "Y" && this.select_yn == "N" && this.bene_poli_cd == "20" && this.promo_type_no == "104") {
								this.select_yn = "Y";
							} else if (ORDER.mst.staff_yn == "Y" && this.apply_poss_yn == "N" && this.select_yn == "N" && this.bene_poli_cd == "20" && this.promo_type_no == "104" && this.save_amt > 0 && this.free_point < 1 ) {  //전체몰대상 복지몰상품일 때 보유한 포인트가 없으면 적립금을 보여준다
								this.select_yn = "Y";
								this.apply_poss_yn = "Y";
							}
							
							if (this.select_yn == "Y" && this.apply_poss_yn == "Y" && this.bene_poli_cd == "20") {
								save_amt = this.mpl_promo_no != "" ? this.save_amt * this.mpl_promo_val : this.save_amt ;
								$("#goods_save_amt_div_" + cart_seq).each(function() {
									var div = $(this);
									div.find("strong").text(elandmall.util.toCurrency(save_amt));
									if (div.is(":visible") === false) {
										div.show();
									};
								});
								final_save_amt += save_amt;
								staff_dc_yn = false;
							} else {
								staff_dc_yn = true;
								$("#goods_save_amt_div_" + cart_seq).filter(":visible").hide();
							};
						});
					};
					$("#goods_coupon_amt_" + cart_seq).text(elandmall.util.toCurrency(goods_dc_amt));
					$("#goods_order_price_amt_" + cart_seq).text(elandmall.util.toCurrency(goods_sale_price - goods_dc_amt));
				});
				$("#goods_coupon_amt_span").text((function() {
					var goods_dc_amt = 0;
					$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
						$.each(this, function(benefit_seq) {
							if (this.select_yn == "Y" && this.apply_poss_yn == "Y" && (this.promo_type_no == promo_type_no_goods || this.promo_type_no == promo_type_no_double || this.promo_type_no == promo_type_no_staff)) {
								goods_dc_amt += this.dc_price;
							};							
						});
					});
					return elandmall.util.toCurrency(goods_dc_amt);
				})());
				$("#cart_coupon_amt_span").text((function() {
					var cart_dc_amt = 0;
					var cart_coupon_apply_yn = false;
					$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
						$.each(this, function(benefit_seq) {
							if (this.select_yn == "Y" && this.apply_poss_yn == "Y" && this.promo_type_no == promo_type_no_cart) {
								cart_dc_amt += this.dc_price;
								cart_coupon_apply_yn = true;
							};							
						});
					});
					if (cart_coupon_apply_yn === true) {	//장바구니 쿠폰은 한 주문에 한장 적용
						final_apply_coupon_count++;
					};
					return elandmall.util.toCurrency(cart_dc_amt);
				})());
				
				//배송비
				$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
					var div = $("div[dlvp_no='" + dlvp_no + "']");					
					var dlvp = this;
					var deli_price_sum = 0;
					var city_exp_deli_sum = 0;
					var deli_coupon_count = 0;
					var deli_coupon_div = div.find("div[name='deli_coupon_div']");
					var deli_coupons = {};
					var apply_deli_coupon_count = 0;
					$.each(this.ord_deli, function(dlvp_seq) {
						var deli = this.deli;
						var r_deli_cost_amt = 0;
						var r_city_exp_deli_cost = 0;
						var r_deli_cost_form_cd = "";
						var li = div.find("li[name='deli_price_li'][dlvp_seq='" + dlvp_seq + "']");
						if (deli) {		//배송비 정보가 있음
							r_deli_cost_amt = deli.r_deli_cost_amt ;
							r_city_exp_deli_cost = deli.r_city_exp_deli_cost;							
							r_deli_cost_form_cd = deli.r_deli_cost_form_cd;
							if (deli.r_deli_coupon_promo_no != "" && (deli.free_use_pnt + deli.gift_use_pnt + deli.study_use_pnt) == 0) {		//배송비 쿠폰이 있음(배송비에 포인트가 적용되었다면 사용 불가)
								if (!staff_dc_yn && staff_dc_reset) {
									deli.coupon_use_yn = "Y";
									staff_dc_reset = false;
								}
								deli_coupon_count++;
								deli_coupons[dlvp_seq] = deli;
								if (deli.coupon_use_yn == "Y") {	//배송비 쿠폰 사용
									r_deli_cost_amt = (dlvp.address.city_exp_yn != "Y" ? 0 : deli.r_city_exp_deli_cost);		//도서산간의 경우 도서 산간비 제외한 금액만 할인
									apply_deli_coupon_count++;									
								};
							} else {
								if (!staff_dc_yn) {
									total_free_deli_pnt += deli.free_use_pnt;
								} else {
									deli.coupon_use_yn = "N";
								}
								total_gift_deli_pnt += deli.gift_use_pnt;
								total_study_deli_pnt += deli.study_use_pnt;
							};
							final_deli_price_amt += r_deli_cost_amt ;
						};
						deli_price_sum += r_deli_cost_amt;
						city_exp_deli_sum += r_city_exp_deli_cost;
						li.html(r_deli_cost_amt == 0 ? "<span class=\"txt_c02\">" + ( r_deli_cost_form_cd == "60" ? "착불" : "무료배송" ) + "</span>" : "<span class=\"tx_num\">" + elandmall.util.toCurrency(r_deli_cost_amt) + "원</span>");
					});
					ORDER.mst.total_free_deli_pnt = total_free_deli_pnt;
					ORDER.mst.total_gift_deli_pnt = total_gift_deli_pnt;
					ORDER.mst.total_study_deli_pnt = total_study_deli_pnt;
					div.find("strong[name='deli_price_sum']").parent().each(function() {
						var td = $(this);
						td.empty();
						td.append("<strong class=\"tx_price\" name=\"deli_price_sum\">" + elandmall.util.toCurrency(deli_price_sum) + "</strong>원");
						if (city_exp_deli_sum > 0) {
							td.append(" (추가 <strong class=\"tx_price\" name=\"deli_price_sum\">" + elandmall.util.toCurrency(city_exp_deli_sum) + "</strong>원)");
						};						
					});
					div.find("li[name='deli_coupon_li']").remove();
					if (deli_coupon_count > 0) {	//배송비 쿠폰 체크박스 만들기
						div.find("tr[name='deli_coupon_tr']").show();
						deli_coupon_div.find("strong[name='apply_deli_coupon_count']").text(elandmall.util.toCurrency(apply_deli_coupon_count) + "장");
						$.each(deli_coupons, function(dlvp_seq) {							
							var deli = this;
							var li = div.find("li[name='deli_coupon_template']").clone().attr("name", "deli_coupon_li").show();
							var r_deli_cost_amt = deli.r_deli_cost_amt - deli.r_city_exp_deli_cost ;	//제주산간이라도 산간비를 제외한 금액만 할인
							var label = li.find(">label");
							var checkbox = label.find(":checkbox");
							var deli_coupon_aval_end = "";
							var deli_coupon_end = "";
							label.attr("for", "deli_coupon_checkbox_" + dlvp_no + "_" + dlvp_seq);
							checkbox.attr({ "id": "deli_coupon_checkbox_" + dlvp_no + "_" + dlvp_seq, "name": "deli_coupon_checkbox", "dlvp_no": dlvp_no, "dlvp_seq": dlvp_seq }).click(ORDER.fn.clickDeliCoupon);
							if (deli.coupon_use_yn == "Y" && checkbox.is(":checked") === false) {
								checkbox.prop("checked", true);
							};
							li.find("span[name='r_deli_cost_amt']").text(elandmall.util.toCurrency(r_deli_cost_amt));
							if (deli.r_deli_coupon_aval_end != "" && deli.r_deli_coupon_aval_end.split(":").length == 2) {
								deli_coupon_end = deli.r_deli_coupon_aval_end.split(":")[1];
								deli_coupon_aval_end = "(~" + deli_coupon_end.substring(4, 6) + "." + deli_coupon_end.substring(6) + ")";
							};							
							if (deli.deli_cost_limit_amt > 0) {
								li.find("span[name='deli_coupon_text_span']").text("배송비 최대" + elandmall.util.toCurrency(deli.deli_cost_limit_amt) + "원 할인쿠폰 " + deli_coupon_aval_end);								
							} else {
								li.find("span[name='deli_coupon_text_span']").text("배송비 할인쿠폰 " + deli_coupon_aval_end);
							};
							deli_coupon_div.find(">ul").append(li);
						});
					} else {
						div.find("tr[name='deli_coupon_tr']").hide();
					};
					
				});
				ORDER.fn.final_pay_amt = ( final_goods_price_amt + calc_gift_wrapping_amt() )- (function() {
					var total_dc_amt = 0;
					var order_gift_map = {};
					var tr = $("#order_gift_tr").hide();
					var checked_ord_gift = undefined;
					var td = (function() {
						var order_gift_td = $("#order_gift_td");
						order_gift_td.find(":input[name='order_gift_radio']:checked").each(function() {
							var checked = $(this);
							checked_ord_gift = {
								cart_seq: checked.attr("cart_seq"),
								benefit_seq: checked.attr("benefit_seq"),
								gift_idx: checked.attr("gift_idx")								
							};
						});
						order_gift_td.find("ul>li").remove();
						return order_gift_td;
					})();
					ORDER.fn.order_gift_count = 0;
					$.each(ORDER.benefits.cart_benefits, function(cart_seq, benefits) {
						var staff_dc_apply_yn = false;
						$.each(benefits, function(benefit_seq, benefit) {
							var key = "";
							if (benefit.promo_type_no == "1000000010" && benefit.apply_poss_yn == "Y" && benefit.select_yn == "Y") {	//직원할인 적용 여부
								staff_dc_apply_yn = true;
								staff_benefit_yn = true;		//직원할인 + 임직원 포인트 사용 여부
							};
							if (benefit.promo_type_no == "1000000011") {		//상품 사은품
								if (benefit.apply_poss_yn != "Y" || staff_dc_apply_yn === true) {
									benefit.select_yn = "N";									
									goods_gift_span.filter("[cart_seq='" + cart_seq + "']").hide();
								} else {
									benefit.select_yn = "Y";
									goods_gift_span.filter("[cart_seq='" + cart_seq + "']").show();
								};
							} else if (benefit.promo_type_no == "1000000012") {		//주문 사은품
								if (benefit.apply_poss_yn != "Y") {
									return true;
								};
								key = benefit.promo_no + "|" + benefit.gift_mgmt_no;
								if (!order_gift_map[key]) {
									order_gift_map[key] = [];
									ORDER.fn.order_gift_count++;
									$.each(benefit.order_gift_items, function(gift_idx) {
										var li = $("<li></li>");
										var label = $("<label></label>").attr("for", "order_gift_radio_" + gift_idx);
										var radio = $("<input type='radio' name='order_gift_radio'>").attr({ id: "order_gift_radio_" + gift_idx, cart_seq: cart_seq, benefit_seq: benefit_seq, gift_idx: gift_idx }).click(function() {
											$.each(order_gift_map[key], function() {
												var b = ORDER.benefits.cart_benefits[this.cart_seq][this.benefit_seq];
												b.select_yn = "Y";
												$.each(b.order_gift_items, function(i, ord_gift) {
													ord_gift.select_yn = (i == gift_idx) ? "Y" : "N" ;
												});
											});
											$.each(order_gift_map, function(k) {	//해당 주문 사은품이외의 주문 사은품은 select_yn N 처리
												if (k != key) {
													$.each(this, function(i) {
														ORDER.benefits.cart_benefits[this.cart_seq][this.benefit_seq].select_yn = "N";
													});	
												};
											});
										});
										li.append(label);
										label.append(radio);
										label.append("<span>[사은품] " + this.goods_nm + "</span>");
										if (this.item_no != "00000") {
											label.append(" " + this.item_nm);								
										};
										td.find("ul").append(li);
									});	
								};
								order_gift_map[key].push({ cart_seq: cart_seq, benefit_seq: benefit_seq });
							} else if( benefit.promo_type_no == "1000000026" ){ // 상품포장
								
								$.each(benefit.wrapping_gift_items, function(gift_idx, gift){
									var gift_key = cart_seq + "|" + benefit_seq + "|" + gift_idx;
									if(gift_wrapping_amt[gift_key] == undefined){
										gift_wrapping_amt[gift_key] = 0;
										
										// 무료 포장
										$("#eco_pkg_" + cart_seq).attr({cart_seq: cart_seq, benefit_seq: benefit_seq, gift_idx: gift_idx, sale_price: 0 }).click(function(){
											var gift_radio = $(this);
											// 주문상품으로 등록 ==> select Yn 변경
											var b = ORDER.benefits.cart_benefits[gift_radio.attr("cart_seq")][gift_radio.attr("benefit_seq")];
											b.select_yn = "N";
											$.each(b.wrapping_gift_items, function(i, gitf_wrapping) {
												var innerKey = gift_radio.attr("cart_seq") + "|" + gift_radio.attr("benefit_seq") + "|" +  i;
												gitf_wrapping.select_yn = (i == gift_idx) ? "N" : "N" ;
												gift_wrapping_amt[innerKey] = (i == gift_idx) ?  0 : 0; 
											});
											
											// 주문 가격 수정 ==> updateOrderSheet
											ORDER.fn.updateOrderSheet();
										});
										
										// 유료 포장
										$("#lux_pkg_" + cart_seq).next().html("럭셔리 박스 (" + elandmall.util.toCurrency(Number(gift.sale_price)) + "원)");
										$("#lux_pkg_" + cart_seq).attr({cart_seq: cart_seq, benefit_seq: benefit_seq, gift_idx: gift_idx, sale_price: gift.sale_price }).click(function(){
											var gift_radio = $(this);
											// 주문상품으로 등록 ==> select Yn 변경
											var b = ORDER.benefits.cart_benefits[gift_radio.attr("cart_seq")][gift_radio.attr("benefit_seq")];
											b.select_yn = "Y";
											$.each(b.wrapping_gift_items, function(i, gitf_wrapping) {
												var innerKey = gift_radio.attr("cart_seq") + "|" + gift_radio.attr("benefit_seq") + "|" +  i;
												gitf_wrapping.select_yn = (i == gift_idx) ? "Y" : "N" ;
												gift_wrapping_amt[innerKey] = (i == gift_idx) ?  Number(gift.sale_price) : 0; 
											});											
											// 주문 가격 수정 ==> updateOrderSheet
											ORDER.fn.updateOrderSheet();
										});
									}
									// 선물 포장 유료 건은 무조건 1개
									return false;
								});
							}
							if (benefit.select_yn == "Y" && benefit.apply_poss_yn == "Y" && benefit.promo_type_no != "103") {
								total_dc_amt += benefit.dc_price;
							};
						});
					});
					if (td.find("ul>li").length > 0) {
						if (checked_ord_gift) {
							td.find(":radio[cart_seq='" + checked_ord_gift.cart_seq + "'][benefit_seq='" + checked_ord_gift.benefit_seq + "'][gift_idx='" + checked_ord_gift.gift_idx + "']").click();
						} else {
							td.find(":radio:eq(0)").click();	//첫번째 것 선택							
						};
						if (ord_gift_deli_checkbox.filter(":checked").length == 0) {
							ord_gift_deli_checkbox.filter(":eq(0)").click();
						};
						tr.show();
					};
					return total_dc_amt;
				})() + final_deli_price_amt - (function() {
					//기본 결제 수단 이외의 결제 금액(포인트 + 자율포인트 + 상품권 포인트 + 계발포인트 + 예치금)
					var sub_pay_amt = (function() {
						var total_point = 0;
						
						if( this.pay_mean_cd == "62" ){
							total_point  = this.pay_amt
						};
						
						return total_point;
					})();
					var checked_pay_mean_cd = main_pay_area_div.find("a[name='ord_pay_radio'].selected").attr("pay_mean_cd");
					var cardcomp_no = $("#cart_coupon_select").attr("cardcomp_no") || "";
					var iCnt = 0;
					var free_pnt_use = "non";
					$.each(ORDER.pay.pays, function(pay_seq) {	//예치금, 통합포인트등 금액을 입력하는 결제수단에 대해서 초기화
						if((this.pay_mean_cd == "15" || this.pay_mean_cd == "21" || this.pay_mean_cd == "62") && cardcomp_no != ""){ // 카드사 쿠폰 사용시 결제수단 초기화
							this.reset();
						}else{
							var pay_amt_input = $("#pay_amt_input_" + this.pay_seq);
							
							if (this.pay_mean_cd == "15") {	//통합포인트
								var all_in_checkbox = $("#all_in_checkbox_" + this.pay_seq);
								if (!pay_mean_cd || only_staff_yn === true || staff_benefit_yn === true) {		//복지몰 전용 상품이 포함되어있거나 직원할인, 임직원 포인트 적용시 통합 포인트 사용 불가
									if(only_staff_yn === true || staff_benefit_yn === true){
										$("#searchPntBtn").attr("pnt_use_yn","N");
									}else{
										$("#searchPntBtn").attr("pnt_use_yn","Y");
									}
									this.reset();
								} else {
									sub_pay_amt += this.pay_amt;								
								};
								if (pay_amt_input.filter("[not_avaiable]").length == 0) {
									if (only_staff_yn === true || staff_benefit_yn === true) {
										pay_amt_input.prop("disabled", true);
										all_in_checkbox.prop("disabled", true);
									} else {
										pay_amt_input.removeAttr("disabled");
										all_in_checkbox.removeAttr("disabled");
									};								
								};
							} else if (this.pay_mean_cd == "21" || this.pay_mean_cd == "62") {	//예치금							
								if (!pay_mean_cd) {
									this.reset();
								} else {
									sub_pay_amt += this.pay_amt;								
								};
							};
							
							if((this.pay_mean_cd == "15" && this.pay_amt >= 10) //리테일포인트 10원 이상 
									|| (this.pay_mean_cd == "21" && this.pay_amt >= 10)  //예치금 10원 이상 
									|| (this.pay_mean_cd == "62" && this.pay_amt >= 10000)){ // 복지포인트 1만원 이상
								iCnt ++;
							};
							
							if(pay_mean_cd == "62"){
								free_pnt_use = "use";
							}
							
						};
					});
					
					if(free_pnt_use == "use"){
						$("#spanCert1").show();
						$("#spanCert2").show();
						$("#liGuideForMember").hide();
						$("#liGuideForStaff").show();		
						
						$("#liGuideForMember2").hide();
						$("#liGuideForStaff2").show();						
					} else {
						//복지포인트 사용하지 않을 땐 숨기고 전화번호로 발급하도록 초기화
						$("#spanCert1").hide();
						$("#spanCert2").hide();
						$("#pnt_rdo_0").prop("checked","checked");
						$("#pnt_rdo2_0").prop("checked","checked");
						$("#liGuideForMember").show();
						$("#liGuideForStaff").hide();	
							
						$("#liGuideForMember2").show();
						$("#liGuideForStaff2").hide();			
					}
					
					if(iCnt > 0 && $("#applyYn").val() == "N"){
						$("#applyBtn_1").show();
						$("#applyBtn_2").hide();
						$("#applyBtn_3").hide();
					}else if(iCnt > 0 && $("#applyYn").val() == "Y"){
						$("#applyBtn_1").hide();
						$("#applyBtn_2").hide();
						$("#applyBtn_3").show();
					}else{
						$("#applyBtn_1").hide();
						$("#applyBtn_2").hide();
						$("#applyBtn_3").hide();
					}
					
					ORDER.fn.sub_pay_amt = sub_pay_amt;
					return sub_pay_amt;
				})();
				//현금영수증 영역 
				(function(){
					var checked_pay_mean_cd = main_pay_area_div.find("a[name='ord_pay_radio'].selected").attr("pay_mean_cd");
					var goods_receipt_cnt = $("#goods_receipt_cnt").attr("cnt");
					if(ORDER.pay.cash_receipt){  // 리테일 상품권
						cash_receipt_area_div.filter(":visible").hide();
					}else if(ORDER.mst.staff_yn == "Y" && ORDER.mst.ord_mst.cash_receipt_yn == "N"){ //임직원이면서 현금영수증 미발행회사(리테일. 월드)
						if(goods_receipt_cnt != 0 && ORDER.fn.final_pay_amt > 0 && ( checked_pay_mean_cd == "12" || checked_pay_mean_cd == "13" ) ){ //실시간(12) 및 무통장(13)
							cash_receipt_area_div.filter(":not(:visible)").show();
						}else{
							cash_receipt_area_div.filter(":visible").hide();
						}
					}else if (ORDER.fn.sub_pay_amt > 0 || (checked_pay_mean_cd && checked_pay_mean_cd != "11" && checked_pay_mean_cd != "14")) {	//신용카드이외의 결제수단이 있을 경우
						if(goods_receipt_cnt !=0){
							cash_receipt_area_div.filter(":not(:visible)").show();					
						}else{
							cash_receipt_area_div.filter(":visible").hide();
						}
					}else {
						cash_receipt_area_div.filter(":visible").hide();
					};
				})(); 
				
				if (ORDER.fn.final_pay_amt <= 0) {	//결제수단 비노출
					main_pay_area_div.filter(":visible").hide();
				} else {
					main_pay_area_div.filter(":not(:visible)").show();
				};
				final_coupon_dc.text((function() {
					var total_dc_amt = 0;
					$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
						$.each(this, function(benefit_seq) {
							if (this.select_yn == "Y" && this.apply_poss_yn == "Y" && this.promo_type_no != "103") {
								total_dc_amt += this.dc_price;
							};							
						});
					});
					return (total_dc_amt == 0 ? "0" : "- " + elandmall.util.toCurrency(total_dc_amt) ) + "원";
				})());
				final_deli_price.text(elandmall.util.toCurrency(final_deli_price_amt) + "원");
				final_pay_price.text(elandmall.util.toCurrency(ORDER.fn.final_pay_amt));
				final_point_deposit.text((function() {
					var point_deposit_amt = 0;
					$.each(ORDER.pay.pays, function(pay_seq) {
						if (this.pay_mean_cd == "21" || this.pay_mean_cd == "15") {
							point_deposit_amt += this.pay_amt;
						}; 
					});
					return (point_deposit_amt == 0 ? "0": "- " + elandmall.util.toCurrency(point_deposit_amt) ) + "원";
				})());
				final_staff_point_amt.text((function() {
					var staff_point_amt = 0;
					$.each(ORDER.pay.pays, function(pay_seq) {
						if (this.pay_mean_cd == "62" ) {
							staff_point_amt += this.pay_amt;
						}; 
					});
					return (staff_point_amt == 0 ? "0": "- " + elandmall.util.toCurrency(staff_point_amt) ) + "원";
				})());
				
				final_save_amt_text.text(elandmall.util.toCurrency(final_save_amt));
				final_apply_coupon_count_text.text(elandmall.util.toCurrency(final_apply_coupon_count) + "장");
				//신용카드 콤보박스 초기화 -> 카드 제휴 장바구니 쿠폰이 적용되었다면 해당 신용카드만 노출
				(function() {

					if (ORDER.pay.usable_settles["11"] ) {
						var cardcomp_no = $("#cart_coupon_select").attr("cardcomp_no") || "";
						var select_credit_card = ORDER.fn.select_credit_card;
						var reserved_cardcomp_no = elandmall.util.getCookie("reserved_cardcomp_no");
						var cards = (function() {
							var array = [];
							$.each(ORDER.pay.usable_settles["11"], function() {
								array.push(this);
							});
							array.sort(function(a, b) {	//priority순으로 정렬
								return a.sort_seq - b.sort_seq;
							});
							return array;
						})();	//전시순으로 정렬을 위함
						select_credit_card.find("option[value!='']").remove();	//카드콤보 초기화
						$.each(cards, function() {
							select_credit_card.append($("<option></option>").attr({ value: this.settle_dtl_cd }).text(this.settle_dtl_nm));
						});
						if (cardcomp_no != "") {	//카드제휴 장바구니 쿠폰이 적용됨. 해당 카드만 노출
							select_credit_card.find("option[value!='" + cardcomp_no + "'][value!='']").remove();						
						};
						ORDER.fn.changeCard(undefined, { cardcomp_cd: cardcomp_no != "" ? cardcomp_no : reserved_cardcomp_no });
						// NGCPO-5945 [VAN사 장바구니 쿠폰] 페이코,카카오페이 결제 전용 장바구니 쿠폰
						if (cardcomp_no != "") {
							if(cardcomp_no == "kakaopay"){ // kakao pay
								$("a[name=ord_pay_radio][pay_mean_cd=11][kakaopay=Y]").each(function() {
									$(this).click();
								});
							}else if(cardcomp_no == "payco"){ // payco
								$("a[name=ord_pay_radio][pay_mean_cd=11][payco=Y]").each(function() {
									$(this).click();
								});
							}else if(cardcomp_no == "toss"){ // toss
								$("a[name=ord_pay_radio][pay_mean_cd=11][toss=Y]").each(function() {
									$(this).click();
								});
							}else if(cardcomp_no == "naverpay"){ // naverpay
								$("a[name=ord_pay_radio][pay_mean_cd=11][naverpay=Y]").each(function() {
									$(this).click();
								});
							}else{ // ksnet
								$("a[name=ord_pay_radio][pay_mean_cd=11][kakao!=Y][kakaopay!=Y][payco!=Y][toss!=Y][naverpay!=Y]").each(function() {
									$(this).click();
								});
							}
						};

					};
				})();
			};
			ORDER.fn.updateOrderSheet(b, pay_mean_cd);
		},
		updatePaymentText: function(p) {
			var select_credit_card = $("#select_credit_card");
			var select_vbank = $("#select_vbank");
			ORDER.fn.updatePaymentText = function(p) {
				p = $.extend({ kakao: "N",kakaopay: "N" }, p);
				
				if (p.pay_mean_cd == "11") { //신용카드					
					if(p.kakao == "Y") { //카카오페이
					 	$("#payment_info_text_em_cacaopay").text("카카오페이");
					} else if (p.kakaopay == "Y") { //신 카카오페이
						$("#payment_info_text_em_cacaopay").text("카카오페이");
					} else if (p.payco == "Y") { //페이코
						$("#payment_info_text_em_payco").text("페이코");
					} else if (p.toss == "Y") { //토스
						$("#payment_info_text_em_toss").text("토스");
					} else if (p.naverpay == "Y") { //네이버페이
						$("#payment_info_text_em_naverpay").text("네이버페이");
					} else { //신용카드
						$("#payment_info_text_em_card").text("신용카드" + (select_credit_card.val() != "" ? "(" + select_credit_card.find(":selected").text() + ")" : "" ));
					};
				} else if (p.pay_mean_cd == "12") { //실시간 계좌이체
					$("#payment_info_text_em_acct").text("실시간 계좌이체");
				} else if (p.pay_mean_cd == "13") { //무통장입금
					$("#payment_info_text_em_vbank").text("무통장입금" + (select_vbank.val() != "" ? "(" + select_vbank.find(":selected").text() + ")" : ""));
				} else if (p.pay_mean_cd == "14") { //휴대폰결제
					$("#payment_info_text_em_phone").text("휴대폰 결제");
				};
			
			};
			ORDER.fn.updatePaymentText(p);
		},
		clickPayRadioButton: function(e, p) {
			var p = $.extend({ kakao: "N" ,kakaopay: "N"}, p);
			var ord_pay_radio = ORDER.fn.ord_pay_radio;
			var a = e ? $(this) : (function() {
				if (p.pay_mean_cd == "11") {	//신용카드
					if (p.kakao == "Y") {
						return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "'][kakao='Y']");
					} else if (p.kakaopay == "Y") {
						return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "'][kakaopay='Y']");
					} else if (p.payco == "Y") {
						return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "'][payco='Y']");
					} else if (p.toss == "Y") {
						return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "'][toss='Y']");
					} else if (p.naverpay == "Y") {
						return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "'][naverpay='Y']");
					} else {
						return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "'][kakao!='Y'][kakaopay!='Y'][payco!='Y'][toss!='Y'][naverpay!='Y']");
					};
				} else {
					return ord_pay_radio.filter("[pay_mean_cd='" + p.pay_mean_cd + "']");
				};
			})();
			var kakao = a.attr("kakao");
			var kakaopay = a.attr("kakaopay");
			var payco = a.attr("payco");
			var toss = a.attr("toss");
			var naverpay = a.attr("naverpay");
			var pay_mean_cd = a.attr("pay_mean_cd");
			var pay_area = (function() {
				if (kakao === "Y") {
					return "pay_area_" + pay_mean_cd + "_kakao";
				} else if (kakaopay === "Y") {
					return "pay_area_" + pay_mean_cd + "_kakaopay";
				} else if (payco === "Y") {
					return "pay_area_" + pay_mean_cd + "_payco";
				} else if (toss === "Y") {
					return "pay_area_" + pay_mean_cd + "_toss";
				} else if (naverpay === "Y") {
					return "pay_area_" + pay_mean_cd + "_naverpay";
				} else {
					return "pay_area_" + pay_mean_cd;
				};
			})();
			var cash_receipt_area_div = $("#cash_receipt_area_div");
			if (a.hasClass("disable")) {
				return false;
			};
			if (a.hasClass("selected") === false) {
				a.addClass("selected");
				ord_pay_radio.filter(":not([" + pay_area + "]).selected").removeClass("selected");
				$("[role='pay_area'][" + pay_area + "]:not(:visible)").show();
				$("[role='pay_area']:not([" + pay_area + "]):visible").hide();
				var goods_receipt_cnt = $("#goods_receipt_cnt").attr("cnt");
				if(ORDER.pay.cash_receipt){  // 리테일 상품권
					cash_receipt_area_div.hide();
				}else if(ORDER.mst.staff_yn == "Y" && ORDER.mst.ord_mst.cash_receipt_yn == "N"){ //임직원이면서 현금영수증 미발행회사(리테일. 월드)
					if(goods_receipt_cnt != 0 &&ORDER.fn.final_pay_amt > 0 && (pay_mean_cd == "12" || pay_mean_cd == "13")){ //실시간(12) 및 무통장(13)
						cash_receipt_area_div.show();
					}else{
						cash_receipt_area_div.hide();
					}
				}else if (ORDER.fn.sub_pay_amt > 0 || ( pay_mean_cd != "11" && pay_mean_cd != "14")) {	//신용카드이외의 결제수단이 있을 경우
					if(goods_receipt_cnt !=0){
						cash_receipt_area_div.show();
					}else{
						cash_receipt_area_div.hide();
					}
				}else {
					cash_receipt_area_div.hide();
				};


				if(ORDER.pay.cash_receipt){
					cash_receipt_area_div.hide();
				}


			};
			ORDER.fn.updatePaymentText({
				pay_mean_cd: pay_mean_cd,
				kakao: kakao,
				kakaopay: kakaopay,
				payco: payco,
				toss: toss,
				naverpay: naverpay,
			});
			elandmall.util.ga("MW_주문서 작성", "4. 결재수단_" + (function() {
				if (pay_mean_cd == "11" && kakao == "N" && kakaopay == "N" && payco == "N" && toss == "N" && naverpay == "N" ) {
					return "신용카드";
				} else if (pay_mean_cd == "11" && kakao == "Y") {
					return "카카오페이";
				} else if (pay_mean_cd == "11" && kakaopay == "Y") {
					return "카카오페이";
				} else if (pay_mean_cd == "11" && payco == "Y") {
					return "페이코";
				} else if (pay_mean_cd == "11" && toss == "Y") {
					return "토스";
				} else if (pay_mean_cd == "11" && naverpay == "Y") {
					return "네이버페이";
				} else if (pay_mean_cd == "12") {
					return "실시간 계좌이체";
				} else if (pay_mean_cd == "14") {
					return "휴대폰 결제";
				} else if (pay_mean_cd == "13") {
					return "무통장입금";
				};
			})(), "라벨 없음");

			// 네이버페이 일때 무이자 할부 숨기기
			if(naverpay == 'Y') {
				$('.interest-free-info').hide();
			} else {
				$('.interest-free-info').show();
			}
		},
		clickDeliCoupon: function(e) {
			var checkbox = $(this);
			var dlvp_no = checkbox.attr("dlvp_no");
			var dlvp_seq = checkbox.attr("dlvp_seq");
			ORDER.dlvp.ord_dlvps[dlvp_no].ord_deli[dlvp_seq].deli.coupon_use_yn = this.checked ? "Y" : "N" ;
			ORDER.fn.updateOrderSheet();
		},
		searchBenefitOrder: function(p) {
			ORDER.fn.loginCheck(function() {
				ORDER.benefits.searchBenefitOrder(p);
			});
		},
		staffBenefit: function() {	//직원할인 + 상품쿠폰
			$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
				var benefit_goods = [];		//상품쿠폰
				var benefit_staff = [];		//직원할인
				var benefit_staff_combo = [];	//직원할인콤보 리스트		
				$.each(this, function(benefit_seq) {
					if (this.apply_poss_yn != "Y") {
						return true;
					};
					if (this.promo_type_no == "1000000005") {		//상품즉시쿠폰
						benefit_goods.push(this);
					} else if (this.promo_type_no == "1000000010") {	//직원할인
						benefit_staff.push(this);
					};
				});
				if (ORDER.mst.staff_yn == "Y") {	//임직원
					if (benefit_staff.length == 1) {	//직원할인이 있다면 콤보로 제공
						benefit_staff_combo.push(benefit_staff[0]);
						if (benefit_goods.length == 1) {
							benefit_staff_combo.push(benefit_goods[0]);
						};
					};			
				};
				if (benefit_staff_combo.length > 0) {		//직원할인 + 상품쿠폰
					var benefit_area = $("#benefit_1000000010_" + cart_seq);
					var select = benefit_area.find("select").change(function() {	
						var benefit_seq = this.value != "" ? this.value.split("|")[0] : "" ;
						var resou_no = this.value != "" ? this.value.split("|")[1] : "" ;
						var select_yn = this.value != "" ? "Y" : "N" ;
						var staff_point_yn = "";		//staff_point_yn이 Y일 경우 포인트정보 재조회
						if (ORDER.benefits.cart_benefits[cart_seq][select.attr("benefit_seq")]) {
							$.extend(ORDER.benefits.cart_benefits[cart_seq][select.attr("benefit_seq")], { select_yn: "N", resou_no: "" });	//이전에 적용되었던 쿠폰 초기화
							if (ORDER.benefits.cart_benefits[cart_seq][select.attr("benefit_seq")].promo_type_no == "1000000010") {
								staff_point_yn = "Y";
								staff_dc_reset = true;
								staff_dc_yn = false;
							}; 
						};
						select.attr({ benefit_seq: this.value != "" ? benefit_seq : "" });						
						if (ORDER.benefits.cart_benefits[cart_seq][benefit_seq]) {
							$.extend(ORDER.benefits.cart_benefits[cart_seq][benefit_seq], { select_yn: select_yn, resou_no: resou_no });
							if (ORDER.benefits.cart_benefits[cart_seq][benefit_seq].promo_type_no == "1000000010") {
								staff_point_yn = "Y";
								staff_dc_yn = true;
							};
						};
						
						ORDER.goods.ord_goods[cart_seq].wfr_yn = ORDER.benefits.cart_benefits[cart_seq][benefit_seq] && ORDER.benefits.cart_benefits[cart_seq][benefit_seq].promo_type_no == "1000000010" ? "Y" : "N" ;

						ORDER.fn.searchBenefitOrder({	//직원할인 변경 후 혜택 재조회
							staff_point_yn: staff_point_yn,
							benefit_area_yn : "Y",
							callback: function() {
								ORDER.fn.doubleCouponCombo({ cart_seq: cart_seq });	//해당 cart_seq의 더블 쿠폰 콤보만 다시 생성
								ORDER.fn.cartCouponCombo();
								ORDER.fn.updateOrderSheet();
							}
						});
					});
					select.find("option:gt(0)").remove();
					//콤보 만들기
					$.each(benefit_staff_combo, function() {
						var option = $("<option></option>");
						if (this.promo_type_no == "1000000005") {
							option.text(this.promo_nm + this.aval_end_dtime);
						} else if (this.promo_type_no == "1000000010") {
							if (this.dc_price > 0) {
								option.text("직원할인" + (this.bene_val_divi_cd == "10" ? "(" + this.dc_rate + "%)" : ""));								
							} else {	//임직원 포인트용
								option.text("복지 포인트 사용");
							};
						};
						option.val(this.benefit_seq + "|" + this.resou_no);		
						if (this.select_yn == "Y") {							
							ORDER.goods.ord_goods[cart_seq].wfr_yn = "Y";
							if(this.promo_type_no == "1000000010"){ // 복지 포인트가 0원인 경우 default setting 안함 
								if(this.dc_price > 0 || this.free_point >= 1){
									option.prop("selected", true);
								}
							}else{
								option.prop("selected", true);
							}
							select.attr({ benefit_seq: this.benefit_seq });
						};
						select.append(option);
					});
					benefit_area.show();
				} else if (benefit_goods.length == 1) {	//텍스트로 제공
					$.each(benefit_goods, function() {
						var span = $("#benefit_1000000005_" + cart_seq);
						if (this.select_yn == "Y") {
							span.text(this.promo_nm + this.aval_end_dtime);
							span.show();					
						};
					});
				} else {
					$("#benefit_1000000005_" + cart_seq+ ", #benefit_1000000010_" + cart_seq).filter(":visible").hide();
				};
			});
		},
		doubleCouponCombo: function() {
			var benefit_double = {};
			var benefit_double_map = {};	//더블쿠폰 중복 확인용
			var applyCoupon = function(cart_seq, benefit_seq, resou_no) {	//쿠폰적용
				var select = $("#double_coupon_select_" + cart_seq);
				var cart_grp_cd = select.attr("cart_grp_cd"); 
				if (resou_no != "") {	//적용
					if (benefit_double_map[resou_no]) {
						alert("이미 적용된 쿠폰 입니다.");
						//콤보옵션 돌리기
						if (select.attr("resou_no") == "") {
							select.val("");
						} else {
							select.val(select.attr("benefit_seq") + "|" + select.attr("resou_no"));
						};
						return false;
					};
					cancelCoupon(cart_seq);	//이전 쿠폰 취소
					$.extend(ORDER.benefits.cart_benefits[cart_seq][benefit_seq], { select_yn: "Y", resou_no: resou_no });	//선택된 쿠폰 적용
					benefit_double_map[resou_no] = resou_no;
				};
				
				cancelCoupon(cart_seq, select.attr("benefit_seq"), select.attr("resou_no"));
				
				if (ORDER.benefits.cart_benefits[cart_seq][benefit_seq]) {
					elandmall.util.ga("PC_주문/결제", (cart_grp_cd == "10" ? "택배배송" : "매장수령") +"_할인/적립쿠폰", ORDER.benefits.cart_benefits[cart_seq][benefit_seq].promo_nm + "" + ORDER.benefits.cart_benefits[cart_seq][benefit_seq].aval_end_dtime);					
				};
				
				$("#double_coupon_select_" + cart_seq).attr({ benefit_seq: benefit_seq, resou_no: resou_no });
				return true;
			};
			var cancelCoupon = function(cart_seq) {	//쿠폰적용 취소
				var select = $("#double_coupon_select_" + cart_seq);
				var benefit_seq = select.attr("benefit_seq");
				var resou_no = select.attr("resou_no");
				if (benefit_double_map[resou_no]) {	//취소할 쿠폰이 있음
					$.extend(ORDER.benefits.cart_benefits[cart_seq][benefit_seq], { select_yn: "N", resou_no: "" });
					delete benefit_double_map[select.attr("resou_no")];
					select.attr({ benefit_seq: "", resou_no: "" });
				};
			};
			$(":input[name='double_coupon_select']").attr({ benefit_seq: "", resou_no: "" }).change(function() {
				var select = $(this);
				var cart_seq = select.attr("cart_seq");
				var benefit_seq = this.value != "" ? this.value.split("|")[0] : "" ;
				var resou_no = this.value != "" ? this.value.split("|")[1] : "" ;
				if (applyCoupon(cart_seq, benefit_seq, resou_no)) {
					ORDER.fn.searchBenefitOrder({		//더블쿠폰 변경 후 혜택 재조회 
						promo_type_no: promo_type_no_double,
						callback: function() {
							ORDER.fn.cartCouponCombo();
							ORDER.fn.applyCoupon();
							ORDER.fn.updateOrderSheet();
						}
					});					
				};
			});
			$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
				$.each(this, function(benefit_seq) {
					var coupon = this;
					if (coupon.promo_type_no != "1000000006") {
						return true;
					};
					if (!benefit_double[cart_seq]) {
						benefit_double[cart_seq] = {};
					};
					if (!benefit_double[cart_seq][benefit_seq]) {
						benefit_double[cart_seq][benefit_seq] = coupon;
					};
				});
			});
			ORDER.fn.doubleCouponCombo = function(p) {
				p = $.extend({ cart_seq: "" }, p);
				$.each(benefit_double, function(cart_seq) {
					var select = $("#double_coupon_select_" + cart_seq);
					if (p.cart_seq != "" && p.cart_seq != cart_seq) {	//cart_seq가 넘어올 경우 해당 cart_seq의 더블쿠폰만 다시 생성
						return true;
					};
					select.val("");
					cancelCoupon(cart_seq);
					select.find("option:gt(0)").remove();					
					$.each(this, function(benefit_seq) {
						var coupon = this;
						$.each(this.resou_nos, function(i, resou_no) {
							if (coupon.apply_poss_yn == "Y") {
								select.append($("<option></option>").text(coupon.promo_nm + coupon.aval_end_dtime).val(coupon.benefit_seq + "|" + resou_no).attr("apply_poss_yn", coupon.apply_poss_yn));
							};
						});
					});
					if (select.find("option[apply_poss_yn='Y']").length == 0) {
						$("#benefit_1000000006_" + cart_seq).hide();				
					} else {
						$("#benefit_1000000006_" + cart_seq).show();
					};
				});			
			};
			ORDER.fn.doubleCouponCombo();
			$.each(benefit_double, function(cart_seq) {		//최초 select_yn이 Y인 쿠폰 적용
				$.each(this, function(benefit_seq) {
					if (this.apply_poss_yn == "Y" && this.select_yn == "Y" && this.resou_no != "") {
						applyCoupon(cart_seq, benefit_seq, this.resou_no);
						$("#double_coupon_select_" + cart_seq).val(benefit_seq + "|" + this.resou_no); 
					};
				});
			});	
		},
		cartCouponCombo: function() {
			var benefit_cart = {};	//장바구니쿠폰(장바구니쿠폰은 장바구니 단위로 상품들에 적용됨)
			var tr = $("#cart_coupon_tr");
			var top_cart_resou_no = ORDER.benefits.top_cart_resou_no;
			var select = $("#cart_coupon_select").attr("resou_no", "");
			var applyCoupon = function() {
				var option = select.find(":selected");
				var resou_no = option.val() != "" ? option.attr("resou_no") : "" ;
				var cardcomp_no = option.val() != "" ? option.attr("cardcomp_no") : "" ;
				var card_pay_kind_cd = option.val() != "" ? option.attr("card_pay_kind_cd") : "" ;
				cancelCoupon(select.attr("resou_no"));
				if (resou_no != "") {
					elandmall.util.ga("PC_주문/결제", "배송정보_할인혜택_장바구니 할인쿠폰", option.text());					
				};
				if (benefit_cart[resou_no]) {
					$.each(benefit_cart[resou_no]["benefits"], function() {
						$.extend(ORDER.benefits.cart_benefits[this.cart_seq][this.benefit_seq], { resou_no: resou_no, select_yn: "Y" });
					});
				};
				
				if (cardcomp_no != select.attr("cardcomp_no")) {	//카드사 장바구니 적용여부가 변경됨(신용카드 이외의 결제수단에 대한 활성/비활성 처리)
					$.each(ORDER.pay.pays, function(pay_seq) {
						var pay = this;
						var radio = $("#ord_pay_radio_" + pay_seq);
						var pay_mean_cd = radio.attr("pay_mean_cd");
						var kakao = radio.attr("kakao");
						var kakaopay = radio.attr("kakaopay");
						var payco = radio.attr("payco");
						var toss = radio.attr("toss");
						var naverpay = radio.attr("naverpay");
						var disable_yn = radio.attr("disable_yn");
						if (radio.attr("type") == "a") {
							// NGCPO-5945 [VAN사 장바구니 쿠폰] 페이코,카카오페이 결제 전용 장바구니 쿠폰
							if($.type(pay.disable) == "function"){
								pay.disable(false);
							}
							if(cardcomp_no == "kakaopay"){ // 카카오페이
								if ((payco == "Y" || toss == "Y" || naverpay == "Y" || pay_mean_cd != "11" || (pay_mean_cd =="11" && kakaopay != "Y")) && $.type(pay.disable) == "function") {	//그외의 결제 수단은 비활성화
									pay.disable(cardcomp_no != "" ? true : false);
								}
							}else if(cardcomp_no == "payco"){ // 페이코 
								if ((kakaopay == "Y" || toss == "Y" || naverpay == "Y" || pay_mean_cd != "11" || (pay_mean_cd =="11" && payco != "Y") ) && $.type(pay.disable) == "function") {	//그외의 결제 수단은 비활성화
									pay.disable(cardcomp_no != "" ? true : false);
								}
							}else if(cardcomp_no == "toss"){ // 토스
								if ((kakaopay == "Y" || payco == "Y" || naverpay == "Y" || pay_mean_cd != "11" || (pay_mean_cd =="11" && toss != "Y") ) && $.type(pay.disable) == "function") {	//그외의 결제 수단은 비활성화
									pay.disable(cardcomp_no != "" ? true : false);
								}
							}else if(cardcomp_no == "naverpay"){ // 네이버페이
								if ((kakaopay == "Y" || payco == "Y" || toss == "Y" || pay_mean_cd != "11" || (pay_mean_cd =="11" && naverpay != "Y") ) && $.type(pay.disable) == "function") {	//그외의 결제 수단은 비활성화
									pay.disable(cardcomp_no != "" ? true : false);
								}
							}else{ // ksnet
								if ((kakao == "Y" || kakaopay == "Y" || payco == "Y" || toss == "Y" || naverpay == "Y" || pay_mean_cd != "11") && $.type(pay.disable) == "function") {	//그외의 결제 수단은 비활성화
									pay.disable(cardcomp_no != "" ? true : false);
								}
							};									
						};
						pay.card_pay_kind_cd = card_pay_kind_cd;
					});					
				};
				
				select.attr("resou_no", resou_no);	
				select.attr("cardcomp_no", cardcomp_no);
				select.attr("card_pay_kind_cd", card_pay_kind_cd);
			};
			var cancelCoupon = function(resou_no) {	//적용된 쿠폰 취소하기
				if (benefit_cart[resou_no]) {
					$.each(benefit_cart[resou_no]["benefits"], function() {
						$.extend(ORDER.benefits.cart_benefits[this.cart_seq][this.benefit_seq], { resou_no: "", select_yn: "N" });
					});
				};
				select.attr("resou_no", "");
			};
			select.change(function() {				
				applyCoupon();
				ORDER.fn.searchBenefitOrder({		//장바구니쿠폰 변경 후 혜택 재조회 
					promo_type_no: promo_type_no_cart,
					callback: function() {						
						ORDER.fn.updateOrderSheet();
					}
				});
			});
			ORDER.fn.cartCouponCombo = function() {
				var count = 0;
				cancelCoupon(select.attr("resou_no"));
				benefit_cart = {};		//장바구니 초기화
				select.find("option:gt(0)").remove();
				select.attr("resou_no", "");
				$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
					$.each(this, function(benefit_seq) {
						var coupon = this;
						if (coupon.promo_type_no != "1000000007" || coupon.apply_poss_yn != "Y") {
							return true;
						};						
						$.each(coupon.resou_nos, function(i, resou_no) {					
							if (!benefit_cart[resou_no]) {
								benefit_cart[resou_no] = {					
									promo_nm: coupon.promo_nm + coupon.aval_end_dtime,
									dc_price: 0,
									benefits: []	//해당 장바구니 쿠폰이 걸려 있는 장바구니 정보
								};
							};
							benefit_cart[resou_no].dc_price += coupon.dc_price;
							benefit_cart[resou_no].benefits.push({ cart_seq: cart_seq, benefit_seq: benefit_seq, dc_price: coupon.dc_price });
							benefit_cart[resou_no].cardcomp_no = coupon.cardcomp_no;
							benefit_cart[resou_no].card_pay_kind_cd = coupon.card_pay_kind_cd;
						});
					});
				});				
				$.each(benefit_cart, function(resou_no) {
					var option = $("<option></option>").text(this.promo_nm).attr({ value: resou_no, resou_no: resou_no, cardcomp_no: this.cardcomp_no, card_pay_kind_cd : this.card_pay_kind_cd });
					select.append(option);
					count++;			
				});
				if (count > 0) {
					tr.show();
				} else {
					tr.hide();
				};	
			};
			
			ORDER.fn.applyCoupon = function() {
				applyCoupon();
			};
			ORDER.fn.cartCouponCombo();
			if (top_cart_resou_no != "") {	//장바구니 쿠폰 적용
				select.val(top_cart_resou_no);
				applyCoupon();
			};
		},
		changeCard: function(e, cardcomp) {
			var cardcomp_cd = e ? this.value : cardcomp.cardcomp_cd ;
			var select_credit_card_installment = $("#select_credit_card_installment");
			var installment = select_credit_card_installment.val();
			var goodsTicketYn = $("#goodsTicketYn").val();
			if (goodsTicketYn != "undefined") {
				if (goodsTicketYn == "N") {
					try {
						elandmall.util.ga("PC_주문/결제", "결제수단_신용카드", ORDER.pay.usable_settles["11"][cardcomp_cd].settle_dtl_nm);				
					} catch (e) {};
					select_credit_card_installment.find("option:gt(0)").remove();
					if (ORDER.fn.final_pay_amt >= 50000 && cardcomp_cd != "") {
						for (var i = 2 ; i <= 24 ; i++) { 
							select_credit_card_installment.append($("<option value='" + i + "'></option>").text(i + "개월" + (ORDER.pay.card_noint[cardcomp_cd] && ORDER.pay.card_noint[cardcomp_cd]["072"] && ORDER.pay.card_noint[cardcomp_cd]["072"][i] && ORDER.pay.card_noint[cardcomp_cd]["072"][i].promo_add_phrase =="" && ORDER.fn.final_pay_amt >= ORDER.pay.card_noint[cardcomp_cd]["072"][i].base_amt ? " (무이자)" : ""))); 
						};
						select_credit_card_installment.val(installment);
					};
					if (cardcomp) {
						if ($("#select_credit_card").find("option[value='" + cardcomp.cardcomp_cd + "']").length > 0) {
							$("#select_credit_card").val(cardcomp.cardcomp_cd);					
						};
					};
				};
			} else {
				try {
					elandmall.util.ga("PC_주문/결제", "결제수단_신용카드", ORDER.pay.usable_settles["11"][cardcomp_cd].settle_dtl_nm);				
				} catch (e) {};
				select_credit_card_installment.find("option:gt(0)").remove();
				if (ORDER.fn.final_pay_amt >= 50000 && cardcomp_cd != "") {
					for (var i = 2 ; i <= 24 ; i++) { 
						select_credit_card_installment.append($("<option value='" + i + "'></option>").text(i + "개월" + (ORDER.pay.card_noint[cardcomp_cd] && ORDER.pay.card_noint[cardcomp_cd]["072"] && ORDER.pay.card_noint[cardcomp_cd]["072"][i] && ORDER.pay.card_noint[cardcomp_cd]["072"][i].promo_add_phrase =="" && ORDER.fn.final_pay_amt >= ORDER.pay.card_noint[cardcomp_cd]["072"][i].base_amt ? " (무이자)" : ""))); 
					};
					select_credit_card_installment.val(installment);
				};
				if (cardcomp) {
					if ($("#select_credit_card").find("option[value='" + cardcomp.cardcomp_cd + "']").length > 0) {
						$("#select_credit_card").val(cardcomp.cardcomp_cd);					
					};
				};
			};
		},
		certAccount: function() {
			var account = {};
			try {
				$("#refund_req_bank_cd").each(function() {
					if ($.trim(this.value) == "") {
						this.focus();
						throw "은행을 선택하세요";
					};
					account.bank_cd = this.value;
				});
				$("#refund_req_depor_nm").each(function() {
					if ($.trim(this.value) == "") {
						this.focus();
						throw "예금주명을 입력하세요";
					};
					account.morc_nm = this.value;
				});
				$("#refund_req_account_no").each(function() {
					if ($.trim(this.value) == "") {
						this.focus();
						throw "계좌번호를 입력하세요";
					};
					this.value = this.value.replace(/-/g, ""); 
					account.account_no = this.value;
				});
				account.callback = function() {
					alert("입력하신 계좌가 확인되었습니다.");
				};
				ORDER.payments.certAccount(account);				
			} catch (e) {
				alert(e);
			};
		},
		// 주문서 할인혜택 상세안내(FAQ팝업)
		openFaqPop : function(param) {
		    param = $.extend({}, param||{});
			var sUrl = "https:"+elandmall.global.base_domain_url+"/custcenter/initCustFAQlist.action?searchType=page&faq_large_divi_cd=14&faq_large_divi_cd_nm=%EC%BF%A0%ED%8F%B0%2F%ED%8F%AC%EC%9D%B8%ED%8A%B8%2F%EC%98%88%EC%B9%98%EA%B8%88";
			window.open(sUrl,"_blank");
		}		
	});		
	
	//숫자만 입력
	$.fn.digitChecker = function(maxlength) {
		
		if(maxlength){
			$(this).attr("maxlength", maxlength);
			if($(this).val().length > 4) {
				$(this).val($(this).val().substring(0,4));
			}
		}
			
		//for ie
		$(this).attr("style", "ime-mode:disabled");
		
		//for crome
		$(this).val($(this).val().replace(/[^0-9]/g,''));
	};
	
});