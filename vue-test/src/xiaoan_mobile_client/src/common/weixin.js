//生成随机字符串
const randomString = (len) => {
  len = len || 32;
  let $chars = 'ABC1DEFGH2IJK3LMNOQP4RSTU5VWXYZab6cdef8ghij7kmlnopq9rest0uvwxyz';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
//
export default {
  //
  wxconfig(vue) {
    let appId = vue.$api.appId;
    let noncestr = randomString(32);    //随机字符串
    let timestamp = Date.parse(new Date()) / 1000; //时间戳，秒数
    // console.log(timestamp);
    let signature = ""; //需要生成的签名
    let url = decodeURI(window.location.href).split('#')[0];  //当前网页的URL，不包含#及其后面部分;
    vue.$http({
      method: 'GET',
      url: vue.$api.share.shareSign,
      params: {
        noncestr: noncestr,
        timestamp: timestamp,
        url: url /*encodeURIComponent(url)*/
      }
    }).then((res) => {
      //console.log('resresres', res, res.data.sign)
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: res.data.sign,// 必填，签名，见附录1
        jsApiList: [
          'onMenuShareAppMessage',//分享到微信好友
          'onMenuShareTimeline',//分享到微信朋友圈
          'onMenuShareQQ',//分享到QQ好友
          'onMenuShareQZone',//分享到QQ空间
          'chooseImage',//上传图片
          'uploadImage',//上传到服务器
          'downloadImage',//预览图片
          "chooseWXPay",
          "updateAppMessageShareData", // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
          "updateTimelineShareData" // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  //
  wxshare(shareTitle, shareDesc, link, imgUrl, isReport, methods) {
    shareTitle = shareTitle ? shareTitle : document.title;
    let desc = shareDesc ? shareDesc : "信公小安，让董办工作更安心！";
    // let url = window.location.href.split('#')[0];  //当前网页的URL，不包含#及其后面部分
    link = link ? link : window.location.href; // 分享链接
    link = decodeURI(decodeURI(link))
    link = encodeURI(link)
    //  console.log(link)
    let shareData = {
      title: shareTitle, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success(res) {
        //用户确认分享后执行的回调函数
        if (methods) {
          methods();
        }
        // debugger
        console.log("成功分享微信好友", shareTitle, shareDesc, link, imgUrl, isReport);
      },
      cancel(err) {
        // 用户取消分享后执行的回调函数
        console.log(err)
      },
      complete() {
        console.log('已调用该方法！')
      }
    }
    wx.ready(() => {
      if (wx.onMenuShareAppMessage) { //微信文档中提到这两个接口即将弃用，故判断
        wx.onMenuShareAppMessage(shareData);//1.0 分享到朋友
        wx.onMenuShareTimeline(shareData);//1.0分享到朋友圈
      } else {
        wx.updateAppMessageShareData(shareData);//1.4 分享到朋友
        wx.updateTimelineShareData(shareData);//1.4分享到朋友圈
      }
    })
  },
  // 朋友圈
  shareTimeline(shareTitle, shareDesc, link, imgUrl, isReport, methods) {
    shareTitle = shareTitle ? shareTitle : document.title;
    let desc = shareDesc ? shareDesc : "信公小安，让董办工作更安心！";
    // let url = window.location.href.split('#')[0];  //当前网页的URL，不包含#及其后面部分
    link = link ? link : window.location.href; // 分享链接
    link = decodeURI(decodeURI(link))
    link = encodeURI(link)
    //  console.log(link)
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        desc: desc, // 分享描述
        link: link,
        imgUrl: imgUrl, // 分享图标
        success(res) {
          // 用户确认分享后执行的回调函数
          if (methods) {
            methods();
          }
          console.log(res)
          console.log("成功分享朋友圈")
        },
        cancel() {
          // 用户取消分享后执行的回调函数
        },
        complete() {
          console.log('已调用该方法！')
        }
      });
    })
  },
  // 授权登陆state ['TESTING-userid','COURSE-courseId','INVOICE','SUBSCRIBE','STATE']
  wxAuthRedirect(Vue, state) {
    let redirect_uri = encodeURIComponent(Vue.$api.CURRENTIP.IP + '#/wxRedirect');
    let protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
    location.href = `${protocol}//open.weixin.qq.com/connect/oauth2/authorize?appid=${Vue.$api.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
  },
  //
  wxAuthLink(Vue, state) {
    if (window.localStorage.getItem('wx-auth')) {
      // 有授权信息
      return window.JSON.parse(window.localStorage.getItem('wx-auth'));
    } else {
      // 没有授权信息
      this.wxAuthRedirect(Vue, state);
    }
  }
}
