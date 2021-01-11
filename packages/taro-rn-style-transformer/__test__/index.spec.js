import StyleTransform, { getWrapedCSS } from '../dist/transforms'

// 初始化
const styleTransform = new StyleTransform()

async function run (src, filename = './__test__/styles/a.css', options, debug) {
  const css = await styleTransform.transform(src, filename, options)
  if (debug) {
    // eslint-disable-next-line
    console.log(filename + ' source: ', src)
    // eslint-disable-next-line
    console.log(filename + ' target: ', css)
  }
  return css
}

describe('style transform', () => {
  it('.css transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
        height: 10px;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red",
    "height": scalePx2dp(5)
  }
}`))
  })

  it('.css transform @import', async () => {
    const css = await run(`
      @import './b.css';
      .test {
        color: red;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.scss transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
      }
    `, './__test__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red"
  }
}`))
  })
  //
  it('.scss transform @import', async () => {
    const css = await run(`
      @import './b.scss';
      .test {
        color: red;
      }
    `, './__test__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })
  it('.scss transform @import css file', async () => {
    const css = await run(`
      @import './c.css';
      .test {
        color: red;
      }
    `, './__test__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "c": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.scss transform @import with mixins', async () => {
    const css = await run(`
      @import './mixins.scss';
      .test {
        color: red;
        @include hairline(width);
      }
    `, './__test__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red",
    "width": scalePx2dp(0.5)
  }
}`))
  })

  it('.less transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
      }
    `, './__test__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red"
  }
}`))
  })

  it('.less transform @import', async () => {
    const css = await run(`
      @import './b.less';
      .test {
        color: red;
      }
    `, './__test__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.less tranform nest import', async () => {
    const css = await run(`
      @import './c.less';
      .test {
        color: red;
      }
    `, './__test__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "nest": {
    "color": "red"
  },
  "c": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.styl transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
      }
    `, './__test__/styles/a.styl')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "#f00"
  }
}`))
  })

  it('.styl transform @import', async () => {
    const css = await run(`
      @import './b.styl';
      .test {
        color: red;
      }
    `, './__test__/styles/a.styl')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "#f00"
  },
  "test": {
    "color": "#f00"
  }
}`))
  })
})
