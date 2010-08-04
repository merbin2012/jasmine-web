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

	function rewrite_html(){
		//console.log("rewrite_html");
		var XHR_Object = getXHRObject();
		
		XHR_Object.onreadystatechange = 
			function() {
				if ( XHR_Object.readyState != 4 ) return;
				var src_html = XHR_Object.responseText;//.replace("rewrite_html()", "");
				var scr = '<script type="text/javascript" src="instrument/init.js"></script>\n';
				var clean_src = src_html.replace(scr, "");
				//console.log(clean_src);
				//var div = document.createElement('div');
				//div.text= clean_src;
				//document.getElementsByTagName('body')[0].appendChild(div);
				
				document.write(clean_src);
				//console.log(XHR_Object.responseText);				
			};	
		try {
			console.log('xhr_inject send...');			
			XHR_Object.open('GET', window_object.location.href, true);
			XHR_Object.send('');				
		}
		catch(e) {
			//console.log(e);
		}
	};
	
	rewrite_html();
	//window.addEventListener('load', rewrite_html, true);
})(this);