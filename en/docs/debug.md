---
title: Debug Guide
---

Like all frameworks, Taro may have bugs.When you think your code is not wrong and the problem is in Taro, you can debug the contents of this chapter.

当你在 Taro 进行 debug 时，请先确认一下流程均已完成：

1. ESLint is open and no errors are reported;
2. More or less than a document that includes[best practice](./best-practice.md)contains no description of the problem;
3. Related issues searched, issue does not mention relevant solutions;
4. View [changelog](https://github.com/NervJS/taro/blob/master/CHANGELOG.md)no comment in changelog on the Taro version used by the project to fix submissions on related issues;

Too often, as long as you move all four processes together, the problems encountered will be resolved.而作为一个多端框架，Taro 有非常多的模块，当出现问题时 Taro 也需要分模块进行调试，接下来我们会举一些已经解决了的 bug 样例，阐述我们调试 bug 的思路：

## Install

### Complete CLI errors with yarn

由于 [commander.js](https://github.com/tj/commander.js) 的[缘故](https://github.com/tj/commander.js/issues/786)，在 Mac 下使用 yarn 安装 CLI，偶尔会出现执行命令报错的情况

```bash
taro-init(1) does not exist, try --help
```

This time, you can choose to reinstall CLI using npm or cnpm or add CLI [to the environment variable to resolve](https://github.com/NervJS/taro/issues/2034)

### Project dependencies are never installed down

Due to the `@tarojs/webpack-runner` package by default `node-sass`, it is sometimes not possible to install it, here, it's recommended to use the pallion directly [cnpm](https://npm.taobao.org/) for install, or try on[this package](https://github.com/gucong3000/mirror-config-china)

## Applet

### There were no errors, but the results shown were less than expected

#### Filter by diff logic

This problem occurs when the page or component**updates**.

Taro will make state with data once [diff](https://nervjs.github.io/taro/docs/best-practice.html#小程序数据-diff) before calling on the applet's setData method.

If the state and data value of an attribute does not change, it is likely that the set data will not be rebuilt and the page or component is not updated correctly.

This type of problem appears more in tabular components of the applet, such as the two issues below：[#1981](https://github.com/NervJS/taro/issues/1981),[#22557](https://github.com/NervJS/taro/issues/2257).Since some form components of the applet are uncontrolled, the value data is not updated when the form is updated, the data is generated or initial.If this property is initial, no changes in the value of the diff logically determined property will be found in this property so the view is not updated.The correct approach is to use setData value as the current value in the update event of the form component, ensuring data is consistent with the form display value.

##### debug diff

The developer can find taro running library in the developer tool, interrupts or logs before and after the diff method, The query **state**,**applet data** and **diff will be set by setData**, which helps locate many**view update**questions.

![q20190305-151951](https://user-images.githubusercontent.com/11807297/53787956-514bb280-3f5b-11e9-9faf-f73ccd005222.png)

##### Micromessage applet, adding an array element cannot update the array correctly

When an array element is added, a path will be updated after the tag.However, because the miniature applet itself bug, the array will not be correctly updated when updating the array by path.See [#882](https://github.com/NervJS/taro/issues/882)

This problem arises only in the micromessaging applet,[official message is not fixed](https://developers.weixin.qq.com/community/develop/doc/000c8a7eeb45e8b018b72f01356800)

Recommended practice is a new state value to synchronize length changes.

#### Error compiling template

This is probably the time when there was an error in the compilation template.For example, in [#2285](https://github.com/NervJS/taro/issues/2258) , the subject writes two nested loops and cannot correctly access the first loop in the second loop with `index` variable：

```jsx
// Assume source code in src/pages/index/index.js
rooms. ap(room, index) => (
  <View key={room.id}>
    <View>room</View>
    <View className="men">
      {room. heckInMen. ap(man => (
        <View onClick={this.handleRemoveMan.bind(this, man.id, index)}>
          {man.name}
        </View>
      ))}
    </View>
  </View>
);
```

compiled `wxml` will be：

```html
<!-- 编译后代码代码至少会生成三个文件，分别是: -->
<!-- dist/pages/index/index.js，dist/pages/index/index.wxml，dist/pages/index/index.json -->
<view wx:for="{{loopArray0}}" wx:for-item="room" wx:for-index="index">
  <view>房间</view>
    <view class="men">
      <view  data-e-tap-a-b="{{index}}" bindtap="handleRemoveMan" wx:for="{{room.$anonymousCallee__0}}" wx:for-item="man" data-e-tap-so="this" data-e-tap-a-a="{{man.$original.id}}">{{man.$original.name}}
      </view>
    </view>
  </view>
</view>
```

Watch files before and after compilation. We can find：because the second loop does not specify `index` , nor does the Taro compilation loop specify `index` variable name.But the problem is that when the micromessage applet does not specify `index` , a variable name named `index` will be injected as `index`.So this code access `index`in the second loop is actually the current `index`, instead of the `index`.

Once we understand the problem, it is easy to solve the problem as long as the second variable of the loop is clearly revealed in the second cycle, the source code can be modified to：

```jsx
rooms. ap(room, index) => (
  <View key={room.id}>
    <View></View>
    <View className="men">
      {room. heckInMen. ap(man, _) => (
        <View onClick={this.handleRemoveMan.bind(this, man.id, index)}>
          {man.name}
        </View>
      )}
    </View>
  </View>
);
```

### Error reporting on applet developer tool while running

有时候我们会在运行时遇到这样错误：

![debug.png](https://i.loli.net/2019/02/27/5c765b5bc1915.png)

The debugging question is also simple. Just click on the stack link from the top of the stack. You can find it like this code：

![debug2.png](https://i.loli.net/2019/02/28/5c77517c622e3.png)

Here we can find this error because the variable `url` could not find the variable when calling the `Object.assign()` function. We can look again at the source：

```jsx
// 如果运行时报错文件路径是：dist/pages/test/test.js
// 那么就可以推算出源码在：src/pages/test/test.js
// 编译后的 js 文件已经经过 Babel 编译过，但函数基本上还是能一一对应的
// 除了 `render()` 函数会对应到 `_createData()` 函数，形如 `renderTest` 函数会对应到 `createTestData` 函数
render () {
  let dom = null
  if (this.props.visable) {
      const url = 'https://...'
      dom = <Image src={url} />
  }

  return <Container>
    {dom}
  </Container>
}
```

By observing the code before and after compilation, we can find that there is no problem with the source code, but Taro version of the problem does not handle the variables in the expression field if the expression is used, calling `Object.assign() when the function` is `url` the variable does not exist in the function domain `render` function.为了解决这个问题，我们可以修改源码，手动把 `url` 变量也放在 `render` 函数作用域中：

```jsx
render () {
  let dom = null
  let url = ''
  if (this). rops.visble) LO
      url = 'https://...
      DOM = <Image src={url} />
  }

  return <Container>
    {dom}
  </Container>
}
```

Most of the running errors can be explained by the internal Chrome DevTools of the applet. If the current call stack does not find the problem, then you can debug each stack by layer.Chrome DevTools related documents see：[Chrome Developer Tool](https://developers.google.com/web/tools/chrome-devtools/)

### Life/route/setState error

References in [#1814](https://github.com/NervJS/taro/issues/1814) to `this.$router.path` (path to current page route) is sometimes inaccessible.The reason found was that Taro placed the fetch function on the `onLoad` function of the applet, instead of every component being able to call to this function.The solution to this problem is simple. If the current page is a component that can be accessed directly through `this.$scope.route` the more general method is to access the current page example by `getCurrentPages` the function of which then visit the instance `route` or `__route__` the path to the current page route.

With this example, we can easily find Taro lifecycles/routes, and `setState` as a layer of glucose that is packaged into React API, which we call the Taro running time framework.Almost all of the API and syntax glucose provided by Taro is ultimately achieved through the API provided by the applet itself, that is to say, when there is a problem with the framework of Taro running, you can basically use the API provided by the applet itself, including but not limited to：

1. Use `this.$scope.riggerEvent` to call functions passed through props;
2. By `this.$scope.selectComponent` and `wx.createSelectorQuery` implement `ref`;
3. Access routing via related methods such as `getCurrentPages`;
4. Modify the created object of the compiled file `createComponent`

While there are many things that can be done by using a small aperture method, when there is a problem with the framework in Taro running, we strongly recommend developers to submit an issue [to Taro official](https://github.com/NervJS/taro/issues/new/choose)and capable developer friends can [PR](https://github.com/NervJS/taro/pulls).Using the Taro API to help you wipe out multiple differences, while looking for and even fixing bugs helps to improve your understanding of the bottom of Taro and the applet.

### Problem with MicroMessage Applet Form Component

微信小程序表单组件不是受控组件，当用户操作表单时视图会**立即改变**，但表单的 value 值还是没有变化。

If this type of form `onChange`,`onInput` changes setState value back to the previous value of the form used by the user to change the previous value of the form, Taro diff logic will determine setState value and current data. alue consistent, rule**relinquishes setData**, resulting in the view not being updated correctly.

Solutions：

The Input component can update the view by returning the value that needs to be changed in the callback.See [#2642](https://github.com/NervJS/taro/issues/2642)

Applet Input Component Document Screenshot：

![The meeting rose at 1.10 p.m.](https://user-images.githubusercontent.com/11807297/55405139-fcb44b00-558b-11e9-845f-afbc73863b48.png)

Other components need to be instantly `setState({ value: e.detail.value })` to update the synced data.value values immediately, then setState really needs to change the value of the form.See [#1981](https://github.com/NervJS/taro/issues/1981),[#2257](https://github.com/NervJS/taro/issues/2257)

### API issues

#### API call results do not meet expectations

The Taro applet API is simply promising the applet native API, with little extra action.因此开发者在遇到这种情况时可以试试直接使用小程序 API，如微信小程序中直接使用 `wx.xxx`。If there is a similar misstatement, it will prove to be a minor procedural problem.Otherwise this may be a Taro issue that can be asked about the issue.

#### API call error

假设开发者在调用某个 API `Taro.xxx`，出现类似以下报错：

![Image](https://user-images.githubusercontent.com/11807297/59170450-45324b00-8b71-11e9-8e25-1169b425040c.png)

Proof Taro is not yet compatible with this API, such as the most recent updates of some Applet Platforms.You can then ask us to add an issue or modify this file [native-apis.js](https://github.com/NervJS/taro/blob/master/packages/taro/src/native-apis.js) and give us a PR.

## H5

### Error running timed DOM

在 [#1804](https://github.com/NervJS/taro/issues/1804) 中提到，只要使用了 `Block` 组件并且有一个变量控制它的显式时，就必定会报错：

```jsx
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  };

  state = {
    num: 1
  };

  componentDidMount() {
    console.log('did');
    setTimeout(() => {
      this.setState({
        num: 0
      });
    }, 2000);
  }

  render() {
    const { num } = this.state;
    return (
      <View className="container">
        {num === 0 && <View>已卖完</View>}
        {num > 0 && (
          <Block>
            <View>正在销售</View>
            <View>立即购买</View>
          </Block>
        )}
        {/* {num > 0 && <View>正在销售</View>} */}
      </View>
    );
  }
}
```

这个时候我们可以把问题定位到 `Block` 组件中，我们可以查看 `@tarojs/components` 的 `Block` 组件源码：

  ```jsx
const Block = (props) =>  props.children
export default Block
```

也就是说当变量 `num > 0` 时，`Block` 组件的 `children` 会显示，而当 `Block` 组件的 `children` 是一个数组时，`View.container` 的 `children` 就变成 `[一个 View 组件, [一个数组]]`，渲染这样的数据结构需要 `React.Fragment` 的包裹才能渲染。Taro does not currently support the `React.Fragment` syntax, so this is miswritten.Solving this problem is also simple. Just modify `Block` component, use a single element to parse housing `children` to:

```jsx
const Block = (props) => <div>{props.children}</div>
```

当你遇到了相关问题时，我们准备了一个快速起步的沙盒工具，你可以直接在这个工具里编辑、调试、复现问题：

[![Edit Taro sandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/50nzv622z4?fontsize=14)
## Component

### jsEnginscriptError

`Component is not found in path "xx/xx/xxx"` Solutions：

Check if there is a compilation error

Check that compiled files are correct.

3, steps 1 and 2 jump to step 4 if there is no problem checking and reboot the developer tool

4- Screening of specific compilation of misinformation and compilation of documents

## Other resources

This paper lists some examples of solved bug in Taro, describing the thinking behind debug in Taro, but in practice it would be helpful to use Taro or debug if you had a deeper understanding of Taro's realism.以下资源从各个方面都介绍了 Taro 的实现原理：

* Gold Boolets：[Taro Multi-end Development Implementing Principles and Works](https://juejin.im/book/5b73a131f265da28065fb1cd?referrer=5ba228f16fb9a05d3251492d)
* Blog：[Taro Birthbook](https://aotu.io/notes/2018/06/25/the-birth-of-taro/)
* 公开演讲: [使用 Taro 快速开发多端项目](https://share.weiyun.com/5nUKYfy)
* Public lecture： [Multi-end project practice based on Taro](https://share.weiyun.com/5lZXV1G)
