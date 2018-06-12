# 最佳实践

## 全局变量

在 Taro 中推荐使用 `Redux` 来进行全局变量的管理，但是对于一些小型的应用， `Redux` 就可能显得比较重了，这时候如果想使用全局变量，推荐如下使用。

新增一个自行命名的 `JS` 文件，例如 `global_data.js`，示例代码如下

```javascript
const globalData = {}

export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
```

随后就可以在任意位置进行使用啦

```javascript
import { set as setGlobalData, get as getGlobalData } from './path/name/global_data'

setGlobalData('test', 1)

getGlobalData('test')
```
