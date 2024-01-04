;(function ($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};

	//레이어 닫기 부분이다. 
	elandmall._login_close = function (callback , pin) {
		layer_fix_close("layer_pop");
		$("#layer_pop").hide();
		
		pin = $.extend({
			noMember : false
		}, pin||{});
	    
	    if(pin.noMember){
	    	if($.type(callback) == "function"){
		        callback();
	    	}
	    } else {
	    	elandmall.login_layer.fnCommLayer(callback , pin);
	    }
	    
		
	};
	
	elandmall.login_layer = {
			
			//모바일은 우선순위에 의해 하나씩만 호출한다. 
			fnCommLayer : function(callback , pin){
				
			   var membState = pin.membState; 
			   var layerCnt = 0;  //모바일은 하나의 레이어만 호출한다. 
				
			   if(membState == "60") {
					layerCnt ++;
					elandmall.login_layer.fnLongTimeWdInfo(callback);
			   } else if(membState == "70"){
					layerCnt ++;
					elandmall.login_layer.fnTmpPassWdInfo(callback);
			   } 

			   //임직원이고 복지몰 알람을 보지 않았다면 알람레이어를 띄운다.
			   if(pin.is_staff == 'staff'){
				   if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
					   /* APP일경우 호출안하게 함, 모든레이어에 조건을 걸어야 하지 않을까? */
				   } else {
					   var isStaffAlram = pin.is_staff_alram;
					   if(layerCnt == 0 && $.type(isStaffAlram) != "undefined" && (isStaffAlram == '' || isStaffAlram == 'N')){
						   layerCnt ++;
						   elandmall.login_layer.fnWflAlram(callback);
						   elandmall.util.setCookie({ name: "is_staff_alram_del", value: "Y", age:365*10, path: "/", domain : elandmall.global.cookie_domain });
					   }

					   var isStaffDonAlram = pin.is_staff_don_agree_alram;
					   if(layerCnt == 0 && $.type(isStaffDonAlram) != "undefined" && isStaffDonAlram == 'N'){
						   layerCnt ++;
						   elandmall.login_layer.fnDonAlram(callback);
						   $("html,body").animate({scrollTop: 0}, 300);
					   }

					   var isStaffGiftNoti = pin.is_staff_gift_noti;
					   if(layerCnt == 0 && $.type(isStaffGiftNoti) != "undefined" && isStaffGiftNoti != 'Y'){
						   layerCnt ++;
						   elandmall.login_layer.fnStaffGiftNoti(callback);
					   }
				   }
			   }
				
	           if(layerCnt == 0 && $.type(pin.coupon_param) != "undefined" && pin.coupon_param != "") {
					
					var coupon_param  = pin.coupon_param.split(",");
					var birthLayer = false;
					var MarryDay = false;
				    var set_coupon_param = "";
					$.each(coupon_param , function(idx , sdata) {
						var coupon_param_new = "";
						var data = sdata.split("^")						
						//생일
						if(layerCnt == 0 && data[0] == "10" && data[1] == "N" ) {
							coupon_param_new = "10^Y";
							birthLayer = true;
							layerCnt ++;
					    //결혼기념일
						} else if(layerCnt == 0 && data[0] == "20" && data[1] == "N" ) {
  						    coupon_param_new = "20^Y";	
							MarryDay = true;
							layerCnt ++;
						}
						
						if( coupon_param_new != "" ) {
							if(set_coupon_param != "") {
								set_coupon_param  += "," +coupon_param_new;
							} else {
								set_coupon_param  += coupon_param_new;	
							}
							
						} else {
							if(set_coupon_param != "") {
								set_coupon_param  += "," +sdata;
							} else {
								set_coupon_param  += sdata;	
							}
						}
					})
					
					if(birthLayer){
					    elandmall.login_layer.fnBirthDay(callback,  {coupon_param:set_coupon_param});
					}
					
					if(MarryDay){
						elandmall.login_layer.fnMarryDay(callback, {coupon_param:set_coupon_param});
					}
				} else if(layerCnt == 0) {
					if($.type(callback) == "function"){
				        callback();

						if(elandmall.global.disp_mall_no == '0000053' && elandmall.wishlist.data.toggle_yn == 'Y') {
							parent.location.href = parent.top.location.href;
						}
					}
				}
			},
			//사이트추가
			fnSiteAdd : function(formObj, pin , oneClickResult){
				
				elandmall.layer.createLayer({
					layer_id:"SITEADD_LAYER",
//					title: "사이트 이용 안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					close_call_back:function() {
						window.location.href = elandmall.util.https("/main/initMain.action");
					},
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
					}
				});
				
			}, 
			//계정잠금
			fnMemLock : function(formObj, pin , oneClickResult) {

				elandmall.layer.createLayer({
					layer_id:"MEMLOCK_LAYER",
//					title: "계정 잠금안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					close_call_back:function() {
						//layer_fix_close('MEMLOCK_LAYER');
						window.location.href = elandmall.util.https("/main/initMain.action");
					},
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'LOCK'},  function() {
							layer.show();
							$("#MEMLOCK_LAYER").find(".btn_close > span").attr("class" , "");
						});
					}
				});
				
			},
			//탈퇴유예
			fnMemOutSec : function(formObj, pin , oneClickResult) {

				elandmall.layer.createLayer({
					layer_id:"MEMLOCK_LAYER",
//					title: "계정 잠금안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					close_call_back:function() {
						//layer_fix_close('MEMLOCK_LAYER');
						window.location.href = elandmall.util.https("/main/initMain.action");
					},
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'MEMOUTSEC'},  function() {
							layer.show();
							$("#MEMLOCK_LAYER").find(".btn_close > span").attr("class" , "");
						});
					}
				});
				
			},
			//무실적
			fnNoneResult : function(formObj, pin , oneClickResult) {
				
				elandmall.layer.createLayer({
					layer_id:"NONERESULT_LAYER",
//					title: "장기간 비밀번호 미변경안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					close_call_back:function() {
						//layer_fix_close('MEMLOCK_LAYER');
						window.location.href = elandmall.util.https("/main/initMain.action");
					},
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
								elandmall.mypage.link.cancelNoPurchase(elandmall.oneclick.getLoginId() ,"90");
							});
							
							layer.show();
							$("#NONERESULT_LAYER").find(".btn_close > span").attr("class" , "");
						});
					}
				});
			},
			//휴먼계정
			fnQuiescence : function(formObj, pin , oneClickResult){
				
				elandmall.layer.createLayer({
					layer_id:"QUIESCENCE_LAYER",
//					title: "휴면 계정 안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
					close_call_back:function() {
						//layer_fix_close('QUIESCENCE_LAYER');
						window.location.href = elandmall.util.https("/main/initMain.action");
					},
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
					}
				});
			}, 
			//장기간비밀번호안내
			fnLongTimeWdInfo : function(callback){
				
				elandmall.layer.createLayer({
					layer_id:"LONGTIMEWDINFO_LAYER",
//					title: "장기간 비밀번호 미변경안내",
					class_name:"lg_pop",
					close_btn_txt:"닫기",
				    close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						layer_fix_close('LONGTIMEWDINFO_LAYER');
					},
					createContent: function(layer) {
						var div = layer.div_content;
						$(window).scrollTop(0);
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'LONGTIMEPW'},  function() {
							//버튼추가 처리 
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">90일이후에변경</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>지금변경</strong></a></li>"; 
							html += "</ul>";
							div.append(html);
							
							div.find("#cancel").click(function(){
								elandmall.oneclick.fnExtendPwdChange(layer.close());
							});
							div.find("#confirm").click(function(){
								elandmall.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId() , "60");
							});
							
							layer.show();
							$("#LONGTIMEWDINFO_LAYER").find(".btn_close > span").attr("class" , "");
							
							elandmall.util.setCookie({ name:'membState', domain: elandmall.global.cookie_domain, value:'', path: "/" });
						});
					}
				});
				
			},
			//임시비밀번호로그인안내
			fnTmpPassWdInfo : function(callback, pin) {
				elandmall.layer.createLayer({
					layer_id:"TMPPASSWDINFO_LAYER",
//					title: "임시 비밀번호 로그인 안내",
					close_btn_txt:"닫기",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						layer_fix_close('TMPPASSWDINFO_LAYER');
					},
					class_name:"lg_pop",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'TEMPPW'},  function() {
							//버튼추가 처리 
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">다음에변경</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>지금변경</strong></a></li>"; 
							html += "</ul>";
							div.append(html);
							
							div.find("#cancel").click(function(){
								elandmall.oneclick.fnHoldTempPassword(layer.close());
							});
							div.find("#confirm").click(function(){
								elandmall.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId() , "70");
							});
							
							layer.show();
							$("#TMPPASSWDINFO_LAYER").find(".btn_close > span").attr("class" , "");
							
							elandmall.util.setCookie({ name:'membState', domain: elandmall.global.cookie_domain, value:'', path: "/" });
						});
					}
				});
			}, 
			//생일쿠폰
			fnBirthDay : function(callback , pin) {
				
				elandmall.layer.createLayer({
					layer_id:"BIRTHDAY_LAYER",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						layer_fix_close('BIRTHDAY_LAYER');
					},
					class_name:"lg_pop",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'BIRTH'},  function() {
							
							//버튼추가 처리 
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">나중에확인하기</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>마이페이지로 이동</strong></a></li>"; 
							html += "</ul>";
							div.find(".lg_pwd").append(html);
							
							div.find("#cancel").click(function(){
								layer.close();
							});
							div.find("#confirm").click(function(){
								elandmall.mypage.link.coupon();
							});
							
							layer.show();
							$("#BIRTHDAY_LAYER").find(".btn_close > span").attr("class" , "");
							if($.type(pin.coupon_param) != "undefined") {
								elandmall.util.setCookie({ name:'coupon_param', domain: elandmall.global.cookie_domain, value:pin.coupon_param, path: "/" });	
							}
						});
					}
				});
				
			}, 
			//결혼기념일 쿠폰
			fnMarryDay : function(callback , pin) {
				
				elandmall.layer.createLayer({
					layer_id:"MARRYDAY_LAYER",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						layer_fix_close('MARRYDAY_LAYER');
					},
					class_name:"lg_pop",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'MARRY'},  function() {
							//버튼추가 처리 
							var html = "";
							html = "<ul class=\"btn_list02\">" ;
							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">나중에확인하기</a></li>" ;
							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>마이페이지</strong></a></li>"; 
							html += "</ul>";
							div.find(".lg_pwd").append(html);
							
							div.find("#cancel").click(function(){
								layer.close();
							});
							div.find("#confirm").click(function(){
								elandmall.mypage.link.coupon();
							});
							
							layer.show();
							$("#MARRYDAY_LAYER").find(".btn_close > span").attr("class" , "");
							
							if($.type(pin.coupon_param) != "undefined") {
								elandmall.util.setCookie({ name:'coupon_param', domain: elandmall.global.cookie_domain, value:pin.coupon_param, path: "/" });	
							}
						});
					}
				});
			},
			//계정 탈퇴 Sns
			fnMemOutSns : function(formObj, pin , oneClickResult) {

					elandmall.layer.createLayer({
						layer_id:"MEMOUT_LAYER",
//						title: "계정 탈퇴안내",
						class_name:"lg_pop",
						close_btn_txt:"닫기",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'OUT'},  function() {
								layer.show();
								$("#MEMOUT_LAYER").find(".btn_close > span").attr("class" , "");
							});
						},
						close_call_back: function() {
							var callback_url = pin.callback_url;
							window.location.href = callback_url;
						}
					});
					
			},
			//복지몰 알림
			fnWflAlram : function(callback , pin) {

					elandmall.layer.createLayerCustom({
						layer_id:"WFL_LAYER",
						class_name:"lg_pop",
						con_cls_name : "wfp",
						close_btn_txt:"확인",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'WFL'},  function() {
								layer.show();
								$("#WFL_LAYER").find(".btn_close > span").attr("class" , "");
							});
						}
					});
					
			},
			//복지포인트 기부 알람
			fnDonAlram : function(callback , pin) {

					elandmall.layer.createLayerCustom({
						layer_id:"DON_LAYER",
						class_name:"lg_pop",
						con_cls_name : "dona",
						close_btn_txt:"확인",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'DON'},  function() {
								
								var obj = div.parent();
								
								obj.find("#arg").click(function(){
									$('#receipt_area').show();
									
									var note_name = '#DON_LAYER';
									var note_data = $(note_name).height();
									
									var note_h = ($(window).height() - note_data) / 2;

									if (note_h > 0) {
										$(note_name).css({ 'top': note_h + 'px'});
									} else {
										$(note_name).css({ 'top': '0' });
									}
									
								});
								
								obj.find("#dis").click(function(){
									$('#receipt_area').hide();
								});
								
								obj.find("#p_dis").click(function(){
									alert('미동의 시 기부금 영수증이 자동 발급 되지 않습니다.');
								});
								
								obj.find("#confirm").click(function(){
									var agree_yn = $("input:radio[name='donation_yn']:checked").val();
									var prv_yn = $("input:radio[name='prv_yn']:checked").val();
									
									if(agree_yn == null || agree_yn == ''){
										alert('동의/미동의를 선택해 주세요.');
										return;
									}
									
									if(agree_yn == 'Y'){
										if(prv_yn == null || prv_yn == ''){
											alert('개인정보 제3자 정보 제공 동의 여부를 선택 해 주세요.');
											return;
										}else if(prv_yn == 'N'){
											if(confirm('개인정보 제3자 정보 제공 미동의 시\n기부금 영수증이 자동 발급 되지 않습니다.\n계속 진행 하시겠습니까?')){
												//진행
											}else{
												return;
											}
										}
									}
									
									$.ajax({
										url: "/dispctg/updateEmpDonationAgree.action",
										type: "POST",
										data: {donation_agree_yn:agree_yn, prv_yn:prv_yn},
										dataType: "text",
										success: function(data) {
											if(data == 'S'){
												if(agree_yn == 'Y'){
													alert("이랜드재단 기부에 동의해 주셨습니다.");
												}else{
													alert("이랜드재단 기부에 미동의해 주셨습니다.");
												}
											}else{
												alert("이미 신청 하셨습니다.");
											}
											
											elandmall.util.setCookie({ name: "is_staff_don_agree_alram", value: "Y", age:365*10, path: "/", domain : elandmall.global.cookie_domain });
											layer_fix_close('DON_LAYER');
											
											//아이폰에서 스크롤이 동작하지 않아서 변경한다.
											$('html').css({
										       	'overflow': 'auto',
										       	'height' : 'auto'
									        });

										    $('body').css({
										       	'overflow-y': 'hidden',
										       	'height' : '100%'
										     });
										    //아이폰에서 스크롤이 동작하지 않아서 변경한다.
											
											if($.type(callback) == "function"){
										        callback();
											}
										},
										error: function(e) {
											alert('오류가 발생하였습니다.');
											layer_fix_close('DON_LAYER');
											
											//아이폰에서 스크롤이 동작하지 않아서 변경한다.
											$('html').css({
										       	'overflow': 'auto',
										       	'height' : 'auto'
									        });

										    $('body').css({
										       	'overflow-y': 'hidden',
										       	'height' : '100%'
										     });
										    //아이폰에서 스크롤이 동작하지 않아서 변경한다.
										    
											
											if($.type(callback) == "function"){
										        callback();
											}
										}
									});	
									
									
								});
								
								
								layer.show();
								
								
								//아이폰에서 스크롤이 동작하지 않아서 변경한다.
								$('.lg_pop').css('position', 'fixed');
								scroll_on();
								$('html').css({
									'overflow-y': 'hidden',
									'height' : '100%'
								});
								$('body').css({
									'overflow-y': 'hidden',
									'height' : 'calc(100% - 1px)'
								});

								$('.lg_pop#DON_LAYER').css({
									  '-webkit-backface-visibility':'hidden',
									  '-webkit-transform':'translateZ(0)',
									  'width':'276px',
									  'left':'50%',
									  'margin-left':'-138px'
								 });
								
								$('.dimlay').bind('touchmove', function(e){e.preventDefault(); });
								//아이폰에서 스크롤이 동작하지 않아서 변경한다.
								
								
								
								
								
								
								$("#DON_LAYER").find(".btn_close > span").attr("class" , "");
							});
						}
					});
					
			},
			//복지포인트 상품권 구매안내
			fnStaffGiftNoti : function(callback, pin) {
				elandmall.layer.createLayerCustom({
					layer_id:"GIFT_LAYER",
					class_name:"lg_pop",
					con_cls_name : "wfp",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'GIFT'},  function() {
							var obj = div.parent();

							obj.find("#btn_today").click(function(){
								elandmall.util.setCookie({ name: "is_staff_gift_noti", value: "Y", age:1, path: "/", domain : elandmall.global.cookie_domain });
								layer_fix_close('GIFT_LAYER');
							});

							layer.show();
						});
					}
				});
			}
			
//			//계정잠금 Sns
//			fnMemLockSns : function(formObj, pin , oneClickResult) {
//
//					elandmall.layer.createLayer({
//						layer_id:"MEMLOCK_LAYER",
////						title: "계정 잠금안내",
//						class_name:"lg_pop",
//						close_btn_txt:"닫기",
//						createContent: function(layer) {
//							var div = layer.div_content;
//							div.load("/login/initLoginPopLayer.action", {layer_gubun:'LOCK'},  function() {
//								layer.show();
//								$("#MEMLOCK_LAYER").find(".btn_close > span").attr("class" , "");
//							});
//						},
//						close_call_back: function() {
//							var callback_url = pin.callback_url;
//							window.location.href = callback_url;
//						}
//					});
//					
//			},
//			//무실적
//			fnNoneResultSns : function(formObj, pin , oneClickResult) {
//				
//				elandmall.layer.createLayer({
//					layer_id:"NONERESULT_LAYER",
////					title: "장기간 비밀번호 미변경안내",
//					class_name:"lg_pop",
//					close_btn_txt:"닫기",
//					createContent: function(layer) {
//						var div = layer.div_content;
//						div.load("/login/initLoginPopLayer.action", {layer_gubun:'NONERESULT'},  function() {
//							
//							//버튼추가 처리 
//							var html = "";
//							html = "<ul class=\"btn_list02\">" ;
//							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">취소</a></li>" ;
//							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>확인</strong></a></li>"; 
//							html += "</ul>";
//							div.append(html);
//							
//							div.find("#cancel").click(function(){
//								layer.close();
//							});
//							div.find("#confirm").click(function(){
//								elandmall.mypage.link.cancelNoPurchase(elandmall.oneclick.getLoginId() ,"90");
//							});
//							
//							layer.show();
//							$("#NONERESULT_LAYER").find(".btn_close > span").attr("class" , "");
//						});
//					},
//					close_call_back: function() {
//						var callback_url = pin.callback_url;
//						window.location.href = callback_url;
//					}
//				});
//			},
//			//휴먼계정
//			fnQuiescenceSns : function(formObj, pin , oneClickResult){
//				
//				elandmall.layer.createLayer({
//					layer_id:"QUIESCENCE_LAYER",
////					title: "휴면 계정 안내",
//					class_name:"lg_pop",
//					close_btn_txt:"닫기",
//					createContent: function(layer) {
//						var div = layer.div_content;
//						div.load("/login/initLoginPopLayer.action", {layer_gubun:'QUIESCENCE'},  function() {
//							
//							//버튼추가 처리 
//							var html = "";
//							html = "<ul class=\"btn_list02\">" ;
//							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">취소</a></li>" ;
//							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>확인</strong></a></li>"; 
//							html += "</ul>";
//							div.append(html);
//							
//							
//							div.find("#cancel").click(function(){
//								layer.close();
//							});
//							div.find("#confirm").click(function(){
//								pin["accessToken"] = oneClickResult.accessToken;
//								pin["membState"] = oneClickResult.membState;
//								
//								layer_fix_close("QUIESCENCE_LAYER");
//								
//								elandmall.loginProc.fnOneClickLogin(formObj, pin);
//							});
//							
//							layer.show();
//							$("#QUIESCENCE_LAYER").find(".btn_close > span").attr("class" , "");
//						});
//					},
//					close_call_back: function() {
//						var callback_url = pin.callback_url;
//						window.location.href = callback_url;
//					}
//				});
//			},
//			//사이트추가
//			fnSiteAddSns : function(formObj, pin , oneClickResult){
//				
//				elandmall.layer.createLayer({
//					layer_id:"SITEADD_LAYER",
////					title: "사이트 이용 안내",
//					class_name:"lg_pop",
//					close_btn_txt:"닫기",
//					createContent: function(layer) {
//						var div = layer.div_content;
//						div.load("/login/initLoginPopLayer.action", {layer_gubun:'SITEADD'},  function() {
//
//						    //버튼추가 처리  
//							var html = "";
//							html = "<ul class=\"btn_list02\">" ;
//							html += "<li><a href=\"javascript://\" id=\"cancel\" class=\"btn_brd03 c01\">취소</a></li>" ;
//							html += "<li><a href=\"javascript://\" id=\"confirm\" class=\"btn_bg06 c01\"><strong>확인</strong></a></li>"; 
//							html += "</ul>";
//							div.append(html);
//							
//							div.find("#cancel").click(function(){
//								layer.close();
//							});
//							div.find("#confirm").click(function(){
//								
//								pin["accessToken"] = oneClickResult.accessToken;
//								pin["membState"] = oneClickResult.membState;
//								pin["emailYn"] = (div.find("#emailYn:checked") && (div.find("#emailYn:checked").val() == "Y"))?"Y":"N";
//								pin["smsYn"] = (div.find("#smsYn:checked") && (div.find("#smsYn:checked").val() == "Y"))?"Y":"N";
//								
//								layer_fix_close("SITEADD_LAYER");
//								elandmall.loginProc.fnOneClickLogin(formObj, pin);
//								
//							});
//						
//							
//							layer.show();
//							$("#SITEADD_LAYER").find(".btn_close > span").attr("class" , "");
//						});
//					},
//					close_call_back: function() {
//						var callback_url = pin.callback_url;
//						window.location.href = callback_url;
//					}
//				});
//			}
	}
	
	/**
	 * 로그인 페이지 접속
	 * popup : 팝업여부 default: true
	 * nomember :  비회원구매버튼노출 , default:false
	 * ordlogin :  주문배송로그인 무조건 노출 됨  default:false
	 * rtn_btn_id : 팝업을 닫기 전 활성화 될 버튼 명
	 */
	elandmall.login = function(p) {
		p = $.extend({popup:true, nomember:false, ordlogin:false , rtn_btn_id:"", is_app:false } , p||{});

		if(elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.app.elandApp(elandmall.global.app_version)){
			// 채널이 app 이면서 네이티브의 로그인 호출화면이 아니면 브릿지 호출
			// 하이브리드 하면에서의 호출은 is_app가 false 이므로 아래 브릿지를 통하여 웹뷰의 로그인 화면 호출
			// 웹뷰화면에서 로그인후 다음동작을 위해서 브릿지 호출하지 않고 기존 레이어 호출
			if(!p.is_app && typeof(webView) != "undefined" && webView =="Y" ){
				location.href="elandbridge://layerLogin";
				return false;
			// APP 네이티브 기획전인 (IOS) 경우 아래를 통하여 로그인 레이어 웹뷰 호출
			// APP에서 웹뷰 호출 ==> /app/initAppHeader.action?path_url=/login/initLogin.action?gnbwebview=Y 하면/fo_mobile/webapp/main/api/initAppHeader.jsp 페이지 노출 is_app true로 셋팅됨
			} else if(!p.is_app && (elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS") && typeof(planShopYn) != "undefined" && planShopYn =="Y"){
				location.href=elandmall.util.newHttps("/app/initAppHeader.action?path_url=/login/initLogin.action&gnbwebview=Y");
				return false;
			}
		}
		
		
		//NGCPO-9144 키디키디 상품상세 화면에서 SNS 로그인이 되지 않는 현상 관련
		// 요청을 보낸 페이지가 iframe 안에 있고, 전시몰이 kidikidi인 경우 
		if(self != top && elandmall.global.disp_mall_no == "0000113"){ 
			top.elandmall.login(p);
			return false;
		}
		
		if(p.popup){
			var layer = elandmall.layer.createLayer({
				layer_id:"layer_pop",
				rtn_btn_id:p.rtn_btn_id,
				class_name:"layer_fix layer_login",
				title: "로그인",
				close_call_back:function() {
					if(elandmall.global.app_cd != "" ){
						var aIframe = $("<iframe name=\"_FORM_APP_TABBAR_TARGET\" id=\"_FORM_APP_TABBAR_TARGET\" />");
						aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
						aIframe.attr("src", "elandbridge://tabbar/show/");
						aIframe.appendTo('body');

						var aIframe = $("<iframe name=\"_FORM_APP_HEADER_TARGET\" id=\"_FORM_APP_HEADER_TARGET\" />");
						aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
						aIframe.attr("src", "elandbridge://header/show/");
						aIframe.appendTo('body');

						if ($.type(elandmall.global.app_version) != 'undefined' && elandmall.app.elandApp(elandmall.global.app_version) && typeof(webView) != "undefined" && webView =="Y"){
							var aIframe = $("<iframe name=\"_FORM_APP_TARGET\" id=\"_FORM_APP_TARGET\" />");
							aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
							aIframe.attr("src", "elandbridge://backBrowser/");
							aIframe.appendTo('body');
							return false;
						}
					}
					
					if ( $("#bundle_detail").length > 0 ) {
						layer_fix_close2('layer_pop');
					}else{
						layer_fix_close('layer_pop');

						if(elandmall.global.disp_mall_no == "0000045") { //킴스클럽
							//  킴스 장바구니일때
							if($('#tabClickLoginOpenYn').length > 0) {
								if($('#tabClickLoginOpenYn').val() == 'Y') {
									$('#tabClickLoginOpenYn').val('N');
									$('#cartBt_0').attr('aria-selected', 'true');
									$('#cartBt_1').attr('aria-selected', 'false');
								}
							}
						}
					}

					/* 로그인 레이어 닫기 클릭시의 callback function 실행(isLogin에 close로 넣어줌) */
					if ($.type(elandmall._login_close_callback) == "function") {
						var close_callback_run = elandmall._login_close_callback;
						elandmall._login_close_callback = null;
						close_callback_run();
					}
				},
				createContent: function(layer) {
					
					var div = layer.div_content;
					
					div.load("/login/initLoginLayer.action",p,function(){
						
						div.find(".tab_addr li").click(function(){
							addrId = $(this).index();

							$(this).parent().find("li").removeClass("on");
							$(this).addClass("on");
							$(this).parent().parent().find(".con_addr > div").hide();
							$(this).parent().parent().find(".con_addr > div").eq(addrId).show();
						});

						//한글자판 보기
						div.find(".keyb .ico").click(function(){
							$(this).toggleClass("on");
							$(this).parent().parent().find(".keyi").slideToggle(200);
							if($(this).text() == '한글자판 보기'){
								$(this).text('한글자판 닫기');
							} else {
								$(this).text('한글자판 보기');
							}
						});
						
						
						div.find("#login_id").keydown(function(e) {
					        if(e.keyCode == 13){
					            fnLogin();
					        }
					    });
						
						div.find("#login_id").focus(function(e) {
							div.find(".txt_alert_login").html("");
					    });
					    
						div.find("#pwd").keydown(function(e) {
					        if(e.keyCode == 13){
					        	fnLogin();
					        }
					    });
						
						div.find("#pwd").focus(function(e) {
							div.find(".txt_alert_login").html("");
					    });
						
						div.find("#orderer_nm").keydown(function(e) {
					        if(e.keyCode == 13){
					        	fnOrdLogin();
					        }
					    });
					    
						div.find("#cell_no").keydown(function(e) {
					        if(e.keyCode == 13){
					        	fnOrdLogin();
					        }
					    });
					    
						div.find("#ord_no").keydown(function(e) {
					        if(e.keyCode == 13){
					        	fnOrdLogin();
					        }
					    });
						
						div.find("#login_btn").click(function() {
							fnLogin();
						});
						
						fnLogin = function() {
							
							var lid = div.find("#login_id").val().replace(/\s/gi, ''); 
							div.find("#login_id").val(lid);
							
							//유효성체크 하기
						    if($.trim($("#login_id").val()) == ""){
				                div.find(".txt_alert_login").html("아이디를 입력해 주세요.");
				                return false;
				            }else if($.trim($("#pwd").val()) == ""){
				                div.find(".txt_alert_login").html("비밀번호를 입력해 주세요.");
				                return false;
				            }
						    
						    elandmall._login_msg = function(error_msg) {
								$("#layer_pop").find(".txt_alert_login").html(error_msg);
							}
				        	var form = $("#loginForm");
				           	form.find("#scheme").val(location.protocol);
				        	form.find("#ret_domain").val(location.host);
				        	form.find("#loginType").val("member");
				          	elandmall.loginProc.fnOneClickLogin($("#loginForm") , p);
						};
						
						//회원가입
						div.find("#join_btn, #join_btn2").click(function() {
							setTimeout(function(){
								elandmall.oneclick.fnMemJoin();
							}, 100)
				        });
						
						div.find("#find_id").click(function() {
							setTimeout(function(){
								elandmall.oneclick.fnMemIDFind();
							}, 100)
				        });
						
						div.find("#find_passwd").click(function() {
							setTimeout(function(){
								elandmall.oneclick.fnMemPassFind();
							}, 100)
				        });
						
						//비회원로그인
                        div.find("#nomember_btn").click(function() {
                        	elandmall.loginProc.fnNomemLogin();
				        });

                        //비회원로그인
                        div.find("#nomember_btn2").click(function() {
                        	elandmall.loginProc.fnNomemLogin();
				        });
                        
						//주문로그인
						div.find("#ord_btn").click(function() {
							fnOrdLogin();
				        });
						
						fnOrdLogin = function() {

							  //유효성체크 하기
						    if($.trim($("#orderer_nm").val()) == ""){
				                div.find(".txt_alert_order").html("구매자명을 입력해 주세요.");
				                return false;
				            }else if($.trim($("#cell_no").val()) == ""){
				                div.find(".txt_alert_order").html("휴대폰 번호를 입력해 주세요.");
				                return false;
				            }else if($.trim($("#ord_no").val()) == ""){
				                div.find(".txt_alert_order").html("주문번호를 입력해 주세요.");
				                return false;
				            }
						    
				        	//처리구 뿌려줄 문구 처리 
				        	elandmall._login_msg = function(error_msg){
								$("#layer_pop").find(".txt_alert_order").html(error_msg);
							}
						    
							var form = $("#loginForm");
				        	form.find("#scheme").val(location.protocol);
				        	form.find("#ret_domain").val(location.host);
				        	form.find("#loginType").val("ord");
				        	elandmall.loginProc.fnOrdLogin($("#loginForm") , p);
				        	
						};

						layer.show();
						
					    if(elandmall.global.app_cd != "" ){
						   location.href="elandbridge://tabbar/hide/";
						}
						
						//ios 는 제외 디폴트 적용 처리
						if(elandmall.global.apptype != "IOS") {
							setTimeout(function(){
								div.find("#login_id").focus();
							},500);//milliseconds	
						}
						
						$('.layer_fix.layer_login .btn_close').click(function() {
							if(typeof entry_lock != 'undefined'){
								entry_lock = "N";
							}
						});
						
						if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
							$('.layer_login').find($('input[type="text"], input[type="password"]')).on('touchstart focusin', function() {
								$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
							});
							
							$('.layer_fix.layer_login .btn_close').click(function() {
								 if($('body').has('.goods_wrap')==true){
								  $('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
								 }
							});
						}
						
					});
				}
			});
		//바닥로그인	
		}else{
           window.location.href = elandmall.util.https("/login/initLogin.action");
		}
	};
	
	
})(jQuery);