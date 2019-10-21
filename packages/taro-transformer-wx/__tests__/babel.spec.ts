import transform from '../src';
import { buildComponent, baseCode, baseOptions } from './utils';
const options = require('../src/options');

// babel-traverse 无法生成 Hub
// 导致 Path#getSource|buildCodeFrameError 都无法直接使用
// 模拟 babel 插件
const pluginHelper = (result: any) => {
  return () => {
    return {
      visitor: {
        Program(path) {
          result.hub = path.hub;
        }
      }
    };
  };
};

const injectPlugin = plugin => {
  const buildBabelTransformOptions = options.buildBabelTransformOptions;

  options.buildBabelTransformOptions = () => {
    const opts = buildBabelTransformOptions();

    opts.plugins.push(plugin);
    return opts;
  };
};

describe('babel plugin', () => {
  test('path state', () => {
    const result: any = {};
    const plugin = pluginHelper(result);
    injectPlugin(plugin);
    const { code, ast, template } = transform({
      ...baseOptions,
      sourcePath: __filename,
      code: buildComponent(baseCode)
    });

    expect(result.hub.file.opts.filename).toBe(__filename);
  });
});
