(function($) {
	
	elandmall.cart.doOrder = function(p, nomember) {
		p = $.extend({ cart_no_list: [], cart_divi_cd: "" }, p);
		if ($.type(p.cart_no_list) != "array" && p.cart_no_list.length == 0) {
			alert("주문상품 정보가 올바르지 않습니다[0]");
			return false;
		};
		if (p.cart_divi_cd != "10" && p.cart_divi_cd != "20") {
			alert("주문상품 정보가 올바르지 않습니다[1]");
			return false;
		};
		if (typeof(p.param_nomember) == "undefined"){
			p.param_nomember = true;
		}
		elandmall.isLogin({
			nomember: p.param_nomember,
			nomember_proc: nomember,  
			login: function(result) {
				
				NetFunnel_Action(  {action_id: elandmall.global.netfunnel_order_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80"},
						{	 success:function(ev,ret){ //성공
									elandmall.cart.doOrderCallback(p, nomember,result);
							 },error:function(ev,ret){ //오류
								 elandmall.outputSeverLog({msg:"ERROR [netfunnel] - doOrder || msg : " + ret.data.msg});
							 	 if(NetFunnel.Util.isRetryEnd()) {
										 alert("죄송합니다.대기열 호출 중 오류가 발생했습니다.");
							 	 }
							 }
					  	}
					  );
				
			
			}
		});		
	};	
	
	
	elandmall.cart.doOrderCallback = function(p, nomember,result) {
		var form = $("<form></form>").attr({
			action: elandmall.util.https("/order/initOrder.action"),
			method: "post"					
		});
		var agreement_layer = undefined;
		$.each(p.cart_no_list, function() {
			form.append($("<input type='hidden' name='cart_no'></input>").val(this));				
		});
		form.append($("<input type='hidden' name='cart_divi_cd'></input>").val(p.cart_divi_cd));
		form.append($("<input type='hidden' name='form_ga_category_nm'></input>").val($('#ga_category_nm').val()));
		form.appendTo("body");
		
		//주문서 진입전 주문 상품 유효성 확인	
		$.ajax({
			url: "/order/orderItemCheckNew.action",  //:NGCPO-706
			data: form.serialize(),
			type: "POST",
			dataType:"json",
			success: function(rs) {
				if ($.type(p.ga_products) == "array" && p.ga_products.length > 0) {	//QA 태깅
					dataLayer.push({
						event: "checkout",
						ecommerce: {
							checkout: {
								actionField: { step: 1 },
								products: p.ga_products
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
					if(rs!= null && rs.goods_list.length > 0) { //더블쿠폰적용:NGCPO-706
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
										form.submit();
								});
								layer.show();
							}
						});
					}else {
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
	
	
	$.fn.numberInput = function(p) {
		var input = this;
		var type = this.attr("type");
		var number = undefined;
		if (type == "text") {			
			number = $("<input type='number'></input>").hide().blur(function(e) {
				e.preventDefault();
				number.hide();
				input.val(number.val()).show();
				if ($.type(p.blur) == "function") {
					p.blur();
				};
			});
			if (input.attr("class")) {
				number.attr("class", input.attr("class"));
			};
			input.after(number).focus(function(e) {
				e.preventDefault();
				if ($.type(p.focus) == "function") {
					p.focus(number);
				};
				input.hide();
				number.show().focus();
			}).blur(function(e) {
				e.preventDefault();
			});
		};
	};	
	
	//[START] LAYER
	
	/*
	 * layer_id : 레이어 아이디
	 * class_name :  레이어 클레스명 , 
	 * rtn_btn_id : 접근성을 위한 focus를 줄 버튼ID
	 * createContent : function이며, {div_content:컨텐츠OBJECT, close:닫기펑션}, div_content에 해당 레이어 내용을 넣어준다.
	 * 
	 * close_call_back :존새시 넣어 준다.
	 */
	elandmall.layer = {
		createLayer: function(p) {
			
			p = $.extend({ layer_id:"_COMMON_LAYER_", class_name: "layer_fix",rtn_btn_id:"", pickup_yn : "N" }, p || {});
			
			//레이어 생성 시, 현재 스크롤 위치를 기억한다.
			scrpos = $(window).scrollTop();
			
			/* close 가 존재하는 경우는 remove를 하지 않는다.
			  레이어가 동일한 경우 중복으로 생성 되므로 한번 clear 처리함 */
			if( $("#"+p.layer_id).length > 0){
				$("#"+p.layer_id).remove();
			}
			
			/* 서로 다른 레이어를 생성하는 경우 이전 레이어를 숨김 처리 한다. */
			if(!(p.layer_id=="reware_layer" && elandmall.global.disp_mall_no=="0000053" && $('.gds_dtl').length>0)){
				if($(".layer_fix").css("display") == "block" || $(".layer_pop").css("display") == "block" || $(".lyr_opc").css("display") == "block" || $(".layer_fix").css("nodim") == "block"){
					$.each($(".layer_fix, .layer_pop, .lyr_opc, .nodim"), function() {
					    layer_fix_close($(this).attr("id"));
					});
				}
			}
			
			//닫기버튼 텍스트 추가 - 16.03.28, 이태영 
			var close_btn_txt = "팝업 닫기";
			if($.type(p.close_btn_txt) != "undefined"){
				close_btn_txt = p.close_btn_txt;
			}
			
				
			var div;
			var html = "";
			
			if ( p.class_name.indexOf("layer_fix") > -1 ){
				if(p.pickup_yn == 'Y') {  //선물하기 레이어 일때
					html = 	"<div>" +
					"	<h3 class=\"pop_tit\">" + p.title + "</h3>" +
					"		<div class=\"pop_con gift\">" +
					"		</div>" +
					"	<a href=\"javascript:;\" class=\"btn_close\" ><span class=\"ir\">"+close_btn_txt+"</span></a>" +
					"</div>";
				}else{
					html = 	"<div>" +
					"	<h3 class=\"pop_tit\">" + p.title + "</h3>" +
					"		<div class=\"pop_con\">" +
					"		</div>" +
					"	<a href=\"javascript:;\" class=\"btn_close\" ><span class=\"ir\">"+close_btn_txt+"</span></a>" +
					"</div>";
				}

			}else{
				html = 	"<div>" +
							"	<div class=\"pop_con\">" +
							"		<h3 class=\"pop_tit\">" + p.title + "</h3>" +
							"		<a href=\"javascript:;\" class=\"btn_close\" ><span class=\"ir\">"+close_btn_txt+"</span></a>" +
							"	</div>" +
							"</div>";
			}
			
			div = $(html).addClass(p.class_name).attr("id", p.layer_id);
			
			var close;
			if($.type(p.close_call_back) == "function") {
				close = p.close_call_back;
				
			}else {
				close =  function() {
					layer_fix_close(p.layer_id);
					
					//리턴정보 활성화 처리 
					if($.type(p.rtn_btn_id) == "string" && p.rtn_btn_id != ""){
						$(p.rtn_btn_id).focus();
					}
					return false;
				};				
			};
			
			var div_content = $("<div class=\"pop_txt post\"></div>");
			if(p.tooltip_yn == "Y"){
				div_content = $("<div class=\"tooltip_lyr\"></div>");
			}
			
			if(p.pickup_yn == 'Y') { 
				div_content = div;
			}else{
				
				if ( p.class_name.indexOf("layer_fix") > -1 ){
					div.find(".pop_con").append(div_content);
				}else{
					div.find(".pop_tit").after(div_content);
				}
			}
			
			// title이 없을경우 제거
			if ( $.type(p.title) == "undefined" ){
				div.find(".pop_tit").remove();
			}
			//닫기 버튼 텍스트를 입력 받은 경우, 닫기버튼 텍스트를 보여준다. - 16.03.28, 이태영
			if($.type(p.close_btn_txt) != "undefined"){
				div.find("a.btn_close").children('span').removeClass('ir');
			}
			
			//닫기 버튼이 필요없는 경우 삭제 한다. ex) close_btn_no : 'Y'
			if($.type(p.close_btn_no) != "undefined" && p.close_btn_no == "Y"){
				div.find("a.btn_close").remove();
			}
			
			p.createContent({
				div_content: div_content,
				close: close,
				show : function(){
					div.appendTo("body");
					fn_layer_open(p.layer_id);
				}
			});	//내용을 만든다.
			
			div.find("a.btn_close").click(close);
		/*				
			var $window = $(window);
			var $body = $("body");
			var scroll = $window.scrollTop();
			var bodyHeight = $body.height();
			var layerHeight = div.height();
			
			var _top = ( bodyHeight <= layerHeight ) ? scroll : ( bodyHeight - layerHeight )/4 + scroll ;
			var _onCss = {"top" : _top };
			//div.appendTo("body");			
			//해당화면으로 포커스를 줘야 함 body를 생성후 넣어야 함
			div.css(_onCss).attr("tabIndex","0").addClass("on").focus();
			*/
		},
		

		createLayerForLayer: function(p) {
			
			p = $.extend({ layer_id:"_COMMON_LAYER_", class_name: "layer_fix",rtn_btn_id:""}, p || {});
			
			//레이어 생성 시, 현재 스크롤 위치를 기억한다.
			scrpos = $(window).scrollTop();
			
			/* close 가 존재하는 경우는 remove를 하지 않는다.
			  레이어가 동일한 경우 중복으로 생성 되므로 한번 clear 처리함 */
			if( $("#"+p.layer_id).length > 0){
				$("#"+p.layer_id).remove();
			}
			
			/* 서로 다른 레이어를 생성하는 경우 이전 레이어를 숨김 처리 한다. */
			if(!(p.layer_id=="reware_layer" && elandmall.global.disp_mall_no=="0000053" && $('#bundle_detail').length>0)){
				$.each($(".layer_con"), function() {
				    layer_fix_close($(this).attr("id"));
				});
			}
			
			//닫기버튼 텍스트 추가 - 16.03.28, 이태영 
			var close_btn_txt = "팝업 닫기";
			if($.type(p.close_btn_txt) != "undefined"){
				close_btn_txt = p.close_btn_txt;
			}
			
				
			var div;
			var html = "";
			
			if ( p.class_name.indexOf("layer_fix") > -1 ){
				html = 	"<div>" +
							"	<h3 class=\"pop_tit\">" + p.title + "</h3>" +
							"		<div class=\"pop_con\">" +
							"		</div>" +
							"	<a href=\"javascript:;\" class=\"btn_close\" ><span class=\"ir\">"+close_btn_txt+"</span></a>" +
							"</div>";
			}else{
				html = 	"<div>" +
							"	<div class=\"pop_con\">" +
							"		<h3 class=\"pop_tit\">" + p.title + "</h3>" +
							"		<a href=\"javascript:;\" class=\"btn_close\" ><span class=\"ir\">"+close_btn_txt+"</span></a>" +
							"	</div>" +
							"</div>";
			}
			
			div = $(html).addClass(p.class_name).attr("id", p.layer_id);
			
			var close;
			if($.type(p.close_call_back) == "function") {
				close = p.close_call_back;
				
			}else {
				close =  function() {
					layer_fix_close2(p.layer_id);
					
					//리턴정보 활성화 처리 
					if($.type(p.rtn_btn_id) == "string" && p.rtn_btn_id != ""){
						$(p.rtn_btn_id).focus();
					}
					return false;
				};				
			};
			
			var div_content = $("<div class=\"pop_txt\"></div>");
			if(p.tooltip_yn == "Y"){
				div_content = $("<div class=\"tooltip_lyr\"></div>");
			}
			

			if ( p.class_name.indexOf("layer_fix") > -1 ){
				div.find(".pop_con").append(div_content);
			}else{
				div.find(".pop_tit").after(div_content);
			}
			
			// title이 없을경우 제거
			if ( $.type(p.title) == "undefined" ){
				div.find(".pop_tit").remove();
			}
			//닫기 버튼 텍스트를 입력 받은 경우, 닫기버튼 텍스트를 보여준다. - 16.03.28, 이태영
			if($.type(p.close_btn_txt) != "undefined"){
				div.find("a.btn_close").children('span').removeClass('ir');
			}
			
			p.createContent({
				div_content: div_content,
				close: close,
				show : function(){
					div.appendTo("body");
					fn_layer_open(p.layer_id);
				}
			});	//내용을 만든다.
			
			div.find("a.btn_close").click(close);

		},
		
		createLayerCustom: function(p) {
			
			p = $.extend({ layer_id:"_COMMON_LAYER_", class_name: "layer_fix",rtn_btn_id:""}, p || {});
			
			//레이어 생성 시, 현재 스크롤 위치를 기억한다.
			scrpos = $(window).scrollTop();
			
			/* close 가 존재하는 경우는 remove를 하지 않는다.
			  레이어가 동일한 경우 중복으로 생성 되므로 한번 clear 처리함 */
			if( $("#"+p.layer_id).length > 0){
				$("#"+p.layer_id).remove();
			}
			
			/* 서로 다른 레이어를 생성하는 경우 이전 레이어를 숨김 처리 한다. */
			$.each($(".layer_fix, .layer_pop, .lyr_opc, .nodim"), function() {
			    layer_fix_close($(this).attr("id"));
			});
			
			//닫기버튼 텍스트 추가 - 16.03.28, 이태영 
			var close_btn_txt = "팝업 닫기";
			if($.type(p.close_btn_txt) != "undefined"){
				close_btn_txt = p.close_btn_txt;
			}
			
				
			var div;
			var html = "";
			
			html = 	"<div>" +
					"	<div class=\"pop_con "+p.con_cls_name+"\">" +
					"		<h3 class=\"pop_tit\">" + p.title + "</h3>" +
					"	</div>" +
					"</div>";
			
			div = $(html).addClass(p.class_name).attr("id", p.layer_id);
			
			var div_content = $("<div class=\"pop_txt\"></div>");
			
			div.find(".pop_tit").after(div_content);
			
			// title이 없을경우 제거
			if ( $.type(p.title) == "undefined" ){
				div.find(".pop_tit").remove();
			}
			
			p.createContent({
				div_content: div_content,
				show : function(){
					div.appendTo("body");
					fn_layer_open(p.layer_id);
				}
			});	//내용을 만든다.
			
			div.find("a.btn_close").click(close);
		}

		
	};
	//[END] LAYER
	
	/**
	 * 카테고리, 브랜드 전체보기
	 */
	elandmall.header = {
			
			//넘어갈 때 현재 url 지정, 닫기 버튼 눌렀을 때 해당 페이지롱 이동하도록
			fnShowLeftMenu : function(p){
				location.href = "/dispctg/showLeftMenu.action";
			},
			
			//카테고리 전체보기(회원등급조회)
			fnSearchCtgList : function(p){	
				p = $.extend({ disp_ctg_no:null, previewYn: null }, p || {});
				
				//최초 1회 view
				if($.trim($("#left_menu_top").html()) == ""){
				
					$("#left_menu_top").load("/dispctg/searchGnbAllCategoryList.action", p , function () {
						//OPEN
						$('#lnb').show();
						translateX("lnb", 100, 250);
						$('.lnb_dim').css({'display':'block'});
						$('html, body').css(	{'position':'fixed'});
				        $('body').bind('touchmove', function (e) { e.preventDefault(); });
				        $('body').css('overflow-y', 'hidden');

				        if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
				    		//do not iScroll
				    	} else {
							LnbCtgScroller();
							scroll_lnb_count01++;
							setTimeout(function(){LnbCtgScroll.refresh()}, 200);
				        }
						//ga태깅
						_google_analytics('#lnb');

						if(elandmall.global.app_cd != ""){
							location.href="elandbridge://tabbar/hide/";
						}
						
					});
				} else {
					
					//OPEN
					$('#lnb').show();
					translateX("lnb", 100, 250);
					$('.lnb_dim').css({'display':'block'});
					$('html, body').css(	{'position':'fixed'});
			        $('body').bind('touchmove', function (e) { e.preventDefault(); });
			        $('body').css('overflow-y', 'hidden');

			        if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
			    		//do not iScroll
			    	} else {
						if(scroll_lnb_count01 == 0) {
							LnbCtgScroller();
							scroll_lnb_count01++;
						}

						//LnbMlstScroller();
						//setTimeout(function(){LnbMlstScroll.refresh()}, 200);
						setTimeout(function(){LnbCtgScroll.refresh()}, 200);
			        }

					if(elandmall.global.app_cd != ""){
						location.href="elandbridge://tabbar/hide/";
					}
				}
			},
			
			fnSearchCtgListForBrand : function(){	
				//최초 1회 view
				if($.trim($("#left_menu_top").html()) == ""){
				
					$("#left_menu_top").load("/dispctg/searchGnbAllCategoryList.action", function () {
						//OPEN
						$('#lnb').show();
						translateX("lnb", 100, 250);
						$('.lnb_dim').css({'display':'block'});	
						$('html, body').css(	{'position':'fixed'});
				        $('body').bind('touchmove', function (e) { e.preventDefault(); });
				        $('body').css('overflow-y', 'hidden');

				        if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
				    		//do not iScroll
				    	} else {
							if(scroll_lnb_count01 == 0) {
								LnbCtgScroller();
								LnbCtgScroll.scrollToElement('.new_brand',0);
								scroll_lnb_count01++;
							}else{
								LnbCtgScroll.scrollToElement('.new_brand',0);
							}
						
							setTimeout(function(){LnbCtgScroll.refresh()}, 200);
				        }

						//ga태깅
						_google_analytics('#lnb');

						if(elandmall.global.app_cd != ""){
							location.href="elandbridge://tabbar/hide/";
						}
						
					});
					
				} else {
					
					//OPEN
					$('#lnb').show();
					translateX("lnb", 100, 250);
					$('.lnb_dim').css({'display':'block'});
					$('html, body').css(	{'position':'fixed'});
			        $('body').bind('touchmove', function (e) { e.preventDefault(); });
			        $('body').css('overflow-y', 'hidden');

			        if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
			    		//do not iScroll
			    	} else {
						if(scroll_lnb_count01 == 0) {
							LnbCtgScroller();
							LnbCtgScroll.scrollToElement('.new_brand',0);
							scroll_lnb_count01++;
						}else{
							LnbCtgScroll.scrollToElement('.new_brand',0);
						}

						setTimeout(function(){LnbCtgScroll.refresh()}, 200);
			        }

					if(elandmall.global.app_cd != ""){
						location.href="elandbridge://tabbar/hide/";
					}
				}
				
			},
			
			//카테고리 전체보기(회원등급조회) : 앱 하단 버튼
			fnSearchCtgListApp : function(){	
				//최초 1회 view
				if($.trim($("#left_menu_top").html()) == ""){
				
					$("#left_menu_top").load("/dispctg/searchGnbAllCategoryList.action", function () {
						//OPEN
						$('#lnb').show();
						translateX("lnb", 100, 250);
						$('.lnb_dim').css({'display':'block'});
						$('html, body').css(	{'position':'fixed'});
				        $('body').bind('touchmove', function (e) { e.preventDefault(); });
				        $('body').css('overflow-y', 'hidden');

				        if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
				    		//do not iScroll
				    	} else {
							if(scroll_lnb_count01 == 0) {
								LnbCtgScroller();
								scroll_lnb_count01++;
							}
							
							setTimeout(function(){LnbCtgScroll.refresh()}, 200);
				        }

						//ga태깅
						_google_analytics('#lnb');

						if(elandmall.global.app_cd != ""){
							location.href="elandbridge://tabbar/hide/";
						}
						
					});
				}else {
					$(".ctg_btn > a").click();
				}
				
				
			},
			//브랜드 전체보기
			fnSearchBrandList : function(){
				//최초 1회 view
				if($.trim($("#tabLoad").html()) == ""){
					$("#tabLoad").load("/dispctg/searchBrandIndexBaseInfo.action?keyword=ㄱ"+"&tabindex=1");
//					if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
//						//do not iScroll
//					} else {
//						setTimeout(function(){LnbCtgScroll.refresh()}, 200);
//					}
				}
			},
			//이랜드브랜드 보기
			fnShowElandMade : function(){
				//최초 1회 view
				if($.trim($(".layer_eland_made > div").html()) == ""){
					$(".layer_eland_made > div").load("/dispctg/searchElandMadeInfo.action",{},function(){
						$(".layer_eland_made > div").find('a').eq(0).focus();
						
					});
//					if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {  // iSCRoll - iOS가 아닐경우만 실행
//						//do not iScroll
//					} else {
//						setTimeout(function(){LnbCtgScroll.refresh()}, 200);
//					}
				}
			},
			//left메뉴 닫기
			fnLeftClose : function(){
				if(elandmall.global.app_cd != ""){
					location.href="elandbridge://tabbar/show/";
					
					if ($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) ){
						location.href="elandbridge://backBrowser/";
					}
				}
			},
			//검색 열기
			fnSchOpen : function(){
				if(elandmall.global.app_cd != ""){
					if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
						$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
					};
					var aIframe = $("<iframe name=\"_FORM_SEARCH_APP_TARGET\" id=\"_FORM_SEARCH_APP_TARGET\" />");
	                aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
	                aIframe.attr("src", "elandbridge://search/");
	                aIframe.appendTo('body');
	                
					location.href="elandbridge://tabbar/hide/";
				}
			},
			//검색 닫기
			fnSchClose : function(){
				if(elandmall.global.app_cd != ""){
					$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
					location.href="elandbridge://tabbar/show/";
				}
			}, 
			fnBarCodeOpen : function(){
				if(elandmall.global.app_cd != ""){
					location.href="elandbridge://barcodeSearch/";
				}
			}
	};
	
	/**
	 * 상세검색
	 */
	elandmall.SearchFilter = {
		//검색 열기
		fnDetailSchOpen : function(){
			if(elandmall.global.app_cd != ""){
				location.href="elandbridge://tabbar/hide/";
			}
		}, 
		//검색 닫기
		fnDetailSchClose : function(){
			if(elandmall.global.app_cd != ""){
				location.href="elandbridge://tabbar/show/";
			}
		}
	};
	
	/**
	 * 찜담기 완료 후 메세지 처리
	 */
	wishlistComplete = function(s){

		var title = "";
		var p={};
		if(data.rel_divi_cd=="10"){
			title = "상품";
			p.tab='1';
		}else if(data.rel_divi_cd=="20"){
			title = "브랜드";
			p.tab='2';
		}else if(data.rel_divi_cd=="30"){
			title = "기획전";
			p.tab='3';
		}else if(data.rel_divi_cd=="40"){
			title = "카테고리";
			p.tab='4';
		}else if(data.rel_divi_cd=="50"){
			title = "검색어";
			p.tab='5';
		}else if(data.rel_divi_cd=="60"){
			title = "셀프스타일링";
			p.tab='6';
		}
		
		var cont = '';
	/*	if(s == 'DUPL'){
			if(confirm('찜 목록에 있는 '+title+'입니다.<br>찜 목록으로 이동하시겠습니까?')){
				elandmall.mypage.link.wishlist(p);
			}
		}else{
			
			if(data.rel_divi_cd=="10"){
				if(confirm("선택하신 상품을 찜 목록에 추가하였습니다.<br>찜 목록으로 이동하시겠습니까?")){
					elandmall.mypage.link.wishlist(p);
				}
			}else{
				if(confirm(title+'가(이) 정상적으로 저장되었습니다.<br>마이페이지 > 나의 찜목록 에서 확인하세요.')){
					elandmall.mypage.link.wishlist(p);
				}
			}
		}*/
		
	var str = "";
	if(s == 'DUPL'){
		str = '<p class="ico"><em>찜 목록에</em></p><p>이미 등록되어 있습니다.</p>';
	}else if(s == 'DISA'){
		str = '<p class="ico">구매에 불편을 드려 죄송합니다.<br/>본 상품은 브랜드와 협의 중인 상품으로,<br/>기업회원 대상으로 서비스를 확대할 예정입니다.</p>';
	}else{
		str = '<p class="ico"><em>찜 목록에</em></p><p>추가되었습니다.</p>';
		var currentZimCnt = $("#zim_cnt").text();
		$("#zim_cnt").text(Number(currentZimCnt)+1);
	}
		
	var layerHtmml = "";	
	layerHtmml+='<div class="layer_pop nodim pop_zzim" style="display: none;">';
	layerHtmml+='    <section class="pop_con">';
	layerHtmml+='		<div class="pop_txt">';
	layerHtmml+='			<div class="zzim_box alC">';
	layerHtmml+=str;
	if(s == 'DISA'){
		layerHtmml+='			</div>';
		layerHtmml+='		</div>   ';
	} else {
		if(elandmall.global.disp_mall_no == '0000053'){
			layerHtmml+='			<p class="etc">장바구니 <em>찜한상품</em>에서 <br>확인 하실 수 있습니다.</p>';
		}else{
			layerHtmml+='			<p class="etc">마이페이지 <em>나의 찜목록</em>에서 <br>확인 하실 수 있습니다.</p>';
		}
		layerHtmml+='			</div>';
		layerHtmml+='		</div>   ';
		layerHtmml+='		<a href="javascript:;" class="btn_close" onclick="$(\'.layer_pop.pop_zzim\').remove();"><span class="ir">팝업 닫기</span></a>';
	}
	layerHtmml+='	</section>';
	layerHtmml+='</div>';
	
	$('body').append(layerHtmml);
	
	
	//$(".btn_wish").unbind("click");
			
	$(".layer_pop.pop_zzim").show();
	
    setTimeout(function() { 
        $(".layer_pop.pop_zzim").fadeOut(200);
        $('.layer_pop.pop_zzim').remove();
    }, 2000); 
    
/*    $(".layer_pop.pop_zzim .btn_close").bind("click", function(){
        $(".layer_pop.pop_zzim").fadeOut(200);
    });*/
    
	}
	
	//옵션변경
	elandmall.itemChangeLayer = function(p){
		if(typeof(p.goods_no) == "undefined"){
			alert("유효한 데이터 값이 아닙니다.");
			return;
		}
		if(typeof(p.click_obj) == "undefined"){
			alert("클릭오브젝트를 설정해 주세요.");
			return;
		}
		var gubun = (typeof(p.gubun) != "undefined") ? p.gubun : "LST";
		var scope_div = null;
		
		if(gubun == "LST"){
			scope_div = $(p.click_obj).parent().parent().parent().parent();
		}else{
			scope_div = $(p.click_obj).parent().parent();
		}
		var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
		
		var lyrParam = {
				goods_no: p.goods_no,
				item_no: p.item_no,
				vir_vend_no: p.vir_vend_no,
				cart_divi_cd:p.cart_divi_cd,
				cart_grp_cd:p.cart_grp_cd,
				set_cmps_item_nos:p.set_cmps_item_nos,
				gift_goods_info:p.gift_goods_info,
				ord_qty:p.ord_qty,
				set_goods_no: p.set_goods_no, 
				cmps_grp_seq: p.cmps_grp_seq,
				gubun:p.gubun
			} 
		var ajaxExec = true;
		if($("#_optChoiceLayer", scope_div).length > 0 && $("#_optChoiceLayer", scope_div).is(":visible")){
			if(gubun == "CART"){
				$("#_optChoiceLayer").remove();
				ajaxExec = false;
			}else{
				if(p.cart_divi_cd == "10"){
					if($("#_optChoiceLayer").filter(".cart").length > 0 && $("#_optChoiceLayer").filter(".cart").is(":visible")){
						$("#_optChoiceLayer").remove();
						ajaxExec = false;
					}
				}else{
					if($("#_optChoiceLayer").filter(".buy").length > 0 && $("#_optChoiceLayer").filter(".buy").is(":visible")){
						$("#_optChoiceLayer").remove();
						ajaxExec = false;
					}
				}
			}
		}
		if(ajaxExec){
			$.ajax({
				url: "/goods/initGoodsItemChangeLayer.action",
				data: lyrParam,
				async:true,
				type: "POST",
				dataType: "html",
				success: function(html) {
	
					if($("#_optChoiceLayer").length > 0 && $("#_optChoiceLayer").is(":visible")){
						$("#_optChoiceLayer").remove();
					}
					
					if(gubun == "LST"){
						if(p.cart_divi_cd == "10"){
							if($(".buy#_optChoiceLayer", scope_div).length > 0 && $("#_optChoiceLayer", scope_div).filter(".buy").is(":visible")){
								$(".buy#_optChoiceLayer", scope_div).removeClass("newdiv");
								$(".buy#_optChoiceLayer", scope_div).slideUp(200,function(){
									$("#_optChoiceLayer", scope_div).filter(".opt_open.buy").remove();
									
								});
								$(scope_div).append($(html));
								$(scope_div).find(".cart#_optChoiceLayer").slideToggle(200);
							}else{
								$(scope_div).append($(html));
								$(scope_div).find("#_optChoiceLayer").slideToggle(200);
							}
						}else{
							if($(".cart#_optChoiceLayer", scope_div).length > 0 && $(".cart#_optChoiceLayer", scope_div).is(":visible")){
								$(".cart#_optChoiceLayer", scope_div).removeClass("newdiv");
								$(".cart#_optChoiceLayer", scope_div).slideUp(200,function(){
									
									$(".cart#_optChoiceLayer", scope_div).remove();
									
								});
								$(scope_div).append($(html));
								$(scope_div).find(".buy#_optChoiceLayer").slideToggle(200);
							}else{
								$(scope_div).append($(html));
								$(scope_div).find("#_optChoiceLayer").slideToggle(200);
							}
								
						}
						
						
					}else{
						$(scope_div).append($(html));
						$(scope_div).find("#_optChoiceLayer").slideToggle(200);
						
					}
					
					if(typeof(p.load_callback) == "function"){
						p.load_callback();
					}
					
					var goodsInfo = $(scope_div).find("#_optChoiceLayer").data("goods_info");
					var cart_divi_cd = $(scope_div).find(".newdiv#_optChoiceLayer").data("cart_divi_cd")+"";
					var pre_item_info = $("#_optChoiceLayer", scope_div).data("pre_item_info");		// 이전 설정 값
					
					$("#_optChoiceLayer").find('.lyr_select .sel_btn').click(function(){ // 셀렉트 박스 클릭 시, 상품 옵션 선택 레이어 토글
						 if(!$(this).parent().hasClass('disabled')){
						 	var  optLyr =  $(this).parent('.lyr_select');
							if ($(this).parent().hasClass('on')){
								$(this).parent().removeClass('on');
								toggleBt('show');
								if(goodsInfo.goods_cmps_divi_cd == "20"){
									tglBt($(this), 'show'); //NGCPO-5887 : 다른 옵션 가리기
									scrollReest($(this)); //NGCPO-5887 : 스크롤 ( 포커스 ) 이동
								}
							}
							else{
								$(this).parent().addClass('on');
								toggleBt('hide');
								lyrMax($(this),optLyr);
								if(goodsInfo.goods_cmps_divi_cd == "20"){
									tglBt($(this), 'hide'); //NGCPO-5887 : 다른 옵션 가리기
									scrollReest($(this));
								}
							}
							showText($(this));
						}
					});

					$("#_optChoiceLayer", scope_div).find('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
						var $li = $(this).parent();
						var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
						if(!$li.hasClass('sld_out')){
							$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
							$('.lyr_select').removeClass('on');
							$li.addClass('selected').siblings('li').removeClass('selected');
							showText($selBtn);
							toggleBt('show');
						}
					});

					$("#_optChoiceLayer", scope_div).find(".chk_out1").click(function(){
						if($(this).is(':checked')){
							$(this).parent().siblings('.lyr_options').children('ul').children('.sld_out').hide();
						}else{
							$(this).parent().siblings('.lyr_options').children('ul').children('.sld_out').show();
						}
						lyrMax();
					});
					
					//layer.show();					
					//지점상품이면서 방문수령일 때,
					//elandmall.optLayerEvt.changeBranch({goods_no:p.goods_no});
					
					if( goodsInfo.multi_item_yn == "Y" ){	//옵션상품일 때, 조회한다
						elandmall.optLayerEvt.ajaxItemList({
							param:{ goods_no: p.goods_no, item_no: p.item_no,low_vend_type_cd:goodsInfo.low_vend_type_cd, vir_vend_no: p.vir_vend_no , event_layer_yn : event_layer_yn, set_goods_no: p.set_goods_no, cmps_grp_seq: p.cmps_grp_seq},
							success:function(data){
								var opt = $(scope_div).find("#options_nm1");
								$selBtn =opt.parents('.lyr_select').children('.sel_btn');
								
								//opt.append($("<option>선택하세요.</option>").attr({ value: "" }));
								$.each(data, function() {
									var item_no = this.ITEM_NO;
									var opt_val_nm1 = this.OPT_VAL_NM1;
									var sale_poss_qty = this.SALE_POSS_QTY;
									var vir_vend_no = this.VIR_VEND_NO;
									var cancle_poss_yn = this.CANCLE_POSS_YN;
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
										if($("#reserv_limit_divi_cd").val() == "10" || $("#reserv_limit_divi_cd").val() == "20"){	// 예약일 때,
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
									optionObj.attr("data-vir_vend_no",vir_vend_no);
									optionObj.attr("data-item_show_nm",opt_val_nm1);
									//[NGCPO-6256] 장바구니 수량체크
									optionObj.attr("data-sale_poss_qty",sale_poss_qty);
									
									if(typeof(cancle_poss_yn) != "undefined" && cancle_poss_yn != ""){
										optionObj.attr("data-cancle_poss_yn",cancle_poss_yn);
									}
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
								//$(scope_div).find("[id^=item_opt_nm]").change(function(){
								scope_div.find('.lyr_options .options li .ancor').click(function(){
									var $li = $(this).parent();
									var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
									if(!$li.hasClass('sld_out')){
										$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
										$selBtn.find('.sel_txt').data('sel-msg',$(this).find('.opt_name').text());
										
										$selBtn.find('.sel_txt').attr('data-sel-cd', $(this).parent().attr('data-code'));
										
										$selBtn.find('.sel_txt').attr("data-value",$li.attr('data-value'));
										$('.lyr_select').removeClass('on');
										$li.addClass('selected').siblings('li').removeClass('selected');
										showText($selBtn);
										toggleBt('show');
										
										elandmall.optLayerEvt.changeItem({
											param:{ goods_no: p.goods_no, item_no: p.item_no, low_vend_type_cd:goodsInfo.low_vend_type_cd, vir_vend_no: p.vir_vend_no, set_goods_no: p.set_goods_no, cmps_grp_seq: p.cmps_grp_seq},
											div:scope_div,
											chgObj:$(this),
											callback_ajax:function(result){
												var next_slt = scope_div.find("#item_opt_nm"+result.next_idx);
												if(typeof(pre_item_info)!="undefined" && pre_item_info["init_yn"] != "Y"){	//,
													var pre_item_val = "";
													$.each($(next_slt).children(), function(idx, optval){
														if(pre_item_info["opt_val_nm"+result.next_idx] == $(this).text()){
															pre_item_val = $(this).val();
														}
													});
													$(next_slt).val(pre_item_val);
													$(next_slt).change();
													if($(next_slt).attr("data-last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
														if(typeof(pre_item_info)!="undefined"){
															pre_item_info["init_yn"]="Y";
														}
														
													}
												}
											},
											callback:function(result){
												if($("#item_opt_nm"+result.curr_idx, $("#_optChoiceLayer", scope_div)).attr("data-last")== "Y" && $("#item_opt_nm"+result.curr_idx, $("#_optChoiceLayer",scope_div)).attr("data-value") != ""){
													
													$("#_optChoiceLayer", scope_div).attr("data-item_no", $("#item_opt_nm"+result.curr_idx, $("#_optChoiceLayer",scope_div)).attr("data-value"));
													$("#_optChoiceLayer", scope_div).attr("data-item_nm", $("#item_opt_nm"+result.curr_idx, $("#_optChoiceLayer",scope_div)).attr("data-item_show_nm"));
													//[NGCPO-6256] 장바구니 수량체크
													$("#_optChoiceLayer", scope_div).attr("data-sale_poss_qty", $li.attr("data-sale_poss_qty"));
													
													var sltVir_vend_no = p.vir_vend_no;
													//출고지가 패션브랜드인 상품일 때, 마지막에 선택한 옵션의 가상업체 번호로 교체해 준다.
													if(goodsInfo.low_vend_type_cd == "40" || goodsInfo.low_vend_type_cd == "50"){
														sltVir_vend_no = $("#item_opt_nm"+result.curr_idx, $("#_optChoiceLayer",scope_div)).attr("data-item_show_nm");
													}
													elandmall.optLayerEvt.getItemPrice({
														param:{goods_no: p.goods_no, vir_vend_no: sltVir_vend_no, item_no: $("#item_opt_nm"+result.curr_idx, $("#_optChoiceLayer",scope_div)).attr("data-value")},
														success:function(data){
															//마지막 옵션 선택 시, 최소수량 설정
															if(gubun == "LST"){
																goodsInfo.ord_qty = data[0].ORD_POSS_MIN_QTY;
															}else{
																$("#qty_box", scope_div).data("sale_poss_qty", data[0].SALE_POSS_QTY);
																$("#qty_box", scope_div).data("max_qty", data[0].ORD_POSS_MAX_QTY);
																$("#qty_box", scope_div).data("min_qty", data[0].ORD_POSS_MIN_QTY);
																//$("#ord_qty", scope_div).val(data[0].ORD_POSS_MIN_QTY); ....? 하는게 맞나..
															}
														}
													});
													
													
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
	
								});
								//[END] item select change event 
								
								if(typeof(pre_item_info)!="undefined" &&pre_item_info["init_yn"] != "Y"){	//첫번째 옵션값 
									
									var pre_item_val = "";
									
									$.each($(opt).children(), function(idx, optval){
										if(pre_item_info["opt_val_nm1"] == $(this).text()){
											pre_item_val = $(this).attr("data-value"); 
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
					elandmall.optLayerEvt.initopt({obj:scope_div});
					
					if(typeof(pre_item_info) != "undefined"){
						//사은품이 있다면,
						if(typeof(pre_item_info["gift_goods_info"]) != "undefined"){
							var strGiftInfo = "";
							strGiftInfo = "" + pre_item_info["gift_goods_info"];
							var arrGiftInfo = strGiftInfo.split(",");
							$("select[id^=gift_slt]", scope_div).each(function(idx,key){
								$(this).val(arrGiftInfo[idx]);
							});
						}
						//수량세팅
						if(typeof(pre_item_info["ord_qty"]) != "undefined"){
							$("#ord_qty", scope_div).val(pre_item_info["ord_qty"]);
						}
					}
					
					
					$("#item_layer_change_button", scope_div).click(function() {	//변경완료 클릭시 선택된 단품정보 리턴
						
						
						if(!elandmall.optLayerEvt.validcheck({obj:scope_div})){
							return;
						}
						
						var max_idx = $(scope_div).data("max_opt_cnt");
						if(max_idx =="" || max_idx ==undefined){
							max_idx = scope_div.find("#_optChoiceLayer").data("pre_item_info").max_opt_cnt;
						}
						
						var opt = scope_div.find("#item_opt_nm"+max_idx);
						
						var strGiftDtlInfo = "";
						
						if ($.type(p.callback) == "function") {
							var callback_param = elandmall.optLayerEvt.setCallbackParam({obj:scope_div});
							p.callback(callback_param);
	
						};
					});
					
					$("#item_layer_save_button, #item_layer_ord_button", scope_div).click(function(){
						if(!elandmall.optLayerEvt.validcheck({obj:scope_div})){
							return;
						}
						var strGiftDtlInfo = "";
						//사은품이 있다면..
						if($("#giftInfo", $("#_optChoiceLayer",scope_div)).length > 0){
							if($("#giftInfo", $("#_optChoiceLayer", scope_div)).data("multi_yn") == "Y"){
								strGiftDtlInfo = $("#gift_slt").val();
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
						
						goodsInfo.gift_goods_info = strGiftDtlInfo;
						if($("#recev_slt", $("#_optChoiceLayer",scope_div)).length > 0){
							if($('.gd_opt_scroll').length>0){
								goodsInfo.cart_grp_cd = $("#recev_slt", $("#_optChoiceLayer", scope_div)).val();
							}else{
								goodsInfo.cart_grp_cd = $(this).parents().find("#_optChoiceLayer",scope_div).data("goods_info").cart_grp_cd;
							}
						}
						
						var saveParam = elandmall.optLayerEvt.setSaveParam({goods_info:goodsInfo, obj:scope_div});
						var carts = [];
						carts.push(saveParam);
						var items = [];
						$.each(carts, function() {
							items.push(this);
						});
						//return;
						elandmall.cart.addCart({ 
							cart_divi_cd: cart_divi_cd,
							items: items
						});
					});
					
				}	//[END] success function
			});	//[END] ajax 종료
		}
	};
	
	elandmall.goodsOptFnc = {
			//[START]수량증가
			setPlus : function (p){
				var scope_div = $(p.obj).parents("#_optChoiceLayer");
				var goods_info = $(scope_div).data("goods_info");
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var qtyObj = $(":input#ord_qty",  scope_div);
				var addQty = +((goods_info.goods_type_cd == "50") ? 1 : sale_unit_qty);
				if ( (+(qtyObj.eq(0).val())%addQty) > 0 ) {
					qtyObj.eq(0).val(0);
				}
				var qty = +(qtyObj.eq(0).val()) + addQty;		// 현 개수+판매단위수량
				
				//사실상.. 옵션변경 레이어에서는 필요 없는로직인듯..?
				if(goods_info.goods_cmps_divi_cd == "20"){
					//구성품의 재고수량 체크
					if( !elandmall.goodsDetail.checkCmpsGoodsQty({classkey:p.classkey, qty:qty, scope_div:scope_div}) ){
						return;
					}
				}
				
				// n+1 체크 추가
				var nplusChkParam = $.extend({ord_qty:qty},p);
				if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
					return;
				}
				var ord_qty = 0;
				if(p.sale_poss_qty < qty){
					ord_qty = p.sale_poss_qty;
				}
				if(p.max_qty > 0 && (qty > +(p.max_qty) )) {
					ord_qty = p.max_qty
				}
				
				if ( ord_qty > 0 ){
					alert("상품은 최대 "+ord_qty+"개까지 주문 가능합니다.");
					if ( ord_qty%sale_unit_qty != 0 ){
						ord_qty = parseInt(ord_qty/sale_unit_qty)*sale_unit_qty;
					}
					$("#ord_qty",scope_div).val(ord_qty);
					return;
				}
				
				elandmall.goodsOptFnc.setPlusOrd(qtyObj, addQty);
				
				
			},//[END]수량증가
			//[START]수량감소
			setMinus : function (p){
				var scope_div = $(p.obj).parents("#_optChoiceLayer");
				var goods_info = $(scope_div).data("goods_info");
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var qtyObj = $(":input#ord_qty",  scope_div);
				var addQty = +((goods_info.goods_type_cd == "50") ? 1 : sale_unit_qty);
				if ( (+(qtyObj.eq(0).val())%addQty) > 0 ) {
					qtyObj.eq(0).val(addQty*2);
				}
				var qty = +(qtyObj.eq(0).val()) - addQty;		// 현 개수+판매단위수량
				
				if(+p.min_qty > 1  && p.min_qty > qty){
					alert("수량은 "+ p.min_qty +"개 이상만 입력 가능 합니다.");
					qtyObj.val(p.min_qty);	
				} else {
					elandmall.goodsOptFnc.setMinusOrd(qtyObj, addQty);
				}
			},//[END]수량감소			
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
			//[START] 키패드 수량입력 체크
			checkKeyPressQty :function(p){
				var scope_div = $(p.obj).parents("#_optChoiceLayer");
				var goods_info = $(scope_div).data("goods_info");
				var sale_unit_qty = p.sale_unit_qty > 0 ? +p.sale_unit_qty : 1;
				var qty_objs = $(":input#ord_qty", scope_div);
				
				if(!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105)){
					var regexp = /[^0-9]/gi;
					var v = $(p.obj).val();
					if (regexp.test(v)) {
						$(qty_objs).val(v.replace(regexp, ''));
					}
					if(event.keyCode == 8){
						return;
					}
				}

				var input_qty = +$(p.obj).val();
				var alert_yn = false;
				var alert_qty = 0;
				var vMsg = "";
				var update_qty = +input_qty;
				
				if ($.isNumeric(update_qty) === true) {
					update_qty = +input_qty;
					if ( goods_info.goods_type_cd != "50" && sale_unit_qty > 1 ){
						update_qty = parseInt(update_qty/sale_unit_qty)*sale_unit_qty;
					}
				}
				
				if((+p.min_qty > 1 && update_qty < +p.min_qty) || update_qty == 0){
					alert_qty = p.min_qty;
					vMsg = "수량은 "+ p.min_qty +"개 이상만 입력 가능 합니다.";
				}else if(p.sale_poss_qty < update_qty){
					alert_qty = p.sale_poss_qty;
					vMsg = "상품은 최대 "+p.sale_poss_qty+"개까지 주문 가능합니다.";
				}else if(p.max_qty > 0 && (update_qty > +(p.max_qty) )) {
					alert_qty = p.max_qty;
					vMsg = "상품은 최대 "+p.max_qty+"개까지 주문 가능합니다.";
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
				
				
				// n+1 체크 추가
				var nplusChkParam = $.extend({ord_qty:input_qty},p);
				if(elandmall.optLayerEvt.nplusQtycheck(nplusChkParam)){
					return;
				}
				
				var gift_stock_qty = 0;
				if($("#giftInfo", scope_div).length > 0){
					if($("#gift_slt", scope_div).length > 0){
						var selectedGift = $("#gift_slt", scope_div).children("option:selected");
						gift_stock_qty = +$(selectedGift).data("stock_qty");
					}else if($("input[name=gift_goods_dtl_no]", scope_div).length > 0){
						gift_stock_qty = +$("input[name=gift_goods_dtl_no]", scope_div).data("stock_qty");
					}
					if(gift_stock_qty > 0 && gift_stock_qty < input_qty){
						alert("준비되어 있는 사은품 수량은 "+gift_stock_qty+"개 입니다.\n상품은 최대 "+gift_stock_qty+"개까지 주문 가능합니다.");
						$(qty_objs).val(gift_stock_qty);
						return;
					}	
				}
				
				qty_objs.val(update_qty);
				
				var priceObj =$(":input[name='sale_price']", $(".L"+p.classkey, scope_div));
				$(".itemPrc", $(".L"+p.classkey, scope_div)).html(elandmall.util.toCurrency( +(priceObj.eq(0).val()) * +(qty_objs.eq(0).val())) );
				
			},//[END] 키패드 수량입력 체크
			//[START] 세트상품 구성품 변경
			changeSetGoods : function(obj){
				
				var scope_div = null;
				if($(obj).hasClass(".cart .buy")){
					scope_div = $(obj).parent().parent().parent().parent();
				}else{
					scope_div = $(obj).parent().parent().parent().parent();
				} 
				
				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
				var cmps_grp_seq = $(obj).data("cmps_grp_seq");
				var selectedOpt = $(obj).children("option:selected");
				var multi_yn = $(selectedOpt).data("multi_item_yn");	//구성품의 단품유무여부
				var div = $("[id^=setGrp"+cmps_grp_seq+"]", scope_div);
				
				$(div).children(":not([id^=li_cmps_goods_grp"+cmps_grp_seq+"])").remove();	//상품선택을 셀렉트를 제외한 나머지 삭제
				$(obj).removeData("cmps_info");	//이전에 기록된 구성품정보는 삭제.
				if(multi_yn != "Y"){ //구성품이 단품 없는 상품이라면, 
					
					//구성품 선택여부 변경 ==> 그룹 선택의 우선 순위가 없기 때문에..
					if($(obj).val() != ""){
						$("#cmps_goods_grp"+cmps_grp_seq, scope_div).attr("data-choice_yn", "Y");
					}else{
						$("#cmps_goods_grp"+cmps_grp_seq, scope_div).attr("data-choice_yn", "N");
					}
					$("#cmps_goods_grp"+cmps_grp_seq, scope_div).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq,"goods_no":$(selectedOpt).val(), "vir_vend_no":$(selectedOpt).data("vir_vend_no"),"item_no":$(selectedOpt).data("item_no"), "set_cmps_item_no":""+$(selectedOpt).data("set_cmps_item_no")});
					
					
				}else{ //단품 있는 상품일 때,
					
					elandmall.optLayerEvt.drawItemSelectOrigin({obj:obj, type:"ML"});
					var goods_no = $(selectedOpt).val();
					var vir_vend_no = $(selectedOpt).data("vir_vend_no");
					var set_goods_no = $("#_optChoiceLayer", scope_div).data("goods_info").goods_no;
					elandmall.optLayerEvt.ajaxItemList({
						param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no, cmps_grp_seq:cmps_grp_seq , event_layer_yn : event_layer_yn},
						async:false,
						success:function(data){
							var opt = div.find("[id^=item_opt_nm1]");
							$.each(data, function() {
								var item_no = this.ITEM_NO;
								var opt_val_nm1 = this.OPT_VAL_NM1;
								var sale_poss_qty = this.SALE_POSS_QTY;
								var set_cmps_item_no = this.SET_CMPS_ITEM_NO;
								var item_nm_add_info = this.ITEM_NM_ADD_INFO;
								if(typeof(item_nm_add_info) == "undefined"){
									item_nm_add_info = "";
								}
								
								var optionObj  = null;
								
								if(sale_poss_qty > 0){
									optionObj = $("<option>" + opt_val_nm1 + item_nm_add_info+"</option>").attr({ value: item_no });
								}else{
									optionObj = $("<option> (품절)" + opt_val_nm1 + item_nm_add_info+"</option>").attr({ value: "soldout" });
								}
								optionObj.attr("data-set_cmps_item_no", set_cmps_item_no);
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
									param:{ goods_no: goods_no, vir_vend_no: vir_vend_no, set_goods_yn:"Y", set_goods_no:set_goods_no, cmps_grp_seq:cmps_grp_seq},
									div:div,
									chgObj:currObj,
									callback_ajax:function(rst){
										var nextOpt = div.find("#item_opt_nm"+rst.next_idx);
										var init_yn = $("#setGrp"+cmps_grp_seq, scope_div).data("init_yn");
										var preItemInfo = $("#_optChoiceLayer", scope_div).data("pre_item_info");
										if( typeof(preItemInfo) != "undefined" && init_yn != "Y"){	//,
											var pre_item_val = "";
											
											var strItem_nm = preItemInfo[cmps_grp_seq].item_nm;
											var arrItem_nm = strItem_nm.split("/");
											$.each($(nextOpt).children(), function(idx, optval){
												if(arrItem_nm[+rst.next_idx-1] == $(this).text()){
													pre_item_val = $(this).val();
												}
											});
											nextOpt.val(pre_item_val);
											nextOpt.change();
											if($(nextOpt).data("last") == "Y"){	// 해당 옵션이 마지막이라면, 초기화 완료 처리.
												$("#setGrp"+cmps_grp_seq, scope_div).data("init_yn","Y");
											}
										}
									},
									callback:function(result){
										
										if(currObj.data("last")== "Y" && currObj.val() != ""){
											if($(obj).val() != ""){
												$("#cmps_goods_grp"+cmps_grp_seq, scope_div).attr("data-choice_yn", "Y");
											}else{
												$("#cmps_goods_grp"+cmps_grp_seq, scope_div).attr("data-choice_yn", "N");
											}

											$("#cmps_goods_grp"+cmps_grp_seq, scope_div).data("cmps_info",{"cmps_grp_seq":cmps_grp_seq, "goods_no":$(selectedOpt).val(), "vir_vend_no":$(selectedOpt).data("vir_vend_no"),"item_no":currObj.val(), "set_cmps_item_no":""+$(currObj).children("option:selected").data("set_cmps_item_no")});
											//사은품이 있다면
											if($("#giftInfo", scope_div).length > 0 ){ 

											}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.

											}//[END]사은품이 없을 때 항목을 바로 추가 한다.
										
										}
										
									}//[END]callback function
								});//[END]elandmall.optLayerEvt.changeItem

							});//[END] item select change event
							
						}
					});
					
				}
			},//[END] 세트상품 구성품 변경
			//[START] 묶음상품 구성 변경 이벤트
			changePkgCmpsGoods:function(pin){
				var obj = pin.obj;
				var selectedOpt = $(obj).children("option:selected");
				var multi_yn = $(selectedOpt).data("multi_item_yn");	//구성품의 단품유무여부
				var pkg_goods_no = $("#_optChoiceLayer").data("goods_info").goods_no;
				var param ={};
				
				var scope_div = $(pin.obj).parent().parent().parent().parent();
		
				var event_layer_yn = scope_div.find("input[name='event_layer_yn']").val();
				
				param["goods_no"] = $(selectedOpt).val();
				param["vir_vend_no"] = $(selectedOpt).data("vir_vend_no");
				
				
				$("dl#dl_pkgCmpsGoods", scope_div).children(":not([id^=dd_cmps_goods])", scope_div).remove();	//상품선택 셀렉트를 제외한 나머지 삭제
				if($(obj).val() != ""){		//선택된 값이 있을때만 실행.
					param["opt_layer_yn"] = "Y";
					elandmall.optLayerEvt.drawPkgCmpsGoodsSelect({
						param:param,
						success:function(rst){
							
							var html = rst;
							$("#dl_pkgCmpsGoods", scope_div).append(html);
							if(multi_yn != 'Y'){
								
								var data = $("#pkgCmpsGoodsInfo",$("#_optChoiceLayer", scope_div)).data("goods_info").goodsData;
								
								//사은품이 있을 때
								if( $("#giftInfo", scope_div).length > 0 ){
									if($("#giftInfo", scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,

									}else{	//사은품이 1개일 때,
										
										if(elandmall.goodsDetail.checkSetGoodsChoice()){
	
											//var param = elandmall.optLayerEvt.addSetGoodsParam();
											elandmall.optLayerEvt.getSetGoodsPrice({
												param:param,
												success:function(data){
													elandmall.goodsDetail.drawAddGoods({
														type:"PKG",
														data:data,
														set_param:param,
														gift_nm:$("[name=gift_goods_dtl_no]", $("#giftInfo","#detailform")).data("gift_nm"),
														gift_goods_dtl_no:$("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val()
													});
													elandmall.goodsDetail.sumMultiTotal();
													
												}
											});
											
										}
	
									}
								}else{	//[START]사은품이 없을 때
									$("#pkgCmpsGoods", scope_div).data("choice_yn", "Y");

								}//[END]사은품이 없을 때
								
							}else{	//옵션상품일 때,
								var div = $("#_optChoiceLayer", scope_div);
								
								
							//	$("#ul_pkgCmpsGoods", scope_div).append(html);
								elandmall.optLayerEvt.ajaxItemList({	//첫번째 옵션 가져오기
									param:{ goods_no: $(selectedOpt).val(), vir_vend_no: $(selectedOpt).data("vir_vend_no"),pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no,event_layer_yn: event_layer_yn},
									success:function(data){
										var opt = div.find("[id^=item_opt_nm1]");
										
										$.each(data, function() {
											var item_no = this.ITEM_NO;
											var opt_val_nm1 = this.OPT_VAL_NM1;
											var item_nm_add_info = this.ITEM_NM_ADD_INFO;
											if(typeof(item_nm_add_info) == "undefined"){
												item_nm_add_info = "";
											}
											var optionObj = null;
											optionObj = $("<option>" + opt_val_nm1 + item_nm_add_info + "</option>").attr({ value: item_no });
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
												param: { goods_no: $(selectedOpt).val(), vir_vend_no: $(selectedOpt).data("vir_vend_no"), pkg_goods_yn:"Y", pkg_goods_no:pkg_goods_no},
												div:div,
												chgObj:$(this),
												callback:function(result){
														
													var param = { goods_no: $(selectedOpt).val(), vir_vend_no: $(selectedOpt).data("vir_vend_no")};
													param["curr_idx"] = opt_idx;
													if(currObj.data("last") == "Y" && currObj.val() != ""){
														
														param["item_no"] = currObj.val();
														
														//사은품과 수령방법 선택 여부에 관계 없이 상품 옵션을 가져왔다면,
														//선택 옵션의 정보를 조회 한다.
														elandmall.optLayerEvt.getItemPrice({
															param:param,
															success:function(data){
																$("#pkgCmpsGoods").data("itemInfo", data);
															}
														})
														
														
														
														//사은품이 있다면
														if($("#giftInfo", scope_div).length > 0 ){ 
															if($("#giftInfo", scope_div).data("multi_yn") == "Y"){	//사은품이 여러개일 때,
																$("[id^=gift_slt]", scope_div).prop("disabled", false);

															}else{	//사은품이 1개일 때,
																if(elandmall.goodsDetail.checkPkgGoodsChoice()){
																	param["gift_nm"] = $("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).data("gift_nm");
																	param["gift_goods_dtl_no"] = $("[name=gift_goods_dtl_no]",$("#giftInfo","#detailform")).val();
																	
																}
															}
														}else{	//[START]사은품이 없을 때 항목을 바로 추가 한다.
															$("#pkgCmpsGoods", scope_div).data("choice_yn", "Y");
															//if(elandmall.goodsDetail.checkPkgGoodsChoice()){

															//}else{
																//console.log("여기 지나감");
																//$("#pkgCmpsGoods").data("itemInfo", param);
															//}
															
														}//[END]사은품이 없을 때 항목을 바로 추가 한다.
													}
												}
											});
	
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
			}//[END] 묶음상품 구성 변경 이벤트
	}
	
	if (!elandmall.map) {
		elandmall.map = {};
	};
	/**
	 * 매장 정보 조회 레이어
	 */
	elandmall.map.viewShopLayer = function(p) {
		elandmall.layer.createLayer({
			title: "매장 위치 보기",
			rtn_btn_id: p.rtn_btn_id,
			createContent: function(layer) {
				layer.div_content.load("/order/viewShopMap.action", {
					vend_no: p.vend_no,
					vir_vend_no: p.vir_vend_no,
					cust_prod_yn: p.cust_prod_yn,
					shopcode : p.shopcode,
					brand_nm : p.brand_nm
				}, function() {
					if (layer.div_content.find("#field_shop_nm").length > 0) {
						layer.div_content.find("#close_shop_map_layer_button").click(function(e) {
							e.preventDefault();
							layer.close();
							if(elandmall.global.app_cd != ""){
							     location.href="elandbridge://header/show/";
							}
						});
						layer.div_content.parent().find("div.lay_tit>strong").text(layer.div_content.find("#field_shop_nm").text());
						
						layer.show();
						
						if(elandmall.global.app_cd != ""){
						     location.href="elandbridge://header/hide/";
						}
						
						fnKakaoMap({
							shop_loca: layer.div_content.find("#field_shop_address").text(), div_id: "field_shop_map_div", width: 'auto', height: 336
						});
						
					} else {
						alert("죄송합니다. 매장정보를 조회할 수 없습니다.");
					};					
				});
			}
		});
	};
		
	
	//상품 검색 팝업
	elandmall.custcenter.goodsSearchPopup = {
			
    	callback : function(){},	
    	param : {},
    	type : "",
    	close : function(){

			layer_fix_close("goods_search_popup");
			
			//앱 툴바 보이기
			if(elandmall.global.app_cd != ""){
			     location.href="elandbridge://tabbar/show/";
			}    		
    	},
        open : function(p, callback){ // 팝업 호출
        	
        	elandmall.custcenter.goodsSearchPopup.callback = callback;
        	//elandmall.custcenter.goodsSearchPopup.param = p;
        	elandmall.custcenter.goodsSearchPopup.type = p.type;
    		elandmall.layer.createLayer({
    			layer_id:"goods_search_popup",
    			class_name:"layer_fix popup_cs",
    			title: p.title,
    			createContent: function(layer) {
    				var div = layer.div_content;
    				div.load("/custcenter/openGoodsSearchPopup.action?type="+p.type, function() {
    					layer.show();

    					//앱 툴바 숨기기
    					if(elandmall.global.app_cd != ""){
					       location.href="elandbridge://tabbar/hide/";
					    }
    					
    					// 선택 버튼 이벤트
    					elandmall.custcenter.goodsSearchPopup.eventSelectBtn();
    					
    					//취소, 닫기, 버튼
    					$('#cancelBtn, #closeBtn, .btn_close').unbind("click").click(function(){
    						elandmall.custcenter.goodsSearchPopup.close();			
    					});
    					
    					
    					if(p.type=='01'){//주문 팝업
    						//기간 검색 이벤트 설정
    						fn_common_search_period(elandmall.custcenter.goodsSearchPopup.searchData);	
    						
    						//로딩시 1개월 기본값으로 데이터 조회
    						$('.sch_order > ul > li > a[data-date-divi-tp=month][data-date-divi=1]').click();
    					}else if(p.type=='04'){//상품 직접 검색
    						//elandmall.custcenter.goodsSearchPopup.searchData();
    						
    						//검색버튼 초기화
    						elandmall.custcenter.goodsSearchPopup.eventSearchBtn(p);
    						
    						
    					}else{
    						elandmall.custcenter.goodsSearchPopup.searchData();
    					}
    					
    				});
    			},
    			close_call_back: function() {}
    		});
			
        	//fn_layer_open("goods_search_popup"+p.type);
        	
        	

			
        },		
        
        eventSelectBtn : function(layer){// 상품 선택 이벤트
        	
        	
        	$('[id=selectBtn]').unbind("click").click(function(){
        		
    			var selectGoodsSize = $('[name=goodsCheckbox]:checked').size();
    			
    			if(selectGoodsSize==0){
    				alert("상품을 선택해 주세요.");
    				return;
    			}
    			
    			var temp = '';
    			var datas = [];
    			$('[name=goodsCheckbox]:checked').each(function(){
    				
    				var goods_no = $(this).attr("goods_no");
    				var vir_vend_no = $(this).attr("vir_vend_no");
    				var brand_nm = $(this).attr("brand_nm");
    				var goods_nm = $(this).attr("goods_nm");
    				var price= $(this).attr("price");
    				var img_path = $(this).attr("img_path");
    				
    				var pkg_goods_no = $(this).parent().parent().find("#slt_prd_05").val();
    				if(pkg_goods_no == null  ||  pkg_goods_no==""){
    					pkg_goods_no = $(this).parent().parent().find("#slt_prd_06").val();
    				}
    				var pkg_goods_nm = $(this).parent().parent().find("#slt_prd_05 option:selected").text();
    				if(pkg_goods_nm == null  ||  pkg_goods_nm==""){
    					pkg_goods_nm = $(this).parent().parent().find("#slt_prd_06 option:selected").text();
    				}    				
    				
    				if(pkg_goods_no != null && pkg_goods_no!=""){
    					var temp_goods = pkg_goods_no;
    					pkg_goods_no = goods_no;
    					goods_no = temp_goods;
    				}
    				
    				var data = {goods_no:goods_no, vir_vend_no:vir_vend_no, goods_nm:goods_nm, price : price, img_path : img_path, brand_nm : brand_nm, pkg_goods_no:pkg_goods_no, pkg_goods_nm:pkg_goods_nm};
    				
    				//주문일경우
    				if($.type($(this).attr("ord_no"))!='undefined'){
        				var ord_no = $(this).attr("ord_no");
        				var ord_dtl_no = $(this).attr("ord_dtl_no");
        				var item_nm = $(this).attr("item_nm");
        				
        				if(ord_no){
        					data.ord_no=ord_no;
        					data.ord_dtl_no=ord_dtl_no;
        					data.item_nm=item_nm;
        				}
    				}else{
    					data.ord_no="";
    					data.ord_dtl_no="";
    					data.item_nm="";
    				}
    				
    				var selected =goods_no+vir_vend_no+ord_no+ord_dtl_no;
    				var isDup = false;
    				if(temp.indexOf(selected) >= 0){
    					isDup = true;
    				}
    				
    				if(!isDup){
    					temp+=selected+",";//임시저장
    					datas.push(data);
    				}
    			});
    			
	   			if(datas.length > 5){
	   				alert('최대 5개 상품까지만 선택이 가능합니다.');
					return;
				}
    			elandmall.custcenter.goodsSearchPopup.callback(datas, layer)
        	});
        },
        
        eventSearchBtn : function(p, layer){
			//이벤트 초기화
		    $('#searchBtn').click(function(){
		    	
		    	//alert(p.type)
		    	//var p = elandmall.custcenter.goodsSearchPopup.param;
		    	
		    	//p.type - 01:주문, 02:장바구니, 03:최근본상품, 04:상품번호

			    var keyword=$('#keyword').val();
				if($.type(keyword)!='undefined' && keyword==''){
				    alert('검색어를 입력해 주세요.');
					return;
				}
				
				if(p.type=='04'){//상품번호 검색일경우
					p.goods_no = keyword;
				}else{
					p.keyword = keyword;
				}
				
				p.page_idx= 1;
				
				elandmall.custcenter.goodsSearchPopup.searchData(p);
            });//click
        },
        searchData : function(p){// 데이터 조회
			
        	$('.btn_mymore').remove();
        	
    		var p = $.extend({page_idx : 1,
    			isMore : false,
    			countSearch : false,
    			type : elandmall.custcenter.goodsSearchPopup.type}, p);
        	
    		//p.type = elandmall.custcenter.goodsSearchPopup.param.type;
        	$.ajax({
        		url: "/custcenter/searchGoodsPopup"+p.type+".action",
        		data: p,
        		type: "get",
        		dataType: "html",
        		success: function(data) {
					if(data.indexOf("nodata") >= 0){// 조회건수 없음
						var noDataStr = elandmall.searchFilter.getNoDataStr(p);
					
						$('#noDataStr').html(noDataStr += " 내 주문내역이 <strong>없습니다.</strong><br><br>조회기간은 상단의 기간 선택을 통해<br>다시 조회하실 수 있습니다.</div>");
						
						$('[name=listArea]').html('');
						$('.my_nolist').show();
						
						//#goods_search_popup 에 하단 버튼영역 append ( 아이폰 ui 이슈로 아래처럼 해야함)
						$("#btnType1").appendTo( "#goods_search_popup" );
						$('#btnType1').show();
						$('#btnType2').hide();
						
						
						$('.sch_result').hide();//최대 5개 선택가능 문구
						$('#listArea').html('');
					}else{
						
	        			if(!p.isMore){
	        				$('[id=listArea]').html('');
	        			}
	        			$('[id=listArea]').append(data);
						
						$('.my_nolist').hide();
						
						
						//#goods_search_popup 에 하단 버튼영역 append ( 아이폰 ui 이슈로 아래처럼 해야함)
						$("#btnType2").appendTo( "#goods_search_popup" );
						$('#btnType2').show();
						$('#btnType1').hide();
						
						$('.sch_result').show();//최대 5개 선택가능 문구
					}
        			
    				/* 검색버튼 이벤트*/
    				//elandmall.custcenter.goodsSearchPopup.eventSearchBtn(p);
    				
    				// 더보기 이벤트
    				$('.btn_mymore > a').click(function(){
    					
    					//var p2 = getParameter();
    					
    					p.page_idx = $(this).data("next-page-idx");
    					p.isMore = true;
    					elandmall.custcenter.goodsSearchPopup.searchData(p);
    					
    				});
    				
    				//주문상품 일 경우	
    				if(p.type == "01"){ 
						$("input:checkbox[name='goodsCheckbox']").click(function(){
		   					
		   					var isChecked = $(this).is(":checked");
		   					var ord_no = $(this).attr("ord_no");
		   					var cnt = 0;
		   					
		   					//현재 주문번호에 check된 상품 개수 Count
		   					$("input:checkbox[name='goodsCheckbox']").each(function(){
		   						if($(this).is(":checked")){
		   							var d_ord_no = $(this).attr("ord_no");
		   							if(ord_no == d_ord_no){
		   								cnt++;
		   							}
		   						}
		   					});
		   					
		   					if(isChecked){
		   						$("input:checkbox[name='goodsCheckbox']").each(function(){
		   							var d_ord_no = $(this).attr("ord_no");
		   							
		   							if(ord_no != d_ord_no){
		   								this.checked = false;
		   								this.disabled = true;
		   							}
		   						});
		   							
		   					}else{
		   						if(cnt <= 0){
			   						$("input:checkbox[name='goodsCheckbox']").each(function(){
			   							var d_ord_no = $(this).attr("ord_no");
			   							
			   							if(ord_no != d_ord_no){
			   								this.checked = false;
			   								this.disabled = false;
			   							}
			   						});	   							
		   						}
		   					}
		   				});
    				}
    				
        		}, error : function( e ){
        			if ( e.error_message !=null && e.error_message != ""){
        				alert(e.error_message);
        			}else{
        				alert("도움중 오류가 발생하였습니다.");
        			}
        		}
        	});	
        }
	};	
	
	//숫자만 입력
	$.fn.digitChecker = function(maxlength) {
		
		if(maxlength){
			$(this).attr("maxlength", maxlength);
		}
			
		//for ie
		$(this).attr("style", "ime-mode:disabled");
		
		//for crome
		$(this).keyup(function(evt){
			$(this).val($(this).val().replace(/[^0-9]/g,''));
		});
	};
	
	/**
	 * 기간검색영역 공통
	 */
	elandmall.searchFilter = {
			//기간입력 필드 유효성 체크
			checkPeriodCondition : function(p){
				
				
				var date_start = p.date_start;
				var date_end = p.date_end;
				
				//1. 필수값 체크
				if(date_start=='' || date_end==''){
					alert("검색 기간을 입력해 주세요.");
					return;
				}
				
				date_start = date_start.replace( /\./gi , '' ).replace( /\-/gi , '' ).replace(/(\s*)/g, ""); 
				date_end = date_end.replace( /\./gi , '' ).replace( /\-/gi , '' ).replace(/(\s*)/g, ""); 
				
				
				if(date_start.length != 8 || date_end.length != 8 ){
					alert("날짜 형식이 잘못되었습니다.");
					return;
				}
				
				var dateObj1 = new Date(date_start.substring(0,4), date_start.substring(4,6), date_start.substring(6,8));
				var dateObj2 = new Date(date_end.substring(0,4), date_end.substring(4,6), date_end.substring(6,8)); 
				
				//2. 입력 형식이 올바른지 체크
				if("Invalid Date"==dateObj1 || "Invalid Date"==dateObj2){
					alert("날짜 형식이 잘못되었습니다.");
					return false;
				}
 
				//3. 시작일이 종료일보다 큰지 체크
				if(dateObj1 > dateObj2){
					alert('시작일이 종료일보다 큽니다.');
					return false;
				}
				//4. 기간이 n개월이 넘는지 체크
				this.addMonth(dateObj1, p.maxmonth);
				if(dateObj1 < dateObj2){
					alert('최대 '+p.maxmonth+'개월까지 검색이 가능합니다.');
					return false;
				}

				
				return true;
			},
			addMonth : function(date, month){
				date.setMonth(date.getMonth() + month);
			},
			getDateString : function(date){//Date를 YYYY-MM-DD 스트링으로 리턴
				var month = date.getMonth() + 1;
				if(month < 10 ){
					month= "0" + month;
				}
				var day = date.getDate();
				if(date.getDate() < 10 ){
					day= "0" + date.getDate();
				}				
				return date.getFullYear()+"-"+month+"-"+day;
			},
			selectPeriodBtn : function(obj, p){//기간 버튼 클릭시 조회 기간 설정
				
				
				//검색기간 버튼 초기화
				var date_divi_tp = obj.data("date-divi-tp");
				var date_divi = obj.data("date-divi");
				var date = new Date();
				
				//종료일은 오늘로
				p.date_end = this.getDateString(date);
				
				if(date_divi_tp=='week'){
					date.setDate(date.getDate() - 7);
				}else{
					this.addMonth(date, -(parseInt(date_divi)));
				}
				
				//시작일
				p.date_start = this.getDateString(date);

			},
			removePeriodCondition : function(){//기간 버튼 선택 해제
				$('.attr_grade > li > a').removeClass("on");
			},
			getNoDataStr : function(p){
				var noDataStr = '';
				if(p.date_divi_tp == 'week'){
					noDataStr = "최근 "+p.date_divi + "주";
				} else if(p.date_divi_tp == 'month'){
					noDataStr = "최근 "+p.date_divi + "개월";
				}else{
					noDataStr = p.date_start+ "~" +p.date_end;
				}
				
				return noDataStr;
			},
			getNoDataHtml : function(){
				return '<div class="my_nolist"><div class="txt" id="noDataStr"></div></div>';
			}			
	};
	
	/**
	 *  앱 다운로드
	 */
	elandmall.appDown = function(disp_mall_no){
		location.href = elandmall.util.newHttps("/app.action?disp_mall_no="+disp_mall_no);
	};
	
	/**
	 * app에서 업로드된 위치 경로 주기
	 */
	elandmall.app = {
		params : {},
		init:function(callback){
	    	elandmall.app.params["callback"] = callback;
	    },
	    downImgView : function( file_path, ori_file_nm){
	    	elandmall.app.params.callback(file_path, ori_file_nm);
	    },
	    downImgViewNew : function( file_path, ori_file_nm, file_key){
	    	elandmall.app.params.callback(file_path, ori_file_nm, file_key);
	    },
	    // 이미지 등록
	    fnImgIns : function( upload_divi_cd, upload_key ){
			if ( $(".app_append ul li").not(":hidden").length >= 3 ){
				alert("최대 3장까지만 등록이 가능합니다.");
				return false;
			}
			if (elandmall.global.app_cd == "iOS"){
				if($.type(elandmall.global.app_version) != 'undefined' && parseInt(elandmall.global.app_version) >= 203 ){
					location.href="elandbridge://commentImageUploadNew?upload_divi_cd="+upload_divi_cd+"&upload_key="+upload_key;
				} else {
					location.href="elandbridge://commentImageUpload?upload_divi_cd="+upload_divi_cd;
				}
			} else if (elandmall.global.app_cd == "Android"){
				if($.type(elandmall.global.app_version) != 'undefined' && parseInt(elandmall.global.app_version) >= 203 ){
					location.href="elandbridge://commentImageUploadNew?upload_divi_cd="+upload_divi_cd+"&upload_key="+upload_key;
				} else {
					location.href="elandbridge://commentImageUpload?upload_divi_cd="+upload_divi_cd;
				}
			}
		},
		// 이미지 삭제
		fnImgDelete : function( p, callback ){
			var pin = $.extend( {filepath : ""} , p );
			
			if ( p.msgYn == null || p.msgYn == undefined ){
				if ( !confirm("선택한 사진을 삭제하시겠습니까?")){
					return false;
				}
			}
			
			$.ajax({
				url: "/app/deleteUploadImg.action",
				data: pin,
				type: "POST",
				dataType: "json",
				success: function(data) {
					if ( data.ret_code != "" ){
						if ( $.type(callback) == "function" ){
							callback();
						}
					}
				}, error : function( e ){
					if ( e.ret_msg != undefined && e.ret_msg != ""){
						alert(e.ret_msg);
					}else{
						alert("삭제 중 오류가 발생하였습니다.");
					}
				}
			});
		},
		elandApp : function(appver){
			if(elandmall.global.app_cd != "" && $.type(appver) != "undefined" && parseInt(appver) >= 120 ){
				return true;
			}else{
				return false;
			}
		}, 
		backElandBridge : function( ){
			var version = '';
			if($.type(elandmall.global.app_version) != 'undefined'){
				version = elandmall.global.app_version;
			}
			if(this.elandApp(version)){
				location.href="elandbridge://backBrowser/";
			}else{
				history.back();
			}
		},
		topBannerHeight : function(){
			var v_height = 95;
			var version = '';
			if($.type(elandmall.global.app_version) != 'undefined'){
				version = elandmall.global.app_version;
			}
			if(this.elandApp(version)){
				v_height = 45;
			}
			return v_height;
		}
			
	};
	
	/**
	 * 킴스장보기 > 구매내역 리스트
	 */
	elandmall.kimsOrdList = function(gnb_num){		
		elandmall.isLogin({login:function(){
			location.href = "/dispctg/showkimsOrdList.action?gnb_num="+gnb_num;
		}});
	};
	
	/**
	 * 오프라이스 > 구매내역 리스트
	 */
	elandmall.opriceOrdList = function(gnb_num){		
		elandmall.isLogin({login:function(){
			location.href = "/dispctg/showkimsOrdList.action?gnb_num="+gnb_num+"&isOprice=Y";
		}});
	};

})(jQuery);