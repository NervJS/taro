---
title: Contribution Guide
---

正如我们在[《给开发者的信》](./join-in) 中所写的，我们非常欢迎各位开发者为 Taro 社区做出贡献。

Before doing so, please take some time to read the following and make sure that your contribution is consistent with the norms and can help the community.

## Forms of contribution

> “How do Taro communities work?How can I participate?”

Taro receives contributions in various forms, whether by submitting a major change, providing feedback on a question or participating in a discussion can enhance the network effect of Taro and make Taro increasingly useful.

Next, we collated the various breakdowns that are common in the daily operations of the Taro community.Developers can start by “participating in discussions”, “asking the question” step by step into the community, and Taro can grow together with each other.

### Engage in discussion

Can participate in discussions with the corresponding block of [Taro Forum](https://github.com/NervJS/taro/discussions).

The developers are also very welcome to review and participate in the discussions on Taro Github that constantly produce [Issues](https://github.com/NervJS/taro/issues) and [Full Requests](https://github.com/NervJS/taro/pulls).

### Bug Feedback

Please use [Issue Generating Tool](https://issue.taro.zone/) submit bug feedback and provide all necessary information as detailed as possible, preferably with a replicable Demo.

Normally, the more complete the**information is provided, the shorter the response time**

### Feature Request

If you have a Feature Request, please go to the[forum](https://github.com/NervJS/taro/discussions/categories/feature-request)to create a new post to describe it.

Taro 会收集重要的 Feature Requests，在 [《来为 Taro 的 Feature Request 投票吧！Publish in](https://github.com/NervJS/taro/issues/6997) where developers can vote as needed. Requires strong features to be supported by**preferences**

### Modify document

The document is a bridge between the developer and the frame, but it has been a weakness of Taro.While we will continue to improve the documentation, we also hope that the community will help us to get it right.

当阅读时遇到明显的错误，开发者可以点击每篇文档最下方的 `Edit this page` 按钮，即会打开 Github 的编辑界面。The developer can submit a Full Request after editing the document.

If a more complex modification, action can be taken by following steps：

#### 1. Download Taro repository

```bash
$ git clone git@github.com:NervJ/taro.git
```
#### 2. Switch to docs branch

```bash
$ git checkout docs
```
#### 3. Build Preview

```bash
$ npm run start
```

#### 4. Modify and add corresponding document

> Documents support `md` and `mdx` suffix, syntax [Docusaur Network](https://docusaurus.io/docs/next/markdown-features)

##### 4.1 Document modification

Go to the `docs` directory, find the corresponding file to edit.(must, for the next**version of**related documents)

进入 `versioned_docs/version-3.x` 目录，找到对应的文件进行编辑。(Optional, reference to the relevant document**version 3.x**.Do not modify before the Taro team updates the document version `3.x` before syncing to the document)

##### 4.2 Add document

Add documents and modify documents similar to `docs` and `versioned_docs/version-3.x` add a new file.The path to the above new files is then added to `sidebars.js` and `versioned_sidebars/version-3.x-sidebars.json`.

### New Idea

The Taro team is a third party developer within the community and when submitting a major feature for Taro must operate under the Taro [RFC (Request For Comment) mechanism](https://github.com/NervJS/taro-rfcs) and then submit the code after community discussions have been completed.

因此如果你对 Taro 的发展有新的想法，如实现一个重要功能、拓展新的使用场景等，需要先撰写对应功能的 **RFC** 文档，Taro 团队会进行一系列推送，在社区征集意见。

> Can access [taro-rfc repository](https://github.com/NervJS/taro-rfcs)submit RFC or view related RFC.

### Submit Code

> “What direction can I get started?What should be done?”

Developers can start by processing issues,[here](https://github.com/NervJS/taro/issues?q=label%3A%22good+first+issue%22+is%3Aissue+is%3Aopen)will list all issues marked as **Help Wanted** and will be assigned to `Easy`, `Medium`, `Hard` of three ease of use.

In addition to helping to deal with issues, Taro has many directions that require manpower.

With familiarity with the internal operating mechanisms of Taro, developers may generate new ideas, such as the desire to develop new functionalities.This will require the development of RFC documents before starting coding when community discussions are complete.

Prior to development, please read Taro Warehouse Overview which provides information on how Taro Repositories, how to develop and submit specifications.

### Tool sharing

Share your "wheel" in the community (e.g.**SDK**,**component**,**plugins**,**UI library**,**Open source projects**and so on).

Can be submitted to [Taro Material Market](https://taro-ext.jd.com), document[Community Quality Materials](./treasures) , repository [avesome-taro](https://github.com/NervJS/awesome-taro) and provide full description.Then add a discussion to the [Taro Forum](https://github.com/NervJS/taro/discussions/categories/%E7%94%9F%E6%80%81) to communicate with developers.

The Taro team regularly selects excellent material sink integrals and promotes them in Taro communities and in influential front-end channels.

### Case sharing

分享你的成功案例，可以提交到 [taro-user-cases](https://github.com/NervJS/taro-user-cases)（只需提交小程序码、二维码）。

### Article Submission

Share your experience (tutorials, articles, etc.) to contribute to the Taro community

## Credits

感谢以下所有给 Taro 贡献过代码的开发者：

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&avatarHeight=36&button=false" /></a>
