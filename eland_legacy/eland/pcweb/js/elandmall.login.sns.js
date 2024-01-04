;(function ($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	
	elandmall.login_layer_sns = {
			//무실적
			fnNoneResultSns : function(formObj, pin , oneClickResult){
				
				elandmall.layer.createLayer({
					layer_id:"NONERESULT_LAYER",
//					title: "무실적 계정 안내",
					class_name:"layer_pop lay_temp02 on",
					close_call_back:function() {
						$("#NONERESULT_LAYER").hide();
					},
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'NONERESULT'},  function() {
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn04\"><span>확인</span></button>"	
							html += "<button type=\"button\" id=\"after_close\" class=\"btn04 c01\"><span>취소</span></button>" 
							html += "</div>";
							div.after(html);
							
							var obj = div.parent();
							obj.find("#after_close").click(function(){
								layer.close();
							});

							obj.find("#confirm").click(function(){
								elandmall.mypage.link.cancelNoPurchase(elandmall.oneclick.getLoginId() ,"90");
							});
							
							layer.show();
							lockLoginPop = false;
						});
					}
				});
				
			},
			//계정잠금
			fnMemLockSns : function(formObj, pin , oneClickResult) {
				elandmall.layer.createLayer({
					layer_id:"MEMLOCK_LAYER",
//					title: "계정 잠금안내",
					class_name:"layer_pop lay_temp02 on",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'LOCK'},  function() {
							
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"after_close\" class=\"btn02 c01\"><span>닫기</span></button>" 
							html += "</div>";
							div.after(html);
							
							var obj = div.parent();
							obj.find("#after_close").click(function(){
								layer.close();
							});
							
							layer.show();
							lockLoginPop = false;
						});
					}
				});
				
			},
			//휴먼계정
			fnQuiescenceSns : function(formObj, pin , oneClickResult){
				
				elandmall.layer.createLayer({
					layer_id:"QUIESCENCE_LAYER",
//					title: "휴면 계정 안내",
					class_name:"layer_pop lay_temp02 on",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'QUIESCENCE'},  function() {
							//버튼추가 처리 
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"after_close\" class=\"btn02 c01\"><span>취소</span></button>" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn02\"><span>확인</span></button>" 
							html += "</div>";
							div.after(html);
							
							var obj = div.parent();
							obj.find("#after_close").click(function(){
								layer.close();
							});
							obj.find("#confirm").click(function(){
								pin["accessToken"] = oneClickResult.accessToken;
								pin["membState"] = oneClickResult.membState;
								elandmall.loginProc.fnOneClickLogin(formObj, pin);
							});
							
							layer.show();
							lockLoginPop = false;
						});
					}
				});				
			},
			//사이트추가
			fnSiteAddSns : function(formObj, pin , oneClickResult){
				
				elandmall.layer.createLayer({
					layer_id:"SITEADD_LAYER",
//					title: "사이트 이용 안내",
					class_name:"layer_pop lay_temp02 on",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'SITEADD'},  function() {
							//버튼추가 처리 
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"after_close\" class=\"btn02 c01\"><span>취소</span></button>" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn02\"><span>확인</span></button>" 
							html += "</div>";
							div.after(html);
							
							var obj = div.parent();
							obj.find("#after_close").click(function(){
								/*if($.type(callback) == "function"){
							        callback();
								}*/
								layer.close();
							});
							obj.find("#confirm").click(function(){
								pin["accessToken"] = oneClickResult.accessToken;
								pin["membState"] = oneClickResult.membState;
								pin["emailYn"] = (div.find("#emailYn:checked") && (div.find("#emailYn:checked").val() == "Y"))?"Y":"N";
								pin["smsYn"] = (div.find("#smsYn:checked") && (div.find("#smsYn:checked").val() == "Y"))?"Y":"N";
								elandmall.loginProc.fnOneClickLogin(formObj, pin);
							});
							
							layer.show();
							lockLoginPop = false;
						});
					}
				});
				
			}, 
			fnLoginSns : function() {
	        	elandmall._login_msg = function(error_msg) {
					$("#layer_pop").find(".txt_alert_login").html(error_msg);
				}
	        	var form = $("#loginForm");
	           	form.find("#scheme").val(location.protocol);
	        	form.find("#ret_domain").val(location.host);
	        	form.find("#loginType").val("member");
	        },
	        // 로그인페이지 - SNS 클릭시 팝업 노출
	        fnSnsPopup : function(url, title, w, h) {
	        	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
	        	var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

	        	var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	        	var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	        	var left = ((width / 2) - (w / 2)) + dualScreenLeft;
	        	var top = ((height / 2) - (h / 2)) + dualScreenTop;
	        	var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

	        	// Puts focus on the newWindow
	        	if (newWindow && newWindow.focus) {
	        		newWindow.focus();
	        	}
	        },
	        // 로그인페이지 - SNS 클릭시 노출되는 팝업 사이즈
	        fnGetSnsPopupSize : function() {
	        	var snsPopupSize = {
	        		'10' : {width : 444, height : 512},	// Naver
	        		'20' : {width : 468, height : 558},	// Kakao
	        		'30' : {width : 630, height : 560}, // Google
	        		'40' : {width : 500, height : 601}, // Facebook
	        		'50' : {width : 500, height : 601} 	// apple
	        	};
	        	return snsPopupSize;
	        }
	}	
})(jQuery);