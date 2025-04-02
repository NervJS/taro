const { exec } = require('child_process')
const axios = require('axios')

axios.get('https://taro.jd.com/', { timeout: 5000 })
  .then(() => {
    // JD内网
    // console.log('*******JD内网:*******')
    exec('taro global-config add-plugin  @jdtaro/plugin-build-report-performance@latest --registry http://registry.m.jd.com', (error, stdout, stderr) => {
      if (error) {
        console.error(`install performance plugin error: ${error}`)
        return
      }
      console.log(`install performance plugin stdout: ${stdout}`)
      console.log(`install performance plugin stderr: ${stderr}`)
    })
  })
  .catch(() => {
    // 公网
    // console.log('*******公网:*******')
  })
