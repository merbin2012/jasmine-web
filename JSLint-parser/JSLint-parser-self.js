<script src="tokens.js"></script>
<script src="parse.js"></script>
<script src="json2.js"></script>
<pre>
<script>
/*jslint evil: true */

/*members create, error, message, name, prototype, stringify, toSource,
    toString, write
*/

/*global JSON, make_parse, parse, source, tree */

// Make a new object that inherits members from an existing object.

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Transform a token object into an exception object and throw it.

Object.prototype.error = function (message, t) {
    t = t || this;
    t.name = "SyntaxError";
    t.message = message;
    throw t;
};


try {
    parse = make_parse();

// We are going to make the parse function parse itself.

    source = make_parse.toSource ?
            make_parse.toSource() : make_parse.toString();
    source = "var make_parse = " + source + ";";
    tree = parse(source);
    if (tree) {
        document.write(JSON.stringify(tree, ['key', 'name', 'message',
            'value', 'arity', 'first', 'second', 'third', 'fourth'], 4));
    }

} catch (e) {
    document.write(JSON.stringify(e, ['name', 'message', 'from', 'to', 'key',
            'value', 'arity', 'first', 'second', 'third', 'fourth'], 4));
}

</script>
