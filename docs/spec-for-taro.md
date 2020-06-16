---
title: Taro 规范
---

## 项目组织

### 文件组织形式

> 以下文件组织规范为最佳实践的建议

所有项目源代码请放在项目根目录 `src` 目录下，项目所需最基本的文件包括 **入口文件** 以及 **页面文件**

* 入口文件为 `app.js`
* 页面文件建议放置在 `src/pages` 目录下

一个可靠的 Taro 项目可以按照如下方式进行组织

    ├── config                 配置目录
    |   ├── dev.js             开发时配置
    |   ├── index.js           默认配置
    |   └── prod.js            打包时配置
    ├── src                    源码目录
    |   ├── components         公共组件目录
    |   ├── pages              页面文件目录
    |   |   ├── index          index 页面目录
    |   |   |   ├── banner     页面 index 私有组件
    |   |   |   ├── index.js   index 页面逻辑
    |   |   |   └── index.css  index 页面样式
    |   ├── utils              公共方法库
    |   ├── app.css            项目总通用样式
    |   └── app.js             项目入口文件
    └── package.json

### 文件命名

Taro 中普通 JS/TS 文件以小写字母命名，多个单词以下划线连接，例如 `util.js`、`util_helper.js`

Taro 组件文件命名遵循 Pascal 命名法，例如 `ReservationCard.jsx`

### 文件后缀

Taro 中普通 JS/TS 文件以 `.js` 或者 `.ts` 作为文件后缀

Taro 组件则以 `.jsx` 或者 `.tsx`  作为文件后缀，当然这不是强制约束，只是作为一个实践的建议，组件文件依然可以以 `.js` 或者 `.ts` 作为文件后缀

## JavaScript 书写规范

在 Taro 中书写 JavaScript 建议遵循以下规则

### 基本书写

#### 使用两个空格进行缩进

> 不要混合使用空格与制表符作为缩进

```javascript
function hello (name) {
  console.log('hi', name)   // ✓ 建议
    console.log('hello', name)   // ✗ 不建议
}
```

#### 除了缩进，不要使用多个空格

```javascript
const id =    1234    // ✗ 不建议
const id = 1234       // ✓ 建议
```

#### 不要在句末使用分号

```javascript
const a = 'a'   // ✓ 建议
const a = 'a';  // ✗ 不建议
```

#### 字符串统一使用单引号

```javascript
console.log('hello there')
// 如果遇到需要转义的情况，请按如下三种写法书写
const x = 'hello "world"'
const y = 'hello \'world\''
const z = `hello 'world'`
```

#### 代码块中避免多余留白

```javascript
if (user) {
                            // ✗ 不建议
  const name = getName()
 
}

if (user) {
  const name = getName()    // ✓ 建议
}
```

#### 关键字后面加空格

```javascript
if (condition) { ... }   // ✓ 建议
if(condition) { ... }    // ✗ 不建议
```

#### 函数声明时括号与函数名间加空格

```javascript
function name (arg) { ... }   // ✓ 建议
function name(arg) { ... }    // ✗ 不建议

run(function () { ... })      // ✓ 建议
run(function() { ... })       // ✗ 不建议
```

#### 展开运算符与它的表达式间不要留空白

```javascript
fn(... args)    // ✗ 不建议
fn(...args)     // ✓ 建议
```

#### 遇到分号时空格要后留前不留

```javascript
for (let i = 0 ;i < items.length ;i++) {...}    // ✗ 不建议
for (let i = 0; i < items.length; i++) {...}    // ✓ 建议
```

#### 代码块首尾留空格

```javascript
if (admin){...}     // ✗ 不建议
if (admin) {...}    // ✓ 建议
```

#### 圆括号间不留空格

```javascript
getName( name )     // ✗ 不建议
getName(name)       // ✓ 建议
```

#### 属性前面不要加空格

```javascript
user .name      // ✗ 不建议
user.name       // ✓ 建议
```

#### 一元运算符前面跟一个空格

```javascript
typeof!admin        // ✗ 不建议
typeof !admin        // ✓ 建议
```

#### 注释首尾留空格

```javascript
//comment           // ✗ 不建议
// comment          // ✓ 建议

/*comment*/         // ✗ 不建议
/* comment */       // ✓ 建议
```

#### 模板字符串中变量前后不加空格

```javascript
const message = `Hello, ${ name }`    // ✗ 不建议
const message = `Hello, ${name}`      // ✓ 建议
```

#### 逗号后面加空格

```javascript
// ✓ 建议
const list = [1, 2, 3, 4]
function greet (name, options) { ... }
```

```javascript
// ✗ 不建议
const list = [1,2,3,4]
function greet (name,options) { ... }
```

#### 不允许有连续多行空行

```javascript
// ✓ 建议
const value = 'hello world'
console.log(value)
```

```javascript
// ✗ 不建议
const value = 'hello world'



console.log(value)
```

#### 单行代码块两边加空格

```javascript
function foo () {return true}    // ✗ 不建议
function foo () { return true }  // ✓ 建议
if (condition) { return true }  // ✓ 建议
```

#### 不要使用非法的空白符

```javascript
function myFunc () /*<NBSP>*/{}   // ✗ 不建议
```

#### 始终将逗号置于行末

```javascript
const obj = {
  foo: 'foo'
  ,bar: 'bar'   // ✗ 不建议
}

const obj = {
  foo: 'foo',
  bar: 'bar'   // ✓ 建议
}
```

#### 点号操作符须与属性需在同一行

```javascript
console.log('hello')  // ✓ 建议

console.
  log('hello')  // ✗ 不建议

console
  .log('hello') // ✓ 建议
```

#### 文件末尾留一空行

#### 函数调用时标识符与括号间不留间隔

```javascript
console.log ('hello') // ✗ 不建议
console.log('hello')  // ✓ 建议
```

#### 键值对当中冒号与值之间要留空白

```javascript
const obj = { 'key' : 'value' }    // ✗ 不建议
const obj = { 'key' :'value' }     // ✗ 不建议
const obj = { 'key':'value' }      // ✗ 不建议
const obj = { 'key': 'value' }     // ✓ 建议
```

### 变量定义

#### 使用 const/let 定义变量

> 当前作用域不需要改变的变量使用 `const`，反之则使用 `let`

```javascript
const a = 'a'
a = 'b'   // ✗ 不建议，请使用 let 定义

let test = 'test'

var noVar = 'hello, world'   // ✗ 不建议，请使用 const/let 定义变量
```

#### 每个 const/let 关键字单独声明一个变量

```javascript
// ✓ 建议
const silent = true
let verbose = true

// ✗ 不建议
const silent = true, verbose = true

// ✗ 不建议
let silent = true,
    verbose = true
```

#### 不要重复声明变量

```javascript
let name = 'John'
let name = 'Jane'     // ✗ 不建议

let name = 'John'
name = 'Jane'         // ✓ 建议
```

#### 不要使用 undefined 来初始化变量

```javascript
let name = undefined    // ✗ 不建议

let name
name = 'value'          // ✓ 建议
```

#### 对于变量和函数名统一使用驼峰命名法

```javascript
function my_function () { }    // ✗ 不建议
function myFunction () { }     // ✓ 建议

const my_var = 'hello'           // ✗ 不建议
const myVar = 'hello'            // ✓ 建议
```

#### 不要定义未使用的变量

```javascript
function myFunction () {
  const result = something()   // ✗ 不建议
}
```

#### 避免将变量赋值给自己

```javascript
name = name   // ✗ 不建议
```

### 基本类型

#### 不要省去小数点前面的 0

```javascript
const discount = .5      // ✗ 不建议
const discount = 0.5     // ✓ 建议
```

#### 字符串拼接操作符 (Infix operators) 之间要留空格

```javascript
// ✓ 建议
const x = 2
const message = 'hello, ' + name + '!'
```

```javascript
// ✗ 不建议
const x=2
const message = 'hello, '+name+'!'
```

#### 不要使用多行字符串

```javascript
const message = 'Hello \
                 world'     // ✗ 不建议
```

#### 检查 NaN 的正确姿势是使用 isNaN()

```javascript
if (price === NaN) { }      // ✗ 不建议
if (isNaN(price)) { }       // ✓ 建议
```

#### 用合法的字符串跟 typeof 进行比较操作

```javascript
typeof name === undefined       // ✗ 不建议
typeof name === 'undefined'     // ✓ 建议
```

### 对象与数组

#### 对象中定义了存值器，一定要对应的定义取值器

```javascript
const person = {
  set name (value) {    // ✗ 不建议
    this._name = value
  }
}

const person = {
  set name (value) {
    this._name = value
  },
  get name () {         // ✓ 建议
    return this._name
  }
}
```

#### 使用数组字面量而不是构造器

```javascript
const nums = new Array(1, 2, 3)   // ✗ 不建议
const nums = [1, 2, 3]            // ✓ 建议
```

#### 不要解构空值

```javascript
const { a: {} } = foo         // ✗ 不建议
const { a: { b } } = foo      // ✓ 建议
```

#### 对象字面量中不要定义重复的属性

```javascript
const user = {
  name: 'Jane Doe',
  name: 'John Doe'    // ✗ 不建议
}
```

#### 不要扩展原生对象

```javascript
Object.prototype.age = 21     // ✗ 不建议
```

#### 外部变量不要与对象属性重名

```javascript
let score = 100
function game () {
  score: while (true) {      // ✗ 不建议
    score -= 10
    if (score > 0) continue score
    break
  }
}
```

#### 对象属性换行时注意统一代码风格

```javascript
const user = {
  name: 'Jane Doe', age: 30,
  username: 'jdoe86'            // ✗ 不建议
}

const user = { name: 'Jane Doe', age: 30, username: 'jdoe86' }    // ✓ 建议

const user = {
  name: 'Jane Doe',
  age: 30,
  username: 'jdoe86'
}
```

#### 避免使用不必要的计算值作对象属性

```javascript
const user = { ['name']: 'John Doe' }   // ✗ 不建议
const user = { name: 'John Doe' }       // ✓ 建议
```

### 函数

#### 避免使用 arguments.callee 和 arguments.caller

```javascript
function foo (n) {
  if (n <= 0) return

  arguments.callee(n - 1)   // ✗ 不建议
}

function foo (n) {
  if (n <= 0) return

  foo(n - 1)
}
```

#### 不要定义冗余的函数参数

```javascript
function sum (a, b, a) {  // ✗ 不建议
  // ...
}

function sum (a, b, c) {  // ✓ 建议
  // ...
}
```

#### 避免多余的函数上下文绑定

```javascript
const name = function () {
  getName()
}.bind(user)    // ✗ 不建议

const name = function () {
  this.getName()
}.bind(user)    // ✓ 建议
```

#### 不要使用 eval()

```javascript
eval( "var result = user." + propName ) // ✗ 不建议
const result = user[propName]             // ✓ 建议
```

#### 不要使用多余的括号包裹函数

```javascript
const myFunc = (function () { })   // ✗ 不建议
const myFunc = function () { }     // ✓ 建议
```

#### 避免对声明过的函数重新赋值

```javascript
function myFunc () { }
myFunc = myOtherFunc    // ✗ 不建议
```

#### 注意隐式的 eval()

```javascript
setTimeout("alert('Hello world')")                   // ✗ 不建议
setTimeout(function () { alert('Hello world') })     // ✓ 建议
```

#### 嵌套的代码块中禁止再定义函数

```javascript
if (authenticated) {
  function setAuthUser () {}    // ✗ 不建议
}
```

#### 禁止使用 Function 构造器

```javascript
const sum = new Function('a', 'b', 'return a + b')    // ✗ 不建议
```

#### 禁止使用 Object 构造器

```javascript
let config = new Object()   // ✗ 不建议
```

#### 自调用匿名函数 (IIFEs) 使用括号包裹

```javascript
const getName = function () { }()     // ✗ 不建议

const getName = (function () { }())   // ✓ 建议
const getName = (function () { })()   // ✓ 建议
```

#### 不使用 Generator 函数语法

> 使用 `Promise` 或者 `async functions` 来实现异步编程

```javascript
function* helloWorldGenerator() {     // ✗ 不建议
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

### 正则

#### 正则中不要使用控制符

```javascript
const pattern = /\x1f/    // ✗ 不建议
const pattern = /\x20/    // ✓ 建议
```

#### 正则中避免使用多个空格

```javascript
const regexp = /test   value/   // ✗ 不建议

const regexp = /test {3}value/  // ✓ 建议
const regexp = /test value/     // ✓ 建议
```

### 类定义

#### 类名要以大写字母开头

```javascript
class animal {}
const dog = new animal()    // ✗ 不建议

class Animal {}
const dog = new Animal()    // ✓ 建议
```

#### 避免对类名重新赋值

```javascript
class Dog {}
Dog = 'Fido'    // ✗ 不建议
```

#### 子类的构造器中一定要调用 super

```javascript
class Dog {
  constructor () {
    super()   // ✗ 不建议
  }
}

class Dog extends Mammal {
  constructor () {
    super()   // ✓ 建议
  }
}
```

#### 使用 this 前请确保 super() 已调用

```javascript
class Dog extends Animal {
  constructor () {
    this.legs = 4     // ✗ 不建议
    super()
  }
}
```

#### 禁止多余的构造器

```javascript
class Car {
  constructor () {      // ✗ 不建议
  }
}

class Car {
  constructor () {      // ✗ 不建议
    super()
  }
}
```

#### 类中不要定义冗余的属性

```javascript
class Dog {
  bark () {}
  bark () {}    // ✗ 不建议
}
```

#### 无参的构造函数调用时要带上括号

```javascript
function Animal () {}
const dog = new Animal    // ✗ 不建议
const dog = new Animal()  // ✓ 建议
```

#### new 创建对象实例后需要赋值给变量

```javascript
new Character()                     // ✗ 不建议
const character = new Character()   // ✓ 建议
```

### 模块

#### 同一模块有多个导入时一次性写完

```javascript
import { myFunc1 } from 'module'
import { myFunc2 } from 'module'          // ✗ 不建议

import { myFunc1, myFunc2 } from 'module' // ✓ 建议
```

#### import, export 和解构操作中，禁止赋值到同名变量

```javascript
import { config as config } from './config'     // ✗ 不建议
import { config } from './config'               // ✓ 建议
```

### 语句

#### 避免在 return 语句中出现赋值语句

```javascript
function sum (a, b) {
  return result = a + b     // ✗ 不建议
}
```

#### 禁止使用 with

```javascript
with (val) {...}    // ✗ 不建议
```

#### 不要使用标签语句

```javascript
label:
  while (true) {
    break label     // ✗ 不建议
  }
```

#### 不要随意更改关键字的值

```javascript
let undefined = 'value'     // ✗ 不建议
```

#### return，throw，continue 和 break 后不要再跟代码

```javascript
function doSomething () {
  return true
  console.log('never called')     // ✗ 不建议
}
```

### 逻辑与循环

#### 始终使用 === 替代 ==

> 例外： obj == null 可以用来检查 null || undefined

```javascript
if (name === 'John')   // ✓ 建议
if (name == 'John')    // ✗ 不建议
```

```javascript
if (name !== 'John')   // ✓ 建议
if (name != 'John')    // ✗ 不建议
```

#### 避免将变量与自己进行比较操作

```javascript
if (score === score) {}   // ✗ 不建议
```

#### if/else 关键字要与花括号保持在同一行

```javascript
// ✓ 建议
if (condition) {
  // ...
} else {
  // ...
}
```

```javascript
// ✗ 不建议
if (condition)
{
  // ...
}
else
{
  // ...
}
```

#### 多行 if 语句的的括号不能省略

```javascript
// ✓ 建议
if (options.quiet !== true) console.log('done')
```

```javascript
// ✓ 建议
if (options.quiet !== true) {
  console.log('done')
}
```

```javascript
// ✗ 不建议
if (options.quiet !== true)
  console.log('done')
```

#### 对于三元运算符 ? 和 : 与他们所负责的代码处于同一行

```javascript
// ✓ 建议
const location = env.development ? 'localhost' : 'www.api.com'

// ✓ 建议
const location = env.development
  ? 'localhost'
  : 'www.api.com'

// ✗ 不建议
const location = env.development ?
  'localhost' :
  'www.api.com'
```

#### 请书写优雅的条件语句（avoid Yoda conditions）

```javascript
if (42 === age) { }    // ✗ 不建议
if (age === 42) { }    // ✓ 建议
```

#### 避免使用常量作为条件表达式的条件（循环语句除外）

```javascript
if (false) {    // ✗ 不建议
  // ...
}

if (x === 0) {  // ✓ 建议
  // ...
}

while (true) {  // ✓ 建议
  // ...
}
```

#### 循环语句中注意更新循环变量

```javascript
for (let i = 0; i < items.length; j++) {...}    // ✗ 不建议
for (let i = 0; i < items.length; i++) {...}    // ✓ 建议
```

#### 如果有更好的实现，尽量不要使用三元表达式

```javascript
let score = val ? val : 0     // ✗ 不建议
let score = val || 0          // ✓ 建议
```

#### switch 语句中不要定义重复的 case 分支

```javascript
switch (id) {
  case 1:
    // ...
  case 1:     // ✗ 不建议
}
```

#### switch 一定要使用 break 来将条件分支正常中断

```javascript
switch (filter) {
  case 1:
    doSomething()    // ✗ 不建议
  case 2:
    doSomethingElse()
}

switch (filter) {
  case 1:
    doSomething()
    break           // ✓ 建议
  case 2:
    doSomethingElse()
}

switch (filter) {
  case 1:
    doSomething()
    // fallthrough  // ✓ 建议
  case 2:
    doSomethingElse()
}
```

#### 避免不必要的布尔转换

```javascript
const result = true
if (!!result) {   // ✗ 不建议
  // ...
}

const result = true
if (result) {     // ✓ 建议
  // ...
}
```

#### 避免使用逗号操作符

```javascript
if (doSomething(), !!test) {}   // ✗ 不建议
```

### 错误处理

#### 不要丢掉异常处理中 err 参数

```javascript
// ✓ 建议
run(function (err) {
  if (err) throw err
  window.alert('done')
})
```

```javascript
// ✗ 不建议
run(function (err) {
  window.alert('done')
})
```

#### catch 中不要对错误重新赋值

```javascript
try {
  // ...
} catch (e) {
  e = 'new value'             // ✗ 不建议
}

try {
  // ...
} catch (e) {
  const newVal = 'new value'  // ✓ 建议
}
```

#### 用 throw 抛错时，抛出 Error 对象而不是字符串

```javascript
throw 'error'               // ✗ 不建议
throw new Error('error')    // ✓ 建议
```

#### finally 代码块中不要再改变程序执行流程

```javascript
try {
  // ...
} catch (e) {
  // ...
} finally {
  return 42     // ✗ 不建议
}
```

#### 使用 Promise 一定要捕捉错误

```javascript
asyncTask('google.com').catch(err => console.log(err))   // ✓ 建议
```

## 组件及 JSX 书写规范

### 基本书写

#### 组件创建

Taro 中组件以类的形式进行创建，并且单个文件中只能存在单个组件

#### 代码缩进

> 使用两个空格进行缩进，不要混合使用空格与制表符作为缩进

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class MyComponent extends Component {
  render () {
    return (
      <View className='test'>     // ✓ 建议
        <Text>12</Text>     // ✗ 不建议
      </View>
    )
  }
}
```

#### 单引号

> JSX 属性均使用单引号

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  render () {
    return (
      <View className='test'>     // ✓ 建议
        <Text className="test_text">12</Text>     // ✗ 不建议
      </View>
    )
  }
}
```

#### 对齐方式

> 多个属性，多行书写，每个属性占用一行，标签结束另起一行

```javascript
// bad
<Foo superLongParam='bar'
     anotherSuperLongParam='baz' />

// good
<Foo
  superLongParam='bar'
  anotherSuperLongParam='baz'
/>

// 如果组件的属性可以放在一行就保持在当前一行中
<Foo bar='bar' />

// 多行属性采用缩进
<Foo
  superLongParam='bar'
  anotherSuperLongParam='baz'
>
  <Quux />
</Foo>
```

#### 空格使用

> 终始在自闭合标签前面添加一个空格

```javascript
// bad
<Foo/>

// very bad
<Foo                 />

// bad
<Foo
 />

// good
<Foo />
```

#### 属性书写

> 属性名称始终使用驼峰命名法

```javascript
// bad
<Foo
  UserName='hello'
  phone_number={12345678}
/>

// good
<Foo
  userName='hello'
  phoneNumber={12345678}
/>
```

#### JSX 与括号

> 用括号包裹多行 JSX 标签

```javascript

// bad
render () {
  return <MyComponent className='long body' foo='bar'>
           <MyChild />
         </MyComponent>
}

// good
render () {
  return (
    <MyComponent className='long body' foo='bar'>
      <MyChild />
    </MyComponent>
  )
}

// good
render () {
  const body = <div>hello</div>
  return <MyComponent>{body}</MyComponent>
}
```

#### 标签

> 当标签没有子元素时，始终使用自闭合标签

```javascript
// bad
<Foo className='stuff'></Foo>

// good
<Foo className='stuff' />
```

> 如果控件有多行属性，关闭标签要另起一行

```javascript
// bad
<Foo
  bar='bar'
  baz='baz' />

// good
<Foo
  bar='bar'
  baz='baz'
/>
```

#### 书写顺序

在 Taro 组件中会包含类静态属性、类属性、生命周期等的类成员，其书写顺序最好遵循以下约定（顺序从上至下）

1. static 静态方法
2. constructor
3. componentWillMount
4. componentDidMount
5. componentWillReceiveProps
6. shouldComponentUpdate
7. componentWillUpdate
8. componentDidUpdate
9. componentWillUnmount
10. 点击回调或者事件回调 比如 `onClickSubmit()` 或者 `onChangeDescription()`
11. render

### 通用约束与建议

#### 所有内置组件均需要引入后再使用

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class MyComponent extends Component {
  render () {
    return (
      <View className='test'>     // ✓ 建议
        <Text>12</Text>     // ✗ 不建议
      </View>
    )
  }
}
```

#### 推荐使用对象解构的方式来使用 state、props

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  state = {
    myTime: 12
  }
  render () {
    const { isEnable } = this.props     // ✓ 建议
    const { myTime } = this.state     // ✓ 建议
    return (
      <View className='test'>
        {isEnable && <Text className='test_text'>{myTime}</Text>}
      </View>
    )
  }
}
```

#### 不要以 class/id/style 作为自定义组件的属性名

```javascript
<Hello class='foo' />     // ✗ 不建议
<Hello id='foo' />     // ✗ 不建议
<Hello style='foo' />     // ✗ 不建议
```

#### 不要使用 HTML 标签

```javascript
<div className='foo'></div>     // ✗ 不建议
<span id='foo' /></span>    // ✗ 不建议
```

#### 不要在调用 this.setState 时使用 this.state

> 由于 this.setState 异步的缘故，这样的做法会导致一些错误，可以通过给 this.setState 传入函数来避免

```javascript
this.setState({
  value: this.state.value + 1
})   // ✗ 不建议


this.setState(prevState => ({ value: prevState.value + 1 }))    // ✓ 建议

```

#### map 循环时请给元素加上 key 属性

```javascript
list.map(item => {
  return (
    <View className='list_item' key={item.id}>{item.name}</View>
  )
})
```

#### 尽量避免在 componentDidMount 中调用 this.setState

> 因为在 `componentDidMount` 中调用  `this.setState` 会导致触发更新

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  state = {
    myTime: 12
  }
  
  componentDidMount () {
    this.setState({     // ✗ 尽量避免，可以在 componentWillMount 中处理
      name: 1
    })
  }
  
  render () {
    const { isEnable } = this.props
    const { myTime } = this.state
    return (
      <View className='test'>
        {isEnable && <Text className='test_text'>{myTime}</Text>}
      </View>
    )
  }
}
```

#### 不要在 componentWillUpdate/componentDidUpdate/render 中调用 this.setState

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  state = {
    myTime: 12
  }
  
  componentWillUpdate () {
    this.setState({     // ✗ 不建议
      name: 1
    })
  }
  
  componentDidUpdate () {
    this.setState({     // ✗ 不建议
      name: 1
    })
  }
  
  render () {
    const { isEnable } = this.props
    const { myTime } = this.state
    this.setState({     // ✗ 不建议
      name: 11
    })
    return (
      <View className='test'>
        {isEnable && <Text className='test_text'>{myTime}</Text>}
      </View>
    )
  }
}
```

#### 不要定义没有用到的 state

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  state = {
    myTime: 12,
    noUsed: true   // ✗ 没有用到
  }
  
  render () {
    const { myTime } = this.state
    return (
      <View className='test'>
        <Text className='test_text'>{myTime}</Text>
      </View>
    )
  }
}
```

#### 组件最好定义 defaultProps

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {

  static defaultProps = {
    isEnable: true
  }
  
  state = {
    myTime: 12
  }
  
  render () {
    const { isEnable } = this.props
    const { myTime } = this.state

    return (
      <View className='test'>
        {isEnable && <Text className='test_text'>{myTime}</Text>}
      </View>
    )
  }
}
```

#### render 方法必须有返回值

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  state = {
    myTime: 12
  }
  
  render () {   // ✗ 没有返回值
    const { isEnable } = this.props
    const { myTime } = this.state

    <View className='test'>
      {isEnable && <Text className="test_text">{myTime}</Text>}
    </View>
  }
}
```

#### 值为 true 的属性可以省略书写值

```javascript
<Hello personal />
<Hello personal={false} />
```

#### JSX 属性或者表达式书写时需要注意空格

属性书写不带空格，如果属性是一个对象，则对象括号旁边需要带上空格

```javascript
<Hello name={ firstname } />   // ✗ 不建议
<Hello name={ firstname} />   // ✗ 不建议
<Hello name={firstname } />   // ✗ 不建议
<Hello name={{ firstname: 'John', lastname: 'Doe' }} />      // ✓ 建议
```

#### 事件绑定均以 on 开头

> 在 Taro 中所有默认事件如 `onClick`、`onTouchStart` 等等，均以 `on` 开头

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

class MyComponent extends Component {
  state = {
    myTime: 12
  }

  clickHandler (e) {
    console.log(e)
  }
  
  render () {
    const { myTime } = this.state

    return (
      <View className='test' onClick={this.clickHandler}>    // ✓ 建议
        <Text className='test_text'>{myTime}</Text>
      </View>
    )
  }
}
```

#### 子组件传入函数时属性名需要以 on 开头

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

import Tab from '../../components/Tab/Tab'

class MyComponent extends Component {
  state = {
    myTime: 12
  }

  clickHandler (e) {
    console.log(e)
  }
  
  render () {
    const { myTime } = this.state

    return (
      <View className='test'>
        <Tab onChange={this.clickHandler} />    // ✓ 建议
        <Text className='test_text'>{myTime}</Text>
      </View>
    )
  }
}
```

### Taro 自身限制规范

#### 不能使用 Array#map 之外的方法操作 JSX 数组 

> Taro 在小程序端实际上把 JSX 转换成了字符串模板，而一个原生 JSX 表达式实际上是一个 React/Nerv 元素(react-element)的构造器，因此在原生 JSX 中你可以随意地对一组 React 元素进行操作。但在 Taro 中你只能使用 `map` 方法，Taro 转换成小程序中 `wx:for`

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
test.push(<View />)

numbers.forEach(number => {
  if (someCase) {
    a = <View />
  }
})

test.shift(<View />)

components.find(component => {
  return component === <View />
})

components.some(component => component.constructor.__proto__ === <View />.constructor)
```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
numbers.filter(Boolean).map((number) => {
  const element = <View />
  return <View />
})
```

**解决方案**

先处理好需要遍历的数组，然后再用处理好的数组调用 `map` 方法。

```javascript
numbers.filter(isOdd).map((number) => <View />)

for (let index = 0; index < array.length; index++) {
  // do you thing with array
}

const element = array.map(item => {
  return <View />
})
```
