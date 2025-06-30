interface Deps {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

interface PackageJson extends Deps {
  scripts?: Record<string, string>
}

type TailwindCSSVersion = '3x' | '4x'

type CompilerType = 'webpack5' | 'vite'