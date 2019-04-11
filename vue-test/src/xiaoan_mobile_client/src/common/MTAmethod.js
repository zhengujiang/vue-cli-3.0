export default {
  // mta 点击统计
  mtaClick: function (str, obj) {
    if (process.env.NODE_ENV === 'product') {
      if (obj) {
        MtaH5.clickStat(str, obj);
      } else {
        MtaH5.clickStat(str);
      }
    }
  },
  // mta 分享统计
  mtaShare: function (str, obj) {
    if (process.env.NODE_ENV === 'product') {
      if (obj) {
        MtaH5.clickShare(str, obj);
      } else {
        MtaH5.clickShare(str);
      }
    }
  }
}
