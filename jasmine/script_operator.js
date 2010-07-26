var SO = {
	count_script : function(doc_node){
		var scripts = doc_node.getElementsByTagName("script");
		var cntr = scripts.length;
		
		console.log(cntr + ' scripts counted ' );

		return cntr;
	},

	iterate_script : function(doc_node){
		var scripts = doc_node.getElementsByTagName("script");
		var cntr = scripts.length;
		
		while ( cntr ) {
			var curScript = scripts[cntr-1];
			console.log(curScript.src.toString());
			console.log('script source: ' + curScript.innerHTML);
			cntr--;
		}
	},
	
	read_script_src : function(script_src){		
		var scr_js = document.getElementsByTagName('script');		
		var s_ln = scr_js.length;
		for (var i=0; i<s_ln; i++){
			if (-1 != scr_js[i].src.indexOf(script_src)){
				console.log(scr_js[i].src);					
				XO.xhr_hanlder(scr_js[i].src, function(){});
			}
		}		
	},
	
	//cannot read external scripts 
	view_scripts: function(){
		var scripts = document.getElementsByTagName("script");
		console.log(scripts.length + " scripts found");
		for (var i=0; i<scripts.length; i++){
			console.log(scripts[i].innerHTML);
			console.log("-----");
		}
	},

	view_source: function(){
		var source_code = document.documentElement.innerHTML;
		console.log(source_code);
	},

	/** Insert before/after a fuction. The functio's behavior doesn't change */
	rewrite_func: function(old){	
		//console.log("SO.rewriting \n" + old + "|...\n");
		return function(){
			if (old.name == 0) {
				console.log('anonymous function');
				old[name] = 'anonymous';
			}
			console.log( 'rewritten function: |' + old.name + '|');// + ', called by ' + this.name);
			
			console.log("old's this: " + this.name);
			old.apply(this, arguments);//Array.prototype.splice.call(arguments, 0));
			console.log("rewritten function executed " + this.name);
		}
	},
	
	/** Change function behavior. 
	doc_node: a document object
	new_beh: A string of the new behavior to be assigned to the function. for example 'function(){console.log("inner hello")};'
	*/	
	alter_func: function(old, new_beh, doc_node){
		var src = doc_node.createElement('script');
		src.text = 'var t = ' + new_beh; //
		doc_node.getElementsByTagName('head')[0].appendChild(src);
		return t.apply(this, old.arguments);		
	},
	/*
	usage of alter_func:
	(function(){
		hello = SO.alter_func(hello);
		hello	= SO.alter_func(hello, new_body, document);
	})();
	*/
	click_to_write: function(e){
		console.log('click handler invoked');
		function getTarEle(e){
			var targetElement = e.target; 

			if( targetElement && ( targetElement.nodeType == 3 ) ) {
				targetElement = targetElement.parentNode; 
			}
			return targetElement;
		}

		var target_ele	= getTarEle(e);
		if (target_ele && target_ele['onclick']){
			console.log(target_ele.name + ' click handler: \t' + target_ele['onclick'].toString());
			target_ele['onclick'] =JO.rewrite(target_ele['onclick']);
		}
	}

	/*
	//TODO: eval is rewritable. for example
	function rewrite_eval(b){
		var a = eval;
		return function(){
			console.log(arguments);
			a(b);
			//console.log("rewritten eval executed " + this.name);
		}
	}
	eval = rewrite_eval('console.log("eval in console");'); 
	eval('console.log("eval speaks.")'); //output: eval in console
	eval('h_sth("im sth")'); //output: eval in console
	*/
	
	/* script onload/onreadystatechange
	//console.log(document.expando + ' document.expando ');
		function load_handler(){
			console.log('domscript load handler executed');	
			alert('domscript load handler executed');
		}		
	
		var domscript = document.createElement('script');
		//non-IE broswers
		domscript.onload = load_handler;
		//IE 
		//domscript.onreadystatechange  = load_handler;
		//alert('domscript.onloadDone ' + domscript.onloadDone);
		//alert('domscript.onload ' + domscript.onload);
		domscript.src		= 'dom_operator.js';
		domscript.type	= 'text/javascript';
	
		
		console.log('before append domscript');
		document.getElementsByTagName('head')[0].appendChild(domscript);
		console.log('after append domscript');
		//domscript.__onload();	
	*/
}
