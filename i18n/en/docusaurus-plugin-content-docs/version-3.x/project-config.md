---
title: Project Configuration
---

Each type of mini-program platform has its own project profile, for example

* WeChat mini-program, [project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html?search-key=%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE)
* Baidu smart mini-program, [project.swan.json](https://smartprogram.baidu.com/docs/develop/devtools/projectconfig/)
* ByteDance mini-program, [project.config.json](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/basic-reference/catalog-structure/#projectconfigjson-%E9%85%8D%E7%BD%AE%E4%BB%8B%E7%BB%8D)
* QQ mini-program, project.config.json
* Alipay mini-program, Not found
* Jingdong mini-program, Not found

To be able to adapt to the different profiles of different mini-program platforms, Taro supports adding individual project profiles for each mini-program platform.

Projects created through the Taro template will have a project configuration file `project.config.json` by default, which **can only be used for WeChat mini-program**, to be compatible with other  mini-program platforms, please add the configuration file of the corresponding platform according to the following corresponding rules, and the configuration is consistent with the requirements of the respective mini-program platforms.


| Mini-program Platform |  Configuration File |
| --- | --- |
| WeChat mini-program | project.config.json |
| Baidu smart mini-program | project.swan.json |
| ByteDance mini-program | project.tt.json |
| QQ mini-program | project.qq.json |
