/**
 * 업무관련(공통 레이어) 
 */
;(function($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	
	if ($.type(window.elandmall.popup) != "object") {
		window.elandmall.popup = {};		
	};
	
	
	elandmall.popup = {
		/**
		 * 사용방법
		 * elandmall.popup.postLayer({ callback:function(pin){},);
		 * 
		 * 리턴값
		 * callback({
		 * 		city_exp_yn : 도서산간 여부
		 * 		area_divi_cd : 지역구분코드(ST0013)
		 * 		addr_gb : 주소 검색 구분 값 10:지번 20:도로명(ST0043)
		 * 		j_post_no : 지번 우편번호
		 * 		j_base_addr :  지번 기본주소
		 * 		j_dtl_addr : 지번 상세주소
		 * 		r_post_no : 도로명 우편번호
		 * 		r_base_addr : 도로명 기본주소
		 * 		r_dtl_addr : 도로명 상세주소
		 * });
		 */
		postLayer : function( p ) {	// 주소 찾기 팝업
			elandmall.layer.createLayer({
				layer_id:"post_layer",
				title: "주소 찾기",
				close_call_back : p.close_call_back,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initPostNoList.action", function() {
						layer.show();
						// 엔터키
						div.on("keydown", "[name=sch_nm], #set_addr", function(e){
							if (window.event.keyCode == 13) {
								 e.preventDefault();
								 $("[name=sch_nm], #set_addr").attr('readonly', 'readonly');
							 	 $("[name=sch_nm], #set_addr").attr('disabled', 'true');
							 	 setTimeout(function() {
									 $("[name=sch_nm], #set_addr").blur();
									 $("[name=sch_nm], #set_addr").removeAttr('readonly');
									 $("[name=sch_nm], #set_addr").removeAttr('disabled');
								 }, 100); 
								$(this).next("button").click();
							}
						});
						
						// 검색
						div.on("click", "[id=postNoSearch]", function(){
							var adrPopup = $(this).closest(".pop_txt");
							fnSearchPostNoBodyListAjax(adrPopup, false);
						});	
						
						// 더보기
						div.on("click", "[id=postNoMore]", function(){
							var adrPopup = $(this).closest('.pop_txt');
							var pageIdx = $("#page_idx",adrPopup).text();
							var totPage = $("#tot_page",adrPopup).text();
							console.log(Number(pageIdx) >= Number(totPage));
							if(Number(pageIdx) >= Number(totPage)) {
								// 마지막 페이지일경우 더보기 중단
								return false;
							}
							
							$("[name=sch_nm], #set_addr").attr('readonly', 'readonly');
						 	$("[name=sch_nm], #set_addr").attr('disabled', 'true');
						 	setTimeout(function() {
						 		$("[name=sch_nm], #set_addr").blur();
								$("[name=sch_nm], #set_addr").removeAttr('readonly');
								$("[name=sch_nm], #set_addr").removeAttr('disabled');
							}, 100); 
						 	 
							fnSearchPostNoBodyListAjax(adrPopup, true);
						});
					
						// 주소 선택
						div.on("click", "[name=select_addr]", function(e){
							e.preventDefault();

							var trgtTr = $(this).parents("tr");
							var addrGb = $(this).data("addr_gb");
							var post_no = $("#post_no", trgtTr).val();
							var addr = $("#addr_admin", trgtTr).val();

							if ($("#regist_order_button").attr("today_receive") == "Y" || p.today_receive == "Y") {
								// 주문서..
								$.ajax({
									url: '/order/checkTodayDeliAdd.action',
									dataType: "json",
									data: {post_no : post_no, recvr_base_addr : addr},
									success: function(data) {
										if(data.result != "0000") {
											alert("오늘도착 상품은 서울만\n배송가능합니다\n배송지를 다시 확인해주세요.");
											return;
										} else {
											elandmall.postPopup.addUse(trgtTr, addrGb, p.callback);
											layer.close();
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
								elandmall.postPopup.addUse(trgtTr, addrGb, p.callback);
								layer.close();
							}
						});

						// 초기화
						var fnReSet = function( obj ){
							//전체 입력폼 삭제
							$("select, input", obj).val('');
							
							$(".sch_box", obj).show();
							$("[id$=_result]", obj).hide();
							$("[id$=_result]", obj).html('');

							//상세입력폼
							$("#rfnAdderList", obj).hide();		// 상세 입력 화면 숨김
							$("#div_research", obj).show();	// 다시검색 버튼 활성화
							$("#set_post_no", obj).text('');
							$("#set_base_addr", obj).text('');
							$("#div_rfn_addr", obj).text('');		//변환주소
						}
					});
					
					var fnSearchPostNoBodyListAjax = function( targetObj, isMoreSearch) {
						var p = elandmall.postPopup.addrSearch(targetObj);	//sch_nm 설정
						if(!p) { return false; }	//검색어 입력 안했을 경우;
						// 더보기 일경우 page추가
						if(isMoreSearch) {
							p = $.extend({ page: $('#page_idx', targetObj).text() }, p);
						} else {
							$('#adr_search_results .board_scroll').scrollTop(0);
						}

						$.ajax({
							url: '/popup/searchPostNoBodyListAjax.action',
							dataType: "json",
							data: p,
							success: function(data) {
								// 검색 안내문구 숨기기
								$("div.txt_info", targetObj).first().hide();
								$("div.txt_info2", targetObj).hide();
								$(".addr_more", targetObj).hide();

								var result = data.results;
								var docCount = result.doc_count;
								var pageIdx = result.page_idx;
								var disp_pageIdx = Number(pageIdx)+1;
								var docResult = result.doc_result;

								if(docCount == 0) {
									// 검색결과 없음
									$("div.txt_info2", targetObj).show();
									$(".txt_data_info", targetObj).addClass("no_data").text("검색결과가 없습니다.");

									$('#result_body').empty();
									$(".adr_sreach_results", targetObj).removeClass("on");
								} else {
									if(docCount >= 200) {
										// 검색결과 200건 이상
										$("div.txt_info2", targetObj).show();
										$(".txt_data_info", targetObj).removeClass("no_data").html("<em>"+p.sch_nm+"</em>에 대한 검색결과가 너무 많습니다.");
									}
									
									//NGCPO-7386 주소찾기 레이어 하단영역 미노출 수정 건										
									var con_all_h = $('#post_layer .pop_txt.post').outerHeight() - 30; //팝업 컨텐츠 전체높이
									var con_input_h = $('.pop_txt.post .search_btns').outerHeight() + 13; //주소검색창 높이
									var con_info_h = 0; //검색정보 영역높이
									if($('.txt_info2').css("display") != "none"){
										con_info_h += $('.txt_info2').outerHeight()
									}
									var con_result_h = $('.adr_sreach_results').outerHeight() + 8; //검색결과 영역높이
									var con_minus_h = con_input_h + con_info_h + con_result_h; //제거 될 높이값 측정
									var con_h = con_all_h - con_minus_h; //결과값 적용될 높이값
									$('#adr_search_results .board_scroll').css('height',con_h);
									
									
									// 50건 이상일 경우 더보기 버튼 노출
									if(docCount > 50) {
										// $('.addr_more', targetObj).show(); 모바일은 스크롤 처리
										$('#ipt_page_idx', targetObj).text(pageIdx);
										$('#ipt_tot_page', targetObj).text(docCount/pageIdx);
										$('#ipt_doc_count', targetObj).val(docCount);

										$('#page_idx', targetObj).text(disp_pageIdx);
										$('#tot_page', targetObj).text(Number(docCount)%50 == 0 ? parseInt(Number(docCount)/50) : parseInt(Number(docCount)/50) + 1);
									}

									// 주소 결과 show
									$(".adr_sreach_results", targetObj).addClass("on");									
									$('#adr_result_count').text(docCount);	// 총 건수
									if(!isMoreSearch) {$('#result_body').empty();}	// 재검색(검색버튼 재클릭)
									
									$.each(docResult, function(idx, doc) {
										
										// dom 요소
										var tr = $('<tr></tr>');

										var td = $('<td></td>');
										
										// 결과 한줄당 내부 테이블
										var table_inn = $('<table></table>').addClass('inner_active');
										var colgroup_inn = $('<colgroup></colgroup>');
										var col1_inn = $('<col />').css('width', '57px');
										var col2_inn = $('<col />').css('width', '399px');
										var tbody_inn = $('<tbody></tbody>');

										// 우편번호 tr
										var tr_zipcode_inn = $('<tr></tr>');
										var td_zipcode_title_inn = $('<td></td>');
										var div_zipcode_inn = $('<div></div>').addClass('zipcode').text(doc.post_no);
										var td_zipcode_cont_inn = $('<td></td>');
								
										td_zipcode_title_inn.append(div_zipcode_inn);
										tr_zipcode_inn.append(td_zipcode_title_inn)
											.append(td_zipcode_cont_inn);

										// 도로명 tr
										var tr_road_inn = $('<tr></tr>');
										var td_road_title_inn = $('<td></td>')
										var div_road_title_inn = $('<div></div>').addClass('road');
										var span_road_title_inn = $('<span></span>').text('도로명');
										var td_road_cont_inn = $('<td></td>');
										var div_road_cont_inn = $('<div></div>').addClass('addr_road');
										var a_road_addr	 = $('<a />').attr({'name':'select_addr', "href":"javascript:;", "data-addr_gb":"20"}).text(doc.addr_road);
										
										div_road_title_inn.append(span_road_title_inn)
										td_road_title_inn.append(div_road_title_inn);
										div_road_cont_inn.append(a_road_addr);
                                        td_road_cont_inn.append(div_road_cont_inn);
                                        tr_road_inn.append(td_road_title_inn)
											.append(td_road_cont_inn);

										// 지번 tr
										var tr_jibun_inn = $('<tr></tr>')
										var td_jibun_title_inn = $('<td></td>')
										var div_jibun_title_inn = $('<div></div>').addClass('num');
										var span_jibun_title_inn = $('<span></span>').text('지번');
										var td_jibun_cont_inn = $('<td></td>');
										var div_jibun_cont_inn = $('<div></div>').addClass('addr_num');
										var a_jibun_addr	 = $('<a />').attr({'name':'select_addr', "href":"javascript:;", "data-addr_gb":"10"}).text(doc.addr_jibun);
										
										div_jibun_title_inn.append(span_jibun_title_inn)
										td_jibun_title_inn.append(div_jibun_title_inn);
										div_jibun_cont_inn.append(a_jibun_addr);
                                        td_jibun_cont_inn.append(div_jibun_cont_inn);
                                        tr_jibun_inn.append(td_jibun_title_inn)
											.append(td_jibun_cont_inn);


										// input hidden
										var ipt_post_no = $("<input type='hidden' id='post_no' />").val(doc.post_no);
										var ipt_addr_road = $("<input type='hidden' id='addr_road' />").val(doc.addr_road);
										var ipt_addr_jibun = $("<input type='hidden' id='addr_jibun' />").val(doc.addr_jibun);
										var ipt_area_divi_cd = $("<input type='hidden' id='area_divi_cd' />").val(doc.area_divi_cd);
										var ipt_city_exp_yn = $("<input type='hidden' id='city_exp_yn' />").val(doc.city_exp_yn);
										var ipt_admin_dong_nm = $("<input type='hidden' id='admin_dong_nm' />").val(doc.admin_dong_nm);
										var ipt_addr_admin = $("<input type='hidden' id='addr_admin' />").val(doc.addr_admin);//
										
										// input hidden 값 셋팅
										tr.append(ipt_post_no)
											.append(ipt_addr_road)
											.append(ipt_addr_jibun)
											.append(ipt_area_divi_cd)
											.append(ipt_city_exp_yn)
											.append(ipt_admin_dong_nm)
											.append(ipt_addr_admin);

										// dom 구성
										colgroup_inn.append(col1_inn)
											.append(col2_inn);
										tbody_inn.append(tr_zipcode_inn)
											.append(tr_road_inn)
											.append(tr_jibun_inn);
										table_inn.append(colgroup_inn)
											.append(tbody_inn);

										td.append(table_inn);
										tr.append(td);

										// dom append
										$('#result_body').append(tr); 
									});
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
					} // fnSearchPostNoBodyListAjax 함수 종료
				}
			});
		},
		
		/**
		 * 사용방법
		 * elandmall.popup.myDlvpListLayer({ callback:function(pin){},);
		 * 
		 * 리턴값
		 * callback({
		 * 		name : 이름
		 * 		tel_no1 : 전화번호1
		 * 		tel_no2 : 전화번호2
		 * 		tel_no3 : 전화번호3
		 * 		cel_no1 : 휴대전화1
		 * 		cel_no2 : 휴대전화2
		 * 		cel_no3 : 휴대전화3
		 * 		j_post_no : 지번 우편번호
		 * 		j_base_addr :  지번 기본주소
		 * 		j_dtl_addr : 지번 상세주소
		 * 		r_post_no : 도로명 우편번호
		 * 		r_base_addr : 도로명 기본주소
		 * 		r_dtl_addr : 도로명 상세주소
		 * 		deli_msg : 배송메세지
		 * 		city_exp_yn : 도서산간 여부
		 * 	});
		 */
		myDlvpListLayer : function( p ) { // 나의 배송지 팝업
			var param = $.extend({}, p.param || {});
			elandmall.layer.createLayer({
				layer_id : "dlvp_layer", 
				class_name: "layer_fix myaddr",
				title: "나의 배송지 목록",
				close_call_back : p.close_call_back,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/searchMyDlvpListLayer.action", param, function() {
						layer.show();
						
						$(function(){
							$(".pop_con .tbl_ship tr").bind("click", function(){
								shipId = $(this).index();

								$(".pop_con .tbl_ship th input").removeAttr('checked');
								$(".pop_con .tbl_ship th input").eq(shipId).attr('checked', true);
							});
						});
						
						// 배송지 선택
						$("#addrSelect").click( function(){
							var parentObj = $("[name=rdo_ship]:checked").parents("tr");
							var tel_no = parentObj.find("[name=tel_no]").val().split("-");
							var cell_no = parentObj.find("[name=cell_no]").val().split("-");
							var road = parentObj.find("[name=road]").val().split("|||");
							var jibun = parentObj.find("[name=jibun]").val().split("|||");
							var addr_divi_cd = parentObj.find("[name=addr_divi_cd]").val();
							var mbr_dlvp_seq = parentObj.find("[name=mbr_dlvp_seq]").val();
							var dlvp_nm = parentObj.find("[name=dlvp_nm]").val();
							var email = parentObj.find("[name=email]").val();
							var base_yn = parentObj.find("[name=base_yn]").val();
							
							// callback
							if ($.type(p.callback) == "function") {
								p.callback( {
									mbr_dlvp_seq: mbr_dlvp_seq,
									dlvp_nm: dlvp_nm,
									base_yn : base_yn,
									email: email,
									name : parentObj.find("[name=rcv_name]").val(),
									addr_divi_cd : addr_divi_cd,
									tel_no1 : tel_no[0],
									tel_no2 : tel_no[1],
									tel_no3 : tel_no[2],
									cel_no1 : cell_no[0],
									cel_no2 : cell_no[1],
									cel_no3 : cell_no[2],
									j_post_no : jibun[0],
									j_base_addr : jibun[1],
									j_dtl_addr : jibun[2],
									r_post_no : road[0],
									r_base_addr : road[1],
									r_dtl_addr : road[2],
									deli_msg: $("[name=deli_msg]", parentObj).val(),
									city_exp_yn : $("[name=city_exp_yn]", parentObj).val()
								} );
							};
							layer.close();
						});
						
						// 배송지 선택
						$("#close_layer").click( function(){
							layer.close();
						});
					});
				}
			});
		},
		/**
		 * 사용방법
		 * 무이자 할인 레이어 팝업
		 * elandmall.goodDetailNointLayer({ });
		 */
		goodDetailNointLayer : function(p) {
			if ( $("#card_layer").length>0 ){
				if(elandmall.global.app_cd != "" ){
					location.href="elandbridge://tabbar/hide/";
				}else{
					if(elandmall.global.disp_mall_no == "0000053"){
						$('body').addClass('activate_flyr');
					}
				}
				fn_layer_open("card_layer");
			}else{
				if ( $("#bundle_detail").length > 0 ) {
					elandmall.layer.createLayerForLayer({
						layer_id:"card_layer",
						title: "무이자 할부 혜택",
						close_call_back:function() {
							layer_fix_close2('card_layer');
							if(elandmall.global.app_cd != "" ){
								location.href="elandbridge://tabbar/show/";
							}
						},
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/goods/searchGoodsNointLayer.action", p,  function() {
								
								if ( $("#nointCnt", div).val() > 0 ){
									if(elandmall.global.app_cd != "" ){
										location.href="elandbridge://tabbar/hide/";
									}
									layer.show();
									
								}
							});
						}
					});
					
				}else{
					elandmall.layer.createLayer({
						layer_id:"card_layer",
						title: "무이자 할부 혜택",
						close_call_back:function() {
							layer_fix_close('card_layer');
							if(elandmall.global.app_cd != "" ){
								location.href="elandbridge://tabbar/show/";
							}else{
								if(elandmall.global.disp_mall_no == "0000053"){
									$('body').removeClass('activate_flyr');
								}
							}
						},
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/goods/searchGoodsNointLayer.action", p,  function() {
								
								if ( $("#nointCnt", div).val() > 0 ){
									if(elandmall.global.app_cd != "" ){
										location.href="elandbridge://tabbar/hide/";
									}else{
										if(elandmall.global.disp_mall_no == "0000053"){
											$('body').addClass('activate_flyr');
										}
									}
									layer.show();
									
								}
							});
						}
					});
				}
			}
		},
		/** 
		 *  장바구니 담기 결과레이어
		 */
		cartResultLayer : function(p) {
			var layer_id = elandmall.cart.layer_id;
			var param = $.extend({type:"CART"},p);	

			if(elandmall.global.disp_mall_no == "0000045"){ //킴스클럽
				if(param.wife_cart_running_yn != 'Y'){ //아내의식탁에서 마지막 장바구니 호출일때
					elandmall.cart.closeLayer();
					var kmsCartLayer = $('<div class="lyr_alert_cart" role="alertdialog" id="'+layer_id+'"></div>');
					if ( $("#bundle_detail").length > 0 ) { // 상품상세 레이어 z-index 101
						kmsCartLayer.css({"z-index": 105});
					}

					var content = $("<div></div>");
					kmsCartLayer.append(content);

					if (p.cart_goods_qty <= 1) {
						content.append($('<p><span class="ok">장바구니에 저장되었습니다.</span></p>'));
					} else {
						if (param.wife_cart_end_yn == 'Y') { //아내의식탁에선 장바구니 수량표시 X
							content.append($('<p><span class="ok">장바구니에 저장되었습니다.</span></p>'));
						} else {
							content.append($('<p><span>이미 저장된 상품으로<br>장바구니 수량이 <b>'+ p.cart_goods_qty +'</b>개 되었습니다.</span></p>'));
						}
					}
					kmsCartLayer.appendTo(document.body);
					msgCart(p.eventOpt);
				}
			} else {
				elandmall.layer.createLayerForLayer({
					layer_id: layer_id,
					class_name:"layer_pop nodim",
					close_call_back: (param["type"]=="CART")?elandmall.cart.closeLayer:"",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/popup/initCartResultLayer.action", param ,function() {
							layer.show();
							
							$("#goCartBtn").click(function(){
								layer_fix_close(layer_id);
								if(elandmall.global.disp_mall_no == "0000053"){	//슈펜 모바일일 경우 슈펜장바구니로 이동
									elandmall.shoopen.goShoopenCart();
								} else {
									elandmall.hdLink('CART');
								}
							});
							
							if(param["type"] == "CART"){
								setTimeout(function() {
					                $("#" + layer_id).fadeOut(200, function(){
					                	elandmall.cart.closeLayer();
					                	if(elandmall.global.disp_mall_no == '0000053'){
					                		fn_layer_close(layer_id);
					                	}
					                });				                
					            }, 2000);  
								$("a.btn_close", $("#" + layer_id)).on("click", function(){
									elandmall.cart.closeLayer();
									if(elandmall.global.disp_mall_no == '0000053'){
				                		fn_layer_close(layer_id);
				                	}
								});
							}
						});
					}
				});
			}
		},
		
		/** 
		 *  상품상세 매장 수령 레이어
		 */
		storeReceiptLayer : function(p) {
			var param = $.extend({}, p || {});
			elandmall.layer.createLayer({
				layer_id: "storeReceipt",
				title : "수령 매장 선택하기",
				class_name:"layer_fix myaddr",
				pickup_yn : "Y",
				close_call_back:function() {

				},
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initStoreReceiptLayer.action",param, function() {
						layer.show();
						$("#result_close", div).on("click", function(){
							if($('input[name="rdo_ship"]').index($('input[name="rdo_ship"]:checked')) > -1){
								
								var shopSel = $('input[name="rdo_ship"]:checked');
								
								var rShopCode = shopSel.attr('data-shop_code');
								var rShopName = shopSel.attr("data-shop_name");
								var rSaleQty  = shopSel.attr("data-sale_qty");
								
								var p = $.extend({shopCode : rShopCode , shopName : rShopName, saleQty : rSaleQty,  classkey: param.classkey}, param || {});
								if( param.cust_prod_yn == "Y" ){
									elandmall.goodsDetail.fnCallbackResultStore(p);
								}else{
									elandmall.goodsDetail.fnCallbackResultStoreNormal(p);
								}
								
								layer_fix_close("storeReceipt");
							}else{
								alert("매장을 선택해 주세요.");
								return false;
							}
							
						});
					});
					
					
					// 검색
					div.on("click", "#storeSearch", function(){ 

							var subDiv = $("#pickupShopResult");
							var params = div.find("#pickListForm").serialize();
							subDiv.load("/popup/searchStoreReceiptLayer.action", params, function() {
							});
					});
					
					
					div.on("keydown", "#shop_name", function(e){
		
						 if(e.keyCode == 13){
								var subDiv = $("#pickupShopResult");
								var params = div.find("#pickListForm").serialize();
								subDiv.load("/popup/searchStoreReceiptLayer.action", params, function() {
								});
						 }

					});
					
					// 닫기
					div.on("click", "a.btn_close", function(e){
						if( param.cust_prod_yn == "Y" ){
							closeCall();
						}else{
							$(".L"+param.classkey,"#choiceItemBox").remove();
							elandmall.goodsDetail.fnCallbackCloseStoreNormal(p);
							layer_fix_close("storeReceipt");	
						}
					});
					
					closeCall = function(){
						$(".L"+param.classkey,"#choiceItemBox").remove();
						var tmp_data = new Array();
				        for(var i=0; i<param.data.length; i++){
				        	var chk = false;
				        	var tmp_obj = param.data[i];
				        	if(tmp_obj.classkey == param.classkey ){
				        		delete param.data[i];
				        		chk = true;
				        	}
				        	if(!chk){
				        		tmp_data.push(tmp_obj);
				        	}
				        }
				        var p = $.extend({result_data : tmp_data}, param || {});
				        elandmall.goodsDetail.fnCallbackCloseStore(p);
				        layer_fix_close("storeReceipt");
					}
				}
			});
		},

		/*
		 * 내  용 : 상품리스트에서 장바구니 담기
		 * 필수 파라미터 : {
		 * 		goods_no: '',
		 * 		vir_vend_no: ''
		 * 		cart_divi_cd:''
		 * }
		 * */
		callCartAddGoods : function(p){
			
			var isComingSoonYn = (typeof(p.isComingSoonYn) != "undefiend")? p.isComingSoonYn : "";
			var isReservComingSoonYn = (typeof(p.isReservComingSoonYn) != "undefiend")? p.isReservComingSoonYn : "";
			var reserve_start_dtime = (typeof(p.reserve_start_dtime) != "undefiend")? p.reserve_start_dtime : "";
			var isGoodsTypeCd = (typeof(p.goods_type_cd) != "undefiend")? p.goods_type_cd : "";
			
			// N+1상품일 경우 alert처리(킴스클럽일 경우에만)
			if(elandmall.global.disp_mall_no == '0000045' && isGoodsTypeCd == '50'){				
				alert("N+1상품입니다.\n상품상세에서 확인해 주세요.");
				return;
			}
			
			if(isComingSoonYn == "Y"){
				alert(reserve_start_dtime.substr(0,4)+"년 "+ reserve_start_dtime.substr(4,2)+"월 "
						+ reserve_start_dtime.substr(6,2)+ "일 "+reserve_start_dtime.substr(8,2)+"시 "
						+ reserve_start_dtime.substr(10,2)+"분부터 구매 가능한 커밍순 상품입니다.");
				return false;
			}else if(isReservComingSoonYn == "Y"){
				alert(reserve_start_dtime.substr(0,4)+"년 "+ reserve_start_dtime.substr(4,2)+"월 "
						+ reserve_start_dtime.substr(6,2)+ "일 "+reserve_start_dtime.substr(8,2)+"시 "
						+ reserve_start_dtime.substr(10,2)+"분부터 구매 가능한 예약 상품입니다.");
				return false;
			}
			
			var callParam = {
					goods_no:p.goods_no,            //필수
					vir_vend_no : p.vir_vend_no,        //필수
					cart_divi_cd: p.cart_divi_cd,          //장바구니구분코드(MB0018)  <- 추가
					sale_shop_divi_cd: p.sale_shop_divi_cd,
					sale_shop_no: p.sale_shop_no,
					sale_area_no: p.sale_area_no,
					conts_dist_no:p.conts_dist_no,
					cart_grp_cd:p.cart_grp_cd,
					wife_cart_running_yn : p.wife_cart_running_yn,
					wife_cart_end_yn : p.wife_cart_end_yn
			}
			
			var optionLayerEvt = function() {
				elandmall.optLayerEvt.callCartCheck({
					param:callParam,
					callback:function(){
						if(typeof(p.click_obj) == "undefined"){ //옵션있을때
							if (elandmall.global.disp_mall_no == "0000045") { //킴스클럽에서 옵션있을때 별도 레이어처리
								var param_goods_no = (callParam["goods_no"] == null || callParam["goods_no"] == undefined) ? '' : callParam["goods_no"];
								var param_vir_vend_no = (callParam["vir_vend_no"] == null || callParam["vir_vend_no"] == undefined) ? '' : callParam["vir_vend_no"];
								var param_disp_ctg_no = (callParam["disp_ctg_no"] == null || callParam["disp_ctg_no"] == undefined) ? '' : callParam["disp_ctg_no"];
								var param_sale_shop_divi_cd = (callParam["sale_shop_divi_cd"] == null || callParam["sale_shop_divi_cd"] == undefined) ? '' : callParam["sale_shop_divi_cd"];
								var param_sale_area_no = (callParam["sale_area_no"] == null || callParam["sale_area_no"] == undefined) ? '' : callParam["sale_area_no"];
								var param_conts_dist_no = (callParam["conts_dist_no"] == null || callParam["conts_dist_no"] == undefined) ? '' : callParam["conts_dist_no"];
								var param_conts_divi_cd = (callParam["conts_divi_cd"] == null || callParam["conts_divi_cd"] == undefined) ? '' : callParam["conts_divi_cd"];
								var goDetailParam = "{goods_no:&apos;"+param_goods_no+"&apos;, vir_vend_no:&apos;"+param_vir_vend_no+"&apos;, disp_ctg_no:&apos;"+param_disp_ctg_no+"&apos;, sale_shop_divi_cd:&apos;"+param_sale_shop_divi_cd+"&apos;, sale_area_no:&apos;"+param_sale_area_no+"&apos;, conts_dist_no:&apos;"+param_conts_dist_no+"&apos;, conts_divi_cd:&apos;"+param_conts_divi_cd+"&apos;}";
								var kmsCartLayer = "";
								
								kmsCartLayer += "<div class='lyr_confirm' id='cartCnfm'>";
									kmsCartLayer += "<strong class='chk_txt'>옵션이 있는 상품입니다.<br>상품상세로 이동하시겠습니까?</strong>";
									kmsCartLayer += "<div class='btns'>";
										kmsCartLayer += "<button class='cancel' onclick='commonUI.lyrCnfmC(cartCnfm); $(&apos;#cartCnfm&apos;).remove();' keypress='this.onclick'><em>취소</em></button>";
										kmsCartLayer += "<button class='cnfm' id='cnfmBtn' onclick='commonUI.lyrCnfmC(cartCnfm); $(&apos;#cartCnfm&apos;).remove(); elandmall.goods.goDetail("+goDetailParam+");'><em>확인</em></button>";
									kmsCartLayer += "</div>";
								kmsCartLayer += "</div>";
								
								$(".container").append(kmsCartLayer);
								commonUI.lyrCnfmO(cartCnfm);
							} else {
								callParam["type"] = "OPT";
								elandmall.popup.cartResultLayer(callParam);
							}
						}else{
							callParam["click_obj"] = p.click_obj;
							elandmall.itemChangeLayer(callParam);
						}
					}
				});				
			}
			
			// 70 : 오늘직송의 경우 로그인 체크 && 주소체크
			if(callParam.cart_grp_cd == '70') {
				elandmall.isLogin({
					login:function() {
						optionLayerEvt();
					}
				});
			}else {
				optionLayerEvt();
			}
		},
		
		
		/*
		 * 내  용 : 쥬얼리시 상품 조회
		 * 필수 파라미터 : {
		 * 		goods_no: '',
		 * 		vir_vend_no: ''
		 * 		cart_divi_cd:''
		 * }
		 * */
		callGoDetail : function(p){
			if ( confirm("상품상세 페이지에서 옵션을 선택해주세요.") ){
		    	elandmall.goods.goDetail({ goods_no: p.goods_no, vir_vend_no: p.vir_vend_no });
		    }
		
		},

		fnNotiPop : function(p){
//			ElandmallEventListener.fnAddOnloadListener(function() {
				var html = "";
				var param = {
						type:"m", 
						disp_mall_no : p.disp_mall_no ,
						noti_clss_cd : p.noti_clss_cd ,
						rel_no : p.rel_no
				};
				if(elandmall.global.app_cd != ""){
					param = $.extend(param,{type_dtl: "app"});
				}
				$.ajax({
					url : "/popup/searchPopNotiList2.action",
					data : param,
					type : "get",
					dataType : "json",
					cache : true,
					success : function(data){
						if(data.data[0] != null && data.data[0].NOTI_NO != ""){
							var cookie = elandmall.util.getCookie("noti_"+data.data[0].NOTI_NO);
							if(cookie == "false") return;
							var noti_no = data.data[0].NOTI_NO;
							var cookieType = data.data[0].COOKIE_DISP_DIVI_CD;
							var list = data.data;
							var clsnm = "basicpop";
							var disp_mall_no = p.disp_mall_no;
							
							elandmall.layer.createLayer({
								layer_id:"main_pop",
								class_name:"notipop_layer",
								title: data.data[0].TITLE,
								createContent: function(layer) {
									layer.show();

							 		setTimeout(function(){
							 			$(".lnb_dim").css("display", "none");
							 			if(elandmall.global.app_cd != "" && elandmall.global.disp_mall_no != '0000053'){
							 				location.href="elandbridge://tabbar/show/";
							 			}
							  		}, 2000);	
								}  // createContent
							});   // elandmall.layer.createLayer

							if((data.data[0].WIDTH=='' && data.data[0].HEIGHT=='') || disp_mall_no == '0000123') clsnm = "fullpop"
							else clsnm = "basicpop";
							if(disp_mall_no == '0000123'){
								html += "<div class='layer_fix' style='display:block'>";
								html += "<div class='pop_con'>";
								html += "<div class='" + clsnm + "'>";
								html += "<div class='p_box'>";
								html += "<div class='p_img' style='opacity:0;filter:alpha(opacity=0)'>";
								html += "<div class='roll_wrap'>";
								html += "<div class='pagination'>";
								for(var i=0;i<list.length;i++){
									html += "<a href='#none' class='swiper-pagination-switch'>공지사항 배너" + i + "번</a>";
								}
								html += "</div>";
								html += "</div>";
								html += "<div class='swiper_container' id='noti_bn'>";
								html += "<ul class='swiper-wrapper'>";
								for(var i=0;i<list.length;i++){
									html += "<li class='swiper-slide'>";
									html += "<a href='#none'>" + list[i].NOTI_CONT + "</a>";
									html += "</li>";
								}
								html += "</ul>";
								html += "</div>";
								html += "</div>";
								html += "<div class='ch_today'>";
								if ( cookieType=="20" ) html += "<button type='button' class='p_today'><span>일주일간 보지 않기</span></button>";
								else if ( cookieType=="10" ) html += "<button type='button' class='p_today'><span>다시 보지 않기</span></button>";
								else html += "<button type='button' class='p_today'><span>오늘 하루 보지 않기</span></button>";
								html += "<button type='button' class='p_close'>닫기</button>";
								html += "</div>";
								html += "</div>";
								html += "</div>";
								html += "</div>";
								html += "</div>";

							}else{				
								html += "<div class='layer_fix' style='display:block'>";
								html += "<div class='pop_con'>";
								html += "<div class='" + clsnm + "'>";
								html += "<div class='p_box' style='opacity:0;filter:alpha(opacity=0)'>";
								html += "<div class='p_img' id='noti_bn'>";
								html += "<div class='roll_wrap'>";
								html += "<div class='roll_indi'>";
								for(var i=0;i<list.length;i++){
									html += "<a href='#none' class='swiper-pagination-switch'>공지사항 배너" + i + "번</a>";
								}
								html += "</div>";
								html += "</div>";
								html += "<div class='swiper_container'>";
								html += "<ul class='swiper-wrapper'>";
								for(var i=0;i<list.length;i++){
									html += "<li class='swiper-slide'>";
									html += "<a href='#none'>" + list[i].NOTI_CONT + "</a>";
									html += "</li>";
								}
								html += "</ul>";
								html += "</div>";
								html += "<div class='bp_btns'>";
								html += "<a href='#' class='bp_bt_prev d_prev'>이전 공지 배너</a>";
								html += "<a href='#' class='bp_bt_next d_next'>다음 공지 배너</a>";
								html += "</div>";
								html += "</div>";
								html += "<div class='ch_today'>";
								if ( cookieType=="20" ) html += "<button type='button' class='p_today'><span>일주일간 보지 않기</span></button>";
								else if ( cookieType=="10" ) html += "<button type='button' class='p_today'><span>다시 보지 않기</span></button>";
								else html += "<button type='button' class='p_today'><span>오늘 하루 보지 않기</span></button>";
								html += "<button type='button' class='p_close'>닫기</button>";
								html += "</div>";
								html += "</div>";
								html += "</div>";
								html += "</div>";
								html += "</div>";
							}

							$("#main_pop").find(".pop_txt").append(html);

							if ( noti_no!=null && noti_no.length > 0 ) {
								var $noti_wrapper = $("#noti_bn");
								var $btns = $noti_wrapper.find(".bp_btns");
								var noti_slds = $('#noti_bn .swiper-slide').length; // 2018.03.09 추가 등록 배너가 2개 이상일 때만.. 슬라이드
								if(disp_mall_no != '0000123'){									
									var $btns = {
											prev : $btns.find(".d_prev")
											,next : $btns.find(".d_next")
									}
								}
								
								$('#main_pop li:last img').load(function(){
									var notiWidth = [];
									var notiHeight = [];
									$noti_wrapper.find($('.swiper-slide img')).each(function(index){
										notiWidth[index] = $(this).outerWidth();
										notiHeight[index] = $(this).outerHeight();
									})
									$('#noti_bn, #noti_bn .swiper-slide ').css({
										width:Math.max.apply(null, notiWidth),
										height:Math.max.apply(null, notiHeight)
									});
								});

								$noti_wrapper.css('opacity',1);
								if(noti_slds > 1){ // 2018.03.09 추가 - 등록 배너가 2개 이상일 때만.. 슬라이드
									var noti_bn = null;
									if(disp_mall_no == '0000053'){
										noti_bn = new Swiper('#noti_bn .swiper_container',{
											loop: true,
											speed : 1000,
											autoplay: {
											    delay: 3700,
											    disableOnInteraction: false,
										    },
											simulateTouch : false,
											pagination:{
												el : '#noti_bn .roll_indi',
												clickable : true
											},
											navigation: {
											    nextEl: '.d_next',
											    prevEl: '.d_prev',
										    }
										});										
									}else if(disp_mall_no == '0000123'){
										var noti_bn = new Swiper('#noti_bn',{
											createPagination: false,
											simulateTouch: true,
											calculateHeight: true,
											pagination: '.roll_wrap .pagination',
											loop: true,
											paginationClickable: true,
											autoplay: 3700,
											onSlideChangeEnd : function() {noti_bn.startAutoplay();}
										});
										$(window).resize(function(){	
											noti_bn.reInit();
										});
									}else{
										noti_bn = new Swiper('#noti_bn .swiper_container',{
											autoplay : 3000,
											autoplayDisableOnInteraction: false,
											loop:true,
											simulateTouch : false,
											pagination: '#noti_bn .roll_indi',
											createPagination: false ,
											paginationElement : "a" ,
											paginationClickable : true,
											nextButton:'.d_next',
											prevButton:'.d_prev'
										});
										$noti_wrapper.hover(function(){
											noti_bn.stopAutoplay()
										});
										$noti_wrapper.mouseleave(function() {
											noti_bn.startAutoplay()
										});
										$btns.prev.on("click",function(e){
											e.preventDefault();
											noti_bn.swipePrev()
										})
	
										$btns.next.on("click",function(e){
											e.preventDefault();
											noti_bn.swipeNext()
										})
									}
								} else {
									if(disp_mall_no != '0000123'){										
										$btns.next.hide();
										$btns.prev.hide();
									}
									$noti_wrapper.find('.roll_wrap').hide();
								}
								if(disp_mall_no == '0000123'){
									$noti_wrapper.parent().css({'opacity':1,'filter':'alpha(opacity=1)'});									
								}else{									
									$noti_wrapper.parent().css({'opacity':100,'filter':'alpha(opacity=1)'});									
								}
								
								$(".p_today").click(function(){									
									$.ajax({
										url: "/popup/setCookie.action",
										type: "POST",
										dataType: "json",
										data: {
												type : data.data[0].COOKIE_DISP_DIVI_CD,
												noti_no : data.data[0].NOTI_NO,
												end_time : data.data[0].END_TIME
										},
										complete: function(data){
											$("#main_pop").hide();
											if(elandmall.global.disp_mall_no == '0000053'){
												$('body').removeClass('popLyrOpen');
											}else{
												$("body").css({'overflow':'visible'});
											}
											// APP 슈펜몰 인 경우
											if(elandmall.global.disp_mall_no == '0000053' && elandmall.global.app_cd != ""){
												location.href="elandbridge://tabbar/show/";
											}
										},
										error: function( e ){
											alert("팝업 설정중에 오류가 발생했습니다.");
											$("#main_pop").hide();
											if(elandmall.global.disp_mall_no == '0000053'){
												$('body').removeClass('popLyrOpen');
											}else{
												$("body").css({'overflow':'visible'});
											}
										}
									});										
								});
								$(".p_close").click(function(){										
									$("#main_pop").hide();
									if(elandmall.global.disp_mall_no == '0000053'){
										$('body').removeClass('popLyrOpen');
									}else{
										$("body").css({'overflow':'visible'});
									}
								});
							}
						}   // 최상위 if(data.data[0] != null && data.data[0].NOTI_NO != "")
					}
				});
//			});
		},
		/**
		 * 상품레이어(기획전 툴팁 레이어(바후스몰))
		 */
		goodsPreview : function(p){
			elandmall.layer.createLayer({
				title: "상품 미리보기",
				tooltip_yn: "Y",
				createContent: function(layer) {
					layer.div_content.load("/shop/getLayerPlanShopTooltip.action", {
						goods_no: p.goods_no,
						vir_vend_no: p.vir_vend_no
					}, function() {
						if (layer.div_content.find(".g_info").length > 0) {
							layer.show();
						} else {
							alert("죄송합니다. 상품정보를 조회할 수 없습니다.");
						};					
					});
				}
			});
		},
		
		/**
		 * 앱유도
		 */
		fnInsAppPop : function(p){
			
			ElandmallEventListener.fnAddOnloadListener(function() {
				
				var cookie = elandmall.util.getCookie(p.disp_mall_no+"_app_pop");
				if(cookie == "false") return;
				
				var param = {
						type:"m", 
						disp_mall_no : p.disp_mall_no
				};
				$.ajax({
					url : "/popup/searchPopInsAppList.action",
					data : param,
					type : "get",
					dataType : "json",
					cache : true,
					success : function(data){
						if(data != null && (typeof(data.APP_INS_NO) != "undefined") && data.APP_INS_NO != ""){
							var html = data.APP_INS_CONT;
							html = html.replace( /&gt;/g, '>' ) ;
							html = html.replace( /&lt;/g, '<' ) ;
							html = html.replace( /&amp;/g, '&' ) ;
							$('.ins_app').html(html);
							
							$('.ins_app').attr('style','');
							
							$('.pop_close').click(function(){
								//쿠키저장
								elandmall.util.setCookie({ name:data.DISP_MALL_NO+"_app_pop", value: false, path: "/", domain : elandmall.global.cookie_domain, age: 1 });
								$('.ins_app').attr('style',"display:none");
							});
						}
					}
				});
			});
		},
		/**
		 * e포인트카드 바코드 레이어(NGCPO-5627)
		 */
		fnEPointCardBarcodeLayer : function(p) {
			var fnBarcodeLayer = function(){
				elandmall.layer.createLayer({
					title: "e포인트카드",
					layer_id: "ePointCardBarcodeLayer",
					class_name:"bcd_wrap",
					createContent: function(layer) {
						layer.show();
					    if(elandmall.global.app_cd != "" ){
					    	location.href="elandbridge://tabbar/show/";
						}
					}
				});

				var div = $("#ePointCardBarcodeLayer");
				div.load("/mypage/initEPointCardBarcodeLayer.action", p, function(responseTxt, statusTxt, xhr){
					if(statusTxt == "error") {
						div.hide();
						$("body").css({'overflow':'visible'});
					} else {
						div.on("click", ".close", function(){
							div.hide();
							$("body").css({'overflow':'visible'});
						});
					}
				});
			}

			if ( !elandmall.loginCheck() ){
				elandmall.isLogin({login:fnBarcodeLayer});
			} else {
				fnBarcodeLayer();
			}
		},
		
		 /**
	     * 배송지 확인
	     *
	     * */
	 	fnGoodsTodayDeliLayer : function(pin){
	 		var p = pin.param;
	 		var road_base_addr = typeof(p.data.road_base_addr) != undefined ? p.data.road_base_addr : ""; //도로명 주소 
	 		var road_dtl_addr = typeof(p.data.road_dtl_addr) != undefined ? p.data.road_dtl_addr : ""; //도로명 상세주소
	 		var base_addr = typeof(p.data.base_addr) != undefined ? p.data.base_addr : ""; //지번주소
	 		var dtl_addr = typeof(p.data.dtl_addr) != undefined ? p.data.dtl_addr : "";   //지번상세주소
	 		var deli_cart_grp_cd = typeof(p.deli_cart_grp_cd) != undefined ? p.deli_cart_grp_cd : "";  
	 		
	 		if(road_base_addr != ""){ //도로명을 우선순위로 한다.
	 			road_base_addr = road_base_addr+" "+ road_dtl_addr;
	 		}else{
	 			road_base_addr = base_addr+" "+ dtl_addr;  //지번주소
	 		}

	 		var param = {
	 				road_base_addr :  road_base_addr
	 				, defualt_addr_yn : pin.param.defualt_addr_yn
	 				, deli_cart_grp_cd : deli_cart_grp_cd
	 		};
	 		
	 		var quickDeli_close_yn = "N";
	 		if(deli_cart_grp_cd == "60"){ //오늘받송 일때 는 닫기 버튼 활성화
	 			quickDeli_close_yn = "Y";
	 		}

	 		elandmall.layer.createLayer({
				layer_id:"pop_quick_deli_layer",
				class_name:"layer_con lyr_opc",
				close_btn_txt:"닫기",
				title :"배송지 확인",
				close_btn_no: quickDeli_close_yn,
				close_call_back: function(){
					// callback
					if ($.type(pin.callback_close) == "function") {
						pin.callback_close();
					}
					layer_fix_close("pop_quick_deli_layer");
				},
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initGoodsQuickDeliLayer.action", param, function() {
						layer.show();
						
						// 다른배송방법 선택
						div.on("click", "#closeBtn", function(e){
							// callback
							if ($.type(pin.callback_close) == "function") {
								pin.callback_close();
							}
							layer_fix_close("pop_quick_deli_layer");
						});
						
						// 배송지 변경
						div.on("click", "#updateBtn", function(e){
							var str = window.location.href;
							if(str.indexOf('layerInfo')  != -1 ){
								str = elandmall.util.newHttps("/goods/initGoodsDetail.action?goods_no=" + p.goods_no + "&vir_vend_no=" + p.vir_vend_no);
								location.replace(elandmall.util.https("/mypage/searchBanJJakDlvpListLayer.action?url=" + encodeURIComponent(str)));
							}else{
								location.replace(elandmall.util.https("/mypage/searchBanJJakDlvpListLayer.action?url=" + encodeURIComponent(window.location.href)));
							}
							return false;
						});
						
						// 확인 
						div.on("click", "#saveBtn", function(e){
							// callback
							if ($.type(pin.callback_ok) == "function") {
								pin.callback_ok(pin);
							}
							layer_fix_close("pop_quick_deli_layer");
						});
					});
					
				}
			});
	 	}
	}

	
	/**
	 * 내용 : 주문/배송 조회 리스트, 상세주문내역 페이지 배송지 변경 레이어
	 * 사용방법
	 * pin = ({
			ord_no : 주문번호,
			ord_dtl_no: 주문상세번호,
			ord_dlvp_seq : 주문배송순번,
			ord_upt_divi_cd : 주문변경구분코드,
			today_receive: 오늘도착구분코드
		});
	*/
	elandmall.ordDlvpLayer = {
		editOrdDlvpLayer : function(pin){
			_preventDefault();
			var tmp_title = "배송지 변경";
			if (pin.ord_upt_divi_cd == "30") {
				tmp_title = "회수지 변경";
			}	
			
			elandmall.layer.createLayer({
				layer_id:"addrModify",
				class_name:"layer_fix ship",
				title: tmp_title,
				close : function(){
				   layer_fix_close("myOrdDlvpLayer");
				   //앱 툴바 보이기
				   if(elandmall.global.app_cd != ""){
				        location.href="elandbridge://tabbar/show/";
				   }      
				},
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/mypage/initMyOrderDlvpModifyLayer.action", pin, function() {
						var isModfyRun = false;
						var init_data_clone = $(div).clone();
						layer.show();
						
						if(elandmall.global.app_cd != ""){
						     location.href="elandbridge://tabbar/hide/";
						}
						
						//닫기 버튼
						div.on("click", "#cancelBtn", function(){
							//앱 툴바 보이기
						    if(elandmall.global.app_cd != ""){
						         location.href="elandbridge://tabbar/show/";
						    }				   
							layer.close();
						});
						
						//초기화 버튼
						div.on("click", "#initBtn", function(){
							$(div).html(init_data_clone.html());
							
							$("[name=dlvp_nm]", dlvpLayerformObj).val("");
							$("[name=recvr_nm]", dlvpLayerformObj).val("");
							$("[name=recvr_tel1]", dlvpLayerformObj).val("");
							$("[name=recvr_tel2]", dlvpLayerformObj).val("");
							$("[name=recvr_tel3]", dlvpLayerformObj).val("");
							$("[name=recvr_cell_no1]", dlvpLayerformObj).val("");
							$("[name=recvr_cell_no2]", dlvpLayerformObj).val("");
							$("[name=recvr_cell_no3]", dlvpLayerformObj).val("");
							$("#view_post_no", dlvpLayerformObj).val("");
							$("#view_base_addr", dlvpLayerformObj).val("");
							$("#view_dtl_addr", dlvpLayerformObj).val("");
							$("#view_deli_memo_cont option:eq(0)", dlvpLayerformObj).remove();
							$("#view_deli_memo_cont", dlvpLayerformObj).prepend("<option selected>선택해 주세요</option>");
							$("#view_deli_memo_cont", dlvpLayerformObj).change();
						});
						
						//등록 버튼
						div.on("click", "#saveBtn", function(){
							if(isModfyRun) {
								return;
							}
							
							//필수 체크
							var telNoChk = /^\d{2,3}-\d{3,4}-\d{4}$/; // 전화번호
							var cellNoChk = /^\d{3}-\d{3,4}-\d{4}$/; // 휴대폰 번호
							
							if($.trim($('[name=recvr_nm]', dlvpLayerformObj).val()) == ''){
								alert('받으시는 분을 입력해 주세요.');
								return;
							}
							
							if($.trim($('[name=recvr_tel1]', dlvpLayerformObj).val()) != '' || $.trim($('[name=recvr_tel2]', dlvpLayerformObj).val()) != '' || $.trim($('[name=recvr_tel3]', dlvpLayerformObj).val()) != ''){
								// 전화번호는 선택 (일부입력시에 체크)
								if($.trim($('[name=recvr_tel1]', dlvpLayerformObj).val()) == '' || $.trim($('[name=recvr_tel2]', dlvpLayerformObj).val()) == '' || $.trim($('[name=recvr_tel3]', dlvpLayerformObj).val()) == '') {
									alert('전화번호를 올바르게 입력해주세요.');
									return;
								}
							}
							
							if($.trim($('[name=recvr_cell_no1]', dlvpLayerformObj).val()) == '' || $.trim($('[name=recvr_cell_no2]', dlvpLayerformObj).val()) == '' || $.trim($('[name=recvr_cell_no3]', dlvpLayerformObj).val()) == ''){
								alert('휴대폰 번호를 입력해 주세요.');
								return;
							}
							
							var telNumber = $.trim($('[name=recvr_tel1]', dlvpLayerformObj).val()) + "-" + $.trim($('[name=recvr_tel2]', dlvpLayerformObj).val()) + "-" + $.trim($('[name=recvr_tel3]', dlvpLayerformObj).val()); // 전화번호
							var phoneNumber = $.trim($('[name=recvr_cell_no1]', dlvpLayerformObj).val()) + "-" + $.trim($('[name=recvr_cell_no2]', dlvpLayerformObj).val()) + "-" + $.trim($('[name=recvr_cell_no3]', dlvpLayerformObj).val()); // 휴대폰 번호
							if (telNumber != "--") {
								if(!telNoChk.test(telNumber)) {
									alert('전화번호를 올바르게 입력해주세요.');
									return true;
								}
							}
					
							if(!cellNoChk.test(phoneNumber)) {
								alert('휴대폰 번호를 올바르게 입력해주세요.');
								return true;
							}
							
							if($.trim($('#view_post_no', dlvpLayerformObj).val()) == ''){
								alert('배송지 기본주소를 입력해 주세요.');
								return;
							}
							
							if($.trim($('#view_dtl_addr', dlvpLayerformObj).val()) == ''){
								alert('배송지 상세주소를 입력해 주세요.');
								return;
							}
							
							if($("#chk_basic_ship").is(':checked') && $.trim($('[name=dlvp_nm]', dlvpLayerformObj).val()) == ''){
								alert('배송지명을 입력해 주세요.');
								return;
							}
							
							isModfyRun = true;
							//배송정보 설정(레이어 화면에 선언)
							fnSetLayerDlvpInfo();
							
							$.ajax({
								url: "/mypage/updateMyOrdDlvpInfo.action",
								type: "POST",
								dataType: "json",
								async:false,
								data: $('#dlvpLayerformObj').serialize(),
								success: function(data){
								
									if(data.code=='S'){
										window.parent.postMessage({ resultCode : 'S', ret : '1'}, '*');
										location.reload();
									}else{
										isModfyRun = false;
										alert(data.msg);
										
										/*elandmall.layer.createLayer({
											title: "배송 불가 상품 안내",
											createContent: function(layer) {
												layer.div_content.append(
													"<div class=\"txt\">입력하신 주소로 <br><strong>배송 불가한 상품</strong>이 존재 합니다.</div>" +
													"<ul class=\"btn_list02 btn_ship\">" +
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
										});*/
									}
								},
								error: function( e ){
									isModfyRun = false;
									if ( e.error_message !=null && e.error_message != ""){
										alert(e.error_message);
									}else{
										alert("오류가 발생하였습니다.");
									}
								}
							});
							
						});
						
						div.on("click", "#my_dlvp_list_button", function(){							
							$('*').unbind("touchmove");
							elandmall.popup.myDlvpListLayer({
								callback: function(data) {
								
									div.find("[name=dlvp_nm]").val(data.dlvp_nm);
									
									isChecked = data.base_yn == "Y" ? true:false;
									div.find("#chk_basic_ship").prop("checked",isChecked).change();
							
									
									div.find("[name=recvr_nm]").val(data.name);
									
									div.find("[name=recvr_cell_no1]").val(data.cel_no1);
									div.find("[name=recvr_cell_no2]").val(data.cel_no2);
									div.find("[name=recvr_cell_no3]").val(data.cel_no3);
									
									div.find("[name=recvr_tel1]").val(data.tel_no1);
									div.find("[name=recvr_tel2]").val(data.tel_no2);
									div.find("[name=recvr_tel3]").val(data.tel_no3);
									
									//도로명
									div.find("[name=recvr_road_post_no]").val(data.r_post_no);
									div.find("[name=recvr_road_base_addr]").val(data.r_base_addr);
									div.find("[name=recvr_road_dtl_addr]").val(data.r_dtl_addr);
									
									//지번
									div.find("[name=recvr_post_no]").val(data.j_post_no);
									div.find("[name=recvr_base_addr]").val(data.j_base_addr);
									div.find("[name=recvr_dtl_addr]").val(data.j_dtl_addr);
									
									var view_post_no 	= "" ;
									var view_base_addr 	= "" ;
									var view_dtl_addr 	= "" ;
					
									if(data.addr_divi_cd == "20") {
									   	view_post_no 	= data.r_post_no;
										view_base_addr 	= data.r_base_addr;
										view_dtl_addr 	= data.r_dtl_addr;
									}else{
										view_post_no 	= data.j_post_no ;
										view_base_addr 	= data.j_base_addr;
										view_dtl_addr 	= data.j_dtl_addr;
									}
									
									div.find("[name=addr_divi_cd]").val(data.addr_divi_cd);
									div.find("#view_post_no").val(view_post_no);
									div.find("#view_base_addr").val(view_base_addr);
									div.find("#view_dtl_addr").val(view_dtl_addr);
									$("#chk_basic_ship").attr('disabled', false);
									
									//div.find("[name=ord_memo_cont]").val(data.deli_msg);
									
								},
								 close_call_back:function(){
										$('#dlvp_layer').remove();
										$('#addrModify').show();										
										$('*').unbind("touchmove");
								 }
							});
						});
					});
				}
			});
		},
		fnNumberTypeChk : function( obj ){
			var regexp = /[^0-9]/gi;
			var v = $(obj).val();
			var v_len = v.length;
			if (regexp.test(v)) {
				v = v.replace(regexp, '');
				v_len = v.length;
			}
			$(obj).val(v.length > 4 ? v_len.substring(0,4) : v);
		}
	};
	

	/** 
	 * 사용방법
	 * elandmall.goodDetailQuestLayer({
	 * 		goods_no: 	상품번호(묶음일때 원 상품번호)
	 * 		sel_goods_no : 선택상품번호(묶음일때 선택 상품번호)
	 * 							일반일때 두개 상품번호는 동일
	 * 		vir_vend_no : 가상업체번호
	 * 		pkg_yn : 묶음상품여부
	 * });
	 */
	elandmall.goodDetailQuestLayer = function(p, _callback) {
		
		if ( $("#bundle_detail").length > 0 ) {
			
			elandmall.layer.createLayerForLayer({
				title: "상품문의",
				layer_id: "qna_layer",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/goods/initGoodsQuestLayer.action", p,  function() {
						
						layer.show();
						// 초기값 선택
						$("#goods_sel", div).change();
						
						div.on("change", "#goods_sel", function(){
							var selectedOpt = $("#goods_sel option:selected", div);
							$("#goods_no", div).val(selectedOpt.data("goods_no"));
							$("#vir_vend_no", div).val(selectedOpt.data("vir_vend_no"));
						});
						
						//등록
						div.on("click", "#quest_bnt", function(){
							 if ( $("#counsel_clss_no").val() == "" ){
					    		alert("문의유형을 선택해 주세요.");
					    		return false;
						    } else if ( $('#quest_title').val() == "" ){
					    		alert("제목을 입력해 주세요.");
					    		return false;
							}else if ( elandmall.checkBanWord($('#quest_title').val()) ) {
								return false;
					    	}else if ( $('#quest_cont').val() == "" ) {
					    		alert("내용을 입력해주세요.");
					    		return false;
					    	}else if ( elandmall.checkBanWord($('#quest_cont').val()) ) {
					    		return false;
					    	}else {
					    		var gb = $(this).data("gb");
								var fo = $("#questForm").createForm();
								var url = "/goods/registGoodsQuest.action";
								if ( gb == "U"){
									url = "/goods/updateGoodsQuest.action";
								}
					    		fo.submit({
						    		action: url,
						            iframe: true,
						            success: function(pin) {
						            	// tab 출력용 전체 갯수 처리 
						            	if ( gb != "U"){
					    					var qtotCnt = $('#quest_cnt_all').val();
											$('#quest_cnt_all').val(Number(qtotCnt)+1);
							    		}
						            	
						            	if ( $.type(_callback)== "function"){
						            		_callback();
						            	}else{
						            		p.goods_no = $("#goods_no", div).val(); 
						            		var questIdx = $("[name=questTab].on").data("idx");
						            		if(elandmall.global.disp_mall_no == "0000053"){
						            			questIdx = 0;
						            		}
							            	elandmall.goodsDetailTab.fnQuest.fnSearchQuest(p, questIdx);
						            	}
						            	layer.close();
						            },
						            error:function(p){
						            	if(p.error_message != null && p.error_message != ""){
						                    alert(p.error_message);
						                }else{
						                    alert("상품문의 등록시 오류가 발생했습니다.");
						                    return false;
						                }
						            }
						    	});
					    	}
						});
						
						//취소
						div.on("click", "#layer_close", function(){
							layer.close();
						});
						
					});
				}
			});
			
		}else{
			
			elandmall.layer.createLayer({
				title: "상품문의",
				layer_id: "qna_layer",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/goods/initGoodsQuestLayer.action", p,  function() {
						
						layer.show();
						// 초기값 선택
						$("#goods_sel", div).change();
						
						div.on("change", "#goods_sel", function(){
							var selectedOpt = $("#goods_sel option:selected", div);
							$("#goods_no", div).val(selectedOpt.data("goods_no"));
							$("#vir_vend_no", div).val(selectedOpt.data("vir_vend_no"));
						});
						
						//등록
						div.on("click", "#quest_bnt", function(){
							 if ( $("#counsel_clss_no").val() == "" ){
					    		alert("문의유형을 선택해 주세요.");
					    		return false;
						    } else if ( $('#quest_title').val() == "" ){
					    		alert("제목을 입력해 주세요.");
					    		return false;
							}else if ( elandmall.checkBanWord($('#quest_title').val()) ) {
								return false;
					    	}else if ( $('#quest_cont').val() == "" ) {
					    		alert("내용을 입력해주세요.");
					    		return false;
					    	}else if ( elandmall.checkBanWord($('#quest_cont').val()) ) {
					    		return false;
					    	}else {
					    		var gb = $(this).data("gb");
								var fo = $("#questForm").createForm();
								var url = "/goods/registGoodsQuest.action";
								if ( gb == "U"){
									url = "/goods/updateGoodsQuest.action";
								}
					    		fo.submit({
						    		action: url,
						            iframe: true,
						            success: function(pin) {
						            	
						            	// tab 출력용 전체 갯수 처리 
						            	if ( gb != "U"){
					    					var qtotCnt = $('#quest_cnt_all').val();
											$('#quest_cnt_all').val(Number(qtotCnt)+1);
							    		}
					    				
						            	if ( $.type(_callback)== "function"){
						            		_callback();
						            	}else{
						            		p.goods_no = $("#goods_no", div).val(); 
						            		var questIdx = $("[name=questTab].on").data("idx");
						            		if(elandmall.global.disp_mall_no == "0000053"){
						            			questIdx = 0;
						            		}
							            	elandmall.goodsDetailTab.fnQuest.fnSearchQuest(p, questIdx);
						            	}
						            	layer.close();
						            },
						            error:function(p){
						            	if(p.error_message != null && p.error_message != ""){
						                    alert(p.error_message);
						                }else{
						                    alert("상품문의 등록시 오류가 발생했습니다.");
						                    return false;
						                }
						            }
						    	});
					    	}
						});
						
						//취소
						div.on("click", "#layer_close", function(){
							layer.close();
						});
						
					});
				}
			});
			
		}
	 	
	}
	
    /**
     * 등급산정 레이어
     * 
     * @param pin : 
     *
     */
 	fnMyGradeLayer = function(pin){
 	
		elandmall.layer.createLayer({
			layer_id:"pop_grade",
			class_name:"layer_fix deposit",
			title: "등급산정 내역",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/popup/initMyGradeLayer.action", pin, function() {
					
					layer.show();
					

				});
			}
		});
 	};
 	
    /**
     * 구매내역 레이어
     * 
     * @param pin : 
     *
     */
 	fnMyOrdLayer = function(pin){
 	
		elandmall.layer.createLayer({
			layer_id:"pop_grade_ord",
			class_name:"layer_fix deposit",
			title: "구매내역",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/popup/initMyOrdLayer.action", pin, function() {
					
					layer.show();
					
				
				});
			}
		});
 	};
		
 	
    /**
     * 상품평 필터 추가정보 입력
     *
     * */
 	var evalLayerRunning = false;
 	fnGoodsEvalFltLayer = function(pin){
 		if(evalLayerRunning) {
 			return;
 		}
 		
 		if($("#pop_eval_filter_list").length > 0){
 			$("#pop_eval_filter_list").remove();
 		}
 	
 		evalLayerRunning = true;
 		
		elandmall.layer.createLayer({
			layer_id:"pop_eval_filter_list",
			class_name:"layer_fix",
			title: "상세검색",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/content/initGoodsEvalFltLayer.action", pin, function() {
					evalLayerRunning = false;
					layer.show();
					
					div.find(".flt_attr").each(function(){
						$(this).click(function(){
							$(this).toggleClass("sel");
						});
					});
				
				});
			}
		});

 	};
 	
	 /**
     * 상품평 필터 혜택
     *
     * */
 	fnGoodsEvalNoticeLayer = function(pin){
		elandmall.layer.createLayer({
			layer_id:"pop_eval_notice_layer",
			class_name:"lg_pop fixed",
			close_btn_txt:"닫기",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/content/initGoodsEvalNoticeLayer.action", pin, function() {
					
					layer.show();
				
				
				});
			}
		});
 	};
 	
 	/**
     * 상품평 포로리뷰 상세보기(슈펜)
     *
     * */
 	fnGoodsEvalPhotoLayer = function(pin){
		elandmall.layer.createLayer({
			layer_id:"lyr_photo_review",
			class_name:"layer_fix",
			pickup_yn : "Y",
			createContent: function(layer) {
				dim_on('white');
				var div = layer.div_content;
				div.load("/goods/initGoodsEvalPhotoLayer.action", pin, function(responseTxt, statusTxt, xhr) {
					if(statusTxt = "sucess"){
						layer.show();
						dim_out();
					}
				});
			}
		});
 	};
 	
 	
})(jQuery);