import { resolve } from 'node:path'

import * as ts from 'typescript'

it('compiles platform-specific canvas signatures under strict null checking', () => {
  const fixture = resolve(__dirname, 'offscreen.types.ts')
  const program = ts.createProgram([fixture], {
    noEmit: true,
    strictNullChecks: true,
    skipLibCheck: true,
    esModuleInterop: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    types: [],
  })
  const source = program.getSourceFile(fixture)!
  const diagnostics = [
    ...program.getSyntacticDiagnostics(source),
    ...program.getSemanticDiagnostics(source),
  ]
  expect(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))).toEqual([])
})
