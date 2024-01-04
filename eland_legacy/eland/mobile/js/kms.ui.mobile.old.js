// 수정 시, app.js에도 반영.


var commonUI = commonUI || {};
commonUI.loadJs = commonUI.loadJs || {}; // Load JS
commonUI.wishToggle = commonUI.wishToggle || {};  // wish list btn  toggle
commonUI.wishTogDev = commonUI.wishTogDev || {};  // wish list btn  toggle
commonUI.dimCall = commonUI.dimCall || {};
commonUI.dimRemove = commonUI.dimRemove || {};
commonUI.dimCall2 = commonUI.dimCall2 || {};
commonUI.dimRemove2 = commonUI.dimRemove2 || {};
commonUI.lyrCnfm = commonUI.lyrCnfm || {}; // 레이어 타입 confirm;
commonUI.lyrCnfmC = commonUI.lyrCnfmC || {} // 레이어 타입 confirm 닫기;
commonUI.contTest = commonUI.contTest || function(){};
commonUI.getStatSc = commonUI.getStatSc || function(){}; // 좌우 슬라이드 프로그레스바
commonUI.fontLux = commonUI.fontLux || function(){}; // 럭셔리 갤러 폰트 load to LocalStrorage
commonUI.fixtop = commonUI.fixtop || function(){};
commonUI.fixtop.reset = commonUI.fixtop.reset || function(){};
commonUI.favSch = commonUI.favSch || function(){}; //단골 매장 검색 관련
commonUI.resultConH = commonUI.resultConH || {}; //주소검색결과 관련

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

//GOODS ZOOM
function GoodsZoom() {
	if(scroll_count03 == 0) {
		Goods_Zoom = new IScroll('#goods_content', {zoom: true, scrollX: true, scrollY: true, mouseWheel: true, wheelAction: 'zoom', disablePointer: true, disableTouch: false, disableMouse: false});
		scroll_count03++;
	}else{
		setTimeout(function(){Goods_Zoom.refresh()}, 100);
	}
}
$(function(){
	$('#goods_zoom').on("click", function(){
		$('body').css({'overflow': 'hidden' });
		$('#goods_detail').fadeIn(300);
		GoodsZoom();
		scroll_out();
		$('html, body').scrollTop(0);
	});

	$('.layer_zoom .btn_close').on("click", function(){
		$('body').css('overflow-y', 'auto');
		$('#goods_detail').fadeOut(300);
		scroll_on()
    });

	$(window).on('orientationchange', function(){ //20160314
		if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
			if(scroll_count03) {
				$('body').css('overflow-y', 'auto');
				$('#goods_detail').fadeOut(300);
				scroll_on();	
			}
		}
	});

});

//GOODS ORDER
function OrderScorller() {
    if( $('.layer_detail').length || $('.goods_opt').length){ // 상품 상세일 경우
        //options.mouseWheel = true;
        // options.disableMouse = true;
        // options.disableTouch = true;
        // options.scrollbars = true;
        if(scroll_count02 == 0) {
            if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
                if (/OS [1-8](.*) like Mac OS X/i.test(navigator.userAgent)){} 
                else{options.preventDefault = true;} //IOS9 ABOVE
                // 아이폰 일 경우 아이스크 대시 기본 스크롤 사용
                $('.gd_opt_scroll').addClass('ios')
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
                $('.gd_opt_scroll').addClass('ios')
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

	$('.goods_opt .gd_cls button').on("click", function(){
		closeGdsOpt()
	});
	$('body').on('click touchstart', function(e){
		if($('#lyrBg_dim_ordBtm').is(e.target) ){ 
			closeGdsOpt()
		}
	})	
	function closeGdsOpt(){
		$('.goods_opt').animate({bottom : '-590px' }, 250);
		setTimeout(function(){$('.goods_opt').hide()}, 300);
		$('.btn_top, btn_arm').css('z-index',21);
		$('#lyrBg_dim_ordBtm').stop().fadeOut(300, '', function() {
			$(this).remove()
		})
		scroll_on();
	}

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

//GOODS INFO
function fnToggleRv(this_name){
   if($(this_name).parent().hasClass('on') == false){
		$('.rv_list').find('>ul>li').removeClass('on');
		$(this_name).parent().addClass('on');
	}else{
		$(this_name).parent().removeClass('on');
	}
}

function fnToggleQna(this_name){
  if($(this_name).parents("li").hasClass('on') == false){
		$('.qna_list').find('>ul>li').removeClass('on');
		$(this_name).parents("li").addClass('on');
	}else{
		$(this_name).parents("li").removeClass('on');
	}
}
// FIXED SCROLL
$(function(){
	if($("div").hasClass("plan_sel")){
		fn_subFixed('.plan_sel_wrap','.plan_sel_wrap > div')
		//$('.plan_sel').scrollToFixed({marginTop: 44, top: $('.plnevt_wrap').offset().top, zindex:4});
		//if( $(".plan_sel").next().text() == "" ) {
		//	$(".plan_sel").next().hide();
		//}
	}
	if($("div").hasClass("goods_tab")){
		$('.goods_tab').scrollToFixed({marginTop: 52, top: $('.goods_img').offset().top, zindex:4});
		if( $(".goods_tab").next().text() == "" ) {
			$(".goods_tab").next().hide();
		}
	}
});
// TAB CLASS
function fnTab(tabSize, tabId, idx, targetId,_func) {
    for ( var i = 0; i < tabSize; i++ ) {
        if ( i == idx ) {
            $("#"+tabId+i)[0].className = $("#"+tabId+i)[0].className.replace("off", "on");
            if ( $("#"+targetId+i) ) { 	
				$("#"+targetId+i).show(); 
				if($(".goods_tab").css("position") == "fixed" && tabId == "gtab"){$("html,body").animate({scrollTop: $("#"+targetId+i).offset().top - 96}, 0)}
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

function fnToggleSlide(tabId, targetId){
	if($("#"+tabId).hasClass('on')){
		$("#"+tabId).removeClass('on');	
		$("#"+targetId).slideUp(200);
    }else{
		$("#"+tabId).addClass('on');
		$("#"+targetId).slideDown(200);
    }
}

//TOOL LAYER
function ToolLyrOpen(tid, this_name) {  
	$('.tooltip').hide();
	$('.tooltip .arr').remove();
	$("#"+tid).show();
	$("#"+tid+" .tip_info").append("<span class='arr'></span>");
	$("#"+tid).find(".arr").css('left', $(this_name).offset().left-5);
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


// PLAN TITLE SCROLL
$(function(){
	if($("div").hasClass("plan_anchor")){
		$(window).scroll(function(){
			if($('#panel_plnevt_0').length > 0 && $('#panel_plnevt_0').css('display')=='none'){
				return false
			}
			$(".plan_name").each(function(i) {
				var idx = 0;
				if($(window).scrollTop() > parseInt($(this).offset().top) - 102) {
					if ($(this).attr("data-isproc") === undefined || $(this).attr("data-isproc") == "false") {
						$(this).attr("data-isproc", "true")
					}
				}else{
					$(this).attr("data-isproc", "false")
				}
				for (var n = 0; n < $(".plan_name").size(); n++) {
					if ($($(".plan_name").get(n)).attr("data-isproc") == "true") {
						idx = n					
					}
				}
				$(".plan_sel select option:eq("+idx+")").prop("selected", true);				
			});
		}); 
	}
	//ANCHOR
	$('.plan_anchor select').change(function (){
		var idx = $('.plan_sel select option').index($('.plan_sel select option:selected'));
		var mgs
		if(idx == 0){
			mgs = 52
		}else{
			mgs = 100
		}
		$("html,body").animate({scrollTop: parseInt($(".plan_name").eq(idx).offset().top) - mgs}, 100);
	});
});


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


//LAYER POPUP
var scrpos = 0; 	//20160315	

// Scroll 
function scroll_out() {
	$('.dimlay').bind('touchmove', function (e) { e.preventDefault(); });
	$('body').bind('touchmove', function (e) { e.preventDefault(); });
	$('body').css('overflow-y', 'hidden');
	$('body').addClass('popLyrOpen');
}

function scroll_on() {
	$('.dimlay').unbind('touchmove');
	$('body').unbind('touchmove');
	$('body').css({'overflow-y':'auto','position':'static'});
	$('body').removeClass('popLyrOpen');
}

// Dim 
function dim_out() {
	$(".dimlay").remove();
	scroll_on();
	if($("div").hasClass("layer_detail")){
		$(".btn_top, .btn_arm").css('z-index',21);
	}
}

function dim_on() {
	if($("div").hasClass("layer_detail")){
		$(".layer_detail").append("<div class='dimlay'></div>");
		$(".btn_top, .btn_arm").css('z-index',0);
		$('.dimlay').css('display', 'block');
		scroll_out();
	}else{
		$('.container').append("<div class='dimlay'></div>");
		$('.dimlay').css('display', 'block');
		scroll_out();
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
	$('.layer_pop .btn_close, .layer_con .btn_close').on('click', function(e) {
		e.preventDefault();
		var this_name = '#' + $(this).parent().parent().attr('id');
		$('#contents').unbind('touchmove');
		layer_close(this_name);
		dim_out();
	});
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
})

// Layer Close      
function fn_layer_close(sId,_func) {//[v2_2] callback 추가
	if(_func) {
		_func();
	}
	var this_name = '#' + sId;
	$('#header').css('z-index', '');
	$('#contents').unbind('touchmove');

	$('#contents').css({ 'position': '', 'z-index': ''});//20160315
	$("html,body").scrollTop(scrpos);

	layer_close(this_name);
	scroll_on();
}

// Layer Open  
function fn_layer_open(sId,_func) {//[v2_2] callback추가

	if(_func) {
		_func();
	}
	$('body').css({ 'height': '100%', 'overflow': 'hidden' });

	name = "#"+sId;

	layer_open(name);

	if ($(name).hasClass('layer_fix')) {
		//layer_size(name);
		$('#header').css('z-index', '3');
		
		scrpos = $(window).scrollTop();	//20160315				
		
		if($('#contents').length > 0) {				
			$('#contents').css({ 'position': 'fixed', 'z-index': '2'});
			$('#contents').bind('touchmove', function (e) { e.preventDefault(); });
		} else {
			$('body').css({ 'position': 'fixed', 'z-index': '2'});
			$('body').bind('touchmove', function (e) { e.preventDefault(); });
		}
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
		scroll_on();
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

function layer_fix_close(n) {

	var this_name = '#'+n;
	
	$('#header').css('z-index', '');
	$('#contents').unbind('touchmove');
	
	if($(this_name).hasClass('layer_fix')){ //20160315	
		if($('#contents').length > 0) {
			$('#contents').css({ 'position': '', 'z-index': ''});
		} else {
			$('body').css({ 'position': '', 'z-index': ''});
		}
		$("html,body").scrollTop(scrpos);

		translateX("lnb", -100, 250);
		$('.lnb_dim').fadeOut(300);
		$('body').css('overflow-y', 'auto');
		$('body').unbind('touchmove');
		setTimeout(function(){$('#lnb').hide()}, 300);
	}
	layer_close(this_name);
	//scroll_on();
	dim_out();
}

function layer_fix_close2(n) {

	var this_name = '#'+n;
	
	$('#header').css('z-index', '');
	$('#contents').unbind('touchmove');
	
	layer_close(this_name);
	//scroll_on();
	dim_out();
}

    // Layer Close info
    function layer_close(n, _func1) {
        $(n).fadeOut(200);	
		if($('.dimlay').css('display')=='block'){
			$(".dimlay").fadeOut(200, function(){
				$(".dimlay").remove()
			});
			scroll_on();
		}
        if(_func1 != undefined) {
        	_func1();
        }
    }

    //dim out
    $('.dimlay').click(function () {
        dim_out();
        $('.layer_pop').fadeOut(100);
    });


//OPACITY LAYER
var scrolltop=0;
function OpacityLyrOpen(sId, topfix) {
	if(topfix){
		scrolltop = $(window).scrollTop();
	}
	$('body').append($("#"+sId));
	$("#"+sId).fadeIn(300);
    $('#contents').bind('touchmove', function (e) { e.preventDefault(); });
	$('#contents').css({ 'position': 'fixed', 'z-index': '2'});
}

function OpacityLyrCls(sId) {  
	setTimeout(function(){$('.slide_cont').append($("#"+sId))}, 300);
	$("#"+sId).fadeOut(300);
	$('#contents').unbind('touchmove');
	$('#contents').css({ 'position': '', 'z-index': ''});   //20160316	
	$('html, body').scrollTop(scrolltop);
	scrolltop=0;

	scroll_on();
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
            zzimStart();  
            zzimStop();
        });
        $(".layer_pop.pop_zzim .btn_close").bind("click", function(){
            $(".layer_pop.pop_zzim").fadeOut(200);
        });
    });

	//타이틀 카테고리 셀렉트박스 160322
	$(function(){
		if($('#ctg_sel').length>0){
			var ctgSel = $(".cts_tit #ctg_sel option:selected").text();
			var opt_x = document.getElementById("ctg_sel").length;
			if(opt_x>1){
				$(".cts_tit .ctg_sel").append("<span class='ctg_txt'>"+ctgSel+"</span>");
			}else{
				$('.ctg_sel').find('label').next('select').hide().end().remove();
				$(".cts_tit .ctg_sel").append("<span class='ctg_txt one'>"+ctgSel+"</span>");
			}
			$(".cts_tit #ctg_sel").change(function(){ 
				$(".cts_tit #ctg_sel option:selected").each(function(){
					msg = $(this).text();
					$(this).parent().parent().find("span").remove();
					$(this).parent().parent().append("<span class='ctg_txt'>"+msg+"</span>");
				});  
			});
		}
	});

});

//브랜드 상품리스트 변형
function fnDepgroup(id){
	var group = $('#'+id);
	group.find('.glist').width($(window).width()+3)

	//setTimeout(function(){
		//var first_img = group.find('li:first').find('.g_img').outerHeight(true);	
		var first_h = ($(window).width()/3) + 30;
		//var first_h = group.find('li:first').find('.g_wrap').outerHeight(true);
		group.find('li:nth-child(6n+4)').addClass('big')
		group.find('li:not(.big)').each(function() { $(this).height(first_h) })
		group.find('.big').each(function() { $(this).height(first_h*2) })
		group.find('.big .g_wrap').each(function() { $(this).height((first_h*2)-24) })
	//}, 500);
}

function fnDepgroupOST(id, even){
	var group = $('#'+id);
	if(even){
		group.find('li:nth-child(2)').addClass('big').css('float','right');
	}
	else{
		group.find('li:nth-child(4)').addClass('big')
	}
}

function insta_lineup(){
	var wrap = $('section[class^="insta_"]');
	wrap.find('dd').each(function(){
		var w_pd = wrap.css('padding-left');
		var size = ($(window).width() - (parseInt(w_pd)*2))/3;
		var img = $(this).find('img');
		var img_rto = img.height()/img.width();
		$(this).css({'height':+size+'px'});
		if(img_rto > 1){
			img.css({'width':+size+'px','height':'auto'})
			img.css({'top':'-'+ (img.height()-size)/2 + 'px'})
		}
		if(img_rto < 1){
			img.css({'width':'auto','height':+size+'px'})
			img.css({'left':'-'+ (img.width()-size)/2 + 'px'})
		}
		if(img_rto == 1){
			img.css({'width':+size+'px','height':+size+'px'})
			img.css({'left':0})
		}
	})
}
function follow_lineup(){
	var wrap = $('div[class^="follow_"]');
	wrap.find('li').each(function(){
		var w_pd = wrap.find('ul').css('padding-left');
		var size = ($(window).width() - (parseInt(w_pd)*2))/2;
		var img = $(this).find('img');
		var img_rto = img.height()/img.width();
		$(this).css({'height':+size+'px'});
		if(img_rto > 1){
			img.css({'width':+size+'px','height':'auto'})
			img.css({'top':'-'+ (img.height()-size)/2 + 'px'})
		}
		if(img_rto < 1){
			img.css({'width':'auto','height':+size+'px'})
			img.css({'left':'-'+ (img.width()-size)/2 + 'px'})
		}
		if(img_rto == 1){
			img.css({'width':+size+'px','height':+size+'px'})
			img.css({'left':0})
		}
	})
}

//상세검색 new / 메인 빌보드,상품상세 swiper document ready
$(function(){
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
	$("dd .tg_btns .open_btn:not('.brdLyrBt')").click(function(){
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

function fn_filter_open($obj){
	var targetData = $obj.data('filterMatching');
	var schFilter_brd = $('.sch_detail_lyr .pop_sch_brd');
	var schFilter_dtl = $('.sch_detail_lyr .pop_sch_dtl');
	if(targetData=="3"){
		schFilter_brd.show()
		schFilter_dtl.hide()
	}
	else{
		schFilter_brd.hide()
		schFilter_dtl.show()
	}
	$('.pop_sch_dtl dl').removeClass('active').find('dd').slideUp(0);
	$('.pop_sch_dtl dl[data-filter-matching="'+targetData+'"]').addClass('active').find('dd').slideDown(0);
	$('.pop_sch_dtl').scrollTop($('.pop_sch_dtl dl[data-filter-matching="'+targetData+'"]').offset().top);
}

//nbkids catg tab
$(function(){
	if($('div').hasClass('catg_tabs')){
		$('.catg_tabs:not(.center)').each(function(){
			var bt = $(this).find('li');
			var total = bt.length;
			bt.css({'width':''+ 100/total +'%'})
			/*if($('#wrapper').hasClass('kinder')){
				$(this).find('li:last').addClass('last')
			}*/
		})
	}	
});

/* 바후스 추가 */
function square_lineup(slector){
	var wrap = $(slector);
	var num;
	if(slector == '.rv_bn .swiper-slide ul li .thumb'){
		 num = 2;
	}else{
		num = 3;
	}
	wrap.each(function(){
		var w_pd = wrap.css('padding-left');
		var size = (($(window).width() - 50) - (parseInt(w_pd)*2))/num; //170303 수정:문연희
		var img = $(this).find('img');
		img.load(function(){
			var img_rto = img.height()/img.width();
			$(this).css({'height':+size+'px'});
			if(img_rto > 1){
				img.css({'width':+size+'px','height':'auto'})
				img.css({'top':'-'+ (img.height()-size)/2 + 'px'})
			}
			if(img_rto < 1){
				img.css({'width':'auto','height':+size+'px'})
				img.css({'left':'-'+ (img.width()-size)/2 + 'px'})
			}
			if(img_rto == 1){
				img.css({'width':'100%','height':'100%'})
				img.css({'left':0})
			}
		});
	})
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
function rectangle_lineup(slector){
	$(slector).each(function(){
		var li_w = $(this).width();
		var li_h = $(this).height();
		var img = $(this).find('img');
		img.load(function(){
			var img_rto = img[0].naturalHeight/img[0].naturalWidth;
			if(1 > img_rto){
				img.css({'width':'100%','height':'auto'})
			}
			if(1 < img_rto){
				img.css({'width':'auto','height':'100%'})
			}
			if(img_rto == 1){
				img.css({'width':'100%','height':'auto'})
			}
		});
	})
}
function fn_temp_tooltip(){
	var bx = $('.temp_tooltip')
	var img = bx.find('.bg img')
	var ori_w = img.attr('width')
	var ori_h = img.attr('height')
	bx.find('.tip_btn li button').each(function(){
		$(this).css('left',((parseInt($(this).css('left'))*100)/ori_w)+'%')
		$(this).css('top',((parseInt($(this).css('top'))*100)/ori_h)+'%')
	})
	bx.find('.tip_btn li').each(function(){
		var id = 'tip_'+$(this).index();
		$(this).find('.layer_fix').attr('id',id).clone().insertAfter('#footer');
		$(this).find('.layer_fix').remove();
		$(this).find('.open').click(function(){
			fn_layer_open(id);return false
		})
	})
	$('div[id^="tip_"]').find('.bahus_btn_close').click(function(){
		var id = $(this).parent('.layer_fix:first').attr('id')
		fn_layer_close(id);return false
	})
}
function fn_Tooltip_Size(){
	var wrap = $('.temp_tooltip')
	var sz = wrap.find('.bg img').outerWidth(true);
	var ori = wrap.find('.bg img').attr('width');
	wrap.find('.tip_btn li button').css('transform','scale('+sz/ori+')')
}
/* 바후스 추가 */

function fn_ios_set_zoom(){
	var elandmall = elandmall || {};
	elandmall.global = elandmall.global || {};
	elandmall.global.app_cd = elandmall.global.app_cd || {};
	elandmall.global.apptype = elandmall.global.apptype || {}; // 퍼블리싱 페이지 스크립트 에러 방지

	if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
		$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
		.on('touchstart focusin', function() {
			$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
		})
		.focusout(function() {
			$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
		});
		$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
			$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
		});
		
	}
}

$(document).ready(function(){ // iOS Safari auto Zooming - Disable 아이폰 App/Web 일때만 실행
	var elandmall = elandmall || {};
	elandmall.global = elandmall.global || {};
	elandmall.global.app_cd = elandmall.global.app_cd || {};
	elandmall.global.apptype = elandmall.global.apptype || {}; // 퍼블리싱 페이지 스크립트 에러 방지

	if(elandmall.global.app_cd == "iOS" || elandmall.global.apptype == "IOS"){
		$('.goods_wrap, .goods_opt').find($('input[type="text"], textarea, select'))
		.on('touchstart focusin', function() {
			$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
		})
		.focusout(function() {
			$('#viewport').attr('content','width=device-width, initial-scale=1, user-scalable=yes');
		});
		$('.layer_login').find($('input[type="text"], textarea, select')).on('touchstart focusin', function() {
			$('#viewport').attr('content','width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
		});
		
	}
})

commonUI.loadJs = function(src){
	var script = document.createElement('script');
	script.type='text/javascript';
	script.src = src;
	(document.getElementsByTagName('head')[0] || document.body).appendChild(script);
}

// commonUI.wishToggle = function(){  //퍼블리싱용
// 	$(".goods_list li .g_wish").not(".on").click(function(){
// 		$(this).addClass("on");
// 	});
// }();

commonUI.wishTogDev = function(target){  //개발 적용 이후 사용 분
	target.not(".on").addClass("on");
};

/* [v2] : 추가 */

function fixedFullLayer(id,targetBtn) {
	var $html;
	var $body;
	var $layID;
	var $btnClose;
	function init() {
		$html = $('html');
		$body = $('body');
		//$('html').css('height','100%');
		$layID = $('#'+id);
		$btnClose = $layID.find('.btn_cmn_x');
		layerOn();
		initEvtL();
	}

	function initEvtL() {
		$btnClose.on('click',function(e) {
			layerOff();
			e.preventDefault();
		});
		$html.on('touchstart',function(e) {
			$layID.css({'-webkit-overflow-scrolling':'auto'});
			$layID.css({'-webkit-overflow-scrolling':'touch'});
		});
		// document.addEventListener('touchstart',function(e) {
		// 	$layID.css({'-webkit-overflow-scrolling':'auto'});
		// 	$layID.css({'-webkit-overflow-scrolling':'touch'});
		// });
	}

	function layerOn() {
		$layID.show().focus();
		if(!$body.hasClass('bodyFixed') && !$html.hasClass('bodyFixed')) {
			setTimeout(function(){
				$body.addClass('bodyFixed');
				$html.addClass('bodyFixed');
			},800);
		}
		/* dimed 처리 */
		var ZINDEX = parseInt($layID.css('zIndex'));
		if($('#fixedDimed').length > 0) {
			return;
		}
		$body.append('<div id="fixedDimed" style="z-index:'+(ZINDEX-1)+'"></div>')
	}

	function layerOff() {
		$body.removeClass('bodyFixed');
		$html.removeClass('bodyFixed');
		$html.off('touchstart');
		$layID.hide();
		if(targetBtn) {
			$(targetBtn).focus();
		}
		/* dimed 처리 */
		$('#fixedDimed').remove();
	}
	init();

	return {
		funcLayerOff : function() {
			layerOff();
		}
	}
}
var layerOpenCall = {}//fixedSelectLayer : 레이어 콜한 버튼 obj
function fixedSelectLayer(id,targetBtn) {
	var $body;
	var $html;
	var $layID;
	var $targetBtn;
	function init() {
		$html = $('html');
		$body = $('body');
		//$('html').css('height','100%');
		$layID = $('#'+id);		
		//layerOn();
	}

	function layerOn() {
		layerOpenCall.focusid = targetBtn;
		$targetBtn = $(targetBtn);
		$body.addClass('bodyFixed');
		$html.addClass('bodyFixed');
		$layID.show().focus();
		/* dimed 처리 */
		var ZINDEX = parseInt($layID.css('zIndex'));
		$body.append('<div id="fixedDimed" style="z-index:'+(ZINDEX-1)+'"></div>')
	}

	function layerOff() {
		$body.removeClass('bodyFixed');
		$html.removeClass('bodyFixed');
		$layID.hide();
		$(layerOpenCall.focusid).focus();
		/* dimed 처리 */
		$('#fixedDimed').remove();
	}

	init();

	return  {
		layOn : function() {
			layerOn();
		},

		layOff : function() {
			layerOff();
		}
	}
}

commonUI.setTab = function(id,cont,idx) {
	var $id;
	var $tab;
	var $conts;
	var cIndex;
	var itemLeng;

	function init() {
		$id = $(id);
		$tab = $id.find('li');
		$tabLink = $tab.find('a');
		$conts = $(cont);
		cIndex = (idx) ? idx : 0;
		itemLeng = $conts.length;
		if(itemLeng-1 < idx) {
			cIndex  = 0;
		}
		tabOpen(cIndex);
		initEvtL();
	}

	function initEvtL() {
		$tabLink.on('click',function(e) {
			var idx = $tabLink.index(this);
			tabOpen(idx);
			e.preventDefault();
		});
	}

	function tabOpen(idx) {
		$conts.hide();
		$conts.eq(idx).show();
		$tab.removeClass('active');
		$tab.eq(idx).addClass('active');

	}

	init();
}



commonUI.dimCall = function(){
	$('<div class="clear_dim"></div>').insertAfter($('.footer_kms'));
}

commonUI.dimRemove = function(){
	$('.clear_dim').remove();
}

commonUI.dimCall2 = function(){
	$('<div class="blk_dim"></div>').insertAfter($('.footer_kms'));
}

commonUI.dimRemove2 = function(){
	$('.blk_dim').remove();
}

commonUI.lyrCnfmO = function(id){
	commonUI.dimCall2();
	$(id).show();
}

commonUI.lyrCnfmC = function(id){
	commonUI.dimRemove2();
	$(id).hide();
}

commonUI.contTest = function(){
	if(localStorage.consTest){
		var TestSpells = localStorage.consTest;
		var goTest = eval('(' + TestSpells + ')');
		goTest();
	}
}
commonUI.contTest();

commonUI.getStatSc = function($inner,action){
	$wrapper = $inner.parent();
	$bar = $wrapper.find('.scroll_bar .bar')
	if(action=='touchstart'){
		$bar.addClass('touched');
		return false;
	}
	else if(action=='touchend'){
		$bar.removeClass('touched')
		return false;
	}
	frameWd = $wrapper.outerWidth() - parseInt($wrapper.css('padding-right')) - parseInt($wrapper.css('padding-left'));
	innerWd = $inner.outerWidth();
	innerOfst = $inner.offset().left- parseInt($wrapper.css('padding-left'));
	barWd = innerOfst / (frameWd - innerWd) *100
	$bar.css('width', (barWd || 0) +'%');
}

// toggle Btn
$(document).ready(function() {
	$(".togglBtn a").click(function() {
		$(this).toggleClass('on');
	});
});

// 통합몰 메인 GNB 기획전,이벤트,브랜드구좌 상단 가변고정
$(window).scroll(function(){
	var _height = $(document).scrollTop(); //스크롤바 위치값 가변
	var _gnbheight = $(".main_top").outerHeight(); //Gnb 상단고정 상태 plan_top
	var _bnHeight = $(".plan_top").outerHeight(); //기획전배너 높이 가변	
	var _filterChange = _bnHeight; //배너높이 + gnb높이 = 필터 상단 닿을 시점
	
	if($("body").hasClass("head_up")){
		if(!$("body").hasClass("kims")){ //주소를 검색했을 경우 실행	
			$(".cts_tit_plan").css('top',_height-3); //타이틀 상단 가변고정 - 킴스제외
		}else{
			$(".cts_tit_plan").css('top',_height-6); //타이틀 상단 가변고정 - 킴스
		}		
		$(".cts_tit_plan").addClass('scroll'); //타이틀 클래스 추가
	}else{
		$(".cts_tit_plan").css('top','auto'); //타이틀 상단 원위치
		$(".cts_tit_plan").removeClass('scroll'); //타이틀 클래스 삭제		
	}

	if (_height>=_filterChange){
		if(!$("body").hasClass("kims")){ //주소를 검색했을 경우 실행	
			$(".main_plan").css('top',_height + 33 - _bnHeight); //필터 상단 가변고정 - 킴스제외
		}else{
			$(".main_plan").css('top',_height + 31 - _bnHeight); //필터 상단 가변고정 - 킴스
		}		
		$(".main_plan").addClass('scroll'); //필터 클래스 추가
	}else{
		$(".main_plan").css('top','auto'); //필터 상단 원위치
		$(".main_plan").removeClass('scroll'); //필터 클래스 삭제				
	}
});


//임시 스크롤 업 추후 개선
// function tempUp($cat){
// 	var $snoop = $cat.parent().parent().parent().parent().parent().parent().parent('.dl_scroll').parent('.newdiv');
// 	if($snoop.hasClass('newdiv')){
// 		$target = $cat.parent().parent().parent().parent().parent().parent().parent('.dl_scroll');
// 		$target.hasClass('dl_scroll') ? $target.scrollTop(0) : false;
// 	}
// }


commonUI.fixtop = function($obj, _Func, pre_Func){
	// 사용처 표기 : 메인 홈 - 스토어 쇼핑
	// 위란에 사용처 표기 후, 해당 스크립트 변경/수정 시 함께 검수 부탁드립니다.
	var bnHeight = function(){
		if($('.header_bn').length && !$('body').hasClass('head_up')){return $('.header_bn').outerHeight()}
		else{return 0}
	}();
	var topGap = function(){
		if($('body').hasClass('head_up')){return 0}
		else{return $('.head').outerHeight()}
	}();
	var intTop = $obj.offset().top - topGap - bnHeight;
	var objHeight = $obj.height();
	ctgFixFlag=0;
	scrInitFlag=0;
	if(!$('#fixtop_dummy').length){
		$('.gnb_wrap').after('<div id="fixtop_dummy"></div>');
	}
	if(!scrInitFlag){
		++scrInitFlag
		$(window).scroll(function(){
			var gnbHeight = $('.main_top').outerHeight(),
			objOffst = $obj.offset().top,
			sen = intTop - gnbHeight,
			gap=3,
			scT = $(this).scrollTop()-gap,
			objGetH = function(){
				if(ctgFixFlag){
					return objHeight;
				}
				else{
					return 0;
				}
			}();

			if(scT >= (sen+objGetH)){
				if(!ctgFixFlag){
					if(pre_Func){pre_Func()}
					$obj.addClass('fixtop');
					$('#fixtop_dummy').html($obj[0]);
					$('#cont_dummy').html('');
					if(_Func){_Func()}
					ctgFixFlag = 1;
				}
			}
			else{
				if(ctgFixFlag){
					if(pre_Func){pre_Func()}
					$obj.removeClass('fixtop');
					$('#cont_dummy').html($obj[0]);
					$('#fixtop_dummy').html('');
					if(_Func){_Func()}
					ctgFixFlag = 0;
				}
			}
		});
	}
}
commonUI.fixtop.reset=function(){
	if($('#fixtop_dummy').length){
		$('#fixtop_dummy').remove();
	}
	if($('#cont_dummy').length){
		$('#cont_dummy').remove();
	}
}

//  단골매장 검색
commonUI.favSch = function(){
	$(".fav_sch input").keyup(function() {
		if ($(this).val() == '') {
			$(".fav_sch .del").hide();
		}else{
			$(".fav_sch .del").show();
		}
	});

	$(".fav_sch .search").focus(function() {
		$(".fav_sch .del").hide();
	});

	var $btn = $(".sch_key dt button");
	var $target = $(".sch_key dd");
	$btn.on("click" ,function(){
		$btn.removeClass("on");
		$(this).addClass("on");
		$target.hide();
		$(this).parent().next().show();
	});
	$btn.focus(function() {
		$(".sch_word").hide();
	});

	$(".fav_sch .del").on("click touchstart", function(){
		$(".fav_sch input").val("");
		setTimeout(function() { $(".fav_sch .del").hide()}, 100);
	});
}

//IOS 더블클릭 이슈 NGCPO-6986
var pf = navigator.platform;
var ua = navigator.userAgent;
 if(/iphone/i.test(pf)){
	$(document).ready(function() {
	  $(".ft_menu a").on("click touchstart", function(e) {
	    var el = $(this);
	    var link = el.attr("href");
	    window.location = link;
	  });
	}); 
}

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
				$(this).addClass('line_out').nextAll().not('.more').addClass('line_out');
				return false;
			}
		}
	});
	if($wrapper.find('.line_out').length==0){
		$more.hide();
	}
}


// scroll end
$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};


//주소검색결과 컨텐츠 높이 NGCPO-7386
$(function(){
	if($('.adr_sreach_results').hasClass('on')){ //주소를 검색했을 경우 실행	
		var con_all_h = $('#post_layer .pop_txt.post').outerHeight() - 30; //팝업 컨텐츠 전체높이
		var con_input_h = $('.pop_txt.post .search_btns').outerHeight() + 13; //주소검색창 높이
		var con_info_h = 0; //검색정보 영역높이
		if($('.txt_info2').css("display") != "none"){
			con_info_h += $('.txt_info2').outerHeight()
		}
		var con_result_h = $('.adr_sreach_results').outerHeight() + 8; //검색결과 영역높이
		var con_minus_h = con_input_h + con_info_h + con_result_h; //제거 될 높이값 측정
		var con_h = con_all_h - con_minus_h; //결과값 적용될 높이값
		$('#adr_search_results .board_scroll').css('height',con_h);
	}
});

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
$(function(){
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
