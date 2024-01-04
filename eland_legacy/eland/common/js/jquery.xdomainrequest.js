/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.4 - 2015-03-05
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2015 Jason Moon (@JSONMOON)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function($) {

// Only continue if we're on IE8/IE9 with jQuery 1.5+ (contains the ajaxTransport function)
if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) {
  return $;
}

var httpRegEx = /^(https?:)?\/\//i;
var getOrPostRegEx = /^get|post$/i;
var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');
_gatewayURL_ = "";

// ajaxTransport exists in jQuery 1.5+
$.ajaxTransport('* text html xml json', function(options, userOptions, jqXHR) {

  // Only continue if the request is: asynchronous, uses GET or POST method, has HTTP or HTTPS protocol, and has the same scheme as the calling page
  if (!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || (!httpRegEx.test(options.url) && location.protocol == 'https')) {
    return;
  }

  var xdr = null;
  var sendFunction = null;
  
  if (!sameSchemeRegEx.test(options.url)) {
	var RequestHelper = {
		GatewayURL: _gatewayURL_,
		Busy: false,
		sendRequest: function(url,success,$){
			if(RequestHelper.Busy){
				setTimeout(function(){
					RequestHelper.sendRequest(url,success,$);
				},50);
			} else {
				RequestHelper.Busy = true;
				console.log("GatewayURL:" + RequestHelper.GatewayURL);
				$("body").append('<iframe id="ajaxProxy" style="display: none;" src="'+RequestHelper.GatewayURL+'" width="0" height="0"></iframe>'); 
				$("#ajaxProxy").load(function() { 
					console.log("iframe load");
					$(window).bind("message",function(e){
						console.log("receive completed message.");
						$("#ajaxProxy").remove(); 
						$(window).unbind("message"); 
						RequestHelper.Busy = false;
						var event_data = $.parseJSON(e.originalEvent.data);
						var status = event_data.status;
						var message = event_data.message;
						var json;
						
						if (status == 200) {
				            try {
					           json = $.parseJSON(event_data.responseText);
					        } catch(e) {
					           status = 500;
					           message = 'parseerror';
					           //throw 'Invalid JSON: ' + xdr.responseText;
					        }
						}
						
						success(status, message,  { 
							text : event_data.responseText,
							json : json
						}); 
						
						console.log("success : " + event_data.responseText);
						
						
					}); 
					
					console.log("succ3ess : " + options.data);
					
					ajaxProxy.postMessage( JSON.stringify({
						type : options.type,
						url : options.url,
						data : (options.data ? options.data : '')
					}),"*"); 
					
				}); 
			} 
		} 
	}
	  
	  return {
		    send: function(headers, complete) {
		    	RequestHelper.sendRequest(options.url, complete, $)
		      },
		    abort: function() {
		      if (xdr) {
		        xdr.abort();
		      }
		    }
		  };
  } else {
	  return {
		    send: function(headers, complete) {
		        var postData = '';
		        var userType = (userOptions.dataType || '').toLowerCase();

		        xdr = new XDomainRequest();
		        if (/^\d+$/.test(userOptions.timeout)) {
		          xdr.timeout = userOptions.timeout;
		        }

		        xdr.ontimeout = function() {
		          complete(500, 'timeout');
		        };

		        xdr.onload = function() {
		          var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
		          var status = {
		            code: 200,
		            message: 'success'
		          };
		          var responses = {
		            text: xdr.responseText
		          };
		          try {
		            if (userType === 'html' || /text\/html/i.test(xdr.contentType)) {
		              responses.html = xdr.responseText;
		            } else if (userType === 'json' || (userType !== 'text' && /\/json/i.test(xdr.contentType))) {
		              try {
		                responses.json = $.parseJSON(xdr.responseText);
		              } catch(e) {
		                status.code = 500;
		                status.message = 'parseerror';
		                //throw 'Invalid JSON: ' + xdr.responseText;
		              }
		            } else if (userType === 'xml' || (userType !== 'text' && /\/xml/i.test(xdr.contentType))) {
		              var doc = new ActiveXObject('Microsoft.XMLDOM');
		              doc.async = false;
		              try {
		                doc.loadXML(xdr.responseText);
		              } catch(e) {
		                doc = undefined;
		              }
		              if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
		                status.code = 500;
		                status.message = 'parseerror';
		                throw 'Invalid XML: ' + xdr.responseText;
		              }
		              responses.xml = doc;
		            }
		          } catch(parseMessage) {
		            throw parseMessage;
		          } finally {
		            complete(status.code, status.message, responses, allResponseHeaders);
		          }
		        };

		        // set an empty handler for 'onprogress' so requests don't get aborted
		        xdr.onprogress = function(){};
		        xdr.onerror = function() {
		          complete(500, 'error', {
		            text: xdr.responseText
		          });
		        };

		        if (userOptions.data) {
		          postData = ($.type(userOptions.data) === 'string') ? userOptions.data : $.param(userOptions.data);
		        }
		        xdr.open(options.type, options.url);
		        xdr.send(postData);
		      },
		    abort: function() {
		      if (xdr) {
		        xdr.abort();
		      }
		    }
		  };
  }


});

return $;

}));

