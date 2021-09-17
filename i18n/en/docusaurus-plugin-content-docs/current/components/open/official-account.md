---
title: OfficialAccount
sidebar_label: OfficialAccount
---

The Official Account following component. You can add this component to a Mini Program, to help a user conveniently follow an Official Account after the user opens the **Mini Program** by scanning the Mini Program code. This component can be nested into a native component.

Tips

1. Before using this component, you need to go to Mini Program Console, and choose **Settings > API Settings > Official Account Following Component** to set the Official Account to be displayed. **Note: The Official Account and the Mini Program must belong to the same entity.**

2. During the lifecycle of a Mini Program, the capability of displaying the Official Account following component is available only when the Mini Program is opened in any of the following scenarios:

  - The Mini Program is opened by scanning the Mini Program code (scene value 1047).

  - When the Mini Program is opened from **Recently Used** at the top of the Chats screen (scene value 1089), if the Mini Program is not destroyed, the component remains in the same state as that when the Mini Program was last opened.

  - When returning to the Mini Program from another Mini Program (scene value 1038), if the Mini Program is not destroyed, the component remains in the same state as when the Mini Program was opened last time.

3. The minimum width of the component is limited to 300 px and the height is fixed at 84 px.

4. Each page can include only one Official Account following component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/official-account.html)

## Type

```tsx
ComponentType<OfficialAccountProps>
```

## OfficialAccountProps

<table>
  <thead>
     <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;detail&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the component is loaded successfully.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;detail&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the component fails to be loaded.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OfficialAccountProps.onLoad | ✔️ |  |  |
| OfficialAccountProps.onError | ✔️ |  |  |

### detail

detail object

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>status</td>
      <td><code>number</code></td>
      <td>Status code</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

### status

Valid values of status

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>-2</td>
      <td>Network error</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>Data parsing error</td>
    </tr>
    <tr>
      <td>0</td>
      <td>Loading succeeded</td>
    </tr>
    <tr>
      <td>1</td>
      <td>The Official Account following feature in the Mini Program is suspended</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Linked Official Account is suspended</td>
    </tr>
    <tr>
      <td>3</td>
      <td>The Official Account is unlinked or not selected</td>
    </tr>
    <tr>
      <td>4</td>
      <td>The Official Account following feature is disabled</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Scene value error</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Repeated creation</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OfficialAccount | ✔️ |  |  |
