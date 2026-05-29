# 暂不支持在 render() 之外的方法定义 JSX

由于微信小程序的 `template` 不能动态传值和传入函数，Taro 暂时也没办法支持在类方法中定义 JSX。


## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
class App extends Component {
  _render() {
    return <View />
  }
}

class App extends Component {
  renderHeader(showHeader) {
    return showHeader && <Header />
  }
}

class App extends Component {
  renderHeader = (showHeader) => {
    return showHeader& & <Header />
  }
}
```

## 解决方案

在 `render` 方法中定义。

```javascript
class App extends Component {

  render () {
    const { showHeader, showMain } = this.state
    const header = showHeader && <Header />
    const main = showMain && <Main />
    return (
      <View>
        {header}
        {main}
      </View>
    )
  }
}
```

当测试用例和线上项目都检测通过时，Taro 将很快（下一个 Minor 版本）支持这一特性。
