function contentEval(source) {
	/*
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }
	*/
  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "text/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
}

var src = "function count_script(doc_node){var scripts = doc_node.getElementsByTagName('script');var cntr = scripts.length;console.log(cntr + ' scripts counted ' );return cntr;} count_script(document); alert('src added');";

//count_script(document);
	
contentEval(src);

