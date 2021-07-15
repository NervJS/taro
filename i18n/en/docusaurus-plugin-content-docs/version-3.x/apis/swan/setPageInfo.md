---
title: Taro.setPageInfo(option)
sidebar_label: setPageInfo
---

Baidu Smart-Program can access Baidu Search and Baidu App. `setPageInfo` is responsible for setting up all kinds of basic page information for the applet, including title, keywords, page description, as well as image information and video information.By setting page information for the applet, the developer can help the applet to be displayed and distributed more effectively in search engines and information flow.

> [Reference](https://smartprogram.baidu.com/docs/develop/api/open/swan-setPageInfo/)

## Type

```tsx
(option: Option) => void
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
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Page title</td>
    </tr>
    <tr>
      <td>keywords</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Page keywords</td>
    </tr>
    <tr>
      <td>description</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Page description</td>
    </tr>
    <tr>
      <td>releaseDate</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Original release time (year-month-day hour:minute:second with leading zeros)</td>
    </tr>
    <tr>
      <td>articleTitle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Article (content) title.</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>string | string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Image online address for cover display after infomercial placement, maximum 3 images, single image maximum 2M;<br/>Recommended size of cover image: height&gt;=210px &amp; width&gt;=375px; <br />Minimum size: height&gt;=146px &amp; width&gt;=218px.<br/>For multiple images, use an array.</td>
    </tr>
    <tr>
      <td>video</td>
      <td><code>Video</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Video information. Representation of multiple videos in an array</td>
    </tr>
    <tr>
      <td>visit</td>
      <td><code>Visit</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Information for visit</td>
    </tr>
    <tr>
      <td>likes</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number of likes, if the page is not counted is empty.</td>
    </tr>
    <tr>
      <td>comments</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number of comments, if the page is not counted is empty.</td>
    </tr>
    <tr>
      <td>collects</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number of collects, if the page is not counted is empty.</td>
    </tr>
    <tr>
      <td>shares</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number of shares, if the page is not counted is empty.</td>
    </tr>
    <tr>
      <td>followers</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number of followers, if the page is not counted is empty.</td>
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

### Video

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
      <td>url</td>
      <td><code>string</code></td>
      <td>Address of the video</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>string</code></td>
      <td>Duration of the video (in seconds)</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>string</code></td>
      <td>Cover image of the video</td>
    </tr>
  </tbody>
</table>

### Visit

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
      <td>pv</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Page views</td>
    </tr>
    <tr>
      <td>uv</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Unique views</td>
    </tr>
    <tr>
      <td>sessionDuration</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Length of stay per user on the page, in seconds.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.setPageInfo({
  title: 'title',
  keywords: 'keywords',
  description: 'description',
  articleTitle: 'articleTitle',
  releaseDate: '2019-01-02 12:01:30',
  image: [
      'https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg',
      'https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg'
  ],
  video: [{
      url: 'https://www.baidu.com/mx/v12.mp4',
      duration: '100',
      image: 'https://smartprogram.baidu.com/docs/img/image-scaleToFill.png'
  }],
  visit: {
      pv: '1000',
      uv: '100',
      sessionDuration: '130'
  },
  likes: '75',
  comments: '13',
  collects: '23',
  shares: '8',
  followers: '35',
  success: res => {
      console.log('setPageInfo success');
  },
  fail: err => {
      console.log('setPageInfo fail', err);
  }
})
```

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Taro.setPageInfo |  | ✔️ |  |  |
