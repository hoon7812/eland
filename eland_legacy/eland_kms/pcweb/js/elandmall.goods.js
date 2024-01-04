(function ($) {
	
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};	
	};
	//아이템 클릭옵션 분리시 필요 파라미터
	var set_goods_no="";
	var set_vir_vend_no="";
	var set_low_vend_type_cd="";
	var	set_deli_goods_divi_cd ="";
	var set_quickview_yn="";
	var set_reserv_yn="";
	
	var set_styleCode="";
	var set_brandCode="";
	var set_field_recev_poss_yn="";
	var set_present_yn="";
	var set_carve_yn="";

	var calenderDataList = new Array();
	var calenderStr = "날짜캘린더";
	
	var running_chk = false;

	//[ECJW-9] 옵션 불러오기 I/F
	var jwFlag = false; 
	var jwNormalFlag = false; 
	var opt_select_info = new Array();
	var opt_select_info_json = "";
	
	//[START]elandmall.goodsDetail
	elandmall.goodsDetail = {
			//[START]단품정보 초기화
			initOpt : function(p){
								
				//[ECJW-9] 옵션 불러오기 I/F
				p = $.extend({ event_layer_yn: "N",goods_no: "", item_no: "", vir_vend_no: "",low_vend_type_cd:"", deli_goods_divi_cd:"", quickview_yn:"N", jwFlag : "",jwNormalFlag : "" }, p || {});
				
				//옵션 셀렉트 박스 클릭 이벤트 활성
				if($.type(p.event_layer_yn) != "undefined" && p.event_layer_yn == "Y") {
					commonUI.view.lyrSlt.prototype.initSel();
				}
				
				var event_layer_yn = p.event_layer_yn;
				var quickview_yn = p.quickview_yn;
				var div = null;
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
				}
				
				var color_chip_val = +$("#color_mapp_option").val();
				var size_chip_val = +$("#size_mapp_option").val();
				
				if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){	// 예약일 때, 커밍 순일때 
					p["reserv_yn"] = "Y";
				}else{
					p["reserv_yn"] = "N";
				}
				
				//[ECJW-9] 옵션 불러오기 I/F
				if(p.jwFlag == "Y"){  // 주얼리 분기 처리  (주얼리 주문제작일때)
					jwFlag = true;
				}else{
					jwFlag = false;
				}
				//[NGCPO-5374] 쥬얼리 일반상품 현장수령처리하도록 분기
				if(p.jwNormalFlag =="Y"){
					jwNormalFlag =true;
				}else{
					jwNormalFlag =false;
				}
				
				//[ECJW-9] 옵션 불러오기 I/F
				if(jwFlag){
					color_chip_val = 0; 
					var opt = div.find("[id^=options_nm1]");
					var juOptCd = opt.parents(".lyr_select").find(".sel_txt").data("opt_cd");
					p["styleCode"] = p.styleCode;
					p["optionCode"] = juOptCd;
				}else{
					p["optionCode"] = "";
				}
				
				var first_param = p;
				if(color_chip_val == 1){
					first_param["color_yn"] = "Y";
				}
				
				//아이템 클릭옵션 분리시 필요 파라미터
				set_goods_no=p.goods_no;
				set_vir_vend_no=p.vir_vend_no;
				set_low_vend_type_cd=p.low_vend_type_cd;
				set_quickview_yn=p.quickview_yn;
				set_reserv_yn=p.reserv_yn;
				//[ECJW-9] 옵션 불러오기 I/F
				set_styleCode = p.styleCode;
				set_brandCode = p.brandCode;
				set_field_recev_poss_yn = p.field_recev_poss_yn; //현장수령여부
				set_present_yn	=	p.present_yn; // 선물하기 여부 
				set_deli_goods_divi_cd=p.deli_goods_divi_cd;
				set_carve_yn = p.carve_yn;
				
				
				var calendar_opt = div.find("[id^=options_nm1]").attr('data-opt_nm'); 
				if(calendar_opt == calenderStr){
					first_param["calendar_yn"] = "Y";
				}
				
				elandmall.optLayerEvt.ajaxItemList({
					param:first_param,    //{ goods_no: p.goods_no, vir_vend_no: p.vir_vend_no},
					success:function(data){
						var opt = div.find("[id^=options_nm1]");
						$selBtn =opt.parents('.lyr_select').children('.sel_btn');
						var calendarMinMonthChk = false;
						
						if(opt.attr("data-opt_cd") == "SI"){
							opt.parents('.lyr_select').addClass('hasDefault ');
						}
						
						$.each(data, function(idx) {
							
							var item_no = this.ITEM_NO;
							var opt_val_nm1 = this.OPT_VAL_NM1;

							//[ECJW-9] 옵션 불러오기 I/F
							var opt_val_cd1 = "";
							if(jwFlag){
								opt_val_cd1 = this.OPT_VAL_CD1;
							}
							
							var sale_poss_qty = this.SALE_POSS_QTY;
							var vir_vend_no = this.VIR_VEND_NO;
							
							var goods_nm = this.GOODS_NM;
							var optionObj = null;
							var str_ga_tag = "";
							var cancle_poss_yn = this.CANCLE_POSS_YN;
							var item_nm_add_info = this.ITEM_NM_ADD_INFO;
							var item_sale_price = this.ITEM_SALE_PRICE;
							var goods_sale_price = this.GOODS_SALE_PRICE;
							var min_sale_price   = this.MIN_SALE_PRICE;
							var low_price_cnt    = Number(this.CNT);
							var price_str		 = "";
							var sap_item_cd 	 = this.SAP_ITEM_CD;
							if(typeof(item_nm_add_info) == "undefined"){
								item_nm_add_info = "";
							}
							
							str_ga_tag = "PC_상품상세||";
							if(first_param.set_goods_yn == "Y"){
								
							}else{
								str_ga_tag +="상세일반_"+opt.data("opt_nm")+"선택||";
							}
							
							
							/* 20170207 false처리*/
							if (  item_sale_price > -1 && $("#option_low_vend_type_cd").val() != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
								if ( item_sale_price == 0 ){
									item_sale_price = elandmall.util.toCurrency(goods_sale_price);	
								}else{
									item_sale_price = elandmall.util.toCurrency(item_sale_price);
								}
							}else{
								item_sale_price = elandmall.util.toCurrency(goods_sale_price);	
							}
							if(item_sale_price !="" && item_sale_price !="0"){
								item_sale_price = item_sale_price+"원";
							}
							
							//옵션명이 날짜캘린더 일 때
							if(opt.data("opt_nm") == calenderStr){
								
								if(!calendarMinMonthChk){
									opt.parents('.lyr_select').attr('yyyymm', new Date(opt_val_nm1).format("yyyyMM"));
									calendarMinMonthChk = true;
								}
								
								if(low_price_cnt > 0){
									item_sale_price = elandmall.util.toCurrency(min_sale_price);
									price_str = "원~";
								}else{
									item_sale_price = elandmall.util.toCurrency(item_sale_price);
									price_str = "원";
								}
								
								if(typeof(cancle_poss_yn) != "undefined" && cancle_poss_yn != ""){
									
									var obj = {
											item_no 				: item_no
											, data_ga_tag 			: str_ga_tag + goods_nm+"_"+opt_val_nm1
											, data_vir_vend_no		: vir_vend_no
											, data_item_show_nm 	: opt_val_nm1
											, data_cancle_poss_yn 	: cancle_poss_yn
											, opt_val_nm			: opt_val_nm1
											, sale_poss_qty			: sale_poss_qty
											, item_sale_price		: item_sale_price
											, price_str				: price_str
										};
								}else{
								
									var obj = {
											item_no 				: item_no
											, data_ga_tag 			: str_ga_tag + goods_nm+"_"+opt_val_nm1
											, data_vir_vend_no		: vir_vend_no
											, data_item_show_nm 	: opt_val_nm1
											, data_cancle_poss_yn 	: ""
											, opt_val_nm			: opt_val_nm1
											, sale_poss_qty			: sale_poss_qty
											, item_sale_price		: item_sale_price
											, price_str				: price_str
										};
								}
								
								calenderDataList.push(obj);
								
							}else{
								
								//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
								if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
									item_sale_price="";
								}
								
								//[ECJW-9] 옵션 불러오기 I/F
								if(jwFlag){ //[START]주얼리 주문제작 
									if(opt.attr("data-opt_cd") == "SI" && idx == (Math.floor(data.length/2))-1 ){
										optionObj = $("<li><span class='ancor dVal'><span class='opt_name'>"+opt_val_nm1+"</span></li>").attr({ "data-code": opt_val_cd1 });
									}else{
										optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span></li>").attr({ "data-code": opt_val_cd1 });	
									}
									
								}else{
									
									if(sale_poss_qty > 0){
										optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
												"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
										).attr({ "data-value": item_no, "data-sap_item_cd" : sap_item_cd });
									}else{
										if($("#reserv_limit_divi_cd").val() == "10" || event_layer_yn =="Y" || $("#reserv_limit_divi_cd").val() == "20"){	// 예약일 때, 커밍순 일때, 프리오더 일때,
											optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
													"</span></li>"
											).attr({ "data-value": "soldout" });
										}else{
											optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
													"<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+p.goods_no+"',vir_vend_no:'"+p.vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+opt_val_nm1+"'});\">입고알림신청</a></span></li>"
											).attr({ "data-value": "soldout" });
										}
									}
									
								}//[END]주얼리 주문제작 
								
								
								optionObj.attr("data-ga-tag", str_ga_tag + goods_nm+"_"+opt_val_nm1);
								optionObj.attr("data-vir_vend_no",vir_vend_no);
								optionObj.attr("data-item_show_nm",opt_val_nm1);
								//[NGCPO-6256] 장바구니 수량체크
								optionObj.attr("data-sale_poss_qty", sale_poss_qty);
								
								if(typeof(cancle_poss_yn) != "undefined" && cancle_poss_yn != ""){
									optionObj.attr("data-cancle_poss_yn",cancle_poss_yn);
								}
								
								opt.append(
										optionObj
								)
								
							}
							
							
						});
						
						
						div.find('button[name = "sel_btn"]').click(function(e){ // 상품 옵션 선택 시 작동
							
							
							
							var optNm = $(e.target).data("opt_nm");
							
							
							
							//플로팅 레이어 선택시  데이터 변경 
							if ( typeof(optNm) == "undefined" ||  optNm == "" ){
								optNm = $(e.target).children().data("opt_nm");
							}
							
							
							
							if(optNm == calenderStr){
								
								
									var hope_date = $(this).parent();
									var yyyymm = hope_date.attr("yyyymm");
									var calendar = hope_date.parent().find("div.lyr_calendar");
									calendar.removeClass("off").addClass("on");
									
									var closeCalendar = function() {
										calendar.removeClass("on").addClass("off");
										calendar.empty();
										$('.lyr_select').removeClass('on');
									};
									
									var load = function(p) {
										
										p = $.extend({yyyymm: yyyymm, calenderDataList : JSON.stringify(calenderDataList)}, p);
										calendar.load(elandmall.util.newHttps("/goods/initDetailCalendar.action"), p, function(responseText, textStatus, jqXHR) {
											var days = calendar.find("a[name='day']");
											if (textStatus == "error") {
												return false;
											};
											calendar.find("a.btn_prev_month, a.btn_next_month").click(function() {
												var yyyymm = $(this).attr("yyyymm");
												p["yyyymm"] = yyyymm; 
												load($.extend({},p));
												return false;
											});
											days.click(function() {
												
												var a = $(this);
												var $selBtn = a.parents('.lyr_select').children('.sel_btn');
												var currObj = $(this);
												var opt_idx = $selBtn.find('.options').data('index');
												$selBtn.find('.sel_txt').parent().parent().find('.lyr_calendar').attr('data-item_show_nm', '');
												$selBtn.find('.sel_txt').text(a.attr('text'));
												$selBtn.find('.sel_txt').attr('data-sel-msg', a.attr('text'));
												$selBtn.find('.sel_txt').attr('data-value' , a.attr('data-value'));
												$('.lyr_select').removeClass('on');
												showText($selBtn);
												elandmall.optLayerEvt.changeItem({
													param:{ goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no, low_vend_type_cd: p.low_vend_type_cd, reserv_yn:p.reserv_yn},
													color_chip_val: color_chip_val,
													color_chip_yn:"Y",
													div:div,
													chgObj:$(this),
													callback_ajax:function(result){
														if(color_chip_val == result.next_idx){
															elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
														}
													},	
													callback:function(result){
													
														var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
														var currVal = currObj.attr("data-value");
														var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
														param["curr_idx"] = opt_idx;
														if(last_yn == "Y" && currVal != ""){
														//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
														if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
															param["vir_vend_no"] = currObj.data('vir_vend_no');
														}
														param["item_no"] = currVal;
														
														//사은품이 있다면
														if($("#giftInfo", div).length > 0 ){
															if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																//마지막 옵션 선택 후, 사은품의 disabled 해제
																$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
																$("#gift_slt", div).data("itemInfo", param);
															}else{	//사은품이 1개일 때,
																param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
																param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
																param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).val();
																elandmall.optLayerEvt.getItemPrice({
																	param:param,
																	success:function(data){
																		elandmall.goodsDetail.drawAddGoods({
																			data:data,
																			quickview_yn:quickview_yn,
																			gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm"),
																			gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", div))).val(),
																			gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty")
																		});
																	}
																});
															}
														}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
															elandmall.optLayerEvt.getItemPrice({
																param:param,
																success:function(data){
																	elandmall.goodsDetail.drawAddGoods({
																		data:data,
																		quickview_yn:quickview_yn
																	});
																}
															});
														}//[END]사은품이 없을 때 항목을 바로 추가 한다.
													}else{
														if(last_yn == "Y" && currObj.val() == ""){
															$("#gift_slt", div).attr("value","");
															$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
															$("[id^=gift_slt]", div).parent().removeClass("selected");
															$("#gift_slt", div).attr("data-itemInfo","");
														}else if(last_yn !="Y"){
															$("#gift_slt", div).attr("value","");
															$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
															$("[id^=gift_slt]", div).parent().removeClass("selected");
															
														}
													}
														
													}
													
												});
												
												closeCalendar();
												
												//[END] item select change event 
												function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
													if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
														$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
													}
													else{
														$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
													}
												}
												
												return false;
											});
											
										});
									};
									
									if (hope_date.hasClass("on")) {
										load(p);
									} else {
										closeCalendar();
									};
									
								}
								
							});
						
						if(color_chip_val == 1){
							elandmall.goodsDetail.drawColorChipHtml({data:data, curr_opt_idx:1, quickview_yn:quickview_yn, pkgGoods:"N"});
						}
						if(size_chip_val == 2){
							elandmall.goodsDetail.drawSizeChipHtmlInit({data:data, curr_opt_idx:1, quickview_yn:quickview_yn, pkgGoods:"N"});
						}

						//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
						div.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
							var quickview_yn = p.quickview_yn;
							var div = null;
							if(quickview_yn == "Y"){
								div = $("#quick_view_layer");
								
							}else{
								div = $(".goods_wrap");
							}
							
							var currObj = $(this);
							var opt_idx = $(this).parents('.options').data('index');
							var layer_yn = $(this).parents('.options').attr('data-layer_yn');
							var $li = $(this).parent();
							var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
							if(!$li.hasClass('sld_out')){
								$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
								$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());

								//[ECJW-9] 옵션 불러오기 I/F
								$selBtn.find('.sel_txt').attr('data-sel-cd', $(this).parent().data('code'));
								$selBtn.find('.sel_txt').attr("data-sap_item_cd",$li.attr('data-sap_item_cd'));
								
								$selBtn.find('.sel_txt').attr("data-value",$li.attr('data-value'));
								$('.lyr_select').removeClass('on');
								$li.addClass('selected').siblings('li').removeClass('selected');
								showText($selBtn);
								
								var calendar_opt = div.find("[id^=item_opt_nm"+(opt_idx+1)+"]").attr('data-opt_nm');  
								if(calendar_opt == calenderStr){
									p["calendar_yn"] = "Y";
								}
								
								elandmall.optLayerEvt.changeItem({
									//[ECJW-9] 옵션 불러오기 I/F
									param:{ goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no, low_vend_type_cd: p.low_vend_type_cd, deli_goods_divi_cd : p.deli_goods_divi_cd, reserv_yn:p.reserv_yn, styleCode: p.styleCode, carve_yn : set_carve_yn, jwFlag:jwFlag, quickview_yn:set_quickview_yn, calendar_yn:p.calendar_yn, jwNormalFlag:jwNormalFlag ,event_layer_yn : p.event_layer_yn},
									color_chip_val: color_chip_val,
									color_chip_yn:"Y",
									div:div,
									chgObj:$(this),
									callback_ajax:function(result){
										if(color_chip_val > result.curr_idx){
											$("#colorChipDiv").hide();
											$("#sizeChipInitDiv").hide();
											$("#sizeChipDiv").hide();
										}
										if(color_chip_val == result.next_idx){
											elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
										}
										if(size_chip_val == result.next_idx){
											elandmall.goodsDetail.drawSizeChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
										}else{
											$("#sizeChipDiv").hide();
										}
										
										if(result.calenderDataList.length > 0 ){
											calenderDataList = result.calenderDataList;
										}
									},
									callback:function(result){
										var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
										//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
										var currVal = currObj.parent().attr("data-value");
										$("#last_item_no").val(currVal);
										$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
										
										var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
										param["curr_idx"] = opt_idx;
										
										
										//[ECJW-9] 옵션 불러오기 I/F
										if(jwFlag){
											var opt = div.find("[id^=options_nm"+result.next_idx+"]");
											var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
											
											if(next_cd == "" || typeof(next_cd) == "undefined" && set_field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && set_present_yn == "Y"){
												$("#branchInfoBox").show();
												$("#branchInfoBoxL").show();
											}else{
												if(last_yn == "Y" && currVal != ""){
													//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
													if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
														param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
													}
													param["item_no"] = currVal;
													//사은품이 있다면
													if($("#giftInfo", div).length > 0 ){
														if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
															//마지막 옵션 선택 후, 사은품의 disabled 해제
															$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
															$("#gift_slt", div).data("itemInfo", param);
														}else{	//사은품이 1개일 때,
															param["layer_yn"] = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('layer_yn');
															param["goods_no"] = $("#goods_no").val();
															param["goods_nm"] = $("#goods_nm").val();
															elandmall.goodsDetail.jwGoodsAddParam({
																param:param,
															});
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														param["layer_yn"] = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('layer_yn');
														param["goods_no"] = $("#goods_no").val();
														param["goods_nm"] = $("#goods_nm").val();
														elandmall.goodsDetail.jwGoodsAddParam({
															param:param,
														});
														
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
												}else{
													if(last_yn == "Y" && currVal == ""){
														$("#gift_slt", div).attr("value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														$("#gift_slt", div).attr("data-itemInfo","");
													}else if(last_yn !="Y"){
														$("#gift_slt", div).attr("value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														
													}
												}
											}
											
										//쥬얼리 END 	
										}else{
											if(jwNormalFlag && (set_field_recev_poss_yn == "Y" || set_present_yn == "Y")){
												if(last_yn == "Y" && currVal != ""){
													//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
													if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
														param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
													}
													param["item_no"] = currVal;
													//사은품이 있다면
													if($("#giftInfo", div).length > 0 ){
														if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
															//마지막 옵션 선택 후, 사은품의 disabled 해제
															$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
															$("#gift_slt", div).data("itemInfo", param);
														}else{	//사은품이 1개일 때,
															param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
															param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
															param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).val();
															//fnItemChoice(param);
															//수령방법 오픈
															$("#branchInfoBox").show();
															$("#branchInfoBoxL").show();
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														//수령방법 오픈
														$("#branchInfoBox").show();
														$("#branchInfoBoxL").show();
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
												}else{
													if(last_yn == "Y" && currVal == ""){
														$("#gift_slt", div).attr("value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														$("#gift_slt", div).attr("data-itemInfo","");
													}else if(last_yn !="Y"){
														$("#gift_slt", div).attr("value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														
													}
												}
											}else{
												if(last_yn == "Y" && currVal != ""){
													//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
													if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
														param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
													}
													param["item_no"] = currVal;
													//사은품이 있다면
													if($("#giftInfo", div).length > 0 ){
														if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
															//마지막 옵션 선택 후, 사은품의 disabled 해제
															$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
															$("#gift_slt", div).data("itemInfo", param);
														}else{	//사은품이 1개일 때,
															param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
															param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
															param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).val();
															//fnItemChoice(param);
															elandmall.optLayerEvt.getItemPrice({
																param:param,
																success:function(data){
																	elandmall.goodsDetail.drawAddGoods({
																		data:data,
																		quickview_yn:quickview_yn,
																		layer_yn: layer_yn,
																		gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm"),
																		gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", div))).val(),
																		gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty")
																	});
																}
															});
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														elandmall.optLayerEvt.getItemPrice({
															param:param,
															success:function(data){
																elandmall.goodsDetail.drawAddGoods({
																	data:data,
																	quickview_yn:quickview_yn,
																	layer_yn: layer_yn
																});
															}
														});
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
												}else{
													if(last_yn == "Y" && currVal == ""){
														$("#gift_slt", div).attr("value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														$("#gift_slt", div).attr("data-itemInfo","");
													}else if(last_yn !="Y"){
														$("#gift_slt", div).attr("value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														
													}
												}
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
					}
				});

			}, //[END]단품정보 초기화
			
			
			
			
			drawColorChipHtml : function(p){
				var chipHtml = "";
				var curr_opt_idx = p.curr_opt_idx;
				var data = p.data;
				var div = null;
				var pkgGoods = p.pkgGoods;
				var chipShow = false;
				
				if(p.quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				chipHtml += "<div class=\"list_chip d_chip_over\">";
				chipHtml += "	<ul class=\"colorChipList\">";
				$.each(data, function(idx, info) {
					var item_no = info["ITEM_NO"];
					
					var opt_val_nm = info["OPT_VAL_NM"+curr_opt_idx];
					var img_path = info["IMG_PATH"];
					var img_seq = info["IMG_SEQ"];
					var sale_poss_qty = info["SALE_POSS_QTY"];
					var a_class_nm = "chip";
					
					if(sale_poss_qty == 0){
						a_class_nm += " disabled";
					}

					//이미지가 있을때만 출력.
					if(typeof(img_path) != "undefined" && img_path != "" ){
						chipHtml += "<li>";
						chipHtml += "	<a href=\"javascript:void(0);\" class=\""+a_class_nm+"\" data-ga-tag=\"PC_상품상세||상세일반_컬러박스선택||"+info["GOODS_NM"]+"_"+info["COLOR_NM"]+"\" data-item_no=\""+item_no+"\" data-img_seq=\""+img_seq+"\">";
						chipHtml += "		<span class=\"ir\">" + opt_val_nm + "</span>";
						chipHtml += " 		<img src=\""+elandmall.global.upload_image_path+img_path+"\"alt=\"" + opt_val_nm + "\" onerror=\"this.src='"+elandmall.global.image_path+"/images/pcweb/common/web_nocolorchip.gif'\" />";
						chipHtml += " 	</a>";
						chipHtml += "</li>";
						
						chipShow = true;
					}
				});
				chipHtml += "	</ul>";
				chipHtml += "</div>";
				
				if(chipShow) {
					if ( pkgGoods == "Y" ) { 
						$("#ul_pkgCmpsGoods").find("#colorChipDiv").html(chipHtml);
					} else {
						$("#colorChipDiv").html(chipHtml);
					}
					$("#colorChipDiv").show();
				}
				$(".colorChipList", div).find("a").click(function(){
					var changeItem_no = $(this).data("item_no");
					var mapping_img_seq = $(this).data("img_seq");
					var changeText = $(this).children('span').text();
					//옵션셀렉트박스 설정하고(해당 상품이 품절일 경우 작동X)
					if(!$(this).hasClass("disabled")){
						$("#item_opt_nm"+curr_opt_idx, div).attr('data-value',changeItem_no);
						$("#item_opt_nm"+curr_opt_idx, div).attr("data-sel-msg",changeText);
						$("#item_opt_nm"+curr_opt_idx, div).text(changeText);
						//텍스트 변경해주고 클릭이벤트 
						//$("#item_opt_nm"+curr_opt_idx, div).change();
						var options = $("#options_nm"+curr_opt_idx, div);
						$.each(options.children('li'), function(idx, opt){
							if($(opt).attr("data-value") == changeItem_no){
								$(opt).addClass("selected");
							}else{
								$(opt).removeClass("selected");
							};
						});
						options.children(".selected").children('span').click();
					}

					//상품 이미지도 change한다.
					$("ul:not(.swiper-slide-duplicate) > li > a.elevate-gallerys","#elevate_gallery").each(function(idx){
						if($(this).data("img_seq") == mapping_img_seq){
							var swpGrpIdx = $(this).parent().parent('ul').data("index");
							elandmall.goods.swiper.elevate_gallery.swipeTo(swpGrpIdx);
							$(this).click();
						}
						
					});
				});
				
			},
			
			drawSizeChipHtmlInit : function(p){
				var chipHtml = "";
				var curr_opt_idx = p.curr_opt_idx;
				var data = p.data;
				var div = null;
				var pkgGoods = p.pkgGoods;
				var chipShow = false;
				
				if(p.quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				chipHtml += "<div id=\"sizeChipInit\" class=\"size_chip unavail\">";
				chipHtml += "	<ul class=\"sizeChipListInit\">";
				$.each(data, function(idx, info) {
					var item_size_all = info["ITEM_SIZE_ALL"];
					if(idx == 0 && typeof(item_size_all) != "undefined"){
						var item_size = item_size_all.split(",");
						if(item_size != "" && item_size.length > 0){
							for(i=0;i<item_size.length;i++){
								chipHtml += "<li>";
								chipHtml += "	<span class=\"size chip\">" + item_size[i] + "</span>";
								chipHtml += "</li>";
							}
						}
						
						chipShow = true;
					}
				});
				chipHtml += "	</ul>";
				chipHtml += "</div>";

				if(chipShow) {
					if ( pkgGoods == "Y" ) { 
						$("#ul_pkgCmpsGoods").find("#sizeChipInitDiv").html(chipHtml);
					} else {
						$("#sizeChipInitDiv").html(chipHtml);
					}
					$("#sizeChipInitDiv").show();
				}
			},
			
			drawSizeChipHtml : function(p){
				var chipHtml = "";
				var curr_opt_idx = p.curr_opt_idx;
				var data = p.data;
				var div = null;
				var pkgGoods = p.pkgGoods;
				var chipShow = false;
				
				if(p.quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				chipHtml += "<div id=\"sizeChip\" class=\"size_chip\">";
				chipHtml += "	<ul class=\"sizeChipList\">";
				$.each(data, function(idx, info) {
					var goods_no = info["GOODS_NO"];
					var vir_vend_no = info["VIR_VEND_NO"];
					var item_no = info["ITEM_NO"];
					var item_nm = info["ITEM_NM"];
					var opt_val_nm = info["OPT_VAL_NM"+curr_opt_idx];
					var sale_poss_qty = info["SALE_POSS_QTY"];
					var a_class_nm = "chip";
					var size_chip_val = info["SIZE_CHIP_VAL"];
					
					var setItemNm="";
					var sel_txt;
					if($("div.goods_detail_txt").length>0){
						sel_txt = $(".goods_detail_txt").find(".sel_txt");
					}else{
						sel_txt = $(".g_opt").find(".sel_txt");
					}
					
					$.each(sel_txt, function(idx, lDiv) {
						var sel_msg = $(lDiv).attr("data-sel-msg");
						if( $(lDiv).attr('id').indexOf("item_opt_nm") !=-1 &&sel_msg !="" && sel_msg !=undefined){
							if(setItemNm ==""){
								setItemNm +=sel_msg;
							}else{
								setItemNm+="/"+sel_msg;
							}
						}
					});
					if(setItemNm==""){
						setItemNm+=opt_val_nm;
					}else{
						setItemNm+="/"+opt_val_nm;
					}
					
					//표준사이즈가 있을때만 출력.
					if(typeof(size_chip_val) != "undefined" && size_chip_val != "" ){
						if(sale_poss_qty == 0){
							a_class_nm += " disabled";
							chipHtml += "<li>";
							chipHtml += "	<a href=\"javascript:void(0);\" onClick=\"elandmall.stockNotiMbrLayerConfirm({goods_no:'"+goods_no+"',vir_vend_no:'"+vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+item_nm+"',item_nm:'"+setItemNm+"'});\" class=\""+a_class_nm+"\" data-ga-tag=\"PC_상품상세||상세일반_컬러박스선택||사이즈박스선택"+info["GOODS_NM"]+"_"+opt_val_nm+"\" data-item_no=\""+item_no+"\" data-item_nm=\""+setItemNm+"\">";
							chipHtml += "		<span class=\"size\">" + size_chip_val + "</span>";
							chipHtml += " 	</a>";
							chipHtml += "</li>";
						} else {
							chipHtml += "<li>";
							chipHtml += "	<a href=\"javascript:void(0);\" class=\""+a_class_nm+"\" data-ga-tag=\"PC_상품상세||상세일반_컬러박스선택||사이즈박스선택"+info["GOODS_NM"]+"_"+opt_val_nm+"\" data-item_no=\""+item_no+"\" data-item_nm=\""+item_nm+"\">";
							chipHtml += "		<span class=\"size\">" + size_chip_val + "</span>";
							chipHtml += " 	</a>";
							chipHtml += "</li>";
						}
						
						chipShow = true;
					}
				});
				chipHtml += "	</ul>";
				chipHtml += "</div>";
				
				$("#sizeChipInitDiv").hide();
				if(chipShow) {
					if ( pkgGoods == "Y" ) { 
						$("#ul_pkgCmpsGoods").find("#sizeChipDiv").html(chipHtml);
					} else {
						$("#sizeChipDiv").html(chipHtml);
					}
					$("#sizeChipDiv").show();
				}
				$(".sizeChipList", div).find("a").click(function(){
					var changeItem_no = $(this).data("item_no");
					var changeText = $(this).children('span').text();
					//옵션셀렉트박스 설정하고(해당 상품이 품절일 경우 작동X)
					if(!$(this).hasClass("disabled")){
						$("#item_opt_nm"+curr_opt_idx, div).attr('data-value',changeItem_no);
						$("#item_opt_nm"+curr_opt_idx, div).attr("data-sel-msg",changeText);
						$("#item_opt_nm"+curr_opt_idx, div).text(changeText);
						//텍스트 변경해주고 클릭이벤트 
						//$("#item_opt_nm"+curr_opt_idx, div).change();
						var options = $("#options_nm"+curr_opt_idx, div);
						$.each(options.children('li'), function(idx, opt){
							if($(opt).attr("data-value") == changeItem_no){
								$(opt).addClass("selected");
							}else{
								$(opt).removeClass("selected");
							};
						});
						options.children(".selected").children('span').click();
					}
				});
				
			},
			
			//[START]사은품 변경 이벤트
			changeGift : function(p){
				var obj = p.obj;
				var scope_div = null;
				var quickview_yn = (typeof(p.quickview_yn) != "undefiend")? p.quickview_yn : "N";
				if(p.quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					if($("#_optChoiceLayer").length>0){
						scope_div = $("#_optChoiceLayer");
					}else{
						scope_div = $(".goods_wrap");
					}
				}
				$('.lyr_select').removeClass('on');
				var layer_yn = $(obj).parents('.lyr_select').children().children('.sel_txt').data('layer_yn');
				var objVal = $(obj).attr("data-value");
				if(layer_yn == "Y" || $("#_optChoiceLayer").length>0){
					$("#gift_slt", scope_div).attr('data-value',objVal);
					$("#gift_slt", scope_div).attr('value',objVal);
					$("#gift_slt", scope_div).parent().addClass("selected");
					$("#gift_slt", scope_div).attr("data-sel-msg",$(obj).children('.opt_name').text());
					$("#gift_slt", scope_div).text($(obj).children('.opt_name').text());
				}else{
					$("#gift_slt_L", scope_div).attr('data-value',objVal);
					$("#gift_slt_L", scope_div).attr('value',objVal);
					$("#gift_slt_L", scope_div).parent().addClass("selected");
					$("#gift_slt_L", scope_div).attr("data-sel-msg",$(obj).children('.opt_name').text());
					$("#gift_slt_L", scope_div).text($(obj).data('opt_name'));
				}
				if(objVal != ""){
					if($("#multi_item_yn", scope_div).val() == "Y"){
						var param = $("#gift_slt", scope_div).data("itemInfo");
						param["gift_nm"] = $(obj).data('opt_name');
						param["gift_stock_qty"] = $(obj).data('stock_qty');
						param["gift_goods_dtl_no"] = objVal;
						elandmall.optLayerEvt.getItemPrice({
							param:param,
							success:function(data){
								elandmall.goodsDetail.drawAddGoods({
									data:data,
									quickview_yn:quickview_yn,
									gift_nm:$(obj).data('opt_name'),
									gift_goods_dtl_no:objVal,
									gift_stock_qty:$(obj).data('stock_qty')
								});
								elandmall.goodsDetail.sumMultiTotal(scope_div);
							}
						});
					}else{
						if($("#goods_cmps_divi_cd", scope_div).val() == "20"){		//세트상품일 때,
							var param = $("#gift_slt", scope_div).data("itemInfo");
							param["gift_nm"] = $(obj).data('opt_name');
							param["gift_stock_qty"] = $(obj).data('stock_qty');
							param["gift_goods_dtl_no"] = objVal;
							elandmall.optLayerEvt.getSetGoodsPrice({
								param:param,
								success:function(data){
									elandmall.goodsDetail.drawAddGoods({
										type:"SET",
										data:data,
										quickview_yn:quickview_yn,
										set_param:param,
										gift_nm: $(obj).data('opt_name'),
										gift_goods_dtl_no:objVal,
										gift_stock_qty:$(obj).data('stock_qty')
									});
									elandmall.goodsDetail.sumMultiTotal(scope_div);
									
								}
							});
						}else if($("#goods_type_cd", scope_div).val() == "80"){	//묶음상품일 때,
							$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
							var multi_item_yn = $("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn");
							var param = $("#gift_slt", scope_div).data("itemInfo");
							param["gift_nm"] = $(obj).data('opt_name');
							param["gift_stock_qty"] = $(obj).data('stock_qty');
							param["gift_goods_dtl_no"] = objVal;
							if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
								if(multi_item_yn == "Y"){ //구성품이 옵션상품일 때,
									elandmall.optLayerEvt.getItemPrice({
										param:param,
										success:function(data){
											elandmall.goodsDetail.drawAddGoods({
												type:"PKG",
												quickview_yn: quickview_yn,
												data:data,
												gift_nm:param["gift_nm"],
												gift_goods_dtl_no:param["gift_goods_dtl_no"],
												gift_stock_qty:param["gift_stock_qty"]
											});
										}
									});
									elandmall.goodsDetail.sumMultiTotal(scope_div);
								}else{
									elandmall.goodsDetail.drawAddGoods({
										type:"PKG",
										quickview_yn:quickview_yn,
										data:param,
										gift_nm:param["gift_nm"],
										gift_goods_dtl_no:param["gift_goods_dtl_no"],
										gift_stock_qty:param["gift_stock_qty"]
									});
									elandmall.goodsDetail.sumMultiTotal(scope_div);
								}

								
							}else{
								$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
							}
						}else{
							$("#gift_slt", scope_div).attr('data-value',objVal);
							$("#gift_slt", scope_div).attr('value',objVal);
							$("#gift_slt", scope_div).attr('data-stock_qty',$(obj).data('stock_qty'));
							
						}
						
					}
				}
			},//[END]사은품 변경 이벤트
			resetGift:function(scope_div){
				if($("#giftInfo",scope_div).length > 0 ) {
					$("#gift_slt",scope_div).attr("data-value","");
					$("[id^=gift_slt]",scope_div).parents(".lyr_select").addClass("disabled");
					$("#gift_slt",scope_div).parents("button.option.selected").removeClass("selected");
					$("#gift_slt",scope_div).attr("data-itemInfo","");
					$("#gift_slt",scope_div).attr("data-sel-msg",$("#gift_slt").attr("data-org-msg"));
					$("#gift_slt",scope_div).text($("#gift_slt").attr("data-org-msg"));
					$("#pkgCmpsGoods", scope_div).attr("data-choice_yn","");
				}
			},
			//[START] 추가된 옵션삭제
			removeItem : function(pin) {
				
				var lowVendTypeCd = $("#option_low_vend_type_cd").val();
				
				if(lowVendTypeCd == "50"){
					if($("input[name=field_rec]:checked").val() == "40"){
						alert("매장수령 선택 후 진행해 주세요.");
						return false;
					}
					
					for(var i=0; i<$(".layer_pop").length; i++){
						if(typeof($(".layer_pop").eq(i).find('#pickListForm').val()) != "undefined"){
							alert("매장수령 선택 후 진행해 주세요.");
							return false;
						}
					}
				}
				
				 //[ECJW-9] 옵션 불러오기 I/F 
		        if(jwFlag){
		        	
		        	//삭제처리
			        $(".L"+pin.classkey,".choiceGoods").remove();
			        elandmall.util.ga(pin.category, pin.action, pin.label);
			        elandmall.goodsDetail.visibleTotalAmt();
			        elandmall.goodsDetail.sumMultiTotalJw(pin);
			        
		        	var tmp_opt_select_info = new Array();
			        for(var i=0; i<opt_select_info.length; i++){
			        	var chk = false;
			        	var tmp_obj = opt_select_info[i];
			        	
			        	
			        	if(tmp_obj.classkey == pin.classkey ){
			        		delete opt_select_info[i];
			        		chk = true;
			        	}
			        	
			        	if(!chk){
			        		tmp_opt_select_info.push(tmp_obj);
			        	}
			        }
			        
			        opt_select_info = new Array(); // 초기화
			        opt_select_info = tmp_opt_select_info;
			        
			        
			        var present_chk = false;
					for(var i=0; i< $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
						var cart_grp_cd = $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#cartBtn").hide();
						$(".goods_set_btn", scope_div).addClass('type02');
					}else{
						$(".goods_set_btn", scope_div).removeClass('type02');
						$("#cartBtn").show();
					}
					
					//플로팅 옵션 설정
					var float_present_chk = false;
					for(var i=0; i< $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
						var cart_grp_cd = $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
						if(cart_grp_cd == "50"){
							float_present_chk = true;
						}
					}
					
					if(float_present_chk){
						$("#float_cartBtn").hide();
						$("#float_buyBtn").addClass('full');
					}else{
						$("#float_buyBtn").removeClass('full');
						$("#float_cartBtn").show();
					}
		        }else{
		        	
	        	 if($("#multi_item_yn", "#detailform").val() == "Y") {
					    
						$(":input[name=item_no]","#detailform").each(function(index,item){
							if($(this).val() == pin.item_no){
								//하나만 존재하는 경우는 삭제하지 않는다.
						        if($(":input[name=goods_no]","#detailform").length > 1) {
							        $(":input[name=goods_no]","#detailform").eq(index).remove();		   
							        $(":input[name=chk_yn]","#detailform").eq(index).remove(); 
							        $(":input[name=vir_vend_no]","#detailform").eq(index).remove();
						        }
								$(":input[name=item_no]","#detailform").eq(index).remove();
								$(":input[name=gift_good_dtl_no]","#detailform").eq(index).remove();
						    }
					    });
					} 
			        //삭제처리
			        $(".L"+pin.classkey,".choiceGoods").remove();
			        elandmall.util.ga(pin.category, pin.action, pin.label);
			        elandmall.goodsDetail.visibleTotalAmt();
			        elandmall.goodsDetail.sumMultiTotal();
		        }
		        			
			},//[END] 추가된 옵션삭제
			//[START]총 합계금액
			sumMultiTotal : function(scope_div){
				//가격 합
			   var totalAmt = 0;
			   $(":input[name=ord_qty]" , $("#detailform", scope_div) ).each(function(i,item){
				   totalAmt += +($(":input[name=sale_price]", $("#detailform", scope_div)).eq(i).val() ) * +($(item).val());						   
			   });
			   $(".totalAmt", scope_div).html(elandmall.util.toCurrency(totalAmt));
			   return totalAmt;
			},//[END]총 합계금액
			//[START]총 합계금액
			sumMultiTotalJw : function(p){
				var div = "";
				
				if(p.quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				//가격 합
				var totalAmt = 0;
				
				var event_layer_yn = div.find("input[name='event_layer_yn']").val();
				if(p.layer_yn == "Y" || event_layer_yn == "Y" ) {
					div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').each(function(i){
						var price   = $(this).find('input[name="sale_price"]').val();
						var ord_qty = $(this).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val();
						totalAmt += + price * ord_qty;
					});
				}else {
					div.find(".goods_detail_txt").find("#choiceItemBox").find('li').each(function(i){
						var price   = $(this).find('input[name="sale_price"]').val();
						var ord_qty =  $(this).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val();
						totalAmt += + price * ord_qty;
					});
				}
				
				
			   $(".totalAmt", scope_div).html(elandmall.util.toCurrency(totalAmt));
			   return totalAmt;
			},//[END]총 합계금액
			
			
			//[START] 총합계금액 숨김처리
			visibleTotalAmt: function(){
				if($("#choiceItemBox").children().length > 0){
					$("#totalAmtArea").show();
				}else{
					$("#totalAmtArea").hide();
				}
			},//[END] 총합계금액 숨김처리
			//[START] 키패드 수량입력 체크
			checkKeyPressQty :function(p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				var qty_objs = (typeof(p.classkey) != "undefined") ? $(":input[name='ord_qty']", $(".L"+p.classkey, scope_div)) : $(":input[name='ord_qty']", scope_div);
				var tmpOmsSaleQty = (typeof(p.classkey) != "undefined") ? $(":input[name='omsSaleQty']", $(".L"+p.classkey, scope_div)).val() : $(":input[name='omsSaleQty']", scope_div).val();
				var omsSaleQty = (typeof(tmpOmsSaleQty) != "undefined")? tmpOmsSaleQty : "";
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnClassKey = function(p){
					if(typeof(p.classkey) != "undefined"){
						var priceObj =$(":input[name='sale_price']", $(".L"+p.classkey, scope_div));
						$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qty_objs.eq(0).val())) );
					}
				}
				
				if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					//event.retunValue = false;
					var regexp = /[^0-9]/gi;
					var v = $(p.obj).val();
					if (regexp.test(v)) {
						$(qty_objs).val(v.replace(regexp, ''));
					}
					if(event.keyCode == 8){
						fnClassKey(p);
						elandmall.goodsDetail.sumMultiTotal(scope_div);
						return;
					}
				}
				
				//[START] n+1 체크 추가
				var nplusChkParam = $.extend({ord_qty:qty_objs.eq(0).val()},p);
				if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
					
					var maxnpluscnt = parseInt(p.sale_poss_qty/(p.nplus_base_cnt+p.nplus_cnt)); //n+1의 횟수
					var maxsalecnt = maxnpluscnt * p.nplus_base_cnt ; //n+1의 주문가능수량
					var remaincnt = p.sale_poss_qty - (maxnpluscnt* p.nplus_cnt) + maxsalecnt; //잔여수량
					var maxordcnt = 0
					var ord_qty = +p.ord_qty;
					
					if(remaincnt > 0 && remaincnt >= p.nplus_base_cnt){
						remaincnt = p.nplus_base_cnt -1;							
					}
					
					maxsalecnt = maxsalecnt + remaincnt;
					
					$(qty_objs).val(maxsalecnt);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					return;
				}
				
				//[END] n+1 체크 추가
				
				//[START] 최대주문 및 최대수량, 재고 체크
				var vMsg = "";
				var alert_qty = 0;
				var input_qty = +$(p.obj).val();
				var update_qty = +input_qty;
				if ($.isNumeric(update_qty) === true) {
					update_qty = +input_qty;
					if ( goods_type_cd != "50" && sale_unit_qty > 1 ){
						update_qty = parseInt(update_qty/sale_unit_qty)*sale_unit_qty;
					}
				}
				
				if(omsSaleQty == ""){
					if((+p.min_qty > 1 && update_qty < +p.min_qty) || update_qty == 0){
						alert_qty = p.min_qty;
						vMsg = "수량은 "+ alert_qty +"개 이상만 입력 가능 합니다.";
					}else if(p.sale_poss_qty < update_qty){
						alert_qty = p.sale_poss_qty;
						vMsg = "상품은 최대 "+alert_qty+"개까지 주문 가능합니다.";
					}else if(p.max_qty > 0 && (update_qty > +(p.max_qty) )) {
						alert_qty = p.max_qty;
						vMsg = "상품은 최대 "+alert_qty+"개까지 주문 가능합니다.";
					}
				}else{
					if((+p.min_qty > 1 && update_qty < +p.min_qty) || update_qty == 0){
						alert_qty = p.min_qty;
						vMsg = "수량은 "+ alert_qty +"개 이상만 입력 가능 합니다.";
					}else if(omsSaleQty < update_qty){
						alert_qty = omsSaleQty;
						vMsg = "상품은 최대 "+alert_qty+"개까지 주문 가능합니다.";
					}else if(p.max_qty > 0 && (update_qty > +(p.max_qty) )) {
						alert_qty = p.max_qty;
						vMsg = "상품은 최대 "+alert_qty+"개까지 주문 가능합니다.";
					}
				}
				
				if ( vMsg != "" ){
					alert(vMsg);
					if ( alert_qty%sale_unit_qty != 0 ){
						alert_qty = parseInt(alert_qty/sale_unit_qty)*sale_unit_qty;
					}
					$(qty_objs).val(alert_qty);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					return;
				}
				//[END] 최대주문 및 최대수량, 재고 체크
				
				var gift_stock_qty = +$("#gift_stock_qty", $(".L"+p.classkey, scope_div)).val();
				if(gift_stock_qty > 0 && gift_stock_qty < update_qty){
					alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
					$(qty_objs).val(gift_stock_qty);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					return;
				}
				
				qty_objs.val(update_qty);
				
				fnClassKey(p);
				elandmall.goodsDetail.sumMultiTotal(scope_div);
			},//[END] 키패드 수량입력 체크
			
			//[START] 쥬얼리 키패드 수량입력 체크
			checkKeyPressQtyJw :function(p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				var qty_objs = (typeof(p.classkey) != "undefined") ? $(":input[name='ord_qty']", $(".L"+p.classkey, scope_div)) : $(":input[name='ord_qty']", scope_div);
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnClassKey = function(p){
					if(typeof(p.classkey) != "undefined"){
						
						var priceNumber = 0;
						
						if(p.layer_yn == "Y"){
							for(var i=0; i<scope_div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').length; i++){
								if(scope_div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).attr('class') ==  "L"+p.classkey){
									var ord_qty = Number(scope_div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val());
									priceNumber = scope_div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('input[name="sale_price"]').val();
									ord_qty = (qty_objs.eq(0).val());
									scope_div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
									scope_div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
								}
								
							}
						}else{
							for(var i=0; i<scope_div.find(".goods_detail_txt").find("#choiceItemBox").find('li').length; i++){
								if(scope_div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).attr('class') ==  "L"+p.classkey){
									var ord_qty = Number(scope_div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val());
									priceNumber = scope_div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
									ord_qty = (qty_objs.eq(0).val());
									scope_div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
									scope_div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
								}
								
							}
						}
						
						$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(priceNumber) * +(qty_objs.eq(0).val())) );
						elandmall.goodsDetail.sumMultiTotalJw(p);
						
					}
				}
				
				if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					//event.retunValue = false;
					var regexp = /[^0-9]/gi;
					var v = $(p.obj).val();
					if (regexp.test(v)) {
						$(qty_objs).val(v.replace(regexp, ''));
					}
					if(event.keyCode == 8){
						fnClassKey(p);
						elandmall.goodsDetail.sumMultiTotalJw(scope_div);
						return;
					}
				}
				
				//[START] n+1 체크 추가
				var nplusChkParam = $.extend({ord_qty:qty_objs.eq(0).val()},p);
				if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
					
					var maxnpluscnt = parseInt(p.sale_poss_qty/(p.nplus_base_cnt+p.nplus_cnt)); //n+1의 횟수
					var maxsalecnt = maxnpluscnt * p.nplus_base_cnt ; //n+1의 주문가능수량
					var remaincnt = p.sale_poss_qty - (maxnpluscnt* p.nplus_cnt) + maxsalecnt; //잔여수량
					var maxordcnt = 0
					var ord_qty = +p.ord_qty;
					
					if(remaincnt > 0 && remaincnt >= p.nplus_base_cnt){
						remaincnt = p.nplus_base_cnt -1;							
					}
					
					maxsalecnt = maxsalecnt + remaincnt;
					
					$(qty_objs).val(maxsalecnt);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotalJw(scope_div);
					return;
				}
				
				//[END] n+1 체크 추가
				
				//[START] 최대주문 및 최대수량, 재고 체크
				var vMsg = "";
				var alert_qty = 0;
				var input_qty = +$(p.obj).val();
				var update_qty = +input_qty;
				if ($.isNumeric(update_qty) === true) {
					update_qty = +input_qty;
					if ( goods_type_cd != "50" && sale_unit_qty > 1 ){
						update_qty = parseInt(update_qty/sale_unit_qty)*sale_unit_qty;
					}
				}
				
				if((+p.min_qty > 1 && update_qty < +p.min_qty) || update_qty == 0){
					alert_qty = p.min_qty;
					vMsg = "수량은 "+ alert_qty +"개 이상만 입력 가능 합니다.";
				}else if(p.sale_poss_qty < update_qty){
					alert_qty = p.sale_poss_qty;
					vMsg = "상품은 최대 "+alert_qty+"개까지 주문 가능합니다.";
				}else if(p.max_qty > 0 && (update_qty > +(p.max_qty) )) {
					alert_qty = p.max_qty;
					vMsg = "상품은 최대 "+alert_qty+"개까지 주문 가능합니다.";
				}
				
				if ( vMsg != "" ){
					alert(vMsg);
					if ( alert_qty%sale_unit_qty != 0 ){
						alert_qty = parseInt(alert_qty/sale_unit_qty)*sale_unit_qty;
					}
					$(qty_objs).val(alert_qty);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotalJw(scope_div);
					return;
				}
				//[END] 최대주문 및 최대수량, 재고 체크
				
				var gift_stock_qty = +$("#gift_stock_qty", $(".L"+p.classkey, scope_div)).val();
				if(gift_stock_qty > 0 && gift_stock_qty < update_qty){
					alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
					$(qty_objs).val(gift_stock_qty);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotalJw(scope_div);
					return;
				}
				
				qty_objs.val(update_qty);
				
				fnClassKey(p);
				elandmall.goodsDetail.sumMultiTotalJw(scope_div);
			},//[END] 쥬얼리 키패드 수량입력 체크
			checkInitQty :function(p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				var qty_objs = (typeof(p.classkey) != "undefined") ? $(":input[name='ord_qty']", $(".L"+p.classkey, scope_div)) : $(":input[name='ord_qty']", scope_div);
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnClassKey = function(p){
					if(typeof(p.classkey) != "undefined"){
						var priceObj =$(":input[name='sale_price']", $(".L"+p.classkey, scope_div));
						$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qty_objs.eq(0).val())) );
					}
				}
				
				/*if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					//event.retunValue = false;
					var regexp = /[^0-9]/gi;
					var v = $('#ord_qty').val();
					if (regexp.test(v)) {
						$(qty_objs).val(v.replace(regexp, ''));
					}
					if(event.keyCode == 8){
						fnClassKey(p);
						elandmall.goodsDetail.sumMultiTotal(scope_div);
						return;
					}
				}*/
				
				//[START] n+1 체크 추가
				var nplusChkParam = $.extend({ord_qty:qty_objs.eq(0).val()},p);
				if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
					
					var maxnpluscnt = parseInt(p.sale_poss_qty/(p.nplus_base_cnt+p.nplus_cnt)); //n+1의 횟수
					var maxsalecnt = maxnpluscnt * p.nplus_base_cnt ; //n+1의 주문가능수량
					var remaincnt = p.sale_poss_qty - (maxnpluscnt* p.nplus_cnt) + maxsalecnt; //잔여수량
					var maxordcnt = 0
					var ord_qty = +p.ord_qty;
					
					if(remaincnt > 0 && remaincnt >= p.nplus_base_cnt){
						remaincnt = p.nplus_base_cnt -1;							
					}
					
					maxsalecnt = maxsalecnt + remaincnt;
					
					$(qty_objs).val(maxsalecnt);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					return;
				}
				
				//[END] n+1 체크 추가
				
				//[START] 최대주문 및 최대수량, 재고 체크
				var vMsg = "";
				var alert_qty = 0;
				var input_qty = +$('#ord_qty').val();
				var update_qty = +input_qty;
				if ($.isNumeric(update_qty) === true) {
					update_qty = +input_qty;
					if ( goods_type_cd != "50" && sale_unit_qty > 1 ){
						update_qty = parseInt(update_qty/sale_unit_qty)*sale_unit_qty;
					}
				}
				
				if((+p.min_qty > 1 && update_qty < +p.min_qty) || update_qty == 0){
					alert_qty = p.min_qty;
					vMsg = "수량은 "+ alert_qty +"개 이상만 입력 가능 합니다.";
				}else if(p.sale_poss_qty < update_qty){
					alert_qty = p.sale_poss_qty;
					vMsg = "상품은 최대 "+alert_qty+"개 입니다.";
				}else if(p.max_qty > 0 && (update_qty > +(p.max_qty) )) {
					alert_qty = p.max_qty;
					vMsg = "상품은 최대 "+alert_qty+"개 입니다.";
				}
				
				if ( vMsg != "" ){
					alert(vMsg);
					if ( alert_qty%sale_unit_qty != 0 ){
						alert_qty = parseInt(alert_qty/sale_unit_qty)*sale_unit_qty;
					}
					$(qty_objs).val(alert_qty);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					return;
				}
				//[END] 최대주문 및 최대수량, 재고 체크
				
				var gift_stock_qty = +$("#gift_stock_qty", $(".L"+p.classkey, scope_div)).val();
				if(gift_stock_qty > 0 && gift_stock_qty < update_qty){
					alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
					$(qty_objs).val(gift_stock_qty);
					
					fnClassKey(p);
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					return;
				}
				
				qty_objs.val(update_qty);
				
				fnClassKey(p);
				elandmall.goodsDetail.sumMultiTotal(scope_div);
			},
			//[START]수량증가
			setPlus : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var opt_set_pkg_yn = false;	//옵션, 묶음, 세트 상품일 때
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnStockChk = function(p, qty){
					if(p.sale_poss_qty < qty){
						alert("상품은 최대 "+p.sale_poss_qty+"개까지 주문 가능합니다.");
						return false;
					}else if(p.max_qty > 0 && (qty > +(p.max_qty) )) {
						alert("상품은 최대 "+p.max_qty+"개까지 주문 가능합니다.");
						return false;
					}
					
					// n+1 체크 추가
					var nplusChkParam = $.extend({ord_qty:qty},p);
					if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
						return false;
					}
					return true;
				}
				
				if ( $("#multi_item_yn", scope_div).val() == "Y" || $("#goods_cmps_divi_cd", scope_div).val() == "20" || goods_type_cd == "80" || jwFlag ){
					opt_set_pkg_yn = true;
				}
				
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyScopeDiv = opt_set_pkg_yn ? classkeyDiv : scope_div;
				var qtyObj = $(":input[name='ord_qty']", qtyScopeDiv);
				var addQty = +((goods_type_cd == "50") ? 1 : sale_unit_qty);
				var qty = +(qtyObj.eq(0).val()) + addQty;		// 현 개수+더하는 수량(판매수량 or 1개)
				var omsSaleQty = (typeof($(":input[name='omsSaleQty']", qtyScopeDiv).val()) != "undefined")? $(":input[name='omsSaleQty']", qtyScopeDiv).val() : ""; 
				
				//옵션, 묶음, 세트 상품일 때(아이템박스가 생기는 상품)
				if(opt_set_pkg_yn){
					if($("#goods_cmps_divi_cd", scope_div).val() == "20"){
						//구성품의 재고수량 체크
						if( !elandmall.goodsDetail.checkCmpsGoodsQty({classkey:p.classkey, qty:qty, scope_div:scope_div}) ){
							return;
						}
					}
					
					if(omsSaleQty == ""){
						if ( !fnStockChk(p, qty) ){
							return;
						};
					}else{
						if(omsSaleQty < qty){
							alert("상품은 최대 "+omsSaleQty+"개까지 주문 가능합니다.");
							return;
						}
					}
					
					//참고) 옵션없는 일반상품일 때는 장바구니,바로구매 진행 직전에 사은품 재고 체크
					var gift_stock_qty = +$("#gift_stock_qty", classkeyDiv).val();
					if(gift_stock_qty > 0 && gift_stock_qty < qty){
						alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
						return;
					}
					
					elandmall.goodsDetail.setPlusOrd(qtyObj, addQty);
					
					var priceObj =$(":input[name='sale_price']", classkeyDiv);
					$(".itemPrc", classkeyDiv).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qtyObj.eq(0).val())) );
					
				}else{
					if ( !fnStockChk(p, qty) ){
						return;
					};
					elandmall.goodsDetail.setPlusOrd(qtyObj, addQty);
				}
				
				elandmall.goodsDetail.sumMultiTotal(scope_div);
			},//[END]수량증가
			//[START] 쥬얼리 수량증가
			setPlusJw : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyObj = $(":input[name='ord_qty']", classkeyDiv);
				var addQty = 1;
				var qty = +(qtyObj.eq(0).val()) + addQty;		// 현 개수+더하는 수량(판매수량 or 1개)
				
				var priceNumber = 0;
				if(p.layer_yn == "Y"){
					for(var i=0; i<div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').length; i++){
						if(div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).attr('class') ==  "L"+p.classkey){
							var ord_qty = Number(div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val());
							priceNumber = div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('input[name="sale_price"]').val();
							ord_qty = ord_qty+ addQty;
							div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
							div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
						}
						
					}
				}else{
					for(var i=0; i<div.find(".goods_detail_txt").find("#choiceItemBox").find('li').length; i++){
						if(div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).attr('class') ==  "L"+p.classkey){
							var ord_qty = Number(div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val());
							priceNumber = div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
							ord_qty = ord_qty+ addQty;
							div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
							div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
						}
						
					}
				}
				
				for(var j=0; j<qtyObj.length; j++){
					qtyObj.eq(j).val(qty);	
				}
					
				$(".itemPrc", classkeyDiv).html(elandmall.util.toCurrency( +(priceNumber) * +(qtyObj.eq(0).val())) );
				elandmall.goodsDetail.sumMultiTotalJw(scope_div);
			},//[END] 쥬얼리 수량증가
			//[START]수량감소
			setMinus : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var opt_set_pkg_yn = false;	//옵션, 묶음, 세트 상품일 때
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				
				if ( $("#multi_item_yn", scope_div).val() == "Y" || $("#goods_cmps_divi_cd", scope_div).val() == "20" || goods_type_cd == "80" || jwFlag ){
					opt_set_pkg_yn = true;
				}
				
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyScopeDiv = opt_set_pkg_yn ? classkeyDiv : scope_div;
				var qtyObj = $(":input[name='ord_qty']", qtyScopeDiv);
				var addQty = +((goods_type_cd == "50") ? 1 : sale_unit_qty);
				var qty = +(qtyObj.eq(0).val()) - addQty;
				
				if(+p.min_qty > 1  && p.min_qty > qty){
					alert("수량은 "+ p.min_qty +"개 이상만 입력 가능 합니다.");
					qtyObj.val(p.min_qty);
				} else {
					elandmall.goodsDetail.setMinusOrd(qtyObj, addQty);
				}
				
				var priceObj =$(":input[name='sale_price']", qtyScopeDiv);
				$(".itemPrc", qtyScopeDiv).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qtyObj.eq(0).val())));
				
				elandmall.goodsDetail.sumMultiTotal(scope_div);			
			},//[END]수량감소	
			//[START] 쥬얼리 수량감소
			setMinusJw : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var div = (quickview_yn == "Y") ? $("#quick_view_layer") : $(".goods_wrap");
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyObj = $(":input[name='ord_qty']", classkeyDiv);
				var addQty = 1;
				var qty = +(qtyObj.eq(0).val()) - addQty;
				
				if(qty < 1){
					return false;
				}
				
				
				var priceNumber = 0;
				if(p.layer_yn == "Y"){
					for(var i=0; i<div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').length; i++){
						if(div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).attr('class') ==  "L"+p.classkey){
							var ord_qty = Number(div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val());
							priceNumber = div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('input[name="sale_price"]').val();
							ord_qty = ord_qty- addQty;
							div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
							div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
						}
						
					}
				}else{
					for(var i=0; i<div.find(".goods_detail_txt").find("#choiceItemBox").find('li').length; i++){
						if(div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).attr('class') ==  "L"+p.classkey){
							var ord_qty = Number(div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').val());
							priceNumber = div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
							ord_qty = ord_qty- addQty;
							div.find(".goods_detail_txt").find("#choiceItemBox").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
							div.find("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(i).find('.goods_sel_co').find('.goods_sel_co_area').find('input[name="ord_qty"]').attr('value', ord_qty);
						}
						
					}
				}
				
				for(var j=0; j<qtyObj.length; j++){
					qtyObj.eq(j).val(qty);
				}
				
				
				$(".itemPrc", classkeyDiv).html(elandmall.util.toCurrency( +(priceNumber) * +(qtyObj.eq(0).val())));
				elandmall.goodsDetail.sumMultiTotalJw(p);			
			},//[END] 쥬얼리 수량감소	
			setPlusOrd : function (sObj, addQty) {
				var value = +sObj.val();
				value += addQty;
				if(value > 9999999){return false;}
				sObj.val(value);
			},
			setMinusOrd : function(sObj, addQty) {
				var value = +sObj.val();
				value -= addQty;
				if(value < 1){return false;}
				sObj.val(value);
			},
			//[START] 세트 구성품 재고 수량 체크
			checkCmpsGoodsQty : function(p){
				var qtyMap = {};
				var qtyChk = true;
				var scope_div = p.scope_div;
				$("strong[id^=choiceGrp]", $(".L"+p.classkey, $("#detailform", scope_div))).each(function(idx){
					var cmps_qty = +$(this).data("cmps_info").cmps_qty;
					var goods_no = $(this).data("cmps_info").goods_no;
					var item_no = $(this).data("cmps_info").item_no;
					if(typeof(qtyMap[goods_no+""+item_no]) != "undefined"){
						qtyMap[goods_no+""+item_no] = +qtyMap[goods_no+""+item_no] + cmps_qty;
					}else{
						qtyMap[goods_no+""+item_no] = cmps_qty
					}
				});
				$.each(qtyMap, function(key, value){
					
					var cmps_sale_poss_qty = $("#sale_poss_qty_"+key, $(".L"+p.classkey, $("#detailform", scope_div))).val();
					var cmps_qty = +value;
					var cmps_ord_qty = p.qty*(+cmps_qty);
					if(cmps_ord_qty > cmps_sale_poss_qty){
						alert("구성품의 재고 수량이 부족합니다. 구매 수량을 변경해 주시기 바랍니다.");
						qtyChk = false;
						return false;
					}
				});
				
				return qtyChk;
			},//[END] 세트 구성품 재고 수량 체크
			clickCartOrd : function(p){ //[START] 장바구니, 바로구매 클릭 함수
				
				//프리오더 2차 체크 
				var isPreFlag = (typeof(p.isPreFlag) != "undefined")? true:false;
				if(isPreFlag){
					var disp_start_date = (typeof(p.disp_start_date) != "undefiend")? p.disp_start_date : "";
					var disp_end_date = (typeof(p.disp_end_date) != "undefiend")? p.disp_end_date : "";
					
					var startDate = new Date(disp_start_date);
					var endDate = new Date(disp_end_date);
					var today = new Date();
					
					if(today < startDate){
						alert("해당 상품은 예정상품입니다.");
						return;
					}else if(today > endDate){
						alert("해당 상품은 마감되었습니다.");
						return;
					}
				}
				
				p = $.extend({event_layer_yn:"N"},p);
				if(!elandmall.goodsDetail.checkValidCartOrd(p)){
					return;
				}
				var quickview_yn = p.quickview_yn;
				var mb_carts = [];
				var layer_yn = (typeof(p.layer_yn) != "undefined")? p.layer_yn:"N";
				
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				var isTodayDeliChk = typeof(p.isTodayDeliChk) != "undefined" ? true : false;
				//오늘받송 또는 오늘직송 체크로직
				var deli_cart_grp_cd = "";
				if($("#multi_item_yn", scope_div).val() == "Y"){
					deli_cart_grp_cd = scope_div.find(".choiceGoods").find('li').eq(0).find("input[name='cart_grp_cd']").val();  //예약 배송과 오늘받송은 다른배송과 섞이지 못함으로 가격박스 첫번째 것을 가져온다.
				}else{
					deli_cart_grp_cd = $("[name=cart_grp_cd]", scope_div).val();
				}
					 
				if(!isTodayDeliChk && (deli_cart_grp_cd == "60" || deli_cart_grp_cd ==  "70") ){
					p["deli_cart_grp_cd"] = deli_cart_grp_cd;
					elandmall.goodsDetail.fnDeliValidChk(p);	
					return;
				}

				mb_carts = elandmall.goodsDetail.setParam({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd:p.cart_divi_cd});
				var items = [];
				$.each(mb_carts, function() {
					items.push(this);
				});
				var cartPin ={
						cart_divi_cd: p.cart_divi_cd,
						items: items,
						event_layer_yn : p.event_layer_yn //이벤트 상품 레이어 여부
				};
				if(p.cart_divi_cd == "20"){		//비회원 주문 가능
					cartPin["nomember"] = true;
				}
				
				var present_check= false;
				
				if($("#goods_type_cd", scope_div).val() == "80"){
					if( $("#recev_slt", scope_div).attr("data-value") != "" ){
						if(layer_yn == "Y"){
							for(var i=0; i< $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
								var cart_grp_cd = $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
								if(cart_grp_cd == "50" && $("#recev_slt", scope_div).attr("data-value") != "50"){
									if( p.cart_divi_cd == "10" ) {
										present_check = true;
										break;
									}
								}
							}
						}else{
							for(var i=0; i< $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
								var cart_grp_cd = $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
								if(cart_grp_cd == "50" && $("#recev_slt", scope_div).attr("data-value") != "50"){
									if( p.cart_divi_cd == "10" ) {
										present_check = true;
										break;
									}
								}
							}
						}
					}
				}
				
				
				if($("#field_rec_choice",scope_div).length > 0){
					if(layer_yn == "Y"){
						for(var i=0; i< $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
							var cart_grp_cd = $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
							if(cart_grp_cd == "50" && $("input[name=field_rec]:checked", scope_div).val() != "50"){
								if( p.cart_divi_cd == "10" ) {
									present_check = true;
									break;
								}
							}
						}
					}else{
						for(var i=0; i< $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
							var cart_grp_cd = $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
							if(cart_grp_cd == "50" && $("input[name=field_rec]:checked", scope_div).val() != "50"){
								if( p.cart_divi_cd == "10" ) {
									present_check = true;
									break;
								}
							}
						}
					}
				}
				
				
				if(present_check){
					alert("선물하기는 바로구매만 가능합니다.");
					return false;
				}
				
				
				if(jwFlag || p.low_vend_type_cd == "50" && p.deli_goods_divi_cd == "10"){
					if(layer_yn == "Y"){
						for(var i=0; i< $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
							var cart_grp_cd = $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
							if(cart_grp_cd == "50"){
								if (!elandmall.loginCheck()){
									alert("선물하기는 이랜드몰 회원만 이용 가능 합니다.");
									cartPin["param_nomember"] = false;
									break;
								}
							}
						}
					}else{
						for(var i=0; i< $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
							var cart_grp_cd = $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
							if(cart_grp_cd == "50"){
								if (!elandmall.loginCheck()){
									alert("선물하기는 이랜드몰 회원만 이용 가능 합니다.");
									cartPin["param_nomember"] = false;
									break;
								}
							}
						}
					}
				}
				
				if(p.event_layer_yn == "Y"){
					//추가 파라미터 설정
					cartPin.event_key 		 = scope_div.find("input[name='event_key']").val();
					cartPin.event_start_date = scope_div.find("input[name='event_start_date']").val();
					cartPin.event_end_date	 = scope_div.find("input[name='event_end_date']").val();
					cartPin.smsg			 = scope_div.find("input[name='smsg']").val();
					cartPin.emsg			 = scope_div.find("input[name='emsg']").val();
					cartPin.enc_goods_no	 = scope_div.find("input[name='goods_no']").val();
					var actionId = cartPin.enc_goods_no.substring(0,20); //상품암호화 번호 20자리
					cartPin.action_id	 	 = actionId;

					elandmall.goodsSkipDetail.click2Shortcut(cartPin);	
				}else{
					
					elandmall.cart.addCart(cartPin);
				}
				
								
				if($("#detailPreview").is(":visible")){
					elandmall.goodDetailPreviewLayer.closeLayer();
				}
	
			}, //[END] 장바구니, 바로구매 클릭 함수
			
			// 2017.11.28 Start
			clickCartOrdEvent : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수
				if(!elandmall.goodsDetail.checkValidCartOrd(p)){
					return;
				}
				var quickview_yn = p.quickview_yn;
				var mb_carts = [];
				
				mb_carts = elandmall.goodsDetail.setParam({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd:p.cart_divi_cd});
				var items = [];
				$.each(mb_carts, function() {
					items.push(this);
				});
				var cartPin ={
						cart_divi_cd: p.cart_divi_cd,
						items: items
				};
				if(p.cart_divi_cd == "20"){		//비회원 주문 가능
					cartPin["nomember"] = true;
				}
				elandmall.cart.addCartEvent(cartPin);
				
				if($("#detailPreview").is(":visible")){
					elandmall.goodDetailPreviewLayer.closeLayer();
				}

			}, //[END] 장바구니, 이벤트상품 바로구매 클릭 함수			
			// 2017.11.28 End
			
			//[START] 장바구니 상품 담기 파라미터 세팅
			setParam : function(p){
				var quickview_yn = p.quickview_yn;
				var scope_div = null;
				var cart_divi_cd = p.cart_divi_cd;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				//[ECJW-9] 옵션 불러오기 I/F
				var cust_prod_yn = "N";
				if($("#deli_goods_divi_cd").val() == "30" ){
					cust_prod_yn = "Y";
				}
				
				if( $("#goods_type_cd", scope_div).val() == "80" || $("#multi_item_yn", scope_div).val() == 'Y'){	//옵션상품, 묶음상품일 때,
					var itemOpt = $("li",$("#choiceItemBox", scope_div));
					$.each(itemOpt, function(){
						//var inputData = $(this).find("input");
						var giftGoodsInfo = "";
						//[START] 옵션별 사은품 파라미터 셋팅 ==> 12341234;1234123;1234124
						if($("#giftInfo", scope_div).length > 0 || $("[name=gift_goods_dtl_no]", $(this)).length > 0 ){
							var giftDtlNo = $("[name=gift_goods_dtl_no]", $(this));
							$.each(giftDtlNo, function(){
								if( giftGoodsInfo != ""){
									giftGoodsInfo += "," + $(this).val();
								}else{
									giftGoodsInfo += $(this).val();
								}
								
							});
						}//[END] 옵션별 사은품 파라미터 셋팅
						
						var brand_nm = $("[name=brand_nm]", this).val();
						
						if(brand_nm == null || brand_nm == ''){
							brand_nm = 'U';
						}
						
						var coupon = $("#goods_cpn_nm", scope_div).val();
						if(coupon == null){
							coupon = '';
						}
						
						var cart_item_nm = "옵션없음";
						if(typeof($("[name=item_nm]",this).val()) != "undefined"){
							cart_item_nm = $("[name=item_nm]",this).val();
							if(cart_item_nm == ""){
								cart_item_nm = "옵션없음"
							}
						}
						
						
						//킴스 산지직송상품의 경우는 cart_grp_cd를 80으로 넘긴다
						var cart_grp_cd_chk = "";
						if(elandmall.global.disp_mall_no == "0000045"){
							
	                        if($("#cart_grp_cd", scope_div).val() == "80"){
	                        	cart_grp_cd_chk = "80";
	                        }else{
	                        	cart_grp_cd_chk = $("[name=cart_grp_cd]", this).val();
	                        }
	                    }else{
	                    	cart_grp_cd_chk = $("[name=cart_grp_cd]", this).val();
                        }
						var cart = {
								brand_nm: brand_nm,
								coupon: coupon,
								category_nm : $('#ga_category_nm').val(),		
										
								add_ord_sel_info: $("#add_ord_sel_info", scope_div).val(),
								gift_goods_info: giftGoodsInfo,
								goods_cmps_divi_cd: $("#goods_cmps_divi_cd", scope_div).val(),
								multi_item_yn: $("#multi_item_yn", scope_div).val(),
								multi_price_yn: $("#multi_price_yn", scope_div).val(),
								cart_grp_cd: cart_grp_cd_chk,
								sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
								sale_shop_no: $("#sale_shop_no", scope_div).val(),
								sale_area_no: $("#sale_area_no", scope_div).val(),
								conts_dist_no: $("#conts_dist_no", scope_div).val(),
								nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
								nplus_cnt: $("#nplus_cnt", scope_div).val(),
								sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
								stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
								sale_price: $("[name=sale_price]",this).val(),
								item_no: $("[name=item_no]",this).val(),
								vir_vend_no: $("[name=vir_vend_no]",this).val(),
								shopcode: $("[name=shopCode]",this).val(), //주얼리 매장픽업코드
								ord_qty: $("[name=ord_qty]",this).val(),
								item_nm: cart_item_nm.replaceAll(",","/")
						};
						
						if($("#goods_type_cd", scope_div).val() == "80"){ 	//묶음상품
							cart["goods_no"] = $("[name=goods_no]", this).val();
							cart["goods_nm"] = $("[name=goods_nm]", this).val();
							cart["set_goods_no"] = $("[name=goods_no]", scope_div).val();
							
							if(jwFlag){
								cart["cust_prod_yn"] 	=	cust_prod_yn;
								cart["cust_item_nm"] 	=	$("[name=cust_item_nm]", this).val();
								cart["cust_item_no"] 	=	$("[name=cust_item_no]", this).val();
								cart["shopcode"] 		=	$("[name=shopCode]", this).val();
								cart["goods_opt_data"] 	=	$("[name=goods_opt_data]", this).val();
								cart["cust_item_key"] 	=	$(this).attr("class");
								cart["in_carve_nm"] 	=	$("[name=in_carve_nm]", this).val();
								cart["out_carve_nm"] 	=	$("[name=out_carve_nm]", this).val();
								cart["carve_code"] 	=	$("[name=carve_code]", this).val();
							}
							
						}else{
							cart["goods_no"] = $("[name=goods_no]", scope_div).val();
							cart["goods_nm"] = $("[name=goods_nm]", scope_div).val();
						}
						
						p.arrCart.push(cart);
					});
					
				}else{
					if($("#goods_cmps_divi_cd", scope_div).val() == "20"){ // 세트상품일 때, 
						$("#choiceItemBox>li", scope_div).each(function(idx){
							var giftGoodsInfo = $("[name=gift_goods_dtl_no]",$(this)).val();
							
							var brand_nm = $("[name=brand_nm]", $(this)).val();
							if(brand_nm == null || brand_nm == ''){
								brand_nm = 'U';
							}
							
							var coupon = $("#goods_cpn_nm", scope_div).val();
							if(coupon == null){
								coupon = '';
							}
							
							var cart_item_nm = "옵션없음";
							if(typeof($("[name=item_nm]",this).val()) != "undefined"){
								cart_item_nm = $("[name=item_nm]",this).val();
								if(cart_item_nm == ""){
									cart_item_nm = "옵션없음"
								}
							}
							
							//킴스 산지직송상품의 경우는 cart_grp_cd를 80으로 넘긴다
							var cart_grp_cd_chk = "";
							if(elandmall.global.disp_mall_no == "0000045"){
								
		                        if($("#cart_grp_cd", scope_div).val() == "80"){
		                        	cart_grp_cd_chk = "80";
		                        }else{
		                        	cart_grp_cd_chk = $("[name=cart_grp_cd]", this).val();
		                        }
		                    }else{
		                    	cart_grp_cd_chk = $("[name=cart_grp_cd]", this).val();
	                        }
							var cart = {
									goods_no: $("#goods_no", scope_div).val(),
									goods_nm: $("#goods_nm", scope_div).val(),
									brand_nm: brand_nm,
									coupon: coupon,
									category_nm : $('#ga_category_nm').val(),		
									
									add_ord_sel_info: $("#add_ord_sel_info", scope_div).val(),
									gift_goods_info: giftGoodsInfo,
									goods_cmps_divi_cd: $("#goods_cmps_divi_cd", scope_div).val(),
									multi_item_yn: $("#multi_item_yn", scope_div).val(),
									multi_price_yn: $("#multi_price_yn", scope_div).val(),
									cart_grp_cd: cart_grp_cd_chk,
									sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
									sale_shop_no: $("#sale_shop_no", scope_div).val(),
									sale_area_no: $("#sale_area_no", scope_div).val(),
									conts_dist_no: $("#conts_dist_no", scope_div).val(),
									nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
									nplus_cnt: $("#nplus_cnt", scope_div).val(),
									sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
									stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
									sale_price: $("[name=sale_price]", $(this)).val(),
									item_no: $("[name=item_no]", scope_div).val(),
									vir_vend_no: $("[name=vir_vend_no]", scope_div).val(),
									ord_qty: $("[name=ord_qty]", $(this)).val(),
									item_nm: cart_item_nm.replaceAll(",","/")
							};
							
							if(cart_divi_cd == "20"){		//비회원 주문 가능
								cart["nomember"] = true;
							}
							
							cart.set_items = [];
							$("strong[id^=choiceGrp]", $(this)).each(function(idx){
								var cmps_obj = $(this).data("cmps_info");
 								cart.set_items.push(cmps_obj);
							});
							
							p.arrCart.push(cart);
						});
					}else{
					
						if(jwFlag){
							
							var itemOpt = $("li",$("#choiceItemBox", scope_div));
							$.each(itemOpt, function(){
								var giftGoodsInfo = "";
								var v_cust_item_key = $(this).attr("class");
								//[START] 옵션별 사은품 파라미터 셋팅 ==> 12341234;1234123;1234124
								if($("#giftInfo", scope_div).length > 0 || $("[name=gift_goods_dtl_no]", $(this)).length > 0 ){
									var giftDtlNo = $("[name=gift_goods_dtl_no]", $(this));
									$.each(giftDtlNo, function(){
										if( giftGoodsInfo != ""){
											giftGoodsInfo += "," + $(this).val();
										}else{
											giftGoodsInfo += $(this).val();
										}
										
									});
								}//[END] 옵션별 사은품 파라미터 셋팅
								
								var brand_nm = $("[name=brand_nm]", this).val();
								
								if(brand_nm == null || brand_nm == ''){
									brand_nm = 'U';
								}
								
								var coupon = $("#goods_cpn_nm", scope_div).val();
								if(coupon == null){
									coupon = '';
								}
								
								var cart_item_nm = "옵션없음";
								if(typeof($("[name=item_nm]",this).val()) != "undefined"){
									cart_item_nm = $("[name=item_nm]",this).val();
									if(cart_item_nm == ""){
										cart_item_nm = "옵션없음"
									}
								}
								
								var cart = {
										brand_nm: brand_nm,
										coupon: coupon,
										category_nm : $('#ga_category_nm').val(),		
												
										add_ord_sel_info: $("#add_ord_sel_info", scope_div).val(),
										gift_goods_info: giftGoodsInfo,
										goods_cmps_divi_cd: $("#goods_cmps_divi_cd", scope_div).val(),
										multi_item_yn: $("#multi_item_yn", scope_div).val(),
										multi_price_yn: $("#multi_price_yn", scope_div).val(),
										cart_grp_cd: $("[name=cart_grp_cd]", this).val(),
										sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
										sale_shop_no: $("#sale_shop_no", scope_div).val(),
										sale_area_no: $("#sale_area_no", scope_div).val(),
										conts_dist_no: $("#conts_dist_no", scope_div).val(),
										nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
										nplus_cnt: $("#nplus_cnt", scope_div).val(),
										sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
										stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
										sale_price: $("[name=sale_price]",this).val(),
										item_no: $("[name=item_no]",scope_div).val(),
										vir_vend_no: $("[name=vir_vend_no]", this).val(),
										ord_qty: $("[name=ord_qty]", this).val(),
										item_nm: cart_item_nm.replaceAll(",","/"),
										
										//[ECJW-9] 옵션 불러오기 I/F
										cust_prod_yn: cust_prod_yn,
										cust_item_key : v_cust_item_key,
								        cust_item_nm: $("[name=cust_item_nm]", this).val(),
								        cust_item_no: $("[name=cust_item_no]", this).val(),
								        shopcode: $("[name=shopCode]", this).val(),     //픽업매장코드
								        goods_opt_data: $("[name=goods_opt_data]", this).val(),
								        in_carve_nm : $("[name=in_carve_nm]", this).val(),
								        out_carve_nm : $("[name=out_carve_nm]", this).val(),
								        carve_code  : $("[name=carve_code]", this).val()
										
								};
								
								if($("#goods_type_cd", scope_div).val() == "80"){ 	//묶음상품
									cart["goods_no"] = $("[name=goods_no]", this).val();
									cart["goods_nm"] = $("[name=goods_nm]", this).val();
									cart["set_goods_no"] = $("[name=goods_no]", scope_div).val();
								}else{
									cart["goods_no"] = $("[name=goods_no]", scope_div).val();
									cart["goods_nm"] = $("[name=goods_nm]", scope_div).val();
								}
								
								p.arrCart.push(cart);
							});
						
						
						
						}else{
							
							
							var giftGoodsInfo = "";
							if($("#giftInfo", scope_div).data("multi_yn") == "Y"){
								giftGoodsInfo = $("#gift_slt", scope_div).attr('value');
							}else{
								giftGoodsInfo = $("[name=gift_goods_dtl_no]",$("#giftInfo",scope_div)).attr('value');
							}
							
							var brand_nm = $("#goods_brand_name", scope_div).data("brand_nm");
							
							if(brand_nm == null || brand_nm == ''){
								brand_nm = 'U';
							}
							
							var coupon = $("#goods_cpn_nm", scope_div).val();
							if(coupon == null){
								coupon = '';
							}
							
							var cart_item_nm = "옵션없음";
							if(typeof($("[name=item_nm]",this).val()) != "undefined"){
								cart_item_nm = $("[name=item_nm]",this).val();
								if(cart_item_nm == ""){
									cart_item_nm = "옵션없음"
								}
							}
							
							var cart = {
									goods_no: $("[name=goods_no]", scope_div).val(),
									goods_nm: $("[name=goods_nm]", scope_div).val(),
									brand_nm: brand_nm,
									coupon: coupon,
									category_nm : $('#ga_category_nm').val(),		
									
									add_ord_sel_info: $("#add_ord_sel_info", scope_div).val(),
									gift_goods_info: giftGoodsInfo,
									goods_cmps_divi_cd: $("#goods_cmps_divi_cd", scope_div).val(),
									multi_item_yn: $("#multi_item_yn", scope_div).val(),
									multi_price_yn: $("#multi_price_yn", scope_div).val(),
									cart_grp_cd: $("[name=cart_grp_cd]", scope_div).val(),
									sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
									sale_shop_no: $("#sale_shop_no", scope_div).val(),
									sale_area_no: $("#sale_area_no", scope_div).val(),
									conts_dist_no: $("#conts_dist_no", scope_div).val(),
									nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
									nplus_cnt: $("#nplus_cnt", scope_div).val(),
									sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
									stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
									sale_price: $("[name=sale_price]", scope_div).val(),
									item_no: $("[name=item_no]", scope_div).val(),
									vir_vend_no: $("[name=vir_vend_no]", scope_div).val(),
									ord_qty: $("[name=ord_qty]", scope_div).val(),
									item_nm: cart_item_nm.replaceAll(",","/")
							        	
							};
							
							if(cart_divi_cd == "20"){		//비회원 주문 가능
								cart["nomember"] = true;
							}
							
							p.arrCart.push(cart);
							
							
						}//[END]주얼리주문제작
						
					}
				}
				
				return p.arrCart;
			},	//[END] 장바구니 상품 담기 파라미터 세팅
			//[START] 장바구니, 바로주문 valid check
			checkValidCartOrd: function(pin){
				var quickview_yn = pin.quickview_yn;
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				
				var lowVendTypeCd = $("#option_low_vend_type_cd").val();
				var flag_qty = true;
				$("input[name='ord_qty']",scope_div).each(function(){
					if(typeof($(this).val()) == "undefined" || $(this).val() == ''){
						flag_qty = false;
					}
				});
				
				if(!flag_qty){
					alert("옵션을 모두 입력 후 진행해 주세요.");
					return false;
				}
				
				
				if($("#multi_item_yn", scope_div).val() == "Y" || $("#goods_cmps_divi_cd", scope_div).val() == "20" || $("#goods_type_cd", scope_div).val() == "80"){
					if($("#choiceItemBox",scope_div).children().length == 0){
						alert("옵션을 모두 입력 후 진행해 주세요.");
						return false;
					}
				}else{
					if($("#gift_slt", scope_div).length > 0){
						if($("#gift_slt", scope_div).attr('data-value') == ""){
							alert("옵션을 모두 입력 후 진행해 주세요.");
							return false;
						}
					}
				}

				if(lowVendTypeCd == "50"){
					if($("input[name=field_rec]:checked", scope_div).val() == "40"){
						alert("매장수령 선택 후 진행해 주세요.");
						return false;
					}
					
					for(var i=0; i<$(".layer_pop").length; i++){
						if(typeof($(".layer_pop").eq(i).find('#pickListForm').val()) != "undefined"){
							alert("매장수령 선택 후 진행해 주세요.");
							return false;
						}
					}
				}else{
					
					if($("#choiceItemBox",scope_div).children().length == 0 && 
							$("#field_rec_choice",scope_div).length > 0 && $("input[name=field_rec]", scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
						if(typeof($("input[name=field_rec]:checked", scope_div).val()) ==  "undefined"){
							alert("수령방법을 선택해주세요.");
							return false;
						}else{
							$("#cart_grp_cd", scope_div).val($("input[name=field_rec]:checked", scope_div).val());
						}
					}
					
				}
				
				//묶음 상품이 아닌 상품에 대해 총 담은 상품 수량 체크
				if($("#goods_type_cd", scope_div).val() != "80"){
					var choice_ord_qty = 0;
					var max_qty = +$("#ord_poss_max_qty",scope_div).val();
					$("input[name='ord_qty']",$("#detailform", scope_div)).each(function(){
						choice_ord_qty += +$(this).val();
					});

					if(max_qty > 0){
						if(choice_ord_qty > max_qty){
							alert("상품은 최대 "+max_qty+"개까지 주문 가능합니다.");
							return false;
						}
					}
					
				}
				
				//옵션없는 일반 상품일 때, 사은품 수량체크.
				if(  !($("#multi_item_yn", scope_div).val() == "Y" && $("#goods_cmps_divi_cd", scope_div).val() == "20" && $("#goods_type_cd", scope_div).val() == "80") ){
					
					var gift_stock_qty = 0;
					var qtyObj = $(":input[name='ord_qty']", scope_div);
					var qty = +(qtyObj.eq(0).val());
					
					if($("#gift_slt", $("#giftInfo", scope_div)).length > 0){
						gift_stock_qty = +$("#gift_slt", $("#giftInfo", scope_div)).data('stock_qty');
					}else{
						gift_stock_qty = $(":input[name='gift_goods_dtl_no']", $("#giftInfo", scope_div)).data('stock_qty');
					}
					if(gift_stock_qty > 0 && gift_stock_qty < qty){
						alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
						return false;
					}
				}
				
				
				return true;
				
			},	//[END] 장바구니, 바로주문 valid check
			
			
			
			//[START] 방문수령여부 변경 주얼리 주문제작 
			changeFieldRecJw : function(pin){
				
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")?pin.quickview_yn:"N";
				var obj = pin.obj;
				var scope_div = null;
				var goods_nm = "";
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				var type = (typeof(pin.type) != "undefined")?pin.type:"DEF";
				
				
				var layer_yn = "";
				
				
				var objVal = $(obj).attr("data-value");
				$("#recev_slt", scope_div).attr("data-value",objVal);
				
				$("#cart_grp_cd", scope_div).val($("input[name=field_rec]:checked", scope_div).val());
				
				var lowVendTypeCd = $("#option_low_vend_type_cd").val();
				
				if(lowVendTypeCd == "50"){

					for(var i=0; i<$(".layer_pop").length; i++){
						if(typeof($(".layer_pop").eq(i).find('#pickListForm').val()) != "undefined"){
							alert("매장수령 선택 후 진행해 주세요.");
							$("input[name=field_rec]:checked", scope_div).prop('checked', false);
							return false;
						}
					}
				}
				
				
				if(type == "PKG"){
					layer_yn = $(obj).parent().parent().parent().find('.selected').eq(1).children().attr('data-layer_yn'); 
					set_goods_no = scope_div.find('.selected').children('.sel_txt').attr('data-goods_no');
					set_styleCode = scope_div.parents('.add_selects').find('#li_cmps_goods').find('.lyr_options').find('.options').find('.selected').children('.ancor').attr('data-style_cd');
					if($.type(set_styleCode) == "undefined") {
						set_styleCode = $("#item_opt_li_data").attr('data-style_cd');
					}
					set_brandCode = $("#item_opt_li_data").attr('data-brand_cd');
					goods_nm = $(obj).parents('.add_selects').find('#li_cmps_goods').find('.lyr_options').find('.options').find('.selected').children('.ancor').find('.opt_name').text();
					
				}else{
					if($(obj).parents('#gd_float_opt_fix').length > 0){
						layer_yn = "Y";
					}
					
					goods_nm = $("#goods_nm").val();
				}
				
				var carve_code = $(obj).parents('.add_selects').children('li[id="li_id_carve"]').find('.selected').children('.sel_txt').attr('data-sel-cd');
				var parent_opt_cd = $(obj).parents('.add_selects').children('li[id="li_id_carve"]').find('.selected').children('.sel_txt').attr('data-opt_cd');
				var carve_length = "";
				var carve_is_leng = "";
				var carve_out_leng = "";
				
				if(typeof(carve_code) != "undefined" ){
					
					carve_length = $(obj).parents('.add_selects').children('li[id="li_id_carve"]').find('.selected').children('.sel_txt').attr('data-carve_len');	
					
					if(parent_opt_cd == "ISOS" || parent_opt_cd == "OSIS"){
						carve_length = carve_length.split(',');
					}
					
					
					if(parent_opt_cd == "ISOS" ){
						carve_is_leng = carve_length[0];
						carve_out_leng = carve_length[1];
					}else if(parent_opt_cd == "OSIS"){
						carve_out_leng = carve_length[0];
						carve_is_leng = carve_length[1];
					}else if(parent_opt_cd == "IS"){
						carve_is_leng = carve_length;
					}else if(parent_opt_cd == "OS"){
						carve_out_leng = carve_length;
					}
					
					
					var carve_div = scope_div.find(".goods_detail_txt");
					var carve_float_div = scope_div.find("#gd_float_opt_fix");
					var check_flag = false;
					if(layer_yn == "Y"){
						
						if(carve_code == "ISOS" || carve_code == "OSIS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_float_div,'in_carve', 'IS', carve_is_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_float_div,'out_carve', 'OS', carve_out_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							
							var chkIn = scope_div.find("#in_carve").val();
							var chkOut = scope_div.find("#out_carve").val();
							if(chkIn == "" && chkOut == "") {
								alert("각인을 입력해 주세요.");
								check_flag = true;
							}else if(fnStrChkText(carve_float_div,'in_carve', 'IS')){
								check_flag = true;
							}else if(fnStrChkText(carve_float_div,'out_carve', 'OS')){
								check_flag = true;
							}
						}else if(carve_code == "IS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_float_div,'in_carve', 'IS', carve_is_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							//공백 및 특수문자 체크 영역
							if(fnStrChkText(carve_float_div,'in_carve', 'IS')){
								check_flag = true;
							}
						}else if(carve_code == "OS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_float_div,'out_carve', 'OS', carve_out_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							if(fnStrChkText(carve_float_div,'out_carve', 'OS')){
								check_flag = true;
							}
						}
						
						
					}else{
						
						if(carve_code == "ISOS" || carve_code == "OSIS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_float_div,'in_carve', 'IS', carve_is_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							//길이체크 영역
							if(fnLengthChk(layer_yn, carve_div, carve_float_div, 'out_carve', 'OS', carve_out_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							var chkIn = scope_div.find("#in_carve").val();
							var chkOut = scope_div.find("#out_carve").val();
							if(chkIn == "" && chkOut == "") {
								alert("각인을 입력해 주세요.");
								check_flag = true;
							}else if(fnStrChkText(carve_div,'in_carve', 'IS')){
								check_flag = true;
							}else if(fnStrChkText(carve_div,'out_carve', 'OS')){
								check_flag = true;
							}
						}else if(carve_code == "IS"){
							//길이체크 영역
							if(fnLengthChk(layer_yn, carve_div, carve_float_div, 'in_carve', 'IS', carve_is_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							if(fnStrChkText(carve_div,'in_carve', 'IS')){
								check_flag = true;
							}
						}else if(carve_code == "OS"){
							//길이체크 영역
							if(fnLengthChk(layer_yn, carve_div, carve_float_div, 'out_carve', 'OS', carve_out_leng) ){
								$("input[name=field_rec]:checked", scope_div).prop('checked', false);
								return false;
							}
							if(fnStrChkText(carve_div,'out_carve', 'OS')){
								check_flag = true;
							}
						}
					}
					
					if(check_flag){
						$("input[name=field_rec]:checked", scope_div).prop('checked', false);
						return false;
					}
					
					
				}
				if(lowVendTypeCd == "50" && $("input[name=field_rec]:checked", scope_div).val() == "40"){
					commonUI.dimCall();
				}
				
				
				var param = $.extend({ goods_no: set_goods_no
									, GOODS_NM		:	goods_nm
									, item_no		:	""
									, vir_vend_no	:	set_vir_vend_no
									, low_vend_type_cd :set_low_vend_type_cd 
									, quickview_yn	:	set_quickview_yn
									, styleCode		:	set_styleCode
									, brandCode		:	set_brandCode
									, layer_yn		: 	layer_yn
									, obj			:   obj 
									, carve_code	:	carve_code
									}
									, pin || {} 
									);
								
					elandmall.goodsDetail.jwGoodsAddParam({
					param:param,
					});
					
					function fnLengthChk (layer_yn, div,div_float, textid, opt,length){
						var text = ""; // 이벤트가 일어난 컨트롤의 value 값
						if(layer_yn == "Y"){
							text = div_float.find('#'+textid).val();
						}else{
							text = div.find('#'+textid).val();
						}
						var textlength = text.length; // 전체길이
						var result_chk = false;
						// 전체길이를 초과하면 
						if(textlength > length){ 
							alert("제한된 글자수를 초과 하였습니다."); 
							var text2 = text.substr(0, length); 
							div.find('#'+textid).val(text2);
							div_float.find('#'+textid).val(text2);
							result_chk = true;
							return result_chk; 
						}else{
							if( layer_yn == "Y"){
								div.find('#'+textid).val(div_float.find('#'+textid).val());
							}else{
								div_float.find('#'+textid).val(div.find('#'+textid).val());
							}
						}
						
					}
					
					function fnStrChkText (div,textid, opt){
						var text = ""; 
						var result_chk = false;
						text = div.find('#'+textid).val();
						
						if($.trim(text) == ""){
							if(opt == "IS"){
								alert("속각인 입력을 해주세요.");
							}else if(opt == "OS"){
								alert("겉각인 입력을 해주세요.");
							}
							result_chk = true;
							return result_chk;
						}
						
						var regEx = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\-\!\&\*\+\=\(\)\＆\☆\★\♡\♥\,\.\/\♪\♫]+$/;
						if(!regEx.test(text) ){
							alert("입력 불가한 문자가 존재 합니다.\n (한글,영문,일부 특수기호만 가능)");
							result_chk = true;
							return result_chk; 
						}
						
						
					}
					
					
			},//[END] 방문수령여부 변경 주얼리 주문제작
			
			
			
			//[START] 방문수령여부 변경
			changeFieldRec : function(pin){
				
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")?pin.quickview_yn:"N";
				var jwNormal_yn = (typeof(pin.jwNormal_yn) != "undefined")?pin.jwNormal_yn:"N";
				var obj = pin.obj;
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					if($("#_optChoiceLayer").length>0){
						scope_div = $("#_optChoiceLayer");
					}else{
						scope_div = $(".goods_wrap");
					}
				}
				
				//희망배송일 선택 상품은 당일배송과 의미가 맞지 않다.				
				var deli_hope_day_yn = (typeof(pin.deli_hope_day_yn) != "undefined")?pin.deli_hope_day_yn:"N";
				if(deli_hope_day_yn == "Y"){
					alert("배송일 선택 상품은 당일배송이 불가능합니다.");
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					return false;
				}
				
				
				var layer_yn = $(obj).parents('.lyr_select').children().children('.sel_txt').attr('data-layer_yn');
				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
				var objVal = $(obj).attr("data-value");
				$("#recev_slt", scope_div).attr("data-value",objVal);
				
				
				var lowVendTypeCd = $("#option_low_vend_type_cd").val();
				
				if(lowVendTypeCd == "50"){

					for(var i=0; i<$(".layer_pop").length; i++){
						if(typeof($(".layer_pop").eq(i).find('#pickListForm').val()) != "undefined"){
							alert("매장수령 선택 후 진행해 주세요.");
							$("input[name=field_rec]:checked", scope_div).prop('checked', false);
							return false;
						}
					}
				}
				
				var layerData = scope_div.data("goods_info");
				var chk_goods_type_cd =$("#goods_type_cd", scope_div).val();
				if($("#_optChoiceLayer").length>0){
					chk_goods_type_cd = layerData.goods_type_cd;
				}
				
				if($("#recev_slt", scope_div).attr("data-value") == "50" ){
					$("#cartBtn").hide();
					$(".goods_set_btn", scope_div).addClass('type02');
					$("#float_cartBtn").hide();
					$("#float_buyBtn").addClass('full');
				}else{
					$(".goods_set_btn", scope_div).removeClass('type02');
					if(event_layer_yn != "Y"){
						$("#cartBtn").show();
						$("#float_buyBtn").removeClass('full');
					}
					$("#float_cartBtn").show();
				}
				
				$("#cart_grp_cd", scope_div).val($("#recev_slt", "#_optChoiceLayer").attr("data-value"));
				
				if(jwNormal_yn == "Y"){
					if($("input[name=field_rec]:checked", scope_div).val() == "40"){
						commonUI.dimCall();
					}
					var param = {};
					
					if(chk_goods_type_cd == "80"){
						
						param["goods_no"] = scope_div.find('.selected').children('.sel_txt').attr('data-goods_no');
						param["vir_vend_no"] = scope_div.find('.selected').children('.sel_txt').attr('data-vir_vend_no');
						param["item_no"] = $("#last_item_no", scope_div).val(); 
						param["jwNormal_yn"] = jwNormal_yn;
						param["brand_cd"] = pin.brand_cd;
						param["style_cd"] = pin.style_cd;
						param["last_sap_item_cd"] = $("#last_sap_item_cd", scope_div).val();
						param["layer_yn"] = pin.layer_yn;
						
						elandmall.optLayerEvt.getItemPrice({
							param:param,
							success:function(data){
								data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
								elandmall.goodsDetail.drawAddGoods({
									data:data,
									quickview_yn:quickview_yn,
									type : "PKG"
								});
							}
						});
						
					}else{
						param["goods_no"] = $("#detailform", scope_div).attr("data-goods_no");
						param["vir_vend_no"] = $("#detailform", scope_div).attr("data-vir_vend_no");
						param["item_no"] = $("#last_item_no", scope_div).val(); 
						param["jwNormal_yn"] = jwNormal_yn;
						param["brand_cd"] = pin.brand_cd;
						param["style_cd"] = pin.style_cd;
						param["last_sap_item_cd"] = $("#last_sap_item_cd", scope_div).val();
						param["layer_yn"] = pin.layer_yn;
						
						
						elandmall.optLayerEvt.getItemPrice({
							param:param,
							success:function(data){
								elandmall.goodsDetail.drawAddGoods({
									data:data,
									quickview_yn:quickview_yn
								});
							}
						});
						
						
					}

					
					
					
				}else{
					
					if(chk_goods_type_cd == "80"){
						var multi_item_yn = $("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn");
						var disp_seq = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
						
						if($("#recev_slt", "#_optChoiceLayer").length > 0){
							$("#cart_grp_cd", scope_div).val($("#recev_slt", "#_optChoiceLayer").attr("data-value"));
						}else{
							if($("#recev_slt", $("#li_receive_choice",scope_div)).attr("data-value") != ""){
								$("#recev_slt", $("#li_receive_choice", scope_div)).attr("data-choice_yn", "Y");
								if($("#pkgCmpsGoods", scope_div).attr("data-choice_yn")=="Y"){
									if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
										var param = $("#pkgCmpsGoods", scope_div).data("itemInfo");
										if(multi_item_yn == "Y"){ //구성품이 옵션상품일 때,
											//var p = {};
											elandmall.optLayerEvt.getItemPrice({
												param:param,
												success:function(data){
													var p = {};
													data[0]["disp_seq"] = disp_seq;
													data[0]["vend_nm"] = param["vend_nm"];
													p["type"] = "PKG";
													p["data"] = data;
													p["cart_grp_cd"] = $("#recev_slt", $("#li_receive_choice", scope_div)).attr("data-value");
													p["quickview_yn"] = quickview_yn;
													if($("#giftInfo").length > 0){
														p["gift_nm"] = param["gift_nm"];
														p["gift_goods_dtl_no"] = param["gift_goods_dtl_no"];
														p["gift_stock_qty"] = param["gift_stock_qty"];
													}
													elandmall.goodsDetail.drawAddGoods(p);
													elandmall.goodsDetail.sumMultiTotal(scope_div);
												}
											});
										}else{
											var p = {};
											p["type"] = "PKG";
											p["data"] = param;
											p["cart_grp_cd"] = $("#recev_slt", $("#li_receive_choice", scope_div)).attr("data-value");
											p["quickview_yn"] = quickview_yn;
											if($("#giftInfo").length > 0){
												p["gift_nm"] = param["gift_nm"];
												p["gift_goods_dtl_no"] = param["gift_goods_dtl_no"];
												p["gift_stock_qty"] = param["gift_stock_qty"];
											}
											elandmall.goodsDetail.drawAddGoods(p);
											
											elandmall.goodsDetail.sumMultiTotal(scope_div);
										}
									}
								}
							}
							
						}
						

					}else{
						
						if($("input[name=field_rec]:checked", scope_div).val() == "50"){
							$("#cartBtn").hide();
							$(".goods_set_btn", scope_div).addClass('type02');
							$("#float_cartBtn").hide();
							$("#float_buyBtn").addClass('full');
						}else{
							$(".goods_set_btn", scope_div).removeClass('type02');
							if(event_layer_yn != "Y"){
								$("#cartBtn").show();
								$("#float_buyBtn").removeClass('full');
							}
							$("#float_cartBtn").show();
						}	
						
						$("#cart_grp_cd", scope_div).val($("input[name=field_rec]:checked", scope_div).val());
						
						//상품상세의 플로팅과 동기화
						if(quickview_yn != 'Y'){
							$.each($("input[name=field_rec]", scope_div), function(index) {
	                        	if($("input[name=field_rec]", scope_div).eq(index).attr('id') ==  $(obj).attr('id')){
	                        		this.checked = true;
	                        	}
	                        });
						}
						
						if($("#recev_slt", "#_optChoiceLayer").length > 0){
							$("#cart_grp_cd", scope_div).val($("#recev_slt", "#_optChoiceLayer").attr("data-value"));
						}
					}
					
				}
				
			},//[END] 방문수령여부 변경
			
			//[START] 오늘받송 & 오늘직송 변경
			fnDeliValidChk : function(p){
				
				p["isTodayDeliChk"] = "N";
				var deli_cart_grp_cd = (typeof(p.deli_cart_grp_cd) != "undefined")?p.deli_cart_grp_cd:"";
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")?p.quickview_yn:"N";
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					if($("#_optChoiceLayer").length>0){
						scope_div = $("#_optChoiceLayer");
					}else{
						scope_div = $(".goods_wrap");
					}
				}
				
				var fnDeliCallback = function(){
							
					//기본배송지 조회
					$.ajax({
						url: "/member/getMbMbrDlvpMgmtBaseAjax.action",
						data: {
								goods_no : $("#goods_no", $("#detailform", scope_div)).val(),
								vend_no : $("#vend_no", $("#detailform", scope_div)).val(),
								vir_vend_no : $("#vir_vend_no", $("#detailform", scope_div)).val(),
								center_no :  $("#physical_center_no", $("#detailform", scope_div)).val()
						},
						async:false,
						type: "POST",
						dataType: "json",
						success: function(data) {
							
							if(data == null){ //기본배송지 없을 때 
								if(confirm("배송지가 설정되어 있지 않습니다.\n배송지를 먼저 설정하겠습니까?")){
									var str = window.location.href;
									if(str.indexOf('/goods/initGoodsDetail')  == -1 ){
										str = elandmall.util.newHttps("/goods/initGoodsDetail.action?goods_no=" + $("#goods_no", $("#detailform", scope_div)).val() + "&vir_vend_no=" + $("#vir_vend_no", $("#detailform", scope_div)).val());
									}
									var url = elandmall.util.https("/mypage/searchBanJJakDlvpListLayer.action?url=" + encodeURIComponent(str));
									var option = "resizable=no,scrollbars=yes,width=820px,height=600px,left=400px";
									var popup = window.open(url, "오늘받송상품배송지목록", option);
									popup.focus();
									return false;
								}else{
									$("input[name=field_rec]:checked", scope_div).prop('checked', false);
				    				commonUI.dimRemove();
				    				return false;
								}
								
							}else{
								
								
								var isQuickVendMatch  = typeof(data.isQuickVendMatch) == undefined || data.isQuickVendMatch == null ? "" : data.isQuickVendMatch;
								var isQuickholiday  = typeof(data.isQuickholiday) == undefined || data.isQuickholiday == null ? "" : data.isQuickholiday;
								var isLotVendMatch  = typeof(data.isLotVendMatch) == undefined || data.isLotVendMatch == null ? "" : data.isLotVendMatch;
								var isLotholiday  = typeof(data.isLotholiday) == undefined || data.isLotholiday == null ? "" : data.isLotholiday;
						 		
								var defualt_addr_yn = "N";
								if(deli_cart_grp_cd=="60" && isQuickVendMatch == "Y" && isQuickholiday == "N"){ //오늘받송이면서 해당지점이면서 휴일이 아닐때
									defualt_addr_yn = "Y";
								}
								
						 		if(deli_cart_grp_cd == "60" && isQuickholiday == "Y"){
                                	$("#rdo01_4").attr('disabled', true);
                                }
								
						 		if(deli_cart_grp_cd=="70" && isLotVendMatch == "Y" && isLotholiday == "N"){ //오늘직송이면서 해당지점이면서 휴일이 아닐때 배송 확인 메시지를 안띄운다.
						 			p["isTodayDeliChk"] = "Y";
						 			elandmall.goodsDetail.clickCartOrd(p);
						 		}else{
						 			var pin = $.extend({data:data, div:scope_div
						 								, defualt_addr_yn:defualt_addr_yn, goods_no:$("#goods_no", $("#detailform", scope_div)).val()
						 								, vir_vend_no:$("#vir_vend_no", $("#detailform", scope_div)).val(), deli_cart_grp_cd:deli_cart_grp_cd}, p);
									elandmall.popup.fnGoodsTodayDeliLayer({
										param : pin,
										callback_ok: function(result) {
											p["isTodayDeliChk"] = "Y";
											elandmall.goodsDetail.clickCartOrd(p);
										},
										callback_close: function(result) {
											$("input[name=field_rec]:checked", scope_div).prop('checked', false);
						    				commonUI.dimRemove();
						    				return false;
										}
									});
						 		}
							}
						}
					});
				}
				
				var fnCancelCallback = function(){
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					if(quickview_yn == "Y" || $("#detailPreview").length > 0){ //퀵뷰 일때 
						elandmall.popup.fnLayerReturn();	
					}
    				return false;
				}
				
				var fnSuccessCallback = function(){
					if(deli_cart_grp_cd == "70"){
						location.reload();
					}else{
						isLoginCheckAjax();
						fnDeliCallback();
					}
				}
				
				if (!elandmall.loginCheck()){
					if(confirm("로그인이 필요한 서비스 입니다.\n로그인하겠습니까?")){
						elandmall.isLogin({login:fnSuccessCallback, close:fnCancelCallback, nomember_hide: true});
					}
					
					if($("#detailPreview").length > 0 && $("#detailPreview").css('display') == 'block'){
					    $("#gd_float_opt_fix").addClass("groups");
					}else if($("#detailPreview").length > 0 && $("#detailPreview").css('display') == 'none'){
						$("#gd_float_opt_fix").removeClass("groups");
					}
					
				} else {
					fnDeliCallback();
				}
				
			},//[END] 오늘받송 & 오늘직송 변경
			
			//[START] 세트상품 구성품 변경
			changeSetGoods : function(obj){

				var cmps_grp_seq = $(obj).parent().parent('ul').data("cmps_grp_seq");
				var selectedOpt = $(obj);
				var multi_yn = $(selectedOpt).attr("data-multi_item_yn");	//구성품의 단품유무여부
				var div = $("[id^=setGrp"+cmps_grp_seq+"]");
				var objVal= $(obj).attr("data-value");
				var $li = $(obj).parent();
				var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
				
				
				if(!$li.hasClass('sld_out')){
					if($(obj).data("layer_yn") == "Y"){
						$("#cmps_goods_grp"+cmps_grp_seq).attr('data-value',objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).parent().addClass("selected");
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#cmps_goods_grp"+cmps_grp_seq).text($(obj).children('.opt_name').text());
						//$("#cmps_goods_grp"+cmps_grp_seq).attr('value',objVal);
					}else{
						$("#cmps_goods_grp"+cmps_grp_seq+"L").attr('data-value',objVal);
						$("#cmps_goods_grp"+cmps_grp_seq+"L").parent().addClass("selected");
						$("#cmps_goods_grp"+cmps_grp_seq+"L").attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#cmps_goods_grp"+cmps_grp_seq+"L").text($(obj).children('.opt_name').text());
						//$("#cmps_goods_grp"+cmps_grp_seq+"L").attr('value',objVal);
					}
					$(div).children("ul").children("li:not([id^=li_cmps_goods_grp"+cmps_grp_seq+"])").remove();	//상품선택을 셀렉트를 제외한 나머지 삭제
					if(multi_yn != "Y"){ //구성품이 단품 없는 상품이라면, 
						
						//구성품 선택여부 변경 ==> 그룹 선택의 우선 순위가 없기 때문에..
						if(objVal != ""){
							$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "Y");
						}else{
							$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "N");
						}
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", $(selectedOpt).attr("data-vir_vend_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", $(selectedOpt).attr("data-item_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", $(selectedOpt).attr("data-set_cmps_item_no"));
						//$(obj).data("set_cmps_item_no", $(selectedOpt).data("set_cmps_item_no")); // <- 세트상품 구성단품번호
						
						
						if( $("#giftInfo").length > 0 ){
							if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
								if(elandmall.goodsDetail.checkSetGoodsChoice()){ 
									var param = elandmall.optLayerEvt.addSetGoodsParam();
									//마지막 옵션 선택 후, 사은품의 disabled 해제
									$("[id^=gift_slt]", scope_div).parents(".lyr_select").removeClass("disabled");
									$("#gift_slt").data("itemInfo", param);
									
								}else{
									$("#gift_slt").attr("data-value","");
									$("[id^=gift_slt]").parents(".lyr_select").addClass("disabled");
									$("#gift_slt").attr("data-itemInfo","");
								}
							}else{	//사은품이 1개일 때,
								
								if(elandmall.goodsDetail.checkSetGoodsChoice()){
									
									var param = elandmall.optLayerEvt.addSetGoodsParam();
									elandmall.optLayerEvt.getSetGoodsPrice({
										param:param,
										success:function(data){
											elandmall.goodsDetail.drawAddGoods({
												type:"SET",
												data:data,
												set_param:param,
												gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
												gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
												gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
											});
											elandmall.goodsDetail.sumMultiTotal();
											
										}
									});
									
								}
								
							}
						}else{	//[START]사은품이 없을 때
							if(elandmall.goodsDetail.checkSetGoodsChoice()){
								var param = elandmall.optLayerEvt.addSetGoodsParam();
								
								elandmall.optLayerEvt.getSetGoodsPrice({
									param:param,
									success:function(data){
										elandmall.goodsDetail.drawAddGoods({
											type:"SET",
											data:data,
											set_param:param
										});
										elandmall.goodsDetail.sumMultiTotal();
										
									}
								});
							}
						}//[END]사은품이 없을 때
						
					}else{ //단품 있는 상품일 때,
						
						elandmall.optLayerEvt.drawItemSelect({obj:obj});
						var goods_no = objVal;
						var vir_vend_no = $(selectedOpt).data("vir_vend_no");
						var reserv_yn = "N";
						if($("#reserv_limit_divi_cd").val()== "10" || $("#reserv_limit_divi_cd").val()== "20"){
							reserv_yn = "Y";
						}
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", $(selectedOpt).attr("data-vir_vend_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", $(selectedOpt).attr("data-item_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", $(selectedOpt).attr("data-set_cmps_item_no"));
						if(multi_yn=="Y"){
							$("#cmps_goods_grp"+cmps_grp_seq).attr("data-multi_item_yn", multi_yn);
						}
						
						elandmall.optLayerEvt.ajaxItemList({
							param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:$("#goods_no").val(), cmps_grp_seq:cmps_grp_seq ,event_layer_yn: event_layer_yn},
							success:function(data){
								var opt = div.find("[id^=options_nm1]");
								//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
								$selBtn =opt.parents('.lyr_select').children('.sel_btn');
								
								//var cmps_grp_seq = opt.data("cmps_grp_seq");
								var grp_nm = $("#setGrp"+cmps_grp_seq).children(".opt_box_title").text();
								$.each(data, function() {
									var item_no = this.ITEM_NO;
									var opt_val_nm1 = this.OPT_VAL_NM1;
									var sale_poss_qty = this.SALE_POSS_QTY;
									var goods_nm = this.GOODS_NM;
									var item_nm_add_info = this.ITEM_NM_ADD_INFO;
									var item_sale_price = this.ITEM_SALE_PRICE;
									var goods_sale_price = this.GOODS_SALE_PRICE;
									
									if(typeof(item_nm_add_info) == "undefined"){
										item_nm_add_info = "";
									}
									/* 20170207 false처리*/
									if (  item_sale_price > -1 && $("#option_low_vend_type_cd").val() != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
									var str_ga_tag = "";
									str_ga_tag +="PC_상품상세||" + grp_nm +"_" + opt.data("opt_nm") + "선택||";
									
									//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
									if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
										item_sale_price="";
									}
									
									var optionObj = null;
									if(sale_poss_qty > 0){
										optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
												"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
										).attr({ "data-value": item_no });
									}else{
										if(event_layer_yn == "Y") {
											optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
													"</span></li>"
											).attr({ "data-value": "soldout" });
										}else{
											optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
													"<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+goods_no+"',vir_vend_no:'"+vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+opt_val_nm1+"'});\">입고알림신청</a></span></li>"
											).attr({ "data-value": "soldout" });
										}
									}
									optionObj.attr("data-set_cmps_item_no", this.SET_CMPS_ITEM_NO);
									//optionObj.attr("data-cmps_grp_seq", cmps_grp_seq);
									optionObj.attr("data-ga-tag", str_ga_tag + goods_nm+"_"+opt_val_nm1);
									optionObj.attr("data-item_show_nm",opt_val_nm1);
									opt.append(
											optionObj
									);
								});
								//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
								div.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
									var currObj = $(this);
									var opt_idx = $(this).parent().parent('.options').attr('data-index');
									var $li = $(this).parent();
									//var $hideTg = []; // hide & show Target   //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
									var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
									if(!$li.hasClass('sld_out')){
										//$hideTg[0] = $(this).parent().parent().parent().parent().parent().siblings('dd') //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
										//$hideTg[1] = $(this).parent().parent().parent().parent().parent().parent().siblings('dl, .set') //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
										$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
										$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
										$('.lyr_select').removeClass('on');
										$li.addClass('selected').siblings('li').removeClass('selected');
										showText($selBtn);
										//$($hideTg).each(function(){$(this).show()}) ;//NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
										
										elandmall.optLayerEvt.changeItem({
											param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:$("#goods_no").val(), reserv_yn: reserv_yn, cmps_grp_seq:cmps_grp_seq, event_layer_yn : event_layer_yn},
											div:div,
											chgObj:currObj,
											callback:function(result){
												
												var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
												var currVal = currObj.parent().attr("data-value");
												
												if(last_yn== "Y" && currVal != ""){
													if($(obj).attr("data-value") != ""){
														$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "Y");
														
													}else{
														$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "N");
													}
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", $(selectedOpt).attr("data-value"));
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", currObj.parent().attr("data-vir_vend_no"));
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", currVal);
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", currObj.parent().attr("data-set_cmps_item_no")); // <- 세트상품 구성단품번호
													
													//사은품이 있다면
													if($("#giftInfo").length > 0 ){ 
														if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
															if(elandmall.goodsDetail.checkSetGoodsChoice()){ 
																//마지막 옵션 선택 후, 사은품의 disabled 해제
																var param = elandmall.optLayerEvt.addSetGoodsParam();
																$("[id^=gift_slt]").parents(".lyr_select").removeClass("disabled");
																$("#gift_slt").data("itemInfo", param);
																
															}else{
																$("#gift_slt").attr("data-value");
																$("[id^=gift_slt]").parents(".lyr_select").addClass("disabled");
																$("#gift_slt").attr("data-itemInfo","");
															}
														}else{	//사은품이 1개일 때,
															if(elandmall.goodsDetail.checkSetGoodsChoice()){
																
																var param = elandmall.optLayerEvt.addSetGoodsParam();
																elandmall.optLayerEvt.getSetGoodsPrice({
																	param:param,
																	success:function(data){
																		elandmall.goodsDetail.drawAddGoods({
																			type:"SET",
																			data:data,
																			set_param:param,
																			gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
																			gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
																			gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
																		});
																		elandmall.goodsDetail.sumMultiTotal();
																		
																	}
																});
															}
															
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														if(elandmall.goodsDetail.checkSetGoodsChoice()){
															var param = elandmall.optLayerEvt.addSetGoodsParam();
															elandmall.optLayerEvt.getSetGoodsPrice({
																param:param,
																success:function(data){
																	elandmall.goodsDetail.drawAddGoods({
																		type:"SET",
																		data:data,
																		set_param:param
																	});
																	elandmall.goodsDetail.sumMultiTotal();
																	
																}
															});
															//alert("성공");
														}else{
															
														}
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
													
												}
												
											}//[END]callback function
										});//[END]elandmall.optLayerEvt.changeItem
									}
									
								});//[END] item select change event
								function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
									if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
										$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
									}
									else{
										$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
									}
								}
								_google_analytics();
								
							}
						});
						
					}
					
				}
			},//[END] 세트상품 구성품 변경
			//[START] 세트상품 구성품 변경(장바구니,마이페이지)
			changeSetGoodsOrigin : function(obj){

				var cmps_grp_seq = $(obj).data("cmps_grp_seq");
				var selectedOpt = $(obj).children("option:selected");
				var multi_yn = $(selectedOpt).data("multi_item_yn");	//구성품의 단품유무여부
				var div = $("[id^=setGrp"+cmps_grp_seq+"]");
				
				if($(obj).data("layer_yn") == "Y"){
					$("#cmps_goods_grp"+cmps_grp_seq).val($(obj).val());
				}else{
					$("#cmps_goods_grp"+cmps_grp_seq+"L").val($(obj).val());
				}
				$(div).children("ul").children("li:not([id^=li_cmps_goods_grp"+cmps_grp_seq+"])").remove();	//상품선택을 셀렉트를 제외한 나머지 삭제
				if(multi_yn != "Y"){ //구성품이 단품 없는 상품이라면, 
					
					//구성품 선택여부 변경 ==> 그룹 선택의 우선 순위가 없기 때문에..
					if($(obj).val() != ""){
						$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "Y");
					}else{
						$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "N");
					}
					$("#cmps_goods_grp"+cmps_grp_seq).data("goods_no", $(selectedOpt).val());
					$("#cmps_goods_grp"+cmps_grp_seq).data("vir_vend_no", $(selectedOpt).data("vir_vend_no"));
					$("#cmps_goods_grp"+cmps_grp_seq).data("item_no", $(selectedOpt).data("item_no"));
					$(obj).data("set_cmps_item_no", $(selectedOpt).data("set_cmps_item_no")); // <- 세트상품 구성단품번호

					
					if( $("#giftInfo").length > 0 ){
						if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
							if(elandmall.goodsDetail.checkSetGoodsChoice()){ 
								var param = elandmall.optLayerEvt.addSetGoodsParam();
							//마지막 옵션 선택 후, 사은품의 disabled 해제
								$("[id^=gift_slt]").prop("disabled", false);
								$("#gift_slt").data("itemInfo", param);
							
							}else{
								$("#gift_slt").val("");
								$("[id^=gift_slt]").prop("disabled", true);
								$("#gift_slt").attr("data-itemInfo","");
							}
						}else{	//사은품이 1개일 때,
							
							if(elandmall.goodsDetail.checkSetGoodsChoice()){

								var param = elandmall.optLayerEvt.addSetGoodsParam();
								elandmall.optLayerEvt.getSetGoodsPrice({
									param:param,
									success:function(data){
										elandmall.goodsDetail.drawAddGoods({
											type:"SET",
											data:data,
											set_param:param,
											gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
											gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
											gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
										});
										elandmall.goodsDetail.sumMultiTotal();
										
									}
								});
								
							}

						}
					}else{	//[START]사은품이 없을 때
						if(elandmall.goodsDetail.checkSetGoodsChoice()){
							var param = elandmall.optLayerEvt.addSetGoodsParam();
							elandmall.optLayerEvt.getSetGoodsPrice({
								param:param,
								success:function(data){
									elandmall.goodsDetail.drawAddGoodsOrigin({
										type:"SET",
										data:data,
										set_param:param
									});
									elandmall.goodsDetail.sumMultiTotal();
									
								}
							});
						}
					}//[END]사은품이 없을 때
					
				}else{ //단품 있는 상품일 때,
					
					elandmall.optLayerEvt.drawItemSelectOrigin({obj:obj});
					var goods_no = $(selectedOpt).val();
					var vir_vend_no = $(selectedOpt).data("vir_vend_no");
					var reserv_yn = "N";
					if($("#reserv_limit_divi_cd").val()== "10" || $("#reserv_limit_divi_cd").val()== "20"){
						reserv_yn = "Y";
					}
					elandmall.optLayerEvt.ajaxItemList({
						param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:$("#goods_no").val(), cmps_grp_seq:cmps_grp_seq , event_layer_yn : event_layer_yn},
						success:function(data){
							var opt = div.find("[id^=item_opt_nm1]");
							//var cmps_grp_seq = opt.data("cmps_grp_seq");
							var grp_nm = $("#setGrp"+cmps_grp_seq).children(".opt_box_title").text();
							$.each(data, function() {
								var item_no = this.ITEM_NO;
								var opt_val_nm1 = this.OPT_VAL_NM1;
								var sale_poss_qty = this.SALE_POSS_QTY;
								var goods_nm = this.GOODS_NM;
								var item_nm_add_info = this.ITEM_NM_ADD_INFO;
								if(typeof(item_nm_add_info) == "undefined"){
									item_nm_add_info = "";
								}
								
								var str_ga_tag = "";
								str_ga_tag +="PC_상품상세||" + grp_nm +"_" + opt.data("opt_nm") + "선택||";
								
								var optionObj = null;
								if(sale_poss_qty > 0){
									optionObj = $("<option>" + opt_val_nm1 + item_nm_add_info + "</option>").attr({ value: item_no });
								}else{
									optionObj = $("<option> (품절)" + opt_val_nm1 + item_nm_add_info + "</option>").attr({ value: "soldout" });
								}
								optionObj.attr("data-set_cmps_item_no", this.SET_CMPS_ITEM_NO);
								optionObj.attr("data-ga-tag", str_ga_tag + goods_nm+"_"+opt_val_nm1);
								optionObj.attr("data-item_show_nm",opt_val_nm1);
								opt.append(
									optionObj
								);
							});

							//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
							div.find("[id^=item_opt_nm]").change(function(){
								var currObj = $(this);
								var opt_idx = $(this).data("index");

								elandmall.optLayerEvt.changeItemOrigin({
									param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:$("#goods_no").val(), reserv_yn: reserv_yn, cmps_grp_seq:cmps_grp_seq , event_layer_yn : event_layer_yn },
									div:div,
									chgObj:currObj,
									callback:function(result){
										
										if(currObj.data("last")== "Y" && currObj.val() != ""){
											if($(obj).val() != ""){
												$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "Y");
												
											}else{
												$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "N");
											}
											$("#cmps_goods_grp"+cmps_grp_seq).data("goods_no", $(selectedOpt).val());
											$("#cmps_goods_grp"+cmps_grp_seq).data("vir_vend_no", $(selectedOpt).data("vir_vend_no"));
											$("#cmps_goods_grp"+cmps_grp_seq).data("item_no", currObj.val());
											$("#cmps_goods_grp"+cmps_grp_seq).data("set_cmps_item_no", $(currObj).children("option:selected").data("set_cmps_item_no")); // <- 세트상품 구성단품번호
											
											//사은품이 있다면
											if($("#giftInfo").length > 0 ){ 
												if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
													if(elandmall.goodsDetail.checkSetGoodsChoice()){ 
													//마지막 옵션 선택 후, 사은품의 disabled 해제
														var param = elandmall.optLayerEvt.addSetGoodsParam();
														$("[id^=gift_slt]").prop("disabled", false);
														$("#gift_slt").data("itemInfo", param);
													
													}else{
														$("#gift_slt").val("");
														$("[id^=gift_slt]").prop("disabled", true);
														$("#gift_slt").attr("data-itemInfo","");
													}
												}else{	//사은품이 1개일 때,
													if(elandmall.goodsDetail.checkSetGoodsChoice()){
														
														var param = elandmall.optLayerEvt.addSetGoodsParam();
														elandmall.optLayerEvt.getSetGoodsPrice({
															param:param,
															success:function(data){
																elandmall.goodsDetail.drawAddGoodsOrigin({
																	type:"SET",
																	data:data,
																	set_param:param,
																	gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
																	gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
																	gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
																});
																elandmall.goodsDetail.sumMultiTotal();
																
															}
														});
													}

												}
											}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
												if(elandmall.goodsDetail.checkSetGoodsChoice()){
													var param = elandmall.optLayerEvt.addSetGoodsParam();
													elandmall.optLayerEvt.getSetGoodsPrice({
														param:param,
														success:function(data){
															elandmall.goodsDetail.drawAddGoodsOrigin({
																type:"SET",
																data:data,
																set_param:param
															});
															elandmall.goodsDetail.sumMultiTotal();
															
														}
													});
													//alert("성공");
												}else{
													
												}
											}//[END]사은품이 없을 때 항목을 바로 추가 한다.
										
										}
										
									}//[END]callback function
								});//[END]elandmall.optLayerEvt.changeItem

							});//[END] item select change event
							
							_google_analytics();
							
						}
					});
					
				}
			},//[END] 세트상품 구성품 변경
			//[START] 세트상품 선택 체크
			checkSetGoodsChoice : function(){
				var changeFlag = true;
				$("[id^=cmps_goods_grp]", "#detailform").each(function(idx,obj){
					if($(obj).data("choice_yn") == "N"){
						changeFlag = false;
						return;
					}
				});
				return changeFlag;
			},//[END] 세트상품 선택 체크
			//[START] 묶음상품 구성 변경 이벤트
			changePkgCmpsGoods:function(p){
				var obj = p.obj;
				var selectedOpt = $(obj);
				var multi_yn = $(selectedOpt).attr("data-multi_item_yn");	//구성품의 단품유무여부
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")?p.quickview_yn:"N";
				var param ={};
				var objVal = $(selectedOpt).attr("data-value");
				var scope_div = null;
				if(typeof(quickview_yn) != "undefined" && quickview_yn == "Y" ){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}

				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
				
				//[ECJW-9] 옵션 불러오기 I/F 
				if( $(selectedOpt).attr("data-low_vend_type_cd") == "50" && $(selectedOpt).attr("data-deli_goods_divi_cd") == "30" ) {
					jwFlag = true;
				}else{
					jwFlag = false;
				}
				
				//주얼리 일반상품 
				if( $(selectedOpt).attr("data-low_vend_type_cd") == "50" && $(selectedOpt).attr("data-deli_goods_divi_cd") == "10" ) {
					jwNormalFlag = true;
				}else{
					jwNormalFlag = false;
				}
				
				var $li = $(obj).parent();
				if(!$li.hasClass('sld_out')){
					param["goods_no"] = objVal;
					param["vir_vend_no"] = $(selectedOpt).attr("data-vir_vend_no");
					param["quickview_yn"] = quickview_yn;

					
					//[ECJW-9] 옵션 불러오기 I/F 
					if(jwFlag){
						param["low_vend_type_cd"] = $(selectedOpt).attr("data-low_vend_type_cd");
						param["deli_goods_divi_cd"] = $(selectedOpt).attr("data-deli_goods_divi_cd");	
						param["styleCode"] = $(selectedOpt).attr("data-style_cd");
						param["brandCode"] = $(selectedOpt).attr("data-brand_cd");
					}
					
					
					if($(obj).data("layer_yn") == "Y"){
						$("#pkgCmpsGoods", scope_div).attr("data-value",$(selectedOpt).attr("data-value"));
						$("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn",multi_yn);
						$("#pkgCmpsGoods", scope_div).parent().addClass("selected");
						$("#pkgCmpsGoods", scope_div).text($(obj).children('.opt_name').text());
						$("#pkgCmpsGoods", scope_div).attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#pkgCmpsGoods", scope_div).attr("quickview_yn",quickview_yn);
						$("#pkgCmpsGoods", scope_div).attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
						$("#pkgCmpsGoods", scope_div).attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
						$("#pkgCmpsGoods", scope_div).attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
					}else{
						$("#pkgCmpsGoods_L", scope_div).attr("data-value",$(selectedOpt).attr("data-value"));
						$("#pkgCmpsGoods_L", scope_div).attr("data-multi_item_yn",multi_yn);
						$("#pkgCmpsGoods_L", scope_div).parent().addClass("selected");
						$("#pkgCmpsGoods_L", scope_div).text($(obj).children('.opt_name').text());
						$("#pkgCmpsGoods_L", scope_div).attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#pkgCmpsGoods_L", scope_div).attr("quickview_yn",quickview_yn);
						$("#pkgCmpsGoods_L", scope_div).attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
						$("#pkgCmpsGoods_L", scope_div).attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
						$("#pkgCmpsGoods_L", scope_div).attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
					}
					
					if(objVal != ""){		//선택된 값이 있을때만 실행.
						
						if(jwFlag || jwNormalFlag){
							if($(selectedOpt).attr('data-layer_yn') == "Y"){
								param["opt_layer_yn"] = "Y";
							}
						}
						
						elandmall.optLayerEvt.drawPkgCmpsGoodsSelect({
							param:param,
							success:function(rst){
								$("ul.add_selects", scope_div).children("li:not([id^=li_cmps_goods])").remove();	//상품선택 셀렉트를 제외한 나머지 삭제
								var html = rst;
								$("#ul_pkgCmpsGoods", scope_div).append(html);
								if($("#ul_pkgCmpsGoods_L", scope_div).length > 0){
									var layer_html = $.parseHTML(html);
									$("[id^=options_nm]", $(layer_html)).each(function(idx){
										$(this).attr({"id": $(this).attr("id")+"L","data-layer_yn":"Y"});
									});
									$(layer_html).each(function(idx){
										//alert($(this).attr("id")+"_L");
										if($(this).attr("id") == "giftInfo"){
											$(this).attr({"id": $(this).attr("id")+"_L"});
										}
										if($(this).attr("id") == "li_receive_choice"){
											$(this).attr({"id": $(this).attr("id")+"_L"});
										}
										if(jwNormalFlag && $(this).attr("id") == "branchInfoBox"){
											$(this).attr({"id": $(this).attr("id")+"_L"});
											var layer_low_html = $.parseHTML($(this).find('.how_get').html());
											$(layer_low_html).each(function(idx){
												if(typeof($(this).attr('id')) != "undefined"){
													$(this).attr({"id": $(this).attr("id")+"_L","data-layer_yn":"Y"});
												}else if(typeof($(this).attr('for')) != "undefined"){
													$(this).attr({"for": $(this).attr("for")+"_L"});
												}
											});
											$(this).find('.how_get').html(layer_low_html);
										}
									});
									$("select[id=gift_slt]", $()).each(function(idx){
										$(this).attr({"id": $(this).attr("id")+"_L", "data-layer_yn":"Y"});
									});
									$("[id=recev_slt]", $()).each(function(idx){
										$(this).attr({"id": $(this).attr("id")+"_L", "data-layer_yn":"Y"});
									});
									$("#ul_pkgCmpsGoods_L", scope_div).append(layer_html);
								}

								if(jwFlag){
									multi_yn = "Y";
								}
								
								if(multi_yn != 'Y'){
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-goods_no",$(selectedOpt).attr("data-value"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-multi_item_yn",multi_yn);
									
									var data = $("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).data("goods_info").goodsData;
									data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
									data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
									
									//사은품이 있을 때
									if( $("#giftInfo", scope_div).length > 0 ){
										if($("#giftInfo", scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
											if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){ 
												//마지막 옵션 선택 후, 사은품의 disabled 해제
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").removeClass("disabled");
												$("#gift_slt", scope_div).data("itemInfo", data);
												elandmall.goodsDetail.drawAddGoods({
													type:"PKG",
													quickview_yn:quickview_yn,
													data:data
												});
												
											}else{
												$("#gift_slt", scope_div).data("itemInfo", data);
											}
										}else{	//사은품이 1개일 때,
											$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
											if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
												param["item_no"] = "00000";
//											elandmall.optLayerEvt.getSetGoodsPrice({
												elandmall.optLayerEvt.getItemPrice({
													param:param,
													success:function(data){
														data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
														data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
														elandmall.goodsDetail.drawAddGoods({
															type:"PKG",
															quickview_yn:quickview_yn,
															data:data,
															gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
															gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
															gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
															
														});
//													elandmall.goodsDetail.sumMultiTotal(scope_div);
													}
												});
											}	
										}
									}else{	//[START]사은품이 없을 때
										$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
										if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
											
											elandmall.goodsDetail.drawAddGoods({
												type:"PKG",
												quickview_yn:quickview_yn,
												data:data
											});
											elandmall.goodsDetail.sumMultiTotal(scope_div);
											
										}else{
											$("#pkgCmpsGoods", scope_div).data("itemInfo", data);
										}
									}//[END]사은품이 없을 때
									$('.sel_btn.option').click(function () {
											
											if(!$(this).parent().hasClass('disabled')){
												if ($(this).parent().hasClass('on')){
													$(this).parent().removeClass('on');
												}
												else{
													var $optBox = $(this).parent().parent().parent().parent('.on_opt_box');
													if($optBox.hasClass('on_opt_box')){lyrMax($(this), $optBox)}
														$('.lyr_select').removeClass('on');
														$(this).parent().addClass('on');
												}
												
											if($(this).children().data('opt_nm') == calenderStr ){	
												elandmall.goodsDetail.fnSelectPkgBtn($(this), $(obj));
											}
											
										}
										
									});
									
								}else{	//옵션상품일 때,
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-goods_no",$(selectedOpt).attr("data-value"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
									$("[id^=pkgCmpsGoods]", scope_div).attr("data-multi_item_yn",multi_yn);
									$("[id^=pkgCmpsGoods]", scope_div).attr("quickview_yn", quickview_yn);
									
									var color_chip_val = + $("#item_opt_li_data").attr("data-color_mapp");
									var size_chip_val = + $("#item_opt_li_data").attr("data-size_mapp");
									var color_yn_val = "N";
									if(color_chip_val == 1){
										color_yn_val = "Y";
									}
									

									//[ECJW-9] 옵션 불러오기 I/F 
									var juOptCd = "";
									if(jwFlag){
										var opt = scope_div.find("[id^=options_nm1]");
										juOptCd = opt.parents(".lyr_select").find(".sel_txt").data("opt_cd");
									}else{
										juOptCd = "";	
									}
									
									
									elandmall.optLayerEvt.ajaxItemList({	//첫번째 옵션 가져오기
										
										//[ECJW-9] 옵션 불러오기 I/F 
										param:{ styleCode: $(selectedOpt).attr("data-style_cd"), goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).attr("data-vir_vend_no"), optionCode : juOptCd, low_vend_type_cd: $(selectedOpt).attr("data-low_vend_type_cd"), deli_goods_divi_cd: $(selectedOpt).attr("data-deli_goods_divi_cd"), pkg_goods_yn:"Y", pkg_goods_no:$("#goods_no",scope_div).val(), color_yn:color_yn_val , event_layer_yn: event_layer_yn},
										
										success:function(data){
											if(color_chip_val == 1){
												elandmall.goodsDetail.drawColorChipHtml({data:data, curr_opt_idx:1, quickview_yn:quickview_yn, pkgGoods:"Y"});
											}
											if(size_chip_val == 2){
												elandmall.goodsDetail.drawSizeChipHtmlInit({data:data, curr_opt_idx:1, quickview_yn:quickview_yn, pkgGoods:"Y"});
											}
											
											var opt = scope_div.find("[id^=options_nm1]");
											var $selBtn =opt.parents('.lyr_select').children('.sel_btn');
											
											if(opt.attr("data-opt_cd") == "SI"){
												opt.parents('.lyr_select').addClass('hasDefault ');
											}
											
											$.each(data, function(idx) {
												var item_no = this.ITEM_NO;
												var opt_val_nm1 = this.OPT_VAL_NM1;

												//[ECJW-9] 옵션 불러오기 I/F 
												var opt_val_cd1 = "";
												if(jwFlag){
													opt_val_cd1 = this.OPT_VAL_CD1;
												}
												
												
												var sale_poss_qty= this.SALE_POSS_QTY;
												var goods_nm = this.GOODS_NM;
												var item_nm_add_info = this.ITEM_NM_ADD_INFO;
												var item_sale_price = this.ITEM_SALE_PRICE;
												var goods_sale_price = this.GOODS_SALE_PRICE;
												var vir_val_nm1 = $(selectedOpt).data("vir_vend_no");
												var min_sale_price   = this.MIN_SALE_PRICE;
												var low_price_cnt    = Number(this.CNT);
												var price_str		="";
												var sap_item_cd 	 = this.SAP_ITEM_CD;
												
												if(typeof(item_nm_add_info) == "undefined"){
													item_nm_add_info = "";
												}
												
												
												if (  item_sale_price > -1 && $("#option_low_vend_type_cd").val() != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
												var str_ga_tag = "";
												str_ga_tag +="PC_상품상세||묶음상세_"+opt.data("opt_nm")+"선택||";
												
												
												if( opt.data("opt_nm") == calenderStr){
													
													
													if(low_price_cnt > 1){
														item_sale_price = elandmall.util.toCurrency(min_sale_price);
														price_str = "원~";
													}else{
														item_sale_price = elandmall.util.toCurrency(min_sale_price);
														price_str = "원";
													}
													
													
													var obj = {
																item_no 				: item_no
																, data_ga_tag 			: str_ga_tag + goods_nm+"_"+opt_val_nm1
																, data_vir_vend_no		: vir_vend_no
																, data_item_show_nm 	: opt_val_nm1
																, data_cancle_poss_yn 	: ""
																, opt_val_nm			: opt_val_nm1
																, sale_poss_qty			: sale_poss_qty
																, item_sale_price		: item_sale_price
																, price_str				: price_str
															};
													
													calenderDataList.push(obj);
												}else{
													
													if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
														item_sale_price="";
													}
													var optionObj = null;
													
													//[ECJW-9] 옵션 불러오기 I/F START
													if(jwFlag){
														if(opt.attr("data-opt_cd") == "SI" && idx == (Math.floor(data.length/2))-1 ){
															optionObj = $("<li><span class='ancor dVal'><span class='opt_name'>"+opt_val_nm1+"</span></li>").attr({ "data-code": opt_val_cd1 });
														}else{
															optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span></li>").attr({ "data-code": opt_val_cd1 });	
														}
													}else{
														
														if(sale_poss_qty > 0){
															//optionObj = $("<li><span class='ancor' onclick='elandmall.goodsDetail.fnSelectPkgItem({obj:this})'><span class='opt_name'>"+opt_val_nm1+"</span>"+
															optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
																	"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
															).attr({ "data-value": item_no, "data-sap_item_cd" : sap_item_cd });
														}else{
															if(event_layer_yn == "Y") {
																optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
																		"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
																		"</span></li>"
																).attr({ "data-value": "soldout" });
															}else{
																optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
																		"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
																		"<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+$(selectedOpt).attr("data-value")+"',vir_vend_no:'"+$(selectedOpt).data("vir_vend_no")+"',item_no:'"+item_no+"',item_nm:'"+opt_val_nm1+"'});\">입고알림신청</a></span></li>"
																).attr({ "data-value": "soldout" });
															}
														}
														
													}
													//[ECJW-9] 옵션 불러오기 I/F  END
													
													optionObj.attr("data-ga-tag", str_ga_tag + goods_nm+"_"+opt_val_nm1);
													optionObj.attr("data-item_show_nm",opt_val_nm1);
													
													opt.append(
															optionObj
													);
													
													
												}
												
												
											});
											$('.sel_btn.option').click(function () {
													
													if(!$(this).parent().hasClass('disabled')){
														if ($(this).parent().hasClass('on')){
															$(this).parent().removeClass('on');
														}
														else{
															var $optBox = $(this).parent().parent().parent().parent('.on_opt_box');
															if($optBox.hasClass('on_opt_box')){lyrMax($(this), $optBox)}
															$('.lyr_select').removeClass('on');
															$(this).parent().addClass('on');
															if($(this).parent().hasClass('hasDefault') && !$(this).hasClass('selected'))  { //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤 //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
																var $li = $(this).parent().parent();
																commonUI.view.lyrSlt.prototype.goToDft($li);
															}
														}
													}
													
													if($(this).children().data('opt_nm') == calenderStr ){	
														elandmall.goodsDetail.fnSelectPkgBtn($(this), $(obj));
													}
												 
											});
											$(".chk_out1").click(function(){
												if($(this).is(':checked')){
													$(this).parent().siblings('ul').children('.sld_out').hide();
												}else{
													$(this).parent().siblings('ul').children('.sld_out').show();
												}
												
											});
											//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
											scope_div.find('.lyr_options .options li .ancor').click(function(){
												
												//[ECJW-9] 옵션 불러오기 I/F 
												if(jwFlag){
													if(typeof($(this).attr('data-value')) != "undefined"){
														return;
													}
												}
												
												var field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
												var present_yn = $("#item_opt_li_data").attr('data-present_yn');
												var currObj = $(this);
												var opt_idx = $(this).parents('.options').data('index');
												var $li = $(this).parent();
												var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
												if(!$li.hasClass('sld_out')){
													$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
													$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
													
													//[ECJW-9] 옵션 불러오기 I/F 
													$selBtn.find('.sel_txt').attr('data-sel-cd', currObj.parent().data('code'));
													$selBtn.find('.sel_txt').attr("data-sap_item_cd",currObj.parent().attr("data-sap_item_cd"));
													
													$selBtn.find('.sel_txt').attr('data-value',currObj.parent().attr("data-value"));
													$('.lyr_select').removeClass('on');
													$li.addClass('selected').siblings('li').removeClass('selected');
													//NGCPO-6522 조건 추가 제거
													//if( !(parseInt($li.find('.ancor').attr('data-disp_seq')) > 1 && $li.find('.ancor').attr('data-multi_item_yn') != "Y") ){
														showText($selBtn);
													//}
													elandmall.optLayerEvt.changeItem({
														//[ECJW-9] 옵션 불러오기 I/F 
														param: { styleCode: $(selectedOpt).attr("data-style_cd"), goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:$("#goods_no", scope_div).val(), jwFlag:jwFlag, low_vend_type_cd : $(selectedOpt).attr("data-low_vend_type_cd"), deli_goods_divi_cd: $(selectedOpt).attr("data-deli_goods_divi_cd"), event_layer_yn : event_layer_yn},
														
														color_chip_val: color_chip_val,
														color_chip_yn:"Y",
														div:scope_div,
														chgObj:$(this),
														callback_ajax:function(result){
															calenderDataList = result.calenderDataList;
															if(color_chip_val > result.curr_idx){
																$("#ul_pkgCmpsGoods").find("#colorChipDiv").hide();
																$("#ul_pkgCmpsGoods").find("#sizeChipInitDiv").hide();
																$("#ul_pkgCmpsGoods").find("#sizeChipDiv").hide();
															}
															if(color_chip_val == result.next_idx){
																elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"Y"});
															}
															if(size_chip_val == result.next_idx){
																elandmall.goodsDetail.drawSizeChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"Y"});
															}
														},
														callback:function(result){
															var param = { goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no")};
															param["curr_idx"] = opt_idx;
															var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
															//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
															var currVal = currObj.parent().attr("data-value");
															$("#last_item_no").val(currVal);
															$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
															
															
															if(jwFlag){
																var opt = scope_div.find("[id^=options_nm"+(opt_idx+1)+"]");
																var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
																
																if(next_cd == "" || typeof(next_cd) == "undefined" && field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && present_yn == "Y"){
																	$("li[name=branchInfoBox]").show();
																}else{
																	
																	if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
																		if($(selectedOpt).attr("data-low_vend_type_cd") == "40" || $(selectedOpt).attr("data-low_vend_type_cd") == "50"){
																			param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
																		}
																		param["item_no"] = currVal;
																		//사은품이 있다면
																		if($("#giftInfo", scope_div).length > 0 ){ 
																			if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
																					itemParam[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																					itemParam[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																					elandmall.optLayerEvt.getItemPrice({
																						param:itemParam,
																						success:function(data){
																							elandmall.goodsDetail.drawAddGoods({
																								type:"PKG",
																								data:data,
																								gift_nm:itemParam["gift_nm"],
																								gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																								gift_stock_qty:itemParam["gift_stock_qty"]
																							});
																						}
																					});
																				}else{
																					//마지막 옵션 선택 후, 사은품의 disabled 해제
																					$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
																					param["disp_seq"] = $(selectedOpt).data("disp_seq");
																					param["vend_nm"] = $(selectedOpt).data("vend_nm");
																					$("#gift_slt", scope_div).data("itemInfo", param);
																				}
																			}else{	//사은품이 1개일 때,
																				$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
																					param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
																					param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value");
																					elandmall.optLayerEvt.getItemPrice({
																						param:param,
																						success:function(data){
																							data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																							data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																							
																							elandmall.goodsDetail.drawAddGoods({
																								type:"PKG",
																								quickview_yn:quickview_yn,
																								data:data,
																								gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																								gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr('data-value'),
																								gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
																							});
																						}
																					});
																				}
																			}
																		}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
																			
																			$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
																			if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																				param["GOODS_NM"] = $("#pkg_goods_nm").val();
																				param["vir_vend_no"] = vir_vend_no;
																				param["layer_yn"] = currObj.parent().parent().attr('data-layer_yn');
																				param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
																				param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
																				
																				elandmall.goodsDetail.jwGoodsAddParam({
																					param:param,
																				});
																			}else{
																				param["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
																				param["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
																				$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
																			}
																		}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																	}else{
																		//마지막옵션이 아니거나 값이 선택되지 않았을 때,
																		if(currObj.data("last") == "Y" && currObj.attr("data-value") == ""){
																			if($("#gift_slt", scope_div).length > 0){
																				$("#gift_slt", scope_div).attr("data-value","");
																				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
																				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																				$("#gift_slt", scope_div).data("itemInfo", param);
																			}else{
																				$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
																			}
																		}
																	}
																}
															}else{
																
																if(jwNormalFlag && (field_recev_poss_yn == "Y" || present_yn == "Y")){
																	if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
																		if($(selectedOpt).attr("data-low_vend_type_cd") == "40" || $(selectedOpt).attr("data-low_vend_type_cd") == "50"){
																			param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
																		}
																		param["item_no"] = currVal;
																		//사은품이 있다면
																		if($("#giftInfo", scope_div).length > 0 ){ 
																			if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
																					itemParam[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																					itemParam[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																					elandmall.optLayerEvt.getItemPrice({
																						param:itemParam,
																						success:function(data){
																							elandmall.goodsDetail.drawAddGoods({
																								type:"PKG",
																								data:data,
																								gift_nm:itemParam["gift_nm"],
																								gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																								gift_stock_qty:itemParam["gift_stock_qty"]
																							});
																						}
																					});
																				}else{
																					//마지막 옵션 선택 후, 사은품의 disabled 해제
																					$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
																					param["disp_seq"] = $(selectedOpt).data("disp_seq");
																					param["vend_nm"] = $(selectedOpt).data("vend_nm");
																					$("#gift_slt", scope_div).data("itemInfo", param);
																				}
																			}else{	//사은품이 1개일 때,
																				$("li[name=branchInfoBox]").show();
																			}
																		}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
																			$("li[name=branchInfoBox]").show();
																		}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																	}else{
																		//마지막옵션이 아니거나 값이 선택되지 않았을 때,
																		if(currObj.data("last") == "Y" && currObj.attr("data-value") == ""){
																			if($("#gift_slt", scope_div).length > 0){
																				$("#gift_slt", scope_div).attr("data-value","");
																				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
																				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																				$("#gift_slt", scope_div).data("itemInfo", param);
																			}else{
																				$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
																			}
																		}
																	}
																	
																}else{

																	if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
																		if($(selectedOpt).attr("data-low_vend_type_cd") == "40" || $(selectedOpt).attr("data-low_vend_type_cd") == "50"){
																			param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
																		}
																		param["item_no"] = currVal;
																		//사은품이 있다면
																		if($("#giftInfo", scope_div).length > 0 ){ 
																			if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
																					itemParam[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																					itemParam[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																					elandmall.optLayerEvt.getItemPrice({
																						param:itemParam,
																						success:function(data){
																							elandmall.goodsDetail.drawAddGoods({
																								type:"PKG",
																								data:data,
																								gift_nm:itemParam["gift_nm"],
																								gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																								gift_stock_qty:itemParam["gift_stock_qty"]
																							});
																						}
																					});
																				}else{
																					//마지막 옵션 선택 후, 사은품의 disabled 해제
																					$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
																					param["disp_seq"] = $(selectedOpt).data("disp_seq");
																					param["vend_nm"] = $(selectedOpt).data("vend_nm");
																					$("#gift_slt", scope_div).data("itemInfo", param);
																				}
																			}else{	//사은품이 1개일 때,
																				$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
																					param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
																					param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value");
																					elandmall.optLayerEvt.getItemPrice({
																						param:param,
																						success:function(data){
																							data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																							data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																							
																							elandmall.goodsDetail.drawAddGoods({
																								type:"PKG",
																								quickview_yn:quickview_yn,
																								data:data,
																								gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																								gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr('data-value'),
																								gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
																							});
																						}
																					});
																				}
																			}
																		}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
																			$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
																			if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																				elandmall.optLayerEvt.getItemPrice({
																					param:param,
																					success:function(data){
																						data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																						data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																						
																						elandmall.goodsDetail.drawAddGoods({
																							type:"PKG",
																							quickview_yn:quickview_yn,
																							data:data
																						});
																					}
																				});
																			}else{
																				param["disp_seq"] = $(selectedOpt).data("disp_seq");
																				param["vend_nm"] = $(selectedOpt).data("vend_nm");
																				$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
																			}
																			
																		}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																	}else{
																		//마지막옵션이 아니거나 값이 선택되지 않았을 때,
																		if(currObj.data("last") == "Y" && currObj.attr("data-value") == ""){
																			if($("#gift_slt", scope_div).length > 0){
																				$("#gift_slt", scope_div).attr("data-value","");
																				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
																				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																				$("#gift_slt", scope_div).data("itemInfo", param);
																			}else{
																				$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
																			}
																		}
																	}
																}
															}
														}
													});
												}
												function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
													if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
														$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
													}
													else{
														$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
													}
												}
											});
											//[END] item select change event 
											
										}
									});
								}
								elandmall.goodsDetail.sumMultiTotal(scope_div);
								_google_analytics();
							}
						});
						
					}else{	//빈 값이 선택된다면 초기화를 한다.
						$("#pkgCmpsGoods").attr("data-choice_yn", "N");
						$("#pkgCmpsGoods").attr("data-itemInfo","");
					}
				}
				function lyrMax($selBtn, $optBox){ // 하단 샐링 포인트의 경우 최대 높이값 유동 조절
					$selBtn.siblings('.lyr_options').css({display:'block', visibility:'hidden'});
					var $optLyr = $selBtn.siblings('.lyr_options').find('.options');
					var maxHeight = $optBox.outerHeight() - ( $optLyr.offset().top - $optBox.offset().top) - 25;
					$selBtn.siblings('.lyr_options').removeAttr('style');
					$optLyr.css('max-height', maxHeight)
				}
			},//[END] 묶음상품 구성 변경 이벤트

			checkPkgGoodsChoice:function(scope_div){
				var check_flag = true;
				if($("#pkgCmpsGoods", scope_div).attr("data-choice_yn") != "Y"){
					check_flag = false;
					return check_flag;
				}
				
				if($("#li_receive_choice", scope_div).length > 0){
					if($("#recev_slt", $("#li_receive_choice",scope_div)).attr("data-choice_yn") != "Y"){
						check_flag = false;
						return check_flag;
					}
					
				}
				
				return check_flag;
				
			},
			
			initSelectsBoxJw:function(scope_div){
				if($("#goods_type_cd", scope_div).val() != "80" ){
					var itemOptNm1 = $.type($("#item_opt_nm1", scope_div).data("opt_nm")) != "undefined" ? $("#item_opt_nm1", scope_div).data("opt_nm") : $("#item_opt_nm1L", scope_div).data("opt_nm") ;
					$("[id^=item_opt_nm1]", scope_div).attr("data-value","");
					$("[id^=item_opt_nm1]", scope_div).attr("data-org-msg",itemOptNm1+" 옵션을 선택해 주세요.");
					$("[id^=item_opt_nm1]", scope_div).attr("data-sel-msg","");
					$("[id^=item_opt_nm1]", scope_div).parents('.sel_btn').removeClass('selected');
					$("[id^=item_opt_nm1]", scope_div).text(itemOptNm1+" 옵션을 선택해 주세요.");
					$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
						$(lDiv).children('li').removeClass("selected");
					});
					var low_div = scope_div.find("[id^=options_nm]");
					var first_idx = 1;
					$.each(low_div, function(idx, lDiv) {
						if($(lDiv).data("index") != first_idx){
							$(lDiv).children().remove();
							$(lDiv).parents('.lyr_select').children('.sel_btn').removeClass('selected');
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').text('상위 옵션을 선택해 주세요.');
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
							$(lDiv).parents('.lyr_select').removeClass('on');
							if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
								$(lDiv).parents('.lyr_select').addClass('disabled');
							};
							$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
							$("#sizeChipDiv").hide();
							if($("#color_mapp_option").val() == 1){
								$("#sizeChipInitDiv").show();
							}
						};
					});
					var del_opt_msg  = $("[id^=item_opt_nm]");
					$.each(low_div, function(idx, opt_msg) {
						$(opt_msg).attr("data-sel-msg","");
					});
					
				}else if($("#goods_type_cd", scope_div).val() == "80"){ 
					
					$("[id^=pkgCmpsGoods]", scope_div).parent().removeClass('selected');
					$("[id^=pkgCmpsGoods]", scope_div).text("상품을 선택해주세요.");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-org-msg","상품을 선택해주세요.");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-sel-msg","");
					$("[id^=pkgCmpsGoods]", scope_div).removeData("disp_seq");
					$("[id^=pkgCmpsGoods]", scope_div).removeData("vend_nm");
					$("[id^=pkgCmpsGoods]", scope_div).removeData("goods_no");
					$("[id^=pkgCmpsGoods]", scope_div).removeData("vir_vend_no");
					$("[id^=pkgCmpsGoods]", scope_div).removeData("multi_item_yn");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-disp_seq","");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-vend_nm","");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-goods_no","");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-vir_vend_no","");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-multi_item_yn","");
					$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn","N");
					var low_div =$("[id^=li_cmps_goods]");
					$.each(low_div, function(idx, lDiv) {
						$(lDiv).siblings('li').remove();
					});
					$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
						$(lDiv).children('li').removeClass("selected");
					});
					
				}
				
				
			},
			
			
			
			
			
			
			
			initSelectsBox:function(scope_div){
				if($("#multi_item_yn", scope_div).val() == "Y" ){
					var itemOptNm1 = $.type($("#item_opt_nm1", scope_div).data("opt_nm")) != "undefined" ? $("#item_opt_nm1", scope_div).data("opt_nm") : $("#item_opt_nm1L", scope_div).data("opt_nm") ;
					$("[id^=item_opt_nm1]", scope_div).attr("data-value","");
					$("[id^=item_opt_nm1]", scope_div).attr("data-org-msg",itemOptNm1+" 옵션을 선택해 주세요.");
					$("[id^=item_opt_nm1]", scope_div).attr("data-sel-msg","");
					$("[id^=item_opt_nm1]", scope_div).parents('.sel_btn').removeClass('selected');
					$("[id^=item_opt_nm1]", scope_div).text(itemOptNm1+" 옵션을 선택해 주세요.");
					$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
						$(lDiv).children('li').removeClass("selected");
						$(lDiv).attr('data-item_show_nm', '');
						
					});
					var low_div = scope_div.find("[id^=options_nm]");
					var first_idx = 1;
					$.each(low_div, function(idx, lDiv) {
						if($(lDiv).data("index") != first_idx){
							$(lDiv).children().remove();
							$(lDiv).parents('.lyr_select').children('.sel_btn').removeClass('selected');
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').text('상위 옵션을 선택해 주세요.');
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
							$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
							
							if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
								$(lDiv).parents('.lyr_select').addClass('disabled');
							};
							$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
							$("#sizeChipDiv").hide();
							if($("#color_mapp_option").val() == 1){
								$("#sizeChipInitDiv").show();
							}
						};
					});
					var del_opt_msg  = $("[id^=item_opt_nm]");
					$.each(low_div, function(idx, opt_msg) {
						$(opt_msg).attr("data-sel-msg","");
					});
					
				}else{
					if($("#goods_cmps_divi_cd", scope_div).val() == "20"){
						$("[id^=cmps_goods_grp]", scope_div).each(function(idx){
							$(this).attr("data-value","");
							$(this).parent().removeClass('selected');
							$(this).attr("data-org-msg","상품 선택");
							$(this).attr("data-sel-msg","");
							$(this).text("상품 선택");
							$(this).attr("data-sel-msg","");
							$(this).data("choice_yn","N");
						});
						$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
							$(lDiv).children('li').removeClass("selected");
						});
						var low_div = $("[id^=li_cmps_goods_grp]");
						$.each(low_div, function(idx, lDiv) {
							$(lDiv).siblings('li').remove();
						});
					}else if($("#goods_type_cd", scope_div).val() == "80"){
						$("[id^=pkgCmpsGoods]", scope_div).parent().removeClass('selected');
						$("[id^=pkgCmpsGoods]", scope_div).text("상품을 선택해주세요.");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-org-msg","상품을 선택해주세요.");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-sel-msg","");
						$("[id^=pkgCmpsGoods]", scope_div).removeData("disp_seq");
						$("[id^=pkgCmpsGoods]", scope_div).removeData("vend_nm");
						$("[id^=pkgCmpsGoods]", scope_div).removeData("goods_no");
						$("[id^=pkgCmpsGoods]", scope_div).removeData("vir_vend_no");
						$("[id^=pkgCmpsGoods]", scope_div).removeData("multi_item_yn");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-disp_seq","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-vend_nm","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-goods_no","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-vir_vend_no","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-multi_item_yn","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn","N");
						var low_div =$("[id^=li_cmps_goods]");
						$.each(low_div, function(idx, lDiv) {
							$(lDiv).siblings('li').remove();
						});
						$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
							if(idx==0){
                                $(lDiv).children('li').removeClass("selected");	
                            }	
						});
						
					}
				}
				if($("[id^=gift_slt]", scope_div).length>0){
					$("[id^=gift_slt]", scope_div).attr("data-value","");
					$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
					$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
					$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
					$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
				}
				if($("#recev_slt", scope_div).length > 0){
					$("#recev_slt", scope_div).attr("data-value","");
					$("#recev_slt", scope_div).attr("data-choice_yn","N");
					$("#recev_slt", scope_div).attr("data-sel-msg","");
					$("#recev_slt", scope_div).parent().removeClass('selected');
					$("#recev_slt", scope_div).text("수령 방법을 선택하세요.");
					$("#recev_slt", scope_div).change();
				}
				
				
				//날짜캘린더만 유효시 데이터 조회
				var calendarChk = false;
				
				for(var i=0; i<scope_div.find('span[class = "sel_txt"]').length; i++){
					if(scope_div.find('span[class = "sel_txt"]').eq(i).data("opt_nm") == calenderStr){
						calendarChk = true;
						break;
					}
				}
				
				
				if(calendarChk){
					var p = $.extend({ goods_no: $("#detailform", scope_div).data("goods_no"), item_no: "", vir_vend_no: $("#detailform", scope_div).data("vir_vend_no"),low_vend_type_cd:$("#detailform", scope_div).data("low_vend_type_cd"), quickview_yn:"N" }, p || {});
					
					var quickview_yn = p.quickview_yn;
					var div = null;
					if(quickview_yn == "Y"){
						div = $("#quick_view_layer");
						
					}else{
						div = $(".goods_wrap");
					}
					
					var color_chip_val = +$("#color_mapp_option").val();
					var size_chip_val = +$("#size_mapp_option").val();
					
					if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){	// 예약일 때,
						p["reserv_yn"] = "Y";
					}else{
						p["reserv_yn"] = "N";
					}
					
					
					var first_param = p;
					if(color_chip_val == 1){
						first_param["color_yn"] = "Y";
					}
					
					var lastCalendarData  = new Array();

					elandmall.optLayerEvt.ajaxItemList({
						param:first_param,    //{ goods_no: p.goods_no, vir_vend_no: p.vir_vend_no},
						success:function(data){
							var opt = div.find("[id^=options_nm1]");
							
							$.each(data, function() {
								
								var item_no = this.ITEM_NO;
								var opt_val_nm1 = this.OPT_VAL_NM1;
								var sale_poss_qty = this.SALE_POSS_QTY;
								var vir_vend_no = this.VIR_VEND_NO;
								
								var goods_nm = this.GOODS_NM;
								var optionObj = null;
								var str_ga_tag = "";
								var cancle_poss_yn = this.CANCLE_POSS_YN;
								var item_nm_add_info = this.ITEM_NM_ADD_INFO;
								var item_sale_price = this.ITEM_SALE_PRICE;
								var goods_sale_price = this.GOODS_SALE_PRICE;
								var min_sale_price   = this.MIN_SALE_PRICE;
								var low_price_cnt    = Number(this.CNT);
								var price_str		="";
								
								if(typeof(item_nm_add_info) == "undefined"){
									item_nm_add_info = "";
								}
								
								str_ga_tag = "PC_상품상세||";
								if(first_param.set_goods_yn == "Y"){
									
								}else{
									str_ga_tag +="상세일반_"+opt.data("opt_nm")+"선택||";
								}
								
								
								/* 20170207 false처리*/
								if (  item_sale_price > -1 && $("#option_low_vend_type_cd").val() != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
								
								
									
									if(low_price_cnt > 1){
										item_sale_price = elandmall.util.toCurrency(min_sale_price);
										price_str = "원~";
									}else{
										item_sale_price = elandmall.util.toCurrency(min_sale_price);
										price_str = "원";
									}
									
									if(typeof(cancle_poss_yn) != "undefined" && cancle_poss_yn != ""){
										
										var obj = {
												item_no 				: item_no
												, data_ga_tag 			: str_ga_tag + goods_nm+"_"+opt_val_nm1
												, data_vir_vend_no		: vir_vend_no
												, data_item_show_nm 	: opt_val_nm1
												, data_cancle_poss_yn 	: cancle_poss_yn
												, opt_val_nm			: opt_val_nm1
												, sale_poss_qty			: sale_poss_qty
												, item_sale_price		: item_sale_price
												, price_str				: price_str
											};
									}else{
									
										var obj = {
												item_no 				: item_no
												, data_ga_tag 			: str_ga_tag + goods_nm+"_"+opt_val_nm1
												, data_vir_vend_no		: vir_vend_no
												, data_item_show_nm 	: opt_val_nm1
												, data_cancle_poss_yn 	: ""
												, opt_val_nm			: opt_val_nm1
												, sale_poss_qty			: sale_poss_qty
												, item_sale_price		: item_sale_price
												, price_str				: price_str
											};
									}
									
									calenderDataList.push(obj);
							});
						}
					});
				
				}
				
				
			},
			
			//쥬얼리 가격조회 전 파라미터 담기 
			jwGoodsAddParam : function(pin){
				var obj = pin.param.obj;
				var layer_yn = (typeof(pin.param.layer_yn) != "undefined")? pin.param.layer_yn:"N";
				var type = "";
				if($("#goods_type_cd").val() == "80"){
					type = "PKG";
				}else{
					type = "DEF";
				}
				
				var quickview_yn = (typeof(pin.param.quickview_yn) != "undefined")? pin.param.quickview_yn:"N";
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				
				var carve_code = "";
				
				if(pin.param.carve_code == "" || typeof(pin.param.carve_code) == "undefined" ){
					carve_code = $(obj).parents('.add_selects').children('li[id="li_id_carve"]').find('.selected').children('.sel_txt').attr('data-code');
				}else{
					carve_code = pin.param.carve_code;
				}
				 
				var field_rece_poss_yn = "";
				var present_yn = "";
				var opt_cd = "";
				var code = "";
				var total_optCd = pin.param.goods_no;
				var total_optNm = "";
				
				
				//[ECJW-9] 옵션 불러오기 I/F 
				if(type == "PKG"){
					
					set_brandCode = pin.param.brandCode;
					set_styleCode = pin.param.styleCode;
					field_rece_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
					present_yn = $("#item_opt_li_data").attr('data-present_yn');
					
					var ul_pkgCmpsGoods = "";
					if(layer_yn == "Y"){
						ul_pkgCmpsGoods = $("#ul_pkgCmpsGoods_L");
					}else{
						ul_pkgCmpsGoods = $("#ul_pkgCmpsGoods");
					}
					
					pin.param["vir_vend_no"] = scope_div.find('.selected').children('.sel_txt').attr('data-vir_vend_no');
					
					var jsonData ={};
					for(var i=0; i < ul_pkgCmpsGoods.find('li[name=jw_opt_select]').length; i++){
						var count = Number(i+1);
						if(typeof(ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).attr('data-sel-cd')) != "undefined"){
							
							opt_cd = ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).attr('data-opt_cd');	
							code = ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).attr('data-sel-cd');	
							
							
							if(carve_code != "" || typeof(carve_code) != "undefined"){
								
								if(code == "" || code == "XXXX"){
									continue;
								}else{
									if(carve_code != "XXXX" && code == "ISOS"){
										jsonData["IS"] = $("#in_carve").val();
										jsonData["OS"] = $("#out_carve").val();
									}else if(carve_code != "XXXX" && code == "OSIS"){
										jsonData["OS"] = $("#out_carve").val();
										jsonData["IS"] = $("#in_carve").val();
									}else if(carve_code != "XXXX" && code == "IS"){
										jsonData["IS"] = $("#in_carve").val();
									}else if(carve_code != "XXXX" && code == "OS"){
										jsonData["OS"] = $("#out_carve").val();
									}else{
										
										jsonData[opt_cd]=code;
										total_optCd += opt_cd+code;
										if(total_optNm == ""){
											total_optNm = ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
										}else{
											total_optNm += "/" + ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
										}
									}
								}
								
							}else{
								
								jsonData[opt_cd]=code;
								total_optCd += opt_cd+code;
								
								if(total_optNm == ""){
									total_optNm = ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
								}else{
									total_optNm += "/" + ul_pkgCmpsGoods.find('li[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
								}
							}
						}
					}
					
				}else{
					field_rece_poss_yn = $(obj).parents('.add_selects').find('.options').attr('data-field_recev_poss_yn');
					present_yn = $(obj).parents('.add_selects').find('.options').attr('data-present_yn');
					var select_opt_length = "";
					
					if(layer_yn == "Y"){
						select_opt_length = scope_div.find('#gd_float_opt_fix').find('li[name=jw_opt_select]').length; //플로팅 옵션일때
					}else{
						select_opt_length = scope_div.find('.goods_detail_txt').find('li[name=jw_opt_select]').length;
					}
					
					
					var jsonData ={};
					
					for(var i=0; i < select_opt_length; i++){
						var count = Number(i+1);
						
						
						if(layer_yn == "Y"){
							
							if(typeof($("#item_opt_nm"+count+"L").attr('data-sel-cd')) != "undefined"){
								
								opt_cd = $("#item_opt_nm"+count+"L").attr('data-opt_cd');	
								code = $("#item_opt_nm"+count+"L").attr('data-sel-cd');	
								
								if(carve_code != "" || typeof(carve_code) != "undefined"){
									
									if(code == "" || code == "XXXX"){
										continue;
									}else{
										if(carve_code != "XXXX" && code == "ISOS"){
											jsonData["IS"] = $("#in_carve").val();
											jsonData["OS"] = $("#out_carve").val();
										}else if(carve_code != "XXXX" && code == "OSIS"){
											jsonData["OS"] = $("#out_carve").val();
											jsonData["IS"] = $("#in_carve").val();
										}else if(carve_code != "XXXX" && code == "IS"){
											jsonData["IS"] = $("#in_carve").val();
										}else if(carve_code != "XXXX" && code == "OS"){
											jsonData["OS"] = $("#out_carve").val();
										}else{
											
											jsonData[opt_cd]=code;
											total_optCd += opt_cd+code;
											if(total_optNm == ""){
												total_optNm = $("#item_opt_nm"+count+"L").text();
											}else{
												total_optNm += "/" + $("#item_opt_nm"+count+"L").text();
											}
										}
									}
									
								}else{
									
									jsonData[opt_cd]=code;
									total_optCd += opt_cd+code;
									if(total_optNm == ""){
										total_optNm = $("#item_opt_nm"+count+"L").text();
									}else{
										total_optNm += "/" + $("#item_opt_nm"+count+"L").text();
									}
								}
							}
						}else{
							
							if(typeof($("#item_opt_nm"+count).attr('data-sel-cd')) != "undefined"){
								
								opt_cd = $("#item_opt_nm"+count).attr('data-opt_cd');
								code = $("#item_opt_nm"+count).attr('data-sel-cd');
								
								if(carve_code != "" || typeof(carve_code) != "undefined"){
									
									if(code == "" || code == "XXXX"){
										continue;
									}else{
										
										if(carve_code != "XXXX" && code == "ISOS"){
											jsonData["IS"] = $("#in_carve").val();
											jsonData["OS"] = $("#out_carve").val();
										}else if(carve_code != "XXXX" &&code == "OSIS"){
											jsonData["OS"] = $("#out_carve").val();
											jsonData["IS"] = $("#in_carve").val();
										}else if(carve_code != "XXXX" &&code == "IS"){
											jsonData["IS"] = $("#in_carve").val();
										}else if(carve_code != "XXXX" &&code == "OS"){
											jsonData["OS"] = $("#out_carve").val();
										}else{
											
											jsonData[opt_cd]=code;
											total_optCd += opt_cd+code;
											if(total_optNm == ""){
												total_optNm = $("#item_opt_nm"+count).text();
											}else{
												total_optNm += "/" + $("#item_opt_nm"+count).text();
											}
											
										
										}
										
									}
									
								}else{
									
									jsonData[opt_cd]=code;
									
									total_optCd += opt_cd+code;
									
									if(total_optNm == ""){
										total_optNm = $("#item_opt_nm"+count).text();
									}else{
										total_optNm += "/" + $("#item_opt_nm"+count).text();
									}
									
								}
							}
							
							
						}
					}
					
				}
				
				if(carve_code != "" && carve_code != "undefined" && typeof(carve_code) != "undefined" ){
					
					total_optCd+= carve_code;
					
					var asciiText = "";
					var carve_div = $(".goods_detail_txt");
					var carve_float_div = $("#gd_float_opt_fix");
					
					if(layer_yn == "Y"){
						
						if(carve_code == "ISOS"){
							asciiText = fnCharToAscii(carve_float_div.find('#in_carve').val());
							total_optCd+= asciiText;
							asciiText = fnCharToAscii(carve_float_div.find('#out_carve').val());
							total_optCd+= asciiText;
							
						}else if(carve_code == "OSIS"){
							asciiText = fnCharToAscii(carve_float_div.find('#out_carve').val());
							total_optCd+= asciiText;
							asciiText = fnCharToAscii(carve_float_div.find('#in_carve').val());
							total_optCd+= asciiText;
						}else if(carve_code == "IS"){
							asciiText = fnCharToAscii(carve_float_div.find('#in_carve').val());
							total_optCd+= asciiText;
						}else if(carve_code == "OS"){
							asciiText = fnCharToAscii(carve_float_div.find('#out_carve').val());
							total_optCd+= asciiText;
						}
						
						
					}else{
						
						if(carve_code == "ISOS"){
							asciiText = fnCharToAscii(carve_div.find('#in_carve').val());
							total_optCd+= asciiText;
							asciiText = fnCharToAscii(carve_div.find('#out_carve').val());
							total_optCd+= asciiText;
							
						}else if(carve_code == "OSIS"){
							asciiText = fnCharToAscii(carve_div.find('#out_carve').val());
							total_optCd+= asciiText;
							asciiText = fnCharToAscii(carve_div.find('#in_carve').val());
							total_optCd+= asciiText;
						}else if(carve_code == "IS"){
							asciiText = fnCharToAscii(carve_div.find('#in_carve').val());
							total_optCd+= asciiText;
						}else if(carve_code == "OS"){
							asciiText = fnCharToAscii(carve_div.find('#out_carve').val());
							total_optCd+= asciiText;
						}
					}
					
					
				}
				
				if($("input[name=field_rec]:checked", scope_div).length > 0){
					
//					if($("input[name=field_rec]:checked").val() != "40"){
//						total_optCd += $("input[name=field_rec]:checked").val();
//					}
					$("#cart_grp_cd", scope_div).val($("input[name=field_rec]:checked", this).val());
				}
				
				
				total_optCd = total_optCd.replace(/\./gi,'');
				
				
					
				//선물하기는 선물하기만, 택배배송&매장수령만 
				if(layer_yn == "Y"){
					
					if($("#gd_float_opt_fix").find(".choiceGoods").find('li').length > 0){
						// 첫번재 Row에 선물하기가 있는지 체크한다.
						if(typeof($("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val()) != "undefined" 
							&& $("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "50"){
							
							if($("input[name=field_rec]:checked", scope_div).val() != "50"){
								if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
									$(".choiceGoods", scope_div).find('li').remove();
									elandmall.util.ga(pin.category, pin.action, pin.label);
							        elandmall.goodsDetail.visibleTotalAmt();
							        elandmall.goodsDetail.sumMultiTotalJw({layer_yn:layer_yn,quickview_yn:quickview_yn});
								}else{
									$("input[name=field_rec]:checked", scope_div).prop('checked', false);
									commonUI.dimRemove();
									return false;
								}
							}
						}else if(typeof($("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val()) != "undefined" 
							&& $("#gd_float_opt_fix").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "50"){
							
							if($("input[name=field_rec]:checked", scope_div).val() == "50"){
								if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
									$(".choiceGoods", scope_div).find('li').remove();
									elandmall.util.ga(pin.category, pin.action, pin.label);
							        elandmall.goodsDetail.visibleTotalAmt();
							        elandmall.goodsDetail.sumMultiTotalJw({layer_yn:layer_yn,quickview_yn:quickview_yn});
								}else{
									$("input[name=field_rec]:checked", scope_div).prop('checked', false);
									commonUI.dimRemove();
									return false;
								}
							}
							
						}
					}
					
					
				}else{

					if($(".goods_detail_txt").find(".choiceGoods").find('li').length > 0){
						// 첫번재 Row에 선물하기가 있는지 체크한다.
						if(typeof($(".goods_detail_txt").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val()) != "undefined" 
							&& $(".goods_detail_txt").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "50"){
							
							if($("input[name=field_rec]:checked", scope_div).val() != "50"){
								if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
									$(".choiceGoods", scope_div).find('li').remove();
									elandmall.util.ga(pin.category, pin.action, pin.label);
							        elandmall.goodsDetail.visibleTotalAmt();
							        elandmall.goodsDetail.sumMultiTotalJw({layer_yn:layer_yn,quickview_yn:quickview_yn});
								}else{
									$("input[name=field_rec]:checked", scope_div).prop('checked', false);
									commonUI.dimRemove();
									return false;
								}
							}
						}else if(typeof($(".goods_detail_txt").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val()) != "undefined" 
							&& $(".goods_detail_txt").find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "50"){
							
							if($("input[name=field_rec]:checked", scope_div).val() == "50"){
								if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
									$(".choiceGoods", scope_div).find('li').remove();
									elandmall.util.ga(pin.category, pin.action, pin.label);
							        elandmall.goodsDetail.visibleTotalAmt();
							        elandmall.goodsDetail.sumMultiTotalJw({layer_yn:layer_yn,quickview_yn:quickview_yn});
								}else{
									$("input[name=field_rec]:checked", scope_div).prop('checked', false);
									commonUI.dimRemove();
									return false;
								}
								
							}
							
						}
					}
					
				}
				
				var dupChk = false; 
				if(field_rece_poss_yn == "Y" || present_yn == "Y"){
					
					
					if(layer_yn == "Y"){
						
						for(var i=0; i< scope_div.find("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
							var choice_classkey = scope_div.find("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).attr('class');
							var cart_grp_cd = scope_div.find("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
							if(cart_grp_cd != "40"){
								if(choice_classkey == "L"+total_optCd && cart_grp_cd == $("input[name=field_rec]:checked").val() ){
									dupChk = true;
									break;
								}
							}
						}
						
					}else{
						
						for(var i=0; i< scope_div.find(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
							var choice_classkey = scope_div.find(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).attr('class');
							var cart_grp_cd = scope_div.find(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
							if(cart_grp_cd != "40"){
								if(choice_classkey == "L"+total_optCd && cart_grp_cd == $("input[name=field_rec]:checked").val() ){
									dupChk = true;
									break;
								}
							}
						}
					}
					
					
					if(!dupChk){
						
						//기존 동일시 삭제
						$(".L"+total_optCd,".choiceGoods").remove();
				        elandmall.util.ga(pin.category, pin.action, pin.label);
				        elandmall.goodsDetail.visibleTotalAmt();
				        elandmall.goodsDetail.sumMultiTotal();
						
						var tmp_opt_select_info = new Array();
				        for(var i=0; i<opt_select_info.length; i++){
				        	var chk = false;
				        	var tmp_obj = opt_select_info[i];
				        	if(tmp_obj.classkey == total_optCd ){
				        		delete opt_select_info[i];
				        		chk = true;
				        	}
				        	if(!chk){
				        		tmp_opt_select_info.push(tmp_obj);
				        	}
				        }
				        opt_select_info = new Array(); // 초기화
				        opt_select_info = tmp_opt_select_info;
					}
					
					

				}
					
		        
		        var opt_select = {};
				opt_select.classkey = total_optCd;
				opt_select.BrandCode = set_brandCode;
				opt_select.StyleCode = set_styleCode;
				opt_select.OptionCode = jsonData;
				opt_select_info.push(opt_select);

				
				var param_select = {};
				param_select.BrandCode = set_brandCode;
				param_select.StyleCode = set_styleCode;
				param_select.OptionCode = jsonData;
				
				
			var	param = $.extend({ classkey		: total_optCd
									, total_optCd		: total_optCd
									, total_optNm		: total_optNm
									, carve_code 		: carve_code
									, vir_vend_no		: set_vir_vend_no
									, quickview_yn 		: quickview_yn
									, goods_opt_data	: JSON.stringify(param_select) }, pin.param || {});
				
				elandmall.optLayerEvt.getJwItemPrice({
					param:param,
					success:function(data){
						elandmall.goodsDetail.drawJwAddGoods({
							data:data,
							quickview_yn:quickview_yn
						});
					}
				});
				
				
				
			},
			
			
			//[START] 추가 상품(단품) 그리기
			drawJwAddGoods : function(pin){
				var repData = pin.data[0];
				var data = pin.data[0].Content;
				var html = "";
				var cart_grp_cd = "";
				var type = "";
				if($("#goods_type_cd").val() == "80"){
					type = "PKG";
				}else{
					type = "DEF";
				}
				var layer_yn = (typeof(repData.layer_yn) != "undefined")? repData.layer_yn:"N";
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")? pin.quickview_yn:"N";
				var shopCode = (typeof(pin.shopCode) != "undefined")? pin.shopCode:"";
				var classkey = "";
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				
				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
				var carve_code = (typeof(repData.carve_code) != "undefined")? repData.carve_code:"";
				if(data == null){
					alert("상품가격을 불러오지 못했습니다. 다시 시도해 주시고 현상이 계속 반복될 경우 이랜드몰 고객센터로 연락 주세요.(1899-9500)");
					
					var tmp_opt_select_info = new Array();
			        for(var i=0; i<opt_select_info.length; i++){
			        	var chk = false;
			        	var tmp_obj = opt_select_info[i];
			        	
			        	
			        	if(tmp_obj.classkey == repData.classkey ){
			        		delete opt_select_info[i];
			        		chk = true;
			        	}
			        	
			        	if(!chk){
			        		tmp_opt_select_info.push(tmp_obj);
			        	}
			        }
			        
			        opt_select_info = new Array(); // 초기화
			        opt_select_info = tmp_opt_select_info;
					
			        
					elandmall.goodsDetail.initSelectsBoxJw(scope_div);
					if(carve_code != ""){
						$(".goods_detail_txt").find('li[name="li_input_carve"]').remove();
						$(".goods_detail_txt").find('input[name="in_carve"]').val("");
						$("#gd_float_opt_fix").find('li[name="li_input_carve"]').remove();
						$("#gd_float_opt_fix").find('input[name="in_carve"]').val("");
					}
					
					$("#branchInfoBox").hide();
					if(type == "PKG"){
						$("li[name=branchInfoBox]").hide();
					}else{
						$("#branchInfoBoxL").hide();
					}
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					commonUI.dimRemove();
					return;
				}
				
				classkey = (repData.classkey != null) ? repData.classkey.replace(/\./gi,''):"";
				
				//중복시 수량 늘리기
				if($(".L"+classkey, $("#detailform", scope_div)).length > 0){
					$(".L"+classkey, $("#detailform", scope_div)).find('.goods_sel_co_pl').click();
				}else{
					
					var p = {};
					p.goods_no       = repData.GOODS_NO;
					p.vir_vend_no   = repData.VIR_VEND_NO;
					p.goods_type_cd = repData.GOODS_TYPE_CD;
					p.item_no       = repData.ITEM_NO; 
					p.min_qty = "1";
					p.classkey = classkey;
					p.quickview_yn = quickview_yn;
					p.layer_yn  = layer_yn;
					
					var pinStr = JSON.stringify(p).replace(/\"/gi, "'");
					var pinInputStr = pinStr != "" ? pinStr.substring(0, pinStr.length-1) : "";
					
					html += "<li  class=\"L" + classkey +"\">";
					html +=	"	<div class=\"goods_sel_na\">"; //+data.ITEM_NM;
					
					var label_nm = "";
					if($("input[name=field_rec]:checked", scope_div).length > 0 && $("input[name=field_rec]:checked", scope_div).val() != "40"){
						var label_id = $("input[name=field_rec]:checked", scope_div).attr('id');
						label_nm = "[" + $.trim($("label[for='"+ label_id +"']").eq(0).text()) + "]" ; 
					}
					
					var carve_tmp_nm = "";
					
					var carve_div = $(".goods_detail_txt");
					var carve_float_div = $("#gd_float_opt_fix");
					
					if(layer_yn == "Y"){
						
						if(carve_code == "ISOS"){
							carve_tmp_nm = "/속:"+ carve_float_div.find('#in_carve').val() +"/겉:"+ carve_float_div.find('#out_carve').val();
						}else if(carve_code == "OSIS"){
							carve_tmp_nm = "/겉:"+ carve_float_div.find('#out_carve').val() + "/속:"+ carve_float_div.find('#in_carve').val();
						}else if(carve_code == "IS"){
							carve_tmp_nm = "/속:"+ carve_float_div.find('#in_carve').val();
						}else if(carve_code == "OS"){
							carve_tmp_nm = "/겉:"+ carve_float_div.find('#out_carve').val();
						}
					}else{
						if(carve_code == "ISOS"){
							carve_tmp_nm = "/속:"+ carve_div.find('#in_carve').val() +"/겉:"+ carve_div.find('#out_carve').val();
						}else if(carve_code == "OSIS"){
							carve_tmp_nm = "/겉:"+ carve_div.find('#out_carve').val() + "/속:"+ carve_div.find('#in_carve').val();
						}else if(carve_code == "IS"){
							carve_tmp_nm = "/속:"+ carve_div.find('#in_carve').val();
						}else if(carve_code == "OS"){
							carve_tmp_nm = "/겉:"+ carve_div.find('#out_carve').val();
						}
					}
					
					
				    var cust_nm = "";
					var strgatag = "PC_상품상세||";
					var middletag="";
					if(type == "PKG"){
						middletag += "묶음상세_상품수량_변경";
						html += label_nm + $("#li_cmps_goods").find('.sel_txt').attr('data-sel-msg')+" "+ repData.total_optNm + carve_tmp_nm;
						cust_nm = label_nm + $("#li_cmps_goods").find('.sel_txt').attr('data-sel-msg')+" "+ repData.total_optNm + carve_tmp_nm;
					}else if(type == "SET"){
						middletag += "세트상세_상품수량_변경";
					}else{
						middletag += "공통_상품수량 변경";
						html += label_nm +  repData.total_optNm + carve_tmp_nm;
						cust_nm = label_nm +  repData.total_optNm + carve_tmp_nm;
					}
					
					
					var gift_goods_dtl_no =  $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",scope_div))).attr("data-value")
					var gift_nm = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",scope_div))).data("gift_nm");
					var gift_stock_qty = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",scope_div))).data("stock_qty");
					if(typeof(gift_goods_dtl_no) != "undefined"){
						html +=	"<br/>사은품 : "+gift_nm;
					}
					
					strgatag += middletag+ "||";
					
					html += "</div>"
					html += "	<input type=\"hidden\" name=\"sale_price\" value=\""+data.Price+"\" class=\"input\"/>"; 
					html +=	"	<div class=\"goods_sel_co\">";
					html +=	"		<div class=\"goods_sel_co_area\">";
					html +=	"			<a href=\"javascript:void(0);\" class=\"goods_sel_co_mi\" data-ga-tag=\"" + strgatag + "-\" onclick=\"elandmall.goodsDetail.setMinusJw("+pinStr+");return false;\" onkeypress=\"this.onclick;\" >수량 감소</a>";
					html +=	"			<a href=\"javascript:void(0);\" class=\"goods_sel_co_pl\" data-ga-tag=\"" + strgatag + "+\" onclick=\"elandmall.goodsDetail.setPlusJw("+pinStr+");return false;\" onkeypress=\"this.onclick;\">수량 증가</a>";
					html +=	"			<input type=\"text\" class=\"goods_sel_co_in\" name=\"ord_qty\" onblur=\"elandmall.goodsDetail.checkKeyPressQtyJw("+pinInputStr+", obj:this});\" title=\"수량\" value=\""+p.min_qty+"\" />";
					html +=	"		</div>";
					html +=	"	</div>";
					html +=	"	<div class=\"goods_sel_pr\">";
					html +=	"		<strong class=\"itemPrc\">"+elandmall.util.toCurrency(data.Price*p.min_qty)+"</strong>원";
					html +=	"	</div>";
					html +=	"	<div class=\"goods_sel_de\">";
					html +=	"		<a href=\"javascript:void(0);\" onclick=\"elandmall.goodsDetail.removeItem({layer_yn:'"+ layer_yn +"', quickview_yn:'"+quickview_yn+"', classkey:'"+p.classkey+"', item_no:'?"+p.item_no+"', category:'PC_상품상세', action:'"+middletag+"', label:'x'})\" class=\"ico_del\"></a>";
					html +=	"	</div>";
					html += "</li>";
					$(".choiceGoods", scope_div).prepend(html);
					var form = $(".L" + classkey, scope_div);
					var hidden = null;
						if(type == "DEF"|| type == "PKG"){

							if(type == "PKG"){
								hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").val(repData.GOODS_NO);
								hidden.appendTo(form);
							}else{
								if($(":input[name=item_no]", "#detailform").size() >= 1) {
									hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").val(repData.GOODS_NO);
									hidden.appendTo(form);
					
								}
							}

							hidden = $("<input />").attr("type", "hidden").attr("name", "vir_vend_no").val(repData.VIR_VEND_NO);
							hidden.appendTo(form);
							hidden = $("<input />").attr("type", "hidden").attr("name", "item_no").val(repData.ITEM_NO);
							hidden.appendTo(form);
						}
						hidden = $("<input />").attr("type", "hidden").attr("name", "goods_nm").val(repData.GOODS_NM);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "brand_nm").val(repData.BRAND_NM);
						
						hidden.appendTo(form);
						
						if ( gift_goods_dtl_no ){
							hidden = $("<input />").attr("type", "hidden").attr("name", "gift_goods_dtl_no").val(gift_goods_dtl_no);
							hidden.appendTo(form);
							hidden = $("<input />").attr("type", "hidden").attr("name", "gift_stock_qty").val(gift_stock_qty);
							hidden.appendTo(form);
						}
						hidden = $("<input />").attr("type", "hidden").attr("name", "cart_grp_cd").val(repData.cart_grp_cd);
						hidden.appendTo(form);

						hidden = $("<input />").attr("type", "hidden").attr("name", "cust_item_no").val(data.ProdCode);
						hidden.appendTo(form);
						
						hidden = $("<input />").attr("type", "hidden").attr("name", "cust_item_nm").val(cust_nm);
						hidden.appendTo(form);
						
						hidden = $("<input />").attr("type", "hidden").attr("name", "goods_opt_data").val(repData.goods_opt_data);
						hidden.appendTo(form);
						
						hidden = $("<input />").attr("type", "hidden").attr("name", "item_nm").val(repData.total_optNm + carve_tmp_nm);
						hidden.appendTo(form);
						
						if(carve_code != ""){
							
							hidden = $("<input />").attr("type", "hidden").attr("name", "carve_code").val(carve_code);
							hidden.appendTo(form);	
							
							if(carve_code == "ISOS" || carve_code == "OSIS"){
								hidden = $("<input />").attr("type", "hidden").attr("name", "in_carve_nm").val($("#in_carve").val());
								hidden.appendTo(form);
								hidden = $("<input />").attr("type", "hidden").attr("name", "out_carve_nm").val($("#out_carve").val());
								hidden.appendTo(form);
							}else if(carve_code == "IS"){
								hidden = $("<input />").attr("type", "hidden").attr("name", "in_carve_nm").val($("#in_carve").val());
								hidden.appendTo(form);
							}else if(carve_code == "OS"){
								hidden = $("<input />").attr("type", "hidden").attr("name", "out_carve_nm").val($("#out_carve").val());
								hidden.appendTo(form);
							}
						}
						$("#sale_price").val(data.Price);
				}
				
				if($("input[name=field_rec]:checked", scope_div).length > 0 
						&& $("input[name=field_rec]:checked", scope_div).val() == "40"){
					var p = $.extend({ cust_prod_yn: "Y", layer_yn: layer_yn, classkey : classkey, data : opt_select_info, brandCode: data.BrandCode, styleCode: data.StyleCode, productCode: data.ProdCode, quickview_yn:quickview_yn}, p || {});
					elandmall.popup.storeReceiptLayer(p);
					
					var present_chk = false;
					for(var i=0; i< $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
						var cart_grp_cd = $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#cartBtn").hide();
						$(".goods_set_btn", scope_div).addClass('type02');
					}else{
						$(".goods_set_btn", scope_div).removeClass('type02');
						$("#cartBtn").show();
					}
					
					//플로팅 옵션 설정
					var float_present_chk = false;
					for(var i=0; i< $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
						var cart_grp_cd = $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
						if(cart_grp_cd == "50"){
							float_present_chk = true;
						}
					}
					
					if(float_present_chk){
						$("#float_cartBtn").hide();
						$("#float_buyBtn").addClass('full');
					}else{
						
						if(event_layer_yn != "Y"){
							$("#float_buyBtn").removeClass('full');
						}
						$("#float_cartBtn").show();
					}
				}else{
					
					if(carve_code != ""){
						$(".goods_detail_txt").find('li[name="li_input_carve"]').remove();
						$(".goods_detail_txt").find('input[name="in_carve"]').val("");
						$("#gd_float_opt_fix").find('li[name="li_input_carve"]').remove();
						$("#gd_float_opt_fix").find('input[name="in_carve"]').val("");
					}
					$("#branchInfoBox").hide();
					if(type == "PKG"){
						$("li[name=branchInfoBox]").hide();
					}else{
						$("#branchInfoBoxL").hide();
					}
					
					var present_chk = false;
					for(var i=0; i< $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').length; i++){
						var cart_grp_cd = $(".goods_detail_txt").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#cartBtn").hide();
						$(".goods_set_btn", scope_div).addClass('type02');
					}else{
						$(".goods_set_btn", scope_div).removeClass('type02');
						$("#cartBtn").show();
					}
					
					//플로팅 옵션 설정
					var float_present_chk = false;
					for(var i=0; i< $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').length; i++){
						var cart_grp_cd = $("#gd_float_opt_fix").find(".choiceGoods", scope_div).children('li').eq(i).find('input[name="cart_grp_cd"]').val();
						if(cart_grp_cd == "50"){
							float_present_chk = true;
						}
					}
					
					if(float_present_chk){
						$("#float_cartBtn").hide();
						$("#float_buyBtn").addClass('full');
					}else{
						if(event_layer_yn != "Y"){
							$("#float_buyBtn").removeClass('full');
						}
						$("#float_cartBtn").show();
					}
					
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					elandmall.goodsDetail.initSelectsBoxJw(scope_div);
					elandmall.goodsDetail.visibleTotalAmt();
					elandmall.goodsDetail.sumMultiTotalJw({layer_yn:layer_yn,quickview_yn:quickview_yn});
					_google_analytics();
					
				}
				
			
				
			
			},//[END] 추가 상품(단품) 그리기
			
			
			fnCallbackResultStore : function(p){
				
				var scope_div = null;
				if(p.quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				var type = "";
				if($("#goods_type_cd").val() == "80"){
					type = "PKG";
				}else{
					type = "DEF";
				}
				
				var form = $(".L" + p.classkey, scope_div);
				var hidden = null;
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopCode").val(p.shopCode);
				hidden.appendTo(form);
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopName").val(p.shopName);
				hidden.appendTo(form);
				
				var cust_item_nm = "";
				if(p.layer_yn == "Y"){
					cust_item_nm = $("#gd_float_opt_fix").find(".L" + p.classkey).find("[name=cust_item_nm]").val();
				}else{
					cust_item_nm = $(".goods_detail_txt").find(".L" + p.classkey).find("[name=cust_item_nm]").val();
				}
				
				
				form.find('.goods_sel_na').text();
				form.find('.goods_sel_na').text("[매장수령]"+"["+p.shopName+"]"+ cust_item_nm);
				form.find('input[name=cust_item_nm]').val("[매장수령]"+"["+p.shopName+"]"+ cust_item_nm);
				
				$(".goods_detail_txt").find('li[name="li_input_carve"]').remove();
				$(".goods_detail_txt").find('input[name="in_carve"]').val("");
				$("#gd_float_opt_fix").find('li[name="li_input_carve"]').remove();
				$("#gd_float_opt_fix").find('input[name="in_carve"]').val("");
				
//				$(".L" + p.classkey, scope_div).attr('class', ".L" + p.classkey + "40" + p.shopCode);
//		        for(var i=0; i<opt_select_info.length; i++){
//		        	var tmp_obj = opt_select_info[i];
//		        	if(tmp_obj.classkey == p.classkey ){
//		        		opt_select_info[i].classkey = ".L" + p.classkey + "40" + p.shopCode;
//		        		break;
//		        	}
//		        }
				
				
				$("#branchInfoBox").hide();
				if(type == "PKG"){
					$("li[name=branchInfoBox]").hide();
				}else{
					$("#branchInfoBoxL").hide();
				}
				$("input[name=field_rec]:checked", scope_div).prop('checked', false);
				elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotalJw({layer_yn:p.layer_yn,quickview_yn:p.quickview_yn});
				elandmall.goodsDetail.initSelectsBoxJw(scope_div);
				_google_analytics();
				commonUI.dimRemove();
			
			},
			
			fnCallbackCloseStore : function(p){
				
				opt_select_info = new Array(); // 초기화
		        
				if(p.result_data[0] != null){
					opt_select_info = p.result_data;
				}
		        $("input[name=field_rec]:checked").prop('checked', false);
		        
		        elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotalJw({layer_yn:p.layer_yn,quickview_yn:p.quickview_yn});
				_google_analytics();
				commonUI.dimRemove();
			},
			
			
			
			//[START] 추가 상품(단품) 그리기
			drawAddGoods : function(pin){
				var repData = pin.data[0];
				var data = pin.data;
				var vORD_POSS_MIN_QTY = 1;//p.min_qty;
				var set_param = pin.set_param;
				var html = "";
				var cmps_goods_nm = "";
				var cart_grp_cd = "10";
				var cm_lotDeli_val = "70";  //오늘직송 코드
				var type = (typeof(pin.type) != "undefined")? pin.type:"DEF";
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")? pin.quickview_yn:"N";
				var layer_yn = (typeof(pin.layer_yn) != "undefined")? pin.layer_yn:"N";
				var jwNormal_yn = (typeof(data.jwNormal_yn) != "undefined")? data.jwNormal_yn:"N";
				var classkey = "";
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				var event_layer_yn = $("input[name='event_layer_yn']",scope_div).val();
				
				if($.type(event_layer_yn) != "undefined" && event_layer_yn == "Y" ){
					data.layer_yn = "Y";
				}
				
				if(type == "SET"){
					if(typeof(set_param) != "undefined"){
						$.each(set_param.set_cmps_item_no, function(idx, cmp_no){
							classkey += cmp_no;
						});
					}
					//세트상품일 때, 대표상품 정보 재설정
					$(data).each(function(){
						if(String($(this)[0].GOODS_NO) == String($("#goods_no",scope_div).val())){
							repData = $(this)[0];
						}
					});
					
				}else{
					
					classkey = repData.GOODS_NO + repData.ITEM_NO;
				}
				
				
				if($("#reserv_limit_divi_cd", scope_div).val() == "30"){ //커밍순일 때는 RET_CODE를 모두열어준다. 
					repData.RET_CODE = "0000";
				}
				
				var addCheck = false;
			    if(repData.RET_CODE != "0000"){
			    	if(repData.RET_CODE == "-0002" || repData.RET_CODE == "-0005" || repData.RET_CODE == "-0041") {
			    	    alert("상품이 품절 되었습니다.");
			        } else if(repData.RET_CODE == "-0003" ) {
			        	alert("상품이 판매가능한 기간이 아닙니다.");
			        } else {
			        	alert("상품이 판매가 종료되었습니다.");
			        }

		    		elandmall.goodsDetail.resetGift(scope_div);


			    	addCheck = true ;
			    	commonUI.dimRemove();
			    	return false;
			    }
			    
			    
			    var field_rec_val = "";
			    if(type == "PKG" && jwNormal_yn != "Y"){
			    	if($("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).attr('data-cmpssolodeliway_yn') == "Y"){
			    		field_rec_val = cm_lotDeli_val;
			    	}else{
			    		field_rec_val = $("#recev_slt", scope_div).attr('data-value');
			    	}
			    }else if(type == "SET" && $("#soloDeliWay_yn" , $("#detailform", scope_div)).val() == "Y"){
			    	field_rec_val = cm_lotDeli_val;
			    }else{
			    	if($("#soloDeliWay_yn" , $("#detailform", scope_div)).val() == "Y"){
			    		field_rec_val = cm_lotDeli_val;
			    	}else{
			    		field_rec_val = $("input[name=field_rec]:checked", scope_div).val();
			    	}
			    }
			    
			    // 주문서가 다른 수령방법은 같이 주문할 수 없으므로 체크한다.
			    if( scope_div.find(".choiceGoods").find('li').length > 0 ){
			    	var param = $.extend({div:scope_div, field_rec_val:field_rec_val}, pin || {});
			    	if(!elandmall.goodsDetail.fnReceiveChoiceValid(param)){
			    		return false;
			    	}
			    }
			    
				//$(".L"+classkey, $("#detailform")).each(function(i,item){
			    
			   if($(".L"+classkey, $("#detailform", scope_div)).length > 0){
				   if(field_rec_val != scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() && jwNormal_yn == "Y"){
					   alert("동일한 옵션으로 여러 수령 방식의 주문은 불가 합니다.");  
				   } else {
					   alert("이미 추가된 옵션입니다. 수량 조절은 아래 선택사항에서 해주십시오.");
				   }
			       $("#pkgCmpsGoods", scope_div).attr("data-choice_yn","N");

			       elandmall.goodsDetail.resetGift(scope_div);

			       addCheck = true ;
			       if(jwNormal_yn == "Y"){
			    	   if($("#field_rec_choice",scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
							$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					   }else if($("#recev_slt", $("#detailform",scope_div)).length > 0){
							$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					   }
			    	   commonUI.dimRemove();
			       }
			   }					   
				//});
			    if(!addCheck){
			    
					var p = {};
					p.goods_no       = repData.GOODS_NO;
					p.vir_vend_no   = repData.VIR_VEND_NO;
					p.goods_type_cd = repData.GOODS_TYPE_CD;
					p.item_no       = repData.ITEM_NO; 
					p.ord_poss_max_qty_st_cd = repData.ORD_POSS_MAX_QTY_ST_CD; 
					p.min_qty = repData.ORD_POSS_MIN_QTY < 1 ? 1 : repData.ORD_POSS_MIN_QTY;
					p.max_qty = repData.ORD_POSS_MAX_QTY; 
					p.sale_poss_qty = repData.SALE_POSS_QTY;
					p.nplus_base_cnt =repData.NPLUS_BASE_CNT;
					p.nplus_cnt =repData.NPLUS_CNT;
					p.classkey = classkey;
					p.sale_unit_qty = repData.SALE_UNIT_QTY;
					p.quickview_yn = quickview_yn;
					
					if( p.goods_type_cd != "50" && +p.sale_unit_qty > 1 ){// N+1 이 아니고 sale_unit_qty가 0보다 크면 주문단위수량 상품
						if(p.min_qty <= 1){
							p.min_qty = p.sale_unit_qty;
				        }else if( p.min_qty > 1 && ((p.min_qty % + p.sale_unit_qty) > 0 )){
				            //나누어 0이 보다 크면 단위수량으로 셋팅 처리 
				        	p.min_qty = Math.ceil(p.min_qty/p.sale_unit_qty) * p.sale_unit_qty;
				        }    
					}
					
					var pinStr = JSON.stringify(p).replace(/\"/gi, "'");
					var pinInputStr = pinStr != "" ? pinStr.substring(0, pinStr.length-1) : "";
					//옵션상품일 때,
					
					var message = "";
					if(layer_yn == "Y"){
						message = "상품 수령방법은 상품 이미지 옆 옵션 항목에서 선택 해 주세요.";
					}else{
						message = "수령방법을 선택해주세요.";
					}
					if($("#field_rec_choice",scope_div).length > 0 && $("input[name=field_rec]", scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
						if(typeof($("input[name=field_rec]:checked", scope_div).val()) ==  "undefined"){
							alert(message);
							elandmall.goodsDetail.initSelectsBox(scope_div);
							return false;
						}else{
							cart_grp_cd = $("input[name=field_rec]:checked", scope_div).val();
							$("[name=cart_grp_cd]", scope_div).val(cart_grp_cd);
						}
						
					}else if($("#recev_slt", $("#detailform",scope_div)).length > 0){
						if(typeof($("#recev_slt", $("#detailform",scope_div)).attr("data-value")) == "undefined"){
							alert(message);
							elandmall.goodsDetail.initSelectsBox(scope_div);
							return false;
						}else if($("#recev_slt", $("#detailform",scope_div)).attr("data-value") == ""){
							alert(message);
							elandmall.goodsDetail.initSelectsBox(scope_div);
							return false;
						}else{
							cart_grp_cd = $("#recev_slt", $("#detailform",scope_div)).attr("data-value");
							$("[name=cart_grp_cd]", scope_div).val(cart_grp_cd);
						}
					}else if($("#soloDeliWay_yn", $("#detailform",scope_div)).val() == "Y" || $("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).attr('data-cmpssolodeliway_yn') == "Y"){ //오늘직송 하나만들어왔을 경우
						cart_grp_cd = cm_lotDeli_val;
						$("[name=cart_grp_cd]", scope_div).val("70");
					}
					
					//세트상품일때,
					if(type == "SET"){
						$("[id^=cmps_goods_grp]",$("#detailform", scope_div)).each(function(idx,obj){
							var selectedOpt = $(this);
							var cmps_grp_seq = $(obj).attr("data-cmps_grp_seq");
							var grp_nm = $("#setGrp"+cmps_grp_seq).children(".opt_box_title").text();
							var cmps_qty= $(this).attr("data-cmps_qty");
							var goods_no = $(this).attr("data-goods_no");
							var item_no = $(this).attr("data-item_no");
							var vir_vend_no = $(this).attr("data-vir_vend_no");
							var set_cmps_item_no = $(this).attr("data-set_cmps_item_no");
							if(cmps_goods_nm != ""){
								cmps_goods_nm += "<br />";
							}  
							var strDataInfo = "{\"cmps_qty\":\""+cmps_qty+"\", \"cmps_grp_seq\":\""+cmps_grp_seq+"\", \"goods_no\":\""+goods_no+"\", \"vir_vend_no\":\""+vir_vend_no+"\", \"item_no\":\""+item_no+"\", \"set_cmps_item_no\":\""+set_cmps_item_no+"\"}";
							if($(selectedOpt).data("multi_item_yn") == "Y"){				
								var item_nm = "";
								$("[id^=item_opt_nm]", "#setGrp"+cmps_grp_seq).each(function(idx){ 
									if(item_nm != ""){
										item_nm +="/"; 
									}
									item_nm += $(this).text();
								});
								cmps_goods_nm += "<strong id=\"choiceGrp"+cmps_grp_seq+"\" data-cmps_info='" + strDataInfo + "'>["+grp_nm+"]</strong> " + $(selectedOpt).text() + " " + item_nm;
				
							}else{
								cmps_goods_nm += "<strong id=\"choiceGrp"+cmps_grp_seq+"\" data-cmps_info='" + strDataInfo + "'>["+grp_nm+"]</strong> " + $(selectedOpt).text();
							}
						});
					//
					}else if(type == "PKG"){
						
						
						if(jwNormal_yn == "Y"){
							if($("#field_rec_choice",$("#detailform", scope_div)).length > 0){
								if( cart_grp_cd == "40" ){
									cmps_goods_nm += "[매장수령]";
								}else if(cart_grp_cd == "50"){
									cmps_goods_nm += "[선물하기] ";
								}else{
									cmps_goods_nm += "[택배배송] ";
								}
							}
							
							if(typeof(repData.disp_seq) != "undefined"){
								cmps_goods_nm += "선택"+repData.disp_seq+") "
							}
							
						}else{
							
							if(typeof(repData.disp_seq) != "undefined"){
								cmps_goods_nm += "선택"+repData.disp_seq+") "
							}
							if( typeof(repData.vend_nm) != "undefined" && repData.vend_nm != ""){
								cmps_goods_nm += "["+repData.vend_nm+"]";
							}
							if(repData.RESERV_LIMIT_DIVI_CD == "10"){
								cmps_goods_nm += "[예약배송]"
							}else if(repData.RESERV_LIMIT_DIVI_CD == "20"){
								cmps_goods_nm += "[프리오더]"
							}
							
							if($("#recev_slt",$("#detailform", scope_div)).length > 0){
								if( cart_grp_cd == "40" ){
									cmps_goods_nm += "[방문수령]";
								}else if(cart_grp_cd == "50"){
									cmps_goods_nm += "[선물하기]";
								}else if(cart_grp_cd == "60"){
									cmps_goods_nm += "[오늘받송]";
								}else if( cart_grp_cd == "70" ){
									cmps_goods_nm += "[오늘직송] ";
								}else{
									cmps_goods_nm += "[택배배송]";
								}
							}else if($("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).attr('data-cmpssolodeliway_yn') == "Y"){ //오늘직송 하나만들어왔을 경우
								cmps_goods_nm += "[오늘직송]";
							}
						}
						
						
						if(repData.MULTI_ITEM_YN == "Y"){
							cmps_goods_nm += repData.GOODS_NM +" "+ repData.ITEM_NM;
						}else{
							cmps_goods_nm += repData.GOODS_NM;
						}
						
						
					}else{
						
						var cmps_goods_nm_flag = false;
						if($("#reserv_limit_divi_cd", scope_div).val() == "10"){	//예약상품일 때, 커밍순일때, (묶음이나 세트는 예약 X)
							cmps_goods_nm += "[예약배송] ";
							cmps_goods_nm_flag =true;	
						}else if($("#reserv_limit_divi_cd", scope_div).val() == "20"){ //프리오더 일때,
							cmps_goods_nm += "[프리오더] ";
							cmps_goods_nm_flag =true;
						}
						
						if(typeof($("#vend_nm", scope_div).val()) != "undefined"){
							cmps_goods_nm += "["+$("#vend_nm", scope_div).val()+"]";
							if($("#field_rec_choice",$("#detailform", scope_div)).length > 0){
								if( cart_grp_cd == "40" ){
									if(jwNormal_yn == "Y"){
										cmps_goods_nm += "[매장수령]";
									}else{
										cmps_goods_nm += "[방문수령] ";
									}
								}else if(cart_grp_cd == "50"){
									cmps_goods_nm += "[선물하기] ";
								}else if(cart_grp_cd == "60"){
									cmps_goods_nm += "[오늘받송] ";
								}else if( cart_grp_cd == "70" ){
									cmps_goods_nm += "[오늘직송] ";
								}else{
									cmps_goods_nm += "[택배배송] ";
								}
							}else if($("#soloDeliWay_yn", $("#detailform",scope_div)).val() == "Y"){ //오늘직송 하나만들어왔을 경우
								cmps_goods_nm += "[오늘직송] ";
							}
							cmps_goods_nm_flag =true;
						}
						
						if(!cmps_goods_nm_flag && $("#field_rec_choice",scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
							if( cart_grp_cd == "40" ){
								if(jwNormal_yn == "Y"){
									cmps_goods_nm += "[매장수령]";
								}else{
									cmps_goods_nm += "[방문수령] ";
								}
							}else if(cart_grp_cd == "50"){
								cmps_goods_nm += "[선물하기] ";
							}else if(cart_grp_cd == "60"){
								cmps_goods_nm += "[오늘받송] ";
							}else{
								cmps_goods_nm += "[택배배송] ";
							}
						}else if(!cmps_goods_nm_flag && $("#soloDeliWay_yn", $("#detailform",scope_div)).val() == "Y"){ //오늘직송 하나만들어왔을 경우
							cmps_goods_nm += "[오늘직송]";
						}
						
		 				cmps_goods_nm += repData.ITEM_NM;
		 				
		 				if( +p.max_qty > 0 && +p.max_qty <= 10 ){
		 					if(p.ord_poss_max_qty_st_cd == "20"){
			 					cmps_goods_nm += "<br/> (1인당 최대" + p.max_qty + "개)";
			 				}else if(p.ord_poss_max_qty_st_cd == "10"){
			 					cmps_goods_nm += "<br/> (주문당 최대" + p.max_qty + "개)";
			 				}
		 				}
		 				
					}
					html += "<li  class=\"L" + classkey +"\">";
					html +=	"	<div class=\"goods_sel_na\">"; //+data.ITEM_NM;
					html += cmps_goods_nm;
					if(typeof(pin.gift_goods_dtl_no) != "undefined"){
						html +=	"<br/>사은품 : "+pin.gift_nm;
						//html += "<input type=\"hidden\" name=\"gift_goods_dtl_no\" value=\""+pin.gift_goods_dtl_no+"\"/>";
					}
					//세트일 때,
					if(typeof(data) != "undefined"){
						$.each(data, function(idx,result){
							if(idx > 0){
								html += "<input type=\"hidden\" id=\"sale_poss_qty_" + result.GOODS_NO + result.ITEM_NO + "\" value=\""+result.SALE_POSS_QTY +"\"/>";
							}
						});
					}
					//
					var strgatag = "PC_상품상세||";
					var middletag="";
					if(type == "PKG"){
						middletag += "묶음상세_상품수량_변경";
					}else if(type == "SET"){
						middletag += "세트상세_상품수량_변경";
					}else{
						middletag += "공통_상품수량 변경";
					}
					strgatag += middletag+ "||";
					
					html += "</div>"
					html += "	<input type=\"hidden\" name=\"sale_price\" value=\""+repData.CUST_SALE_PRICE+"\" class=\"input\"/>"; 
					html +=	"	<div class=\"goods_sel_co\">";
					html +=	"		<div class=\"goods_sel_co_area\">";
					html +=	"			<a href=\"javascript:void(0);\" class=\"goods_sel_co_mi\" data-ga-tag=\"" + strgatag + "-\" onclick=\"elandmall.goodsDetail.setMinus("+pinStr+");return false;\" onkeypress=\"this.onclick;\" >수량 감소</a>";
					html +=	"			<a href=\"javascript:void(0);\" class=\"goods_sel_co_pl\" data-ga-tag=\"" + strgatag + "+\" onclick=\"elandmall.goodsDetail.setPlus("+pinStr+");return false;\" onkeypress=\"this.onclick;\">수량 증가</a>";
					html +=	"			<input type=\"text\" class=\"goods_sel_co_in\" name=\"ord_qty\" onblur=\"elandmall.goodsDetail.checkKeyPressQty("+pinInputStr+", obj:this});\" title=\"수량\" value=\""+p.min_qty+"\" />";
					html +=	"		</div>";
					html +=	"	</div>";
					html +=	"	<div class=\"goods_sel_pr\">";
					html +=	"		<strong class=\"itemPrc\">"+elandmall.util.toCurrency(repData.CUST_SALE_PRICE*p.min_qty)+"</strong>원";
					html +=	"	</div>";
					html +=	"	<div class=\"goods_sel_de\">";
					html +=	"		<a href=\"javascript:void(0);\" onclick=\"elandmall.goodsDetail.removeItem({classkey:'"+p.classkey+"', item_no:'?"+p.item_no+"', category:'PC_상품상세', action:'"+middletag+"', label:'x'})\" class=\"ico_del\"></a>";
					html +=	"	</div>";
					html += "</li>";
					$(".choiceGoods", scope_div).prepend(html);
					var form = $(".L" + classkey, scope_div);
					var hidden = null;
					if(type == "DEF"|| type == "PKG"){

						if(type == "PKG"){
							hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").val(repData.GOODS_NO);
							hidden.appendTo(form);
						}else{
							if($(":input[name=item_no]", "#detailform").size() >= 1) {
								hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").val(repData.GOODS_NO);
								hidden.appendTo(form);
				
							}
						}

						hidden = $("<input />").attr("type", "hidden").attr("name", "vir_vend_no").val(repData.VIR_VEND_NO);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "item_no").val(repData.ITEM_NO);
						hidden.appendTo(form);
					}
					hidden = $("<input />").attr("type", "hidden").attr("name", "goods_nm").val(repData.GOODS_NM);
					hidden.appendTo(form);
					hidden = $("<input />").attr("type", "hidden").attr("name", "brand_nm").val(repData.BRAND_NM);
					hidden.appendTo(form);
					
					if ( pin.gift_goods_dtl_no ){
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_goods_dtl_no").val(pin.gift_goods_dtl_no);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_stock_qty").val(pin.gift_stock_qty);
						hidden.appendTo(form);
					}
					hidden = $("<input />").attr("type", "hidden").attr("name", "cart_grp_cd").val(cart_grp_cd);
					hidden.appendTo(form);
					
					hidden = $("<input />").attr("type", "hidden").attr("name", "item_nm").val(repData.ITEM_NM);
					hidden.appendTo(form);
					
					
					if(jwNormal_yn == "Y" && cart_grp_cd == "40"){

						hidden = $("<input />").attr("type", "hidden").attr("name", "disp_seq").val(repData.disp_seq);
						hidden.appendTo(form);
						
						var brand_cd = (typeof(data.brand_cd) != "undefined")? data.brand_cd:"";
						var style_cd = (typeof(data.style_cd) != "undefined")? data.style_cd:"";
						var last_sap_item_cd = (typeof(data.last_sap_item_cd) != "undefined")? data.last_sap_item_cd:"";
						
						var p = $.extend({ cust_prod_yn: "N", layer_yn: data.layer_yn, classkey : classkey, brandCode: brand_cd, styleCode: style_cd, productCode: last_sap_item_cd, quickview_yn:quickview_yn}, p || {});
						elandmall.popup.storeReceiptLayer(p);
					
					}else{
						
						if($("#field_rec_choice",scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
							$("input[name=field_rec]:checked", scope_div).prop('checked', false);
						}else if($("#recev_slt", $("#detailform",scope_div)).length > 0){
							$("input[name=field_rec]:checked", scope_div).prop('checked', false);
						}
						
						if( jwNormal_yn == "Y" ) {
							$("#branchInfoBox").hide();
							if(type == "PKG"){
								$("li[name=branchInfoBox]").hide();
							}else{
								$("#branchInfoBoxL").hide();
							}
						}
						
						elandmall.goodsDetail.initSelectsBox(scope_div);
						elandmall.goodsDetail.visibleTotalAmt();
						elandmall.goodsDetail.sumMultiTotal(scope_div);
						_google_analytics();
					}
			    }
			},//[END] 추가 상품(단품) 그리기
			
			fnCallbackResultStoreNormal : function(p){
				commonUI.dimRemove();
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn:"N";
				var omsSaleQty = (typeof(p.saleQty) != "undefined")? p.saleQty:"";
				
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				var type = "";
				if($("#goods_type_cd").val() == "80"){
					type = "PKG";
				}else{
					type = "DEF";
				}
				
				var form = $(".L" + p.classkey, scope_div);
				var hidden = null;
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopCode").val(p.shopCode);
				hidden.appendTo(form);
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopName").val(p.shopName);
				hidden.appendTo(form);
				hidden = $("<input />").attr("type", "hidden").attr("name", "omsSaleQty").val(omsSaleQty);
				hidden.appendTo(form);
				
				var item_nm  = "";
				var disp_seq = "";
				var goods_nm = "";
				if(p.layer_yn == "Y"){
					item_nm = $("#gd_float_opt_fix").find(".L" + p.classkey).find("[name=item_nm]").val();
					disp_seq = $("#gd_float_opt_fix").find(".L" + p.classkey).find("[name=disp_seq]").val();
					goods_nm = $("#gd_float_opt_fix").find(".L" + p.classkey).find("[name=goods_nm]").val();
				}else{
					item_nm = $(".goods_detail_txt").find(".L" + p.classkey).find("[name=item_nm]").val();
					disp_seq = $(".goods_detail_txt").find(".L" + p.classkey).find("[name=disp_seq]").val();
					goods_nm = $(".goods_detail_txt").find(".L" + p.classkey).find("[name=goods_nm]").val();
				}
				
				form.find('.goods_sel_na').text("");
				
				if(type == "PKG"){
					form.find('.goods_sel_na').text("[매장수령]["+p.shopName+"] 선택" + disp_seq+") " + goods_nm + " " + item_nm);
					$("li[name=branchInfoBox]").hide();
				}else{
					form.find('.goods_sel_na').text("[매장수령]"+"["+p.shopName+"]" + item_nm);
					$("#branchInfoBox").hide();
					$("#branchInfoBoxL").hide();
				}
				$("input[name=field_rec]:checked", scope_div).prop('checked', false);
				elandmall.goodsDetail.initSelectsBox(scope_div);
				elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotal(scope_div);
				_google_analytics();
			
				commonUI.dimRemove();
			},
			
			
			fnCallbackCloseStoreNormal : function(p){
				
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn:"N";
				
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				if($("#field_rec_choice",scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
				}else if($("#recev_slt", $("#detailform",scope_div)).length > 0){
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
				}
		        
				elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotal();
				_google_analytics();
		        
				commonUI.dimRemove();
				return false;
			},
			
			//주문서 다른 수령방법 체크 
			fnReceiveChoiceValid : function(pin){
				var scope_div = pin.div;
		    	var confirmDupCnt = 0;
		    	var field_rec_val = pin.field_rec_val;
		    	// 첫번째 Row에 선물하기가 있는지 체크한다.
		    	if(scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "50"){
		    		if(field_rec_val != "50"){
		    			confirmDupCnt++;
		    		}
		    	}else if(scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "50"){
		    		if(field_rec_val == "50"){
		    			confirmDupCnt++;
		    		}
		    	}
		    	
		    	if(scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "60"){
		    		if(field_rec_val != "60"){
		    			confirmDupCnt++;
		    		}
		    	}else if(scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "60"){
		    		if(field_rec_val == "60"){
		    			confirmDupCnt++;
		    		}
		    	}

		    	if(scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "70"){
		    		if(field_rec_val != "70"){
		    			confirmDupCnt++;
		    		}
		    	}else if(scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "70"){
		    		if(field_rec_val == "70"){
		    			confirmDupCnt++;
		    		}
		    	}
				
		    	if(confirmDupCnt > 0){
		    		if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
	    				$(".choiceGoods", scope_div).find('li').remove();
						elandmall.util.ga(pin.category, pin.action, pin.label);
				        elandmall.goodsDetail.visibleTotalAmt();
				        elandmall.goodsDetail.sumMultiTotal();
				        return true;
	    			}else{
	    				$("input[name=field_rec]:checked", scope_div).prop('checked', false);
	    				commonUI.dimRemove();
	    				return false;
	    			}
		    	}
		    	return true;
		    	
			},
			
			
			
			//[START] 추가 상품(단품) 그리기(장바구니,마이페이지)
			drawAddGoodsOrigin : function(pin){
				var repData = pin.data[0];
				var data = pin.data;
				var vORD_POSS_MIN_QTY = 1;//p.min_qty;
				var set_param = pin.set_param;
				var html = "";
				var cmps_goods_nm = "";
				var cart_grp_cd = "10";
				var type = (typeof(pin.type) != "undefined")? pin.type:"DEF";
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")? pin.quickview_yn:"N";
				var classkey = "";
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				if(type == "SET"){
					if(typeof(set_param) != "undefined"){
						$.each(set_param.set_cmps_item_no, function(idx, cmp_no){
							classkey += cmp_no;
						});
					}
					//세트상품일 때, 대표상품 정보 재설정
					$(data).each(function(){
						if(String($(this)[0].GOODS_NO) == String($("#goods_no",scope_div).val())){
							repData = $(this)[0];
						}
					});
					
				}else{
					
					classkey = repData.GOODS_NO + repData.ITEM_NO;
				}
				
				
				var addCheck = false;
			    if(repData.RET_CODE != "0000"){
			    	if(repData.RET_CODE == "-0002" || repData.RET_CODE == "-0005" || repData.RET_CODE == "-0041") {
			    	    alert("상품이 품절 되었습니다.");
			        } else if(repData.RET_CODE == "-0003" ) {
			        	alert("상품이 판매가능한 기간이 아닙니다.");
			        } else {
			        	alert("상품이 판매가 종료되었습니다.");
			        }
			    	addCheck = true ;
			    	return false;
			    }
			    
				//$(".L"+classkey, $("#detailform")).each(function(i,item){
			    
			   if($(".L"+classkey, $("#detailform", scope_div)).length > 0){
				   if(field_rec_val != scope_div.find(".choiceGoods").find('li').eq(0).find('input[name=cart_grp_cd]').val() && jwNormal_yn == "Y"){
					   alert("동일한 옵션으로 여러 수령 방식의 주문은 불가 합니다.");  
				   } else {
					   alert("이미 추가된 옵션입니다. 수량 조절은 아래 선택사항에서 해주십시오.");
				   }
			       addCheck = true ;
			   }					   
				//});
			    if(!addCheck){
			    
					var p = {};
					p.goods_no       = repData.GOODS_NO;
					p.vir_vend_no   = repData.VIR_VEND_NO;
					p.goods_type_cd = repData.GOODS_TYPE_CD;
					p.item_no       = repData.ITEM_NO; 
					p.ord_poss_max_qty_st_cd = repData.ORD_POSS_MAX_QTY_ST_CD; 
					p.min_qty = repData.ORD_POSS_MIN_QTY < 1 ? 1 : repData.ORD_POSS_MIN_QTY;
					p.max_qty = repData.ORD_POSS_MAX_QTY; 
					p.sale_poss_qty = repData.SALE_POSS_QTY;
					p.nplus_base_cnt =repData.NPLUS_BASE_CNT;
					p.nplus_cnt =repData.NPLUS_CNT;
					p.classkey = classkey;
					p.sale_unit_qty = repData.SALE_UNIT_QTY;
					p.quickview_yn = quickview_yn;
					
					if( p.goods_type_cd != "50" && +p.sale_unit_qty > 1 ){// N+1 이 아니고 sale_unit_qty가 0보다 크면 주문단위수량 상품
						if(p.min_qty <= 1){
							p.min_qty = p.sale_unit_qty;
				        }else if( p.min_qty > 1 && ((p.min_qty % + p.sale_unit_qty) > 0 )){
				            //나누어 0이 보다 크면 단위수량으로 셋팅 처리 
				        	p.min_qty = Math.ceil(p.min_qty/p.sale_unit_qty) * p.sale_unit_qty;
				        }    
					}
					
					var pinStr = JSON.stringify(p).replace(/\"/gi, "'");
					var pinInputStr = pinStr != "" ? pinStr.substring(0, pinStr.length-1) : "";
					//옵션상품일 때,
					
					if($("#field_rec_choice",scope_div).length > 0){	//지점상품이면서 현장수령선택이 가능할 때,
						cart_grp_cd = $("input[name=field_rec]:checked", scope_div).val();
					}else if($("#recev_slt", $("#detailform",scope_div)).length > 0){
						cart_grp_cd = $("#recev_slt", $("#detailform",scope_div)).attr("data-value");
					}
					
					//세트상품일때,
					if(type == "SET"){
						$("select[id^=cmps_goods_grp]",$("#detailform", scope_div)).each(function(idx){
							var selectedOpt = $(this).children("option:selected");
							var cmps_grp_seq = $(this).data("cmps_grp_seq");
							var grp_nm = $("#setGrp"+cmps_grp_seq).children(".opt_box_title").text();
							var cmps_qty= $(this).data("cmps_qty");
							var goods_no = $(selectedOpt).val();
							var item_no = $(this).data("item_no");
							var vir_vend_no = $(this).data("vir_vend_no");
							var set_cmps_item_no = $(this).data("set_cmps_item_no");
							if(cmps_goods_nm != ""){
								cmps_goods_nm += "<br />";
							}  
							var strDataInfo = "{\"cmps_qty\":\""+cmps_qty+"\", \"cmps_grp_seq\":\""+cmps_grp_seq+"\", \"goods_no\":\""+goods_no+"\", \"vir_vend_no\":\""+vir_vend_no+"\", \"item_no\":\""+item_no+"\", \"set_cmps_item_no\":\""+set_cmps_item_no+"\"}";
							if($(selectedOpt).data("multi_item_yn") == "Y"){				
								var item_nm = "";
								$("select[id^=item_opt_nm]", "#setGrp"+cmps_grp_seq).each(function(idx){ 
									if(item_nm != ""){
										item_nm +="/"; 
									}
									item_nm += $(this).children("option:selected").text();
								});
								cmps_goods_nm += "<strong id=\"choiceGrp"+cmps_grp_seq+"\" data-cmps_info='" + strDataInfo + "'>["+grp_nm+"]</strong> " + $(selectedOpt).text() + " " + item_nm;
				
							}else{
								cmps_goods_nm += "<strong id=\"choiceGrp"+cmps_grp_seq+"\" data-cmps_info='" + strDataInfo + "'>["+grp_nm+"]</strong> " + $(selectedOpt).text();
							}
						});
					//
					}else if(type == "PKG"){
						if(typeof(repData.disp_seq) != "undefined"){
							cmps_goods_nm += "선택"+repData.disp_seq+") "
						}
						if( typeof(repData.vend_nm) != "undefined" && repData.vend_nm != ""){
							cmps_goods_nm += "["+repData.vend_nm+"]";
						}
						if(repData.RESERV_LIMIT_DIVI_CD == "10"){
							cmps_goods_nm += "[예약배송]"
						}else if(repData.RESERV_LIMIT_DIVI_CD == "20"){
							cmps_goods_nm += "[프리오더]"
						}
						if($("#recev_slt",$("#detailform", scope_div)).length > 0){
							if( cart_grp_cd == "40" ){
								cmps_goods_nm += "[방문수령]";
							}else{
								cmps_goods_nm += "[택배배송]";
							}
						}
						if(repData.MULTI_ITEM_YN == "Y"){
							cmps_goods_nm += repData.GOODS_NM +" "+ repData.ITEM_NM;
						}else{
							cmps_goods_nm += repData.GOODS_NM;
						}
						
						
					}else{
						
						if($("#reserv_limit_divi_cd", scope_div).val() == "10" ){	//예약상품일 때, 커밍순일때, (묶음이나 세트는 예약 X)
							cmps_goods_nm += "[예약배송] ";
						}else if($("#reserv_limit_divi_cd", scope_div).val() == "20"){ //프리오더 일때,
							cmps_goods_nm += "[프리오더] ";
						}
						
						if(typeof($("#vend_nm", scope_div).val()) != "undefined"){
							cmps_goods_nm += "["+$("#vend_nm", scope_div).val()+"]";
							if($("#field_rec_choice",$("#detailform", scope_div)).length > 0){
								if( cart_grp_cd == "40" ){
									cmps_goods_nm += "[방문수령] ";
								}else{
									cmps_goods_nm += "[택배배송] ";
								}
							}
						
						}
						
		 				cmps_goods_nm += repData.ITEM_NM;
		 				
		 				if( +p.max_qty > 0 && +p.max_qty <= 10 ){
		 					if(p.ord_poss_max_qty_st_cd == "20"){
			 					cmps_goods_nm += "<br/> (1인당 최대" + p.max_qty + "개)";
			 				}else if(p.ord_poss_max_qty_st_cd == "10"){
			 					cmps_goods_nm += "<br/> (주문당 최대" + p.max_qty + "개)";
			 				}
		 				}
		 				
		 				
		 				
					}
					html += "<li  class=\"L" + classkey +"\">";
					html +=	"	<div class=\"goods_sel_na\">"; //+data.ITEM_NM;
					html += cmps_goods_nm;
					if(typeof(pin.gift_goods_dtl_no) != "undefined"){
						html +=	"<br/>사은품 : "+pin.gift_nm;
						//html += "<input type=\"hidden\" name=\"gift_goods_dtl_no\" value=\""+pin.gift_goods_dtl_no+"\"/>";
					}
					//세트일 때,
					if(typeof(data) != "undefined"){
						$.each(data, function(idx,result){
							if(idx > 0){
								html += "<input type=\"hidden\" id=\"sale_poss_qty_" + result.GOODS_NO + result.ITEM_NO + "\" value=\""+result.SALE_POSS_QTY +"\"/>";
							}
						});
					}
					//
					var strgatag = "PC_상품상세||";
					var middletag="";
					if(type == "PKG"){
						middletag += "묶음상세_상품수량_변경";
					}else if(type == "SET"){
						middletag += "세트상세_상품수량_변경";
					}else{
						middletag += "공통_상품수량 변경";
					}
					strgatag += middletag+ "||";
					
					html += "</div>"
					html += "	<input type=\"hidden\" name=\"sale_price\" value=\""+repData.CUST_SALE_PRICE+"\" class=\"input\"/>"; 
					html +=	"	<div class=\"goods_sel_co\">";
					html +=	"		<div class=\"goods_sel_co_area\">";
					html +=	"			<a href=\"javascript:void(0);\" class=\"goods_sel_co_mi\" data-ga-tag=\"" + strgatag + "-\" onclick=\"elandmall.goodsDetail.setMinus("+pinStr+");return false;\" onkeypress=\"this.onclick;\" >수량 감소</a>";
					html +=	"			<a href=\"javascript:void(0);\" class=\"goods_sel_co_pl\" data-ga-tag=\"" + strgatag + "+\" onclick=\"elandmall.goodsDetail.setPlus("+pinStr+");return false;\" onkeypress=\"this.onclick;\">수량 증가</a>";
					html +=	"			<input type=\"text\" class=\"goods_sel_co_in\" name=\"ord_qty\" onblur=\"elandmall.goodsDetail.checkKeyPressQty("+pinInputStr+", obj:this});\" title=\"수량\" value=\""+p.min_qty+"\" />";
					html +=	"		</div>";
					html +=	"	</div>";
					html +=	"	<div class=\"goods_sel_pr\">";
					html +=	"		<strong class=\"itemPrc\">"+elandmall.util.toCurrency(repData.CUST_SALE_PRICE*p.min_qty)+"</strong>원";
					html +=	"	</div>";
					html +=	"	<div class=\"goods_sel_de\">";
					html +=	"		<a href=\"javascript:void(0);\" onclick=\"elandmall.goodsDetail.removeItem({classkey:'"+p.classkey+"', item_no:'?"+p.item_no+"', category:'PC_상품상세', action:'"+middletag+"', label:'x'})\" class=\"ico_del\"></a>";
					html +=	"	</div>";
					html += "</li>";
					$(".choiceGoods", scope_div).prepend(html);
					var form = $(".L" + classkey, scope_div);
					var hidden = null;
					if(type == "DEF"|| type == "PKG"){

						if(type == "PKG"){
							hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").val(repData.GOODS_NO);
							hidden.appendTo(form);
						}else{
							if($(":input[name=item_no]", "#detailform").size() >= 1) {
								hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").val(repData.GOODS_NO);
								hidden.appendTo(form);
				
							}
						}

						hidden = $("<input />").attr("type", "hidden").attr("name", "vir_vend_no").val(repData.VIR_VEND_NO);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "item_no").val(repData.ITEM_NO);
						hidden.appendTo(form);
					}
					hidden = $("<input />").attr("type", "hidden").attr("name", "goods_nm").val(repData.GOODS_NM);
					hidden.appendTo(form);
					hidden = $("<input />").attr("type", "hidden").attr("name", "brand_nm").val(repData.BRAND_NM);
					hidden.appendTo(form);
					
					if ( pin.gift_goods_dtl_no ){
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_goods_dtl_no").val(pin.gift_goods_dtl_no);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_stock_qty").val(pin.gift_stock_qty);
						hidden.appendTo(form);
					}
					hidden = $("<input />").attr("type", "hidden").attr("name", "cart_grp_cd").val(cart_grp_cd);
					hidden.appendTo(form);
					elandmall.goodsDetail.initSelectsBox(scope_div);
					elandmall.goodsDetail.visibleTotalAmt();
					elandmall.goodsDetail.sumMultiTotal(scope_div);
					_google_analytics();
			    }
			},//[END] 추가 상품(단품) 그리기
			clickCpnDown:function(p){
				var vPromo_no = p.promo_no;
				var vCert_key = p.cert_key;
				var loginCallback = function(){
					
					elandmall.cpnDown({
						promo_no:vPromo_no,
						cert_key:vCert_key, 
						p_yn:"Y",
						callback:function(rst){
							$("#cpnDownBtn").hide()
							$("#cpnDownBtn").children("span").children().remove("img");
							var vCpnTxt = $("#cpnDownBtn").children("span").html();
							$("#cpnDownBtn").remove();
							if ( rst != null ) {
								var arrEndDtime = rst.AVAL_END_DTIME.split("\ ");
								var arrEndDate = arrEndDtime[0].split("-");
								var appendHTML = "";
								appendHTML += "<span class=\"font_12\">"+vCpnTxt+" 다운완료(~"+arrEndDate[1]+"-"+arrEndDate[2]+")</span>";
								$("#downCpnTp").before(appendHTML);
								$("#downCpnTp_txt").html("쿠폰명 :"+rst.PROMO_NM+"쿠폰<br />사용기간 : ~"+arrEndDtime[0]+" 까지");

							} else {
								var appendHTML = "";
								appendHTML += "<span class=\"font_12\">"+vCpnTxt+" 다운완료</span>";
								$("#downCpnTp").before(appendHTML);
							}
						}
					});
				}
				elandmall.isLogin({login:loginCallback});
			},
			clickCpnDown_kimsclub:function(p){
				var vPromo_no = p.promo_no;
				var vCert_key = p.cert_key;
				var loginCallback = function(){
					
					$("#gd_float_opt_fix").removeClass("groups");
                    elandmall.popup.fnLayerReturn();
                    isLoginCheckAjax();

					elandmall.cpnDown({
						promo_no:vPromo_no,
						cert_key:vCert_key, 
						p_yn:"Y",
						callback:function(rst){
							$("#cpnDownBtn").hide();
							$("#cpnDownBtnEnd").show();
						}
					});
				}
				var fnCancel = function(){
					$("#gd_float_opt_fix").removeClass("groups");
                    elandmall.popup.fnLayerReturn();
				}
				elandmall.isLogin({login:loginCallback,close:fnCancel});
			},
			clickCpnDown2:function(p){
				var vPromo_no = p.promo_no;
				var vCert_key = p.cert_key;
				var loginCallback = function(){
					
					elandmall.cpnDown({
						promo_no:vPromo_no,
						cert_key:vCert_key, 
						p_yn:"Y",
						callback:function(rst){
							var vCpnTxt = $("#cpnDownBtn2").children("span").html();
							var vEndDateTxt = "";
							if ( rst != null ) {
								var arrEndDtime = rst.AVAL_END_DTIME.split("\ ");
								var arrEndDate = arrEndDtime[0].split("-");
								vEndDateTxt = "(~"+arrEndDate[1]+"-"+arrEndDate[2]+")";
							}

							var appendHTML = "";
							appendHTML += "<span>"+vCpnTxt+" 다운로드완료"+vEndDateTxt+"</span>";
							
							$("#cpnDownBtn2").html(appendHTML);
							$("#cpnDownBtn2").attr('disabled','disabled');
						}
					});
				}
				elandmall.isLogin({login:loginCallback});
			},
			cardCpnDown:function(p){
				var vPromo_no = p.promo_no;
				var vCert_key = p.cert_key;
				var vCpn_Idx = p.cpn_idx;
				var loginCallback = function(){
					
					elandmall.cpnDown({
						promo_no:vPromo_no,
						cert_key:vCert_key, 
						p_yn:"Y",
						callback:function(rst){
							$("#"+vCpn_Idx).attr('disabled','disabled');
							$("#"+vCpn_Idx).children("span").html('쿠폰받기완료');
						}
					});
				}
				elandmall.isLogin({login:loginCallback});
			},
			fnCpnDown:function(p){
				var vPromo_no = p.promo_no;
				var vCert_key = p.cert_key;
				var loginCallback = function(){
					elandmall.cpnDown({
						promo_no:vPromo_no,
						cert_key:vCert_key
					});
				}
				elandmall.isLogin({login:loginCallback});
			},
			clickFltLayer:function(){
				$('.opt_on_off_area').toggleClass('on');
				if($("#detailPreview").is(":visible") == true && $("#on_opt_box").is(":visible") == true){

					var goods_no = String($("#detail_part").data("goods_no"));
					var grp_seq = (typeof($("#detail_part").data("grp_seq")) != "undefined")? $("#detail_part").data("grp_seq") : "";

					if(grp_seq != "" && grp_seq != null){
						$("#cmps_goods_grp"+grp_seq+"L").val(String(goods_no));
						$("#cmps_goods_grp"+grp_seq+"L").change();
					}else{	//묶음일 때,
						
                        var goods_no = String($("#detail_part").data("goods_no"));
                        var grp_seq = (typeof($("#detail_part").data("grp_seq")) != "undefined")? $("#detail_part").data("grp_seq") : "";
                        
                        $("#pkgCmpsGoods_L").val(goods_no);
                        $("#pkgCmpsGoods_L").change();
                        
                        $("[name=focusLspan]").removeClass("selected");
                        $("[name=focusLspan]").find('.ancor').removeClass("pSel");
                        
                        var optBtn = $("#pkgCmpsGoods_L").parent().parent().find('.ancor');
                        if(optBtn.length > 0){
                        	elandmall.goodsDetail.initSelectsBox($(".goods_wrap"));
	                        $.each(optBtn, function() {
                                   if($(this).attr("data-value") == goods_no){
                                      $("#focusLspan_"+goods_no).addClass("selected");
                                      $("#focusLspan_"+goods_no).find('.ancor').addClass("pSel");
                                   }
	                        });
	                        
	                        var $li = $("#pkgCmpsGoods_L").parent().parent();
	
							commonUI.view.lyrSlt.prototype.goToSelect($li);
                        }
					}

				}
				//
				
			},
			clickAddOptBtn:function(p){
				if($("#on_opt_box").is(":visible") == false){
					elandmall.goodsDetail.clickFltLayer();
				}
				
				var goods_no = p.goods_no;
				var grp_no = (typeof(p.grp_no) != "undefined" && p.grp_no !="null")? p.grp_no : "";
				if(grp_no != ""){
					//$("#cmps_goods_grp"+grp_no+"L").val(String(goods_no));
					//$("#cmps_goods_grp"+grp_no+"L").change();
					var optBtn = $("#cmps_goods_grp"+grp_no+"L").parent().parent().find('.ancor');
					$.each(optBtn, function() {
						if($(this).data("value")==goods_no){
							$(this).click();
							return;
						}
					});
				}else{//묶음일 때,
					var optBtn = $("#pkgCmpsGoods_L").parent().parent().find('.ancor');
					$.each(optBtn, function() {
						if($(this).data("value")==goods_no){
							$(this).click();
							return;
						}
					});
				}
			},
			checkDonationAmt:function(event){
				setTimeout(function(){
					var regexp = /[^0-9]/gi;
					var view_val = $("#view_donation_amt").val();
					var real_val = +view_val.replace(regexp,'');
					var sale_price = +$("#sale_price").val();

					$("#view_donation_amt").val(elandmall.util.toCurrency(real_val));
					$("#donation_amt").val(real_val);
	
				},800);
			},
			validDonation : function(){
				var dnt_amt = +$("#donation_amt").val();
				var st_amt = +$("#sale_price").val();
				var real_val = 0;
				if(dnt_amt % st_amt > 0){
					if(dnt_amt < st_amt){
						alert("기부금액 입력은 "+elandmall.util.toCurrency(st_amt)+"원 이상부터 가능 합니다.");
						real_val = st_amt;
					}else{
						alert(elandmall.util.toCurrency(st_amt)+"원 단위 이상으로만 입력 가능 합니다. \n"+elandmall.util.toCurrency(st_amt)+"원 단위로 재조정 하여  제공하였습니다.")
						real_val = Math.floor(dnt_amt/st_amt) * st_amt;
					}

					$("#view_donation_amt").val(elandmall.util.toCurrency(real_val));
					$("#donation_amt").val(real_val);
					return false;
				}
				return true;
			},
			//기부하기
			fnDonation : function(){
				setTimeout(function(){ 
					var formObj = $("#detailform");
					var sale_price = +$("#sale_price", formObj).val();
					var donation_amt = +$("#donation_amt", formObj).val();
					var myPoint = +$("#myPoint").val();
					
					if(!elandmall.goodsDetail.validDonation()){
						return false;
					}
					
					if ( sale_price > myPoint ){
						alert("보유하신 포인트가 부족합니다.");
						return false;
					}else if (donation_amt > myPoint){
						alert("보유하신 복지 포인트는 '"+elandmall.util.toCurrency(myPoint)+"원' 입니다.");
						var maxDonation_amt = Math.floor(myPoint/sale_price) * sale_price;
						$("#view_donation_amt", formObj).val(maxDonation_amt);
						$("#view_donation_amt", formObj).keyup();
						return false;
					}else if ( sale_price > donation_amt ){
						alert("기부금액 입력은 '"+elandmall.util.toCurrency(sale_price)+"원' 이상부터 가능 합니다.");
						return false;
					}else if ( donation_amt < 1 || donation_amt%sale_price > 0 ){
						alert("기부하실 금액이 일치하지 않습니다.");
						return false;
					}else if ( !confirm("입력하신 기부 포인트는 '"+elandmall.util.toCurrency(donation_amt)+"원'입니다. 기부하시겠습니까?")){
						return false;
					}
					$.ajax({
						url: "/goods/registDonation.action",
						data: {
								goods_no: formObj.data("goods_no"),
								vir_vend_no: $("#detailform").data("vir_vend_no"),
								use_point : donation_amt
								},
						type: "POST",
						dataType: "json",
						success: function(data) {
							alert("고객님의 복지 포인트 "+elandmall.util.toCurrency(donation_amt)+"원 이 기부되었습니다. 감사합니다.");
							location.reload();
						},error:function(e){
							if( e.ret_code != null && e.ret_code != "" && e.ret_msg != null && e.ret_mgs != ""){
								alert(e.ret_msg);
							}else{
								alert("기부하는 중 오류가 발생하였습니다.");
							}
						}
					});
				},800);
				
			},
			
			
			
			fnSelectItem : function(p){
				p = $.extend({ goods_no: set_goods_no, item_no: "", vir_vend_no: set_vir_vend_no,low_vend_type_cd:set_low_vend_type_cd, deli_goods_divi_cd:set_deli_goods_divi_cd,  quickview_yn:set_quickview_yn, styleCode:set_styleCode }, p || {});
				var quickview_yn = p.quickview_yn;
				var div = null;
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
					
				}else{
					div = $(".goods_wrap");
				}
				
				var event_layer_yn = div.find("input[name='event_layer_yn']").val();
				//.sel_txt에 값들 다 세팅해서 처리하자
				var currObj = $(p.obj);
				var opt_idx = $(p.obj).parents('.options').data('index');
				var layer_yn = $(p.obj).parents('.options').attr('data-layer_yn');
				
				var $li = $(p.obj).parent('li');
				var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
				if(!$li.hasClass('sld_out')){
					$selBtn.find('.sel_txt').attr('data-sel-msg',$(p.obj).find('.opt_name').text());
					$selBtn.find('.sel_txt').data('sel-msg',$(p.obj).find('.opt_name').text());

					//[ECJW-9] 옵션 불러오기 I/F 
					$selBtn.find('.sel_txt').attr('data-sel-cd', $(p.obj).parent().data('code'));
					$selBtn.find('.sel_txt').attr("data-sap_item_cd",$li.attr("data-sap_item_cd"));
					
					$selBtn.find('.sel_txt').attr("data-value",$li.attr("data-value"));
					$('.lyr_select').removeClass('on');
					$li.addClass('selected').siblings('li').removeClass('selected');
					showText($selBtn);
				}
				
//				var opt = div.find("[id^=options_nm1]");
				
				var color_chip_val = $("#color_mapp_option").val();
				var size_chip_val = $("#size_mapp_option").val();
				
				if(color_chip_val == opt_idx){
					p["color_yn"] = "Y";
				}
				if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){
					p["reserv_yn"] = "Y";
				}else{
					p["reserv_yn"] = "N";
				}
				
				var calendar_opt = div.find("[id^=item_opt_nm"+(opt_idx+1)+"]").attr('data-opt_nm');  
				if(calendar_opt == calenderStr){
					p["calendar_yn"] = "Y";
				}
				
				elandmall.optLayerEvt.changeItem({
					param:{ goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no, low_vend_type_cd: p.low_vend_type_cd,deli_goods_divi_cd: p.deli_goods_divi_cd, reserv_yn:p.reserv_yn, styleCode:p.styleCode, jwFlag: jwFlag, carve_yn : set_carve_yn,  quickview_yn:set_quickview_yn, calendar_yn: p.calendar_yn,jwNormalFlag:jwNormalFlag , event_layer_yn : event_layer_yn},
					color_chip_val: color_chip_val,
					color_chip_yn:"Y",
					div:div,
					chgObj:$(p.obj),
					callback_ajax:function(result){
						var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
						if(color_chip_val == result.next_idx){
							elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
							elandmall.goodsDetail.drawSizeChipHtmlInit({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
						}
						if(size_chip_val == result.next_idx){
							elandmall.goodsDetail.drawSizeChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
						}else{
							if(last_yn == "Y")	$("#sizeChipDiv").hide();
						}
						
						if(typeof(result.calenderDataList) != "undefined"){
							if(result.calenderDataList.length > 0 ){
								calenderDataList = result.calenderDataList;
							}
						}
					},
					callback:function(result){
						var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
						//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
						var currVal = currObj.parent().attr("data-value");
						$("#last_item_no").val(currVal);
						$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
						
						var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
						param["curr_idx"] = opt_idx;
						
						if(last_yn == "Y" && color_chip_val > 1){
							$("#colorChipDiv").hide();
							$("#sizeChipInitDiv").hide();
							$("#sizeChipDiv").hide();
						}
						
						//[ECJW-9] 옵션 불러오기 I/F
						if(jwFlag){
							
							var opt = div.find("[id^=options_nm"+result.next_idx+"]");
							var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
								
							if(next_cd == "" || typeof(next_cd) == "undefined" && set_field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && set_present_yn == "Y"){
								$("#branchInfoBox").show();
								$("#branchInfoBoxL").show();
							}else{
								
								if(last_yn == "Y" && currVal != ""){
									//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
									if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
										param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
									}
									param["item_no"] = currVal;
									//사은품이 있다면
									if($("#giftInfo", div).length > 0 ){
										if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
											//마지막 옵션 선택 후, 사은품의 disabled 해제
											/*$("[id^=gift_slt]", div).prop("disabled", false);*/
											$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
											$("#gift_slt", div).data("itemInfo", param);
										}else{	//사은품이 1개일 때,
											param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
											param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
											param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).attr("data-value");
											//fnItemChoice(param);
											elandmall.optLayerEvt.getItemPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														data:data,
														quickview_yn:quickview_yn,
														layer_yn : layer_yn,
														gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm"),
														gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", div))).attr("data-value"),
														gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty")
													});
												}
											});
										}
									}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
		
										//[ECJW-9] 옵션 불러오기 I/F 
										if(jwFlag){
											
											param["layer_yn"] = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('layer_yn');
											param["goods_no"] = $("#goods_no").val();
											param["goods_nm"] = $("#goods_nm").val();
											elandmall.goodsDetail.jwGoodsAddParam({
												param:param,
											});
											
										
										}else{
											
											elandmall.optLayerEvt.getItemPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														data:data,
														quickview_yn:quickview_yn,
														layer_yn : layer_yn
													});
												}
											});
										}
										
									}//[END]사은품이 없을 때 항목을 바로 추가 한다.
								}else{
									if(last_yn == "Y" && currVal == ""){
										$("[id^=gift_slt]", div).attr("data-value","");
										$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
										$("[id^=gift_slt]", div).data("sel-msg","");
										$("[id^=gift_slt]", div).parent().removeClass("selected");
										$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
										$("#gift_slt", div).attr("data-itemInfo","");
									}else if(last_yn != "Y"){
										$("[id^=gift_slt]", div).attr("data-value","");
										$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
										$("[id^=gift_slt]", div).data("sel-msg","");
										$("[id^=gift_slt]", div).parent().removeClass("selected");
										$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
										$("#gift_slt", div).attr("data-itemInfo","");
									}
								}
							}
								
							
						}else{
							if(jwNormalFlag && (set_field_recev_poss_yn == "Y" || set_present_yn == "Y")){
								//alert("selectItem");
								if(last_yn == "Y" && currVal != ""){
									//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
									if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
										param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
									}
									param["item_no"] = currVal;
									//사은품이 있다면
									if($("#giftInfo", div).length > 0 ){
										if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
											//마지막 옵션 선택 후, 사은품의 disabled 해제
											/*$("[id^=gift_slt]", div).prop("disabled", false);*/
											$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
											$("#gift_slt", div).data("itemInfo", param);
										}else{	//사은품이 1개일 때,
											param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
											param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
											param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).attr("data-value");
											//fnItemChoice(param);
											$("#branchInfoBox").show();
											$("#branchInfoBoxL").show();
										}
									}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
										$("#branchInfoBox").show();
										$("#branchInfoBoxL").show();
									}//[END]사은품이 없을 때 항목을 바로 추가 한다.
								}else{
									if(last_yn == "Y" && currVal == ""){
										$("[id^=gift_slt]", div).attr("data-value","");
										$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
										$("[id^=gift_slt]", div).data("sel-msg","");
										$("[id^=gift_slt]", div).parent().removeClass("selected");
										$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
										$("#gift_slt", div).attr("data-itemInfo","");
									}else if(last_yn != "Y"){
										$("[id^=gift_slt]", div).attr("data-value","");
										$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
										$("[id^=gift_slt]", div).data("sel-msg","");
										$("[id^=gift_slt]", div).parent().removeClass("selected");
										$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
										$("#gift_slt", div).attr("data-itemInfo","");
									}
								}
							}else{
								if(last_yn == "Y" && currVal != ""){
									//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
									if($("#low_vend_type_cd",$("#detailform", div)).val() == "40" || $("#low_vend_type_cd",$("#detailform", div)).val() == "50"){
										param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
									}
									param["item_no"] = currVal;
									//사은품이 있다면
									if($("#giftInfo", div).length > 0 ){
										if($("#giftInfo", div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
											//마지막 옵션 선택 후, 사은품의 disabled 해제
											/*$("[id^=gift_slt]", div).prop("disabled", false);*/
											$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
											$("#gift_slt", div).data("itemInfo", param);
										}else{	//사은품이 1개일 때,
											param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
											param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
											param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).attr("data-value");
											//fnItemChoice(param);
											elandmall.optLayerEvt.getItemPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														data:data,
														quickview_yn:quickview_yn,
														layer_yn : layer_yn,
														gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm"),
														gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", div))).attr("data-value"),
														gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty")
													});
												}
											});
										}
									}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
										
										//[ECJW-9] 옵션 불러오기 I/F 
										if(jwFlag){
											
											param["layer_yn"] = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('layer_yn');
											param["goods_no"] = $("#goods_no").val();
											param["goods_nm"] = $("#goods_nm").val();
											elandmall.goodsDetail.jwGoodsAddParam({
												param:param,
											});
											
											
										}else{
											
											elandmall.optLayerEvt.getItemPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														data:data,
														quickview_yn:quickview_yn,
														layer_yn : layer_yn
													});
												}
											});
										}
										
									}//[END]사은품이 없을 때 항목을 바로 추가 한다.
								}else{
									if(last_yn == "Y" && currVal == ""){
										$("[id^=gift_slt]", div).attr("data-value","");
										$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
										$("[id^=gift_slt]", div).data("sel-msg","");
										$("[id^=gift_slt]", div).parent().removeClass("selected");
										$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
										$("#gift_slt", div).attr("data-itemInfo","");
									}else if(last_yn != "Y"){
										$("[id^=gift_slt]", div).attr("data-value","");
										$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
										$("[id^=gift_slt]", div).data("sel-msg","");
										$("[id^=gift_slt]", div).parent().removeClass("selected");
										$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
										$("#gift_slt", div).attr("data-itemInfo","");
									}
								}
							}
							
						}
						
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
				
			},
			
			
			
			fnCarveSelectItem : function(p){
				var currObj = $(p.obj);
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")?p.quickview_yn:"N";
				var div = null;
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
				}
				var opt_cd = currObj.parent().attr('data-code');
				var parent_opt_cd = currObj.parent().parent().attr('data-opt_cd');
				var layer_yn = (typeof(p.layer_yn) != "undefined")? p.layer_yn:"";
				
				if($("#goods_type_cd").val() == "80"){
					set_field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
					set_present_yn = $("#item_opt_li_data").attr('data-present_yn');
				}
				
				var field_recev_poss_yn = (typeof(set_field_recev_poss_yn) != "undefined")? set_field_recev_poss_yn:"N";
				var present_yn = (typeof(set_present_yn) != "undefined")? set_present_yn:"N";
				
				
				var add_selects = currObj.parents('.add_selects');
				var $li = $(p.obj).parent('li');
				var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
				var opt_idx = $selBtn.find('.sel_txt').attr('data-index');
				var slt_opt_val = $(p.obj).find('.opt_name').text();
				var sel_msg = $(p.obj).find('.opt_name').text()
				var obj_value =$li.attr("data-code");
				
				var options = div.find("#options_nm"+opt_idx);
				$.each(options.children('li'), function(idx, opt){
					if($(opt).attr('data-value') == obj_value){
						$(opt).addClass("selected");
					}else{
						$(opt).removeClass("selected");
					}
				})
				var $li = options.children('.selected');
				var $selBtn = options.parent().siblings('.sel_btn');
				$selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').data('sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').attr('data-sel-cd',obj_value);
				$('.lyr_select').removeClass('on');
				$li.addClass('selected').siblings('li').removeClass('selected');
				showText($selBtn);
			
				
				if($("div#gd_float_opt_fix").length > 0){
					
					var options = div.find("#options_nm"+opt_idx+"L");
					$.each(options.children('li'), function(idx, opt){
							$(opt).addClass("selected");
					})
					var $float_li = options.children('.selected');
					var $float_selBtn = options.parent().siblings('.sel_btn');
					
					$float_selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
					$float_selBtn.find('.sel_txt').data('sel-msg',sel_msg);
					$float_selBtn.find('.sel_txt').attr('data-sel-cd',obj_value);
					$('.lyr_select').removeClass('on');
					$float_li.addClass('selected').siblings('li').removeClass('selected');
					showText($float_selBtn);
				}
				
				
				$("li[name=li_input_carve]").remove();
				$("button[name=carvePriceBtn]").remove();
				
				var code_is = "IS";
				var code_os = "OS";
				var carve_length = currObj.parents('.options').attr('data-carve_len');
				
				if(parent_opt_cd == "ISOS" || parent_opt_cd == "OSIS"){
					carve_length = carve_length.split(',');
				}
				var carve_is_leng = "";
				var carve_out_leng = "";
				
				if(parent_opt_cd == "ISOS" ){
					carve_is_leng = carve_length[0];
					carve_out_leng = carve_length[1];
				}else if(parent_opt_cd == "OSIS"){
					carve_out_leng = carve_length[0];
					carve_is_leng = carve_length[1];
				}else if(parent_opt_cd == "IS"){
					carve_is_leng = carve_length;
				}else if(parent_opt_cd == "OS"){
					carve_out_leng = carve_length;
				}
				
				var html = '';
				if(opt_cd == "ISOS" || opt_cd == "OSIS"){
					
					html += '<li name="li_input_carve">';
					html += '<div class="same_th">속각인</div>';
					html += '<input type="text" id="in_carve" name="in_carve" class="anno"  placeholder="공백포함/최대 '+ carve_is_leng +'자" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_is +'\', leng:\''+ carve_is_leng +'\'});">';
					html += '</li>';
					
					html += '<li name="li_input_carve">';
					html += '<div class="same_th">겉각인</div>';
					html += '<input type="text" id="out_carve" name="out_carve" class="anno" placeholder="공백포함/최대 '+ carve_out_leng +'자" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_os +'\', leng:\''+ carve_out_leng +'\'});">';
					html += '</li>';
					
				}else if(opt_cd == "IS"){
					
					html += '<li name="li_input_carve">';
					html += '<div class="same_th">속각인</div>';
					html += '<input type="text" id="in_carve" name="in_carve" class="anno"  placeholder="공백포함/최대 '+ carve_is_leng +'자" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_is +'\', leng:\''+ carve_is_leng +'\'});">';
					html += '</li>';
				
				}else if(opt_cd == "OS"){
					
					html += '<li name="li_input_carve">';
					html += '<div class="same_th">겉각인</div>';
					html += '<input type="text" id="out_carve" name="out_carve" class="anno"  placeholder="공백포함/최대 '+ carve_out_leng +'자" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_os +'\', leng:\''+ carve_out_leng +'\'});">';
					html += '</li>';
					
				}
				
				if(field_recev_poss_yn == "Y" || present_yn == "Y" ){
					$("#branchInfoBox").show();
					$("#branchInfoBoxL").show();
					$('li[name="branchInfoBox"]').show();
				}else{
					if(opt_cd != "XXXX"){
						if(typeof(layer_yn) == "undefined" || layer_yn == "undefined"){
							layer_yn = "";
						}
						/*						
						html+= '<li name="li_input_carve">';
						html+= '<button type="button" class="anno_btn btn03" id="carvePriceBtn" name="carvePriceBtn" data-layer_yn="' + layer_yn + '"  onclick="elandmall.goodsDetail.fnCarveGetPriceItem({obj:this, carve_code: \''+ opt_cd +'\', carve_is_leng:\''+carve_is_leng+'\', carve_out_leng:\''+carve_out_leng+'\',  layer_yn:\''+ layer_yn +'\', quickview_yn:\''+quickview_yn+'\'})">';
						html+= '<span>가격 조회</span>';
						html+= '</button>';
						html += '</li>';
						*/	
						
					var dataPram = {obj:this, carve_code:  opt_cd , carve_is_leng: carve_is_leng , carve_out_leng: carve_out_leng,  layer_yn: layer_yn, quickview_yn: quickview_yn};
						
					
						if(div.find("input[name='field_rec']").length < 1 ){
							//가격조회 버튼 노출
							div.find(".fin_price_parents > button").each(function(){
								$(this).attr("data-layer_yn",layer_yn);
								$(this).unbind("click",elandmall.goodsDetail.fnCarveGetPriceItem);
								$(this).bind("click",dataPram ,elandmall.goodsDetail.fnCarveGetPriceItem);
								$(this).show();
							});	
						}

					}
					
				}
				
				
				div.find(".goods_detail_txt").find('.add_selects').find('li#li_id_carve').after(html);
				div.find("#gd_float_opt_fix").find('.add_selects').find('li#li_id_carve').after(html);
				
				//[END] item select change event 
				function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
					if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
						$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
					}
					else{
						$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
					}
				}
			
				//주문제작 실시간 옵션가 가져오기
				elandmall.optLayerEvt.getJwItemPriceRealtime({obj : div ,opt_idx : opt_idx});
				
			},
			
			
			fnCarveKeyup : function(p){
				
				var layer_yn = "";
				var div = $(".goods_detail_txt");
				var div_float = $("#gd_float_opt_fix");
				
				if($(p.obj).parents('#gd_float_opt_fix').length > 0){
					layer_yn = "Y";
				}
				
				if(layer_yn == "Y"){
					
					if(p.input_type == "IS"){
						fnLimitText(layer_yn, div, div_float,'in_carve', p.leng);
					}else if(p.input_type == "OS"){
						fnLimitText(layer_yn, div, div_float,'out_carve',p.leng);
					}
				}else{
					if(p.input_type == "IS"){
						fnLimitText(layer_yn, div, div_float,'in_carve',p.leng);
					}else if(p.input_type == "OS"){
						fnLimitText(layer_yn, div, div_float,'out_carve',p.leng);
					}
				}
				
				
				function fnLimitText (layer_yn, div,div_float,textid, limit){
					var text = ""; // 이벤트가 일어난 컨트롤의 value 값
					
					if( layer_yn == "Y"){
						text = div_float.find('#'+textid).val();
					}else{
						text = div.find('#'+textid).val();
					}
					
					var textlength = text.length; // 전체길이 
				 
					// 전체길이를 초과하면 
					if(textlength > limit){ 
						alert("제한된 글자수를 초과 하였습니다."); 
						var text2 = text.substr(0, limit); 
						div.find('#'+textid).val(text2);
						div_float.find('#'+textid).val(text2);
						return;
					}else{
						if( layer_yn == "Y"){
							div.find('#'+textid).val(div_float.find('#'+textid).val());
						}else{
							div_float.find('#'+textid).val(div.find('#'+textid).val());
						}
					} 
				}
				
				
			},
			
			fnCarveGetPriceItem : function(pin){
				var p = $.extend({},pin.data);
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn:"N";
				//한번더 체크한다.
				if(quickview_yn == "N"){
					quickview_yn = (typeof(set_quickview_yn) != "undefined")? set_quickview_yn:"N";
				}
				var div = null;
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
				}else{
					div = $(".goods_wrap");
				}
				var $li = $(p.obj).parent('li');
				var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
				var opt_idx = $selBtn.find('.sel_txt').attr('data-index');
				var slt_opt_val = $(p.obj).find('.opt_name').text();
				var sel_msg = $(p.obj).find('.opt_name').text();
				var obj_value =$li.attr("data-code");
				
				var options = div.find("#options_nm"+opt_idx);
				$.each(options.children('li'), function(idx, opt){
					if($(opt).attr('data-value') == obj_value){
						$(opt).addClass("selected");
					}else{
						$(opt).removeClass("selected");
					}
				})
				var $li = options.children('.selected');
				var $selBtn = options.parent().siblings('.sel_btn');
				$selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').data('sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').attr('data-sel-cd',obj_value);
				$('.lyr_select').removeClass('on');
				$li.addClass('selected').siblings('li').removeClass('selected');
				showText($selBtn);
				
				var options = div.find("#options_nm"+opt_idx+"L");
				$.each(options.children('li'), function(idx, opt){
						$(opt).addClass("selected");
				})
				var $float_li = options.children('.selected');
				var $float_selBtn = options.parent().siblings('.sel_btn');
				
				$float_selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
				$float_selBtn.find('.sel_txt').data('sel-msg',sel_msg);
				$float_selBtn.find('.sel_txt').attr('data-sel-cd',obj_value);
				$('.lyr_select').removeClass('on');
				$float_li.addClass('selected').siblings('li').removeClass('selected');
				showText($float_selBtn);
				
				
				var layer_yn = (typeof(p.layer_yn) != "undefined")? p.layer_yn:"";
				var carve_div = div.find(".goods_detail_txt");
				var carve_floatDiv = div.find("#gd_float_opt_fix");
				
				if($(p.obj).parent().attr('data-code') != "XXXX"){
					if(layer_yn == "Y"){
						if(p.carve_code == "ISOS" || p.carve_code == "OSIS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv,'in_carve', 'IS', p.carve_is_leng) ){
								return false;
							}
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv,'out_carve', 'OS', p.carve_out_leng) ){
								return false;
							}
							//공백 및 특수문자 체크 영역
							if(fnStrChkText(carve_floatDiv,'in_carve', 'IS')){
								return false;
							}else if(fnStrChkText(carve_floatDiv,'out_carve', 'OS')){
								return false;
							}
						}else if(p.carve_code == "IS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv,'in_carve', 'IS', p.carve_is_leng) ){
								return false;
							}
							//공백 및 특수문자 체크 영역
							if(fnStrChkText(carve_floatDiv,'in_carve', 'IS')){
								return false;
							}
						}else if(p.carve_code == "OS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv,'out_carve', 'OS', p.carve_out_leng) ){
								return false;
							}
							//공백 및 특수문자 체크 영역
							if(fnStrChkText(carve_floatDiv,'out_carve', 'OS')){
								return false;
							}
						}
						
					}else{
						
						if(p.carve_code == "ISOS" || p.carve_code == "OSIS"){
							//길이체크 영역 
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv,'in_carve', 'IS', p.carve_is_leng) ){
								return false;
							}
							//길이체크 영역
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv, 'out_carve', 'OS', p.carve_out_leng) ){
								return false;
							}
							var chkIn = div.find("#in_carve").val();
							var chkOut = div.find("#out_carve").val();
							if(chkIn == "" && chkOut == "") {
								alert("각인을 입력해 주세요.");
								return false;
							}else if(fnStrChkText(carve_div, 'in_carve', 'IS')){
								return false;
							}else if(fnStrChkText(carve_div, 'out_carve', 'OS')){
								return false;
							}
						}else if(p.carve_code == "IS"){
							//길이체크 영역
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv, 'in_carve', 'IS', p.carve_is_leng) ){
								return false;
							}
							//공백 및 특수문자 체크 영역
							if(fnStrChkText(carve_div, 'in_carve', 'IS')){
								return false;
							}
						}else if(p.carve_code == "OS"){
							//길이체크 영역
							if(fnLengthChk(layer_yn, carve_div, carve_floatDiv, 'out_carve', 'OS', p.carve_out_leng) ){
								return false;
							}
							//공백 및 특수문자 체크 영역
							if(fnStrChkText(carve_div, 'out_carve', 'OS')){
								return false;
							}
						}
					}
					
					
					
					
				}else if($(p.obj).parent().attr('data-code') == "XXXX"){
					div.find(".goods_detail_txt").find('li[name="li_input_carve"]').remove();
					div.find(".goods_detail_txt").find('input[name="in_carve"]').val("");
					div.find("#gd_float_opt_fix").find('li[name="li_input_carve"]').remove();
					div.find("#gd_float_opt_fix").find('input[name="in_carve"]').val("");
				}
				
				//.sel_txt에 값들 다 세팅해서 처리하자
				var currObj = $(p.obj);
				
				var last_yn = "N";
				
				if($("#goods_type_cd").val() == "80"){
					set_field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
					set_present_yn = $("#item_opt_li_data").attr('data-present_yn');
				}
				
				if(set_field_recev_poss_yn == "N" && set_present_yn == "N"){
					last_yn = "Y";
				}
				
				var currVal = currObj.parent().attr("data-value");
				var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
				
				//[ECJW-9] 옵션 불러오기 I/F
				if(set_field_recev_poss_yn == "Y" || set_present_yn == "Y"){ 
					if($("#goods_type_cd").val() == "80"){
						$("li[name=branchInfoBox]").show();
					}else{
						$("#branchInfoBox").show();
						$("#branchInfoBoxL").show();
					}
				}else{
					
					//[START]사은품이 없을 때 항목을 바로 추가 한다.

					if($("#goods_type_cd").val() == "80"){
						param["goods_no"] = currObj.parents('.add_selects').find('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-goods_no');
						param["goods_nm"] = currObj.parents('.add_selects').find('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-sel-msg');
						param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
						param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
						param["layer_yn"] = p.layer_yn;
					}else{
						if( typeof(p.layer_yn) != "undefined" ) {
							param["layer_yn"] = p.layer_yn;
						}else{
							param["layer_yn"] = currObj.parent().find('.lyr_select').children('.sel_btn').children('.sel_txt').data('layer_yn');
						}
						
						param["goods_nm"] = $("#goods_nm").val();
						param["goods_no"] = $("#goods_no").val();
					}
					
					param["carve_code"] = p.carve_code;
					param["quickview_yn"] = quickview_yn;
					
					elandmall.goodsDetail.jwGoodsAddParam({
						param:param,
					});
					
				
				}//[END]사은품이 없을 때 항목을 바로 추가 한다.
				
				
				//[END] item select change event 
				function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
					if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
						$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
					}
					else{
						$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
					}
				}
				
				function fnLengthChk (layer_yn, div,div_float, textid, opt,length){
					var text = ""; // 이벤트가 일어난 컨트롤의 value 값
					if(layer_yn == "Y"){
						text = div_float.find('#'+textid).val();
					}else{
						text = div.find('#'+textid).val();
					}
					var textlength = text.length; // 전체길이
					var result_chk = false;
					// 전체길이를 초과하면 
					if(textlength > length){ 
						alert("제한된 글자수를 초과 하였습니다."); 
						var text2 = text.substr(0, length); 
						div.find('#'+textid).val(text2);
						div_float.find('#'+textid).val(text2);
						result_chk = true;
						return result_chk; 
					}else{
						if( layer_yn == "Y"){
							div.find('#'+textid).val(div_float.find('#'+textid).val());
						}else{
							div_float.find('#'+textid).val(div.find('#'+textid).val());
						}
					}
					
				}
				
				function fnStrChkText (div, textid, opt){
					var text = ""; 
					var result_chk = false;
					text = div.find('#'+textid).val();
					if($.trim(text) == ""){
						if(opt == "IS"){
							alert("속각인 입력을 해주세요.");
						}else if(opt == "OS"){
							alert("겉각인 입력을 해주세요.");
						}
						result_chk = true;
						return result_chk;
					}
					var regEx = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\-\!\&\*\+\=\(\)\＆\☆\★\♡\♥\,\.\/\♪\♫]+$/;
					if(!regEx.test(text) ){
						alert("입력 불가한 문자가 존재 합니다.\n (한글,영문,일부 특수기호만 가능)");
						result_chk = true;
						return result_chk; 
					}
				}
			},
			
			
			
			
			
			
			
			fnSelectSetItem : function(obj){
				//goods_no,vir_vend_no,cmps_grp_seq
				var obj = obj.obj;
				var cmps_grp_seq = $(obj).parents('.opt_box').attr('data-cmps_grp_seq');
				var div = $("[id^=setGrp"+cmps_grp_seq+"]");
				var goods_no = $("#cmps_goods_grp"+cmps_grp_seq).attr('data-goods_no');
				var vir_vend_no = $("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no");
				var reserv_yn = "N";
				var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
				
				var currObj = $(obj);
				var opt_idx = currObj.parent().parent('.options').attr('data-index');
				var $li = currObj.parent();
				var $selBtn = currObj.parent().parent().parent().siblings('.sel_btn');
				if(!$li.hasClass('sld_out')){
					$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
					
					//[ECJW-9] 옵션 불러오기 I/F 
					$selBtn.find('.sel_txt').attr('data-sel-cd', $(this).find('.opt_name').parent().parent().data('code') );
					
					$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
					$('.lyr_select').removeClass('on');
					$li.addClass('selected').siblings('li').removeClass('selected');
					showText($selBtn);
					elandmall.optLayerEvt.changeItem({
						param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:$("#goods_no").val(), reserv_yn: reserv_yn, cmps_grp_seq:cmps_grp_seq  , event_layer_yn : event_layer_yn},
						div:div,
						chgObj:currObj,
						callback:function(result){
							
							var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
							var currVal = currObj.parent().attr("data-value");
							
							if(last_yn== "Y" && currVal != ""){
								if(goods_no != "" || goods_no != undefined){
									$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "Y");
									
								}else{
									$("#cmps_goods_grp"+cmps_grp_seq).data("choice_yn", "N");
								}
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", goods_no);
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", currObj.parent().attr("data-vir_vend_no"));
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", currVal);
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", currObj.parent().attr("data-set_cmps_item_no")); // <- 세트상품 구성단품번호
								
								//사은품이 있다면
								if($("#giftInfo").length > 0 ){ 
									if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
										if(elandmall.goodsDetail.checkSetGoodsChoice()){ 
											//마지막 옵션 선택 후, 사은품의 disabled 해제
											var param = elandmall.optLayerEvt.addSetGoodsParam();
											$("[id^=gift_slt]").parents(".lyr_select").removeClass("disabled");
											$("#gift_slt").data("itemInfo", param);
											
										}else{
											$("#gift_slt").attr("data-value","");
											$("[id^=gift_slt]").parents(".lyr_select").addClass("disabled");
											$("#gift_slt").attr("data-itemInfo","");
										}
									}else{	//사은품이 1개일 때,
										if(elandmall.goodsDetail.checkSetGoodsChoice()){
											
											var param = elandmall.optLayerEvt.addSetGoodsParam();
											elandmall.optLayerEvt.getSetGoodsPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														type:"SET",
														data:data,
														set_param:param,
														gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
														gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).attr("data-value"),
														gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
													});
													elandmall.goodsDetail.sumMultiTotal();
													
												}
											});
										}
										
									}
								}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
									if(elandmall.goodsDetail.checkSetGoodsChoice()){
										var param = elandmall.optLayerEvt.addSetGoodsParam();
										elandmall.optLayerEvt.getSetGoodsPrice({
											param:param,
											success:function(data){
												elandmall.goodsDetail.drawAddGoods({
													type:"SET",
													data:data,
													set_param:param
												});
												elandmall.goodsDetail.sumMultiTotal();
												
											}
										});
										//alert("성공");
									}else{
										
									}
								}//[END]사은품이 없을 때 항목을 바로 추가 한다.
								
							}
							
						}//[END]callback function
					});//[END]elandmall.optLayerEvt.changeItem
				}


				function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
					if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
						$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
					}
					else{
						$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
					}
				}
				_google_analytics();


			},
			
			fnSelectPkgBtn : function(obj, selectedOpt){
				
				var goods_no = $("#pkgCmpsGoods").attr('data-goods_no');
				var vir_vend_no = $("#pkgCmpsGoods").attr("data-vir_vend_no");
				var quickview_yn = $("#pkgCmpsGoods").attr("quickview_yn");
				var reserv_yn = "N";
				var selectedOpt = selectedOpt;
				var scope_div = null;
				if(quickview_yn == "Y" ){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				var event_layer_yn =  scope_div.find("input[name='event_layer_yn']").val();
				
				var color_chip_val = +$("#color_mapp_option").val();
				
				var ps = $.extend({ goods_no: goods_no, item_no: "", vir_vend_no: vir_vend_no, low_vend_type_cd: $("#low_vend_type_cd",$("#detailform", scope_div)).val(), quickview_yn: quickview_yn }, ps || {});
				
				var selBtn_Index = $(obj).children().data('index');
				
				var optNm = scope_div.find("[id^=options_nm"+ selBtn_Index +"]");
				
				if(optNm.data("opt_nm") == calenderStr){
				
					
					var hope_date = $(obj).parent();
					
					
					var yyyymm = hope_date.attr("yyyymm");
					
					var calendar = hope_date.parent().find("div.lyr_calendar");

					calendar.removeClass("off").addClass("on");
					
					var closeCalendar = function() {
						calendar.removeClass("on").addClass("off");
						calendar.empty();
						$('.lyr_select').removeClass('on');
					};
					
					var load = function(ps) {
						
						ps = $.extend({yyyymm: yyyymm, calenderDataList : JSON.stringify(calenderDataList)}, ps);
						calendar.load(elandmall.util.newHttps("/goods/initDetailCalendar.action"), ps, function(responseText, textStatus, jqXHR) {
							var days = calendar.find("a[name='day']");
							if (textStatus == "error") {
								return false;
							};
							calendar.find("a.btn_prev_month, a.btn_next_month").click(function() {
								var yyyymm = $(this).attr("yyyymm");
								p["yyyymm"] = yyyymm; 
								load($.extend({},p));
								return false;
							});
							days.click(function() {
								
								var currObj = $(this);
								var opt_idx = $(this).parents('.options').data('index');
								var selBtn = currObj.parents('.lyr_select');
								selBtn.find('.sel_txt').attr('data-sel-msg', currObj.attr('text'));
								selBtn.find('.sel_txt').text(currObj.attr('text'));
								$('.lyr_select').removeClass('on');
								
								elandmall.optLayerEvt.changeItem({
									param: { goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:$("#goods_no", scope_div).val() , event_layer_yn : event_layer_yn},
									div:scope_div,
									chgObj:$(this),
									callback:function(result){
											var param = { goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no")};
											param["curr_idx"] = opt_idx;
											var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
											var currVal = currObj.attr("data-value");
											if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
//												aaaaa				
												param["item_no"] = currVal;
												//사은품이 있다면
												if($("#giftInfo", scope_div).length > 0 ){ 
													if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
														if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
															var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
															itemParam[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
															itemParam[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
															elandmall.optLayerEvt.getItemPrice({
																param:itemParam,
																success:function(data){
																	elandmall.goodsDetail.drawAddGoods({
																		type:"PKG",
																		data:data,
																		gift_nm:itemParam["gift_nm"],
																		gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																		gift_stock_qty:itemParam["gift_stock_qty"]
																	});
																}
															});
														}else{
															//마지막 옵션 선택 후, 사은품의 disabled 해제
															$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
															param["disp_seq"] = $(selectedOpt).data("disp_seq");
															param["vend_nm"] = $(selectedOpt).data("vend_nm");
															$("#gift_slt", scope_div).data("itemInfo", param);
														}
													}else{	//사은품이 1개일 때,
															$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
															if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
																param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
																param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value");
																elandmall.optLayerEvt.getItemPrice({
																	param:param,
																	success:function(data){
																		data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																		data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																		
																		elandmall.goodsDetail.drawAddGoods({
																			type:"PKG",
																			quickview_yn:quickview_yn,
																			data:data,
																			gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																			gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr('data-value'),
																			gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
																		});
																	}
																});
															}
													}
												}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn", "Y");
														if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
															elandmall.optLayerEvt.getItemPrice({
																param:param,
																success:function(data){
																	data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
																	data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
																	
																	elandmall.goodsDetail.drawAddGoods({
																		type:"PKG",
																		quickview_yn:quickview_yn,
																		data:data
																	});
																}
															});
														}else{
															param["disp_seq"] = $(selectedOpt).data("disp_seq");
															param["vend_nm"] = $(selectedOpt).data("vend_nm");
															$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
														}
//																	
												}//[END]사은품이 없을 때 항목을 바로 추가 한다.
											}else{
													//마지막옵션이 아니거나 값이 선택되지 않았을 때,
													if(currObj.data("last") == "Y" && currObj.attr("data-value") == ""){
														if($("#gift_slt", scope_div).length > 0){
															$("#gift_slt", scope_div).attr("data-value","");
															$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
															$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
															$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
															$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
															$("#gift_slt", scope_div).data("itemInfo", param);
														}else{
															$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
														}
													}
												}
											}
										});
							});
							
						});
					};
					
					if (hope_date.hasClass("on")) {
						load(ps);
					} else {
						closeCalendar();
					};
					
				}
				
				
				
				
			},
			
			fnSelectPkgItem : function(obj){
				
				var obj = obj.obj;
				var goods_no = $("#pkgCmpsGoods").attr('data-goods_no');
				var vir_vend_no = $("#pkgCmpsGoods").attr("data-vir_vend_no");
				var quickview_yn = $("#pkgCmpsGoods").attr("quickview_yn");
				var reserv_yn = "N";
				var selectedOpt = "N";
				var scope_div = null;
				if(quickview_yn == "Y" ){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
					
					var lay_wrap = $("#_GOODSPREVIEW_LAYER_").find(".lay_wrap").length;
					if(lay_wrap > 0){
						scope_div = $("#_GOODSPREVIEW_LAYER_ .lay_wrap");
					}
				}
				
				var field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
				var present_yn = $("#item_opt_li_data").attr('data-present_yn');
				var low_vend_type_cd = $("#item_opt_li_data").attr('data-low_vend_type_cd');
				var deli_goods_divi_cd = $("#item_opt_li_data").attr('data-deli_goods_divi_cd');
				var styleCode = $("#item_opt_li_data").attr('data-style_cd');
				var carve_yn = $("#item_opt_li_data").attr('data-carve_yn');
				
				if(low_vend_type_cd == "50" && deli_goods_divi_cd == "30"){
					jwFlag = true;
					
				}else{
					jwFlag = false;
				}
				
				//주얼리 일반상품
				if(low_vend_type_cd == "50" && deli_goods_divi_cd == "10"){
					jwNormalFlag = true;
					
				}else{
					jwNormalFlag = false;
				}
				
				
				var currObj = $(obj);
				
				var opt_idx = currObj.parent().parent('.options').data('index');
				var layer_yn =  currObj.parent().parent('.options').attr('data-layer_yn');
				var $li = currObj.parent();
				var $selBtn = currObj.parent().parent().parent().siblings('.sel_btn');
				
				var color_chip_val = + $("#item_opt_li_data").attr("data-color_mapp");
				var size_chip_val = + $("#item_opt_li_data").attr("data-size_mapp");
				
				if(!$li.hasClass('sld_out')){
					$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
					$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
					$selBtn.find('.sel_txt').attr('data-value',currObj.parent().attr("data-value"));

					$selBtn.find('.sel_txt').attr('data-sel-cd', currObj.parent().data('code'));
					
					$('.lyr_select').removeClass('on');
					$li.addClass('selected').siblings('li').removeClass('selected');
					showText($selBtn);
					elandmall.optLayerEvt.changeItem({
						param: { goods_no: goods_no, vir_vend_no: vir_vend_no, pkg_goods_yn:"Y", pkg_goods_no:$("#goods_no", scope_div).val(), jwFlag:jwFlag, low_vend_type_cd:low_vend_type_cd
							   		, deli_goods_divi_cd:deli_goods_divi_cd, styleCode : styleCode, carve_yn: carve_yn,layer_yn : layer_yn, quickview_yn: quickview_yn, jwNormalFlag:jwNormalFlag},
						color_chip_val: color_chip_val,
						color_chip_yn:"Y",
						div:scope_div,
						chgObj:$(obj),
						callback_ajax:function(result){
							calenderDataList = result.calenderDataList;
							if(color_chip_val == result.next_idx){
								elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
								elandmall.goodsDetail.drawSizeChipHtmlInit({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
							}
							if(size_chip_val == result.next_idx){
								elandmall.goodsDetail.drawSizeChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn, pkgGoods:"N"});
							}else{
								$("#ul_pkgCmpsGoods").find("#sizeChipDiv").hide();
							}
						},
						callback:function(result){
							var param = { goods_no: goods_no, vir_vend_no: vir_vend_no};
							param["curr_idx"] = opt_idx;
							var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
							var currVal = currObj.parent().attr("data-value");
							
							
							if(low_vend_type_cd == "50" && deli_goods_divi_cd == "30"){
								var opt = scope_div.find("[id^=options_nm"+result.next_idx+"]");
								var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
								
								if(next_cd == "" || typeof(next_cd) == "undefined" && field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && present_yn == "Y"){
									$("li[name=branchInfoBox]").show();
								}else{
									
									if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
										//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
										if(low_vend_type_cd == "40" || low_vend_type_cd == "50"){
											param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
										}
										param["item_no"] = currVal;
										//사은품이 있다면
										if($("#giftInfo", scope_div).length > 0 ){ 
											if($("#giftInfo",scope_div).attr("data-multi_yn") == "Y"){	//사은품이 여러개일 때,
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
													itemParam[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
													itemParam[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
													elandmall.optLayerEvt.getItemPrice({
														param:itemParam,
														success:function(data){
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																data:data,
																gift_nm:itemParam["gift_nm"],
																gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																gift_stock_qty:itemParam["gift_stock_qty"]
															});
														}
													});
												}else{
													//마지막 옵션 선택 후, 사은품의 disabled 해제
													$("[id^=gift_slt]", scope_div).parents(".lyr_select").removeClass("disabled");
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
													$("#gift_slt", scope_div).data("itemInfo", param);
												}
											}else{	//사은품이 1개일 때,
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
													param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
													param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value");
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data,
																gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value"),
																gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
															});
														}
													});
												}
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
											if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){

												//[ECJW-9] 옵션 불러오기 I/F 
												if(jwFlag){
													
													param["GOODS_NM"] = $("#pkg_goods_nm").val();
													param["vir_vend_no"] = vir_vend_no;
													param["layer_yn"] = currObj.parent().parent().attr('data-layer_yn');
													param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
													param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
													
													elandmall.goodsDetail.jwGoodsAddParam({
														param:param,
													});
													
												}else{
													
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data
															});
														}
													});
													
												}
												
											}else{
												param["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
												param["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
												$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
											}
											
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										//마지막옵션이 아니거나 값이 선택되지 않았을 때,
										if(last_yn == "Y" && currVal == ""){
											if($("#gift_slt", scope_div).length > 0){
												$("[id^=gift_slt]", scope_div).attr("data-value","");
												$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", scope_div).data("sel-msg","");
												$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
												$("#gift_slt", scope_div).attr("data-itemInfo","");
											}else{
												$("#pkgCmpsGoods", scope_div).data("choice_yn", "N");
											}
										
										}else if(last_yn != "Y"){
											$("[id^=gift_slt]", scope_div).attr("data-value","");
											$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", scope_div).data("sel-msg","");
											$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
											$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
											$("#gift_slt", scope_div).attr("data-itemInfo","");
										}
									}
								}
								
								
							}else{
								if(jwNormalFlag && (field_recev_poss_yn == "Y" || present_yn == "Y")){
									if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
										//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
										if(low_vend_type_cd == "40" || low_vend_type_cd == "50"){
											param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
										}
										param["item_no"] = currVal;
										//사은품이 있다면
										if($("#giftInfo", scope_div).length > 0 ){ 
											if($("#giftInfo",scope_div).attr("data-multi_yn") == "Y"){	//사은품이 여러개일 때,
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
													itemParam[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
													itemParam[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
													elandmall.optLayerEvt.getItemPrice({
														param:itemParam,
														success:function(data){
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																data:data,
																gift_nm:itemParam["gift_nm"],
																gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																gift_stock_qty:itemParam["gift_stock_qty"]
															});
														}
													});
												}else{
													//마지막 옵션 선택 후, 사은품의 disabled 해제
													$("[id^=gift_slt]", scope_div).parents(".lyr_select").removeClass("disabled");
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
													$("#gift_slt", scope_div).data("itemInfo", param);
												}
											}else{	//사은품이 1개일 때,
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													$("li[name=branchInfoBox]").show();
												}
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("li[name=branchInfoBox]").show();
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										//마지막옵션이 아니거나 값이 선택되지 않았을 때,
										if(last_yn == "Y" && currVal == ""){
											if($("#gift_slt", scope_div).length > 0){
												$("[id^=gift_slt]", scope_div).attr("data-value","");
												$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", scope_div).data("sel-msg","");
												$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
												$("#gift_slt", scope_div).attr("data-itemInfo","");
											}else{
												$("#pkgCmpsGoods", scope_div).data("choice_yn", "N");
											}
										
										}else if(last_yn != "Y"){
											$("[id^=gift_slt]", scope_div).attr("data-value","");
											$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", scope_div).data("sel-msg","");
											$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
											$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
											$("#gift_slt", scope_div).attr("data-itemInfo","");
										}
									}
								}else{
									if(last_yn == "Y" && currVal != ""){	//옵션이 마지막이면서 값이 있을 때,
										//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
										if(low_vend_type_cd == "40" || low_vend_type_cd == "50"){
											param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
										}
										param["item_no"] = currVal;
										//사은품이 있다면
										if($("#giftInfo", scope_div).length > 0 ){ 
											if($("#giftInfo",scope_div).attr("data-multi_yn") == "Y"){	//사은품이 여러개일 때,
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
													itemParam[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
													itemParam[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
													elandmall.optLayerEvt.getItemPrice({
														param:itemParam,
														success:function(data){
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																data:data,
																gift_nm:itemParam["gift_nm"],
																gift_goods_dtl_no:itemParam["gift_goods_dtl_no"],
																gift_stock_qty:itemParam["gift_stock_qty"]
															});
														}
													});
												}else{
													//마지막 옵션 선택 후, 사은품의 disabled 해제
													$("[id^=gift_slt]", scope_div).parents(".lyr_select").removeClass("disabled");
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
													$("#gift_slt", scope_div).data("itemInfo", param);
												}
											}else{	//사은품이 1개일 때,
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
													param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
													param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value");
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data,
																gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value"),
																gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
															});
														}
													});
												}
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
											if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){

												//[ECJW-9] 옵션 불러오기 I/F 
												if(jwFlag){
													
													param["GOODS_NM"] = $("#pkg_goods_nm").val();
													param["vir_vend_no"] = vir_vend_no;
													param["layer_yn"] = currObj.parent().parent().attr('data-layer_yn');
													param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
													param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
													
													elandmall.goodsDetail.jwGoodsAddParam({
														param:param,
													});
													
												}else{
													
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data
															});
														}
													});
													
												}
												
											}else{
												param["disp_seq"] = $("#pkgCmpsGoods", scope_div).data("disp_seq");
												param["vend_nm"] = $("#pkgCmpsGoods", scope_div).data("vend_nm");
												$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
											}
											
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										//마지막옵션이 아니거나 값이 선택되지 않았을 때,
										if(last_yn == "Y" && currVal == ""){
											if($("#gift_slt", scope_div).length > 0){
												$("[id^=gift_slt]", scope_div).attr("data-value","");
												$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", scope_div).data("sel-msg","");
												$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
												$("#gift_slt", scope_div).attr("data-itemInfo","");
											}else{
												$("#pkgCmpsGoods", scope_div).data("choice_yn", "N");
											}
										
										}else if(last_yn != "Y"){
											$("[id^=gift_slt]", scope_div).attr("data-value","");
											$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", scope_div).data("sel-msg","");
											$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
											$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
											$("#gift_slt", scope_div).attr("data-itemInfo","");
										}
									}
								}
							}
						}
					});
				}
				
				function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
					if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
						$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
					}
					else{
						$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
					}
				}
				_google_analytics();
				
			},
			limitText : function(p){  
				var text = $('#'+p.textid).val(); // 이벤트가 일어난 컨트롤의 value 값 
				var textlength = text.length; // 전체길이 
			 
				// 변수초기화 
				var i = 0;				// for문에 사용 
				var li_byte = 0;		// 한글일경우는 2 그밗에는 1을 더함 
				var li_len = 0;			// substring하기 위해서 사용 
				var ls_one_char = "";	// 한글자씩 검사한다 
				var text2 = "";			// 글자수를 초과하면 제한할수 글자전까지만 보여준다. 
			 
				for(i=0; i< textlength; i++) 
				{ 
					// 한글자추출 
					ls_one_char = text.charAt(i); 
				
					// 한글이면 2를 더한다. 
					if (escape(ls_one_char).length > 4) { li_byte += 2;}
					else{li_byte++; } // 그밗의 경우는 1을 더한다. 
					
					// 전체 크기가 limit를 넘지않으면 
					if(li_byte <= p.limit){li_len = i + 1;} 
				} 
				
				
				// 전체길이를 초과하면 
				if(li_byte > p.limit){ 
					alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다."); 
					text2 = text.substr(0, li_len); 
					$('#'+p.textid).val(text2);
					
					return false;
				} 
				return true;
			} 

	};
	//[END]elandmall.goodsDetail
	
	
	/**
	 * 사용방법
	 * 정보보기 레이어 팝업
	 * elandmall.goodDetailPreviewLayer({
	 * 			goods_no:			(상품번호)
	 * 			vir_vend_no : (가상업체번호)
	 * });
	 */
	elandmall.goodDetailPreviewLayer = {
		openLayer : function ( pin ){
			var event_layer_yn = $.type(pin.event_layer_yn) != "undefined" ? pin.event_layer_yn : "N";
			
			var p = {
					grp_no : pin.grp_no,
					sel_goods_no : pin.goods_no, 
					sel_vir_vend_no : pin.vir_vend_no, 
					goods_no : $.type(pin.base_goods_no) != "undefined" &&  pin.base_goods_no != "" ? pin.base_goods_no : $("#goods_no").val(), 
					goods_cmps_divi_cd: $.type(pin.goods_cmps_divi_cd) != "undefined" ? pin.goods_cmps_divi_cd : (event_layer_yn == "Y" ? "" :  $("#goods_cmps_divi_cd").val()),
					target:pin.target,	//리턴 타켓때문에 생성.
					pkgYn:pin.pkgYn
				};

			
			
			//이벤트페이지 레이어보기 일때는 URL 변경
			var sUrl = "/goods/initGoodsDetailPreviewLayer.action";

			if(event_layer_yn == "Y") {
				sUrl = "/goods/initGoodsDetailEventLayer.action";
				
				//추가 파라미터 설정
				p.event_key 		= pin.event_key;
				p.event_start_date	= pin.event_start_date;
				p.event_end_date	= pin.event_end_date;
				p.smsg				= pin.smsg;
				p.emsg				= pin.emsg;

			}
			
			
			var className = "layer_pop detail_group d_detailGroupLP on";
			if(elandmall.global.disp_mall_no == "0000045"){
				className = "kims layer_pop detail_group d_detailGroupLP on";
			}
			elandmall.layer.createLayer({
				layer_id:"detailPreview",
				class_name:className,
				close_call_back : elandmall.goodDetailPreviewLayer.closeLayer,
				createContent: function(layer) {
					var div = layer.div_content;
					
					$.ajax({
						url: sUrl ,
						data: p,
						type: "GET",
						dataType: "text",
						success: function(data) {
							if ( data != null && data != "" ){
								//이벤트 상품 레이어 존재 시 삭제
								if(event_layer_yn == "Y" && $("#detailPreview").length > 0){
									$("#detailPreview").remove();
								}
								div.html(data);
								
								if(event_layer_yn == "Y") {
									if(div.find(".event_soldout").attr("data-sold_yn") == "Y"){
										alert("준비한 수량이 모두 소진되었습니다.감사합니다.");
										div.find(".btn_lay_close").click();
										return;
									}
								}
								
								layer.show();
								
								if(pin.pkgYn == "Y") {
									
									elandmall.goodsDetail.initSelectsBox($(".goods_wrap")); 
									var goods_no = String($("#detail_part").data("goods_no"));
                                    var grp_seq = (typeof($("#detail_part").data("grp_seq")) != "undefined")? $("#detail_part").data("grp_seq") : "";
                                    
                                    $("#pkgCmpsGoods_L").val(goods_no);
                                    $("#pkgCmpsGoods_L").change();
                                    var optBtn = $("#pkgCmpsGoods_L").parent().parent().find('.ancor');
                                    $.each(optBtn, function() {
                                               if($(this).attr("data-value") == goods_no){
                                                  $("[name=focusLspan]").removeClass("selected");
                                                  $("#focusLspan_"+goods_no).addClass("selected");
                                                  $("[name=focusLspan]").find('.ancor').removeClass("pSel");
                                                  $("#focusLspan_"+goods_no).find('.ancor').addClass("pSel");
                                                  //$(".goods_wrap").find('.lyr_options .options li .ancor').eq(num).click();
                                               }
                                    });
                                    
                                    var $li = $("#pkgCmpsGoods_L").parent().parent();

									commonUI.view.lyrSlt.prototype.goToSelect($li);
									
								}
								
								//플로팅 활성
								$('html').css('overflow-y', 'visible');
								$('body').addClass("hidden");
								$("#detailPreview").removeAttr("style");
								$("#gd_float_opt_fix").addClass("groups");
								// 초기화
						
								
								if(event_layer_yn == "Y") {
									elandmall.goodDetailPreviewLayer.initEventLayer(div,p);
								}

							}
						}
					});
					
				}
			});
		},
		prevNextBtn : function(p){
			var quick_view_layer = $("#quick_view_layer");

			$("#quick_view_layer").remove();
			p = $.extend({preBtnYn:"Y",event_layer_yn:"Y"},p);

			
			$.ajax({
				url: "/goods/initGoodsDetailPreviewLayer.action",
				data: p,
				type: "GET",
				dataType: "text",
				success: function(data) {
					if ( data != null && data != "" ){
						var div = $(".lay_cont","#detailPreview").html(data);
						
						div.find("#detail_part").after(quick_view_layer);
						$('html').css('overflow-y', 'visible');
						$('body').addClass("hidden");
						$("#detailPreview").removeAttr("style");
						$("#gd_float_opt_fix").addClass("groups");
						
						
						if(p.event_layer_yn == "Y") {
							elandmall.goodDetailPreviewLayer.initEventLayer(div,p);
						}
					}
				}
			});
		},
		closeLayer : function(){
			$('html').css('overflow-y', 'scroll');
			$('body').removeClass("hidden");
			$("#detailPreview").hide();
			$("#gd_float_opt_fix").removeClass("groups");
		},
		openEventLayer : function(){
			$("#detailPreview").show();
			$('html').css('overflow-y', 'visible');
			$('body').addClass("hidden");
			$("#detailPreview").removeAttr("style");
			$("#gd_float_opt_fix").addClass("groups");
		},
		initEventLayer :  function(div,pin){
			var p = {};
			
			if($.type(div) == "undefined" || div.length < 1) {
				console.log("div 파라미터 null 오류");
				return;
			}

			
			//최초 옵션 리스트 조회
			var slow_vend_type_cd 	=  div.find("input[name='low_vend_type_cd']").val();
			var sjwFlag 			=  div.find("input[name='jwFlag']").val();
			var sjwNormalFlag 		=  div.find("input[name='jwNormalFlag']").val();
			var sdeli_goods_divi_cd	=  div.find("input[name='deli_goods_divi_cd']").val();
			var sfield_recev_poss_yn = div.find("input[name='field_recev_poss_yn']").val();
			var spresent_yn			=  div.find("input[name='present_yn']").val();
			var sstyleCode 			=  div.find("input[name='style_cd']").val();
			var sbrandCode 			=  div.find("input[name='brand_cd']").val();
			var scarve_yn  			=  div.find("input[name='carve_yn']").val();
			
			p = $.extend({
				low_vend_type_cd 	 : slow_vend_type_cd
				,jwFlag			 	 : sjwFlag
				,jwNormalFlag		 : sjwNormalFlag
				,deli_goods_divi_cd	 : sdeli_goods_divi_cd
				,field_recev_poss_yn : sfield_recev_poss_yn
				,present_yn			 : spresent_yn
				,styleCode			 : sstyleCode
				,brandCode			 : sbrandCode
				,carve_yn			 : scarve_yn
				,event_layer_yn		 : "Y" 
				
			},pin);
			
			elandmall.goodsDetail.initOpt(p);	
		}
	}
	
	/**
	 * 사용방법
	 * 사이즈 비교하기 레이어 팝업
	 * elandmall.goodSizeCompareLayer({
	 * 			goods_no:			(상품번호)
	 * });
	 */
	elandmall.goodSizeCompareLayer = function(p) {
		if ( $("#sizeComLayer").length>0 ){
			$("#sizeComLayer").show();
		}else{
			elandmall.layer.createLayer({
				layer_id:"sizeComLayer",
				class_name:"layer_pop type02 d_layer_pop on",
				title: "사이즈 비교하기",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/goods/searchGoodsSizeCompareLayer.action", p, elandmall.goodSizeSetLayer(layer) );
				}
			});
		}
	}
	
	elandmall.goodSizeSetLayer = function(layer) {
		var div = layer.div_content;
		if ( $("#sizeComOrdCnt", div).val() > 0 ){
			layer.show();
		}else{
			div.remove();
			alert("해당 상품과 비교할 같은 분류(카테고리)의 상품을 주문하신 이력이 없습니다.");
		}
	}
	//상품상세 탭 관련 스크립트
	elandmall.goodsDetailTab = {
		fnLoadDetail : function ( p ){
			var flag = false;
			var parentObj = $(p.obj).parents("#detail_div");
			
			var p = $.extend({
					goods_no : $("#detail_goods_no", parentObj).val(),
					goods_cmps_divi_cd : $("#detail_goods_cmps_divi_cd", parentObj).val(),
					set_goods_yn : $("#set_goods_yn", parentObj).val(),
					pkg_goods_yn : $("#pkg_goods_yn", parentObj).val()
					}, p || {});
			
			if ( p != null && !flag && $.trim(p.obj.html()) =="") {
				flag = true;
					
				$.ajax({
					url: "/goods/searchGoodsPkgSetDescBody.action",
					data: p,
					type: "GET",
					//async: false,
					success: function(data) {
						if ( data != null && data != "" ){
							p.obj.html(data);
						}
					}
				});
				_google_analytics();
			}
		},
		
		fnEval : {
			// 상품평
			fnLoadEval : function( p , objNm ){
				$(objNm).load("/goods/initGoodsEvalList.action", p, function(){
					var goodsDetailTab = elandmall.goodsDetailTab;
					var $div = $(this);
					var pin = {	obj : $div,
									eval_goods_all : $("#eval_goods_sel option:selected", $div).data("eval_goods_all")
								};	 // 현재 객체
					
					for ( var i=1; i < 5; i++){
						var cnt = $("#quest_tot_cnt").val();
						$("#questCnt"+i).text(cnt);
					}
					
					//페이지 번호 클릭시 지정된 url로 이동
					goodsDetailTab.fnPaging(objNm , pin, goodsDetailTab.fnEval.fnSearchEval);
					
					// 묶음상품 상품 변환
					$("#eval_goods_sel",$div).change(function(){
						var pin = $.extend(pin , p);
						pin.goods_no = $("#eval_goods_sel option:selected", $div).data("goods_no");
						pin.vir_vend_no = $("#eval_goods_sel option:selected", $div).data("vir_vend_no");
						pin.eval_goods_all = $("#eval_goods_sel option:selected", $div).data("eval_goods_all");
						goodsDetailTab.fnEval.fnLoadEval(pin, objNm);
					});
					
					// 조회순, 옵션순 조회
					$(".sch_gb_chk", $div).click(function(){
						$(".sch_gb_chk", $div).each(function(){
							$(this).removeClass("on");
						});
						var sval = $(this).attr("data-value");
						$(this).addClass("on");
						$("input[name='sch_gb']").val(sval);
						goodsDetailTab.fnEval.fnSearchEval(pin);
					});

					$div.find('.lyr_select .sel_btn').click(function(){ // 셀렉트 박스 클릭 시, 상품 옵션 선택 레이어 토글
						var $parent = $(this).parent('.lyr_select');
						 if(!$(this).parent().hasClass('disabled')){
							if ($(this).parent().hasClass('on')){
								$(this).parent().removeClass('on');
							}
							else{
								var $optBox = null;
								if($(this).parent().parent().parent().parent('.on_opt_box').length > 0) { //일반,묶음
									$optBox = $(this).parent().parent().parent().parent('.on_opt_box');
								}else{ //세트
									$optBox = $(this).parent().parent().parent().parent().parent('.on_opt_box');
								}
								if($optBox.hasClass('on_opt_box')){commonUI.view.lyrSlt.prototype.lyrMax($(this), $optBox)}
								$('.lyr_select').removeClass('on');
								$(this).parent().addClass('on');
								if($(this).parent().hasClass('hasDefault') && $(this).parent('.hasDefault').find('.dVal').length > 0 && !$(this).hasClass('selected'))  { //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤 //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
									var $li = $(this).parent().parent();
									commonUI.view.lyrSlt.prototype.goToDft($li);
								}
							}
							if(!$parent.hasClass('multi')){ // 멀티 선택의 경우 텍스트 반영 하지 않음.
								commonUI.view.lyrSlt.prototype.showText($(this));
							}
						}
					});
					
				   $div.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
						var $li = $(this).parent();
						var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
						var $parent  = $selBtn.parent('.lyr_select');
						if($parent.hasClass('multi')){ // 멀티 선택의 경우 토글 - 레이어 닫지 않음
							$(this).toggleClass('on');
						}
						else{
							if(!$li.hasClass('sld_out')){
								$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
								$('.lyr_select').removeClass('on');
								$li.addClass('selected').siblings('li').removeClass('selected');
								commonUI.view.lyrSlt.prototype.showText($selBtn);
							}
						}
					});
					
					
					//상품평 필터 버튼 이벤트
					$(".lyr_options .options li .ancor", $div).click(function(){
						var isAdd = false;
						var flt_dtl_no = $(this).attr("data-flt_dtl_no"); 
						if($(this).hasClass("on")) {
							isAdd = true;
						}else{
							isAdd = false;
						}
						
						var tempFltDtlNoList = $("#flt_dtl_no_list", $div).val();
						
						if(isAdd) {
							if(tempFltDtlNoList == "" ) {
								tempFltDtlNoList += flt_dtl_no;
							}else{
								tempFltDtlNoList += ","+flt_dtl_no;
							}
						}else{
							
							var arrFltDtlNoList = tempFltDtlNoList.split(",");
							for(var i=0; i < arrFltDtlNoList.length; i++) {
								if(arrFltDtlNoList[i] == flt_dtl_no ) { 
									arrFltDtlNoList.splice(i,1);
								}  
							}
							
							tempFltDtlNoList ="";
							
							for(var i=0; i < arrFltDtlNoList.length; i++) {
								if(i == 0) {
									tempFltDtlNoList += arrFltDtlNoList[i];
								}else{
									tempFltDtlNoList += ","+arrFltDtlNoList[i];
								}
							}

						}
						

						
						$("#flt_dtl_no_list", $div).val(tempFltDtlNoList);
						
						goodsDetailTab.fnEval.fnSearchEval(pin);
					});
					
					
					//옵션순 조회
					$("#sch_opt", $div).change(function(){
						goodsDetailTab.fnEval.fnSearchEval(pin);
					});
					
					// 탭선택
					$("[name=evalTab]", $div).click(function(){
						var tabObj = $(this);
						var p = $.extend({liObj: tabObj, val : tabObj.data().value},  pin );
						
						goodsDetailTab.fnEval.fnSearchEval(p);
					});
					
					// 작성하기 레이어
					$("#goodsEvalIns",$div).click(function(){
						var eval_goods_no = $("#eval_goods_no", $div).val();
						var addGoodsEval = function(){
							$.ajax({
								url: "/content/getGoodsEvalCount.action",
								data: {goods_no : eval_goods_no, disp_mall_no : elandmall.global.disp_mall_no},
								type: "POST",
								dataType: "json",
								success: function(data) {
									if ( data != null ){
										var data = data.results;
										if ( data.GOODS_EVAL_NO != "" ){
											if(elandmall.global.disp_mall_no == "0000053" || elandmall.global.disp_mall_no == "0000045"){
												if ( !confirm("이전에 등록하신 리뷰가 있습니다. \n등록하신 리뷰를 수정하시겠습니까 ?") ){
													return false;
												}
											}else{
												if ( !confirm("이전에 등록하신 상품평이 있습니다. \n등록하신 상품평을 수정하시겠습니까 ?") ){
													return false;
												}
											}
											
											var p = {
													ord_no : data.ORD_NO,
													ord_dtl_no : data.ORD_DTL_NO,
													goods_eval_no : data.GOODS_EVAL_NO,
													callback : elandmall.goodsDetailTab.fnEval.fnSearchEval
											}
											elandmall.evalLayer.editEvalLayer(p);
										}else if ( data.CNT > 1 ){
											if(elandmall.global.disp_mall_no == "0000053" || elandmall.global.disp_mall_no == "0000045"){
												if ( !confirm("작성 가능한 동일한 상품이 "+data.CNT+"개 있습니다. \n마이페이지 내 리뷰 에서 상품목록을 확인하시고 작성해 주세요") ){
													return false;	
												}
											}else{
												if ( !confirm("작성 가능한 동일한 상품이 "+data.CNT+"개 있습니다. \n마이페이지 나의 상품평 에서 상품목록을 확인하시고 작성해 주세요") ){
													return false;	
												}
											}
											
											location.href = elandmall.util.https("/mypage/initMyEvalList.action");
										}else if ( data.CNT > 0 ){
											var p = {
													ord_no : data.ORD_NO,
													ord_dtl_no : data.ORD_DTL_NO,
													callback : elandmall.goodsDetailTab.fnEval.fnSearchEval
											}
											elandmall.evalLayer.insEvalLayer(p);	
										}
									}
								},
								error: function(e){
									if ( !confirm("구매한 이력이 없습니다. \n마이페이지 구매목록을 확인하시겠습니까?" )){
										return false;	
									}
									elandmall.mypage.link.orderDeli();
								}
							});
						}
						
						if ( !elandmall.loginCheck() ){
							if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
								return false;
							}
							elandmall.isLogin({login:addGoodsEval});
						}else{
							addGoodsEval();
						}
						
					});
					
					//기대평삭제
					$div.on("click", "[name=zeroDelBtn]", function(){
						if(confirm("작성하신 기대평을 삭제하시겠습니까?")){
							var obj = $(this);
							
							$.ajax({
								url: "/eventshop/deleteExpectEval.action",
								data: {atypical_shop_no : obj.data("atypical_shop_no"), goods_no :obj.data("goods_no"), vir_vend_no:obj.data("vir_vend_no")},
								type: "POST",
								success: function(data) {
									$("#zeroEvalDiv").load("/goods/searchDetailExpectEvalList.action?goods_no="+obj.data("goods_no")+"&vir_vend_no="+obj.data("vir_vend_no"), function(){
										elandmall.goodsDetailTab.fnEval.fnZeroEvalPaging($div);
									});
								},error:function(e){
									alert("기대평 삭제중 오류가 발생하였습니다.");
									$("#zeroEvalDiv").load("/goods/searchDetailExpectEvalList.action?goods_no="+obj.data("goods_no")+"&vir_vend_no="+obj.data("vir_vend_no"), function(){
										elandmall.goodsDetailTab.fnEval.fnZeroEvalPaging($div);
									});
								}
							});
						}
					});
					
					// 더보기 버튼 클릭시 
					$(".rv_down").on("click", function(){
						$(window).scrollTop($(this).parents("td").offset().top-100);
					});
					
					elandmall.goodsDetailTab.fnEval.evalMoreBtn( $div );		// 더보기 버튼
					elandmall.goodsDetailTab.fnEval.fnZeroEvalPaging($div);	// 기대평 페이징
					commonUI.view.reviewTable();
				});
			},
			// 상품평 수정하기
			fnEvalEdit : function( obj ){
				var data = $(obj).data();
				var p = {
						ord_no : data.ordNo,
						ord_dtl_no : data.ordDtlNo,
						atypical_shop_no : data.atypicalShopNo,
						goods_eval_no : data.goodsEvalNo,
						callback : elandmall.goodsDetailTab.fnEval.fnSearchEval
					}
				
				elandmall.evalLayer.editEvalLayer(p);
			},
			
			// 포토상품평 상세보기
			fnPhotoEvalDtl : function( goodsEvalNo, imgId, chk ){
			    if(chk != "dtl") {
			    	var div_photo_dtl = $("<div id='photoReviewDtl'></div>");
			        div_photo_dtl.appendTo('body');
			    }
			       
			    $('#photoReviewDtl').load('/goods/searchGoodsPhotoEvalDtl.action?goods_eval_no='+goodsEvalNo, function() {
			    	DK_dim_Close("review_layer");
			    	DK_dim_Open("review_layer", imgId);
			    	$('#review_bn_big .swiper-slide').each(function(){
			    		var rvBtn = $(this);
			    		$(this).find('img').load(function() {
			    			rectangle_lineup(rvBtn);
			    		});
			    	});
			    });
			},
			   
			// 포토상품평 상세보기 닫기
			fnPhotoEvalDtlClose : function(){
				$("#photoReviewDtl").remove();
			    DK_dim_Close("review_layer");
			},
			
			
			// 도움버튼 클릭
			fnRecomm : function( obj ){
				var btnObj = $(obj); 
				var fnRecomm = function(){
					var del_yn = "N";
					if ( btnObj.hasClass("on") ){
						del_yn = "Y";
					}
					
					$.ajax({
						url: "/goods/registGoodsEvalRecommd.action",
						data: { goods_eval_no : btnObj.data().goodsEvalNo, del_yn : del_yn },
						type: "POST",
						dataType: "json",
						success: function(data) {
							if ( data != null && data != "" ){
								data = data.results;
								
								if ( data.result_cd == "F"){
									alert("이미 도움을 했습니다.");
									
									if(del_yn == "Y") {
										btnObj.removeClass("on");
									}else{
										btnObj.addClass("on");
									}
									
									return false;
								}else{
									var tdObj = btnObj.parent().parent();
									
									if(del_yn == "Y") {
										btnObj.removeClass("on");
									}else{
										btnObj.addClass("on");
									}
									if (data.recomm_cnt > 0 ){
										tdObj.find("#recomm_div").show();
									}else{
										tdObj.find("#recomm_div").hide();
									}

									$("#recomm_cnt", tdObj).text(data.recomm_cnt);
									$("#recomm_cnt_photo_dtl").text(data.recomm_cnt);

								}
							}
						}, error : function( e ){
							if ( e.error_message !=null && e.error_message != ""){
								alert(e.error_message);
							}else{
								alert("도움 중 오류가 발생하였습니다.");
							}
						}
					});
				}
				
				if ( !elandmall.loginCheck() && $("#review_layer").length > 0 ){
					DK_dim_Close("review_layer");
				}
				elandmall.isLogin({login:fnRecomm});
			
			},
			
			//도움버튼 클릭 (댓글)
			fnReplyRecomm : function( obj, flag ){
				var btnObj = $(obj); 
				var gubunYn = (typeof(flag) != "undefined" && flag == "Y") ? "Y" : "N";
				var fnRecomm = function(){
					var del_yn = "N";
					if (btnObj.attr("aria-pressed") == "true"){
						del_yn = "Y";
					}
					
					$.ajax({
						url: "/goods/registGoodsEvalRecommd.action",
						data: { goods_eval_no : btnObj.data().goodsEvalNo, del_yn : del_yn },
						type: "POST",
						dataType: "json",
						success: function(data) {
							if ( data != null && data != "" ){
								data = data.results;
								
								if ( data.result_cd == "F"){
									alert("이미 도움을 했습니다.");
									
									if(del_yn == "Y") {
										btnObj.removeClass("on");
									}else{
										btnObj.addClass("on");
									}
									
									return false;
								}else{
									var liObj = btnObj.parent().parent();
		
									if(del_yn == "Y") {
										btnObj.attr("aria-pressed", "false");
									}else{
										btnObj.attr("aria-pressed", "true");
									}
									
									$("#recomm_cnt", liObj).text(data.recomm_cnt);
								}
							}
						}, error : function( e ){
							if ( e.error_message !=null && e.error_message != ""){
								alert(e.error_message);
							}else{
								alert("도움 중 오류가 발생하였습니다.");
							}
						}
					});
				}
				elandmall.isLogin({login:fnRecomm});
			},
			
			// 상품평 검색
		    fnSearchEval : function( p ){
				var p = $.extend({
							goods_no : $("#eval_goods_no").val(),
							ori_goods_no : $("#eval_ori_goods_no").val(),
							sch_gb : $("#sch_gb").val(),
							sch_opt : $("#sch_opt").val(),
							flt_dtl_no_list : $("#flt_dtl_no_list").val(),
							page_idx : "1"
						}, elandmall.goodsDetailTab.fnTabResult( p ));
				
				if(($.type(p.val) != "undefined" && p.val == "photo") || ($.type(p.img_add_yn) != "undefined" && p.img_add_yn == "Y")) {
					p.cust_rows_per_page = 5;
				}
				
				var goods_no_list = new Array();
				var idx = 0;
				$.each( $("#eval_goods_sel option"), function(i){
					if ( $(this).data("goods_no") != undefined){
						goods_no_list[idx] = $(this).data("goods_no");
						idx++;
					}
				});
				if ( goods_no_list.length > 1 ){
					p.goods_no_list = goods_no_list;
				}
				
			    $("#evalBodyDiv").load("/goods/searchGoodsEvalBody.action", p, function(){
			    	var tot = 0;
		        	var best = 0;
		        	var photo = 0;
		        	
		        	if ( $("#total_cnt", $(this)).length > 0 ){
		        		tot=$("#total_cnt", $(this)).val()
		        	}
		        	if ( $("#best_cnt", $(this)).length > 0 ){
		        		best=$("#best_cnt", $(this)).val()
		        	}
		        	if ( $("#photo_cnt", $(this)).length > 0 ){
		        		photo=$("#photo_cnt", $(this)).val()
		        	}
		        	$("#totEvnlCnt", p.obj).text("("+tot+")");
		        	$("#bestEvnlCnt", p.obj).text("("+best+")");
		        	$("#photoEvnlCnt", p.obj).text("("+photo+")");
		        	
		        	$.each( $("[name^=evalCnt]"), function(i){
		        		$(this).text($("#eval", p.obj).val());	
		        	});
		        	/*
		        	$.each( $("[name^=questCnt]"), function(i){
		        		$(this).text($("#quest", p.obj).val());	
		        	});
		        	*/
			    	if ( $.type(p.liObj) != undefined && $.type(p.liObj) == "object") {
		        		p.liObj.parents("ul").find("li").removeClass("on");
		        		p.liObj.addClass("on");
					}
			    	
			    	commonUI.view.reviewTable();
			    	elandmall.goodsDetailTab.fnEval.evalMoreBtn( $(this) );
			    	elandmall.goodsDetailTab.fnPaging($(this) , p, elandmall.goodsDetailTab.fnEval.fnSearchEval)
			    	elandmall.goodsDetailTab.fnEval.fnZeroEvalPaging($(this));
			    	
			    	$(window).scrollTop($(this).parents("div[id^=desc]").find("#sum_div").offset().top-150);
			    	
			    	
			    	$('.rv_thumb li img').each(function(){
			    		var $this = $(this);
			    		$this.load(function(){
			    			var $el= $this[0];
			    			var w = $el.naturalWidth;
			    			var h = $el.naturalHeight;

			    			//NGCPO-7279 삭제
			    			//w>=h ? autoAttP($this, 'height', '188px') : autoAttP($this, 'width', '188px');
			    		})
			    	});
			    	$('.review_phto li .thumb img').each(function(){
			    		var $this = $(this);
			    		$this.load(function(){
			    			var $el= $this[0];
			    			var w = $el.naturalWidth;
			    			var h = $el.naturalHeight;
			    			w>=h ? autoAttP($this, 'height', '255px') : autoAttP($this, 'width', '255px');
			    		})
			    	});
			    	
			    });
			    
			},
			// 기대평 페이징
			fnZeroEvalPaging : function( $div ){
				$( "#expect_page_nav", $div).createAnchor({
			        name : "page_idx",
			        fn : function(page, parameter){
			        	$("#zeroEvalDiv").load("/goods/searchDetailExpectEvalList.action?page_idx=" + page + "&" + parameter, function(){
			        		$(window).scrollTop($(this).offset().top-100);
			        		elandmall.goodsDetailTab.fnEval.fnZeroEvalPaging($div);
			        	});
			        }
			    });
			},
			// 상품평 더보기 Show hide 처리
			evalMoreBtn : function( obj ){
				$(".rv_info03", obj).each(function(i){
					if ( $(this).height() > 80.6 || $(this).parents("td").find(".rv_info01 > img").length > 0 ){
						$("[name=more_btn]", $(this).parents("td")).show();
					}
				});
			}
		},
		// 상품문의
		fnQuest : {
			// 상품문의
			fnLoadQuest : function( p , objNm ){
				$(objNm).load("/goods/initGoodsQuest.action", p, function(){
					var goodsDetailTab = elandmall.goodsDetailTab;
					var $div = $(this);
					var pin = {	obj : $div };	 // 현재 객체
					
					//페이지 번호 클릭시 지정된 url로 이동
					goodsDetailTab.fnPaging(objNm , pin, goodsDetailTab.fnQuest.fnSearchQuest);
					
					// tab Select
					$("[name=questTab]",$div).click(function(){
						var tabObj = $(this);
						var p = $.extend({liObj:tabObj, val : tabObj.data().value }, pin);
						
						goodsDetailTab.fnQuest.fnSearchQuest(p);
					});
					
					// Pkg_goods selected  search & setting
					$("#quest_goods_sel",$div).change(function(){
						var tabObj = $("#tabUl", $div);
						tabObj.find("li").removeClass("on");
						tabObj.find("li:eq(0)").addClass("on");
						$div.find("#quest_goods_no").val($(this).find("option:selected").data("goods_no"));
						goodsDetailTab.fnQuest.fnSearchQuest( pin );
					});
					
					// 상품문의 삭제
					$div.on("click", "[name=qnaDelBtn]", function(){
						
						if(confirm("등록하신 상품 Q&A를 삭제하시겠습니까?")){
							$.ajax({
								url: "/goods/deleteGoodsQuest.action",
								data: {counsel_no : $(this).data("counsel_no"), v_counsel_stat_cd : $(this).data("counsel_stat_cd")},
								type: "POST",
								success: function(data) {
									alert("삭제 되었습니다.");
									// tab 출력용 전체 갯수 처리 
									var qtotCnt = $('#quest_cnt_all').val();
									$('#quest_cnt_all').val(Number(qtotCnt)-1);
									elandmall.goodsDetailTab.fnQuest.fnSearchQuest({goods_no:$("#quest_goods_no", $div).length>0 ? $("#quest_goods_no", $div).val() : $("#ori_goods_no", $div).val()});
								}
							});
						}
					});
					
					// 상품문의 수정
					$div.on("click", "[name=qnaEditBtn]", function(){
						var p = {
								counsel_no : $(this).data("counsel_no"),
								obj : $div
						}
						elandmall.goodDetailQuestLayer( p );	
					});
					
					// QusetInsert
					$("#questIns",$div).click(function(){
						var fn = function(){
							var p = {
									goods_no: $("#ori_goods_no", $div).val(),
									sel_goods_no : $("#quest_goods_no", $div).val(),
									vir_vend_no : $("#vir_vend_no", $div).val(),
									pkg_yn : $("#pkg_yn", $div).val(),
									obj : $div
							}
							elandmall.goodDetailQuestLayer( p );	
						}
						
						if ( !elandmall.loginCheck() ){
							if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
								return false;
							}
							elandmall.isLogin({login:fn});
						}else{
							fn();
						}
					});
					
					$("#myQNA", $div).click(function(){
						var myQNAYn = "N";
						if($(this).prop("checked")){
							myQNAYn = "Y";
						}
						if ( !elandmall.loginCheck() ){
							if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
								$(this).prop("checked", false);
								return false;
							}
						}
						
						var fn = function(){
							isLoginCheckAjax();
							var p = {
									//goods_no: $("#goods_no", $div).val(),
									//sel_goods_no : $("#goods_no", $div).val(),
									vir_vend_no : $("#vir_vend_no", $div).val(),
									pkg_yn : $("#pkg_yn", $div).val(),
							}
							p = $.extend(p, elandmall.goodsDetailTab.fnTabResult());
							if(myQNAYn=="Y"){
								p = $.extend(p, {myQNAYn:myQNAYn});
							}
							goodsDetailTab.fnQuest.fnSearchQuest(p);
						}
						
						var fnCancelCallback = function(){
							if($("#myQNA").prop("checked")){
								$("#myQNA").prop("checked", false);
							}else{
								$("#myQNA").prop("checked", true);
							}
						}
						
						elandmall.isLogin({login:fn, close:fnCancelCallback});
					});
					
					commonUI.view.qnaTable();
				});
			},
			
			// QnA 검색
			fnSearchQuest : function( p ){
		    	var p = $.extend({
		    				goods_no : $("#quest_goods_no", p.obj).val(),
		    				answer_yn : "N",
		    				page_idx : "1"
		    			}, elandmall.goodsDetailTab.fnTabResult( p ));
		    	
		    	var goods_no_list = new Array();
				$.each( $("#quest_goods_sel option"), function(i){ 
					goods_no_list[i] = $(this).data("goods_no");
				});
				if ( goods_no_list.length > 0 ){
					p.goods_no_list = goods_no_list;
				}
				
		    	$("#questDiv").load("/goods/searchGoodsQuestBody.action", p, function(){
		        	var tot = 0;
		        	var ans = 0;
		        	if ( $("#total_cnt", $(this)).length > 0 ){
		        		tot=$("#total_cnt", $(this)).val()
		        	}
		        	if ( $("#ans_cnt", $(this)).length > 0 ){
		        		ans=$("#ans_cnt", $(this)).val()
		        	}
		        	
		        	if(elandmall.global.disp_mall_no != "0000053"){
			        	$("#totQusetCnt", p.obj).text("("+tot+")");
			        	$("#totQusetAswCnt", p.obj).text("("+ans+")");
			        	
			        	$.each( $("[name^=questCnt]"), function(i){
			        		$(this).text($("#quest_cnt_all").val());	
			        	});
		        	}
		        	/*
		        	$.each( $("[name^=evalCnt]"), function(i){
		        		$(this).text($("#eval", p.obj).val());	
		        	});*/
		        	
		        	if ( $.type(p.liObj) != undefined && $.type(p.liObj) == "object") {
		        		p.liObj.parents("ul").find("li").removeClass("on");
		        		p.liObj.addClass("on");
					}
		        	commonUI.view.qnaTable();
		        	elandmall.goodsDetailTab.fnPaging($(this) , p, elandmall.goodsDetailTab.fnQuest.fnSearchQuest);
		        	$(window).scrollTop($(this).parents("div[id^=desc]").offset().top-150);
		        });
		    }
		},
		
		//댓글
		fnAnsw : {
			fnLoadAnsw : function(p, objNm){
				if(p.pkg_yn == "Y"){
					p.goods_no=p.ori_goods_no;
				}
				
				$(objNm).load("/goods/initGoodsAnswList.action", p, function(){
					var goodsDetailTab = elandmall.goodsDetailTab;
					
					//페이지 번호 클릭시 지정된 url로 이동
					goodsDetailTab.fnPaging(objNm , p, goodsDetailTab.fnAnsw.fnSearchAnsw);
				});
			},
			
			//댓글 등록
			fnGoodsAnswInsert : function(){
				
				if ( !elandmall.loginCheck() ){
					if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
						return false;
					}
				}
				elandmall.isLogin({login : function(){
					isLoginCheckAjax();
					var title = $.trim($("#answ_title").val());
					var goods_no = $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val();
					
					if(title ==""){
						alert("내용을 입력해주세요.");
						return;
					}else if(!elandmall.goodsDetail.limitText({textid:"answ_title", limit:400})){
						return false;
					}else{
						if(confirm("댓글을 등록하시겠습니까?")){
							$.ajax({
								url: "/goods/registGoodsAnsw.action",
								data: {goods_no:goods_no, title:title},
								type: "POST",
								success: function(data) {
									alert("등록 되었습니다.");
									$("#answ_title").val('');
									elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw();
								}, error : function( e ){
									alert("등록 중 오류가 발생하였습니다.");
								}
							});
						}
					}
				}});
			},
			
			//댓글 삭제
			fnGoodsAnswDelete : function(goods_eval_no){
				var goods_no = $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val();
				if(confirm("댓글을 삭제하시겠습니까?")){
					
					$.ajax({
						url: "/goods/deleteGoodsAnsw.action",
						data: {goods_eval_no:goods_eval_no,goods_no:goods_no},
						type: "POST",
						success: function(data) {
							alert("삭제 되었습니다.");
							elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw();
						}, error : function( e ){
							alert("삭제 중 오류가 발생하였습니다.");
						}
					});
				}
			},
			//댓글 수정
			fnGoodsAnswUpdate : function(title, goods_eval_no, obj){
				var id = typeof $(obj).parent().parent().find('textarea').attr('id') != "undefined" ? $(obj).parent().parent().find('textarea').attr('id') : "";
				var goods_no = $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val();
				if($.trim(title) ==""){
					alert("내용을 입력해주세요.");
					return;
				}else if(id != "" && !elandmall.goodsDetail.limitText({textid:id, limit:400})){
					return false;	
				}else{
					if(confirm("댓글을 수정하시겠습니까?")){
						$.ajax({
							url: "/goods/updateGoodsAnsw.action",
							data: {goods_eval_no:goods_eval_no, title:title, goods_no:goods_no},
							type: "POST",
							success: function(data) {
								alert("수정 되었습니다.");
								elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw();
							}, error : function( e ){
								alert("수정 중 오류가 발생하였습니다.");
							}
						});
					}
				}
			},
			// 댓글 검색
			fnSearchAnsw : function( p ){
		    	var p = $.extend({
		    				goods_no : $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val(),
		    				page_idx : "1"
		    			}, elandmall.goodsDetailTab.fnTabResult( p ));
		    	
		    	$("#answDiv").load("/goods/searchGoodsAnswBody.action", p, function(){
		        	elandmall.goodsDetailTab.fnPaging($(this) , p, elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw);
		        	$(window).scrollTop($(this).parents("div[id^=desc]").offset().top-150);
		        });
		    }
		},
		//답글
		fnReply : {
			//답글 등록
			fnGoodsReplyInsert : function(content, goods_eval_no, type, obj){
				var id = typeof $(obj).parent().find('textarea').attr('id') != "undefined" ? $(obj).parent().find('textarea').attr('id') : "";
				if ( !elandmall.loginCheck() ){
					if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
						return false;
					}
				}
				elandmall.isLogin({login : function(){
					isLoginCheckAjax();
					var goods_no = "";
					if(type=="eval"){
						goods_no = $("#eval_goods_no").val();
					}else if(type=="answ"){
						goods_no = $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val();
					}
					
					if($.trim(content) ==""){
						alert("내용을 입력해주세요.");
						return;
					}else if(id != "" && !elandmall.goodsDetail.limitText({textid:id, limit:400})){
						return false;
					}else{
						if(confirm("답글을 등록하시겠습니까?")){
							$.ajax({
								url: "/goods/registGoodsReply.action",
								data: {goods_eval_no:goods_eval_no, answ_cont:content},
								type: "POST",
								success: function(data) {
									alert("등록 되었습니다.");
									if(type=="eval"){
										elandmall.goodsDetailTab.fnEval.fnSearchEval();
									}else if(type=="answ"){
										elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw();
									}
								}, error : function( e ){
									alert("등록 중 오류가 발생하였습니다.");
								}
							});
						}
					}
				}});
			},
			
			//답글 삭제
			fnGoodsReplyDelete : function(goods_eval_no, answ_eval_seq, type){
				var goods_no = "";
				if(type=="eval"){
					goods_no = $("#eval_goods_no").val();
				}else if(type=="answ"){
					goods_no = $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val();
				}
				if(confirm("답글을 삭제하시겠습니까?")){
					
					$.ajax({
						url: "/goods/deleteGoodsReply.action",
						data: {goods_eval_no:goods_eval_no, answ_eval_seq:answ_eval_seq, use_yn:"N"},
						type: "POST",
						success: function(data) {
							alert("삭제 되었습니다.");
							if(type=="eval"){
								elandmall.goodsDetailTab.fnEval.fnSearchEval();
							}else if(type=="answ"){
								elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw();
							}
							
						}, error : function( e ){
							alert("삭제 중 오류가 발생하였습니다.");
						}
					});
				}
			},
			//답글 수정
			fnGoodsReplyUpdate : function(content, goods_eval_no, answ_eval_seq, type, obj){
				var id = typeof $(obj).parent().find('textarea').attr('id') != "undefined" ? $(obj).parent().find('textarea').attr('id') : "";
				var goods_no = "";
				if(type=="eval"){
					goods_no = $("#eval_goods_no").val();
				}else if(type=="answ"){
					goods_no = $("#answ_pkg_yn").val() != "Y" ? $("#answ_goods_no").val() : $("#answ_ori_goods_no").val();
				}
				if($.trim(content) ==""){
					alert("내용을 입력해주세요.");
					return;
				}else if(id != "" && !elandmall.goodsDetail.limitText({textid:id, limit:400})){
					return false;
				}else{
					if(confirm("답글을 수정하시겠습니까?")){
						$.ajax({
							url: "/goods/updateGoodsReply.action",
							data: {goods_eval_no:goods_eval_no, answ_eval_seq:answ_eval_seq, answ_cont:content},
							type: "POST",
							success: function(data) {
								alert("수정 되었습니다.");
								if(type=="eval"){
									elandmall.goodsDetailTab.fnEval.fnSearchEval();
								}else if(type=="answ"){
									elandmall.goodsDetailTab.fnAnsw.fnSearchAnsw();
								}
							}, error : function( e ){
								alert("수정 중 오류가 발생하였습니다.");
							}
						});
					}
				}
			},
			// 도움버튼 클릭(답글)
			fnAnswRecomm : function( obj, flag ){
				var btnObj = $(obj); 
				var gubunYn = (typeof(flag) != "undefined" && flag == "Y") ? "Y" : "N";
				var fnRecomm = function(){
					var del_yn = "N";
					if (btnObj.attr("aria-pressed") == "true"){
						del_yn = "Y";
					}
					
					$.ajax({
						url: "/goods/registGoodsAnswRecommd.action",
						data: { goods_eval_no : btnObj.data().goodsEvalNo, answ_eval_seq : btnObj.data().answEvalSeq, del_yn : del_yn },
						type: "POST",
						dataType: "json",
						success: function(data) {
							if ( data != null && data != "" ){
								data = data.results;
								
								if ( data.result_cd == "F"){
									alert("이미 도움을 했습니다.");
									
									if(del_yn == "Y") {
										btnObj.attr("aria-pressed", "false");
									}else{
										btnObj.attr("aria-pressed", "true");
									}
									
									return false;
								}else{
									var liObj = btnObj.parent().parent();
		
									if(del_yn == "Y") {
										btnObj.attr("aria-pressed", "false");
									}else{
										btnObj.attr("aria-pressed", "true");
									}
									
									$("#answ_recomm_cnt", liObj).text(data.recomm_cnt);
								}
							}
						}, error : function( e ){
							if ( e.error_message !=null && e.error_message != ""){
								alert(e.error_message);
							}else{
								alert("도움 중 오류가 발생하였습니다.");
							}
						}
					});
				}
				elandmall.isLogin({login:fnRecomm});
			}
		},
		//글자수제한
		goodsLimitText : function goodsLimitText(obj, limit, limitid){
			//var text = $('#'+textid).val(); // 이벤트가 일어난 컨트롤의 value 값
			var text = $(obj).val(); // 이벤트가 일어난 컨트롤의 value 값
			
			var textlength = text.length; // 전체길이 
		 
			// 변수초기화 
			var i = 0;				// for문에 사용 
			var li_byte = 0;		// 한글일경우는 2 그밗에는 1을 더함 
			var li_len = 0;			// substring하기 위해서 사용 
			var ls_one_char = "";	// 한글자씩 검사한다 
			var text2 = "";			// 글자수를 초과하면 제한할수 글자전까지만 보여준다. 
		 
			for(i=0; i< textlength; i++) 
			{ 
				// 한글자추출 
				ls_one_char = text.charAt(i); 
			
				// 한글이면 2를 더한다. 
				if (escape(ls_one_char).length > 4) { li_byte += 2;}
				else{li_byte++; } // 그밗의 경우는 1을 더한다. 
				
				// 전체 크기가 limit를 넘지않으면 
				if(li_byte <= limit){li_len = i + 1;} 
			} 
			
			$('#'+limitid).text(parseInt(li_byte/2));
			
			// 전체길이를 초과하면 
			if(li_byte > limit){ 
				alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다."); 
				text2 = text.substr(0, li_len); 
				//$('#'+textid).val(text2);
				$(obj).val(text2);
				
				$('#'+limitid).val(parseInt(limit/2));
			} 
			//$('#'+textid).focus(); 
			$(obj).focus();
		},
		//댓글,답글 버튼제어
		answAllButton : function(obj, target, bbsNo, moChkYn, type){
			var $btn = $(obj);
			var $btn_box = $btn.parent("div.bt");
			var $textarea = $btn.prev("textarea");
			var $rply_regi = $btn_box.parent().next().next(".rply_regi");
			var $rply_regi_textarea = $btn.prev("textarea");
			
			
			var evalHtml = "";
			
			if(target=="answMo"){	//댓글 수정
				$btn_box.parent().next(".modiAnswLi").show();
				$btn_box.parent(".readAnswLi").hide();
			}else if(target=="replyMo"){ //답글 수정
				$btn_box.parent().next(".modiReplyLi").show();
				$btn_box.parent(".readReplyLi").hide();
			}else if(target=="answMoCancel"){ //댓글 수정취소
				$btn_box.parent(".modiAnswLi").hide();
				$btn_box.parent().prev(".readAnswLi").show();
			}else if(target=="replyMoCancel"){ //답글 수정취소
				$btn_box.parent(".modiReplyLi").hide();
				$btn_box.parent().prev(".readReplyLi").show();
			}else if(target=="answMoRegi"){ //댓글 수정등록
				elandmall.goodsDetailTab.fnAnsw.fnGoodsAnswUpdate($textarea.val(), bbsNo, obj);
			}else if(target=="replyMoRegi"){ //답글 수정등록
				elandmall.goodsDetailTab.fnReply.fnGoodsReplyUpdate($textarea.val(), $btn.next().data("answno"), bbsNo, type, obj);
			}else if(target=="answDel"){ //댓글 삭제
				elandmall.goodsDetailTab.fnAnsw.fnGoodsAnswDelete(bbsNo);
			}else if(target=="replyDel"){ //답글 삭제
				elandmall.goodsDetailTab.fnReply.fnGoodsReplyDelete($btn_box.data("answno"), bbsNo, type);
			}else if(target=="replyRegiOpen"){ //답글 활성화
				evalHtml+= "<button type=\"button\" class=\"cls\" onclick=\"elandmall.goodsDetailTab.answAllButton(this, 'replyRegiClose', '"+bbsNo+"', '"+moChkYn+"', '"+type+"');\">답글취소</button>";
				$rply_regi.show();
			}else if(target=="replyRegiClose"){ //답글 비활성화
				evalHtml+= "<button type=\"button\" class=\"bk\" onclick=\"elandmall.goodsDetailTab.answAllButton(this, 'replyRegiOpen', '"+bbsNo+"', '"+moChkYn+"', '"+type+"');\">답글</button>";
				if(moChkYn=="Y"){
					evalHtml+= "<button type=\"button\" onclick=\"elandmall.goodsDetailTab.answAllButton(this, 'answMo', '"+bbsNo+"', 'Y', '"+type+"');\">수정</button>";
					evalHtml+= "<button type=\"button\" onclick=\"elandmall.goodsDetailTab.answAllButton(this, 'answDel', '"+bbsNo+"', 'Y', '"+type+"');\">삭제</button>";	
				}
				$rply_regi.hide();
			}else if(target=="replyRegi"){	//답글 등록
				elandmall.goodsDetailTab.fnReply.fnGoodsReplyInsert($textarea.val(), bbsNo, type, obj);
			}
			
			if(evalHtml!=""){
				$btn_box.html(evalHtml);
			}
		},
		
		fnPaging : function( parentObj, pin, _callback ){
			var p = $.extend(pin, p || {});
			
			$( "#page_nav", parentObj).createAnchor({
		        name : "page_idx",
		        fn : function(page, parameter){
		        	p.page_idx = page;
		        	_callback(p);
		        }
		    });
		},
		
		fnTabResult : function( p ){
			var pin = $.extend(pin , p || {});
			var val = pin.val;
			
			// TAB 선택의 값을 넘김 , 상품평 : { "", best, photo } 상품문의 { "", Y }
			if ( val == undefined ){
				val = $("#tabUl li.on", pin.obj).data().value;
			}
			
			if ( val == "best" ){
				pin.best_yn = "Y";
				
			}else if ( val == "photo"){
				pin.img_add_yn = "Y";
			}else if ( val == "Y"){
				pin.answer_yn = val;
			}
			
			return pin;
		}
	}
	
	/**
	 * 상품상세 대표, 상세, 라벨&재질 롤링스크립트 
	 */
	elandmall.goodsImgRolling = {
		detailDescription : function( ids ) {
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

				$links.on("click",function(e){
					e.preventDefault();
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
				$slider.css({"left": lef });
			}

			function _sliderPartFunc(){
				var chkSilderIDX = Math.abs(parseInt($slider.css("left")))/540;

				if ( chkSilderIDX == 0 ) {
					chkSilderIDX = 0;
				}else{
					chkSilderIDX = (chkSilderIDX*6);
				}

				_itemsOn($links.eq(chkSilderIDX));
			}

			function _btnsSet(){
				var chkOnItemIDX = $slider.find("li.on").index(); // wide btn chk
				var chkSliderLeft = Math.abs(parseInt($slider.css("left")))/90; // slider 위치 chk
				var pageIDX = parseInt((chkOnItemIDX)/6);

				if ( linksLength < 7) {
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
	}
	
	elandmall.stockNotiMbrLayerConfirm = function(p) {
		var result = confirm("품절 상품은 재입고 알림 신청 가능합니다.\n알림 신청을 하시겠습니까?"); 
		if(result) {
			elandmall.stockNotiMbrLayer(p);
		}
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
		p = $.extend({ goods_no: "", item_no: "", vir_vend_no: "",item_nm: "", dimmChk: false }, p || {});
		var fn = function(){
			elandmall.layer.createLayer({
				layer_id:"reware_layer",
				dimm_use: $('#temp_dimm').length > 0 ? true:false,
				class_name:"layer_pop lay_temp02 reware on",
				createContent: function(layer) {
					var div = layer.div_content;
					var lvend_type_cd= $("#low_vend_type_cd").val();
					if($("#low_vend_type_cd").val() ==undefined){
						lvend_type_cd =$("#option_low_vend_type_cd").val();
					}
					div.load("/goods/initStockNotiMbrLayer.action", p,  function() {
						var first_param = {
								goods_no:p.goods_no,
								item_no:p.item_no,
								low_vend_type_cd : lvend_type_cd,
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
							var item_no =p.item_no;
							$.each(OptRow, function(idx, lDiv) {
								if($(lDiv).data("last")=="Y"){
									item_no= $(lDiv).val();
								}
								if($(lDiv).val() == ""){
									emptyCnt++;
								}
							});
							if(emptyCnt ==0){
								if ( confirm("재입고 알림을 신청하시겠습니까?" )){
									$.ajax({
										url: "/goods/registStockNotiMbr.action",
										data: {goods_no : p.goods_no, item_no: item_no, disp_mall_no : elandmall.global.disp_mall_no},
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

	/**
	 * 사용방법
	 * 정보보기 레이어 팝업
	 * elandmall.goodsSkipDetail({
	 * 			event_key:        (이벤트키)
	 * 			event_start_date: (이벤트 시작일시)
	 * 			event_end_date:   (이벤트 종료일시)
	 * 			encrypt_goods_no: (암호화 상품번호)
	 * 			goods_no:         (상품번호)
	 * 			vir_vend_no :     (업체) 
	 * 			smsg:             (메시지)
	 * 			emsg:             (메시지)
	 * });
	 */
	//[START]elandmall.goodsSkipDetail
	elandmall.goodsSkipDetail = {
			// 2018.04.10 Start
			clickOrdEvent : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수
				//
				if(elandmall.global.chnl_cd != '40'){
					alert("모바일앱 전용 이벤트 입니다.");
					return;
				}

				//로그인 확인
				if(!elandmall.goodsSkipDetail.isLoginCheck(p)){
					return;
				}

				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isSaleTimeCheck(p)){
					return;
				}
				
				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck(p)){
					return;
				}

				var quickview_yn = p.quickview_yn;
				var mb_carts = [];
				
				mb_carts = elandmall.goodsSkipDetail.setParamEvent({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd: "20", goods_no: p.goods_no});
				var items = [];
				$.each(mb_carts, function() {
					items.push(this);
				});
				elandmall.cart.addCartEventMobile({
					cart_divi_cd: p.cart_divi_cd,
					items: items
				});

			}, //[END] 장바구니, 이벤트상품 구매 클릭 함수
			clickOrdLucky : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수
				//
				if(elandmall.global.chnl_cd != '40'){
					alert("모바일앱 전용 이벤트 입니다.");
					return;
				}
				
				//로그인 확인
				if(!elandmall.goodsSkipDetail.isLoginCheck(p)){
					return;
				}

				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isSaleTimeCheck(p)){
					return;
				}
				
				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck(p)){
					return;
				}
				window.location.href = "/goods/initGoodsDetail.action?goods_no=" + p.goods_no;
			}, //[END] 장바구니, 이벤트상품 구매 클릭 함수
			click2AnniversaryEvent : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수
				//로그인 확인
//				if(!elandmall.goodsSkipDetail.isLoginCheck(p)){
//					return;
//				}

				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isSaleTimeCheck(p)){
					return;
				}

				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck($.extend({}, p, {checkLogin : false}))){
					return;
				}

				var fnLoginCallback = function(){

//					if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
//						location.href=elandmall.util.http("/gate/goodsOrderForApp.action?goods_no="+p.goods_no+"&quickview_yn="+p.quickview_yn);
//					} else {
						var quickview_yn = p.quickview_yn;
						var mb_carts = [];
						
						mb_carts = elandmall.goodsSkipDetail.setParam2AnniversaryEvent({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd: "20", encrypt_goods_no: p.goods_no});
						var items = [];
						$.each(mb_carts, function() {
							items.push(this);
						});
						elandmall.cart.addCartEventMobile({
							cart_divi_cd: p.cart_divi_cd,
							items: items
						});						
//					}
				}

				if ( !elandmall.loginCheck() ){
					if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
						location.href=elandmall.util.newHttps("/app/initAppHeader.action?path_url=/login/initLogin.action&gnbwebview=Y");
					} else {
						elandmall.isLogin({login:fnLoginCallback});
					}
				}else{
					fnLoginCallback();
				}

			}, //[END] 장바구니, 이벤트상품 구매 클릭 함수
			//[START] 장바구니, 품절 check
			isAvailStockCheck: function(pin){
				pin = $.extend({precheck:false},pin);
				var stock_chk = false;
				var stock_chk_done = false;
				if(pin == null || pin == "") {return stock_chk;}
				pin = $.extend({}, {checkLogin : true}, pin);
			    var js_func = "alert('"+pin.emsg+"'); return false;";
			    var clickEvent = new Function(js_func);
				var fo_event_url = $("#event_api_domain_url").val()+"/fo-event/getOutOfStock";
		        $.ajax({
		            url: fo_event_url,
		            xhrFields: {withCredentials: true},		            
		            async: false,
					crossDomain: true,
					cors: true,
					data: {event_key: pin.event_key},
					type: "POST",
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					dataType: "json",
		            success: function(result){
		            	
		            	if(pin.precheck){
		            		if(result.error == 'success' && result.data.indexOf(pin.goods_no) != -1){
		            			alert("준비한 수량이 모두 소진되었습니다.감사합니다.");
			            	}else{
			            		stock_chk = true;
			            	}
		            	}else{
			            	if(result.error == 'success' && result.data.indexOf(pin.goods_no) == -1){
			            		stock_chk = true;
			            	} else if(result.error == 'success' && result.data.indexOf(pin.goods_no) != -1){
			                	$("#"+pin.goods_no).removeAttr("onclick");
								alert(pin.emsg);
								$("#"+pin.goods_no).attr('onclick', js_func);
			            	} else if(result.error == '0001' || result.error == '0004'){
								alert("비정상적인 접근입니다.");
			            	} else if(result.error == '0002' && pin.checkLogin){
								alert("상품 구매를 위해 로그인 해주세요.");
			            	} else if(result.error == '0002' && !pin.checkLogin){
			            		stock_chk = true;
			            	} else if(result.error == '0003'){
								alert("등록되지 않은 이벤트입니다.");
			            	} else {
			            		alert("사용자가 많아 접속이 지연되고 있습니다. 다시 시도해 주세요.");
			            	}
		            	}
		            	

		            	stock_chk_done = true;
					},error:function(e){

						alert("사용자가 많아 접속이 지연되고 있습니다. 다시 시도해 주세요.");
		            	stock_chk_done = true;
		            }
		        });
		        while (!stock_chk_done) {
		        	setTimeout(function(){}, 500); 
           	   }
		        return stock_chk;
			},	//[END] 장바구니, 품절 check
			//[START] 장바구니, 이벤트 시간 check (event_start_date 형식 yyyy-MM-dd HH:mm:ss)
			isSaleTimeCheck: function(pin){
				var pin = $.extend({event_start_date:"",event_end_date:""},pin);
				var time_chk = {};
				if(pin == null || pin == "") {return;}
				var event_start_date = pin.event_start_date.replace(/-/gi, "").replace(/ /gi, "").replace(/:/gi, "");
				var event_end_date = pin.event_end_date.replace(/-/gi, "").replace(/ /gi, "").replace(/:/gi, "");
		        $.ajax({
		            url:"/goods/getCurrentDateTime.action",
		            async: false,
					data: {pattern : 'yyyyMMddHHmmss'},		            
		            type:"get",
		            dataType:"json",
		            success: function(result){
		                if(result.currentDateTime < event_start_date) {
							alert(pin.smsg);
							time_chk = false;
		                } else if(event_end_date < result.currentDateTime) {
							alert(pin.emsg);
							time_chk = false;
		                } else {
		                	time_chk = true;
		                }
		            },error:function(e){
		            	console.log(e);
						time_chk = false;
		            }
		        });
		        return time_chk;
			},	//[END] 장바구니, 이벤트 시간 check
			isEventTimeCheck: function(pin){
				var pin = $.extend({event_start_date:"",event_end_date:""},pin);
				var time_chk = {};
				if(pin == null || pin == "") {return;}
				var event_start_date = pin.event_start_date.replace(/-/gi, "").replace(/ /gi, "").replace(/:/gi, "");
				var event_end_date = pin.event_end_date.replace(/-/gi, "").replace(/ /gi, "").replace(/:/gi, "");
				var fo_event_url = $("#event_api_domain_url").val()+"/fo-event/getCurrentDateTime";
		        $.ajax({
		            url: fo_event_url,
		            xhrFields: {withCredentials: true},		            
		            async: false,
					crossDomain: true,
					cors: true,
					data: {pattern : 'yyyyMMddHHmmss'},
					type: "GET",
					cache : true,
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					dataType: "json",
		            success: function(result){
		                if(result.data < event_start_date) {
							alert(pin.smsg);
							time_chk = false;
		                } else if(event_end_date < result.data) {
							alert(pin.emsg);
							time_chk = false;
		                } else {
		                	time_chk = true;
		                }
		            },error:function(e){
		            	console.log(e);
						time_chk = false;
		            }
		        });
		        return time_chk;
			},	//[END] 장바구니, 이벤트 시간 check
			//[START] 장바구니, 로그인 check
			isLoginCheck: function(pin){
				var login_chk = {};
				if(pin == null || pin == "") {return;}
		        $.ajax({
		            url:"/member/isLoginCheckAjax.action",
		            type:"get",
		            dataType:"json",
		            async:false,
		            success: function(result){
		            	if(result.ret_code != true) {
							alert("상품 구매를 위해 로그인 해주세요");
							login_chk = false;
		                } else {
							login_chk = true;
		                }
		            },error:function(e){
						alert(e);		                
						login_chk = false;
		            }
		        });
		        return login_chk;
			},	//[END] 장바구니, 로그인 check
			setParamEvent: function(pin){
				if(pin == null || pin == "") {return;}
				var quickview_yn = pin.quickview_yn;
				var cart_divi_cd = pin.cart_divi_cd;
				var cart = {};				
		        $.ajax({
		            url:"/goods/getGoodsDetailEvent.action",
		            async: false,
					data: {goods_no: pin.goods_no, vir_vend_no: pin.vir_vend_no},		            
		            type:"get",
		            dataType:"json",
		            success: function(result){
		            	if (result.ret_code == true) {
		                	cart = { add_ord_sel_info: result.add_ord_sel_info,
		                		brand_nm: result.brand_nm,
		                		cart_grp_cd: result.cart_grp_cd,
		                		category_nm: result.category_nm,
		                		conts_dist_no: result.conts_dist_no,
		                		coupon: result.coupon,
		                		gift_goods_info: result.gift_goods_info,
		                		goods_cmps_divi_cd: result.goods_cmps_divi_cd,
		                		goods_nm: result.goods_nm,
		                		goods_no: result.goods_no,
		                		item_no: result.item_no,
		                		multi_item_yn: result.multi_item_yn,
		                		multi_price_yn: result.multi_price_yn,
		                		nplus_base_cnt: result.nplus_base_cnt,
		                		nplus_cnt: result.nplus_cnt,
		                		ord_qty: result.ord_qty,
		                		sale_area_no: result.sale_area_no,
		                		sale_price: result.sale_price,
		                		sale_shop_divi_cd: result.sale_shop_divi_cd,
		                		sale_shop_no: result.sale_shop_no,
		                		sale_unit_qty: result.sale_unit_qty,
		                		stock_qty_disp_yn: result.stock_qty_disp_yn,
		                		vir_vend_no: result.vir_vend_no };
		                }
					},error:function(e){
						alert(e);
		            }
		        });
				if(cart_divi_cd == "20"){		//비회원 주문 가능
					cart["nomember"] = true;
				}
				pin.arrCart.push(cart);
				
				return pin.arrCart;
			},
			// 2018.04.10 End
			setParam2AnniversaryEvent: function(pin){
				if(pin == null || pin == "") {return;}
				var quickview_yn = pin.quickview_yn;
				var cart_divi_cd = pin.cart_divi_cd;
				var cart = {};				
		        $.ajax({
		            url:"/goods/getGoodsDetail2AnniversaryEvent.action",
		            async: false,
					data: {encrypt_goods_no: pin.encrypt_goods_no, vir_vend_no: pin.vir_vend_no},		            
		            type:"get",
		            dataType:"json",
		            success: function(result){
		            	if (result.ret_code == true) {
		                	cart = { add_ord_sel_info: result.add_ord_sel_info,
		                		brand_nm: result.brand_nm,
		                		cart_grp_cd: result.cart_grp_cd,
		                		category_nm: result.category_nm,
		                		conts_dist_no: result.conts_dist_no,
		                		coupon: result.coupon,
		                		gift_goods_info: result.gift_goods_info,
		                		goods_cmps_divi_cd: result.goods_cmps_divi_cd,
		                		goods_nm: result.goods_nm,
		                		goods_no: result.goods_no,
		                		item_no: result.item_no,
		                		multi_item_yn: result.multi_item_yn,
		                		multi_price_yn: result.multi_price_yn,
		                		nplus_base_cnt: result.nplus_base_cnt,
		                		nplus_cnt: result.nplus_cnt,
		                		ord_qty: result.ord_qty,
		                		sale_area_no: result.sale_area_no,
		                		sale_price: result.sale_price,
		                		sale_shop_divi_cd: result.sale_shop_divi_cd,
		                		sale_shop_no: result.sale_shop_no,
		                		sale_unit_qty: result.sale_unit_qty,
		                		stock_qty_disp_yn: result.stock_qty_disp_yn,
		                		vir_vend_no: result.vir_vend_no };
		                }
					},error:function(e){
						console.log(e);
		            }
		        });
				if(cart_divi_cd == "20"){		//비회원 주문 가능
					cart["nomember"] = true;
				}
				pin.arrCart.push(cart);
				
				return pin.arrCart;
			},
			// NGCPO-4814 선착순 이벤트 주문서 바로 진입 로직 개선
			// 이벤트페이지 전용
			click2Shortcut : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수

				if(running_chk){
					alert("처리중입니다. 잠시만 기다려 주세요.");
					return;	
				}

				running_chk = true;
				
				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isEventTimeCheck(p)){
					running_chk = false;
					return;
				}

				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck($.extend({}, p, {checkLogin : false}))){
					running_chk = false;
					return;
				}

				var fnLoginCallback = function(){


					var quickview_yn = p.quickview_yn;
					var mb_carts = [];

					if(p.event_layer_yn == "Y"){

						NetFunnel_Action(  {action_id: p.action_id,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80"},
								{	 success:function(ev,ret){ //성공
											elandmall.cart.addCartEventMobile(p);
									 },stop:function(ev,ret){  //중지
											 elandmall.goodDetailPreviewLayer.openEventLayer(); 
									 },block : function(ev,ret){
											 if($("#detailPreview").is(":visible")){
												elandmall.goodDetailPreviewLayer.closeLayer();
												
											 }
									 },error:function(ev,ret){ //오류
											 elandmall.outputSeverLog({msg:"ERROR [netfunnel] - click2Shortcut || msg : " + ret.data.msg});
											 alert("죄송합니다.대기열 호출 중 오류가 발생했습니다.");
											 if($("#detailPreview").is(":visible")){
												elandmall.goodDetailPreviewLayer.closeLayer();
											 }
									 }
							  	}
							  );
						
							
					}else{
						var quickview_yn = p.quickview_yn;
						var mb_carts = [];
						
						mb_carts = elandmall.goodsSkipDetail.setParam2Shortcut({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd: "20", encrypt_goods_no: p.goods_no});
						
						var items = [];
						$.each(mb_carts, function() {
							items.push(this);
						});
						
						if ($.type(items[0].goods_no) != "undefined") {
							elandmall.cart.addCartEventMobile({
								cart_divi_cd: p.cart_divi_cd,
								items: items
							});	
						}
					}

					running_chk = false;
				}

				$("body").removeClass("hidden");
				if ( !elandmall.loginCheck() ){
					elandmall.isLogin({login:fnLoginCallback});
					running_chk = false;
				} else {
					fnLoginCallback();
				}

			},
/*
			// NGCPO-5439 넷퍼넬 이벤트 전용 스크립트/화면 개발
			// 이벤트페이지 전용
			click2ShortcutNetfunnel : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수

				if(running_chk){
					alert("처리중입니다. 잠시만 기다려 주세요.");
					return;
				}

				running_chk = true;

				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isSaleTimeCheck(p)){
					running_chk = false;
					return;
				}

				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck($.extend({}, p, {checkLogin : false}))){
					running_chk = false;
					return;
				}

				var fnLoginCallback = function(){

					// 넷퍼넬
					var actionId = p.goods_no.substring(0, 20); 
					NetFunnel_Action({action_id: actionId}, function(){});

					// 넷퍼넬 (암호화된 상품코드 , vir_vend_no...)
					elandmall.goodsDetail.clickFltLayer();
					
					running_chk = false;
				}

				if ( !elandmall.loginCheck() ){
					elandmall.isLogin({login:fnLoginCallback});
					running_chk = false;
				} else {
					fnLoginCallback();
				}

			},
*/
			// 기획전페이지 전용
			click2ShortcutExhibition : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수

				if(running_chk){
					alert("처리중입니다. 잠시만 기다려 주세요.");
					return;	
				}

				running_chk = true;
				
				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isSaleTimeCheck(p)){
					running_chk = false;
					return;
				}

				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck($.extend({}, p, {checkLogin : false}))){
					running_chk = false;
					return;
				}

				var fnLoginCallback = function(){

					var quickview_yn = p.quickview_yn;
					var mb_carts = [];
					
					mb_carts = elandmall.goodsSkipDetail.setParam2Shortcut({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd: "20", encrypt_goods_no: p.goods_no});
					
					var items = [];
					$.each(mb_carts, function() {
						items.push(this);
					});
					
					if ($.type(items[0].goods_no) != "undefined") {
						elandmall.cart.addCartEventMobile({
							cart_divi_cd: p.cart_divi_cd,
							items: items
						});	
					}
					running_chk = false;
				}

				if ( !elandmall.loginCheck() ){
					if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
						location.href=elandmall.util.newHttps("/app/initAppHeader.action?path_url=/login/initLogin.action&gnbwebview=Y");
					} else {
						elandmall.isLogin({login:fnLoginCallback});
					}
					running_chk = false;
				} else {
					fnLoginCallback();
				}

			},
			//[START] 이벤트 대상 체크후 응모
			isTargetChecknEntry: function(pin){
				var event_target_chk = false;
				var is_event_target = false;
				
		        $.ajax({
		            url:"/event/eventTargetNewCustomerCheck.action",
		            async: false,
		            type:"get",
		            dataType:"json",
		            success: function(result){
		            	if (null != result.ret_code && result.ret_code == "0000" && result.ret_msg == "Y") {
		            		is_event_target = true;
		            	} else {
		            		alert("이벤트 대상이 아닙니다.");
		            	}
					},error:function(e){
						console.log(e);
		            }
		        });

				if(is_event_target){
					var form = $('#eventForm').createForm();

					form.submit({
						action: "/event/registEventEntry.action",
						iframe: true,   //true일 경우 target 무시되고 페이지내에 iframe 생성후 해당 iframe으로 form submit
						success: function(p) {  //iframe이 true 일 경우 submit후 호출됨
							event_target_chk = true;
						},
						error: function(p) {    //iframe이 true 일 경우 submit후 호출됨
							alert("이벤트 응모시 오류가 발생했습니다.");
						}
					});					
				}
				return event_target_chk;
			},	//[END] 이벤트 대상 체크후 응모				
			click2ShortcutEvent : function(p){ //[START] 장바구니, 이벤트상품 바로구매 클릭 함수

				if(running_chk){
					alert("처리중입니다. 잠시만 기다려 주세요.");
					return;	
				}

				running_chk = true;

				//이벤트 시간 확인
				if(!elandmall.goodsSkipDetail.isSaleTimeCheck(p)){
					running_chk = false;
					return;
				}

				//품절확인
				if(!elandmall.goodsSkipDetail.isAvailStockCheck($.extend({}, p, {checkLogin : false}))){
					running_chk = false;
					return;
				}

				var fnLoginCallback = function(){

					//이벤트대상 확인 그리고 응모
					if(!elandmall.goodsSkipDetail.isTargetChecknEntry(p)){
						running_chk = false;
						return;
					}
					
					var quickview_yn = p.quickview_yn;
					var mb_carts = [];
					
					mb_carts = elandmall.goodsSkipDetail.setParam2Shortcut({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd: "20", encrypt_goods_no: p.goods_no});
					
					var items = [];
					$.each(mb_carts, function() {
						items.push(this);
					});
					
					if ($.type(items[0].goods_no) != "undefined") {
						elandmall.cart.addCartEventMobile({
							cart_divi_cd: p.cart_divi_cd,
							items: items
						});	
					}
					running_chk = false;
				}

				if ( !elandmall.loginCheck() ){
					if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
						location.href=elandmall.util.newHttps("/app/initAppHeader.action?path_url=/login/initLogin.action&gnbwebview=Y");
					} else {
						elandmall.isLogin({login:fnLoginCallback});
					}
					running_chk = false;
				} else {
					fnLoginCallback();
				}

			},			
			setParam2Shortcut: function(pin){
				if(pin == null || pin == "") {return;}
				var quickview_yn = pin.quickview_yn;
				var cart_divi_cd = pin.cart_divi_cd;
				var cart = {};

		        $.ajax({
		            url:"/goods/getGoodsDetailShortcut.action",
		            async: false,
					data: {encrypt_goods_no: pin.encrypt_goods_no, vir_vend_no: pin.vir_vend_no},		            
		            type:"get",
		            dataType:"json",
		            success: function(result){
		            	if (result.ret_code == true) {
		                	cart = { add_ord_sel_info: result.add_ord_sel_info,
		                		brand_nm: result.brand_nm,
		                		cart_grp_cd: result.cart_grp_cd,
		                		category_nm: result.category_nm,
		                		conts_dist_no: result.conts_dist_no,
		                		coupon: result.coupon,
		                		gift_goods_info: result.gift_goods_info,
		                		goods_cmps_divi_cd: result.goods_cmps_divi_cd,
		                		goods_nm: result.goods_nm,
		                		goods_no: result.goods_no,
		                		item_no: result.item_no,
		                		multi_item_yn: result.multi_item_yn,
		                		multi_price_yn: result.multi_price_yn,
		                		nplus_base_cnt: result.nplus_base_cnt,
		                		nplus_cnt: result.nplus_cnt,
		                		ord_qty: result.ord_qty,
		                		sale_area_no: result.sale_area_no,
		                		sale_price: result.sale_price,
		                		sale_shop_divi_cd: result.sale_shop_divi_cd,
		                		sale_shop_no: result.sale_shop_no,
		                		sale_unit_qty: result.sale_unit_qty,
		                		stock_qty_disp_yn: result.stock_qty_disp_yn,
		                		vir_vend_no: result.vir_vend_no };
		                }
		            }
		        });
				if(cart_divi_cd == "20"){		//비회원 주문 가능
					cart["nomember"] = true;
				}
				pin.arrCart.push(cart);
				
				return pin.arrCart;
			}			
	}
	//[END]elandmall.goodsSkipDetail
	
	/*
	 * 상품상세 타이머 (커밍순  & 프리오더)
	 *
	 * parameter {
	 * 		goods_no : '111111'
	 * 		exposure_start_dtime: '2020/03/05 13:00:00'
	 * 		reserve_start_dtime : '2020/03/05 13:00:00'
	 * }
	 */	
	elandmall.goodsTimer = function(pin){
		
		var fo_goods_url = pin.event_api_domain_url + "/fo-event/getCurrentDateTime";
		
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
        		var vDate = new Date(pin.countDt); 
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
        				if(pin.preComing_yn == "N"){ //커밍순일 때
	        				//타이틀 영역
	        				$(".flag_pre_coming").remove();
	        				$(".goods_name_flag").attr('class', 'goods_name');
	        				$(".sale_etc01").show();
	        				$(".flag_icon t01").show();
	        				$("#resev_deli_desc").show();
	        				//타이머 및 버튼 영역
	        				$('.comingsoon_remind').remove();
	        				$("#comingsoon_set_btn").remove();
	        				$("#goods_set_btn").show();
	        				//플로팅 영역
	        				$(".off_price_comingsoon").hide();
	        				$(".off_opt_btn_comingsoon").hide();
	        				$(".off_price").show();
	        				$(".off_opt_btn").show();
        				}else if(pin.preComing_yn == "Y"){ // 프리오더 일 때
        					//타이머 및 버튼 영역
        					$('.comingsoon_remind').remove();
        					$("#goods_set_btn").remove();
        					$("#pre_set_btn").show();
        					//플로팅
        					$(".off_price").hide();
        					$(".off_opt_btn").hide();
        					$(".off_price_comingsoon").show();
        					$("#off_opt_btn_pre").show();
        				}
        				clearInterval(timer); 
        				return; 
        			} 
        			
        			var days = Math.floor(distDt / day); 
        			var hours = Math.floor((distDt % day) / hour); 
        			var minutes = Math.floor((distDt % hour) / minute); 
        			var seconds = Math.floor((distDt % minute) / second); 
        			
        			html += "<em>" +fnfirstZero(days)+"</em>일 <em>"+fnfirstZero(hours)+"</em>시간 <em>"+fnfirstZero(minutes)+"</em>분 <em>"+fnfirstZero(seconds)+"</em>초";
        			$('#d_time_reserv').html(html);
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
	
	function autoAttP($el, attr, val){
		var sVal = "188px";
		if($.type(val) != "undefined") {
			sVal = val;
		}
		$el.css(attr,sVal);
	}
	
	

	function initDisableEvent (){
		
		if(location.pathname != "/goods/initGoodsDetail.action") {
			return;
		}
		
		document.oncontextmenu = function(e) {
		    var elt = window.event ? event.srcElement : e.target;
		    if (elt.id == "orderQtyNoOption" || elt.id == "orderQty" || elt.id == "url_text" || elt.id == "hdivItemTitle")
		        return true;
		    else {
		        alert("상품상세설명 무단도용방지를 위하여\n마우스 오른쪽버튼을 이용할 수 없습니다!\n    (해당 상품 판매자만 가능)");
		        return false;
		    }
		} ;
		
		document.onselectstart = function (e) {
			var elt = window.event? event.srcElement: e.target;
			if (elt.id == "orderQtyNoOption" || elt.id == "orderQty" || elt.id == "url_text" || elt.id == "hdivItemTitle")
				return true;
			else
				return false;
		} 
		document.ondragstart = function(e) {
		    var elt = window.event ? event.srcElement : e.target;
		    if (elt.id == "orderQtyNoOption" || elt.id == "orderQty" || elt.id == "hdivItemTitle")
		        return true;
		    else
		    	alert("상품상세설명 무단도용방지를 위하여\n드래그를 사용하실 수 없습니다.");
		        return false;
		}; 
	};
	//initDisableEvent();
	
	/**
	 * 상품상세에서 로그인 시 상품URL로전환
	 */
	elandmall.loginToGoDtail = function(p){		
		var fnGoDetailCallback = function(){
			location.href = elandmall.util.newHttps("/goods/initGoodsDetail.action?goods_no=" + p.goods_no + "&vir_vend_no=" + p.vir_vend_no);
		}
		elandmall.isLogin({login:fnGoDetailCallback, nomember_hide: p.nomember_hide});
	}
	
	/**
	 * 오늘직송(하이퍼) 배송정보 조회
	 * 
	 * */
	elandmall.hyperDeliInfo = function(pin) {
			
		var html = "";
		if(elandmall.loginCheck()){
			
			$.ajax({
		    	url : "/goods/getMbMbrDlvpMgmtHyperBaseAjax.action",
		    	type : "POST",
		    	data: pin,
		    	dataType : "json",
		    	async: false,
		    	success : function(data) {
		    		if(data != null && data.length > 0){
		    			html += '<div class="same_th"><span>배송예정일</span></div>';
		    			if(data[0].isLotVendMatch == 'Y'){ // 가능 지점 일시 
		    				var dlvpFirstStr = "";
			    			var dlvpFirstChk = false;
			    			//당일 체크 
		    				$.each(data, function(idx, info) {
		    					if("01" == info.date0){
		    						dlvpFirstChk = true;
		    						dlvpFirstStr = "오늘 "+ info.bgn_tm;
		    						return false;;
								}
		    					
				    		});
		    				
		    				if(!dlvpFirstChk){
								var dlvpTwoChk = false;	
								//1일 뒤 체크
								$.each(data, function(idx, info) {
			    					if("01" == info.date1){
			    						dlvpTwoChk = true;
			    						dlvpFirstStr = info.date1str + info.bgn_tm;
			    						return false;;
									}
					    		});
								
								if(!dlvpTwoChk){
									//2일 뒤 체크
									$.each(data, function(idx, info) {
				    					if("01" == info.date2){
				    						dlvpFirstStr = info.date2str + info.bgn_tm;
				    						return false;;
										}
						    		});
								}
							}
		    				
		    				html += '지금 주문하면 <b class="point_color">'+dlvpFirstStr+'부터 도착가능</b> 합니다.';
		    			}else{ //가능지점이 아닐 시 
		    				
			    			html += '현재 배송지로는 오늘직송 가능한 지점이 없습니다.';
		    			}
		    		}
		    	}
		    });
			
		}else{ // 비로그인 시 
			html += '<div class="dlv_login">';
			html += '<a href="javascript:;" class="login_btn" onclick="javascript:elandmall.loginToGoDtail({goods_no:\''+pin.goods_no+'\', vir_vend_no:\'' + pin.vir_vend_no + '\', nomember_hide: true});">로그인</a>';
			html += '하시면 배송지에 맞는<br>배송시간을 확인할 수 있습니다';
			html += '</div>';
		}
		
		$("#todayDeliInfo").append(html);
	}
	
})(jQuery);