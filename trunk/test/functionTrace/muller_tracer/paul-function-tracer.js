//------------------------------------------------------------------------------
// JavaScript function tracer for "classes"
//------------------------------------------------------------------------------
// from: pmuellr@muellerware.org
// home: http://gist.github.com/189144
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// define our function tracer
//------------------------------------------------------------------------------
FunctionTracer = {};

//------------------------------------------------------------------------------
// logging function, default is to write to console
//------------------------------------------------------------------------------
FunctionTracer.logFunction = function(message) { 
	//alert(message);
	console.log(message); 
	
};

//------------------------------------------------------------------------------
// print time in messages?
//------------------------------------------------------------------------------
FunctionTracer.printTime = true;

//------------------------------------------------------------------------------
// print arguments in messages?
//------------------------------------------------------------------------------
FunctionTracer.printArgs = true;

//------------------------------------------------------------------------------
// return a registered function
// example: say you have a function named "foo".  You can trace it via:
//    foo = FunctionTracer.traceFunction(foo, "foo");
//------------------------------------------------------------------------------
FunctionTracer.traceFunction = function(func, name) {
//	alert("FunctionTracer.traceFunction started.");

    if (!FunctionTracer.startTime) FunctionTracer.startTime = new Date().getTime();

    if (!FunctionTracer.indent) FunctionTracer.indent = "";

    //--------------------------------------------------------------------------
    // best effort printing an argument as a string
    //--------------------------------------------------------------------------
    function arg2string(argument) {
        if (argument === null) return "null";
        if (argument === undefined) return "undefined";
        try {
            return JSON.stringify(argument);
        }
        catch(e) {
            return argument.toString();
        }
    }

    //--------------------------------------------------------------------------
    // this function creates a wrapper for each function which traces itself,
    // then invokes the original function
    //--------------------------------------------------------------------------
    function getWrapper(func, name) {
        if (typeof func != "function") throw new Error(name + " is not a function");
        
		console.log("\n===wrap " + name);

        return function() {
			//console.log('return function def');
            var oldIndent = FunctionTracer.indent;
            FunctionTracer.indent += "   ";
            
            var message = oldIndent + name;
            
            if (FunctionTracer.printTime) {
                var time = new Date().getTime() - FunctionTracer.startTime;
                time = "" + time;
                while (time.length < 8) time = " " + time;
                
                message = 'at time ' + time + ": " + message;
            }
            
			
            if (!FunctionTracer.printArgs) {
                message += "()";
            }
            else {
                message += "(";
                
                for (var i=0; i<arguments.length; i++) {
					//console.log( "\targu: " + arguments[i] );
					message += arguments[i];
                    if (i != arguments.length - 1) {
                        message += ", ";
                    }
                }
                
                message += ")";
            }
            alert( message + '\n');
			
            try {
                (FunctionTracer.logFunction)(message);
                return 
					func.apply(this, Array.prototype.splice.call(arguments, 0));
            }
            catch(e) {
                (FunctionTracer.logFunction)(message + "; exception: " + e);
                throw e;
            }
            finally {
                FunctionTracer.indent = oldIndent;
            }
        }
    }
    
    //--------------------------------------------------------------------------
    // main function logic
    //--------------------------------------------------------------------------
    
	(FunctionTracer.logFunction)("installed tracer: \t" + name + "()");

    return getWrapper(func, name);
}

//------------------------------------------------------------------------------
// register functions in an object to trace themselves
// example: say you have a 'class' called FooBar, that has a bunch of methods
// in it by virtual of having functions defined on FooBar.prototype.  You can
// trace those methods via:
//    FunctionTracer.traceFunctionsInObject(FooBar.prototype, "FooBar.");
//------------------------------------------------------------------------------
FunctionTracer.traceFunctionsInObject = function(object, prefix) {
    console.log("FunctionTracer.traceFunctionsInObject:: [" + object + "]");
    //--------------------------------------------------------------------------
    // process the functions in the object
    //--------------------------------------------------------------------------
    var functions = {};
    var getters   = {};
    var setters   = {};
    var isES5     = this.__lookupGetter__;
    
    for (var property in object) {
		//console.log( "property: " + property );
        //----------------------------------------------------------------------
        // ignore inherited properties
        //----------------------------------------------------------------------
        if (!object.hasOwnProperty(property)){
			console.log(property + " has own property\n");
            continue;
		}

        //----------------------------------------------------------------------
        // check for getters/setters
        //----------------------------------------------------------------------
        var getter = undefined;
        var setter = undefined;
        
        if (isES5) {
            getter = object.__lookupGetter__(property);
            setter = object.__lookupSetter__(property);
        }
        
        var name = prefix + property;
        
        //----------------------------------------------------------------------
        // found a getter/setter?
        //----------------------------------------------------------------------
        if (getter || setter) {
			console.log('getters[property]' + getters[property]);
            if (getter) {
                getters[property] = FunctionTracer.traceFunction(getter, name + "<get>");
            }
            
            if (setter) {
                setters[property] = FunctionTracer.traceFunction(setter, name + "<set>");
            }
        }
        
        //----------------------------------------------------------------------
        // found a function?
        //----------------------------------------------------------------------
        else {
			console.log('---object[property]: ' + object[property]);
            var func = object[property];
            if (typeof func != "function") continue;
            
            functions[property] = FunctionTracer.traceFunction(func, name);
        }
    }
    
    //--------------------------------------------------------------------------
    // install the wrappers; didn't do this in the original loop since we are
    // in some sense mutating the object while iterating on it's properties,
    // typically not a safe thing to do
    //--------------------------------------------------------------------------
    
    for (var property in functions) {
        object[property] = functions[property];
        (FunctionTracer.logFunction)("installed tracer: " + prefix + property + "()");
    }
    
    for (var property in getters) {
        object.__defineGetter__(property, getters[property]);
        (FunctionTracer.logFunction)("installed tracer: " + prefix + property + "<get>()");
    }
    
    for (var property in setters) {
        object.__defineSetter__(property, setters[property]);
        (FunctionTracer.logFunction)("installed tracer: " + prefix + property + "<set>()");
    }
}