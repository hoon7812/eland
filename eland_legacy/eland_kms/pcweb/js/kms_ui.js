//KIMS_UI

$(document).ready(function(){
	scrollCheck()
	if($('#header').length > 0){kmsHeaderUI()}
	if($('.fxdTop').length > 0){BtTop()}
	if($('#content').find('.goods_list').length > 0){setGdLst('.goods_list')}
	if($('.goods_view_img ul').length > 0){
		setTimeout(function(){
			$('.goods_view_img ul').removeAttr('tabindex')
		},500)
	}
	if($('.hd_sch.on')){kmsHeaderSch();}
})

$(document).ready (function(){
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
			mode : 'horizontal',
			pagination : $(this).parent().find('.roll_indi')[0],
			paginationElement : "a" ,
			paginationClickable : true
		}
		var swiperSet = new commonUI.view.slideConer($(this))
	});

	$('.box_roll_vertical').each(function(index){
		$(this)[0].opt={};
		$(this)[0].opt={
			autoplay : 2000,
			speed : 300,
			mode : 'vertical',
			pagination : $(this).find('.roll_indi2')[0],
			paginationElement : "a" ,
			paginationClickable : true
		}
		var swiperSet = new commonUI.view.slideConer($(this))
	});

})


//Seach
function kmsHeaderSch(){
	var hdSchCls = $(".cls button,.s_del button,.delL button")
	var hdSchLyr = $(".sch_keyword")

	hdSchCls.on('click', function(){
		hide_schLyr()
	})

	function hide_schLyr(){
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
		var st = $(window).scrollTop();
		if (st == 0){
			$('body').removeClass('scrollUp').addClass('scrollDown'); 
		}else{
			$('body').removeClass('scrollDown').addClass('scrollUp'); 
		}
	}
}


function BtTop(){
	$('.fxdTop a').on("click", function(){
		$("html,body").animate({scrollTop: 0}, 300);
		return false;
	})
}


//cateSwiper
function cateSwiper(Idx, cpLookSize, minnum) {
  var $Idx = $('#'+Idx);
  var $cp_swrapper = '';
  var couponRolling = '';
  var $cp_li = '';
  var $cp_rbtn = '';
  var $cp_lbtn = '';
  var cp_size = 0; //슬라이드사이즈
  var cpLookSize = cpLookSize; //화면에 보여지는 갯수
  var cpLimitSize = 0;
  var currentIDX = 0;
  var normalWrap = $('#'+Idx+' .list_brd');//갯수미만 시 UI가운데정렬

  if($Idx.find('.swiper-slide').length<=cpLookSize){
	  $Idx.addClass('noSlide')
  }
  function init() {
    $cp_swrapper = $('#'+Idx+' .swiper-wrapper');
    $cp_li = $('#'+Idx+' .list_ctg li');
    $cp_rbtn = $('#'+Idx+' .btn_prev');
    $cp_lbtn = $('#'+Idx+' .btn_next');
    cp_size = $cp_li.size();
    if(Idx != 'gnbScroll') {   
			cpLookSize = cpLookSize;
		}else{
			cpLookSize = $('#'+Idx+' .swiper-wrapper .swiper-slide-visible');
		}
    cpLimitSize = cp_size - cpLookSize;//우측 제한 사이즈

    if(cp_size < minnum){//minnum:스크립트 동작 중지+UI 가운데정렬
      $('#'+Idx+' .cp_controll').hide();
      normalWrap.addClass("normal");
    }else{
      $('#'+Idx+' .cp_controll').show();
      normalWrap.removeClass("normal");
    }
    if(cp_size <= cpLookSize) {
      blockBtn();
    } else {      
			if(Idx != 'gnbScroll') {      
			  couponRolling = new Swiper('#'+Idx+' .list_ctg .swiper-container',{
			    paginationClickable: true,
			    moveStartThreshold: 100,
			    slidesPerView : 'auto',
			    simulateTouch : false,    
			    onSlideChangeEnd : function() {
			      var idx = $cp_li.index($('#'+Idx+' .list_ctg .swiper-slide-active'));
			      currentIDX = idx;
			      activeBtn();
			    },
				onSwiperCreated: function(swiper){
					  //kms best tab
					 if($('.shopBestTabWrap').length > 0 && $('.kims .shopBestTabWrap .bestTab').length > 0 ){
						 $('.kims .shopBestTabWrap .bestTab .bTabs button').on('click', function(){
							 swiper.swipeTo(0,0,0);
							  var idx = $cp_li.index($('#'+Idx+' .list_ctg .swiper-slide-active'));
							  currentIDX = idx;
							 activeBtn();
						 })
					 }
				}
			  });

			}else{ 
			  couponRolling = new Swiper('#'+Idx+' .list_ctg .swiper-container',{
			    paginationClickable: true,
			    moveStartThreshold: 100,
			    slidesPerView : 'auto',
			    simulateTouch : false, 
					onSlideChangeEnd:function($target){
						ctrSlide($target);
					},
					onSwiperCreated: function(){
						$('#'+Idx+' .list_ctg .swiper-wrapper').css({width:$('#'+Idx+' .list_ctg .swiper-wrapper').width()+5})
					}
			  });
			} 
			activeBtn();
      initCoponL();
    } 
  }

	function ctrSlide($target){
		var lastList = $('#'+Idx+' .list_ctg .swiper-container .list_brd li').last();
		var ioffset = $('#'+Idx+'').offset();
		var lastListWidth = lastList.width();
		var iWidth = $('#'+Idx+'').width(); //스와이퍼너비 고정
		var iulWidth = $('#'+Idx+' .list_brd').innerWidth(); //li합 너비 유동
		var loffset = lastList.offset();
		var wrapOffsetR = Math.floor(loffset.left + lastListWidth);
		var lastOffsetR = Math.floor(ioffset.left + iWidth);

	  $cp_rbtn = $('#'+Idx+' .btn_prev');
	  $cp_lbtn = $('#'+Idx+' .btn_next');
		$firstChild = $($target.slides[0]);
		$twoChild = $($target.slides[1]);
		$lastChild = $($target.slides.slice(-1)[0]);
		if($firstChild.hasClass('swiper-slide-active')){
			$cp_rbtn.removeClass('active');
		}	
		else if(!$firstChild.hasClass('swiper-slide-visible')&&!$firstChild.hasClass('swiper-slide-active')){
			$cp_rbtn.addClass('active');
		}
		if($twoChild.hasClass('swiper-slide-active')){
			$cp_rbtn.addClass('active');
		}			
		if($lastChild.hasClass('swiper-slide-visible')&&wrapOffsetR<=lastOffsetR){ //맨끝에 도달
			$cp_lbtn.removeClass('active'); //다음버튼지우기
			$cp_rbtn.addClass('active'); //이전버튼생기기
		}
		else if(!$lastChild.hasClass('swiper-slide-visible')){		
			$cp_lbtn.addClass('active'); //다음버튼생기기			
		}
		else if($lastChild.hasClass('swiper-slide-visible')&&wrapOffsetR>lastOffsetR&&iWidth<iulWidth){	//마지막li가 보이지만 조금이라도 왼쪽으로 이동한 경우	
			$cp_lbtn.addClass('active'); //다음버튼생기기			
		}						
	}

  function initCoponL() {
    $cp_rbtn.on('click', function(e){              
      e.preventDefault()
      couponRolling.swipePrev()     
    });//이전 버튼

    $cp_lbtn.on('click', function(e){
      e.preventDefault()
      couponRolling.swipeNext()      
    });//다음 버튼
  }

  function blockBtn() {
    $cp_rbtn.on('click', function(e){
      e.preventDefault();
    });
    $cp_lbtn.on('click', function(e){
      e.preventDefault();
    });
  }

  function activeBtn() {
		var iWidth = $('#'+Idx+'').width(); //스와이퍼너비 고정
		var iulWidth = $('#'+Idx+' .list_brd').innerWidth(); //li합 너비 유동  	
    if(currentIDX==0) {
      $cp_rbtn.removeClass('active'); //이전버튼 지우기
      if(iWidth>iulWidth) { //다음으로가기
        $cp_lbtn.removeClass('active');
        return;
      }      
      $cp_lbtn.addClass('active'); //다음버튼 생기기
    } else {
      $cp_rbtn.addClass('active');
      if(currentIDX==cpLimitSize) { //다음으로가기
        $cp_lbtn.removeClass('active');
        return;
      }
      $cp_lbtn.addClass('active');
    }
  }
	//currentIDX = 현재 액티브된 li 번호 6
	//cpLimitSize = 전체 li에서 visible된 li를 뺀 값 5
  init();

  //a클릭동작셀렉트정의
  var perListCtg = $("#"+Idx+" .list_ctg li a");

  perListCtg.click(function(e){
    //e.preventDefault();
    perListCtg.removeClass("selected");
    $(this).addClass("selected");
  });
}


//slideBn
function slideBn(Idx) {
  var mainBillboard_autoplay;
  var $Idx = $('#'+Idx);
  if ( commonUI.isTarget( $Idx ) ) return;
  var contRoll = $('#'+Idx+' .controller');
  var $btns = $Idx.find(".controller");
  var $btns = {
    prev : $btns.find(".bn_prev"),
    next : $btns.find(".bn_next"),
    stop : $btns.find(".bn_stop"),
    play : $btns.find(".bn_auto"),
  }
  var $page = $Idx.find(".pg_bt a");
  var TIMER = 4000;
  var autoStatus = true;
  var focusStatus = false;
  var forceStop = false; // [V2] : 플레이 버튼 오류 개선을 위한 force Play 추가
  var loop_num = $('#'+Idx+'').find('.swiper-slide').length - 1;
  var clone_active = false

	if(Idx=='mainBn' || Idx=='freshBn'){
		clone_active = true
	}
  var new_arr_bn = new Swiper('#'+Idx+' .swiper_container',{
    spaceBetween:0,
    speed: 1000,
    auto: true,
    simulateTouch : false,
    createPagination: false,
    pagination: '#'+Idx+' .pg_bt .pg',
    paginationElement : "a",
    paginationClickable : true,
    loopedSlides: loop_num,
    slidesPerGroup: 1,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop : true,
    nextButton:'#'+Idx+' .bn_next',
    prevButton:'#'+Idx+' .bn_prev',
	onSwiperCreated: function(){ 
		$('#'+Idx).addClass('ready')
	},
	onSlideChangeStart: function(){
		if(clone_active){ setActive() }
	}
  });           
  var bn_stop = $('#'+Idx+' .controller .btn_stop');
  var bn_play = $('#'+Idx+' .controller .btn_auto');

	if(clone_active){ setActive() }
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
  function init() {
    txtPaging();
    eventHandler();
    autoplay();
    ctrposition();
    commonUI.bodyClickFunc("d_billboard", _bodyClickFn);
    function _bodyClickFn(e) { // body click func
      var $hasTarget = $Idx;
      if (!$hasTarget.is(e.target) && $hasTarget.has(e.target).length === 0) {
        focusStatus = false;
        commonUI.bodyClickOffFunc("d_billboard");
        autoplay();
        e.preventDefault();
      }
    }
  }

  function ctrposition() {
	  var pgWrap = $('#'+Idx+' .pg_bt .pg');
	  var pgWrapW = pgWrap.outerWidth();
	  var pgWrapW2 = pgWrapW/2;
		$('#'+Idx+' .controller .btn_stop').css('left','calc( 50% + '+ pgWrapW2 +'px');
		$('#'+Idx+' .controller .btn_auto').css('left','calc( 50% + '+ pgWrapW2 +'px');
  }
  
  function eventHandler() {
    txtPaging();
    $Idx.hover(function(){
      new_arr_bn.stopAutoplay();
      txtPaging();
    });
    $Idx.mouseleave(function() {
      new_arr_bn.startAutoplay()
      txtPaging();
    });
    $btns.prev.on("click",function(e){
      e.preventDefault();
      new_arr_bn.swipePrev();
      txtPaging();
    })
    $btns.next.on("click",function(e){
      e.preventDefault();
      new_arr_bn.swipeNext();
      txtPaging();
    })  
    $btns.next.on("mouseenter",function(){        
      autostop();
    }) 
    $btns.prev.on("click",function(e){
      autostop();
    })   
    $page.on("click",function(e){
      txtPaging();
    })  
    $Idx.on("mouseenter",function(){
      autostop();
    })
    $Idx.on("mouseleave",function(){
      autoplay();
    })
    bn_stop.on("click", function(e) {
      e.preventDefault();
      txtPaging();
      forceStop = true;
      autoStatus = false;
      focusStatus = false;
      new_arr_bn.stopAutoplay()
      $btns.stop.removeClass("on");
      $btns.play.addClass("on").focus();
      autoplay();                 
    });
    bn_play.on("click", function(e) {
      e.preventDefault();
      txtPaging();
      forceStop = false;
      autoStatus = true;                  
      focusStatus = false;
      new_arr_bn.startAutoplay()
      $btns.play.removeClass("on");
      $btns.stop.addClass("on").focus();
      autoplay();                 
    });
  }
  contRoll.find('.btn_auto').on('click', function(e){
    e.preventDefault();
    new_arr_bn.startAutoplay();
    $(this).hide();
    contRoll.find('.btn_stop').css({'display':'block'}).focus();
  })
  contRoll.find('.btn_stop').on('click', function(e){
    e.preventDefault();
    new_arr_bn.stopAutoplay();
    $(this).hide();
    contRoll.find('.btn_auto').css({'display':'block'}).focus();
  })

  function autoplay() {
	  if (forceStop) {
	    //console.log('stop!!!')
	    new_arr_bn.stopAutoplay()
	    txtPaging();
	    autostop();
	  } else {
	    //console.log('auto GOGO!|||| autoStatus==',autoStatus,' focusStatus==',focusStatus);
	    if (autoStatus && !focusStatus) {
	      txtPaging();
	      autostop();
	      mainBillboard_autoplay = setInterval(function() {
	          new_arr_bn.swipeNext()//billboardNext();
	      }, TIMER)
	    }
	  }
  }

  function autostop() {
    clearInterval(mainBillboard_autoplay);
    new_arr_bn.stopAutoplay()
  }

  function txtPaging() {
    if ($Idx.has('.page')) {
			if ($Idx.find('.lis').length == 3) { //배너1개일경우			
				$Idx.addClass("oneBnSlide");	
	      autoplay();     
			}else if ($Idx.find('.lis').length == 4) { //배너2개일경우
				var current = $('.lis.swiper-slide-active').attr('data-index') * 1 + 1;
	      $Idx.find('.page').html(current + ' / ' + 2);	
			}else{ //배너3개일경우
	      var total = $Idx.find('.lis').length - $Idx.find('.swiper-slide-duplicate').length ;
	      var current = $('.lis.swiper-slide-active').attr('data-index') * 1 + 1;
	      $Idx.find('.page').html(current + ' / ' + total);	
			}
    }
  }    
  
  $(window).ready(function() {
    init();               
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
			setMultiBn(swiper_id, slideNum, slideType, slideAuto, slidePgSlt, slideGroup, slideLoopNum)
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
	if($Idx.attr('data-loop')=='false'){
		bnLoop = false
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
			onSwiperCreated: function(swiper){ 
				$('#'+Idx).addClass('ready')
				$Idx.find('.clone').attr('aria-hidden','true')
				$Idx.find('.clone').find('a, button').attr('tabindex',-1)
				/*서버에서 리턴값을 받아 on/off 필요하여 개발단에서 처리
				if($Idx.find('.btWish').length > 0){
					fnSlideWish('#'+$Idx.attr('id'))
				}
				*/
				if($Idx.hasClass('goods_list')){
					setGdLst('#' + $Idx.attr('id'))
				}
				if(Idx=='KimsDeal'){
					setTimeout(function(){
						swiper.swipeTo(0,0,0)
					},1000)
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
		/*서버에서 리턴값을 받아 on/off 필요하여 개발단에서 처리
		function fnSlideWish(target){
			$(target).find('.btWish').each(function(){
				$(this).on('click', function(){
					var isWishBt = $('.btWish[data-wish="'+$(this).attr('data-wish')+'"]')
					if($(this).attr('aria-pressed') !=='true'){
						isWishBt.attr('aria-pressed', 'true')
						if($(this).hasClass('brd')){
							isWishBt.attr('aria-label', '관심브랜드에서 제거')
						}else{
							isWishBt.attr('aria-label', '관심상품에서 제거')
						}
					}
				})
			})
		}
		*/
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
	/* 
	 * 서버에서 리턴값을 받아 on/off 필요하여 개발단에서 처리
	 *
	$(target).find('.btWish').each(function(){
		$(this).on('click', function(){
			if($(this).attr('aria-pressed') !=='true'){
				$(this).attr('aria-pressed', 'true')
				if($(this).hasClass('brd')){
					$(this).attr('aria-label', '관심브랜드에서 제거')
				}else{
					$(this).attr('aria-label', '관심상품에서 제거')
				}
			} else {
				$(this).attr('aria-pressed', 'false');
				if($(this).hasClass('brd')){
					$(this).attr('aria-label', '관심브랜드에 추가')
				}else{
					$(this).attr('aria-label', '관심상품에 추가')
				}
			}
		})
	})
	*/
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


//cartPop
function msgCart(){
	var msgLyrCart = $('.lyr_alert_cart')
	if(msgLyrCart.css('display')!=='block'){
		isMsg= true
		msgLyrCart.stop().fadeIn(0, '', function() {$(this).addClass('active')})
		setTimeout(function(){
			msgLyrCart.removeClass('active')
			msgLyrCart_remove()
		},1000)
		function msgLyrCart_remove(){
			setTimeout(function(){
				msgLyrCart.stop().hide()
			},300)
		}
	}
}


//radioBtn
function radioBtn(Idx) {
	$(document).on("click", "input[name='radio']", function(){
	  thisRadio = $(this);
	  if (thisRadio.hasClass("Checked")) {
	      thisRadio.removeClass("Checked");
	      thisRadio.prop('checked', false);
	  } else { 
	      thisRadio.prop('checked', true);
	      thisRadio.addClass("Checked");
	  };
	})
}
