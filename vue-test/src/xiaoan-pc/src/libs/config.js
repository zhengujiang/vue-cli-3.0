/**
 * @name 'Evans'
 * **/
import Api from '@/service/api'
import QS from 'qs'

export default {
  // 处理异常 老的路由
  guidanceOldFormRoute(path) {
    let to_path = path;
    switch (path) {
      case '/rules':
        to_path = '/rule';
        break;
      case '/ruleDetail':
        to_path = '/rule/details';
        break;
      case '/afficheContent':
        to_path = '/affiche/details';
        break;
      case '/cases':
        to_path = '/case';
        break;
      case '/caseDetail':
        to_path = '/case/details';
        break;
      case '/reportDetail':
        to_path = '/report/details';
        break;
      default:
        to_path = path;
        break;
    }
    //
    return to_path
    //
  },
  // 处理到mobile 双向对接
  guidanceOldFormMobileRoute(to) {
    let to_url = '/rule';
    switch (to.path) {
      case '/index':
        to_url = '/rule';
        break;
      default:
        to_url = to.fullPath
        break
    }
    return `${Api.mobileHost}#${to_url}`
    //
    //
    // if (to.path === '/index') {
    //   location.href = Api.share.index
    // } else if (to.path === '/rule') {
    //   location.href = Api.share.rule
    // } else if (to.path === '/affiche') {
    //   location.href = Api.share.affiche
    // } else if (to.path === '/case') {
    //   location.href = Api.share.cases
    // } else if (to.path === '/report') {
    //   location.href = Api.share.report
    // } else if (to.path === '/rule/details') {
    //   location.href = Api.share.ruleDetail + to.query.id
    // } else if (to.path === '/affiche/details') {
    //   location.href = Api.share.afficheDetail + to.query.id
    // } else if (to.path === '/case/details') {
    //   location.href = Api.share.caseDetail + to.query.id
    // } else if (to.path === '/detailReport') {
    //   location.href = Api.share.detailReport + to.query.id
    // } else if (to.path === '/collect/collectDetails') {
    //   location.href = Api.share.collectDetails + to.query.id
    // } else if (to.path === '/competition/home') {
    //   location.href = `${Api.mobileHost}#${to.fullPath}`
    // } else if (to.path === '/competition/call') {
    //   location.href = `${Api.mobileHost}#${to.fullPath}`
    // } else if (to.path === '/competition/activityAnswer') {
    //   location.href = `${Api.mobileHost}#/competition/friendTesting?id=${to.query.questionId}`
    // } else {
    //   location.href = Api.share.index
    // }
  }
}
