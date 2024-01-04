;(function($) {
	var cal_input_layer = null;
	fnsearch = {
		/**
		*  검색 Form submit
		**/				
		headerSearchForm_submit	: function () {
			var searchText ="";
			
			if(webSizeMobileYn() == "N"){	//pc 
				searchText = $.trim($("#searchPrd").val());
			}else{ //모바일
				searchText = $.trim($("#searchPrdMo").val());
			}
				
			if(searchText == ""){
				alert("검색어를 입력해주세요.");
				return false;				
			}else{
				if(webSizeMobileYn() == "N"){	//pc
					$("#headerSearchFormPc").submit();	
				}else{ //모바일
					$("#headerSearchFormMo").submit();
				}
				
			}
		},
			
		/**
		* 입력받은 키워드로 검색
		*
		* param  frmObj - 폼오브젝트   
		*
		* return	boolean
		**/	
		srchKwd: function( frmObj ){
			var kwd = $.trim(frmObj.kwd.value);
			var link = $("#header_LandingLink").val();
			if(kwd == ""){
				alert("검색어를 입력해주세요.");
				return false;
			}else{
				fnsearchresent.callKwdCookie(kwd);
				return  true;
			}				
		},
		
		/**
		* 결과내 재검색, 검색어 제외 용 
		*
		* param  frmObj - 폼오브젝트   
		*
		* return	boolean
		**/	
		reSrchKwd: function( frmObj ){
			var kwd = $.trim(frmObj.kwd.value);
			if(kwd == ""){
				alert("검색어를 입력해주세요.");
				return false;
			}else{
				return true;
			}				
		},
		
		/**
		* 입력받은 키워드로 Default 검색
		*
		* param  kwd - 검색어   
		*
		* return	void
		**/	
		dftSchKwd: function( kwd ){
			kwd = $.trim(kwd);
			if(kwd == ""){
				alert("검색어를 입력해주세요.");
				return;
			}else{		
				if(webSizeMobileYn() == "N"){	//pc 
					$("#searchPrd").val(kwd);
					$("#headerSearchFormPc").submit();	
				}else{ //모바일
					$("#searchPrdMo").val(kwd);
					$("#headerSearchFormMo").submit();
				}
			}
		},
		
		/**
		* 입력받은 키워드로 Default 검색
		*
		* param  Object - 검색어   
		*
		* return	void
		**/	
		dftSchKwd2: function( obj ){
			var kwd = obj.getAttribute("data-kwd");
			kwd = $.trim(kwd);
			if(kwd == ""){
				alert("검색어를 입력해주세요.");
				return;
			}else{		
				if(webSizeMobileYn() == "N"){	//pc 
					$("#searchPrd").val(kwd);
					$("#headerSearchFormPc").submit();	
				}else{ //모바일
					$("#searchPrdMo").val(kwd);
					$("#headerSearchFormMo").submit();
				}
			}
		},		
		/**
		 * 기본 파라미터 셋팅
		 * 
		 *  return void
		 */
		setParameters : function(search_type){
			var brandNm = "";			//브랜드명
			var brandNo = "";			//브랜드번호
			var vendNm = "";			//지점
			var materialInfo = "";		//소재
			var bnenfitDcf = "";		//무료배송
			var bnenfitSdc = "";		//셋트할인
			var bnenfitGift = "";		//사은품
			var bnenfitOneMore = "";	//하나더
			var bnenfitDiscount = "";	//즉시할인
			var bnenfitWelfare = "";	//복지몰여부
			var bnenfitStaffDC = "";   //직원할인여부
			var sizeInfo =  "";			//사이즈
			var colorInfo = "";			//색상
			var salePriceMin = "";		//최소가격
			var salePriceMax = "";		//최대가격
			var discountMin = "";		//최소할인율
			var discountMax = "";		//최대할인율
			var vend_info = "";			// 지점 정보
			var category_info = "";		// 카테고리 정보
			var deliCostFreeYn = "";   // 무료배송 여부
			var filter_info = "";   	// 다이나믹필터 정보
			var deliInfoQuick = "";     //빠른배송 여부
			var deliInfoStorePick = ""; //스토어픽 여부
			var ctgCd1 = ""; //카테고리 1Depth
			var ctgCd2 = ""; //카테고리 2Depth
			
			if(search_type != "brand"){
				$("input:checkbox[name='brand_nm']").each(function(index,value){
					if(this.checked){
						if(brandNm == ""){
							brandNm = this.value;
						}else if(brandNm != ""){
							brandNm = brandNm+"|"+(this.value);
						}
					}
				});
				$("#hstr_brandNm").val(brandNm);
			}
			
			$("input:checkbox[name='brand_no']").each(function(index,value){
				if(this.checked){
					if(brandNo == ""){
						brandNo = this.value;
					}else if(brandNo != ""){
						brandNo = brandNo+","+(this.value);
					}
				}
				$("#hstr_brandNo").val(brandNo);
			});
			
			
			$("input:checkbox[name='vend_nm']").each(function(index,value){
				if(this.checked){
				  if(vendNm == ""){
					  vendNm = this.value;
					}else if(vendNm != ""){
						vendNm = vendNm+","+(this.value);
				  }
				}
		    });
			
			$("input:checkbox[name='vend_info']").each(function(index,value){
				if(this.checked){
				  if(vend_info == ""){
					  vend_info = this.value;
					}else if(vend_info != ""){
						vend_info = vend_info+","+(this.value);
				  }
				}
		    });
			
			$("input:checkbox[name='bnenfit_info']").each(function(index,value){
				if(this.checked){
				  if(this.value == "dcf"){
					  bnenfitDcf = "Y";
				  }else if(this.value == "sdc"){
					  bnenfitSdc = "Y";
				  }else if(this.value == "gift"){
					  bnenfitGift = "Y";	
				  }else if(this.value == "oneMore"){
					  bnenfitOneMore = "Y";
				  }else if(this.value == "discount"){
					  bnenfitDiscount = "Y";
				  }
				}
		    });
			
			$("input:checkbox[name='deli_type_info']").each(function(index,value){
				if(this.checked){
					if(this.value == "quick_deli"){
						deliInfoQuick = "Y";
					}else if(this.value == "store_pick"){
						deliInfoStorePick = "Y";
					}
				}
			});
			
			$("input:checkbox[name='welfare_bnenfit_info']").each(function(index,value){
				if(this.checked){
				  if(this.value == "welfare"){
					  bnenfitWelfare= "Y";
				  }else if(this.value == "staffDC"){
					  bnenfitStaffDC = "Y";
				  }
				}
		    });
			
			$("input:checkbox[name='size_info']").each(function(index,value){
				if(this.checked){
				  if(sizeInfo == ""){
					  sizeInfo = this.value;
					}else if(sizeInfo != ""){
						sizeInfo = sizeInfo+","+(this.value);
				  }
				}
		    });
			
			$("input:checkbox[name='color_info']").each(function(index,value){
				if(this.checked){
				  if(colorInfo == ""){
					  colorInfo = this.value;
					}else if(colorInfo != ""){
						colorInfo = colorInfo+","+(this.value);
				  }
				}
		    });
			
			$("input:checkbox[name='filter_info']").each(function(index,value){
				if(this.checked){
				  if(filter_info == ""){
					  filter_info = this.value;
					}else if(filter_info != ""){
						filter_info = filter_info+","+(this.value);
				  }
				}
		    });
			
			/*
			 * 카테고리 인풋은 직접제어함
			 * 
			if(search_type != "ctgr") {
				$("input[name='category_info']:checked").each(function(index,value){
					if(cate_navi1.length <= 0 && cate_navi2.length <= 0){
						ctgCd1 = "";
						ctgCd2 = "";
					} else if(cate_navi1.length > 0 && cate_navi2.length <= 0) {
						ctgCd1 = this.value
					} else {
						ctgCd2 = this.value
					}
			    });
				$("#hstr_ctg_cd").val(ctgCd1);
				$("#hstr_ctg_cd2").val(ctgCd2);
			}
			*/
			
			$("input[name='deliCostFreeYn']:checked").each(function(index,value){
				if(this.checked){
					deliCostFreeYn = 'Y';
				}
		    });
			
			this.srchFilterBox_price();
			
			salePriceMin = $("#min_price").val();
			salePriceMax = $("#max_price").val();
			
			discountMin = $("#min_rate").val();
			discountMax = $("#max_rate").val();

			$("#hstr_vendNm").val(vendNm);
			$("#hstr_deliCostFreeYn").val(bnenfitDcf);
			$("#hstr_setDicountYn").val(bnenfitSdc);
			$("#hstr_giftYn").val(bnenfitGift);
			$("#hstr_oneMoreYn").val(bnenfitOneMore);
			$("#hstr_discountYn").val(bnenfitDiscount);
			$("#hstr_welfareYn").val(bnenfitWelfare);
			$("#hstr_staffDCYn").val(bnenfitStaffDC);
			$("#hstr_size").val(sizeInfo);
			$("#hstr_minPrice").val(salePriceMin);
			$("#hstr_maxPrice").val(salePriceMax);
			$("#hstr_minRate").val(discountMin);
			$("#hstr_maxRate").val(discountMax);
			$("#hstr_color").val(colorInfo);
			$("#hstr_vendInfo").val(vend_info);
			$("#hstr_deliCostFreeYn").val(deliCostFreeYn);
			$("#hstr_filter_info").val(filter_info);
			$("#hstr_quick_deli_poss_yn").val(deliInfoQuick);
			$("#hstr_field_recev_poss_yn").val(deliInfoStorePick);
		},
		
		/*
		 *  filter 뒤로가기 시 처리
		 */
		setBackParameters : function(parameters){

			var params = parameters.split("&");
			
			var filter_tag = "<span class=\"btn__del\" >선택 해제</span>";
			
			var min_price = $("#hstr_minPrice").val();
			var max_price = $("#hstr_maxPrice").val();
			var min_rate = $("#hstr_minRate").val();
			var max_rate = $("#hstr_maxRate").val();
			
			var org_min_price = $("#hd_min").val();
			var org_max_price = $("#hd_max").val();
			var org_min_rate = 0;
			var org_max_rate = 100;
			
			var chg_cnt = 0; 
			
			$("input:checkbox[name='size_info']").each(function(index,value){
				this.checked = false;
			});
			
			$("input:checkbox[name='filter_info']").each(function(index,value){
				this.checked = false;
			});
			
			$(".filterBtn").removeClass("filterBtn--on");
			$(".filterBar__filterList").empty();
			
			for(i=0;i<params.length;i++){
				var param = params[i];
				var name = param.split("=")[0];
				var val = param.split("=")[1];
				
				// 보기갯수
				if(name == "pageSize"){
					$("input:hidden[name='pageSize']").val(val);
				}				
				
				if(name == "sort") {
					if(val != null && val != ''){
						var sortList = $("#s_sort").find("option");
					    if(sortList != null && sortList.length > 0){
					    	for(z=0;z<sortList.length;z++){
					    		if($(sortList[z]).val() == val){
									$(sortList[z]).prop('selected',true);
									$('#hstr_pageNum').val('1');
									$("#hstr_sort").val(val);
									break;
								}
							}
						}
					}
				}
				
				//사이즈
				if(name == "size_info"){
					$("input:checkbox[name='size_info']").each(function(index,value){
						var size_infos = null;
						
						if(val.indexOf('%2C') > -1){
							size_infos = val.split("%2C");
						}else{
							size_infos = val.split(",");
						}
						
						if(size_infos != null && size_infos.length > 0){
							for(j=0;j<size_infos.length;j++){
								if(this.value == decodeURI(size_infos[j])){
									this.checked = true;
									var objId =  $(this).attr("id");
						    		var objVal = $(this).parent().find("label").text();
						    		
						    		$(".filterBar__filterList").append($("#filterBarDiv").html());
					    			$(".filterBar__filterList").find("a[value=customFilterId]").attr("value", objId);
					    			
					    			$(".filterBar__filterList").find("a[value='" + objId + "']").html(objVal + filter_tag);				    			
					    			$(".filterBar__filterList").find("a[value='" + objId + "']").parent().show();
					    			chg_cnt++;
								}
							}
						}
					});
				}
				
				//다이나믹 필터
				if(name == "filter_info"){
					$("input:checkbox[name='filter_info']").each(function(index,value){
						var filter_info = null;
						
						if(val.indexOf('%2C') > -1){
							filter_info = val.split("%2C");
						}else{
							filter_info = val.split(",");
						}
						if(filter_info != null && filter_info.length > 0){
							for(j=0;j<filter_info.length;j++){
								if(this.value == decodeURI(filter_info[j])){
									this.checked = true;
									var objId =  $(this).attr("id");
						    		var objVal = $(this).parent().find("label").text();
						    		
						    		$(".filterBar__filterList").append($("#filterBarDiv").html());
					    			$(".filterBar__filterList").find("a[value=customFilterId]").attr("value", objId);
					    			
					    			$(".filterBar__filterList").find("a[value='" + objId + "']").html(objVal + filter_tag);				    			
					    			$(".filterBar__filterList").find("a[value='" + objId + "']").parent().show();
					    			chg_cnt++;
								}
							}
						}
					});
				}
				
				//최소금액
				if(name == "min_price"){
					if(val != null && val != ''){
						$("#min_price").val(val);
						min_price = val;
					}
				}
				
				//최대금액
				if(name == "max_price"){
					if(val != null && val != ''){
						$("#max_price").val(val);
						max_price = val;
					}
				}
				
				//최소할인율
				if(name == "min_rate"){
					if(val != null && val != ''){
						$("#min_rate").val(val);
						min_rate = val;
					}
				}
				
				//최대할인율
				if(name == "max_rate"){
					if(val != null && val != ''){
						$("#max_rate").val(val);
						max_rate = val;
					}
				}
			}
			
			//가격바
			if(typeof(max_price) != undefined && max_price > 0 && (max_price != org_max_price || min_price != org_min_price)){
				$(".amountPrice").val(ThousandSeparate(min_price) + "원 ~ " + ThousandSeparate(max_price) + "원 이하");
                fnSetFilterBar($("#amountPrice")); //필터바 적용
    			
    			//가격 ui 변경
        		$(".sliderRange__sliderPrice").slider("option", "values", [min_price, max_price]);
        		chg_cnt++;
			}	
			
			//할인바
			if(typeof(max_rate) != undefined && max_rate > 0 && (max_rate != org_max_rate || min_rate != org_min_rate)){
				$(".amountDiscount").val(min_rate + "% ~ " + max_rate + "%");
				fnSetFilterBar($("#amountDiscount")); //필터바 적용
				
				//할인율 ui 초기화
        		$(".sliderRange__sliderDiscount").slider("option", "values", [min_rate, max_rate]);
        		chg_cnt++;
			}
             
			
			if(chg_cnt > 0){
				$(".filterBtn").addClass("filterBtn--on");
			}
		},
		
		/**
		 * filter 처리
		 * 
		 * @param (가격 : 
		 * f
		 * @return
		 */
		srchFilterBox_price: function(){
				var hd_min = $("#hd_min").val();
				var hd_max = $("#hd_max").val();

				var min_price = $("#min_price").val();
				var max_price = $("#max_price").val();
				
				if(Number(min_price) > Number(hd_max)) {
					$("#min_price").val(hd_max);
				}
				if(Number(min_price) < Number(hd_min)) {
					$("#min_price").val(hd_min);
				}
				if(Number(max_price) < Number(hd_min)) {
					$("#max_price").val(hd_min);
				}
				if(Number(max_price) > Number(hd_max)) {
					$("#max_price").val(hd_max);
				}
		},
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		/**
		*  검색 필터영역 체크박스 클릭시 검색
		*
		* return	void
		**/	
		srchFilterBox: function(search_type){
			this.setParameters(search_type);
			var type = "POST";
			var cache = false;
			
			var url = "/kidimarket/search.action";
			
			if(search_type == "ctgr" || search_type == "init" || search_type == "del" || search_type == "sort"){
				url = "/kidimarket/initKidiMarketDispCtg.action";
			}else if(search_type == "brandctgr" || search_type == "brandinit" || search_type == "brandsort" || search_type == "branddel"){
				url = "/kidimarket/initKidiMarketBrandCategoryGoods.action";
			}else{
				url = "/kidimarket/search.action";
				type = "GET";
			}
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});
			
			document.location.hash = "#" + parameters;
			
			parameters += "list_only_yn=Y";

			$.ajax({ 
				url : url
				, data : parameters
				, type : type 
				, cache : cache
				, dataType : "html"
				, success : function(data) {
					
					if(search_type == "brandctgr" || search_type == "brandinit" || search_type == "brandsort" || search_type == "branddel"){
						
						//스크롤 위치 수정
					    var scrollPosition = $(window).scrollTop();
					    sessionStorage.setItem("brandscrollPosition", scrollPosition);
						
						//$("#brandCategorySearchGoodsResultInc").html(data);
						
					    //elandmall.lazyload();
					    
					    //$("#brandCategorySearchGoodsResultInc").show();
						
					}else{
						//데이터 임시 저장
						$("#tempGoodsList").html(data);
						
						//페이지 인덱스 설정
						$(".search_wrap input:hidden[name=total_count]").val($("#tempGoodsList input:hidden[name=total_count]").val());
						$(".search_wrap input:hidden[name=page_index]").val($("#tempGoodsList input:hidden[name=page_index]").val());
						
						//페이지 인덱스 셋팅 후 임시 데이터 삭제
						$("#tempGoodsList #paging").remove();
						
						//하나더 목록 추가
						//$(".search_wrap .goods_list_load").html($("#tempGoodsList").html());
						
						// 더보기 숨김여부 체크
						var p_idx = parseInt($("input:hidden[name=page_index]").val());
					    var r_p_p = parseInt($("input:hidden[name=rows_per_page]").val());
					    var g_total = parseInt($("input:hidden[name=total_count]").val());
					  	//alert("fnInit > p_idx :"+p_idx + "r_p_p :"+r_p_p+ "g_total :"+g_total);
					    if ( (p_idx*r_p_p) >= g_total ) {
					    	$(".goods_list_more").hide();
					    }else{
					    	$(".btn_current_count").text(p_idx*r_p_p);
					    	$(".btn_total_count").text(g_total);
					    }
						// 전체페이지 설정후 임시내용 삭제
					    $("#tempGoodsList").html("");
						elandmall.lazyload();
						
						$(".goods_list_load").css("visibility", "");
					}
					
					
					//전체 갯수 수정
					if($(".search__resultNum >p >span").length){
						$(".search__resultNum >p >span").html(g_total);
					}
					
					//필터바 셋팅
					if($(".filterBar__filterList")){
						
						//filterSlider.reInit();
					}
					
					//필터 활성화 및 창 닫기 처리
					if($(".filterBtn").hasClass("filterBtn--open")){
						if($(".filterBar__filterList").find("a").length){
			    			$(".filterBtn").addClass("filterBtn--on");
			    		}else{
			    			$(".filterBtn").removeClass("filterBtn--on");
			    		}
						
						//필터 초기화, 정렬 처리가 아닌 경우만 클릭 이벤트 호출
						if(!(search_type == "init" || search_type == "brandinit" || search_type == "searchInit" || search_type == "sort" || search_type == "brandsort")){
							$(".filterBtn").trigger("click");
							
							//모바일 필터 팝업영역 닫힘 처리
							if($(".dim--filter").hasClass("dim--on")) $(".dim--filter").removeClass("dim--on");
							if($("body").hasClass("scrollfix--moOnly")) $("body").removeClass("scrollfix--moOnly");
						}
						
					}
					
					//필터 단건 삭제인 경우 필터 활성화 처리
					if(search_type == "del" || search_type == "branddel"){
						if($(".filterBar__filterList").find("a").length){
			    			$(".filterBtn").addClass("filterBtn--on");
			    		}else{
			    			$(".filterBtn").removeClass("filterBtn--on");
			    		}
					}
					
					if(sessionStorage.scrollPosition) {
						var scrlPos = sessionStorage.getItem("scrollPosition"); //카테고리, 검색, 키디베스트 스크롤
						var brandScrlPos = sessionStorage.getItem("brandscrollPosition"); //브랜드관 스크롤
						
						if(scrlPos > 0){
						    
						    if($(document).height() - $(window).height() < scrlPos && !(search_type == "brandctgr" || search_type == "brandinit" || search_type == "brandsort" || search_type == "branddel")){
								fnMoreListPage();
							}else{
								$(window).scrollTop(scrlPos);
								sessionStorage.setItem("scrollPosition", "");
							}
						}							
							
						if(brandScrlPos > 0){
							$(window).scrollTop(brandScrlPos);
							sessionStorage.setItem("brandscrollPosition", "");
						}
					}
					
				} , error : function(xhr, error, code) {
					//alert("조회 중 오류가 발생하였습니다.");
				}
			});
		},
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		/**
		* 카테고리 검색
		* param  ctgr_cd - 카테고리 코드
		* return	void
		**/	
		searchCategory: function( ctgr_cd ){
			window.location.href = "/kidimarket/initKidiMarketDispCtg.action?disp_ctg_no="+ctgr_cd;
		},
		
		/**
		* 카테고리 검색
		* param  ctgr_cd - 카테고리 코드
		* return	void
		**/	
		searchBrandCategory: function( brand_cd, ctgr_cd ){
			window.location.href = "/dispctg/initBrandShop.action?brand_no="+brand_cd+"&disp_ctg_no="+ ctgr_cd;
		},
		
		/**
		* 통합검색 카테고리 대분류 선택시
		* param  ctgr_cd - 카테고리 코드
		* return	void
		**/	
		searchCategoryList: function( ctgr_cd ){
			this.setParameters();
			
			$('#hstr_ctg_cd').val(ctgr_cd);
			$('#hstr_pageNum').val('1');

			this.srchFilterBox();
		},
		/**
		* 통합검색 카테고리 대분류 선택시
		* param  ctgr_cd - 카테고리 코드
		* return	void
		**/	
		searchBrandCategoryList: function( ctgr_cd ){
			this.setParameters();
			
			$('#hstr_ctg_cd').val(ctgr_cd);
			$('#hstr_pageNum').val('1');

			this.srchFilterBox('brand');
		},
		/**
		* 카테고리 매칭 함수. 
		* 카테고리명을 넘겨주면 코드를, 코드값을 넘겨주면 카테고리 명을 리턴
		* 
		* param  ctgr - 카테고리값 
		* param  type - 타입(0 : 카테고리명, 1 : 카테고리코드 )  
		*
		* return str 			
		**/
		rtnCtgrVal: function( ctgr, type ){
			var rtn_val = "";
			if( type != 0 && type != 1 )
				return rtn_val;
			
			for(var i=0;i<ctgr_cnt;i++){
				if( ctgr_arr[i][type] == ctgr ){
					if( type == 0 ){
						rtn_val = ctgr_arr[i][1];
					}else{
						rtn_val = ctgr_arr[i][0];
					}
				}
			}
			return rtn_val;
		},

		
		/**
		 * 정렬 검색 실행
		 * 
		 * @param val
		 * 
		 * @return
		 */
		 goSearchSort: function( sort_val ){
			this.setParameters();
			
			$('#hstr_pageNum').val('1');
			$("#hstr_sort").val(sort_val);

			this.srchFilterBox();
		 },
		 
		 /**
		 * 정렬 검색 실행
		 * 
		 * @param val
		 * 
		 * @return
		 */
		 goSearchCategorySort: function( sort_val, searchYn ){
			 this.setParameters();
			
			$('#hstr_pageNum').val('1');
			$("#hstr_sort").val(sort_val);
			
			if(searchYn == "Y"){
				this.srchFilterBox();
			}else{
				this.srchFilterBox('sort');
			}
			
		 },
		 
		 /**
		 * 브랜드 정렬 검색 실행
		 * 
		 * @param val
		 * 
		 * @return
		 */
		 goBrandSearchCategorySort: function( sort_val ){
			this.setParameters();
			
			$('#hstr_pageNum').val('1');
			$("#hstr_sort").val(sort_val);
			
			this.srchFilterBox('brandsort');
			
		 },
		 
		 /**
		 * 정렬 검색 실행
		 * 
		 * @param val
		 * 
		 * @return
		 */
		 goSearchBrandSort: function( sort_val ){
			 this.setParameters();
				
				$('#hstr_pageNum').val('1');
				$("#hstr_sort").val(sort_val);

				this.srchFilterBox('brand');
		 },
				
		 /**
		 * 날짜 검색 실행(radio box)
		 * 
		 * @param date
		 * 
		 * @return
		 */
		 goDate: function( date ){
			$('#hstr_date').val(date);
			$('#hstr_pageNum').val('1');
			$('#historyForm').submit();
		},
		
		/**
		 * 브랜드 필터박스 초기화
		 * 
		 * @return
		 */
		initBrandFilterBox: function(){
			var cnt = 0;
			$("input:checkbox[name='brand_no']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			var inputMin = $("#min_price").val();
			var inputMax = $("#max_price").val();
			var hdMin = $("#hd_min").val();
			var hdMax = $("#hd_max").val();
			
			if(inputMin != hdMin && inputMax != hdMax){
				$("#min_price").val(hdMin);
				$("#max_price").val(hdMax);
				cnt++;
			}
			
			$("#min_rate").val(0);
			$("#max_rate").val(100);
			
			if(cnt > 0){
				fnsearch.srchFilterBox();
			}
		},
		
		/**
		 * 상세조건 필터박스 초기화
		 * 
		 * @return
		 */
		initDetailFilterBox: function(search_type){
			var cnt = 0;
			if(search_type != "brand"){
				$("input:checkbox[name='brand_nm']").each(function(index,value){
					if(this.checked){
						this.checked = false;
						cnt++;
					}
			    });
			}
			$("input:checkbox[name='vend_nm']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			$("input:checkbox[name='bnenfit_info']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			$("input:checkbox[name='welfare_bnenfit_info']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			$("input:checkbox[name='color_info']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			$("input:checkbox[name='material_info']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			$("input:radio[name='fast_price']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			$("input:radio[name='fast_discount']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			$("input:radio[name='fast_discount']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			//사이즈 초기화
			$("input:checkbox[name='size_info']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			//다이나믹필터 초기화
			$("input:checkbox[name='filter_info']").each(function(index,value){
				if(this.checked){
					this.checked = false;
					cnt++;
				}
		    });
			
			var inputMin = $("#min_price").val();
			var inputMax = $("#max_price").val();
			var hdMin = $("#hd_min").val();
			var hdMax = $("#hd_max").val();
			
			$("#min_price").val(hdMin);
			$("#max_price").val(hdMax);
			
			$("#min_rate").val(0);
			$("#max_rate").val(100);
			
			if(inputMin != hdMin || inputMax != hdMax){
				cnt++;
			}
			
			//필터바 초기화
			if($(".filterBar__filterList")){
				$(".filterBtn").removeClass("filterBtn--on");
				$(".filterBar__filterList").empty();
			}
			
			if(cnt > 0){
				if(search_type != null && search_type != ""){
					fnsearch.srchFilterBox(search_type);
				}
			}
			
			//우리아이 최적화 데이터 초기화
			if($(".layerPop__fieldSet--kids").is(':visible') && search_type != null && search_type != ""){
				$(".fieldSet__input__area span:nth-child(2)").find("input").prop("checked", true);
			}
		},
		
		getPageRange: function( ctgr_total ){
			var pageNum = 0;
			var pageSize = 0;
			var firstPage = 0;
			var lastPage = 0;
			var pageStr = "";
			
			pageNum = $('#hstr_pageNum').val();
			pageSize = $('#hstr_pageSize').val();
			
			lastPage = parseInt(pageNum) * parseInt(pageSize);
			firstPage = parseInt(lastPage-(parseInt(pageSize)-1));
			
			if(lastPage > ctgr_total)
				lastPage = ctgr_total;
			
			pageStr = firstPage + "-" + lastPage;
			return pageStr;
		},
		
		
		/**
		 * 날짜값이 제대로 되어 있는지 체크한다.
		 * @param startDate
		 * @param endDate
		 */
		 chkValidDate: function( date ){
			var valid = false;
			var year = 0;
			var month = 0;
			var day = 0;
			
			if(date.length == 8){ // YYYYMMDD 형식일 경우
				year = date.substring(0,4);
				month = date.substring(4,6);
				day = date.substring(6,8);
				
				if(year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31)
					valid = true;
			}else if(date.length == 10){ // YYYY MM DD 형식일 경우
				year = date.substring(0,4);
				month = date.substring(5,7);
				day = date.substring(8,10);
				
				if(year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31)
					valid = true;
			}
			return valid;
		},
		
				
		/**
		 * 연도 필터 결과 가져오기.
		 * 
		 * @param
		 * 
		 * @return string(url)
		 */
	 	AjaxParamGetYear : function(){
			var params = "";
			
			params += "kwd=" + $('#hstr_kwd').val();
			params += "&category=" + ctgr_cd;
			params += "&reSrchFlag=" + $('#hstr_reSrchFlag').val();
			params += "&pageNum=1";
			params += "&pageSize=1000";
			params += "&detailSearch=" + $('#hstr_detailSearch').val();
			params += "&srchFd=" + $('#hstr_srchFd').val();
			params += "&date=" + $('#hstr_date').val();
			params += "&startDate=" + $('#hstr_startDate').val();
			params += "&endDate=" + $('#hstr_endDate').val();
			params += "&fileExt=" + $('#hstr_fileExt').val();
			params += "&year=" + $('#hstr_year').val();
			
			$('#historyForm').children('input[name=\"preKwd\"]').each(function(){
				params += "&preKwd=" + encodeURIComponent($(this).val());
			});
			
			params += "&callLoc=filter";
			
			return params;
		},
		
		/**
		 * 조직 구조 가져오기
		 * 
		 * @param
		 * 
		 * @return string(url)
		 */
		 AjaxParamGetPersonTree : function(){
			var params = "";
			
			params += "kwd=" + encodeURIComponent($('#hstr_kwd').val());
			params += "&category=" + ctgr_cd;
			params += "&reSrchFlag=" + $('#hstr_reSrchFlag').val();
			params += "&pageNum=1";
			params += "&pageSize=1000";
			params += "&detailSearch=" + $('#hstr_detailSearch').val();
			params += "&srchFd=" + $('#hstr_srchFd').val();
			params += "&date=" + $('#hstr_date').val();
			params += "&startDate=" + $('#hstr_startDate').val();
			params += "&endDate=" + $('#hstr_endDate').val();
			
			$('#historyForm').children('input[name=\"preKwd\"]').each(function(){
				params += "&preKwd=" + encodeURIComponent($(this).val());
			});
			
			params += "&callLoc=filter";
			
			return params;
		},
		
		/**
		 * 첨부파일 내용 가져오기
		 * 
		 * @param
		 * 
		 * @return string(url)
		 */
		 AjaxParamGetFileCont : function( rowid ){
			var url = "./ajax/getFileCont.jsp?";
			
			var params = "";
			params += "rowid=" + rowid;
			params += "&kwd=" + encodeURIComponent($('#hstr_kwd').val());
			params += "&callLoc=preview";
			params = url + params;
			
			return params;
		},
			
		/**
		 * 조직 구조 그리기
		 * 
		 * @param
		 * 
		 * @return
		 */
		DrawUtilDrawFilterTree : function( data ){
			var tempArr = null;
			var depth = ["","",""];
			var FilterHtml = "";
			var cnt = 1;
			var short_flag = false;		 // 줄임말 사용여부
			var short_len = 5;			 // 줄임말 사용시 길이
			
			if(data.length > 0){
				FilterHtml += "<li>";
				FilterHtml += "<img src=\"images/ico_plus.gif\" width=\"9\" height=\"9\" class=\"hd_bt active\" alt=\"접기\" />";
				FilterHtml += "<label for=\"org1\">전체</label>";
				FilterHtml += "<ul>";
				
				for(var i=0; i<data.length; i++){
					tempArr = data[i].organization.split("^");
					
					if(short_flag == true && tempArr[1].length > short_len){
						tempArr[1] = tempArr[1].substring(0,short_len) + "...";
					}
					
					if(tempArr.length > 0){
						if(tempArr[0]!=depth[0]){		// 본부가 틀릴 경우
							if(i!=0){
								FilterHtml += "</ul>";
								FilterHtml += "</li>";
							}
							depth[0] = tempArr[0];
							FilterHtml += "<li>";
							FilterHtml += "<img src=\"images/ico_plus.gif\" width=\"9\" height=\"9\" class=\"hd_bt active\" alt=\"접기\" />";
							FilterHtml += "<label class=\"treeData\" for=\"org1-" + i+1 + "\">" + tempArr[0] + "</label>";
							FilterHtml += "<ul>";
							FilterHtml += "<li><label class=\"treeData\" for=\"org1-1-" + cnt +  "\">" + tempArr[1] + " </label></li>";
							
						}else{	// 본부가 같다면...
							FilterHtml += "<li><label class=\"treeData\" for=\"org1-1-" + cnt +  "\">" + tempArr[1] + " </label></li>";
						}
						cnt++;
					}
					
					tempArr = null;
				}
				
				FilterHtml += "</ul>";
				FilterHtml += "</li>";
				
				$('#org_m').html(FilterHtml);
			}
		},
		
		/**
		 * 연도 그리기
		 * 
		 * @param
		 * 
		 * @return
		 */
		 DrawUtilDrawFilterYear : function( data, $this ){
			var FilterHtml = "";
			var cnt = 1;
			
			if(data.length > 0){
				FilterHtml = "<li class=\"first\"><input type=\"checkbox\" id=\"s_year1\" value=\"all\" class=\"all_chk\" /><label for=\"s_year1\">전체</label></li>";
					
				for(var i=0; i<data.length; i++){
					if(data[i].year!=""){
						cnt++;
						FilterHtml += "<li><input type=\"checkbox\" id=\"s_year" + cnt + "\" value=\"" + data[i].year + "\" /><label for=\"s_year" + cnt + "\">"+ data[i].year +"년</label></li>";
					}
				}
				
				$('.s_year').html(FilterHtml);
			}else{
				$this.hide();
			}
		},		

		/**
		 * filter 처리
		 * 
		 * @param (size : 
		 * 
		 * @return
		 */
		 ResizingDrawFilter : function( sizeStatus ){
			var ctgr_cd = $('#var_category').val();
			if(sizeStatus < 2){	// wide 모드가 아닐 경우				
				if(ctgr_cd == 'PERSON' || ctgr_cd == 'NIMAGE'){	// 필터가 보이지 말아야 될 경우					
					$('.filter').hide();
					$('#contents').addClass('pos_ab');					
				}else if(ctgr_cd == 'SITE' || ctgr_cd == 'NNEWS'){ // 필터 더보기를 없애야 될 경우					
					$('.filter .bt_filter').hide();					
				}else if(ctgr_cd == 'DOCUMENT' || ctgr_cd == 'BOARD'){ // 체크 박스를 제거해야 되는 경우					
					$('#yearFilter').hide();
					$('#extFilter').hide();					
				}
			}else{	// wide 모드 일 경우
				if(ctgr_cd == 'PERSON'){
					$('.filter').show();
				}else if(ctgr_cd == 'DOCUMENT'){
					$('#yearFilter').show();
					$('#extFilter').show();
				}else if(ctgr_cd == 'BOARD'){
					$('#yearFilter').show();
				}
			}
		}
	}
})(jQuery);