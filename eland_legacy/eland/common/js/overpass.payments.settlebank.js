;(function ($) {
	var settlebank_van_cd = "40";
	var certEnd = false;
	ORDER.payments.settlebank = {
	    call: function(pay) {
	    	var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
	    	
			ORDER.payments.getMers({
				pay_mean_cd: '14',
				van_cd: '40',
				callback: function(mers) {
					console.log("pay_no :  " + mers.pay_no);
					var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
					ord_pay.pay_no = mers.pay_no;
					openWindow(mers);
				}
			});
			
			function openWindow(mers) {
				var width = 350;
				var height = 475;
				var xpos = (screen.width - width) / 2;
				var ypos = (screen.width - height) / 6;
				var position = "top=" + ypos + ",left=" + xpos;
				var features = position + ", width="+width+", height="+height+",toolbar=no, location=no"; 

				webbrowser=navigator.appVersion;
				
				var order_form = document.order_form;
				window.name = "STPG_CLIENT";
				var features = position + ", width="+350+", height="+525+",toolbar=no, location=no"; 
				wallet = window.open("", "STPG_WALLET", features);
		    	/*document.domain = "overpass.co.kr";*/
				
				if (($("#order_form").length > 0)) {
					$("#order_form").remove();
				};
		    	
		    	if ( wallet != null) {
					var order_form = ORDER.payments.createForm({
						id: "order_form",
						name: "order_form",
						method: "post",
						target: "STPG_WALLET",
						//action: "https://pg.settlebank.co.kr/mobile/MobileAction.do?_method=authProv"
					    action: mers.settlebank_url + "/mobile/MobileAction.do?_method=authProv"
					});
		    	    order_form.addInput({ name: "PMid", value: mers.mers_no });
		    	    order_form.addInput({ name: "PAmt", value: pay.pay_amt });
		    	    
	                //------결과처리를 위한 파라미터----
		    	    order_form.addInput({ name: "PHash", value: ""});
		    	    order_form.addInput({ name: "PData", value: "" });
		    	    order_form.addInput({ name: "PStateCd", value: "" });
		    	    order_form.addInput({ name: "POrderId", value: "" });
		    		//--------------------------------
		    		
		    	    order_form.addInput({ name: "PNoteUrl", value: "" });
		    	    order_form.addInput({ name: "PNextPUrl", value: mers.settlebank_next_url + pay.pay_seq });
		    	    order_form.addInput({ name: "PCancPUrl", value: ""});
		    	    
		    	    order_form.addInput({ name: "PEmail", value: pay.email });
		    	    order_form.addInput({ name: "PPhone", value: "" });
		    	    order_form.addInput({ name: "POid", value: mers.pay_no });
		    	    order_form.addInput({ name: "PTarget", value: "" });
		    	    
		    	    order_form.addInput({ name: "PGoods", value: encodeURI(pay.disp_goods_nm) });
		    	    order_form.addInput({ name: "PNoti", value: "" });
		    	    order_form.addInput({ name: "PMname", value: encodeURI("이랜드통합몰") });
		    	    order_form.addInput({ name: "PUname", value: encodeURI(pay.orderer_nm) });
		    	    order_form.addInput({ name: "PEname", value: encodeURI("ELAND MALL") });
		    	    order_form.appendBody();	//form을 body에 append 하지 않으면 IE에서는 form을 인식 못하는 것 같음
		    	    
		    		$("#order_form").submit();
		    		
					var closeCheck = function() {
						if (wallet.closed == true && certEnd == false) {	
							ORDER.payments.throwError("휴대폰 결제 인증을 취소하였습니다.");
						} else {
							setTimeout(closeCheck, 1000 * 1);						
						};						
					};
					closeCheck();
		    		
		    	} else {

		    		if ((webbrowser.indexOf("Windows NT 5.1")!=-1) && (webbrowser.indexOf("SV1")!=-1)) {	// Windows XP Service Pack 2
		    			alert("팝업이 차단되었습니다. 브라우저의 상단 노란색 [알림 표시줄]을 클릭하신 후 팝업창 허용을 선택하여 주세요.");
		    		} else {
		    			alert("팝업이 차단되었습니다.");
		    		}
		    	}
			};
	    },
		rest: function(state, oid, trno, hash, pay_seq, mers_no, uname) {
			certEnd = true;
			var ord_pay = ORDER.pay.ord_pays[pay_seq];

			ord_pay["_payments_"] = {
				appr_van_cd: settlebank_van_cd,
				pay_no : oid,
				POid : oid,
				trade_no: trno,
				mers_no: mers_no,
				hash: hash,
				orderer_nm : uname
			};
			
			var pay = [];			
			ORDER.payments.payNext(pay.next);
		}
	};
})(jQuery);