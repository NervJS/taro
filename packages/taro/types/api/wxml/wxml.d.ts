declare namespace Taro {
  /**
   * @since 1.4.0
   *
   * 返回一个SelectorQuery对象实例。可以在这个实例上使用`select`等方法选择节点，并使用`boundingClientRect`等方法选择需要查询的信息。
   *
   * **selectorQuery.in(component)：**
   *
   * @since 1.6.0
   *
   * 将选择器的选取范围更改为自定义组件`component`内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点。）
   *
   * **selectorQuery.select(selector)：**
   *
   * 在当前页面下选择第一个匹配选择器`selector`的节点，返回一个`NodesRef`对象实例，可以用于获取节点信息。
   *
   * `selector`类似于CSS的选择器，但仅支持下列语法。
   *
   * *   ID选择器：`#the-id`
   * *   class选择器（可以连续指定多个）：`.a-class.another-class`
   * *   子元素选择器：`.the-parent > .the-child`
   * *   后代选择器：`.the-ancestor .the-descendant`
   * *   跨自定义组件的后代选择器：`.the-ancestor >>> .the-descendant`
   * *   多选择器的并集：`#a-node, .some-other-nodes`
   *
   * **selectorQuery.selectAll(selector)：**
   *
   * 在当前页面下选择匹配选择器`selector`的节点，返回一个`NodesRef`对象实例。 与`selectorQuery.selectNode(selector)`不同的是，它选择所有匹配选择器的节点。
   *
   * **selectorQuery.selectViewport()：**
   *
   * 选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息，返回一个`NodesRef`对象实例。
   *
   * **nodesRef.boundingClientRect([callback])：**
   *
   * 添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。其功能类似于DOM的getBoundingClientRect。返回值是nodesRef对应的selectorQuery。
   *
   * 返回的节点信息中，每个节点的位置用`left`、`right`、`top`、`bottom`、`width`、`height`字段描述。如果提供了callback回调函数，在执行selectQuery的exec方法后，节点信息会在callback中返回。
   *
   * **nodesRef.scrollOffset([callback])：**
   *
   * 添加节点的滚动位置查询请求，以像素为单位。节点必须是`scroll-view`或者viewport。返回值是nodesRef对应的selectorQuery。
   *
   * 返回的节点信息中，每个节点的滚动位置用`scrollLeft`、`scrollTop`字段描述。如果提供了callback回调函数，在执行selectQuery的exec方法后，节点信息会在callback中返回。
   *
   * **selectorQuery.exec([callback])：**
   *
   * 执行所有的请求，请求结果按请求次序构成数组，在callback的第一个参数中返回。
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     queryMultipleNodes: function(){
       var query = Taro.createSelectorQuery()
       query.select('#the-id').boundingClientRect()
       query.selectViewport().scrollOffset()
       query.exec(function(res){
         res[0].top       // #the-id节点的上边界坐标
         res[1].scrollTop // 显示区域的竖直滚动位置
       })
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Component({
     queryMultipleNodes: function(){
       var query = Taro.createSelectorQuery().in(this)
       query.select('#the-id').boundingClientRect(function(res){
         res.top // 这个组件内 #the-id 节点的上边界坐标
       }).exec()
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     getRect: function(){
       Taro.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
         rect.id      // 节点的ID
         rect.dataset // 节点的dataset
         rect.left    // 节点的左边界坐标
         rect.right   // 节点的右边界坐标
         rect.top     // 节点的上边界坐标
         rect.bottom  // 节点的下边界坐标
         rect.width   // 节点的宽度
         rect.height  // 节点的高度
       }).exec()
     },
     getAllRects: function(){
       Taro.createSelectorQuery().selectAll('.a-class').boundingClientRect(function(rects){
         rects.forEach(function(rect){
           rect.id      // 节点的ID
           rect.dataset // 节点的dataset
           rect.left    // 节点的左边界坐标
           rect.right   // 节点的右边界坐标
           rect.top     // 节点的上边界坐标
           rect.bottom  // 节点的下边界坐标
           rect.width   // 节点的宽度
           rect.height  // 节点的高度
         })
       }).exec()
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     getScrollOffset: function(){
       Taro.createSelectorQuery().selectViewport().scrollOffset(function(res){
         res.id      // 节点的ID
         res.dataset // 节点的dataset
         res.scrollLeft // 节点的水平滚动位置
         res.scrollTop  // 节点的竖直滚动位置
       }).exec()
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     getFields: function(){
       Taro.createSelectorQuery().select('#the-id').fields({
         dataset: true,
         size: true,
         scrollOffset: true,
         properties: ['scrollX', 'scrollY']
       }, function(res){
         res.dataset    // 节点的dataset
         res.width      // 节点的宽度
         res.height     // 节点的高度
         res.scrollLeft // 节点的水平滚动位置
         res.scrollTop  // 节点的竖直滚动位置
         res.scrollX    // 节点 scroll-x 属性的当前值
         res.scrollY    // 节点 scroll-x 属性的当前值
       }).exec()
     }
   })
   ```
   */
  function createSelectorQuery(): SelectorQuery

  interface nodesRef {
    boundingClientRect: (callback?: clientRectCallback) => nodesRef
    scrollOffset: (callback?: scrollCallback) => nodesRef
    fields: (fields: fieldsObject, callback?: fieldCallback) => nodesRef
    exec: (callback?: execCallback) => void
  }

  interface baseElement {
    id: string
    dataset: object
  }

  interface rectElement {
    left: number
    right: number
    top: number
    bottom: number
  }

  interface sizeElement {
    width: number
    height: number
  }

  interface scrollElement {
    scrollLeft: number
    scrollTop: number
  }

  interface clientRectElement extends baseElement, rectElement, sizeElement {}

  interface scrollOffsetElement extends baseElement, scrollElement {}

  interface fieldsObject {
    id?: boolean
    dataset?: boolean
    rect?: boolean
    size?: boolean
    scrollOffset?: boolean
    properties?: string[]
    computedStyle?: string[]
  }

  interface fieldElement extends baseElement, rectElement, sizeElement {
    [key: string]: any
  }

  type execObject = clientRectElement & scrollOffsetElement & fieldElement
  type clientRectCallback = (rect: clientRectElement | clientRectElement[]) => void
  type scrollCallback = (res: scrollOffsetElement | scrollOffsetElement[]) => void
  type fieldCallback = (res: fieldElement | fieldElement[]) => void
  type execCallback = (res: execObject | execObject[]) => void

  class SelectorQuery {
    /**
     * 参考下面详细介绍
     */
    in(component?: any): SelectorQuery
    /**
     * 参考下面详细介绍
     */
    select(selector: string): nodesRef
    /**
     * 参考下面详细介绍
     */
    selectAll(selector: string): nodesRef
    /**
     * 参考下面详细介绍
     */
    selectViewport(): nodesRef
    /**
     * 参考下面详细介绍
     */
    exec(callback?: execCallback): void
  }

  // TODO: wx.createIntersectionObserver
  // TODO: IntersectionObserver
}
