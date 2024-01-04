;(function ($) {
	String.prototype.hashCode = function() {
	    if (Array.prototype.reduce){	//IE9 이하에서는 지원안함
	        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
	    } 
	    var hash = 0;
	    if (this.length === 0) return hash;
	    for (var i = 0; i < this.length; i++) {
	        var character  = this.charCodeAt(i);
	        hash  = ((hash<<5)-hash)+character;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	};
	var zf = function(val, len) {
		var s = "", i = 0;
		len = +len - (val + "").length;
		while (i++ < len) { 
			s += "0"; 
		}; 
		return s + val;
	};
	
	var ORDER = window.ORDER = {
		orderGoing: function() {
			elandmall.util.setCookie({ name: "order_status", value: "P", secure: true, path: "/order" });
		},
		orderStop: function() {
			elandmall.util.setCookie({ name: "order_status", value: "", secure: true, path: "/order" });
		},

		cardvan: {
			ksnet_yn: "N",
			lguplus_yn: "N"
		},
		mst: {		//주문 마스타
			0: "주문마스타정보",
			staff_yn: "N",
			ord_mst: {},
			orderer_nm: "",
			total_free_pnt: 0,
			total_free_deli_pnt: 0,
			total_study_pnt: 0,
			total_study_deli_pnt: 0,
			total_gift_pnt: 0,
			total_gift_deli_pnt: 0,
			cert_no : "",
			return_values: []
		},
		pay: {		//주문 결제
			0: "주문결제정보",
			pays: {},	//본결제수단
			ord_pays: {},	//주문에 사용된 결제수단
			usable_settles: {},	//결제 수단
			card_noint: {},	//카드 무이자 정보
			add: function(pay) {
				pay = $.extend({ pay_seq: null, site_no: ORDER.mst.ord_mst.site_no, client_no: ORDER.mst.ord_mst.client_no, pay_mean_cd: null, pay_amt: 0 }, pay || {});
				if (pay.pay_seq == null) {
					alert("SEQ가 존재하지 않습니다[ORD_PAY]");
					return false;
				};
				if ($.type(pay.site_no) != "string" || pay.site_no == "") {
					alert("SITE 정보가 존재하지 않습니다[site_no]");
					return false;
				};
				if ($.type(pay.client_no) != "string" || pay.client_no == "") {				
					alert("SITE 정보가 존재하지 않습니다[client_no]");
					return false;
				};
				if ($.type(pay.pay_mean_cd) !== "string") {
					alert("PAY_MEAN_CD가 존재하지 않습니다[ORD_PAY]");
					return false;
				};
				if ($.type(pay.getPayYn) != "function") {
					alert("결제 정보가 존재하지 않습니다[GETPAYYN]");
					return false;
				};
				if (pay.pay_mean_cd == "11") {	//신용카드
					if ($.type(pay.getCardcomp) != "function") {
						alert("신용카드 정보가 존재하지 않습니다[GETCARDCOMP]");
						return false;
					};
				} else if (pay.pay_mean_cd == "13") {	//가상계좌
					if ($.type(pay.getBank) != "function") {
						alert("입금은행 정보가 존재하지 않습니다[GETBANK]");
						return false;
					};
				};
				this.pays[pay.pay_seq] = pay;
			}
		},
		goods: {	//주문 상품
			0: "주문상품정보",
			total_ord_qty: 0,
			total_remain_qty: 0,
			ord_goods: {},
			cart_count_deli: 0,
			cart_count_shop: 0,
			changeQty: function(p) {	//복수 배송의 경우 배송지별 상품수량 변경시
				var goods = ORDER.goods.ord_goods[p.cart_seq];
				goods.remain_qty += (p.qty * -1);
				goods.ord_qty += p.qty;
				ORDER.goods.total_remain_qty += (p.qty * -1);
			}
		},
		benefits: {
			0: "혜택정보",
			top_cart_resou_no: "",
			promo_type_no_cart: "1000000007",		//장바구니쿠폰
			promo_type_no_double: "1000000006",	//더블쿠폰
			promo_type_no_goods: "1000000005",	//상품쿠폰
			promo_type_no_staff: "1000000010",		//직원할인
			cart_benefits: {},
			benefitSessionMap: undefined,
			benefitCache: {},
			benefitCallback: function(p, data) {
				p = p || {};
				if (!this.benefitSessionMap) {
					this.benefitSessionMap = (function() {
						var benefit_session_map = {};
						$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
							$.each(this, function(benefit_seq) {
								$.each(this.benefits, function(i) {
									benefit_session_map[this.benefit_session_idx] = { cart_seq: cart_seq, benefit_seq: benefit_seq, idx: i };				
								});
							});
						});
						return benefit_session_map;
					})();
				};
				$.each(data.benefit, function() {	//혜택 재조회 결과 셋팅
					var sess = ORDER.benefits.benefitSessionMap[this.sess_idx];
					var cart_seq = "";
					var benefit_seq = "";
					var idx = "";
					var benefit = null;
					var coupon;
					if (sess) {
						cart_seq = sess.cart_seq;
						benefit_seq = sess.benefit_seq;
						idx = sess.idx;
						coupon = ORDER.benefits.cart_benefits[cart_seq][benefit_seq];
						if (p.promo_type_no != ORDER.benefits.promo_type_no_double || coupon.promo_type_no != ORDER.benefits.promo_type_no_double) {	//더블쿠폰 변경시 더블쿠폰의 apply_poss_yn은 반영하지 않는다.
							coupon.apply_poss_yn = this.apply_poss_yn;	
						};
						if (coupon.bene_poli_cd == "20") {	//적립금							
							coupon.select_yn = this.select_yn;							
						};
						coupon.benefits[sess.idx].dc_price = this.dc_price;	
						coupon.benefits[sess.idx].save_amt = this.save_amt;
					};
				});
				//재조회된 금액을 다시 적용
				$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
					$.each(this, function(benefit_seq) {
						var benefit = this;
						var dc_price = 0;
						var save_amt = 0;
						$.each(benefit.benefits, function() {
							dc_price += (this.ord_cnt * this.dc_price);
							save_amt += (this.ord_cnt * this.save_amt);
						});
						benefit.dc_price = dc_price;
						benefit.save_amt = save_amt;						
					});					
				});
				// PriceMgr재조회 결과
				if (data.pricemgr) {
					$.each(data.pricemgr, function() {
						var goods = ORDER.goods.ord_goods[this.cart_seq];
						goods.free_use_pnt = this.free_use_pnt;
						goods.gift_use_pnt = this.gift_use_pnt;
						goods.study_use_pnt = this.study_use_pnt;						
					});
				};
				if (p.staff_point_yn == "Y") {	//임직원 포인트에 변동이 있다면 배송비 정보도 재조회 한다.
					ORDER.dlvp.getDeliInfo({
						callback: function() {
							if ($.type(p.callback) == "function") {
								p.callback();
							};		
						}
					});
				} else {
					if ($.type(p.callback) == "function") {
						p.callback();
					};					
				};
			},
			searchBenefitOrder: function(p) {
				var data = { benefit: [], pricemgr: [] };
				var params = "";
				var hashcode = "";
				p = $.extend({ staff_point_yn: "N" }, p);				
				//직원할인 + 상품쿠폰 + 더블쿠폰 사용정보 전송
				$.each(ORDER.benefits.cart_benefits, function(cart_seq) {
					$.each(this, function(benefit_seq) {
						if (this.promo_type_no == "1000000005" || this.promo_type_no == "1000000006" || this.promo_type_no == "1000000007" || this.promo_type_no == "1000000010") {
							var benefit = this;
							$.each(this.benefits, function(i) {						
								data.benefit.push({ select_yn: benefit.select_yn, resou_no: benefit.resou_no, benefit_session_idx: this.benefit_session_idx });
							});
						};
					});
				});
				if (p.staff_point_yn == "Y") {
					$.each(ORDER.goods.ord_goods, function(cart_seq) {
						var wfr_yn = "";
						$.each(ORDER.benefits.cart_benefits[cart_seq], function(benefit_seq) {
							if (this.promo_type_no == "1000000010") {
								if (this.apply_poss_yn == "Y" && this.select_yn == "Y") {
									wfr_yn = "Y";
								} else {
									wfr_yn = "N";
								}
								return true;
							}
						});
						data.pricemgr.push({
							cart_seq: cart_seq,
							goods_no: this.goods_no,
							item_no: this.item_no,
							vir_vend_no: this.vir_vend_no,
							ord_qty: this.ord_qty,
							wfr_yn: wfr_yn,
							set_items: []
						});
						$.each(this.set_items, function(i) {
							var goods = data.pricemgr[data.pricemgr.length - 1];
							goods.goods_cmps_divi_cd = "20";
							goods.set_items.push({
								cmps_grp_seq: this.cmps_grp_seq, 
								ord_qty: goods.ord_qty,
								vir_vend_no: this.vir_vend_no, 
								goods_no: this.goods_no, 
								item_no: this.item_no, 
								set_goods_no: goods.goods_no
							});
						});
					});
				};
				if (data.benefit.length > 0 || data.pricemgr.length > 0) {
					params = JSON.stringify(data);
					hashcode = params.hashCode();
					// Cache에 상관없이 무조건 조회로 변경
					$.ajax({
						url: "/order/searchBenefitOrder.action",
						data: { data: params, promo_type_no: p.promo_type_no, benefitKey: ORDER.mst.benefitKey },
						type: "POST",
						dataType: "json",
						success: function(data) {
							ORDER.benefits.benefitCache[hashcode] = data;
							ORDER.benefits.benefitCallback(p, data)
						},
						error: function() {
							alert("혜택 정보를 조회할 수 없습니다.");
						}
					});
				}
			}
		},
		deli: {	//실제 배송비(도서산간:N -> r_deli_cost_amt - r_city_exp_deli_cost, 도서산간:Y -> r_deli_cost_amt)
			0: "기본배송비정보",
			ord_deli: {},	//택배배송
			shop_deli: {},	//매장수령
			digital_deli: {},	//디지털 상품권
			hotel_deli: {},	//호텔 예약 상품
			hyper_deli: {}  //하이퍼 오늘직송
		},
		dlvp: {		//배송지 정보
			0: "배송지정보",			
			base_dlvp: {},		//기본 배송지 정보
			ord_dlvps: {},			
			add: function(p) {
				p = $.extend({ cart_grp_cd: "10" }, p);				
				if ((p.cart_grp_cd == "10" || p.cart_grp_cd == "60" || p.cart_grp_cd == "70") && $.type(p.getOrdMemo) != "function") {
					alert("배송지 정보가 올바르지 않습니다[GETORDMEMO].");
					return false;
				};
				var dlvp_no = (function() {
					var count = 0;
					$.each(ORDER.dlvp.ord_dlvps, function() {
						count++;
					});
					return count + 1 ;
				})();	
				var dlvp = {
					cart_grp_cd: p.cart_grp_cd,
					address: {},
					getOrdMemo: p.getOrdMemo,
					getCustomsId:p.getCustomsId,
					ord_deli: {},
					base_yn: "N",		//해당 배송지의 기본 배송지 지정 여부
					setAddress: function(address) {
						this.address = $.extend({
							mbr_dlvp_seq: "",
							base_yn: "N",
							dlvp_nm: "미지정",
							recvr_nm: "",
							recvr_post_no: "",
							recvr_base_addr: "",
							recvr_dtl_addr: "",
							recvr_road_post_no: "",
							recvr_road_base_addr: "",
							recvr_road_dtl_addr: "",
							addr_divi_cd: "",
							recvr_email: "",
							recvr_tel1: "",
							recvr_tel2: "",
							recvr_tel3: "",
							recvr_cell_no1: "",
							recvr_cell_no2: "",
							recvr_cell_no3: "",
							city_exp_yn: "N"					
						}, address);
					},
					ord_gift_yn: "N"	//주문 사은품 배송지 여부
				};
				if (p.cart_grp_cd == "HO") {	//호텔예약
					$.each(ORDER.deli.hotel_deli[p.vir_vend_no], function(i) {
						dlvp.ord_deli["0000001"] = { ord_goods: {} };
						$.each(this, function(i, cart_seq) {
							dlvp.ord_deli["0000001"].ord_goods[cart_seq] = { ord_qty: ORDER.goods.ord_goods[cart_seq].ord_qty };
						});
					});
				} else if (p.cart_grp_cd == "10" || p.cart_grp_cd == "50" || p.cart_grp_cd == "60" || p.cart_grp_cd == "70") {	//택배배송, 선물하기, 오늘받송, 하이퍼 
					$.each(ORDER.deli.ord_deli, function(dlvp_seq) {
						var ord_goods = this.ord_goods;
						dlvp.ord_deli[dlvp_seq] = { ord_goods: {} };
						$.each(ord_goods, function(i, cart_seq) {
							dlvp.ord_deli[dlvp_seq].ord_goods[cart_seq] = { ord_qty: 0 };
						});
					});
					dlvp.setAddress(p.dlvp);
				} else if (p.cart_grp_cd == "20") {	//디지털 상품권
					$.each(ORDER.deli.digital_deli, function(vir_vend_no) {
						var ord_goods = this.ord_goods;
						dlvp.ord_deli[vir_vend_no] = { ord_goods: {} };
						$.each(ord_goods, function(i, cart_seq) {
							dlvp.ord_deli[vir_vend_no].ord_goods[cart_seq] = { ord_qty: 0 };
						});
					});
					dlvp.setAddress(p.dlvp);
				} else if (p.cart_grp_cd == "40") {	//매장수령
					$.each(ORDER.deli.shop_deli[p.vir_vend_no], function(i) {
						dlvp.ord_deli["0000001"] = { ord_goods: {} };
						$.each(this, function(i, cart_seq) {
							dlvp.ord_deli["0000001"].ord_goods[cart_seq] = { ord_qty: ORDER.goods.ord_goods[cart_seq].ord_qty };
						});
					});
				};
				this.ord_dlvps[dlvp_no] = dlvp;
				if ($.type(p.callback) == "function") {
					p.callback(dlvp_no);
				};
			},
			deliInfoCache: {},	//동일한 조건의 배송정보를 재조회 하지 않도록 결과를 저장한다.
			getDeliInfo: function(p) {				
				var data = (function() {
					var free_use_pnt = 0;
					var gift_use_pnt = 0;
					var study_use_pnt = 0;
					$.each(ORDER.goods.ord_goods, function(cart_seq) {
						free_use_pnt += this.free_use_pnt;
						gift_use_pnt += this.gift_use_pnt;
						study_use_pnt += this.study_use_pnt;						
					});
					return { cart: [], free_pnt: free_use_pnt, study_pnt: study_use_pnt, gift_pnt: gift_use_pnt };
				})();
				var deliCallback = function(data) {
					var deli = data.deli;
					var poss = data.poss;
					$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
						$.each(this.ord_deli, function(dlvp_seq) {
							if (deli[dlvp_no + "-" + dlvp_seq]) {
								this.deli = $.extend(this.deli, deli[dlvp_no + "-" + dlvp_seq]);									
							} else {
								delete this.deli;
							};
							$.each(this.ord_goods, function(cart_seq) {
								if (poss[dlvp_no] && poss[dlvp_no][dlvp_seq] && poss[dlvp_no][dlvp_seq][cart_seq]) {
									this.deli_poss_yn = poss[dlvp_no][dlvp_seq][cart_seq];										
								} else {
									this.deli_poss_yn = "";
								};
							});
						});
					});
					if ($.type(p.callback) == "function") {
						p.callback(data);
					};
				};
				var params = "";
				var hashcode = "";
				//배송지별 상품정보
				$.each(ORDER.dlvp.ord_dlvps, function(dlvp_no) {
					var dlvp = this;
					var ord_deli = this.ord_deli;
					$.each(ord_deli, function(dlvp_seq) {
						$.each(this.ord_goods, function(cart_seq) {
							var dlvp_goods = this;		//배송지별 배송 상품
							var goods = ORDER.goods.ord_goods[cart_seq];	//주문 상품 정보
							if (goods.goods_disp_divi_cd == "20") { //복지몰전용상품은 무조건 셋팅, pkg에서 wfr_yn로 복지포인트 사용여부 확인함
								goods.wfr_yn = "Y";
							}
							if (dlvp_goods.ord_qty > 0) {								
								data.cart.push({
									cart_no: goods.cart_no,
									cart_seq : cart_seq,
									cart_grp_cd: goods.cart_grp_cd,
									goods_no: goods.goods_no,
									item_no: goods.item_no,
									vir_vend_no: goods.vir_vend_no,
									margin_rate: goods.margin_rate,
									sale_price: goods.sale_price,
									ord_qty: goods.ord_qty,
									dc_price: goods.dc_price,
									dlvp_no: dlvp_no,
									dlvp_seq: goods.dlvp_seq,
									dlvp_ord_cnt: dlvp_goods.ord_qty,
									r_city_exp_yn: dlvp.address.city_exp_yn,
									post_no: dlvp.address.addr_divi_cd == "10" ? dlvp.address.recvr_post_no : dlvp.address.recvr_road_post_no, 
								});
								if (goods.wfr_yn) {
									data.cart[data.cart.length - 1].wfr_yn = goods.wfr_yn; 
								};
							};
						});
					});
				});
				params = JSON.stringify(data);
				hashcode = params.hashCode();
				if (this.deliInfoCache[hashcode]) {	//기 조회된 정보가 있다면...
					deliCallback(this.deliInfoCache[hashcode]);
				} else {
					$.ajax({
						url: "/order/searchDeliInfo.action",
						data: { data: params },
						type: "POST",
						dataType: "json",
						success: function(data) {
							ORDER.dlvp.deliInfoCache[hashcode] = data;
							deliCallback(data);
						},
						error: function() {
							alert("배송정보를 조회 할 수 없습니다.");
						}
					});
				};
			}
		},
		createOrderData: function() {
			var ord_dlvps = {};
			var order_data = {
				ord_mst: {},
				ord_dlvps: [],
				ord_benes: [],
				ord_goods: [],
				ord_pays: [],
				ord_memos: [],
				ord_extras: []
			};
			var map_benefit = {};	//장바구니 쿠폰, 주문 사은품등 주문 단위로 적용되는 혜택 정보 확인용
			var dlvp_count = 0;
			var ord_gift_dlvp_seq = "";	//주문 사은품 배송지 순번 
			
			// [START] 실제 배송 정보만 셋팅(실 주문상품이 존재하는 dlvp만 선별)
			$.each(this.dlvp.ord_dlvps, function(dlvp_no) {
				var dlvp_ord_qty = 0;
				var ord_deli = {};
				var ord_gift_yn = this.ord_gift_yn;
				$.each(this.ord_deli, function(dlvp_seq) {
					var deli_ord_qty = 0;
					var ord_goods = {};
					$.each(this.ord_goods, function(cart_seq) {
						dlvp_ord_qty += this.ord_qty;
						deli_ord_qty += this.ord_qty;
						if (this.ord_qty > 0) {
							ord_goods[cart_seq] = { ord_qty: this.ord_qty, deli_hope_dtime: this.deli_hope_dtime,deli_time_gb: this.deli_time_gb };
						};
					});
					if (deli_ord_qty > 0) {
						ord_deli[dlvp_seq] = { ord_goods: ord_goods };
					};
				});
				if (dlvp_ord_qty > 0) {
					dlvp_count++;
					ord_dlvps[dlvp_no] = {
						temp_ord_seq: dlvp_count.zf(7),
						ord_deli: ord_deli
					};
					if (ord_gift_yn == "Y") {
						ord_gift_dlvp_seq = ord_dlvps[dlvp_no].temp_ord_seq; 
					};
				};		
			});
			// [END] 실제 배송 정보만 셋팅

			// [START] od_temp_ord_mst
			$.extend(order_data.ord_mst, {
				mbr_no: "",
				//client_no: "",
				//site_no: "",
				orderer_nm: this.mst.ord_mst.orderer_nm,
				orderer_eng_nm: "",
				tel_no1: this.mst.ord_mst.tel_no1,
				tel_no2: this.mst.ord_mst.tel_no2,
				tel_no3: this.mst.ord_mst.tel_no3,
				cell_no1: this.mst.ord_mst.cell_no1,
				cell_no2: this.mst.ord_mst.cell_no2,
				cell_no3: this.mst.ord_mst.cell_no3,
				email: this.mst.ord_mst.email,
				isbn_use_yn : this.mst.ord_mst.isbn_use_yn,
				present_yn : this.mst.ord_mst.present_yn,
				post_no: "",
				base_addr: "",
				dtl_addr: "",
				road_post_no: "",
				road_base_addr: "",
				road_dtl_addr: "",
				addr_divi_cd: "",
				ord_chnl_cd: "",
				ord_type_cd: "",
				temp_ord_divi_cd: "",
				cash_receipt_issue_cd: "",
				cash_receipt_use_divi_cd: "",
				cash_receipt_cert_no: "",
				orderer_ip_addr: "",
				ord_server_nm: "",
				ord_no: "",
				ori_ord_no: "",
				escrow_yn: "N",
				mail_recv_yn: "N",
				sms_recv_yn: "N",
				store_no: "",
				pc_key: "",
				recomm_remark: "", 
				customs_id: "", 
				benefitKey: this.mst.benefitKey,
				disp_mall_no: elandmall.global.disp_mall_no
				//result_cd
				//result_msg
			});
			// [END] od_temp_ord_mst			
			
			// [START] od_temp_ord_dlvp
			$.each(ord_dlvps, function(dlvp_no) {	//배송지별 배송 정보
				var dlvp = ORDER.dlvp.ord_dlvps[dlvp_no];
				var address = dlvp.address;
				var dlvp_temp_ord_seq = this.temp_ord_seq;
				var memo = (dlvp.cart_grp_cd == "10" || dlvp.cart_grp_cd == "60" || dlvp.cart_grp_cd == "70") ? $.trim(dlvp.getOrdMemo()) : "" ;
				var custId = (dlvp.cart_grp_cd == "10" || dlvp.cart_grp_cd == "60" || dlvp.cart_grp_cd == "70") ?  $.trim(dlvp.getCustomsId()) : "" ;
				var memo_temp_ord_seq = "";
				var laddercar_yn  = "";
				var elevator_yn   = "";
				var wellanchor_yn = "";
				
				if(typeof(dlvp.elevator_yn) != "undefined") {
					laddercar_yn  = (dlvp.laddercar_yn  == null || dlvp.laddercar_yn == "")	?"N":(dlvp.laddercar_yn);
					elevator_yn	  = (dlvp.elevator_yn   == null || dlvp.elevator_yn == "")	?"N":(dlvp.elevator_yn);
					wellanchor_yn = (dlvp.wellanchor_yn == null || dlvp.wellanchor_yn == "")?"N":(dlvp.wellanchor_yn);
				}
				
				order_data.ord_dlvps.push({
					temp_ord_seq: dlvp_temp_ord_seq,
					dlvp_no: dlvp_no,
					mbr_dlvp_seq: address.mbr_dlvp_seq,
					dlvp_nm: !address.dlvp_nm || address.dlvp_nm == "" ? "미지정" : address.dlvp_nm ,
					recvr_nm: address.recvr_nm,
					recvr_post_no: address.recvr_post_no,
					recvr_base_addr: address.recvr_base_addr,
					recvr_dtl_addr: address.recvr_dtl_addr,
					recvr_road_post_no: address.recvr_road_post_no,
					recvr_road_base_addr: address.recvr_road_base_addr,
					recvr_road_dtl_addr: address.recvr_road_dtl_addr,
					addr_divi_cd: address.addr_divi_cd,
					recvr_email: address.recvr_email,
					recvr_tel1: address.recvr_tel1,
					recvr_tel2: address.recvr_tel2,
					recvr_tel3: address.recvr_tel3,
					recvr_cell_no1: address.recvr_cell_no1,
					recvr_cell_no2: address.recvr_cell_no2,
					recvr_cell_no3: address.recvr_cell_no3,
					ord_memo_cont: memo,
					cart_grp_cd: dlvp.cart_grp_cd,
					base_yn: dlvp.base_yn ,	//기본 배송지 지정 여부
					laddercar_yn:laddercar_yn ,	//사다리차 이용 동의
					elevator_yn: elevator_yn,	//엘리베이터 유무
					wellanchor_yn: wellanchor_yn //벽고정설치 유무				
				});
				// [START] od_temp_ord_memo
				if (memo != "") {
					memo_temp_ord_seq = (order_data.ord_memos.length + 1).zf(7);
					order_data.ord_memos.push({
						temp_ord_seq: memo_temp_ord_seq,
						ord_memo_divi_cd: "10",
						ord_memo_cont: dlvp.getOrdMemo(),
						recv_nm: "",
						send_nm: ""
					});
				};
				// [END] od_temp_ord_memo
				
				// [START] od_temp_ord_goods(배송지별 상품) 
				$.each(this.ord_deli, function(dlvp_seq) {	//dlvp_seq별로 배송비 부과
					var deli = dlvp.ord_deli[dlvp_seq].deli;
					var deli_temp_ord_seq = (order_data.ord_benes.length + 1).zf(7);	//배송비 seq
					var ord_deli = {};
					if (dlvp.cart_grp_cd == "10" || dlvp.cart_grp_cd == "60" || dlvp.cart_grp_cd == "70") {	//택배배송, 퀵배송
						ord_deli.deli_cost_amt = deli.r_deli_cost_amt ; 
						ord_deli.city_exp_deli_cost = deli.r_city_exp_deli_cost ; 
						ord_deli.st_amt = deli.st_amt;
						ord_deli.deli_cost_poli_no = deli.r_deli_cost_poli_no;
						ord_deli.deli_cost_form_cd = deli.r_deli_cost_form_cd;
						ord_deli.free_use_pnt = deli.free_use_pnt;
						ord_deli.study_use_pnt = deli.study_use_pnt;
						ord_deli.gift_use_pnt = deli.gift_use_pnt;
						if (deli.r_deli_coupon_promo_no != "" && deli.coupon_use_yn == "Y") {	//배송비 쿠폰 사용
							ord_deli.rel_no = deli.r_deli_coupon_promo_no;
							ord_deli.rel_dtl_no = deli.r_deli_coupon_rsc_no;
							ord_deli.rel_divi_cd = "10";
							ord_deli.cost_reason_cd = "40";
						};
					};
					order_data.ord_benes.push($.extend({	//배송비 정보
						temp_ord_seq: deli_temp_ord_seq,
						issue_divi_cd: "10",	//10:발생, 20:취소
						cost_kind_cd: "20",		//10:혜택, 20:비용
						cost_kind_dtl_cd: "10",
						rel_divi_cd: "10",	//10:프로모션, 20:상품할인유형코드
						rel_no: "",
						rel_dtl_no: "",
						free_use_pnt: deli ? deli.free_use_pnt : 0 ,
						gift_use_pnt: deli ? deli.gift_use_pnt : 0 ,
						study_use_pnt: deli ? deli.study_use_pnt : 0 ,
						deli_cost_unit_qty: "",	//NUMBER
						cost_amt: "",	//DOUBLE
						cost_reason_cd: "10",
						cost_cancel_reason: "",
						temp_bene_rel_no: ""						
					}, ord_deli));
					//배송비별 상품정보
					$.each(this.ord_goods, function(cart_seq) {
						var goods_temp_ord_seq = (order_data.ord_goods.length + 1).zf(7);	//주문상품 seq
						var goods = ORDER.goods.ord_goods[cart_seq];
						var ord_qty = this.ord_qty;
						var addGoods = function(p) {
							order_data.ord_goods.push(p);
						};
						
						var pgoods = {		//주문상품 정보
							order_divi_cd: goods.order_divi_cd,
							post_no: dlvp.address.addr_divi_cd == "10" ? dlvp.address.recvr_post_no : dlvp.address.recvr_road_post_no,
							temp_ord_seq: goods_temp_ord_seq,
							goods_no: goods.goods_no,
							item_no: goods.item_no,
							ord_qty: ord_qty,
							vir_vend_no: goods.vir_vend_no,
							upper_temp_ord_seq: goods.cmps_divi_cd == "20" ? goods_temp_ord_seq : "",
							pkg_goods_no: goods.cmps_divi_cd == "20" ? goods.goods_no : "" ,
							pkg_goods_seq: 0,	//NUMBER
							cart_no: goods.cart_no,													
							disp_goods_nm: goods.disp_goods_nm,
							present_pkg_yn: "N",
							free_use_pnt: goods.free_use_pnt,
							study_use_pnt: goods.study_use_pnt,
							gift_use_pnt: goods.gift_use_pnt,
							field_recev_yn: goods.cart_grp_cd == "40" ? "Y" : "N" ,
							sale_area_no: goods.sale_area_no,
							sale_shop_divi_cd: goods.sale_shop_divi_cd,
							sale_shop_no: goods.sale_shop_no,
							temp_dlvp_rel_no: dlvp_temp_ord_seq,	//임시 배송지 순번
							temp_bene_rel_no: "," + deli_temp_ord_seq + ",",	//배송비 bene의 순번
							temp_memo_rel_no: memo_temp_ord_seq	,//임시 메모 순번	,
							deli_hope_day_yn: goods.deli_hope_day_yn,
							isbn_use_yn: goods.isbn_use_yn, //ISBN상품여부
							custom_clearance_yn : goods.custom_clearance_yn, // 개인통관고유부호							
							customs_id : goods.custom_clearance_yn == "Y" ? custId: "", // 개인통관고유부호
							cust_prod_yn: goods.cust_prod_yn, 		//주문제작여부
							cust_item_nm: goods.cust_item_nm, 		//주문제작단품명
							cust_item_no: goods.cust_item_no, 		//주문제작단품번호
							cust_item_key: goods.cust_item_key, 	//주문제작단품키
							goods_opt_data: goods.goods_opt_data, 	//주문제작옵션데이터
							shopcode: goods.shopcode, 				//픽업매장코드
							set_cust_sale_price : goods.cust_prod_yn == "Y" ? goods.sale_price : 0, //주문제작가격설정
							quick_deli_yn: goods.cart_grp_cd == "60" ? "Y" : "N", // 오늘받송 정보
							lot_deli_yn: goods.cart_grp_cd == "70" ? "Y" : "N", // 오늘직송 배송정보
							center_no: goods.center_no							
						};
						if (goods.set_goods_no !=  "") {	//묶음상품
							pgoods.pkg_goods_no = goods.set_goods_no
						};
						if(goods.goods_type_cd != "20" && goods.low_vend_type_cd != "50"){
							if (goods.cart_grp_cd == "40" || goods.deli_hope_day_yn == "Y" ||goods.order_divi_cd == "10" || goods.order_divi_cd == "30" ) {	//매장 수령일 또는 희망 배송일 설정							
								
								if(goods.order_divi_cd == "10" || goods.order_divi_cd == "30") $.extend(pgoods, { deli_hope_dtime: this.deli_hope_dtime.substring(0, 4) + "-" + this.deli_hope_dtime.substring(4, 6) + "-" + this.deli_hope_dtime.substring(6) + " 00:00:00.000000000" ,deli_time_gb: this.deli_time_gb});
								else $.extend(pgoods, { deli_hope_dtime: this.deli_hope_dtime.substring(0, 4) + "-" + this.deli_hope_dtime.substring(4, 6) + "-" + this.deli_hope_dtime.substring(6) + " 00:00:00.000000000" });
							};
						};
						addGoods(pgoods);		//주문 상품 정보 저장						
						if (goods.cmps_divi_cd == "20") {	//세트상품일 경우 구성품도 추가
							$.each(goods.set_items, function() {
								var set = this;
								addGoods({
									temp_ord_seq: (order_data.ord_goods.length + 1).zf(7),
									upper_temp_ord_seq: goods_temp_ord_seq,
									goods_no: set.goods_no,
									item_no: set.item_no,
									ord_qty: ord_qty,
									vir_vend_no: set.vir_vend_no,
									pkg_goods_no: goods.goods_no,
									pkg_goods_seq: set.pkg_goods_seq,
									cmps_grp_seq: set.cmps_grp_seq,
									cart_no: set.cart_no,													
									disp_goods_nm: set.disp_goods_nm,							
									present_pkg_yn: "N",
									field_recev_yn: goods.cart_grp_cd == "40" ? "Y" : "N" ,
									sale_area_no: set.sale_area_no,
									sale_shop_divi_cd: set.sale_shop_divi_cd,
									sale_shop_no: set.sale_shop_no,
									temp_dlvp_rel_no: dlvp_temp_ord_seq,	//임시 배송지 순번
									temp_bene_rel_no: "," + deli_temp_ord_seq + ",",
									temp_memo_rel_no: memo_temp_ord_seq,	//임시 메모 순번	
									cust_prod_yn: set.cust_prod_yn, //주문제작여부
									cust_item_nm: set.cust_item_nm, //주문제작단품명
									goods_opt_data: set.goods_opt_data, //주문제작옵션데이터
									quick_deli_yn: goods.cart_grp_cd == "60" ? "Y" : "N",
									lot_deli_yn: goods.cart_grp_cd == "70" ? "Y" : "N",
									center_no: goods.center_no
								});
							});
						};
						//od_temp_org_goods 셋팅 후 상품별 bene 정보 저장
						$.each(ORDER.benefits.cart_benefits[cart_seq], function(benefit_seq) {
							var benefit = this;
							var pbenefit = undefined;
							if (benefit.apply_poss_yn != "Y" || benefit.select_yn != "Y" || benefit.promo_type_no == "103") {		//apply_poss_yn, select_yn 모두 Y인 건만 저장
								return true;
							};
							if (benefit.promo_type_no == "1000000011" && goods.gift_items.length == 0) {	//상품 사은품이 존재 한다면...
								return true;
							};
							if (benefit.promo_type_no == "1000000007") {	//장바구니쿠폰(주문단위)
								pbenefit = map_benefit[benefit.promo_type_no + "|" + benefit.promo_no + "|" + benefit.resou_no];
							} else if (benefit.promo_type_no == "1000000012") {	//주문사은품(주문단위)
								pbenefit = map_benefit[benefit.promo_type_no];
							};
							if (!pbenefit) {	//혜택 정보 저장
								pbenefit = {		//혜택정보
									temp_ord_seq: (order_data.ord_benes.length + 1).zf(7),
									issue_divi_cd: "10",	//10:발생, 20:취소
									cost_kind_cd: "10",		//10:혜택, 20:비용
									cost_kind_dtl_cd: benefit.bene_poli_cd,
									rel_divi_cd: "10",	//10:프로모션, 20:상품할인유형코드
									rel_no: benefit.promo_no,
									rel_dtl_no: benefit.resou_no,
									rel_dtl_no1: benefit.promo_type_no,
									deli_cost_poli_no: "",
									st_amt: 0,	//DOUBLE
									deli_cost_amt: "",	//DOUBLE
									deli_cost_unit_qty: "",	//NUMBER
									cost_amt: "",	//DOUBLE
									city_exp_deli_cost: "",	//DOUBLE
									cost_reason_cd: "",
									cost_cancel_reason: "",
									temp_bene_rel_no: "",
									deli_cost_form_cd: "",
									apply_qty:benefit.apply_qty
								};
								order_data.ord_benes.push(pbenefit);	//bene정보 저장
								
								if (benefit.promo_type_no == "1000000007") {	//장바구니쿠폰(주문단위)
									map_benefit[benefit.promo_type_no + "|" + benefit.promo_no + "|" + benefit.resou_no] = pbenefit;
								} else if (benefit.promo_type_no == "1000000012") {	//주문사은품(주문단위)
									map_benefit[benefit.promo_type_no] = pbenefit;
								};
								if (benefit.promo_type_no == "1000000011" && goods.gift_items.length > 0) {		//상품 사은품의 경우
									pbenefit.rel_dtl_no = benefit.gift_mgmt_no;
									$.each(goods.gift_items, function(i) {		//상품 사은품도 주문 상품으로 저장
										var gift = {
											temp_ord_seq: (order_data.ord_goods.length + 1).zf(7),
											gift_goods_dtl_no: this.gift_goods_dtl_no,
											goods_no: this.goods_no,
											item_no: this.item_no,
											ord_qty: goods.ord_qty,
											vir_vend_no: this.vir_vend_no,
											gift_divi_cd: this.gift_divi_cd,
											temp_dlvp_rel_no: dlvp_temp_ord_seq,
											present_pkg_yn: "N"
										};
										addGoods(gift);
										pbenefit.temp_bene_rel_no += ("," + gift.temp_ord_seq + ",");		//해당 혜택 정보에 상품 사은품의 순번을 연결
									});
								} else if (benefit.promo_type_no == "1000000012") {	//주문 사은품의 경우;
									pbenefit.rel_dtl_no = benefit.gift_mgmt_no;
									$.each(benefit.order_gift_items, function() {
										if (this.select_yn == "Y") {
											var gift = {
												temp_ord_seq: (order_data.ord_goods.length + 1).zf(7),
												gift_goods_dtl_no: this.gift_goods_dtl_no,
												goods_no: this.goods_no,
												item_no: this.item_no,
												ord_qty: this.cmps_qty,
												vir_vend_no: this.vir_vend_no,
												gift_divi_cd: this.gift_divi_cd,
												temp_dlvp_rel_no: ord_gift_dlvp_seq,
												present_pkg_yn: "N"
											};
											addGoods(gift);
											pbenefit.temp_bene_rel_no += ("," + gift.temp_ord_seq + ",");		//해당 혜택 정보에 상품 사은품의 순번을 연결
										};
									});
								} else if (benefit.promo_type_no == "1000000026") {	//상품포장의 경우;
									pbenefit.rel_dtl_no = benefit.gift_mgmt_no;
									$.each(benefit.wrapping_gift_items, function() {
										if (this.select_yn == "Y") {
											var gift = {
												temp_ord_seq: (order_data.ord_goods.length + 1).zf(7),
												gift_goods_dtl_no: this.gift_goods_dtl_no,
												goods_no: this.goods_no,
												item_no: this.item_no,
												ord_qty: this.cmps_qty,
												vir_vend_no: this.vir_vend_no,
												gift_divi_cd: this.gift_divi_cd,
												temp_dlvp_rel_no: ord_gift_dlvp_seq,
												present_pkg_yn: "N"
											};
											addGoods(gift);
											pbenefit.temp_bene_rel_no += ("," + gift.temp_ord_seq + ",");		//해당 혜택 정보에 상품 사은품의 순번을 연결
										};
									});
								};
							};
							pgoods.temp_bene_rel_no += ("," + pbenefit.temp_ord_seq + ",");		//주문상품에 적용된 bene 순번을 저장
						});
					});
				});
				// [END] od_temp_ord_goods
			});
			// [END] od_temp_ord_dlvp
			
			// [START] od_temp_ord_extras 준비된 상품으로 부터 시작
			$.each(order_data.ord_goods, function(g_idx, goods){
				if( goods.lot_deli_yn == "Y") { // 하이퍼 상품의 경우
					var center_no = goods.center_no;
					if( ORDER.deli.hyper_deli[center_no] != null ) {
						$.each(ORDER.deli.hyper_deli[center_no], function(h_idx, hyper_deli) {
							if(hyper_deli.select_yn == "Y") {
								order_data.ord_extras.push({ 
									temp_ord_seq: goods.temp_ord_seq,
									lot_deli_yn: "Y",
									dlv_date: hyper_deli.lot_dlv_date,
									dlv_seq: hyper_deli.lot_dlv_seq,
									bgn_tm: hyper_deli.lot_bgn_tm,
									end_tm: hyper_deli.lot_end_tm,
								});
								return false;
							}
						})
					} 
				}
			});
			// [END] od_temp_ord_extras
			
			// [START] od_temp_ord_pay
			$.each(ORDER.pay.ord_pays, function(pay_seq) {
				var pay = ORDER.pay.pays[pay_seq];
				var ord_pay = this;
				var cardcomp = undefined;
				var pay_amt = pay.pay_amt;
				var p_mers_divi_cd = "10";   //가맹점구분자 일반:10 ,지류상품권:40
				var p_mers_no = "";
				if(typeof(this._payments_) != "undefined" && typeof(this._payments_.mers_no) != "undefined") p_mers_no = this._payments_.mers_no;
				if(typeof(this._payments_) != "undefined" && typeof(this._payments_.isbn_use_yn) != "undefined") {
					if(this._payments_.isbn_use_yn == "Y") p_mers_divi_cd = "50";
				}
				if (pay_amt <= 0) {
					return true;
				};
				if (pay.pay_mean_cd == "11") {	//신용카드
					if(pay.ticket == "Y") p_mers_divi_cd = "40";
					
					cardcomp = pay.getCardcomp();
					if (ORDER.pay.card_noint[cardcomp.cardcomp_cd]) {
						if (ORDER.pay.card_noint[cardcomp.cardcomp_cd]["072"] && ORDER.pay.card_noint[cardcomp.cardcomp_cd]["072"][cardcomp.noint_mon]) {	//(부분)무이자 프로모션
							if (pay.pay_amt >= ORDER.pay.card_noint[cardcomp.cardcomp_cd]["072"][cardcomp.noint_mon].base_amt) {
								ord_pay.noint_no = ORDER.pay.card_noint[cardcomp.cardcomp_cd]["072"][cardcomp.noint_mon].promo_no;
							};
						};
						if (ORDER.pay.card_noint[cardcomp.cardcomp_cd]["073"]) {	//청구할인 프로모션
							if (pay.pay_amt >= ORDER.pay.card_noint[cardcomp.cardcomp_cd]["073"].base_amt) {
								ord_pay.clm_dscnt_no = ORDER.pay.card_noint[cardcomp.cardcomp_cd]["073"].promo_no;								
							};
						};
					};					
				};
			
				
				order_data.ord_pays.push($.extend(ord_pay, {
					pay_seq: pay_seq,
					temp_ord_seq: (order_data.ord_pays.length + 1).zf(7),
					pay_no: ord_pay.pay_no ? ord_pay.pay_no : "" ,
					pay_divi_cd: "10",
					pay_mean_cd: pay.pay_mean_cd,
					cardcomp_no: "",
					pay_amt: pay_amt,	//NUMBER
					bank_cd: "",
					account_no: "",
					morc_nm: "",
					expiry_date: "",
					expiry_dtime: "",
					pay_log_no: "",
					coupon_issue_no: "",
					convt_receipt_no: "",
					ori_mbr_no: "",
					mers_divi_cd : p_mers_divi_cd,
					mers_no : p_mers_no
				}));
			});		

			// [END] od_temp_ord_pay
			return order_data;
		}
	};
})(jQuery);