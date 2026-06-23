# @tarojs/react

基于 `react-reconciler` 的小程序专用 React 渲染器，连接 `@tarojs/runtime 的 DOM 实例，相当于小程序版的 `react-dom`，暴露的 API 也和 `react-dom` 保持一致。

## HostConfig for Taro

Taro 对 HostConfig 进行了针对性的改造，以适应小程序环境。现对各字段进行阐述，具体实现以文件 `./src/reconciler.ts` 为准。

字段的含义描述来源于 [react-reconciler](https://www.npmjs.com/package/react-reconciler/v/0.27.0)

### getPublicInstance(instance)

> Determines what object gets exposed as a ref. If you don't want to do anything here, return instance.

Taro: 默认返回 instance 即可

### getRootHostContext(rootContainer)

> This method lets you return the initial host context from the root of the tree. If you don't intend to use host context, you can return null.

Taro: 默认返回 {}

### getChildHostContext(parentHostContext, type, rootContainer)

> Host context lets you track some information about where you are in the tree so that it's available inside createInstance as the hostContext parameter.

Taro: 默认返回 {}

### resetAfterCommit(containerInfo)

> This method is called right after React has performed the tree mutations. You can leave it empty.

Taro: 该方法置空

### prepareForCommit(containerInfo)

> This method lets you store some information before React starts making changes to the tree on the screen. 

Taro: 返回 null 即可.

### createInstance(type, props, rootContainer, hostContext, internalHandle)

> This method should return a newly created node. For example, the DOM renderer would call document.createElement(type) here and then set the properties from props.

Taro: 在 ReactDOM 中会调用 document.createElement 来生成 dom，而在小程序环境中 Taro 中模拟了 document，直接返回 `document.createElement(type)` 即可

> 也因为 Taro 没有使用其他入参，因此方法 getRootHostContext / getChildHostContext 默认返回 {} 即可

### appendInitialChild(parentInstance, child)

> This method should mutate the parentInstance and add the child to its list of children. For example, in the DOM this would translate to a parentInstance.appendChild(child) call.

Taro: 直接 parentInstance.appendChild(child) 即可

### finalizeInitialChildren(instance, type, props, rootContainer, hostContext)

> In this method, you can perform some final mutations on the instance. There is a second purpose to this method. It lets you specify whether there is some work that needs to happen when the node is connected to the tree on the screen. If you return true, the instance will receive a commitMount call later. See its documentation below.

finalizeInitialChildren 在组件挂载到页面中前调用，更新时不会调用.

Taro: 遍历 props，更新到 instance 中即可，同时返回false，即不需要调用 `commitMount` 方法

#### prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext)

> React calls this method so that you can compare the previous and the next props, and decide whether you need to update the underlying instance or not. If you need to update it, you can return an arbitrary object representing the changes that need to happen. Then in commitUpdate you would need to apply those changes to the instance.

prepareUpdate 的返回结果是 `commitUpdate` 的第二个入参。prepareUpdate 主要作用是render阶段计算出dom的哪些属性需要更新，这样在 commitUpdate 方法在commit阶段中可以快速更新dom，提高性能.

Taro: 对比 oldProps、newProps 计算出差异点，返回 `[prop1, value1, prop2, value2, ...]` .

### shouldSetTextContent(type, props)

> Some target platforms support setting an instance's text content without manually creating a text node. 

Taro: taro 模拟的 text 支持直接赋值 textContent (`packages/taro-runtime/src/dom/text.ts`)，该方法返回 false 即可.

> 因返回false，因此 resetTextContent 不会被调用

### createTextInstance(text, rootContainer, hostContext, internalHandle)

> Same as createInstance, but for text nodes. If your renderer doesn't support text nodes, you can throw here.

Taro: 模拟的 document 支持创建 text 节点， 返回 `document.createTextNode(text)` 即可.

### scheduleTimeout(fn, delay)

> You can proxy this to setTimeout or its equivalent in your environment.

Taro: setTimeout

### cancelTimeout(id)

> You can proxy this to clearTimeout or its equivalent in your environment.

Taro: clearTimeout

### noTimeout

> This is a property (not a function) that should be set to something that can never be a valid timeout ID. For example, you can set it to -1.

Taro: -1

### isPrimaryRenderer

> This is a property (not a function) that should be set to true if your renderer is the main one on the page.

Taro: true

### warnsIfNotActing

> Only used in development mode.

Taro: true

### supportsMutation

> If your target platform is similar to the DOM and has methods similar to appendChild, removeChild, and so on, you'll want to use the mutation mode.

Taro: true

### supportsPersistence

> If your target platform has immutable trees, you'll want the persistent mode instead. 

Taro: false

### supportsHydration

> is support hydration

Taro: false

### getInstanceFromNode(hostRoot)

> 自定义获取 instance 的逻辑

Taro: 返回 null，React 内部会继续调用 `findFiberRoot` 方法获取.

### beforeActiveInstanceBlur

> flag enableCreateEventHandleAPI is false, never call it

Taro: 置空

### afterActiveInstanceBlur

> flag enableCreateEventHandleAPI is false, never call it

Taro: 置空

### preparePortalMount(containerInfo)

> This method is called for a container that's used as a portal target. Usually you can leave it empty.

Taro: 暂不支持 portal，置空即可

### prepareScopeUpdate

> flag enableScopeAPI is false, never call it

Taro: 置空

### getInstanceFromScope

> flag enableScopeAPI is false, never call it

Taro: 返回 null 即可

### getCurrentEventPriority

> The constant you return depends on which event, if any, is being handled right now.

Taro: 默认为点击事件，返回 `DefaultEventPriority` 即可

### detachDeletedInstance

> 当 fiber 被标记为 Deletion 时，dom被卸载后，从dom节点上删除 react 初始化的内容，如 __reactProps$xxxx 等. 详见[React源码](https://github.com/facebook/react/blob/973b90bdf6f4a1d9b3864d93985d4a204f233855/packages/react-dom-bindings/src/client/ReactDOMComponentTree.js#L54)

Taro: 因taro无法获取到 $xxxx 随机数，因此暂无法实现善后工作，该方法置空. 但可以根据字段是否 `__react` 开头来实现。

### supportsMicrotasks

> 是否支持微任务

Taro: true

### scheduleMicrotask

> 微任务方法 polyfill

Taro: 使用 promise.then 模拟实现，或直接使用 setTimeout

**以下字段因 `supportsMutation=true` 而需要被实现**
### appendChild(parentInstance, child)

> This method should mutate the parentInstance and add the child to its list of children. 

Taro: 调用 `parentInstance.appendChild(child)` 即可

### appendChildToContainer(container, child)

> Same as appendChild, but for when a node is attached to the root container.

Taro: 调用 `parentInstance.appendChild(child)` 即可

### commitTextUpdate(textInstance, prevText, nextText)

> This method should mutate the textInstance and update its text content to nextText.

Taro: 赋值 `textInstance.nodeValue` 即可

### commitMount(instance, type, props, internalHandle)

> This method is only called if you returned true from finalizeInitialChildren for this instance.

Taro: 因 `finalizeInitialChildren` 返回 false，该方法置空

### commitUpdate(instance, updatePayload, type, prevProps, nextProps, internalHandle)

> This method should mutate the instance according to the set of changes in updatePayload.

Taro: 根据 updatePayload，将属性更新到 instance 中，此时 updatePayload 是一个类似 `[prop1, value1, prop2, value2, ...]` 的数组

> 如果 updatePayload 为 null，该方法在 React 内部不会被调用

### insertBefore(parentInstance, child, beforeChild)

> This method should mutate the parentInstance and place the child before beforeChild in the list of its children.

Taro: 调用 `parentInstance.insertBefore(child)` 即可

### insertInContainerBefore(container, child, beforeChild)

> Same as insertBefore, but for when a node is attached to the root container.

Taro: 调用 `container.insertBefore(child)` 即可

### removeChild(parentInstance, child)

> This method should mutate the parentInstance to remove the child from the list of its children.

Taro: 调用 `parentInstance.removeChild(child)` 即可

### removeChildFromContainer(container, child)

> Same as removeChild, but for when a node is detached from the root container.

Taro: 调用 `container.removeChild(child)` 即可

### resetTextContent(instance)

> If you never return true from shouldSetTextContent, you can leave it empty.

Taro: 该方法置空

### hideInstance(instance)

> This method should make the instance invisible without removing it from the tree.

Taro: `display` 样式置为 `none` 即可

### hideTextInstance(textInstance)

> Same as hideInstance, but for nodes created by createTextInstance.

Taro: `textInstance.nodeValue = ''` 即可

### unhideInstance(instance, props)

> This method should make the instance visible, undoing what hideInstance did.

Taro: `display` 样式重置即可

### unhideTextInstance(textInstance, text)

> Same as unhideInstance, but for nodes created by createTextInstance.

Taro: `textInstance.nodeValue = text` 即可

### clearContainer(container)

> This method should mutate the container root node and remove all children from it.

Taro: 将 `container` 所有孩子节点 `nodeValue` 置空即可
