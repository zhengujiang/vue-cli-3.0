export default {
  methods: {
    // 函数节流
    throttle (method, time) {
      let start = ''
      let timer = null
      return function loop () {
        let end = new Date()
        if (!start) start = end
        if (end - start >= time) {
          method()
          start = end
        } else {
          clearTimeout(timer)
          timer = setTimeout(() => {
            loop()
          }, 50)
        }
      }
    },
    // 函数防抖
    debounce (method, time) {
      let timer = null
      return () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          method()
        }, time)
      }
    },
    // 文本年月日显示
    transTime (shijianchuo) {
      if (!shijianchuo) {
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
    // 返回顶部
    returnTop () {
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
    // 小数点后保留两位 没有两位填0
    toDecimal2 (x) {
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
    // 三位一个逗号
    abs (val) {
      if (val == null) {
        return 0
      }
      if (val * 1) {
        val = val * 1
      } else {
        return parseFloat(val).toFixed(2)
      }
      // 金额转换 元 保留2位小数 并每隔3位用逗号分开 1,234.56
      var str = (val).toFixed(2) + ''
      var intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
      var dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
      var ret = intSum + dot
      return ret
    }
  }
}
