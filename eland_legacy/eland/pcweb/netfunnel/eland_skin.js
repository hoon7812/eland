if(typeof NetFunnel == "object"){
    NetFunnel.SkinUtil.add('eland_skin',{ 
        prepareCallback:function(){
            var $perProg =$('#innerProg'),
            $secLeft = $('#secLeft'),
            $minLeft = $('#minLeft'),
            $ordLeft = $('#orLeft'),
            $all =$('#secLeft, #minLeft, #ordLeft');
            $all.innerHTML= 0;

            commonUI.netOn();
            $('#NetFunnel_Countdown_Stop').click(function(){
                commonUI.netOff();
            });
        },
        updateCallback:function(percent,nwait,totwait,timeleft){
            var $perProg =$('#innerProg'),
            $secLeft = $('#secLeft'),
            $minLeft = $('#minLeft');

            $minLeft.html(parseInt(timeleft/60));
            $secLeft.html(timeleft%60);
            $perProg.css('width',percent+'%');
        },
        htmlStr:
        '<div class="wrap_netfunnel">'
        +'    <strong class="net_tit"><img src="'+elandmall.global.image_path+'/images/pcweb/common/logo_netfunnel.png" alt="Elandmall" /></strong>'
        +'    <span class="info_txt">서비스 접속대기중 입니다. <b>잠시만 기다려주세요.</b></span>'
        +'    <div class="box_netf">'
        +'        <div class="order_left">현재 <em id="NetFunnel_Loading_Popup_Count">0</em>번째로 대기중 입니다.</div>'
        +'        <div class="time_left">예상대기 시간 : <span class="time_print min"><em id="minLeft">0</em>분</span> <span class="time_print"><em id="secLeft">0</em>초</span></div>'
        +'        <div class="progress_bar"><div class="inner" id="innerProg"><span class="ir"><em id="irPer">0</em>% 진행</span></div></div>'
        +'    </div>'
        +'    <div class="info_box">'
        +'        <ul>'
        +'            <li>현재 접속자가 많아 대기중 입니다. 잠시만 기다려 주시면 다음 단계로 자동접속 됩니다.<button type="button" id="NetFunnel_Countdown_Stop">[대기 중지]</button></li>'
        +'            <li>재접속이나 새로 고침 할 경우, 순번이 뒤로 밀리고 대기시간이 더 길어질 수 있습니다.</li>'
        +'            <li>먼저 접속하신 분들의 구매로 인한 품절시, 구매가 불가할 수 있습니다.</li>'
        +'        </ul>'
        +'    </div>'
        +'</div>'
    },'normal');
}