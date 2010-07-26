var JO = {	
	run: function(){
		console.log('__JO__ is running.');
	},
	
	instrument_event_handler: function(script_src){		
		do_fx_instrument(script_src);
		/*
		if (addEventListener){

			//do_fx_instrument(script_src);
		}else if (attachEvent){
			return parse_attachEvent(script_src);
		}else{
			throw "not implemented event handler parser."
		}*/
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

	do_fx_instrument: function(script_src){
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
			
			var instrumented_handler = new Function( remove_string );			
			instrumented_handler();
			//add new handler
		}


		var fx_event_pattern = 
						// /([\s\t\n])+([a-zA-z0-9\_]+\.)+addEventListener/g;
						 /([a-zA-z0-9\_]+[\.])+addEventListener\s*\(\s*\'[a-zA-Z]+\'\s*\,/g; 
						// /addEventListener\(\s*\'[a-zA-Z{4,11}\'s*\,\w*\,a-zA-Z{4,5}\)\s*;]/; 
		var match;
		var i = 0;
		while(match = fx_event_pattern.exec(script_src)){
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
	},

	parse_attachEvent: function(script_src){
		throw "IE not implemented";
	},

	
			
	trace_handler: function(node, handler_func){
		var old = handler_func;

		return function(){
			/*
			var old_value = before execution: get node value
			parse code to detect dynamic features, particularly, javascript code of introducing new_event_handler.
			old.apply(this, arguments);
			var new_value = after execution: get node value
			if ( old_value != new_value ){
				// send a messge to certain machenism 
				maybe a data structure: timestamp, node, functionname, isChanged.
			}
			check_dom();
			*/
		}
	},

	test_jo: function(){
		console.log('js_operator loaded.');
	}
}


