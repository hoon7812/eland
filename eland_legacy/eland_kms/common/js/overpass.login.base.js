/**
 * 업무관련(로그인관련메소드) 
 */
;(function($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	
	elandmall._login_callback = null; //로그인 레이어에서, 타 업무에대한 콜백처리(찜하기, 바로구매 등등)
	elandmall._login_close = null;	//로그인 레이어 hide처리 (성공시) 
	elandmall._login_msg = null; //로그인 메세지 오류는 공통함수로 callback처리 (바닥 , 레이어 공통을 처리함)
	elandmall._brand_refresh = null;
	
	elandmall._brand_refresh = function(isOn){
		var objDiv = $(".main_br_cl > ul.evt_sp");
		var staffY = $(objDiv).find("li.brand_staff");
		var staffN = $(objDiv).find("li.brand_staff_bf");
		if($.type(isOn) != "undefined" && isOn == false) {

			$(staffY).hide(); 
			$(staffN).show();
			
		}else {
		    $(staffN).hide();
			$(staffY).show();
		}
	}
	
	elandmall._login_app_callback = function(result){
		var locationUrl = location.href;
		
		if($.type(elandmall.global.app_cd) != "undefined" && elandmall.global.app_cd != ""){

			if(result.login) { /* 회원로그인 */
				
				$.ajax({
					url: "/app/appLoginInfo.action",
					dataType: "json",
					async: false,
					success : function(rstInfo) {
						
						var appParam = "";
						if(rstInfo.login_id){
							appParam = "&User_id="+rstInfo.login_id;
						}
						if(rstInfo.cust_id){
							appParam += "&cust_id="+rstInfo.cust_id;
						}
						if(rstInfo.mbr_nm){
							appParam += "&User_name="+rstInfo.mbr_nm;
						}
						if(rstInfo.delivery_count){
							appParam += "&Delivery_count="+rstInfo.delivery_count;
						}
						if(rstInfo.birth_day){
							appParam += "&birth_day="+rstInfo.birth_day;
						}
						if(rstInfo.wedd_cele_day){
							appParam += "&wedd_cele_day="+rstInfo.wedd_cele_day;
						}
						if(rstInfo.staff_yn){
							appParam += "&staff_yn="+rstInfo.staff_yn;
						}
						if(rstInfo.pop_type){
							appParam += "&pop_type="+rstInfo.pop_type;
						}
						if(rstInfo.pop_title){
							appParam += "&pop_title="+rstInfo.pop_title;
						}
						if(rstInfo.pop_cancel_url){
							appParam += "&pop_cancel_url="+rstInfo.pop_cancel_url;
						}
						if(rstInfo.pop_confirm_url){
							appParam += "&pop_confirm_url="+rstInfo.pop_confirm_url;
						}
						if(rstInfo.pop_url){
							appParam += "&pop_url="+encodeURIComponent(rstInfo.pop_url);
						}
						
						appParam += "&autoLogin="+ rstInfo.autoLoginYn;
						
		                var aIframe = $("<iframe name=\"_FORM_APP_TARGET\" id=\"_FORM_APP_TARGET\" />");
		                aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
		                aIframe.attr("src", "elandbridge://login/?login_yn=y" + appParam);
		                aIframe.appendTo('body');
		                
		                /*
		                if($.type(rstInfo.staff_yn) != "undefined" && rstInfo.staff_yn == "Y") {
		                	elandmall._brand_refresh();
		                }*/
		                /*
		                if (locationUrl.indexOf(elandmall.global.base_domain_url+"/main/initMain") > -1 && rstInfo.staff_yn) {
		                	var staffAreaLi = $(".main_br_cl > ul.evt_sp > li:eq(8)");
		                	var staff_html = "<a href=\"javascript:;\" onclick=\"elandmall.dispctg.goDispctg({disp_ctg_no:'1707323093'}); return false;\"><img src=\""+elandmall.global.image_path+"/images/mobile/main/bn_main_brand_staff_new.png\" alt=\"MW_메인||브랜드버튼||복지몰\" /></a>";
		                	staffAreaLi.empty();
		                	staffAreaLi.append(staff_html);
		                	location.reload();
		                }*/
					}
				});
			} else {
				
				$.ajax({
					url: "/app/appLoginInfo.action",
					dataType: "json",
					async: false,
					success : function(rstInfo) {
						
						var appParam = "";
						if(rstInfo.login_id){
							appParam = "&User_id="+rstInfo.login_id;
						}
						if(rstInfo.cust_id){
							appParam += "&cust_id="+rstInfo.cust_id;
						}
						if(rstInfo.mbr_nm){
							appParam += "&User_name="+rstInfo.mbr_nm;
						}
						if(rstInfo.delivery_count){
							appParam += "&Delivery_count="+rstInfo.delivery_count;
						}
						if(rstInfo.Anniversary){
							appParam += "&Anniversary="+rstInfo.anniversary;
							appParam += "&Anniversary_type="+rstInfo.anniversary_type;
						}
						if(rstInfo.staff_yn){
							appParam += "&staff_yn="+rstInfo.staff_yn;
						}						
						appParam += "&autoLogin="+ rstInfo.autoLoginYn;
						
		                var aIframe = $("<iframe name=\"_FORM_APP_TARGET\" id=\"_FORM_APP_TARGET\" />");
		                aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
		                aIframe.attr("src", "elandbridge://login/?login_yn=n" + appParam);
		                aIframe.appendTo('body');
		                
					}
				});
	                
			}
		}
	}
	
	
	elandmall.logout = function(p) {
		p = $.extend({logout:null} , p||{});
		
		var form = $("<form id='_COMMLOGIN_FORM'></form>").appendTo("body").createForm();
		form.submit({
			iframe: true,
			action: "/login/logout.action",
			success: function(result) {
				
				if($.type(elandmall.global.app_cd) != "undefined" && elandmall.global.app_cd != ""){
				    var aIframe = $("<iframe name=\"_FORM_APP_LOGOUT_TARGET\" id=\"_FORM_APP_LOGOUT_TARGET\" />");
	                aIframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
	                aIframe.attr("src", "elandbridge://logout/?Logout_yn=Y");
	                aIframe.appendTo('body');
				}
			
				if (p.logout && $.type(p.logout) == "function") {
					p.logout();
			    } else {
			    	
			    	//PC 키디마켓, 키디키디 상품상세 화면에서 로그아웃 시 통합몰로 이동처리(헤더 깨짐 방지) 
			    	if(($.type(elandmall.global.kidi_domain_url) != "undefined" && elandmall.global.http_url.indexOf(elandmall.global.kidi_domain_url) > -1) 
			    	 ||($.type(elandmall.global.kidimarket_domain_url) != "undefined" && elandmall.global.http_url.indexOf(elandmall.global.kidimarket_domain_url) > -1)){
			    		
			    		window.location.href = "https:" + elandmall.global.base_domain_url;
			    		
			    	}else{
					
			    	//로그아웃 후 메인으로 이동 처리 _ 슈펜의 경우 슈펜메인으로 이동 그외 통합몰 메인으로 이동
			    		var http_url = elandmall.global.http_url;
			    		if(elandmall.global.disp_mall_no == "0000053"){
			    			http_url = "https:" + elandmall.global.shoopen_domain_url;
			    		}
			    	window.location.href = elandmall.util.newHttps(http_url+"/main/initMain.action");
			    	
			    	}
			    }
			},
			error: function(result) {
				alert(result.error_message);	
			}
		});
	};
	
	/**
	 * 로그인 여부를 반드시 확인하고 업무를 진행할 경우 사용한다. 로그인 되어야지 사용할 수 있는 action들은 모드 isLogin을 통하도록 한다.
	 * {
	 * 	login: function -> 팝업 로그인 성공 후 호출되는 콜백 함수
	 *  nomember:false  => true: 비회원 로그인, false : 회원로그인 
		popup : true => 팝업여부 디폴트 true
	 * } 
	 */
	elandmall.isLogin = function(p) {
		
		elandmall._login_callback = null;
		elandmall._login_close_callback = null;
		
		p = $.extend({
			login: null,
			popup:true,       /* 기본 팝업창  */
			nomember_proc:false, /* 비회원로그인후 by pass */
			nomember:false,    /* true: 비회원 로그인, false : 회원로그인  */
			is_app:false,
			close:null,	/* 로그인 레이어 닫기 클릭시 실행할 callback function */
			nomember_hide : false,
		}, p || {});
		
		if ($.type(p.login) != "function") {
			alert("죄송합니다. 전달된 정보가 올바르지 않습니다.");
			return false;
		};
		
		$.ajax({
			url: "/login/isLogin.action",
			data: {nomember_proc:(p.nomember_proc)?"Y":"N"},
			dataType: "json",
			async: false,
			success : function(data) {
				if (data.login) {
					if ( data.auto_login_yn ) {
						elandmall._login_app_callback({login:true});
					}
					p.login({nomember:data.nomember, member:data.member});
				} else {
					elandmall._login_callback = p.login;
					elandmall._login_close_callback = p.close;
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

					//p.nomember : true인 경우 (로그인창 안에 비회원구매 버튼이 활성화 된다)
					elandmall.login({
						popup:p.popup,
						nomember:p.nomember,
						is_app:p.is_app,
						nomember_hide:p.nomember_hide
					});
				};
			}
		});
	};
	
    elandmall.loginCheck = function(p) {
    	
    	var memberLogin = false;
		p = $.extend({
			login: null,
			nomember:false    /* true: 비회원 로그인, false : 회원로그인  */
		}, p || {});
		
		$.ajax({
			url: "/login/isLogin.action",
			data: {nomember_proc:(p.nomember_proc)?"Y":"N"},
			dataType: "json",
			async: false,
			success : function(data) {
				memberLogin = data.login;
			}
		});
		
		return memberLogin;
	};
	
	//로그인 공통 처리 
	elandmall.loginProc = {
		
	    //비회원로그인처리
		fnNomemLogin : function(){
			
			$.ajax({
    			url: "/login/noMemberLogin.action",
    			dataType: "json",
    			success : function(data) {
    				//주문상세로 이동 처리
    				if(data.login){
    					var calback = function(){
    						elandmall._login_callback({nomember:data.nomember, member:data.member});
    					}
    					elandmall._login_close(calback, {noMember:true});
    				}
    			} 
    		});
		},
		//주문배송로그인처리
		fnOrdLogin : function(formObj , pin) {
			
			pin = $.extend({popup:false}, pin||{});
			
			//https와 https인 경우는 도메인 동일하기에..
			if(location.protocol == "https:"){
				
				var form = $(formObj).createForm();
				form.submit({
		            iframe: true,
		            action: "https://" + location.host + "/login/loginProc.action",
		            success: function(p) {
		            	
		            	if(p.req_code == "F" ) {
		            		elandmall._login_msg(p.error_message);
		        		} else if(p.req_code == "S") {
		        			/* 주문배송로그인으로 이동처리*/
		        			elandmall.nomember.orderDetail({'ord_no':p.ord_no});	
		        		}
		            },
		            error: function(p) {
		                if(p.error_type == "kr.co.overpass.exception.UserException") {
		                    window.alert(p.error_message);              
		                    return;
		                }
		            }
		        });
				
			//http => https 인경우는 도메인이 다르므로 아이프레임 hidden으로 처리한다.	
			} else {
				
				if ($("#_LOGIN_IFRAME_").length > 0) {
	    			$("#_LOGIN_IFRAME_").remove();
	    		}
				
				var iframe = $("<iframe name=\"_LOGIN_IFRAME_\" id=\"_LOGIN_IFRAME_\" />");
				iframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
				iframe.appendTo(formObj);
				
				formObj.attr("target", "_LOGIN_IFRAME_");
				formObj.attr("action", "https://" + location.host + "/login/initLoginLayerProc.action");
				formObj.submit();
			}
		},
		//원클릭로그인처리 진행전 Google reCAPTCHA v3 조회
		fnOneClickLogin : function(formObj , pin) {
			pin = $.extend({grecaptcharesponse:null} , pin||{});

			grecaptcha.ready(function() {
				grecaptcha.execute($(formObj).find("#google_recaptcha_site_key").val(), {action: $(formObj).find("#google_recaptcha_action").val()}).then(function(token) {
					pin["grecaptcharesponse"] = token;
					
					NetFunnel_Action(  {action_id: elandmall.global.netfunnel_login_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80"},
							{	 success:function(ev,ret){ //성공
									elandmall.loginProc.fnOneClickLoginProc(formObj , pin);
								 },error:function(ev,ret){ //오류
									 	 elandmall.outputSeverLog({msg:"ERROR [netfunnel] - fnOneClickLogin || msg : " + ret.data.msg});
									 	 if(NetFunnel.Util.isRetryEnd()) {
												 alert("죄송합니다.대기열 호출 중 오류가 발생했습니다.");
									 	 }
								 }
						  	}
					);
					
					
				});
			});
		},
		//원클릭로그인처리
		fnOneClickLoginProc : function(formObj , pin) {
	    	if (typeof(lockLogin) != "undefined") {
		    	if (!lockLogin ) {
		    		lockLogin = true;
			    	pin = $.extend({popup:false}, pin||{});
			    	
			    	//auth정보 가져오기 
			    	var auth = elandmall.oneclick.getFrontAuth();
			    	if($.type(auth) != "string"){
			    		return;
			    	}
			    	var loginPassCd = {"10":"Y", "60":"Y", "70":"Y"};
			    	var oneClickParam = {authorization:auth,
										 autoLoginYn:((formObj).find("#auto_lgn_id:checked") && ((formObj).find("#auto_lgn_id:checked").val() == "Y"))?"Y":"N"};  
					 
			    	  //20: 휴면 해제 , 40: 부분탈퇴 ,80: 사이트추가
			    	 if(pin.membState == "20" || pin.membState == "40"  || pin.membState == "80" ) {
			    		// RR: 휴면해제 처리
			    		// CO: 부분탈퇴취소 처리
			    		// AS: 사이트추가 처리
		                if(pin.membState == "20" ) {
		                	oneClickParam["txDiv"] = "RR";
		                } else  if(pin.membState == "40" ) {
		                	oneClickParam["txDiv"] = "CO";
		                } else {
		                	oneClickParam["txDiv"] = "AS";
		                }
			    		//그외  
			 	    	if(pin.accessToken) {
			 			    oneClickParam["accessToken"] = pin.accessToken;
			 			}
			 	        if(pin.emailYn) {
			 			    oneClickParam["emailYn"] = pin.emailYn;
			 			}
			 	        if(pin.smsYn) {
			 	        	oneClickParam["smsYn"] = pin.smsYn;
			 	        }
			 	       	if(pin.dmYn) {
			 	       		oneClickParam["dmYn"]  = pin.dmYn;
			 	       	}
			    	} else {
				    	 //기본로그인 
						 oneClickParam["webId"] = $(formObj).find("#login_id").val();
				    	 oneClickParam["webPwd"] = $(formObj).find("#pwd").val();
				    	 oneClickParam["g-recaptcha-response"] = pin.grecaptcharesponse;
			    	}
			         
			    	   /*console.log("원클릭 통신정보 : 상용 전 노출안되게 설정 필요 ");
			      	   $.each(oneClickParam , function(a , o){
			      		   
			      		   console.log(a +">>"+o); //상용오픈 때는 사용하면 안됨
			      	   });*/

			    	if($.browser.msie && $.browser.version<=9) {
				    	jQuery.support.cors = true;
			           _gatewayURL_ = elandmall.util.https("/login/gateWay.action");
			    	}
			    	
			    	jQuery.ajax({
				    	type:'POST',
				    	crossDomain : true,
				    	cors:true,
		 			    url: elandmall.global.oneclick_domain_url + "/member/loginAjaxReCaptCha",
						data:oneClickParam,
						dataType : "json",
					    success : function(data) {
			        	   /*console.log("완전결과 :");
			        	   $.each(data , function(a , o){
			        		   console.log(a +">>"+o);
			        	   });*/
			        	   
			        	   data.autoLoginYn = oneClickParam.autoLoginYn;
			        	   //오류체크 한다. 
			        	   if($.type(data.accessToken) == "string" && data.resultCode == "0" 
			        		     && $.type(loginPassCd[data.membState]) == "string" && loginPassCd[data.membState] == "Y"
			        		   ){
			        		   elandmall.loginProc.fnCommonLogin(formObj , pin , data);   
			        	   } else {
				            	//로그인 넷퍼넬 키 반환
				    	    	try {
				    	       		NetFunnel_Complete({action_id: elandmall.global.netfunnel_login_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80" },function(){});
				    	    	}catch(e){
				    	    		console.log(e);
				    	    	}
			        		   
			        	       if(data.membState == "00"){
			        	    	   elandmall._login_msg('아이디/비밀번호가 일치하지 않습니다.');
			        	       }else if(data.membState == "50"){   
			        	    	   elandmall._login_msg('* 현재 고객님의 계정은 탈퇴상태 입니다. </br> 탈퇴 취소 신청은 고객센터(1833-6439)로 문의하시기 바랍니다.'); // NGCPO-7240 무실적 잠금 안내 팝업 문구의 전화번호 수정
			        	       } else if(data.errorCode == "202") {  //아이디 존재하지 않음
			        			   elandmall._login_msg(data.errorMsg);
			        		   } else if(data.membState == "30"){ /* 계정 잠금 */
			        			   elandmall.login_layer.fnMemLock(formObj , pin, data);
			        		   } else if(data.membState == "20"){ /* 휴먼계정*/
			        			   elandmall.login_layer.fnQuiescence(formObj , pin, data);
			        		   } else if(data.membState == "90"){ /* 무실적*/
			        			   elandmall.login_layer.fnNoneResult(formObj , pin, data);
			        		   } else if(data.membState == "40" || data.membState == "80"){  /* 부분 탈퇴 사이트 추가  */
			        			   elandmall.login_layer.fnSiteAdd(formObj , pin, data);
			        		   } else if(data.errorCode == "200"){
			        			   alert('장시간 대기로 인증키가 만료 됐습니다. 다시 로그인을 시도해 주세요.');
			        			   elandmall._login_msg('장시간 대기로 인증키가 만료 됐습니다. 다시 로그인을 시도해 주세요.');   
			        		   } else if(data.errorCode == "244"){
			        			   elandmall._login_msg('비정상적으로 로그인이 시도되어 접근을 제한합니다.');
			        		   } else {
			        			   elandmall._login_msg('회원정보 조회가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');   
			        		   }
			        	       lockLogin = false;
			        	   }
			            },
			            complete : function(data) {
			            	if($.browser.msie && $.browser.version<=9) jQuery.support.cors = false;
			            },
			            error : function(xhr, status, error) {
			            	 /*console.log("오류 :");
				        	   $.each(xhr , function(a , o){
				        		   console.log(a +">>"+o);
				        	   });*/
			            	elandmall._login_msg('회원정보 조회가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
			            	lockLogin = false;
			            	//로그인 넷퍼넬 키 반환
			    	    	try {
			    	       		NetFunnel_Complete({action_id: elandmall.global.netfunnel_login_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80" },function(){});
			    	    	}catch(e){
			    	    		console.log(e);
			    	    	}
			            }
			            
					});
		    	}
	    	} else if (typeof(lockLogin) == "undefined"){
		    	pin = $.extend({popup:false}, pin||{});
		    	
		    	//auth정보 가져오기 
		    	var auth = elandmall.oneclick.getFrontAuth();
		    	if($.type(auth) != "string"){
		    		return;
		    	}
		    	var loginPassCd = {"10":"Y", "60":"Y", "70":"Y"};
		    	var oneClickParam = {authorization:auth,
									 autoLoginYn:((formObj).find("#auto_lgn_id:checked") && ((formObj).find("#auto_lgn_id:checked").val() == "Y"))?"Y":"N"};  
				 
		    	  //20: 휴면 해제 , 40: 부분탈퇴 ,80: 사이트추가
		    	 if(pin.membState == "20" || pin.membState == "40"  || pin.membState == "80" ) {
		    		// RR: 휴면해제 처리
		    		// CO: 부분탈퇴취소 처리
		    		// AS: 사이트추가 처리
	                if(pin.membState == "20" ) {
	                	oneClickParam["txDiv"] = "RR";
	                } else  if(pin.membState == "40" ) {
	                	oneClickParam["txDiv"] = "CO";
	                } else {
	                	oneClickParam["txDiv"] = "AS";
	                }
		    		//그외  
		 	    	if(pin.accessToken) {
		 			    oneClickParam["accessToken"] = pin.accessToken;
		 			}
		 	        if(pin.emailYn) {
		 			    oneClickParam["emailYn"] = pin.emailYn;
		 			}
		 	        if(pin.smsYn) {
		 	        	oneClickParam["smsYn"] = pin.smsYn;
		 	        }
		 	       	if(pin.dmYn) {
		 	       		oneClickParam["dmYn"]  = pin.dmYn;
		 	       	}
		    	} else {
			    	 //기본로그인 
					 oneClickParam["webId"] = $(formObj).find("#login_id").val();
			    	 oneClickParam["webPwd"] = $(formObj).find("#pwd").val();
			    	 oneClickParam["g-recaptcha-response"] = pin.grecaptcharesponse;
		    	}
		         
		    	   /*console.log("원클릭 통신정보 : 상용 전 노출안되게 설정 필요 ");
		      	   $.each(oneClickParam , function(a , o){
		      		   
		      		   console.log(a +">>"+o); //상용오픈 때는 사용하면 안됨
		      	   });*/
		      	   
		    	jQuery.support.cors = true;
		    	if($.browser.msie && $.browser.version<=9) {
		           _gatewayURL_ = elandmall.util.https("/login/gateWay.action");
		    	}
		    	
		    	jQuery.ajax({
			    	type:'POST',
			    	crossDomain : true,
			    	cors:true,
	 			    url: elandmall.global.oneclick_domain_url + "/member/loginAjaxReCaptCha",
					data:oneClickParam,
					dataType : "json",
				    success : function(data) {
		        	   /*console.log("완전결과 :");
		        	   $.each(data , function(a , o){
		        		   console.log(a +">>"+o);
		        	   });*/
		        	   
		        	   data.autoLoginYn = oneClickParam.autoLoginYn;
		        	   //오류체크 한다. 
		        	   if($.type(data.accessToken) == "string" && data.resultCode == "0" 
		        		     && $.type(loginPassCd[data.membState]) == "string" && loginPassCd[data.membState] == "Y"
		        		   ){
		        		   elandmall.loginProc.fnCommonLogin(formObj , pin , data);   
		        	   } else {
			            	//로그인 넷퍼넬 키 반환
			    	    	try {
			    	       		NetFunnel_Complete({action_id: elandmall.global.netfunnel_login_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80" },function(){});
			    	    	}catch(e){
			    	    		console.log(e);
			    	    	}
		        		   
		        	       if(data.membState == "00"){
		        	    	   elandmall._login_msg('아이디/비밀번호가 일치하지 않습니다.');
		        	       }else if(data.membState == "50"){   
		        	    	   elandmall._login_msg('* 현재 고객님의 계정은 탈퇴상태 입니다. </br> 탈퇴 취소 신청은 고객센터(1833-6439)로 문의하시기 바랍니다.'); // NGCPO-7240 무실적 잠금 안내 팝업 문구의 전화번호 수정
		        	       } else if(data.errorCode == "202") {  //아이디 존재하지 않음
		        			   elandmall._login_msg('아이디/비밀번호가 일치하지 않습니다.');
		        		   } else if(data.errorCode == "203"){ //패스워드 존재하지 않음
		        			   elandmall._login_msg('아이디/비밀번호가 일치하지 않습니다.');
		        		   } else if(data.membState == "30"){ /* 계정 잠금 */
		        			   elandmall.login_layer.fnMemLock(formObj , pin, data);
		        		   } else if(data.membState == "20"){ /* 휴먼계정*/
		        			   elandmall.login_layer.fnQuiescence(formObj , pin, data);
		        		   } else if(data.membState == "90"){ /* 무실적*/
		        			   elandmall.login_layer.fnNoneResult(formObj , pin, data);
		        		   } else if(data.membState == "40" || data.membState == "80"){  /* 부분 탈퇴 사이트 추가  */
		        			   elandmall.login_layer.fnSiteAdd(formObj , pin, data);
		        		   } else if(data.errorCode == "200"){
		        			   alert('장시간 대기로 인증키가 만료 됐습니다. 다시 로그인을 시도해 주세요.');
		        			   elandmall._login_msg('장시간 대기로 인증키가 만료 됐습니다. 다시 로그인을 시도해 주세요.');   
		        		   } else if(data.errorCode == "244"){
		        			   elandmall._login_msg('비정상적으로 로그인이 시도되어 접근을 제한합니다.');
		        		   } else {
		        			   elandmall._login_msg('회원정보 조회가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');   
		        		   }
		        	   }
		            },
		            complete : function(data) {
		            	
		            },
		            error : function(xhr, status, error) {
		            	 /*console.log("오류 :");
			        	   $.each(xhr , function(a , o){
			        		   console.log(a +">>"+o);
			        	   });*/
		            	elandmall._login_msg('회원정보 조회가 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
		            	//로그인 넷퍼넬 키 반환
		    	    	try {
		    	       		NetFunnel_Complete({action_id: elandmall.global.netfunnel_login_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80" },function(){});
		    	    	}catch(e){
		    	    		console.log(e);
		    	    	}
		            }
		            
				});
	    	}
	    },
	    //통합몰로그인처리 (원클릭 처리후 해야함) 다만 원클릭 로직이 많으니 해당 부분 분리처리
	    fnCommonLogin : function(formObj, pin , oneClickResult) {
			
	    	//폼에 해당 데이타 값 담아주기 
	        $.each(oneClickResult, function(key, value) {
	        	
	        	//존재하는 key가 있다면, (패스워드오류등) 폼에 배열로 생성이 되므로 삭제후 다시 생성한다.
	        	if($(formObj).find("#"+key).size() > 0){
	        		$(formObj).find("#"+key).remove();
	        	}
	            var input = $("<input />").attr({
	                type:"hidden",
	                name: key, 
	                id:key
	            });
	            input.val(value);
	            $(formObj).append(input);
	        });

			if(location.host.indexOf('secure') > -1){
				var form = $(formObj).createForm();
				//일반
				form.submit({
					iframe: true,
					action: "https://" + location.host + "/login/loginProc.action",
					success: function(result) {

						//로그인 넷퍼넬 키 반환
						try {
							NetFunnel_Complete({action_id: elandmall.global.netfunnel_login_key,proto : elandmall.global.scheme , port : ("https" == elandmall.global.scheme )? "443" : "80" },function(){});
						}catch(e){
							console.log(e);
						}

						if(result.req_code == "F" ) {
							elandmall._login_msg(result.error_message);
						} else if(result.req_code == "S") {

							elandmall._login_app_callback(result);

							if(pin.popup &&  pin.popup == true) {
								//layer 처리
								if(elandmall._login_callback != null){
									var calback = function(){
										elandmall._login_callback({nomember:result.nomember, member:result.member})
									}
									elandmall._login_close(calback, {membState:result.membState, coupon_param:result.membState});
								} else {
									//바닥창 재 조회 해 주기
									location.href = location.href;
								};
							} else {

								if(elandmall._login_callback != null) {

									var calback = function(){
										elandmall._login_callback({nomember:result.nomember, member:result.member})
									}
									elandmall._login_close(calback, {membState:result.membState, coupon_param:result.membState});

								} else {

									//바닥로그인처리
									if ($("#resultForm").length > 0) {
										$("#resultForm").remove();
									}

									var f = $("<form name=\"resultForm\" id=\"resultForm\" />");
									f.appendTo("body");

									if (result.return_url != null) {
										if (result.return_url.indexOf("http") == 0) {
											f.attr("action", result.return_url);
										} else {
											f.attr("action", elandmall.util.newHttps(result.return_url));
										};
									} else {
										if(elandmall.global.disp_mall_no == "0000053"){
											f.attr("action", elandmall.util.newHttps("https:"+ elandmall.global.shoopen_domain_url + "/main/initMain.action"));
										} else {
											f.attr("action", elandmall.util.newHttps("/main/initMain.action"));
										}
									};
									if ($.type(result.parameters) == "string") {
										var parameters = JSON.parse(result.parameters);
										$.each(parameters, function(key, values) {
											$.each(values, function(i, value) {
												var input = $("<input />").attr({
													type:"hidden",
													name: key
												});
												input.val(value);
												$(f).append(input);
											});
										});
									};
									f.submit();
								}
							}
						}
					},
					error: function(p) {
						if(p.error_type == "kr.co.overpass.exception.UserException") {
							window.alert(p.error_message);
							return;
						}
					}
				});
			} else {
				if ($("#_LOGIN_IFRAME_").length > 0) {
					$("#_LOGIN_IFRAME_").remove();
				}

				var iframe = $("<iframe name=\"_LOGIN_IFRAME_\" id=\"_LOGIN_IFRAME_\" />");
				iframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
				iframe.appendTo(formObj);

				formObj.attr("target", "_LOGIN_IFRAME_");
				formObj.attr("action", "https://" + location.host + "/login/initLoginLayerProc.action");
				formObj.submit();
			}
		}
    };
})(jQuery);