---
title: Taro.loadFontFace(option)
sidebar_label: loadFontFace
---

Dynamically loads network fonts. The file URL must be a download URL. Only https URLs are supported for iOS.

**Note:**

1. When you use a Chinese font with an excessive volume, an error may occur. It is recommended to reduce Chinese characters or use pictures instead.
2. The font link must be an https URL. (http is not supported for iOS)
3. The font link must be of the same origin, or have enabled cors support. The domain name of the Mini Program is servicewechat.com.
4. Native components such as canvas do not support fonts added using APIs.
5. The "Faild to load font" prompt in the DevTools can be ignored.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/font/wx.loadFontFace.html)

## Type

```tsx
(option: Option) => void
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>global</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specify to enable global effect</td>
    </tr>
    <tr>
      <td>family</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Defined font name</td>
    </tr>
    <tr>
      <td>source</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The address of the font resource. The recommended formats are TTF and WOFF. WOFF2 is not compatible with older iOS versions.</td>
    </tr>
    <tr>
      <td>desc</td>
      <td><code>DescOption</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Available font descriptors</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### DescOption

object.desc is composed as follows

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>style</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Font style. Available values: normal/italic/oblique</td>
    </tr>
    <tr>
      <td>variant</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sets the font variant for small uppercase letters. Available values: normal/small-caps/inherit</td>
    </tr>
    <tr>
      <td>weight</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Font weight. Available values: normal/bold/100/200/900</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.loadFontFace({
  family: 'Bitstream Vera Serif Bold',
  source: 'url("https://sungd.github.io/Pacifico.ttf")',
  success: console.log
})
```

## API Support

| API | WeChat Mini Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.loadFontFace | ✔️ |  |  |
