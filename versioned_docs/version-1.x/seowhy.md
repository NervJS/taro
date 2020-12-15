---
title: 搜外七巧板
---
### 搜外七巧板是十多年技术沉淀、站长圈中流砥柱的搜外网开发的网站转小程序制作平台，小程序底层使用了Taro，支持多种主流小程序平台，如QQ、微信、字节跳动、360、支付宝、百度 。
### 只要你的网站是[搜外6系统](https://6.seowhy.com/)、Wordpress、DedeCMS、帝国CMS、Zblog、PHPCMS 等其中的任意一种，那么，你只需要来搜外七巧板，进行一些简单的配置与美化就可以将自己网站的内容一键连接到小程序里 ，实现一个网站、一个小程序、多渠道展现。
### 官网地址：https://diy.seowhy.com/
### Taro案例：https://diy.seowhy.com/case

---
## 使用搜外七巧板
###  1.登录注册即可免费拥有一个小程序
###  2.设计配置打包下载小程序打包上传

---
## 加入搜外七巧板小程序开发者 使自己开发的系统也支持小程序
更多详细见：[《搜外七巧板小程序开发者入驻文档》](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030231)

###第一步：定义常量
~~~
1. DB_PATH                    数据库目录
2. PROVIDER                   程序名称
~~~~~~
### 第二步：实现方法
#### 1、main.php
#### appClient 类 
#### connectProvider方法 （读取数据库字段）
##### 范例：
1. [dedecms范例](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030187)
2. [wordpress范例](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030188)
*****
### 2、 provider.php
#### 必须实现方法：
|  字段名 |   说明|
| --- | --- |
| getPosts|              [获得数据列表](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030192) |
| getCategories |         [获得分类列表](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030191) |
| getCategory |           [获得分类详情](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030191) |
| getArticles |           [获得文章列表](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030194) |
| getArticle |            [获得文章详情](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030191) |
| getProducts |           [获得产品列表](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030193) |
| getProduct |            [获得产品详情](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030196) |
| getPages |              [获得单页列表](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030197) |
| getPage |               [获得单页详情](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030198) |
| getComments |           [获得评论列表](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030199) |
| saveComment |           [新增/修改评论](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030200) |
| commentAttitude |       [点赞或反对评论](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030201) |
| getMapping |            [获得sitemap](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030203) |
| getSiteMapIndex |       [获得sitemapIndex](https://www.kancloud.cn/lyc_echo/diy_seowhy_com/2030204) |
| _getRelations |         获得相关产品 |
| _getSubCatIds |         获得所有分类下级 |
| getThumb |              格式化缩略图 |
| convertArticle |        格式化文章返回参数 |
| convertProduct |        格式化产品返回参数 |
| convertCategory |       格式化分类 |
| convertPage |           格式化单页 |
| convertComment |        格式化留言 |
| parseContent |          格式化内容 |
| getParams |             获得扩展字段 |

