var _preventDefault;

(function () {

	history.pushState(null, null, '');
	/*
	window.onpopstate = function(event) {
		var prevUrl = document.referrer;
		//뒤로가기를 한 페이지가 메인 페이지가 아니면 메인으로, 아니면 뒤로가기
		alert(prevUrl)
		//elandmall.hdLink('MAIN');
	};
	*/			
	
	initApp = function(disp_mall_no_spao, disp_mall_no_modern, disp_mall_no_shoopen, disp_mall_no_ekimsclub, disp_mall_no_kidikidi, disp_mall_no_luxurygallery, disp_mall_no, main_url){

		var app_type = elandmall.global.apptype; //OS 정보
		var rtnUrl = "";

		//모바일 기기
		if(app_type != "" && app_type != "undefined"){
			//Android
			if("ANDROID" == app_type){
				if(disp_mall_no_modern == disp_mall_no){					
					rtnUrl = 'https://play.google.com/store/apps/details?id=kr.co.elandmall.modernhouse';
				}else if(disp_mall_no_spao == disp_mall_no){
					rtnUrl = 'https://play.google.com/store/apps/details?id=kr.co.elandmall.spao&hl=ko';
				}else if(disp_mall_no_shoopen == disp_mall_no){
					rtnUrl = 'https://play.google.com/store/apps/details?id=kr.co.elandmall.shoopen&hl=ko';	
				}else if(disp_mall_no_ekimsclub == disp_mall_no) {
					rtnUrl = 'https://play.google.com/store/apps/details?id=kr.co.elandmall.ekimsclub&hl=ko';
				}else if(disp_mall_no_kidikidi == disp_mall_no) {
					rtnUrl = 'https://play.google.com/store/apps/details?id=com.eland.kidslevel1';
				}else if(disp_mall_no_luxurygallery == disp_mall_no) {
					rtnUrl = 'https://play.google.com/store/apps/details?id=kr.co.elandmall.luxury';
				}else{
					rtnUrl = 'https://play.google.com/store/apps/details?id=kr.co.elandmall.elandmall';	
				}
			//ios
			}else if("IOS" == app_type){
				if(disp_mall_no_modern == disp_mall_no){
					rtnUrl = 'https://itunes.apple.com/kr/app/modeonhauseu-intelieo-gagu/id1150984531?l=en&mt=8';
				}else if(disp_mall_no_spao == disp_mall_no){
					rtnUrl = 'https://itunes.apple.com/app/id1189419397?mt=8';
				}else if(disp_mall_no_shoopen == disp_mall_no){
					rtnUrl = 'https://itunes.apple.com/kr/app/syupen-asia-choecho-syujeu/id1193428370?l=en&mt=8';	
				}else if(disp_mall_no_ekimsclub == disp_mall_no){
					rtnUrl = 'https://itunes.apple.com/app/id1282252418?mt=8';
				}else if(disp_mall_no_kidikidi == disp_mall_no){
					rtnUrl = 'https://itunes.apple.com/app/id1506850208';
				}else if(disp_mall_no_luxurygallery == disp_mall_no) {
					rtnUrl = 'https://apps.apple.com/kr/app/luxury-gallery/id1502186914';
				}else{							
					rtnUrl = 'https://itunes.apple.com/kr/app/ilaendeumol-geopum-eobs-i/id1150965124?l=en&mt=8';
				}
			}
		}
	
		if(rtnUrl == ""){
			alert("해당 기기에서 지원하지 않습니다.");		
			history.back();
		}else{
			location.href= rtnUrl;
		}
	};
    
}());