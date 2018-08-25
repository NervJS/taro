# babel-plugin-transform-jsx-stylesheet
> Transform StyleSheet selector to style in JSX Elements.

## Installation

```sh
npm install --save-dev babel-plugin-transform-jsx-stylesheet
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": ["transform-jsx-stylesheet"]
}
```

## Example

Your `component.js` that contains this code:

```js
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header" />
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return <div style={styleSheet.header} />;
  }
}

const styleSheet = appStyleSheet;
```

Can write multiple classNames like this:

```js
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return <div style={[styleSheet.header1, styleSheet.header2]} />;
  }
}

const styleSheet = appStyleSheet;
```

Also support array, object and expressions like this: **（since 0.6.0）**

```js
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className={'header'}>
        <div className={{ active: this.props.isActive }} />
        <div className={['header1 header2', 'header3', { active: this.props.isActive }]} />
        <div className={this.props.visible ? 'show' : 'hide'} />
        <div className={getClassName()} />
      </div>
    );
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return (
      <div style={styleSheet.header}>
        <div style={_getStyle({ active: this.props.isActive })} />
        <div style={_getStyle(['header1 header2', 'header3', { active: this.props.isActive }])} />
        <div style={_getStyle(this.props.visible ? 'show' : 'hide')} />
        <div style={_getStyle(getClassName())} />
      </div>
    );
  }
}

const styleSheet = appStyleSheet;
function _getClassName() { /* codes */ }
function _getStyle(className) {
  return styleSheet[_getClassName(className)]; // not real code
}
```

And can also import multiple css file:

```js
import { createElement, Component } from 'rax';
import 'app1.css';
import 'app2.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import app1StyleSheet from 'app1.css';
import app2StyleSheet from 'app2.css';

class App extends Component {
  render() {
    return <div style={[styleSheet.header1, styleSheet.header2]} />;
  }
}

const styleSheet = Object.assign({}, app1StyleSheet, app2StyleSheet);
```
