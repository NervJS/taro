---
title: Static resource references
---

Static resources can be freely referenced in Taro as with [Webpack](https://webpack.js.org/) , and there is no need to install any Loaders.

## Referencing style files

Style files can be referenced directly via ES6's `import` syntax

For example, to reference a CSS file

```jsx
import './css/path/name.css'
```

Referencing SCSS files

```jsx
import './css/path/name.scss'
```

## Referencing JS files

JS files can be referenced directly via ES6's `import` syntax

```jsx
import { functionName } from './css/path/name.js'

import defaultExportName from './css/path/name.js'
```

## Referencing images, audio, fonts and other files

You can refer to such files directly through ES6's `import` syntax and use them directly in JSX after getting the file reference

```jsx

import namedPng from '../../images/path/named.png'

// Usage
<View>
  <Image src={namedPng} />
</View>
```

## Referencing JSON files

You can refer to such files directly through ES6's `import` syntax to get the JSON data output from the JSON file

```jsx
//  json file
/**
* named.json
* {
*   x: 1
* }
**/
import namedJson from '../../json/path/named.json'

console.log(namedJson.x)
```

## Reference to local resources in mini-program style

In the style of the mini-program, local resources cannot be referenced directly by default, but only by means of network addresses, Base64. To facilitate development, Taro provides a way to refer to local resources directly in the style file, the principle of which is through the `PostCSS` [`postcss-url`](https://github.com/postcss/postcss-url) , The plugin converts native resource references in the style to Base64 format so that they can be loaded properly.

Taro converts resources up to `1kb` in size by default, if you need to change the configuration, you can do so in `config/index.js`, which is located in [`weapp.module.postcss`](./config-detail.md#weappmodulepostcss)。

The specific configuration is as follows

```js title="/config/index.js"
// mini-prgram side styles referencing local resources inline
url: {
  enable: true,
  config: {
    limit: 10240 // Set upper limit of conversion size
  }
}
```
