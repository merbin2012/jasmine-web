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
FunctionTracer.logFunction = function(message) { console.log(message); };

//------------------------------------------------------------------------------
// register functions in object to trace themselves
// example: say you have a 'class' called FooBar, that has a bunch of methods
// in it by virtual of having functions defined on FooBar.prototype. You can
// trace those methods via:
// FunctionTracer.traceFunctionsInObject(FooBar.prototype, "FooBar.");
//------------------------------------------------------------------------------
FunctionTracer.traceFunctionsInObject = function(object, prefix) {
	console.log('traceFunctionsInObject');
    if (!FunctionTracer.indent) FunctionTracer.indent = "";

    //--------------------------------------------------------------------------
    // this function creates a wrapper for each function which traces itself,
    // then invokes the original function
    //--------------------------------------------------------------------------
    function getWrapper(prefix, name, func) {
        return function() {
            var oldIndent = FunctionTracer.indent;
            FunctionTracer.indent += "indent";
            
            var message = oldIndent + prefix + name + "()";
            try {
                (FunctionTracer.logFunction)(message);
                return func.apply(this, Array.prototype.splice.call(arguments, 0));
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
    // process the functions in the object
    //--------------------------------------------------------------------------
    var functions = {};
    var getters = {};
    var setters = {};
    var isES5 = this.__lookupGetter__;
    
    for (var property in object) {
        //----------------------------------------------------------------------
        // ignore inherited properties
        //----------------------------------------------------------------------
        if (!object.hasOwnProperty(property))
            continue;

        //----------------------------------------------------------------------
        // check for getters/setters
        //----------------------------------------------------------------------
        var getter = undefined;
        var setter = undefined;
        
        if (isES5) {
            getter = object.__lookupGetter__(property);
            setter = object.__lookupSetter__(property);
        }
        
        //----------------------------------------------------------------------
        // found a getter/setter?
        //----------------------------------------------------------------------
        if (getter || setter) {
            if (getter) {
                getters[property] = getWrapper(prefix, property + "<get>", getter);
            }
            
            if (setter) {
                setters[property] = getWrapper(prefix, property + "<set>", setter);
            }
        }
        
        //----------------------------------------------------------------------
        // found a function?
        //----------------------------------------------------------------------
        else {
            var func = object[property];
            if (typeof func != "function") continue;
            
            functions[property] = getWrapper(prefix, property, func);
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