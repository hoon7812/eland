/**
 * util/validate관련 js 함수 모음
 */
;(function($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	if ($.type(window.elandmall.util) != "object") {	//util 관련 js 함수
		window.elandmall.util = {};		
	};
	if ($.type(window.elandmall.validate) != "object") {	//유효성 관련 js 함수
		window.elandmall.validate = {};
	};	
})(jQuery);