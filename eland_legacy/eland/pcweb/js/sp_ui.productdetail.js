var isFullview = false; // 상품상세 이미지 크게보기 영역 체크

commonUI.view.detail = commonUI.view.detail || {};
commonUI.view.detail.FullZoom = commonUI.view.detail.FullZoom || {}; //상품상세 이미지 크게보기
commonUI.view.detail.tabFocus = commonUI.view.detail.tabFocus || {}; //탭 포커스 컨트롤
commonUI.view.detail.detailDescription = commonUI.view.detail.detailDescription || {}; //상품 기술서
commonUI.view.detail.detailDesFunc = commonUI.view.detail.detailDesFunc || {};

commonUI.view.listChange = commonUI.view.listChange || {}; // 리스트 스타일 변경
commonUI.view.listChange.wide = commonUI.view.listChange.wide || {};
commonUI.view.listChange.mini = commonUI.view.listChange.mini || {};

/*상품상세 이미지 크게보기*/
commonUI.view.detail.FullZoom = function(){
	var $target = $(".d_dragarea");

	if ( commonUI.isTarget( $target ) ) return;

	this.ready();
}

commonUI.view.detail.FullZoom.prototype = {
	ready : function(){
		var that = this;

		this.zoomLayerOpen();
		if ( isFullview ) return;
		this.init();

		/*$("._onFullzoom").on("click",function(e){
			that.zoomLayerOpen();
			if ( isFullview ) return;
			that.init();

			e.preventDefault();
		});*/

		$("._closeBtn").on("click",function(e){
			that.zoomLayerClose();

			e.preventDefault();
		});
	}
	,zoomLayerOpen : function(){
		commonUI.view.dimmOn();
		$(".img_drag_wrap").addClass("on");
		var dgLyer = $('.img_drag_layer')
		var dgTop
		if($(window).height()>dgLyer.outerHeight(true)){
			dgTop = ($(window).height()-dgLyer.outerHeight(true))/2
		}else{
			dgTop = 0
		}
		dgLyer.css({
			'position' : 'fixed',
			'top': dgTop + 'px' ,
			'left': ($(window).width()-dgLyer.outerWidth(true))/2 + 'px'
		})
	}
	,zoomLayerClose : function(){
		commonUI.view.dimmOff();

		// $("body ,html").removeClass("hidden")

		$(".img_drag_wrap").removeClass("on");
		elevateInit();
	}
	,init : function(){
		commonUI.view.loadingbarOn();

		this.$area = $(".d_dragarea");
		this.thumWideImagesArray = thumWideImagesArray;

		this.thumInit();
		this.dataInit(this.$LastItem.index());
		this.dragInit();

		isFullview = true;
		setTimeout(function(){commonUI.view.loadingbarOff();},300)
	}
	,dragInit : function(){
		var that = this;

		this.$dragTarget = this.$area.find(".d_zoom_view_select");

		this.$dragTarget.ready(function(){
			that.$dragTarget.css({"opacity":"0"})
		})

		this.$dragTarget.load(function(){
			that.sizeChk();

			if ( that.imgCW < that.areaCW && that.imgCH < that.areaCH ){
				commonUI.imgAlignSort(that.$dragTarget);
			}else{
				that.imgAlignInDrag(that.$dragTarget);
				that.dragEngine();
			}
			$(this).animate({"opacity":"1"},250)
		});
	}
	,imgAlignInDrag : function( $target ){
		var that = this;
		$target.css({
			"top": ($(".d_dragarea").height() - $target.height())/2
			,"left": ($(".d_dragarea").width() - $target.width())/2
		});

	}
	,dragEngine : function(){
		var that = this;

		var _containLWd = this.$area.width() - this.$dragTarget.width() + this.$area.offset().left ;
		var _containLHe = this.$area.height() - this.$dragTarget.height() + this.$area.offset().top ;
		var _containRWd = this.$area.offset().left;
		var _containRHe = this.$area.offset().top;
		this.$dragTarget.draggable({
			containment : [ _containLWd , _containLHe , _containRWd , _containRHe ]
			,cursor : "crosshair"
			,addClasses : false
			,scroll : false
		});
		return;
	}
	,dragEnd : function(){
		var that = this;
		this.$dragTarget.draggable({
			"disabled" : true
		})
		return;
	}
	,sizeChk : function(){
		this.imgCW = this.$dragTarget.width();
		this.imgCH = this.$dragTarget.height();
		this.areaCW = this.$area.width();
		this.areaCH = this.$area.height();
	}
	,thumInit : function(){
		var that = this;

		this.$thum = $(".d_drag_thum");
		this.$thumUl = $(".d_drag_thum_ul");
		this.$thumBtnLeft = this.$thum.find("._d_up");
		this.$thumBtnRight = this.$thum.find("._d_down");

		this.setThumList();

		this.$thumPage = this.$thumUl.find(".d_drag_thum_page");
		this.$thumPageCnt = this.$thumPage.length-1;

		this.thumPageIDX = 0;
		this.thumItemIDX = 0;

		this.$thumItem = this.$thumPage.find("a");

		this.$thumPage.eq(this.thumPageIDX).addClass("on");
		this.$thumItem.eq(this.thumItemIDX).addClass("on");

		this.$LastItem = this.$thumItem.eq(this.thumPageIDX);

		if (this.$thumUl.find('li > a').length<6){
			this.$thumBtnLeft.hide();
			this.$thumBtnRight.hide();
		}else{
			this.$thumBtnLeft.show();
			this.$thumBtnRight.show();
		}
		this.thumEvent();

		return;
	}
	,setThumList : function(){
		var that = this;

		var _reData = this.thumWideImagesArray;
		var _reTxt = "";

		for ( var i = 0 ; i < _reData.length ; i++ ){
			var _i = i+1;
			if ( _i % 5 == 1 ){
				_reTxt += '\n<li class="d_drag_thum_page">\n<a href="#">'+_reData[i]+'</a>';
			}else if ( _i % 5 == 0 ||  i+1 == _reData.length ){
				_reTxt += '\n<a href="#">'+_reData[i]+'</a>\n</li>';
			}else{
				_reTxt += '\n<a href="#">'+_reData[i]+'</a>'
			}
		}
		this.$thumUl.html(_reTxt);
	}
	,thumEvent : function(){
		var that = this;
		this.$thumItem.each(function(index){
			var _$this = $(this);
			_$this.on("click",function(e){
				that.dragEnd();
				that.dataInit(index);
				that.thumIcoChk(_$this);
				that.dragInit();

				e.preventDefault();
				return false;
			});
		})
		this.$thumBtnRight.on("click",function(e){
			that.$thumPage.eq(that.thumPageIDX).removeClass("on");
			that.thumPageIDX = ( that.thumPageIDX+1 > that.$thumPageCnt )? 0 : that.thumPageIDX+1 ;
			that.$thumPage.eq(that.thumPageIDX).addClass("on");

			e.preventDefault();
		});
		this.$thumBtnLeft.on("click",function(e){
			that.$thumPage.eq(that.thumPageIDX).removeClass("on");
			that.thumPageIDX = ( that.thumPageIDX-1 < 0 )? that.$thumPageCnt : that.thumPageIDX-1 ;
			that.$thumPage.eq(that.thumPageIDX).addClass("on");

			e.preventDefault();
		});
	}
	,dataInit : function( vals ){
		var _reData = $(this.thumWideImagesArray[vals]).addClass("d_zoom_view_select");
		this.$area.html(_reData);
	}
	,thumIcoChk : function( $target ){
		$target.addClass("on");
		if ( $target != this.$LastItem ) this.$LastItem.removeClass("on");
		this.$LastItem = $target;
	}
}


commonUI.view.listChange = function(){
	var $btns = $(".d_listChangeButton");
	var $detail_list_wide = $(".d_list_change");

	$btns.on("click" , " a " ,function(e){
		if ( $(this).hasClass("buttons_wide")  ){
			commonUI.view.listChangeWide();
		}else{
			commonUI.view.listChangeMini();
		}
		e.preventDefault();
	});
}

commonUI.view.listChangeWide = function(){
	$(".buttons_mini").removeClass("on");
	$(".buttons_wide").addClass("on");

	$(".d_list_change").removeClass("mini");
}

commonUI.view.listChangeMini = function(){
	$(".buttons_wide").removeClass("on");
	$(".buttons_mini").addClass("on");

	$(".d_list_change").addClass("mini");
}

// 200904 수정
commonUI.view.detail.tabFocus = function(e){
	var $target = $(".goods_gnt .d_tab");
	if ( commonUI.isTarget( $target ) ) return;

	var $links = $target.find("a");

	$links.on( "click" , function(e){
		var $thisID = $(this.hash);
		var topMrg
		if($('#wrapper').hasClass('shoopen')){ //슈펜설정
			topMrg = 80
		}else{
			topMrg = 56
		}
		if ( commonUI.isTarget( $thisID ) ) return;

		var _idTop = parseInt($thisID.offset().top) - topMrg;

		$("body , html").animate({"scrollTop":_idTop},200,function(){
			$thisID.focus();
		});
	})
}
// 200904 수정

// 200904 수정
var elevateInit = function(){
	if ( $("html").hasClass("ie8") ){
		var elevateOpts = {
			zoomWindowPosition: 1
            ,zoomWindowHeight: 400
            ,zoomWindowWidth: 400
            ,borderSize: 1
		}
	}else{
		//킴스클럽일때 확대비율 변경
		if(elandmall.global.disp_mall_no == elandmall.global.kimsclub_mall_no){
			var elevateOpts = {
				zoomWindowPosition: 1
				,zoomWindowWidth: 518
				,zoomWindowHeight: 500
				,zoomWindowOffetx: 40
				,scrollZoom: true
				,lensSize : 100
				,zoomLevel: 0.6
				,borderSize: 1
				,zoomWindowFadeIn: 500
				,zoomWindowFadeOut: 500
				,cursor: "crosshair"
				,scrollZoomIncrement: 0.05
				,minZoomLevel: 0.5
				,maxZoomLevel: 0.8
				,zoomLevel: 0.6
			}			
		}else if($('#wrapper').hasClass('shoopen')){ //슈펜설정
			var elevateOpts = {
				zoomWindowPosition: 1
				,zoomWindowWidth: 538
				,zoomWindowHeight: 666
				,zoomWindowOffetx: 40
				,scrollZoom: true
				,lensSize : 200
				,zoomLevel: 0.4
				,borderSize: 1
				,zoomWindowFadeIn: 500
				,zoomWindowFadeOut: 500
				,cursor: "crosshair"
				,scrollZoomIncrement: 0.05
				,minZoomLevel: 0.8
				,maxZoomLevel: 1.2
				,zoomLevel: 0.8
			}
		}else{
			var elevateOpts = {
				zoomWindowPosition: 1
				,zoomWindowWidth: 518
				,zoomWindowHeight: 500
				,zoomWindowOffetx: 40
				,scrollZoom: true
				,lensSize : 100
				,zoomLevel: 0.4
				,borderSize: 1
				,zoomWindowFadeIn: 500
				,zoomWindowFadeOut: 500
				,cursor: "crosshair"
				,scrollZoomIncrement: 0.05
				,minZoomLevel: 0.5
				,maxZoomLevel: 0.8
				,zoomLevel: 0.4
			}
		}
	}
	$("#d_elevate_img").elevateZoom(elevateOpts);
}
// 200904 수정

var elevateDestroy = function(){
	var $target = $("#d_elevate_img");
	$('.zoomContainer').remove();
	$target.removeData('elevateZoom');
	$target.removeData('zoomImage');
}

function elevateSet(){
	var $target = $("#d_elevate_img");
/* [v2] : 추가&수정 */
	var $targetVdo = $("#d_elevate_vdo");
	var isVideo = false;
	if(commonUI.isTarget($target)) return;
	if(!commonUI.isTarget($targetVdo)) {
		$target.hide();
		$targetVdo.show();
		isVideo=true;
	} else {
		$target.show();
		elevateInit();
	}
/* //[v2] : 추가&수정 */
	$target.on("click", function(e) {
		elevateDestroy();
		productDetailFullview();
		return false;
	});

	var $btns = $(".elevate-gallerys");

	$("#elevate_gallery").on("click",".elevate-gallerys",function(e){
		e.preventDefault();

		$(".elevate-gallerys").removeClass("on");
		elevateDestroy();

		var $this = $(this);
/* [v2] : 추가&수정 */		
		$this.addClass("on");
		if($this.data('type')==="video") {
			$targetVdo.show();
			$target.hide();
		} else {
			if(isVideo) {
				stopYoutube(0);//비디오 정지
			}
			$targetVdo.hide();
			$target.show();
			var smallImage = $this.data('image');
			var largeImage = $this.data('zoom-image');
			var viewIDX = $this.data('view-index');
			$target.attr({
				"src" : smallImage
				,"data-zoom-image" : largeImage
			});

			elevateInit();
		}
/* //[v2] : 추가&수정 */		
	})
}

function elevateGalleryRoll(){
	var $target = $("#elevate_gallery");

	if ( commonUI.isTarget( $target ) ) return;

	var gallery_opt = { simulateTouch : false , loop : true}
	var elevateGallery = new Swiper('#elevate_gallery',gallery_opt);
	/*
	 * 160127 -[START] 상세페이지 내에서 스와이퍼 컨트롤을 위해 선언 (이태영)
	 */
	if ($.type(elandmall.goods.swiper) != "object") {
		elandmall.goods.swiper = {};	//스와이퍼 컨트롤을 위해서 선언.
	};
	elandmall.goods.swiper.elevate_gallery = elevateGallery;	//스와이퍼객체 저장;
	/*160127 - [END]*/

	var swiperEle = {
		$target : $('#elevate_gallery')
		,ins : elevateGallery
	};// 최상단 박스 , $target : autoplay - play , status : stop 버튼 관련 , last_idx : autoplay 관련 , ins : swiper instance name

	swiperEle.$target.find(".d_btnLeft").on("click", function(e){
		e.preventDefault();
		swiperEle.ins.swipePrev();
	})
	swiperEle.$target.find(".d_btnRight").on("click", function(e){
		e.preventDefault();
		swiperEle.ins.swipeNext();
	});
	swiperEle.$target.on("keydown", ".swiper-slide" , function(e) {
		var idx = Math.floor($(this).attr('data-index'));
		if(e.keyCode == 9){ swiperEle.ins.swipeTo(idx, 0 , 0 );}
	});

	swiperEle.$target.on("focus", ".swiper-slide" ,function(){
		var idx = Math.floor($(this).attr('data-index'));
		swiperEle.ins.swipeTo( idx, 0 , 0 )
	})
}


commonUI.view.detail.detailDesFunc = function(){
	var commonUIviewdetaildetailDescription = {};
	$(".d_description").each(function(){
		var ids = this.id;
		if ( commonUI.isTarget( $("#"+ids) ) ) return;
		commonUIviewdetaildetailDescription.ids = new commonUI.view.detail.detailDescription(ids);
	})

}
commonUI.view.detail.detailDescription = function( _targetIds ){
	this.init( _targetIds );
}

commonUI.view.detail.detailDescription.prototype = {
	init : function( _targetIds ){
		this.$target = $("#"+_targetIds);
		this.$swiperTarget = this.$target.find(".dt_ve_ct_thumnail");
		this.$targetWideImg = this.$target.find(".dt_ve_ct_img");
		this.$prevBtn = this.$target.find(".d_prev");
		this.$nextBtn = this.$target.find(".d_next");
		this.$wideNextBtn = this.$target.find(".d_wide_next");
		this.$widePrevBtn = this.$target.find(".d_wide_prev");
		this.$itemsLi = this.$swiperTarget.find(".d_slide li");

		this.$LastItemLi = this.$itemsLi.eq(0);

		if ( this.$swiperTarget.find(".d_slide").find("li").length <7 ) {
			this.itemNotFuncInit();
			// detailDescriptionHover( $LastItemLi );
			// detailDescriptionEvtSet( ".swiper-slide a" );
			return
		};

		this.itemFuncInit();
	}

	,itemNotFuncInit : function(){
		this.$prevBtn.hide();
		this.$nextBtn.hide();

		this.itemNotEvtHandler();
		this.$LastItemLi.find("a").trigger("mouseenter");

		// this.$LastItemLi.find("a").trigger("mouseenter");
	}

	,itemNotEvtHandler:function(){
		var that = this;
		this.$itemsLi.on("mouseenter focusin","a",function(e){
			var $this = $(this).parent();
			that.engine($this);
			e.preventDefault();
		})

		this.$wideNextBtn.on("click",function(e){
			var offIDX = parseInt(that.$LastItemLi.index());
			var maxIDX = that.$LastItemLi.parent().find("li").length-1;
			// console.log(maxIDX,offIDX);
			offIDX = ( maxIDX <= offIDX )? offIDX+1 : 0 ;
			// console.log(maxIDX,offIDX);


			var _$target = that.$itemsLi.eq(offIDX);

			that.engine(_$target);

			e.preventDefault();
		})
	}

	,itemFuncInit : function(){
		this.itemEvtHandler();
		this.$LastItemLi.find("a").trigger("mouseenter");
	}

	,itemEvtHandler : function(){
		var that = this;
		this.$itemsLi.on("mouseenter focusin","a",function(e){
			var $this = $(this).parent();
			that.engine($this);
			e.preventDefault();
		})

		this.$widePrevBtn.on("click",function(e){
			var offIDX = this.$LastItemLi.index();
			var maxIDX = this.$LastItemLi.parent().find("li").length-1;
			if ( maxIDX > offIDX && offIDX >= 0) {
				// console.log("true",offIDX)
				var _$target = this.$swiperTarget.find(obj).eq(offIDX+1);
				detailDescriptionHover(_$target);
			}else{
				// console.log("false",offIDX);

				$nextBtn.click();
			}


			e.preventDefault();
		})


	}

	,engine : function( $itemsLi ){
		var _imgSrc = $itemsLi.find(".dt_ve_ct_tn_img").attr("src");

		this.$LastItemLi.removeClass("on");
		$itemsLi.addClass("on");

		this.$LastItemLi = $itemsLi;

		this.$targetWideImg.attr({
			src : _imgSrc
		})
	}

}
// commonUI.view.detail.detailDescription = function(){
// 	if ( commonUI.isTarget( $(".d_description") ) ) return;

// 	$(window).load(function(){


// 	})

// 	function detailDesFunc(){
// 		var $wapper = $(".d_description");

// 		$wapper.each(function(){
// 			var $target = $(this);
// 			var $swiperTarget = $target.find(".dt_ve_ct_thumnail");
// 			var $prevBtn = $target.find(".d_prev");
// 			var $nextBtn = $target.find(".d_next");
// 			var $wideNextBtn = $target.find(".d_wide_next");
// 			var $widePrevBtn = $target.find(".d_wide_prev");
// 			if ( $swiperTarget.find(".swiper-slide").find("li").length <7 ) {
// 				$prevBtn.hide();
// 				$nextBtn.hide();

// 				var $LastItemLi = $swiperTarget.find(".swiper-slide li").eq(0);
// 				detailDescriptionHover( $LastItemLi );
// 				detailDescriptionEvtSet( ".swiper-slide a" );
// 				return
// 			};
// 			// if ( $swiperTarget.find(".swiper-slide").find("li").length <7 ) {
// 			// 	$prevBtn.hide();
// 			// 	$nextBtn.hide();

// 			// 	var $LastItemLi = $swiperTarget.find(".swiper-slide li").eq(0);
// 			// 	detailDescriptionHover( $LastItemLi );
// 			// 	detailDescriptionEvtSet( ".swiper-slide a" );
// 			// 	return
// 			// };

// 			// var swiper_opt = { simulateTouch : false, createPagination: false, paginationClickable : false, loop : true }
// 			// var swiper_ins = new Swiper("#"+$swiperTarget.get(0).id,swiper_opt);
// 			// var swiperEle = {
// 			// 	 $target : $this
// 			// 	 ,ins : swiper_ins
// 			// };

// 			// // $target : 최상단 박스 ,  status : autoplay - play , last_idx : autoplay 관련 , ins : swiper instance name

// 			// swiperEle.$target.on("keypress", ".swiper-slide > li" , function(e) {
// 			// 	var idx = Math.floor($(this).attr('data-index'));
// 			// 	if( e.keyCode == 9 ) swiperEle.ins.swipeTo( idx, 0 , 0);
// 			// 	detailDescriptionHoverInit(".swiper-slide-active li");
// 			// });

// 			// swiperEle.$target.on("focus", ".swiper-slide" ,function(){
// 			// 	var idx = Math.floor($(this).attr('data-index'));
// 			// 	swiperEle.ins.swipeTo( idx, 0  , 0 );
// 			// 	detailDescriptionHoverInit(".swiper-slide-active li");
// 			// })

// 			// swiperEle.$target.find(".swiper-slide-duplicate a").attr('tabindex','-1');
// 			// swiperEle.$target.find(".swiper-slide:not(.swiper-slide-duplicate)").attr('tabindex','0');

// 			// var $LastItemLi = swiperEle.$target.find(".swiper-slide-active li").eq(0);

// 			// detailDescriptionHoverInit( ".swiper-slide-active li" );
// 			// detailDescriptionEvtSet( ".swiper-slide-active a" );
// 			// $prevBtn.on('click',function(e){
// 			// 	swiperEle.ins.swipePrev();
// 			// 	detailDescriptionHoverInit(".swiper-slide-active li");

// 			// 	e.preventDefault();
// 			// })

// 			// $nextBtn.on('click',function(e){
// 			// 	swiperEle.ins.swipeNext();
// 			// 	detailDescriptionHoverInit(".swiper-slide-active li");

// 			// 	e.preventDefault();
// 			// })

// 			// function detailDescriptionEvtSet(obj){
// 			// 	$swiperTarget.on("focusin mouseenter" , obj , function(e){
// 			// 		console.log(e.type)
// 			// 		e.preventDefault();
// 			// 		detailDescriptionHover( $(this).parent() );
// 			// 	})

// 			// 	$wideNextBtn.on("click",function(e){
// 			// 		var offIDX = $LastItemLi.index();
// 			// 		var maxIDX = $LastItemLi.parent().find("li").length-1;
// 			// 		console.log(maxIDX ,offIDX)
// 			// 		if ( maxIDX > offIDX && offIDX >= 0) {
// 			// 			console.log("true",offIDX)
// 			// 			var _$target = $swiperTarget.find(obj).eq(offIDX+1);
// 			// 			detailDescriptionHover(_$target);
// 			// 		}else{
// 			// 			console.log("false",offIDX);

// 			// 			$nextBtn.click();
// 			// 		}

// 			// 		e.preventDefault();
// 			// 	})

// 			// 	$widePrevBtn.on("click",function(e){
// 			// 		var offIDX = $LastItemLi.index();
// 			// 		var maxIDX = $LastItemLi.parent().find("li").length;
// 			// 		if ( maxIDX > offIDX && offIDX >= 1) {
// 			// 			var _$target = $swiperTarget.find(obj).eq(offIDX-1);
// 			// 			detailDescriptionHover(_$target);
// 			// 		}else{
// 			// 			$prevBtn.click();
// 			// 		}

// 			// 		e.preventDefault();
// 			// 	})
// 			// }

// 			// function detailDescriptionHoverInit(obj){
// 			// 	var $onTarget = $swiperTarget.find(obj).eq(0);
// 			// 	detailDescriptionHover( $onTarget );
// 			// }

// 			// function detailDescriptionHover( target ){
// 			// 	var $itemsLi = target;
// 			// 	var $targetWideImg = $this.find(".dt_ve_ct_img");
// 			// 	var imgSrc = $itemsLi.find(".dt_ve_ct_tn_img").attr("src");

// 			// 	$LastItemLi.removeClass("on");
// 			// 	$itemsLi.addClass("on");
// 			// 	$LastItemLi = $itemsLi;

// 			// 	$targetWideImg.attr({
// 			// 		src : imgSrc
// 			// 	})
// 			// }
// 		})

// 	}


// 	function detailDescriptionHover( target ){
// 		var $itemsLi = target;
// 		var $targetWideImg = $this.find(".dt_ve_ct_img");
// 		var imgSrc = $itemsLi.find(".dt_ve_ct_tn_img").attr("src");

// 		$LastItemLi.removeClass("on");
// 		$itemsLi.addClass("on");
// 		$LastItemLi = $itemsLi;

// 		$targetWideImg.attr({
// 			src : imgSrc
// 		})
// 	}
// }



function productDetailFullview(){
	var commonUIviewdetailFullZoom = new commonUI.view.detail.FullZoom(); //상품 확대보기 레이어
}

function productDetailUI(){
	$(window).ready(function(){
		commonUI.view.detail.tabFocus();
		commonUI.view.listChange();
		elevateSet();
		elevateGalleryRoll();

		commonUI.view.detail.detailDesFunc();
	})
}

function productDetailUI_slide(){
	elevateInit();
	elevateGalleryRoll();
}