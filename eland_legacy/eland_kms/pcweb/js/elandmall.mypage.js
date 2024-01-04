var _preventDefault;


(function () {
	
	
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
	 * 마이페이지 기간검색영역 공통
	 */
	elandmall.mypage.searchFilter = {
			initCal : function(calBtnObj, calInputObj1, calInputObj2, checkPeriod){
				if(!checkPeriod){
					checkPeriod = 6;
				}
				var p = {
						type:'two',
						title:'기간 선택', 
						callback:function(start, end){
							//alert(start.start_date.yyyy + "." + start.start_date.mm + "." + start.start_date.dd +"||||"+end.end_date.yyyy + "." + end.end_date.mm + "." + end.end_date.dd)
							
							
							calInputObj1.val(start.start_date.yyyy + "." + start.start_date.mm + "." + start.start_date.dd );
							calInputObj2.val(end.end_date.yyyy + "." + end.end_date.mm + "." + end.end_date.dd );
							
							// n개월 이상 체크 조회 버튼 클릭시 변경 16.05.17
							//elandmall.mypage.searchFilter.checkPeriodCondition(checkPeriod)
							
							// 기간 선택 버튼 초기화
							elandmall.mypage.searchFilter.removePeriodCondition();
						}
				}
				
				//달력 초기화 : 시작일
				calBtnObj.showCalendar(p);
				
			},
			initBtn : function(){// 파라메터에 따른 버튼 선택 처리
				if(_global_param.date_divi_tp=='week' || _global_param.date_divi_tp=='month'){
					var obj = $('.attr_grade > li > a[data-val='+_global_param.date_divi+'][data-type='+_global_param.date_divi_tp+']  ');
					obj.addClass("on");
					
					//달력 선택 값 초기화
					elandmall.mypage.searchFilter.selectPeriodBtn(obj);
				}else{
					//날짜 검색일 경우
				}

				if( _global_param.search_all_mall ) {
					$("#search_all_mall").prop("checked", true);
				}
			},
			//달력 유효성 체크
			checkPeriodCondition : function(checkPeriod){
				//1. 기간이 n개월이 넘는지 체크
				var date_start = _global_param.startInputObj.val();
				var date_end = _global_param.endInputObj.val();
				
				if(date_start=='' || date_end==''){
					return true;
				}
				var dateArray1 = date_start.split(".");
				var dateArray2 = date_end.split(".");

				  
				var dateObj1 = new Date(dateArray1[0], Number(dateArray1[1])-1, dateArray1[2]);  
				var dateObj2 = new Date(dateArray2[0], Number(dateArray2[1])-1, dateArray2[2]);  
				  
/*				var betweenDay = (dateObj2.getTime() - dateObj1.getTime())/1000/60/60/24;  */
				  

				//시작일이 종료일보다 큰지 체크
				if(dateObj1 > dateObj2){
					alert('시작일이 종료일보다 큽니다.');
					return false;
				}
				//최대 검색기간 체크
				this.addMonth(dateObj1, checkPeriod);
				if(dateObj1 < dateObj2){
					alert('검색기간은 최대 '+checkPeriod+'개월 입니다. 날짜를 조정해 주세요');
					// 조회시 검색기간에 대한 체크(기존값 유지) 16.05.17
					//elandmall.mypage.searchFilter.selectPeriodBtn($('#period_'+checkPeriod+'m > a'));
					
					return false;
				}

				
				return true;
			},
			addMonth : function(date, month){
				date.setMonth(date.getMonth() + month);
			},
			getDateString : function(date){//Date를 YYYY.MM.DD 스트링으로 리턴
				var month = date.getMonth() + 1;
				if(month < 10 ){
					month= "0" + month;
				}
				var day = date.getDate();
				if(date.getDate() < 10 ){
					day= "0" + date.getDate();
				}				
				return date.getFullYear()+"."+month+"."+day;
			},
			selectPeriodBtn : function(obj){//기간 버튼 클릭시 달력영역 날짜 세팅
				//검색기간 버튼 초기화
				var selectedValue = obj.data('val');
				var selectedType = obj.data('type');
				var date = new Date();
				
				//종료일은 오늘로
				_global_param.endInputObj.val(this.getDateString(date));
				
				if(selectedType=='week'){
					date.setDate(date.getDate() - (selectedValue * 7));
				}else{
					this.addMonth(date, -(parseInt(selectedValue)));
				}
				
/*				if(selectedValue=='1w'){
					date.setDate(date.getDate() - 7);
				}else{
					this.addMonth(date, -(parseInt(selectedValue)));
				}*/
				
				//시작일
				_global_param.startInputObj.val(this.getDateString(date));

			},
			removePeriodCondition : function(){//기간 버튼 선택 해제
				$('.attr_grade > li > a').removeClass("on");
			}
	};
	
	_checkbox_all = function(){
		$('#check_all').click(function(){
			//$('input:checkbox[name='+$(this).data("target")+']').prop('checked', $(this).is(':checked'));
			checkall($(this).is(':checked'), $(this).data("target"));
		});
	};
	// 체크박스 전체 선택 (직접호출용)
	checkall = function(checked, target){
		$('input:checkbox[name='+target+']').prop('checked', checked);
	}
	
	//전체선택 버튼 클릭
	check_all_btn = function(obj, wishname, target){
		
		var ischeck = $(obj).data("ischeck");
		
		if(ischeck){
			$(obj).find("span").html(wishname+" 전체 선택");
		}else{
			$(obj).find("span").html(wishname+" 전체 해제");
		}
		checkall(!ischeck, target);//각 항목 선택/해제
		$(obj).data("ischeck", !ischeck);//현제 상태 저장
		
	}
	
	// 마이페이지 좌측 메뉴 링크
	$(document).ready(function(){
		
		_preventDefault = function(){
			$("form").submit(function(e){ e.preventDefault();});
		}
		
		$('#memberLoginLeft').find('a').click(function(){
			var click_id = $(this).attr("id");
			
			switch(click_id){
				case  'left_01' :
					elandmall.mypage.link.orderDeli();
				break;
				case  'left_02' :
					elandmall.mypage.link.orderClaim();
				break;
				case  'left_03' :
					if(elandmall.global.disp_mall_no == '0000045'){
						elandmall.kims.mypage.link.orderDocument();
					}else {
						elandmall.mypage.link.orderDocument();
					}
				break;
				case  'left_04' :
					elandmall.mypage.link.point();
				break;
				case  'left_05' :
					elandmall.mypage.link.coupon();
				break;
				case  'left_06' :
					elandmall.mypage.link.deposit();
				break;	
				case  'left_07' :
					elandmall.mypage.link.eval();
				break;				
				case  'left_08' :
					if(elandmall.global.disp_mall_no == '0000053'){
						elandmall.shoopen.mypage.link.counsel();
					}else if(elandmall.global.disp_mall_no == '0000045'){
						elandmall.kims.mypage.link.counsel();
					}else{
						elandmall.mypage.link.counsel();
					}
				break;
				case  'left_08_1' :
					elandmall.mypage.link.counsel({tab:2});
				break;
				case  'left_09' :
					elandmall.mypage.link.mixAndMatch();
				break;
				case  'left_10' :
					elandmall.mypage.link.wishlist();
				break;		
				case  'left_11' :
					elandmall.mypage.link.goodListLately();
				break;		
				case  'left_12' :
					elandmall.mypage.link.event();
				break;				
				case  'left_13' :
					elandmall.mypage.link.dlvp();
				break;		
				case  'left_14' :
					elandmall.mypage.link.refundAccount();
				break;		
				case  'left_15' :
					elandmall.mypage.link.orderInfoReceive();
				break;				
				case  'left_16' :
					if(elandmall.global.disp_mall_no == '0000053') {
						elandmall.shoopen.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId());
					}else {
						elandmall.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId());
					}
				break;	
				case  'left_17' :
					if(elandmall.global.disp_mall_no == '0000053') {
						elandmall.shoopen.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId());
					}else {
						elandmall.mypage.link.modifyMemberInfo(elandmall.oneclick.getLoginId());
					}
				break;					
				case  'left_18' :
					if(elandmall.global.disp_mall_no == '0000053') {
						elandmall.shoopen.mypage.link.withdrawal(elandmall.oneclick.getLoginId());
					}else {
						elandmall.mypage.link.withdrawal(elandmall.oneclick.getLoginId());
					}
				break;	
				case  'left_19' :
					if(elandmall.global.disp_mall_no == '0000053') {
						elandmall.shoopen.mypage.link.manageSnsAccount(elandmall.oneclick.getLoginId());
					}else {
						elandmall.mypage.link.manageSnsAccount(elandmall.oneclick.getLoginId());
					}
				break;	
				case  'left_20' :
					elandmall.mypage.link.myRestockList();
				break;	
				case  'left_21' :
					elandmall.mypage.link.myTopasReservationList();
					break;	
				case  'left_22' :
					elandmall.shoopen.mypage.link.Reply();
					break;
				case  'left_23' :
					elandmall.shoopen.mypage.link.event();
					break;
			}
		});		
		
		//전체선택 버튼 초기화(id=check_all_btn)
		$('#check_all_btn').click(function(){
			check_all_btn($(this), $(this).data("wishname"), $(this).data("target"));
		});
		
		// 체크박스 전체선택 초기화(id=check_all)
		_checkbox_all();
	});
	
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
		try{
			_preventDefault();
		}catch(e){
			
		}
		
		if (typeof pin == "undefined"){
			location.reload(true);
			return;
		}
		
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
	    
	    location.href = elandmall.util.https("/mypage/initMyOrderDetailList.action?" + param);
	};
	
	/**
	 * 취소/반품/교환 조회
	 * 
	 */
	fnSearchMyOrdClaimLst = function(pin){
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
			location.href = elandmall.util.https("/mypage/initMyOrderClaimList.action?"+param);
		} else {
			location.href = elandmall.util.https("/mypage/initMyOrderClaimList.action");
		}
	};
	
	/**
     * 배송현황조회
     * 
     * @param pin :
     *            var pin = {deli_no:"201205080000244", deli_seq:"1", invoice_no:"123456", parcel_comp_cd:"30", grp_cd4:""};
     */
    fnInvoiceViewPop = function(pin){
    	_preventDefault();
    	
        var strTitle = (pin.title == undefined) ? "배송송장추적" : pin.title;
        
		if (pin.deli_no == "" || pin.deli_seq == "" || pin.parcel_comp_cd == "" || pin.invoice_no == "") {
			alert("죄송합니다.\n\r배송 송장 추적을 위한 정보가 부족합니다.");
			return;
		};
		
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
				width : "1300",
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
			elandmall.layer.createLayer({
				layer_id:"deliInvoiceTraceLayer",
				class_name:"layer_pop inquiry on",
				//class_name:"layer_pop d_layer_pop on",
				title: "상품배송현황",
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
		}
    };
    /**
     * NGCPO-5076 명품CD 구매대행 상품/주문처리 기능 추가-주문
     */
    fnDeliOverseasPurchaseViewPop = function(pin){
    	_preventDefault();
		elandmall.layer.createLayer({
			layer_id:"deliInvoiceTraceLayer",
			//class_name:"layer_pop inquiry on",
			class_name:"layer_pop d_layer_pop on",
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
			if(elandmall.global.disp_mall_no == '0000053') {
				location.href = elandmall.util.newHttps("https:" + elandmall.global.shoopen_domain_url +"/goods/initGoodsDetail.action?" + param);
			} else {
				location.href = elandmall.util.newHttps("/goods/initGoodsDetail.action?" + param);
			}
		}
	};
	
	/**
	 * 반품/교환 신청
	 * 
	 */
    fnGoReturnExchngClaim = function(pin){
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
			location.href = elandmall.util.https("/mypage/initMyOrderReturnExchngProc.action?"+param);
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
					if ( e.error_message !=null && e.error_message != ""){
						alert("오류가 발생하였습니다.");
					}else{
						alert("오류가 발생하였습니다.");
					}
				}
			});
		}
	};
	
	/**
	 * 단품변경
	 * 
	 */
	fnChangeItem = function(pin){
		elandmall.layer.createLayer({
			layer_id:"myOrderItemLayer",
			class_name:"layer_pop d_layer_pop on",
			tit_class_name : "lay_tit",
			title: "상품 옵션 변경",
			
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/mypage/initMyOrderItemLayer.action", pin, function() {
					layer.show();
				});
				
				div.on("click", "#cancelBtn", function(){
					layer.close();
				});
				
				div.on("click", "#chngItemBtn", function(){
					if (pin.goods_cmps_divi_cd == "10") {	//일반상품 옵션 리스트 설정
						if ($("[name=chng_item_no]").val() == pin.item_no) {
							alert("변경된 옵션이 없습니다.");
							return;
						}
					} else {
						var optChng = true;
						
						$.each($("[id^='setItems']"), function(idx, obj){
							var cmps_grp_seq = $(this).attr("id").substring(8,13);
							
							if ($(this).val() != $("#cmps_item_no_"+cmps_grp_seq).val()) {
								optChng = false;
							}
						});
						
						if (optChng) {
							alert("변경된 옵션이 없습니다.");
							return;
						} 
					}
					var vir_vend_no = $("#optLayerformObj").find("select option:selected").attr("data-vir_vend_no");
					if(vir_vend_no != null){
					$('#optLayerformObj').append("<input type='hidden' value='"+ vir_vend_no +"'name='vir_vend_no'/>");
					}
					$.ajax({
						url: "/mypage/registClaimOptChngProc.action",
						type: "POST",
						dataType: "json",
						async:false,
						data: $('#optLayerformObj').serialize(),
						success: function(data) {
							if(data.code == "S"){
								location.reload();
							}else{
								alert("옵션변경중 오류가 발생했습니다.");
							}
						}
					});
				});
			}
		});
	};
	
	/**
	 * 매장정보 레이어
	 * 
	 */
	fnViewStoreMap = function(pin){
		elandmall.layer.createLayer({
			layer_id:"storeInfoMapLayer",
			class_name:"layer_pop d_layer_pop on",
			tit_class_name : "lay_tit",
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/mypage/initStoreInfoMapLayer.action", pin, function() {
					layer.show();
				});
			}
		});
	};
	
	/**
	 * 배송희망일 변경
	 */
	fnChngDeliHopeDate = function(pin){
		if(pin.deli_hope_dtime <= pin.today){
			alert("매장 방문일은 당일 이후로 변경 가능합니다.");
			return;
		}
		
		if(pin.order_divi_cd == '10' || pin.order_divi_cd == '30'){ //자동발주(Const.PV_ORDER_DIVI_CD_AUTO)
			alert("자동발주 상품은 매장수령예정일을 변경 불가합니다.");
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
     * 오늘직송 방문시간 선택 팝업
     * 
     * @param pin :
     *            var pin = {center_no:"201205080000244"};
     */
    fnHyperDlvpListLayerPop = function(pin){
    	_preventDefault();
    	
        elandmall.layer.createLayer({
			layer_id:"hyperDlvpListPop",
			class_name:"layer_pop d_layer_pop on",
			tit_class_name : "lay_tit02",
			title: "방문시간 선택",
			dimm_use: true,
			createContent: function(layer) {
				var div = layer.div_content;
				div.load("/mypage/initHyperDlvpListLayer.action", pin, function() {
					layer.show();
					
					
					div.on('change', "input[name=rsv_dlv]", function() {
						
						var checked = div.find("input[name=rsv_dlv]:checked");
						if(checked.length > 0 ){
							$.ajax({
								url: '/mypage/getHyperValidation.action',
								dataType: "text",
								data: {
									center_no    : checked.attr("center_no"),
									lot_dlv_date : checked.attr("lot_dlv_date"),
									lot_dlv_seq  : checked.attr("lot_dlv_seq"), 
									lot_bgn_tm   : checked.attr("lot_bgn_tm"),
									lot_end_tm   : checked.attr("lot_end_tm")
								},
								success: function(data) {
									// 주문가능이 아닐경우
									if( data != "01" ) { 
										alert("선택한 방문시간이 마감되었습니다.\r\n다시 선택해주세요.");
										
										if(data == "90"){
											checked.parent().html('<span class="red">휴점일</span>');
										}else{
											checked.parent().html('예약마감');
										}
										return;
									}
								}, error : function( e ){
									alert("오늘직송 배송가능여부 확인시 오류가 발생하였습니다.");
								}
							});
						}
					});
					
					div.on('click', "#cfmBtn", function(){
						var checked = div.find("input[name=rsv_dlv]:checked");
						
						if(checked.length == 0 ) {
							alert("방문시간을 선택해주세요");
							return;
						}
									
						$("#hyper_dlv_info_str").text(
								checked.attr("lot_view_date") + " " + 
								checked.attr("lot_bgn_tm") + " ~ " +
								checked.attr("lot_end_tm")
						);
						$("#hyper_dlv_date").text(checked.attr("lot_dlv_date"));
						$("#hyper_dlv_seq").text(checked.attr("lot_dlv_seq"));
						$("#hyper_bgn_tm").text(checked.attr("lot_bgn_tm") );
						$("#hyper_end_tm").text(checked.attr("lot_end_tm") );
						$("#hyper_center").text(checked.attr("center_no") );
						
						$("#hyper_select").html("<span>다시선택</span>");
						layer.close();
					});
				});
			}
		});
    };

	numberWithCommas = function(amt) {
	    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
}());