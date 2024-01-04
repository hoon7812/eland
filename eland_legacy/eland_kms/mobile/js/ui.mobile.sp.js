
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
			init($(this), $(this).attr('name'));
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
	target.not(".on").addClass("on");
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
		$('.plan_wrap, .main_best, .main_new, .main_look, .main_mgz, .main_chart, .sns_wrap').addClass('iamout');
		const io = new IntersectionObserver(entries => {
		  entries.forEach(entry => {
		    if (entry.intersectionRatio > 0) {
		    	entry.target.classList.remove('iamout');
		    	io.unobserve(entry.target);
		    }
		    else {
		      entry.target.classList.add('iamout');
		    }
		  })
		},{threshold: 0.1})

		const boxElList = document.querySelectorAll('.plan_wrap, .main_best, .main_new, .main_look, .main_mgz, .main_chart, .sns_wrap');

		boxElList.forEach((el) => {
		  io.observe(el);
		});

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
	var basketwrapH = $('.basketwrap').outerHeight(true) || 0;
	var _style = '<style>.layer_fix .fullpop{bottom:'+param+'px;}.btn_top{bottom:'+(param + basketwrapH +16)+'px !important;}body.cartbt_off .btn_top{bottom:'+(param +16)+'px !important;}.basketwrap{margin-bottom:0;bottom:'+param+'px;}</style>';
	$('body').prepend(_style);
}


spCmn.navOff = function(){
	$('nav').hide();
}
spCmn.navOn = function(){
	$('nav').show();
}