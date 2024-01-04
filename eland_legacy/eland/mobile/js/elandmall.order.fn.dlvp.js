/**
 * 배송지/배송비 관련 함수 모음 
 */
$(document).ready(function() {
	if (!ORDER.fn) {
		ORDER.fn = {};
	};
	$.extend(ORDER.fn, {
		lock: null,
		getDeliInfo: function() {
			try {
				// 킴스가 아닐경우에만
				if(elandmall.global.disp_mall_no != '0000045'){
					if (ORDER.fn.lock != null) {
						alert(ORDER.fn.lock.message);
						throw null;
					};
					ORDER.fn.lock = { message: "배송비 재조회 중 입니다. 잠시 후 다시 시도해 주세요." };
				}

				ORDER.dlvp.getDeliInfo({
					callback: function(data) {	//배송비 재조회 후 화면 갱신
						var extra_deli_goods = [];	//추가 배송비 발생 상품
						//배송불가 처리
						var dlvp_count = (function() {	//택배배송 배송지 갯수
							var count = 0;
							$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
								if (this.cart_grp_cd == "10") {
									count++;								
								};
							});
							return count;
						})();
						var mainSpan = $("#deli_poss_yn_p, #deli_poss_yn_p_new");
					
						ORDER.fn.updateOrderSheet();
						
						if (mainSpan.is(":visible")) {
							mainSpan.hide();
						};
						$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
							var dlvp = this;
							var deli_poss_n_count = 0;	//배송불가 포함여부 확인용
							var div = dlvp.div;
							if (this.cart_grp_cd != "10") {
								return true;
							};
							$.each(this.ord_deli, function(dlvp_seq) {
								var deli = this.deli;
								var r_deli_cost_amt = 0;
								$.each(this.ord_goods, function(cart_seq) {
									var span = $("#deli_poss_yn_span_" + cart_seq);
									if (this.deli_poss_yn == "N") {
										deli_poss_n_count++;
										if (span.is(":not(:visible)")) {
											span.show();
										};
									} else {
										if (span.is(":visible")) {
											span.hide();
										};
									};

									if (ORDER.goods.ord_goods[cart_seq].order_divi_cd == "10" || ORDER.goods.ord_goods[cart_seq].order_divi_cd == "30") {	//자동발주 상품(모던가구)는 배송희망일을 초기화 후 배송 희망일 조회
										(function() {
											var deli_select = $(":input[name='deli_hope_select'][dlvp_no='" + dlvp_no + "'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']");
											var post_no = dlvp.address.addr_divi_cd == "10" ? dlvp.address.recvr_post_no : dlvp.address.recvr_road_post_no;
											var start_date = deli_select.attr("start_date");
											var end_date = deli_select.attr("end_date");
											var week = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
											if (this.deli_hope_dtime != undefined && this.deli_hope_dtime != "") {
												this.deli_hope_dtime = "";											
											};
											
											deli_select.find("option:gt(0)").remove();
											if (post_no != "") {
												//배송 희망일 조회
												deli_select.attr({ msg: "배송희망일 조회 중 입니다." });
												$.ajax({
													url: "/order/getShoplinkDeliDates.action",
													data: { post_no: post_no, start_date: start_date, end_date: end_date },
													type: "POST",
													dataType: "json",
													success: function(req) {
														if(req.errCode == "SUCCESS") {
															var data = req.data;
															var yyyy = +start_date.substring(0, 4);
															var mm = +start_date.substring(4, 6);
															var day = +start_date.substring(6);
															var date;
															var options = $("<div></div>");
															for (var i = 0 ; ; i++) {
															
																date = new Date(yyyy, mm - 1, day);
																if (+date.format("yyyyMMdd") > +end_date) {
																	break;
																};
																options.append($("<option></option>").text(date.format("yyyy-MM-dd") + "(" + week[date.getDay()] + ")").val(date.format("yyyyMMdd")));
																day += 1;
															};
															
															deli_select.append(options.find("option"));		
															deli_select.find("option").each(function(){
											                	if($(this).attr("value") != ""){
												                	var iCnt = 0;
												                	for(var i=1;i<5;i++){
												                		var vPart = data[$(this).attr("value")]["Part"+i];
												                		if(vPart != undefined){
													                		$(this).attr("part"+i, vPart);	
												                			iCnt++;
												                		}
												                	}
												                    if(iCnt == 4) {
												                    	$(this).attr("disabled",true);
												                    }
												                    $(this).addClass("set");
											                	}
															});
														}
														// NGCPO-5919 [MO] 모던하우스 배송희망일 조회 API 메세지 처리 수정
														else if(req.errCode == "MH_FAIL") {
															alert("희망배송일을 조회할 수 없습니다.");
														}else{
															alert("배송이 불가능한 주소입니다. 도로명주소(신 우편번호)를 사용해주세요.");
														}
													},
													error: function() {
														alert("배송이 불가능한 주소입니다. 도로명주소(신 우편번호)를 사용해주세요.");
													},
													complete: function() {
														deli_select.removeAttr("msg");
													}
												});
											};
											
											var setDeliTimegb = function(e) {
											
												var seq = $(this).attr("cart_seq");
												$(".btn_"+seq).each(function(){
													$(this).removeClass("selected");
													
												});
												
												var yyyymmdd = e.target ? this.value : e.yyyymmdd ;
												ORDER.goods.ord_goods[seq].deli_time_gb = "";
												ORDER.goods.ord_goods[seq].deli_hope_dtime = yyyymmdd;
												
												var part1 = $(this).find(":selected").attr("part1");
												var part2 = $(this).find(":selected").attr("part2");
												var part3 = $(this).find(":selected").attr("part3");
												var part4 = $(this).find(":selected").attr("part4");

												if(part1 == "F") {$("#part1_"+cart_seq).attr("disabled",true).addClass("disabled");}else{$("#part1_"+cart_seq).removeAttr("disabled").removeClass("disabled");};
												if(part2 == "F") {$("#part2_"+cart_seq).attr("disabled",true).addClass("disabled");}else{$("#part2_"+cart_seq).removeAttr("disabled").removeClass("disabled");};
												if(part3 == "F") {$("#part3_"+cart_seq).attr("disabled",true).addClass("disabled");}else{$("#part3_"+cart_seq).removeAttr("disabled").removeClass("disabled");};
												if(part4 == "F") {$("#part4_"+cart_seq).attr("disabled",true).addClass("disabled");}else{$("#part4_"+cart_seq).removeAttr("disabled").removeClass("disabled");};
											};
											
											deli_select.change(setDeliTimegb);
											
											//희망배송일 시간기준추가
											$("button.deli_time_gb").unbind("click").click(function(){
												var dlvp_no = $(this).attr("dlvp_no");
												var dlvp_seq = $(this).attr("dlvp_seq");
												var seq = $(this).attr("cart_seq");
												
												var data = $(this).attr("data-seq");
												
												$(".btn_"+seq).each(function(){
													$(this).removeClass("selected");
													
												});
												$(this).addClass("selected");
						
												ORDER.goods.ord_goods[seq].deli_time_gb =  data;
												ORDER.dlvp.ord_dlvps[dlvp_no].ord_deli[dlvp_seq].ord_goods[seq].deli_time_gb = data;
												
											});
										})();
									};
								});
								if (deli) {
									r_deli_cost_amt = deli.r_deli_cost_amt ;
									if (deli.r_deli_coupon_promo_no != "") {	//배송비 쿠폰이 있음
										if (deli.coupon_use_yn == "Y") {	//배송비 쿠폰 사용
											r_deli_cost_amt = (dlvp.address.city_exp_yn != "Y" ? 0 : deli.r_city_exp_deli_cost);		//도서산간의 경우 도서 산간비 제외한 금액만 할인
										};	
									};
									if (r_deli_cost_amt > 0 && deli.r_city_exp_deli_cost > 0) {		//추가 배송비 있음										
										$.each(this.ord_goods, function(cart_seq) {
											if (this.deli_poss_yn == "Y" && this.ord_qty > 0) {
												extra_deli_goods.push(cart_seq);										
											};
										});
									};
								};
							});
							if (deli_poss_n_count > 0) {
								mainSpan.show();
							};						
						});
						//추가배송비 안내
						if (extra_deli_goods.length > 0) {		//추가 배송비가 발생한 상품
							alert((function() {
								var extra_goods_nms = "";
								$.each(extra_deli_goods, function(i, cart_seq) {
									extra_goods_nms += ("[" + ORDER.goods.ord_goods[cart_seq].disp_goods_nm + "]\n");
									if (i == 2) {
										return false;
									};
								});
								return extra_goods_nms + (extra_deli_goods.length > 3 ? "외 " + (extra_deli_goods.length - 3) + "개 상품은\n" : "") + "상품은 해당 배송지로 추가 배송비가 발생 합니다.";
							})()); 
						};
						ORDER.fn.lock = null;
					},
					error: function() {
						ORDER.fn.lock = null;
					}
				});				
			} catch (e) {}
		},
		addDlvpBaseYn: "N",
		changeQty: function(p) {	//배송지별 주문상품 수량변경
			var cart_seq = p.cart_seq;
			var goods = p.goods;
			var increase = p.button.attr("role");
			try {
				if (increase == "+") {
					if (ORDER.goods.ord_goods[cart_seq].remain_qty > 0) {
						ORDER.goods.ord_goods[cart_seq].remain_qty--;
						goods.ord_qty++;
						ORDER.goods.total_remain_qty--;
					} else {
						throw null;
					};
				} else {
					if (goods.ord_qty - 1 >= 0) {
						ORDER.goods.ord_goods[cart_seq].remain_qty++;
						goods.ord_qty--;
						ORDER.goods.total_remain_qty++;
					} else {
						throw null;
					};
				};
				p.callback();
			} catch (e) {};
		},
		addDigitalDlvp: function(p) {
			var div = p.div;
			var role = div.attr("role");
			ORDER.dlvp.add({
				cart_grp_cd: "20",
				dlvp: p.dlvp,
				callback: function(dlvp_no) {
					var dlvp = ORDER.dlvp.ord_dlvps[dlvp_no];
					var d = ORDER.dlvp.ord_dlvps[dlvp_no];
					dlvp.div = div;
					if (ORDER.fn.addDlvpBaseYn == "N") {
						ORDER.fn.addDlvpBaseYn = "Y";
						$.each(d.ord_deli, function(dlvp_seq) {	//기본 배송비 정보 셋팅
							$.each(d.ord_deli[dlvp_seq].ord_goods, function(cart_seq) {	//본 상품의 주문수량을 셋팅
								this.ord_qty = ORDER.goods.ord_goods[cart_seq].ord_qty;						
							});
						});
						//상품리스트 복사
						if (ORDER.goods.cart_count_digital_qty > 1 || ORDER.goods.cart_count_formless_qty > 1) {
							var dlvp_div = div.find("div[role='digital_dlvp_div']");
							$("div.basket_txt").clone().each(function() {
								var div_txt = $(this);
								var cart_seq = div_txt.attr("cart_seq"); 
								var div_prd = $("<div></div>").addClass("count").hide();
								var div_numb = $("<div></div>").addClass("numbox");
								//감소버튼
								$("<span class='minus' name='increase_qty_button' role='-'><img src='" + elandmall.global.image_path + "/images/mobile/order/bts_minus_default.png' alt='삭제'></span>").attr({ cart_seq: cart_seq }).appendTo(div_numb);	//비활성
								$("<a href='#' class='minus' name='increase_qty_button' role='-'><img src='" + elandmall.global.image_path + "/images/mobile/order/bts_minus.png' alt='삭제' /></a>").attr({ cart_seq: cart_seq }).hide().appendTo(div_numb);	//활성
								
								$("<input type='text' name='ord_qty' class='inp_txt' value='1' title='수량' readonly='readonly' >").attr({ cart_seq: cart_seq }).appendTo(div_numb);
								
								//증가버튼
								$("<span class='plus' name='increase_qty_button' role='+'><img src='" + elandmall.global.image_path + "/images/mobile/order/bts_plus_default.png' alt='추가' /></span>").attr({ cart_seq: cart_seq }).appendTo(div_numb);	//비활성
								$("<a href='#' class='plus' name='increase_qty_button' role='+'><img src='" + elandmall.global.image_path + "/images/mobile/order/bts_plus.png' alt='추가'></a>").attr({ cart_seq: cart_seq }).hide().appendTo(div_numb);	//활성
								
								$("<span class='surplus'>남은수량 : <b>(0)개</b></span>").attr({ cart_seq: cart_seq }).appendTo(div_numb);
								div_prd.append(div_txt);
								div_prd.append(div_numb);
								dlvp_div.append(div_prd);
							});						
						};
					};
					div.attr({ dlvp_no: dlvp_no });
					div.find("em.ico").text("(" + dlvp_no + "번) ");
					
					if (role == "added") {
						div.find("a[role='choose_dlvp_radio']").each(function() {
							var a = $(this);
							var value = a.attr("value");
							if (value == "self") {
								a.parent().removeClass("selected");
							} else {
								a.parent().addClass("selected");
							};
							div.find("ul[name='digital_dlvp_ul_self']").hide();
							div.find("ul[name='digital_dlvp_ul_gift']").show();
						});
						div.find(":input[default='Y']").val("");
					};
					
					//수량변경 버튼 처리
					$.each(dlvp.ord_deli, function(vir_vend_no) {
						var ord_goods = this.ord_goods;
						$.each(ord_goods, function(cart_seq) {
							var goods = this;
							var ord_qty_input = div.find(":input[name='ord_qty'][cart_seq='" + cart_seq + "']");
							div.find("a[name='increase_qty_button'][cart_seq='" + cart_seq + "']").unbind("click").click(function(e) {
								var button = $(this);
								e.preventDefault();
								ORDER.fn.changeQty({
									button: button,
									goods: goods,
									cart_seq: cart_seq,
									callback: function() {
										var remain_qty = $("span.surplus[cart_seq='" + cart_seq + "'] b");
										ord_qty_input.val(goods.ord_qty);
										remain_qty.html("(" + ORDER.goods.ord_goods[cart_seq].remain_qty + ")개");
										if (goods.ord_qty > 0) {	//-활성화
											div.find("span.minus[cart_seq='" + cart_seq + "']").hide();
											div.find("a.minus[cart_seq='" + cart_seq + "']").show();
										} else {	//-비활성
											div.find("span.minus[cart_seq='" + cart_seq + "']").show();
											div.find("a.minus[cart_seq='" + cart_seq + "']").hide();
										};
										
										if (ORDER.goods.ord_goods[cart_seq].remain_qty > 0) {	//+활성화
											$("span.plus[cart_seq='" + cart_seq + "']").hide();
											$("a.plus[cart_seq='" + cart_seq + "']").show();
										} else {	//+비활성화
											$("span.plus[cart_seq='" + cart_seq + "']").show();
											$("a.plus[cart_seq='" + cart_seq + "']").hide();
										};
									}
								});
							});
						});
					});
					
					//선물/본인 라디오
					div.find("[role='choose_dlvp_radio']").unbind("click").click(function() {
						var radio = $(this);
						var gb = radio.attr("value");
						var address = { recvr_nm: "", recvr_cell_no1: "", recvr_cell_no2: "", recvr_cell_no3: "" };
						if (radio.parent().hasClass("selected") === true) {
							return false;
						};
						radio.parent().parent().find("li.selected").removeClass("selected");
						radio.parent().addClass("selected");
						if (gb == "self") {
							div.find("div[role='digital_dlvp_div']").removeClass("shipping_new").addClass("shipping");
							div.find("ul[name='digital_dlvp_ul_self']").show();
							div.find("ul[name='digital_dlvp_ul_gift']").hide();
							address.recvr_nm = ORDER.mst.ord_mst.orderer_nm;
							address.recvr_cell_no1 = ORDER.mst.ord_mst.cell_no1;
							address.recvr_cell_no2 = ORDER.mst.ord_mst.cell_no2;
							address.recvr_cell_no3 = ORDER.mst.ord_mst.cell_no3;
						} else {
							div.find("div[role='digital_dlvp_div']").addClass("shipping_new").removeClass("shipping").show();
							div.find("ul[name='digital_dlvp_ul_self']").hide();
							div.find("ul[name='digital_dlvp_ul_gift']").show();
							div.find(":input[default='Y']").val("");
						};
						dlvp.setAddress(address);
					});
				}
			});
		},
		addDlvp: function(p) {
			p = $.extend({ cart_grp_cd: "10" }, p);
			var div = p.div;
			var dlvp = p.dlvp || {};
			ORDER.dlvp.add({
				cart_grp_cd: p.cart_grp_cd,
				dlvp: p.dlvp,
				getOrdMemo: function() {
					var role = $("#ord_memo_cont_select, #ord_memo_cont_select_new").filter(":visible").attr("role");
					return role == "my" ? $("#ord_memo_cont").val() : $("#ord_memo_cont_new").val() ;;
				},
				getCustomsId: function() {
					var role = $("#customs_id, #customs_id_new").filter(":visible").attr("role");
					return role == "my" ? $("#customs_id").val() : $("#customs_id_new").val() ;
				}, 
				callback: function(dlvp_no) {
					var dlvp = ORDER.dlvp.ord_dlvps[dlvp_no];
					var dlvp = (function() {
						var d = ORDER.dlvp.ord_dlvps[dlvp_no];
						// 산지직송일 경우 addDlvpBaseYn N으로 초기화
						if (p.cart_grp_cd == '80') {
							ORDER.fn.addDlvpBaseYn = "N";
						}
						if (ORDER.fn.addDlvpBaseYn == "N") {
							ORDER.fn.addDlvpBaseYn = "Y";	
							$.each(dlvp.ord_deli, function(dlvp_seq) {	//기본 배송비 정보 셋팅
								// 산지직송
								var deli;
								if(p.cart_grp_cd == '80') {
									deli = ORDER.deli.fresh_deli[dlvp_seq];
								} else {
									deli = ORDER.deli.ord_deli[dlvp_seq];
								}
								dlvp.ord_deli[dlvp_seq].deli = {
									deli_cost_amt: deli.deli_cost_amt,
									deli_cost_limit_amt: deli.deli_cost_limit_amt,
									r_deli_cost_poli_no: deli.r_deli_cost_poli_no,
									r_city_exp_deli_cost: deli.r_city_exp_deli_cost,
									r_deli_cost_amt: deli.r_deli_cost_amt,
									r_deli_cost_form_cd: deli.r_deli_cost_form_cd,
									st_amt: deli.st_amt,
									r_deli_coupon_promo_no: deli.r_deli_coupon_promo_no,
									r_deli_coupon_promo_nm: deli.r_deli_coupon_promo_nm,
									r_deli_coupon_aval_end: deli.r_deli_coupon_aval_end,
									r_deli_coupon_rsc_no: deli.r_deli_coupon_rsc_no,
									coupon_use_yn: (deli.r_deli_coupon_promo_no != "" && deli.r_deli_coupon_rsc_no != "") ? "Y" : "N",
									free_use_pnt: deli.free_use_pnt,
									gift_use_pnt: deli.gift_use_pnt,
									study_use_pnt: deli.study_use_pnt
								};
								$.each(dlvp.ord_deli[dlvp_seq].ord_goods, function(cart_seq) {	//본 상품의 주문수량을 셋팅
									this.ord_qty = ORDER.goods.ord_goods[cart_seq].ord_qty;						
								});
							});
							if (!ORDER.mst.nomember && ORDER.dlvp.base_dlvp.mbr_dlvp_seq != "") {
								$("#address_select_tab").find(">li[role='base']").click();	//기본 배송지 클릭	
							} else {
								$("#address_select_tab").find(">li[role='new']").click();	//새로운 배송지 클릭
							};
						};
						return d;
					})();
					var address = ORDER.dlvp.ord_dlvps[dlvp_no].address;
					var address_select_tab_li = $("#address_select_tab").find("li");
					var address_select_div = $("div[name='address_select_div']");
					var ord_memo_cont = $("#ord_memo_cont, #ord_memo_cont_new");
					var ord_memo_cont_select = $("#ord_memo_cont_select, #ord_memo_cont_select_new");
					var ord_memo_text_div = $("#ord_memo_text_div, #ord_memo_text_div_new");					
					var changeOrdMemoSelect = function(e, role) {
						var role = e ? $(this).attr("role") : role ;
						var text_div = ord_memo_text_div.filter("[role='" + role + "']");
						var select = ord_memo_cont_select.filter("[role='" + role + "']");
						var memo = ord_memo_cont.filter("[role='" + role + "']");
						text_div.show().find("span").text(select.find(":selected").text());
						if (select.val() == "direct") {
							memo.val("");
							memo.show();
						} else {
							if (ord_memo_cont_select.val() == "none") {
								memo.val("");
								memo.hide();
							} else {
								memo.val(select.find(":selected").text());								
							};
							memo.hide();
						};
						elandmall.util.ga("MW_주문서 작성", "1. 배송정보", memo.val());
					};
					ord_memo_cont_select.unbind("change").change(changeOrdMemoSelect);
					var setDeliMesage = function(role, message) {
						var result = false;
						var select = ord_memo_cont_select.filter("[role='" + role + "']");
						select.find("option[value='my']").remove();
						if (message != "") {
							select.find("option:contains('" + message + "')").each(function() {
								if ($(this).text() == $.trim(message)) {
									result = true;
									return false;
								};
							}).prop("selected", true);
							if (result === false) {
								select.find("option:eq('" + (select.find("option").length - 1) + "')").before($("<option>" + message + "</option>").attr("value", "my").prop("selected", true));
							};
						} else {
							select.val("none");
						};
						changeOrdMemoSelect(undefined, role);
					};
					var applied_role = undefined;
					var check_default_dlvp_base = $("#check_default_dlvp_base");
					var addressRadioClick = function(e) {	//배송지, 새로운 배송지 탭 클릭시
						var role_change = false;
						var li = e.target ? $(this) : address_select_tab_li.filter("[role='base']") ;
						var role = (function() {
							if (e.target) {	//탭클릭
								e.preventDefault();
								return li.attr("role");
							} else {								
								if (e.base_yn == "Y") {
									return "base";
								} else {
									return "my";
								};	
							};
						})();	
						var address = undefined;
						li.attr("role_value", role);
						check_default_dlvp_base.prop("checked", false);
						if (role == "my") {
							check_default_dlvp_base.parent().show();
						} else {
							check_default_dlvp_base.parent().hide();
						};
						if (applied_role !== role) {
							role_change = true;
						};						
						applied_role = role;
						
						if (role == "my" || role_change) {
							address_select_tab_li.filter(".selected").removeClass("selected");
							li.addClass("selected");
							
							address_select_div.filter("[role='" + (role == "my" ? "base" : role) + "']").show();
							address_select_div.filter(":not([role='" + (role == "my" ? "base" : role) + "'])").hide();
							
							if (role == "new") {
								address_select_div.filter(".shipping_new").find(":input[default='Y']").val("");	//필드 초기화
								address_select_div.filter(".shipping_new").find(":checkbox[default='Y']").prop("checked", false);
								$("#recvr_addr_text").text("");
								$("#new_recvr_addr_1").val("").parent().parent().hide();
								$("#apply_orderer_info_button").prop("checked", false);
								$("#apply_orderer_info_span").show();								
								dlvp.setAddress(address);
							} else {
								$("#apply_orderer_info_span").hide();
								if (role == "base") {
									address = ORDER.dlvp.base_dlvp;
								} else if (role == "my") {
									address = e;
									delete address.base_yn ;
								};
								dlvp.setAddress(address);								
							};
							setDeliMesage(address ? "my" : "new" , address ? address.deli_msg : "" );
						};
						ORDER.fn.getDeliInfo();		//배송비 재조회 및 화면 갱신
					};
					dlvp.div = div;
					
					//배송지, 새로운 배송지
					address_select_tab_li.click(addressRadioClick);
					if (div.attr("role") == "default") {
						if (address_select_tab_li.filter("[role='base']").is(":visible") || dlvp.cart_grp_cd == '60' || dlvp.cart_grp_cd == '70') {
							address_select_tab_li.filter("[role='base']").click();	//기본 배송지 클릭
						} else {
							address_select_tab_li.filter("[role='new']").click();	//새로운 배송지 클릭
						};
					};
					
					p.div.find("div[name='dlvp_nm']").contents().filter(function() {	//해당 div안에 있는 텍스만 지우기
						return this.nodeType == 3;
					}).remove();
					p.div.find("div[name='dlvp_nm']").append(address.dlvp_nm);
					p.div.find("div[name='recvr_nm']").text(address.recvr_nm);
					if ($.trim(address.recvr_tel1) + "" + $.trim(address.recvr_tel2) + "" + $.trim(address.recvr_tel3) !=  "" && $.trim(address.recvr_tel1) != null && $.trim(address.recvr_tel1) != "null") {
						p.div.find("div[name='recvr_tel']").text(address.recvr_tel1 + "-" + address.recvr_tel2 + "-" + address.recvr_tel3);		
						/*if($.trim(p.div.find("div[name='recvr_tel']").text()) != ""){
							p.div.find("div[name='recvr_tel']").siblings("em").show();
						}*/
					}else{
						p.div.find("div[name='recvr_tel']").text('');
					};
					if ($.trim(address.recvr_cell_no1) + "" + $.trim(address.recvr_cell_no2) + "" + $.trim(address.recvr_cell_no3) !=  "" && $.trim(address.recvr_cell_no1) != null && $.trim(address.recvr_cell_no1) != "null") {
						p.div.find("div[name='recvr_cell_no']").text(address.recvr_cell_no1 + "-" + address.recvr_cell_no2 + "-" + address.recvr_cell_no3);
						if($.trim(address.recvr_cell_no1) != "null" && $.trim(address.recvr_tel1) != "null" && $.trim(address.recvr_cell_no1)!= "" && $.trim(address.recvr_tel1) != ""){
							var temp_cell_no = p.div.find("div[name='recvr_cell_no']").text() + "　/　" ;
							p.div.find("div[name='recvr_cell_no']").text(temp_cell_no);
						}
					}else{
						p.div.find("div[name='recvr_cell_no']").text('');
					};
					if (address.addr_divi_cd == "20") {
						p.div.find("div[name='recvr_addr']").text("[" + address.recvr_road_post_no + "] " + address.recvr_road_base_addr + " " + address.recvr_road_dtl_addr);
					} else {
						p.div.find("div[name='recvr_addr']").text("[" + address.recvr_post_no + "] " + address.recvr_base_addr + " " + address.recvr_dtl_addr);						
					};
					if ($("#deli_addr_area").length == 1) {
						if(ORDER.mst.ord_mst.present_yn != "Y") { //선물하기 주소 숨김
							$("#recvr_addr_text").text(address.addr_divi_cd == "10" ? address.recvr_base_addr + " " + address.recvr_dtl_addr : address.recvr_road_base_addr + " " + address.recvr_road_dtl_addr);
						}
					} else {
						$("#recvr_addr_text").text(ORDER.mst.ord_mst.orderer_nm + " / " + ORDER.mst.ord_mst.cell_no1 + "-" + ORDER.mst.ord_mst.cell_no2 + "-" + ORDER.mst.ord_mst.cell_no3);
					};
					if (ORDER.fn.order_gift_count > 0) {
						$("#order_gift_div").show();
					};
					$("#apply_orderer_info_button").click(function() {
						if (this.checked) {
							if ($("#new_orderer_nm").is(":visible")) {
								if ($.trim($("#new_orderer_nm").val()) != "") {
									$("#new_recvr_nm").val($("#new_orderer_nm").val());
								};
								try {
									$(":input[name='new_cell_no']").each(function(i) {								
										if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {									
											throw undefined;
										};								
									});
									$("#recvr_cell_no1").val($("#new_cell_no1").val());
									$("#recvr_cell_no2").val($("#new_cell_no2").val());
									$("#recvr_cell_no3").val($("#new_cell_no3").val());
								} catch (e) {};								
							} else {
								$("#new_recvr_nm").val(ORDER.mst.ord_mst.orderer_nm);
								$("#recvr_cell_no1").val(ORDER.mst.ord_mst.cell_no1);
								$("#recvr_cell_no2").val(ORDER.mst.ord_mst.cell_no2);
								$("#recvr_cell_no3").val(ORDER.mst.ord_mst.cell_no3);
							};
						};
					});
					$("#address_layer_button").click(function(e) {
						e.preventDefault();
						elandmall.popup.postLayer({
							callback: function(addr) {
								dlvp.setAddress({
									addr_divi_cd: addr.addr_gb,
									city_exp_yn: addr.city_exp_yn,
									recvr_post_no: addr.j_post_no,
									recvr_base_addr: addr.j_base_addr,
									recvr_dtl_addr: addr.j_dtl_addr,
									recvr_road_post_no: addr.r_post_no,
									recvr_road_base_addr: addr.r_base_addr,
									recvr_road_dtl_addr: addr.r_dtl_addr										
								});

								//10(지번)/20(도로명)
								if(addr.addr_gb=='10' && $.trim(addr.j_post_no) != "" && $.trim(addr.j_base_addr) != ""){ 									
									$("#new_recvr_post_no").val(addr.j_post_no);
									$("#new_recvr_addr_1").val(addr.j_base_addr).parent().parent().show();
									$("#new_recvr_addr_2").val(addr.j_dtl_addr)
										.attr('readonly', false)
										.parent().parent().show();
								} else if(addr.addr_gb=='20' && $.trim(addr.r_post_no) != "" && $.trim(addr.r_base_addr) != "") {
									$("#new_recvr_post_no").val(addr.r_post_no);
									$("#new_recvr_addr_1").val(addr.r_base_addr).parent().parent().show();
									$("#new_recvr_addr_2").val(addr.r_dtl_addr)
										.attr('readonly', false)
										.parent().parent().show();
								}
								ORDER.fn.getDeliInfo();
							}
						});
					});
					p.div.find("p[name='deli_poss_yn_p']").attr("dlvp_no", dlvp_no);				
					$("#my_dlvp_list_button").click(function(e) {
						var param = address_select_tab_li.filter(":eq(0)").attr("my") != "Y" ? { base_yn: "N" } : {} ;
						e.preventDefault();
						ORDER.fn.loginCheck(function() {
							elandmall.popup.myDlvpListLayer({									
								callback: function(data) {
									ORDER.fn.updateBlock = true;
									p.div.find("div[name='dlvp_nm']").contents().filter(function() {	//해당 div안에 있는 텍스만 지우기
										return this.nodeType == 3;
									}).remove();
									if ($.trim(data.dlvp_nm) == "") {
										p.div.find("div[name='dlvp_nm']").append("미지정");
									} else {
										p.div.find("div[name='dlvp_nm']").append(data.dlvp_nm);
									};
									p.div.find("div[name='recvr_nm']").text(data.name);
									if ($.trim(data.tel_no1) + "" + $.trim(data.tel_no2) + "" + $.trim(data.tel_no3) !=  "" && $.trim(data.tel_no1) != null && $.trim(data.tel_no1) != "null") {
										p.div.find("div[name='recvr_tel']").text(data.tel_no1 + "-" + data.tel_no2 + "-" + data.tel_no3);						
									}else{
										p.div.find("div[name='recvr_tel']").text('');
									}
									if ($.trim(data.cel_no1) + "" + $.trim(data.cel_no2) + "" + $.trim(data.cel_no3) !=  "" && $.trim(data.cel_no1) != null && $.trim(data.cel_no1) != "null") {
										p.div.find("div[name='recvr_cell_no']").text(data.cel_no1 + "-" + data.cel_no2 + "-" + data.cel_no3);
										if($.trim(data.cel_no1)!= "null" && $.trim(data.tel_no1) != "null" && $.trim(data.cel_no1)!= "" && $.trim(data.tel_no1) != ""){
											var temp_cell_no = p.div.find("div[name='recvr_cell_no']").text() + "　/　" ;
											p.div.find("div[name='recvr_cell_no']").text(temp_cell_no);
										}
									}else{
										p.div.find("div[name='recvr_cell_no']").text('');	
									}
									if ($.trim(data.r_base_addr) != "" && $.trim(data.r_dtl_addr) != "") {
										p.div.find("div[name='recvr_addr']").text("[" + data.r_post_no + "] " + data.r_base_addr + " " + data.r_dtl_addr);
										$("#recvr_addr_text").text(data.r_base_addr + " " + data.r_dtl_addr);
									} else {
										p.div.find("div[name='recvr_addr']").text("[" + data.j_post_no + "] " + data.j_base_addr + " " + data.j_dtl_addr);
										$("#recvr_addr_text").text(data.j_base_addr + " " + data.j_dtl_addr);
									};
									addressRadioClick({
										addr_divi_cd: data.addr_divi_cd,
										base_yn: data.base_yn,
										city_exp_yn: data.city_exp_yn,									
										dlvp_nm: data.dlvp_nm,
										dlvp_no: dlvp_no,
										mbr_dlvp_seq: data.mbr_dlvp_seq,				
										recvr_tel1: data.tel_no1,
										recvr_tel2: data.tel_no2,
										recvr_tel3: data.tel_no3,
										recvr_cell_no1: data.cel_no1,
										recvr_cell_no2: data.cel_no2,
										recvr_cell_no3: data.cel_no3,
										recvr_post_no: data.j_post_no,
										recvr_base_addr: data.j_base_addr,
										recvr_dtl_addr: data.j_dtl_addr,											
										recvr_nm: data.name,
										recvr_road_post_no: data.r_post_no,
										recvr_road_base_addr: data.r_base_addr,
										recvr_road_dtl_addr: data.r_dtl_addr,
										recvr_email: data.email,
										deli_msg: data.deli_msg
									});
									ORDER.fn.updateOrderSheet(false);	//주소지 변경으로 인한 배송비 재 반영
								}
							});
						});
					});
					
					div.find(":input[name='ord_memo_cont']").unbind("blur").blur(function() {
						if ( $(this).attr("deli_hope_api_yn") == "Y"){
							elandmall.util.toSpCharRemove($(this));	// 특수문자 제거
						}
					});
					
					//S:바후스 가구약관 동의 
					//1.사다리차
					var ord_chk_ladder = div.find(":input[name='chk_ladder']").attr("dlvp_no", dlvp_no);
					ord_chk_ladder.unbind("change").change(function(){
						ORDER.dlvp.ord_dlvps[dlvp_no].laddercar_yn = $(this).is(":checked") ? "Y":"N";
					
					});
					
					
					//2.엘리베이터 유무
					
					div.find(".btn_ev").each(function(){
						$(this).click(function(){
							var sVal = $(this).attr("data-value");
							
							if($(this).hasClass("elve_rdo")) {
								div.find(".elve_rdo.selected").removeClass("selected");
								$(this).addClass("selected");
								
								ORDER.dlvp.ord_dlvps[dlvp_no].elevator_yn =sVal;
	
				
							}else if($(this).hasClass("fixed_w_rdo")) {
								div.find(".fixed_w_rdo.selected").removeClass("selected");
								$(this).addClass("selected");
								ORDER.dlvp.ord_dlvps[dlvp_no].wellanchor_yn =sVal;
								
							}
						});

					});
					
						
					//4.가구배송약관
					var ord_chk_user_term = div.find(":input[name='chk_user_term']").attr("dlvp_no", dlvp_no);
					ord_chk_user_term.unbind("change").change(function(){
						ORDER.dlvp.ord_dlvps[dlvp_no].chk_user_term = $(this).is(":checked");
						
					});
					
					
					//E:바후스 가구약관 동의
					
					
					if ($.type(p.callback) == "function") {
						p.callback(dlvp);
					};
				}
			});
		},
		resetOrdDigitalQty: function() {	//디지털 상품권 상품수량 초기화(기본배송지 -> 본 주문 상품 수량으로, 나머지는 0으로 설정)
			$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
				var div = $("div[name='dlvp_gift_area'][dlvp_no='" + dlvp_no + "']");
				var ord_qty_input = div.find(":input[name='ord_qty']");
				var role = div.attr("role");
				$.each(this.ord_deli, function(vir_vend_no) {
					$.each(this.ord_goods, function(cart_seq) {
						this.ord_qty = 0;
						if (role == "default") {		//기본배송지
							this.ord_qty = ORDER.goods.ord_goods[cart_seq].ord_qty;
							ORDER.goods.ord_goods[cart_seq].remain_qty = 0;
							
							div.find("span.minus[cart_seq='" + cart_seq + "']").hide();
							div.find("a.minus[cart_seq='" + cart_seq + "']").show();
						} else {
							div.find("span.minus[cart_seq='" + cart_seq + "']").show();
							div.find("a.minus[cart_seq='" + cart_seq + "']").hide();
						};
						div.find("span.plus[cart_seq='" + cart_seq + "']").show();
						div.find("a.plus[cart_seq='" + cart_seq + "']").hide();
						ord_qty_input.filter("[cart_seq='" + cart_seq + "']").val(this.ord_qty);						
					});
				});
				div.find("span.surplus b").text("(0)개");				
			});
			ORDER.goods.total_remain_qty = 0;
		}
	});	
});