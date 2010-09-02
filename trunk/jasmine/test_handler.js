var TstH = function(){
	hello_1: function (){
		var str = 'stringAndSubstring';
		var sub =  str.substring(10)
	//	console.log("hello_1's this: " + this.name);
		console.log("hello world 1!" + sub);
	},

	hello_2: function (){
	//	console.log("hello_2's this: " + this.name);
		console.log("hello world 2!");
	},

	hello_3: function (){
	//	console.log("hello_3's this: " + this.name);
		console.log("hello world 3!");
	},


	hello_4: function (){
	//	console.log("hello_4's this: " + this.name);
		console.log("hello dojo connect!");
	},

	rewrite: function (old){	
		console.log("rewriting " + old + "...");
		return function(){
			if (old.name == 0) {
				console.log('anonymous function');
				old[name] = 'anonymous';
			}
			console.log( 'add something to |' + old.name + '|');// + ', called by ' + this.name);
			
			console.log("old's this: " + this.name);
			old.apply(this, arguments);//Array.prototype.splice.call(arguments, 0));
			/*
			try {
				return old.apply(this, Array.prototype.splice.call(arguments, 0));
			}
			catch(e) {
				console.log(e);
			}*/
		}
	}
}