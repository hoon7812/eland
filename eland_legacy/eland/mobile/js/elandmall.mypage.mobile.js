var _preventDefault;

(function () {
	
	
	fn_check_all_btn_init = function(){
		
		//전체선택 버튼 초기화(id=check_all_btn)
		$('#check_all_btn').click(function(){
			if($(this).attr("ischeck")=='Y'){
				$(this).attr("ischeck", "N");
				$(this).html(" 전체 선택");
				$('input:checkbox[name='+$(this).data("target")+']').prop('checked', false);
			}else{
				$(this).attr("ischeck", "Y");
				$(this).html(" 전체 해제");
				$('input:checkbox[name='+$(this).data("target")+']').prop('checked', true);
			}
			
		});
	}
	
	fn_uncheck_all_btn_init = function(){
		//전체선택 해제 버튼 초기화(id=uncheck_all_btn)
		$('#uncheck_all_btn').click(function(){
			$('input:checkbox[name='+$(this).data("target")+']').prop('checked', false);
		});
	}
	fn_check_all_init = function(){		
		// 체크박스 전체선택 초기화(id=check_all)
		$('#check_all').click(function(){
			$('input:checkbox[name='+$(this).data("target")+']').prop('checked', $(this).is(':checked'));
		});
	}		
	
	$(document).ready(function(){
		_preventDefault = function(){
			$("form").submit(function(e){ e.preventDefault();});
			$('*').unbind("touchmove");
		}

	});
	
	// 나의 상품평
	var evalform;
	elandmall.mypage.myEvalList = {
		/**
		 * 상품평 작성
		 *  {ord_no : 주문번호, ord_dtl_no : 주문상세번호, atypical_shop_no : 이벤트 매장번호}
		 */
		evalInsPage : function(p){
			p.gb = 'I';	// 등록
			elandmall.mypage.goPage("/content/initGoodsEvalIns.action", p);
		},
		/**
		 * 상품평 수정
		 *  {ord_no : 주문번호, ord_dtl_no : 주문상세번호, atypical_shop_no : 이벤트 매장번호, goods_eval_no: 상품평번호, callback: 콜백URL}
		 */
		evalEditPage : function( p ){
			elandmall.mypage.goPage("/content/initGoodsEvalEdit.action", p);
		},
		evalTextMaxLength :function(obj){
			var $obj = $(obj);
			var len = $obj.val().length;
			var maxlength = 1000;
			if ( len > maxlength ){
				alert("최대 "+maxlength+"자까지 입력이 가능합니다.");
				$obj.val( $obj.val().substr(0, maxlength));
				$("#txt_len").text( maxlength );
				return false;
			}else{
				$("#txt_len").text( len );
				return true;
			}
		},
		evalInsEdit : function( p ){
			var callback = p.callback;
			var evalLinkYn = p.evalLinkYn;
			var evalNm = "";
			if(elandmall.global.disp_mall_no == '0000053' || elandmall.global.disp_mall_no == '0000045') {
				evalNm = "리뷰는";
			} else {
				evalNm = "상품평은";
			}

    		//상품평 필터 항목이 있을때 
    		if($("#eval_add_info_ul").length >0) {
    			var sVal = $("#eval_filter_array").val();
    			
    			if(p == "20") {
    				var tempLen = $("#eval_add_info_ul li a.on").length;
    				if(tempLen <= 0 && sVal == "" ) {
    					alert("입력되지 않은 항목이 있습니다.\n추가 정보를 입력 해 주세요. ");
	    				return false;
    				}
    				
    				if(sVal != "") {
	    				var jsonStr =JSON.parse(sVal);
		    			
		    			
		    			if(jsonStr.length != $("#eval_add_info_ul li").length){
		    				alert("입력되지 않은 항목이 있습니다.\n추가 정보를 입력 해 주세요. ");
		    				return false;
		    			}
    				}

    			}else{
	    			if( sVal == ""){
	    				alert("입력되지 않은 항목이 있습니다.\n추가 정보를 입력 해 주세요. ");
	    				return false;
	    			}
	    			
	    			var jsonStr =JSON.parse(sVal);
	    			
	    			
	    			if(jsonStr.length != $("#eval_add_info_ul li").length){
	    				alert("입력되지 않은 항목이 있습니다.\n추가 정보를 입력 해 주세요. ");
	    				return false;
	    			}
    			}
			
    		}
			
			
			if ( $('#goods_eval_cont').val() == "" || $('#goods_eval_cont').val().length < 10){
	    		alert(evalNm+" 최소 10자 이상 입력해 주셔야 등록 가능 합니다. ");
	    		return false;
			} else if (elandmall.checkBanWord($('#goods_eval_cont').val())){
	    		return false;
	    	} else {
	    		
	    		if(!elandmall.mypage.myEvalList.evalTextMaxLength($('#goods_eval_cont'))){
	    			return false;
	    		}
	    		

	    		if(elandmall.global.disp_mall_no == '0000053' || elandmall.global.disp_mall_no == '0000045') {
					evalNm = "리뷰를";	// NGCPT-2084 리뷰 등록시 얼럿 문구 수정
				} else {
					evalNm = "상품평을";
				}
	    		
				//2018.03.07 처리화면의 $(this).data("isNew") 항목 값이 pc와는 구조가 달라 모바일에서는 안넘어옴.
	    		//하여 신규인지 수정인지 여부를 p 파라미터 내용으로 구분하게 변경 = 수정에서만 20 값이 넘어 오도록 되어 있음.
				if ( p != '20' && !confirm(evalNm+" 등록하시겠습니까? \n별점평가는 등록 이후에 수정되지 않습니다.")){
					return false;
				}
				if ( evalform == null ){
					evalform = $("#evalform").createForm();
				}
				
				var evalformUrl = "";
				if ( evalLinkYn == 'Y' ) { //링크URL 페이지 인입여부
					evalformUrl = "/content/registGoodsEvalByLink.action";
					callback = "/content/initGoodsEvalInsComplete.action";
				} else {
					evalformUrl = "/content/registGoodsEval.action";
				}
				
				evalform.submit({
		    		action: evalformUrl,
		            iframe: true,
		            success: function(p) {
		            	//Braze 이벤트로깅 APP 스크립트 호출[NGCPO-8500]
		            	try {
		            		var braze_data = {
		            				goods_no: $("#evalform").find("[name=goods_no]").val(),
		            				goods_nm: $("#evalform").find("[name=goods_nm]").val()
		            			};
		            		if (elandmall.global.app_cd == "Android") {
		            			if (window.BrazeInterface) {
		            				window.BrazeInterface.reviewWrite(braze_data.goods_no, braze_data.goods_nm);
		            			}
		            		} else if(elandmall.global.app_cd == "iOS") {
		            			if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.BrazeInterface) {
		            				var post_data = {};
		            				post_data.method = "reviewWrite"; //호출할 함수 이름
		            				post_data.params = braze_data; // 호출할 함수의 파라미터 정의 객체(호출하는 파리미터 키정보가 필요합니다.)
		            				webkit.messageHandlers.BrazeInterface.postMessage(post_data);
		            			}
		            		}
		            	} catch (e) {}

		            	if(callback && callback != ''){
		            		if ( evalLinkYn == 'Y' ) { //링크URL 페이지 인입여부
		            			location.replace(elandmall.util.https(callback));
		            		} else {
		            			location.href = elandmall.util.newHttps(callback);
		            		}
		            	}else{
		            		elandmall.mypage.link.eval({eval_yn:"N"});
		            	}
		            },
		            error:function(p){
		            	if(p.ret_msg != null && p.ret_msg != ""){
		                    alert(p.ret_msg);
		                }else{
		                    alert("오류가 발생했습니다.");
		                    return false;
		                }
		            }
		    	});
	    	}
		},
		evalImgDel : function(obj, p, rtnYn){
			if ( $.type(p) != "undefined" && $.type(p.file_path) != "undefined" ){
				elandmall.app.fnImgDelete(p, function(){
					if ( obj != null && obj != undefined ){
						$(obj).parents("li[name=img_li]").remove();
					}
					if ( rtnYn == "Y" ){
						window.history.back();
					}
				});
			} else {
				if ( !confirm("선택한 사진을 삭제하시겠습니까?")){
					return false;
				}
				$(obj).parents("li[name=img_li]").hide();
				$(obj).parents("li[name=img_li]").find("[name=use_yn]").val("N");
			}
		},
		evalImgBackDel : function(){
			var input_file_path = $("#img_ul").find("input[name=file_path]");
			var path = new Array();
			
			$.each( input_file_path , function(i){
				path[i] = $(this).val();
			});
			if ( path.length > 0){
				elandmall.mypage.myEvalList.evalImgDel(null, {file_path:path, msgYn : "Y"}, "Y" );
			}else{
				window.history.back();
			}
		},
		evalInit : function( file_path, ori_file_nm, file_key ){
			var file_key_html = "";
			if(!(file_key == undefined || file_key == "undefined" || file_key == "")){
				file_key_html = "		<input type=\"hidden\" name=\"file_key\" value=\""+file_key+"\" data-disabled=\"Y\" />";
			}
				
			var html = 	"<li name='img_li'>" + 
							"	<div class=\"img_box\">"+ file_key_html +
							"		<input type=\"hidden\" name=\"file_path\" value=\""+file_path+"\" data-disabled=\"Y\" />"+
							"		<input type=\"hidden\" name=\"ori_file_nm\" value=\""+ori_file_nm+"\" data-disabled=\"Y\" />"+
							"		<img src=\""+ file_path+"\" alt=\""+ ori_file_nm+"\">"+
							"	</div>" +
							"	<a href=\"javascript:;\" class=\"del\" onclick=\"elandmall.mypage.myEvalList.evalImgDel(this, {file_path:'"+file_path+"'})\"><span class=\"ir\">삭제</span></a>"+
							"</li>";
			$("#img_ul").append(html);
			
			var $img = $("#img_ul li:last").find("img");
			$img.on("load", function(){
				var thumbW = $img.outerWidth();
				var thumbH = $img.outerHeight();
				thumbW > thumbH ? elandmall.mypage.myEvalList.evalImgline($img,"H") : false;
				thumbW < thumbH ? elandmall.mypage.myEvalList.evalImgline($img,"V") : false;
				thumbW == thumbH ? $img.addClass('squa') : false;
			})
		},
		evalErrorLog:function(fileInfo, err){
			$.ajax({
				url: "/content/evalErrorLogWrite.action",
				type: "POST",
				dataType: "text",
				async:false,
				data: {err : err , upload_key : fileInfo.upload_key, file_name : fileInfo.file_name},
				success: function(data){
					/**/
				},
				error: function( e ){
					/**/
				}
			});
		},evalImgline : function($target , s){
			if(s == "H"){
				$target.addClass('hori');
				$target.css('margin-left', (68-$target.outerWidth())/2);
			}
			if(s == "V"){
				$target.addClass('verti');
				$target.css('margin-top', (68-$target.outerHeight())/2);
			}
		}
	}
	numberWithCommas = function(amt) {
	    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	/**
	 * 반품/교환 신청
	 */
    fnGoReturnExchngClaim = function(pin){
		if (pin != null) {
			var param =  "";
		    $.each(pin, function(name, data) {
		    	 if(param == ""){
		    		 param = name +'='+ data ;
		    	 }else{
		    		 param += '&'+name +'='+ data ;
		    	 }
		    });
			location.href = elandmall.util.https("/mypage/initMyOrderReturnExchngProc.action?"+param);
		}
	};
	/**
	 * 셀프 환불
	 */
	fnGoSelfReturnClaim = function(pin){
		if (pin != null) {
			var param =  "";
			$.each(pin, function(name, data) {
				if(param == ""){
					param = name +'='+ data ;
				}else{
					param += '&'+name +'='+ data ;
				}
			});
			location.href = elandmall.util.https("/mypage/initMyOrderSelfReturnProc.action?"+param);
		}
	};
	
	/**
	 * 주문취소 신청
	 * 
	 */
    fnGoCancelClaim = function(pin){
    	_preventDefault();
    	
		if (pin != null) {
			var param =  "";
		    $.each(pin, function(name, data) {
		    	 if(param == ""){
		    		 param = name +'='+ data ;
		    	 }else{
		    		 param += '&'+name +'='+ data ;
		    	 }
		    });
			location.href = elandmall.util.https("/mypage/initMyOrderCancelProc.action?"+param);
		}
	};
	
	/**
	 * 신청철회
	 * 
	 */
	fnRecantClaim = function(pin){
		var confirmMst = "교환/반품 신청을 철회 하시겠습니까?\n교환/반품 신청시 결제하신 배송비는 결제 취소 처리 됩니다.\n신청 철회를 하시더라도 택배 기사님이 방문하실 수 있으니 교환/반품 철회 신청 하였다고 말씀해 주세요.";
		
		if(!confirm(confirmMst)){
			return;
		}
		
		if (pin != null) {
			var param =  "";
		    $.each(pin, function(name, data) {
		    	 if(param == ""){
		    		 param = name +'='+ data ;
		    	 }else{
		    		 param += '&'+name +'='+ data;
		    	 }
		    });
		    
		    $.ajax({
				url: "/mypage/registOrderRecantProc.action",
				type: "POST",
				dataType: "json",
				async:false,
				data: param,
				success: function(data){
					if(data.code=='S'){
						location.reload();
					}
				},
				error: function( e ){
					if (e.error_type.indexOf("UserException") && e.error_message.trim().length > 0) {
						alert(e.error_message);
					} else if ( e.error_message !=null && e.error_message != ""){
						alert("오류가 발생하였습니다.");
					} else {
						alert("오류가 발생하였습니다.");
					}
				}
			});
		}
	};
	
	/**
	 * 주문/배송조회
	 * 
	 */
	fnSearchMyOrdLst = function(pin){
		_preventDefault();
		
		if (pin != null) {
			var param =  "";
		    $.each(pin, function(name, data) {
		    	 if(param == ""){
		    		 param = name +'='+ data ;
		    	 }else{
		    		 param += '&'+name +'='+ data ;
		    	 }
		    });
			location.href = elandmall.util.https("/mypage/initMyOrderDeliList.action?"+param);
		} else {
			location.href = elandmall.util.https("/mypage/initMyOrderDeliList.action");
		}
	};
	
	/**
	 * 주문상세내역
	 * { ord_no:주문번호 } 
	 */
	fnMyOrderDetailView =  function (pin){
		_preventDefault();

		if (pin.ord_no == "") {
			alert("잘못된 접근입니다.");
			return;
		}
		
		var param =  "";
	    $.each(pin, function(name, data) {
	    	 if(param == ""){
	    		 param = name +'='+ data ;
	    	 }else{
	    		 param += '&'+name +'='+ data ;
	    	 }
	    });

		// sessionStorage에 현재 화면 저장
		elandmall.history.fnPageMovePrev(pin.list_idx, _pin.page_idx, pin);
	    
	    location.href = elandmall.util.https("/mypage/initMyOrderDetailList.action?" + param);
	};
	
	/**
	 * 교환권발송
	 * {ord_no:주문번호, ord_dtl_no:주문상세번호, goods_no:상품번호}
	 * 
	 */
	fnSendExchangeTicket = function(pin) {
		_preventDefault();
		
		if (pin != null) {
			var param =  "";
		    $.each(pin, function(name, data) {
		    	 if(param == ""){
		    		 param = name +'='+ data ;
		    	 }else{
		    		 param += '&'+name +'='+ data;
		    	 }
		    });
		    
		    $.ajax({
				url: "/mypage/sendExchangeTicket.action",
				type: "POST",
				dataType: "json",
				async:false,
				data: param,
				success: function(data){
					if(data.code=='S'){
						alert("주문시 입력하신 휴대폰으로 교환권번호가 발송되었습니다.\n메시지 수신이 안될 경우 고객센터(1899-9500) 로 연락 주세요.");
						location.reload();
					}
				},
				error: function( e ){
					if ( e.error_message !=null && e.error_message != ""){
						alert(e.error_message);
					}else{
						alert("오류가 발생하였습니다.");
					}
				}
			});
		}
	};
	
	/**
	 * 상품상세
	 * 
	 */
	fnGoodDetailView = function(pin){
		_preventDefault();
		
		if (pin != null) {
			var param =  "";
		    $.each(pin, function(name, data) {
		    	 if(param == ""){
		    		 param = name +'='+ data ;
		    	 }else{
		    		 param += '&'+name +'='+ data ;
		    	 }
		    });

			// sessionStorage에 현재 화면 저장
			elandmall.history.fnPageMovePrev(pin.list_idx, _pin.page_idx, pin);

			if(elandmall.global.disp_mall_no == '0000053') {
				location.href = elandmall.util.newHttps("https:" + elandmall.global.shoopen_domain_url +"/goods/initGoodsDetail.action?" + param);
			} else {
				location.href = elandmall.util.newHttps("/goods/initGoodsDetail.action?" + param);
			}
		}
	};

	/**
	 * 기억된 스크롤 위치 sessionStorage에서 불러오기
	 */
	getScrollMemory = function() {
		// History back
		if (sessionStorage) {
			if(window.sessionStorage.length > 0) {
				// ""+ <== object -> string 형변환 / .split("#",1) 해시붙어서 url달라지는 경우 방지
				var currUrl = ""+location.href.split("#",1);
				var strgUrl = "";
				if(window.sessionStorage.getItem("url") != null){
					strgUrl = ""+window.sessionStorage.getItem("url").split("#",1);
				}
				// ajax태우기 전에 날라가서 저장
				var back_conts_no = window.sessionStorage.getItem("back_conts_no");
				var back_page_index = window.sessionStorage.getItem("back_page_index");
				var ord_flag = window.sessionStorage.getItem("ord_flag");

				if( strgUrl == currUrl ) {
					if (parseInt(back_conts_no) > 0) {
						//더보기 진행
						if(back_page_index > 1) {
							// 더보기로 페이징한 상태에서 상품상세페이지갔다가 뒤로가기시 더보기버튼을 클릭할경우 마지막 페이징을 유지하기위해 값 적용(moreViewBtn)
							_pin.page_idx = back_page_index;

							for(var i=2; i<=back_page_index; i++) {
								readMoreView(i, ord_flag);

								if(back_page_index == _pin.page_idx_memory) {
									//스크롤 이동
									moveScrollMemory(back_conts_no);
								}
							}
						} else {
							//스크롤 이동
							moveScrollMemory(back_conts_no);
						}
					}
				}

				sessionStorage.removeItem("back_conts_no");
				sessionStorage.removeItem("back_page_index");
			}
		}
	}

	moveScrollMemory = function(back_conts_no) {
		//스크롤 이동
		if(back_conts_no != null && back_conts_no != undefined && back_conts_no != '' && back_conts_no != 'null' && back_conts_no != 'undefined') {
			$("#list_idx_" + back_conts_no).get(0).scrollIntoView();
		}
	}

	getDeliParameter = function(back_page_idx){
		var p = {};

		// 현재 선택된 버튼 식별
		$('.sch_order > ul > li > a').each(function(){
			if($(this).attr("class")=="on"){
				p.date_divi_tp = $(this).data("date-divi-tp");
				p.date_divi = $(this).data("date-divi");
				p.date_divi_idx = $(this).data("date-idx");
				p.tab_idx = $(".order_srt .on").attr("tab-idx");

				elandmall.searchFilter.selectPeriodBtn($(this), p);

			}
		});

		if(p.date_divi_tp=="menual"){
			var date_start = $('#date_start').val();
			var date_end = $('#date_end').val();

			p.date_start = date_start;
			p.date_end = date_end;
		}

		p.search_all_mall = $('#search_all_mall:checked').val() || '';
		p.page_idx = back_page_idx;

		return p;
	}

	readMoreView = function(back_page_idx, ord_flag) {
		var date = getDeliParameter(back_page_idx);
		var p = $.extend(p, _pin, date);

		$.ajax({
			type:"post",
			url : "/mypage/searchMyOrderDeliListMoreView.action",
			data : p,
			async: false,
			dataType: "text",
			success : function(data){
				if(data != null && data != "") {
					if(ord_flag === 'deli') {
						$("#ordDeliList").find("#ordDeliAddedList").append(data);
					} else {
						$("#ordClaimList").find("#ordClaimAddedList").append(data);
					}

					_pin.page_idx_memory++;
				}
			}
		});
	}

	/**
	 * 배송희망일 변경
	 */
	fnChngDeliHopeDate = function(pin){
		if(pin.deli_hope_dtime <= pin.today){
			alert("매장 방문일은 당일 이후로 변경 가능합니다.");
			return;
		}
		
		$.ajax({
			url: "/mypage/updateChngDeliHopeDate.action",
			type: "POST",
			dataType: "json",
			async:false,
			data: pin,
			success: function(data) {
				if(data.code == "S"){
					alert("변경되었습니다.");
					location.reload();
				}else{
					alert("방문일자 변경 중 오류가 발생했습니다.");
				}
			},
			error: function(e){
				console.log(e);
				if ( e.error_message !=null && e.error_message != ""){
					alert(e.error_message);
				}else{
					alert("오류가 발생하였습니다.");
				}
			}
		});
	};
	
	/**
	 * 매장정보 레이어
	 * 
	 */
	fnViewStoreMap = function(pin){
		elandmall.layer.createLayer({
			layer_id:"pop_store",
			class_name:"layer_fix",
			title: "매장 위치 보기",
			close : function(){
			   layer_fix_close("pop_store");
			   //앱 툴바 보이기
			   if(elandmall.global.app_cd != ""){
			        location.href="elandbridge://tabbar/show/";
			        location.href="elandbridge://header/show/";
			   }      
			},
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/mypage/initStoreInfoMapLayer.action", pin, function() {
					layer.show();
					
					if(elandmall.global.app_cd != ""){
					     location.href="elandbridge://tabbar/hide/";
					     location.href="elandbridge://header/hide/";
					}
					
					$("#closeBtn").click(function(){
						//앱 툴바 보이기
					    if(elandmall.global.app_cd != ""){
					         location.href="elandbridge://tabbar/show/";
					         location.href="elandbridge://header/show/";
					    } 
					    
						layer.close();
					});
				});
			}
		});
	};
	
	/**
     * 배송현황조회
     * 
     * @param 
     *				var pin = {deli_no:"201205080000244", deli_seq:"1", invoice_no:"123456", parcel_comp_cd:"30", grp_cd4:""};
     */
    fnInvoiceViewPop = function(pin){
    	_preventDefault();
    	
        var strTitle = (pin.title == undefined) ? "배송송장추적" : pin.title;
        
		if (pin.deli_no == "" || pin.deli_seq == "" || pin.parcel_comp_cd == "" || pin.invoice_no == "") {
			alert("죄송합니다.\n\r배송 송장 추적을 위한 정보가 부족합니다.");
			return;
		};
		console.log(pin.grp_cd4);
		// NGCPO-4830 FO/MO 배송추적 관련 화면 개발 으로 조건 번경
		if(pin.grp_cd4 == "" && pin.parcel_comp_cd != "99") {
			encodeURI = function(value) {
				return encodeURIComponent(value).replace(/%20/g, "+");
			};
			
			var params = "";
			$.each(pin, function(name, value) {
				params += ("&" + escape(name) + "=" + encodeURI(value));
			});
			
			var defaultProps = {
				url : "/mypage/initDeliInvoiceTrace.action",
				winname : "InvoiceTrace_pop",
				title : encodeURI("배송현황조회"),
				method: "get",
				scrollbars : true,
				resizable : false,
				width : "700",
				height : "740"
			};
			
			var openUrl = elandmall.util.https(defaultProps.url + "?title=" + defaultProps.title + params);
			
			var intLeft = (screen.width) / 2 - (defaultProps.width + "").replace(/px/, '') / 2;
			var intTop = (screen.height) / 2 - (defaultProps.height + "").replace(/px/, '') / 2;
			
			window.open(openUrl, defaultProps.winname, "menubar=no, scrollbars="
					+ (defaultProps.scrollbars ? "yes" : "no") + ", resizable="
					+ (defaultProps.resizable ? "yes" : "no") + ", status=yes, width="
					+ defaultProps.width + ", height=" + defaultProps.height + ",top=" + intTop
					+ ",left=" + intLeft + "");
		}else{
			var params = "";
			$.each(pin, function(name, value) {
				params += ("&" + escape(name) + "=" + encodeURI(value));
			});
		    
			location.href = elandmall.util.https("/mypage/initDeliInvoiceTraceLayer.action?" + params);
			/*
			elandmall.layer.createLayer({
				layer_id:"pop_deli",
				class_name:"layer_fix pop_deli",
				title: "배송조회",
				createContent: function(layer) {
					var div = layer.div_content;
					div.load("/mypage/initDeliInvoiceTraceLayer.action", pin, function() {
						
						layer.show();
						
						$("#cfmBtn").click(function(){
							layer.close();
						});
					});
				}
			});
			*/
		}
    };
    /**
     * NGCPO-5076 명품CD 구매대행 상품/주문처리 기능 추가-주문
     */
    fnDeliOverseasPurchaseViewPop = function(pin){
    	_preventDefault();
		elandmall.layer.createLayer({
			layer_id:"deliInvoiceTraceLayer",
			class_name:"layer_fix pop_deli on",
			title: "배송조회",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/mypage/initDeliOverseasPurchaseViewLayer.action", pin, function() {
					
					layer.show();
					
					$("#cfmBtn").click(function(){
						layer.close();
					});
				});
			}
		});
    };
    
    /**
    * 계좌인증
    * 
    * @param pin : {bank_cd:은행코드, morc_nm:입금자명, account_no:계좌번호}
    *
    */
	fnConfAccount = function(pin){
		_preventDefault();
		
		var accountYn = false;	// 성공여부
		
		if (pin.morc_nm == "") {
			alert("예금주명을 입력해주세요.");
			return;
		}
		if (pin.bank_cd == "") {
			alert("은행을 선택해주세요.");
			return;
		}
		if (pin.account_no == "") {
			alert("계좌번호를 입력해주세요.");
			return;
		}
		
	    /* 계좌 인증 성공 여부 setting */
		$.ajax({
			url:"/mypage/confAccount.action",
			dataType: "JSON",
			type: "POST",
			data: pin,
			async: false,
			success : function(data) {
				if(data.certResult){
					$("input[name='bank_cd']").val(pin.bank_cd);
					$("input[name='morc_nm']").val(pin.morc_nm);
					$("input[name='account_no']").val(pin.account_no);
					accountYn = true;
				}else {
					alert("유효한 계좌가 아닙니다.");
					accountYn = false;
				}
			},error:function(request,status,error){
				alert("계좌 인증에 실패하였습니다.");
				accountYn = false;
		    }
		});
	    return accountYn;
	};
    
    fnNumberTypeChk = function( obj ){
		var regexp = /[^0-9]/gi;
		var v = $(obj).val();
		var v_len = v.length;
		if (regexp.test(v)) {
			v = v.replace(regexp, '');
			v_len = v.length;
		}
		$(obj).val(v.length > 4 ? v_len.substring(0,4) : v);
	}
    
	/***
	 * 선물하기 관련 스크립트  
	 ***/
	elandmall.mypage.present = {
		isRunning : false,	
		fnCertify : function(pin){
			p = $.extend({prsnt_cert_no : ""} , pin||{});
			
			var params = p;
			$.ajax({
				url:"/mypage/registMyPresentCertProc.action",
				dataType: "JSON",
				type: "POST",
				data: params,
				async: false,
				success : function(result) {
					if(result.code == "S"){
						$("#ord_prsnt_no").val(result.ord_prsnt_no);
						if(result.stat == "10"){ // 등록 
							elandmall.mypage.present.fnGoDlvpPage(params);
						}else if(result.stat == "30"){ // 승인 
							elandmall.mypage.present.fnGoListPage(params);
						}else { // 거절 / 취소 / 만료 
							elandmall.mypage.present.fnMessageLayr({stat_cd : result.stat});
						}
					}else {
						elandmall.mypage.present.fnMessageLayr({stat_cd : result.stat});
					}
				},error:function(request,status,error){
					elandmall.mypage.present.fnMessageLayr({stat_cd : result.stat});
			    }
			});
			
		},
		fnGoDlvpPage : function(pin){ //배송정보 등록페이지 이동
			$("#certForm").attr("action","/mypage/initMyPresentDeli.action");
			$("#certForm").submit();
		},
		fnGoListPage : function(pin){ // 선물함 list 페이지로 이동 
			$("#certForm").attr("action","/mypage/initMyPresentList.action");
			$("#certForm").submit();

		},
		fnApprove : function(pin){ //선물 수락처리
			p = $.extend({ord_prsnt_no : ""  , proc_stat_cd : ""} , pin||{});
			
			if(elandmall.mypage.present.isRunning){
				alert("처리중 입니다. 잠시만 기다려 주세요.");
				return;
			}
			
			//연속클릭 방지
			elandmall.mypage.present.isRunning = true;
			$("#proc_stat_cd").val(p.proc_stat_cd);
			var params = $('#dlvpformObj').serialize();
			
			$.ajax({
				url:"/mypage/registMyPresentStatProc.action",
				dataType: "JSON",
				type: "POST",
				data: params,
				success : function(result) {
					elandmall.mypage.present.isRunning = false;

					if(result.code == "S"){
						elandmall.mypage.present.fnMessageLayr({cert_yn : true,stat_cd : p.proc_stat_cd});
					}else {
						alert(result.msg);
					}
				},error:function(request,status,error){
					elandmall.mypage.present.isRunning = false;
			    }
			});
			
		},
		fnReject : function(pin){ //선물 거절 처리
			p = $.extend({ord_prsnt_no : ""  , proc_stat_cd : ""} , pin||{});
			
			//연속클릭 방지
			elandmall.mypage.present.isRunning = true;
			
			var params = {ord_prsnt_no : p.ord_prsnt_no  , proc_stat_cd : p.proc_stat_cd};
			
			$.ajax({
				url:"/mypage/registMyPresentStatProc.action",
				dataType: "JSON",
				type: "POST",
				data: params,
				async: false,
				success : function(result) {
					elandmall.mypage.present.isRunning = false;
					if(result.code == "S"){
						elandmall.mypage.present.fnMessageLayr({cert_yn : true,stat_cd : p.proc_stat_cd});
					}else {
						alert(result.msg);
					}
				},error:function(request,status,error){
					elandmall.mypage.present.isRunning = false;
			    }
			});
		},
		fnMessageLayr : function(pin){ //메세지 레이어 
			pin = $.extend({cert_yn : false} , pin||{});
			if(pin.stat_cd == null || $.type(pin.stat_cd) == "undefined") {
				return;
			}
			var  msg = "";
			if(pin.cert_yn) {  // 인증 이후 
				if(pin.stat_cd == "30") {
					fn_layer_open('msg_lyr_cart_approve');
				}else if(pin.stat_cd == "40"){
					fn_layer_open('msg_lyr_cart_reject');
				}
			}else{  //수락/거절 페이지 메세지
				if(pin.stat_cd == "40") {
					fn_layer_open('msg_lyr_cart_reject');
				}else if(pin.stat_cd == "50"){
					fn_layer_open('msg_lyr_cart_cancel');
				}else{
					fn_layer_open('msg_lyr_cart_fail');
				}
			}


		},fnCheckStat : function(stat){
			
			if(stat != "10") {
				return false;
			}
			return true;
		}
		
	}
	
 	
    /**
     * 상품평 필터 추가정보 입력
     *
     * */
 	fnMyEvalFilterLayer = function(pin){
		
		$("#shoopen_nav").hide();
 	
		elandmall.layer.createLayer({
			layer_id:"pop_eval_filter",
			class_name:"layer_fix btn_btm",
			title: "추가정보입력",
			createContent: function(layer) {
				var div = layer.div_content;

				div.load("/content/initMyEvalFilterLayer.action", pin, function() {

					layer.show();
					
					$("#btnSave").click(function(){
						$("#shoopen_nav").show();
					});
					$(".btn_close").click(function(){
						$("#shoopen_nav").show();
					});
				});
			}
		});
 	};

	fnGoPlanShop = function(disp_ctg_no){
		//세션값에 현재 정보 저장
		if (sessionStorage) {
			//탭
			window.sessionStorage.setItem("goods", $('#rct_0').attr("aria-selected"));
			window.sessionStorage.setItem("dispctg", $('#rct_1').attr("aria-selected"));
		}

		elandmall.shop.goPlanShop({disp_ctg_no : disp_ctg_no});
	};


	fnGoPlanShopRecipe = function(disp_ctg_no){
		//세션값에 현재 정보 저장
		if (sessionStorage) {
			//탭
			window.sessionStorage.setItem("goods", $('#rct_0').attr("aria-selected"));
			window.sessionStorage.setItem("dispctg", $('#rct_1').attr("aria-selected"));
		}

		elandmall.shop.goEkimsPlanShop({disp_ctg_no : disp_ctg_no});
	};

	setConsInit = function(){
		if(sessionStorage) {
			if(window.sessionStorage.length > 0){
				if(window.sessionStorage.getItem("dispctg") == "true"){
					$('#rct_0').attr("aria-selected", "false");
					$('#rct_1').attr("aria-selected", "true");
					setTimeout(function(){
						$('#panel_rct_0').attr("style", "display: none");
						$('#panel_rct_1').attr("style", "display:block");
						window.scrollTo(0,0);
					}, 500);
				}
			}
		}
		//한번 불러 왔으면 세션 값 날리기
		 sessionStorage.removeItem("goods");
		 sessionStorage.removeItem("dispctg");
	};

	setGoodsLatelyInit = function(){
		setTimeout(function(){
			window.scrollTo(0,0);
		}, 500);
	};
    
}());