;(function($) {

	
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
			login: function() {
				if(typeof NetFunnel_Action === 'function') {
					NetFunnel_Action(  {action_id: elandmall.global.netfunnel_order_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80"},
						{	 success:function(ev,ret){ //성공
								elandmall.cart.doOrderCallback(p, nomember);
							},error:function(ev,ret){ //오류
								elandmall.outputSeverLog({msg:"ERROR [netfunnel] - doOrder || msg : " + ret.data.msg});
								if(NetFunnel.Util.isRetryEnd()) {
									alert("죄송합니다.대기열 호출 중 오류가 발생했습니다.");
								}
							}
						}
					);
				} else {
					$.getScript(elandmall.global.js_path + "/pcweb/netfunnel/netfunnel.js", function() {
						NetFunnel_Action(  {action_id: elandmall.global.netfunnel_order_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80"},
							{	 success:function(ev,ret){ //성공
									elandmall.cart.doOrderCallback(p, nomember);
								},error:function(ev,ret){ //오류
									elandmall.outputSeverLog({msg:"ERROR [netfunnel] - doOrder || msg : " + ret.data.msg});
									if(NetFunnel.Util.isRetryEnd()) {
										alert("죄송합니다.대기열 호출 중 오류가 발생했습니다.");
									}
								}
							}
						);
					});
				}
			}
		});	
	};
	
	elandmall.cart.doOrderCallback = function(p, nomember) {

		var form = (function() {
			if ($("#_ORDER_INIT_FORM_").length == 0) {
				$("<form id='_ORDER_INIT_FORM_'></form>").attr({
					action: elandmall.util.https("/order/initOrder.action"),							
					method: "get"	//IE11에서 post로 넘기면 refresh 패러미터가 사라짐???
				}).appendTo("body");
			};
			return $("#_ORDER_INIT_FORM_").empty();
		})();
		$.each(p.cart_no_list, function() {
			form.append($("<input type='hidden' name='cart_no'></input>").val(this));				
		});
		form.append($("<input type='hidden' name='cart_divi_cd'></input>").val(p.cart_divi_cd));
		form.append($("<input type='hidden' name='form_ga_category_nm'></input>").val($('#ga_category_nm').val()));
		
		
		//주문서 진입전 주문 상품 유효성 확인				
		$.ajax({
			url: "/order/orderItemCheckNew.action", //:NGCPO-706
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
				elandmall.util.setCookie({ name: "reloaded", value: "N", domain: elandmall.global.cookie_domain, path: "/order" });
				
				
				if(rs!= null && rs.goods_list.length > 0) { //더블쿠폰적용:NGCPO-706
				
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
				
				}else { //일반
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
	
	};

	//[START] LAYER
	
	/*
	 * class_name :  레이어 클레스명 , 
	 * rtn_btn_id : 접근성을 위한 focus를 줄 버튼ID
	 * createContent : function이며, {div_content:컨텐츠OBJECT, close:닫기펑션}, div_content에 해당 레이어 내용을 넣어준다.
	 * 
	 * close_call_back :존새시 넣어 준다.
	 */
	elandmall.layer = {
		createLayer: function(p) {
			
			p = $.extend({ layer_id:"_COMMON_LAYER_", tit_class_name:"lay_tit", class_name: "layer_pop d_layer_pop", cont_class_name: "",rtn_btn_id:"", dimm_use: false}, p || {});
			
			/* close 가 존재하는 경우는 remove를 하지 않는다.
			  레이어가 동일한 경우 중복으로 생성 되므로 한번 clear 처리함 */
			if( $("#"+p.layer_id).length > 0){
				$("#"+p.layer_id).remove();
			}
			
			// dimm on
			if(p.dimm_use && $('#temp_dimm').length == 0) {
				commonUI.view.dimmOn();
			}

			/* 서로 다른 레이어를 생성하는 경우 이전 레이어를 숨김 처리 한다.
			 	p.cls_othr_lyr_yn 가 'N'일 경우에는 실행 X */
			if($.type(p.cls_othr_lyr_yn) == "undefined" || p.cls_othr_lyr_yn != "N" ){
				$.each($(".layer_pop"), function(){
				    $(this).hide();
				    if($(this).attr("id") == "_CART_RESULT_LAYER_"){
				    	//장바구니 담기 성공 레이어가 있을 시, 실행
				    	elandmall.cart.closeLayer();
				    }
				});
			}
			
			var div = $(
					"<div>" +
					"	<div class='lay_wrap'>" +
					"		<div id='lay_tit'><strong>" + p.title + "</strong></div>" +
					"		<button type='button' class='btn_lay_close' ><img src='" + elandmall.global.image_path + "/images/pcweb/common/btn_laypop_close.gif' alt='레이어 팝업 닫기' /></button>" +
					"	</div>" +
					"</div>"
			).addClass(p.class_name).attr("id", p.layer_id);
			
			var close;
			if($.type(p.close_call_back) == "function") {
				close = p.close_call_back;
				
			}else {
				close =  function() {
					if(elandmall.global.disp_mall_no == "0000045") { //킴스클럽
						// 킴스 장바구니일때
						if($('#tabClickLoginOpenYn').length > 0) {
							if($('#tabClickLoginOpenYn').val() == 'Y') {
								$('#tabClickLoginOpenYn').val('N');
								$('#kimsCartTab0_0').attr('aria-selected', 'true');
								$('#kimsCartTab0_1').attr('aria-selected', 'false');
							}
						}
					}

					div.hide();

					//리턴정보 활성화 처리
					if($.type(p.rtn_btn_id) == "string" && p.rtn_btn_id != ""){
						$(p.rtn_btn_id).focus();
					}

					// dimm off
					if(p.dimm_use && $('#temp_dimm').length > 0) {
						commonUI.view.dimmOff();
					}
					return false;
				};
			}
			
			var div_content = $("<div class='lay_cont'></div>");
			//lay_cont 클래스명 변경 처리
			div_content.addClass(p.cont_class_name);

			//타이틀 플래스명 변경 처리 
			div.find("#lay_tit").addClass(p.tit_class_name).after(div_content);
			
			// title이 없을경우 제거
			if ( $.type(p.title) == "undefined" ){
				div.find("#lay_tit").remove();
			}
			
			// 레이어 버튼이 별도로 있는경우 기존레이어의 버튼 제거
			if ( $.type(p.no_close_btn) != "undefined" && p.no_close_btn == "Y"){
				div.find(".btn_lay_close").remove();
			}
			
			
			p.createContent({
				div_content: div_content,
				close: close,
				show : function(){
					if(p.layer_id == "_GOODSPREVIEW_LAYER_"){	// 상품퀵뷰일 경우, wrapper 안에 레이어 생성
						div.appendTo("#wrapper");	
					}else{
						div.appendTo("body");
					}
				}
			});	//내용을 만든다.
			
			div.find("button.btn_lay_close").click(close);
			
			var $window = $(window);
			var $body = $("body");
			var scroll = $window.scrollTop();
			var bodyHeight = $body.height();
			var layerHeight = div.height();
			
			var _top = ( bodyHeight <= layerHeight ) ? scroll : ( bodyHeight - layerHeight )/4 + scroll ;
			var _onCss = {"top" : _top };
			if(p.dimm_use) {
				_onCss = $.extend({"z-index" : "6000"}, _onCss);
			}
			//div.appendTo("body");			
			//해당화면으로 포커스를 줘야 함 body를 생성후 넣어야 함
			div.css(_onCss).attr("tabIndex","0").addClass("on").focus();
			
		}
	};
	//[END] LAYER
	

	/**
	 * 찜담기 완료 후 메세지 처리
	 */
	wishlistComplete = function(s){

		// elem에 값이 담겨있다면 찜하기 토글처리
		var elem = data.elem;
		if(elem != undefined && elem != null) {
			var elem_cls = $(elem).attr("class").split(" ")[0];	// 클래스가 여러개라면 가장 첫번째 클래스를 찜하기 클래스로 간주한다.
			var elem_onclick = $(elem).attr("onclick");

			$("." + elem_cls).each(function() {
				if ($(this).attr("onclick") == elem_onclick) {
					// 킴스클럽 찜하기 버튼 체크
					if ($(this).is("[aria-pressed]")) {
						var pressed = "false";
						var label1 = "관심상품에";
						var label2 = "추가";
						var currentZimCnt = $("#zim_cnt").text(); // 상품상세 찜 카운트

						if ($(this).hasClass('brd')) {
							label1 = "관심브랜드에";
						}


						if (s == "S") { // 추가일경우
							pressed = "true";
							label1 += "서 "
							label2 = "제거";
							$("#zim_cnt").text(Number(currentZimCnt)+1);
						} else { // 삭제일경우 s == "DEL"
							$("#zim_cnt").text(Number(currentZimCnt)-1);
						}

						$(this).attr("aria-pressed", pressed);
						$(this).attr("aria-label", label1 + label2);
					}
				}
			});

			return;
		}
		
		var title = "";
		var alertCont = "";
		if(data.rel_divi_cd=="10"){
			title = "상품";
			p = "{tab:'1'}";
		}else if(data.rel_divi_cd=="20"){
			title = "브랜드";
			alertCont = "<p>브랜드가 정상적으로 저장되었습니다.<br>마이페이지 > 나의 찜목록 에서 확인하세요.</p>";
			p = "{tab:'2'}";
		}else if(data.rel_divi_cd=="30"){
			title = "기획전";
			alertCont = "<p>기획전이 정상적으로 저장되었습니다.<br>마이페이지 > 나의 찜목록 에서 확인하세요.</p>";
			p = "{tab:'5'}";
		}else if(data.rel_divi_cd=="40"){
			title = "카테고리";
			alertCont = "<p>카테고리가 정상적으로 저장되었습니다.<br>마이페이지 > 나의 찜목록 에서 확인하세요.</p>";
			p = "{tab:'3'}";
		}else if(data.rel_divi_cd=="50"){
			title = "검색어";
			alertCont = "<p>검색어가 정상적으로 저장되었습니다.<br>마이페이지 > 나의 찜목록 에서 확인하세요.</p>";
			p = "{tab:'4'}";
		}else if(data.rel_divi_cd=="60"){
			title = "셀프스타일링";
			alertCont = "<p>셀프스타일링이 정상적으로 저장되었습니다.<br>마이페이지 > 나의 찜목록 에서 확인하세요.</p>";
			p = "{tab:'6'}";
		}
		
		//Pc
		elandmall.layer.createLayer({
			layer_id:"wishalert",
			class_name:"layer_pop type03 on",
			title: title + " 찜하기",
			createContent: function(layer) {
				var div = layer.div_content;
				layer.show();
			}
		});
		
		var cont = '';
		if(s == 'DUPL'){
			cont = '<p>찜 목록에 있는 '+title+'입니다.<br>찜 목록으로 이동하시겠습니까?</p>';
		}else if(s == 'DISA'){
			cont = '<p>구매에 불편을 드려 죄송합니다.<br/>본 상품은 브랜드와 협의 중인 상품으로,<br/>기업회원 대상으로 서비스를 확대할 예정입니다.</p>';
		}else if(s == 'DEL'){ //해제
			if($(data.opt_event).hasClass('opt_like')){
				$(data.opt_event).removeClass('on');
			}else if($(data.opt_event.closest('li')).find('.opt_like').length > 0){
				$(data.opt_event.closest('li')).find('.opt_like').removeClass('on');
			}
			cont = '<p>찜하기 해제되었습니다.</p>';
		}else{
			if(data.rel_divi_cd=="10"){
				cont = '<p>선택하신 상품을 찜 목록에 추가하였습니다.<br>찜 목록으로 이동하시겠습니까?</p>';
				var currentZimCnt = $("#zim_cnt").text();
				$("#zim_cnt").text(Number(currentZimCnt)+1);
				if( $(data.opt_event).hasClass('opt_like') ){
					$(data.opt_event).addClass('on');
				}else if( $(data.opt_event.closest('li')).find('.opt_like').length > 0){
					$(data.opt_event.closest('li')).find('.opt_like').addClass('on');
				}
			}else{
				cont = alertCont;
			}
		}
		
		$("#wishBtn").attr("aria-pressed", true);
		
		var html = '';
		html += '			<div class="my_confirm">';
		html += cont
		html += '			</div>';
		if(s == 'DISA'){
			
		}else{
			html += '			<div class="set_btn">';
			html += '				<button type="button" class="btn03" onclick="elandmall.mypage.link.wishlist('+p+')"><span>찜 목록으로 이동</span></button>';
			html += '				<button type="button" class="btn03 c01" onclick="$(\'#wishalert\').hide()"><span>계속 쇼핑하기</span></button>';
			html += '			</div>';
		} 

		$('#wishalert').find('.lay_cont').html(html);
	
	}
	
})(jQuery);