;(function($) {
	var CART = window.CART = {
		goods: {},
		groups: {}
	};
	
	$(document).ready(function() {
		//[START] 옵션 변경
		if(elandmall.global.disp_mall_no == '0000053') {
			all_check_button = $("input[name='all_check_button']");
		}
		
		$("a[role='opt_button']").click(function(e) {
			var cart_seq = $(this).attr("cart_seq");
			var goods = CART.goods[cart_seq];
			var dimmChk = $(this).attr("dimmChk");
			var set_items = [];	//세트상품의 경우 변경된 옵션 저장
			elandmall.popup.itemLayer({
				goods_no: goods.goods_no,
				item_no: goods.item_no,
				vir_vend_no: goods.vir_vend_no,
				gift_goods_info: goods.gift_goods_info,
				set_goods_no: goods.set_goods_no, 
				cmps_grp_seq: goods.cmps_grp_seq,
				gubun: "CART",
				dimmChk:dimmChk,
				set_cmps_item_nos: (function() {
					var set_cmps_item_nos = [];
					if (goods.goods_cmps_divi_cd == "20") {	//세트상품
						$.each(goods.set_items, function() {
							set_cmps_item_nos.push(this.set_cmps_item_no);
						});
					};
					return set_cmps_item_nos;
				})(),
				callback: function(item) {
					var diff_count = 0;
					var params = [];
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
						if (diff_count == 0) {
							alert("변경된 옵션이 없습니다.");
							return false;								
						};
						params.push($.extend({}, goods, { gift_goods_info: item.gift_goods_info, set_items: set_items }));
					} else if (item.item_no == goods.item_no && item.gift_goods_info == goods.gift_goods_info) {
						alert("변경된 옵션이 없습니다.");
						return false;
					} else {
						params.push($.extend({}, goods, { item_no: item.item_no, gift_goods_info: item.gift_goods_info, vir_vend_no: item.vir_vend_no }));
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
						
						var order_qty = +$("#order_qty_" + cart_seq).val()
						if(!isNaN(sale_poss_qty) && !isNaN(order_qty) && Number(sale_poss_qty) < Number(order_qty)){
							alert("해당 상품은 최대 " + elandmall.util.toCurrency(sale_poss_qty) + "개까지 주문 가능합니다.");
							return false;
						}
					}else{			
						var sale_poss_qty = item.sale_poss_qty;
						var order_qty = +$("#order_qty_" + cart_seq).val()
						if(!isNaN(sale_poss_qty) && !isNaN(order_qty) && Number(sale_poss_qty) < Number(order_qty)){
							alert("해당 상품은 최대 " + elandmall.util.toCurrency(sale_poss_qty) + "개까지 주문 가능합니다.");
							return false;
						}
					}
					$.ajax({
						url: "/cart/updateCartOption.action",
						type: "POST",
						dataType: "json",
						data: { cart_data: JSON.stringify(params) },
						success: function(data) {
							window.location.href = "/cart/initCart.action";
						}
					});
				}
			});
			return false;
		});
		//[END] 옵션 변경
		//[START] 수량 변경
		$(":input[name='order_qty']").blur(function() {
			var input = $(this);
			var cart_seq = input.attr("cart_seq");
			var goods = CART.goods[cart_seq];
			var ord_poss_max_qty = goods.ord_poss_max_qty;
			var ord_poss_min_qty = goods.ord_poss_min_qty;
			var goods_type_cd = goods.goods_type_cd;
			var sale_unit_qty = +(goods_type_cd != "50" && goods.sale_unit_qty > 0 ? goods.sale_unit_qty : 1);
			var order_qty = (function() {
				var update_qty = +input.val();
				var pre_order_qty = +input.attr("pre_order_qty");
				if ($.isNumeric(update_qty) === true) {
					update_qty = +input.val();
					if ( goods_type_cd != "50" && sale_unit_qty > 1 ){
						update_qty = parseInt(update_qty/sale_unit_qty)*sale_unit_qty;
					}
				} else {
					update_qty = pre_order_qty;
				};
				
				var nplusChkParam = $.extend({},{ord_qty:update_qty, nplus_base_cnt:goods.nplus_base_cnt, nplus_cnt:goods.nplus_cnt, sale_poss_qty:goods.sale_poss_qty});
				if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
					update_qty = pre_order_qty;
				}
				if (update_qty < 1) {
					alert("수량은 "+sale_unit_qty+"개 이상만 입력 가능 합니다.");
					update_qty = pre_order_qty;
				} else if (ord_poss_max_qty > 0 && update_qty > ord_poss_max_qty) {
					alert("상품은 최대 " + elandmall.util.toCurrency(ord_poss_max_qty) + "개까지 주문 가능합니다.");
					update_qty = pre_order_qty;
				} else if (update_qty < ord_poss_min_qty) {
					alert(ord_poss_min_qty + "개 이상 구매해야 합니다.");
					update_qty = pre_order_qty;
				} else if (update_qty < sale_unit_qty) {
					alert(sale_unit_qty + "개 이상 구매해야 합니다.");
					update_qty = pre_order_qty;
				};
				return update_qty;
			})();
			this.value = order_qty;
			input.attr("pre_order_qty", order_qty);
		});
		$("a[role='order_qty_increase_button']").click(function() {
			var button = $(this);
			var cart_seq = button.attr("cart_seq");
			var goods = CART.goods[cart_seq];
			var direction = button.attr("direction");
			var cart_no = goods.cart_no;
			var order_qty = $("#order_qty_" + cart_seq);
			var increase = direction == "+" ? 1 : -1 ;
			var goods_type_cd = goods.goods_type_cd;
			var sale_unit_qty = +(goods_type_cd != "50" && goods.sale_unit_qty > 0 ? goods.sale_unit_qty : 1);
			var ord_poss_max_qty = goods.ord_poss_max_qty;
			var ord_poss_min_qty = goods.ord_poss_min_qty;
			if ( (+(order_qty.val())%sale_unit_qty) > 0 ) {
				if ( direction == "+" ) {
					order_qty.val(0);
				} else {
					order_qty.val(sale_unit_qty*2);
				}
			}
			
			var update_qty = +order_qty.val() + (sale_unit_qty * increase);
			
			var nplusChkParam = $.extend({},{ord_qty:update_qty, nplus_base_cnt:goods.nplus_base_cnt, nplus_cnt:goods.nplus_cnt, sale_poss_qty:goods.sale_poss_qty});
			if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
				return false;
			}
			if (update_qty < 1) {
				alert("수량은 "+sale_unit_qty+"개 이상만 입력 가능 합니다.");
				return false;
			};
			if (ord_poss_max_qty > 0 && update_qty > ord_poss_max_qty) {
				alert("상품은 최대  " + elandmall.util.toCurrency(ord_poss_max_qty) + "개까지 주문 가능합니다.");
				return false;
			};
			if (update_qty < ord_poss_min_qty) {
				alert(ord_poss_min_qty + "개 이상 구매해야 합니다.");
				return false;
			};
			if (update_qty < sale_unit_qty) {
				alert(sale_unit_qty + "개 이상 구매해야 합니다.");
				return false;
			};
			
			order_qty.val(update_qty);
			return false;
		});
		$("a[role='order_qty_button']").click(function() {
			var cart_seq = $(this).attr("cart_seq");
			var goods = CART.goods[cart_seq];
			var cart_no = goods.cart_no;
			var input = $("#order_qty_" + cart_seq);
			var sale_poss_qty = goods.sale_poss_qty;
			var order_qty = +input.attr("order_qty");
			if (order_qty == (+input.val())) {
				alert("변경된 수량이 없습니다.");
				return false;
			};
			if (+input.val() > sale_poss_qty) {
				alert("상품은 최대 " + elandmall.util.toCurrency(sale_poss_qty) + "개까지 주문 가능합니다.");
				return false;				
			};
			$.ajax({
				url: "/cart/updateCartQty.action",
				type: "POST",
				dataType: "json",
				data: { cart_no: cart_no, ord_qty: +input.val() },
				success: function(data) {
					window.location.href = "/cart/initCart.action";
				}
			});				
			return false;
		});
		//[END] 수량 변경
		
		// [START] 체크박스
		(function() {
			var quick_hyper_check = function(cart_gb, cart_grp_cd) {
				if($("input:checkbox[role='item_check'][cart_gb='"+cart_gb+"'][cart_grp_cd!='" + cart_grp_cd + "']:checked").length > 0){
					alert("오늘받송과 오늘직송 상품은 같이 \n주문할 수 없습니다.");
					return false;
				}
				return true;
			}
			var select_check_button = $("button[name='select_button'][role='check']").click(function() {		//장바구니 모든 상품 체크
				var cart_gb = $(this).attr("cart_gb");
				var cart_in_gb = $(this).attr("cart_in_gb");
				if(cart_in_gb) {
					if(quick_hyper_check(cart_gb, cart_in_gb)) {
						$("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "'][cart_grp_cd='"+cart_in_gb+"']:not(:checked)").prop("checked", true);
						$("input:checkbox[role='cart_group_check'][cart_gb='" + cart_gb + "'][cart_grp_cd='"+cart_in_gb+"']:not(:checked)").prop("checked", true);	
					}	
				}else {
					$("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "']:not(:checked)").prop("checked", true);
					$("input:checkbox[role='cart_group_check'][cart_gb='" + cart_gb + "']:not(:checked)").prop("checked", true);
				}
				
				updateCartList(cart_gb);
			});
			var select_uncheck_button = $("button[name='select_button'][role='uncheck']").click(function() {		//장바구니 모든 상품 언체크
				var cart_gb = $(this).attr("cart_gb");
				var cart_in_gb = $(this).attr("cart_in_gb");
				if(cart_in_gb) {
					$("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "'][cart_grp_cd='"+cart_in_gb+"']:checked").prop("checked", false);
					$("input:checkbox[role='cart_group_check'][cart_gb='" + cart_gb + "'][cart_grp_cd='"+cart_in_gb+"']:checked").prop("checked", false);
				}else {
					$("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "']:checked").prop("checked", false);
					$("input:checkbox[role='cart_group_check'][cart_gb='" + cart_gb + "']:checked").prop("checked", false);					
				}
				updateCartList(cart_gb);
			});
			var cart_group_check = $("input:checkbox[role='cart_group_check']").click(function() {	//그룹별 체크/언체크
				var cart_gb = $(this).attr("cart_gb");
				var cart_grp_cd = $(this).attr("cart_grp_cd");
				var cart_in_gb = $(this).attr("cart_in_gb");
				if(cart_in_gb){
					if (this.checked) {
						if(quick_hyper_check(cart_gb, cart_grp_cd)){
							$("input:checkbox[role='item_check'][cart_grp_cd='" + cart_grp_cd + "']:not(:checked)").prop("checked", true);	
						}else {
							$(this).prop('checked', false);
						}		
					} else {
						$("input:checkbox[role='item_check'][cart_grp_cd='" + cart_grp_cd + "']:checked").prop("checked", false);				
					}
				}else {
					if (this.checked) {
						$("input:checkbox[role='item_check'][cart_grp_cd='" + cart_grp_cd + "']:not(:checked)").prop("checked", true);
					} else {
						$("input:checkbox[role='item_check'][cart_grp_cd='" + cart_grp_cd + "']:checked").prop("checked", false);
					}
				}
				updateCartList(cart_gb);
			});
			var item_check = $("input:checkbox[role='item_check']").click(function() {	//단품별 체크/언체크
				var cart_gb = $(this).attr("cart_gb");
				var cart_grp_cd = $(this).attr("cart_grp_cd");
				var cart_grp_check = $("input:checkbox[role='cart_group_check'][cart_grp_cd='" + cart_grp_cd + "']");
				if ($("input:checkbox[role='item_check'][cart_grp_cd='" + cart_grp_cd + "']:not(:checked)").length > 0) {
					cart_grp_check.prop("checked", false);
				} else {
					cart_grp_check.prop("checked", true);
				};
				updateCartList(cart_gb);
			});
			var cart_grp_check = $("input:checkbox[cart_grp_check='true']").click(function(){
				var chk = $(this);
				if(chk.is(":checked")) {
					var cart_grp_cd = chk.attr("cart_grp_cd");
					var cart_gb = chk.attr("cart_gb");
					$.each($("input:checkbox[role='item_check']").filter("[cart_gb='"+cart_gb+"']:checked"), function(){
	                    if( cart_grp_cd != $(this).attr("cart_grp_cd") ) {
							alert("오늘받송과 오늘직송 상품은 같이 \n주문할 수 없습니다.");
							chk.prop("checked", false);
							updateCartList(cart_gb);
							return false;
						}
					});	
				}
			});
			
			var updateCartList = function(cart_gb) {
				var total_goods_price_text = $("#total_goods_price_text_" + cart_gb);
				var total_dc_amt_text = $("#total_dc_amt_text_" + cart_gb);
				var total_deli_price_text = $("#total_deli_price_text_" + cart_gb);
				var total_order_price_text = $("#total_order_price_text_" + cart_gb);
				var total_goods_price = 0;
				var total_deli_price = 0;
				var total_dc_amt = 0;
				$.each(CART.groups[cart_gb], function(cart_grd_cd) {
					var grp_goods_price_text = $("#grp_goods_price_text_" + cart_grd_cd);
					var grp_dc_amt_text = $("#grp_dc_amt_text_" + cart_grd_cd);
					var grp_deli_price_text = $("#grp_deli_price_text_" + cart_grd_cd);
					var grp_order_price_text = $("#grp_order_price_text_" + cart_grd_cd);
					
					var grp_goods_price = 0;
					var grp_dc_amt = 0;
					var grp_deli_price = 0;
					
					$.each(this, function(key) {	//key: dlvp_seq, vir_vend_no
						var dlvp_goods_price = 0;
						var deli = this.deli;
						var deli_ul_on = $("#deli_ul_on_" + key);
						var deli_ul_off = $("#deli_ul_off_" + key);
						if (key == "SOLDOUT") {
							return true;
						};
						$.each(this.goods, function(i, cart_seq) {
							var goods = CART.goods[cart_seq];
							if ($("#item_check_" + cart_seq).is(":checked")) {
								dlvp_goods_price += (goods.sale_price * goods.ord_qty);
								grp_goods_price += (goods.sale_price * goods.ord_qty);
								total_goods_price += (goods.sale_price * goods.ord_qty);
								$("#dc_amt_" + cart_seq).each(function() {
									grp_dc_amt += +$(this).attr("amt");
									total_dc_amt += +$(this).attr("amt");
								});								 
							};
						});
						if (dlvp_goods_price > 0 && (cart_grd_cd == "10" || cart_grd_cd == "60" || cart_grd_cd == "70" || cart_grd_cd == "80") && deli.r_deli_cost_form_cd != "30" && deli.r_deli_cost_form_cd != "60" && deli.st_amt > dlvp_goods_price) {	//택배 배송에 착불/묵음루료가  아니면 배송비 노출
							grp_deli_price += deli.r_deli_cost_amt;
							total_deli_price += deli.r_deli_cost_amt;													 
						}else if (dlvp_goods_price > 0 && (cart_grd_cd == "10" || cart_grd_cd == "60" || cart_grd_cd == "70" || cart_grd_cd == "80") && deli.r_deli_cost_form_cd != "30" && deli.r_deli_cost_form_cd != "60" && deli.r_deli_cost_form_cd == "40") {	//택배 배송에 착불/묵음루료가  아니면 배송비 노출
							grp_deli_price += deli.r_deli_cost_amt;
							total_deli_price += deli.r_deli_cost_amt;													 
						};
					});
					grp_goods_price_text.text(elandmall.util.toCurrency(grp_goods_price));
					grp_dc_amt_text.text((grp_dc_amt > 0 ? "- " : "") + elandmall.util.toCurrency(grp_dc_amt));
					grp_deli_price_text.text((grp_deli_price > 0 ? "+ " : "") + elandmall.util.toCurrency(grp_deli_price));
					grp_order_price_text.text(elandmall.util.toCurrency(grp_goods_price - grp_dc_amt + grp_deli_price));	
				});
				total_goods_price_text.text(elandmall.util.toCurrency(total_goods_price));
				total_dc_amt_text.text(elandmall.util.toCurrency(total_dc_amt));
				total_deli_price_text.text(elandmall.util.toCurrency(total_deli_price));
				total_order_price_text.text(elandmall.util.toCurrency(total_goods_price - total_dc_amt + total_deli_price));
			};
		})();
		// [END] 체크박스
		
		//[START] 삭제
		(function() {
			$("button[name='delete_button']").click(function() {
				var cart_gb = $(this).attr("cart_gb");
				var cart_in_gb = $(this).attr("cart_in_gb");
				var button = $(this);
				var role = button.attr("role");
				var cart_no_list = [];
				var soldout_count = 0;
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
						coupon: goods.dlp_coupon,
						variant: ga_variant,
						quantity: goods.ord_qty,
						dimension10: goods.set_goods_no
					});
				};
				if (role == "item") {	//단품별 삭제
					var cart_seq = button.attr("cart_seq");
					var goods = CART.goods[cart_seq];
					addGoods(goods);
				} else if (role == "checked") {	//선택단품 삭제
					var cart_goods;
					if(cart_in_gb) {
						cart_goods = $("input:checkbox[role='item_check'][cart_grp_cd='" + cart_in_gb + "']:checked");
					}else {
						cart_goods = $("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "']:checked");
					}
					cart_goods.each(function() {
						var cart_seq = $(this).attr("cart_seq");
						var goods = CART.goods[cart_seq];
						addGoods(goods);
					});
				} else if (role == "soldout") {	//품절단품 삭제
					$("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "']").each(function() {
						var cart_seq = $(this).attr("cart_seq");
						var goods = CART.goods[cart_seq];
						if (goods.ret_code != "0000") {
							addGoods(goods);							
						};
					});
					soldout_count = cart_no_list.length;
				};
				if (cart_no_list.length == 0) {
					alert("삭제할 상품을 선택해주세요.");
					return false;
				};
				
				if (confirm( soldout_count > 0 ? "품절된 상품이 " + (elandmall.util.toCurrency(soldout_count)) + "개 있습니다. 장바구니에서 삭제하시겠습니까?" : "선택한 상품을 삭제 하시겠습니까?" )) {
					
					//console.dir(ga_products);
					
					$.ajax({
						url: "/cart/deleteCart.action",
						type: "POST",
						dataType: "json",
						data: { cart_no: cart_no_list },
						success: function(data) {
							alert("장바구니에서 상품이 삭제되었습니다.");
							dataLayer.push({
								event: "removeFromCart",
								ecommerce: {
									remove: {
										products: ga_products
									}
								}
							});
							window.location.href = "/cart/initCart.action";
						}					
					});					
				};				
			});
			$("button[name='move_deli_button'][role='item']").click(function() {	//매장수령 상품 택배 이동
				var cart_seq = $(this).attr("cart_seq");
				var goods = CART.goods[cart_seq];
				var cart_no = goods.cart_no;
				if (confirm("택배배송으로 변경하시겠습니까?\n택배배송으로 변경할 경우, 상품금액에 따라 배송비가 부과될 수 있습니다.")) {
					$.ajax({
						url: "/cart/updateCartGrp.action",
						type: "POST",
						dataType: "json",
						data: { cart_no: cart_no, cart_grp_cd: "10" },
						success: function(data) {
							window.location.href = "/cart/initCart.action";
						}
					});					
				};
			});
		})();
		//[END] 삭제
		
		//[START] 구매하기
		(function() {
			var order = function(cart_gb, cart_seq) {
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
						brand: goods.brand_nm,
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
					cart_no = [];
					ga_products = [];
					
					(function() {
						if (cart_seq != undefined) {	//단품별 구매
							return $("input:checkbox[role='item_check'][cart_seq='" + cart_seq + "']");
						} else {	//장바구니별 선택상품 구매
							return $("input:checkbox[role='item_check'][cart_gb='" + cart_gb + "']:checked");
						};
					})().each(function() {
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
								throw "최대 구매 수량은 " + elandmall.util.toCurrency(goods.ord_poss_max_qty) + "입니다.";								
							};
						};
						if (soldout === true && goods.ret_code != "0000") {
							sold_out_count++;
							
							// 상품명에서 특수문자를 공백으로 치환
							sold_out_nm += ((sold_out_count != 1 ? ", " : "") +  fnSpecialCharToBlank(goods.disp_goods_nm));
						
						};
						if (goods.ret_code == "0000") {
							addGoods(goods);
							if (goods.goods_cmps_divi_cd == "20") {	//세트상품
								$.each(goods.set_items, function() {
									cart_no.push(this.cart_no);
								});
							};
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
						elandmall.layer.createLayer({
							class_name:"layer_pop d_layer_pop on",
							title:"서비스 안내",
							layer_id:"quickInfo1",
							createContent: function(layer){
								var div = layer.div_content;
								div.load("/order/openTodayDeliInfoLayer.action?type=2", function(e){
									layer.show();	
									DK_dim_Open('quickInfo1', this.id);
									
									if(today_deli_start_cnt >= 1 && today_deli_arrive_cnt >= 1 && tot_count == today_deli_start_cnt + today_deli_arrive_cnt) { //오늘출발 + 오늘도착
										div.find("[id=info_text]").html("<span class=\"flag_icon c11\">오늘출발</span> 상품과 <span class=\"flag_icon c12\">오늘도착</span> 상품은<br />동시에 주문할수 없습니다.");
									} else if(today_deli_start_cnt >= 1 && today_deli_arrive_cnt >= 1 && tot_count != today_deli_start_cnt + today_deli_arrive_cnt){ //오늘출발 + 오늘도착 + 일반배송
										div.find("[id=info_text]").html("빠른배송 <span class=\"flag_icon c11\">오늘출발</span> <span class=\"flag_icon c12\">오늘도착</span> 상품과<br />일반 택배상품은 동시에 주문할수 없습니다.");
									} else if (today_deli_start_cnt >= 1 && today_deli_arrive_cnt == 0) {	//오늘출발 + 일반배송
										div.find("[id=info_text]").html("빠른배송 <span class=\"flag_icon c11\">오늘출발</span> 상품과<br />일반 택배상품은 동시에 주문할수 없습니다.");
									} else if (today_deli_start_cnt == 0 && today_deli_arrive_cnt >= 1) {	//오늘도착 + 일반배송
										div.find("[id=info_text]").html("빠른배송 <span class=\"flag_icon c12\">오늘도착</span> 상품과<br />일반 택배상품은 동시에 주문할수 없습니다.");
									}
									
									div.find("[name=confirmbtn]").click(function(){
										$(".btn_lay_close").click();
									});
									$(".btn_lay_close").click(function(){
										DK_dim_Close('quickInfo1');
									});
								});
							}
						}); 
						
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
					
					if (sold_out_count > 0 && cart_no.length > 0) {						
						if (confirm("[" + sold_out_nm + "]\n현재 품절되어 구매가 불가능합니다. 해당 상품을 제외하고 주문 결제 진행 하시겠습니까?")) {
							checkCarts(false);
						} else {
							throw undefined;
						};	
					} else if (sold_out_count > 0 && cart_no.length == 0) {		//품절상품만 있을 경우
						throw "현재 품절되어 구매가 불가능합니다.";
					} else if (cart_no.length == 0) {
						throw "구매하실 상품을 선택해 주세요.";					
					};
				};
				try {
					checkCarts(true);
					doOrder();
				} catch (e) {
					if (e) {
						if($.type(e.nm) != "undefined") {
							//메세지 확인 창
							elandmall.layer.createLayer({
								class_name: "layer_pop confirm d_layer_pop on",
								createContent: function(layer) {
									layer.div_content.append(
										"	<div class=\"alert_txt alig_c\">" +
										"		<br />문화비 소득공제 대상 상품은" +
										"		<br />소득공제 적용을 위해 별도 결제가 필요합니다." +
										"<br />(소득공제 대상 상품 : "+e.nm+")" +
										"	</div>" +
										"</div>" +
										"<div class=\"set_btn\">" +
										"	<button type=\"button\" class=\"btn02\"><span>확인</span></button>" +
										"</div>"		
									);
									layer.div_content.find("button").click(function() {
											layer.close();
											
									});
									layer.show();
								}
							});
						}else{
							alert(e);
						}

					};
				};
			};
			$("button[name='order_button'][role='item']").click(function() {	//단품별 구매
				var cart_gb = $(this).attr("cart_gb");
				var cart_seq = $(this).attr("cart_seq");
				var goods = CART.goods[cart_seq];
				var checkbox = $(":checkbox[role='item_check'][cart_gb='" + cart_gb + "']");
				if (goods.ret_code != "0000") {
					if (goods.ret_code == "-0001") {
						alert("종료된 상품은 구매가 불가능합니다. ");
					} else {
						alert("현재 품절되어 구매가 불가능합니다. ");						
					};
					return false;					
				}
				order(cart_gb, cart_seq);
			});
			$("button[name='order_button'][role='checked'], #no_member_order_button").click(function() {	//선택된 단품 모두 구매
				var cart_gb = $(this).attr("cart_gb");
				order(cart_gb);
			});
		})();
		//[END] 구매하기
		
		$("a[name='goods_detail']").click(function() {
			var cart_seq = $(this).attr("cart_seq");
			var cart = CART.goods[cart_seq];			
			if (cart.set_goods_no != "" && cart.set_items.length == 0) {	 //묶음상품
				elandmall.goods.goDetail({ goods_no: cart.set_goods_no, goods_nm : cart.disp_goods_nm , cust_sale_price : cart.cust_sale_price , brand_nm : cart.brand_nm , dlp_category : cart.dlp_category });
			} else {
				elandmall.goods.goDetail({ goods_no: cart.goods_no, vir_vend_no: cart.vir_vend_no, goods_nm : cart.disp_goods_nm , cust_sale_price : cart.cust_sale_price , brand_nm : cart.brand_nm , dlp_category : cart.dlp_category });				
			};
			return false;
		});
		$("button[name='wishlist_button']").click(function() {
			var cart_seq = $(this).attr("cart_seq");
			var cart = CART.goods[cart_seq];
			elandmall.wishlist.addGoodsWish(cart.goods_no, cart.vir_vend_no, cart.sale_shop_divi_cd, cart.sale_shop_no, cart.sale_area_no, cart.conts_dist_no);			
		});
		$("a[name='download_dbl_coupon_button']").click(function(e) {
			var button = $(this);
			e.preventDefault();
			elandmall.cpnDown({
				cert_key: button.attr("cert_key"),
				promo_no: button.attr("promo_no")
			});
		});
		$("button[name='go_main_button']").click(function() {
			if( !elandmall.global.disp_mall_no == '0000053' ) {
				elandmall.hdLink("MAIN");
			} else {
				elandmall.hdLink('MALL_MAIN');
			}
		});
		$("a[name='go_brand_button']").click(function(e) {
			var button = $(this);
			var brand_no = button.attr("brand_no");
			e.preventDefault();			
			elandmall.brand.goBrandShop(brand_no);
		});
		$("a[name='go_deli_no_button']").click(function(e) {
			var button = $(this);
			var deli_no = button.attr("deli_no");
			e.preventDefault();			
			window.location.href = "/search/search.action?deliCostPoliNo="+deli_no;
		});
		
		// 최초 로드시 체크박스 전체 선택 처리하여 선택 처리된 상품기준 금액으로 화면 갱신 
		// 당일배송 상품 제외
		if(elandmall.global.disp_mall_no == '0000045') {
			$("button[name='select_button'][role='check']").click();
		} else {
			$("button[name='select_button'][role='check']").filter("[cart_gb!='3']").click();
		}
	});
})(jQuery);