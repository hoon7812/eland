;(function ($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	
	//레이어 닫기 부분이다. 
	elandmall._login_close = function (callback, pin) {
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
			
			//pc는 해당 레이어 모두 활성화 처리 
			fnCommLayer : function(callback , pin){
				
				var membState = pin.membState; 
				var layerCnt = 0;
			    if(membState == "60") {
			    	layerCnt++;
			    	elandmall.login_layer.fnLongTimeWdInfo(callback);
			    } else if(membState == "70"){
			    	layerCnt++;
			    	elandmall.login_layer.fnTmpPassWdInfo(callback);
			    } 
			    
			    //임직원이고 복지몰 알람을 보지 않았다면 알람레이어를 띄운다.
			    if(pin.is_staff == 'staff'){
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
			    	}

			    	var isStaffGiftNoti = pin.is_staff_gift_noti;
			    	if(layerCnt == 0 && $.type(isStaffGiftNoti) != "undefined" && isStaffGiftNoti != 'Y'){
			    		layerCnt ++;
			    		elandmall.login_layer.fnStaffGiftNoti(callback);
				    }
			    }

			    if($.type(pin.coupon_param) != "undefined" && pin.coupon_param != "") {
					
					var coupon_param  = pin.coupon_param.split(",");
					var birthLayer = false;
					var MarryDay = false;
				    var set_coupon_param = "";
					$.each(coupon_param , function(idx , sdata) {
						
						var coupon_param_new = "";
						var data = sdata.split("^")						
						//생일
						if(data[0] == "10" && data[1] == "N" ) {
							coupon_param_new = "10^Y";
							birthLayer = true;
					    //결혼기념일
						} 
						
						if(data[0] == "20" && data[1] == "N" ) {
  						    coupon_param_new = "20^Y";	
							MarryDay = true;
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
						layerCnt++;
					    elandmall.login_layer.fnBirthDay(callback, {coupon_param:set_coupon_param});
					}
					
					if(MarryDay){
						layerCnt++;
						elandmall.login_layer.fnMarryDay(callback, {coupon_param:set_coupon_param});
					}
					
					//임직원 콜백처리를 위해 추가
					if(layerCnt == 0) {
						if($.type(callback) == "function"){
							callback();
			    		}
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
			//무실적
			fnNoneResult : function(formObj, pin , oneClickResult){
				
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
			fnMemLock : function(formObj, pin , oneClickResult) {
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
			fnQuiescence : function(formObj, pin , oneClickResult){
				
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
			//장기간비밀번호안내
			fnLongTimeWdInfo : function(callback){
				
				if($.browser.msie && $.browser.version<=9) {
				    $.getScript(elandmall.global.js_path+"/common/js/jquery.xdomainrequest.js");
				}
				
				elandmall.layer.createLayer({
					layer_id:"LONGTIMEWDINFO_LAYER",
//					title: "장기간 비밀번호 미변경안내",
					class_name:"layer_pop lay_temp02 on",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						$("#LONGTIMEWDINFO_LAYER").hide();
					},
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'LONGTIMEPW'},  function() {
							
							//버튼추가 처리 
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"after_close\" class=\"btn02 c01\"><span>90일이후에변경</span></button>" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn02\"><span>지금변경</span></button>" 
							html += "</div>";
							div.after(html);
							
							var obj = div.parent();
							obj.find("#after_close").click(function(){
								elandmall.oneclick.fnExtendPwdChange(layer.close());
							});
							obj.find("#confirm").click(function(){
								elandmall.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId() ,"60");
							});
							
							elandmall.util.setCookie({ name:'membState', domain: elandmall.global.cookie_domain, value:'', path: "/" });
							layer.show();
						});
					}
				});
				
			},
			//임시비밀번호로그인안내
			fnTmpPassWdInfo : function(callback){
				if($.browser.msie && $.browser.version<=9) {
				    $.getScript(elandmall.global.js_path+"/common/js/jquery.xdomainrequest.js");
				}
				
				elandmall.layer.createLayer({
					layer_id:"TMPPASSWDINFO_LAYER",
//					title: "임시 비밀번호 로그인 안내",
					class_name:"layer_pop lay_temp02 on",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						$("#TMPPASSWDINFO_LAYER").hide();
					},
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'TEMPPW'},  function() {

							//버튼추가 처리 
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"after_close\" class=\"btn02 c01\"><span>다음에변경</span></button>" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn02\"><span>지금변경</span></button>" 
							html += "</div>";
							div.after(html);
							
							var obj = div.parent();
							obj.find("#after_close").click(function(){
								elandmall.oneclick.fnHoldTempPassword(layer.close());
							});
							obj.find("#confirm").click(function(){
								elandmall.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId() ,"70");
							});
							
							//쿠키삭제
							elandmall.util.setCookie({ name:'membState', domain: elandmall.global.cookie_domain, value:'', path: "/" });
							layer.show();
						});
					}
				});
			}, 
			//생일쿠폰
			fnBirthDay : function(callback, pin) {
				
				elandmall.layer.createLayer({
					layer_id:"BIRTHDAY_LAYER",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						$("#BIRTHDAY_LAYER").hide();
					},
					class_name:"layer_pop lay_temp01 on",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'BIRTH'},  function() {
						
							//버튼추가 처리 
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"cancel\" class=\"btn02 c01\"><span>나중에하기</span></button>" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn02\"><span>마이페이지</span></button>" 
							html += "</div>";
							div.after(html);
							
							
							var obj = div.parent();
							obj.find("#cancel").click(function(){
								layer.close();
							});
							obj.find("#confirm").click(function(){
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
			fnMarryDay : function(callback, pin) {
				
				elandmall.layer.createLayer({
					layer_id:"MARRYDAY_LAYER",
					close_call_back:function() {
						if($.type(callback) == "function"){
					        callback();
						}
						$("#MARRYDAY_LAYER").hide();
					},
					class_name:"layer_pop lay_temp01 on",
					createContent: function(layer) {
						var div = layer.div_content;
						div.load("/login/initLoginPopLayer.action", {layer_gubun:'MARRY'},  function() {

							//버튼추가 처리 
							var html = "";
							html = "<div class=\"set_btn\">" 
							html += "<button type=\"button\" id=\"cancel\" class=\"btn02 c01\"><span>나중에하기</span></button>" 
							html += "<button type=\"button\" id=\"confirm\" class=\"btn02\"><span>마이페이지</span></button>" 
							html += "</div>";
							div.after(html);
							
							
							var obj = div.parent();
							obj.find("#cancel").click(function(){
								layer.close();
							});
							obj.find("#confirm").click(function(){
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
				//복지몰 알림
				fnWflAlram : function(callback, pin) {
					elandmall.layer.createLayer({
						layer_id:"WFL_LAYER",
						class_name:"layer_pop lay_temp02 wfp on",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'WFL'},  function() {
								var obj = div.parent();
								obj.find(".btn_lay_close").remove();
								obj.find(".btn_close").click(function(){
									layer.close();
								});
								
								layer.show();
								lockLoginPop = false;
							});
						}
					});			
				},
				//복지포인트 기부 알람
				fnDonAlram : function(callback, pin) {
					elandmall.layer.createLayer({
						layer_id:"DON_LAYER",
						class_name:"layer_pop lay_temp02 wfp on",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'DON'},  function() {
								var obj = div.parent();
								obj.find(".btn_lay_close").remove();
								obj.find(".btn_close").click(function(){
									layer.close();
								});
								
								obj.find("#arg").click(function(){
									$('#receipt_area').show();
								});
								
								obj.find("#disarg").click(function(){
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
											layer.close();
											
											if($.type(callback) == "function"){
										        callback();
									    	}
										},
										error: function(e) {
											alert('오류가 발생하였습니다.');
											layer.close();
											
											if($.type(callback) == "function"){
										        callback();
									    	}
										}
									});	
								});
								
								layer.show();
								setEck();
								lockLoginPop = false;
							});
						}
					});			
				},
				//복지포인트 상품권 구매안내
				fnStaffGiftNoti : function(callback, pin) {
					elandmall.layer.createLayer({
						layer_id:"GIFT_LAYER",
						class_name:"layer_pop lay_temp02 wfp on",
						createContent: function(layer) {
							var div = layer.div_content;
							div.load("/login/initLoginPopLayer.action", {layer_gubun:'GIFT'},  function() {
								var obj = div.parent();

								obj.find(".btn_lay_close").remove();

								obj.find("#btn_today").click(function(){
									elandmall.util.setCookie({ name: "is_staff_gift_noti", value: "Y", age:1, path: "/", domain : elandmall.global.cookie_domain });
									layer.close();
								});

								layer.show();
								lockLoginPop = false;
							});
						}
					});			
				}

	}
	
	
	/**
	 * 로그인 페이지 접속
	 * popup : 팝업여부 default: true
	 * nomember :  비회원구매버튼노출 , default:false
	 * ordlogin :  주문배송로그인 무조건 노출 됨  default:false
	 * rtn_btn_id : 팝업을 닫기 전 활성화 될 버튼 명
	 */
	elandmall.login = function(p) {
		p = $.extend({popup:true, nomember: false, ordlogin:false , rtn_btn_id:"", nomember_hide: false} , p||{});

		if(p.popup){
			if ( !lockLoginPop ) {
				
				if($.browser.msie && $.browser.version<=9) {
				    $.getScript(elandmall.global.js_path+"/common/js/jquery.xdomainrequest.js");
				}
				var layer = elandmall.layer.createLayer({
					layer_id:'layer_pop',
					rtn_btn_id:p.rtn_btn_id,
					class_name:"layer_pop login01 on",
					title: "로그인",
					createContent: function(layer) {
						var div = layer.div_content;
						
						div.load("/login/initLoginLayer.action",p,function(){
							
							login_input_placeholder = function( target ){
								
								var $this = $(target);
								$this.on("keydown keyup blur",eng);
								function eng(){
									if ( $this.val().length > 0 ) {
										$this.removeClass("ph_bg_on");
									}else{
										$this.addClass("ph_bg_on");
									}
								}
							}
							
							div.parents("#layer_pop").find(".btn_lay_close").click(function(e) {
								if($("#detailPreview .event_goods_pop").length > 0) {
									elandmall.goodDetailPreviewLayer.openEventLayer();
								}
								lockLoginPop = false;

								/* 로그인 레이어 닫기 클릭시의 callback function 실행(isLogin에 close로 넣어줌) */
								if ($.type(elandmall._login_close_callback) == "function") {
									var close_callback_run = elandmall._login_close_callback;
									elandmall._login_close_callback = null;
									close_callback_run();
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
							    if($.trim(div.find("#login_id").val()) == ""){
					                div.find(".txt_alert_login").html("아이디를 입력해 주세요.");
					                return false;
					            }
							    
							    if($.trim(div.find("#pwd").val()) == ""){
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
								elandmall.oneclick.fnMemJoin();
					        });
							
							div.find("#find_id").click(function() {
								elandmall.oneclick.fnMemIDFind();
					        });
							
							div.find("#find_passwd").click(function() {
								elandmall.oneclick.fnMemPassFind();
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
							
							login_input_placeholder(".d_input01");
							login_input_placeholder(".d_input02");
							login_input_placeholder(".d_input03");
							login_input_placeholder(".d_input04");
							login_input_placeholder(".d_input05");
							
							// NGCPO-7020 IE 포커스 이슈. scrollTop(0) 추가. 
							$(window).scrollTop(0);
							div.find("#login_id").focus();
							
							$('.lay_wrap .btn_lay_close').click(function() {
								if(typeof entry_lock != 'undefined'){									
									entry_lock = "N";
								}
							});
						});
					}
				});				
				lockLoginPop = true;
			}
			
		//바닥로그인	
		}else{
           window.location.href = elandmall.util.https("/login/initLogin.action");
		}
	};
	
	
})(jQuery);