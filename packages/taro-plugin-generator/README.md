# @tarojs/plugin-generator

## 使用

```bash
// config/index.ts
export default defineConfig<'webpack5'>(async (merge, {command, mode}) => {
    const baseConfig: UserConfigExport<'webpack5'> = {
        ...
        plugins: [
            ...,
            "@tarojs/plugin-generator" // 添加插件
        ],
        ...
    }
    ...
}
```

```json
{
    "scripts": {
        ...
        "new": "taro new"
    }
}
```

执行命令，选择需要开启的功能

```bash
> pnpm new

✔ 获取 taro 全局配置成功
? 启用可选功能
❯ 启用「Tailwind CSS」支持
  启用「编译为 ES5」
```