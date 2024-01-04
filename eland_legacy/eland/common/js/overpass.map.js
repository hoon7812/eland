/**
 * 업무관련(상품/주문/장바구니/이벤트등등...) 
 */
;(function($) {
	if ($.type(window.elandmall) != "object") {
		window.elandmall = {};		
	};
	
	if (!elandmall.map) {
		elandmall.map = {};
	};
	/* 다음 카카오 지도  */
	$.extend(elandmall.map, {
	    params : {},
        kakaoMap : function(pin) {
        	var div_id     =  pin.div_id;
        	$("#"+div_id).css('width', pin.width);
        	$("#"+div_id).css('height', pin.height);
        	var mapContainer = document.getElementById(div_id), // 지도를 표시할 div 
            mapOption = { 
                center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                level: 5 // 지도의 확대 레벨 
            }; 
        	
        	// 주소-좌표 변환 객체를 생성합니다
        	var geocoder = new daum.maps.services.Geocoder();
        	
        	// 주소로 좌표를 검색합니다
        	geocoder.addressSearch(pin.shop_loca, function(result, status) {

        	    // 정상적으로 검색이 완료됐으면 
        	     if (status === daum.maps.services.Status.OK) {

        	    	var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        	    	 
        	        var coords = new daum.maps.LatLng(result[0].y, result[0].x);

        	        // 결과값으로 받은 위치를 마커로 표시합니다
        	        var marker = new daum.maps.Marker({
        	            map: map,
        	            position: coords
        	        });

        	        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        	        map.setCenter(coords);
        	        
        	    }else{
        	    	alert("지도를 호출할 수 없습니다.");
        	    	return;
        	    }
        	});  
        }
	});
	
})(jQuery);