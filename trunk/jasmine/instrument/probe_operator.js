const PROBES_URI = "instrument/probes_reg.json";


/** probe operator */
var PO = {	
    insert_probe : function(win_obj, func, probe_obj){ 		
        //do_insert_probes        
    },

	instrument_silently : function(){
		xhr_obj = XO.getXHRObject();
		xhr_obj.onreadystatechange = function() { 
			if ( xhr_obj.readyState != 4 || 200 != xhr_obj.status ) {
				return; 
			}
			//console.log( xhr_obj.responseText);
			config = eval( '(' + xhr_obj.responseText + ')'); 
			//TODO:
			//for each object config
			//	insert_prob
		};

		try {
			console.log('xhr_eval send...');
			xhr_obj.open('GET', PROBES_URI, true);
			xhr_obj.send('');
		}
		catch(e) {console.log(e)}       
	},

	instrument_interactively : function(window_object){
		console.log('interactively instrument.');
		//parse code to create evt-ele-hdlr table


		//instrument eval(), setTimeout(), Function()

		//setup monitoring thread
	},

	trim: function(stringToTrim) {
		return stringToTrim.replace(/^\s+|\s+$/g,"");
	},
	ltrim: function (stringToTrim) {
		return stringToTrim.replace(/^\s+/,"");
	},
	rtrim: function (stringToTrim) {
		return stringToTrim.replace(/\s+$/,"");
	},

	ff_event_handler_instrument: function(script_src){
		console.log('script_src:\t' + script_src);

		function find_right_bracket_index(script_src, addEventListener_left_bracket_index){
			var stack = new Array;
			for (var i=addEventListener_left_bracket_index; i<script_src.length; i++){ //16 is the length of addEventListener
				if (script_src.charAt(i) === '('){
					stack.push('(');
				}else if (script_src.charAt(i) === ')'){
					stack.pop();
					if ( stack.length == 0){
						return i;
					}
				}
			}
		}

		function parse_handler_tokens(handler_src){
			var l_bracket_index = handler_src.indexOf('(');
			var ele = JO.trim( handler_src.substring(0, l_bracket_index) );
			ele = ele.substring(0, ele.lastIndexOf('.'));
			//console.log("element: " + ele);
			
			var r_bracket_index = find_right_bracket_index(handler_src, 0);
			var paras = JO.trim( handler_src.substring(l_bracket_index+1, r_bracket_index) );
			//console.log('para string:\n\t ' + paras );
			
			//parse the parameters
			var index_first_comma = paras.indexOf(',');
			var index_last_comma = paras.lastIndexOf(',');
			var event = JO.trim( paras.substring(0, index_first_comma) );
			event = event.substring( event.indexOf('\'') + 1, event.lastIndexOf('\'') );
			var handler = JO.trim ( paras.substring(index_first_comma + 1, index_last_comma) );
			var capture_flag = JO.trim( paras.substring(index_last_comma + 1) );
			//console.log( "\nparas: \t|" + event + "|\t|" + handler + "|\t|" + capture_flag + '|') ;		

			//TODO: check whether it's commented

			return [ele, event, handler, capture_flag];
		}

		function instrument_handler(handler_tokens){
			var remove_string = handler_tokens[0] + ".removeEventListener('" 
														+ handler_tokens[1] + "', " 
														+ handler_tokens[2] + ", " 
														+ handler_tokens[3] + ");"
			remove_string += 'console.log("Report: remove_handler");';
			console.log('\nremove_string: ' + remove_string);
			
			//TODO eval to replace Function
			var instrumented_handler = new Function( remove_string );			
			instrumented_handler();
			//add new handler
		}


		var ff_event_pattern = 
						// /([\s\t\n])+([a-zA-z0-9\_]+\.)+addEventListener/g;
						 /([a-zA-z0-9\_]+[\.])+addEventListener\s*\(\s*\'[a-zA-Z]+\'\s*\,/g; 
						// /addEventListener\(\s*\'[a-zA-Z{4,11}\'s*\,\w*\,a-zA-Z{4,5}\)\s*;]/; 
		var match;
		var i = 0;
		//TODO add to a table.
		while(match = ff_event_pattern.exec(script_src)){
			//console.log( '------' + i++ + '----\nmatch: ' + match.index + "\nstring: " + match[0] + '\n');
			var ele_handler_event = match[0];
			//find the element and addEventListener method

			var addHandler_src = JO.trim(script_src.substring(match.index));
			var handler_tokens = parse_handler_tokens(addHandler_src);
			
			//console.log(handler_tokens.length + ' tokens:\n');
			/*for (var j=0; j<handler_tokens.length; j++){
				console.log(handler_tokens[j]);
			}*/

			instrument_handler(handler_tokens);
			console.log( "\n--------------");
		}
	}
};




/** DOM operator */
var DO = {
	/**
	@param doc_nd	The document node to which the script appends.
	@param src		The script's source.
	*/
	inject_script_from_source : function(doc_nd, src){
		inject_script(doc_nd, uri, 'uri');
	},


	/**
	@param doc_nd	The document node to which the script appends.
	@param code		The script code.
	*/
	inject_script_from_code : function(doc_nd, code){	
		inject_script(doc_nd, code, 'code');
	},

	/**
	@param doc_nd	The document node to which the script appends.
	@param scr		The script to append.
	@param t		Tyep of script: source file or code.
	TODO: a timer to make sure the script is appended.
	*/
	inject_script : function(doc_nd, scr, t){	
		var se = doc_nd.createElement('script');
		se.type = 'text/javascript';
		if ( t = 'uri'){
			se.src = scr;
		}else if ( t = 'code' ){
			se.text = scr;
		}
		doc_nd.getElementsByTagName('head')[0].appendChild(se);

	},

	parse_event_handler : function(window_object){
		var scr_js = document.getElementsByTagName('script');
		var s_ln = scr_js.length;
		for (var i=0; i<s_ln; i++){
		
		}
	}
};



/** XHR operator */
var XO = {	
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

	

	//inject_1: execute retrieved data right away
	xhr_eval : function(script_src) {
		xhrObj_elem1 = XO.getXHRObject();
		xhrObj_elem1.onreadystatechange = function() { 
			if ( xhrObj_elem1.readyState != 4 || 200 != xhrObj_elem1.status ) return; 
			//console.log(xhrObj_elem1.responseText);
			eval(xhrObj_elem1.responseText); 
		};
		try {
			console.log('xhr_eval send...');
			xhrObj_elem1.open('GET', script_src, true);
			xhrObj_elem1.send('');
		}
		catch(e) {}
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
};

;(function (window_object){
	//read in registered instrumentation code and points from the json configuration file
	PO.instrument_interactively(window_object);
	/*
	//for each object in the config file
	var uri = probe_obj.uri;
	if win_obj.dom.scripts NOT contains uri
		return; //do nothing because func is not used in the window_object
	//for each instrument code in the uri
		//insert_probe THAT appends to the window.document.
	*/
	console.log(window_object.location.href + ' instrumented!'); 
})(this);