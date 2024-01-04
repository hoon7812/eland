/**
 * 주문생성 함수 
 */
$(document).ready(function() {
	var PAY_MEAN_CDS = {
	    	"11": "11",		// 신용카드
	    	"12": "12",		// 실시간계좌이체
	    	"13": "13",		// 가상계좌
	    };
	
	if (!ORDER.fn) {
		ORDER.fn = {};
	};
	$.extend(ORDER.fn, {
		final_pay_amt: 0,
		doOrder: function(p) {
			this.registOrder(p);
		},
		standbyOrder: function() {
			alert("결제 진행중 입니다. 잠시만 기다려 주세요");
			return false;
		},
		registOrder: function(p) {
			var insur_yn = "N";
			var birth_day = "";
			var gend_cd = "";
			var cash_receipt_issue_cd = "";								
			var cash_receipt_use_divi_cd = "";
			var cash_receipt_cert_no = "";
			var refund_req_type_cd = "";
			var refund_req_bank_cd = "";
			var refund_req_depor_nm = "";
			var refund_req_account_no = "";
			var account_owner_mgmt;
			this.doOrder = this.standbyOrder;
			
			try {
				//결제수단 확인
				var radio = $(this);
				var pay_seq = "0";
				
				if (ORDER.pay.pays[pay_seq]) {
					ORDER.pay.pays[pay_seq].pay_amt = 0;	//일단 0으로 초기화
				};

				ORDER.fn.final_pay_amt = p.pay_amt;

				if (ORDER.fn.final_pay_amt > 0) {		//결제금액 존재	
					var pay_mean_cd = "";
					var pay_mean_cd_yn = "";
					var pay_yn = "";
					var if_yn = "";
					
					if($("#card").hasClass("on")){
						if($("#cardcomp_no").val() == ""){
							alert("결제 카드를 선택하세요.");
							return false;
						}else{
							pay_mean_cd = "11";
							pay_mean_cd_yn = "Y";
							pay_yn = "Y";
							if_yn = "Y";
						}
					}else if($("#account").hasClass("on")){
						pay_mean_cd = "12";
						pay_mean_cd_yn = "Y";
						pay_yn = "Y";
						if_yn = "Y";
					}else if($("#deposit").hasClass("on")){
						pay_mean_cd = "21";
						pay_mean_cd_yn = "N";
						pay_yn = "N";
						if_yn = "N";
					}

					//form내의 모든 결제 수단에 대해서 결제 관련 field들을 생성
					var pays = [];
					console.log(p);
					var f = p.form;

					ORDER.mst.ord_mst.site_no = f.site_no.value;
					ORDER.mst.ord_mst.client_no = f.client_no.value;
					ORDER.mst.ord_mst.orderer_nm = f.orderer_nm.value;
					ORDER.mst.ord_mst.email = f.email.value;
					ORDER.mst.ord_mst.cell_no1 = f.cell_no1.value;
					ORDER.mst.ord_mst.cell_no2 = f.cell_no2.value;
					ORDER.mst.ord_mst.cell_no3 = f.cell_no3.value;

					var pay = $.extend({
							form: f,
							pay_mean_cd: pay_mean_cd,
							pay_mean_cd_yn: pay_mean_cd_yn,
							pay_yn: pay_yn,
							pay_amt: ORDER.fn.final_pay_amt,
							gopaymethod: "",
							goodname: p.goodsNm,
							disp_goods_nm: $("#goods_nm").val(),
							buyername: f.orderer_nm.value,
							buyeremail: f.email.value,
							buyertel: f.cell_no.value != "" ? f.cell_no.value : f.tel_no.value,
							noint_divi_cd: "", 
							noint_mon: "", 
							site_no: f.site_no.value, 
							pay_idx: 0, 
							onoff: "ON",
							if_yn: if_yn,
							promo_no: "",
							card_pnt_use_yn: "N",
							getPayYn: function() {	//결제여부 확인
								return true;
							},
							getCardcomp : function() {
								var cardcomp = $("#view_card_cd").find("option:selected");
						
								return {
									kakao: false,
									isp_yn: cardcomp.attr("isp_yn"),
									card_code: cardcomp.attr("card_code"),
									noint_mon: "",
									cardcomp_cd : cardcomp.val()
								};						
							}
						}, p.pays[pay_mean_cd]);

					if (pay.pay_mean_cd in PAY_MEAN_CDS && pay.pay_mean_cd_yn == "Y" && pay.if_yn == "Y") {	//유효성 검사 및 정보 셋팅
						if (pay.pay_mean_cd == "11") {	//신용카드
							pay.gopaymethod = "onlycard";
							
							pay.cardcomp = pay.getCardcomp();
							
						} else if (pay.pay_mean_cd == "12") {
							pay.gopaymethod = "onlydbank";	
						} else if (pay.pay_mean_cd == "13") {
						};
					};

					pays.push(pay);

					ORDER.pay.pays = pays;
					
					console.log(ORDER.pay.pays);
				};

				ORDER.pay.pays[pay_seq].pay_amt = ORDER.fn.final_pay_amt;

				ORDER.payments.callPlugin({ 	//결제 플러그인 호출
					callback: function(data) {
						console.log("----------- [START] 클레임 처리 -----------");
						
						for(var i=0 ; i<data.order_data.ord_pays.length ; i++){
							var payments = data.order_data.ord_pays[i]._payments_;
							
							console.log(payments);
							var apprVanCd = payments.appr_van_cd;

							if(apprVanCd === '90') { // LGUPlus
								$("#claimInputDiv").append("<input type='hidden' id='appr_van_cd' name='appr_van_cd' value='90'>");
								$("#claimInputDiv").append("<input type='hidden' id='lgd_paykey' name='lgd_paykey' value='" + payments.lgd_paykey + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='lgd_respcode' name='lgd_respcode' value='" + payments.lgd_respcode + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='lgd_respmsg' name='lgd_respmsg' value='" + payments.lgd_respmsg + "'>");
								// $("#claimInputDiv").append("<input type='hidden' id='pay_no' name='pay_no' value='" + payments.pay_no + "'>");
							} else {
								$("#claimInputDiv").append("<input type='hidden' id='appr_van_cd' name='appr_van_cd' value='10'>");
								$("#claimInputDiv").append("<input type='hidden' id='cardno' name='cardno' value='" + payments.cardno + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='cavv' name='cavv' value='" + payments.cavv + "'>");
								//$("#claimInputDiv").append("<input type='hidden' id='cell_no1' name='cell_no1' value='"+ payments.cell_no1 +"'>");
								//$("#claimInputDiv").append("<input type='hidden' id='cell_no2' name='cell_no2' value='"+ payments.cell_no2 +"'>");
								//$("#claimInputDiv").append("<input type='hidden' id='cell_no3' name='cell_no3' value='"+ payments.cell_no3 +"'>");
								$("#claimInputDiv").append("<input type='hidden' id='certitype' name='certitype' value='" + payments.certitype + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='disp_goods_nm' name='disp_goods_nm' value='" + payments.disp_goods_nm + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='eci' name='eci' value='" + payments.eci + "'>");
								//$("#claimInputDiv").append("<input type='hidden' id='email' name='email' value='"+ payments.email +"'>");
								$("#claimInputDiv").append("<input type='hidden' id='noint_mon' name='noint_mon' value='" + payments.noint_mon + "'>");
								//$("#claimInputDiv").append("<input type='hidden' id='orderer_nm' name='orderer_nm' value='"+ payments.orderer_nm +"'>");
								$("#claimInputDiv").append("<input type='hidden' id='xid' name='xid' value='" + payments.xid + "'>");

								$("#claimInputDiv").append("<input type='hidden' id='kvp_noint' name='kvp_noint' value='" + payments.kvp_noint + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='kvp_quota' name='kvp_quota' value='" + payments.kvp_quota + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='kvp_pgid' name='kvp_pgid' value='" + payments.kvp_pgid + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='kvp_cardcode' name='kvp_cardcode' value='" + payments.kvp_cardcode + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='kvp_sessionkey' name='kvp_sessionkey' value='" + payments.kvp_sessionkey + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='kvp_encdata' name='kvp_encdata' value='" + payments.kvp_encdata + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='noint_mon' name='noint_mon' value='" + payments.noint_mon + "'>");

								$("#claimInputDiv").append("<input type='hidden' id='banktrno' name='banktrno' value='" + payments.banktrno + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='hd_ep_type' name='hd_ep_type' value='" + payments.hd_ep_type + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='hd_pi' name='hd_pi' value='" + payments.hd_pi + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='trno' name='trno' value='" + payments.trno + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='tx_user_define' name='tx_user_define' value='" + payments.tx_user_define + "'>");
								$("#claimInputDiv").append("<input type='hidden' id='apptype' name='apptype' value='" + elandmall.global.apptype + "'>");
							}

							var formData = $("#claimForm").serialize();
							
							if("" !=  elandmall.global.apptype && apprVanCd !== '90'){ // 모바일 접속
								payments.form_data.sndReply = p.action;
								
								var form = ORDER.payments.createForm({
									id: "_KSPAY_FORM_",
									method: "post",									
									action: payments.form_data.kspay_url
								});
								$.each(payments.form_data, function(k, v) {
									form.addInput({ name: k, value: v });
								});
								
								var formData = $("#claimForm").serialize();
								
								//클레임데이타 값을 세션에 저장
								$.ajax({	//클레임 데이타 생성
									url: "/mypage/registClaimRtnExchngData.action",
									type: "POST",
									dataType: "json",
									data: formData,
									success: function(data) {
										form.appendBody();	//form을 body에 append 하지 않으면 IE에서는 form을 인식 못하는 것 같음
										form.form.submit({
											error: function(p) {	//iframe이 true 일 경우 submit후 호출됨
												alert("ERROR");	
											}
										});
									},
									error: function(m) {
										var message = "접수중 오류가 발생했습니다.";
										ORDER.payments.throwError(message);
									}
								});
							} else if("" !=  elandmall.global.apptype && apprVanCd === '90') { //MOBILE(LGUPLUS 접속)
								//클레임데이타 값을 세션에 저장
								$.ajax({	//클레임 데이타 생성
									url: "/mypage/registClaimRtnExchngData.action",
									type: "POST",
									dataType: "json",
									data: formData,
									success: function(data) {
										ORDER.payments.lguplus.open(p.action);
									},
									error: function(m) {
										var message = "접수중 오류가 발생했습니다.";
										ORDER.payments.throwError(message);
									}
								});
							} else { // pc로 접속
							
								$.ajax({	//클레임 데이타 생성
									url: "/mypage/registClaimRtnExchngData.action",
									type: "POST",
									dataType: "json",
									data: formData,
									success: function(data) {
										$('#claimForm').attr("action", p.action);
										$('#claimForm').attr("method", "post");
										document.claimForm.submit();
									},
									error: function(m) {
										var message = "접수중 오류가 발생했습니다.";
										ORDER.payments.throwError(message);
									}
								});
							
							}
						}
					},
					throwError: function(e) {
						ORDER.fn.restoreOrder(e);						
					}
				});				
			} catch (e) {
				ORDER.fn.restoreOrder(e);			 
			};
		},
		restoreOrder: function(e) {
			ORDER.fn.doOrder = function(p) {
				ORDER.fn.registOrder(p);
			};
			if ($.type(e) == "function") {
				e();
			} else {
				alert(e);		
				fnSearchCostAmt();
			};
		}
	});	
});