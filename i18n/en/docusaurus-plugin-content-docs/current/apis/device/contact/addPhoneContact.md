---
title: Taro.addPhoneContact(option)
sidebar_label: addPhoneContact
---

Adds a contact to the mobile contacts. The user can write this form to the mobile contacts using either "Add Contact" or "Add to Existing Contact" method.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/contact/wx.addPhoneContact.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

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
      <td>firstName</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Name</td>
    </tr>
    <tr>
      <td>middleName</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Middle name</td>
    </tr>
    <tr>
      <td>lastName</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Last name</td>
    </tr>
    <tr>
      <td>nickName</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Nickname</td>
    </tr>
    <tr>
      <td>addressCity</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Contact address city</td>
    </tr>
    <tr>
      <td>addressCountry</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Contact address country</td>
    </tr>
    <tr>
      <td>addressPostalCode</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Contact address post code</td>
    </tr>
    <tr>
      <td>addressState</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Contact address province</td>
    </tr>
    <tr>
      <td>addressStreet</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Contact address street</td>
    </tr>
    <tr>
      <td>email</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Email address</td>
    </tr>
    <tr>
      <td>homeAddressCity</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home address city</td>
    </tr>
    <tr>
      <td>homeAddressCountry</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home address county</td>
    </tr>
    <tr>
      <td>homeAddressPostalCode</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home address post code</td>
    </tr>
    <tr>
      <td>homeAddressState</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home address province</td>
    </tr>
    <tr>
      <td>homeAddressStreet</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home address street</td>
    </tr>
    <tr>
      <td>homeFaxNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home fax</td>
    </tr>
    <tr>
      <td>homePhoneNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Home phone number</td>
    </tr>
    <tr>
      <td>hostNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Company phone number</td>
    </tr>
    <tr>
      <td>mobilePhoneNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Mobile number</td>
    </tr>
    <tr>
      <td>organization</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Company</td>
    </tr>
    <tr>
      <td>photoFilePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Path of the local profile photo file</td>
    </tr>
    <tr>
      <td>remark</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Remarks</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Job title</td>
    </tr>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Website</td>
    </tr>
    <tr>
      <td>weChatNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>WeChat ID</td>
    </tr>
    <tr>
      <td>workAddressCity</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work address city</td>
    </tr>
    <tr>
      <td>workAddressCountry</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work address country</td>
    </tr>
    <tr>
      <td>workAddressPostalCode</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work address post code</td>
    </tr>
    <tr>
      <td>workAddressState</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work address province</td>
    </tr>
    <tr>
      <td>workAddressStreet</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work address street</td>
    </tr>
    <tr>
      <td>workFaxNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work fax</td>
    </tr>
    <tr>
      <td>workPhoneNumber</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Work phone number</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.addPhoneContact | ✔️ |  |  |
