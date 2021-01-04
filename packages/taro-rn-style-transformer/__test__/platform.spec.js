import StyleTransform, { getWrapedCSS } from '../dist/transforms'

// 初始化config
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

describe('style transform in cross platform', () => {
  it('postcss cross platform conditional compile', async () => {
    const css = await run(`
    .test {
      color: red;
    }
    /*  #ifdef  rn  */
    .rn { width: 100px }
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
})
