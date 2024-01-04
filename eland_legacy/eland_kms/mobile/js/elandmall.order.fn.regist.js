/**
 * 주문생성 함수 
 */
$(document).ready(function() {
	if (!ORDER.fn) {
		ORDER.fn = {};
	};
	$.extend(ORDER.fn, {
		orderPin : {
			insur_yn : "N",
			birth_day : "",
			gend_cd : "",
			cash_receipt_issue_cd : "",				
			cash_receipt_use_divi_cd : "",
			cash_receipt_cert_no : "",
			refund_req_type_cd : "",
			refund_req_bank_cd : "",
			refund_req_depor_nm : "",
			refund_req_account_no : "",
			account_owner_mgmt : ""
		},
		doOrder: function() {
			this.registOrder();
		},
		standbyOrder: function() {
			if (elandmall.util.getCookie("order_status") == "P") {	//주문완료 이전에 뒤로가기해서 왔을 경우. 주문 진행되도록 한다.
				ORDER.fn.doOrder = function() {
					ORDER.fn.registOrder();
				};
				ORDER.fn.doOrder();
			} else if (elandmall.util.getCookie("order_status") == "C") {	//주문완료 후 뒤로가기해서 왔을 경우
				alert("이미 결제 완료된 주문 입니다.");
				window.location.href = "/order/preventOsBack.action";
			} else {
				alert("주문 진행중 입니다. 잠시만 기다려 주세요");
				return false;				
			};
		},
		registOrder: function() {
			var orderPin = this.orderPin;
			var insur_yn = "N";
			var birth_day = "";
			var gend_cd = "";
			var cash_receipt_issue_cd = "";								
			var cash_receipt_use_divi_cd = "";
			var cash_receipt_cert_no = "";
			var refund_req_type_cd = "";
			var refund_req_bank_cd = "";
			var refund_req_depor_nm = "";
			var refund_req_account_no = "";
			var account_owner_mgmt;
			var is_deli_hope_yn  = false;
			this.doOrder = this.standbyOrder;
			
			try {
				//2019-03-25 jinupark
				var resultCnt = 0;
				$.each(ORDER.pay.pays, function(pay_seq) {
					if((this.pay_mean_cd == "15" && this.pay_amt >= 10) //리테일포인트 10원 이상 
							|| (this.pay_mean_cd == "21" && this.pay_amt >= 10)  //예치금 10원 이상 
							|| (this.pay_mean_cd == "62" && this.pay_amt >= 10000)){ // 복지포인트 10원 이상
						resultCnt ++;
					};
				});
				if(($("#cert_no_chk").val() === "Y" || $("#cert_no_chk").val() === "F")
					&& ( resultCnt > 0
					)
				){
					throw "포인트 인증 후 사용 가능 합니다.";
				}
				
				//상품수량 확인
				if (ORDER.goods.total_remain_qty > 0) {
					throw "배송지별 주문 수량이 올바르지 않습니다.";
				};
				if (ORDER.mst.nomember === true) {
					$("#no_member_agree_check1, #no_member_agree_check2").each(function() {
						var checkbox = $(this);
						if (this.checked === false) {
							checkbox.focus();							
							throw checkbox.attr("msg");
						};
					});
				};
				(function() {	//주문자 정보 확인
					$("#orderer_info_button_ok:visible").each(function() {
						this.focus();
						throw "주문자 정보 변경을 완료해주세요";
					});
					if ($("#orderer_nm_checkbox_new").is(":checked") || ORDER.mst.nomember === true) {	//주문자 정보 변경
						$("#new_orderer_nm").each(function() {
							if ($.trim(this.value) == "") {
								this.focus();
								throw "주문자명을 입력하세요";
							};
						});
						
						if(ORDER.mst.ord_mst.present_yn != "Y") {
						
							$("#new_email").each(function() {
								if ($.trim(this.value) == "") {
									this.focus();
									throw "이메일 주소를 입력하세요";
								};
							});
							if (elandmall.validate.isValidEmail($.trim($("#new_email").val())) === false) {
								$("#new_email").focus();
								throw "이메일 주소가 올바르지 않습니다.";
							};
						
						}
						$("#new_cell_no1, #new_cell_no2, #new_cell_no3").each(function(i) {
							if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {
								this.focus();
								throw "휴대폰 번호를 입력하세요!";
							};
							if (i == 1 && $.trim(this.value).length > 4) {
								this.focus();
								throw "휴대폰 번호가 올바르지 않습니다!";
							};
						});
					};
				})();
				if (ORDER.mst.nomember === true ) {
					ORDER.mst.ord_mst.orderer_nm = $.trim($("#new_orderer_nm").val());
					ORDER.mst.ord_mst.email = $.trim($("#new_email").val());
					ORDER.mst.ord_mst.cell_no1 = $("#new_cell_no1").val();
					ORDER.mst.ord_mst.cell_no2 = $.trim($("#new_cell_no2").val());
					ORDER.mst.ord_mst.cell_no3 = $.trim($("#new_cell_no3").val());
				};
				//배송정보 확인
				$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
					var dlvp = this;
					var ord_qty_sum = 0;
					var div = dlvp.div ;
					var cart_grp_cd = this.cart_grp_cd;
					$.each(this.ord_deli, function(dlvp_seq) {
						$.each(this.ord_goods, function(cart_seq) {
							if (cart_grp_cd != "40") {
								ord_qty_sum += this.ord_qty;
							};
						});
					});	
					if (ord_qty_sum == 0) {	//배송 할 상품이 없음
						return true;
					};
					if (dlvp.cart_grp_cd == "20") {	//디지털 상품권(복수배송)
						(function() {
							var recvr_nm = div.find(":input[name='recvr_nm']").each(function() {
								this.value = $.trim(this.value);
							});
							var select_address_radio_value = div.find("li[role='choose_dlvp_li'].selected").attr("dlvp_gb");
							if (select_address_radio_value == "gift") {
								if (recvr_nm.val() == "") {
									recvr_nm.focus();
									throw "받으시는 분 이름을 입력하세요!";	
								};
								dlvp.address.recvr_nm = recvr_nm.val();
								div.find(":input[role='recvr_cell_no']").each(function(i) {
									if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {
										this.focus();
										throw "휴대폰 번호를 입력하세요!";
									};
									if (i == 1 && $.trim(this.value).length > 4) {
										this.focus();
										throw "휴대폰 번호가 올바르지 않습니다!";
									};
									dlvp.address[this.name] = this.value;
								});
							} else if (ORDER.mst.nomember === true) {	//비회원이 본인에게 전송일 경우
								dlvp.address.recvr_nm = ORDER.mst.ord_mst.orderer_nm;
								dlvp.address.recvr_cell_no1 = ORDER.mst.ord_mst.cell_no1;
								dlvp.address.recvr_cell_no2 = ORDER.mst.ord_mst.cell_no2;
								dlvp.address.recvr_cell_no3 = ORDER.mst.ord_mst.cell_no3;
							};
						})();
					} else if (dlvp.cart_grp_cd != "HO") {		//호텔 예약은 배송지 없음
						(function() {	//배송정보 확인
							var recvr_nm = $("#new_recvr_nm");
							var select_address_radio_value = $("#address_select_tab li.selected").attr("role_value");
							if (ORDER.mst.nomember === true) {	//비회원 구매시
								select_address_radio_value = "new";
							};
							if (select_address_radio_value == "new") {	//새로운 배송지 선택시
								if ($.trim($("#new_dlvp_nm").val()) != "") {
									dlvp.address.dlvp_nm = $.trim($("#new_dlvp_nm").val());
								};
								if ($.trim(recvr_nm.val()) == "") {
									recvr_nm.focus();
									throw "받으시는 분 이름을 입력하세요!";
								};
								dlvp.address.recvr_nm = recvr_nm.val();
								(function() {
									var tel_no = "";
									div.find(":input[role='new_recvr_tel']").each(function(i) {		//전화번호는 필수가 아님.
										tel_no += $.trim(this.value);
									});
									if (tel_no != "") {	//전화번호가 한자리라도 입력되었다면...
										div.find(":input[role='new_recvr_tel']").each(function(i) {								
											if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {
												this.focus();
												throw "전화번호를 올바르게 입력해주세요.";
											};
											if (i == 1 && $.trim(this.value).length > 4) {
												this.focus();
												throw "전화번호가 올바르지 않습니다!";
											};
											dlvp.address[this.name] = this.value;
										});										
									};
								})();
								div.find(":input[role='new_recvr_cell_no']").each(function(i) {
									if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {
										this.focus();
										throw "휴대폰 번호를 입력하세요!";
									};
									if (i == 1 && $.trim(this.value).length > 4) {
										this.focus();
										throw "휴대폰 번호가 올바르지 않습니다!";
									};
									dlvp.address[this.name] = this.value;
								});		
								if(ORDER.mst.ord_mst.present_yn != "Y") {
									if (dlvp.address.addr_divi_cd == "10" && ($.trim(dlvp.address.recvr_post_no) == "" || $.trim(dlvp.address.recvr_base_addr) == "" || $.trim(dlvp.address.recvr_dtl_addr) == ""))	{	//지번주소
										div.find("#address_layer_button").focus();
										throw "주소를 입력하세요!";
									} else if (dlvp.address.addr_divi_cd == "20" && ($.trim(dlvp.address.recvr_road_post_no) == "" || $.trim(dlvp.address.recvr_road_base_addr) == "" || $.trim(dlvp.address.recvr_road_dtl_addr) == ""))	{	//도로명 주소
										div.find("#address_layer_button").focus();
										throw "주소를 입력하세요!";
									} else if (dlvp.address.addr_divi_cd == "") {
										div.find("#address_layer_button").focus();
										throw "주소를 입력하세요!";
									};
								}
							};
							if (select_address_radio_value == "my") {	//배송지 목록에서 기본배송지 이외의 배송지 선택시
								if ($("#check_default_dlvp_base").is(":checked")) {
									ORDER.dlvp.ord_dlvps[dlvp_no].base_yn = "Y";
								} else {
									ORDER.dlvp.ord_dlvps[dlvp_no].base_yn = "N";
								};
							} else if (select_address_radio_value == "new") {	//새로운 배송지 선택시
								if ($("#check_default_dlvp_new").is(":checked")) {
									ORDER.dlvp.ord_dlvps[dlvp_no].base_yn = "Y";
								} else {
									ORDER.dlvp.ord_dlvps[dlvp_no].base_yn = "N";
								};
							} else {
								ORDER.dlvp.ord_dlvps[dlvp_no].base_yn = "N";
							};
							//다시한번 배송지 정보 확인
							if ($.trim(dlvp.address.recvr_nm) == "" || $.trim(dlvp.address.recvr_cell_no1) == "" || $.trim(dlvp.address.recvr_cell_no1).length != 3 || $.trim(dlvp.address.recvr_cell_no2) == "" || $.trim(dlvp.address.recvr_cell_no2).length < 3 || $.trim(dlvp.address.recvr_cell_no2).length > 4 || $.trim(dlvp.address.recvr_cell_no3) == "" || $.trim(dlvp.address.recvr_cell_no3).length != 4) {
								throw "배송지 정보가 올바르지 않습니다.";
							};
							
							if(ORDER.mst.ord_mst.present_yn != "Y") {
								if (dlvp.address.addr_divi_cd == "10") {
									if ($.trim(dlvp.address.recvr_post_no) == "" || $.trim(dlvp.address.recvr_base_addr) == "" || $.trim(dlvp.address.recvr_dtl_addr) == "") {
										throw "배송지 정보가 올바르지 않습니다.";
									};
								} else {
									if ($.trim(dlvp.address.recvr_road_post_no) == "" || $.trim(dlvp.address.recvr_road_base_addr) == "" || $.trim(dlvp.address.recvr_road_dtl_addr) == "") {
										throw "배송지 정보가 올바르지 않습니다.";
									};
								};
							
							}
							
							if (div.find("div[name='dlvp_nm']>input:visible").length == 1) {	//배송 목록중 배송지명이 없는 것을 선택했을 경우
								dlvp.address.dlvp_nm = div.find("div[name='dlvp_nm']>input:visible").val();
							};
							//배송메세지 확인
							$("#ord_memo_cont_select, #ord_memo_cont_select_new").filter(":visible").each(function() {
								if (this.value == "direct") {
									$("#ord_memo_cont, #ord_memo_cont_new").filter(":visible").each(function() {
										if ($.trim(this.value) == "") {
											this.focus();
											throw "배송 시 전달사항을 입력해주세요.";
										} else {
											this.value = $.trim(this.value);
										};
									});
								};
							});
							
							// 개인통관고유부호								
							$("#customs_id, #customs_id_new").filter(":visible").each(function() {
								if ($.trim(this.value) == "") {
									this.focus();
									throw "개인통관고유부호를 입력해주세요.";
								}else{		
									var txtValue =$.trim(this.value.toUpperCase());							
									if(txtValue.length == 13 && txtValue.charAt(0) == "P"){					
										this.value = $.trim(this.value);
									}else{
										this.focus();
										throw "정확한 통관부호를 입력해주세요.";
									}
								}
							});
							
							 //S:바후스 가구약관 동의 
							if(div.find(".furn_agree").length > 0) {
								//가구 배송 추가 정보1.사다리차 이용 동의
								var baseYn = $("#address_select_tab li.selected").attr("role_value") == "base" ? "Y":"N";  //새배송지 여부
							
								div.find(":input[name='chk_ladder'][dlvp_no='" + dlvp_no + "'][role='"+baseYn+"']").each(function() {
									if(!$(this).is(":checked")) {
										$(this).focus();
										throw "사다리차 이용 약관에 반드시 동의해주세요.";
									}
								
								});
								
								//가구 배송 추가 정보2.엘리베이터
							
								if(!ORDER.dlvp.ord_dlvps[dlvp_no].elevator_yn || ORDER.dlvp.ord_dlvps[dlvp_no].elevator_yn == null){
									div.find("button.elve_rdo:visible:eq(0)").focus();
									throw "엘리베이터 유무를 꼭 알려주세요.";
								}
					
								
								if(!ORDER.dlvp.ord_dlvps[dlvp_no].wellanchor_yn || ORDER.dlvp.ord_dlvps[dlvp_no].wellanchor_yn == ""){
									div.find("button.fixed_w_rdo:visible:eq(0)").focus();
									throw "벽 고정 설치 여부를 꼭 알려주세요.";
								}
								
								//가구 배송 추가 정보3.벽고정 설치
								if(ORDER.dlvp.ord_dlvps[dlvp_no].wellanchor_yn == "Y") {
										if(!div.find(":input[name='chk_fixed'][role='"+baseYn+"']").is(":checked")){
											div.find(":input[name='chk_fixed'][role='"+baseYn+"']").focus();
											throw "벽 고정 설치가 필요한 경우 약관에 반드시 동의해주세요.";
										}
								}
								
								//가구 배송 추가 정보4.가구배송약관
								div.find(":input[name='chk_user_term'][dlvp_no='" + dlvp_no + "'][role='"+baseYn+"']").each(function() {
									if(!$(this).is(":checked")) {
										$(this).focus();
										throw "가구 배송약관에 대해 반드시 동의해주세요.";
									}
								
								});
							}//E:바후스 가구약관 동의 

						})();						
					};
				});
				//배송정보 확인 후 배송 불가 상품/희망배송일/방문일자 확인
				$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
					var div = $("div[name='dlvp_area'][dlvp_no='" + dlvp_no + "']");
					var cart_grp_cd = this.cart_grp_cd;
					$.each(this.ord_deli, function(dlvp_seq) {
						$.each(this.ord_goods, function(cart_seq) {
							if (this.ord_qty > 0) {
								if (cart_grp_cd != "40") {
									if (this.deli_poss_yn == "N") {
										throw function() {
											elandmall.layer.createLayer({
												title: "배송 불가 상품 안내",
												createContent: function(layer) {
													layer.div_content.append(
														"<div class=\"txt\">입력하신 주소로 <br><strong>배송 불가한 상품</strong>이 존재 합니다.</div>" +
														"<div class=\"stxt\">장바구니에서 배송불가 상품을 제외하고<br>주문을 다시 시도하시겠습니까?</div>" +
														"<ul class=\"btn_list02 btn_ship\">" +
														"	<li><a href=\"javascript:;\" class=\"btn_brd03 c01\" role='cart' >장바구니 가기</a></li>" +
														"	<li><a href=\"javascript:;\" class=\"btn_bg06 c01\" role='modify' >배송지 변경</a></li>" +
														"</ul>"
													).filter(".pop_txt").removeClass("pop_txt").addClass("nolist");
													layer.div_content.find("a").click(function() {
														var button = $(this);
														var role = button.attr("role");
														if (role == "cart") {
															layer.close();
															elandmall.hdLink("CART");
														} else {
															layer.close();
														};
													});
													layer.show();
												}
											});
										};										
									};
								
							
									
										if (ORDER.goods.ord_goods[cart_seq].cart_grp_cd != "40" && (ORDER.goods.ord_goods[cart_seq].deli_hope_day_yn == "Y" ||ORDER.goods.ord_goods[cart_seq].order_divi_cd == "10" || ORDER.goods.ord_goods[cart_seq].order_divi_cd == "30") ) {
											if(ORDER.goods.ord_goods[cart_seq].order_divi_cd == "30") is_deli_hope_yn =true; //배송지연 알림창 활성
											
											if(ORDER.goods.ord_goods[cart_seq].low_vend_type_cd != "50") {
												//희망배송시간구분 추가
												if(!ORDER.goods.ord_goods[cart_seq].deli_hope_dtime || ORDER.goods.ord_goods[cart_seq].deli_hope_dtime == "") {
													$(":input[name='deli_hope_select'][cart_seq='" + cart_seq+"']").focus();
													throw "희망 배송일을 설정하세요";
												}else {
													if((ORDER.goods.ord_goods[cart_seq].order_divi_cd == "10" || ORDER.goods.ord_goods[cart_seq].order_divi_cd == "30")) {
														if(!ORDER.goods.ord_goods[cart_seq].deli_time_gb || ORDER.goods.ord_goods[cart_seq].deli_time_gb  == "") {
															$(":input[name='deli_hope_select'][cart_seq='" + cart_seq+"']").focus();
															throw "희망 배송시간대를 설정하세요";
														}
													}
												}
												//희망배송시간구분 추가
											}
										};		
									
								} else {
									if(ORDER.goods.ord_goods[cart_seq].low_vend_type_cd != "50") {
										if(ORDER.goods.ord_goods[cart_seq].goods_type_cd != "20"){
											if (!ORDER.goods.ord_goods[cart_seq].deli_hope_dtime || ORDER.goods.ord_goods[cart_seq].deli_hope_dtime == "") {
												$("#deli_hope_dtime_select_" + cart_seq).focus();
												throw "방문일자를 선택하세요";
											};
										};
										this.deli_hope_dtime = ORDER.goods.ord_goods[cart_seq].deli_hope_dtime;
									}
								};
	
							};
						});
					});
					
					
				});

				$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
					//오늘받송 가능지점 유효성 체크 && 메쉬코리아 배송비확인 API로 오늘받송 가능한지 체크
					if (this.cart_grp_cd == "60") {
						var arrCart_no = new Array();
						var quickDeliBaseAddr = "";
						var quickDeliDtlAddr = "";

						$.each(this.ord_deli, function(dlvp_seq) {
							$.each(this.ord_goods, function(cart_seq) {
								if (this.ord_qty > 0) {
									if ( arrCart_no.indexOf(ORDER.goods.ord_goods[cart_seq].cart_no) == -1 ) {
										arrCart_no.push(ORDER.goods.ord_goods[cart_seq].cart_no);
									}
								};
							});
						});
						if (this.address.addr_divi_cd == "10") {
							quickDeliBaseAddr = $.trim(this.address.recvr_base_addr);
							quickDeliDtlAddr = $.trim(this.address.recvr_dtl_addr);
						} else {
							quickDeliBaseAddr = $.trim(this.address.recvr_road_base_addr);
							quickDeliDtlAddr = $.trim(this.address.recvr_road_dtl_addr);
						};

						var isQuickDeliPoss = false; 
						var quickErrorMsg = "죄송합니다. 오늘받송 가능여부 확인시 오류가 발생하였습니다.";
						$.ajax({
							url: '/cart/quickDeliValidCheck.action',
							dataType: "json",
							data: {arrCart_no : arrCart_no, quickDeliBaseAddr : quickDeliBaseAddr, quickDeliDtlAddr : quickDeliDtlAddr},
							async: false,
							success: function(data) {
								if(data.ret_code == "0000") {
									isQuickDeliPoss = true;
								} else {
									quickErrorMsg = data.ret_msg;
								} 
							}, error : function( e ){
								if ( e.error_message !=null && e.error_message != ""){
									alert(e.error_message);
								}else{
									alert("오늘받송 가능여부 확인시 오류가 발생하였습니다.");
								}
							}
						});
						
						if ( !isQuickDeliPoss ) {
							throw quickErrorMsg;
						}
					// 하이퍼 배송 가능 여부 체크
					} else if( this.cart_grp_cd == "70" ) {
						var order_dlvp = this;
						$("[name=hyper_dlv_area]").each(function(){
							var hyper_cetner_no = $(this).attr("hyper_center");
							var hyper_dlv_radio = $(this).find("input:radio:checked");
							if(hyper_dlv_radio.length > 0) {
								var lot_dlv_date = hyper_dlv_radio.attr("lot_dlv_date");
								var lot_dlv_seq  = hyper_dlv_radio.attr("lot_dlv_seq");
								var lot_bgn_tm   = hyper_dlv_radio.attr("lot_bgn_tm");
								var lot_end_tm   = hyper_dlv_radio.attr("lot_end_tm");
								var isHyperDeliPoss = false;
								var hyperErrorMsg = "오늘직송 배송가능여부 확인시 오류가 발생사였습니다.";
								var arrCart_no = new Array();
								
								$.each(order_dlvp.ord_deli, function(dlvp_seq) {
									$.each(this.ord_goods, function(cart_seq) {
										if (this.ord_qty > 0) {
											if ( arrCart_no.indexOf(ORDER.goods.ord_goods[cart_seq].cart_no) == -1 ) {
												arrCart_no.push(ORDER.goods.ord_goods[cart_seq].cart_no);
											}
										};
									});
								});
								
								$.ajax({
									url: '/cart/hyperDeliValidCheck.action',
									dataType: "json",
									data: {
										arrCart_no: arrCart_no,
										lot_dlv_date: lot_dlv_date,
										lot_dlv_seq: lot_dlv_seq, 
										lot_bgn_tm: lot_bgn_tm,
										lot_end_tm: lot_end_tm
									},
									async: false,
									success: function(data) {
										if(data.ret_code == "0000") {
											isHyperDeliPoss = true;
										} else {
											hyperErrorMsg = data.ret_msg;
										} 
									}, error : function( e ){
										if ( e.error_message !=null && e.error_message != ""){
											hyperErrorMsg = e.error_message;
										}else{
											alert("오늘직송 배송가능여부 확인시 오류가 발생하였습니다.");
										}
									}
								});
								
								if(!isHyperDeliPoss) {
									$(window).scrollTop($(this).position().top - 45);
									throw hyperErrorMsg;									
								}
							}
							
							// 하이퍼 배송 선택 데이터 확인
							var select_count = 0;
							if(ORDER.deli.hyper_deli[hyper_cetner_no] != null) {
								$.each(ORDER.deli.hyper_deli[hyper_cetner_no], function(idx, hyper){
									if(hyper.select_yn == "Y") {
										++select_count;
									}
								});
							}

							if(hyper_dlv_radio.length <= 0 || select_count <= 0){
								$(window).scrollTop($(this).position().top - 45);
								throw "오늘직송시간을 선택해주세요.";
							}
						});
					}
				});

				//결제수단 확인
				var radio_buttons = ORDER.fn.ord_pay_radio;
				var alertAndOpen = function(p) {
					var ico_open_payments = $("#ico_open_payments");
					alertAndOpen = function(p) {
						return function() {
							alert(p.message);
							if (ico_open_payments.hasClass("selected")) {
								ico_open_payments.click();
							};
							if (p.input) {
								p.input.focus();								
							};
						};
					};
					return alertAndOpen(p);
				};
				radio_buttons.each(function() {	//일단 기존셋팅된 결제금액을 초기화...
					var radio = $(this);
					var pay_seq = radio.attr("pay_seq");					
					if (ORDER.pay.pays[pay_seq]) {
						ORDER.pay.pays[pay_seq].pay_amt = 0;	//일단 0으로 초기화
					};
				});
				if (ORDER.fn.final_pay_amt < 0) {
					throw "결제금액이 올바르지 않습니다.";
				};
				if (ORDER.fn.final_pay_amt > 0) {		//결제금액 존재
					if (radio_buttons.filter(".selected").length == 0) {
						radio_buttons.filter(":eq(0)").focus();
						throw alertAndOpen({
							message: "결제수단을 선택하세요!"
						}); 
					};
					radio_buttons.each(function() {
						var radio = $(this);
						var pay_seq = radio.attr("pay_seq");
						var pay_mean_cd = radio.attr("pay_mean_cd");
						var checkGuaranteeCash = function() {	//보증보험 확인
							insur_yn = $("#guarantee_insurance_yn").val();
							birth_day = $("#guarantee_birth_day").val();
							gend_cd = $("#guarantee_gend_cd").val();
						};
						
						var refund_req_type_radio = null;
						if ($(this).hasClass("selected") === false) {
							return true;
						};		
						
						//포인트, 복지포인트, 무통장의 경우 해당기능 설정 시 다중 request처리되어 분기처리 2017.09.14
						if (pay_mean_cd != "13") {
							ORDER.orderGoing();
						}
						
						if (pay_mean_cd == "11") {	//신용카드
							var kakao = radio.attr("kakao");
							var kakaopay = radio.attr("kakaopay");
							var payco = radio.attr("payco");
							var toss = radio.attr("toss");
							var naverpay = radio.attr("naverpay");
							if (kakao !== "Y" && payco !== "Y" && kakaopay !=="Y" && toss !=="Y" && naverpay !=="Y") {
								ORDER.fn.select_credit_card.each(function() {
									var select = this;
									if (this.value == "") {
										throw alertAndOpen({
											message: "신용카드를 선택하세요!",
											input: select
										}); 
									};
								});								
							};
						} else if (pay_mean_cd == "12") {	//실시간
							checkGuaranteeCash();
						} else if (pay_mean_cd == "14") {	//휴대폰 결제
							//휴대폰결제 최소 결제 금액 설정
							var min_pay_amt = parseInt(radio.attr("min_pay_amt"));
							if(min_pay_amt > 0 && ORDER.fn.final_pay_amt < min_pay_amt) throw ""+min_pay_amt + "원 미만의 상품은 다른결제수단을 이용해주시기 바랍니다.";
						} else if (pay_mean_cd == "13") {	//무통장
							ORDER.fn.select_vbank.each(function() {
								var select = this;
								if (this.value == "") {
									throw alertAndOpen({
										message: "입금은행을 선택하세요!",
										input: select
									});
								}
							});
							$("#morc_nm").each(function() {
								var input = this;
								if ($.trim(input.value) == "") {
									throw alertAndOpen({
										message: "입금자명을 입력하세요!",
										input: input
									});
								};
								this.value = $.trim(this.value);
							});
							checkGuaranteeCash();
							$("#refund_method_agree_checkbox").each(function() {
								if (this.checked === false) {
									throw alertAndOpen({
										message: "환불방법 선택에 동의 하세요",
										input: this
									});									
								};
							});
							refund_req_type_radio = $("#refund_req_type_radio_1, #refund_req_type_radio_2");
							if (refund_req_type_radio.parent().filter(".selected").length == 0) {
								throw alertAndOpen({
									message: "환불 방식을 선택하세요",
									input: refund_req_type_radio.filter(":eq(0)")[0]
								});
							};
							refund_req_type_cd = (function() {
								return refund_req_type_radio.parent().filter(".selected").find("a").attr("value");
							})();
							if (refund_req_type_cd == "10") {
								var add_refund_bank_button = $("#add_refund_bank_button");
								if (add_refund_bank_button.length == 0 || add_refund_bank_button.attr("click_yn") == "Y") {		//새로운 환불 계좌 입력
									$("#new_refund_bank_area").each(function() {
										$(this).find(":input[role='refun_bank_info']").each(function(i) {
											if ($.trim(this.value) == "") {
												throw alertAndOpen({
													message: "환불 계좌 정보가 올바르지 않습니다.",
													input: this
												});												
											};
											this.value = $.trim(this.value);
											if (i == 0) {
												refund_req_bank_cd = this.value;
											} else	if (i == 1) {
												refund_req_depor_nm = this.value;
											} else	if (i == 2) {
												this.value = this.value.replace(/-/g, "");
												refund_req_account_no = this.value;
											};
										});
										if (!ORDER.payments.certAccaountCache[refund_req_depor_nm + "|" + refund_req_account_no + "|" + refund_req_bank_cd] || ORDER.payments.certAccaountCache[refund_req_depor_nm + "|" + refund_req_account_no + "|" + refund_req_bank_cd].result !== true) {
											throw alertAndOpen({
												message: "환불 계좌를 확인해 주세요",
												input: $("#cert_account_button")
											});
										};
									});									
								} else {	//고객 환불계좌 정보(기존 인증)
									refund_req_bank_cd = ORDER.mst.account_owner_mgmt.bank_cd;
									refund_req_depor_nm = ORDER.mst.account_owner_mgmt.morc_nm;
									refund_req_account_no = ORDER.mst.account_owner_mgmt.account_no;
								};
								$("#refund_req_account_save_checkbox").each(function() {
									if (this.checked) {	//환불정보 저장										
										account_owner_mgmt = $.extend({}, ORDER.mst.account_owner_mgmt, {
											bank_cd: refund_req_bank_cd, 
											account_no: refund_req_account_no,
											morc_nm: refund_req_depor_nm
										});
									};
								});
							};
						};
						ORDER.pay.pays[pay_seq].pay_amt = ORDER.fn.final_pay_amt;
					});
				};
				(function() {	//현금 영수증
					var cash_receipt_area_div = ORDER.fn.cash_receipt_area_div;
					if (cash_receipt_area_div.css("display") == "block" && $("#cash_receipt_checkbox").is(":checked")) {
						$("a[name='cash_receipt_radio']").each(function() {
							var button = $(this); 
							if (button.parent().hasClass("selected")) {
								cash_receipt_use_divi_cd = button.attr("issue_cd");
								if (cash_receipt_use_divi_cd == "10") {	//개인소득공제
									cash_receipt_area_div.find("[name='cash_receipt_use_divi_radio']").each(function() {
										if (this.checked) {
											if (this.value == "30") {	//휴대폰번호
												cash_receipt_issue_cd = "30";
												cash_receipt_area_div.find(":input[role='cash_receipt_cell_no']").each(function(i) {
													if ($.trim(this.value) == "" || $.isNumeric($.trim(this.value)) === false || (i == 1 && $.trim(this.value).length < 3) || (i == 2 && $.trim(this.value).length != 4)) {
														throw alertAndOpen({
															message: "휴대폰번호를 입력하세요!",
															input: this
														});
													};
													if (i == 1 && $.trim(this.value).length > 4) {
														throw alertAndOpen({
															message: "휴대폰 번호가 올바르지 않습니다!",
															input: this
														});													
													};
													cash_receipt_cert_no += ("" + $.trim(this.value));
												});
											} else {	//현금영수증 카드번호
												cash_receipt_issue_cd = "50";
												cash_receipt_area_div.find(":input[role='cash_receipt_card_no']").each(function(i) {
													if ($.trim(this.value) == "" || $.trim(this.value).length != 4 || $.isNumeric($.trim(this.value)) === false) {
														throw alertAndOpen({
															message: "현금 영수증 카드번호를 입력하세요!",
															input: this
														});
													};
													cash_receipt_cert_no += ("" + $.trim(this.value));
												});
											}
										};
									});
								} else if (cash_receipt_use_divi_cd == "20") {		//지출 증빙용(사업자 등록 번호)
									cash_receipt_issue_cd = "20";
									cash_receipt_area_div.find(":input[role='cash_receipt_biz_no']").each(function(i) {
										if ($.trim(this.value) == "" || $.trim(this.value).length != $(this).attr("maxlength") || $.isNumeric($.trim(this.value)) === false) {
											throw alertAndOpen({
												message: "사업자 등록 번호를 입력하세요!",
												input: this
											});
										};
										cash_receipt_cert_no += ("" + $.trim(this.value));
									});
								};
							};
						});						
					};
				})();
				$("#order_agree_checkbox_3").each(function() {
					if (this.checked === false) {
						this.focus();
						throw "개인정보 제 3자 제공 동의에 동의하셔야 구매가 가능합니다.";
					};
				});
				$("#order_agree_checkbox_2").each(function() {
					if (this.checked === false) {
						this.focus();
						throw "보석/명품 상품 청약철회 약관에 동의해 주세요.";
					};
				});				
				//약관동의
				$("#order_agree_checkbox_1").each(function() {
					if (this.checked === false) {
						this.focus();
						throw "주문약관에 동의하신 후 결제해 주세요.";
					};
				});
				$("#order_agree_checkbox_4").each(function() {
					if (this.checked === false) {
						this.focus();
						throw "해외구매대행상품 주문동의 약관에 동의해 주세요.";
					};
				});
				
				//결제수단 정보 저장
				$("#pay_method_reserve_checkbox").each(function() {
					var selected_radio = null;
					var pay_mean_cd = "";
					var cardcomp_no = "";
					var kakao = "";
					var kakaopay = "";
					var payco = "";
					var toss = "";
					var naverpay = "";
					var bank_cd = "";
					if (this.checked) {
						selected_radio = $("a[name='ord_pay_radio'].selected");
						pay_mean_cd = selected_radio.attr("pay_mean_cd");
						cardcomp_no = "";
						kakao = "";
						kakaopay = "";
						bank_cd = "";
						if (pay_mean_cd == "11") {							
							cardcomp_no = $("#select_credit_card").val();
							kakao = selected_radio.attr("kakao");
							kakaopay = selected_radio.attr("kakaopay");
							payco = selected_radio.attr("payco");
							toss = selected_radio.attr("toss");
							naverpay = selected_radio.attr("naverpay");
						} else if (pay_mean_cd == "13") {
							bank_cd = ORDER.fn.select_vbank.val();
						};
					};
					elandmall.util.setCookie({ name: "reserved_pay_mean_cd", value: pay_mean_cd, age: 365*10, secure: true, path: "/order" });					
					elandmall.util.setCookie({ name: "reserved_cardcomp_no", value: cardcomp_no, age: 365*10, secure: true, path: "/order" });
					elandmall.util.setCookie({ name: "reserved_kakao", value: kakao, age: 365*10, secure: true, path: "/order" });
					elandmall.util.setCookie({ name: "reserved_kakaopay", value: kakaopay, age: 365*10, secure: true, path: "/order" });
					elandmall.util.setCookie({ name: "reserved_toss", value: toss, age: 365*10, secure: true, path: "/order" });
					elandmall.util.setCookie({ name: "reserved_naverpay", value: naverpay, age: 365*10, secure: true, path: "/order" });
					elandmall.util.setCookie({ name: "reserved_payco", value: payco, age: 365*10, secure: true, path: "/order" });
					elandmall.util.setCookie({ name: "reserved_bank_cd", value: bank_cd, age: 365*10, secure: true, path: "/order" });
				});
				
				$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {	//배송정보 최종 확인(누락방지)
					var dlvp = this;
					$.each(dlvp.ord_deli, function(dlvp_seq) {
						var deli_ord_qty = 0;						
						$.each(this.ord_goods, function(cart_seq) {
							deli_ord_qty += this.ord_qty;
						});
						if (deli_ord_qty > 0) {
							var address = dlvp.address;
							if (dlvp.cart_grp_cd == "10" || dlvp.cart_grp_cd == "20" || dlvp.cart_grp_cd == "60" || dlvp.cart_grp_cd == "70") {	//택배, 디지털 상품권, 오늘받송, 하이퍼
								if ($.trim(address.recvr_nm) == "") {
									throw "받으시는 분 이름이 올바르지 않습니다!";
								};
								if ($.trim(address.recvr_cell_no1) == "" || $.trim(address.recvr_cell_no1).length != 3 || $.trim(address.recvr_cell_no2) == "" || $.trim(address.recvr_cell_no2).length < 3 || $.trim(address.recvr_cell_no3) == "" || $.trim(address.recvr_cell_no3).length != 4) {
									throw "받으시는 분 핸드폰정보가 올바르지 않습니다.";
								};
							};
							
							if(ORDER.mst.ord_mst.present_yn != "Y") {
								if (dlvp.cart_grp_cd == "10" || dlvp.cart_grp_cd == "60" || dlvp.cart_grp_cd == "70") {	//택배,오늘받송,하이퍼의 경우 배송지 정보 재확인(누락 방지)
									if (($.trim(address.recvr_post_no) == "" || $.trim(address.recvr_base_addr) == "" || $.trim(address.recvr_dtl_addr) == "") && ($.trim(address.recvr_road_post_no) == "" || $.trim(address.recvr_road_base_addr) == "" || $.trim(address.recvr_road_dtl_addr) == "")) {
										throw "배송지 정보가 올바르지 않습니다.";
									};
								};
							}
						};
					});
				});
				
				// 데이터 pin에 저장
				$.extend(orderPin, {
						insur_yn : insur_yn,
						birth_day : birth_day,
						gend_cd : gend_cd,
						cash_receipt_issue_cd : cash_receipt_issue_cd,				
						cash_receipt_use_divi_cd : cash_receipt_use_divi_cd,
						cash_receipt_cert_no : cash_receipt_cert_no,
						refund_req_type_cd : refund_req_type_cd,
						refund_req_bank_cd : refund_req_bank_cd,
						refund_req_depor_nm : refund_req_depor_nm,
						refund_req_account_no : refund_req_account_no,
						account_owner_mgmt : account_owner_mgmt
					});
				
				//배송지연 알림창
				if(is_deli_hope_yn) {
					ORDER.fn.confirmMsg(orderPin);
				}else {
					ORDER.fn.doPlugin(orderPin);
				}
				
			} catch (e) {
				ORDER.fn.restoreOrder(e);			 
			};
		},
		doPlugin:function(p){
			
			ORDER.payments.callPlugin({ 	//결제 플러그인 호출
				callback: function(data) {
					data.order_data.ord_mst.insur_yn = p.insur_yn;
					data.order_data.ord_mst.birth_day = p.birth_day;
					data.order_data.ord_mst.gend_cd = p.gend_cd;
					data.order_data.ord_mst.cash_receipt_issue_cd = p.cash_receipt_issue_cd;								
					data.order_data.ord_mst.cash_receipt_use_divi_cd = p.cash_receipt_use_divi_cd;
					data.order_data.ord_mst.cash_receipt_cert_no = p.cash_receipt_cert_no;
					data.order_data.ord_mst.refund_req_type_cd = p.refund_req_type_cd;
					data.order_data.ord_mst.refund_req_bank_cd = p.refund_req_bank_cd;
					data.order_data.ord_mst.refund_req_depor_nm = p.refund_req_depor_nm;
					data.order_data.ord_mst.refund_req_account_no = p.refund_req_account_no;
					if ($("#orderer_nm_checkbox_new").is(":checked")) {	//주문자 정보 변경일 경우
						data.order_data.ord_mst.orderer_nm = $.trim($("#new_orderer_nm").val());
						data.order_data.ord_mst.email = $.trim($("#new_email").val());
						data.order_data.ord_mst.cell_no1 = $("#new_cell_no1").val();
						data.order_data.ord_mst.cell_no2 = $.trim($("#new_cell_no2").val());
						data.order_data.ord_mst.cell_no3 = $.trim($("#new_cell_no3").val());
					};
					
					// 개인통관고유부호가 있을 경우 
					if($("#customs_id").val() != ""){
						data.order_data.ord_mst.customs_id = $.trim($("#customs_id").val());
					}					

					data.order_data.ord_mst.cert_no = $.trim($("#cert_no").val());					
					
					if (p.account_owner_mgmt) {
						data.order_data.account_owner_mgmt = p.account_owner_mgmt;
					};
					$.each(data.order_data.ord_pays, function() {
						if (this.pay_mean_cd== "13") {
							var bank = ORDER.pay.pays[this.pay_seq].getBank();
							this.bank_cd = bank.bank_cd;
							this.morc_nm = bank.morc_nm;
							this.expiry_date = bank.expiry_date;
							this.expiry_dtime = bank.expiry_dtime;
						};
					});
					data.order_data.return_values = ORDER.mst.return_values;
					
					var ga_category = '';
					var mstResult = ORDER.mst.return_values;
					for(var key in mstResult){
						if('form_ga_category_nm' == Object.keys(mstResult[key]).toString()){
							ga_category = mstResult[key].form_ga_category_nm;
						}
					}

					dataLayer.push({		//구매하기 버튼 클릭 태깅
						event: "checkout",
						ecommerce: {
							checkout: {
								actionField: {
									step: 2,
									option: (function() {
										var option = "";
										$.each(data.order_data.ord_pays, function() {
											var cardcomp;
											var bank;
											if (this.pay_mean_cd == "11") {	//신용카드
												cardcomp = ORDER.pay.pays[this.pay_seq].getCardcomp();
												if (cardcomp.kakao === true) {
													option = "카카오페이";
												} else if (cardcomp.kakaopay === true) {
													option = "카카오페이";
												} else if (cardcomp.payco === true) {
													option = "페이코";
												} else if (cardcomp.toss === true) {
													option = "토스";
												} else if (cardcomp.naverpay === true) {
													option = "네이버페이";
												} else {
													option = "신용카드:" + ORDER.pay.usable_settles[this.pay_mean_cd][cardcomp.cardcomp_cd].settle_dtl_nm;												
												};
												return false;
											} else if (this.pay_mean_cd == "13") {	//무통장
												bank = ORDER.pay.pays[this.pay_seq].getBank();
												option = "무통장입금:" + ORDER.pay.usable_settles[this.pay_mean_cd][bank.bank_cd].settle_dtl_nm;
												return false;
											} else if (this.pay_mean_cd == "12") {	//실시간
												option = "실시간계좌이체";
												return false;
											}else if (this.pay_mean_cd == "14") {	//휴대폰 결제
												option = "휴대폰 결제";
												return false;
											}else if (this.pay_mean_cd == "15") {	//통합포인트
												option = "통합포인트";
												return false;
											}else if (this.pay_mean_cd == "21") {	//예치금
												option = "예치금";
												return false;
											}
										});
										return option;
									})()
								},
								products: (function() {
									var goods = [];
									$.each(ORDER.goods.ord_goods, function(cart_seq) {
										
										var brand_nm = this.brand_nm;
										if(brand_nm == null || brand_nm == ''){
											brand_nm = 'U';
										}
										
										
										var coupon_nm = '';
										$.each(ORDER.benefits.cart_benefits[cart_seq], function() {
											if (this.select_yn == "Y" && this.apply_poss_yn == "Y" && this.promo_type_no == '1000000005') {
												coupon_nm = this.promo_nm;
											};			
										});
										
										var ga_variant = "옵션없음";
										if(typeof(this.item_nm) != "undefined"){
											ga_variant = this.item_nm.replaceAll(",","/");
										}
										
										goods.push({
											name: this.disp_goods_nm,
											id: this.goods_no,
											price: this.sale_price,
											brand: brand_nm,
											category: ga_category,
											coupon: coupon_nm,
											variant: ga_variant,
											quantity: this.ord_qty,
											dimension10: this.set_goods_no
										});
									});
									return goods;
								})()
							}
						}
					});
					
					try {
						$.each(data.order_data.ord_pays, function() {
							var pay = this;
							if (pay.pay_mean_cd != "13" && pay["_payments_"] && (pay["_payments_"].form_data || pay["_payments_"].payco === true || pay["_payments_"].naverpay === true || pay["_payments_"].lguplus === true)) {	//무토장 입금을 제외한 KSPay, Payco
								var callback = (function() {
									if (pay["_payments_"].form_data && pay.pay_mean_cd != "14") {
										return function() {
											if (($("#_KSPAY_FORM_").length > 0)) {
												$("#_KSPAY_FORM_").remove();
											};
											var form = ORDER.payments.createForm({
												id: "_KSPAY_FORM_",
												method: "post",									
												action: pay["_payments_"].form_data.kspay_url,
												accept_charset:"utf-8"
											});
											$.each(pay["_payments_"].form_data, function(k, v) {
												form.addInput({ name: k, value: v });
											});
											form.appendBody();	//form을 body에 append 하지 않으면 IE에서는 form을 인식 못하는 것 같음
											form.form.submit();
										};
									} else if (pay["_payments_"].form_data && pay.pay_mean_cd == "14") {
										return function() {
											if (($("#_SETTLBANK_FORM_").length > 0)) {
												$("#_SETTLBANK_FORM_").remove();
											};
											var form = ORDER.payments.createForm({
												id: "_SETTLBANK_FORM_",
												method: "post",									
												action: pay["_payments_"].form_data.settlebank_url,
												accept_charset:"utf-8"
											});
											$.each(pay["_payments_"].form_data, function(k, v) {
												form.addInput({ name: k, value: v });
											});
											form.appendBody();	//form을 body에 append 하지 않으면 IE에서는 form을 인식 못하는 것 같음
											form.form.submit();
										};
									} else if (pay["_payments_"].payco === true) {
										return function() {
											window.location.href = pay["_payments_"].orderSheetUrl;
										};
									} else if (pay["_payments_"].naverpay === true) {
										return function() {
											ORDER.payments.naverpay.open();
										};
									} else if (pay["_payments_"].lguplus === true) {
										return function() {
											ORDER.payments.lguplus.open('');
										};
									};
								})();
								//주문데이타 값을 세션에 저장
								$.ajax({	//주문 데이타 생성
									url: "/order/registOrderData.action",
									type: "POST",
									dataType: "json",
									data: { order_data: JSON.stringify(data.order_data) },
									success: function(data) {
										callback();
									},
									error: function(m) {
										var message = "주문 저장중 오류가 발생했습니다.";
										ORDER.payments.throwError(message);
									}
								});
								throw null;
							}else if(pay.pay_mean_cd == "13" || (pay.pay_mean_cd == "11" && !pay["_payments_"])){ //무통장,카카오페이(_payments_ 객체를 사용하지 않는 결제수단)
								//주문데이타 값을 세션에 저장
								$.ajax({	//주문 데이타 생성
									url: "/order/removeOrderData.action",
									type: "POST",
									dataType: "json",
									data: { order_data: JSON.stringify(data.order_data) },
									success: function(data) {
										
									},
									error: function(m) {
										var message = "주문 저장중 오류가 발생했습니다.";
										ORDER.payments.throwError(message);
									}
								});
							};
						});
						
						//kspay 호출 없이 주문생성
						if (($("#_ORDER_FORM_").length > 0)) {
							$("#_ORDER_FORM_").remove();
						};
						var form = ORDER.payments.createForm({
							id: "_ORDER_FORM_",
							method: "post",									
							action: "/order/registOrder.action",
							accept_charset:"utf-8"
						});
						form.addInput({ name: "order_data", value: JSON.stringify(data.order_data) });
						form.addInput({ name: "ga_category", value: encodeURIComponent(ga_category)});
						form.appendBody();
						form.form.submit();
					} catch (e) {
						if (e != null) {
							ORDER.fn.restoreOrder(e);
						};
					};
				},
				throwError: function(e) {
					ORDER.fn.restoreOrder(e);
				}
			});		
		},
		restoreOrder: function(e) {
			ORDER.orderStop();
			ORDER.fn.doOrder = function() {
				ORDER.fn.registOrder();
			};
			if ($.type(e) == "function") {
				e();
			} else {
				alert(e);				
			};
		},
		confirmMsg:function(p){
		    elandmall.layer.createLayer({

				createContent: function(layer) {
					layer.div_content.append(
							"<div class=\"txt\"></div>" +
							"<div class=\"stxt\">고객님께서 희망하는 날짜에 배송이 불가능 할 수도 있습니다. 배송이 불가능 할 경우 순차적으로 연락을 드리오니 이 점 양해바랍니다.<br/> 감사합니다.</div>" +
							"<ul class=\"btn_area\">" +
							"	<li><a href=\"javascript:;\" class=\"btn_bg06 c01 popclose\" >확인</a></li>" +
							"</ul>"	
	
					);
					layer.div_content.find("a.popclose").click(function() {
							layer.close();
							ORDER.fn.doPlugin(p);
					});
					layer.show();
				}
			});
		},
		agreeAllCheck:function(p){
			var isChecked = $("#all_arg").is(":checked");
			if($("#order_agree_checkbox_1").length > 0 ) {
				if($("#order_agree_checkbox_1").is(":checked") != isChecked ){
					$("#order_agree_checkbox_1").click();
				}
			}
			
			if($("#order_agree_checkbox_3").is(":checked") != isChecked){
				$("#order_agree_checkbox_3").click();
			}

			if($("#order_agree_checkbox_2").length > 0 ) {
				if($("#order_agree_checkbox_2").is(":checked") != isChecked){
					$("#order_agree_checkbox_2").click();
				}
			}
			
			if($("#order_agree_checkbox_4").length > 0 ) {
				if($("#order_agree_checkbox_4").is(":checked") != isChecked){
					$("#order_agree_checkbox_4").click();
				}
			}
	   }
	});	
});