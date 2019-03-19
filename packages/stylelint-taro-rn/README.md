# stylelint-react-native

A collection of React Native specific linting rules for [stylelint](https://github.com/stylelint/stylelint) (in a form of a plugin).

## Installation and usage

Install `stylelint-react-native` (and `stylelint`, if you haven't done so yet):

```
yarn add stylelint stylelint-react-native --dev
```

or

```
npm install stylelint stylelint-react-native --save-dev
```

Create the `.stylelintrc` config file (or open the existing one), add `stylelint-react-native` to the plugins array and the rules you need to the rules list. All rules from `stylelint-react-native` need to be namespaced with `react-native`.

```json
{
  "plugins": ["stylelint-taro-rn"],
  "rules": {
    "taro-rn/css-property-no-unknown": true
  }
}
```

Please refer to [stylelint docs](http://stylelint.io/user-guide/) for the detailed info on using this linter plugin.

## List of rules

### General rules

- [`font-weight-no-ignored-values`](./src/rules/font-weight-no-ignored-values/README.md): Disallow valid `font-weight` values that work on iOS, but are ignored and get mapped to `normal` or `bold` weight on Android.

---

### css- rules (for tools like styled-components)

These rules are meant to be used with tools that allow you to write CSS when using React Native, e.g. [styled-components](https://www.styled-components.com/), [React Native CSS modules](https://github.com/kristerkari/react-native-css-modules), etc.

- [`css-property-no-unknown`](./src/rules/css-property-no-unknown/README.md): Disallow unknown React Native CSS properties.

---

### style- rules (for React Native's built-in styling)

These rules are meant to be used when styling with React Native's built-in styling, or with tools that use React Native's default styling.

- [`style-property-no-unknown`](./src/rules/style-property-no-unknown/README.md): Disallow unknown React Native Style properties.

## Help out

There work on the plugin's rules is still in progress, so if you feel like it, you're welcome to help out in any of these (the plugin follows stylelint guidelines so most part of this is based on its docs):

- Create, enhance, and debug rules (see stylelint's guide to "[Working on rules](https://github.com/stylelint/stylelint/blob/master/docs/developer-guide/rules.md)").
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas on new rules, or for how to improve the existing ones, and pull requests to show us how your idea works.
- Add new tests to absolutely anything.
- Work on improving performance of rules.
- Contribute to [stylelint](https://github.com/stylelint/stylelint)
- Spread the word.

There is also [stackoverflow](http://stackoverflow.com/questions/tagged/stylelint), which would be the preferred QA forum.
