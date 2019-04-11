/**todo
 * @type "正则"
 *
 **/
export default {
  // 手机号码验证
  mobile: function (mobile) {
    // let regExp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
    let regExp = /^(0|86|17951)?(1[3-9])[0-9]{9}$/;
    return regExp.test(mobile);
  },
  // 邮箱验证合法
  email: function (email) {
    let regExp = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    return regExp.test(email);
  },
  // 根据中英文判断字符长度
  charCode: function (str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128)
        realLength += 1;
      else
        realLength += 2;
    }
    return realLength;
  },
  // 判断是否是数字
  number(text) {
    if (text == '' || text == null || text == undefined) {
      return ''
    }
    var value = text.replace(/[^0-9]/ig, "");
    return value;
  },
  // 判断手机号
  isPoneAvailable(str) {
    if (str != '') {
      let myreg = /^[1][0-9]{10}$/;
      if (!myreg.test(str)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
