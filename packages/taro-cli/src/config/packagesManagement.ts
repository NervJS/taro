const packagesManagement = {
  yarn: {
    command: 'yarn install',
    globalCommand: 'yarn global add @tarojs/cli'
  },
  pnpm: {
    command: 'pnpm install',
    globalCommand: 'pnpm add -g @tarojs/cli'
  },
  cnpm: {
    command: 'cnpm install',
    globalCommand: 'cnpm i -g @tarojs/cli'
  },
  npm: {
    command: 'npm install',
    globalCommand: 'npm i -g @tarojs/cli'
  }
}

export default packagesManagement
