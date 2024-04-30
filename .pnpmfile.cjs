module.exports = {
  hooks: {
    afterAllResolved: (lockfile) => {
      const { packages } = lockfile
      Object.entries(packages).forEach(([key, value]) => {
        if (key.startsWith('/@stencil/core')) {
          const newDependencies = value.dependencies|| {}
          value.dependencies = {
            ...newDependencies,
            'jest-runner': '27.5.1',
            'jest-environment-node': '27.5.1',
          }
        }
      })
      
      return lockfile
    },
  },
};