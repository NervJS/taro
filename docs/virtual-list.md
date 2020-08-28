---
title: 长列表渲染（虚拟列表）
---

在典型的 Taro 应用中，正常的列表渲染遵循以下的逻辑：

1. 生成或从远程加载数据
2. 把数据加入框架的响应式数据中
3. 框架使用 diff 算法或其它机制根据数据的不同尝试全量更新视图
4. Taro 运行时捕获框架的更新请求更新视图

如果按照此逻辑，当第一步我们生成或加载的数据量非常大时就可能会产生严重的性能问题，导致视图无法响应操作一段时间。为了解决这个问题，我们可以采用另一种方式：比起全量渲染数据生成的视图，可以只渲染**当前可视区域(visible viewport)**的视图，非可视区域的视图在用户滚动到可视区域再渲染：

![virtual-list](https://web.dev/virtualize-long-lists-react-window/difference-in-scrolling.jpg)


## React/Nerv

使用 React/Nerv 我们可以直接从 `@tarojs/components/virtual-list` 引入虚拟列表（VirtualList）组件：

```js
import VirtualList from `@tarojs/components/virtual-list`
```

一个最简单的长列表组件会像这样，`VirtualList` 的 5 个属性都是必填项：

```jsx
function buildData (offset = 0) {
  return Array(100).fill(0).map((_, i) => i + offset);
}

const Row = React.memo(({ index, style, data }) => {
  return (
    <View className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
      Row {index} : {data[index]}
    </View>
  );
})

export default class Index extends Component {
  state = {
    data: buildData(0),
  }

  render() {
    const { data } = this.state
    const dataLen = data.length
    return (
      <VirtualList
        height={500} /* 列表的高度 */
        width='100%' /* 列表的宽度 */
        itemData={data} /* 渲染列表的数据 */
        itemCount={dataLen} /*  渲染列表的长度 */
        itemSize={100} /* 列表单项的高度  */
      >
        {Row} /* 列表单项组件，这里只能传入一个组件 */
      </VirtualList>
    );
  }
}
```

### 无限滚动

实现无限滚动也非常简单，我们只需要在列表滚动到底部时，往列表尾部追加数据即可：

```jsx
const Row = React.memo(({ index, style, data }) => {
  return (
    <View className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
      Row {index} : {data[index]}
    </View>
  );
})


function buildData (offset = 0) {
  return Array(100).fill(0).map((_, i) => i + offset);
}

export default class Index extends Component {
  state = {
    data: buildData(0),
  }

  loading = false

  listReachBottom() {
    Taro.showLoading()
    // 如果 loading 与视图相关，那它就应该放在 `this.state` 里
    // 我们这里使用的是一个同步的 API 调用 loading，所以不需要
    this.loading = true
    setTimeout(() => {
      const { data } = this.state
      this.setState({
        data: data.concat(buildData(data.length))
      }, () => {
        this.loading = false;
        Taro.hideLoading()
      })
    }, 1000)
  }

  render() {
    const { data } = this.state
    const dataLen = data.length
    const itemSize = 100
    return (
      <VirtualList
        className='List'
        height={500}
        itemData={data}
        itemCount={dataLen}
        itemSize={itemSize}
        width='100%'
        onScroll={({ scrollDirection, scrollOffset }) => {
          if (
            // 避免重复加载数据
            !this.loading &&
            // 只有往前滚动我们才触发
            scrollDirection === 'forward' &&
            // 5 = (列表高度 / 单项列表高度)
            // 100 = 滚动提前加载量，可根据样式情况调整
            scrollOffset > ((dataLen - 5) * itemSize + 100)
          ) {
            this.listReachBottom()
          }
        }}
      >
        {Row}
      </VirtualList>
    );
  }
}

```

### props

#### `children: ReactComponent`

将要渲染的列表单项组件。组件的 `props` 有 4 个属性：

* `style`: 单项的样式，样式必须传入组件的 `style` 中
* `data`: 组件渲染的数据，同虚拟列表 `itemData`
* `index`: 组件渲染数据的索引
* `isScrolling`: 组件是否正在滚动，当 `useIsScrolling` 值为 `true` 时返回布尔值，否则返回 `undefined`

推荐使用 `React.memo` 或 `React.PureComponent` 或使用 `shouldComponentUpdate()` 来优化此组件，避免不必要的渲染。


#### `itemCount: number`

列表的长度。必填。

#### `itemData: Array<any>`

渲染数据。必填。

#### `itemSize: number`

列表单项的大小，垂直滚动时为高度，水平滚动时为宽度。必填。

#### `height: number | string`

列表的高度。当滚动方向为垂直时必填。

#### `width: number | string`

列表的宽度。当滚动方向为水平时必填。

#### `className: string`

根组件 CSS 类

#### `style: Style`

根组件的样式

#### `initialScrollOffset: number = 0`

初始滚动偏移值，水平滚动影响 `scrollLeft`，垂直滚动影响 `scrollTop`。


#### `innerElementType: ReactElement = View`

列表内部容器组件类型，默认值为 `View`。此容器的 `parentNode` 是 `ScrollView`，`childNodes` 是列表。

#### `innerRef: Ref | Function`

列表内部容器组件的 ref。

#### `layout: string = 'vertical'`

滚动方向。`vertical` 为垂直滚动，`horizontal` 为平行滚动。默认为 `vertical`。

#### `onScroll: Function`

列表滚动时调用函数，函数的第一个参数为对象，由三个属性构成：

* `scrollDirection`，滚动方向，可能值为 `forward` 往前， `backward` 往后。
* `scrollOffset`，滚动距离
* `scrollUpdateWasRequested`, 当滚动是由 `scrollTo()` 或 `scrollToItem()` 调用时返回 `true`，否则返回 `false`

#### `onScrollNative: Function`

调用平台原生的滚动监听函数。

#### `overscanCount: number = 1`

在可视区域之外渲染的列表单项数量，值设置得越高，快速滚动时出现白屏的概率就越小，相应地，每次滚动的性能会变得越差。

#### `useIsScrolling: boolean`

是否注入 `isScrolling` 属性到 `children` 组件。这个参数一般用于实现滚动骨架屏（或其它 placeholder） 时比较有用。

#### 其它 `ScrollView` 组件的参数

除了以上参数，所有 `ScrollView` 组件的参数都可以传入 `VirtualList` 组件，冲突时优先使用以上文档描述的参数。

### 方法

通过 `React.createRef()` 创建 ref，挂载到 `VirtualList` 上可以访问到 `VirtualList` 的内部方法：

```jsx
export default class Index extends Component {
  state = {
    data: buildData(0),
  }

  list = React.createRef()

  componentDidMount() {
    const list = this.list.current
    list.scrollTo()
    list.scrollToItem()
  }

  render() {
    const { data } = this.state
    const dataLen = data.length
    return (
      <VirtualList
        height={500} /* 列表的高度 */
        width='100%' /* 列表的宽度 */
        itemData={data} /* 渲染列表数据 */
        itemCount={dataLen} /*  渲染列表的长度 */
        itemSize={100} /* 列表单项的高度  */
        ref={this.list}
      >
        {Row} /* 列表单项组件，这里只能传入一个组件 */
      </VirtualList>
    );
  }
}
```

#### `scrollTo(scrollOffset: number): void`

滚动到指定的地点。

#### `scrollToItem(index: number, align: string = "auto"): void`

滚动到指定的条目。

第二参数 `align` 的值可能为：

* `auto`: 尽可能滚动距离最小保证条目在可视区域中，如果已经在可视区域，就不滚动
* `smart`:  条目如果已经在可视区域，就不滚动；如果有部分在可视区域，尽可能滚动距离最小保证条目在可视区域中；如果条目完全不在可视区域，那就滚动到条目在可视区域居中显示
* `center`: 让条目在可视区域居中显示
* `end`: 让条目在可视区域末尾显示
* `start`: 让条目在可视区域末尾显示

## Vue

在 Vue 中使用虚拟列表，我们需要在入口文件声明使用：

```js
// app.js 入口文件
import Vue from 'vue'
import VirtualList from `@tarojs/components/virtual-list`

Vue.use(VirtualList)
```

一个最简单的长列表组件会像这样，`virtual-list` 的 5 个属性都是必填项：

```html
<! –– row.vue 单项组件 ––> 
<template>
  <view
    :class="index % 2 ? 'ListItemOdd' : 'ListItemEven'"
    :style="css"
  >
    Row {{ index }} : {{ data[index] }}
  </view>
</template>

<script>
export default {
  props: ['index', 'data', 'css']
}
</script>

<! –– page.vue 页面组件 ––> 
<template>
  <virtual-list
    wclass="List"
    :height="500"
    :item-data="list"
    :item-count="list.length"
    :item-size="100"
    :item="Row"
    width="100%"
  />
</template>

<script>
import Row from './row.vue'

function buildData (offset = 0) {
  return Array(100).fill(0).map((_, i) => i + offset)
}

export default {
  data() {
    return {
      Row,
      list: buildData(0)
    }
  },
}
</script>

```

### 无限滚动

实现无限滚动也非常简单，我们只需要在列表滚动到底部时，往列表尾部追加数据即可：

```html
<template>
  <virtual-list
    wclass="List"
    :height="500"
    :item-data="list"
    :item-count="dataLen"
    :item-size="itemHeight"
    :item="Row"
    width="100%"
    @scroll="onScroll"
  />
</template>

<script>
import Row from './row.vue'

function buildData (offset = 0) {
  return Array(100).fill(0).map((_, i) => i + offset)
}

export default {
  data() {
    return {
      Row,
      list: buildData(0),
      loading: false,
      itemHeight: 100
    }
  },
  computed: {
    dataLen () {
      return this.list.length
    }
  },
  methods: {
    listReachBottom() {
      Taro.showLoading()
      this.loading = true
      setTimeout(() => {
        const { data } = this.state
        this.setState({
          data: data.concat(buildData(data.length))
        }, () => {
          this.loading = false;
          Taro.hideLoading()
        })
      }, 1000)
    },
    onScroll({ scrollDirection, scrollOffset }) {
      if (
        // 避免重复加载数据
        !this.loading &&
        // 只有往前滚动我们才触发
        scrollDirection === 'forward' &&
        // 5 = (列表高度 / 单项列表高度)
        // 100 = 滚动提前加载量，可根据样式情况调整
        scrollOffset > ((this.dataLen - 5) * this.itemHeight + 100)
      ) {
        this.listReachBottom()
      }
    }
  }
}
</script>

```

### props

#### `item: VueComponent`

将要渲染的列表单项组件。组件的 `props` 有 4 个属性：

* `css`: 单项的样式，样式必须传入组件的 `style` 中
* `data`: 组件渲染的数据，同虚拟列表 `itemData`
* `index`: 组件渲染数据的索引
* `isScrolling`: 组件是否正在滚动，当 `useIsScrolling` 值为 `true` 时返回布尔值，否则返回 `undefined`


#### `itemCount: number`

列表的长度。必填。

#### `itemData: Array<any>`

渲染数据。必填。

#### `itemSize: number`

列表单项的大小，垂直滚动时为高度，水平滚动时为宽度。必填。

#### `height: number | string`

列表的高度。当滚动方向为垂直时必填。

#### `width: number | string`

列表的宽度。当滚动方向为水平时必填。

#### `wclass: string`

根组件 CSS 类

#### `wstyle: Style`

根组件的样式

#### `initialScrollOffset: number = 0`

初始滚动偏移值，水平滚动影响 `scrollLeft`，垂直滚动影响 `scrollTop`。


#### `innerElementType: string = 'view'`

列表内部容器组件类型，默认值为 `view`。此容器的 `parentNode` 是 `scroll-view`，`childNodes` 是列表。


#### `layout: string = 'vertical'`

滚动方向。`vertical` 为垂直滚动，`horizontal` 为平行滚动。默认为 `vertical`。

#### `v-on:scroll: Function`

列表滚动时调用函数，函数的第一个参数为对象，由三个属性构成：

* `scrollDirection`，滚动方向，可能值为 `forward` 往前， `backward` 往后。
* `scrollOffset`，滚动距离
* `scrollUpdateWasRequested`, 当滚动是由 `scrollTo()` 或 `scrollToItem()` 调用时返回 `true`，否则返回 `false`

#### `scrollNative: Function`

调用平台原生的滚动监听函数。注意调用传递此函数时使用的是 `v-bind` 而不是 `v-on`：

```html
<virtual-list
  wclass="List"
  :height="500"
  :item-data="list"
  :item-count="list.length"
  :item-size="100"
  :item="Row"
  width="100%"
  @scroll="onScroll"
  :scroll-native="onScrollNative"
/>
```

#### `overscanCount: number = 1`

在可视区域之外渲染的列表单项数量，值设置得越高，快速滚动时出现白屏的概率就越小，相应地，每次滚动的性能会变得越差。


#### `useIsScrolling: boolean`

是否注入 `isScrolling` 属性到 `item` 组件。这个参数一般用于实现滚动骨架屏（或其它 placeholder） 时比较有用。
