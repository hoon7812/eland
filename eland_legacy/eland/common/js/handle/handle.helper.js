 var indexList = [];

Handlebars.registerHelper('iftest', function(index,cond, options) {
	if(options.data.first != index && options.data.last != index && index%cond == 0) {
		return options.fn(this);
	} else {
		return options.inverse(this);	
	}
});

Handlebars.registerHelper('ifEq', function(index,cond, options) {
	if(index == cond) {
		return options.fn(this);
	} else {
		return options.inverse(this);	
	}
});

Handlebars.registerHelper('ifNotEq', function(index,cond, options) {
	if(index != cond) {
		return options.fn(this);
	} else {
		return options.inverse(this);	
	}
});


Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
   // console.log("ifCond : " + "v1:" +v1 + ", v2 : " +v2 );
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('index', function(items, name, action, options) {
	   var index = indexList[name];
	
	   if($.type(index) != "undefined") {
		   index ++;
	   }else{
		   index = 0;
	   }
	   indexList[name] = index;
	   //console.log(name+":"+index);

	   return index;
});

//배너 체크
Handlebars.registerHelper('onBanner', function(rows_per_page ,page_idx ,index ,options) {
	//console.log(index);
	var mapCnt = (rows_per_page * (page_idx -1)) + (index+1);
	if(page_idx == 1 && (mapCnt == 11 || mapCnt == 21)){
		return options.fn(this);
	}else{
		return options.inverse(this);	
	}
});

//가격 콤마
Handlebars.registerHelper('toCurrency', function(item) {
	try {
		if(item == null || item.toString() == "") {
			return "0";
		}else{
			return $.trim(item.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,'));
		}
	}catch (e){
		return "0";
	}
});


//기본산술
Handlebars.registerHelper('math', function(v1, operator, v2, options) {
	//console.log($.type(v1));
	//console.log(parseInt(v1));
	if( $.type(v1) != "number" ||  $.type(v2) != "number" ||  $.type(operator) != "string") {
		//console.log($.type(v1));
		return null;
	}
	switch (operator) {
	    case '+':
	        return  (parseInt(v1) + parseInt(v2));
	    case '-':
	        return  (parseInt(v1) - parseInt(v2));
	    case '*':
	        return  (parseInt(v1) * parseInt(v2));
	    case '/':
	        return  (parseInt(v1) / parseInt(v2));
	    case '/R':
	    	//console.log('/R');
	        return  Math.round(parseInt(v1) / parseInt(v2));    
	    case '%':
	        return  (parseInt(v1) % parseInt(v2));
	    default:
            return 0;
	}
});


Handlebars.registerHelper('initVar',function (varName, varValue, options, operator){
	options.data.root[varName] = varValue;
});

Handlebars.registerHelper('setVar',function (varName, varValue, operator, options ){
	if($.type(operator) != "undefined") {
		switch (operator) {
		    case 'add':
		    	options.data.root[varName]++;
		}
		//console.log(options.data.root[varName]);
	}else{
		options.data.root[varName] = varValue;
		//console.log(options.data.root[varName]);
	}

});


Handlebars.registerHelper('conSole',function (obj,options){
	console.log("===handle conSole===");
	console.log(obj);
});


Handlebars.registerHelper('setEventPram',function (item,options){
	var params = "openwinyn : 'N' ,tr_yn :'" +  l_tr_yn +"' ,banner_kind_cd : '90' ,conts_form_cd  : '130' ,conts_divi_cd   : '10' ,move_cont_no:'' ,url: '"+ item.link_url +"'" ;
	return params;
});


Handlebars.registerHelper('classOn',function (ctg1,ctg2){
	if(ctg1 != ctg2) return "";
	return "on";
});



