var hdrIncStr = '';
hdrIncStr+='<div class="header_bn" id="header_bn" style="background-color: rgb(34, 34, 34);">'
hdrIncStr+='	<a href="#"><img src="../images/mobile/temp/bn_head_100.jpg" alt="이벤트배너" style="height: 59px;"></a>'
hdrIncStr+='	<a href="#" class="cls"><img src="../images/mobile/common/btn_bn_close.png" alt="닫기"></a>'
hdrIncStr+='</div>'
hdrIncStr+=''
hdrIncStr+='<!-- HEADER -->'
hdrIncStr+='<header class="header" id="header">'
hdrIncStr+='	<div class="head">'
hdrIncStr+='		<div class="ctg"><button type="button" id="left_open" class="left_open"><b class="ir">카테고리 전체메뉴 열기</b></button></div><!-- [v2] : onClick="left_lnb_open()" 제거 -->'
hdrIncStr+='		<h1><a href="http://www.google.com"><b class="ir">E-LAND MALL 메인</b></a></h1>'
hdrIncStr+='		<div class="hnb">'
hdrIncStr+='			<ul>'
hdrIncStr+='				<li class="sch">'
hdrIncStr+='					<button type="button" class="txt_btn"><b>검색어 입력검색어 입력검색어 입력검색어 입력</b></button> <!-- 1st ~ 2st : 예비용 class 추가 -->'
hdrIncStr+='					<button type="button" class="sch_btn"><em class="ir">검색결과로 이동</em></button>'
hdrIncStr+='				</li>'
hdrIncStr+='				<li class="cart"><a href="#"><em>88</em><b class="ir">장바구니 이동</b></a></li>'
hdrIncStr+='				<li class="myp"><a href="#"><b class="ir">마이페이지 이동</b></a></li>'
hdrIncStr+='			</ul>'
hdrIncStr+='		</div>'
hdrIncStr+='	</div>'
hdrIncStr+='</header>'
hdrIncStr+='<!-- //HEADER -->'	
$('.accessibility').eq(0).after(hdrIncStr);
