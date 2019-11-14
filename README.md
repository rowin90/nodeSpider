# nodeSpider
node spider 聚合微服务

# 用途
- 该 nodeSpider 对外提供一套 web 服务，提供市面上各种内容服务

# 微服务
1. 所有爬虫，需要调用/admin/spider,将自己的服务被发现，经过验证通过后入库。
```
// 注册服务

PATH: /api/service
METHOD: POST
CONTENT-TYPE: application/json
REQUEST-BODY:
    {
        service: {
            name: String, // 服务名，不能与数据库中现有服务重名
            validationUrl, // 验证URL，爬虫服务需要在该URL被访问时采取正确的回应
        }
    }
SUCCESS-RESPONSE-BODY:
    {
        code:0,
    }
ERROR-RESPONSE-BODY:
    {
        code: errorCode,
        msg: errorMsg,
    }
```
2. 【爬虫应该具有的格式】符合该数据，必须拥有数据的格式
```
title: {type: String, required: true, }
contentType: { type: String, } // link, full-text, dom, video, audio
content: { type: Mixed, },
tags: [{
    tagName: String,
    tagvalue: String ,
    score: Number, 
}]，
contentId: String,
source: {type: String, required: true}
```
3. 验证接口：通过调用该接口，爬虫服务应该返回符合规范的内容，以标识爬虫能够兼容聚合系统的协议
```
PATH: 由注册服务接口规定
METHOD: GET
CONTENT-TYPE: application/json
SUCCESS-RESPONSE-BODY:
    {
        code:0,
        protocol: {
            version: String,
            name: 'FULL_NET_SPIDER_PROTOCOL',
            },
        config:{
            singleContent:{
                    url: String,
                    frequencyLimit: Number,
                },
            contentList:{
                    url: String,
                    pageSizeLimit: Number,
                    frequencyLimit: Number,
                },
        }
    }
ERROR-RESPONSE-BODY:
    {
        code: errorCode,
        msg: errorMsg,
    }
```
4. 验证通过后，获取多条内容接口
```
PATH: 由验证接口返回
METHOD: GET
CONTENT-TYPE: application/json
REQUEST-PARAMS:
{
    pageSize: Number,
    latestId: String,
}
SUCCESS-RESPONSE-BODY:
{
    code:0,
    data:{
        contentList:[],
    },
}
```

# 服务通讯协议
- 本协议使用HTTP/1.1协议进行通讯，通过约定一系列的接口，实现爬虫微服务与聚合推荐系统的数据共通与同步 协议名称：FULL_NET_SPIDER_PROTOCOL/0.1


# 技术栈
- express
- mongod + mongoose
- winston + winston-daily-rotate-file 日志处理
- jwt 鉴权

# 遗留的问题
1. web 服务抓取爬虫，爬虫自己的服务出错了，如何处理？如何报警反馈？延迟获取策略（如隔 1h，5h，24h……）
2. 爬虫服务有修改，如何通知到 web 服务？如何更改信息


