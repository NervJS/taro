import { transform } from '@babel/core'
import syntaxJSX from 'babel-plugin-syntax-jsx'

import jSXStylePlugin from '../src/index'

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
}`

const getStyleFunctionTemplete = `function _getStyle(classNameExpression) {
  var className = _getClassName(classNameExpression);\n
  var classNameArr = className.split(/\\s+/);
  var style = {};
  classNameArr.reduce((sty, cls) => Object.assign(sty, _styleSheet[cls.trim()]), style);
  return style;
}`

const mergeEleStylesFunctionTemplate = `function _mergeEleStyles() {
  return [].concat.apply([], arguments).reduce((pre, cur) => Object.assign(pre, cur), {});
}`

describe('jsx style plugin', () => {
  function getTransfromCode (source, debug = false, options = {}) {
    const { enableCSSModule, enableMultipleClassName = false } = options
    const code = transform(source, {
      plugins: [[jSXStylePlugin, { enableCSSModule, enableMultipleClassName }], syntaxJSX],
      configFile: false
    }).code
    if (debug) {
      // eslint-disable-next-line
      console.log(source + '\n')
      // eslint-disable-next-line
      console.log(code)
    }
    return code
  }

  it('no stylesheet import', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return <div className="header" />;
  }

}`)
  })

  it('transform only one className to style as member', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }

}`)
  })

  it('transform multiple classNames to style as array', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";

${mergeEleStylesFunctionTemplate}

var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_mergeEleStyles(_styleSheet["header1"], _styleSheet["header2"])} />;
  }

}`)
  })

  it('transform array, object and expressions', () => {
    expect(getTransfromCode(`
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
import appCssStyleSheet from "./app.css";

${getClassNameFunctionTemplate}

${getStyleFunctionTemplete}

var _styleSheet = appCssStyleSheet;

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

  it('combine multiple anonymous css file', () => {
    expect(getTransfromCode(`import { createElement, Component } from 'rax';
import './app1.css';
import './app2.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toMatchSnapshot()
  })

  it('combine the same filename style source', () => {
    expect(getTransfromCode(`import { createElement, Component } from 'rax';
import './app.css';
import '../app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toMatchSnapshot()
  })

  it('combine one style and className', () => {
    expect(getTransfromCode(`import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={style.header1} />;
  }
}`)).toMatchSnapshot()
  })

  it('combine inline style object and className', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import "./app.css";

class App extends Component {
  render() {
    return <div className="header" style={{
      height: 100
    }} />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";

${mergeEleStylesFunctionTemplate}

var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_mergeEleStyles(_styleSheet["header"], {
      height: 100
    })} />;
  }\n
}`)
  })

  it('combine multiple styles and className', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={[style.header1, style.header3]} />;
  }
}`)).toMatchSnapshot()
  })

  it('do not transfrom code when no css file', () => {
    const code = `import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return <div className="header" />;
  }\n
}`

    expect(getTransfromCode(code)).toBe(code)
  })

  it('transform scss file', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appScssStyleSheet from "./app.scss";
var _styleSheet = appScssStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }\n
}`)
  })

  it('transform scss file with hyphen(-) in the filename', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app-style.scss';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appStyleScssStyleSheet from "./app-style.scss";
var _styleSheet = appStyleScssStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }\n
}`)
  })

  it('transform constant elements in render', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.css';

render(<div className="header" />);
`)).toBe(`import { createElement, render } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;
render(<div style={_styleSheet["header"]} />);`)
  })

  it('transform stylus in render', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.styl';

render(<div className="header" />);
`)).toBe(`import { createElement, render } from 'rax';
import appStylStyleSheet from "./app.styl";
var _styleSheet = appStylStyleSheet;
render(<div style={_styleSheet["header"]} />);`)
  })

  it('transform less in render', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.less';

render(<div className="header" />);
`)).toBe(`import { createElement, render } from 'rax';
import appLessStyleSheet from "./app.less";
var _styleSheet = appLessStyleSheet;
render(<div style={_styleSheet["header"]} />);`)
  })

  it('combine multiple different extension style sources', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './index.css'
import './index.scss'
import '../index.less'
import styl from './index.styl'

render(<div className="header" />);
`)).toMatchSnapshot()
  })
  it('transform styleAttribute expression', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.less';

render(<div className="header" style={{width: 100, height: 100}} />);
`)).toBe(`import { createElement, render } from 'rax';
import appLessStyleSheet from "./app.less";

${mergeEleStylesFunctionTemplate}

var _styleSheet = appLessStyleSheet;
render(<div style={_mergeEleStyles(_styleSheet["header"], {
  width: 100,
  height: 100
})} />);`)
  })
  it('transform styleAttribute inline string', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';

render(<div style="width:100px;height:100px;background-color:rgba(0, 0, 0, 0.5);border: 1px solid;" />);
`)).toBe(`import { createElement, render } from 'rax';
render(<div style={{
  "width": 100,
  "height": 100,
  "backgroundColor": "rgba(0, 0, 0, 0.5)",
  "borderWidth": 1,
  "borderStyle": "solid",
  "borderColor": "black"
}} />);`)
  })

  it('transform styleAttribute inline string and exsit classNameAttribute', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.less';
render(<div className="header" style="width:100px;height:100px;background-color:rgba(0, 0, 0, 0.5);border: 1px solid;" />);
`)).toBe(`import { createElement, render } from 'rax';
import appLessStyleSheet from "./app.less";

${mergeEleStylesFunctionTemplate}

var _styleSheet = appLessStyleSheet;
render(<div style={_mergeEleStyles(_styleSheet["header"], {
  "width": 100,
  "height": 100,
  "backgroundColor": "rgba(0, 0, 0, 0.5)",
  "borderWidth": 1,
  "borderStyle": "solid",
  "borderColor": "black"
})} />);`)
  })

  it('Provide a default stylesheet object when css module enable and import css module sheet only', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    return <div>
      <div className={styleSheet.header} />
      <div className="red" />
    </div>;
  }
}`, false, { enableCSSModule: true })).toMatchSnapshot()
  })

  it('Processing module style assignment When css module enable', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    const a = styleSheet.red
    return <div className={a} />;
  }
}`, false, { enableCSSModule: true })).toMatchSnapshot()
  })

  it('Processing module style spread and assign When css module enable', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    const a = { ...styleSheet.red };
    const b = a;
    return <div className={{ ...b }} />;
  }
}`, false, { enableCSSModule: true })).toMatchSnapshot()
  })

  it('Processing module style conditional expression When css module enable', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    const a = 1 ? styleSheet.red : styleSheet.blue;
    return <div className={a} />;
  }
}`, false, { enableCSSModule: true })).toMatchSnapshot()
  })

  it('Processing module style through call expression When css module enable', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    const a = Object.assign({}, styleSheet.red);
    const b = Object.assign({}, a);
    return <div className={a}><span className={b} /><span className={Object.assign({}, b)} /></div>;
  }
}`, false, { enableCSSModule: true })).toMatchSnapshot()
  })

  it('merge stylesheet when css module disable', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    return <div className="header" style={styleSheet.red} />;
  }
}`)).toMatchSnapshot()
  })

  it('disableMultipleClassName and transform multiple className to multiple style', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" />;
  }
}`, false, { enableMultipleClassName: false })).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div headerClassName="header" style={_styleSheet["container"]} />;
  }

}`)
  })

  it('enableMultipleClassName and transform multiple className to multiple style', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" />;
  }
}`, false, { enableMultipleClassName: true })).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_styleSheet["container"]} headerStyle={_styleSheet["header"]} />;
  }

}`)
  })

  it('enableMultipleClassName and transform multiple className to multiple style as array', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" style={{ color: "red" }} headerStyle={{ color: "green" }} />;
  }
}`, false, { enableMultipleClassName: true })).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";

${mergeEleStylesFunctionTemplate}

var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={_mergeEleStyles(_styleSheet["container"], {
      color: "red"
    })} headerStyle={_mergeEleStyles(_styleSheet["header"], {
      color: "green"
    })} />;
  }

}`)
  })

  it('enableMultipleClassName and transform error css value', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <StatusBar barStyle="dark-content" />;
  }
}`, false, { enableMultipleClassName: true })).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <StatusBar barStyle={"dark-content"} />;
  }

}`)
  })
})
