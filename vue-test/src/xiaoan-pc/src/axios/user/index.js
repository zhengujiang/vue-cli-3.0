import Axios from "@/service/http";
import api from '@/service/api/index'

export default {
  updateSynopsisByUserId(params) {
    return Axios({method: 'POST', url: api.user.updateSynopsisByUserId, params: params})
  },
  // 查看用户资料
  searchUserData(params) {
    return Axios({method: 'GET', url: api.user.searchUserData, params: params})
  },
  // 删除收藏内容
  delCollectList(params) {
    return Axios({method: 'GET', url: api.user.delCollectList, params: params})
  },
  // 删除收藏夹
  delCollect(params) {
    return Axios({method: 'GET', url: api.user.delCollect, params: params})
  },
  // 新建收藏夹
  addCollect(params) {
    return Axios({method: 'GET', url: api.user.addCollect, params: params})
  },
  // 已收藏的id
  alreadyCollect(params) {
    return Axios({method: 'GET', url: api.user.alreadyCollect, params: params})
  },
  // 获取收藏夹内容
  getCollectContent(params) {
    return Axios({method: 'GET', url: api.user.getCollectContent, params: params})
  },
  // 添加收藏内容
  addCollectList(params) {
    return Axios({method: 'GET', url: api.user.addCollectList, params: params})
  },
  // 获取默认收藏夹内容
  getDefaultContent(params) {
    return Axios({method: 'GET', url: api.user.getDefaultContent, params: params})
  },
   // 获取订阅收藏夹列表
  subscribeList(params) {
    return Axios({method: 'GET', url: api.user.subscribeList, params: params})
  },
  // 获取订阅收藏夹信息
  subscribeContent(params) {
    return Axios({method: 'GET', url: api.user.subscribeContent, params: params})
  },
  // 订阅推荐收藏夹
  subscribeRecommend(params) {
    return Axios({method: 'GET', url: api.user.subscribeRecommend, params: params})
  },
    // 获取推荐收藏夹列表
  getAllRecommendDetailsOrderByDate(params) {
    return Axios({method: 'GET', url: api.user.getAllRecommendDetailsOrderByDate, params: params})
  },
    // 获取推荐收藏夹列表
  getRecommendCollectFavoriteAll(params) {
    return Axios({method: 'GET', url: api.user.getRecommendCollectFavoriteAll, params: params})
  },
  // 获取推荐收藏夹列表
  getRecommendCollect(params) {
    return Axios({method: 'GET', url: api.user.getRecommendCollect, params: params})
  },
  // 取消订阅用户收藏的推荐收藏夹
  cancelRecommend(params) {
    return Axios({method: 'GET', url: api.user.cancelRecommend, params: params})
  },
    // 获取用户收藏的推荐收藏夹
  getRecommend(params) {
    return Axios({method: 'GET', url: api.user.getRecommend, params: params})
  },
  // 取消订阅收藏夹
  cancelSubscribe(params) {
    return Axios({method: 'GET', url: api.user.cancelSubscribe, params: params})
  },
  // 获取用户订阅信息
  getMySubscribe(params) {
    return Axios({method: 'GET', url: api.user.getMySubscribe, params: params})
  },
  // 获取用户收藏夹信息
  getMyCollect(params) {
    return Axios({method: 'GET', url: api.user.getMyCollect, params: params})
  },
  // 编辑收藏夹
  updatefavouritename(params) {
    return Axios({method: 'POST', url: api.user.updatefavouritename, params: params})
  },
  // 收藏夹分享，取消分享
  shareswitch(params) {
    return Axios({method: 'GET', url: api.user.shareswitch, params: params})
  },
  // 根据id获取收藏夹
  getfavouritebyid(params) {
    return Axios({method: 'POST', url: api.user.getfavouritebyid, params: params})
  },
  // 根据userId删除用户足迹
  delTrack(params) {
    return Axios({method: 'POST', url: api.user.delTrack, params: params})
  },
  // 添加收藏夹
  addfavourite(params) {
    return Axios({method: 'POST', url: api.user.addfavourite, params: params})
  },
  // 根据userId获取用户足迹
  getTrack(params) {
    return Axios({method: 'GET', url: api.user.getTrack, params: params})
  },
    // 修改绑定手机号
  bindmobile(params) {
    return Axios({method: 'POST', url: api.user.bindmobile, params: params})
  },
  // 补全用户信息
  completePersonInfo(params) {
    return Axios({method: 'POST', url: api.user.completePersonInfo, params: params})
  },
  // 获取用户职位
  getPosition(params) {
    return Axios({method: 'GET', url: api.user.getPosition, params: params})
  },
  // 根据股票代码获取公司名称
  getStockCode(params) {
    return Axios({method: 'GET', url: api.user.getStockCode, params: params})
  },
    // 登录
  login(params) {
    return Axios({method: 'POST', url: api.user.login, params: params})
  },
    // 快捷登录
  quikeLogin(params) {
    return Axios({method: 'POST', url: api.user.quikeLogin, params: params})
  },
  autologin(params) {
    return Axios({method: 'POST', url: api.user.autologin, params: params})
  },
  // 扫码登录，绑定用户
  loginbyqrcode(params) {
    return Axios({method: 'POST', url: api.user.loginbyqrcode, params: params})
  },
  // 微信解绑和绑定
  qrBindWeixinByUser(params) {
    return Axios({method: 'POST', url: api.user.qrBindWeixinByUser, params: params})
  },
  // 手机号是否注册
  checkmobileexist(params) {
    return Axios({method: 'GET', url: api.user.checkmobileexist, params: params})
  },
  // 手机号是否已绑定微信
  checkMobileBindWeixin(params) {
    return Axios({method: 'GET', url: api.user.checkMobileBindWeixin, params: params})
  },
  // 发送验证码
  sendsmscode(params) {
    return Axios({method: 'GET', url: api.user.sendsmscode, params: params})
  },
  // 发送验证码 v1
  sendsmscodev1(params) {
    return Axios({method: 'GET', url: api.user.sendsmscodev1, params: params})
  },
  // 扫码后，填写手机号，绑定微信
  binduserafterqrscan(params) {
    return Axios({method: 'POST', url: api.user.binduserafterqrscan, params: params})
  },
  // 重新绑定微信
  changeweixinafterqrscan(params) {
    return Axios({method: 'POST', url: api.user.changeweixinafterqrscan, params: params})
  },
  // 手机号登录后，未绑定微信号，扫码直接绑定
  qrcsanbinduserafterlogin(params) {
    return Axios({method: 'POST', url: api.user.qrcsanbinduserafterlogin, params: params})
  },
  // 手机号注册
  mobileregister(params) {
    return Axios({method: 'POST', url: api.user.mobileregister, params: params})
  },
  // post 手动退出登录
  logout(params) {
    return Axios({method: 'POST', url: api.user.logout, params: params})
  },
  imageCode(params) {
    return Axios({method: 'GET', url: api.user.imageCode, params: params})
  },
  imgcodecheck(params) {
    return Axios({method: 'GET', url: api.user.imgcodecheck, params: params})
  },
  // 获取用户信息
  getMyInfo(params) {
    return Axios({method: 'GET', url: api.user.getMyInfo, params: params})
  },
  // 修改密码
  modifyloginpassword(params) {
    return Axios({method: 'POST', url: api.user.modifyloginpassword, params: params})
  },
  // 找回密码
  findloginpassword(params) {
    return Axios({method: 'POST', url: api.user.findloginpassword, params: params})
  },
  // 修改邮箱
  updateemail(params) {
    return Axios({method: 'GET', url: api.user.updateemail, params: params})
  },
  // 获取用户公司类型
  getCompanyinfo(params) {
    return Axios({method: 'GET', url: api.user.getCompanyinfo, params: params})
  }
}
