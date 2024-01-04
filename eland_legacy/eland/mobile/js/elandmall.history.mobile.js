/**
 * History Back 관련  
 */
;(function ($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};	
	
	/**
	 * 상품페이지에서 페이지 이동 전 처리 로직
	 * 
	 * 리스트 히스토리백에 필요한 필수 파라미터
	 * 	1. back_page_index : 리스트에서 클릭한 페이지 인덱스
	 *  2. back_conts_no : 리스트에서 클릭한 컨텐츠번호
	 *  
	 * 그 외 각 페이지에서 추가적으로 파라미터가 필요하다면 pin 파라미터에 추가하여 사용한다.
	 * pin 파라미터 ex) {test:'zzzzz', exam:'tttttt'}
	 */
	elandmall.history = {
		fnPageMovePrev : function(conts_no, page_idx, pin) {
		   	try {
		   		if (sessionStorage) {
		   			
		    		sessionStorage.setItem("url", location.href);
		    		sessionStorage.setItem("back_page_index", page_idx);
		    		sessionStorage.setItem("back_conts_no", conts_no);
		    		
		    		if(typeof(pin) != "undefined"){
			    		$.each(pin, function(key, value){
			    			sessionStorage.setItem(key, value);
			    			
			    			//상품상세 뒤로가기 처리
			    			if(key=="type" && value =="goodsDetail"){
			    				$("[id^=gcont]", "#contents").each(function(){
			    					if($(this).css("display") == "block"){
			    						sessionStorage.setItem("goodsDetailTab", $(this).attr("id"));
			    						sessionStorage.setItem("goodsDetailScroll", $(window).scrollTop());
			    					}
			    				});
			    				//포토탭
			    				$("[id=evalTab]", "#contents").each(function(){
		    						sessionStorage.setItem("goodsDetailScroll", $(window).scrollTop());
		    						sessionStorage.setItem("goodsDetailReviewPhoto", $(this).attr("data-value"));
			    				});
			    				//리뷰정렬
			    				$("[id=sch_gb]", "#contents").each(function(){
		    						sessionStorage.setItem("goodsDetailScroll", $(window).scrollTop());
		    						sessionStorage.setItem("goodsDetailSearchGb", $(this).attr("value"));
			    				});			
			    				//리뷰페이지
			    				$("[id=page_idx]", "#goods_rv").each(function(){
		    						sessionStorage.setItem("goodsDetailScroll", $(window).scrollTop());
		    						sessionStorage.setItem("pageIdxRv", $(this).attr("value"));
		    					});
								//QnA idx
								$("[id=page_idx]", "#goods_qna").each(function(){
									if ($(this).parent("div").is(":visible")) {
										sessionStorage.setItem("goodsDetailScroll", $(window).scrollTop());
										sessionStorage.setItem("pageIdxQna", $(this).attr("value"));
									}
                                });
								//답변탭탭
								$("[id^=qtab].on", "#goods_qna").each(function(){
                                    sessionStorage.setItem("goodsDetailScroll", $(window).scrollTop());
                                    sessionStorage.setItem("goodsDetailQnaAns", $(this).attr("data-value"));
                                });
				    		}
			    		});
		    		}
				}
			} catch(exception) {
		
			}
		},
		
		//기획전 상세에서 사용
		fnPlanShopMovePrev : function(conts_no, page_idx, gubun_cd, pin) {
		   	try {
		   		if (sessionStorage) {
		    		sessionStorage.setItem("url", location.href);
		    		sessionStorage.setItem("back_page_index", page_idx);
		    		sessionStorage.setItem("back_conts_no", conts_no);
		    		
		    		if(typeof (gubun_cd) !="undefined" && gubun_cd != ""){
		    			sessionStorage.setItem("curr_gubun_data", $("#goods_list_" + gubun_cd).html());
		    			sessionStorage.setItem("gubun_cd", gubun_cd);
		    			sessionStorage.setItem("formValue",$("#formGoodsSearch_" + gubun_cd).serialize());
		    		}else{
		    			sessionStorage.setItem("formValue",$("#formGoodsSearch").serialize());
		    		}
		    		
		    		if(typeof(pin) != "undefined"){
			    		$.each(pin, function(key, value){
			    			sessionStorage.setItem(key, value);
			    		});
		    		}
				}
			} catch(exception) {
				
			}
		},
		clear : function(){
			window.sessionStorage.clear();
		},
		//이미지뷰 유형 셋팅
		setImgViewType : function(viewType) {
			$(".search_wrap .s_type li").removeClass("on");
			$(".search_wrap .s_type li").hide();
			
			$("#" + viewType).parent("li").show();
			$("#" + viewType).parent("li").addClass("on");
			$("#" + viewType).parent("li").removeClass("active");
			$(".goods_list ul").attr("class","");
			$(".goods_list ul").addClass($("#" + viewType).attr("data-type"));	
		},
		
		// 뒤로가기 페이지인지 체크
		backPageCheck : function(pin){
			if (sessionStorage) {
				if(window.sessionStorage.length > 0) {
					// ""+ <== object -> string 형변환 / .split("#",1) 해시붙어서 url달라지는 경우 방지
		    		var currUrl = ""+location.href.split("#",1);
		    		var strgUrl = "";
		    		if(window.sessionStorage.getItem("url") != null){
						strgUrl = ""+window.sessionStorage.getItem("url").split("#",1);
					}
	    			// 뒤로가기 된 페이지
		    		if( strgUrl == currUrl && window.sessionStorage.getItem("isBack") == "true") {
		    			
		    			// 탭 유지
		    			var tab_id = sessionStorage.getItem("tab_id");
		    			var tab_click_new_load = sessionStorage.getItem("tab_click_new_load");		// 탭을 클릭했을 때, load 또는 ajax로 호출하는 지
		    			
		    			if (tab_id !== null){
		    				$("#"+tab_id).trigger("click");
		    			}
						
		    			if (tab_click_new_load != "Y"){		    			
			    			// 스크롤 이동
			    			var scroll_y = sessionStorage.getItem("scroll_y");
					        if(scroll_y !== null){
					            window.scrollTo(0, scroll_y);
					        }
		    			}
		    			
		    			return true;
		    			
		    		} else {
		    			return false;
		    		} 
		    	}
		    }
		},
		
		fnPageMovePrevScrollY : function(conts_no, page_idx, pin) {
		   	try {
		   		if (sessionStorage) {
		   			if(typeof(pin) != "undefined"){
		   				pin.scroll_y = $(document).scrollTop();
		   			}else{
		   				pin = {scroll_y : $(document).scrollTop()};
		   			}
		   			
		    		elandmall.history.fnPageMovePrev(conts_no, page_idx, pin);
		    		
				}
			} catch(exception) {
		
			}
		}
	};
	
	/**
	 * 킴스클럽 상품페이지에서 페이지 이동 전 처리 로직
	 */
	elandmall.kimsHistory = {
		// 상품 보기방식 유지
		fnPageMovePrevFilterGoodsImg : function(type) {
		   	try {
		   		if (sessionStorage) {
	   				if(type == "best"){ // 베스트
	   					var btnList = $(".ctgGds .filterGdsImg button");
	   					if(btnList.length > 0){
	   						btnList.each(function(){
		   						if($(this).attr('aria-pressed') == 'true'){
		   							sessionStorage.setItem("bestFilterGdsImg", $(this).attr('class'));
		   						}
		   					});
	   					}
	   				}else if(type == "search"){ // 검색결과
	   					var btn = $(".ctgGds .ctgFilter .rbox .btGdLst");
	   					if(btn.length > 0){
	   						var dataView = $(".ctgGds .ctgFilter .rbox .btGdLst").attr('data-view');
	   						sessionStorage.setItem("searchFilterGdsImg", dataView);
	   					}
	   				}else if(type == "ctg"){ // 카테고리
	   					var btn = $(".ctgGds .ctgFilter .rbox .btGdLst");
	   					if(btn.length > 0){
	   						var dataView = $(".ctgGds .ctgFilter .rbox .btGdLst").attr('data-view');
	   						sessionStorage.setItem("ctgFilterGdsImg", dataView);
	   					}
	   				}
				}
			} catch(exception) {
		
			}
		}
	};
	
})(jQuery);