const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)
  let code = codeBuffer.toString().replace(/import\stype\s\{\s([^}]*)\s\}\sfrom\s'@tarojs\/components[^']*';/ig, `import type { $1 } from '@tarojs/components/dist/types/components';`)
  code = code.replace(/const\sTaro([A-Za-z]+)\s=/g, 'const $1 =').replace(/const\s([A-Za-z]+)Core\s=/g, 'const $1 =')

  if (code.includes('defineCustomElement as define')) {
    code = code.replace(/import\s\{\sdefineCustomElement\sas\sdefine([A-Za-z]+)\s.*/g, '// @ts-ignore\nimport { defineCustomElement$1 as define$1 } from \'@tarojs/components/dist/components\';')
  }

  if (!code.includes('slots.default')) {
    const comps = ['Block', 'CustomWrapper']
    code = code.replace('/* auto-generated vue proxies */', `/* auto-generated vue proxies */\nimport { defineComponent } from 'vue'`)
    code = code.replace(new RegExp(`export const (${comps.join('|')}) = \\/\\*\\@__PURE__\\*\\/ defineContainer[^;]*;`, 'ig'), 'export const $1 = defineComponent((__props, { slots }) => slots.default);')
  }

  fs.writeFileSync(componentsPath, code)
}
