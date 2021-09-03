---
title: SeoWhy Tangram Create Mini Program
---

## SeoWhy Tangram Introduction
 [SeoWhy Tangram](https://diy.seowhy.com/) is a website to mini program production platform developed by more than a decade of technical precipitation and the mainstay of the webmaster circle, which uses Taro in the bottom of the mini program and supports a variety of mainstream mini program platforms, such as QQ, WeChat, Byte Jump, 360, Alipay, Baidu .

As long as your website is [seowhy 6 system](https://6.seowhy.com/), Wordpress, DedeCMS, Imperial CMS, Zblog, PHPCMS and any of them, then you only need to come to the search outside the jigsaw puzzle, some simple configuration and beautification can be connected to the content of their website a key to the small You only need to come to Jigsaw, do some simple configuration and beautification, you can connect your website content to the small program with one click, to achieve a website, a mini program, multi-channel display.

**Website: https://diy.seowhy.com/**

**Taro Sample：https://diy.seowhy.com/case**

---
## Using SeoWhy Tangram
1. Login and register to have a free mini program
2. design configuration package download mini program package upload

---
## SeoWhy Tangram mini program developer documentation
SeoWhy Tangram mini program makes your own developed system support  mini program too

More Details refer to [《SeoWhy Tangram mini program developer documentation》](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030231)

### Step 1: Define constants
~~~
1. DB_PATH                    Database Directory
2. PROVIDER                   Program Name
~~~

### Step 2: Implementation method
#### 1、main.php
1. appClient class
2. connectProvider method
##### Demo：
1. [dedecms sample](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030187)
2. [wordpresssample](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030188)
*****
#### 2、 provider.php
##### Must implement method:
| Field Name      | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| getPosts        | [Get list data](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030192)                  |
| getCategories   | [Get category list](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030191)              |
| getCategory     | [Get category detail](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030191)            |
| getArticles     | [Get article list](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030194)               |
| getArticle      | [Get article detail](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030191)             |
| getProducts     | [Get product list](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030193)               |
| getProduct      | [Get product detail](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030196)             |
| getPages        | [Get page list](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030197)                  |
| getPage         | [Get page detail](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030198)                |
| getComments     | [Get comments list](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030199)              |
| saveComment     | [Add/modify comments](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030200)            |
| commentAttitude | [Like or disagree with comments](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030201) |
| getMapping      | [Get sitemap](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030203)                    |
| getSiteMapIndex | [Get sitemapIndex](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030204)               |
| _getRelations   | Get related products                                                                      |
| _getSubCatIds   | Get all sub-categories                                                                    |
| getThumb        | Format thumbnails                                                                         |
| convertArticle  | Format article return parameters                                                          |
| convertProduct  | Format product return parameters                                                          |
| convertCategory | Format categories                                                                         |
| convertPage     | Format page                                                                               |
| convertComment  | Format message                                                                            |
| parseContent    | Format Message                                                                            |
| getParams       | Get extension fields                                                                      |
