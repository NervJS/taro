'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonjs = require('@rollup/plugin-commonjs');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var lodash = require('lodash');
var rollup = require('rollup');
var externals = require('rollup-plugin-node-externals');
var postcss = require('rollup-plugin-postcss');
var ts = require('rollup-plugin-ts');

const baseConfig = {
    output: {
        sourcemap: true,
        exports: 'named',
    },
    treeshake: false,
    plugins: [
        externals({
            deps: true,
            devDeps: false,
        }),
        pluginNodeResolve.nodeResolve({
            preferBuiltins: false,
            mainFields: ['browser', 'module', 'jsnext:main', 'main'],
        }),
        ts({
            tsconfig: (e) => (Object.assign(Object.assign({}, e), { sourceMap: true })),
        }),
        commonjs(),
        postcss({
            // extract: true, Note: 开启需要在 @tarojs/plugin-platform-h5 中的 API 引入样式
            inject: { insertAt: 'top' },
            minimize: true,
        }),
    ],
};
const variesConfig = [
    {
        input: ['src/index.ts', 'src/api/index.ts', 'src/api/taro.ts'],
        output: {
            dir: 'dist',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
    },
];
if (process.env.NODE_ENV === 'production') {
    variesConfig.push({
        input: 'src/index.ts',
        output: {
            format: 'cjs',
            file: 'dist/index.cjs.js',
            inlineDynamicImports: true,
        },
    }, {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.esm.js',
            inlineDynamicImports: true,
        },
    });
}
variesConfig.push({
    input: 'src/index.ts',
    output: {
        file: 'dist/index.esm.js',
        inlineDynamicImports: true
    }
});
var rollup_config = rollup.defineConfig(variesConfig.map((v) => {
    const customizer = function (objValue, srcValue) {
        if (Array.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
        if (typeof objValue === 'object') {
            return lodash.mergeWith({}, objValue, srcValue, customizer);
        }
    };
    return lodash.mergeWith({}, baseConfig, v, customizer);
}));

exports.default = rollup_config;
