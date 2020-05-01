# Taro 文档

```bash
.
├── LICENSE
├── README.md
├── blog # 博客
├── docs # 最新版本文档
├── docusaurus.config.js
├── node_modules
├── package.json
├── sidebars.js # 最新版本文档导航
├── src # 文档主题
├── static # 静态文件
├── tsconfig.json
├── versioned_docs # 版本文档
├── versioned_sidebars # 版本文档导航
├── versions.json
└── yarn.lock
```

## 开发流程

1. 从最新版本的 `docs` 分支新建一个分支：`git checkout -b docs/fix-something`
2. 提交新建的分支发起 Pull Request
3. 在 Pull Request 页面中如果编译成功，则会自动部署一个预览站点
4. 预览站点确认修改无误后 Merge 到 `docs` 分支，则会自动部署到 GitHub Pages 和 taro-docs.jd.com

## 修改文档

### v1 或 v2

修改 [versioned_docs](./versioned_docs) 和 [versioned_sidebars](./versioned_sidebars) 对应的文件。

### v3

修改 [docs](./docs) 和 [sidebars.js](./sidebars.js) 对应的文件。

## 升级文档

### v1 或 v2

v1 或 v2 不升级版本，直接修改 [versioned_docs](./versioned_docs) 和 [versioned_sidebars](./versioned_sidebars) 对应的文件。

### v3

运行命令：`npm run docusaurus docs:version <semver>`
