const { exec } = require('child_process')
const axios = require('axios')

axios.get('https://taro.jd.com/', { timeout: 5000 })
  .then(() => {
    exec('./bin/taro global-config add-plugin  @scope/plugin-build-report-performance@latest --registry https://registry.npmjs.org', (error, _stdout, _stderr) => {
      if (error) {
        console.error(`install performance plugin error: ${error}`)
      }
    })
    console.log('cli postinstall success')
  })
  .catch(() => {
  })
