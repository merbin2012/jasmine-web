<script type="text/javascript" src="test_handler.js">
//--work:
//window.onload = view_scripts;

//--work:
//window.addEventListener('load', JO.view_scripts, true);

//--work:
//document.write("<script>window.onload = this.view_scripts<\/script>");

//--work:
//window.addEventListener('load', function(){console.log('eventl istner')}, true);

//--work:
//document.write("<script>window.addEventListener('unload', function(){console.log('document.write this handler.')}, true)<\/script>");

//--work:
//var func="hello";
//document.write("<script>" + func + "()<\/script>");

//--work:
//var func="hello_n";
//var do_hello = new Function(func + "()");
//do_hello();

//--work:
//var fnc="hello_n";
//new Function(fnc + "()")();

//--work:
/*window.addEventListener('click', 
						function(){
							console.log("say hello");
							var fnc="hello_n";
							new Function(fnc + "()")();
						}, 
						true);
*/
//!!doesn't work: onload event cannot call document.write() because it would open a new window.
//window.addEventListener('load', function(){document.write("<script>window.onload = this.view_scripts<\/script>")}, true);



//window.addEventListener('click', JO.click_to_write, true);
//window.addEventListener('load', view_source, true);


</script>