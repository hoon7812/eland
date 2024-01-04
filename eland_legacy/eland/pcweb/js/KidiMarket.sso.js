
/* 키디마켓 로그인 SSO 처리를 위한 게이트 전환*/
var goOtherkidiSite = function(url_path, type, param){
	
	var actionUrl = "/kidimarket/kidiLogin.action";
	
	var $form = $('<form></form>');
	
	//새창 팝업에서 다시 새창 팝업을 열었을 경우 페이지 이동이 되는 현상 때문에 id변수 값 추가 처리
	var objCurrentTime = new Date();
	
	var currentTimeId = objCurrentTime.getHours() + objCurrentTime.getMinutes() + objCurrentTime.getSeconds();
	
	//새창 팝업으로 화면 이동인 url 처리
	if(url_path.indexOf("/userStyleDetailPop") > -1){ //상세페이지의 경우 새창 팝업으로 수정
		var popupX = (document.body.offsetWidth / 2) - (800 / 2);

		var popupY= (window.screen.height / 2) - (500 / 2);
			
		window.open('', "kidiNewPop1" + currentTimeId, 'status=no, height=500, width=800, left='+ popupX + ', top='+ popupY);
		$form.attr('target', "kidiNewPop1" + currentTimeId);
	}else if(url_path.indexOf("/community/explore/userStyleList") > -1 || url_path.indexOf("/community/photo/regist/form") > -1){ //스타일 리스트의 경우 새탭으로
		window.open("about:blank", "kidiNewPop2" + currentTimeId);
		$form.attr('target', "kidiNewPop2" + currentTimeId);
	}
		
	$form.attr('action', actionUrl);	  
	$form.attr('method', 'post');
	$form.appendTo('body');
	$form.append($("<input type='hidden' value=" + url_path + " name='url'>"));
	$form.append($("<input type='hidden' value=" + type + " name='type'>"));	
	$form.append($("<input type='hidden' value=" + param + " name='paramstring'>"));	
	$form.submit();
}