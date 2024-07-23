# babel-plugin-transform-solid-jsx

fork from [babel-plugin-jsx-dom-expressions](https://github.com/ryansolid/dom-expressions/blob/main/packages/babel-plugin-jsx-dom-expressions) version: 0.37.19

This package is a JSX compiler built for [DOM Expressions](https://github.com/ryansolid/dom-expressions) to provide a general JSX to DOM transformation for reactive libraries that do fine grained change detection. This package aims to convert JSX statements to native DOM statements and wrap JSX expressions with functions that can be implemented with the library of your choice. Sort of like a JSX to Hyperscript for fine change detection.

## What Has Been Modified?
- Added uniqueTransform configuration, defaulting to false, indicating that the following processing should not be performed.
- Within the transformElement function of the universal module, perform matching against components from @tarojs/components. Modify the transformation of these components such that they are instead invoked via createElement calls.

### Example
```jsx
import { View, Text, Button } from '@tarojs/components';

const Component = () => {
  return (
    <View class="index">
      <View>
        <Text>Hello world! </Text>
      </View>
      <Button>set class</Button>
    </View>
  );
};
```

Compiles to:
```jsx
import { createTextNode as _$createTextNode } from "@tarojs/plugin-framework-react/dist/reconciler";
import { insertNode as _$insertNode } from "@tarojs/plugin-framework-react/dist/reconciler";
import { setProp as _$setProp } from "@tarojs/plugin-framework-react/dist/reconciler";
import { createElement as _$createElement } from "@tarojs/plugin-framework-react/dist/reconciler";
import { View, Text, Button } from "@tarojs/components";
export default function Index() {
  return function () {
    var _el$ = _$createElement("view"),
      _el$2 = _$createElement("view"),
      _el$3 = _$createElement("text"),
      _el$5 = _$createElement("button");
    _$insertNode(_el$, _el$2);
    _$insertNode(_el$, _el$5);
    _$setProp(_el$, "class", "index");
    _$insertNode(_el$2, _el$3);
    _$insertNode(_el$3, _$createTextNode("Hello world! "));
    _$insertNode(_el$5, _$createTextNode("set class"));
    return _el$;
  }();
}
```

> The purpose of doing so is to ensure compatibility by aligning the compilation results of Taro components within mini programs with those of original tags.
