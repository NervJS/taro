---
title: CLI Command
---

Common Taro CLI command.

### View all Taro commands and help

```bash
$ taro --help
```

### Environment and Dependency Detection

Taro provides a command to detect information such as the Taro environment and the version of dependence, to facilitate access to the project's environment and dependence, and to troubleshoot environmental issues.Please attach `taro info` printed information to help developers quickly locate issues when raising an issue.

``` bash
$ taro info
👽 Taro v3.0.7



  Taro CLI 3.0. Environment info:
    System:
      OS: macOS High Sierra 10. 3.6
      Shell: 5. - /bin/zsh
    Binaries:
      Node: 13.14.0 - ~/. vm/versions/node/v13.14.0/bin/node
      Yarn: 1.22.4 - ~/.nvm/versions/node/v13.14.0/bin/yarn
      npm: 6. 4.4 - ~/.nvm/versions/node/v13.14.0/bin/npm
    npmPackages:
      @tarojs/components: 1.3. 7 => 1.3.27
      @tarojs/router: 1.3. 7 => 1.3.27
      @tarojs/taro: 1.3. 7 => 1.3.27
      @tarojs/taro-h5: 1.3. 7 => 1.3.27
      @tarojs/webpack-runner: 1.3. 7 => 1.3.27
      eslint-config-taro: 1.3. 7 => 1.3.27
      eslint-plugin-taro: 1.3. 7 => 1.3.27
      nerv-devtools: 1.5. => 1.5.5
      nervjs: 1.5.5 => 1.5.5

```

### Taro Doctor

Taro Doctor, like a doctor, can diagnose problems with project dependence, set-up, structure, and code specifications and try to provide solutions.

But, unlike the real doctor, Taro Doctor does not need to be queued or expensive.你只需要在终端运行命令：`taro doctor`，就像图里一样：

![Taro Doctor Diagnostic Results Map](https://img10.360buyimg.com/ling/jfs/t1/46613/36/5573/202581/5d357d14E6f0df7e1/fc026be7dc69dcf2.png)

### Quick Create New Page

Taro create --name [页面名称] allows you to quickly generate new page files in the current project's pages directory and fill in base code as a professor that increases development efficiency.

### CLI Configuration

Taro creates a .taro folder in user roots, where .taro/index.json is used to store CLI configurations.

Developer can use `taro config` command to perform a series of actions on configuration items：

```bash
# View usage
$ taro config --help
# config entry<key>values are<value>
$ taro config set <key> <value>
# read config entry<key>
$ target config get <key>
# Delete config item<key>
$ taro config delete <key>
# Print all config items
$ taro config list [--json]
```
