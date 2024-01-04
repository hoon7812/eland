/**
 * 배송지/배송비 관련 함수 모음 
 */
$(document).ready(function() {
	if (!ORDER.fn) {
		ORDER.fn = {};
	};
	$.extend(ORDER.fn, {
		deliBlock: false,	//배송비 중복 조회 방지		
		getDeliInfo: function(b) {			
			if (ORDER.fn.deliBlock && b !== false) {
				return false;
			};
			if (b === false) {	//강제 실행
				ORDER.fn.deliBlock = false;
			};		
			try {
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
						var mainSpan = $("span[name='deli_poss_yn_span'][role='main']");
						ORDER.fn.updateOrderSheet();
						
						if (dlvp_count > 1) { 
							mainSpan.filter(":visible").hide();
						};
						$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
							var dlvp = this;						
							var deli_poss_n_count = 0;	//배송불가 포함여부 확인용
							var deliSpan;
							var div = dlvp.div;
							if (!div) {
								return true;
							};
							deliSpan = div.find("span[name='deli_poss_yn_span'][role='deli']");
							$.each(this.ord_deli, function(dlvp_seq) {
								var deli = this.deli;
								var r_deli_cost_amt = 0;
								$.each(this.ord_goods, function(cart_seq) {
									if (this.deli_poss_yn == "N") {	//배송불가
										if (dlvp_count == 1) {
											if (!mainSpan.filter("[cart_seq='" + cart_seq + "']").is(":visible")) {
												mainSpan.filter("[cart_seq='" + cart_seq + "']").show();
											};										
										} else {
											if (!deliSpan.filter("[dlvp_no='" + dlvp_no + "'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']").is(":visible")) {
												deliSpan.filter("[dlvp_no='" + dlvp_no + "'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']").show();
											};
										};
										deli_poss_n_count++;
									} else {
										if (dlvp_count == 1) {
											if (mainSpan.filter("[cart_seq='" + cart_seq + "']").is(":visible")) {
												mainSpan.filter("[cart_seq='" + cart_seq + "']").hide();
											};										
										} else {
											if (deliSpan.filter("[dlvp_no='" + dlvp_no + "'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']").is(":visible")) {
												deliSpan.filter("[dlvp_no='" + dlvp_no + "'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']").hide();
											};
										};
									};
									if (ORDER.goods.ord_goods[cart_seq].order_divi_cd == "10" || ORDER.goods.ord_goods[cart_seq].order_divi_cd == "30") {	//자동발주 상품(모던가구)는 배송희망일을 초기화 한다.
										if (this.deli_hope_dtime != undefined && this.deli_hope_dtime != "") {
											div.find(":input[name='deli_hope_calendar_input'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']").val("");
											this.deli_hope_dtime = "";											
										};
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
								if (dlvp_count == 1) {
									div.find("p[name='deli_poss_yn_p']>button").show();	
								} else {
									div.find("p[name='deli_poss_yn_p']>button").hide();
								};
								div.find("p[name='deli_poss_yn_p']").show();
							} else {
								div.find("p[name='deli_poss_yn_p']").hide();
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
					if (ORDER.fn.addDlvpBaseYn == "N") {
						ORDER.fn.addDlvpBaseYn = "Y";
						$.each(d.ord_deli, function(dlvp_seq) {	//기본 배송비 정보 셋팅
							$.each(d.ord_deli[dlvp_seq].ord_goods, function(cart_seq) {	//본 상품의 주문수량을 셋팅
								this.ord_qty = ORDER.goods.ord_goods[cart_seq].ord_qty;						
							});
						});
					};
					
					div.attr({ dlvp_no: dlvp_no });
					div.find("b[name='dlvp_no']").text("(" + dlvp_no + "번) ");
					div.find("#digital_dlvp_radio_self_1").attr({ dlvp_no: dlvp_no, name: "digital_dlvp_radio_" + dlvp_no, id: "digital_dlvp_radio_self_" + dlvp_no }).parent().prop({ "for": "digital_dlvp_radio_self_" + dlvp_no });
					div.find("#digital_dlvp_radio_gift_1").attr({ dlvp_no: dlvp_no, name: "digital_dlvp_radio_" + dlvp_no, id: "digital_dlvp_radio_gift_" + dlvp_no }).parent().prop({ "for": "digital_dlvp_radio_gift_" + dlvp_no });
					if (role == "default") {
						div.find("tr[name='digital_dlvp_tr_self']").show();
						div.find("tr[name='digital_dlvp_tr_gift']").hide();						
					} else {
						div.find("#new_order_tr").remove();
						div.find("tr[name='digital_dlvp_tr_self']").hide();
						div.find("tr[name='digital_dlvp_tr_gift']").show();
						div.find(":input[default='Y']").val("");
						div.find(":input[role='choose_dlvp_radio']").each(function() {
							this.checked = this.value == "self" ? false : true ;
						});
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
										var remain_qty = $("span[name='remain_ord_qty'][cart_seq='" + cart_seq + "']");
										
										ord_qty_input.val(goods.ord_qty);
										if (ORDER.goods.ord_goods[cart_seq].remain_qty == 0) {
											remain_qty.addClass("none");
											remain_qty.html("남은수량 (" + ORDER.goods.ord_goods[cart_seq].remain_qty + "개)<br>수량 없음");
										} else {
											remain_qty.removeClass("none");
											remain_qty.html("남은수량 (" + ORDER.goods.ord_goods[cart_seq].remain_qty + "개)<br>선택가능");
										};
										div.find("button[role='reset_dlvp_button']").unbind("click").click(function() {
											ORDER.fn.resetOrdDigitalQty();										
										});
										
										// 개인통관고유부호
										var customsTr = div.find("tr[name='customsId_tr']").attr("dlvp_no", dlvp_no);										
										if(ORDER.goods.ord_goods[cart_seq].custom_clearance_yn	== "Y" ){											
											if(goods.ord_qty > 0){
												customsTr.show();		
											}else{
												customsTr.hide();	
											}
										}									
									}
								});
							});
						});
					});
					//선물/본인 라디오
					div.find(":input[role='choose_dlvp_radio']").unbind("change").change(function() {
						var gb = this.value;
						var address = { recvr_nm: "", recvr_cell_no1: "", recvr_cell_no2: "", recvr_cell_no3: "" };
						if (gb == "self") {
							div.find("tr[name='digital_dlvp_tr_self']").show();
							div.find("tr[name='digital_dlvp_tr_gift']").hide();
							address.recvr_nm = ORDER.mst.ord_mst.orderer_nm;
							address.recvr_cell_no1 = ORDER.mst.ord_mst.cell_no1;
							address.recvr_cell_no2 = ORDER.mst.ord_mst.cell_no2;
							address.recvr_cell_no3 = ORDER.mst.ord_mst.cell_no3;
						} else {
							div.find("tr[name='digital_dlvp_tr_self']").hide();
							div.find("tr[name='digital_dlvp_tr_gift']").show();
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
			var selected_address_role = "";
			ORDER.dlvp.add({
				cart_grp_cd: p.cart_grp_cd,
				dlvp: p.dlvp,
				getOrdMemo: function() {
					var ord_memo_cont = div.find(":input[name='ord_memo_cont']");
					if (ord_memo_cont.length == 1) {
						return ord_memo_cont.val();
					};
				},
				getCustomsId: function() {
					var ord_customs_id = div.find(":input[name='customs_id']");
					if (ord_customs_id.length == 1) {
						return ord_customs_id.val();
					};
				},
				callback: function(dlvp_no) {
					var dlvp = (function() {
						var d = ORDER.dlvp.ord_dlvps[dlvp_no];
						// 산지직송일 경우 addDlvpBaseYn N으로 초기화
						if (p.cart_grp_cd == '80') {
							ORDER.fn.addDlvpBaseYn = "N";
						}
						if (ORDER.fn.addDlvpBaseYn == "N") {
							ORDER.fn.addDlvpBaseYn = "Y";

							$.each(d.ord_deli, function(dlvp_seq) {	//기본 배송비 정보 셋팅
								var deli;
								if(p.cart_grp_cd == '80') { // 산지직송
									deli = ORDER.deli.fresh_deli[dlvp_seq];
								} else { // 일반배송
									deli = ORDER.deli.ord_deli[dlvp_seq];
								}

								d.ord_deli[dlvp_seq].deli = {
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
								$.each(d.ord_deli[dlvp_seq].ord_goods, function(cart_seq) {	//본 상품의 주문수량을 셋팅
									this.ord_qty = ORDER.goods.ord_goods[cart_seq].ord_qty;
								});
							});
						};
						return d;
					})();
					var ord_memo_cont = div.find(":input[name='ord_memo_cont']").attr("dlvp_no", dlvp_no);
					var ord_memo_cont_div = div.find("div[name='ord_memo_cont_div']").attr("dlvp_no", dlvp_no);
					var ord_memo_cont_select = div.find(":input[name='ord_memo_cont_select']").attr("dlvp_no", dlvp_no);
					var changeOrdMemoSelect = function() {
						if (ord_memo_cont_select.val() == "direct") {
							ord_memo_cont.val("");
							ord_memo_cont_div.show();
						} else {
							if (ord_memo_cont.is(":visible")) {
								ord_memo_cont_div.hide();
							};
							if (ord_memo_cont_select.val() == "none") {
								ord_memo_cont.val("");
								ord_memo_cont_div.hide();
							} else {
								ord_memo_cont.val(ord_memo_cont_select.find(":selected").text());	
							};
						};
					};
					ord_memo_cont_select.unbind("change").change(changeOrdMemoSelect);
					var setDeliMesage = function(message) {
						var result = false;						
						ord_memo_cont_select.find("option[value='my']").remove();
						if (message != "") {
							ord_memo_cont_select.find("option:contains('" + message + "')").each(function() {
								if ($(this).text() == $.trim(message)) {
									result = true;
									return false;
								};
							}).prop("selected", true);
							if (result === false) {
								ord_memo_cont_select.find("option:eq('" + (ord_memo_cont_select.find("option").length - 1) + "')").before($("<option>" + message + "</option>").attr("value", "my"));
								ord_memo_cont_select.val("my");
							};
						} else {
							ord_memo_cont_select.val("none");
						};
						changeOrdMemoSelect();
					};
					var addressRadioClick = function(e) {	//기본/신규 배송지 라디오 버튼 클릭시
						var role = (function() {
							if (e.target) {
								return e.target.value;
							} else if (e.base_yn == "Y") {
								if (div.find(":radio[role='select_address_radio'][value='base']").is(":not(:checked)")) {
									div.find(":radio[role='select_address_radio'][value='base']").prop("checked", true);
								};
								return "base";
							} else {
								return "my";
							};
						})() ;
						div.find("div.box_calendar").each(function() {
							var calendar = $(this);
							if (calendar.hasClass("on")) {
								calendar.removeClass("on").addClass("off");
								calendar.empty();								
							};
						});
						//div.box_calendar
						if (role != "my" && selected_address_role == role) {	//바뀐게 없는데 똑같은 짖 하지 말자...
							return false;
						};
						selected_address_role = role;							
						if (role == "base" || role == "my") {	//기본배송지 또는 배송지 목록에서 선택해서 왔을 경우
							var address = role == "base" ? ORDER.dlvp.base_dlvp : e ;
							var customsId = ORDER.mst.ord_mst.customs_id;
							var cel_no = "";
							var tel_no = "";
							var recvr_address = "";
							dlvp.setAddress(address);
							div.find("tr[name='address_tr'][role='base_address']").show();
							div.find("tr[name='address_tr'][role='new_address']").hide();
							div.find("#check_default_dlvp_1_" + dlvp_no).parent().hide();
							div.find("div[name='dlvp_nm']").contents().filter(function() {	//해당 div안에 있는 텍스만 지우기
								return this.nodeType == 3;
							}).remove();
							if (address.dlvp_nm == "미지정" || $.trim(address.dlvp_nm) == "") {
								div.find("div[name='dlvp_nm']>input").show();
							} else {
								div.find("div[name='dlvp_nm']>input:visible").hide();
								div.find("div[name='dlvp_nm']>label").before(address.dlvp_nm);								
							};
							div.find("li[name='recvr_nm']").text(address.recvr_nm);
							div.find("li[name='recvr_nm']").text(address.recvr_nm);
							if (address.recvr_cell_no1 + "" + address.recvr_cell_no2 + "" + address.recvr_cell_no3 != "") {
								cel_no = address.recvr_cell_no1 + "-" + address.recvr_cell_no2 + "-" + address.recvr_cell_no3;
							};
							if (address.recvr_tel1 + "" + address.recvr_tel2 + "" + address.recvr_tel3 != "") {
								tel_no = address.recvr_tel1 + "-" + address.recvr_tel2 + "-" + address.recvr_tel3;
							};
							if (tel_no != "") {
								div.find("li[name='tel_cel_no']").text("전화번호 : " + tel_no + "  /  휴대폰 번호 : " + cel_no);								
							} else {
								div.find("li[name='tel_cel_no']").text("휴대폰 번호 : " + cel_no);
							};
							
							if ($.trim(address.recvr_road_post_no) != "" && $.trim(address.recvr_road_base_addr) != "" && $.trim(address.recvr_road_dtl_addr) != "" && $.trim(address.recvr_post_no) != "" && $.trim(address.recvr_base_addr) != "" && $.trim(address.recvr_dtl_addr) != "") {	//도로명 + 지번 주소
								recvr_address = "[" + address.recvr_road_post_no + "] " + address.recvr_road_base_addr + " " + address.recvr_road_dtl_addr;
								recvr_address += "<br />(" + address.recvr_base_addr + " " + address.recvr_dtl_addr + ")";
							} else if ($.trim(address.recvr_road_post_no) != "" && $.trim(address.recvr_road_base_addr) != "" && $.trim(address.recvr_road_dtl_addr) != "") {	//도로명 주소
								recvr_address = "[" + address.recvr_road_post_no + "] " + address.recvr_road_base_addr + " " + address.recvr_road_dtl_addr;
							} else if ($.trim(address.recvr_post_no) != "" && $.trim(address.recvr_base_addr) != "" && $.trim(address.recvr_dtl_addr) != "") {	//지번주소
								recvr_address = "[" + address.recvr_post_no + "] " + address.recvr_base_addr + " " + address.recvr_dtl_addr;
							};
							div.find("span[name='recvr_address']").html(recvr_address);		
							
							if(customsId!= ""){
								$('input[name=customs_id]').val(customsId);								
							}
							
							if (role == "my") {
								div.find(":radio[role='select_address_radio']:checked").attr("checked", false);
								div.find("tr[name='address_tr'][role='base_address']").show();
								div.find("#check_default_dlvp_1_" + dlvp_no).parent().show();
								setDeliMesage(address.deli_msg);
							} else {
								setDeliMesage(ORDER.dlvp.base_dlvp.deli_msg)
							};							
						} else if (role == "new") {	//새로운 배송지
							var input = div.find(":input[default='Y']");
							dlvp.setAddress();								
							input.val("");
							input.filter(":checkbox").attr("checked", false);
							div.find("tr[name='address_tr'][role='base_address']").hide();
							div.find("tr[name='address_tr'][role='new_address']").show();
							div.find(":input[name='new_recvr_addr_1']").parent().hide();
							div.find(":input[name='new_recvr_addr_2']").parent().hide();
							setDeliMesage("");
						};
						(function() {
							var ord_qty_sum = 0;
							$.each(ORDER.dlvp.ord_dlvps[dlvp_no].ord_deli, function(dlvp_seq) {
								$.each(this.ord_goods, function(cart_seq) {
									ord_qty_sum += this.ord_qty;									
								});
							});
							if (ord_qty_sum > 0 && ORDER.goods.total_remain_qty == 0) {	//배송할 상품이 있고 전체 상품이 모두배송지에 배분 되었다면 배송비 재조회
								ORDER.fn.getDeliInfo();		//배송비 재조회 및 화면 갱신								
							};
						})();
					};
					var disp_dlvp_no = 0;	//실제 화면에 표시되는 배송지 순번 
					dlvp.div = div;
					div.attr("dlvp_no", dlvp_no);
					div.find("button[name='address_layer_button']").unbind("click").click(function() {	//주소 검색 버튼
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
								div.find("div.box_calendar").each(function() {
									var calendar = $(this);
									if (calendar.hasClass("on")) {
										calendar.removeClass("on").addClass("off");
										calendar.empty();								
									};
								});
								
								//10(지번)/20(도로명)
								if(addr.addr_gb=='10' && $.trim(addr.j_post_no) != "" && $.trim(addr.j_base_addr) != ""){ 
									div.find(":input[name='recvr_post_no']").val(addr.j_post_no);
									div.find(":input[name='new_recvr_addr_1']").val(addr.j_base_addr).parent().show();
									div.find(":input[name='new_recvr_addr_2']").val(addr.j_dtl_addr)
										.attr('readonly', false)
										.removeClass('readonly')
										.parent().show();
								} else if(addr.addr_gb=='20' && $.trim(addr.r_post_no) != "" && $.trim(addr.r_base_addr) != "") {
									div.find(":input[name='recvr_post_no']").val(addr.r_post_no);
									div.find(":input[name='new_recvr_addr_1']").val(addr.r_base_addr).parent().show();
									div.find(":input[name='new_recvr_addr_2']").val(addr.r_dtl_addr)
										.attr('readonly', false)
										.removeClass('readonly')
										.parent().show();
								}

								ORDER.fn.getDeliInfo();								
							}
						});
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_주소찾기", "");
					});
					div.find("button[name='my_dlvp_list_button']").unbind("click").click(function(e) {	//배송지목록 버튼
						e.preventDefault();
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_배송지 선택", "배송지목록");
						ORDER.fn.loginCheck(function() {
							elandmall.popup.myDlvpListLayer({									
								callback: function(data) {
									ORDER.fn.updateBlock = true;
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
					div.find(":radio[role='select_address_radio']").each(function(i) {	//배송지내 기본배송지/새로운 배송지 라디오버튼
						$(this).attr("id", "select_address_radio_" + dlvp_no + "_" + i);
						$(this).attr("name", "select_address_radio_" + dlvp_no);
						$(this).parent().attr("for", "select_address_radio_" + dlvp_no + "_" + i);						
					}).unbind("click").click(addressRadioClick);					
					div.find(":checkbox[name='check_default_dlvp_1'], :checkbox[name='check_default_dlvp_2']").each(function() {
						var checkbox = $(this);
						var name = checkbox.attr("name");							
						checkbox.attr("id", name + "_" + dlvp_no);
						checkbox.parent().attr("for", name + "_" + dlvp_no);
						if ((name == "check_default_dlvp_1")) {
							checkbox.parent().hide();								
						};
					}).unbind("click").click(function() {		//해당 배송지에 대한 기본 처리
						//전체 배송지내 체크박스 확인
						if (this.checked) {
							$(":checkbox[role='dlvp_base'][id!='" + this.id + "']:checked").click();
						};
					});
					div.find(":checkbox[name='same_receiver_checkbox']").each(function() {
						var checkbox = $(this);
						var name = checkbox.attr("name");
						checkbox.attr({
							id: name + "_" + dlvp_no,
							dlvp_no: dlvp_no
						});
						checkbox.parent().attr("for", name + "_" + dlvp_no);
					}).unbind("click").click(function() {
						if (this.checked) {
							if ($("#new_orderer_nm").is(":visible")) {
								if ($.trim($("#new_orderer_nm").val()) != "") {
									div.find(":input[name='recvr_nm']").val($("#new_orderer_nm").val());
								};
								try {
									div.find(":input[name='new_cell_no']").each(function(i) {								
										if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {									
											throw undefined;
										};								
									});
									div.find(":input[name='recvr_cell_no1']").val($("#new_cell_no1").val());
									div.find(":input[name='recvr_cell_no2']").val($("#new_cell_no2").val());
									div.find(":input[name='recvr_cell_no3']").val($("#new_cell_no3").val());
								} catch (e) {};
							} else {
								div.find(":input[name='recvr_nm']").val(ORDER.mst.ord_mst.orderer_nm);
								div.find(":input[name='recvr_cell_no1']").val(ORDER.mst.ord_mst.cell_no1);
								div.find(":input[name='recvr_cell_no2']").val(ORDER.mst.ord_mst.cell_no2);
								div.find(":input[name='recvr_cell_no3']").val(ORDER.mst.ord_mst.cell_no3);
							};
						};
					});	
					if (div.attr("role") == "added") {	//추가된 배송지에 대한 UI 처리
						div.find("tr[name='default_dlvp_tr']").remove();	//기본영역에서만 노출되는 부분 제거
						div.find(":input[name='ord_qty']").val(0);
						
						div.find(":input[default='Y']").val("");	//입력필드값 초기화
						div.find(":radio[role='select_address_radio']:eq(1)").click();	//추가된 영역은 새로운 배송지로 선택
						
						div.find("th[name='disp_dlvp_no_tr']").each(function(i) {
							$(this).html("<strong>(" + (function() {	//매장 수령 상품이 있을 경우 배송지가 추가 되므로 택배 배송 배송지 기준으로 번호 생성
								var deli_dlvp_count = 0;
								$.each(ORDER.dlvp.ord_dlvps, function() {
									if (this.cart_grp_cd == "10") {
										deli_dlvp_count++;
									};
								});
								disp_dlvp_no = deli_dlvp_count;								
								return deli_dlvp_count;
							})() + "번)</strong> 배송지 선택");
						});						 
						div.before("<div class=\"set_btn_up mt20\"><div class=\"r_cont\">* 표시는 필수 입력 사항 입니다.</div></div>");
						if (ORDER.fn.order_gift_count > 0) {
							div.find("tr[name='order_gift_tr']").show();
						};
					} else {
						var base_radio = div.find(":radio[role='select_address_radio']:eq(0)");
						if (base_radio.is(":visible") || dlvp.cart_grp_cd == "60" || dlvp.cart_grp_cd == "70") {	//기본 배송지가 있을경우...
							div.find(":radio[role='select_address_radio']:eq(0)").click();	//기본 배송지 클릭								
						} else {
							div.find(":radio[role='select_address_radio']:eq(1)").click();	//새로운 배송지 클릭
						};
						disp_dlvp_no = dlvp_no;
					};
					div.find("li[name='deli_price_li']").html("<span class=\"txt_c02\">무료배송</span>");
					div.find("p[name='deli_poss_yn_p']").attr("dlvp_no", dlvp_no).find("button").unbind("click").click(function() {
						var deli_poss_goods = $("span[name='deli_poss_yn_span'][role='main']:visible:eq(0)");
						deli_poss_goods.parent().focus();
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_받으시는 분", "상품목록으로 이동");
					});
					div.find("td[name='order_gift_td']").each(function() {
						var td = $(this);
						td.find("label").attr("for", "order_gift_checkbox_" + dlvp_no);
						td.find(":input[name='order_gift_checkbox']").attr({
							id: "order_gift_checkbox_" + dlvp_no,
							dlvp_no: dlvp_no
						}).unbind("click").click(function() {							
							ORDER.dlvp.ord_dlvps[dlvp_no].ord_gift_yn = this.checked ? "Y" : "N" ;
							if (this.checked) {
								$(":input[name='order_gift_checkbox'][dlvp_no!='" + dlvp_no + "']:checked").each(function() {
									var checkbox = $(this);
									this.checked = false;
									ORDER.dlvp.ord_dlvps[checkbox.attr("dlvp_no")].ord_gift_yn = "N";
								});								
							};
						}).prop("checked", false);
					});
					//수량변경 버튼 처리
					$.each(dlvp.ord_deli, function(dlvp_seq) {
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
										var remain_qty = $("p[name='remain_ord_qty'][cart_seq='" + cart_seq + "']");
										ord_qty_input.val(goods.ord_qty);
										if (ORDER.goods.ord_goods[cart_seq].remain_qty == 0) {
											remain_qty.addClass("off");
											remain_qty.html("남은수량 <strong>(" + ORDER.goods.ord_goods[cart_seq].remain_qty + "개)</strong>");
										} else {
											remain_qty.removeClass("off");
											remain_qty.html("남은수량 <strong>(" + ORDER.goods.ord_goods[cart_seq].remain_qty + "개)</strong><br />선택가능");
										};
										if (ORDER.goods.total_remain_qty == 0) {	//배송지별 수량이 변경되었을 경우, 배송비를 다시 조회한다.
											ORDER.fn.getDeliInfo();
										};
										elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_주문 상품", "수량변경");
										
										// 개인통관고유부호
										var customsTr = div.find("tr[name='customsId_tr']").attr("dlvp_no", dlvp_no);
										if(ORDER.goods.ord_goods[cart_seq].custom_clearance_yn	== "Y" ){
											if(goods.ord_qty > 0){
											customsTr.show();
											}else{
												customsTr.hide();	
											}										
										}
									}
								});
								return false;
							});
							div.find("span[name='deli_poss_yn_span'][cart_seq='" + cart_seq + "']").attr({ dlvp_no: dlvp_no, dlvp_seq: dlvp_seq });
						});
					});
					div.find("button[role='reset_dlvp_button']").unbind("click").click(function() {
						ORDER.fn.resetOrdQty();
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_주문상품", "설정초기화");
					});
					div.find("tr[name='deli_coupon_tr']").hide();
					div.find("a[name='deli_hope_calendar_a'], :input[name='deli_hope_calendar_input']").attr("dlvp_no", dlvp_no).unbind("click").click(function() {
						var hope_date = $(this);
						var start_date = hope_date.attr("start_date");
						var end_date = hope_date.attr("end_date");
						var yyyymm = hope_date.attr("yyyymm");
						var calendar = hope_date.parent().find("div.box_calendar");
						var dlvp_seq = hope_date.attr("dlvp_seq");
						var cart_seq = hope_date.attr("cart_seq");
						var order_divi_cd = hope_date.attr("order_divi_cd");
						var post_no = dlvp.address.addr_divi_cd == "10" ? dlvp.address.recvr_post_no : dlvp.address.recvr_road_post_no ;
						var input = div.find(":input[name='deli_hope_calendar_input'][dlvp_seq='" + dlvp_seq + "'][cart_seq='" + cart_seq + "']");
						var goods = ORDER.dlvp.ord_dlvps[dlvp_no].ord_deli[dlvp_seq].ord_goods[cart_seq];
						var closeCalendar = function() {
							calendar.removeClass("on").addClass("off");
							calendar.empty();
						};
						var load = function(p) {
							var deli_hope_dtime = goods.deli_hope_dtime ? goods.deli_hope_dtime : "" ;
							if (order_divi_cd == "10" || order_divi_cd == "30") {	//모던가구 우편번호 필수
								if (post_no == "") {
									 alert("배송지 정보를 먼저 입력해 주세요.");
									 return false;
								};
							};
							p = $.extend({ deli_hope_dtime: deli_hope_dtime, yyyymm: yyyymm, start_date: start_date, end_date: end_date, post_no: post_no, order_divi_cd: order_divi_cd }, p);
							calendar.load(elandmall.util.https("/order/searchCalendar.action"), p, function(responseText, textStatus, jqXHR) {
								var days = calendar.find("a[name='day']");
								if (textStatus == "error") {
									return false;
								};
								if (deli_hope_dtime != "") {
									days.filter("[yyyymmdd='" + deli_hope_dtime + "']").addClass("chk_date");
								} else {
									days.filter(":eq(0)").addClass("chk_date").each(function() {
										var a = $(this);
										goods.deli_hope_dtime = a.attr("yyyymmdd");
										input.val(a.attr("text"));
									});
								};
								calendar.removeClass("off").addClass("on");
								calendar.find("a.btn_cal_close").unbind("click").click(function() {
									closeCalendar();
									return false;
								});
								calendar.find("a.btn_prev_month, a.btn_next_month").click(function() {
									var yyyymm = $(this).attr("yyyymm");
									load({ yyyymm: yyyymm });
									return false;
								}).each(function() {
									var a = $(this);
									var role = a.attr("role");
									if (order_divi_cd == "10" || order_divi_cd == "30") {
										if (role == "prev") {
											if (a.attr("chk") > start_date.substring(0, 6)) {
												a.show();
											};
										} else if (role == "next") {
											if (a.attr("yyyymm") <= end_date.substring(0, 6)) {
												a.show();
											};
										};
									} else {
										if (role == "prev") {
											if (a.attr("chk") > start_date.substring(0, 6)) {
												a.show();
											};
										} else if (role == "next") {
											if (a.attr("yyyymm") <= end_date.substring(0, 6)) {
												a.show();
											};										
										};										
									};
								});
								days.click(function() {
									
									var a = $(this);
									if (a.hasClass("chk_date") === false) {
										input.val(a.attr("text"));
										days.filter(".chk_date").removeClass("chk_date");
										a.addClass("chk_date");
										goods.deli_hope_dtime = a.attr("yyyymmdd");
										
										//희망배송시간구분 추가
										if(order_divi_cd == "10" || order_divi_cd == "30") { 
											//희망배송일 배송가능시간 추가 :값 초기화,불가능 시간 비활성
											var part1 = a.attr("data-part1");
											var part2 = a.attr("data-part2");
											var part3 = a.attr("data-part3");
											var part4 = a.attr("data-part4");
	
											dlvp.ord_deli[dlvp_seq].ord_goods[cart_seq].deli_time_gb = "";
											dlvp.ord_deli[dlvp_seq].deli_time_gb = "";
											ORDER.goods.ord_goods[cart_seq].deli_time_gb = "";

											if(part1 == "F") {div.find("#apm_rdo_"+1+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",true).prop("checked", false); } else {div.find("#apm_rdo_"+1+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",false).prop("checked", false); }
											if(part2 == "F") {div.find("#apm_rdo_"+2+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",true).prop("checked", false); } else {div.find("#apm_rdo_"+2+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",false).prop("checked", false); }
											if(part3 == "F") {div.find("#apm_rdo_"+3+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",true).prop("checked", false); } else {div.find("#apm_rdo_"+3+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",false).prop("checked", false); }
											if(part4 == "F") {div.find("#apm_rdo_"+4+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",true).prop("checked", false); } else {div.find("#apm_rdo_"+4+"_"+dlvp_seq+"_"+cart_seq).prop("disabled",false).prop("checked", false); }
										}
										//희망배송시간구분 추가
									}
									
									closeCalendar();
									return false;
								});
							});
						};
						if (calendar.hasClass("off")) {
							load();
						} else {
							closeCalendar();
						};
						
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번", "희망배송일");
						return false;
					});
					div.find(":input[name='ord_memo_cont']").unbind("blur").blur(function() {
						if ( $(this).attr("deli_hope_api_yn") == "Y"){
							elandmall.util.toSpCharRemove($(this));	// 특수문자 제거
						}
					});
					div.find(":input[name='recvr_tel1']").unbind("change").change(function() {
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_받으시는 분", "전화번호");
					});
					div.find(":input[name='recvr_cell_no1']").unbind("change").change(function() {
						elandmall.util.ga("PC_주문/결제", "배송정보_배송지" + disp_dlvp_no + "번_받으시는 분", "휴대폰번호");
					});
					//희망배송일 시간:시간변경시 저장
					div.find(".deli_time_gb").unbind("click").click(function(){
						var dlvp_seq = $(this).attr("dlvp_seq");
						var cart_seq = $(this).attr("cart_seq");
						var deli_time_gb = $(this).val();
						dlvp.ord_deli[dlvp_seq].ord_goods[cart_seq].deli_time_gb = deli_time_gb;
						dlvp.ord_deli[dlvp_seq].deli_time_gb = deli_time_gb;
					});
					
					//S:바후스 가구약관 동의 
					//1.사다리차
					var ord_chk_ladder = div.find(":input[name='chk_ladder']").attr("dlvp_no", dlvp_no);
					ord_chk_ladder.unbind("change").change(function(){
						ORDER.dlvp.ord_dlvps[dlvp_no].laddercar_yn = $(this).is(":checked") ? "Y":"N";
					
					});
					
					
					//2.엘리베이터 유무
					var ord_elve_rdo = div.find(":input[name='elve_rdo']").attr("dlvp_no", dlvp_no);
					ord_elve_rdo.unbind("change").change(function(){
						ORDER.dlvp.ord_dlvps[dlvp_no].elevator_yn = $(this).val();
						
					});
					
					//3.벽고정 설치
					var ord_fixed_w_rdo = div.find(":input[name='fixed_w_rdo']").attr("dlvp_no", dlvp_no);
					ord_fixed_w_rdo.unbind("change").change(function(){
						var sVal = $(this).val();
						if(sVal == "Y"){
							div.find(".bahus_fixwall").show();
						}else {
							div.find(".bahus_fixwall").hide();
						}
						ORDER.dlvp.ord_dlvps[dlvp_no].wellanchor_yn = sVal;
			
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
			var default_remain_qty_html = "남은수량 (0개)<br>수량 없음";
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
						};
						ord_qty_input.filter("[cart_seq='" + cart_seq + "']").val(this.ord_qty);
					});
				});
				div.find("span[name='remain_ord_qty']").html(default_remain_qty_html).addClass("none");
			});
			ORDER.goods.total_remain_qty = 0;
		},
		resetOrdQty: function() {	//배송지내 상품수량 초기화(기본배송지 -> 본 주문 상품 수량으로, 나머지는 0으로 설정한 후 배송비 재조회)
			var default_remain_qty_html = "남은수량 <strong>(0개)</strong>";
			$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
				var div = $("div[name='dlvp_area'][dlvp_no='" + dlvp_no + "']");
				var ord_qty_input = div.find(":input[name='ord_qty']");
				var role = div.attr("role");
				var cart_grp_cd = this.cart_grp_cd;
				if (cart_grp_cd == "40") {
					return true;
				};
				$.each(this.ord_deli, function(dlvp_seq) {
					$.each(this.ord_goods, function(cart_seq) {
						this.ord_qty = 0;
						if (role == "default") {		//기본배송지
							this.ord_qty = ORDER.goods.ord_goods[cart_seq].ord_qty;
							ORDER.goods.ord_goods[cart_seq].remain_qty = 0;
						};
						ord_qty_input.filter("[cart_seq='" + cart_seq + "']").val(this.ord_qty);
					});
				});
				div.find("p[name='remain_ord_qty']").html(default_remain_qty_html).addClass("off");
			});
			ORDER.goods.total_remain_qty = 0;
			ORDER.fn.getDeliInfo();	//배송비 재조회
		}
	});	
});