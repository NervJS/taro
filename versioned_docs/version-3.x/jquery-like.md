---
title: jQuery-like API
---

Taro 目前官方支持使用 React 或 Vue 构建视图，它们都是数据驱动的声明式渲染方式。

但在少数情况下，我们需要显式地操纵 DOM，而小程序提供的 `createQuerySelector` API 的用法又较为复杂难懂。在这样的情况下，我们提供了类似 jQuery 的系列 API。使用这个系列 API 很简单，只需要通过 NPM 安装依赖：

```bash
npm i @tarojs/extend
```

然后再需要使用文件引入 `$` 即可：

```js
import { $ } from '@tarojs/extend'
```

:::info 了解更多
你还可以通过访问 [jQuery-like API RFC](https://github.com/NervJS/taro-rfcs/pull/1) 了解更多实现 jQuery-like API 背后的原因与设计。
:::

## 核心方法


### $()

- `$(selector, [context])   ⇒ collection`
- `$(<collection>)   ⇒ same collection`
- `$(<DOM nodes>)   ⇒ collection`
- `$(htmlString)   ⇒ collection`
- `$(htmlString, attributes)   ⇒ collection`

通过执行 CSS 选择器，包装 DOM 节点，或者通过一个 HTML 字符串创建多个元素 来创建一个集合对象。

`collection` 是一个类似数组的对象，它具有链式方法来操作它指向的 DOM 节点，除了 `$()` 对象上的直接方法外(如`$.extend`)，文档对象中的所有方法都是集合方法。

如果选择器中存在content参数(css选择器，dom，或者集合对象)，那么只在所给的节点背景下进行css选择器；这个功能和使用 `$(context).find(selector)` 是一样的。

```js
$('view')  //=> 所有页面中得p元素
$('#foo') //=> ID 为 "foo" 的元素

// 创建元素:
$("<text>Hello</text>") //=> 新的text元素
// 创建带有属性的元素:
$("<text />", { text:"Hello", id:"greeting", css:{color:'darkblue'} })
//=> <text id=greeting style="color:darkblue">Hello</p>
```


:::caution 请注意
此不支持 [jQuery CSS 扩展](https://www.html.cn/jqapi-1.9/category/selectors/jquery-selector-extensions/)， 然而，可选的“selector”模块有限提供了支持几个最常用的伪选择器，而且可以被丢弃，与现有的代码或插件的兼容执行。
:::

:::caution 请注意
和 React 或 Vue 不一样的是，在 Taro 的 `jQuery-like API` 中可以使用像 `div` 这样的 HTML 元素，但使用小程序规范的组件（例如 `view`）在 Taro 应用中运行会更顺畅。但在接下来的的案例中可能会出现 HTML 元素，仅代表使用方法，不代表实际可用。
:::

### $.fn

$.fn 是一个对象，它拥有 jQuery 对象上所有可用的方法，如 `addClass()`， `attr()`，和其它方法。在这个对象添加一个方法，所有的 jQuery 对象上都能用到该方法。

这里有一个实现 jQuery 的 `empty()` 方法的例子：

```js
$.fn.empty = function(){
  return this.each(function(){ this.innerHTML = '' })
}
```

### addClass

- `addClass(name)   ⇒ self`
- `addClass(function(index, oldClassName){ ... })   ⇒ self`

为每个匹配的元素添加指定的class类名。多个class类名使用空格分隔。

### after

- `after(content)   ⇒ self`

在每个匹配的元素后插入内容（注：外部插入）。内容可以为html字符串，dom节点，或者节点组成的数组。

```js
$('form label').after('<p>A note below the label</p>')
```

### append

- `append(content)   ⇒ self`

在每个匹配的元素末尾插入内容（注：内部插入）。内容可以为html字符串，dom节点，或者节点组成的数组。


```js
$('ul').append('<li>new list item</li>')
```

### attr

- `attr(name)   ⇒ string`
- `attr(name, value)   ⇒ self`
- `attr(name, function(index, oldValue){ ... })   ⇒ self`
- `attr({ name: value, name2: value2, ... })   ⇒ self`

读取或设置dom的属性。如果没有给定value参数，则读取对象集合中第一个元素的属性值。当给定了value参数。则设置对象集合中所有元素的该属性的值。当value参数为`null`，那么这个属性将被移除(类似`removeAttr`)，多个属性可以通过对象键值对的方式进行设置。

要读取DOM的属性如 `checked`和`selected`, 使用 `prop`。

```js
var form = $('form')
form.attr('action')             //=> 读取值
form.attr('action', '/create')  //=> 设置值
form.attr('action', null)       //=> 移除属性

// 多个属性:
form.attr({
  action: '/create',
  method: 'post'
})
```

### before

- `before(content)   ⇒ self`

在匹配每个元素的前面插入内容（注：外部插入）。内容可以为html字符串，dom节点，或者节点组成的数组。


```js
$('table').before('<p>See the following table:</p>')
```

### children

- `children([selector])   ⇒ collection`

获得每个匹配元素集合元素的直接子元素，如果给定selector，那么返回的结果中只包含符合css选择器的元素。

```js
$('ol').children('*:nth-child(2n)')
//=> every other list item from every ordered list
```

### clone (`3.0.0-rc.6`)

- `clone()   ⇒ collection`

通过深度克隆来复制集合中的所有元素。

### closest

- `closest(selector, [context])   ⇒ collection`
- `closest(collection)   ⇒ collection`
- `closest(element)   ⇒ collection`

从元素本身开始，逐级向上级元素匹配，并返回最先匹配selector的元素。如果给定context节点参数，那么只匹配该节点的后代元素。这个方法与 `parents(selector)`有点相像，但它只返回最先匹配的祖先元素。

如果参数是一个jQuery对象集合或者一个元素，结果必须匹配给定的元素而不是选择器。

```js
var input = $('input[type=text]')
input.closest('form')
```

### contents

- `contents()   ⇒ collection`

获得每个匹配元素集合元素的子元素，包括文字和注释节点。（注：`.contents()`和`.children()`方法类似，只不过前者包括文本节点以及jQuery对象中产生的HTML元素。）

### css

- `css(property)   ⇒ value`
- `css([property1, property2, ...])   ⇒ object`
- `css(property, value)   ⇒ self`
- `css({ property: value, property2: value2, ... })   ⇒ self`

读取或设置DOM元素的css属性。当value参数不存在的时候，返回对象集合中第一个元素的css属性。当value参数存在时，设置对象集合中每一个元素的对应css属性。

多个属性可以通过传递一个属性名组成的数组一次性获取。多个属性可以利用对象键值对的方式进行设置。

当value为空(空字符串，null 或 undefined)，那个css属性将会被移出。当value参数为一个无单位的数字，如果该css属性需要单位，“px”将会自动添加到该属性上。

```js
var elem = $('h1')
elem.css('background-color')          // read property
elem.css('background-color', '#369')  // set property
elem.css('background-color', '')      // remove property

// set multiple properties:
elem.css({ backgroundColor: '#8EE', fontSize: 28 })

// read multiple properties:
elem.css(['backgroundColor', 'fontSize'])['fontSize']
```

### data

- `data(name)   ⇒ value`
- `data(name, value)   ⇒ self`

读取或写入dom的 `data-*` 属性。行为有点像 attr ，但是属性名称前面加上 data-。

当读取属性值时，会有下列转换:

- “true”, “false”, and “null” 被转换为相应的类型；
- 数字值转换为实际的数字类型；
- JSON值将会被解析，如果它是有效的JSON；
- 其它的一切作为字符串返回。


### each

- `each(function(index, item){ ... })   ⇒ self`

遍历一个对象集合每个元素。在迭代函数中，`this`关键字指向当前项(作为函数的第二个参数传递)。如果迭代函数返回 `false`，遍历结束。

```js
$('form input').each(function(index){
  console.log('input %d is: %o', index, this)
})
```

### empty

- `empty()   ⇒ self`

清空对象集合中每个元素的DOM内容。


### eq

- `eq(index)   ⇒ collection`

从当前对象集合中获取给定索引值（注：以0为基数）的元素。

```js
$('li').eq(0)   //=> only the first list item
$('li').eq(-1)  //=> only the last list item
```

### filter

- `filter(selector)   ⇒ collection`
- `filter(function(index){ ... })   ⇒ collection`

过滤对象集合，返回对象集合中满足css选择器的项。如果参数为一个函数，函数返回有实际值得时候，元素才会被返回。在函数中， this 关键字指向当前的元素。

### find

- `find(selector)   ⇒ collection`
- `find(collection)   ⇒ collection v1.0+`
- `find(element)   ⇒ collection v1.0+`

在当对象前集合内查找符合CSS选择器的每个元素的后代元素。

如果给定Zepto对象集合或者元素，过滤它们，只有当它们在当前Zepto集合对象中时，才回被返回。

```js
var form = $('#myform')
form.find('input, select')
```

### first

- `first()   ⇒ collection`

获取当前对象集合中的第一个元素。

```js
$('form').first()
```

### forEach

- `forEach(function(item, index, array){ ... }, [context])`

遍历对象集合中每个元素，有点类似 each，但是遍历函数的参数不一样，当函数返回 `false` 的时候，遍历不会停止。

### get

- `get()   ⇒ array`
- `get(index)   ⇒ DOM node`

从当前对象集合中获取所有元素或单个元素。当index参数不存在的时，以普通数组的方式返回所有的元素。当指定index时，只返回该置的元素。这点与`eq`不同，该方法返回的是DOM节点，不是Zepto对象集合。

```js
var elements = $('h2')
elements.get()   //=> get all headings as an array
elements.get(0)  //=> get first heading node
```


### has

- `has(selector)   ⇒ collection`
- `has(node)   ⇒ collection`

判断当前对象集合的子元素是否有符合选择器的元素，或者是否包含指定的DOM节点，如果有，则返回新的对象集合，该对象过滤掉不含有选择器匹配元素或者不含有指定DOM节点的对象。

```js
$('ol > li').has('a[href]')
//=> get only LI elements that contain links
```

### hasClass

- `hasClass(name)   ⇒ boolean`

检查对象集合中是否有元素含有指定的class。


```js
$("li").hasClass("test")
```

### height

- `height()   ⇒ Promise<number>`
- `height(value)   ⇒ self`
- `height(function(index, oldHeight){ ... })   ⇒ self`

获取对象集合中第一个元素的高度；或者设置对象集合中所有元素的高度。

```js
const height = await $('#foo').height() // => 123
```

:::caution 请注意
`height()` 返回的 `Promise` 对象。
:::

### hide

- `hide()   ⇒ self`

通过设置css的属性 `display` 为 `none` 来将对象集合中的元素隐藏。

### html

- `html()   ⇒ string`
- `html(content)   ⇒ self`
- `html(function(index, oldHtml){ ... })   ⇒ self`

获取或设置对象集合中元素的HTML内容。当没有给定content参数时，返回对象集合中第一个元素的innerHtml。当给定content参数时，用其替换对象集合中每个元素的内容。content可以是append中描述的所有类型。

```js
// autolink everything that looks like a Twitter username
$('.comment p').html(function(idx, oldHtml){
  return oldHtml.replace(/(^|\W)@(\w{1,15})/g,
    '$1@<a href="http://twitter.com/$2">$2</a>')
})
```

### index

- `index([element])   ⇒ number`

获取一个元素的索引值（注：从0开始计数）。当elemen参数没有给出时，返回当前元素在兄弟节点中的位置。当element参数给出时，返回它在当前对象集合中的位置。如果没有找到该元素，则返回-1。

```js
$('li:nth-child(2)').index()  //=> 1
```

### insertAfter

- `insertAfter(target)   ⇒ self`

将集合中的元素插入到指定的目标元素后面（注：外部插入）。这个有点像 `after`，但是使用方式相反。

```js
$('<p>Emphasis mine.</p>').insertAfter('blockquote')
```

### insertBefore

- `insertBefore(target)   ⇒ self`

将集合中的元素插入到指定的目标元素前面（注：外部插入）。这个有点像 `before`，但是使用方式相反。

```js
$('<p>See the following table:</p>').insertBefore('table')
```

### last

- `last()   ⇒ collection`

获取对象集合中最后一个元素。

```js
$('li').last()
```

### map

- `map(function(index, item){ ... })   ⇒ collection`

遍历对象集合中的所有元素。通过遍历函数返回值形成一个新的集合对象。在遍历函数中this关键之指向当前循环的项（遍历函数中的第二个参数）。

遍历中返回 null和undefined，遍历将结束。

```js
elements.map(function(){ return $(this).text() }).get().join(', ')
```

### next

- `next()   ⇒ collection`
- `next(selector)   ⇒ collection`

获取对象集合中每一个元素的下一个兄弟节点(可以选择性的带上过滤选择器)。


### not

- `not(selector)   ⇒ collection`
- `not(collection)   ⇒ collection`
- `not(function(index){ ... })   ⇒ collection`

过滤当前对象集合，获取一个新的对象集合，它里面的元素不能匹配css选择器。如果另一个参数为Zepto对象集合，那么返回的新Zepto对象中的元素都不包含在该参数对象中。如果参数是一个函数。仅仅包含函数执行为`false`值得时候的元素，函数的 `this` 关键字指向当前循环元素。

与它相反的功能，查看 `filter`。

### offset

- `offset()   ⇒ Promise<object>`
- `offset(coordinates)   ⇒ self`
- `offset(function(index, oldOffset){ ... })   ⇒ self`

获得当前元素相对于document的位置。返回一个对象含有： `top`, `left`, `width`和`height`。

### offsetParent

- `offsetParent()   ⇒ collection`

找到第一个定位过的祖先元素，意味着它的css中的 `position` 属性值为“relative”, “absolute” or “fixed”

### parent

- `parent([selector])   ⇒ collection`

获取对象集合中每个元素的直接父元素。如果css选择器参数给出。过滤出符合条件的元素。

### parents

- `parents([selector])   ⇒ collection`

获取对象集合每个元素所有的祖先元素。如果css选择器参数给出，过滤出符合条件的元素。

如果想获取直接父级元素，使用 `parent`。如果只想获取到第一个符合css选择器的元素，使用`closest`。

```js
$('h1').parents()   //=> [<div#container>, <body>, <html>]
```

### position

- `position()   ⇒ object`

获取对象集合中第一个元素的位置。相对于 `offsetParent`。当绝对定位的一个元素靠近另一个元素的时候，这个方法是有用的。

```js
var pos = element.position()

// position a tooltip relative to the element
$('#tooltip').css({
  position: 'absolute',
  top: pos.top - 30,
  left: pos.left
})
```

### prepend

- `prepend(content)   ⇒ self`

将参数内容插入到每个匹配元素的前面（注：元素内部插入）。插入d的元素可以试html字符串片段，一个dom节点，或者一个节点的数组。

```js
$('ul').prepend('<li>first list item</li>')
```

### prependTo

- `prependTo(target)   ⇒ self`

将所有元素插入到目标前面（注：元素内部插入）。这有点像`prepend`，但是是相反的方式。

```js
$('<li>first list item</li>').prependTo('ul')
```

### prev

- `prev()   ⇒ collection`
- `prev(selector)   ⇒ collection`

获取对象集合中每一个元素的前一个兄弟节点，通过选择器来进行过滤。

### prop

- `prop(name)   ⇒ value`
- `prop(name, value)   ⇒ self`
- `prop(name, function(index, oldValue){ ... })   ⇒ self`

读取或设置dom元素的属性值。它在读取属性值的情况下优先于 `attr`，因为这些属性值会因为用户的交互发生改变，如`checked` 和 `selected`。

简写或小写名称，比如`for`, `class`, `readonly`及类似的属性，将被映射到实际的属性上，比如`htmlFor`, `className`, `readOnly`, 等等。

### remove

- `remove()   ⇒ self`

从其父节点中删除当前集合中的元素，有效的从dom中移除。


### removeAttr

- `removeAttr(name)   ⇒ self`

移除当前对象集合中所有元素的指定属性。

### removeClass

- `removeClass([name])   ⇒ self`
- `removeClass(function(index, oldClassName){ ... })   ⇒ self`

移除当前对象集合中所有元素的指定class。如果没有指定name参数，将移出所有的class。多个class参数名称可以利用空格分隔。下例移除了两个class。

```js
$("#check1").removeClass("test")
```

### removeProp

- `removeProp(name)   ⇒ self`

从集合的每个DOM节点中删除一个属性。这是用JavaScript的`delete`操作符完成。值得注意的是如果尝试删除DOM的一些内置属性，如`className`或`maxLength`，将不会有任何效果，因为浏览器禁止删除这些属性。

### replaceWith

- `replaceWith(content)   ⇒ self`

用给定的内容替换所有匹配的元素。(包含元素本身)。content参数可以为 `before`中描述的类型。

### scrollLeft

- `scrollLeft() => Promise<number>`
- `scrollLeft(value)   ⇒ self`

获取或设置页面上的滚动元素或者整个窗口向右滚动的像素值。

```js
const height = await $('#foo').scrollLeft() // => 123
```

### scrollTop

- `scrollTop() => Promise<number>`
- `scrollTop(value)   ⇒ self`

获取或设置页面上的滚动元素或者整个窗口向下滚动的像素值。

```js
const height = await $('#foo').scrollTop() // => 123
```

### show

- `show()   ⇒ self`

### siblings

- `siblings([selector])   ⇒ collection`

获取对象集合中所有元素的兄弟节点。如果给定CSS选择器参数，过滤出符合选择器的元素。


### size

- `size()   ⇒ number`

获取对象集合中元素的数量。


### slice

- `slice(start, [end])   ⇒ array`

提取这个数组array的子集，从`start`开始，如果给定`end`，提取从从`start`开始到`end`结束的元素，但是不包含`end`位置的元素。

### text

- `text()   ⇒ string`
- `text(content)   ⇒ self`
- `text(function(index, oldText){ ... })   ⇒ self`

获取或者设置所有对象集合中元素的文本内容。当没有给定content参数时，返回当前对象集合中第一个元素的文本内容（包含子节点中的文本内容）。当给定content参数时，使用它替换对象集合中所有元素的文本内容。它有待点似 html，与它不同的是它不能用来获取或设置 HTML。

### toggle

- `toggle([setting])   ⇒ self`

显示或隐藏匹配元素。如果 `setting` 为 `true`，相当于 `show()` 。如果`setting`为`false`。相当于 `hide()`。

### toggleClass

- `toggleClass(names, [setting])   ⇒ self`
- `toggleClass(function(index, oldClassNames){ ... }, [setting])   ⇒ self`

在匹配的元素集合中的每个元素上添加或删除一个或多个样式类。如果class的名称存在则删除它，如果不存在，就添加它。如果 setting的值为真，这个功能类似于 addClass，如果为假，这个功能类似与 removeClass。

### unwrap

- `unwrap()   ⇒ self`

移除集合中每个元素的直接父节点，并把他们的子元素保留在原来的位置。 基本上，这种方法删除上一的祖先元素，同时保持DOM中的当前元素。

### val

- `val()   ⇒ string`
- `val(value)   ⇒ self`
- `val(function(index, oldValue){ ... })   ⇒ self`

获取或设置匹配元素的值。当没有给定value参数，返回第一个元素的值。当给定value参数，那么将设置所有元素的值。

### width

- `width()   ⇒ Promise<number>`
- `width(value)   ⇒ self`
- `width(function(index, oldWidth){ ... })   ⇒ self`

获取对象集合中第一个元素的宽；或者设置对象集合中所有元素的宽。

```js
await $('#foo').width()   // => 123
```

## 事件

### off

- `off(type, [selector], function(e){ ... })   ⇒ self`
- `off({ type: handler, type2: handler2, ... }, [selector])   ⇒ self`
- `off(type, [selector])   ⇒ self`
- `off()   ⇒ self`

移除通过 on 添加的事件.移除一个特定的事件处理程序， 必须通过用`on()`添加的那个相同的函数。否则，只通过事件类型调用此方法将移除该类型的所有处理程序。如果没有参数，将移出当前元素上全部的注册事件。

### on

- `on(type, [selector], function(e){ ... })   ⇒ self`
- `on(type, [selector], [data], function(e){ ... })   ⇒ self`
- `on({ type: handler, type2: handler2, ... }, [selector])   ⇒ self`
- `on({ type: handler, type2: handler2, ... }, [selector], [data])   ⇒ self`

添加事件处理程序到对象集合中得元素上。多个事件可以通过空格的字符串方式添加，或者以事件类型为键、以函数为值的对象 方式。如果给定css选择器，当事件在匹配该选择器的元素上发起时，事件才会被触发（注：即事件委派，或者说事件代理）。

如果给定`data`参数，这个值将在事件处理程序执行期间被作为有用的 `event.data` 属性

事件处理程序在添加该处理程序的元素、或在给定选择器情况下匹配该选择器的元素的上下文中执行(注：this指向触发事件的元素)。 当一个事件处理程序返回false，preventDefault() 和 stopPropagation()被当前事件调用的情况下，  将防止默认浏览器操作，如链接。


```js
var elem = $('#content')
// observe all clicks inside #content:
elem.on('click', function(e){ ... })
// observe clicks inside navigation links in #content
elem.on('click', 'nav a', function(e){ ... })
// all clicks inside links in the document
$('#test').on('click', 'a', function(e){ ... })
// disable following any navigation link on the page
$('#test').on('click', 'nav a', false)
```

### one

- `one(type, [selector], function(e){ ... })   ⇒ self`
- `one(type, [selector], [data], function(e){ ... })   ⇒ self`
- `one({ type: handler, type2: handler2, ... }, [selector])   ⇒ self`
- `one({ type: handler, type2: handler2, ... }, [selector], [data])   ⇒ self`

和 `on()` 一样，添加一个处理事件到元素，当第一次执行事件以后，该事件将自动解除绑定，保证处理函数在每个元素上最多执行一次。

### trigger

- `trigger(event, [args])   ⇒ self`

在对象集合的元素上触发指定的事件。如果给定args参数，它会作为参数传递给事件函数。

```js
$('#test').trigger('tap', ['one', 'two'])
```

### triggerHandler

- triggerHandler(event, [args])   ⇒ self

和 `trigger` 一样，它只在当前元素上触发事件，但不冒泡。