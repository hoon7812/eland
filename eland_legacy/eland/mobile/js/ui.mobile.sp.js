
//Name Space
var spCmn = spCmn || {}; // Shoopen Common Objects
spCmn.linkTab =  spCmn.linkTab || {}; // Function Linked Tabs & Content Wraps
spCmn.wishTog = spCmn.wishTog || function(){}; // put to wish list
spCmn.fullLyrOpen = spCmn.fullLyrOpen || function(){}; //full layer open
spCmn.fullLyrClose = spCmn.fullLyrClose || function(){}; //full layer close
spCmn.toggleRv = spCmn.toggleRv || function(){}; // review toggle
spCmn.schFix = spCmn.schFix || function(){};
spCmn.cartBtmCtrl = spCmn.cartBtmCtrl || function(){};
spCmn.mainCtrl = spCmn.mainCtrl || function(){};
spCmn.appCtrl = spCmn.appCtrl || function(){};
spCmn.navOff = spCmn.navOff || function(){};
spCmn.navOn = spCmn.navOn || function(){};

// to run on ready
$(window).ready(function() {
	spCmn.linkTab();
	spCmn.schFix();
	spCmn.schCpl();
	spCmn.mainCtrl();
});


// 스크롤 업다운
$(function(){
	var winScroll
	var lastScroll = 0
	var delta = 5
	var hd_h = $('#header').outerHeight(true)
	$(window).scroll(function(event){ 
		winScroll = true;
		notTop();
	})
	setInterval(function(){ 
		if (winScroll) { 
			detScrolled()
			winScroll = false
		} 
	}, 300)
	function detScrolled(){
		var st = $(this).scrollTop();
		if(Math.abs(lastScroll - st) <= delta) 
			return
		if (st > lastScroll && st > hd_h){
				$('body').removeClass('scrollUp').addClass('scrollDown'); 
		}else{
			if(st + $(window).height() < $(document).height()) { 
				$('body').removeClass('scrollDown').addClass('scrollUp'); 
			}
		}
		lastScroll = st
	}
	function notTop(){
		var _body = $('body');
		var topGap = $('.top_tit').outerHeight() || 0;
		var st = $(this).scrollTop();
		if(st>topGap){
			_body.addClass('notTop');
		}
		else{
			_body.removeClass('notTop');
		}
	}
})

spCmn.linkTab = function(){ // Function Linked Tabs - Contents

	if ($('.fnLnkTab').length){
		$('.fnLnkTab').each(function(){
			if($(this).hasClass('main_tab')){
				fn_subFixed('.main_tabWrap','.main_tabWrap > div')
				init($(this).parents('.main_tabWrap'), $(this).attr('name'));
			}else{
				init($(this), $(this).attr('name'));
			}
		});
	}

	function init(_obj, nm){
		var _ancors = _obj.find('li a');
		_wholeWrap = _obj.parent();
		eventInit(_ancors, _obj, _wholeWrap, nm);
		if(nm=='cartTab'){
			spCmn.cartBtmCtrl();
		}
	};

	function eventInit(_ancors,  _wholeTab, _wholeWrap, nm){
		_ancors.click(function(){
			var _thisLi = $(this).parent();
			var currentP = $(window).scrollTop();
			var link_num = _thisLi.data('linkTab');
			var _allTabs = _wholeTab.find('li');
			var get_name = function(){
				if(typeof nm =='undefined'){
					return ''
				}else{
					return '[name='+nm+']'
				}
			}
			var _conts = _wholeWrap.find('.fnLnkCont'+get_name());
			var _thisCont = _wholeWrap.find('.fnLnkCont[data-link-cont='+link_num+']'+get_name());
			if(!_wholeTab.hasClass('rnd_tab')){
				var _firstCont = _wholeWrap.find('.fnLnkCont[data-link-cont=1]'+get_name());
				var topPadding = $('.gds_dtl .top_tit').outerHeight() || $('.bundle_dtl .cts_tit').outerHeight() || parseInt($('.sub_contents').css('padding-top')) || 0;
				var goodPadding = parseInt($('.goods_wrap').css('padding-top')) || 0;
				targetP = _firstCont.offset().top - _wholeTab.outerHeight() - goodPadding -  topPadding;
				if(nm == 'schr_tab'){
					//do_nothing
				}
				else{
					if (currentP>= targetP){
						$('html,body').scrollTop(targetP);
					}
					else{
						$(window).on('touchstart',function(){
							if($('html,body').is(':animated')){
								$('html,body').stop();
							}
						});
						$('html,body').animate({
							scrollTop: targetP,
						},500);
					}
				}
			}
			if(!_thisLi.hasClass('on')){
				_allTabs.removeClass('on');
				_conts.removeClass('active');
				_thisLi.addClass('on');
				_thisCont.addClass('active');
				if(typeof _thisCont[0].swp == 'object'){
					_thisCont[0].swp.update();
				}
			}
		});
	}
}

spCmn.cartBtmCtrl = function(){
	$('.fnLnkTab[name="cartTab"').find('a').click(function(){
		$(this).attr('id') == 'wish_list' ? cartbtOff() : cartbtOn();
	});
	function cartbtOff(){
		$('body').addClass('cartbt_off');
	}
	function cartbtOn(){
		$('body').removeClass('cartbt_off');
	}
}

spCmn.wishTog = function(target){
	if(elandmall.loginCheck()) {
		target.not(".on").addClass("on");
	}
};

spCmn.fullLyrOpen = function(id){
	$('body')[0].getScr = $(window).scrollTop();
	$('body').addClass('activate_flyr');
	$('#'+id).addClass('active').focus();
}

spCmn.fullLyrClose = function(id){
	$('body').removeClass('activate_flyr');
	$('#'+id).removeClass('active');
	$('html,body').scrollTop($('body')[0].getScr);
}


spCmn.popLyrOpen = function(id){
	$('body')[0].getScr = $(window).scrollTop();
	dim_on();
	$('body').addClass('activate_plyr');
	$('.pop_lyr#'+id).addClass('active');
}

spCmn.popLyrClose = function(id){
	$('body').removeClass('activate_plyr');
	dim_out();
	$('.pop_lyr#'+id).removeClass('active');
	$('html,body').scrollTop($('body')[0].getScr);
}

spCmn.schFix = function(){
	// 검색 개선 ( 2020.11 )
	// if($('body').not('.cate_part').hasClass('sch_part')){
	// 	doit();
	// 	$(window).scroll(function(){
	// 		doit();
	// 	});
	// 	function doit(){
	// 		var topGap = $('.filters_cont').outerHeight() + $('.slctd_fltr').outerHeight();
	// 		if($(window).scrollTop()>topGap){
	// 			$('.sch_sort, .sch_num').addClass('fixed');
	// 		}
	// 		else{
	// 			$('.sch_sort, .sch_num').removeClass('fixed');
	// 		}
	// 	}
	// }
}

spCmn.schCpl = function(){
	$('.sch_layer .sch_top .inp_box input').keyup(function() {
		if ($(this).val() == '') {
			$('.sch_layer').removeClass('sch_cpl')
		}else{
			$('.sch_layer').addClass('sch_cpl')
		}
	});
	$("#sch_del").on("click", function(){
		$('.sch_layer .sch_top .inp_box input').val("");
		$('.sch_layer').removeClass('sch_cpl');
		//setTimeout(function() { $("#sch_del").hide()}, 100);
	});
}


//GOODS INFO
spCmn.toggleRv = function(this_name){
   if($(this_name).parent().hasClass('on') == false){
		$('.rv_list').find('>ul>li').removeClass('on');
		$(this_name).parent().addClass('on');
	}else{
		$(this_name).parent().removeClass('on');
	}
}



//OPACITY LAYER
var scrolltop=0;
function OpacityLyrOpen(sId, topfix) {
	if(topfix){
		scrolltop = $(window).scrollTop();
	}
	$('body').append($("#"+sId));
	$("#"+sId).fadeIn(300);
 	//$('#contents').bind('touchmove', function (e) { e.preventDefault(); });
	// $('#contents').css({ 'position': 'fixed', 'z-index': '2'});
	scroll_out();
}

function OpacityLyrCls(sId) {  
	// setTimeout(function(){$('.slide_cont').append($("#"+sId))}, 300);
	$("#"+sId).fadeOut(300);
	// $('#contents').unbind('touchmove');
	// $('#contents').css({ 'position': '', 'z-index': ''});   //20160316	
	$('html, body').scrollTop(scrolltop);
	scrolltop=0;

	scroll_on();
}


spCmn.mainCtrl=function(){
	if($('.main_top').length){
		//history.scrollRestoration = "manual"
		//메인 인터렉션 삭제 ( 2021.03.15 )
		// $('.plan_wrap, .main_best, .main_new, .main_look, .main_mgz, .main_chart, .sns_wrap').addClass('iamout');
		// const io = new IntersectionObserver(entries => {
		//   entries.forEach(entry => {
		//     if (entry.intersectionRatio > 0) {
		//     	entry.target.classList.remove('iamout');
		//     	io.unobserve(entry.target);
		//     }
		//     else {
		//       entry.target.classList.add('iamout');
		//     }
		//   })
		// },{threshold: 0.1})

		// const boxElList = document.querySelectorAll('.plan_wrap, .main_best, .main_new, .main_look, .main_mgz, .main_chart, .sns_wrap');

		// boxElList.forEach((el) => {
		//   io.observe(el);
		// });

		function rankControl(){
			var time=0;
			$('.kwd_rank.open .vari, .kwd_rank.open .rank, .rank strong, .rank .vari').each(function(){
				var that = $(this);
				setTimeout(function(){
					that.addClass('turn');
					turnOff(that);
				},time);
				time+=100;
			});
			function turnOff(that){
				setTimeout(function(){
					that.removeClass('turn')
				},100)
			}
			loopRank();
		}
		function loopRank(){
			setTimeout(rankControl,5000)
		}
		loopRank();
	}
}


spCmn.appCtrl = function(param){
	/*
	var basketwrapH = $('.basketwrap').outerHeight(true) || 0;
	var _style = '<style>.layer_fix .fullpop{bottom:'+param+'px;}.btn_top{bottom:'+(param + basketwrapH +16)+'px !important;}body.cartbt_off .btn_top{bottom:'+(param +16)+'px !important;}.basketwrap{margin-bottom:0;bottom:'+param+'px;}</style>';
	$('body').prepend(_style);
	*/
	if($.type(window.spNotiPop) == "function") {
		window.spNotiPop();
	}
}


spCmn.navOff = function(){
	$('nav').hide();
}
spCmn.navOn = function(){
	$('nav').show();
}



//gtTabs
function opTabs(selector, target, start, random){

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
		targetAll.css({'height':0,'opacity':0})
		activeTarget().css({'height':'auto','opacity':1})
	}else if(start){
		btn.attr('aria-selected','false').eq(start).attr('aria-selected','true');
		targetAll.css({'height':0,'opacity':0})
		$('#'+target+start).css({'height':'auto','opacity':1})
	}else if($this.attr('data-start') !== undefined){
		var start = $this.attr('data-start')
		btn.attr('aria-selected','false').eq(start).attr('aria-selected','true');
		targetAll.css({'height':0,'opacity':0})
		$('#'+target+start).css({'height':'auto','opacity':1})
	}else{
		$('#'+target+'0').css({'height':'auto','opacity':1})
	}
	btn.on('click', function(e){
		var $this = $(this)
		e.preventDefault()
		if($this.attr('aria-selected') != 'true'){
			$this.attr('aria-selected', 'true').siblings().attr('aria-selected', 'false')
			targetAll.css({'height':0,'opacity':0})
			activeTarget().css({'height':'auto','opacity':1})
		}else{
			return false
		}
	})
	function activeTarget(){return $('#'+target+$this.find("button[aria-selected='true']").index())}
}

function fnKeySlide(){
	var keySlide = $('.main_key.slide .keyBx')
	var keyItems = keySlide.find('li')
	var kewGds = keyItems.find('.gds')
	var $length = keyItems.length
	var $delay = 4000
	var set_Interval
	var isOver
	var gdArea = Math.ceil(window.innerWidth*25/100) + 10
		
	fn_auto()
	go_slide(isActive(),keyItems.eq(0),0)

	keySlide.find('.rnk a').on('click', function(){
		if($(this).parents('li:first').hasClass('on')){
			return false
		}
		clearInterval(set_Interval);
		keyItems.removeClass('on')
		kewGds.stop().animate({'height':0,'opacity':0},300);
		$(this).parents('li:first').addClass('on').find('.gds').stop().animate({'height':gdArea,'opacity':1},300);
		set_Interval = setInterval(function(){fn_next()}, $delay);
	})
	function go_slide(active,after,time){
		active.removeClass('on').find('.gds').stop().animate({'height':0,'opacity':0},300);
		after.addClass('on').find('.gds').stop().animate({'height':gdArea,'opacity':1},300);
	}
	function isActive(){return keySlide.find('li.on')}
	function fn_next(){
		var after = (isActive().index()+1 < $length) ? keyItems.eq(isActive().index()+1) : keyItems.eq(0);
		go_slide(isActive(),after,0)
	}
	function fn_auto(){
		clearInterval(set_Interval);
		if($length>1){
			set_Interval = setInterval(function(){fn_next()}, $delay);
		}
	}
	

}
function fn_hotKeyLyr(){
	$('.btn_top').hide()
	$('html,body').scrollTop(0)
}
function fn_hotKeyLyrClose(){
	$('.btn_top').show()
}
// SUB FIXED UI
function fn_subFixed(contain,selector,trans,addTop){
	var fix = $(selector)
	if(!fix.hasClass('noFx')){
		fix.css({'-webkit-backface-visibility':'hidden'})
		$(selector).addClass('ready')
		$(window).scroll(function(){
			var st = $(this).scrollTop();
			var fix_top = $(contain).offset().top
			var fix_h = fix.outerHeight(true)
			if(st > fix_top - getHd_pos()){
				fix.addClass('fixed').css({'transition':'transform 0s', 'transform':'translate3d(0,'+getHd_pos()+'px,0)'})
				if(trans && st > fix_top + 70){
					fix.css({'transition':'transform .35s'})
					if($('body').hasClass('scrollDown')){
						fix.css({'transform':'translate3d(0,'+getAd_pos()+'px,0)'})
					}else{
						fix.css({'transform':'translate3d(0,'+getHd_pos()+'px,0)'})
					}
				}
			}else{
				fix.removeClass('fixed').css({'transform':'translate3d(0,0,0)'})
			}
		})
		function getHd_pos(){
			if($('.header_kms').hasClass('main')){
				return $('.header_kms .gnbs').outerHeight(true)
			}else if( addTop !== undefined){
				return $('.header_kms .head').outerHeight(true) + $(addTop).outerHeight(true)
			}else{
				return $('.header_kms .head').outerHeight(true)
			}
		}
		function getAd_pos(){
			if($('.header_kms').hasClass('main')){
				return $('.header_kms .gnbs').outerHeight(true) - fix.outerHeight(true)
			}else if(addTop !== undefined){
				return $(addTop).outerHeight(true)
			}else{
				return 0
			}
		}
	}
}
// check english
function englishFilter(target){
	$(target).each(function(i){
		var $this = $(this),
			text = $this.html(),
			reg = /[^ㄱ-ㅎㅏ-ㅣ가-힣 \t\r\n\v\f¥]*[^ㄱ-ㅎㅏ-ㅣ가-힣 \t\r\n\v\f¥]/gi,
			regTag = /<\/?[A-Za-z]+[^>]*\/?>/gi,
			result = text.replace(/¥/gi, '&yen;'),
			tag = result.match(regTag) || false;
		result = result.replace(regTag, '¥').replace(reg, '<i>$&</i>');
		if (tag){
			for (var i=0; i<tag.length; i++){
				result = result.replace('¥', tag[i]);
			}
		}
		$this.html(result);
	});
}
$(document).ready(function(){
	if($('.main_bn_wrap').length > 0){
		englishFilter('.main_bn_wrap .main_bn ul li a strong em')
		englishFilter('.main_bn_lyr li a strong em')
	}
	if($('.main_look').length > 0){ englishFilter('.main_look a strong')}
})
