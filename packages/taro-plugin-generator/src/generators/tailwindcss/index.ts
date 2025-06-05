/* eslint-disable no-console */

import * as inquirer from 'inquirer'

import { getCompilerType } from '../../utils'
import { updateConfig } from './config'
import { updateDeps } from './deps'
import { emit } from './emit'

import type { IPluginContext } from '@tarojs/service'

export async function tailwindcssGenerator(ctx: IPluginContext) {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'version',
    message: '请选择 Tailwind CSS 版本',
    choices: [
      { name: '3.x', value: '3x' },
      { name: '4.x', value: '4x' },
    ],
  })
  const tailwindcssVersion = answer.version as TailwindCSSVersion
  const compilerType = getCompilerType(ctx.initialConfig.compiler)
  if (!compilerType) {
    throw new Error('未找到编译器类型')
  }
  await updateConfig({ ctx, compilerType })
  await emit(ctx)
  await updateDeps({ ctx, tailwindcssVersion })
  console.log('✅ 启用「Tailwind CSS」成功')
}
