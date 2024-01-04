$(document).ready(function () {



/* 헤더 - wrap 상하단 마진/패딩 부여
   ==================================================*/
   // 20200625 수정 - footer 관련 추가
   // 20200716 수정 - 탑배너 관련 수정 : S
   // 20200723 수정 - 탑배너 수정 : S
   // 20200730 수정 - fixedTab수정 : S
   function commerceHeaderControl(){
      // 상하단 마진/패딩에 관련된 각 값 체크. 보이지 않을 경우 0
      var moHeaderHeight = $('.header--mo').is(':visible') ? $('.header--mo').outerHeight() : 0;
      var pcHeaderHeight = $('.header--pc').is(':visible') ? $('.header--pc').outerHeight() : 0;
      var pcNavHeight = $('.nav__2depthArea.nav__2depthArea--pc').is(':visible') ? $('.nav__2depthArea.nav__2depthArea--pc').outerHeight() : 0;
      var moPageHeaderHeight = $('.pageHeader').is(':visible') ? $('.pageHeader').outerHeight() : 0; /* 20200710 페이지헤더 수정 */
      var topBannerHeight = $('.topBanner').is(':visible') ? $('.topBanner').outerHeight() : 0;
      var moSearchTabHeight = $('.searchTab').is(':visible') ? $('.searchTab').outerHeight() : 0;
      var botNavHeight = $('.botNav').is(':visible') ? $('.botNav').outerHeight() : 0;
      var footerHeight = $('.footer').is(':visible') ? $('.footer').outerHeight() + parseInt($('.footer').css('marginTop'))  : 0;
      var fixedTabHeight = $('.fixedTab').is(':visible') ? $('.fixedTab').outerHeight() + parseInt($('.fixedTab').css('marginTop'))  : 0;
      var paddingTopVal = moHeaderHeight + pcHeaderHeight + pcNavHeight + moPageHeaderHeight + moSearchTabHeight + topBannerHeight + fixedTabHeight;
      var paddingBotVal = footerHeight;
      var marginBotVal = botNavHeight;

      var wrapper = $('.wrap');
      var header = $('.header');
      var pageHeader = $('.pageHeader');
      var pcNav2depth = $('.nav__2depthArea--pc');
      var fullPop = $('.layerPop--full');
      var fixedTab = $('.fixedTab');

      // 요소 CSS 부여 - 초기값
      wrapper.css({paddingTop:paddingTopVal, paddingBottom:paddingBotVal, marginBottom:marginBotVal});
      header.css({top:topBannerHeight});
      pageHeader.css({top:topBannerHeight})
      // fullPop.css({top:topBannerHeight}) 전체화면 팝업의 경우 보류
      pcNav2depth.css({top:pcHeaderHeight});
      fixedTab.css({top:moPageHeaderHeight + topBannerHeight});
      // 요소 CSS 부여 - PC일 경우
      if($(window).width() >= 768){
         // fullPop.css('top','') 전체화면 팝업의 경우 보류
      };

      // 탑배너 관련 클래스 부여 - 탑배너 높이 이상 스크롤시 고정처리
      var wnd = $(window);
      var scrNow = wnd.scrollTop();
      function fixHead(){
         scrNow = wnd.scrollTop();
         if(scrNow >= topBannerHeight){
            header.addClass('fixed');
            pageHeader.addClass('fixed');
            pcNav2depth.addClass('fixed');
            fixedTab.addClass('fixed');
         }else{
            header.removeClass('fixed');
            pageHeader.removeClass('fixed');
            pcNav2depth.removeClass('fixed');
            fixedTab.removeClass('fixed');
         }
      }
      fixHead();
      $(window).on('scroll resize', function(){
         fixHead();
      });
   };
      // 20200730 수정 - fixedTab수정 : E
      // 20200723 수정 - 탑배너 수정 : E
      // 20200716 수정 - 탑배너 관련 수정 : E
   commerceHeaderControl();
   // 로드 후 재설정
   setTimeout(function(){commerceHeaderControl()},1000)
   // // 20200625 수정 - footer 관련 추가
   
   $(window).resize(function(){
      commerceHeaderControl();
   });

   /* 헤더 -  상단 고정
      ==================================================*/
   var didScroll;
   var lastScrollTop = 0;
   var delta = 1;

   // 스크롤시 변수 didscroll에 true 부여 
   $(window).scroll(function () {
      didScroll = true;
   });

   // 0.25초 마다 didscroll 값 체크하여 hasScrolled 실행
   setInterval(function () {
      if (didScroll) {
         hasScrolled();
         didScroll = false;
      }
   }, 250);

   function hasScrolled() {
      var st = $(this).scrollTop();
      // 스크롤의 절대값이 delta 값 이상 발생했을때 실행하기
      if (Math.abs(lastScrollTop - st) <= delta)
         return;
      // 스크롤 업/다운시 각각 클래스 부여
      if (st > lastScrollTop) {
         // scroll Down
         if (st >= 100) {
            $('.js-header--mo, .js-header--pc').addClass('header--scrollDown')
            $('.nav__2depthArea--pc').css({marginTop:''}); //20200507 추가 //20200716 수정 - 탑배너 관련 수정
            $('.js-scrapToolbar').removeClass('up'); //20200714 추가
         }
      } else {
         // scroll Up
         $('.js-header--mo, .js-header--pc').removeClass('header--scrollDown')
         $('.nav__2depthArea--pc').css({marginTop:''}); //20200507 추가 //20200716 수정 - 탑배너 관련 수정
         $('.js-scrapToolbar').addClass('up'); //20200714 추가
      }
      // st값 업데이트
      lastScrollTop = st;
   };

   /* 헤더 - PC 2depth 노출
      ==================================================*/
      // 20200716 수정 - 탑배너 관련 수정 : S
      // 20200507 수정 :: S
      $('.js-header--pc').on('mouseenter', function(){
         if($(this).hasClass('header--scrollDown')){
            $('.nav__2depthArea--pc.nav__2depthArea--on').show(function(){
               $(this).css({marginTop:'0'});
            });
         };
      });
      $('.js-header--pc').on('mouseleave', function(){
         if($(this).hasClass('header--scrollDown')){
            $('.nav__2depthArea--pc').css({marginTop:''}, function(){
               $('.nav__2depthArea--pc').hide()
            });
            $('.nav__2depthArea--pc.nav__2depthArea--on').show(); //20200601 추가
         }else{
            $('.nav__2depthArea--pc').hide().css({marginTop:''});
            $('.nav__2depthArea--pc.nav__2depthArea--on').css({marginTop:'0'}).show();
         }
      });
      $('.js-nav__1depthItem>a').on('mouseenter', function(){
         if($('.js-header--pc').hasClass('header--scrollDown')){
         $('.nav__2depthArea--pc').hide().css({marginTop:''});
         $(this).parent().find('.nav__2depthArea--pc').css({marginTop:'0'}).show();
         }else{
         $('.nav__2depthArea--pc').hide().css({marginTop:''});
         $(this).parent().find('.nav__2depthArea--pc').show();
         };
      });
   // 20200507 수정 :: E
   // 20200716 수정 - 탑배너 관련 수정 : E

      $('.js-nav__1depthItem>a').on('mouseenter', function(){
         if($('.js-header--pc').hasClass('header--scrollDown')){
         $('.nav__2depthArea--pc').hide().css({top:''});
         $(this).parent().find('.nav__2depthArea--pc').css({top:'86px'}).show();
         }else{
         $('.nav__2depthArea--pc').hide().css({top:''});
         $(this).parent().find('.nav__2depthArea--pc').show();
         };
      });
   // 20200507 수정 :: E

   /* 헤더 - MO 커뮤니티 서브메뉴 슬라이드
      ==================================================*/
   // 20200525 수정 :: S
   var initSlide = $('.js-nav__2depthArea--mo').find('.nav__2depthItem--on').index();
   var headerNavMo = new Swiper('.js-nav__2depthArea--mo', {
      slidesPerView: 'auto',
      // freeMode: true, 20200819 수정
      initialSlide: initSlide
   });
   // 20200525 수정 :: E

   /* 하단 네비게이션 토글
      ==================================================*/
      function toggleUploadPanel(){
         var toggleClickCount = true;
         var body = $('body');
         var uploadBtn = $('.botNav__uploadBtn');
         var uploadPanel = $('.js-botNav__uploadPanel');
         var dim = $('.js-dim--underBotNav');
         var thisPopHeight = uploadPanel.height();

         uploadBtn.on('click', function () {
            uploadBtn.toggleClass('botNav__uploadBtn--on');
            // toggleClickCount의 true/false를 번갈아 실행함
            if (toggleClickCount) {
               dim.fadeIn(200);
               body.addClass('scrollfix');
               uploadPanel.addClass('botNav__uploadPanel--on').css({
                  bottom: -thisPopHeight
               }).stop().animate({
                  bottom: 0
               }, 200);
               toggleClickCount = false;
            } else {
               dim.fadeOut(200);
               body.removeClass('scrollfix');
               uploadPanel.stop().animate({
                  bottom: -thisPopHeight
               }, 200, function () {
                  $(this).removeClass('botNav__uploadPanel--on')
               });
               toggleClickCount = true;
            };
         });

         // dim 영역 클릭시 하단 네비 닫기
         dim.on('click', function(){
            if (uploadPanel.hasClass('botNav__uploadPanel--on')) {
               dim.fadeOut(200);
               body.removeClass('scrollfix');
               uploadPanel.stop().animate({
                  bottom: -thisPopHeight
               }, 200, function () {
                  $(this).removeClass('botNav__uploadPanel--on')
               });
               uploadBtn.toggleClass('botNav__uploadBtn--on');
               toggleClickCount = true;
            };
         });
         
         $(window).resize(function(){
            thisPopHeight = uploadPanel.height();
         })
      }

      toggleUploadPanel();
   
   /* PC 헤더 - 마이페이지 메뉴 여닫을 때 클래스 토글
   ==================================================*/
   $('.js-userUtil__mypageBtn').on('click', function(){
      $(this).toggleClass('userUtil__mypageBtn--on')
   })

   
   /* 카테고리 슬라이드
      ==================================================*/
   var categoryBar = new Swiper('.js-categoryBar', {
      slidesPerView: 'auto',
      // freeMode: true 20200423 삭제
   });

   /* 필터 정보 슬라이드
      ================================================== */
   filterSlider = new Swiper('.js-filterInfo', {
      slidesPerView: 'auto',
      breakpoints : {
         768 : {
            allowTouchMove: false
         }
      },
      on : {
         resize: function(){
            if($(window).width() >= 768){
               filterSlider.translateTo(0,0);
            }
         }
      },
   });
   
      
/* 인기 메인 배너 슬라이드
   ================================================== */
   var popularBannerSlide = new Swiper('.js-popularBanner', {
      autoplay: {
         delay: 5500,
         disableOnInteraction	: false //20200706 추가
       },
      speed: 500,
      loop: true,
      loopAdditionalSlides	: 1,
      pagination: {
         el: '.js-popularBanner__counter',
         type: 'fraction',
      },
      breakpoints: {
         768: {
            slidesPerView: 1,
            centeredSlides: true,
            spaceBetween: 30,
         }
      }
   });

   /* 마켓 홈 배너 슬라이드
   ================================================== */
   let marketBanner_options = {};
   if($('.js-marketBanner .swiper-slide').length == 1){
	   marketBanner_options = {
			       pagination: {
			          el: '.js-marketBanner__counter',
			          type: 'fraction',
			       }
			    }
   }else{
	   marketBanner_options = {
			      autoplay: {
			          delay: 5500,
			          disableOnInteraction	: false //20200706 추가
			        },
			       speed: 500,
			       loop: true,
			       loopAdditionalSlides	: 1,
			       pagination: {
			          el: '.js-marketBanner__counter',
			          type: 'fraction',
			       },
			       breakpoints: {
			          768: {
			             slidesPerView: 1,
			             centeredSlides: true,
			             spaceBetween: 30,
			          }
			       }
			    }
   }
   var marketBannerSlide = new Swiper('.js-marketBanner', marketBanner_options);
   

   /* 피드형 사진 슬라이드
      ================================================== */
   var feedSlider = new Swiper('.js-feedImg', {
      autoHeight: true,
      watchOverflow: true,
      pagination: {
         el: '.js-feedImg__pagination',
      }, navigation: {
         nextEl: '.js-feedImg__button-next',
         prevEl: '.js-feedImg__button-prev',
      },
   });

   /* 팔로잉 스토리 배너 슬라이드
      ================================================== */
   var storyBannerSlide = new Swiper('.js-storyBanner', {
      autoplay: {
         delay: 5500,
         disableOnInteraction	: false //20200706 추가
      },
      speed: 500,
      loop: true,
      loopAdditionalSlides	: 1,
      pagination: {
         el: '.js-storyBanner__counter',
         type: 'fraction',
      },
      breakpoints: {
         768: {
            slidesPerView: 1,
            centeredSlides: true,
            spaceBetween: 30,
         }
      }
   });


   /* 팔로잉 추천 유저 슬라이드
      ================================================== */
   var weeklyUserSlide = new Swiper('.js-weeklyUser__slide', {
      slidesPerView: 2.3,
      slidesOffsetAfter: 50,
      breakpoints: {
         768: {
            slidesOffsetAfter: 0,
            slidesPerView: 'auto',
            allowTouchMove: false
         }
      },
      on : {
         resize: function(){
            if($(window).width() >= 768){
               weeklyUserSlide.translateTo(0,0);
            }
         }
      },
   });

   /* 텍스트 편집기 툴바 슬라이드
      ================================================== */
   var editorToolbarSlide = new Swiper('.js-editorToolbarSlide',{
      slidesPerView: 'auto',
      freeMode:true
      }
  )

   /* 물품 리스트 슬라이드
   ================================================== */
   var productSlide = new Swiper('.js-product__slide', {
      slidesPerView: 2.3,
      breakpoints: {
         768: {
            slidesPerView: 'auto',
            allowTouchMove: false,
         }
      },
      on : {
         resize: function(){
            if($(window).width() >= 768){
               productSlide.translateTo(0,0);
            }
         }
      },
   });

   /* 피드형 상품태그
      ================================================== */
   $('.js-feedImgView').on('click', function () {
      $(this).parent().find('.feedImg__tagBox').toggleClass('feedImg__tagBox--on')
   });
   if ($(window).width() > 767) {
      $('.js-feedImg').on('mouseover', function () {
         $(this).find('.feedImg__tagBox').addClass('feedImg__tagBox--on')
      });
      $('.js-feedImg').on('mouseleave', function () {
         $(this).find('.feedImg__tagBox').removeClass('feedImg__tagBox--on')
      });
      
      // 20200504 추가 S
      $('.js-feedImg.js-feedImgNoEffect').on('mouseover', function () {
         $(this).find('.feedImg__tagBox').addClass('feedImg__tagBox--on')
      });
      $('.js-feedImg.js-feedImgNoEffect').on('mouseleave', function () {
         $(this).find('.feedImg__tagBox').addClass('feedImg__tagBox--on')
      });
      // 20200504 추가 E
   }

   /* 업로드 - 사진 주제선택 드롭다운
      ================================================== */
   $('.js-toggleTopicList').on('click',function(){
      $(this).toggleClass('inputArea__pickTopic--closed inputArea__pickTopic--opened');
      $('.inputArea__topicList').slideToggle(200);
   });
   $('.js-toggle2depthTopicList').on('click', function(){
         $(this).parent('.topicList__1depthItem').toggleClass('topicList__1depthItem--opened topicList__1depthItem--closed');
         $(this).siblings('.topicList__2depthList').slideToggle(200);
   });
   
   /* PC 드롭다운 열기
      ================================================== */
   $('.js-openDropDownPop').on('click', function(){
      $(this).toggleClass('btn--on'); //20200413 추가
      $(this).siblings('.dropDownSet__pop').toggle();
   });

   //영역 외 클릭시 닫기 
   $('body').on('click', function(e){
      var $tgPoint = $(e.target);
      var $popCallBtn = $tgPoint.hasClass('js-openDropDownPop');
      var $popArea = $tgPoint.hasClass('dropDownSet__pop');

      if ( !$popCallBtn && !$popArea ) {
         $('.js-openDropDownPop').removeClass('btn--on'); //20200413 추가
         $('.dropDownSet__pop').hide()
      };
   });
   
    /* 사진/스토리 상세 - 댓글 유저 검색창 패널 스크롤 조정
      ================================================== */
   if($(".commentInput__searchPanel").length){
      $(".commentInput__searchPanel").scrollTop($(".commentInput__searchPanel")[0].scrollHeight);
   }
      
   /* 사진/스토리 상세 - 사진팝업 상품태그
      ================================================== */
   $('.js-popfeedImg').on('click', function () {
      $(this).find('.feedImg__tagBox').toggleClass('feedImg__tagBox--on');
      $(this).find('.feedImg__view').toggleClass('feedImg__view--off');
   });

   /* FAQ 아코디언 메뉴 
   ================================================== */
   $('.faq_toggle').click(function (e) {
      e.preventDefault();
      var $this = $(this);
      if ($this.hasClass('show')) {
         $this.removeClass('show');
         $this.next(".inner").slideUp(350);

      } else {
         $(".faq_toggle").removeClass('show');
         $this.parent().parent().find('li .inner').slideUp(350);
         $this.toggleClass('show');
         $this.next(".inner").slideToggle(350);
      }
   });

   /* 인기 해시태그 슬라이드
   ================================================== */
   var tagSlide = new Swiper('.js-tagSlide', {
      slidesPerView: 'auto',
      navigation: {
         prevEl: '.js-slideArrows--prev',
         nextEl: '.js-slideArrows--next',
      },
      breakpoints: {
         768: {
            slidesPerView: 5,
            spaceBetween: 30,
            slidesPerGroup: 5,
            speed: 500,
         }
      }
   });


   /* 타임딜 슬라이드
   ================================================== */
   var productSlide = new Swiper('.js-timeDealSlide', {
      slidesPerView: 1,
      breakpoints: {
         768: {
            slidesPerView: 4,
            spaceBetween: 20,
            allowTouchMove: false,
         }
      },
      pagination: {
         el: '.js-timeDealSlide__pagination',
      },
      on : {
         resize: function(){
            if($(window).width() >= 768){
               productSlide.translateTo(0,0);
            }
         }
      },
   });


   /* 인기 Weekly 인기 유저 슬라이드
      ================================================== */
   var weeklyUserPopularSlide = new Swiper('.js-weeklyUser__slide--popular', {
      slidesPerView: 'auto',
      spaceBetween: 0,
      navigation: {
         prevEl: '.js-slideArrowsWeeklyUser--prev',
         nextEl: '.js-slideArrowsWeeklyUser--next',
      },
      breakpoints: {
         768: {
            slidesPerView: 'auto',
            slidesPerGroup: 5,
            speed: 500,
         }
      },
   });

   /* 인기 Weekly 인기 유저 사진 슬라이드
   ================================================== */
   var weeklyUserPicSlide = new Swiper('.js-weeklyUserPic', {
      slidesPerView: 'auto',
      allowTouchMove: false,
      spaceBetween: 0,
      navigation: {
         prevEl: '.js-slideArrowsWeeklyUserPic--prev',
         nextEl: '.js-slideArrowsWeeklyUserPic--next',
      },
      breakpoints: {
         768: {
            slidesPerView: 'auto',
            allowTouchMove: true,
            spaceBetween: 0,
            slidesPerGroup: 7,
            speed: 500,
         }
      },
      on : {
         resize: function(){
            if($(window).width() < 768){
               weeklyUserPicSlide.translateTo(0,0);
            }
         }
      },
   });

   /* 마이캔디 datepicker 
   ================================================== */                             
   $('input[type="text"].inp_cal').datepicker();


   /* 통합검색결과 스토어 슬라이드
   ================================================== */
   var schPdStore = new Swiper('.js-schPdStore', {
      slidesPerView: 'auto',
      allowTouchMove: false,
      navigation: {
         prevEl: '.js-schPdStore--prev',
         nextEl: '.js-schPdStore--next',
      },
      breakpoints: {
         768: {
            slidesPerView: 'auto',
            spaceBetween: 0,
            slidesPerGroup: 4,
            speed: 500,
            allowTouchMove: true,
         }
      },
      on : {
         resize: function(){
            if($(window).width() < 768){
               schPdStore.translateTo(0,0);
            }
         }
      },
   });

   /* 통합검색결과 마켓 슬라이드
   ================================================== */
   var schPdMarket = new Swiper('.js-schPdMarket', {
      slidesPerView: 'auto',
      allowTouchMove: false,
      navigation: {
         prevEl: '.js-schPdMarket--prev',
         nextEl: '.js-schPdMarket--next',
      },
      breakpoints: {
         768: {
            slidesPerView: 'auto',
            spaceBetween: 0,
            slidesPerGroup: 4,
            speed: 500,
            allowTouchMove: true,
         }
      },
      on : {
         resize: function(){
            if($(window).width() < 768){
               schPdMarket.translateTo(0,0);
            }
         }
      },
   });
   
   // 20200525 추가 :: S
   /* 댓글 입력영역 클릭시 포커스 부여
   ================================================== */
   $('.commentInput__inputArea').on('click', function(){
      var target = $(this).find('.commentInput__input');
      target.focus();
  });
   // 20200525 추가 :: E


   /* 필터 팝업 열기,닫기
   ================================================== */
   $('.filterBtn').on('click', function(){
      $(this).toggleClass('filterBtn--open');
      $(this).siblings('.layerPop').slideToggle(300).toggleClass('layerPop--on');
      $('.dim.dim--filter').toggleClass('dim--on');
      $('body').toggleClass('scrollfix--moOnly');
   });

   $('.popFromUnder__grapArea').on('click', function(){
      var layerPopFilter = $(this).parent().parent('.layerPop');
      layerPopFilter.slideToggle(300);
      setTimeout(function() {
         layerPopFilter.removeClass('layerPop--on');
         $('.dim.dim--filter').removeClass('dim--on');
      }, 300);
      $('body').removeClass('scrollfix--moOnly');
   });


   /* 기획전 배너
   ================================================== */
   var marketPlanningBannerSlide = new Swiper('.js-marketPlanningBanner', {
      autoplay: {
          delay: 5000,
          disableOnInteraction	: false //20200706 추가
      },
      speed: 500,
      loop: true,
      loopAdditionalSlides	: 1,
      pagination: {
          el: '.js-marketPlanningCounter',
          type: 'fraction',
      }
  });

   /* 기획전 탭 스티키
   ================================================== */
   // 20200622 수정 : 스티키 수정
   // 20200624 수정
   function stickyThis(obj){
      if(obj.length){
         // 대상이 있을때만 이하 실행
         var scrTop = $(window).scrollTop();
         var objOffsetTop = obj.next().offset().top;
         var objHeight = obj.outerHeight();
         var gnbHeight = 61;
         if( objOffsetTop <= scrTop + objHeight + gnbHeight ){
            obj.addClass('fixed')
         }else{
            obj.removeClass('fixed')
         };
      };
   };
      stickyThis($(".js-marketPlanning__tab"))
      $(window).on('resize scroll', function(){
         stickyThis($(".js-marketPlanning__tab"))
      });
   // //20200624 수정
   // //20200622 수정 : 스티키 수정

   /* 기획전 탭
   ================================================== */
   // 20200608 수정 :: S
   var marketTabSlide = new Swiper ('.js-marketTabSlide', {
      slidesPerView : 2.8,
      spaceBetween : 10,
      slidesOffsetBefore: $(window).width() * 0.04,
      slidesOffsetAfter: $(window).width() * 0.04,
      breakpoints: {
            768: {
               spaceBetween : 20,
               slidesPerView : 4.5,
               slidesOffsetBefore: 0,
               slidesOffsetAfter: 0,
            }
      },
   });
   $(window).resize(function(){
      if($(window).width()>=768){
         marketTabSlide.params.slidesOffsetBefore=0;
         marketTabSlide.params.slidesOffsetAfter=0;
      }else{
         marketTabSlide.params.slidesOffsetBefore=$(window).width() * 0.04
         marketTabSlide.params.slidesOffsetAfter=$(window).width() * 0.04
      }
   });
   // 20200608 수정 :: E
   /* 마켓>카테고리 호버
   ================================================== */
   $('.js-viewCatePc').on('mouseenter', function(){
      $(this).find('.nav__popTip').addClass('nav__popTip--on')
      $('.nav__category').show();
   })
   $('.js-viewCatePc').on('mouseleave', function(){
      $(this).find('.nav__popTip').removeClass('nav__popTip--on')
      $('.nav__category').hide();
   })

   /* 마켓 브랜드관 카테고리
      ================================================== */
   var marketBrandSlide = new Swiper('.js-brand__categorySlide', {
      slidesPerView: 'auto',
      breakpoints: {
         768: {
            allowTouchMove: false,
         }
      },
      on : {
         resize: function(){
            if($(window).width() >= 768){
               marketBrandSlide.translateTo(0,0);
            }
         }
      },
   });

   /* 마켓 브랜드관 상품 슬라이드
   ================================================== */
   var marketProductSlide = new Swiper('.js-product__slide--brand', {
      slidesPerView: 'auto',
      breakpoints: {
         768: {
            allowTouchMove: false,
         }
      },
      on : {
         resize: function(){
            if($(window).width() >= 768){
               marketProductSlide.translateTo(0,0);
            }
         }
      },
   });

   /* 브랜드관 페이지헤더 스티키
   ================================================== */
   // 20200820 브랜드관 페이지헤더 삭제 S
   // $('.js-pageHeader--scroll').waypoint(
   //    function (direction) {
   //          if (direction == "down") {
   //             $(".js-pageHeader--scroll").removeClass("pageHeader--brand");
   //          } else {
   //             $(".js-pageHeader--scroll").addClass("pageHeader--brand")
   //          }
   //    }, {
   //       offset: "-60px"
   //    }
   // );
   // 20200820 브랜드관 페이지헤더 삭제 E

   // 20200820 브랜드관 페이지헤더 추가 S
   function brandPageHeader(obj) {
      var scrollTop = $(window).scrollTop();
      if (scrollTop >= 60 ) {
         obj.removeClass('pageHeader--brand');
      } else {
         obj.addClass('pageHeader--brand');
      }
   }
   brandPageHeader($('.js-pageHeader--scroll'));
   $(window).on('resize scroll', function(){
      brandPageHeader($('.js-pageHeader--scroll'));
   });
   // 20200820 브랜드관 페이지헤더 추가 E

   // 20200806 수정 : 중분류카테고리 //
   $('.js-categorySlideFix').waypoint(
      function (direction) {
            if (direction == "down") {
               $(".js-categorySlideFix").addClass("fixed");
            } else {
               $(".js-categorySlideFix").removeClass("fixed");
            }
      }, {
         offset: "60px"
      }
   );
   // // 20200806 수정 : 중분류카테고리

   /* 마켓랭킹 슬라이드
   ================================================== */
   var risingMarketSlide = new Swiper('.js-risingMarketSlide', {
      slidesPerView : 1,
      pagination : {
          el: '.js-risingMarketPagination',
          type: 'bullets'
      },
      navigation: {
              nextEl: '.js--risingMarketNaviNext',
              prevEl: '.js--risingMarketNaviPrev',
      },
      breakpoints: {
          768: {
              slidesPerView : 3,
              spaceBetween: 30,
              slidesPerGroup: 3
          },

      },
  });
        
   /* 20200716 탑배너 닫기
   ================================================== */
   $('.js-topBannerClose').click(function(){
      $(this).parent().hide();
      commerceHeaderControl();
      return false;
   });

   /* 20201006 마켓 입점문의 이동 버튼
   ================================================== */
   $('.js-goForm').on('click', function(){
       var formCoordinate = $('.marketEnter__form').offset().top;
       var calCoordinate;
       if ($(window).width() >= 768){
           calCoordinate = formCoordinate - 85;
       }else{
           calCoordinate = formCoordinate - 48;
       };
       $('html, body').animate({scrollTop: calCoordinate}, 200);
       return false;
   });
});