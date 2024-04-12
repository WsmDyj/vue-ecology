# 前端模块化
在了解vite之前我们先来看看前端模块化。

我们知道，在NodeJS之前，由于没有过于复杂的开发场景，前端是不存在模块化的，后端才有模块化。NodeJS诞生之后，它使用CommonJS的模块化规范。从此，js模块化开始快速发展。

模块化的开发方式可以提供代码复用率，方便进行代码的管理。通常来说，一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。目前流行的js模块化规范有CommonJS、AMD、CMD、UMD以及ES6的模块系统。这里重点讲一下我们常用的 CommonJS 与 ESModuel。

## CommonJS
NodeJS是CommonJS规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：module、exports、require、global。实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接用exports），用require加载模块。
```js
// 定义模块math.js
var total = 10;
function add(a, b) {
  return a + b;
}
// 需要向外暴露的函数、变量
module.exports = {
  add: add,
  total: total
}

/** 必须加./路径，不加的话只会去node_modules文件找 **/
// 引用自定义的模块时，参数包含路径，可省略.js
var math = require('./math');
math.add(2, 5);

// 引用核心模块时，不需要带路径
var http = require('http');
http.createService(...).listen(3000);
```

CommonJS用同步的方式加载模块。也就是说需要某个模块，服务器端便停下来，等待它加载再执行。
**在服务端，模块文件都存放在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载**。

## ES Module
ES6 在语言标准的层面上，实现了模块功能，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
```js
/** 定义模块 math.js **/
var total = 0;
var add = function (a, b) {
    return a + b;
};
export { total, add };

/** 引用模块 **/
import { total, add } from './math';
function test(ele) {
    ele.textContent = add(99 + total);
}
```
ES6的模块不是对象，import命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。

## 两者的差异
1. **CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用**

    CommonJS模块输出的是值的拷贝，一旦输出一个值，模块内部的变化影响不到这个值；

    ES6模块的运行机制是对值的引用。js引擎对脚本静态分析的时候，遇到模块加载（import）就会生成一个只读引用，等脚本真正执行时，在根据这个只读引用，到被加载的那个模块里去取值。

2. **CommonJS 模块是运行时加载，ES6 模块是编译时输出接口**

    CommonJS模块就是对象，在输入时先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载被称为“运行时加载”

    ES6模块不是对象，而是通过 export 命令显示指定输出的代码，import 时采用静态命令的形式。即在 import 时可以指定加载某个输出值，而不是加载整个模块，这种加载被称为“编译时加载”

下面通过例子来加深一下我们的理解：

首先我们看一个CommonJS输出拷贝的例子：
```js
// a.js
let a = 1;
let b = { num: 1 }
// 定时任务修改a,b的值
setTimeout(() => {
    a = 2;
    b = { num: 2 };
}, 200);
module.exports = {
    a,
    b,
};

// main.js
let {a, b} = require('./a');
// 引入之后值就不会在更改
console.log(a);  // 1
console.log(b);  // { num: 1 }
setTimeout(() => {
    console.log(a);  // 1
    console.log(b);  // { num: 1 }
}, 500)
```
从例子中我们可以看到，到500毫秒之后打印a,b的值依然是最初定义的值的结果，这就是所谓的输出拷贝，如果了解过 NodeJS 或者 webpack 对 CommonJS 的实现，就会知道：exports对象是模块内外的唯一关联， CommonJS 输出的内容，就是exports对象的属性，模块运行结束，属性就确定了。

再看ES6 Module输出的例子：
```js
// a.mjs
let a = 1;
let b = { num: 1 }
setTimeout(() => {
    a = 2;
    b = { num: 2 };
}, 200);
export {
    a,
    b,
};

// main.mjs
// node --experimental-modules main.mjs
import {a, b} from './a';
console.log(a);  // 1
console.log(b);  // { num: 1 }
setTimeout(() => {
    console.log(a);  // 2
    console.log(b);  // { num: 2 }
}, 500);
```
从这个例子中可以看出500毫秒之后引用的a,b值变化了，这就是ES6 Module，它是对值的引用，当值发生改变，代码运行时也会随之改变。