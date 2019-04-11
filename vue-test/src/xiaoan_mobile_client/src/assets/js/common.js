/**
 * todo
 * @wx // dev testing pre
 * **/
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'testing') {
  console.warn('测试环境');
} else {
  console.warn('正式环境特殊引入加载成功');
  //js
  var _mtac = {};
  (function () {
    var mta = document.createElement("script");
    mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
    mta.setAttribute("name", "MTAH5");
    mta.setAttribute("sid", "500478892");
    mta.setAttribute("cid", "500478902");
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(mta, s);
  })();
}
