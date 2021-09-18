---
title: jQuery-like API
---

Taro now officially supports building views using React or Vue, both of which are data-driven declarative rendering approaches.

However, there are a few cases where we need to manipulate the DOM explicitly, and the `createQuerySelector` API provided by the mini program is more complex to understand. In such cases, we provide a jQuery-like family of APIs, which is as simple as installing the dependencies via NPM: `createQuerySelector`.

```bash
npm i @tarojs/extend
```

Then you need to use the file to introduce `$` that is.

```js
import { $ } from '@tarojs/extend'
```

:::info to learn more
You can also learn more about the reasoning and design behind the implementation of the jQuery-like API by visiting the [jQuery-like API RFC](https://github.com/NervJS/taro-rfcs/pull/1).
:::

## Core methods


### $()

- `$(selector, [context])   ⇒ collection`
- `$(<collection>)   ⇒ same collection`
- `$(<DOM nodes>)   ⇒ collection`
- `$(htmlString)   ⇒ collection`
- `$(htmlString, attributes)   ⇒ collection`

A collection object is created by executing a CSS selector, wrapping DOM nodes, or creating multiple elements from a single HTML string.

A `collection` is an array-like object that has chained methods to manipulate the DOM node it points to, and all methods in the document object are collection methods except for direct methods on the `$()` object (such as `$.extend`).


If the content parameter (css selector, dom, or collection object) is present in the selector, then only the css selector is performed in the context of the given node; this function is the same as using `$(context).find(selector)`.


```js
$('view')  //=> All pages with p elements
$('#foo') //=> Elements with ID "foo"

// Create element:
$("<text>Hello</text>") //=> new text element
// Create elements with attributes:
$("<text />", { text:"Hello", id:"greeting", css:{color:'darkblue'} })
//=> <text id=greeting style="color:darkblue">Hello</p>
```

Please note that :::caution
This does not support the [jQuery CSS extension](https://www.html.cn/jqapi-1.9/category/selectors/jquery-selector-extensions/), however, the optional "selector " module provides limited support for several of the most commonly used pseudo-selectors, and can be discarded for compatible implementation with existing code or plugins.
:::


:::caution Please note
Unlike React or Vue, you can use HTML elements like `div` in Taro's `jQuery-like API`, but components that use the mini program specification (e.g. `view`) will run more smoothly in a Taro application. However, the HTML elements that may appear in the examples that follow represent usage methods only, not actual usability.
:::


### $.fn

$.fn is an object that holds all the methods available on a jQuery object, such as `addClass()`, `attr()`, and other methods. Add a method to this object and it will be available on all jQuery objects.

Here is an example of implementing jQuery's `empty()` method.

```js
$.fn.empty = function(){
  return this.each(function(){ this.innerHTML = '' })
}
```

### addClass

- `addClass(name)   ⇒ self`
- `addClass(function(index, oldClassName){ ... })   ⇒ self`

Add the specified class name to each matching element. Multiple class names are separated by spaces.

### after

- `after(content)   ⇒ self`

Insert content after each matching element (note: external insertion). The content can be an html string, a dom node, or an array of nodes.


```js
$('form label').after('<p>A note below the label</p>')
```

### append

- `append(content)   ⇒ self`

Insert content at the end of each matched element (note: internal insertion). The content can be an html string, a dom node, or an array of nodes.

```js
$('ul').append('<li>new list item</li>')
```

### attr

- `attr(name)   ⇒ string`
- `attr(name, value)   ⇒ self`
- `attr(name, function(index, oldValue){ ... })   ⇒ self`
- `attr({ name: value, name2: value2, ... })   ⇒ self`

Reads or sets the attributes of dom. If the value parameter is not given, the value of the property of the first element in the object collection is read. When the value parameter is given. then the value of this property is set for all elements in the object collection. When the value parameter is `null`, then the attribute will be removed (similar to `removeAttr`) and multiple attributes can be set by means of object key-value pairs.

To read DOM attributes such as `checked` and `selected`, use `prop`.

```js
var form = $('form')
form.attr('action')             //=> read the values
form.attr('action', '/create')  //=> set the values
form.attr('action', null)       //=> remove the values

// more property:
form.attr({
  action: '/create',
  method: 'post'
})
```

### before

- `before(content)   ⇒ self`

Insert content in front of each element of the match (note: external insertion). The content can be an html string, a dom node, or an array of nodes.

```js
$('table').before('<p>See the following table:</p>')
```

### children

- `children([selector])   ⇒ collection`

Get the direct children of each matched element collection element, if selector is given, then the returned result contains only the elements that match the css selector.

```js
$('ol').children('*:nth-child(2n)')
//=> every other list item from every ordered list
```

### clone (`3.0.0-rc.6`)

- `clone()   ⇒ collection`

Copy all elements in the collection by deep cloning.

### closest

- `closest(selector, [context])   ⇒ collection`
- `closest(collection)   ⇒ collection`
- `closest(element)   ⇒ collection`

Starts with the element itself and matches it step by step up to the higher-level elements, and returns the element that first matches the selector. If the context node argument is given, then only the descendant elements of that node are matched. This method is somewhat similar to `parents(selector)`, but it only returns the ancestor element that was matched first.

If the argument is a jQuery object collection or an element, the result must match the given element instead of the selector.

```js
var input = $('input[type=text]')
input.closest('form')
```

### contents

- `contents()   ⇒ collection`

Gets the children of each matched element collection element, including text and comment nodes. (Note: The `.contents()` and `.children()` methods are similar, except that the former includes the text node as well as the HTML elements generated in the jQuery object.)

### css

- `css(property)   ⇒ value`
- `css([property1, property2, ...])   ⇒ object`
- `css(property, value)   ⇒ self`
- `css({ property: value, property2: value2, ... })   ⇒ self`

Retrieve or set the css property of a DOM element. When the value parameter does not exist, return the css property of the first element in the object collection. When the value parameter is present, sets the corresponding css property of each element in the object collection.

Multiple properties can be obtained at once by passing an array of property names. Multiple properties can be set using object key-value pairs.

When value is empty (empty string, null or undefined), that css property will be moved out. When the value parameter is a unitless number, "px" will be automatically added to the css property if it requires units.

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

Reads or writes to the `data-*` property of dom. Behaves a bit like attr, but with data- in front of the attribute name.

When the attribute value is read, the following conversions are made:

- "true", "false", and "null" are converted to the corresponding types.
- numeric values are converted to the actual numeric type.
- JSON values will be parsed, if it is valid JSON.
- Everything else is returned as a string.


### each

- `each(function(index, item){ ... })   ⇒ self`

Iterates over each element of a collection of objects. In the iterator function, the `this` keyword points to the current item (passed as the second argument to the function). If the iterator function returns `false`, the iteration ends.

```js
$('form input').each(function(index){
  console.log('input %d is: %o', index, this)
})
```

### empty

- `empty()   ⇒ self`

Clears the DOM content of each element in the object collection.

### eq

- `eq(index)   ⇒ collection`

Get the element with the given index value (note: base 0) from the current object collection.

```js
$('li').eq(0)   //=> only the first list item
$('li').eq(-1)  //=> only the last list item
```

### filter

- `filter(selector)   ⇒ collection`
- `filter(function(index){ ... })   ⇒ collection`

Filter the set of objects and return the items in the set of objects that satisfy the css selector. If the argument is a function, the element will be returned only when the function returns an actual value. In the function, the this keyword points to the current element.

### find

- `find(selector)   ⇒ collection`
- `find(collection)   ⇒ collection v1.0+`
- `find(element)   ⇒ collection v1.0+`

Finds the descendant elements of each element that matches the CSS selector within the current object's former collection.

If given a Zepto object collection or elements, filter them and only return them if they are in the current Zepto collection object.

```js
var form = $('#myform')
form.find('input, select')
```

### first

- `first()   ⇒ collection`

Get the first element of the current object collection.

```js
$('form').first()
```

### forEach

- `forEach(function(item, index, array){ ... }, [context])`

Iterates over each element of the object collection, somewhat similar to each, but the arguments to the iterator function are different and the iteration does not stop when the function returns `false`.

### get

- `get()   ⇒ array`
- `get(index)   ⇒ DOM node`

Get all elements or a single element from the current object collection. When the index argument does not exist, all elements are returned as a normal array. When index is specified, only the elements of the set are returned. This is different from `eq`, which returns the DOM node, not the Zepto object collection.


```js
var elements = $('h2')
elements.get()   //=> get all headings as an array
elements.get(0)  //=> get first heading node
```


### has

- `has(selector)   ⇒ collection`
- `has(node)   ⇒ collection`

Determine if the current object collection has child elements that match the selector or contains the specified DOM node, if so, return a new object collection that filters out objects that do not contain elements that match the selector or do not contain the specified DOM node.


```js
$('ol > li').has('a[href]')
//=> get only LI elements that contain links
```

### hasClass

- `hasClass(name)   ⇒ boolean`

Check if any element in the object collection contains the specified class.

```js
$("li").hasClass("test")
```

### height

- `height()   ⇒ Promise<number>`
- `height(value)   ⇒ self`
- `height(function(index, oldHeight){ ... })   ⇒ self`

Get the height of the first element in the object collection; or set the height of all elements in the object collection.

```js
const height = await $('#foo').height() // => 123
```

:::caution Please note that
`height()` returned by the `Promise` object.
:::

### hide

- `hide()   ⇒ self`

Hide the elements in the object collection by setting the css property `display` to `none`.

### html

- `html()   ⇒ string`
- `html(content)   ⇒ self`
- `html(function(index, oldHtml){ ... })   ⇒ self`

Gets or sets the HTML content of the elements in the object collection. When no content argument is given, returns the innerHtml of the first element in the object collection. when the content argument is given, replaces the content of each element in the object collection with it. content can be of all the types described in append.

```js
// autolink everything that looks like a Twitter username
$('.comment p').html(function(idx, oldHtml){
  return oldHtml.replace(/(^|\W)@(\w{1,15})/g,
    '$1@<a href="http://twitter.com/$2">$2</a>')
})
```

### index

- `index([element])   ⇒ number`

Gets the index value of an element (note: counts from 0). When the elemen argument is not given, returns the position of the current element in the sibling node. When the element argument is given, returns its position in the current set of objects. If the element is not found, -1 is returned.

```js
$('li:nth-child(2)').index()  //=> 1
```

### insertAfter

- `insertAfter(target)   ⇒ self`

Inserts an element from a collection after the specified target element (note: external insertion). This is a bit like `after`, but used in the opposite way.

```js
$('<p>Emphasis mine.</p>').insertAfter('blockquote')
```

### insertBefore

- `insertBefore(target)   ⇒ self`

Inserts an element of the collection in front of the specified target element (note: external insertion). This is a bit like `before`, but used in the opposite way.

```js
$('<p>See the following table:</p>').insertBefore('table')
```

### last

- `last()   ⇒ collection`

Gets the last element of the object collection.

```js
$('li').last()
```

### map

- `map(function(index, item){ ... })   ⇒ collection`

Iterates over all elements in a collection of objects. A new collection object is formed by the return value of the traversal function. This key in the traversal function points to the item of the current loop (the second argument in the traversal function).

The traversal will end when null and undefined are returned in the traversal.

```js
elements.map(function(){ return $(this).text() }).get().join(', ')
```

### next

- `next()   ⇒ collection`
- `next(selector)   ⇒ collection`

Get the next sibling node of each element in the object collection (optionally with a filter selector).

### not

- `not(selector)   ⇒ collection`
- `not(collection)   ⇒ collection`
- `not(function(index){ ... })   ⇒ collection`

Filter the current collection of objects to get a new collection of objects whose elements do not match the css selector. If the other argument is a Zepto object collection, then none of the elements in the returned new Zepto object are included in that argument object. If the argument is a function. Contains only the elements when the function is executed as `false` worth, and the function's `this` keyword points to the current loop element.

For the opposite function, see `filter`.

### offset

- `offset()   ⇒ Promise<object>`
- `offset(coordinates)   ⇒ self`
- `offset(function(index, oldOffset){ ... })   ⇒ self`

Gets the position of the current element relative to the document. Returns an object containing: `top`, `left`, `width` and `height`.

### offsetParent

- `offsetParent()   ⇒ collection`

Find the first positioned ancestor element, meaning it has a css `position` attribute with a value of "relative", "absolute" or "fixed "

### parent

- `parent([selector])   ⇒ collection`

Get the direct parent of each element in the object collection. If the css selector parameter is given. Filter out the elements that match the conditions.

### parents

- `parents([selector])   ⇒ collection`

Get all ancestor elements of each element of the object collection. If the css selector parameter is given, filter out the elements that match the criteria.

If you want to get the direct parent element, use `parent`. If you want to get only the first element that matches the css selector, use `closest`.


```js
$('h1').parents()   //=> [<div#container>, <body>, <html>]
```

### position

- `position()   ⇒ object`

Get the position of the first element in the object collection. Relative to `offsetParent`. This method is useful when an absolutely positioned element is close to another element.

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

Inserts the content of the argument in front of each matching element (note: inserted inside the element). The element inserted into d can try an html string fragment, a dom node, or an array of nodes.

```js
$('ul').prepend('<li>first list item</li>')
```

### prependTo

- `prependTo(target)   ⇒ self`

Inserts all elements in front of the target (note: inserts inside elements). This is a bit like `prepend`, but in the opposite way.


```js
$('<li>first list item</li>').prependTo('ul')
```

### prev

- `prev()   ⇒ collection`
- `prev(selector)   ⇒ collection`

Get the previous sibling node of each element in the object collection, filtered by a selector.

### prop

- `prop(name)   ⇒ value`
- `prop(name, value)   ⇒ self`
- `prop(name, function(index, oldValue){ ... })   ⇒ self`

Reads or sets the value of an attribute of a dom element. It takes precedence over `attr` in the case of reading attribute values that can change due to user interaction, such as `checked` and `selected`.

Short or lowercase names such as `for`, `class`, `readonly` and similar attributes will be mapped to actual attributes such as `htmlFor`, `className`, `readOnly`, etc.

### remove

- `remove()   ⇒ self`

Remove the element in the current collection from its parent node, effectively removing it from the dom.

### removeAttr

- `removeAttr(name)   ⇒ self`

Removes the specified attribute from all elements of the current object collection.

### removeClass

- `removeClass([name])   ⇒ self`
- `removeClass(function(index, oldClassName){ ... })   ⇒ self`

Removes the specified class from all elements of the current object collection. if no name parameter is specified, all classes are removed. multiple class parameter names can be separated by spaces. The following example removes two classes.

```js
$("#check1").removeClass("test")
```

### removeProp

- `removeProp(name)   ⇒ self`

Removes an attribute from each DOM node of a collection. This is done using JavaScript's `delete` operator. It is worth noting that if you try to delete some of the DOM's built-in properties, such as `className` or `maxLength`, it will have no effect because the browser forbids the deletion of these properties.

### replaceWith

- `replaceWith(content)   ⇒ self`

Replaces all matching elements with the given content. (including the element itself). content parameter can be of the type described in `before`.

### scrollLeft

- `scrollLeft() => Promise<number>`
- `scrollLeft(value)   ⇒ self`

Gets or sets the pixel value of the scrolling element on the page or the entire window scrolling to the right.

```js
const height = await $('#foo').scrollLeft() // => 123
```

### scrollTop

- `scrollTop() => Promise<number>`
- `scrollTop(value)   ⇒ self`

Gets or sets the pixel value of the scrolling element on the page or the entire window scrolling down.

```js
const height = await $('#foo').scrollTop() // => 123
```

### show

- `show()   ⇒ self`

### siblings

- `siblings([selector])   ⇒ collection`

Gets the sibling nodes of all elements in the object collection. If given CSS selector parameters, filter out the elements that match the selector.

### size

- `size()   ⇒ number`

Get the number of elements in the object collection.


### slice

- `slice(start, [end])   ⇒ array`

Extracts a subset of this array array, starting from `start`, and if `end` is given, extracts the elements starting from `start` and ending at `end`, but not including the elements at `end`.

### text

- `text()   ⇒ string`
- `text(content)   ⇒ self`
- `text(function(index, oldText){ ... })   ⇒ self`

Gets or sets the text content of all elements in the object collection. When the content parameter is not given, returns the text content of the first element in the current object collection (including the text content of the child nodes). When the content parameter is given, it is used to replace the text content of all elements in the object collection. It is to be used like html, except that it cannot be used to get or set HTML.

### toggle

- `toggle([setting])   ⇒ self`

Show or hide matching elements. If `setting` is `true`, it is equivalent to `show()`. If `setting` is `false`. it is equivalent to `hide()`.

### toggleClass

- `toggleClass(names, [setting])   ⇒ self`
- `toggleClass(function(index, oldClassNames){ ... }, [setting])   ⇒ self`

Adds or removes one or more style classes to each element in the matched set of elements. If the name of the class exists, remove it, if not, add it. If the value of setting is true, this function is similar to addClass, and if false, this function is similar to removeClass.

### unwrap

- `unwrap()   ⇒ self`

Removes the immediate parent node of each element in the collection and keeps their child elements in their original position. Basically, this method removes the previous ancestor element, while keeping the current element in the DOM.

### val

- `val()   ⇒ string`
- `val(value)   ⇒ self`
- `val(function(index, oldValue){ ... })   ⇒ self`

Get or set the value of the matched element. When no value parameter is given, the value of the first element is returned. When the value parameter is given, then the values of all elements will be set.

### width

- `width()   ⇒ Promise<number>`
- `width(value)   ⇒ self`
- `width(function(index, oldWidth){ ... })   ⇒ self`

Get the width of the first element in the object collection; or set the width of all elements in the object collection.

```js
await $('#foo').width()   // => 123
```

## 事件

### off

- `off(type, [selector], function(e){ ... })   ⇒ self`
- `off({ type: handler, type2: handler2, ... }, [selector])   ⇒ self`
- `off(type, [selector])   ⇒ self`
- `off()   ⇒ self`

Removing events added with on. To remove a specific event handler, you must pass the same function that was added with `on()`. Otherwise, calling this method with just the event type will remove all handlers of that type. If there are no arguments, all registered events on the current element will be removed.

### on

- `on(type, [selector], function(e){ ... })   ⇒ self`
- `on(type, [selector], [data], function(e){ ... })   ⇒ self`
- `on({ type: handler, type2: handler2, ... }, [selector])   ⇒ self`
- `on({ type: handler, type2: handler2, ... }, [selector], [data])   ⇒ self`

Adds event handlers to elements in a collection of objects. Multiple events can be added as strings with spaces, or as objects with event types as keys and functions as values. If a css selector is given, the event will be fired when it is initiated on an element matching that selector (note: i.e., event delegation, or event proxy).

If the `data` parameter is given, this value will be used as a useful `event.data` property during the execution of the event handler

The event handler is executed in the context of the element to which the handler is added, or the element that matches the selector in the given selector case (note: this points to the element that triggered the event). When an event handler returns false, preventDefault() and stopPropagation() are called by the current event to prevent default browser actions, such as links.


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

Like `on()`, adds a handler event to the element, which is automatically unbound after the first execution of the event, ensuring that the handler is executed at most once on each element.

### trigger

- `trigger(event, [args])   ⇒ self`

Triggers the specified event on an element of the object collection. If the args argument is given, it will be passed as an argument to the event function.

```js
$('#test').trigger('tap', ['one', 'two'])
```

### triggerHandler

- triggerHandler(event, [args])   ⇒ self

Like `trigger`, it only fires an event on the current element, but does not bubble it.
