;(function ($) {
	
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};	
	};
	//아이템 클릭옵션 분리시 필요 파라미터
	var set_goods_no="";
	var set_vir_vend_no="";
	var set_low_vend_type_cd="";
	var set_quickview_yn="";
	var set_reserv_yn="";
	var set_deli_goods_divi_cd="";
	var set_styleCode ="";
	var set_brandCode ="";
	var set_field_recev_poss_yn ="";
	var set_present_yn = "";
	var set_quick_deli_poss_yn = "";
	var set_carve_yn = "";
	
	var running_chk = false;

	var jwFlag = false; 
	var jwNormalFlag = false;
	var opt_select_info = new Array();
	var opt_select_info_json = "";
	
	
	elandmall.goodsDetail = {
			//[START]단품정보 초기화
			initOpt : function(p){

				p = $.extend({event_layer_yn : "N", goods_no: "", item_no: "", vir_vend_no: "",low_vend_type_cd:"",deli_goods_divi_cd:"",quickview_yn:"N" }, p || {});
				var quickview_yn = p.quickview_yn;
				var div = null;
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
					
				}else{
					div = $("#goods_opt");
				}
				
				var color_chip_val = +$("#color_mapp_option").val();
				
				if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){	// 예약일 때, 
					p["reserv_yn"] = "Y";
				}else{
					p["reserv_yn"] = "N";
				}

				if(p.jwFlag == "Y"){  // 주얼리 분기 처리  (주얼리 주문제작일때)
					jwFlag = true;
				}else{
					jwFlag = false;
				}
				
				
				if(p.jwFlag == "Y"){  // 주얼리 분기 처리  (주얼리 주문제작일때)
					jwFlag = true;
				}else{
					jwFlag = false;
				}
				
				jwNormalFlag = (p.jwNormalFlag == "Y")? true : false;
				
				if(jwFlag){  
					color_chip_val = 0; 
					var opt = div.find("[id^=options_nm1]");
					var juOptCd = opt.parents(".lyr_select").find(".sel_txt").data("opt_cd");
					p["optionCode"] = juOptCd;
					p["styleCode"] = p.styleCode;
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
				
				set_deli_goods_divi_cd=p.deli_goods_divi_cd;
				set_styleCode = p.styleCode;
				set_brandCode = p.brandCode;
				set_field_recev_poss_yn = p.field_recev_poss_yn //현장수령여부
				set_present_yn = p.present_yn;
				set_quick_deli_poss_yn = p.quick_deli_poss_yn; //오늘받송 여부 
				set_carve_yn = p.carve_yn;
				
				elandmall.optLayerEvt.ajaxItemList({
					param:first_param,    //{ goods_no: p.goods_no, vir_vend_no: p.vir_vend_no},
					success:function(data){
						var opt = div.find("[id^=options_nm1]");
						$selBtn =opt.parents('.lyr_select').children('.sel_btn');
						
						if(opt.attr("data-opt_cd") == "SI"){
							opt.parents('.lyr_select').addClass('hasDefault ');
						}
						
						$.each(data, function(idx) {
							var item_no = this.ITEM_NO;
							var opt_val_nm1 = this.OPT_VAL_NM1;
							var opt_val_cd1 = "";
							if(jwFlag){
								opt_val_cd1 = this.OPT_VAL_CD1;
							}
							var sale_poss_qty = this.SALE_POSS_QTY;
							var vir_vend_no = this.VIR_VEND_NO;
							var cancle_poss_yn = this.CANCLE_POSS_YN;
							var item_nm_add_info = this.ITEM_NM_ADD_INFO;
							var item_sale_price = this.ITEM_SALE_PRICE;
							var goods_sale_price = this.GOODS_SALE_PRICE;
							var sap_item_cd 	=	this.SAP_ITEM_CD
							
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
							
							//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
							if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
								item_sale_price="";
							}
							
							var optionObj = null;
							
							if(jwFlag){
								
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
									if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20" || p.event_layer_yn == "Y"){	// 예약일 때,
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
								
							}//주얼리 구분표시 END
							
							
							if(typeof(cancle_poss_yn) != "undefined"  && cancle_poss_yn != ""){
								optionObj.attr("data-cancle_poss_yn", cancle_poss_yn);
							}
							optionObj.attr("data-item_show_nm",opt_val_nm1);
							optionObj.attr("data-vir_vend_no",vir_vend_no);
							
							opt.append(optionObj);
							
							if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
								$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
								.on('touchstart focusin', function() {
									$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
								})
								.focusout(function() {
									$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
								});
								$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
									$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
								});
								
							}
						});
						$(".chk_out1").click(function(){
							if($(this).is(':checked')){
								$(this).parent().siblings('ul').children('.sld_out').hide();
							}else{
								$(this).parent().siblings('ul').children('.sld_out').show();
							}
							lyrMax();
							OrderScorller();
						});

						//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
						/*div.find("[id^=item_opt_nm]").change(function(){*/
						div.find('.lyr_options .options li .ancor').click(function(){
							var currObj = $(this);
							var opt_idx = $(this).parents('.options').data('index');
							
							if(jwFlag || jwNormalFlag){
								if(typeof(opt_idx) == "undefined") {
									return;
								} 
							}
							
							var $li = $(this).parent();
							//var $hideTg = []; // hide & show Target   //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
							var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
							if(!$li.hasClass('sld_out')){
								//$hideTg[0] = $(this).parent().parent().parent().parent().parent().siblings('dd');
								//$hideTg[1] = $(this).parent().parent().parent().parent().parent().parent().siblings('dl, .set');
								$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
								$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
								
								$selBtn.find('.sel_txt').attr('data-sel-cd', $(this).parent().data('code'));
								$selBtn.find('.sel_txt').val($li.attr('data-sap_item_cd'));
								
								$selBtn.find('.sel_txt').val($li.attr('data-value'));
								$('.lyr_select').removeClass('on');
								$li.addClass('selected').siblings('li').removeClass('selected');
								
								showText($selBtn);
								
								tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
								toggleBt('show');
								scrollReest();
								
								// mobileYn : overpass.goods.js 에서 FO와 MO가 공통영역 이기 때문에 체크를 해준다.
								// 옵션명이 날짜캘린더는 PCWEB만 존재하여 구분할수 있는 파라미터가 필요하기 때문에 생성 
								elandmall.optLayerEvt.changeItem({
									param:{ mobileYn: "Y", goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no,low_vend_type_cd:p.low_vend_type_cd, deli_goods_divi_cd : p.deli_goods_divi_cd, reserv_yn:p.reserv_yn,styleCode: p.styleCode, jwFlag:jwFlag, carve_yn : set_carve_yn, jwNormalFlag:jwNormalFlag},
									color_chip_val: color_chip_val,
									color_chip_yn:"Y",
									div:div,
									chgObj:$(this),
									callback_ajax:function(result){
										/*if(color_chip_val == result.next_idx){
										//elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn});
									}*/
									},
									callback:function(result){
										
										var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
										param["curr_idx"] = opt_idx;
										var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
										var currVal = currObj.parent().attr("data-value");
										var carve_yn = currObj.parents('.lyr_options').children().attr('data-carve_yn');
										$("#last_item_no").val(currVal);
										$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
										
										if(jwFlag){
											
											var opt = div.find("[id^=options_nm"+result.next_idx+"]");
											var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
												
											if(next_cd == "" || typeof(next_cd) == "undefined" && set_field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && set_present_yn == "Y"){
												$("#dd_receive_choice").show();
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
															param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).val();
															param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
															$(div).data("choice_yn","Y");
															//fnItemChoice(param);
															if(elandmall.goodsDetail.checkDefGoodsChoice(div)){
																param["goods_no"] = $("#goods_no").val();
																param["goods_nm"] = $("#goods_nm").val();
																param["carve_yn"] = carve_yn;
																elandmall.goodsDetail.jwGoodsAddParam({
																	param:param,
																});
															}
															
															
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														$(div).data("choice_yn","Y");
														if(elandmall.goodsDetail.checkDefGoodsChoice(div)){
															param["goods_no"] = $("#goods_no").val();
															param["goods_nm"] = $("#goods_nm").val();
															param["carve_yn"] = carve_yn;
															elandmall.goodsDetail.jwGoodsAddParam({
																param:param,
															});
														}else{	//사은품은 없고, 현장수령여부 체크가 있을 때, 설정한 상품정보를 임시저장
															$(div).data("choice_yn","Y");
															$(div).data("itemInfo", param);
														}
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
												}else{
													if(last_yn == "Y" && currVal == ""){
														$("#gift_slt", div).attr("data-value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
														$("[id^=gift_slt]", div).attr("data-sel-msg","");
														$("#gift_slt", div).attr("data-itemInfo","");
														$(div).removeData("choice_yn");
													}else if(last_yn !="Y"){
														$("#gift_slt", div).attr("data-value","");
														$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
														$("[id^=gift_slt]", div).attr("data-sel-msg","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
													}
												}
												
												
											}
											
											
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
															$("#dd_receive_choice").show();
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														$("#dd_receive_choice").show();
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
												}else{
													if(last_yn == "Y" && currVal == ""){
														$("#gift_slt", div).attr("data-value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
														$("[id^=gift_slt]", div).attr("data-sel-msg","");
														$("#gift_slt", div).attr("data-itemInfo","");
														$(div).removeData("choice_yn");
													}else if(last_yn !="Y"){
														$("#gift_slt", div).attr("data-value","");
														$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
														$("[id^=gift_slt]", div).attr("data-sel-msg","");
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
															$("#dd_receive_choice").hide();
														}else{	//사은품이 1개일 때,
															param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
															param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).val();
															param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
															$(div).data("choice_yn","Y");
															$(div).data("itemInfo", param);
															//fnItemChoice(param);
															if(elandmall.goodsDetail.checkDefGoodsChoice(div)){
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
															
															
														}
													}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
														$(div).data("choice_yn","Y");
														if(elandmall.goodsDetail.checkDefGoodsChoice(div)){
															elandmall.optLayerEvt.getItemPrice({
																param:param,
																success:function(data){
																	elandmall.goodsDetail.drawAddGoods({
																		data:data,
																		quickview_yn:quickview_yn
																	});
																}
															});
														}else{	//사은품은 없고, 현장수령여부 체크가 있을 때, 설정한 상품정보를 임시저장
															$(div).data("choice_yn","Y");
															$(div).data("itemInfo", param);
														}
													}//[END]사은품이 없을 때 항목을 바로 추가 한다.
												}else{
													if(last_yn == "Y" && currVal == ""){
														$("#gift_slt", div).attr("data-value","");
														$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
														$("[id^=gift_slt]", div).parent().removeClass("selected");
														$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
														$("[id^=gift_slt]", div).attr("data-sel-msg","");
														$("#gift_slt", div).attr("data-itemInfo","");
														$(div).removeData("choice_yn");
														$("#dd_receive_choice").hide();
													}else if(last_yn !="Y"){
														if(typeof(result.curr_idx) != "undefined"){
															$("#gift_slt", div).attr("data-value","");
															$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
															$("[id^=gift_slt]", div).attr("data-sel-msg","");
															$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
															$("[id^=gift_slt]", div).parent().removeClass("selected");
															$("#dd_receive_choice").hide();
														}
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
			//[START]사은품 변경 이벤트
			changeGift : function(p){
				var obj = p.obj;
				var scope_div = null;
				var quickview_yn = (typeof(p.quickview_yn) != "undefiend")? p.quickview_yn : "N";
				var dataGubun = $(obj).parents("#_optChoiceLayer").attr("data-gubun");
				if(p.quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else if(dataGubun == "CART" || dataGubun == "LST"){
					scope_div = $("#_optChoiceLayer");
				}else{
					scope_div = $("#goods_opt");
				}
				var layer_yn = $(obj).parents('.lyr_select').children().children('.sel_txt').data('layer_yn');
				var objVal = $(obj).attr("data-value");
				
				if(objVal != ""){
					$("#gift_slt", scope_div).attr('data-value',objVal);
					$("#gift_slt", scope_div).attr('value',objVal);
					$("#gift_slt", scope_div).parent().addClass("selected");
					$("#gift_slt", scope_div).attr("data-sel-msg",$(obj).children('.opt_name').text());
					$("#gift_slt", scope_div).text($(obj).children('.opt_name').text());
					$('.lyr_select').removeClass('on');
					toggleBt('show');
					scrollReest();
					
					if($("#multi_item_yn", scope_div).val() == "Y"){
						$(scope_div).attr("data-choice_yn", "Y");
						
						var param = $("#gift_slt", scope_div).data("itemInfo");
						param["gift_nm"] = $(obj).data('opt_name');
						param["gift_goods_dtl_no"] = objVal;
						param["gift_stock_qty"] = $(obj).data("stock_qty");
						if(typeof($("#recev_slt", scope_div)) != "undefined"){
							if($("#recev_slt", scope_div).attr("data-value") != ""){
								param["cart_grp_cd"] = $("#recev_slt", scope_div).attr("data-value");
							}
							
						}
						if(elandmall.goodsDetail.checkDefGoodsChoice(scope_div)){
							elandmall.optLayerEvt.getItemPrice({
								param:param,
								success:function(data){
									elandmall.goodsDetail.drawAddGoods({
										data:data,
										quickview_yn:quickview_yn,
										gift_nm:param["gift_nm"],
										gift_goods_dtl_no:param["gift_goods_dtl_no"],
										gift_stock_qty:param["gift_stock_qty"]
									});
									elandmall.goodsDetail.sumMultiTotal(scope_div);
								}
							});
						}

					}else{
						if($("#goods_cmps_divi_cd", scope_div).val() == "20"){		//세트상품일 때,
							var param = $("#gift_slt", scope_div).data("itemInfo");
							param["gift_nm"] = $(obj).data('opt_name');
							param["gift_goods_dtl_no"] = objVal;
							param["gift_stock_qty"] = $(obj).data("stock_qty");
							elandmall.optLayerEvt.getSetGoodsPrice({
								param:param,
								success:function(data){
									elandmall.goodsDetail.drawAddGoods({
										type:"SET",
										data:data,
										quickview_yn:quickview_yn,
										set_param:param,
										gift_nm:param["gift_nm"],
										gift_goods_dtl_no:param["gift_goods_dtl_no"],
										gift_stock_qty:param["gift_stock_qty"]
									});
									elandmall.goodsDetail.sumMultiTotal(scope_div);
									
								}
							});
						}else if($("#goods_type_cd", scope_div).val() == "80"){	//묶음상품일 때,
							$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
							var multi_item_yn = $("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn");
							var param = $("#gift_slt", scope_div).data("itemInfo");
							param["gift_nm"] = $(obj).data('opt_name');
							param["gift_stock_qty"] = $(obj).data("stock_qty");
							param["gift_goods_dtl_no"] = objVal;
							if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
								$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
								
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
				}else{
					$(scope_div).removeData("choice_yn");
				}
			},//[END]사은품 변경 이벤트
			resetGift:function(scope_div){
				$("[id^=gift_slt]", scope_div).attr("data-value","");
				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
				$("#pkgCmpsGoods", scope_div).attr("data-choice_yn","");
			},			
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
			sumMultiTotalJw : function(){
				//가격 합
				var totalAmt = 0;
				for(var i=0; i<$("#choiceItemBox").find('li').length; i++){
					var price = $("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
					var ord_qty = $("#choiceItemBox").find('li').eq(i).find('.qty').find('#ord_qty').val();
					totalAmt += + price * ord_qty;
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
			//[START]수량증가
			setPlus : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var scope_div = $("#goods_opt");
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
				
				//옵션 상품이거나, 세트상품, 묶음상품일 때,
				if($("#multi_item_yn", scope_div).val() == "Y" || $("#goods_cmps_divi_cd", scope_div).val() == "20" || goods_type_cd == "80" || jwFlag ){
					opt_set_pkg_yn = true;
				}
				
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyScopeDiv = opt_set_pkg_yn ? classkeyDiv : scope_div;
				var qtyObj = $(":input[name='ord_qty']", qtyScopeDiv);
				var addQty = +((goods_type_cd == "50") ? 1 : sale_unit_qty);
				var qty = +(qtyObj.eq(0).val()) + addQty;		// 현 개수+더하는 수량(판매수량 or 1개)
				var omsSaleQty = (typeof($(":input[name='omsSaleQty']", qtyScopeDiv).val()) != "undefined")? $(":input[name='omsSaleQty']", qtyScopeDiv).val() : ""; 
				
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
					
					var gift_stock_qty = +$("#gift_stock_qty", classkeyDiv).val();
					if(gift_stock_qty > 0 && gift_stock_qty < qty){
						alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
						return;
					}
				}else{
					if ( !fnStockChk(p, qty) ){
						return;
					};
				}
				
				elandmall.goodsDetail.setPlusOrd(qtyObj, addQty);
				
				var priceObj =$(":hidden[name='sale_price']", qtyScopeDiv);
				$(".itemPrc", qtyScopeDiv).html(elandmall.util.toCurrency( +(priceObj.val()) * +(qtyObj.eq(0).val())) );
				
				elandmall.goodsDetail.sumMultiTotal(scope_div);
			},//[END]수량증가
			//[START]수량감소
			setMinus : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $("#goods_opt");
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var opt_set_pkg_yn = false;	//옵션, 묶음, 세트 상품일 때
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				
				if($("#multi_item_yn", scope_div).val() == "Y" || $("#goods_cmps_divi_cd", scope_div).val() == "20" || goods_type_cd == "80"  || jwFlag ){
					opt_set_pkg_yn = true;
				}
				
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyScopeDiv = opt_set_pkg_yn ? classkeyDiv : scope_div;
				var qtyObj = $(":input[name='ord_qty']", qtyScopeDiv);
				var addQty = +((goods_type_cd == "50") ? 1 : sale_unit_qty);
				var qty = +(qtyObj.eq(0).val()) - addQty;
				
				if(+p.min_qty > 1  && p.min_qty > qty){
					alert("구매할 수 있는 최소 갯수는 "+ p.min_qty +" 입니다.");
					qtyObj.val(p.min_qty);
				} else {
					elandmall.goodsDetail.setMinusOrd(qtyObj, addQty);
				}
				
				var priceObj =$(":input[name='sale_price']", qtyScopeDiv);
				$(".itemPrc", qtyScopeDiv).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qtyObj.eq(0).val())));

				elandmall.goodsDetail.sumMultiTotal(scope_div);			
			},//[END]수량감소
			//[START]쥬얼리 주문제작 수량증가
			setPlusJw : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyObj = $(":input[name='ord_qty']", classkeyDiv);
				var addQty = 1;
				var qty = +(qtyObj.eq(0).val()) + addQty;		// 현 개수+더하는 수량(판매수량 or 1개)
				
				var price = 0;
				for(var i=0; i<$("#choiceItemBox").find('li').length; i++){
					if($("#choiceItemBox").find('li').eq(i).attr('class') ==  "L"+p.classkey){
						var ord_qty = Number($("#choiceItemBox").find('li').eq(i).find('.qty').find('#ord_qty').val() );
						price = $("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
						ord_qty = ord_qty+ addQty;
						$(":input[name='ord_qty']", $("#choiceItemBox").find('li').eq(i)).attr('value', ord_qty);
					}
				}
				
				qtyObj.eq(0).val(qty);
				$(".itemPrc", classkeyDiv).html(elandmall.util.toCurrency( +(price) * +(qtyObj.eq(0).val())) );
				elandmall.goodsDetail.sumMultiTotalJw();
			},//[END]쥬얼리수량증가
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
			//[START]수량감소
			setMinusJw : function (p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var classkeyDiv = $(".L"+p.classkey, scope_div);
				var qtyObj = $(":input[name='ord_qty']", classkeyDiv);
				var addQty = 1;
				var qty = +(qtyObj.eq(0).val()) - addQty;
				
				
				if(qty < 1){
					return false;
				}
				

				var price = 0;
				for(var i=0; i<$("#choiceItemBox").find('li').length; i++){
					if($("#choiceItemBox").find('li').eq(i).attr('class') ==  "L"+p.classkey){
						var ord_qty = Number($("#choiceItemBox").find('li').eq(i).find('.qty').find('#ord_qty').val() );
						price = $("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
						ord_qty = ord_qty - addQty;
						$(":input[name='ord_qty']", $("#choiceItemBox").find('li').eq(i)).attr('value', ord_qty);
					}
				}
				qtyObj.eq(0).val(qty);
				$(".itemPrc", classkeyDiv).html(elandmall.util.toCurrency( +(price) * +(qtyObj.eq(0).val())) );
				elandmall.goodsDetail.sumMultiTotalJw();
				
			},//[END]쥬얼리 수량감소
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
			},
			clickCartOrd : function(p){ //[START] 장바구니, 바로구매 클릭 함수
				p = $.extend({event_layer_yn:"N"},p);
				if(!elandmall.goodsDetail.checkValidCartOrd(p)){
					return;
				}
				var quickview_yn = p.quickview_yn;
				var mb_carts = [];
				
				if(quickview_yn == "Y" || p.event_layer_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $(".goods_wrap");
				}
				
				var isTodayDeliChk = typeof(p.isTodayDeliChk) != "undefined" ? true : false;
				//오늘받송 또는 오늘직송 체크로직
				var deli_cart_grp_cd = "";
				if($("#goods_type_cd", $("#goods_opt")).val() == "80"  && $("#multi_item_yn", $("#goods_opt")).val() != "Y"){
					deli_cart_grp_cd = $("[name=cmps_cart_grp_cd]", $("#detailform")).val();
				}else if($("#multi_item_yn", scope_div).val() == "Y"){
					deli_cart_grp_cd = scope_div.find(".choiceGoods").find('li').eq(0).find("input[name='cart_grp_cd']").val();  //예약 배송과 오늘받송은 다른배송과 섞이지 못함으로 가격박스 첫번째 것을 가져온다.
				}else{
					deli_cart_grp_cd = $("[name=cart_grp_cd]", $("#detailform")).val();
				}
				
				if(!isTodayDeliChk && (deli_cart_grp_cd == "60" || deli_cart_grp_cd ==  "70" )){
					p["deli_cart_grp_cd"] = deli_cart_grp_cd;
					elandmall.goodsDetail.fnDeliValidChk(p);
					return;
				}
				
				mb_carts = elandmall.goodsDetail.setParam({arrCart:mb_carts, quickview_yn:quickview_yn, cart_divi_cd:p.cart_divi_cd});
				var items = [];
				$.each(mb_carts, function() {
					items.push(this);
				});
				
				var param_nomember = true;
				var cartPin ={
						cart_divi_cd: p.cart_divi_cd,
						items: items,
						event_layer_yn : p.event_layer_yn //이벤트 상품 레이어 여부
				};
				
				if($("#recev_slt", $("#detailform")).length > 0){
					
					var present_check= false;
					
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						if(cart_grp_cd == "50" && $("#recev_slt", $("#detailform",scope_div)).val()  != "50"){
							if( p.cart_divi_cd == "10" ) {
								present_check = true;
								break;
							}
						}
					}
				}
				
				
				if(present_check){
					alert("선물하기는 바로구매만 가능합니다.");
					return false;
				}
				
				if(jwFlag || p.low_vend_type_cd == "50" && p.deli_goods_divi_cd == "10"){
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						if(cart_grp_cd == "50"){
							if (!elandmall.loginCheck()){
								alert("선물하기는 이랜드몰 회원만 이용 가능 합니다.");
								param_nomember = false;
								break;
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
				elandmall.cart.addCart({ 
					cart_divi_cd: p.cart_divi_cd,
					items: items,
					param_nomember : param_nomember
				});
				}

			}, //[END] 장바구니, 바로구매 클릭 함수
			
			// 2017.11.28 Start 
			clickCartOrdEvent : function(p){ //[START] 장바구니, 바로구매 클릭 함수
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
				elandmall.cart.addCartEventMobile({ 
					cart_divi_cd: p.cart_divi_cd,
					items: items
				});

			}, //[END] 장바구니, 바로구매 클릭 함수
			// 2017.11.28 End
			
			
			//[START] 방문수령여부 변경 주얼리 주문제작 
			changeFieldRecJw : function(pin){
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")?pin.quickview_yn:"N";
				var obj = pin.obj;
				var scope_div = null;
				var goods_nm = "";
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
				}
				
				var type = (typeof(pin.type) != "undefined")?pin.type:"DEF";
				
				
				var objVal = $(obj).attr("data-value");
				$("#recev_slt", scope_div).attr("data-value",objVal);
				
				var dataSelMsg = $(obj).children().text();
				$("#recev_slt", scope_div).attr("data-sel-msg",dataSelMsg);
				
				$("#cart_grp_cd", scope_div).val($("#recev_slt", scope_div).attr('data-value'));
				
				var lowVendTypeCd = $("#option_low_vend_type_cd").val();
				

				if(type == "PKG"){
					set_goods_no = scope_div.find('.selected').children('.sel_txt').attr('data-goods_no');
					set_styleCode = $("#dd_cmps_goods").find('.lyr_select').find('.lyr_options').children('.options').find('.selected').children('.ancor').attr('data-style_cd');
					set_brandCode = $("#dd_cmps_goods").find('.lyr_select').find('.lyr_options').children('.options').find('.selected').children('.ancor').attr('data-brand_cd');
					goods_nm = $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg');
					
				}else{
					goods_nm = $("#goods_nm").val();
				}
				
				var carve_code = $(obj).parents('.g_opt').find('#dd_id_carve').children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-sel-cd');
				
				if(typeof(carve_code) != "undefined" ){
					
					var check_flag = false;
						
					if(carve_code == "ISOS" || carve_code == "OSIS"){
						
						var chkIn = scope_div.find("#in_carve").val();
						var chkOut = scope_div.find("#out_carve").val();
						if(chkIn == "" && chkOut == "") {
							alert("각인을 입력해 주세요.");
							check_flag = true;
						}else if(fnStrChkText('in_carve', 'IS')){
							check_flag = true;
						}else if(fnStrChkText('out_carve', 'OS')){
							check_flag = true;
						}
					}else if(carve_code == "IS"){
						if(fnStrChkText('in_carve', 'IS')){
							check_flag = true;
						}
					}else if(carve_code == "OS"){
						if(fnStrChkText('out_carve', 'OS')){
							check_flag = true;
						}
					}
					
					if(check_flag){
						$("#dd_receive_choice").children('.lyr_select').removeClass('on');
						$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').removeClass('selected');
						$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
						$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').text('수령방법을 선택하세요.');
						$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
						$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
						$('.lyr_options #recev_nm li .ancor').unbind();
						toggleBt('show');
						scrollReest();
						return;
					}
					
					
				}
				
				if($("#recev_slt", scope_div).attr('data-value') == "40"){
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
									, obj			:   obj 
									, carve_code	:	carve_code
									}
									, pin || {} 
									);
								
					elandmall.goodsDetail.jwGoodsAddParam({
					param:param,
					});
					
					
				function fnStrChkText (textid, opt){
					var text = ""; 
					var result_chk = false;
					text = $('#'+textid).val();
					
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
				//NGCPO-7442 : 즉시구매여부 imme_purch_yn 추가
				var imme_purch_yn = (typeof(pin.imme_purch_yn) != "undefined")?pin.imme_purch_yn:"N";
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
				}
				
				//희망배송일 선택 상품은 오늘받송과 의미가 맞지 않다.
				var deli_hope_day_yn = (typeof(pin.deli_hope_day_yn) != "undefined")?pin.deli_hope_day_yn:"N";
				if(deli_hope_day_yn == "Y"){
					alert("배송일 선택 상품은 당일배송이 불가능합니다.");
					$("input[name=sel_dlv]:checked", scope_div).prop('checked', false);
					$("#recev_slt", scope_div).attr('data-value', "");
					$("#recev_slt", scope_div).attr("data-choice_yn","N");
					return false;
				}

				var layer_yn = $(obj).parents('.lyr_select').children().children('.sel_txt').data('layer_yn');
				var objVal = $(obj).attr("data-value");
				$("#recev_slt", scope_div).attr("data-value",objVal);
				
				var lowVendTypeCd = $("#option_low_vend_type_cd").val();
				
				tglAc($(obj), 'show'); //NGCPO-5887 : 다른 옵션 가리기
				//바로구매 버튼 활성 1
				if($("#recev_slt", $("#detailform")).attr('data-value') == "50"){
					$("#btn_grp").find('.cart').remove();
					$("#btn_grp").find('.buy').attr('class', 'btn');
				}else{
					if( scope_div.find("#event_layer_yn").val() != "Y" && $("#btn_grp").find('.cart').length < 1 ){
						if(imme_purch_yn == "N"){
							$("#btn_grp").find('.btn').attr('class', 'buy');
							$("#btn_grp").find('.buy').before('<button type="button" class="cart" id="cartBtn" data-ga-tag="MW_상품상세||구매버튼||장바구니" onclick="elandmall.goodsDetail.clickCartOrd({cart_divi_cd:\'10\'});" disabled="disabled">장바구니</button>');
						}
					}
				}
				
				
				if(jwNormal_yn == "Y"){
					if(lowVendTypeCd == "50" && $("#recev_slt", $("#detailform")).attr('data-value') == "40"){
						commonUI.dimCall();
					}
					
					var param = {};
					if($("#goods_type_cd", scope_div).val() == "80"){
						
						param["goods_no"] = scope_div.find('.selected').children('.sel_txt').attr('data-goods_no');
						param["vir_vend_no"] = scope_div.find('.selected').children('.sel_txt').attr('data-vir_vend_no');
						param["item_no"] = $("#last_item_no", scope_div).val(); 
						param["jwNormal_yn"] = jwNormal_yn;
						param["brand_cd"] = pin.brand_cd;
						param["style_cd"] = pin.style_cd;
						param["last_sap_item_cd"] = $("#last_sap_item_cd", scope_div).val();
						
						elandmall.optLayerEvt.getItemPrice({
							param:param,
							success:function(data){
								data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
								elandmall.goodsDetail.drawAddGoods({
									data:data,
									quickview_yn:quickview_yn,
									type : pin.type
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
						
						elandmall.optLayerEvt.getItemPrice({
							param:param,
							success:function(data){
								elandmall.goodsDetail.drawAddGoods({
									data:data,
									quickview_yn:quickview_yn,
									imme_purch_yn:imme_purch_yn
								});
							}
						});
					}
					
				}else{
					

					if($("#goods_type_cd", scope_div).val() == "80"){
						var multi_item_yn = $("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn");
						var disp_seq = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
						if($("#recev_slt", $("#dd_receive_choice",scope_div)).attr("data-value") != ""){
							$("#recev_slt", $("#dd_receive_choice", scope_div)).attr("data-choice_yn", "Y");
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
										p["cart_grp_cd"] = $("#recev_slt", $("#dd_receive_choice", scope_div)).attr("data-value");
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
					}else{
						if($("#recev_slt", scope_div).length > 0){
							if($("#recev_slt", $("#dd_receive_choice", scope_div)).attr("data-value") != ""){
								
								$("#recev_slt", $("#dd_receive_choice", scope_div)).attr("data-choice_yn", "Y");
								
								if($("#multi_item_yn", scope_div).val() == "Y"){		//옵션상품일 때,
									var param = $(scope_div).data("itemInfo");
									if($("#gift_slt", scope_div).length > 0){
										param = $("#gift_slt", scope_div).data("itemInfo");
									}
									
									if(elandmall.goodsDetail.checkDefGoodsChoice(scope_div)){
										elandmall.optLayerEvt.getItemPrice({
											param:param,
											success:function(data){
												data[0]["cart_grp_cd"] = $("#recev_slt", $("#dd_receive_choice", scope_div)).attr("data-value");
												elandmall.goodsDetail.drawAddGoods({
													data:data,
													quickview_yn:quickview_yn,
													gift_nm:param["gift_nm"],
													gift_goods_dtl_no:param["gift_goods_dtl_no"],
													gift_stock_qty:param["gift_stock_qty"]
												});
											}
										});
									}
								}
								
							}else{
								$("#recev_slt", $("#dd_receive_choice", scope_div)).attr("data-choice_yn","N");
							}
							$("#cart_grp_cd", scope_div).val($("#recev_slt", scope_div).attr("data-value"));
						}else{
							$("#cart_grp_cd", scope_div).val($("input[name=field_rec]:checked", scope_div).val());
							if($("#recev_slt", "#_optChoiceLayer").length > 0){
								$(obj).parents().find("#_optChoiceLayer").data("goods_info").cart_grp_cd=objVal;
							}
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
					scope_div = $("#goods_opt");
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
									if(str.indexOf('layerInfo')  != -1 ){
										str = elandmall.util.newHttps("/goods/initGoodsDetail.action?goods_no=" + $("#goods_no", $("#detailform", scope_div)).val() + "&vir_vend_no=" + $("#vir_vend_no", $("#detailform", scope_div)).val());
										location.replace(elandmall.util.https("/mypage/searchBanJJakDlvpListLayer.action?url=" + encodeURIComponent(str)));
									}else{
										location.replace(elandmall.util.https("/mypage/searchBanJJakDlvpListLayer.action?url=" + encodeURIComponent(window.location.href)));
									}
									return false;
								}else{
									$("input[name=sel_dlv]:checked").prop('checked', false);
									$("#recev_slt", scope_div).attr('data-value', "");
									$("#recev_slt", scope_div).attr("data-choice_yn","N");
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
						 		
						 		if(deli_cart_grp_cd=="60" && isQuickholiday == "Y"){
                                	$("#dlv2").attr('disabled', true);
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
											$("input[name=sel_dlv]:checked", scope_div).prop('checked', false);
											$("#recev_slt", scope_div).attr('data-value', "");
											$("#recev_slt", scope_div).attr("data-choice_yn","N");
										}
									});
						 		}								
							}
						}
					});
				}
				
				var fnCancelCallback = function(){
					$("input[name=sel_dlv]:checked", scope_div).prop('checked', false);
					$("#recev_slt", scope_div).attr('data-value', "");
					$("#recev_slt", scope_div).attr("data-choice_yn","N");
				}
				
				
				var fnSuccessCallback = function(){
					if(deli_cart_grp_cd == "70"){
						var str = window.location.href;
						if(str.indexOf('layerInfo')  != -1 ){
							location.href = elandmall.util.newHttps("/goods/initGoodsDetail.action?goods_no=" + $("[name=goods_no]", scope_div).val() + "&vir_vend_no=" + $("[name=vir_vend_no]",scope_div).val());
						}else{
							location.reload();
						}
					}else{
						fnDeliCallback();
					}
				}
				
				if (!elandmall.loginCheck()){
					if(confirm("로그인이 필요한 서비스 입니다.\n로그인하겠습니까?")){
						elandmall.isLogin({login:fnSuccessCallback, close:fnCancelCallback, nomember_hide: true});
					}
				} else {
					fnDeliCallback();
				}
				
			},//[END] 오늘받송  변경
								
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
					if($('.gd_opt_scroll').length>0){
						scope_div = $("#goods_opt");
					}else{
						scope_div =selectedOpt.parents(".basket_prd");
					}
				}

				
				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();

				if( $(selectedOpt).attr("data-low_vend_type_cd") == "50" && $(selectedOpt).attr("data-deli_goods_divi_cd") == "30" ) {
					jwFlag = true;
				}else{
					jwFlag = false;
				}
				
				var $li = $(obj).parent();
				if(!$li.hasClass('sld_out')){
					param["goods_no"] = objVal;
					param["vir_vend_no"] = $(selectedOpt).data("vir_vend_no");
					param["quickview_yn"] = quickview_yn;


					if(jwFlag){
						param["low_vend_type_cd"] = $(selectedOpt).attr("data-low_vend_type_cd");
						param["deli_goods_divi_cd"] = $(selectedOpt).attr("data-deli_goods_divi_cd");
						param["styleCode"] = $(selectedOpt).attr("data-style_cd");
					}
					
					if(objVal != ""){		//선택된 값이 있을때만 실행.
						elandmall.optLayerEvt.drawPkgCmpsGoodsSelect({
							param:param,
							success:function(rst){
								$("dl#dl_pkgCmpsGoods", scope_div).children(":not([id^=dd_cmps_goods])").remove();	//상품선택 셀렉트를 제외한 나머지 삭제
								var html = rst;
								$("#dl_pkgCmpsGoods", scope_div).append(html);
								
								if(jwFlag){
									multi_yn = "Y";
								}
								
								if(multi_yn != 'Y'){	//옵션상품이 아닐 때
									$("#pkgCmpsGoods", scope_div).attr("data-disp_seq",$(selectedOpt).attr("data-disp_seq"));
									$("#pkgCmpsGoods", scope_div).attr("data-vend_nm",$(selectedOpt).attr("data-vend_nm"));
									$("#pkgCmpsGoods", scope_div).attr("data-goods_no",$(selectedOpt).attr("data-value"));
									$("#pkgCmpsGoods", scope_div).attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
									$("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn",multi_yn);
									var data;
									if($('.gd_opt_scroll').length>0){
										data = $("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).data("goods_info").goodsData;
									}else{
										data =scope_div.find("#pkgCmpsGoodsInfo").data("goods_info").goodsData;
									}
									data[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
									data[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
									
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
											$("#dd_receive_choice").hide();
										}else{	//사은품이 1개일 때,
											$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
											if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
												param["item_no"] = "00000";
//											elandmall.optLayerEvt.getSetGoodsPrice({
												elandmall.optLayerEvt.getItemPrice({
													param:param,
													success:function(data){
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
										$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
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
											 	var  optLyr =  $(this).parent('.lyr_select');
												if ($(this).parent().hasClass('on')){
													$(this).parent().removeClass('on');
													toggleBt('show');
												}
												else{
													$(this).parent().addClass('on');
													toggleBt('hide');
													lyrMax($(this),optLyr);
												}
												scrollReest();
												showText($(this));
											}
									});
								}else{	//옵션상품일 때,
									$("#pkgCmpsGoods", scope_div).attr("data-disp_seq",$(selectedOpt).attr("data-disp_seq"));
									$("#pkgCmpsGoods", scope_div).attr("data-vend_nm",$(selectedOpt).attr("data-vend_nm"));
									$("#pkgCmpsGoods", scope_div).attr("data-goods_no",$(selectedOpt).attr("data-value"));
									$("#pkgCmpsGoods", scope_div).attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
									$("#pkgCmpsGoods", scope_div).attr("data-multi_item_yn",multi_yn);

									

									var juOptCd = "";
									if(jwFlag){
										var opt = scope_div.find("[id^=options_nm1]");
										juOptCd = opt.parents(".lyr_select").find(".sel_txt").data("opt_cd");
									}else{
										juOptCd = "";	
									}
									var pkg_goods_no = $("#goods_no",scope_div).val();
									if(pkg_goods_no==undefined ||pkg_goods_no ==""){
										pkg_goods_no = scope_div.find("#_optChoiceLayer").data("goods_info").goods_no;
									}
									
									
									elandmall.optLayerEvt.ajaxItemList({	//첫번째 옵션 가져오기
										param:{ goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no
											, styleCode:$(selectedOpt).attr("data-style_cd"), optionCode : juOptCd, low_vend_type_cd: $(selectedOpt).attr("data-low_vend_type_cd"), deli_goods_divi_cd: $(selectedOpt).attr("data-deli_goods_divi_cd"),event_layer_yn : event_layer_yn},
										
										success:function(data){
											var opt = scope_div.find("[id^=options_nm1]");
											var $selBtn =opt.parents('.lyr_select').children('.sel_btn');
											
											if(opt.attr("data-opt_cd") == "SI"){
												opt.parents('.lyr_select').addClass('hasDefault ');
											}
											
											$.each(data, function(idx) {
												var item_no = this.ITEM_NO;
												var opt_val_nm1 = this.OPT_VAL_NM1;
												
												var opt_val_cd1 = "";
												if(jwFlag){
													opt_val_cd1 = this.OPT_VAL_CD1;
												}
												
												var sale_poss_qty= this.SALE_POSS_QTY;
												var item_nm_add_info = this.ITEM_NM_ADD_INFO;
												var item_sale_price = this.ITEM_SALE_PRICE;
												var goods_sale_price = this.GOODS_SALE_PRICE;
												var sap_item_cd 	 = this.SAP_ITEM_CD;
												
												
												if(typeof(item_nm_add_info) == "undefined"){
													item_nm_add_info = "";
												}
												if (  item_sale_price > -1 && $("#option_low_vend_type_cd").val() != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
													if ( item_sale_price == 0 ){
														//item_sale_price = Number($("#base_sale_price").val());
														item_sale_price = elandmall.util.toCurrency(goods_sale_price);
													}
													item_sale_price = elandmall.util.toCurrency(item_sale_price);
												}else{
													item_sale_price = elandmall.util.toCurrency(goods_sale_price);
												}
												if(item_sale_price !="" && item_sale_price !="0"){
													item_sale_price = item_sale_price+"원";
												}
												
												if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
													item_sale_price="";
												}
												var optionObj = null;
												
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
														if(event_layer_yn == "Y"){
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
												
												
												optionObj.attr("data-item_show_nm",opt_val_nm1);
												
												opt.append(
														optionObj
												);
												
												if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
													$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
													.on('touchstart focusin', function() {
														$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
													})
													.focusout(function() {
														$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
													});
													$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
														$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
													});
													
												}
											});
											$('.sel_btn.option').click(function () {
												 if(!$(this).parent().hasClass('disabled')){
													 	var  optLyr =  $(this).parent('.lyr_select');
													 	var $this = $(this);
														if ($(this).parent().hasClass('on')){
															$(this).parent().removeClass('on');
															toggleBt('show', $this);
															scrollReest();
														}
														else{
															$(this).parent().addClass('on');
															toggleBt('hide', $this);
															lyrMax($(this),optLyr);
															scrollReest($(this));
														}
														showText($(this));
													}
											});
											
											$(".chk_out1").click(function(){
												if($(this).is(':checked')){
													$(this).parent().siblings('.lyr_options').children('ul').children('.sld_out').hide();
												}else{
													$(this).parent().siblings('.lyr_options').children('ul').children('.sld_out').show();
												}
												lyrMax();
												OrderScorller();
											});
											//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
											//scope_div.find("[id^=item_opt_nm]").change(function(){
											scope_div.find('.lyr_options .options li .ancor').click(function(){
												
												if(jwFlag || jwNormalFlag){
													if(typeof($(this).attr('data-value')) != "undefined"){
														return;
													}
												}
												
												var currObj = $(this);
												var opt_idx = $(this).parents('.options').data('index');
												var field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
												var present_yn = $("#item_opt_li_data").attr('data-present_yn');
												var $li = $(this).parent();
												//var $hideTg = []; // hide & show Target   //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
												var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
												if(!$li.hasClass('sld_out')){
													//$hideTg[0] = $(this).parent().parent().parent().parent().parent().siblings('dd');
													//$hideTg[1] = $(this).parent().parent().parent().parent().parent().parent().siblings('dl, .set');
													$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
													$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
													
													$selBtn.find('.sel_txt').attr('data-sel-cd', currObj.parent().data('code'));
													$selBtn.find('.sel_txt').attr("data-sap_item_cd",$li.attr("data-sap_item_cd"));
													
													$selBtn.find('.sel_txt').attr('data-value',currObj.parent().attr("data-value"));
													$('.lyr_select').removeClass('on');
													$li.addClass('selected').siblings('li').removeClass('selected');
													
													//NGCPO-6522 로 조건 추가 제거
													//if( !(parseInt($li.find('.ancor').attr('data-disp_seq')) > 1 && $li.find('.ancor').attr('data-multi_item_yn') != "Y" && $("#dl_pkgCmpsGoods").find('#dd_receive_choice').length < 1 && typeof($li.find('.ancor').attr('data-set_cmps_item_no')) == "undefined") ){
														showText($selBtn);
													//} 	

													tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
													toggleBt('show');
													scrollReest();
													elandmall.optLayerEvt.changeItem({
														param: { styleCode: $(selectedOpt).attr("data-style_cd"), goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no, jwFlag:jwFlag, low_vend_type_cd : $(selectedOpt).attr("data-low_vend_type_cd"), deli_goods_divi_cd: $(selectedOpt).attr("data-deli_goods_divi_cd"), jwNormalFlag:jwNormalFlag},
														div:scope_div,
														chgObj:$(this),
														callback:function(result){
															
															var param = { goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).data("vir_vend_no")};
															param["curr_idx"] = opt_idx;
															var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
															var currVal = currObj.parent().attr("data-value");
															$("#last_item_no").val(currVal);
															$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
															
															
															if($(selectedOpt).attr("low_vend_type_cd") == "50" && $(selectedOpt).attr("deli_goods_divi_cd") == "30"){
																var opt = scope_div.find("[id^=options_nm"+(opt_idx+1)+"]");
																var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
																
																if(next_cd == "" || typeof(next_cd) == "undefined" && field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && present_yn == "Y" ){
																	$("#dd_receive_choice").show();
																}else{
																	
																	if(last_yn == "Y" && currVal != ""){
																		if($(selectedOpt).attr("data-low_vend_type_cd") == "40" || $(selectedOpt).attr("data-low_vend_type_cd") == "50"){
																			param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
																		}
																		param["item_no"] = currVal;
																		//사은품이 있다면
																		if($("#giftInfo", scope_div).length > 0 ){ 
																			if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
																					itemParam[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																					itemParam[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
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
																					param["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																					param["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
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
																							data[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																							data[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
																							
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
																				param["GOODS_NM"] = $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg');
																				param["vir_vend_no"] = vir_vend_no;
																				param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
																				param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
																				
																				elandmall.goodsDetail.jwGoodsAddParam({
																					param:param,
																				});
																			
																		}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																	}else{
																		$("#dd_receive_choice").hide();
																		if(last_yn == "Y" && currVal == ""){
																			if($("#gift_slt", scope_div).length > 0){
																				$("[id^=gift_slt]", scope_div).attr("data-value","");
																				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
																				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																				$("#gift_slt", scope_div).data("itemInfo", param);
																			}else{
																				$("#pkgCmpsGoods", scope_div).data("choice_yn", "N");
																			}
																		}
																	}
																}
															
															}else{
																
																if(jwNormalFlag && (field_recev_poss_yn == "Y" || present_yn == "Y")){
																	if(last_yn == "Y" && currVal != ""){
																		if($(selectedOpt).attr("data-low_vend_type_cd") == "40" || $(selectedOpt).attr("data-low_vend_type_cd") == "50"){
																			param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
																		}
																		param["item_no"] = currVal;
																		//사은품이 있다면
																		if($("#giftInfo", scope_div).length > 0 ){ 
																			if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
																					itemParam[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																					itemParam[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
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
																					param["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																					param["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
																					$("#gift_slt", scope_div).data("itemInfo", param);
																				}
																			}else{
																				$("#dd_receive_choice").show();
																			}
																		}else{
																			$("#dd_receive_choice").show();
																		}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																	}else{
																		if(last_yn == "Y" && currVal == ""){
																			if($("#gift_slt", scope_div).length > 0){
																				$("[id^=gift_slt]", scope_div).attr("data-value","");
																				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
																				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																				$("#gift_slt", scope_div).data("itemInfo", param);
																			}else{
																				$("#pkgCmpsGoods", scope_div).data("choice_yn", "N");
																			}
																		}
																	}
																}else{
																	
																	if(last_yn == "Y" && currVal != ""){
																		if($(selectedOpt).attr("data-low_vend_type_cd") == "40" || $(selectedOpt).attr("data-low_vend_type_cd") == "50"){
																			param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
																		}
																		param["item_no"] = currVal;
																		//사은품이 있다면
																		if($("#giftInfo", scope_div).length > 0 ){ 
																			if($("#giftInfo",scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo");
																					itemParam[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																					itemParam[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
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
																					param["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																					param["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
																					$("#gift_slt", scope_div).data("itemInfo", param);
																					$("#dd_receive_choice").hide();
																				}
																			}else{	//사은품이 1개일 때,
																				$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
																				if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
																					param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
																					param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
																					param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).attr("data-value");
																					$(scope_div).data("itemInfo", param);
																					elandmall.optLayerEvt.getItemPrice({
																						param:param,
																						success:function(data){
																							data[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																							data[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
																							
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
																				elandmall.optLayerEvt.getItemPrice({
																					param:param,
																					success:function(data){
																						data[0]["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																						data[0]["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
																						$("#pkgCmpsGoods", scope_div).data("itemInfo", data);
																						elandmall.goodsDetail.drawAddGoods({
																							type:"PKG",
																							quickview_yn:quickview_yn,
																							data:data
																						});
																					}
																				});
																			}else{
																				param["disp_seq"] = $(selectedOpt).attr("data-disp_seq");
																				param["vend_nm"] = $(selectedOpt).attr("data-vend_nm");
																				$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
																			}
																			
																		}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																	}else{
																		if(last_yn == "Y" && currVal == ""){
																			if($("#gift_slt", scope_div).length > 0){
																				$("[id^=gift_slt]", scope_div).attr("data-value","");
																				$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																				$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
																				$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																				$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																				$("#gift_slt", scope_div).data("itemInfo", param);
																			}else{
																				$("#pkgCmpsGoods", scope_div).data("choice_yn", "N");
																			}
																		}else if(last_yn != "Y" && typeof(currVal) != "undefined"){
																			$("[id^=gift_slt]", scope_div).attr("data-value","");
																			$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
																			$("[id^=gift_slt]", scope_div).data("sel-msg","");
																			$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
																			$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
																			$("#gift_slt", scope_div).attr("data-itemInfo","");
																			$("#dd_receive_choice").hide();
																		}
																	}
																}
															}	
															if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
																$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
																.on('touchstart focusin', function() {
																	$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
																})
																.focusout(function() {
																	$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
																});
																$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
																	$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
																});
																
															}
														}
													});
													
												}
												
											});
											//[END] item select change event 
											
										}
									});
								}
								fnGoodsOptRefresh();
								elandmall.goodsDetail.sumMultiTotal(scope_div);
								
							}
						});
						
					}else{	//빈 값이 선택된다면 초기화를 한다.
						$("#pkgCmpsGoods").attr("data-choice_yn", "N");
						$("#pkgCmpsGoods").attr("data-itemInfo","");
					}
					
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
						$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						});
						
					}
				}
			},//[END] 묶음상품 구성 변경 이벤트
			checkPkgGoodsChoice:function(scope_div){
				var check_flag = true;
				if($("#pkgCmpsGoods", scope_div).attr("data-choice_yn") != "Y"){
					check_flag = false;
					return check_flag;
				}
				
				if($("#dd_receive_choice", scope_div).length > 0){
					if($("#dd_receive_choice").css("display") == "none"){
						$("#dd_receive_choice").show();
						check_flag = false;
						return check_flag;
					}else if($("#recev_slt", $("#dd_receive_choice",scope_div)).attr("data-choice_yn") != "Y"){
						check_flag = false;
						return check_flag;
					}else if($("#recev_slt", $("#dd_receive_choice",scope_div)).attr('data-value') == ""){
						check_flag = false;
						return check_flag;
					}
					
				}
				
				return check_flag;
				
			},
			checkDefGoodsChoice:function(scope_div){
				var check_flag = true;
				if($(scope_div).data("choice_yn") != "Y"){
					check_flag = false;
					return check_flag;
				}
				
				if($("#dd_receive_choice", scope_div).length > 0){
					if($("#dd_receive_choice").css("display") == "none"){
						$("#dd_receive_choice").show();
						check_flag = false;
						return check_flag;
					}else if($("#recev_slt", $("#dd_receive_choice",scope_div)).attr("data-choice_yn") != "Y"){
						check_flag = false;
						return check_flag;
					}else if($("#recev_slt", $("#dd_receive_choice",scope_div)).attr('data-value') == ""){
						check_flag = false;
						return check_flag;
					}
					
				}
				return check_flag;
				
			},
			//[START] 세트상품 구성품 변경
			changeSetGoods : function(obj){

				var cmps_grp_seq = $(obj).parent().parent('ul').attr("data-cmps_grp_seq");
				var selectedOpt = $(obj);
				var multi_yn = $(selectedOpt).attr("data-multi_item_yn");	//구성품의 단품유무여부
				var objVal= $(obj).attr('data-value');
				var div = $("dl[id^=setGrp"+cmps_grp_seq+"]");
				
				var scope_div = $("#goods_opt");
				
				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
				
				var $li = $(obj).parent();
				var $selBtn = $(obj).parent().parent().parent().siblings('.sel_btn');
				
				if(!$li.hasClass('sld_out')){
					if($(obj).data("layer_yn") == "Y"){
						$("#cmps_goods_grp"+cmps_grp_seq).attr('data-value',objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).parent().addClass("selected");
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#cmps_goods_grp"+cmps_grp_seq).text($(obj).children('.opt_name').text());
						//$("#cmps_goods_grp"+cmps_grp_seq).val($(obj).val());
					}else{
						$("#cmps_goods_grp"+cmps_grp_seq+"L").attr('data-value',objVal);
						$("#cmps_goods_grp"+cmps_grp_seq+"L").parent().addClass("selected");
						$("#cmps_goods_grp"+cmps_grp_seq+"L").attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#cmps_goods_grp"+cmps_grp_seq+"L").text($(obj).children('.opt_name').text());
						//$("#cmps_goods_grp"+cmps_grp_seq+"L").val($(obj).val());
					}
					$(div).children(":not([id^=li_cmps_goods_grp"+cmps_grp_seq+"])").remove();	//상품선택을 셀렉트를 제외한 나머지 삭제
					tglAc($(obj), 'show'); //NGCPO-5887 : 다른 옵션 가리기
					scrollReest($selBtn);
					
					fnGoodsOptRefresh();
					if(multi_yn != "Y"){ //구성품이 단품 없는 상품이라면, 
						
						//구성품 선택여부 변경 ==> 그룹 선택의 우선 순위가 없기 때문에..
						if(objVal != ""){
							$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "Y");
						}else{
							$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "N");
						}
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", $(selectedOpt).attr("data-vir_vend_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", $(selectedOpt).attr("data-item_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-value", $(selectedOpt).attr("data-item_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", $(selectedOpt).attr("data-set_cmps_item_no"));
						//$(obj).data("set_cmps_item_no", $(selectedOpt).data("set_cmps_item_no")); // <- 세트상품 구성단품번호
						
						if( $("#giftInfo").length > 0 ){
							if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
								if(elandmall.goodsDetail.checkSetGoodsChoice()){ 
									var param = elandmall.optLayerEvt.addSetGoodsParam();
									//마지막 옵션 선택 후, 사은품의 disabled 해제
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
									if(elandmall.goodsDetail.checkSetGoodsChoice()){
										var param = elandmall.optLayerEvt.addSetGoodsParam();
										if($('.gd_opt_scroll').length>0){
											elandmall.optLayerEvt.getSetGoodsPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														type:"SET",
														data:data,
														set_param:param,
														gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
														gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
														gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty"),
													});
													elandmall.goodsDetail.sumMultiTotal();
													
												}
											});
										}else{
											var currObj = $(obj);
											var goods_no = $(selectedOpt).attr("data-value");
											var vir_vend_no = $(selectedOpt).attr("data-vir_vend_no");
											var item_no = $(selectedOpt).attr("data-item_no");
											var set_cmps_item_no = $(selectedOpt).attr("data-set_cmps_item_no");
											$("#cmps_goods_grp"+cmps_grp_seq).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq, "goods_no":goods_no, "vir_vend_no":vir_vend_no,"item_no":item_no, "set_cmps_item_no":""+set_cmps_item_no});
										}
									}
								}
								
							}
						}else{	//[START]사은품이 없을 때
							if(elandmall.goodsDetail.checkSetGoodsChoice()){
								var param = elandmall.optLayerEvt.addSetGoodsParam();
								if($('.gd_opt_scroll').length>0){
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
								}else{
									var currObj = $(obj);
									var goods_no = $(selectedOpt).attr("data-value");
									var vir_vend_no = $(selectedOpt).attr("data-vir_vend_no");
									var item_no = $(selectedOpt).attr("data-item_no");
									var set_cmps_item_no = $(selectedOpt).attr("data-set_cmps_item_no");
									$("#cmps_goods_grp"+cmps_grp_seq).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq, "goods_no":goods_no, "vir_vend_no":vir_vend_no,"item_no":item_no, "set_cmps_item_no":""+set_cmps_item_no});
								}
							}
						}//[END]사은품이 없을 때
						
					}else{ //단품 있는 상품일 때,
						
						elandmall.optLayerEvt.drawItemSelect({obj:obj, type:"M"});
						fnGoodsOptRefresh();
						var goods_no = objVal;
						var vir_vend_no = $(selectedOpt).data("vir_vend_no");
						var reserv_yn = "N";
						if($("#reserv_limit_divi_cd").val()== "10" || $("#reserv_limit_divi_cd").val()== "20"){
							reserv_yn = "Y";
						}
						var set_goods_no = $("#goods_no").val();
						if($("#goods_no").val() == undefined || $("#goods_no").val() ==""){
							set_goods_no = $(selectedOpt).parents("#_optChoiceLayer").data("goods_info").goods_no;
						}
						
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", $(selectedOpt).attr("data-vir_vend_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", $(selectedOpt).attr("data-item_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-value", $(selectedOpt).attr("data-item_no"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", $(selectedOpt).attr("data-set_cmps_item_no"));
						if(multi_yn=="Y"){
							$("#cmps_goods_grp"+cmps_grp_seq).attr("data-multi_item_yn", multi_yn);
						}
						elandmall.optLayerEvt.ajaxItemList({
							param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no,reserv_yn: reserv_yn, cmps_grp_seq:cmps_grp_seq , event_layer_yn : event_layer_yn},
							success:function(data){
								var opt = div.find("[id^=options_nm1]");
								//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
								$selBtn =opt.parents('.lyr_select').children('.sel_btn');
								$.each(data, function() {
									var item_no = this.ITEM_NO;
									var opt_val_nm1 = this.OPT_VAL_NM1;
									var sale_poss_qty = this.SALE_POSS_QTY;
									var item_nm_add_info = this.ITEM_NM_ADD_INFO;
									var item_sale_price = this.ITEM_SALE_PRICE;
									var goods_sale_price = this.GOODS_SALE_PRICE;
									
									if(typeof(item_nm_add_info) == "undefined"){
										item_nm_add_info = "";
									}
									/* 20170207 false처리*/
									if (  item_sale_price > -1 && $("#option_low_vend_type_cd").val() != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
										if ( item_sale_price == 0 ){
											//item_sale_price = Number($("#base_sale_price").val());
											item_sale_price = elandmall.util.toCurrency(goods_sale_price);
										}
										item_sale_price = elandmall.util.toCurrency(item_sale_price);
									}else{
										item_sale_price = elandmall.util.toCurrency(goods_sale_price);
									}
									if(item_sale_price !="" && item_sale_price !="0"){
										item_sale_price = item_sale_price+"원";
									}
									
									//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
									if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
										item_sale_price="";
									}
									
									var optionObj = null;
									if(sale_poss_qty > 0){
										//optionObj = $("<li><span class='ancor' onclick='elandmall.goodsDetail.fnSelectSetItem({obj:this})'><span class='opt_name'>"+opt_val_nm1+"</span>"+
										optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
												"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
										).attr({ "data-value": item_no });
									}else{
										
										if(event_layer_yn == "Y"){
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
									optionObj.attr("data-item_show_nm",opt_val_nm1);
									opt.append(
											optionObj
									);
								});
								
								//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
								//div.find("[id^=item_opt_nm]").change(function(){
								div.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
									var currObj = $(this);
									var opt_idx = $(this).parent().parent('.options').data('index');
									var $li = $(this).parent();
									//var $hideTg = []; // hide & show Target   //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
									var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
									if(!$li.hasClass('sld_out')){
										//$hideTg[0] = $(this).parent().parent().parent().parent().parent().siblings('dd');
										//$hideTg[1] = $(this).parent().parent().parent().parent().parent().parent().siblings('dl, .set');
										$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
										$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
										$('.lyr_select').removeClass('on');
										$li.addClass('selected').siblings('li').removeClass('selected');
										tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
										toggleBt('show');
										scrollReest($selBtn);
										
										showText($selBtn);
										
										//$($hideTg).each(function(){$(this).show()});
										
										elandmall.optLayerEvt.changeItem({
											param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no, reserv_yn: reserv_yn, cmps_grp_seq:cmps_grp_seq},
											div:div,
											chgObj:currObj,
											callback:function(result){
												if(currObj == undefined){
													currObj = $(this);
												}
												var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-last');
												//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
												var currVal = currObj.parent().attr("data-value");
												
												if(last_yn== "Y" && currVal != ""){
													if($(obj).attr("data-value") != ""){
														$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "Y");
													}else{
														$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "N");
													}
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", $(selectedOpt).attr("data-value"));
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", $(selectedOpt).attr("data-vir_vend_no"));
													$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", currVal);
													//$("#cmps_goods_grp"+cmps_grp_seq).data("set_cmps_item_no", $(currObj).children("option:selected").data("set_cmps_item_no")); // <- 세트상품 구성단품번호
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
															if($('.gd_opt_scroll').length>0){
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
															}else{
																var goods_no = $(selectedOpt).attr("data-value");
																var vir_vend_no = $(selectedOpt).attr("data-vir_vend_no");
																var item_no = currObj.parent().attr("data-value");
																var set_cmps_item_no = currObj.parent().attr("data-set_cmps_item_no");
																$("#cmps_goods_grp"+cmps_grp_seq).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq, "goods_no":goods_no, "vir_vend_no":vir_vend_no,"item_no":item_no, "set_cmps_item_no":""+set_cmps_item_no});
															}
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
							}
						});
						
					}
					
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
						$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						});
						
					}
				}
				
				
			},//[END] 세트상품 구성품 변경
			
			//[START] 세트상품 선택 체크
			checkSetGoodsChoice : function(){
				var changeFlag = true;
				$("[id^=cmps_goods_grp]", "#goods_opt").each(function(){
					if($(this).attr("data-choice_yn") == "N"){
						changeFlag = false;
						return;
					}
				});
				return changeFlag;
			},//[END] 세트상품 선택 체크
			//[START] 장바구니 상품 담기 파라미터 세팅
			setParam : function(p){
				var quickview_yn = p.quickview_yn;
				var scope_div = null;
				var cart_divi_cd = p.cart_divi_cd;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
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
						}
						
						var brand_nm = $("#brand_nm", this).val();
						
						if(brand_nm == null || brand_nm == ''){
							brand_nm = 'U';
						}
						
						var coupon = $("#goods_cpn_nm").val();
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
								cart_grp_cd: $("#cart_grp_cd", this).val(),
								sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
								sale_shop_no: $("#sale_shop_no", scope_div).val(),
								sale_area_no: $("#sale_area_no", scope_div).val(),
								conts_dist_no: $("#conts_dist_no", scope_div).val(),
								nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
								nplus_cnt: $("#nplus_cnt", scope_div).val(),
								sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
								stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
								//goods_no: $("#goods_no", scope_div).val(),
								sale_price: $("#sale_price",this).val(),
								item_no: $("#item_no",this).val(),
								vir_vend_no: $("#vir_vend_no",this).val(),
								shopcode: $("[name=shopCode]",this).val(), //주얼리 매장픽업코드
								ord_qty: $("#ord_qty",this).val(),
								item_nm: cart_item_nm.replaceAll(",","/")				
						};
						
						if(cart_divi_cd == "20"){		//비회원 주문 가능
							cart["nomember"] = true;
						}
						
						//[END] 옵션별 사은품 파라미터 셋팅
						if($("#goods_type_cd", scope_div).val() == "80"){
							cart["goods_no"] = $("#goods_no", this).val();
							cart["goods_nm"] = $("#goods_nm", this).val();
							cart["set_goods_no"] = $("#goods_no", scope_div).val();
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
							cart["goods_no"] = $("#goods_no", scope_div).val();
							cart["goods_nm"] = $("#goods_nm", scope_div).val();
						}

						p.arrCart.push(cart);
					});
					
				}else{
					if($("#goods_cmps_divi_cd", scope_div).val() == "20"){ // 세트상품일 때, 
						$("#choiceItemBox>li", scope_div).each(function(idx){
							var giftGoodsInfo = "";
							giftGoodsInfo = $("[name=gift_goods_dtl_no]",$(this)).val();
							
							var brand_nm = $("#brand_nm", $(this)).val();
							if(brand_nm == null || brand_nm == ''){
								brand_nm = 'U';
							}
							
							var coupon = $("#goods_cpn_nm").val();
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
									cart_grp_cd: $("#cart_grp_cd", scope_div).val(),
									sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
									sale_shop_no: $("#sale_shop_no", scope_div).val(),
									sale_area_no: $("#sale_area_no", scope_div).val(),
									conts_dist_no: $("#conts_dist_no", scope_div).val(),
									nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
									nplus_cnt: $("#nplus_cnt", scope_div).val(),
									sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
									stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
									sale_price: $("#sale_price", $(this)).val(),
									item_no: $("#item_no", scope_div).val(),
									vir_vend_no: $("#vir_vend_no", scope_div).val(),
									ord_qty: $("#ord_qty", $(this)).val(),
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
								var v_cust_item_key = $(this).attr("class");
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
								}
								
								var brand_nm = $("#brand_nm", this).val();
								
								if(brand_nm == null || brand_nm == ''){
									brand_nm = 'U';
								}
								
								var coupon = $("#goods_cpn_nm").val();
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
										cart_grp_cd: $("#cart_grp_cd", this).val(),
										sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
										sale_shop_no: $("#sale_shop_no", scope_div).val(),
										sale_area_no: $("#sale_area_no", scope_div).val(),
										conts_dist_no: $("#conts_dist_no", scope_div).val(),
										nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
										nplus_cnt: $("#nplus_cnt", scope_div).val(),
										sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
										stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
										//goods_no: $("#goods_no", scope_div).val(),
										sale_price: $("#sale_price",this).val(),
										item_no: $("#item_no",this).val(),
										vir_vend_no: $("#vir_vend_no",this).val(),
										ord_qty: $("#ord_qty",this).val(),
										item_nm: cart_item_nm.replaceAll(",","/"),
										
										//[ECJW-9] 옵션 불러오기 I/F
										cust_prod_yn: cust_prod_yn,
										cust_item_key : v_cust_item_key,
								        cust_item_nm: $("#cust_item_nm", this).val(),
								        cust_item_no: $("#cust_item_no", this).val(),
								        shopcode: $("#shopCode", this).val(),     //픽업매장코드
								        goods_opt_data: $("#goods_opt_data", this).val(),
								        in_carve_nm : $("#in_carve_nm", this).val(),
								        out_carve_nm : $("#out_carve_nm", this).val(),
								        carve_code  : $("#carve_code", this).val()
								};
								
								if(cart_divi_cd == "20"){		//비회원 주문 가능
									cart["nomember"] = true;
								}
								
								//[END] 옵션별 사은품 파라미터 셋팅
								if($("#goods_type_cd", scope_div).val() == "80"){
									cart["goods_no"] = $("#goods_no", this).val();
									cart["goods_nm"] = $("#goods_nm", this).val();
									cart["set_goods_no"] = $("#goods_no", scope_div).val();
								}else{
									cart["goods_no"] = $("#goods_no", scope_div).val();
									cart["goods_nm"] = $("#goods_nm", scope_div).val();
								}

								p.arrCart.push(cart);
							});
							
							
						}else{
							
							var giftGoodsInfo = "";
							if($("#giftInfo").data("multi_yn") == "Y"){
								giftGoodsInfo = $("#gift_slt").val();
							}else{
								giftGoodsInfo = $("[name=gift_goods_dtl_no]",$("#giftInfo",scope_div)).val();
							}
							
							var brand_nm = $("#goods_brand_name", scope_div).data("brand_nm");
							
							if(brand_nm == null || brand_nm == ''){
								brand_nm = 'U';
							}
							
							var coupon = $("#goods_cpn_nm").val();
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
									goods_no: $("#goods_no", scope_div).val(),
									goods_nm: $("#goods_nm", scope_div).val(),
									brand_nm: brand_nm,
									coupon: coupon,
									category_nm : $('#ga_category_nm').val(),	
									
									goods_no: $("#goods_no", scope_div).val(),
									goods_nm: $("#goods_nm", scope_div).val(),
									brand_nm: $("#goods_brand_name").data("brand_nm"),
									add_ord_sel_info: $("#add_ord_sel_info", scope_div).val(),
									gift_goods_info: giftGoodsInfo,
									goods_cmps_divi_cd: $("#goods_cmps_divi_cd", scope_div).val(),
									multi_item_yn: $("#multi_item_yn", scope_div).val(),
									multi_price_yn: $("#multi_price_yn", scope_div).val(),
									cart_grp_cd: $("#cart_grp_cd", scope_div).val(),
									sale_shop_divi_cd: $("#sale_shop_divi_cd", scope_div).val(),
									sale_shop_no: $("#sale_shop_no", scope_div).val(),
									sale_area_no: $("#sale_area_no", scope_div).val(),
									conts_dist_no: $("#conts_dist_no", scope_div).val(),
									nplus_base_cnt: $("#nplus_base_cnt", scope_div).val(),
									nplus_cnt: $("#nplus_cnt", scope_div).val(),
									sale_unit_qty: $("#sale_unit_qty", scope_div).val(),
									stock_qty_disp_yn: $("#stock_qty_disp_yn", scope_div).val(),
									sale_price: $("#sale_price", scope_div).val(),
									item_no: $("#item_no", scope_div).val(),
									vir_vend_no: $("#vir_vend_no", scope_div).val(),
									ord_qty: $("#ord_qty", scope_div).val(),
									item_nm: cart_item_nm.replaceAll(",","/")
							};
							
							if(cart_divi_cd == "20"){		//비회원 주문 가능
								cart["nomember"] = true;
							}
							
							p.arrCart.push(cart);
							
						}
						
					
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
					scope_div = $("#goods_opt");
				}
				
				if($("#multi_item_yn", scope_div).val() == "Y" || $("#goods_cmps_divi_cd", scope_div).val() == "20" || $("#goods_type_cd", scope_div).val() == "80"){
					if($("#choiceItemBox",scope_div).children().length == 0){
						alert("상품을 선택해 주세요.");
						return false;
					}
				}else{
					if($("#gift_slt", scope_div).length > 0){
						if($("#gift_slt", scope_div).attr("data-value") == ""){
							alert("사은품을 선택해 주세요.");
							return false;
						}
					}
					
					var lowVendTypeCd = typeof($("#option_low_vend_type_cd").val()) != "undefined" ? $("#option_low_vend_type_cd").val() : "";  
					if(!(lowVendTypeCd == "" || lowVendTypeCd == "50") ){
						if($("#multi_item_yn", scope_div).val() == "N" && $("#dd_receive_choice").length > 0 ){
	                    	if(typeof($("input[name=sel_dlv]:checked", scope_div).val()) ==  "undefined"){
	                    	    alert("수령방법을 선택해 주세요.");
	                    	    return false;
	                    	}else{
	                    		$("#cart_grp_cd", scope_div).val($("input[name=sel_dlv]:checked", scope_div).attr('data-value'));
	                    	}
	                    }
					}
					
				}
				
				//묶음 상품이 아닌 상품에 대해 총 담은 상품 수량 체크
				if($("#goods_type_cd", scope_div).val() != "80"){
					var choice_ord_qty = 0;
					var max_qty = +$("#ord_poss_max_qty",scope_div).val();
					$("input[name='ord_qty']",scope_div).each(function(){
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
						gift_stock_qty = +$("#gift_slt", $("#giftInfo", scope_div)).children('option:selected').data('stock_qty');
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

			
			//쥬얼리 가격조회 전 파라미터 담기 
			jwGoodsAddParam : function(pin){
				
				var obj = pin.param.obj;
				var type = "";
				if($("#goods_type_cd").val() == "80"){
					type = "PKG";
				}else{
					type = "DEF";
				}
				
				var field_rece_poss_yn = $("#goods_opt").find('.lyr_select').find('.selected').children('.sel_txt').attr('data-field_recev_poss_yn');
				var present_yn = $("#goods_opt").find('.lyr_select').find('.selected').children('.sel_txt').attr('data-present_yn');
				
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")? pin.quickview_yn:"N";
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
				}
				
				
				
				var carve_code = "";
				
				if(pin.param.carve_code == "" || typeof(pin.param.carve_code) == "undefined" ){
					carve_code = $(obj).parents('.add_selects').children('li[id="li_id_carve"]').find('.selected').children('.sel_txt').attr('data-code');
				}else{
					carve_code = pin.param.carve_code;
				}
				 
				
				var opt_cd = "";
				var code = "";
				var total_optCd = pin.param.goods_no;
				var total_optNm = "";
				var goods_nm = "";
				
				//[ECJW-9] 옵션 불러오기 I/F 
				if(type == "PKG"){
					
					set_brandCode = pin.param.brandCode;
					set_styleCode = pin.param.styleCode;
					goods_nm = $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg');
					var jsonData ={};
					for(var i=0; i < $("#goods_opt").find('dd[name=jw_opt_select]').length; i++){
						var count = Number(i+1);
						if(typeof($("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).attr('data-sel-cd')) != "undefined"){
							
							opt_cd = $("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).attr('data-opt_cd');	
							code = $("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).attr('data-sel-cd');	
							
							
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
											total_optNm =  $("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
										}else{
											total_optNm += "/" +  $("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
										}
									}
								}
								
							}else{
								
								jsonData[opt_cd]=code;
								total_optCd += opt_cd+code;
								
								if(total_optNm == ""){
									total_optNm =  $("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
								}else{
									total_optNm += "/" +  $("#goods_opt").find('dd[name=jw_opt_select]').eq(i).find(("#item_opt_nm"+count)).text();
								}
							}
						}
					}
					
				}else{
					
					var jsonData ={};
					for(var i=0; i < $("#goods_opt").find('.lyr_select').length; i++){
						var count = Number(i+1);
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
				
				if(carve_code != "" && carve_code != "undefined" && typeof(carve_code) != "undefined" ){
					total_optCd+= carve_code; 
					
					var asciiText = "";
					if(carve_code == "ISOS"){
						asciiText = fnCharToAscii($('#in_carve').val());
						total_optCd+= asciiText;
						asciiText = fnCharToAscii($('#out_carve').val());
						total_optCd+= asciiText;
					}else if(carve_code == "OSIS"){
						asciiText = fnCharToAscii($('#out_carve').val());
						total_optCd+= asciiText;
						asciiText = fnCharToAscii($('#in_carve').val());
						total_optCd+= asciiText;
					}else if(carve_code == "IS"){
						asciiText = fnCharToAscii($('#in_carve').val());
						total_optCd+= asciiText;
					}else if(carve_code == "OS"){
						asciiText = fnCharToAscii($('#out_carve').val());
						total_optCd+= asciiText;
					}
				}
				
				// 수령여부가 존재 한다면 수령에대한 정보도 classkey로 생성한다.
				if($("#recev_slt", scope_div).attr('data-value') != ""){
					
//					if($("#recev_slt", scope_div).attr('data-value') != "40"){
//						total_optCd += $("#recev_slt", scope_div).attr('data-value'); 
//					}
					$("#cart_grp_cd", scope_div).val($("#recev_slt", this).attr('data-value'));
				}
				
				total_optCd = total_optCd.replace(/\./gi,'');
				
				
				
					
					// 첫번재 Row에 선물하기가 있는지 체크한다.
					if(typeof($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val()) != "undefined" 
						&& $("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "50"){
						
						if($("#recev_slt", scope_div).attr('data-value') != "50"){
							if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
								$("#choiceItemBox", scope_div).find('li').remove();
								elandmall.util.ga(pin.category, pin.action, pin.label);
						        elandmall.goodsDetail.visibleTotalAmt();
						        elandmall.goodsDetail.sumMultiTotalJw();
							}else{
								$("#dd_receive_choice").children('.lyr_select').removeClass('on');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').removeClass('selected');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').text('수령방법을 선택하세요.');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
								commonUI.dimRemove();
								return false;
							}
						}
						
					}else if(typeof($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val()) != "undefined"   
						&& $("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "50"){
						
						if($("#recev_slt", scope_div).attr('data-value') == "50"){
							if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
								$("#choiceItemBox", scope_div).find('li').remove();
								elandmall.util.ga(pin.category, pin.action, pin.label);
						        elandmall.goodsDetail.visibleTotalAmt();
						        elandmall.goodsDetail.sumMultiTotalJw();
							}else{
								$("#dd_receive_choice").children('.lyr_select').removeClass('on');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').removeClass('selected');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').text('수령방법을 선택하세요.');
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
								$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
								commonUI.dimRemove();
								return false;
							}
						}
					}
				
				
				
				if(field_rece_poss_yn == "Y" || present_yn == "Y"){
					
					var dupChk = false;
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var choice_classkey = $("#choiceItemBox").children('li').eq(i).attr('class');
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						
						if(cart_grp_cd != "40"){
							if(choice_classkey == "L"+total_optCd && cart_grp_cd == $("#recev_slt", scope_div).attr('data-value') ){
								dupChk=true;
								break;
							}
						}
							
					}
					
					
					if(!dupChk){
						//기존 동일시 삭제
						$(".L"+total_optCd,"#choiceItemBox").remove();
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

				
			var	param = $.extend({ classkey		: total_optCd
									, total_optCd		: total_optCd
									, total_optNm		: total_optNm
									, carve_code 		: carve_code
									, goods_nm			: goods_nm
									, goods_opt_data	: JSON.stringify(opt_select) }, pin.param || {});
				
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
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")? pin.quickview_yn:"N";
				var shopCode = (typeof(pin.shopCode) != "undefined")? pin.shopCode:"";
				var classkey = "";
				var scope_div = null;
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
				}
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
						scope_div.find('dd[name="dd_input_carve"]').remove();
						$("#in_carve").val("");
						$("#out_carve").val("");
					}
					
					$("#dd_receive_choice").hide();
					$("input[name=field_rec]:checked", scope_div).prop('checked', false);
					commonUI.dimRemove();
					return;
				}
				
				classkey = (repData.classkey != null) ? repData.classkey.replace(/\./gi,''):"";
				
				//중복시 수량 늘리기
				if($(".L"+classkey, $("#detailform", scope_div)).length > 0){
					$(".L"+classkey, $("#detailform", scope_div)).find('.plus').click();
					
				}else{
					
					var p = {};
					p.goods_no       = repData.GOODS_NO;
					p.vir_vend_no   = repData.VIR_VEND_NO;
					p.goods_type_cd = repData.GOODS_TYPE_CD;
					p.item_no       = repData.ITEM_NO; 
					p.min_qty = "1";
					p.classkey = classkey;
					p.quickview_yn = quickview_yn;
					
					
					var pinStr = JSON.stringify(p).replace(/\"/gi, "'");
					var pinInputStr = pinStr != "" ? pinStr.substring(0, pinStr.length-1) : "";
					
					html += "<li  class=\"L" + classkey +"\">";
					html +=	"	<div class=\"opt\">"; //+data.ITEM_NM;
					
					var label_nm = "";
					if($("#recev_slt", scope_div).attr('data-value') != "" && typeof($("#recev_slt", scope_div).attr('data-value')) != "undefined" 
						&&  $("#recev_slt", scope_div).attr('data-value') != "40"){
						
						label_nm = "[" + $("#recev_slt", scope_div).attr('data-sel-msg') + "]" ; 
					}
					
					
					var carve_tmp_nm = "";
					if(carve_code == "ISOS"){
						carve_tmp_nm = "/속:"+ $('#in_carve').val() +"/겉:"+ $('#out_carve').val();
					}else if(carve_code == "OSIS"){
						carve_tmp_nm = "/겉:"+ $('#out_carve').val() + "/속:"+ $('#in_carve').val();
					}else if(carve_code == "IS"){
						carve_tmp_nm = "/속:"+ $('#in_carve').val();
					}else if(carve_code == "OS"){
						carve_tmp_nm = "/겉:"+ $('#out_carve').val();
					}
				    
					var cust_nm = "";
					if(type == "PKG"){
						html += label_nm + $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg') +" "+ repData.total_optNm + carve_tmp_nm;
						cust_nm = label_nm + $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg') +" "+ repData.total_optNm + carve_tmp_nm;
					}else if(type == "SET"){
					}else{
						html += label_nm +  repData.total_optNm + carve_tmp_nm;
						cust_nm = label_nm +  repData.total_optNm + carve_tmp_nm; 
					}
					
					
					var gift_goods_dtl_no = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",scope_div))).attr("data-value");
					var gift_nm = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",scope_div))).data("gift_nm");
					var gift_stock_qty = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",scope_div))).data("stock_qty");
					
					if(typeof(gift_goods_dtl_no) != "undefined"){
						html +=	"<br/>사은품 : "+gift_nm;
					}
					
					
					html += "</div>"
					html += "	<input type=\"hidden\" name=\"sale_price\" id=\"sale_price\" value=\""+data.Price+"\" class=\"input\"/>"; 
					html +=	"	<div class=\"qty\">";
					html +=	"			<input type=\"text\" name=\"ord_qty\" id=\"ord_qty\" onblur=\"elandmall.goodsDetail.checkKeyPressQtyJw("+pinInputStr+", obj:this});\" title=\"수량\" value=\""+p.min_qty+"\" />";
					html +=	"			<button type=\"button\" class=\"minus\" data-ga-tag=\"MW_상품상세||상품수량변경||-\" onclick=\"elandmall.goodsDetail.setMinusJw("+pinStr+");\" ><em class=\"ir\">수량감소</em></button>";
					html +=	"			<button type=\"button\" class=\"plus\"  data-ga-tag=\"MW_상품상세||상품수량변경||+\" onclick=\"elandmall.goodsDetail.setPlusJw("+pinStr+");\" ><em class=\"ir\">수량증가</em></button>";
					html +=	"	</div>";
					html +=	"	<div class=\"prc\"><b class=\"itemPrc\">"+elandmall.util.toCurrency(data.Price*p.min_qty)+"</b>원</div>";
					html +=	"	<button type=\"button\" class=\"del\" onclick=\"elandmall.goodsDetail.removeItem("+pinStr+")\"><em class=\"ir\">옵션 삭제</em></button>";
					html += "</li>";
					$("#choiceItemBox", scope_div).prepend(html);
					$('.gd_opt_scroll').find('.gd_opt').css('transform','');
					fnGoodsOptRefresh();
					var form = $(".L" + classkey, scope_div);
					var hidden = null;
					if(type == "DEF"|| type == "PKG"){
						if(type == "PKG"){
							hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").attr("id","goods_no").val(repData.GOODS_NO);
							hidden.appendTo(form);
						}else{
							if($(":input[name=item_no]", "#detailform").size() >= 1) {
								hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").attr("id","goods_no").val(repData.GOODS_NO);
								hidden.appendTo(form);
				
							}
						}
						hidden = $("<input />").attr("type", "hidden").attr("name", "vir_vend_no").attr("id","vir_vend_no").val(repData.VIR_VEND_NO);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "item_no").attr("id","item_no").val(repData.ITEM_NO);
						hidden.appendTo(form);
					}
				
					hidden = $("<input />").attr("type", "hidden").attr("name", "goods_nm").attr("id","goods_nm").val(repData.GOODS_NM);
					hidden.appendTo(form);
					hidden = $("<input />").attr("type", "hidden").attr("name", "item_nm").attr("id","item_nm").val(repData.total_optNm + carve_tmp_nm);
					hidden.appendTo(form);
					hidden = $("<input />").attr("type", "hidden").attr("name", "brand_nm").attr("id","brand_nm").val(repData.BRAND_NM);
					hidden.appendTo(form);
					
					if ( gift_goods_dtl_no ){
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_goods_dtl_no").attr("id","gift_goods_dtl_no").val(gift_goods_dtl_no);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_stock_qty").attr("id","gift_stock_qty").val(gift_stock_qty);
						hidden.appendTo(form);
					}
					
					hidden = $("<input />").attr("type", "hidden").attr("name", "cart_grp_cd").attr("id","cart_grp_cd").val($("#recev_slt", scope_div).attr('data-value'));
					hidden.appendTo(form);
					
					hidden = $("<input />").attr("type", "hidden").attr("name", "cust_item_no").attr("id","cust_item_no").val(data.ProdCode);
					hidden.appendTo(form);
					
					hidden = $("<input />").attr("type", "hidden").attr("name", "cust_item_nm").attr("id","cust_item_nm").val(cust_nm);
					hidden.appendTo(form);
					
					hidden = $("<input />").attr("type", "hidden").attr("name", "goods_opt_data").attr("id","goods_opt_data").val(repData.goods_opt_data);
					hidden.appendTo(form);
					
						
					if(carve_code != ""){
						
						hidden = $("<input />").attr("type", "hidden").attr("name", "carve_code").attr("id","carve_code").val(carve_code);
						hidden.appendTo(form);
						
						
						if(carve_code == "ISOS" || carve_code == "OSOS"){
							
							hidden = $("<input />").attr("type", "hidden").attr("name", "in_carve_nm").attr("id","in_carve_nm").val($("#in_carve", scope_div).val());
							hidden.appendTo(form);
							hidden = $("<input />").attr("type", "hidden").attr("name", "out_carve_nm").attr("id","out_carve_nm").val($("#out_carve", scope_div).val());
							hidden.appendTo(form);
						}else if(carve_code == "IS"){
							hidden = $("<input />").attr("type", "hidden").attr("name", "in_carve_nm").attr("id","in_carve_nm").val($("#in_carve", scope_div).val());
							hidden.appendTo(form);
						}else if(carve_code == "OS"){
							hidden = $("<input />").attr("type", "hidden").attr("name", "out_carve_nm").attr("id","out_carve_nm").val($("#out_carve", scope_div).val());
							hidden.appendTo(form);
						}
					}
						$("#sale_price").val(data.Price);
				}
				
				
				
				if($("#recev_slt", scope_div).attr('data-value') != "" && $("#recev_slt", scope_div).attr('data-value') == "40"){
					
					var p = $.extend({ cust_prod_yn: "Y", classkey : classkey, data : opt_select_info, brandCode: data.BrandCode, styleCode: data.StyleCode, productCode: data.ProdCode}, p || {});
					elandmall.popup.storeReceiptLayer(p);
					
					
					//바로구매 버튼 활성 2
					var present_chk = false;
					
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#btn_grp").find('.cart').remove();
						$("#btn_grp").find('.buy').attr('class', 'btn');
					}else{
						if(scope_div.find("#event_layer_yn").val() != "Y" && $("#btn_grp").find('.cart').length < 1 ){
							$("#btn_grp").find('.btn').attr('class', 'buy');
							$("#btn_grp").find('.buy').before('<button type="button" class="cart" id="cartBtn" data-ga-tag="MW_상품상세||구매버튼||장바구니" onclick="elandmall.goodsDetail.clickCartOrd({cart_divi_cd:\'10\'});" disabled="disabled">장바구니</button>');	
						}
					}
					
				}else{
					
					if(carve_code != ""){
						scope_div.find('dd[name="dd_input_carve"]').remove();
						$("#in_carve").val("");
						$("#out_carve").val("");
					}
					
					//바로구매 버튼 활성 3
					var present_chk = false;
					
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#btn_grp").find('.cart').remove();
						$("#btn_grp").find('.buy').attr('class', 'btn');
					}else{
						if(scope_div.find("#event_layer_yn").val() != "Y" && $("#btn_grp").find('.cart').length < 1 ){ //이벤트 상품 레이어가 아닐때
							$("#btn_grp").find('.btn').attr('class', 'buy');
							$("#btn_grp").find('.buy').before('<button type="button" class="cart" id="cartBtn" data-ga-tag="MW_상품상세||구매버튼||장바구니" onclick="elandmall.goodsDetail.clickCartOrd({cart_divi_cd:\'10\'});" disabled="disabled">장바구니</button>');	
						}
					}
					
					
					$("#dd_receive_choice").hide();
					
					elandmall.goodsDetail.visibleTotalAmt();
					elandmall.goodsDetail.sumMultiTotalJw();
					elandmall.goodsDetail.initSelectsBoxJw(scope_div);
					fnGoodsOptRefresh();
					elandmall.goodsDetail.setOrdBtnDisabled();
				}
				
				
				
				
				
				
				
				
			
			},//[END] 추가 상품(단품) 그리기
			
			
			fnCallbackResultStore : function(p){
				
				var scope_div = null;
				if(p.quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
				}
				
				var type = "";
				if($("#goods_type_cd").val() == "80"){
					type = "PKG";
				}else{
					type = "DEF";
				}
				
				var form = $(".L" + p.classkey, scope_div);
				var hidden = null;
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopCode").attr("id","shopCode").val(p.shopCode);
				hidden.appendTo(form);
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopName").attr("id","shopName").val(p.shopName);
				hidden.appendTo(form);
				
				form.find('.opt').text("");
				form.find('.opt').text("[매장수령]"+"["+p.shopName+"]"+form.find("[name=cust_item_nm]").val());
				form.find('input[name=cust_item_nm]').val("[매장수령]"+"["+p.shopName+"]"+form.find("[name=cust_item_nm]").val());
				scope_div.find('dd[name="dd_input_carve"]').remove();
				scope_div.find('input[name="in_carve"]').val("");
				scope_div.find('input[name="out_carve"]').val("");
				
//				$(".L" + p.classkey, scope_div).attr('class', ".L" + p.classkey + "40" + p.shopCode);
//		        for(var i=0; i<opt_select_info.length; i++){
//		        	var tmp_obj = opt_select_info[i];
//		        	if(tmp_obj.classkey == p.classkey ){
//		        		opt_select_info[i].classkey = ".L" + p.classkey + "40" + p.shopCode;
//		        		break;
//		        	}
//		        }
				
				if(type == "PKG"){
				}else{
					$("#dd_receive_choice").hide();
				}
				
				elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotalJw();
				elandmall.goodsDetail.initSelectsBoxJw(scope_div);
				fnGoodsOptRefresh();
				elandmall.goodsDetail.setOrdBtnDisabled();
				commonUI.dimRemove();
			},
			
			fnCallbackCloseStore : function(p){
				
				opt_select_info = new Array(); // 초기화
		        
				if(p.result_data[0] != null){
					opt_select_info = p.result_data;
				}
				
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').removeClass('selected');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').text('수령방법을 선택하세요.');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
				
				elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotalJw();
				fnGoodsOptRefresh();
				elandmall.goodsDetail.setOrdBtnDisabled();
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
				var type = (typeof(pin.type) != "undefined")? pin.type:"DEF";
				var quickview_yn = (typeof(pin.quickview_yn) != "undefined")? pin.quickview_yn:"N";
				var jwNormal_yn = (typeof(data.jwNormal_yn) != "undefined")? data.jwNormal_yn:"N";
				var classkey = "";
				var scope_div = null;
				var imme_purch_yn = (typeof(pin.imme_purch_yn) != "undefined")? pin.imme_purch_yn:"N";
				
				if(quickview_yn == "Y"){
					scope_div = $("#quick_view_layer");
				}else{
					scope_div = $("#goods_opt");
				}
				
				var solodeliway_yn = "";
				var physical_center_no = "";
				if(type == "PKG" && $("#item_opt_li_data", scope_div).length > 0 ){
					solodeliway_yn = $("#item_opt_li_data", scope_div).attr('data-cmpssolodeliway_yn');
					physical_center_no = $("#item_opt_li_data", scope_div).attr('data-physical_center_no');
					$("#physical_center_no", $("#detailform", scope_div)).val(physical_center_no);
					
				}else if(type == "PKG"){
					solodeliway_yn = $("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).attr('data-cmpssolodeliway_yn');
					physical_center_no = $("#pkgCmpsGoodsInfo",$("#detailform", scope_div)).attr('data-physical_center_no');
					$("#physical_center_no", $("#detailform", scope_div)).val(physical_center_no);
				}else if($("#soloDeliWay_yn", $("#detailform", scope_div)).val() == "Y"){
					solodeliway_yn = $("#soloDeliWay_yn", $("#detailform", scope_div)).val();
				}
				
				if(type == "SET"){
					
					solodeliway_yn =  $("#soloDeliWay_yn", $("#detailform", scope_div)).val(); //수령방법이 오늘직송 하나만 선택된 경우
					
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
			    	
		    		elandmall.goodsDetail.resetGift(scope_div);
			    	
			    	addCheck = true ;
			    	commonUI.dimRemove();
			    	return false;
			    }

			    // 주문서가 다른 수령방법은 같이 주문할 수 없으므로 체크한다.
			    if($("#choiceItemBox").find('li').length > 0){
			    	var param = $.extend({div:scope_div, solodeliway_yn:solodeliway_yn}, pin || {});
			    	if(!elandmall.goodsDetail.fnReceiveChoiceValid(param)){
			    		return false;
			    	}
			    }
			    
			    if($(".L"+classkey, $("#detailform", scope_div)).length > 0){
			    	   if($("#recev_slt", $("#detailform",scope_div)).attr('data-value') != $("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() && jwNormal_yn == "Y"){
			    	 	 alert("동일한 옵션으로 여러 수령 방식의 주문은 불가 합니다.");  
					   } else {
						 alert("이미 추가된 옵션입니다. 수량 조절은 아래 선택사항에서 해주십시오.");
						 if($("#recev_slt", scope_div).length > 0){
							if($("#recev_slt", scope_div).children().attr('type') == "radio"){
								$("input[name=sel_dlv]:checked", scope_div).prop('checked', false);
								$("#recev_slt", scope_div).attr('data-value', "");
								$("#recev_slt", scope_div).attr("data-choice_yn","N");
							}
						 }
						 
					   }
				       $("#pkgCmpsGoods", scope_div).attr("data-choice_yn","N");
			    		elandmall.goodsDetail.resetGift(scope_div);
				       
				       addCheck = true ;
				       if(jwNormal_yn == "Y"){
				    	   $("#dd_receive_choice").children('.lyr_select').removeClass('on');
				    	   $("#dd_receive_choice").children('.lyr_select').children('.sel_btn').removeClass('selected');
				    	   $("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
				    	   $("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').text('수령방법을 선택하세요.');
				    	   $("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
				    	   $("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
				    	   toggleBt('show');
				    	   scrollReest();
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
					p.nplus_base_cnt = repData.NPLUS_BASE_CNT;
					p.nplus_cnt = repData.NPLUS_CNT;
					p.sale_unit_qty = repData.SALE_UNIT_QTY;
					p.classkey = classkey;
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
					
					if($("#recev_slt", $("#detailform",scope_div)).length > 0){
						cart_grp_cd = $("#recev_slt", $("#detailform",scope_div)).attr("data-value");
						$("[name=cmps_cart_grp_cd]", $("#detailform")).val(cart_grp_cd);
					}else if($("#soloDeliWay_yn", $("#detailform",scope_div)).val() == "Y" || solodeliway_yn == "Y"){ //오늘직송 하나만들어왔을 경우
						cart_grp_cd = "70";
						$("[name=cmps_cart_grp_cd]", $("#detailform")).val("70");
					}
					//세트상품일때,
					if(type == "SET"){
						$("[id^=cmps_goods_grp]",$("#detailform", scope_div)).each(function(idx,obj){
							var selectedOpt = $(this);
							var cmps_grp_seq = $(obj).attr("data-cmps_grp_seq");
							var grp_nm = $("#setGrp"+cmps_grp_seq+"_title").text();
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
							if($("#recev_slt", $("#detailform",scope_div)).length > 0){
								cart_grp_cd = $("#recev_slt", $("#detailform",scope_div)).attr("data-value");
								if( typeof(repData.vend_nm) != "undefined" && repData.vend_nm != ""){
									cmps_goods_nm += "["+repData.vend_nm+"]";
								}
								if( cart_grp_cd == "40" ){
									cmps_goods_nm += "[매장수령]";
								}else if( cart_grp_cd == "50" ){
									cmps_goods_nm += "[선물하기]";
								}else{
									cmps_goods_nm += "[택배배송]";
								}
							}
							
							if(typeof(repData.disp_seq) != "undefined"){
								cmps_goods_nm += "선택"+repData.disp_seq+") ";
							}
							
						}else{
							if(typeof(repData.disp_seq) != "undefined"){
								cmps_goods_nm += "선택"+repData.disp_seq+") ";
							}
							
							if($("#recev_slt", $("#detailform",scope_div)).length > 0){
								cart_grp_cd = $("#recev_slt", $("#detailform",scope_div)).attr("data-value");
								if( typeof(repData.vend_nm) != "undefined" && repData.vend_nm != ""){
									cmps_goods_nm += "["+repData.vend_nm+"]";
								}
								if( cart_grp_cd == "40" ){
									cmps_goods_nm += "[방문수령]";
								}else if( cart_grp_cd == "50" ){
									cmps_goods_nm += "[선물하기]";
								}else if( cart_grp_cd == "60" ){
									cmps_goods_nm += "[오늘받송]";
								}else if( cart_grp_cd == "70" ){
									cmps_goods_nm += "[오늘직송]";
								}else{
									cmps_goods_nm += "[택배배송]";
								}
							}else if(solodeliway_yn == "Y"){ //오늘직송 하나만들어왔을 경우
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
						if($("#reserv_limit_divi_cd", scope_div).val() == "10"){	//예약상품일 때, (묶음이나 세트는 예약 X)
							cmps_goods_nm += "[예약배송] "
							cmps_goods_nm_flag= true;
						}else if($("#reserv_limit_divi_cd", scope_div).val() == "20"){
							cmps_goods_nm += "[프리오더] "
							cmps_goods_nm_flag= true;
						}
						if(typeof($("#vend_nm", scope_div).val()) != "undefined"){
							
							cmps_goods_nm += "["+$("#vend_nm", scope_div).val()+"]";
							if($("#recev_slt", $("#detailform",scope_div)).length > 0){
								if( cart_grp_cd == "40" ){
									if(jwNormal_yn == "Y"){
										cmps_goods_nm += "[매장수령]";
									}else{
										cmps_goods_nm += "[방문수령] ";
									}
								}else if( cart_grp_cd == "50" ){
									cmps_goods_nm += "[선물하기] ";
								}else if( cart_grp_cd == "60" ){
									cmps_goods_nm += "[오늘받송] ";
								}else if( cart_grp_cd == "70" ){
									cmps_goods_nm += "[오늘직송] ";
								}else{
									cmps_goods_nm += "[택배배송] ";
								}
							}else if($("#soloDeliWay_yn", $("#detailform",scope_div)).val() == "Y"){ //오늘직송 하나만들어왔을 경우
									cmps_goods_nm += "[오늘직송]";
							}
							cmps_goods_nm_flag= true;	
						}
						
						
						if(!cmps_goods_nm_flag && $("#recev_slt", scope_div).length > 0){
							if( cart_grp_cd == "40" ){
								if(jwNormal_yn == "Y"){
									cmps_goods_nm += "[매장수령]";
								}else{
									cmps_goods_nm += "[방문수령] ";
								}
							}else if( cart_grp_cd == "50" ){
								cmps_goods_nm += "[선물하기] ";
							}else if( cart_grp_cd == "60" ){
								cmps_goods_nm += "[오늘받송] ";
							}else if( cart_grp_cd == "70" ){
								cmps_goods_nm += "[오늘직송] ";
							}else{
								cmps_goods_nm += "[택배배송] ";
							}
						}else if(!cmps_goods_nm_flag && $("#soloDeliWay_yn", $("#detailform",scope_div)).val() == "Y"){ //오늘직송 하나만들어왔을 경우
							cmps_goods_nm += "[오늘직송]";
						}
						
		 				cmps_goods_nm += repData.ITEM_NM;
		 				
		 				if(+p.max_qty > 0 && +p.max_qty <= 10 ){
		 					if(p.ord_poss_max_qty_st_cd == "20"){
			 					cmps_goods_nm += "<br/> (1인당 최대" + p.max_qty + "개)";
			 				}else if(p.ord_poss_max_qty_st_cd == "10"){
			 					cmps_goods_nm += "<br/> (주문당 최대" + p.max_qty + "개)";
			 				}
		 				}
					}
					
					html += "<li  class=\"L" + classkey +"\">";
					html +=	"	<div class=\"opt\">"; //+data.ITEM_NM;
					html += cmps_goods_nm;
					if(typeof(pin.gift_goods_dtl_no) != "undefined"){
						html +=	"<br/>사은품 : "+pin.gift_nm;
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
					html += "</div>"
					html += "	<input type=\"hidden\" name=\"sale_price\" id=\"sale_price\" value=\""+repData.CUST_SALE_PRICE+"\" class=\"input\"/>"; 
					html +=	"	<div class=\"qty\">";
					html +=	"			<input type=\"text\" name=\"ord_qty\" id=\"ord_qty\" onblur=\"elandmall.goodsDetail.checkKeyPressQty("+pinInputStr+", obj:this});\" title=\"수량\" value=\""+p.min_qty+"\" />";
					html +=	"			<button type=\"button\" class=\"minus\" data-ga-tag=\"MW_상품상세||상품수량변경||-\" onclick=\"elandmall.goodsDetail.setMinus("+pinStr+");\" ><em class=\"ir\">수량감소</em></button>";
					html +=	"			<button type=\"button\" class=\"plus\"  data-ga-tag=\"MW_상품상세||상품수량변경||+\" onclick=\"elandmall.goodsDetail.setPlus("+pinStr+");\" ><em class=\"ir\">수량증가</em></button>";
					html +=	"	</div>";
					html +=	"	<div class=\"prc\"><b class=\"itemPrc\">"+elandmall.util.toCurrency(repData.CUST_SALE_PRICE*p.min_qty)+"</b>원</div>";
					html +=	"	<button type=\"button\" class=\"del\" onclick=\"elandmall.goodsDetail.removeItem("+pinStr+")\"><em class=\"ir\">옵션 삭제</em></button>";
					html += "</li>";
					$("#choiceItemBox", scope_div).prepend(html);
					
					$('.gd_opt_scroll').find('.gd_opt').css('transform','')
					fnGoodsOptRefresh();
					
					var form = $(".L" + classkey, scope_div);
					var hidden = null;
					if(type == "DEF"|| type == "PKG"){

						if(type == "PKG"){
							hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").attr("id","goods_no").val(repData.GOODS_NO);
							hidden.appendTo(form);
						}else{
							if($(":input[name=item_no]", "#detailform").size() >= 1) {
								hidden = $("<input />").attr("type", "hidden").attr("name", "goods_no").attr("id","goods_no").val(repData.GOODS_NO);
								hidden.appendTo(form);
				
							}
						}
						hidden = $("<input />").attr("type", "hidden").attr("name", "vir_vend_no").attr("id","vir_vend_no").val(repData.VIR_VEND_NO);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "item_no").attr("id","item_no").val(repData.ITEM_NO);
						hidden.appendTo(form);
					}
					hidden = $("<input />").attr("type", "hidden").attr("name", "goods_nm").attr("id","goods_nm").val(repData.GOODS_NM);
					hidden.appendTo(form);
					hidden = $("<input />").attr("type", "hidden").attr("name", "brand_nm").attr("id","brand_nm").val(repData.BRAND_NM);
					hidden.appendTo(form);
					hidden = $("<input />").attr("type", "hidden").attr("name", "item_nm").attr("id","item_nm").val(repData.ITEM_NM);
					hidden.appendTo(form);
					if ( pin.gift_goods_dtl_no ){
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_goods_dtl_no").attr("id","gift_goods_dtl_no").val(pin.gift_goods_dtl_no);
						hidden.appendTo(form);
						hidden = $("<input />").attr("type", "hidden").attr("name", "gift_stock_qty").attr("id","gift_stock_qty").val(pin.gift_stock_qty);
						hidden.appendTo(form);
					}
					hidden = $("<input />").attr("type", "hidden").attr("name", "cart_grp_cd").attr("id","cart_grp_cd").val(cart_grp_cd);
					hidden.appendTo(form);
					
					if(jwNormal_yn == "Y"){
						hidden = $("<input />").attr("type", "hidden").attr("name", "cust_item_nm").attr("id","cust_item_nm").val(repData.ITEM_NM);
						hidden.appendTo(form);
						
						hidden = $("<input />").attr("type", "hidden").attr("name", "disp_seq").attr("id","disp_seq").val(repData.disp_seq);
						hidden.appendTo(form);
					}
					
					
					if(jwNormal_yn == "Y" && $("#recev_slt", scope_div).attr('data-value') != "" && $("#recev_slt", scope_div).attr('data-value') == "40"){
						
						var brand_cd = (typeof(data.brand_cd) != "undefined")? data.brand_cd:"";
						var style_cd = (typeof(data.style_cd) != "undefined")? data.style_cd:"";
						var last_sap_item_cd = (typeof(data.last_sap_item_cd) != "undefined")? data.last_sap_item_cd:"";
						
						var p = $.extend({ cust_prod_yn: "N", classkey : classkey, brandCode: brand_cd, styleCode: style_cd, productCode: last_sap_item_cd}, p || {});
						elandmall.popup.storeReceiptLayer(p);
						
					}else{
						$(scope_div).data("choice_yn","Y");
						if($("#dd_receive_choice").length > 0){
							
							
							//바로구매 버튼 활성 4
							var present_chk = false;
							
							for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
								var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
								if(cart_grp_cd == "50"){
									present_chk = true;
								}
							}
							
							if(present_chk){
								$("#btn_grp").find('.cart').remove();
								$("#btn_grp").find('.buy').attr('class', 'btn');
							}else{
								if( scope_div.find("#event_layer_yn").val() != "Y" && $("#btn_grp").find('.cart').length < 1 ){
									if(imme_purch_yn == "N"){
										$("#btn_grp").find('.btn').attr('class', 'buy');
										$("#btn_grp").find('.buy').before('<button type="button" class="cart" id="cartBtn" data-ga-tag="MW_상품상세||구매버튼||장바구니" onclick="elandmall.goodsDetail.clickCartOrd({cart_divi_cd:\'10\'});" disabled="disabled">장바구니</button>');
									}
								}
							}
							
						}
						
						if(jwNormal_yn == "Y"){
							$("#dd_receive_choice").hide();
						}
						elandmall.goodsDetail.visibleTotalAmt();
						elandmall.goodsDetail.sumMultiTotal(scope_div);
						elandmall.goodsDetail.initSelectsBox(scope_div);
						fnGoodsOptRefresh();
						elandmall.goodsDetail.setOrdBtnDisabled();
						
					}
			    }
			    
			    if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
					$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
					.on('touchstart focusin', function() {
						$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
					})
					.focusout(function() {
						$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
					});
					$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
						$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
					});
					
				}
			},//[END] 추가 상품(단품) 그리기
			
			
			fnCallbackResultStoreNormal : function(p){
				var scope_div = (p.quickview_yn == "Y")? $("#quick_view_layer"):$("#goods_opt");
				var omsSaleQty = (typeof(p.saleQty) != "undefined")? p.saleQty:"";
				var form = $(".L" + p.classkey);
				var hidden = null;
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopCode").val(p.shopCode);
				hidden.appendTo(form);
				hidden = $("<input />").attr("type", "hidden").attr("name", "shopName").val(p.shopName);
				hidden.appendTo(form);
				hidden = $("<input />").attr("type", "hidden").attr("name", "omsSaleQty").val(omsSaleQty);
				hidden.appendTo(form);
				
				form.find('.opt').text("");
				if($("#goods_type_cd", scope_div).val() == "80"){
					form.find('.opt').text("[매장수령]["+p.shopName+"]선택" + form.find("[name=disp_seq]").val() + ") "+form.find("[name=goods_nm]").val()+" "+ form.find("[name=cust_item_nm]").val());
				}else{
					form.find('.opt').text("[매장수령]"+"["+p.shopName+"]"+form.find("[name=cust_item_nm]").val());
				}
				
				$(scope_div).data("choice_yn","Y");
				if($("#dd_receive_choice").length > 0){
					
					
					//바로구매 버튼 활성 5
					var present_chk = false;
					
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#btn_grp").find('.cart').remove();
						$("#btn_grp").find('.buy').attr('class', 'btn');
					}else{
						if(scope_div.find("#event_layer_yn").val() != "Y" && $("#btn_grp").find('.cart').length < 1 ){
							$("#btn_grp").find('.btn').attr('class', 'buy');
							$("#btn_grp").find('.buy').before('<button type="button" class="cart" id="cartBtn" data-ga-tag="MW_상품상세||구매버튼||장바구니" onclick="elandmall.goodsDetail.clickCartOrd({cart_divi_cd:\'10\'});" disabled="disabled">장바구니</button>');	
						}
					}
					
				}
				
				$("#dd_receive_choice").hide();

				elandmall.goodsDetail.visibleTotalAmt();
				elandmall.goodsDetail.sumMultiTotal(scope_div);
				elandmall.goodsDetail.initSelectsBox(scope_div);
				fnGoodsOptRefresh();
				elandmall.goodsDetail.setOrdBtnDisabled();
				commonUI.dimRemove();
			},
			
			fnCallbackCloseStoreNormal : function(p){
				$("#dd_receive_choice").children('.lyr_select').removeClass('on');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').removeClass('selected');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').text('수령방법을 선택하세요.');
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
				$("#dd_receive_choice").children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
				toggleBt('show');
				scrollReest();
				commonUI.dimRemove();
			},
			
			
			//수령방법 초기화
			fnReceiveChoiceValid : function(pin){
				var scope_div = pin.div;
				var confirmDupCnt = 0;
				var recev_slt_value = $("#recev_slt", $("#detailform",scope_div)).attr('data-value');
				if(pin.solodeliway_yn == "Y"){ //예약배송 하나일때
					recev_slt_value = "70";
				}
				
				// 첫번재 Row에 선물하기가 있는지 체크한다. 50 : 선물하기 
				if($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "50"){
					if(recev_slt_value != "50"){
						confirmDupCnt++;
					}
				}else if($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "50"){
					if(recev_slt_value == "50"){
						confirmDupCnt++;
					}
				}
				
				// 첫번재 Row에 오늘받송이 있는지 체크한다. 60 : 오늘받송 
				if($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "60"){
					if(recev_slt_value != "60"){
						confirmDupCnt++;
					}
				}else if($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "60"){
					if(recev_slt_value == "60"){
						confirmDupCnt++;
					}
				}
				
				// 첫번재 Row에 오늘직송이 있는지 체크한다. 70 : 오늘직송 
				if($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() == "70"){
					if(recev_slt_value != "70"){
						confirmDupCnt++;
					}
				}else if($("#choiceItemBox").find('li').eq(0).find('input[name=cart_grp_cd]').val() != "70"){
					if(recev_slt_value == "70"){
						confirmDupCnt++;
					}
				}
				
				if(confirmDupCnt > 0){
					if(confirm("다른 수령 방식과 동시 주문이 불가능 하여\n기존 선택된 상품이 삭제 됩니다.")){
						$("#choiceItemBox", scope_div).find('li').remove();
						elandmall.util.ga(pin.category, pin.action, pin.label);
				        elandmall.goodsDetail.visibleTotalAmt();
				        elandmall.goodsDetail.sumMultiTotal();
				        return true;
					}else{
						if($("#recev_slt", scope_div).children().attr('type') != "radio"){
							$("#recev_slt", scope_div).attr("data-value","");
							$("#recev_slt", scope_div).attr("data-choice_yn","N");
							$("#recev_slt", scope_div).attr("data-sel-msg","");
							$("#recev_slt", scope_div).text("수령 방법을 선택하세요.");
							$("#recev_slt", scope_div).parent().removeClass('selected');
							$("#recev_slt", scope_div).change();
							commonUI.dimRemove();
						}else{
							//$("#dd_receive_choice").hide();
							$("input[name=sel_dlv]:checked", scope_div).prop('checked', false);
							$("#recev_slt", scope_div).attr('data-value', "");
							$("#recev_slt", scope_div).attr("data-choice_yn","N");
						}
						return false;
					}
				}
				return true;
			},
			
			//[START] 키패드 수량입력 체크
			checkKeyPressQty :function(p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $("#goods_opt");
				var qty_objs = (typeof(p.classkey) != "undefined") ? $(":input[name='ord_qty']", $(".L"+p.classkey, scope_div)) : $(":input[name='ord_qty']", scope_div);
				var tmpOmsSaleQty = (typeof(p.classkey) != "undefined") ? $(":input[name='omsSaleQty']", $(".L"+p.classkey, scope_div)).val() : $(":input[name='omsSaleQty']", scope_div).val();
				var omsSaleQty = (typeof(tmpOmsSaleQty) != "undefined")? tmpOmsSaleQty : "";
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnClassKeyAndSum = function(p){
					if(typeof(p.classkey) != "undefined"){
						var priceObj =$(":input[name='sale_price']", $(".L"+p.classkey, scope_div));
						$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qty_objs.eq(0).val())) );
					}
					elandmall.goodsDetail.sumMultiTotal(scope_div);
				}
				
				if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					//event.retunValue = false;
					  var regexp = /[^0-9]/gi;
					  var v = $(p.obj).val();
					  if (regexp.test(v)) {
						   $(qty_objs).val(v.replace(regexp, ''));
					  }
					  if(event.keyCode == 8){
						  fnClassKeyAndSum(p);
						  return;
					  }
				}

				// n+1 체크 추가
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
					fnClassKeyAndSum(p);
					return;
				}
				
				//[START] 최대주문 및 최대수량, 재고 체크
				var input_qty = +$(p.obj).val();
				var alert_qty = 0;
				var vMsg = "";
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
					fnClassKeyAndSum(p);
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
				fnClassKeyAndSum(p);
			},//[END] 키패드 수량입력 체크
			//[START] 쥬얼리 키패드 수량입력 체크
			checkKeyPressQtyJw :function(p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $("#goods_opt");
				var qty_objs = (typeof(p.classkey) != "undefined") ? $(":input[name='ord_qty']", $(".L"+p.classkey, scope_div)) : $(":input[name='ord_qty']", scope_div);
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnClassKeyAndSum = function(p){
					if(typeof(p.classkey) != "undefined"){
						
						
						var price = 0;
						for(var i=0; i<$("#choiceItemBox").find('li').length; i++){
							if($("#choiceItemBox").find('li').eq(i).attr('class') ==  "L"+p.classkey){
								var ord_qty = Number($("#choiceItemBox").find('li').eq(i).find('.qty').find('#ord_qty').val() );
								price = $("#choiceItemBox").find('li').eq(i).find('input[name="sale_price"]').val();
								ord_qty = (qty_objs.eq(0).val());
								$(":input[name='ord_qty']", $("#choiceItemBox").find('li').eq(i)).attr('value', ord_qty);
							}
						}
						
						$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(price) * +(qty_objs.eq(0).val())) );
						
					}
					elandmall.goodsDetail.sumMultiTotalJw();
				}
				
				if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					//event.retunValue = false;
					  var regexp = /[^0-9]/gi;
					  var v = $(p.obj).val();
					  if (regexp.test(v)) {
						   $(qty_objs).val(v.replace(regexp, ''));
					  }
					  if(event.keyCode == 8){
						  fnClassKeyAndSum(p);
						  return;
					  }
				}

				// n+1 체크 추가
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
					fnClassKeyAndSum(p);
					return;
				}
				
				//[START] 최대주문 및 최대수량, 재고 체크
				var input_qty = +$(p.obj).val();
				var alert_qty = 0;
				var vMsg = "";
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
					fnClassKeyAndSum(p);
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
				fnClassKeyAndSum(p);
			},//[END] 쥬얼리 키패드 수량입력 체크
			
			checkInitQty :function(p){
				var quickview_yn = (typeof(p.quickview_yn) != "undefined")? p.quickview_yn : "N";
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var scope_div = (quickview_yn == "Y") ? $("#quick_view_layer") : $("#goods_opt");
				var qty_objs = (typeof(p.classkey) != "undefined") ? $(":input[name='ord_qty']", $(".L"+p.classkey, scope_div)) : $(":input[name='ord_qty']", scope_div);
				var goods_type_cd = $("#goods_type_cd", scope_div).val();
				var fnClassKeyAndSum = function(p){
					if(typeof(p.classkey) != "undefined"){
						var priceObj =$(":input[name='sale_price']", $(".L"+p.classkey, scope_div));
						$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qty_objs.eq(0).val())) );
					}
					elandmall.goodsDetail.sumMultiTotal(scope_div);
				}
				
				/*if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					//event.retunValue = false;
					  var regexp = /[^0-9]/gi;
					  var v = $('#ord_qty').val();
					  if (regexp.test(v)) {
						   $(qty_objs).val(v.replace(regexp, ''));
					  }
					  if(event.keyCode == 8){
						  fnClassKeyAndSum(p);
						  return;
					  }
				}*/

				// n+1 체크 추가
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
					fnClassKeyAndSum(p);
					return;
				}
				
				//[START] 최대주문 및 최대수량, 재고 체크
				var input_qty = +$('#ord_qty').val();
				var alert_qty = 0;
				var vMsg = "";
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
					vMsg = "상품은 최대"+alert_qty+"개까지 주문 가능합니다.";
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
					fnClassKeyAndSum(p);
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
				fnClassKeyAndSum(p);
			},//[END] 키패드 수량입력 체크

			initSelectsBoxJw:function(scope_div){
				if($("#goods_type_cd", scope_div).val() != "80" ){
					/*$("#item_opt_nm1", scope_div).val("");
					$("#item_opt_nm1", scope_div).change();*/
					$("[id^=item_opt_nm1]", scope_div).attr("data-value","");
					$("[id^=item_opt_nm1]", scope_div).attr("data-org-msg",$("#item_opt_nm1", scope_div).data("opt_nm")+" 옵션을 선택해 주세요.");
					$("[id^=item_opt_nm1]", scope_div).attr("data-sel-msg","");
					$("[id^=item_opt_nm1]", scope_div).parents('.sel_btn').removeClass('selected');
					$("[id^=item_opt_nm1]", scope_div).text($("#item_opt_nm1", scope_div).data("opt_nm")+" 옵션을 선택해 주세요.");
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
							
							if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
								$(lDiv).parents('.lyr_select').addClass('disabled');
							};
							$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
						};
					});
					var del_opt_msg  = $("[id^=item_opt_nm]");
					$.each(low_div, function(idx, Opt_msg) {
						$(Opt_msg).attr("data-sel-msg","");
					});
					
					if($("#recev_slt", scope_div).length > 0){
						$("#recev_slt", scope_div).attr("data-value","");
						$("#recev_slt", scope_div).attr("data-choice_yn","N");
						$("#recev_slt", scope_div).attr("data-sel-msg","");
						$("#recev_slt", scope_div).text("수령 방법을 선택하세요.");
						$("#recev_slt", scope_div).parent().removeClass('selected');
						$("#recev_slt", scope_div).change();
					}
					
				}else if ($("#goods_type_cd", scope_div).val() == "80"){ 
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
						
						var low_div = $("dd[id^=li_cmps_goods_grp]");
						$.each(low_div, function(idx, lDiv) {
							$(lDiv).siblings('dd').remove();
						});
					}else if($("#goods_type_cd", scope_div).val() == "80"){
						$("[id^=pkgCmpsGoods]", scope_div).parent().removeClass('selected');
						$("[id^=pkgCmpsGoods]", scope_div).text("상품을 선택해주세요.");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-org-msg","상품을 선택해주세요.");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-sel-msg","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-disp_seq","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-vend_nm","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-goods_no","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-vir_vend_no","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-multi_item_yn","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn","N");
						var low_div =$("dd[id^=dd_cmps_goods]");
						$.each(low_div, function(idx, lDiv) {
							$(lDiv).siblings('dd').remove();
						});
						$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
							$(lDiv).children('li').removeClass("selected");
						});
					}
				}
				
				toggleBt('show');
			},
			
			
			initSelectsBox:function(scope_div){
				if($("#multi_item_yn", scope_div).val() == "Y"){
					/*$("#item_opt_nm1", scope_div).val("");
					$("#item_opt_nm1", scope_div).change();*/
					$("[id^=item_opt_nm1]", scope_div).attr("data-value","");
					$("[id^=item_opt_nm1]", scope_div).attr("data-org-msg",$("#item_opt_nm1", scope_div).data("opt_nm")+" 옵션을 선택해 주세요.");
					$("[id^=item_opt_nm1]", scope_div).attr("data-sel-msg","");
					$("[id^=item_opt_nm1]", scope_div).parents('.sel_btn').removeClass('selected');
					$("[id^=item_opt_nm1]", scope_div).text($("#item_opt_nm1", scope_div).data("opt_nm")+" 옵션을 선택해 주세요.");
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
							
							if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
								$(lDiv).parents('.lyr_select').addClass('disabled');
							};
							$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
						};
					});
					var del_opt_msg  = $("[id^=item_opt_nm]");
					$.each(low_div, function(idx, Opt_msg) {
						$(Opt_msg).attr("data-sel-msg","");
					});
					
					if($("#recev_slt", scope_div).length > 0){
						if($("#recev_slt", scope_div).children().attr('type') != "radio"){
							$("#recev_slt", scope_div).attr("data-value","");
							$("#recev_slt", scope_div).attr("data-choice_yn","N");
							$("#recev_slt", scope_div).attr("data-sel-msg","");
							$("#recev_slt", scope_div).text("수령 방법을 선택하세요.");
							$("#recev_slt", scope_div).parent().removeClass('selected');
							$("#recev_slt", scope_div).change();
						}else{
							$("#dd_receive_choice").hide();
							$("input[name=sel_dlv]:checked", scope_div).prop('checked', false);
							$("#recev_slt", scope_div).attr('data-value', "");
							$("#recev_slt", scope_div).attr("data-choice_yn","N");
						}
					}
					
				}else{
					if($("#goods_cmps_divi_cd", scope_div).val() == "20"){
						$("[id^=cmps_goods_grp]", scope_div).each(function(idx){
							$(this).attr("data-value","");
							$(this).parent().removeClass('selected');
							$(this).attr("data-org-msg","상품 선택");
							$(this).attr("data-sel-msg","");
							$(this).text("상품 선택");
							$(this).attr("data-sel-msg","");
							$(this).attr("data-choice_yn","N");
						});
						$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
							$(lDiv).children('li').removeClass("selected");
						});
						
						var low_div = $("dd[id^=li_cmps_goods_grp]");
						$.each(low_div, function(idx, lDiv) {
							$(lDiv).siblings('dd').remove();
						});
					}else if($("#goods_type_cd", scope_div).val() == "80"){
						$("[id^=pkgCmpsGoods]", scope_div).parent().removeClass('selected');
						$("[id^=pkgCmpsGoods]", scope_div).text("상품을 선택해주세요.");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-org-msg","상품을 선택해주세요.");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-sel-msg","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-disp_seq","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-vend_nm","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-goods_no","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-vir_vend_no","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-multi_item_yn","");
						$("[id^=pkgCmpsGoods]", scope_div).attr("data-choice_yn","N");
						var low_div =$("dd[id^=dd_cmps_goods]");
						$.each(low_div, function(idx, lDiv) {
							$(lDiv).siblings('dd').remove();
						});
						$.each($("[id^=options_nm]", scope_div), function(idx, lDiv) {
							//$(lDiv).children('li').removeClass("selected");
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
				
				toggleBt('show');
			},
			//[START] 추가된 옵션삭제
			removeItem : function(pin) {
				
				 //[ECJW-9] 옵션 불러오기 I/F 
		        if(jwFlag){
		        	 //삭제처리
			        elandmall.util.ga("MW_상품상세", "상품수량삭제", "삭제");
			        $(".L"+pin.classkey,"#choiceItemBox").remove();
			        fnGoodsOptRefresh();
			        elandmall.goodsDetail.setOrdBtnDisabled();
			        elandmall.goodsDetail.visibleTotalAmt();
			        elandmall.goodsDetail.sumMultiTotalJw();	
			        
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
			        
			        
			      //바로구매 버튼 활성 6
			        var present_chk = false;
					
					for(var i=0; i< $("#choiceItemBox").children('li').length; i++){
						var cart_grp_cd = $("#choiceItemBox").children('li').eq(i).find("#cart_grp_cd").val();
						if(cart_grp_cd == "50"){
							present_chk = true;
						}
					}
					
					if(present_chk){
						$("#btn_grp").find('.cart').remove();
						$("#btn_grp").find('.buy').attr('class', 'btn');
					}else{
						if($("#event_layer_yn").val() != "Y" && $("#btn_grp").find('.cart').length < 1 ){
							$("#btn_grp").find('.btn').attr('class', 'buy');
							$("#btn_grp").find('.buy').before('<button type="button" class="cart" id="cartBtn" data-ga-tag="MW_상품상세||구매버튼||장바구니" onclick="elandmall.goodsDetail.clickCartOrd({cart_divi_cd:\'10\'});" disabled="disabled">장바구니</button>');	
						}
						
					}
		        }else{
		        	
		        	 if($("#multi_item_yn").val() == "Y") {
						    
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
				        elandmall.util.ga("MW_상품상세", "상품수량삭제", "삭제");
				        $(".L"+pin.classkey,"#choiceItemBox").remove();
				        fnGoodsOptRefresh();
				        elandmall.goodsDetail.setOrdBtnDisabled();
				        elandmall.goodsDetail.visibleTotalAmt();
				        elandmall.goodsDetail.sumMultiTotal();	
		        }
		        
		       
		       
		        
		        
		        
			},//[END] 추가된 옵션삭제
			//[START] 장바구니, 바로구매 버튼 비활성화 제어
			setOrdBtnDisabled: function(){
				if($("#choiceItemBox").children().length > 0){
					$("#btn_grp").children('button').removeAttr('disabled');
				}else{
					$("#btn_grp").children('button').attr('disabled','disabled');
				}
			},//[END] 장바구니, 바로구매 버튼 비활성화 제어
			//[START] 쿠폰다운로드
			clickCpnDown:function(p){
				var vPromo_no = p.promo_no;
				var vCert_key = p.cert_key;
				var loginCallback = function(){
					
					elandmall.cpnDown({
						promo_no:vPromo_no,
						cert_key:vCert_key, 
						p_yn:"Y",
						callback:function(rst){
							$("#cpnDownBtn").hide();
							var appendHTML = '<a href="javascript:void(0);" class="dw disabled"><em class="ir">쿠폰</em>받기완료</a>';
							$("#cpnDownBtn").before(appendHTML);
							$("#cpnDownBtn").remove();
						}
					});
				}
				elandmall.isLogin({login:loginCallback});
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
							var vCpnTxt = $("#cpnDownBtn2").children("em").html();
							var vEndDateTxt = "";
							if ( rst != null ) {
								var arrEndDtime = rst.AVAL_END_DTIME.split("\ ");
								var arrEndDate = arrEndDtime[0].split("-");
								vEndDateTxt = "(~"+arrEndDate[1]+"-"+arrEndDate[2]+")";
							}

							var appendHTML = "";
							appendHTML += "<em>"+vCpnTxt+" 다운완료"+vEndDateTxt+"</em>";

							$("#cpnDownBtn2").html(appendHTML);
							$("#cpnDownBtn2").attr('disabled','disabled');
						}
					});
				}
				elandmall.isLogin({login:loginCallback});
			},//[END] 쿠폰다운로드
			checkDonationAmt:function(event){
				if((!($("#view_donation_amt").val() == "") && (event.keyCode == 8 || event.which == 8)) || !(event.keyCode == 8 || event.which == 8) ){
					setTimeout(function(){
						var regexp = /[^0-9]/gi;
						var view_val = $("#view_donation_amt").val();
						var real_val = +view_val.replace(regexp,'');
						var sale_price = +$("#sale_price").val();
						
						if(real_val == 0){
							$("#view_donation_amt").val("");
							$("#donation_amt").val("");
						}else{
							$("#view_donation_amt").val(elandmall.util.toCurrency(real_val));
							$("#donation_amt").val(real_val);
						}
						
		
					},800);
				}
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
				}, 800);
			},
			fnSelectItem : function(p){
				p = $.extend({ goods_no: set_goods_no, item_no: "", vir_vend_no: set_vir_vend_no,low_vend_type_cd:set_low_vend_type_cd, deli_goods_divi_cd:set_deli_goods_divi_cd, quickview_yn:set_quickview_yn, styleCode:set_styleCode }, p || {});
				var quickview_yn = p.quickview_yn;
				var div = null;
				if(quickview_yn == "Y"){
					div = $("#quick_view_layer");
					
				}else{
					div = $("#goods_opt");
				}
				//.sel_txt에 값들 다 세팅해서 처리하자
				var obj= p.obj;
				var currObj = $(obj);
				var opt_idx = $(obj).parents('.options').data('index');
				var $li = $(p.obj).parent('li');
				//var $hideTg = []; // hide & show Target   //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
				var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
				var color_chip_val = +$("#color_mapp_option").val();
				
				if(!$li.hasClass('sld_out')){
					//$hideTg[0] = currObj.parent().parent().parent().parent().parent().siblings('dd');
					//$hideTg[1] = currObj.parent().parent().parent().parent().parent().parent().siblings('dl, .set');
					$selBtn.find('.sel_txt').attr('data-sel-msg',$(obj).find('.opt_name').text());
					$selBtn.find('.sel_txt').data('sel-msg',$(p.obj).find('.opt_name').text());

					$selBtn.find('.sel_txt').attr('data-sel-cd', $(p.obj).parent().data('code'));
					$selBtn.find('.sel_txt').attr("data-sap_item_cd",$li.attr("data-sap_item_cd"));

					$selBtn.find('.sel_txt').attr("data-value",$li.attr("data-value"));
					$('.lyr_select').removeClass('on');
					$li.addClass('selected').siblings('li').removeClass('selected');
					
					showText($selBtn);
					
					tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
					toggleBt('show');
					scrollReest();
					if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){
						p["reserv_yn"] = "Y";
					}else{
						p["reserv_yn"] = "N";
					}
					
					// mobileYn : overpass.goods.js 에서 FO와 MO가 공통영역 이기 때문에 체크를 해준다.
					// 옵션명이 날짜캘린더는 PCWEB만 존재하여 구분할수 있는 파라미터가 필요하기 때문에 생성 
					elandmall.optLayerEvt.changeItem({
						param:{ mobileYn: "Y", goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no, low_vend_type_cd: p.low_vend_type_cd, reserv_yn:p.reserv_yn, deli_goods_divi_cd: p.deli_goods_divi_cd,  styleCode:p.styleCode, jwFlag: jwFlag, carve_yn : set_carve_yn, jwNormalFlag:jwNormalFlag},
						color_chip_val: color_chip_val,
						color_chip_yn:"Y",
						div:div,
						chgObj:$(p.obj),
						callback_ajax:function(result){
							/*if(color_chip_val == result.next_idx){
							//elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn});
						}*/
						},
						callback:function(result){
							
							var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
							param["curr_idx"] = opt_idx;
							var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
							//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
							var currVal = currObj.parent().attr("data-value");
							var carve_yn = currObj.parents('.lyr_options').children().attr('data-carve_yn');
							$("#last_item_no").val(currVal);
							$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
							
							if(jwFlag){
								
								var opt = div.find("[id^=options_nm"+result.next_idx+"]");
								var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
									
								if(next_cd == "" || typeof(next_cd) == "undefined" && set_field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && set_present_yn == "Y"){
									$("#dd_receive_choice").show();
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
												param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).attr("data-value");
												param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
												$(div).data("choice_yn","Y");
												//fnItemChoice(param);
												if(elandmall.goodsDetail.checkDefGoodsChoice(div)){
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															elandmall.goodsDetail.drawAddGoods({
																data:data,
																quickview_yn:quickview_yn,
																gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", div))).attr("data-value"),
																gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty")
															});
														}
													});
												}
												
												
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$(div).data("choice_yn","Y");
											if(elandmall.goodsDetail.checkDefGoodsChoice(div)){

												if(jwFlag){
													param["goods_no"] = $("#goods_no").val();
													param["goods_nm"] = $("#goods_nm").val();
													param["carve_yn"] = carve_yn;
													elandmall.goodsDetail.jwGoodsAddParam({
														param:param,
													});
													
												}else{
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
												
											}else{	//사은품은 없고, 현장수령여부 체크가 있을 때, 설정한 상품정보를 임시저장
												$(div).data("choice_yn","Y");
												$(div).data("itemInfo", param);
											}
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										if(last_yn == "Y" && currVal == ""){
											$("#gift_slt", div).attr("value","");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).attr("data-sel-msg","");
											$("#gift_slt", div).attr("data-itemInfo","");
											$(div).attr("data-choice_yn","");
										}else if(last_yn !="Y"){
											$("#gift_slt", div).attr("value","");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).attr("data-sel-msg","");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$(div).attr("data-choice_yn","");
										}
									}
								}
									
								
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
												$("#dd_receive_choice").show();
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("#dd_receive_choice").show();
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										if(last_yn == "Y" && currVal == ""){
											$("#gift_slt", div).attr("value","");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).attr("data-sel-msg","");
											$("#gift_slt", div).attr("data-itemInfo","");
											$(div).attr("data-choice_yn","");
										}else if(last_yn !="Y"){
											$("#gift_slt", div).attr("value","");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).attr("data-sel-msg","");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$(div).attr("data-choice_yn","");
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
												$("#gift_slt", div).attr("data-value","");
												$("[id^=gift_slt]", div).parent().removeClass("selected");
												$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", div).attr("data-sel-msg","");
												$("#gift_slt", div).attr("data-itemInfo","");
												$(div).removeData("choice_yn");
												$("[id^=gift_slt]", div).parents(".lyr_select").removeClass("disabled");
												$("#gift_slt", div).data("itemInfo", param);
												$("#dd_receive_choice").hide();
											}else{	//사은품이 1개일 때,
												param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm");
												param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).attr("data-value");
												param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty");
												$(div).data("choice_yn","Y");
												$(div).data("itemInfo", param);
												//fnItemChoice(param);
												if(elandmall.goodsDetail.checkDefGoodsChoice(div)){
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															elandmall.goodsDetail.drawAddGoods({
																data:data,
																quickview_yn:quickview_yn,
																gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", div))).attr("data-value"),
																gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform",div))).data("stock_qty")
															});
														}
													});
												}
												
												
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$(div).data("choice_yn","Y");
											if(elandmall.goodsDetail.checkDefGoodsChoice(div)){

												if(jwFlag){
													param["goods_no"] = $("#goods_no").val();
													param["goods_nm"] = $("#goods_nm").val();
													param["carve_yn"] = carve_yn;
													elandmall.goodsDetail.jwGoodsAddParam({
														param:param,
													});
													
												}else{
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
												
											}else{	//사은품은 없고, 현장수령여부 체크가 있을 때, 설정한 상품정보를 임시저장
												$(div).data("choice_yn","Y");
												$(div).data("itemInfo", param);
											}
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										if(last_yn == "Y" && currVal == ""){
											$("#gift_slt", div).attr("value","");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).attr("data-sel-msg","");
											$("#gift_slt", div).attr("data-itemInfo","");
											$(div).attr("data-choice_yn","");
											$("#dd_receive_choice").hide();
										}else if(last_yn !="Y"){
											$("#gift_slt", div).attr("value","");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).attr("data-sel-msg","");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$(div).attr("data-choice_yn","");
											$("#dd_receive_choice").hide();
										}
									}
								}
							}
						}
					});
				}

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
				var div = $("#goods_opt");
				var opt_cd = currObj.parent().attr('data-code');
				var parent_opt_cd = currObj.parent().parent().attr('data-opt_cd');
				
				if($("#goods_type_cd").val() == "80"){
					set_field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
					set_present_yn = $("#item_opt_li_data").attr('data-present_yn');
				}
				
				var field_recev_poss_yn = (typeof(set_field_recev_poss_yn) != "undefined")? set_field_recev_poss_yn:"N";
				var present_yn = (typeof(set_present_yn) != "undefined")? set_present_yn:"N";
				
				var $li = $(p.obj).parent('li');
				//var $hideTg = [];
				var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
				var slt_opt_val = $(p.obj).find('.opt_name').text();
				var sel_msg = $(p.obj).find('.opt_name').text()
				var obj_value =$li.attr("data-code");
				var opt_idx = $selBtn.find('.sel_txt').attr('data-index');
				
				//$hideTg[0] = currObj.parent().parent().parent().parent().parent().siblings('dd'); 
				//$hideTg[1] = currObj.parent().parent().parent().parent().parent().parent().siblings('dl, .set'); 
				$selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').data('sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').attr('data-sel-cd',obj_value);
				$('.lyr_select').removeClass('on');
				$li.addClass('selected').siblings('li').removeClass('selected');
				
				showText($selBtn);
				
				tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
				toggleBt('show');
				scrollReest();
				
				
				var opt = div.find("[id^=dd_receive_choice]");
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
				opt.children('.lyr_select').children('.sel_btn').removeClass('selected');
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','수령방법을 선택해 주세요');
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').text(opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('title'));
				opt.children('.lyr_select').removeClass('disabled');
				
				$("dd[name=dd_input_carve]").remove();
				
				var code_is = "IS";
				var code_os = "OS";
				
				var html = '';
				
				
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
				
				
				
				
				if(opt_cd == "ISOS" || opt_cd == "OSIS"){
					
					html+= '<dt class="ir">속각인</dt>';
					
					html += '<dd name="dd_input_carve">';
					html += '<label for="anno" class="ir">속각인</label>';
					html += '<input type="text" class="anno" id="in_carve" name="in_carve" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_is +'\', leng:\''+ carve_is_leng +'\'});" placeholder="속각인 공백포함/최대 '+ carve_is_leng +'자" >';
					html += '</dd>';
					
					html+= '<dt class="ir">겉각인</dt>';
					
					html += '<dd name="dd_input_carve">';
					html += '<label for="anno" class="ir">겉각인</label>';
					html += '<input type="text" class="anno" id="out_carve" name="out_carve" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_os +'\', leng:\''+ carve_out_leng +'\'});" placeholder="겉각인 공백포함/최대 '+ carve_out_leng +'자" >';
					html += '</dd>';
					
				}else if(opt_cd == "IS"){
					
					html+= '<dt class="ir">속각인</dt>';
					
					html += '<dd name="dd_input_carve">';
					html += '<label for="anno" class="ir">속각인</label>';
					html += '<input type="text" class="anno" id="in_carve" name="in_carve" onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_is +'\', leng:\''+ carve_is_leng +'\'});" placeholder="속각인 공백포함/최대 '+ carve_is_leng +'자" >';
					html += '</dd>';
					
				}else if(opt_cd == "OS"){
					
					html+= '<dt class="ir">겉각인</dt>';
					
					html += '<dd name="dd_input_carve">';
					html += '<label for="anno" class="ir">겉각인</label>';
					html += '<input type="text" class="anno" id="out_carve" name="out_carve"  onkeyup="elandmall.goodsDetail.fnCarveKeyup({obj:this, input_type:\''+ code_os +'\', leng:\''+ carve_out_leng +'\'});" placeholder="겉각인 공백포함/최대 '+ carve_out_leng +'자" >';
					html += '</dd>';
					
				}
				
				if(field_recev_poss_yn == "Y" || present_yn == "Y"  ){
					$("#dd_receive_choice").show();
					}
					
	
				div.find("#dd_id_carve").each(function(){
					$(this).after(html);
				});
				
				$('input.anno').focus(function() {
			           var that = $(this).parent()[0];
			           setTimeout(function(){
			                     OrderScorll.scrollToElement(that);
			                     OrderScorll.scrollTo(0,OrderScorll.y+6); // layout_fix
			           },400);
				});
				
				var dataPram = {obj:this, carve_code:  opt_cd };
				
				
				
				if(div.find("#recev_nm").length < 1 && div.find("#dd_receive_choice").length < 1){
					//가격조회 버튼 노출
					$(".fin_price_parents").find("button").each(function(){
					
						$(this).unbind("click",elandmall.goodsDetail.fnCarveGetPriceItem);
						$(this).bind("click",dataPram ,elandmall.goodsDetail.fnCarveGetPriceItem);
						$(this).show();
					});
				}
				

				//[END] item select change event 
				function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
					if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
						$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
					}
					else{
						$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
					}
				}
				
				 if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
						$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						});
						
					}
				 
					
				//주문제작 실시간 옵션가 가져오기
				elandmall.optLayerEvt.getJwItemPriceRealtime({obj : div ,opt_idx : opt_idx});
				
			},
			
			fnCarveKeyup : function(p){
				
				if(p.input_type == "IS"){
					fnLimitText('in_carve',p.leng);
				}else if(p.input_type == "OS"){
					fnLimitText('out_carve',p.leng);
				}
			
				function fnLimitText (textid, limit){
					var text = $('#'+textid).val(); // 이벤트가 일어난 컨트롤의 value 값
					var textlength = text.length; // 전체길이 
				 
					if(textlength > limit){
					alert("제한된 글자수를 초과 하였습니다."); 
					var text2 = text.substr(0, limit); 
					$('#'+textid).val(text2);
					return;
					}
				}
				
				
					
			},
			
			
			fnCarveGetPriceItem : function(pin){
				var p = $.extend({},pin.data);
				var quickview_yn = set_quickview_yn;
				var div = $("#goods_opt");
				var $li = $(p.obj).parent('li');
				var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
				var opt_idx = $selBtn.find('.sel_txt').attr('data-index');
				var slt_opt_val = $(p.obj).find('.opt_name').text();
				var sel_msg = $(p.obj).find('.opt_name').text()
				var obj_value =$li.attr("data-code");
				//var $hideTg = []; 
				
				//$hideTg[0] = $(p.obj).parent().parent().parent().parent().parent().siblings('dd'); 
				//$hideTg[1] = $(p.obj).parent().parent().parent().parent().parent().parent().siblings('dl, .set'); 
				$selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').data('sel-msg',slt_opt_val);
				$selBtn.find('.sel_txt').attr('data-sel-cd',obj_value);
				$('.lyr_select').removeClass('on');
				$li.addClass('selected').siblings('li').removeClass('selected');
				
				showText($selBtn);
				
				//$($hideTg).each(function(){$(this).show()});
				toggleBt('show');
				scrollReest();	
				
				
				var opt = div.find("[id^=dd_receive_choice]");
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
				opt.children('.lyr_select').children('.sel_btn').removeClass('selected');
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','수령방법을 선택해 주세요');
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
				opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').text(opt.children('.lyr_select').children('.sel_btn').children('.sel_txt').attr('title'));
				opt.children('.lyr_select').removeClass('disabled');
				
				
				var layer_yn = (typeof(p.layer_yn) != "undefined")? p.layer_yn:"";
				if($(p.obj).parent().attr('data-code') != "XXXX"){
					if(p.carve_code == "ISOS" || p.carve_code == "OSIS"){
						
						var chkIn = div.find("#in_carve").val();
						var chkOut = div.find("#out_carve").val();
						if(chkIn == "" && chkOut == "") {
							alert("각인을 입력해 주세요.");
							return false;
						}else if(fnStrChkText('in_carve', 'IS')){
							return false;
						}else if(fnStrChkText('out_carve', 'OS')){
							return false;
						}
					}else if(p.carve_code == "IS"){
						if(fnStrChkText('in_carve', 'IS')){
							return false;
						}
					}else if(p.carve_code == "OS"){
						if(fnStrChkText('out_carve', 'OS')){
							return false;
						}
					}
					
					
				}else if($(p.obj).parent().attr('data-code') == "XXXX"){
					$("#goods_opt").find('.g_opt').children('dl').find('dd[name="dd_input_carve"]').remove();
					$("#in_carve").val("");
					$("#out_carve").val("");
				}
				
				
				var currObj = $(p.obj);
				var last_yn = "N";
				
				if($("#goods_type_cd").val() == "80"){
					set_field_recev_poss_yn = $("#item_opt_li_data").attr('data-field_recev_poss_yn');
					set_present_yn = $("#item_opt_li_data").attr('data-present_yn');
				}
				
				if(set_field_recev_poss_yn != "N" && set_present_yn == "N"){ 
					last_yn = "Y";
				}
				
				var currVal = currObj.parent().attr("data-value");
				var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
				
				//[ECJW-9] 옵션 불러오기 I/F
				if(set_field_recev_poss_yn == "Y" || set_present_yn == "Y"){ 
					$("#dd_receive_choice").show();
					
				}else{
					
					//[START]사은품이 없을 때 항목을 바로 추가 한다.
					if($("#goods_type_cd").val() == "80"){
						param["goods_no"] = currObj.parents('.add_selects').find('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-goods_no');
						param["goods_nm"] = currObj.parents('.add_selects').find('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-sel-msg');
						param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
						param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
						param["layer_yn"] = p.layer_yn;
					}else{
						param["goods_nm"] = $("#goods_nm").val();
						param["goods_no"] = $("#goods_no").val();
						param["layer_yn"] = p.layer_yn;
					}
					
					param["carve_code"] = p.carve_code;
					param["carve_yn"] = "Y";
					
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
				
				function fnStrChkText (textid, opt){
					var text = ""; 
					var result_chk = false;
					text = $('#'+textid).val();
					
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
				var obj = obj.obj;
				var cmps_grp_seq = $(obj).parents('.opt_box').attr('data-cmps_grp_seq');
				var div = $("[id^=setGrp"+cmps_grp_seq+"]");
				var goods_no = $("#cmps_goods_grp"+cmps_grp_seq).attr('data-goods_no');
				var vir_vend_no = $("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no");
				var reserv_yn = "N";
				
				var currObj = $(obj);
				var opt_idx = currObj.parent().parent('.options').attr('data-index');
				var $li = currObj.parent();
				//var $hideTg = []; // hide & show Target   //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
				var $selBtn = currObj.parent().parent().parent().siblings('.sel_btn');
				
				if(!$li.hasClass('sld_out')){
					//$hideTg[0] = currObj.parent().parent().parent().parent().parent().siblings('dd');
					//$hideTg[1] = currObj.parent().parent().parent().parent().parent().parent().siblings('dl, .set');
					$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
					$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());

					$selBtn.find('.sel_txt').attr('data-sel-cd', $(this).find('.opt_name').parent().parent().data('code') );
					
					$('.lyr_select').removeClass('on');
					$li.addClass('selected').siblings('li').removeClass('selected');
					tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
					toggleBt('show');
					scrollReest($selBtn);
					
					showText($selBtn);
					
					elandmall.optLayerEvt.changeItem({
						param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:$("#goods_no").val(), reserv_yn: reserv_yn, cmps_grp_seq:cmps_grp_seq},
						div:div,
						chgObj:currObj,
						callback:function(result){
							
							var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
							var currVal = currObj.parent().attr("data-value");
							
							if(last_yn== "Y" && currVal != ""){
								if(goods_no != "" || goods_no != undefined){
									$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "Y");
								}else{
									$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "N");
								}
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", goods_no);
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", vir_vend_no);
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no", currVal);
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no",currObj.parent().attr("data-set_cmps_item_no")); // <- 세트상품 구성단품번호
								
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
					scope_div = $("#goods_opt");
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
				var $li = currObj.parent();
				//var $hideTg = []; 
				var $selBtn = currObj.parent().parent().parent().siblings('.sel_btn');
				if(!$li.hasClass('sld_out')){
					//$hideTg[0] = currObj.parent().parent().parent().parent().parent().siblings('dd'); 
					//$hideTg[1] = currObj.parent().parent().parent().parent().parent().parent().siblings('dl, .set'); 
					$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
					$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());

					$selBtn.find('.sel_txt').attr('data-sel-cd', currObj.parent().data('code'));
					$selBtn.find('.sel_txt').attr("data-sap_item_cd",$li.attr("data-sap_item_cd"));
					
					$selBtn.find('.sel_txt').attr('data-value',currObj.parent().attr("data-value"));
					$('.lyr_select').removeClass('on');
					$li.addClass('selected').siblings('li').removeClass('selected');
					
					showText($selBtn);
					
					tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
					toggleBt('show');
					scrollReest();
					
					// mobileYn : overpass.goods.js 에서 FO와 MO가 공통영역 이기 때문에 체크를 해준다.
					// 옵션명이 날짜캘린더는 PCWEB만 존재하여 구분할수 있는 파라미터가 필요하기 때문에 생성 
					elandmall.optLayerEvt.changeItem({
						param: { mobileYn:"Y" ,goods_no: goods_no, vir_vend_no: vir_vend_no, pkg_goods_yn:"Y", pkg_goods_no:$("#goods_no", scope_div).val(), jwFlag:jwFlag, low_vend_type_cd:low_vend_type_cd, deli_goods_divi_cd:deli_goods_divi_cd, styleCode : styleCode, carve_yn: carve_yn, jwNormalFlag:jwNormalFlag},
						div:scope_div,
						chgObj:$(obj),
						callback:function(result){
							
							var param = { goods_no: goods_no, vir_vend_no: vir_vend_no};
							param["curr_idx"] = opt_idx;
							var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
							var currVal = currObj.parent().attr("data-value");
							$("#last_item_no").val(currVal);
							$("#last_sap_item_cd").val(currObj.parent().attr("data-sap_item_cd"));
							
							
							if(low_vend_type_cd == "50" && deli_goods_divi_cd == "30"){
								var opt = scope_div.find("[id^=options_nm"+result.next_idx+"]");
								var next_cd = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_cd');
								
								if(next_cd == "" || typeof(next_cd) == "undefined" && field_recev_poss_yn == "Y" || typeof(next_cd) == "undefined" && present_yn == "Y" ){
									$("#dd_receive_choice").show();
								}else{
									
									if(last_yn == "Y" && currVal != ""){
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
													itemParam[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													itemParam[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
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
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
													$("#gift_slt", scope_div).data("itemInfo", param);
												}
											}else{	//사은품이 1개일 때,
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
													param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).val();
													param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data,
																gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).val(),
																gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
															});
														}
													});
												}
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
											if(jwFlag){
												param["GOODS_NM"] = $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg');
												param["vir_vend_no"] = vir_vend_no;
												param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
												param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
												
												elandmall.goodsDetail.jwGoodsAddParam({
													param:param,
												});
											}else{
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data
															});
														}
													});
													
												}else{
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
													$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
												}
											}
											
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										$("#dd_receive_choice").hide();
										if(last_yn == "Y" && currVal == ""){
											if($("#gift_slt", scope_div).length > 0){
												$("[id^=gift_slt]", scope_div).attr("data-value","");
												$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
												$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
												$("#gift_slt", scope_div).data("itemInfo", param);
											}else{
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
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
									if(last_yn == "Y" && currVal != ""){
										
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
													itemParam[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													itemParam[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
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
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
													$("#gift_slt", scope_div).data("itemInfo", param);
												}
											}else{	//사은품이 1개일 때,
												$("#dd_receive_choice").show();
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("#dd_receive_choice").show();
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										if(last_yn == "Y" && currVal == ""){
											if($("#gift_slt", scope_div).length > 0){
												$("[id^=gift_slt]", scope_div).attr("data-value","");
												$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
												$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
												$("#gift_slt", scope_div).data("itemInfo", param);
											}else{
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
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
									if(last_yn == "Y" && currVal != ""){
										//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
										if(low_vend_type_cd == "40" || low_vend_type_cd == "50"){
											param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
										}
										param["item_no"] = currVal;
										//사은품이 있다면
										if($("#giftInfo", scope_div).length > 0 ){ 
											if($("#giftInfo",scope_div).attr("data-multi_yn") == "Y"){	//사은품이 여러개일 때,
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													var itemParam = $("#pkgCmpsGoods", scope_div).data("itemInfo") != undefined ? $("#pkgCmpsGoods", scope_div).data("itemInfo") : {};
													
													itemParam["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													itemParam["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
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
													param["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
													param["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
													$("#gift_slt", scope_div).data("itemInfo", param);
													$("#dd_receive_choice").hide();
												}
											}else{	//사은품이 1개일 때,
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
												if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
													param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm");
													param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).val();
													param["gift_stock_qty"] = $("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty");
													$(scope_div).data("itemInfo", param);
													elandmall.optLayerEvt.getItemPrice({
														param:param,
														success:function(data){
															data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
															data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
															
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																quickview_yn:quickview_yn,
																data:data,
																gift_nm:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).val(),
																gift_stock_qty:$("[name=gift_goods_dtl_no]",$("#giftInfo",$("#detailform", scope_div))).data("stock_qty")
															});
														}
													});
												}
											}
										}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
											$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "Y");
											
											if(jwFlag){
												param["GOODS_NM"] = $("#dd_cmps_goods", scope_div).find('.sel_txt').attr('data-sel-msg');
												param["vir_vend_no"] = vir_vend_no;
												param["brandCode"] = $("#item_opt_li_data").attr('data-brand_cd');
												param["styleCode"] = $("#item_opt_li_data").attr('data-style_cd');
												
												elandmall.goodsDetail.jwGoodsAddParam({
													param:param,
												});
											}else{
												if(jwNormalFlag){
													$("#recev_slt", $("#detailform",scope_div)).remove();
														elandmall.optLayerEvt.getItemPrice({
															param:param,
															success:function(data){
																data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
																data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
																elandmall.goodsDetail.drawAddGoods({
																	type:"PKG",
																	quickview_yn:quickview_yn,
																	data:data
																});
															}
														});
												}else{
													
													if(elandmall.goodsDetail.checkPkgGoodsChoice(scope_div)){
														elandmall.optLayerEvt.getItemPrice({
															param:param,
															success:function(data){
																data[0]["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
																data[0]["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
																
																elandmall.goodsDetail.drawAddGoods({
																	type:"PKG",
																	quickview_yn:quickview_yn,
																	data:data
																});
															}
														});
														
													}else{
														param["disp_seq"] = $("#pkgCmpsGoods", scope_div).attr("data-disp_seq");
														param["vend_nm"] = $("#pkgCmpsGoods", scope_div).attr("data-vend_nm");
														$("#pkgCmpsGoods", scope_div).data("itemInfo", param);
													}
												}
											}
											
										}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									}else{
										if(last_yn == "Y" && currVal == ""){
											if($("#gift_slt", scope_div).length > 0){
												$("[id^=gift_slt]", scope_div).attr("data-value","");
												$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
												$("[id^=gift_slt]", scope_div).attr("data-sel-msg","");
												$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
												$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
												$("#gift_slt", scope_div).data("itemInfo", param);
												$("#dd_receive_choice").hide();
											}else{
												$("#pkgCmpsGoods", scope_div).attr("data-choice_yn", "N");
											}
										}else if(last_yn != "Y"){
											$("[id^=gift_slt]", scope_div).attr("data-value","");
											$("[id^=gift_slt]", scope_div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", scope_div).data("sel-msg","");
											$("[id^=gift_slt]", scope_div).parent().removeClass("selected");
											$("[id^=gift_slt]", scope_div).parents(".lyr_select").addClass("disabled");
											$("#gift_slt", scope_div).attr("data-itemInfo","");
											$("#dd_receive_choice").hide();
										}
									}
									
								}
								
							}	
							
							if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
								$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
								.on('touchstart focusin', function() {
									$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
								})
								.focusout(function() {
									$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
								});
								$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
									$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
								});
								
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
			},
			clickFltLayer:function(){
				//$('.opt_on_off_area').toggleClass('on');
				$('.goods_opt').show();		
				$('.goods_opt').animate({bottom : 0 }, 250);
				$('#btn_top, #btn_back').css('z-index',0);
				/* 170719 ios 구매하기 스크롤 활성화 fnGoodsOpt();*/
				if(elandmall.global.disp_mall_no == "0000053"){
                    dim_on(102);
                }
				setTimeout(function(){OrderScorller()}, 100);
				scroll_out();
				//scrpos = $(window).scrollTop();	//20160414 //NGCPO-7193 으로 주석 처리
				
				lyrMax();
				
				var layer_form = $("#quick_view_layer"); 
				if($("#bundle_detail.event_layer_pop > #quick_view_layer").length > 0){
					layer_form = $("#bundle_detail.event_layer_pop > #quick_view_layer"); //이벤트 레이어 존재 시 처리 
				}
				
				//NGCPO-6522
				if($("#previewLayer").is(":visible") == true){
					var goods_no = String($("#previewLayer").find("#previewUl li.active").data("goods_no"));
					var grp_seq = (typeof($("#previewLayer").find("#previewUl li.active").data("grp_seq")) != "undefined" && $("#previewLayer").find("#previewUl li.active").data("grp_seq") !=null)? $("#previewLayer").find("#previewUl li.active").data("grp_seq") : "";
					if(grp_seq != "" && grp_seq != null){
						$("#cmps_goods_grp"+grp_seq).val(String(goods_no));
						$("#cmps_goods_grp"+grp_seq).change();
					}else{	//묶음일 때,
						var optBtn = $("#pkgCmpsGoods").parent().parent().find('.ancor');
						if(optBtn.length > 0){
							elandmall.goodsDetail.initSelectsBox($(".goods_opt"));
							$("#pkgCmpsGoods").val(goods_no);
							$("#pkgCmpsGoods").change();
							
							$("[name=focusLspan]").removeClass("selected");
							$("[name=focusLspan]").find('.ancor').removeClass("pSel");
														
							$.each(optBtn, function() {
								if($(this).attr("data-value") == goods_no){
									
									$("#focusLspan_"+goods_no).addClass("selected");		
									$("#focusLspan_"+goods_no).find('.ancor').addClass("pSel");
								}
							});
							
							var $li = $("#pkgCmpsGoods").parent().parent().parent();
							
							//NGCPO-6522
							if($("#dl_pkgCmpsGoods #dd_cmps_goods .lyr_select").hasClass('on')){
								toggleBt('hide');
								goToSelect($li);
	
							} 
						}
					}

				}else if(layer_form.is(":visible") == true){
					var goods_no = String(layer_form.find("#previewUl li.active").data("goods_no"));
					var optBtn = $("#pkgCmpsGoods").parent().parent().find('.ancor');
					if(optBtn.length > 0){
						elandmall.goodsDetail.initSelectsBox($(".goods_opt"));
						$("#pkgCmpsGoods").val(goods_no);
						$("#pkgCmpsGoods").change();
					
						$("[name=focusLspan]").find('.ancor').removeClass("pSel");
						$("[name=focusLspan]").removeClass("selected");
						
						$.each(optBtn, function() {
							if($(this).attr("data-value") == goods_no){
								$("#focusLspan_"+goods_no).addClass("selected");
								$("#focusLspan_"+goods_no).find('.ancor').addClass("pSel");
							}
						});
						
						var $li = $("#pkgCmpsGoods").parent().parent().parent();
						
						//NGCPO-6522
						if($("#dl_pkgCmpsGoods #dd_cmps_goods .lyr_select").hasClass('on')){
							toggleBt('hide');
							goToSelect($li);

						} 
					}
				}else{
					if($("#dl_pkgCmpsGoods #dd_cmps_goods .lyr_select").hasClass('on')){
						$("[name=focusLspan]").find('.ancor').removeClass("pSel");
						$("[name=focusLspan]").removeClass("selected");
						toggleBt('hide');
						goToSelect($li);

					} 
				}
				
				if ( $("#bundle_detail").length > 0 ) {
					$("#bundle_dtl").css('padding-bottom','143px');
				}
				
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
			
	}
	
	
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
			if(elandmall.global.disp_mall_no == "0000053"){
				spCmn.linkTab();
			}
			
			var event_layer_yn = $.type(pin.event_layer_yn) != "undefined" ? pin.event_layer_yn : $("#event_layer_yn").val();
			var currScroll = $(window).scrollTop();
			
			if ($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) ){
				location.href="elandbridge://header/hide/";
			}
			
			if ( $("#bundle_detail").length > 0 ) {
				if(event_layer_yn == "Y") {
					$("#bundle_detail.event_layer_pop").remove();
					$("#bundle_detail").hide();
				}else{
				$("#bundle_detail").remove();
			} 
				
			} 
			var div = $("<div id=\"bundle_detail\" class=\"layer_bundle\"></div>");
			if(event_layer_yn == "Y"){
				div.addClass("event_layer_pop");
			}

			var p = {
					event_layer_yn : event_layer_yn,
					grp_no : pin.grp_no,
					sel_goods_no : pin.goods_no, 
					sel_vir_vend_no : pin.vir_vend_no, 
					vir_vend_no : pin.vir_vend_no,
					goods_no : $.type(pin.base_goods_no) != "undefined" &&  pin.base_goods_no != "" ? pin.base_goods_no : $("#goods_tab").data("goods_no"), 
					goods_cmps_divi_cd: $.type(pin.goods_cmps_divi_cd) != "undefined" ? pin.goods_cmps_divi_cd : (event_layer_yn == "Y" ? "" :  $("#goods_cmps_divi_cd").val())
				};

			//이벤트페이지 레이어보기 일때는 URL 변경
			var sUrl = "/goods/initGoodsDetailPreviewLayer.action";

			if(event_layer_yn == "Y") {
				sUrl = "/goods/initGoodsDetailEventLayer.action?";
				
				//추가 파라미터 설정
				p.event_key 		= pin.event_key;
				p.event_start_date	= pin.event_start_date;
				p.event_end_date	= pin.event_end_date;
				p.smsg				= pin.smsg;
				p.emsg				= pin.emsg;
			
				sUrl = sUrl + $.param(p);
				//p = null;
			}
			
			
			
			div.load(sUrl, p,  function(responseTxt, statusTxt, xhr) {
				if(statusTxt == "error"){
					return;
				}
				var scroll = $(window).scrollTop(); //NGCPO-7193
				$('body').append(div);
				$('#header').css('z-index', '1');
				$('#contents').css({ 'position': 'fixed', 'z-index': '2'});
				if($("div.bglay").length < 1 ){
					$("body").append("<div class='bglay'></div>");
				}
				
				$('#btn_back').css('z-index', '0');
				div.fadeIn(300); 
				div.find("li").addClass('active');
				
				if(p.event_layer_yn != "Y"){
					history.pushState({scroll : scroll},'',"#layerInfo");       // hashtag 추가 //NGCPO-7193
				}
				
				$(window).resize(function(){  //20160218
					$(".gd_bundle .next, .gd_bundle .prev").animate({'top': ($(window).height()/2)-20}, 300);
				});
				
				$(window).on("hashchange", function(){  // 뒤로가기 버튼 클릭시 제어위한 용도(hashtag 없어질시)
					close();
				});
				$('.layer_bundle .btn_close').click(function(){
					close();
					var ori_scroll = history.state.scroll;	//NGCPO-7193
					if(event_layer_yn != "Y") {
						history.back();
						setTimeout(function(){
	                        $('html,body').animate({scrollTop : ori_scroll}, 10);
	                    }, 50); //NGCPO-7193

					}
			    });
				function close(){

					if(event_layer_yn == "Y"){
						$('#bundle_detail.event_layer_pop').fadeOut(300);
						$("#bundle_detail").show();

						$("#bundle_detail.layer_detail").css('max-height', 'none');
						$("#bundle_detail.layer_detail").css('overflow', 'visible');
						$("#bundle_detail.event_layer_pop").css('max-height', 'none');
						$("#bundle_detail.event_layer_pop").css('overflow', 'visible');
						$(window).scrollTop(currScroll);
						
					}else{
					$('#header').css('z-index', '');
					$('#contents').css({ 'position': '', 'z-index': ''});
					$(".bglay").remove();
					$('#btn_back').css('z-index', '110');
					$('#bundle_detail').fadeOut(300);
					}

					if ($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) ){
						location.href="elandbridge://header/show/";
					}
				}
				
			});
			
			if(pin.pkgYn == "Y") {
				
				elandmall.goodsDetail.initSelectsBox($(".goods_opt")); 
				var goods_no = pin.goods_no;
				var grp_seq = pin.grp_seq;
				
				$("#pkgCmpsGoods").val(goods_no);
				$("#pkgCmpsGoods").change();
				
				$("[name=focusLspan]").removeClass("selected");
				$("[name=focusLspan]").find('.ancor').removeClass("pSel");
				
				var optBtn = $("#pkgCmpsGoods").parent().parent().find('.ancor');
				$.each(optBtn, function() {
					if($(this).attr("data-value") == goods_no){
						$("#focusLspan_"+goods_no).addClass("selected");
						$("#focusLspan_"+goods_no).find('.ancor').addClass("pSel");
					}
				});
				
				var $li = $("#pkgCmpsGoods").parent().parent().parent();
				
				//goToSelect($li); NGCPO-6522 제거
				
			}
		}
	}
	
	/**
	 * 사용방법
	 * 사이즈 비교하기 레이어 팝업
	 * elandmall.goodSizeCompareLayer({
	 * 			goods_no:			(상품번호)
	 * 			std_gsgr_no : 표준카테고리번호
	 * });
	 */
	elandmall.goodSizeCompareLayer = function(p) {
		if ( $("#sizecompare_layer").length>0 ){
			fn_layer_open("sizecompare_layer");
		}else{
			elandmall.layer.createLayer({
				layer_id:"sizecompare_layer",
				title: "이전 구매한 상품과 사이즈 비교하기",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/goods/searchGoodsSizeCompareLayer.action", p,  elandmall.goodSizeSetLayer(layer));
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
	
	elandmall.goodtDetailBottomTab = function(type) {
		
		var goodtDetailBottomTabEvalCallback = function(){
			if($("#bundle_detail.layer_bundle").css('display') == 'block'){
				$('#header').css('z-index', '');
				$('#contents').css({ 'position': '', 'z-index': ''});
				$(".bglay").remove();
				$('#btn_back').css('z-index', '110');
				$('#bundle_detail').fadeOut(300);
				
				var ori_scroll = history.state.scroll;	//NGCPO-7193
				
				history.back();
				setTimeout(function(){
	                $('html,body').animate({scrollTop : ori_scroll}, 10);
	            }, 50); //NGCPO-7193

			}  
			
			$("#evalCnt").click();
		}
		
		var goodtDetailBottomTabAnswCallback = function(){
			if($("#bundle_detail.layer_bundle").css('display') == 'block'){
				$('#header').css('z-index', '');
				$('#contents').css({ 'position': '', 'z-index': ''});
				$(".bglay").remove();
				$('#btn_back').css('z-index', '110');
				$('#bundle_detail').fadeOut(300);
				
				var ori_scroll = history.state.scroll;	//NGCPO-7193
				
				history.back();
				setTimeout(function(){
	                $('html,body').animate({scrollTop : ori_scroll}, 10);
	            }, 50); //NGCPO-7193

			} 
			
			$("#questCnt").click();
		}
		
		
		var param = {
			ori_goods_no : $("#detailtab_ori_goods_no").val(),
			goods_no : $("#detailtab_goods_no").val(),
			vir_vend_no : $("#detailtab_vir_vend_no").val(),
			fassion_yn : $("#detailtab_fassion_yn").val(),
			goods_type_dtl_cd : $("#detailtab_goods_type_dtl_cd").val(),
			pkg_yn : $("#detailtab_pkg_yn").val(),
			set_yn : $("#detailtab_set_yn").val(),
			filter_disp_ctg_no : $("#detailtab_filter_disp_ctg_no").val(),
			filter_use_yn : $("#detailtab_filter_use_yn").val()
		}	
			
		var _p = $.extend( elandmall.goodsDetailTab._pin, param);
		if ( _p.quest_goods_no != "" ){
			_p.goods_no = _p.quest_goods_no;
		}
		
		if(type=="eval"){
			elandmall.goodsDetailTab.fnEval.shoopen_fnLoadEval(_p, "#gcont1", goodtDetailBottomTabEvalCallback);
		}else if(type=="answ"){
			elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw(_p, "#answDiv");
			elandmall.goodsDetailTab.fnQuest.shoopen_fnLoadQuest(_p, "#questDiv", goodtDetailBottomTabAnswCallback);
			
			$("#answTab").addClass('on');
			$("#qnaTab").removeClass('on');
		}
	}
	
	//상품상세 탭 관련 스크립트
	elandmall.goodsDetailTab = {
		_pin : {
			eval_goods_no : "",
			eval_vir_vend_no : "",
			quest_goods_no : ""
		},
		// 상품평
		fnEval : {
			fnLoadEval : function( p , objNm, callback ){
				$(objNm).load("/goods/initGoodsEvalList.action", p, function(){
					if( $.type(callback) == "function"){ callback(); }
					
					_google_analytics();
					
					var goodsDetailTab = elandmall.goodsDetailTab;
					var $div = $(this);
					var pin = {
							obj : $div,	// 현재 객체
							ori_goods_no : $("#eval_ori_goods_no", $div).val(),
							goods_no : $("#goods_no", $div).val(),
							vir_vend_no : $("#vir_vend_no", $div).val(),
							eval_goods_all : $("#eval_goods_sel option:selected", $div).data("eval_goods_all")
						};
					
					// 묶음상품 상품 변환
					$("#eval_goods_sel", $div).change(function(){
						var param = $.extend(param , p);
						param.goods_no = $("#eval_goods_sel option:selected").data("goods_no");
						param.vir_vend_no = $("#eval_goods_sel option:selected").data("vir_vend_no");
						param.eval_goods_all = $("#eval_goods_sel option:selected", $div).data("eval_goods_all");
						
						elandmall.goodsDetailTab._pin.eval_goods_no = $("#eval_goods_sel option:selected").data("goods_no");
						elandmall.goodsDetailTab._pin.eval_vir_vend_no = $("#eval_goods_sel option:selected").data("vir_vend_no");
						goodsDetailTab.fnEval.fnLoadEval(param, objNm);
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

					// 탭선택
					$("[name=evalTab]", $div).click(function(){
						var tabObj = $(this);
						
						if ( tabObj.data("value") == "zero" ){
							var p = $.extend({idx : tabObj.data("idx")},  pin );
							goodsDetailTab.fnEval.fnLoadZeroEval( p );
						}else{
							var p = $.extend({val : tabObj.data("value"), idx : tabObj.data("idx"), photo_rv_slide_yn : tabObj.data("photo_rv_slide_yn")},  pin );
							goodsDetailTab.fnEval.fnSearchEval(p);
						}
					});
					
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, #gcont1').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
					}
					
					
					// 작성하기 버튼 이벤트
					$("#goodsEvalIns",$div).click(function(){
						var eval_goods_no = $("#eval_goods_no", $div).val();
						var addGoodsEval = function(){
							isLoginCheckAjax();
							$.ajax({
								url: "/content/getGoodsEvalCount.action",
								data: {goods_no : eval_goods_no},
								type: "POST",
								dataType: "json",
								success: function(data) {
									if ( data != null ){
										var data = data.results;
										if ( data.GOODS_EVAL_NO != "" ){
											if ( !confirm("이전에 등록하신 상품평이 있습니다. \n등록하신 상품평을 수정하시겠습니까 ?") ){
												return false;
											}
											var p = {
													ord_no : data.ORD_NO,
													ord_dtl_no : data.ORD_DTL_NO,
													goods_eval_no : data.GOODS_EVAL_NO
											}
											goodsDetailTab.fnEval.evalEditPage(p);
										}else if ( data.CNT > 1 ){
											if ( !confirm("작성 가능한 동일한 상품이 "+data.CNT+"개 있습니다. \n마이페이지 나의 상품평 에서 상품목록을 확인하시고 작성해 주세요") ){
												return false;	
											}
											location.href = elandmall.util.https("/mypage/initMyEvalList.action");
										}else if ( data.CNT > 0 ){
											var p = {
													ord_no : data.ORD_NO,
													ord_dtl_no : data.ORD_DTL_NO
											}
											goodsDetailTab.fnEval.evalInsPage(p);
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
				});
			},
			//리뷰(슈펜)
			shoopen_fnLoadEval : function( p , objNm, callback){
				$(objNm).load("/goods/initGoodsEvalList.action", p, function(){
					if( $.type(callback) == "function"){ callback(); }
					
					_google_analytics();
					
					var goodsDetailTab = elandmall.goodsDetailTab;
					var $div = $(this);
					var pin = {
							obj : $div,	// 현재 객체
							ori_goods_no : $("#eval_ori_goods_no", $div).val(),
							goods_no : $("#goods_no", $div).val(),
							vir_vend_no : $("#vir_vend_no", $div).val(),
							eval_goods_all : $("#eval_goods_sel option:selected", $div).data("eval_goods_all")
						};
					
					// 묶음상품 상품 변환
					$("#eval_goods_sel", $div).change(function(){
						var param = $.extend(param , p);
						param.goods_no = $("#eval_goods_sel option:selected").data("goods_no");
						param.vir_vend_no = $("#eval_goods_sel option:selected").data("vir_vend_no");
						param.eval_goods_all = $("#eval_goods_sel option:selected", $div).data("eval_goods_all");
						
						elandmall.goodsDetailTab._pin.eval_goods_no = $("#eval_goods_sel option:selected").data("goods_no");
						elandmall.goodsDetailTab._pin.eval_vir_vend_no = $("#eval_goods_sel option:selected").data("vir_vend_no");
						goodsDetailTab.fnEval.fnLoadEval(param, objNm);
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

					// 탭선택
					$("[name=evalTab]", $div).click(function(){
						var tabObj = $(this);
						
						if ( tabObj.data("value") == "zero" ){
							var p = $.extend({idx : tabObj.data("idx")},  pin );
							goodsDetailTab.fnEval.fnLoadZeroEval( p );
						}else{
							var p = $.extend({val : tabObj.data("value"), idx : tabObj.data("idx"), photo_rv_slide_yn : tabObj.data("photo_rv_slide_yn")},  pin );
							goodsDetailTab.fnEval.fnSearchEval(p);
						}
					});
					
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, #gcont1').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
					}
					
					
					// 작성하기 버튼 이벤트
					$("#goodsEvalIns",$div).click(function(){
						var eval_goods_no = $("#eval_goods_no", $div).val();
						var dupChk = false;
						var addGoodsEval = function(){
							$.ajax({
								url: "/content/getGoodsEvalCount.action",
								data: {goods_no : eval_goods_no},
								type: "POST",
								dataType: "json",
								success: function(data) {
									if ( data != null ){
										var data = data.results;
										if ( data.GOODS_EVAL_NO != "" ){
											if ( !confirm("이전에 등록하신 리뷰/댓글이 있습니다. \n등록하신 리뷰/댓글을 수정하시겠습니까 ?") ){
												return false;
											}
											var p = {
													ord_no : data.ORD_NO,
													ord_dtl_no : data.ORD_DTL_NO,
													goods_eval_no : data.GOODS_EVAL_NO
											}
											goodsDetailTab.fnEval.evalEditPage(p);
										}else if ( data.CNT > 1 ){
											if ( !confirm("작성 가능한 동일한 상품이 "+data.CNT+"개 있습니다. \n마이페이지 리뷰/댓글 에서 상품목록을 확인하시고 작성해 주세요") ){
												return false;	
											}
											location.href = elandmall.util.https("/mypage/initMyEvalList.action");
										}else if ( data.CNT > 0 ){
											var p = {
													ord_no : data.ORD_NO,
													ord_dtl_no : data.ORD_DTL_NO
											}
											goodsDetailTab.fnEval.evalInsPage(p);
										}
									}
								},
								error: function(e){
									if(dupChk){
										return false;
									}
									if ( !confirm("구매한 이력이 없습니다. \n마이페이지 구매목록을 확인하시겠습니까?" )){
										dupChk = true;
										return false;	
									} 
									elandmall.mypage.link.orderDeli();
									dupChk = true;
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
				});
			},
			//옵션변경 검색
			fnEvalOptChange : function(obj){
				var cont = $(obj).parents("[id^=gcont]");
				var pin = {
						obj : cont,
						goods_no : cont.find("#goods_no").val(),
						vir_vend_no : cont.find("#vir_vend_no").val(),
						eval_goods_all : $("#eval_goods_sel option:selected", cont).data("eval_goods_all")
				}
				
				var p = $.extend(p , pin, {sch_opt : $(obj).val()});
				elandmall.goodsDetailTab.fnEval.fnSearchEval(p);
			},
			//우선순위변경 검색
			fnEvalSchGbChange : function(obj){
				var cont = $(obj).parents("[id^=gcont]");
				var pin = {
						obj : cont,
						goods_no : cont.find("#goods_no").val(),
						vir_vend_no : cont.find("#vir_vend_no").val()
				}
				
				var p = $.extend(p , pin);
				if(typeof($("#sch_opt")) != "undefined"){
					p = $.extend(p, {sch_opt : $("#sch_opt").val()});
				}
				elandmall.goodsDetailTab.fnEval.fnSearchEval(p);
			},			
			//기대평삭제
			fnZeroDelete : function( p , obj ){
				if(confirm("작성하신 기대평을 삭제하시겠습니까?")){
					$.ajax({
						url: "/eventshop/deleteExpectEval.action",
						data: p,
						type: "POST",
						success: function(data) {
							var div = $(obj).parents("div[id^=goods]");
							var idx = $("#tabUl li.on", div).data("idx");
							var pin = $.extend({idx:idx}, p);
							elandmall.goodsDetailTab.fnEval.fnLoadZeroEval( pin );	// 확인필요
						},error:function(e){
							alert("기대평 삭제중 오류가 발생하였습니다.");
						}
					});
				}
			},
			// 상품평 검색
		    fnSearchEval : function( p ){
				var p = $.extend(elandmall.goodsDetailTab.fnTabResult( p ) , p);
				p = $.extend({filter_yn:"",flt_dtl_no_list : $("#flt_dtl_no_list").val()},p);
				if(elandmall.global.disp_mall_no == "0000053"){
					p.idx = 0;
				}
				var goods_no_list = new Array();
				//검색 우선순위 값 설정
				if(typeof($("#sch_gb","#rcont"+p.idx)) != "undefined"){
					p = $.extend({sch_gb : $("#sch_gb").val(), photo_rv_slide_yn : $("#sch_gb", "#rcont"+p.idx).data("photo_rv_slide_yn"),idx : $("li[name='evalTab'].on").attr("data-idx")} ,p);
				}
				
				if($.type(p.val) != "undefined" && p.val == "photo") {
					p.cust_rows_per_page = 10;
				}
				
				var idx = 0;
				$.each( $("#eval_goods_sel option"), function(i){ 
					if($(this).data("goods_no") != ''){
						goods_no_list[idx] = $(this).data("goods_no");
						idx++;
					}
				});
				if ( goods_no_list.length > 0 ){
					p.goods_no_list = goods_no_list;
				}
		
			    var div = $("#rcont"+p.idx).load("/goods/searchGoodsEvalBody.action", p, function(){
					if(elandmall.global.disp_mall_no != "0000053"){
						elandmall.goodsDetailTab.fnEval.fnEvalTabCntSet(div, p.idx);
					}
		    		
		    		if(p.filter_yn  == "Y"){
		    			
		    			layer_fix_close("pop_eval_filter_list");
		    		} 
		    		
		    		sm_square_lineup('.rv_list .rv_thumb li');
		    		sm_square_lineup('.rv_photo li');
		    	
		    		
			    });
			},
			//기대평 검색
			fnLoadZeroEval : function( p ){
				var goods_no_list = new Array();
				$.each( $("#eval_goods_sel option"), function(i){ 
					goods_no_list[i] = $(this).data("goods_no");
				});
				if ( goods_no_list.length > 0 ){
					p.goods_no_list = goods_no_list;
				}
				
				var idx = $("#tabUl",p.obj).find("li:last-child").data("idx");
				$("#rcont"+idx).load("/goods/searchDetailExpectEvalList.action", p, function(){
					if(elandmall.global.disp_mall_no != "0000053"){
						elandmall.goodsDetailTab.fnEval.fnEvalTabCntSet(div, p.idx);
					}
				});
			},
			// 상품평 탭 세팅
			fnEvalTabCntSet : function( obj, idx ){
				fnTab($("#goods_rv").data("tab_cnt"), 'rtab', idx, 'rcont');
				
				var tot = 0;
	        	var best = 0;
	        	var photo = 0;
	        	var zero = 0;
	        	
	        	if ( $("#total_cnt", obj).length > 0 ){
	        		tot=$("#total_cnt", obj).val();
	        	}
	        	if ( $("#best_cnt", obj).length > 0 ){
	        		best=$("#best_cnt", obj).val();
	        	}
	        	if ( $("#photo_cnt", obj).length > 0 ){
	        		photo=$("#photo_cnt", obj).val();
	        	}
	        	if ( $("#zero_cnt", obj).length > 0 ){
	        		zero=$("#zero_cnt", obj).val();
	        	}

	        	$("#totEvnlCnt").text("("+tot+")");
	        	$("#bestEvnlCnt").text("("+best+")");
	        	$("#photoEvnlCnt").text("("+photo+")");
	        	$("#zerpCnt").text("("+zero+")");
	        	$("#evalCnt").text("("+$("#eval", obj).val()+")");
        		$("#questCnt").text("("+$("#quest", obj).val()+")");
			},
			
			// 포토상품평 상세보기
			fnPhotoEvalDtl : function( goodsEvalNo, chk ){
				if(chk == "dtl") {
					$('#lyr_photo_review .pop_con').load('/goods/searchGoodsPhotoEvalDtl.action?goods_eval_no='+goodsEvalNo+' .review_wrap', function() {
						set_review_lyr_bn();
						$('#review_lyr_bn .swiper-slide').each(function(){
							var rvBtn = $(this);
							$(this).find('img').load(function() {
								rectangle_lineup(rvBtn);
						    });
						});
					});
				} else {
					$("#photoReviewDtl").remove();
				    var div_photo_dtl = $("<div id='photoReviewDtl'></div>");
				    div_photo_dtl.appendTo('body');

					$('#photoReviewDtl').load('/goods/searchGoodsPhotoEvalDtl.action?goods_eval_no='+goodsEvalNo, function() {
						fn_layer_open("lyr_photo_review");
						set_review_lyr_bn();
						$('#review_lyr_bn .swiper-slide').each(function(){
							var rvBtn = $(this);
							$(this).find('img').load(function() {
								rectangle_lineup(rvBtn);
						    });
						});
					});
				}
			},
			
			// 포토상품평 레이어 닫기
			photoLayerClose : function( layerNm ){
				if ( $("#bundle_detail").length > 0 ) {
					layer_fix_close2(layerNm);
					$('body').css({	'height' : '',	'position' : '','z-index' : ''}) ;
					//$("html,body").scrollTop(scrpos); //NGCPO-7193 으로 주석 처리
				} else {
					fn_layer_close(layerNm);
				}
			},
			
			fnGoPhotoEval : function(){
				var param = {
					ori_goods_no : $("#eval_ori_goods_no").val(),
					goods_no : $("#goods_no").val(),
					vir_vend_no : $("#vir_vend_no").val(),
					eval_goods_all : $("#eval_goods_sel option:selected").data("eval_goods_all"),
					val : "photo",
					idx : $("li[name='evalTab'].on").attr("data-idx"),
					photo_rv_slide_yn : "Y"
				};
				elandmall.goodsDetailTab.fnEval.fnSearchEval(param);
			},
		
			// 도움버튼 클릭
			fnRecomm : function( obj, flag ){
				var btnObj = $(obj); 
				var gubunYn = (typeof(flag) != "undefined" && flag == "Y") ? "Y" : "N";
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
									var liObj = btnObj.parent().parent();
		
									if(del_yn == "Y") {
										btnObj.removeClass("on");
									}else{
										btnObj.addClass("on");
									}
									
									//NGCPO-6950 포토리뷰 개선 
									//if(gubunYn != "Y"){
										if (data.recomm_cnt > 0 ){
											liObj.find("#recomm_div").show();
										}else{
											liObj.find("#recomm_div").hide();
										}
									//}
									$("#recomm_cnt", liObj).text(data.recomm_cnt);
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
				elandmall.isLogin({login:fnRecomm});
			},
			
			/**
			 * 상품평 작성
			 *  {ord_no : 주문번호, ord_dtl_no : 주문상세번호, atypical_shop_no : 이벤트 매장번호}
			 */
			evalInsPage : function(p){
				p.gb = 'I';	// 등록
				elandmall.mypage.goPage("/content/initGoodsEvalIns.action", p);
			},
			/**
			 * 상품평 수정
			 *  {ord_no : 주문번호, ord_dtl_no : 주문상세번호, atypical_shop_no : 이벤트 매장번호, goods_eval_no: 상품평번호, callback: 콜백URL}
			 */
			evalEditPage : function( p ){
				elandmall.mypage.goPage("/content/initGoodsEvalEdit.action", p);
			}
		},
		// 상품문의
		fnQuest : {
			fnLoadQuest : function( p , objNm, callback ){
				$(objNm).load("/goods/initGoodsQuest.action", p, function(){
					if( $.type(callback) == "function"){ callback(); }
					_google_analytics();
					
					var goodsDetailTab = elandmall.goodsDetailTab;
					var $div = $(this);
					var pin = {
								obj : $div,
								goods_no : $("#goods_no", $div).val(),
			    				answer_yn : "N"
		    				};	 // 현재 객체
					
					// tab Select
					$("[name=questTab]",$div).click(function(){
						var tabObj = $(this);
						var p = $.extend(p, pin, elandmall.goodsDetailTab.fnTabResult( { val : tabObj.data("value")}));
						goodsDetailTab.fnQuest.fnSearchQuest(p, tabObj.data("idx"));
					});
					
					// 묶음상품 변환
					$("#quest_goods_sel",$div).change(function(){
						var param = $.extend(param , p);
						param.goods_no = $("#quest_goods_sel option:selected").data("goods_no");
						param.vir_vend_no = $("#quest_goods_sel option:selected").data("vir_vend_no");
						elandmall.goodsDetailTab._pin.quest_goods_no = $("#quest_goods_sel option:selected").data("goods_no");
						goodsDetailTab.fnQuest.fnLoadQuest(param, objNm);
					});
					
					// QusetInsert
					$("#questIns",$div).click(function(){
						var fn = function(){
							isLoginCheckAjax();
							var p = {
									goods_no: $("#ori_goods_no", $div).val(),
									sel_goods_no : $("#goods_no", $div).val(),
									vir_vend_no : $("#vir_vend_no", $div).val(),
									pkg_yn : $("#pkg_yn", $div).val(),
									gb : "I"
							}
							p = $.extend(p, elandmall.goodsDetailTab.fnTabResult());
							
							elandmall.goodDetailQuestLayer( p );	
						}
						if ( !elandmall.loginCheck() ){
							if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
								return false;
							}
						}
						elandmall.isLogin({login:fn});
					});
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, #gcont2').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
					}
				});
			},
			
			//상품문의(슈펜)
			shoopen_fnLoadQuest : function( p , objNm, callback){
				$(objNm).load("/goods/initGoodsQuest.action", p, function(){
					if( $.type(callback) == "function"){ callback(); }
					_google_analytics();
					
					var goodsDetailTab = elandmall.goodsDetailTab;
					var $div = $(this);
					var pin = {
								obj : $div,
								goods_no : $("#goods_no", $div).val(),
			    				answer_yn : "N"
		    				};	 // 현재 객체
					
					// tab Select
					$("[name=questTab]",$div).click(function(){
						var tabObj = $(this);
						var p = $.extend(p, pin, elandmall.goodsDetailTab.fnTabResult( { val : tabObj.data("value")}));
						goodsDetailTab.fnQuest.fnSearchQuest(p, tabObj.data("idx"));
					});
					
					// 묶음상품 변환
					$("#quest_goods_sel",$div).change(function(){
						var param = $.extend(param , p);
						param.goods_no = $("#quest_goods_sel option:selected").data("goods_no");
						param.vir_vend_no = $("#quest_goods_sel option:selected").data("vir_vend_no");
						elandmall.goodsDetailTab._pin.quest_goods_no = $("#quest_goods_sel option:selected").data("goods_no");
						goodsDetailTab.fnQuest.fnLoadQuest(param, objNm);
					});
					
					// QusetInsert
					$("#questIns",$div).click(function(){
						var fn = function(){
							isLoginCheckAjax();
							var p = {
									goods_no: $("#ori_goods_no", $div).val(),
									sel_goods_no : $("#goods_no", $div).val(),
									vir_vend_no : $("#vir_vend_no", $div).val(),
									pkg_yn : $("#pkg_yn", $div).val(),
									gb : "I"
							}
							p = $.extend(p, elandmall.goodsDetailTab.fnTabResult());
							
							elandmall.goodDetailQuestLayer( p );	
						}
						if ( !elandmall.loginCheck() ){
							if ( !confirm("로그인 하신 고객만 작성 가능 합니다. \n로그인 하시겠습니까?") ){
								return false;
							}
						}
						elandmall.isLogin({login:fn});
					});
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('.goods_wrap, #gcont2').find($('input[type="text"], textarea, select'))
						.on('touchstart focusin', function() {
							$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
						})
						.focusout(function() {
							$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
						});
					}
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
									goods_no: $("#goods_no", $div).val(),
									//sel_goods_no : $("#goods_no", $div).val(),
									vir_vend_no : $("#vir_vend_no", $div).val(),
									pkg_yn : $("#pkg_yn", $div).val(),
							}
							p = $.extend(p, elandmall.goodsDetailTab.fnTabResult());
							/*if(elandmall.global.disp_mall_no == "0000053"){
								idx = 0;
							}*/
							if(myQNAYn=="Y"){
								p = $.extend(p, {myQNAYn:myQNAYn});
							}
							goodsDetailTab.fnQuest.fnSearchQuest(p, 0);
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
				});
			},
			
			//상품문의 삭제
			fnGoodsQanDelete : function( obj, counsel_no, counsel_stat_cd ){
				var div = $(obj).parents("div[id^=goods]");
				var idx = $("[name=questTab]li.on", div).data("idx");
				if(elandmall.global.disp_mall_no == "0000053"){
					idx = 0;
				}
				var divObj = $("#qcont"+idx);
				var contObj = divObj.parents("[id^=gcont]");
				if(confirm("등록하신 상품 Q&A를 삭제하시겠습니까?")){
					$.ajax({
						url: "/goods/deleteGoodsQuest.action",
						data: {counsel_no : counsel_no, v_counsel_stat_cd : counsel_stat_cd},
						type: "POST",
						success: function(data) {
							alert("삭제 되었습니다.");
							
							// tab 출력용 전체 갯수 처리 
							var qtotCnt = $('#quest_cnt_all').val();
							$('#quest_cnt_all').val(Number(qtotCnt)-1);
							
							elandmall.goodsDetailTab.fnQuest.fnSearchQuest({goods_no:$("#goods_no", contObj).val()}, idx);
						}
					});
				}
			},
			//상품문의 수정
			fnGoodsQanEdit : function( obj, counsel_no ){
				/*var div = $(obj).parents("div[id^=goods]");
				var idx = $("[name=questTab]li.on", div).data("idx");
				var divObj = $("#qcont"+idx);
				var contObj = divObj.parents("[id^=gcont]");*/
				var p = {
						counsel_no : counsel_no,
						gb : "I"
				}
				
				elandmall.goodDetailQuestLayer( p );	
			},
			// QnA 검색
			fnSearchQuest : function( p, idx ){
				var goods_no_list = new Array();
				$.each( $("#quest_goods_sel option"), function(i){ 
					goods_no_list[i] = $(this).data("goods_no");
				});
				if ( goods_no_list.length > 0 ){
					p.goods_no_list = goods_no_list;
				}
				
		    	$("#qcont"+idx).load("/goods/searchGoodsQuestBody.action", p, function(){
					if(elandmall.global.disp_mall_no != "0000053"){
						elandmall.goodsDetailTab.fnQuest.fnQuestTabCntSet(p.obj, idx);
					}
		        });
		    },
		    // QnA 탭 세팅
			fnQuestTabCntSet : function( obj, idx ){
				fnTab(2, 'qtab', idx, 'qcont');
	    		
	        	var tot = 0;
	        	var ans = 0;
	        	
	        	var qcontTxt = "#qcont" + idx;
	        	
	        	if ( $(qcontTxt + " > " + "#total_cnt", obj).length > 0 ) {
	        		tot=$(qcontTxt + " > " + "#total_cnt", obj).val()
	        	}
	        	if ( $(qcontTxt + " > " +"#ans_cnt", obj).length > 0 ) {
	        		ans=$(qcontTxt + " > " +"#ans_cnt", obj).val()
	        	}
	        	
	        	$("#totQusetCnt").text("("+tot+")");
	        	$("#totQusetAswCnt").text("("+ans+")");
	        	$("#evalCnt").text("("+$(qcontTxt + " > " +"#eval", obj).val()+")");
        		$("#questCnt").text("("+$("#quest_cnt_all").val()+")");
			}
		    
		},
		//댓글
		fnAnsw : {
			fnLoadAnsw : function(p, objNm){
				$(objNm).load("/goods/initGoodsAnswList.action", p);
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
					var goods_no = $("#answ_goods_no").val();
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
									elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw({goods_no:goods_no}, "#answDiv");
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
				var goods_no = $("#answ_goods_no").val();
				if(confirm("댓글을 삭제하시겠습니까?")){
					
					$.ajax({
						url: "/goods/deleteGoodsAnsw.action",
						data: {goods_eval_no:goods_eval_no,goods_no:goods_no},
						type: "POST",
						success: function(data) {
							alert("삭제 되었습니다.");
							elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw({goods_no:goods_no}, "#answDiv");
						}, error : function( e ){
							alert("삭제 중 오류가 발생하였습니다.");
						}
					});
				}
			},
			//댓글 수정
			fnGoodsAnswUpdate : function(title, goods_eval_no, obj){
				var id = typeof $(obj).parent().parent().find('textarea').attr('id') != "undefined" ? $(obj).parent().parent().find('textarea').attr('id') : "";
				var goods_no = $("#answ_goods_no").val();
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
								elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw({goods_no:goods_no}, "#answDiv");
							}, error : function( e ){
								alert("수정 중 오류가 발생하였습니다.");
							}
						});
					}
				}
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
						goods_no = $("#answ_goods_no").val();
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
										var eval_goods_no = $("#goods_tab").data("goods_no");
										elandmall.goodsDetailTab.fnEval.shoopen_fnLoadEval({goods_no:eval_goods_no}, "#gcont1");
										$('#gtab1').click();
									}else if(type=="answ"){
										elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw({goods_no:goods_no}, "#answDiv");
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
					goods_no = $("#answ_goods_no").val();
				}
				if(confirm("답글을 삭제하시겠습니까?")){
					
					$.ajax({
						url: "/goods/deleteGoodsReply.action",
						data: {goods_eval_no:goods_eval_no, answ_eval_seq:answ_eval_seq, use_yn:"N"},
						type: "POST",
						success: function(data) {
							alert("삭제 되었습니다.");
							if(type=="eval"){
								var eval_goods_no = $("#goods_tab").data("goods_no");
								//elandmall.goodsDetailTab.fnEval.shoopen_fnLoadEval({goods_no:eval_goods_no}, "#gcont1");
								$('#gtab1').click();
							}else if(type=="answ"){
								elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw({goods_no:goods_no}, "#answDiv");
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
					goods_no = $("#answ_goods_no").val();
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
									var eval_goods_no = $("#goods_tab").data("goods_no");
									//elandmall.goodsDetailTab.fnEval.shoopen_fnLoadEval({goods_no:eval_goods_no}, "#gcont1");
									$('#gtab1').click();
								}else if(type=="answ"){
									elandmall.goodsDetailTab.fnAnsw.fnLoadAnsw({goods_no:goods_no}, "#answDiv");
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
					if ( btnObj.hasClass("on") ){
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
										btnObj.removeClass("on");
									}else{
										btnObj.addClass("on");
									}
									
									return false;
								}else{
									var liObj = btnObj.parent().parent();
		
									if(del_yn == "Y") {
										btnObj.removeClass("on");
									}else{
										btnObj.addClass("on");
									}
									
									//NGCPO-6950 포토리뷰 개선 
									//if(gubunYn != "Y"){
										if (data.recomm_cnt > 0 ){
											liObj.find("#recomm_div").show();
										}else{
											liObj.find("#recomm_div").hide();
										}
									//}
									$("#answ_recomm_cnt", liObj).text(data.recomm_cnt);
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
				elandmall.isLogin({login:fnRecomm});
			}
		},
		// 더보기
		fnMoreViewBtn : function( obj ){
			var div = $(obj).parents("div[id^=goods]");
			var idx = $("#tabUl li.on", div).data("idx");
			if(elandmall.global.disp_mall_no == "0000053"){
				idx = 0;
			}
			var gb = div.data("gb");
			var cont = div.parents("[id^=gcont]");
			var url = "";
			var divObj = $("#"+gb+idx);
			var page_idx = 1;
			
			var pin = {
					obj : cont,
					ori_goods_no : cont.find("#eval_ori_goods_no").val(),
					goods_no : cont.find("#goods_no").val(),
					vir_vend_no : cont.find("#vir_vend_no").val(),
					sch_gb : $("#sch_gb").val()
			}
			
			if($("#myQNA").prop("checked")){
				pin = $.extend(pin, {myQNAYn:"Y"});
			}
			
			if ( gb == "rcont"){
				// 기대평
				var zero_value = $("#tabUl", cont).find("li:last-child").data("value");
                if ( zero_value == "zero"){
					url = "/goods/searchDetailExpectEvalBody.action";
				}else{
					pin = $.extend( pin, {sch_opt : $("#sch_opt",divObj).val()}, elandmall.goodsDetailTab.fnTabResult( pin ));
					pin.eval_goods_all = $("#eval_goods_sel option:selected", cont).data("eval_goods_all");
					
					var goods_no_list = new Array();
					var idx = 0;
					$.each( $("#eval_goods_sel option"), function(i){
						if($(this).data("goods_no") != ''){
							goods_no_list[idx] = $(this).data("goods_no");
							idx++;
						}
					});
					if ( goods_no_list.length > 0 ){
						pin.goods_no_list = goods_no_list;
					}
					
					url = "/goods/searchGoodsEvalListBody.action";
				}
			}else if ( gb == "acont"){
				divObj = $("#goods_an");
				pin = $.extend( pin, elandmall.goodsDetailTab.fnTabResult( pin ));
				url = "/goods/searchGoodsAnswBody.action";	
			}else{
				pin = $.extend( pin, elandmall.goodsDetailTab.fnTabResult( pin ));
				url = "/goods/searchGoodsQuestListBody.action";	
			}
			page_idx = +$("#page_idx", divObj).val();
			pin = $.extend( pin, {page_idx : page_idx+1});
			
			$.ajax({
				url: url,
				data: pin,
				type: "POST",
				dataType: "text",
				async : true,
				success: function(data) {
					$("#page_idx", divObj).val( pin.page_idx );
					
                    var currentScroll = $(document).scrollTop();
					
					$("#list", divObj).append(data);
					
					$(window).scrollTop(currentScroll);
					
					var liCnt = 0;
					
					liCnt = $("#list > li", divObj).length;
					
					$("#currentCnt", divObj).text( liCnt );
					if ( $("#list", divObj).data("page_tot_cnt") <= liCnt ){
						$("#more_view_btn", divObj).remove();
					}
					
					if ( gb == "rcont"){
						sm_square_lineup('.rv_list .rv_thumb li');
					}
				}
			});
		},
	    
		fnTabResult : function( p ){
			var pin = $.extend(pin , p || {});
			var val = pin.val;
			
			// TAB 선택의 값을 넘김 , 상품평 : { "", best, photo } 상품문의 { "", Y }
			if ( val == undefined ){
				val = $("#tabUl li.on", pin.obj).data("value");
			}
			if ( pin.idx == undefined ){
				pin.idx = $("#tabUl li.on", pin.obj).data("idx");
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
		            	}else {
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
		        	setTimeout(function(){}, 500); // take a sleep.
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

					if(p.event_layer_yn == "Y"){
						NetFunnel_Action(  {action_id: p.action_id},
								{	 success:function(ev,ret){ //성공
										elandmall.cart.addCartEventMobile(p);	
									 },stop:function(ev,ret){  //중지
									
									 },block : function(ev,ret){
										 if($("#bundle_detail").length > 0){
											 $("#bundle_detail button.layer_back").click();
											 $("body").css("overflow-y","");
										 }
									 },error:function(ev,ret){ //오류
											 elandmall.outputSeverLog({msg:"ERROR [netfunnel] - click2Shortcut || msg : " + ret.data.msg});
											 alert("죄송합니다.대기열 호출 중 오류가 발생했습니다.");
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
			
			if ( $("#bundle_detail").length > 0 ) {
				elandmall.layer.createLayerForLayer({
					title: "재입고 알림",
					layer_id: "reware_layer",
					class_name:"layer_fix ship",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/goods/initStockNotiMbrLayer.action", p,  function() {
							var first_param = {
									goods_no:p.goods_no,
									item_no:p.item_no,
									low_vend_type_cd:$("#low_vend_type_cd").val(),
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
														/*$(next_slt).val(pre_item_val);
													div.find("#item_opt_nm"+result.next_idx).change();*/
														next_slt.attr("disabled",false);
														next_slt.val(pre_item_val);
														next_slt.change();
														if($(next_slt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
															$("#opt_box").data("init_yn","Y");
														}
													}
												},
												callback:function(result){
													
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
											//opt.val(pre_item_val);
											//opt.change();
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
							}else{
								layer.show();
							}
						});
					}
				});
				
			}else{
				elandmall.layer.createLayer({
					title: "재입고 알림",
					layer_id: "reware_layer",
					class_name:"layer_fix ship",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/goods/initStockNotiMbrLayer.action", p,  function() {
							var first_param = {
									goods_no:p.goods_no,
									item_no:p.item_no,
									low_vend_type_cd:$("#low_vend_type_cd").val(),
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
														/*$(next_slt).val(pre_item_val);
													div.find("#item_opt_nm"+result.next_idx).change();*/
														next_slt.attr("disabled",false);
														next_slt.val(pre_item_val);
														next_slt.change();
														if($(next_slt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
															$("#opt_box").data("init_yn","Y");
														}
													}
												},
												callback:function(result){
													
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
							}else{
								layer.show();
							}
						});
					}
				});
			}
		}

		if ( !elandmall.loginCheck() ){
			if ( !confirm("로그인 하신 고객만 신청 가능 합니다. \n로그인 하시겠습니까?") ){
				return false;
			}
		}
		elandmall.isLogin({login:fn});
	}
	
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
            	var startDate = new Date(pin.startDate);
        		var endDate = new Date(pin.endDate);
            	var currentDt = new Date(result.data);
        		
            	var vDate = new Date(pin.countDt); 
        		var second = 1000; 
        		var minute = second * 60; 
        		var hour = minute * 60; 
        		var day = hour * 24; 
        		var timer; 
        		
        		var sum;
				var total_interval;
				var bar_seconds;
				
				if(pin.preComing_yn == "Y"){ //커밍순일 때
        			sum = endDate - startDate;
        			total_interval = Math.floor(sum / 1000);
        		}

        		function showRemaining() {
        			var now = currentDt; 
        			var distDt = vDate - now; 
        			var html = "";
        			
        			var days = Math.floor(distDt / day); 
        			var hours = Math.floor((distDt % day) / hour); 
        			var minutes = Math.floor((distDt % hour) / minute); 
        			var seconds = Math.floor((distDt % minute) / second); 
        			
        			if (distDt < 0) {
        				if(pin.preComing_yn == "N"){ //커밍순일 때
        					$(".flag_pre_coming").remove();
        					$(".coming_count").remove();
        					$(".coming").remove();
        					$(".buy").show();
        					$(".goods_rsv").show();
        				}else if(pin.preComing_yn == "Y"){ // 프리오더 일 때
        					$(".remaining").hide();
    						$(".buy").text('해당 상품은 마감되었습니다.');
    						$(".buy").addClass('out');
    						$(".buy").attr('onclick', "");
        				}
        				clearInterval(timer); 
        				return; 
        			} 
        			
        			if(pin.preComing_yn == "N"){ //커밍순일 때
        				html += "<em>" +fnfirstZero(days)+"</em>일 <em>"+fnfirstZero(hours)+"</em>:<em>"+fnfirstZero(minutes)+"</em>:<em>"+fnfirstZero(seconds)+"</em>";
        			}else if(pin.preComing_yn == "Y"){ // 프리오더 일때
        				var intervalDt = endDate - now;
						bar_seconds = Math.floor(intervalDt / 1000);
						$("#d_bar").css('width', Math.ceil(bar_seconds / total_interval * 100)+"%");
        				html += "<em>" +fnfirstZero(days)+"</em>일 <em>"+fnfirstZero(hours)+"</em>시간 <em>"+fnfirstZero(minutes)+"</em>분 <em>"+fnfirstZero(seconds)+"</em>초";
        			}
        			
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
		    			
		    			if(data[0].isLotVendMatch == 'Y'){ // 가능 지점 일시 
		    				var dlvpFirstStr = "";
			    			var dlvpFirstChk = false;
			    			//당일 체크 
		    				$.each(data, function(idx, info) {
		    					if("01" == info.date0){
		    						dlvpFirstChk = true;
		    						dlvpFirstStr = "오늘 "+ info.bgn_tm;
		    						return false;
								}
		    					
				    		});
		    				
		    				if(!dlvpFirstChk){
								var dlvpTwoChk = false;	
								//1일 뒤 체크
								$.each(data, function(idx, info) {
			    					if("01" == info.date1){
			    						dlvpTwoChk = true;
			    						dlvpFirstStr = info.date1str + info.bgn_tm;
			    						return false;
									}
					    		});
								
								if(!dlvpTwoChk){
									//2일 뒤 체크
									$.each(data, function(idx, info) {
				    					if("01" == info.date2){
				    						dlvpFirstStr = info.date2str + info.bgn_tm;
				    						return false;
										}
						    		});
								}
							}
		    				
		    				html += '지금주문하면<br/><strong class="red">' + dlvpFirstStr + '</strong> 부터 도착가능합니다.';
		    			}else{ //가능지점이 아닐 시 
		    				$("#todayDeliDate").text("");
			    			html += '<div class="no_store">';
			    			html += '오늘직송 가능한 지점이 없습니다.';
			    			html += '</div>';
		    			}
		    		}
		    	}
		    });
			
		}else{ // 비로그인 시 
			$("#todayDeliDate").text("");
			html += '<div class="dlv_login">';
			html += '<a href="javascript:;" class="login_btn" onclick="javascript:elandmall.loginToGoDtail({goods_no:\''+pin.goods_no+'\', vir_vend_no:\'' + pin.vir_vend_no + '\', nomember_hide: true});">로그인</a>';
			html += '하시면 배송지에 맞는<br>배송시간을 확인할 수 있습니다';
			html += '</div>';
		}
		
		$("#todayDeliInfo").append(html);
	}

	
	
})(jQuery);