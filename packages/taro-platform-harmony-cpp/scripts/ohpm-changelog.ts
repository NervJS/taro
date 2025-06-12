import { execSync } from 'node:child_process'
import path from 'node:path'

import { fs } from '@tarojs/helper'
import parser from 'conventional-commits-parser'

import { PKG_NAME, PKG_VERSION } from '../src/utils/constant'

import type { Commit } from 'conventional-commits-parser'

// 定义分类接口
interface Category {
  title: string
  commits: Commit[]
}

export default class ChangelogGenerator {
  packagePath: string
  sinceFlag?: string
  exclude: (string | RegExp)[] = [
    /\b(init|publish|log|docs)\b/,
    /\bupdate\b.*\b(hash|library|linense|runtime|version)\b/,
    /\breadme\b/i
  ]

  constructor(packagePath: string) {
    this.packagePath = packagePath

    // 获取上一个版本的标签
    try {
      const output = execSync('git describe --tags --abbrev=0', {
        cwd: this.packagePath,
        encoding: 'utf8',
        env: process.env,
        stdio: 'pipe',
      })
      const tag = (output || '').trim()
      this.sinceFlag = tag ? `${tag}..HEAD` : ''
    } catch (error) {
      console.log('No previous tags found, generating full changelog', error) // eslint-disable-line no-console
    }
  }

  getGitLogs(since?: string, pkgPath = this.packagePath): string[] {
    try {
      const output = execSync(`git log ${since || ''} --oneline --no-merges -- ${pkgPath}`, {
        cwd: pkgPath,
        encoding: 'utf8',
        env: process.env,
        stdio: 'pipe',
      })
      return (output || '').trim().split('\n').filter((line: string) => line.length > 0)
    } catch (error) {
      console.error('Error getting git logs:', error)
      return []
    }
  }

  titles: Record<string, string> = {
    feat: '✨ Features',
    fix: '🐛 Bug Fixes',
    docs: '📚 Documentation',
    style: '💎 Styles',
    refactor: '📦 Code Refactoring',
    perf: '🚀 Performance Improvements',
    test: '🚨 Tests',
    chore: '🔧 Chores'
  }

  getTitle (type: string) {
    return this.titles[type] || '📝 Other Changes'
  }

  parseCommits(commits: string[], categories: Record<string, Category> = {}, defaultScope) {
    return commits.reduce((acc, commitLine) => {
      const [, ...messageParts] = commitLine.split(' ')
      const message = messageParts.join(' ')

      // 简单的 conventional commit 解析
      const match = message.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/)
      const type = match && Object.keys(this.titles).includes(match[1]) ? match[1] : 'other'

      if (!acc[type]) {
        acc[type] = { title: this.getTitle(type), commits: [] }
      }
      const category = acc[type] || acc.other
      if (!this.exclude.some(e => typeof e === 'string' ? message.includes(e) : e.test(message))) {
        const commit = parser.sync(message)
        if (category.commits.every(e => (commit.subject || commit.header) && (commit.subject || commit.header) !== (e.subject || e.header))) {
          commit.scope = typeof commit.scope !== 'string' || commit.scope === 'harmony'
            ? defaultScope
            : `${defaultScope}(${commit.scope})`
          category.commits.push(commit)
        }
      }

      return acc
    }, categories)
  }

  generateMarkdown(version: string, date: string, categories: Record<string, Category>): string {
    let markdown = `## [${version}] - ${date}\n\n`
    let count = 0

    Object.values(categories).forEach((category: Category) => {
      count += category.commits.length

      if (category.commits.length > 0) {
        markdown += `### ${category.title}\n\n`
        category.commits.forEach((commit: Commit) => {
          // 使用解析后的 subject 或 header
          const message = commit.subject || commit.header || 'No message'
          const scope = commit.scope ? `**${commit.scope}**: ` : ''
          markdown += `- ${scope}${message}\n`
        })
        markdown += '\n'
      }
    })

    if (count === 0) {
      markdown += `更新内置运行时等若干特性，对齐主包版本。\n\n`
    }

    return markdown
  }

  async generate(version?: string, categories: Record<string, Category> = {}) {
    const currentVersion = version || PKG_VERSION
    const currentDate = new Date().toISOString().split('T')[0]

    const commits = this.getGitLogs(this.sinceFlag)
    this.parseCommits(commits, categories, 'HAR')

    const newChangelog = this.generateMarkdown(currentVersion, currentDate, categories)

    // 读取现有的 changelog
    const changelogPath = path.join(this.packagePath, 'CHANGELOG.md')
    let existingChangelog = ''

    if (fs.existsSync(changelogPath)) {
      existingChangelog = fs.readFileSync(changelogPath, 'utf8')
    } else {
      existingChangelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n'
    }

    // 合并新旧 changelog
    const headerEnd = existingChangelog.indexOf('\n## ')
    const header = headerEnd !== -1 ? existingChangelog.substring(0, headerEnd + 1) : existingChangelog
    const oldContent = headerEnd !== -1 ? existingChangelog.substring(headerEnd + 1) : ''

    const finalChangelog = header + newChangelog + oldContent

    fs.writeFileSync(changelogPath, finalChangelog)
    console.log(`✅ Changelog generated for ${PKG_NAME}:`, newChangelog) // eslint-disable-line no-console

    return finalChangelog
  }
}

const generator = new ChangelogGenerator(path.join(process.cwd(), 'harmony_project/library'))
const categories = generator.parseCommits(generator.getGitLogs(generator.sinceFlag, process.cwd()), {}, 'Plugin')
generator.parseCommits(generator.getGitLogs(generator.sinceFlag, path.join(process.cwd(), 'harmony_project/library/src/main/cpp')), categories, 'C-API')
generator.generate(PKG_VERSION, categories)
