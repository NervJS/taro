import { transform } from '@babel/core'
import syntaxJSX from 'babel-plugin-syntax-jsx'

import jSXStylePlugin from '../src/index'

describe('jsx style plugin', () => {
  function getTransformCode (source, debug = false, options = {}) {
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
    expect(getTransformCode(`
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
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toMatchSnapshot()
  })

  it('transform multiple classNames to style as array', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toMatchSnapshot()
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
}`)).toMatchSnapshot()
  })

  it('combine multiple anonymous css file', () => {
    expect(getTransformCode(`import { createElement, Component } from 'rax';
import './app1.css';
import './app2.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toMatchSnapshot()
  })

  it('combine the same filename style source', () => {
    expect(getTransformCode(`import { createElement, Component } from 'rax';
import './app.css';
import '../a/app.css';
import '../b/app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toMatchSnapshot()
  })

  it('combine one style and className', () => {
    expect(getTransformCode(`import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={style.header1} />;
  }
}`)).toMatchSnapshot()
  })

  it('combine inline style object and className', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import "./app.css";

class App extends Component {
  render() {
    return <div className="header" style={{
      height: 100
    }} />;
  }
}`)).toMatchSnapshot()
  })

  it('combine multiple styles and className', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={[style.header1, style.header3]} />;
  }
}`)).toMatchSnapshot()
  })

  it('do not transform code when no css file', () => {
    const code = `import { createElement, Component } from 'rax';
class App extends Component {
  render() {
    return <div className="header" />;
  }
}`

    expect(getTransformCode(code)).toBe(code)
  })

  it('transform scss file', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.scss';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toMatchSnapshot()
  })

  it('transform scss file with hyphen(-) in the filename', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app-style.scss';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toMatchSnapshot()
  })

  it('transform constant elements in render', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.css';

render(<div className="header" />);
`)).toMatchSnapshot()
  })

  it('transform stylus in render', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.styl';

render(<div className="header" />);
`)).toMatchSnapshot()
  })

  it('transform less in render', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.less';

render(<div className="header" />);
`)).toMatchSnapshot()
  })

  it('combine multiple different extension style sources', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './index.css'
import './index.scss'
import '../index.less'
import styl from './index.styl'

render(<div className="header" />);
`)).toMatchSnapshot()
  })
  it('transform styleAttribute expression', () => {
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.less';

render(<div className="header" style={{width: 100, height: 100}} />);
`)).toMatchSnapshot()
  })
  it('transform styleAttribute inline string', () => {
    expect(getTransformCode(`
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
    expect(getTransformCode(`
import { createElement, render } from 'rax';
import './app.less';
render(<div className="header" style="width:100px;height:100px;background-color:rgba(0, 0, 0, 0.5);border: 1px solid;" />);
`)).toMatchSnapshot()
  })

  it('Provide a default stylesheet object when css module enable and import css module sheet only', () => {
    expect(getTransformCode(`
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
    expect(getTransformCode(`
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

  it('Processing multiple module style When css module enable', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import styleSheet from './app.module.scss';
import styleSheet2 from './app2.module.scss';

class App extends Component {
  render() {
    const a = styleSheet.red
    return <div className={\`\${a} \${styleSheet2.b}\`} />;
  }
}`, false, { enableCSSModule: true })).toMatchSnapshot()
  })

  it('Processing module style spread and assign When css module enable', () => {
    expect(getTransformCode(`
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
    expect(getTransformCode(`
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
    expect(getTransformCode(`
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
    expect(getTransformCode(`
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
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" />;
  }
}`, false, { enableMultipleClassName: false })).toMatchSnapshot()
  })

  it('enableMultipleClassName and transform multiple className to multiple style', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" />;
  }
}`, false, { enableMultipleClassName: true })).toMatchSnapshot()
  })

  it('enableMultipleClassName and transform multiple className to multiple style as array', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="container" headerClassName="header" style={{ color: "red" }} headerStyle={{ color: "green" }} />;
  }
}`, false, { enableMultipleClassName: true })).toMatchSnapshot()
  })

  it('enableMultipleClassName and transform error css value', () => {
    expect(getTransformCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <StatusBar barStyle="dark-content" />;
  }
}`, false, { enableMultipleClassName: true })).toMatchSnapshot()
  })
})
