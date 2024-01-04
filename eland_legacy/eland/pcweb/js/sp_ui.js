//SHOOPEN_UI

$(document).ready(function(){
	scrollCheck()
	if($('#header').length > 0){
		spHeaderUI()
		fnKeySlide()
	}
	if($('.wing_menu').length > 0){
		spWingUI()
	}
	if($('.fxdTop').length > 0){fnBtTop()}
	if($('#content').find('.goods_list').length > 0){setGdLst('.goods_list')}
	if($('.goods_view_img ul').length > 0){
		setTimeout(function(){
			$('.goods_view_img ul').removeAttr('tabindex')
		},500)
	}
	if($('.ctgSpNav').length > 0){fnCtgNav()}
	if($('.mainPromo').length > 0){englishFilter('.mainPromo .bnr .txt strong')}
	if($('.shoopen.main .lookBook').length > 0){englishFilter('.lookBook .bnr .txt strong')}
	if($('.new_cate_wrap .tit_h2').length > 0){englishFilter('.new_cate_wrap .tit_h2')}
	if($('.ctgTitle').length > 0){englishFilter('.ctgTitle')}

})
function spWingUI(){
	var wng = $('.wing_menu')
	if($('.mainPromo').length > 0){
		wng.addClass('hmn')
		if($('.mainMds').length > 0){
			wng.addClass('mds')
		}
	}
	var wngTop = parseInt(wng.css('top'))
	set_wing()
	$(window).scroll(function(){set_wing()})
	function set_wing(){
		var st = $(this).scrollTop();
		if(st > wngTop + $('.header_top_banner').outerHeight(true) - 10){
			wng.addClass('fxd')
		}else{
			wng.removeClass('fxd')
		}
	}
}

function spHeaderUI(){
	var spHd = $('.header')
	ariaTipBx(spHd.find('.hd_disp dd > div[role="combobox"]'), 'dl:last-child dd:last-child a')
	ariaTipBx(spHd.find('.hd_my li > div[aria-owns="hd_lyrMy"]'), 'ul:last-child li:last-child a')
	$(".btn_hdtb_close").on("click",function(){
		$(".header_top_banner").remove()
		spHd.css({'top':0})
	})
	set_header()
	$(window).scroll(function(){set_header()})
	function set_header(){
		var st = $(this).scrollTop();
		if(st > scrHd()){
			spHd.css({'position':'fixed','top':0}).addClass('sdHdr')
		}else{
			spHd.css({'position':'absolute','top':scrHd()}).removeClass('sdHdr')
		}
	}
	function scrHd(){
		if($('.header_top_banner').length > 0 && $('.header_top_banner').hasClass('on')){
			return 80
		}else{
			return 0
		}
	}
	//search_layer
	var hdSch = spHd.find('.schBx')
	var hdSchBt = hdSch.find('.bt.sch')
	var hdSchInp = hdSch.find('.top input')
	var hdSchLabel = hdSchInp.prev('label')
	var hdSchLyr = hdSch.find('.hd_lyrSch')
	var hdSchCls = hdSchLyr.find('.cls button')
	var hdSchDel = hdSchLyr.find('.bt_del')
	var keyBx = hdSchLyr.find('.key')
	var autoBx = hdSchLyr.find('.auto')

	hdSchBt.on('click', function(e){
		e.preventDefault()
		hdSchLyr.show()
		hdSch.attr('aria-expanded', 'true')
	})

	hdSchInp.on('change keyup input', function() {
		hdSchLyr.show()
		hdSch.attr('aria-expanded', 'true')
		if($(this).val().length > 0){
			autoBx.show()
			keyBx.hide()
			hdSchDel.show()
		}else{
			autoBx.hide()
			keyBx.show()
			hdSchDel.hide()
		}
	})
	hdSchInp.on('focus', function() {
			hdSchLabel.hide()
	})
	hdSchInp.on('focusout', function() {
			if($(this).val().length > 0){ return false }
			hdSchLabel.show()
	})
	hdSchDel.on('click', function(){
		hdSchInp.val('').focus()
		autoBx.hide()
		keyBx.show()
		hdSchDel.hide()
	})
	hdSchCls.on('click', function(){
		hide_schLyr()
	})
	$('body').click(function(e){
		if(hdSchLyr.css('display')=='block' && !hdSch.find('*').is(e.target) && $(e.target).attr('class') !== 'del'){ 
			hide_schLyr()
		}
	})
	hdSchCls.keydown(function(e){
		if(e.keyCode == 9 && !e.shiftKey){ hide_schLyr();$('.hd_my .sch').focus() }
	})
	hdSchInp.keydown(function(e){
		if(e.keyCode == 9 && e.shiftKey){ hide_schLyr();$('.hd_my .sch').focus() }
	})
	function hide_schLyr(){
		hdSch.attr('aria-expanded', 'false')
		hdSchLyr.hide() 
	}
}

function ariaTipBx(box, lastEl){
	box.each(function(){
		var tipBx = $(this)
		var tipBt = tipBx.find('> a, > button')
		var tipLyr = $('#'+tipBx.attr('aria-owns'))
		tipBt.mouseover(show_tipLyr).focus(show_tipLyr)
		tipBx.mouseleave(hide_tipLyr)
		function show_tipLyr(){tipBx.attr('aria-expanded','true');tipLyr.show()}
		function hide_tipLyr(){tipBx.attr('aria-expanded','false');
			setTimeout(function(){
				tipLyr.hide()
			},10)
		}
		tipBt.keydown(function(e){
			if(e.keyCode == 9 && e.shiftKey){ hide_tipLyr() }
		})
		tipBx.find(lastEl).keydown(function(e){
			if(e.keyCode == 9 && !e.shiftKey){ hide_tipLyr() }
		})
	})
}
function scrollCheck(){
	var winScroll
	var lastScroll = 0
	var delta = 5
	var hd_h = $('#header').outerHeight(true)
	$(window).scroll(function(event){ winScroll = true })
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
}
function fnBtTop(){
	$('.fxdTop').hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > chkBtTop()) {
			$('.fxdTop').fadeIn(200)
		} else {
			$('.fxdTop').fadeOut(200)
		}
	});
	function chkBtTop(){
		if($('.wing_menu .wm_right').length>0){
			return parseInt($('.wing_menu').css('top')) + $('.header_top_banner').outerHeight(true) - 10
		}else{
			return 100
		}
	}
	$('.fxdTop a').on("click", function(){
		$("html,body").animate({scrollTop: 0}, 300);
		return false;
	})
}
//gtTabs
function gtTabs(selector, target, random, swiper, slideNum, slideType, slideAuto, slidePgSlt, slideGroup, slideLoopNum){
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
	if(swiper===true){
		setSwiper(slideNum, slideType, slideAuto, slidePgSlt, slideGroup, slideLoopNum)
	}
	btn.on('click', function(e){
		var $thisBt = $(this)
		e.preventDefault()
		if($thisBt.attr('aria-selected') != 'true'){
			$thisBt.attr('aria-selected', 'true').siblings('button').attr('aria-selected', 'false')
			targetAll.hide()
			activeTarget().show()
			setSwiper(slideNum, slideType, slideAuto, slidePgSlt, slideGroup, slideLoopNum)
			if($(this).attr('data-focus') !== undefined){
				activeTarget().find($(this).attr('data-focus')).focus()
			}
		}else{
			return false
		}
	})
	function activeTarget(){return $('#'+target+$this.find("button[aria-selected='true']").index())}
	function setSwiper(slideNum, slideType, slideAuto, slidePgSlt, slideGroup, slideLoopNum){
		if(!activeTarget().find('.goods_list').hasClass('ready')){
			var swiper_id = 'swiper_'+target+$this.find("button[aria-selected='true']").index()
			activeTarget().find('.goods_list').attr('id',swiper_id)
			setMultiBn(swiper_id,slideNum, slideType, slideAuto, slidePgSlt, slideGroup, slideLoopNum)
		}
	}
}

function setMultiBn(Idx, num, type, auto , pgSlt, group, loopNum, outCtr){
	var $Idx = $('#'+Idx)
	var slideNum = $Idx.find('.swiper-slide').length
	var bnLoop = true
	var bnAuto = ''
	var bnPage = ''
	var bnPgClick = false
	var bnloopNum = ''
	var sDiv
	var bnGroup = 1
	var clone_active = false
	var bnSpeed = 800

	if($Idx.attr('data-center3')=='true'){
		$Idx.find('.swiper-slide:last-child').clone().prependTo('#'+Idx+' .swiper-wrapper')
		$Idx.find('.swiper-slide:last-child').remove()
	}
	if($Idx.find('.btWish').length > 0){
		var wishBt = $Idx.find('.btWish')
		wishBt.each(function(){
			if($(this).hasClass('brd')){
				$(this).attr('data-wish',$Idx.attr('id')+'_brd'+'_'+$(this).parents('.swiper-slide:first').index())
			}else{
				$(this).attr('data-wish',$Idx.attr('id')+'_'+$(this).parents('.swiper-slide:first').index()+'_'+$(this).parents('li:first').index())
			}
		})
	}
	if($Idx.attr('data-clone')=='active'){
		clone_active = true
	}
	if($Idx.attr('data-speed') !==undefined){
		bnSpeed = $Idx.attr('data-speed')
	}
	if(outCtr !==undefined){ 
		sDiv = $(outCtr)
	}else{
		sDiv = $Idx.siblings('div')
	}
	if(slideNum >= num){
		if($Idx.attr('data-view')=='auto'){
			num = 'auto'
		}
		if(loopNum){bnloopNum = loopNum}
		if(auto){bnAuto = 4000}
		if(type=='pgNum'){
			if(group !==undefined){
				$Idx.siblings('div').find('.total').text(Math.ceil(slideNum/group))
			}else{
				$Idx.siblings('div').find('.total').text(slideNum)
			}
		}
		if(type=='pgNum2'){
			$Idx.siblings('div').find('.total').text(addIpInt( Math.ceil(slideNum/group))  )
		}
		if(type=='pgDot'){
			bnPgClick = true
			if(pgSlt){
				bnPage = pgSlt
			}else{
				bnPage = '.' + $Idx.parent('div:first').attr('class') + ' .swiperPg'
			}
		}
		if(group !==undefined){bnGroup = group}
		var Idx = new Swiper('#'+Idx,{
			loop: bnLoop,
			autoplay: bnAuto,
			speed: bnSpeed,
			slidesPerView: num,
			slidesPerGroup: bnGroup,
			loopedSlides: bnloopNum,
			createPagination:false,
			pagination: bnPage,
			paginationClickable: bnPgClick,
			simulateTouch:false,
			slideDuplicateClass:'clone',
			onSwiperCreated: function(){ 
				$('#'+Idx).addClass('ready')
				$Idx.find('.clone').attr('aria-hidden','true')
				$Idx.find('.clone').find('a, button').attr('tabindex',-1)
				// 서버에서 리턴값을 받아 on/off 필요하여 개발단에서 처리
				// if($Idx.find('.btWish').length > 0){
				// 	fnSlideWish('#'+$Idx.attr('id'))
				// }
				if($Idx.hasClass('goods_list')){
					setGdLst('#' + $Idx.attr('id'))
				}	
			},
			onSlideChangeStart: function(){
				if(clone_active){ setActive() }
			},
			onSlideChangeEnd: function(){
				if(type=='pgNum'){multiBnIndex()}
				if(type=='pgNum2'){multiAddBnIndex()}
			}
		})
		if($Idx.attr('data-center3')=='true'){
			$Idx.find('.swiper-slide a').on('click', function(e){
				if($(this).parents('li:first').hasClass('activeBn')){
					e.preventDefault();Idx.swipePrev()
				}
				if($(this).parents('li:first').prev().prev().hasClass('activeBn')){
					e.preventDefault();Idx.swipeNext()
				}
			})
		}
		if(clone_active){ 
			setActive() 
			$Idx.find('.swiper-slide a, .swiper-slide button').on('click', function(e){
				if(!$(this).parents('.swiper-slide').hasClass('swiper-slide-visible')){
					e.preventDefault()
					return false
				}
			})
		}
		if(type=='pgNum'){multiBnIndex()}
		if(type=='pgNum2'){multiAddBnIndex()}
		if(auto){
			$Idx.hover(
				function () { Idx.stopAutoplay()}, 
				function () { if(sDiv.find('.play').css('display')=='none'){Idx.startAutoplay()}}
			)
			sDiv.find('.play, .stop, .prev, .next').hover(
				function () { Idx.stopAutoplay()}, 
				function () { if(sDiv.find('.play').css('display')=='none'){Idx.startAutoplay()}}
			)
			sDiv.find('.play').on('click', function(e){
				e.preventDefault();Idx.startAutoplay();
				$(this).hide();
				sDiv.find('.stop').css({'display':'block'}).focus();
			})
			sDiv.find('.stop').on('click', function(e){
				e.preventDefault();Idx.stopAutoplay();
				$(this).hide();
				sDiv.find('.play').css({'display':'block'}).focus();
			})
			$Idx.find('.swiper-slide a, .swiper-slide button').each(function(){
				var pIdx = ($(this).parents('.swiper-slide:first').index())-($Idx.find('.clone').length/2)
				$(this).bind('focus', function(e) {
					Idx.stopAutoplay()
					if(pIdx == 0){Idx.swipeTo(0, 0, 0)}
				})
				$(this).bind('keydown', function(e) {
					if(e.keyCode == 9){
						Idx.swipeTo(pIdx, 0, 0)
					}
				})
			})
		}
		function setActive(){
			var active_dataIdx = $Idx.find('.swiper-slide-active').attr('data-index')
			$Idx.find('.swiper-slide').each(function(){
				if($(this).attr('data-index') == active_dataIdx){
					$(this).addClass('activeBn')
				}else{
					$(this).removeClass('activeBn')
				}
			})
		}
		function multiBnIndex(){
			if(group !==undefined){
				sDiv.find('.now').text(Idx.activeLoopIndex/group+1)
			}else{
				sDiv.find('.now').text(Idx.activeLoopIndex+1)
			}	
		}
		function multiAddBnIndex(){
			sDiv.find('.now').text( addIpInt(Math.ceil((Idx.activeLoopIndex+1)/group)) )
		}
		function addIpInt(number){
			var rtNum
			if(number<=9){
				rtNum = '0'+ number
			}else{
				rtNum = number
			}
			return rtNum
		}
		sDiv.find('.prev').on('click', function(e){e.preventDefault();Idx.swipePrev()})
		sDiv.find('.next').on('click', function(e){e.preventDefault();Idx.swipeNext()})
		// 서버에서 리턴값을 받아 on/off 필요하여 개발단에서 처리
		// function fnSlideWish(target){
		// 	$(target).find('.btWish').each(function(){
		// 		$(this).on('click', function(){
		// 			var isWishBt = $('.btWish[data-wish="'+$(this).attr('data-wish')+'"]')
		// 			if($(this).attr('aria-pressed') !=='true'){
		// 				isWishBt.attr('aria-pressed', 'true')
		// 				if($(this).hasClass('brd')){
		// 					isWishBt.attr('aria-label', '관심브랜드에서 제거')
		// 				}else{
		// 					isWishBt.attr('aria-label', '관심상품에서 제거')
		// 				}
		// 			}
		// 		})
		// 	})
		// }
	}else{
		sDiv.find('.prev, .next, .swiperPg, .auto').remove()
		$Idx.removeClass('slide').addClass('noSlide')
	}
}

function setGdLst(selector){
	var gdLst = $(selector)
	gdLst.each(function(){
		if(!$(this).hasClass('ready')){ 
			fnTargetGds(this)
		}
	})
	gdLst.find('> ul > li').each(function(){
		var $this = $(this)
		var wpOp = $this.find('.bt .op')
		var btOpt = wpOp.find('> button')
		var gdOptLyr = btOpt.next('.lyr')
		$this.find('*').on('focus mouseover', function(){ $this.addClass('active') })
		$this.find('*').on('focusout mouseleave', function(){ $this.removeClass('active') })
		if(gdOptLyr.length > 0){
			btOpt.mouseover(show_gdOptLyr).focus(show_gdOptLyr)
			wpOp.mouseleave(hide_gdOptLyr)
			$this.find('a, .vw button, .wn button').focus(hide_gdOptLyr)
			function show_gdOptLyr(){
				$this.siblings('li').find('.bt .op .lyr').hide()
				gdOptLyr.show()
				btOpt.addClass('on')
			}
			function hide_gdOptLyr(){
				//gdOptLyr.hide()
				$this.parents('ul:first').find('li .bt .op .lyr').hide()
				btOpt.removeClass('on')
			}
			
		}
	})

}
function fnTargetGds(target){
	// 서버에서 리턴값을 받아 on/off 필요하여 개발단에서 처리
	// $(target).find('.btWish').each(function(){
	// 	$(this).on('click', function(){
	// 		if($(this).attr('aria-pressed') !=='true'){
	// 			$(this).attr('aria-pressed', 'true')
	// 			if($(this).hasClass('brd')){
	// 				$(this).attr('aria-label', '관심브랜드에서 제거')
	// 			}else{
	// 				$(this).attr('aria-label', '관심상품에서 제거')
	// 			}
	// 		}
	// 	})
	// })
}
function sqcAin(sqc, dly, dlt){
	for (var  i = 0; i < $(sqc).length; i++) {
		$(sqc).eq(i).each(function() {
			var $this = $(this)
			$this.delay(dly*i).animate({
				opacity:0
			},{
				duration: dlt,
				done: function(now, fx){
					$this.css({transform:'translate3d(0, 0, 0)',opacity:1})
				}
			})
		})
	}
}
function setGvpPlayer(selector){
	var allgvp = $('.gvpPlayer')
	var gvp = $(selector).find('.gvpPlayer')
	gvp.attr('tabindex',0)
	if(gvp.find('.vpYoutube').length > 0){  //youtube
		setTimeout(function(){
			gvp.find('.vpYoutube').each(function(){
				var divId = $(this).attr('id')
				var vpId = $(this).attr('data-vpId')
				var vpWidth = $(this).attr('data-vpWidth')
				var vpHeight = $(this).attr('data-vpHeight')
				var ytBtn = $(this).parent('.gvpPlayer').find('.btPlay')
				var stBtn = $(this).parent('.gvpPlayer').find('.btStop, .close')
				$(this).attr('wmode','transparent')
				var divId = new YT.Player(divId, {
					width: vpWidth,
					//height: vpHeight,
					videoId: vpId,
					playerVars: {
						enablejsapi:1,
						rel: 0,
						wmode: 'transparent',
						modestbranding: 1,
						fs: 0,
						showinfo: 0,
						controls: 1,
						autohide: 1,
						loop: 1,
						playlist: vpId
					},
					events: {
						'onStateChange': onPlayerStateChange,
						'onReady' : setVpBtns
					}
				})
				function onPlayerStateChange(event){
					if(divId.getPlayerState() == 0){
						ytBtn.show()
					}else if(divId.getPlayerState() == 1){
						ytBtn.hide()
					}else if(divId.getPlayerState() == 2){
						ytBtn.show()
					}else if(divId.getPlayerState() == 3){
						ytBtn.hide()
					}
				}
				function setVpBtns(){
					ytBtn.on('click keydown', function(){
						allvpStop()
						divId.playVideo()
					})
					stBtn.on('click keydown', function(){
						divId.pauseVideo()
					})
				}
			})
		},600)
	}
	gvp.each(function(){ //scroll
		var $gvp = $(this)
		var $vp = $gvp.find('video')
		var vp = $vp[0]
		$(window).scroll(function () {
			if($(window).scrollTop() > $gvp.offset().top +  $gvp.outerHeight(true)/2){
				if($gvp.find('video').length > 0){
					vp.pause()
				}
				if($gvp.find('iframe').length > 0){
					$gvp.find('.btStop').keydown()
				}
			}
			if($(window).scrollTop() +  $(window).height() < $gvp.offset().top +  $gvp.outerHeight(true)/2){
				if($gvp.find('video').length > 0){
					vp.pause()
				}
				if($gvp.find('iframe').length > 0){
					$gvp.find('.btStop').keydown()
				}
			}
		})		
	})
	function allvpStop(){
		allgvp.each(function(){
			if($(this).find('video').length > 0){
				$(this).find('video')[0].pause()
			}
			if($(this).find('iframe').length > 0){
				$(this).find('.btStop').click()
			}
		})
	}		
}
function setGdsVp(){
	$('.boxVp .btVp').on('click', function(){
		$('.boxVp .gvpPlayer').slideDown(300)
	})
	$('.boxVp .close').on('click', function(){
		$('.boxVp .gvpPlayer').slideUp(300)
	})
	$(".goods_view_img ul li a, .goods_detail_txt .spColor button[aria-pressed='false']").on('click', function(){
		if($('.boxVp .gvpPlayer').css('display') == 'block'){
			$('.boxVp .close').click()
		}
	})
}

function fnCtgNav(){
	$('.ctgSpNav > ul > li').each(function(){
		var $this = $(this)
		var btn = $this.find('>.tit button')
		var btnA = $this.find('>.tit a')
		var box = $this.find('> .bx')
		if(btn.attr('aria-expanded') == 'true'){
			btn.attr('aria-expanded', 'true').attr('aria-pressed', 'true')
			box.slideDown(300, function(){
			})
		}
		btnA.on('click', function(){
			btn.triggerHandler('click');
		})
		btn.on('click', function(){
			var winTop = $(window).scrollTop()
			var _notThis = $(this).parent().parent().siblings()
			_notThis.find('.tit button').attr('aria-expanded', 'false').attr('aria-pressed', 'false')
			_notThis.find('.bx').slideUp(300)
			if($(this).attr('aria-expanded') !== 'true'){
				//$this.siblings().find('.tit button').attr('aria-expanded', 'false').attr('aria-pressed', 'false')
				//$this.siblings().find('.bx').slideUp(300)
				$(this).attr('aria-expanded', 'true').attr('aria-pressed', 'true')
				box.slideDown(300)
			}else{
				$this.find('.tit button').attr('aria-expanded', 'false').attr('aria-pressed', 'false')
				$this.find('.bx').slideUp(300)
			}
			$("html,body").animate({scrollTop: winTop}, 300)
		})
	})
}

function fnKeySlide(){
	var keySlide = $('.hd_lyrSch .key .hot')
	var keyItems = keySlide.find('li')
	var kewGds = keyItems.find('.gds')
	var $length = keyItems.length
	var $delay = 4000
	var set_Interval
	var isOver
	var overArea = keySlide.find('*')

	fn_auto()
	go_slide(isActive(),keyItems.eq(0),0)

	keyItems.find('a').each(function(){
		$(this).on('mouseover', function(e){
			e.preventDefault();
			if(!isThis($(this)).hasClass('on')){go_slide(isActive(), isThis($(this)), 0)}
		})
	})

	function go_slide(active,after,time){
		active.removeClass('on').find('.gds').stop().animate({'height':0,'opacity':0},300);
		after.addClass('on').find('.gds').stop().animate({'height':'83px','opacity':1},300);
		//active.removeClass('on').find('.gds').hide()
		//after.addClass('on').find('.gds').slideDown(200)
	}
	function isActive(){return keySlide.find('li.on')}
	function isThis(isA){return keyItems.eq(isA.parents('li:first').index())}
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
	overArea.on('mouseover', function(){isOver = true;fn_auto()})
	overArea.on('mouseleave', function(){isOver = false;fn_auto()})

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
