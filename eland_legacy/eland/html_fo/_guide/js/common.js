jQuery(function($){
	// TREE MENU
	$('#treeMenu ul li:has("div")').find('a:first').addClass('closed');
	$('#treeMenu ul li:has("div")').find('div').hide();	
	$('#treeMenu li:has("div")').find('a:first').click (function (){ 
		$(this).parent('li').find('a:first').toggleClass('opened');
		$(this).parent('li').find('div:first').slideToggle();
	});

});


function viewWebSource(ifm, code, bt) { 
	var $currentIFrame = $("#"+ifm); 
	
	if ($("#"+bt).text() == "소스보기"){
		$("#"+code).text('<html>' +$currentIFrame.contents().find("html").html() + '</html>');
		$("#"+bt).text("소스닫기");
	}else{
		$("#"+code).text("");
		$("#"+bt).text("소스보기");
	}
} 

function viewIfrm(ifm, bt) { 
	
	if ($("#"+bt).text() == "OPEN"){
		$("#"+ifm).height('400px');
		$("#"+bt).text("CLOSE");
	}else{
		$("#"+ifm).height('200px');
		$("#"+bt).text("OPEN");
	}
} 