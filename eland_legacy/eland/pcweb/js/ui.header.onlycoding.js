commonUI.header = commonUI.header || {};
commonUI.header.mallToggleLyr = commonUI.header.mallToggleLyr || {}; // MALL 변경
commonUI.header.catgToggleLyr = commonUI.header.catgToggleLyr || {};
commonUI.header.gnbCate = commonUI.header.gnbCate || {};//160128 추가
commonUI.header.brandMoreLayer =  commonUI.header.brandMoreLayer || {}//160608추가 브랜드 더보기 레이어 추가

$(window).ready(function(){
	commonUI.header.mallToggleLyr();
	commonUI.header.catgToggleLyr();
	commonUI.header.schHeader();
	commonUI.header.hdBanner();
	commonUI.header.brandMoreLayer();//160608추가
})

commonUI.header.mallToggleLyr = function(){
	var $header = $("#header");
	if ( commonUI.isTarget($header) ) return;

	var $wrapper = $("#wrapper");
	var $titleBtn = $(".d_main_logo");
	var $mallSelect = $(".mall_select");
	var modernBoolean = true; // 160309
	var LIMIT;
	/*브랜드몰 분기*/
	var brd_Class;
	if($wrapper.hasClass('main')){
		brd_Class = ($wrapper.attr('class')).substring(5);
	}

	if($("div").hasClass("plan_makeup")){ // 160901
		var pH = $(".plan_makeup").height() + $header.height();
		$(".wing_menu").css("top", pH  + 34);

		LIMIT = pH;

		$(window).scroll(function(){
			if ( $(window).scrollTop() > LIMIT ) {
				$(".wing_menu").css("top","52px");
			}else{
				$(".wing_menu").css("top", pH+"px");
			}
		});

	}else{
		if($.inArray(brd_Class, ['modern','kinder','folder','mixxo','ost','eblin','newbal','roem','lloyd','clue','spao','whoau','shoopen','bahus','nb_kids','kims','renewal']) >= 0){ //add renewal
			LIMIT = $header.height() + $(".header_top_banner").height() +  $(".d_promo_container").height();
			modernBoolean = true; //160309
		}else{
			LIMIT = $header.height() + $(".header_top_banner").height();
		}
	}

	if ( modernBoolean ) {
		var $bottomBanner = $(".d_btmbanner");
		var bottomBannerHeight = parseInt($bottomBanner.height())*-1;
		$bottomBanner.css({"display":"none"});
	}

	$(window).on("scroll" , function(e){ // 160120 $(window) 로 수정
		e.preventDefault();
		headerFixFunc();
	});

	function headerFixFunc(){ // HEADER change condition 2016-07-04
		var top_bn_height;
		if($(".header_top_banner").hasClass('on')){
			top_bn_height = 0;
		}else{
			top_bn_height = 80;
		}
		if($('#today_deal_bn').hasClass('today_deal_bn')){ // case : lucky deal
			cateTabOfst = $('.ctg_tab').eq(0).offset().top - $('#content').offset().top;
			if ( $(window).scrollTop() < LIMIT + cateTabOfst - top_bn_height ) {
				_originals();
			} else {
				_minimal();
			}
		}
	}

	function _originals () { // ORIGINAL HEADER
/*160309*/
		if ( modernBoolean ) {
			$bottomBanner.stop().css({"display":"none"});
		}
/*//160309*/
		if (!$wrapper.hasClass("header_fix")) return;
		$wrapper.removeClass("header_fix");
		$titleBtn.off("click");
	}

	function _minimal () { // MINIMAL HEADER
/*160309*/
		if ( modernBoolean ) {
			$bottomBanner.stop().fadeIn(160);
		}
/*//160309*/
		if ($wrapper.hasClass("header_fix")) return;

		$wrapper.addClass('header_fix');
		$titleBtn.on("click" ,function(e){
			e.preventDefault();
			$mallSelect.toggleClass("on");
			commonUI.bodyClickOnFunc( "d_mallToggleLyr" );
		});
	}

	function _bodyClickFn(e){ // body click func
		var $hasTarget = $(".hd_mall");

		if (!$mallSelect.is(e.target) && !$titleBtn.is(e.target) && $hasTarget.has(e.target).length === 0){
		  	commonUI.bodyClickOffFunc( "d_mallToggleLyr" );
		  	$mallSelect.removeClass("on");
		  	e.preventDefault();
		}
	}


	commonUI.bodyClickFunc( "d_mallToggleLyr" , _bodyClickFn );
	headerFixFunc();
}
/* 160129 수정 */
commonUI.header.catgToggleLyr = function(){
	var $target = $(".catg_lyr");
	var $btn = $(".catg_bt");
	var $closeBtn = $(".bt_close");

	function _bodyClickFn(e){ // body click func
		if (!$target.is(e.target) && !$btn.is(e.target) && $target.has(e.target).length === 0){
		  	commonUI.bodyClickOffFunc( "d_catgToggleLyr" );
			catgToggleLyrClose();
		}
	}

	commonUI.bodyClickFunc( "d_catgToggleLyr" , _bodyClickFn );

	$btn.on("click" ,function(e){
		$btn.toggleClass("on");
		if ( $btn.hasClass("on") ) {
			gnbMenu.offEvtL();
			commonUI.bodyClickOnFunc( "d_catgToggleLyr" );
		}else{
			gnbMenu.initEvtL();
		  	commonUI.bodyClickOffFunc( "d_catgToggleLyr" );
		}
		$target.toggle();
		e.preventDefault();

	});

	$closeBtn.on("click" ,function(e){
		$btn.focus();
		catgToggleLyrClose();
	});

	function catgToggleLyrClose(){
		$btn.removeClass("on");
		gnbMenu.initEvtL();
		$target.hide();
	}
}
/* //160129 수정 */

/* 160129 삭제
commonUI.header.spcToggleLyr = function(){

	var $btn = $(".spc_bt");
	var $target = $(".spc_lyr");

	$btn.on("click focusin mouseover" ,function(e){
		$btn.parent().addClass("on"); // 160125 수정
		$target.show();
		commonUI.bodyClickOnFunc( "d_spcToggleLyr" );
		e.preventDefault();
	});

	function _bodyClickFn(e){ // body click func
		if (!$target.is(e.target) && !$btn.is(e.target) && $target.has(e.target).length === 0){
		  	commonUI.bodyClickOffFunc( "d_spcToggleLyr" );
			$btn.parent().removeClass("on"); // 160125 수정
			$target.hide();
		}
	}

	commonUI.bodyClickFunc( "d_spcToggleLyr" , _bodyClickFn );
}
*/
// SEARCH
commonUI.header.schHeader = function(){

	var $hd_sch = $(".hd_sch");
	var $inputs = $hd_sch.find(".d_searchTerm");
	var $sch_del = $hd_sch.find(".sch_del");
	var $sch_keyword = $hd_sch.find(".d_sch_keyword");
	var $sch_complete = $hd_sch.find(".d_sch_complete");
	var $sch_btn = $hd_sch.find(".sch_btn");
	var $tab_btn = $hd_sch.find(".f_keyword dt button");
	var $target = $hd_sch.find(".f_keyword dd");
	var $links = $hd_sch.find(".d_links");

	function schHeaderEventHandler(){
		$inputs.on("focus",function(e){
			commonUI.bodyClickOffFunc( "d_schHeader" );
			commonUI.bodyClickOnFunc( "d_schHeader" );

			schHeaderControls();
		})

		$inputs.on("keyup",function(e){
			schHeaderControls();
		})

		$sch_btn.on("focus",function() {
			schHeaderClose();
		});

		$tab_btn.on("click focus" ,function(){
			var $this = $(this);
			$tab_btn.removeClass("on");
			$target.hide();
			$this.addClass("on");
			$this.parent().next().show();
		});

		$sch_del.on("click", function(){
			commonUI.bodyClickOffFunc( "d_schHeader" );

			setTimeout(function() { $sch_del.hide();}, 100);
			$inputs.val("").focus();
			$sch_complete.hide();
		});

		$links.each(function() {
			var $this = $(this);
			$this.focus(function(e) {
				var _v = $this.find('span').text();
				$inputs.val(_v);
				$sch_del.show();
				e.preventDefault();
			}).click(function(e) {
				commonUI.bodyClickOffFunc( "d_schHeader" );

				$sch_btn.focus();
				$sch_keyword.hide();
				$sch_complete.hide();
				e.preventDefault();
			});
		});

		function _bodyClickFn(e){ // body click func
			if (!$hd_sch.is(e.target) && $hd_sch.has(e.target).length === 0){
				schHeaderClose();
			}
		}

		commonUI.bodyClickFunc( "d_schHeader" , _bodyClickFn );

	}

	schHeaderEventHandler();

	// $inputs.focus(function() {
	// 	schHeaderControls();
	// }).keyup(function() {
	// 	schHeaderControls();
	// });

	function schHeaderControls(){
		if ( $inputs.val() != "" ) {
			schAutocompOpen();
		}else{
			schKeywordOpen();
		}
		$hd_sch.addClass('on');//160127_추가
	}

	function schKeywordOpen(){
		$sch_del.hide();
		$sch_keyword.show();
		$sch_complete.hide();
	}

	function schAutocompOpen(){
		$sch_del.show();
		$sch_keyword.hide();
		$sch_complete.show();
	}

	function schHeaderClose(){
		commonUI.bodyClickOffFunc( "d_schHeader" );

		$sch_del.hide();
		$sch_keyword.hide();
		$sch_complete.hide();
		$hd_sch.removeClass('on');//160127_추가
	}

}

commonUI.header.hdBanner = function(){
	if ( $("#wrapper").hasClass("modern") || commonUI.isTarget($("#hdBanner")) ) return;
	$(window).ready(function(){
/* 160608_추가 */
		var hd_banner_opt = {speed: 300 , autoplay: 3000 , simulateTouch : false , createPagination: false , paginationClickable : false , loop : true}
		if($("#wrapper").hasClass("ost")) {
			hd_banner_opt.mode ='vertical';
		}
		/* 170504 추가 */
		if($("#wrapper").hasClass("renewal")) {
			hd_banner_opt.mode ='vertical';
		}
		/* 170504 추가 */
/* //160608_추가 */		
		var hd_banner_ins = new Swiper('#hdBanner',hd_banner_opt);
		var $target = $('.hd_bn');

		var hd_swiperEle = { $target : $target , status : true , last_idx : 0 , ins : hd_banner_ins , $prevBtn : $target.find(".d_hd_prev") , $nextBtn :  $target.find(".d_hd_next") };
		// $target : 최상단 박스 ,  status : autoplay - play , last_idx : autoplay 관련 , ins : swiper instance name

		hd_swiperEle.$target.hover(
			function (e) { //mouseenter
				hd_swiperEle.ins.stopAutoplay();
				e.preventDefault();
			},
			function (e) { //mouseleave
				if ( hd_swiperEle.status ) hd_swiperEle.ins.startAutoplay();
				e.preventDefault();
			}
		);

		hd_swiperEle.$prevBtn.on('click',function(e){
			hd_swiperEle.ins.swipePrev();
		})

		hd_swiperEle.$nextBtn.on('click',function(e){
			hd_swiperEle.ins.swipeNext();
		})

		hd_swiperEle.$target.on("keydown", ".swiper-slide > a" , function(e) {
			var idx = Math.floor($(this).attr('data-index'));
			if(e.keyCode == 9){ hd_swiperEle.ins.swipeTo(idx, 0 , 0 );}
			hd_swiperEle.last_idx = idx;
		});

		hd_swiperEle.$target.on("focusin" , "a" , function(e) {
			hd_swiperEle.ins.stopAutoplay();
		});

		hd_swiperEle.$target.on("focus", ".swiper-slide" ,function(){
			var idx = Math.floor($(this).attr('data-index'));
			hd_swiperEle.ins.stopAutoplay();
			hd_swiperEle.ins.swipeTo( idx, 0 , 0 )
		})

		$(".swiper-slide-duplicate a").attr('tabindex','-1');
		setTimeout(function(){
			hd_swiperEle.$target.find(".swiper-slide:not(.swiper-slide-duplicate)").removeAttr('tabindex');
		},1000)

		// random
		function hd_bn_rand(){
			var lengths = hd_swiperEle.$target.find(".swiper-slide:not(.swiper-slide-duplicate)").length;
			var random_idx = Math.floor(Math.random()*lengths);
			hd_swiperEle.ins.swipeTo( random_idx , 0 , 0 )
		}
		hd_bn_rand();
	})
}
/* 160128 추가 */
commonUI.header.gnbCate = function(id) {
	this.init(id);
}

commonUI.header.gnbCate.prototype = {
	init : function(id) {

		this.$gnbCateWrap = $(id).find('> dl');// 부모메뉴
		if ( commonUI.isTarget(this.$gnbCateWrap) ) return;

		this.$depth1 = this.$gnbCateWrap.find('> dd');// 1depth1
		this.$depth1_link = this.$depth1.find('> a');// 1depth link
		this.$depthEnd = this.$gnbCateWrap.find('a').last();
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

		this.$gnbCateWrap.on('mouseleave',function() {
			that.depth1Off(that.currentIDX);
		});

		this.$depth1_link.on('focus',function() {
			if ( !that.$depth1.eq(that.currentIDX).hasClass('active') ) commonUI.bodyClickOnFunc( "d_hd_disp" );
			var idx = that.$depth1.index($(this).parent('dd'));
			if(that.currentIDX!=null) {
				that.depth1Off(that.currentIDX);
			}
			that.depth1On(idx);
		});

		function _bodyClickFn(e){ // body click func
			if (!that.$gnbCateWrap.is(e.target) && that.$gnbCateWrap.has(e.target).length === 0){
			  	commonUI.bodyClickOffFunc( "d_hd_disp" );
				that.depth1Off(that.currentIDX);
			}
		}
		commonUI.bodyClickFunc( "d_hd_disp" , _bodyClickFn );
	},

	offEvtL : function(){
		this.$depth1.off('mouseenter');
		this.$gnbCateWrap.off('mouseleave');
		this.$depth1_link.off('focus');
	},

	depth1On : function(idx) {
		this.$depth1.eq(idx).addClass('active');
		this.currentIDX = idx;
	},
	depth1Off : function(idx) {
		this.$depth1.eq(idx).removeClass('active');
	}
}
/* //160128 추가 */

/* 2016-06-14 */
commonUI.header.brandMoreLayer = function() {
	var brMenu = $('.d_bs_sel');
	var brList = brMenu.find('.brand_select');
	var br_left = brList.find('.ldeco');
	var br_right = brList.find('.rdeco');
	function show_brMenu(){
		brList.show();
		brMenu.addClass('hover');
	}
	function hide_brMenu(){
		brList.hide();
		brMenu.removeClass('hover');
	}
	brMenu.find('.bs_sel_tit>a').mouseover(show_brMenu).focus(show_brMenu);
	brMenu.mouseleave(hide_brMenu);
    brMenu.next().keyup(hide_brMenu);
    brMenu.prev().keyup(hide_brMenu);
	brd_slt_resize();
	$(window).resize(function(){
		brd_slt_resize();
	})
	function brd_slt_resize(){
		var bgW = ($(window).width() - 1080)/2;
		if($(window).width()>1080){
			br_left.css({width:bgW,left:-bgW});
			br_right.css({width:bgW,right:-bgW});
		}else{
			br_left.css({width:0,left:0});
			br_right.css({width:0,right:0});
		}
	}
}
/* 2016-06-14 */

// 2016-08-10
$(document).ready(function(){
	if($('#wrapper').hasClass('folder')){
		depth2_line_up()
	}
	if($('#wrapper').hasClass('spao') || $('#wrapper').hasClass('bahus')){
		hd_disp_line_up()
	}
//	if($('#wrapper').hasClass('kinder')){
//		kinder_bmenu_line_up()
//	}
})
function depth2_line_up(){
	var dep = $('.hd_disp').find('dd');
	dep.each(function(){
		if($(this).find('div').hasClass('depth2')){
			$(this).addClass('in_dep');
			var hd_left = $('.head').offset().left +1080 ;
			var dp_left = $(this).offset().left + 740;
			if(hd_left < dp_left ){
				var at_left = hd_left - dp_left;
				$(this).find('.depth2').css({'left':+ at_left +'px'})
			}
		}
	})
}
function hd_disp_line_up(){
	var dds = $('.hd_disp dl').find('dd')
	var total = dds.length;
	var disp_w = 1080-parseInt($('.hd_disp').css('margin-left'));
	dds.css({'width':+(disp_w/total)+'px'})
}
//function kinder_bmenu_line_up(){
//	if($('.hd_disp').find('.depth2').hasClass('b_menu')){
//		var menu = $('.hd_disp').find('.b_menu');
//		var age = menu.find('li');
//		var size = (age.length*117);
//		menu.css({'width':+ (size-1) + 'px','margin-left':'-'+(size/2)+'px'})
//	}
//}

