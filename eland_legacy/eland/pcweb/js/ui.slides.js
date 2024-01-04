$(document).ready (function(){
	// [V2] : 공통 슬라이드 - 페이지 하단에 슬리이드 관련 스크립트 아래와 같이 사용
	// [V2] : slide coner
	$('.d_rolling_brd').each(function(index){
		$(this)[0].opt={};
		$(this)[0].opt={
			simulateTouch : true,
			perView : 7,
			speed : 400,
		}
		var swiperSet = new commonUI.view.slideConer($(this))
	});

	$('.box_roll_evt').each(function(index){
		$(this)[0].opt={};
		$(this)[0].opt={
			autoplay : 3000,
			speed : 300,
			mode : 'vertical',
			pagination : $(this).parent().find('.roll_indi')[0],
			paginationElement : "a" ,
			paginationClickable : true
		}
		var swiperSet = new commonUI.view.slideConer($(this))
	});

	// $('.ctgbn').each(function(index){
	// 	$(this)[0].opt={};
	// 	$(this)[0].opt={
	// 		perView : 4,
	// 		speed : 400,
	// 	}
	// 	var swiperSet = new commonUI.view.slideConer($(this))
	// });

	$('.slide_coner').each(function(){
		$(this)[0].opt={};
		if($('.omni').length>0) {
			$('.omni .slide_coner')[0].opt={
				autoplay : 3000
			}
		}	
		var swiperSet = new commonUI.view.slideConer($(this));
	});



	// [V2] : swiper in swiper
	$('.ctgLban').each(function(index){
		$(this)[0].opt={};
		$(this)[0].opt={
			pagination : $(this).parent().find('.ctgLban_pagi')[0],
			speed : 300,
		}
		var swiperSet = new commonUI.view.slideConer($(this))
	});
	$('.ctgbn').each(function(index){
		$(this)[0].opt={};
		$(this)[0].opt={
			perView : 4,
			speed : 400,
		}
		var swiperSet = new commonUI.view.slideConer($(this))
	})
})