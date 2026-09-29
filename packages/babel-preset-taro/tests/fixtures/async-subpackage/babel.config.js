module.exports = {
  presets: [[require.resolve('../../../index.js'), {
    framework: 'react',
    modules: false,
    targets: { node: 'current' },
    'dynamic-import-node': true,
  }]],
}
