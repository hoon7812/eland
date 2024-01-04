/**
 * 업무관련(상품/주문/장바구니/이벤트등등...)
 */
;(function($) {

	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};
	};

	var Cart = function() {
		var layer_id = "_CART_RESULT_LAYER_";
		var running = function() {};	//do nothing...
		var restore = function() {
			elandmall.cart.addCart = function(p) {
				doAddCart(p);
			};

			// 2017.11.28 Start
			elandmall.cart.addCartEvent = function(p) {
				doAddCartEvent(p);
			};
			elandmall.cart.addCartEventMobile = function(p) {
				doAddCartEventMobile(p);
			};
			// 2017.11.28 End

		};
		var doAddCart = function(p) {
			var ga_products = [];
			p = $.extend({ cart_divi_cd: "20", items: [] ,event_layer_yn : "N"}, p);
			if (p.cart_divi_cd != "20") {	//바로구매가 아닐경우
				elandmall.cart.addCart = running;
			};
			if ($.type(p.items) != "array") {
				p = [ p ];
			};
			var carts = [];
			$.each(p.items, function(idx, cart) {
				var cart = $.extend({
					goods_no: "",
					goods_nm: "",
					brand_nm: "",
					sale_price: 0,
					chk_yn: "Y",
					add_ord_sel_info: "",
					gift_goods_info: "",
					goods_cmps_divi_cd: "10",
					multi_item_yn: "",
					multi_price_yn: "",
					cart_divi_cd: p.cart_divi_cd,	//10: 장바구니, 20: 바로구매
					cart_grp_cd: "10",	//매장수령(40)
					ord_yn: "N",
					sale_shop_divi_cd: "",
					sale_shop_no: "",
					sale_area_no: "",
					set_goods_no: "",
					conts_dist_no: "",
					nplus_base_cnt: 0,
					nplus_cnt: 0,
					sale_unit_qty: 0,
					stock_qty_disp_yn: "",
					sale_price: "",
					item_no: "",
					vir_vend_no: "",
					coupon: "",
					category_nm: "",
					ord_qty: 0,
					disp_mall_no: elandmall.global.disp_mall_no
				}, this);

				carts.push(cart);
				
				var ga_variant = "옵션없음";
				if(typeof(this.item_nm) != "undefined"){
					ga_variant = this.item_nm.replaceAll(",","/");
				}

				if (cart.goods_nm != "" && cart.brand_nm != "" && cart.sale_price > 0) {
					ga_products.push({
						name: cart.goods_nm,
						id: cart.goods_no,
						price: cart.sale_price,
						brand: cart.brand_nm,
						category: cart.category_nm,
						coupon : cart.coupon,
						quantity: cart.ord_qty,
						variant: ga_variant,
						dimension10: cart.set_goods_no
					});
				};
			});
			console.dir(carts);
			console.dir(ga_products);
			$.ajax({
				url: "/cart/registCart.action",
				type: "POST",
				dataType: "json",
				data: { cart_data: JSON.stringify(carts) },
				success: function(data) {
					if (p.cart_divi_cd == "20") {	//바로구매
						elandmall.cart.doOrder({ cart_no_list: data.cart_no_list, cart_divi_cd: "20", ga_products: ga_products, param_nomember : p.param_nomember , event_layer_yn : p.event_layer_yn });
					} else {	//장바구니
						if (ga_products.length > 0) {	//GA 태깅
							dataLayer.push({
								event: "addToCart",
								ecommerce: {
									add: {
										products: ga_products
									}
								}
							});
						};
						elandmall.popup.cartResultLayer();

						//상품상세일때 장바구니에 담기면 레이어 닫기.
						if($("#gd_optlyr_cls_btn").length > 0){
							$("#gd_optlyr_cls_btn").click();
						}

						if(elandmall.global.chnl_cd != '10'){
							if($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version)){
								var cart_cnt = data.cart_count;
								location.href="elandbridge://cart/"+cart_cnt+"/";
							}
						}
					};
				},
				error: function(m) {
					alert(m.error_message);
					restore();
				}
			});
		};

		// 2017.11.28 Start
		var doAddCartEvent = function(p) {
			var nomember;
			var ga_products = [];
			p = $.extend({ cart_divi_cd: "20", items: [] }, p);
			if (p.cart_divi_cd != "20") {	//바로구매가 아닐경우
				elandmall.cart.addCartEvent = running;
			};
			if ($.type(p.items) != "array") {
				p = [ p ];
			};
			var carts = [];
			$.each(p.items, function(idx, cart) {
				var cart = $.extend({
					goods_no: "",
					goods_nm: "",
					brand_nm: "",
					sale_price: 0,
					chk_yn: "Y",
					add_ord_sel_info: "",
					gift_goods_info: "",
					goods_cmps_divi_cd: "10",
					multi_item_yn: "",
					multi_price_yn: "",
					cart_divi_cd: p.cart_divi_cd,	//10: 장바구니, 20: 바로구매
					cart_grp_cd: "10",	//매장수령(40)
					ord_yn: "N",
					sale_shop_divi_cd: "",
					sale_shop_no: "",
					sale_area_no: "",
					set_goods_no: "",
					conts_dist_no: "",
					nplus_base_cnt: 0,
					nplus_cnt: 0,
					sale_unit_qty: 0,
					stock_qty_disp_yn: "",
					sale_price: "",
					item_no: "",
					vir_vend_no: "",
					coupon: "",
					category_nm: "",
					ord_qty: 0
				}, this);

				carts.push(cart);

				if (cart.goods_nm != "" && cart.brand_nm != "" && cart.sale_price > 0) {
					ga_products.push({
						name: cart.goods_nm,
						id: cart.goods_no,
						price: cart.sale_price,
						brand: cart.brand_nm,
						category: cart.category_nm,
						coupon : cart.coupon,
						quantity: cart.ord_qty
					});
				};
			});
			console.dir(carts);
			console.dir(ga_products);

/*
			$.ajax({
				url: "/cart/orderItemCheckForEvent.action",
				type: "POST",
				dataType: "json",
				data: { cart_data: JSON.stringify(carts) },
				success: function(data) {
					if (p.cart_divi_cd == "20") {	//바로구매
						elandmall.cart.doOrderEvent({ cart_no_list: data.cart_no_list, cart_divi_cd: "20", ga_products: ga_products });
					} else {};
				},
				error: function(m) {
					alert(m.error_message);
					restore();
				}
			});
*/
/*
			p = $.extend({ cart_no_list: [], cart_divi_cd: "" }, p);
			if ($.type(p.cart_no_list) != "array" && p.cart_no_list.length == 0) {
				alert("주문상품 정보가 올바르지 않습니다[0]");
				return false;
			};
			if (p.cart_divi_cd != "10" && p.cart_divi_cd != "20") {
				alert("주문상품 정보가 올바르지 않습니다[1]");
				return false;
			};
*/
			elandmall.isLogin({
				nomember: true,
				nomember_proc: nomember,
				login: function() {
					var form = (function() {
						if ($("#_ORDER_INIT_FORM_").length == 0) {
							$("<form id='_ORDER_INIT_FORM_'></form>").attr({
								action: elandmall.util.https("/order/initOrder.action"),
								method: "get"	//IE11에서 post로 넘기면 refresh 패러미터가 사라짐???
							}).appendTo("body");
						};
						return $("#_ORDER_INIT_FORM_").empty();
					})();
/*
					$.each(p.cart_no_list, function() {
						form.append($("<input type='hidden' name='cart_no'></input>").val(this));
					});
*/
					form.append($("<input type='hidden' id='cart_data' name='cart_data' />").val(JSON.stringify(carts)));
					form.append($("<input type='hidden' id='cart_divi_cd' name='cart_divi_cd' />").val("20"));

					//주문서 진입전 주문 상품 유효성 확인
					$.ajax({
						url: "/order/orderItemCheckForEvent.action", //:NGCPO-706 orderItemCheckForEvent
						data: form.serialize(),
						type: "POST",
						dataType:"json",
						success: function(result) {

							if ($.type(ga_products) == "array" && ga_products.length > 0) {	//QA 태깅
								dataLayer.push({
									event: "checkout",
									ecommerce: {
										checkout: {
											actionField: { step: 1 },
											products: ga_products
										}
									}
								});
							};
							elandmall.util.setCookie({ name: "reloaded", value: "N", domain: elandmall.global.cookie_domain, path: "/order" });

							if(result!= null && result.goods_list.length > 0) { //더블쿠폰적용:NGCPO-706

								//메세지 확인 창
								elandmall.layer.createLayer({
									class_name: "layer_pop confirm d_layer_pop on",
									createContent: function(layer) {
										layer.div_content.append(
											"<div class=\"alert_box03\">" +
											"	<div class=\"alert_txt\">" +
											"		1개 상품을 주문하실 경우에만 더블쿠폰이 적용됩니다. 1개 상품으로 주문하시겠습니까?" +
											"	</div>" +
											"</div>" +
											"<div class=\"set_btn\">" +
											"	<button type=\"button\" class=\"btn02\"     data-value=\"Y\"><span>1개 상품으로 주문하기 </span></button>" +
											"	<button type=\"button\" class=\"btn02 c01\" data-value=\"N\"><span>선택한 상품으로 주문하기 </span></button>" +
											"</div>"
										);
										layer.div_content.find("button").click(function() {
												layer.close();
												var sval = $(this).attr("data-value");
												var limit_goods_list = result.goods_list;

												if(sval == "Y") {
													for(var i =0;i < limit_goods_list.length;i++){
														form.append($("<input type='hidden' name='limit_goods_list'></input>").val(limit_goods_list[i]));
													}
												}

												form.append($("<input type='hidden' name='double_coupon_type'></input>").val(sval));

												if(result!= null && result.cart_no_list.length > 0) {
													$.each(result.cart_no_list, function() {
														form.append($("<input type='hidden' name='cart_no'></input>").val(this));
													});
												}

												form.find("#cart_data").val("");

												form.submit();
										});
										layer.show();
									}
								});

							} else { //일반

								if(result!= null && result.cart_no_list.length > 0) {
									$.each(result.cart_no_list, function() {
										form.append($("<input type='hidden' name='cart_no'></input>").val(this));
									});
								}

								form.find("#cart_data").val("");

								form.submit();
							}

						},
						error: function(e) {
							if (e && e.error_message) {
								alert(e.error_message);
							} else {
								alert("죄송합니다. 주문서를 생성할 수 없습니다.");
							};
						}
					});
				}
			});


		};

		var doAddCartEventMobile = function(p) {
			var nomember;
			var ga_products = [];
			p = $.extend({ event_layer_yn:"",action_id:"", cart_divi_cd: "20", items: [] }, p);
			if (p.cart_divi_cd != "20") {	//바로구매가 아닐경우
				elandmall.cart.addCartEvent = running;
			};
			if ($.type(p.items) != "array") {
				p = [ p ];
			};
			var carts = [];
			$.each(p.items, function(idx, cart) {
				var cart = $.extend({
					goods_no: "",
					goods_nm: "",
					brand_nm: "",
					sale_price: 0,
					chk_yn: "Y",
					add_ord_sel_info: "",
					gift_goods_info: "",
					goods_cmps_divi_cd: "10",
					multi_item_yn: "",
					multi_price_yn: "",
					cart_divi_cd: p.cart_divi_cd,	//10: 장바구니, 20: 바로구매
					cart_grp_cd: "10",	//매장수령(40)
					ord_yn: "N",
					sale_shop_divi_cd: "",
					sale_shop_no: "",
					sale_area_no: "",
					set_goods_no: "",
					conts_dist_no: "",
					nplus_base_cnt: 0,
					nplus_cnt: 0,
					sale_unit_qty: 0,
					stock_qty_disp_yn: "",
					sale_price: "",
					item_no: "",
					vir_vend_no: "",
					coupon: "",
					category_nm: "",
					ord_qty: 0,
					disp_mall_no: elandmall.global.disp_mall_no
				}, this);

				carts.push(cart);

				if (cart.goods_nm != "" && cart.brand_nm != "" && cart.sale_price > 0) {
					ga_products.push({
						name: cart.goods_nm,
						id: cart.goods_no,
						price: cart.sale_price,
						brand: cart.brand_nm,
						category: cart.category_nm,
						coupon : cart.coupon,
						quantity: cart.ord_qty
					});
				};
			});
			console.dir(carts);
			console.dir(ga_products);

/*
			$.ajax({
				url: "/cart/orderItemCheckForEvent.action",
				type: "POST",
				dataType: "json",
				data: { cart_data: JSON.stringify(carts) },
				success: function(data) {
					if (p.cart_divi_cd == "20") {	//바로구매
						elandmall.cart.doOrderEvent({ cart_no_list: data.cart_no_list, cart_divi_cd: "20", ga_products: ga_products });
					} else {};
				},
				error: function(m) {
					alert(m.error_message);
					restore();
				}
			});
*/
/*
			p = $.extend({ cart_no_list: [], cart_divi_cd: "" }, p);
			if ($.type(p.cart_no_list) != "array" && p.cart_no_list.length == 0) {
				alert("주문상품 정보가 올바르지 않습니다[0]");
				return false;
			};
			if (p.cart_divi_cd != "10" && p.cart_divi_cd != "20") {
				alert("주문상품 정보가 올바르지 않습니다[1]");
				return false;
			};
*/
			elandmall.isLogin({
				nomember: true,
				nomember_proc: nomember,
				login: function(result) {
					var form = $("<form></form>").attr({
						action: elandmall.util.https("/order/initOrder.action"),
						method: "POST"
					});
					var agreement_layer = undefined;
/*
					$.each(p.cart_no_list, function() {
						form.append($("<input type='hidden' name='cart_no'></input>").val(this));
					});
*/
					form.append($("<input type='hidden' id='cart_data' name='cart_data' />").val(JSON.stringify(carts)));
					form.append($("<input type='hidden' id='cart_divi_cd' name='cart_divi_cd' />").val("20"));
				    form.append($("<input type='hidden' id='event_layer_yn' name='event_layer_yn' />").val(p.event_layer_yn));
				    form.append($("<input type='hidden' id='action_id' name='action_id' />").val(p.action_id));
					form.appendTo("body");

					if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
						//주문서 진입전 주문 상품 유효성 확인
						$.ajax({
							url: "/order/orderItemCheckForEvent.action", //:NGCPO-706 orderItemCheckForEvent
							data: form.serialize(),
							type: "POST",
							dataType:"json",
							success: function(result) {

								if ($.type(ga_products) == "array" && ga_products.length > 0) {	//QA 태깅
									dataLayer.push({
										event: "checkout",
										ecommerce: {
											checkout: {
												actionField: { step: 1 },
												products: ga_products
											}
										}
									});
								};
								if (result.nomember) {	//비회원 구매
									elandmall.layer.createLayer({
										title: "비회원 주문 정보수집 동의",
										layer_id: "_NOMEMBER_AGREEMENT_LAYER_",
										createContent: function(layer) {
											agreement_layer = layer;
											agreement_layer.div_content.load("/order/viewNomemberAgreement.action", function() {
												var nomember_agreement_button = agreement_layer.div_content.find("button[name='nomember_agreement_button']");
												var ok_button = nomember_agreement_button.filter("[role='ok']");
												var agreement_checkbox = agreement_layer.div_content.find("#nomember_agreement_checkbox_01");
												agreement_checkbox.click(function() {
													if (this.checked === true) {
														ok_button.removeAttr("disabled");
													} else {
														ok_button.attr("disabled", "disabled");
													};
												});
												nomember_agreement_button.click(function(e) {
													var role= $(this).attr("role");
													e.preventDefault();
													if (role == "cancel") {
														layer_fix_close("_NOMEMBER_AGREEMENT_LAYER_");
													} else {
														try {
															agreement_checkbox.each(function() {
																if (!this.checked) {
																	this.focus();
																	throw $(this).attr("message");
																};
															});

															if(result!= null && result.cart_no_list.length > 0) {
																$.each(result.cart_no_list, function() {
																	form.append($("<input type='hidden' name='cart_no'></input>").val(this));
																});
															}

															form.find("#cart_data").val("");
															form.attr('action', elandmall.util.http("/gate/goodsOrderForApp.action"));
															form.submit();

														} catch (e) {
															alert(e);
														};
													};
												});
												agreement_layer.div_content.find("#show_nomember_agreement_whole_button").click(function(e) {
													e.preventDefault();
													agreement_layer.div_content.find("#nomember_agreement_div_01, #nomember_agreement_div_03").hide();
													console.dir(agreement_layer.div_content.find("#nomember_agreement_whole_div"));
													agreement_layer.div_content.find("#nomember_agreement_whole_div").show();
													$("#_NOMEMBER_AGREEMENT_LAYER_ h3.pop_tit").text("정보수집 동의 약관 전문보기");
												});
												agreement_layer.show();
											});
										},
										close_call_back: function() {
											if ($("#nomember_agreement_whole_div").is(":visible")) {
												$("#_NOMEMBER_AGREEMENT_LAYER_ h3.pop_tit").text("비회원 주문 정보수집 동의");
												agreement_layer.div_content.find("#nomember_agreement_div_01, #nomember_agreement_div_03").show();
												agreement_layer.div_content.find("#nomember_agreement_whole_div").hide();
											} else {
												layer_fix_close("_NOMEMBER_AGREEMENT_LAYER_");
											};
											elandmall.cart.closeLayer();
										}
									});
								} else {
									if(result!= null && result.goods_list.length > 0) { //더블쿠폰적용:NGCPO-706
										//메세지 확인 창
										elandmall.layer.createLayer({
											createContent: function(layer) {
												layer.div_content.append(
													"<div class=\"stxt\">1개 상품을 주문하실 경우에만 더블쿠폰이 적용됩니다.<br/> 1개 상품으로 주문하시겠습니까?</div>" +
													"<ul class=\"btn_list02 btn_ship\">" +
													"	<li><a href=\"javascript:;\" class=\"btn_bg06 btn_ord c01\" data-value=\"Y\" >1개 상품으로 주문하기 </a></li>" +
													"	<li><a href=\"javascript:;\" class=\"btn_brd03 btn_ord c01\"  data-value=\"N\" >선택한 상품으로 주문하기</a></li>" +
													"</ul>"
												);
												layer.div_content.find("a.btn_ord").click(function() {
														layer.close();
														var sval = $(this).attr("data-value");
														var limit_goods_list = rs.goods_list;

														if(sval == "Y") {
															for(var i =0;i < limit_goods_list.length;i++){
																form.append($("<input type='hidden' name='limit_goods_list'></input>").val(limit_goods_list[i]));
															}
														}

														form.append($("<input type='hidden' name='double_coupon_type'></input>").val(sval));

														if(result!= null && result.cart_no_list.length > 0) {
															$.each(result.cart_no_list, function() {
																form.append($("<input type='hidden' name='cart_no'></input>").val(this));
															});
														}

														form.find("#cart_data").val("");
														form.attr('action', elandmall.util.http("/gate/goodsOrderForApp.action"));
														form.submit();
												});
												layer.show();
											}
										});
									} else {
										if(result!= null && result.cart_no_list.length > 0) {
											$.each(result.cart_no_list, function() {
												form.append($("<input type='hidden' name='cart_no'></input>").val(this));
											});
										}

										form.find("#cart_data").val("");
										form.attr('action', elandmall.util.http("/gate/goodsOrderForApp.action"));
										form.submit();
									}


								};
							},
							error: function(e) {
								if (e && e.error_message) {
									alert(e.error_message);
								} else {
									alert("죄송합니다. 주문서를 생성할 수 없습니다.");
								};
							}
						});

					} else {
						//주문서 진입전 주문 상품 유효성 확인
						$.ajax({
							url: "/order/orderItemCheckForEvent.action", //:NGCPO-706 orderItemCheckForEvent
							data: form.serialize(),
							type: "POST",
							dataType:"json",
							success: function(result) {

								if ($.type(ga_products) == "array" && ga_products.length > 0) {	//QA 태깅
									dataLayer.push({
										event: "checkout",
										ecommerce: {
											checkout: {
												actionField: { step: 1 },
												products: ga_products
											}
										}
									});
								};
								elandmall.util.setCookie({ name: "reloaded", value: "N", domain: elandmall.global.cookie_domain, path: "/order" });
								if (result.nomember) {	//비회원 구매
									elandmall.layer.createLayer({
										title: "비회원 주문 정보수집 동의",
										layer_id: "_NOMEMBER_AGREEMENT_LAYER_",
										createContent: function(layer) {
											agreement_layer = layer;
											agreement_layer.div_content.load("/order/viewNomemberAgreement.action", function() {
												var nomember_agreement_button = agreement_layer.div_content.find("button[name='nomember_agreement_button']");
												var ok_button = nomember_agreement_button.filter("[role='ok']");
												var agreement_checkbox = agreement_layer.div_content.find("#nomember_agreement_checkbox_01");
												agreement_checkbox.click(function() {
													if (this.checked === true) {
														ok_button.removeAttr("disabled");
													} else {
														ok_button.attr("disabled", "disabled");
													};
												});
												nomember_agreement_button.click(function(e) {
													var role= $(this).attr("role");
													e.preventDefault();
													if (role == "cancel") {
														layer_fix_close("_NOMEMBER_AGREEMENT_LAYER_");
													} else {
														try {
															agreement_checkbox.each(function() {
																if (!this.checked) {
																	this.focus();
																	throw $(this).attr("message");
																};
															});

															if(result!= null && result.cart_no_list.length > 0) {
																$.each(result.cart_no_list, function() {
																	form.append($("<input type='hidden' name='cart_no'></input>").val(this));
																});
															}

															form.find("#cart_data").val("");

															form.submit();
														} catch (e) {
															alert(e);
														};
													};
												});
												agreement_layer.div_content.find("#show_nomember_agreement_whole_button").click(function(e) {
													e.preventDefault();
													agreement_layer.div_content.find("#nomember_agreement_div_01, #nomember_agreement_div_03").hide();
													console.dir(agreement_layer.div_content.find("#nomember_agreement_whole_div"));
													agreement_layer.div_content.find("#nomember_agreement_whole_div").show();
													$("#_NOMEMBER_AGREEMENT_LAYER_ h3.pop_tit").text("정보수집 동의 약관 전문보기");
												});
												agreement_layer.show();
											});
										},
										close_call_back: function() {
											if ($("#nomember_agreement_whole_div").is(":visible")) {
												$("#_NOMEMBER_AGREEMENT_LAYER_ h3.pop_tit").text("비회원 주문 정보수집 동의");
												agreement_layer.div_content.find("#nomember_agreement_div_01, #nomember_agreement_div_03").show();
												agreement_layer.div_content.find("#nomember_agreement_whole_div").hide();
											} else {
												layer_fix_close("_NOMEMBER_AGREEMENT_LAYER_");
											};
											elandmall.cart.closeLayer();
										}
									});
								} else {
									if(result!= null && result.goods_list.length > 0) { //더블쿠폰적용:NGCPO-706
										//메세지 확인 창
										elandmall.layer.createLayer({
											createContent: function(layer) {
												layer.div_content.append(
													"<div class=\"stxt\">1개 상품을 주문하실 경우에만 더블쿠폰이 적용됩니다.<br/> 1개 상품으로 주문하시겠습니까?</div>" +
													"<ul class=\"btn_list02 btn_ship\">" +
													"	<li><a href=\"javascript:;\" class=\"btn_bg06 btn_ord c01\" data-value=\"Y\" >1개 상품으로 주문하기 </a></li>" +
													"	<li><a href=\"javascript:;\" class=\"btn_brd03 btn_ord c01\"  data-value=\"N\" >선택한 상품으로 주문하기</a></li>" +
													"</ul>"
												);
												layer.div_content.find("a.btn_ord").click(function() {
														layer.close();
														var sval = $(this).attr("data-value");
														var limit_goods_list = rs.goods_list;

														if(sval == "Y") {
															for(var i =0;i < limit_goods_list.length;i++){
																form.append($("<input type='hidden' name='limit_goods_list'></input>").val(limit_goods_list[i]));
															}
														}

														form.append($("<input type='hidden' name='double_coupon_type'></input>").val(sval));

														if(result!= null && result.cart_no_list.length > 0) {
															$.each(result.cart_no_list, function() {
																form.append($("<input type='hidden' name='cart_no'></input>").val(this));
															});
														}

														form.find("#cart_data").val("");

														form.submit();
												});
												layer.show();
											}
										});
									} else {
										if(result!= null && result.cart_no_list.length > 0) {
											$.each(result.cart_no_list, function() {
												form.append($("<input type='hidden' name='cart_no'></input>").val(this));
											});
										}

										form.find("#cart_data").val("");
										form.submit();

									}


								};
							},
							error: function(e) {
								if (e && e.error_message) {
									alert(e.error_message);
								} else {
									alert("죄송합니다. 주문서를 생성할 수 없습니다.");
								};
							}
						});


					}

				}
			});


		};
		// 2017.11.28 End

		this.layer_id = layer_id;
		this.closeLayer = function() {
			restore();
			$("#" + layer_id).remove();
		};
		this.addCart = function(p) {
			doAddCart(p);
		};

		// 2017.11.28 Start
		this.addCartEvent = function(p) {
			doAddCartEvent(p);
		};
		this.addCartEventMobile = function(p) {
			doAddCartEventMobile(p);
		};
		// 2017.11.28 End

	};

	elandmall.cart = new Cart();

	/*
	 * sale_area_no :  영역번호 ,
	 * conts_dist_no : 컨텐츠 식별번호
	 * conts_divi_cd:컨텐츠구분코드 (TR0002)
	 * rel_no : 컨텐츠번호
	 * rel_divi_cd : 관련구분코드 (TR0003)
	 */
	elandmall.tracking = {
		fireClick:function(pin) {
			var isValidTrcStrChar = function(str) {
			    // 문자코드 영역 체크
				var result = true;
				var tempVal;
				var loop = str.length;
				for( var i=0; i < loop; i++ ) {
					tempVal = str.charCodeAt( i );

					if( tempVal < 48 || 122 < tempVal ) {
						result = false;
						break;
					};
					if(  57 < tempVal && tempVal < 65 ) {
						result = false;
						break;
					};
					if(  90 < tempVal && tempVal < 97 ) {
						result = false;
						break;
					};
				};
				return result;
			};
			var isValidTrcCode = function(code) {

				var result = true;
				if( code.length < 1 || code.substr( 0, 2 ) == "-1" || code.substr( 0, 1 ) == "0" ) {
					result = false;
				};
				if( !isValidTrcStrChar( code ) ) {
					result = false;
				};
				try {
					if( isNaN( code.substring(1) ) ) {
						result = false;
					};
				} catch( exp ) {
					result = false;
				};
				return result;
			};
			if(typeof(pin.conts_dist_no) != undefined && typeof(pin.conts_dist_no) != "undefined" && pin.conts_dist_no != ''
				&& typeof(pin.conts_divi_cd) != undefined && typeof(pin.conts_divi_cd) != "undefined" && pin.conts_divi_cd != ''
				&& typeof(pin.sale_area_no) != undefined && typeof(pin.sale_area_no) != "undefined" && pin.sale_area_no != ''
			   ){
				if(isValidTrcCode(pin.conts_dist_no) ) {
					if(typeof(elandmall.global.tracking_flag) == "undefined" || elandmall.global.tracking_flag){
						console.log(elandmall.global.tracking_flag);
						elandmall.global.tracking_flag = false;

						var vUrl = elandmall.global.scheme == "https" ? elandmall.global.https_url : "";
						vUrl += "/tracking/clickTracking.action";

						$.ajax({
							url: vUrl,
							type: "POST",
							dataType: "json",
							data:{
								area_no : pin.sale_area_no,
								conts_divi_cd : pin.conts_divi_cd,
								conts_dist_no : pin.conts_dist_no,
								rel_conts_divi_cd : pin.rel_divi_cd,
								rel_conts_no1 : pin.rel_no,
								noCache : (new Date()).getTime()

								},
							complete: function() {
								elandmall.global.tracking_flag = true;
							}
						});

					}

			    };
			}
		}
	};


	//[START] UTIL
	elandmall.util = {
		toCurrency: function(amount) {	//노출되는 금액에 대해 공통사용
			amount = String(amount);
			var data = amount.split('.');
			var sign = "";
			var firstChar = data[0].substr(0,1);
			if(firstChar == "-"){
				sign = firstChar;
				data[0] = data[0].substring(1, data[0].length);
			};
			data[0] = data[0].replace(/\D/g,"");
			if(data.length > 1){
				data[1] = data[1].replace(/\D/g,"");
			};
			firstChar = data[0].substr(0,1);
			//0으로 시작하는 숫자들 처리
			if(firstChar == "0"){
				if(data.length == 1){
					return sign + parseFloat(data[0]);
				};
			};
			var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
			data[0] += '.';
			do {
				data[0] = data[0].replace(comma, '$1,$2');
			} while (comma.test(data[0]));

			if (data.length > 1) {
				return sign + data.join('');
			} else {
				return sign + data[0].split('.')[0];
			};
		},
		getCookie: function(name) {
			var nameOfCookie = name + "=";
			var x = 0;
			while ( x <= document.cookie.length ){
				var y = (x+nameOfCookie.length);
				if ( document.cookie.substring( x, y ) == nameOfCookie ) {
					if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
						endOfCookie = document.cookie.length;
					if(name == "keywords"){ // '최근검색어'구분자를 제외하고 인코딩된 값 받음
						return document.cookie.substring( y, endOfCookie );
					}else{
						return unescape( document.cookie.substring( y, endOfCookie ) );
					}
				}
				x = document.cookie.indexOf( " ", x ) + 1;
				if ( x == 0 )
					break;
			}
			return "";
		},
		setCookie: function(p) {
			p = $.extend({
				age: null,
				path: "/",
				domain: null,
				secure: false
			}, p);

			var date = new Date();
			date.setDate(date.getDate() + p.age);
			var p_value = "";
			if(p.name == "keywords"){ // '최근검색어'구분자를 제외하고 인코딩된 값 받음
				p_value = p.value;
			}else{
				p_value = escape(p.value);
			}
			
			document.cookie =
					p.name + "=" + p_value +
					((p.age == null) ? "" : ("; expires=" + date.toGMTString())) +
					((p.path == null) ? "" : ("; path=" + p.path)) +
					((p.domain == null) ? "" : ("; domain=" + p.domain)) +
					((p.secure == true) ? "; secure" : "");
		},
		https: function(uri) {	//보안 페이지로 이동
			var http_domain = elandmall.util.getCookie(elandmall.global.http_domain_cookie_name);
			if (elandmall.global.scheme != "https" && http_domain == "") {	//http에서 https로 이동할 경우만 셋팅 하도록 한다.
				uri = "/" + uri;
				uri = uri.replace(/\/{2,}/g, "/");
				elandmall.util.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value: location.host, path: "/" });
			};

			var https_url = elandmall.global.https_url;
			var pattern =/(order*|mypage*|content*|initLogin*|loginProc*)/;

			//슈펜일 경우 슈펜 secure 페이지로
			if(elandmall.global.disp_mall_no == '0000053' && pattern.test(uri) && elandmall.global.chnl_cd != '10'){
				if (uri.indexOf("/mypage/initMypageMain") > -1 || uri.indexOf("/mypage/initMyCounsel") > -1){
					https_url = elandmall.global.https_url;
				} else {
					https_url = elandmall.global.https_shoopen_domain_url;
				}
			} else if(uri.indexOf("/mypage/shoopen/initMypageMain") > -1) {
				https_url = elandmall.global.https_shoopen_domain_url;
			}
			return https_url + uri;
		},
		http: function(uri) {		//비보안 페이지로 이동
			//uri 이 http로 들어오는 url경로가 존재한다면, 아래 로직 체크 없이 그냥 return처리한다.
			var pattern =/^(http:\/\/)/;

			if(!(pattern.test(uri)) ) {

				//전시를 제외하고는 모두 기본도메인이다. ( 매장위치안내 추가 16.06.29)
				uri = "/" + uri;
				uri = uri.replace(/\/{2,}/g, "/");
				pattern =/(dispctg*|search*|shop*|goods*|common*|mallinfo*|event*)/;
				if(!pattern.test(uri) && elandmall.global.disp_mall_no == '0000053' && uri.indexOf("/main/initMain") > -1){
                	return "http:" + elandmall.global.shoopen_domain_url + uri;
                }else if(!pattern.test(uri)) {
					return "http:" + elandmall.global.base_domain_url + uri;
				} else {
					var http_domain = elandmall.util.getCookie(elandmall.global.http_domain_cookie_name);
					if(location.host != http_domain) http_domain ="";

					//쿠키가 없다면 현재 도메인 인 경우 http=>http 이동시 필요
					if($.trim(http_domain) == "") {
						if(elandmall.global.scheme == "https") {
							if(elandmall.global.disp_mall_no == '0000053' && elandmall.global.chnl_cd != '10'){
								return "http:" + elandmall.global.shoopen_domain_url + uri;
							} else {
								//기본으로 통합몰 메인으로 이동처리 한다.
								return "http:" + elandmall.global.base_domain_url + uri;
							}
						} else {
						    return "http://" + location.host + uri;
						}
					} else {
						//한번클리어 처리한다.
						elandmall.util.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
						return "http://" + http_domain + uri;
					}
				}
			} else {
				//http이기에 쿠키clear 한다.
				elandmall.util.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
				return uri;
			}
		},
		ga : function(category, action, label){
			try{
			   ga('send', 'event', category, action, label);
			}catch(e){

			}
		},
		openWin : function(p){  //새창열기
			p.url = elandmall.util.https(p.url);
			window.open(p.url,p.title);
		},
		toSpCharRemove : function(obj){ 	// 특수문자 제거
			var regExp = /[\{\}\[\]\/?;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
			var _input = $(obj);
			var str = _input.val();

	        if ( regExp.test(str) ){
	        	str = str.replace(regExp, "");
	        }
	        _input.val(str);
		},
		toSpCharRemove2 : function(obj){ 	// 특수문자 제거
			var regExp = /[\{\}\[\]\/?;:|\)~`!^\-_+<>@\$%&\\\=\(\'\"]/gi;
			var _input = $(obj);
			var str = _input.val();

			if ( regExp.test(str) ){
				str = str.replace(regExp, "");
			}
			_input.val(str);
		},
		showBarcode : function(p,s,t) {	//바코드
			//var btypes = ["ean8","ean13","upc","std25","int25","code11","code39","code93","code128","codabar"];
			var btype = "code128";
			if(p == null || p == "") { return; }
			if(p.length <= 0 ) { return; }
			//var regExp = /^[0-9]+$/;
			//if(regExp.test(p)){
				//btype = "ean8";
			//}else {
				//btype = "code128";
			//}
			if(typeof(t) == undefined || typeof(t) == "undefined") { 
				target = $("#barcodeTarget");
				if(typeof(target) == undefined || typeof(target) == "undefined") { return; }
			}else {
				if(typeof(t) == "string"){
					target = $("#"+t);
				}else {
					target = t;
				}
				
			}
			
			if ($.type(target) != "object") {
				return;		
			};
			
			var settings = {};
			if(typeof(s) != undefined || typeof(s) != "undefined" ){
				$.extend(settings,s);
			}else {
				  settings = {
						  barWidth: 0.7,
					      barHeight: 42,
					      moduleSize: 1,
					      showHRI: true,
					      addQuietZone: true,
					      marginHRI: 4,
					      bgColor: "#FFFFFF",
					      color: "#333",
					      fontSize: 12,
					      output: "css",
					      posX: 0,
					      posY: 0
					};
			}
			
			$(target).html("").show().barcode(p,btype,settings);
		}
	};
	//[END] UTIL

	/* 헤더 링크 관련 부분
	 */
	elandmall.hdLink = function(slink) {
	    if(slink == "MAIN" ){	//통합몰 메인
	    	location.href =   elandmall.util.http("http:" + elandmall.global.base_domain_url + "/main/initMain.action");
	    }else if(slink == "MALL_MAIN"){		//브랜드몰 메인
	    	location.href = elandmall.util.http(elandmall.global.http_url+"/main/initMain.action");
	    } else if (slink == "MAIN_MODERN" ) {
	    	location.href =   elandmall.util.http("http:" + elandmall.global.modernhouse_domain_url + "/main/initMain.action");
	    } else if (slink == "KIMSCLUB" ) {
	    	location.href = elandmall.util.http("http:" + elandmall.global.kimsclub_domain_url + "/main/initMain.action");
	    } else if (slink == "KINDERS" ) {
	    	location.href = elandmall.util.http("http:" + elandmall.global.kinders_domain_url + "/main/initMain.action");
	    } else if (slink == "CART" ) {
			location.href =  elandmall.util.http("/cart/initCart.action");
		} else if(slink == "MYPAGE" ){
			//elandmall.mypage.goMain();
			elandmall.mypage.link.mypageMain();
		} else if(slink == "CUSTCENTER" ){
			elandmall.custcenter.link.main();
		} else if(slink == "BACK_SHOP"){
			elandmall.superLand.goBackShopMain();
		} else if(slink == "SUPER_LAND" ){
			elandmall.superLand.goSuperLandMain();
		} else if(slink == "BEST_100" ){
			elandmall.best100.goBest100Main();
		} else if(slink == "GROUP_PURCHASE" ){
			elandmall.groupPurchase.goGroupPurchaseMain();
		} else if(slink == "ZERO_DEAL" ){
			elandmall.zeroDeal.goZeroDealMain();
		} else if(slink == "MIXANDMATCH" ){
			elandmall.mixAndMatch.goMixAndMatchMain();
		} else if(slink == "E-CORE" ){
			elandmall.ECore.goECoreMain();
		} else if(slink == "EVENT" ){
			elandmall.event.eventBenefitZone();
		}else if(slink == "EVENT_SELF" ){
			elandmall.event.eventBenefitZoneSelf();
		} else if(slink == "EVENT_ATTEND" ){
			elandmall.event.eventAttendDetail();
		} else if(slink == "PLAN_SHOP" ){
			elandmall.shop.goPlanShopMain({});
		} else if(slink == "PLAN_SHOP_SELF" ){
			elandmall.shop.goPlanShopMainSelf();
		} else if(slink == "BRAND_INDEX"){
			elandmall.brand.goBrandIndex();
		} else if(slink == "RETURN_SHOP"){
			elandmall.dispctg.goDispctg({disp_ctg_no : '1703314058'});
		} else if(slink == "LATELY_GOODS"){   /* 최근본상품*/

		} else if(slink == "LUCKY_DEAL"){	/* 럭키딜(모바일) - 2020.05.15 HAPPY_DEAL에서 변경 (NGCPO-7089) */
			elandmall.superLand.goLuckyDealMain();
		} else if(slink == "ONE_MORE"){		/* 하나더(모바일) */
			elandmall.superLand.goOneMoreMain();
		} else if(slink == "NEWGOODS"){	/* 신상품 */
			elandmall.newGoods.goNewGoodsShop();
		} else if(slink == "STORY_SHOPPING"){
			elandmall.storyShopping.goStoryShoppingMain({});
		} else if(slink == "BEST_BRANDMALL"){
			elandmall.bestBrandMall.goBestBrandMallMain();
		} else if(slink == "SALEGOODS"){ /* SALE */
			elandmall.saleGoods.goSaleGoodsShop();
		} else if(slink == "MAGAZINE"){ /* 매거진 */
			elandmall.shop.goContPlanShopMain();
		} else if(slink == "MAGAZINE_SELF" ){
			elandmall.shop.goContPlanShopMainSelf();
		}else if(slink == "BRAND_INFO"){
			location.href = elandmall.util.http("/mallinfo/initBrandInfo.action");
		}else if(slink == "FOLLOW"){ /*스파오 Follow*/
			elandmall.follow.goFollow();
		}else if(slink == "OFF_STORE"){ /* 모던하우스 오프라인매장안내*/
			elandmall.moderOffStore.goModerOfflineStore();
		}else if(slink == "COMMUNITY" ){
			elandmall.shop.goCommunityMain();
		}else if(slink == "REVIEW" ){
			elandmall.shop.goCommunityReviewMain();
		}else if(slink == "MEDIAPRESS" ){
			elandmall.shop.goCommunityMediaMain();
		}else if(slink == "STORE" ){
			elandmall.ShopInfo.goShopInfo();
		}else if(slink == "ECATALOG" ){
			if(elandmall.global.chnl_cd == "10"){
				elandmall.shop.goEcatalogMain();
			}else{
				elandmall.shop.goCommunityEcatalogMain();
			}
		}else if(slink == "COLLECTION" ){
			location.href = elandmall.util.http("/dispctg/initCollection.action");
		}else if(slink == "RESERVE_PURCHASE"){
			elandmall.reservePurchase.goReservePurchaseMain();
		} else if(slink == "BRANCH_SHOP"){ /* 지점관 */
			elandmall.brcshop.goBranchShop({});
		}else if(slink == "FD"){/*킴스클럽 산지직송*/
			elandmall.dispctg.goMainSpnCtg("FD");
		}else if(slink == "BRAND_LUXURY"){/*럭셔리갤러리 브랜드*/
			elandmall.luxuryGallery.goBrandShop();
		}
		else if(slink == "PREORDER"){/*럭셔리갤러리 프리오더*/
			elandmall.luxuryGallery.goPreOrder();
		}
		else if(slink == "EXCLUSIVE"){/*럭셔리갤러리 단독상품*/
			elandmall.luxuryGallery.goExclusive();
		}
		else if(slink == "MAGAZINE_LUXURY"){/*럭셔리갤러리 매거진*/
			elandmall.luxuryGallery.goMagazine();
		}
		else if(slink.slink == "NEW_LUXURY"){/*럭셔리갤러리 NEW*/
			if(slink.gender == null)
				location.href = elandmall.util.http( "/shop/initNewLuxury.action?period_gb="+slink.period_gb);
			else
				location.href = elandmall.util.http( "/shop/initNewLuxury.action?period_gb="+slink.period_gb+"&gender="+slink.gender);
		}
	    else if(slink == "QUICKDELI"){ /*빠른배송 매장*/
			location.href = elandmall.util.http("/shop/initQuickDeliShop.action");
		}
	    else if(slink == "SEASON_PLAN_SHOP" ){
			elandmall.shop.goSeasonPlanShopMain();
		}
	    else if(slink == "KIDI_MARKET"){ //로고 클릭시 키디 마켓일 경우 sso 처리하여 커뮤니티 사이트로 이동
	    	goOtherkidiSite(elandmall.global.community_domain_url,'200','');
	    }
	    else if(slink == "KIDIKIDI"){ //아동LV1 PC 상품상세에서 로고 클릭시 sso 처리하여 아동LV1 MO 홈으로 이동
	    	goOtherkidiSite("/", '120', '');
	    } else if(slink == "SHOOPEN" ){
			//elandmall.mypage.goMain();
			elandmall.shoopen.mypage.link.mypageMain();
		}
		else if(slink == "CONTACT_INFORMATION"){ /*대량구매&협업문의 */
			location.href = elandmall.util.http("/mallinfo/initContactInforMation.action");
		}
	}

	//[START] DISPCTG
	elandmall.dispctg = {

		//카테고리 경로 정보 불러오기.
		fnCategoryPathInfo : function(pin) {
			$.ajax({
				url : "/dispctg/getDsDispCtgJson.action",
				data : pin,
				type : "post",
				dataType : "json",
				success : function(data){

					if(data != null){
						//링크 URL
						if("20" == data.TEMPL_TYPE_CD && (data.LINK_URL != null && data.LINK_URL != "" ) ){
							//새창
							if("20" == data.LINK_FRAME_TYPE_CD){
								//topas수정
								var agent = navigator.userAgent.toLowerCase();
								if(agent.indexOf("msie") == -1 && agent.indexOf("trident") == -1) {
									if(data.LINK_URL.indexOf('topas') > -1){
										var popup = window.open(data.LINK_URL,"TOPAS");
										if(popup == null){
											alert('팝업이 차단됐습니다.');
											return false;
										}
									} else {
										window.open(data.LINK_URL);
									}
								}else{
									window.open(data.LINK_URL);
								}
							}else{
								window.location.href = data.LINK_URL;
							}
							//매장 이동	, 매장 이동 코드 : 30
						}else if("30" == data.TEMPL_TYPE_CD ){
							//기획전
							if("40" == data.MOVE_SHOP_TYPE_CD){
							    elandmall.shop.goPlanShop({disp_ctg_no : data.MOVE_DISP_CTG_NO});
							}else if("10" == data.MOVE_SHOP_TYPE_CD){
								elandmall.dispctg.goDispctg({disp_ctg_no : data.MOVE_DISP_CTG_NO});
							}
						//템플릿 , 중/소 카테고리는 해당 페이지로 이동 해야 함, 브랜드카테고리로 이동 처리  템플릿 유형코드 : 40
						}else if("40" == data.TEMPL_TYPE_CD ||  "20" == data.DISP_TYPE_CD || parseInt(data.DEPTH_NO) >= 3){
							//브랜드일 경우
							if("20" == data.DISP_TYPE_CD ){
								elandmall.brand.goBrandShop(data.BRAND_NO, data.DISP_CTG_NO);
							}else{
								if(pin.gnb_num != null && ""!=pin.gnb_num){
									elandmall.dispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO, gnb_num : pin.gnb_num});
								}else{
									elandmall.dispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO});
								}
							}
						//대분류 > 연결없음 일 경우 카테고리 이동 [NGCPO-5769]
						}else if("10" == data.TEMPL_TYPE_CD && data.DEPTH_NO == 2){
							elandmall.dispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO});
						}
					}
				}
			});
		},

		//카테고리 이동 하기
		goDispctg : function(pin){
			var param =  "";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});
			location.href = elandmall.util.http("/dispctg/initDispCtg.action?"+param);
		},
		//모바일 메인 스피닝 카테고리
		goMainSpnCtg : function(ctg_gubun){
			location.href = elandmall.util.http("/dispctg/initMainSpnCtg.action?ctg_gubun="+ctg_gubun);
		}
	};
	//[END] DISPCTG

	//[START] SHOP
	elandmall.shop = {

		//기획전 메인으로 이동
		goPlanShopMain : function(pin) {
			var param = "";
			var linkUrl = "/shop/initPlanShopMain.action";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ encodeURI(data);
				 }else{
					 param += '&'+name +'='+ encodeURI(data);
				 }
			});
			if(param != ""){
				linkUrl = linkUrl + "?" + param;
			}
	    	location.href = elandmall.util.http(linkUrl);
		},
		//기획전 메인(모바일 단독페이지)으로 이동
		goPlanShopMainSelf : function() {
	    	location.href = elandmall.util.http("/shop/searchPlanShopMainJson.action?self_yn=Y");
		},

		//기획전 상세
		goPlanShop : function(pin) {
			var param =  "";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});
			location.href = elandmall.util.http("/shop/initPlanShop.action?"+param);
		},

		//컨텐츠 기획전 메인으로 이동
		goContPlanShopMain : function() {
	    	location.href = elandmall.util.http("/shop/initContPlanShopMain.action");
		},
		//컨텐츠 기획전 메인(모바일 단독페이지)으로 이동
		goContPlanShopMainSelf : function() {
	    	location.href = elandmall.util.http("/shop/searchContPlanShopMainJson.action?self_yn=Y");
		},
		//커뮤니티 메인으로 이동(바후스몰)
		goCommunityMain : function() {
	    	location.href = elandmall.util.http("/shop/initReview.action");
		},
		//커뮤니티 리뷰로 이동(바후스몰)
		goCommunityReviewMain : function() {
	    	location.href = elandmall.util.http("/shop/initShopCommunity.action");
		},
		//커뮤니티 MEDIAPRES로 이동(바후스몰)
		goCommunityMediaMain : function() {
	    	location.href = elandmall.util.http("/shop/initShopCommunity.action?community_tab=tab_media");
		},
		//커뮤니티 ECATALOG로 이동(바후스몰)
		goCommunityEcatalogMain : function() {
	    	location.href = elandmall.util.http("/shop/initShopCommunity.action?community_tab=tab_ecatalog");
		},
		//카탈로그 메인으로 이동(바후스몰)
		goEcatalogMain : function() {
			location.href = elandmall.util.http("/shop/initEcatalog.action");
		},
		//시즌기획전 메인으로 이동
		goSeasonPlanShopMain : function() {
			location.href = elandmall.util.http("/shop/initPlanShopMain.action");
		}
	};
	//[END] SHOP

	//[START] 스토리쇼핑(모던하우스)
	elandmall.storyShopping = {
		//스토리쇼핑 메인으로 이동
		goStoryShoppingMain : function(pin) {
			var param = "";
			var linkUrl = "/shop/initStoryShoppingMain.action";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ encodeURI(data);
				 }else{
					 param += '&'+name +'='+ encodeURI(data);
				 }
			});
			if(param != ""){
				linkUrl = linkUrl + "?" + param;
			}

	    	location.href = elandmall.util.http(linkUrl);
		}
	};
	//[END] 스토리쇼핑(모던하우스)

	//[START] RETURN SHOP
	elandmall.rtnshop = {
		//반품샵
		goReturnShop : function(pin) {
			var param =  "";
			var linkUrl = "/shop/initReturnShop.action";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});

			if(param != ""){
				linkUrl = linkUrl + "?" + param;
			}

	    	location.href = elandmall.util.http(linkUrl);
		}
	};
	//[END] RETURN SHOP

	//[START] BRANCH SHOP
	elandmall.brcshop = {
		//지점관
		goBranchShop : function(pin) {
			var param =  "";
			var linkUrl = "/shop/initBranchShop.action";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});

			if(param != ""){
				linkUrl = linkUrl + "?" + param;
			}

	    	location.href = elandmall.util.http(linkUrl);
		}

	};
	//[END] BRANCH SHOP

	//[START] BRAND
	elandmall.brand = {

			//브랜드INDEX 이동
			goBrandIndex : function() {
			    location.href = elandmall.util.http( "/dispctg/searchBrandIndexBaseInfo.action");
			},

			//브랜드INDEX 에서 브랜드샵 이동
			goBrandIndexShop : function(brand_no, disp_ctg_no) {
				
				var brand_no = brand_no;
				var mall_no = "";
				// 브랜드자동완성 키워드 클릭 시 해당 몰의 header로 값이 변경되기 위해 수정
				// 자동완성에서 브랜드자동완성 클릭 시 구분값으로 '||'가 이용되며 해당 구분값이 있다면 값을 나누어 담는 작업
				if(brand_no.indexOf("||") != -1){
					var brandArr = brand_no.split("||");
					brand_no = brandArr[0];
					mall_no = brandArr[1];
				}
				
				if(brand_no == '1690000063'){
					//슈펜
					location.href = elandmall.util.http( "http:"+elandmall.global.shoopen_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000132'){
					//모던하우스
					location.href = elandmall.util.http( "http:"+elandmall.global.modernhouse_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000156'){
					//로이드
					location.href = elandmall.util.http( "http:"+elandmall.global.lloyd_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000420'){
					//OST
					location.href = elandmall.util.http( "http:"+elandmall.global.ost_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000332'){
					//클루
					location.href = elandmall.util.http( "http:"+elandmall.global.clue_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000438'){
					//에블린
					location.href = elandmall.util.http( "http:"+elandmall.global.eblin_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000120' || brand_no == '1690000119'){
					//미쏘
					location.href = elandmall.util.http( "http:"+elandmall.global.mixxo_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000158'){
					//로엠
					location.href = elandmall.util.http( "http:"+elandmall.global.roem_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000055'){
					//스파오
					location.href = elandmall.util.http( "http:"+elandmall.global.spao_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000248'){
					//후아유
					location.href = elandmall.util.http( "http:"+elandmall.global.whoau_domain_url+"/main/initMain.action");
				}else if(brand_no == '1600002907' || brand_no == '1600002934' || brand_no =='1900013772'){
					//폴더
					location.href = elandmall.util.http( "http:"+elandmall.global.folder_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000205'){
					//뉴발란스
					location.href = elandmall.util.http( "http:"+elandmall.global.newbal_domain_url+"/main/initMain.action");
				}else if(brand_no == '1690000204'){
					//뉴발란스키즈
					location.href = elandmall.util.http( "http:"+elandmall.global.nbkids_domain_url+"/main/initMain.action");
				}else if(brand_no == '1600002087'){
					//킴스클럽
					location.href = elandmall.util.http( "http:"+elandmall.global.kimsclub_domain_url+"/main/initMain.action");
				}else if(brand_no == '1700004627'){
					//바후스
					location.href = elandmall.util.http( "http:"+elandmall.global.bahus_domain_url+"/main/initMain.action");
				}else{
					var param = "brand_no="+ brand_no;

					if(typeof(disp_ctg_no) !="undefined" && disp_ctg_no != ""){
						param += "&disp_ctg_no=" + disp_ctg_no;
					}
					
					// 브랜드자동완성 키워드 클릭 시 해당 몰의 header로 값이 변경되기 위해 수정
					var domainStr ='';
					
					if("0000014" == mall_no){	//기본몰
						domainStr="/dispctg/initBrandShop.action?";
					}else if("0000053" == mall_no){	// 슈펜
						domainStr="http:"+elandmall.global.shoopen_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000013" == mall_no){	// 모던하우스
						domainStr="http:"+elandmall.global.modernhouse_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000034" == mall_no){	//로이드
						domainStr="http:"+elandmall.global.lloyd_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000036" == mall_no){	//클루
						domainStr="http:"+elandmall.global.clue_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000033" == mall_no){	//에블린
						domainStr="http:"+elandmall.global.eblin_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000043" == mall_no){	//미쏘
						domainStr="http:"+elandmall.global.mixxo_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000035" == mall_no){	//로엠
						domainStr="http:"+elandmall.global.roem_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000037" == mall_no){	//스파오
						domainStr="http:"+elandmall.global.spao_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000042" == mall_no){	//후아유
						domainStr="http:"+elandmall.global.whoau_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000038" == mall_no){	//뉴발란스
						domainStr="http:"+elandmall.global.newbal_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000039" == mall_no){	//폴더
						domainStr="http:"+elandmall.global.folder_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000044" == mall_no){	//바후스
						domainStr="http:"+elandmall.global.bahus_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000063" == mall_no){	//뉴발란스키즈
						domainStr="http:"+elandmall.global.nbkids_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000045" == mall_no){	//킹스클럽
						domainStr="http:"+elandmall.global.kimsclub_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000073" == mall_no){	//럭셔리갤러리
						domainStr="http:"+elandmall.global.luxurygallery_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000083" == mall_no){	//KIDI KIDI
						domainStr="http:"+elandmall.global.kidikidi_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000113" == mall_no){	//KIDIKIDI 마켓
						domainStr="http:"+elandmall.global.kidimarket_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000041" == mall_no){	//OST
						domainStr="http:"+elandmall.global.ost_domain_url+"/dispctg/initBrandShop.action?";
					}else if("0000040" == mall_no){	// 킨더리그
						domainStr="http:"+elandmall.global.ekids_domain_url+"/dispctg/initBrandShop.action?";
					}else{
						domainStr="/dispctg/initBrandShop.action?";
					}
					
					location.href = elandmall.util.http(domainStr+param);
				}

			},
			
			// Elastic Search 반영
			// 브랜드명으로 브랜드관 이동
			goBrandIndexShopES : function(brand_nm, lang) {
				var enc_brand_nm = encodeURIComponent(brand_nm);
				if(lang == 'kor')
					location.href = elandmall.util.http( "/dispctg/initBrandShop.action?brand_kor_nm="+enc_brand_nm);
				else if(lang == 'eng')
					location.href = elandmall.util.http( "/dispctg/initBrandShop.action?brand_eng_nm="+enc_brand_nm);
			},

			//브랜드샵
			goBrandShop : function(brand_no, disp_ctg_no){

				var param = "brand_no="+ brand_no;

				if(typeof(disp_ctg_no) !="undefined" && disp_ctg_no != ""){
					param += "&disp_ctg_no=" + disp_ctg_no;
				}

				location.href = elandmall.util.http( "/dispctg/initBrandShop.action?"+param);
			},
			//브랜드샵 (통합몰)
			goMallBrandShop : function(brand_no, disp_ctg_no){
				var param = "brand_no="+ brand_no;

				if(typeof(disp_ctg_no) !="undefined" && disp_ctg_no != ""){
					param += "&disp_ctg_no=" + disp_ctg_no;
				}

				location.href = elandmall.util.http( "http:"+elandmall.global.base_domain_url+"/dispctg/initBrandShop.action?"+param);
			},
			//브랜드샵 (모던하우스)
			goMDBrandShop : function(brand_no, disp_ctg_no){
				var param = "brand_no="+ brand_no;

				if(typeof(disp_ctg_no) !="undefined" && disp_ctg_no != ""){
					param += "&disp_ctg_no=" + disp_ctg_no;
				}

				location.href = elandmall.util.http( "http:"+elandmall.global.modernhouse_domain_url+"/dispctg/initBrandShop.action?"+param);
			},

			//브랜드 상세 컨텐츠페이지로 이동 (PC에서만 사용)
			goBrandConts : function(brand_no){
				location.href = elandmall.util.http( "/dispctg/initBrandIntroduce.action?brand_no="+brand_no);
			}
	}
	//[END] BRAND

	//[START] BEST100
	elandmall.best100 = {
		//BEST100 CATEGORY 메인으로 이동
		goBest100Main : function() {
	    	location.href = elandmall.util.http( "/shop/initShopBest100.action");
		}
	};
	//[END] BEST100

	//[START] Best(모던하우스, 브랜드몰)
	elandmall.bestBrandMall = {
		//Best(모던하우스, 브랜드몰) 메인으로 이동
		goBestBrandMallMain : function() {
	    	location.href = elandmall.util.http( "/shop/initBestBrandMall.action");
		}
	};
	//[END] Best(모던하우스, 브랜드몰)

	/**
	 *  tab_gubun : 값 있으면 무료배송
     *  기본값 : 럭키딜
	 */
	//[START] 특가존
	elandmall.superLand = {

		//특가존 메인으로 이동
		goSuperLandMain : function(tab_gubun) {
			if($.type(tab_gubun) !="undefined" && tab_gubun != "" && tab_gubun != "null"){
				location.href = elandmall.util.http( "/shop/initShopLuckyDeal.action?#1");
			}else{
				location.href = elandmall.util.http( "/shop/initShopLuckyDeal.action");
			}
		},

		//반품샵
		goBackShopMain : function() {
			location.href = elandmall.util.http( "/shop/initPlanShop.action?disp_ctg_no=1611307217");
		},

		//럭키딜 메인으로 이동(모바일)
		goLuckyDealMain : function() {
			location.href = elandmall.util.http( "/shop/initShopLuckyDeal.action");
		},
		//하나더 메인으로 이동(모바일)
		goOneMoreMain : function() {
			location.href = elandmall.util.http( "/shop/initOneMoreShop.action");
		}
	};
	//[END] 특가존

	//[START] 0원딜
	elandmall.zeroDeal = {

		//0원딜 메인으로 이동
		goZeroDealMain : function() {
	    	location.href = elandmall.util.http( "/eventshop/initZeroDealMain.action");
		}
	};
	//[END] 0원딜

	//[START] 체험단
	elandmall.experience = {

		//모던하우스 체험단으로 이동
		goExperienceMain : function() {
	    	location.href = elandmall.util.http("/eventshop/initExperienceMain.action");
		}
	};
	//[END] 체험단

	//[START] 공동구매
	elandmall.groupPurchase = {

		//공동구매 메인으로 이동
		goGroupPurchaseMain : function() {
	    	location.href = elandmall.util.http( "/eventshop/initGroupPurchaseMain.action");
		}
	};
	//[END] 공동구매

	//[START] 예약구매
	elandmall.reservePurchase = {

		//예약구매 메인으로 이동
		goReservePurchaseMain : function() {
	    	location.href = elandmall.util.http( "/eventshop/initReservePurchaseMain.action");
		}
	};
	//[END] 예약구매

	//[START] 신상품 매장
	elandmall.newGoods = {

		//신상품매장 메인으로 이동
		goNewGoodsShop : function() {
	    	location.href = elandmall.util.http( "/shop/initNewGoods.action");
		}
	};
	//[END] 신상품 매장
	
	//[START] SALE 매장
	elandmall.saleGoods = {

		//신상품매장 메인으로 이동
		goSaleGoodsShop : function() {
	    	location.href = elandmall.util.http( "/shop/initSaleShopMain.action");
		}
	};
	//[END] 신상품 매장

	//[START] E-Core 홈
	elandmall.ECore = {
		//E-Core 홈으로 이동
		goECoreMain : function() {
	    	location.href = elandmall.util.http("/dispctg/initEcoreMain.action");
		}
	};
	//[END] E-Core 홈

	//[START] 스파오 Follow
	elandmall.follow ={
			goFollow : function(){
				location.href = elandmall.util.http("/dispctg/initFollowMain.action");
			}
	}
	//[END] 스파오 Follow

	//[START]  모던하우스 오프라인매장안내
	elandmall.moderOffStore ={
		goModerOfflineStore : function(){
			location.href = elandmall.util.http("/mallinfo/initBrandShopInfo.action");
		}
	}
	//[END]  모던하우스 오프라인매장안내

	//[START] Mix & Match
	elandmall.mixAndMatch = {

		//Mix & Match 메인으로 이동
		goMixAndMatchMain : function() {
	    	location.href = elandmall.util.http( "/content/initMixAndMatchMain.action");
		},

		//Mix & Match 제작및 수정
		goMixAndMatchMgmt : function(bbs_dtl_no){
			//로그인체크
			var callback = function(){
				if($.type(bbs_dtl_no) !="undefined" && bbs_dtl_no != "" && bbs_dtl_no != "null"){
					location.href = elandmall.util.http( "/content/MixAndMatchMgmt.action?bbs_dtl_no="+bbs_dtl_no);
				}else{
					location.href = elandmall.util.http( "/content/MixAndMatchMgmt.action");
				}
			}
			elandmall.isLogin({login:callback});
		},

		//Mix & Match 상세보기
		goMixAndMatchDetail : function(bbs_dtl_no){
			if ($.type(bbs_dtl_no) !="undefined" && bbs_dtl_no != "" && bbs_dtl_no != "null"){
				location.href = elandmall.util.http( "/content/MixAndMatchDetail.action?bbs_dtl_no="+bbs_dtl_no);
			}
		},

		//Mix & Match 추천하기
		fnMixMatchRecomm : function(bbs_dtl_no){
			$.ajax({
				url: "/content/updateBbsDtlRecomm.action",
				type: "POST",
				dataType: "text",
				data: {
					bbs_dtl_no: bbs_dtl_no
				},
				success: function(data){
					if(data != null && data != ""){
						$("#recom_cnt"+bbs_dtl_no).text(data);
					}
				},
				error: function( e ){
					if ( e.error_message !=null && e.error_message != ""){
						alert(e.error_message);
					}else{
						alert("오류가 발생하였습니다.");
					}
				}
			})
		}
	};
	//[END] Mix & Match
	
	//[START] 럭셔리갤러리
	elandmall.luxuryGallery = {
		// 럭셔리갤러리 메인으로 이동
		goMain : function(gender) {
			if(gender != null  && gender != ""){
				elandmall.util.setCookie({ name: "lux_gender", value: gender, domain: elandmall.global.cookie_domain, path: "/", age: 1 });
			}
			window.sessionStorage.removeItem("data-url");
			location.href = elandmall.util.http("http:" + elandmall.global.luxurygallery_domain_url + "/main/initMain.action");
		},
		// 럭셔리갤러리 메인 - 남
		goMaleMain : function(){
			this.goMain('M');
		},
		// 럭셔리갤러리 메인 - 여
		goFemaleMain : function(){
			this.goMain('F');
		},
		// 브랜드매장 메인으로 이동
		goBrandShop : function() {
			location.href = elandmall.util.http( "/dispctg/initBrandList.action");
		},
		// PRE-ORDER 메인으로 이동
		goPreOrder : function() {
			location.href = elandmall.util.http( "/shop/initPreOrderList.action");
		},
		// Exclusive 메인으로 이동
		goExclusive : function() {
			location.href = elandmall.util.http( "/shop/initExclusiveGoods.action");
		},
		// Magazine 메인으로 이동
		goMagazine : function() {
			location.href = elandmall.util.http( "/shop/initMagazineList.action");
		},
		// 럭셔리갤러리 New 메인으로 이동
		goNew : function(period_gb) {
			if(period_gb==='01')
				location.href = elandmall.util.http( "/shop/initNewLuxury.action?period_gb=01");
			else if(period_gb==='02')
				location.href = elandmall.util.http( "/shop/initNewLuxury.action?period_gb=02");
		},
		// 럭셔리갤러리 성별 Tab
		tabGender : function(gender) {
			location.replace('/dispctg/showLeftMenu.action?gender=' + gender);
		},
	};
	//[END] 럭셔리갤러리

	//[START] 2020_슈펜
	elandmall.shoopen = {
		// 슈펜 메인으로 이동
		goMain : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/main/initMain.action");
		},
		// 큐레이션 메인으로 이동
		goShoopenCuration : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action");
		},
		// 모아보기 메인으로 이동
		goViewCollect : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initViewCollect.action");
		},
		// 큐레이션 기획전 탭으로 이동
		goCurationPlanShop : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action?planshop_tab=Y");
		},
		// 큐레이션 랭킹 탭으로 이동
		goCurationRanking : function(large_disp_ctg_no) {
			if($.type(large_disp_ctg_no) !="undefined" && large_disp_ctg_no != null && large_disp_ctg_no != ""){
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action?ranking_tab=Y"+"&large_disp_ctg_no="+large_disp_ctg_no);
			}else{
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action?ranking_tab=Y");
			}
		},
		// 큐레이션 룩북 탭으로 이동
		goCurationLookbook : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action?lookbook_tab=Y");
		},
		// 큐레이션 매거진 탭으로 이동
		goCurationMagazine : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action?magazine_tab=Y");
		},
		// 큐레이션 이벤트 탭으로 이동
		goCurationEvent : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/initShoopenCuration.action?event_tab=Y");
		},
		// 슈펜 장바구니로 이동
		goShoopenCart : function() {
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/cart/initCart.action");
		},
		// 슈펜 신상품매장으로 이동
		goShoopenNewGoods : function(large_disp_ctg_no){
			if($.type(large_disp_ctg_no) !="undefined" && large_disp_ctg_no != null && large_disp_ctg_no != ""){
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/searchNewGoodsJson.action?large_disp_ctg_no="+large_disp_ctg_no);
			}else{
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/searchNewGoodsJson.action");
			}
		},
		// 슈펜 sale매장으로 이동
		goShoopenSaleGoods : function(large_disp_ctg_no){
			if($.type(large_disp_ctg_no) !="undefined" && large_disp_ctg_no != null && large_disp_ctg_no != ""){
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/searchSaleGoodsJson.action?large_disp_ctg_no="+large_disp_ctg_no);
			}else{
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/searchSaleGoodsJson.action");
			}
		},
		// 슈펜 best매장으로 이동
		goShoopenBestGoods : function(large_disp_ctg_no){
			if($.type(large_disp_ctg_no) !="undefined" && large_disp_ctg_no != null && large_disp_ctg_no != ""){
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/searchBestBrandMallJson.action?large_disp_ctg_no="+large_disp_ctg_no);
			}else{
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/shop/searchBestBrandMallJson.action");
			}
		}
	};
	//[END] 2020_슈펜

	/*
	 * 넷퍼넬 트래픽 제어 쿠폰 다운로드
	 *
	 * parameter {
	 * 		cert_key_list : '111111','222222'
	 * 		promo_no_list:'111111','22222' ,
	 * 		p_yn: Y(프로모션정보 필요여부),
	 * 		netfunnel_key :  promo_no
	 * 		callback:
	 * }
	 * return value : promoInfo { PROMO_NO, PROMO_NM, AVAL_END_DTIME, AVAL_START_DTIME }
	 */
	elandmall.netfcpnDown = function( p ) {

		var yymmdd = p.event_start_date.split(" ")[0];
		var HHmmss = p.event_start_date.split(" ")[1];

		var arrayYYmmdd = yymmdd.split("-");
		var arrayDDhhmm = HHmmss.split(":");
		var param = $.extend({
			smsg: arrayYYmmdd[2] + '일 ' + arrayDDhhmm[0] + '시 ' + arrayDDhhmm[1].replace('.0', '') + '분에 오픈합니다',
			emsg:"준비한 수량이 모두 소진되었습니다. 감사합니다."
		}, p);

		// 일시 검증
		if(elandmall.goodsSkipDetail.isEventTimeCheck(param)) {
			NetFunnel_Action({action_id:p.netfunnel_key},
				{	success:function(ev,ret){
						fnNetfCpnDown(p);
					},error:function(ev,ret){ //오류
						elandmall.outputSeverLog({msg:"ERROR [netfunnel] - netfcpnDown || msg : " + ret.data.msg});
						alert("잘못된 접근입니다.");
					}
				}
			);

			fnNetfCpnDown = function(arg){
				elandmall.cpnDown({
					promo_no:p.promo_no,
					cert_key:p.cert_key,
					callback_netfCpn:function(rst){
						NetFunnel_Complete({action_id:arg},function(ev, ret){});
					}
				});
			}
		}
	}
	
	
	/*
	 * 쿠폰다운받기
	 *
	 * parameter {
	 * 		cert_key_list : '111111','222222'
	 * 		promo_no_list:'111111','22222' ,
	 * 		p_yn: Y(프로모션정보 필요여부),
	 * 		callback:
	 * }
	 * return value : promoInfo { PROMO_NO, PROMO_NM, AVAL_END_DTIME, AVAL_START_DTIME }
	 */
	elandmall.cpnDown = function( p ) {
		var fnLoginCallback = function(){
			if ( p == undefined ){
				alert("쿠폰 정보가 올바르지 않습니다.")
				return false;
			}
			if ( $.type(p.cert_key) == "undefined" || p.cert_key == "" ||
					$.type(p.promo_no) == "undefined" || p.promo_no == "" ){
				alert("쿠폰 정보가 올바르지 않습니다.")
				return false;
			}
			var ev = p.ev;
			var no = ev != undefined ? ev.no : "";

			$.ajax({
				url: "/popup/registCpnDown.action",
				data: { cert_key_list : p.cert_key, promo_no_list : p.promo_no, p_yn: p.p_yn, ev : no },
				type: "POST",
				dataType: "json",
				async : false,
				success: function(data) {
					if ( data != null ){
						if ( data.r_cd == "0000" ){
							alert(data.msg);
						}else if ( data.r_cd != null && data.r_cd == "10" ){
							var msg = data.msg;
							if ( $.type(ev) != "undefined" && $.type(p.ev.msg) != "undefined"){
								msg = ev.msg;
							}
							alert(msg);
							location.href = data.ev;
						//	NGCPO-6343 FOMO registCpnDown UserException 시, 500에러 떨굼	
						}else if( data.r_cd == "F"){
							alert(data.msg);
						}

						// callback
						if ( $.type(p.callback) == "function") {
							p.callback( data.promoInfo );
						}
						
						// netfunnel Coupon Down Callback
						if ( $.type(p.callback_netfCpn) == "function") {
							p.callback_netfCpn();
						}
					}
				}, error : function( e ){
					if( e.result_msg != null && e.result_msg != "" ){
						alert(e.result_msg);
					}else{
						alert("쿠폰 발급 중 오류가 발생하였습니다.");
					}
					
					// netfunnel Coupon Down Callback
					if ( $.type(p.callback_netfCpn) == "function") {
						p.callback_netfCpn();
					}
				}
			});
		}

		if ( !elandmall.loginCheck() ){
			if ( !confirm("로그인 하신 고객만 다운로드 가능 합니다. \n로그인 하시겠습니까?") ){
				return;
			}
			elandmall.isLogin({login:fnLoginCallback});
		}else{
			fnLoginCallback();
		}
	}

	/*
	 * 오프라인 난수쿠폰등록
	 *
	 * parameter {
	 * 		cert_key_list : '111111'	// 인증키
	 * 		promo_no_list:'111111' 		// 프로모션번호 파라메터 넘김
	 * 		p_yn: Y(프로모션정보 필요여부),	// 리턴값으로 프로모션 정보 필요시 Y
	 * 		callback: 					// 프로모션 정보 필요시 callback
	 * }
	 */
	elandmall.cpnOfflineRandom = function( p ) {
		var fnLoginCallback = function(){
			if ( p.promo_no == ''){
				alert("쿠폰 번호를 입력해주세요.")
				return false;
			}
			if ( p == undefined ){
				alert("쿠폰 정보가 올바르지 않습니다.")
				return false;
			}
			if ( $.type(p.cert_key) == "undefined" || p.cert_key == "" ||
					$.type(p.promo_no) == "undefined" || p.promo_no == "" ){
				alert("쿠폰 정보가 올바르지 않습니다.")
				return false;
			}

			$.ajax({
				url: "/popup/registCpnOfflineRandom.action",
				data: { cert_key_list : p.cert_key, promo_no_list : p.promo_no, p_yn: p.p_yn },
				type: "POST",
				dataType: "json",
				async : false,
				success: function(data) {
					if ( data != null ){
						alert("쿠폰이 정상적으로 발급되었습니다. \n기분 좋은 쇼핑하세요~");
						// callback
						if ( $.type(p.callback) == "function") {
							p.callback( data.promoInfo );
						}
					}
				}, error : function( e ){
					if( e.result_msg != null && e.result_msg != "" ){
						alert(e.result_msg);
					}else{
						alert("쿠폰 등록 중 오류가 발생하였습니다.");
					}
				}
			});
		}

		if ( !elandmall.loginCheck() ){
			if ( !confirm("로그인 하신 고객만 다운로드 가능 합니다. \n로그인 하시겠습니까?") ){
				return;
			}
			elandmall.isLogin({login:fnLoginCallback});
		}else{
			fnLoginCallback();
		}
	}

	//[START] 상품관련공통 스크립트
	elandmall.goods = {

			/*[필수파라미터]
			 * goods_no:'',
			 * vir_vend_no:'',
			 * sale_shop_divi_cd:'',
			 * disp_ctg_no:'' ,
			 * sale_area_no:'',
			 * tr_yn:'',
			 * conts_dist_no:'',
			 * conts_divi_cd:''
			 *
			 * [선택파라미터]
			 * target:'' ===> '_blank':새 창으로
			 * */
			//[START]상품상세이동
			goDetail : function(pin){



				var svr_name = pin.server_name;
				var url_path = "/goods/initGoodsDetail.action";

				if(typeof(svr_name) != "undefined" && svr_name != ""){

					if (elandmall.global.chnl_cd == '10') {
						svr_name = svr_name.replace(/^m\./i, "www.");
						svr_name = svr_name.replace(/^m-/i, "");
						svr_name = svr_name.replace(/-m-/i, "-");
						svr_name = svr_name.replace(/-m\./i, ".");
					}

					url_path = "http://"+svr_name+url_path;
					delete pin.server_name;
				}

				var param = $.param(pin);
				var gd_url = elandmall.util.http(url_path)+"?"+param;

				if(pin.tr_yn && pin.tr_yn == 'Y'){
					elandmall.tracking.fireClick(pin);
				}

				// google dataLayer push parameter
				var dlp_list = pin.dlp_list;
				var dlp_category = pin.dlp_category;

				var dlp_brand_nm = '';

				if(pin.brand_nm == null || pin.brand_nm == ''){
					dlp_brand_nm = 'U';
				}else{
					dlp_brand_nm = unescape(pin.brand_nm);
				}

				//기본몰에서만 적용
				if(elandmall.global.disp_mall_no == '0000014'){
					if(dlp_list == null || dlp_list == ''){
						var path_nm = $(location).attr('pathname');
						dlp_list = elandmall.goods.getDataLayerPushList(path_nm);
					}
				}else{

					if(elandmall.global.disp_mall_no == '0000013'){
						dlp_list = '모던하우스';
					}else if(elandmall.global.disp_mall_no == '0000043'){
						dlp_list = '미쏘';
					}else if(elandmall.global.disp_mall_no == '0000042'){
						dlp_list = '후아유';
					}else if(elandmall.global.disp_mall_no == '0000041'){
						dlp_list = 'OST';
					}else if(elandmall.global.disp_mall_no == '0000040'){
						dlp_list = '킨더리그';
					}else if(elandmall.global.disp_mall_no == '0000039'){
						dlp_list = '폴더';
					}else if(elandmall.global.disp_mall_no == '0000038'){
						dlp_list = '뉴발란스';
					}else if(elandmall.global.disp_mall_no == '0000037'){
						dlp_list = '스파오';
					}else if(elandmall.global.disp_mall_no == '0000036'){
						dlp_list = '클루';
					}else if(elandmall.global.disp_mall_no == '0000035'){
						dlp_list = '로엠';
					}else if(elandmall.global.disp_mall_no == '0000033'){
						dlp_list = '에블린';
					}else if(elandmall.global.disp_mall_no == '0000034'){
						dlp_list = '로이드';
					}else if(elandmall.global.disp_mall_no == '0000053'){
						dlp_list = '슈펜';
					}else if(elandmall.global.disp_mall_no == '0000044'){
						dlp_list = '바후스';
					}else if(elandmall.global.disp_mall_no == '0000045'){
						dlp_list = '킴스클럽';
					}else if(elandmall.global.disp_mall_no == '0000063'){
						dlp_list = '뉴발란스키즈';
					}else if(elandmall.global.disp_mall_no == '0000073'){
						dlp_list = '럭셔리갤러리'
					}
				}

				if(dlp_category != null && dlp_category != ''){
					dlp_category = unescape(dlp_category);
				}

				dataLayer.push({
						'event':'productClick',
						'ecommerce': {
										'click': {
													'actionField': {'list': dlp_list},
														'products': [{
																'name': pin.goods_nm,
																'id': pin.goods_no,
																'price':pin.cust_sale_price,
																'brand': dlp_brand_nm,
																'category': dlp_category
																}]
										}
						}
				});


				if (elandmall.global.chnl_cd == '40' && (elandmall.global.disp_mall_no == '0000037' || elandmall.global.disp_mall_no == '0000013' || elandmall.global.disp_mall_no == '0000053' || elandmall.global.disp_mall_no == '0000073') ){
					//[NGCPO-6797]명품1차 럭셔리 갤러리 상품상세 띄울때 페이징으로 처리
					//[NGCPO-5460]LV1브랜드 APP(스파오,모던하우스,슈펜) 상품상세 띄울때 페이징으로 처리
					//[NGCPO-6699][이벤트] Lv1 스파오/모던/슈펜 레이어팝업 호출시 이벤트레이어 예외처리
					var eventYn = false;
					if($.type(pin.event_layer_yn) != "undefined"  && pin.event_layer_yn == "Y") {
						eventYn = true;
					}

					// goods_no null 체크
					if($.type(pin.goods_no) !== "undefined" &&  pin.goods_no !== '') {
						// event에서 호출이라면
						if(eventYn) {
							var url_path = "/goods/initGoodsEventLayer.action?" + param;
							param = null;
							elandmall.goods.loadPage(url_path, param, eventYn);
						} else {
							location.href= gd_url;
						}
					} else {
						alert('상품번호값이 존재하지 않습니다.');
						return;
					}
				} else if (elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) && typeof(webView) != "undefined" && webView =="Y"){
					// 채널이 app 이면서 신규 app이면 상품상세로 보냄
					location.href= gd_url;
				} else if(elandmall.global.chnl_cd == '10' || elandmall.global.scheme == 'https' || (typeof(pin.no_layer) != 'undefined' && pin.no_layer == 'Y')){

					if(typeof(pin.target) != 'undefined' && pin.target == '_blank'){
						window.open(gd_url);
					}else{
						if(elandmall.global.chnl_cd == '10'){
							elandmall.goods.scrollSav();
						}
						location.href= gd_url;
					}
				}else{

					var eventYn = false;
					if($.type(pin.event_layer_yn) != "undefined"  && pin.event_layer_yn == "Y") {
						eventYn = true;
					}
					//묶음, 셋트 상품이면 일반 상세로 보낸다.
					$.ajax({
						url: "/goods/getGoodsTypeflagJson.action",
						async : false,
						data: $.param(pin),
						type: "GET",
						dataType: "json",
						success: function(typeflag) {
							if( !eventYn && (typeflag == 'SET' || typeflag == 'PKG' || typeflag == 'JEW' || typeflag == 'LOTNOT') ){
								if(typeof(pin.target) != 'undefined' && pin.target == '_blank'){
									window.open(gd_url);
								}else{
									location.href= gd_url;
								}
							}else{
								$.ajaxSettings.cache = true;
								
								if(eventYn) { //이벤트 URL 
									url_path = "/goods/initGoodsEventLayer.action?" + param;
									param = null;
								}else{ //일반상품상세
									url_path = "/goods/initGoodsDetailLayer.action";
								}


								elandmall.goods.loadPage(url_path, param, eventYn);
							}
						}
					});


				}



			},

			loadPage : function(url_path, param, eventYn) {
				var div = $("<div id=\"bundle_detail\" class=\"layer_detail\"></div>");
				var shoopen_tabar_display = ""; //block, none
				var shoopen_btn_top_style = "";	//레이어 전 바닥 탑버튼 스타일 정보 
				if(elandmall.global.disp_mall_no == '0000053' && $("#shoopen_nav").length>0){
					shoopen_tabar_display = $("#shoopen_nav").css("display");
				}
				if(elandmall.global.disp_mall_no == '0000053' && $("#btn_top").length>0){
					shoopen_btn_top_style = $("#btn_top").attr("style");
				}
				
				div.load(url_path, param,  function(responseTxt, statusTxt, xhr){

					if(statusTxt == "error") {
						if(elandmall.global.chnl_cd == '30') {
							window.location.href = elandmall.util.http( window.location.pathname + window.location.search );
						} else if(elandmall.global.chnl_cd == '40') {
							close();
						}
						return;
					}

					if(eventYn) {
						if(div.find(".event_soldout").attr("data-sold_yn") == "Y"){
							alert("준비한 수량이 모두 소진되었습니다.감사합니다.");
							return;
						}
					}

					deScope = $(window).scrollTop();

					//초기화
					elandmall.goods.setInitLayerDetail();

					$('body').append(div);
					$('#header').css('z-index', '1');
					$('#contents').css({ 'position': 'fixed', 'z-index': '2'});
					$("body").append("<div class='bglay'></div>");
					div.fadeIn(300);

					//검색 레이어창 닫기 (검색 레이어 > 최근본 상품 경로로 유입 시 조치)
					if($("#lyr_sch").length > 0 && $("#lyr_sch").css("display") == "block"){
						layer_fix_close('lyr_sch');
						elandmall.header.fnSchClose();
					}

					$(window).resize(function(){  //20160218
						$(".bundle_dtl").animate({'scrollTop': 0}, 0);
					});


					elandmall.goods.zoomOn();

					//App 호출(기본몰에서만 적용)
					if (elandmall.global.disp_mall_no == '0000014' && (elandmall.global.app_cd == "Android" || elandmall.global.app_cd == "iOS")){
						location.href="elandbridge://layerinfo/open/";
						if ($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) ){

							var bIframe = $("<iframe name=\"_FORM_APP_HEADER_TARGET\" id=\"_FORM_APP_HEADER_TARGET\" />");
							bIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
							bIframe.attr("src", "elandbridge://header/hide/");
							bIframe.appendTo('body');
						}
					}

					//안드로이드 상품상세 확대 가능하도록 브릿지 전송
					/*if (elandmall.global.app_cd == "Android"){
                        location.href="elandbridge://productdetails/open";
                    }*/


					//뒤로가기 대응
					window.onpopstate = function(e) {
						if ( $(".layer_detail").length > 0 ) {
							close();
							if(elandmall.global.disp_mall_no == '0000053' && shoopen_tabar_display != "" && $("#shoopen_nav").length>0){
								if(shoopen_tabar_display == "block"){
									$("#shoopen_nav").removeAttr("style");
								}else{
									$("#shoopen_nav").css("display",shoopen_tabar_display);
								}
							}
							if(elandmall.global.disp_mall_no == '0000053' && shoopen_btn_top_style != "" && $("#btn_top").length>0){
								$("#btn_top").attr("style", shoopen_btn_top_style );
							}
							if(elandmall.global.disp_mall_no == '0000053' && $("#lyr_photo_review").length>0){
								$("#lyr_photo_review").remove();
							}
						}
					};

					$('.layer_detail .layer_back').click(function(){
						close();
						history.back();
						if(elandmall.global.disp_mall_no == '0000053' && shoopen_tabar_display != "" && $("#shoopen_nav").length>0){
							if(shoopen_tabar_display == "block"){
								$("#shoopen_nav").removeAttr("style");
							}else{
								$("#shoopen_nav").css("display",shoopen_tabar_display);
							}
						}
						if(elandmall.global.disp_mall_no == '0000053' && shoopen_btn_top_style != "" && $("#btn_top").length>0){
							$("#btn_top").attr("style", shoopen_btn_top_style );
						}
						if(elandmall.global.disp_mall_no == '0000053' && $("#lyr_photo_review").length>0){
							$("#lyr_photo_review").remove();
						}
					});


					function close(){

						if ( $("#bundle_detail").length > 0 ) {
							//App 호출(기본몰에서만 적용)
							if (elandmall.global.disp_mall_no == '0000014' && (elandmall.global.app_cd == "Android" || elandmall.global.app_cd == "iOS")){
								location.href="elandbridge://layerinfo/close/";
								if ($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) ){
									var bIframe = $("<iframe name=\"_FORM_APP_HEADER_TARGET\" id=\"_FORM_APP_HEADER_TARGET\" />");
									bIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
									bIframe.attr("src", "elandbridge://header/show/");
									bIframe.appendTo('body');
								}
							}
						}

						//안드로이드 상품상세 확대 가능하도록 브릿지 전송
						/*if (elandmall.global.app_cd == "Android"){
                            location.href="elandbridge://productdetails/close";
                        }*/

						elandmall.goods.zoomOff();

						$('#header').css('z-index', '');
						$('#contents').css({ 'position': '', 'z-index': ''});
						$(".bglay").remove();
						$("#bundle_detail").fadeOut();

						if(elandmall.global.disp_mall_no == '0000053'){
							$("#btn_top, #btn_back").attr('style', '');
						}else{
							$("#btn_top, #btn_back").css('bottom', '10px');
						}

						if ( $("#bundle_detail").length > 0 ) {
							$("#bundle_detail").remove();
						}
						
						//오늘받송 개발 시 처리   위의 레이어와 별도로 오픈되어 위의 remove가 작동안함  임시 처리 공통작업 필요
						if($("#pop_quick_deli_layer").length > 0){
							$("#pop_quick_deli_layer").remove();
						}

						//레이어 상세에서 scroll_out 처리 후 이전으로 돌아갔을 때 scroll 처리 안되어 공틍으로 추가
						scroll_on();

						$("html,body").scrollTop(deScope);
					}

				});
			},

			scrollSav : function(){
				if ( $("#scScope").length > 0 ) {
					$('#scScope').val($(window).scrollTop());
				}
			},

			scrollSet : function(){
				if ( $("#scScope").length > 0 ) {
					$("html,body").scrollTop($('#scScope').val());
				}
			},

			scrollSetZero : function(){
				if ( $("#scScope").length > 0 ) {
					$('#scScope').val(0);
				}
			},

			goodsDetailLayerClose : function(){
				goodsDetailLayerClose();
			},

			setInitLayerDetail : function(){
				if ( $(".layer_detail").length > 0 ) {
					history.replaceState('','',"#layerInfo");
				}else{
					history.pushState('','',"#layerInfo");		// hashtag 추가
				}

				if ( $("#bundle_detail").length > 0 ) {
					$("#bundle_detail").remove();
				}

				if ( $(".bglay").length > 0 ) {
					$(".bglay").remove();
				}

				$('#header').css('z-index', '');
				$('#contents').css({ 'position': '', 'z-index': ''});
				
				if(elandmall.global.disp_mall_no == '0000053'){
					$("#btn_top, #btn_back").attr('style', 'bottom:70px !important');  
				}else{
					$("#btn_top, #btn_back").css('bottom', '10px');
				}
				
				$('#contents').unbind('touchmove');


				scroll_on();

			},

			getDataLayerPushList : function(path_nm){

				var retVal = '';

				if(path_nm == '/main/initMain.action'){
					retVal = '메인';
				}else if(path_nm == '/shop/initShopBest100.action'){
					retVal = '베스트';
				}else if(path_nm == '/dispctg/initBrandShop.action'){
					retVal = '브랜드샵';
				}else if(path_nm == '/dispctg/initDispCtg.action'){
					retVal = '카테고리';
				}else if(path_nm == '/shop/initShopLuckyDeal.action'){
					retVal = '럭키딜';
				}else if(path_nm == '/shop/initPlanShop.action'){
					retVal = '기획전';
				}else if(path_nm == '/eventshop/initGroupPurchaseMain.action'){
					retVal = '공동구매';
				}else if(path_nm == '/content/MixAndMatchDetail.action'){
					retVal = '셀프스타일링';
				}else if(path_nm == '/goods/initGoodsDetail.action'){
					retVal = '직접유입';
				}else if(path_nm == '/search/search.action'){
					retVal = '통합검색';
				}else if(path_nm == '/shop/initBranchShop.action'){
					retVal = '지점관';
				}else if(path_nm.indexOf('utm') > -1){
					retVal = '광고유입';
				}else{
					retVal = 'Search Results';
				}

				return retVal;

			},

			zoomOff : function(){
				$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0')
			},

			zoomOn : function(){
				$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
			}
	};


	//고객센터
	elandmall.custcenter = {
		link : {
			// 메인화면 링크
			main : function() {
				location.href = elandmall.util.http("/custcenter/initCustCenterMain.action");
			},
			// 상담 문의 링크
			counsel : function( counsel_no ) {

				var callback = function(){
					var vUrl = "/custcenter/initMyCounsel.action";
					if ( counsel_no != undefined ){
						vUrl += "?counsel_no="+counsel_no;
					}
					location.href = elandmall.util.https( vUrl );
				}
				elandmall.isLogin({login:callback});

			},
			// FAQ
			faq : function(faq_no, disp_mall_no) {
				if(faq_no){
					var param = "";
					if(disp_mall_no != null){
						param = "&disp_mall_no="+disp_mall_no;
					}
					location.href = "http:"+elandmall.global.base_domain_url+"/custcenter/initCustFAQlist.action?searchType=page&faq_no="+ faq_no+param;
				}else if(disp_mall_no){
					location.href = "http:"+elandmall.global.base_domain_url+"/custcenter/initCustFAQlist.action?searchType=page&disp_mall_no="+disp_mall_no;
				}else{
					location.href = "http:"+elandmall.global.base_domain_url+"/custcenter/initCustFAQlist.action";
				}
			},
			// FAQ faq_large_divi_cd
			faqLarge : function(faq_large_divi_cd) {
				var vUrl = "/custcenter/initCustFAQlist.action?searchType=page&faq_large_divi_cd="+faq_large_divi_cd;
				if(faq_large_divi_cd =="14"){
					vUrl += "&faq_large_divi_cd_nm="+encodeURIComponent("쿠폰/포인트/예치금");
				}
				location.href=elandmall.util.http(vUrl);
			},
			// 공지사항
			notice : function(noti_no, search_type, disp_mall_no, main) {
				var param = "";
				if(main!=null)
					var param = '&noti_clss_cd=100';

				if(noti_no){
					param += "&noti_no="+noti_no;
				}
				if(disp_mall_no != null){
					param += "&disp_mall_no="+disp_mall_no;
				}
				if(!search_type) {
					search_type = "all";
				}

				if(disp_mall_no == "0000053") {
					location.href = "http:" + elandmall.global.shoopen_domain_url + "/custcenter/initCustNoticeList.action?search_type=" + search_type + param;
				} else {
					location.href = "http:" + elandmall.global.base_domain_url + "/custcenter/initCustNoticeList.action?search_type=" + search_type + param;
				}
			},
			// 복지혜택
			welfare : function() {
				location.href = elandmall.util.http("/custcenter/getWelfareSystemInfo.action");
			}
		}

	};

	// 푸터영역
	elandmall.footer = {
		link : {
			// 대량구매
			bigOrder : function() {
				//location.href = elandmall.util.https("/custcenter/bigOrderInquiry.action");
				window.open(elandmall.util.https("/custcenter/bigOrderInquiry.action"),"");
			},
			goStaffCert : function(){
				//location.href = elandmall.util.https("/member/initStaffCert.action");
				window.open(elandmall.util.https("/member/initStaffCert.action"),"");
			},
			goOutsideStaffCert : function(){
				//location.href = elandmall.util.https("/member/initOutsideStaffCert.action");
				window.open(elandmall.util.https("/member/initOutsideStaffCert.action"),"");
			}
		}

	};

	//마이페이지
	elandmall.mypage = {
		goPage : function(url, p){
			elandmall.isLogin({login : function(){
				url += elandmall.mypage.getParam(p);
				location.href = elandmall.util.https(url);
			}});
		},
		newPage : function(url, p){
			elandmall.isLogin({login : function(){
				url += elandmall.mypage.getParam(p);
				window.open(elandmall.util.https(url));
			}});
		},
		getParam : function(p){
			var param = "";
			if(p){
				for(key in p){
					if(param==''){
						param += "?"+key+"="+p[key];
					}else{
						param += "&"+key+"="+p[key];
					}
				}
			}

			return param;
		},
		link : {
			mypageMain : function(p){
				elandmall.mypage.goPage("/mypage/initMypageMain.action", p);
			},
			orderDeli : function(p){
				elandmall.mypage.goPage("/mypage/initMyOrderDeliList.action", p);
			},
			orderClaim : function(p){
				elandmall.mypage.goPage("/mypage/initMyOrderClaimList.action", p);
			},
			orderDocument : function(p){
				elandmall.mypage.goPage("/mypage/initOrderDocument.action", p);
			},
			point : function(p){
				elandmall.mypage.goPage("/mypage/initMyPointList.action", p);
			},
			coupon : function(p){
				elandmall.mypage.goPage("/mypage/initMyCouponList.action", p);
			},
			deposit : function(p){
				elandmall.mypage.goPage("/mypage/initMyDepositList.action", p);
			},
			eval : function(p){
				elandmall.mypage.goPage("/mypage/initMyEvalList.action", p);
			},
			counsel : function(p){
				elandmall.mypage.goPage("/mypage/initMyCounsel.action", p);
			},
			mixAndMatch : function(p){
				elandmall.mypage.goPage("/mypage/initMyMixAndMatch.action", p);
			},
			presentBox : function(p){
				location.href = elandmall.util.https("/mypage/initMyPresentCert.action");
			},
			wishlist : function(p){
				elandmall.mypage.goPage("/mypage/initMyWishlist.action", p);
			},
			goodListLately : function(p){
				elandmall.mypage.goPage("/mypage/searchGoodListLately.action", p);
			},
			event : function(p){
				elandmall.mypage.goPage("/mypage/initEventList.action", p);
			},
			dlvp : function(p){
				elandmall.mypage.goPage("/mypage/initMyDlvpList.action", p);
			},
			refundAccount : function(p){
				elandmall.mypage.goPage("/mypage/getMyRefundAccount.action", p);
			},
			orderInfoReceive : function(p){
				elandmall.mypage.goPage("/mypage/getMyOrderInfoReceive.action", p);
			},
			modifyMemberInfo : function(login_id , membState, returnUrl){  //회원정보 수정 , 90일 변경, 임시 비밀번호

				if($.type(membState) == "undefined" ){
					membState = '10'
				}
				if($.type(returnUrl) == "undefined" ){
					returnUrl = 'http:'+elandmall.global.base_domain_url+'/gate/memGate.action?entry_url='+ getHttpsUrl('/mypage/initMypageMain.action');
				}

				elandmall.oneclick.goPage("/member/updateMember",
					{
					authorization : elandmall.oneclick.getAuth(),
					siteCode : '10',
					accessToken : elandmall.oneclick.getAccessToken(),
					membState : membState,
					returnUrl : returnUrl},
					null,
					"post");
			},
			cancelNoPurchase  : function(login_id , membState, returnUrl){  //무실적

				if($.type(membState) == "undefined" ){
					membState = '90'
				}
				if($.type(returnUrl) == "undefined" ){
					returnUrl = "http:"+elandmall.global.base_domain_url+'/gate/memCancelNoPurchaseLoginGate.action';
				}

				elandmall.oneclick.goPage("/member/cancelNoPurchase",
					{
					authorization : elandmall.oneclick.getAuth(),
					siteCode : '10',
					returnUrl : returnUrl},
					null,
					"get");
			},
			withdrawal : function(login_id){
				//withdraw_link_yn = 'Y' 로 세팅
				elandmall.oneclick.setWithdraw();

				elandmall.oneclick.goPage("/member/memberOut",
					{
					siteCode : '10',
					webId : login_id,
					returnUrl : 'http:'+getHttpUrl('/gate/memberOutGate.action') },
					null,
					"post");
			},
			manageSnsAccount : function(login_id , membState, returnUrl){  // SNS 연동관리

				if($.type(membState) == "undefined" ){
					membState = '10'
				}
				if($.type(returnUrl) == "undefined" ){
					returnUrl = 'http:'+elandmall.global.base_domain_url+'/gate/memGate.action?entry_url='+getHttpsUrl('/mypage/initMypageMain.action');
				}

				elandmall.oneclick.goPage("/member/snsInterlinkManagement",
					{
					authorization : elandmall.oneclick.getAuth(),
					siteCode : '10',
					accessToken : elandmall.oneclick.getAccessToken(),
					membState : membState,
					returnUrl : returnUrl},
					null,
					"post");
			},
			myRestockList : function(p){
				elandmall.mypage.goPage("/mypage/initMyRestockList.action", p);
			},
			myTopasReservationList : function(p){
				elandmall.mypage.newPage("/pcweb/topas/reservation.html", p);
			},
			myTopasMobileReservationList : function(p){
				elandmall.mypage.newPage("/mobile/topas/reservation.html", p);
			},
			myKimsOrdList : function(p){
				elandmall.mypage.goPage("/mypage/searchGoodListLately.action", p);
			}
		}
	};
	//찜담기
	elandmall.wishlist ={
			data : {},
			init : function(callback){
				this.data = {};

				elandmall.isLogin({login:function(){
					callback(elandmall.wishlist.data);
				}});
			},
			addGoodsWish : function(goods_no, vir_vend_no,
					sale_shop_divi_cd, sale_shop_no,  sale_area_no, conts_dist_no, low_vend_type_cd, deli_goods_divi_cd, field_recev_poss_yn ){
				
				if(low_vend_type_cd == "50" && deli_goods_divi_cd == "10" && field_recev_poss_yn == "Y"){
					if($("#storeReceipt") != null &&  $("#storeReceipt").length > 0 ){
						return alert("매장수령 선택 후 진행해 주세요.");
					}
				}
				
				this.init(function(data){
			    	data.rel_dtl_no1= goods_no;
			    	data.rel_dtl_no3= vir_vend_no;
			    	data.rel_divi_cd = "10";//상품
			    	data.sale_shop_divi_cd= sale_shop_divi_cd;
			    	data.sale_shop_no= sale_shop_no;
			    	data.sale_area_no= sale_area_no;
			    	data.conts_dist_no= conts_dist_no;
			    	elandmall.wishlist.regWish();
				});
			},
			addBrandWish : function(brand_no){
				this.init(function(data){
			    	data.rel_dtl_no1= brand_no;
			    	data.rel_divi_cd = "20";//브랜드
			    	elandmall.wishlist.regWish();
				});
			},
			addPlanWish : function(paln_no){
				this.init(function(data){
			    	data.rel_dtl_no1= paln_no;
			    	data.rel_divi_cd = "30";//기획전
			    	elandmall.wishlist.regWish();
				});
			},

			addCategoryWish : function(disp_ctg_no){
				this.init(function(data){
					data.rel_dtl_no1= disp_ctg_no;
			    	data.rel_divi_cd = "40";//카테고리
			    	elandmall.wishlist.regWish();
				});
			},
			addKeywordWish : function(search_kwd, search_param){
				this.init(function(data){
			    	data.search_kwd = search_kwd;
			    	data.search_param = search_param;
			    	data.rel_divi_cd = "50";// 검색어
			    	elandmall.wishlist.regWish();
				});
			},
			addMixMatchWish : function(bbs_no, bbs_dtl_no){
				this.init(function(data){
					data.rel_dtl_no1 = bbs_no;
					data.rel_dtl_no2 = bbs_dtl_no;
			    	data.rel_divi_cd = "60";//mix & match
			    	elandmall.wishlist.regWish();
				});
			},
			regWish : function(){

				data = elandmall.wishlist.data;
		    	$.ajax({
		    		url: "/mypage/registMbWishList.action",
		    		data: $.param(this.data),
		    		async: false,
		    		type: "post",
		    		dataType: "text",
		    		success: function(s) {

		    			wishlistComplete(s);

		    		}, error : function( e ){
		    			if ( e.error_message !=null && e.error_message != ""){
		    				alert(e.error_message);
		    			}else{
		    				alert("처리중 오류가 발생하였습니다.");
		    			}
		    		}
		    	});
			}

	};

	//Layout 기능
	elandmall.layout = {

		//시작페이지
		fnStartPage : function() {
			if(document.all){ // Internet Explorer
				document.body.style.behavior = 'url(#default#homepage)';
				//document.body.setHomePage(elandmall.global.http_url + "/main/initMain.action");
				//시작페이지 특정 URL 세팅 요청으로 수정
				document.body.setHomePage("http://www.elandmall.com/gate/gate.action?chnl_no=ST&chnl_dtl_no=1609207089");
			}else{
				alert("이용하시는 웹 브라우저는 기능이 지원되지 않습니다.");
				return;
			}
		},
		//즐겨찾기
		fnAddBookmark : function(){

			var title = document.title; //현재 보고 있는 페이지의 Title
			if(title == ""){
				title = "E랜드 통합몰";
			}
			//var url = location.href; //현재 보고 있는 페이지의 Url
			//즐겨찾기 특정 URL 세팅 요청으로 수정
			var url = "http://www.elandmall.com/gate/gate.action?chnl_no=DI&chnl_dtl_no=1609207088";
			if(window.sidebar && window.sidebar.addPanel){ // Firefox
				window.sidebar.addPanel(title, url,"");
			}
			else if(window.opera && window.print){ // Opera
				var elem = document.createElement('a');
				elem.setAttribute('href',url);
				elem.setAttribute('title',title);
				elem.setAttribute('rel','sidebar');
				elem.click();
			}
			else if(document.all){ // Internet Explorer
				window.external.AddFavorite( url, title);
			}
			else{
				alert("이용하시는 웹 브라우저는 기능이 지원되지 않습니다.\n\nCtrl+D 키를 누르시면 즐겨찾기에 추가하실 수 있습니다.");
				return;
			}
			return;
		},
		//앱소개페이지
		fnAppIntro : function(){
			location.href = elandmall.util.http("/dispctg/initMobileAppIntroduce.action");
		}
	};


	/**
	 * 컨쳉츠 형태 에 따른 클릭 이벤트 주기
	 * 110	기획전NO
	 * 120	전시카테고리NO
	 * 130	배너NO
     * 140	이미지
	 * 150	TEXT 입력형
	 * 160	브랜드NO
	 * 170	상품평NO
	 * 999  기타 ( 코너 데이타로 가져오는 부분이 아닌 그외 처리 일반 배너 )
	 * {
     * area_no :  영역번호 ,
	 * conts_dist_no : 컨텐츠 식별번호
	 * conts_divi_cd:컨텐츠구분코드 (TR0002)
	 * rel_no : 컨텐츠번호
	 * rel_divi_cd : 관련구분코드 (TR0003)
	 *
	 * url:''  -- 이동 경로
	 * }
	 */
	elandmall.disp = {

	      clickEvent : function (pin) {

	    	  var fnMoveLinkUrl = function(pin){
		  			var param =  "";
		  			var linkUrl = "";
		  			var pattern =/^http/gi;
		  			var pattern2 =/^javascript/gi;
		  			var pattern3 = /\/custcenter\/.*/;
		  			var pattern4 = /\/mypage\/.*/;

		  			if($.type(pin.param) !="undefined"){
		  			    $.each(pin.param, function(name, data) {
		  			    	 if(param == ""){
		  			    		 param = name +'='+ data ;
		  			    	 }else{
		  			    		 param += '&'+name +'='+ data ;
		  			    	 }
		  			    });
		  			}

		  			if((pattern2.test(pin.url))){
		  				eval(pin.url);
		  			} else {
		  				if(pattern3.test(pin.url) ){
			  				linkUrl = "http:" + elandmall.global.base_domain_url + pattern3.exec(pin.url);
			  			}else if(pattern4.test(pin.url)){
			  				linkUrl = elandmall.global.ssl_domain_url + pattern4.exec(pin.url);
			  			}else if(!(pattern.test(pin.url)) ){
			  				linkUrl = elandmall.util.http(pin.url);
			  			}else{
			  				linkUrl = pin.url;
			  			}
		  				if(param != ""){
			  				if(linkUrl.lastIndexOf("?") <= -1){
			  					linkUrl = linkUrl + "?" + param;
			  				}else{
			  					linkUrl = linkUrl + "&" + param;
			  				}
			  			}
			  			if(pin.openwinyn && pin.openwinyn == "Y"){
			  				window.open(linkUrl);
			  			}else{
			  				location.href = linkUrl;
			  			}
		  		   }
		  	}

			//컨텐츠 처리 하기
			if(pin.tr_yn && pin.tr_yn == 'Y'){
				elandmall.tracking.fireClick(pin);
			}

			if(pin.conts_form_cd  == "110") {

				//모바일 history back
				if( typeof(pin.param) != "undefined" &&  pin.param.back_use_yn == "Y"){
					elandmall.history.fnPageMovePrev('', pin.param.page_idx, pin.param);
				}

				//기획전 이동 rel_no : 기획전 번호
				elandmall.goods.scrollSav();

				if(pin.url && pin.url != "") {
					fnMoveLinkUrl(pin);

				} else {
					elandmall.shop.goPlanShop({disp_ctg_no: pin.move_cont_no});
				}

			}else if(pin.conts_form_cd  == "120") {

				//전시카테고리 이동  rel_no : 브랜드 번호
			}else if(pin.conts_form_cd  == "160") {
				if(pin.brandIndexYn != null && pin.brandIndexYn == 'Y'){
					elandmall.brand.goBrandIndexShop(pin.move_cont_no);
				}else{
					elandmall.brand.goBrandShop(pin.move_cont_no);
				}

				//브랜드 이동 rel_no : 브랜드 번호
			}else if(pin.conts_form_cd  == "130") { //배너

				//배너 종류
				if(pin.banner_kind_cd == "20" || pin.banner_kind_cd == "21") {//이벤트
					if($.type(pin.url) !="undefined" && pin.url  != ""){
						fnMoveLinkUrl(pin);
					}else{
						//이벤트 링크 필요
						elandmall.event.goEventConts({event_no: pin.move_cont_no});
					}
				}else if(pin.banner_kind_cd == "51" && ($.type(pin.url) =="undefined" || pin.url  == "")){	//브랜드

					elandmall.brand.goBrandShop(pin.move_cont_no);
				}else if(pin.banner_kind_cd == "70"){	//상품배너
					elandmall.goods.goDetail({goods_no:pin.move_cont_no, sale_area_no:pin.sale_area_no, tr_yn:pin.tr_yn, conts_dist_no:pin.conts_dist_no, conts_divi_cd:pin.conts_divi_cd, rel_no:pin.rel_no, rel_divi_cd:pin.rel_divi_cd});
				}else{
					if($.type(pin.url) =="undefined" || pin.url  == ""){
						return;
					}
					fnMoveLinkUrl(pin);
				}
			}
	    }
	};
	elandmall.validate = {
		isValidEmail: function(email) {
            if (email == "") {
            	return false;
            } else{
            	var newStr = "";
            	var patten = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            	if (email.match(patten) == null) {
            		return false;
                } else {
                	return true;
                };
            };
		}
	};

	//복지몰
	elandmall.welfare = {
		//임직원 복지샵
		EmpWelfareMain: function(){
			var callback = function(){
				location.href = elandmall.util.http("/dispctg/initEmpWelfareMain.action");
			}
			elandmall.isLogin({login:callback});
		},

		//켄싱턴 둘러보기
		kensingtonLookAround: function(){
			location.href = elandmall.util.http("/dispctg/initKensingtonLookAround.action");
		},

		//켄싱턴 스타일 가이드
		kensingtonStyleGuide: function(){
			location.href = elandmall.util.http("/dispctg/initKensingtonStyleGuide.action");
		},

		//상품권 이용 가이드
		ticketUseGuide: function(){
			location.href = elandmall.util.http("/dispctg/initTicketUseGuide.action");
		},

		//기부하기
		donation: function(){
			if(confirm("복지몰 운영 종료 후 잔여 포인트 기부에 동의하시겠습니까? \n동의 이후에는 취소 신청이 되지 않으니, 신중히 선택해 주세요")){
				$.ajax({
					url: "/dispctg/updateEmpDonation.action",
					type: "POST",
					dataType: "text",
					success: function(data) {
						if(data == 'S'){
							alert("감사합니다. 정상 신청되었습니다. \n기부된 포인트는 연말소득공제가 가능하며, 연말정산 시 이랜드 복지 재단 홈페이지를 통해 기부금 영수증을 발급 받으실 수 있습니다.");
						}else{
							alert("이미 신청 하셨습니다.");
						}
					},
					error: function(e) {

					}
				});
			}
		}
	};

	//이벤트
	elandmall.event = {
		//이벤트 & 혜택존
		eventBenefitZone: function(){
			location.href = elandmall.util.http("/event/initEventBenefitZone.action");
		},
		//이벤트 & 혜택존 (모바일 단독페이지)으로 이동
		eventBenefitZoneSelf : function() {
			location.href = elandmall.util.http("/event/searchEventBenefitZoneJson.action?self_yn=Y");
		},

		//출석체크이벤트 상세
		eventAttend: function(){
			location.href = elandmall.util.http("/event/initAttendCheckEventDtl.action");
		},
		//등급안내
		gradeInfo: function(){
			location.href = elandmall.util.http("/event/initGradeInfo.action");
		},

		//이벤트 상세
		goEventConts: function(pin){
			var param =  "";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});

			location.href = elandmall.util.http("/event/initEventDtl.action?"+param);
		},

		/**
		 * 이벤트 응모하기
		 * pin { form : "#eventForm" }
		 */
		fnRegistEventEntry: function(pin){

			if ($.isFunction(pin.callback)) {
				callback = pin.callback;
			} else {
				callback = "";
			};

			var form = $(pin.form).createForm();

			form.submit({
				action: "/event/registEventEntry.action",
				iframe: true,   //true일 경우 target 무시되고 페이지내에 iframe 생성후 해당 iframe으로 form submit
				success: function(p) {  //iframe이 true 일 경우 submit후 호출됨
					if(p.result_code != null && p.result_code == "0000"){
						if( pin.msg != "Y") {
							alert("정상적으로 응모되셨습니다. \n이벤트에 참여해 주셔서 감사합니다.");
						}
					} else {
						if( pin.msg != "Y") {
							if(p.result_code == "-6006" || p.result_code == "-6007" || p.result_code == "-6008" ){
								alert("이미 응모하셨습니다. 다음에 다시 응모해 주세요.");
							} else if(p.result_code == "-4002"){
		                		alert("아쉽게 당첨되지 않으셨네요.\n다음에 다시 응모해 주세요.");
							} else {
								alert(p.result_msg)
							}
						}
					}
					if(callback != ""){
						callback(p);
					}
				},
				error: function(p) {    //iframe이 true 일 경우 submit후 호출됨
					if(p.result_msg != null && p.result_msg != ""){
						alert(p.result_msg);
					}else{
						alert("이벤트 응모시 오류가 발생했습니다.");
					}
/*
					if(callback != ""){
						callback(p);
					}
					*/
				}
			});
		}
	}

	// 비회원주문조회
	elandmall.nomember = {
			getParam : function(p){
				var param = "";
				if(p){
					for(key in p){
						if(param==''){
							param += "?"+key+"="+p[key];
						}else{
							param += "&"+key+"="+p[key];
						}
					}
				}

				return param;
			},
			orderDetail : function(p){
				location.href = elandmall.util.https("/mypage/initMyOrderDetailList.action" + this.getParam(p));
			},
			orderDetailUrl : function(p){
				return elandmall.util.https("/mypage/initMyOrderDetailList.action" + this.getParam(p));
			},
			goodListLately : function(p){
				location.href = elandmall.util.https("/mypage/searchGoodListLately.action");
			},
			orderDocument : function(p){
				location.href = elandmall.util.https("/mypage/initOrderDocument.action");
			}
   };

  //원클릭에서 필요한 정보
   elandmall.oneclick = {
	   getAuth : function(){
		   var auth = "";
			$.ajax({
				url: "/member/authorization.action",
				dataType: "json",
				async: false,
				success: function(data) {
		            auth = data.authorization;
				}
	        });
		   return auth;
	    },
        getAccessToken : function(){
			   var accessToken = "";
				$.ajax({
					url: "/member/getAccessToken.action",
					dataType: "json",
					async: false,
					success: function(data) {
						accessToken = data.accessToken;
					}
		        });
			   return accessToken;
		},
        getOneClickauthSecret : function(){
			   var accessToken = "";
				$.ajax({
					url: "/member/oneClickauthSecret.action",
					dataType: "json",
					async: false,
					success: function(data) {
						accessToken = data.authorization;
					}
		        });
			   return accessToken;
		},
	    getLoginId : function(){
			   var sId = "";
				$.ajax({
					url: "/member/getLoginId.action",
					dataType: "json",
					async: false,
					success: function(data) {
						sId = data.login_id;
					}
		        });
			   return sId;
		    },
	    getFrontAuth : function(){
			   var auth = "";
				$.ajax({
					url: "/member/oneClickauth.action",
					dataType: "json",
					async: false,
					success: function(data) {
			            auth = data.authorization;
					}
		        });
			   return auth;
		    },
		goPage : function(url, parameters , winname, method){// 원클릭 화면 이동

			var $form = $('<form></form>');

			//새창 띄우기
			if($.type(winname) != "undefined" && winname != null) {
			    var win = window.open("", winname);
			    $form.attr("target", winname);
			}

			var oneclickDomain = elandmall.global.oneclick_domain_url;
			$form.attr("method", method).attr("action",oneclickDomain+url);
			$form.appendTo('body');
			var paramInput='';

			for(key in parameters){
				paramInput = "<input type='hidden' value='"+parameters[key]+"' name='"+key+"'/>";
				$form.append(paramInput);
			}
			$form.submit();
		},
		setWithdraw : function(){
			   var auth = "";
				$.ajax({
					url: "/member/setWithdrawMode.action",
					dataType: "text",
					async: false,
					success: function(data) {

					}
		        });
			   return auth;
		},
		//아이디찾기
		fnMemIDFind : function(){
			location.href=elandmall.global.oneclick_domain_url +"/member/findId?siteCode=10&returnUrl="+ getHttpsUrl('/login/initLogin.action');
		},
		//패스워드찾기
		fnMemPassFind : function(){
			location.href=elandmall.global.oneclick_domain_url +"/member/findPwd?siteCode=10&returnUrl="+ getHttpsUrl('/login/initLogin.action');
		},
		//아이디찾기
		fnMemIDFindForTour : function(){
			location.href=elandmall.global.oneclick_domain_url +"/member/findId?siteCode=10&returnUrl="+ getHttpsUrl('/login/initLogin.action');
		},
		//패스워드찾기
		fnMemPassFindForTour : function(){
			location.href=elandmall.global.oneclick_domain_url +"/member/findPwd?siteCode=10&returnUrl="+ getHttpsUrl('/login/initLogin.action');
		},
		//회원가입
		fnMemJoin : function(){
			elandmall.oneclick.goPage("/member/joinMember",
					{siteCode : '10',
					returnUrl : "http:"+getHttpUrl('/gate/memJoinGate.action') }, null, "get");
		},
		//임시비밀번호연장
		fnHoldTempPassword : function(callback) {

			var pParam = {webId : elandmall.oneclick.getLoginId(), authorization : elandmall.oneclick.getFrontAuth()};
			var onclick_url = elandmall.global.oneclick_domain_url;

			jQuery.support.cors = true;
			if($.browser.msie && $.browser.version<=9) {
		       _gatewayURL_ = elandmall.util.https("/login/gateWay.action");
		    }
	        jQuery.ajax({
	        	type:'GET',
				url: onclick_url+"/member/holdTempPasswordAjax",
		    	cors:true,
		    	crossDomain:true,
				dataType: "json",
				data:pParam,
				success: function(data) {
					console.log("data.resultCode => {}",data.resultCode);
					if(data.resultCode != "0") {
						alert('비밀번호 연장 처리가 되지 않았습니다.');
					}
					if ( $.type(callback) == "function" ){
						callback();
					}
				},
				error : function(error) {
				   $.each(error , function(a , o){
	        		   console.log(a +">>"+o);
	        	   });
					alert('비밀번호 연장 오류가 발생하였습니다.');
	            }
	        });
		},
		//비밀번호연장
		fnExtendPwdChange : function(callback) {

			var pParam = {webId : elandmall.oneclick.getLoginId(), authorization : elandmall.oneclick.getFrontAuth()};
			var onclick_url = elandmall.global.oneclick_domain_url;

			jQuery.support.cors = true;
	    	if($.browser.msie && $.browser.version<=9) {
	           _gatewayURL_ = elandmall.util.https("/login/gateWay.action");
	    	}
	        jQuery.ajax({
	        	type:'GET',
				url: onclick_url+"/member/extendPwdChangeAjax",
		    	cors:true,
		    	crossDomain:true,
				dataType: "json",
				data:pParam,
				success: function(data) {
					 console.log("data.resultCode => {}",data.resultCode);
					if(data.resultCode != "0"){
						alert('비밀번호 연장 처리가 되지 않았습니다.');
					}
					if ( $.type(callback) == "function" ){
						callback();
					}
				},
				error : function(error) {
				   $.each(error , function(a , o){
	        		   console.log(a +">>"+o);
	        	   });
	            	alert('비밀번호 연장 오류가 발생하였습니다.');
	            }
	        });
		}
   };

   // 매장위치 찾기
   elandmall.ShopInfo = {
	   goShopInfo : function( p ){
		   var vUrl = "/mallinfo/initBrandShopInfo.action";
		   if ( p != undefined && p.brand_no != undefined ){
			   vUrl += "?brand_no="+p.brand_no;
		   }
		   location.href = elandmall.util.http(vUrl);
	   }
   }

   //모던하우스
   elandmall.modernhouse = {
	   //소개
	   goIntroduce: function(){
		   location.href = elandmall.util.http("/dispctg/initModernHouseIntro.action");
	   }
   };
   
   //킴스 장보기
   elandmall.kims = {
	   goPage : function(url, p){
			elandmall.isLogin({login : function(){
				url += elandmall.kims.getParam(p);
				location.href = elandmall.util.https(url);
			}});
	   },
	   getParam : function(p){
			var param = "";
			if(p){
				for(key in p){
					if(param==''){
						param += "?"+key+"="+p[key];
					}else{
						param += "&"+key+"="+p[key];
					}
				}
			}

			return param;
		},
	   //구매내역 조회
	   myOrdList: function(p){
		   elandmall.kims.goPage("/dispctg/searchMyKimsOrderList.action", p);
	   }
   };


   // 우편번호찾기 공통
   elandmall.postPopup = {
	   citySearch : function( obj ){
		 $("#gu_nm").html('<option value=\"\" selected=\"selected\">시/군/구</option>');

		 $.ajax({
		        type : 'POST',
		        dataType: 'json',
		        url : "/popup/searchGuNm.action" ,
		        data : {"city_nm" : $(obj).val()},
		        success : function (data) {
		        	if ( data != null ){
						var selectOpt = "<option value=\"\" selected=\"selected\">시/군/구</option>";
						for(i=0; i< data.arrGuList.length; i++){
							if ( data.arrGuList[i] != "" ){
								selectOpt = selectOpt + "<option value='"+data.arrGuList[i]+"' >"+data.arrGuList[i]+"</option>";
							}
						}
						$("#gu_nm").html(selectOpt);
		        	}
		        }
		    });
	   },
	   addrSearch : function( parentObj){
			var sch_nm = $("#sch_nm", parentObj);

			if ( sch_nm.val() == "" || sch_nm.val().length < 2 ){
				alert("검색어는 최소 2자 이상 입력해야 합니다.");
				sch_nm.focus();
				return false;
			} else if ( sch_nm.val().length > 50 ){
				alert("50자 이상을 검색할 수 없습니다.");
				sch_nm.focus();
				return false;
			}

			return {
					sch_nm : sch_nm.val()
				};
	   },
	   addUse : function ( parentObj, addr_gb, _callback ) {
			// callback
			if ($.type(_callback) == "function"){
				_callback( {
					city_exp_yn : $("#city_exp_yn", parentObj).val(),
					area_divi_cd : $("#area_divi_cd", parentObj).val(),
					addr_gb : addr_gb,	// 10 : 지번 20:도로명
					j_post_no : $("#post_no", parentObj).val(),
					j_base_addr : $("#addr_jibun", parentObj).val(),
					j_dtl_addr : "",
					r_post_no : $("#post_no", parentObj).val(),
					r_base_addr : $("#addr_road", parentObj).val(),
					r_dtl_addr : ""
				} );
			};
	   },
	   setDetailAddr : function ( trObj ){
			var post_no = $("#post_no", trObj).val();
			var addr = $("#addr", trObj).val();
			var addr_view = $("#addr_view", trObj).val();
			var city_exp_yn = $("#city_exp_yn", trObj).val();
			var area_divi_cd = $("#area_divi_cd", trObj).val();
			var isNewAddr = $("#isNewAddr", trObj).val();
			var divObj = $("#"+isNewAddr);

			$("#set_post_no", divObj ).text(post_no);
			$("#set_base_addr", divObj ).text(addr);
			$("#set_base_addr_view", divObj ).val( $.trim(addr_view) != "null" ? addr_view : addr );
			$("#set_city_exp_yn", divObj ).val(city_exp_yn);
			$("#set_area_divi_cd", divObj ).val(area_divi_cd);
			$("#set_isNewAddr", divObj ).val(isNewAddr);
			return {divObj:divObj , isNewAddr : isNewAddr};
	   }
   }

   getHttpsUrl = function(url) {
	   if(elandmall.global.disp_mall_no == '0000053' && elandmall.global.chnl_cd != '10'){
			return elandmall.global.https_shoopen_domain_url + function(){
				if(url == '/mypage/initMypageMain.action') {
					return '/mypage/shoopen/initMypageMain.action';
				}else {
					return url
				};
			}();
		} else {
			return elandmall.global.https_url + url;
		} 
   }
   
   getHttpUrl = function(url) {
	   if(elandmall.global.disp_mall_no == '0000053' && elandmall.global.chnl_cd != '10'){
		   return elandmall.global.shoopen_domain_url + url;
	   }else {
		   return elandmall.global.base_domain_url + url;
	   }
   }

   var _gaHandler = function(){
   		var ga_tag = $(this).data('ga-tag');
		var arry = ga_tag != undefined ? ga_tag.split("||") : null;

		if ( arry == null ){
			ga_tag = $(this).find("option:selected").data("ga-tag");
			arry = ga_tag != undefined ? ga_tag.split("||") : null;
			console.dir(arry);
		}
		if (  arry != null && $.type(arry) != "undefined" && arry.length > 1 ){
			arry = ga_tag != undefined ? ga_tag.split("||") : null;
			elandmall.util.ga(arry[0], arry[1], arry[2]);
			console.dir(arry[0] + arry[1] + arry[2]);
		}

	}
   _google_analytics = function(obj){
	    if(typeof(obj) != undefined && typeof(obj) != "undefined"){
			//google analytics
		    $('[data-ga-tag]', obj).unbind('click', _gaHandler).bind('click', _gaHandler);
		    $('[data-ga-select]', obj).unbind('change', _gaHandler).bind('change', _gaHandler);
	    }else{
			//google analytics
		    $('[data-ga-tag]').unbind('click', _gaHandler).bind('click', _gaHandler);
		    $('[data-ga-select]').unbind('change', _gaHandler).bind('change', _gaHandler);
	    }
   }


   $(document).ready(function(){
	   //이벤트 태깅
	   _google_analytics();
   });

   // 금칙어 관련
   elandmall.checkBanWord = function( val ){
	   var rtn = false;
	   try {
		   rtn = $.overpass.prwd.checkBanWord( val );
	   }catch(e){
		   rtn = false;
	   }
	   return rtn;
   }

   //httpSession 제거
   elandmall.httpSessionRemove = function(key){
	   if(typeof(key) != undefined && typeof(key) != "undefined" && key != ""){
		   $.ajax({
		    	url:"/dispctg/httpSessionRemove.action",
				data: {
					key: key
				}
			});
	   }
	}
   
   /*
	 * 전시 타이머 (커밍순)
	 *
	 * parameter {
	 * 		goods_no : '111111'
	 * 		exposure_start_dtime: '2020/03/05 13:00:00'
	 * 		reserve_start_dtime : '2020/03/05 13:00:00'
	 * 		callback:
	 * }
	 */
	elandmall.dispTimer = function(p) {
		
		var fo_goods_url = p.event_api_domain_url + "/fo-event/getCurrentDateTime";
		var goods_no = (typeof(p.goods_no) != "undefiend")? p.goods_no : "";
		var exposure_start_dtime = (typeof(p.exposure_start_dtime) != "undefiend")? p.exposure_start_dtime : "";
		var reserve_start_dtime = (typeof(p.reserve_start_dtime) != "undefiend")? p.reserve_start_dtime : "";
		
        $.ajax({
            url: fo_goods_url,
			cors: true,
			data: {pattern : 'yyyy/MM/dd HH:mm:ss'},
			type: "GET",
			cache : false,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType: "json",
            success: function(result){
            	var currentDt = new Date(result.data);
        		var vDate = new Date(reserve_start_dtime); 
        		var second = 1000; 
        		var minute = second * 60; 
        		var hour = minute * 60; 
        		var day = hour * 24; 
        		var timer; 

        		function showRemaining() {
        			var now = currentDt; 
        			var distDt = vDate - now; 
        			var html = "";
        			if (distDt < 0) {
        				$('#d_time_reserv_'+ goods_no).parent().parent().remove();
        				clearInterval(timer); 
        				return; 
        			} 
        			
        			var days = Math.floor(distDt / day); 
        			var hours = Math.floor((distDt % day) / hour); 
        			var minutes = Math.floor((distDt % hour) / minute); 
        			var seconds = Math.floor((distDt % minute) / second); 
        			
        			html += "<em>"+fnfirstZero(hours)+"</em>:<em>"+fnfirstZero(minutes)+"</em>:<em>"+fnfirstZero(seconds)+"</em>";
        			$('#d_day_'+ goods_no).html("D-"+fnfirstZero(days)+"일 ");
        			$('#d_time_reserv_'+ goods_no).html(html);
        			currentDt.setSeconds(currentDt.getSeconds() + 1);
        		} 
        		timer = setInterval(showRemaining, 1000); 
            },error:function(e){
            	console.log(e);
            }
        });
		
	}
	
	function fnfirstZero(num){
		var str = "";
		if(num == 0){
			str = "00";
		}else if(num < 10){
			str = "0"+ num;
		}else{
			str = num;
		}
		return str;
	}
	
	/*
	 * application log Error 
	 *
	 * parameter {
	 * 		message : error messagge
	 * }
	 */
	elandmall.outputSeverLog = function(param){	//pc, mo 
		$.ajax({
			url: "/goods/getOutputSeverLog.action",
			data: {	msg : param.msg},
			async:false,
			type: "POST",
			success: function(data) {}
		});
	}
   
    /* 카테고리 찜목록
	 */
	elandmall.Categorylink = function(mall_no, dtl_no) {
	    if(mall_no == '0000013'){ //모던하우스
			location.href = elandmall.util.http("http:" + elandmall.global.modernhouse_domain_url  + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000045'){ //킴스클럽
			location.href = elandmall.util.http("http:" + elandmall.global.kimsclub_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);	
		}else if(mall_no == '0000043'){ //미쏘
			location.href = elandmall.util.http("http:" + elandmall.global.mixxo_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000042'){ //후아유
			location.href = elandmall.util.http("http:" + elandmall.global.whoau_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000041'){ // OST
			location.href = elandmall.util.http("http:" + elandmall.global.ost_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000040'){ // 킨더리그
			location.href = elandmall.util.http("http:" + elandmall.global.ekids.domain.url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000039'){ //폴더
			location.href = elandmall.util.http("http:" + elandmall.global.folder_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000038'){ //뉴발란스
			location.href = elandmall.util.http("http:" + elandmall.global.newbal_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000037'){// 스파오
			location.href = elandmall.util.http("http:" + elandmall.global.spao_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000036'){// 클루
			location.href = elandmall.util.http("http:" + elandmall.global.clue_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000035'){ // 로엠
			location.href = elandmall.util.http("http:" + elandmall.global.roem_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000033'){ // 에블린
			location.href = elandmall.util.http("http:" + elandmall.global.eblin_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000034'){ //로이드
			location.href = elandmall.util.http("http:" + elandmall.global.lloyd_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000053'){ // 슈펜
			location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else if(mall_no == '0000044'){ // 바후스
			location.href = elandmall.util.http("http:" + elandmall.global.bahus_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);		
		}else if(mall_no == '0000063'){ //뉴발란스키즈
			location.href = elandmall.util.http("http:" + elandmall.global.nbkids_domain_url + "/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}else{
			location.href = elandmall.util.http("/dispctg/initDispCtg.action?disp_ctg_no="+ dtl_no);
		}
	}
	
	 /*
	 * 회원의 반짝배송 가능한 퀵배송 상품 반짝배송태그 On 처리
	 * parameter {
	 * 		ico_qck_list : $("상품리스트").find(".ico_qck_dlv")
	 * }
	 */
	elandmall.dispQuickIconCheck = function(ico_qck_list){
		if(elandmall.loginCheck()){
			$.ajax({
		    	url : "/member/getMbMbrDlvpMgmtVirVendNoAjax.action",
		    	type : "POST",
		    	dataType : "json",
		    	async: false,
		    	success : function(data) {
		    		if(data.length > 0){
				   		for(var i = 0 ; i < ico_qck_list.length; i++ ){
				   			if(data.indexOf(ico_qck_list[i].getAttribute("vir_vend_no")) > -1){
				   				ico_qck_list[i].setAttribute("class","ico_qck_dlv on");
				   			}
				   		}
		    		}
		    	}
		    });
		}
	}

	//슈펜 마이페이지
	elandmall.shoopen.mypage = {
		goPage : function(url, p){
			elandmall.isLogin({login : function(){
					url += elandmall.shoopen.mypage.getParam(p);
					location.href = elandmall.util.https(url);
				}});
		},
		newPage : function(url, p){
			elandmall.isLogin({login : function(){
					url += elandmall.shoopen.mypage.getParam(p);
					window.open(elandmall.util.https(url));
				}});
		},
		getParam : function(p){
			var param = "";
			if(p){
				for(key in p){
					if(param==''){
						param += "?"+key+"="+p[key];
					}else{
						param += "&"+key+"="+p[key];
					}
				}
			}

			return param;
		},
		link : {
			mypageMain : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/shoopen/initMypageMain.action", p);
			},
			mypageNologin : function(){
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url +"/mypage/shoopen/gateway/initGatewayMain.action");
			},
			goShopInfo : function(p){
				var vUrl = "/mallinfo/shoopen/initBrandShopInfo.action";
				if ( p != undefined && p.brand_no != undefined ){
					vUrl += "?brand_no="+p.brand_no;
				}
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url +vUrl);
			},
			extraCouponList : function() {
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/mypage/shoopen/coupon/searchExtraCouponList.action");
			},
			orderDeli : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyOrderDeliList.action", p);
			},
			orderClaim : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyOrderClaimList.action", p);
			},
			orderDocument : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initOrderDocument.action", p);
			},
			point : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyPointList.action", p);
			},
			coupon : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/shoopen/initMyCouponList.action", p);
			},
			deposit : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyDepositList.action", p);
			},
			eval : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyEvalList.action", p);
			},
			counsel : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyCounsel.action", p);
			},
			mixAndMatch : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyMixAndMatch.action", p);
			},
			presentBox : function(p){
				location.href = elandmall.util.https("/mypage/initMyPresentCert.action");
			},
			wishlist : function(p){
				location.href = elandmall.util.http("http:" + elandmall.global.shoopen_domain_url + "/cart/initCart.action?wish_yn=Y", p);
			},
			goodListLately : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/searchGoodListLately.action", p);
			},
			event : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/shoopen/initEventList.action", p);
			},
			dlvp : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyDlvpList.action", p);
			},
			refundAccount : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/getMyRefundAccount.action", p);
			},
			orderInfoReceive : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/getMyOrderInfoReceive.action", p);
			},
			modifyMemberInfo : function(login_id , membState, returnUrl){  //회원정보 수정 , 90일 변경, 임시 비밀번호

				if($.type(membState) == "undefined" ){
					membState = '10'
				}
				if($.type(returnUrl) == "undefined" ){
					returnUrl = 'http:'+elandmall.global.base_domain_url+'/gate/memGate.action?entry_url='+elandmall.global.https_url+'/mypage/shoopen/initMypageMain.action';
				}

				elandmall.oneclick.goPage("/member/updateMember",
					{
						authorization : elandmall.oneclick.getAuth(),
						siteCode : '10',
						accessToken : elandmall.oneclick.getAccessToken(),
						membState : membState,
						returnUrl : returnUrl},
					null,
					"post");
			},
			cancelNoPurchase  : function(login_id , membState, returnUrl){  //무실적

				if($.type(membState) == "undefined" ){
					membState = '90'
				}
				if($.type(returnUrl) == "undefined" ){
					returnUrl = "http:"+elandmall.global.base_domain_url+'/gate/memCancelNoPurchaseLoginGate.action';
				}

				elandmall.oneclick.goPage("/member/cancelNoPurchase",
					{
						authorization : elandmall.oneclick.getAuth(),
						siteCode : '10',
						returnUrl : returnUrl},
					null,
					"get");
			},
			withdrawal : function(login_id){
				//withdraw_link_yn = 'Y' 로 세팅
				elandmall.oneclick.setWithdraw();

				elandmall.oneclick.goPage("/member/memberOut",
					{
						siteCode : '10',
						webId : login_id,
						returnUrl : 'http:'+elandmall.global.base_domain_url+'/gate/memberOutGate.action'},
					null,
					"post");
			},
			manageSnsAccount : function(login_id , membState, returnUrl){  // SNS 연동관리

				if($.type(membState) == "undefined" ){
					membState = '10'
				}
				if($.type(returnUrl) == "undefined" ){
					returnUrl = 'http:'+elandmall.global.base_domain_url+'/gate/memGate.action?entry_url='+elandmall.global.https_url+'/mypage/shoopen/initMypageMain.action';
				}

				elandmall.oneclick.goPage("/member/snsInterlinkManagement",
					{
						authorization : elandmall.oneclick.getAuth(),
						siteCode : '10',
						accessToken : elandmall.oneclick.getAccessToken(),
						membState : membState,
						returnUrl : returnUrl},
					null,
					"post");
			},
			myRestockList : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/initMyRestockList.action", p);
			},
			myTopasReservationList : function(p){
				elandmall.shoopen.mypage.newPage("/pcweb/topas/reservation.html", p);
			},
			myTopasMobileReservationList : function(p){
				elandmall.shoopen.mypage.newPage("/mobile/topas/reservation.html", p);
			},
			myKimsOrdList : function(p){
				elandmall.shoopen.mypage.goPage("/mypage/searchGoodListLately.action", p);
			}
		}
	};
	
})(jQuery);


/*상품이미지 리사이징처리*/
function getGoodsImagePath(imgDomain, good_no, img_path, size, fix_size, img_divi_cd){
	
	var sGood_path = "";
	
	if (img_path != null && img_path != "") {
		if(size != null && size != ""){
			  for(var i=0; i<fix_size.length; i++){
				  if( Number(fix_size[i])  >= Number(size)){
		        		size = fix_size[i];
		        		break;
		        	}  
			  }
	       
			if(img_divi_cd=="140" || img_divi_cd=="150" || img_divi_cd=="170"){
				sGood_path = imgDomain + "/prd/recimg/" + good_no.substring(good_no.length - 3, good_no.length) + "/" + size + "/" + img_path.substring(img_path.lastIndexOf("/") + 1);
			}else if(img_divi_cd=="10" || img_divi_cd=="30"){
				sGood_path = imgDomain + "/prd/img/" + good_no.substring(good_no.length - 3, good_no.length) + "/" + size + "/" + img_path.substring(img_path.lastIndexOf("/") + 1);
			}
		} else {
			sGood_path = imgDomain + img_path;
		}
	}
	
	return sGood_path;
}
