var stickyFilter = { // by Jeong EuiChan @ Pionnet ( 2018.05 )
	danamicVar : {
		reload : function(){
			this.scrollPst = $(window).scrollTop() + 56; // 56 : mini GnB height
			this.wrapperPst = $('.set_list_filter').offset().top;
			this.ulPst = $('.set_list_filter > ul').offset().top;
			this.ulEnd = $('.set_list_filter > ul >li:last-child .depth2').offset().top + $('.set_list_filter > ul >li:last-child .depth2').outerHeight();
			this.ulLimit = $('.set_list_filter > ul >li:last-child')[0].limitVertical;
			this.currentEnd = $('.set_list_filter > ul >li:last-child > a').offset().top + $('.set_list_filter > ul >li:last-child > a').outerHeight();
		}
	}
	, setValue : function(){
		$('.set_list_filter > ul > li').each(function(){
		 	$(this)[0].thisIDX = $('.set_list_filter > ul > li').index($(this));
		 	$(this)[0].limitVertical = $(this)[0].thisIDX * ($('.set_list_filter > ul > li > a').outerHeight()) + 56 ; // 56 : mini GnB height
		});
		$('.set_list_filter > ul')[0].initalOfst = $('.set_list_filter > ul').offset().top;
	}

	, toggle : function(ele){
		ele.parent('li').hasClass('active') ? this.closeC(ele) : this.openC(ele);
	}

	, close : function(ele){
		ele.parent('li').removeClass('active');
	}

	, open : function(ele){
		ele.parent('li').addClass('active');
	}

	, closeC : function(ele){
		$('html, body').scrollTop(ele.next('.depth2').offset().top+ele.next('.depth2').outerHeight()-ele.parent()[0].limitVertical)
	}

	, openC : function(ele){
		$('html, body').scrollTop(ele.parent('li').offset().top - ele.parent('li')[0].limitVertical+1)
	}

	, sticky : function(ele){
		var preSbling = ele.not($('.set_list_filter > ul > li:first-child > a')).parent().prev().find('>a');
		ele.addClass('sticky')
		.css({
			top : ele.parent()[0].limitVertical
		});
		this.close(preSbling);
	}

	, takeAway : function(ele){
		var preSbling = ele.not($('.set_list_filter > ul > li:first-child > a')).parent().prev().find('>a');
		ele.removeClass('sticky')
		.css({
			top: 'auto'
		})
		this.open(preSbling);
	}

	, calc : function(){
		this.danamicVar.reload();
		if(this.danamicVar.scrollPst >= this.danamicVar.wrapperPst){
			stickyFilter.sticky($('.set_list_filter > ul > li:first-child > a'));
		}
		else if(this.danamicVar.scrollPst < this.danamicVar.ulPst){
			stickyFilter.takeAway($('.set_list_filter > ul > li:first-child > a'));
		}

		if(this.danamicVar.ulEnd <= this.danamicVar.currentEnd){
			this.close($('.set_list_filter > ul > li:last-child > a'));
		}
		else if(this.danamicVar.ulEnd > this.danamicVar.currentEnd){
			this.open($('.set_list_filter > ul > li:last-child > a'));
		}

		$('.set_list_filter > ul > li > a').not($('.set_list_filter > ul > li:first-child > a')).each(function(){
			var prevH = $(this).parent('li').prev().find('> a').offset().top+$(this).parent('li').prev().outerHeight()-1;
			if($(this).offset().top <= prevH){
				stickyFilter.sticky($(this));
			}
			if($(this).offset().top < $(this).next('.depth2').offset().top){
				stickyFilter.takeAway($(this));
			}
		});
	}

	, init : function(){
		this.setValue();
		$(".set_list_filter > ul > .filterOpen > a").click(function(e){
			stickyFilter.toggle($(this));
		});
	}
}
stickyFilter.init();


$(window).scroll(function(){
	stickyFilter.calc();
})