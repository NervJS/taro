---
title: Design and Dimension unit
---

It is recommended to use `px`, ` %` for dimension units in Taro, Taro will convert all units by default. In Taro, the size is written in a 1:1 relationship, that is, if the length `100px` is measured from the design, then the size is written as `100px`, and when it is converted to WeChat mini-program, the size will be converted to `100rpx` by default, and when it is converted to H5, it will be converted to a value in `rem` by default.


If you want some of the `px` units not to be converted to `rpx` or `rem`, it is most convenient to add a capital letter to the px units, such as `Px` or `PX`, which will be ignored by the conversion plugin.

Taro defaults to `750px` as the conversion size standard, if the design is not `750px`, you need to set it in the project configuration `config/index.js`, for example, if the design size is `640px`, you need to modify the ` designWidth` to `640`.

```jsx title="/config/index.js"
const config = {
  projectName: 'myProject',
  date: '2018-4-18',
  designWidth: 640,
  ....
}
```

Taro supports `750`, `640` and `828` sizes and their conversion rules are as follows.

```jsx
const DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2
}
```

When using Taro, it is recommended to use iPhone 6 `750px` as the design size standard.

If your design is `375`, which is not one of the three above, then you need to configure `designWidth` to `375` and add the conversion rule in `DEVICE_RATIO` as follows.

```jsx {5}
const DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2,
  '375': 2 / 1
}
```

## API

During compilation, Taro will do the size conversion for you, but if you write inline styles in JS, you can't do the replacement. 
In this case, Taro provides the API `Taro.pxTransform` to do the size conversion at runtime.

```jsx
Taro.pxTransform(10) 
```

## Configuration

The default configuration converts all `px` units, and `Px` or `PX` with uppercase letters are ignored.

The default values of the parameters are as follows：

```js
{
  onePxTransform: true,
  unitPrecision: 5,
  propList: ['*'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
}
```

Type: `Object | Null`

### `onePxTransform` (Boolean)

Set whether 1px needs to be converted

### `unitPrecision` (Number)

The number of decimal places allowed in the REM unit.

### `propList` (Array)

The property that allows the conversion.

- Values need to be exact matches.
- Use wildcard `*` to enable all properties. Example: `['*']`
- Use `*` at the start or end of a word. (`['*position*']` will match `background-position-y`)
- Use `!` to not match a property. Example: `['*', '!letter-spacing']`
- Combine the "not" prefix with the other prefixes. Example: `['*', '!font*']`

### `selectorBlackList`

Selectors in the blacklist will be ignored.

- If value is string, it checks to see if selector contains the string.
  - `['body']` will match `.body-class`
- If value is regexp, it checks to see if the selector matches the regexp.
  - `[/^body$/]` will match `body` but not `.body`

### `replace` (Boolean)

Replace directly instead of appending an entry to override.

### `mediaQuery` (Boolean)

Allow px unit conversion in media queries

### `minPixelValue` (Number)

Set a minimum px value that can be converted

The configuration rules correspond to `config/index.js`, e.g.

```js {9-14,20-25} title="/config/index.js"
{
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body']
        }
      }
    }
  },
  mini: {
    // ...
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body']
        }
      }
    }
  }
}
```

## CSS Compile-time ignores

### Ignore single attributes

The simplest way to ignore individual attributes currently is to use capital letters for px units.

```css
 /* `px` is converted to `rem` */
.convert {
  font-size: 16px; // converted to 1rem
}

 /* `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers */
.ignore {
  border: 1Px solid; // ignored
  border-width: 2PX; // ignored
}
```

### Ignore style files

The plugin does not handle files with the comment `/*postcss-pxtransform disable*/` in the header.

### Ignore style examples

When multiple lines of text are omitted from a style file we generally use the following code.

```css {3}
.textHide {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;
  text-overflow: ellipsis;
  overflow: hidden;
}
```

However, Taro is compiled without the `-webkit-box-orient: vertical;` style attribute, so we need to ignore this style

####  Add a CSS comment to force the declaration to ignore the next line

```css {1}
/* autoprefixer: ignore next */
-webkit-box-orient: vertical;
```

#### Add CSS comments to force the declaration of multiple lines in between comments

```css {1,3}
/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
```

#### Write as in-line style

```HTML {2-9}
<View 
  style={{
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'line-height': 2
  }}
>
  This is the content to be omitted
</View>
```

### Links

- [Taro multi-line text omission does not work](https://taro-club.jd.com/topic/2270/taro%E5%A4%9A%E8%A1%8C%E6%96%87%E6%9C%AC%E7%9C%81%E7%95%A5%E4%B8%8D%E7%94%9F%E6%95%88)