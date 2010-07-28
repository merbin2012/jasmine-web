;(function (window_object){
	function getXHRObject () {
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
	};

	/*
	console.log('hi');
	var source_code = document.documentElement.innerHTML;	
	var clean_source = source_code.replace("console.log('hi');", "");
	console.log(clean_source);
	*/
	//document.write("<html>" +  "</html>");
	
	
	/*
	var XHR_Object = getXHRObject();
	
	XHR_Object.onreadystatechange = 
		function() {
			if ( XHR_Object.readyState != 4 ) return;
			var src_html = XHR_Object.responseText;//.replace("window.addEventListener('load', asyn_write_html, true);", "");
			//document.write(src_html);
			//console.log(XHR_Object.responseText);				
		};	
	try {
		console.log('xhr_inject send...');			
		XHR_Object.open('GET', window_object.location.href, true);
		XHR_Object.send('');
		setTimeout(function(){console.log('timeout')}, 1000);

		var scripts = document.getElementsByTagName("script");
		var cntr = scripts.length;
		
		for (var i=0; i < cntr; i++){
			var curScript = scripts[i];
			//if (curScript.src.indexOf('init.js') != -1){
				console.log(curScript.src);
			//}
			//else{
			//	document.documentElement.removeChild(curScript); 
			//}
		}
		console.log("removal done: " + scripts.length);		
	}
	catch(e) {
		console.log(e);
	}*/
})(this);