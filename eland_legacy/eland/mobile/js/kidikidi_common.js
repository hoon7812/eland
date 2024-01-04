
$(document).ready(function () {
   // common js

   /* 헤더 - wrap 상하단 마진/패딩 부여
      ==================================================*/
   // 20200625 수정 - footer 관련 추가
   // 20200716 수정 - 탑배너 관련 수정 : S
   // 20200723 수정 - 탑배너 수정 : S
   // 20200730 수정 - fixedTab수정 : S
   function commerceHeaderControl() {
      // 상하단 마진/패딩에 관련된 각 값 체크. 보이지 않을 경우 0
      var moHeaderHeight = $('.header-mo').is(':visible') ? $('.header-mo').outerHeight() : 0;
      var pcHeaderHeight = $('.header-pc').is(':visible') ? $('.header-pc').outerHeight() : 0;
      var pcNavHeight = $('.nav_2depthArea.nav_2depthArea-pc').is(':visible') ? $('.nav_2depthArea.nav_2depthArea-pc').outerHeight() : 0;
      var moPageHeaderHeight = $('.pageHeader').is(':visible') ? $('.pageHeader').outerHeight() : 0; /* 20200710 페이지헤더 수정 */
      var topBannerHeight = $('.topBanner').is(':visible') ? $('.topBanner').outerHeight() : 0;
      var moSearchTabHeight = $('.searchTab').is(':visible') ? $('.searchTab').outerHeight() : 0;
      var botNavHeight = $('.botNav').is(':visible') ? $('.botNav').outerHeight() : 0;
      var footerHeight = $('.footer').is(':visible') ? $('.footer').outerHeight() + parseInt($('.footer').css('marginTop')) : 0;
      var fixedTabHeight = $('.fixedTab').is(':visible') ? $('.fixedTab').outerHeight() + parseInt($('.fixedTab').css('marginTop')) : 0;
      var headerBnHeight = $('.header_bn').is(':visible') ? $('.header_bn').outerHeight() : 0;
      var paddingTopVal = moHeaderHeight + pcHeaderHeight + pcNavHeight + moPageHeaderHeight + moSearchTabHeight + topBannerHeight + fixedTabHeight;
      var paddingBotVal = footerHeight;
      var marginBotVal = botNavHeight;

      var wrapper = $('.wrap');
      var header = $('.header');
      var pageHeader = $('.pageHeader');
      var pcNav2depth = $('.nav_2depthArea-pc');
      var fullPop = $('.layerPop-full');
      var fixedTab = $('.fixedTab');
      var header_bn = $('.header_bn');

      // 요소 CSS 부여 - 초기값
      if(fixedTab.length == 0) {
         header_bn.css({top: moHeaderHeight + topBannerHeight})
         paddingTopVal += headerBnHeight;
      }
      wrapper.css({ paddingTop: paddingTopVal, paddingBottom: paddingBotVal, marginBottom: marginBotVal });
      header.css({ top: topBannerHeight });
      pageHeader.css({ top: topBannerHeight })
      // fullPop.css({top:topBannerHeight}) 전체화면 팝업의 경우 보류
      pcNav2depth.css({ top: pcHeaderHeight });
      fixedTab.css({ top: moPageHeaderHeight + topBannerHeight});

      // 요소 CSS 부여 - PC일 경우
      if ($(window).width() >= 768) {
         // fullPop.css('top','') 전체화면 팝업의 경우 보류
      };

      // 탑배너 관련 클래스 부여 - 탑배너 높이 이상 스크롤시 고정처리
      var wnd = $(window);
      var scrNow = wnd.scrollTop();
      function fixHead() {
         if(fixedTab.length == 0) {
            $('#header_bn').show();
            $('#header_bn').addClass('ready');
         } else {
            $('#header_bn').hide();
         }
         scrNow = wnd.scrollTop();
         if (scrNow >= topBannerHeight + headerBnHeight) {
            header.addClass('fixed');
            pageHeader.addClass('fixed');
            pcNav2depth.addClass('fixed');
            fixedTab.addClass('fixed');
            $('#header_bn').removeClass('ready');
            $('#header_bn').css({top: -100});
         } else {
            header.removeClass('fixed');
            pageHeader.removeClass('fixed');
            pcNav2depth.removeClass('fixed');
            fixedTab.removeClass('fixed');
            $('#header_bn').addClass('ready');
            if(fixedTab.length == 0) {
            	if(window.location.href.indexOf('initMypageMain.action') != -1){
            		$('#header_bn').css({top: '16.1vw'});
            	}
            	else{
            		$('#header_bn').css({top: $('.js-header-mo').position().top + $('.js-header-mo').outerHeight()});
            	}
            }
         }
      }
      fixHead();
      $(window).on('scroll resize', function () {
         fixHead();
      });
   };

   $('#header_bn').find('.cls').on("click", function(){
      $('#header_bn').remove();
      $('#header_bn').removeClass('ready');
      commerceHeaderControl();
   });

   // 20200730 수정 - fixedTab수정 : E
   // 20200723 수정 - 탑배너 수정 : E
   // 20200716 수정 - 탑배너 관련 수정 : E
   commerceHeaderControl();
   // 로드 후 재설정
   setTimeout(function () { commerceHeaderControl() }, 1000)
   // // 20200625 수정 - footer 관련 추가

   $(window).resize(function () {
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
            $('.js-header-mo, .js-header-pc').addClass('header-scrollDown')
            $('.nav_2depthArea-pc').css({ marginTop: '' });
            $('.js-scrapToolbar').removeClass('up');
            $('.js-categorySticky').removeClass('up')
            $('.js-disneySticky').removeClass('up') // 20210426 추가 디즈니관 스티키
            $('.js-copyToOuter').removeClass('up') // 20210329 추가 프리오더 스티키
            $('.js_selSticky').addClass("sel_scrollDown"); // 20210611 추가
            $('.brandSticky').addClass("sel_scrollDown"); //20220107 추가
         }
      } else {
         // scroll Up
         $('.js-header-mo, .js-header-pc').removeClass('header-scrollDown')
         $('.nav_2depthArea-pc').css({ marginTop: '' });
         $('.js-scrapToolbar').addClass('up');
         $('.js-categorySticky').addClass('up')
         $('.js-disneySticky').addClass('up') // 20210426 추가 디즈니관 스티키
         $('.js-copyToOuter').addClass('up') // 20210329 추가 프리오더 스티키
         $('.js_selSticky').removeClass("sel_scrollDown"); // 20210611 추가
         $('.brandSticky').removeClass('sel_scrollDown') //20220107 추가
      }
      // st값 업데이트
      lastScrollTop = st;
   };

   /* 헤더 - PC 2depth 노출
      ==================================================*/

   // $('.js-header-pc').on('mouseenter', function () {
   //     if ($(this).hasClass('header-scrollDown')) {
   //         $('.nav_2depthArea-pc.nav_2depthArea-on').show(function () {
   //             $(this).css({ marginTop: '0' });
   //         });
   //     };
   // });
   // $('.js-header-pc').on('mouseleave', function () {
   //     if ($(this).hasClass('header-scrollDown')) {
   //         $('.nav_2depthArea-pc').css({ marginTop: '' }, function () {
   //             $('.nav_2depthArea-pc').hide()
   //         });
   //         $('.nav_2depthArea-pc.nav_2depthArea-on').show(); //20200601 추가
   //     } else {
   //         $('.nav_2depthArea-pc').hide().css({ marginTop: '' });
   //         $('.nav_2depthArea-pc.nav_2depthArea-on').css({ marginTop: '0' }).show();
   //     }
   // });
   // $('.js-nav_1depthItem>a').on('mouseenter', function () {
   //     if ($('.js-header-pc').hasClass('header-scrollDown')) {
   //         $('.nav_2depthArea-pc').hide().css({ marginTop: '' });
   //         $(this).parent().find('.nav_2depthArea-pc').css({ marginTop: '0' }).show();
   //     } else {
   //         $('.nav_2depthArea-pc').hide().css({ marginTop: '' });
   //         $(this).parent().find('.nav_2depthArea-pc').show();
   //     };
   // });

   // $('.js-nav_1depthItem>a').on('mouseenter', function () {
   //     if ($('.js-header-pc').hasClass('header-scrollDown')) {
   //         $('.nav_2depthArea-pc').hide().css({ top: '' });
   //         $(this).parent().find('.nav_2depthArea-pc').css({ top: '86px' }).show();
   //     } else {
   //         $('.nav_2depthArea-pc').hide().css({ top: '' });
   //         $(this).parent().find('.nav_2depthArea-pc').show();
   //     };
   // });
   // 20200507 수정 :: E

   /* 헤더 - MO 커뮤니티 서브메뉴 슬라이드
      ==================================================*/
   // 20200525 수정 :: S
   var initSlide = $('.js-nav_2depthArea-mo').find('.nav_2depthItem-on').index();
   var headerNavMo = new Swiper('.js-nav_2depthArea-mo', {
      slidesPerView: 'auto',
      // freeMode: true, 20200819 수정
      initialSlide: initSlide
   });
   // 20200525 수정 :: E

   /* PC 헤더 - 마이페이지 메뉴 여닫을 때 클래스 토글
   ==================================================*/
   $('.js-userUtil_mypageBtn').on('click', function () {
      $(this).toggleClass('userUtil_mypageBtn-on')
   })


   /* 카테고리 슬라이드
      ==================================================*/
   var categoryBar = new Swiper('.js-categoryBar', {
      slidesPerView: 'auto',
      // freeMode: true 20200423 삭제
   });

   /* 필터 정보 슬라이드
      ================================================== */
   var filterSlider = new Swiper('.js-filterInfo', {
      slidesPerView: 'auto',
      freeMode: true,
      breakpoints: {
         768: {
            allowTouchMove: false
         }
      },
      on: {
         resize: function () {
            if ($(window).width() >= 768) {
               filterSlider.translateTo(0, 0);
            }
         }
      },
   });


   /* 인기 메인 배너 슬라이드
      ================================================== */
   var popularBannerSlide = new Swiper('.js-popularBanner', {
      autoplay: {
         delay: 5500,
         disableOnInteraction: false //20200706 추가
      },
      speed: 500,
      loop: true,
      loopAdditionalSlides: 1,
      pagination: {
         el: '.js-popularBanner_counter',
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
   var marketBannerSlide = new Swiper('.js-marketBanner', {
      autoplay: {
         delay: 5500,
         disableOnInteraction: false //20200706 추가
      },
      speed: 500,
      loop: true,
      loopAdditionalSlides: 1,
      pagination: {
         el: '.js-marketBanner_counter',
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

   /* 피드형 사진 슬라이드
      ================================================== */
   var feedSlider = new Swiper('.js-feedImg', {
      autoHeight: true,
      watchOverflow: true,
      pagination: {
         el: '.js-feedImg_pagination',
      }, navigation: {
         nextEl: '.js-feedImg_button-next',
         prevEl: '.js-feedImg_button-prev',
      },
   });

   /* 팔로잉 스토리 배너 슬라이드
      ================================================== */
   var storyBannerSlide = new Swiper('.js-storyBanner', {
      autoplay: {
         delay: 5500,
         disableOnInteraction: false //20200706 추가
      },
      speed: 500,
      loop: true,
      loopAdditionalSlides: 1,
      pagination: {
         el: '.js-storyBanner_counter',
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
   var weeklyUserSlide = new Swiper('.js-weeklyUser_slide', {
      slidesPerView: 2.3,
      slidesOffsetAfter: 50,
      breakpoints: {
         768: {
            slidesOffsetAfter: 0,
            slidesPerView: 'auto',
            allowTouchMove: false
         }
      },
      on: {
         resize: function () {
            if ($(window).width() >= 768) {
               weeklyUserSlide.translateTo(0, 0);
            }
         }
      },
   });

   /* 텍스트 편집기 툴바 슬라이드
      ================================================== */
   var editorToolbarSlide = new Swiper('.js-editorToolbarSlide', {
          slidesPerView: 'auto',
          freeMode: true
       }
   )

   /* 물품 리스트 슬라이드
   ================================================== */
   var productSlide = new Swiper('.js-product_slide', {
      slidesPerView: 2.3,
      breakpoints: {
         768: {
            slidesPerView: 'auto',
            allowTouchMove: false,
         }
      },
      on: {
         resize: function () {
            if ($(window).width() >= 768) {
               productSlide.translateTo(0, 0);
            }
         }
      },
   });

   /* 피드형 상품태그
      ================================================== */
   $('.js-feedImgView').on('click', function () {
      $(this).parent().find('.feedImg_tagBox').toggleClass('feedImg_tagBox-on')
   });
   if ($(window).width() > 767) {
      $('.js-feedImg').on('mouseover', function () {
         $(this).find('.feedImg_tagBox').addClass('feedImg_tagBox-on')
      });
      $('.js-feedImg').on('mouseleave', function () {
         $(this).find('.feedImg_tagBox').removeClass('feedImg_tagBox-on')
      });

      // 20200504 추가 S
      $('.js-feedImg.js-feedImgNoEffect').on('mouseover', function () {
         $(this).find('.feedImg_tagBox').addClass('feedImg_tagBox-on')
      });
      $('.js-feedImg.js-feedImgNoEffect').on('mouseleave', function () {
         $(this).find('.feedImg_tagBox').addClass('feedImg_tagBox-on')
      });
      // 20200504 추가 E
   }

   /* 업로드 - 사진 주제선택 드롭다운
      ================================================== */
   $('.js-toggleTopicList').on('click', function () {
      $(this).toggleClass('inputArea_pickTopic-closed inputArea_pickTopic-opened');
      $('.inputArea_topicList').slideToggle(200);
   });
   $('.js-toggle2depthTopicList').on('click', function () {
      $(this).parent('.topicList_1depthItem').toggleClass('topicList_1depthItem-opened topicList_1depthItem-closed');
      $(this).siblings('.topicList_2depthList').slideToggle(200);
   });

   /* PC 드롭다운 열기
      ================================================== */
   $('.js-openDropDownPop').on('click', function () {
      $(this).toggleClass('btn-on'); //20200413 추가
      $(this).siblings('.dropDownSet_pop').toggle();
   });

   //영역 외 클릭시 닫기
   $('body').on('click', function (e) {
      var $tgPoint = $(e.target);
      var $popCallBtn = $tgPoint.hasClass('js-openDropDownPop');
      var $popArea = $tgPoint.hasClass('dropDownSet_pop');
      var $popSearch = $tgPoint.hasClass('autoComplete');
      
      if (!$popCallBtn && !$popArea) {
         $('.js-openDropDownPop').removeClass('btn-on'); //20200413 추가
         $('.dropDownSet_pop').hide()
      };
   });

   /* 사진/스토리 상세 - 댓글 유저 검색창 패널 스크롤 조정
     ================================================== */
   if ($(".commentInput_searchPanel").length) {
      $(".commentInput_searchPanel").scrollTop($(".commentInput_searchPanel")[0].scrollHeight);
   }

   /* 사진/스토리 상세 - 사진팝업 상품태그
      ================================================== */
   $('.js-popfeedImg').on('click', function () {
      $(this).find('.feedImg_tagBox').toggleClass('feedImg_tagBox-on');
      $(this).find('.feedImg_view').toggleClass('feedImg_view-off');
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
         prevEl: '.js-slideArrows-prev',
         nextEl: '.js-slideArrows-next',
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
         el: '.js-timeDealSlide_pagination',
      },
      on: {
         resize: function () {
            if ($(window).width() >= 768) {
               productSlide.translateTo(0, 0);
            }
         }
      },
   });


   /* 인기 Weekly 인기 유저 슬라이드
      ================================================== */
   var weeklyUserPopularSlide = new Swiper('.js-weeklyUser_slide-popular', {
      slidesPerView: 'auto',
      spaceBetween: 0,
      navigation: {
         prevEl: '.js-slideArrowsWeeklyUser-prev',
         nextEl: '.js-slideArrowsWeeklyUser-next',
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
         prevEl: '.js-slideArrowsWeeklyUserPic-prev',
         nextEl: '.js-slideArrowsWeeklyUserPic-next',
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
      on: {
         resize: function () {
            if ($(window).width() < 768) {
               weeklyUserPicSlide.translateTo(0, 0);
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
         prevEl: '.js-schPdStore-prev',
         nextEl: '.js-schPdStore-next',
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
      on: {
         resize: function () {
            if ($(window).width() < 768) {
               schPdStore.translateTo(0, 0);
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
         prevEl: '.js-schPdMarket-prev',
         nextEl: '.js-schPdMarket-next',
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
      on: {
         resize: function () {
            if ($(window).width() < 768) {
               schPdMarket.translateTo(0, 0);
            }
         }
      },
   });

   // 20200525 추가 :: S
   /* 댓글 입력영역 클릭시 포커스 부여
   ================================================== */
   $('.commentInput_inputArea').on('click', function () {
      var target = $(this).find('.commentInput_input');
      target.focus();
   });
   // 20200525 추가 :: E

   /* 기획전 배너
   ================================================== */
   var marketPlanningBannerSlide = new Swiper('.js-marketPlanningBanner', {
      autoplay: {
         delay: 5000,
         disableOnInteraction: false //20200706 추가
      },
      speed: 500,
      loop: true,
      loopAdditionalSlides: 1,
      pagination: {
         el: '.js-marketPlanningCounter',
         type: 'fraction',
      }
   });

   /* 기획전 탭 스티키
   ================================================== */
   // 20200622 수정 : 스티키 수정
   // 20200624 수정
   function stickyThis(obj) {
      if (obj.length) {
         // 대상이 있을때만 이하 실행
         var scrTop = $(window).scrollTop();
         var objOffsetTop = obj.next().offset().top;
         var objHeight = obj.outerHeight();
         var gnbHeight = 61;
         if (objOffsetTop <= scrTop + objHeight + gnbHeight) {
            obj.addClass('fixed')
         } else {
            obj.removeClass('fixed')
         };
      };
   };
   stickyThis($(".js-marketPlanning_tab"))
   $(window).on('resize scroll', function () {
      stickyThis($(".js-marketPlanning_tab"))
   });
   // //20200624 수정
   // //20200622 수정 : 스티키 수정

   /* 기획전 탭
   ================================================== */
   // 20200608 수정 :: S
   var marketTabSlide = new Swiper('.js-marketTabSlide', {
      slidesPerView: 2.8,
      spaceBetween: 10,
      slidesOffsetBefore: $(window).width() * 0.04,
      slidesOffsetAfter: $(window).width() * 0.04,
      breakpoints: {
         768: {
            spaceBetween: 20,
            slidesPerView: 4.5,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
         }
      },
   });
   $(window).resize(function () {
      if ($(window).width() >= 768) {
         marketTabSlide.params.slidesOffsetBefore = 0;
         marketTabSlide.params.slidesOffsetAfter = 0;
      } else {
         marketTabSlide.params.slidesOffsetBefore = $(window).width() * 0.04
         marketTabSlide.params.slidesOffsetAfter = $(window).width() * 0.04
      }
   });
   // 20200608 수정 :: E
   /* 마켓>카테고리 호버
   ================================================== */
   $('.js-viewCatePc').on('mouseenter', function () {
      $(this).find('.nav_popTip').addClass('nav_popTip-on')
      $('.nav_category').show();
   })
   $('.js-viewCatePc').on('mouseleave', function () {
      $(this).find('.nav_popTip').removeClass('nav_popTip-on')
      $('.nav_category').hide();
   })

   /* 마켓 브랜드관 카테고리
      ================================================== */
   var marketBrandSlide = new Swiper('.js-brand_categorySlide', {
      slidesPerView: 'auto',
      breakpoints: {
         768: {
            allowTouchMove: false,
         }
      },
      on: {
         resize: function () {
            if ($(window).width() >= 768) {
               marketBrandSlide.translateTo(0, 0);
            }
         }
      },
   });

   /* 마켓 브랜드관 상품 슬라이드
   ================================================== */
   var marketProductSlide = new Swiper('.js-product_slide-brand', {
      slidesPerView: 'auto',
      breakpoints: {
         768: {
            allowTouchMove: false,
         }
      },
      on: {
         resize: function () {
            if ($(window).width() >= 768) {
               marketProductSlide.translateTo(0, 0);
            }
         }
      },
   });

   /* 브랜드관 페이지헤더 스티키
   ================================================== */
   // 20200820 브랜드관 페이지헤더 삭제 S
   // $('.js-pageHeader-scroll').waypoint(
   //    function (direction) {
   //          if (direction == "down") {
   //             $(".js-pageHeader-scroll").removeClass("pageHeader-brand");
   //          } else {
   //             $(".js-pageHeader-scroll").addClass("pageHeader-brand")
   //          }
   //    }, {
   //       offset: "-60px"
   //    }
   // );
   // 20200820 브랜드관 페이지헤더 삭제 E

   // 20200820 브랜드관 페이지헤더 추가 S
   function brandPageHeader(obj) {
      var scrollTop = $(window).scrollTop();
      if (scrollTop >= 60) {
         obj.removeClass('pageHeader-brand');
      } else {
         obj.addClass('pageHeader-brand');
      }
   }
   brandPageHeader($('.js-pageHeader-scroll'));
   $(window).on('resize scroll', function () {
      brandPageHeader($('.js-pageHeader-scroll'));
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
      slidesPerView: 1,
      pagination: {
         el: '.js-risingMarketPagination',
         type: 'bullets'
      },
      navigation: {
         nextEl: '.js-risingMarketNaviNext',
         prevEl: '.js-risingMarketNaviPrev',
      },
      breakpoints: {
         768: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3
         },

      },
   });

   /* 20200716 탑배너 닫기
   ================================================== */
   $('.js-topBannerClose').click(function () {
      $(this).parent().hide();
      commerceHeaderControl();
      return false;
   });

   /* 20201006 마켓 입점문의 이동 버튼
   ================================================== */
   $('.js-goForm').on('click', function () {
      var formCoordinate = $('.marketEnter_form').offset().top;
      var calCoordinate;
      if ($(window).width() >= 768) {
         calCoordinate = formCoordinate - 85;
      } else {
         calCoordinate = formCoordinate - 48;
      };
      $('html, body').animate({ scrollTop: calCoordinate }, 200);
      return false;
   });

   // =============================================================================================================================================================


    // 스타일 바로가기 아이콘 슬라이드
    // 20210623 삭제 s : ui 개편
    // var styleSlide1 = new Swiper('.group_tab', {
    //     slidesPerView: 'auto',
    // });
    // 20210623 삭제 e : ui 개편

   //해시태그 슬라이드
   var hashTagSlide = new Swiper('.js-htTodayPaginationSlide', {
      slidesPerView: 'auto',
   })

   $('.htToday_btn').on('click', function(){
      var idx = $(this).index() + 1;
      hashTagSlide.slideTo(idx - 1);
      hashTagGoodSlide.slideTo(idx);
      return false;
   });

   // 해시태그 상품,배너 슬라이드
   var hashTagGoodSlide = new Swiper('.slide_htToday', {
      loop: true,
      navigation: {
         nextEl:'.kids_htToday_naviNext',
         prevEl:'.kids_htToday_naviPrev',
      },
      on: {
         slideChangeTransitionEnd: function () {
            var idx = this.realIndex;
            hashTagSlide.slideTo(idx);
            $('.js-htTodayPaginationSlide .swiper-slide').removeClass('active')
            $('.js-htTodayPaginationSlide .swiper-slide').eq(idx).addClass('active')
         }
      },
   });

   //해시태그 추천
   var hashTagRecommand = new Swiper('.slide_hashtag', {
      slidesPerView: 'auto',
   })

   // 랭킹 상품 슬라이드
   var rankingGoods = new Swiper('.js-rankingGoods', {
      slidesPerView: 'auto',
      pagination: {
         el: '.ranking-pagination',
         clickable: true,
         type: 'bullets'
      },
   })

   //브랜드 기획전
   var brandExhibition = new Swiper('.brandExhibition', {
      slidesPerView: 1.1, // 20210623 수정 : ui 개편
      loop: true,
      centeredSlides: true,
      spaceBetween: 0,
      loopAdditionalSlides: 1,
      autoplay: {
         delay: 3000,
         disableOnInteraction: false,
      },
   })
   
   // 20210623 추가 s : ui 개편(기획전 배너)
   // 기획전 배너
   var exhibitionBanner = new Swiper('.exhibition_banner', {
       slidesPerView: 1.08,
       loopAdditionalSlides: 1,
       centeredSlides:true,
   })
	// 20210623 추가 e : ui 개편(기획전 배너)
   
   $(window).resize(function(){
	   brandExhibition.init();
   });

   // 2x2 상품구좌
   var kids2x2Slide = new Swiper('.js-kids2x2Slide', {
      slidesPerView: 'auto',
      pagination: {
         el: '.kids2x2-pagination',
         clickable: true,
         type:'bullets'
      }
   });

   //마침 이맘떄
   var kidsTabSlide = new Swiper('.kids_tab_list', {
      slidesPerView: 'auto',
   });

   //스타일 바로가기
   var styleSlide2 = new Swiper('.js-styleSlide', {
      slidesPerView: 'auto',
   });

   //품절 임박 상품 추천
   var soldOutGoods = new Swiper('.js-soldOutGoods', {
      slidesPerView: 'auto',
   });

   // 브랜드 스토리
   var kidsSlideBrandHis = new Swiper('.slide_brandHis', {
      slidesPerView: 'auto',
   });

   //새로운 상품
   var newArrival = new Swiper('.slide_newArrival', {
      slidesPerView: 'auto',
      pagination: {
         el: '.newArrival-pagination',
         clickable: true,
         type: 'bullets'
      }
   })

   // 하단 네비게이션 토글
   function toggleUploadPanel(){
      var toggleClickCount = true;
      var body = $('body');
      var uploadBtn = $('.botNav_uploadBtn');
      var uploadPanel = $('.js-botNav_uploadPanel');
      var dim = $('.js-dim-underBotNav');
      var thisPopHeight = uploadPanel.height();

      uploadBtn.on('click', function () {
         console.log('아무거나')
         uploadBtn.toggleClass('botNav_uploadBtn-on');
         // toggleClickCount의 true/false를 번갈아 실행함
         if (toggleClickCount) {
            dim.fadeIn(200);
            body.addClass('scrollfix');
            uploadPanel.addClass('botNav_uploadPanel-on').css({
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
               $(this).removeClass('botNav_uploadPanel-on')
            });
            toggleClickCount = true;
         };
      });

      // dim 영역 클릭시 하단 네비 닫기
      dim.on('click', function(){
         if (uploadPanel.hasClass('botNav_uploadPanel-on')) {
            dim.fadeOut(200);
            body.removeClass('scrollfix');
            uploadPanel.stop().animate({
               bottom: -thisPopHeight
            }, 200, function () {
               $(this).removeClass('botNav_uploadPanel-on')
            });
            uploadBtn.toggleClass('botNav_uploadBtn-on');
            toggleClickCount = true;
         };
      });

      $(window).resize(function(){
         thisPopHeight = uploadPanel.height();
      })
   }
   toggleUploadPanel();

   // 패션 메인슬라이드(실행 시점때문에 JSP 로 이동)
   // var fashionSlide = new Swiper('.js-fashionSlide', {
   //    slidesPerView: 1.1,
   //    loop: true,
   //    centeredSlides: true,
   //    autoplay: {
   //       delay: 3000,
   //       disableOnInteraction: false,
   //    },
   // })

   // 핫브랜드 슬라이드
   var life_Hotbrand_slide = new Swiper('.life_Hotbrand_slide', {
      slidesPerView: 2.2,
      loop: true,
      centeredSlides: true,
      spaceBetween: 15,
   });

   // 브랜드 이슈
   var life_bIssue_slide = new Swiper('.life_bIssue_slide', {
      slidesPerView: 1,
      loop : true,
      pagination: {
         el: '.life_bIssue_pagination',
         clickable: true,
         type: 'bullets'
      },
      on: {
         slideChangeTransitionEnd: function () {
            var idx = this.realIndex;
            $('.life_bIssue_pagination .swiper-pagination-bullet').removeClass('swiper-pagination-bullet-active')
            $('.life_bIssue_pagination .swiper-pagination-bullet').eq(idx).addClass('swiper-pagination-bullet-active')
         }
      },
   });

   filterSlide = new Swiper('.filterBar_filterInfo',{
      slidesPerView :'auto',
   })

   // 뜨는 상품 슬라이드
   var initSlideCtgr = $('.searchEngineMain').find('.midCategory_item-on').index();
   // 20210623 수정 s : ui개편
   styleSlide1 = new Swiper('.js-group_tab', {
      slidesPerView: 'auto',
      initialSlide: initSlideCtgr
   });
   // 20210623 수정 e : ui개편
   
   // 뜨는 상품 스티키
   var sticky = $(".js-categorySticky");
   sticky.waypoint(
       function (direction) {
          if (direction == "down") {
             sticky.addClass("active");
          } else {
             sticky.removeClass("active")
          }
       }, {
          offset: "30px" // 20210420 수정
       }
   );

   // 20210420 추가 :: s
   var disneySticky = $(".js-disneySticky");
   disneySticky.waypoint(
       function (direction) {
          if (direction == "down") {
             disneySticky.addClass("active");
          } else {
             disneySticky.removeClass("active")
          }
       }, {
          offset: "50px"
       }
   )
   // 20210420 추가 :: e

   // 20210324 추가 :: s
   //프리오더 스티키
   var perorderSticky = $(".js-copyToOuter");
   perorderSticky.waypoint(
       function (direction) {
          if (direction == "down") {
             perorderSticky.addClass("preActive");
          } else {
             perorderSticky.removeClass("preActive")
          }
       } , {
          offset: "10px"
       }
   );
   // 20210324 추가 :: e

   // 20210331 추가 :: s

   $(".js-toggleMenu").click(function(){
      $(this).toggleClass('section_titFold')
      $(this).parent().siblings('dd').slideToggle(200);
      return false;
   })
   // 20210331 추가 :: e
   
    // 메인 이벤트 배너 슬라이드
    var banner_slide;
	if($('.banner_slide .swiper-slide').length > 1){
	   banner_slide = new Swiper('.banner_slide',{
			loop: true,
			centeredSlides: true,
			spaceBetween: 0,
			pagination : {
				el : '.js_bannerSlide',
				clickable: true,
				type: 'bullets'
			}
	   })
	}
	
	// 20210511 추가 : 메인 바로가기 영역 수정 :: s
    function iOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].indexOf(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    if(iOS()){
        $('.main_section .ico_tit').addClass('ico_tit-ios')
    }
    // 20210511 추가 : 메인 바로가기 영역 수정 :: e
    
 // 20210611 추가 :: s 기획전,이벤트 페이지
    var selDd = $('.js_sel');
    var selCont = selDd.siblings($('.sel_dDown')).find('a');
    selDd.on('click', function(){
        var $this = $(this);
        $this.siblings($('.sel_dDown')).slideToggle(200);
        return false;
    })
    selCont.on('click', function(){
        var $this = $(this);
        var thisI = $(this).parent().index();
        var tTxt = $this.text();
    
        selDd.text(tTxt).siblings($('sel_dDown')).slideUp(200);
        var selSection = $('.separator_section').eq(thisI).offset().top;
        var nowH = $(window).scrollTop();
        if(selSection > nowH) {
            $('html,body').animate({
                scrollTop: $('.separator_section').eq(thisI).offset().top - 145
            }, 300);
        } else {
            $('html,body').animate({
                scrollTop: $('.separator_section').eq(thisI).offset().top - 196
            }, 300);
        }
    })

    $(window).on('scroll resize', function(){
        $('.separator_section').each(function(){
            var viewTop = $(window).scrollTop() + 194;
            var elTop = $(this).offset().top;
            var elBot = elTop + $(this).height();
            var elNum = $(this).index();
            var elTopOne = $('.separator_section').eq(1).offset().top;
            if(elTopOne > viewTop) {
                selDd.text(selCont.eq(0).text());
            } else {
                if((elTop <= viewTop) && (elBot >= viewTop)) {
                    selDd.text(selCont.eq(elNum).text());
                }
            }
        })
    })
    
    // 셀렉트 스티키
    var separatorSticky = $('.js_selSticky');
    separatorSticky.waypoint(
        function (direction) {
            if (direction == "down") {
                separatorSticky.addClass("active");
            } else {
                separatorSticky.removeClass("active")
            }
        }, {
            offset: "100px"
        }
    );
    // 20210611 추가 :: e 기획전,이벤트 페이지 
    
    var brandSticky = $('.brandCon.on .brandSticky');
        brandSticky.waypoint(
            function (direction) {
                if (direction == "down") {
                    brandSticky.addClass("active"); 
                    console.log('boom')
                } else {
                    brandSticky.removeClass("active");
                    console.log('nono')
                }
            }, {
                offset: "50px"
            }
        );
})
// 20211105 추가 :: s 커뮤니티 컨텐츠 텝
function openTab(event, tabName) {
    var i, tabcontent, tabitem;
    tabcontent = document.getElementsByClassName("home_tabCon");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabitem = document.getElementsByClassName("tab_item");
    for (i = 0; i < tabitem.length; i++) {
        tabitem[i].className = tabitem[i].className.replace(" on", "")
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " on";
}
// 20211105 추가 :: e 커뮤니티 컨텐츠 텝
