/**
 * 핸들바 
 */
;(function($) {
window.overpass ={};
if ($.type(window.handle) != "object") {
	window.handle = {};		
};
if ($.type(window.handle.LoadList) != "array") {
	window.handle.LoadList  = [];		
};

if ($.type(window.handle.Templates) != "array") {
	window.handle.Templates = [];	
};

if ($.type(window.handle.ManagerList) != "array") {
	window.handle.ManagerList = [];	
};

/**
 * 핸들바 템플릿 로더
 */
function handleLoader() {
    this.tagName  	= 'script[type="text/x-handlebars-template"]';
    this.templId 	= "";
    this.templUrl 	= "";
    this.isCache 	= false;
    this.isLoading 	= false;
    this.init 		= initClass;
    function initClass(pin ) {
    	var loaderObj ;
		try {
				pin = $.extend({},pin);
	   			var params = {};
	
	   			if( $.type(pin.before) != "undefined" && $.type(pin.before) == "function") {
	   				this.before = pin.before;
	   			}
	  			
	  			if( $.type(pin.after) != "undefined" && $.type(pin.after) == "function") {
	   				this.after = pin.after;
	   			}
	  			
	  			if( $.type(pin.onError) != "undefined" && $.type(pin.onError) == "function") {
	   				this.onError = pin.onError;
	   			}
	  			
	  			if( $.type(pin.onComplete) != "undefined" && $.type(pin.onComplete) == "function") {
	   				this.onComplete = pin.onComplete;
	   			}
	   			
	   			
	   			if( $.type(pin.templId) != "undefined" && $.type(pin.templId) == "string") {
	   				this.templId = pin.templId;
	   			}
	   				
	   			if( $.type(pin.templUrl) != "undefined" && $.type(pin.templUrl) == "string") {
	   				this.templUrl = pin.templUrl;
	   			}
	   			
	   	   	    loaderObj = this;
	   	   	    this.isLoading = true;
	   	   		if($.type(handle.Templates[loaderObj.templId]) == "undefined") {
	   	   			
	   	  				$.ajax({ 
	   	   				  	url: loaderObj.templUrl, 
	   	   				    cache: loaderObj.isCache, 
	   	   				    data : params,
	   	   				    async: false, 
	   	   				    beforeSend: function (p) {
	   	   				    	//console.log("beforeSend HANDLE!!");
	   	   				    	loaderObj.before(p);
	   	   		            },
	   	   		            success: function(data) { 
	   	   		            	this.isLoading = false;
	   	   		            	//console.log("success HANDLE!!");
	   	   						$('body').append(data); 
	   	   						loaderObj.after(data);
	   	   						loaderObj.regist({templId:loaderObj.templId});
	   	   				 	},
	   	   					error: function(e) {
	   	   					    this.isLoading = false;
	   	   						//console.log("error HANDLE!!");
	   	   						loaderObj.onError(e);
	   	   					},
	   	   					complete : function(p){
	   	   						//console.log("complete HANDLE!!");
	   	   						loaderObj.onComplete(p);
	   	   						if(this.isLoading) {
	   	   							this.isLoading = false;
	   	   						}
	   	   					}
	   	   				 });
	   	   		}
   			}catch (e){
   				this.isLoading = false;
   				if( $.type(e.message) != "undefined" && e.message != "" ) {
   					window.alert(e.message);
   				}
   			}
    }
    
    this.regist = registProc;
    function registProc (p) {
		    var tagObj 		=  $("#"+p.templId);
			var html  		=  tagObj.html(); 
	      	var partialName =  tagObj.attr("partial-name"); 
	      	if(partialName)    Handlebars.registerPartial(partialName,html); 
	      	var srcBody 	= Handlebars.compile(html);
	      	handle.Templates[p.templId] = {templId : p.templId , partialName: partialName , src :  srcBody , html : html }; 
	}
    
    this.before 	= fnBefore;
    this.after	 	= fnAfter;
    this.onError 	= fnOnError;
    this.onComplete = fnOnComplete;
	function fnBefore 		(){ }
    function fnAfter 		(){ }
    function fnOnError 		(){ }
    function fnOnComplete 	(){ }

}

/**
 * 핸들바 템플릿 매니저
 */
handle.Manager = {	
		loaderList   : [],
		managerId	 : "dummy",
		errMsg	     : "처리 중 오류가 발생했습니다.",
	   	registTemplate : function(pin){  //템플릿 등록
	   		pin = $.extend({},pin);
	   		var list = pin.templList;

	   		
	   		try {
	   			
	   	
		   		if($.type(list) == "undefined" || list.length < 1) {
		   			console.log("템플릿 정보가 없습니다.");
		   			throw {code:"101",message:this.errMsg};
		   		}
		   		
		   		for(var i =0;i < list.length; i++){
		   	   		var templId  = list[i].id;
		   	   		var templUrl = list[i].path;
	
		   	   		
			   		if($.type(templId) == "undefined" || templId == "") {
			   			console.log("템플릿 ID 정보가 없습니다.");
			   			throw {code:"101",message:this.errMsg};
			   		}
			   		
			   		if($.type(templUrl) == "undefined" || templUrl == "") {
			   			console.log("["+templId+"]템플릿 URL 정보가 없습니다.");
			   			throw {code:"101",message:this.errMsg};
			   		}
		   	   		
		   	   		
		  			var loader = new handleLoader();
		  			/*			
		  			if(handle.Manager.loaderList[templId] && handle.Manager.loaderList[templId].isLoading){
		  				
		  				console.log("["+templId+"] is loading... ");
		  				continue;
		  			}*/
		  			handle.Manager.loaderList[templId] = loader;
		  			loader.init({
			  						templId		: templId
				  				   ,templUrl	: templUrl
				  				   ,before 		: list.before
				  				   ,after 		: list.after
				  				   ,onError 	: list.onError
				  				   ,onComplete 	: list.onComplete
			  				   });
		   		}
	   		
	   		}catch (e){
				if( $.type(e.code) != "undefined" && e.code != "101" ) {
					if( $.type(e.message) != "undefined" && e.message != "" ) {
	   					window.alert(e.message);
	   				}
				}
			}

		},
		loadJson 	: function(pin){  //JSON 모델 데이터 로드
			pin = $.extend({jsonPath:"",model:null,templNm:"",targetId:"",targetObj:null,params:{}},pin);
			
   			if( $.type(pin.managerId) != "undefined" && $.type(pin.managerId) == "string") {
   				this.managerId = pin.managerId;
   			}
   			
   			if( $.type(pin.errMsg) != "undefined" && $.type(pin.errMsg) == "string") {
   				this.errMsg = pin.errMsg;
   			}
			
			try {
	
				var manager = this;
				handle.ManagerList[this.managerId] = manager;

				if( pin.jsonPath == null || $.type(pin.jsonPath) == "undefined") {
					console.log("["+pin.templNm+"]data url path is required!");
					throw {code:"101",message:this.errMsg};
				}
				
				$.ajax({ 
	   				  	url: pin.jsonPath, 
	   				    async: false, 
	   				    cache: true,
	   				    dataType: 'text',
	   				    data : pin.params,
	   				    beforeSend: function (p) {
	
	   				    },
	   		            success: function(data) { 
	   		            	var result = JSON.parse(data);	

	   		            	if($.type(result.code) != "undefined" && result.code == "200" ) {
	   		            		var json = result.data;
	   		            		//console.log(json);
		   						
	   		            		pin.model = json;
		   						if( $.type(pin.callback) != "undefined" && $.type(pin.callback) == "function") {
		   							pin.callback(pin);
		   			   			}
		   						manager.renderJson(pin);
	   		            	}else{
	   							console.log("["+result.code+"]"+ result.resultMsg);
	   							throw {code:"101",message:this.errMsg};
	   		            	}

	   				 	},
	   					error: function(e) {
	   			  			if( $.type(pin.onError) != "undefined" && $.type(pin.onError) == "function") {
	   			  				pin.onError(e);
	   			   			}
	   					},
	   					complete : function(p){
	   						
	   					}
	   			});
			}catch (e){
				if( $.type(e.code) != "undefined" && e.code != "101" ) {
					if( $.type(e.message) != "undefined" && e.message != "" ) {
	   					window.alert(e.message);
	   				}
				}
			}

		},
		renderJson : function(pin){ //JSON 모델 템플릿에 적용
			pin = $.extend({model:null,templNm:"",targetId:"",targetObj:null},pin);
			try {
				var templNm   = pin.templNm;
				var targetId  = pin.targetId;
				var targetObj = pin.targetObj;
				var obj ;
				
				if(templNm == "") {
					console.log("template name is required!");
					throw {code:"101",message:this.errMsg};
				}
				if(targetId == ""  && targetObj == null) {
					console.log("["+templNm+"] targetId  or targetObj is required!");
					throw {code:"101",message:this.errMsg};
				}
				
				if(targetId != "" ){
					obj = $("#"+targetId);
				}else{
					//obj = targetObj;
				}
				
				if(obj == null || obj.length <= 0) {
					console.log("["+templNm+"] target Object NOT FOUND!");
					throw {code:"101",message:this.errMsg};
				}
				
				if(pin.model == null) {
					console.log("["+templNm+"] model data is empty!");
					throw {code:"101",message:this.errMsg};
				}
				
				if(handle.Templates[templNm] == null || $.type(handle.Templates[templNm]) == "undefined") {
					console.log("["+templNm+"] template is empty!");
					throw {code:"101",message:this.errMsg};
				}
				
				var template = handle.Templates[templNm].src;
				var output = template(pin.model);
				obj.html(output);
				
				if( $.type(pin.afterCallback) != "undefined" && pin.afterCallback != null && $.type(pin.afterCallback) == "function") {
					pin.afterCallback(pin);
	   			}
				
			}catch (e){
		  		if( $.type(pin.onError) != "undefined" && $.type(pin.onError) == "function") {
			  		pin.onError(e);
			   	}
		  		
				if( $.type(e.code) != "undefined" && e.code != "101" ) {
					if( $.type(e.message) != "undefined" && e.message != "" ) {
	   					window.alert(e.message);
	   				}
				}
			}
		}
};
})(jQuery);