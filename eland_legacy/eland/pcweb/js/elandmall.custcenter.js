
	//엔터키 이벤트 방지
	__preventKeyEvent = function(){
		$('input').on('keydown keyup', function (e) {
			if (e.keyCode === 13) {
				e.preventDefault();
			}
		});
	}				  
	
	
	//숫자만 입력
	$.fn.digitChecker = function(maxlength) {

		if(maxlength){
			$(this).attr("maxlength", maxlength);
		}
			
		//for ie
		$(this).attr("style", "ime-mode:disabled");
		
		//for crome
		$(this).keyup(function(evt){
			$(this).val($(this).val().replace(/[^0-9]/g,''));
		});
	};
	
	/**
	 * FAQ 조회수 증가
	 */
	elandmall.custcenter.faqHitUpdate = function(targetObj){
		
		var counsel_faq_no = targetObj.attr("counsel_faq_no");
		$.ajax({
			url: "/custcenter/updateFaqSelCnt.action",
			data: {counsel_faq_no : counsel_faq_no},
			type: "POST",
			dataType: "text",
			success: function(data) {
			}, error : function( e ){
				if ( e.error_message !=null && e.error_message != ""){
					alert(e.error_message);
				}else{
					alert("도움중 오류가 발생하였습니다.");
				}
			}
		});		
	}
	
	
	/**
	 * 공지사항 조회수 증가
	 */
	elandmall.custcenter.notiHitUpdate = function(targetObj){
		
		var noti_no = targetObj.attr("notice_no");
		$.ajax({
			url: "/custcenter/updateNoticeHit.action",
			data: {noti_no : noti_no},
			type: "POST",
			dataType: "text",
			success: function(data) {
			}, error : function( e ){
				if ( e.error_message !=null && e.error_message != ""){
					alert(e.error_message);
				}else{
					alert("도움중 오류가 발생하였습니다.");
				}
			}
		});		
	}
	
	// 키워드로 FAQ검색
	elandmall.custcenter.searchFaqByKeyword = function(keyword){
		if(keyword){
			$('[name=keyword]').val(keyword);
		}else{
			var searchKeyword = $('#sch_faq').val();
			var banChar = /[\\\'\"]/g;
			
			if(searchKeyword==''){
				alert('검색어를 입력해 주세요.');
				return;
			}else if(banChar.test(searchKeyword)){
				alert("사용이 불가능한 특수문자가 존재합니다.");
				return;
			}
			$('[name=keyword]').val(searchKeyword);
		}
		
		$('[name=faq_large_divi_cd]').val("");
		$('[name=faq_mid_divi_cd]').val("");
		$('[name=faq_mid_divi_cd_nm]').val("");
		elandmall.custcenter.searchFaq();
	};
	
	/**
	 * faq 조회
	 */
	elandmall.custcenter.searchFaq = function(faq_large_divi_cd, faq_large_divi_cd_nm, faq_mid_divi_cd, faq_mid_divi_cd_nm){
		$('[name=page_idx]').val("1");
		if(faq_large_divi_cd){
			$('[name=keyword]').val("");
			$('[name=faq_large_divi_cd]').val(faq_large_divi_cd);
			$('[name=faq_large_divi_cd_nm]').val(faq_large_divi_cd_nm);
			if(faq_mid_divi_cd != null){
				$('[name=faq_mid_divi_cd]').val(faq_mid_divi_cd);
				$('[name=faq_mid_divi_cd_nm]').val(faq_mid_divi_cd_nm);
			}else{
				$('[name=faq_mid_divi_cd]').val("");
				$('[name=faq_mid_divi_cd_nm]').val("");
			}
		}
		$('#faqSearchForm').submit();
	};

	//상품 검색 팝업
	elandmall.custcenter.goodsSearchPopup = {
			
		page_idx : "1",
		
    	callback : function(){},	
    	
        open : function(p, callback){ // 팝업 호출
        	
        	elandmall.custcenter.goodsSearchPopup.callback = callback;
        	
        	elandmall.custcenter.goodsSearchPopup.page_idx = "1";
        	
            elandmall.layer.createLayer({
			    layer_id:'layer_pop',
				class_name:"layer_pop on",
				title: p.title,
				createContent: function(layer) {
					
					layer.show();
					
					elandmall.custcenter.goodsSearchPopup.loadGoodsData(p, layer);	
				}
			});
        },		
        
        eventSelectBtn : function(layer){// 상품 선택 이벤트
        	
        	$('#selectBtn').click(function(){
    			
    			var selectGoodsSize = $('[name=goodsCheckbox]:checked').size();
    			
    			if(selectGoodsSize==0){
    				alert("상품을 선택해 주세요.");
    				return;
    			}
    			var datas = [];
    			var temp = '';
    			$('[name=goodsCheckbox]:checked').each(function(){
    				
    				var goods_no = $(this).attr("goods_no");
    				var vir_vend_no = $(this).attr("vir_vend_no");
    				var goods_nm = $(this).parents("tr").find(".goods_txt02").html();
    				var price= $(this).parents("tr").find(".tx_price").html();
    				var img_path = $(this).attr("img_path");
    				var pkg_goods_no = $(this).parent().parent().find("#slt_prd_02").val();
    				var pkg_goods_nm = $(this).parent().parent().find("#slt_prd_02 option:selected").text();
    				
    				if(pkg_goods_no != null && pkg_goods_no!=""){
    					var temp_goods = pkg_goods_no;
    					pkg_goods_no = goods_no;
    					goods_no = temp_goods;
    				}
    				
    				var data = {goods_no:goods_no, vir_vend_no:vir_vend_no, goods_nm:goods_nm, price : price, img_path : img_path, pkg_goods_no:pkg_goods_no, pkg_goods_nm:pkg_goods_nm};
    				
    				//주문일경우
    				if($.type($(this).attr("ord_no"))!='undefined'){
        				var ord_no = $(this).attr("ord_no");
        				var ord_dtl_no = $(this).attr("ord_dtl_no");
        				var item_nm = $(this).attr("item_nm");
        				
        				if(ord_no){
        					data.ord_no=ord_no;
        					data.ord_dtl_no=ord_dtl_no;
        					data.item_nm=item_nm;
        				}
    				}else{
    					data.ord_no="";
    					data.ord_dtl_no="";
    					data.item_nm="";
    				}

    				var selected =goods_no+vir_vend_no+ord_no+ord_dtl_no;
    				var isDup = false;
    				if(temp.indexOf(selected) >= 0){
    					isDup = true;
    				}
    				
    				if(!isDup){
    					temp+=selected+",";//임시저장
    					datas.push(data);
    				}
    			});
    			
	   			if(datas.length > 5){
	   				alert('최대 5개 상품까지만 선택이 가능합니다.');
					return;
				}
	   			
    			elandmall.custcenter.goodsSearchPopup.callback(datas, layer)
        	});
        },
        eventSearchBtn : function(p, layer){
			//이벤트 초기화
		    $('#searchBtn').click(function(){
		    	p.page_idx = 1;
		    	elandmall.custcenter.goodsSearchPopup.searchData(p, layer);
            });//click
        },//end eventSeatchBtn function
        searchData : function(p, layer){
        	//p.type - 01:주문, 02:장바구니, 03:최근본상품, 04:상품번호, BigOrder:상품번호,상품명(대량구매화면)

		    var keyword=$('#keyword').val();
			if($.type(keyword)!='undefined' && keyword==''){
			    alert('검색어를 입력해 주세요.');
				return;
			}
			
			if(p.type=='04'){//상품번호 검색일경우
				p.goods_no = keyword;
			}else{
				p.keyword = keyword;
			}
			
			//p.page_idx=elandmall.custcenter.goodsSearchPopup.page_idx;
			
			//주문상품검색일경우 기간 파라메터 설정
			if(p.type=='01'){
				
				var date_divi_tp='';
				var date_divi='';
				var date_start='';
				var date_end='';
				
				$('[id^=period_] > a').each(function(){
					if($(this).attr("class")=="on"){
						date_divi = $(this).data("val");
						date_divi_tp = $(this).data("type");
					}
				});
				
				if(date_divi_tp == '' && $('#date_start').val()!='' && $('#date_end').val()!=''){
					date_divi_tp='menual';
					date_divi='';
				}
				
				
				date_start=$('#date_start').val();
				date_end=$('#date_end').val();
				
				if(date_divi_tp==''){
					alert('검색 조건을 설정해 주세요.');	
					return false;
				}
				
				p.date_start=date_start;
				p.date_end=date_end;
				p.date_divi_tp=date_divi_tp;
				p.date_divi=date_divi;
			}

			//
			elandmall.custcenter.goodsSearchPopup.loadGoodsData(p, layer);
        },
        loadGoodsData : function(p, layer){// 데이터 조회
        	
        	var div = layer.div_content;
			div.load("/custcenter/searchGoodsPopup"+p.type+".action",p, function(){
				
				//IE placeholder 세팅
				if($.browser.msie && $.browser.version<=9){
					$('input, textarea').placeholder();
				}
				
				/* 검색버튼 이벤트*/
				elandmall.custcenter.goodsSearchPopup.eventSearchBtn(p, layer);
				
				// 선택 버튼 이벤트
				if($.type(p.selectFunction)=='function'){//선택버튼 콜백 함수
					p.selectFunction(layer);
				}else{//콜백이 없을경우 기본 함수
					elandmall.custcenter.goodsSearchPopup.eventSelectBtn(layer);
				}
				//입력박스 포커스
				//$('.box_period03 > #keyword').focus();
				
				__preventKeyEvent();//form submit방지
				  
				//엔터키 이벤트
				$('.box_period03').on("keyup", "#keyword", function(){
					if (window.event.keyCode == 13) {
						p.page_idx = 1;
						elandmall.custcenter.goodsSearchPopup.searchData(p, layer);
						
						//$('#searchBtn').click();
					}
				});
				
				
				//페이징
				$("#box_page").createAnchor({
					name: "page_idx", // 해당 페이지 앵커의 페이지번호 패러미터명과 일치하여야 함. 디폴트는 page_no
					fn: function(page, parameters) {
						
						p.page_idx = page;
						elandmall.custcenter.goodsSearchPopup.searchData(p, layer);
						
						//$('#searchBtn').click();
						
						//window.location.href = "http://" + location.host + "/custcenter/searchGoodsPopupBigOrder.action?page_idx=" + page + "&" + parameters;
					}
				});	
				
				//닫기버튼
				$('[name=closeBtn]').click(function(){
					$('.btn_lay_close').click();
				});
				
				//전체선택 초기화
				$('#check_all').click(function(){
					$('input:checkbox[name='+$(this).data("target")+']').prop('checked', $(this).is(':checked'));
				});

				//복수개의 ORD_NO 선택하지 못하도록 _ 주문상품일 경우만
	   			if(p.type == "01"){
	   				$("input:checkbox[name='goodsCheckbox']").click(function(){
	   					var isChecked = $(this).is(":checked");
	   					var ord_no = $(this).attr("ord_no");
	   					var cnt = 0;
	   					
	   					//현재 주문번호에 check된 상품 개수 Count
	   					$("input:checkbox[name='goodsCheckbox']").each(function(){
	   						if($(this).is(":checked")){
	   							var d_ord_no = $(this).attr("ord_no");
	   							if(ord_no == d_ord_no){
	   								cnt++;
	   							}
	   						}
	   					});
	   					
	   					if(isChecked){
	   						$("input:checkbox[name='goodsCheckbox']").each(function(){
	   							var d_ord_no = $(this).attr("ord_no");
	   							
	   							if(ord_no != d_ord_no){
	   								this.checked = false;
	   								this.disabled = true;
	   							}
	   						});
	   							
	   					}else{
	   						if(cnt <= 0){
		   						$("input:checkbox[name='goodsCheckbox']").each(function(){
		   							var d_ord_no = $(this).attr("ord_no");
		   							
		   							if(ord_no != d_ord_no){
		   								this.checked = false;
		   								this.disabled = false;
		   							}
		   						});	   							
	   						}
	   					}
	   				});
	   			}
	   			
            });//load
			
        }
	};

$(document).ready(function(){
	
	// 고객센터 배너 클릭시 고객센터 메인으로
	$('.mypage_top > .title > .tit_img').click(function(){
		elandmall.custcenter.link.main();
	});
	
	// 좌측 FAQ 질문 유형 선택
	$('#faqLeftMenu>ul>li').click(function(){
		$('#faqSearchFormLeft').find('input[name=faq_large_divi_cd]').val($(this).data("faq_large_divi_cd"));
		$('#faqSearchFormLeft').find('input[name=faq_large_divi_cd_nm]').val($(this).data("faq_large_divi_cd_nm"));
		$('#faqSearchFormLeft').attr("action", elandmall.util.newHttps("/custcenter/initCustFAQlist.action"));
		$('#faqSearchFormLeft').submit();
	});
	
	/**
	 * 좌측 메뉴 링크
	 */
	$('.lnb_mypage ').find('a').click(function(){
		var click_id = $(this).attr("id");
		switch(click_id){
			case  'cust_left_01' ://자주하는 질문
                elandmall.custcenter.link.faq();
			break;
			case  'cust_left_02' ://1:1 친절상담
				elandmall.custcenter.link.counsel();
			break;
			case  'cust_left_03' ://1:1 답변확인
				var callback = function(){
				elandmall.mypage.link.counsel();
				}
				elandmall.isLogin({login:callback});				
			break;
			case  'cust_left_04' ://공지사항
				elandmall.custcenter.link.notice();
			break;
			case  'cust_left_05' ://복지제도 안내
				elandmall.custcenter.link.welfare();
			break;
			case  'cust_left_06' ://비회원 주문조회
				elandmall.login({rtn_btn_id:'#login', ordlogin:true});
			break;	
		}
	});		
});
