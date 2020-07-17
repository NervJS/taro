---
title: Taro.loadFontFace(option)
sidebar_label: loadFontFace
id: version-2.1.1-loadFontFace
original_id: loadFontFace
---

动态加载网络字体。文件地址需为下载类型。iOS 仅支持 https 格式文件地址。

注意：
1. 字体文件返回的 contet-type 参考 [font](https://www.iana.org/assignments/media-types/media-types.xhtml#font)，格式不正确时会解析失败。
2. 字体链接必须是https（ios不支持http)
3. 字体链接必须是同源下的，或开启了cors支持，小程序的域名是`servicewechat.com`
4. canvas等原生组件不支持使用接口添加的字体
5. 工具里提示 Faild to load font可以忽略

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html)

## 类型

```tsx
(option: Option) => void
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>global</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否全局生效</td>
    </tr>
    <tr>
      <td>family</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>定义的字体名称</td>
    </tr>
    <tr>
      <td>source</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>字体资源的地址。建议格式为 TTF 和 WOFF，WOFF2 在低版本的 iOS 上会不兼容。</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>CompleteCallback</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>desc</td>
      <td><code>DescOption</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>可选的字体描述符</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>FailCallback</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>SuccessCallback</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### DescOption

可选的字体描述符

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>style</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>字体样式，可选值为 normal / italic / oblique</td>
    </tr>
    <tr>
      <td>variant</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>设置小型大写字母的字体显示文本，可选值为 normal / small-caps / inherit</td>
    </tr>
    <tr>
      <td>weight</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>字体粗细，可选值为 normal / bold / 100 / 200../ 900</td>
    </tr>
  </tbody>
</table>

### CompleteCallback

接口调用结束的回调函数（调用成功、失败都会执行）

```tsx
(result: CompleteCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CompleteCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### FailCallback

接口调用失败的回调函数

```tsx
(result: FailCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>FailCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### SuccessCallback

接口调用成功的回调函数

```tsx
(result: SuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>SuccessCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CompleteCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>status</td>
      <td><code>string</code></td>
      <td>加载字体结果</td>
    </tr>
  </tbody>
</table>

### FailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>status</td>
      <td><code>string</code></td>
      <td>加载字体结果</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>status</td>
      <td><code>string</code></td>
      <td>加载字体结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.loadFontFace({
  family: 'Bitstream Vera Serif Bold',
  source: 'url("https://sungd.github.io/Pacifico.ttf")',
  success: console.log
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.loadFontFace | ✔️ |  |  |
