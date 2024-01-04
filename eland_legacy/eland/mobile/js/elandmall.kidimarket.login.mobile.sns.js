;(function ($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	
	elandmall.login_layer_sns = {
			//계정잠금 Sns
			fnMemLockSns : function(formObj, pin , oneClickResult) {

					elandmall.layer.createLayer({
						layer_id:"MEMLOCK_LAYER",
//						title: "계정 잠금안내",
						class_name:"lg_pop",
						close_btn_txt:"닫기",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'LOCK'},  function() {
								layer.show();
								$("#MEMLOCK_LAYER").find(".btn_close > span").attr("class" , "");
							});
						},
						close_call_back: function() {
							var callback_url = pin.callback_url;
							window.location.href = callback_url;
						}
					});
					
			},
			//무실적
			fnNoneResultSns : function(formObj, pin , oneClickResult) {
				
				elandmall.layer.createLayer({
					layer_id:"NONERESULT_LAYER",
//					title: "장기간 비밀번호 미변경안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'NONERESULT'},  function() {
							
							//버튼추가 처리 
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">취소</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>확인</strong></a></li>"; 
							html += "</ul>";
							div.append(html);
							
							div.find("#cancel").click(function(){
								layer.close();
							});
							div.find("#confirm").click(function(){
								elandmall.kidiMarketMypage.link.cancelNoPurchase(elandmall.oneclick.getLoginId() ,"90");
							});
							
							layer.show();
							$("#NONERESULT_LAYER").find(".btn_close > span").attr("class" , "");
						});
					},
					close_call_back: function() {
						var callback_url = pin.callback_url;
						window.location.href = callback_url;
					}
				});
			},
			//휴먼계정
			fnQuiescenceSns : function(formObj, pin , oneClickResult){
				elandmall.layer.createLayer({
					layer_id:"QUIESCENCE_LAYER",
//					title: "휴면 계정 안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'QUIESCENCE'},  function() {
							
							//버튼추가 처리 
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">취소</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>확인</strong></a></li>"; 
							html += "</ul>";
							div.append(html);
							
							
							div.find("#cancel").click(function(){
								layer.close();
							});
							div.find("#confirm").click(function(){
								pin["accessToken"] = oneClickResult.accessToken;
								pin["membState"] = oneClickResult.membState;
								
								layer_fix_close("QUIESCENCE_LAYER");
								
								elandmall.loginProc.fnOneClickLogin(formObj, pin);
							});
							
							layer.show();
							$("#QUIESCENCE_LAYER").find(".btn_close > span").attr("class" , "");
						});
					},
					close_call_back: function() {
						var callback_url = pin.callback_url;
						window.location.href = callback_url;
					}
				});
			},
			//사이트추가
			fnSiteAddSns : function(formObj, pin , oneClickResult){
				
				elandmall.layer.createLayer({
					layer_id:"SITEADD_LAYER",
//					title: "사이트 이용 안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'SITEADD'},  function() {

						    //버튼추가 처리  
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">취소</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>확인</strong></a></li>"; 
							html += "</ul>";
							div.append(html);
							
							div.find("#cancel").click(function(){
								layer.close();
							});
							div.find("#confirm").click(function(){
								
								pin["accessToken"] = oneClickResult.accessToken;
								pin["membState"] = oneClickResult.membState;
								pin["emailYn"] = (div.find("#emailYn:checked") && (div.find("#emailYn:checked").val() == "Y"))?"Y":"N";
								pin["smsYn"] = (div.find("#smsYn:checked") && (div.find("#smsYn:checked").val() == "Y"))?"Y":"N";
								
								layer_fix_close("SITEADD_LAYER");
								elandmall.loginProc.fnOneClickLogin(formObj, pin);
								
							});
						
							
							layer.show();
							$("#SITEADD_LAYER").find(".btn_close > span").attr("class" , "");
						});
					},
					close_call_back: function() {
						var callback_url = pin.callback_url;
						window.location.href = callback_url;
					}
				});
			}
	}	
})(jQuery);