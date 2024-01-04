
// Dim 
function dim_out() {
    $(".dimlay").remove();
    // scroll_on();
}

function dim_on(pram) {
	if($("div").hasClass("layer_detail")){
		if($('#fake_dim > .dimlay').length == 0){
			$("#fake_dim").append("<div class='dimlay'></div>");
			$('.dimlay').css('display', 'block');
		}
        // scroll_out(); 레이어 open / close function에서 처리
	}else{
		if($('body > .dimlay').length == 0){
			$("body").append("<div class='dimlay'></div>");
			$('.dimlay').css('display', 'block');
	        // scroll_out(); 레이어 open / close function에서 처리
	    }
	}
	if(typeof pram=="number"){
		$('.dimlay').css('z-index',pram);
	}
	if(pram=="white"){
		$('.dimlay').css({
			'background':'#fff',
			'opacity':'1'
		});
	}
}
//TRANSLATE X
function translateX(targetId, dist, speed) {
	$("#"+targetId).css({
		'transform': 'translateX('+dist+'%)',
		'-webkit-transform': 'translateX('+dist+'%)',
		'-moz-transform': 'translateX('+dist+'%)',
		'-o-transform': 'translateX('+dist+'%)',

		'transition': 'all ' +speed+'ms',
		'-webkit-transition': 'all ' +speed+'ms',
		'-moz-transition': 'all ' +speed+'ms',
		'-o-transition': 'all ' +speed+'ms'
	});
}
//gtTabs
function gtTabs(selector, target, start, random){
	var $this = $(selector)
	var btn = $this.find('button')
	var targetAll = $('*[id^='+target+']')
	$this.find('button:disabled').on('click', function(e){
		e.preventDefault()
		return false
	})
	if(random===true){
		var rdmTabs = Math.floor(Math.random() * btn.length);
		btn.attr('aria-selected','false').eq(rdmTabs).attr('aria-selected','true');
		targetAll.hide()
		activeTarget().show()
	}else if(start){
		btn.attr('aria-selected','false').eq(start).attr('aria-selected','true');
		targetAll.hide()
		$('#'+target+start).show()
	}else if($this.attr('data-start') !== undefined){
		var start = $this.attr('data-start')
		btn.attr('aria-selected','false').eq(start).attr('aria-selected','true');
		targetAll.hide()
		$('#'+target+start).show()
	}else{
		$('#'+target+'0').show()
	}
	btn.on('click', function(e){
		var $this = $(this)
		e.preventDefault()
		if($this.attr('aria-selected') != 'true'){
			$this.attr('aria-selected', 'true').siblings().attr('aria-selected', 'false')
			targetAll.hide()
			activeTarget().show()
		}else{
			return false
		}
	})
	function activeTarget(){return $('#'+target+$this.find("button[aria-selected='true']").index())}
}

// 이하 정리 필요 스크립트들
$(document).ready(function() {
	//공통 라운드 탭
	$('.rnd_tab.swiper-container').each(function(){
		var $this = $(this)
		var str = $this.find('.on').index()
		$(this)[0].swp = new Swiper($(this)[0],{
			slidesPerView:'auto',
			freeMode:true,
			freeModeMomentum:true,
			freeModeMomentumBounce:true,
			freeModeMomentumBounceRatio	:3,
			resistanceRatio:1,
			touchRatio: 1,
			spaceBetween: 8,
			  on: {
				init: function (swiper) {
					setTimeout(function(){
						swiper.slideTo(str, 300)
					},1000)
					$this.find('a').on('click', function(){
						swiper.slideTo($(this).parent('li:first').index(), 300)
					})
				}
			  }
		})
	})


	//큐레이션 - 기획전
	$('.plan_prds').each(function(){
		var _cotainer = $(this).find('.swiper-container')[0];
		_cotainer.swp = new Swiper(_cotainer,{
			// slidesPerView: 2.1724137931034483,
			slidesPerView:'auto',
			simulateTouch :true,
			freeMode:true,
			freeModeMomentum:true,
			freeModeMomentumBounce:true,
			freeModeMomentumBounceRatio	:1,
			resistanceRatio:1,
			spaceBetween: 10,
			nested : true,
			touchRatio: 1,
			// on :{
			// 	touchStart : function() {
			// 		$('.cate_swp')[0].swp.allowTouchMove=false;
			// 	},
			// 	touchEnd : function() {
			// 		$('.cate_swp')[0].swp.allowTouchMove=true;
			// 	}
			// }
		});
	});

	// $('.cate_swp .swiper-container').on('touchstart', function(){
	// 	$('.cate_swp')[0].swp.allowTouchMove=false;
	// });

	// $('.cate_swp .swiper-container').on('touchend', function(){
	// 	$('.cate_swp')[0].swp.allowTouchMove=true;
	// });


	// 상품 리스트 - 타입정렬 버튼
	$('.s_type button').click(function(){
		var _thisLi = $(this).parent('li');
		var _nextL;
		// 모아보기 순서변경 요청에 의한 내용변경(기존 : t3->t1, 변경  : t1->t3)
		if(_thisLi.hasClass('t1')){
			_nextLi = $('.s_type ul li.t3')
		}
		else{
			_nextLi = $(this).parent('li').next('li');
		}
		var listType =_nextLi.find('button').data('type');
		_thisLi.removeClass('on');
		_nextLi.addClass('on');
		$('.goods_list .glist').attr('class','glist').addClass(listType);
	});

	//추천 버튼
	$('button.recoms').click(function(){
		$(this).toggleClass('on');
	});

	//댓글등록
	$(".rply_regi").click(function(){
		$(this).addClass("selected");
	});

	//기획전 앵커형
	if($("div").hasClass("plan_anchor")){

		$(window).scroll(function(){
			$(".plan_name").each(function(i) {
				var idx = 0;
				if ($(window).scrollTop() > parseInt($(this).offset().top) - 95) {
					if ($(this).attr("data-isproc") === undefined || $(this).attr("data-isproc") == "false") {
						$(this).attr("data-isproc", "true")
					}
				} else {
					$(this).attr("data-isproc", "false")
				}
				for (var n = 0; n < $(".plan_name").size(); n++) {
					if ($($(".plan_name").get(n)).attr("data-isproc") == "true") {
						idx = n
					}
				}
				$(".plan_sel select option").attr("selected", false);
				$(".plan_sel select option:eq("+idx+")").attr("selected", "selected");
				$(".plan_sel label").text($(".plan_sel select option:eq("+idx+")").text());
			});
		});
	}

	$('.plan_anchor select').change(function (){
		var idx = $('.plan_sel select option').index($('.plan_sel select option:selected'));
		$("html,body").animate({scrollTop: parseInt($(".plan_name").eq(idx).offset().top) - 90}, 100);
		//슈펜 추가 : label 동기화
		$('.s_catg label').text($(this).find('option:selected').text())
	});

	// 슈펜 추가 : 레이블 클릭스 select 동기화
	$('.s_catg label').click(function(){
		$('.s_catg select').click();
	})

	//상품 상세 - 구매 정보
	$('.goods_data dt').on("click", function(){
		if($(this).find('button').hasClass('on') == false){
			$(this).find('button').addClass('on');
			$(this).next('dd').slideDown(100);
		}else{
			$(this).find('button').removeClass('on');
			$(this).next('dd').slideUp(100);
		}
		return false;
	});

});


//QnA 토글
function fnToggleQna(this_name){
  if($(this_name).parents("li").hasClass('on') == false){
		$('.qna_list').find('>ul>li').removeClass('on');
		$(this_name).parents("li").addClass('on');
	}else{
		$(this_name).parents("li").removeClass('on');
	}
}






//이하 검색

//검색 자주 쓰는 필터
function calcLine($ancor){
	var $wrapper = $('.filter[data-filter-tab='+$ancor.data('filterTab')+']');
	var $li = $wrapper.find('li').not('.more');
	var $more = $wrapper.find('.more').css('display','inline-block');
	$wrapper[0].dtcWidth = 0;
	$wrapper[0].sndWidth = 62;

	$li.not('.more').each(function(){
		var thisWidth = $(this).outerWidth()+parseInt($(this).css('margin-left'))
		$wrapper[0].dtcWidth = $wrapper[0].dtcWidth+ thisWidth;
		if($wrapper[0].dtcWidth > ($(window).width()-19)){
			$(this).addClass('second_line');
			$wrapper[0].sndWidth = $wrapper[0].sndWidth +thisWidth;

			if($wrapper[0].sndWidth > ($(window).width()-19)){
				$(this).addClass('line_out');
			}
		}
	});
	if($wrapper.find('.line_out').length==0){
		$more.hide();
	}
}


// Layer Open  - 사용처 : 상세 검색
function fn_layer_open(sId,_func) {

	if(_func) {
		_func();
	}
	$('body').addClass('popLyrOpen')//.css({ 'height': '100%', 'overflow': 'hidden' });

    name = "#"+sId;

    layer_open(name);

    if ($(name).hasClass('layer_fix')) {
		//layer_size(name);
		$('#header').css('z-index', '3');

		scrpos = $(window).scrollTop();

		// if($('#contents').length > 0) {
		// 	$('#contents').css({ 'position': 'fixed', 'z-index': '2'});
		// 	$('#contents').bind('touchmove', function (e) { e.preventDefault(); });
		// } else {
		// 	$('body').css({ 'position': 'fixed', 'z-index': '2'});
		// 	$('body').bind('touchmove', function (e) { e.preventDefault(); });
		// }
    }

    if ($(name).hasClass('layer_pop')) {
        layer_size(name);
        $('.dimlay').css('z-index', '2000');
        dim_on();
    }

	if ($(name).hasClass('layer_con')) {
        layer_size(name);
        $('.dimlay').css('z-index', '2000');
        dim_on();
    }

	if ($(name).hasClass('lg_pop')) {
        layer_size(name);
        $('.dimlay').css('z-index', '2000');
        dim_on();
    }

    if ($(name).hasClass('lyr_opc')) {
		$('#contents').bind('touchmove', function (e) { e.preventDefault(); });
		//$('#contents').css({ 'position': 'fixed', 'z-index': '2'});
		$('.dimlay').css('z-index', '2000');
		// scroll_on();
    }

	if ($(name).hasClass('nodim')) {
        layer_size(name);
        dim_out();
    }

	if ($(name).hasClass('timeout')) {
	    setTimeout(function() {
            $(name).fadeOut(200);
        }, 2000);
    }
}

function layer_size(name) {
	var note_name = name;
	var note_data = $(note_name).height();
	
	var note_h = ($(window).height() - note_data) / 2;

	if (note_h > 0) {
		$(note_name).css({ 'top': note_h + 'px'});
	} else {
		$(note_name).css({ 'top': '0' });
	}
}

 // Layer Close      
 $(function(){
	$('.layer_pop .btn_close, .layer_con .btn_close').click(function (e) {
		e.preventDefault();
	    var this_name = '#' + $(this).parent().parent().attr('id');
	    $('#contents').unbind('touchmove');
		layer_close(this_name);
	    dim_out();
	    scroll_on()
	});


    $('.layer_fix .btn_close').click(function () {
        var this_name = '#' + $(this).parent().attr('id');
    	if($(this).hasClass('multi')){
    		$("html,body").scrollTop(scrpos);		
	        layer_close(this_name);
    	}
    	else{
			$('#header').css('z-index', '');
    		if($('#contents').length > 0) {
				$('#contents').unbind('touchmove');
				$('#contents').css({ 'position': '', 'z-index': ''});//20160315
    		} else {
    			$('body').unbind('touchmove');
				$('body').css({ 'position': '', 'z-index': ''});
    		}
			$("html,body").scrollTop(scrpos);

	        layer_close(this_name);
	        scroll_on();
	    }
    });

});

// Layer Close      
function fn_layer_close(sId,_func) {//[v2_2] callback 추가
	if(_func) {
		_func();
	}
    var this_name = '#' + sId;
	$("html,body").scrollTop(scrpos);

    layer_close(this_name);
    scroll_on();
}

function layer_fix_close(n) {
	var this_name = '#'+n;

	$('#header').css('z-index', '');
	$('#contents').unbind('touchmove');

	if($(this_name).hasClass('layer_fix')){
		if($('#contents').length > 0 && !($('#bundle_detail').length > 0 && $('#bundle_detail').css('display') =='block')) {
			$('#contents').css({ 'position': '', 'z-index': ''});
		} else {
			$('body').css({ 'position': '', 'z-index': ''});
		}
		$("html,body").scrollTop(scrpos);

		translateX("lnb", -100, 250);
        $('.lnb_dim').fadeOut(300);
        // $('body').css('overflow-y', 'auto');
        // $('body').unbind('touchmove')
        if($('body').hasClass('popLyrOpen') && (!$('.goods_opt').length || $('.goods_opt').css('display') =='none')){
        	$('body').removeClass('popLyrOpen');
        	dim_out();
        }
		setTimeout(function(){$('#lnb').hide()}, 300);
	}
	layer_close(this_name);
	if(!$('.goods_opt').length || $('.goods_opt').css('display') =='none'){
	    //scroll_on();
		dim_out();
	}
}

function layer_fix_close2(n) {

	var this_name = '#'+n;
	
	$('#header').css('z-index', '');
	$('#contents').unbind('touchmove');
	if($(this_name).hasClass('layer_fix')){
		if($('body').hasClass('popLyrOpen') && (!$('.goods_opt').length || $('.goods_opt').css('display') =='none')){
			$('body').removeClass('popLyrOpen');
			dim_out();
		}
	}
	layer_close(this_name);
	if((!$('.goods_opt').length || $('.goods_opt').css('display') =='none')){
	    //scroll_on();
		dim_out();
	}
	if(n == 'reware_layer' && $('#LONGTIMEWDINFO_LAYER').length && $('.goods_opt').css('display') =='block' && $('.dimlay').css('z-index') == '2000'){
		$('.dimlay').css('z-index', '102');
	}
}


//Layer Open info
function layer_open(name) {
    $('body').unbind('touchmove');
	$(name).show();
    $(window).resize(function () {
        layer_size(name);
    });
}

// Layer Close info
function layer_close(n, _func1) {
    $(n).fadeOut(200);	
    if($('body').hasClass('popLyrOpen') && (!$('.goods_opt').length || $('.goods_opt').css('display') =='none')){
	    $('body').removeClass('popLyrOpen');
    }
    if(_func1 != undefined) {
    	_func1();
    }
}

// Layer Close      
$('.layer_fix .btn_close').click(function () {
    var this_name = '#' + $(this).parent().attr('id');
	if($(this).hasClass('multi')){
		$("html,body").scrollTop(scrpos);		
        layer_close(this_name);
	}
	else{
		$('#header').css('z-index', '');
		if($('#contents').length > 0) {
			$('#contents').unbind('touchmove');
			$('#contents').css({ 'position': '', 'z-index': ''});//20160315
		} else {
			$('body').unbind('touchmove');
			$('body').css({ 'position': '', 'z-index': ''});
		}
		$("html,body").scrollTop(scrpos);

        layer_close(this_name);
        scroll_on();
    }
});


// Scroll 
function scroll_out() {
    // $('.dimlay').bind('touchmove', function (e) { e.preventDefault(); });
    // $('body').bind('touchmove', function (e) { e.preventDefault(); });
    // $('body').css('overflow-y', 'hidden');
    $('body').addClass('popLyrOpen');
}

function scroll_on() {
    // $('.dimlay').unbind('touchmove');
    // $('body').unbind('touchmove');
    // $('body').css('overflow-y', 'auto');
    $('body').removeClass('popLyrOpen');
}


$(function(){

	// 상세검색 레이어
	$('.pop_sch_dtl').find('dl').each(function(){
	 var bx = $(this);
	 var opt = bx.find('dd');
	 bx.find('dt button, dt input').click(function(){
		 if(bx.hasClass('active')){
			 bx.removeClass('active');
			 opt.slideUp(150);
		 }else{
			 // $('.pop_sch_dtl dl').removeClass('active');
			 //  $('.pop_sch_dtl dl dd').slideUp(100);
			 bx.addClass('active');
			 opt.slideDown(150);
		 }
	 })
	})
})



//장바구니 - 정리 필요
var commonUI = commonUI || {};
commonUI.lyrCnfmO = commonUI.lyrCnfmO || {};

commonUI.lyrCnfmO = function(id){
	commonUI.dimCall2();
	$(id).show();
}
commonUI.lyrCnfmC = function(id){
	commonUI.dimRemove2();
	$(id).hide();
}

commonUI.dimCall2 = function(){
	$('<div class="blk_dim"></div>').insertAfter($('body'));
}

commonUI.dimRemove2 = function(){
	$('.blk_dim').remove();
}

//장바구니
$(function(){

	//품절,판매종료 상품
    $(document).ready(function() {
        $(".soldout .btn_open").bind("click", function(e){
            e.preventDefault();
            $(this).toggleClass("on");
            $(this).parent().parent().parent().find(".soldout_con").slideToggle(200);
        });
    });

    //찜하기 알림
    $(function(){
        $(".btn_wish").bind("click", function(e){
            e.preventDefault();

            function zzimStart(){
                $(".layer_pop.pop_zzim").show();
            }

            function zzimStop(){  
                setTimeout(function() { 
                    $(".layer_pop.pop_zzim").fadeOut(200);
                }, 2000);  
            }
			if (elandmall.global.disp_mall_no != '0000053') {
				zzimStart();
				zzimStop();
			}
        });
        $(".layer_pop.pop_zzim .btn_close").bind("click", function(){
            $(".layer_pop.pop_zzim").fadeOut(200);
        });
    });

	//타이틀 카테고리 셀렉트박스 160322
	$(function(){
		if($('#ctg_sel').length>0){
			var ctgSel = $(".cts_tit #ctg_sel option:selected").text() || $(".top_tit #ctg_sel option:selected").text();
			var opt_x = document.getElementById("ctg_sel").length;
			if(opt_x>1){
				$(".cts_tit .ctg_sel, .top_tit .ctg_sel").append("<span class='ctg_txt'>"+ctgSel+"</span>");
			}else{
				$('.ctg_sel').find('label').next('select').hide().end().remove();
				$(".cts_tit .ctg_sel, .top_tit .ctg_sel").append("<span class='ctg_txt one'>"+ctgSel+"</span>");
			}
			$(".cts_tit #ctg_sel, .top_tit #ctg_sel").change(function(){ 
				$(".cts_tit #ctg_sel option:selected, .top_tit #ctg_sel option:selected").each(function(){
					msg = $(this).text();
					$(this).parent().parent().find("span").remove();
					$(this).parent().parent().append("<span class='ctg_txt'>"+msg+"</span>");
				});  
			});
		}
	});

});

//상품상세

function ToolLyrOpen(tid, this_name) {  
	$('.tooltip').hide();
	$('.tooltip .arr').remove();
	$("#"+tid).show();
	$("#"+tid+" .tip_info").append("<span class='arr'></span>");
	$("#"+tid).find(".arr").css('left', $(this_name).offset().left);
}

function ToolLyrOpenTop(tid, this_name) {  
	$('.tooltip').hide();
	$('.tooltip .arr').remove();
	$("#"+tid).show();
	$("#"+tid+" .tip_info").append("<span class='arr'></span>");
	if($("#"+tid).width() + $(this_name).offset().left > $(window).width()){
		$("#"+tid).css({"left":'auto', "right":'6px'});
		$("#"+tid).find(".arr").css({"left":'auto', "right":'9px'});
	}
}

function ToolLyrCls() {  
	$('.tooltip').hide();
	$('.tooltip .arr').remove();
}


//GOODS ORDER
//ISCROLL
var LnbScroll;

var options = { mouseWheel: true, probeType: 1, scrollY: true, scrollX: false, scrollbars: true , fadeScrollbars: false, disablePointer: true, disableTouch: false, disableMouse: false, tap:iScrollClick(), click:iScrollClick()}
var scroll_count01 = 0;
var scroll_count02 = 0;
var scroll_count03 = 0;

var scroll_lnb_count01 = 0;
var scroll_lnb_count02 = 0;
var scroll_lnb_count03 = 0;

if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)){
// if(true){ //모든기종 iscroll;에서 제거 - 추후 스크립트 정리
	options.preventDefault = false;
}

function LnbCtgScroller() {
	LnbCtgScroll = new IScroll('#lnb_ctg', options);
};

function LnbBrdScroller() {
	LnbBrdScroll = new IScroll('#lnb_brd', options);
};

function LnbMlstScroller() {
	LnbMlstScroll = new IScroll('#lnb_mlst', options);
};

function LnbDestroy() {
	if(LnbScroll != undefined){
		LnbScroll.destroy();
		LnbScroll = null;
	}
};

function iScrollClick(){
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent)); //170427 lnb 더블터치방지 추가
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)){
      var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Chrome')+7,2);
	  if(parseFloat(s) < 44 ){
		  return false
	  }else{
		  return true
	  }
      //return (parseFloat(s) == 44 ) ? true : false
    }
}
function OrderScorller() {
    if( $('.layer_detail').length || $('.goods_wrap').length){ // 상품 상세일 경우
        options.mouseWheel = true;
        // options.disableMouse = true;
        // options.disableTouch = true;
        // options.scrollbars = true;
        if(scroll_count02 == 0) {
            if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
                if (/OS [1-8](.*) like Mac OS X/i.test(navigator.userAgent)){} 
                else{options.preventDefault = true;} //IOS9 ABOVE
                // 아이폰 일 경우 아이스크 대시 기본 스크롤 사용
                $('.gd_opt_scroll').css('overflow-y','auto');
                if($('.selected').length && $('.pSel').length){ //NGCPO-6522 럭키딜 상세페이지 내 구매하기 상품리스트 개선
                    OrderScorll = {                                                            
                        refresh : function(){},
                        scrollTo : function(){
                            $('.gd_opt_scroll').scrollTop(0,0); 
                            var scrollerOfst2 = $('.gd_opt_scroll').offset().top;
                            var defualtVOfst2 =$('.pSel').offset().top;
                            var gap2 = defualtVOfst2 - scrollerOfst2;
                            var optHeight2 = $('.options li').height(); //옵션 높이값
                            var moveRange_P2 =  gap2 - ( $('.pSel').height() - optHeight2 + 1 );                                                                            
                            $('.gd_opt_scroll').scrollTop(moveRange_P2);
                        }       
                    }              
                }else{
                    OrderScorll = {
                        refresh : function(){}
                        ,scrollTo : function(val){ //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
                            val  = val || 0;
                            $('.gd_opt_scroll').scrollTop(val);
                        }
                    }
                } 
            }else{
                OrderScorll = new IScroll('.gd_opt_scroll', options);

            }
            scroll_count02++;
        }else{ 

            if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
                if (/OS [1-8](.*) like Mac OS X/i.test(navigator.userAgent)){} 
                else{options.preventDefault = true;} //IOS9 ABOVE
                // 아이폰 일 경우 아이스크 대시 기본 스크롤 사용
                $('.gd_opt_scroll').css('overflow-y','auto');
                if($('.selected').length && $('.pSel').length){ //NGCPO-6522 럭키딜 상세페이지 내 구매하기 상품리스트 개선
                    $('.gd_opt_scroll').scrollTop(0,0); 
                    var scrollerOfst2 = $('.gd_opt_scroll').offset().top;
                    var defualtVOfst2 =$('.pSel').offset().top;
                    var gap2 = defualtVOfst2 - scrollerOfst2;
                    var optHeight2 = $('.options li').height(); //옵션 높이값
                    var moveRange_P2 =  gap2 - ( $('.pSel').height() - optHeight2 + 1 );                                                                            
                    $('.gd_opt_scroll').scrollTop(moveRange_P2);
                    OrderScorll = {                                                            
                        refresh : function(){},
                        scrollTo : function(){
                            $('.gd_opt_scroll').scrollTop(0,0); 
                            var scrollerOfst2 = $('.gd_opt_scroll').offset().top;
                            var defualtVOfst2 =$('.pSel').offset().top;
                            var gap2 = defualtVOfst2 - scrollerOfst2;
                            var optHeight2 = $('.options li').height(); //옵션 높이값
                            var moveRange_P2 =  gap2 - ( $('.pSel').height() - optHeight2 + 1 );                                                                           
                            $('.gd_opt_scroll').scrollTop(moveRange_P2);
                        }       
                    }       
                }else{
                    OrderScorll = {
                        refresh : function(){}
                        ,scrollTo : function(val){ //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
                            val  = val || 0;
                            $('.gd_opt_scroll').scrollTop(val);
                        }
                    }
                } 
            }     
            setTimeout(function(){OrderScorll.refresh()}, 100);          
        }        
    }else{ // 상품 상세가 아닐 경우
        OrderScorll = { // do noting
           refresh : function(){}
           ,scrollTo : function(){}
        }
    }
}

function setPlus(sid) {
	var value = $("#"+sid).val();
	value++;
	if(value > 9999999){return false;}
	$("#"+sid).val(value);
}

function setMinus(sid) {
	var value = $("#"+sid).val();
	value--;
	if(value < 1){return false;}
	$("#"+sid).val(value);
}

$(function(){
	
	/*개발로 이전 20160322
	$('.goods_ord').find('button.buy').on("click", function(){
		$('.goods_opt').show();		
		$('.goods_opt').animate({bottom : 0 }, 250);
		fnGoodsOpt();
		setTimeout(function(){OrderScorller()}, 100);
		$('#btn_top, #btn_back').css('z-index',0);
		if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) { //IOS8 BELOW
			if (/OS [1-8](.*) like Mac OS X/i.test(navigator.userAgent)) {scroll_out()} 
		}
		scrpos = $(window).scrollTop();	//20160414 
	});
	*/

	$('.goods_opt .gd_cls').find('button').on("click", function(){
		$('.goods_opt').animate({bottom : '-590px' }, 250);
		setTimeout(function(){$('.goods_opt').hide()}, 300);
		$('#btn_top, #btn_back').css('z-index',110);
		scroll_on(); // 기종상관 없이 모두 실행
		dim_out();
	});

	$(window).resize(function () {
		if($('.goods_opt').css('display') == "block"){
			fnGoodsOptRefresh();
		}
	});

	if($('.lyr_select').hasClass('lyr_select')){// 레이어 스타일의 상품 옵션 셀렉트 박스가 존재할 경우에만 실행
		$('.sel_txt').each(function(){ // 셀렉트 박스의 기본 메시지를 data-org-msg 사용자 태그에 저장
			$(this).attr('data-org-msg',$(this).text());
		});
		$('.lyr_select .sel_btn').click(function(){ // 셀렉트 박스 클릭 시, 상품 옵션 선택 레이어 토글
			 if(!$(this).parent().hasClass('disabled')){
			 	var  optLyr =  $(this).parent('.lyr_select');
			 	var $this = $(this);
				if ($(this).parent().hasClass('on')){ // 옵션 레이어 열린 상태를 닫기
					$(this).parent().removeClass('on');
					toggleBt('show', $this);
					tglBt($this, 'show'); //NGCPO-5887 : 다른 옵션 가리기
					scrollReest($(this)); //NGCPO-5887 : 스크롤 ( 포커스 ) 이동
				}
				else{ // 옵션 레이어 닫힌 상태를 열기
					$(this).parent().addClass('on');
					toggleBt('hide', $this);
					lyrMax($(this),optLyr);
					tglBt($this, 'hide'); //NGCPO-5887 : 다른 옵션 가리기
					scrollReest($(this));
				}
				showText($(this));
			}
		});
		$('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
			var $this = $(this);
			var $li = $this.parent();
			var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
			if(!$li.hasClass('sld_out')){
				$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
				$('.lyr_select').removeClass('on');
				$li.addClass('selected').siblings('li').removeClass('selected');
				showText($selBtn);			
				tglAc($this, 'show'); //NGCPO-5887 : 다른 옵션 가리기
				toggleBt('show');
				scrollReest($(this)); //NGCPO-5887 : 스크롤 ( 포커스 ) 이동
				// //마이페이지 스크롤업 - 임시
				// tempUp($(this));
			}
		});
		$(window).resize(function() {
			if($('.goods_opt').css('display')=='block'){ // 상품상세 하단 옵션 레이어가 열려있는 경우
				lyrMax();
				OrderScorller();
			}
			else if($('.goods_opt').css('display')=='none') {// 상품상세 하단 옵션 레이어가 닫혀있는 경우
				$('.goods_opt').css({'display':'block','visibility':'hidden'})
				lyrMax();
				OrderScorller();
				$('.goods_opt').removeAttr('style');
			}
		});
	}
});

function showText($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
	if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
		$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
	}
	else{
		$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'));
	}
}

function selComp(){
	$('.sel_txt').not($('.noreset .sel_txt')).each(function(){
		$(this).html($(this).attr('data-org-msg')).removeAttr('data-sel-msg');
	});
	$('.sel_btn').not($('.noreset .sel_btn')).removeClass('selected');
	$('.options li').not($('.noreset .options li')).removeClass('selected');
}

function lyrMax(){ // 레이어 크기 조절
	if($('.lyr_select.on').hasClass('on')){//셀렉트 박스가 열려있을 경우에만 실행
		var $optLyr = $('.lyr_select.on .lyr_options');
		$optLyr.css({
			display:'block',
			visibility:'hidden'
		});
		var maxHeight =$('.lyr_select.on').outerHeight() +30;
		$optLyr.removeAttr('style');
		$('.gd_opt_scroll').css({
			'max-height':'60vh',
			'height':maxHeight
		})
		$('.gd_opt').css('height',maxHeight);
	}
}

function toggleBt(action){
	var $hidden = $('.goods_opt .gd_amt, .goods_opt .gd_btns, .goods_opt .g_lst');
	action == 'show' ?  $hidden.show() : $hidden.hide();
}
function scrollReest($target){ // 옵션 레이어가 열릴 경우 스크롤 재정의
	//재설정
	fnGoodsOpt();
	OrderScorller($target);
	//스크롤 상단으로

	if($target){ //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
		flagHD = 0;
		if($target.parent().hasClass('hasDefault') && $target.parent('.hasDefault').find('.dVal').length > 0)  { //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤
			var $li = $target.parent().parent();
			goToDft($li);
			flagHD =1;
		}else if($target.parent().hasClass('hasDefault') && $target.parent('.hasDefault').find('.pSel').length > 0 )  { //NGCPO-6522 기획전 선택된 옵션 스크롤 맨위로
			var $li = $target.parent().parent();
			goToSelect($li);
			flagHD =1;
		}else{
			if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(0)} // iOS
			else{OrderScorll.scrollTo(0,0)} // iOS 아님
		}

		//NGCPO-5887 : 스크롤 ( 포커스 ) 이동
		if($target.hasClass('sel_btn') && flagHD==0){
			//옵션을 선택하지 않고 sel_btn으로 닫을 경우 스크롤
			if(!$target.parent().hasClass('on')){
				$pDL = $target.parent().parent().parent('dl');
				calcPst($pDL);
			}
		}
		if($target.hasClass('ancor')){
			//옵션을 선택했을 경우 스크롤
			$pDL = $target.parent().parent().parent().parent().parent().parent('dl');
			calcPst($pDL);
		}
	}
	else{
		if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(0)} // iOS
		else{OrderScorll.scrollTo(0,0)} // iOS 아님
	}
}

calcPst = function($target){ // $target = dl
	$pDL = $target;
	$preGopt = $pDL.parent('.g_opt')[0] || $pDL.parent('.dl_scroll')[0];
	$pGopt = $($preGopt);
	$compare = $($pGopt).find("dl") ;
	$preScroller = $pGopt.parent().parent('.gd_opt_scroll')[0] || $target.parent('.dl_scroll')[0];
	$scroller = $($preScroller);
	index = $($compare).index($pDL)+1;
	if(index!==1){
		//첫번째 세트가 아니거나 세트 상품이 아닐 경우
		var $nowSee;
		var moveRange;
		if($pGopt.hasClass('dl_scroll')){//dl_scroll - 장바구니 케이스
			 $nowSee = $pGopt.find('p.set:nth-child('+ (index*2-1) +')');
			if($nowSee && $scroller.offset() != undefined){
				$scroller.scrollTop(0)
				scrollerOfst = $scroller.offset().top;
				targetOpst = $nowSee.offset().top;
				moveRange = targetOpst - scrollerOfst;
				$scroller.scrollTop(moveRange)
			}
			else{
				console.log('unexpected case.');
			}
		}
		else{//장바구니 외의 케이스
			 $nowSee = $pGopt.find('div.set:nth-child('+ (index*2-1) +')');
			if($nowSee && $scroller.offset() != undefined){
				// 정확한 좌표 측정을 위해 스크롤을 상단으로 초기화
				if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(0)} // iOS
				else{OrderScorll.scrollTo(0,0)} // iOS 아님
				scrollerOfst = $scroller.offset().top;
				targetOpst = $nowSee.offset().top;
				moveRange = targetOpst - scrollerOfst;
				if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(moveRange)} // iOS
				else{OrderScorll.scrollTo(0,-moveRange)} // iOS 아님
			}
			else{
				console.log('unexpected case.');
			}
		}
	}
	else if(index==1 && $pGopt.hasClass('dl_scroll')){ // 장바구니 첫번째 & 세트 상품이 아닌 케이스 - 상단으로 밀어주기
		$scroller.scrollTop(0);
	}
}

function fnGoodsOpt(){
	if($('.lyr_select.on').hasClass('on')){
		// no - action
	}
	else{
		var p_h = ($(window).height()/2) - 50;
		$('.gd_opt_scroll').css('height', 'auto');
		$('.gd_opt_scroll').css('max-height', p_h + "px");
		$('.gd_opt').css('height','auto');
	}
	// if(($('.goods_opt').css('display')) == 'block'){
	// 	dim_on(102);
	// }
}
function fnGoodsOptRefresh(){
    fnGoodsOpt();
	setTimeout(function(){OrderScorller()}, 100);
}

//NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
goToDft = function($li){ //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤
	var $scroller = $li.parent().parent().parent().parent('.gd_opt_scroll');
	// 정확한 좌표 측정을 위해 스크롤을 상단으로 초기화
	if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(0)} // iOS
	else{OrderScorll.scrollTo(0,0)} // iOS 아님
	var scrollerOfst = $scroller.offset().top;
	var defualtVOfst =$scroller.find('.dVal').offset().top;
	var gap = defualtVOfst - scrollerOfst;
	var moveRange =  gap - ( $scroller.height() - $scroller.find('.dVal').height() )/2;
	if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(moveRange)} // iOS
	else{OrderScorll.scrollTo(0,-moveRange)} // iOS 아님
}

//NGCPO-6522 럭키딜 상세페이지 내 구매하기 상품리스트 개선
goToSelect = function($li){
	if($('li').hasClass('selected') && $("span").hasClass("pSel")){
		var $scroller = $li.parent().parent().parent().parent('.gd_opt_scroll');
		// 정확한 좌표 측정을 위해 스크롤을 상단으로 초기화
		if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(0)} // iOS
		else{OrderScorll.scrollTo(0,0)} // iOS 아님
		var scrollerOfst = $scroller.offset().top;
		var defualtVOfst =$scroller.find('.pSel').offset().top;
		var gap = defualtVOfst - scrollerOfst;
		var optHeight = $li.find('.options li').height(); //옵션 높이값
		var moveRange_P =  ( $scroller.find('.pSel').height() - optHeight + 1 ) - gap; 
		if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) { // iOS
			OrderScorll.scrollTo(moveRange_P)
		}else{ // iOS 아님
			OrderScorll.scrollTo(0,moveRange_P)
		} 
	}else{
		if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {OrderScorll.scrollTo(0)} // iOS
		else{OrderScorll.scrollTo(0,0)} // iOS 아님
	}
}

// To hide other options.
tglBt = function(target, act){ // 활성화 된 옵션을 제외하고 토글
	var $hideTg = [];
	var $target = target;
	$hideTg[0] =$target.parent().parent().siblings('dd:not("#dd_receive_choice")');
	$hideTg[1] =$target.parent().parent().parent().siblings('dl, .set');

	act =="show" ? $($hideTg).each(function(){$(this).show()}) : $($hideTg).each(function(){$(this).hide()});
}

tglAc = function(target, act){ // 활성화 된 옵션을 제외하고 토글
	var $hideTg = [];
	var $target = target;
	$hideTg[0] = $target.parent().parent().parent().parent().parent().siblings('dd:not("#dd_receive_choice")');
	$hideTg[1] = $target.parent().parent().parent().parent().parent().parent().siblings('dl, .set');

	act =="show" ? $($hideTg).each(function(){$(this).show()}) : $($hideTg).each(function(){$(this).hide()});
}

function sm_square_lineup(slector){
	$(slector).each(function(){
		var li_w = $(this).width();
		var li_h = $(this).height();
		var img = $(this).find('img');
		img.load(function(){
			var img_rto = img.height()/img.width();
			if(1 < img_rto){
				img.css({'width':'100%','height':'auto'})
				img.css({'top':'-'+ (img.height()-li_h)/2 + 'px'})
			}
			if(1 > img_rto){
				img.css({'width':'auto','height':'100%'})
				img.css({'left':'-'+ (img.width()-li_w)/2 + 'px'})
			}
			if(img_rto == 1){
				img.css({'width':+li_w+'px','height':+li_h+'px'})
			}
		});
	})
}

function limitText(textid, limit, limitid){ 
	var text = $('#'+textid).val(); // 이벤트가 일어난 컨트롤의 value 값 
	var textlength = text.length; // 전체길이 
 
	// 변수초기화 
	var i = 0;				// for문에 사용 
	var li_byte = 0;		// 한글일경우는 2 그밗에는 1을 더함 
	var li_len = 0;			// substring하기 위해서 사용 
	var ls_one_char = "";	// 한글자씩 검사한다 
	var text2 = "";			// 글자수를 초과하면 제한할수 글자전까지만 보여준다. 
 
	for(i=0; i< textlength; i++) 
	{ 
		// 한글자추출 
		ls_one_char = text.charAt(i); 
	
		// 한글이면 2를 더한다. 
		if (escape(ls_one_char).length > 4) { li_byte += 2;}
		else{li_byte++; } // 그밗의 경우는 1을 더한다. 
		
		// 전체 크기가 limit를 넘지않으면 
		if(li_byte <= limit){li_len = i + 1;} 
	} 
	
	$('#'+limitid).text(parseInt(li_byte/2));
	
	// 전체길이를 초과하면 
	if(li_byte > limit){ 
		alert("글자를 초과 입력할수 없습니다. 초과된 내용은 자동으로 삭제 됩니다."); 
		text2 = text.substr(0, li_len); 
		$('#'+textid).val(text2);
		$('#'+limitid).val(parseInt(limit/2));
	} 
	$('#'+textid).focus(); 
}

//TAB CLASS
function fnTab(tabSize, tabId, idx, targetId,_func) {
    for ( var i = 0; i < tabSize; i++ ) {
        if ( i == idx ) {
            $("#"+tabId+i)[0].className = $("#"+tabId+i)[0].className.replace("off", "on");
            if ( $("#"+targetId+i) ) { 	
				$("#"+targetId+i).show(); 
				if($(".goods_tab").css("position") == "fixed" && tabId == "gtab"){$("html,body").animate({scrollTop: $("#"+targetId+i).offset().top - 86}, 0)}
			}
        }else{
            $("#"+tabId+i)[0].className = $("#"+tabId+i)[0].className.replace("on", "off");
            if ( $("#"+targetId+i) ) { $("#"+targetId+i).hide(); }
        }
    }
	
    if(typeof addImpression == 'function') {
    	addImpression($("#"+targetId+idx)); 	
    }

    if(_func) {
    	_func();
    }
}


//top btn action
$(function(){
	//nav 없는 페이지
	if($('nav').length == 0 || $('nav').css('display') == 'none' ){
		$("#btn_top, #btn_back").css('bottom', '16px');
	}

	//상품상세 케이스
	if($(".goods_ord").length){
		$("#btn_top, #btn_back").css('bottom', '70px');
	}

	//하단 총구매 - 결제하기 있을 경우 
	if($("div").hasClass("basketwrap")){       
		$("#btn_top, #btn_back").css('bottom', '160px');
		$("#footer").css('paddingBottom', '195px')
	}                                     
	$("#btn_top a").on("click", function(){
		$("html,body").animate({scrollTop: 0}, 300);
		return false;
	});
});


function mainSchLyr(){//상세 검색레이어 , 메인 스와이프 GNB 호출 이후  init
	$('.pop_sch_dtl').find('dl').each(function(){
		var bx = $(this);
		var opt = bx.find('dd');
		bx.find('dt button, dt input').click(function(){
			if(bx.hasClass('active')){
				 bx.removeClass('active');
				 opt.slideUp(150);
			}else{
				// $('.pop_sch_dtl dl').removeClass('active');
				//  $('.pop_sch_dtl dl dd').slideUp(100);
				bx.addClass('active');
				opt.slideDown(150);
			}
		})
	});
	$('dd .tg_btns .open_btn').click(function(){
		$(this).parent().parent('dd.tg_hgt').siblings('dt').find('button').focus();
		$(this).parent().parent('dd.tg_hgt').addClass('open');
	});
	$('dd .tg_btns .close_btn').click(function(){
		$(this).parent().parent('dd.tg_hgt').siblings('dt').find('button').focus();
		$(this).parent().parent('dd.tg_hgt').focus().removeClass('open');
	});
	$('#set_list input').click(function(){
		$("#goods_list ul").not(".pr_cont ul").attr("class","");
		$("#goods_list ul").not(".pr_cont ul").addClass($(this).attr("data-type"));
	});
}