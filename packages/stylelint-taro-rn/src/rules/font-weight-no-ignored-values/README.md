# font-weight-no-ignored-values

Disallow valid `font-weight` values that work on iOS, but are ignored and get mapped to `normal` or `bold` weight on Android.

```css
.a {
  font-weight: 500;
}
/**            ↑
 *             This value */
```

More info:

- [react-native/issues/19707](https://github.com/facebook/react-native/issues/19707)
- [ReactFontManager.java](https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/views/text/ReactFontManager.java)
- [react-native/issues/19736](https://github.com/facebook/react-native/issues/19736)

## Options

### `true`

The following patterns are considered violations:

```css
.a {
  font-weight: 100;
}
```

```css
.a {
  font-weight: 300;
}
```

The following patterns are _not_ considered violations:

```css
.a {
  font-weight: 400;
}
```

```css
.a {
  font-weight: 700;
}
```

```css
.a {
  font-weight: normal;
}
```

```css
.a {
  font-weight: bold;
}
```
