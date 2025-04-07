const { exec } = require('child_process')
const axios = require('axios')

axios.get('https://taro.jd.com/', { timeout: 5000 })
  .then(() => {
    exec('./node_modules/.bin/taro global-config add-plugin  @jdtaro/plugin-build-report-performance@latest --registry http://registry.m.jd.com', (error, _stdout, _stderr) => {
      if (error) {
        console.error(`install performance plugin error: ${error}`)
      }
    })
  })
  .catch(() => {
  })
