'use strict'
/* * describe: common javascript file ldk || cwd || zyl * */
export default {
  // 使用递归。对于给定字符串中的每个字母，为字母创建字谜。
  anagrams(str) {
    const anagrams = str => {
      if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
      return str.split('').reduce((acc, letter, i) =>
        acc.concat(anagrams(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)), []);
    };
    return anagrams(str)
  },
  // 去除空元素
  impArray(array) {
    let arr = array
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '' || typeof (arr[i]) === 'undefined' || arr[i] === null) {
        arr.splice(i, 1)
        i = i - 1
      }
    }
    return (arr)
  },
  unique(array) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
      for (var j = i + 1; j < l; j++) {
        if (array[i] === array[j]) {
          i++;
          j = i;
        }
      }
      temp.push(array[i]);
      index.push(i);
    }
    return temp;
  },
  // 数组平均数
  average(arr) {
    const average = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return average(arr)
  },
  // 大写每个单词的首字母
  capitalizeEveryWord(str) {
    const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());
    return capitalizeEveryWord(str)
  },
  // 首字母大写
  capitalize(str, lowerRest) {
    const capitalize = (str, lowerRest = false) => str.slice(0, 1).toUpperCase() + (lowerRest ? str.slice(1).toLowerCase() : str.slice(1));
    return capitalize(str, lowerRest)
  },
  //
  countOccurrences(arr, value) {
    const countOccurrences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
    return countOccurrences(arr, value)
  },
  // 反转字符串。
  reverseString(str) {
    // 使用数组 destructuring 和Array.reverse()可反转字符串中字符的顺序。使用join(”)组合字符以获取字符串.
    const reverseString = str => [...str].reverse().join('');
    // reverseString('foobar') -> 'raboof'
    return reverseString(str)
  },
  // 将字符串转换为匹配。
  toCamelCase(str) {
    // 使用replace()可删除下划线、连字符和空格, 并将单词转换为匹配。
    const toCamelCase = str =>
      str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) => p2 ? p2.toUpperCase() : p1.toLowerCase());
    return toCamelCase(str);
  },
  // 将字符串截断为指定长度。
  truncateString(str, num) {
    const truncateString = (str, num) =>
      str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
    return truncateString(str, num);
  },
  // 将 colorcode 转换为rgb()字符串。
  hexToRGB(hex) {
    // 使用按位右运算符和掩码位与&(and) 运算符将十六进制颜色代码 (前缀为#) 转换为具有 RGB 值的字符串。
    // 如果它是一个3位数的 colorcode, 那么用 extendHex () 函数 (ref.extendHex代码段) 扩展的6位 colorcode 进行相同的处理
    const hexToRgb = hex => {
      const extendHex = shortHex => '#' + shortHex.slice(shortHex.startsWith('#') ? 1 : 0).split('').map(x => x + x).join('');
      const extendedHex = hex.slice(hex.startsWith('#') ? 1 : 0).length === 3 ? extendHex(hex) : hex;
      return `rgb(${parseInt(extendedHex.slice(1), 16) >> 16}, ${(parseInt(extendedHex.slice(1), 16) & 0x00ff00) >> 8}, ${parseInt(extendedHex.slice(1), 16) & 0x0000ff})`;
    }
    return hexToRgb(hex);
  },
  // 检查给定参数是否为数组。
  isArray(val) {
    // 使用Array.isArray()检查某个值是否属于数组。
    const isArray = val => !!val && Array.isArray(val);
    return isArray(val)
  },
  // 检查给定的参数是否为本机布尔元素。
  isBoolean(val) {
    // 使用typeof检查某个值是否被归类为布尔基元。
    const isBoolean = val => typeof val === 'boolean';
    return isBoolean(val)
  },
  // 检查给定的参数是否为函数。
  isFunction(val) {
    // 使用typeof检查某个值是否被归类为函数基元。
    const isFunction = val => val && typeof val === 'function';
    return isFunction(val)
  },
  // 检查给定的参数是否为数字。
  isNumber(val) {
    // 使用typeof检查某个值是否归类为数字基元。
    const isNumber = val => typeof val === 'number';
    return isNumber(val)
  },
  // 检查给定参数是否为字符串。
  isString(val) {
    // 使用typeof检查某个值是否属于字符串基元。
    const isString = val => typeof val === 'string';
    return isString(val)
  },
  // 测量执行函数所用的时间。
  timeTaken(callback) {
    const timeTaken = callback => {
      console.time('timeTaken');
      const r = callback();
      console.timeEnd('timeTaken');
      return r;
    };
    return timeTaken(callback);
  },
  // 如果指定的元素在视区中可见, 则返回true, 否则为false。
  elementIsVisibleInViewport(el, partiallyVisible) {
    // 如果指定的元素在视区中可见, 则返回true, 否则为false。
    // 使用Element.getBoundingClientRect()和window.inner(Width|Height)值以确定给定元素在视区中是否可见。
    // 省略第二个参数以确定该元素是否完全可见, 或指定true以确定它是否部分可见。
    const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
      const {top, left, bottom, right} = el.getBoundingClientRect();
      return partiallyVisible
        ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    };
    return elementIsVisibleInViewport(el, partiallyVisible);
  },
  // 如果页的底部可见, 则返回true, 否则为false。
  bottomVisible() {
    // 使用scrollY、scrollHeight和clientHeight来确定页面底部是否可见。
    const bottomVisible = () => document.documentElement.clientHeight + window.scrollY >= document.documentElement.scrollHeight || document.documentElement.clientHeight;
    return bottomVisible()
  },
  // 返回当前页的滚动位置。
  getScrollPosition(el) {
    // 如果已定义, 则使用pageXOffset和pageYOffset, 否则scrollLeft和scrollTop。可以省略el以使用window的默认值.
    const getScrollPosition = (el = window) => ({
      x: (el.pageXOffset !== undefined) ? el.pageXOffset : el.scrollLeft,
      y: (el.pageYOffset !== undefined) ? el.pageYOffset : el.scrollTop
    });
    return getScrollPosition(el);
  },
  // 返回一个包含当前 URL 参数的对象。
  getURLParameters(url) {
    // 使用match()与适当的正则表达式来获取所有键值对,Array.reduce()可将它们映射并合并到单个对象中。
    // 将location.search作为要应用于当前url的参数传递.
    // const getURLParameters = url =>
    //   url.match(/([^?=&]+)(=([^&]*))/g).reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {});
    // return getURLParameters(url);
  },
  // 平滑滚动到页面顶部。
  scrollToTop() {
    // 使用document.documentElement.scrollTop或document.body.scrollTop从顶部获取距离。
    // 从顶部的距离的一小部分滚动。使用window.requestAnimationFrame()对滚动进行动画处理。
    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 5);
      }
    };
    scrollToTop()
  },
  // 链异步函数。
  chainAsync(fns) {
    // 循环遍历包含异步事件的函数数组, 当每个异步事件完成时调用next。
    const chainAsync = fns => {
      let curr = 0;
      const next = () => fns[curr++](next);
      next();
    };
    /* chainAsync([
        next => { console.log('0 seconds'); setTimeout(next, 1000); },
        next => { console.log('1 second');  setTimeout(next, 1000); },
        next => { console.log('2 seconds'); }
      ]) */
    return chainAsync(fns)
  },
  abs(val, parseInt) {
    if (val == '--') {
      return '--'
    }
    let num = false;
    num = parseInt ? num = parseInt : false;
    if (val == null) {
      return 0
    }
    if (val * 1) {
      val = val * 1
    } else {
      return parseFloat(val).toFixed(2)
    }
    // 金额转换 元 保留2位小数 并每隔3位用逗号分开 1,234.56
    let str = (val).toFixed(2) + '';
    let intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); // 取到整数部分
    let dot = str.substring(str.length, str.indexOf(".")); // 取到小数部分搜索
    if (!!!num) {
      return intSum
    }
    return (intSum + dot);
  },
  amountAbs(val) {
    if (val == null || val == '--') {
      return '--'
    } else if (val == 0) {
      return 0;
    } else {
      return this.abs(val, false);
    }
  },
  download(url, name) {
    // let urlName = name;
    // urlName = name ? urlName = name : url;
    let linkA = document.createElement('a');
    // linkA.setAttribute('target', '_blank');
    linkA.setAttribute('href', url);
    linkA.setAttribute('id', url);
    linkA.setAttribute('download', name);
    if (!document.getElementById(url)) {
      document.body.appendChild(linkA)
    }
    linkA.click();
    setTimeout(() => {
      linkA.parentNode.removeChild(linkA)
    }, 300);
  },
  //
  // 日期换算成时间戳 13位
  getTimestamps(date) {
    if (date == '' || date == null) {
      return ''
    }
    date = new Date(Date.parse(date.replace(/-/g, '/')))
    return (date.getTime())
  },
  //
  // urlEncode
  urlEncode(param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
      for (let i in param) {
        let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        paramStr += urlEncode(param[i], k, encode)
      }
    }
    //
    return paramStr
    //
  },
  //
  setMarket(data) {
    let tmp = data;
    tmp.forEach((item) => {
      if (item.treeNodeValue.indexOf('沪市') > -1) {
        item.treeNodeValue = item.treeNodeValue.replace('沪市', '沪')
      }
      if (item.treeNodeValue.indexOf('深市主板') > -1) {
        item.treeNodeValue = item.treeNodeValue.replace('深市', '深')
      }
      if (item.treeNodeValue.indexOf('深市') > -1 && item.treeNodeValue != '深市主板') {
        item.treeNodeValue = item.treeNodeValue.replace('深市', '')
      }
    })
    return tmp.map((item) => {
      return item.treeNodeValue
    }).join('&nbsp;/&nbsp;')
  },

  uniqueObj(val, key) {
    var result = [];
    var obj = {};
    for (let i = 0; i < val.length; i++) {
      if (!obj[val[i][key]]) {
        result.push(val[i]);
        obj[val[i][key]] = true;
      }
    }
    //
    return result
  }
}
