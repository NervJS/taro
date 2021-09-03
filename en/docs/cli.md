---
title: CLI 命令
---

常用的 Taro CLI 命令。

### 查看 Taro 所有命令及帮助

```bash
$ taro --help
```

### 环境及依赖检测

Taro 提供了命令来一键检测 Taro 环境及依赖的版本等信息，方便大家查看项目的环境及依赖，排查环境问题。在提 issue 的时候，请附上 `taro info` 打印的信息，帮助开发人员快速定位问题。

``` bash
$ taro info
👽 Taro v3.0.7



  Taro CLI 3.0.7 environment info:
    System:
      OS: macOS High Sierra 10.13.6
      Shell: 5.3 - /bin/zsh
    Binaries:
      Node: 13.14.0 - ~/.nvm/versions/node/v13.14.0/bin/node
      Yarn: 1.22.4 - ~/.nvm/versions/node/v13.14.0/bin/yarn
      npm: 6.14.4 - ~/.nvm/versions/node/v13.14.0/bin/npm
    npmPackages:
      @tarojs/components: 1.3.27 => 1.3.27
      @tarojs/router: 1.3.27 => 1.3.27
      @tarojs/taro: 1.3.27 => 1.3.27
      @tarojs/taro-h5: 1.3.27 => 1.3.27
      @tarojs/webpack-runner: 1.3.27 => 1.3.27
      eslint-config-taro: 1.3.27 => 1.3.27
      eslint-plugin-taro: 1.3.27 => 1.3.27
      nerv-devtools: 1.5.5 => 1.5.5
      nervjs: 1.5.5 => 1.5.5

```

### Taro Doctor

Taro Doctor 就像一个医生一样，可以诊断项目的依赖、设置、结构，以及代码的规范是否存在问题，并尝试给出解决方案。

但和真正的医生不一样，Taro Doctor 不需要排队挂号，也不用花钱。你只需要在终端运行命令：`taro doctor`，就像图里一样：

![Taro Doctor 诊断结果图](https://img10.360buyimg.com/ling/jfs/t1/46613/36/5573/202581/5d357d14E6f0df7e1/fc026be7dc69dcf2.png)

### 快速创建新页面

Taro create --name [页面名称] 能够在当前项目的pages目录下快速生成新的页面文件，并填充基础代码，是一个提高开发效率的利器。

### CLI 配置

Taro 会在用户根目录下创建 .taro 文件夹，其中 .taro/index.json 用于存放 CLI 相关配置。

开发者可以使用 `taro config` 命令对配置项进行一系列操作：

```bash
# 查看用法
$ taro config --help
# 设置配置项<key>的值为<value>
$ taro config set <key> <value>
# 读取配置项<key>
$ taro config get <key>
# 删除配置项<key>
$ taro config delete <key>
# 打印所有配置项
$ taro config list [--json]
```
