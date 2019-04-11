/**
 * @name 'Evans'
 * **/
import Api from '@/service/api'
import Cookie from '../common/cookie'

export default {
  // 处理异常 老的路由
  guidanceOldFormRoute(path) {
    let to_path = path;
    switch (path) {
      case '/search':
        to_path = '/rule/search';
        break;
      case '/rulesCount':
        to_path = '/rule/details';
        break;
      case '/ruleslist':
        to_path = '/rule/list';
        break;
      case '/newrules':
        to_path = '/rule/new';
        break;
      // 公告路由引导
      case '/afficheContent':
        to_path = '/affiche/details';
        break;
      case '/newAffiche':
        to_path = '/affiche/new';
        break;
      case '/afficheSearch':
        to_path = '/affiche/search';
        break;
      case '/searchList':
        to_path = '/affiche/list';
        break;
      case '/afficheList':
        to_path = '/affiche/company';
        break;
      // 研报 路由引导
      case '/detailReport':
        to_path = '/report/details';
        break;
      case '/searchReport':
        to_path = '/report/search';
        break;
      case '/listReport':
        to_path = '/report/list';
        break;
      // 个人中心 路由引导
      case '/my':
        to_path = '/home';
        break;
      // 个人中心 路由引导
      case '/number':
        to_path = '/login';
        break;
    }
    //
    return to_path
    //
  },
  // 处理到PC 双向对接
  guidanceOldFormPCRoute(to) {
    let to_url = `${Api.pcUrl}/index`;
    switch (to.path) {
      case 'rule':
        to_url = `${Api.pcUrl}/index`
        break;
      case '/rule/details':
        to_url = `${Api.pcUrl}${to.fullPath}`
        break;
      case '/affiche/details':
        to_url = `${Api.pcUrl}${to.fullPath}`
        break;
      case '/report/details':
        to_url = `${Api.pcUrl}${to.fullPath}`
        break;
      case '/ipo/details':
        to_url = `${Api.pcUrl}${to.fullPath}`
        break;
      // 默认引导
      default:
        to_url = `${Api.pcUrl}${to.fullPath}`
        break
    }
    return to_url
  },
  // 处理上传到
  guidanceIsLoginRoute(to) {
    let to_url = '';
    switch (to.meta.isLogin) {
      case 0:
        // 不需要登陆
        to_url = '';
        break;
      case 1:
        if (Cookie.isLogin()) {
          to_url = ''
        } else {
          // 跳转到登陆
          window.sessionStorage.setItem("refer_title", to.meta.title);
          window.sessionStorage.setItem("refer_url", `${location.origin}/#${to.fullPath}`);
          to_url = '/login';
        }
        break;
      case 2:
        // 在登陆流程里
        to_url = '';
        break;
      case true:
        // 之前 竞赛设置
        to_url = '';
        break;
    }
    //
    return to_url
  }
}
