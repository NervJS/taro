# 不能在 JSX 参数中使用匿名函数(taro/no-anonymous-function-in-props)

详情请看文档 [事件处理](https://nervjs.github.io/taro/event.html)。

## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
<View onClick={() => this.handleClick()} />

<View onClick={(e) => this.handleClick(e)} />

<View onClick={() => ({})} />

<View onClick={function () {}} />

<View onClick={function (e) {this.handleClick(e)}} />
```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
<View onClick={this.hanldeClick} />

<View onClick={this.props.hanldeClick} />

<View onClick={this.hanldeClick.bind(this)} />

<View onClick={this.props.hanldeClick.bind(this)} />
```

## 解决方案

使用 [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 或 [类参数](https://babeljs.io/docs/plugins/transform-class-properties/)绑定函数。

```javascript
<View onClick={this.props.hanldeClick.bind(this)} />
```

当测试用例和线上项目都检测通过时，Taro 将很快（下一个 Minor 版本）支持这一特性。
