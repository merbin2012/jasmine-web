var event_handler_list = [ "onabort", "onblur", "onchange", "onclick", "ondblclick", "onerror", "onfocus", "onkeydown",  "onkeypress",  "onkeyup", "onload", "onmousedown",  "onmousemove", "onmouseout", "onmouseover",  "onmouseup", "onreet", "onresize", "onselect", "onsubmit", "onunload"];

var DO ={
	traverse_dom: function (n, func){
		func(n);
	   
		var children = n.childNodes;
		for (var i=0; i<children.length; i++){
				traverse_dom(children[i], func);
		}      
	},

	/*
	operate_node = function (n){
		if (n.nodeType == 1){
			console.log('an HTML element node: ' + n.name + '\t' + n.id + '\n\t' + n['onclick']);
		}
	}*/

	detect_event_hanlder: function(n){
		for (var i=0; i<event_handler_list.length; i++){
			if (n.nodeType == 1){
				console.log('an element node: ' + n.name);// + '\t' + n.id + '\n\t' + n['onclick']);

				//if (n[event_handler_list[i]] != 'undefined' && n.name != 'undefined'){
				//	console.log(n.name + ' ' );// + event_handler_list[i] + ' ' + [event_handler_list[i]] );
				//}
			}
		}
		
	},
	 
	/** declare functions here */
	count_tags: function(n){
		var num_tag = 0;
		if (n.nodeType == 1){ //NODE.ELEMENT_NODE
				num_tag++;
		}

		var children = n.childNodes;
		for (var i=0; i<children.length; i++){
				num_tag +=count_tags(children[i]);
		}

		return num_tag;
	},

	getTarEle: function(e){
		var targetElement = e.target; 

		if( targetElement && ( targetElement.nodeType == 3 ) ) {
			targetElement = targetElement.parentNode; 
		}
		return targetElement;
	},

	traverse_prop: function(n){
		console.log('traverse properties of ' + n);
		for (var p in n){
			console.log('----------');
			console.log(n[p]);
			if (n[p] != null )
			{
				console.log( p + '\t' + n[p].toString() + '\t' + typeof n[p]);
			}
		}
	}
}