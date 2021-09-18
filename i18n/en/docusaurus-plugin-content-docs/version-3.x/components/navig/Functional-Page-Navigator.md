---
title: FunctionalPageNavigator
sidebar_label: FunctionalPageNavigator
---

This component takes effect only in plug-ins. It is used to navigate to a feature page of a plug-in.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/functional-page-navigator.html)

## Type

```tsx
ComponentType<FunctionalPageNavigatorProps>
```

## FunctionalPageNavigatorProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>version</td>
      <td><code>&quot;develop&quot; | &quot;trial&quot; | &quot;release&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;release&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The version of the Mini Program to be navigated to. The online version must be set to release.</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>&quot;loginAndGetUserInfo&quot; | &quot;requestPayment&quot; | &quot;chooseAddress&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The feature page to be navigated to.</td>
    </tr>
    <tr>
      <td>args</td>
      <td><code>object</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A parameter of the feature page, in a format that is specific to the feature page.</td>
    </tr>
    <tr>
      <td>onSuccess</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the feature page is returned and the operation succeeds. The format of detail is specific to the feature page.</td>
    </tr>
    <tr>
      <td>onFail</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the feature page is returned and the operation failed. The format of detail is specific to the feature page.</td>
    </tr>
    <tr>
      <td>onCancel</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the feature page is returned and the operation cancelled. The format of detail is specific to the feature page.</td>
    </tr>
  </tbody>
</table>

### Property Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FunctionalPageNavigatorProps.version | ✔️ |  |  |
| FunctionalPageNavigatorProps.name | ✔️ |  |  |
| FunctionalPageNavigatorProps.args | ✔️ |  |  |
| FunctionalPageNavigatorProps.onSuccess | ✔️ |  |  |
| FunctionalPageNavigatorProps.onFail | ✔️ |  |  |
| FunctionalPageNavigatorProps.onCancel | ✔️ |  |  |

### version

Valid values of version

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>develop</td>
      <td>Developer version</td>
    </tr>
    <tr>
      <td>trial</td>
      <td>Test version</td>
    </tr>
    <tr>
      <td>release</td>
      <td>Official</td>
    </tr>
  </tbody>
</table>

### name

Valid values of name

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description	</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>loginAndGetUserInfo</td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/plugin/functional-pages/user-info.html">Feature Page of User Information</a></td>
    </tr>
    <tr>
      <td>requestPayment</td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/plugin/functional-pages/request-payment.html">Feature Page of Payment</a></td>
    </tr>
    <tr>
      <td>chooseAddress</td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/plugin/functional-pages/choose-address.html">Feature Page of Recipient Addresses</a></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FunctionalPageNavigator | ✔️ |  |  |
