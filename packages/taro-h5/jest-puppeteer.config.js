module.exports = {
  launch: {
    headless: false
  },
  server: {
    command: 'npm run test-server',
    port: 9000,
    launchTimeout: 10000
  }
}
