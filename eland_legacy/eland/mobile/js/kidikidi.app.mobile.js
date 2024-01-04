
function planAppBrazeLogging(planNo, eventNo, planNm, planExpiredDate){
	try{
		if(elandmall.global.app_cd == "Android"){
			window.BrazeInterface.planApp(planNo, eventNo, planNm, planExpiredDate);
		}
		else if(elandmall.global.app_cd == "iOS"){
			webkit.messageHandlers.BrazeInterface.postMessage({
			    method : "planApp",
			    params : {
			        planNo: planNo,
			        eventNo: eventNo,
			        planNm: planNm,
			        planExpiredDate: planExpiredDate
			    }
			});
		}
	}catch(e){}
}