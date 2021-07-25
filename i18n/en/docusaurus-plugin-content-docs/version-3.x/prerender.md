---
title: Prerender
---

Prerender is a technology provided by Taro CLI to improve the rendering speed of page initialization on the mini program side. It is implemented on the same principle as Server-side Rendering: the initialized state of the page is rendered directly as a stateless (dataless) wxml, and the rendering is performed before the framework and business logic run process. The initial rendering of a Prerender page is usually the same or faster than a native mini program.

## Why Prerender?

Taro Next goes through the following steps when a page is loaded.

1. the framework (React/Nerv/Vue) renders the page into the virtual DOM
2. Taro runtime serializes the page's virtual DOM into renderable data and uses `setData()` to drive page rendering
3. the mini program itself renders the serialized data

Compared to native mini program or compiled mini program frameworks, steps 1 and 2 are redundant. If there are no performance issues with the business logic code of the page, most of the performance bottlenecks are in `setData()` in step 2: since the initial rendering is the entire virtual DOM tree of the page, the amount of data is relatively large, so `setData()` needs to pass a relatively large amount of data, resulting in a white screen time when initializing the page. This usually happens when the number of wxml nodes for initial rendering of a page is large or when the user's machine performance is low.

## Using Prerender

Using Prerender is very simple, you can find the `config` folder in the root of your project and change any of the three [project configurations] `index.js`/`dev.js`/`prod.js` depending on your project (. /config.md), the Taro CLI will automatically start prerender at build time based on your configuration: `index.js`/`dev.js`/`prod.js`.

```js title="/config/index.js 或 /config/dev.js 或 /config/prod.js "
const config = {
  ...
  mini: {
    prerender: {
      match: 'pages/shop/**', // All pages starting with `pages/shop/` participate in prerender
      include: ['pages/any/way/index'], // `pages/any/way/index` will include prerender
      exclude: ['pages/shop/index/index'] // `pages/shop/index/index` will not prerender
    }
  }
};

module.exports = config
```

The complete Prerender configuration can be found in the following table: 

| Parameters | Type | Default | Required | Description |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| match  | `string` `string[]`  |   | NO | glob string or an array of glob strings, pages that match this parameter will be added to prerender |
|  include | `Array<string>` `Array<PageConfig>`  | `[]` | NO | Page paths that exactly match the string in the array are added to prerender
|  exclude | `string[]`  | `[]` | NO | Page paths that are identical to the string in the array **will not** be added to prerender
| mock  | `Record<string, unknown>`  |   |  NO | Global variables running in the prerender environment, with the key name as the variable name and the key value as the variable value
|  console | `boolean`  | `false`  |  NO | Whether the `console` print statement is executed in the prerender process
|  transformData | `Function`  |   |  NO | Custom virtual DOM tree processing function, the return value of the function will be used as an argument to `transformXML`
|  transformXML | `Function`  |   |  NO | Custom XML processing function that returns the wxml to be rendered by the end of the Taro runtime initialization

Types useful in the table.

```typescript
// PageConfig is the page parameter configured by the developer in prerender.includes
interface PageConfig {
  path: string // page path
  params: Record<string, unknown> // page's routing parameters. Corresponding to `getCurrentInstance().router.params`
}

// DOM tree data, which Taro renders dynamically by traversing it
interface MiniData {
  ["cn" /* ChildNodes */]: MiniData[]
  ["nn" /* NodeName */]: string
  ["cl" /* Class */]: string
  ["st" /* Style */]: string
  ["v" /* NodeValue */]: string
  uid: string
  [prop: string]: unknown
}

type transformData = (data: MiniData, config: PageConfig) => MiniData

type transformXML = (
  data: MiniData, 
  config: PageConfig,
  xml: string //xml strings that have already been processed by the built-in xml conversion function
) => string
```

All configuration options for Prerender are optional, in most cases you only need to focus on `match`, `include` and `exclude`, `match` and `include` are filled in at least once to match a pre-rendered page, all three can coexist, and when there is a match conflict the priority is `match` < `include` < `exclude`.

As with all technologies, Prerender is not a silver bullet, and the following trade-offs or limitations apply when using Prerender.

* The size of the page packing will increase. prerender is essentially a space-for-time technique, and the amount of increase in size depends on the amount of pre-rendered wxml.
* Until the real DOM and events are mounted by the Taro runtime (a process known as `hydrate` in server-side rendering), the pre-rendered pages do not do anything accordingly.
* Prerender does not perform lifecycles such as `componentDidMount()`(React)/`ready()`(Vue), in line with server-side rendering. If there is a need to process data, you can advance the lifecycle to `static getDerivedStateFromProps()`(React) or `created()`(Vue).

## Advanced Instructions And Use

### `PRERENDER` Global Variable

There is a global variable named `PRERENDER` in the pre-rendering container, which has the value `true`. You can write separate business logic for the pre-rendering period by determining whether this variable exists or not: 

```javascript
if (typeof PRERENDER !== 'undefined') { // The following code will only be executed in pre-rendering
  // do something
}
```

### disablePrerender

For any native component that does not need to be displayed in Prerender time, you can set the component's `disablePrerender` property to `true` and neither the component nor its descendants will be rendered as wxml strings.

```jsx
/* The component with id test and its descendants are not displayed during pre-rendering */
<View id="test" disablePrerender>
  ...children
</View>
```

### Custom Rendering

When the default pre-rendered results do not meet your expectations, Taro provides two configuration items to customize the pre-rendered content.

`transformData()` in the Prerender configuration operates on the virtual DOM to be rendered.

```javascript
const config = {
  ...
  mini: {
    prerender: {
      match: 'pages/**',
      tranformData (data, { path }) {
        if (path === 'pages/video/index') {
          // If the page is 'page/video/index' the page is only pre-rendered with a video component
          // For the data structure of data, see the data type signature above
          data.nn = 'video'
          data.cn = []
          data.src = 'https://v.qq.com/iframe/player.html?vid=y08180lrvth&tiny=0&auto=0'
          return data
        }

        return data
      }
    }
  }
}
```

The `transformXML()` in the Prerender configuration allows you to customize the pre-rendered output wxml.

```javascript
const config = {
  ...
  mini: {
    prerender: {
      match: 'pages/**',
      tranformXML (data, { path }, xml) {
        if (path === 'pages/video/index') {
          // If the page is 'page/video/index' the page will only pre-render a video component
          return `<video src="https://v.qq.com/iframe/player.html?vid=y08180lrvth&tiny=0&auto=0" />`
        }

        return xml
      }
    }
  }
}
```

### Reduce the number of pre-rendered wxml

In general, users only need to see the first page, but in fact the initial rendering of the page we build the business logic may render all the content of the page, and the reason for the slow initial rendering of Taro is that the amount of data passed for the first time is too large, so we can adjust our business logic to achieve the purpose of rendering only the first screen.

```jsx
class SomePage extends Component {
  state = {
    mounted: false
  }

  componentDidMount () {
    // Wait for the component to load, render the first screen first before we render the rest to reduce the amount of data for the first rendering
    // When mounted is true, the DOM trees of CompA, B, and C will only be rendered as data in the applet
    // Note that we need to do this in the `componentDidMount()` cycle (which corresponds to Vue's `ready()`), earlier in the lifecycle `setState()` will be merged and updated with the first rendered data
    // Use nextTick to ensure that this setState is not merged with the first render
    Taro.nextTick(() => {
      this.setState({
        mounted: true
      })
    })
  }

  render () {
    return <View>
      <FirstScreen /> /* Suppose we know that this component will take up all of the user's screen */
      {this.state.mounted && <React.Fragment> /* CompA, B, C it does not appear in the first screen at first */
        <CompA />
        <CompB />
        <CompC />
      </React.Fragment>}
    </View>
  }
}
```

In addition to speeding up first screen rendering and `hydrate`, this optimization also reduces the added wxml volume of Prerender. When your optimizations are thorough enough, you will find that Prerender is not needed in most cases.
