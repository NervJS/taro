# css-property-no-unknown

Disallow unknown React Native CSS properties.

```css
.foo {
  heigth: 100%;
}
/** ↑
 * These properties */
```

This rule considers properties defined in [React Native](https://github.com/vhpoet/react-native-styling-cheat-sheet) to be known.

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

## Options

### `true`

The following patterns are considered violations:

```css
.foo {
  word-wrap: break-word;
}
```

```css
.foo {
  colr: blue;
}
```

```css
.foo {
  my-property: 1;
}
```

```css
.foo {
  box-shadow: 1px 2px 3px red;
}
```

The following patterns are _not_ considered violations:

```css
.foo {
  color: green;
}
```

```css
.foo {
  align-self: center;
}
```

```css
.foo {
  elevation: 6;
}
```

## Optional secondary options

### `ignoreProperties: ["/regex/", "string"]`

Given:

```js
["/^my-/", "custom"];
```

The following patterns are _not_ considered violations:

```css
.foo {
  my-property: 10px;
}
```

```css
.foo {
  my-other-property: 10px;
}
```

```css
.foo {
  custom: 10px;
}
```
