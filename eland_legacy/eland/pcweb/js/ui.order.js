commonUI.orderFunc = commonUI.orderFunc || {};
commonUI.view.scrollFunc = commonUI.view.scrollFunc || {};
commonUI.view.msgAutoComplete = commonUI.view.msgAutoComplete || {};

commonUI.orderFunc = function (){
	$(window).ready(function(){
		var commonUIViewScrollFunc = new commonUI.view.scrollFunc();
	})
}

commonUI.orderFuncMsg = function (){
	$(window).ready(function(){
		commonUI.view.msgAutoComplete();
	})
}


commonUI.view.scrollFunc = function(){
	this.orderPrice = false; //

	this.init();
}

commonUI.view.scrollFunc.prototype = {
	init : function(){
		this.$target_price = $(".d_order_fixed");

		if ( commonUI.isTarget( this.$target_price ) ) return;

		this.$ordcont = $(".order_cont");
		this.$window = $(window);
		this.$document = $(document);
		this.$footer = $("#footer");
		this.headHeight = 56; //
		this.targetTop = this.$target_price.offset().top;

		this.eventInit();

	}
	,eventInit : function(){
		var that = this;
		this.$window.on("scroll , resize",function(e){
			that.scrollChk();

			e.preventDefault();
		})
	}
	,scrollChk : function(){
		this.scroll = this.$window.scrollTop()+this.headHeight;
		this.offsetFt = $(".order_left_wrap").offset().top + $(".order_left_wrap").outerHeight() - $(".order_cont").outerHeight();

		if (this.scroll >=  this.offsetFt){
			this.$target_price.addClass('over_foot');
		}
		else if(this.scroll <  this.offsetFt){
			this.$target_price.removeClass('over_foot');
			this.orderPrice = ( this.scroll >= this.targetTop ) ? true : false ;

			if ( this.orderPrice ){
				this.engine();
			}else{
				this.$target_price.removeClass("fixed");
				$(".order_right_wrap").css("top",38+"px");
			}
		}
	}
	,engine : function(){
		this.bottom = this.$document.height() - this.$ordcont.height() - this.scroll;
		this.foot = this.$footer.height() + parseInt(this.$footer.css("marginTop"));

		var _cssBottom = this.foot;
		var _cssTop = this.bottom - this.foot + this.headHeight;

		_css = ( this.foot >= this.bottom ) ? {"top" : _cssTop } : {"top" : this.headHeight };

		this.$target_price.addClass("fixed").css(_css);
	}
}

commonUI.view.msgAutoComplete = function(){
	var $target = $(".d_msgList");
	var wirteTxt = "직접입력"; // 직접입력 항목 체크 텍스트

	if ( commonUI.isTarget( $target ) ) return;

	var $inputs = $target.find(".d_msgInput");
	var $selects = $target.find(".d_msgSelect");
	var $links = $selects.find("a");

	$inputs.on( "click focus" , function(e){
		$target.addClass("on");

		_containerClick();

		e.preventDefault();
	});

	$links.on( "click" , function(e){
		var vals = $(this).html();
		vals = ( vals.indexOf(wirteTxt) > 0  )? "" : vals;

		$inputs.val(vals).focus();

		e.preventDefault();
	});

	$target.blur(function(e){
		$target.removeClass("on");
	})

	function _containerClick(){
		$("#wrapper").on( "click focus" ," #container " , function(e){
			if ( $(e.target).parents(".d_msgList").length < 1) {
				$target.removeClass("on");
				$("#wrapper").off( "click focus" , " #container ");
			}
		});
	}
}