# line-height-no-value-without-unit

Disallow invalid `line-height` values on React Native.

```css
.a {
  line-height: 1;
}
/**            ↑
 *             This value */
```

More info:

- [taro/issues/11620](https://github.com/NervJS/taro/issues/11620)

## Options

### `true`

The following value or without units will be ignored:

```css
.a {
  line-height: 2;
}
```

```css
.a {
  line-height: 100%;
}
```

```css
.a {
  line-height: 100pt;
}
```

