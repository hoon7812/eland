;(function($) {
	var cal_input_layer = null;
	fnsearch = {
		/**
		*  검색 Form submit
		**/				
		headerSearchForm_submit	: function () {
			var searchTerm = $.trim($("#searchTerm").val());
			
			if(searchTerm == ""){
				alert("검색어를 입력해주세요.");
				return false;				
			}else{
		            	$("#headerSearchForm").submit();	
			}
		},		
		
		/**
		* 입력받은 키워드로 검색
		*
		* param frmObj - 폼오브젝트   
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
		* param frmObj - 폼오브젝트   
		*
		* return	boolean
		**/	
		reSrchKwd: function( frmObj ){
			var kwd = $.trim(frmObj.kwd.value);
			var flag = false;
			
			if(kwd == ""){
				alert("검색어를 입력해주세요.");
				return false;
			}
			
			$("#totalSearchForm > input:hidden[name=preKwd]").each(function(){
				if(kwd == this.value){
					flag = true;
				}
			});
			if(flag){
				alert("다른 키워드를 입력해주세요.");
				return false;
			}else{
				return true;
			}
		},
		
		/**
		* 입력받은 키워드로 Default 검색
		*
		* param kwd - 검색어   
		*
		* return	void
		**/	
		dftSchKwd: function( kwd ){
			if(kwd == ""){
				alert("검색어를 입력해주세요.");
				return;
			}else{		
				$("#searchTerm").val(kwd);
				this.headerSearchForm_submit();
			}
		},

		/**
		* 입력받은 키워드로 Default 검색
		*
		* param Object - 검색어   
		*
		* return	void
		**/	
		dftSchKwd2: function( obj ){
			var kwd = obj.getAttribute("data-kwd");
			if(kwd == "" || kwd == null){
				alert("검색어를 입력해주세요.");
				return;
			}else{		
				$("#searchTerm").val(kwd);
				this.headerSearchForm_submit();
			}
		},
		
		/**
		 * 기본 파라미터 셋팅
		 * 
		 *  return void
		 */
		setParameters : function(search_type){
			var brandNm = "";			//브랜드
			var brandNo = "";			//브랜드
			var vendNm = "";			//지점
			var bnenfitDcf = "";		//무료배송
			var bnenfitSdc = "";		//셋트할인
			var bnenfitGift = "";		//사은품
			var bnenfitOneMore = "";	//하나더
			var bnenfitDiscount = "";	//즉시할인
			var bnenfitWelfare = "";	//복지몰여부
			var bnenfitStaffDC = "";   //직원할인여부
			var sizeInfo =  "";			//사이즈
			var colorInfo = "";			//색상
			var ctgr_4depth = "";		//카테고리
			var salePriceMin = "";		//최소가격
			var salePriceMax = "";		//최대가격
			var discountMin = "";		//최소할인율
			var discountMax = "";		//최대할인율
			var listType = "image";		//목록타입
			var fastPrice = "";			//가격
			var fastDiscount = "";   	//할인율
			var hstrBrandNo = $("#hstr_brandNo").val();
			var vend_info = "";			// 지점정보
			var category_info = "";		// 카테고리 정보
			var deliCostFreeYn = "";   // 무료배송 여부
			var filter_info = "";   	// 다이나믹필터 정보
			var deliInfoQuick = "";     //빠른배송 여부
			var deliInfoStorePick = ""; //스토어픽 여부
			var deliInfoLot = ""; 		//오늘직송(하이퍼) 여부
			var deliInfoNormal = ""; 	//일반배송 여부
			var deliInfoFresh = ""; 	//산지직송 여부
			var fltr_str = [];			//필터 정보 리스트 
			var category_1depth = "";	    //대카테고리번호
			var category_2depth = "";	    //중카테고리번호
			var l_disp_cnt = $("input:radio[name='cate_info_l']:checked").length; //현재 선택된 대카테고리 개수
			var m_disp_cnt = $("input:radio[name='cate_info_m']:checked").length; //현재 선택된 중카테고리 개수
			
			var price_chg_yn="";	// 가격필터에 의한 필터목록 노출유무
			var direct_input_yn="";	// 슈펜 가격필터_직접입력 유무
			
			if(search_type != "brand"){
				$("input:checkbox[name='brand_nm'][id^='lay_shop_chk']").each(function(index,value){
					if(this.checked){
					  if(brandNm == ""){
						  brandNm = this.value;
						}else if(brandNm != ""){
							brandNm = brandNm+"|"+(this.value);
					  }
					  
					  fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "brand_info"
						});		
					}
			    });
				$("#hstr_brandNm").val(brandNm);
			}
			
			$("input:checkbox[name='brand_no']").each(function(index,value){
				if(this.checked){
					if(brandNo.indexOf(this.value) < 0){	
					  if(brandNo == ""){
						  brandNo = this.value;
						}else if(brandNo != ""){
							brandNo = brandNo+","+(this.value);
					  }
					}
				}
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
					
					fltr_str.push({
						name : $(this).data("fltr_name"),
						tag_id  : $(this).attr("id"),
						data_cd : "vend_info"
					});				  
				}
		    });

			if(m_disp_cnt >0){
				$("input:radio[name='cate_info_m']").each(function(index,value){
					if(this.checked){
						category_2depth = this.value;

						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "cate_info_m"
						});							
						return false;
					}
				});				
			}else if(l_disp_cnt >0){
				$("input:radio[name='cate_info_l']").each(function(index,value){
					if(this.checked){
						category_1depth = this.value;

						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "cate_info_l"
						});							
						return false;
					}
				});				
			}
			
			$("input:checkbox[name='bnenfit_info']").each(function(index,value){
				if(this.checked){
				  if(this.value == "dcf"){
					  bnenfitDcf = "Y";
					  
					  fltr_str.push({
						  name : $(this).data("fltr_name"),
						  tag_id  : $(this).attr("id"),
						  data_cd : "bnenfit_info_dcf"
					  });						  
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
					// 빠른배송
					if(this.value == "quick_deli"){
						deliInfoQuick = "Y";
						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "deli_type_info"
						});
					// 스토어픽
					}else if(this.value == "store_pick"){
						deliInfoStorePick = "Y";
						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "deli_type_info"
						});
					// 오늘직송
					}else if(this.value == "lot_deli"){
						deliInfoLot = "Y";
						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "deli_type_info"
						});
					// 일반배송
					}else if(this.value == "normal_deli"){
						deliInfoNormal = "Y";
						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "deli_type_info"
						});
					// 산지직송
					}else if(this.value == "fresh_deli"){
						deliInfoFresh = "Y";
						fltr_str.push({
							name : $(this).data("fltr_name"),
							tag_id  : $(this).attr("id"),
							data_cd : "deli_type_info"
						});
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
				  
				  fltr_str.push({
					  name : $(this).data("fltr_name"),
					  tag_id  : $(this).attr("id"),
					  data_cd : "size_info"
				  });					  
				}
		    });
			
			$("input:checkbox[name='color_info']").each(function(index,value){
				if(this.checked){
					if(colorInfo == ""){
						colorInfo = this.value;
					}else if(colorInfo != ""){
						colorInfo = colorInfo+","+(this.value);
					}
				
					fltr_str.push({
						name : $(this).data("fltr_name"),
						tag_id  : $(this).attr("id"),
						img_url : $(this).parent().find('img').attr('src'),
						data_cd : "color_info"
					});				  
				}
		    });
			
			$("input:checkbox[name='ctgr_4depth']").each(function(index,value){
				if(this.checked){
				  if(ctgr_4depth == ""){
					  ctgr_4depth = this.value;
					}else if(ctgr_4depth != ""){
						ctgr_4depth = ctgr_4depth+"|"+(this.value);
				  	}
					if(elandmall.global.disp_mall_no == '0000053'){
					fltr_str.push({
					  	name : $(this).data("fltr_name"),
					  	tag_id  : $(this).attr("id"),
					  	data_cd : "ctgr_4depth"
					});	
					}
				}
			});
			
			$("button[name='fast_price']").each(function(index,value){
				if($(this).hasClass('on')){
				  if(fastPrice == ""){
					  fastPrice = $(this).attr('data-max-price');
					}else if(fastPrice != ""){
						fastPrice = fastPrice+","+$(this).attr('data-max-price');
				  }
				}
		    });
			
			$("button[name='fast_discount']").each(function(index,value){
				if($(this).hasClass('on')){
				  if(fastDiscount == ""){
					  fastDiscount = $(this).attr('data-min-dis');
					}else if(fastDiscount != ""){
						fastDiscount = fastDiscount+","+$(this).attr('data-min-dis');
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
				  fltr_str.push({
					  name : $(this).data("fltr_name"),
					  tag_id  : $(this).attr("id"),
					  data_cd : "filter_info"
				  });					  
				}
		    });
			
			$("input[name='deliCostFreeYn']:checked").each(function(index,value){
				if(this.checked){
					deliCostFreeYn = 'Y';
				}
		    });
			
			
			if($('.lp_type01').hasClass("on")){
				listType = "image";
			}else{
				listType = "list";
			}
			
			salePriceMin = $( "#l_range" ).val();
			salePriceMax = $( "#r_range" ).val();

			$("#min_price").children('em').html(parseInt(salePriceMin).toLocaleString());
			$("#max_price").children('em').html(parseInt(salePriceMax).toLocaleString());
			
			//가격 필터정보 생성
			//JSP에서  "price_chg_yn" INPUT 태그 선언 후 제어한다.			
			if($("#price_chg_yn").val() =="Y"){
				price_chg_yn = "Y";
				fltr_str.push({
					name : parseInt(salePriceMin).toLocaleString()+"원 ~ "+parseInt(salePriceMax).toLocaleString()+"원",
					tag_id  : "price_info",
					data_cd : "price_info"
				});
				//슈펜 가격필터_직접입력 유무
				if(elandmall.global.disp_mall_no == '0000053'){
					if($("#direct_input_yn").val() == "Y"){
						direct_input_yn = "Y";
					}else{
						direct_input_yn = "N";
					}
				}
			}else{
				price_chg_yn = "N";
			}
			
			
			
			//할인율 필터정보 생성
			//JSP에서  "discount_chg_yn" INPUT 태그 선언 후 제어한다			
			if($("#discount_chg_yn").val() =="Y"){
				discountMin = $( "#l_disrange" ).val();
				discountMax = $( "#r_disrange" ).val();
				
				fltr_str.push({
					name : "할인율 "+discountMin+" ~ "+discountMax+"%",
					tag_id  : "discount_info",
					data_cd : "discount_info"
				});				
			}			
			
			//[START] 필터영역에 검색목록 데이터 삽입
			if($("#slctd_fltrs .filtrs").find('ul').length >0){

				var fltrs_html = "";
				
				
				if(fltr_str.length >0){
					$.each(fltr_str, function(idx,data){
						var temp = data.name;
						var temp2 = "";
						var delBtn = "<button type=\"button\" class=\"del\" onclick=\"fnDelFltr(this);\"><span class=\"ir\">삭제</span></button>";
						
						// 오늘받송, 스토어쇼핑 필터 고정
						if ( (data.tag_id == "dlvT02" && $("#hstr_storepick_page_yn").val() == "Y") || 
								(data.tag_id == "dlvT01" && $("#hstr_quickdeli_page_yn").val() == "Y") ) {
							delBtn = "";
						}
						
						if(data.data_cd == "color_info"){
							temp2 = temp.toUpperCase();
							if(temp2 == 'WHITE' || temp2 == '화이트' || temp2 == '흰색'){
								fltrs_html += "<li data-tag_id=\""+data.tag_id+"\" data-data_cd=\""+data.data_cd+"\"><i class=\"white\"><img src=\""+data.img_url+"\" alt=\""+data.name+"\" /></i>"+data.name+"<button type=\"button\" class=\"del\" onclick=\"fnDelFltr(this);\"><span class=\"ir\">삭제</span></button>"+"</li>";
							}else{
								fltrs_html += "<li data-tag_id=\""+data.tag_id+"\" data-data_cd=\""+data.data_cd+"\"><i><img src=\""+data.img_url+"\" alt=\""+data.name+"\" /></i>"+data.name+"<button type=\"button\" class=\"del\" onclick=\"fnDelFltr(this);\"><span class=\"ir\">삭제</span></button>"+"</li>";
							}
							
						}else{
							fltrs_html += "<li data-tag_id=\""+data.tag_id+"\" data-data_cd=\""+data.data_cd+"\">"+data.name+ delBtn +"</li>";
						}
					});
					$("#slctd_fltrs").css("display","block");
				}else{
					$("#slctd_fltrs").css("display","none");
				}
				
				$("#slctd_fltrs .filtrs").find('ul').html(fltrs_html);
				
				//데이터 초기화
				fnDelFltr = function(del){
					var tag_id = $(del).parent().data("tag_id");
					var data_cd = $(del).parent().data("data_cd");
					
					if(data_cd == "price_info"){
						if(elandmall.global.disp_mall_no == '0000053'){
							$("#sch_detail input:radio").attr("checked", false);
						}
						priceSlideInit();
						
					}else if(data_cd == "discount_info"){
						discountInit();
						
					}else{
						var tag_type = $("input[id='"+tag_id+"']").attr('type');
						
						if(tag_type == "radio"){
							$("input[id='"+tag_id+"']").prop("checked",false);
							
							//카테고리 중분류 필터 제거시 상위 대분류까지 처리함
							if(data_cd == "cate_info_m"){
								var l_ctg_id = $("input[id='"+tag_id+"']").data("lctg_id");
								$("input[id='"+l_ctg_id+"']").prop("checked",false);
							}
						}else{
							$("input[id='"+tag_id+"']").attr("checked",false);
						}
					}
					
					fnsearch.srchFilterBox();
				}
			}
			//[END] 필터영역에 검색목록 데이터 삽입
			
			$("#hstr_brandNm").val(brandNm);
			if ( brandNo!=null && brandNo!="" && brandNo.length>0) {
				$("#hstr_brandNo").val(brandNo);
			} else {
				$("#hstr_brandNo").val(hstrBrandNo);
			}
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
			$("#hstr_pageNum").val(1);
			$("#hstr_listType").val(listType);
			$("#hstr_fastPrice").val(fastPrice);
			$("#hstr_fastDiscount").val(fastDiscount);
			$("#hstr_category_4depth").val(ctgr_4depth);
			$("#hstr_vendInfo").val(vend_info);
			$("#hstr_quick_deli_poss_yn").val(deliInfoQuick);
			$("#hstr_lot_deli_yn").val(deliInfoLot);
			$("#hstr_field_recev_poss_yn").val(deliInfoStorePick);
			$("#hstr_normal_deli_yn").val(deliInfoNormal);
			$("#hstr_fresh_deli_yn").val(deliInfoFresh);
			$("#hstr_filter_info").val(filter_info);
			$("#hstr_price_chg_yn").val(price_chg_yn);
			$("#hstr_direct_input_yn").val(direct_input_yn); //슈펜 검색필터_직접입력
			if (search_type != "ctgr") {
				$("input[name='category_1depth']", "#historyForm").val(category_1depth);
				$("input[name='category_2depth']", "#historyForm").val(category_2depth);
			}
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		setBackParameters : function(parameters){

			var params = parameters.split("&");
			
			
			var min_price = $("#hstr_minPrice").val();
			var max_price = $("#hstr_maxPrice").val();
			var min_rate = $("#hstr_minRate").val();
			var max_rate = $("#hstr_maxRate").val();
			
			if(elandmall.global.disp_mall_no == '0000053'){
				var direct_input_yn = $("#direct_input_yn").val();
			}
			
			$("input:checkbox[name='brand_nm']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='brand_no']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='vend_nm']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='vend_info']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='material_info']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='bnenfit_info']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='welfare_bnenfit_info']").each(function(index,value){
				this.checked = false;
				$(this).parent().find('span').removeClass('chk');
			});
			
			$("input:checkbox[name='size_info']").each(function(index,value){
				this.checked = false;
				$(this).parent('li').removeClass('checked');
			});
			
			$("input:checkbox[name='color_info']").each(function(index,value){
				this.checked = false;
				$(this).parent('li').removeClass('checked');
			});
			
			$("input:checkbox[name='filter_info']").each(function(index,value){
				this.checked = false;
				$(this).parent('li').removeClass('checked');
			});

			$("button[name='fast_price']").each(function(index,value){
				$(this).removeClass('on');
		    });
			
			$("button[name='fast_discount']").each(function(index,value){
				$(this).removeClass('on');
		    });
			
			$("input:checkbox[name='deli_type_info']").each(function(index,value){
				this.checked = false;
				$(this).parent('li').removeClass('checked');
			});

			$("input:radio[name='cate_info_l']").each(function(index,value){
				this.checked = false;
			});

			$("input:radio[name='cate_info_m']").each(function(index,value){
				$(this).parent().parent().parent().parent().find('input').prop("checked", false);
				this.checked = false;
			});
			
			// 가격필터 초기화
			if (typeof(priceSlideInit) == "function") priceSlideInit();
			
			// 할인율 초기화
			if (typeof(discountInit) == "function") discountInit();
			
			for(i=0;i<params.length;i++){
				var param = params[i];
				var name = param.split("=")[0];
				var val = param.split("=")[1];
				
				// 보기갯수
				if(name == "pageSize"){
					$("input:hidden[name='pageSize']").val(val);
					$("span.sel_txt span").html(val);
				}
				
				//브랜드
				if(name == "brand_nm"){
					var brand_nms = null;
					
					if(val.indexOf('%7C') > -1){
						brand_nms = val.split("%7C");
					}else{
						brand_nms = val.split("|");
					}
					
					$("input:checkbox[name='brand_nm']").each(function(index,value){
						if(brand_nms != null && brand_nms.length > 0){
							for(j=0;j<brand_nms.length;j++){
								if(this.value == decodeURIComponent(brand_nms[j])){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}
						}
					});
				}
				
				if(name == "brand_no"){
					var brand_nos = null;
					
					if(val.indexOf('%2C') > -1){
						brand_nos = val.split("%2C");
					}else{
						brand_nos = val.split(",");
					}
					
					$("input:checkbox[name='brand_no']").each(function(index,value){
						if(brand_nos != null && brand_nos.length > 0){
							for(j=0;j<brand_nos.length;j++){
								if(this.value == decodeURI(brand_nos[j])){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}
						}
					});
				}
				
				
				//지점
				if(name == "vend_info"){
					$("input:checkbox[name='vend_info']").each(function(index,value){
						var vend_nms = null;
						
						if(val.indexOf('%2C') > -1){
							vend_nms = val.split("%2C");
						}else{
							vend_nms = val.split(",");
						}
						
						if(vend_nms != null && vend_nms.length > 0){
							for(j=0;j<vend_nms.length;j++){
								if(this.value == decodeURI(vend_nms[j])){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}
						}
					});
				}
				
				//소재
				if(name == "material_info"){
					$("input:checkbox[name='material_info']").each(function(index,value){
						var material_infos = null;
						
						if(val.indexOf('%2C') > -1){
							material_infos = val.split("%2C");
						}else{
							material_infos = val.split(",");
						}
						
						if(material_infos != null && material_infos.length > 0){
							for(j=0;j<material_infos.length;j++){
								if(this.value == decodeURI(material_infos[j])){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}
						}
					});
				}
				
				//혜택 1
				if(name == "deliCostFreeYn" || name == "setDicountYn" || name == "giftYn" || name == "oneMoreYn" || name == "discountYn"){
					$("input:checkbox[name='bnenfit_info']").each(function(index,value){
						
						if(val == 'Y'){
							if(name == 'deliCostFreeYn'){
								if(this.value == 'dcf'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}else if(name == 'setDicountYn'){
								if(this.value == 'sdc'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}else if(name == 'giftYn'){
								if(this.value == 'gift'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}								
							}else if(name == 'oneMoreYn'){
								if(this.value == 'oneMore'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}								
							}else if(name == 'discountYn'){
								if(this.value == 'discount'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}								
							}
						}
						
					});
				}
				
				//혜택  2
				if(name == "welfareYn" || name == "staffDCYn"){
					$("input:checkbox[name='welfare_bnenfit_info']").each(function(index,value){
						
						if(val == 'Y'){
							if(name == 'welfareYn'){
								if(this.value == 'welfare'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}else if(name == 'staffDCYn'){
								if(this.value == 'staffDC'){
									this.checked = true;
									$(this).parent().find('span').addClass('chk');
								}
							}
						}
						
					});
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
									$(this).parent('li').addClass('checked');
								}
							}
						}
					});
				}
				
				//컬러
				if(name == "color_info"){
					$("input:checkbox[name='color_info']").each(function(index,value){
						var color_infos = null;
						
						if(val.indexOf('%2C') > -1){
							color_infos = val.split("%2C");
						}else{
							color_infos = val.split(",");
						}
						
						if(color_infos != null && color_infos.length > 0){
							for(j=0;j<color_infos.length;j++){
								if(this.value == decodeURI(color_infos[j])){
									this.checked = true;
									$(this).parent('li').addClass('checked');
								}
							}
						}
					});
				}
				
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
									$(this).parent('li').addClass('checked');
								}
							}
						}
					});
				}
				
				//최소금액
				if(name == "min_price"){
					if(val != null && val != ''){
						min_price = val;
					}else{
						min_price = $('#var_minPrice').val();
					}
				}
				
				//최대금액
				if(name == "max_price"){
					if(val != null && val != ''){
						max_price = val;
					}else{
						max_price = $('#var_maxPrice').val();
					}
				}
				
				//최소할인율
				if(name == "min_rate"){
					if(val != null && val != ''){
						$("#discount_chg_yn").val("Y");
						min_rate = val;
						
						$("button[name='discount_button']").each(function(index,value){
							if($(this).attr('data-min-dis') == min_rate){
								$(this).addClass('on');
							}
							
						});
						$('#l_disrange').val(min_rate);
					}
				}
				
				//최대할인율
				if(name == "max_rate"){
					if(val != null && val != ''){
						$("#discount_chg_yn").val("Y");
						max_rate = val;
						$('#r_disrange').val(max_rate);
					}
				}
				
				//리스트타입
				if(name == "listType"){
					if(val != null && val != ''){
						if(val == 'image'){
							$('.lp_type01').addClass("on");
							$('.lp_type02').removeClass("on");
						}else{
							$('.lp_type02').addClass("on");
							$('.lp_type01').removeClass("on");
						}
					}else{
						$('.lp_type01').addClass("on");
						$('.lp_type02').removeClass("on");
					}
				}
				
				if(name == "category_1depth"){
					if(val != null && val != ''){						
						$("input:radio[name='cate_info_l']").each(function(index,value){
							if(this.value == val){
								this.checked = true;
							}
						});
					}
				}
				
				if(name == "category_2depth"){
					if(val != null && val != ''){						
						$("input:radio[name='cate_info_m']").each(function(index,value){
							if(this.value == val){
								$(this).parent().parent().parent().parent().find('input').prop("checked", true);
								this.checked = true;
							}
						});
					}
				}
				
				if(name == "category_4depth"){
					var ctgr_depths = null;
					
					if(val.indexOf('%7C') > -1){
						ctgr_depths = val.split("%7C");
					}else{
						ctgr_depths = val.split("|");
					}
						
					$("input:checkbox[name='ctgr_4depth']").each(function(index,value){
						if(ctgr_depths != null && ctgr_depths.length > 0){
							for(j=0;j<ctgr_depths.length;j++){
								if(this.value == decodeURI(ctgr_depths[j])){
									this.checked = true;
									$(this).parent('.eCk:first').addClass('checked')
								}
							}
						}
					});
				}
				
				
				if(name == "sort") {
					if(val != null && val != ''){
						var sortList = $("#lp_sch_type_rst").find("li").find("a");
					    if(sortList != null && sortList.length > 0){
					    	for(z=0;z<sortList.length;z++){
					    		if($(sortList[z]).data('sort') == val){
									$(sortList[z]).addClass('on')
								}else{
									$(sortList[z]).removeClass('on')
								}
							}
						}
					}
				}
				
				// 스토어픽
				if(name == "field_recev_poss_yn"){
					$("input:checkbox[name='deli_type_info'][value='store_pick']").each(function(index,value){
						if(val != null && val != ''){
							this.checked = true;
							$(this).parent().find('span').addClass('chk');
						}
					});
				}
				
				// 빠른배송
				if(name == "quick_deli_poss_yn"){
					$("input:checkbox[name='deli_type_info'][value='quick_deli']").each(function(index,value){
						if(val != null && val != ''){
							this.checked = true;
							$(this).parent().find('span').addClass('chk');
						}
					});
				}
				
				// 오늘직송(하이퍼)
				if(name == "lot_deli_yn"){
					$("input:checkbox[name='deli_type_info'][value='lot_deli']").each(function(index,value){
						if(val != null && val != ''){
							this.checked = true;
							$(this).parent().find('span').addClass('chk');
						}
					});
				}
				
				// 일반배송
				if(name == "normal_deli_yn"){
					$("input:checkbox[name='deli_type_info'][value='normal_deli']").each(function(index,value){
						if(val != null && val != ''){
							this.checked = true;
							$(this).parent().find('span').addClass('chk');
						}
					});
				}
				
				// 산지직송
				if(name == "fresh_deli_yn"){
					$("input:checkbox[name='deli_type_info'][value='fresh_deli']").each(function(index,value){
						if(val != null && val != ''){
							this.checked = true;
							$(this).parent().find('span').addClass('chk');
						}
					});
				}
				
				// 가격필터
				if(name == "price_chg_yn"){
					if(val != null && val != ''){
						$("#price_chg_yn").val(val);
					}
				}
				
				//슈펜 가격필터_직접입력
				if(name == "direct_input_yn"){
					if(val != null && val != ''){
						$("#direct_input_yn").val(val);
					}
				}
			}
			
			if(typeof(max_price) != undefined && max_price > 0 ){
				$( "#l_range" ).val(min_price);
				$( "#r_range" ).val(max_price);
				
				if($('#l_range').length > 0){
					if(elandmall.global.disp_mall_no == '0000053'){
						priceChange();
					}else{
						slideRngChange();
					}
				}
				
				$("button[name='price_button']").each(function(index,value){
					if($(this).attr('data-max-price') == max_price){
						$(this).addClass('on');
					}
					
				});
				
				//슈펜
				if(elandmall.global.disp_mall_no == '0000053' ) {
					$("input[name='sch_prc']").each(function(index,value){
						if($(this).attr('data-max-price') == max_price && $(this).attr("id") != "sch_direct" && $("#direct_input_yn").val() == "N"){
							$(this).prop("checked",true);
						}
						if($(this).attr('data-max-price') == max_price && $(this).attr("id") == "sch_direct" && $("#direct_input_yn").val() == "Y"){
							$(this).click();
							$(".ins_prc input[type='text']").prop('disabled',false);
						}
					});
				}
				
//				$("button[class='prc_button']").each(function(index,value){
//					if(max_price != null && max_price != ''){
//						if(max_price == $(this).data("max-price")){
//							$(this).addClass("on");
//						}
//					}
//				});
			}
			
			for(i=0;i<params.length;i++){
				var param = params[i];
				var name = param.split("=")[0];
				var val = param.split("=")[1];
				
				//가격
				if(name == "fast_price"){
					$("button[name='fast_price']").each(function(index,value){
						var fast_prices = null;
						
						if(val.indexOf('%2C') > -1){
							fast_prices = val.split("%2C");
						}else{
							fast_prices = val.split(",");
						}
						
						if(fast_prices != null && fast_prices.length > 0){
							for(j=0;j<fast_prices.length;j++){
								if($(this).attr('data-max-price') == decodeURI(fast_prices[j])){
									$(this).addClass('on');
								}
							}
						}
					});
				}
				
				//할인율
				if(name == "fast_discount"){
					$("button[name='fast_discount']").each(function(index,value){
						var fast_discounts = null;
						
						if(val.indexOf('%2C') > -1){
							fast_discounts = val.split("%2C");
						}else{
							fast_discounts = val.split(",");
						}
						
						if(fast_discounts != null && fast_discounts.length > 0){
							for(j=0;j<fast_discounts.length;j++){
								if($(this).attr('data-min-dis') == decodeURI(fast_discounts[j])){
									$(this).addClass('on');
								}
							}
						}
					});
				}
			}
			
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		/**
		* 좌측 검색 필터영역 체크박스 클릭시 검색
		*
		* return	void
		**/	
		srchFilterBox: function(search_type){
			this.setParameters(search_type);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);

			document.location.href = '#hashPage1/'+parameters;
		},
		
		/**
		* 좌측 검색 필터영역 브랜드 ('좌측브랜드','더보기-상품수순', '더보기-가나다순')
		*
		* param kwd - 타입, 브랜드 전체 수
		*
		* return	void
		**/	
		/*
		srchFilterBox_brandNm: function(lay_shop, size){
			var brandNm = "";			//브랜드
			
			for(var i = 0; i < size; i++){
				if($("#"+lay_shop+i)[0].checked){
					if( brandNm.indexOf( ($("#"+lay_shop+i).val()) < 0 ) ){
						if(brandNm == ""){
							brandNm = $("#"+lay_shop+i).val();
						}else if(brandNm != ""){
							brandNm = brandNm+","+($("#"+lay_shop+i).val());
						}
					}
				}
			}
			
			$("#hstr_brandNm").val(brandNm);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);

			document.location.href = '#hashPage1/'+parameters;
		},
		*/
		/**
		* 좌측 검색 필터영역 가격범위 변경시 검색
		* 
		* param kwd - 가격 최소값, 최대값   
		* 
		* return	void
		**/	
		srchFilterBox_price: function(min, max){
			this.setParameters();
			$("#hstr_minPrice").val(min);
			$("#hstr_maxPrice").val(max);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);
			document.location.href = '#hashPage1/'+parameters;
		},
		
		/**
		* 좌측 검색 필터영역 할인율범위 변경시 검색
		* 
		* param kwd - 할인율 최소값, 최대값   
		* 
		* return	void
		**/	
		srchFilterBox_discount: function(min, max){
			this.setParameters();
			$("#hstr_minRate").val(min);
			$("#hstr_maxRate").val(max);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);
			document.location.href = '#hashPage1/'+parameters;
		},
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		/**
		* 좌측 검색 필터영역 체크박스 클릭시 검색
		*
		* return	void
		**/	
		srchFilterBox_ctgSearch: function(){
			this.setParameters();
			var ctgrNo = "";			//세카테고리 번호
			
			$("input:checkbox[name='ctgr_4depth']").each(function(index,value){
				if(this.checked){
				  if(ctgrNo == ""){
					  ctgrNo = this.value;
					}else if(ctgrNo != ""){
						ctgrNo = ctgrNo+","+(this.value);
				  }
				}
		    });
			
			$("#hstr_category_4depth").val(ctgrNo);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/dispctg/initDispCtg.action?listOnly=Y&" + parameters);
			
			document.location.href = '#hashPage1/'+parameters;
		},

		/**
		* 좌측 검색 필터영역 가격범위 변경시 검색
		* 
		* param kwd - 가격 최소값, 최대값   
		* 
		* return	void
		**/	
		srchFilterBox_price_ctgSearch: function(min, max){
			this.setParameters();
			var ctgrNo = "";			//세카테고리 번호
			
			$("input:checkbox[name='ctgr_4depth']").each(function(index,value){
				if(this.checked){
				  if(ctgrNo == ""){
					  ctgrNo = this.value;
					}else if(ctgrNo != ""){
						ctgrNo = ctgrNo+","+(this.value);
				  }
				}
		    });
			
			$("#hstr_category_4depth").val(ctgrNo);
			$("#hstr_minPrice").val(min);
			$("#hstr_maxPrice").val(max);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/dispctg/initDispCtg.action?listOnly=Y&" + parameters);
			
			document.location.href = '#hashPage1/'+parameters;
		},
		
		/**
		* 좌측 검색 필터영역 할인율범위 변경시 검색
		* 
		* param kwd - 할인율 최소값, 최대값   
		* 
		* return	void
		**/	
		srchFilterBox_discount_ctgSearch: function(min, max){
			this.setParameters();
			$("#hstr_minRate").val(min);
			$("#hstr_maxRate").val(max);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/dispctg/initDispCtg.action?listOnly=Y&" + parameters);
			
			document.location.href = '#hashPage1/'+parameters;
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		/**
		* 좌측 검색 필터영역 체크박스 클릭시 검색
		*
		* return	void
		**/	
		srchFilterBox_brandSearch: function(){
			this.setParameters();
			var ctgrNo = "";			//세카테고리 번호
			
			$("input:checkbox[name='ctgr_4depth']").each(function(index,value){
				if(this.checked){
				  if(ctgrNo == ""){
					  ctgrNo = this.value;
					}else if(ctgrNo != ""){
						ctgrNo = ctgrNo+","+(this.value);
				  }
				}
		    });
			$("#hstr_category_4depth").val(ctgrNo);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			$("#cate_prd_list").load("/dispctg/initBrandShop.action?listOnly=Y&" + parameters);
			
			document.location.href = '#hashPage1/'+parameters;
		},
		
		
		/**
		* 좌측 검색 필터영역 가격범위 변경시 검색
		* 
		* param kwd - 가격 최소값, 최대값   
		* 
		* return	void
		**/	
		srchFilterBox_price_brandSearch: function(min, max){
			this.setParameters();
			var ctgrNo = "";			//세카테고리 번호
			
			$("input:checkbox[name='ctgr_4depth']").each(function(index,value){
				if(this.checked){
				  if(ctgrNo == ""){
					  ctgrNo = this.value;
					}else if(ctgrNo != ""){
						ctgrNo = ctgrNo+","+(this.value);
				  }
				}
			});
			
			$("#hstr_category_4depth").val(ctgrNo);
			$("#hstr_minPrice").val(min);
			$("#hstr_maxPrice").val(max);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			$("#cate_prd_list").load("/dispctg/initBrandShop.action?listOnly=Y&" + parameters);
			
			document.location.href = '#hashPage1/'+parameters;
		},
		
		/**
		* 좌측 검색 필터영역 할인율범위 변경시 검색
		* 
		* param kwd - 할인율 최소값, 최대값   
		* 
		* return	void
		**/	
		srchFilterBox_discount_brandSearch: function(min, max){
			this.setParameters();
			$("#hstr_minRate").val(min);
			$("#hstr_maxRate").val(max);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			$("#cate_prd_list").load("/dispctg/initBrandShop.action?listOnly=Y&" + parameters);
			
			document.location.href = '#hashPage1/'+parameters;
		},
		
		/**
		* 입력받은 카테고리값 검색
		* param ctgr_cd - 카테고리 코드
		* return	void
		**/	
		goCategory: function( ctgr_cd ){
			window.location.href = "/dispctg/initDispCtg.action?disp_ctg_no="+ctgr_cd;
		},
		
		goBrandCategory: function( brand_cd, ctgr_cd ){
			window.location.href = "/dispctg/initBrandShop.action?brand_no="+brand_cd+"&disp_ctg_no="+ ctgr_cd;
		},
		
		go1depthCategoryList: function( ctg_cd ){
			//$("#hstr_category_1depth").val(ctg_cd);
			//$("#hstr_pageNum").val(1);
			/*var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURI($(this).val()) + '&';
			});*/
			//var searchKwd = $("#hstr_kwd").val();
			var searchKwd = encodeURIComponent($("#hstr_kwd").val());
			var deliCostPoliNo = $("#hstr_deliCostPoliNo").val();
			
			var params = "/search/search.action?category_1depth="+ctg_cd;
			
			if(searchKwd != ""){
				params += "&kwd=" + searchKwd;
			}else{
				if(deliCostPoliNo != ""){
					params += "&deliCostPoliNo=" + deliCostPoliNo;
				}
			}
			
			params += "&page_idx=1";
			
			params += "&reSrch=" + $('#hstr_reSrchFlag').val();
			
			$('#historyForm').children('input[name=\"preKwd\"]').each(function(){
				params += "&preKwd=" + encodeURIComponent($(this).val());
			});
			
			$('#historyForm').children('input[name=\"preFlag\"]').each(function(){
				params += "&preFlag=" + $(this).val();
			});
			
			window.location.href = params;
														
			//window.location.href = "/search/search.action?"+parameters;
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);
		},
		
		go2depthCategoryList: function( lctg_cd, mctg_cd ){
			//$("#hstr_category_1depth").val(lctg_cd);
			//$("#hstr_category_2depth").val(mctg_cd);
			//$("#hstr_pageNum").val(1);
			//var searchKwd = $("#hstr_kwd").val();
			var searchKwd = encodeURIComponent($("#hstr_kwd").val());
			var deliCostPoliNo = $("#hstr_deliCostPoliNo").val();
			
			var params = "/search/search.action?category_1depth="+lctg_cd;
			
			if(searchKwd != ""){
				params += "&kwd=" + searchKwd;
			}else{
				if(deliCostPoliNo != ""){
					params += "&deliCostPoliNo=" + deliCostPoliNo;
				}
			}
			
			params += "&category_2depth="+mctg_cd;
			params += "&page_idx=1";
			params += "&reSrch=" + $('#hstr_reSrchFlag').val();
			
			$('#historyForm').children('input[name=\"preKwd\"]').each(function(){
				params += "&preKwd=" + encodeURIComponent($(this).val());
			});
			
			$('#historyForm').children('input[name=\"preFlag\"]').each(function(){
				params += "&preFlag=" + $(this).val();
			});
			
			window.location.href = params;
			
			/*var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURI($(this).val()) + '&';
			});	
			window.location.href = "/search/search.action?"+parameters;*/
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);
		},
		
		go1depthBrandShopCategoryList: function( brand_cd, ctg_cd ){
			/*$("#hstr_category_1depth").val(lctg_cd);
			$("#hstr_brand").val(brand_cd);
			$("#hstr_pageNum").val(1);
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURI($(this).val()) + '&';
			});	
			window.location.href = "/dispctg/initBrandShop.action?"+parameters;*/
			window.location.href = "/dispctg/initBrandShop.action?category_1depth="+ctg_cd
																+"&brand_no="+brand_cd
																+"&page_idx=1";
			//자동형 브랜드샵이지만 결과는 가져오기 위해 search.action을 호출한다. (브랜드 자동형은 카테고리 번호를 받지 않는다)
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);
		},
		
		go2depthBrandShopCategoryList: function( brand_cd, lctg_cd, mctg_cd ){
			/*$("#hstr_category_1depth").val(lctg_cd);
			$("#hstr_category_2depth").val(mctg_cd);
			$("#hstr_brand").val(brand_cd);
			$("#hstr_pageNum").val(1);
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURI($(this).val()) + '&';
			});	
			window.location.href = "/dispctg/initBrandShop.action?"+parameters;*/
			window.location.href = "/dispctg/initBrandShop.action?category_1depth="+lctg_cd
																+"&category_2depth="+mctg_cd
																+"&brand_no="+brand_cd
																+"&page_idx=1";
			//자동형 브랜드샵이지만 결과는 가져오기 위해 search.action을 호출한다. (브랜드 자동형은 카테고리 번호를 받지 않는다)
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + parameters);
		},
		
		go3depthStoreShopCategoryList: function(ctg_no_2depth, ctg_no_3depth){
			window.location.href = "/dispctg/searchStoreShoppingList.action?disp_ctg_no="+ctg_no_2depth
																+"&category_3depth="+ctg_no_3depth
																+"&page_idx=1"
																+"&storepick_page_yn=Y";
		},
		
		/**
		* 입력받은 카테고리, 서브카테고리값 검색
		* param ctgr_cd - 카테고리 코드, sub_ctgr_cd - 서브카테고리 코드 
		* return	void
		**/	
		goSubCategory: function( ctgr_cd, sub_ctgr_cd ){
			$('#hstr_pageNum').val('1');
			$('#hstr_category').val(ctgr_cd);
			$('#hstr_subCategory').val(sub_ctgr_cd);
			$('#historyForm').submit();
		},
		/**
		* 카테고리 매칭 함수. 
		* 카테고리명을 넘겨주면 코드를, 코드값을 넘겨주면 카테고리 명을 리턴
		* 
		* param ctgr - 카테고리값 
		* param type - 타입(0 : 카테고리명, 1 : 카테고리코드 )  
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
		 * param val
		 * 
		 * @return
		 */
		 goSearchSort: function( sort_val ){
			$("#hstr_sort").val(sort_val);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			document.location.href = '#hashPage1/'+parameters;
		 },
		 
		 
		 /**
			 * 정렬 검색 실행
			 * 
			 * param val
			 * 
			 * @return
			 */
		 goSearchGoodsSort: function( sort_val, target ){
			$("#hstr_sort").val(sort_val);
			if(target != undefined && target != null && target != '') {
				$(target).load("/search/search.action?listOnly=Y&" + $("#historyForm").serialize());
			} else {
				$("#cate_prd_list").load("/search/search.action?listOnly=Y&" + $("#historyForm").serialize());
			}
		 },

		 /**
			 * 정렬 검색 실행
			 * 
			 * param val
			 * 
			 * @return
			 */
		 goSearchGoodsSortOld: function( sort_val ){
			$("#hstr_sort").val(sort_val);
			$("#goods_list").load("/search/preSearch.action?listOnly=Y&" + $("#historyForm").serialize());
		 },
		 
		 /**
		 * 정렬 검색 실행
		 * 
		 * param val
		 * 
		 * @return
		 */
		 goSearchCategorySort: function( sort_val ){
			/*$("#hstr_sort").val(sort_val);
			$("#goods_list").load("/dispctg/initDispCtg.action?listOnly=Y&" + $("#historyForm").serialize());*/
			
			$("#hstr_sort").val(sort_val);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			document.location.href = '#hashPage1/'+parameters;
		 },
		 
		 /**
		 * 정렬 검색 실행
		 * 
		 * param val
		 * 
		 * @return
		 */
		 goSearchBrandSort: function( sort_val ){
			$("#hstr_sort").val(sort_val);
			$("#cate_prd_list").load("/dispctg/initBrandShop.action?listOnly=Y&" + $("#historyForm").serialize());
		 },
		 
		 /**
		 * 정렬 검색 실행
		 * 
		 * param val
		 * 
		 * @return
		 */
		 goSearchStoreShopSort: function( sort_val ){
			$("#hstr_sort").val(sort_val);
			$("#cate_prd_list").load("/dispctg/searchStoreShoppingList.action?listOnly=Y&" + $("#historyForm").serialize() , function() {

			});
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});		
			document.location.href = '#hashPage1/'+parameters;
		 },
		 
		 /**
		 * 정렬 검색 실행
		 * 
		 * param val
		 * 
		 * @return
		 */
		 goSearchStorePickSort: function( sort_val ){
			$("#hstr_sort").val(sort_val);
			$("#goods_list").load("/dispctg/searchStoreShoppingList.action?listOnly=Y&" + $("#historyForm").serialize() , function() {

			});
		 },
	
		
		/**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchListType: function( val , e){
			$("#hstr_listType").val(val);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			//$("#goods_list").load("/search/search.action?listOnly=Y&" + $("#historyForm").serialize());

			document.location.href = '#hashPage1/'+parameters;
		 },
		 
		 /**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchGoodsListType: function( val , target ){
			$("#hstr_listType").val(val);
			if(target != undefined && target != null && target != '') {
				$(target).load("/search/search.action?listOnly=Y&" + $("#historyForm").serialize());
			} else {
				$("#cate_prd_list").load("/search/search.action?listOnly=Y&" + $("#historyForm").serialize());
			}
		 },

		 /**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchGoodsListTypeOld: function( val , e){
			$("#hstr_listType").val(val);
			$("#goods_list").load("/search/preSearch.action?listOnly=Y&" + $("#historyForm").serialize());
		 },
		 
		 /**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchCategoryListType: function( val ){
			$("#hstr_listType").val(val);
			
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			
			//$("#goods_list").load("/dispctg/initDispCtg.action?listOnly=Y&" + $("#historyForm").serialize());
			
			document.location.href = '#hashPage1/'+parameters;
		 },
			 
		 /**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchBrandListType: function( val ){
			$("#hstr_listType").val(val);
			$("#cate_prd_list").load("/dispctg/initBrandShop.action?listOnly=Y&" + $("#historyForm").serialize());
		 },
		
		 /**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchStoreShopListType: function( val ){
			$("#hstr_listType").val(val);
			$("#cate_prd_list").load("/dispctg/searchStoreShoppingList.action?listOnly=Y&" + $("#historyForm").serialize() , function() {

			});
			var parameters = "";
			$("#historyForm :input").each(function(index){
				parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
			});	
			document.location.href = '#hashPage1/'+parameters;
		 },
			
		 /**
		 * 검색결과 이미지보기, 리스트보기 처리
		 * param val
		 * @return
		 */
		 searchStorePickListType: function( val ){
			$("#hstr_listType").val(val);
			$("#goods_list").load("/dispctg/searchStoreShoppingList.action?listOnly=Y&" + $("#historyForm").serialize() , function() {

			});
		 },
		 
		 /**
		 * 날짜 검색 실행(radio box)
		 * 
		 * param date
		 * 
		 * @return
		 */
		 goDate: function( date ){
			$('#hstr_date').val(date);
			$('#hstr_pageNum').val('1');
			$('#historyForm').submit();
		},
		
		/**
		 * 필터박스 초기화
		 * 
		 * @return
		 */
		initFilterBox: function(){
			//$("#hstr_category_1depth").val('');
			//$("#hstr_category_2depth").val('');
			//$("#hstr_category_3depth").val('');
			//$("#hstr_category_4depth").val('');
			$('.chkbox').attr('checked',false);
			$('.chip').removeClass("on");
			$('.btn_size').removeClass("on");
			//가격박스 값 초기화
			$( "#l_range" ).val($("#var_minPrice").val());
			$( "#r_range" ).val($("#var_maxPrice").val());
			$("button[name='fast_price']").removeClass('on');
			//할인율 값 초기화
			$( "#l_disrange" ).val($("#var_minDiscount").val());
			$( "#r_disrange" ).val($("#var_maxDiscount").val());
			$("button[name='fast_discount']").removeClass('on');
			//가격 게이지, 가격 바 초기화
			$('.set_range > div > div').css("left","0%");
			$('.set_range > div > div').css("width","100%");
			$('.set_range > div > span').css("left","0%");
			$('.set_range > div > span').next().css("left","100%");
			fnsearch.srchFilterBox();
		},
		/**
		 * 카테고리 필터박스 초기화
		 * 
		 * @return
		 */
		initCtgrFilterBox: function(){
			$('.chkbox').attr('checked',false);
			$('.chip').removeClass("on");
			$('.btn_size').removeClass("on");
			//가격박스 값 초기화
			$( "#l_range" ).val($("#var_minPrice").val());
			$( "#r_range" ).val($("#var_maxPrice").val());
			$("button[name='fast_price']").removeClass('on');
			//할인율 값 초기화
			$( "#l_disrange" ).val($("#var_minDiscount").val());
			$( "#r_disrange" ).val($("#var_maxDiscount").val());
			$("button[name='fast_discount']").removeClass('on');
			//가격 게이지, 가격 바 초기화
			$('.set_range > div > div').css("left","0%");
			$('.set_range > div > div').css("width","100%");
			$('.set_range > div > span').css("left","0%");
			$('.set_range > div > span').next().css("left","100%");
			fnsearch.srchFilterBox_ctgSearch();
		},
		
		initBrandFilterBox : function(){
			$("#hstr_category_1depth").val('');
			$("#hstr_category_2depth").val('');
			$("#hstr_category_3depth").val('');
			$("#hstr_category_4depth").val('');
			$("#hstr_brandNo").val($("#var_brand").val());
			$('.chkbox').attr('checked',false);
			$('.chip').removeClass("on");
			$('.btn_size').removeClass("on");
			//가격박스 값 초기화
			$( "#l_range" ).val($("#var_minPrice").val());
			$( "#r_range" ).val($("#var_maxPrice").val());
			$("button[name='fast_price']").removeClass('on');
			//할인율 값 초기화
			$( "#l_disrange" ).val($("#var_minDiscount").val());
			$( "#r_disrange" ).val($("#var_maxDiscount").val());
			$("button[name='fast_discount']").removeClass('on');
			//가격 게이지, 가격 바 초기화
			$('.set_range > div > div').css("left","0%");
			$('.set_range > div > div').css("width","100%");
			$('.set_range > div > span').css("left","0%");
			$('.set_range > div > span').next().css("left","100%");
			fnsearch.srchFilterBox_brandSearch();
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
		 * param startDate
		 * param endDate
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
		 * param
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
		 * param
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
		 * param
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
		 * param
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
		 * param
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
		 * param (size : 
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
		},
		
		allviewAction : function(comp) {
			$(comp).parent().parent('.togg').addClass('active');
		}
	},
	
	/*****************************
	 * 브랜드 검색필터 관련 함수 *
	 *****************************/
	fnsearchBrand = {
		// 메인화면 노출 브랜드와 전체보기 노출브랜드 체크박스 연동
		applyBrand : function(targetId, currId) {
			//this.fnHideNShowBrand('hide', 'left_brand_list');
			
			currId.replace("\\\'", "\'");
			
			$("input[id^='" + currId + "']").each(function() {
				var targetComp = $("input[id^=\"" + targetId + "\"][value=\"" + $(this).val() + "\"]"); 
				targetComp.prop("checked", $(this).is(":checked"));
			});
			
			//this.fnHideNShowBrand('show', 'left_brand_list');
		},

		// 모든 브랜드 가리기/보이기
		fnHideNShowBrand : function(hNs, brandIdx) {
			if (hNs.toLowerCase() == 'hide') {
		    	if (brandIdx == 'all_brand_list') {
		    		$(".init_grp").hide();
		    	}
				$("ul." + brandIdx + " li").hide();
			} else {
				$("ul." + brandIdx + " li").show();
				if (brandIdx == 'all_brand_list') {
					$(".init_grp").show();
				} else {
					$("." + brandIdx + " li:gt(4)").hide(); // 좌측 필터영역 브랜드는 5개 까지만 보여줌
				}
			}
		},
		
		// 이니셜클릭시 해당되는 브랜드 출력
		changeInitial : function(initial) {
			this.fnHideNShowBrand('show', 'all_brand_list');
			
			$('button[id^=Grp]').removeClass("active");
			$('button[id^=Grp][data-cd=' + initial + ']').addClass("active");
			curInitial = initial;
			
			if (initial.toLowerCase() == "all".toLowerCase()) {
				$(".init_grp").show();
			} else {
				$(".init_grp").hide();
				$(".init_grp").each(function(index) {
					var thisInit = $(this).children(".init_tit").text();
					if (thisInit == initial) {
						$(this).show();
						return;
					}
				});
			}
		},
			
		// 검색에 해당되는 브랜드만 노출
		fnAutoSearchBrand : function(searchKwd, brandIdx) {
			
			this.changeInitial('all'); // 검색시 무조건 All 탭으로
			if (searchKwd == "") {
				this.fnHideNShowBrand('show', brandIdx);
				return;
			}
			
			this.fnHideNShowBrand('hide', brandIdx);
			$("ul." + brandIdx + " > li > label > input[type=checkbox]").filter(function () {
				if ($(this).val().toLowerCase().indexOf(searchKwd.toLowerCase()) >= 0)
					return true;
				else
					return false;
				
			}).each(function(index) {
				var willShowLi = $(this).parent().parent("li");
				var willShowInitGrp = willShowLi.parent().parent(".init_grp");
				
				willShowLi.show();
				willShowInitGrp.show();
			});
		},
		
		// 값이 없는 초성버튼 비활성화
		fnDeactiveInitial : function(list) {
			if (list.length <= 0) return;
			
			$.each(list, function(idx, data) {
				$('button[data-cd="' + data + '"]').addClass('deactive');
				$('button[data-cd="' + data + '"]').attr('onclick', '').unbind('click');
			})
		},
		
		// 브랜드 검색 키워드 복사(연동)
		copyKwd : function(target, kwd) {
			target.val(kwd);
			target.keyup();
		}
	}
})(jQuery);