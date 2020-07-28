/*
 * todo
 * describe: common javascript file
 * ldk || cwd || zyl
 * */

import store from '@/store/store'

export default {
  // 去除换行
  ClearBr(key) {
    if (key) {
      // key = key.replace(/<\/?.+?>/g, '')
      key = key.replace(/<br\/>/g, '')
      key = key.replace(/[\r\n]/g, '')
    } else {
      key = ''
    }
    return key
  },
  // open -> window(_blank)
  openWindow(url) {
    var linkA = document.createElement('a');
    linkA.setAttribute('target', '_blank');
    linkA.setAttribute('href', url);
    linkA.setAttribute('id', url);
    if (!document.getElementById(url)) {
      document.body.appendChild(linkA)
    }
    linkA.click();
    setTimeout(() => {
      linkA.parentNode.removeChild(linkA)
    }, 300);
    // var tempWindow = window.open('_blank'); // 先打开页面
    // tempWindow.location = location.host + url; // 后更改页面地址
  },
  // 返回用户使用浏览器类型
  browserSort() {
    var sort = ''
    var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    // 判断是否Opera浏览器
    if (userAgent.indexOf('Opera') > -1) {
      sort = 'Opera'
      return sort
    }
    // 判断是否Firefox浏览器
    if (userAgent.indexOf('Firefox') > -1) {
      sort = 'FF'
      return sort
    }
    if (userAgent.indexOf('Chrome') > -1) {
      console.log('Chrome')
      sort = 'Chrome'
      return sort
    }
    // 判断是否Safari浏览器
    if (userAgent.indexOf('Safari') > -1) {
      console.log('Safari')
      sort = 'Safari'
      return sort
    }
    // 判断是否IE浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
      console.log('IE')
      sort = 'IE'
      return sort
    }

  },
  // 控制筛选的类的显示文字
  number(value, num) {
    if (num) {
      console.log('number', num)
      if (value.length >= num) {
        value = value.substring(0, num) + '...'
      }
      return value
    } else {
      if (value.length >= 10) {
        value = value.substring(0, 10) + '...'
      }
      return value
    }
  },
  // 高亮 input的value, 文本text
  highlight(value, content) {
    return content.replace(value, '<highlight class="HEGHLIGHT">' + value + '</highlight>')
  },
  // 高亮文字
  key(value, str) {
    var star = []
    star = value.split(' ')
    for (let i = 0; i < star.length; i++) {
      if (star[i] == '') {
        star.splice(i, 1)
        i = i - 1
      }
    }
    /* console.log("432453", star); */
    for (let i = 0; i < star.length; i++) {
      let fen = str.split(star[i])
      str = fen.join('<highlight class="HEGHLIGHT">' + star[i] + '</highlight>')
    }
    return str
  },
  // 高亮
  hight(value, content) {
    let str = content
    if (value) {
      let valueArr = value.replace(/,/g, ' ').split(' ')
      valueArr.forEach((item) => {
        let reg = new RegExp('(' + item + ')', 'gmi')
        str = str.replace(reg, '<span class="hightLight">$1</span>')
        console.log(str)
      })
    }
    return str
  },
  // 根据总数获取页数
  totalPage(pages, pageTolo) {
    let pageSize = pages,
      number = pageTolo,
      page = ''
    pageSize = Number(pageSize)
    number = Number(number)
    page = Number(page)
    if (pageSize % number > 0) {
      page = (pageSize / number) + 1
    } else {
      page = pageSize / number
    }
    return parseInt(page)
  },
  // 取字符串十位
  subString(value, length) {
    if (length) {
      if (value.length >= length) {
        value = value.substring(0, length) + '...'
      }
      return value
    }
    if (value.length >= 10) {
      value = value.substring(0, 10) + '...'
    }
    return value
  },
  // 获取本月首末日期时间戳
  getLastDayOfMonth(year, month) {
    // 获取本年本月的第一天日期
    var date = new Date(year, month - 1, '01')
    // 设置日期
    date.setDate(1)
    // 设置月份
    date.setMonth(date.getMonth() + 1)
    // 获取本月的最后一天
    var end = new Date(date.getTime() - 1000 * 60 * 60 * 24)
    // 打印某年某月的最后一天
    var months = Number(end.getMonth()) + 1
    if (months < 10) {
      months = '0' + months
    }
    var endDate = end.getFullYear() + '-' + months + '-' + end.getDate()
    console.log(endDate, Date.parse(new Date(endDate)))
    // 返回结果
    return Date.parse(new Date(endDate))
  },
  // 获取一天时间 按分钟
  getTimeMinuteDate(startDate) {
    let index = 1
    let dayTimeDate = new Date()
    let year = dayTimeDate.getFullYear()
    let month = dayTimeDate.getMonth() + 1
    let day = dayTimeDate.getDate()
    // if (index == 1) {
    //   var time = '09:15'
    //   var time1 = '11:30'
    // } else if (index == 5) {
    //   time = '09:35'
    //   time1 = '11:30'
    // } else if (index == 15) {
    //   time = '09:45'
    //   time1 = '11:30'
    // } else if (index == 60) {
    //   time = '10:30'
    //   time1 = '11:30'
    // }
    var time = startDate
    var time1 = '11:30'
    let timeStamp = year + '/' + month + '/' + day + ' ' + time
    let timeStamp1 = year + '/' + month + '/' + day + ' ' + time1
    var dateData = []
    var hour = ''
    var minutes = ''
    for (let i = Date.parse(timeStamp); i <= Date.parse(timeStamp1); i += index * 60000) {
      hour = new Date(i).getHours()
      minutes = new Date(i).getMinutes()
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let minutesTime = hour + ':' + minutes
      dateData.push(minutesTime)
    }
    if (index == 1) {
      var time2 = '13:01'
      var time3 = '15:00'
    } else if (index == 5) {
      time2 = '13:05'
      time3 = '15:00'
    } else if (index == 15) {
      time2 = '13:15'
      time3 = '15:00'
    } else if (index == 60) {
      time2 = '14:00'
      time3 = '15:00'
    }

    let timeStamp2 = year + '/' + month + '/' + day + ' ' + time2
    let timeStamp3 = year + '/' + month + '/' + day + ' ' + time3
    var dateData1 = []
    var hour1 = ''
    var minutes1 = ''
    for (let i = Date.parse(timeStamp2); i <= Date.parse(timeStamp3); i += index * 60000) {
      hour1 = new Date(i).getHours()
      minutes1 = new Date(i).getMinutes()
      if (hour1 < 10) {
        hour1 = '0' + hour1
      }
      if (minutes1 < 10) {
        minutes1 = '0' + minutes1
      }
      let minutesTime1 = hour1 + ':' + minutes1
      dateData1.push(minutesTime1)
    }
    let dateDataAdd = dateData.concat(dateData1)
    return dateDataAdd
    // console.log('2222', timeStamp, Date.parse(timeStamp), Date.parse(timeStamp1), dateData)
  },
  unique(arr) {
    var result = [];
    var obj = {};
    for (let i = 0; i < arr.length; i++) {
      if (!obj.hasOwnProperty(arr[i])) {
        result.push(arr[i]);
        obj[arr[i]] = 0;
      }
    }
    return result
  },
  // 数组去重
  removal(item) {
    var arr = item,
      result = [],
      i,
      j,
      len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i] == arr[j]) {
          j = ++i;
        }
      }
      result.push(arr[i]);
    }
    //  console.log(result)
    return result;
  },
  // 截取时间段
  getLastOfMonth(index) {
    var end = new Date()
    var years = end.getFullYear()
    var dayDate = end.getDate()
    var months = Number(end.getMonth()) + 1
    // 打印某年某月的最后一天
    if (index == 0) {

    } else if (index == 1) {
      let lastDay = new Date().getTime() - 1000 * 3600 * 24 * 30
      months = new Date(lastDay).getMonth() + 1
      dayDate = new Date(lastDay).getDate()
      years = new Date(lastDay).getFullYear()
    } else if (index == 2) {
      let lastDay = new Date().getTime() - 1000 * 3600 * 24 * 30 * 3
      months = new Date(lastDay).getMonth() + 1
      dayDate = new Date(lastDay).getDate()
      years = new Date(lastDay).getFullYear()
    } else if (index == 3) {
      let lastDay = new Date().getTime() - 1000 * 3600 * 24 * 30 * 6
      months = new Date(lastDay).getMonth() + 1
      dayDate = new Date(lastDay).getDate()
      years = new Date(lastDay).getFullYear()
    } else if (index == 4) {
      months = 1
      dayDate = 1
    } else if (index == 5) {
      years = years - 1
    } else if (index == 6) {
      years = years - 2
    } else if (index == 7) {
      years = years - 5
    } else if (index == 8) {
      years = years - 10
    }
    if (months < 10) {
      months = '0' + months
    }
    if (dayDate < 10) {
      dayDate = '0' + dayDate
    }
    var startDateTwo = years + '-' + months + '-' + (dayDate)
    return startDateTwo
  },
  // 时间-->距离之前时间
  getBeforeDate(num, timestamp) {
    var n = parseInt(num)
    var d = new Date()
    var year = d.getFullYear()
    var mon = d.getMonth() + 1
    var day = d.getDate()
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1
      } else {
        year = year - 1
        mon = 12
      }
    }
    d.setDate(d.getDate() - n)
    if (timestamp == true) {
      console.log(timestamp, 'd.setDate(d.getDate() - n)', d.setDate(d.getDate() - n))
      return d.setDate(d.getDate() - n)
    }
    year = d.getFullYear()
    mon = d.getMonth() + 1
    day = d.getDate()
    var s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
    return s
  },
  // 处理时间戳
  add0(m) {
    return m < 10 ? '0' + m : m
  },
  // 文本年月日显示
  transTime(shijianchuo) {
    if (shijianchuo == null || shijianchuo == '') {
      let date = ''
      return date
    } else {
      // shijianchuo是整数，否则要parseInt转换
      let time = new Date(parseInt(shijianchuo))
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      let h = time.getHours()
      let mm = time.getMinutes()
      let s = time.getSeconds()
      let date = y + '年' + this.add0(m) + '月' + this.add0(d) + '日'
      let date1 = y + '-' + this.add0(m) + '-' + this.add0(d)
      let date2 = y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
      let date3 = this.add0(m) + '-' + this.add0(d)
      let date4 = y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm)
      let date5 = this.add0(m) + '月' + this.add0(d) + '日'
      return ([date, date1, date2, date3, date4, date5])
    }
  },
  // 多关键字 空格替换逗号处理
  transStr(str) {
    if (str) {
      return this.ImpArr(str.split(' ')).toString()
    } else {
      return ''
    }
  },
  // url上获取搜索关键字 逗号替换空格处理
  transComma(str) {
    if (str !== '') {
      return this.ImpArr(str.split(',')).join(' ')
    }
  },
  // 去除val的左右空格
  Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  // 去除空元素
  ImpArr(array) {
    let arr = array
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '' || typeof (arr[i]) === 'undefined') {
        arr.splice(i, 1)
        i = i - 1
      }
    }
    return (arr)
  },
  // 唯一标识uuid // replace(/<(?!img|p|/p).*?>/g, "");  去除html里面的标签保留p 和img
  uuid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
  },
  // 返回顶部
  returnTop() {
    var timer = setInterval(function () { // 设置一个计时器
      var ct = document.documentElement.scrollTop || document.body.scrollTop // 获取距离顶部的距离
      ct -= (ct / 5)
      if (ct > 5) { // 如果与顶部的距离大于零
        window.scrollTo(0, ct) // 向上移动50px
      } else { // 如果距离小于等于零
        window.scrollTo(0, 0) // 移动到顶部
        clearInterval(timer) // 清除计时器
      }
    }, 10)
  },
  // 获取当前时间（年月日）
  getNowDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var str = year + '/' + month + '/' + day
    return str
  },
  // 获取当前时间（年月日） split: / -
  getNow(split) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var str = year + split + this.add0(month) + split + this.add0(day)
    return str
  },
  // 获取前一周时间 （年月日）
  getLastDate() {
    var now = new Date()
    var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var str = year + '-' + month + '-' + day
    return str
  },
  // 判断是否是PC
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
  // 清除字符串内嵌样式
  clearStyle(style) {
    var reg = new RegExp(/style="((\S|\s)+)"/, 'gm')
    var text = style.replace(reg, '')
    return text
  },
  // 日期换算成时间戳 10位
  getTimestamp(date) {
    date = new Date(Date.parse(date.replace(/-/g, '/')))
    date = date.getTime() / 1000
    return date
  },
  // 日期换算成时间戳 13位
  getTimestampms(date) {
    // console.log(date)
    date = new Date(Date.parse(date.replace(/-/g, '/')))
    date = date.getTime()
    return date
  },
  // 小数点后保留两位 没有两位填0
  toDecimal2(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return
    }
    f = Math.round(x * 100) / 100
    let s = f.toString()
    let rs = s.indexOf('.')
    if (rs < 0) {
      rs = s.length
      s += '.'
    }
    while (s.length <= rs + 2) {
      s += '0'
    }
    return s
  },
  //
  abs(val, isParseInt) {
    let isParseInts = isParseInt ? 'true' : 'false'
    console.log('isParseInts', isParseInts);
    if (val == null) {
      return 0
    }
    if (val * 1) {
      val = val * 1
    } else {
      return parseFloat(val).toFixed(2)
    }
    // 金额转换 元 保留2位小数 并每隔3位用逗号分开 1,234.56
    var str = (val).toFixed(2) + '';
    var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); // 取到整数部分
    var dot = str.substring(str.length, str.indexOf(".")); // 取到小数部分搜索
    var ret = intSum + dot;
    return ret;
  },
  //
  autoPriceUnit(str) {
    if (!str || str == '--') {
      return '--'
    }
    let isless = ''
    if (parseInt(str) < 0) {
      isless = '-'
    }
    let unit = ''
    str = Math.abs(str)
    if (str > 100000000) {
      str = (str / 100000000).toFixed(2)
      unit = '亿'
    } else if (str > 10000) {
      str = (str / 10000).toFixed(2)
      unit = '万'
    }
    str = str.toString()
    let intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); // 取到整数部分
    let dot = str.substring(str.length, str.indexOf(".")); // 取到小数部分搜索

    return isless + intSum + dot + unit
  },
  autoPrices(str) {
    if (!str) {
      return '--'
    }
    str = this.toDecimal2(str.toString())
    if (!str) {
      return '--'
    }
    // console.log('====', str.length, this.toDecimal2(str));
    if (str.length < 10 && str.length >= 5 && !isNaN(str)) {
      // console.log(1);
      let x = (str / 10000).toFixed(2)
      let y = x.toString().split('.')
      if (y[0].length > 3) {
        let z = y[0].substring(0, y[0].length - 3)
        let n = z + ',' + y[0].substring(y[0].length - 3, y[0].length)
        y[0] = n
      }
      return (y.join('.') + '万')
    } else if (str.length >= 10 && !isNaN(str)) {
      // console.log(2);
      var x = (str / 100000000).toFixed(2)
      var y = x.toString().split('.')
      if (y[0].length > 3) {
        var z = y[0].substring(0, y[0].length - 3)
        var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length)
        y[0] = n
      }
      return (y.join('.') + '亿')
    } else if (str.length < 8 || isNaN(str)) {
      // console.log(3);
      return str
    } else {
      // console.log(4);
    }
  },
  // 数字自适应
  // autoPrice(str) {
  //   if (str == '--' || str == undefined || isNaN(str)) {
  //     return '--'
  //   } else if (str == 'y') {
  //     return 'y'
  //   }
  //   str = this.toDecimal2(str.toString());

  //   if (str.length < 12 && str.length >= 8 && !isNaN(str)) {
  //     let x = (str / 10000).toFixed(2);
  //     let y = x.toString().split('.')
  //     if (y[0].length > 3) {
  //       let z = y[0].substring(0, y[0].length - 3);
  //       let n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
  //       y[0] = n;
  //     }
  //     return y.join(".") + '万';
  //   } else if (str.length >= 12 && !isNaN(str)) {
  //     let x = (str / 100000000).toFixed(2);
  //     let y = x.toString().split('.')
  //     if (y[0].length > 3) {
  //       let z = y[0].substring(0, y[0].length - 3);
  //       let n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
  //       y[0] = n;
  //     }
  //     return y.join(".") + '亿';
  //   } else if (str.length < 8 || isNaN(str)) {
  //     return str
  //   }
  // },
  autoPrice(str) {
    if (str == '--' || str == null) {
      return '--'
    } else if (str == 'y') {
      return 'y'
    }
    let strTmp = parseFloat(str);
    return this.autoPriceUnit(strTmp);
    // console.log('======>', str);
    // if (str == '--' || str == null) {
    //   return '--'
    // } else if (str == 'y') {
    //   return 'y'
    // }
    // if (!isNaN(str) && str !== null && str.length < 12 && str.length >= 8) {
    //   let x = (str / 10000).toFixed(2);
    //   let y = x.toString().split('.')
    //   if (y[0].length > 3) {
    //     let z = y[0].substring(0, y[0].length - 3);
    //     let n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
    //     y[0] = n;
    //   }
    //   return y.join(".") + '万';
    // } else if (!isNaN(str) && str !== null && str.length >= 12) {
    //   let x = (str / 100000000).toFixed(2);
    //   let y = x.toString().split('.')
    //   if (y[0].length > 3) {
    //     let z = y[0].substring(0, y[0].length - 3);
    //     let n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
    //     y[0] = n;
    //   }
    //   return y.join(".") + '亿';
    // } else if (isNaN(str) || str == null || str.length < 8) {
    //   return str
    // }
  },
  // 以 亿 为单位
  yiUnit(str) {
    if (str == '--' || str == undefined) {
      return '--'
    } else if (str == 'y') {
      return 'y'
    }
    if (str.indexOf('%') > -1) {
      return str
    }
    if (!isNaN(str)) {
      var x = (str / 100000000).toFixed(2)
      var y = x.toString().split('.')
      if (y[0].length > 3) {
        var z = y[0].substring(0, y[0].length - 3)
        var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length)
        y[0] = n
      }
      return y.join('.') + '亿'
    } else if (isNaN(str)) {
      return str
    }
  },
  // 以 万元 为单位
  wanUnit(str) {
    if (str == '--' || str == undefined) {
      return '--'
    } else if (str == 'y') {
      return 'y'
    }
    if (str.indexOf('%') > -1) {
      return str
    }
    let reduce = ''
    if (str.indexOf('-') > -1) {
      reduce = '-'
      str = str.replace('-', '')
    }
    if (parseFloat(str) >= 10000 && !isNaN(str)) {
      var x = (str / 10000).toFixed(2)
      var y = x.toString().split('.')
      if (y[0].length > 3) {
        var z = y[0].substring(0, y[0].length - 3)
        if (z.length > 3) {
          var hh = z.substring(0, z.length - 3)
          z = hh + ',' + z.substring(z.length - 3, z.length)
          if (hh.length > 3) {
            var ss = hh.substring(0, hh.length - 3)
            z = ss + ',' + hh.substring(hh.length - 3, hh.length) + ',' + z.substring(z.length - 3, z.length)
          }
        }
        var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length)
        y[0] = n
      }
      return reduce + y.join('.') + '万'
    } else {
      return reduce + parseFloat(str).toFixed(2);
    }
  },
  // 检测交易时间
  checkMarkTime() {
    let rtn = true
    let nowDate = new Date()
    let day = nowDate.getDay()
    let h = nowDate.getHours()
    let m = nowDate.getMinutes()
    // 星期六，日
    if (day == 0 || day == 6) {
      rtn = false
    }
    if (h < 9 || h > 15 || h == 12) {
      rtn = false
    }
    if (h == 9 && m < 15) {
      return false
    }
    if (h == 11 && m > 31) {
      return false
    }
    if (h == 15 && m > 1) {
      return false
    }
    return rtn
  },
  secToTime(s) {  // 秒转化为时分
    let t;
    if (s > -1) {
      let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      console.log(s, hour, min, sec);
      if (hour < 10) {
        t = '0' + hour + ":";
      } else {
        t = hour + ":";
      }
      if (hour === 0) {
        t = '';
      }
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec.toFixed(0);
    }
    return t;
  },
  // 通过锚点平滑滚动页面
  jump(index) {
    // 用 class="jump" 添加锚点
    let jump = document.querySelectorAll(".jump");
    let total = jump[index].offsetTop;
    let distance =
      document.documentElement.scrollTop || document.body.scrollTop;
    // 平滑滚动，时长500ms，每10ms一跳，共50跳
    let step = total / 50;
    if (total > distance) {
      smoothDown();
    } else {
      let newTotal = distance - total;
      step = newTotal / 50;
      smoothUp();
    }

    function smoothDown() {
      if (distance < total) {
        distance += step;
        document.body.scrollTop = distance;
        document.documentElement.scrollTop = distance;
        setTimeout(smoothDown, 5);
      } else {
        document.body.scrollTop = total;
        document.documentElement.scrollTop = total;
      }
    }

    function smoothUp() {
      if (distance > total) {
        distance -= step;
        document.body.scrollTop = distance;
        document.documentElement.scrollTop = distance;
        setTimeout(smoothUp, 5);
      } else {
        document.body.scrollTop = total;
        document.documentElement.scrollTop = total;
      }
    }
  },
  // 将侧边栏数据存到vuex中
  getSidebarInfo(obj, id, title, time, timeliness, type) {
    if (obj == {}) return
    let newObj = {
      id: obj[id],
      title: obj[title],
      time: obj[time],
      timeliness: obj[timeliness],
      type: type
    }
    store.commit('sidebarInfoDetail', newObj)
  }
}
