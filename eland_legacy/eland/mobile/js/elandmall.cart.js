;(function($) {
	var CART = window.CART = {
		goods: {},
		groups: {}
	};
	
	$(document).ready(function() {
		var group_checkbox = $(":checkbox[name='group_checkbox']");
		var item_checkbox = $(":checkbox[role='item_check']");
		var all_check_button = $("[name='all_check_button']");
		var div_cart_con = $("div.cart_con");
		var tab_cart_a = $("ul.tab_cart a, .kims_tab_cart button");
		var global_current_tab_cart_gb = "4";
		
		var goCart = function() {
			var cart_gb = div_cart_con.filter(":visible").attr("cart_gb");
			window.location.href = "/cart/initCart.action?cart_gb=" + cart_gb;	
		};
		var updateCartList = function() {		// 체크박스 변경에 따른 화면 갱신
			var total_goods_price_text = $("#total_goods_price_text");
			var total_goods_deli_price_text = $("#total_goods_deli_price_text");
			var total_pay_price_text = $("#total_pay_price_text");
			var total_dc_amt = 0;

			updateCartList = function() {
				var total_goods_price_sum = 0;
				var total_goods_deli_price_sum = 0;
				var total_deli_price = 0;
				var cart_gb;
				if(elandmall.global.disp_mall_no == '0000045') {
					var cart_gb_val = div_cart_con.filter(":visible").attr("cart_gb");
					if(cart_gb_val) {
						cart_gb = cart_gb_val;
					} else {
						cart_gb = global_current_tab_cart_gb;
					}
				} else {
					cart_gb = div_cart_con.filter(":visible").attr("cart_gb");
				}

				$.each(CART.groups, function(cart_grd_cd) {
					total_dc_amt = 0;
					if (cart_gb == "1" && cart_grd_cd != "10" && cart_grd_cd != "40") {	//일반상품
						return true;
					} else if (cart_gb == "2" && cart_grd_cd != "20") {		//디지털 상품권
						return true;
					} else if (cart_gb == "3" && cart_grd_cd != "60" && cart_grd_cd != "70") {		//퀵배송
						return true;
					} else if (cart_gb == "4" && cart_grd_cd != "10" && cart_grd_cd != "40" && cart_grd_cd != "80") {		//킴스, 산지직송
						return true;
					};
					$.each(this, function(key) {	//key: dlvp_seq, vir_vend_no
						var sub_goods_price_sum = 0;
						var sub_goods_price_sum_for_deli = 0;
						var deli = this.deli;
						var deli_price = 0;
						if (key == "SOLDOUT") {
							return true;
						};
						$.each(this.goods, function(i, cart_seq) {
							var goods = CART.goods[cart_seq];
							if ($("#item_check_" + cart_seq).is(":checked")) {
								sub_goods_price_sum += (goods.sale_price * goods.ord_qty);
								sub_goods_price_sum_for_deli += (goods.sale_price * goods.ord_qty);
								
								$("#dc_amt_" + cart_seq).each(function() {
									if($("#item_check_" + cart_seq).is(":checked")){
										total_dc_amt += +$(this).attr("amt");
									}
								});
								/*
								$("#ord_deli_price_" + cart_seq).each(function() {
									if($("#item_check_" + cart_seq).is(":checked")){
										if($(this).attr("form_cd") !="60"){
											total_deli_price += +$(this).attr("deli");
										}
									}
								});
								*/
							};
						});
						
						if ((cart_grd_cd == "10" || cart_grd_cd == "60" || cart_grd_cd == "70" || cart_grd_cd == "80") && deli.r_deli_cost_form_cd != "30" && deli.r_deli_cost_form_cd != "60" && sub_goods_price_sum > 0 && deli.st_amt > sub_goods_price_sum_for_deli) {	//택배 배송에 착불/묶음무료가  아니면 배송비 노출
							total_deli_price += deli.r_deli_cost_amt;
						}else if ((cart_grd_cd == "10" || cart_grd_cd == "60" || cart_grd_cd == "70" || cart_grd_cd == "80") && deli.r_deli_cost_form_cd != "30" && deli.r_deli_cost_form_cd != "60" && sub_goods_price_sum > 0 && deli.r_deli_cost_form_cd == "40") {	//택배 배송에 착불/묶음무료가  아니면 배송비 노출
							total_deli_price += deli.r_deli_cost_amt;
						};												
						total_goods_price_sum += sub_goods_price_sum;
						total_goods_deli_price_sum += total_deli_price;
					});
				});
				
				total_pay_price_text.text(elandmall.util.toCurrency(total_goods_price_sum + total_deli_price-total_dc_amt));
				total_goods_price_text.text(elandmall.util.toCurrency(total_goods_price_sum-total_dc_amt));
				total_goods_deli_price_text.text(elandmall.util.toCurrency(total_deli_price));
				//total_pay_price_text.text(elandmall.util.toCurrency(total_goods_price_sum + total_goods_deli_price_sum-total_dc_amt));
				//total_goods_deli_price_text.text(elandmall.util.toCurrency(total_goods_deli_price_sum));
			};
			updateCartList();
		};
		var checkAllButton = function() {	//상/하단 전체선택/선택해제 버튼 처리
			var cart_gb = div_cart_con.filter(":visible").attr("cart_gb");
			if(cart_gb != 3) {
				if (item_checkbox.filter("[cart_gb='" + cart_gb + "']:not(:checked)").length > 0) {
					if(elandmall.global.disp_mall_no == '0000045') {
						all_check_button.filter("[cart_gb='" + cart_gb + "']").prop("checked", false);
						all_check_button.filter("[cart_gb='" + cart_gb + "']").attr("role", "unchecked");
					} else {
						all_check_button.attr("role", "checked").text("전체선택");
					}
				} else {
					if(elandmall.global.disp_mall_no == '0000045') {
						all_check_button.filter("[cart_gb='" + cart_gb + "']").prop("checked", true);
						all_check_button.filter("[cart_gb='" + cart_gb + "']").attr("role", "checked");
					} else {
						all_check_button.attr("role", "unchecked").text("선택해제");
					}
				}	
			} else {
				var arr_cart_in_gb = $.unique(all_check_button.filter("[cart_gb='3'][cart_in_gb]").map(function() { return $(this).attr("cart_in_gb"); }).get())
				$.each(arr_cart_in_gb, function(idx, gb){
					if (item_checkbox.filter("[cart_gb='" + cart_gb + "'][cart_grp_cd='" + gb + "']:not(:checked)").length > 0) {
						if(elandmall.global.disp_mall_no == '0000045') {
							// 주문이 안되는 오늘직송상품이 있다면 체크박스를 선택하지 못하도록
							if(item_checkbox.filter("[cart_gb='" + cart_gb + "'][cart_grp_cd='" + gb + "']:not(:checked)").attr('disabled') == 'disabled') {
								alert('구매 불가한 상품이 존재합니다.');

								all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").prop("checked", false);
								all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").attr("role", "checked");
							} else {
								all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").prop("checked", false);
								all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").attr("role", "unchecked");
							}
						} else {
							all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").attr("role", "checked").text("전체선택");
						}
					} else {
						if(elandmall.global.disp_mall_no == '0000045') {
							all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").prop("checked", true);
							all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").attr("role", "checked");
						} else {
							all_check_button.filter("[cart_gb='" + cart_gb + "'][cart_in_gb='"+ gb +"']").attr("role", "unchecked").text("선택해제");
						}
					}					
				});
			}
			
			updateCartList();
		};
		tab_cart_a.click(function() {
			var a = $(this);
			var cart_gb = a.attr("cart_gb");
			var visible = div_cart_con.filter(":visible");
			if (cart_gb != visible.attr("cart_gb")) {
				visible.hide();
				div_cart_con.filter("[cart_gb='" + cart_gb + "']").show();


				if(elandmall.global.disp_mall_no == '0000045') {
					tab_cart_a.attr('aria-selected', 'false');
					a.attr('aria-selected', 'true');

					global_current_tab_cart_gb = cart_gb;
				} else {
					tab_cart_a.filter(".on").removeClass("on");
					a.addClass("on");
				}

				updateCartList();
			};			
		});
		group_checkbox.click(function() {
			var checkbox = $(this);
			var key = $(this).attr("key");
			var cart_gb = $(this).attr("cart_gb");
			var cart_grp_cd = $(this).attr("cart_grp_cd");
			if(cart_grp_cd != ""){
				if(item_checkbox.filter("[cart_gb='"+cart_gb+"'][cart_grp_cd!='" + cart_grp_cd + "']:checked").length > 0 ){
					console.log(1)
					alert("오늘받송과 오늘직송 상품은 같이 \n주문할 수 없습니다.");
					return false;
				}				
			}
			item_checkbox.filter("[area='sale'][key='" + key + "']").prop("checked", this.checked);
			checkAllButton();
		});
		item_checkbox.click(function() {
			var checkbox = $(this);
			var key = $(this).attr("key");
			group_checkbox.filter("[key='" +  key + "']").prop("checked", item_checkbox.filter("[area='sale'][key='" + key + "']:not(:checked)").length > 0 ? false : true);
			checkAllButton();
		});
		all_check_button.click(function() {
			var a = $(this);
			var role = a.attr("role");
			var cart_gb = a.attr("cart_gb");
			var cart_in_gb = a.attr("cart_in_gb");
			if(cart_in_gb){
				if (role == "checked") {
					if(item_checkbox.filter("[cart_gb='"+cart_gb+"'][cart_grp_cd!='" + cart_in_gb + "']:checked").length > 0){
						alert("오늘받송과 오늘직송 상품은 같이 \n주문할 수 없습니다.");
						return false;
					}
					if(elandmall.global.disp_mall_no == '0000045') {
						item_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", false);
						group_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", false);
					} else {
						item_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", true);
						group_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", true);
					}
				} else {
					if(elandmall.global.disp_mall_no == '0000045') {
						item_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", true);
						group_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", true);
					} else {
						item_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", false);
						group_checkbox.filter("[cart_grp_cd='" + cart_in_gb + "']").prop("checked", false);
					}
				}
			}else {
				if (role == "checked") {
					if(elandmall.global.disp_mall_no == '0000045') {
						item_checkbox.filter("[cart_gb='" + cart_gb + "']").prop("checked", false);
						group_checkbox.prop("checked", false);
					} else {
						item_checkbox.filter("[cart_gb='" + cart_gb + "']").prop("checked", true);
						group_checkbox.prop("checked", true);
					}
				} else {
					if(elandmall.global.disp_mall_no == '0000045') {
						item_checkbox.filter("[cart_gb='" + cart_gb + "']").prop("checked", true);
						group_checkbox.prop("checked", true);
					} else {
						item_checkbox.filter("[cart_gb='" + cart_gb + "']").prop("checked", false);
						group_checkbox.prop("checked", false);
					}
				}
			}
			checkAllButton();
		});
		if (CART.sale_count == CART.soldout_count) {	//품절상품만 있을 경우
			$("#open_soldout_button").toggleClass("on");
			$("#open_soldout_button").parent().parent().parent().find(".soldout_con").slideToggle(200);
		};
		//[START] 옵션 변경
		$("div[role='opt_button']").click(function(e) {
			var button = $(this);
			var cart_seq = button.attr("cart_seq");
			var cart_grp_cd = button.attr("cart_grp_cd");
			var goods = CART.goods[cart_seq];
			var set_items = [];	//세트상품의 경우 변경된 옵션 저장
			e.preventDefault();
			button.toggleClass("on");
			elandmall.itemChangeLayer({
			    goods_no: goods.goods_no,
			    vir_vend_no: goods.vir_vend_no,
			    item_no: goods.item_no,
			    ord_qty: goods.ord_qty,
			    gift_goods_info: goods.gift_goods_info,
			    set_goods_no: goods.set_goods_no, 
				cmps_grp_seq: goods.cmps_grp_seq,
			    set_cmps_item_nos: (function() {
					var set_cmps_item_nos = [];
					if (goods.goods_cmps_divi_cd == "20") {	//세트상품
						$.each(goods.set_items, function() {
							set_cmps_item_nos.push(this.set_cmps_item_no);
						});
					};
					return set_cmps_item_nos;
				})(),
			    gubun: "CART",			    
			    click_obj: this,			    
			    callback: function(item) {
			    	var diff_count = 0;
			    	var params = [];
			    	var opt_yn = "N";
					var qty_yn = "N";
					item = $.extend({ item_nm: "" }, item);
			    	if (goods.goods_cmps_divi_cd == "20") {	//세트상품
						//옵션 변경 체크용
						var optionmap = {};
						$.each(goods.set_items, function() {
							optionmap[this.cmps_grp_seq] = this;
						});
						$.each(item.set_item, function(i) {	//넘어온 값
							if (optionmap[this.cmps_grp_seq].set_cmps_item_no != this.set_cmps_item_no) {
								diff_count++;
							};
							set_items.push($.extend({}, optionmap[this.cmps_grp_seq], { goods_no: this.goods_no, item_no: this.item_no, vir_vend_no: this.vir_vend_no, set_cmps_item_no: this.set_cmps_item_no }));
						});
						if (goods.gift_goods_info != item.gift_goods_info) {
							diff_count++;
						};
						if (diff_count > 0) {
							opt_yn = "Y";	//옵션변경
						};
						if (goods.ord_qty != item.ord_qty) {
							diff_count++;
							qty_yn = "Y";		//수량변경
						};
						if (diff_count == 0) {
							alert("변경된 옵션이나 수량이 없습니다.");
							return false;								
						};
						params.push($.extend({}, goods, { gift_goods_info: item.gift_goods_info, set_items: set_items, ord_qty: item.ord_qty, opt_yn: opt_yn, qty_yn: qty_yn }));
					} else if (item.item_no == goods.item_no && item.gift_goods_info == goods.gift_goods_info && goods.ord_qty == item.ord_qty) {
						alert("변경된 옵션이나 수량이 없습니다.");
						return false;
					} else {
						if (item.item_no != goods.item_no || item.gift_goods_info != goods.gift_goods_info) {
							opt_yn = "Y";
						};
						if (goods.ord_qty != item.ord_qty) {
							qty_yn = "Y";
						};
						params.push($.extend({}, goods, { item_no: item.item_no, gift_goods_info: item.gift_goods_info , vir_vend_no: item.vir_vend_no, ord_qty: item.ord_qty, opt_yn: opt_yn, qty_yn: qty_yn, disp_mall_no: elandmall.global.disp_mall_no }));
					};
					
					/* [NGCPO-6256] 장바구니 수량체크
					 * */
					if (goods.goods_cmps_divi_cd == "20") {	//세트상품
						var sale_poss_qty = 999;
						$.each(item.set_item, function(i) {	//넘어온 값
							if(this.sale_poss_qty < sale_poss_qty){
								sale_poss_qty = this.sale_poss_qty;
							}
						});
						
						var order_qty = +$("#ord_qty").val();
						if(!isNaN(sale_poss_qty) && !isNaN(order_qty) && Number(sale_poss_qty) < Number(order_qty)){
							alert("해당 상품은 최대 " + elandmall.util.toCurrency(sale_poss_qty) + "개까지 주문 가능합니다.");
							return false;
						}
					}else{
						var sale_poss_qty = item.sale_poss_qty;
						var order_qty = +$("#ord_qty").val();
						if(!isNaN(sale_poss_qty) && !isNaN(order_qty) && Number(sale_poss_qty) < Number(order_qty)){
							alert("해당 상품은 최대 " + elandmall.util.toCurrency(sale_poss_qty) + "개까지 주문 가능합니다.");
							return false;
						}
					}
						
					elandmall.util.ga("MW_장바구니", cart_grp_cd == "10" ? "택배배송" : "매장수령", item.item_nm);
					
					$.ajax({
						url: "/cart/updateCartOptionQty.action",
						type: "POST",
						dataType: "json",
						data: { cart_data: JSON.stringify(params) },
						success: function(data) {
							goCart();
						}
					});
			    }
			});
		});
		//[END] 옵션 변경
		
		//[START] 구매하기
		(function() {
			var order = function() {
				var cart_no;
				var ga_products;
				var button = $(this);
				var doOrder = function() {
					elandmall.cart.doOrder({
						cart_no_list: cart_no,
						cart_divi_cd: "10",
						ga_products: ga_products
					}, button.attr("id") == "no_member_order_button");
				};
				var addGoods = function(goods) {	//삭제 대상 단품 추가
					cart_no.push(goods.cart_no);
					
					var brand = goods.brand_nm;
					if(brand == null || brand == ''){
						brand = 'U';
					}
					
					var ga_variant = "옵션없음";
					if(typeof(goods.item_nm) != "undefined"){
						ga_variant = goods.item_nm.replaceAll(",","/");
					}
					
					ga_products.push({
						name: goods.disp_goods_nm,
						id: goods.goods_no,
						price: goods.sale_price,
						brand: brand,
						category: goods.dlp_category,
						coupon: goods.dlp_coupon,
						variant: ga_variant,
						quantity: goods.ord_qty
					});
				}; 
				var checkCarts = function(soldout) {
					var sold_out_count = 0;
					var sold_out_nm = "";
					var giftcard_cardpay_yn_nm = "";  //카드결제가능 상품권 체크
					var giftcard_cardpay_yn_cnt = 0;  //카드결제가능 상품권 체크
					var tot_count = 0 ;				  //카드결제가능 상품권 체크
					var isbn_goods_nm_first   	= "";  //문화비소득결제상품 체크
					var isbn_goods_cnt 			= 0;   //문화비소득결제상품 체크
					var today_deli_start_cnt	= 0;   //빠른배송상품 오늘출발 체크
					var today_deli_arrive_cnt	= 0;   //빠른배송상품 오늘도착 체크
					
					var cart_gb = div_cart_con.filter(":visible").attr("cart_gb");
					cart_no = [];
					ga_products = [];
					$("input:checkbox[cart_gb='" + cart_gb + "'][role='item_check'][area='sale']:checked").each(function() {
						tot_count++;  //총상품길이
						
						var cart_seq = $(this).attr("cart_seq");
						var goods = CART.goods[cart_seq];
						if (goods.ord_poss_max_qty_st_cd == "10") {	//주문단위 수량 확인(회원단위는 주문서 진입시 확인)
							if (goods.ord_poss_min_qty > 0 && goods.ord_qty < goods.ord_poss_min_qty) {
								$("#order_qty_button_" + cart_seq).focus();
								throw "최소 구매 수량은 " + elandmall.util.toCurrency(goods.ord_poss_min_qty) + "입니다.";
							};
							if (goods.ord_poss_max_qty > 0 && goods.ord_qty > goods.ord_poss_max_qty) {
								$("#order_qty_button_" + cart_seq).focus();
								throw "상품은 최대 " + elandmall.util.toCurrency(goods.ord_poss_max_qty) + "개까지 주문 가능합니다.";								
							};
						};
						addGoods(goods);
						if (goods.goods_cmps_divi_cd == "20") {	//세트상품
							$.each(goods.set_items, function() {
								cart_no.push(this.cart_no);
							});
						};
						
						//카드결제가 가능한 상품권상품이 담겨있을경우 구매불가처리.
						if (goods.giftcard_cardpay_yn == "Y") {
							giftcard_cardpay_yn_cnt++;
							giftcard_cardpay_yn_nm = goods.disp_goods_nm;
							return;
						};
						
						//문화비소득공제 상품 복합 결제 불가
						if (goods.isbn_use_yn == "Y") {
							isbn_goods_cnt++;
							if(isbn_goods_cnt == 1) {
								isbn_goods_nm_first = goods.disp_goods_nm;	
							}
						};
						
						//빠른배송상품과 빠른배송상품 아닌 상품 함께 구매불가처리.
						if (goods.today_receive == "Y"){
							if(goods.today_receive_divi_cd == "10"){
								today_deli_start_cnt = today_deli_start_cnt + 1;
							} else if(goods.today_receive_divi_cd == "20"){
								today_deli_arrive_cnt = today_deli_arrive_cnt + 1;
							}
						}
						
					});
					//빠른배송상품과 빠른배송상품 아닌 상품 함께 구매불가처리.
					if( tot_count > 1 && ((today_deli_start_cnt > 0 && tot_count != today_deli_start_cnt) || (today_deli_arrive_cnt > 0 && tot_count != today_deli_arrive_cnt)) ){
						
						if(today_deli_start_cnt >= 1 && today_deli_arrive_cnt >= 1 && tot_count == today_deli_start_cnt + today_deli_arrive_cnt) { //오늘출발 + 오늘도착
							$(".imps").find("[id=info_text]").html("<strong class=\"dlv_qck\">오늘출발</strong> 상품과 <strong class=\"dlv_today\">오늘도착</strong> 상품은<br />동시에 주문할수 없습니다.");
						} else if(today_deli_start_cnt >= 1 && today_deli_arrive_cnt >= 1 && tot_count != today_deli_start_cnt + today_deli_arrive_cnt){ //오늘출발 + 오늘도착 + 일반배송
							$(".imps").find("[id=info_text]").html("빠른배송 <strong class=\"dlv_qck\">오늘출발</strong> <strong class=\"dlv_today\">오늘도착</strong> 상품과<br />일반 택배상품은 동시에 주문할수 없습니다.");
						} else if (today_deli_start_cnt >= 1 && today_deli_arrive_cnt == 0) {	//오늘출발 + 일반배송
							$(".imps").find("[id=info_text]").html("빠른배송 <strong class=\"dlv_qck\">오늘출발</strong> 상품과<br />일반 택배상품은 동시에 주문할수 없습니다.");
						} else if (today_deli_start_cnt == 0 && today_deli_arrive_cnt >= 1) {	//오늘도착 + 일반배송
							$(".imps").find("[id=info_text]").html("빠른배송 <strong class=\"dlv_today\">오늘도착</strong> 상품과<br />일반 택배상품은 동시에 주문할수 없습니다.");
						}
						
						fn_layer_open("qkDlv");						
						throw undefined;
					}
					
					//여러상품 주문시 카드결제가 가능한 상품권상품이 담겨있을경우 구매불가처리.
					if( tot_count > 1 && isbn_goods_cnt > 0 && tot_count != isbn_goods_cnt){
						throw {nm:isbn_goods_nm_first};
					}
					
					//여러상품 주문시 카드결제가 가능한 상품권상품이 담겨있을경우 구매불가처리.
					if(tot_count > 1 && giftcard_cardpay_yn_cnt > 0){
						throw "["+giftcard_cardpay_yn_nm+"]\n상품권 상품은 개별 주문만 가능합니다.";				
					}
					
					if (soldout === true) {
						$("input:checkbox[role='item_check'][area='soldout']:checked").each(function() {
							var cart_seq = $(this).attr("cart_seq");
							var goods = CART.goods[cart_seq];
							sold_out_count++;
														
							// 상품명에서 특수문자를 공백으로 치환
							sold_out_nm += ((sold_out_count != 1 ? ", " : "") +  fnSpecialCharToBlank(goods.disp_goods_nm));
						});						
					};
					if (cart_no.length == 0) {
						throw "구매하실 상품을 선택해 주세요.";							
					};
					if (sold_out_count > 0 && cart_no.length > 0) {
						if (confirm("[" + sold_out_nm + "]\n현재 품절되어 구매가 불가능합니다. 해당 상품을 제외하고 주문 결제 진행 하시겠습니까?")) {
							checkCarts(false);
						} else {
							throw undefined;
						};
					};
				};
				try {
					checkCarts(true);
					doOrder();
				} catch (e) {
					if($.type(e.nm) != "undefined") {
						//메세지 확인 창
						elandmall.layer.createLayer({
							layer_id:"ALERT_MESSAGE_LAYER",
							class_name: "layer_pop nodim pop_zzim",
							createContent: function(layer) {
								layer.div_content.append(
										"<div class=\"zzim_box sale\"><p><em>문화비 소득공제 대상 상품은</em><p/><p>소득공제 적용을 위해 별도 결제가 필요합니다.</p><p>( 소득공제 대상 상품 : "+e.nm+" )</p></div>" 
										
								);
								layer.show();
							}
						});
					}else{
						alert(e);
					}
				};
			};
			$("a[name='order_button'][role='item']").click(function() {	//단품별 구매
				var cart_seq = $(this).attr("cart_seq");
				var goods = CART.goods[cart_seq];
				var checkbox = $(":checkbox[role='item_check']");
				if (goods.ret_code != "0000") {
					if (goods.ret_code == "-0001") {
						alert("종료된 상품은 구매가 불가능합니다. ");
					} else {
						alert("현재 품절되어 구매가 불가능합니다. ");						
					};
					return false;					
				}
				checkbox.filter("[cart_seq='" + cart_seq + "']").each(function() {
					if (this.checked === false) {
						this.checked = true;
					};
				});
				$(":checkbox[role='item_check'][cart_seq!='" + cart_seq + "']:checked").prop("checked", false);
				order();
			});
			$("a[name='order_button'][role='checked'], #no_member_order_button").click(order);	//선택된 단품 모두 구매
		})();
		
		//[START] 삭제
		(function() {
			var real_cart_no_list = [];
			var real_ga_products = [];
			
			$("[name='delete_button']").click(function(e) {
				var button = $(this);
				var role = button.attr("role");
				var cart_gb = button.attr("cart_gb");
				var cart_in_gb = button.attr("cart_in_gb");
				var cart_no_list = [];
				var ga_products = [];
				var addGoods = function(goods) {	//삭제 대상 단품 추가
					cart_no_list.push(goods.cart_no);
					
					var brand = goods.brand_nm;
					if(brand == null || brand == ''){
						brand = 'U';
					}
					
					var ga_variant = "옵션없음";
					if(typeof(goods.item_nm) != "undefined"){
						ga_variant = goods.item_nm.replaceAll(",","/");
					}
					
					ga_products.push({
						name: goods.disp_goods_nm,
						id: goods.goods_no,
						price: goods.sale_price,
						brand: brand,
						category: goods.dlp_category,
						variant: ga_variant,
						quantity: goods.ord_qty,
						dimension10: goods.set_goods_no
					});
				};
				e.preventDefault();
				if (role == "item") {	//단품별 삭제
					var cart_seq = button.attr("cart_seq");
					var goods = CART.goods[cart_seq];
					addGoods(goods);										
				} else if (role == "checked") {	//선택단품 삭제
					var cart_goods;
					if(cart_in_gb) {
						cart_goods = $("input:checkbox[cart_grp_cd='" + cart_in_gb + "'][role='item_check']:checked");
					}else {
						cart_goods = $("input:checkbox[cart_gb='" + cart_gb + "'][role='item_check']:checked"); 
					}
					
					cart_goods.each(function() {
						var cart_seq = $(this).attr("cart_seq");
						var goods = CART.goods[cart_seq];
						addGoods(goods);
					});
				} else if (role == "soldout") {	//품절단품 삭제
					$("input:checkbox[cart_gb='" + cart_gb + "'][role='item_check']").each(function() {
						var cart_seq = $(this).attr("cart_seq");
						var goods = CART.goods[cart_seq];
						if (goods.ret_code != "0000") {
							addGoods(goods);														
						};
					});
				};
				if (cart_no_list.length == 0) {
					alert("삭제할 상품을 선택해주세요.");
					return false;
				};
				
				 real_cart_no_list = cart_no_list;
				 real_ga_products = ga_products;
				
				commonUI.lyrCnfmO(cartCnfm);
			});
			
			$("#delCartBtn").click(function(e) {
				var button = $(this);				
				//if (confirm("선택한 상품을 삭제 하시겠습니까?")) {
				$.ajax({
					url: "/cart/deleteCart.action",
					type: "POST",
					dataType: "json",
					data: { cart_no: real_cart_no_list },
					success: function(data) {
						alert("장바구니에서 상품이 삭제되었습니다");
						
						dataLayer.push({
							event: "removeFromCart",
							ecommerce: {
								remove: {
									products: real_ga_products
								}
							}
						});
						
						if($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version)){  
							var aIframe = $("<iframe name=\"_FORM_APP_CART_TARGET\" id=\"_FORM_APP_CART_TARGET\" />");
							aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
							aIframe.attr("src", "elandbridge://cart/"+data.cart_count+"/");
							aIframe.appendTo('body');
						}
						
						goCart();
					}					
				});				
			});
		})();
		//[END] 삭제		
		
		$("a[name='download_dbl_coupon_button']").click(function(e) {
			var button = $(this);
			e.preventDefault();
			
			//로그인이 되어있지 않다면 비회원상태에서 쿠폰발급후 화면 리로드 시키도록 yn값 세팅
			var cartNoMemberYn = '';
			if(!elandmall.loginCheck()) {
				cartNoMemberYn = 'Y'
			}
			
			elandmall.cpnDown({
				cert_key: button.attr("cert_key"),
				promo_no: button.attr("promo_no"),
				cart_no_member_yn: cartNoMemberYn
			});
		});		
		$("a[name='goods_detail']").click(function(e) {
			var cart_seq = $(this).attr("cart_seq");
			var cart = CART.goods[cart_seq];
			e.preventDefault();
			if (cart.set_goods_no != "" && cart.set_items.length == 0) {	 //묶음상품
				elandmall.goods.goDetail({ goods_no: cart.set_goods_no, goods_nm : cart.disp_goods_nm , cust_sale_price : cart.cust_sale_price , brand_nm : cart.brand_nm , dlp_category : cart.dlp_category });
			} else {
				elandmall.goods.goDetail({ goods_no: cart.goods_no, vir_vend_no: cart.vir_vend_no, goods_nm : cart.disp_goods_nm , cust_sale_price : cart.cust_sale_price , brand_nm : cart.brand_nm , dlp_category : cart.dlp_category });				
			};
			return false;
		});
		$("a[name='wishlist_button']").click(function() {
			var cart_seq = $(this).attr("cart_seq");
			var cart = CART.goods[cart_seq];

			if (elandmall.global.disp_mall_no != '0000053') {
				elandmall.wishlist.addGoodsWish(cart.goods_no, cart.vir_vend_no, cart.sale_shop_divi_cd, cart.sale_shop_no, cart.sale_area_no, cart.conts_dist_no);				
			}
		});
		$("#go_main_button").click(function(e) {
			e.preventDefault();
			elandmall.hdLink("MAIN");
		});
		$("#cart_login_button").click(function(e) {
			e.preventDefault();
			elandmall.isLogin({
				login: function() {
					goCart();
				}
			});
		});
		$("a[name='view_shop_map']").click(function(e) {	//매장정보 보기
			e.preventDefault();
			var button = $(this);
			elandmall.map.viewShopLayer({
				vend_no: button.attr("vend_no"),
				vir_vend_no: button.attr("vir_vend_no"),
				brand_nm: button.attr("brand_nm"),
				shopcode: button.attr("shopcode"),
				cust_prod_yn: button.attr("cust_prod_yn"),
				rtn_btn_id: "#" + button.attr("id")
			});
		});
		$("#item_price_down_info").each(function() {
			//하루에 한번만 보여 지도록... 쿠키 검사
			var price_down_info_layer = elandmall.util.getCookie("price_down_info_layer");
			var today = new Date().format("yyyyMMdd");
			if (price_down_info_layer == "" || price_down_info_layer != today) {
				$(this).show();
				elandmall.util.setCookie({ name: "price_down_info_layer", value: today, age: 365, path: "/cart" });
			};
			var closeLayer = function() {
				$("#item_price_down_info:visible").hide();
				$("body").unbind("click", closeLayer);
			};			
			$("body").click(closeLayer);
		});
		$("a[name='go_deli_no_button']").click(function(e) {
			e.preventDefault();
			var button = $(this);
			var deli_no = button.attr("deli_no");
			window.location.href = "/search/search.action?deliCostPoliNo="+deli_no;
		});
		
		$(":checkbox[cart_grp_check='true']").click(function(e){
			var chk = $(this);
			if(chk.is(":checked")) {
				var cart_grp_cd = chk.attr("cart_grp_cd");
				var cart_gb = chk.attr("cart_gb");
				$.each(item_checkbox.filter("[cart_gb='"+cart_gb+"']:checked"), function(){
                    if( cart_grp_cd != $(this).attr("cart_grp_cd") ) {
						alert("오늘받송과 오늘직송 상품은 같이 \n주문할 수 없습니다.");
						chk.attr("checked", false);
						updateCartList();
						return false;
					}
				});	
			}
		});
		
		updateCartList();
	});
})(jQuery);