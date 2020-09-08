import jSXStylePlugin from '../src/index'
import syntaxJSX from '@babel/plugin-syntax-jsx'
import { transform } from '@babel/core'

const mergeStylesFunctionTemplate = `function _mergeStyles() {
  var newTarget = {};
  for (var index = 0; index < arguments.length; index++) {
    var target = arguments[index];
    for (var key in target) {
      newTarget[key] = Object.assign(newTarget[key] || {}, target[key]);
    }
  }
  return newTarget;
}`

const getClassNameFunctionTemplate = `function _getClassName() {
  var className = [];
  var args = arguments[0];
  var type = Object.prototype.toString.call(args).slice(8, -1).toLowerCase();

  if (type === 'string') {
    args = args.trim();
    args && className.push(args);
  } else if (type === 'array') {
    args.forEach(function (cls) {
      cls = _getClassName(cls).trim();
      cls && className.push(cls);
    });
  } else if (type === 'object') {
    for (var k in args) {
      k = k.trim();

      if (k && args.hasOwnProperty(k) && args[k]) {
        className.push(k);
      }
    }
  }

  return className.join(' ').trim();
}
`

const getStyleFunctionTemplate = `function _getStyle(classNameExpression) {
  var className = _getClassName(classNameExpression);\n
  var classNameArr = className.split(/\\s+/);
  var style = [];

  if (classNameArr.length === 1) {
    style.push(_styleSheet[classNameArr[0].trim()]);
  } else {
    classNameArr.forEach(function (cls) {
      style.push(_styleSheet[cls.trim()]);
    });
  }

  return style;
}
`

describe('jsx style plugin', () => {
  function getTransformCode (code) {
    return transform(code, {
      plugins: [jSXStylePlugin, syntaxJSX]
    }).code
  }

  it('transform only one className to style as member', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';
class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }

}`)
})

  it('transform multiple classNames to style as array', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import "./app.css";
class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from "./app_styles";
var _styleSheet = appStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header1"], _styleSheet["header2"]]} />;
  }

}`)
  })

  it('transform array, object and expressions', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';
class App extends Component {
  render() {
    return <div className={'header'}>
      <div className={{ active: props.isActive }} />
      <div className={['header1 header2', 'header3', { active: props.isActive }]} />
      <div className={props.visible ? 'show' : 'hide'} />
      <div className={getClassName()} />
    </div>;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;

${getClassNameFunctionTemplate}
${getStyleFunctionTemplate}
class App extends Component {
  render() {
    return <div style={_styleSheet["header"]}>
      <div style={_getStyle({
        active: props.isActive
      })} />
      <div style={_getStyle(['header1 header2', 'header3', {
        active: props.isActive
      }])} />
      <div style={_getStyle(props.visible ? 'show' : 'hide')} />
      <div style={_getStyle(getClassName())} />
    </div>;
  }

}`)
  })

  it('combine one style and className', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';
class App extends Component {
  render() {
    return <div className="header2" style={styles.header1} />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], styles.header1]} />;
  }

}`)
  })

  it('combine inline style object and className', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';
class App extends Component {
  render() {
    return <div className="header" style={{
      height: 100
    }} />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header"], {
      height: 100
    }]} />;
  }

}`)
  })

  it('combine multiple styles and className', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';
class App extends Component {
  render() {
    return <div className="header2" style={[styles.header1, styles.header3]} />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], styles.header1, styles.header3]} />;
  }

}`)
  })

  it('do not transform code when no css file', () => {
    const code = `
import { createElement, Component } from 'rax';
class App extends Component {
  render() {
    return <div className="header" />;
  }
}`
    expect(getTransformCode(code))
    .toBe(`import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return <div className="header" />;
  }

}`)
})

  it('transform scss file', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.scss';
class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }

}`)
  })

  it('transform scss file with hyphen(-) in the filename', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app-style.scss';
class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import app_styleStyleSheet from './app-style_styles';
var _styleSheet = app_styleStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }

}`)
  })

  it('transform constant elements in render', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.css';
render(<div className="header" />);
`)).toBe(`import { createElement, render } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;
render(<div style={_styleSheet["header"]} />);`)
  })

  it('transform stylus in render', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.styl';
render(<div className="header" />);
`)).toBe(`import { createElement, render } from 'rax';
import appStyleSheet from './app_styles';
var _styleSheet = appStyleSheet;
render(<div style={_styleSheet["header"]} />);`)
  })
})