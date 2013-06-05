/*!
 * Polyfill for Functions
 * Copyright(c) 2013 John Henry
 * MIT Licensed
 *      
 */


(function(global,bindToPrototype){
////////////
//Setup
////////////
    var OBJ = global.Function;//The constructor object
    var prototype = global.Function.prototype;//The prototype of instances of the constructor object

    //Methodize -- Attaches functions to objects as methods
    //Note:
        //Here, "ConstructorObject.FunctionName(objectInstance,parameters...)" and "objectInstance.functionName(parameters...)" are generally equivalent.
        //This allows for the use of both Object-Oriented and Functional paradigms
        //Being aware of this should make the source code a bit less confusing
    var methodize = function(target,method,method_name,overwrite){
        if(!target[method_name] || overwrite && bindToPrototype !== false)
        target[method_name] = function(){
            return method.apply(this,[this].concat(Array.prototype.slice.call(arguments,0)));
        }
        return target;
    }
    //TypeOf -- Returns the proper type of a given object as an array as an alternative to the "typeof" keyword
    //Arguments
        //object:* -- Object who's type is to be tested
    //Returns :string{"object"|"array"|"function"|"number"|"boolean"|"null"|"undefined"|"string"}
    //Example
        //Console.log(Object.TypeOf(null)); //#null 
    var typeOf = function(o) {//http://javascript.crockford.com/remedial.html
        var s = typeof o
        return (s !== 'object')? s : (!o)? 'null' : (Object.prototype.toString.call(o) === '[object Array]')? 'array' : s
    }


////////////
//Static Functions
////////////

    //ChainObject - Takes a value  and returns a Chain Object containing those values
        //This is sort of the "reverse" of a function.
        //Normally, you pass values to a function to obtain a result
        //But, with Chain Objects, you pass the functions to the object using #call or #ncall which modify it's initial value.
        //API
            //chainObject(seeds___) //Constructor
            //#.toString() -- Returns the string value of the object
            //#.call(functions___) -- Modifys objects's value by applying a list of functions
            //#.ncall(n,functions___) -- Modifys objects's value by applying a list of functions n times
            //#.test(functions___) -- Applies list of functions to object's value and returns result. Does not actually modify value.
    //Arguments
        //seeds___:list<objects> -- initial object or list of objects to be used as initial value
    //Examples
        //var co = chainObject(0);
        //console.log(co.toString())//#"0";
        //co.call(Math.cos);
        //console.log(co.toString())//#"1";
    var chainObject = OBJ.ChainObject = function(seeds___){
        var _scope = this, _value, _fresh;
        var get_value = function(){return _value};
        var set_value = function(seeds___){
            _value = Array.prototype.splice.call(arguments,0);
            _fresh = true;
            if(typeOf(_value) === 'array' && _value.length === 1){
                _value = _value[0];
                _fresh = false;
            }

            if(typeOf(_value) !== 'array'){
                _fresh = false;
            };
        }
        set_value.apply(this,arguments);
        var co = {
            toString:function(){return this.value().toString()},
            call:function(functions___){
                for(var i = 0; i<arguments.length; i++){
                    _value = typeof arguments[i] === 'function'? _fresh? arguments[i].apply(_scope,_value) : arguments[i].apply(_scope,[_value]) : arguments[i];
                    _fresh = false;
                }
                return this;
            },
            ncall:function(n,functions___){
                f = Array.prototype.slice.call(arguments,1);
                for(n = n || 0; n > 0; n--) this.call.apply(this,f);
                return this;
            },
            test:function(functions___){
                for(var i = 0; i<arguments.length; i++){
                    var test_val = typeof arguments[i] === 'function'? _fresh? arguments[i].apply(_scope,_value) : arguments[i].apply(_scope,[_value]) : arguments[i];
                }
                return test_val;
            }
        }
        co.__defineGetter__("value",get_value);
        co.__defineSetter__("value",set_value);
        return co;
    }

    //argNames - Return an array of strings representing names of a function's expected parameters
    //Arguments
        //func:function(:list<object>):* -- the given function
    //Returns
        //:array<string> -- array of named parameters    
    //Note: This is Jack Allan's Answer from: http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
    //Note: This implementation is very fragile
        //It can be broken with inline comments
        //It can't account for unnammed parameters such as those that are only accessed through parameters
    var argNames = OBJ.ArgNames = function(func){
        var names = func.toString();
        return names.slice(names.indexOf('(')+1, names.indexOf(')')).match(/([^\s,]+)/g) || [];
    }
    methodize(prototype,argNames,'argNames');
    
///////
//Empty Functions -- various interpretations of the empty function
///////

    //EMPTY -- does nothing and returns undefined (read:"nothing")
    //Arguments
        //:list<*> -- anything
    //Returns
        //undefined
    var EMPTY = OBJ.EMPTY = function(){return undefined;}

    //EMPTY (Version 2)
    //Differes from the first version in that
        //using the new keyword *may* produce different behavior
        //Example
            //EMPTY("hello");//# returns undefined
            //new EMPTY("hello");//# returns undefined
            //EMPTY_V2("hello");//# returns undefined
            //new EMPTY_V2("hello");//# returns {} or undefined depending on the implementation
    var EMPTY_V2 = OBJ.EMPTY_V2 = function(){};


///////
//Identity Functions -- various interpretations of the "identity" function
///////

    //IDENTITY -- returns [first] argument passed
    //Arguments
        //* -- argument passed
    //Returns
        //* -- argument passed
    var IDENTITY = OBJ.IDENTITY = function(){return arguments[0];}


    //IDENTITY (version 2)
    //Differs from the first version in that 
        //if more than one argument is passed, 
        //all arguments are returned in the form of an array.
    var IDENTITY_V2 = OBJ.IDENTITY_V2 = function(){if(arguments.length === 1) return arguments[0]; return Array.prototype.slice(arguments);}
    
    //IDENTITY (version 3)
    //Differs from the first version in that 
        //the return value is always an array of the arguments passed, 
    var IDENTITY_V3 = OBJ.IDENTITY_v3 = function(){return Array.prototype.slice(arguments);}

    
////////////
//Prototype Functions
////////////



//Apply,Call,Bind 
//Note: These are already implemented in Javascript and are here for fun and academic purposes only.

    //Apply - Executes a given function in a given context
    //Arguments
        //func(:list<object>):* - function to be called
        //context:object - context in which the function is to be called
        //args_array:array<object> - array of arguments to be passed to func
    var apply = OBJ.Apply = function(func,context,args_array){
         return func.apply(context,args_array)
    }
    methodize(prototype,apply,"apply"); //methodize Apply//Note:Already Implemented

    //Call - Executes a given function in a given context
    //Arguments
        //func(:list<object>):* - function to be called
        //context:object - context in which the function is to be called
        //args___:list<object> - list of arguments to be passed to func
    var call = OBJ.Call = function(func,context,args___){
            var args = Array.prototype.shift.call(arguments,2)
            return func.apply(context,args)
    }
    methodize(prototype,call,"call")//methodize Call//Note:Already Implemented

    //Bind - Creates a version of a give function that Executes withing a give context
    var bind = OBJ.Bind = function(func,context){
        return function(){
            return func.apply(context,arguments)
        }
    }
    methodize(prototype,"bind",bind); //methodize Bind//Note:Already Implemented

//Inspired by Bind
//These are functions that return modified versions of given functions. 

    //Chain - Creates a chained version of a given function
        //I.E. chain(f,3)(x) <===> f(f(f(x)))
    //Arguments
        //func(:list<object>):* - function to be augmented
        //times:number{uint} - number of times to execute
    //Example
        //var s = Math.sin;
        //var s4 = Math.sin.chain(4);
        //console.log(s(s(s(s(5)))) === s4(5)); //#true
    var chain = OBJ.Chain = function(func,times){
        return function(){
            return chainObject.apply(this,Array.prototype.slice.call(arguments,0)).ncall(times,func).value;
        }
    }
    methodize(prototype,chain,"chain");

    //Curry - Creates a version of a given function that automatically curries it's inputs
        //if less than the expected number of argumens is given
    //Arguments
        //func(:list<object>):* - the given function
        //minArgs:number{uint} - the minimum number of arguments needed to return the given functions desired type
            //Note:This defaults to the expected number of arguments of the given function
                //However, as this could be variable, it's best to specify minArgs explicityl
        //defaults___:list<object> - the default arguments passed to the function
            //Note: the length of defaults is subtracted from minArgs
                //That is, having minArgs = 2 and 2 defaults will return a function that is ready
    //Examples
        //var pow = Math.pow.curry();
        //pow(3,2); //#9
        //pow(3); //#[Function]
        //pow(3)(2); //#9
    //Note: if a curried function's minimum arguments are met, the function still must be properly called to retrieve it's value
        //Example:
            //var pow = Math.pow.curry(3,4)
            //pow; //#[Function]
            //pow(); //#81
    var curry = OBJ.Curry = function(func,minArgs,defaults___){
        var defaults = Array.prototype.slice.call(arguments,2)
        minArgs = (minArgs || minArgs === 0)? minArgs : func.length;
        minArgs -= defaults.length ;
        return function(args___){
            var args = defaults.concat(Array.prototype.slice.call(arguments,0));
            if(minArgs <= args.length){
                return func.apply(this,args);
            }else{
                return curry.apply(this,[func,minArgs - args.length].concat(args));
            }
        }
    }
    methodize(prototype,curry,"curry");

    //Conditional - Create a version of a given function that returns the proper value if it meets a certain condition. 
        //If the condition is not met, it returns a result augmented by failure_func or undefined if failure_func is not given
    //Arguments
        //func(:list<object>):* - the given function
        //condition(:object):boolean - condition to test the result
        //failure_func(:object):function - method of augmenting the result if it's not acceptable
            //Note:failure_func can be used for notifications of condition failure
            //Note:use a constant function to denote other constant values of failure
                //i.e. // failure_func = function(){return null}
    //Examples
        //var condition = function(n){return n>=0};
        //var cosCond = Math.cos.conditional(condition);
        //console.log(cosCond(0)); //#"1"
        //console.log(cosCond(Math.PI/2)); //#"0" (or some really small number like, "6.123031769111886e-17")
        //console.log(cosCond(Math.PI)); //#undefined
    var conditional = OBJ.Conditional = function(func,condition,failure_func){
        return function(){
            var result = func.apply(this,arguments);
            if(condition(result)) return result;
            return typeof failure_func === 'function'? failure_func(result) : undefined;
        }
    }
    methodize(prototype,conditional, "conditional");
    
    //GuardWith - Create a version of a function "guarded" by another function, that is, 
        //it executes another function on the given function, and if true, allows the function to be run normally
    //Arguments
        //func(:list<object>):* - the given function
        //guard(:function):boolean - condition to test the function
            //Note: unless guard is non-deterministic, i.e. Math.random, or is affected by side effects, 
            //there is probably little point in passing in func
        //failure_func(:function):* - function to caled upon failure
            //Note:Can be use for notifications of condition failure
            //Note:One can use a constant function for other constant values of failure
                //i.e. // function(){return null}
    //Examples
        //var sineEnabled = true;
        //var sineGuard = function(){return sineEnabled};
        //var guardedSine = Math.sin.guardWith(sineGuard);
        //console.log(guardedSine(0)); //#"0"
        //sineEnabled = false;
        //console.log(guardedSine(0)); //#undefined
    var guardWith = OBJ.GuardWith = function(func,guard,failure_func){
        return function(){
            if(guard(func)){
                return  func.apply(this,arguments);
            }
            return typeof failure_func === 'function'? failure(func) : undefined;
        }
    }
    methodize(prototype,guardWith,"guardWith");

    //BindP - Create a version of a function that runs with a give probability
    //Arguments
        //func:function - the given function
        //probability:number{[0,1]} = 0.5 - probability with which the funciton is called
        //failure_func(:function):* - function to caled upon failure
    //Examples
        //var probSine = Math.sin.bindP(0.75); 
        //console.log(probSine(Math.PI/2)); //#1 -- 75% of the time, #undefined 25% of the time
    var bindP = OBJ.BindP = function(func,probability,failure_func){
        return guardWith(func,function(){return (!(Math.random() >= (probability || 0.5)))},failure_func);      
    }    
    methodize(prototype,bindP,"bindP");


    //Memoize - Create a version of a function that caches outputs base on input
    //Arguments
        //func:function - the given function
        //c:object - object to be used as cache
            //Note: if c is not give, the results will be cached within the function itself (Cool Javascript Trick)   
     var memoize = OBJ.Memoize = function(func,c){
        var f = function(){
            var k = Array.prototype.join.call(arguments)//Note:there could be issues with the way this concatnates argumentes, ie where 1.toString() === "1".toString()
            return (k in (c = c || f))? c[k] : c[k] = func.apply(this,arguments);
        }
        return f;
    }
    methodize(prototype,memoize,"memoize");


    //memoizeIn - Create a version of a function that caches inputs based on outputs
    //Arguments
        //func:function - the given function
        //c:object - object to be used as cache
            //Note: if c is not give, the results will be cached within the function itself (Cool Javascript Trick)   
    var memoizeIn = OBJ.MemoizeIn = function(func,c){
        var f = function(){
                var result = func.apply(this,arguments)
                var k = result.toString()//ARG!!! JAVASCRIPT HASHES NEED TO ACCEPT OBJECTS AS KEYS AND NOT JUST STRINGS!!!
                (k in (c = c || f))? c[k] : c[k] = Array.prototype.slice.call(arguments,0);
                return result;
            }
        return f;
    }
    methodize(prototype,memoizeIn,"memoizeIn");


    //Safe - Create a version of a function that catches any errors when executed
    //Arguments
        //func:function(:list<object>) - the given function
        //return_error(:error,:function(:list:<object>)):object - 
            //can also be defined as a function that manipulates the error and/or function upon failure
    //Examples:
        //var f = function(arr,func){return arr.map(func);}
        //var fSafe = f.safe();
        //f([1,2,3],null);//# Throws Error
        //fSafe([1,2,3],null);//#undefined
     var safe = OBJ.Safe = function(func,return_error){
        return function(){
            try{
                return func.apply(this,arguments);
            }catch(error){
                return (return_error === true)? error : (typeof return_error === 'function')? return_error(error,func) : undefined;
            }
        }
    }
    methodize(prototype,safe,"safe");


    //modResult - Create a version of a function with a modified result
    //Arguments
        //func:function(:list<object>):* - the given function
        //modfier(:function(result:object,inputs:array,func:function)):object
    //Examples:
        //var twiceCos = Math.cos.modResult(function(r,a){return 2*r});
        //console.log(twiceCos(0)); //#2 === 2*Math.cos(x)
            //Note: twiceCos(x) === 2*cos(x)
    var modResult = OBJ.ModResult = function(func,modifier){
        return function(){
            return modifier(func.apply(this,arguments),arguments,func);
        }
    }
    methodize(prototype,modResult,"modResult");
 
    //modParams - Create a version of a function with modified parameters
    //Arguments
        //func:function(:list<object>) - the given function
        //modfier(:function(:list<object>)):array<object> - function that modifies parameter array before being give to func
    //Examples:
        //var halfCos = Math.cos.modParams(function(r){return [r/2]}); //#2
        //console.log(halfCos(14)); //# 0.7539022543433046  === Math.cos(14/2)
            //Note: halfCos(x) === Math.cos(x/2)
    var modParams = OBJ.ModParams = function(func,modifier){
        return function(){
            return func.apply(this,modifier.apply(this,Array.prototype.slice.call(arguments,0)));
        }
    }
    methodize(prototype,modParams,"modParams");

    //preMap - Create a version of a function with premapped parameters
    //Arguments
        //func:function(:list<object>) - the given function
        //mapFunc(:function(:object)):object - function that modifies 
            //parameter array before being give to func   
    var preMap = OBJ.PreMap = function(func,mapFunc){
        return modParams(func,function(){
            return Array.prototype.map.call(arguments,mapFunc);
        })
    }
    methodize(prototype,preMap,"preMap");

    //vectorize - Create a version of a function that takes and returns vector rather than a single parameter
    //Arguments
        //func:function(:object):* - the given function
        //degrade:boolean = true - whether or not the function should degrade into the original function when not passed an array
    //Example
        //var sinv = Math.sin.vectorize();
            //sinv([0,Math.PI/2,Math.PI]); //#[0,1,0]
            //sinv([0]); //#[0]
            //sinv(0);//#0
    var vectorize = OBJ.Vectorize = function(func,degrade){
        degrade = degrade === undefined? true : degrade;
        return function(vector){
            return (degrade && typeOf(vector) !== 'array')? func(vector) : vector.map(func);
        }
    }
    methodize(prototype,vectorize,"vectorize");

    //rearrange - Create a version of a function that takes the parameters rearranged
    //Arguments
        //func:function(:list<object>) - the given function
        //Example: rPow = Math.pow.rearrange(1,0)
            //rPow(2,3); //#9
            //rPow(3,4); //#64
    var rearrange = OBJ.Rearrange = function(func,positions___){
        var positions = Array.prototype.slice.call(arguments,1);
        return modParams(func,function(){
            var newPositions = [];
            for(var i = 0; i< arguments.length; i++)    newPositions.push((i < positions.length)? arguments[positions[i]] : arguments[i]);
            return newPositions;
        })
    }
    methodize(prototype,rearrange,"rearrange");

    //timeout - Create a version of a function executes after a specified interval
    //Arguments
        //func:function(:list<object>):* -- the given function
        //time:number{uint} -- time in milliseconds before function executes
        //callback:function(:object):* -- function to be execute upon result -- useful as function's result is not immediately returned
    //Example
        //var delayLog = console.log.timeout(10000);
            //delayLog("hello");//#...wait 10 seconds..."hello"
    var timeout = OBJ.Timeout = function(func,time,callback){
        return function(){
            var args = arguments;
            var self = this;
            return setTimeout(function(){
                var result = func.apply(self,args);
                return (typeof callback === "function")? callback.call(self,result):result;

            },time)
        }
    }    
    methodize(prototype,timeout,"timeout");


    //interval - Create a version of a function that executes perodically at a specified interval
    //Arguments
        //func:function(:list<object>):* -- the given function
        //time:number{uint} -- time in milliseconds before function executes
        //callback:function(:object):* -- function to be execute upon result -- useful as function's result is not immediately returned
    //Returns
        //:object -- id that can be used with clearInterval to stop execution
    //Example
        //var repeatLog = console.log.interval(5000);
            //repeatLog("hi");
                //#...wait 5 seconds..."hi"
                //#...wait 5 seconds..."hi"
                //#...wait 5 seconds..."hi"
                //#... you get the picture...
    var interval = OBJ.interval = function(func,time,callback){
        return function(){
            var args = arguments;
            var self = this;
            return setInterval(function(){
                var result = func.apply(self,args);
                return (typeof callback === "function")? callback.call(self,result):result;

            },time)
        }
    }    
    methodize(prototype,interval,"interval");


    //hashReplace - Return a function that accepts a hash of named parameters rather than a list
    //Arguments
        //func:function(:list<object>):* -- the given function
    //Returns
        //:function(:object{hash}) -- new function   
    //Note: This was inspired by a recent job interview
    //Example
        //var diff = function(a,b){return a - b;}.acceptHash();
            //diff({a:1,b:2}) //#"-1"
            //diff({a:2,b:1}) //#"1"
    var acceptHash = OBJ.AcceptHash = function(func){
        var self = this;
        var args = argNames(func);
        return function(argObj){
            return func.apply(self,args.map(
                function(a){
                    return argObj[a];
                }).concat(
                    Array.prototype.slice.call(arguments,1)
                )
            );
        }
    }
    methodize(prototype,acceptHash,'acceptHash');


    //pre - returns a function that calls a series of functions immediatedly before a given function.
    //Arguments
        //func:function(:list<*>):* -- the given function
        //functions:list(:<function(:list<*>):*)
    //Returns
        //:function(:list<*>) -- new function 
    var pre = OBJ.Pre = function(func,functions___){
       var functions = Array.prototype.slice.call(arguments,1);
       return function(){
            for(var i = 0; i < functions.length; i++){
                functions[i].apply(this,arguments);
            }
            return func.apply(this,arguments);
       }
    }    
    methodize(prototype,pre,"pre");

    //post - returns a function that calls a series of functions immediatedly after a given function.
    //Arguments
        //func:function(:list<*>):* -- the given function
        //functions:list(:<function(:list<*>):*)
    //Returns
        //:function(:list<*>) -- new function 
    var post = OBJ.Post = function(func,functions___){
       var functions = Array.prototype.slice.call(arguments,1);
       return function(){
            var result = func.apply(this,arguments);
            for(var i = 0; i < functions.length; i++){
                functions[i].apply(this,[result].concat(arguments));
            }
            return result;
       }
    }    
    methodize(prototype,post,"post");



    //compose - returns a function that calls a series of functions immediatedly before a after function.
    //Arguments
        //uint: function -- function to ensure input type is the same a functions' output type
        //bind: function -- function to allow functions to accept output types as inputs
        //func:function(:list<*>):* -- the given function
        //functions:list(:<function(:list<*>):*) --list of functions to be compose with f
            //Note:Will compose form right to left, 
                //func.compose(uint,bind,a,b,c...)(d) <=> f(a(b(c(d))))
    //Returns
        //:function(:list<*>) -- new function
    //Note: In the case that no coercion is necessary through bind or uint,
        //the compose function might not save you a lot of code. Examine the following:
            //var Form1 = function(x){return Math.sin(Math.cos(Math.tan(x)));};
            //var Form2 = Math.sin.compose(null,null,Math.cos,Math.tan);
        //Form1 almost definately saves you some computation time wihout enforcing unnecessary abstrattions
        //Form2 is prettier :)
    var compose = OBJ.Compose = function(func,uint,bind,functions___){
        var functions = Array.prototype.slice.call(arguments,3);
        uint = uint || IDENTITY
        bind = bind || IDENTITY
        return function(){
            var result = uint.apply(this,arguments);
            while(functions.length){
                result = bind(functions.pop())(result)
            }
            return(func(result));
        }
    }
    methodize(prototype,compose,"compose");


})(typeof global === 'undefined'? window : global,true)