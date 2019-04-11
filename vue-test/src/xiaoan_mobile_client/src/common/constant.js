export default {
  /**************处理时间戳****************/
  add0: function (m) {
    m = parseInt(m);
    return m < 10 ? '0' + m : m
  },
  //提示'-'显示
  format: function (shijianchuo) {
    if (shijianchuo == null || shijianchuo == "") {
      let date = "";
      return date
    } else {
      //console.log("shijianchuo", shijianchuo);
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(parseInt(shijianchuo));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var date = y + '-' + this.add0(m) + '-' + this.add0(d);
      return date
    }
  },
  // 根据指定日期的时间戳 返回该周
  getFirstDayOfWeek(shijianchuo) {
    let oneDayTime = 24 * 60 * 60 * 1000;
    let nun = new Date(shijianchuo).getDay();
    // console.log('123', new Date(shijianchuo).getDay());
    let dataArr = [];
    if (new Date(shijianchuo).getDay() == 0) {
      dataArr = [shijianchuo, (shijianchuo + (6 * oneDayTime))];
    } else {
      dataArr = [(shijianchuo - (nun * oneDayTime)), (shijianchuo - (nun * oneDayTime)) + (6 * oneDayTime)];
    }
    return dataArr;
  },
  //提示'-'显示
  formatArray: function (shijianchuo) {
    if (shijianchuo == null || shijianchuo == "") {
      return '';
    } else {
      //console.log("shijianchuo", shijianchuo);
      //shijianchuo是整数，否则要parseInt转换
      let time = new Date(parseInt(shijianchuo));
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      return ([y, this.add0(m), this.add0(d)]);
    }
  },
  // 时分秒
  formatS(shijianchuo) {
    if (shijianchuo == null || shijianchuo == "") {
      let date = "";
      return date
    } else {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(parseInt(shijianchuo));
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return this.add0(h) + ':' + this.add0(mm) + "'" + this.add0(s) + "s";
    }
  }, // 时分秒
  formatSecond(shijianchuo) {
    if (shijianchuo == null || shijianchuo == "") {
      return ''
    } else {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(parseInt(shijianchuo));
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return this.add0(h) + ':' + this.add0(mm) + ":" + this.add0(s);
    }
  },
  // 秒 转 时分秒
  formatSeconds(value) {
    if (value == null || value == "") {
      let date = "";
      return date
    } else {
      var theTime = parseInt(value);// 秒
      var theTime1 = 0;// 分
      var theTime2 = 0;// 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = "" + parseInt(theTime) + "s";
      if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "'" + result;
      }
      if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "时" + result;
      }
      return result;
    }
  },
  //文本年月日显示
  formatText: function (shijianchuo) {
    if (shijianchuo == null || shijianchuo == "") {
      let date = "";
      return date
    } else {
      //console.log("shijianchuo", shijianchuo);
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(parseInt(shijianchuo));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var date = y + '年' + this.add0(m) + '月' + this.add0(d) + '日';
      return date
    }
  },
  //返回天数
  getDaysInMonth: function (year, month) {
    // month = parseInt(month, 10); // parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
    var d = new Date(year, month, 0);
    return d.getDate()
  },
  //时间-->距离之前时间
  getBeforeDate: function (n) {
    var n = parseInt(n);
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;
      } else {
        year = year - 1;
        mon = 12;
      }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
  },
  //当前时间
  getNewDate: function () {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    return (date.getFullYear() + "-" + month + "-" + strDate);
  },
  //日期换算成时间戳
  getTimestamp: function (date) {
    date = new Date(Date.parse(date.replace(/-/g, "/")));
    return date.getTime();
  },
  //年月日转“-”
  transFormat: function (str) {
    var result = /^(\d+)年(\d+)月(\d+)日$/.exec(str);
    if (result) {
      var y = result[1];
      var m = result[2];
      var d = result[3];
      m = Number(m) < 10 ? '0' + m : m;
      d = Number(d) < 10 ? '0' + d : d;
      return y + '-' + m + '-' + d;
    } else {
      return null
    }
  },
  /******************************/
  //安卓机聚焦时键盘上顶以及聚焦定位
  /*需要给body上添加《《》》*/
  /* $(document).ready(function () {
      $('body').height($('body')[0].clientHeight);
    });*/
  /**/
  androidTop: function (id) {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // console.log('是否是iOS：', isiOS, '是否是Android：', isAndroid);
    if (isAndroid) {
      var totId = document.getElementById(id);
      console.log(totId);
      var aa = totId.offsetTop;
      var bodyH = document.body.clientHeight;
      bodyH = parseInt((bodyH / 4) - 20);
      $("body").animate({scrollTop: aa - bodyH}, 550);
    }
  },
  //
  chkstrlen(str) {
    let strlen = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
        strlen += 2;
      else
        strlen++;
    }
    return strlen;
  },
  /*
  * todo
  * */
  //判断访问终端
  userAgent: function () {
    //判断访问终端
    let u = navigator.userAgent; //app = navigator.appVersion;
    let app = {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,// 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq", // 是否QQ
      language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    };
    return (app)
  },
  getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
      return unescape(r[2]);
    }
    return null;
  },
  // 数组去重
  unique(arr) {
    return [...new Set(arr)]
  },
  // 是否PC
  ispc() {
    let system = {win: false, mac: false, xll: false}
    let p = navigator.platform
    system.win = p.indexOf('Win') == 0
    system.mac = p.indexOf('Mac') == 0
    system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0)
    let iphone = navigator.userAgent.indexOf('iPhone') < 0
    let Android = navigator.userAgent.indexOf('Android') < 0
    if ((system.win || system.mac || system.xll) && iphone && Android) {
      return true
    } else {
      return false
    }
  },
  // 定时器
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
  // 清除字符串html
  clearHtml(style) {
    var reg = new RegExp(/<[^>]*>/, 'gm')
    var text = style.replace(reg, '')
    return text
  },
  //
  inputBlur() {
    window.scrollTo(0, 0)
    this.resolveBug();
  },
  //
  resolveBug(e) {
    setTimeout(() => {
      var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
      window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      // alert(1);
      if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
        return
      }
      let result = 'pc';
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
        result = 'ios'
      } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
        result = 'android'
      }
      if (result == 'ios') {
        document.activeElement.scrollIntoViewIfNeeded(true);
      }
    }, 400)
  },
}
