// sample code

function legend(message) {
    var dashes = new Array(60).join("-")
    console.log(dashes)
    console.log(message)
    console.log(dashes)
    console.log("")
}

// tests with user-land function

function factorial(n) {
    if (n <= 0) return 1
    return n * factorial(n-1)
}

function printFactorial(n) {
    console.log(n + "! == " + factorial(n))
    console.log("")
}

function a() { b() }
function b() { c() }
function c() { 
    printFactorial(0)
    printFactorial(5)
}

legend("calling factorial() before wrapping")
a()

factorial = wrapWithBackTrace(factorial)

legend("calling factorial() after wrapping")
a()

legend("calling factorial() at top level")
factorial(0)

// tests with built-in function

setTimeout = wrapWithBackTrace(setTimeout)

function doNothing() { 
    console.log("in doNothing()") 
    console.log("")
}

function x() { y() }
function y() { z() }
function z() { setTimeout(doNothing, 100) }

legend("calling setTimeout() after wrapping")
x()

legend("calling setTimeout() at top level")
setTimeout(doNothing, 200)
