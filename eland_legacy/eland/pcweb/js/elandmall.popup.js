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
		 * 
		 * elandmall.postPopup => overpass.elandmall.js 참조
		 */
		postLayer : function( p ) {	// 주소 찾기 팝업
			elandmall.layer.createLayer({
				class_name:"layer_pop d_layer_pop on",
				tit_class_name : "lay_tit02",
				title: "주소 찾기",
				dimm_use: true,
				close_call_back : p.close_call_back,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initPostNoList.action", function() {
						layer.show();
						// 엔터키
						div.on("keydown", "[name=sch_nm], #set_addr", function(e){
							if (window.event.keyCode == 13) {
								 e.preventDefault();
								$(this).next("button").click();
							}
						});

						// 주소 선택
						div.on("click", "[name=select_addr]", function(e){
							e.preventDefault();
							var trgtTr = $(this).parents("tr");
							var addrGb = $(this).data("addr_gb");
							var post_no = $("#post_no", trgtTr).val();
							var addr = $("#addr_admin", trgtTr).val();

							if ($("#regist_order_button").attr("today_receive") == "Y" || p.today_receive == "Y") {								
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

						// 검색
						div.on("click", "[id=postNoSearch]", function(){
							var layCont = $(this).parents("div .lay_cont");
							fnSearchPostNoBodyListAjax(layCont, false);
						});
						
						// 더보기
						div.on("click", "[id=postNoMore]", function(){
							var layCont = $(this).closest('.lay_cont');
							var pageIdx = $("#page_idx",layCont).text();
							var totPage = $("#tot_page",layCont).text();
							if(Number(pageIdx) >= Number(totPage)) {
								// 마지막 페이지일경우 더보기 중단
								return false;
							}
							fnSearchPostNoBodyListAjax(layCont, true);
						});

						// 초기화
						var fnReSet = function( obj ){
							//$("[id$=_result]", obj).html(no_data_clone.html());
							$("select, input", obj).val("");
							
							fnRemoveClass( $(".on", obj), "on");
							fnAddClass( $(".d_tab_cont, .tab1_1, .no_data, [id$=_result], #div_research", obj), "on");
							$("#div_rfn_addr", obj).removeAttr("style");
						}
	
						var fnRemoveClass = function( obj, classNm ){
							obj.removeClass(classNm);	
						}
						
						var fnAddClass = function ( obj, classNm ){
							obj.addClass(classNm);
						}

						// targetObj : 검색어(#sch_nm) 포함된 부모요소
						// isMoreSearch : 더보기여부 true | false
						var fnSearchPostNoBodyListAjax = function( targetObj, isMoreSearch) {
							var p = elandmall.postPopup.addrSearch(targetObj);	//sch_nm 설정
							if(!p) { return false; }	//검색어 입력 안했을 경우;
							// 더보기 일경우 page추가
							if(isMoreSearch) {
								p = $.extend({ page: $('#page_idx', targetObj).text() }, p);
							}
							$.ajax({
								url: '/popup/searchPostNoBodyListAjax.action',
								dataType: "json",
								data: p,
								success: function(data) {
									// 검색 안내문구 숨기기
									$("div.txt_info", targetObj).hide();
									$("div.txt_info2", targetObj).hide();
									$(".addr_more", targetObj).hide();

									var result = data.results;
									var docCount = result.doc_count;
									var pageIdx = result.page_idx;
									var disp_pageIdx = Number(pageIdx)+1;
									var docResult = result.doc_result;
									console.log("disp_pageIdx : " + disp_pageIdx);
									var scrollHeight = 0;
									$('#result_body > tr').each(function() {
										scrollHeight += $(this).outerHeight();
									})

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
											$('#adr_search_results .board_scroll').css("height", "400px");
										} else {
											$('#adr_search_results .board_scroll').css("height", "535px");
										}
										
										// 50건 이상일 경우 더보기 버튼 노출
										if(docCount > 50) {
											
											$('.addr_more', targetObj).show(); 
											$('#ipt_page_idx', targetObj).text(pageIdx);
											$('#ipt_tot_page', targetObj).text(docCount/pageIdx);
											$('#ipt_doc_count', targetObj).val(docCount);

											$('#page_idx', targetObj).text(disp_pageIdx);
											$('#tot_page', targetObj).text(Number(docCount)%50 == 0 ? parseInt(Number(docCount)/50) : parseInt(Number(docCount)/50) + 1);
											
											if(Number(disp_pageIdx) == (Number(docCount)%50 == 0 ? parseInt(Number(docCount)/50) : parseInt(Number(docCount)/50) + 1)) {
												$('.addr_more', targetObj).hide(); 
											}
										}

										// 주소 결과 show
										$(".adr_sreach_results", targetObj).addClass("on");
										$('#adr_result_count').text(docCount);	// 총 건수

										if(!isMoreSearch) {
											$('#result_body').empty();	// 재검색(검색버튼 재클릭)
										}
										
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
										
										$('#adr_search_results .board_scroll').scrollTop(isMoreSearch ? scrollHeight : 0);
										
										
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
						}	// fnSearchPostNoBodyListAjax 함수 종료
						
						
					});
				}
			});
		},
		
			
		/**
		 * 사용방법
		 * elandmall.popup.myDlvpListLayer({ base_yn : "N", callback:function(pin){},);
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
				layer_id:"dlvp_layer",
				class_name:"layer_pop type02 d_layer_pop on",
				cont_class_name: "deli",
				dimm_use: true,
				title: "배송지 목록",
				close_call_back : p.close_call_back,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/searchMyDlvpListLayer.action", param, function() {
						// 배송지 선택
						div.on("click", "[name=addrSelect]", function(){
							var parentObj = $(this).parents("tr");
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
						
						// 배송지 삭제
						div.on("click", "[name=dlvpDel]", function(){
							if ( !confirm("배송지를 삭제 하시겠습니까?")){
								return false;
							}
							var parentObj = $(this).parents("tr");
							var mbr_dlvp_seq = parentObj.find("[name=mbr_dlvp_seq]").val();
							
							$.ajax({
								url: "/popup/searchMyDlvpListLayer.action",
								data: { mbr_dlvp_seq : mbr_dlvp_seq},
								type: "POST",
								dataType: "text",
								success: function(data) {
									if ( data != null && data != "" ){
										alert("배송지가 삭제 되었습니다.");
										div.html(data);
									}
								}, error : function( e ){
									alert("삭제 중 오류가 발생하였습니다.");
								}
							});	
						});
						
						layer.show();
					});
				}
			});
		},
		
		/**
		 * 사용방법
		 * 사이즈 정보보기 레이어 팝업
		 * elandmall.popup.goodSizeInfoLayer({
		 * 			goods_no:			(상품번호)
		 * 			remove_yn : 레이어 삭제 여부
		 * });
		 */
		goodSizeInfoLayer : function(p) {
			if ( $("#sizeInfoLayer").length>0 && (typeof(p.remove_yn) == "undefined" || p.remove_yn == 'N') ){
				$("#sizeInfoLayer").show();
			}else{
				if ( p.remove_yn == 'Y') {
					$("#sizeInfoLayer").remove();
				}
				elandmall.layer.createLayer({
					layer_id:"sizeInfoLayer",
					class_name:"layer_pop type02 d_layer_pop on",
					title: "사이즈 정보",
					cls_othr_lyr_yn :(typeof(p.cls_othr_lyr_yn) == "undefined")?"": p.cls_othr_lyr_yn,
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/goods/searchGoodsSizeInfoLayer.action", p,  function() {
							if ( $("#sizeCnt", div).val() > 0 ){	
								
								layer.show();
								$("#sizeInfoLayer").css('z-index','4005');	//옵션변경레이어에서 상품사이즈정보레이어를 띄울 때, 위에 띄우기 위해 추가 (16.03.15, 이태영)
							}
						});
					}
				});
			}
		},
		
		/** 
		 *  장바구니 담기 결과레이어
		 */
		cartResultLayer : function(p) {			
			var layer_id = elandmall.cart.layer_id;
			var param = $.extend({type:"CART"},p);
			
			if(elandmall.global.disp_mall_no == "0000045"){
				if(param.wife_cart_running_yn != 'Y'){ // 아내의식탁에서 마지막 장바구니 호출일때
					elandmall.cart.closeLayer();
					var kmsCartLayer = $('<div class="lyr_alert_cart" role="alertdialog" id="'+layer_id+'"></div>');
					kmsCartLayer.css({"zIndex": 4005});

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
					msgCart();
				}
			}else{				
				if ($("#" + layer_id).length > 0 ){
					$("#" + layer_id).show();
				} else {
					elandmall.layer.createLayer({
						layer_id: layer_id,
						class_name:"layer_pop in_cart on",
						close_call_back: elandmall.cart.closeLayer,
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/popup/initCartResultLayer.action", function() {
								layer.show();
								
								$("#goCartBtn").click(function(){
									if(elandmall.global.disp_mall_no == "0000053"){	//슈펜일 경우 슈펜장바구니로 이동
										elandmall.shoopen.goShoopenCart();
									} else {
										elandmall.hdLink('CART');
									}
								});
								
								$("#result_close", div).on("click", function(){
									elandmall.cart.closeLayer();
								});
							});
						}
					});
				}
			}
			
		},
		
		/** 
		 * 
		 *  상품상세 매장 수령 레이어
		 */
		storeReceiptLayer : function(p) {
			var param = $.extend({}, p || {});
			var is_detailPreview = ( $("#detailPreview").length > 0 ) ? true : false; 
			p["is_detailPreview"] = is_detailPreview;
			
			elandmall.layer.createLayer({
				layer_id: "storeReceipt",
				class_name:"layer_pop inquiry on",
				close_call_back:function(){
					elandmall.popup.storeReceiptLayer_close(p);
				},
				cls_othr_lyr_yn : "Y",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initStoreReceiptLayer.action",param, function() {
						
						if(is_detailPreview){
							$("#gd_float_opt_fix").removeClass("groups");
						}
						
						layer.show();
						$("#result_close", div).on("click", function(){
							if($('input[name="shop_sel"]').index($('input[name="shop_sel"]:checked')) > -1){

								var shopSel = $('input[name="shop_sel"]:checked');
								var rShopCode = shopSel.attr('data-shop_code');
								var rShopName = shopSel.attr("data-shop_name");
								var rSaleQty = shopSel.attr("data-sale_qty");
								
								var p = $.extend({shopCode : rShopCode , shopName : rShopName, saleQty : rSaleQty, classkey: param.classkey}, param || {});
								if( param.cust_prod_yn == "Y" ){
									elandmall.goodsDetail.fnCallbackResultStore(p);
								}else{
									elandmall.goodsDetail.fnCallbackResultStoreNormal(p);
								}
								$("#storeReceipt").remove();
								
								if(param.quickview_yn == "Y"  || is_detailPreview){
									elandmall.popup.fnLayerReturn();
								}
								
								
							}else{
								alert("매장을 선택해 주세요.");
								return false;
							}
							
						});
					});
					

					div.on("click", "#btn_lay_close", function(){
						elandmall.popup.storeReceiptLayer_close(p);
					});
					
					// 검색
					div.on("click", "#storeSearch", function(){
						
						
						var subDiv = $("#pickupShopResult");
						var params = div.find("#pickListForm").serialize();
						subDiv.load("/popup/searchStoreReceiptLayer.action", params, function() {
						});
					});
					
					// 검색
					div.on("keydown", "#shop_name", function(e){
						
						 if(e.keyCode == 13){
								var subDiv = $("#pickupShopResult");
								var params = div.find("#pickListForm").serialize();
								subDiv.load("/popup/searchStoreReceiptLayer.action", params, function() {
								});
						 }

					});
					
				}
			});
					
					
					
		},
		
		/** 
		 * 
		 *  상품상세 매장 수령 레이어 닫기 공통
		 */
		storeReceiptLayer_close : function(p) {
			var param = $.extend({}, p || {});
			if( param.cust_prod_yn == "Y" ) {
				$(".L"+param.classkey,".choiceGoods").remove();

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
				$("#storeReceipt").remove();
			}else{
				$(".L"+param.classkey,".choiceGoods").remove();
				var p = $.extend(param || {});
				elandmall.goodsDetail.fnCallbackCloseStoreNormal(p);
				$("#storeReceipt").remove();
			}
			
			if(param.quickview_yn == "Y" || param.is_detailPreview){
				elandmall.popup.fnLayerReturn();	
			}
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
			if(elandmall.global.disp_mall_no == "0000045" && isGoodsTypeCd == '50'){				
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
					cart_grp_cd  : p.p_cart_grp_cd,
					wife_cart_running_yn : p.wife_cart_running_yn,
					wife_cart_end_yn : p.wife_cart_end_yn
			}
			
			var optLayerEvt = function (){
				elandmall.optLayerEvt.callCartCheck({
					param:callParam,
					callback:function(){
						if(elandmall.global.disp_mall_no == "0000045"){
							delete p.goods_type_cd;
							delete p.cart_divi_cd;
							elandmall.goods.goDetail(p);
						}else{							
						elandmall.popup.itemLayer(callParam);
					}
					}
				});
			};
			
			// 70 : 오늘직송의 경우 로그인 체크 
			if(callParam.cart_grp_cd == '70') {
				elandmall.isLogin({
					login:function() {
						optLayerEvt();
					}
				});
			}else {
				optLayerEvt();	
			}
		},
		
		
		/*
		 * 내  용 : 쥬얼리 주문제작시 상품리스트에서 장바구니 담기불가
		 * 필수 파라미터 : {
		 * 		goods_no: '',
		 * 		vir_vend_no: ''
		 * 		cart_divi_cd:''
		 * }
		 * */
		callGoDetail : function(p){
			
			if ( !confirm("상품상세 페이지에서\n옵션을 선택해주세요.") ){
			        return;
		    }
			
			elandmall.goods.goDetail({ goods_no: p.goods_no, vir_vend_no: p.vir_vend_no });
		},
		
		
		
		/**
		 * 옵션보기 레이어
		 * 
		 * 필수파라미터
		 * p = {
		 * 		goods_no:'',	//상품번호	
		 * 		vir_vend_no:''	//가상업체번호
		 * 		obj:this		//클릭한 a태그 객체
		 * }
		 * 
		 * */
		optNameLayer : function(p){
			
			var clickObj = p.obj;
			if(elandmall.global.disp_mall_no == "0000053"){
				if($("dl.lyr", $(clickObj).parent().parent().parent().parent()).length == 0 ){
					var param = {
							goods_no : p.goods_no,
							vir_vend_no : p.vir_vend_no
					}
					$.ajax({
						url: "/popup/searchOptNameLayerList.action",
						data: param,
						type: "POST",
						dataType: "html",
						success: function(rst) {
							$(clickObj).after(rst);
							if($('#content').find('.goods_list').length > 0){setGdLst('.goods_list');}
						}
					});
				}
			}else{
				if(elandmall.global.disp_mall_no == "0000045"){
					if($("dl.lyr", $(clickObj).parent().parent().parent().parent()).length == 0 ){
						var param = {
								goods_no : p.goods_no,
								vir_vend_no : p.vir_vend_no
						}
						$.ajax({
							url: "/popup/searchOptNameLayerList.action",
							data: param,
							type: "POST",
							dataType: "html",
							success: function(rst) {
								$(clickObj).after(rst);
								var oplayer = $(clickObj).next();
								$(clickObj).addClass("on");
								$(oplayer).css("display","block");
								var show_ev = function(){
									$(clickObj).addClass("on");
									$(oplayer).css("display","block");
								};
								$(clickObj).mouseover(show_ev).focus(show_ev);
								$(clickObj).mouseleave(function(){
									$(clickObj).removeClass("on");
									$(oplayer).css("display","none");
								});
							}
						
						});
					}
				}else{				
					if($("div.lay_lp_opt", $(clickObj).parent().parent()).length == 0 ){
						var param = {
								goods_no : p.goods_no,
								vir_vend_no : p.vir_vend_no
						}
						$.ajax({
							url: "/popup/searchOptNameLayerList.action",
							data: param,
							type: "POST",
							dataType: "html",
							success: function(rst) {
								
								$(clickObj).parent().after(rst);
								var oplayer = $(clickObj).parent().parent().find("div.lay_lp_opt");
								$(oplayer).addClass("lay_lp_on");
								var show_ev = function(){
									$(oplayer).addClass("lay_lp_on");
									$(oplayer).find('.scroll').attr('tabindex','0');
								};
								$(clickObj).mouseover(show_ev).focus(show_ev);
								$(clickObj).parent().parent().mouseleave(function(){
									$(oplayer).removeClass("lay_lp_on");
								});
								
							}
						
						});
					}
				}
			}
			
		},
		itemLayer : function(p) {	//단품(옵션)변경 팝업
			p = $.extend({ goods_no: "", item_no: "", vir_vend_no: "", dimmChk: false }, p || {});
			var lyrParam = {
					goods_no: p.goods_no,
					item_no: p.item_no,
					vir_vend_no: p.vir_vend_no,
					cart_divi_cd:p.cart_divi_cd,
					cart_grp_cd:p.cart_grp_cd,
					set_cmps_item_nos:p.set_cmps_item_nos,
					gift_goods_info:p.gift_goods_info,
					gubun:p.gubun,
					dimmChk:p.dimmChk
				} 
			var gubun = (typeof(p.gubun) != "undefined") ? p.gubun : "LST";
			var strTitle = (gubun == "CART")? "상품 옵션 변경":"상품 옵션 선택";
			var mall_no = elandmall.global.disp_mall_no;
			var dimmChk = p.dimmChk;
				//[START] 옵션레이어 생성
			elandmall.layer.createLayer({
				title: strTitle,
				dimm_use: p.dimmChk,
				createContent: function(layer) {	//{  goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no, cart_grp_cd:p.cart_grp_cd, gubun:gubun }
					var div = layer.div_content;
					div.load("/popup/searchItemLayer.action", lyrParam, function() {
						
						var goodsInfo = div.find("#_optChoiceLayer").data("goods_info");
						
						var cart_divi_cd = div.find("#_optChoiceLayer").data("cart_divi_cd")+"";
						layer.show();					
						//지점상품이면서 방문수령일 때,
						elandmall.optLayerEvt.changeBranch({goods_no:p.goods_no});
						
						if( goodsInfo.multi_item_yn == "Y" ){	//옵션상품일 때, 조회한다
							var first_param = {
									goods_no:p.goods_no,
									item_nm:p.item_no,
									low_vend_type_cd : goodsInfo.low_vend_type_cd,
									vir_vend_no:p.vir_vend_no,
									set_goods_no: p.set_goods_no,
									cmps_grp_seq: p.cmps_grp_seq
							}
							var color_chip_val = +goodsInfo.color_mapp_option;
							if(color_chip_val == 1){
								first_param["color_yn"] = "Y";
							}
							elandmall.optLayerEvt.ajaxItemList({
								param:first_param,
								success:function(data){
									var opt = div.find("#options_nm1");
									
									$.each(data, function() {
										var item_no = this.ITEM_NO;
										var opt_val_nm1 = this.OPT_VAL_NM1;
										var sale_poss_qty = this.SALE_POSS_QTY;
										var cancle_poss_yn = this.CANCLE_POSS_YN;	//예약취소가능 여부
										var item_nm_add_info = this.ITEM_NM_ADD_INFO;
										var vir_vend_no = this.VIR_VEND_NO;
										var item_sale_price = this.ITEM_SALE_PRICE;
										var goods_sale_price = this.GOODS_SALE_PRICE;
										var min_sale_price   = this.MIN_SALE_PRICE;
										var low_price_cnt    = Number(this.CNT);
										
										/* 20170207 false처리*/
										if (  item_sale_price > -1 && goodsInfo.low_vend_type_cd != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
											if ( item_sale_price == 0 ){
												item_sale_price = elandmall.util.toCurrency(goods_sale_price);	
											}
											item_sale_price = elandmall.util.toCurrency(item_sale_price);
										}else{
											item_sale_price = elandmall.util.toCurrency(goods_sale_price);	
										}
										if(item_sale_price !="" && item_sale_price !="0"){
											item_sale_price = item_sale_price+"원";
										}
										
										if(typeof(item_nm_add_info) == "undefined"){
											item_nm_add_info = "";
										}
										//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
										item_sale_price="";
										
										var optionObj = null;
										if(sale_poss_qty > 0){
											optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
											).attr({ "data-value": item_no });
										}else{
											if($("#reserv_limit_divi_cd").val() == "10"){	// 예약일 때,
												optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
														"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
														"</span></li>"
												).attr({ "data-value": "soldout" });
											}else{
												optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
														"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
														"<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+p.goods_no+"',vir_vend_no:'"+p.vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+opt_val_nm1+"' ,dimmChk:"+p.dimmChk+"});\">입고알림신청</a></span></li>"
												).attr({ "data-value": "soldout" });
											}
										}
										if(typeof(cancle_poss_yn) != "undefined" && cancle_poss_yn != ""){
											optionObj.attr("data-cancle_poss_yn", cancle_poss_yn);
										}
										optionObj.attr("data-vir_vend_no", vir_vend_no);
										optionObj.attr("data-item_show_nm",opt_val_nm1);
										//[NGCPO-6256] 장바구니 수량체크
										optionObj.attr("data-sale_poss_qty", sale_poss_qty);
										
										opt.append(optionObj);
										
									});
									/*if(color_chip_val == 1){
										elandmall.optLayerEvt.drawColorChipHtml({data:data, curr_opt_idx:1});
									}*/

									//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
									//div.find("[id^=item_opt_nm]").change(function(){
									div.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동		
										var currObj = $(this);
										var opt_idx = $(this).parents('.options').data('index');
										var $li = $(this).parent();
										var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
										if(!$li.hasClass('sld_out')){
											$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
											$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
											//$selBtn.find('.sel_txt').val($li.val());
											
											$selBtn.find('.sel_txt').attr('data-value',$li.attr('data-value'));
											//$selBtn.find('.sel_txt').val($li.attr('data-value'));
											$('.lyr_select').removeClass('on');
											$li.addClass('selected').siblings('li').removeClass('selected');
											showText($selBtn);
											elandmall.optLayerEvt.changeItem({
												param:{ goods_no: p.goods_no, item_no: p.item_no, low_vend_type_cd:goodsInfo.low_vend_type_cd, vir_vend_no: p.vir_vend_no, set_goods_no: p.set_goods_no, cmps_grp_seq: p.cmps_grp_seq},
												div:div,
												chgObj:$(this),
												callback_ajax:function(result){
													var next_slt = div.find("#item_opt_nm"+result.next_idx);
													if($("#opt_box").data("init_yn") != "Y"){	//,
														var pre_item_val = "";
														$.each($(next_slt).children(), function(idx, optval){
															if($("#opt_box").data("opt_val_nm"+result.next_idx) == $(this).text()){
																pre_item_val = $(this).val();
															}
														});
														$(next_slt).val(pre_item_val);
														$(next_slt).change();
														if($(next_slt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
															$("#opt_box").data("init_yn","Y");
														}
													}
												},
												callback:function(result){
													var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-last');
													var currVal = currObj.parent().attr("data-value");
													var currName = currObj.children('.opt_name').text();
													var sale_poss_qty = currObj.parent().attr("data-sale_poss_qty");
													if(last_yn== "Y" && currVal != ""){
														//이벤트화면 장바구니 상품 선택시
														//[NGCPO-6256] 장바구니 수량체크
														$("#_optChoiceLayer").attr("data-item_no", currVal);
														$("#_optChoiceLayer").attr("data-item_nm", currName);
														$("#_optChoiceLayer").attr("data-sale_poss_qty", sale_poss_qty);
														
														//패션브랜드 상품일 때, 마지막에 선택된 옵션의 출고지로
														if(goodsInfo.low_vend_type_cd == "40" || goodsInfo.low_vend_type_cd == "50"){
															goodsInfo.vir_vend_no = currObj.parent().attr("data-vir_vend_no");
														}
														
														if(gubun == "LST"){
															elandmall.optLayerEvt.getItemPrice({
																param:{goods_no: p.goods_no, vir_vend_no: goodsInfo.vir_vend_no, item_no: currVal},
																success:function(data){
																	//마지막 옵션 선택 시, 최소수량 설정
																	goodsInfo.ord_qty = data[0].ORD_POSS_MIN_QTY;
																}
															});
														}
														
													}
												}
											});
										}
										

									});
									//[END] item select change event 
									function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
										if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
											$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
										}
										else{
											$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
										}
									}
									if($("#opt_box").data("init_yn") != "Y"){	//첫번째 옵션값 
										var pre_item_val = "";
										$.each($(opt).children(), function(idx, optval){
											if($("#opt_box").data("opt_val_nm1") == $(this).text()){
												pre_item_val = $(this).val(); 
											}
										});
										opt.val(pre_item_val);
										opt.change();
									}
								}
							});
						}else{ //옵션없는 상품일 때,

						}
						
						// 초기화
						elandmall.optLayerEvt.initopt();
						
						//사은품이 있다면,
						if(typeof(p.gift_goods_info) != undefined  && typeof(p.gift_goods_info) != "undefined"){
							var strGiftInfo = "";
							strGiftInfo = ""+p.gift_goods_info;
							var arrGiftInfo = strGiftInfo.split(",");
							$("[id^=gift_slt]","#opt_box").each(function(idx,key){
								$(this).val(arrGiftInfo[idx]);
							});
						}
										
						$("#item_layer_change_button").click(function() {	//변경완료 클릭시 선택된 단품정보 리턴
							
							
							if(!elandmall.optLayerEvt.validcheck()){
								return;
							}
							
							var max_idx = $("#opt_box").data("max_opt_cnt");
							var opt = div.find("#item_opt_nm"+max_idx);
							
							
							if ($.type(p.callback) == "function") {
								var callback_param = elandmall.optLayerEvt.setCallbackParam();
								p.callback(callback_param);

							};
							layer.close();
						});
						
						$("#item_layer_save_button").click(function(){
							if(!elandmall.optLayerEvt.validcheck()){
								return;
							}
							
							var strGiftDtlInfo = "";
							//사은품이 있다면..
							if($("#giftInfo", "#_optChoiceLayer").length > 0){
								if($("#giftInfo", "#_optChoiceLayer").data("multi_yn") == "Y"){
									strGiftDtlInfo = $("#gift_slt").attr("data-value");
								}else{
									//여러사은품이 지급 될 수 있음. , <-로 사은품상세번호 구분
									$("[name=gift_dtl_no]","#_optChoiceLayer").each(function(){
										if(strGiftDtlInfo == ""){
											strGiftDtlInfo += $(this).attr("data-value");
										}else{
											strGiftDtlInfo += "," + $(this).attr("data-value");
										}
									});
								}
							}
							
							goodsInfo.gift_goods_info = strGiftDtlInfo;
							
							if($("#recev_slt", "#_optChoiceLayer").length > 0){
								goodsInfo["cart_grp_cd"] = $("#recev_slt", "#_optChoiceLayer").attr("data-value");
							}
							var saveParam = elandmall.optLayerEvt.setSaveParam({goods_info:goodsInfo});
							var carts = [];
							carts.push(saveParam);
							var items = [];
							$.each(carts, function() {
								items.push(this);
							});
							console.dir(items);
							//return;
							elandmall.cart.addCart({ 
								cart_divi_cd: cart_divi_cd,
								items: items
							});
						});
						$("#item_layer_cancel_button").click(function() {
							layer.close();
						});
					});
				}
			});	//[END] 옵션레이어 생성
		},
		
		/*
		 * 내  용 : 상품상세 퀵뷰(미리보기)
		 * */
		goodsPreview : function(p) {
			elandmall.layer.createLayer({
				layer_id:"_GOODSPREVIEW_LAYER_",
				class_name:"layer_pop lay_mini_detail",
				tit_class_name:"lay_tit ir",
				close_call_back:function(){
					$('#_GOODSPREVIEW_LAYER_ .lyr_select .sel_btn').unbind("click");
					$('#_GOODSPREVIEW_LAYER_').remove();
				},
				createContent:function(layer){
					var div = layer.div_content;
					var param = $.extend({quickview_yn:"Y", goods_no:"", vir_vend_no:""},p)
					div.load("/popup/initGoodsDetailPreview.action",param ,function(rsthtml, rstcode){
						
						if(rstcode == "success"){
							layer.show();
							
							
							
							var detailDescription= function( ids ){
								var $target = $(ids);

								if ( commonUI.isTarget( $target ) ) return;
								var $wapper, $wideImg,  $slider, $links, $btns, $LastItemLi, linksLength;

								function _init(){
									$wapper = $target.parents(".dt_ve_contents");
									$wideImg = $wapper.find(".dt_ve_ct_img");
									$slider = $wapper.find(".d_slide");
									$links = $slider.find("a");
									linksLength = parseInt($links.length);

									$btns = {
										prev : $wapper.find(".d_prev")
										,next : $wapper.find(".d_next")
										,wideNext : $wapper.find(".d_wide_next")
										,widePrev : $wapper.find(".d_wide_prev")
									}

									$LastItemLi = $links.eq(0);

									_eventInit();
								}

								function _eventInit(){
									$links.on("mouseenter , focus",function(e){
										_itemsOn( $(this) );
										_positionSet();
										_btnsSet();
									})

									$btns.prev.on("click",function(e){
										e.preventDefault();

										_sliderEngine("+=540");
										_sliderPartFunc();
										_btnsSet();
									})

									$btns.next.on("click",function(e){
										e.preventDefault();

										_sliderEngine("-=540");
										_sliderPartFunc();
										_btnsSet();
									})

									$btns.wideNext.on("click",function(e){
										e.preventDefault();

										_next();
										_positionSet();
										_btnsSet();
									})

									$btns.widePrev.on("click",function(e){
										e.preventDefault();

										_prev();
										_positionSet();
										_btnsSet();
									})


									$LastItemLi.triggerHandler("mouseenter");
								}

								function _sliderEngine( lef ){
									if ( $slider.is(":animated") ) return;

									$slider.css({"left": lef });
								}

								function _sliderPartFunc(){
									var chkSilderIDX = Math.abs(parseInt($slider.css("left")))/540;
									if ( chkSilderIDX == 0 ) {
										chkSilderIDX = 0;
									}else{
										chkSilderIDX = (chkSilderIDX*5)+1;
									}

									_itemsOn($links.eq(chkSilderIDX));
								}

								function _btnsSet(){
									var chkOnItemIDX = $slider.find("li.on").index(); // wide btn chk
									var chkSliderLeft = Math.abs(parseInt($slider.css("left")))/90; // slider 위치 chk
									var pageIDX = parseInt((chkOnItemIDX)/6);

									_sliderEngine("-"+(540*pageIDX)+"px");

									if ( linksLength < 6) {
										$btns.prev.removeClass("on");
										$btns.next.removeClass("on");
									}else{
										if ( chkSliderLeft > 0 && chkSliderLeft < linksLength-6 ) {
											$btns.next.addClass("on");
											$btns.prev.addClass("on");
										}else{
											if ( chkSliderLeft <= 0 ) {
												$btns.next.addClass("on");
												$btns.prev.removeClass("on");
											}else if ( chkSliderLeft > 0 && chkSliderLeft >= linksLength-6 ) {
												$btns.prev.addClass("on");
												$btns.next.removeClass("on");
											}
										}
									}


									// if ( chkSliderLeft > 0 && chkSliderLeft < linksLength-6 ) {

									if ( linksLength < 2 ) {
										$btns.widePrev.removeClass("on");
										$btns.wideNext.removeClass("on");
									}else{
										if ( (chkOnItemIDX > 0) && chkOnItemIDX < linksLength-1 ) {
											$btns.widePrev.addClass("on");
											$btns.wideNext.addClass("on");
										}else{
											if ( chkOnItemIDX <= 0 ) {
												$btns.widePrev.removeClass("on");
												$btns.wideNext.addClass("on");
											}else if ( chkOnItemIDX >= linksLength-1 ) {
												$btns.widePrev.addClass("on");
												$btns.wideNext.removeClass("on");
											}
										}
									}
									// if ( !(chkOnItemIDX%6 == 0) ) _sliderEngine("-="+(540*pageIDX));

								}

								function _next(){
									var _idx = $slider.find("li.on").index();

									_idx = ( _idx  < linksLength-1 ) ? _idx+1 : 0 ;
									var _$target = $links.eq(_idx);

									_itemsOn(_$target);
								}

								function _prev(){
									var _idx = $slider.find("li.on").index();

									_idx = ( _idx  > 0 ) ? _idx-1 : linksLength-1 ;
									var _$target = $links.eq(_idx);

									_itemsOn(_$target);
								}

								function _itemsOn( $target ){
									$LastItemLi.parent().removeClass("on");
									$target.parent().addClass("on");
									$LastItemLi = $target;

									var _imgSrc = {src : $target.find("img").attr("src")};
									$wideImg.attr(_imgSrc);
								}

								function _positionSet(){
									var chkOnItemIDX = $slider.find("li.on").index(); // wide btn chk
									var chkSliderLeft = Math.abs(parseInt($slider.css("left")))/90; // slider 위치 chk
									var pageIDX = parseInt((chkOnItemIDX)/6);

									_sliderEngine("-"+(540*pageIDX)+"px");
								}
								_init();
							}

							detailDescription("#description_"+param.goods_no+"_1");
							$('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
								var $li = $(this).parent();
								var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
								if(!$li.hasClass('sld_out')){
									$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
									$('.lyr_select').removeClass('on');
									$li.addClass('selected').siblings('li').removeClass('selected');
									showText($selBtn);
								}
							});
							
							//ui.js의 툴팁 이벤트 등록
							commonUI.view.toolTip();
							
						}else{
							layer.close();
						}
						
					});
				}
			});
		},

		fnNotiPopList : function(p){
			ElandmallEventListener.fnAddOnloadListener(function() {
				var html = "";
				var param = {
						type:"p", 
						disp_mall_no : p.disp_mall_no ,
						noti_clss_cd : p.noti_clss_cd ,
						rel_no : p.rel_no
				}
				$.ajax({
					url : "/popup/searchPopNotiList2.action",
					type : "GET",
					data : param,
					dataType : "json",
					cache : true,
					success : function(data){
						if(data != null && data.notiList != null){
							var noti_no = data.notiList[0].NOTI_NO;
							var cookie = elandmall.util.getCookie("noti_"+data.notiList[0].NOTI_NO);
							if(cookie == "false") return;
							var cookieType = data.notiList[0].COOKIE_DISP_DIVI_CD;
							
							var list = data.notiList;
							html += "<div class='lyr' style='opacity:0;filter:alpha(opacity=0)'>";
							html += "<h3 class='ir'>공지사항 레이어</h3>";
							html += "<div class='bx' id='noti_bn'>";
							html += "<div class='roll_wrap'>";
							html += "<div class='roll_indi'>";
							for(var i=0;i<list.length;i++){
								html += "<a href='#none' class='swiper-pagination-switch'>공지사항 배너" + i + "번</a>";
							}
							html += "</div>";
							html += "</div>";
							html += "<div class='swiper_container'>";
							html += "<ul class='swiper-wrapper'>";
							
							var x = 10;
							for(var i=0;i<list.length;i++){
								html += "<li class='swiper-slide'>";
								html += list[i].NOTI_CONT;
								html += "</li>";
								console.log(i + "::NOTI_CONT=" + list[i].NOTI_CONT);
							}
							html += "</ul>";
							html += "</div>";
							html += "<div class='bp_btns'>";
							html += "<a href='#' class='bp_bt_prev d_prev'>이전 공지 배너</a>";
							html += "<a href='#' class='bp_bt_next d_next'>다음 공지 배너</a>";
							html += "</div>";
							html += "</div>";
							html += "<div class='btn'>";
							if ( cookieType=="20" ) html += "<button type='button' class='p_today'><span>일주일간 보지 않기</span></button>";
							else if ( cookieType=="10" ) html += "<button type='button' class='p_today'><span>다시 보지 않기</span></button>";
							else html += "<button type='button' class='p_today'><span>오늘 하루 보지 않기</span></button>";
							html += "<button type='button' onclick='$(\".lyr_notice\").hide()'><em class='ir'>공지사항 레이어</em>닫기</button>";
							html += "</div>";
							html += "</div>";
							
							if ( noti_no!=null && noti_no.length > 0 ) {
								$(".lyr_notice").show();
								$("#span_layer_pop").append(html);
								
								setTimeout(function(){
									var $noti_wrapper = $("#noti_bn");
									var $btns = $noti_wrapper.find(".bp_btns");
									var noti_slds = $('#noti_bn .swiper-slide').length; // 2018.03.09 추가 등록 배너가 2개 이상일 때만.. 슬라이드
									var $btns = {
										prev : $btns.find(".d_prev")
										,next : $btns.find(".d_next")
									}
									var notiWidth = [];
									var notiHeight = [];
									$noti_wrapper.find($('.swiper-slide img')).each(function(index){
										console.log(index+":::swiper-slide img>>>src="+$(this).attr('src') );
										notiWidth[index] = $(this).outerWidth();
										notiHeight[index] = $(this).outerHeight();
										console.log(index+":::swiper-slide img>>>width="+notiWidth[index] + ", height="+notiHeight[index]);
									});
									$('.lyr_notice .bx, .lyr_notice .bx .swiper-slide ').css({
										width:Math.max.apply(null, notiWidth),
										height:Math.max.apply(null, notiHeight)
									});
									if(noti_slds > 1){ // 2018.03.09 추가 - 등록 배너가 2개 이상일 때만.. 슬라이드
										var noti_bn = new Swiper('#noti_bn .swiper_container',{
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
										});
				
										$btns.next.on("click",function(e){
											e.preventDefault();
											noti_bn.swipeNext()
										});
									} else{ // 2018.03.09 추가 -  등록 배너가 2개 이상일 때만.. 슬라이드
										$btns.next.hide();
										$btns.prev.hide();
										$noti_wrapper.find('.roll_wrap').hide();
									}
									
									$(".p_today").click(function(){		
										$.ajax({
											url: "/popup/setCookie.action",
											type: "POST",
											dataType: "json",
											data: {
													type : data.notiList[0].COOKIE_DISP_DIVI_CD,
													noti_no : data.notiList[0].NOTI_NO,
													end_time : data.notiList[0].END_TIME
												},
											complete: function(data){
												$(".lyr_notice").hide();
											},
											error: function( e ){
												alert("팝업 설정중에 오류가 발생했습니다.");
												$(".lyr_notice").hide();
											}
										});										
									});
	
									$noti_wrapper.parent().css({'opacity':100,'filter':'alpha(opacity=1)'});				
								}, 2000);
							}
							
						}else{
							$(".lyr_notice").hide();
						}
						

					}
				});
			});
		},
		/**
		 * 작성일 : 2016. 07. 06
		 * 메인 공지사항 팝업	
		 */
		fnPopChkAndPopup : function( result, x ){
			
			var existChk = false;
			var winX = window.screen.width;			// window width
			var popUrl = "/popup/initPopNoti.action";
			var popOption = "toolbar=no, location=no, fullscreen=no, scrollbars=yes, status=no, directories=no, resizable=yes";
			var endValue= 1;
			var today = 0;			
			var html = "";
			
			var cookie = elandmall.util.getCookie(result.NOTI_NO);
			if(cookie == "false") return x;
			var height = 60+parseInt(result.HEIGHT);
			if(result.POP_YN == 'Y'){
				alert("getNotiContents-Popup");
				window.open( popUrl+"?noti_no=" + result.NOTI_NO, result.NOTI_NO, "width="+result.WIDTH+", height="+height +", left=" + x + " " + popOption) ;
			}else if(result.POP_YN == 'L'){
				alert("getNotiContents-Layer");
				html += "<div class='lyr' id='lyr_notice_"+result.NOTI_NO+"' style='opacity:0;filter:alpha(opacity=0)'>";
				html += "<h3 class='ir'>공지사항 레이어</h3>";
				html += "<div class='bx'>";
				html += result.NOTI_CONT;
				html += "</div>";
				html += "<div class='btn'>";
				if(result.COOKIE_TYPE == "10" ){
					html += "<button type='button' class='btn_today' onclick='fnBtnCookie("+result.COOKIE_TYPE+","+result.NOTI_NO+","+result.END_DTIME+");'><span>다시 보지 않기</span></button>";
				}else if(result.COOKIE_TYPE == "20" ){
					html += "<button type='button' class='btn_today' onclick='fnBtnCookie("+result.COOKIE_TYPE+","+result.NOTI_NO+","+result.END_DTIME+");'><span>일주일간 보지 않기</span></button>";
				}else{
					html += "<button type='button' class='btn_today' onclick='fnBtnCookie("+result.COOKIE_TYPE+","+result.NOTI_NO+","+result.END_DTIME+");'><span>오늘 하루 보지 않기</span></button>";	
				}
				html += "<button type='button' onclick='fnLayerClose("+result.NOTI_NO+");'><em class='ir'>공지사항 레이어</em>닫기</button>";
				$("#layer_pop_main_"+result.NOTI_NO).html(html);
			}
			if(result.POP_YN == 'Y'){
				x = Number(x);
				x += Number(result.WIDTH)+20;		// 팝업창 위치 변경
			}
						
			return x;
		}
		,myGradeLayer : function(p) {
			elandmall.layer.createLayer({
				class_name:"layer_pop grade on",
				title: "등급산정 내역",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initMyGradeLayer.action", p,  function() {
						layer.show();
					});
				}   
			});
		}
		,myOrdLayer : function(p) {
			elandmall.layer.createLayer({
				class_name:"layer_pop grade on",
				title: "구매내역",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/popup/initMyOrdLayer.action", p,  function() {
						layer.show();
					});
				}   
			});
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
	 		
	 		var is_detailPreview = ( $("#detailPreview").length > 0 ) ? true : false; 
	 		
	 		if(road_base_addr != ""){ //도로명을 우선순위로 한다.
	 			road_base_addr = road_base_addr+" "+ dtl_addr;
	 		}else{
	 			road_base_addr = base_addr+" "+ dtl_addr;  //지번주소
	 		}

	 		var param = {
	 				road_base_addr :  road_base_addr
	 				, defualt_addr_yn : pin.param.defualt_addr_yn
	 				, deli_cart_grp_cd : deli_cart_grp_cd
	 		};
	 		

	 		elandmall.layer.createLayer({
				layer_id:"dlvConfirm",
				class_name:"layer_pop type03 on",
				close_btn_txt:"닫기",
				title :"배송지 확인",
				close_call_back: function(){
					// callback
					if ($.type(pin.callback_close) == "function") {
						pin.callback_close();
					}
					commonUI.dimRemove();
					$("#dlvConfirm").remove();
					
					if(p.quickview_yn == "Y" || is_detailPreview){ //퀵뷰 일때 
						elandmall.popup.fnLayerReturn();	
					}
				},
				createContent: function(layer) {
					
					var div = layer.div_content;
					div.load("/popup/initGoodsQuickDeliLayer.action", param, function() {

						if(is_detailPreview){
							$("#gd_float_opt_fix").removeClass("groups");
						}
						commonUI.dimCall();
						layer.show();
						
						// 닫기
						div.on("click", "a.btn_close, #closeBtn", function(e){
							commonUI.dimRemove();
							layer.close();
							if(p.quickview_yn == "Y" || is_detailPreview){ //퀵뷰 일때 
								elandmall.popup.fnLayerReturn();	
							}
							// callback
							if ($.type(pin.callback_close) == "function") {
								pin.callback_close();
							}
						});
						
						// 배송지 변경
						div.on("click", "#updateBtn", function(e){
							var str = window.location.href;
							if(str.indexOf('/goods/initGoodsDetail')  == -1 ){
								str = elandmall.util.newHttps("/goods/initGoodsDetail.action?goods_no=" + p.goods_no + "&vir_vend_no=" + p.vir_vend_no);
							}
							var url = elandmall.util.https("/mypage/searchBanJJakDlvpListLayer.action?url=" + encodeURIComponent(str));
							var option = "resizable=no,scrollbars=yes,width=820px,height=600px,left=400px";
							var popup = window.open(url, "오늘받송상품배송지목록", option);
							popup.focus();
							return false;
						});
						
						// 확인 
						div.on("click", "#saveBtn", function(e){
							commonUI.dimRemove();
							$("#dlvConfirm").remove();
							if(p.quickview_yn == "Y" || is_detailPreview){ //퀵뷰 일때 
								elandmall.popup.fnLayerReturn();	
							}
							// callback
							if ($.type(pin.callback_ok) == "function") {
								pin.callback_ok(pin);
							}
						});
					});
				}
			});
	 	},
	 	
	 	/**
	     * 퀵뷰 레이어 띄운 상태에서 레이어 띄우고 닫을 시 
	     * 퀵뷰레이어로 리턴된다.
	     *
	     * */
	 	fnLayerReturn : function(p){
	 		for(var i=0; i<$(".layer_pop").length; i++){
				if(typeof($(".layer_pop").eq(i).find('#quick_view_layer').val()) != "undefined" || $(".layer_pop").eq(i).attr('id') == "detailPreview" ){
					$(".layer_pop").eq(i).show();
					
					if(typeof($(".layer_pop").eq(i).find('#quick_view_layer').val()) != "undefined"){
					    $(".layer_pop").eq(i).focus();	
					}
					
					if($(".layer_pop").eq(i).attr('id') == "detailPreview" && $("#gd_float_opt_fix").length > 0){
				        $("#gd_float_opt_fix").addClass("groups");		
					}
				}
			}
	 	}
	}
	
	/**
	 * 사용방법
	 * elandmall.evalLayer({
			ord_no : 주문번호,
			ord_dtl_no : 주문상세번호,
			goods_eval_no : 상품평 번호,
			atypical_shop_no : 이벤트 매장번호,
			callback : 콜백함수(등록, 수정 이후 실행할 콜백)
		});
		등록
		일반 일때 : {ord_no, ord_dtl_no}
		이벤트 당첨일때 : {goods_no, atypical_shop_no}
		
		수정(등록과 동일 goods_eval_no 만 추가)  
	 */
	elandmall.evalLayer = {
		insEvalLayer : function(p){
			if ( $.type(p.callback) == "function"){
				elandmall.evalLayer._callback = p.callback;
				delete p.callback;
			}
			if($("#goods_eval_ins_layer").length > 0 ){
				$("#goods_eval_ins_layer").remove();
			}
			var titleName = "상품평 작성";
			if( elandmall.global.disp_mall_no == "0000053" || elandmall.global.disp_mall_no == "0000045" ) {
				titleName = "리뷰 작성";
			}
			
			p.gb = 'I';	// 등록
			elandmall.layer.createLayer({
				class_name:"layer_pop type02 d_layer_pop on",
				title: titleName,
				id:"goods_eval_ins_layer",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/content/initGoodsEvalLayer.action", p,  function(e) {
						
						if ( $("#evalform", div).length > 0 && $("[name=goods_no]", div).length > 0 ) {
							elandmall.evalLayer.fnEvalInit(div, layer);
							elandmall.evalLayer.fnEvalBaseSetScriptNew(div);
							
							$("a.on", div).find(".set_grade03").each(function(){ $(this).click()});	// 점수
							$("[name=selectScore] a.on", div).each(function(){ $(this).click()});	// 색상 사이즈
							
						}else if ( e.indexOf("evalGoodsError") > 0 ) {
							location.reload();
						}else{	// error
							alert("구매하신 상품정보가 올바르지 않습니다.");
						}
					});
				}
			});
		},
		editEvalLayer : function(p){
			if ( $.type(p.callback) == "function"){
				elandmall.evalLayer._callback = p.callback;
				delete p.callback;
			}
			
			var titleName = "상품평 수정";
			if( elandmall.global.disp_mall_no == "0000053" || elandmall.global.disp_mall_no == "0000045") {
				titleName = "리뷰 수정";
			}
			
			elandmall.layer.createLayer({
				class_name:"layer_pop type02 d_layer_pop on",
				title: titleName,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/content/initGoodsEvalEditLayer.action", p,  function( e) {
						if ( $("#evalform", div).length > 0  && $("[name=goods_no]", div).length > 0 ) {
							elandmall.evalLayer.fnEvalInit(div, layer);
							//elandmall.evalLayer.fnEvalBaseSetScriptNew(div);
							$(".eval_add_div",div).each(function(){
								var $this = $(this);
								var $links = $this.find("a");
								$links.on("click",function(e){
									$links.removeClass("on");
									
									$(this).addClass("on");
									
									e.preventDefault();
								})
							});
						}else{	// error
							alert("구매하신 상품정보가 올바르지 않습니다.")
						}
					});
				}
			});
		},
		insOldEvalLayer : function(p){
			if ( $.type(p.callback) == "function"){
				elandmall.evalLayer._callback = p.callback;
				delete p.callback;
			}
			
			var titleName = "상품평 작성";
			if( elandmall.global.disp_mall_no == "0000053" ) {
				titleName = "리뷰 작성";
			}
			
			elandmall.layer.createLayer({
				class_name:"layer_pop type02 d_layer_pop on",
				title: titleName,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/content/initOldGoodsEvalLayer.action", p,  function( e) {
						
						if ( $("#evalform", div).length > 0 ) {
							elandmall.evalLayer.fnEvalInit(div, layer);
							elandmall.evalLayer.fnEvalBaseSetScript(div);
							
							div.on("click", "[name=selectScore]", function(){
								var trObj = $(this).parents("tr");
								trObj.find("[name=old_score]").val( $(this).find("a").data("old_score") );
							});
							
							$("a.on", div).find(".set_grade03").each(function(){ $(this).click()});	// 점수
							$("[name=selectScore] a.on", div).each(function(){ $(this).click()});	// 색상 사이즈
							
						}else{	// error
							alert("구매하신 상품정보가 올바르지 않습니다.")
						}
					});
				}
			});
		},
		// 기본세팅 스크립트
		fnEvalBaseSetScript : function (div){
			$(".d_gradeSelect", div).each(function(){
				var $this = $(this);
				var $links = $this.find("a");
				$links.on("click",function(e){
					$links.removeClass("on");
		
					$(this).addClass("on");
					e.preventDefault();
				})
			});
			
			div.on("click", "[name=selectScore]", function(){
				var trObj = $(this).parents("tr");
				trObj.find("[name=goods_eval_item_score_gubun]").val( $(this).find("a").attr("value") );
				trObj.find("[name=goods_eval_item_score]").val( $(this).find("a").data("score") );
			});
			
			$("[name=recomm_yn]").on("click", function(){
				var tdObj = $(this).parents("td");
				$("#eval_recomm_yn", tdObj).val($(this).data("value"));
			});
			
		},
		// 기본세팅 스크립트 :new
		fnEvalBaseSetScriptNew : function (div){
			$(".d_gradeSelect",div).each(function(){
				var $this = $(this);
				var $links = $this.find("a");
				$links.on("click",function(e){
					$links.removeClass("on");
					
					$(this).addClass("on");
					
					e.preventDefault();
				})
			});
			
			div.find(".selectScore").each(function(){
				$(this).click(function(){
					var tdObj = $(this).parents("td");
					$("input[name='goods_eval_item_score_gubun']", tdObj).val($(this).attr("data-score_gubun"));
					$("input[name='goods_eval_item_score']", tdObj).val($(this).attr("data-score"));
				});
			});
			
			div.find(".selectScore.on").each(function(){
				var tdObj = $(this).parents("td");
				$("input[name='goods_eval_item_score_gubun']", tdObj).val($(this).attr("data-score_gubun"));
				$("input[name='goods_eval_item_score']", tdObj).val($(this).attr("data-score"));
				
			});
			
			div.find(".recomm_yn").each(function(){
				$(this).click(function(){
					var tdObj = $(this).parents("td");
					$("#eval_recomm_yn", tdObj).val($(this).attr("data-value"));
				});
			});
		},
		// 공통 스크립트
		fnEvalInit : function(div, layer){
			layer.show();
			
			// 폼클릭시 submit 방지
			$("button", div).click(function(){
				$("#evalform", div).submit(function(e){ e.preventDefault();});
			});
						
			div.on("click", "#evalRegist_btn", function(){
				if ( $('#goods_eval_cont').val() == "" || $('#goods_eval_cont').val().length < 10){
					if( elandmall.global.disp_mall_no == "0000053" || elandmall.global.disp_mall_no == "0000045") {
		    			alert("리뷰는 최소 10자 이상 입력해 주셔야 등록 가능 합니다. ");
		    		}else {
		    			alert("상품평은 최소 10자 이상 입력해 주셔야 등록 가능 합니다. ");
		    		}
		    		return false;
		    	} else if (elandmall.checkBanWord($('#goods_eval_cont').val())){
		    		return false;
		    	} else {
		    		
    				//상품평 필터 저장
					var arrAddInfo = [];
					
					var chkCnt = 0;
					var chkTotCnt = $(".eval_add_div").length ;
					div.find(".eval_add_div a.on").each(function(){
						var flt_no = $(this).attr("data-flt_no");
						var flt_dtl_no = $(this).attr("data-flt_dtl_no");
						arrAddInfo.push({"goods_eval_no": ""  ,"flt_no": flt_no ,"flt_dtl_no": flt_dtl_no });
					});
					
					if(chkTotCnt > 0 && chkTotCnt != arrAddInfo.length) {
						alert("입력되지 않은 항목이 있습니다.\n추가 정보를 입력 해 주세요. ");
						return false;
					}
					
					if(chkTotCnt > 0) {
						div.find("#eval_filter_array").val(JSON.stringify(arrAddInfo));
					}
  		
  					
					var confirmText = "상품평을 등록하시겠습니까? \n별점평가는 등록 이후에 수정되지 않습니다.";
					if( elandmall.global.disp_mall_no == "0000053" || elandmall.global.disp_mall_no == "0000045") {
						confirmText = "리뷰를 등록하시겠습니까? \n별점평가는 등록 이후에 수정되지 않습니다.";
					}
  		
    				if ( $(this).data("isNew") == 'Y' && !confirm(confirmText)){
    					return false;
    				}


		    		var fo = $("#evalform").createForm();
		    		var url = "/content/registGoodsEval.action";
		    		
		    		if ( $(this).data("old_yn") == 'Y' ){
		    			url = "/content/registOldGoodsEval.action";
		    		}
		    		fo.submit({
			    		action: url,
			            iframe: true,
			            success: function(p) {
			            	layer.close();
			            	elandmall.evalLayer._callback(); // callback
			            },
			            error:function(p){
			            	if(p.ret_msg != null && p.ret_msg != ""){
			                    alert(p.ret_msg);
			                }else{
			                    alert("오류가 발생했습니다.");
			                    return false;
			                }
			            }
			    	});
		    	}
			});
			
			// 파일 변경시
			div.on("change", "input[type=file]", function() {
				var fObj = $(this);
				var ext = fObj.val().split('.').pop().toLowerCase(); //확장자
				var liIdx = $("#img_ul").data("clickimgidx");
				var err = "";
				var fileInfo = {file_name : $("input[type=file]").val(), upload_key : $("[name=goods_no]",div).val()}
				if (fObj.val() == ""){
					$('#upload_form').clearForm();
				}else{
					if($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
						err = "이미지 파일이 아닙니다! (gif, png, jpg, jpeg 만 업로드 가능)";
			        	alert(err);
			        	elandmall.evalLayer.evalErrorLog(fileInfo, err);
			        	$('#upload_form').clearForm();
					}else{
						 var fileName = fileName = $(this).val().split(/(\\|\/)/g).pop();
						 var form = document.getElementById("upload_form");
						  $.ajax({ url:"/content/getUploadAuthority.action", 
					            dataType: "json",  
					            data:{orgFileNm : fileName, upload_divi_cd : "20"},      
					            success: function(pin) {
					            	$("#key").val(pin.key);
									$("#acl").val(pin.acl);				
									$("#Content-Type").val(pin['Content_Type']);
									$("#x-amz-meta-uuid").val(pin.x_amz_meta_uuid);
									$("#x-amz-server-side-encryption").val(pin.x_amz_server_side_encryption);
									$("#X-Amz-Credential").val(pin.x_amz_credential);
									$("#X-Amz-Algorithm").val(pin.x_amz_algorithm);
									$("#X-Amz-Date").val(pin.x_amz_date);				
									$("#Policy").val(pin.Policy);
									$("#X-Amz-Signature").val(pin.x_amz_signature); 
									if(pin.x_amz_meta_tag!=undefined){
										$("#x-amz-meta-tag").val(pin.x_amz_meta_tag);
									}
									if(pin.success_action_redirect!=undefined){
										var input = document.createElement("input");
										input.setAttribute('type', 'text');
										input.setAttribute('id', 'success_action_redirect');
										input.setAttribute("type", "hidden");
										var form = document.getElementById("upload_form");
										form.appendChild(input);
										$("#success_action_redirect").val(pin.success_action_redirect);
										$("#success_action_status").remove();
									}else{
										var input = document.createElement("input");
										input.setAttribute('type', 'text');
										input.setAttribute('id', 'success_action_status');
										input.setAttribute("type", "hidden");
										var form = document.getElementById("upload_form");
										form.appendChild(input);
										$("#success_action_status").val(pin.success_action_status);
										$("#success_action_redirect").remove();
									}
									
									$('#upload_form').ajaxForm({
										  type:"POST",
										  async: false,
								          cache: false,
								          dataType: "xml",
								          enctype : "multipart/form-data",
								          contentType: 'multipart/form-data',
								          mimeType: 'multipart/form-data',
								          processData: false,
								          crossDomain: true,
									      url: pin.uploadUrl,
									    headers: {
						                    'Access-Control-Allow-Origin': '*' 
						                },
									    success: function () {
									    	elandmall.evalLayer.evalImgView(pin.file_path, pin.ori_file_nm, pin.file_key);
									    	$.each($('#upload_form').serializeArray(), function(i, field) {
									    		if(field.name !="file"){
									    			if($(this).data("imgfield") == "Y"){
									    				$('#'+field.name,upload_form).val('');
									    			}
									    		}					    		                                 
							                });
									    	$('#upload_form').clearForm();
									    },
									    error: function (e) {
									    	if(e.error_message == "EntityTooLarge"){
									    		err = "5MB 이하의 이미지만 등록 가능합니다.";
									        	alert(err);
									        	elandmall.evalLayer.evalErrorLog(fileInfo, err);
									    	}else{
									    		 alert('파일 업로드 중 오류가 발생하였습니다.');
									    		 err = e.error_message;
									    		 elandmall.evalLayer.evalErrorLog(fileInfo, err);
									    	}
									    	$.each($('#upload_form').serializeArray(), function(i, field) {
									    		if(field.name!="file"){
									    			if($(this).data("imgfield") == "Y"){
									    				$('#'+field.name,upload_form).val('');
									    			}
									    		}					    		                                 
							                });
									    	$('#upload_form').clearForm();
									    }
									  }).submit();
					            },
					            error: function(p) {
					            	if(p.error_message != "") {
					               		window.alert(p.error_message);
					               		err = e.error_message;
					              	}else{
					              		 alert('파일 업로드 중 오류가 발생하였습니다.');
					              	}
					            	
					            	elandmall.evalLayer.evalErrorLog(fileInfo, err);
						    		 
							    	$.each($('#upload_form').serializeArray(), function(i, field) {
							    		if(field.name!="file"){
							    			if($(this).data("imgfield") == "Y"){
							    				$('#'+field.name,upload_form).val('');
							    			}
							    		}					    		                                 
					                });
							    	$('#upload_form').clearForm();
					          	}
					   	 });
					   }
				}
		    });
			
			// 이미지삭제
			div.on("click", "[name=file_delete_btn]", function(){
				var btnObj = $(this);
				var liObj = btnObj.parents("[id^=li_edit_file_]");
				var file_seq = btnObj.data("fileSeq");
				
				if ( file_seq != undefined ){
					var trObj = btnObj.parents("tr");
					
					liObj.hide();
					liObj.find("[name=use_yn]").val("N");
					
					if ( trObj.find("li[id^=li_file_]:hidden").length > 0 ){
						trObj.find("li[id^=li_file]:hidden").eq(0).show();
					}
				}else{
					liObj = btnObj.parents("[id^=li_file_]");
					elandmall.evalLayer.fileReset( liObj.find("input[type=file]") );
				}
			});
			
			// 닫기
			div.on("click", "#layer_close", function(){
				layer.close();
			});
		},
		fileReset : function(obj){
			var liObj = obj.parents("[id^=li_file_]");
			// IE8 9 10 file 이 보안상 삭제 처리가 안됨, 이에따른 분기처리
			if($.browser.msie){
				obj.replaceWith(obj.clone(true));
		    } else {
		    	obj.val("");
		    }
			liObj.find("[name=file_type_cd]").val("");
			liObj.find("[name=file_delete_btn]").hide();
		},
		evalTextMaxLength :function(obj){
			var $obj = $(obj);
			var len = $obj.val().length;
			var maxlength = 1000;
			if ( len >= maxlength ){
				alert("최대 "+maxlength+"자까지 입력이 가능합니다.");
				$obj.val( $obj.val().substr(0, maxlength));
				return false;
			}
		},
		evalImgView:function(file_path, ori_file_nm, file_key){
			var html = 	"" + 
							"	<div class=\"thumb\">"+
							"		<input type=\"hidden\" name=\"file_key\" value=\""+file_key+"\"/>"+
							"		<input type=\"hidden\" name=\"file_path\" value=\""+file_path+"\"/>"+
							"		<input type=\"hidden\" name=\"ori_file_nm\" value=\""+ori_file_nm+"\"/>"+
							"		<img src=\""+ file_path+"\" alt=\""+ ori_file_nm+"\">"+
							"		<button class=\"del\" onclick=\"elandmall.evalLayer.evalImgDel(this, {file_path:'"+file_path+"'})\"><em class=\"ir\">등록 이미지 삭제</em></button>"+
							"	</div>";
			
				var idx = $("#img_ul").data("clickimgidx");
				$("#li_file_"+idx).append(html).addClass("on");
				
				var $img = $("#li_file_"+idx + " .thumb").find("img");
				$img.on("load", function(){
					var thumbW = $img.outerWidth();
					var thumbH = $img.outerHeight();
					thumbW > thumbH ? elandmall.evalLayer.evalImgline($img,"H") : false;
					thumbW < thumbH ? elandmall.evalLayer.evalImgline($img,"V") : false;
					thumbW == thumbH ? $img.addClass('squa') : false;
				})
				
		},evalImgline : function($target , s){
			if(s == "H"){
				$target.addClass('hori');
				$target.css('margin-left', (68-$target.outerWidth())/2);
			}
			if(s == "V"){
				$target.addClass('verti');
				$target.css('margin-top', (68-$target.outerHeight())/2);
			}
		},
		evalImgDel:function(obj, p){
			if ( !confirm("선택한 사진을 삭제하시겠습니까?")){
				return false;
			}
			var liObj = $(obj).parents("li[name=img_li]");
			liObj.removeClass("on");
			liObj.find('div.thumb').remove();
			liObj.find("[name=use_yn]").val("N");
		},
		evalImgUp:function(obj,idx){
			$(obj).parents("ul").data("clickimgidx", idx);
			$("#file").click();
		},
		evalErrorLog:function(fileInfo, err){
			$.ajax({
				url: "/content/evalErrorLogWrite.action",
				type: "POST",
				dataType: "text",
				async:false,
				data: {err : err , upload_key : fileInfo.upload_key, file_name : fileInfo.file_name},
				success: function(data){
					/**/
				},
				error: function( e ){
					/**/
				}
			});
		},
		_callback : function(){}
	}
	

	
	/**
	 * 사용방법
	 * pin = ({
			ord_no : 주문번호,
			ord_dtl_no: 주문상세번호,
			ord_dlvp_seq : 주문배송순번,
			ord_upt_divi_cd : 주문변경구분코드
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
				layer_id:"myOrdDlvpLayer",
				class_name:"layer_pop d_layer_pop on",
				tit_class_name : "lay_tit02",
				cont_class_name: "deli",
				dimm_use: true,
				title: tmp_title,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/mypage/initMyOrderDlvpModifyLayer.action", pin, function() {
						var $div = $(this);
						var init_data_clone = $(div).clone();
						var isModfyRun = false;
						
						elandmall.ordDlvpLayer.fnInit( $div );
						layer.show();
						
						$("[name=dlvp_nm]").attr("disabled", true);
						
						//기본배송지 설정에 따른 배송지명 편집 설정
						div.on("change", "#chk_basic_ship", function(){
							if($("#chk_basic_ship").is(':checked')){
								$("[name=dlvp_nm]").attr("disabled", false);
								$(this).val("Y");
							}else{
								$("[name=dlvp_nm]").attr("disabled", true);
								$(this).val("N");
							}
						});
						
						div.on("click", "#cancelBtn", function(){
							layer.close();
						});
						
						//초기화
						div.on("click", "#initBtn", function(){
							$(div).html(init_data_clone.html());
							$("input[name!='ord_no'][name!='orderer_nm'][name!='ord_memo_seq'][name!='ord_dtl_no'][name!='ord_dlvp_seq'][name!='mbr_dlvp_seq'], select", $div).val("");
						});
						
						//주소검색 레이어
						div.on("click", "#postLayer", function(){
							var returnFun = function(p){
								elandmall.ordDlvpLayer.fnPostCallBack($div, p);
							}
							
							elandmall.popup.postLayer({today_receive: pin.today_receive,callback:returnFun, close_call_back:function(){
								$('#_COMMON_LAYER_').hide();//주소검색 레이어 숨기기
								$('#myOrdDlvpLayer').show();//배송지변경 레이어 보이기
							}});
							
							_preventDefault();
						});
						
						//배송지변경
						div.on("click", "#modifyBtn", function(){
							if(isModfyRun) {
								return;
							}
							// form 필수체크
							if ( elandmall.ordDlvpLayer.fnCheckFormSet( $div ) ){
								return;
							}
							isModfyRun = true;
							var base_yn_change= false;	//disable제어값
							if(div.find("[name=base_yn]").attr("disabled")){
								base_yn_change=true;
								div.find("[name=base_yn]").attr("disabled",false);
							}
							$.ajax({
								url: "/mypage/updateMyOrdDlvpInfo.action",
								type: "POST",
								dataType: "json",
								async:false,
								data: $('#dlvpLayerformObj').serialize(),
								success: function(data){
									
									if(data.code=='S'){
										location.reload();
									}else{
										isModfyRun = false;
										alert(data.msg);
										base_yn_change=false;
										/*elandmall.layer.createLayer({
											class_name: "layer_pop confirm d_layer_pop on",
											createContent: function(layer) {
												layer.div_content.append(
													"<div class=\"alert_box03\">" +
													"	<span class=\"alert_tit\">입력하신 주소로 <strong class=\"txt_c05\">배송 불가한 상품</strong>이 존재 합니다.</span>" +
													"</div>" +
													"<div class=\"set_btn\">" +
													"	<button type=\"button\" class=\"btn02\"><span>배송지 변경</span></button>" +
													"</div>"		
												);
												layer.div_content.find("button").click(function() {
													var button = $(this);
													if (button.hasClass("c01")) {
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
									base_yn_change=false;
									if ( e.error_message !=null && e.error_message != ""){
										alert(e.error_message);
									}else{
										alert("오류가 발생하였습니다.");
									}
								}
							});
							
							if(base_yn_change){
								div.find("[name=base_yn]").attr("disabled",true);
							}
						});
						
						
						//배송지 목록
						div.on("click", "#dlvpListBtn", function(){
							elandmall.popup.myDlvpListLayer({
								callback: function(data) {
									
									div.find("[name=dlvp_nm]").val(data.dlvp_nm);
								
									isChecked = data.base_yn == "Y" ? true:false;
									div.find("[name=base_yn]").prop("checked",isChecked);
									div.find("[name=base_yn]").attr("disabled",isChecked);
									
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
									var addr_divi_cd    = "10";
									if(data.r_post_no != "") {
									    addr_divi_cd = "20";
										view_post_no 	= data.r_post_no;
										view_base_addr 	= data.r_base_addr;
										view_dtl_addr 	= data.r_dtl_addr;
									}else{
										view_post_no 	= data.j_post_no ;
										view_base_addr 	= data.j_base_addr;
										view_dtl_addr 	= data.j_dtl_addr;
									}
									
									div.find("[name=addr_divi_cd]").val(addr_divi_cd);
									div.find("#view_post_no").val(view_post_no);
									div.find("#view_base_addr").val(view_base_addr);
									div.find("#view_dtl_addr").val(view_dtl_addr);
									
									div.find("[name=ord_memo_cont]").val(data.deli_msg).blur();
									
		

								},
								 close_call_back:function(){
										$('#dlvp_layer').remove();
										$('#myOrdDlvpLayer').show();
								 }
							});
						});
					});
				}
			});
		},
		setReturnDlvpLayer : function(pin){
			var title = "회수지 변경";
			
			if(pin.dlvp_id.indexOf("ship") == 0){
				title = "배송지 변경";
			}

			_preventDefault();
			elandmall.layer.createLayer({
				layer_id:"myReturnDlvpLayer",
				class_name:"layer_pop d_layer_pop on",
				tit_class_name : "lay_tit02",
				cont_class_name: "deli",
				dimm_use: true,
				title: title,
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/mypage/initMyReturnDlvpSetLayer.action", pin, function() {
						var init_data_clone = $(div).clone();
						var $div = $(this);
						
						elandmall.ordDlvpLayer.fnInit( $div );
						layer.show();
						
						div.on("click", "#cancelBtn", function(){
							layer.close();
						});
						
						//초기화
						div.on("click", "#initBtn", function(){
							$(div).html(init_data_clone.html());
							
							$("#formObjRetLayer input, select").not("#order_nm").val("");
						});	
						
						//주소검색 레이어
						div.on("click", "#postLayer", function(){
							var returnFun = function(p){
								elandmall.ordDlvpLayer.fnPostCallBack($div, p);
							}
							
							elandmall.popup.postLayer({callback:returnFun, close_call_back:function(){
								$('#_COMMON_LAYER_').hide();//주소검색 레이어 숨기기
								$('#myReturnDlvpLayer').show();//배송지변경 레이어 보이기
							}});
							_preventDefault();
						});
						
						//배송지변경
						div.on("click", "#modifyBtn", function(){
							// form 필수체크
							if ( elandmall.ordDlvpLayer.fnCheckFormSet( $div ) ){
								return;
							}
							
							var dlvpId = $("#"+pin.dlvp_id);
							dlvpId.find("[name=recvr_nm]").text($('#formObjRetLayer [name=recvr_nm]').val());
							dlvpId.find("[name=recvr_tel1]").text($('#formObjRetLayer [name=recvr_tel1]').val());
							dlvpId.find("[name=recvr_tel2]").text($('#formObjRetLayer [name=recvr_tel2]').val());
							dlvpId.find("[name=recvr_tel3]").text($('#formObjRetLayer [name=recvr_tel3]').val());
							dlvpId.find("[name=recvr_cell_no1]").text($('#formObjRetLayer [name=recvr_cell_no1]').val());
							dlvpId.find("[name=recvr_cell_no2]").text($('#formObjRetLayer [name=recvr_cell_no2]').val());
							dlvpId.find("[name=recvr_cell_no3]").text($('#formObjRetLayer [name=recvr_cell_no3]').val());
							dlvpId.find("[name=recvr_post_no]").text($('#formObjRetLayer [name=recvr_post_no]').val());
							dlvpId.find("[name=recvr_base_addr]").text($('#formObjRetLayer [name=recvr_base_addr]').val());
							dlvpId.find("[name=recvr_dtl_addr]").text($('#formObjRetLayer #view_dtl_addr').val());
							dlvpId.find("[name=recvr_road_post_no]").text($('#formObjRetLayer [name=recvr_road_post_no]').val());
							dlvpId.find("[name=recvr_road_base_addr]").text($('#formObjRetLayer [name=recvr_road_base_addr]').val());
							dlvpId.find("[name=recvr_road_dtl_addr]").text($('#formObjRetLayer #view_dtl_addr').val());
							dlvpId.find("[name=addr_divi_cd]").text($('#formObjRetLayer [name=addr_divi_cd]').val());
							
							if($('#formObjRetLayer [name=addr_divi_cd]').val() == "10"){	// 지번
								dlvpId.find("[name=post_no]").text($('#formObjRetLayer [name=recvr_post_no]').val());
								dlvpId.find("[name=base_addr]").text($('#formObjRetLayer [name=recvr_base_addr]').val());
								dlvpId.find("[name=dtl_addr]").text($('#formObjRetLayer #view_dtl_addr').val());
							}else{
								dlvpId.find("[name=post_no]").text($('#formObjRetLayer [name=recvr_road_post_no]').val());
								dlvpId.find("[name=base_addr]").text($('#formObjRetLayer [name=recvr_road_base_addr]').val());
								dlvpId.find("[name=dtl_addr]").text($('#formObjRetLayer #view_dtl_addr').val());
							}

							// 배송비계산 상태 초기화
							isCostCalc = false;

							layer.close();
						});
						
						
						//배송지 목록
						div.on("click", "#dlvpListBtn", function(){
							elandmall.popup.myDlvpListLayer({
								callback: function(data) {
																	
									div.find("[name=dlvp_nm]").val(data.dlvp_nm);
								
									isChecked = data.base_yn == "Y" ? true:false;
									div.find("[name=base_yn]").prop("checked",isChecked);
								
									
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
									var addr_divi_cd    = "10";
									if(data.r_post_no != "") {
									    addr_divi_cd = "20";
										view_post_no 	= data.r_post_no;
										view_base_addr 	= data.r_base_addr;
										view_dtl_addr 	= data.r_dtl_addr;
									}else{
										view_post_no 	= data.j_post_no ;
										view_base_addr 	= data.j_base_addr;
										view_dtl_addr 	= data.j_dtl_addr;
									}
									
									div.find("[name=addr_divi_cd]").val(addr_divi_cd);
									div.find("#view_post_no").val(view_post_no);
									div.find("#view_base_addr").val(view_base_addr);
									div.find("#view_dtl_addr").val(view_dtl_addr);
									
									div.find("[name=ord_memo_cont]").val(data.deli_msg);

								},
								 close_call_back:function(){
										$('#dlvp_layer').remove();
										$('#myReturnDlvpLayer').show();
								 }
							});
						});
					});
				}
			});
		},
		fnInit : function ( $div ){
			if($("[name=addr_divi_cd]", $div).val() == "20") {	// 도로명
				$("#view_post_no", $div).val($("[name=recvr_road_post_no]", $div).val());
				$("#view_base_addr", $div).val($("[name=recvr_road_base_addr]", $div).val());
				$("#view_dtl_addr", $div).val($("[name=recvr_road_dtl_addr]", $div).val());
			}else{	// 지번
				$("#view_post_no", $div).val($("[name=recvr_post_no]", $div).val());
				$("#view_base_addr", $div).val($("[name=recvr_base_addr]", $div).val());
				$("#view_dtl_addr", $div).val($("[name=recvr_dtl_addr]", $div).val());
			}
		},
		// 우편번호 callback
		fnPostCallBack : function( $div, p ){
			console.log(p.addr_gb);
			$('[name=addr_divi_cd]', $div).val(p.addr_gb);
			$('[name=recvr_post_no]', $div).val(p.j_post_no);
			$('[name=recvr_base_addr]', $div).val(p.j_base_addr);
			$('[name=recvr_dtl_addr]', $div).val(p.j_dtl_addr);
			$('[name=recvr_road_post_no]', $div).val(p.r_post_no);
			$('[name=recvr_road_base_addr]', $div).val(p.r_base_addr);
			$('[name=recvr_road_dtl_addr]', $div).val(p.r_dtl_addr);
			
			if(p.addr_gb == "20"){		// 도로명
				$('#view_post_no', $div).val(p.r_post_no);
				$('#view_base_addr', $div).val(p.r_base_addr);
				$('#view_dtl_addr', $div).val(p.r_dtl_addr);
			}else{		// 지번
				$('#view_post_no', $div).val(p.j_post_no);
				$('#view_base_addr', $div).val(p.j_base_addr);
				$('#view_dtl_addr', $div).val(p.j_dtl_addr);
			}
		},
		fnCheckFormSet : function( $div ){
			//필수 체크
			var telNoChk = /^\d{2,3}-\d{3,4}-\d{4}$/; // 전화번호
			var cellNoChk = /^\d{3}-\d{3,4}-\d{4}$/; // 휴대폰 번호
			
			if($('[name=dlvp_nm]', $div).val()=='' && $('[name=no_member]').val() != 'true'){
				alert('배송지명을 입력해 주세요.');
				return true;
			}
			if($('[name=recvr_nm]', $div).val()==''){
				alert('받으시는 분을 입력해 주세요.');
				return true;
			}
			if($('[name=recvr_tel1]').val()!='' || $('[name=recvr_tel2]').val()!='' || $('[name=recvr_tel3]').val()!=''){
				// 전화번호는 선택 (일부입력시에 체크)
				if($('[name=recvr_tel1]', $div).val()=='' || $('[name=recvr_tel2]', $div).val()=='' || $('[name=recvr_tel3]', $div).val()=='') {
					alert('전화번호를 올바르게 입력해주세요.');
					return true;
				}
			}
			if($('[name=recvr_cell_no1]', $div).val()=='' || $('[name=recvr_cell_no2]', $div).val()=='' || $('[name=recvr_cell_no3]', $div).val()==''){
				alert('휴대폰 번호를 입력해 주세요.');
				return true;
			}
			
			var telNumber = $.trim($('[name=recvr_tel1]', $div).val()) + "-" + $.trim($('[name=recvr_tel2]', $div).val()) + "-" + $.trim($('[name=recvr_tel3]', $div).val()); // 전화번호
			var phoneNumber = $.trim($('[name=recvr_cell_no1]', $div).val()) + "-" + $.trim($('[name=recvr_cell_no2]', $div).val()) + "-" + $.trim($('[name=recvr_cell_no3]', $div).val()); // 휴대폰 번호
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
			
			if($('#view_post_no', $div).val()==''){
				alert('배송지 기본주소를 입력해 주세요.');
				return true;
			}
			if($('#view_dtl_addr', $div).val()==''){
				alert('배송지 상세주소를 입력해 주세요.');
				return true;
			}
			
			if($("[name=addr_divi_cd]", $div).val() == "20") {
				$("[name=recvr_road_dtl_addr]", $div).val($("#view_dtl_addr", $div).val());
			}else{
				$("[name=recvr_dtl_addr]", $div).val($("#view_dtl_addr", $div).val());
			}
			
			var msg = $("#view_deli_memo_cont option:selected", $div).val();
			if(msg == "direct"){
				$("[name=ord_memo_cont]", $div).val($("textarea").val());
			}else{
				$("[name=ord_memo_cont]", $div).val(msg);
			}
			
			//가구배송 약관동의가 있을경우
			if($div.find("#chk_bahus_odr").length > 0) {  
				if( !$(":input[name='laddercar_yn']", $div).is(":checked")) {
					$(":input[name='laddercar_yn']", $div).focus();
					alert("사다리차 이용에 대한 동의를 하셔야 변경 가능합니다.");
					return true;
				}
				
				if( !$(":input[name='elevator_yn']", $div).is(":checked")) {
					$(":input[name='elevator_yn']:eq(0)", $div).focus();
					alert("엘리베이터 유무 체크는 필수 항목입니다.");
					return true;
				}
				
				if( $(":input[name='wellanchor_yn']:checked", $div).val() == "Y") {
					if(!$("#chk_fixed", $div).is(":checked")){
						$("#chk_fixed", $div).focus();
						alert("벽고정 설치에 대한 동의를 하셔야 변경 가능합니다.");
						return true;
					}
				}
				
				if( !$("#chk_bahus_odr", $div).is(":checked")) {
					$("#chk_bahus_odr", $div).focus();
					alert("가구 배송약관에 대한 동의를 하셔야 변경 가능합니다.");
					return true;
				}
			}
			
			
			return false;
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
		/*editReturnDlvpLayer : function(pin){
			_preventDefault();
			
			elandmall.layer.createLayer({
				layer_id:"myReturnDlvpLayer",
				class_name:"layer_pop d_layer_pop on",
				tit_class_name : "lay_tit02",
				title: "회수지 변경",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/mypage/initMyReturnDlvpModifyLayer.action", pin, function() {
						var init_data_clone = $(div).clone();
						layer.show();
						
						div.on("click", "#cancelBtn", function(){
							layer.close();
						});
						
						//초기화
						div.on("click", "#initBtn", function(){
							$(div).html(init_data_clone.html());
						});
						
						//주소검색 레이어
						div.on("click", "#postLayer", function(){
							var returnFun = function(p){
								$('[name=addr_divi_cd]').val(p.addr_gb);
								$('[name=recvr_post_no]').val(p.j_post_no);
								$('[name=recvr_base_addr]').val(p.j_base_addr);
								$('[name=recvr_dtl_addr]').val(p.j_dtl_addr);
								$('[name=recvr_road_post_no]').val(p.r_post_no);
								$('[name=recvr_road_base_addr]').val(p.r_base_addr);
								$('[name=recvr_road_dtl_addr]').val(p.r_dtl_addr);
								
								if(p.addr_gb == "20"){
									$('#view_post_no').val(p.r_post_no);
									$('#view_base_addr').val(p.r_base_addr);
									$('#view_dtl_addr').val(p.r_dtl_addr);
								}else{
									$('#view_post_no').val(p.j_post_no);
									$('#view_base_addr').val(p.j_base_addr);
									$('#view_dtl_addr').val(p.j_dtl_addr);
								}
							}
							
							elandmall.popup.postLayer({callback:returnFun, close_call_back:function(){
								$('#_COMMON_LAYER_').hide();//주소검색 레이어 숨기기
								$('#myReturnDlvpLayer').show();//배송지변경 레이어 보이기
							}});
							
							_preventDefault();
						});
						
						//배송지변경
						div.on("click", "#modifyBtn", function(){
							//필수 체크
							if($('[name=recvr_nm]').val()==''){
								alert('보내시는 분을 입력해 주세요.');
								return;
							}else if($('[name=recvr_cell_no1]').val()=='' || $('[name=recvr_cell_no2]').val()=='' || $('[name=recvr_cell_no3]').val()==''){
								alert('휴대폰 번호를 입력해 주세요.');
								return;
							}else if($('#view_post_no').val()==''){
								alert('배송지 기본주소를 입력해 주세요.');
								return;
							}else if($('#view_dtl_addr').val()==''){
								alert('배송지 상세주소를 입력해 주세요.');
								return;
							}
							
							//입력된 상세주소를 주소구분에 따라 값 세팅(레이어 화면에 선언된 함수)
							fnSetDtlAddr();
							
							$.ajax({
								url: "/mypage/updateMyOrdDlvp.action",
								type: "POST",
								dataType: "text",
								async:false,
								data: $('#dlvpLayerformObj').serialize(),
								success: function(data){
									if(data=='S'){										
										location.reload();
									} else if(data=='F') {
										alert(data.ret_msg);
									}
								},
								error: function( e ){
									if ( e.error_message !=null && e.error_message != ""){
										alert(e.error_message);
									}else{
										alert("오류가 발생하였습니다.");
									}
								}
							});
						});
					});
				}
			});
		},		
		setOrdDlvpLayer : function(pin){
			
			elandmall.layer.createLayer({
				layer_id:"myOrdDlvpLayer",
				class_name:"layer_pop d_layer_pop on",
				tit_class_name : "lay_tit02",
				title: "배송지 변경",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/mypage/initMyOrderDlvpSetLayer.action", pin, function() {
						var $div = $(this);
						var init_data_clone = $(div).clone();
						layer.show();
						
						div.on("click", "#cancelBtn", function(){
							layer.close();
						});
						
						//초기화
						div.on("click", "#initBtn", function(){
							$(div).html(init_data_clone.html());
							
							$("#formObjLayer input, select").val("");
						});
						
						//주소검색 레이어
						div.on("click", "#postLayer", function(){
							var returnFun = function(p){
								$('#formObjLayer [name=addr_divi_cd]').val(p.addr_gb);
								$('#formObjLayer [name=recvr_post_no]').val(p.j_post_no);
								$('#formObjLayer [name=recvr_base_addr]').val(p.j_base_addr);
								$('#formObjLayer [name=recvr_dtl_addr]').val(p.j_dtl_addr);
								$('#formObjLayer [name=recvr_road_post_no]').val(p.r_post_no);
								$('#formObjLayer [name=recvr_road_base_addr]').val(p.r_base_addr);
								$('#formObjLayer [name=recvr_road_dtl_addr]').val(p.r_dtl_addr);
								
								if(p.addr_gb == "20"){
									$('#formObjLayer #view_post_no').val(p.r_post_no);
									$('#formObjLayer #view_base_addr').val(p.r_base_addr);
									$('#formObjLayer #view_dtl_addr').val(p.r_dtl_addr);
								}else{
									$('#formObjLayer #view_post_no').val(p.j_post_no);
									$('#formObjLayer #view_base_addr').val(p.j_base_addr);
									$('#formObjLayer #view_dtl_addr').val(p.j_dtl_addr);
								}
							}
							
							elandmall.popup.postLayer({callback:returnFun, close_call_back:function(){
								$('#_COMMON_LAYER_').hide();//주소검색 레이어 숨기기
								$('#myOrdDlvpLayer').show();//배송지변경 레이어 보이기
							}});
						});
						
						//배송지변경
						div.on("click", "#modifyBtn", function(){
							//필수 체크
							if($('#formObjLayer [name=recvr_nm]').val()==''){
								alert('받으시는 분을 입력해 주세요.');
								return;
							}else if($('#formObjLayer [name=recvr_cell_no1]').val()=='' || $('#formObjLayer [name=recvr_cell_no2]').val()=='' || $('#formObjLayer [name=recvr_cell_no3]').val()==''){
								alert('휴대폰 번호를 입력해 주세요.');
								return;
							}else if($('#view_post_no').val()==''){
								alert('배송지 기본주소를 입력해 주세요.');
								return;
							}else if($('#view_dtl_addr').val()==''){
								alert('배송지 상세주소를 입력해 주세요.');
								return;
							}
							
							//입력된 상세주소를 주소구분에 따라 값 세팅(레이어 화면에 선언된 함수)
							elandmall.ordDlvpLayer.fnSetDtlAddr( $div );
							
							var seq = $('#formObjLayer [name=ord_dlvp_seq]').val();
							$('input[id=ship_recvr_nm'+seq+']').val($('#formObjLayer [name=recvr_nm]').val());
							$("#view_ship_recvr_nm"+seq).text($('#formObjLayer [name=recvr_nm]').val());
							$('#view_ship_recvr_tel'+seq).text("전화번호 : " + $('#formObjLayer [name=recvr_tel1]').val() + "-"
									+ $('#formObjLayer [name=recvr_tel2]').val() + "-" + $('#formObjLayer [name=recvr_tel3]').val()
									+" / 휴대폰 번호 : " + $('#formObjLayer [name=recvr_cell_no1]').val() + "-" + $('#formObjLayer [name=recvr_cell_no2]').val()
									+ "-" + $('#formObjLayer [name=recvr_cell_no3]').val());
							$('input[id=ship_recvr_tel1'+seq+']').val($('#formObjLayer [name=recvr_tel1]').val());
							$('input[id=ship_recvr_tel2'+seq+']').val($('#formObjLayer [name=recvr_tel2]').val());
							$('input[id=ship_recvr_tel3'+seq+']').val($('#formObjLayer [name=recvr_tel3]').val());
							$('input[id=ship_recvr_cell_no1'+seq+']').val($('#formObjLayer [name=recvr_cell_no1]').val());
							$('input[id=ship_recvr_cell_no2'+seq+']').val($('#formObjLayer [name=recvr_cell_no2]').val());
							$('input[id=ship_recvr_cell_no3'+seq+']').val($('#formObjLayer [name=recvr_cell_no3]').val());
							$('#view_ship_dlvp_addr'+seq).html("[" + $('#formObjLayer [name=recvr_road_post_no]').val() + "] "
									+ $('#formObjLayer [name=recvr_road_base_addr]').val() + ", " + $('#formObjLayer [name=recvr_road_dtl_addr]').val()
									+ "<br />(" + $('#formObjLayer [name=recvr_base_addr]').val() + " " + $('#formObjLayer [name=recvr_dtl_addr]').val() + ")");
							$('input[id=ship_recvr_post_no'+seq+']').val($('#formObjLayer [name=recvr_post_no]').val());
							$('input[id=ship_recvr_base_addr'+seq+']').val($('#formObjLayer [name=recvr_base_addr]').val());
							$('input[id=ship_recvr_dtl_addr'+seq+']').val($('#formObjLayer [name=recvr_dtl_addr]').val());
							$('input[id=ship_recvr_road_post_no'+seq+']').val($('#formObjLayer [name=recvr_road_post_no]').val());
							$('input[id=ship_recvr_road_base_addr'+seq+']').val($('#formObjLayer [name=recvr_road_base_addr]').val());
							$('input[id=ship_#recvr_road_dtl_addr'+seq+']').val($('#formObjLayer [name=recvr_road_dtl_addr]').val());
							$('input[id=ship_addr_divi_cd'+seq+']').val($('#formObjLayer [name=addr_divi_cd]').val());
							$('input[id=ord_memo_cont'+seq+']').val($('#formObjLayer [name=ord_memo_cont]').val());
							$('#view_ord_memo_cont'+seq).text($('#formObjLayer [name=ord_memo_cont]').val());
							$('input[id=base_yn'+seq+']').val($('#formObjLayer [name=view_base_yn]').is(":checked") ? 'Y' : 'N');
							
							layer.close();
						});
					});
				}
			});
		},*/
		
	}
	
	/**
	 * 사용방법
	 * elandmall.goodDetailQuestLayer( p, callbackfunction);
	 * 
	 */
	elandmall.goodDetailQuestLayer = function(p, _callback) {
		elandmall.layer.createLayer({
			class_name:"layer_pop type02 d_layer_pop on",
			title: "상품문의",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/goods/initGoodsQuestLayer.action", p,  function() {
					div.on("click", "[name=clssNo_ra]", function(){
						$("#counsel_clss_no", div).val($(this).val());
					});
					
					div.on("change", "#goods_sel", function(){
						var selectedOpt = $("#goods_sel option:selected", div);
						$("#goods_no", div).val(selectedOpt.data("goods_no"));
						$("#vir_vend_no", div).val(selectedOpt.data("vir_vend_no"));
					});
					
					//등록
					div.on("click", "#quest_bnt", function(){
						$("#counsel_clss_no", div).val($("[name=clssNo_ra]:checked").val());
						
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
				    			iframe: true,   //true일 경우 target 무시되고 페이지내에 iframe 생성후 해당 iframe으로 form submit
				    			success: function(pin) {  //iframe이 true 일 경우 submit후 호출됨
				    				
				    				// tab 출력용 전체 갯수 처리 
				    				if ( gb == "I"){
				    					var qtotCnt = $('#quest_cnt_all').val();
										$('#quest_cnt_all').val(Number(qtotCnt)+1);
						    		}
				    				
				    				if ( $.type(_callback)== "function"){
				    					_callback();
				    				}else{
				    					p.goods_no = $("#goods_no", div).val();
				    					elandmall.goodsDetailTab.fnQuest.fnSearchQuest(p);
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
					
					// 글자수 체크
					div.on("keyup", "#quest_title, #quest_cont", function(){
						var $obj = $(this);
						var len = $obj.val().length;
						var maxlength = $(this).attr("maxlength");
						if ( len >= maxlength ){
							$obj.val( $obj.val().substr(0, maxlength));
							return false;
						}
					});
					
					//취소
					div.on("click", "#layer_close", function(){
						layer.close();
					});
					
					// 초기값 선택
					$("[name=clssNo_ra]", div).each(function(){
						if ( $(this).is("checked") ){
							$(this).click();
						}
					});
					$("#goods_sel", div).change();
					layer.show();
				});
			}   
		});
	}
	
	fnLayerClose = function(arg){
		$("#lyr_notice_"+arg).hide();
	}

	fnBtnCookie = function(type, no, dtime){
		var date = new Date();
		date.setHours(0);	
		date.setMinutes(0);
		date.setSeconds(0);
		
		if(type == '<%=Const.COOKIE_DISP__DIVI_CD_NEVER%>'){
			date = new Date(dtime.toGMTString);
			document.cookie = 
			    no + "=" + escape (false) + 		
			    ("; domain=" + elandmall.global.cookie_domain) +
				("; expires=" + date.toGMTString()) + 
				("; path=" + "/");	
		
		}else{
			if(type == '<%=Const.COOKIE_DISP__DIVI_CD_WEEK%>'){
				date.setDate(date.getDate()+7);
			}else{
				date.setDate(date.getDate()+1);
			}	
			document.cookie = 
				    no + "=" + escape (false) + 
				    ("; domain=" + elandmall.global.cookie_domain) +
					("; expires=" + date.toGMTString()) + 
					("; path=" + "/");	
		}
		$("#lyr_notice_"+no).hide();
	}
	

	/**
	 * 사용방법
	 * 재입고 알림 신청 레이어 팝업
	 * elandmall.stockNotiMbrLayer({
	 * 			goods_no: (상품번호),
	 *          item_no: (단품번호)
	 * });
	 */
	elandmall.stockNotiMbrLayer = function(p) {
		p = $.extend({ goods_no: "", item_no: "", vir_vend_no: "",item_nm: "" }, p || {});
		var fn = function(){
			elandmall.layer.createLayer({
				layer_id:"reware_layer",
				dimm_use: $('#temp_dimm').length > 0 ? true:false,
				class_name:"layer_pop lay_temp02 reware on",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/goods/initStockNotiMbrLayer.action", p,  function() {
						var first_param = {
								goods_no:p.goods_no,
								item_no:p.item_no,
								low_vend_type_cd:$("#option_low_vend_type_cd").val(),
								vir_vend_no:p.vir_vend_no
						}
						elandmall.optLayerEvt.ajaxItemList({
							param:first_param,
							success:function(data){
								var opt = div.find("#item_opt_nm1");
								opt.append($("<option>옵션을 선택해 주세요.</option>").attr({ value: "" }));
								$.each(data, function() {
									var item_no = this.ITEM_NO;
									var opt_val_nm1 = this.OPT_VAL_NM1;
									var sale_poss_qty = this.SALE_POSS_QTY;
									var cancle_poss_yn = this.CANCLE_POSS_YN;	//예약취소가능 여부
									var item_nm_add_info = this.ITEM_NM_ADD_INFO;
									var vir_vend_no = this.VIR_VEND_NO;
									if(typeof(item_nm_add_info) == "undefined"){
										item_nm_add_info = "";
									}
									
									var optionObj = null;

									if(sale_poss_qty > 0){
										if($("#opt_box").data("opt_val_nm1") == opt_val_nm1){
											optionObj =	$("<option>" + opt_val_nm1 + item_nm_add_info + "</option>").attr({ value: item_no });
											optionObj.attr("data-vir_vend_no", p.vir_vend_no);
											optionObj.attr("data-item_show_nm",opt_val_nm1);
											opt.append(optionObj);
										}
									}else{
										optionObj =	$("<option >" + opt_val_nm1 + item_nm_add_info + "</option>").attr({ value: item_no });
										optionObj.attr("data-vir_vend_no", p.vir_vend_no);
										optionObj.attr("data-item_show_nm",opt_val_nm1);
										opt.append(optionObj);
									}
									
								});

								//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
								div.find("[id^=item_opt_nm]").change(function(){
									var item_no= $(this).val();
									if($(this).val() !=""){
										elandmall.optLayerEvt.changeStockNotiItem({
											param:{ goods_no: p.goods_no, item_no: item_no, low_vend_type_cd:$("#low_vend_type_cd").val(), vir_vend_no: p.vir_vend_no},
											div:div,
											chgObj:$(this),
											callback_ajax:function(result){
												var next_slt = div.find("#item_opt_nm"+result.next_idx);
												if($("#opt_box").data("init_yn") != "Y"){	//,
													var pre_item_val = "";
													$.each($(next_slt).children(), function(idx, optval){
														if($("#opt_box").data("opt_val_nm"+result.next_idx) == $(this).text()){
															pre_item_val = $(this).val();
														}
													});
													next_slt.attr("disabled",false);
													next_slt.val(pre_item_val);
													next_slt.change();
													if($(next_slt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
														$("#opt_box").data("init_yn","Y");
													}
												}
											}
										});
										
									}else{
										var low_div = div.find("[id^=item_opt_nm]");
										var first_idx = $(this).attr("data-index");
										$.each(low_div, function(idx, lDiv) {
											if($(lDiv).data("index") > first_idx){
												$(lDiv).attr("disabled",true);
												$(lDiv).children().remove();
												$(lDiv).append($("<option>상위옵션을 선택해 주세요.</option>").attr({ value: "" }));
											};
										});
									}
									
								});
								//[END] item select change event 

								if($("#opt_box").data("init_yn") != "Y"){	//첫번째 옵션값 
										var pre_item_val = "";
										$.each($(opt).children(), function(idx, optval){
											if($("#opt_box").data("opt_val_nm1") == $(this).text()){
												pre_item_val = $(this).val(); 
											}
										});
										if(pre_item_val !=""){
											opt.attr("disabled",false);
											opt.val(pre_item_val);
											opt.change();
										}else{
											var low_div = div.find("[id^=item_opt_nm]");
											var first_idx = 1;
											$.each(low_div, function(idx, lDiv) {
												if($(lDiv).data("index") != first_idx){
													$(lDiv).attr("disabled",true);
													$(lDiv).children().remove();
													$(lDiv).append($("<option>상위옵션을 선택해 주세요.</option>").attr({ value: "" }));
												};
											});
										}
								}
							}
						});

						//신청 버튼 처리
						div.on("click", "#reg_btn", function(){
							var OptRow = div.find("[id^=item_opt_nm]");
							var emptyCnt = 0;
							var sel_item_no =p.item_no;
							$.each(OptRow, function(idx, lDiv) {
								if($(lDiv).attr("data-last")=="Y"){
									sel_item_no= $(lDiv).val();
								}
								if($(lDiv).val() == ""){
									emptyCnt++;
								}
							});
							if(emptyCnt ==0){
								if ( confirm("재입고 알림을 신청하시겠습니까?" )){
									$.ajax({
										url: "/goods/registStockNotiMbr.action",
										data: {goods_no : p.goods_no, item_no: sel_item_no, disp_mall_no : elandmall.global.disp_mall_no},
										type: "post",
										dataType: "text",
										success: function(data) {
											if(data == 'S'){
												alert("신청되었습니다.");
												layer.close();
											}else if(data == 'DUP'){
												alert("이미 신청한 내역이 존재합니다.");
												layer.close();
											}else if(data == 'MAX'){
												alert("재입고 알림은 5개까지만 신청하실 수 있습니다.");
												layer.close();
												commonUI.view.dimmOff();
											}else{
												alert("신청중 오류가 발생하였습니다.");
											}
										}, error : function( e ){
											if ( e.error_message !=null && e.error_message != ""){
												alert(e.error_message);
											}else{
												alert("신청중 오류가 발생하였습니다.");
											}
										}
									});	
								}
							}else{
								alert("옵션을 모두 입력해주세요.");
								return;
							}
						});

						//최대 신청 여부 확인&레이어 노출 처리
						if ( $("#stock_noti_mbr_max_yn", div).val() == 'Y' ){
							alert("재입고 알림은 5개까지만 신청하실 수 있습니다.");
							div.remove();
							commonUI.view.dimmOff();
						}else{
							layer.show();
						}
					});
				}   
			});
			
		}

		if ( !elandmall.loginCheck() ){
			if ( !confirm("로그인 하신 고객만 신청 가능 합니다. \n로그인 하시겠습니까?") ){
				return false;
			}
		}
		elandmall.isLogin({login:fn});
	}

})(jQuery);