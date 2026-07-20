// 故意语法错误：让 helper.readConfig 的 esbuild 编译抛错，
// 用于覆盖 parseAppConfig 的 config_parse_failed catch 分支。
export default {
  pages: [
    'pages/index/index'
  // 缺少右方括号与右花括号 → esbuild 解析失败
