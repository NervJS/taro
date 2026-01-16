import { execSync, spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'

import { STATIC_FOLDER_NAME } from '../src/utils'
import { PKG_NAME, PKG_VERSION } from '../src/utils/constant'
import { workspaceRoot } from './constant'

const args = process.argv
const extraIdx = args.indexOf('--')
const publishCode: string = args[extraIdx + 1]

let homeDir = os.homedir()
if (homeDir === '/github/home') {
  homeDir = '/root'
}

execSync(`ohpm config set key_path ${homeDir}/.ssh/taro_harmony`, {
  cwd: workspaceRoot,
  encoding: 'utf8',
  stdio: 'inherit',
  env: process.env,
})

const harPath = path.resolve(workspaceRoot, STATIC_FOLDER_NAME, `${PKG_NAME}-${PKG_VERSION}.har`)
let cmd = `ohpm publish --publish_id ${publishCode} ${harPath}`
const tag = PKG_VERSION.match(/^(\d+(?:\.\d+)*)-([^.\s]+)\.(\d+)?$/)
if (tag && tag[2]) {
  cmd += ` --tag ${tag[2]}`
}

runWithFixedExpect(cmd, publishCode)

export function runWithFixedExpect(command: string, publishCode: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn('expect', ['-c', `
set timeout 120
set publish_code "${publishCode}"
puts "========================================"

spawn ${command}

expect {
  -re "(?i).*passphrase.*private.*key.*" {
    send "$publish_code"
    flush stdout

    sleep 0.2
    send "\r"

    puts "send private key."
    exp_continue
  }
  eof {
    puts "${command} exit"
  }
  timeout {
    puts "${command} timeout"
    exit 1
  }
}
`], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env
    })

    child.stdout.on('data', (data) => {
      process.stdout.write(data)
    })

    child.stderr.on('data', (data) => {
      process.stderr.write(data)
    })

    child.on('close', (code) => {
      console.log(`\n📋 expect 进程退出: ${code}`) // eslint-disable-line no-console
      resolve(code || 0)
    })

    child.on('error', (error) => {
      console.error('❌ expect 执行错误:', error.message)
      reject(error)
    })
  })
}
