---
title: Reconciler
---

Taro's runtime includes DOM, BOM, React-compatible layer, Vue-compatible layer, etc., and different platforms or development frameworks may require intrusive customization of the Taro runtime.

To decouple, we refer to the concept of **React Reconciler**, where the runtime can be customized externally by providing a custom `hostConfig` configuration object.

> In case the configuration items of hostConfig do not meet the requirements and need to be extended, you can submit a PR to Taro ~

## hostConfig Configuration

### appendChild (parent, child)

Triggered when `DOMNode` calls `appendChild` method.

| Parameters | Type                  | Description                       |
|:---------- |:--------------------- |:--------------------------------- |
| parent     | DOMNode               | Parent node                       |
| child      | DOMNode / TextElement | Nodes appended to the parent node |

### removeChild (parent, child, oldChild)

Triggered when `DOMNode` calls `replaceChild` method.

| Parameters | Type                  | Description                          |
|:---------- |:--------------------- |:------------------------------------ |
| parent     | DOMNode               | Parent node                          |
| child      | DOMNode / TextElement | Replace the oldChild with a new node |
| oldChild   | DOMNode / TextElement | Replaced original nodes              |

### insertBefore (parent, child, refChild)

Triggered when `DOMNode` calls the `insertBefore` method.

| Parameters | Type                  | Description             |
|:---------- |:--------------------- |:----------------------- |
| parent     | DOMNode               | Parent node             |
| child      | DOMNode / TextElement | Inserted nodes          |
| refChild   | DOMNode / TextElement | Insert before this node |

### removeAttribute (element, qualifiedName)

Triggered when `DOMElement` invokes the `removeAttribute` method.

| Parameters    | Type       | Description                                                      |
|:------------- |:---------- |:---------------------------------------------------------------- |
| element       | DOMElement | Current operating element                                        |
| qualifiedName | string     | Specify the name of the attribute to be removed from the element |

### setAttribute (element, qualifiedName, value)

Triggered when `DOMElement` invokes the `setAttribute` method.

| Parameters    | Type       | Description                       |
|:------------- |:---------- |:--------------------------------- |
| element       | DOMElement | Current operating element         |
| qualifiedName | string     | String of the property name       |
| value         |            | Value of the property / new value |

### prepareUpdateData (data, page)

Triggered every time the Taro DOM tree is updated, before calling the  mini program `setData`.

| Parameters | Type            | Description                              |
|:---------- |:--------------- |:---------------------------------------- |
| data       | DataTree        | Taro DOM tree data structure for setData |
| page       | TaroRootElement | Page root element                        |

### appendInitialPage (data, page)

Taro DOM tree initialization, triggered before the first call to the mini program `setData`.Executed immediately after the call to `prepareUpdateData`.

| Parameters | Type            | Description                              |
|:---------- |:--------------- |:---------------------------------------- |
| data       | DataTree        | Taro DOM tree data structure for setData |
| page       | TaroRootElement | Page root element                        |

### getLifecyle (instance, lifecyle)

Called when the lifecycle of the mini program page is triggered.

| Parameters | Type     | Description             |
|:---------- |:-------- |:----------------------- |
| instance   | Instance | Page Instance           |
| lifecyle   | string   | Lifecycle function name |

Needs to return **function** or **function[]**, indicating the function to be executed.

Example：

```js
// Default value. // Takes the corresponding lifecycle method directly from the user-written page instance
getLifecyle (instance, lifecyle) {
  return instance[lifecyle]
}

// In React
// the mini program triggers onShow, which calls the user-written componentDidShow
// the mini program triggers onHide, calling the user-written componentDidHide
getLifecyle (instance, lifecycle) {
  if (lifecycle === 'onShow') {
    lifecycle = 'componentDidShow'
  } else if (lifecycle === 'onHide') {
    lifecycle = 'componentDidHide'
  }
  return instance[lifecycle]
}
```

### onTaroElementCreate (tagName, nodeType)

Triggered when `DOMElement` is constructed.

| Parameters | Type     | Description                                    |
|:---------- |:-------- |:---------------------------------------------- |
| tagName    | string   | The tag name of the currently created element  |
| nodeType   | NodeType | The node type of the currently created element |

| nodeType | Description                   |
|:-------- |:----------------------------- |
| 1        | ELEMENT_NODE                  |
| 2        | ATTRIBUTE_NODE                |
| 3        | TEXT_NODE                     |
| 4        | CDATA_SECTION_NODE          |
| 5        | ENTITY_REFERENCE_NODE       |
| 6        | COMMENT_NODE                  |
| 7        | PROCESSING_INSTRUCTION_NODE |
| 9        | DOCUMENT_NODE                 |

### getPathIndex (indexOfNode)

Triggered when `DOMNode` gets the `path` property.

| Parameters  | Type   | Description                                                               |
|:----------- |:------ |:------------------------------------------------------------------------- |
| indexOfNode | number | The subscript of the current node in the children list of the parent node |

Needs to return a **string** value representing the array subscript when the mini program is `setData` by path.

Example:

```js
// Default value
getPathIndex (indexOfNode) {
  return `[${indexOfNode}]`
}

// Baidu smart program does not require [] Parcels
getPathIndex (indexOfNode) {
  return indexOfNode
}
```

### getEventCenter(Events)

Triggered when `Taro.eventCenter` initializes its value.

| Parameters | Type | Description                       |
|:---------- |:---- |:--------------------------------- |
| Events     |      | Constructor for Taro Event Center |

Needs to return an instance of the Taro event center, which will be assigned to `Taro.eventCenter`.

Example:

```js
// Default value:
getEventCenter (Events) {
  return new Events()
}

// In the Alipay mini program
// Priority is given to removing created event center instances from the mini program global object my to avoid problems when subpackaging.
getEventCenter (Events) {
  if (!my.taroEventCenter) {
    my.taroEventCenter = new Events()
  }
  return my.taroEventCenter
}
```

### initNativeApi (taro)

Triggered when referencing the `@tarojs/taro` package.

| Parameters | Type | Description |
|:---------- |:---- |:----------- |
| taro       |      | Taro Object |

Example:

```js
initNativeApi (taro) {
  // Add getApp method to Taro object
  taro.getApp = getApp
}
```
