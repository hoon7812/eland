$(document).ready(function(){
	if($('.utilBar').length>0){
		setUtilBar()
	}
	if($('.goods_list').length>0 && !$('body').hasClass('kims')){
		fnTargetWish('.goods_list')
	}
	if($('.wsCtg').length>0 && !$('body').hasClass('kims')){
		fnTargetWish('.wsCtg')
	}
	if($('.wideSlide').length>0){
		fnSetWideSlide()
	}
	if($('.header_kms').hasClass('main')){
		set_header()
		setScrGnb()
		$(window).scroll(function(){ set_header() })
	}
	if($('.searchLyr').length>0){
		setSearchLyr()
	}
	if($('.header_kms .wsh').length>0 && !$('body').hasClass('kims')){
		$('.header_kms .wsh').on('click', function(){
			if($(this).attr('aria-pressed') !=='true'){
				$(this).attr('aria-pressed', 'true')
			}
		})
	}
	if($('.order_content').length>0 && $('.basketwrap').length<=0 && $('.self_txt').length<=0){
		$('.container').addClass('noMrg')
	}
	if($('.container').hasClass('crt') && $('.basketwrap').length<=0){
		$('.container').addClass('noMrg')
	}
	if($('.goods_best').length>0){
		$('.goods_best').each(function(){
			$(this).find('.swiper-wrapper').css('width',$(this).find('.swiper-slide').length*160)
		})
	}
	if($('.mainDp.deal .goods_list.npg li').length>1){
		var mainNpg = '.mainDp.deal .goods_list.npg'
		if(!$(mainNpg).hasClass('ready')){
			setHrzBnr(mainNpg)
		}
	}

})
// OS CHECK
$(function(){
	var agent = navigator.userAgent.toLowerCase();
	var body = $('body');
	if(agent.match(/(ipad|iphone|ipod)/g)){
		var ios_ver = eval(agent.substr(agent.indexOf('os')+3,1));
		body.addClass('ios '+ios_ver);
	}else{
		if(agent.match(/(android)/i)){
			android_ver = eval(agent.substr(agent.indexOf('android')+8,3));
			body.addClass('android '+android_ver);
		}else{
			body.addClass('pc');
		}
	}
	if (agent.indexOf('safari') != -1 && agent.indexOf('chrome') == -1){ body.addClass('safari')};
	if (agent.indexOf('safari') == -1 && agent.indexOf('chrome') != -1){ body.addClass('chrome')};
	if (agent.indexOf('firefox') != -1){ body.addClass('ff')};
	if (agent.indexOf('crios') != -1){ body.addClass('crios')}; //Chrome for iOS
	if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {body.addClass('ie')};
	if (navigator.userAgent.indexOf('SHV-E210S') > -1  || navigator.userAgent.indexOf('SHW-M440S') > -1 ){body.addClass('galaxy_3')}; // galaxy_3
	if (navigator.userAgent.indexOf('Mi-Pad') > -1){body.addClass('mi_pad')}; // mi_pad
	if (navigator.userAgent.indexOf('galleriadfs') > -1 && agent.match(/(ipad|iphone|ipod)/g)){body.addClass('crios')}; // ios app
	if (navigator.userAgent.indexOf('galleriadfs') > -1 ){body.addClass('app')}; // app check
	if (agent.indexOf('applewebkit/601') > -1 ){body.addClass('iphone6')}; // iphone6/S/PLUS
	if (navigator.userAgent.indexOf('AOS') > -1 ){body.addClass('app_aos')}; // APP ANDROID
	if (navigator.userAgent.indexOf('IOS') > -1 ){body.addClass('app_ios')}; // APP IOS
});
// SCROLL CHECK
$(function(){
	var winScroll
	var lastScroll = 0
	var delta = 5
	var hd_h = $('#header').outerHeight(true)
	$(window).scroll(function(event){ 
		winScroll = true
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
})

//LAYERS - type: screen, full, dim, slide
function openLyr(type,deps,self,lyrWidth,tgIdx) {
	var body = $('body')
	var hdr = $('.header_kms')
	var targetId
	var layer
	var layer_box

	if(tgIdx !== undefined){
		targetId = tgIdx
		layer = $('#'+tgIdx)
		layer_box = layer.find('.layer_box')
	}else{
		targetId = $(self).attr('aria-owns')
		layer = $('#'+targetId)
		layer_box = layer.find('.layer_box')
	}
	if(typeof $(self).attr('data-deps') == 'undefined'){ scrollOff() }
	//deps
	if($(self).attr('data-deps')<=2){
		var pLyr = layer.closest('div[class^=layer_]')
		pLyr.fadeOut(100)
		layer.attr('data-parent',pLyr.attr('id'))
		if($(self).attr('data-deps')==2 && type=='dim'){
			$('#lyrBg_dim_'+pLyr.attr('id')).attr('id','lyrBg_dim_'+targetId)
		}
	}
	//type
	if(type=='screen'){
		layer.show(function(){
			if($('#lyrBg_dim_'+targetId).length <= 0){
				layer.addClass('active').css({ zIndex: 1000 * deps + 100 })
				layer.after('<div class=\'lyrBg_dim\' id=\'lyrBg_dim_'+targetId+'\'></div>')
				$('#lyrBg_dim_'+targetId).css({zIndex: 1000 * deps + 50}).fadeIn(250)
			}
			setTimeout(function(){
				if(!$('body').hasClass('noScroll')){
					scrollOff()
				}
			},300)
		})
	}else if(type=='slide'){
		layer.addClass('active')
		layer.find('.lyrArea').css({'top':hdr.outerHeight(true)+getHdrTop()+'px'})
	}else if(type=='full'){
		if($(self).attr('data-deps')>2){$(self).parents('.layer_full:first').fadeOut(300)}
		layer.fadeIn(300).css({zIndex: 1000 * deps})
		if($('#'+targetId).find('.fixedBtns').length > 0){
			setScrHeight('#'+targetId+' .cont', '#'+targetId+' .hd', '#'+targetId+' .fixedBtns')
			$(window).resize(function(){setScrHeight('#'+targetId+' .cont', '#'+targetId+' .hd', '#'+targetId+' .fixedBtns')})
		}else{
			setScrHeight('#'+targetId+' .cont', '#'+targetId+' .hd')
			$(window).resize(function(){setScrHeight('#'+targetId+' .cont', '#'+targetId+' .hd')})
		}
		if($('body').hasClass('android')){
			$('#'+targetId).find('input[type="text"], input[type="number"], input[type="password"], input[type="search"], input[type="email"]').each(function(){
				$(this).bind('focus', function(){
					$('#'+targetId).find('.cont').animate({scrollTop: $(this).offset().top + $('#'+targetId).find('.cont').scrollTop() - 90 },250)
				})
			})
		}
	}else{
		if(type=='btm-slide'){
			layer.stop().slideToggle(400).css({ zIndex: 1000 * deps + 100 })
		}else{
			layer.fadeIn(200).css({ zIndex: 1000 * deps + 100})
			setTimeout(function(){ layer.css({height:layer.outerHeight(true) + 'px', top: Math.abs((window.innerHeight - layer.outerHeight(true)) /2) + 'px'}) },200)
		}
		$('.container').after('<div class=\'lyrBg_dim\' id=\'lyrBg_dim_'+targetId+'\'></div>')
		if(lyrWidth){layer.find('.layer_box').addClass('fxd').css({width: lyrWidth+'px'})}
		$('#lyrBg_dim_'+targetId).css({zIndex: 1000 * deps + 50}).fadeIn(250)
	}
	/*
	if(layer_box){
		//ios app layer focus
		if($('body').hasClass('ios')){
			layer.find('.layer_box').removeAttr('tabindex')
			layer.find('h3').attr('tabindex',-1).focus()
		}else{
			layer.find('.layer_box').attr('tabindex',0).focus()
		}
	}
	*/
	if(self){$(self).addClass('active_LyrBt')}
	return false;
}

function closeLyr(targetId,type) {
	var body = $('body')
	var layer = $('#'+targetId)
	var parentId = layer.attr('data-parent')

	if(typeof parentId !=='undefined'){
		$('#'+parentId).fadeIn(200);	
		layer.removeAttr('data-parent')
	}else{
		scrollOn()
		//if($('div[class^=lyrBg_]').length===1){
			var activeBt = body.find('.active_LyrBt')
			activeBt.focus()
			activeBt.removeClass('active_LyrBt')
		//}
	}
	if(type=='screen' || type=='slide'){
		layer.removeClass('active')
		if(type=='screen'){
			$('#lyrBg_dim_'+targetId).stop().fadeOut(300, '', function() {$(this).remove()})
			setTimeout(function(){
				layer.hide()
			},300)
		}
	}else{ //full
		if(type=='btm-slide'){
			layer.stop().slideToggle(400);
		}else{
			layer.fadeOut(200)
		}
	}
	if(type=='dim' || type=='btm-slide'){
		$('#lyrBg_dim_'+targetId).stop().fadeOut(100, '', function() {$(this).remove()})
	}
	return false;
}
function setScrHeight(target,topH,btmH,addH){
	var winH = $(window).height()
	var setH = winH - $(topH).outerHeight(true) - $(addH).outerHeight(true) - $(btmH).outerHeight(true)
	$(target).css({'height':setH+'px'})
}
function getHdrTop(){
	if($('.header_kms').length > 0){
		var matrix = $('.header_kms').css('transform').replace(/[^0-9\-.,]/g, '').split(',')
		var matrix_y = matrix[13] || matrix[5];
		return parseInt(matrix_y)
	}	
}
// SCROLL CORE
function scrollOff(pos){
	var body = $('body')
	var header = $('.header_kms')
	var winTop = $(window).scrollTop()
	if(!body.hasClass('isLyr')){
		body.addClass('isLyr')
		$('html,body').attr('data-scroll',winTop)
		if(pos == 'top'){
			$("html,body").scrollTop(0)
		}else{
			$('.contents').css({'margin-top':'-'+winTop+'px'})
		}
		//if(!body.hasClass('pc') && !body.hasClass('ios') && navigator.userAgent.indexOf('NAVER') <= -1 && android_ver < 0){ $('html,body').bind('touchmove', function(e) {e.preventDefault();e.stopPropagation();return false;});}
		$('html,body').bind('touchmove', function(e) {e.preventDefault();e.stopPropagation();return false;});
		//if(!body.hasClass('ios')){
			$('html,body').addClass("noScroll")
		//}
	}
}
function scrollOn(pos){
	var body = $('body')
	var header = $('.header_kms')
	var prm = header.find('.prm')

	//if(!body.hasClass('pc') && !body.hasClass('ios') && navigator.userAgent.indexOf('NAVER') <= -1 && android_ver < 0){$('html,body').unbind('touchmove')}
	$('html,body').unbind('touchmove')
	$('html,body').removeClass("noScroll")
	if(pos !== 'top'){
		$('.contents').css({'margin-top':0})
	}
	$('html,body').scrollTop($('body').attr('data-scroll'))
	setTimeout(function(){
		body.removeClass('isLyr')
	},300)
}
function setScrGnb(){
           var gnbBx = $('.header_kms.main').find('.hrzScroll')
           var gnbStart = gnbBx.find("a[aria-selected='true']").parent('li:first').index()
           gnbBx.find('ul').css({'transform':'translate3d(0, 0, 0)'})
           var dataLeft = parseInt(gnbBx.attr('data-left'))
           var gnbBxStart = gnbBx.find("a[aria-selected='true']").parent('li:first').index()
           var gnbBxLeft = gnbBx.find('li').eq(gnbBxStart).offset().left

           if(!(gnbBx.attr('data-left')== undefined || gnbBx.attr('data-left') == "")){
                     gnbBx.scrollLeft(dataLeft)
                     setTimeout(function(){
                                var gnbLeft = gnbBx.find('li').eq(gnbStart-1).offset().left
                                //var gnbScrLeft = gnbLeft + dataLeft - 6 - $(window).width()/2 + gnbBx.find('li').eq(gnbStart).outerWidth(true)/2 +8
								var gnbScrLeft = gnbLeft + dataLeft - 6
								if(gnbStart==0){
									gnbBx.stop().animate({scrollLeft: 0 },300);
								}else{
									gnbBx.stop().animate({scrollLeft: gnbScrLeft },300);
								}
                     },10)
           }else{
                     setTimeout(function(){
                                //gnbBx.stop().animate({scrollLeft: gnbBxLeft - 6 - $(window).width()/2 + gnbBx.find('li').eq(gnbBxStart).outerWidth(true)/2 + 8 },300);
                                var gnbLeft = gnbBx.find('li').eq(gnbStart-1).offset().left
								var gnbScrLeft = gnbLeft - 10
								if(gnbStart==0){
									gnbBx.stop().animate({scrollLeft: 0 },300);
								}else{
									gnbBx.stop().animate({scrollLeft: gnbScrLeft },300);
								}
                     },10)
           }
           return false
}
function set_header(){
	var body = $('body')
	var hdr = $('.header_kms.main')
	var hdd = hdr.find('.head')
	var hdrH = hdd.outerHeight(true)
	if(!body.hasClass('isLyr')){
		var st = $(this).scrollTop();
		if(st > hdrH){
			if(body.hasClass('scrollDown')){
				hdr.css({'transform':'translate3d(0,-'+hdrH+'px,0)'})
				body.addClass('sdHdr')
			}else{
				if(($('.ctgNavWrap').length>0 && st > $('.ctgNavWrap').offset().top - hdr.outerHeight(true))  || ($('.shpOften_wrap').length>0 && st > $('.shpOften_wrap').offset().top - hdr.outerHeight(true))    ){
					hdr.css({'transform':'translate3d(0,-'+hdrH+'px,0)'})
					body.addClass('sdHdr')
				}else{
					hdr.css({'transform':'translate3d(0,0,0)'})
					body.removeClass('sdHdr')
				}
			}
		}else{
			hdr.css({'transform':'translate3d(0,-'+st+'px,0)'})
			body.removeClass('sdHdr')
		}
	}
}

// TOP_BTN
$(function(){
	var btTop = $(".btn_top, .btn_arm")
	btTop.hide();
	if($('.layer_detail').length>0){
		btTop.css('z-index','21')
	}
	if($("div").hasClass("btn_top")){
		$(window).scroll(function () {
			if ($(this).scrollTop() > 20) {
				btTop.fadeIn(200)
			} else {
				btTop.fadeOut(200)
			}
		});
	}
	$('.btn_top').find('button').on("click", function(){
		$("html,body").animate({scrollTop: 0}, 300);
		return false;
	});
	$('body').find('input[type="text"], input[type="number"], input[type="password"], input[type="search"], input[type="email"], textarea').each(function(){
		$(this).on('focus', function(){
			btTop.stop().animate({'right':'-62px'},150)
		})
		$(this).on('focusout', function(){
			btTop.stop().animate({'right':'15px'},150)
		})
	})
});


function checkKor(selector){
	selector.each(function(){
		var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
		if(check.test($(this).text())){
			$(this).addClass('kor')
		}
	})
}

// UTILLBAR
function setUtilBar(){
	var body = $('body')
	var utBar = $('.utilBar')
	var btTop = $('.btn_top, .btn_arm')
	var btmMoveH = utBar.outerHeight(true) + parseInt(utBar.css('bottom'))

	$(window).scroll(function(){
		var wst = $(this).scrollTop();
		if (body.hasClass('scrollDown') && $('.layer_detail').css('display') !== 'block'){
			if(wst >= $(document).height()-$(window).height()-getBtm()){
				btmUp()
			}else{
				btmDown()
			}
		}else{
			btmUp()
		}
	})
	function getBtm(){
		if($('.footer_kms').length>0){
			return $('.footer_kms').outerHeight(true)
		}else{
			return parseInt($('.contents').css('padding-bottom')) + utBar.outerHeight(true)
		}
	}
	function btmDown(){
		utBar.css({'transform':'translate3d(0,'+btmMoveH+'px,0)'}).addClass('off')
		btTop.css({'transform':'translate3d(0,'+btmMoveH+'px,0)'})
	}
	function btmUp(){
		utBar.css({'transform':'translate3d(0,0,0)'}).removeClass('off')
		btTop.css({'transform':'translate3d(0,0,0)'})
	}
}

function fnTargetWish(target){
	$(target).find('button.wish').each(function(){
		$(this).on('click', function(){
			if($(this).attr('aria-pressed') !=='true'){
				$(this).attr('aria-pressed', 'true')
				if($(this).hasClass('brd')){
					$(this).attr('aria-label', '관심브랜드에서 제거')
				}else if($(this).hasClass('ctg')){
					$(this).attr('aria-label', '즐겨찾기 제거')
				}else{
					$(this).attr('aria-label', '관심상품에서 제거')
				}
			}
		})
	})
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
//WideSlide
function fnSetWideSlide(){
	$('.wideSlide').each(function(){
		var $wideSlide = $(this)
		var wideSlideIdx = $wideSlide.attr('id')
		var wItems = $wideSlide.find('.swiper-slide').length
		if(wItems > 1){
			setWideSlide(wideSlideIdx)
		}else{
			$wideSlide.find('.swiperCtr').remove()
		}
		function setWideSlide(wideSlideIdx){
			$wideSlide.find('.total').text(wItems)
			$wideSlide.find('.swiper-slide').each(function(){
				$(this).attr('aria-label', ($(this).index()+1) + ' of ' + wItems)
			})
			var wideSlideIdx = new Swiper($('#'+wideSlideIdx), {
				loop: true,
				speed: 600,
				slideDuplicateClass: 'clone',
				onInit: function(){ 
					$wideSlide.addClass('ready')
					$wideSlide.find('.clone').attr('aria-hidden','true')
					$wideSlide.find('.clone a').attr('tabindex', -1)
				},
				onSlideChangeEnd: function(swiper){
					$wideSlide.find('.now').text(swiper.realIndex+1)
				}
			})
			$wideSlide.find('.now').text(wideSlideIdx.realIndex+1)
		}
	})
}
// topMainBn
function fnTopMainBn(TopId, pview, auto, pg, txt, lp){
	var $TopBn = $('#'+TopId)
	var topItems = $TopBn.find('.swiper-slide').length
	var loopedSlidesNum = ''
	var pgSelector = ''
	var pgClick = false
	var pgType = ''
	var pgLoop = (lp === true || lp == undefined) ? true : false;
	var bnCenter = false
	if(topItems > 1){
		if(pview > 1){loopedSlidesNum = 4}
		if(pg == 'num'){ $TopBn.find('.total').text(topItems) }
		if(pg == 'dot'){
			pgSelector = '#'+TopId+' .swiper-pagination'
			pgType = 'bullets'
			pgClick = true
		}
		if(pg == 'pro'){
			pgSelector = '#'+TopId+' .swiper-pagination'
			pgType = 'progress'
		}
		if($TopBn.attr('data-align') === 'center'){
			bnCenter = true
		}
		$TopBn.find('.swiper-slide').each(function(){
			$(this).attr('aria-label', ($(this).index()+1) + ' of ' + topItems)
		})
		var TopId = new Swiper($('#'+TopId), {
			loop: pgLoop,
			slidesPerView: pview,
			loopedSlides: loopedSlidesNum,
			speed: 800,
			pagination : pgSelector,
			paginationClickable: pgClick,
			paginationType: pgType,
			//autoHeight: true,
			centeredSlides: bnCenter,
			slideDuplicateClass: 'clone',
			onInit: function(swiper){ 
				$TopBn.addClass('ready')
				$TopBn.find('.clone').attr('aria-hidden','true')
				$TopBn.find('.clone').find('a, button').attr('tabindex',-1)
				if($TopBn.find('.clone .wish').length > 0){ fnWishBt() }
				if($TopBn.attr('data-type') === 'text_front'){ 
					$TopBn.find('.swiperTxt').find('.txt:first-child').addClass('on')
				}
			},
			onSlideChangeStart: function(){
				if($TopBn.attr('data-type') === 'text_front'){ fnfrntText() }
				if($TopBn.attr('id') == 'brdMainBn'){
					$('.brdTop.art').css({'background': $TopBn.find('.swiper-slide-active').data('bg')})
				}
			},
			onSlideChangeEnd: function(){
				if(pg == 'num'){$TopBn.find('.now').text(TopId.realIndex+1)}
			}
		})
		if(pg == 'num'){ $TopBn.find('.now').text(TopId.realIndex+1) }
		if(auto){
			TopId.params.autoplay = 3000
			TopId.params.autoplayDisableOnInteraction = false
			TopId.startAutoplay()
			$TopBn.find('.stop').on('click', function(e){
				e.preventDefault();TopId.stopAutoplay()
				$(this).hide();$TopBn.find('.play').show().focus()
			})
			$TopBn.find('.play').on('click', function(e){
				e.preventDefault();TopId.startAutoplay()
				$(this).hide();$TopBn.find('.stop').show().focus()
			})
			$TopBn.find('.swiper-wrapper').on('focusin', function(){
				TopId.stopAutoplay()
				$TopBn.find('.stop').hide()
				$TopBn.find('.play').show()
			})
		}
		setTimeout(function(){
			if($('#lyr_noticeBn').length>0){
				if($('#lyr_noticeBn').css('display')=='block'){
					TopId.stopAutoplay()
					$('#lyr_noticeBn').find('.play').click()
				}
				$('#lyr_noticeBn').find('.bt button').on('click', function(){
					TopId.startAutoplay()
					$('#lyr_noticeBn').find('.stop').click()
				})
			}
		},500)
		if($TopBn.find('.swiper-button-prev').length > 0){
			$TopBn.find('.swiper-button-prev').on('click', function(){TopId.slidePrev()})
		}
		if($TopBn.find('.swiper-button-next').length > 0){
			$TopBn.find('.swiper-button-next').on('click', function(){TopId.slideNext()})
		}
		function fnfrntText(){
			var txtItem = $TopBn.find('.swiperTxt').find('.txt')
			txtItem.removeClass('on')
			txtItem.eq(TopId.realIndex).addClass('on')
		}
		function fnWishBt(){
			$TopBn.find('.clone .wish').each(function(){
				$(this).on('click', function(){
					fn_wishOn(this)
				})
			})
		}
	}else{
		$TopBn.addClass('noSwiper')
		$TopBn.find('.swiperCtr, .swiperPg').remove()
		if($TopBn.attr('data-type') === 'text_front'){ 
			$TopBn.find('.swiperTxt').find('.txt:first-child').addClass('on')
		}else{
			if($TopBn.find('.txt').length > 0){
				$TopBn.find('.txt').css({'opacity':1})
			}
		}
	}

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
function msgCart(btn){
	var msgLyrCart = $('.lyr_alert_cart')
	if($(btn).attr('aria-pressed') !=='true' && msgLyrCart.css('display')!=='block'){
		$(btn).attr('aria-pressed', 'true')
		isMsg= true
		msgLyrCart.stop().fadeIn(100, '', function() {$(this).addClass('active')})
		setTimeout(function(){
			msgLyrCart_remove()
		},1000)
		function msgLyrCart_remove(){
			setTimeout(function(){
				msgLyrCart.stop().fadeOut(200, '', function() {
					msgLyrCart.removeClass('active').hide()
				})
			},300)
		}
	}
}
// SEARCH_LAYER
function setSearchLyr(){
	var body = $('body')
	var schLyr = $('.searchLyr')
	var btOpen = $('.header_kms.main .btSch .sch, .header_kms .btH .sch, .header_kms.sch .opnSchLyr, .header_kms.sch .btDel')
	var schInput = schLyr.find('.hd input')
	var schDel = schLyr.find('.hd .del')
	var btClose = schLyr.find('.close')
	var keyBx = schLyr.find('.keyWrap')
	var autoBx = schLyr.find('.autoWrap')
	var contain = $('container')

	$('.cont').scroll(function () {
		if(schLyr.find('.cont').scrollTop() > 0) {
			schLyr.find('.hd').addClass('fxd')
		}else{
			schLyr.find('.hd').removeClass('fxd')
		}
	})

	schInput.attr('autocomplete','off')
	btOpen.on('click', function(){
		schLyr.fadeIn(200)
		if(!schLyr.hasClass('ready')){
			setSchCont()
			schLyr.addClass('ready')
		}
		if($(this).hasClass('hdSch')){
			var schInpText = $(this).find('span').text()
			schInput.val(schInpText)
		}
		scrollOff('top')
		$(this).addClass('sch-activeBt')
		schInput.trigger('focus')
		//schLyr.animate({scrollTop: 0}, 10, function(){
			//scrollOff()
			//setTimeout(function(){
				//schInput.trigger('focus')
			//},150)
		//})
	})
	btClose.on('click', function(){
		schLyr.fadeOut(100)
		scrollOn('top')
		setTimeout(function(){
			$('.sch-activeBt').focus().removeClass('sch-activeBt')
		},100)
	})

	function setSchCont(){
		setScrHeight('.searchLyr .cont', '.searchLyr .hd')
		$(window).resize(function(){setScrHeight('.searchLyr .cont', '.searchLyr .hd')})
	}
	schInput.bind('change keyup input focus', function() {
		if($(this).val().length > 0){
			schDel.fadeIn(100)
			autoBx.show()
			keyBx.hide()
		}else{
			schDel.fadeOut(100)
			autoBx.hide()
			keyBx.show()
		}
	})
	schDel.on('click', function(){
		schInput.val('')
		schDel.fadeOut(100)
		autoBx.hide()
		keyBx.show()
	})
	$('body').on('click touchstart', function(e){
		if($('body').hasClass('ios') && schLyr.css('display')=='block' && schLyr.find('.cont *').is(e.target) ){ 
			schInput.blur()
		}
	})
}

function fnCtgNav(){
	var ctgNav = $('.ctgNavSd')
	var btOpn = ctgNav.find('.navBt button')
	var lstBx = ctgNav.find('.lst')
	var nvStart

	setScrNav()

	if($('#shpBst_tabs').length>0){
		$('#shpBst_tabs').find('button').on('click', function(){
			setScrNav()
		})
	}
	if($('.ctgNavWrap').offset().top == parseInt($('.contents').css('padding-top'))){
		$('.ctgNavWrap').addClass('tpDim')
	}
	function setScrNav(){
		setTimeout(function(){
			if($('#shpBst_tabs').length>0){
				if($('#shpBst_0').attr('aria-selected')=='true'){
					nvStart = lstBx.find("ul[data-ctg='food']").find("a[aria-selected='true']").parent('li:first').index()
				}else{
					nvStart = lstBx.find("ul[data-ctg='life']").find("a[aria-selected='true']").parent('li:first').index()
				}
			}else{
				nvStart = lstBx.find("a[aria-selected='true']").parent('li:first').index()
			}
			if(nvStart !== undefined || ctgNav.attr('aria-expanded') == 'false'){
				if($(window).width()>768){
					lstBx.stop().animate({scrollLeft: lstBx.find('li').eq(nvStart).offset().left-5-(($(window).width()-768)/2)}, 150);
				}else{
					if($('#shpBst_tabs').length>0){
						if($('#shpBst_0').attr('aria-selected')=='true'){
							lstBx.stop().animate({scrollLeft: lstBx.find("ul[data-ctg='food']").find('li').eq(nvStart).offset().left-5}, 150);
						}else{
							lstBx.stop().animate({scrollLeft: lstBx.find("ul[data-ctg='life']").find('li').eq(nvStart).offset().left-5}, 150);
						}
					}else{
						lstBx.stop().animate({scrollLeft: lstBx.find('li').eq(nvStart).offset().left-5}, 150);
					}
				}
			}
		},300)
	}
	function check_ctgNavFixed(){
		if($('.ctgNavWrap').hasClass('tpDim')){
			return true
		}else{
			return false
		}
	}
	btOpn.on('click', function(e){
		e.preventDefault()
		if($(this).attr('aria-pressed') !== 'true' && $('#lyrBg_dim_ctgNavSd').length <= 0){
			if(check_ctgNavFixed()){
				scrollOff()
				$('.footer_kms').after('<div class=\'lyrBg_dim\' id=\'lyrBg_dim_ctgNavSd\'></div>')
				$('#lyrBg_dim_ctgNavSd').css({zIndex:16}).fadeIn(300)
			}
			ctgNav.stop().animate({
				height:'256px'
			},{
				duration: 250,
				done: function(){
					ctgNav.attr('aria-expanded', 'true')
					btOpn.attr('aria-pressed', 'true').attr('aria-label', '카테고리 리스트 접기')
				}
			})
		}else{
			closeCtgNav()
		}
	})
	function closeCtgNav(hmg){
		if($('body').hasClass('noScroll') && hmg !=='mg'){
			scrollOn();
		}
		ctgNav.stop().animate({
			height:'53px'
		},{
			duration: 250,
			done: function(){
				ctgNav.attr('aria-expanded', 'false')
				btOpn.attr('aria-pressed', 'false').attr('aria-label', '카테고리 리스트 펼치기')
				setScrNav()
			}
		})
		$('#lyrBg_dim_ctgNavSd').stop().fadeOut(300, '', function() {
			$(this).remove()
		})
	}
	$('body').on('click touchstart', function(e){
		if(ctgNav.attr('aria-expanded') == 'true' && !ctgNav.find('*').is(e.target) ){ 
			if($('.opnCtgLyr').is(e.target)){
				closeCtgNav('mg')
			}else{
				closeCtgNav()
			}
		}
	})	
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
				var ytBtn = $(this).parent('.gvpPlayer').find('.btPlay')
				var stBtn = $(this).parent('.gvpPlayer').find('.btStop, .close')
				$(this).attr('wmode','transparent')
				var divId = new YT.Player(divId, {
					width: '100%',
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
						playlist: vpId,
						playsinline: 1
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
		},1000)
	}
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
	$('.goods_img .btVp').on('click', function(){
		$("html,body").animate({scrollTop: 0}, 300, function(){
			scrollOff()
		})
		$('.lyr_vp').slideDown(300)
		$('.goods_img').after('<div class=\'lyrBg_dim\' id=\'lyrBg_dim_vp\'></div>')
		$('#lyrBg_dim_vp').css({zIndex:20}).fadeIn(200, function(){
			$('.lyr_vp').find('.btPlay').click()
		})
	})
	$('.lyr_vp .close').on('click', function(){ closeVp() })
	$('body').on('click touchstart', function(e){
		if(!$('.goods_img').find('*').is(e.target) ){ 
			closeVp()
		}
	})	
	function closeVp(){
		$('.lyr_vp').find('.btStop').click()
		if($('body').hasClass('noScroll')){ scrollOn() }
		$('.lyr_vp').slideUp(300, function(){
			$('#lyrBg_dim_vp').stop().fadeOut(200, '', function() {
				$(this).remove()
			})
		})
	}
}
$(function(){
	//$('body').on('click touchstart', function(e){
	//	if($('.lyr_noticeBn').css('display')=='block' && !$('.lyr_noticeBn').find('*').is(e.target) ){ 
	//		closeLyr('lyr_noticeBn','screen')
	//	}
	//})
	if($(".header_kms").hasClass("sch")){
		$(window).scroll(function () {
			if ($(this).scrollTop() > 0) {
				$(".header_kms.sch").addClass('fxd')
			} else {
				$(".header_kms.sch").removeClass('fxd')
			}
		});
	}
	$('.goods_tit .grd .rv a').on('click', function(){
		fnTab(4, 'gtab', 1, 'gcont');
		$("html,body").animate({scrollTop: $('.goods_tab_wrap').offset().top-52}, 300);
		return false;
	})
})

function setHrzBnr(selector){
	var items = $(selector).find('.swiper-slide')
	var HrzWidth = 0
	var HrzBnIdx = $(selector).attr('id')
	for (var k=0; k< items.length; k++){
		HrzWidth = HrzWidth + items.eq(k).outerWidth(true) + parseInt(items.eq(k).css('margin-right'))
	}
	$(selector).find('.swiper-wrapper').css('width',HrzWidth+'px')
	if($(selector).css('display')=='block' && !$(selector).hasClass('ready')){
		if( HrzWidth > $(window).width()){
			setHrzSlide(HrzBnIdx)
		}else{
			$(selector).addClass('noSlide')
		}
	}
}
function setHrzSlide(HrzBnIdx){
	var $HrzBnIdx = $('#'+HrzBnIdx)
	var slideItems = $HrzBnIdx.find('.swiper-slide')
	var HrzBnIdx = new Swiper($('#'+HrzBnIdx), {
		slidesPerView: 'auto',
		createPagination: false,
		loop: false,
		roundLengths: true,
		onInit: function(){ 
			$('#'+HrzBnIdx).addClass('ready')
		}
	})
}

