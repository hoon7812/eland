/**
 * 업무관련(상품관련메소드) 
 */
;(function($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};	
	};
	//아이템 클릭옵션 분리시 필요 파라미터
	var set_goods_no="";
	var set_vir_vend_no="";
	var set_low_vend_type_cd="";
	var set_quickview_yn="";
	var set_reserv_yn="";
	/**
	 * 사용방법
	 * elandmall.popup.itemLayer();
	 * 
	 * 리턴값
	 * callback({item_no}) 
	 */
	if ($.type(window.elandmall.popup) != "object") {
		window.elandmall.popup = {};	
	};

	var calenderStr = "날짜캘린더";	
		
		/**
		 * 옵션변경 레이어 내에서 사용 되는 이벤트 함수
		 * 일부는 상품상세에서 같이 사용되고 있음.
		 * */
		elandmall.optLayerEvt = {
				
				
				
				//[START] 상품옵션초기화
				initopt : function(p){ //overpass.goods.js
					var scope_div = null;
					if(typeof(p) != "undefined" && typeof(p.obj) != "undefined"){
						scope_div = $("#_optChoiceLayer", $(p.obj));
					}else{
						scope_div = $("#_optChoiceLayer");
					}
					var goodsInfo = $(scope_div).data("goods_info");
					var preItemInfo = $(scope_div).data("pre_item_info");
					
					//아이템 클릭옵션 분리시 필요 파라미터
					set_goods_no=goodsInfo.goods_no;
					set_vir_vend_no=goodsInfo.vir_vend_no;
					set_low_vend_type_cd=goodsInfo.low_vend_type_cd;
					set_reserv_yn=goodsInfo.reserv_yn;
					
					if(typeof(preItemInfo) == "object"){
						if(goodsInfo.multi_item_yn =="Y"){
							
						}else{
							if(String(goodsInfo.goods_cmps_divi_cd) == "20"){

								$("[id^=cmps_goods_grp]",scope_div).each(function(idx){
									
									var preInfo = preItemInfo[$(this).data("cmps_grp_seq")];
									
									if(preInfo.multi_item_yn == "Y"){
										$(this).val(String(preInfo.goods_no));
										$(this).change();
										var strItem_nm = preItemInfo[$(this).data("cmps_grp_seq")].item_nm;
										var arrItem_nm = strItem_nm.split("/");
										var pre_item_val = "";
											
										$.each($("#item_opt_nm1", $("#setGrp"+$(this).data("cmps_grp_seq"), scope_div)).children(), function(idx, optval){
											if(arrItem_nm[0] == $(this).data("item_show_nm")){
												pre_item_val = $(this).val();
											}
										});
										$("#item_opt_nm1", $("#setGrp"+$(this).data("cmps_grp_seq"),scope_div)).val(pre_item_val);
										$("#item_opt_nm1", $("#setGrp"+$(this).data("cmps_grp_seq"), scope_div)).change();
									}else{
										$(this).val(String(preInfo.goods_no));
										$(this).change();
									}
									
								});
								
								//사은품이 있다면,
								if(typeof(preItemInfo.gift_goods_info) != "undefined"){
									var strGiftInfo = "";
									strGiftInfo = String(preItemInfo.gift_goods_info);
									var arrGiftInfo = strGiftInfo.split(";");
									//alert($("select[name=gift_dtl_no]","#opt_box").length);
									$("select[name=gift_dtl_no]", scope_div ).each(function(idx,key){
										$(this).val(arrGiftInfo[idx]);
									});
								}
							}
						}
					}
					
					//모든 초기화
					if(goodsInfo.multi_item_yn =="Y"){
						
					}else{
						if(String(goodsInfo.goods_cmps_divi_cd) == "20"){
							if($("#etc_box > ul","#_optChoiceLayer").children("li").length > 0){
								$("#etc_box","#_optChoiceLayer").show();
							}
						}
					}
					

					
				},//[END] 상품옵션초기화
				//[START]옵션 조회
				ajaxItemList : function(p){	//pc, mo 
					var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
					var asyncVal = (typeof(p.async)!="undefined")?p.async:true;
					if(p.param.ajax_yn == "" || typeof(p.param.ajax_yn) =="undefined" || p.param.ajax_yn == null ){
					
						var sType = "POST";
						var bCache = false;
						if(event_layer_yn == "Y") { //이벤트 상품은 캐싱을 위해 GET 
							sType = "GET";
							bCache = true;
						}

						$.ajax({
							url: "/goods/searchGoodsItemList.action",
							data: p.param,
							async:asyncVal,
							type: sType,
							cache : bCache ,
							dataType: "json",
							success: function(data) {
								if($.type(p.success) == "function"){
									p.success(data);
								}
							}
						});
					}
				},
				getItemPrice : function(p){	//pc, mo 
					var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
					var pkg_goods_yn = $("#detailform").find("input[name='goods_type_cd']").val() == "80" ? "Y" :"";
					
					p.param.event_layer_yn = event_layer_yn;
					p.param.pkg_goods_yn = pkg_goods_yn;
					
					var sType = "POST";
					var bCache = false;
					if(event_layer_yn == "Y") { //이벤트 상품은 캐싱을 위해 GET 
						sType = "GET";
						bCache = true;
					}
					
					//선택된 정보 모두 가져오기 
					$.ajax({			
						url : "/goods/getGoodsItemPriceJson.action",
						data : p.param,
						type : sType,
						cache : bCache,
						dataType : "json",
						success : function(data){
							if($.type(p.success) == "function"){
								data["jwNormal_yn"] = p.param["jwNormal_yn"];
								data["style_cd"] = p.param["style_cd"];
								data["brand_cd"] = p.param["brand_cd"];
								data["last_sap_item_cd"] = p.param["last_sap_item_cd"];
								data["layer_yn"] = p.param["layer_yn"];
								p.success(data);
							}
						}
					})
				},
				

				//[ECJW-9] 옵션 불러오기 I/F 
				getJwItemPrice : function(p){	//pc, mo 
					var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
					p.param.event_layer_yn = event_layer_yn;
					
					var sType = "POST";
					var bCache = false;
					if(event_layer_yn == "Y") { //이벤트 상품은 캐싱을 위해 GET 
						sType = "GET";
						bCache = true;
					}
					
					//선택된 정보 모두 가져오기 
					$.ajax({			
						url : "/inter/searchItemPrice.action",
						data : p.param,
						type : sType,
						cache : bCache ,
						dataType : "json",
						success : function(data){
							if($.type(p.success) == "function"){
								data["ITEM_NO"] = "00000";
								data["GOODS_NO"] = p.param["goods_no"];
								data["VIR_VEND_NO"] = p.param["vir_vend_no"];
								data["GOODS_NM"] = p.param["goods_nm"];
								data["layer_yn"] = p.param["layer_yn"];
								data["classkey"] = p.param["classkey"];
								data["total_optCd"] = p.param["total_optCd"];
								data["total_optNm"] = p.param["total_optNm"];
								data["cust_item_no"] = p.param["cust_item_no"];
								data["cust_item_nm"] = p.param["cust_item_nm"];
								data["goods_opt_data"] = p.param["goods_opt_data"];
								data["carve_code"] = p.param["carve_code"];
								data["cart_grp_cd"] 	= $(p.param["obj"]).val();
								data["shopCode"] = p.param["shopCode"];
								data["quickview_yn"] = p.param["quickview_yn"];
								var arr = new Array();
								arr.push(data);
								p.success(arr);
							}
							
							elandmall.optLayerEvt.resetJwItemPriceRealTime();
						}
					})
				},
				
				//주얼리 주문제작 실시간 가격 조회 -> 옵션가 표시 
				getJwItemPriceRealtime : function(pin){	//pc, mo 공통
					pin = $.extend({obj:null},pin);
					
					if(pin.obj == null) {
						console.log("div 정보가 없습니다.");
						return;
					}
					
					var div = pin.obj;
					var currIdx = pin.opt_idx;
					var tBrandCd = "";
					var tStyleCd = "";
					var tOptionCd = {};
					
					tBrandCd = div.find("input[name='brand_cd']").val();  //브랜드
					tStyleCd = div.find("input[name='style_cd']").val();  //스타일
					
					if(div.find("input[name='goods_type_cd']").val() == "80") { //묶음일때 브랜드/스타일 코드 셋팅
						var selObj = div.find("#item_opt_li_data:eq(0)");
						tBrandCd = selObj.attr("data-brand_cd");
						tStyleCd = selObj.attr("data-style_cd");
					}
					
					var last_idx = -1;
					var carveYn = false;
					div.find(".selected").each(function(){
						var sSelCd = $(this).children("span.sel_txt").attr("data-sel-cd"); //옵션코드 값
						var sOptCd = $(this).children("span.sel_txt").attr("data-opt_cd"); //옵션코드
						var dataIndex = $(this).children("span.sel_txt").attr("data-index"); //옵션인덱스
						var sLastYn = $(this).children("span.sel_txt").attr("data-last"); //옵션인덱스
						if(sLastYn == "Y") {
							last_idx = dataIndex;
						}
						var sIncarv = "";
						var sOutcarv = "";
						var maxLen = "";
						
						if(sOptCd == "ISOS" || sOptCd == "OSIS" ){
							maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
							var arrlen = maxLen.split(',');
							if(sOptCd == "ISOS" ){
								if(sSelCd == "IS" )  { //속각인
									sIncarv = div.find("#in_carve").val();
									
									if(sIncarv == "") {
										maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
										sIncarv = elandmall.optLayerEvt.lpad(sIncarv,arrlen[0],"0");
									}
									
								}else if(sSelCd == "OS")  { //겉각인
									sOutcarv = div.find("#out_carve").val();
									if(sOutcarv == "") {
										maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
										sOutcarv = elandmall.optLayerEvt.lpad(sOutcarv,arrlen[1],"0");
									}
									
								}else{
									maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
									var arrlen = maxLen.split(',');
									sIncarv = div.find("#in_carve").val();
									sOutcarv = div.find("#out_carve").val();
									sIncarv = elandmall.optLayerEvt.lpad(sIncarv,arrlen[0],"0");
									sOutcarv = elandmall.optLayerEvt.lpad(sOutcarv,arrlen[1],"0");
									
								}
								carveYn = true;

							}else if(sOptCd == "OSIS" ){

								
								if(sSelCd == "OS")  { //겉각인
									sOutcarv = div.find("#out_carve").val();
									if(sOutcarv == "") {
										maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
										sOutcarv = elandmall.optLayerEvt.lpad(sOutcarv,arrlen[0],"0");
									}
									
								}else if(sSelCd == "IS" )  { //속각인
									sIncarv = div.find("#in_carve").val();
									
									if(sIncarv == "") {
										maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
										sIncarv = elandmall.optLayerEvt.lpad(sIncarv,arrlen[1],"0");
									}
									
								}else{
									
									sIncarv = div.find("#in_carve").val();
									sOutcarv = div.find("#out_carve").val();
									sOutcarv = elandmall.optLayerEvt.lpad(sOutcarv,arrlen[0],"0");
									sIncarv = elandmall.optLayerEvt.lpad(sIncarv,arrlen[1],"0");
									
								}
								carveYn = true;
							}
							
							if( $.type(sSelCd) != "undefined" && sSelCd != "" && currIdx >= dataIndex && sSelCd != "XXXX"){
								
								if(sOptCd == "ISOS" ){
									tOptionCd["IS"] = sIncarv;	
									tOptionCd["OS"] = sOutcarv;	
								}else if(sOptCd == "OSIS" ){
									tOptionCd["OS"] = sOutcarv;	
									tOptionCd["IS"] = sIncarv;	
								}else if(sSelCd == "IS" ) {
									tOptionCd[sSelCd] = sIncarv;	
									carveYn = true;
								}else if(sSelCd == "OS") {
									tOptionCd[sSelCd] = sOutcarv;	
									carveYn = true;
								}else{
									tOptionCd[sOptCd] = sSelCd;
								}
								
							}
							
						}else{
							if(sSelCd == "IS" )  { //속각인
								sIncarv = div.find("#in_carve").val();
								
								if(sIncarv == "") {
									maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
									sIncarv = elandmall.optLayerEvt.lpad(sIncarv,maxLen,"0");
								}
								carveYn = true;
							}else if(sSelCd == "OS")  { //겉각인
								sOutcarv = div.find("#out_carve").val();
								if(sOutcarv == "") {
									maxLen = $(this).children("span.sel_txt").attr("data-carve_len");
									sOutcarv = elandmall.optLayerEvt.lpad(sOutcarv,maxLen,"0");
								}
								carveYn = true;
							}
							
							if( $.type(sSelCd) != "undefined" && sSelCd != "" && currIdx >= dataIndex && sSelCd != "XXXX"){
								
								if(sSelCd == "IS" ) {
									tOptionCd[sOptCd] = sIncarv;	
								}else if(sSelCd == "OS") {
									tOptionCd[sOptCd] = sOutcarv;	
								}else{
									tOptionCd[sOptCd] = sSelCd;
								}
								
							}
						}

						
					});
					
			
					if( div.find("input[name='field_rec']").length < 1 || div.find("#recev_nm > li").length < 1 ) { //PC 다중수령방식이 아닐때
						if(!carveYn && currIdx == last_idx) { //각인이 없을때,마지막 옵션 실시간 옵션 조회 하지 않음
							return;
						}
					}
					
					
					var tempParam = {}; //주문제작 가격실시간 조회용 파라미터
					tempParam = { BrandCode : tBrandCd , StyleCode : tStyleCd , OptionCode : tOptionCd } ;
					var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
					
					var sType = "POST";
					var bCache = false;
					if(event_layer_yn == "Y") { //이벤트 상품은 캐싱을 위해 GET 
						sType = "GET";
						bCache = true;
					}
					
					$.ajax({			
						url : "/inter/searchItemPrice.action",
						data : {"goods_opt_data" : JSON.stringify(tempParam) },
						type : sType,
						cache : bCache,
						dataType : "json",
						success : function(data){
							if(data.ret_code == "S") {
								
								var oPrice = elandmall.util.toCurrency(data.Content.Price);
								
								
								if(elandmall.global.chnl_cd == "10") { //PC
									$(".fin_price").each(function(){
										$(this).children("strong").text(oPrice);
										$(this).parents(".fin_price_parents").show();
									});

								}else{ //MOBILE,APP
									$(".fin_price").each(function(){
										$(this).children("b").text(oPrice);
										$(this).parents(".fin_price_parents").show();
									});
								}
								

							}else{
								console.log(data.ret_msg);
							}
						}
					})
				},
				//가격 초기화
				resetJwItemPriceRealTime :  function(){
					
					if(elandmall.global.chnl_cd == "10") { //모바일
						$(".fin_price").each(function(){
							$(this).children("strong").text("0");
							$(this).parents(".fin_price_parents").hide();
							
						});

					}else{
						$(".fin_price").each(function(){
							$(this).children("b").text("0");
							$(this).parents(".fin_price_parents").hide();
						
						});
					}
					
					$(".fin_price_parents > button").each(function(){
						$(this).hide();
					});
				},
				
				
				//[END]옵션 조회
				//[START] n+1 상품 수량 체크	pc, mo
				nplusQtycheck :function(p){
					if(($.type(p.nplus_base_cnt) != "undefined"&& p.nplus_base_cnt > 0) && ($.type(p.nplus_cnt) != "undefined"&& p.nplus_cnt > 0)){
						var maxnpluscnt = parseInt(p.sale_poss_qty/(p.nplus_base_cnt+p.nplus_cnt)); //n+1의 횟수
						var maxsalecnt = maxnpluscnt * p.nplus_base_cnt ; //n+1의 주문가능수량
						var remaincnt = p.sale_poss_qty - (maxnpluscnt* p.nplus_cnt) + maxsalecnt; //잔여수량
						var maxordcnt = 0
						var ord_qty = +p.ord_qty;
						
						if(remaincnt > 0 && remaincnt >= p.nplus_base_cnt){
							remaincnt = p.nplus_base_cnt -1;							
						}
						
						maxsalecnt = maxsalecnt + remaincnt;
						
						if(ord_qty > maxsalecnt){						
							alert("주문가능한 최대수량은 "+(maxsalecnt)+"개 입니다.");
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
				}, //[END] n+1 상품 수량 체크
				//[START] 선택한 세트상품 가격가져오기 / 묶음상품의 옵션없는 구성품 가격정보 가져오기
				getSetGoodsPrice : function(p){
					var asyncVal = (typeof(p.async)!="undefined")?p.async:true;
					p.param.event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
					$.ajax({
						url: "/goods/getSetGoodsPrice.action",
						data: p.param,
						type: "POST",
						async:asyncVal,
						dataType: "json",
						success: function(data) {
							if($.type(p.success)  == "function"){
								
								p.success(data);
							
							}
						}
					}); 
				},//[END] 선택한 세트상품 가격가져오기
				
				
				
				//[START]옵션 change 이벤트 함수 
				changeItem:function(p){	//pc, mo 
					var chgObj = p.chgObj;	//현재 변경된 옵션박스
					var div = p.div;	//옵션셀렉트박스가 있는 div
					
					var slt_opt_val = "";
					var obj_value = "";
					var jw_data_cd = "";
					
					if($(chgObj).parents(".options").data("opt_nm") == calenderStr && typeof(p.param.mobileYn) == "undefined"){
						slt_opt_val = $(chgObj).data("item_show_nm");
						obj_value = $(chgObj).attr('data-value');
					}else{
						slt_opt_val = $(chgObj).parents(".selected").data("item_show_nm");
						obj_value = $(chgObj).parents('.selected').attr('data-value');
						if(p.param.jwFlag){
							jw_data_cd = $(chgObj).parents('.selected').attr('data-code');
						}
					}
					
					var multi_item_yn = $(chgObj).attr('data-multi_item_yn');
					var event_layer_yn = $("#detailform").find("input[name='event_layer_yn']").val();
					var opt_idx = $(chgObj).parents('.options').data("index");
					var layer_yn = $(chgObj).parents('.options').data("layer_yn");
					var curr_opt_nm = "opt_val_nm"+opt_idx;
					var color_chip_yn = (typeof(p.color_chip_yn) != "undefined")? p.color_chip_yn:"N";
					var color_chip_val = +p.color_chip_val;
					var param = p.param;
					param["event_layer_yn"] = event_layer_yn;
					
					if($("div#gd_float_opt_fix").length > 0){
						if(layer_yn == "Y"){
							//$("#options_nm"+opt_idx, div).val(obj_value);
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
							
							if(!$li.hasClass('sld_out')){
								$selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
								$selBtn.find('.sel_txt').data('sel-msg',slt_opt_val);
								$selBtn.find('.sel_txt').attr('data-value',obj_value);

								if(param.jwFlag){
									$selBtn.find('.sel_txt').attr('data-sel-cd',$(chgObj).parents('.selected').attr('data-code'));
								}
								
								$('.lyr_select').removeClass('on');
								$li.addClass('selected').siblings('li').removeClass('selected');
								showText($selBtn);
							}
						}else{
							//$("#options_nm"+opt_idx+"L", div).val(obj_value);
							var options = div.find("#options_nm"+opt_idx+"L");
							$.each(options.children('li'), function(idx, opt){
								if($(opt).attr('data-value') == obj_value){
									$(opt).addClass("selected");
								}else{
									$(opt).removeClass("selected");
								}
							})
							var $li = options.children('.selected');
							var $selBtn = options.parent().siblings('.sel_btn');
							
							if(!$li.hasClass('sld_out')){
								$selBtn.find('.sel_txt').attr('data-sel-msg',slt_opt_val);
								$selBtn.find('.sel_txt').data('sel-msg',slt_opt_val);
								$selBtn.find('.sel_txt').attr('data-value',obj_value);
								
								if(param.jwFlag){
									$selBtn.find('.sel_txt').attr('data-sel-cd',$(chgObj).parents('.selected').attr('data-code'));
								}
								
								$('.lyr_select').removeClass('on');
								$li.addClass('selected').siblings('li').removeClass('selected');
								showText($selBtn);
							}
						}
					}
					function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
						if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
							$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
						}
						else{
							$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
						}
					}
					$.each(div.find("[id^=options_nm]"), function(idx, opt){
						var curr_idx = $(opt).data("index");
							
						if(curr_idx <= opt_idx){
							
							if($(opt).data("opt_nm") == calenderStr && typeof(param.mobileYn) == "undefined"){
								if( $(opt).attr('data-item_show_nm') == ""){
									
									for(var k=0; k< $(opt).find("a[name='day']").length; k++){
										
										if($(chgObj).attr('data-item_show_nm') == $(opt).find("a[name='day']").eq(k).attr('data-item_show_nm') ){
											param["opt_val_nm"+curr_idx] = $(opt).find("a[name='day']").eq(k).data('item_show_nm');
											$(opt).attr('data-item_show_nm', $(opt).find("a[name='day']").eq(k).data('item_show_nm'));
											break;
										}
									}
								}else{
									param["opt_val_nm"+curr_idx] = $(opt).attr('data-item_show_nm');
								}
								
							}else{
								param["opt_val_nm"+curr_idx] = $(opt).children(".selected").data('item_show_nm');
							}
						}
						
					});
					
					var dataValue = "";
					var dataCanclePossYn = "";
					if($(chgObj).parents('.lyr_select').find('.sel_btn').children().data('opt_nm') == calenderStr && typeof(param.mobileYn) == "undefined"){
						dataValue = $(chgObj).attr('data-value');
						dataCanclePossYn = $(chgObj).data('cancle_poss_yn');
					}else{
						dataValue = $(chgObj).parent().attr('data-value');
						dataCanclePossYn = $(chgObj).parents('.selected').data('cancle_poss_yn');
					}
					
					if(dataValue == "soldout"){
						alert("죄송합니다. 선택하신 옵션은 품절 되었습니다.");
						return;
					}
					
					//호텔 예약상품은 7일 이내는 취소 불가
					//$(chgObj).parents('.selected').data('cancle_poss_yn')
					if(typeof(dataCanclePossYn) != "undefined" && dataCanclePossYn == "N" ){
						alert("사용일 기준으로 7일 이내의 상품은 취소가 불가합니다.");
					}
					if($(chgObj).parents('.options').data("last") != "Y" && obj_value != ""){
						
						if(color_chip_yn == "Y"){
							if(color_chip_val == (opt_idx+1)){
								param["color_yn"] = "Y";
							}
						}
						
						var calenderDataList = new Array();
						
						//[ECJW-9] 옵션 불러오기 I/F
						if(param.jwFlag){
							p.param["optionCode"] = div.find("[id^=item_opt_nm"+(opt_idx+1)+"]").data('opt_cd');
							if(param.pkg_goods_yn == "Y"){
								p.param["low_vend_type_cd"] = param.low_vend_type_cd;
								p.param["deli_goods_divi_cd"] = param.deli_goods_divi_cd;
								p.param["styleCode"] = param.styleCode;
							}
							
						}
						
						var opt = div.find("[id^=options_nm"+(opt_idx+1)+"]");
						var opt_L = div.find("[id^=options_nm"+(opt_idx+1)+"L]");
						var optTag = "";
						var next_opt_nm = opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_nm');
						if(layer_yn == "Y"){
							optTag = opt_L;
						}else{
							optTag = opt;
						}
						
						param["ajax_yn"] = "";
						
						if(param.jwFlag && opt.length < 1){
							param["ajax_yn"] = "Y";
						}
						
						if(next_opt_nm == calenderStr){
							param["calendar_yn"] = "Y";
						}
						
						if(param.jwFlag && next_opt_nm == "각인"){
							
							if(param.carve_yn == "Y"){
							
								$('li[name="li_input_carve"]').remove();
								$('dd[name="dd_input_carve"]').remove();
								$("#dd_receive_choice").hide();
								$("#branchInfoBox").hide();
								$("#branchInfoBoxL").hide();
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
								opt.parents('.lyr_select').children('.sel_btn').removeClass('selected');
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','옵션을 선택해 주세요');
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
								//opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-opt_cd","");
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').text(opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_nm')+' 옵션을 선택해 주세요');
								opt.parents('.lyr_select').removeClass('disabled');
								
								var html = '';
								var opt_use_n = "";
								if(optTag.attr('data-opt_cd') == "ISOS" || opt.attr('data-opt_cd') == "OSIS"){
									
									html+='<li data-code="ISOS" data-item_show_nm="속각인 & 겉각인">';
									html+='<span class="ancor" onclick="elandmall.goodsDetail.fnCarveSelectItem({obj:this, layer_yn:\''+layer_yn+'\', quickview_yn:\''+param.quickview_yn+'\'})">';
									html+='<span class="opt_name">속각인 & 겉각인</span>';
									html+='</span>';
									html+='</li>';
	
									html+='<li data-code="IS" data-item_show_nm="속각인">';
									html+='<span class="ancor" onclick="elandmall.goodsDetail.fnCarveSelectItem({obj:this, layer_yn:\''+layer_yn+'\', quickview_yn:\''+param.quickview_yn+'\'})">';
									html+='<span class="opt_name">속각인</span>';
									html+='</span>';
									html+='</li>';
									
									html+='<li data-code="OS" data-item_show_nm="겉각인">';
									html+='<span class="ancor" onclick="elandmall.goodsDetail.fnCarveSelectItem({obj:this, layer_yn:\''+layer_yn+'\', quickview_yn:\''+param.quickview_yn+'\'})">';
									html+='<span class="opt_name">겉각인</span>';
									html+='</span>';
									html+='</li>';
									
								}else if(optTag.attr('data-opt_cd') == "IS") {
								
									html+='<li data-code="IS" data-item_show_nm="속각인">';
									html+='<span class="ancor" onclick="elandmall.goodsDetail.fnCarveSelectItem({obj:this, layer_yn:\''+layer_yn+'\', quickview_yn:\''+param.quickview_yn+'\'})">';
									html+='<span class="opt_name">속각인</span>';
									html+='</span>';
									html+='</li>';
									
								}else if(optTag.attr('data-opt_cd') == "OS") {
									
									html+='<li data-code="OS" data-item_show_nm="겉각인">';
									html+='<span class="ancor" onclick="elandmall.goodsDetail.fnCarveSelectItem({obj:this, layer_yn:\''+layer_yn+'\', quickview_yn:\''+param.quickview_yn+'\'})">';
									html+='<span class="opt_name">겉각인</span>';
									html+='</span>';
									html+='</li>';
									
								}
									
								if( optTag.attr('data-field_recev_poss_yn') == "Y" || optTag.attr('data-present_yn') == "Y") {
									html+='<li data-code="XXXX" data-item_show_nm="사용안함">';
									html+='<span class="ancor" onclick="elandmall.goodsDetail.fnCarveSelectItem({obj:this, layer_yn:\''+layer_yn+'\', quickview_yn:\''+param.quickview_yn+'\'})">';
									html+='<span class="opt_name">사용안함</span>';
									html+='</span>';
									html+='</li>';
								}else{
									opt_use_n = "XXXX";
									html+='<li data-code="XXXX" data-item_show_nm="사용안함">';
									html+='<span class="ancor opt_use_n" >';
									html+='<span class="opt_name">사용안함</span>';
									html+='</span>';
									html+='</li>';
								}
								
								
								opt.html(html);
								opt_L.html(html);
								
								if(opt_use_n == "XXXX" ){
									var dataPram = {obj:this, layer_yn: layer_yn , carve_code : opt_use_n , quickview_yn: param.quickview_yn };
									opt.find("span.opt_use_n").each(function(){
										$(this).unbind("click",elandmall.goodsDetail.fnCarveGetPriceItem);
										$(this).bind("click", dataPram, elandmall.goodsDetail.fnCarveGetPriceItem);
									});
									
									opt_L.find("span.opt_use_n").each(function(){
										$(this).unbind("click",elandmall.goodsDetail.fnCarveGetPriceItem);
										$(this).bind("click", dataPram, elandmall.goodsDetail.fnCarveGetPriceItem);
									});

								}
								
								if($.type(p.callback_ajax) == "function"){	//
									p.callback_ajax({curr_idx:opt_idx, next_idx:opt_idx+1});
								}
							}else{
								
								//다음 옵션을 가져옴 (마지막 옵션일 때는 데이터를 조회하지 않는다.)
								elandmall.optLayerEvt.ajaxItemList({
									param:param,
									success:function(data){
										var opt = div.find("[id^=options_nm"+(opt_idx+1)+"]");
										if(!(opt.attr("data-opt_nm") == calenderStr && typeof(param.mobileYn) == "undefined")) {
											opt.children().remove();	
										}
										
										opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
										opt.parents('.lyr_select').children('.sel_btn').removeClass('selected');
										opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','옵션을 선택해 주세요');
										opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
										opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
										opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').text(opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_nm')+' 옵션을 선택해 주세요');
										opt.parents('.lyr_select').removeClass('disabled');
										var $selBtn =opt.parents('.lyr_select').children('.sel_btn');
										$('li[name="li_input_carve"]').remove();
										$('dd[name="dd_input_carve"]').remove();
										$("#dd_receive_choice").hide();
										$("#branchInfoBox").hide();
										$("#branchInfoBoxL").hide();
										//하위 셀렉트박스 생성시 하위보다 하위
										var low_div = div.find("[id^=options_nm]");
										$.each(low_div, function(idx, lDiv) {
											if($(lDiv).data("index") >(opt_idx+1)){
												
												if(!($(lDiv).attr("data-opt_nm") == calenderStr && typeof(param.mobileYn) == "undefined") ){
													$(lDiv).children().remove();
												}
												$(lDiv).parents('.lyr_select').children('.sel_btn').removeClass('selected');
												$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
												$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').text('상위 옵션을 선택해 주세요.');
												$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
												$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
												
												if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
													$(lDiv).parents('.lyr_select').addClass('disabled');
												};
												$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
											};
										});
										
										$.each(data, function(idx, info) {
											var item_no = info["ITEM_NO"];
											var item_nm = info["ITEM_NM"];
											var sale_poss_qty= info["SALE_POSS_QTY"];

											//[ECJW-9] 옵션 불러오기 I/F
											var opt_val_cd = "";
											var opt_val_nm = "";
											if(param.jwFlag){
												opt_val_cd = info["OPT_VAL_CD1"];
												opt_val_nm = info["OPT_VAL_NM1"];
											}else{
												opt_val_cd = "";
												opt_val_nm = info["OPT_VAL_NM"+(opt_idx+1)];
											}
											
											var goods_nm = info["GOODS_NM"];
											var vir_vend_no = info["VIR_VEND_NO"];
											var item_nm_add_info = info["ITEM_NM_ADD_INFO"];
											var item_sale_price = info["ITEM_SALE_PRICE"];
											var goods_sale_price = info["GOODS_SALE_PRICE"];
											var opt_low_vend_type_cd = $("#option_low_vend_type_cd").val();
											var sale_price	=	Number($("#resd_sale_price").val());
											var item_opt_li_data;
											var min_sale_price   = info["MIN_SALE_PRICE"];
											var low_price_cnt    = Number(info["CNT"]);
											var price_str		="";
											
											
											if(typeof(item_nm_add_info) == "undefined"){
												item_nm_add_info = "";
											}
											
											// 묶음상품
											if ($("#item_opt_li_data").length > 0 ){
												item_opt_li_data = $("#item_opt_li_data");
												opt_low_vend_type_cd = item_opt_li_data.data("low_vend_type_cd");
												sale_price	=	Number(item_opt_li_data.data("resd_sale_price"));
											}
											// NGCPO-805에 따른 수정으로 인하여 미사용처리 2017.04.13
											if ( item_sale_price > -1 && opt_low_vend_type_cd != "40"){ // 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
											var click_e = "";
											if(param.jwFlag){
												if($("#_optChoiceLayer").length>0){
													$("#_optChoiceLayer").remove();
												}
											}
											
											if($("#_optChoiceLayer").length>0){
												if(param.set_goods_yn == "Y"){
													click_e="onclick='elandmall.optLayerEvt.fnSelectLayerSetItem({obj:this})'";
												}else if(param.pkg_goods_yn == "Y"){
													click_e="onclick='elandmall.optLayerEvt.fnSelectLayerPkgItem({obj:this})'";
												}else{
													click_e="onclick='elandmall.optLayerEvt.fnSelectLayerItem({obj:this})'";
												};
											}else{
												if(param.set_goods_yn == "Y"){
													click_e="onclick='elandmall.goodsDetail.fnSelectSetItem({obj:this})'";
												}else if(param.pkg_goods_yn == "Y"){
													click_e="onclick='elandmall.goodsDetail.fnSelectPkgItem({obj:this})'";
												}else{
													click_e="onclick='elandmall.goodsDetail.fnSelectItem({obj:this})'";
												};
											};
											//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
											if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
												item_sale_price ="";
											}
	
											var optionObj = null;
											
											//[ECJW-9] 옵션 불러오기 I/F
											if(param.jwFlag){
												optionObj = $("<li><span class='ancor' "+click_e+"><span class='opt_name'>"+opt_val_nm+"</span></li>").attr({ "data-code": opt_val_cd });
											}else{

												if(sale_poss_qty > 0){
													optionObj = $("<li><span class='ancor' "+click_e+"><span class='opt_name'>"+opt_val_nm+"</span>"+
															"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
													).attr({ "data-value": item_no });
												}else{
													var setItemNm="";
													var sel_txt;
													if($("div.goods_detail_txt").length>0){
														if(param.set_goods_yn=="Y"){
															sel_txt = chgObj.parents(".opt_box").find(".sel_txt");
														}else{
															sel_txt = $(".goods_detail_txt").find(".sel_txt");
														}
													}else{
														sel_txt = $(".g_opt").find(".sel_txt");
													}
													//카테고리화면에서 재입고알림버튼의 단품정보
													if(sel_txt.length==0){
														if($("div.order_opt").length>0){
															if(param.set_goods_yn=="Y"){
																sel_txt = chgObj.parents(".opt_box").find(".sel_txt");
															}else{
																sel_txt = $(".order_opt").find(".sel_txt");
															}
														}else{
															sel_txt = $(".g_opt").find(".sel_txt");
														}
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

											        if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){
												        optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm+"</span>"+
														    "<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
														    "</span></li>"
												         ).attr({ "data-value": "soldout" });
											        }else{
												         optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm+"</span>"+
														    "<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
														    "<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+param.goods_no+"',vir_vend_no:'"+param.vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+setItemNm+"'});\">입고알림신청</a></span></li>"
												          ).attr({ "data-value": "soldout" });
											        }
												}
												
											}//주얼리 구분표시
											
											
											if(param.set_goods_yn == "Y"){ //세트상품일때만!!
												optionObj.attr("data-set_cmps_item_no", info["SET_CMPS_ITEM_NO"]);
											
											}
											optionObj.attr("data-item_nm", item_nm);
											optionObj.attr("data-vir_vend_no", vir_vend_no);
											optionObj.attr("data-item_show_nm", opt_val_nm);
											//[NGCPO-6256] 장바구니 수량체크
											optionObj.attr("data-sale_poss_qty", sale_poss_qty);
											opt.append(
													optionObj
											);
											
										});
									
									if($.type(p.callback_ajax) == "function"){	//
										p.callback_ajax({curr_idx:opt_idx, next_idx:opt_idx+1, data:data, calenderDataList:calenderDataList});
									}
								}
							});
							
						}
							
							
							
					}else{

						//다음 옵션을 가져옴 (마지막 옵션일 때는 데이터를 조회하지 않는다.)
						elandmall.optLayerEvt.ajaxItemList({
							param:param,
							success:function(data){
								var opt = div.find("[id^=options_nm"+(opt_idx+1)+"]");
								if(!(opt.attr("data-opt_nm") == calenderStr && typeof(param.mobileYn) == "undefined")) {
									opt.children().remove();	
								}
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
								opt.parents('.lyr_select').children('.sel_btn').removeClass('selected');
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','옵션을 선택해 주세요');
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
								opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').text(opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_nm')+' 옵션을 선택해 주세요');
								opt.parents('.lyr_select').removeClass('disabled');
								var $selBtn =opt.parents('.lyr_select').children('.sel_btn');
								if(param.jwFlag){
									$('li[name="li_input_carve"]').remove();
									$('dd[name="dd_input_carve"]').remove();
									
									if(opt.attr("data-opt_cd") == "SI"){
										opt.parents('.lyr_select').addClass('hasDefault ');
									}
								}else if(multi_item_yn == "Y"){
									$("#dd_receive_choice").hide();
								}
								//하위 셀렉트박스 생성시 하위보다 하위
								var low_div = div.find("[id^=options_nm]");
								$.each(low_div, function(idx, lDiv) {
									if($(lDiv).data("index") >(opt_idx+1)){
										
										if(!($(lDiv).attr("data-opt_nm") == calenderStr && typeof(param.mobileYn) == "undefined")){
											$(lDiv).children().remove();
										}
										$(lDiv).parents('.lyr_select').children('.sel_btn').removeClass('selected');
										$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
										$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').text('상위 옵션을 선택해 주세요.');
										$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
										$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
										
										if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
											$(lDiv).parents('.lyr_select').addClass('disabled');
										};
										$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
									};
								});
								
								if(param.jwFlag || param.jwNormalFlag){
									$("#branchInfoBox").hide();
									$("#branchInfoBoxL").hide();
									$("#dd_receive_choice").hide();
								}
								
								if(opt.data("opt_nm") == calenderStr && typeof(param.mobileYn) == "undefined"){
									
									var calendarMinMonthChk = false;
									
									$.each(data, function(idx, info) {
										var item_no = info["ITEM_NO"];
										var item_nm = info["ITEM_NM"];
										var sale_poss_qty= info["SALE_POSS_QTY"];
										var opt_val_nm = info["OPT_VAL_NM"+(opt_idx+1)];
										var goods_nm = info["GOODS_NM"];
										var vir_vend_no = info["VIR_VEND_NO"];
										var item_nm_add_info = info["ITEM_NM_ADD_INFO"];
										var item_sale_price = info["ITEM_SALE_PRICE"];
										var goods_sale_price = info["GOODS_SALE_PRICE"];
										var cancle_poss_yn = info["CANCLE_POSS_YN"];
										var opt_low_vend_type_cd = $("#option_low_vend_type_cd").val();
										var sale_price	=	Number($("#resd_sale_price").val());
										var item_opt_li_data;
										var min_sale_price   = info["MIN_SALE_PRICE"];
										var low_price_cnt    = Number(info["CNT"]);
										var price_str		="";
										
										if(typeof(item_nm_add_info) == "undefined"){
											item_nm_add_info = "";
										}
										
										if(!calendarMinMonthChk){
											opt.parents('.lyr_select').attr('yyyymm', new Date(opt_val_nm).format("yyyyMM"));
											calendarMinMonthChk = true;
										}
										
										// NGCPO-805에 따른 수정으로 인하여 미사용처리 2017.04.13
										if ( item_sale_price > -1 && opt_low_vend_type_cd != "40"){ // 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
											if(min_sale_price != ""){
												item_sale_price = elandmall.util.toCurrency(item_sale_price);
												price_str = "원";
											}
										}
										
										if(param.set_goods_yn == "Y"){ //세트상품일때만!!
//												optionObj.attr("data_set_cmps_item_no", info["SET_CMPS_ITEM_NO"]);
											
											var goodsObj = {
													item_no 				: item_no
													, data_vir_vend_no		: vir_vend_no
													, data_item_show_nm 	: opt_val_nm
													, opt_val_nm			: opt_val_nm
													, sale_poss_qty			: sale_poss_qty
													, data_set_cmps_item_no : info["SET_CMPS_ITEM_NO"]
													, data_cancle_poss_yn	: cancle_poss_yn
													, item_sale_price		: item_sale_price
													, price_str				: price_str
												};
										
										
										}else{
											
											
											var goodsObj = {
													item_no 				: item_no
													, data_vir_vend_no		: vir_vend_no
													, data_item_show_nm 	: opt_val_nm
													, opt_val_nm			: opt_val_nm
													, sale_poss_qty			: sale_poss_qty
													, data_set_cmps_item_no : ""
													, data_cancle_poss_yn	: cancle_poss_yn
													, item_sale_price		: item_sale_price
													, price_str				: price_str
												};
											
										}
										
									
									calenderDataList.push(goodsObj);
									
										
										// 묶음상품
										if ($("#item_opt_li_data").length > 0 ){
											item_opt_li_data = $("#item_opt_li_data");
											opt_low_vend_type_cd = item_opt_li_data.data("low_vend_type_cd");
											sale_price	=	Number(item_opt_li_data.data("resd_sale_price"));
										}
										
										
									});
									
										p.callback_ajax({curr_idx:opt_idx, next_idx:opt_idx+1, data:data, calenderDataList:calenderDataList});
									
									
									
								}else{
									
										$.each(data, function(idx, info) {
											var item_no = info["ITEM_NO"];
											var item_nm = info["ITEM_NM"];
											var sale_poss_qty= info["SALE_POSS_QTY"];

											//[ECJW-9] 옵션 불러오기 I/F
											var opt_val_cd = "";
											var opt_val_nm = "";
											if(param.jwFlag){
												opt_val_cd = info["OPT_VAL_CD1"];
												opt_val_nm = info["OPT_VAL_NM1"];
											}else{
												opt_val_cd = "";
												opt_val_nm = info["OPT_VAL_NM"+(opt_idx+1)];
											}
											
											var goods_nm = info["GOODS_NM"];
											var vir_vend_no = info["VIR_VEND_NO"];
											var item_nm_add_info = info["ITEM_NM_ADD_INFO"];
											var item_sale_price = info["ITEM_SALE_PRICE"];
											var goods_sale_price = info["GOODS_SALE_PRICE"];
											var opt_low_vend_type_cd = $("#option_low_vend_type_cd").val();
											var sale_price	=	Number($("#resd_sale_price").val());
											var item_opt_li_data;
											var min_sale_price   = info["MIN_SALE_PRICE"];
											var low_price_cnt    = Number(info["CNT"]);
											var price_str		="";
											var cancle_poss_yn = info["CANCLE_POSS_YN"];
											var sap_item_cd 	 = info["SAP_ITEM_CD"];
											var jw_default_sel_len = "";
											
											if(typeof(item_nm_add_info) == "undefined"){
												item_nm_add_info = "";
											}
											
											// 묶음상품
											if ($("#item_opt_li_data").length > 0 ){
												item_opt_li_data = $("#item_opt_li_data");
												opt_low_vend_type_cd = item_opt_li_data.data("low_vend_type_cd");
												sale_price	=	Number(item_opt_li_data.data("resd_sale_price"));
											}
											// NGCPO-805에 따른 수정으로 인하여 미사용처리 2017.04.13
											if ( item_sale_price > -1 && opt_low_vend_type_cd != "40"){ // 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
											var click_e = "";
											
											if(param.jwFlag){
												if($("#_optChoiceLayer").length>0){
													$("#_optChoiceLayer").remove();
												}
											}
											
											if($("#_optChoiceLayer").length>0){
												if(param.set_goods_yn == "Y"){
													click_e="onclick='elandmall.optLayerEvt.fnSelectLayerSetItem({obj:this})'";
												}else if(param.pkg_goods_yn == "Y"){
													click_e="onclick='elandmall.optLayerEvt.fnSelectLayerPkgItem({obj:this})'";
												}else{
													click_e="onclick='elandmall.optLayerEvt.fnSelectLayerItem({obj:this})'";
												};
											}else{
												if(param.set_goods_yn == "Y"){
													click_e="onclick='elandmall.goodsDetail.fnSelectSetItem({obj:this})'";
												}else if(param.pkg_goods_yn == "Y"){
													click_e="onclick='elandmall.goodsDetail.fnSelectPkgItem({obj:this})'";
												}else{
													click_e="onclick='elandmall.goodsDetail.fnSelectItem({obj:this})'";
												};
											};
											//NGCPO-4750[FO][MO] 다중 옵션의 가격 노출 수정
											if($selBtn.children('.sel_txt').attr("data-last") !="Y"){
												item_sale_price ="";
											}
	
											var optionObj = null;
											
											//[ECJW-9] 옵션 불러오기 I/F
											if(param.jwFlag){
												
												if(opt.attr("data-opt_cd") == "SI" && idx == (Math.floor(data.length/2))-1 ){
													optionObj = $("<li><span class='ancor dVal' "+click_e+"><span class='opt_name'>"+opt_val_nm+"</span></li>").attr({ "data-code": opt_val_cd });
												}else{
													optionObj = $("<li><span class='ancor' "+click_e+"><span class='opt_name'>"+opt_val_nm+"</span></li>").attr({ "data-code": opt_val_cd });	
												}
												
											}else{

												if(sale_poss_qty > 0){
													optionObj = $("<li><span class='ancor' "+click_e+"><span class='opt_name'>"+opt_val_nm+"</span>"+
															"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
													).attr({ "data-value": item_no, "data-sap_item_cd" : sap_item_cd });
												}else{
													var setItemNm="";
													var sel_txt;
													if($("div.goods_detail_txt").length>0){
														if(param.set_goods_yn=="Y"){
															sel_txt = chgObj.parents(".opt_box").find(".sel_txt");
														}else{
															sel_txt = $(".goods_detail_txt").find(".sel_txt");
														}
													}else{
														sel_txt = $(".g_opt").find(".sel_txt");
													}
													//카테고리화면에서 재입고알림버튼의 단품정보
													if(sel_txt.length==0){
														if($("div.order_opt").length>0){
															if(param.set_goods_yn=="Y"){
																sel_txt = chgObj.parents(".opt_box").find(".sel_txt");
															}else{
																sel_txt = $(".order_opt").find(".sel_txt");
															}
														}else{
															sel_txt = $(".g_opt").find(".sel_txt");
														}
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

													var event_layer_yn = $("input[name='event_layer_yn']").val();
											        if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20" || event_layer_yn == "Y"){
												        optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm+"</span>"+
														    "<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
														    "</span></li>"
												         ).attr({ "data-value": "soldout" });
											        }else{
												         optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm+"</span>"+
														    "<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
														    "<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+param.goods_no+"',vir_vend_no:'"+param.vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+setItemNm+"'});\">입고알림신청</a></span></li>"
												          ).attr({ "data-value": "soldout" });
											        }
												}
												
											}//주얼리 구분표시
											
											
											if(param.set_goods_yn == "Y"){ //세트상품일때만!!
												optionObj.attr("data-set_cmps_item_no", info["SET_CMPS_ITEM_NO"]);
											
											}
											optionObj.attr("data-item_nm", item_nm);
											optionObj.attr("data-vir_vend_no", vir_vend_no);
											optionObj.attr("data-item_show_nm", opt_val_nm);
											//[NGCPO-6256] 장바구니 수량체크
											optionObj.attr("data-sale_poss_qty", sale_poss_qty);
											
											if(typeof(cancle_poss_yn) != "undefined" && cancle_poss_yn != ""){
												optionObj.attr("data-cancle_poss_yn",cancle_poss_yn);
											}
											opt.append(
													optionObj
											);
											
										});
										
										
									}//옵션속성이 날짜일때만 END
								
								
								if($.type(p.callback_ajax) == "function"){	//
									p.callback_ajax({curr_idx:opt_idx, next_idx:opt_idx+1, data:data, calenderDataList:calenderDataList});
								}
							}
						});
						
					}
					
						
	
					}else{
						if(obj_value == ""){
							
							var opt = div.find("[id^=options_nm"+(opt_idx+1)+"]");
							opt.children().remove();
							opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
							opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','옵션을 선택해 주세요');
							opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-msg","");
							opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
							opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').text(opt.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('opt_nm')+' 옵션을 선택해 주세요');
							
							opt.parents('.lyr_select').removeClass('disabled');
							//하위 셀렉트박스 생성시 하위보다 하위
							var low_div = div.find("[id^=options_nm]");
							$.each(low_div, function(idx, lDiv) {
								if($(lDiv).data("index") >(opt_idx+1)){
									$(lDiv).children().remove();
									$(lDiv).parents('.lyr_select').children('.sel_btn').removeClass('selected');
									$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
									$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').text('상위 옵션을 선택해 주세요.');
									$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
									$(lDiv).parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
									
									if(!$(lDiv).parents('.lyr_select').hasClass('disabled')){
										$(lDiv).parents('.lyr_select').addClass('disabled');
									};
									$(lDiv).parents('.lyr_select').siblings('.list_chip').children('.colorChipList').children().remove();
								};
							});
							
							//플로팅레이어가 존재한다면 이쪽도 같이 지워준다.
							if($("div#gd_float_opt_fix").length > 0){
								var opt_layer = div.find("#options_nm"+(opt_idx+1)+"L");
								opt_layer.children("option").remove();
								//opt_layer.append($("<option>상위 옵션을 먼저 선택해 주세요.</option>").attr({ value: "" }));
								//opt_layer.attr('disabled', true);
								
								opt_layer.children().remove();
								opt_layer.parents('.lyr_select').children('.sel_btn').removeClass('selected');
								opt_layer.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr('data-org-msg','상위 옵션을 선택해 주세요.');
								opt_layer.parents('.lyr_select').children('.sel_btn').children('.sel_txt').text('상위 옵션을 선택해 주세요.');
								opt_layer.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-value","");
								opt_layer.parents('.lyr_select').children('.sel_btn').children('.sel_txt').attr("data-sel-cd","");
								
								if(!opt_layer.parents('.lyr_select').hasClass('disabled')){
									opt_layer.parents('.lyr_select').addClass('disabled');
								};
								
							}
							
							//opt.change();
							if(color_chip_yn == "Y" && color_chip_val != 1){
								$(".colorChipList").html("");
							}
						}
					}
					if($.type(p.callback) == "function"){	//
						p.callback({curr_idx:opt_idx, next_idx:opt_idx+1});
					}
					
					if(p.param.jwFlag) { //주문제작 실시간 옵션가 가져오기
						elandmall.optLayerEvt.getJwItemPriceRealtime({obj : div ,opt_idx : opt_idx});
					}
					
				},
				//[START]옵션 change 이벤트 함수
				changeItemOrigin:function(p){	//pc, mo 
					var chgObj = p.chgObj;	//현재 변경된 옵션박스
					var div = p.div;	//옵션셀렉트박스가 있는 div
					var slt_opt_val = $(chgObj).children(":selected").data("item_show_nm");
					var opt_idx = +$(chgObj).data("index");
					var layer_yn = $(chgObj).data("layer_yn");
					var curr_opt_nm = "opt_val_nm"+opt_idx;
					var color_chip_yn = (typeof(p.color_chip_yn) != "undefined")? p.color_chip_yn:"N";
					var color_chip_val = +p.color_chip_val;
					var param = p.param;
					
					if($("div#gd_float_opt_fix").length > 0){
						if(layer_yn == "Y"){
							$("#item_opt_nm"+opt_idx, div).val(chgObj.val());
						}else{
							$("#item_opt_nm"+opt_idx+"L", div).val(chgObj.val());
						}
					}
					
					$.each(div.find("[id^=item_opt_nm]"), function(idx, opt){
						var curr_idx = $(opt).data("index");
						
						if(curr_idx <= opt_idx){
							param["opt_val_nm"+curr_idx] = $(opt).children(":selected").data("item_show_nm");
						}
					});
					
					if($(chgObj).val() == "soldout"){
						alert("죄송합니다. 선택하신 옵션은 품절 되었습니다.");
						return;
					}
					
					//호텔 예약상품은 7일 이내는 취소 불가
					if(typeof($(chgObj).children('option:selected').data("cancle_poss_yn")) != "undefined" && $(chgObj).children('option:selected').data("cancle_poss_yn") == "N" ){
						alert("사용일 기준으로 7일 이내의 상품은 취소가 불가합니다.");
					}
					if($(chgObj).data("last") != "Y" && $(chgObj).val() != ""){
						
						if(color_chip_yn == "Y"){
							if(color_chip_val == (opt_idx+1)){
								param["color_yn"] = "Y";
							}
						}
						//다음 옵션을 가져옴 (마지막 옵셥일 때는 데이터를 조회하지 않는다.)
						elandmall.optLayerEvt.ajaxItemList({
							param:param,
							success:function(data){
								var opt = div.find("[id^=item_opt_nm"+(opt_idx+1)+"]");
								opt.children("option").remove();
								opt.append($("<option>"+opt.data("opt_nm")+" 옵션을 선택해 주세요.</option>").attr({ value: "" }));

								opt.attr('disabled', false);

								$.each(data, function(idx, info) {
									var item_no = info["ITEM_NO"];
									var item_nm = info["ITEM_NM"];
									var sale_poss_qty= info["SALE_POSS_QTY"];
									var opt_val_nm = info["OPT_VAL_NM"+(opt_idx+1)];
									var goods_nm = info["GOODS_NM"];
									var vir_vend_no = info["VIR_VEND_NO"];
									var item_nm_add_info = info["ITEM_NM_ADD_INFO"];
									var item_sale_price = info["ITEM_SALE_PRICE"];
									var opt_low_vend_type_cd = $("#option_low_vend_type_cd").val();
									var sale_price	=	Number($("#resd_sale_price").val());
									var item_opt_li_data;
									
									if(typeof(item_nm_add_info) == "undefined"){
										item_nm_add_info = "";
									}
									
									// 묶음상품
									if ($("#item_opt_li_data").length > 0 ){
										item_opt_li_data = $("#item_opt_li_data");
										opt_low_vend_type_cd = item_opt_li_data.data("low_vend_type_cd");
										sale_price	=	Number(item_opt_li_data.data("resd_sale_price"));
									}
									
									item_sale_price = "";	
									
									var optionObj = null;
									if(sale_poss_qty > 0){
										optionObj = $("<option>" + opt_val_nm + item_nm_add_info + item_sale_price + "</option>").attr({ value: item_no });
									}else{
										optionObj = $("<option> (품절)" + opt_val_nm + item_nm_add_info + item_sale_price + "</option>").attr({ value: "soldout" });
									}
									if(param.set_goods_yn == "Y"){ //세트상품일때만!!
										optionObj.attr("data-set_cmps_item_no", info["SET_CMPS_ITEM_NO"]);
									
									}
									optionObj.attr("data-item_nm", item_nm);
									optionObj.attr("data-vir_vend_no", vir_vend_no);
									optionObj.attr("data-item_show_nm", opt_val_nm);
									opt.append(
											optionObj
									);
								});
								
								if($.type(p.callback_ajax) == "function"){	//
									p.callback_ajax({curr_idx:opt_idx, next_idx:opt_idx+1, data:data});
								}
							}
						});
						
	
					}else{
						if($(chgObj).val() == ""){
							var opt = div.find("#item_opt_nm"+(opt_idx+1));
							
							opt.children("option").remove();
							opt.append($("<option>상위 옵션을 먼저 선택해 주세요.</option>").attr({ value: "" }));
							
							opt.attr('disabled', true);
							
							//플로팅레이어가 존재한다면 이쪽도 같이 지워준다.
							if($("div#gd_float_opt_fix").length > 0){
								var opt_layer = div.find("#item_opt_nm"+(opt_idx+1)+"L");
								opt_layer.children("option").remove();
								opt_layer.append($("<option>상위 옵션을 먼저 선택해 주세요.</option>").attr({ value: "" }));
								opt_layer.attr('disabled', true);
							}
							
							opt.change();
							if(color_chip_yn == "Y" && color_chip_val != 1){
								$(".colorChipList").html("");
							}
						}
					}
					if($.type(p.callback) == "function"){	//
						p.callback({curr_idx:opt_idx, next_idx:opt_idx+1});
					}
				},
				//[START]재고알림 옵션 change 이벤트 함수
				changeStockNotiItem:function(p){	//pc, mo 
					var chgObj = p.chgObj;	//현재 변경된 옵션박스
					var div = p.div;	//옵션셀렉트박스가 있는 div
					var slt_opt_val = $(chgObj).children(":selected").data("item_show_nm");
					var opt_idx = +$(chgObj).data("index");
					var curr_opt_nm = "opt_val_nm"+opt_idx;
					var param = p.param;
					
					$.each(div.find("[id^=item_opt_nm]"), function(idx, opt){
						var curr_idx = $(opt).data("index");
						
						if(curr_idx <= opt_idx){
							param["opt_val_nm"+curr_idx] = $(opt).children(":selected").data("item_show_nm");
						}
					});
					
					if($(chgObj).data("last") != "Y" && $(chgObj).attr("value") != ""){

						//다음 옵션을 가져옴 (마지막 옵션일 때는 데이터를 조회하지 않는다.)
						elandmall.optLayerEvt.ajaxItemList({
							param:param,
							success:function(data){
								var opt = div.find("[id^=item_opt_nm"+(opt_idx+1)+"]");
								opt.children("option").remove();
								opt.append($("<option>"+opt.data("opt_nm")+" 옵션을 선택해 주세요.</option>").attr({ value: "" }));
								
								opt.attr('disabled', false);

								$.each(data, function(idx, info) {
									var item_no = info["ITEM_NO"];
									var item_nm = info["ITEM_NM"];
									var sale_poss_qty= info["SALE_POSS_QTY"];
									var opt_val_nm = info["OPT_VAL_NM"+(opt_idx+1)];
									var goods_nm = info["GOODS_NM"];
									var vir_vend_no = info["VIR_VEND_NO"];
									var item_nm_add_info = info["ITEM_NM_ADD_INFO"];
									var item_sale_price = info["ITEM_SALE_PRICE"];
									var opt_low_vend_type_cd = $("#option_low_vend_type_cd").val();
									var sale_price	=	Number($("#resd_sale_price").val());
									var item_opt_li_data;
									
									if(typeof(item_nm_add_info) == "undefined"){
										item_nm_add_info = "";
									}
									
									var optionObj = null;
									if(sale_poss_qty > 0){
										if($("#opt_box").data("opt_val_nm"+(opt_idx+1)) == opt_val_nm){
											optionObj =	$("<option>" + opt_val_nm + item_nm_add_info + "</option>").attr({ value: item_no });
											optionObj.attr("data-item_nm", item_nm);
											optionObj.attr("data-vir_vend_no", vir_vend_no);
											optionObj.attr("data-item_show_nm", opt_val_nm);
											opt.append(
													optionObj
											);
										}
									}else{
										optionObj =	$("<option>" + opt_val_nm + item_nm_add_info + "</option>").attr({ value: item_no });
										optionObj.attr("data-item_nm", item_nm);
										optionObj.attr("data-vir_vend_no", vir_vend_no);
										optionObj.attr("data-item_show_nm", opt_val_nm);
										opt.append(
												optionObj
										);
										
									}
								});
								var lowOpt = div.find("[id^=item_opt_nm]");
								$.each(lowOpt, function(idx, lDiv) {
									if($(chgObj).data("index")+1<$(lDiv).data("index") ){
										$(lDiv).children("option").remove();
										$(lDiv).append($("<option>상위 옵션을 먼저 선택해 주세요.</option>").attr({ value: "" }));
										$(lDiv).attr('disabled', true);
									}
								})
								if($.type(p.callback_ajax) == "function"){	
									p.callback_ajax({curr_idx:opt_idx, next_idx:opt_idx+1, data:data});
								}
							}
						});
						
						
					}else{
						if($(chgObj).val() == ""){
							var opt = div.find("#item_opt_nm"+(opt_idx+1));
							var lowOpt = div.find("[id^=item_opt_nm]");
							$.each(lowOpt, function(idx, lDiv) {
								if($(chgObj).data("index")<$(lDiv).data("index") ){
									$(lDiv).children("option").remove();
									$(lDiv).append($("<option>상위 옵션을 먼저 선택해 주세요.</option>").attr({ value: "" }));
									$(lDiv).attr('disabled', true);
								}
							})
							
							
							opt.change();
						}
					}
					if($.type(p.callback) == "function"){	//
						p.callback({curr_idx:opt_idx, next_idx:opt_idx+1});
					}
				},
				//[END]옵션 change 이벤트 함수
				callCartCheck : function(p){
					var param = p.param;
					$.ajax({
						url: "/goods/getGoodsTypeflagJson.action",
						async : false,
						data: param,
						type: "GET",
						dataType: "json",
						success: function(typeflag) {
							
							if(typeflag == "LOTNOT") {
								alert("현재 배송지는 오늘직송이 불가능합니다.");
								return;
							}
							
							if(typeflag == "DEF"){
								$.ajax({
									url: "/goods/searchAddCartGoodsInfo.action",
									async : false,
									data: param,
									type: "POST",
									dataType: "json",
									success: function(data) {
										var goods_info = data.goodsInfo;
										if(goods_info.RET_CODE != "0000"){
											if(goods_info.RET_CODE == "-0001" || goods_info.RET_CODE == "-0003"){
												alert("판매 중지된 상품입니다.");
												return;
											}else if(goods_info.RET_CODE == "-0058"){
												alert("상품 구매 권한이 없습니다.");
												return;
											}else if(goods_info.RET_CODE == "-0059"){
												alert("구매에 불편을 드려 죄송합니다.\n본 상품은 브랜드와 협의 중인 상품으로,\n기업회원 대상으로 서비스를 확대할 예정입니다.");
												return;
											}else{
												alert("품절된 상품입니다.");
												return;
											}
											
										}else{
											
											var vParam = p.param;	//음... 왜이런걸까
											var pCart_divi_cd = (typeof(vParam.cart_divi_cd)!="undefined")?vParam.cart_divi_cd:"10";
											var pCart_grp_cd = (typeof(vParam.cart_grp_cd) != "undefined"  && vParam.cart_grp_cd != "" ) ? vParam.cart_grp_cd:"10";
											
											var param = {
													goods_no: goods_info.GOODS_NO,
													chk_yn: "Y",
													add_ord_sel_info: "",
													gift_goods_info: "",
													goods_cmps_divi_cd: "10",
													multi_item_yn: goods_info.MULTI_ITEM_YN,
													multi_price_yn: "",
													cart_divi_cd: pCart_divi_cd,	//10: 장바구니, 20: 바로구매
													cart_grp_cd: pCart_grp_cd,	//매장수령(40)
													ord_yn: "N",
													sale_shop_divi_cd: vParam.sale_shop_divi_cd,
													sale_shop_no: vParam.sale_shop_no,
													sale_area_no: vParam.sale_area_no,
													set_goods_no: "",
													conts_dist_no: vParam.conts_dist_no,
													nplus_base_cnt: goods_info.NPLUS_BASE_CNT,
													nplus_cnt: goods_info.NPLUS_CNT,
													sale_unit_qty: goods_info.SALE_UNIT_QTY,
													stock_qty_disp_yn: "",
													sale_price: goods_info.SALE_PRICE,
													item_no: goods_info.ITEM_NO,
													vir_vend_no: goods_info.VIR_VEND_NO,
													ord_qty: goods_info.ORD_QTY
													}
											var items = [];
											
											//사은품이 넘어오면 사은품 설정
											if(typeof(goods_info.gift_goods_info) != "undefind" && goods_info.gift_goods_info != ""){
												param.gift_goods_info = goods_info.gift_goods_info;
											}
											items.push(param);
											
											var cartParam = {
													cart_divi_cd : pCart_divi_cd,
													items:items
											}
											elandmall.cart.addCart(cartParam);
										}
										
									}
								});
							}else if(typeflag == "DNT"){
								alert("해당 상품은 장바구니 담기가 불가 합니다.");
							}else if(typeflag == ""){
								alert("상품정보가 올바르지 않습니다.");
							}else{
								
								if(typeof(p.callback) != "undefined" && typeof(p.callback) == "function"){
									
									p.callback();
								}
							}
						}
					});
				},
				//[START] 세트상품 구성품 변경
				changeSetGoods : function(obj){
					var cmps_grp_seq = $(obj).parent().parent('ul').data("cmps_grp_seq");
					var selectedOpt = $(obj);
					var multi_yn = $(selectedOpt).attr("data-multi_item_yn");	//구성품의 단품유무여부
					var div = $("[id^=setGrp"+cmps_grp_seq+"]");
					var objVal= $(obj).attr("data-value");
					var event_layer_yn = div.find("input[name='event_layer_yn']").val();
					
					var $li = $(obj).parent();
					if(!$li.hasClass('sld_out')){
						$(div).children("ul").children("li:not([id^=li_cmps_goods_grp"+cmps_grp_seq+"])").remove();	//상품선택을 셀렉트를 제외한 나머지 삭제
						$(obj).removeData("cmps_info");	//이전에 기록된 구성품정보는 삭제.
						
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no", objVal);
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no", $(selectedOpt).attr("data-vir_vend_no"));
						
						if(multi_yn != "Y"){ //구성품이 단품 없는 상품이라면, 
							
							//구성품 선택여부 변경 ==> 그룹 선택의 우선 순위가 없기 때문에..
							if(objVal != ""){
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "Y");
							}else{
								$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "N");
							}
							//[NGCPO-6256] 장바구니 수량체크
							$("#cmps_goods_grp"+cmps_grp_seq).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq,"goods_no":objVal, "vir_vend_no":$(selectedOpt).attr("data-vir_vend_no"),"item_no":$(selectedOpt).attr("data-item_no"), "set_cmps_item_no":""+$(selectedOpt).attr("data-set_cmps_item_no"),"sale_poss_qty":$(selectedOpt).attr("data-sale_poss_qty")});
							$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no",$(selectedOpt).attr("data-item_no"));
							$("#cmps_goods_grp"+cmps_grp_seq).attr("data-goods_no",objVal);
							
						}else{ //단품 있는 상품일 때,
							
							elandmall.optLayerEvt.drawItemSelect({obj:obj});
							var goods_no = objVal;
							var vir_vend_no = $(selectedOpt).data("vir_vend_no");
							var set_goods_no = $("#_optChoiceLayer").data("goods_info").goods_no;
							var low_vend_type_cd = $("#_optChoiceLayer").data("goods_info").low_vend_type_cd;
							elandmall.optLayerEvt.ajaxItemList({
								param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no, cmps_grp_seq:cmps_grp_seq, event_layer_yn : event_layer_yn},
								async:false,
								success:function(data){
									var opt = div.find("[id^=options_nm1]");
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
										
										if (  item_sale_price > -1 && low_vend_type_cd != "40"){// 마지막옵션이 아니거나, 패션일땐 가격 표기 안함.
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
										if(sale_poss_qty > 0){
											optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span></span></li>"
											).attr({ "data-value": item_no });
										}else{
											optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
													"<span class='opt_info'><span class='opt_price'><em>"+item_sale_price+"</em></span>"+
													"<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+goods_no+"',vir_vend_no:'"+vir_vend_no+"',item_no:'"+item_no+"',item_nm:'"+opt_val_nm1+"'});\">입고알림신청</a></span></li>"
											).attr({ "data-value": "soldout" });
										}
										optionObj.attr("data-set_cmps_item_no", this.SET_CMPS_ITEM_NO);
										optionObj.attr("data-item_show_nm",opt_val_nm1);
										
										opt.append(
												optionObj
										);
										
									});
									
									//[START] select change event - 첫번째 옵션 ajax call 성공시, select change event 실행
									div.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
										var currObj = $(this);
										var opt_idx = $(this).parent().parent('.options').data('index');
										var $li = $(this).parent();
										//var $hideTg = []; 
										var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
										if(!$li.hasClass('sld_out')){
										//	$hideTg[0] = $(this).parent().parent().parent().parent().parent().siblings('dd'); 
										//	$hideTg[1] = $(this).parent().parent().parent().parent().parent().parent().siblings('dl, .set'); 
											$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
											$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
											$selBtn.find('.sel_txt').attr("data-value",$li.attr('data-value'));
											$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no",currObj.parent().attr("data-value"));
											$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", currObj.parent().attr("data-set_cmps_item_no"));
											$('.lyr_select').removeClass('on');
											$li.addClass('selected').siblings('li').removeClass('selected');
											showText($selBtn);
										//	$($hideTg).each(function(){$(this).show()}});
											elandmall.optLayerEvt.changeItem({
												param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no, cmps_grp_seq:cmps_grp_seq, event_layer_yn : event_layer_yn},
												div:div,
												chgObj:currObj,
												callback_ajax:function(rst){
													var nextOpt = div.find("#options_nm"+rst.next_idx);
													var init_yn = $("#setGrp"+cmps_grp_seq).data("init_yn");
													var preItemInfo = $("#_optChoiceLayer").data("pre_item_info");
													if( typeof(preItemInfo) != "undefined" && init_yn != "Y"){	//,
														var pre_item_val = "";
														
														var strItem_nm = preItemInfo[cmps_grp_seq].item_nm;
														var arrItem_nm = strItem_nm.split("/");
														$.each($(nextOpt).children(), function(idx, optval){
															if(arrItem_nm[+rst.next_idx-1] == $(this).data("item_show_nm")){
																pre_item_val = $(this).val();
															}
														});
														nextOpt.val(pre_item_val);
														nextOpt.change();
														if($(nextOpt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
															$("#setGrp"+cmps_grp_seq).data("init_yn","Y");
														}
													}
												},
												callback:function(result){
													var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
													//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
													var currVal = currObj.parent().attr("data-value");
													if(last_yn== "Y" && currVal != ""){
														if(currVal != ""){
															$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "Y");
														}else{
															$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "N");
														}
														
														$("#cmps_goods_grp"+cmps_grp_seq).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq, "goods_no":goods_no, "vir_vend_no":vir_vend_no,"item_no":currVal, "set_cmps_item_no":""+currObj.parent().attr("data-set_cmps_item_no")});
														//사은품이 있다면
														if($("#giftInfo").length > 0 ){ 
															
														}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
															
														}//[END]사은품이 없을 때 항목을 바로 추가 한다.
														
													}
													
												}//[END]callback function
											});//[END]elandmall.optLayerEvt.changeItem
											function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
												if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
													$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
												}
												else{
													$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
												}
											}
										}
										
									});//[END] item select change event
									
								}
							});
							
						}
						
					}
				},//[END] 세트상품 구성품 변경
				//[START] 묶음상품 구성 변경 이벤트
				changePkgCmpsGoods:function(pin){
					var obj = pin.obj;
					var selectedOpt = $(obj);
					var quickview_yn = "N";
					var scope_div = $("#_optChoiceLayer");
					var multi_yn = $(selectedOpt).attr("data-multi_item_yn");	//구성품의 단품유무여부
					var objVal = $(selectedOpt).attr("data-value");
					var pkg_goods_no = $("#_optChoiceLayer").data("goods_info").goods_no;
					var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
					
					
					var param ={};
					param["goods_no"] = objVal;
					param["vir_vend_no"] = $(selectedOpt).attr("data-vir_vend_no");
					var $li = $(obj).parent();
					var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
					if(!$li.hasClass('sld_out')){
						$("ul#ul_pkgCmpsGoods").children("li:not([id^=li_cmps_goods])").remove();	//상품선택 셀렉트를 제외한 나머지 삭제
						
						$("#pkgCmpsGoods").attr("data-value",$(selectedOpt).attr("data-value"));
						$("#pkgCmpsGoods").attr("data-multi_item_yn",multi_yn);
						$("#pkgCmpsGoods").parent().addClass("selected");
						$("#pkgCmpsGoods").text($(obj).children('.opt_name').text());
						$("#pkgCmpsGoods").attr("data-sel-msg",$(obj).children('.opt_name').text());
						$("#pkgCmpsGoods").attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
						$("#pkgCmpsGoods").attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
						$("#pkgCmpsGoods").attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
						$('.lyr_select').removeClass('on');
						
						$li.addClass('selected').siblings('li').removeClass('selected');
						showText($selBtn);
						if(objVal != ""){		//선택된 값이 있을때만 실행.
							param["opt_layer_yn"] = "Y";
							param["optChoiceLayer_yn"] = "Y"; //상품 옵션 선택 레이어 여부
							elandmall.optLayerEvt.drawPkgCmpsGoodsSelect({
								param:param,
								success:function(rst){
									var html = rst;
									if(multi_yn != 'Y'){
										$("ul#ul_pkgCmpsGoods").append(html);
										
										$("[id^=pkgCmpsGoods]").attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
										$("[id^=pkgCmpsGoods]").attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
										$("[id^=pkgCmpsGoods]").attr("data-goods_no",$(selectedOpt).attr("data-value"));
										$("[id^=pkgCmpsGoods]").attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
										$("[id^=pkgCmpsGoods]").attr("data-multi_item_yn",multi_yn);
										var data = $("#pkgCmpsGoodsInfo","#_optChoiceLayer").data("goods_info").goodsData;
										data[0]["disp_seq"] = $(selectedOpt).data("disp_seq");
										data[0]["vend_nm"] = $(selectedOpt).data("vend_nm");
										
										//사은품이 있을 때
										if( $("#giftInfo").length > 0 ){
											if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
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
												$("[id^=pkgCmpsGoods]").attr("data-choice_yn", "Y");
												if(elandmall.goodsDetail.checkSetGoodsChoice()){
													param["item_no"] = "00000";
													//var param = elandmall.optLayerEvt.addSetGoodsParam();
													elandmall.optLayerEvt.getSetGoodsPrice({
														param:param,
														success:function(data){
															elandmall.goodsDetail.drawAddGoods({
																type:"PKG",
																data:data,
																set_param:param,
																gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).attr("data-gift_nm"),
																gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val(),
																gift_stock_qty:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("stock_qty")
															});
															//elandmall.goodsDetail.sumMultiTotal();
															
														}
													});
													
												}
												
											}
										}else{	//[START]사은품이 없을 때
											$("#pkgCmpsGoods").attr("data-choice_yn", "Y");
											if(elandmall.goodsDetail.checkPkgGoodsChoice()){
												
												elandmall.goodsDetail.drawAddGoods({
													type:"PKG",
													quickview_yn:quickview_yn,
													data:data
												});
												elandmall.goodsDetail.sumMultiTotal();
												
											}else{
												$("#pkgCmpsGoods").data("itemInfo", data);
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
													
												if($(this).children().data('opt_nm') == calenderStr && typeof(param.mobileYn) == "undefined" ){	
													elandmall.goodsDetail.fnSelectPkgBtn($(this), $(obj));
												}
												
											}
											
										});
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
									}else{	//옵션상품일 때,
										var div = $("#_optChoiceLayer");
										$("#ul_pkgCmpsGoods").append(html);
										
										$("[id^=pkgCmpsGoods]").attr("data-disp_seq",$(selectedOpt).data("disp_seq"));
										$("[id^=pkgCmpsGoods]").attr("data-vend_nm",$(selectedOpt).data("vend_nm"));
										$("[id^=pkgCmpsGoods]").attr("data-goods_no",$(selectedOpt).attr("data-value"));
										$("[id^=pkgCmpsGoods]").attr("data-vir_vend_no",$(selectedOpt).data("vir_vend_no"));
										$("[id^=pkgCmpsGoods]").attr("data-multi_item_yn",multi_yn);
										
										var low_vend_type_cd = $("#ul_pkgCmpsGoods", div).find("#item_opt_li_data").data("low_vend_type_cd");
										elandmall.optLayerEvt.ajaxItemList({	//첫번째 옵션 가져오기
											param:{ goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).attr("data-vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no, low_vend_type_cd:low_vend_type_cd ,event_layer_yn : event_layer_yn},
											success:function(data){
												var opt = div.find("[id^=options_nm1]");
												var optBtn =opt.parents('.lyr_select').children('.sel_btn');
												$.each(data, function() {
													var item_no = this.ITEM_NO;
													var opt_val_nm1 = this.OPT_VAL_NM1;
													var sale_poss_qty = this.SALE_POSS_QTY;
													var goods_nm = this.GOODS_NM;
													var item_nm_add_info = this.ITEM_NM_ADD_INFO;
													var item_sale_price = this.ITEM_SALE_PRICE;
													var goods_sale_price = this.GOODS_SALE_PRICE;
													var vir_val_nm1 = $(selectedOpt).attr("data-vir_vend_no");
													var vir_vend_no = this.VIR_VEND_NO;
													var min_sale_price   = this.MIN_SALE_PRICE;
													var low_price_cnt    = Number(this.CNT);
													var price_str		="";
													var show_price = "";
													if(item_sale_price > 0){
														show_price =item_sale_price; 
													}else{
														show_price =goods_sale_price; 
													}
													
													
													if(typeof(item_nm_add_info) == "undefined"){
														item_nm_add_info = "";
													}
													
													if(show_price !="" && show_price !="0"){
														show_price = show_price+"원";
													}
													
													if(optBtn.children('.sel_txt').attr("data-last") !="Y"){
														show_price="";
													}
													
													var optionObj = null;
													if(sale_poss_qty > 0){
														optionObj = $("<li><span class='ancor'><span class='opt_name'>"+opt_val_nm1+"</span>"+
																"<span class='opt_info'><span class='opt_price'><em>"+show_price+"</em></span></span></li>"
														).attr({ "data-value": item_no });
													}else{
														optionObj = $("<li class='sld_out'><span class='ancor'><span class='opt_name'>(품절)"+opt_val_nm1+"</span>"+
																"<span class='opt_info'><span class='opt_price'><em>"+show_price+"</em></span>"+
																"<a class='opt_stock' onclick=\"elandmall.stockNotiMbrLayer({goods_no:'"+$(selectedOpt).attr("data-value")+"',vir_vend_no:'"+$(selectedOpt).data("vir_vend_no")+"',item_no:'"+item_no+"',item_nm:'"+opt_val_nm1+"'});\">입고알림신청</a></span></li>"
														).attr({ "data-value": "soldout" });
													};
													
													optionObj.attr("data-item_show_nm",opt_val_nm1);
													
													opt.append(
															optionObj
													);
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
														}
													}
													
													if($(this).children().data('opt_nm') == calenderStr && typeof(param.mobileYn) == "undefined" ){	
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
												//div.find("[id^=item_opt_nm]").change(function(){
												$('.lyr_options .options li .ancor').click(function(){
													var currObj = $(this);
													var opt_idx = $(this).parents('.options').data('index');
													var $li = $(this).parent();
													var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
													
													if(!$li.hasClass('sld_out')){
														$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
														$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
														$selBtn.find('.sel_txt').attr('data-value',currObj.parent().attr("data-value"));
														$('.lyr_select').removeClass('on');
														$li.addClass('selected').siblings('li').removeClass('selected');
														showText($selBtn);
														elandmall.optLayerEvt.changeItem({
															param: { goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).attr("data-vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no, low_vend_type_cd:low_vend_type_cd ,event_layer_yn : event_layer_yn },
															div:div,
															chgObj:$(this),
															callback:function(result){
																
																var param = { goods_no: $(selectedOpt).attr("data-value"), vir_vend_no: $(selectedOpt).attr("data-vir_vend_no"),pkg_goods_yn:"Y"};
																param["curr_idx"] = opt_idx;
																var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
																var currVal = currObj.parent().attr("data-value");
																if(last_yn == "Y" && currVal != ""){
																	if( low_vend_type_cd == "40" || low_vend_type_cd == "50"){
																		param["vir_vend_no"] = $(selectedOpt).attr("data-vir_vend_no");
																	}
																	param["item_no"] = currVal;
																	
																	//사은품과 수령방법 선택 여부에 관계 없이 상품 옵션을 가져왔다면,
																	//선택 옵션의 정보를 조회 한다.
																	elandmall.optLayerEvt.getItemPrice({
																		param:param,
																		success:function(data){
																			$("#pkgCmpsGoods").data("itemInfo", data);
																		}
																	})
																	
																	
																	
																	//사은품이 있다면
																	if($("#giftInfo").length > 0 ){ 
																		if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																			$("[id^=gift_slt]").prop("disabled", false);
																			
																		}else{	//사은품이 1개일 때,
																			if(elandmall.goodsDetail.checkPkgGoodsChoice()){
																				param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).data("gift_nm");
																				param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val();
																				
																			}
																		}
																	}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
																		$("#pkgCmpsGoods").data("choice_yn", "Y");
																		/*if(elandmall.goodsDetail.checkPkgGoodsChoice()){

																}else{
																	//$("#pkgCmpsGoods").data("itemInfo", param);
																}*/
																		
																	}//[END]사은품이 없을 때 항목을 바로 추가 한다.
																}
															}
														});
													}
													
												});
												//[END] item select change event 
											}
										});
									}
									//elandmall.goodsDetail.sumMultiTotal();
									
								}
							});
							
						}else{	//빈 값이 선택된다면 초기화를 한다.
							$("#pkgCmpsGoods").data("choice_yn", "N");
							$("#pkgCmpsGoods").removeData("itemInfo");
						}
						function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
							if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
								$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
							}
							else{
								$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
							}
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
				drawPkgCmpsGoodsSelect:function(p){ //pc, mo 
					$.ajax({
						url: "/goods/initPkgCmpsGoodsSelect.action",
						data: p.param,
						type: "POST",
						async: false,
						dataType: "html",
						success: function(data) {
							if($.type(p.success) == "function"){
								p.success(data);
							}
						}
					});
				},
				//[START]지점 change 이벤트 함수 
				changeBranch:function(p){
					$("#branchList", "#opt_box").change(function(){
						if($(this).val() != ""){
							//옵션상품일 때, 첫번째 옵션을 조회 및 초기화 한다.
							
							if($("#multi_item_yn","#opt_box").val() == "Y"){
								elandmall.optLayerEvt.ajaxItemList({
									param:{ goods_no: p.goods_no, vir_vend_no: $(this).val()},
									success:function(data){
										$("#item_opt_nm1").val("");
										$("#item_opt_nm1").change();
									}
								});
							}
						}
						
					});
				},
				//[END]지점 change 이벤트 함수
				drawItemSelect : function(pin){	//pc, mo 
					var obj = pin.obj;
					var type = (typeof(pin.type) != "undefined")? pin.type : "P";
					var selectedOpt = $(obj);
					var strOpt_nm = $(selectedOpt).data("stropt_nm");
					var arrOpt_nm = strOpt_nm.split(";");
					var grpSeq = $(obj).parent().parent().data("cmps_grp_seq");
					var optHtml = "";
					$(arrOpt_nm).each(function(idx,name){
						if(type == "M" || type == "ML"){	//모바일
							var addclass ="";
							if(type == "ML"){
								optHtml += "<dt>"+name+"</dt>";
								addclass = "class=\"w100\"";
							}else{
								optHtml += "<dt class=\"ir\"><label for=\"item_opt_nm"+(idx+1)+"\">" + name + "</label></dt>";
							}

							optHtml += "<dd>"
							if((idx+1) == 1){
								optHtml += 		"<div class='lyr_select'>";
							}else{
								optHtml += 		"<div class='lyr_select disabled'>";
							}	
							optHtml +=	"<div class=\"chk_out\"><input type=\"checkbox\" id=\"chk_out1\" class=\"chk_out1\"><label for=\"chk_out1\">품절제외</label></div>"
							optHtml +=		"<button type=\"button\" class=\"sel_btn option\">"
							/*optHtml += 	"<select "+addclass+" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\"" + name + "\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N") + "\""+ ">";*/
							if((idx+1) == 1){
								optHtml +=		"<span class=\"sel_txt\" name=\"opt1\" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\"" + name + "\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N") + "\" >"+name+"을 선택해 주세요.</span>"
							}else{
								optHtml +=		"<span class=\"sel_txt\" name=\"opt1\" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\"" + name + "\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N") + "\" >상위 옵션을 먼저 선택해 주세요.</span>"
							}
							optHtml +=		"</button>"
							optHtml +=		"<div class=\"lyr_options\">"
							optHtml +=			"<ul class=\"options\" name=\"options_nm"+(idx+1)+"\" id=\"options_nm"+(idx+1)+"\"  data-opt_nm=\""+name+"\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N")+ "\" data-ga-select=\"\">";
							optHtml +=			"</ul>";
							optHtml += 		"</div>";
							optHtml += 	"</div>";
							optHtml += "</dd>";
							if(type == "ML"){
								var scope_div = $(obj).parent().parent().parent().parent();
								$("#setGrp"+grpSeq, scope_div).append(optHtml);
							}else{
								$("#setGrp"+grpSeq).append(optHtml);
							}
							optHtml ="";

						}else{
							optHtml += "<li class=\"l_th02\">";
							optHtml += 		"<span class=\"same_th\">"+name+"</span>";
							if((idx+1) == 1){
								optHtml += 		"<div class='lyr_select'>";
							}else{
								optHtml += 		"<div class='lyr_select disabled'>";
							}
							optHtml += 			"<button class='sel_btn option' type='button'>";
							if((idx+1) == 1){
								optHtml += 			"<span class=\"sel_txt\" title=\" "+name+" 선택\" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\""+name+"\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N")+ "\" data-ga-select=\"\">"+name+"을 선택해 주세요.</span>";
							}else{
								optHtml += 			"<span class=\"sel_txt\" title=\" "+name+" 선택\" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\""+name+"\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N")+ "\" data-ga-select=\"\">상위 옵션을 먼저 선택해 주세요.</span>";
							}
							optHtml += 			"</button>";
							optHtml += 			"<div class=\"lyr_options\">";
							optHtml += 				"<div class=\"chk_out\">";
							optHtml += 					"<input id=\"chk_out1\" class=\"chk_out1\" type=\"checkbox\">";
							optHtml += 					"<label for=\"chk_out1\">품절제외</label>";
							optHtml += 				"</div>";
							optHtml += 				"<ul class=\"options\" name=\"options_nm"+(idx+1)+"\" id=\"options_nm"+(idx+1)+"\"  data-opt_nm=\""+name+"\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N")+ "\" data-ga-select=\"\">";
							optHtml += 				"</ul>";
							optHtml += 			"</div>";
							optHtml += 		"</div>";
							optHtml += "</li>";
							
							$("#setGrp"+grpSeq+" > ul").append(optHtml);
							
							if($("div#gd_float_opt_fix").length > 0){	//상품상세의 플로팅레이어가 존재한다면,
								var htmlObj = $.parseHTML(optHtml);
								$("#item_opt_nm"+(idx+1),htmlObj).attr({id:"item_opt_nm"+(idx+1)+"L", "data-layer_yn":"Y"});
								$("#options_nm"+(idx+1),htmlObj).attr({id:"options_nm"+(idx+1)+"L", "data-layer_yn":"Y"});
								
								$("#setGrp"+grpSeq+"L > ul").append(htmlObj);
							}
							
							optHtml ="";
							
						}

					});
					var opt_box = selectedOpt.parents(".opt_box");
					opt_box.find(".chk_out1").click(function(){
						if($(this).is(':checked')){
							if(type == "M" || type == "ML"){
								$(this).parent().siblings('.lyr_options').children('ul').children('.sld_out').hide();
							}else{
								$(this).parent().siblings('ul').children('.sld_out').hide();
							}
						}else{
							if(type == "M" || type == "ML"){
								$(this).parent().siblings('.lyr_options').children('ul').children('.sld_out').show();
							}else{
								$(this).parent().siblings('ul').children('.sld_out').show();
							}
						}
						lyrMax();
						OrderScorller();
					});
					opt_box.find(".sel_btn.option").click(function () {
						 if(!$(this).parent().hasClass('disabled')){
							 	var  optLyr =  $(this).parent('.lyr_select');
								if ($(this).parent().hasClass('on')){
									$(this).parent().removeClass('on');
									if(type == "M" || type == "ML"){
										toggleBt('show', $(this));
										tglBt($(this), 'show'); //NGCPO-5887 : 다른 옵션 가리기
									}
								}
								else{
									$(this).parent().addClass('on');
									if(type == "M" || type == "ML"){
										toggleBt('hide', $(this));
										lyrMax($(this),optLyr);
										tglBt($(this), 'hide'); //NGCPO-5887 : 다른 옵션 가리기
									}
								}
								if(type == "M" || type == "ML"){
									scrollReest($(this));
									showText($(this));
								}
								if(type == "P") {  //PC
									var optDiv =  null;
									if($(this).parent().parent().parent().parent('.on_opt_box').length > 0) { //일반,묶음
										optDiv = $(this).parent().parent().parent().parent('.on_opt_box');
									}else{ //세트
											optDiv = $(this).parent().parent().parent().parent().parent('.on_opt_box');
											if ($(this).parent().hasClass('on')){
											if(optDiv.hasClass('on_opt_box')){commonUI.view.lyrSlt.prototype.lyrMax($(this), optDiv)}
											$('.lyr_select').removeClass('on');
											$(this).parent().addClass('on');
											if($(this).parent().hasClass('hasDefault') && $(this).parent('.hasDefault').find('.dVal').length > 0 && !$(this).hasClass('selected'))  { //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤 //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
												var $li = $(this).parent().parent();
												commonUI.view.lyrSlt.prototype.goToDft($li);
											}
										}
									}

									if(optDiv.length > 0) {
										commonUI.view.lyrSlt.prototype.lyrMax($(this),optDiv);
									}
								} 
							}
					});
					if(type == "M" || type == "ML"){
						opt_box.find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
							var $li = $(this).parent();
							var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
							if(!$li.hasClass('sld_out')){
								$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
								$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
								$('.lyr_select').removeClass('on');
								$li.addClass('selected').siblings('li').removeClass('selected');
								showText($selBtn);
								tglAc($(this), 'show'); //NGCPO-5887 : 다른 옵션 가리기
								toggleBt('show');
								scrollReest($selBtn); //NGCPO-5887 : 스크롤 ( 포커스 ) 이동
							}
						});
						$(window).resize(function() {
							if($('.goods_opt').css('display')=='block'){ // 상품상세 하단 옵션 레이어가 열려있는 경우
								lyrMax();
								OrderScorller();
							}
							else if($('.goods_opt').css('display')=='none') {// 상품상세 하단 옵션 레이어가 닫혀있는 경우
								$('.goods_opt').css({'display':'block','visibility':'hidden'})
								lyrMax();
								OrderScorller();
								$('.goods_opt').removeAttr('style');
							}
						});
					}
				},
				drawItemSelectOrigin : function(pin){	//pc, mo 
					var obj = pin.obj;
					var type = (typeof(pin.type) != "undefined")? pin.type : "P";
					var selectedOpt = $(obj).children("option:selected");
					var strOpt_nm = $(selectedOpt).data("stropt_nm");
					var arrOpt_nm = strOpt_nm.split(";");
					var grpSeq = $(obj).data("cmps_grp_seq");
					var optHtml = "";
					$(arrOpt_nm).each(function(idx,name){
						if(type == "M" || type == "ML"){	//모바일
							var addclass ="";
							if(type == "ML"){
								optHtml += "<dt>"+name+"</dt>";
								addclass = "class=\"w100\"";
							}else{
								optHtml += "<dt class=\"ir\"><label for=\"item_opt_nm"+(idx+1)+"\">" + name + "</label></dt>";
							}

							optHtml += "<dd>"
							optHtml += 	"<select "+addclass+" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\"" + name + "\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N") + "\"" + (((idx+1)>1)?" disabled=\"disabled\"":"") + ">";
							if((idx+1) == 1){
								optHtml +=		"<option value=\"\" selected=\"selected\">" + name + " 옵션을 선택해 주세요.</option>";
							}else{
								optHtml +=		"<option value=\"\" selected=\"selected\">상위 옵션을 먼저 선택해 주세요.</option>";
							}
							optHtml +=	"</select>";
							optHtml += "</dd>";
							if(type == "ML"){
								var scope_div = $(obj).parent().parent().parent().parent();
								$("#setGrp"+grpSeq, scope_div).append(optHtml);
							}else{
								$("#setGrp"+grpSeq).append(optHtml);
							}
							optHtml ="";

						}else{
							optHtml += "<li class=\"l_th02\">";
							optHtml += 		"<span class=\"same_th\">"+name+"</span>";
							optHtml +=		"<select class=\"wide\" title=\" "+name+" 선택\" id=\"item_opt_nm"+(idx+1)+"\" data-opt_nm=\""+name+"\" data-index=\""+(idx+1)+"\" data-last=\""+((arrOpt_nm.length == (idx+1))?"Y":"N")+ "\" data-ga-select=\"\"" + (((idx+1)>1)?" disabled=\"disabled\"":"") + ">";
							if((idx+1) == 1){
								optHtml +=		"<option value=\"\" selected=\"selected\">"+name+" 옵션을 선택해 주세요.</option>";
							}else{
								optHtml +=		"<option value=\"\" selected=\"selected\">상위 옵션을 먼저 선택해 주세요.</option>";
							}
							optHtml +=		"</select>";
							optHtml += "</li>";
							
							$("#setGrp"+grpSeq+" > ul").append(optHtml);
							
							if($("div#gd_float_opt_fix").length > 0){	//상품상세의 플로팅레이어가 존재한다면,
								var htmlObj = $.parseHTML(optHtml);
								$("#item_opt_nm"+(idx+1),htmlObj).attr({id:"item_opt_nm"+(idx+1)+"L", "data-layer_yn":"Y"});
								
								$("#setGrp"+grpSeq+"L > ul").append(htmlObj);
							}
							
							optHtml ="";
							
						}

					});
				},
				//[START] 선택한 세트상품 가격가져오기위한 파라미터 설정
				addSetGoodsParam : function(pin){
					var param = {
							seq_no:[],
							upr_seq_no:[],
							set_goods_no:[],
							goods_no:[],
							vir_vend_no:[],
							item_no:[],
							ord_cnt:[],
							cmps_grp_seq:[],
							set_cmps_item_no:[]
					};
					
					var strId = (typeof(pin) !="undefined" && pin.id != "") ? pin.id : "detailform";
					//var Obj = 
					var seq_no = $("#"+strId).data("seq_no")? +$("#"+strId).data("seq_no"):0;
					seq_no += 1;
					var upr_seq_no = seq_no;
					
					var set_goods_no = $("#goods_no").val();
					var vir_vend_no = "";
					var item_no = "";
					var min_qty = "";
					if(typeof($("#"+strId).data("goods_info")) == "object"){
						set_goods_no = $("#"+strId).data("goods_info").goods_no;
						vir_vend_no = $("#"+strId).data("goods_info").vir_vend_no;
						item_no = $("#"+strId).data("goods_info").item_no;
						min_qty = $("#"+strId).data("goods_info").ord_qty;
					}else{
						set_goods_no = $("#goods_no").val();
						vir_vend_no =$("#vir_vend_no").val();
						item_no = $("#item_no").val();
						min_qty = $("#min_qty").val();
					}
					param["seq_no"].push(seq_no);
					param["upr_seq_no"].push(upr_seq_no);	// 대표상품은 내 자기 자신의 번호를!
					param["set_goods_no"].push(set_goods_no);
					param["goods_no"].push(set_goods_no);
					param["vir_vend_no"].push(vir_vend_no);
					param["item_no"].push(item_no);
					param["ord_cnt"].push(min_qty);
					param["set_cmps_item_no"].push("");
					param["cmps_grp_seq"].push("");
					$("[id^=cmps_goods_grp]","#"+strId).each(function(idx){
						seq_no++;
						param["seq_no"].push(seq_no);
						param["upr_seq_no"].push(upr_seq_no);
						param["set_goods_no"].push(set_goods_no);
						param["ord_cnt"].push($(this).attr("data-cmps_qty"));
						param["cmps_grp_seq"].push($(this).attr("data-cmps_grp_seq"));
						if(typeof($(this).data("cmps_info")) == "object"){
							param["goods_no"].push($(this).data("cmps_info").goods_no);
							param["vir_vend_no"].push($(this).data("cmps_info").vir_vend_no);
							param["item_no"].push($(this).data("cmps_info").item_no);
							param["set_cmps_item_no"].push($(this).data("cmps_info").set_cmps_item_no);
						}else{
							param["goods_no"].push($(this).attr("data-goods_no"));
							param["vir_vend_no"].push($(this).attr("data-vir_vend_no"));
							param["item_no"].push($(this).attr("data-item_no"));
							param["set_cmps_item_no"].push($(this).attr("data-set_cmps_item_no"));
						}
					}); 
					$("#"+strId).data("seq_no", seq_no);	// 시퀀스 번호 저장
					return param;
				},//[END] 선택한 세트상품 가격가져오기위한 파라미터 설정
				//[START]유효성 체크 함수
				validcheck:function(p){
					var scope_div = null;
					if(typeof(p) != "undefined" && typeof(p.obj) != "undefined"){
						scope_div = $("#_optChoiceLayer",p.obj);
					}else{
						scope_div = $("#_optChoiceLayer");
					}
					var passFlag = true;
					
					if(passFlag){
						$("#branchList",scope_div).each(function(){
							if($(this).val() == "" ){
								passFlag = false;
								alert("지점을 선택해 주세요.");
								return false;
							}
						});
					}
					if(passFlag){
						$("[id^=item_opt_nm]",scope_div).each(function(){
							if($(this).attr('data-value') == "" || $(this).attr('data-value') == "soldout" || $(this).attr('data-value') == undefined){
								if($(this).attr('data-sel-msg') == "" || $(this).attr('data-sel-msg') == undefined){
								passFlag = false;
								alert("상품의 옵션을 선택해 주세요.");
								return false;
								}
							}
						});
					}
					if(passFlag){
						$("[id^=cmps_goods_grp]",scope_div).each(function(){
							if($(this).attr("data-goods_no") == "" || $(this).attr("data-item_no") == "" || $(this).attr("data-goods_no") == undefined || $(this).attr("data-item_no") == undefined){
								passFlag = false;
								alert("구성품을 모두 선택해 주세요.");
								return false;
							}
						});
					}
					if(passFlag){
						$("[name^=gift_dtl_no]",scope_div).each(function(){
							if($(this).attr("data-value") == "" || $(this).attr("data-value") == undefined){
								passFlag = false;
								alert("사은품을 모두 선택해 주세요.");
								return false;
							}
						});
						if($("#gift_slt", scope_div).length > 0){
							if($("#gift_slt", scope_div).attr("data-value") == "" || $("#gift_slt", scope_div).attr("data-value") == undefined){
								passFlag = false;
								alert("사은품을 모두 선택해 주세요.");
								return false;
							}
							
						}
							
						var gift_stock_qty = 0;
						var qtyObj = $(":input[name='ord_qty']", scope_div);
						var qty = +(qtyObj.eq(0).val());
						
						if($("#gift_slt", $("#giftInfo", scope_div)).length > 0){
							gift_stock_qty = +$("#gift_slt", $("#giftInfo", scope_div)).children('option:selected').data('stock_qty');
						}else{
							gift_stock_qty = $(":input[name='gift_goods_dtl_no']", $("#giftInfo", scope_div)).data('stock_qty');
						}
						if(gift_stock_qty > 0 && gift_stock_qty < qty){
							alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
							return false;
						}
					}
					if(passFlag){
						$("select#recv_choice",scope_div).each(function(){
							if($(this).val() == "" ){
								passFlag = false;
								alert("수령방법을 선택해 주세요.");
								return false;
							}
						});
					}
					
					if(passFlag){
						var goodsInfo = $(scope_div).data("goods_info");
						if(String(goodsInfo.goods_cmps_divi_cd) == "20"){
							var param = elandmall.optLayerEvt.addSetGoodsParam({id:"_optChoiceLayer"});
							elandmall.optLayerEvt.getSetGoodsPrice({
								param:param,
								async:false,
								success:function(data){
									
									var repData = data[0];
									if(repData.RET_CODE != "0000"){
								    	if(repData.RET_CODE == "-0002" || repData.RET_CODE == "-0005" || repData.RET_CODE == "-0041") {
								    	    alert("상품이 품절 되었습니다.");
								        } else if(repData.RET_CODE == "-0003" ) {
								        	alert("상품이 판매가능한 기간이 아닙니다.");
								        } else {
								        	alert("상품이 판매가 종료되었습니다.");
								        }
								    	
								    	passFlag = false;
								    	return false;
								    }

									
								}
							});
						}
					}
					//alert(passFlag);
					return passFlag;
					
				},
				//[END]유효성 체크 함수
				setSaveParam:function(p){		//pc,mo
					var goodsInfo = p.goods_info;
					var scope_div = null;
					var cart = $.extend({goods_no:"", vir_vend_no:"",item_no:""},goodsInfo);
					if(typeof(p.obj) != "undefined"){
						scope_div = $("#_optChoiceLayer", p.obj);
					}else{
						scope_div = $("#_optChoiceLayer");
					}
					
					if(cart.goods_cmps_divi_cd == "20"){	//세트상품일 때,
						cart.set_items = []
						$("[id^=cmps_goods_grp]",scope_div).each(function(idx){
							 var set_item = $(this).data("cmps_info");
							 cart.set_items.push(set_item);
						});
					}else if(cart.goods_type_cd == "80"){	//묶음상품일 때,
						var selectOpt = $("#pkgCmpsGoods", scope_div);
						var multi_item_yn = $(selectOpt).attr("data-multi_item_yn");
						
						var set_goods_no = goodsInfo.goods_no;
						cart.set_goods_no = set_goods_no;
						var goods_info = null;
						if(multi_item_yn != "Y"){
							goods_info = $("#pkgCmpsGoodsInfo", scope_div).data("goods_info").goodsData;
							
						}else{
							goods_info = $("#pkgCmpsGoods", scope_div).data("itemInfo");
						}
						var vMin_qty  = goods_info[0].ORD_POSS_MIN_QTY;
						var vSale_unit_qty  = goods_info[0].SALE_UNIT_QTY;
						
						if ( vSale_unit_qty > 1) {
							if(vMin_qty <= 1){
								vMin_qty = vSale_unit_qty;
					        }else if( vMin_qty > 1 && ((vMin_qty % + vSale_unit_qty) > 0 )){
					            //나누어 0이 보다 크면 단위수량으로 셋팅 처리 
					        	vMin_qty = Math.ceil(vMin_qty/vSale_unit_qty) * vSale_unit_qty;
					        }    
						}
						
						cart.goods_no = goods_info[0].GOODS_NO;
						cart.item_no = goods_info[0].ITEM_NO;
						cart.vir_vend_no = goods_info[0].VIR_VEND_NO;
						cart.ord_qty = vMin_qty;
						cart.sale_price =  goods_info[0].CUST_SALE_PRICE;
						
					}else{
						if(cart.multi_item_yn == "Y"){
							cart.item_no = $("#item_opt_nm1", scope_div).attr("data-value"); // $(scope_div).data("goods_info").item_no;
						
							cart.ord_qty = "1";
						}
					}
					return cart;
				},
				//[START]
				setCallbackParam:function(p){ 		//pc, mo
					var scope_div = null;
					if(typeof(p) != "undefined" && typeof(p.obj) != "undefined"){
						scope_div = $("#_optChoiceLayer", p.obj);
					}else{
						scope_div = $("#_optChoiceLayer");
					}
					
					var goodsInfo = $(scope_div).data("goods_info");
					
					var cbParam = {};
					
					if(String(goodsInfo.goods_cmps_divi_cd) == "20"){
						cbParam["goods_no"] = String(goodsInfo.goods_no);
						cbParam["item_no"] =  String(goodsInfo.item_no);
						cbParam["cart_grp_cd"] = String(goodsInfo.cart_grp_cd);
						if($("#branchList", scope_div).length > 0){
							cbParam["vir_vend_no"] = $("#branchList", scope_div).val();
							//세트 상품변경에서는 없을듯...
						}else{
							cbParam["vir_vend_no"] =  String(goodsInfo.vir_vend_no);
						}
						cbParam["set_item"] = [];
						$("[id^=cmps_goods_grp]",scope_div).each(function(idx){
							var cmps_info = $(this).data("cmps_info");
							var vGoods_no = String(cmps_info.goods_no);
							var vVir_vend_no = String(cmps_info.vir_vend_no);
							var vItem_no =  String(cmps_info.item_no);
							var vSet_cmps_item_no = String(cmps_info.set_cmps_item_no);
							var vCmps_grp_seq = String($(this).data("cmps_grp_seq"));
							//[NGCPO-6256] 장바구니 수량체크
							var vSale_poss_qty = String(cmps_info.sale_poss_qty);
							var set_item = {cmps_grp_seq:vCmps_grp_seq, goods_no:vGoods_no, vir_vend_no:vVir_vend_no, item_no:vItem_no, set_cmps_item_no:vSet_cmps_item_no, sale_poss_qty:vSale_poss_qty};
							cbParam["set_item"].push(set_item);
						});
						
						//사은품이 있다면..
						//여러사은품이 지급 될 수 있음. ; <-로 사은품상세번호 구분
						var strGiftDtlInfo = "";
						
						if($("#giftInfo", scope_div).length > 0){
							if($("#giftInfo", scope_div).data("multi_yn") == "Y"){
								strGiftDtlInfo = $("#gift_slt", scope_div).attr("data-value");
							}else{
								//여러사은품이 지급 될 수 있음. , <-로 사은품상세번호 구분
								$("select[name=gift_dtl_no]",$("#_optChoiceLayer", scope_div)).each(function(){
									if(strGiftDtlInfo == ""){
										strGiftDtlInfo += $(this).val();
									}else{
										strGiftDtlInfo += "," + $(this).val();
									}
								});
							}
						}
						cbParam["gift_goods_info"] = strGiftDtlInfo;
						
						if($("#ord_qty", scope_div).length>0){
							cbParam["ord_qty"] = $("#ord_qty", scope_div).val();
						}
						
						return cbParam;
					}else{
						cbParam["goods_no"] = String(goodsInfo.goods_no);
						if($("#branchList", scope_div).length > 0){
							cbParam["vir_vend_no"] = $("#branchList", scope_div).val();
							//세트 상품변경에서는 없을듯...
						}else{
							cbParam["vir_vend_no"] =  String(goodsInfo.vir_vend_no);
						}
						if(goodsInfo.multi_item_yn == "Y"){
							cbParam["item_no"] =  $(scope_div).attr("data-item_no");
							cbParam["item_nm"] =  $(scope_div).attr("data-item_nm");
							//[NGCPO-6256] 장바구니 수량체크
							cbParam["sale_poss_qty"] =  $(scope_div).attr("data-sale_poss_qty");
						}else{
							cbParam["item_no"] = String(goodsInfo.item_no);
						}
						
						cbParam["cart_grp_cd"] = String(goodsInfo.cart_grp_cd);
						
						
						//사은품이 있다면..
						//여러사은품이 지급 될 수 있음. ; <-로 사은품상세번호 구분
						var strGiftDtlInfo = "";

						if($("#giftInfo", scope_div).length > 0){
							if($("#giftInfo", scope_div).data("multi_yn") == "Y"){
								strGiftDtlInfo = $("#gift_slt", scope_div).val();
							}else{
								//여러사은품이 지급 될 수 있음. , <-로 사은품상세번호 구분
								$("select[name=gift_dtl_no]", scope_div).each(function(){
									if(strGiftDtlInfo == ""){
										strGiftDtlInfo += $(this).val();
									}else{
										strGiftDtlInfo += "," + $(this).val();
									}
								});
							}
						}
						cbParam["gift_goods_info"] = strGiftDtlInfo;
						if($("#ord_qty", scope_div).length>0){
							cbParam["ord_qty"] = $("#ord_qty", scope_div).val();
						}
						
						return cbParam;
					}
				},
				drawColorChipHtml : function(p){	//pc layer
					var chipHtml = "";
					var curr_opt_idx = p.curr_opt_idx;
					var data = p.data;
					var div = $("#_optChoiceLayer");
					
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
						
						if(typeof(img_path) != "undefined" && img_path != ""){
							chipHtml += "<li>";
							chipHtml += "	<a href=\"javascript:void(0);\" class=\""+a_class_nm+"\" data-item_no=\""+item_no+"\" data-img_seq=\""+img_seq+"\">";
							chipHtml += "		<span class=\"ir\">" + opt_val_nm + "</span>";
							chipHtml += " 		<img src=\""+elandmall.global.upload_image_path+img_path+"\"alt=\"" + opt_val_nm + "\" onerror=\"this.src='"+elandmall.global.image_path+"/images/pcweb/common/web_nocolorchip.gif'\" />";
							chipHtml += " 	</a>"
							chipHtml += "</li>"
						}
					});
					
					$(".colorChipList", div).html(chipHtml);
					$(".colorChipList", div).find("a").click(function(){
						var changeItem_no = $(this).data("item_no");
						//옵션셀렉트박스 설정하고(해당 상품이 품절일 경우 작동X)
						if(!$(this).hasClass("disabled")){
							$("#item_opt_nm"+curr_opt_idx, div).val(changeItem_no);
							$("#item_opt_nm"+curr_opt_idx, div).change();  
						}

					});
				},
				fnSelectLayerItem : function(p){
					p = $.extend({ goods_no: set_goods_no, item_no: "", vir_vend_no: set_vir_vend_no,low_vend_type_cd:set_low_vend_type_cd, quickview_yn:set_quickview_yn }, p || {});
					var quickview_yn = p.quickview_yn;
					var div = null;
					div = $("#_optChoiceLayer");
					
					if($("#_optChoiceLayer").length>1){
						div = $(p.obj).parents("#_optChoiceLayer");
					};
					
					var event_layer_yn = div.find("input[name='event_layer_yn']").val();
					//.sel_txt에 값들 다 세팅해서 처리하자
					var currObj = $(p.obj);
					var opt_idx = $(p.obj).parents('.options').data('index');
					
					var $li = $(p.obj).parent('li');
					var $selBtn = $(p.obj).parent().parent().parent().siblings('.sel_btn');
					if(!$li.hasClass('sld_out')){
						$selBtn.find('.sel_txt').attr('data-sel-msg',$(p.obj).find('.opt_name').text());
						$selBtn.find('.sel_txt').data('sel-msg',$(p.obj).find('.opt_name').text());
						$selBtn.find('.sel_txt').attr("data-value",$li.attr("data-value"));
						
						$("#item_opt_nm1").attr("data-value",$li.attr("data-value"));
						
						div.attr("data-item_no",$li.attr("data-value"));
						div.attr("data-item_nm",$(p.obj).find('.opt_name').text());
						div.data("goods_info").item_no =$li.attr("data-value");
						//[NGCPO-6256] 장바구니 수량체크
						div.attr("data-sale_poss_qty",$li.attr("data-sale_poss_qty"));
						
						$('.lyr_select').removeClass('on');
						$li.addClass('selected').siblings('li').removeClass('selected');
						showText($selBtn);
					}
					
//					var opt = div.find("[id^=options_nm1]");
					
					if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){
						p["reserv_yn"] = "Y";
					}else{
						p["reserv_yn"] = "N";
					}
					var color_chip_val;
					var size_chip_val;
					elandmall.optLayerEvt.changeItem({
						param:{ goods_no: p.goods_no, item_no: p.item_no, vir_vend_no: p.vir_vend_no, low_vend_type_cd: p.low_vend_type_cd, reserv_yn:p.reserv_yn , event_layer_yn : event_layer_yn},
						color_chip_val: color_chip_val,
						color_chip_yn:"Y",
						div:div,
						chgObj:$(p.obj),
						callback_ajax:function(result){
							if(color_chip_val == result.next_idx){
								elandmall.goodsDetail.drawColorChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn});
							}
							if(size_chip_val == result.next_idx){
								elandmall.goodsDetail.drawSizeChipHtml({data:result.data, curr_opt_idx:result.next_idx, quickview_yn:quickview_yn});
							}
						},
						callback:function(result){
							var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
							//var currVal = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').val();
							var currVal = currObj.parent().attr("data-value");
							
							var param = { goods_no: $("#detailform", div).data("goods_no"), vir_vend_no: $("#detailform", div).data("vir_vend_no")};
							param["curr_idx"] = opt_idx;
							if(last_yn == "Y" && currVal != ""){
								//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
								if($("#low_vend_type_cd",$("#detailform", div)).val() == "40"){
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
										if($("#_optChoiceLayer").length==0){
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
									if($("#_optChoiceLayer").length==0){
										elandmall.optLayerEvt.getItemPrice({
											param:param,
											success:function(data){
												elandmall.goodsDetail.drawAddGoods({
													data:data,
													quickview_yn:quickview_yn
												});
											}
										});
									}else{
										currObj.parents('#_optChoiceLayer').data("goods_info").vir_vend_no = currObj.parent().attr("data-vir_vend_no");
										currObj.parents('#_optChoiceLayer').data("goods_info").item_no = currObj.parent().attr("data-value");
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
				fnSelectLayerSetItem : function(obj){
					//goods_no,vir_vend_no,cmps_grp_seq
					var obj = obj.obj;
					var cmps_grp_seq = $(obj).parents('.opt_box').data('cmps_grp_seq');
					var div = $("[id^=setGrp"+cmps_grp_seq+"]");
					var goods_no = $("#cmps_goods_grp"+cmps_grp_seq).attr('data-goods_no');
					var vir_vend_no = $("#cmps_goods_grp"+cmps_grp_seq).attr("data-vir_vend_no");
					var reserv_yn = "N";
					
					var currObj = $(obj);
					var opt_idx = currObj.parent().parent('.options').data('index');
					var $li = currObj.parent();
					var $selBtn = currObj.parent().parent().parent().siblings('.sel_btn');
					if(!$li.hasClass('sld_out')){
						$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
						$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
						$selBtn.find('.sel_txt').attr("data-value",currObj.parent().attr("data-value"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-item_no",currObj.parent().attr("data-value"));
						$("#cmps_goods_grp"+cmps_grp_seq).attr("data-set_cmps_item_no", currObj.parent().attr("data-set_cmps_item_no"));
						$('.lyr_select').removeClass('on');
						$li.addClass('selected').siblings('li').removeClass('selected');
						showText($selBtn);
						if($.type(elandmall.global.app_cd) != "undefined"){	//모바일만
							tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
							scrollReest($selBtn);
						}
						elandmall.optLayerEvt.changeItem({
							param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no, cmps_grp_seq:cmps_grp_seq},
							div:div,
							chgObj:currObj,
							callback_ajax:function(rst){
								var nextOpt = div.find("#options_nm"+rst.next_idx);
								var init_yn = $("#setGrp"+cmps_grp_seq).data("init_yn");
								var preItemInfo = $("#_optChoiceLayer").data("pre_item_info");
								if( typeof(preItemInfo) != "undefined" && init_yn != "Y"){	//,
									var pre_item_val = "";
									
									var strItem_nm = preItemInfo[cmps_grp_seq].item_nm;
									var arrItem_nm = strItem_nm.split("/");
									$.each($(nextOpt).children(), function(idx, optval){
										if(arrItem_nm[+rst.next_idx-1] == $(this).data("item_show_nm")){
											pre_item_val = $(this).val();
										}
									});
									nextOpt.val(pre_item_val);
									nextOpt.change();
									if($(nextOpt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
										$("#setGrp"+cmps_grp_seq).data("init_yn","Y");
									}
								}
							},
							callback:function(result){
								var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
								var currVal = currObj.parent().attr("data-value");
								//[NGCPO-6256] 장바구니 수량체크
								var sale_poss_qty = currObj.parent().attr("data-sale_poss_qty");
								if(last_yn== "Y" && currVal != ""){
									if(currVal != ""){
										$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "Y");
									}else{
										$("#cmps_goods_grp"+cmps_grp_seq).attr("data-choice_yn", "N");
									}
									
									if(goods_no ==undefined){
										goods_no =currObj.parents().find("#_optChoiceLayer").data("goods_info").goods_no
										vir_vend_no =currObj.parents().find("#_optChoiceLayer").data("goods_info").vir_vend_no
									}
									
									//[NGCPO-6256] 장바구니 수량체크
									$("#cmps_goods_grp"+cmps_grp_seq).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq, "goods_no":goods_no, "vir_vend_no":vir_vend_no,"item_no":currVal, "set_cmps_item_no":""+currObj.parent().attr("data-set_cmps_item_no"), "sale_poss_qty":sale_poss_qty});
									//사은품이 있다면
									if($("#giftInfo").length > 0 ){ 
										
									}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
										
									}//[END]사은품이 없을 때 항목을 바로 추가 한다.
									
								}
								
							}//[END]callback function
						});//[END]elandmall.optLayerEvt.changeItem
						function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
							if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
								$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
							}
							else{
								$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
							}
						}
						//[END]elandmall.optLayerEvt.changeItem
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
				fnSelectLayerPkgItem : function(obj){
					
					var obj = obj.obj;
					var goods_no = $("#pkgCmpsGoods").attr('data-goods_no');
					var vir_vend_no = $("#pkgCmpsGoods").attr("data-vir_vend_no");
					var reserv_yn = "N";
					var selectedOpt = "N";
					
					var div = $("#_optChoiceLayer");
					
					if($("#_optChoiceLayer").length>1){
						div = $(p.obj).parents("#_optChoiceLayer");
					};
					
					var currObj = $(obj);
					var opt_idx = currObj.parent().parent('.options').data('index');
					var $li = currObj.parent();
					var $selBtn = currObj.parent().parent().parent().siblings('.sel_btn');
					
					var pkg_goods_no = $("#_optChoiceLayer").data("goods_info").goods_no;
					var low_vend_type_cd = $("#_optChoiceLayer").data("goods_info").low_vend_type_cd;
					
					if(!$li.hasClass('sld_out')){
						$selBtn.find('.sel_txt').attr('data-sel-msg',currObj.find('.opt_name').text());
						$selBtn.find('.sel_txt').data('sel-msg',currObj.find('.opt_name').text());
						$selBtn.find('.sel_txt').attr('data-value',currObj.parent().attr("data-value"));
						$('.lyr_select').removeClass('on');
						$li.addClass('selected').siblings('li').removeClass('selected');
						if($.type(elandmall.global.app_cd) != "undefined"){	//모바일만
							tglAc(currObj, 'show'); //NGCPO-5887 : 다른 옵션 가리기
						}
						showText($selBtn);
						elandmall.optLayerEvt.changeItem({
							param: { goods_no: goods_no, vir_vend_no: vir_vend_no, pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no, low_vend_type_cd:low_vend_type_cd},
							div:div,
							chgObj:$(obj),
							callback:function(result){
								
								var param = { goods_no: goods_no, vir_vend_no: vir_vend_no};
								param["curr_idx"] = opt_idx;
								var last_yn = currObj.parents('.lyr_select').children('.sel_btn').children('.sel_txt').data('last');
								var currVal = currObj.parent().attr("data-value");
								if(last_yn == "Y" && currVal != ""){
									if( low_vend_type_cd == "40" || low_vend_type_cd == "50"){
										param["vir_vend_no"] = currObj.parents('li').data('vir_vend_no');
									}
									param["item_no"] = currVal;
									
									//사은품과 수령방법 선택 여부에 관계 없이 상품 옵션을 가져왔다면,
									//선택 옵션의 정보를 조회 한다.
									elandmall.optLayerEvt.getItemPrice({
										param:param,
										success:function(data){
											$("#pkgCmpsGoods").data("itemInfo", data);
										}
									})
									
									//사은품이 있다면
									if($("#giftInfo").length > 0 ){ 
										if($("#giftInfo").data("multi_yn") == "Y"){	//사은품이 여러개일 때,
											$("[id^=gift_slt]").prop("disabled", false);
											
										}else{	//사은품이 1개일 때,
											if(elandmall.goodsDetail.checkPkgGoodsChoice()){
												param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).data("gift_nm");
												param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val();
												
											}
										}
									}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
										$("#pkgCmpsGoods").attr("data-choice_yn", "Y");
										/*if(elandmall.goodsDetail.checkPkgGoodsChoice()){

								}else{
									//$("#pkgCmpsGoods").data("itemInfo", param);
								}*/
										
									}//[END]사은품이 없을 때 항목을 바로 추가 한다.
								}else{
									//마지막옵션이 아니거나 값이 선택되지 않았을 때,
									if(last_yn == "Y" && currVal == ""){
										if($("#gift_slt", div).length > 0){
											$("[id^=gift_slt]", div).attr("data-value","");
											$("[id^=gift_slt]", div).text("사은품을 선택해주세요.");
											$("[id^=gift_slt]", div).data("sel-msg","");
											$("[id^=gift_slt]", div).parent().removeClass("selected");
											$("[id^=gift_slt]", div).parents(".lyr_select").addClass("disabled");
											$("#gift_slt", div).attr("data-itemInfo","");
										}else{
											$("#pkgCmpsGoods", div).data("choice_yn", "N");
										}
									
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
				// 대상 문자, 최대 크기 , 대체 문자열
				lpad : function(targetStr,maxLength,replaceStr) {
					var addStr = "";
					
					if (typeof(targetStr) != "string") {
						targetStr += "";
					}

					var diffLen = maxLength - targetStr.length;	

					for (var i = 0 ; i < diffLen; ++i) {
						addStr += replaceStr;
					}
			
					return addStr += targetStr
				},
				
		}
		
		/**
		 * 이벤트 상품 관련 함수 
		 * 
		 * */
		elandmall.eventGoods = {
				goodsPreviewLayer : function(pin) {
					var p = $.extend({event_key:""
						 			 ,event_start_date:""
						 			 ,event_end_date:""
									 ,smsg:"",emsg:""
								     ,quickview_yn:"Y"
								     ,event_layer_yn:"Y"
								     ,checkLogin :false
								     ,precheck : true
								     },pin); 
					
					

					var  param = $.extend({goods_no:""},p);
					param.goods_no = p.base_goods_no;
					
					//이벤트 시간 확인
					if(!elandmall.goodsSkipDetail.isEventTimeCheck(param)){
						return;
					}
					
					//품절확인
					if(!elandmall.goodsSkipDetail.isAvailStockCheck(param)){
						return;
					}
					
					if(elandmall.global.chnl_cd == "10") {
						elandmall.goodDetailPreviewLayer.openLayer(p);
					}else{
						if($.type(p.base_goods_no) != "undefined") {
							p.goods_no = p.base_goods_no;
						}
						elandmall.goods.goDetail(p);
					}
				}
		}
})(jQuery);