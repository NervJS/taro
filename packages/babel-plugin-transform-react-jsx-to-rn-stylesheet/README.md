# babel-plugin-transform-react-jsx-to-rn-stylesheet
> Transform StyleSheet selector to style in JSX Elements.

## Installation

```sh
npm install --save-dev babel-plugin-transform-react-jsx-to-rn-stylesheet 
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": ["transform-react-jsx-to-rn-stylesheet"]
}
```

## Example

Your `component.js` that contains this code:

```js
import { Component } from 'react';
import './app.css';
class App extends Component {
  render() {
    return <div className="header" />
  }
}
```

Will be transpiled into something like this:

```js
import { Component } from 'react';
import appCssStyleSheet from './app.css';

var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet.header} />;
  }
}
```

Can write multiple classNames like this:

```js
import { Component } from 'react';
import './app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}
```

Will be transpiled into something like this:

```js
import {  Component } from 'react';
import appCssStyleSheet from './app.css';

var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet.header1, _styleSheet.header2]} />;
  }
}

```

Also support array, object and expressions like this:

```js
import { Component } from 'react';
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
import { Component } from 'react';
import appCssStyleSheet from './app.css';
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return (
      <div style={_styleSheet.header}>
        <div style={_getStyle({ active: this.props.isActive })} />
        <div style={_getStyle(['header1 header2', 'header3', { active: this.props.isActive }])} />
        <div style={_getStyle(this.props.visible ? 'show' : 'hide')} />
        <div style={_getStyle(getClassName())} />
      </div>
    );
  }
}

function _getClassName() { /* codes */ }
function _getStyle(className) {
  return _styleSheet[_getClassName(className)]; // not real code
}
```

And can also import multiple css file:

```js
import { Component } from 'react';
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
import { Component } from 'react';
import app1CssStyleSheet from "./app1.css";
import app2CssStyleSheet from "./app2.css";

class App extends Component {
  render() {
    return <div style={[_styleSheet.header1, _styleSheet.header2]} />;
  }
}

var _styleSheet = _mergeStyles(app1CssStyleSheet, app2CssStyleSheet);
```

also suport inline style value is string
```js
import { createElement, render } from 'rax';
import './app.less';

class App extends Component {
  render(<div className="header" style="width:100px;height:100px;background-color:rgba(0, 0, 0, 0.5);border: 1px solid;" />);
}
```
      ↓ ↓ ↓ ↓ ↓ ↓
```js
import { createElement, render } from 'rax';
import appLessStyleSheet from "./app.less";
var _styleSheet = appLessStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header"], {
  "width": 100,
  "height": 100,
  "backgroundColor": "rgba(0, 0, 0, 0.5)",
  "borderWidth": 1,
  "borderColor": "black",
  "borderStyle": "solid"
}]} />);
  }
}

```

support multiple className to style


.babelrc
``` json

{
  "plugins": ["transform-react-jsx-to-rn-stylesheet", { enableMultipleClassName: true }]
}

```



``` js

import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" />;
  }
}

/*  ↓ ↓ ↓ ↓ ↓ ↓  */

import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["container"]} headerStyle={_styleSheet["header"]} />;
  }

}

```

the `enableMultipleClassName` option will match 'attribute' end with 'className' | 'style', and transform className to style. 

but use the error css value in style attribute

like this:

``` js

import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <StatusBar barStyle="dark-content" />;
  }
}

```

the plugin can't transform 'dark-content' to css value, so this transformation will be ignored


``` js
import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <StatusBar barStyle={"dark-content"} />;
  }

}


```