(function($){
	
	/** 네임 스페이스 생성*/
	if(!$.overpass){
		$.overpass = {};
	}
	
	$.overpass.ifrmProxy = {
			
		/** 아이프레임 아이디 */
		_IFRM_ID : "CALL_OVERPASS_IFRM_PROXY",
		
		/** 아이프레임에 보낼 폼 아이디 */
		_TFORM_ID : "CALL_OVERPASS_TFORM_PROXY",
		
		/** 호출할 함수 파라메터 명 */
		_TFUNC_NAME_ID : "CALL_OVERPASS_TFUNC_NAME_PROXY",
		
		/** 함수 인자로 넘길 Json 타입 data 파라메터 명 */
		_TARGS_DATA_ID : "CALL_OVERPASS_TARGS_DATA_PROXY",
			
		/** 옵션 */
		config : {
			scheme : "http",
			host : null,
			proxyPath : null ,
			method : "post",
			funcName : null, 				
			data : {}
		},
		
		/** 상위 페이지에 보낼 함수명과 데이터*/
		sendData : {
			funcName : null,
			argsJson : null
		},
		
		/**
		* 프록시 페이지를 호출 할 정보 및 구성을 셋팅
		*
		* @param $o $.overpass.ifrmProxy 오브젝트
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		initialize : function ($o) {

			$o.sendData.funcName = $o.config.funcName;
			$o.sendData.argsJson = $o.config.data;
			
			$o.createIfrm($o);
			
		},
		
		/**
		* 프록시 페이지를 호출 할 아이프레임을 만들고 각 값들을 전송 한다.
		* post 방식 이라능~
		* @param $o $.overpass.ifrmProxy 오브젝트
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		createIfrm : function ($o) {

			var proxyIfrmName = $o.getElementRename($o._IFRM_ID);

			var ifrmHtml  = '';
			ifrmHtml += '<iframe id="'+proxyIfrmName+'" name="'+proxyIfrmName+'" ';
			ifrmHtml += ' style="display:none"></iframe> ';
			$(ifrmHtml).prependTo("body");

			$o.createTempForm($o,proxyIfrmName);

		},
		
		
		createTempForm : function ($o,ifrmId) {
			
			var proxyFormName = $o.getElementRename($o._TFORM_ID);
			var tFormHtml  = "";
			tFormHtml += "<form id=\""+proxyFormName+"\" ";
			tFormHtml += " action=\""+$o.config.scheme+"://"+$o.config.host+"/"+$o.config.proxyPath+"#\" ";
			tFormHtml += " method=\""+$o.config.method+"\" target=\""+ifrmId+"\" > ";
			tFormHtml += "<input type=\"hidden\" name=\""+$o._TFUNC_NAME_ID+"\" value=\""+$o.config.funcName+"\" /> ";
			tFormHtml += "<input type=\"hidden\" name=\""+$o._TARGS_DATA_ID+"\" value=\""+$o.URLEncode(JSON.stringify($o.sendData))+"\" /> ";
			tFormHtml += "</form> ";
			$(tFormHtml).prependTo("body");
			
			var proxyTform = $("#"+proxyFormName);
			proxyTform.submit();

			var tIfrm = $("#"+ifrmId);

			//iframe onload 일때.. 엘리먼트를 지워줘야 하는데 안먹힘.. 일단 임시로.. 
			
			setTimeout(function(){
				proxyTform.remove();
				tIfrm.remove();
			},500);
		},
		
		/**
		 * 
		 * 임시로 만든 iframe 및 form 객체 아이디가 중복 되지 않게 이름을 임의로 변경 한다.
		 * 
		 * @param name 엘리먼트 아이디 및 이름을 변경 할 문자열
		 * @author 장진철 zerocooldog@pionnet.co.kr
		 */
		
		getElementRename : function (name) {
			
			var $o = $.overpass.ifrmProxy
			
			var cdate = new Date();
			var h=$o.addZero(cdate.getHours(),2);
			var m=$o.addZero(cdate.getMinutes(),2);
			var s=$o.addZero(cdate.getSeconds(),2);
			var ms=$o.addZero(cdate.getMilliseconds(),3);
			var rename = name+h+m+s+ms;
	
			return rename
		},
		
		/**
		* 도메인이 다른 상위 문서의 함수를 호출 한다.
		*
		* @param config 옵션 정보
		* @author 장진철 zerocooldog@pionnet.co.kr
		*/
		
		send : function (config) {
			
			var $o = $.overpass.ifrmProxy;				
			$.extend(true,$o.config,config);

			$o.initialize($o);
		},
		
		/**
		* 파라메터를 URL인코딩 한다.
		*
		* @param c 파라메터 값 문자열
		* @link http://www.digitalbart.com/blog/jquery-and-urlencode/ 댓글에서 퍼옴
		*/
		
	     URLEncode : function(s) {
    		 s = encodeURIComponent (s);
    		 s = s.replace (/\~/g, '%7E').replace (/\!/g, '%21').replace (/\(/g, '%28').replace (/\)/g, '%29').replace (/\'/g, '%27');
    		 s = s.replace (/%20/g, '+');
    		 return s;
	     },
	 
		/**
		* 파라메터를 URL디코딩 한다.
		*
		* @param c 파라메터 값 문자열
		* @link http://www.digitalbart.com/blog/jquery-and-urlencode/ 댓글에서 퍼옴
		*/
	     
	    URLDecode : function(s) {
	    	s = s.replace (/\+/g, '%20');
	    	s = decodeURIComponent (s);
	    	return s;
	     },
	     
		/**
		* 시 분 초가 2자리수 미만 이면 앞자리에 0을 붙여준다.
		*
		* @param c 파라메터 값 문자열
		* @link http://www.digitalbart.com/blog/jquery-and-urlencode/ 댓글에서 퍼옴
		*/     
	     
	    addZero : function (x,n) {
			if (x.toString().length<n) 
			{
				x="0" + x;
			}
			return x;
		}
	};
	
})(jQuery);