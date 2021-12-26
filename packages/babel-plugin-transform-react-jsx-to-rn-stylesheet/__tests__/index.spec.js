import { transform } from '@babel/core'
import syntaxJSX from 'babel-plugin-syntax-jsx'
import jSXStylePlugin from '../src/index'

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
}`

const getStyleFunctionTemplete = `function _getStyle(classNameExpression) {
  var className = _getClassName(classNameExpression);\n
  var classNameArr = className.split(/\\s+/);
  var style = {};
  classNameArr.reduce((sty, cls) => Object.assign(sty, _styleSheet[cls.trim()]), style);
  return style;
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
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header1"], _styleSheet["header2"]]} />;
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
}`)).toBe(`import { createElement, Component } from 'rax';
import app1CssStyleSheet from "./app1.css";
import app2CssStyleSheet from "./app2.css";

${mergeStylesFunctionTemplate}

var _styleSheet = _mergeStyles(app1CssStyleSheet, app2CssStyleSheet);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header1"], _styleSheet["header2"]]} />;
  }

}`)
  })

  it('combine the same filename style source', () => {
    expect(getTransfromCode(`import { createElement, Component } from 'rax';
import './app.css';
import '../app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
import appCssStyleSheet1 from "../app.css";

${mergeStylesFunctionTemplate}

var _styleSheet = _mergeStyles(appCssStyleSheet, appCssStyleSheet1);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header1"], _styleSheet["header2"]]} />;
  }

}`)
  })

  it('combine one style and className', () => {
    expect(getTransfromCode(`import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={style.header1} />;
  }
}`)).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
import style from "./style.css";

${mergeStylesFunctionTemplate}

var _styleSheet = _mergeStyles(appCssStyleSheet, style);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], style.header1]} />;
  }

}`)
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
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header"], {
      height: 100
    }]} />;
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
}`)).toBe(`import { createElement, Component } from 'rax';
import appCssStyleSheet from "./app.css";
import style from "./style.css";

${mergeStylesFunctionTemplate}

var _styleSheet = _mergeStyles(appCssStyleSheet, style);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], style.header1, style.header3]} />;
  }\n
}`)
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
`)).toBe(`import { createElement, render } from 'rax';
import indexCssStyleSheet from "./index.css";
import indexScssStyleSheet from "./index.scss";
import indexLessStyleSheet from "../index.less";
import styl from "./index.styl";

${mergeStylesFunctionTemplate}

var _styleSheet = _mergeStyles(indexCssStyleSheet, indexScssStyleSheet, indexLessStyleSheet, styl);

render(<div style={_styleSheet["header"]} />);`)
  })
  it('transform styleAttribute expression', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.less';

render(<div className="header" style={{width: 100, height: 100}} />);
`)).toBe(`import { createElement, render } from 'rax';
import appLessStyleSheet from "./app.less";
var _styleSheet = appLessStyleSheet;
render(<div style={[_styleSheet["header"], {
  width: 100,
  height: 100
}]} />);`)
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
var _styleSheet = appLessStyleSheet;
render(<div style={[_styleSheet["header"], {
  "width": 100,
  "height": 100,
  "backgroundColor": "rgba(0, 0, 0, 0.5)",
  "borderWidth": 1,
  "borderStyle": "solid",
  "borderColor": "black"
}]} />);`)
  })

  it('ignore merge stylesheet when css module enable', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';
import styleSheet from './app.module.scss';

class App extends Component {
  render() {
    return <div className="header" style={styleSheet.red} />;
  }
}`, false, { enableCSSModule: true })).toBe(`import { createElement, Component } from 'rax';
import appScssStyleSheet from "./app.scss";
import styleSheet from './app.module.scss';
var _styleSheet = appScssStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["header"], styleSheet.red]} />;
  }\n
}`)
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
}`, false, { enableCSSModule: true })).toBe(`import { createElement, Component } from 'rax';
import styleSheet from './app.module.scss';
var _styleSheet = {};

class App extends Component {
  render() {
    return <div>
      <div style={styleSheet.header} />
      <div style={_styleSheet["red"]} />
    </div>;
  }\n
}`)
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
}`, false, { enableCSSModule: true })).toBe(`import { createElement, Component } from 'rax';
import appScssStyleSheet from "./app.scss";
import styleSheet from './app.module.scss';
var _styleSheet = appScssStyleSheet;

class App extends Component {
  render() {
    const a = styleSheet.red;
    return <div style={a} />;
  }\n
}`)
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
}`, false, { enableCSSModule: true })).toBe(`import { createElement, Component } from 'rax';
import appScssStyleSheet from "./app.scss";
import styleSheet from './app.module.scss';
var _styleSheet = appScssStyleSheet;

class App extends Component {
  render() {
    const a = { ...styleSheet.red
    };
    const b = a;
    return <div style={{ ...b
    }} />;
  }\n
}`)
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
}`, false, { enableCSSModule: true })).toBe(`import { createElement, Component } from 'rax';
import appScssStyleSheet from "./app.scss";
import styleSheet from './app.module.scss';
var _styleSheet = appScssStyleSheet;

class App extends Component {
  render() {
    const a = 1 ? styleSheet.red : styleSheet.blue;
    return <div style={a} />;
  }\n
}`)
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
}`)).toBe(`import { createElement, Component } from 'rax';
import appScssStyleSheet from "./app.scss";
import styleSheet from "./app.module.scss";

${mergeStylesFunctionTemplate}

var _styleSheet = _mergeStyles(appScssStyleSheet, styleSheet);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header"], styleSheet.red]} />;
  }\n
}`)
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
var _styleSheet = appCssStyleSheet;

class App extends Component {
  render() {
    return <div style={[_styleSheet["container"], {
      color: "red"
    }]} headerStyle={[_styleSheet["header"], {
      color: "green"
    }]} />;
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
