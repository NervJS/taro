/**
 * 参考：https://github.com/react-native-community/cli/blob/master/packages/cli/src/commands/init/validate.ts
 */
const NAME_REGEX = /^(?!_)[$A-Z_][0-9A-Z_$]*$/i

// ref: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
const javaKeywords = [
  'abstract',
  'continue',
  'for',
  'new',
  'switch',
  'assert',
  'default',
  'goto',
  'package',
  'synchronized',
  'boolean',
  'do',
  'if',
  'private',
  'this',
  'break',
  'double',
  'implements',
  'protected',
  'throw',
  'byte',
  'else',
  'import',
  'public',
  'throws',
  'case',
  'enum',
  'instanceof',
  'return',
  'transient',
  'catch',
  'extends',
  'int',
  'short',
  'try',
  'char',
  'final',
  'interface',
  'static',
  'void',
  'class',
  'finally',
  'long',
  'strictfp',
  'volatile',
  'const',
  'float',
  'native',
  'super',
  'while'
]

const reservedNames = ['react', 'react-native', ...javaKeywords]

export function validateProjectName (name: string) {
  if (!String(name).match(NAME_REGEX)) {
    return false
  }

  const lowerCaseName = name.toLowerCase()
  if (reservedNames.includes(lowerCaseName)) {
    return false
  }

  return true
}
