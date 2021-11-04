---
title: React Native Development Considerations
---

:::tip Taro 3 requires version 3.1 or higher
:::

React Native's styles are based on the open source cross-platform layout engine [Yoga](https://github.com/facebook/yoga) ,  which basically implements a subset of CSS, and the property names are not identical, so when you start thinking about compatibility with the React Native side, you can take a brief look at A quick look at React Native styles. [React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)

Style layout on H5 is the most flexible, the next mini program, RN is the strongest, unified  style that is aligned with the short board, that is, to manage the style with the constraints of RN, while taking into account the limitations of the mini program, the core can be summarized in three points.

- Layout with Flex
- Writing styles based on BEM
- Overriding component styles with the style attribute


## 一、Layout

### flex

Flexbox rules are used in React Native to specify the layout of a component's child elements. flexbox can provide a consistent layout structure across screen sizes. So if you're thinking about the React Native, then your style layout will have to be a Flex layout.

For an introduction to Flex layouts, check out ruanyifeng [Flex Layout Tutorial: Syntax](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

Note: **The default orientation of the View tag in RN is column**. If you don't change the other ends to be consistent with RN, you need to explicitly declare the orientation of the main axis in all places where display: flex is used.

### position

In React Native position only supports two properties, `relative` (default) and `absolute`. You can [see the documentation](https://reactnative.dev/docs/0.60/layout-props#position)


## 二、Styles

### Selectors

> Only class selectors are supported on the React Native side, and **combinators** are not supported  [Combinators and groups of selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Combinators_and_multiple_selectors)。

The following selectors are written in a way that they are not supported and will be automatically ignored during style conversions.

```css
.button.button_theme_islands {
  font-style: bold;
}

img + p {
  font-style: bold;
}

p ~ span {
  color: red;
}

div > span {
  background-color: DodgerBlue;
}

div span {
  background-color: DodgerBlue;
}
```

If we develop based on a pre-compiled language such as `scss`, we can write styles based on [BEM](https://getbem.com/) eg:

```jsx
<View className="block">
    <Text className="block__elem">Text</Text>
</View>
```

```css
.block: {
    background-color: DodgerBlue;
    &__elem {
        color: yellow;
    }
}
```

### Conditional compilation of styles

> 1.3+ Versions Supported

#### Conditional compilation of style files

Suppose the following files exist in the directory at the same time.

```
- index.scss
- index.rn.scss
```

When referencing a style file in a JS file: `import '. /index.scss'`, the RN platform will find and introduce `index.rn.scss`, and other platforms will introduce: `index.scss`, which is convenient for you to write cross-end style and better compatible with RN.

#### Conditional compilation of style code

To make it easier to write style code across styles, the style conditional compilation feature has been added.

Designated platform reserved: 

```scss
/*  #ifdef  %PLATFORM%  */
style code
/*  #endif  */
```

Designated platform exclusion.

```scss
/*  #ifndef  %PLATFORM%  */
style code
/*  #endif  */
```

Multiple platforms can be separated by spaces.

### Global introduction of styles

- 1. The style introduced in the entry file app.js is the global style, and the local style will override the global style.
- 2. Global injection through configuration 
```js
// config/index.js
...
const config = {
    ...
    sass: {
        resource: [
            'src/styles/common.scss'
        ]
    }
}

```

# 三、Navigation

React Native Navigation is encapsulated in React-Navigation 5.x. To better facilitate business customization, the configuration of React Navigation is passed through in the global and page configuration, but note that the following navigation-related settings Taro 3.x are in effect.

### Global Configuration  

A separate configuration for rn navigation can be added in the global configuration app.config.js

```js
// To have an impact on the other side, it is better to add environmental judgments

let rnConfig = {}

if(process.env.TARO_ENV === 'rn'){
  rnConfig = {
  //deep Linking perfix, https://reactnavigation.org/docs/deep-linking
  linking:[],
  //tabBar page config ，https://reactnavigation.org/docs/bottom-tab-navigator/#tabbar options config，the following property pass-through is supported, and the scheme that returns the react.Node node settings is not supported
   options:{
      title，
      tabBarVisible，
      tabBarBadge，
      tabBarBadgeStyle，
      tabBarTestID
   },
   tabBarOptions:{//tabbarOptions config ,other see https://reactnavigation.org/docs/bottom-tab-navigator/#tabbar tabBarOptions
       
   },
   screenOptions:{//Global screenOptions， which works on non-all pages, note that it does not support returning React. For more references https://reactnavigation.org/docs/stack-navigator/#options
       
   }
  }
}

export default {
  pages:[
    'pages/index/index',
  ],
  rn:rnConfig
}
```

### Page Config

In addition to the global settings page, you can also set up a page individually.
```js
// page config
rn:{
  screenOptions:{// set curernt page options，For more references https://reactnavigation.org/docs/stack-navigator/#options
        
    }
}
```
>  There are some things to note about the configuration of pass-through react navigation.
>  - Directly passing in parameters of React.Node nodes is not supported
>  - The style object passed in is a React Native style such as tabStyle:{ backgroundColor :'#ff0000'}
> - rn's configuration takes precedence over other configurations, e.g. if the selectedColor is configured in the unified tabBar and activeTintColor in rn's configuration, then the activeTintColor is the one that takes effect

 
## Frequently Asked Questions

### 1. Can box-shadow be implemented?

> React Native doesn't support this well (only ios supports it and to a limited extent), and the only way to set the gray shadows on the android side is through `elevation`.

```css
{
    /* Shadow related properties */
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: Color.CMHeaderBgColor,
    /* android gray shadows */
    elevation: 4,
}
```

### 2、border{Top,Right,Bottom,Left} not supported ? 

The shorthand for border{Top,Right,Bottom,Left} (shorthands) is not supported, because `borderStyle` cannot be applied to a single border.

Use sass：

```scss
/**
 * // NOTE Taro has a problem with border handling when compiling to RN
 * RN does not support setting style for one side, i.e. border-bottom-style will report an error.
 * Then border-bottom: 1px would need to be written as follows.
 * border: 0 style color; border-bottom-width: 1px;
 */
@mixin border($dir, $width, $style, $color) {
  border: 0 $style $color;
  @each $d in $dir {
    #{border-#{$d}-width}: $width;
  }
}
```

### 3. React Native doesn't support background-image, is there any solution?s

Using the `Image component`, in conjunction with the Flex/Position layout, will basically accomplish most of your needs. Read this article.[Background Images in React Native](https://thekevinscott.com/background-images-in-react-native/)


## Support for each property

React Native's styles are based on the open source cross-platform layout engine [Yoga](https://github.com/facebook/yoga), The style is basically a subset of CSS, but the property names are not identical, so check the documentation for details and differences [React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)。

### Text （18）

| Property Name | Value   | Description  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color                                        | [&lt;color&gt;](#user-content-color)                                                                     | Corresponds to `CSS` [color](https://css.doyoe.com/properties/color/color.htm) property                                                                                                             |
| fontFamily                                   | string                                                                                                   | Corresponds to `CSS` [font-family](https://css.doyoe.com/properties/font/font-family.htm)   property                                                                                                                                                             |
| fontSize                                     | [&lt;number&gt;](#user-content-number)                                                                   | Corresponds to `CSS` [font-size](https://css.doyoe.com/properties/font/font-size.htm) property                                                                                                                                                                                    |
| fontStyle                                    | `normal`, `italic`                                                                                       | 对应 `CSS` [font-style](https://css.doyoe.com/properties/font/font-style.htm) 属性，但阉割了 `oblique` 取值                                                                                                                                                             |
| fontWeight                                   | `normal`, `bold` `100~900`                                                                               | Corresponds to `CSS` [font-weight](https://css.doyoe.com/properties/font/font-weight.htm) property，But the `bolder, lighter` fetch is neutered                                                                                                                                                        |
| lineHeight                                   | [&lt;number&gt;](#user-content-number)                                                                   | Corresponds to `CSS` [line-height](https://css.doyoe.com/properties/text/line-height.htm) property                                                                                                                                                                                |
| textAlign                                    | `auto`, `left`, `right`, `center`, `justify`<sup>`iOS`</sup>                                             | Corresponds to `CSS` [text-align](https://css.doyoe.com/properties/text/text-align.htm) property,Added `auto` fetch value. When the value is `justify`, it will change to `left` on `Android`.                                          |
| textDecorationLine                           | `none`, `underline`, `line-through`, `underline line-through`                                            | Corresponds to `CSS` [text-decoration-line](https://css.doyoe.com/properties/text-decoration/text-decoration-line.htm) property，But the `bolder, lighter` fetch is neutered                                                              |
| textShadowColor                              | [&lt;color&gt;](#user-content-color)                                                                     | Corresponds to `CSS` [text-shadow](https://css.doyoe.com/properties/text-decoration/text-shadow.htm) the color definition in the properties                                                                                                                                      |
| textShadowOffset                             | {<br />width:[&lt;number&gt;](#user-content-number),<br />height:[&lt;number&gt;](#user-content-number)<br />} | Corresponds to `CSS` [text-shadow](https://css.doyoe.com/properties/text-decoration/text-shadow.htm) shadow offset definition in the properties                                                                                                                                                                |
| textShadowRadius                             | [&lt;number&gt;](#user-content-number)                                                                   | In `CSS`, the size of the rounded corners of the shadow depends on the element's rounded corner definition and does not need to be defined additionally                                                                                                                                                                                                         |
| includeFontPadding<br /><sup>`Android`</sup> | [&lt;bool&gt;](#user-content-bool)                                                                       | By default, Android reserves some extra padding for text to allow room for superscript or subscript text. For some fonts, this extra padding may make it difficult to center the text vertically. If you set `textAlignVertical` to `center` and the text still looks off-center, try setting this property to `false`.  |
| textAlignVertical<br /><sup>`Android`</sup>  | `auto`, `top`, `bottom`, `center`                                                                        | Corresponds to  `CSS` [vertical-align](https://css.doyoe.com/properties/text/vertical-align.htm) property, Added `auto` fetch, `center` replaces `middle`, and neutered `baseline, sub` and other values                                                                         |
| fontVariant<br /><sup>`iOS`</sup>            | `small-caps`, `oldstyle-nums`, `lining-nums`, `tabular-nums`, `proportional-nums`                        | Corresponds to `CSS` [font-variant](https://css.doyoe.com/properties/font/font-variant.htm) property, but which has more values                                                                                                                                                       |
| letterSpacing<br /><sup>`iOS`</sup>          | [&lt;number&gt;](#user-content-number)                                                                   | Corresponds to `CSS` [letter-spacing](https://css.doyoe.com/properties/text/letter-spacing.htm) property                                                                                                                                                           |
| textDecorationColor<br /><sup>`iOS`</sup>    | [&lt;color&gt;](#user-content-color)                                                                     | Corresponds to `CSS` [text-decoration-color](https://css.doyoe.com/properties/text-decoration/text-decoration-color.htm) property                                                                                                                                                    |
| textDecorationStyle<br /><sup>`iOS`</sup>    | `solid`, `double`, `dotted`, `dashed`                                                                    | Corresponds to `CSS` [text-decoration-style](https://css.doyoe.com/properties/text-decoration/text-decoration-style.htm) propery, But the `wavy` fetch is neutered                                                                                                                                   |
| writingDirection<br /><sup>`iOS`</sup>       | `auto`, `ltr`, `rtl`                                                                                     | Corresponds to `CSS` [direction](https://css.doyoe.com/properties/writing-modes/direction.htm) propery, Added `auto` fetch value                                                                                                                                                                     |

<a name="dimension"></a>


### Dimension (6)


| Propery Name   | Values                                   | Description                                                                                  |
| --------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| width     | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [width](https://css.doyoe.com/properties/dimension/width.htm) propery           |
| minWidth  | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [min-width](https://css.doyoe.com/properties/dimension/min-width.htm) propery   |
| maxWidth  | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [max-width](https://css.doyoe.com/properties/dimension/max-width.htm) propery   |
| height    | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [height](https://css.doyoe.com/properties/dimension/height.htm) propery         |
| minHeight | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [min-height](https://css.doyoe.com/properties/dimension/min-height.htm) propery |
| maxHeight | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [max-height](https://css.doyoe.com/properties/dimension/max-height.htm) propery |

<a name="positioning"></a>

### Positioning （6）

| Propery Name   | Values                                     | Description                                                                                                               |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| position | `absolute`, `relative`                 | Corresponds to `CSS` [position](https://css.doyoe.com/properties/positioning/position.htm) propery, but without the `static, fixed` fetch |
| top      | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [top](https://css.doyoe.com/properties/positioning/top.htm) propery                                          |
| right    | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [right](https://css.doyoe.com/properties/positioning/right.htm) propery
| bottom   | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [bottom](https://css.doyoe.com/properties/positioning/bottom.htm) propery
| left     | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [left](https://css.doyoe.com/properties/positioning/left.htm) propery
| zIndex   | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [z-index](https://css.doyoe.com/properties/positioning/z-index.htm) propery

<a name="margin"></a>

### Margin（7）

| Propery Name           | Values                                   | Description                                                                                                            |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| margin           | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [margin](https://css.doyoe.com/properties/margin/margin.htm) property, the difference is that it can only define one parameter, if you want to define the external white of `top, right, bottom and left` 4 directions respectively, you can use the following one-way external white property |
| marginHorizontal | [&lt;number&gt;](#user-content-number) |No corresponding `CSS` property. The effect is equivalent to setting both `marginRight` and `marginLeft`                                                                                                      |
| marginVertical   | [&lt;number&gt;](#user-content-number) | No corresponding `CSS` property. The effect is equivalent to setting both `marginTop` and `marginBottom`                                                                  |
| marginTop        | [&lt;number&gt;](#user-content-number) |  Corresponds to `CSS` [margin-top](https://css.doyoe.com/properties/margin/margin-top.htm) property                              |
| marginRight      | [&lt;number&gt;](#user-content-number) |  Corresponds to `CSS` [margin-right](https://css.doyoe.com/properties/margin/margin-right.htm) property                       |
| marginBottom     | [&lt;number&gt;](#user-content-number) |  Corresponds to `CSS` [margin-bottom](https://css.doyoe.com/properties/margin/margin-bottom.htm) property                  |
| marginLeft       | [&lt;number&gt;](#user-content-number) |  Corresponds to `CSS` [margin-left](https://css.doyoe.com/properties/margin/margin-left.htm) property                          |

<a name="padding"></a>

### Padding（7）

| Propery Name             | Values                   | Description                                                                                                                              |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| padding           | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [padding](https://css.doyoe.com/properties/padding/padding.htm) property, The difference is that it can only define one parameter, if you want to define the internal white of `top, right, bottom and left` 4 directions respectively, you can use the following one-way internal white property |
| paddingHorizontal | [&lt;number&gt;](#user-content-number) | There is no corresponding `CSS` property. This has the effect of setting both `paddingRight` and `paddingLeft` at the same time                                                                              |
| paddingVertical   | [&lt;number&gt;](#user-content-number) | No corresponding `CSS` property. The effect is equivalent to setting both `paddingTop` and `paddingBottom`.                                                                  |
| paddingTop        | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [padding-top](https://css.doyoe.com/properties/padding/padding-top.htm) property                            |
| paddingRight      | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [padding-right](https://css.doyoe.com/properties/padding/padding-right.htm) property                   |
| paddingBottom     | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [padding-bottom](https://css.doyoe.com/properties/padding/padding-bottom.htm) property                |
| paddingLeft       | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` [padding-left](https://css.doyoe.com/properties/padding/padding-left.htm) property                                                                                                |

### Border （20）

| Propery Name   | Values   | Description  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| borderStyle             | `solid`, `dotted`, `dashed`                                                                                 | Corresponds to `CSS` `border-style` property，but with fewer  `none, hidden, double, groove, ridge, inset, outset` fetch values and no direction splitting property |
| borderWidth             | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-width` property                                               |
| borderTopWidth          | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-top-width` property                                      |
| borderRightWidth        | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-right-width` property                                  |
| borderBottomWidth       | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-bottom-width` property                                |
| borderLeftWidth         | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-left-width` property                                    |
| borderColor             | [&lt;color&gt;](#user-content-color)                                                                        | Corresponds to `CSS` `border-color` property                                             |
| borderTopColor          | [&lt;color&gt;](#user-content-color)                                                                        | Corresponds to `CSS` `border-top-color` property                                     |
| borderRightColor        | [&lt;color&gt;](#user-content-color)                                                                        | Corresponds to `CSS` `border-right-color` property                                 |
| borderBottomColor       | [&lt;color&gt;](#user-content-color)                                                                        | Corresponds to `CSS` `border-bottom-color` property                               |
| borderLeftColor         | [&lt;color&gt;](#user-content-color)                                                                        | Corresponds to `CSS` `border-left-color` property                                  |
| borderRadius            | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-radius` property                                            |
| borderTopLeftRadius     | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-top-left-radius` property                                    |
| borderTopRightRadius    | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-top-right-radius` property                       |
| borderBottomLeftRadius  | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-bottom-left-radius`property                     |
| borderBottomRightRadius | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` `border-bottom-right-radius` property                  |
| shadowColor             | [&lt;color&gt;](#user-content-color)                                                                        | Corresponds to `CSS` [box-shadow](https://css.doyoe.com/properties/border/box-shadow.htm) the color definition in the property                      |
| shadowOffset            | {<br />width: [&lt;number&gt;](#user-content-number), <br />height: [&lt;number&gt;](#user-content-number)<br />} | Corresponds to `CSS` [box-shadow](https://css.doyoe.com/properties/border/box-shadow.htm) shadow offset definition in the properties                 |
| shadowRadius            | [&lt;number&gt;](#user-content-number)                                                                      | In `CSS`, the size of the rounded corners of the shadow depends on the element's rounded corner definition and does not need to be defined additionally                                                      |
| shadowOpacity           | [&lt;number&gt;](#user-content-number)                                                                      | Corresponds to `CSS` [box-shadow](https://css.doyoe.com/properties/border/box-shadow.htm) shadow transparency definition in the properties                |

<a name="background"></a>

### Background (1)
| Propery Name   | Values   | Description |
| --------------- | ------------------------------------ | ---------------------------------- |
| backgroundColor | [&lt;color&gt;](#user-content-color) | Corresponds to `CSS` `background-color` propery |

<a name="transform"></a>

### Transform （3）

| Propery Name   | Values   | Description |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| transform          | `[{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}, {skewX: string}, {skewY: string}]` | Corresponds to `CSS` `transform` property                                        |
| transformMatrix    | `TransformMatrixPropType`    | Similar to the `matrix()` and `matrix3d()` functions of the `transform` property in `CSS` |
| backfaceVisibility | `visible`, `hidden`    | Corresponds to `CSS` `backface-visibility` propery                              |

<a name="flexbox"></a>

### Flexbox （9）

We use Flexbox rules in React Native to specify the layout of a component's child elements, and Flexbox provides a consistent layout structure across screen sizes.

In general, most layout needs are met using the `flexDirection`, `alignItems`, and `justifyContent` style properties.

#### Flex number

In React Native, flex behaves a bit differently than CSS. flex can only be an integer value in RN, please refer to the [yoga engine](https://github.com/facebook/yoga) documentation for details

| Conditions             | Performance                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| When flex is set to a positive integer, e.g. `flex: 1` | The component is flexible and the size is proportional to the value of flex                         |
| `flex:0`                          | The component is not flexible, and the size and width and height are consistent                   |
| `flex: -1`                        | If there is enough space, the size of the component is the same as width and height; however, when there is not enough space, the component is compressed to minWidth and minHeight |



#### Flex Direction

Specifying flexDirection in the component's style determines the main axis of the layout. Should the child elements be aligned along the `horizontal axis (row)` or along the `vertical axis (column)`? **The default value is `column` direction**, which is different from CSS and should be noted.

#### Justify Content

Specifying justifyContent in the component's style determines how its child elements are arranged along the main axis. Should the child elements be distributed close to the beginning or the end of the main axis? Or should they be evenly distributed? The options are: `flex-start`, `center`, `flex-end`, `space-around` and `space-between`.

#### Align Items

Specifying alignItems in the component's style determines how its child elements are arranged along the secondary axis (the axis perpendicular to the major axis, e.g. if the major axis is row, the secondary axis is column). Should the child elements be distributed near the beginning or the end of the secondary axis? Or should they be evenly distributed? The options are: `flex-start`, `center`, `flex-end` and `stretch`.


| Propery Name   | Values   | Description                |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| flex           | [&lt;number&gt;](#user-content-number)                              | Corresponds to `CSS` `flex` property，But only as integer values    |
| flexGrow       | [&lt;number&gt;](#user-content-number)                              | Corresponds to `CSS` `flex-grow` property                                  |
| flexShrink     | [&lt;number&gt;](#user-content-number)                              | Corresponds to `CSS` `flex-shrink` property                                |
| flexBasis      | [&lt;number&gt;](#user-content-number)                              | Corresponds to `CSS` `flex-basis` property                                 |
| flexDirection  | `row`, `row-reverse`, `column`, `column-reverse`                    | Corresponds to `CSS` `flex-direction` property                             |
| flexWrap       | `wrap`, `nowrap`                                                    | Corresponds to `CSS` `flex-wrap` property, but the `wrap-reverse` fetch is missing   |
| justifyContent | `flex-start`, `flex-end`, `center`, `space-between`, `space-around` | Corresponds to `CSS` `justify-content` property，but the `stretch` fetch is missing |
| alignItems     | `flex-start`, `flex-end`, `center`, `stretch`                       | Corresponds to `CSS` `align-items` property，but the `baseline` fetch is missing |
| alignSelf      | `auto`, `flex-start`, `flex-end`, `center`, `stretch`               | Corresponds to `CSS` `align-self` property，but the `baseline` fetch is missing |

### Other 

| Propery Name   | Values   | Description  |
| -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| opacity    | [&lt;number&gt;](#user-content-number) | Corresponds to `CSS` `opacity` property   |
| overflow     | `visible`, `hidden`, `scroll`          | Corresponds to `CSS` `overflow` property, but the `auto` fetch is missing                     |
| elevation<br /><sup>`Android`</sup>    | [&lt;number&gt;](#user-content-number) | No corresponding property in `CSS`, only available on `Android 5.0+`                   |
| resizeMode       | `cover`, `contain`, `stretch`   | There is no equivalent property in `CSS`, you can refer to the `background-size` property           |
| overlayColor<br /><sup>`Android`</sup> | string                                 | There is no equivalent property in `CSS` to fill the corners with a color when the image has rounded corners   |
| tintColor<br /><sup>`iOS`</sup>        | [&lt;color&gt;](#user-content-color)   | No corresponding property in `CSS`, special color on `iOS` images, change color of opaque pixels |

#### Color 

`React Native` supports most of the color types in `CSS`.

- `#f00` (#rgb)
- `#f00c` (#rgba)：No corresponding value in `CSS`
- `#ff0000` (#rrggbb)
- `#ff0000cc` (#rrggbbaa)：No corresponding value in `CSS`
- `rgb(255, 0, 0)`
- `rgba(255, 0, 0, 0.9)`
- `hsl(360, 100%, 100%)`
- `hsla(360, 100%, 100%, 0.9)`
- `transparent`
- `0xff00ff00` (0xrrggbbaa)：No corresponding value in `CSS`
- `Color Name`：Support to [Basic color keywords](https://css.doyoe.com/appendix/color-keywords.htm#basic) and [Expanded color keywords](https://css.doyoe.com/appendix/color-keywords.htm#extended)，But not support [28 system colors](https://css.doyoe.com/appendix/color-keywords.htm#system)；

#### Specificity and inheritance

The introduction style of a component has a higher priority than the global style.

#### Selector

1. Basic selector only supports class selector
2. Not support the combination selector writing method
3. Not support for pseudo-classes and pseudo-elements

#### Shorthand properties

Only accepts values supported by React Native. For example, background accepts only one color, `backgroundColor`, because React Native's Background only supports the `backgroundColor` property. properties supported by React Native can be found in the React Native stylesheet above.

#### Unit

Taro use [PostCSS](https://github.com/ai/postcss) unit conversion plugin [postcss-pxtransform](https://github.com/NervJS/taro/blob/master/packages/postcss-pxtransform/README.md) will convert px to React Native's `pt`, see the documentation for details on how to configure this.


