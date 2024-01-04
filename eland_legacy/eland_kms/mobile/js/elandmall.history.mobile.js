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
		}
	};
	
})(jQuery);