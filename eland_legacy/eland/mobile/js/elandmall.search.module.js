$(window).ready(function(){
	fnsearchresent.drawSearchedKwd();
})
;(function($) {
	var maxResult = 10;		 	 // 최대 결과값
	var resultNm = "keywords";	 // 쿠키명
	var separator = "__";		 // 쿠키 separator
	var newSeparator = "|";		 // 쿠키 separator encoding 되는 문자로 변경 [NGCPO-6329]
	var newSeparator2 = ":";	 // 쿠키 separator 키워드와 날짜 사이 구분자	  [NGCPO-6329]
	var shortFlag = true;		 // 줄임말 사용여부
	var shortLen = 8;			 // 줄임말 사용시 길이

	// KIMS 최근검색어 최대 30개
	if (elandmall.global.disp_mall_no == "0000045") {
		maxResult = 30;
	}

    /*쿠키 현재날짜 저장  */
	var keywordDate = new Date();
	var month = keywordDate.getMonth()+1
	var day = keywordDate.getDate();
	if(month < 10){
		month = "0"+month;
    }
	if(day < 10){
		day = "0"+day;
	}
	var today = month+"."+day;
	
	fnsearchresent = {
		callKwdCookie: function( _kwd ){
			// 특수문자 제거
			// 19.03.12 현업 요청으로 최근검색어는 특수문자 제거하지 않고 저장하도록 수정.
			//var pattern = /[\"\'\\<>&?*=#]/gi;   // 특수문자 제거
			//var _kwd = _kwd.replace(pattern, "");
			var _kwd = _kwd;
			if(_kwd.trim().length == 0)
				return;
			
			var tempStr = null;
		    var cookieStr = "";
		    var newCookieStr = "";
		    var kwd = "";
		    if (elandmall.util.getCookie(resultNm) != null) {    // 쿠키 존재 할 경우
		        cookieStr = elandmall.util.getCookie(resultNm);        
		        tempStr = cookieStr.split(separator); // 구분자 2개 혼용 ("__", "|")
		        
		        for(var i = 0; i < tempStr.length; i++){ // 배포일 이전 데이터는 날짜를 배포일로 일괄적으로 셋팅
		        	if( tempStr[i].split(newSeparator2).length < 2 ){
		        		tempStr[i] = tempStr[i].concat(":10.23");
		        	}
		        }
		        
		        for(var i = 0; i < tempStr.length; i++){
		        	if(tempStr[i].indexOf(newSeparator) > -1){ // "|" 구분자가 포함되어있으면
		        		var newTempStr = new Array();
		        		newTempStr = tempStr[i].split(newSeparator);
		        		tempStr.splice(i,1);
		        		tempStr = tempStr.concat(newTempStr);
		        	}
		        }
		        
		        
		        for(var i = 0; i < tempStr.length; i++){	// 쿠키를 새로 세팅해준다.
		        	if(i == tempStr.length-1){
		        		newCookieStr += tempStr[i];
		        	}else{
		        		newCookieStr += tempStr[i] + newSeparator;
		        	}
		        }
		        // 쿠키가 현재 2개 이상일 경우
		        if (tempStr.length > 1 ) {
		            for(var i=0; i<tempStr.length; i++) {
		            	
		            	// 동일 키워드 발견
		                if (unescape(tempStr[i].split(newSeparator2)[0]) == _kwd) { 
		                    //kwd = unescape(cookieStr);
		                	kwd = fnsearchresent.delKwdLst2(_kwd);
		                	kwd = kwd + newSeparator + escape(_kwd) + newSeparator2 + escape(today);
		                    break;
		                }    
		                
		                // 동일 쿠키를 발견하지 못하였음.
		                if(i == tempStr.length-1){
		                    //현재 쿠키가 max값 쿠키와 비교해서 높은지 낮은지 체크
		                    if(tempStr.length < maxResult){
		                        kwd = newCookieStr + newSeparator + escape(_kwd) + newSeparator2 + escape(today);
		                    }else{
		                        for(var j=1; j<tempStr.length; j++){
		                       	   kwd = kwd.concat(tempStr[j].split(newSeparator2)[0]); // 검색어
		                       	   kwd = kwd.concat(newSeparator2);
		                       	   
		                       	   if(tempStr[j].split(newSeparator2).length == 2){ // NGCPO-6329 배포 후 최근검색어 날짜
		                       	       kwd = kwd.concat(escape(tempStr[j].split(newSeparator2)[1])); // 날짜
		                       	   }
		                       	   kwd = kwd.concat(newSeparator);
		                           if(j == tempStr.length-1){
		                               kwd = kwd.concat(escape(_kwd));
		                               kwd = kwd.concat(newSeparator2);
		                               kwd = kwd.concat(escape(today));
		                           }
		                        }
		                    }
		                }
		            }
		        // 쿠키가 한개밖에 없을 경우
		        }else{ 
		            // 현재 한개와 키워드를 체크 한다.            
		            if(unescape(newCookieStr.split(newSeparator2)[0]) == _kwd || unescape(newCookieStr.split(newSeparator2)[0]) == ""){
		                kwd = escape(_kwd) + newSeparator2 + escape(today);
		            }else{  
		                kwd = newCookieStr + newSeparator + escape(_kwd) + newSeparator2 + escape(today);
		            }            
		        }
		    }else{
		      kwd = escape(_kwd) + newSeparator2 + escape(today);
		    }
		    elandmall.util.setCookie({ name: resultNm, value: kwd, age: 365*10, secure: false, path: "/" });
		},
		delKwdLst: function( obj ){
			var kwd = obj.getAttribute("data-kwd");
			var cookie_str = null;
			var temp_str = null;
			var rtn_str = "";
			var sepaLen = separator.length;
			var newSepaLen = newSeparator.length;
			
			if (elandmall.util.getCookie(resultNm) != null) {
				cookie_str = elandmall.util.getCookie(resultNm);
				temp_str = cookie_str.split(separator);  // 구분자 2개 혼용 ("__", "|")
				
		        for(var i = 0; i < temp_str.length; i++){ // 배포일 이전 데이터는 날짜를 배포일로 일괄적으로 셋팅
		        	if( temp_str[i].split(newSeparator2).length < 2 ){
		        		temp_str[i] = temp_str[i].concat(":10.23");
		        	}
		        }
				
				for(var i = 0; i < temp_str.length; i++){
			    	if(temp_str[i].indexOf(newSeparator) > -1){ // 있다면
			    		var newTempStr = new Array();
			    		newTempStr = temp_str[i].split(newSeparator); // 임시로 저장한다.
			    		temp_str.splice(i,1);
			    		temp_str = temp_str.concat(newTempStr);	// "|"구분자로 나눈 값들을 붙여준다.
			    	}
			    }
				if (temp_str.length > 0) {  
					for (var i=0; i<temp_str.length; i++) {
						var temp_kwd = unescape(temp_str[i].split(newSeparator2)[0]);
						if(unescape(temp_str[i].split(newSeparator2)[0]).indexOf("\\") > -1 ){ // 역슬래시가 있다면
							temp_kwd = temp_kwd.replace(/\\/ig,"\\\\");
						}
						if (temp_kwd != kwd) {
		                	if(i == temp_str.length-1){
		                		rtn_str +=  temp_str[i];
		                	}else{
		                		rtn_str +=	temp_str[i] + newSeparator;
		                	}
		                }
					}
				}		
				
				// 마지막 쿠키값을 지울경우 separator 지우는 로직
				if(rtn_str.indexOf(separator) > rtn_str.indexOf(newSeparator)){ // 마지막 쿠키값 구분자가 "__"인 경우
					if(rtn_str.length > sepaLen){
						if(rtn_str.substring(rtn_str.length-sepaLen, rtn_str.length) == separator){
							rtn_str = rtn_str.substring(0,rtn_str.length-sepaLen);
						}
					}
				}else{
					if(rtn_str.length > newSepaLen){ // 마지막 쿠키값 구분자가 "|"인 경우
						if(rtn_str.substring(rtn_str.length-newSepaLen, rtn_str.length) == newSeparator){
							rtn_str = rtn_str.substring(0,rtn_str.length-newSepaLen);
						}
					}
				}
				
				elandmall.util.setCookie({ name: resultNm, value: rtn_str, age: 365*10, secure: false, path: "/" });
			}
			fnsearchresent.drawSearchedKwd();
		},
		delKwdLst2: function( kwd ){
			var cookie_str = null;
			var temp_str = null;
			var rtn_str = "";
			var sepaLen = separator.length;
			var newSepaLen = newSeparator.length;
			
			if (elandmall.util.getCookie(resultNm) != null) {
				cookie_str = elandmall.util.getCookie(resultNm);
				temp_str = cookie_str.split(separator);
				
		        for(var i = 0; i < temp_str.length; i++){ // 배포일 이전 데이터는 날짜를 배포일로 일괄적으로 셋팅
		        	if( temp_str[i].split(newSeparator2).length < 2 ){
		        		temp_str[i] = temp_str[i].concat(":10.23");
		        	}
		        }
				
			    for(var i = 0; i < temp_str.length; i++){
			    	if(temp_str[i].indexOf(newSeparator) > -1){
			    		var newTempStr = new Array();
			    		newTempStr = temp_str[i].split(newSeparator);
			    		temp_str.splice(i,1);
			    		temp_str = temp_str.concat(newTempStr);
			    	}
			    }
				
				if (temp_str.length > 0) {  
					for (var i=0; i<temp_str.length; i++) {
						if (unescape(temp_str[i].split(newSeparator2)[0]) != kwd) {
		                	if(i == temp_str.length-1){
								rtn_str +=  temp_str[i];
		                	}else{
								rtn_str +=	temp_str[i] + newSeparator;
		                	}
		                }
					}
				}		
				
				// 마지막 쿠키값을 지울경우 separator 지우는 로직
				if(rtn_str.indexOf(separator) > rtn_str.indexOf(newSeparator)){
					if(rtn_str.length > sepaLen){
						if(rtn_str.substring(rtn_str.length-sepaLen, rtn_str.length) == separator){
							rtn_str = rtn_str.substring(0,rtn_str.length-sepaLen);
						}
					}
				}else{
					if(rtn_str.length > newSepaLen){
						if(rtn_str.substring(rtn_str.length-newSepaLen, rtn_str.length) == newSeparator){
							rtn_str = rtn_str.substring(0,rtn_str.length-newSepaLen);
						}
					}
				}
			}
			return rtn_str;
		},
		delKwdLstAll: function(){
			var cookieName = resultNm;
			var expireDate = new Date();  
			 //어제 날짜를 쿠키 소멸 날짜로 설정한다.  
			 expireDate.setDate( expireDate.getDate() - 1 );  
			 document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";  
			 fnsearchresent.drawSearchedKwd();
		},
		drawSearchedKwd: function(){
			var temp_val = "";
		    var temp_str = null;
		    var mySearchKwdHtml = "";					//헤더 검색창 최근검색어용
		    var mySpSearchKwdHtml = "";					//슈펜헤더 검색창 최근검색어용
		    var myKimsSearchKwdHtml = "";				//킴스헤더 검색창 최근검색어용
		    var maxHeaderResentKwd = 8;  				//헤더 검색레이어 최근검색어 노출 개수
		    var count = 0;
		    var rct_kwd = "";

		    // KIMS 최근검색어 최대 30개
			if (elandmall.global.disp_mall_no == "0000045") {
				maxHeaderResentKwd = 30;
			}

		    if (elandmall.util.getCookie(resultNm) != null) { 
		    	temp_val = elandmall.util.getCookie(resultNm);
		    	if(temp_val != ""){
			    	temp_str = temp_val.split(separator);
		      	    for(var i = 0; i < temp_str.length; i++){
		        		if(temp_str[i].indexOf(newSeparator) > -1){
		        			var newTempStr = new Array();
		        			newTempStr = temp_str[i].split(newSeparator);
		        			temp_str.splice(i,1);
		       		 		temp_str = temp_str.concat(newTempStr);
		       		 	}
		        	}
			        if (temp_str.length > 0 ) {         	
			        	mySearchKwdHtml += "<ul>";
			        	myKimsSearchKwdHtml += "<ul>";
			        	mySpSearchKwdHtml += "<div class=\"sch_tit\">";
			        	mySpSearchKwdHtml += "	<strong>최근 검색어</strong>";
			        	mySpSearchKwdHtml += "	<span><button type=\"button\" class=\"del\" onclick=\"fnsearchresent.delKwdLstAll();\">전체삭제</button></span>";
			        	mySpSearchKwdHtml += "</div>";
			        	mySpSearchKwdHtml += "<ul>";
		            	for (var i = temp_str.length-1; i >= 0; i--) {
		            		
		            		if(count < maxHeaderResentKwd){
		            			rct_kwd = unescape(temp_str[i].split(newSeparator2)[0]);
				            	
				            	rct_kwd = rct_kwd.replace(/\"/g,"&quot;");
				            	rct_kwd = rct_kwd.replace(/\'/g,"&#39;");
				            	rct_kwd = rct_kwd.replace(/\\/g,"\\\\");
				            	
				            	mySearchKwdHtml += "<li>";
				            	myKimsSearchKwdHtml += "<li>";
				            	mySpSearchKwdHtml += "<li>";
				            	var titileSc = temp_str[i];
				            	if(titileSc.includes("brandKwd_") == true){
				            		titileSc = titileSc.split("_")[2];
				            	}
				            	if(shortFlag == true && unescape(titileSc.split(newSeparator2)[0]).length > shortLen ){
				            	 
				            		var title = unescape(titileSc.split(newSeparator2)[0]).substring(0,shortLen);
				            		mySearchKwdHtml += "<a href=\"javascript:;\" onclick=\"fnsearch.dftSchKwd2(this);\" data-kwd=\""+ rct_kwd + "\" data-ga-tag=\"MW_검색팝업||최근검색어||" + title + "\" class=\"d_links\"><span>" +title+ "...</span></a>";
				            		myKimsSearchKwdHtml += "<a href=\"javascript:;\" onclick=\"fnsearch.dftSchKwd2(this);\" data-kwd=\""+ rct_kwd + "\" data-ga-tag=\"MW_KC_검색||최근검색어||" + title + "\" class=\"d_links\"><span>" +title+ "...</span></a>";
				            		mySpSearchKwdHtml += "<button type=\"button\" onclick=\"fnsearch.dftSchKwd2(this);\" class=\"kwd\" data-kwd=\""+ rct_kwd + "\" data-ga-tag=\"MW_SH_검색팝업||최근_검색어||" + rct_kwd + "\">"+unescape(temp_str[i].split(newSeparator2)[0]).substring(0,shortLen)+"...</button>"
				            	}else{
				            		var title = unescape(titileSc.split(newSeparator2)[0]);
				            		mySearchKwdHtml += "<a href=\"javascript:;\" onclick=\"fnsearch.dftSchKwd2(this);\" data-kwd=\""+ rct_kwd + "\" data-ga-tag=\"MW_검색팝업||최근검색어||" + title +"\" class=\"d_links\"><span>" +title+ "</span></a>";
				            		myKimsSearchKwdHtml += "<a href=\"javascript:;\" onclick=\"fnsearch.dftSchKwd2(this);\" data-kwd=\""+ rct_kwd + "\" data-ga-tag=\"MW_KC_검색||최근검색어||" + title +"\" class=\"d_links\"><span>" +title+ "</span></a>";
				            		mySpSearchKwdHtml += "<button type=\"button\" onclick=\"fnsearch.dftSchKwd2(this);\" class=\"kwd\" data-kwd=\""+ rct_kwd + "\" data-ga-tag=\"MW_SH_검색팝업||최근_검색어||" + rct_kwd + "\">"+unescape(temp_str[i].split(newSeparator2)[0])+"</button>"
				            	}
				            	mySearchKwdHtml += "<button type=\"button\" class=\"del\" onclick=\"fnsearchresent.delKwdLst(this);\" data-kwd=\""+ rct_kwd + "\" ><span class=\"ir\">삭제</span></button></li>";
				            	myKimsSearchKwdHtml += "<button type=\"button\" class=\"del\" onclick=\"fnsearchresent.delKwdLst(this);kimsHeaderResentKwdHide();\" data-kwd=\""+ rct_kwd + "\" ><span class=\"ir\">삭제</span></button></li>";
				            	mySpSearchKwdHtml += "<button type=\"button\" class=\"del\" onclick=\"fnsearchresent.delKwdLst(this);\" data-kwd=\""+ rct_kwd + "\" ><span class=\"ir\">삭제</span></button></li>";
				            	mySearchKwdHtml += "</li>";
				            	myKimsSearchKwdHtml += "</li>";
				            	mySpSearchKwdHtml += "</li>";
		            		}
			            	count++;
			            }
			            mySearchKwdHtml += "</ul>";
			            myKimsSearchKwdHtml += "</ul>";
			            mySpSearchKwdHtml += "</ul>";
			            
			            
			            mySearchKwdHtml += "<div class=\"all_clear\"><a href=\"javascript:;\" onclick=\"fnsearchresent.delKwdLstAll();\">전체 삭제</a></div>";
			        }	           
		    	}
		    }    
		    if(mySearchKwdHtml == "")	mySearchKwdHtml = "<div class=\"msg\">최근 검색어 내역이 <em>없습니다.</em></div>";
		    if(mySpSearchKwdHtml != "")  {
		    	$("#spHeaderResentKwd").show();
		    }
		    $("#headerResentKwd").html(mySearchKwdHtml);								//헤더 검색창 최근검색어용
		    $("#spHeaderResentKwd").html(mySpSearchKwdHtml);							//슈펜헤더 검색창 최근검색어용
		    $("#kimsHeaderResentKwd").html(myKimsSearchKwdHtml);						//킴스헤더 검색창 최근검색어용
		}
	}
})(jQuery);