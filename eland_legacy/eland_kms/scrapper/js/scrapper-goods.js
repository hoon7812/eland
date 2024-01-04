var ScrapperGoods = window.ScrapperGoods = {
	mallLatelyEventTag : "",
	scrapper_goods_functions : "",
	domain : ".elandmall.com",
	api_domain : "https://apigw.elandmall.com",
	recent_goods_save_cnt : 50,
	spring_profiles_active : "",
	cache_key : "",
	isLogin : "",
	path : "/scrapper",
	expireds : 1,
	init_handlers : [],
	is_init : false,
	is_executed_init_func : false,
	add_init_handler : function(handler, idx, onloaded_posthandler) {
		
		if (!ScrapperGoods.is_executed_init_func) {
			if (idx == undefined) {
				ScrapperGoods.init_handlers.push(handler);
			} else {
				ScrapperGoods.init_handlers.splice(idx, 0, handler);
			}
		} else {
			handler();
			if (onloaded_posthandler != undefined) {
				onloaded_posthandler();
			}
		}
	},
	init : function(func) {
		if (!ScrapperGoods.is_init) {
			ScrapperGoods.is_init = true;
			var html = '<iframe id="scrapper_goods_functions" title="최근본상품" src="/scrapper/scrapper_goods_functions.html" style="display: none;" width="0" height="0" onload="ScrapperGoods.initScrapperGoodsFunctions();" ></iframe>';
			$("body").append(html);
		} else if (func != undefined) {
			func();
		}
	},
	initScrapperGoodsFunctions : function() {

		var f = document.getElementById("scrapper_goods_functions");
		ScrapperGoods.scrapper_goods_functions = f.contentWindow || f.contentDocument  || f.document ;

		var load_recent_goods = ScrapperGoods.scrapper_goods_functions.getLoadRecentGoods();

        if ( ScrapperGoods.isLogin == 'true' ) {
			if( load_recent_goods == 'login' || load_recent_goods == '' ) {
				ScrapperGoods.fnSetScrapperGoodsByApi('loaded', ScrapperGoods.runInitFunction);
			} else {
				ScrapperGoods.runInitFunction();
			}

        } else {
			if( load_recent_goods != 'logout' ) {
				ScrapperGoods.fnSetScrapperGoodsByApi('logout', ScrapperGoods.runInitFunction);
			} else {
				ScrapperGoods.runInitFunction();
			}
        }
	},
	runInitFunction : function() {

		$.each(ScrapperGoods.init_handlers, function(idx, func) {
			func();
		});
		
		ScrapperGoods.is_executed_init_func = true;
	},
	fnGetGoodsInfo : function(goods_no, vir_vend_no){
		flag = 0;
		//한번만 가져오기
		if(($.trim($("#sky_goods_"+goods_no+" .wm_gd_info").html())) == "" && flag == 0){
			flag = 1;
			$.ajax({
				url : "/goods/getScrapperGoodsinfo.action?goods_no="+goods_no+"&vir_vend_no="+vir_vend_no
				, type : "GET" 
				, dataType : "html"
				, success : function(data){
					$("#sky_goods_"+goods_no).append(data);
					flag = 0;	//async : false 대신 사용(크롬에서 경고창뜸)

					var ga_goods_nm = "";
					if(typeof $("#sky_goods_"+goods_no + " .wm_gd_info strong").html() != 'undefined'){
						ga_goods_nm = $("#sky_goods_"+goods_no + " .wm_gd_info strong").html();
					}
					
					$(".d_wg_slider #sky_goods_"+goods_no).attr("data-ga-tag",ScrapperGoods.mallLatelyEventTag+ga_goods_nm);

					_google_analytics();
				}
			});
		}
	},
	fnAddScrapperGoodList : function(goods_no, vir_vend_no, img_file, server_nm, brand_nm, disp_ctg_path, recent_history_pk) {
		var scrapper_goods_list = ScrapperGoods.scrapper_goods_functions.getScrapperGoodsList();
		var scrapper_goods = {
			goods_no: goods_no,
			vir_vend_no: vir_vend_no,
			imgfile: img_file,
			server_name: server_nm,
			brand_nm: brand_nm != null ? escape(brand_nm) : "",
			disp_ctg_path: disp_ctg_path != null ? escape(disp_ctg_path.replace(/\//g, ',').replace(/>/g, '/')) : "",
			recent_history_pk: recent_history_pk
		};
		
		var dup = false;
		var dupCnt = 0;
		
		for (i = 0; i < scrapper_goods_list.length; i++) {
		    var goods_info = scrapper_goods_list[i];
		    if (goods_info.goods_no == scrapper_goods.goods_no) {
		        dupCnt = i;
		        dup = true;
		        break;
		    }
		}
		
		if (!dup && scrapper_goods_list.length == 6) {
			scrapper_goods_list.splice(0, 1);
			scrapper_goods_list.push(scrapper_goods);
		} else if (dup && scrapper_goods_list.length <= 6) {
			scrapper_goods_list.splice(dupCnt, 1);
			scrapper_goods_list.push(scrapper_goods);
		} else {
			scrapper_goods_list.push(scrapper_goods);
		}
		ScrapperGoods.scrapper_goods_functions.setScrapperGoods(scrapper_goods_list, ScrapperGoods.domain, ScrapperGoods.path, ScrapperGoods.expires);
	},
	fnDeleteScrapperGoodList : function(goods_no, recent_history_pk, post_handler, doSetCookie){

		var dataJson = { deleteList : [recent_history_pk] };
		if ( ScrapperGoods.spring_profiles_active == 'local' ) {
			dataJson.Cookie = document.cookie;
			dataJson.Referer = document.referrer;
		}
		$.ajax({
			url: ScrapperGoods.api_domain + '/recentGoods/delete',
			type: "POST",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			xhrFields: { withCredentials: true },
			data: dataJson,
			crossDomain: true,
            cors: true,
            async: true,
	    	success: function(data){
	    		var scrapper_goods_list = ScrapperGoods.scrapper_goods_functions.getScrapperGoodsList();
	    		
	    		deleted = false;

	    		for (i = 0; i < scrapper_goods_list.length; i++) {
	    		    var goods_info = scrapper_goods_list[i];
	    		    if (goods_info.goods_no == goods_no) {
	    				scrapper_goods_list.splice(i, 1);
	    				deleted = true;
	    		    	break;
	    		    }
	    		}
	    		
	    		if (deleted && doSetCookie && scrapper_goods_list.length > 0) {

		    		ScrapperGoods.fnGetRecentGoods(function(goodsList) {
		    			newGoodsList = [];
		    			if (goodsList.length > 0) {
		    				
		    				newGoodsList.push({
		    						goods_no: goodsList[0].goods_no,
		    						vir_vend_no: goodsList[0].vir_vend_no,
		    						imgfile: goodsList[0].imgfile,
		    						server_name: goodsList[0].server_name,
		    						brand_nm: goodsList[0].brand_nm != null ? escape(goodsList[0].brand_nm) : "",
		    						disp_ctg_path: goodsList[0].disp_ctg_path != null ? escape(goodsList[0].disp_ctg_path.replace(/\//g, ',').replace(/>/g, '/')) : "",
		    						recent_history_pk: goodsList[0].recent_history_pk
		    					});
		    				
		    				$.each(scrapper_goods_list, function(i, d){
		    					newGoodsList.push(d);
		    				})
		    			}
		    			ScrapperGoods.scrapper_goods_functions.setScrapperGoods(
		    					newGoodsList.length == 0 ? scrapper_goods_list : newGoodsList
		    					, ScrapperGoods.domain, ScrapperGoods.path, ScrapperGoods.expires);
		    		}, { recent_history_pk : scrapper_goods_list[0].recent_history_pk, size : 1 });
	    		} else {
	    			ScrapperGoods.scrapper_goods_functions.setScrapperGoods(
	    					scrapper_goods_list, ScrapperGoods.domain, ScrapperGoods.path, ScrapperGoods.expires);
	    		}
	    	},
	    	error: function(data){
	    		console.log("최근본상품 삭제 실패["+data.error+":"+data.error_description+"]");
			},
			complete: function(data) {

				if (post_handler != undefined) {
					post_handler();
				}
			}
	    });

	},
	fnDeleteScrapperGoodArrList : function(goods_no){
		var scrapper_goods_list = ScrapperGoods.scrapper_goods_functions.getScrapperGoodsList();
		
		for (j = 0; j < goods_no.length; j++) {
			for (i = 0; i < scrapper_goods_list.length; i++) {
			    var goods_info = scrapper_goods_list[i];
			    if (goods_info.goods_no == goods_no[j]) {
			    	scrapper_goods_list.splice(i, 1);
			    	break;
			    }
			}
		}
		
		ScrapperGoods.scrapper_goods_functions.setScrapperGoods(scrapper_goods_list, ScrapperGoods.domain, ScrapperGoods.path, ScrapperGoods.expires);
	},
	fnDeleteAllScrapperGood : function(){
		var scrapper_goods_list = ScrapperGoods.scrapper_goods_functions.getScrapperGoodsList();
		scrapper_goods_list.splice(0, scrapper_goods_list.length);
		
		ScrapperGoods.scrapper_goods_functions.setScrapperGoods(scrapper_goods_list, ScrapperGoods.domain, ScrapperGoods.path, ScrapperGoods.expires);
	},
	fnSetScrapperGoodsByApi : function(load_recent_goods, post_handler){
		//gnb_scrapper_lately 모두 삭제
		ScrapperGoods.fnDeleteAllScrapperGood();

		//api호출하여 gnb_scrapper_lately 쿠키에 저장
		ScrapperGoods.fnFullReloadScrapper(post_handler);

		//load_recent_goods 값 세팅;
		ScrapperGoods.scrapper_goods_functions.setLoadRecentGoods(load_recent_goods, ScrapperGoods.domain, ScrapperGoods.path, ScrapperGoods.expires);
	},
	fnFullReloadScrapper : function(post_handler) {

		ScrapperGoods.fnGetRecentGoods(function(scrapper_goods_list) {
			
			ScrapperGoods.fnDeleteAllScrapperGood();
			
			var startIdx = scrapper_goods_list.length > 6 ? 6 : scrapper_goods_list.length;
			for(var i = startIdx; i > 0; i--) {
				var goods_info = scrapper_goods_list[i-1];

				ScrapperGoods.fnAddScrapperGoodList(goods_info.goods_no, goods_info.vir_vend_no, goods_info.imgfile, goods_info.server_name, goods_info.brand_nm, goods_info.disp_ctg_path, goods_info.RECENT_HISTORY_PK);
			}
			
			if (post_handler != undefined) {
				post_handler(scrapper_goods_list);
			}
		});
	},
	fnGetRecentGoods : function(post_handler, data) {
		var dataJson = { recent_history_pk : '', size : ScrapperGoods.recent_goods_save_cnt };
		if ( ScrapperGoods.spring_profiles_active == 'local' ) {
			dataJson.Cookie = document.cookie;
			dataJson.Referer = document.referrer;
		}
		
		if (data != undefined) {
			for (var attrname in data) { dataJson[attrname] = data[attrname]; }
		}

		$.ajax({
			url: ScrapperGoods.api_domain + '/recentGoods/list',
			type: "POST",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			xhrFields: { withCredentials: true },
			data: dataJson,
			crossDomain: true,
		    cors: true,
		    async: true,
			success: function(data){
				if ( data.error == "success" ) {
					var scrapper_goods_list = JSON.parse(JSON.stringify(data.data.recentGoods));
					if (post_handler != undefined) {
						
						$.each(scrapper_goods_list, function(i, d) {
							if (d.recent_history_pk == undefined && d.RECENT_HISTORY_PK != undefined)
								d.recent_history_pk = d.RECENT_HISTORY_PK;
						});

						post_handler(scrapper_goods_list);
					}

				} else {
					console.log("최근본상품 조회 실패["+data.error+":"+data.error_description+"]");
					if (post_handler != undefined) {
						post_handler([]);
					}
				}
			},
			error: function(data){
				console.log("최근본상품 조회 실패");
				
				if (post_handler != undefined) {
					post_handler([]);
				}
			}
		});
	},
	fnAddRecentGoods : function(param) {
		
		if (param == undefined || param.data == undefined) {
			console.log("missing parameter");
			return;
		}
		
		var dataJson = param.data;
		
		if ( ScrapperGoods.spring_profiles_active == 'local' ) {
			dataJson.Cookie = document.cookie;
			dataJson.Referer = document.referrer;
		}
		
		$.ajax({
			url: ScrapperGoods.api_domain + '/recentGoods/save',
			type: "POST",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			xhrFields: { withCredentials: true },
			data: dataJson,
			crossDomain: true,
			cors: true,
			async: true,
			success: function(data){
				if ( data.error == "success" ) {
					//console.log("최근본상품 저장 완료["+data.data.recent_history_pk+"]");
					if (param.success != undefined) {
						param.success(data.data)
					}

				} else {
					console.log("최근본상품 저장 실패["+data.error+":"+data.error_description+"]");
				}
			},
			error: function(data){
				console.log("최근본상품 저장 실패");
			}
		});
	}
}
