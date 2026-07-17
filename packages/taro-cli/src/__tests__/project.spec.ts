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

  it('should resolve windows-style ".\\" project name to current directory', () => {
    const project = new Project({
      projectDir: '/a/b/current-project',
      projectName: '.\\',
      sourceRoot: __dirname,
      template: 'default',
      templateSource: 'default-template',
      npm: 'npm',
      css: 'none',
      framework: 'react'
    } as any)

    expect(project.conf.projectDir).toBe('/a/b')
    expect(project.conf.projectName).toBe('current-project')
    expect(project.conf.initInCurrentDir).toBe(true)
  })

  it('should fall back to process.cwd() when projectDir is empty', () => {
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue('/x/y/z')
    try {
      const project = new Project({
        projectName: '.',
        sourceRoot: __dirname,
        template: 'default',
        templateSource: 'default-template',
        npm: 'npm',
        css: 'none',
        framework: 'react'
      } as any)

      expect(project.conf.projectDir).toBe('/x/y')
      expect(project.conf.projectName).toBe('z')
      expect(project.conf.initInCurrentDir).toBe(true)
    } finally {
      cwdSpy.mockRestore()
    }
  })

  it.each(['..', '../', '.foo', 'foo', 'my-app'])(
    'should keep project name %p unchanged',
    (projectName) => {
      const project = new Project({
        projectDir: '/a/b',
        projectName,
        sourceRoot: __dirname,
        template: 'default',
        templateSource: 'default-template',
        npm: 'npm',
        css: 'none',
        framework: 'react'
      } as any)

      expect(project.conf.projectDir).toBe('/a/b')
      expect(project.conf.projectName).toBe(projectName)
      expect(project.conf.initInCurrentDir).toBeUndefined()
    }
  )

  it('should skip existing-name prompt when initializing in current directory', () => {
    // fs.existsSync 被 mock 为恒 true，模拟目标目录（当前目录）已存在。
    // `.` 场景下不应因此推入“同名目录已存在”的询问。
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

    expect(project.conf.initInCurrentDir).toBe(true)

    const prompts: Record<string, unknown>[] = []
    project.askProjectName(project.conf, prompts)

    expect(prompts).toHaveLength(0)
  })

  it('should prompt for a new name when a same-name directory exists (normal init)', () => {
    // 普通命名 + 目标位置已存在同名目录时，仍应提示换名。
    const project = new Project({
      projectDir: '/a/b',
      projectName: 'existing-project',
      sourceRoot: __dirname,
      template: 'default',
      templateSource: 'default-template',
      npm: 'npm',
      css: 'none',
      framework: 'react'
    } as any)

    expect(project.conf.initInCurrentDir).toBeUndefined()

    const prompts: Record<string, unknown>[] = []
    project.askProjectName(project.conf, prompts)

    expect(prompts).toHaveLength(1)
    expect(prompts[0]).toMatchObject({ name: 'projectName' })
  })
})
