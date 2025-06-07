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

  constructor(packagePath: string) {
    this.packagePath = packagePath
  }

  getGitLogs(since: string | null = null): string[] {
    const sinceFlag = since ? `--since="${since}"` : ''

    try {
      const output = execSync(`git log ${sinceFlag} --oneline --no-merges -- ${this.packagePath}`, {
        cwd: this.packagePath,
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

  getTitle (type: string) {
    const titles: Record<string, string> = {
      feat: '✨ Features',
      fix: '🐛 Bug Fixes',
      docs: '📚 Documentation',
      style: '💎 Styles',
      refactor: '📦 Code Refactoring',
      perf: '🚀 Performance Improvements',
      test: '🚨 Tests',
      chore: '🔧 Chores'
    }
    return titles[type] || '📝 Other Changes'
  }

  parseCommits(commits: string[]) {
    return commits.reduce((acc, commitLine) => {
      const [, ...messageParts] = commitLine.split(' ')
      const message = messageParts.join(' ')

      // 简单的 conventional commit 解析
      const match = message.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/)
      const type = match ? match[1] : 'other'

      if (!acc[type]) {
        acc[type] = { title: this.getTitle(type), commits: [] }
      }
      const category = acc[type] || acc.other
      category.commits.push(parser.sync(message))

      return acc
    }, {} as Record<string, Category>)
  }

  generateMarkdown(version: string, date: string, categories: Record<string, Category>): string {
    let markdown = `## [${version}] - ${date}\n\n`

    Object.values(categories).forEach((category: Category) => {
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

    return markdown
  }

  async generate(version = null) {
    const currentVersion = version || PKG_VERSION
    const currentDate = new Date().toISOString().split('T')[0]

    // 获取上一个版本的标签
    let lastTag: string | null = null
    try {
      const output = execSync('git describe --tags --abbrev=0', {
        cwd: this.packagePath,
        encoding: 'utf8',
        env: process.env,
        stdio: 'inherit',
      })
      lastTag = (output || '').trim()
    } catch (error) {
      console.log('No previous tags found, generating full changelog') // eslint-disable-line no-console
    }

    const commits = this.getGitLogs(lastTag ? `${lastTag}..HEAD` : null)
    const categories = this.parseCommits(commits)

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
    console.log(`✅ Changelog generated for ${PKG_NAME}`) // eslint-disable-line no-console

    return finalChangelog
  }
}

const generator = new ChangelogGenerator(path.join(__dirname, '..', 'harmony_project/library'))
generator.generate()
