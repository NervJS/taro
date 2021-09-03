---
title: jQuery-like API
---

Taro is currently officially supported to build views using React or Vue as data driven declaratory methods.

但在少数情况下，我们需要显式地操纵 DOM，而小程序提供的 `createQuerySelector` API 的用法又较为复杂难懂。In such cases, we have provided a series of API like jQueryUsing this series of APIs is simple, only dependent via NPM Installation：

```bash
npm i @tarojs/extend
```

Then you need to use the file to introduce `$` enough to：

```js
import { $ } from '@tarojs/extend'
```

::info learn more you can also learn the reasons and design behind the jQuery-like API RFC by accessing [jQuery-like API RFC](https://github.com/NervJS/taro-rfcs/pull/1) for more implementation of the jQuery-like API. :::

## Core approach


### $()

- `$(selector, [context]) collate collection`
- `$(<collection>) identical collection`
- `$(<DOM nodes>) Jobs collection`
- `$(htmlString)   collections`
- `$(htmlString, attributes) Jobs collection`

Create a collection object by executing CSS selectors, packaging DOM nodes, or creating multiple elements through an HTML string.

`Collection` is an object like an array that has a chain method to operate the DOM node to which it refers, except for `$()` direct methods on the object (e.g.`$extend`), all methods in the document object are collected.

If a content parameter is present in the selector (css selector, doma, or collection object), then the css selector is only used in the given node background; this function is the same as using `$(context).find(selector)`.

```js
$('view')  //=> 所有页面中得p元素
$('#foo') //=> ID 为 "foo" 的元素

// 创建元素:
$("<text>Hello</text>") //=> 新的text元素
// 创建带有属性的元素:
$("<text />", { text:"Hello", id:"greeting", css:{color:'darkblue'} })
//=> <text id=greeting style="color:darkblue">Hello</p>
```


::caution please note this does not support [jQuery CSS extension](https://www.html.cn/jqapi-1.9/category/selectors/jquery-selector-extensions/), however, the optional "selector" module provides limited support for several of the most commonly used pseudo-selectors and can be discarded and compatible with existing codes or plugins. :::

::caution please note that and React or Vue are different than HTML elements like `div` can be used in Taro in the `jQuery-like API` Component using applet specifications (e.g. `view`) works smoothly in Taro application.However, HTML elements may appear in the next case, only for methods used and not for actual availability. :::

### $fn

$fn is an object with all available methods on jQuery objects, such as `addClass()`, `attr()`, and others.Adds a method to this object that is available on all jQuery objects.

这里有一个实现 jQuery 的 `empty()` 方法的例子：

```js
$.fn.empty = function(){
  return this.each(function(){ this.innerHTML = '' })
}
```

### addClass

- `addClass(name) chores`
- `addClass(Function(index, olClassName){ ... }odd self`

Add the specified class name for each matching element.More than one class is separated by spaces.

### after

- `after(content) odd self`

Insert content after each matching element (note：external insert).Content can be an array of html strings, doms, or nodes.

```js
$('form label').after('<p>A note below the label</p>')
```

### append

- `append(content) odd self`

Insert content at the end of each matching element (note：internal insert).Content can be an array of html strings, doms, or nodes.


```js
$('ul').append('<li>new list item</li>')
```

### attr

- `attr(name) Jobs string`
- `attr(name, value) sheep`
- `attr(name, function(index, olvalue){ ... }) self`
- `attr({ name: value, name2: value2, ... }) _self`

Attribute to read or set up domain.If no value is given, read the attribute value of the first element in the set of objects.When a value parameter is given.then set the value of this attribute for all elements in the collection of objects.When the value parameter is`null`then this property will be removed (like`removeAttr`), multiple attributes can be set by object key.

To read DOM's properties such as `checked`and`selected`, use `prop`.

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

- `before(content) odd self`

Insert content before matching each element (note：external insert).Content can be an array of html strings, doms, or nodes.


```js
$('table'). before('<p>See the following table:</p>')
```

### Children

- `Children ([selector]) collate collections`

Gets a direct child of each matching element set of elements. If a selector is given, the returned result contains only elements that match the css selector.

```js
$('ol').children('*:nth-children(2n)')
//=> every other list item from every dependent list
```

### clone (`3.0.0.0-rc.6`)

- `clone() collection`

Copy all elements in the collection by deep cloning.

### Close

- `closest(selector, [context]) collections`
- `closest(collection) total collections`
- `closest(element) colm collection`

Start with the element itself, match the parent and return the first one matching the selector.If a context node parameter is given only match the next element of the node.This method looks like `parents(selector)`but it only returns the first matching ancestor element.

If the parameter is a jQuery object collection or an element, the result must match the given element instead of the selector.

```js
var input = $('input[type=text]')
input.closest('form')
```

### Content

- `contents() Jobs collection`

Gets the child of each matching element set of elements, including text and annotation node.(Note：`.contents()`and`.children()`is similar to the method, except that the former includes HTML elements from text nodes and jQuery objects.

### css

- `css(property) total value`
- `css([property1, property2, ...]) Jobject`
- `css(property, value) sheeting self`
- `css({ property: value, property2: value2, ... }) _self`

Read or set css properties for DOM elements.Returns the css attribute of the first element in the collection of objects when the value parameter does not exist.Set the css attribute for each element in the set of objects when the value parameter exists.

Multiple properties can be obtained by passing an array of attribute names at once.Multiple properties can be set using object key pairs.

When value is empty (empty string, null or undefined), that css attribute will be removed.When the value parameter is an unincorporated number. If the css attribute requires a unit, "px" will be automatically added to the attribute.

```js
var elem = $('h1')
elem.css('background-color') // read property
elem. ss('background-color', '#369') // set property
elem. ss('background-color', ''') // remove property

// set multiple properties:
elem. ss({ backgroundColor: '#8EE', fontSize: 28 })

// read multiple properties:
elem.css(['backgroundColor', 'fontSize']) ['fontSize']
```

### Data

- `data(name) total value`
- `data(name, value) sheets_self`

Reads or writes to domain `data-*`.Behavior is a little like attr, but the attribute name should add data-above.

When reading property values, there will be the following transformation:

- "true", "false", and "null" have been converted to the corresponding type;
- Convert numeric values to actual digital type;
- JSON value will be parsed if it is valid JSON;
- Everything else returned as string.


### each

- `each(function(index, item){ ... }) odd self`

Walk through an object collection each element.In iterative functions,`this`keywords refer to the current item (passed as the second parameter of the function).If iterating the function returns `false`through ending.

```js
$('form input').each(function(index){
  console.log('input %d is: %o', index, this)
})
```

### empty

- `empty()sheeting self`

Clear the DOM content of each element in the collection of objects.


### eq

- `eq(index) overall collection`

Gets the element of the given index value from the current set of objects (note：is the base number).

```js
$('li').eq(0) //=> only the first list item
$('li').eq(-1) /// => only the last list item
```

### filter

- `filter(selector) overall collection`
- `filter(function(index){ ... }) collections`

Filter the collection of objects to return items in the collection that meet the css selector.If the parameter is a function, the element will be returned when the function returns is actually worthwhile.In function, this keyword refers to the current element.

### Find

- `find(selector) overall collection`
- `find(collection) JOM collection v1.0+`
- `find(element)M collection v1.0+`

Find the next element that matches the CSS selector in the previous collection of the object.

Filter them if a Zepto object collection or elements are given and only returned when they are in the current Zepto collection object.

```js
var form = $('#myform')
format@@ind('input, select')
```

### First

- `first()collections`

Gets the first element in the current set of objects.

```js
$('form').first()
```

### Forach

- `forEach(function(item, index, array){ ... }, [context]`

Walk through each element in the collection of objects with something like each, but the parameters that traverse functions are different, and traverses do not stop when the function returns `false`.

### get

- `get() Jobs array`
- `get(index) DOM node`

Get all elements or individual elements from the current set of objects.Returns all elements in a normal array when the index parameter does not exist.Only return this element when indexing is specified.Unlike`eq`, this method returns the DOM node, not the Zepto object collection.

```js
var elements = $('h2')
elements.get() //=> get all headings as an array
elements.get(0) // => get first heading node.
```


### has been

- `has(selector) Jobs collection`
- `has(node) Jobs collection`

Determines whether the children in the current set of objects have an element that matches the selector or contains the specified DOM node or, if so, returns a new set of objects that filter out without selector matching elements or objects that do not contain a specified DOM node.

```js
$('ol > li').has('a[href]')
///=> get only LI elements that contain links
```

### hasClass

- `hasClass(name) Jobolan`

Checks if there are elements in the object collection that contain the specified classes.


```js
$("li").hasClass("test")
```

### Height

- `height() MMS Promise<number>`
- `height(value) chores self`
- `height(function(index, oldHeight){ ... }) odd self`

Gets the height of the first element in the collection of objects; or sets the height of all elements in the collection of objects.

```js
const height = await $('#foo').height() // => 123
```

:::caution please note `height()` returned `Promis` object. :::

### hide

- `hide()chool self`

Hide elements in the collection of objects by setting the attributes `display` to `none`.

### html

- `html() string`
- `html(content) chores`
- `html(function(index, oldHtml){ ... }) self`

Gets or sets the HTML content of elements in the collection of objects.Returns the innerHtml of the first element in the collection of objects when no content parameter is given.Replace the contents of each element in the set of objects with the given content parameter.Content can be all types described in the app.

```js
//autolink evenyying that books like a Twitter username
$('.comment p').html(function(idx, oldHtml)
  return old Html. place(/(^|\W)@(\w{1,15}) /g,
    '$1@<a href="http://twitter.com/$2">$2</a>')
})
```

### Index

- `index([element]) Jobs number`

Gets an index value of an element (note：counts from 0 onwards).Returns the position of the current element in the siblings when the elemens are not given.Returns its position in the current set of objects when the elementment parameter is given.If this element is not found, return -1.

```js
$('li:nth-child(2)').index() //=> 1
```

### insertAfter

- `insertAfter(target)_self`

Insert the element in the collection after the specified target element (note：external insert).This is a little like `after`but uses the opposite way.

```js
$('<p>Emphasis mine.</p>').insertAfter('blockquote')
```

### insertBefore

- `insertBefore(target)_self`

Insert the elements in the collection before the specified target element (note：insert externally).This is a bit like `before`but uses the opposite.

```js
$('<p>See the following table:</p>').insertBefore('table')
```

### last

- `last() collections`

Gets the last element in the set of objects.

```js
$('li').last()
```

### map

- `map(function(index, item){ ... }) Jobs collection`

Walk through all elements in the collection of objects.Returns a new collection object by traversing the function.This key in the traversing function points to the current loop (pass through the second parameter in the function).

Returns null and undefined in the trajectory, which will end.

```js
elements.map(function()umb reburn $(this).text()}.get().join(', ')
```

### next

- `next() HOT collection`
- `next(selector) overall collection`

Get the next sibling node for each element in the collection of objects (optional with filter selector).


### not

- `not(selector) overall collection`
- `not(collection) collar collection`
- `not(function(index){ ... }) collections`

Filter the current set of objects to get a new collection of objects within which elements cannot match the css selector.If another parameter is a set of Zepto objects, the returned element in the new Zepto object is not included in that parameter object.If the parameter is a function.Only contains function execution`false`elements worth time, the function `this` keyword points to the current loop element.

Feature contrary to it, see `filter`.

### offset

- `offset() promise<object>`
- `offset(coordinates) total self`
- `offset(function(index, oldOffset){ ... }(self`

Gets the location of the current element relative to the document.Return an object with： `top`, `left`, `width`and`height`

### offsetParent

- `offsetParent() collections`

Find the first identified ancestor element, meaning the `position` attribute value in its css is 'relative', 'absolute' or 'fixed'

### Parent

- `parent([selector]) contract collection`

Gets the direct parent of each element in the set of objects.If css selector parameter is given.Filter out a qualified element.

### Parents

- `parents([selector]) collate collections`

Gets an object collection of all ancestor elements per element.Filtering eligible elements if css selector parameters are given.

If you want to get a direct parent element, use `parent`.如果只想获取到第一个符合css选择器的元素，使用`closest`。

```js
$('h1').parents() //=> [<div#container>, <body>, <html>]
```

### position

- `position()Jobject`

Gets the position of the first element in the collection of objects.For `offsetParent`.This method is useful when one element is absolutely positioned close to another.

```js
var pos = element.position()

// position a tooltip relative to the element
$('#tooltip').css({
  position: 'absolute',
  top: pos.top - 30,
  left: pos.left
})
```

### Prepend

- `prepend(content) odd self`

Insert the contents of the parameter into the front of each matching element (note：inner insert).Insert the element in d can try the html string fragments, a domain node or an array of nodes.

```js
$('ul').prepend('<li>first list item</li>')
```

### PrependTo

- `prependTo(target) total self`

Insert all elements before the target (note：inner insert).This is a little like`prepend`but the opposite way.

```js
$('<li>first list item</li>').pending To('ul')
```

### prev

- `Prev() Collection`
- `Prev(selector) Jobs collection`

Gets the previous siblings of each element in the collection of objects, filtering them by selector.

### prop

- `prop(name) copy value`
- `prop(name, value) chorus self`
- `prop(name, function(index, olvalue){ ... }) self`

Reads or sets property values for domain elements.It has priority over `attr`when reading property values, as these properties change as a result of user interaction, such as`checked` and `selected`.

Simplified or lowercase names, e.g.`for`, `class`, `readonly`and similar properties will be mapped to actual properties, e.g.`htmlFor`, `className`, `readOnly`, etc.

### remove

- `remove()chool self`

Remove elements from the current collection from its parent node and remove them from domain.


### removeAttr

- `removeAttr(name) etc self`

Remove the specified attributes of all elements in the current set of objects.

### removeClass

- `removeClass([name]3meter`
- `removeClass(function(index, oldClassName){ ... }odd self`

Remove the specified class of all elements in the current set of objects.If no name is specified, all classes will be removed.More than one class parameter name can be separated by space.The following example removed two classes.

```js
$("#check1").removeClass("test")
```

### removeProp

- `removeProp(name) self`

Remove an attribute from each DOM node in the collection.This is done with the JavaScript`delete`operator.Notably, if you try to delete some built-in attributes of the DOM, such as`className`or`maxLength`, you will not have any effect because the browser prohibits deleting these properties.

### ReplaceWith

- `replaceWidth (content) self`

Replace all matching elements with the given content.(includes elements themselves).The content parameter can be the type described in `before`.

### scrollLeft

- `scrollLeft() => Promis<number>`
- `scrollLeft(value) chrome self`

Gets or sets the scroll element on the page or the pixel value of the whole window to the right.

```js
const height = await $('#foo').scrollLeft() // => 123
```

### scrollop

- `scrolloTop() => Promis<number>`
- `scrolloTop(value) total self`

Gets or sets the scroll element on the page or the pixel value of the whole window to scroll down.

```js
const height = await $('#foo').scrolloTop() // => 123
```

### show

- `show()_self`

### siblings

- `siblings([selector]JOM collection`

Gets the siblings of all elements in the collection of objects.Filter elements matching the selector if the CSS selector parameter is given.


### size

- `size() number`

Gets the number of elements in the set of objects.


### slice

- `slice(start, [end]) raray`

提取这个数组array的子集，从`start`开始，如果给定`end`，提取从从`start`开始到`end`结束的元素，但是不包含`end`位置的元素。

### Text

- `text() string`
- `text(content) total self`
- `text(function(index, oldText){ ... }) odd self`

Gets or sets the text content of the elements in the collection of all objects.Returns the text content of the first element in the current set of objects (including text content in a child node) when no content parameter is given.When giving a content parameter, use it to replace the text content of all elements in the set of objects.It has to look at html. Unlike it, it cannot be used to fetch or set HTML.

### toggle

- `toggle ([setting]_self`

Show or hide the matching element.If `setting` is `true`, equal to `show()`.If`set`is`false`.Equivalent to `hide()`

### toggleClass

- `tooggleClass(names, [setting]self`
- `toggleClass(function(index, oldClassName){ ... }, [setting]odd self`

Add or remove one or more styles on each element in the matching list of elements.Remove the class if it exists and add it if it does not exist.If the setting is true, this feature is similar to addClasss. If false, this function is similar to removeClasss.

### unwrap

- `unwrap() odd self`

Remove the direct parent node of each element in the collection and keep their children in their original position. Essentially, this method removes the previous ancestral element while maintaining the current element in the DOM.

### val

- `val() Jobs string`
- `val(value) chores`
- `val(function(index, olvalue){ ... }) odd self`

Gets or sets values that match the element.Returns the value of the first element when no value is given.When a value parameter is given, the value of all elements will be set.

### Width

- `width() MMS Promise<number>`
- `width(value) total self`
- `width(function(index, oldWidth){ ... }) odd self`

Gets the width of the first element in the collection of objects; or sets the width of all elements in the collection of objects.

```js
await $('#foo').width() // => 123
```

## Event

### Off

- `off(type, [selector], function(e){ ... }) self`
- `off({ type: handler, type2: handler2, ... }, [selector]odd self`
- `off(type, [selector]odd self`
- `off() odd self`

Removing an event added by on. Removes a specific event handler. Must add the same function with`on()`.Otherwise, calling this method only by event type will remove all processing procedures of that type.If there are no parameters, all registration events on the current element will be removed.

### on

- `on(type, [selector], function(e){ ... }) self`
- `on(type, [selector], [data], function(e){ ... }) sheeting`
- `on({ type: handler, type2: handler2, ... }, [selector])chatches`
- `on({ type: handler, type2: handler2, ... }, [selector], [data]) odd self`

Add event handler to the item in the collection of objects.Multiple events can be added by a string of spaces or by an object with an event type and a function value.If a css selector is given, the event will only be triggered when the party is launched on the element matching the selector (note：is the event assigned, or the event agent).

If given`data`parameters, this value will be used as a useful `event.data` attribute during event handler execution

The event handler is executed in the context of adding the element of the handler or matching the element with the given selector (note：this refers to the element triggering the event). When an event handler returns false, preventDefault() and stopPropagation() are called to the current event, default browser actions such as links.


```js
var elem = $('#content')
// serve all clicks inside #content:
elem. n('click', function(e){ ... })
// serve clicks insie links in #content
elem. n('click', 'nav a', function(e){ ... })
// all clicks inside links in the document
$('#test'). n('click', 'a', function(e){ ... })
// Disable following any navigation link on the page
$('#test').on ('click', 'nav a', false)
```

### 1

- `one(type, [selector], function(e){ ... }) self`
- `one(type, [selector], [data], function(e){ ... }) self`
- `one({ type: handler, type2: handler2, ... }, [selector]self`
- `one({ type: handler, type2: handler2, ... }, [selector], [data]) self`

Like `on()` add a handout to the element, which will automatically unbind after the first execution event, making sure the handler functions are executed up to one time on each element.

### Trigger

- `rigger(event, [args]) chatch self`

Triggers the specified event on the element of the object collection.If an args parameter is given, it will be passed to the event function as a parameter.

```js
$('#test').trigger ('tap', ['one', 'two'])
```

### TriggerHandler

- riggerHandler(event, [args])chrom self

Like `trigger` , it only triggers events on the current element without blowing up.