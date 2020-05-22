---
title: Taro.addPhoneContact(option)
sidebar_label: addPhoneContact
id: version-2.1.1-addPhoneContact
original_id: addPhoneContact
---

添加手机通讯录联系人。用户可以选择将该表单以「新增联系人」或「添加到已有联系人」的方式，写入手机系统通讯录。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/contact/wx.addPhoneContact.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>firstName</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>名字</td>
    </tr>
    <tr>
      <td>addressCity</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>联系地址城市</td>
    </tr>
    <tr>
      <td>addressCountry</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>联系地址国家</td>
    </tr>
    <tr>
      <td>addressPostalCode</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>联系地址邮政编码</td>
    </tr>
    <tr>
      <td>addressState</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>联系地址省份</td>
    </tr>
    <tr>
      <td>addressStreet</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>联系地址街道</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>email</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>电子邮件</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>homeAddressCity</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅地址城市</td>
    </tr>
    <tr>
      <td>homeAddressCountry</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅地址国家</td>
    </tr>
    <tr>
      <td>homeAddressPostalCode</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅地址邮政编码</td>
    </tr>
    <tr>
      <td>homeAddressState</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅地址省份</td>
    </tr>
    <tr>
      <td>homeAddressStreet</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅地址街道</td>
    </tr>
    <tr>
      <td>homeFaxNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅传真</td>
    </tr>
    <tr>
      <td>homePhoneNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>住宅电话</td>
    </tr>
    <tr>
      <td>hostNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>公司电话</td>
    </tr>
    <tr>
      <td>lastName</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>姓氏</td>
    </tr>
    <tr>
      <td>middleName</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>中间名</td>
    </tr>
    <tr>
      <td>mobilePhoneNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>手机号</td>
    </tr>
    <tr>
      <td>nickName</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>昵称</td>
    </tr>
    <tr>
      <td>organization</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>公司</td>
    </tr>
    <tr>
      <td>photoFilePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>头像本地文件路径</td>
    </tr>
    <tr>
      <td>remark</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>备注</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>职位</td>
    </tr>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>网站</td>
    </tr>
    <tr>
      <td>weChatNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>微信号</td>
    </tr>
    <tr>
      <td>workAddressCity</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作地址城市</td>
    </tr>
    <tr>
      <td>workAddressCountry</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作地址国家</td>
    </tr>
    <tr>
      <td>workAddressPostalCode</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作地址邮政编码</td>
    </tr>
    <tr>
      <td>workAddressState</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作地址省份</td>
    </tr>
    <tr>
      <td>workAddressStreet</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作地址街道</td>
    </tr>
    <tr>
      <td>workFaxNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作传真</td>
    </tr>
    <tr>
      <td>workPhoneNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>工作电话</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.addPhoneContact | ✔️ |  |  |
