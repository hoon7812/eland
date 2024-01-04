;(function ($) {
	var ksnet_van_cd = "10";
	var PAY_MEAN_CD_CARD = "11";
	var PAY_MEAN_CD_RBANK = "12";
	var PAY_MEAN_CD_VBANK = "13";
	var KSNET = {	//KSNET 제공 함수
		check_param: function(xid, eci, cavv, cardno) {
			var ck_mpi = this.get_cookie("xid_eci_cavv_cardno");
		
			if (ck_mpi == xid + eci + cavv + cardno) {
				return false;
			};
			this.set_cookie("xid_eci_cavv_cardno", xid + eci + cavv + cardno);
			ck_mpi = this.get_cookie("xid_eci_cavv_cardno");
			return true;
		},
		get_cookie: function(strName) {
			var strSearch = strName + "=";
			if ( document.cookie.length > 0 ) {
				iOffset = document.cookie.indexOf( strSearch );
				if ( iOffset != -1 ) {
					iOffset += strSearch.length;
					iEnd = document.cookie.indexOf( ";", iOffset );
					if ( iEnd == -1 ) {
						iEnd = document.cookie.length;
					};
					return unescape(document.cookie.substring( iOffset, iEnd ));
				};
			};
			return "";
		},
		set_cookie: function(strName, strValue) { 
			var strCookie = strName + "=" + escape(strValue);
			document.cookie = strCookie;
		}		
	};	
	ORDER.payments.ksnet = {
		cancelCert: function(message) {		//인증전에 플러그인창 close했을 경우 처리
			alert();
		},
		call: function(pay) {
			var pay_seq = pay.pay_seq;
			$.extend(ORDER.pay.ord_pays[pay_seq], {
				_payments_: {
					orderer_nm: pay.orderer_nm,
					email: pay.email,
					disp_goods_nm: pay.disp_goods_nm,
					cell_no1: pay.cell_no1,
					cell_no2: pay.cell_no2,
					cell_no3: pay.cell_no3,
					isbn_use_yn : pay.isbn_use_yn
				}
			});
			if (pay.pay_mean_cd == PAY_MEAN_CD_CARD || pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {
				ORDER.payments.getMers({
					pay_mean_cd: pay.pay_mean_cd,
					van_cd: ksnet_van_cd,
					ticket : pay.ticket,
					isbn_use_yn : pay.isbn_use_yn,
					callback: function(mers) {
						pay.mers = mers;
						if (pay.pay_mean_cd == PAY_MEAN_CD_CARD) {
							ORDER.payments.ksnet.payCard(pay);
						} else if (pay.pay_mean_cd == PAY_MEAN_CD_RBANK) {	//실시간 계좌이체
							ORDER.payments.ksnet.payRbank(pay);
						};
					}
				});
			} else if (pay.pay_mean_cd == PAY_MEAN_CD_VBANK) {	//가상계좌(모듈 없음)
				var bank = pay.bank;
				$.extend(ORDER.pay.ord_pays[pay_seq]["_payments_"], {
					bank_cd: bank.bank_cd,
					expiry_date: bank.expiry_date,
					expiry_dtime: bank.expiry_dtime,
					morc_nm: bank.morc_nm,
					isbn_use_yn : pay.isbn_use_yn
				});
				ORDER.payments.payNext(pay.next);
			};
		},
		payCard: function(pay) {
			var cardcomp = pay.cardcomp;
			var mers = pay.mers;
			var noint_mon = cardcomp.noint_mon;	//할부개월
			var isIsbnUseYn = pay.isbn_use_yn;
			if (($("#_KSNET_CARD_FORM_").length > 0)) {
				$("#_KSNET_CARD_FORM_").remove();
			};
			if (cardcomp.isp_yn != "Y") {	//MPI
				var ksnet_card = cardcomp.card_code;
				var form = ORDER.payments.createForm({
					id: "_KSNET_CARD_FORM_",
					name: "Visa3d",
					method: "post"
				});
				var certEnd = false;
				
				form.addInput({ name: "pan", value: "" });
				form.addInput({ name: "expiry", value: "4912" });
				form.addInput({ name: "purchase_amount", value: pay.pay_amt });
				form.addInput({ name: "amount", value: pay.pay_amt });
				form.addInput({ name: "description", value: "none" });
				form.addInput({ name: "currency", value: "410" });
				form.addInput({ name: "recur_frequency", value: "" });
				form.addInput({ name: "recur_expiry", value: "" });
				form.addInput({ name: "installments", value: "" });
				form.addInput({ name: "device_category", value: "0" });
				form.addInput({ name: "name", value: mers.companyname });		//회사명을 영어로 넣어주세요(최대20byte)
				form.addInput({ name: "url", value: mers.site_url });	//회사 도메인을 http://를 포함해서 넣어주세요
				form.addInput({ name: "country", value: "410" });
				form.addInput({ name: "returnUrl", value: location.protocol +"//" + location.host + "/overpass-payments/ksnet/ksnetCert.action" });
				form.addInput({ name: "cardcode", value: ksnet_card });
				form.addInput({ name: "merInfo", value: mers.mers_no });
				form.addInput({ name: "bizNo", value: mers.biz_no });
				form.addInput({ name: "instType", value: "1" });		//1: 일반, 2: 무이자
				if(pay.card_pay_kind_cd =="01"){
					form.addInput({ name: "simplePayYN", value: "3" });		//APP 카드만 사용
				}
				form.appendBody();	//form을 body에 append 하지 않으면 IE에서는 form을 인식 못하는 것 같음
				
				(function() {
					var mpi_result = _KSP_CALL_MPI(form.form, function() {
						var result = arguments[0].split('|');
						var proceed = result[0];
						var xid = result[1];
						var eci = result[2];
						var cavv = result[3];
						var cardno = result[4];
						var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
						ord_pay.pay_no = mers.pay_no;
						if ((proceed == "TRUE"||proceed == "true"||proceed == true) && KSNET.check_param(xid, eci, cavv, cardno)) {		//인증성공
							$.extend(ord_pay["_payments_"], {
								certitype: "M",
								xid: result[1],
								eci: result[2],
								cavv: result[3],
								cardno: result[4],
								noint_mon: noint_mon,
								isbn_use_yn: isIsbnUseYn
							});
							certEnd = true;
							ORDER.payments.payNext(pay.next);
						} else {	//인증실패
							ORDER.payments.throwError("죄송합니다. 결제수단 인증에 실패하였습니다.");
						};
					});
					if (mpi_result == false) {	//팝업 차단등으로 인증이 진행 되지 못하는 경우
						ORDER.payments.throwError(function(){}); // undefined 알림 제거
					};					
				})();
				
				//_ksmpi_pop_obj KSNET에서 오픈한 팝업객체. 이넘을 체크해서 창이 close 됐는지 확인한다.
				var closeCheck = function() {
					if (certEnd === false && _ksmpi_pop_obj) {
						if (_ksmpi_pop_obj.closed == true) {							
							ORDER.payments.throwError("신용카드 인증을 취소하셨습니다.");	
						} else {
							setTimeout(closeCheck, 1000 * 1);						
						};						
					};
				};
				closeCheck();
			} else {	//ISP
				var form = ORDER.payments.createForm({
					id: "_KSNET_CARD_FORM_",
					name: "KSPayISPForm",
					method: "post"
				});
				var kvp_quota_inf = "0";
				if (noint_mon > 0) {
					kvp_quota_inf = "" + noint_mon;
				};
				
				//[START] 기본
				form.addInput({ name: "storeid", value: mers.mers_no });							
				form.addInput({ name: "authty", value: "I000" });
				form.addInput({ name: "certitype", value: "I" });
				//[END] 기본
				//[START] 일반신용카드
				form.addInput({ name: "email", value: pay.email });
				form.addInput({ name: "phoneno", value: pay.cell_no });
				form.addInput({ name: "ordernumber", value: mers.pay_no });
				form.addInput({ name: "ordername", value: pay.orderer_nm });
				form.addInput({ name: "goodname", value: pay.disp_goods_nm });
				form.addInput({ name: "amount", value: pay.pay_amt });
				form.addInput({ name: "currencytype", value: "WON" });
				form.addInput({ name: "expdt", value: "" });
				form.addInput({ name: "cardno", value: "" });	//카드번호
				form.addInput({ name: "expyear", value: "" });	//유효년
				form.addInput({ name: "expmon", value: "" });	//유효월
				form.addInput({ name: "installment", value: "" });	//할부
				form.addInput({ name: "lastidnum", value: "" });	//생년월일
				form.addInput({ name: "passwd", value: "" });	//비밀번호
				//[END] 일반신용카드
				//[START] ISP
				form.addInput({ name: "KVP_PGID", value: mers.pg_id });		//PG
				form.addInput({ name: "KVP_SESSIONKEY", value: "" });	//세션키
				form.addInput({ name: "KVP_ENCDATA", value: "" });	//암호된데이터
				form.addInput({ name: "KVP_CURRENCY", value: "WON" });	//지불 화폐 단위 (WON/USD) : 한화 - WON, 미화 - USD
				form.addInput({ name: "KVP_NOINT", value: "" });	//무이자구분(1:무이자,0:일반) 
				form.addInput({ name: "KVP_QUOTA", value: "" });	//할부
				form.addInput({ name: "KVP_CARDCODE", value: "" });	//카드코드
				form.addInput({ name: "KVP_CONAME", value: "" });	//카드명
				form.addInput({ name: "KVP_RESERVED1", value: "" });	//예비1
				form.addInput({ name: "KVP_RESERVED2", value: "" });	//예비2
				form.addInput({ name: "KVP_RESERVED3", value: "" });	//예비3
				form.addInput({ name: "KVP_IMGURL", value: "" });
				form.addInput({ name: "KVP_QUOTA_INF", value: kvp_quota_inf });	//ISP용 할부개월수지정
				form.addInput({ name: "KVP_GOODNAME", value: pay.disp_goods_nm });	//상품명
				form.addInput({ name: "KVP_PRICE", value: pay.pay_amt });	//금액
				form.addInput({ name: "KVP_NOINT_INF", value: "NONE" });	//"ALL" - 모든개월수에 대하여 무이자처리함./ "NONE" - 모든개월수에 대하여 무이자처리하지않음.
				form.addInput({ name: "KVP_CARDCOMPANY", value: (function() {
					if (cardcomp.cardcomp_cd == "02") {	//국민
						return "0204";
					} else if (cardcomp.cardcomp_cd == "14") {	//우리
						return "0170";
					} else if (cardcomp.cardcomp_cd == "12") {	//수협
						return "1800";
					} else if (cardcomp.cardcomp_cd == "18") {	//전북
						return "1600";
					} else {	//BC
						return "0100";
					}
				})() });
				//[END] ISP
				
				form.appendBody();
				
				window.VP_Ret_Pay = function(ret) {	//ISP 모듈 콜백함수
					var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
					ord_pay.pay_no = mers.pay_no;
					if (ret == true) {
						$.extend(ord_pay["_payments_"], {
							certitype: "I",
							kvp_noint: form.form.KVP_NOINT.value,
							kvp_quota: form.form.KVP_QUOTA.value,
							kvp_pgid: form.form.KVP_PGID.value,
							kvp_cardcode: form.form.KVP_CARDCODE.value,
							kvp_sessionkey: form.form.KVP_SESSIONKEY.value,
							kvp_encdata: form.form.KVP_ENCDATA.value,
							noint_mon: noint_mon,
							mers_no: mers.mers_no,
							isbn_use_yn: isIsbnUseYn
						});
						ORDER.payments.payNext(pay.next);
					} else {
						ORDER.payments.throwError("신용카드 인증을 취소하셨습니다.");
					};
				};
				MakePayMessage(form.form);	//ISP모듈 호출
			};
		},
		payRbank: function(pay) {
			var mers = pay.mers;
			var isIsbnUseYn = pay.isbn_use_yn;
			$.ajax({
				url: location.protocol +"//" + location.host + "/overpass-payments/ksnet/ksnetCertBank.action",
				type: "POST",
				dataType: "json",							
				data: {
					storeid: mers.mers_no,
					ordername: pay.orderer_nm,
					ordernumber: "",
					amount: pay.pay_amt,
					goodname: pay.disp_goods_nm,
					email: pay.email,
					phoneno: pay.cell_no,
					injanm: mers.companyname
				},
				success: function(data) {
					if (data.status != "O") {
						ORDER.payments.throwError("가맹정 정보가 올바르지 않습니다[실시간 계좌이체]");
						return false;
					};
					
					var hd_serial_no = data.hd_serial_no;
					var trno = data.trno;
					var tx_user_define = data.tx_user_define;
					
					if (($("#_KSNET_RBANK_FORM_").length > 0)) {
						$("#_KSNET_RBANK_FORM_").remove();
					};
					
					if (($("#_KSNET_RBANK_TARGET_").length == 0)) {
						$("<iframe />").attr({
							id: "_KSNET_RBANK_TARGET_",
							name: "_KSNET_RBANK_TARGET_"
						}).hide().appendTo("body");
					};
					
					var ord_pay = ORDER.pay.ord_pays[pay.pay_seq];
					ord_pay.pay_no = mers.pay_no;
					// 결제 팝업 callback 함수 등록
					var hd_pi = null;
					var hd_ep_type = "SECUCERT";
					
					window.paramSet = function(phd_pi, phd_ep_type)
					{
						hd_pi = phd_pi;
						hd_ep_type = phd_ep_type;
					};

					window.proceed = function() {
						if(hd_pi != null && hd_pi != ""){
							$.extend(ord_pay["_payments_"], {
								trno: trno,
								banktrno: hd_serial_no,
								tx_user_define: tx_user_define,
								hd_ep_type: hd_ep_type,
								hd_pi: hd_pi,
								isbn_use_yn: isIsbnUseYn
							});
							ORDER.payments.payNext(pay.next);
						}else{
							ORDER.payments.throwError("실시간 계좌이체 승인에 실패하였습니다.");
						}
					}
					
					var form = ORDER.payments.createForm({
						id: "_KSNET_RBANK_FORM_",
						method: "post",
						action:  location.protocol +"//" + location.host + "/ksnet/bankpay.action",
						target: "_KSNET_RBANK_TARGET_"
					});
					
					form.addInput({ name: "hd_msg_code", value: "0200" });               // 전문코드               
					form.addInput({ name: "hd_msg_type", value: "EFT" });                // 결제유형                 
					form.addInput({ name: "hd_approve_no", value: mers.hd_approve_no }); // 승인번호(숫자8자리)
					form.addInput({ name: "hd_serial_no", value: hd_serial_no });        // 전문일련번호            
					form.addInput({ name: "hd_firm_name", value: mers.companyname });    // 이용기관명                
					form.addInput({ name: "hd_item_name", value: pay.disp_goods_nm });   // 상품명                  
					form.addInput({ name: "tx_amount", value: pay.pay_amt });            // 출금금액                  
					form.appendBody();                                                                                    
					
					$("#_KSNET_RBANK_FORM_").submit();

				},
				error: function() {
					ORDER.payments.throwError("실시간 계좌이체 승인에 실패하였습니다.");
				}
			});	
		}
	};
})(jQuery);