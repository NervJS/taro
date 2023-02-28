import StyleTransform, { getWrapedCSS } from '../src/transforms'

// 初始化config
const styleTransform = new StyleTransform({})

async function run (src, filename = './__tests__/styles/a.css', options = { platform: 'android' }, debug) {
  if (typeof src === 'object') {
    ({
      src,
      filename = './__tests__/styles/a.css',
      options = { platform: 'android' },
      debug
    } = src || {})
  }

  const css = await styleTransform.transform(src, filename, options)
  if (debug) {
    // eslint-disable-next-line
    console.log(filename + ' source: ', src)
    // eslint-disable-next-line
    console.log(filename + ' target: ', css)
  }
  return css
}

describe('style transform in cross platform', () => {
  it('postcss cross platform conditional compile', async () => {
    const css = await run(`
      .test {
        color: red;
      }
      /*  #ifdef  rn  */
      .rn { width: 100px }
      /*  #endif  */
      /*  #ifndef  rn  */
      .h5 { errSet: 100px }
      /*  #endif  */
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red"
  },
  "rn": {
    "width": scalePx2dp(50)
  }
}`))
  })

  it('not surport style', async () => {
    const css = await run(`
      .test {
        o: 0.5;
        background: red;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "o": 0.5,
    "backgroundColor": "red"
  }
}`))
  })

  it('nest sass import cross platform', async () => {
    const css = await run({
      filename: './__tests__/styles/a.scss',
      src: "@import './c.scss';"
    })
    expect(css).toEqual(getWrapedCSS(`{
  "drn": {
    "color": "red"
  },
  "crn": {
    "color": "red"
  }
}`))
  })
})
