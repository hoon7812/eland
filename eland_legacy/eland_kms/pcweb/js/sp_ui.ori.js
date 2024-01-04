// UI 관련 공통 스크립트
var commonUI = commonUI || {};

commonUI.isTouchAble = commonUI.isTouchAble || {};
commonUI.windowReady = commonUI.windowReady || {};

commonUI.tab = commonUI.tab || {};
commonUI.tabID = commonUI.tabID || {};
commonUI.tab_sub = commonUI.tab_sub || {};
commonUI.tabSlide = commonUI.tabSlide || {};
commonUI.popupOpen = commonUI.popupOpen || {}; // 레이어팝업열기 , ex) commonUI.popupOpen('#layer01');
commonUI.popupClose = commonUI.popupClose || {}; // 레이어팝업닫기 , ex) commonUI.popupClose('#layer01','#btns01'); 닫을 레이어,포커스 이동(버튼)

commonUI.view = commonUI.view || {};
commonUI.view.dimmOn = commonUI.view.dimmOn || {}; // 딤드 On , commonUI.view.dimmOn();
commonUI.view.dimmOff = commonUI.view.dimmOff || {}; // 딤드 Off , commonUI.view.dimmOff();
commonUI.view.imgAlignSort = commonUI.view.imgAlignSort || {}; // 이미지 중앙정렬 ,  ex) commonUI.imgAlignSort($('.selector'));
commonUI.view.toolTip = commonUI.view.toolTip || {};
commonUI.view.colorChip = commonUI.view.colorChip || {};
commonUI.brandMenuOpen = commonUI.brandMenuOpen  || {}; //브랜드 메뉴 열기
commonUI.brandMenuClose = commonUI.brandMenuClose  || {}; //브랜드 메뉴 닫기
commonUI.view.loadingbarOn = commonUI.view.loadingbarOn || {}; // 로딩 바 열기
commonUI.view.loadingbarOff = commonUI.view.loadingbarOff || {}; // 로딩 바 닫기
commonUI.view.listProduct = commonUI.view.listProduct || {}; //상품리스트
commonUI.view.navCate = commonUI.view.navCate || {}; //카테고리좌측메뉴 ,
commonUI.view.bannerMore = commonUI.view.bannerMore || {}; //배너더보기
commonUI.view.wideLayout = commonUI.view.wideLayout || {}; //100% 구조
commonUI.view.depth1Slider01 = commonUI.view.depth1Slider01 || {}; //대카테고리 키베너 슬라이더
commonUI.view.depth1Slider01Func = commonUI.view.depth1Slider01Func || {}; //대카테고리 키베너 슬라이더 실행
commonUI.view.searchFilter = commonUI.view.searchFilter || {}; //카테고리 검색필터
commonUI.view.qnaTable = commonUI.view.qnaTable || {}; //qna table
commonUI.view.reviewTable = commonUI.view.reviewTable || {}; //review table
commonUI.view.lyrSlt = commonUI.view.lyrSlt || {}; //레이어형 셀렉트
commonUI.view.lyrSltD = commonUI.view.lyrSltD || {}; //레이어형 셀렉트 - 중복선택 케이스
commonUI.view.search = commonUI.view.slideConer || {}; // 슬라이드 타입 코너

commonUI.view.VerticalListMenu = commonUI.view.VerticalListMenu || {};//기획전 인덱스 리스트 스크롤
commonUI.bodyClickFunc = commonUI.bodyClickFunc || {};// body click administration
commonUI.bodyClickOnFunc = commonUI.bodyClickOnFunc || {};// body click administration
commonUI.bodyClickOffFunc = commonUI.bodyClickOffFunc || {};
commonUI.view.fmSelFunc = commonUI.fmSelFunc || {}; // 160408_추가 footer familysite link
commonUI.search = commonUI.search || {};

commonUI.loadJs = commonUI.loadJs || {}; // Load JS

commonUI.netOn = commonUI.netOn || {}; // 넷퍼넬 컨트롤
commonUI.netOff = commonUI.netOff || {}; // 넷퍼넬 컨트롤

commonUI.dimCall = commonUI.dimCall || {};
commonUI.dimRemove = commonUI.dimRemove || {};
commonUI.contTest = commonUI.contTest || {};


commonUI.favSch = commonUI.favSch || function(){}; // 단골매장 검색 관련
commonUI.controlSlide = commonUI.controlSlide || function(){}; // 슬라이드 좌우 버튼 컨트롤




$(window).ready(function(){
	commonUI.windowReady();
});

commonUI.windowReady = function(){
	commonUI.view.toolTip();
	commonUI.view.listProduct();
	commonUI.view.navCate();
	commonUI.view.bannerMore('#list_brand_logo01',7);/* 클래스네임 , 상품제한갯수 */
	//commonUI.view.colorChip(); 160819 삭제
	commonUI.view.wideLayout();
	commonUI.view.depth1Slider01Func();
	//commonUI.view.searchFilter(); 160819 삭제
	commonUI.view.qnaTable();
	commonUI.view.reviewTable();
	commonUI.view.fmSelFunc();// 160408_추가
	commonUI.view.lyrSlt();
	commonUI.contTest();
}

commonUI.view.slideConer=function($target){ // 공통 Slide 2018.08.23 JEC@pionnet.co.kr
	if ( commonUI.isTarget($target) ) return;
	this.crtChild = 0;
	this.$target = $target;
	this.$slides =$target.find('> .swiper-container > .swiper-wrapper > .swiper-slide');
	this.totalChild = $target.find('> .swiper-container > .swiper-wrapper > .swiper-slide').length;
	if(this.totalChild<2 || this.totalChild<=$($target)[0].opt.perView ) {
		$($target).find('+.btn_set').hide();
		return;
	}
	$($target)[0].totalChild = this.totalChild;
	$($target)[0].$txtPaging = $($target).parent().find('.page');
	$($target)[0].options={
		mode : $($target)[0].opt.mode || 'horizontal',
		simulateTouch :$($target)[0].opt.simulateTouch || false,
		createPagination : $($target)[0].opt.createPagination || false,
		pagination : $($target)[0].opt.pagination || false,
		paginationElement : $($target)[0].opt.paginationElement || 'auto',
		paginationClickable: true,
		slidesPerGroup: $($target)[0].opt.slidesPerGroup || 1,
		//loop: $($target)[0].opt.loop || false,
		loop : commonUI.view.slideConer.prototype.TorF($($target)[0].opt.loop),
		// loop : true,
		autoplay: $($target)[0].opt.autoplay || false,
		speed : $($target)[0].opt.speed || 1500,
		slidesPerView : $($target)[0].opt.perView || 1,
		$target : this,
		calculateHeight : $($target)[0].opt.calculateHeight || false,//[v2_2] 추가
		onSlideChangeEnd:function($target){
			commonUI.view.slideConer.prototype.changePgn($target)
		}
	}
	$($target).find('+.btn_set').show();
	this.initSwiper(this.$target.find('.swiper-container')[0]);
}


commonUI.view.slideConer.prototype.initSwiper=function($target){
	this.$target[0].swiper = new Swiper($target, this.$target[0].options)
	this.initBtns(this.$target[0].swiper);
	this.changePgn();
}

commonUI.view.slideConer.prototype.initBtns=function($swiper){
	var $target = $($swiper.container.parentElement);
	var corner_swiperEle = { $target : $target , status : true , last_idx : 0 , ins : $swiper , $prevBtn : $($target).find("+ .btn_set > .btn-prev") , $nextBtn :  $($target).find("+ .btn_set > .btn-next") };


	corner_swiperEle.$target.hover(
		function (e) { //mouseenter
			corner_swiperEle.ins.stopAutoplay();
			e.preventDefault();
		},
		function (e) { //mouseleave
			if ( corner_swiperEle.status ) corner_swiperEle.ins.startAutoplay();
			e.preventDefault();
		}
	);
	corner_swiperEle.$prevBtn.on('click',function(e){
		corner_swiperEle.ins.swipePrev();
	})

	corner_swiperEle.$nextBtn.on('click',function(e){
		corner_swiperEle.ins.swipeNext();
	})
}

 commonUI.view.slideConer.prototype.changePgn=function(chain){
 	var $obj, crt
 	chain ? $obj = $(chain.container.parentElement) : $obj = $(this.$target);
 	if ($obj[0].$txtPaging){
		crt = $obj.find('> .swiper-container > .swiper-wrapper > .swiper-slide-active').attr('data-index')*1;
		$obj[0].$txtPaging.html('<strong>'+crt+'</strong>' + '/' + $obj[0].totalChild);
	}
	else true;
}

commonUI.view.slideConer.prototype.TorF = function(param){
	if(param == 'false'){
		return false;
	}
	else{
		return true;
	}
}



commonUI.loadJs = function(src){
	var script = document.createElement('script');
	script.type='text/javascript';
	script.src = src;
	(document.getElementsByTagName('head')[0] || document.body).appendChild(script);
}


commonUI.view.lyrSlt = function(){
	$('.lyr_select .sel_btn').unbind('click'); // 함수 중복 호출 시, click 이벤트 unbind후 재 bind
	$('.lyr_options .options li .ancor').unbind('click'); // 함수 중복 호출 시, click 이벤트 unbind후 재 bind
	if($('.lyr_select').hasClass('lyr_select')){
		$('.sel_txt').each(function(){ // 셀렉트 박스의 기본 메시지를 data-org-msg 사용자 태그에 저장
			if(!$(this).attr('data-sel-msg')){ // 함수 중복 호출 시, 중복 작동 방지
				$(this).attr('data-org-msg',$(this).text());
			}
		});
		commonUI.view.lyrSlt.prototype.initSel();
		commonUI.view.lyrSlt.prototype.initAnc();
	}
}

commonUI.view.lyrSlt.prototype.showText = function($selBtn){ // 선택이 된 경우 : 셀렉트 박스에 선택된 메시지, 그렇지 않을 경우: 기본 메시지를 노출
	if ($selBtn.find('.sel_txt').attr('data-sel-msg') &&  !$selBtn.parent().hasClass('on')){
		$selBtn.addClass('selected').find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-sel-msg'));
	}
	else{
		if(!$selBtn.hasClass('no_keep')){ // no_keep 케이스 경우 항상 선택된 텍스트 노출
			$selBtn.find('.sel_txt').html($selBtn.find('.sel_txt').attr('data-org-msg'))
		}
	}
}

commonUI.view.lyrSlt.prototype.lyrMax=function($selBtn, $optBox){ // 하단 샐링 포인트의 경우 최대 높이값 유동 조절
	$selBtn.siblings('.lyr_options').css({display:'block', visibility:'hidden'});
	var $optLyr = $selBtn.siblings('.lyr_options').find('.options');
	var maxHeight = $optBox.outerHeight() - ( $optLyr.offset().top - $optBox.offset().top) - 25;
	$selBtn.siblings('.lyr_options').removeAttr('style');
	$optLyr.css('max-height', maxHeight)
}


commonUI.view.lyrSlt.prototype.initSel= function(){
	$('.lyr_select .sel_btn').click(function(){ // 셀렉트 박스 클릭 시, 상품 옵션 선택 레이어 토글
		var $parent = $(this).parent('.lyr_select');
		 if(!$(this).parent().hasClass('disabled')){
			if ($(this).parent().hasClass('on')){
				$(this).parent().removeClass('on');
			}
			else{
				var $optBox = null;
				if($(this).parent().parent().parent().parent('.on_opt_box').length > 0) { //일반,묶음
					$optBox = $(this).parent().parent().parent().parent('.on_opt_box');
				}else{ //세트
					$optBox = $(this).parent().parent().parent().parent().parent('.on_opt_box');
				}
				if($optBox.hasClass('on_opt_box')){commonUI.view.lyrSlt.prototype.lyrMax($(this), $optBox)}
				$('.lyr_select').removeClass('on');
				$(this).parent().addClass('on');
				if($(this).parent().hasClass('hasDefault') && $(this).parent('.hasDefault').find('.dVal').length > 0 && !$(this).hasClass('selected'))  { //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤 //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
					var $li = $(this).parent().parent();
					commonUI.view.lyrSlt.prototype.goToDft($li);
				}

				if($(this).parent().hasClass('hasDefault') && $(this).parent('.hasDefault').find('.pSel').length > 0 )  { //해당상품 seleced 후 스크롤 이동 //NGCPO-6522
					var $li = $(this).parent().parent();
					commonUI.view.lyrSlt.prototype.goToSelect($li);
				}

			}
			if(!$parent.hasClass('multi')){ // 멀티 선택의 경우 텍스트 반영 하지 않음.
				commonUI.view.lyrSlt.prototype.showText($(this));
			}
		}
	});
}

commonUI.view.lyrSlt.prototype.initAnc = function(){
	$('.lyr_options .options li .ancor').click(function(){ // 상품 옵션 선택 시 작동
		var $this = $(this);
		var $li = $(this).parent();
		var $selBtn = $(this).parent().parent().parent().siblings('.sel_btn');
		var $parent  = $selBtn.parent('.lyr_select');
		if(!$li.hasClass('sld_out')){
			$selBtn.find('.sel_txt').attr('data-sel-msg',$(this).find('.opt_name').text());
			$('.lyr_select').removeClass('on');
			$li.addClass('selected').siblings('li').removeClass('selected');
			commonUI.view.lyrSlt.prototype.showText($selBtn);  				
		}
	});
}

commonUI.view.lyrSlt.prototype.selComp= function(){ //레이어 셀렉트 박스 초기화
	$('.sel_txt').not($('.noreset .sel_txt')).each(function(){
		$(this).html($(this).attr('data-org-msg')).removeAttr('data-sel-msg');
	});
	$('.sel_btn').not($('.noreset .sel_btn')).removeClass('selected');
	$('.options li').not($('.noreset .options li')).removeClass('selected');
}

//주얼리 호수 옵션 스크롤 가운데로 디폴트_상세상단 옵션영역에만 적용
commonUI.view.lyrSlt.prototype.goToDft = function($li){ //기본값을 가지고 있는 경우 기본값이 가운데로 오도록 스크롤 //NGCPO-5454 [주얼리] 옵션 디폴트 값으로 스크롤
	var $scroller = $li.find('.options');
	$scroller.scrollTop(0); // 정확한 좌표 측정을 위해 스크롤을 상단으로 초기화
	var scrollerOfst = $scroller.offset().top;
	var defualtVOfst =$scroller.find('.dVal').offset().top;
	var gap = defualtVOfst - scrollerOfst;
	var moveRange =  gap - ( $scroller.height() - $scroller.find('.dVal').height() )/2;
	$scroller.scrollTop(moveRange);
	// $scroller.scrollTop($scroller.find('.dVal').offset().top/2);
}

//기획전 선택된 옵션 스크롤 맨위로_상세플로팅과 퀵뷰팝업에 적용 200406이정은
commonUI.view.lyrSlt.prototype.goToSelect = function($li){ //해당상품 seleced 후 스크롤 이동 건 //NGCPO-6522 [FO] 럭키딜 상세페이지 내 구매하기 상품리스트 개선(버그)
	var $scroller = $li.find('.options'); //.option 스크롤러
	$scroller.scrollTop(0); //정확한 좌표 측정을 위해 스크롤을 상단으로 초기화
	var scrollerOfst = $scroller.offset().top; //스크롤러 상단 좌표 
	var defualtVOfst =$scroller.find('.pSel').offset().top; ////select옵션 상단 좌표
	var gap = defualtVOfst - scrollerOfst; //
	var optHeight = $li.find('.options li').height(); //옵션 높이값
	var moveRange_P =  gap - ( $scroller.find('.pSel').height() - optHeight ); 
	$scroller.scrollTop(moveRange_P);	
}

commonUI.isTouchAble = function() {
   return 'ontouchstart' in document.documentElement;
};

commonUI.imgAlignSort = function ( $obj ){  // 이미지 중앙정렬, commonUI.imgAlignSort($('.selector'));
	$obj.css({
		"position":"relative"
		,"top":"50%"
		,"marginTop":-($obj.height()/2)
		,"left":"50%"
		,"marginLeft":-($obj.width()/2)
	});
}

commonUI.view.loadingbarOn = function () {
	$(".loading").addClass("on");
}

commonUI.view.loadingbarOff = function(){
	$(".loading").removeClass("on");
}


commonUI.isTarget = function( $target ){ //	if ( commonUI.isTarget( $target ) ) return;
	return $target.length < 1;
}

commonUI.popupOpen = function( target , targetPosition , _afterFunc ){//[v2] : _afterFunc 추가
	var $window = $(window);
	var $body = $("body");
	var $document = $(document);

	var $layerTarget = $(target);
	var $lastTarget = $(".d_layer_pop.on");

	if ( $lastTarget.length > 0 ){
		$lastTarget.removeClass("on")
	}

	var scroll = $window.scrollTop();
	var bodyHeight = $body.height();
	var layerHeight = $layerTarget.height();

	if ( targetPosition ) {
		var $opt = $(targetPosition);
		var _top = $opt.offset().top + $opt.height() + 10;
		var _left_body = $("#content").offset().left + $("#content").width();
		var _left_opt = $opt.offset().left + $layerTarget.width();
		if ( _left_body < _left_opt ) {
			var _left = $opt.offset().left + _left_body - _left_opt ;
		}else{
			var _left = $opt.offset().left
		}
		_onCss = {
			"top" : _top
			,"left" : _left
			,"marginLeft" : 0
		}
	}else{
		var _top = ( bodyHeight <= layerHeight ) ? scroll : ( bodyHeight - layerHeight )/4 + scroll ;
		_onCss = {"top" : _top };
	}

	$layerTarget.css(_onCss).attr("tabIndex","-1").addClass("on").show().focus(); //로그인 레이어와 충돌로 오픈 되지 않음  -> show() 처리

	if(_afterFunc) {
		_afterFunc();
	}
}

commonUI.tab.lastTarget = commonUI.tab.lastTarget || {};
commonUI.tab = function( target , in_idx ){
	var $tabTarget = $(target);
	var $tabCont = $tabTarget.parent().find(".d_tab_cont");

	var $onTab = $tabTarget.find("li").eq(in_idx);
	var $onCont = $tabCont.eq(in_idx);

	$tabTarget.find("li").removeClass("on");
	$tabCont.removeClass("on");
	$onTab.addClass("on")
	$onCont.addClass("on")
}
commonUI.tab_sub = function( target , in_idx ){
	var $tabTarget = $(target);
	var $tabCont = $tabTarget.parent().find(".d_sub_tab");

	var $onTab = $tabTarget.find("li").eq(in_idx);
	var $onCont = $tabCont.eq(in_idx);

	$tabTarget.find("li").removeClass("on");
	$tabCont.removeClass("on");
	$onTab.addClass("on")
	$onCont.addClass("on")
}
commonUI.tabID = function( target , in_idx , currentItem ){
	var $tabTaget = $("#"+target+in_idx);
	var $allTab = $("[id^="+target+"]");
	var $tabBtn = $(currentItem).parents('.d_tab');
	var $tabBtnLi = $tabBtn.find('li');
	console.log($tabBtn.html());
	//$tabBtn.find('li').eq()

	$allTab.removeClass('on');
	$tabTaget.addClass('on');
	$tabBtnLi.removeClass('on');
	$tabBtnLi.eq(in_idx).addClass('on');
}


commonUI.tabSlide = function(target){
	var timer;
	var init = function(){
		if($('#'+target+' li').length>1){
			$('#'+target+' li a').click(function(){
				reset();
			});
			timer = setInterval(function(){doNext()},3000);
		}
		else{
			//nothing
		}
	};
	var reset = function(){
		clearInterval(timer);
		timer = setInterval(function(){doNext()},3000);
	};
	var doNext = function(){
		if($('#'+target+' li.on:last-child').length){
			$('#'+target+' li:first-child a')[0].onclick();
		}
		else{
			$('#'+target+' li.on + li a')[0].onclick();
		}
	}
	init();
}

commonUI.popupClose = function( target , lastTarget , _afterFunc){//[v2] : _afterFunc 추가
	var $target = $(target);
	var $lastTarget = $(lastTarget);
	$target.removeAttr("tabIndex").removeClass("on").hide();  // 로그인 레이어와의 충돌로 hide()처리
	if(_afterFunc) {
		_afterFunc();
	}
	$lastTarget.focus();
}

commonUI.brandMenuOpen = function( target ){
	var $target = $(target);
	$target.show().attr("tabIndex","0").focus();
}

commonUI.brandMenuClose = function( target , lastTarget ){
	var $target = $(target);
	var $lastTarget = $(lastTarget);
	$target.removeAttr("tabIndex").hide();
	$lastTarget.focus();
}

commonUI.view.toolTip = function(  ){
	var $target = $(".d_tooltip");
	var $wrap = $("#wrapper");
	var $tooltips = $(".set_tooltip");

	var $lastThis;

	if ( commonUI.isTarget( $target ) ) return;

	function _bodyClickFn(e){ // body click func
		var $hasTarget = $lastThis.find(".tip_info");

		if (!$hasTarget.is(e.target) && $hasTarget.has(e.target).length === 0){
		  	commonUI.bodyClickOffFunc( "d_toolTipFunc" );
			$tooltips.removeClass("on");
		  	e.preventDefault();
		}
	}

	commonUI.bodyClickFunc( "d_toolTipFunc" , _bodyClickFn );

	$target.each(function(){
		var $this = $(this);

		var $links = $this;
		var $view = $this.next(".set_tooltip");
		var $tip_close = $view.find(".tip_close");

		$links.on("click",function(e){
			e.preventDefault();

			$view.toggleClass("on");
			if ( $lastThis != $view || $view.hasClass("on")) {
				$lastThis = $view;
				commonUI.bodyClickOnFunc( "d_toolTipFunc" );
			};
		});

		$tip_close.on("click",function(e){
			e.preventDefault();

			$links.focus();
			$view.removeClass("on");
		});
	})

	function _containerCick(){
		$("#wrapper").on( "click focus" ," #container " , function(e){
			if ( $(e.target).parents(".set_tooltip").length < 1) {
				$this.removeClass("on");
				$("#wrapper").off( "click focus" , " #container ");
			}
		});
	}


}
commonUI.view.colorChip = function(){
	var $target = $(".d_chip_over");

	if ( commonUI.isTarget( $target ) ) return;

	$target.on("click",".chip",function(e){
		var $this = $(this);

		if ( $this.is("[class*=' disabled']") ) return;

		$target.find(".chip.on").removeClass("on");
		$this.addClass("on");

		e.preventDefault();
	})
}

/* 160201 수정 */
commonUI.view.listProduct = function( opt ) {
	var $lp = $(".d_prd_over") ;
	var $lpGroup = $lp.find(".list");
	var $lpItem = $lp.find(".list > li").not(".d_soldout");
	var $lastThis;
	var i=0;
	var imgsArray = new Array();

	function _bodyClickFn(e){ // body click func
		if (!$lp.is(e.target) && $lp.has(e.target).length === 0){
			//leaveAct();
		  	commonUI.bodyClickOffFunc( "d_listProduct" );
		}
	}
	commonUI.bodyClickFunc( "d_listProduct" , _bodyClickFn );

	function _destory(){
		$lpItem.off("mouseenter mouseleave");
		$lpItem.off("focus","a");
		$lpItem.off("mouseenter","a.opt03");
	}

	if ( opt && opt.destroy) {
		_destory();
	}

	init();

	function init(){
		var $this = $(this);

		if ( $this.is("[class*='d_soldout']") ) return;

		imgsrcInit();
		eventInit();
	}

	function imgsrcInit(){
		$lpItem.each(function(){
			var $this = $(this);
			var $Links = $this.find(".links");

			if ( $Links.attr("data-imgsrc") != undefined ) {
				var _vals = {
					$imgTarget : $this.find(".thumb img").not($(".flag img")) //NGCPO-7172 플래그 호버효과 미적용
					,past : $Links.data("imgsrc")
					,now : $Links.find(".thumb img").attr("src")
					,chksImgs : true
				}
			}else{
				var _vals = {
					chksImgs : false
				}
			}
			imgsArray.push(_vals)
		})
	}

	function eventInit(){
		$lpItem.hover(function(e){
			var $this = $(this);
			enterAct($this);
			e.preventDefault();
		},function(e){
			leaveAct();

			e.preventDefault();
		})

		$lpItem.on("focus","a",function(e){
			if ( $lastThis != undefined ) {
				if ( $lastThis[0] != $(this).parents("li")[0] ) leaveAct();
			}

			var $this = $(this).parents("li");

			if ( e.target.className == "opt03" ) {
				show_opt($this);
				enterAct($this);
			}else{
				enterAct($this);
			};
			commonUI.bodyClickOnFunc("d_listProduct");

			e.preventDefault();
		})

		$lpItem.on("mouseenter" , 'a.opt03' , function(e){
			var $this = $(this).parents("li");
			show_opt($this);

			e.preventDefault();
		})
		$lpItem.on("mouseover" , 'div.box_opt_link>a[class!=opt03]' , function(e){	/*마우스커서가 다른 버튼으로 옯겨 갔을때 옵션리스트 숨기기 벗어날 때 없어지도록 추가 - 160810 - 이태영*/
			var $this = $(this).parents("li");
			hide_opt($this);

			e.preventDefault();
		})
	}

	function enterAct( $target ){
		var idx = $lpItem.index($target);
		$target.addClass("over");
		if ( imgsArray[idx].chksImgs ) imgsArray[idx].$imgTarget.attr({"src":imgsArray[idx].past});

		$lastThis = $target;
	}

	function leaveAct(){
		var idx = $lpItem.index($lastThis);
		$lastThis.removeClass("over");
		if ( imgsArray[idx].chksImgs ) imgsArray[idx].$imgTarget.attr({"src":imgsArray[idx].now});
		hide_opt( $lastThis );
	}

	function show_opt( $target ){
		$target.find(".opt03").addClass("on");
		$target.find(".lay_lp_opt").addClass("lay_lp_on");
		$target.find('.scroll').attr('tabindex','0');
	}

	function hide_opt( $target ){
		$target.find(".opt03").removeClass("on");
		$target.find(".lay_lp_opt").removeClass("lay_lp_on");
		$target.find('.scroll').attr('tabindex','-1');
	}

}
/* //160201 수정 */

commonUI.view.navCate = function() {
	var $lnbCateWrap = '';
	var $depth1 = '';
	var $depth1_link = '';
	var currentIDX=null;

	function init() {
		$lnbCateWrap = $('.lnb_cate01 > ul');// 좌측메뉴
		if ( commonUI.isTarget($lnbCateWrap) ) return;

		$depth1 = $lnbCateWrap.find('> li');// 1depth1
		$depth1_link =$depth1.find('> a');// 1depth link
		$depthEnd = $lnbCateWrap.find('a').last();
		//$depth2 = $lnbCateWrap.find('.depth2 li a:last-child');
		initEvtL();
	}

	function initEvtL() {
		$depth1.on('mouseenter', function() {
			var idx = $depth1.index($(this));
			if(currentIDX!=null) {
				depth1Off(currentIDX);
			}
			depth1On(idx);
		});

		$lnbCateWrap.on('mouseleave',function() {
			depth1Off(currentIDX);
		});

		$depth1_link.on('focus',function() {
			var idx = $depth1.index($(this).parent('li'));
			if ( !$depth1.eq(currentIDX).hasClass('on') ) commonUI.bodyClickOnFunc( "d_navCate" );
			if(currentIDX!=null) {
				depth1Off(currentIDX);
			}
			depth1On(idx);
		});

		function _bodyClickFn(e){ // body click func
			if (!$lnbCateWrap.is(e.target) && $lnbCateWrap.has(e.target).length === 0){
			  	commonUI.bodyClickOffFunc( "d_navCate" );
				depth1Off(currentIDX);
			}
		}

		commonUI.bodyClickFunc( "d_navCate" , _bodyClickFn );
	}

	function depth1On(idx) {
		$depth1.eq(idx).addClass('on');
		currentIDX = idx;
	}

	function depth1Off(idx) {
		$depth1.eq(idx).removeClass('on');
	}

	init();
}

commonUI.view.NavCommonCate = function(id) {
	this.init(id);
}
commonUI.view.NavCommonCate.prototype = {
	init : function(id) {

		this.$lnbCateWrap = $(id).find('> ul');// 부모메뉴
		if ( commonUI.isTarget(this.$lnbCateWrap) ) return;

		this.$depth1 = this.$lnbCateWrap.find('> li');// 1depth1
		this.$depth1_link = this.$depth1.find('> a');// 1depth link
		this.$depthEnd = this.$lnbCateWrap.find('a').last();
		this.currentIDX=null;
		this.initEvtL();
	},

	initEvtL : function() {
		var that = this;
		this.$depth1.on('mouseenter', function() {
			var idx = that.$depth1.index($(this));
			if(that.currentIDX!=null) {
				that.depth1Off(that.currentIDX);
			}
			that.depth1On(idx);
		});

		this.$lnbCateWrap.on('mouseleave',function() {
			that.depth1Off(that.currentIDX);
		});

		this.$depth1_link.on('focus',function() {
			if ( !that.$depth1.eq(that.currentIDX).hasClass('on') ) commonUI.bodyClickOnFunc( "d_NavCommonCate" );
			var idx = that.$depth1.index($(this).parent('li'));
			if(that.currentIDX!=null) {
				that.depth1Off(that.currentIDX);
			}
			that.depth1On(idx);
		});

		function _bodyClickFn(e){ // body click func
			if (!that.$lnbCateWrap.is(e.target) && that.$lnbCateWrap.has(e.target).length === 0){
			  	commonUI.bodyClickOffFunc( "d_NavCommonCate" );
				that.depth1Off(that.currentIDX);
			}
		}

		commonUI.bodyClickFunc( "d_NavCommonCate" , _bodyClickFn );
	},
	depth1On : function(idx) {
		this.$depth1.eq(idx).addClass('on');
		this.currentIDX = idx;
	},
	depth1Off : function(idx) {
		this.$depth1.eq(idx).removeClass('on');
	}
}

commonUI.view.depth1Slider01Func = function(){
	var depth1Slider01_i = new commonUI.view.depth1Slider01();
}

commonUI.view.depth1Slider01 = function($multi){ this.init($multi); }

commonUI.view.depth1Slider01.prototype = {
	init : function($multi){
		if($multi){
			this.$target = $multi;
		}
		else{this.$target = $(".d_promo_container");}

		if ( commonUI.isTarget( this.$target ) ) return;	

		this.$tabSlide = false;
		this.$wrapper = this.$target.find(".d_bnr_cont");
		this.$lis = this.$wrapper.find("li");
		this.$lis.eq(0).css({
			'z-index':2 ,
			'opacity':0.9999,
			'filter':"alpha(opacity=99.9)"
		})
		this.$lis_length = this.$lis.size();
		this.$indicator = this.$target.find(".d_indi");
		this.$indi_links = this.$indicator.find("a"); /* 160415_추가 */
		this.$btns = {
			left : this.$target.find("._d_left")
			,right : this.$target.find("._d_right")
			,wrapper : this.$target.find(".d_auto")
			,play : this.$target.find(".d_play")
			,stop : this.$target.find(".d_stop")
		}
/* 160415_추가 */		
		if(this.$lis_length <= 1) {
			this.$btns.left.hide();
			this.$btns.right.hide();
			this.$btns.play.hide();
			this.$btns.stop.hide();
			this.$indicator.hide();
			return;
		}
/* //160415_추가 */		
		this.autostatus = true;
		this.autoplay = true;
		this.autoDelay = 3000;
		this.intervals;

		this.duration = 700;
		this.effect = "easeOutQuart";
		this._lastIdx = 0;

		this._idx = 0;
		if(this.$target.parent().parent().hasClass('tab_slide')){
			this.$tabSlide = $multi.parent().parent();
			this.$tabPg = this.$tabSlide.find('.brand_tab').find('a');
			var that = this
			this.$tabPg.click(function(){
				var _idx = $(this).parent().index();
				that._idx = _idx;
				that.idxHandler(_idx);
				that._lastIdx = _idx;
			});
		}
		this.cssSet();
		this.eventInit();
		this.setAuto();
		this.txtPaging();
	}
	,eventInit : function(){
		var that = this;

		this.$indicator.on("click","a",function(e){
			var _idx = $(this).parent().index();
			that.idxHandler(_idx);

			e.preventDefault();
		});

		this.$target.on("focus","a,button",function(e){
			that.autoplay = false;
			that.setAuto();
		})

		this.$target.on("blur","a,button",function(e){
			that.autoplay = true;
			that.setAuto();
		})

		this.$target.on("mouseenter",function(e){
			that.autoplay = false;
			that.setAuto();

			e.preventDefault();
		})

		this.$target.on("mouseleave",function(e){
			that.autoplay = true;
			that.setAuto();

			e.preventDefault();
		})


		if (this.$btns.right.length > 0) {
			this.$btns.right.on("click",function(e){
				that.idxNext();

				e.preventDefault();
			})
		}

		if (this.$btns.left.length > 0) {
			this.$btns.left.on("click",function(e){
				that.idxPrev();

				e.preventDefault();
			})
		};

		this.$btns.play.on("click",function(e){
			that.autostatus = true;
			that.$btns.wrapper.removeClass("ons");
			that.$btns.stop.focus();

			e.preventDefault();
		})

		this.$btns.stop.on("click",function(e){
			that.autostatus = false;
			that.$btns.wrapper.addClass("ons");
			that.$btns.play.focus();

			e.preventDefault();
		})

	}

	,setAuto : function(){
		var that = this;

		clearInterval(this.intervals);
		if ( this.autostatus && this.autoplay ) {
			clearInterval(this.intervals);
			this.intervals = setInterval(function(){
				that.idxNext();
			},this.autoDelay);
		}
	}

	,cssSet : function(){
		this._onCss = { "zIndex" : "2", "width" : "auto", "height" : "auto" }
		this._offCss = { "zIndex" : "", "width" : "0", "height" : "0" }
		this._aniOnCss = { "filter":"alpha(opacity=99.9)","opacity" : "0.9999" }
		this._aniOffCss = { "filter":"alpha(opacity=0)","opacity" : "0" }

		this.$lis.find("a").css({
			position: 'relative'
		});
	}

	,idxPrev : function(){
		this._idx = (this._idx < 1) ? this.$lis.length-1 : this._idx-1 ;

		this.engine();
		this.txtPaging();
		this.indicatorHandler();
		this._lastIdx = this._idx;
	}

	,idxNext : function(){
		this._idx = ( this._idx > this.$lis.length-2 ) ? 0 : this._idx+1 ;

		this.engine();
		this.txtPaging();
		this.indicatorHandler();
		this._lastIdx = this._idx;
	}

	,idxHandler : function( vals ){
		this._idx = vals;
		if ( this._idx == this._lastIdx ) return;
		if ( this.$wrapper.is(":animated") ) return;

		this.engine();
		this.txtPaging();
		this.indicatorHandler();
		this._lastIdx = this._idx;
	}

	,indicatorHandler : function(){
		var $this = this.$indi_links.eq(this._idx);
		var $last = this.$indi_links.eq(this._lastIdx);
		if(this.$tabSlide){
			var $this_tab = this.$tabPg.eq(this._idx).parent();
			var $last_tab = this.$tabPg.eq(this._lastIdx).parent();
			$last_tab.removeClass("on");
			$this_tab.addClass("on");
		}

		$last.removeClass("on");
		$this.addClass("on");
	}

	,engine : function(){
		var that = this;

		var $this = this.$lis.eq(this._idx);
		$this.stop().css(this._onCss).animate( this._aniOnCss , this.duration , this.effect );

		var $last = this.$lis.eq(this._lastIdx);
		$last.stop().css(this._offCss).animate( this._aniOffCss , this.duration/2 , this.effect );
	}
	,txtPaging : function(){
		if(this.$target.has('.page')){
			this.$target.find('.page').html('<em>'+(this._idx+1)+'</em> / ' + this.$lis_length);
		}
	}
}




commonUI.view.bannerMore = function($id , limitCount) {
	var $bannerWrap = '';
	var $moreBtn = '';
	var limitCounts = 0;
	var $bannerItem = '';
	var $bannerItemLength = 0;
	var _isOpen='';
	function init($id,limitCount) {
		$bannerWrap = $($id);
		$moreBtn = $bannerWrap.find('.btn_cont_all');
		limitCounts = limitCount;
		$bannerItem = $bannerWrap.find('li');
		$bannerItemLength = $bannerItem.length;
		_isOpen = false;
		setLimitController();
	}

	function setLimitController() {
		if($bannerItemLength > limitCounts) {
			$moreBtn.show();
			iniEvtL();
		} else {
			$moreBtn.hide();
		}
	}

	function iniEvtL() {
		$moreBtn.on('click',function() {
			if(_isOpen) {
				moredActive();
				return false;
			}
			moreActive();
			return false;
		});
	}

	function moreActive() {
		$bannerWrap.addClass('more_cont');
		$moreBtn.addClass('active');
		_isOpen = true;
	}

	function moredActive() {
		$bannerWrap.removeClass('more_cont');
		$moreBtn.removeClass('active');
		_isOpen = false;
	}

	init($id , limitCount);
}

commonUI.view.wideLayout = function() {
	var $isWide = $('#content.layout_wide');
	if ( commonUI.isTarget( $isWide ) ) return;
	var $content = $('#wrapper').css('overflow','hidden');
	//if(isWide.length < 1)
}

commonUI.view.searchFilter = function() {
	var $searchFilter = '';
	var $sfList = '';
	var $sfLink = '';
	function init() {
		$searchFilter = $('.set_list_filter');
		$sfList = $searchFilter.find('> ul > li');
		$sfList.addClass('active');
		$sfLink = $sfList.find('> a');
		initEvtL();
	}

	function initEvtL() {
		$sfLink.on('click',function(e) {
			var idx = $sfList.index($(this).parent('li'));
			if($sfList.eq(idx).hasClass('active')) {
				closeDepth(idx);
			} else {
				openDepth(idx);
			}
			return false;
		});
	}
	function closeDepth(idx) {
		$sfList.eq(idx).removeClass('active');
	}

	function openDepth(idx) {
		$sfList.eq(idx).addClass('active');
	}
	init();
}

commonUI.view.qnaTable = function(){
	var $target = $(".d_qnaTable");

	if ( commonUI.isTarget($target) ) return ;

	var $trs = $target.find(".d_qna_cont");

	var $openLinks = $target.find(".d_qnaOpen");
	var $closeLinks = $target.find(".rv_up");

	var $lastTarget = null;

	$openLinks.on( "click" , function(e){
		var $this = $(this);

		if ( $this.parents("tr").next(".d_qna_cont").hasClass("on") ){
			$this.parents("tr").next(".d_qna_cont").removeClass("on");
		}else{
			$target.find(".d_qna_cont[class*=' on']").removeClass("on");
			$this.parents("tr").next(".d_qna_cont").addClass("on");
		}

		$this.focus();

		e.preventDefault();
	})

	if ( commonUI.isTarget( $closeLinks ) ) return;

	$closeLinks.on( "click" , function(e){
		var $this = $(this);

		$this.parents("tr").prev().find(".d_qnaOpen").focus();
		$this.parents("tr").removeClass("on");

		e.preventDefault();
	})
}

commonUI.view.reviewTable = function(){
	var $target = $(".d_rvTable");

	if ( commonUI.isTarget($target) ) return ;

	var $trs = $target.find("tr");

	$trs.on("click",".rv_down , .rv_up",function(e){
		var $this = $(e.currentTarget);
		var $paTr = $this.parents("tr");
		if ( $this.hasClass("rv_down") ) {
			$paTr.addClass("on");
			//$paTr.find(".rv_up").focus();  올바른 동작이 아님으로 삭제
		}else{
			$paTr.removeClass("on");
			$paTr.find(".rv_down").focus();
		}
		e.preventDefault();
	})
}

commonUI.view.VerticalListMenu = function(id) {
	var that = this;
	this.init(id);

	return {
		moveIndex : function(_idx) {
			var idx = _idx
			that.moveInit(idx);
		}
	}
}

commonUI.view.VerticalListMenu.prototype = {
	init : function(id) {
		var that = this;
		that.initSetting(id);
	},
/* 160129 */
	initSetting : function(id) {
		var that = this;
		this.$id = $(id);
		this.targetIDX = 0; //리스트 타겟 index
		this.TIMER = 300;
		this.$container = this.$id.find('.box_hidden');//히든된 박스
		this.contWidth = this.$container.width(); //히든된박스너비
		this.$absolul = this.$container.find('ul');//이벤트 걸릴
		this.$btnPrev = this.$id.find('.d_prev');//이전 이동 버튼
		this.$btnNext = this.$id.find('.d_next');//다음 이동 버튼
		this.moveRange = parseInt(this.contWidth/2); //이동할 포지션
		this.$listItem = this.$container.find('li');
		this.$listlink = this.$listItem.find('a');
		this.currentPosit = 0;//현재포지션위치값
		this.itemsWidth = 0;//리스트아이템들을 합한 너비
		this._isEnd = false;//리스트 마지막일 경우 체크
		this._isDacitve = false;//리스트 너비가 작을경우 버튼 비활성화
		this.$listItem.each(function() {
			that.itemsWidth+= parseFloat(window.getComputedStyle($(this).get(0)).width);
		});

		if(this.itemsWidth < this.contWidth) {
			this._isDacitve = true;
			this.buttonState();
			this.initEvtLinks();
			return false;
		}
		this.$absolul.width(this.itemsWidth+2);
		this.initEvtL();
	},

	initEvtL : function() {
		var that = this;
		this.$btnPrev.on('click',function(e) {
			if(!that.$absolul.is(':animated')) {
				that.movePrev();
			}
			e.preventDefault();
		});

		this.$btnNext.on('click',function(e) {
			if(!that.$absolul.is(':animated')) {
				that.moveNext();
			}
			e.preventDefault();
		});
		this.initEvtLinks();
	},

	initEvtLinks : function(){
		var that = this;
		this.$listlink.on('click',function(e) {
			e.preventDefault();
			var idx = that.$listItem.index($(this).parent('li'));
			that.moveInit( idx );
		});
	},
/* //160129 */
	moveNext : function() {
		var that = this;

		var mrange = this.moveEngineSet( this.moveRange );

		this.moveEngine( mrange );
	},

	moveEngineSet : function( movePoint ){
		var _currentPosit = Math.abs(this.$absolul.position().left);
		var _movePoint = movePoint;

		var mrange= _currentPosit + _movePoint;

		mrange = this.moveLimitChk(mrange);

		return mrange;
	},

	moveLimitChk : function( mrange ){
		if ( this.itemsWidth-this.contWidth-mrange < 0 ) { // 끝
			mrange=(this.itemsWidth-this.contWidth);
			this._isEnd = true;
		}

		if(mrange <= 0) { // 처음
			mrange=0;
		}
		return mrange;
	},

	movePrev : function() {
		var that = this;

		var mrange = this.moveEngineSet( -this.moveRange );

		this.moveEngine( mrange );
	},

	moveInit : function( targetIDX ){
		var $target = this.$listItem.eq(targetIDX);
		var mrange= $target.position().left-this.moveRange;
		mrange = this.moveLimitChk( mrange )

		this.moveEngine( mrange );
		this.itemOnChk(targetIDX);
	},

	itemOnChk : function(idx) {
		this.$listItem.removeClass('on');
		this.$listItem.eq(idx).addClass('on');
	},

	moveEngine : function( mrange ){
		var that = this;
		this.$absolul.animate({
			'left' : mrange*-1
		},this.TIMER,function() {
			that.buttonState();
		});
		this.currentPosit = mrange;
	},

	buttonState : function() {
		if(this._isDacitve) {
			this.$btnNext.removeClass('active');
			this.$btnPrev.removeClass('active');
			return false;
		}
		if(this.currentPosit == 0) {
			this.$btnNext.addClass('active');
			this.$btnPrev.removeClass('active');
		} else {
			if(this._isEnd) {
				this.$btnNext.removeClass('active');
				this.$btnPrev.addClass('active');
				this._isEnd=false;
				return;
			}
			this.$btnNext.addClass('active');
			this.$btnPrev.addClass('active');
		}
	}
}

commonUI.view.dimmOn = function(){
	$("#container").append('<div id="temp_dimm" class="lp_dimm"></div>');
}

commonUI.view.dimmOff = function(){
	$("#temp_dimm").remove();
}

commonUI.bodyClickFunc = function( className , Func ){
	function _inFunc(e){
		Func(e);
	}
	$(document).on("click focusin", "."+className , _inFunc);
}

commonUI.bodyClickOnFunc = function( className ){
	// console.log("bodyClickOnFunc : " + className)
	setTimeout(function(){
		$("#wrapper").addClass(className);
	},10)
}

commonUI.bodyClickOffFunc = function( className ){
	// console.log("bodyClickOffFunc : " + className)
	$("#wrapper").removeClass(className);
}

/* 160408_추가 */
commonUI.view.fmSelFunc = function() {
	var $fm_wrap = $('.fm_links');
	var $fm_sel_link = $fm_wrap.find('.btn_fm_site');
	var $list_fm_site = $fm_wrap.find('.list_fm_site');
	if(commonUI.isTarget($fm_wrap)) return;
	function _bodyClickFn(e){ // body click func
		var $wrapper = $fm_wrap;
		if (!$wrapper.is(e.target) && $wrapper.has(e.target).length < 1){
			$list_fm_site.removeClass('active');
			commonUI.bodyClickOffFunc( "d_fm_sel" );
			e.preventDefault();
		}
	}
	commonUI.bodyClickFunc( "d_fm_sel" , _bodyClickFn );
	
	$fm_sel_link.on('click',function(e) {
		$list_fm_site.toggleClass('active');
		commonUI.bodyClickOnFunc( "d_fm_sel" );
		e.preventDefault();
	});

}
//MAIN TYPE
$(document).ready(function(){
	if($('ul').hasClass('TYPE')){
		Type_callList();
		Type_callSlide();
	}
	if($('ul').hasClass('brand_tab')){
		$('.brand_tab:not(.center)').each(function(){
			var bt = $(this).find('li');
			var total = bt.length;
			bt.css({'width':''+ 100/total +'%'})
			if($('#wrapper').hasClass('kinder')){
				$(this).find('li:last').addClass('last')
			}
		})	
		if($('div').hasClass('nb_kids')){
			$('.brand_tab').find('a').wrapInner('<span></span>')
		}
	}	
	if($('div').hasClass('brd_tab_swiper')){GroupSlide()} 
	if($('div').hasClass('list_product02')){fn_list02()} 

})

function fn_list02(){
	$('.list_product02').find('.cont').each(function(){
		if($(this).find('div').hasClass('prd_chip')){
			$(this).find('.prod_nm').css('padding-bottom','33px');
		}
	})	
}
function Type_callList(idx){
	var TP;
	var WP;
	if(typeof idx !== 'undefined'){
		WP = $('#'+ idx);
		TP = WP.find('.TYPE');
	}else{
		WP = $('body');
		TP = WP.find('.TYPE')
	}
	if(TP.hasClass('A01') || TP.hasClass('C01')){ //TYPE_A01 , TYPE_C01
		WP.find('.A01, .C01').find('li:nth-child(4n+1)').each(function(){
			if($(this).index() > 3){ $(this).addClass('ln')}
		})	
	}
	if(TP.hasClass('A02') || TP.hasClass('C02')){ //TYPE_A02 , TYPE_C02
		WP.find('.A02, .C02').find('li:first').addClass('big').prepend('<span class="bst">BEST STYLE</span>');
		WP.find('.A02, .C02').find('.rm').each(function(){
			var wm_er = $(this).next('.wm').find('.er')
			$(this).insertAfter(wm_er);
		})	
	}
	if(TP.hasClass('A03') || TP.hasClass('C03')){ //TYPE_A03 , TYPE_C03
		WP.find('.A03, .C03').find('li:nth-child(1)').addClass('big');
		WP.find('.A03, .C03').find('li:nth-child(n+5)').addClass('prt');
	}
	if(TP.hasClass('A04') || TP.hasClass('C04')){ //TYPE_A04 , TYPE_C04
		WP.find('.A04, .C04').find('li').addClass('circle');
		WP.find('.A04, .C04').find('.circle').each(function(){
			$(this).find('.img').prepend('<span class="mask"></span>');
		})
	}
}
function Type_callSlide(){
	var TP = $('.TYPE');
	if(TP.hasClass('B01')){$('.B01').find('li:nth-child(even)').find('a').addClass('even');createSlide('B01',4);}
	if(TP.hasClass('B02')){createSlide('B02',4)}
	if(TP.hasClass('B03')){createSlide('B03',5)}
	if(TP.hasClass('B04')){b04mask();createSlide('B04',3)}
	if(TP.hasClass('permanent')){createSlide('permanent',5)}
}
function ax_Type_callSlide(idx){
	var TP = $('#'+ idx).find('.TYPE');
	var brd_Class = (TP.attr('class')).substring(5);
	if($.inArray(brd_Class, ['A01','A02','A03','A04','B01','B02','B03','B04']) >= 0){Type_callList(idx)}
	if(TP.hasClass('B01')){$('.B01').find('li:nth-child(even)').find('a').addClass('even');ax_createSlide(idx,'B01',4);}
	if(TP.hasClass('B02')){ax_createSlide(idx,'B02',4)}
	if(TP.hasClass('B03')){ax_createSlide(idx,'B03',5)}
	if(TP.hasClass('B04')){b04mask();ax_createSlide(idx,'B04',3)}
	// if(TP.hasClass('permanent')){ax_createSlide(idx,'permanent',5)}
}

function b04mask(){
	$('.B04').find('.img').each(function(){
		$(this).prepend('<span class="mask"></span>');
	})
}
function create_type_swiper(type, tp_id, tp_view, tp_loop){
	var type_bn = $('#'+tp_id).parent();
	if (type=="permanent"){
		type_bn.append('<div class="'+type+'_btn bw"><a href="#" class="bn-left">이전 배너 보기</a><a href="#" class="bn-right">다음 배너 보기</a></div>')
		var options = {
			createPagination: false,
			slidesPerView: 5,
			slidesPerGroup: 1,
			loop: false,
			// autoplay : 3000,
			autoplay: false,
			speed : 500
		};
		var tp_id = new Swiper('#'+tp_id,options);
		type_bn.find('.bn-left').on('click', function(e){
			e.preventDefault();
			var $firstL = type_bn.find('.swiper-slide:eq(0)')[0];
			var $firstV = type_bn.find('.swiper-slide-visible:eq(0)')[0];
			if($firstL === $firstV){
				$('.perm_tab li.on').prev('li').length ?  $('.perm_tab li.on').prev('li').find('a')[0].onclick() : true;
			}else{
				tp_id.swipePrev();
			}
		})
		type_bn.find('.bn-right').on('click', function(e){
			e.preventDefault();
			var $lastL = type_bn.find('.swiper-slide:last-child')[0];
			var $lastV = type_bn.find('.swiper-slide-visible:eq(4)')[0];
			var lenChild = type_bn.find('.swiper-slide-visible').length;
			if($lastL === $lastV || lenChild <5){
				$('.perm_tab li.on').next('li').length ?  $('.perm_tab li.on').next('li').find('a')[0].onclick() : true;
				// alert('다음 탭으로')
			}else{
				tp_id.swipeNext();
			}
		})
		type_bn.find('.swiper-slide-duplicate a').attr('tabindex','-1');
	}
	else{
		if($('#'+tp_id+' li').length >= tp_view ){
			type_bn.append('<div class="'+type+'_btn bw"><a href="#" class="bn-left">이전 배너 보기</a><a href="#" class="bn-right">다음 배너 보기</a></div>')
			var options = {
				createPagination: false,
				slidesPerView: tp_view,
				slidesPerGroup: 1,
				loop: tp_loop
			};
			if ($('#wrapper.ost').length || type=="B01"){
				options = {
					createPagination: false,
					slidesPerView: tp_view,
					slidesPerGroup: 4,
					loop: tp_loop,
					autoplay : 3000,
					speed : 500
				};
				$('#'+tp_id).hover(
					function (e) { //mouseenter
						tp_id.stopAutoplay();
						e.preventDefault();
					},
					function (e) { //mouseleave
						tp_id.startAutoplay();
						e.preventDefault();
					}
				);
			}
				var tp_id = new Swiper('#'+tp_id,options);
				type_bn.find('.bn-left').on('click', function(e){
					e.preventDefault();tp_id.swipePrev();
				})
				type_bn.find('.bn-right').on('click', function(e){
					e.preventDefault();tp_id.swipeNext();
				})
				type_bn.find('.swiper-slide-duplicate a').attr('tabindex','-1');

		}
	}
}
function createSlide(type, num){
	$('.'+type).wrap('<div class="bn_'+type+'" />').addClass('swiper-wrapper');
	$('.'+type).find('li').addClass('swiper-slide');
	var bnw = 0;
	var bns = $('.bn_'+type);
	for (var k=0; k<bns.length; k++){
		bns.eq(k).attr('id','bn_'+type+'_'+bnw);
		create_type_swiper(type, 'bn_'+type+'_'+ bnw, num, true)
		bnw= bnw +1;
	}
}
function ax_createSlide(idx, type, num){
	var bnw = $('body').find('.swiper-wrapper').length;
	$('#'+idx).find('.'+type).wrap('<div class="bn_'+type+'" />').addClass('swiper-wrapper');
	$('#'+idx).find('.'+type).find('li').addClass('swiper-slide');
	$('#'+idx).find('.bn_'+type).attr('id','bn_'+type+'_'+bnw);
	create_type_swiper(type, 'bn_'+type+'_'+ bnw, num, true)
}
function GroupSlide(){
	var bnw = 0;
	var bns = $('.brd_tab_swiper');
	for (var k=0; k<bns.length; k++){
		bns.eq(k).attr('id','brd_group'+bnw);
		create_group_swiper('brd_group'+bnw);
		bnw= bnw +1;
	}
}
function ax_GroupSlide(idx){
	var bnw = $('body').find('.brd_tab_swiper').length;
	var bns = $('#'+idx).find('.brd_tab_swiper');
	bns.attr('id','brd_group'+bnw);
	create_group_swiper('brd_group'+bnw);
}
function create_group_swiper(gp_id){
	var gp_bn = $('#'+gp_id);
	var gp_heigth = gp_bn.find('.TYPE').outerHeight(true);
	gp_bn.parent().find('.page').addClass(gp_id+'pg');
	var pg_class = gp_id+'pg';

	var gp_id = new Swiper('#'+gp_id,{
		 createPagination: false,
		 paginationClickable:true,
		 pagination: '.'+pg_class,
		 calculateHeight:true,
		 loop: true
	});
	gp_bn.find('.bn-left').on('click', function(e){
		e.preventDefault();gp_id.swipePrev();
	})
	gp_bn.find('.bn-right').on('click', function(e){
		e.preventDefault();gp_id.swipeNext();
	})
	//gp_bn.css({'height':gp_heigth+'px'});
	//gp_bn.find('.swiper-wrapper').css({'height':gp_heigth+'px'});
}
$(document).ready(function(){ // category menu over 16
	if($('div').hasClass('lnb_cate01') && !($('div').hasClass('new_cate_wrap'))){
		ctg_more_add()
	}
	if($('div').hasClass('lnb_cate01') && ($('div').hasClass('new_cate_wrap'))){
		ctg_more_add_new()
	}
})
$(window).load(function(){
	if($('ul').hasClass('sns_instagram')){
	setTimeout(function(){
		insta_lineup();
	},1800)
	}
})
function ctg_more_add(){
	$('.lnb_cate01').each(function(){
		var ctg_bx = $(this);
		var lis = ctg_bx.find('li').length - ctg_bx.find('.depth2').find('li').length;
		if(lis > 10){ // 카테고리가 11개 이상일경우 클래스 추가
			$(this).addClass('item10more');
		}
		//170713 폴더몰 제외하고 카테고리 11개이상일때 더보기 버튼 노출함
		if($('#wrapper').hasClass('folder')){
			if(lis > 16){
				ctg_bx.css({'padding':'0','border':'none','min-height':'550px'})
				ctg_bx.find('ul:first').wrap('<div class="over_bx" />');
				ctg_bx.find('.over_bx > ul > li:gt(15)').addClass('ad');
				ctg_bx.find('.over_bx').append(
					'<div class="ctg_more_bt"><button type="button" class="pls"><em>더보기</em></button><button type="button" class="mns"><em>닫기</em></button></div>'
				);
				ctg_bx.find('.over_bx').find('button').on('click', function(){
					var box = ctg_bx.find('.over_bx');
					if(box.hasClass('active')){
						box.removeClass('active');
					}else{
						box.addClass('active');
					}
				})
			}
		}else{
			if(lis > 12){
				if($(ctg_bx).hasClass('wf')){
					ctg_bx.css({'padding':'0','border':'none','min-height':'none'});
				}
				else{
					ctg_bx.css({'padding':'0','border':'none','min-height':'550px'});
				}
				ctg_bx.find('ul:first').wrap('<div class="over_bx" />');
				ctg_bx.find('.over_bx > ul > li:gt(11)').addClass('ad');
				ctg_bx.find('.over_bx').append(
					'<div class="ctg_more_bt"><button type="button" class="pls"><em>더보기</em></button><button type="button" class="mns"><em>닫기</em></button></div>'
				);
				ctg_bx.find('.over_bx').find('button').on('click', function(){
					var box = ctg_bx.find('.over_bx');
					if(box.hasClass('active')){
						box.removeClass('active');
					}else{
						box.addClass('active');
					}
				})
			}
		}
	})
}
function ctg_more_add_new(){
	$('.lnb_cate01').each(function(){
		var ctg_bx = $(this);
		var lis = ctg_bx.find('li').length - ctg_bx.find('.depth2').find('li').length;
		if(lis > 12){ // 카테고리가 12개 이상일경우 클래스 추가
			$(this).addClass('overHeight');
		}
		$('.li_btn').click(function(){
			ctg_bx.toggleClass('open');
		})
	})
}
function insta_lineup(){
	var wrap = $('.sns_instagram');
	wrap.find('li').each(function(){
		var li_w = $(this).width();
		var li_h = $(this).height();
		var img = $(this).find('img');
		var img_rto = img.height()/img.width();
		if(1 < img_rto){
			img.css({'width':'100%','height':'auto'})
			img.css({'top':'-'+ (img.height()-li_h)/2 + 'px'})
		}
		if(1 > img_rto){
			img.css({'width':'auto','height':'100%'})
			img.css({'left':'-'+ (img.width()-li_w)/2 + 'px'})
		}
		if(img_rto == 1){										/* 160822 정사각이미지일때 리사이징 조건 추가 - 이태영*/
			img.css({'width':+li_w+'px','height':+li_h+'px'})
		}
	})
}

$(document).ready(function(){
	location_slt()
	list_chkbox()
	list_chkbox_chg()
	lnb_depth_size()
})
function lnb_depth_size(){
	$('#cateMainLnb').find('.depth2').each(function(){
		if(!$(this).find('div').hasClass('lb03')){
			$(this).css('width','421px');
		}
		if(!$(this).find('div').hasClass('lb03') && !$(this).find('div').hasClass('lb02')){
			$(this).css('width','210px');
		}
	})
}
function location_slt(){
	if($('div').hasClass('location')){
		$('.location').find('select').each(function(){
			var txt = $(this).find('option:selected').text().length;
			$(this).css('width',(13*txt)+37+'px')
			
		})
	}
}
function list_chkbox(){
	$('.list_chkbox').find('input[type="checkbox"]').each(function(){
		if(this.checked){
			$(this).attr('checked', true);$(this).next('span').addClass('chk');
		}else{
			$(this).attr('checked', false);$(this).next('span').removeClass('chk');
		}
	})
}
function list_chkbox_chg(){
	$('.list_chkbox').find('input[type="checkbox"]').each(function(){
		$(this).change(function(){
			if(this.checked){
				$(this).attr('checked', true);$(this).next('span').addClass('chk');
			}else{
				$(this).attr('checked', false);$(this).next('span').removeClass('chk');
			}
		})
	})
}

function square_lineup(slector){
	$(slector).each(function(){
		var li_w = $(this).width();
		var li_h = $(this).height();
		var img = $(this).find('img');
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
	})
}
function rectangle_lineup(slector){
	$(slector).each(function(){
		var li_w = $(this).width();
		var li_h = $(this).height();
		var img = $(this).find('img');
		var img_rto = img.height()/img.width();
		if(1 > img_rto){
			img.css({'width':'100%','height':'auto'})
		}
		if(1 <= img_rto){
			img.css({'width':'auto','height':'100%'})
		}
	})
}

function DK_dim_Open(targetId, bt_id) {

	var width = $("#"+targetId).width();
	var height = $("#"+targetId).outerHeight(true);
	var margin_left =  -(width/2);
	var top_pos = 0;

	if($('.dk_dimm').length == 0){ // 중복 노츨 방지.
		$("body").append('<div class="dk_dimm" id="dk_dimm"></div>');
	}
	$("#"+targetId).show();

	$('#'+targetId).css({
		position:'absolute',
		top: $(window).height() > height ?  $(window).scrollTop() + Math.abs(($(window).height() - height) /2) + 'px' : $(window).scrollTop() + 'px',
		left: $(window).width() > width ? "50%" : 0,
		marginLeft: $(window).width() > width ? margin_left + "px" : 0,
		zIndex: '6000'
	});
	if( targetId == 'review_layer'){rectangle_lineup('#review_bn_big .swiper-slide'); /*rvHeight(); 존재 하지 않는 함수*/}
	$("#"+bt_id).addClass('active_DKUI');
	return false;
}
function DK_dim_Close(targetId) {
	var active_bt = $('body').find('.active_DKUI').attr('id');
	//$("#"+active_bt).focus(); /*2018.09.20 포토상품평 상세레이어 닫을 경우 포토상품평의 포커스를 이동시켜서 주석처리*/
	$("#"+targetId).hide();
	$('#dk_dimm').remove();
	$('body').find('.active_DKUI').removeClass('active_DKUI');
	return false;
}

function fn_temp_tooltip(){
	var wrap = $('.temp_tooltip')
	wrap.find('li dl').each(function(){
		var w = $(this).parents('.temp_tooltip:first').find('.bg img').width();
		var h =  $(this).parents('.temp_tooltip:first').find('.bg img').height();
		var bt = $(this).parent('li:first').find('.open');
		var bt_lf = parseInt(bt.css('left'));
		var bt_tp = parseInt(bt.css('top'));
		bt.append('<span class="arrow"></span>')
		if(bt_lf <= w/2){
			$(this).css({'left':bt_lf+36+'px'})
			$(this).parent('li:first').addClass('right')
		}else{
			$(this).css({'left':bt_lf-233+'px'})
			$(this).parent('li:first').addClass('left')
		}
		if( bt_tp > 83 && bt_tp < h-83){
			$(this).css({'top':bt_tp-60+'px'})
		}else{
			if(bt_tp <= 83){$(this).css({'top':'0px'})}
			if(bt_tp >= h-83){$(this).css({'top':h-168+'px'})}
		}
	})

	wrap.find('.open').on('click mouseover', function(){
		var bx = $(this).parent('li:first');
		wrap.find('li').removeClass('active');
		bx.addClass('active');		
	})
	wrap.find('.close').on('click', function(){
		wrap.find('li').removeClass('active');
	})
}

/*
CSS Browser Selector js v0.5.3 (July 2, 2013)
Rafael Lima (http://rafael.adm.br)
http://rafael.adm.br/css_browser_selector
License: http://creativecommons.org/licenses/by/2.5/
Contributors: http://rafael.adm.br/css_browser_selector#contributors
*/
function css_browser_selector(u){var ua=u.toLowerCase(),is=function(t){return ua.indexOf(t)>-1},g='gecko',w='webkit',s='safari',c='chrome',o='opera',m='mobile',v=0,r=window.devicePixelRatio?(window.devicePixelRatio+'').replace('.','_'):'1';var res=[(!(/opera|webtv/.test(ua))&&/msie\s(\d+)/.test(ua)&&(v=RegExp.$1*1))?('ie ie'+v+((v==6||v==7)?' ie67 ie678 ie6789':(v==8)?' ie678 ie6789':(v==9)?' ie6789 ie9m':(v>9)?' ie9m':'')):(/firefox\/(\d+)\.(\d+)/.test(ua)&&(re=RegExp))?g+' ff ff'+re.$1+' ff'+re.$1+'_'+re.$2:is('gecko/')?g:is(o)?o+(/version\/(\d+)/.test(ua)?' '+o+RegExp.$1:(/opera(\s|\/)(\d+)/.test(ua)?' '+o+RegExp.$2:'')):is('konqueror')?'konqueror':is('blackberry')?m+' blackberry':(is(c)||is('crios'))?w+' '+c:is('iron')?w+' iron':!is('cpu os')&&is('applewebkit/')?w+' '+s:is('mozilla/')?g:'',is('android')?m+' android':'',is('tablet')?'tablet':'',is('j2me')?m+' j2me':is('ipad; u; cpu os')?m+' chrome android tablet':is('ipad;u;cpu os')?m+' chromedef android tablet':is('iphone')?m+' ios iphone':is('ipod')?m+' ios ipod':is('ipad')?m+' ios ipad tablet':is('mac')?'mac':is('darwin')?'mac':is('webtv')?'webtv':is('win')?'win'+(is('windows nt 6.0')?' vista':''):is('freebsd')?'freebsd':(is('x11')||is('linux'))?'linux':'',(r!='1')?' retina ratio'+r:'','js portrait'].join(' ');if(window.jQuery&&!window.jQuery.browser){window.jQuery.browser=v?{msie:1,version:v}:{}};return res};(function(d,w){var _c=css_browser_selector(navigator.userAgent);var h=d.documentElement;h.className+=' '+_c;var _d=_c.replace(/^\s*|\s*$/g,'').split(/ +/);w.CSSBS=1;for(var i=0;i<_d.length;i++){w['CSSBS_'+_d[i]]=1}var _de=function(v){return d.documentElement[v]||d.body[v]};if(w.jQuery){(function($){var p='portrait',l='landscape';var m='smartnarrow',mw='smartwide',t='tabletnarrow',tw='tabletwide',ac=m+' '+mw+' '+t+' '+tw+' pc';var $h=$(h);var to=0,cw=0;function CSSSelectorUpdateSize(){if(to!=0)return;try{var _cw=_de('clientWidth'),_ch=_de('clientHeight');if(_cw>_ch){$h.removeClass(p).addClass(l)}else{$h.removeClass(l).addClass(p)}if(_cw==cw)return;cw=_cw}catch(e){}to=setTimeout(CSSSelectorUpdateSize_,100)};function CSSSelectorUpdateSize_(){try{$h.removeClass(ac);$h.addClass((cw<=360)?m:(cw<=640)?mw:(cw<=768)?t:(cw<=1024)?tw:'pc')}catch(e){}to=0};if(w.CSSBS_ie){setInterval(CSSSelectorUpdateSize,1000)}else{$(w).on('resize orientationchange',CSSSelectorUpdateSize).trigger('resize')}})(w.jQuery)}})(document,window);
/*160215*/
/*! http://mths.be/placeholder v2.1.0 by @mathias */
(function(factory) {if (typeof define === 'function' && define.amd) {/*AMD*/ define(['jquery'], factory); } else {/*Browser globals*/ factory(jQuery); } }(function($) {/*Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so*/ var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]'; var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini; var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini; var valHooks = $.valHooks; var propHooks = $.propHooks; var hooks; var placeholder; if (isInputSupported && isTextareaSupported) {placeholder = $.fn.placeholder = function() {return this; }; placeholder.input = placeholder.textarea = true; } else {var settings = {}; placeholder = $.fn.placeholder = function(options) {var defaults = {customClass: 'placeholder'}; settings = $.extend({}, defaults, options); var $this = this; $this .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]') .not('.'+settings.customClass) .bind({'focus.placeholder': clearPlaceholder, 'blur.placeholder': setPlaceholder }) .data('placeholder-enabled', true) .trigger('blur.placeholder'); return $this; }; placeholder.input = isInputSupported; placeholder.textarea = isTextareaSupported; hooks = {'get': function(element) {var $element = $(element); var $passwordInput = $element.data('placeholder-password'); if ($passwordInput) {return $passwordInput[0].value; } return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value; }, 'set': function(element, value) {var $element = $(element); var $passwordInput = $element.data('placeholder-password'); if ($passwordInput) {return $passwordInput[0].value = value; } if (!$element.data('placeholder-enabled')) {return element.value = value; } if (value === '') {element.value = value; /*Issue #56: Setting the placeholder causes problems if the element continues to have focus.*/ if (element != safeActiveElement()) {/*We can't use `triggerHandler` here because of dummy text/password inputs :(*/ setPlaceholder.call(element); } } else if ($element.hasClass(settings.customClass)) {clearPlaceholder.call(element, true, value) || (element.value = value); } else {element.value = value; } /*`set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363*/ return $element; } }; if (!isInputSupported) {valHooks.input = hooks; propHooks.value = hooks; } if (!isTextareaSupported) {valHooks.textarea = hooks; propHooks.value = hooks; } $(function() {/*Look for forms*/ $(document).delegate('form', 'submit.placeholder', function() {/*Clear the placeholder values so they don't get submitted*/ var $inputs = $('.'+settings.customClass, this).each(clearPlaceholder); setTimeout(function() {$inputs.each(setPlaceholder); }, 10); }); }); /*Clear placeholder values upon page reload*/ $(window).bind('beforeunload.placeholder', function() {$('.'+settings.customClass).each(function() {this.value = ''; }); }); } function args(elem) {/*Return an object of element attributes*/ var newAttrs = {}; var rinlinejQuery = /^jQuery\d+$/; $.each(elem.attributes, function(i, attr) {if (attr.specified && !rinlinejQuery.test(attr.name)) {newAttrs[attr.name] = attr.value; } }); return newAttrs; } function clearPlaceholder(event, value) {var input = this; var $input = $(input); if (input.value == $input.attr('placeholder') && $input.hasClass(settings.customClass)) {if ($input.data('placeholder-password')) {$input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id')); /*If `clearPlaceholder` was called from `$.valHooks.input.set`*/ if (event === true) {return $input[0].value = value; } $input.focus(); } else {input.value = ''; $input.removeClass(settings.customClass); input == safeActiveElement() && input.select(); } } } function setPlaceholder() {var $replacement; var input = this; var $input = $(input); var id = this.id; if (input.value === '') {if (input.type === 'password') {if (!$input.data('placeholder-textinput')) {try {$replacement = $input.clone().attr({ 'type': 'text' }); /*less then ie9. 2015.02.17.dusthand.*/ /*less eq then ie9. 2015.06.11.dusthand.*/ if($.browser.msie && $.browser.version<=9) {$replacement = $('<input>').attr({ 'type': 'text' }); $.each(args(this), function(a_name,a_value){if(a_name=='type' || a_name=='') return true; if(a_name=='class') $replacement.addClass(a_value); else $replacement.removeAttr(a_name).attr(a_name,a_value); }); } } catch(e) {$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' })); } $replacement .removeAttr('name') .data({'placeholder-password': $input, 'placeholder-id': id }) .bind('focus.placeholder', clearPlaceholder); $input .data({'placeholder-textinput': $replacement, 'placeholder-id': id }) .before($replacement); } $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', id).show(); /*Note: `$input[0] != input` now!*/ } $input.addClass(settings.customClass); $input[0].value = $input.attr('placeholder'); } else {$input.removeClass(settings.customClass); } } function safeActiveElement() {/*Avoid IE9 `document.activeElement` of death*/ /*https://github.com/mathiasbynens/jquery-placeholder/pull/99*/ try {return document.activeElement; } catch (exception) {} } }));
// INPUT PLACEHOLDER
jQuery(function($){
	if($.browser.msie && $.browser.version<=9) $('input, textarea').placeholder();
});
/*//160215*/

/* 2020-09-21 */
$(function(){
	var cartTab = $(".cart_tab .d_tab a");
	var cartTapPos
	if($('#wrapper').hasClass('shoopen')){
		cartTapPos = 81;
	}else{
		cartTapPos = 56;
	}
	cartTab.on("click",function(e){
		tTaget = $(this.hash);
		idCart = parseInt(tTaget.offset().top) - cartTapPos;
		$("body , html").animate({"scrollTop":idCart},200,function(){
			tTaget.focus();
		});
	});
});

/* 20170808 target 이동 */
function moveAncor(target){
	var targetOfst = $(target).offset().top;
	$("body , html").animate({"scrollTop":targetOfst},300,function(){
		$(target).focus();
	});
}

/* 20170810 Click to Adding Class.on (  type : ul > li > a  )  */
$(function(){
	$('.ctrlOn a').click(function(){
		if($(this).parent().parent().parent().hasClass('ctg_tab')){
			var indexLi = $(this).parent('li').index();
			$('.ctg_tab').each(function(){
				$(this).find('ul li:nth-child('+(indexLi+1)+')').addClass('on').siblings('li').removeClass('on');
			});
		}
		else{$(this).parent('li').addClass('on').siblings('li').removeClass('on');}
	});
});


/* designed - CheckBox / RadioBtn */
$(document).ready(function(){
	$('.eCk > input').each(function(){ // checkbox  radio
		if(this.checked){$(this).parent('.eCk:first').addClass('checked');$(this).attr('checked', true);}
		if(this.disabled){$(this).parent('.eCk:first').addClass('disabled');$(this).attr('disabled', true);}
		$(this).change(function(){
			if(this.checked){
				if($(this).attr('type')==='radio'){
					var radioName = $(this).attr('name')
					$('input[name='+radioName+']').attr('checked', false);
					$('input[name='+radioName+']')[0].checked = false;
					$('input[name='+radioName+']').parent('.eCk').removeClass('checked');
				}
				$(this).parent('.eCk:first').addClass('checked');$(this).attr('checked', true);$(this)[0].checked = true;
			}else{
				$(this).parent('.eCk:first').removeClass('checked');$(this).attr('checked', false);$(this)[0].checked = false;
			}
		})
	})
	// if(navigator.appVersion.indexOf('MSIE') != -1){
	// 	$('.eCk label').each(function(){
	// 		$(this).attr('onclick',$(this).attr('for')+'.click()');
	// 	})
	// }
	// if($('html').hasClass('ie678')){
	// 	$('.eCk label').each(function(){
	// 		$(this).attr('onclick',$(this).attr('for')+'.click()');
	// 	})
	// }
})

function setEck(){
	$('.eCk > input').each(function(){ // checkbox  radio
		if(this.checked){$(this).parent('.eCk:first').addClass('checked');$(this).attr('checked', true);}
		if(this.disabled){$(this).parent('.eCk:first').addClass('disabled');$(this).attr('disabled', true);}
		$(this).change(function(){
			if(this.checked){
				if($(this).attr('type')==='radio'){
					var radioName = $(this).attr('name')
					$('input[name='+radioName+']').attr('checked', false);
					$('input[name='+radioName+']')[0].checked = false;
					$('input[name='+radioName+']').parent('.eCk').removeClass('checked');
				}
				$(this).parent('.eCk:first').addClass('checked');$(this).attr('checked', true);$(this)[0].checked = true;
			}else{
				$(this).parent('.eCk:first').removeClass('checked');$(this).attr('checked', false);$(this)[0].checked = false;
			}
		})
	})
	if(navigator.appVersion.indexOf('MSIE') != -1){
		$('.eCk label').each(function(){
			$(this).attr('onclick',$(this).attr('for')+'.click()');
		})
	}
}
// [v2] : 오프라인쇼핑 사용
commonUI.cmnTabItemActive = function(id,idx) {
	var $id; 
	var $list;
	var $links;
	var currentIDX;
	function init(id,idx) {
		$id = $(id);
		$list = $id.find('li');
		$links = $list.find('a');
		currentIDX = idx;
		itemActive(currentIDX);
		initEvtL();
	}

	function initEvtL() {
		$links.on('click',function(e){
			var idx = $list.index($(this).parents('li'))
			itemActive(idx);
			e.preventDefault();
		});
	}
	function itemActive(idx) {
		$links.removeClass('active');
		$list.eq(idx).find('a').addClass('active');
	}
	init(id,idx);
}



commonUI.netOn = function(){
	$('html, body').addClass('netF');
}
commonUI.netOff = function(){
	$('html, body').removeClass('netF');
	$('body').css('overflow','visible')
}


commonUI.dimCall = function(){
	$('<div class="clear_dim"></div>').insertAfter($('body'));
}

commonUI.dimRemove = function(){
	$('.clear_dim').remove();
}

commonUI.contTest = function(){
	if(localStorage.consTest){
		var TestSpells = localStorage.consTest;
		var goTest = eval('(' + TestSpells + ')');
		goTest();
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
	
	$(".fav_sch .del").on("click touchstart", function(){
		$(".fav_sch input").val("");
		setTimeout(function() { $(".fav_sch .del").hide()}, 100);
	});
}


commonUI.controlSlide = function($target){
	$parentBox = $($target.container).parent();
	$leftBtn = $parentBox.find('.btn-prev2');
	$rightBtn = $parentBox.find('.btn-next2');
	$firstChild = $($target.slides[0]);
	$lastChild = $($target.slides.slice(-1)[0]);
	if($firstChild.hasClass('swiper-slide-visible')){
		$leftBtn.removeClass('on');
	}
	else if(!$firstChild.hasClass('swiper-slide-visible')){
		$leftBtn.addClass('on');
	}

	if($lastChild.hasClass('swiper-slide-visible')){
		$rightBtn.removeClass('on');
	}
	else if(!$lastChild.hasClass('swiper-slide-visible')){
		$rightBtn.addClass('on');
	}
}