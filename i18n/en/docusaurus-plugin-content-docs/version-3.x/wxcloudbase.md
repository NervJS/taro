---
title: Mini Program Cloud Development Template
---

> This feature is supported since `v1.2.20`, only Wechat mini program are supported.

[Cloud Development（CloudBase）](https://www.cloudbase.net?ADTAG=taro), It is a one-stop back-end cloud service built on Serverless architecture, covering functions, database, storage, CDN and other services, free of back-end operation and maintenance, and supporting mini program, Web and APP development.
The cloud-based development can invoke all the open capabilities of WeChat without authentication, and can be opened and used in WeChat developer tools.

## Develop project templates using Mini Program Cloud

In version 1.2.20, a new mini program cloud development project template has been added. To use it, please update the CLI to version `1.2.20` or above. [Update](./GETTING-STARTED.md#更新)

## Templates Directory

```
├── client                                  Mini program Directory
│   ├── config                              Project compilation configuration 
│   │   ├── dev.js                          Development environment configuration
│   │   ├── index.js                        Default Configuration
│   │   └── prod.js                         Production environment configuration
│   ├── dist                                Compilation results directory
│   ├── package.json
│   ├── src                                 Source directory
│   │   ├── app.scss                        Project general style
│   │   ├── app.js                          Project entry file
│   │   ├── components                      Component directory
│   │   │   └── login                       Login component directory
│   │   │       └── index.weapp.js          login component logic
│   │   └── pages                           Page file directory
│   │       └── index                       Index page directory
│   │           ├── index.scss              Index page logic
│   │           └── index.js                Index page style
├── cloud                                   Server Directory
│   └── functions                           Cloud functions directory
│       └── login                           Login cloud function
│           ├── index.js                    Login function logic
│           └── package.json
└── project.config.json                    Mini program configuration  
```

### Usage Points

1. When developing, go to the client directory and run the relevant compile preview or package command in this directory
2. To debug the project using WeChat Developer Tools, please use the project **whole folder** as the run directory. Note: Not the dist folder generated in the client

