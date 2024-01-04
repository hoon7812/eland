;(function($) {

    var cal_input_layer = null;
    var cate_navi1 = "";
    var cate_navi2 = "";
    var viewType = "";  // 보기방식

    kids_fnsearch = {
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
                $("#searchTerm").val(kwd);
                this.headerSearchForm_submit();
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
            if(kwd.includes("brandKwd_") == true){
                var lang = kwd.split("_")[1];
                var brandNm = kwd.split("_")[2];
                var choose_lang = lang == "eng" ? "brand_eng_nm" : "brand_kor_nm";
                var enc_brand_nm = encodeURIComponent(brandNm);

                fnsearchresent.callKwdCookie("brandKwd_"+lang+"_"+brandNm);
                location.href="/search/search.action?" + choose_lang + "=" + enc_brand_nm;
            }else{
                kwd = $.trim(kwd);
                if(kwd == ""){
                    alert("검색어를 입력해주세요.");
                    return;
                }else{
                    $("#searchTerm").val(kwd);
                    this.headerSearchForm_submit();
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
            var deliInfoLot = "";     //오늘직송(하이퍼) 여부
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
                    if (this.value == "quick_deli") {
                        deliInfoQuick = "10";
                    } else if (this.value == "store_pick") {
                        deliInfoStorePick = "30";
                    } else if (this.value == "lot_deli") {
                        deliInfoLot = "20";
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
            $("#hstr_filter_info").val(filter_info);
            $("#hstr_quick_deli_poss_yn").val(deliInfoQuick);
            $("#hstr_lot_deli_yn").val(deliInfoLot);
            $("#hstr_field_recev_poss_yn").val(deliInfoStorePick);
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

            var url = "/search/search.action";

            if(search_type == "ctgr"){
                url = "/dispctg/initDispCtg.action";
            }else if(search_type == "brand"){
                url = "/dispctg/initBrandShop.action";
            }else if(search_type == "kids"){
                url = "/dispctg/searchSubCategory.action";
            }else if(search_type == "best"){
                url = "/dispctg/searchSubBestCategory.action";
            }else if(search_type == "kidi"){
                url = "/dispctg/searchKidiCategory.action";
            }else{
                url = "/search/search.action";
                type = "GET";
                cache = true;
            }

            var parameters = "";
            $('#hstr_pageNum').val(1);
            $("#historyForm :input").each(function(index){
                parameters += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + '&';
            });
            parameters += "list_only_yn=Y";
            $.ajax({
                url : url
                , data : parameters
                , type : type
                , cache : cache
                , dataType : "html"
                , success : function(data) {
                    $(".goods_list_load").html(""); // 리셋
                    //데이터 임시 저장
                    $("#tempGoodsList").html(data);

                    var totalCount = $("#tempGoodsList input:hidden[name=total_count]").val();
                    totalCount = totalCount == undefined || totalCount == null || totalCount == "" ? 0 :  totalCount;
                    var overCount = "";
                    if(totalCount >= 99999) {
                        overCount = "+";
                        totalCount = 99999;
                    }

                    if($("#sh_cate_wrap").length > 0 ){
                        //페이지 인덱스 설정
                        $(".cate_wrap input:hidden[name=total_count]").val(totalCount);
                        $(".cate_wrap input:hidden[name=page_index]").val($("#tempGoodsList input:hidden[name=page_index]").val());

                        //하나더 목록 추가
                        $(".cate_wrap .goods_list").html($("#tempGoodsList").html());
                    }else{
                        //페이지 인덱스 설정
                        $(".search_wrap input:hidden[name=total_count]").val(totalCount);
                        $(".search_wrap input:hidden[name=page_index]").val($("#tempGoodsList input:hidden[name=page_index]").val());

                        //하나더 목록 추가
                        if(search_type != 'kids' && search_type != 'best' && search_type != 'kidi') {
                            $(".search_wrap .goods_list_load").html($("#tempGoodsList").html());
                        } else {
                            $(".goods_list_load").html($("#tempGoodsList").html());
                        }
                    }
                    // 상품 갯수 변경
                    $("div.cts_tit > h2 > em").text(totalCount + overCount + "개 상품");
                    $("h3.pop_tit em").text(totalCount + overCount + "개 상품");
                    $("div.sch_count em").text(totalCount + overCount + "개 상품");
                    $(".top_tit > h2 >").find("span").text(totalCount);


                    //페이지 인덱스 셋팅 후 임시 데이터 삭제
                    $("#tempGoodsList #paging").remove();

                    // 더보기 숨김여부 체크
                    if(search_type != 'kids' && search_type != 'best' && search_type != 'kidi') {
                        var p_idx = parseInt($("input:hidden[name=page_index]").val());
                        var r_p_p = parseInt($("input:hidden[name=rows_per_page]").val());
                        var g_total = parseInt($("input:hidden[name=total_count]").val());
                        //alert("fnInit > p_idx :"+p_idx + "r_p_p :"+r_p_p+ "g_total :"+g_total);
                        if ((p_idx * r_p_p) >= g_total) {
                            $(".goods_list_more").hide();
                        } else {
                            $(".btn_current_count").text(p_idx * r_p_p);
                            $(".btn_total_count").text(g_total);
                        }
                    }

                    //categoryRedraw();
                    // 전체페이지 설정후 임시내용 삭제
                    $("#tempGoodsList").html("");
                    elandmall.lazyload();
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
            window.location.href = "/dispctg/initDispCtg.action?disp_ctg_no="+ctgr_cd;
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
        goSearchCategorySort: function( sort_val ){
            //this.setParameters();

            $('#hstr_pageNum').val('1');
            $("#hstr_sort").val(sort_val);

            this.srchFilterBox('ctgr');
        },

        /**
         * 정렬 검색 실행
         *
         * @param val
         *
         * @return
         */
        goSearchBrandSort: function( sort_val ){
            //this.setParameters();

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

            $("input:checkbox[name='size_info']").each(function(index,value){
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

            if(cnt > 0){
                fnsearch.srchFilterBox(search_type);
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
        },

        /**
         * filter 클릭시 아이콘화면 출력
         *
         * @param (
         * 			comp : Html Component(ex: this),
         * 			type : 'ctgFltr', 'normalFltr'
         *		   )
         *
         * @return
         */
        onSelectFltr : function( comp, type, imgPath ) {

            // 카테고리 값 클릭 시 스크롤 값을 0으로 초기화
            scrpos = 0;

            var html = '';
            var id = $(comp).attr("id");
            var key = $(comp).attr("data-key");

            if (type == "ctgFltr") {
                id = "fltrCategory";
                key = "fltrCategory";
            }

            var fltrVal = $(comp).val();
            var name = $(comp).data("name");
            var temp = name.toUpperCase();
            var text = this.textLengthOverCut(name, 14);

            // 체크여부(길이 0 : 체크X)
            if($('.fltrs ul').find('[data-key="' + key + '"]').length == 0) {
                if(type == 'imgFltr') {
                    if(temp == 'WHITE' || temp == '화이트' || temp == '흰색'){
                        html = '<a href="javascript:;" data-key="' + key +'"><i class="white"><img src="' + imgPath + '" alt="' + name + '"/></i>' + text + '</a>';
                    }else{
                        html = '<a href="javascript:;" data-key="' + key +'"><i><img src="' + imgPath + '" alt="' + name + '"/></i>' + text + '</a>';
                    }

                } else {
                    if(type == "ctgFltr"){
                        html = '<a href="javascript:;" data-key="' + key +'" data-ctgNo="' + fltrVal + '">' + text + '</a>';
                    }else{
                        html = '<a href="javascript:;" data-key="' + key +'">' + text + '</a>';
                    }
                }

                $('.fltrs ul').append('<li>' + html + '</li>');
                $('.slctd_fltr ul').append('<li class="swiper-slide">' + html + '</li>');

                if( $('.fltrs ul li').length == 1) {
                    $('.fltrs_wrap').addClass('on');
                    $('.slctd_fltr').addClass('on');
                }

                $("input[data-key='" + key + "']").attr("checked", true);
            }else {
                var targetTag = $('.fltrs ul').find('[data-key="' + key + '"]');
                targetTag.parent().remove();
                targetTag = $('.slctd_fltr ul').find('[data-key="' + key + '"]');
                targetTag.parent().remove();

                if($('.fltrs ul li').length == 0) {
                    $('.fltrs_wrap').removeClass('on');
                    $('.slctd_fltr').removeClass('on');
                }

                if($('#' + id).attr('type') == 'radio') {
                    $('#' + id).attr('checked', false);
                }

                if(type == "ctgFltr") {
                    if ($(comp).parent("li").parent("ul").hasClass("lctg_area") === true) {
                        text = name;
                    }else{
                        text = cate_navi1 != "" ? cate_navi1 + ">" + name : name;
                    }
                    html = '<a href="javascript:;" data-key="' + key +'" data-ctgNo="' + fltrVal + '">' + this.textLengthOverCut(text, 16) + '</a>';
                    //html = '<a href="javascript:;" data-key="' + key +'">' + name + '</a>';

                    $('.fltrs ul').append('<li>' + html + '</li>');
                    $('.slctd_fltr ul').append('<li class="swiper-slide">' + html + '</li>');

                    if( $('.fltrs ul li').length == 1) {
                        $('.fltrs_wrap').addClass('on');
                        $('.slctd_fltr').addClass('on');
                    }
                }

                $("input[data-key='" + key + "']").attr("checked", false);
            }

            sendGaTag();
        },

        // 넘어가는 글자수 자르기
        textLengthOverCut : function (txt, len, lastTxt) {
            if (len == "" || len == null) { // 기본값
                len = 20;
            }
            if (lastTxt == "" || lastTxt == null) { // 기본값
                lastTxt = "...";
            }
            if (txt.length > len) {
                txt = txt.substr(0, len) + lastTxt;
            }
            return txt;
        },

        categorySelect : function( comp ) {
            var ctgNo = $(comp).val();
            var $cateArea = $(comp).parent("li").parent("ul").parent('dd.tg_hgt');

            // 대카테고리 선택시
            if ($(comp).parent("li").parent("ul").hasClass("lctg_area") === true) {

                // 하위카테고리가 없을시
                if ($("ul.mctg_area." + ctgNo + " li").length <= 0) {

                    // 카테고리 번호는 한개만 넘어가야함.
                    $("#hstr_ctg_cd").val(ctgNo);
                    $("#hstr_ctg_cd2").val("");

                    // 네비게이션 설정
                    cate_navi1 = $(comp).parent("li").find("span").text();
                    $("#cate_navi1").text(" > " + cate_navi1);

                } else {
                    // 하위카테고리가 있을시
                    this.resetCate();

                    // 카테고리 번호는 한개만 넘어가야함.
                    $("#hstr_ctg_cd").val(ctgNo);
                    $("#hstr_ctg_cd2").val("");

                    // 네비게이션 설정
                    cate_navi1 = $(comp).parent("li").find("span").text();
                    $("#cate_navi1").text(" > " + cate_navi1);

                    // 대카테고리 가리고 해당 중카테고리 보이기
                    $("ul.lctg_area, .mctg_area").hide();
                    $("ul.mctg_area." + ctgNo).show();


                    // 하위카테고리를 열었을때 강제로 전체보기활성
                    $cateArea.addClass('open');
                    $cateArea.find(".tg_btns").hide();

                }


            } else {
                // 중카테고리 선택시
                cate_navi2 = $(comp).parent("li").find("span").text();

                // 카테고리 번호는 한개만 넘어가야함.
                $("#hstr_ctg_cd").val("");
                $("#hstr_ctg_cd2").val(ctgNo);
            }
        },

        // 카테고리 관련 사항 초기화
        resetCate : function() {
            cate_navi1 = "";
            cate_navi2 = "";

            $(".mctg_area").hide();
            $(".lctg_area").show();

            $("#hstr_ctg_cd").val("");
            $("#hstr_ctg_cd2").val("");

            $(".lctg_area").parent(".tg_hgt").removeClass("open");
            $(".lctg_area").nextAll(".tg_btns").show();

            $("#cate_navi1").text("");
//			$("input[name='category_info'").prop("checked", false);

            var category_info_size = document.getElementsByName('category_info').length;
            for(var i = 0; i < category_info_size; i++){
                document.getElementsByName('category_info')[i].checked = false;
            }
        },

        schAllCtg : function() {
            $(".slctdFltrDiv ul li a[data-key='fltrCategory']").trigger('click');
        },

        ceilNum : function( num, numOfPosition) {
            return Math.ceil( num / numOfPosition ) * numOfPosition;
        },

        // 보기방식 변경
        setListView : function(view_type) {
            viewType = view_type == "" || view_type == undefined || view_type == null ? viewType : view_type;
            if (viewType != "") {
                $("#goods_list > ul").attr("class","");
                $("#goods_list > ul").addClass(viewType);
            }
        },

        // 처음로딩시 자주사용하는 필터중 가장 첫번째 오픈
        openFavoritFilter : function() {
            for (var i = 1; i < 4; i++) {
                if ($('.filters_tab a[data-filter-tab=' + i + ']').length > 0) {
                    $('.filters_tab a[data-filter-tab=' + i + ']').trigger('click');
                    break;
                }
            }
        },

        // 가격, 할인율 필터추가
        addRangeFltr : function(key, minValue, maxValue) {
            var targetTag = $('.fltrs ul').find('[data-key="' + key + '"]');
            targetTag.parent().remove();
            targetTag = $('.slctd_fltr ul').find('[data-key="' + key + '"]');
            targetTag.parent().remove();

            var html = "";

            if(key == "fltrPriceRange") {
                var localMinPrice = minValue;
                var localMaxPrice = maxValue;
                html = '<li><a href="javascript:;" data-key="' + key + '">' + localMinPrice.toLocaleString() + '원 ~ ' + localMaxPrice.toLocaleString() + '원</a></li>';
            }else if(key == "fltrRateRange") {
                html = '<li><a href="javascript:;" data-key="' + key + '">' + minValue + '% ~ ' + maxValue + '%</a></li>';
            }

            $('.fltrs ul').append(html);
            $('.slctd_fltr ul').append(html);

            if(!$('.fltrs_wrap').hasClass("on")) {
                $('.fltrs_wrap').addClass('on');
                $('.slctd_fltr').addClass('on');
            }
        },

        // 할인율필터 제어
        searchFltrRate : function(search_type) {
            if ($("#min_rate").val() && $("#max_rate").val()) {
                this.addRangeFltr("fltrRateRange", $("#min_rate").val(), $("#max_rate").val());
            }
            this.srchFilterBox(search_type);
        },

        // 할인율 적용버튼 클릭시
        applyFltrRate : function(search_type) {
            if (!$("#min_rate").val() || !$("#max_rate").val()) {
                alert("할인율을 입력해주세요.");
                return false;
            }

            if (Number($("#min_rate").val()) > Number($("#max_rate").val())) {
                alert("최소 할인율이 최대 할인율보다 높습니다.");
                return false;
            }

            if ($("#min_rate").val() > 100 || $("#max_rate").val() > 100) {
                alert("1~99까지의 숫자를 입력해주세요.");
                return false;
            }

            $("input:radio[name='fast_discount']").prop("checked", false);
            this.searchFltrRate(search_type);
        }
    }
})(jQuery);