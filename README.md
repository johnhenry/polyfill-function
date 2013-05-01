#Polyfill - Function

##Add useful functions to... functions?

##Node
### Installation

```
    $ npm install polyfill-function
```
### Usage Example

```js
    require('polyfill-function');

    var recursive = function(func,seeds___){
        var seeds = Array.prototype.slice.call(arguments,1);
        return function(step){
            if(step < seeds.length) return seeds[step];
            var ns = seeds.slice(0);
            while(--step +1) ns.pushOff(func.apply(this,ns));
            return ns[ns.length - 1];
        }
    }
    var fib = recursive(function(a,b){return a+b},0,1);//Alternative definition of the Fibonacci Sequence

```

##Web
### Installation
```html
   <script src="./lib/polyfill-function.js" ></script>
```
### Usage Example
```html
    <!--This particular example requires array#pushOff from the polyfill-array library-->
   <script src="./lib/polyfill-array.js" ></script>
   <script>
    var recursive2 = function(func,seeds___){
        var seeds = Array.prototype.slice.call(arguments,1)
        return function(step){
            if(step < seeds.length) return seeds[step]
            return (function(ns){
                return ns.pushOff(func.apply(this,ns));
            }).chain(step)(seeds.slice(0))[seeds.length-1]
        }
    }
    var fib2 = recursive2(function(a,b){return a+b},0,1);//Alternative alternative definition of the Fibonacci Sequence
    var fib2mem = fib2.memoize();//Memoized version of the Fibonacci Sequence
   </script>
```
## License

(The MIT License)

Copyright (c) 2013 John Henry &lt;john@iamjohnhenry.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
