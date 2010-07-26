// requires Array.indexOf, Array.map, and Array.forEach
// if you don't have these, you can get portable implementations here:
//    https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array

//---------------------------------------------------------------------
// wrap a function with a backtrace printer
//
// parameters:
//   func:     the function to wrap
//   receiver: the (optional) receiver to call func with
//
// returns: 
//   a new function to use in replace of the original function
//---------------------------------------------------------------------
function wrapWithBackTrace(func, receiver) {

    // get the name of a function
    function funcName(func) {
        return func.name || "{anonymous}"
    }
    
    // generate the actual backtrace as an array of strings
    function getBackTrace() {
        var stack = []
        var func  = arguments.callee.caller.caller

        // iterate through the stack
        while (func) {
            // check for recursion!
            if (stack.indexOf(func) != -1) {
                stack.push({name: "... recursion on " + funcName(func)})
                break
            }
            
            // collect results, move to next entry
            stack.push(func)
            func = func.caller
        }

        // convert results to function names
        var result = stack.map(function(element) { 
            return funcName(element) + "()"
        })
        
        // if nothing on stack, was a top level call
        if (!result.length) result = ["{top level call}"]
        
        return result
    }

    // returns the function to use as a replacement
    return function wrappedWithBackTrace() {
        // get the calling arguments
        var args   = Array.prototype.slice.call(arguments)
        
        // call the original function
        var result = func.apply(receiver, args)
        
        // get the back trace
        var trace  = getBackTrace()
        
        // get our function name
        var name   = funcName(func)
        
        // print results
        console.log("backtrace for " + name + "()")
        trace.forEach(function (element) {
            console.log("   - " + element)
        })
        console.log("")
        
        return result
    } 
}
