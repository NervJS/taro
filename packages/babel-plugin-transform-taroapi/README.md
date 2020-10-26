## babel-plugin-transform-taroapi

用于 H5 端转换 import default Taro API 为模块化引用，以达到 tree-shaking 的目的。

### example

```
import Taro from '@tarojs/taro'
Taro.request(...)
```

会转换为：

```
import { request } from '@tarojs/taro-h5'
request(...)
```
