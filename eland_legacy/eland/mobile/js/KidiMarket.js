;(function($) {
	
	/**
	 * app에서 업로드된 위치 경로 주기
	 */
	elandmall.app = {
		params : {},
		init:function(callback){
	    	elandmall.app.params["callback"] = callback;
	    },
	    downImgView : function( file_path, ori_file_nm){
	    	elandmall.app.params.callback(file_path, ori_file_nm);
	    },
	    downImgViewNew : function( file_path, ori_file_nm, file_key){
	    	elandmall.app.params.callback(file_path, ori_file_nm, file_key);
	    },
		elandApp : function(appver){
			if(elandmall.global.app_cd != "" && $.type(appver) != "undefined" && parseInt(appver) >= 120 ){
				return true;
			}else{
				return false;
			}
		}, 
		backElandBridge : function( ){
			var version = '';
			if($.type(elandmall.global.app_version) != 'undefined'){
				version = elandmall.global.app_version;
			}
			if(this.elandApp(version)){
				location.href="elandbridge://backBrowser/";
			}else{
				history.back();
			}
		},
		topBannerHeight : function(){
			var v_height = 95;
			var version = '';
			if($.type(elandmall.global.app_version) != 'undefined'){
				version = elandmall.global.app_version;
			}
			if(this.elandApp(version)){
				v_height = 45;
			}
			return v_height;
		}
			
	};
	
	elandmall.kidiMarketDisp = {

		      clickEvent : function (pin) {

		    	  var fnMoveLinkUrl = function(pin){
			  			var param =  "";
			  			var linkUrl = "";
			  			var pattern =/^https/gi;
			  			var pattern2 =/^javascript/gi;
			  			var pattern3 = /\/custcenter\/.*/;
			  			var pattern4 = /\/mypage\/.*/;

			  			if($.type(pin.param) !="undefined"){
			  			    $.each(pin.param, function(name, data) {
			  			    	 if(param == ""){
			  			    		 param = name +'='+ data ;
			  			    	 }else{
			  			    		 param += '&'+name +'='+ data ;
			  			    	 }
			  			    });
			  			}

			  			if((pattern2.test(pin.url))){
			  				eval(pin.url);
			  			} else {
			  				if(pattern3.test(pin.url) ){
				  				linkUrl = "https:" + elandmall.global.base_domain_url + pattern3.exec(pin.url);
				  			}else if(pattern4.test(pin.url)){
				  				linkUrl = elandmall.global.ssl_domain_url + pattern4.exec(pin.url);
				  			}else if(!(pattern.test(pin.url)) ){
				  				linkUrl = elandmall.kidiMarketUtil.newHttps(pin.url);
				  			}else{
				  				linkUrl = pin.url;
				  			}
			  				if(param != ""){
				  				if(linkUrl.lastIndexOf("?") <= -1){
				  					linkUrl = linkUrl + "?" + param;
				  				}else{
				  					linkUrl = linkUrl + "&" + param;
				  				}
				  			}
				  			if(pin.openwinyn && pin.openwinyn == "Y"){
				  				window.open(linkUrl);
				  			}else{
				  				location.href = linkUrl;
				  			}
			  		   }
			  	}

				//컨텐츠 처리 하기
				if(pin.tr_yn && pin.tr_yn == 'Y'){
					elandmall.tracking.fireClick(pin);
				}

				if(pin.conts_form_cd  == "110") {

					//모바일 history back
					if( typeof(pin.param) != "undefined" &&  pin.param.back_use_yn == "Y"){
						elandmall.history.fnPageMovePrev('', pin.param.page_idx, pin.param);
					}

					//기획전 이동 rel_no : 기획전 번호
					elandmall.goods.scrollSav();

					if(pin.url && pin.url != "") {
						fnMoveLinkUrl(pin);

					} else {
						var disp_type_cd = pin.disp_type_cd;
						
						if(disp_type_cd == "10"){ //일반일 경우
							elandmall.kidiMarketShop.goOrgPlanShop({disp_ctg_no: pin.move_cont_no});
						}else{
							elandmall.kidiMarketShop.goPlanShop({disp_ctg_no: pin.move_cont_no});
						}
					}

				}else if(pin.conts_form_cd  == "120") {

					//전시카테고리 이동  rel_no : 브랜드 번호
				}else if(pin.conts_form_cd  == "160") {
					if(pin.brandIndexYn != null && pin.brandIndexYn == 'Y'){
						elandmall.brand.goBrandIndexShop(pin.move_cont_no);
					}else{
						elandmall.brand.goBrandShop(pin.move_cont_no);
					}

					//브랜드 이동 rel_no : 브랜드 번호
				}else if(pin.conts_form_cd  == "130") { //배너

					//배너 종류
					if(pin.banner_kind_cd == "20" || pin.banner_kind_cd == "21") {//이벤트
						if($.type(pin.url) !="undefined" && pin.url  != ""){
							fnMoveLinkUrl(pin);
						}else{
							//이벤트 링크 필요
							elandmall.event.goEventConts({event_no: pin.move_cont_no});
						}
					}else if(pin.banner_kind_cd == "51" && ($.type(pin.url) =="undefined" || pin.url  == "")){	//브랜드

						elandmall.brand.goBrandShop(pin.move_cont_no);
					}else if(pin.banner_kind_cd == "70"){	//상품배너
						elandmall.goods.goDetail({goods_no:pin.move_cont_no, sale_area_no:pin.sale_area_no, tr_yn:pin.tr_yn, conts_dist_no:pin.conts_dist_no, conts_divi_cd:pin.conts_divi_cd, rel_no:pin.rel_no, rel_divi_cd:pin.rel_divi_cd});
					}else{
						if($.type(pin.url) =="undefined" || pin.url  == ""){
							return;
						}
						fnMoveLinkUrl(pin);
					}
				}
		    }
		};
	
	//[START] DISPCTG
	elandmall.kidiMarketDispctg = {

		//카테고리 경로 정보 불러오기.
		fnCategoryPathInfo : function(pin) {
			$.ajax({
				url : "/dispctg/getDsDispCtgJson.action",
				data : pin,
				type : "post",
				dataType : "json",
				success : function(data){

					if(data != null){
						//링크 URL
						if("20" == data.TEMPL_TYPE_CD && (data.LINK_URL != null && data.LINK_URL != "" ) ){
							//새창
							if("20" == data.LINK_FRAME_TYPE_CD){
								//topas수정
								var agent = navigator.userAgent.toLowerCase();
								if(agent.indexOf("msie") == -1 && agent.indexOf("trident") == -1) {
									if(data.LINK_URL.indexOf('topas') > -1){
										var popup = window.open(data.LINK_URL,"TOPAS");
										if(popup == null){
											alert('팝업이 차단됐습니다.');
											return false;
										}
									} else {
										window.open(data.LINK_URL);
									}
								}else{
									window.open(data.LINK_URL);
								}
							}else{
								window.location.href = data.LINK_URL;
							}
							//매장 이동	, 매장 이동 코드 : 30
						}else if("30" == data.TEMPL_TYPE_CD ){
							//기획전
							if("40" == data.MOVE_SHOP_TYPE_CD){
							    
							    if(disp_type_cd == "10"){ //일반일 경우
									elandmall.kidiMarketShop.goOrgPlanShop({disp_ctg_no: pin.move_cont_no});
								}else{
									elandmall.kidiMarketShop.goPlanShop({disp_ctg_no : data.MOVE_DISP_CTG_NO});
								}
							}else if("10" == data.MOVE_SHOP_TYPE_CD){
								if(pin.kidiBestYn == "Y"){
									elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.MOVE_DISP_CTG_NO, kidimarket_sub_kidibest_yn : pin.kidiBestYn});
								}else{
									elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.MOVE_DISP_CTG_NO});
								}								
							}
						//템플릿 , 중/소 카테고리는 해당 페이지로 이동 해야 함, 브랜드카테고리로 이동 처리  템플릿 유형코드 : 40
						}else if("40" == data.TEMPL_TYPE_CD ||  "20" == data.DISP_TYPE_CD || parseInt(data.DEPTH_NO) >= 3){
							//브랜드일 경우
							if("20" == data.DISP_TYPE_CD ){
								elandmall.brand.goBrandShop(data.BRAND_NO, data.DISP_CTG_NO);
							}else{
								if(pin.gnb_num != null && ""!=pin.gnb_num){
									if(pin.kidiBestYn == "Y"){
										elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO, gnb_num : pin.gnb_num, kidimarket_sub_kidibest_yn : pin.kidiBestYn});
									}else{
										elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO, gnb_num : pin.gnb_num});
									}	
								}else{
									if(pin.kidiBestYn == "Y"){
										elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO, kidimarket_sub_kidibest_yn : pin.kidiBestYn});
									}else{
										elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO});
									}
								}
							}
						//대분류 > 연결없음 일 경우 카테고리 이동 [NGCPO-5769]
						}else if("10" == data.TEMPL_TYPE_CD && data.DEPTH_NO == 2){
							if(pin.kidiBestYn == "Y"){
								elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO, kidimarket_sub_kidibest_yn : pin.kidiBestYn});
							}else{
								elandmall.kidiMarketDispctg.goDispctg({disp_ctg_no : data.DISP_CTG_NO});
							}
						}
					}
				}
			});
		},

		//카테고리 이동 하기
		goDispctg : function(pin){
			var param =  "";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ; 
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});
			
			if(elandmall.global.scheme == "https"){
	    		location.href = elandmall.kidiMarketUtil.newHttps("https:" + elandmall.global.kidimarket_mo_domain_url+"/kidimarket/initKidiMarketDispCtg.action?"+param);
	    	}else{
	    		location.href = elandmall.kidiMarketUtil.newHttps("/kidimarket/initKidiMarketDispCtg.action?"+param);
	    	}	 
		},
		//모바일 메인 스피닝 카테고리
		goMainSpnCtg : function(ctg_gubun){
			location.href = elandmall.kidiMarketUtil.newHttps("/dispctg/initMainSpnCtg.action?ctg_gubun="+ctg_gubun);
		}
	};
	//[END] DISPCTG
	
	//[START] SHOP
	elandmall.kidiMarketShop = {

		//기획전 메인으로 이동
		goPlanShopMain : function(pin) {
			var param = "";
			var linkUrl = "/kidimarket/initKidiMarketPlanShop.action";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ encodeURI(data);
				 }else{
					 param += '&'+name +'='+ encodeURI(data);
				 }
			});
			if(param != ""){
				linkUrl = linkUrl + "?" + param;
			}
			
	    	location.href = elandmall.kidiMarketUtil.newHttps(linkUrl);
		},
		
		//일반 기획전 상세
		goOrgPlanShop : function(pin) {
			var param =  "";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});
			
			//PC
			if(webSizeMobileYn() != "Y"){
				//만약 통합몰 헤더로 이동해야 된다면 "300" -> "100" 으로 변경
				//만약 기획전이 등록된 몰의 헤더로 이동해야 한다면 기획전 정보를 조회하여 각각 몰에 대한 정보를 가져온 뒤 일반 기획전 전용으로 type 구분자 하나 더 추가하여 처리해야함
				goOtherkidiSite("/shop/initPlanShop.action","300",param);
			//모바일	
			}else{
				//만약 통합몰 헤더로 이동해야 된다면 kidiMarketUtil.http 에서 /shop/initPlanShop.action 일경우 분기처리 해야함
				location.href = elandmall.kidiMarketUtil.newHttps("/shop/initPlanShop.action?"+param);	
			}
			
		},
		
		//키디마켓 기획전 상세
		goPlanShop : function(pin) {
			var param =  "";

			$.each(pin, function(name, data) {
				if(param == ""){
					 param = name +'='+ data ;
				 }else{
					 param += '&'+name +'='+ data ;
				 }
			});
			
			location.href = elandmall.kidiMarketUtil.newHttps("/kidimarket/initKidiMarketPlanShop.action?"+param);
		}
	};
	//[END] SHOP
	
	//[START] UTIL
	elandmall.kidiMarketUtil = {
		toCurrency: function(amount) {	//노출되는 금액에 대해 공통사용
			amount = String(amount);
			var data = amount.split('.');
			var sign = "";
			var firstChar = data[0].substr(0,1);
			if(firstChar == "-"){
				sign = firstChar;
				data[0] = data[0].substring(1, data[0].length);
			};
			data[0] = data[0].replace(/\D/g,"");
			if(data.length > 1){
				data[1] = data[1].replace(/\D/g,"");
			};
			firstChar = data[0].substr(0,1);
			//0으로 시작하는 숫자들 처리
			if(firstChar == "0"){
				if(data.length == 1){
					return sign + parseFloat(data[0]);
				};
			};
			var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
			data[0] += '.';
			do {
				data[0] = data[0].replace(comma, '$1,$2');
			} while (comma.test(data[0]));

			if (data.length > 1) {
				return sign + data.join('');
			} else {
				return sign + data[0].split('.')[0];
			};
		},
		getCookie: function(name) {
			var nameOfCookie = name + "=";
			var x = 0;
			while ( x <= document.cookie.length ){
				var y = (x+nameOfCookie.length);
				if ( document.cookie.substring( x, y ) == nameOfCookie ) {
					if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
						endOfCookie = document.cookie.length;
					if(name == "keywords"){ // '최근검색어'구분자를 제외하고 인코딩된 값 받음
						return document.cookie.substring( y, endOfCookie );
					}else{
						return unescape( document.cookie.substring( y, endOfCookie ) );
					}
				}
				x = document.cookie.indexOf( " ", x ) + 1;
				if ( x == 0 )
					break;
			}
			return "";
		},
		setCookie: function(p) {
			p = $.extend({
				age: null,
				path: "/",
				domain: null,
				secure: false
			}, p);

			var date = new Date();
			date.setDate(date.getDate() + p.age);
			var p_value = "";
			if(p.name == "keywords"){ // '최근검색어'구분자를 제외하고 인코딩된 값 받음
				p_value = p.value;
			}else{
				p_value = escape(p.value);
			}
			
			document.cookie =
					p.name + "=" + p_value +
					((p.age == null) ? "" : ("; expires=" + date.toGMTString())) +
					((p.path == null) ? "" : ("; path=" + p.path)) +
					((p.domain == null) ? "" : ("; domain=" + p.domain)) +
					((p.secure == true) ? "; secure" : "");
		},
		https: function(uri) {	//보안 페이지로 이동
			
			//PC, 모바일 페이지 반응형 처리 위해 사이즈 체크
			//마이페이지와 로그인 처리는 mo의 was에서 처리되게 유도(마이페이지는 반응형 웹으로 PC모드엔 화면 존재하지 않음/로그인 세션은 mo에서 만들어져야 유지 가능, PC로 넘어가는 경우엔 로그인 gate사용 )
			if(webSizeMobileYn() != "Y" && uri.indexOf("/kidimarket/initMypageMain.action") == -1 && uri.indexOf("/login/initLoginLayerProc.action") == -1){ //PC
				var http_domain = elandmall.kidiMarketUtil.getCookie(elandmall.global.http_domain_cookie_name);
				if (elandmall.global.scheme != "https" && http_domain == "") {	//http에서 https로 이동할 경우만 셋팅 하도록 한다.
					uri = "/" + uri;
					uri = uri.replace(/\/{2,}/g, "/");
					elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value: location.host, path: "/" });
				};
				return elandmall.global.https_pc_url + uri;
			}else{ //모바일
				var http_domain = elandmall.kidiMarketUtil.getCookie(elandmall.global.http_domain_cookie_name);
				if (elandmall.global.scheme != "https" && http_domain == "") {	//http에서 https로 이동할 경우만 셋팅 하도록 한다.
					uri = "/" + uri;
					uri = uri.replace(/\/{2,}/g, "/");
					elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value: location.host, path: "/" });
				};
				return elandmall.global.https_url + uri;
			}			
		},
		newHttps: function(uri) {
			// FULL URL 로 들어올 경우 체크안함
			var pattern =/^(https?:\/\/)/;

			//PC, 모바일 페이지 반응형 처리 위해 사이즈 체크
			if(webSizeMobileYn() != "Y"){ //PC
				if(!(pattern.test(uri)) ) {

					//전시를 제외하고는 모두 기본도메인이다. ( 매장위치안내 추가 16.06.29)
					uri = "/" + uri;
					uri = uri.replace(/\/{2,}/g, "/");
					pattern =/(dispctg*|search*|shop*|goods*|common*|mallinfo*|event*|kidimarket*)/;
					if(!pattern.test(uri)) {
						return "https:" + elandmall.global.base_pc_domain_url + uri;
					} else {
						var http_domain = elandmall.kidiMarketUtil.getCookie(elandmall.global.http_domain_cookie_name);
						if(location.host != http_domain) http_domain ="";

						//쿠키가 없다면 현재 도메인 인 경우 http=>http 이동시 필요
						if($.trim(http_domain) == "") {
							if(elandmall.global.scheme == "https" && (uri.indexOf("/goods/initGoodsDetail.action") == -1 && uri.indexOf("/shop/initPlanShop.action") == -1)) {
								return "https://" + location.host + uri;
							} else if (uri.indexOf("/goods/initGoodsDetail.action") != -1 || uri.indexOf("/shop/initPlanShop.action") != -1){
							    return "https:" + elandmall.global.kidimarket_pc_domain_url + uri;
							} else {
							    return "https://" + elandmall.global.base_pc_domain_url + uri;
							}
						} else {
							//한번클리어 처리한다.
							elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
							return "https://" + http_domain + uri;
						}
					}
				} else {
					//http이기에 쿠키clear 한다.
					elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
					
					// http 만 https로 변경
					return uri.replace(/^(https?:\/\/)(.+)/, "https://$2");
				}
			}else{	//모바일
				if(!(pattern.test(uri)) ) {

					//전시를 제외하고는 모두 기본도메인이다. ( 매장위치안내 추가 16.06.29)
					uri = "/" + uri;
					uri = uri.replace(/\/{2,}/g, "/");
					pattern =/(dispctg*|search*|shop*|goods*|common*|mallinfo*|event*|kidimarket*)/;
					if(!pattern.test(uri)) {
						return "https:" + elandmall.global.base_domain_url + uri;
					} else {
						var http_domain = elandmall.kidiMarketUtil.getCookie(elandmall.global.http_domain_cookie_name);
						if(location.host != http_domain) http_domain ="";

						//쿠키가 없다면 현재 도메인 인 경우 http=>http 이동시 필요
						if($.trim(http_domain) == "") {
							if(elandmall.global.scheme == "https" && (uri.indexOf("/goods/initGoodsDetail.action") == -1 && uri.indexOf("/shop/initPlanShop.action") == -1)) {
								return "https://" + location.host + uri;
							} else if (uri.indexOf("/goods/initGoodsDetail.action") != -1 || uri.indexOf("/shop/initPlanShop.action") != -1){
							    return "https:" + elandmall.global.kidimarket_mo_domain_url + uri;
							} else {
							    return "https://" + elandmall.global.base_domain_url + uri;
							}
						} else {
							//한번클리어 처리한다.
							elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
							return "https://" + http_domain + uri;
						}
					}
				} else {
					//http이기에 쿠키clear 한다.
					elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
					
					// http 만 https로 변경
					return uri.replace(/^(https?:\/\/)(.+)/, "https://$2");
				}
			}
		},
		http: function(uri) {		//비보안 페이지로 이동
			//uri 이 http로 들어오는 url경로가 존재한다면, 아래 로직 체크 없이 그냥 return처리한다.
			var pattern =/^(http:\/\/)/;

			//PC, 모바일 페이지 반응형 처리 위해 사이즈 체크
			if(webSizeMobileYn() != "Y"){ //PC
				if(!(pattern.test(uri)) ) {

					//전시를 제외하고는 모두 기본도메인이다. ( 매장위치안내 추가 16.06.29)
					uri = "/" + uri;
					uri = uri.replace(/\/{2,}/g, "/");
					pattern =/(dispctg*|search*|shop*|goods*|common*|mallinfo*|event*|kidimarket*)/;

					if(!pattern.test(uri)) {
						return "http:" + elandmall.global.base_pc_domain_url + uri;
					} else {
						var http_domain = elandmall.kidiMarketUtil.getCookie(elandmall.global.http_domain_cookie_name);
						if(location.host != http_domain) http_domain ="";

						//쿠키가 없다면 현재 도메인 인 경우 http=>http 이동시 필요
						if($.trim(http_domain) == "") {
							if(elandmall.global.scheme == "https" && uri != "/goods/initGoodsDetail.action") {
								//기본으로 통합몰 메인으로 이동처리 한다.
								return "http:" + elandmall.global.base_pc_domain_url + uri;
							} else if (uri == "/goods/initGoodsDetail.action" || uri.indexOf("/shop/initPlanShop.action") != -1){
							    return "http:" + elandmall.global.kidimarket_pc_domain_url + uri;
							} else {
							    return "http://" + location.host + uri;
							}
						} else {
							//한번클리어 처리한다.
							elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
							return "http://" + http_domain + uri;
						}
					}
				} else {
					//http이기에 쿠키clear 한다.
					elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
					return uri;
				}
			}else{ //모바일
				if(!(pattern.test(uri)) ) {

					//전시를 제외하고는 모두 기본도메인이다. ( 매장위치안내 추가 16.06.29)
					uri = "/" + uri;
					uri = uri.replace(/\/{2,}/g, "/");
					pattern =/(dispctg*|search*|shop*|goods*|common*|mallinfo*|event*|kidimarket*)/;

					if(!pattern.test(uri)) {
						return "http:" + elandmall.global.base_domain_url + uri;
					} else {
						var http_domain = elandmall.kidiMarketUtil.getCookie(elandmall.global.http_domain_cookie_name);
						if(location.host != http_domain) http_domain ="";

						//쿠키가 없다면 현재 도메인 인 경우 http=>http 이동시 필요
						if($.trim(http_domain) == "") {
							if(elandmall.global.scheme == "https" && uri != "/goods/initGoodsDetail.action") {
								//기본으로 통합몰 메인으로 이동처리 한다.
								return "http:" + elandmall.global.base_domain_url + uri;
							} else if (uri == "/goods/initGoodsDetail.action"  || uri.indexOf("/shop/initPlanShop.action") != -1){
							    return "http:" + elandmall.global.kidimarket_mo_domain_url + uri;
							} else {
							    return "http://" + location.host + uri;
							}
						} else {
							//한번클리어 처리한다.
							elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
							return "http://" + http_domain + uri;
						}
					}
				} else {
					//http이기에 쿠키clear 한다.
					elandmall.kidiMarketUtil.setCookie({ name: elandmall.global.http_domain_cookie_name, domain: elandmall.global.cookie_domain, value:'', path: "/" });
					return uri;
				}
			}			
		},
		ga : function(category, action, label){
			try{
			   ga('send', 'event', category, action, label);
			}catch(e){

			}
		},
		openWin : function(p){  //새창열기
			p.url = elandmall.kidiMarketUtil.https(p.url);
			window.open(p.url,p.title);
		},
		toSpCharRemove : function(obj){ 	// 특수문자 제거
			var regExp = /[\{\}\[\]\/?;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
			var _input = $(obj);
			var str = _input.val();

	        if ( regExp.test(str) ){
	        	str = str.replace(regExp, "");
	        }
	        _input.val(str);
		},
		showBarcode : function(p,s,t) {	//바코드
			//var btypes = ["ean8","ean13","upc","std25","int25","code11","code39","code93","code128","codabar"];
			var btype = "code128";
			if(p == null || p == "") { return; }
			if(p.length <= 0 ) { return; }
			//var regExp = /^[0-9]+$/;
			//if(regExp.test(p)){
				//btype = "ean8";
			//}else {
				//btype = "code128";
			//}
			if(typeof(t) == undefined || typeof(t) == "undefined") { 
				target = $("#barcodeTarget");
				if(typeof(target) == undefined || typeof(target) == "undefined") { return; }
			}else {
				if(typeof(t) == "string"){
					target = $("#"+t);
				}else {
					target = t;
				}
				
			}
			
			if ($.type(target) != "object") {
				return;		
			};
			
			var settings = {};
			if(typeof(s) != undefined || typeof(s) != "undefined" ){
				$.extend(settings,s);
			}else {
				  settings = {
						  barWidth: 0.7,
					      barHeight: 42,
					      moduleSize: 1,
					      showHRI: true,
					      addQuietZone: true,
					      marginHRI: 4,
					      bgColor: "#FFFFFF",
					      color: "#333",
					      fontSize: 12,
					      output: "css",
					      posX: 0,
					      posY: 0
					};
			}
			
			$(target).html("").show().barcode(p,btype,settings);
		}
	};
	//[END] UTIL
	
	/* 헤더 링크 관련 부분
	 */
	elandmall.kidiMarketHdLink = function(slink) {
	    if(slink == "MAIN" ){	//통합몰 메인
	    	location.href =   elandmall.kidiMarketUtil.newHttps("https:" + elandmall.global.base_domain_url + "/main/initMain.action");
	    } else if(slink == "MALL_MAIN"){		//키디마켓 메인
	    	location.href = elandmall.kidiMarketUtil.newHttps("https:" + elandmall.global.kidimarket_mo_domain_url+"/main/initMain.action");    	
	    } else if (slink == "CART" ) {
	    	//PC
			if(webSizeMobileYn() != "Y"){
				goOtherkidiSite("/cart/initCart.action", "100", "");
			//모바일	
			}else{ 
				location.href = elandmall.kidiMarketUtil.newHttps("/cart/initCart.action");	
			}
	    	
		} else if(slink == "MYPAGE" ){
			elandmall.kidiMarketMypage.link.mypageMain();
		} else if(slink == "CUSTCENTER" ){
			elandmall.kidiMarketCustcenter.link.main();
		}
	}
	
	//마이페이지 
	elandmall.kidiMarketMypage = {
		goPage : function(url, p){
			elandmall.isLogin({login : function(){
				//PC
				if(webSizeMobileYn() != "Y" && url.indexOf("/kidimarket/initMypageMain.action") == -1){ 
					goOtherkidiSite(url,"110",elandmall.kidiMarketMypage.getParam(p));
				//모바일	
				}else{ 
					url += elandmall.kidiMarketMypage.getParam(p);
					location.href = elandmall.kidiMarketUtil.https(url);
				}
			}});
		},
		newPage : function(url, p){
			elandmall.isLogin({login : function(){
				url += elandmall.kidiMarketMypage.getParam(p);
				window.open(elandmall.kidiMarketUtil.https(url));
			}});
		},
		getParam : function(p){
			var param = "";
			if(p){
				for(key in p){
					if(param==''){
						param += "?"+key+"="+p[key];
					}else{
						param += "&"+key+"="+p[key];
					}
				}
			}

			return param;
		},
		link : {
			mypageMain : function(p){
				elandmall.kidiMarketMypage.goPage("/kidimarket/initMypageMain.action", p);
			},
			orderDeli : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyOrderDeliList.action", p);
			},
			orderClaim : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyOrderClaimList.action", p);
			},
			orderDocument : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initOrderDocument.action", p);
			},
			point : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyPointList.action", p);
			},
			coupon : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyCouponList.action", p);
			},
			deposit : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyDepositList.action", p);
			},
			eval : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyEvalList.action", p);
			},
			counsel : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyCounsel.action", p);
			},
			presentBox : function(p){
				location.href = elandmall.kidiMarketUtil.https("/mypage/initMyPresentCert.action");
			},
			wishlist : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyWishlist.action", p);
			},
			goodListLately : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/searchGoodListLately.action", p);
			},
			event : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initEventList.action", p);
			},
			dlvp : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyDlvpList.action", p);
			},
			refundAccount : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/getMyRefundAccount.action", p);
			},
			orderInfoReceive : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/getMyOrderInfoReceive.action", p);
			},
			modifyMemberInfo : function(login_id , membState, returnUrl){  //회원정보 수정 , 90일 변경, 임시 비밀번호

				if($.type(membState) == "undefined" ){
					membState = '10'
				}
				if($.type(returnUrl) == "undefined" ){
					
					//PC, 모바일 페이지 반응형 처리 위해 사이즈 체크
					if(webSizeMobileYn() != "Y"){ //PC
						returnUrl = 'https:'+elandmall.global.base_pc_domain_url+'/gate/memGate.action?entry_url='+elandmall.global.https_url+'/kidimarket/initMypageMain.action';
					}else{ //모바일
						returnUrl = 'https:'+elandmall.global.base_domain_url+'/gate/memGate.action?entry_url='+elandmall.global.https_url+'/kidimarket/initMypageMain.action';
					}
				}

				elandmall.kidiMarketOneclick.goPage("/member/updateMember",
					{
					authorization : elandmall.kidiMarketOneclick.getAuth(),
					siteCode : '10',
					accessToken : elandmall.kidiMarketOneclick.getAccessToken(),
					membState : membState,
					returnUrl : returnUrl},
					null,
					"post");
			},
			cancelNoPurchase  : function(login_id , membState, returnUrl){  //무실적

				if($.type(membState) == "undefined" ){
					membState = '90'
				}
				if($.type(returnUrl) == "undefined" ){
					//PC, 모바일 페이지 반응형 처리 위해 사이즈 체크
					if(webSizeMobileYn() != "Y"){ //PC
						returnUrl = "https:"+elandmall.global.base_pc_domain_url+'/gate/memCancelNoPurchaseLoginGate.action';
					}else{ //모바일
						returnUrl = "https:"+elandmall.global.base_domain_url+'/gate/memCancelNoPurchaseLoginGate.action';
					}
				}

				elandmall.kidiMarketOneclick.goPage("/member/cancelNoPurchase",
					{
					authorization : elandmall.kidiMarketOneclick.getAuth(),
					siteCode : '10',
					returnUrl : returnUrl},
					null,
					"get");
			},
			manageSnsAccount : function(login_id , membState, returnUrl){  // SNS 연동관리

				if($.type(membState) == "undefined" ){
					membState = '10'
				}
				if($.type(returnUrl) == "undefined" ){
					//PC, 모바일 페이지 반응형 처리 위해 사이즈 체크
					if(webSizeMobileYn() != "Y"){ //PC
						returnUrl = 'https:'+elandmall.global.base_pc_domain_url+'/gate/memGate.action?entry_url='+elandmall.global.https_url+'/kidimarket/initMypageMain.action';
					}else{ //모바일
						returnUrl = 'https:'+elandmall.global.base_domain_url+'/gate/memGate.action?entry_url='+elandmall.global.https_url+'/kidimarket/initMypageMain.action';
					}
				}

				elandmall.kidiMarketOneclick.goPage("/member/snsInterlinkManagement",
					{
					authorization : elandmall.kidiMarketOneclick.getAuth(),
					siteCode : '10',
					accessToken : elandmall.kidiMarketOneclick.getAccessToken(),
					membState : membState,
					returnUrl : returnUrl},
					null,
					"post");
			},
			myRestockList : function(p){
				elandmall.kidiMarketMypage.goPage("/mypage/initMyRestockList.action", p);
			}
		}
	};
	
	//고객센터
	elandmall.kidiMarketCustcenter = {
		link : {
			// 메인화면 링크
			main : function() {
				//PC
				if(webSizeMobileYn() != "Y"){ 
					goOtherkidiSite("/custcenter/initCustCenterMain.action", "100", "");
				//모바일	
				}else{ 
					location.href = elandmall.kidiMarketUtil.newHttps("/custcenter/initCustCenterMain.action");	
				}				
			}
		}

	};
	
	//원클릭에서 필요한 정보
   elandmall.kidiMarketOneclick = {
	   getAuth : function(){
		   var auth = "";
			$.ajax({
				url: "/member/authorization.action",
				dataType: "json",
				async: false,
				success: function(data) {
		            auth = data.authorization;
				}
	        });
		   return auth;
	    },
        getAccessToken : function(){
			   var accessToken = "";
				$.ajax({
					url: "/member/getAccessToken.action",
					dataType: "json",
					async: false,
					success: function(data) {
						accessToken = data.accessToken;
					}
		        });
			   return accessToken;
		},
        getOneClickauthSecret : function(){
			   var accessToken = "";
				$.ajax({
					url: "/member/oneClickauthSecret.action",
					dataType: "json",
					async: false,
					success: function(data) {
						accessToken = data.authorization;
					}
		        });
			   return accessToken;
		},
	    getLoginId : function(){
			   var sId = "";
				$.ajax({
					url: "/member/getLoginId.action",
					dataType: "json",
					async: false,
					success: function(data) {
						sId = data.login_id;
					}
		        });
			   return sId;
		    },
	    getFrontAuth : function(){
			   var auth = "";
				$.ajax({
					url: "/member/oneClickauth.action",
					dataType: "json",
					async: false,
					success: function(data) {
			            auth = data.authorization;
					}
		        });
			   return auth;
		    },
		goPage : function(url, parameters , winname, method){// 원클릭 화면 이동

			var $form = $('<form></form>');

			//새창 띄우기
			if($.type(winname) != "undefined" && winname != null) {
			    var win = window.open("", winname);
			    $form.attr("target", winname);
			}

			//모바일,PC 페이지 분기처리
			var oneclickDomain = elandmall.global.oneclick_domain_url; //모바일
			if(webSizeMobileYn() != "Y"){
				oneclickDomain = elandmall.global.oneclick_pc_domain_url; //PC
			}
			
			$form.attr("method", method).attr("action",oneclickDomain+url);
			$form.appendTo('body');
			var paramInput='';

			for(key in parameters){
				paramInput = "<input type='hidden' value='"+parameters[key]+"' name='"+key+"'/>";
				$form.append(paramInput);
			}
			$form.submit();
		},
		setWithdraw : function(){
			   var auth = "";
				$.ajax({
					url: "/member/setWithdrawMode.action",
					dataType: "text",
					async: false,
					success: function(data) {

					}
		        });
			   return auth;
		},
		//아이디찾기
		fnMemIDFind : function(){
			//모바일,PC 페이지 분기처리
			if(webSizeMobileYn() == "Y"){ //모바일
				location.href=elandmall.global.oneclick_domain_url +"/member/findId?siteCode=10&returnUrl="+elandmall.global.https_url+'/login/initLogin.action';
			}else{ //PC
				location.href=elandmall.global.oneclick_pc_domain_url +"/member/findId?siteCode=10&returnUrl="+elandmall.global.https_pc_url+'/login/initLogin.action';
			}
		},
		//패스워드찾기
		fnMemPassFind : function(){
			//모바일,PC 페이지 분기처리
			if(webSizeMobileYn() == "Y"){ //모바일
				location.href=elandmall.global.oneclick_domain_url +"/member/findPwd?siteCode=10&returnUrl="+elandmall.global.https_url+'/login/initLogin.action';
			}else{ //PC
				location.href=elandmall.global.oneclick_pc_domain_url +"/member/findPwd?siteCode=10&returnUrl="+elandmall.global.https_pc_url+'/login/initLogin.action';
			}
		},
		//아이디찾기
		fnMemIDFindForTour : function(){
			//모바일,PC 페이지 분기처리
			if(webSizeMobileYn() == "Y"){ //모바일
				location.href=elandmall.global.oneclick_domain_url +"/member/findId?siteCode=10&returnUrl="+elandmall.global.https_url+'/topas/initLogin.action';
			}else{ //PC
				location.href=elandmall.global.oneclick_pc_domain_url +"/member/findId?siteCode=10&returnUrl="+elandmall.global.https_pc_url+'/topas/initLogin.action';
			}
		},
		//패스워드찾기
		fnMemPassFindForTour : function(){
			//모바일,PC 페이지 분기처리
			if(webSizeMobileYn() == "Y"){ //모바일
				location.href=elandmall.global.oneclick_domain_url +"/member/findPwd?siteCode=10&returnUrl="+elandmall.global.https_url+'/topas/initLogin.action';
			}else{ //PC
				location.href=elandmall.global.oneclick_pc_domain_url +"/member/findPwd?siteCode=10&returnUrl="+elandmall.global.https_pc_url+'/topas/initLogin.action';
			}
		},
		//회원가입
		fnMemJoin : function(){
			var retUrl = elandmall.global.base_domain_url; //모바일
			if(webSizeMobileYn() != "Y"){
				retUrl = elandmall.global.base_pc_domain_url; //PC
			}
			elandmall.kidiMarketOneclick.goPage("/member/joinMember",
					{siteCode : '10',
					returnUrl : "https:"+retUrl+'/gate/memJoinGate.action'}, null, "get");
		},
		//임시비밀번호연장
		fnHoldTempPassword : function(callback) {

			var pParam = {webId : elandmall.kidiMarketOneclick.getLoginId(), authorization : elandmall.kidiMarketOneclick.getFrontAuth()};
			
			var onclick_url = elandmall.global.oneclick_domain_url; //모바일
			if(webSizeMobileYn() != "Y"){ 
				onclick_url = elandmall.global.base_pc_domain_url; //PC
			}

			jQuery.support.cors = true;
			if($.browser.msie && $.browser.version<=9) {
		       _gatewayURL_ = elandmall.util.https("/login/gateWay.action");
		    }
	        jQuery.ajax({
	        	type:'GET',
				url: onclick_url+"/member/holdTempPasswordAjax",
		    	cors:true,
		    	crossDomain:true,
				dataType: "json",
				data:pParam,
				success: function(data) {
					console.log("data.resultCode => {}",data.resultCode);
					if(data.resultCode != "0") {
						alert('비밀번호 연장 처리가 되지 않았습니다.');
					}
					if ( $.type(callback) == "function" ){
						callback();
					}
				},
				error : function(error) {
				   $.each(error , function(a , o){
	        		   console.log(a +">>"+o);
	        	   });
					alert('비밀번호 연장 오류가 발생하였습니다.');
	            }
	        });
		},
		//비밀번호연장
		fnExtendPwdChange : function(callback) {

			var pParam = {webId : elandmall.kidiMarketOneclick.getLoginId(), authorization : elandmall.kidiMarketOneclick.getFrontAuth()};

			var onclick_url = elandmall.global.oneclick_domain_url; //모바일
			if(webSizeMobileYn() != "Y"){ 
				onclick_url = elandmall.global.base_pc_domain_url; //PC
			}

			jQuery.support.cors = true;
	    	if($.browser.msie && $.browser.version<=9) {
	           _gatewayURL_ = elandmall.util.https("/login/gateWay.action");
	    	}
	        jQuery.ajax({
	        	type:'GET',
				url: onclick_url+"/member/extendPwdChangeAjax",
		    	cors:true,
		    	crossDomain:true,
				dataType: "json",
				data:pParam,
				success: function(data) {
					 console.log("data.resultCode => {}",data.resultCode);
					if(data.resultCode != "0"){
						alert('비밀번호 연장 처리가 되지 않았습니다.');
					}
					if ( $.type(callback) == "function" ){
						callback();
					}
				},
				error : function(error) {
				   $.each(error , function(a , o){
	        		   console.log(a +">>"+o);
	        	   });
	            	alert('비밀번호 연장 오류가 발생하였습니다.');
	            }
	        });
		}
   };
	
	//찜 기능
	elandmall.kidiMarketWshlist ={
			data : {},
			init : function(callback){
				this.data = {};

				elandmall.isLogin({login:function(){
					callback(elandmall.kidiMarketWshlist.data);
				}});
			},
			marketWish : function(wishObj){ //현재 버튼의 상태에 따라 마켓 찜 선택/ 찜취소 분기 처리
				
				if($(wishObj).hasClass("btn--on") || $(wishObj).hasClass("btn--bookmark--added")){
					elandmall.kidiMarketWshlist.delMarketWish($(wishObj).attr("del_val"), wishObj);
				}else{
					elandmall.kidiMarketWshlist.addMarketWish($(wishObj).attr("reg_val"), wishObj);
				}
				
			}, 
			goodsWish : function(wishObj){ //현재 버튼의 상태에 따라 상품 찜 선택/ 찜취소 분기 처리
				
				if($(wishObj).hasClass("btn--likeOnThumb--on")){
					elandmall.kidiMarketWshlist.delGoodsWish($(wishObj).attr("del_val"), wishObj);
				}else{
					var regValList = $(wishObj).attr("reg_val");
					var reg_val = regValList.split(",");
					if(reg_val.length == 6){
						elandmall.kidiMarketWshlist.addGoodsWish(reg_val[0], reg_val[1], reg_val[2], reg_val[3], reg_val[4], reg_val[5], "", "", "", wishObj);
					}else{
						console.log("goodsWish = 파라미터값이 맞지 않습니다. " + regValList);
					}
				}
				
			},
			addMarketWish : function(marketNo, wishObj ){
				
				this.init(function(data){
			    	data.market_no= marketNo;
			    	data.wish_obj= wishObj;
			    	elandmall.kidiMarketWshlist.regMarketWish();
				});
			},
			addGoodsWish : function(goods_no, vir_vend_no,
					sale_shop_divi_cd, sale_shop_no,  sale_area_no, conts_dist_no, low_vend_type_cd, deli_goods_divi_cd, field_recev_poss_yn, wishObj ){
				
				if(low_vend_type_cd == "50" && deli_goods_divi_cd == "10" && field_recev_poss_yn == "Y"){
					if($("#storeReceipt") != null &&  $("#storeReceipt").length > 0 ){
						return alert("매장수령 선택 후 진행해 주세요.");
					}
				}
				
				this.init(function(data){
			    	data.rel_dtl_no1= goods_no;
			    	data.rel_dtl_no3= vir_vend_no;
			    	data.rel_divi_cd = "10";//상품
			    	data.sale_shop_divi_cd= sale_shop_divi_cd;
			    	data.sale_shop_no= sale_shop_no;
			    	data.sale_area_no= sale_area_no;
			    	data.conts_dist_no= conts_dist_no;
			    	data.wish_obj= wishObj;
			    	elandmall.kidiMarketWshlist.regWish();
				});
			},
			delMarketWish : function(marketNo, wishObj ){
							
				this.init(function(data){
			    	data.wish_obj= wishObj;
				});
				
				if(marketNo){	
					
					data = elandmall.kidiMarketWshlist.data;
					
					param= {market_no: marketNo};
					$.ajax({
						url: "/kidimarket/deleteMyMarketWishList.action",
						data: param,
						type: "post",
						async: false,
						dataType: "text",
						success: function(result) {
							
							kidiMarketWishlistComplete(result, 'delMarket');
							
						}, error : function( e ){
							if ( e.error_message !=null && e.error_message != ""){
								alert(e.error_message);
							}else{
								alert("찜 취소 실패");
							}
						}
					});
				}
			},
			delGoodsWish : function(deliWishNo, wishObj ){
				
				this.init(function(data){
			    	data.wish_obj= wishObj;
				});
				
				if(deliWishNo){	
					
					data = elandmall.kidiMarketWshlist.data;
					
					param= {wish_no: deliWishNo};
					$.ajax({
						url: "/kidimarket/deleteMyWishList.action",
						data: param,
						type: "post",
						async: false,
						dataType: "text",
						success: function(result) {
							
							kidiMarketWishlistComplete(result, 'delGoods');
							
						}, error : function( e ){
							if ( e.error_message !=null && e.error_message != ""){
								alert(e.error_message);
							}else{
								alert("찜 취소 실패");
							}
						}
					});
				}
			},
			addBrandWish : function(brand_no){
				this.init(function(data){
			    	data.rel_dtl_no1= brand_no;
			    	data.rel_divi_cd = "20";//브랜드
			    	elandmall.kidiMarketWshlist.regWish();
				});
			},
			addPlanWish : function(paln_no){
				this.init(function(data){
			    	data.rel_dtl_no1= paln_no;
			    	data.rel_divi_cd = "30";//기획전
			    	elandmall.kidiMarketWshlist.regWish();
				});
			},

			addCategoryWish : function(disp_ctg_no){
				this.init(function(data){
					data.rel_dtl_no1= disp_ctg_no;
			    	data.rel_divi_cd = "40";//카테고리
			    	elandmall.kidiMarketWshlist.regWish();
				});
			},
			addKeywordWish : function(search_kwd, search_param){
				this.init(function(data){
			    	data.search_kwd = search_kwd;
			    	data.search_param = search_param;
			    	data.rel_divi_cd = "50";// 검색어
			    	elandmall.kidiMarketWshlist.regWish();
				});
			},
			addMixMatchWish : function(bbs_no, bbs_dtl_no){
				this.init(function(data){
					data.rel_dtl_no1 = bbs_no;
					data.rel_dtl_no2 = bbs_dtl_no;
			    	data.rel_divi_cd = "60";//mix & match
			    	elandmall.kidiMarketWshlist.regWish();
				});
			},
			regMarketWish : function(){
				
				data = elandmall.kidiMarketWshlist.data;
				
				//console.log(data);
		    	$.ajax({
		    		url: "/kidimarket/registMarketWishList.action",
		    		data: $.param(this.data, true),
		    		async: false,
		    		type: "post",
		    		dataType: "text",
		    		success: function(s) {

		    			kidiMarketWishlistComplete(s, 'registMarket');

		    		}, error : function( e ){
		    			if ( e.error_message !=null && e.error_message != ""){
		    				alert(e.error_message);
		    			}else{
		    				alert("처리중 오류가 발생하였습니다.");
		    			}
		    		}
		    	});
			},
			regWish : function(){
				
				data = elandmall.kidiMarketWshlist.data;
				
				console.log(data);
		    	$.ajax({
		    		url: "/kidimarket/registMbWishList.action",
		    		data: $.param(this.data, true),
		    		async: false,
		    		type: "post",
		    		dataType: "text",
		    		success: function(s) {

		    			kidiMarketWishlistComplete(s, 'registGoods');

		    		}, error : function( e ){
		    			if ( e.error_message !=null && e.error_message != ""){
		    				alert(e.error_message);
		    			}else{
		    				alert("처리중 오류가 발생하였습니다.");
		    			}
		    		}
		    	});
			}
	};
	//찜 기능
	
	
	//히스토리
	elandmall.kidiMarketHistory = {
		fnPageMovePrev : function(kidimarket_gnb_idx, kidimarket_sub_category_idx, pin) {
		   	try {
		   		if (sessionStorage) {
		   			
		    		sessionStorage.setItem("url", location.href);
		    		if(kidimarket_gnb_idx != null && "" != kidimarket_gnb_idx){
		    			sessionStorage.setItem("back_kidimarket_gnb_idx", kidimarket_gnb_idx);
		    		}
		    		if(kidimarket_sub_category_idx != null && "" != kidimarket_sub_category_idx){
		    			sessionStorage.setItem("back_kidimarket_sub_category_idx", kidimarket_sub_category_idx);
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
		}
	};
	
	elandmall.kidiMarketGoods = {

		goDetail : function(pin) {
			var url_path = "/goods/initGoodsDetail.action";

			if(pin.tr_yn && pin.tr_yn == 'Y') {
				elandmall.tracking.fireClick(pin);
			}

			var dlp_list = "키디마켓";
			var dlp_category = pin.dlp_category;

			var dlp_brand_nm = '';

			if(pin.brand_nm == null || pin.brand_nm == '') {
				dlp_brand_nm = 'U';
			} else {
				dlp_brand_nm = unescape(pin.brand_nm);
			}

			dataLayer.push({
				'event':'productClick',
				'ecommerce': {
					'click': {
						'actionField': {'list': dlp_list},
						'products': [{
							'name': pin.goods_nm,
							'id': pin.goods_no,
							'price':pin.cust_sale_price,
							'brand': dlp_brand_nm,
							'category': dlp_category
						}]
					}
				}
			});
			
			var param = $.param(pin);
			var gd_url = elandmall.kidiMarketUtil.newHttps(url_path) + "?" + param;
			
			//PC
			if(webSizeMobileYn() != "Y"){ 
				goOtherkidiSite(url_path,"300",param);
			//모바일	
			}else{ 
				location.href = gd_url;	
			}
		}
	};
})(jQuery);

/**
 * 찜 처리 완료 후 메세지 및 데이터 처리
 */
kidiMarketWishlistComplete = function(s, type){
		
	//toast 메세지
	var layerHtmml = "";	
	if(type == "registGoods"){
		layerHtmml+='<div class="kidimarket_toast_view dim dim--toastCircle"></div>';
		layerHtmml+='<div class="kidimarket_toast_view layerPop layerPop--toastCircle layerPop--toastCircleLikeOn">';
		layerHtmml+='	<div class="layerPop__toastCircle">';
		layerHtmml+='		<div class="layerPop__toastIconArea">';
		layerHtmml+='			<p class="layerPop__toastIcon layerPop__toastIcon--likeOn"></p>';
		layerHtmml+='			<p class="layerPop__toastText">찜</p>';
		layerHtmml+='		</div>';
		layerHtmml+='	</div>';
		layerHtmml+='</div>';
	}else if(type == "delGoods"){
		layerHtmml+='<div class="kidimarket_toast_view dim dim--toastCircle"></div>';
		layerHtmml+='<div class="kidimarket_toast_view layerPop layerPop--toastCircle layerPop--toastCircleLikeOff">';
		layerHtmml+='	<div class="layerPop__toastCircle">';
		layerHtmml+='		<div class="layerPop__toastIconArea">';
		layerHtmml+='			<p class="layerPop__toastIcon layerPop__toastIcon--likeOff"></p>';
		layerHtmml+='			<p class="layerPop__toastText">잉 ㅠㅠ</p>';
		layerHtmml+='		</div>';
		layerHtmml+='	</div>';
		layerHtmml+='</div>';
	}else if(type == "registMarket"){
		layerHtmml+='<div class="kidimarket_toast_view dim dim--toastCircle"></div>';
		layerHtmml+='<div class="kidimarket_toast_view layerPop layerPop--toastCircle">';
		layerHtmml+='	<div class="layerPop__toastCircle">';
		layerHtmml+='		<div class="layerPop__toastIconArea">';
		layerHtmml+='			<p class="layerPop__toastIcon layerPop__toastIcon--bookmarkOn"></p>';
		layerHtmml+='			<p class="layerPop__toastText">즐겨찾기</p>';
		layerHtmml+='		</div>';
		layerHtmml+='	</div>';
		layerHtmml+='</div>';
	}else if(type == "delMarket"){
		layerHtmml+='<div class="kidimarket_toast_view dim dim--toastCircle"></div>';
		layerHtmml+='<div class="kidimarket_toast_view layerPop layerPop--toastCircle">';
		layerHtmml+='	<div class="layerPop__toastCircle">';
		layerHtmml+='		<div class="layerPop__toastIconArea">';
		layerHtmml+='			<p class="layerPop__toastIcon layerPop__toastIcon--bookmarkOff"></p>';
		layerHtmml+='			<p class="layerPop__toastText">잉 ㅠㅠ</p>';
		layerHtmml+='		</div>';
		layerHtmml+='	</div>';
		layerHtmml+='</div>';
	}

	// 찜 UI관련 처리
	if(type == "registGoods"){
		$(data.wish_obj).attr("del_val",s);
		if(!$(data.wish_obj).hasClass("btn--likeOnThumb--on")){
			$(data.wish_obj).addClass("btn--likeOnThumb--on");
		}
		
		//슬라이드 존재시 대응
		if($(data.wish_obj).parent().parent().parent().hasClass("swiper-slide") && webSizeMobileYn() == "Y"){
			$(data.wish_obj).parent().parent().parent().parent().parent().parent().append(layerHtmml);
		}else{
			$(data.wish_obj).parent().parent().append(layerHtmml);
		}
		
	}else if(type == "delGoods"){
		if($(data.wish_obj).hasClass("btn--likeOnThumb--on")){
			$(data.wish_obj).removeClass("btn--likeOnThumb--on");
		}
		
		//슬라이드 존재시 대응
		if($(data.wish_obj).parent().parent().parent().hasClass("swiper-slide") && webSizeMobileYn() == "Y"){
			$(data.wish_obj).parent().parent().parent().parent().parent().parent().append(layerHtmml);
		}else{
			$(data.wish_obj).parent().parent().append(layerHtmml);
		}
		
	}else if(type == "registMarket" || type == "delMarket"){
		
		$(data.wish_obj).parent().append(layerHtmml);
		
		var cnt = "";
		if(parseInt(s) < 10000){
			cnt = new Intl.NumberFormat().format(s);
		}else{
			cnt = (parseInt(s) / 10000) + "만";
		}
		
		//마켓랭킹 즐겨찾기
		if($(data.wish_obj).parent().find(".marketRank__bookmarkNum").length){
			$(data.wish_obj).parent().find(".marketRank__bookmarkNum").text(cnt);
			
			if($(data.wish_obj).hasClass("btn--on")){
				$(data.wish_obj).removeClass("btn--on");
			}else{
				$(data.wish_obj).addClass("btn--on");
			}
		}else{ //브랜드관 즐겨찾기
			$(data.wish_obj).text("즐겨찾기 " + cnt);
			
			if($(data.wish_obj).hasClass("btn--bookmark--added")){
				$(data.wish_obj).removeClass("btn--bookmark--added");
				$(data.wish_obj).addClass("btn--bookmark--active");
			}else if($(data.wish_obj).hasClass("btn--bookmark--active")){
				$(data.wish_obj).removeClass("btn--bookmark--active");
				$(data.wish_obj).addClass("btn--bookmark--added");
			}
		}
		
		
		
		
	}
	
	if(type == "registGoods" || type == "delGoods"){
		//사용자 찜 목록 최신화
		$.ajax({
			url: "/kidimarket/resetMbThumList.action",
			async: false,
			type: "post",
			dataType: "text",
			success: function(s) {

				console.log("사용자 찜 목록 최신화 성공");

			}, error : function( e ){
				if ( e.error_message !=null && e.error_message != ""){
					console.log("사용자 찜 목록 최신화 실패 = " + e.error_message);
				}else{
					console.log("사용자 찜 목록 최신화 실패");
				}
			}
		});
	}
	
	//$(".kidimarket_toast_view").show();
	$(".dim--toastCircle").addClass("dim--on");
	$(".layerPop--toastCircle").addClass("layerPop--on");
	
	setTimeout(function() { 
	    $(".kidimarket_toast_view").fadeOut(200);
	    $('.kidimarket_toast_view').remove();
	    
	    //마켓 랭킹 재조회 처리 
	    if(type == "registMarket" || type == "delMarket"){
	    	if($("#selectSorting").length){
	    		if ( typeof fnSearchMarketRankInc == 'function') fnSearchMarketRankInc();
	    	}
	    }
	    
	    //로그인 상태 체크 --ajax로 로그인 처리 하였을 경우 데이터 처리가 되어 있지 않아 해당 로직 추가
	    if($(".userUtil__afterLogin").css('display') == 'none'){
	    	//로그인 데이터 적용 안되어있을 경우 화면 리로드
			location.reload();
	    }
	}, 2000); 

}

/* 화면 사이즈 모바일 여부 Y = 모바일(가로 320~767) / N = PC(가로 768~1200)*/
var webSizeMobileYn = function(){
	
	//기본 값 모바일
	var chkResult = "Y";
	
	var winSizeWidth = $(window).width();

	if(winSizeWidth > 767){
		chkResult = "N";
	}
	
	return chkResult ;
}

/* 로그인 게이트 전환*/
var goOtherkidiSite = function(url_path, type, param){

	//APP에서 키디캔디 --> 키디마켓으로 넘어왔는지 체크용 AP
	var kidicandyAppYn = elandmall.kidiMarketUtil.getCookie("AP");
	//APP에서 키디캔디 --> 키디마켓의 경우 아이폰(I)/안드로이드(A) 타입
	var kidicandyAppType = elandmall.kidiMarketUtil.getCookie("DTYPE");
	var actionUrl = "/kidimarket/kidiLogin.action";	
	
	//APP에서 하단 바의 캔디샵, 사진, 스토리 작성으로 커뮤니티 이동일 경우 서브웹뷰로 띄우는 함수 호출 처리 
	if(kidicandyAppYn == "Y" && kidicandyAppType != "" && type == "200" 
		&& (url_path.indexOf("/community/event/shop") > -1 || url_path.indexOf("/community/photo/regist/form") > -1 || url_path.indexOf("/community/story/regist/form") > -1)){
		
		actionUrl = "https:" + elandmall.global.kidimarket_mo_domain_url + actionUrl; //APP 함수로 SSO 유지 이동일 경우 full url로 처리
		if(kidicandyAppType == "A"){ //안드로이드 앱일 경우 서브웹뷰 함수 호출
			var postData = "url=" + encodeURIComponent(url_path) + "&type=" + encodeURIComponent(type) + "&paramstring=" + encodeURIComponent(param);
			//console.log("postData = " + postData);
			//console.log("actionUrl = " + actionUrl);
			KidiCandyApp.AppInnerWebViewPostTypePopupOpen(actionUrl, postData, false);
		}else if(kidicandyAppType == "I"){ //아이폰 앱일 경우 서브웹뷰 함수 호출
			var postData = "url="+url_path+"&type="+type+"&paramstring="+param;
			//console.log("postData = " + postData);
			//console.log("actionUrl = " + actionUrl);
			window.webkit.messageHandlers.AppInnerWebViewPostTypePopupOpen.postMessage({url: actionUrl, postData: postData, topShow: false});
		}
	}else{
		var $form = $('<form></form>');
		
		$form.attr('action', actionUrl);	  
		$form.attr('method', 'post');
		$form.appendTo('body');
		$form.append($("<input type='hidden' value=" + url_path + " name='url'>"));
		$form.append($("<input type='hidden' value=" + type + " name='type'>"));	
		$form.append($("<input type='hidden' value=" + param + " name='paramstring'>"));	
		$form.submit();
	}
}


var goStoreLoginGate = function(url_path, lendurl){
	
	//APP에서 키디캔디 --> 키디마켓으로 넘어왔는지 체크용 AP
	var kidicandyAppYn = elandmall.kidiMarketUtil.getCookie("AP");
	//APP에서 키디캔디 --> 키디마켓의 경우 아이폰(I)/안드로이드(A) 타입
	var kidicandyAppType = elandmall.kidiMarketUtil.getCookie("DTYPE");
	var actionUrl = "/gate/kidimarketLoginGate.action";	
	
	if(kidicandyAppYn == "Y" && kidicandyAppType != "" && url_path.indexOf("/main/initMain.action") > -1){
		
		actionUrl = "https:" + lendurl + actionUrl; //APP 함수로 SSO 유지 이동일 경우 full url로 처리
		if(kidicandyAppType == "A"){ //안드로이드 앱일 경우 서브웹뷰 함수 호출
			var postData = "entry_url=" + encodeURIComponent(url_path);
			//console.log("postData = " + postData);
			//console.log("actionUrl = " + actionUrl);
			KidiCandyApp.AppInnerWebViewPostTypePopupOpen(actionUrl, postData, false);
		}else if(kidicandyAppType == "I"){ //아이폰 앱일 경우 서브웹뷰 함수 호출
			var postData = "entry_url="+url_path;
			//console.log("postData = " + postData);
			//console.log("actionUrl = " + actionUrl);
			window.webkit.messageHandlers.AppInnerWebViewPostTypePopupOpen.postMessage({url: actionUrl, postData: postData, topShow: false});
		}
		
	}else{
		var $form = $('<form></form>');
		
		$form.attr('action', lendurl + actionUrl);	  
		$form.attr('method', 'post');
		$form.appendTo('body');
		$form.append($("<input type='hidden' value=" + url_path + " name='entry_url'>"));
		$form.submit();
	}	
}

//모바일 통합몰 gnb idx 이동용 게이트
var goBaseIdxGate = function(url_path, lendurl){
	var $form = $('<form></form>');
	
	$form.attr('action', lendurl + '/gate/kidimarketLoginGate.action');	  
	$form.attr('method', 'post');
	$form.appendTo('body');
	$form.append($("<input type='hidden' value=" + url_path + " name='entry_url'>"));
	$form.append($("<input type='hidden' value='Y' name='base_mall_yn'>"));
	$form.submit();
}



