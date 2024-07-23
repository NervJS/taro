module.exports = {
  hooks: {
    readPackage: (pkg) => { 
      // @stencil/core 没有锁住 jest 的版本，所以需要手动锁住
      if (pkg.name === '@stencil/core') {
        pkg.dependencies = {
          'jest-runner': '27.5.1',
          'jest-environment-node': '27.5.1',
        }
      }
      return pkg
    },
  },
};
