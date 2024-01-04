﻿﻿/* 세팅 하기..
*/
(function($) {

	/*
	 * pin 데이타 받아서 변경 로직 필요시 사용 
	 * callback: function(start_date, end_date ){
					
       }
	 */
	$.fn.showCalendar = function(pin) {
		var defaultProps = {
				type:'one',   // 필수 :  two
				id:'calendar',
				title:'달력' 
		};
		
		pin = $.extend(defaultProps, pin||{});
		
		var id           = pin.id;  //달력id
		var append_obj   = ($.type(pin.append_id) != "undefined")?$("#"+pin.append_id):$(this); //생성한 레이어를 붙일 레이어
		
		var buttons = [];
		var div = null;
		this.each(function(i, button) {
			buttons.push(button);
		});

		var createCalendar = function(button, e) {
			
			 div = $("<div id=\"" + id + "\"></div>");
			
			 if(pin.type == "two") {
				 
				div.addClass('box_calendar type02 on');
			    
				if(pin.title){
				    div.append("<div class=\"tit_cal\">"+pin.title+"</div>");
				}
				
			    var cal_lcont =  $("<div></div>").addClass('cal_lcont');
			    cal_lcont.append($("<div></div>").addClass('cont_cal'));
			    div.append(cal_lcont);

			    var cal_rcont =  $("<div></div>").addClass('cal_rcont');
			    cal_rcont.append($("<div></div>").addClass('cont_cal'));
			    div.append(cal_rcont);
			    
		    
			} else {
				div.addClass('box_calendar on');
				
				if(pin.title){
				    div.append("<div class=\"tit_cal\">"+pin.title+"</div>");
				}
			    $("<div></div>").addClass('cont_cal').appendTo(div);
		    }
			
			
			div.find(".cont_cal").each(
							function(id) {
								
								var yyyymmdd = "";
								
								if(pin.type == "one") {
									
									yyyymmdd = append_obj.prev().val(); //날짜
									
								} else {

									//개발자 오류 사항
									var calender_obj = append_obj.parent().parent().find(".input_txt");
									if(calender_obj.length <= 1 ){
										alert("날짜를 선택해 주세요");
										return;
									}
									
									if($(this).parent().attr("class") == "cal_lcont"){
										yyyymmdd = calender_obj.eq(0).val(); //날짜
									} else {
									    yyyymmdd = calender_obj.eq(1).val(); //날짜
									}
								}
								var date = new Date(yyyymmdd.replace(/\./g,"/"));
								if (isNaN(date)) {
									date = new Date();
								};
								
								var calendar = $(this);
								var cal_month = $("<div></div>").addClass('set_cal_control');
								cal_month.append("<a class=\"btn_prev_month\" id=\"cprev\" href=\"javascript:;\"><img src=\""+ elandmall.global.image_path +"/images/pcweb/common/btn_calendar_prev.gif\" alt=\"이전 달 보기\" /></a>");
								cal_month.append("<a class=\"btn_next_month\" id=\"cnext\" href=\"javascript:;\"><img src=\""+ elandmall.global.image_path +"/images/pcweb/common/btn_calendar_next.gif\" alt=\"다음 달 보기\" /></a>");
								cal_month.append("<strong class=\"current_year\">"+date.format("yyyy.MM") + "</strong>");
								calendar.append(cal_month);
								
								
								calendar.find("a#cprev").click(
										function() {
											var showYYYYMM = $(this).parent().find(".current_year");
											var showDt = rtnDateCalnder( showYYYYMM.text() , 'M' , -1 );
											showYYYYMM.html(showDt.format("yyyy.MM"));
											load(calendar, showDt);
										});
								calendar.find("a#cnext").click(
										function() {
											var showYYYYMM = $(this).parent().find(".current_year");
											var showDt = rtnDateCalnder( showYYYYMM.text() , 'M' ,1 );
											showYYYYMM.html(showDt.format("yyyy.MM"));
											load(calendar, showDt);
										});
								
	                            var cal_cont = $("<div><table><caption>달력</caption><thead><tr></tr></thead><tbody></tbody></table></div>").addClass('tbl_calendar');
	                            var week_cont = cal_cont.find("thead>tr");
	                            week_cont.append($("<th scope=\"col\">Su</th>").addClass('su'));
	                            week_cont.append($("<th scope=\"col\">Mo</th>"));
	                            week_cont.append($("<th scope=\"col\">Tu</th>"));
	                            week_cont.append($("<th scope=\"col\">We</th>"));
	                            week_cont.append($("<th scope=\"col\">Th</th>"));
	                            week_cont.append($("<th scope=\"col\">Fr</th>"));
	                            week_cont.append($("<th scope=\"col\">Sa</th>"));
	                            
	                            calendar.append($("<a href=\"javascript:;\"><img src=\""+ elandmall.global.image_path + "/images/pcweb/common/btn_close_calendar.gif\" alt=\"달력 레이어 팝업 닫기\" /></a>").addClass('btn_cal_close'));
								calendar.append(cal_cont);
								
								
								load(calendar, date);
							});
			
			div.find(".btn_cal_close").click(function() { // 닫기 버튼 클릭시 캘린더 제거
				$('#'+id).remove();
			});
			
			div.insertAfter(append_obj);
			div.show();
		};
		
		var rtnDateCalnder = function(sYYYYMM , gubun ,nAmt) {
			var chkDate = new Date(sYYYYMM.replaceAll("\\." , "/")+"/1");
			if(nAmt){
				if(gubun == "M"){
				    chkDate.setMonth(chkDate.getMonth()+ (nAmt));
				}else {
					chkDate.setFullYear(chkDate.getFullYear()+ (nAmt));
				}
			}
			return chkDate;
		}
		
		var setDateBind = function (chk){
			
			if(pin.type == "one") {
				
				if($.type(pin.callback) !="undefined") {
					pin.callback({start_date:{yyyy:chk.attr("yyyy"), mm:chk.attr("mm") , dd:(chk.text()).zf(2)}});
				} else {
					append_obj.prev().val(chk.attr("yyyy") + "." + chk.attr("mm") + "." +  (chk.text()).zf(2));	
				}
			} else {

				var chk  = div.find("td > a.chk_date");
				if(chk.length <= 1 ){
					alert("날짜를 선택해 주세요");
					return;
				}
				
				//날짜체크
				var stDate = new Date(chk.eq(0).attr("yyyy")+"/"+ chk.eq(0).attr("mm") +"/" + chk.eq(0).text());
				var endDate = new Date(chk.eq(1).attr("yyyy")+"/" + chk.eq(1).attr("mm") +"/" + chk.eq(1).text());
				
				if(stDate.getTime() >  endDate.getTime()){
					alert("시작일이 종료일보다 클수 없습니다.");
					return;
				}
				
				if($.type(pin.callback) !="undefined") {
					pin.callback({start_date:{yyyy:stDate.getFullYear(), mm:(stDate.getMonth() + 1).zf(2) , dd:stDate.getDate().zf(2)}},
							     {end_date:{yyyy:endDate.getFullYear(), mm:(endDate.getMonth() + 1).zf(2) , dd:endDate.getDate().zf(2)}});
				} else {
					
					var calender_obj = append_obj.parent().parent().find(".input_txt");
					//날짜셋팅
					$.each(calender_obj , function(idx, obj){
						
						if(idx== 0){  //시작일
							$(obj).val(stDate.getFullYear()+"."+ (stDate.getMonth() + 1).zf(2) +"."+ stDate.getDate().zf(2));
						} else {
							$(obj).val(endDate.getFullYear()+"."+ (endDate.getMonth() + 1).zf(2) +"."+ endDate.getDate().zf(2));
						}
					} );
				}
			}
			
			$('#'+id).remove();
		}
		
		var load = function(calendar, date) { // 날짜 정보를 달력에 load 한다.
			$.ajax({
				url : "/dispctg/calendar.action",
				dataType : "json",
				data : {
					yyyymm : date.format("yyyyMM")
				},
				async : false,
				success : function(data) {

					var yyyy = data.YYYY; 
					var MM = data.MM;
					var days = data.DAYS;
					var tbody = calendar.find(".tbl_calendar > table > tbody");
					tbody.empty(); //clear
		            var tr_obj;
					$.each(days, function(i) {
				            var selected = "";
				           
				            if(date.getDate() ==  days[i]){
				            	selected = "class=\"chk_date\"";
				            }
				            
				            var sun_class = "";
				            if( (i % 7 ) == 0) {
				            	tr_obj = $("<tr></tr>");
				            	sun_class = "class=\"su\"";
				            }
				            
				            var date_td = $("<td "+sun_class+"></td>");
				            
				            if(days[i] != "") {
				            	
				            	var a = $("<a yyyy=\""+yyyy+"\" mm=\""+MM+"\" href=\"javascript:;\"" +selected +">"+ days[i] + "</a>").click(
										function() {
											
											calendar.find(".chk_date").removeClass("chk_date");
											$(this).addClass("chk_date");
		
											//날짜셋팅
											setDateBind(a);
											
										});
				            }
				            
				            tr_obj.append(date_td.append(a));
				            
				            if((i % 7 ) == 6) {
			            		tbody.append(tr_obj);
			            	}
				    });
				}
			});
		};

		$(buttons).each(function() {
			var button = $(this); // 달력버튼
				button.click(function(e) {
					e.stopPropagation();
					$("#"+ id).remove();
					createCalendar(button ,e);
				});
		
		});
	};
})(jQuery);