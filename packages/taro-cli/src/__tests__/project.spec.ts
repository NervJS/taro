import Project from '../create/project'

jest.mock('@tarojs/helper', () => ({
  chalk: {
    blueBright: jest.fn((text) => text),
    green: jest.fn((text) => text),
    red: jest.fn((text) => text)
  },
  DEFAULT_TEMPLATE_SRC: 'https://github.com/NervJS/taro-project-templates',
  DEFAULT_TEMPLATE_SRC_GITEE: 'https://gitee.com/o2team/taro-project-templates',
  fs: {
    ensureDirSync: jest.fn(),
    existsSync: jest.fn(() => true)
  },
  getUserHomeDir: jest.fn(() => '/tmp'),
  SOURCE_DIR: 'src',
  TARO_BASE_CONFIG: 'index.json',
  TARO_CONFIG_FOLDER: '.taro'
}))

jest.mock('@tarojs/shared', () => ({
  isArray: Array.isArray
}), { virtual: true })

jest.mock('@tarojs/binding', () => ({
  CompilerType: {
    Solid: 'solid',
    Vite: 'vite',
    Webpack5: 'webpack5'
  },
  createProject: jest.fn(() => Promise.resolve()),
  CSSType: {
    None: 'none'
  },
  FrameworkType: {
    Preact: 'preact',
    React: 'react',
    Solid: 'solid',
    Vue3: 'vue3'
  },
  NpmType: {
    Npm: 'npm'
  },
  PeriodType: {
    CreateAPP: 'createApp'
  }
}))

describe('create project', () => {
  let logSpy: jest.SpyInstance

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('should resolve dot project name to current directory', () => {
    const project = new Project({
      projectDir: '/a/b/current-project',
      projectName: '.',
      sourceRoot: __dirname,
      template: 'default',
      templateSource: 'default-template',
      npm: 'npm',
      css: 'none',
      framework: 'react'
    } as any)

    expect(project.conf.projectDir).toBe('/a/b')
    expect(project.conf.projectName).toBe('current-project')
  })

  it('should resolve current directory path project name to current directory', () => {
    const project = new Project({
      projectDir: '/a/b/current-project',
      projectName: './',
      sourceRoot: __dirname,
      template: 'default',
      templateSource: 'default-template',
      npm: 'npm',
      css: 'none',
      framework: 'react'
    } as any)

    expect(project.conf.projectDir).toBe('/a/b')
    expect(project.conf.projectName).toBe('current-project')
  })
})
