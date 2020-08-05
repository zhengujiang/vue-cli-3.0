/**
 * @charset UTF-8
 * @Version 1.0.0
 * @接口
 * @name Evans_Cai
 * */
// const protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
const protocol = 'https:';
const HOSTS = {
  dev: {
    // 本地
    user: protocol + '//dev.in-hope.com.cn/v1/user/',
    domain: protocol + '//dev.in-hope.com.cn/v1/',
    calendar: protocol + '//dev.in-hope.com.cn/v1/calendar/',
    disclosure: protocol + '//dev.in-hope.com.cn/v1/disclosure/',
    enterprise: protocol + '//dev.in-hope.com.cn/v1/enterprise/',
    law: protocol + '//dev.in-hope.com.cn/v1/law/',
    listCompany: protocol + '//dev.in-hope.com.cn/v1/listCompany/',
    usermsg: protocol + '//dev.in-hope.com.cn/v1/message/',
    publish: protocol + '//dev.in-hope.com.cn/v1/publish/',
    report: protocol + '//dev.in-hope.com.cn/v1/report/',
    xinhu: protocol + '//dev.in-hope.com.cn/v1/xinhu/',
    sectest: protocol + '//dev.in-hope.com.cn/v1/sectest/',
    wxpay: protocol + '//dev.in-hope.com.cn/v1/wxpay/',
    sentiment: protocol + '//dev.in-hope.com.cn/v1/sentiment/',

    currentIP: protocol + '//dev.in-hope.com.cn/',
    pcUrl: protocol + '//dev.web.in-hope.com.cn',
    cookieHost: 'dev.in-hope.com.cn',
    appId: 'wx3313bba3a77541ef' // dev.in-hope.com.cn appid
  },
  development: {
    // 本地
    user: protocol + '//dev.in-hope.com.cn/v1/user/',
    domain: protocol + '//dev.in-hope.com.cn/v1/',
    calendar: protocol + '//dev.in-hope.com.cn/v1/calendar/',
    disclosure: protocol + '//dev.in-hope.com.cn/v1/disclosure/',
    enterprise: protocol + '//dev.in-hope.com.cn/v1/enterprise/',
    law: protocol + '//dev.in-hope.com.cn/v1/law/',
    listedcompany: protocol + '//dev.in-hope.com.cn/v1/listedcompany/',
    usermsg: protocol + '//dev.in-hope.com.cn/v1/usermsg/',
    publish: protocol + '//dev.in-hope.com.cn/v1/publish/',
    report: protocol + '//dev.in-hope.com.cn/v1/report/',
    sectest: protocol + '//dev.in-hope.com.cn/v1/sectest/',
    wxpay: protocol + '//dev.in-hope.com.cn/v1/wxpay/',
    sentiment: protocol + '//dev.in-hope.com.cn/v1/sentiment/',

    currentIP: protocol + '//dev.in-hope.com.cn/',
    pcUrl: protocol + '//dev.web.in-hope.com.cn',
    cookieHost: 'dev.in-hope.com.cn',
    appId: 'wx3313bba3a77541ef' // dev.in-hope.com.cn appid
  },
  testing: {
    // 董办
    user: protocol + '//test.in-hope.com.cn/v1/user/',
    domain: protocol + '//test.in-hope.com.cn/v1/',
    calendar: protocol + '//test.in-hope.com.cn/v1/calendar/',
    disclosure: protocol + '//test.in-hope.com.cn/v1/disclosure/',
    enterprise: protocol + '//test.in-hope.com.cn/v1/enterprise/',
    law: protocol + '//test.in-hope.com.cn/v1/law/',
    listCompany: protocol + '//test.in-hope.com.cn/v1/listCompany/',
    usermsg: protocol + '//test.in-hope.com.cn/v1/message/',
    publish: protocol + '//test.in-hope.com.cn/v1/publish/',
    report: protocol + '//test.in-hope.com.cn/v1/report/',
    xinhu: protocol + '//test.in-hope.com.cn/v1/xinhu/',
    sectest: protocol + '//test.in-hope.com.cn/v1/sectest/',
    wxpay: protocol + '//test.in-hope.com.cn/v1/wxpay/',
    sentiment: protocol + '//test.in-hope.com.cn/v1/sentiment/',

    currentIP: protocol + '//test.in-hope.com.cn/',
    pcUrl: protocol + '//test.web.in-hope.com.cn',
    cookieHost: 'test.in-hope.com.cn',
    appId: 'wx6c38960bcacb7a79' // api.in-hope.com.cn appid
  },
  product: {
    // 真实环境
    user: protocol + '//api.in-hope.cn/user/',
    domain: protocol + '//api.in-hope.cn/',
    calendar: protocol + '//api.in-hope.cn/calendar/',
    disclosure: protocol + '//api.in-hope.cn/big-data/disclosure/',
    enterprise: protocol + '//api.in-hope.cn/enterprise/',
    law: protocol + '//api.in-hope.cn/big-data/law/',
    listCompany: protocol + '//api.in-hope.cn/listCompany/',
    usermsg: protocol + '//api.in-hope.cn/message/',
    publish: protocol + '//api.in-hope.cn/publish/',
    report: protocol + '//api.in-hope.cn/report/',
    xinhu: protocol + '//api.in-hope.cn/xinhu/',
    sectest: protocol + '//api.in-hope.cn/sectest/',
    wxpay: protocol + '//api.in-hope.cn/wxpay/',
    sentiment: protocol + '//api.in-hope.cn/sentiment/',

    currentIP: protocol + '//wx.in-hope.cn/',
    pcUrl: protocol + '//xiaoan.in-hope.cn',
    cookieHost: 'wx.in-hope.cn',
    appId: 'wx006d673ce5a4a44b' // xiaoan.h5.in-hope.com.cn appid
  },
  staging: {
    // 真实环境
    domain: protocol + '//bookmarks.in-hope.cn/v1/',
    currentIP: protocol + '//wx.in-hope.cn/',
    pcUrl: protocol + '//xiaoan.in-hope.cn',
    cookieHost: 'staging.in-hope.cn',
    appId: 'wx006d673ce5a4a44b' // xiaoan.h5.in-hope.com.cn appid
  },
  production: {
    // 真实环境
    user: protocol + '//api.in-hope.cn/user/',
    domain: protocol + '//api.in-hope.cn/',
    calendar: protocol + '//api.in-hope.cn/calendar/',
    disclosure: protocol + '//api.in-hope.cn/big-data/disclosure/',
    enterprise: protocol + '//api.in-hope.cn/enterprise/',
    law: protocol + '//api.in-hope.cn/big-data/law/',
    listCompany: protocol + '//api.in-hope.cn/listCompany/',
    usermsg: protocol + '//api.in-hope.cn/message/',
    publish: protocol + '//api.in-hope.cn/publish/',
    report: protocol + '//api.in-hope.cn/report/',
    xinhu: protocol + '//api.in-hope.cn/xinhu/',
    sectest: protocol + '//api.in-hope.cn/sectest/',
    wxpay: protocol + '//api.in-hope.cn/wxpay/',
    sentiment: protocol + '//api.in-hope.cn/sentiment/',

    currentIP: protocol + '//wx.in-hope.cn/',
    pcUrl: protocol + '//xiaoan.in-hope.cn',
    cookieHost: 'wx.in-hope.cn',
    appId: 'wx006d673ce5a4a44b' // xiaoan.h5.in-hope.com.cn appid
  }
}
export {
  HOSTS,
  protocol
}
