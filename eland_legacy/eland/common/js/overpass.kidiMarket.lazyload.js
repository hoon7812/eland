(function ($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	elandmall.lazyload =  function () {
		
		$("body").find(".lazyload").lazy({
			removeAttribute: false
		    ,effect: "fadeIn"
		    ,effectTime: 200
		    ,threshold: 1000
			,beforeLoad: function(element) {  //이미지 로드전
		    },
		    afterLoad: function(element) {  //이미지 로드후
		    	//console.log($(element).attr("src"));
		    },
		    onError: function(element) {  //이미지 에러발생시
		    	// console.log("error");
		    	// console.log($(element).attr("src"));
		    	var imageSrc = element.data('src');
                console.log('image "' + imageSrc + '" could not be loaded');
		    },
		    onFinishedAll: function() {  //이미지 전체 로드후
		    }
		});
	};

}(jQuery));