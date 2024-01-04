(function($){
	
	/** 네임 스페이스 생성*/
	if(!$.overpass){
		$.overpass = {};
	}
	
	$.overpass.sortable = {
			
		/** 해당 사이트 템플릿 카테고리 영역 정보를 담는 다. **/	
		ctgAreaData : {},
		/** 변경된 템플릿 카테고리 영역 정보를 담는 다. **/	
		callBackObj : {},
		
		arraySortData : {
			data : [],
			disp_ctg_no : null,
			shop_type_disp_ctg_no : null 
		},
		
		sortSequenceArr : new Array(),
		/** 드래그 앤 드랍 기본 설정 값을 셋팅.**/
		setConfiguration : {
			
			config : {
			/** 드래그앤 드랍 대상을 지정 하거나 일부 옵션 설정.*/
				target : [{				
					target : null,
					items : null,
					handle : null,
					opacity : 0.6,
					cursor : "move",
					axis : "y",
					accurateIntersection : false,
					forcePlaceholderSize : true,
		            placeholder: null				
				}],				
				
				/** 드래그앤드랍 핸들 레이어를 등록 하기위한 정보 (기본 값)*/
				handle : {				
					lv1 : [".area_lv1","<h2 class='handle'>AREA LEVEL1 HANDLE</h2>"],
					lv2 : [".area_lv2","<h2 class='handle2'>AREA LEVEL2 HANDLE</h2>"],		
					lv3 : [".area_lv3","<h2 class='handle3'>AREA LEVEL3 HANDLE</h2>"],		
					lv4 : [".area_lv4","<h2 class='handle4'>AREA LEVEL4 HANDLE</h2>"]
				},
				
			
				/** 해당 템플릿의 정렬 정보를 호출할 주소 및 파라미터 정보 셋팅*/
				requestData : {
					data : {},
					url : null
				},
				
				/** 파라미터 값으로 드래그앤 드랍을 결정할 때 받을 파라미터와 값을 정의 */
    			dispParam : { 
    				param :"previewYn",
    				value : "Y"
    			},
    			
    			/** 파라미터로 드래그 앤 드랍 작동 여부 결정. false면 파라미터 값 상관없이 기본적으로 드래그앤드랍이 작동된다.*/
    			acceptDispParam : false ,
    			
    			/** 이벤트 제거를 하지 않으려면 이벤트 유지를 원하는 엘리먼트 아이디값을 담는다.  */
    			useEvtElement : [],
    			
    			onClick : function () {}
			}
		},
		
		
		/**
		* 정렬이 가능한 드래그앤 드랍을 생성 한다.
		*
		* @param option 핸들을 붙이기 위한 태그와 prepend 하기 위한 class이름 정보 및 각 옵션을 셋팅 
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		createSortable : function(config,callback){
			var $o = $.overpass.sortable;
			var $optc =  $o.setConfiguration.config;
			
			//옵션을 등록한다.
			$.extend(true,$optc, config);
			//인자로 넘어오는 객체 검증.
			$o.checkType(config);

			//드래그엔 드랍 관련 옵션 및 파라미터 사용 여부 체크
			if(!$o.checkDragDrop($optc)){
				return;
			}
			var selectorLength = $optc.target.length;	
			
			//핸들 등록
			$o.handleSetting($optc.handle);
			//드랙앤드랍 등록
			$o.sortableSetting($optc);
			
			//템플릿 정보 카테고리 정보가 있다면 콜백 등록.
			if(config.requestData){
				$o.searchCtgJosnList($optc);				
				//콜백 함수 등록. 별다른 조취는 하지 않는다.
				callback($o.arraySortData);
				
				$o.setOnClick($o,$optc);
			}

			//모든 이벤트를 제거한다
			$o.removeElementEvt($optc);			
			
		},

		
		/**
		* 데이터 형식을 검사한다.
		*
		* @param sortable json타입으로 넘어오는 설정 객체 
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/		
		
		checkType : function (config) {			
			
			var $optc = $.overpass.sortable.setConfiguration.config;
			
			if( !(config instanceof Object) ) { 
				window.alert("Json 형식으로 넘어와야 합니다.");		
				return;
			} else if(config instanceof Object ) {
				
				for ( var key in config) {
					
					if (typeof($optc[key]) == "undefined") {
						window.alert("Data 형식이 올바르지 않습니다.");		
					}
				}
				
			} else if (!(config.target instanceof Array)) {
				window.alert("배열 형식이 아닙니다.");		
				return;
			}	
			
			
			var selectorLength = config.target.length;	
			
			for(var i = 0 ; i < selectorLength ; i++){
				
				for ( var key in $optc.target[i]) {
					
					if (typeof($optc.target[0][key]) =="undefined") {
						window.alert("옵션 설정 명령이 존재 하지 않습니다. 다시 확인해 주시기 바랍니다.");
						return;
					}					
				}						
			}
		},
		
		
		/**
		* 드래그엔 드랍 셋팅전에 파라미터 값으로 체크 후 이용여부를 결정 한다.
		*
		* @param $optc jquery 타입의 config 설정 값.
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/		
		
		checkDragDrop : function ($optc) {
			
			var $o = $.overpass.sortable;
			
			var bool = true;

			if ($optc.acceptDispParam == true) {
				
				//파라미터가 넘어오면 드래그엔 드랍 적용 여부를 체크 한다.
				if( $optc.dispParam && $optc.dispParam&& 
					$optc.dispParam.param != null && $optc.dispParam.param != "" ){
					var param = $o.getParam($optc.dispParam.param);

					if ( param == "undefined" || param != $optc.dispParam.value || param == null || param == "") {
						bool = false;
						return bool;
					}
					
				} else {
					return bool;
				}
			}
			return bool;
		},
		
		
		/**
		* 모든 엘리먼트 이벤트를 제거한다. 이벤트 제거 예외 아이디가 등록되어 있다면 해당 엘리먼트는 이벤트 유효한다.
		*
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/				

		removeElementEvt : function ($optc) {

			$("*").each(function(){

			  // 모든 이벤트 제거 , area로 시작하는 엘리먼트 드래그앤드랍 이벤트를 유지 handle엘리먼트는
			  // 커서 스타일을 move로 한다... 
				var el = $(this);
			  
				var regx = /^(area_lv|content)[0-9]?/g;
				//클래스 이름이 area_lv로 시작한다면 로직 태운다.
				if(!regx.test(el.attr("class"))){
					
					var regxCursor = /^(handle)[0-9]?/g;
					//클래스 이름이 handle이 아니면 커서 스타일을 기본값으로.
					if(!regxCursor.test(el.attr("class"))){
						el.css("cursor","default");			
					}
					var useEvtIdLength = $optc.useEvtElement.length;
					//이벤트 사용 유무
					var checkUseBtn = false;
					//이벤트를 제거 하지 않기 위해 사용유무 버튼 아이디와 비교 
					for (var i = 0 ; i < useEvtIdLength ; i++) {
						if($optc.useEvtElement[i] == el.attr("id")){
							checkUseBtn = true;
							break;
						} 
					}
					// 버튼 사용 유무가 false 이면 이벤트를 전부 제거하고 사용할 버튼이면 이벤트 유지 한다.
					if(!checkUseBtn){		
						
						if(el.data("bo_preview_yn") != "Y") {
							if(el.prop("tagName").toLowerCase() == "a" ){
							       
								el.attr("href", "#none");
								el.attr("onclick","javascript:return false;")
								el.removeAttr('onmouseover onmouseup onmousedown hover');
								el.unbind();
								
							}else{
								el.removeAttr('onclick onmouseover onmouseup onmousedown hover');
								el.unbind();   
							}
						}
					}
				}
			}); 		
		}, 
			
		
		
		/**
		* 화면에 출력 하는 템플릿 카테고리 정보를 가져온다.
		*
		* @param option 옵션  
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		searchCtgJosnList : function (option) {
			
			var $o = $.overpass.sortable;
			var $sortableData = option.requestData.data;
			
			if (!$sortableData.disp_ctg_no || !$sortableData.shop_type_disp_ctg_no ) {
				window.alert("다음과 같은 {disp_ctg_no : value , shop_type_disp_ctg_no : value } 파라미터가 필요합니다.");
				return;
			}else{
				$o.arraySortData.disp_ctg_no = $sortableData.disp_ctg_no;
				$o.arraySortData.shop_type_disp_ctg_no = $sortableData.shop_type_disp_ctg_no				
			}
			
			$.ajax({
				url: option.requestData.url,
				dataType: "json",
				data: option.requestData.data,
				async: false,
				success : function(data,status,request) {
					$o.ctgAreaData = data;		
					
				},
				error : function (request,status,error) {
					alert("message : 잘못된 요청입니다.\nRequest Code : " +request.status+"\n"+ "Error Message : " +error);	
					return;
				}
			});			
		},
		
		
		
		
		/**
		* drag and drop 하기 위한 핸들을 붙여 넣는다.
		*
		* @param handle 핸들을 붙이기 위한 태그와 prepend 하기 위한 class이름 정보 
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		handleSetting : function (handle) {
			
			var overpasHandleConfig =  $.overpass.sortable.setConfiguration.config.handle;
			
			var i = 1;
			
			for (var hkey in handle) {

				if (i > 4 ){					
					window.alert("handle 레벨은 4까지만 지원 합니다. 다시 확인하여 주시기 바랍니다.");					
				}
				i++;
			}
						
			for ( var key in  overpasHandleConfig) {
				
				if (handle != null) {

					if (typeof(handle[key]) =="undefined") {					
						$(overpasHandleConfig[key][1]).prependTo(overpasHandleConfig[key][0]);
					}else{	
						$(handle[key][1]).prependTo(handle[key][0]);					
					}
					
				} else {
					$(overpasHandleConfig[key][1]).prependTo(overpasHandleConfig[key][0]);
				}				
			}		
		},
		
		
		/**
		* jQuery 에서 제공하는 sortable 기능을 셋팅한다. 위치를 변경할 수 있게 해주는 드래그앤 드랍 플러그인이다.
		*
		* @param target sortable 할 대상 정보를 넘겨 받는다
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		sortableSetting : function ($optc) {

			var $target = $optc.target;
			var selectorLength = $target.length;
			
			for(var i = 0 ; i < selectorLength; i++){
				
				$($target[i].target).sortable({
					
			        items : $target[i].items ,
		            handle : $target[i].handle || $target[0].handle,
		            opacity : $target[i].opacity|| $target[0].opacity ,
		            cursor : $target[i].cursor || $target[0].cursor,
		            axis : $target[i].axis || null,
		            accurateIntersection : $target[i].accurateIntersection || $target[0].accurateIntersection,
		            forcePlaceholderSize : $target[i].forcePlaceholderSize || $target[0].forcePlaceholderSize,
		            placeholder : $target[i].placeholder || $target[0].placeholder,
		            
		            update: function(event, ui) {
						//메인 CORNER 순서 변경 업데이트 
						var result = $(this).sortable('toArray');   
						
						if($optc.requestData){
							$.overpass.sortable.sortableData(result);							
						}
		            },
		            
		            start : function (event, ui) {
						var result = $(this).sortable('toArray');    
						if($optc.requestData){

							$.overpass.sortable.sortSequenceArr = null;						

							//정렬 순서가 바뀌면 disp_seq값을 서로 바꿔주기 위하여 array에 담는다.
							var sortArr = new Array();
							
							for (var i = 0 ; i < result.length ; i ++ ) {
								var seq = $.overpass.sortable.ctgAreaData[result[i]].DISP_SEQ;
								sortArr.push(seq);
							}			
							$.overpass.sortable.sortSequenceArr = sortArr;
						}
					}
				}).disableSelection();
			}				
		},
		
		
		/**
		* Drag 앤 드랍 순서를 정렬 한다. 마우스 드래그 할 때마다 실행되며 정렬 순서가 업데이트 된다.
		*
		* @param $optc jquery 타입의 config 설정 값.
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/		
		
		sortableData : function (toArray) {
			
			function tokenRtn (level,split,value) {
				var tmp = split;
				var rtn = value;					
				
				if(level == 1){	

					var splitSize = split.length;

					for (var z = 0 ; z < splitSize ; z++ ) {
						if (z > 0){
							rtn = rtn +";"+split[z];							
						}
					}

				}else if(level == 2){							
					rtn = tmp[0]+";"+rtn+((tmp[2] == undefined) ? "" : ";"+tmp[2]);	
				}else if(level == 3){
					rtn = tmp[0]+";"+tmp[1]+";"+rtn;
				}					
				return rtn;
			}
			
			
			var $o = $.overpass.sortable;
			var $oc = $o.ctgAreaData;
			
			var toArrayLength =  toArray.length;
			var sortSequenceLength = $.overpass.sortable.sortSequenceArr.length;
			
			try {
			
				for(var i = 0 ; i < toArrayLength ; i ++){
	
					for(var j = 0 ; j < sortSequenceLength ; j ++){
						
						if( i == j ){
							
							$oc[toArray[i]].DISP_SEQ = $o.sortSequenceArr[j];
							
							if( ($o.getParam("saveYn") != "Y") ){

								for (var key in $o.ctgAreaData) {
									//DATA들에 AREA_NO_PATH 에 현재 바뀐 AREA_NO 번호가 있다면
									if ($oc[key].AREA_NO_PATH.indexOf($oc[toArray[i]].AREA_NO) > -1 && $oc[key].ON_DEPTH_DISP_NUM_STR != "") {
										
										var split = $oc[key].ON_DEPTH_DISP_NUM_STR.split(";");
										$oc[key].ON_DEPTH_DISP_NUM_STR = tokenRtn ($oc[toArray[i]].LEVEL,split,$o.lpad($o.sortSequenceArr[j],5,"0"));
										$o.callBackObj[key] = $oc[key];									
									}
								}								
							}else{
								$o.arraySortData.data[i] = $o.callBackObj[$oc[toArray[i]].AREA_NO] = $oc[toArray[i]];								
							}//end if
	

						}//end if( i == j )					
					}
				}
				
				if( ($o.getParam("saveYn") != "Y") ){
					$o.arraySortData.data = JSON.stringify($o.parseArraySortData());
				}

			} catch (e) {				
				window.alert("Drag&Drop 데이터 정렬 중에 "+e.type+" : "+e.message+"에러가 발생하였습니다");			
			}
		},
		
		/**
		* 데이터를 순서대로 배열에 저장 한다.
		*
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/		
		
		
		parseArraySortData : function () {
			
			$o = $.overpass.sortable;
			$oc = $o.callBackObj;
			if($o.arraySortData.data != null){
				
				var sortdata = [];
				
				var i = 0;
				for (var key in $oc ) { 
					sortdata[i] = $oc[key];
					i++;
				}			
				return sortdata;
				
			} else {
				alert("Drag&Drop 정렬 데이터가 존재하지 않습니다.");
			}
		},
		
		
		/**
		* 핸들 클릭했을 때 영역 번호와 순서번호를 호출할 이벤트를 등록한다.
		*
		* @param option 핸들을 붙이기 위한 태그와 prepend 하기 위한 class이름 정보 및 각 옵션을 셋팅 
		* @author 장진철 zerocooldog@pionnet.co.kr
		* 
		*/
		
		setOnClick : function ($o,$optc) {
			
			$("div[class^=area_lv]").each(function(e,i){
				
				var clickObj = {AREA_NO : 0,DISP_SEQ : 0	}
				
				
			//	$o.callBackObj[i.id].AREA_NO;
				
				$(this).bind("click",function(e){
					
					//이벤트 버블링 잠금
					var eventReference = e ? e : window.event;
					if (eventReference.stopPropagation) {
						eventReference.stopPropagation();
					} else {
						eventReference.cancelBubble = true;
					}

					//드래그앤 드랍 후 데이터가 있으면 거기서 꺼내고 없으면 맨처음 db에서 불러온 데이터 꺼냄.
					if($o.callBackObj[i.id]) {
						clickObj.AREA_NO = $o.callBackObj[i.id].AREA_NO;
						clickObj.DISP_SEQ =  $o.callBackObj[i.id].DISP_SEQ;
					}else{
						clickObj.AREA_NO = $o.ctgAreaData[i.id].AREA_NO;
						clickObj.DISP_SEQ =  $o.ctgAreaData[i.id].DISP_SEQ;
					}
					$optc.onClick(clickObj);
				});
			});

		},
		
		//파라미터 정보를 가져온다.
		
		getParam : function (key) {
			var _parammap = {};
			//([^&]*)?  : && 두번 연달아 오면 안되고 aa& 혹은 아무값이 없거나.
			//?:([^=]+)=([^&]*)&?  : ==연달아 오면 안되고 = 제외한 글자들을 받는다.
			document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
				function decode(s) {
					return decodeURIComponent(s.split("+").join(" "));
				}
				_parammap[decode(arguments[1])] = decode(arguments[2]);
			});
			return _parammap[key];
		},
		
		// 대상 문자, 최대 크기 , 대체 문자열
		lpad : function(targetStr,maxLength,replaceStr) {
			var addStr = "";
			
			if (typeof(targetStr) != "string") {
				targetStr += "";
			}

			var diffLen = maxLength - targetStr.length;	

			for (var i = 0 ; i < diffLen; ++i) {
				addStr += replaceStr;
			}
	
			return addStr += targetStr
		}
	};
	
})(jQuery);
