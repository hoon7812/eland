/**
 * overpass.common.js 파일은 모든 js 파일중 제일 먼저 load 되어야 한다.
 */
;(function($) {
	//[START] 네이스페이스 생성
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	//[END] 네이스페이스 생성
	
	//[START] 기본 console 생성(미지원 브라우저용)
	if (typeof console != "object") {
		window.console = {
			log: function() {},
			dir: function() {} 
		};
	} else {
		if (!console.log) {
			console.log = function() {};
		};
		if (!console.dir) {
			console.dir = function() {};
		};
	};
	//[END] 기본 console 생성
	
	//[START] prototype 셋팅
	String.prototype.string = function(len) {
		var s = '', i = 0; 
		while (i++ < len) { 
			s += this; 
		}; 
		return s;
	};
	String.prototype.zf = function(len) {
		return "0".string(len - this.length) + this;
	};
	String.prototype.replaceAll = function(from, to) {
	    return this.replace(new RegExp(from, "g"), to);
	};
	Number.prototype.zf = function(len) {
		return this.toString().zf(len);
	};
	Date.prototype.format = function(f) {    
		if (!this.valueOf()) {
			return " ";     
		};
		var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];    
		var d = this;         
		return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p|mils)/gi, function($1) {        
			switch ($1) {            
				case "yyyy": 
					return d.getFullYear();            
				case "yy": 
					return (d.getFullYear() % 1000).zf(2);            
				case "MM": 
					return (d.getMonth() + 1).zf(2);            
				case "dd": 
					return d.getDate().zf(2);            
				case "E": 
					return weekName[d.getDay()];            
				case "HH": 
					return d.getHours().zf(2);            
				case "hh": 
					return ((h = d.getHours() % 12) ? h : 12).zf(2);            
				case "mm": 
					return d.getMinutes().zf(2);            
				case "ss": 
					return d.getSeconds().zf(2);
				case "mils": 
					return d.getMilliseconds().zf(3);            
				case "a/p": 
					return d.getHours() < 12 ? "오전" : "오후";     
				default: 
					return $1;        
			}    
		});
	};	
	//[END] prototype 셋팅
	
	//[START] ajax 셋팅
	$.ajaxSettings.cache = false;
	$.ajaxSettings.traditional = true;
	
	var _ajaxSetup = $.ajaxSetup;
	$.ajaxSetup = function(target, settings) {
		if ($.type(settings.error) == "function") {	//error 콜백에 대해서 공통 처리 할 수 있도록...
			settings.user_error = settings.error; 
			delete settings.error;
		};
		if (settings.cors !== true) {
			if (!settings.headers) {
				settings.headers = { "AJAX_YN": "Y" };
			} else {
				settings.headers["AJAX_YN"] = "Y";
			};			
		};
		if ($.type(settings.type) == "string" && settings.type.toUpperCase() == "POST" && ( !settings.data || settings.data == "" )) {	//ajax POST로 호출시 data가 없으면 서버쪽에서 403 오류가 발생할 수도 있음
			settings.data = $.now();
		} else if ($.type(settings.data) == "object" && $.param(settings.data) == "") {	//object형식으로 빈값이 올때
			settings.data = { "_": $.now() };
		};
		return _ajaxSetup(target, settings);
	};
	
	$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {		//controller 오류시(500) 오류에 대한 메세지 일괄 처리
		var response = { error_message: "요청을 처리할 수 없습니다" };
		var response_503 = { error_message: "사용자가 많아 접속이 지연되고 있습니다. 다시 시도해주세요." };
		if (jqXHR.responseText != "") {	//서버로 부터 아무런 응답도 못 받았을 경우 처리하지 않는다(뒤로 가기 처리시 load호출 등등...)
			try {
				response = $.parseJSON(jqXHR.responseText);	
			} catch (e) {
				// error code 가 있는 dataType : xml
				try{
					var xmlDoc =  $.parseXML(jqXHR.responseText);
					if($(xmlDoc).find('Error').text() != "" && $(xmlDoc).find('Code').text() != ""){
						response = { error_message: $(xmlDoc).find('Code').text() };
					}
				}catch(e){}
			};
			
			if ($.type(ajaxSettings.user_error) == "function") {
				if(jqXHR.status != "" && jqXHR.status == 503){
					ajaxSettings.user_error(response_503);
				}else{
					ajaxSettings.user_error(response);
				}
			} else {
				if(jqXHR.status != "" && jqXHR.status == 503){
					alert(response_503.error_message);
				}else{
					alert(response.error_message);
				}
			};			
		};
	});
	//[END] ajax 셋팅
	// [START] form	
	var formCheck = function(f) {
		//유효성 검사(input 태그내 validate와 message 셋팅시...)
		$(":input", f).each(function() {
			if (this.type != "submit" && this.type != "button") {
				var input = this;
				if ($.type($(this).attr("validate")) == "string") {
					var message = $.type($(this).attr("message")) == "string" ? $(this).attr("message") : null ;
					var validate = $(this).attr("validate");
					if ($.trim(validate) != "") {
						switch (validate.toLowerCase()) {
							case "number":
								if (message == null || $.trim(message) == "") {
									message = "숫자형으로 입력하세요";
								};
								if (!$.isNumeric(input.value)) {
									input.focus();
									throw message;
								};
								break;
							case "empty":
								if (message == null || $.trim(message) == "") {
									message = "값을 입력하세요";
								};
								if ($.trim(input.value) == "") {
									input.focus();
									throw message;
								};
								break;
							default:
								break;
						};
					};
				};
			};
		});
	};
	window._submitted = null;
	$.fn.createForm = function() {
		var form = this[0];
		form.isRunning = false;
		return {
			submit: function(p) {
				p = $.extend({ target:"_self", iframe: false, valid: null, confirm: null }, p || {});
				if (form.isRunning === true) {
					return false;
				} else {
					form.isRunning = true;
				};
				try {
					var action = p.action || form.action;
					var target = p.target || form.target ;
					if (!action) {
						throw "action이 지정되어 있지 않습니다.";
					};
					form.action = action;
					form.target = target;
					formCheck(form);
					if ($.type(p.valid) == "function") {		//사용자 정의한 유효성 검사
						if (!p.valid()) {
							throw null;
						};
					};
					if ($.type(p.confirm) == "function") {		//사용자가 정의한 confirm 실행 
						if (!p.confirm()) {
							throw null;
						};
					};
					if (p.iframe) {
						var iframe = null;
						if ($("#_FORM_SUBMIT_TARGET").length == 0) {
							iframe = $("<iframe name=\"_FORM_SUBMIT_TARGET\" id=\"_FORM_SUBMIT_TARGET\" />");
							iframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
							iframe.appendTo('body');
						} else {
							iframe = $("#_FORM_SUBMIT_TARGET")[0];
						};
						form.target = "_FORM_SUBMIT_TARGET";
						if ($("#_IFRAME", form).length == 0) {
							var hidden = $("<input />").attr("type", "hidden").attr("name", "_IFRAME").attr("id", "_IFRAME").val("Y");
							hidden.appendTo(form);
						};
					} else {
						$("#_IFRAME", form).remove();
					};
					
					if ($.type(p.success) == "function") {	//success 콜백
						form.success = function(result) {
							p.success(result);
						};
					} else {
						form.success = null;
					};

					if ($.type(p.error) == "function") {	//error 콜백
						form.error = function(result) {
							form.isRunning = false;
							p.error(result);
						};
					} else {
						form.error = null;
					};
					window._submitted = form;
					form.submit();
				} catch (e) {
					if ($.type(e) == "string") {
						alert(e);
					} else if (e == null) {
						//do nothing...
					} else {
						alert(e + "[0]");
					};
					form.isRunning = false;
				};				
			},
			reset: function() {
				form.reset();
				$("input[type=hidden]", form).each(function(idx, hidden) {
					var def = $(hidden).attr("default");	//최초값이 존재한다면...
					hidden.value = $.type(def) == "string" ?  def : "" ;
				});
			},
			check: function() {
				try {
					formCheck(form);
					return true;
				} catch (e) {
					if ($.type(e) == "string") {
						alert(e);
					} else if (e == null) {
						//do nothing...
					} else {
						alert(e + "[0]");
					};
					return false;
				}
			},
			run: function(b) {
				form.isRunning = b;
			}
		};
	};
	// [END] form
	
	// [END] paging
	$.fn.createAnchor = function(pin) {
		var $div = this;
		var ahref = null;
		
		pin = $.extend(false, {
			name: "page_idx",
			start_img: elandmall.global.image_path + "/images/pcweb/common/btn_paging_first.gif",
			prev_img: elandmall.global.image_path + "/images/pcweb/common/btn_paging_prev.gif",
			next_img: elandmall.global.image_path + "/images/pcweb/common/btn_paging_next.gif",
			end_img: elandmall.global.image_path + "/images/pcweb/common/btn_paging_end.gif",
			fn: function(page, parameters) {
				var url = pin.url + "?" + pin.name + "=" + $(ahref).attr("value");
				if (parameters != "") {
					url += "&" + parameters;
				}
				window.location.href = url;
			}
		}, pin||{});
		
		$("a[current=false]", $div).addClass("num");
		$("a[current=true]", $div).addClass("select_num");
		$("img[name=start]", $div).attr({ src: pin.start_img });
		$("img[name=prev]", $div).attr({ src: pin.prev_img });
		$("img[name=next]", $div).attr({ src: pin.next_img });
		$("img[name=end]", $div).attr({ src: pin.end_img });
		
		$("a", $div).click(function(e) {
			ahref = this;
			if ($(ahref).attr("current") == "false" || $(ahref).attr("current") == "") {
				var parameters = $(ahref).attr("parameters");
				pin.fn($(ahref).attr("value"), parameters);				
			};
		});
	};
	// [END] paging
	
	// [START] extend function
	$.fn.exists = function () {
	    return this.length !== 0;
	}
	// [END] extend function
})(jQuery);

var ElandmallEventListener = window.ElandmallEventListener = {

	fnAddOnloadListener : function(listener) {
		window.attachEvent ? window.attachEvent('onload', listener) : window.addEventListener('load', listener, false);
	}
}

var ElandmallEventMyShopListener = window.ElandmallEventMyShopListener = {

		fnAddOnloadMyShopListener : function(listener) {
			/* 
				안드로이드의 WebView에서는 페이지 로딩이 완료되면 onLoad Event가 소멸이 되어 호출을 할 수 없다.
				따라서 아래의 편법으로 처리해줘야한다.
				안드로이드의 Chrome, Web Brower 등에서는 정상적으로 작동한다.
			 */
			/* 채널이 APP 이고, APP 종류가 Android 인 경우만 실행한다. */
			if( elandmall.global.chnl_cd == '40' && $.type(elandmall.global.app_version) != "undefined" && elandmall.global.app_cd == "Android" ) {
				var ready = function ( fn ) {
				    // Function 호출여부 체크
				    if ( typeof fn !== 'function' ) return;
		
				    // 로딩이 완료되었다면 Function 실행
				    if ( document.readyState === 'complete'  ) {
				        return fn();
				    }
		
				    // 로딩이 완료되지 않았다면 대기
				    document.addEventListener( 'DOMContentLoaded', fn, false );
				};
		
				ready(function() {  // 로딩이 완료된 이후 실행
					listener();
				});
			} else {
				window.attachEvent ? window.attachEvent('onload', listener) : window.addEventListener('load', listener, false);
			}
		}
	}

	/* 문자열 아스키코드 변환,숫자는 문자열로 치환후 변환 */
	var fnCharToAscii = function(p){
		var r = "";
		if(typeof(p) == "undefined" || p == null || p == "") {
			return r;
	 	}
	
		if(typeof(p) == "number") {
			p = p.toString();
	 	}
		
		if(typeof(p) != "string") {
			return r;
	 	}
		
		for(var i=0; i < p.length; i++) {
		   r += p.charCodeAt(i);
		}
		return r; 
	}
