var XO = {
	locate : function(){
		console.log( 'XO: ' + location.href);
	},
	
	getXHRObject : function() {
		var xhrObj = false;
		try {
			xhrObj = new XMLHttpRequest();
		}catch(e){
			var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
			for ( var i=0; i < progid.length; ++i ) {
				try {
					xhrObj = new ActiveXObject(progid[i]);
				} catch(e) {
					continue;
				}
			break;
			}
		} finally {
			return xhrObj;
		}
	},

	xhr_hanlder : function (resource, func){
		XHR_Object = XO.getXHRObject();

		XHR_Object.onreadystatechange = 
			function() {
				if ( XHR_Object.readyState != 4 ) return;
				console.log(XHR_Object.responseText);
				func();
			};	
		try {
			console.log('xhr_inject send...');			
			XHR_Object.open('GET', resource, true);
			XHR_Object.send('');
		}
		catch(e) {
			console.log(e);
		}
	},

	

	//inject_1: not injected
	xhr_eval : function() {
		xhrObj_elem1 = getXHRObject();
		xhrObj_elem1.onreadystatechange = function() { 
			if ( xhrObj_elem1.readyState != 4 || 200 != xhrObj_elem1.status ) return; 
			//console.log(xhrObj_elem1.responseText);
			eval(xhrObj_elem1.responseText); 
		};
		try {
			console.log('xhr_eval send...');
			xhrObj_elem1.open('GET', 'dom_operator.js', true);
			xhrObj_elem1.send('');
		}
		catch(e) {}
	},


	//inject_3: injected 
	//document.write("<scr" +	"ipt type='text/javascript' src='dom.js'>" + "</scr" + "ipt>");

	//inject_4: injected
	//TODO: need a timer!
	script_dom_inject : function(_src){
		var se = document.createElement('script');
		se.src = _src;
		doc_node.getElementsByTagName('head')[0].appendChild(se);
		console.log(_src + ' loaded');
	},
	
	//inject_2: injected (i.e., one of the document.getElementsByTagName("script"))
	xhr_inject : function () {
		xhrObj_elem1 = getXHRObject();
		xhrObj_elem1.onreadystatechange = function() {
			if ( xhrObj_elem1.readyState != 4 ) return;
			var se=document.createElement('script');
			document.getElementsByTagName('head')[0].appendChild(se);
			se.text = xhrObj_elem1.responseText;
		};
	
		try {
			console.log('xhr_inject send...');
			var resource = window.location;//'js_operator.js';
			xhrObj_elem1.open('GET', resource, true);
			xhrObj_elem1.send('');
		}
		catch(e) {
			console.log(e);
		}
	}
}