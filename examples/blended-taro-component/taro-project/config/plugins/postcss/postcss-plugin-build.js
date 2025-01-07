module.exports = (opts = {}) => {
  // 插件的默认选项
  const options = Object.assign({
    designWidth: 750
  }, opts);

  return {
    postcssPlugin: 'postcss-plugin-build',
    Once(root) {
      root.walkDecls(decl => {
        const value = decl.value;
        if(typeof value === 'string' && value.endsWith('vw')){
          const numOfVw = Number(value.substring(0, value.length - 2))
          const numOfPx = numOfVw / 100 * options.designWidth
          decl.value = `${numOfPx}px`
        }
      });
    }
  };
};

module.exports.postcss = true;