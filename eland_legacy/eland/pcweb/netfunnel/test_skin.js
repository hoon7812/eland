if(typeof NetFunnel == "object"){
    NetFunnel.SkinUtil.add('test',{ 
        prepareCallback:function(){
            var progress_print = document.getElementById("Progress_Print");
            progress_print.innerHTML="0 % (0/0) - 0 sec";
        },
        updateCallback:function(percent,nwait,totwait,timeleft){
            var progress_print = document.getElementById("Progress_Print");
            var prog=totwait - nwait;
            progress_print.innerHTML=percent+" % ("+prog+"/"+totwait+") - "+timeleft+" sec";
        },
        htmlStr:'<div id="NetFunnel_Skin_Top" style="background-color:#ffffff;border:1px solid #9ab6c4;width:300px"> \  
    <div style="text-align:right;padding-top:5px;padding-right:5px;;text-align:center;"> \
        <div style="text-align:left;font-size:9pt;color:#001f6c;padding-left:10px;"> \
        <b><span style="color:#013dc1">접속대기 중</span>..</b>잠시만 기다asdfasdfa려주세요.<br> \
            - 대기자수 : <span id="NetFunnel_Loading_Popup_Count"></span>명<br> \
            - 대기시간 : <span id="NetFunnel_Loading_Popup_TimeLeft"></span><br> \
            <div id="Progress_Print" \
            style="text-align:center;padding:5px;font:bold 20px Trebuchet MS,굴림,Gulim;color:gray"></div> \
            </div> \
        <div style="padding:10px;vertical-align:center;width:280px" id="NetFunnel_Loading_Popup_Progressbar">   
    </div>'    
    },'normal');    
}   