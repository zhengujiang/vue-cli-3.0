const rTelphone = /^(13|14|15|16|17|18|19)[0-9]{9}$/
const rImgCode = /^\d{4}$/
const rPassword = /^[a-zA-Z\d~!@#$%^&*_]{6,20}$/
const rBlank = /^\s*$/
const rmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
const regx = {
  _tel: rTelphone,
  _img: rImgCode,
  _pwd: rPassword,
  _blank: rBlank,
  _mail: rmail,
  telphone(val) {
    if (val != null) {
      val += ''
      return rTelphone.test(val)
    }
    return false
  },
  imgCode(val) {
    if (val != null) {
      val += ''
      return rImgCode.test(val)
    }
  },
  password(val) {
    if (val != null) {
      val += ''
      return rPassword.test(val)
    }
  },
  blank(val) {
      return rBlank.test(val)
  },
  mail(val) {
    if (val != null) {
      val += ''
      return rmail.test(val)
    }
  }
}

export default regx
