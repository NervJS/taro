export const babelPresets = [
  [
    require.resolve('@babel/preset-env'), {
      shippedProposals: true,
      targets: 'defaults, not ie 11, not ie_mob 11',
      modules: false,
      useBuiltIns: false,
      // 排除已广泛支持的特性
      exclude: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-async-to-generator',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-block-scoped-functions',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-classes',
        '@babel/plugin-transform-computed-properties',
        '@babel/plugin-transform-duplicate-keys',
        '@babel/plugin-transform-for-of',
        '@babel/plugin-transform-function-name',
        '@babel/plugin-transform-literals',
        '@babel/plugin-transform-nullish-coalescing-operator',
        '@babel/plugin-transform-object-super',
        '@babel/plugin-transform-parameters',
        '@babel/plugin-transform-shorthand-properties',
        '@babel/plugin-transform-spread',
        '@babel/plugin-transform-sticky-regex',
        '@babel/plugin-transform-template-literals',
        '@babel/plugin-transform-typeof-symbol',
        '@babel/plugin-transform-unicode-regex',
      ],
    }
  ],
  require.resolve('@babel/preset-typescript')
]
