// let protocol = document.location.protocol == 'https:' ? 'https:' : 'http:'
let protocol = 'https:'
const HOSTS = {
  dev: {
    api1: protocol + '//dev.in-hope.com.cn/zuul/', // 接口地址
    api: protocol + '//dev.in-hope.com.cn/v1/', // 接口地址
    host: protocol + '//dev.web.in-hope.com.cn/', // 域名 当前网站域名 不要替换
    enterpriseHost: protocol + '//{{code}}.dev.web.in-hope.com.cn/', // 企业版代码域名
    cookieHost: '.in-hope.com.cn', // cookie域名
    gxfApi: protocol + '//dev.in-hope.com.cn/gxf/',
    appid: 'wx3ca2d017b99dc1ac',
    mobileHost: 'http://dev.in-hope.com.cn/', // 移动端地址
    xinhuUserId: '0bc880d3afb04ab4a1ccce26484494a9', // 信乎大V userId
    // user: protocol + '//192.168.201.3:8899/user/' // 地址更换user
    user: protocol + '//dev.in-hope.com.cn/v1/user/', // 地址更换user
    business: protocol + '//dev.in-hope.com.cn/v1/business/',
    calendar: protocol + '//dev.in-hope.com.cn/v1/calendar/',
    caselaw: protocol + '//dev.in-hope.com.cn/v1/caseLaw/',
    disclosure: protocol + '//dev.in-hope.com.cn/v1/disclosure/',
    enterprise: protocol + '//dev.in-hope.com.cn/v1/enterprise/',
    law: protocol + '//dev.in-hope.com.cn/v1/law/',
    listedcompany: protocol + '//dev.in-hope.com.cn/v1/listCompany/',
    interact: protocol + '//dev.in-hope.com.cn/v1/interact/',
    usermsg: protocol + '//dev.in-hope.com.cn/v1/message/',
    publish: protocol + '//dev.in-hope.com.cn/v1/publish/',
    report: protocol + '//dev.in-hope.com.cn/v1/report/',
    xinhu: protocol + '//dev.in-hope.com.cn/v1/xinhu/',
    sentiment: protocol + '//dev.in-hope.com.cn/v1/sentiment/',
    supervise: protocol + '//dev.in-hope.com.cn/v1/supervise/',
    authority: protocol + '//dev.in-hope.com.cn/v1/authority/'
  },
  development: {
    api: protocol + '//dev.in-hope.com.cn/v1/',
    api1: protocol + '//dev.in-hope.com.cn/zuul/', // 接口地址
    host: protocol + '//dev.web.in-hope.com.cn/', // 当前网站域名 不要替换
    enterpriseHost: protocol + '//{{code}}.dev.web.in-hope.com.cn/', // 企业版代码域名
    cookieHost: '.in-hope.com.cn', // cookie域名
    gxfApi: protocol + '//dev.in-hope.com.cn/gxf/',
    appid: 'wx3ca2d017b99dc1ac',
    mobileHost: 'http://dev.in-hope.com.cn/',
    xinhuUserId: '0bc880d3afb04ab4a1ccce26484494a9',
    user: protocol + '//dev.in-hope.com.cn/v1/user/', // 地址更换user
    business: protocol + '//dev.in-hope.com.cn/v1/business/',
    calendar: protocol + '//dev.in-hope.com.cn/v1/calendar/',
    caselaw: protocol + '//dev.in-hope.com.cn/v1/caseLaw/',
    disclosure: protocol + '//dev.in-hope.com.cn/v1/disclosure/',
    enterprise: protocol + '//dev.in-hope.com.cn/v1/enterprise/',
    law: protocol + '//dev.in-hope.com.cn/v1/law/',
    listedcompany: protocol + '//dev.in-hope.com.cn/v1/listCompany/',
    interact: protocol + '//dev.in-hope.com.cn/v1/interact/',
    usermsg: protocol + '//dev.in-hope.com.cn/v1/message/',
    publish: protocol + '//dev.in-hope.com.cn/v1/publish/',
    report: protocol + '//dev.in-hope.com.cn/v1/report/',
    xinhu: protocol + '//dev.in-hope.com.cn/v1/xinhu/',
    sentiment: protocol + '//dev.in-hope.com.cn/v1/sentiment/',
    supervise: protocol + '//dev.in-hope.com.cn/v1/supervise/',
    authority: protocol + '//dev.in-hope.com.cn/v1/authority/'
  },
  testing: {
    api: protocol + '//test.in-hope.com.cn/v1/',
    host: protocol + '//test.web.in-hope.com.cn/', // 当前网站域名 不要替换
    enterpriseHost: protocol + '//{{code}}.test.web.in-hope.com.cn/', // 企业版代码域名
    cookieHost: '.in-hope.com.cn', // cookie域名
    gxfApi: protocol + '//test.in-hope.com.cn/gxf/',
    appid: 'wx97298db2175d79ae',
    mobileHost: 'http://test.in-hope.com.cn/',
    xinhuUserId: '',
    user: protocol + '//test.in-hope.com.cn/v1/user/', // 地址更换user
    business: protocol + '//test.in-hope.com.cn/v1/business/',
    calendar: protocol + '//test.in-hope.com.cn/v1/calendar/',
    caselaw: protocol + '//test.in-hope.com.cn/v1/caseLaw/',
    disclosure: protocol + '//test.in-hope.com.cn/v1/disclosure/',
    enterprise: protocol + '//test.in-hope.com.cn/v1/enterprise/',
    law: protocol + '//test.in-hope.com.cn/v1/law/',
    listedcompany: protocol + '//test.in-hope.com.cn/v1/listCompany/',
    interact: protocol + '//test.in-hope.com.cn/v1/interact/',
    usermsg: protocol + '//test.in-hope.com.cn/v1/message/',
    publish: protocol + '//test.in-hope.com.cn/v1/publish/',
    report: protocol + '//test.in-hope.com.cn/v1/report/',
    xinhu: protocol + '//test.in-hope.com.cn/v1/xinhu/',
    sentiment: protocol + '//test.in-hope.com.cn/v1/sentiment/',
    supervise: protocol + '//test.in-hope.com.cn/v1/supervise/',
    authority: protocol + '//test.in-hope.com.cn/v1/authority/'
  },
  staging: {
    api: protocol + '//stagingdesktop.in-hope.cn/v1/',
    host: protocol + '//staging.in-hope.com.cn/', // 当前网站域名 不要替换
    enterpriseHost: protocol + '//{{code}}.staging.in-hope.com.cn/', // 企业版代码域名
    cookieHost: '.in-hope.com.cn', // cookie域名
    gxfApi: protocol + '//staginggxf.in-hope.cn/gxf/',
    appid: 'wx97298db2175d79ae',
    mobileHost: 'http://test.in-hope.com.cn/',
    xinhuUserId: '',
    user: protocol + '//api.in-hope.cn/v1/user/', // 地址更换user
    business: protocol + '//api.in-hope.cn/v1/business/',
    calendar: protocol + '//api.in-hope.cn/v1/calendar/',
    caselaw: protocol + '//api.in-hope.cn/v1/caseLaw/',
    disclosure: protocol + '//api.in-hope.cn/v1/disclosure/',
    enterprise: protocol + '//api.in-hope.cn/v1/enterprise/',
    law: protocol + '//api.in-hope.cn/v1/law/',
    listedcompany: protocol + '//api.in-hope.cn/v1/listCompany/',
    interact: protocol + '//api.in-hope.cn/v1/interact/',
    usermsg: protocol + '//api.in-hope.cn/v1/message/',
    publish: protocol + '//api.in-hope.cn/v1/publish/',
    report: protocol + '//api.in-hope.cn/v1/report/',
    xinhu: protocol + '//api.in-hope.cn/v1/xinhu/',
    sentiment: protocol + '//api.in-hope.cn/v1/sentiment/',
    supervise: protocol + '//api.in-hope.cn/v1/supervise/',
    authority: protocol + '//api.in-hope.cn/v1/authority/'
  },
  production: {
    // api: protocol + '//web.in-hope.cn/v1/',
    api: protocol + '//api.in-hope.cn/',
    host: protocol + '//xiaoan.in-hope.cn/', // 当前网站域名 不要替换
    enterpriseHost: protocol + '//{{code}}.in-hope.cn/', // 企业版代码域名
    cookieHost: '.in-hope.cn', // cookie域名
    gxfApi: protocol + '//gxf.in-hope.cn/gxf/',
    appid: 'wxff02d74bb4a459d0',
    mobileHost: 'http://wx.in-hope.cn/',
    xinhuUserId: '',
    user: protocol + '//api.in-hope.cn/user/user/', // 地址更换user
    business: protocol + '//api.in-hope.cn/business/',
    calendar: protocol + '//api.in-hope.cn/calendar/',
    caselaw: protocol + '//api.in-hope.cn/caseLaw/',
    disclosure: protocol + '//api.in-hope.cn/big-data/disclosure/',
    enterprise: protocol + '//api.in-hope.cn/enterprise/',
    law: protocol + '//api.in-hope.cn/big-data/law/',
    listedcompany: protocol + '//api.in-hope.cn/listCompany/',
    interact: protocol + '//api.in-hope.cn/interact/',
    usermsg: protocol + '//api.in-hope.cn/message/',
    publish: protocol + '//api.in-hope.cn/publish/',
    report: protocol + '//api.in-hope.cn/report/',
    xinhu: protocol + '//api.in-hope.cn/xinhu/',
    sentiment: protocol + '//api.in-hope.cn/sentiment/',
    supervise: protocol + '//api.in-hope.cn/supervise/',
    authority: protocol + '//api.in-hope.cn/authority/'
  }
}
export default HOSTS
