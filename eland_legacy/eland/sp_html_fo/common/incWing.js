var wingTag;
wingTag ='<div class="wing_menu">'
+'				<div class="wm_left">'
+'					<div class="wm_adds" id="wingleftBanner">'
+'						<div class="swiper-container">'
+'							<ul class="swiper-wrapper">'
+'								<li class="swiper-slide"><a href="#"><img src="../../images/pcweb/sp_pcweb/temp/bn_66x144_0.jpg" alt=""></a></li>'
+'								<li class="swiper-slide"><a href="#"><img src="../../images/pcweb/sp_pcweb/temp/bn_66x144_0.jpg" alt=""></a></li>'
+'								<li class="swiper-slide"><a href="#"><img src="../../images/pcweb/sp_pcweb/temp/bn_66x144_0.jpg" alt=""></a></li>'
+'							</ul>'
+'						</div>'
+'						<div class="wl_btns">'
+'							<button class="wl_prev d_prev" type="button">이전</button>'
+'							<button class="wl_next d_next" type="button">다음</button>'
+'							<div class="wl_cnt">'
+'								<span class="wlc_idx">1</span>/<span class="wlc_length">1</span>'
+'							</div>'
+'						</div>'
+'					</div>'
+'					<div class="wm_adds">'
+'						<a href="#"><img src="../../images/pcweb/sp_pcweb/temp/bn_66x144_1.jpg" alt=""></a>'
+'					</div>'
+'				</div>'
+''
+'				<div class="wm_right">'
+'					<div class="wm_goods_wrap" tabindex="0">'
+'						<h3>최근 본 상품</h3>'
+'						<div class="wm_goods" id="wmGoods">'
+'							<ul class="d_wg_slider">'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="0">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_0.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>11111(2015년신상) 캐시 아크릴 라운드 풀오버11111(2015년신상) 캐시 아크릴 라운드 풀오버</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="1">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_1.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>전황일 콜라보 남성 캠핑리커버리 샌들 슬리퍼 AFDU79S07</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="2">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_2.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>33333(2015년신상)</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="3">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_3.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>44444(2015년신상)</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="4">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_4.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>55555(2015년신상)</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="2">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_2.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>33333(2015년신상)</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'								<li>'
+'									<a href="#" class="wm_gd_links" data-index="0">'
+'										<img src="../../images/pcweb/sp_pcweb/temp/img_60x80_0.jpg" alt="">'
+'										<span class="wm_gd_info"><strong>11111(2015년신상) 캐시 아크릴 라운드 풀오버11111(2015년신상) 캐시 아크릴 라운드 풀오버</strong>34,132,000</span>'
+'									</a>'
+'									<a href="#delete" class="wm_btn_del">상품 삭제</a>'
+'								</li>'
+'							</ul>'
+'						</div>'
+'						<div class="wm_btns">'
+'							<a href="#" class="wm_bt_prev d_wm_prev" tabindex="-1">이전목록</a>'
+'							<a href="#" class="wm_bt_next d_wm_next" tabindex="-1">다음목록</a>'
+'						</div>'
+'					</div>'
+'				</div>'
+'			</div>'
document.write(wingTag);


						function wl_bn(){
							var wl_banner_ins = new Swiper('#wingleftBanner .swiper-container',{
								speed: 300
								,autoplay: 3000
								,simulateTouch : false
								,createPagination: false
								,paginationClickable : false
								,loop : true
								,onSlideChangeEnd : function() {
									$('.wl_cnt').find('.wlc_idx').text(wl_banner_ins.activeLoopIndex+1);
								}
							});
							var $target = $('#wingleftBanner');
							var wl_swiperEle = { $target : $target , status : true , last_idx : 0 , ins : wl_banner_ins , $prevBtn : $target.find(".d_prev") , $nextBtn :  $target.find(".d_next") };
							wl_swiperEle.$target.hover(
								function (e) { //mouseenter
									wl_swiperEle.ins.stopAutoplay();
									e.preventDefault();
								},
								function (e) { //mouseleave
									if ( wl_swiperEle.status ) wl_swiperEle.ins.startAutoplay();
									e.preventDefault();
								}
								);
							wl_swiperEle.$prevBtn.on('click',function(e){
								wl_swiperEle.ins.swipePrev();
							})

							wl_swiperEle.$nextBtn.on('click',function(e){
								wl_swiperEle.ins.swipeNext();
							})
						}
						$(window).ready(function(){
							wl_bn();
							var total = $('#wingleftBanner').find('.swiper-slide:not(.swiper-slide-duplicate)').length;
							$('.wl_cnt').find('.wlc_length').text(total);
						});


						function wbGoods(){
							var $target = $(".wm_goods_wrap");
							if ( commonUI.isTarget( $target ) ) return ;

							var $wrapper, $links, $btns, $lastOnItems, $itemWrap ,$tabItems;
							var _lastIDX = 0;
							var _IDX = 0;
							var _pageIDX = 0;
							function wbInit(){
								$wrapper = $target.find(".wm_goods");
								$liItems = $target.find("li");
								$links = $target.find(".wm_gd_links");
								$itemWrap = $target.find(".d_wg_slider");
								$btns = {
									prev : $target.find(".d_wm_prev")
									,next :  $target.find(".d_wm_next")
									,del :  $target.find(".wm_btn_del")
								}

								if ( setInit() ) {
									function _bodyClickFn(e){ // body click func
										if (!$wrapper.is(e.target) && $wrapper.has(e.target).length < 1){
											$wrapper.removeClass("active");
											$liItems.removeClass("on");
											commonUI.bodyClickOffFunc( "d_wbGoods" );

											e.preventDefault();
										}
									}

									commonUI.bodyClickFunc( "d_wbGoods" , _bodyClickFn );

									wbEventHanlder();
								};
							}

							function wbEventHanlder(){
								$wrapper.on("mouseenter", ".wm_gd_links" , function(e) {
									var $this = $(this);

									$(this).parent().addClass("on");
								})

								$wrapper.on("mouseleave", "li" , function(e) {
									var $this = $(this);
									//console.log(e.type)

									$wrapper.removeClass("active");
									$this.removeClass("on");
								})

								$wrapper.on("focusin mouseenter" , "li" , function(e) {
									var $this = $(this);

									_lastIDX = $wrapper.find("li.on .wm_gd_links").attr("data-index");
									_IDX = $this.index();

									wbEngine();
									commonUI.bodyClickOnFunc( "d_wbGoods" );
								})

								$btns.del.on("click" , function(e) {
									e.preventDefault();
									wbDelete();
								})

								$btns.prev.on("click" , function(e) {
									e.preventDefault();
									wbPrev();
								})

								$btns.next.on("click" , function(e) {
									e.preventDefault();
									wbNext();
								})

								$tabItems = $wrapper.find("li .wm_gd_links");

								$tabItems.on("focus" , function(e) {
									e.preventDefault();
									var _vi = Math.floor($(this).attr("data-index")/5); //리뉴얼 수정
									_pageIDX = _vi;
									wbAni();
								})
							}

							function _tabEvent(){
								var _$tabItems  = $wrapper.find("li:not(.off)");

								_$tabItems.each(function(idx){
									$(this).find(".wm_gd_links").attr("data-index",idx);
								})
							}

							function wbDelete(){
								var $this = $liItems.eq(_IDX);
								$(".wm_goods_wrap").focus();
								$this.addClass("off");
								setInit();
								wbDeleteChk();
								_tabEvent();
							}

							function wbDeleteChk(){
								var chksItemLength = $wrapper.find("li:visible").length;
								if ( (_pageIDX*3) >= chksItemLength ){
									wbPrev();
								}
							}

							function setInit(){
								var chksItemLength = $wrapper.find("li:visible").length;

								if ( chksItemLength < 1  ) {
									$wrapper.removeClass("active").off("mouseenter");
									$('.wm_right').remove()
									//$itemWrap.hide();
									//$(".nodata").addClass("on");
									//$wrapper.height(92);

									return false;
								}else if ( chksItemLength < 6 ) { //2021-09-01
									$wrapper.height(chksItemLength*84 + 8); //2021-09-01

									$(".wm_btns").remove();
									return true;
								}

								return true;
							}

							function wbPrev(){
								var chksItemLength = parseInt($wrapper.find("li:visible").length/5); //리뉴얼 수정
								_pageIDX = ( _pageIDX > 0 )? _pageIDX -1: chksItemLength ;

								wbAni();
							}

							function wbNext(){
								var chksItemLength = parseInt($wrapper.find("li:visible").length/5); //리뉴얼 수정
								_pageIDX = ( _pageIDX < chksItemLength )? _pageIDX+1: 0 ;

								wbAni();
							}

							function wbAni(){
								var _css = { "top" : "-"+_pageIDX*420+"px" } //2021-08-18
								$itemWrap.css(_css);
							}

							function wbEngine(){
								$wrapper.addClass("active");

								$liItems.removeClass("on");
								$liItems.eq(_IDX).addClass("on");

								$lastOnItems = $liItems.eq(_IDX);
							}

							wbInit();
						}
						$(window).ready(function(){
							wbGoods();
						})
