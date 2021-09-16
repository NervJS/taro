---
title: CLI Command
---

Common Taro CLI commands.

### View all Taro commands and help

```bash
$ taro --help
```

### Environmental and Dependency Testing

Taro provides commands to check the version of Taro environment and dependencies with one click, so that you can check the environment and dependencies of your project and troubleshoot environment problems. When raising an issue, please include the information printed in `taro info` to help developers locate the problem quickly.

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

Taro Doctor acts like a doctor who can diagnose the project's dependencies, settings, structure, and the specification of the code for problems and try to give solutions.

But unlike a real doctor, Taro Doctor doesn't need to wait in line to register and doesn't cost anything. You just need to run the command: `taro doctor` in the terminal, as in the picture.

![Taro Doctor Diagnostic Result Chart](https://img10.360buyimg.com/ling/jfs/t1/46613/36/5573/202581/5d357d14E6f0df7e1/fc026be7dc69dcf2.png)

### Quickly create new pages

Taro create --name [page name] can quickly generate new page files in the current project's pages directory and populate the base code, making it a great tool for improving development efficiency.

### CLI Configuration

Taro creates a .taro folder in the user's root directory, where .taro/index.json is used to store CLI-related configuration.

Developers can use the `taro config` command to perform a number of operations on configuration items.

```bash
# View Usage
$ taro config --help
# Set the value of the configuration item <key> to <value>
$ taro config set <key> <value>
# Read configuration item <key>
$ taro config get <key>
# Delete configuration item <key>
$ taro config delete <key>
# Print all configuration items
$ taro config list [--json]
```
